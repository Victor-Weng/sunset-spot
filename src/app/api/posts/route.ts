import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            posts.map((post) => ({
                ...post,
                likes: post._count.likes,
                comments: post._count.comments,
                _count: undefined,
            }))
        );
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { caption, imageUrl, locationLat, locationLng, authorId } =
            await request.json();

        const post = await prisma.post.create({
            data: {
                caption,
                imageUrl,
                locationLat,
                locationLng,
                authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json({
            ...post,
            likes: 0,
            comments: 0,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
