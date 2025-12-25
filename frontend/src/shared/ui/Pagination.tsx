interface Props {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

function clamp (n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function range (from: number, to: number): number[] {
  const out: number[] = []
  for (let i = from; i <= to; i++) out.push(i)
  return out
}

export function Pagination ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = clamp(page, 1, totalPages)

  const canPrev = safePage > 1
  const canNext = safePage < totalPages

  const windowSize = 7
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, safePage - half)
  const end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)

  const pages = range(start, end)

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-xs text-slate-300'>
        Total: <span className='font-semibold text-slate-100'>{total}</span>
        {' · '}
        Página <span className='font-semibold text-slate-100'>{safePage}</span> de{' '}
        <span className='font-semibold text-slate-100'>{totalPages}</span>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {(onPageSizeChange != null) && (
          <select
            className='rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100'
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / pág
              </option>
            ))}
          </select>
        )}

        <button
          type='button'
          className='rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-50'
          disabled={!canPrev}
          onClick={() => onPageChange(safePage - 1)}
        >
          Prev
        </button>

        <div className='flex items-center gap-1'>
          {start > 1 && (
            <>
              <button
                type='button'
                className='rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800'
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {start > 2 && <span className='px-1 text-slate-400'>…</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              type='button'
              className={
                                p === safePage
                                  ? 'rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-950'
                                  : 'rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800'
                            }
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <span className='px-1 text-slate-400'>…</span>}
              <button
                type='button'
                className='rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800'
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          type='button'
          className='rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-50'
          disabled={!canNext}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
