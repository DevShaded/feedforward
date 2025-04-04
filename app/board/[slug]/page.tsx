import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { FeatureRequestForm } from "@/components/feature-request-form"
import { FeatureList } from "@/components/feature-list"
import prisma from "@/lib/prisma"

interface BoardPageProps {
  params: Promise<{ slug: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params
  const session = await getServerSession(authOptions)
  
  // Fetch the board with the given slug order by createdAt in descending order and include the features with the count of votes and comments
  const board = await prisma.featureBoard.findUnique({
    where: { slug },
    include: {
      features: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              votes: true,
              comments: true
            }
          }
        }
      }
    }
  })

  // If the board is not found, return a 404 error
  if (!board) {
    return (
      <div className="w-full min-h-screen px-4">
        <div className="max-w-5xl mx-auto py-6 sm:py-10">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">Board not found</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Format the features to match the expected type
  const formattedFeatures = board.features.map(feature => ({
    ...feature,
    createdAt: feature.createdAt.toISOString(),
    tags: feature.tags ? JSON.parse(feature.tags) : [],
    category: feature.category || undefined
  }))

  return (
    <div className="w-full min-h-screen px-4">
      <div className="max-w-5xl mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{board.name}</h1>
            {board.description && (
              <p className="text-sm sm:text-base text-muted-foreground">{board.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {session && (
              <Button className="w-full sm:w-auto" asChild>
                <a href="/dashboard">
                  <Icons.layoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
              </Button>
            )}
            <div className="w-full sm:w-auto">
              <FeatureRequestForm boardSlug={slug} />
            </div>
          </div>
        </div>

        {/* Render the feature list */}
        <Suspense fallback={
          <div className="text-center py-8">
            <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
          </div>
        }>
          {/* If there are no features, render the empty state */}
          {board.features.length === 0 ? (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Icons.sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">No feature requests yet</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 mb-6 max-w-[280px] sm:max-w-sm">
                  Be the first to submit a feature request! Share your ideas and help shape the future of this project.
                </p>
                <div className="w-full sm:w-auto">
                  <FeatureRequestForm boardSlug={slug} variant="empty-state" />
                </div>
              </div>
            </div>
          ) : (
            <FeatureList boardSlug={slug} initialFeatures={formattedFeatures} />
          )}
        </Suspense>
      </div>
    </div>
  )
} 