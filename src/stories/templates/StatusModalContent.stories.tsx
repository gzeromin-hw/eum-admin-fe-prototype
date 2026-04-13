import type { Meta, StoryObj } from '@storybook/nextjs'
import StatusModalContent from '@/components/templates/StatusModalContent'

const meta: Meta<typeof StatusModalContent> = {
  title: 'Templates/StatusModalContent',
  component: StatusModalContent,
  parameters: { layout: 'centered' },
  argTypes: {
    statusType: {
      control: 'select',
      options: ['success', 'warning', 'error'],
    },
    dialogType: {
      control: 'select',
      options: ['info', 'confirm'],
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusModalContent>

const noop = () => {}

export const Success: Story = {
  render: () => (
    <div className="w-[24.5rem] rounded-2xl bg-white p-6 dark:bg-gray-900">
      <StatusModalContent
        statusType="success"
        title="저장 완료"
        message="변경사항이 성공적으로 저장되었습니다."
        dialogType="info"
        closeModal={noop}
      />
    </div>
  ),
}

export const Warning: Story = {
  render: () => (
    <div className="w-[24.5rem] rounded-2xl bg-white p-6 dark:bg-gray-900">
      <StatusModalContent
        statusType="warning"
        title="주의"
        message="이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?"
        dialogType="confirm"
        closeModal={noop}
        onConfirm={() => alert('확인')}
        onCancel={() => alert('취소')}
      />
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="w-[24.5rem] rounded-2xl bg-white p-6 dark:bg-gray-900">
      <StatusModalContent
        statusType="error"
        title="오류 발생"
        message="요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        dialogType="info"
        closeModal={noop}
      />
    </div>
  ),
}

export const ConfirmDialog: Story = {
  render: () => (
    <div className="w-[24.5rem] rounded-2xl bg-white p-6 dark:bg-gray-900">
      <StatusModalContent
        statusType="warning"
        title="삭제하시겠어요?"
        message="삭제하면 목록에서 사라지며 복구할 수 없습니다."
        dialogType="confirm"
        closeModal={noop}
        onConfirm={() => alert('삭제 확인')}
        onCancel={() => alert('취소')}
      />
    </div>
  ),
}

export const NoMessage: Story = {
  render: () => (
    <div className="w-[24.5rem] rounded-2xl bg-white p-6 dark:bg-gray-900">
      <StatusModalContent
        statusType="success"
        title="완료"
        dialogType="info"
        closeModal={noop}
      />
    </div>
  ),
}
