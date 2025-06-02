'use client'

import { useEffect, useState } from 'react'

interface TypewriterEffectProps {
  texts: string[]
}

const TypewriterEffect = ({ texts }: TypewriterEffectProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const currentFullText = texts[currentTextIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText === currentFullText) {
          setIsDeleting(true)
          setTypingSpeed(50)
        } else {
          setCurrentText(currentFullText.slice(0, currentText.length + 1))
        }
      } else {
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setTypingSpeed(150)
        } else {
          setCurrentText(currentText.slice(0, currentText.length - 1))
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, isDeleting, texts, typingSpeed])

  return <span>{currentText}</span>
}

export default TypewriterEffect 