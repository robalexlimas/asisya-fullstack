import { useMemo, useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { CategorySelect } from '@/features/categories/ui/CategorySelect'
import type { Category } from '@/features/categories/domain/category.types'

type Props = {
    initial: {
        name: string
        sku: string
        price: number
        categoryId: string
    }
    categories: Category[]
    isLoadingCategories: boolean
    isSubmitting: boolean
    onSubmit: (data: { name: string, price: number, categoryId: string }) => void
}

type FormValue = {
    name: string
    sku: string
    price: string
    categoryId: string
}

export function ProductEditForm(props: Props) {
    const [v, setV] = useState<FormValue>({
        name: props.initial.name ?? '',
        sku: props.initial.sku ?? '',
        price: String(props.initial.price ?? ''),
        categoryId: props.initial.categoryId ?? ''
    })

    const parsedPrice = useMemo(() => {
        const n = Number(v.price)
        return Number.isFinite(n) ? n : NaN
    }, [v.price])

    const canSubmit = useMemo(() => {
        const nameOk = v.name.trim().length > 0
        const priceOk = Number.isFinite(parsedPrice) && parsedPrice > 0
        const catOk = v.categoryId.trim().length > 0
        return nameOk && priceOk && catOk && !props.isSubmitting
    }, [v.name, v.categoryId, parsedPrice, props.isSubmitting])

    return (
        <form
            className='grid gap-3'
            onSubmit={(e) => {
                e.preventDefault()
                if (!canSubmit) return

                props.onSubmit({
                    name: v.name.trim(),
                    price: parsedPrice,
                    categoryId: v.categoryId
                })
            }}
        >
            <Input
                placeholder='Nombre'
                value={v.name}
                onChange={(e) => { setV((s) => ({ ...s, name: e.target.value })) }}
            />

            <Input
                placeholder='SKU'
                value={v.sku}
                disabled
            />

            <Input
                placeholder='Precio'
                inputMode='decimal'
                value={v.price}
                onChange={(e) => { setV((s) => ({ ...s, price: e.target.value })) }}
            />

            <CategorySelect
                value={v.categoryId}
                onChange={(id) => { setV((s) => ({ ...s, categoryId: id })) }}
            />

            <Button type='submit' disabled={!canSubmit}>
                {props.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    )
}