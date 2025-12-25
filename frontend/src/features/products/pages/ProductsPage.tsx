import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductFilters } from '../ui/ProductFilters'
import { ProductTable } from '../ui/ProductTable'
import { Pagination } from '@/shared/ui/Pagination'
import { useResetPageOnDepsChange } from '@/shared/utils/usePagination'
import { useDebounce } from '@/shared/utils/useDebounce'
import { Button } from '@/shared/ui/Button'

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
        search: debouncedSearch.trim().length > 0 ? debouncedSearch : undefined
    })

    const items = q.data?.items ?? []
    const total = q.data?.total ?? 0

    return (
        <div className='p-6 space-y-4'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='text-xl font-bold text-slate-100'>Productos</h1>

                <Link to='/products/new'>
                    <Button>Nuevo</Button>
                </Link>
            </div>

            <ProductFilters
                search={search}
                onSearchChange={setSearch}
            />

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