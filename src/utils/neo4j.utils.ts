import type { Node, Relationship } from '@neo4j-nvl/base'

export interface EdgeRow {
  sourceId: number
  sourceLabels: string[] | null
  sourceProps: Record<string, unknown> | null
  targetId: number
  targetLabels: string[] | null
  targetProps: Record<string, unknown> | null
  relId: number
  relType: string
  relProps: Record<string, unknown> | null
}

const LABEL_COLORS = [
  '#4586F3',
  '#22C55E',
  '#9B4EF5',
  '#F97316',
  '#EC4899',
  '#EAB308',
  '#14B8A6',
  '#6665E8',
]

const labelColorMap = new Map<string, string>()

export function getLabelColor(label: string): string {
  if (!labelColorMap.has(label)) {
    labelColorMap.set(
      label,
      LABEL_COLORS[labelColorMap.size % LABEL_COLORS.length],
    )
  }
  return labelColorMap.get(label)!
}

function captionFromProps(
  props: Record<string, unknown> | null,
  id: number,
): string {
  if (!props) return String(id)
  const keys = ['hasCode', '업체명', '기관명', '계약건명', 'name', 'title']
  for (const k of keys) {
    if (props[k]) return String(props[k])
  }
  if (props.uri) {
    const fragment = String(props.uri).split('#')[1]
    if (fragment) return fragment
  }
  return String(id)
}

function primaryLabel(labels: string[] | null): string {
  return labels?.find(l => l !== 'ABoxNode') ?? labels?.[0] ?? ''
}

export function transformCypherRows(edgeRows: EdgeRow[]): {
  nodes: Node[]
  relationships: Relationship[]
} {
  const nodeMap = new Map<number, Node>()
  const relationships: Relationship[] = []

  for (const row of edgeRows) {
    if (!nodeMap.has(row.sourceId)) {
      nodeMap.set(row.sourceId, {
        id: String(row.sourceId),
        caption: captionFromProps(row.sourceProps, row.sourceId),
        color: getLabelColor(primaryLabel(row.sourceLabels)),
        size: 30,
      })
    }
    if (!nodeMap.has(row.targetId)) {
      nodeMap.set(row.targetId, {
        id: String(row.targetId),
        caption: captionFromProps(row.targetProps, row.targetId),
        color: getLabelColor(primaryLabel(row.targetLabels)),
        size: 30,
      })
    }
    relationships.push({
      id: String(row.relId),
      from: String(row.sourceId),
      to: String(row.targetId),
      caption: row.relType,
    })
  }

  return { nodes: Array.from(nodeMap.values()), relationships }
}

/** degree 합산 기준으로 엣지를 정렬 후, 총 노드 수가 nodeLimit을 넘지 않도록 그리디하게 엣지 수집 */
export function getPreviewRows(
  edgeRows: EdgeRow[],
  nodeLimit: number,
): EdgeRow[] {
  const degree = new Map<number, number>()
  for (const row of edgeRows) {
    degree.set(row.sourceId, (degree.get(row.sourceId) ?? 0) + 1)
    degree.set(row.targetId, (degree.get(row.targetId) ?? 0) + 1)
  }

  const sorted = [...edgeRows].sort(
    (a, b) =>
      (degree.get(b.sourceId) ?? 0) +
      (degree.get(b.targetId) ?? 0) -
      ((degree.get(a.sourceId) ?? 0) + (degree.get(a.targetId) ?? 0)),
  )

  const nodes = new Set<number>()
  const result: EdgeRow[] = []
  for (const row of sorted) {
    const newCount =
      (nodes.has(row.sourceId) ? 0 : 1) + (nodes.has(row.targetId) ? 0 : 1)
    if (nodes.size + newCount > nodeLimit) continue
    nodes.add(row.sourceId)
    nodes.add(row.targetId)
    result.push(row)
  }
  return result
}

export function parseNeo4jToolOutput(toolOutput: string): EdgeRow[] | null {
  try {
    const parsed = JSON.parse(toolOutput)
    if (parsed?.result?.status === 'success' && Array.isArray(parsed?.data)) {
      return parsed.data as EdgeRow[]
    }
  } catch {
    // ignore
  }
  return null
}
