# Install
1. Install Git: 
	If you are using Macbook, **git** is installed to  your computer as **default**.
	Check it:
	```
	git
	```
	if result like `command not found: git` then you have to install git.
	[install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
	
2. Connect to github:
	[connect to github](https://gorails.com/setup/osx/10.15-catalina#git)
	
3. Install Node:
	If you are using Macbook, **node** is installed to  your computer as **default**.
	Check it:
	```
	node -v
	```
	if result like `command not found: node` then you have to install node.
	[install node](https://nodejs.org/en/download/)
	
4. Clone (download) source code:
	```
	git clone git@github.com:noothaithinh/Cypress-code-base.git
	```
5. Install:
	```
	cd Cypress-code-base
	npm install
	```
6. Add config:
	```
	cp cypress/config/development.template.json cypress/config/development.json
	```
	Then open file **cypress/config/development.json** and edit your config base on your environment.
	
7. Run:
	Run with UI:
	```
	npx cypress open
	```
	**OR**	
	Run in back-end:
	```
	npx cypress run
	```
8. Make report:
	```
	npx cypress run
	npm run cypress:report
	```
	
