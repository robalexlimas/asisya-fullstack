import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type Props = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
}

export const Card = ({ children, className, ...props }: Props) => {
    return (
        <div
            {...props}
            className={cn(
                'rounded-xl border border-slate-800 bg-slate-900',
                'p-6 shadow-sm',
                className
            )}
        >
            {children}
        </div>
    )
}