import type { Meta, StoryObj } from '@storybook/nextjs'
import { NoFlashWrapper } from '@/components/templates/NoFlashWrapper'

const meta: Meta<typeof NoFlashWrapper> = {
  title: 'Templates/NoFlashWrapper',
  component: NoFlashWrapper,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof NoFlashWrapper>

export const Default: Story = {
  render: () => (
    <NoFlashWrapper>
      <div className="rounded-xl bg-white p-8 shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          NoFlashWrapper 데모
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          이 컴포넌트는 테마 초기화 전에 화면이 깜빡이는 FART/FOUC 현상을 방지합니다.
          처음 마운트될 때 테마가 준비되면 서서히 나타납니다.
        </p>
      </div>
    </NoFlashWrapper>
  ),
}

export const WithClassName: Story = {
  render: () => (
    <NoFlashWrapper className="w-full">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
        <p className="text-blue-700 dark:text-blue-300">
          className prop으로 추가 스타일을 적용할 수 있습니다.
        </p>
      </div>
    </NoFlashWrapper>
  ),
}
