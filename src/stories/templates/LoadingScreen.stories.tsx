import type { Meta, StoryObj } from '@storybook/nextjs'
import LoadingScreen from '@/components/templates/LoadingScreen'
import BaseButton from '@/components/molecules/BaseButton'
import useLoadingStore from '@/hooks/store/loading'

const meta: Meta<typeof LoadingScreen> = {
  title: 'Templates/LoadingScreen',
  component: LoadingScreen,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof LoadingScreen>

const LoadingDemo = ({ message }: { message?: string }) => {
  const { setIsLoading, isLoading } = useLoadingStore()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
      <LoadingScreen />
      <BaseButton
        size="medium"
        variant={isLoading ? 'gray' : 'primary'}
        onClick={() =>
          isLoading
            ? setIsLoading(false)
            : setIsLoading(true, message)
        }
      >
        {isLoading ? '로딩 숨기기' : '로딩 보이기'}
      </BaseButton>
    </div>
  )
}

export const Default: Story = {
  render: () => <LoadingDemo />,
}

export const WithCustomMessage: Story = {
  render: () => <LoadingDemo message="데이터를 불러오는 중..." />,
}
