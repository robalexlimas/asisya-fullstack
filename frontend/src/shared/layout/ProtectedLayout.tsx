import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

const linkBase = 'text-sm px-3 py-2 rounded hover:bg-slate-800'
const linkActive = 'bg-slate-800'

export function ProtectedLayout() {
  const clear = useAuthStore((s) => s.clear)
  const navigate = useNavigate()

  const onLogout = (): void => {
    clear()
    navigate('/login', { replace: true })
  }

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <header className='border-b border-slate-800'>
        <div className='mx-auto max-w-5xl px-4 py-4 flex items-center justify-between'>
          <div className='font-semibold'>Asisya</div>

          <nav className='flex items-center gap-2'>
            <NavLink to='/categories' className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Categories</NavLink>
            <NavLink to='/products' className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Products</NavLink>
            <NavLink to='/import' className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Import</NavLink>

            <button
              type='button'
              className='ml-2 text-sm px-3 py-2 rounded bg-slate-100 text-slate-950 hover:bg-white'
              onClick={onLogout}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-8'>
        <Outlet />
      </main>
    </div>
  )
}
