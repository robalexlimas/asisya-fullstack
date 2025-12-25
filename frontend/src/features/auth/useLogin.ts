import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function useLogin () {
  const setToken = useAuthStore((s) => s.setToken)

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data.token)
    }
  })
}
