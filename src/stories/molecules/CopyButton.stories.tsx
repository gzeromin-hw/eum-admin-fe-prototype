import type { Meta, StoryObj } from '@storybook/nextjs'
import CopyButton from '@/components/molecules/CopyButton'
import ReactToastify from '@/components/molecules/ReactToastify'

const meta: Meta<typeof CopyButton> = {
  title: 'Molecules/CopyButton',
  component: CopyButton,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <>
        <Story />
        <ReactToastify />
      </>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CopyButton>

export const Default: Story = {
  args: {
    text: '복사될 텍스트입니다.',
  },
}

export const WithTitle: Story = {
  args: {
    text: '복사될 텍스트입니다.',
    title: '복사하기',
  },
}

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <code className="flex-1 text-sm text-gray-700 dark:text-gray-300">
        npm install @anthropic-ai/sdk
      </code>
      <CopyButton text="npm install @anthropic-ai/sdk" />
    </div>
  ),
}
