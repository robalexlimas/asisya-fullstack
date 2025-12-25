import { useEffect, useRef } from 'react'
import { cn } from '@/shared/utils/cn'

type Props = {
    open: boolean
    title?: string
    description?: string
    children?: React.ReactNode
    onClose: () => void
    footer?: React.ReactNode
    className?: string
}

export function Modal({
    open,
    title,
    description,
    children,
    onClose,
    footer,
    className
}: Props) {
    const panelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!open) return

        const onKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', onKeyDown)

        // Focus inicial al panel
        const t = window.setTimeout(() => {
            panelRef.current?.focus()
        }, 0)

        return () => {
            window.clearTimeout(t)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            role='dialog'
            aria-modal='true'
            onMouseDown={(e) => {
                // close al clickear overlay
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className='absolute inset-0 bg-black/60' />

            <div
                ref={panelRef}
                tabIndex={-1}
                className={cn(
                    'relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-xl',
                    'outline-none',
                    className
                )}
            >
                {(title != null || description != null) && (
                    <div className='p-5 border-b border-slate-800'>
                        {title != null && <h2 className='text-base font-semibold'>{title}</h2>}
                        {description != null && (
                            <p className='mt-1 text-sm text-slate-300'>{description}</p>
                        )}
                    </div>
                )}

                {children != null && <div className='p-5'>{children}</div>}

                {footer != null && (
                    <div className='p-4 border-t border-slate-800 flex items-center justify-end gap-2'>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
