# E2E tests with WebDriverIO and Jasmine


This is a demonstration project of advanced WebdriverIO methods.

## Pre-Requisite
Please ensure you have these packages installed globally using their most stable version:
```
- NodeJS
- Yarn
- Java JDK
- An IDE (IntelliJ, VSCode etc..)
- Git

Extra steps if you are using a windows machine:
Setup the environment PATH for node
Reboot the machine for all the changes to take effect
```

## Ch. 1 Utility Belt
-   Configured to run browser and see console output on a single monitor 
-   TypeScript 
-   [Expect-webdriverio](https://github.com/webdriverio/expect-webdriverio)
-   ESlint - Static code analysis tool
-   Prettier - Code formatting tool
-   Allure setup 

## Requirements
-   node >= 18 - [how to install Node](https://nodejs.org/en/download/)
-   yarn >= 1.22.x - [how to install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

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



## Ch. 2 Fortress of Solitude – 
Configuring WebdriverIO 
Allure Report Dependencies
Node-Check-Updates 