'use client'

import { useMutation } from '@tanstack/react-query'
import { graphSchemaClient } from '@/service/api/graph-schema.client'
import { GraphSchemaDto } from '@/service/dtos/graph-schema.dto'

const MOCK_SCHEMAS: { schemas: GraphSchemaDto[]; total: number } = {
  schemas: [
    {
      id: 1,
      domain: 'shipbuilding_block_production',
      version: '1.0',
      description:
        '조선소 블록 생산 계획 관리 초기 스키마.\nNeo4j 온톨로지 기반으로 월간 조립 계획과 기준 계획 중심의 기본 구조를 정의한다.\n실적·이슈 관리는 포함하지 않는다.',
      source_format: 'yaml',
      is_active: false,
      created_at: '2026-04-10T07:18:04.266794',
      updated_at: '2026-04-10T07:18:04.266794',
    },
    {
      id: 2,
      domain: 'shipbuilding_block_production',
      version: '1.2',
      description:
        '조선소 블록 생산 계획/실적·이슈 관리 스키마 (v1.2).\nv1.0 대비 WorkStageActual, BlockProcessPlan/Actual, Issue, Cause, Action, Team 추가.',
      source_format: 'yaml',
      is_active: false,
      created_at: '2026-04-10T07:18:04.266794',
      updated_at: '2026-04-10T07:18:04.266794',
    },
    {
      id: 3,
      domain: 'shipbuilding_block_production',
      version: '1.3',
      description:
        '조선소 블록 생산 계획/실적 관리 확장 스키마 (v1.3).\nv1.2의 이슈 관리에 더해 해외(OOS) 공장, 블록 공정 마스터,\n크리티컬패스, 원가 그룹, 조직 관리까지 포괄하는 완전판 스키마.',
      source_format: 'yaml',
      is_active: true,
      created_at: '2026-04-10T07:18:04.266794',
      updated_at: '2026-04-10T07:18:04.266794',
    },
  ],
  total: 3,
}
import {
  DatabaseIcon,
  CalendarIcon,
  TagIcon,
  ArrowRightIcon,
  UploadIcon,
  FileIcon,
  XIcon,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useRef, useState, useCallback, DragEvent } from 'react'
import { useToast } from '@/hooks/useToast'

function SchemaCard({ schema }: { schema: GraphSchemaDto }) {
  return (
    <Link
      href="/query-execution"
      className="group border-line-normal bg-background-normal relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary-normal cursor-pointer"
    >
      {/* 상단 accent 바 */}
      <div className={`h-1 w-full ${schema.is_active ? 'bg-primary-normal' : 'bg-background-alternative'}`} />

      <div className="flex flex-col gap-4 p-5">
        {/* 헤더: 아이콘 + 도메인명 + 상태 뱃지 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-background-alternative rounded-lg p-2 transition-colors group-hover:bg-orange-50">
              <DatabaseIcon size={18} strokeWidth={1.8} className="text-primary-normal" />
            </div>
            <span className="text-strong text-base font-semibold leading-tight">
              {schema.domain}
            </span>
          </div>
          <span
            className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              schema.is_active
                ? 'bg-orange-50 text-primary-normal'
                : 'bg-background-alternative text-alternative'
            }`}
          >
            {schema.is_active ? '활성' : '비활성'}
          </span>
        </div>

        {/* 설명 */}
        <p className="text-neutral line-clamp-2 min-h-10 text-sm leading-relaxed">
          {schema.description || '설명이 없습니다.'}
        </p>

        {/* 태그: 포맷 + 버전 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="border-line-alternative text-alternative flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs">
            <TagIcon size={11} />
            {schema.source_format}
          </span>
          <span className="border-line-alternative text-alternative flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs">
            v{schema.version}
          </span>
        </div>

        {/* 푸터: 날짜 + 화살표 */}
        <div className="border-line-normal flex items-center justify-between border-t pt-3">
          <span className="text-assistive flex items-center gap-1.5 text-xs">
            <CalendarIcon size={11} />
            {schema.updated_at?.slice(0, 10)}
          </span>
          <ArrowRightIcon
            size={14}
            className="text-assistive transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary-normal"
          />
        </div>
      </div>
    </Link>
  )
}

function SchemaCardSkeleton() {
  return (
    <div className="border-line-normal bg-background-normal animate-pulse overflow-hidden rounded-xl border shadow-sm">
      <div className="bg-background-alternative h-1 w-full" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="bg-background-alternative h-9 w-9 rounded-lg" />
          <div className="bg-background-alternative h-4 w-28 rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="bg-background-alternative h-3 w-full rounded-md" />
          <div className="bg-background-alternative h-3 w-4/5 rounded-md" />
        </div>
        <div className="flex gap-1.5">
          <div className="bg-background-alternative h-5 w-16 rounded-md" />
          <div className="bg-background-alternative h-5 w-10 rounded-md" />
        </div>
        <div className="border-line-normal border-t pt-3">
          <div className="bg-background-alternative h-3 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function ImportYamlModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const { openToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [setActive, setSetActive] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const mutation = useMutation({
    mutationFn: () => graphSchemaClient.importYaml(file!, setActive),
    onSuccess: result => {
      openToast(
        'success',
        '스키마 가져오기 완료',
        `${result.domain} v${result.version}`,
      )
      onSuccess()
      onClose()
    },
    onError: () => {
      openToast('error', '스키마 가져오기 실패', 'YAML 파일을 확인해주세요.')
    },
  })

  const handleFile = useCallback((f: File) => {
    if (f.name.endsWith('.yaml') || f.name.endsWith('.yml')) {
      setFile(f)
    } else {
      // no-op: wrong type
    }
  }, [])

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-background-normal border-line-normal w-full max-w-md rounded-2xl border shadow-xl">
        {/* 헤더 */}
        <div className="border-line-normal flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <UploadIcon size={18} className="text-primary-normal" />
            <span className="text-strong font-semibold">YAML 스키마 가져오기</span>
          </div>
          <button
            onClick={onClose}
            className="text-alternative hover:text-neutral rounded-lg p-1 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {/* 드롭존 */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
              isDragging
                ? 'border-primary-normal bg-orange-50'
                : file
                  ? 'border-primary-normal bg-orange-50/50'
                  : 'border-line-alternative hover:border-primary-normal hover:bg-orange-50/30'
            }`}
          >
            {file ? (
              <>
                <FileIcon size={32} className="text-primary-normal" />
                <div className="text-center">
                  <p className="text-strong text-sm font-medium">{file.name}</p>
                  <p className="text-neutral mt-0.5 text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="text-alternative hover:text-neutral text-xs underline"
                >
                  다시 선택
                </button>
              </>
            ) : (
              <>
                <UploadIcon size={32} className="text-assistive" />
                <div className="text-center">
                  <p className="text-neutral text-sm font-medium">
                    파일을 드래그하거나 클릭해서 선택
                  </p>
                  <p className="text-assistive mt-1 text-xs">.yaml, .yml 파일 지원</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
              e.target.value = ''
            }}
          />

          {/* 활성 설정 토글 */}
          <label className="border-line-normal flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3">
            <div>
              <p className="text-strong text-sm font-medium">업로드 후 즉시 활성화</p>
              <p className="text-neutral mt-0.5 text-xs">
                스키마를 가져온 후 활성 상태로 설정합니다
              </p>
            </div>
            <div
              className={`relative h-6 w-11 rounded-full transition-colors ${
                setActive ? 'bg-primary-normal' : 'bg-background-alternative'
              }`}
              onClick={() => setSetActive(v => !v)}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  setActive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="border-line-normal text-neutral hover:bg-background-alternative flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!file || mutation.isPending}
              className="bg-primary-normal flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50 hover:not-disabled:opacity-90"
            >
              {mutation.isPending ? '업로드 중...' : '가져오기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MainPage() {
  const [isImportOpen, setIsImportOpen] = useState(false)

  const data = MOCK_SCHEMAS
  const isLoading = false
  const isError = false

  return (
    <div className="p-6">
      {isImportOpen && (
        <ImportYamlModal
          onClose={() => setIsImportOpen(false)}
          onSuccess={() => {}}
        />
      )}

      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-strong text-xl font-bold">스키마 목록</h1>
          <p className="text-neutral mt-1 text-sm">
            {data ? `전체 ${data.total}개` : '\u00a0'}
          </p>
        </div>
        <button
          onClick={() => setIsImportOpen(true)}
          className="bg-primary-normal flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <UploadIcon size={15} />
          YAML 가져오기
        </button>
      </div>

      {isError && (
        <div className="border-line-normal bg-background-normal rounded-xl border p-12 text-center">
          <DatabaseIcon size={32} className="text-assistive mx-auto mb-3" />
          <p className="text-neutral text-sm">스키마를 불러오는데 실패했습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <SchemaCardSkeleton key={i} />
            ))
          : data?.schemas.map(schema => (
              <SchemaCard key={schema.id} schema={schema} />
            ))}
      </div>

      {!isLoading && !isError && data?.schemas.length === 0 && (
        <div className="border-line-normal bg-background-normal rounded-xl border p-12 text-center">
          <DatabaseIcon size={32} className="text-assistive mx-auto mb-3" />
          <p className="text-neutral text-sm">등록된 스키마가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
