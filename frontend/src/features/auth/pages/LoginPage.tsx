import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { getApiErrorMessage } from '@/api/apiError'
import { LoginForm } from '@/features/auth/ui/LoginForm'

export function LoginPage () {
  const token = useAuthStore((s) => s.token)
  const login = useLogin()

  if (token) return <Navigate to='/products' replace />

  return (
    <div className='mx-auto w-full max-w-md'>
      <h1 className='text-2xl font-semibold'>Login</h1>
      <p className='mt-2 text-sm text-slate-300'>
        Inicia sesión para acceder a productos e importaciones.
      </p>

      <div className='mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <LoginForm
          defaultUser='admin'
          defaultPassword='admin123'
          isLoading={login.isPending}
          error={login.isError ? getApiErrorMessage(login.error) : undefined}
          onSubmit={(values) => login.mutate(values)}
        />
      </div>
    </div>
  )
}
