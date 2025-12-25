import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
    token: string | null
    setToken: (token: string) => void
    clear: () => void
    isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            setToken: (token) => set({ token }),
            clear: () => set({ token: null }),
            isAuthenticated: () => Boolean(get().token)
        }),
        {
            name: 'asisya_auth' // localStorage key
        }
    )
)