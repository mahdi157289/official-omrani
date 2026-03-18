// Project Verification Script
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Makroudh Omrani Project Setup...\n');

const errors = [];
const warnings = [];
const success = [];

// Check critical files
const criticalFiles = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.ts',
  'prisma/schema.prisma',
  'i18n.ts',
  'middleware.ts',
  'app/layout.tsx',
  'app/[locale]/layout.tsx',
  'app/[locale]/page.tsx',
  'messages/ar.json',
  'messages/fr.json',
  'messages/en.json',
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    success.push(`✅ ${file}`);
  } else {
    errors.push(`❌ Missing: ${file}`);
  }
});

// Check node_modules
if (fs.existsSync('node_modules')) {
  success.push('✅ node_modules exists');
  
  // Check key dependencies
  const keyDeps = ['next', 'react', 'next-intl', '@prisma/client'];
  keyDeps.forEach(dep => {
    if (fs.existsSync(path.join('node_modules', dep))) {
      success.push(`✅ ${dep} installed`);
    } else {
      warnings.push(`⚠️  ${dep} not found in node_modules`);
    }
  });
} else {
  errors.push('❌ node_modules not found - run: npm install');
}

// Check package.json scripts
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'build', 'db:generate'];
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      success.push(`✅ Script '${script}' exists`);
    } else {
      warnings.push(`⚠️  Script '${script}' missing`);
    }
  });
} catch (e) {
  errors.push('❌ Cannot read package.json');
}

// Check TypeScript config
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (tsconfig.compilerOptions) {
    success.push('✅ TypeScript configured');
  }
} catch (e) {
  warnings.push('⚠️  TypeScript config issue');
}

// Check i18n setup
try {
  const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
  const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));
  const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
  success.push('✅ Translation files are valid JSON');
} catch (e) {
  errors.push('❌ Translation files have JSON errors');
}

// Output results
console.log('\n📋 VERIFICATION RESULTS:\n');
console.log('✅ SUCCESS:');
success.forEach(msg => console.log(`  ${msg}`));

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(msg => console.log(`  ${msg}`));
}

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach(msg => console.log(`  ${msg}`));
  console.log('\n⚠️  Please fix errors before running the project.');
  process.exit(1);
} else {
  console.log('\n🎉 All critical checks passed!');
  console.log('\n📝 Next steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Open: http://localhost:3000');
  console.log('  3. Test language switching');
  process.exit(0);
}






