
import { PrismaClient } from '@prisma/client';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting product image import...');
  
  const productImagesDir = join(process.cwd(), 'public', 'media', 'product images', '00');
  
  console.log('Reading images from:', productImagesDir);
  
  const files = await readdir(productImagesDir);
  
  for (const file of files) {
    // Skip any directories
    const filePath = join(productImagesDir, file);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) continue;
    
    // Check if this file has already been added
    const existingMedia = await prisma.media.findFirst({
      where: { fileName: file }
    });
    
    if (existingMedia) {
      console.log(`Image ${file} already exists, skipping...`);
      continue;
    }
    
    // Create media record
    const mediaUrl = `/media/product images/00/${file}`;
    const media = await prisma.media.create({
      data: {
        fileName: file,
        fileSize: fileStat.size,
        mimeType: `image/${file.split('.').pop()?.toLowerCase() || 'jpeg'}`,
        cloudinaryId: `product-images-00-${file}`,
        url: mediaUrl,
        secureUrl: mediaUrl,
        type: 'IMAGE',
      },
    });
    
    console.log(`Added image: ${file} (ID: ${media.id})`);
  }
  
  console.log('Product image import complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

