import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Save file to public/media directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicMediaDir = join(process.cwd(), 'public', 'media');
    await mkdir(publicMediaDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(publicMediaDir, fileName);
    await writeFile(filePath, buffer);

    // Create media record in database
    const mediaUrl = `/media/${fileName}`;
    const media = await prisma.media.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        cloudinaryId: fileName, // Using filename as ID for local files
        url: mediaUrl,
        secureUrl: mediaUrl,
        type: 'IMAGE',
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}





