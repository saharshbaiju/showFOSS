import { useNavigate } from 'react-router-dom'
import { PresentationPlayer } from '@/features/presentation'

/** Chromeless fullscreen surface for TVs and projectors. Reads straight from
 * the persisted stores, so it also works when opened in its own tab/window. */
export function PresentPage() {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 bg-black">
      <PresentationPlayer
        interactive
        showControls
        autoStart
        onExit={() => navigate('/')}
      />
    </div>
  )
}
