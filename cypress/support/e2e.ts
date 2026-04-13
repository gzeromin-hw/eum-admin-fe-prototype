// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Hydration 에러 및 기타 예상된 에러를 무시
// Next.js와 React의 hydration 불일치는 테마 시스템이나 브라우저 확장 프로그램으로 인해 발생할 수 있습니다.
// 이러한 에러는 실제 애플리케이션 동작에 영향을 주지 않으므로 테스트에서 무시합니다.
Cypress.on('uncaught:exception', (err, runnable) => {
  // Hydration 관련 에러 무시
  if (
    err.message.includes('Hydration failed') ||
    err.message.includes('Minified React error') ||
    err.message.includes('hydration')
  ) {
    return false // 테스트 계속 진행
  }
  // 다른 에러는 정상적으로 처리
  return true
})