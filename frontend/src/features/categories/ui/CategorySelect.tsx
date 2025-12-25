import { useMemo } from 'react'
import { useCategories } from '../hooks/useCategories'

type Props = {
    value: string
    onChange: (categoryId: string) => void
    disabled?: boolean
    allowEmpty?: boolean
    emptyLabel?: string
}

export function CategorySelect({
    value,
    onChange,
    disabled,
    allowEmpty = true,
    emptyLabel = 'Todas'
}: Props) {
    const q = useCategories({ page: 1, pageSize: 200, search: undefined })

    const options = useMemo(() => q.data?.items ?? [], [q.data])

    return (
        <div className='grid gap-1'>
            <label className='text-xs text-slate-300'>Categoría</label>

            <select
                className='w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500 disabled:opacity-60'
                value={value}
                disabled={disabled === true || q.isLoading}
                onChange={(e) => onChange(e.target.value)}
            >
                {allowEmpty && (
                    <option value=''>{emptyLabel}</option>
                )}

                {q.isLoading && (
                    <option value='' disabled>Cargando categorías...</option>
                )}

                {q.isError && (
                    <option value='' disabled>Error cargando categorías</option>
                )}

                {!q.isLoading && !q.isError && options.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {q.isError && (
                <p className='text-xs text-red-400'>No se pudieron cargar las categorías.</p>
            )}
        </div>
    )
}
