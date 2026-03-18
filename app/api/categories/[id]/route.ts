import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                image: true,
            },
        });

        if (!category) {
            return new NextResponse('Category not found', { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const {
            nameAr,
            nameFr,
            nameEn,
            slug,
            descriptionAr,
            descriptionFr,
            descriptionEn,
            isActive,
            isFeatured,
            imageId,
        } = body;

        const category = await prisma.category.update({
            where: {
                id,
            },
            data: {
                nameAr,
                nameFr,
                nameEn,
                slug,
                descriptionAr,
                descriptionFr,
                descriptionEn,
                isActive,
                isFeatured,
                imageId,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const category = await prisma.category.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error deleting category:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
