# 🚀 CourseCraft - AI Course Builder

CourseCraft is a modern, full-stack educational platform that allows anyone to generate highly structured, detailed course curriculums in seconds using the power of Google's Gemini AI. 

Whether you want to generate a course from a simple text topic or by having the AI scan a massive PDF document, CourseCraft handles the heavy lifting of curriculum design for you.

## ✨ Features
- **AI-Powered Curriculum Generation:** Powered by Google Gemini 1.5 Flash.
- **PDF Scanning Integration:** Upload textbook chapters or manuals and have the AI generate a course based entirely on your proprietary documents.
- **Rich User Authentication:** Secure login, signup, and session management powered by Clerk.
- **Serverless PostgreSQL:** Lightning-fast, highly scalable relational database powered by Neon DB and Drizzle ORM.
- **Zero-Backend Image Uploads:** Blazing fast course banner uploads powered by Cloudinary widgets.
- **Interactive Dashboard:** Manage your published courses and drafts in a beautiful, responsive UI.

## 🛠️ Tech Stack
- **Frontend & Backend:** Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Authentication:** Clerk
- **Database:** Neon (Serverless PostgreSQL)
- **ORM:** Drizzle ORM
- **AI Model:** Google Gemini API
- **Media Storage:** Cloudinary

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/course-craft.git
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

   # Neon Database
   DATABASE_URL=

   # Google Gemini API
   GEMINI_API_KEY=

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   ```
4. Push the database schema to Neon
   ```bash
   npx drizzle-kit push
   ```
5. Start the development server
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` to view the app!

