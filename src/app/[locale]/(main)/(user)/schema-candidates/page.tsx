'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

type CandidateStatus = 'pending' | 'approved' | 'rejected'

interface EntityCandidate {
  id: string
  type: string
  label: string
  description: string
  properties: Record<string, any>
  status: CandidateStatus
}

interface RelationCandidate {
  id: string
  type: string
  source: string
  target: string
  description: string
  status: CandidateStatus
}

interface DocumentCandidates {
  id: string
  name: string
  date: string
  status: string
  source: string
  entityCount: number
  relationCount: number
  candidates: {
    entities: EntityCandidate[]
    relations: RelationCandidate[]
  }
}

interface SchemaCandidatesData {
  documents: DocumentCandidates[]
}

export default function SchemaCandidatesPage() {
  const [data, setData] = useState<SchemaCandidatesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/schema-candidates.json')
        const json = await response.json()
        setData(json)
      } catch (error) {
        console.error('Failed to load schema candidates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEntityAction = (
    documentId: string,
    entityId: string,
    action: 'approve' | 'reject',
  ) => {
    if (!data) return

    setData({
      ...data,
      documents: data.documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            candidates: {
              ...doc.candidates,
              entities: doc.candidates.entities.map(entity => {
                if (entity.id === entityId) {
                  return {
                    ...entity,
                    status: action === 'approve' ? 'approved' : 'rejected',
                  }
                }
                return entity
              }),
            },
          }
        }
        return doc
      }),
    })
  }

  const handleRelationAction = (
    documentId: string,
    relationId: string,
    action: 'approve' | 'reject',
  ) => {
    if (!data) return

    setData({
      ...data,
      documents: data.documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            candidates: {
              ...doc.candidates,
              relations: doc.candidates.relations.map(relation => {
                if (relation.id === relationId) {
                  return {
                    ...relation,
                    status: action === 'approve' ? 'approved' : 'rejected',
                  }
                }
                return relation
              }),
            },
          }
        }
        return doc
      }),
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>로딩 중...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>데이터를 불러올 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">스키마 후보 관리</h1>
        <p className="text-gray-600">
          추출된 엔티티와 관계를 검토하고 승인하거나 거부하세요.
          <br />
          승인된 항목은 스키마에 추가되어 향후 자동으로 추출됩니다.
        </p>
      </div>

      <div className="space-y-6">
        {data.documents.map(document => (
          <DocumentCard
            key={document.id}
            document={document}
            onEntityAction={handleEntityAction}
            onRelationAction={handleRelationAction}
          />
        ))}
      </div>
    </div>
  )
}

interface DocumentCardProps {
  document: DocumentCandidates
  onEntityAction: (
    documentId: string,
    entityId: string,
    action: 'approve' | 'reject',
  ) => void
  onRelationAction: (
    documentId: string,
    relationId: string,
    action: 'approve' | 'reject',
  ) => void
}

function DocumentCard({
  document,
  onEntityAction,
  onRelationAction,
}: DocumentCardProps) {
  const [expandedEntities, setExpandedEntities] = useState(false)
  const [expandedRelations, setExpandedRelations] = useState(false)

  const approvedEntityCount = document.candidates.entities.filter(
    e => e.status === 'approved',
  ).length
  const approvedRelationCount = document.candidates.relations.filter(
    r => r.status === 'approved',
  ).length

  return (
    <div className="border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-xl font-semibold">{document.name}</h2>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>📅 {document.date}</span>
              <span>📄 {document.source}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2 text-sm text-gray-600">
              엔티티: {approvedEntityCount}/{document.entityCount} 승인
            </div>
            <div className="text-sm text-gray-600">
              관계: {approvedRelationCount}/{document.relationCount} 승인
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-sm">
          <div className="bg-blue-100 px-3 py-1 text-blue-700">
            엔티티 후보 {document.candidates.entities.length}개
          </div>
          <div className="bg-purple-100 px-3 py-1 text-purple-700">
            관계 후보 {document.candidates.relations.length}개
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {/* 엔티티 섹션 */}
        <div>
          <button
            onClick={() => setExpandedEntities(!expandedEntities)}
            className="flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 p-4 text-left text-sm font-semibold hover:bg-gray-100"
          >
            <span>🆕 스키마 후보 엔티티</span>
            <span>{expandedEntities ? '▼' : '▶'}</span>
          </button>

          {expandedEntities && (
            <div className="divide-y divide-gray-200">
              {document.candidates.entities.map(entity => (
                <CandidateItemEntity
                  key={entity.id}
                  entity={entity}
                  onAction={action =>
                    onEntityAction(document.id, entity.id, action)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* 관계 섹션 */}
        <div>
          <button
            onClick={() => setExpandedRelations(!expandedRelations)}
            className="flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 p-4 text-left text-sm font-semibold hover:bg-gray-100"
          >
            <span>🔗 스키마 후보 관계</span>
            <span>{expandedRelations ? '▼' : '▶'}</span>
          </button>

          {expandedRelations && (
            <div className="divide-y divide-gray-200">
              {document.candidates.relations.map(relation => (
                <CandidateItemRelation
                  key={relation.id}
                  relation={relation}
                  onAction={action =>
                    onRelationAction(document.id, relation.id, action)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CandidateItemEntityProps {
  entity: EntityCandidate
  onAction: (action: 'approve' | 'reject') => void
}

function CandidateItemEntity({ entity, onAction }: CandidateItemEntityProps) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' },
    approved: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  }

  const config = statusConfig[entity.status]
  const StatusIcon = config.icon

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50">
      <div className={`mt-1 flex-shrink-0 rounded p-2 ${config.bg}`}>
        <StatusIcon className={`h-5 w-5 ${config.color}`} />
      </div>

      <div className="flex-grow">
        <div className="mb-1 flex items-center gap-2">
          <span className="inline-block bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
            {entity.type}
          </span>
          <span className="font-semibold text-gray-900">{entity.label}</span>
        </div>
        <p className="mb-2 text-sm text-gray-600">{entity.description}</p>
        {Object.keys(entity.properties).length > 0 && (
          <div className="mb-2 text-xs text-gray-500">
            <div className="mb-1 font-semibold">속성:</div>
            <div className="space-y-1">
              {Object.entries(entity.properties).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-700">{key}:</span>{' '}
                  <span className="text-gray-600">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 gap-2">
        {entity.status === 'pending' && (
          <>
            <Button
              size="sm"
              onClick={() => onAction('approve')}
              className="h-9 bg-green-600 text-white hover:bg-green-700"
            >
              승인
            </Button>
            <Button
              size="sm"
              onClick={() => onAction('reject')}
              variant="outline"
              className="h-9 border-red-300 text-red-600 hover:bg-red-50"
            >
              거부
            </Button>
          </>
        )}
        {entity.status === 'approved' && (
          <Button
            disabled
            size="sm"
            className="h-9 bg-green-100 text-green-700"
          >
            승인됨
          </Button>
        )}
        {entity.status === 'rejected' && (
          <Button disabled size="sm" variant="outline" className="h-9">
            거부됨
          </Button>
        )}
      </div>
    </div>
  )
}

interface CandidateItemRelationProps {
  relation: RelationCandidate
  onAction: (action: 'approve' | 'reject') => void
}

function CandidateItemRelation({
  relation,
  onAction,
}: CandidateItemRelationProps) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' },
    approved: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  }

  const config = statusConfig[relation.status]
  const StatusIcon = config.icon

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50">
      <div className={`mt-1 flex-shrink-0 rounded p-2 ${config.bg}`}>
        <StatusIcon className={`h-5 w-5 ${config.color}`} />
      </div>

      <div className="flex-grow">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-block bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
            {relation.type}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-3">
          <span className="inline-block bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
            {relation.source}
          </span>
          <span className="font-bold text-gray-500">→</span>
          <span className="inline-block bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
            {relation.target}
          </span>
        </div>
        <p className="text-sm text-gray-600">{relation.description}</p>
      </div>

      <div className="flex flex-shrink-0 gap-2">
        {relation.status === 'pending' && (
          <>
            <Button
              size="sm"
              onClick={() => onAction('approve')}
              className="h-9 bg-green-600 text-white hover:bg-green-700"
            >
              승인
            </Button>
            <Button
              size="sm"
              onClick={() => onAction('reject')}
              variant="outline"
              className="h-9 border-red-300 text-red-600 hover:bg-red-50"
            >
              거부
            </Button>
          </>
        )}
        {relation.status === 'approved' && (
          <Button
            disabled
            size="sm"
            className="h-9 bg-green-100 text-green-700"
          >
            승인됨
          </Button>
        )}
        {relation.status === 'rejected' && (
          <Button disabled size="sm" variant="outline" className="h-9">
            거부됨
          </Button>
        )}
      </div>
    </div>
  )
}
