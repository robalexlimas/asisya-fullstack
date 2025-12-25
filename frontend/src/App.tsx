import { useState } from 'react'
import { useLogin } from '@/features/auth/useLogin'
import { useAuthStore } from '@/store/auth.store'
import { getApiErrorMessage } from '@/api/apiError'

export default function App() {
  const token = useAuthStore((s) => s.token)
  const clear = useAuthStore((s) => s.clear)
  const login = useLogin()

  const [user, setUser] = useState('admin')
  const [password, setPassword] = useState('admin123')

  return (
    <div className='min-h-screen bg-slate-100 flex items-center justify-center p-6'>
      <div className='bg-white rounded-xl shadow p-6 w-full max-w-md'>
        <h1 className='text-xl font-bold'>Asisya Front</h1>

        <div className='mt-4 grid gap-2'>
          <input className='border rounded px-3 py-2' value={user} onChange={(e) => setUser(e.target.value)} />
          <input className='border rounded px-3 py-2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            className='rounded bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-50'
            disabled={login.isPending}
            onClick={() => login.mutate({ user, password })}
          >
            {login.isPending ? 'Logging in...' : 'Login'}
          </button>

          {login.isError && (
            <p className='text-sm text-red-600'>{getApiErrorMessage(login.error)}</p>
          )}
        </div>

        <div className='mt-6'>
          <p className='text-sm text-slate-600'>Token:</p>
          <p className='text-xs break-all'>{token ?? '(none)'}</p>

          {token && (
            <button className='mt-3 text-sm underline' onClick={clear}>
              Logout (clear token)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}