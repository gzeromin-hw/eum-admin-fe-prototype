'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { InteractiveNvlWrapper } from '@neo4j-nvl/react'
import type { Node, Relationship } from '@neo4j-nvl/base'
import type NVL from '@neo4j-nvl/base'
import { useTranslations } from 'next-intl'
import {
  EdgeRow,
  getLabelColor,
  transformCypherRows,
} from '@/utils/neo4j.utils'

interface Props {
  edgeRows: EdgeRow[]
}

const BASE_NVL_OPTIONS = {
  layout: 'forceDirected' as const,
  renderer: 'canvas' as const,
  disableWebWorkers: true,
  disableTelemetry: true,
  styling: {
    defaultRelationshipColor: '#aaaaaa',
  },
}

function PropsRows({
  nodeId,
  nodeIdToProps,
  className,
}: {
  nodeId: string
  nodeIdToProps: Map<string, Record<string, unknown>>
  className?: string
}) {
  const entries = Object.entries(nodeIdToProps.get(nodeId) ?? {}).filter(
    ([, v]) => v !== null && v !== undefined,
  )
  if (entries.length === 0) return null
  return (
    <div className={`flex flex-col gap-0.5 ${className ?? ''}`}>
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-1 text-[10px]">
          <span className="text-primary-normal shrink-0 font-medium">{k}:</span>
          <span className="text-normal min-w-0 break-all">{String(v)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Neo4jGraphEmbed({ edgeRows }: Props) {
  const $t = useTranslations('Neo4jGraph')
  const nvlRef = useRef<NVL>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedRel, setSelectedRel] = useState<Relationship | null>(null)
  const [activeLabels, setActiveLabels] = useState<Set<string>>(new Set())
  const [showOnlyConnected, setShowOnlyConnected] = useState(false)
  const [accumulatedNodeIds, setAccumulatedNodeIds] = useState<Set<string>>(
    new Set(),
  )
  const prevSelectedRelIdRef = useRef<string | null>(null)

  const { nodes: allNodes, relationships: allRels } = useMemo(
    () => transformCypherRows(edgeRows),
    [edgeRows],
  )

  // 전체 레이블
  const allLabels = useMemo(() => {
    const set = new Set<string>()
    edgeRows.forEach(r => {
      ;(r.sourceLabels ?? [])
        .filter(l => l !== 'ABoxNode')
        .forEach(l => set.add(l))
      ;(r.targetLabels ?? [])
        .filter(l => l !== 'ABoxNode')
        .forEach(l => set.add(l))
    })
    return Array.from(set)
  }, [edgeRows])

  // 마운트 시 모든 레이블 활성화
  useEffect(() => {
    setActiveLabels(new Set(allLabels))
    setSelectedNode(null)
    setSelectedRel(null)
    setShowOnlyConnected(false)
    setAccumulatedNodeIds(new Set())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeRows])

  // nodeId → props / primaryLabel 맵
  const { nodeIdToProps, nodeIdToLabel } = useMemo(() => {
    const nodeIdToProps = new Map<string, Record<string, unknown>>()
    const nodeIdToLabel = new Map<string, string>()
    edgeRows.forEach(r => {
      if (r.sourceProps) nodeIdToProps.set(String(r.sourceId), r.sourceProps)
      if (r.targetProps) nodeIdToProps.set(String(r.targetId), r.targetProps)
      nodeIdToLabel.set(
        String(r.sourceId),
        (r.sourceLabels ?? []).find(l => l !== 'ABoxNode') ??
          r.sourceLabels?.[0] ??
          '',
      )
      nodeIdToLabel.set(
        String(r.targetId),
        (r.targetLabels ?? []).find(l => l !== 'ABoxNode') ??
          r.targetLabels?.[0] ??
          '',
      )
    })
    return { nodeIdToProps, nodeIdToLabel }
  }, [edgeRows])

  // 선택된 노드와 직접 연결된 관계 목록
  const selectedNodeConnectedRels = useMemo(
    () =>
      selectedNode
        ? allRels.filter(
            r => r.from === selectedNode.id || r.to === selectedNode.id,
          )
        : [],
    [selectedNode, allRels],
  )

  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return null
    const ids = new Set<string>([selectedNode.id])
    selectedNodeConnectedRels.forEach(r => {
      ids.add(r.from)
      ids.add(r.to)
    })
    return ids
  }, [selectedNode, selectedNodeConnectedRels])

  const nodeConnections = useMemo(() => {
    const map = new Map<string, Set<string>>()
    allRels.forEach(r => {
      if (!map.has(r.from)) map.set(r.from, new Set([r.from]))
      if (!map.has(r.to)) map.set(r.to, new Set([r.to]))
      map.get(r.from)!.add(r.to)
      map.get(r.to)!.add(r.from)
    })
    return map
  }, [allRels])

  // 선택된 관계 라벨 강조
  useEffect(() => {
    const prevId = prevSelectedRelIdRef.current
    if (prevId) {
      try {
        nvlRef.current?.updateElementsInGraph(
          [],
          [{ id: prevId, captionSize: 1 }],
        )
      } catch {}
    }
    if (selectedRel) {
      try {
        nvlRef.current?.updateElementsInGraph(
          [],
          [{ id: selectedRel.id, captionSize: 1.5 }],
        )
      } catch {}
    }
    prevSelectedRelIdRef.current = selectedRel?.id ?? null
  }, [selectedRel])

  // showOnlyConnected 필터
  const nodesBeforeLabelFilter = useMemo(() => {
    if (showOnlyConnected && accumulatedNodeIds.size > 0) {
      return allNodes.filter(n => accumulatedNodeIds.has(n.id))
    }
    return allNodes
  }, [allNodes, showOnlyConnected, accumulatedNodeIds])

  const visibleLabels = useMemo(() => {
    const set = new Set<string>()
    nodesBeforeLabelFilter.forEach(n => {
      const label = nodeIdToLabel.get(n.id)
      if (label) set.add(label)
    })
    return Array.from(set)
  }, [nodesBeforeLabelFilter, nodeIdToLabel])

  const filteredNodes = useMemo(() => {
    if (visibleLabels.every(l => activeLabels.has(l)))
      return nodesBeforeLabelFilter
    return nodesBeforeLabelFilter.filter(n =>
      activeLabels.has(nodeIdToLabel.get(n.id) ?? ''),
    )
  }, [nodesBeforeLabelFilter, activeLabels, visibleLabels, nodeIdToLabel])

  const filteredRels = useMemo(() => {
    const nodeIdSet = new Set(filteredNodes.map(n => n.id))
    return allRels.filter(r => nodeIdSet.has(r.from) && nodeIdSet.has(r.to))
  }, [allRels, filteredNodes])

  const nodeById = useMemo(
    () => new Map(allNodes.map(n => [n.id, n])),
    [allNodes],
  )

  // 레이블 필터 변경 시 NVL 선택 상태 재적용
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        nvlRef.current?.deselectAll()
        if (selectedRel && filteredRels.some(r => r.id === selectedRel.id)) {
          nvlRef.current?.updateElementsInGraph(
            [],
            [{ id: selectedRel.id, selected: true }],
          )
        } else if (
          selectedNode &&
          filteredNodes.some(n => n.id === selectedNode.id)
        ) {
          nvlRef.current?.updateElementsInGraph(
            [{ id: selectedNode.id, selected: true }],
            [],
          )
          nvlRef.current?.fit(
            connectedNodeIds ? Array.from(connectedNodeIds) : [selectedNode.id],
            { maxZoom: 1 },
          )
        }
      } catch {}
    }, 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredNodes, filteredRels])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => e.preventDefault()
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const cbRef = useRef({
    showOnlyConnected,
    nodeConnections,
    selectedNode,
    selectedRel,
  })
  cbRef.current = {
    showOnlyConnected,
    nodeConnections,
    selectedNode,
    selectedRel,
  }

  const mouseEventCallbacks = useMemo(
    () => ({
      onZoom: true as const,
      onPan: true as const,
      onDrag: true as const,
      onNodeClick: (node: Node) => {
        if (cbRef.current.selectedNode?.id === node.id) {
          setSelectedNode(null)
          return
        }
        setSelectedRel(null)
        setSelectedNode(node)
        if (cbRef.current.showOnlyConnected) {
          setAccumulatedNodeIds(prev => {
            const next = new Set(prev)
            next.add(node.id)
            cbRef.current.nodeConnections
              .get(node.id)
              ?.forEach(id => next.add(id))
            return next
          })
        }
      },
      onRelationshipClick: (rel: Relationship) => {
        if (cbRef.current.selectedRel?.id === rel.id) {
          setSelectedRel(null)
          return
        }
        setSelectedNode(null)
        setSelectedRel(rel)
      },
      onCanvasClick: () => {
        setSelectedNode(null)
        setSelectedRel(null)
      },
    }),
    [],
  )

  return (
    <div
      className="border-line-normal bg-background-normal flex overflow-hidden border"
      style={{ height: 520 }}
    >
      {/* 사이드바 */}
      <div className="bg-background-neutral border-line-normal text-normal flex w-60 shrink-0 flex-col overflow-hidden border-r">
        {/* 스크롤 가능한 영역 */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {/* 레이블 필터 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-assistive text-xs">{$t('labels')}</p>
              <button
                className="text-neutral hover:text-strong cursor-pointer text-xs transition-colors"
                onClick={() =>
                  setActiveLabels(
                    visibleLabels.every(l => activeLabels.has(l))
                      ? new Set(
                          [...activeLabels].filter(
                            l => !visibleLabels.includes(l),
                          ),
                        )
                      : new Set([...activeLabels, ...visibleLabels]),
                  )
                }
              >
                {visibleLabels.every(l => activeLabels.has(l))
                  ? $t('deselectAll')
                  : $t('selectAll')}
              </button>
            </div>

            {/* showOnlyConnected 토글 */}
            <button
              className="bg-background-assistive border-line-normal mb-2 flex w-full cursor-pointer items-center justify-between border px-3 py-2 transition-all duration-200"
              onClick={() => {
                const next = !showOnlyConnected
                setShowOnlyConnected(next)
                if (next && selectedNode) {
                  const ids = new Set<string>([selectedNode.id])
                  nodeConnections
                    .get(selectedNode.id)
                    ?.forEach(id => ids.add(id))
                  setAccumulatedNodeIds(ids)
                } else {
                  setAccumulatedNodeIds(new Set())
                }
              }}
            >
              <span
                className={`text-xs font-medium transition-colors duration-200 ${showOnlyConnected ? 'text-strong' : 'text-neutral'}`}
              >
                {$t('showOnlyConnected')}
              </span>
              <span
                className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-all duration-200"
                style={
                  showOnlyConnected
                    ? {
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                      }
                    : { background: 'var(--line-normal)' }
                }
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{
                    transform: showOnlyConnected
                      ? 'translateX(18px)'
                      : 'translateX(3px)',
                  }}
                />
              </span>
            </button>

            {visibleLabels.map(label => {
              const isActive = activeLabels.has(label)
              return (
                <button
                  key={label}
                  className="-mx-1 mb-1 flex w-full cursor-pointer items-center gap-2 px-1 py-0.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() =>
                    setActiveLabels(prev => {
                      const next = new Set(prev)
                      if (next.has(label)) next.delete(label)
                      else next.add(label)
                      return next
                    })
                  }
                >
                  <span
                    className={`border-line-normal flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-all ${isActive ? 'border-transparent' : ''}`}
                    style={isActive ? { background: getLabelColor(label) } : {}}
                  >
                    {isActive && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path
                          d="M1 3l2 2 4-4"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`truncate text-xs transition-colors ${isActive ? 'text-strong' : 'text-assistive'}`}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 선택된 노드 정보 */}
          {selectedNode &&
            (() => {
              const connectedRels = selectedNodeConnectedRels
              const connectedOtherNodeCount = (connectedNodeIds?.size ?? 1) - 1
              return (
                <div className="border-line-normal border-t pt-3">
                  <p className="text-assistive mb-2 text-xs">
                    {$t('selectedNode')}
                  </p>
                  <p className="text-strong text-sm font-medium break-all">
                    {selectedNode.caption}
                  </p>
                  <PropsRows
                    nodeId={selectedNode.id}
                    nodeIdToProps={nodeIdToProps}
                    className="mt-2"
                  />
                  <div className="mt-3 flex gap-3">
                    <div className="bg-background-assistive border-line-normal flex flex-col items-center border px-3 py-2">
                      <span className="text-strong text-lg font-bold">
                        {connectedRels.length}
                      </span>
                      <span className="text-neutral text-[10px]">
                        {$t('connectedRelations')}
                      </span>
                    </div>
                    <div className="bg-background-assistive border-line-normal flex flex-col items-center border px-3 py-2">
                      <span className="text-strong text-lg font-bold">
                        {connectedOtherNodeCount}
                      </span>
                      <span className="text-neutral text-[10px]">
                        {$t('connectedNodes')}
                      </span>
                    </div>
                  </div>
                  {connectedRels.length > 0 && (
                    <div className="mt-3">
                      <p className="text-neutral mb-1.5 text-[10px]">
                        {$t('relationsLabel')}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {connectedRels.map(r => {
                          const otherId =
                            r.from === selectedNode.id ? r.to : r.from
                          const otherNode = nodeById.get(otherId)
                          return (
                            <li
                              key={r.id}
                              className="flex items-center gap-1.5 text-[11px]"
                            >
                              <span className="bg-background-assistive text-strong border-line-normal shrink-0 border px-1.5 py-0.5 font-mono text-[10px]">
                                {r.caption}
                              </span>
                              <span className="text-normal min-w-0 break-all">
                                {otherNode?.caption ?? otherId}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })()}

          {/* 선택된 관계 정보 */}
          {selectedRel &&
            (() => {
              const fromNode = nodeById.get(selectedRel.from)
              const toNode = nodeById.get(selectedRel.to)
              return (
                <div className="border-line-normal border-t pt-3">
                  <p className="text-assistive mb-2 text-xs">
                    {$t('selectedRelation')}
                  </p>
                  <span className="bg-background-assistive text-strong border-line-normal inline-block border px-2 py-0.5 text-xs font-semibold">
                    {selectedRel.caption}
                  </span>
                  <div className="mt-3 flex flex-col">
                    <div className="bg-background-assistive border-line-normal border px-3 py-2">
                      <p className="text-assistive mb-1 text-[10px]">
                        {$t('from')}
                      </p>
                      <p className="text-strong text-xs font-medium break-all">
                        {fromNode?.caption ?? selectedRel.from}
                      </p>
                      <PropsRows
                        nodeId={selectedRel.from}
                        nodeIdToProps={nodeIdToProps}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="text-assistive flex justify-center text-[10px] leading-none">
                      ↓
                    </div>
                    <div className="bg-background-assistive border-line-normal border px-3 py-2">
                      <p className="text-assistive mb-1 text-[10px]">
                        {$t('to')}
                      </p>
                      <p className="text-strong text-xs font-medium break-all">
                        {toNode?.caption ?? selectedRel.to}
                      </p>
                      <PropsRows
                        nodeId={selectedRel.to}
                        nodeIdToProps={nodeIdToProps}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              )
            })()}
        </div>

        {/* 하단 통계 */}
        <div className="border-line-normal text-assistive shrink-0 border-t px-4 py-3 text-xs">
          <span className="text-strong font-semibold">{allNodes.length}</span>
          {' nodes · '}
          <span className="text-strong font-semibold">{allRels.length}</span>
          {' relations'}
        </div>
      </div>

      {/* 그래프 */}
      <div
        ref={containerRef}
        className="bg-background-alternative relative flex-1"
      >
        <InteractiveNvlWrapper
          ref={nvlRef}
          nodes={filteredNodes}
          rels={filteredRels}
          nvlOptions={BASE_NVL_OPTIONS}
          nvlCallbacks={{
            onLayoutDone: () => setTimeout(() => nvlRef.current?.fit([]), 50),
          }}
          mouseEventCallbacks={mouseEventCallbacks}
          interactionOptions={{ selectOnClick: true }}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>
    </div>
  )
}
