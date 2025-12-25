import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageShell } from '@/shared/layout/PageShell'
import { Card } from '@/shared/ui/Card'
import { getApiErrorMessage } from '@/core/api/apiError'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useProductDetail } from '../hooks/useProductDetail'
import { useUpdateProduct } from '../hooks/useUpdateProduct'
import { ProductEditForm } from '../ui/ProductEditForm'

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const productId = id ?? ''

  const detailQ = useProductDetail(productId)

  const categoriesQ = useCategories({
    page: 1,
    pageSize: 200,
    search: undefined
  })

  const update = useUpdateProduct()

  const categories = categoriesQ.data?.items ?? []

  const initial = useMemo(() => {
    const p = detailQ.data
    if (p == null) return null
    return {
      name: p.name,
      sku: p.sku,
      price: p.price,
      categoryId: p.categoryId
    }
  }, [detailQ.data])

  return (
    <PageShell title='Editar producto'>
      <div className='grid gap-6'>
        <Card title='Edición'>
          {detailQ.isLoading && (
            <p className='text-sm text-slate-300'>Cargando...</p>
          )}

          {detailQ.isError && (
            <p className='text-sm text-red-400'>
              {getApiErrorMessage(detailQ.error)}
            </p>
          )}

          {!detailQ.isLoading && !detailQ.isError && initial == null && (
            <p className='text-sm text-slate-300'>Producto no encontrado.</p>
          )}

          {initial != null && (
            <>
              <ProductEditForm
                initial={initial}
                categories={categories}
                isLoadingCategories={categoriesQ.isLoading}
                isSubmitting={update.isPending}
                onSubmit={(data) => {
                  update.mutate(
                    {
                      id: productId,
                      name: data.name,
                      price: data.price,
                      categoryId: data.categoryId
                    },
                    {
                      onSuccess: () => {
                        navigate('/products', { replace: true })
                      }
                    }
                  )
                }}
              />

              {update.isError && (
                <p className='mt-3 text-sm text-red-400'>
                  {getApiErrorMessage(update.error)}
                </p>
              )}
            </>
          )}
        </Card>
      </div>
    </PageShell>
  )
}