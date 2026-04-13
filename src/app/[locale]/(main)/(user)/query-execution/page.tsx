'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import {
  executeNeo4jQuery,
  type ExecuteQueryResponse,
} from '@/service/api/neo4j.client'
import type { EdgeRow } from '@/utils/neo4j.utils'
import BaseErrorMessage from '@/components/atoms/BaseErrorMessage'
import mockData from '@/data/neo4j.json'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Code2, MessageSquareText, PlayCircle, Clock, Plus } from 'lucide-react'

const Neo4jGraphEmbed = dynamic(
  () => import('@/components/organisms/Neo4jGraphEmbed'),
  { ssr: false },
)

const PAGE_SIZE = 10

function ResultTable({ rows }: { rows: EdgeRow[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(rows.length / PAGE_SIZE)
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 페이지 번호 목록 생성 (최대 5개 + 앞뒤 ellipsis)
  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    if (page > 3) pages.push('ellipsis')
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source ID</TableHead>
              <TableHead>Source Labels</TableHead>
              <TableHead>Source Props</TableHead>
              <TableHead>Rel Type</TableHead>
              <TableHead>Rel Props</TableHead>
              <TableHead>Target ID</TableHead>
              <TableHead>Target Labels</TableHead>
              <TableHead>Target Props</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((row, i) => (
              <TableRow key={`${row.relId}-${i}`}>
                <TableCell className="font-mono text-xs">
                  {row.sourceId}
                </TableCell>
                <TableCell>
                  {(row.sourceLabels ?? [])
                    .filter(l => l !== 'ABoxNode')
                    .map(l => (
                      <span
                        key={l}
                        className="mr-1 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        {l}
                      </span>
                    ))}
                </TableCell>
                <TableCell className="max-w-48">
                  <PropsCell props={row.sourceProps} />
                </TableCell>
                <TableCell>
                  <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold dark:bg-gray-700">
                    {row.relType}
                  </span>
                </TableCell>
                <TableCell className="max-w-32">
                  <PropsCell props={row.relProps} />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {row.targetId}
                </TableCell>
                <TableCell>
                  {(row.targetLabels ?? [])
                    .filter(l => l !== 'ABoxNode')
                    .map(l => (
                      <span
                        key={l}
                        className="mr-1 inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      >
                        {l}
                      </span>
                    ))}
                </TableCell>
                <TableCell className="max-w-48">
                  <PropsCell props={row.targetProps} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, rows.length)} / {rows.length}
          </span>
          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    setPage(p => Math.max(1, p - 1))
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>
              {getPageNumbers().map((p, idx) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={e => {
                        e.preventDefault()
                        setPage(p)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    setPage(p => Math.min(totalPages, p + 1))
                  }}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? 'pointer-events-none opacity-40' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

function PropsCell({ props }: { props: Record<string, unknown> | null }) {
  if (!props) return <span className="text-xs text-gray-400">—</span>
  const entries = Object.entries(props).filter(
    ([, v]) => v !== null && v !== undefined,
  )
  if (entries.length === 0)
    return <span className="text-xs text-gray-400">—</span>
  return (
    <div className="flex flex-col gap-0.5">
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-1 text-xs">
          <span className="shrink-0 font-medium text-gray-500 dark:text-gray-400">
            {k}:
          </span>
          <span className="min-w-0 break-all">{String(v)}</span>
        </div>
      ))}
    </div>
  )
}

function RawDataPanel({
  resultMeta,
  dataRows,
}: {
  resultMeta?: Record<string, unknown>
  dataRows: EdgeRow[]
}) {
  const [page, setPage] = useState(1)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const totalPages = Math.max(1, Math.ceil(dataRows.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const paged = dataRows.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
    setSelectedRowIndex(0)
  }, [dataRows])

  useEffect(() => {
    const globalIndex = start + selectedRowIndex
    if (globalIndex >= dataRows.length) {
      setSelectedRowIndex(0)
    }
  }, [start, selectedRowIndex, dataRows.length])

  return (
    <div className="rounded border border-gray-200 dark:border-gray-700">
      <Accordion defaultValue={['result', 'data']} className="px-4 py-2">
        <AccordionItem value="result">
          <AccordionTrigger className="text-sm font-semibold">
            result
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                {Object.entries(resultMeta ?? {}).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableHead className="w-44">{key}</TableHead>
                    <TableCell className="font-mono text-xs">
                      {String(value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data">
          <AccordionTrigger className="text-sm font-semibold">
            data
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>count: {dataRows.length}</span>
              <span>
                {start + 1}–{Math.min(start + PAGE_SIZE, dataRows.length)}
              </span>
            </div>

            <div className="rounded border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>relType</TableHead>
                    <TableHead>sourceId</TableHead>
                    <TableHead>targetId</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((row, idx) => (
                    <TableRow
                      key={`${row.relId}-${start + idx}`}
                      className={
                        selectedRowIndex === idx
                          ? 'bg-gray-100/70 dark:bg-gray-800/60'
                          : ''
                      }
                      onClick={() => setSelectedRowIndex(idx)}
                    >
                      <TableCell className="font-mono text-xs">
                        {start + idx + 1}
                      </TableCell>
                      <TableCell>{row.relType}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.sourceId}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.targetId}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {dataRows.length > PAGE_SIZE && (
              <div className="mt-3 flex justify-end">
                <Pagination className="w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          setPage(p => Math.max(1, p - 1))
                          setSelectedRowIndex(0)
                        }}
                        aria-disabled={page === 1}
                        className={
                          page === 1 ? 'pointer-events-none opacity-40' : ''
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          setPage(p => Math.min(totalPages, p + 1))
                          setSelectedRowIndex(0)
                        }}
                        aria-disabled={page === totalPages}
                        className={
                          page === totalPages
                            ? 'pointer-events-none opacity-40'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                selected row json
              </p>
              <pre className="max-h-72 overflow-auto text-xs leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {JSON.stringify(
                  dataRows[start + selectedRowIndex] ?? null,
                  null,
                  2,
                )}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default function QueryExecutionPage() {
  const $t = useTranslations('QueryExecution')
  const [query, setQuery] = useState('')
  const [inputMode, setInputMode] = useState<'natural' | 'cypher'>('cypher')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<EdgeRow[]>([])
  const [rawResponse, setRawResponse] = useState<ExecuteQueryResponse | null>(
    null,
  )
  const [hasExecuted, setHasExecuted] = useState(false)
  const [queryHistory, setQueryHistory] = useState<
    Array<{ query: string; mode: 'natural' | 'cypher'; timestamp: number }>
  >([
    {
      query:
        'MATCH (n:MonthlyAssemblyPlan)-[r:ASSIGNEDTOSHOP]->(shop:OverseaShop) RETURN n, r, shop LIMIT 20',
      mode: 'cypher',
      timestamp: Date.now() - 120000,
    },
    {
      query: '월간 조립 계획과 지정된 선박 조회',
      mode: 'natural',
      timestamp: Date.now() - 60000,
    },
    {
      query: 'MATCH (p:MonthlyAssemblyPlan) RETURN p LIMIT 10',
      mode: 'cypher',
      timestamp: Date.now() - 30000,
    },
  ])

  const handleExecuteQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResults([])
    setRawResponse(null)

    try {
      const response = await executeNeo4jQuery(query, inputMode)
      if (response.status === 'error') {
        setError(response.message || $t('errorExecutingQuery'))
        setResults([])
      } else {
        setResults(response.data)
        setRawResponse(response)
        if (response.data.length === 0) {
          setError($t('noResults'))
        }
      }
      setHasExecuted(true)

      // Add to history
      if (query.trim()) {
        setQueryHistory(prev => [
          { query, mode: inputMode, timestamp: Date.now() },
          ...prev,
        ])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : $t('unknownError'))
      setResults([])
      setHasExecuted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearQuery = () => {
    setQuery('')
    setResults([])
    setRawResponse(null)
    setError(null)
    setHasExecuted(false)
  }

  const toggleInputMode = () => {
    setInputMode(prev => (prev === 'natural' ? 'cypher' : 'natural'))
  }

  const handleLoadFromHistory = async (
    historyQuery: string,
    historyMode: 'natural' | 'cypher',
  ) => {
    setQuery(historyQuery)
    setInputMode(historyMode)
    setIsLoading(true)
    setError(null)
    setResults([])
    setRawResponse(null)

    // 항상 mockData 반환
    try {
      setResults(mockData.data)
      setRawResponse({
        data: mockData.data,
        status: 'success',
        result: mockData.result,
      })
      setHasExecuted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : $t('unknownError'))
      setResults([])
      setHasExecuted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen gap-6 p-6">
      {/* Left Panel: History */}
      <div className="flex w-72 flex-col gap-2 border-r border-gray-200 pr-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {$t('queryHistory') || 'Query History'}
          </h2>
          <button
            onClick={handleClearQuery}
            disabled={isLoading}
            className="bg-background-primary border-line-normal text-primary hover:bg-primary flex h-8 w-8 shrink-0 items-center justify-center border transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            title="New Query"
            aria-label="New Query"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {queryHistory.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No history yet
            </div>
          ) : (
            <div className="space-y-2">
              {queryHistory.map((item, idx) => {
                const isActive = item.query === query && item.mode === inputMode
                return (
                  <button
                    key={`${item.timestamp}-${idx}`}
                    onClick={() => handleLoadFromHistory(item.query, item.mode)}
                    disabled={isLoading}
                    className="group relative w-full text-left"
                  >
                    <div
                      className={`rounded border p-3 transition-colors disabled:opacity-50 ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-line-normal bg-background-neutral hover:bg-background-alternative'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Clock className="text-assistive mt-0.5 h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            {item.mode === 'natural' ? '자연어' : 'Cypher'}
                          </p>
                          <p className="break-word line-clamp-3 text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                            {item.query}
                          </p>
                          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                            {(() => {
                              const d = new Date(item.timestamp)
                              return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Query Execution */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        {/* Query Input Section */}
        <div className="flex flex-col gap-2">
          <p className="text-assistive text-xs">
            {$t('queryModeLabel')}:{' '}
            {inputMode === 'natural' ? $t('modeNatural') : $t('modeCypher')}
          </p>
          <div className="border-line-normal bg-background-neutral space-y-2 border p-3">
            {/* Row 1: Textarea */}
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                inputMode === 'natural'
                  ? $t('queryPlaceholderNatural')
                  : $t('queryPlaceholderCypher')
              }
              disabled={isLoading}
              rows={1}
              className="text-normal placeholder:text-assistive w-full resize-none border-none bg-transparent px-0 py-1 text-sm leading-6 outline-none"
            />

            {/* Row 2: Toggle Left, Send Right */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleInputMode}
                disabled={isLoading}
                className="bg-background-assistive border-line-normal text-normal hover:bg-background-alternative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                title={
                  inputMode === 'natural' ? $t('modeNatural') : $t('modeCypher')
                }
                aria-label={
                  inputMode === 'natural' ? $t('modeNatural') : $t('modeCypher')
                }
              >
                {inputMode === 'natural' ? (
                  <MessageSquareText className="h-4 w-4" />
                ) : (
                  <Code2 className="h-4 w-4" />
                )}
              </button>

              <div className="flex-1" />

              <button
                type="button"
                onClick={handleExecuteQuery}
                disabled={!query.trim() || isLoading}
                className="bg-background-primary border-line-normal text-primary hover:bg-primary flex h-10 w-10 shrink-0 items-center justify-center border-2 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                title={isLoading ? $t('executing') : $t('execute')}
                aria-label={isLoading ? $t('executing') : $t('execute')}
              >
                <PlayCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <BaseErrorMessage error={error} />}

        {/* Results Section */}
        {hasExecuted && results.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {$t('results')}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({results.length} {$t('relationshipCount')})
                </span>
              </h2>
            </div>
            <Tabs defaultValue="graph">
              <TabsList variant="line">
                <TabsTrigger value="graph">{$t('tabGraph')}</TabsTrigger>
                <TabsTrigger value="table">{$t('tabTable')}</TabsTrigger>
                <TabsTrigger value="raw">{$t('tabRaw')}</TabsTrigger>
              </TabsList>
              <TabsContent value="graph">
                <Neo4jGraphEmbed edgeRows={results} />
              </TabsContent>
              <TabsContent value="table">
                <ResultTable rows={results} />
              </TabsContent>
              <TabsContent value="raw">
                <RawDataPanel
                  resultMeta={rawResponse?.result}
                  dataRows={rawResponse?.data ?? results}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* No Results State */}
        {hasExecuted && results.length === 0 && !error && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 dark:border-gray-600 dark:bg-gray-900/50">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {$t('noResults')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
