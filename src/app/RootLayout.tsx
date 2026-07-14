import { Outlet } from 'react-router-dom'
import { ThemeController } from './ThemeController'
import { Toaster } from '@/components/ui'

export function RootLayout() {
  return (
    <>
      <ThemeController />
      <Outlet />
      <Toaster />
    </>
  )
}
