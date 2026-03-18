# Quick Start Guide

## Step 1: Install Dependencies

Since `node_modules` already exists, dependencies might be installed. But to be sure, run:

```bash
npm install
```

## Step 2: Test the Development Server

Run the dev server:

```bash
npm run dev
```

Then open your browser to:
- http://localhost:3000 (will redirect to /ar)
- http://localhost:3000/ar (Arabic - RTL)
- http://localhost:3000/fr (French)
- http://localhost:3000/en (English)

## Step 3: Check for Errors

If you see any errors, check:

1. **Node version**: Should be 18+ 
   ```bash
   node --version
   ```

2. **Missing dependencies**: 
   ```bash
   npm install
   ```

3. **TypeScript errors**: 
   ```bash
   npm run lint
   ```

## Common Issues

### Issue: "Cannot find module 'next-intl'"
**Fix**: Run `npm install`

### Issue: "Module not found" errors
**Fix**: Delete `node_modules` and `.next` folder, then:
```bash
npm install
npm run dev
```

### Issue: Port 3000 already in use
**Fix**: Kill the process or use a different port:
```bash
npm run dev -- -p 3001
```

## What Should Work

✅ Homepage loads with "Makroudh Omrani" title
✅ Language switcher appears (bottom right bubble)
✅ Can switch between Arabic, French, English
✅ Arabic page shows RTL layout
✅ No console errors

## Next Steps After It Runs

1. Set up database (if you have PostgreSQL):
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. Create `.env.local` file with your environment variables

3. Start building features!






