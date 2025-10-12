'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FrameAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
  const imagesLoadedRef = useRef(0)

  const Frames = useRef({
    currentIndex: 0,
    maxIndex: 600,
  })

  // Configuration for optimization
  const BATCH_SIZE = 20 // Load images in batches
  const PRELOAD_BUFFER = 10 // Keep extra images loaded around current frame

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const images = imagesRef.current
    if (!canvas || !ctx) return

    // Set initial canvas size
    const setCanvasSize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    const loadImage = (index: number) => {
      if (!canvas || !ctx || index < 0 || index >= Frames.current.maxIndex) return
      
      const img = images.get(index)
      if (!img) return

      const scaleX = canvas.width / img.width
      const scaleY = canvas.height / img.height
      const scale = Math.max(scaleX, scaleY)
      const newWidth = img.width * scale
      const newHeight = img.height * scale
      const offsetX = (canvas.width - newWidth) / 2
      const offsetY = (canvas.height - newHeight) / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
    }

    const loadImageBatch = async (startIndex: number, endIndex: number): Promise<number> => {
      const promises: Promise<void>[] = []
      let loadedCount = 0

      for (let i = startIndex; i <= endIndex && i <= Frames.current.maxIndex; i++) {
        if (images.has(i)) continue // Skip if already loaded

        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = `/neo/frame_${i.toString().padStart(4, "0")}.jpg`
          
          img.onload = () => {
            images.set(i, img)
            imagesLoadedRef.current++
            loadedCount++
            if (progressRef.current) {
              const percentage = Math.round((imagesLoadedRef.current / Frames.current.maxIndex) * 100)
              progressRef.current.textContent = `${percentage}%`
            }
            resolve()
          }
          
          img.onerror = () => {
            console.warn(`Failed to load frame ${i}`)
            resolve() // Continue even if one image fails
          }
        })
        
        promises.push(promise)
      }

      await Promise.all(promises)
      return loadedCount
    }

    const preloadInitialFrames = async () => {
      // Load first batch to start animation quickly
      await loadImageBatch(1, BATCH_SIZE)
      
      // Hide loader after initial batch
      if (loaderRef.current) {
        loaderRef.current.style.opacity = '0'
        setTimeout(() => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none'
          }
        }, 500)
      }

      // Continue loading remaining images in background
      for (let start = BATCH_SIZE + 1; start <= Frames.current.maxIndex; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, Frames.current.maxIndex)
        await loadImageBatch(start, end)
        
        // Small delay to prevent blocking the main thread
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    const cleanupOldImages = (currentIndex: number) => {
      // Remove images that are far from current position to save memory
      const buffer = PRELOAD_BUFFER * 2
      images.forEach((_, index) => {
        if (Math.abs(index - currentIndex) > buffer) {
          images.delete(index)
        }
      })
    }

    const init = async () => {
      await preloadInitialFrames()
      
      gsap.to(Frames.current, {
        currentIndex: Frames.current.maxIndex - 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "max",
          scrub: 1,
          onUpdate: () => {
            const frameIndex = Math.round(Frames.current.currentIndex)
            loadImage(frameIndex)
            
            // Preload nearby frames
            const startPreload = Math.max(1, frameIndex - PRELOAD_BUFFER)
            const endPreload = Math.min(Frames.current.maxIndex, frameIndex + PRELOAD_BUFFER)
            
            for (let i = startPreload; i <= endPreload; i++) {
              if (!images.has(i)) {
                loadImageBatch(i, i)
              }
            }
            
            // Cleanup old images periodically
            if (frameIndex % 50 === 0) {
              cleanupOldImages(frameIndex)
            }
          }
        }
      })
    }

    init()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      // Clear images map to prevent memory leaks
      images.clear()
    }
  }, [])

  return (
    <div className="w-full">
      <div ref={loaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
        <div className="text-white text-2xl">
          Loading animation... <span ref={progressRef}>0%</span>
          <div className="text-sm mt-2 opacity-75">
            Optimized loading in progress
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="h-screen w-full" />
    </div>
  )
}

export default FrameAnimation 