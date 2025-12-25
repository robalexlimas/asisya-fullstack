import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster
        position='bottom-right'
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff'
          }
        }}
      />
    </ErrorBoundary>
  </React.StrictMode>
)
