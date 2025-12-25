import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback ({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6'>
      <div className='w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h1 className='text-lg font-semibold'>Something went wrong</h1>
        <p className='mt-2 text-sm text-slate-300'>
          Ocurrió un error inesperado en la aplicación. Puedes recargar para intentar de nuevo.
        </p>

        <div className='mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3'>
          <p className='text-xs text-slate-400'>Error</p>
          <pre className='mt-2 text-xs text-red-400 whitespace-pre-wrap wrap-break-word'>
            {error?.message ?? 'Unknown error'}
          </pre>
        </div>

        <div className='mt-6 flex gap-3'>
          <button
            type='button'
            className='rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-white'
            onClick={resetErrorBoundary}
          >
            Reload
          </button>

          <button
            type='button'
            className='rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800'
            onClick={() => window.location.reload()}
          >
            Hard reload
          </button>
        </div>
      </div>
    </div>
  )
}
