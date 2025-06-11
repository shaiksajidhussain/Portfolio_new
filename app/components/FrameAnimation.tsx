'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FrameAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const imagesLoadedRef = useRef(0)

  const Frames = {
    currentIndex: 0,
    maxIndex: 382,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
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
      if (!canvas || !ctx || index < 0 || index >= imagesRef.current.length) return
      
      const img = imagesRef.current[index]
      const scaleX = canvas.width / img.width
      const scaleY = canvas.height / img.height
      const scale = Math.max(scaleX, scaleY)
      const newWidth = img.width * scale
      const newHeight = img.height * scale
      const offsetX = (canvas.width - newWidth) / 2
      const offsetY = (canvas.height - newHeight) / 2

      // console.log(`Loading and drawing image index: ${index} with dimensions ${newWidth}x${newHeight} at offset ${offsetX},${offsetY}`)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
    }

    const preload = () => {
      return new Promise<void>((resolve) => {
        for (let i = 1; i <= Frames.maxIndex; i++) {
          const img = new Image()
          img.src = `/blue/frame_${i.toString().padStart(4, "0")}.jpg`

          img.onload = () => {
            imagesLoadedRef.current++
            if (progressRef.current) {
              const percentage = Math.round((imagesLoadedRef.current / Frames.maxIndex) * 100)
              progressRef.current.textContent = `${percentage}%`
            }
            
            if (imagesLoadedRef.current === Frames.maxIndex) {
              console.log("All images are Loaded")
              if (loaderRef.current) {
                loaderRef.current.style.opacity = '0'
                setTimeout(() => {
                  if (loaderRef.current) {
                    loaderRef.current.style.display = 'none'
                  }
                }, 500)
              }
              resolve()
            }
          }
          imagesRef.current.push(img)
        }
      })
    }

    const init = async () => {
      await preload()
      
      gsap.to(Frames, {
        currentIndex: Frames.maxIndex - 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".parent",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: () => {
            loadImage(Math.round(Frames.currentIndex))
          }
        }
      })
    }

    init()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <div className="w-full">
      <div ref={loaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
        <div className="text-white text-2xl">Loading... <span ref={progressRef}>0%</span></div>
      </div>
      
      <div className="parent relative w-full h-[1000vh]">
        <div className="h-screen w-full sticky top-0 left-0">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}

export default FrameAnimation 