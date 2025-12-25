import { useState } from 'react'
import { PageShell } from '@/shared/layout/PageShell'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { Pagination } from '@/shared/ui/Pagination'
import { useDebounce } from '@/shared/utils/useDebounce'
import { useCategories } from '../hooks/useCategories'
import { useCreateCategory } from '../hooks/useCreateCategory'
import { CategoryCreateForm } from '../ui/CategoryCreateForm'

export default function CategoriesPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const pageSize = 10

    // Solo para evitar spam al backend
    const debouncedSearch = useDebounce(search, 400)

    const q = useCategories({
        page,
        pageSize,
        search: debouncedSearch.trim().length > 0
            ? debouncedSearch.trim()
            : undefined
    })

    const create = useCreateCategory()

    const total = q.data?.total ?? 0
    const items = q.data?.items ?? []

    const onSearchChange = (value: string): void => {
        setSearch(value)
        // ✅ reset page en el mismo evento (sin useEffect)
        setPage(1)
    }

    return (
        <PageShell title='Categorías'>
            <div className='grid gap-6 lg:grid-cols-2'>
                <Card title='Crear categoría'>
                    <CategoryCreateForm
                        isSubmitting={create.isPending}
                        onSubmit={(data) => {
                            create.mutate({
                                name: data.name,
                                photoUrl: data.photoUrl
                            })
                        }}
                    />
                </Card>

                <Card title='Listado'>
                    <div className='grid gap-3'>
                        <Input
                            value={search}
                            placeholder='Buscar por nombre...'
                            onChange={(e) => onSearchChange(e.target.value)}
                        />

                        {q.isLoading && <p className='text-sm text-slate-300'>Cargando...</p>}
                        {q.isError && <p className='text-sm text-red-400'>Error cargando categorías</p>}

                        {!q.isLoading && items.length === 0 && (
                            <p className='text-sm text-slate-300'>No hay categorías.</p>
                        )}

                        {items.length > 0 && (
                            <div className='divide-y divide-slate-700 rounded-lg border border-slate-700'>
                                {items.map((c) => (
                                    <div key={c.id} className='p-3 flex items-center justify-between gap-3'>
                                        <div>
                                            <p className='font-medium text-slate-100'>{c.name}</p>
                                        </div>

                                        {c.photoUrl != null && (
                                            <img
                                                src={c.photoUrl}
                                                alt={c.name}
                                                className='h-10 w-10 rounded object-cover border border-slate-700'
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            total={total}
                            onPageChange={setPage}
                        />
                    </div>
                </Card>
            </div>
        </PageShell>
    )
}