import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/shared/ui/ErrorFallback'
import { reportError } from '@/core/errors/reportError'

type Props = {
    children: React.ReactNode
}

export function ErrorBoundary({ children }: Props) {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                reportError(error, info)
            }}
        >
            {children}
        </ReactErrorBoundary>
    )
}