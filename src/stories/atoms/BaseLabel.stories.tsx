import type { Meta, StoryObj } from '@storybook/nextjs'
import BaseLabel from '@/components/atoms/BaseLabel'

const meta: Meta<typeof BaseLabel> = {
  title: 'Atoms/BaseLabel',
  component: BaseLabel,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseLabel>

export const Default: Story = {
  args: {
    label: '이름',
  },
}

export const Required: Story = {
  args: {
    label: '필수 항목',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: '에러 상태',
    error: true,
  },
}

export const RequiredWithError: Story = {
  args: {
    label: '필수 + 에러',
    required: true,
    error: true,
  },
}
