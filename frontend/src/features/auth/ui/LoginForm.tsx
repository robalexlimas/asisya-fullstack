import { useState } from 'react'

interface Props {
  defaultUser?: string
  defaultPassword?: string
  isLoading?: boolean
  error?: string
  onSubmit: (values: { username: string, password: string }) => void
}

export function LoginForm (props: Props) {
  const [user, setUser] = useState(props.defaultUser ?? '')
  const [password, setPassword] = useState(props.defaultPassword ?? '')

  const canSubmit = user.trim().length > 0 && password.trim().length > 0 && props.isLoading !== true

  return (
    <form
      className='grid gap-3'
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        props.onSubmit({ username: user.trim(), password })
      }}
    >
      <label className='grid gap-1'>
        <span className='text-xs text-slate-300'>Usuario</span>
        <input
          className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-500'
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete='username'
        />
      </label>

      <label className='grid gap-1'>
        <span className='text-xs text-slate-300'>Contraseña</span>
        <input
          className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-500'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='current-password'
        />
      </label>

      <button
        type='submit'
        disabled={!canSubmit}
        className='mt-2 rounded-md bg-slate-100 px-4 py-2 text-slate-950 hover:bg-white disabled:opacity-50'
      >
        {props.isLoading === true ? 'Ingresando...' : 'Login'}
      </button>
    </form>
  )
}
