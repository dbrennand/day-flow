interface BadgeProps {
  label: string
  className?: string
}

export function Badge({ label, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-cream-200 px-2 py-0.5 text-xs font-medium text-stone-600 ${className}`}
    >
      {label}
    </span>
  )
}
