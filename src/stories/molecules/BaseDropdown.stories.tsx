import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import BaseDropdown from '@/components/molecules/BaseDropdown'

const meta: Meta<typeof BaseDropdown> = {
  title: 'Molecules/BaseDropdown',
  component: BaseDropdown,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseDropdown>

const options = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4 (비활성화)', disabled: true },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <BaseDropdown options={options} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <BaseDropdown label="카테고리" options={options} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const RequiredLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <BaseDropdown
          label="필수 선택"
          required
          options={options}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <BaseDropdown
          label="카테고리"
          required
          options={options}
          value={value}
          onChange={setValue}
          error="항목을 선택해주세요."
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <BaseDropdown label="비활성화" options={options} value="option1" disabled />
    </div>
  ),
}

export const EmptyOptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <BaseDropdown label="빈 목록" options={[]} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const manyOptions = Array.from({ length: 20 }, (_, i) => ({
      value: `opt${i}`,
      label: `옵션 ${i + 1}`,
    }))
    return (
      <div className="w-64">
        <BaseDropdown label="많은 옵션" options={manyOptions} value={value} onChange={setValue} />
      </div>
    )
  },
}
