interface Props {
  search: string
  onSearchChange: (v: string) => void
}

export function ProductFilters ({ search, onSearchChange }: Props) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex-1'>
        <input
          className='w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500'
          placeholder='Buscar por nombre o SKU...'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
