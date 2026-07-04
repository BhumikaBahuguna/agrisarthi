# AgriSarthi

AgriSarthi is a React + Tailwind CSS frontend skeleton for an AI-powered smart agriculture management platform, upgraded to include a full database-driven backend.

## Database Choice

We have migrated to **PostgreSQL** hosted on **Supabase**, integrated via **Prisma ORM**.
- **PostgreSQL**: Strong relational constraints for crop data integrity.
- **Supabase**: Excellent serverless Postgres hosting with native connection pooling, which resolves common exhaustion issues.
- **Prisma ORM**: Type-safe queries, predictable migrations, and an intuitive client model that replaces raw SQL.

## Schema Diagram

```mermaid
erDiagram
    Crop {
        String id PK
        String name
        String variety
        String type
        String status
        DateTime plantedDate "Nullable"
        DateTime expectedHarvestDate "Nullable"
        Float fieldArea
        DateTime createdAt
        DateTime updatedAt
    }
```

## Installation Commands

```bash
npm install
npm run dev
```

## Backend Server Setup

The backend server is built with Node.js, Express.js, and Prisma. It provides REST API endpoints to manage crop cycles with persistent storage in PostgreSQL.

### Environment Variables
Create a `.env` file inside the `/backend` directory based on the `.env.example`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Installation and Launch
Open a new terminal window and run:
```bash
# Navigate to backend and install dependencies
cd backend
npm install

# Generate Prisma Client
npx prisma generate

# Apply migrations to your database (requires valid DATABASE_URL/DIRECT_URL)
npx prisma migrate dev --name init

# Start the server in development mode (using nodemon)
npm run dev
```
The server will start listening at `http://localhost:5000`. CORS is preconfigured to permit connection queries from your frontend at `http://localhost:5173`.


## Tailwind Setup

Tailwind CSS is configured through `tailwind.config.js`, `postcss.config.js`, and `src/index.css`.

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Folder Structure

```text
backend/
  prisma/
    schema.prisma
  routes/
    crops.js
  server.js
  .env.example
src/
  components/
  pages/
  App.jsx
  main.jsx
  index.css
docs/
  database.md
```

## Routes

- `/`
- `/about`
- `/dashboard`
- `/login`

## Suggested Git Commit Sequence

```bash
git add .
git commit -m "chore: setup react vite project with tailwind"

git add .
git commit -m "feat: migrate backend to PostgreSQL and Prisma"

git add .
git commit -m "docs: add database documentation and ER diagram"
```

## Verification Checklist

- Data persists after refresh and server restart.
- Create, Read, Update, Delete operations are functional.
- Prisma migration generates correctly.
- Invalid data is correctly handled and rejected.
- Layout remains fully functional without any UI regressions.
- `.env.example` provides Supabase templates.
