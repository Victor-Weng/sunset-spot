import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date") || "all";
        const popularity = searchParams.get("popularity") || "all";

        // Build date filter
        const dateFilter = (() => {
            const now = new Date();
            switch (date) {
                case "today":
                    return {
                        createdAt: {
                            gte: new Date(now.setHours(0, 0, 0, 0)),
                        },
                    };
                case "week":
                    return {
                        createdAt: {
                            gte: new Date(now.setDate(now.getDate() - 7)),
                        },
                    };
                case "month":
                    return {
                        createdAt: {
                            gte: new Date(now.setMonth(now.getMonth() - 1)),
                        },
                    };
                case "year":
                    return {
                        createdAt: {
                            gte: new Date(
                                now.setFullYear(now.getFullYear() - 1)
                            ),
                        },
                    };
                default:
                    return {};
            }
        })();

        // Build order by clause
        const orderBy = (() => {
            switch (popularity) {
                case "most_liked":
                    return {
                        likes: {
                            _count: "desc",
                        },
                    };
                case "most_commented":
                    return {
                        comments: {
                            _count: "desc",
                        },
                    };
                case "recent":
                    return {
                        createdAt: "desc",
                    };
                default:
                    return {
                        createdAt: "desc",
                    };
            }
        })();

        const posts = await prisma.post.findMany({
            where: dateFilter,
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy,
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
        console.error("Error fetching map posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
