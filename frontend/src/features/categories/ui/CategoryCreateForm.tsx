import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type Props = {
    onSubmit: (data: { name: string, photoUrl: string | null }) => void
    isSubmitting: boolean
}

export const CategoryCreateForm = ({ onSubmit, isSubmitting }: Props) => {
    const [name, setName] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')

    const cleanName = name.trim()
    const nameError = cleanName.length < 2 ? 'Nombre mínimo 2 caracteres' : null

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (cleanName.length < 2) return

        const cleanPhoto = photoUrl.trim()
        onSubmit({
            name: cleanName,
            photoUrl: cleanPhoto.length > 0 ? cleanPhoto : null
        })
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-3'>
            <div className='grid gap-1'>
                <label className='text-sm text-slate-200'>Nombre</label>
                <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    placeholder='CLOUD'
                />
                {nameError != null && <p className='text-xs text-red-400'>{nameError}</p>}
            </div>

            <div className='grid gap-1'>
                <label className='text-sm text-slate-200'>Foto (URL)</label>
                <Input
                    value={photoUrl}
                    onChange={(e) => { setPhotoUrl(e.target.value) }}
                    placeholder='https://...'
                />
                <p className='text-xs text-slate-400'>Opcional</p>
            </div>

            <Button type='submit' disabled={isSubmitting || nameError != null}>
                {isSubmitting ? 'Creando...' : 'Crear categoría'}
            </Button>
        </form>
    )
}