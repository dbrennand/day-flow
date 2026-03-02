import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  children: ReactNode
}

export function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-[fade-in_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-cream-50 p-6 shadow-[var(--shadow-panel)] animate-[slide-up_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
