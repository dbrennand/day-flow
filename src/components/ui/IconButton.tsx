import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
}

export function IconButton({ className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg p-2 text-stone-600 transition-colors hover:bg-cream-200 active:bg-cream-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
