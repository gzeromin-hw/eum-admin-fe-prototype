import type { EdgeRow } from '@/utils/neo4j.utils'
import mockData from '@/data/neo4j.json'

export interface ExecuteQueryResponse {
  data: EdgeRow[]
  status: 'success' | 'error'
  message?: string
  result?: Record<string, unknown>
}

// TODO: Replace with real API call when backend is ready
export async function executeNeo4jQuery(
  _query: string,
  _mode: 'natural' | 'cypher' = 'cypher',
): Promise<ExecuteQueryResponse> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    status: 'success',
    result: mockData.result as Record<string, unknown>,
    data: mockData.data as EdgeRow[],
  }
}
