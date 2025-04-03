"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Feature {
  id: string
  title: string
  description: string
  status: string
  category?: string
  tags: string[]
  priority: number
  createdAt: string
  authorName: string
  authorEmail: string | null
  _count: {
    votes: number
    comments: number
  }
}

interface FeatureListProps {
  boardSlug: string
  initialFeatures: Feature[]
}

export function FeatureList({ boardSlug, initialFeatures }: FeatureListProps) {
  const [features, setFeatures] = useState(initialFeatures)
  const [isVoting, setIsVoting] = useState<string | null>(null)
  const [votedFeatures, setVotedFeatures] = useState<Map<string, boolean>>(new Map())

  async function handleVote(featureId: string, isDownvote: boolean) {
    setIsVoting(featureId)

    try {
      const response = await fetch(`/api/boards/${boardSlug}/features/${featureId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDownvote }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      const { voteCount, hasVoted, isDownvote: newIsDownvote } = await response.json()

      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === featureId
            ? {
                ...feature,
                _count: {
                  ...feature._count,
                  votes: voteCount,
                },
              }
            : feature
        )
      )

      setVotedFeatures((prev) => {
        const newMap = new Map(prev)
        if (hasVoted) {
          newMap.set(featureId, newIsDownvote)
        } else {
          newMap.delete(featureId)
        }
        return newMap
      })
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(null)
    }
  }

  return (
    <div className="grid gap-4">
      {features.map((feature) => (
        <Link 
          key={feature.id} 
          href={`/board/${boardSlug}/features/${feature.id}`}
          className="block"
        >
          <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary cursor-pointer">
            <CardHeader className="p-4 sm:p-6 pb-0">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-base sm:text-lg line-clamp-2">{feature.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground whitespace-nowrap">
                    {feature.status}
                  </span>
                  {feature.category && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {feature.category}
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">{feature.description}</p>
              {feature.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleVote(feature.id, false)
                      }}
                      disabled={isVoting === feature.id}
                      className={cn(
                        "flex items-center hover:text-primary disabled:opacity-50 transition-colors",
                        votedFeatures.get(feature.id) === false && "text-primary"
                      )}
                    >
                      {isVoting === feature.id ? (
                        <Icons.spinner className="mr-1 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Icons.thumbsUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                    <span className="text-xs sm:text-sm">{feature._count.votes}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleVote(feature.id, true)
                      }}
                      disabled={isVoting === feature.id}
                      className={cn(
                        "flex items-center hover:text-destructive disabled:opacity-50 transition-colors",
                        votedFeatures.get(feature.id) === true && "text-destructive"
                      )}
                    >
                      <Icons.thumbsDown className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <Icons.message className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{feature._count.comments}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    By {feature.authorName}
                    {feature.authorEmail && ` (${feature.authorEmail})`}
                  </div>
                  {feature.priority > 0 && (
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      feature.priority === 3 && "bg-destructive/10 text-destructive",
                      feature.priority === 2 && "bg-warning/10 text-warning",
                      feature.priority === 1 && "bg-primary/10 text-primary"
                    )}>
                      {feature.priority === 3 ? "Critical" :
                       feature.priority === 2 ? "High" :
                       feature.priority === 1 ? "Medium" : "Low"}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 