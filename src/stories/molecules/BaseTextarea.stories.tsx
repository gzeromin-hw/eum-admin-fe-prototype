import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import BaseTextarea from '@/components/molecules/BaseTextarea'

const meta: Meta<typeof BaseTextarea> = {
  title: 'Molecules/BaseTextarea',
  component: BaseTextarea,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseTextarea>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseTextarea value={value} onChange={setValue} placeholder="내용을 입력하세요." />
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseTextarea label="설명" value={value} onChange={setValue} placeholder="설명을 입력하세요." />
      </div>
    )
  },
}

export const RequiredLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseTextarea label="내용" required value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseTextarea
          label="내용"
          required
          value={value}
          onChange={setValue}
          error="내용을 입력해주세요."
        />
      </div>
    )
  },
}

export const WithCharCounter: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseTextarea
          label="비서 설명"
          value={value}
          onChange={setValue}
          maxLength={200}
          showCharCounter
          placeholder="비서에 대한 설명을 입력하세요."
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <BaseTextarea label="비활성화" value="읽기 전용 내용입니다." onChange={() => {}} disabled />
    </div>
  ),
}

export const TallTextarea: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseTextarea
          label="긴 내용"
          value={value}
          onChange={setValue}
          minHeight={120}
          maxHeight={300}
        />
      </div>
    )
  },
}
