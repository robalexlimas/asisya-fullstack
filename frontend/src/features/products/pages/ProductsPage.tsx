import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductFilters } from '../ui/ProductFilters'
import { ProductTable } from '../ui/ProductTable'
import { Pagination } from '@/shared/ui/Pagination'
import { useResetPageOnDepsChange } from '@/shared/utils/usePagination'
import { useDebounce } from '@/shared/utils/useDebounce'

export function ProductsPage() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [search, setSearch] = useState('')

    const debouncedSearch = useDebounce(search, 400)

    useResetPageOnDepsChange({
        page,
        setPage,
        deps: [debouncedSearch, pageSize]
    })

    const q = useProducts({
        page,
        pageSize,
        search: debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined
    })

    const items = q.data?.items ?? []
    const total = q.data?.total ?? 0

    return (
        <div className='p-6 space-y-4'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='text-xl font-bold text-slate-100'>Productos</h1>

                <Link
                    to='/products/new'
                    className='inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors'
                >
                    Nuevo
                </Link>
            </div>

            <ProductFilters
                search={search}
                onSearchChange={setSearch}
            />

            {q.isLoading && (
                <div className='text-slate-300'>Cargando...</div>
            )}

            {q.isError && (
                <div className='text-sm text-red-400'>
                    Error cargando productos
                </div>
            )}

            {!q.isLoading && !q.isError && (
                <>
                    <ProductTable items={items} />

                    <div className='pt-3'>
                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            total={total}
                            onPageChange={setPage}
                            onPageSizeChange={(ps) => {
                                setPageSize(ps)
                                setPage(1)
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}