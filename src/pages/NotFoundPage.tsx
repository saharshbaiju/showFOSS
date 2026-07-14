import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui'
import { BrandMark, Wordmark } from '@/components/brand/BrandMark'

export function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-6">
      <div className="flex flex-col items-center text-center">
        <BrandMark className="size-12 text-ink" />
        <Wordmark className="mt-4 text-2xl" />
        <p className="mt-2 text-sm text-muted">That screen doesn't exist.</p>
        <Link to="/" className={buttonVariants({ variant: 'secondary', className: 'mt-6' })}>
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
