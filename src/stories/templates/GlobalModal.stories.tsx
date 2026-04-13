import type { Meta, StoryObj } from '@storybook/nextjs'
import GlobalModal from '@/components/templates/GlobalModal'
import BaseButton from '@/components/molecules/BaseButton'
import useModalStore from '@/hooks/store/modal'

const meta: Meta<typeof GlobalModal> = {
  title: 'Templates/GlobalModal',
  component: GlobalModal,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof GlobalModal>

const OpenSuccessModal = () => {
  const { openSuccess } = useModalStore()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <GlobalModal />
      <BaseButton
        size="medium"
        variant="primary"
        onClick={() =>
          openSuccess({
            title: '저장 완료',
            message: '변경사항이 성공적으로 저장되었습니다.',
          })
        }
      >
        성공 모달 열기
      </BaseButton>
    </div>
  )
}

const OpenWarningModal = () => {
  const { openWarning } = useModalStore()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <GlobalModal />
      <BaseButton
        size="medium"
        variant="danger"
        onClick={() =>
          openWarning({
            title: '삭제하시겠어요?',
            message: '삭제하면 복구할 수 없습니다.',
            dialogType: 'confirm',
            onConfirm: () => alert('삭제 완료'),
          })
        }
      >
        경고 확인 모달 열기
      </BaseButton>
    </div>
  )
}

const OpenErrorModal = () => {
  const { openError } = useModalStore()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <GlobalModal />
      <BaseButton
        size="medium"
        variant="danger"
        onClick={() =>
          openError({
            title: '오류 발생',
            message: '요청을 처리하는 중 오류가 발생했습니다.',
          })
        }
      >
        오류 모달 열기
      </BaseButton>
    </div>
  )
}

const OpenCustomModal = () => {
  const { openModal } = useModalStore()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <GlobalModal />
      <BaseButton
        size="medium"
        variant="primary"
        onClick={() =>
          openModal({
            title: '커스텀 모달',
            showCloseButton: true,
            children: (
              <div className="mt-4 w-full">
                <p className="text-gray-600 dark:text-gray-400">
                  children prop으로 자유롭게 내용을 넣을 수 있습니다.
                </p>
              </div>
            ),
          })
        }
      >
        커스텀 모달 열기
      </BaseButton>
    </div>
  )
}

export const SuccessModal: Story = {
  render: () => <OpenSuccessModal />,
}

export const WarningConfirmModal: Story = {
  render: () => <OpenWarningModal />,
}

export const ErrorModal: Story = {
  render: () => <OpenErrorModal />,
}

export const CustomModal: Story = {
  render: () => <OpenCustomModal />,
}
