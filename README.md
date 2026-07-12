# AgriSarthi

AgriSarthi is a React + Tailwind CSS smart agriculture management platform, upgraded with persistent PostgreSQL database layers, secure user authentication (JWT), and OAuth sign-in credentials.

## Database Choice

We have migrated to **PostgreSQL** hosted on **Supabase**, integrated via **Prisma ORM**.
- **PostgreSQL**: Strong relational constraints for crop data integrity.
- **Supabase**: Excellent serverless Postgres hosting with native connection pooling, which resolves common exhaustion issues.
- **Prisma ORM**: Type-safe queries, predictable migrations, and an intuitive client model that replaces raw SQL.

## Schema Diagram

```mermaid
erDiagram
    User {
        String id PK
        String email
        String password "Nullable"
        String name "Nullable"
        String googleId "Nullable"
        String githubId "Nullable"
        DateTime createdAt
        DateTime updatedAt
    }
    Crop {
        String id PK
        String name
        String variety
        String type
        String status
        DateTime plantedDate "Nullable"
        DateTime expectedHarvestDate "Nullable"
        Float fieldArea
        String userId FK "Nullable"
        DateTime createdAt
        DateTime updatedAt
    }
    User ||--o{ Crop : owns
```

## Installation Commands

```bash
npm install
npm run dev
```

## Backend Server Setup

The backend server is built with Node.js, Express.js, and Prisma. It provides REST API endpoints to manage crop cycles with persistent storage in PostgreSQL and user authorization.

### Environment Variables
Create a `.env` file inside the `/backend` directory based on the `.env.example`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# JWT authentication secret
JWT_SECRET="your_jwt_secret_here"

# OAuth Credentials (optional, mock fallback consent runs if empty)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
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
npx prisma migrate dev --name auth_setup

# Start the server in development mode (using nodemon)
npm run dev
```
The server will start listening at `http://localhost:5000`. CORS is preconfigured to permit connection queries from your frontend at `http://localhost:5173`.

---

## Authentication & Security Features (Week 6)

1. **User Registration with bcrypt**: Registration validates request bodies with Zod, hashes passwords using 12 salt rounds, and handles duplicate email collisions.
2. **User Login with JWT**: Generates cryptographically signed JWT tokens with a 7-day expiration period.
3. **Protected API Routes**: Backend middleware `requireAuth` inspects JWTs from authorization headers and restricts crops queries to owned entities.
4. **Protected Frontend Routes**: Route guards restrict `/dashboard` and `/profile` to authenticated users.
5. **OAuth Login (Google & GitHub)**: Integrated one-click OAuth login routes (`/api/auth/google`, `/api/auth/github`) that gracefully fall back to sandbox mock consent screens if environment keys are empty.
6. **Rate Limiting & Security**: Enforces rate limiting (max 5 authentication attempts per 15 minutes) on registration and login endpoints, returning HTTP 429 errors.

---

## Folder Structure

```text
backend/
  prisma/
    schema.prisma
  routes/
    auth.js
    crops.js
  middleware/
    auth.js
  server.js
  .env.example
src/
  components/
    ProtectedRoute.jsx
    Navbar.jsx
  context/
    AuthContext.jsx
  pages/
    Home.jsx
    About.jsx
    Dashboard.jsx
    Login.jsx
    Profile.jsx
docs/
  database.md
```

## Suggested Git Commit Sequence

```bash
git add .
git commit -m "feat: implement bcrypt registration, JWT login, and requireAuth route guards"

git add .
git commit -m "feat: add Google/GitHub OAuth logins with mock consent screen fallbacks"

git add .
git commit -m "feat: add express-rate-limiting and Zod validation parameters"

git add .
git commit -m "docs: update database schema layout and authentication instructions"
```
