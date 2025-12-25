import { NavLink, Outlet } from 'react-router-dom'

const linkBase = 'text-sm px-3 py-2 rounded hover:bg-slate-800'
const linkActive = 'bg-slate-800'

export function PublicLayout() {
    return (
        <div className='min-h-screen bg-slate-950 text-slate-100'>
            <header className='border-b border-slate-800'>
                <div className='mx-auto max-w-5xl px-4 py-4 flex items-center justify-between'>
                    <div className='font-semibold'>Asisya</div>

                    <nav className='flex gap-2'>
                        <NavLink to='/login' className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Login</NavLink>
                        <NavLink to='/products' className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Products</NavLink>
                        <NavLink to='/import' className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Import</NavLink>
                    </nav>
                </div>
            </header>

            <main className='mx-auto max-w-5xl px-4 py-8'>
                <Outlet />
            </main>
        </div>
    )
}