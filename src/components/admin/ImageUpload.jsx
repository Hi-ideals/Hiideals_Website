import { useState, useRef } from 'react'
import { HiPhotograph, HiX } from 'react-icons/hi'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB raw file limit
const MAX_WIDTH = 1200 // max image dimension
const QUALITY = 0.7 // JPEG compression quality

/**
 * Compresses an image file to a smaller base64 data URL.
 * Resizes to max 1200px wide and compresses to JPEG ~70% quality.
 * This keeps Firestore doc size reasonable (typically 50-200KB base64).
 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Scale down if too large
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Compress to JPEG
        const compressed = canvas.toDataURL('image/jpeg', QUALITY)
        resolve(compressed)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ImageUpload({ label, value, onChange, onFile, accept = 'image/*', maxSize = MAX_SIZE }) {
  const [preview, setPreview] = useState(value || '')
  const [error, setError] = useState('')
  const [compressing, setCompressing] = useState(false)
  const inputRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      setError(`File too large. Max ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }
    setError('')
    setCompressing(true)

    try {
      // Compress and convert to base64
      const compressed = await compressImage(file)
      setPreview(compressed)
      onChange?.(compressed)
      // Still call onFile for backward compat, but it's no longer needed
      onFile?.(file)
    } catch {
      setError('Failed to process image')
    }
    setCompressing(false)
  }

  const handleRemove = () => {
    setPreview('')
    onChange?.('')
    onFile?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      {preview ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/[0.08] group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={compressing}
          className="w-full h-32 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-electric-500/30 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
        >
          {compressing ? (
            <>
              <div className="w-6 h-6 border-2 border-electric-500/30 border-t-electric-500 rounded-full animate-spin" />
              <span className="text-xs">Compressing...</span>
            </>
          ) : (
            <>
              <HiPhotograph className="w-8 h-8" />
              <span className="text-xs">Click to upload image</span>
            </>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
