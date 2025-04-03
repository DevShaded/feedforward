"use client"

import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FeatureRequestFormProps {
  boardSlug: string
  variant?: "default" | "empty-state"
}

interface FormData {
  title: string
  description: string
  authorName: string
  authorEmail: string
  category?: string
  tags: string[]
  priority: number
}

type FormValue = string | string[] | number

interface CustomChangeEvent {
  target: {
    name: string
    value: FormValue
  }
}

interface FormContentProps {
  boardSlug: string
  formData: FormData
  isSubmitting: boolean
  error: string | null
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  handleInputChange: (e: CustomChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const FormContent = memo(function FormContent({ 
  boardSlug,
  formData,
  isSubmitting,
  error,
  handleSubmit,
  handleInputChange
}: FormContentProps) {
  const [tagInput, setTagInput] = useState("")

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInput(value)
    
    if (value.endsWith(',')) {
      const newTags = [...formData.tags, value.slice(0, -1).trim()].filter(Boolean)
      handleInputChange({ 
        target: { 
          name: 'tags', 
          value: newTags
        } 
      })
      setTagInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Tittel</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Hvilken funksjon ønsker du å se?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beskrivelse</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Beskriv funksjonsønsket ditt i detalj..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <Select
          value={formData.category}
          onValueChange={(value: string) => handleInputChange({ 
            target: { name: 'category', value } 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Velg en kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UI">UI/UX</SelectItem>
            <SelectItem value="FUNCTIONALITY">Funksjonalitet</SelectItem>
            <SelectItem value="PERFORMANCE">Ytelse</SelectItem>
            <SelectItem value="SECURITY">Sikkerhet</SelectItem>
            <SelectItem value="OTHER">Annet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tagger</Label>
        <Input
          id="tags"
          name="tags"
          value={tagInput}
          onChange={handleTagInputChange}
          placeholder="Skriv inn tagger separert med komma"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    const newTags = formData.tags.filter((_, i) => i !== index)
                    handleInputChange({
                      target: {
                        name: 'tags',
                        value: newTags
                      }
                    })
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioritet</Label>
        <Select
          value={formData.priority.toString()}
          onValueChange={(value: string) => handleInputChange({ 
            target: { name: 'priority', value: parseInt(value) } 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Velg prioritet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Lav</SelectItem>
            <SelectItem value="1">Middels</SelectItem>
            <SelectItem value="2">Høy</SelectItem>
            <SelectItem value="3">Kritisk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorName">Ditt navn</Label>
        <Input
          id="authorName"
          name="authorName"
          value={formData.authorName}
          onChange={handleInputChange}
          placeholder="Skriv inn ditt navn"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorEmail">Din e-post (Valgfritt)</Label>
        <Input
          id="authorEmail"
          name="authorEmail"
          type="email"
          value={formData.authorEmail}
          onChange={handleInputChange}
          placeholder="Skriv inn din e-post"
        />
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Submit Request
      </Button>
    </form>
  )
})

export function FeatureRequestForm({ boardSlug, variant = "default" }: FeatureRequestFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    authorName: "",
    authorEmail: "",
    category: "",
    tags: [],
    priority: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/boards/${boardSlug}/features`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      setFormData({
        title: "",
        description: "",
        authorName: "",
        authorEmail: "",
        category: "",
        tags: [],
        priority: 0
      })
      setIsDialogOpen(false)
      
      // Refresh the page to show the new feature
      window.location.reload()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [boardSlug, formData])

  const handleInputChange = useCallback((
    e: CustomChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          size={variant === "empty-state" ? "lg" : "default"}
          className="w-full"
        >
          <Icons.plus className="mr-2 h-4 w-4" />
          {variant === "empty-state" ? "Send inn ditt første funksjonsønske" : "Send inn funksjonsønske"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-[425px] p-4 sm:p-6 gap-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Send inn funksjonsønske</DialogTitle>
          <DialogDescription>
            Del dine ideer og bidra til å forme fremtiden for dette prosjektet. Fyll ut skjemaet nedenfor for å sende inn ditt funksjonsønske.
          </DialogDescription>
        </DialogHeader>
        <FormContent 
          boardSlug={boardSlug}
          formData={formData}
          isSubmitting={isSubmitting}
          error={error}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      </DialogContent>
    </Dialog>
  )
} 