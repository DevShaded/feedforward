import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ slug: string; id: string }>
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug, id } = await params
    const { isDownvote, reason } = await request.json()
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"

    const feature = await prisma.feature.findFirst({
      where: {
        id,
        board: {
          slug,
        },
      },
      include: {
        votes: {
          where: {
            ipAddress,
          },
        },
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

    const existingVote = feature.votes[0]

    if (existingVote) {
      if (existingVote.isDownvote === isDownvote) {
        // Remove vote if clicking the same button
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        })
        return NextResponse.json({
          message: "Vote removed",
          hasVoted: false,
          voteCount: feature._count.votes - 1,
        })
      } else {
        // Update vote if changing from upvote to downvote or vice versa
        const updatedVote = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            isDownvote,
            reason,
          },
        })
        return NextResponse.json({
          message: "Vote updated",
          hasVoted: true,
          voteCount: feature._count.votes,
          isDownvote: updatedVote.isDownvote,
        })
      }
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        ipAddress,
        featureId: id,
        isDownvote,
        reason,
      },
    })

    return NextResponse.json({
      message: "Vote added",
      hasVoted: true,
      voteCount: feature._count.votes + 1,
      isDownvote: vote.isDownvote,
    })
  } catch (error) {
    console.error("Error handling vote:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 