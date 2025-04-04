import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, description, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingBoard = await prisma.featureBoard.findUnique({
      where: { slug },
    })

    if (existingBoard) {
      return NextResponse.json(
        { message: "Slug is already taken" },
        { status: 400 }
      )
    }

    const board = await prisma.featureBoard.create({
      data: {
        name,
        description,
        slug,
        userId: session.user.id,
      },
    })

    return NextResponse.json(board)
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const boards = await prisma.featureBoard.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            features: true,
          },
        },
      },
    })

    return NextResponse.json(boards)
  } catch (error) {
    console.error("Error fetching boards:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 