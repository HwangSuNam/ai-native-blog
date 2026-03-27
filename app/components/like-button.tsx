'use client'

import { useState, useEffect } from 'react'

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const likedSlugs = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    setLiked(likedSlugs.includes(slug))

    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .finally(() => setIsLoading(false))
  }, [slug])

  async function handleLike() {
    const newLiked = !liked
    setLiked(newLiked)
    setCount((prev) => prev + (newLiked ? 1 : -1))

    const likedSlugs: string[] = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    if (newLiked) {
      localStorage.setItem('likedPosts', JSON.stringify([...likedSlugs, slug]))
    } else {
      localStorage.setItem('likedPosts', JSON.stringify(likedSlugs.filter((s) => s !== slug)))
    }

    await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action: newLiked ? 'like' : 'unlike' }),
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`
        mt-8 flex items-center gap-2 px-4 py-2 rounded-full text-sm
        transition-all duration-200
        ${
          liked
            ? 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400 cursor-pointer'
            : 'bg-neutral-100 text-neutral-600 hover:bg-pink-100 hover:text-pink-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-pink-950 dark:hover:text-pink-400 cursor-pointer'
        }
        ${isLoading ? 'opacity-50' : ''}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{isLoading ? '...' : count}</span>
    </button>
  )
}
