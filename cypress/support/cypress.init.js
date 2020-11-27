Cypress.Cookies.defaults({
  preserve: Cypress.env('preserve')
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

