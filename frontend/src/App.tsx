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
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100'>
      <div className='w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg'>
        <h1 className='text-xl font-bold'>Asisya Front</h1>
        <p className='mt-1 text-sm text-slate-400'>
          Fullstack Technical Challenge
        </p>

        <div className='mt-6 grid gap-3'>
          <input
            className='rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600'
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder='User'
          />

          <input
            className='rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />

          <button
            type='button'
            className='mt-2 rounded-lg bg-slate-100 py-2 font-medium text-slate-900 hover:bg-white disabled:opacity-50 transition'
            disabled={login.isPending}
            onClick={() => login.mutate({ user, password })}
          >
            {login.isPending ? 'Logging in…' : 'Login'}
          </button>

          {login.isError && (
            <p className='text-sm text-red-400'>
              {getApiErrorMessage(login.error)}
            </p>
          )}
        </div>

        <div className='mt-6'>
          <p className='text-xs text-slate-400'>Token:</p>
          <p className='mt-1 break-all rounded-lg bg-slate-950 p-2 text-xs text-slate-300'>
            {token ?? '(none)'}
          </p>

          {token && (
            <button
              type='button'
              className='mt-3 text-sm text-slate-400 underline hover:text-slate-200'
              onClick={clear}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}