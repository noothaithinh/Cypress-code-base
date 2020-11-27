import 'cypress-wait-until';

/**
 * Init waitApi command
 * - It must be called before cy.waitApi()
 */
Cypress.requestQueue = {};
Cypress.Commands.add("initWaitApi", () => {
  cy.server({
    onRequest: (req) => {
      Cypress.requestQueue[req.id] = req;
    },
    onResponse: (res) => {
      delete Cypress.requestQueue[res.id];
      Object.keys(Cypress.requestQueue).forEach(key => {
        if (Cypress.requestQueue[key].canceled) {
          delete Cypress.requestQueue[key];
        }
      })
    }
  });
  cy.route('POST', '**').as('post')
  cy.route('**').as('get')
})


/**
 * Wait all API (XHRs)
 * @param { String } label  The name of the task. 
 * @param { Int } delay  The delay time to makesure request is pushed in Cypress.requestQueue
 * Exampe:
 *  cy.initWaitApi() // must call initWaitApi to init the task.
 *  // call some API here...
 *  cy.waitApi(1000) // wait APIs delay 1s
 *  // or
 *  // cy.waitApi('request page') // after wait finished will log a label 'request page'
 */
Cypress.Commands.add('waitApi', (...args) => {
  let delay = 500;
  let label = 'XHRs';

  // overide the setting
  args.forEach(arg => {
    if (typeof arg === "string") {
      label = arg;
    } else if (typeof arg === "number"){
      delay = arg;
    }
  })

  cy.wait(delay, {log: false});
  cy.waitUntil(()=> Object.keys(Cypress.requestQueue).length === 0, {log: false})
  cy.wait(delay, {log: false}).then(() => {
    // log the message
    Cypress.log({
      name: 'waitApi',
      displayName: 'waitApi',
      message: `'${label}' finished`
    })
  });
})


/**
 * Click and Wait API finished
 * Example:
 *  cy.getBy('User.btnCreateUser').clickWaitApi() // click to button create-user and wait the task.
 */
Cypress.Commands.add('clickWaitApi', { prevSubject: 'element' }, ($el, label = 'clickWaitApi') => {
  if ($el) {
    cy.initWaitApi();
    cy.get($el, {log: false}).click()
    cy.waitApi(label);
  }
})
