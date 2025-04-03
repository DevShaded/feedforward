import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getFeatures } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface Feature {
  id: string
  title: string
  description: string
  status: string
  authorName: string
  authorEmail: string | null
  createdAt: Date
  board: {
    name: string
    slug: string
  }
  _count: {
    votes: number
    comments: number
  }
}

export default async function FeaturesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const features = await getFeatures()

  if (!features) {
    redirect("/login")
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Funksjonsforespørsler</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Bla gjennom og stem på funksjonsforespørsler
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="flex items-center gap-2">
            <Icons.layoutDashboard className="h-4 w-4" />
            Dashbord
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {features.map((feature: Feature) => (
          <Link href={`/board/${feature.board.slug}/features/${feature.id}`} key={feature.id}>
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{feature.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {feature.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Icons.thumbsUp className="mr-1 h-4 w-4" />
                      {feature._count.votes}
                    </div>
                    <div className="flex items-center">
                      <Icons.message className="mr-1 h-4 w-4" />
                      {feature._count.comments}
                    </div>
                  </div>
                  <div>
                    Av {feature.authorName}
                    {feature.authorEmail && ` (${feature.authorEmail})`}
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Tavle: {feature.board.name}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {features.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Icons.inbox className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-tight">
                    Ingen funksjonsforespørsler ennå
                  </h3>
                  <p className="text-muted-foreground">
                    Opprett din første funksjonsforespørsel for å komme i gang!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 