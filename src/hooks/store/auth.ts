import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  UserResponseDto,
} from '@/service/dtos/account.dto'
import { usersClient } from '@/service/api/account.client'

const REFRESH_BUFFER_MS = 10 * 60 * 1000

// 서버에서 쿠키를 관리하므로 클라이언트에서 별도로 설정/삭제할 필요 없음

interface AuthState {
  isAuthenticated: boolean
  isHydrated: boolean
  user: UserResponseDto | null
  accessTokenExpiresAt: number | null
  refreshTokenExpiresAt: number | null
  login: (user: UserResponseDto) => void
  setHydrated: (hydrated: boolean) => void
  logout: () => Promise<void>
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      isHydrated: false,
      user: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      login: user => {
        set({ isAuthenticated: true, user })
      },
      setHydrated: hydrated => {
        set({ isHydrated: hydrated })
      },
      logout: async () => {
        try {
          await usersClient.logout()
        } finally {
          clearStoredTokenExpiry()
          set({ isAuthenticated: false, user: null })
        }
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
        refreshTokenExpiresAt: state.refreshTokenExpiresAt,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true)
      },
    },
  ),
)

export const setTokenExpiryFromLogin = (data: LoginResponseDto): void => {
  const now = Date.now()
  useAuthStore.setState({
    accessTokenExpiresAt:
      now + Math.max(0, data.access_token_expires_in) * 1000,
    refreshTokenExpiresAt:
      now + Math.max(0, data.refresh_token_expires_in) * 1000,
  })
}

export const setTokenExpiryFromRefresh = (
  data: RefreshTokenResponseDto,
): void => {
  useAuthStore.setState({
    accessTokenExpiresAt:
      Date.now() + Math.max(0, data.access_token_expires_in) * 1000,
  })
}

export const shouldRefreshAccessToken = (
  bufferMs: number = REFRESH_BUFFER_MS,
): boolean => {
  const accessTokenExpiresAt = useAuthStore.getState().accessTokenExpiresAt
  if (!accessTokenExpiresAt) return false

  return accessTokenExpiresAt - Date.now() <= bufferMs
}

export const clearStoredTokenExpiry = (): void => {
  useAuthStore.setState({
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
  })
}

export default useAuthStore
