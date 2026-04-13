import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import BaseSearchInput from '@/components/molecules/BaseSearchInput'

const meta: Meta<typeof BaseSearchInput> = {
  title: 'Molecules/BaseSearchInput',
  component: BaseSearchInput,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseSearchInput>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <BaseSearchInput
        value={value}
        onChange={setValue}
        placeholder="검색어를 입력하세요."
      />
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('검색어')
    return (
      <BaseSearchInput value={value} onChange={setValue} placeholder="검색어를 입력하세요." />
    )
  },
}

export const SmallSize: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <BaseSearchInput
        value={value}
        onChange={setValue}
        placeholder="검색..."
        width="14rem"
        height="2.25rem"
      />
    )
  },
}

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-96">
        <BaseSearchInput
          value={value}
          onChange={setValue}
          placeholder="비서를 검색해보세요."
          width="100%"
        />
      </div>
    )
  },
}
