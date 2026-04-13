export interface GraphSchemaDto {
  id: number
  domain: string
  version: string
  description: string
  source_format: string
  is_active: boolean
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

export interface GraphSchemasResponseDto {
  schemas: GraphSchemaDto[]
  total: number
}

export interface GraphSchemaImportResponseDto {
  id: number
  domain: string
  version: string
  is_active: boolean
  created_at: string
}
