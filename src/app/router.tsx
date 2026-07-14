import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { PresentPage } from '@/pages/PresentPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/present', element: <PresentPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
