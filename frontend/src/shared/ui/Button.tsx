import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}

export function Button({ children, className, ...props }: Props) {
    return (
        <button
            {...props}
            className={cn(
                'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium',
                'bg-slate-800 text-slate-100 hover:bg-slate-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
                className
            )}
        >
            {children}
        </button>
    )
}