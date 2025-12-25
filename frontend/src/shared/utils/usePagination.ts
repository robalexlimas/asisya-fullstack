import { useEffect } from 'react'

type Args = {
    page: number
    setPage: (p: number) => void
    deps: unknown[]
}

export function useResetPageOnDepsChange({ page, setPage, deps }: Args): void {
    useEffect(() => {
        if (page !== 1) setPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}