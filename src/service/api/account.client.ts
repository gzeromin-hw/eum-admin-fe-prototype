import { httpClient } from '../http/client'
import {
  setTokenExpiryFromLogin,
  setTokenExpiryFromRefresh,
} from '@/hooks/store/auth'
import {
  CreateUserRequestDto,
  LoginResponseDto,
  LoginRequestDto,
  RefreshTokenResponseDto,
  UpdateUserRequestDto,
  UserListQueryDto,
  UserListResponseDto,
  UserResponseDto,
} from '../dtos/account.dto'

const ACCOUNT_API_BASE = '/api/account'

class UsersClient {
  /** Auth */
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const res = await httpClient.post<LoginResponseDto>(
      `${ACCOUNT_API_BASE}/auth/login`,
      data,
    )
    setTokenExpiryFromLogin(res.data)
    return res.data
  }

  async refresh(): Promise<RefreshTokenResponseDto> {
    const res = await httpClient.post<RefreshTokenResponseDto>(
      `${ACCOUNT_API_BASE}/auth/refresh`,
    )
    setTokenExpiryFromRefresh(res.data)
    return res.data
  }

  async logout(): Promise<void> {
    await httpClient.post(`${ACCOUNT_API_BASE}/auth/logout`)
  }

  /** User */
  async createUser(data: CreateUserRequestDto): Promise<UserResponseDto> {
    const res = await httpClient.post<UserResponseDto>(
      `${ACCOUNT_API_BASE}/user`,
      data,
    )
    return res.data
  }

  async updateUser(
    targetUserId: string,
    data: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const res = await httpClient.put<UserResponseDto>(
      `${ACCOUNT_API_BASE}/user/${targetUserId}`,
      data,
    )
    return res.data
  }

  async listUsers(query?: UserListQueryDto): Promise<UserListResponseDto> {
    const res = await httpClient.get<UserListResponseDto>(
      `${ACCOUNT_API_BASE}/user/list`,
      { params: query },
    )
    return res.data
  }

  async me(): Promise<UserResponseDto> {
    const res = await httpClient.get<UserResponseDto>(
      `${ACCOUNT_API_BASE}/auth/me`,
    )
    return res.data
  }

  async deleteUser(targetUserId: number): Promise<void> {
    await httpClient.delete(`${ACCOUNT_API_BASE}/user/${targetUserId}`)
  }
}

export const usersClient = new UsersClient()
