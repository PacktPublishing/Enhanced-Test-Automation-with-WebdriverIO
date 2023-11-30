## Enhanced Test Automation with WebdriverIO
This is the code repository for Enhanced Test Automation with WebdriverIO, published by Packt.

## what is this book about?


## Instructions and navigations


## Software and Hardware List


### Get to Know the Author


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

# E2E tests with WebDriverIO and Jasmine
.
└── package.json
├── tsconfig.json
├── wdio.conf.ts
└── test
    ├── specs
       └── example.e2e.ts
    └── pageobjects
       ├── login.page.ts
       ├── page.ts
       └── secure.page.ts
└── helpers
    └── helpers.ts
└── logs
    ├── wdio.log
    └── wdio-0-0.log
└── allure-results  # folder and content gets created automatically on test run
    └── chrome
        ├── xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-testsuite.xml
        └── xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-attachment.json

This is a demonstration project of advanced Typescript WebdriverIO helper methods.  
## Features

This is a demonstration project of advanced WebdriverIO methods.



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
