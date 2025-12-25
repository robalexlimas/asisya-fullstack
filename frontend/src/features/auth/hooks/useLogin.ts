import { useMutation } from '@tanstack/react-query'
import { login } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function useLogin() {
    const setToken = useAuthStore((s) => s.setToken)

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setToken(data.token)
        }
    })
}