import { url } from '@constants/login';


export function login(currentUser) {
  // set current user
  if (currentUser) {
    cy.setCurrentUser(currentUser);
  }

  cy.get('@currentUser').then(user => {
    // goto login page 
    cy.location("pathname", { log: false }).then((currentPath) => {
      if (currentPath !== url) {
        cy.visit(url)
      }
    });

    // login by ui
    cy.getBy('login.email').type(user.email);
    cy.getBy('login.password').type(user.password);
    cy.getBy('login.submit').clickWaitApi('submit login')
  })
}


export function loginApi(currentUser) {
  if (currentUser) {
    cy.setCurrentUser(currentUser);
  }

  cy.get('@currentUser').then(user => {
    cy.request('POST', Cypress.env('apiUrl') + '/api/v1/auth', user)
      .then((res) =>{
        cy.setLocalStorage("login", "true");
      });
  })
}
