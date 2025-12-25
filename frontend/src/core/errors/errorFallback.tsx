import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100'>
            <div className='max-w-md w-full p-6 rounded-xl border border-neutral-800 bg-neutral-900'>
                <h1 className='text-lg font-semibold'>Something went wrong</h1>

                <p className='mt-2 text-sm text-neutral-400'>
                    An unexpected error occurred. Please try again.
                </p>

                <pre className='mt-4 text-xs text-red-400 overflow-auto'>
                    {error.message}
                </pre>

                <button
                    className='mt-6 w-full rounded bg-neutral-100 text-neutral-900 py-2 text-sm font-medium hover:bg-white'
                    onClick={resetErrorBoundary}
                >
                    Reload
                </button>
            </div>
        </div>
    )
}