export interface UserResponseDto {
  id: string
  alias: string
  user_id: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

export interface UserListResponseDto {
  total_count: number
  page: number
  users: UserResponseDto[]
}

export interface LoginRequestDto {
  user_id: string // max 64
  password: string // 8~64
}

export interface LoginResponseDto {
  access_token_expires_in: number
  refresh_token_expires_in: number
}

export interface RefreshTokenResponseDto {
  access_token_expires_in: number
}

export interface CreateUserRequestDto {
  alias: string // 2~32
  user_id: string // max 64
  password: string // 8~64
}

export interface UpdateUserRequestDto {
  alias?: string // 2~32
  password?: string // 8~64
}

export interface UserListQueryDto {
  page?: number
  items_per_page?: number
}
