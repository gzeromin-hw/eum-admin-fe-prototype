import clsx from 'clsx'
import CopyIcon from '../atoms/icons/CopyIcon'
import { useToast } from '@/hooks/useToast'
import { useTranslations } from 'next-intl'

interface CopyButtonProps {
  text: string
  className?: string
  title?: string
}

export default function CopyButton({
  text,
  className,
  title,
}: CopyButtonProps) {
  const { openToast } = useToast()
  const $t = useTranslations()

  const copyContent = async (text: string) => {
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()

      try {
        const success = document.execCommand('copy')
        if (success) {
          openToast('success', $t('Copy.success'))
        } else {
          openToast('error', $t('Copy.error'))
        }
      } catch {
        openToast('error', $t('Copy.error'))
      } finally {
        document.body.removeChild(textArea)
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        openToast('success', $t('Copy.success'))
      } else {
        fallbackCopy(text)
      }
    } catch {
      fallbackCopy(text)
    }
  }

  const handleCopyClick = () => {
    copyContent(text)
  }

  return (
    <button
      onClick={handleCopyClick}
      className={clsx(
        'flex items-center justify-center',
        title
          ? ''
          : 'transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-500',
        'cursor-pointer rounded-full',
        className,
      )}
      title={title || $t('Button.copy')}
    >
      <div
        className={clsx(
          'text-icon-disable h-[1.625rem] w-[1.625rem]',
          'flex items-center justify-center',
        )}
      >
        <CopyIcon />
      </div>
      {title && <span className="leading-[140%]">{title}</span>}
    </button>
  )
}
