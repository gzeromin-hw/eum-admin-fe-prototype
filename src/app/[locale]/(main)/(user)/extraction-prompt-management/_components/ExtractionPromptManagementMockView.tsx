'use client'

import { useMemo, useState } from 'react'
import BaseButton from '@/components/molecules/BaseButton'
import BaseInput from '@/components/molecules/BaseInput'
import BaseLabel from '@/components/atoms/BaseLabel'
import { formatDate } from '@/utils/date.util'

export interface ExtractionPromptItem {
  uuid: string
  revision: string
  content: string
  createdByName: string
  createdAt: string
}

interface ExtractionPromptManagementMockViewProps {
  initialPrompts: ExtractionPromptItem[]
}

function sortPromptsDesc(a: ExtractionPromptItem, b: ExtractionPromptItem) {
  const createdAtDiff =
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

  if (createdAtDiff !== 0) {
    return createdAtDiff
  }

  return b.revision.localeCompare(a.revision, undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export default function ExtractionPromptManagementMockView({
  initialPrompts,
}: ExtractionPromptManagementMockViewProps) {
  const sortedPrompts = useMemo(() => {
    return [...initialPrompts].sort(sortPromptsDesc)
  }, [initialPrompts])

  const [keyword, setKeyword] = useState('')
  const [selectedId, setSelectedId] = useState(
    () => [...initialPrompts].sort(sortPromptsDesc)[0]?.uuid ?? '',
  )

  const filteredPrompts = useMemo(() => {
    const loweredKeyword = keyword.trim().toLowerCase()

    if (!loweredKeyword) {
      return sortedPrompts
    }

    return sortedPrompts.filter(prompt => {
      return (
        prompt.content.toLowerCase().includes(loweredKeyword) ||
        prompt.revision.toLowerCase().includes(loweredKeyword) ||
        prompt.createdByName.toLowerCase().includes(loweredKeyword)
      )
    })
  }, [keyword, sortedPrompts])

  const selectedPrompt = useMemo(() => {
    return sortedPrompts.find(prompt => prompt.uuid === selectedId)
  }, [selectedId, sortedPrompts])

  return (
    <div className="text-strong flex h-full flex-col p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">추출 프롬프트 관리</h1>
          <p className="text-assistive mt-1 text-sm">
            버전별 프롬프트를 조회하고 선택한 내용을 확인합니다.
          </p>
        </div>
        <span className="border-line-alternative bg-background-neutral text-normal border px-3 py-1 text-xs font-medium">
          목업 모드
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="border-line-alternative bg-background-normal flex min-h-0 flex-col border">
          <div className="border-line-alternative border-b p-4">
            <h2 className="text-lg font-semibold">프롬프트 이력</h2>
            <p className="text-assistive mt-1 text-xs">
              좌측 목록에서 버전을 선택하면 우측 상세에 반영됩니다.
            </p>

            <input
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder="프롬프트 검색"
              className="border-line-alternative bg-modal-background-alternative mt-3 h-10 w-full border px-3 text-sm outline-none"
            />
          </div>

          <div className="border-line-alternative text-assistive bg-background-assistive grid grid-cols-[56px_84px_minmax(0,1fr)] border-b px-4 py-2 text-xs font-medium">
            <span className="text-center">선택</span>
            <span>버전</span>
            <span>내용</span>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {filteredPrompts.map(prompt => {
              const isSelected = selectedId === prompt.uuid

              return (
                <li
                  key={prompt.uuid}
                  className="border-line-alternative border-b px-4 py-3"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(prompt.uuid)}
                    className="grid w-full cursor-pointer grid-cols-[56px_84px_minmax(0,1fr)] items-center gap-2 text-left"
                  >
                    <span className="flex justify-center">
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
                    </span>
                    <span className="text-normal text-sm">
                      {prompt.revision}
                    </span>
                    <span className="text-normal line-clamp-2 text-sm leading-5">
                      {prompt.content}
                    </span>
                  </button>
                </li>
              )
            })}

            {filteredPrompts.length === 0 && (
              <li className="text-assistive p-6 text-sm">
                검색 조건에 맞는 프롬프트가 없습니다.
              </li>
            )}
          </ul>
        </section>

        <section className="border-line-alternative bg-background-normal flex min-h-0 flex-col border">
          <div className="border-line-alternative border-b p-4">
            <h2 className="text-lg font-semibold">선택 프롬프트 상세</h2>
            <p className="text-assistive mt-1 text-xs">
              작성자, 생성일, 버전과 본문 내용을 확인할 수 있습니다.
            </p>
          </div>

          {!selectedPrompt && (
            <div className="text-assistive flex flex-1 items-center p-10 text-sm">
              좌측 목록에서 프롬프트를 선택해 주세요.
            </div>
          )}

          {selectedPrompt && (
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <BaseInput
                  label="작성자"
                  value={selectedPrompt.createdByName}
                  disabled
                />
                <BaseInput
                  label="생성일"
                  value={formatDate(
                    new Date(selectedPrompt.createdAt),
                    'YYYY.MM.dd',
                  )}
                  disabled
                />
                <BaseInput
                  label="버전"
                  value={selectedPrompt.revision}
                  disabled
                />
              </div>

              <div className="mt-4 flex min-h-0 flex-1 flex-col">
                <BaseLabel label="프롬프트 내용" />
                <div className="border-line-alternative bg-modal-background-alternative text-normal mt-2 w-full flex-1 overflow-y-auto border p-3 text-sm leading-6 whitespace-pre-wrap">
                  {selectedPrompt.content}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <BaseButton size="medium" className="w-auto px-6">
                  선택한 프롬프트 사용
                </BaseButton>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
