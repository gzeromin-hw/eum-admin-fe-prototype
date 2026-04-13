import { create } from 'zustand'

type StatusType = 'success' | 'warning' | 'error'
type DialogType = 'info' | 'confirm'

interface ModalState {
  isOpen: boolean
  title?: string
  message?: string
  minWidth?: string
  maxWidth?: string
  padding?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  // 상태형 모달 구분 (지정 시 공통 템플릿 사용)
  statusType?: StatusType
  dialogType?: DialogType
  onConfirm?: () => void
  onCancel?: () => void
  // 로그아웃 상태에서도 모달 사용 허용 여부
  allowUnauthenticated?: boolean
  openModal: (
    modalState: Omit<
      ModalState,
      | 'isOpen'
      | 'openModal'
      | 'closeModal'
      | 'openSuccess'
      | 'openWarning'
      | 'openError'
    >,
  ) => void
  closeModal: () => void
  openSuccess: (args: {
    title: string
    message: string
    dialogType?: DialogType
    onConfirm?: () => void
    onCancel?: () => void
    allowUnauthenticated?: boolean
  }) => void
  openWarning: (args: {
    title: string
    message: string
    dialogType?: DialogType
    onConfirm?: () => void
    onCancel?: () => void
    allowUnauthenticated?: boolean
  }) => void
  openError: (args: {
    title: string
    message: string
    dialogType?: DialogType
    onConfirm?: () => void
    onCancel?: () => void
    allowUnauthenticated?: boolean
  }) => void
}

const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  title: undefined,
  message: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  padding: undefined,
  children: undefined,
  className: undefined,
  showCloseButton: undefined,
  statusType: undefined,
  dialogType: undefined,
  onConfirm: undefined,
  onCancel: undefined,
  allowUnauthenticated: undefined,
  openModal: modalState => set({ ...modalState, isOpen: true }),
  closeModal: () =>
    set({
      isOpen: false,
      title: undefined,
      message: undefined,
      minWidth: undefined,
      maxWidth: undefined,
      padding: undefined,
      children: undefined,
      className: undefined,
      showCloseButton: undefined,
      statusType: undefined,
      dialogType: undefined,
      onConfirm: undefined,
      onCancel: undefined,
      allowUnauthenticated: undefined,
    }),
  openSuccess: ({
    title,
    message,
    dialogType = 'info',
    onConfirm,
    onCancel,
    allowUnauthenticated = false,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      statusType: 'success',
      dialogType,
      onConfirm,
      onCancel,
      allowUnauthenticated,
      // 상태형에서는 children 사용 안 함
      children: undefined,
      showCloseButton: true,
    }),
  openWarning: ({
    title,
    message,
    dialogType = 'info',
    onConfirm,
    onCancel,
    allowUnauthenticated = false,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      statusType: 'warning',
      dialogType,
      onConfirm,
      onCancel,
      allowUnauthenticated,
      children: undefined,
      showCloseButton: true,
    }),
  openError: ({
    title,
    message,
    dialogType = 'info',
    onConfirm,
    onCancel,
    allowUnauthenticated = false,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      statusType: 'error',
      dialogType,
      onConfirm,
      onCancel,
      allowUnauthenticated,
      children: undefined,
      showCloseButton: true,
    }),
}))

export default useModalStore
