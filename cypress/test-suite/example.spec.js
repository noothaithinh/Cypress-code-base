import * as UserNew from '@constants/user-new.const';
import newUser from '@data-factories/user-new/user.data';

describe('Scenario 01 - Demo common web element interactive', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  })

  beforeEach(() => {
    cy.restoreLocalStorage();
    // cy.command('login.login', 'admin');
    cy.login('admin')
  })

  afterEach(() => {
    cy.saveLocalStorage();
  });


 it('TC01 - Create BACS admin account', function() {
    // - Go to URL: https://snipe-nightly.symcresol.com/bacs/users/new
    cy.gotoPage(UserNew.url)

    //   - Switch to BACS access group
    cy.getBy('user-new.bacsAccessGroup').click()
    
    //   - Input user ID: autotest_'user role'+'random number'@mail.com to full name textbox 
    cy.getBy('user-new.fullName').type(newUser.name);

    //   - Input user ID: autotest_'user role'+'random number'@mail.com to full email textbox 
    cy.getBy('user-new.email').type(newUser.email);

    //   - Select user group based on user role above
    cy.getBy('user-new.role').selectSearch(newUser.role);

    //   - Select user role: based on user role above
    cy.getBy('user-new.group').selectSearch(newUser.group);

  })
})
