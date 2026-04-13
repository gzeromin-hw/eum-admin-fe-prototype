import type { Meta, StoryObj } from '@storybook/nextjs'
import ReactToastify from '@/components/molecules/ReactToastify'
import BaseButton from '@/components/molecules/BaseButton'
import { useToast } from '@/hooks/useToast'

const meta: Meta<typeof ReactToastify> = {
  title: 'Molecules/ReactToastify',
  component: ReactToastify,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof ReactToastify>

const ToastDemo = () => {
  const { openToast } = useToast()
  return (
    <div className="flex flex-col gap-3">
      <ReactToastify />
      <div className="flex gap-3">
        <BaseButton
          size="medium"
          variant="primary"
          onClick={() => openToast('success', '성공적으로 완료되었습니다.')}
        >
          성공 토스트
        </BaseButton>
        <BaseButton
          size="medium"
          variant="danger"
          onClick={() => openToast('error', '오류가 발생했습니다.')}
        >
          오류 토스트
        </BaseButton>
        <BaseButton
          size="medium"
          variant="gray"
          onClick={() => openToast('warning', '주의가 필요합니다.')}
        >
          경고 토스트
        </BaseButton>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ToastDemo />,
}

export const WithSubtitle: Story = {
  render: () => {
    const Demo = () => {
      const { openToast } = useToast()
      return (
        <div className="flex flex-col gap-3">
          <ReactToastify />
          <BaseButton
            size="medium"
            variant="primary"
            onClick={() => openToast('success', '파일이 저장되었습니다.', '변경사항이 자동으로 반영됩니다.')}
          >
            서브타이틀 포함 토스트
          </BaseButton>
        </div>
      )
    }
    return <Demo />
  },
}
