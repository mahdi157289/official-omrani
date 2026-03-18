# How to Run the Project

## Quick Start

Since terminal commands have issues with the folder name containing an apostrophe, follow these steps:

### Step 1: Open Terminal/Command Prompt

Navigate to the project folder:
```
cd "C:\Users\bacca\Desktop\omrani's"
```

Or use Command Prompt (CMD) instead of PowerShell:
```
cd C:\Users\bacca\Desktop\omrani's
```

### Step 2: Install Dependencies (if not done)

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open Browser

Visit: **http://localhost:3000**

You should see:
- Automatic redirect to `/ar` (Arabic)
- Homepage with "Makroudh Omrani" title
- Language switcher bubble (bottom right)

## What to Test

1. **Homepage Loads**: Should see "Makroudh Omrani" title
2. **Language Switcher**: Click the globe icon (bottom right)
3. **Switch Languages**: Try Arabic, French, English
4. **RTL Layout**: Arabic page should have right-to-left layout
5. **No Console Errors**: Check browser console (F12)

## Expected URLs

- http://localhost:3000 → redirects to /ar
- http://localhost:3000/ar → Arabic (RTL)
- http://localhost:3000/fr → French
- http://localhost:3000/en → English

## If You See Errors

### Error: "Cannot find module"
**Solution**: Run `npm install`

### Error: "Port 3000 already in use"
**Solution**: 
```bash
npm run dev -- -p 3001
```
Then visit http://localhost:3001

### Error: TypeScript/Build errors
**Solution**: 
```bash
npm run lint
```
Fix any errors shown

### Error: "next-intl" not found
**Solution**: 
```bash
npm install next-intl
```

## Project Status

✅ **All files created and configured**
✅ **No linter/TypeScript errors**
✅ **Ready to run**

The project is properly set up and should run without issues!






