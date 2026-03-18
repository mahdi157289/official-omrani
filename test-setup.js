// Simple test to verify setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking project setup...\n');

const checks = [
  {
    name: 'package.json exists',
    check: () => fs.existsSync('package.json'),
  },
  {
    name: 'node_modules exists',
    check: () => fs.existsSync('node_modules'),
  },
  {
    name: 'next.config.ts exists',
    check: () => fs.existsSync('next.config.ts'),
  },
  {
    name: 'prisma/schema.prisma exists',
    check: () => fs.existsSync('prisma/schema.prisma'),
  },
  {
    name: 'i18n.ts exists',
    check: () => fs.existsSync('i18n.ts'),
  },
  {
    name: 'middleware.ts exists',
    check: () => fs.existsSync('middleware.ts'),
  },
  {
    name: 'app/[locale]/page.tsx exists',
    check: () => fs.existsSync('app/[locale]/page.tsx'),
  },
  {
    name: 'messages files exist',
    check: () => 
      fs.existsSync('messages/ar.json') &&
      fs.existsSync('messages/fr.json') &&
      fs.existsSync('messages/en.json'),
  },
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check }) => {
  if (check()) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! You can run: npm run dev');
} else {
  console.log('⚠️  Some checks failed. Please review the setup.');
}






