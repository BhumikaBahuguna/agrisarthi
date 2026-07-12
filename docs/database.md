# Database Architecture

AgriSarthi uses PostgreSQL hosted on **Supabase** for persistent data storage. We use **Prisma ORM** for database interaction, schema management, and migrations.

## Why PostgreSQL & Supabase?
- **Relational Integrity**: As a structured crop management system, strict typings and schemas ensure accurate reports.
- **Supabase**: Offers excellent Postgres hosting with built-in connection pooling via Supavisor, which is ideal for serverless or edge environments.
- **Prisma**: Provides a typesafe client and simplified migration workflow compared to raw SQL or other ORMs.

## Schema Overview

The database schema includes user authentication and user-scoped crop cycle management.

### `User` Model

Represents registered farmers and portal users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String (UUID)` | Primary Key |
| `email` | `String` | Unique email for credentials login |
| `password` | `String?` | Hashed password (bcrypt), nullable for OAuth accounts |
| `name` | `String?` | User display name |
| `googleId` | `String?` | Unique sub key for Google OAuth |
| `githubId` | `String?` | Unique ID key for GitHub OAuth |
| `createdAt` | `DateTime` | Auto-generated registration timestamp |
| `updatedAt` | `DateTime` | Auto-generated timestamp |

### `Crop` Model

Represents crop timelines, associated with the creating user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String (UUID)` | Primary Key |
| `name` | `String` | e.g. Wheat, Basmati Rice |
| `variety` | `String` | e.g. Kalyan Sona |
| `type` | `String` | e.g. Grain, Vegetable |
| `status` | `String` | Planned, Planted, Growing, Harvested |
| `plantedDate` | `DateTime?` | Optional planting date |
| `expectedHarvestDate` | `DateTime?` | Optional harvest date |
| `fieldArea` | `Float` | Acreage |
| `userId` | `String?` | Foreign key referencing `User.id` (Nullable for shared/legacy crops) |
| `createdAt` | `DateTime` | Auto-generated timestamp |
| `updatedAt` | `DateTime` | Auto-generated timestamp |

### Relationships

- **User 1 ── 0..* Crop**: A `User` can own multiple `Crop` cycles. Deleting a User cascade-deletes their associated Crops.

## Prisma Workflow

Whenever you change the `backend/prisma/schema.prisma` file, follow these steps:

1. **Format Schema**: `npx prisma format`
2. **Generate Migration**: `npx prisma migrate dev --name <descriptive_name>` (Applies changes to the DB)
3. **Generate Client**: `npx prisma generate` (Updates the Node.js Prisma Client)

*Note: Ensure both `DATABASE_URL` and `DIRECT_URL` are correctly set in the `.env` file before running migrations.*
