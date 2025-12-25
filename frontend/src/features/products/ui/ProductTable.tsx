import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import type { ProductListItem } from '../domain/product.types'
import { useDeleteProduct } from '../hooks/useDeleteProduct'

type Props = {
  items: ProductListItem[]
}

export function ProductTable({ items }: Props) {
  const del = useDeleteProduct()

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = useMemo(() => {
    if (selectedId == null) return null
    return items.find((x) => x.id === selectedId) ?? null
  }, [items, selectedId])

  const askDelete = (id: string): void => {
    setSelectedId(id)
    setOpen(true)
  }

  const close = (): void => {
    setOpen(false)
    setSelectedId(null)
  }

  const confirmDelete = (): void => {
    if (selectedId == null) return

    del.mutate(selectedId, {
      onSuccess: () => {
        close()
      }
    })
  }

  return (
    <>
      <div className='overflow-hidden rounded-xl border border-slate-800'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-900 text-slate-200'>
            <tr>
              <th className='text-left font-medium px-4 py-3'>Nombre</th>
              <th className='text-left font-medium px-4 py-3'>SKU</th>
              <th className='text-left font-medium px-4 py-3'>Categoría</th>
              <th className='text-right font-medium px-4 py-3'>Precio</th>
              <th className='text-right font-medium px-4 py-3'>Acciones</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-800'>
            {items.map((p) => (
              <tr key={p.id} className='hover:bg-slate-900/40'>
                <td className='px-4 py-3 text-slate-100'>{p.name}</td>
                <td className='px-4 py-3 text-slate-300'>{p.sku}</td>
                <td className='px-4 py-3 text-slate-300'>{p.categoryName}</td>
                <td className='px-4 py-3 text-right text-slate-100'>
                  {p.price.toFixed(2)}
                </td>

                <td className='px-4 py-3'>
                  <div className='flex justify-end gap-2'>
                    <Link to={`/products/${p.id}/edit`}>
                      <Button variant='secondary'>Editar</Button>
                    </Link>

                    <Button
                      variant='danger'
                      onClick={() => askDelete(p.id)}
                      disabled={del.isPending}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className='px-4 py-6 text-center text-slate-300' colSpan={5}>
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={open}
        title='Eliminar producto'
        description={selected != null ? `Vas a eliminar "${selected.name}". Esta acción no se puede deshacer.` : 'Esta acción no se puede deshacer.'}
        confirmText='Eliminar'
        cancelText='Cancelar'
        confirmVariant='danger'
        isLoading={del.isPending}
        onCancel={close}
        onConfirm={confirmDelete}
      />
    </>
  )
}
