import { useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductFilters } from '../ui/ProductFilters'
import { ProductTable } from '../ui/ProductTable'
import { Pagination } from '@/shared/ui/Pagination'
import { useResetPageOnDepsChange } from '@/shared/utils/usePagination'

function useDebounced(value: string, ms: number): string {
    const [v, setV] = useState(value)

    useMemo(() => {
        const t = setTimeout(() => setV(value), ms)
        return () => clearTimeout(t)
    }, [value, ms])

    return v
}

export function ProductsPage() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [search, setSearch] = useState('')

    // debounce search para no spamear requests
    const debouncedSearch = useDebounced(search, 400)

    useResetPageOnDepsChange({
        page,
        setPage,
        deps: [debouncedSearch, pageSize]
    })

    const q = useProducts({
        page,
        pageSize,
        search: debouncedSearch.length > 0 ? debouncedSearch : undefined
    })

    const items = q.data?.items ?? []
    const total = q.data?.total ?? 0

    return (
        <div className='p-6 space-y-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-bold text-slate-100'>Productos</h1>
            </div>

            <ProductFilters search={search} onSearchChange={setSearch} />

            {q.isLoading
                ? (
                    <div className='text-slate-300'>Cargando...</div>
                )
                : (
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
