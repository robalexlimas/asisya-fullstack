import { useParams } from 'react-router-dom'

export function ProductEditPage() {
    const { id } = useParams()

    return (
        <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
            <h1 className='text-xl font-semibold'>Edit product</h1>
            <p className='text-slate-300 mt-2'>ID: {id ?? '(missing)'}</p>
        </div>
    )
}