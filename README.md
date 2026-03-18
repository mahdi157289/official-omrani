# Makroudh Omrani E-commerce Platform

A modern, full-stack e-commerce platform for Makroudh Omrani - transforming a traditional Tunisian pastry shop into a digital storefront.

## Features

- Multi-language support (Arabic RTL, French, English)
- Guest checkout with automatic account creation
- Real-time admin CMS with Payload
- Analytics dashboard
- Delivery zone management
- Product variants (weight-based pricing)
- Order tracking and management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Payload CMS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Media**: Cloudinary
- **i18n**: next-intl

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudinary account
- Resend account (for emails)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `CLOUDINARY_*` - Cloudinary credentials
- `RESEND_API_KEY` - Resend API key

3. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── admin/             # Payload CMS admin
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema and migrations
├── payload/               # Payload CMS configuration
└── messages/              # i18n translation files
```

## Database Schema

The database includes models for:
- Users (with guest checkout support)
- Products & Product Variants
- Categories (hierarchical)
- Orders & Order Items
- Addresses
- Reviews & Wishlist
- Events & Promotions
- Delivery Zones
- Analytics (PageViews, ActivityLogs)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open Prisma Studio

## License

Private - Makroudh Omrani







