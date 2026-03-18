# Project Verification Checklist

## Pre-Installation Checks ✅

- [x] All configuration files created
- [x] Prisma schema complete
- [x] i18n setup configured
- [x] Components created
- [x] No TypeScript/linter errors

## Installation Steps

### 1. Install Dependencies
```powershell
# Option 1: Use PowerShell (may have path issues with apostrophe)
cd "C:\Users\bacca\Desktop\omrani's"
npm install

# Option 2: Use Command Prompt (CMD)
cd C:\Users\bacca\Desktop\omrani's
npm install

# Option 3: Run setup script
.\setup.ps1
```

**Expected Output**: All packages installed successfully

### 2. Verify Installation
```bash
# Check if node_modules exists
Test-Path node_modules

# Check package versions
npm list --depth=0
```

### 3. Set Up Environment
```bash
# Copy example env file
Copy-Item .env.example .env.local

# Edit .env.local with your values:
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (random string)
# - CLOUDINARY_* (your Cloudinary credentials)
# - RESEND_API_KEY (your Resend API key)
```

### 4. Database Setup
```bash
# Generate Prisma Client
npm run db:generate

# Create database migration
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

**Expected**: Server starts on http://localhost:3000

## Verification Tests

### Test 1: Homepage Loads
- [ ] Visit http://localhost:3000
- [ ] Should redirect to /ar (Arabic)
- [ ] Homepage displays "Makroudh Omrani" title
- [ ] No console errors

### Test 2: Language Switching
- [ ] Click language switcher bubble (bottom right)
- [ ] Switch to French (/fr)
- [ ] Content changes to French
- [ ] Switch to English (/en)
- [ ] Content changes to English
- [ ] Switch back to Arabic (/ar)
- [ ] RTL layout applies correctly

### Test 3: RTL Support
- [ ] On Arabic page (/ar), verify:
  - Text aligns right
  - Layout is mirrored
  - Font is Cairo (Arabic font)
- [ ] On French/English pages, verify:
  - Text aligns left
  - Layout is normal
  - Font is Inter (Latin font)

### Test 4: Styling
- [ ] Primary color (#A52A2A) displays correctly
- [ ] Background color (#FFF8DC) displays correctly
- [ ] Fonts load correctly (Cairo, Inter)
- [ ] Responsive design works on mobile/tablet

### Test 5: Database Connection
- [ ] Prisma Client generates without errors
- [ ] Database connection works (if DATABASE_URL set)
- [ ] Can run `npm run db:studio` to open Prisma Studio

## Common Issues & Solutions

### Issue: npm install fails
**Solution**: 
- Check Node.js version (need 18+)
- Clear npm cache: `npm cache clean --force`
- Try: `npm install --legacy-peer-deps`

### Issue: Prisma errors
**Solution**:
- Ensure DATABASE_URL is set in .env.local
- Run `npm run db:generate` first
- Check PostgreSQL is running

### Issue: Next.js build errors
**Solution**:
- Delete `.next` folder
- Run `npm run build` again
- Check for TypeScript errors

### Issue: i18n not working
**Solution**:
- Verify middleware.ts is in root
- Check messages/*.json files exist
- Verify locale routing in app/[locale]/

## Success Criteria

✅ All dependencies install without errors
✅ Development server starts successfully
✅ Homepage loads in all 3 languages
✅ Language switcher works
✅ RTL layout works for Arabic
✅ No console errors
✅ Styling displays correctly

## Next Development Steps

Once verified:
1. Create API routes for products
2. Set up authentication
3. Build product listing page
4. Build product detail page
5. Implement shopping cart
6. Build checkout flow






