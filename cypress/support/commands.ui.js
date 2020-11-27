import 'cypress-xpath';
import _ from 'lodash';

/**
 * Add format to String prototype
 * Example: "This is {0} of {1} {2}".format("example", "String", "format")
 * result: "This is example of String format"
 */
String.prototype.format = function() {
  let str = this;
  for (let k in arguments) {
    str = str.replace("{" + k + "}", arguments[k]);
  }
  return str;
}

/**
 * Add toDashCase to String prototype.
 * Convert string to dash-case.
 * Example:
 *    "ThisIs+example_of/string.to dash-case".toDashCase();
 *    // result: "this-is-example-of-string-to-dash-case"
 *
 */
String.prototype.toDashCase = function() {
  return this.replace(/\W+/g, '_')
              .split(/_|(?=[A-Z])/)
              .join('-')
              .toLowerCase();
}

/**
 * Get infrastructure by id
 * @param { String } folder  The infrastructure folder.
 * @param { String } id  The id to get value.
 * @param { Any } defaultValue  The default value.
 * @return { Any }
 * Example:
 *  Cypress.getInfrastructure('selectors', 'nooThai.thinh.file.value1.value2');
 *  // result will be like:
 *  // const ret = require('../infrastructure/selectors/noo-thai/thinh/file{<suffix>}');
 *  // return ret.value1.value2;
 *
 *  Cypress.getInfrastructure('selectors', 'This.is.wrong.path', 'This is default value);
 *  // result is "This is default value"
 *
 */
Cypress.getInfrastructure = function (folder, id, defaultValue) {
  const suffix = _.get(Cypress.env('suffix'), folder, "");
  const keys = id.split('.');
  const paths = [ folder ];
  const errorPaths = [];
  let fullPath;
  let ret;

  // find the target file
  do {
    paths.push(keys.shift().toDashCase());
    let path = `${paths.join('/')}${suffix}`;
    fullPath = `../infrastructure/${path}.js`;

    try {
      ret = require(`../infrastructure/${path}`);
      break;
    } catch (e) {
      errorPaths.push(fullPath);
    }

  } while (keys.length > 0);

  // get valule from remain keys
  if (keys.length > 0) {
    ret = _.get(ret, keys.join('.'));
  }

  // set the default value
  ret ||= defaultValue;

  // throw the error message if ret is undefined
  if (ret === undefined) {
    let errorMsg  = `ID: "${id}" UNDEFINED\n`;

    if(keys.length > 0) {
      errorMsg += `${fullPath}\n`;
      errorMsg += `KEY: ${keys.join('.')}`;
    } else {
      errorMsg += `File not found:\n${errorPaths.join('\n')}\n`;
    }

    throw new Error(errorMsg);
  }

  return ret;
}


/**
 * Get element by 'componentId'
 *  - It will file component in ../infrastructure/structors
 *    if component not found default value cy.get('[data-cy=commponentId]')
 *  - Selector support Jquery, Xpaht format
 *  - Allow pass params to selector:
 * @params { String } componentId  The Id of component.
 * @params { [String] } ...args  All params you want to pass to selector 
 * @return { $Cypress }
 * Example:
 *    cy.getBy('user.email')
 *    cy.getBy('users.itemInRow', 'A unit value exist in target row')
 *    cy.getBy('users.parentItem').getBy('user.childItem')
 */
Cypress.Commands.add('getBy', {prevSubject: 'optional'}, ($el, componentId, ...args) => {
  const infrastructureName = 'selectors';
  const isXpathReg = /^\//; // to check xpath format 
  let $cy = cy;

  if ($el) {
    $cy = cy.get($el);
  }

  // const selector = Cypress.getInfrastructure('selectors', componentId, `[data-cy="${componentId}"]`);
  const selector = Cypress.getInfrastructure('selectors', componentId);

  if (isXpathReg.test(selector)) {
    return $cy.xpath(selector.format(...args));
  } else {
    return $cy.get(selector.format(...args));
  }
});

/**
 * Use command from infrastructure command
 * @param { String } path  The path to command.
 * @param { any } ...args  All params to pass to target command.
 * @return { $Cypress }
 * Example:
 *  cy.command('login.login') // Run command login from infrastructure/command/login.js
 */
Cypress.Commands.add('command', (path, ...args) => {
  const command = Cypress.getInfrastructure('commands', path);

  return command(...args);
})

/**
 * Select value from react-select
 * @param { String } value  The value want to select. 
 * @return { $Cypress }
 * Example:
 *  cy.getBy('user.selectGroup').selectSearch('Admin') // Select value 'Admin' from Group (react-select)
 */
Cypress.Commands.add('selectSearch', { prevSubject: 'element' }, ($el, value) => {
  if ($el) {
    cy.get($el, {log: false}).type(value);
    cy.xpath(`//*[contains(@id, "react-select-") and contains(text(), "${value}")]`).click();
  }
})
