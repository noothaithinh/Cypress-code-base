// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Get more infor at: https://github.com/abramenal/cypress-file-upload#readme
 * upload file in Cypress
 * Syntax:
 *      cy.get(selector).attachFile(yourFixturePath)
 *
 */
import "cypress-localstorage-commands";
import 'cypress-file-upload';

/**
 * Set currentUser to alias '@currentUser'
 * @param { String | Object } user  The current user.
 * Example:
 *  cy.setCurrentUser('@user') // Set user from alias.
 *  cy.setCurrentUser('admin') // Set user from config Cypress.env.users['admin'].
 *  cy.setCurrentUser({email: 'abc@email.com', password: '123' }) // Set user from an Object.
 */
Cypress.Commands.add('setCurrentUser', (user) => {
  let obj;

  if (typeof user === "string") {
    if (/^@/.test(user)) {
      obj = cy.get(user, { log: false });
    } else {
      obj = cy.wrap(Cypress.env('users')[user]);
    }
  } else {
    obj = cy.wrap(user, { log: false });
  }

  return obj.as('currentUser');
})

/**
 * login
 * @params { String | Object } currentUser  The user to login.
 * Example:
 *  cy.login() // Login with exist '@currentUser'.
 *  cy.login('@user') // Login with alias '@user'.
 *  cy.login('admin') // Login with admin from config Cypress.env.users['admin']
 *  cy.login({email: 'email@email.com', password: '123'}) // Login with an Object.
 */
Cypress.Commands.add('login', (currentUser) => {
  if (currentUser) {
    cy.setCurrentUser(currentUser);
  }

  cy.get('@currentUser').then(user => {
    cy.request('POST', Cypress.env('apiUrl') + '/api/v1/auth', user)
      .then((res) =>{
        cy.setLocalStorage("login", "true");
      });
  })
})


/**
 * Go to page, auto login if not loged-in and wait until page ready.
 * @param { String } page  The page url.
 * Example:
 *  cy.gotoPage('/bacs/users')
 */
Cypress.Commands.add('gotoPage', (page) => {
  cy.getLocalStorage("login").then(logedin => {
    logedin || cy.login();
  })

  cy.initWaitApi();
  cy.visit(page);
  cy.waitApi('gotoPage')
})


