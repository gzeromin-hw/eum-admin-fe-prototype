'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import BaseInput from '@/components/molecules/BaseInput'
import BaseButton from '@/components/molecules/BaseButton'
import LoginUserIcon from '@/components/atoms/icons/LoginUserIcon'
import LoginLockIcon from '@/components/atoms/icons/LoginLockIcon'
import LoginFormRightIcon from '@/components/atoms/icons/LoginFormRightIcon'
import { useRouter } from '@/i18n/navigation'
import { usersClient } from '@/service/api/account.client'
import { useToast } from '@/hooks/useToast'
import useModalStore from '@/hooks/store/modal'
import { AxiosError } from 'axios'

export default function LoginPage() {
  const $t = useTranslations()
  const router = useRouter()
  const { openToast } = useToast()
  const { openError } = useModalStore()

  const userIdInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetPassword = useCallback(() => {
    setPassword('')
  }, [])

  const focusPassword = useCallback((delay = 0) => {
    setTimeout(() => passwordInputRef.current?.focus(), delay)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => userIdInputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = useCallback(async () => {
    if (!userId.trim()) {
      openToast('error', $t('Login.validation.userId'))
      return
    }
    if (!password.trim()) {
      openToast('error', $t('Login.validation.password'))
      return
    }

    setIsSubmitting(true)

    try {
      await usersClient.login({ user_id: userId.trim(), password })
      router.replace('/')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const backendMessage = error.response?.data?.message
        openToast('error', backendMessage ?? $t('Error.login.backend'))
        resetPassword()
        focusPassword()
      } else {
        const errorMessage =
          error instanceof Error ? error.message : $t('Error.login.system')
        openError({
          title: $t('Error.login.title'),
          message: errorMessage + '\n' + $t('Error.askAdmin'),
          onConfirm: () => focusPassword(100),
          allowUnauthenticated: true,
        })
        resetPassword()
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [
    $t,
    userId,
    password,
    router,
    openToast,
    openError,
    resetPassword,
    focusPassword,
  ])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <main
      className={clsx(
        'relative min-h-dvh w-full overflow-hidden',
        'bg-[linear-gradient(140deg,#f7f9ff_0%,#f4f8f8_45%,#f9f7ff_100%)] dark:bg-[linear-gradient(140deg,#141a24_0%,#121d1f_45%,#181626_100%)]',
      )}
    >
      <div className="bg-primary-normal/20 pointer-events-none absolute -top-20 left-[8%] h-64 w-64 rounded-full blur-[70px]" />
      <div className="pointer-events-none absolute right-[6%] -bottom-16 h-72 w-72 rounded-full bg-[#0cb288]/20 blur-[80px]" />

      <section className="mx-auto flex min-h-dvh w-full max-w-312 items-center justify-center px-5 py-8 md:px-10">
        <div className="w-full max-w-120">
          <article
            className={clsx(
              'border-line-alternative/80 mx-auto flex w-full flex-col justify-center border p-6 md:p-9',
              'bg-modal-background-normal/95 backdrop-blur-md',
              'shadow-[0px_30px_70px_-34px_rgba(31,47,70,0.55)]',
            )}
          >
            <div className="mb-7 text-center">
              <div className="text-assistive text-sm font-medium tracking-[0.02em]">
                {$t('Login.title1')}
              </div>
              <h2 className="text-normal mt-1 text-3xl leading-[125%] font-semibold">
                {$t('Login.form.login')}
              </h2>
            </div>

            <form
              className="flex w-full flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div className="bg-modal-background-alternative/65 flex items-start gap-3 rounded-2xl p-3">
                <div className="text-icon-normal mt-[0.9rem] shrink-0">
                  <LoginUserIcon />
                </div>
                <BaseInput
                  ref={userIdInputRef}
                  id="user_id"
                  name="user_id"
                  type="text"
                  value={userId}
                  onChange={setUserId}
                  placeholder={$t('Login.form.userId')}
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-modal-background-alternative/65 flex items-start gap-3 rounded-2xl p-3">
                <div className="text-icon-normal mt-[0.9rem] shrink-0">
                  <LoginLockIcon />
                </div>
                <BaseInput
                  ref={passwordInputRef}
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder={$t('Login.form.password')}
                  disabled={isSubmitting}
                  showPasswordToggle
                />
              </div>

              <button
                type="button"
                className={clsx(
                  'inline-flex w-fit items-center gap-1 self-end rounded-full px-2 py-1',
                  'text-assistive hover:bg-background-neutral hover:text-primary-normal text-sm font-medium',
                )}
              >
                <span>{$t('Login.form.forgotPassword')}</span>
                <span className="text-[0.7rem]">
                  <LoginFormRightIcon />
                </span>
              </button>

              <BaseButton
                type="submit"
                disabled={isSubmitting}
                shadow={false}
                className="mt-2"
              >
                {isSubmitting
                  ? $t('Login.form.loginInProgress')
                  : $t('Login.form.login')}
              </BaseButton>
            </form>
          </article>
        </div>
      </section>
    </main>
  )
}
