# INDLink - Phase 1

This repository contains Phase 1 of INDLink, a modern SaaS Link-in-Bio platform.

## Features Implemented in Phase 1

*   **Next.js 15 App Router** setup with TypeScript.
*   **Tailwind CSS & Shadcn UI** configuration.
*   **Prisma ORM** schema for MySQL.
*   **Auth.js (NextAuth)** setup with Credentials, Google, and GitHub providers.
*   **Landing Page** with a stunning SaaS design.
*   **Dashboard UI Shell** with layout, sidebar, and overview page.
*   **Route Protection** using Next.js Middleware.

## Setup Instructions

Since you are running this in a new environment, make sure you have Node.js (v18+) and npm installed.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in your actual values (especially `DATABASE_URL` and `NEXTAUTH_SECRET`).
    ```bash
    cp .env.example .env
    ```

3.  **Database Setup**
    Push the Prisma schema to your MySQL database:
    ```bash
    npx prisma db push
    ```

## Run Instructions

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build Instructions

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```
