### Enhanced Test Automation with WebdriverIO


## what is this book about?


## Instructions and navigations


## Software and Hardware List
|Software covered in the book | Operating system requirements      |
| :--- |:-----------------------------------|
|WebdriverIO v.8 | Windows, macOS, or Linux           |
|TypeScript v.5.1.6|
|Java JDK @latest|
|Node v.18|
|Yarn @latest|
|Git @latest|
|GitHub Desktop latest version | GUI frontend for GitHub and GitLab |
|SelectorsHub 5.0 free edition | Chrome extension                   |
|EditThisCookie | Chrome extension                   |
|VS Code|
|Belarc Advisor Profiler (optional)free, single,personal-use license| Windows only |


### Get to Know the Author
Paul M. Grossman, aka @DarkArtsWizard on X and Threads, is a test automation framework architect,
project manager, and conference speaker with a love of stage magic. Since 2001, he has worked with
numerous toolsets, including WebdriverIO in TypeScript, Selenium in Java, OpenText UFT in VBScript, and
WinRunner in C++. He advocates for low-code automation tools for manual testers, including testRigor.
He is also the creator of the CandyMapper sandbox website, where he invites novice users to try their
hand at automating common challenges. You can find videos of his test automation experiments on his
YouTube channel at https://www.youtube.com/PaulGrossmanTheDarkArtsWizard.

Larry C. Goddard, aka “LarryG,” is the creator of Klassi-js. He boasts a stellar career as an award-winning
test automation framework architect, mentor, career coach, and speaker since 2000. His expertise
spans diverse toolsets, including AI, ML, WebdriverIO, JavaScript, TypeScript, and Selenium. With a
profound journey across aviation, software testing, and telecommunications sectors, he has also lent
his technical prowess to a major fashion house and served as an expert witness for an international
law firm. A father of five, an ex-international rugby player for Trinidad and Tobago, ex-military, and a
certified physical training instructor, he shares his extensive knowledge via insightful test automation
videos on https://youtube.com/@larryg_01.

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
