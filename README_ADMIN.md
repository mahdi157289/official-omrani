# Admin Interface - Quick Start

## 🚀 Quick Access

1. **Start the server**: `npm run dev`
2. **Navigate to**: `http://localhost:3001/admin/login`
3. **Login with**:
   - Email: `admin@makroudhomrani.tn`
   - Password: `admin123`

## 📋 What's Available

### ✅ Completed Features

1. **Authentication**
   - Login page with credentials
   - Session management
   - Role-based access (ADMIN/EDITOR only)

2. **Dashboard** (`/admin`)
   - Statistics overview
   - Active products count
   - Total orders count
   - Revenue summary
   - Customer count

3. **Products Management** (`/admin/products`)
   - View all products in table
   - See product details (image, name, price, stock, status)
   - Add/Edit/Delete buttons (UI ready)

4. **Orders Management** (`/admin/orders`)
   - View all orders
   - Order details (customer, items, total, status, date)
   - View individual order (link ready)

5. **Media Library** (`/admin/media`)
   - Upload new images
   - View all media files in grid
   - Delete media files (UI ready)

6. **Settings** (`/admin/settings`)
   - Placeholder page (ready for configuration)

## 🖼️ Media Integration

- **Local Media Files**: All your media files from `media/` folder are now integrated
- **Static Serving**: Files are served from `public/media/`
- **Database References**: Media files are referenced in the database
- **Upload Functionality**: You can upload new images via the admin interface

## 🔐 Security

- All admin routes require authentication
- Only users with `ADMIN` or `EDITOR` roles can access
- Passwords are hashed with bcrypt
- Sessions managed via NextAuth.js

## 📝 Next Steps

To fully utilize the admin interface:

1. **Set up database** (if not done):
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

2. **Create admin user** (if seed didn't run):
   - The seed script creates: `admin@makroudhomrani.tn` / `admin123`
   - Or create manually via Prisma Studio: `npm run db:studio`

3. **Access admin panel**:
   - Go to `/admin/login`
   - Login with admin credentials
   - Start managing your content!

## 🎨 Features to Enhance (Future)

- Complete product add/edit forms
- Order detail view page
- Analytics charts
- Bulk media operations
- User management
- Site settings configuration





