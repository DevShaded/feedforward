"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Board {
  id: string
  name: string
  description: string | null
  slug: string
  createdAt: Date
  _count: {
    features: number
  }
}

interface RecentActivity {
  id: string
  type: "feature" | "vote" | "comment"
  title: string
  boardName: string
  boardSlug: string
  createdAt: Date
}

export default function DashboardPage() {
  const router = useRouter()
  const [boards, setBoards] = useState<Board[]>([])
  const [stats, setStats] = useState({
    totalFeatures: 0,
    totalVotes: 0,
    totalComments: 0,
    featuresThisMonth: 0,
    votesThisMonth: 0,
    commentsThisMonth: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await response.json()
        setBoards(data.boards)
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredBoards = boards.filter((board) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      board.name.toLowerCase().includes(searchLower) ||
      (board.description?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Icons.x className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">Error loading dashboard</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Velkommen tilbake!
          </h1>
          <p className="text-muted-foreground mt-2">
            Administrer dine tilbakemeldingsbrett og følg brukerfeedback.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Søk i brett..."
            className="w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href="/dashboard/new-board">
            <Button>
              <Icons.plus className="mr-2 h-4 w-4" />
              Opprett nytt brett
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totalt antall forslag
            </CardTitle>
            <Icons.sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeatures}</div>
            <p className="text-xs text-muted-foreground">
              {stats.featuresThisMonth} denne måneden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totalt antall stemmer
            </CardTitle>
            <Icons.thumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.votesThisMonth} denne måneden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totalt antall kommentarer
            </CardTitle>
            <Icons.message className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.commentsThisMonth} denne måneden
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="boards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="boards">Brett</TabsTrigger>
          <TabsTrigger value="activity">Nylig aktivitet</TabsTrigger>
        </TabsList>

        <TabsContent value="boards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBoards.map((board) => (
              <Card key={board.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader className="space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">
                    {board.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Opprettet {new Date(board.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  {board.description && (
                    <p className="text-muted-foreground mb-4">
                      {board.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {board._count.features} forslag
                    </div>
                    <Link href={`/board/${board.slug}`}>
                      <Button variant="ghost">
                        Vis brett
                        <Icons.arrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredBoards.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Icons.inbox className="h-12 w-12 text-muted-foreground" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {searchQuery ? "Ingen matchende brett funnet" : "Ingen brett ennå"}
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Prøv å justere søkeordene dine"
                          : "Opprett ditt første tilbakemeldingsbrett for å begynne å samle inn feedback."}
                      </p>
                    </div>
                    {!searchQuery && (
                      <Link href="/dashboard/new-board">
                        <Button className="mt-4">
                          <Icons.plus className="mr-2 h-4 w-4" />
                          Opprett nytt brett
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nylig aktivitet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      {activity.type === "feature" && (
                        <Icons.sparkles className="h-5 w-5 text-primary" />
                      )}
                      {activity.type === "vote" && (
                        <Icons.thumbsUp className="h-5 w-5 text-primary" />
                      )}
                      {activity.type === "comment" && (
                        <Icons.message className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">
                          på {activity.boardName}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 