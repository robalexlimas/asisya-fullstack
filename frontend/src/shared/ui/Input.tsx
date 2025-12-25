import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
    return (
        <input
            {...props}
            className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm',
                'bg-slate-900 border-slate-700 text-slate-100',
                'placeholder:text-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-slate-600',
                className
            )}
        />
    )
}