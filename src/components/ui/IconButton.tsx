import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
}

export function IconButton({ className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      className={`hover:bg-cream-200 active:bg-cream-300 inline-flex items-center justify-center rounded-lg p-2 text-stone-600 transition-colors focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
