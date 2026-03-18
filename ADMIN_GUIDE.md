# Admin Interface Guide

## Accessing the Admin Panel

1. Navigate to: `http://localhost:3001/admin/login`
2. Login credentials (created by seed script):
   - **Email**: `admin@makroudhomrani.tn`
   - **Password**: `admin123`

## Admin Features

### Dashboard (`/admin`)
- Overview statistics:
  - Active Products count
  - Total Orders count
  - Total Revenue
  - Customer count
- Recent orders list

### Products Management (`/admin/products`)
- View all products in a table
- See product images, names, categories, prices, stock, and status
- Add new products (button available)
- Edit existing products
- Delete products

### Orders Management (`/admin/orders`)
- View all orders in a table
- See order details:
  - Order number
  - Customer information
  - Number of items
  - Total amount
  - Order status
  - Order date
- View individual order details

### Media Library (`/admin/media`)
- Upload new images
- View all uploaded media files
- Delete media files
- Grid view of all images

### Settings (`/admin/settings`)
- Site configuration (coming soon)

## Media Management

### Using Your Media Files

The seed script now uses your local media files from the `media/` folder:
- `logo.jpg` - Used in navigation
- `media.jpg`, `media2.jpg` - Product images
- `media3.jpg` through `media11.jpg` - Additional product images
- `post1.jpg`, `post2.jpg`, `post3.jpg` - Blog/post images
- `happy new year.jpg` - Special event image

### Uploading New Media

1. Go to `/admin/media`
2. Click "Upload Media" button
3. Select an image file
4. The file will be saved to `public/media/` and added to the database

## Creating Admin Users

To create additional admin users, you can:

1. **Via Database** (using Prisma Studio):
   ```bash
   npm run db:studio
   ```
   Then create a user with `role: 'ADMIN'` or `role: 'EDITOR'`

2. **Via Seed Script**: Modify `prisma/seed.ts` to add more admin users

3. **Via API** (future): Create an admin user creation endpoint

## Security Notes

- Admin routes are protected by authentication
- Only users with `ADMIN` or `EDITOR` roles can access admin pages
- Passwords are hashed using bcrypt
- Session management via NextAuth.js

## Troubleshooting

### Can't Login
- Verify the admin user exists in the database
- Check that the password is correctly hashed
- Ensure `NEXTAUTH_SECRET` is set in `.env.local`

### Media Files Not Showing
- Verify files are in `public/media/` directory
- Check that the file paths in the database match the actual file locations
- Ensure Next.js is serving static files from the `public` directory

### Admin Pages Not Loading
- Check that you're logged in
- Verify your user role is `ADMIN` or `EDITOR`
- Check browser console for errors





