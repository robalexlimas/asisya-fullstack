import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type Props = {
    title?: string
    subtitle?: string
    right?: ReactNode
    children: ReactNode
    className?: string
}

export const PageShell = ({ title, subtitle, right, children, className }: Props) => {
    return (
        <div className={cn('min-h-screen bg-slate-950 text-slate-100', className)}>
            <div className='mx-auto w-full max-w-6xl px-6 py-8'>
                {(title ?? subtitle ?? right) && (
                    <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                        <div>
                            {title && <h1 className='text-2xl font-semibold'>{title}</h1>}
                            {subtitle && <p className='mt-1 text-sm text-slate-400'>{subtitle}</p>}
                        </div>
                        {right && <div className='flex items-center gap-2'>{right}</div>}
                    </div>
                )}

                {children}
            </div>
        </div>
    )
}