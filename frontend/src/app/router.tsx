import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/shared/layout/PublicLayout'
import { ProtectedLayout } from '@/shared/layout/ProtectedLayout'
import { AuthGuard } from '@/core/auth/AuthGuard'

import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { ProductCreatePage } from '@/features/products/pages/ProductCreatePage'
import { ProductEditPage } from '@/features/products/pages/ProductEditPage'
import { ImportPage } from '@/features/jobs/pages/ImportPage'
import CategoriesPage from '@/features/categories/pages/CategoriesPage'

export const router = createBrowserRouter([
  // Public (anónimo)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to='/login' replace /> },
      { path: 'login', element: <LoginPage /> }
    ]
  },

  // Protected
  {
    element: <AuthGuard />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/products/new', element: <ProductCreatePage /> },
          { path: '/products/:id/edit', element: <ProductEditPage /> },
          { path: '/import', element: <ImportPage /> },
          { path: '/products/new', element: <ProductCreatePage /> }
        ]
      }
    ]
  }
])
