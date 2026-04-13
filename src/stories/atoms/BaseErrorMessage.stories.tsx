import type { Meta, StoryObj } from '@storybook/nextjs'
import BaseErrorMessage from '@/components/atoms/BaseErrorMessage'

const meta: Meta<typeof BaseErrorMessage> = {
  title: 'Atoms/BaseErrorMessage',
  component: BaseErrorMessage,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseErrorMessage>

export const WithError: Story = {
  args: {
    error: '이 필드는 필수입니다.',
  },
}

export const NoError: Story = {
  args: {
    error: undefined,
  },
}

export const LongError: Story = {
  args: {
    error:
      '입력값이 유효하지 않습니다. 다시 확인하고 올바른 형식으로 입력해주세요.',
  },
}
