# E2E tests with WebDriverIO and Jasmine


This is a demonstration project of advanced WebdriverIO methods.  
## Features
-   Configured to run browser and see console output on a single monitor 
-   TypeScript
-   Custom Debugging
-   Custom global.log
-   [Expect-webdriverio](https://github.com/webdriverio/expect-webdriverio)
-   ESlint
-   Prettier
-   cross-env 
-   Allure report (screenshots on failure)

## Requirements

-   node >= 16.13.x - [how to install Node](https://nodejs.org/en/download/)
-   npm >= 8.1.x - [how to install NPM](https://www.npmjs.com/get-npm)

## Getting Started

Install the dependencies:

```bash /zsh
npm install
```

Compile TypeScript:
```bash / zsh
npm run build
```

Run e2e tests:
Run this command to test the global.log command with empty/null strings and a Promise object 
```bash / zsh
npm run wdio
```

Run this command to test the Framework DEBUG command with a longer timeout 
```bash /zsh
npm run debug
```


## Reports
### Allure
Run this command to generate the allure report in the directory `./test-report/allure-report`:
You can run this command to start a server on your machine and open the allure report on the browser:
```bash / zsh
npm run report
```

## Prettier and Eslint
Run to format the code:
```bash / zsh
npm run code:format
```