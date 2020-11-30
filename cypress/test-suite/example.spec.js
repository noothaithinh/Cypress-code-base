import newUser from '@data-factories/user-new/user';

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


 xit('TC01 - Create BACS admin account', function() {
    // - Go to URL: https://snipe-nightly.symcresol.com/bacs/users/new
    cy.gotoPage('userNew.url')

    //   - Switch to BACS access group
    cy.getBy('userNew.bacsAccessGroup').click()
    
    //   - Input user ID: autotest_'user role'+'random number'@mail.com to full name textbox 
    cy.getBy('userNew.fullName').type(newUser.name);

    //   - Input user ID: autotest_'user role'+'random number'@mail.com to full email textbox 
    cy.getBy('userNew.email').type(newUser.email);

    //   - Select user group based on user role above
    cy.getBy('userNew.role').selectSearch(newUser.role);

    //   - Select user role: based on user role above
    cy.getBy('userNew.group').selectSearch(newUser.group);

  });

  it('Example selectOption', function() {
    cy.gotoPage('awk.url');

    cy.getBy('awk.containerType')
      .selectOption('20FR');
  })

  it('Example selectDate', function() {
    cy.gotoPage('inquiryHistories.url');

    cy.xpath('//input[@name="fromDate"]').selectDate('10/19/1993');
    cy.xpath('//input[@name="toDate"]').selectDate('5/15/1997');
  })

})
