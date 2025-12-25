import { useNavigate } from 'react-router-dom'
import { PageShell } from '@/shared/layout/PageShell'
import { Card } from '@/shared/ui/Card'
import { getApiErrorMessage } from '@/core/api/apiError'
import { useCreateProduct } from '../hooks/useCreateProduct'
import { ProductCreateForm } from '../ui/ProductCreateForm'

export function ProductCreatePage() {
  const navigate = useNavigate()
  const create = useCreateProduct()

  return (
    <PageShell title='Crear producto'>
      <div className='grid gap-6'>
        <Card title='Nuevo producto'>
          <ProductCreateForm
            isSubmitting={create.isPending}
            onSubmit={(data) => {
              create.mutate(
                {
                  name: data.name,
                  sku: data.sku,
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

          {create.isError && (
            <p className='mt-3 text-sm text-red-400'>
              {getApiErrorMessage(create.error)}
            </p>
          )}
        </Card>
      </div>
    </PageShell>
  )
}