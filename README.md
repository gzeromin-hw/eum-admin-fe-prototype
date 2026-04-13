# EUM Admin FE

EUM Admin FE는 Next.js(App Router) 기반의 관리자용 프론트엔드입니다.

## 개요

- 프레임워크: Next.js 16 + React 19 + TypeScript
- UI: Tailwind CSS 4, Atomic Design 컴포넌트 구조
- 국제화: next-intl (ko, en)
- 상태 관리: Zustand, TanStack Query
- 테스트/도구: Cypress, Storybook, ESLint

## 빠른 시작

### 요구 사항

- Node.js 20+
- npm 또는 pnpm

### 설치

```bash
npm install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

- 기본 주소: http://localhost:3000
- `NEXT_PUBLIC_PREFIX`를 사용하면 basePath가 적용됩니다.

## 스크립트

```bash
# 개발
npm run dev

# 빌드
npm run build

# 실행
npm run start

# 린트
npm run lint

# Storybook
npm run storybook
npm run build-storybook

# Cypress
npm run test
npm run test:run
```

````

설명:

- `NEXT_PUBLIC_PREFIX`: Next.js `basePath`에 사용됩니다.
- `NEXT_PUBLIC_GATEWAY_URL`: `/api/:path*` rewrite 대상 서버입니다.

## 라우팅/i18n

- locale 라우팅: `src/app/[locale]/...`
- 지원 언어: `ko`, `en`
- locale prefix: `always`

관련 파일:

- `src/i18n/routing.ts`
- `src/i18n/navigation.ts`
- `messages/ko.json`
- `messages/en.json`

## 프로젝트 구조

```text
src/
	app/                 # Next.js App Router
		[locale]/          # locale 단위 라우팅
		bff/               # BFF endpoints (필요 시 확장)
	components/          # atoms/molecules/organisms/templates
	hooks/               # custom hooks, zustand stores
	service/             # api, dto, http client/server
	i18n/                # next-intl 설정
	styles/              # 글로벌 스타일
messages/              # 번역 리소스
public/                # 정적 파일
cypress/               # E2E 테스트
````

## UI 컨벤션

이 프로젝트의 UI 방향은 "네모/각진 스타일"입니다.

- 과한 radius(특히 pill 형태) 지양
- 컨테이너/카드/입력 요소는 작은 radius 또는 직각 우선
- 화면 내 radius 사용 일관성 유지

AI 작업 가이드는 `.github/copilot-instructions.md`를 따릅니다.

## 배포 관련 파일

- `Dockerfile`

## 라이선스

Private repository.
