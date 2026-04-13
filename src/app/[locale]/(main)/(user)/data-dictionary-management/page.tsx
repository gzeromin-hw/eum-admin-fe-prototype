'use client'

import { useMemo, useRef, useState } from 'react'
import BaseButton from '@/components/molecules/BaseButton'
import BaseInput from '@/components/molecules/BaseInput'
import BaseSearchInput from '@/components/molecules/BaseSearchInput'
import BaseTextarea from '@/components/molecules/BaseTextarea'

type DictionaryEntry = {
  id: string
  canonical: string
  aliases: string[]
}

const initialEntries: DictionaryEntry[] = [
  {
    id: '1',
    canonical: 'ship',
    aliases: ['배', '선박'],
  },
  {
    id: '2',
    canonical: '법인카드',
    aliases: ['법카', 'corporate card'],
  },
  {
    id: '3',
    canonical: 'purchase order',
    aliases: ['발주서', 'po'],
  },
]

const normalizeText = (text: string) => text.trim().toLowerCase()

const parseAliases = (value: string) => {
  const uniqueByNormalized = new Map<string, string>()

  value
    .split(',')
    .map(text => text.trim())
    .filter(Boolean)
    .forEach(alias => {
      const normalized = normalizeText(alias)
      if (!uniqueByNormalized.has(normalized)) {
        uniqueByNormalized.set(normalized, alias)
      }
    })

  return Array.from(uniqueByNormalized.values())
}

export default function DataDictionaryManagementPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>(initialEntries)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [canonical, setCanonical] = useState('')
  const [aliasesInput, setAliasesInput] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const registerSectionRef = useRef<HTMLElement>(null)

  const filteredEntries = useMemo(() => {
    const keyword = normalizeText(searchKeyword)

    if (!keyword) {
      return entries
    }

    return entries.filter(entry => {
      const canonicalMatch = normalizeText(entry.canonical).includes(keyword)
      const aliasMatch = entry.aliases.some(alias =>
        normalizeText(alias).includes(keyword),
      )
      return canonicalMatch || aliasMatch
    })
  }, [entries, searchKeyword])

  const onSubmit = () => {
    const canonicalValue = canonical.trim()
    const aliases = parseAliases(aliasesInput)

    if (!canonicalValue) {
      setError('대표 용어를 입력해주세요.')
      return
    }

    if (!aliases.length) {
      setError('표현 용어를 1개 이상 입력해주세요.')
      return
    }

    const normalizedCanonical = normalizeText(canonicalValue)
    const existingCanonical = entries.find(
      entry => normalizeText(entry.canonical) === normalizedCanonical,
    )

    if (existingCanonical) {
      const existingAliasSet = new Set(
        existingCanonical.aliases.map(alias => normalizeText(alias)),
      )
      const newAliases = aliases.filter(alias => {
        const normalizedAlias = normalizeText(alias)
        return (
          normalizedAlias !== normalizedCanonical &&
          !existingAliasSet.has(normalizedAlias)
        )
      })

      if (!newAliases.length) {
        setError('이미 등록된 표현 용어이거나 대표 용어와 동일합니다.')
        return
      }

      const mergedAliases = [...existingCanonical.aliases, ...newAliases]

      setEntries(prev =>
        prev.map(entry =>
          entry.id === existingCanonical.id
            ? { ...entry, aliases: mergedAliases }
            : entry,
        ),
      )

      setNotice(
        `${existingCanonical.canonical}에 표현 용어 ${newAliases.length}개를 추가했습니다.`,
      )
    } else {
      const filteredAliases = aliases.filter(
        alias => normalizeText(alias) !== normalizedCanonical,
      )

      if (!filteredAliases.length) {
        setError(
          '표현 용어가 대표 용어와 동일합니다. 다른 표현을 입력해주세요.',
        )
        return
      }

      setEntries(prev => [
        {
          id: crypto.randomUUID(),
          canonical: canonicalValue,
          aliases: filteredAliases,
        },
        ...prev,
      ])

      setNotice(`${canonicalValue} 대표 용어를 새로 등록했습니다.`)
    }

    setCanonical('')
    setAliasesInput('')
    setError('')
  }

  const onAppendAliasClick = (entry: DictionaryEntry) => {
    setCanonical(entry.canonical)
    setAliasesInput('')
    setError('')
    setNotice(`${entry.canonical}에 추가할 표현 용어를 입력하세요.`)
    registerSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="text-strong p-6">
      <section className="border-line-alternative bg-background-neutral mb-6 border p-5">
        <h1 className="text-xl font-semibold">데이터 사전 관리</h1>
        <p className="text-assistive mt-2 text-sm">
          같은 의미의 다양한 표현을 하나의 대표 용어로 정규화하는 화면입니다.
          예: ship &rarr; 배, 선박 / 법인카드 &rarr; 법카
        </p>
      </section>

      <section
        ref={registerSectionRef}
        className="border-line-alternative bg-background-neutral mb-6 border p-5"
      >
        <h2 className="mb-4 text-lg font-semibold">용어 매핑 등록</h2>
        <p className="text-assistive mb-4 text-sm">
          기존 대표 용어를 동일하게 입력하고 등록하면 표현 용어가 추가됩니다.
        </p>
        {notice ? (
          <p className="mb-4 text-sm font-medium text-blue-500">{notice}</p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BaseInput
            label="대표 용어"
            placeholder="예: ship, 법인카드"
            value={canonical}
            onChange={value => {
              setCanonical(value)
              if (error) {
                setError('')
              }
            }}
            error={error && !canonical.trim() ? error : undefined}
          />

          <BaseTextarea
            label="표현 용어"
            placeholder="쉼표(,)로 구분해서 입력하세요. 예: 배, 선박"
            value={aliasesInput}
            onChange={value => {
              setAliasesInput(value)
              if (error) {
                setError('')
              }
            }}
            minHeight={48}
            maxHeight={160}
            rows={2}
            style={{ marginTop: 0 }}
            error={error && !aliasesInput.trim() ? error : undefined}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <BaseButton size="medium" className="min-w-32" onClick={onSubmit}>
            등록
          </BaseButton>
        </div>
      </section>

      <section className="border-line-alternative bg-background-neutral border p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">등록된 용어 사전</h2>
          <BaseSearchInput
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="대표 용어/표현 용어 검색"
            width="100%"
            className="sm:w-[20rem]"
          />
        </div>

        <div className="border-line-alternative overflow-x-auto border">
          <table className="w-full min-w-176 border-collapse text-left text-sm">
            <thead className="bg-modal-background-neutral">
              <tr>
                <th className="border-line-alternative border-b px-4 py-3 font-semibold">
                  대표 용어
                </th>
                <th className="border-line-alternative border-b px-4 py-3 font-semibold">
                  표현 용어 목록
                </th>
                <th className="border-line-alternative border-b px-4 py-3 font-semibold">
                  표현 수
                </th>
                <th className="border-line-alternative border-b px-4 py-3 font-semibold">
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length ? (
                filteredEntries.map(entry => (
                  <tr
                    key={entry.id}
                    className="hover:bg-modal-background-neutral/50"
                  >
                    <td className="border-line-alternative border-b px-4 py-3 font-medium">
                      {entry.canonical}
                    </td>
                    <td className="border-line-alternative border-b px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {entry.aliases.map(alias => (
                          <span
                            key={`${entry.id}-${alias}`}
                            className="border-line-alternative bg-modal-background-neutral inline-flex border px-2 py-1 text-xs"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="border-line-alternative border-b px-4 py-3">
                      {entry.aliases.length}
                    </td>
                    <td className="border-line-alternative border-b px-4 py-3">
                      <BaseButton
                        size="small"
                        variant="white"
                        className="h-8 px-3"
                        onClick={() => onAppendAliasClick(entry)}
                      >
                        표현 추가
                      </BaseButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-assistive border-line-alternative border-b px-4 py-8 text-center"
                  >
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
