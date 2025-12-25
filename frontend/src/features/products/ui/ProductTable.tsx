import type { ProductListItem } from '../domain/product.types'

interface Props {
  items: ProductListItem[]
}

export function ProductTable ({ items }: Props) {
  return (
    <div className='overflow-x-auto rounded-xl border border-slate-800'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-slate-900 text-slate-200'>
          <tr>
            <th className='px-4 py-3'>Nombre</th>
            <th className='px-4 py-3'>SKU</th>
            <th className='px-4 py-3'>Categoría</th>
            <th className='px-4 py-3 text-right'>Precio</th>
          </tr>
        </thead>
        <tbody className='bg-slate-950'>
          {items.map((p) => (
            <tr key={p.id} className='border-t border-slate-800'>
              <td className='px-4 py-3 text-slate-100'>{p.name}</td>
              <td className='px-4 py-3 text-slate-300'>{p.sku}</td>
              <td className='px-4 py-3 text-slate-300'>{p.categoryName}</td>
              <td className='px-4 py-3 text-right text-slate-100'>${p.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
