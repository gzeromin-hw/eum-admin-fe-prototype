import axios, { AxiosInstance } from 'axios'
import {
  setTokenExpiryFromRefresh,
  shouldRefreshAccessToken,
} from '@/hooks/store/auth'
import useAuthStore from '@/hooks/store/auth'
import { RefreshTokenResponseDto } from '../dtos/account.dto'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipTokenRefresh?: boolean
  }
}

function addInterceptor(instance: AxiosInstance): AxiosInstance {
  let refreshPromise: Promise<void> | null = null

  const shouldSkipRefresh = (
    url: string | undefined,
    skip?: boolean,
  ): boolean => {
    if (skip) return true

    return (
      url?.includes('/api/account/auth/login') === true ||
      url?.includes('/api/account/auth/refresh') === true ||
      url?.includes('/api/account/auth/logout') === true
    )
  }

  const refreshAccessToken = async (): Promise<void> => {
    if (!refreshPromise) {
      refreshPromise = instance
        .post<RefreshTokenResponseDto>('/api/account/auth/refresh', undefined, {
          skipTokenRefresh: true,
        })
        .then(res => {
          setTokenExpiryFromRefresh(res.data)
        })
        .catch(async error => {
          await useAuthStore.getState().logout()
          throw error
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    await refreshPromise
  }

  instance.interceptors.request.use(
    async config => {
      if (
        config.method === 'get' ||
        config.method === 'post' ||
        config.method === 'put'
      ) {
        config.timeout = 600000
      }

      if (
        typeof window !== 'undefined' &&
        !shouldSkipRefresh(config.url, config.skipTokenRefresh) &&
        shouldRefreshAccessToken()
      ) {
        await refreshAccessToken()
      }

      return config
    },
    error => Promise.reject(error),
  )

  instance.interceptors.response.use(
    response => response,
    error => {
      if (
        error?.config &&
        Object.prototype.hasOwnProperty.call(error.config, 'errorHandle') &&
        !error.config.errorHandle
      ) {
        return Promise.reject(error)
      }

      if (
        error.response?.status === 400 ||
        error.response?.status === 402 ||
        error.response?.status === 412 ||
        error.response?.status === 500 ||
        error.response?.status === 503
      ) {
        return Promise.reject(error)
      }

      return Promise.reject(error)
    },
  )
  return instance
}

const httpClient: AxiosInstance = addInterceptor(
  axios.create({
    baseURL:
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_PREFIX
        : '',
    withCredentials: true,
    headers: {
      Accept: '*/*',
      'Content-type': 'application/json',
    },
  }),
)

export { httpClient }
