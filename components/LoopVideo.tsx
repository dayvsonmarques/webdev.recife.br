'use client'

import { useEffect, useRef, useState } from 'react'

/** Muted looping clip (GIF-like) with a pause control; paused for reduced-motion users. */
export function LoopVideo({ mp4, webm, poster, label }: { mp4: string; webm: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) ref.current?.pause()
  }, [])

  return (
    <div className="relative">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => (ref.current?.paused ? ref.current.play() : ref.current?.pause())}
        aria-label={playing ? 'Pausar animação' : 'Reproduzir animação'}
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
        </svg>
      </button>
    </div>
  )
}
