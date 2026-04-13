'use client'

import { useMemo, useRef, useState } from 'react'
import BaseButton from '@/components/molecules/BaseButton'
import {
  addEdge,
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type SchemaNodeData = {
  label: string
}

const initialNodes: Node<SchemaNodeData>[] = [
  {
    id: '1',
    position: { x: 140, y: 120 },
    data: { label: 'Node Label' },
    style: {
      background: '#b00053',
      color: '#ffffff',
      border: '4px solid #1f1f24',
      width: 114,
      height: 114,
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: 12,
    },
  },
  {
    id: '2',
    position: { x: 730, y: 210 },
    data: { label: 'Node Label' },
    style: {
      background: '#b00053',
      color: '#ffffff',
      border: '4px solid #1f1f24',
      width: 114,
      height: 114,
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: 12,
    },
  },
  {
    id: '3',
    position: { x: 280, y: 360 },
    data: { label: 'Node Label' },
    style: {
      background: '#b00053',
      color: '#ffffff',
      border: '4px solid #1f1f24',
      width: 114,
      height: 114,
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: 12,
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: ':FRIEND',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#3a3438',
    },
    style: { stroke: '#3a3438', strokeWidth: 2.3 },
    labelStyle: {
      fill: '#f3f3f4',
      fontWeight: 700,
      fontSize: 12,
      background: '#3a3438',
    },
    labelBgStyle: {
      fill: '#3a3438',
      fillOpacity: 1,
      rx: 1,
      ry: 1,
    },
    labelBgPadding: [10, 6],
    labelBgBorderRadius: 2,
  },
]

const circleNodeStyle = {
  background: '#b00053',
  color: '#ffffff',
  border: '4px solid #1f1f24',
  width: 114,
  height: 114,
  borderRadius: '9999px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 12,
}

const edgeBaseStyle = {
  stroke: '#3a3438',
  strokeWidth: 2.3,
}

const edgeLabelStyle = {
  fill: '#f3f3f4',
  fontWeight: 700,
  fontSize: 12,
}

function sanitizeIdentifier(raw: string, fallback: string) {
  const normalized = raw
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^A-Za-z0-9_]/g, '')
  return normalized.length > 0 ? normalized : fallback
}

export default function ReactFlowTestPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const nodeSeqRef = useRef(4)
  const edgeSeqRef = useRef(2)

  const [newNodeLabel, setNewNodeLabel] = useState('Node Label')
  const [newRelationType, setNewRelationType] = useState('FRIEND')
  const [selectedSourceId, setSelectedSourceId] = useState('1')
  const [selectedTargetId, setSelectedTargetId] = useState('2')

  const addNode = () => {
    const nextId = `${nodeSeqRef.current}`
    nodeSeqRef.current += 1

    const seedX = 120 + ((nodes.length + 1) % 5) * 160
    const seedY = 100 + Math.floor((nodes.length + 1) / 5) * 170

    setNodes(prev => [
      ...prev,
      {
        id: nextId,
        position: { x: seedX, y: seedY },
        data: { label: newNodeLabel.trim() || 'Node Label' },
        style: circleNodeStyle,
      },
    ])

    if (!selectedSourceId) {
      setSelectedSourceId(nextId)
    }
    if (!selectedTargetId) {
      setSelectedTargetId(nextId)
    }
  }

  const addRelationship = (
    sourceId: string,
    targetId: string,
    relationType: string,
  ) => {
    if (!sourceId || !targetId || sourceId === targetId) {
      return
    }

    const hasDuplicate = edges.some(
      edge =>
        edge.source === sourceId &&
        edge.target === targetId &&
        (edge.label as string) ===
          `:${sanitizeIdentifier(relationType, 'RELATES_TO').toUpperCase()}`,
    )

    if (hasDuplicate) {
      return
    }

    const edgeId = `e-${edgeSeqRef.current}`
    edgeSeqRef.current += 1
    const safeType = sanitizeIdentifier(
      relationType,
      'RELATES_TO',
    ).toUpperCase()

    setEdges(prev => [
      ...prev,
      {
        id: edgeId,
        source: sourceId,
        target: targetId,
        label: `:${safeType}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3a3438',
        },
        style: edgeBaseStyle,
        labelStyle: edgeLabelStyle,
        labelBgStyle: {
          fill: '#3a3438',
          fillOpacity: 1,
          rx: 1,
          ry: 1,
        },
        labelBgPadding: [10, 6],
        labelBgBorderRadius: 2,
      },
    ])
  }

  const onConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) {
      return
    }

    const safeType = sanitizeIdentifier(
      newRelationType,
      'RELATES_TO',
    ).toUpperCase()

    setEdges(prev =>
      addEdge(
        {
          ...connection,
          id: `e-${edgeSeqRef.current++}`,
          label: `:${safeType}`,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3a3438',
          },
          style: edgeBaseStyle,
          labelStyle: edgeLabelStyle,
          labelBgStyle: {
            fill: '#3a3438',
            fillOpacity: 1,
            rx: 1,
            ry: 1,
          },
          labelBgPadding: [10, 6],
          labelBgBorderRadius: 2,
        },
        prev,
      ),
    )
  }

  const cypherPreview = useMemo(() => {
    const aliasMap = new Map<string, string>()

    const nodeLines = nodes.map((node, index) => {
      const nodeAlias = `n${index + 1}`
      aliasMap.set(node.id, nodeAlias)
      const safeLabel = sanitizeIdentifier(
        node.data.label || 'Entity',
        'Entity',
      )
      const escapedName = (node.data.label || 'Node Label').replace(/'/g, "\\'")

      return `CREATE (${nodeAlias}:${safeLabel} {name: '${escapedName}'})`
    })

    const edgeLines = edges
      .map(edge => {
        const sourceAlias = aliasMap.get(edge.source)
        const targetAlias = aliasMap.get(edge.target)
        const rawType =
          typeof edge.label === 'string'
            ? edge.label.replace(':', '')
            : 'RELATES_TO'
        const safeType = sanitizeIdentifier(rawType, 'RELATES_TO').toUpperCase()

        if (!sourceAlias || !targetAlias) {
          return ''
        }

        return `CREATE (${sourceAlias})-[:${safeType}]->(${targetAlias})`
      })
      .filter(Boolean)

    return [...nodeLines, ...edgeLines].join('\n')
  }, [nodes, edges])

  const nodeOptions = nodes.map(node => ({
    id: node.id,
    label: node.data.label || `Node ${node.id}`,
  }))

  return (
    <div className="bg-background-normal text-normal flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      <div className="border-line-neutral mb-4 flex flex-wrap items-end justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold">리액트 플로우 테스트</h1>
          <p className="text-assistive text-sm">
            노드를 추가하고 관계를 연결해 그래프를 편집합니다.
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="bg-background-neutral border-line-neutral flex min-h-0 flex-col gap-4 border p-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">노드 생성</div>
            <input
              value={newNodeLabel}
              onChange={e => setNewNodeLabel(e.target.value)}
              placeholder="예: Person"
              className="bg-modal-background-alternative border-line-alternative focus:border-primary-normal h-10 border px-3 text-sm outline-none"
            />
            <BaseButton
              size="medium"
              className="rounded-none"
              onClick={addNode}
            >
              노드 추가
            </BaseButton>
          </div>

          <div className="border-line-neutral flex flex-col gap-2 border-t pt-4">
            <div className="text-sm font-semibold">관계 타입</div>
            <input
              value={newRelationType}
              onChange={e => setNewRelationType(e.target.value)}
              placeholder="예: FRIEND"
              className="bg-modal-background-alternative border-line-alternative focus:border-primary-normal h-10 border px-3 text-sm outline-none"
            />
            <p className="text-assistive text-xs">
              캔버스에서 노드를 드래그 연결할 때 이 타입이 사용됩니다.
            </p>
          </div>

          <div className="border-line-neutral flex flex-col gap-2 border-t pt-4">
            <div className="text-sm font-semibold">수동 관계 생성</div>
            <select
              value={selectedSourceId}
              onChange={e => setSelectedSourceId(e.target.value)}
              className="bg-modal-background-alternative border-line-alternative h-10 border px-3 text-sm"
            >
              {nodeOptions.map(node => (
                <option key={`source-${node.id}`} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
            <select
              value={selectedTargetId}
              onChange={e => setSelectedTargetId(e.target.value)}
              className="bg-modal-background-alternative border-line-alternative h-10 border px-3 text-sm"
            >
              {nodeOptions.map(node => (
                <option key={`target-${node.id}`} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
            <BaseButton
              size="medium"
              variant="gray"
              className="rounded-none"
              onClick={() =>
                addRelationship(
                  selectedSourceId,
                  selectedTargetId,
                  newRelationType,
                )
              }
            >
              관계 생성
            </BaseButton>
          </div>

          <div className="border-line-neutral min-h-0 flex-1 border-t pt-4">
            <div className="mb-2 text-sm font-semibold">Cypher Preview</div>
            <pre className="bg-background-normal border-line-neutral h-[220px] overflow-auto border p-3 text-xs leading-5 whitespace-pre-wrap">
              {cypherPreview || "CREATE (:Entity {name: 'Node Label'})"}
            </pre>
          </div>
        </aside>

        <section className="border-line-neutral bg-background-neutral relative min-h-[480px] overflow-hidden border">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            defaultEdgeOptions={{
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#3a3438',
              },
              style: edgeBaseStyle,
            }}
          >
            <Background color="#d4d4d8" gap={22} />
            <MiniMap
              nodeColor={() => '#b00053'}
              nodeStrokeColor={() => '#1f1f24'}
              maskColor="rgba(0,0,0,0.07)"
              className="!border-line-neutral !bg-background-normal !rounded-none !border"
            />
            <Controls className="!border-line-neutral !bg-background-normal !rounded-none !border" />
          </ReactFlow>
        </section>
      </div>
    </div>
  )
}
