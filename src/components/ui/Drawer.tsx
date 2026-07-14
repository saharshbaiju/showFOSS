import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: number
}

export function Drawer({ open, onClose, title, description, children, footer, width = 460 }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 flex h-full max-w-[92vw] flex-col bg-surface shadow-pop border-l border-line"
            style={{ width }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-line">
              <div className="min-w-0">
                {title && <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>}
                {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
              </div>
              <IconButton label="Close" size="sm" onClick={onClose} className="-mr-1.5 -mt-0.5">
                <X />
              </IconButton>
            </div>
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
                {footer}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
