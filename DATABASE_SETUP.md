# Database Setup Guide

This guide will help you set up the database and seed it with sample data.

## Prerequisites

- PostgreSQL database installed and running
- Node.js and npm installed

## Step 1: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/makroudh_omrani?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
```

**Note**: Replace `user`, `password`, and `makroudh_omrani` with your actual PostgreSQL credentials and database name.

## Step 2: Generate Prisma Client

```bash
npm run db:generate
```

This command generates the Prisma Client based on your schema.

## Step 3: Create Database Tables

You have two options:

### Option A: Push Schema (Development - Quick)
```bash
npm run db:push
```

This will create/update tables directly without creating migration files. Use this for development.

### Option B: Create Migration (Production - Recommended)
```bash
npm run db:migrate
```

This creates a migration file and applies it. Use this for production or when you want to track schema changes.

## Step 4: Seed the Database

Run the seed script to populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- 1 Category (Makroudh)
- 4 Products (Classic, Date, Almond, Honey Makroudh)
- Product images (using Unsplash URLs)
- Product variants (500g and 1kg options)
- Site configuration

## Step 5: Verify the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the shop page:
   - English: http://localhost:3001/en/shop
   - Arabic: http://localhost:3001/ar/shop
   - French: http://localhost:3001/fr/shop

3. You should see 4 products displayed.

## Troubleshooting

### Database Connection Error

If you get a connection error:
- Verify PostgreSQL is running
- Check your `DATABASE_URL` in `.env.local`
- Ensure the database exists (create it if needed: `CREATE DATABASE makroudh_omrani;`)

### Prisma Client Not Generated

If you see errors about Prisma Client:
```bash
npm run db:generate
```

### Seed Script Errors

If the seed script fails:
- Make sure the database tables are created first (`npm run db:push` or `npm run db:migrate`)
- Check that all required fields are provided in the seed data
- Review the console output for specific error messages

## Database Management

### View Database in Browser

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and edit your data.

### Reset Database (⚠️ Deletes all data)

```bash
# Reset and reseed
npx prisma migrate reset
npm run db:seed
```

## Next Steps

After seeding:
- Products should appear on the shop page
- Product detail pages should work
- You can test the cart and checkout flow
- Admin features can be set up next





