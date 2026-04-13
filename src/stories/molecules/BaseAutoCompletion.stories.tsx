import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import BaseAutoCompletion from '@/components/molecules/BaseAutoCompletion'

const meta: Meta<typeof BaseAutoCompletion> = {
  title: 'Molecules/BaseAutoCompletion',
  component: BaseAutoCompletion,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BaseAutoCompletion>

const options = [
  { value: 'gpt4', label: 'GPT-4', description: 'OpenAI' },
  { value: 'gpt35', label: 'GPT-3.5 Turbo', description: 'OpenAI' },
  { value: 'claude3', label: 'Claude 3 Opus', description: 'Anthropic' },
  { value: 'claude35', label: 'Claude 3.5 Sonnet', description: 'Anthropic' },
  { value: 'gemini', label: 'Gemini Pro', description: 'Google' },
  { value: 'llama', label: 'Llama 3', description: 'Meta' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-72">
        <BaseAutoCompletion
          options={options}
          value={value}
          onChange={setValue}
          placeholder="모델을 선택하세요"
        />
      </div>
    )
  },
}

export const WithSelectedValue: Story = {
  render: () => {
    const [value, setValue] = useState('claude35')
    return (
      <div className="w-72">
        <BaseAutoCompletion options={options} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const NotSearchable: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-72">
        <BaseAutoCompletion
          options={options}
          value={value}
          onChange={setValue}
          searchable={false}
          placeholder="검색 없는 드롭다운"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <BaseAutoCompletion
        options={options}
        value="gpt4"
        onChange={() => {}}
        disabled
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-72">
        <BaseAutoCompletion
          options={options}
          value={value}
          onChange={setValue}
          error="모델을 선택해주세요."
        />
      </div>
    )
  },
}

export const SimpleOptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const simpleOptions = [
      { value: 'a', label: '항목 A' },
      { value: 'b', label: '항목 B' },
      { value: 'c', label: '항목 C' },
    ]
    return (
      <div className="w-72">
        <BaseAutoCompletion
          options={simpleOptions}
          value={value}
          onChange={setValue}
          placeholder="항목 선택"
        />
      </div>
    )
  },
}
