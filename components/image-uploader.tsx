"use client"

import { useRef, useState, useCallback } from "react"
import { Camera, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  value?: string
  onChange: (imageUrl: string) => void
  className?: string
  aspectRatio?: "square" | "landscape" | "portrait"
  placeholder?: string
}

export function ImageUploader({
  value,
  onChange,
  className = "",
  aspectRatio = "square",
  placeholder = "Subir foto",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    // Convert to base64 for local storage
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      onChange(base64)
      setIsLoading(false)
    }
    reader.onerror = () => {
      setIsLoading(false)
    }
    reader.readAsDataURL(file)

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [onChange])

  const handleRemove = useCallback(() => {
    onChange("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [onChange])

  return (
    <div className={`relative ${aspectClasses[aspectRatio]} ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {value ? (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
              onClick={() => inputRef.current?.click()}
            >
              <RotateCcw className="h-4 w-4 text-white" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
              onClick={handleRemove}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="w-full h-full rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex flex-col items-center justify-center gap-3 hover:border-[#22C55E] hover:bg-[#22C55E]/5 transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#22C55E] border-t-transparent" />
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                <Camera className="h-7 w-7 text-[#22C55E]" />
              </div>
              <span className="text-sm text-muted-foreground">{placeholder}</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
