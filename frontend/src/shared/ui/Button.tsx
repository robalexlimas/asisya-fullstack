import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
    variant?: Variant
    size?: Size
}

const variantClasses: Record<Variant, string> = {
    primary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-500'
}

const sizeClasses: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm'
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: Props) {
    return (
        <button
            {...props}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </button>
    )
}
