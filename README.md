## Config html report for cyrpess
Use https://www.npmjs.com/package/cypress-mochawesome-reporter

### Setup
####install cypress-mochawesome-reporter
```
npm i --save-dev cypress-mochawesome-reporter
```
or

```
yarn add -D cypress-mochawesome-reporter
```

#### Config in Source code
Change cypress reporter
```
  # cypress.json
  "reporter": "cypress-mochawesome-reporter"
```

Add to cypress/support/index.js

```
  # cypress/support/index.js
  import 'cypress-mochawesome-reporter/register';
```

add to your package.json scripts
```
   # package.json
   "cypress:report": "generate-mochawesome-report"
```

Run cypress by
```
  ./node_modules/.bin/cypress run
  or
  yarn cypress run
```
 and then 
```
   npm run cypress:report
   # or
   yarn cypress:report
```
The report will ve available at
```
  .cypress/reports/html/index.html
```