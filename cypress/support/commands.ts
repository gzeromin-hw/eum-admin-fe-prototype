/// <reference types="cypress" />

// data-id 속성으로 요소를 찾는 헬퍼 커맨드
// 사용법: cy.$('login-input-accountId')
Cypress.Commands.add(
  '$',
  (dataId: string, options?: Partial<Cypress.Timeoutable>) => {
    return cy.get(`[data-id="${dataId}"]`, options)
  },
)