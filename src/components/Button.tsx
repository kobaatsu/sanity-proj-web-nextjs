'use client'

// Click button, get confetti!
// Styled by Tailwind :)
import confetti from 'canvas-confetti'
import type {ReactNode} from 'react'

export function Button({children}: {children: ReactNode}) {
  return (
    <button
      type="button"
      onClick={() => confetti()}
      className="focus:ring-opacity-75 appearance-none rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none"
    >
      {children}
    </button>
  )
}
