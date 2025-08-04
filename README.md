# CatchUp-Social_Platform
A Full-Stack Social Media App
This is a complete social media platform built from the ground up, featuring user authentication, post creation, comments, and claps. This project serves as a comprehensive example of a modern full-stack application using a decoupled frontend and backend architecture.

✨ Features
User Authentication: Secure user registration and login using username and password.

Create & View Posts: Logged-in users can create new posts with a title and content. All posts are displayed on a central community feed.

Clapping: Users can "clap" for posts multiple times to show appreciation, both on the main feed and on the single post page.

Commenting: Users can view and add comments on a dedicated page for each post.

Delete Content: Users have full control to delete their own posts and comments.

🛠️ Technology Stack
Frontend:

Next.js (v14 with Pages Router)

React

Tailwind CSS

NextAuth.js (for session management)

Backend:

Node.js

Express.js

Prisma (as the ORM for database interaction)

bcrypt (for password hashing)

Database:

PostgreSQL

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

npm

A PostgreSQL database connection string

Installation & Setup
Clone the repository:

git clone https://github.com/raj-learns/CatchUp-Social_Platform.git
cd CatchUp-Social_Platform

Setup the Backend:

cd backend
npm install

Create a .env file in the backend directory.

Add your DATABASE_URL to the .env file:

DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"

Run the database migration to create the tables:

npx prisma migrate dev

Start the backend server:

npm start

The backend will be running on http://localhost:3001.

Setup the Frontend:

Open a new terminal.

cd frontend
npm install

Create a .env.local file in the frontend directory.

Add the following environment variables:

NEXTAUTH_SECRET=generate-a-random-secret-string
NEXTAUTH_URL=http://localhost:3000

Start the frontend development server:

npm run dev

The frontend will be running on http://localhost:3000.

Now you can open http://localhost:3000 in your browser and use the application!
