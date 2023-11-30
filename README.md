## Enhanced Test Automation with WebdriverIO
This is the code repository for [Enhanced Test Automation with WebdriverIO](https://www.packtpub.com/product/enhanced-test-automation-with-webdriverio/9781837630189), published by Packt.

## What is this book about?
This book serves as a comprehensive guide to mastering advanced WebdriverIO concepts for end-to-end testing of web applications. It includes custom command wrappers and implementing AI powered self-healing object strategies. The book is designed to augment the skillset of  Software Developer Engineers in Test (SDETs) covering aspects including dynamic data handling, detailed reporting, and integrating automated tests into CI/CD pipelines. It's particularly beneficial for those seeking to streamline test maintenance and automate complex test scenarios.

This book covers the following exciting features:
* Setting up the installation of WDIO
* Configuration of VS Code and custom settings to make life easier
* Write wrappers for Click, Select and SetValue
* Enhance data entry with self-updating data tags for date and format 
* Implement examples of class switching for self-healing objects to reduce maintenence
* Enhance reporting detail in color in the console 
* Report to Allure including screen captures
* How to skip the page object model finding objects by text alone 
* How to automate stateless end-to-end user journey where user choices change the order pages appear
* Setting up a CI/CD job for manual testers to automate complex data setup events via LambdaTest  



## Instructions and navigations
All of the code is organized into folders in the repository and looks like this: 

```bash
.
└── helpers
    └── globalObjects.ts
    └── helpers.ts
└── shared-data
    └── userData.json
└── tests
    └── pageObjects
    └── specs
    └── utilities
wdio.dev.conf.ts
wdio.lambdatest.conf.ts
wdio.shared.conf.ts
```
The code itself will look like the following:
```ts
class SecurePage extends Page {
    /**
    * define selectors using getter methods
    */
    public get flashAlert () {
        global.log(`Getting flashalert`)
        return $('#flash');
    }
}
```


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


## Get to Know the Author
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
