import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const board = await prisma.featureBoard.findUnique({
      where: { slug: params.slug },
      include: {
        features: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                votes: true,
                comments: true,
              },
            },
          },
        },
      },
    })

    if (!board) {
      return NextResponse.json(
        { message: "Board not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(board)
  } catch (error) {
    console.error("Error fetching board:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const board = await prisma.featureBoard.findUnique({
      where: { slug: params.slug },
    })

    if (!board) {
      return NextResponse.json(
        { message: "Board not found" },
        { status: 404 }
      )
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, description } = await request.json()

    const updatedBoard = await prisma.featureBoard.update({
      where: { slug: params.slug },
      data: {
        name,
        description,
      },
      include: {
        features: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                votes: true,
                comments: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error("Error updating board:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const board = await prisma.featureBoard.findUnique({
      where: { slug: params.slug },
    })

    if (!board) {
      return NextResponse.json(
        { message: "Board not found" },
        { status: 404 }
      )
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.featureBoard.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: "Board deleted" })
  } catch (error) {
    console.error("Error deleting board:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 