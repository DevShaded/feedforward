import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

interface RouteParams {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    const { 
      title, 
      description, 
      category,
      tags,
      priority,
      authorName, 
      authorEmail 
    } = await request.json()

    const board = await prisma.featureBoard.findUnique({
      where: { slug },
    })

    if (!board) {
      return NextResponse.json(
        { message: "Board not found" },
        { status: 404 }
      )
    }

    const feature = await prisma.feature.create({
      data: {
        title,
        description,
        category,
        tags: JSON.stringify(tags || []),
        priority,
        boardId: board.id,
        authorName: session?.user?.name || authorName || "Anonymous",
        authorEmail: session?.user?.email || authorEmail || null,
      },
      include: {
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(feature)
  } catch (error) {
    console.error("Error creating feature:", error)
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
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const sort = searchParams.get("sort") || "votes"
    const order = (searchParams.get("order") || "desc") as Prisma.SortOrder

    const board = await prisma.featureBoard.findUnique({
      where: { slug },
    })

    if (!board) {
      return NextResponse.json(
        { message: "Board not found" },
        { status: 404 }
      )
    }

    const orderBy: Prisma.FeatureOrderByWithRelationInput = sort === "votes" 
      ? { votes: { _count: order } }
      : sort === "comments"
      ? { comments: { _count: order } }
      : { createdAt: order }

    const features = await prisma.feature.findMany({
      where: {
        boardId: board.id,
        ...(status ? { status } : {}),
      },
      include: {
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      orderBy,
    })

    return NextResponse.json(features)
  } catch (error) {
    console.error("Error fetching features:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 