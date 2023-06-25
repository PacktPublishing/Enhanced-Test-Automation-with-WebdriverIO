# E2E tests with WebDriverIO and Jasmine


This is a demonstration project of advanced WebdriverIO methods.  
## Ch. 1 Utility Belt
-   Configured to run browser and see console output on a single monitor 
-   TypeScript 
-   [Expect-webdriverio](https://github.com/webdriverio/expect-webdriverio)
-   ESlint - Static code analysis tool
-   Prettier - Code formatting tool
-   cross-env - used to set environment variables in a consistent behavior across Windows / Mac and Linux 
-   Allure setup 

## Requirements
-   node >= 16.13.x - [how to install Node](https://nodejs.org/en/download/)
-   npm >= 8.1.x - [how to install NPM](https://www.npmjs.com/get-npm)

## Getting Started - Install the dependencies:
```powershell / zsh
npm install
```

## Run the "Hello World" script of Test Automation - Super Secret Login:
```powershell / zsh
npm run wdio
```

## Note: The Chrome browser version is constantly being updated. 
If the test briefly launches a browser and fails, update "chromedriver": "^114.0.2" in package.json to the current Chrome browser version.
If the test still fails, continue to Chapter 2 regarding node-check-updates package to update all packages.

## Note: This is not a selenium-standalone-service version
If you build a custom wdio project from the wizard and select selenium-standalone-server, Java will need to be installed.