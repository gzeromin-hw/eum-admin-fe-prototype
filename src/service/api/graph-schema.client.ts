import { httpClient } from '../http/client'
import {
  GraphSchemasResponseDto,
  GraphSchemaImportResponseDto,
} from '../dtos/graph-schema.dto'

const GRAPH_SCHEMA_API_BASE = '/api/graph-schema'

class GraphSchemaClient {
  async getAllSchemas(): Promise<GraphSchemasResponseDto> {
    const res = await httpClient.get<GraphSchemasResponseDto>(
      `${GRAPH_SCHEMA_API_BASE}/schemas`,
    )
    return res.data
  }

  async importYaml(
    file: File,
    setActive: boolean,
  ): Promise<GraphSchemaImportResponseDto> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await httpClient.post<GraphSchemaImportResponseDto>(
      `${GRAPH_SCHEMA_API_BASE}/import-yaml`,
      formData,
      {
        params: { set_active: setActive },
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return res.data
  }
}

export const graphSchemaClient = new GraphSchemaClient()
