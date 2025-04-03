import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function getDashboardData() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    boards,
    features,
    votes,
    comments,
    featuresThisMonth,
    votesThisMonth,
    commentsThisMonth,
    recentActivity
  ] = await Promise.all([
    prisma.featureBoard.findMany({
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
    }),
    prisma.feature.count({
      where: {
        board: {
          userId: session.user.id,
        },
      },
    }),
    prisma.vote.count({
      where: {
        feature: {
          board: {
            userId: session.user.id,
          },
        },
      },
    }),
    prisma.comment.count({
      where: {
        feature: {
          board: {
            userId: session.user.id,
          },
        },
      },
    }),
    prisma.feature.count({
      where: {
        board: {
          userId: session.user.id,
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.vote.count({
      where: {
        feature: {
          board: {
            userId: session.user.id,
          },
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.comment.count({
      where: {
        feature: {
          board: {
            userId: session.user.id,
          },
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.$queryRaw(
      Prisma.sql`
        SELECT * FROM (
          SELECT 
            'feature' as type,
            f.id,
            f.title,
            b.name as boardName,
            b.slug as boardSlug,
            f.createdAt
          FROM Feature f
          JOIN FeatureBoard b ON f.boardId = b.id
          WHERE b.userId = ${session.user.id}
          UNION ALL
          SELECT 
            'vote' as type,
            v.id,
            f.title,
            b.name as boardName,
            b.slug as boardSlug,
            v.createdAt
          FROM Vote v
          JOIN Feature f ON v.featureId = f.id
          JOIN FeatureBoard b ON f.boardId = b.id
          WHERE b.userId = ${session.user.id}
          UNION ALL
          SELECT 
            'comment' as type,
            c.id,
            f.title,
            b.name as boardName,
            b.slug as boardSlug,
            c.createdAt
          FROM Comment c
          JOIN Feature f ON c.featureId = f.id
          JOIN FeatureBoard b ON f.boardId = b.id
          WHERE b.userId = ${session.user.id}
        ) combined
        ORDER BY createdAt DESC
        LIMIT 30
      `
    )
  ])

  return {
    boards,
    stats: {
      totalFeatures: features,
      totalVotes: votes,
      totalComments: comments,
      featuresThisMonth,
      votesThisMonth,
      commentsThisMonth,
    },
    recentActivity: recentActivity as Array<{
      type: "feature" | "vote" | "comment"
      id: string
      title: string
      boardName: string
      boardSlug: string
      createdAt: Date
    }>,
  }
}

export async function getFeatures() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const features = await prisma.feature.findMany({
    where: {
      board: {
        userId: session.user.id,
      },
    },
    include: {
      board: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return features
} 