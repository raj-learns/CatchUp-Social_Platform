import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Initialize Express app and Prisma Client
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { username, password, phone, name, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        phone,
        name,
        email
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});


// --- CONTENT ROUTES ---

// == POSTS ==

// GET /api/posts - Fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        _count: { select: { comments: true, claps: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong fetching posts' });
  }
});

// POST /api/posts - Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required.' });
    }
    const newPost = await prisma.post.create({
      data: { title, content, authorId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong creating the post' });
  }
});

// GET /api/posts/:id - Fetch a single post by its ID
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
        _count: { select: { claps: true } },
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong fetching the post' });
  }
});

// DELETE /api/posts/:id - Delete a post
// NOTE: In a real app, you would add authentication middleware to ensure
// only the post's author can delete it.
app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ error: 'Something went wrong deleting the post.' });
    }
});


// == CLAPS ==

// POST /api/posts/:id/clap - Add a clap to a post
app.post('/api/posts/:id/clap', async (req, res) => {
  const { id } = req.params;
  try {
    const newClap = await prisma.clap.create({
      data: { postId: id },
    });
    res.status(201).json(newClap);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong clapping for the post' });
  }
});

// == COMMENTS ==

// POST /api/posts/:id/comments - Add a comment to a post
app.post('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { text, authorId } = req.body;
  try {
    if (!text || !authorId) {
      return res.status(400).json({ error: 'Text and authorId are required.' });
    }
    const newComment = await prisma.comment.create({
      data: { text, authorId, postId: id },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong adding the comment' });
  }
});

// DELETE /api/comments/:id - Delete a comment
// NOTE: In a real app, you would add authentication here as well.
app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.comment.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error("Delete comment error:", error);
        res.status(500).json({ error: 'Something went wrong deleting the comment.' });
    }
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
