'use client'

import { useEffect, useMemo, useState } from 'react'
import BaseButton from '@/components/molecules/BaseButton'
import BaseInput from '@/components/molecules/BaseInput'
import useSchemaSelectorStore from '@/hooks/store/schema-selector'
import { formatDate } from '@/utils/date.util'

export interface SchemaHistoryItem {
  id: string
  revision: string
  changedByName: string
  changedAt: string
  changeSummary: string
  content: string
}

function sortSchemaHistoryDesc(a: SchemaHistoryItem, b: SchemaHistoryItem) {
  const changedAtDiff =
    new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()

  if (changedAtDiff !== 0) {
    return changedAtDiff
  }

  return b.revision.localeCompare(a.revision, undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function getLatestHistory(schema: SchemaDocument) {
  return [...schema.histories].sort(sortSchemaHistoryDesc)[0]
}

function incrementRevision(revision: string) {
  const matched = revision.match(/^v(\d+)\.(\d+)$/i)

  if (!matched) {
    return 'v1.0'
  }

  return `v${matched[1]}.${Number(matched[2]) + 1}`
}

export interface SchemaDocument {
  id: string
  name: string
  description: string
  updatedAt: string
  status: 'active' | 'draft'
  content: string
  histories: SchemaHistoryItem[]
}

interface SchemaManagementMockViewProps {
  initialSchemas: SchemaDocument[]
}

export default function SchemaManagementMockView({
  initialSchemas,
}: SchemaManagementMockViewProps) {
  const [schemas, setSchemas] = useState<SchemaDocument[]>(initialSchemas)
  const selectedId = useSchemaSelectorStore(state => state.selectedId)
  const setSelectedId = useSchemaSelectorStore(state => state.setSelectedId)
  const setOptions = useSchemaSelectorStore(state => state.setOptions)
  const [editingId, setEditingId] = useState<string>('')
  const [draftMap, setDraftMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      initialSchemas.map(schema => [
        schema.id,
        getLatestHistory(schema)?.content ?? schema.content,
      ]),
    ),
  )
  const [summaryDraftMap, setSummaryDraftMap] = useState<
    Record<string, string>
  >(() => Object.fromEntries(initialSchemas.map(schema => [schema.id, ''])))
  const [selectedHistoryMap, setSelectedHistoryMap] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      initialSchemas.map(schema => [
        schema.id,
        getLatestHistory(schema)?.id ?? '',
      ]),
    ),
  )

  const selectedSchema = useMemo(() => {
    return schemas.find(schema => schema.id === selectedId)
  }, [schemas, selectedId])

  useEffect(() => {
    setOptions(
      schemas.map(schema => ({
        id: schema.id,
        label: schema.name,
        statusLabel: schema.status === 'active' ? '운영' : '초안',
      })),
    )
  }, [schemas, setOptions])

  const sortedHistories = useMemo(() => {
    if (!selectedSchema) {
      return []
    }

    return [...selectedSchema.histories].sort(sortSchemaHistoryDesc)
  }, [selectedSchema])

  const currentHistory = sortedHistories[0]
  const selectedHistoryId = selectedSchema
    ? (selectedHistoryMap[selectedSchema.id] ?? currentHistory?.id ?? '')
    : ''

  const selectedHistory = useMemo(() => {
    if (!selectedSchema) {
      return undefined
    }

    return (
      selectedSchema.histories.find(
        history => history.id === selectedHistoryId,
      ) ?? currentHistory
    )
  }, [currentHistory, selectedHistoryId, selectedSchema])

  const isEditing = editingId.length > 0 && selectedSchema?.id === editingId

  const draftContent = selectedSchema
    ? (draftMap[selectedSchema.id] ??
      selectedHistory?.content ??
      selectedSchema.content)
    : ''

  const draftSummary = selectedSchema
    ? (summaryDraftMap[selectedSchema.id] ?? '')
    : ''

  const hasChanges = Boolean(
    selectedSchema &&
      selectedHistory &&
      draftContent !== selectedHistory.content,
  )

  const nextRevisionPreview = incrementRevision(
    currentHistory?.revision ?? 'v0.0',
  )

  const selectHistory = (schemaId: string, historyId: string) => {
    setSelectedId(schemaId)
    setEditingId('')
    setSelectedHistoryMap(prev => ({
      ...prev,
      [schemaId]: historyId,
    }))
  }

  const openEditor = (id: string) => {
    const schema = schemas.find(item => item.id === id)
    const nextSelectedHistoryId =
      selectedHistoryMap[id] ??
      (schema ? (getLatestHistory(schema)?.id ?? '') : '')
    const history = schema?.histories.find(
      item => item.id === nextSelectedHistoryId,
    )

    setSelectedId(id)
    setEditingId(id)
    setDraftMap(prev => ({
      ...prev,
      [id]: history?.content ?? schema?.content ?? '',
    }))
    setSummaryDraftMap(prev => ({
      ...prev,
      [id]: '',
    }))
  }

  const handleDraftChange = (value: string) => {
    if (!selectedSchema) {
      return
    }

    setDraftMap(prev => ({
      ...prev,
      [selectedSchema.id]: value,
    }))
  }

  const handleCancel = () => {
    if (!selectedSchema || !selectedHistory) {
      return
    }

    setDraftMap(prev => ({
      ...prev,
      [selectedSchema.id]: selectedHistory.content,
    }))
    setSummaryDraftMap(prev => ({
      ...prev,
      [selectedSchema.id]: '',
    }))
    setEditingId('')
  }

  const handleSaveMock = () => {
    if (!selectedSchema) {
      return
    }

    const now = new Date()
    const nextContent =
      draftMap[selectedSchema.id] ??
      currentHistory?.content ??
      selectedSchema.content
    const nextHistory: SchemaHistoryItem = {
      id: `${selectedSchema.id}-${now.getTime()}`,
      revision: nextRevisionPreview,
      changedByName: '스키마 관리자',
      changedAt: now.toISOString(),
      changeSummary:
        summaryDraftMap[selectedSchema.id]?.trim() ||
        'YAML 구조와 속성 정의를 업데이트했습니다.',
      content: nextContent,
    }

    const nextUpdatedAt = formatDate(now, 'YYYY-MM-DD')

    setSchemas(prev =>
      prev.map(schema => {
        if (schema.id !== selectedSchema.id) {
          return schema
        }

        return {
          ...schema,
          content: nextContent,
          updatedAt: nextUpdatedAt,
          histories: [nextHistory, ...schema.histories],
        }
      }),
    )

    setSelectedHistoryMap(prev => ({
      ...prev,
      [selectedSchema.id]: nextHistory.id,
    }))
    setSummaryDraftMap(prev => ({
      ...prev,
      [selectedSchema.id]: '',
    }))
    setEditingId('')
  }

  return (
    <div className="text-strong p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">스키마 관리</h1>
        <p className="text-assistive mt-1 text-sm">
          헤더에서 스키마를 전환하고 revision별 변경 이력을 확인하세요.
        </p>
      </div>

      {!selectedSchema && (
        <div className="text-assistive border-line-alternative bg-background-normal flex min-h-[72vh] items-center border p-10 text-sm">
          헤더에서 스키마를 선택해 주세요.
        </div>
      )}

      {selectedSchema && selectedHistory && (
        <div className="grid min-h-[72vh] grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <section className="border-line-alternative bg-background-normal flex min-h-0 flex-col border">
            <div className="border-line-alternative border-b p-4">
              <h3 className="text-base font-semibold">스키마 변경 이력</h3>
              <p className="text-assistive mt-1 text-xs">
                스키마별 revision을 선택하면 우측 상세에 반영됩니다.
              </p>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto">
              {sortedHistories.map(history => {
                const isSelected = history.id === selectedHistory.id
                const isCurrent = history.id === currentHistory?.id

                return (
                  <li
                    key={history.id}
                    className="border-line-alternative border-b px-4 py-3"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        selectHistory(selectedSchema.id, history.id)
                      }
                      className="w-full cursor-pointer text-left"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {history.revision}
                            </span>
                            {isCurrent && (
                              <span className="bg-primary-assistive text-primary-strong px-2 py-0.5 text-[11px] font-medium">
                                최신
                              </span>
                            )}
                          </div>
                          <p className="text-assistive mt-1 text-xs">
                            {history.changedByName} ·{' '}
                            {formatDate(
                              new Date(history.changedAt),
                              'YYYY.MM.dd',
                            )}
                          </p>
                        </div>
                        <span
                          className={`border-line-alternative flex h-5 w-5 items-center justify-center border ${
                            isSelected
                              ? 'border-primary-normal bg-primary-assistive'
                              : 'bg-background-normal'
                          }`}
                        >
                          {isSelected && (
                            <span className="bg-primary-normal h-2.5 w-2.5" />
                          )}
                        </span>
                      </div>
                      <p className="text-normal line-clamp-2 text-sm leading-5">
                        {history.changeSummary}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          {!isEditing && (
            <section className="border-line-alternative bg-background-normal flex min-h-0 flex-col border">
              <div className="border-line-alternative border-b p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">
                      선택 revision 상세
                    </h3>
                    <p className="text-assistive mt-1 text-xs">
                      변경 요약과 YAML 내용을 확인할 수 있습니다.
                    </p>
                  </div>
                  <span className="border-line-alternative bg-background-neutral border px-3 py-1 text-xs font-medium">
                    {selectedHistory.id === currentHistory?.id
                      ? '최신 버전'
                      : '이전 버전'}
                  </span>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-4">
                <div className="border-line-alternative bg-background-alternative mb-4 border p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-medium ${
                        selectedSchema.status === 'active'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {selectedSchema.status === 'active' ? '운영' : '초안'}
                    </span>
                    <span className="text-assistive text-xs">
                      마지막 수정 {selectedSchema.updatedAt}
                    </span>
                  </div>
                  <p className="text-sm leading-6 whitespace-pre-wrap">
                    {selectedSchema.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <BaseInput
                    label="변경자"
                    value={selectedHistory.changedByName}
                    disabled
                  />
                  <BaseInput
                    label="변경일"
                    value={formatDate(
                      new Date(selectedHistory.changedAt),
                      'YYYY.MM.dd',
                    )}
                    disabled
                  />
                  <BaseInput
                    label="버전"
                    value={selectedHistory.revision}
                    disabled
                  />
                </div>

                <div className="mt-4">
                  <p className="text-assistive mb-2 text-xs font-medium">
                    변경 요약
                  </p>
                  <div className="border-line-alternative bg-modal-background-alternative border p-3 text-sm leading-6">
                    {selectedHistory.changeSummary}
                  </div>
                </div>

                <div className="mt-4 min-h-0 flex-1">
                  <p className="text-assistive mb-2 text-xs font-medium">
                    YAML 내용
                  </p>
                  <pre className="h-full max-h-[44vh] overflow-auto bg-gray-800 p-4 text-xs leading-6 text-gray-50">
                    {selectedHistory.content}
                  </pre>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  {selectedHistory.id !== currentHistory?.id && (
                    <BaseButton
                      size="small"
                      variant="white"
                      className="h-8! px-4! text-xs"
                      onClick={() =>
                        selectHistory(
                          selectedSchema.id,
                          currentHistory?.id ?? selectedHistory.id,
                        )
                      }
                    >
                      최신 버전 보기
                    </BaseButton>
                  )}
                  <BaseButton
                    size="small"
                    className="h-8! px-4! text-xs"
                    onClick={() => openEditor(selectedSchema.id)}
                  >
                    선택 버전 기준으로 생성
                  </BaseButton>
                </div>
              </div>
            </section>
          )}

          {isEditing && (
            <section className="border-line-alternative bg-background-normal flex min-h-0 flex-col border">
              <div className="border-line-alternative border-b p-4">
                <h3 className="text-base font-semibold">새 revision 저장</h3>
                <p className="text-assistive mt-1 text-xs">
                  현재 선택한 revision을 기준으로 새 버전을 생성합니다.
                </p>
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <BaseInput
                    label="기준 버전"
                    value={selectedHistory.revision}
                    disabled
                  />
                  <BaseInput
                    label="새 버전"
                    value={nextRevisionPreview}
                    disabled
                  />
                  <BaseInput label="저장자" value="스키마 관리자" disabled />
                </div>

                <div className="mt-4">
                  <BaseInput
                    label="변경 요약"
                    value={draftSummary}
                    onChange={value =>
                      setSummaryDraftMap(prev => ({
                        ...prev,
                        [selectedSchema.id]: value,
                      }))
                    }
                    placeholder="예: 신규 관계 타입 추가, 날짜 속성 설명 보강"
                    maxLength={120}
                    showCharCounter
                  />
                </div>

                <div className="mt-4 min-h-0 flex-1">
                  <p className="text-assistive mb-2 text-xs font-medium">
                    YAML 편집
                  </p>
                  <textarea
                    value={draftContent}
                    onChange={event => handleDraftChange(event.target.value)}
                    className="border-line-alternative bg-modal-background-alternative min-h-[44vh] w-full border p-4 font-mono text-xs leading-6 outline-none"
                    spellCheck={false}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-assistive text-xs">
                    {hasChanges
                      ? '변경 사항을 저장하면 새 revision이 이력 상단에 추가됩니다.'
                      : '아직 선택한 revision 대비 변경된 내용이 없습니다.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <BaseButton
                      size="small"
                      variant="white"
                      className="h-8! px-4! text-xs"
                      onClick={handleCancel}
                    >
                      취소
                    </BaseButton>
                    <BaseButton
                      size="small"
                      className="h-8! px-4! text-xs"
                      onClick={handleSaveMock}
                      disabled={!hasChanges}
                    >
                      저장
                    </BaseButton>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
