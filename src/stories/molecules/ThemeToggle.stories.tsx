import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Molecules/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}

export const InHeader: Story = {
  render: () => (
    <div className="flex items-center gap-4 rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">테마 설정</span>
      <ThemeToggle />
    </div>
  ),
}
