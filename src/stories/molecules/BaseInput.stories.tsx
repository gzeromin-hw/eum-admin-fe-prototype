import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import BaseInput from '@/components/molecules/BaseInput'

const meta: Meta<typeof BaseInput> = {
  title: 'Molecules/BaseInput',
  component: BaseInput,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseInput>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseInput value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseInput label="이름" value={value} onChange={setValue} />
      </div>
    )
  },
}

export const RequiredLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseInput label="이메일" required value={value} onChange={setValue} placeholder="이메일을 입력하세요" />
      </div>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseInput
          label="아이디"
          required
          value={value}
          onChange={setValue}
          error="아이디를 입력해주세요."
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <BaseInput label="비활성화" value="읽기 전용 값" onChange={() => {}} disabled />
    </div>
  ),
}

export const Password: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseInput label="비밀번호" type="password" value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithCharCounter: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <BaseInput
          label="한줄 소개"
          value={value}
          onChange={setValue}
          maxLength={50}
          showCharCounter
        />
      </div>
    )
  },
}
