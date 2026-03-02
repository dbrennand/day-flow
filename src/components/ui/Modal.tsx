import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  children: ReactNode
}

export function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex animate-[fade-in_0.2s_ease-out] items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-cream-50 relative w-full max-w-lg animate-[slide-up_0.3s_ease-out] rounded-2xl p-6 shadow-[var(--shadow-panel)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
