import { toast } from 'react-toastify'
import React from 'react'

export type AlertType = 'error' | 'success' | 'warning'

export const useToast = () => {
  // Toast Message Component using createElement
  const ToastMessage = ({
    data,
  }: {
    data: { title: string; subtitle?: string }
  }) => {
    return React.createElement(
      'div',
      {
        'data-id': 'toast-message',
        className: 'toast-message-container',
      },
      React.createElement('p', { className: 'toast-title' }, data.title),
      data.subtitle &&
        React.createElement(
          'p',
          { className: 'toast-subtitle' },
          data.subtitle,
        ),
    )
  }

  const openToast = (
    type: AlertType,
    title: string,
    subtitle?: string,
    hideProgressBar?: boolean,
  ) => {
    const data = { title, subtitle }
    const options =
      hideProgressBar !== undefined
        ? { hideProgressBar }
        : { hideProgressBar: true }

    switch (type) {
      case 'success':
        toast.success(ToastMessage, { data, ...options })
        break
      case 'error':
        toast.error(ToastMessage, { data, ...options })
        break
      case 'warning':
        toast.warning(ToastMessage, { data, ...options })
        break
      default:
        toast.info(ToastMessage, { data, ...options })
    }
  }

  return { openToast }
}
