# Setup script for Makroudh Omrani project
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Generating Prisma Client..." -ForegroundColor Green
npm run db:generate

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create .env.local file with your DATABASE_URL" -ForegroundColor Yellow
Write-Host "2. Run: npm run db:migrate" -ForegroundColor Yellow
Write-Host "3. Run: npm run dev" -ForegroundColor Yellow






