# Database Architecture

AgriSarthi uses PostgreSQL hosted on **Supabase** for persistent data storage. We use **Prisma ORM** for database interaction, schema management, and migrations.

## Why PostgreSQL & Supabase?
- **Relational Integrity**: As a structured crop management system, strict typings and schemas ensure accurate reports.
- **Supabase**: Offers excellent Postgres hosting with built-in connection pooling via Supavisor, which is ideal for serverless or edge environments.
- **Prisma**: Provides a typesafe client and simplified migration workflow compared to raw SQL or other ORMs.

## Schema Overview

The database schema is minimal and focused exclusively on the active entities needed for the frontend. Unused models (like User or Product) were omitted to adhere to YAGNI principles and avoid breaking existing functionality.

### `Crop` Model

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
| `createdAt` | `DateTime` | Auto-generated timestamp |
| `updatedAt` | `DateTime` | Auto-generated timestamp |

## Prisma Workflow

Whenever you change the `backend/prisma/schema.prisma` file, follow these steps:

1. **Format Schema**: `npx prisma format`
2. **Generate Migration**: `npx prisma migrate dev --name <descriptive_name>` (Applies changes to the DB)
3. **Generate Client**: `npx prisma generate` (Updates the Node.js Prisma Client)

*Note: Ensure both `DATABASE_URL` and `DIRECT_URL` are correctly set in the `.env` file before running migrations.*
