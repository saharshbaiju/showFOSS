import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { createPortal } from 'react-dom'
import { uid } from '@/lib/id'

type ToastTone = 'default' | 'success' | 'error'

interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

interface ToastStore {
  toasts: ToastItem[]
  push: (message: string, tone: ToastTone) => void
  dismiss: (id: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, tone) => {
    const id = uid('t')
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    window.setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3600)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Callable from anywhere — components or plain functions. */
export const toast = {
  show: (m: string) => useToastStore.getState().push(m, 'default'),
  success: (m: string) => useToastStore.getState().push(m, 'success'),
  error: (m: string) => useToastStore.getState().push(m, 'error'),
}

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: AlertTriangle,
}

const TONE_CLASS = {
  default: 'text-muted',
  success: 'text-accent',
  error: 'text-live',
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone]
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => dismiss(t.id)}
              className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 shadow-pop"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon className={`size-[18px] ${TONE_CLASS[t.tone]}`} />
              <span className="text-sm font-medium text-ink">{t.message}</span>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
