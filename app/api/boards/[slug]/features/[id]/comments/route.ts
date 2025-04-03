import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ slug: string; id: string }> | { slug: string; id: string }
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug, id } = await params
    const { content, authorName, authorEmail } = await request.json()

    if (!content || !authorName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const feature = await prisma.feature.findFirst({
      where: {
        id,
        board: {
          slug,
        },
      },
    })

    if (!feature) {
      return NextResponse.json(
        { message: "Feature not found" },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorName,
        authorEmail,
        featureId: id,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug, id } = await params
    const feature = await prisma.feature.findFirst({
      where: {
        id,
        board: {
          slug,
        },
      },
      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!feature) {
      return NextResponse.json(
        { message: "Feature not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(feature.comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 