import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ slug: string; id: string }> | { slug: string; id: string }
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
        _count: {
          select: {
            votes: true,
            comments: true,
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

    return NextResponse.json({
      ...feature,
      tags: JSON.parse(feature.tags)
    })
  } catch (error) {
    console.error("Error fetching feature:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { status } = await request.json()

    const feature = await prisma.feature.findFirst({
      where: {
        id: params.id,
        board: {
          slug: params.slug,
        },
      },
    })

    if (!feature) {
      return NextResponse.json(
        { message: "Feature not found" },
        { status: 404 }
      )
    }

    const updatedFeature = await prisma.feature.update({
      where: {
        id: params.id,
      },
      data: {
        status,
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

    return NextResponse.json(updatedFeature)
  } catch (error) {
    console.error("Error updating feature:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const feature = await prisma.feature.findFirst({
      where: {
        id: params.id,
        board: {
          slug: params.slug,
        },
      },
    })

    if (!feature) {
      return NextResponse.json(
        { message: "Feature not found" },
        { status: 404 }
      )
    }

    await prisma.feature.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Feature deleted" })
  } catch (error) {
    console.error("Error deleting feature:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug, id } = await params
    const { isDownvote } = await request.json()

    const feature = await prisma.feature.findFirst({
      where: {
        id,
        board: {
          slug,
        },
      },
      include: {
        _count: {
          select: {
            votes: true,
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

    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const existingVote = await prisma.vote.findUnique({
      where: {
        featureId_ipAddress: {
          featureId: id,
          ipAddress,
        },
      },
    })

    if (existingVote) {
      if (existingVote.isDownvote === isDownvote) {
        // Remove vote if clicking the same button
        await prisma.vote.delete({
          where: {
            featureId_ipAddress: {
              featureId: id,
              ipAddress,
            },
          },
        })
        return NextResponse.json({
          voteCount: feature._count.votes - 1,
          hasVoted: false,
          isDownvote: null,
        })
      } else {
        // Update vote if clicking the opposite button
        await prisma.vote.update({
          where: {
            featureId_ipAddress: {
              featureId: id,
              ipAddress,
            },
          },
          data: {
            isDownvote,
          },
        })
        return NextResponse.json({
          voteCount: feature._count.votes,
          hasVoted: true,
          isDownvote,
        })
      }
    }

    // Create new vote
    await prisma.vote.create({
      data: {
        featureId: id,
        ipAddress,
        isDownvote,
      },
    })

    return NextResponse.json({
      voteCount: feature._count.votes + 1,
      hasVoted: true,
      isDownvote,
    })
  } catch (error) {
    console.error("Error voting:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 