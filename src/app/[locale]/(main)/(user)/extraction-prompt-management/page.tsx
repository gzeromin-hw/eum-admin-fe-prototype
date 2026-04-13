import ExtractionPromptManagementMockView, {
  type ExtractionPromptItem,
} from './_components/ExtractionPromptManagementMockView'

export default function ExtractionPromptManagementPage() {
  const promptItems: ExtractionPromptItem[] = [
    {
      uuid: 'prompt-v1-0',
      revision: 'v1.0',
      createdByName: '김한화',
      createdAt: '2026-03-23T08:00:00.000Z',
      content: `다음 작업지시서 문서에서 엔티티와 관계를 추출하세요.
- 블록 코드와 호선 번호를 우선 식별
- 날짜는 ISO 8601(YYYY-MM-DD)로 변환
- 추론한 정보는 description에 근거를 남길 것`,
    },
    {
      uuid: 'prompt-v1-1',
      revision: 'v1.1',
      createdByName: '이호선',
      createdAt: '2026-03-27T03:20:00.000Z',
      content: `텍스트에서 생산 계획 정보와 실적 정보를 분리 추출하세요.
- Plan/Actual 노드를 구분
- 공장명은 InsideShop/OutsideShop/OverseaShop 중 선택
- 누락 필드는 null이 아닌 빈 문자열로 처리`,
    },
    {
      uuid: 'prompt-v1-2',
      revision: 'v1.2',
      createdByName: '박서준',
      createdAt: '2026-04-01T10:15:00.000Z',
      content: `문서 내 수치, 일정, 담당 부서를 구조화하세요.
- 주차 정보(YYWW)는 해당 주 월요일~금요일 범위로 변환
- 단위 정보(톤, m, %)는 hasUnit 속성으로 분리
- 엔티티 중복 시 가장 상세한 description을 우선 보존`,
    },
  ]

  return <ExtractionPromptManagementMockView initialPrompts={promptItems} />
}
