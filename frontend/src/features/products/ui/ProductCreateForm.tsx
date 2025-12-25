import { useMemo, useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { CategorySelect } from '@/features/categories/ui/CategorySelect'

type FormValue = {
    name: string
    sku: string
    price: string
    categoryId: string
}

type Props = {
    isSubmitting: boolean
    onSubmit: (data: { name: string, sku: string, price: number, categoryId: string }) => void
}

export function ProductCreateForm(props: Props) {
    const [v, setV] = useState<FormValue>({
        name: '',
        sku: '',
        price: '',
        categoryId: ''
    })

    const canSubmit = useMemo(() => {
        const nameOk = v.name.trim().length > 0
        const skuOk = v.sku.trim().length > 0
        const priceNum = Number(v.price)
        const priceOk = Number.isFinite(priceNum) && priceNum > 0
        const catOk = v.categoryId.trim().length > 0
        return nameOk && skuOk && priceOk && catOk && !props.isSubmitting
    }, [v, props.isSubmitting])

    return (
        <form
            className='grid gap-3'
            onSubmit={(e) => {
                e.preventDefault()
                props.onSubmit({
                    name: v.name,
                    sku: v.sku,
                    price: Number(v.price),
                    categoryId: v.categoryId
                })
            }}
        >
            <Input
                placeholder='Nombre'
                value={v.name}
                onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))}
            />

            <Input
                placeholder='SKU'
                value={v.sku}
                onChange={(e) => setV((s) => ({ ...s, sku: e.target.value }))}
            />

            <Input
                placeholder='Precio'
                inputMode='decimal'
                value={v.price}
                onChange={(e) => setV((s) => ({ ...s, price: e.target.value }))}
            />

            <CategorySelect
                value={v.categoryId}
                onChange={(id) => setV((s) => ({ ...s, categoryId: id }))}
                emptyLabel='Selecciona una categoría'
                allowEmpty={false}
            />

            <Button type='submit' disabled={!canSubmit}>
                {props.isSubmitting ? 'Creando...' : 'Crear producto'}
            </Button>
        </form>
    )
}