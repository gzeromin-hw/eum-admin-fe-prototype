'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import BaseButton from '@/components/molecules/BaseButton'
import BaseInput from '@/components/molecules/BaseInput'
import useModalStore from '@/hooks/store/modal'
import { usersClient } from '@/service/api/account.client'
import { useToast } from '@/hooks/useToast'

const ITEMS_PER_PAGE = 10

interface CreateUserFormState {
  alias: string
  user_id: string
  password: string
}

interface CreateUserFormErrors {
  alias?: string
  user_id?: string
  password?: string
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function CreateUserModalForm() {
  const t = useTranslations('AdminUsers')
  const { openToast } = useToast()
  const queryClient = useQueryClient()
  const { closeModal } = useModalStore()

  const [form, setForm] = useState<CreateUserFormState>({
    alias: '',
    user_id: '',
    password: '',
  })
  const [errors, setErrors] = useState<CreateUserFormErrors>({})

  const createMutation = useMutation({
    mutationFn: (createData: {
      alias: string
      user_id: string
      password: string
    }) => usersClient.createUser(createData),
    onSuccess: () => {
      openToast('success', t('toast.createSuccess'))
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      closeModal()
    },
    onError: () => {
      openToast('error', t('toast.createFail'))
    },
  })

  const validateForm = () => {
    const nextErrors: CreateUserFormErrors = {}

    if (form.alias.trim().length < 2 || form.alias.trim().length > 32) {
      nextErrors.alias = t('validation.alias')
    }

    if (form.user_id.trim().length < 1 || form.user_id.trim().length > 64) {
      nextErrors.user_id = t('validation.userId')
    }

    if (form.password.length < 8 || form.password.length > 64) {
      nextErrors.password = t('validation.password')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    createMutation.mutate({
      alias: form.alias.trim(),
      user_id: form.user_id.trim(),
      password: form.password,
    })
  }

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <BaseInput
        id="create-user-alias"
        name="alias"
        label={t('form.alias')}
        placeholder={t('form.aliasPlaceholder')}
        value={form.alias}
        onChange={value => setForm(prev => ({ ...prev, alias: value }))}
        onClearError={() => setErrors(prev => ({ ...prev, alias: undefined }))}
        maxLength={32}
        error={errors.alias}
        disabled={createMutation.isPending}
      />

      <BaseInput
        id="create-user-user-id"
        name="user_id"
        label={t('form.userId')}
        placeholder={t('form.userIdPlaceholder')}
        value={form.user_id}
        onChange={value => setForm(prev => ({ ...prev, user_id: value }))}
        onClearError={() =>
          setErrors(prev => ({ ...prev, user_id: undefined }))
        }
        maxLength={64}
        error={errors.user_id}
        disabled={createMutation.isPending}
      />

      <BaseInput
        id="create-user-password"
        name="password"
        type="password"
        label={t('form.password')}
        placeholder={t('form.passwordPlaceholder')}
        value={form.password}
        onChange={value => setForm(prev => ({ ...prev, password: value }))}
        onClearError={() =>
          setErrors(prev => ({ ...prev, password: undefined }))
        }
        maxLength={64}
        error={errors.password}
        disabled={createMutation.isPending}
      />

      <div className="mt-2 flex gap-2">
        <BaseButton
          type="submit"
          disabled={createMutation.isPending}
          shadow={false}
        >
          {createMutation.isPending ? t('creating') : t('createButton')}
        </BaseButton>
        <BaseButton
          type="button"
          variant="white"
          shadow={false}
          onClick={closeModal}
          disabled={createMutation.isPending}
        >
          {t('cancel')}
        </BaseButton>
      </div>
    </form>
  )
}

export default function UserManagementPage() {
  const t = useTranslations('AdminUsers')
  const { openModal } = useModalStore()

  const [currentPage, setCurrentPage] = useState(1)

  const { data: listData, isLoading: isLoadingList } = useQuery({
    queryKey: ['users', 'list', currentPage],
    queryFn: () =>
      usersClient.listUsers({
        page: currentPage,
        items_per_page: ITEMS_PER_PAGE,
      }),
    staleTime: 1000 * 60 * 5,
  })

  const users = listData?.users ?? []
  const totalCount = listData?.total_count ?? 0

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  }, [totalCount])

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-strong text-xl font-semibold">
              {t('listTitle')}
            </h2>
            <p className="text-assistive mt-1 text-sm">
              {t('total', { count: totalCount })}
            </p>
          </div>
          <BaseButton
            type="button"
            onClick={() =>
              openModal({
                title: t('createTitle'),
                showCloseButton: true,
                maxWidth: '32rem',
                children: <CreateUserModalForm />,
              })
            }
            shadow={false}
            size="medium"
            variant="primary"
          >
            {t('createButton')}
          </BaseButton>
        </div>

        <div className="border-line-normal overflow-x-auto border">
          <table className="w-full min-w-160 border-collapse">
            <thead className="bg-background-alternative text-assistive text-sm">
              <tr>
                <th className="border-line-normal border-b px-4 py-3 text-left font-medium">
                  {t('columns.alias')}
                </th>
                <th className="border-line-normal border-b px-4 py-3 text-left font-medium">
                  {t('columns.userId')}
                </th>
                <th className="border-line-normal border-b px-4 py-3 text-left font-medium">
                  {t('columns.createdAt')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(row => (
                <tr key={row.id} className="hover:bg-background-alternative/40">
                  <td className="border-line-normal border-b px-4 py-3 text-sm">
                    {row.alias}
                  </td>
                  <td className="border-line-normal border-b px-4 py-3 text-sm">
                    {row.user_id}
                  </td>
                  <td className="border-line-normal border-b px-4 py-3 text-sm">
                    {formatDate(row.created_at)}
                  </td>
                </tr>
              ))}

              {!isLoadingList && users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-assistive border-line-normal border-b px-4 py-10 text-center text-sm"
                  >
                    {t('empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <BaseButton
            type="button"
            variant="white"
            shadow={false}
            size="medium"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1 || isLoadingList}
            className="text-strong border-line-normal"
          >
            {t('pagination.prev')}
          </BaseButton>
          <span className="text-assistive min-w-16 text-center text-sm">
            {currentPage} / {totalPages}
          </span>
          <BaseButton
            type="button"
            variant="white"
            shadow={false}
            size="medium"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoadingList}
            className="text-strong border-line-normal"
          >
            {t('pagination.next')}
          </BaseButton>
        </div>
      </section>
    </div>
  )
}
