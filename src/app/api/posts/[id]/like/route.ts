import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { userId } = await request.json();

        // Check if user has already liked the post
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id,
                },
            },
        });

        if (existingLike) {
            return NextResponse.json(
                { error: "Post already liked" },
                { status: 400 }
            );
        }

        // Create new like
        await prisma.like.create({
            data: {
                userId,
                postId: id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error liking post:", error);
        return NextResponse.json(
            { error: "Failed to like post" },
            { status: 500 }
        );
    }
}
