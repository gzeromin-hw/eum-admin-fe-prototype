import type { Meta, StoryObj } from '@storybook/nextjs'
import BaseButton from '@/components/molecules/BaseButton'

const meta: Meta<typeof BaseButton> = {
  title: 'Molecules/BaseButton',
  component: BaseButton,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'gray', 'white', 'danger'],
    },
    size: {
      control: 'select',
      options: ['default', 'big', 'small', 'medium'],
    },
  },
}

export default meta
type Story = StoryObj<typeof BaseButton>

export const Primary: Story = {
  args: {
    children: '확인',
    variant: 'primary',
    size: 'default',
  },
}

export const Gray: Story = {
  args: {
    children: '취소',
    variant: 'gray',
    size: 'default',
  },
}

export const White: Story = {
  args: {
    children: '닫기',
    variant: 'white',
    size: 'default',
  },
}

export const Danger: Story = {
  args: {
    children: '삭제',
    variant: 'danger',
    size: 'default',
  },
}

export const Small: Story = {
  args: {
    children: '작은 버튼',
    variant: 'primary',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    children: '중간 버튼',
    variant: 'primary',
    size: 'medium',
  },
}

export const Big: Story = {
  args: {
    children: '큰 버튼',
    variant: 'primary',
    size: 'big',
  },
}

export const Disabled: Story = {
  args: {
    children: '비활성화',
    variant: 'primary',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <BaseButton variant="primary">Primary</BaseButton>
      <BaseButton variant="gray">Gray</BaseButton>
      <BaseButton variant="white">White</BaseButton>
      <BaseButton variant="danger">Danger</BaseButton>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <BaseButton size="small">Small</BaseButton>
      <BaseButton size="medium">Medium</BaseButton>
      <div className="w-64">
        <BaseButton size="default">Default</BaseButton>
      </div>
      <div className="w-64">
        <BaseButton size="big">Big</BaseButton>
      </div>
    </div>
  ),
}
