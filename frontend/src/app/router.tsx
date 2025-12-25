import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/shared/layout/PublicLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { ProductCreatePage } from '@/features/products/pages/ProductCreatePage'
import { ProductEditPage } from '@/features/products/pages/ProductEditPage'
import { ImportPage } from '@/features/jobs/pages/ImportPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <Navigate to='/login' replace /> },
            { path: 'login', element: <LoginPage /> },

            // por ahora públicas (luego se protegen)
            { path: 'products', element: <ProductsPage /> },
            { path: 'products/new', element: <ProductCreatePage /> },
            { path: 'products/:id/edit', element: <ProductEditPage /> },
            { path: 'import', element: <ImportPage /> }
        ]
    }
])