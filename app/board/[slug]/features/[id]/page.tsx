"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { use } from "react"

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: string
}

interface Feature {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  authorName: string
  _count: {
    votes: number
    comments: number
  }
}

export default function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const router = useRouter()
  const { slug, id } = use(params)
  const [feature, setFeature] = useState<Feature | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState<boolean | null>(null)
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Hent data fra API med board features og comments
    async function fetchData() {
      try {
        const [featureResponse, commentsResponse] = await Promise.all([
          fetch(`/api/boards/${slug}/features/${id}`),
          fetch(`/api/boards/${slug}/features/${id}/comments`)
        ])

        if (!featureResponse.ok || !commentsResponse.ok) {
          throw new Error("Failed to fetch feature data")
        }

        // Promise.all gør at vi kan hente data fra APIen samtidigt
        const [featureData, commentsData] = await Promise.all([
          featureResponse.json(),
          commentsResponse.json()
        ])

        // Sett dataene i state
        setFeature(featureData)
        setComments(commentsData)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong")
      } finally {
        // Set loading til false når data er hentet
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug, id])

  async function handleVote() {
    if (!feature) return
    setIsVoting(true)

    try {
      // Send POST request til APIen for at stemme
      const response = await fetch(`/api/boards/${slug}/features/${id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDownvote: hasVoted === true }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      const { voteCount, hasVoted: newHasVoted } = await response.json()

      setFeature(prev => prev ? {
        ...prev,
        _count: {
          ...prev._count,
          votes: voteCount
        }
      } : null)
      setHasVoted(newHasVoted)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsVoting(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!feature) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/boards/${slug}/features/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          authorName,
          authorEmail,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      const newComment = await response.json()
      setComments(prev => [newComment, ...prev])
      setContent("")
      setAuthorName("")
      setAuthorEmail("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Icons.x className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">Feature not found</h3>
                <p className="text-muted-foreground">This feature request doesn&apos;t exist</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push(`/board/${slug}`)}
      >
        <Icons.arrowLeft className="mr-2 h-4 w-4" />
        Tilbake til tavle
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                &ldquo;{feature.title}&rdquo;
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Lagt inn av {feature.authorName}</span>
                <span>•</span>
                <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleVote}
              disabled={isVoting}
              className="flex items-center gap-2"
            >
              {isVoting ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.thumbsUp className="h-4 w-4" />
              )}
              {feature._count.votes}
            </Button>
          </div>
          <p className="mt-4 text-muted-foreground">
            {feature.description}
          </p>
          <div className="mt-4">
            <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary inline-block">
              {feature.status}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Legg til en kommentar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="comment">Kommentar</Label>
                <Textarea
                  id="comment"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Skriv din kommentar..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ditt navn</Label>
                  <Input
                    id="name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ola Nordmann"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-post (valgfritt)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="ola@eksempel.no"
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              <Button disabled={isSubmitting} className="w-full">
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Legg inn kommentar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{comment.authorName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {comments.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Icons.message className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight">Ingen kommentarer ennå</h3>
                    <p className="text-muted-foreground">Vær den første som kommenterer denne funksjonsforespørselen!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 