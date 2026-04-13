/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      /**
       * data-id 속성으로 요소를 찾는 커스텀 커맨드
       * @param dataId - data-id 속성 값
       * @param options - Cypress.Timeoutable 옵션 (선택사항)
       * @example cy.$('login-input-accountId')
       * @example cy.$('login-input-accountId', { timeout: 10000 })
       */
      $(dataId: string, options?: Partial<Cypress.Timeoutable>): Chainable<JQuery<HTMLElement>>
    }
  }
}

export {}

