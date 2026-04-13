import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeInitScript } from '@/components/templates/ThemeInitScript'

const meta: Meta<typeof ThemeInitScript> = {
  title: 'Templates/ThemeInitScript',
  component: ThemeInitScript,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof ThemeInitScript>

export const LightTheme: Story = {
  render: () => (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      <ThemeInitScript initialTheme="light" />
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          ThemeInitScript
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          이 컴포넌트는 실제로 화면에 아무것도 렌더링하지 않습니다.
          HTML <code>&lt;head&gt;</code> 안에 삽입되어 페이지 로드 시 즉시 테마를 적용하는 인라인 스크립트를 주입합니다.
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          서버에서 감지한 <strong>initialTheme</strong> 값을 받아 쿠키·localStorage와 동기화한 뒤 <code>html</code> 엘리먼트에 <code>dark</code> 클래스와 <code>data-theme</code> 속성을 설정합니다.
        </p>
      </div>
    </div>
  ),
}
