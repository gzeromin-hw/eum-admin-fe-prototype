import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import BaseCheckbox from '@/components/molecules/BaseCheckbox'

const meta: Meta<typeof BaseCheckbox> = {
  title: 'Molecules/BaseCheckbox',
  component: BaseCheckbox,
  parameters: { layout: 'centered' },
  argTypes: {
    color: { control: 'select', options: ['gray', 'black'] },
  },
}

export default meta
type Story = StoryObj<typeof BaseCheckbox>

export const Unchecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <BaseCheckbox id="cb-unchecked" checked={checked} onChange={setChecked} label="체크박스 항목" />
    )
  },
}

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <BaseCheckbox id="cb-checked" checked={checked} onChange={setChecked} label="선택된 항목" />
    )
  },
}

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <BaseCheckbox
        id="cb-indeterminate"
        checked={checked}
        indeterminate
        onChange={setChecked}
        label="부분 선택"
      />
    )
  },
}

export const BlackColor: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <BaseCheckbox id="cb-black" checked={checked} onChange={setChecked} label="블랙 체크박스" color="black" />
    )
  },
}

export const NoLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <BaseCheckbox id="cb-nolabel" checked={checked} onChange={setChecked} />
  },
}

export const Group: Story = {
  render: () => {
    const items = ['항목 A', '항목 B', '항목 C']
    const [selected, setSelected] = useState<string[]>([])

    const toggle = (item: string) => {
      setSelected(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <BaseCheckbox
            key={item}
            id={`cb-group-${item}`}
            checked={selected.includes(item)}
            onChange={() => toggle(item)}
            label={item}
          />
        ))}
      </div>
    )
  },
}
