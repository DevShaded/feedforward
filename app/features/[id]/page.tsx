"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string | null
  }
}

interface FeatureRequest {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  user: {
    name: string | null
  }
  _count: {
    votes: number
    comments: number
  }
  comments: Comment[]
}

export default function FeatureRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feature, setFeature] = useState<FeatureRequest | null>(null)
  const [comment, setComment] = useState("")

  useEffect(() => {
    async function fetchFeature() {
      try {
        const response = await fetch(`/api/features/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch feature")
        }
        const data = await response.json()
        setFeature(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong")
      }
    }

    if (status === "authenticated") {
      fetchFeature()
    }
  }, [status, id])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/features/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      const newComment = await response.json()
      
      setFeature((prev) => {
        if (!prev) return null
        return {
          ...prev,
          comments: [newComment, ...prev.comments],
          _count: {
            ...prev._count,
            comments: prev._count.comments + 1,
          },
        }
      })

      setComment("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVote() {
    try {
      const response = await fetch(`/api/features/${id}/vote`, {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      setFeature((prev) => {
        if (!prev) return null
        return {
          ...prev,
          _count: {
            ...prev._count,
            votes: prev._count.votes + 1,
          },
        }
      })

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Icons.lock className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">Sign in required</h3>
                <p className="text-muted-foreground">Please sign in to view feature requests</p>
              </div>
              <Button onClick={() => router.push("/login")}>
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icons.arrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/features")}
          className="flex items-center gap-2"
        >
          <Icons.layoutGrid className="h-4 w-4" />
          All Features
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{feature.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Posted by {feature.user.name}</span>
                <span>•</span>
                <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleVote}
              className="flex items-center gap-2"
            >
              <Icons.thumbsUp className="h-4 w-4" />
              {feature._count.votes} Votes
            </Button>
          </div>
          <div className="mt-6">
            <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
              {feature.status || 'Open'}
            </div>
            <p className="mt-4 text-muted-foreground whitespace-pre-wrap">
              {feature.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Comments</h2>
          <div className="text-sm text-muted-foreground">
            {feature._count.comments} comments
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="min-h-[100px]"
                required
                disabled={isLoading}
              />
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              <Button disabled={isLoading} className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post Comment
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {feature.comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {comment.user.name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 