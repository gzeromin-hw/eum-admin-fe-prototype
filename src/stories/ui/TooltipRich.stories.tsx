import type { Meta, StoryObj } from '@storybook/nextjs'
import BaseButton from '@/components/molecules/BaseButton'
import { TooltipRich } from '@/components/ui/tooltip'

const meta: Meta<typeof TooltipRich> = {
  title: 'UI/TooltipRich',
  component: TooltipRich,
  parameters: { layout: 'centered' },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click'],
    },
  },
}

export default meta
type Story = StoryObj<typeof TooltipRich>

export const Top: Story = {
  render: () => (
    <div className="mt-20">
      <TooltipRich content="위쪽 툴팁입니다" side="top">
        <BaseButton size="medium" variant="white">
          마우스를 올려보세요
        </BaseButton>
      </TooltipRich>
    </div>
  ),
}

export const Bottom: Story = {
  render: () => (
    <TooltipRich content="아래쪽 툴팁입니다" side="bottom">
      <BaseButton size="medium" variant="white">
        마우스를 올려보세요
      </BaseButton>
    </TooltipRich>
  ),
}

export const Left: Story = {
  render: () => (
    <div className="ml-40">
      <TooltipRich content="왼쪽 툴팁입니다" side="left">
        <BaseButton size="medium" variant="white">
          마우스를 올려보세요
        </BaseButton>
      </TooltipRich>
    </div>
  ),
}

export const Right: Story = {
  render: () => (
    <TooltipRich content="오른쪽 툴팁입니다" side="right">
      <BaseButton size="medium" variant="white">
        마우스를 올려보세요
      </BaseButton>
    </TooltipRich>
  ),
}

export const ClickTrigger: Story = {
  render: () => (
    <TooltipRich content="클릭으로 열리는 툴팁" trigger="click">
      <BaseButton size="medium" variant="primary">
        클릭해보세요
      </BaseButton>
    </TooltipRich>
  ),
}

export const LongContent: Story = {
  render: () => (
    <div className="mt-20">
      <TooltipRich
        content="이것은 매우 긴 툴팁 내용입니다. 여러 줄로 표시될 수 있으며 최대 너비가 자동으로 조정됩니다."
        side="top"
        autoWidth
      >
        <BaseButton size="medium" variant="white">
          긴 툴팁
        </BaseButton>
      </TooltipRich>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <TooltipRich content="이 툴팁은 비활성화 됩니다" disabled>
      <BaseButton size="medium" variant="white">
        비활성화된 툴팁
      </BaseButton>
    </TooltipRich>
  ),
}

export const WithRichContent: Story = {
  render: () => (
    <div className="mt-20">
      <TooltipRich
        side="top"
        content={
          <div className="flex flex-col gap-1">
            <div className="font-bold">커스텀 툴팁</div>
            <div className="text-xs text-gray-300">
              슬롯으로 자유롭게 꾸밀 수 있어요
            </div>
          </div>
        }
      >
        <BaseButton size="medium" variant="white">
          커스텀 슬롯
        </BaseButton>
      </TooltipRich>
    </div>
  ),
}

export const EdgeCasePositioning: Story = {
  render: () => (
    <div className="flex items-end justify-end" style={{ height: '200px' }}>
      <TooltipRich content="우측 하단에서도 잘 보이는 툴팁" side="top">
        <BaseButton size="medium" variant="white">
          우측 하단 버튼
        </BaseButton>
      </TooltipRich>
    </div>
  ),
}
