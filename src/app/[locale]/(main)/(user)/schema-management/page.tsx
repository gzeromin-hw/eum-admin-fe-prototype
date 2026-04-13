import { readFile } from 'fs/promises'
import path from 'path'
import SchemaManagementMockView, {
  type SchemaDocument,
} from './_components/SchemaManagementMockView'

const fallbackYaml = `version: '1.1'
domain: 'shipbuilding_block_production'
description: |
  조선소 블록 생산 계획/실적 관리 도메인 스키마.
  본 데이터는 목업 화면 확인용입니다.
`

async function readSchemaYaml() {
  const schemaPath = path.join(process.cwd(), 'src/data/schema.yaml')

  try {
    return await readFile(schemaPath, 'utf-8')
  } catch {
    return fallbackYaml
  }
}

export default async function SchemaManagementPage() {
  const schemaYaml = await readSchemaYaml()

  const schemaDocuments: SchemaDocument[] = [
    {
      id: 'schema-main',
      name: 'schema.yaml',
      description: '도메인 엔티티/관계 정의 메인 스키마',
      status: 'active',
      updatedAt: '2026-04-02',
      content: schemaYaml,
      histories: [
        {
          id: 'schema-main-v1-3',
          revision: 'v1.3',
          changedByName: '김한화',
          changedAt: '2026-04-02T09:30:00.000Z',
          changeSummary:
            '도메인 컨텍스트를 보강하고 extraction guideline을 최신 운영 규칙에 맞게 정리했습니다.',
          content: schemaYaml,
        },
        {
          id: 'schema-main-v1-2',
          revision: 'v1.2',
          changedByName: '이호선',
          changedAt: '2026-03-29T04:20:00.000Z',
          changeSummary:
            '이슈 관련 엔티티와 관계 타입 정의를 추가하고 state tracking 설명을 보완했습니다.',
          content: `version: '1.2'
domain: 'shipbuilding_block_production'
description: |
  조선소 블록 생산 계획/실적 관리 도메인 스키마.
  이슈 관리와 계획/실적 조회를 함께 지원한다.

entity_types:
  MonthlyAssemblyPlan:
    description: 월간 조립 계획
  WorkStageActual:
    description: 작업 단계 실적
  Issue:
    description: 생산 이슈

relation_types:
  HAS_ISSUE:
    description: 프로젝트가 이슈를 가짐
  MITIGATED_BY:
    description: 이슈가 조치로 완화됨
`,
        },
        {
          id: 'schema-main-v1-1',
          revision: 'v1.1',
          changedByName: '박서준',
          changedAt: '2026-03-23T01:10:00.000Z',
          changeSummary:
            '프로젝트, 블록, 공장 중심의 초기 스키마 구조를 등록했습니다.',
          content: `version: '1.1'
domain: 'shipbuilding_block_production'
description: |
  조선소 블록 생산 계획/실적 관리 도메인 스키마.

entity_types:
  Project:
    description: 건조 프로젝트
  Block:
    description: 선체 블록
  InsideShop:
    description: 사내 공장

relation_types:
  ASSIGNEDTOSHOP:
    description: 계획이 공장에 배정됨
  PLANNEDONBLOCK:
    description: 계획이 블록에 매핑됨
`,
        },
      ],
    },
    {
      id: 'schema-issue-template',
      name: 'schema.issue-template.yaml',
      description: '이슈 추출 템플릿(목업)',
      status: 'draft',
      updatedAt: '2026-04-01',
      content: `issue_template:
  required_fields:
    - title
    - issue_type
    - category
  states: [Open, In Progress, Resolved, Closed]
`,
      histories: [
        {
          id: 'schema-issue-template-v0-8',
          revision: 'v0.8',
          changedByName: '이호선',
          changedAt: '2026-04-01T07:15:00.000Z',
          changeSummary:
            '필수 필드 목록과 상태 집합을 최신 이슈 검토 프로세스에 맞춰 조정했습니다.',
          content: `issue_template:
  required_fields:
    - title
    - issue_type
    - category
  states: [Open, In Progress, Resolved, Closed]
`,
        },
        {
          id: 'schema-issue-template-v0-7',
          revision: 'v0.7',
          changedByName: '김한화',
          changedAt: '2026-03-26T02:40:00.000Z',
          changeSummary:
            '초기 이슈 템플릿을 생성하고 title, category 필드를 필수값으로 지정했습니다.',
          content: `issue_template:
  required_fields:
    - title
    - category
  states: [Open, Closed]
`,
        },
      ],
    },
    {
      id: 'schema-shop-template',
      name: 'schema.shop-template.yaml',
      description: '공장 분류 템플릿(목업)',
      status: 'draft',
      updatedAt: '2026-03-30',
      content: `shop_template:
  code_field: hasCode
  name_field: comment
  shop_types:
    - InsideShop
    - OutsideShop
    - OverseaShop
`,
      histories: [
        {
          id: 'schema-shop-template-v0-6',
          revision: 'v0.6',
          changedByName: '박서준',
          changedAt: '2026-03-30T05:00:00.000Z',
          changeSummary:
            '공장 코드와 명칭 필드를 분리하고 해외 공장 타입을 명시했습니다.',
          content: `shop_template:
  code_field: hasCode
  name_field: comment
  shop_types:
    - InsideShop
    - OutsideShop
    - OverseaShop
`,
        },
        {
          id: 'schema-shop-template-v0-5',
          revision: 'v0.5',
          changedByName: '김한화',
          changedAt: '2026-03-24T08:30:00.000Z',
          changeSummary:
            '사내 공장과 사외 공장 분류만 포함한 초기 공장 템플릿입니다.',
          content: `shop_template:
  code_field: hasCode
  shop_types:
    - InsideShop
    - OutsideShop
`,
        },
      ],
    },
  ]

  return <SchemaManagementMockView initialSchemas={schemaDocuments} />
}
