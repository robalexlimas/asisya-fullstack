import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthState = {
    token: string | null
    setToken: (token: string) => void
    clear: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clear: () => set({ token: null })
        }),
        {
            name: 'asisya_auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ token: state.token })
        }
    )
)

window.addEventListener('storage', (e) => {
    if (e.key !== 'asisya_auth') return
    if (e.newValue === null) {
        useAuthStore.setState({ token: null })
    }
})