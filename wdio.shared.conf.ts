// Updated for 2024!

import { ASB } from './helpers/globalObjects';
import * as helpers from './helpers/helpers';
require('dotenv').config();

const DEBUG =
    process.env.DEBUG === undefined ? true : process.env.DEBUG === `true`;
console.log(`DEBUG: ${DEBUG}`);

let timeout = DEBUG === true ? 1_000_000 : 10_000;
console.log(`timeout = ${Math.ceil(timeout / 60_000)} min.`);

const addToElement = true

/**
 *  The baseUrl will only be used if you don't specify a url in your script
 *  loadPage('/')
 *  if you specify on then its ignored
 *  loadPage('https://candymapper.com/')
 */
export let baseUrl: string
let env = process.env.Env
let urls = {
    uat: 'https://the-internet.herokuapp.com',
    dev: 'https://candymapperr2.com',
    prod: 'https://candymapper.com'
}
baseUrl = urls[env]

const ANSI_PASS = `\x1b[38;2;0;255;0m` // GREEN
const ANSI_FAIL = `\x1b[38;2;255;0;0m`    // RED
const ANSI_WARNING = `\x1b[38;2;255;255;0m`  // YELLOW
const ANSI_LOCATOR = `\x1b[38;2;200;150;255m`  // Light Purple
const ANSI_STRING = `\x1b[38;2;173;216;230m`  // Light Blue TEXT entered into a field
const ANSI_TEXT = `\x1b[97m`  // White TEXT
const ANSI_RESET = `\x1b[0m` //Reset
let LAST_MESSAGE: string = "";
let LAST_MESSAGE_COUNT: number = 0;
ASB.set("LAST_MESSAGE_COUNT", 0);
ASB.set("LAST_MESSAGE", "");
declare global {
    var log: (text: any) => void;
}

global.log = (message: any) => {
    //Skip repeated messages
    LAST_MESSAGE = ASB.get("LAST_MESSAGE");
    LAST_MESSAGE_COUNT = ASB.get("LAST_MESSAGE_COUNT");

    if (LAST_MESSAGE === message) {
        ASB.set("LAST_MESSAGE_COUNT", LAST_MESSAGE_COUNT++);
        return;
    }

    if (LAST_MESSAGE_COUNT > 0) {
        console.log(`   └ ─ >   This message repeated ${LAST_MESSAGE_COUNT} times`);
        ASB.set("LAST_MESSAGE_COUNT", 0);
    }
    ASB.set("LAST_MESSAGE", message);
    let messageString: string = message + " " ;

    try {
        if (typeof message === "string" || typeof message === "number") {
            if (message) {

                if (messageString.toString().includes(`[object Promise]`)) {
                    messageString = (`--->  WARN: ${message} \n      Promise object detected. async function call missing await keyword.`);
                    console.trace();
                }

                if (messageString.includes("WARN: ")) {
                    messageString = ANSI_WARNING + messageString + " " + ANSI_RESET
                } else if (messageString.includes("FAIL: ") || messageString.includes("ERROR: ") || messageString.includes("Promise")) {
                    messageString = ANSI_FAIL + messageString + " " + ANSI_RESET
                } else if (messageString.includes("PASS: ")) {
                    // PASS
                    messageString = ANSI_PASS + message + " " + ANSI_RESET
                } else {
                    messageString = ANSI_TEXT + message + " " + ANSI_RESET
                }

                //Send colored content to Debug console
                //Highlight CSS and XPath selectors in Purple case-insensitive to 'Selector' and 'selector'
                //let regex = /Selector '(.*?)' /ig;
                //messageString = messageString.replace(regex, ` Selector '${ANSI_LOCATOR}$1${ANSI_RESET}' `);
                
                let regex = /Selector "(.*?)" /ig;
                messageString = messageString.replace(regex, ` Selector "${ANSI_LOCATOR}$1${ANSI_RESET}" `);
                
                console.log(`--->   ${messageString}`);
            }
        }
    } catch (error: any) {
        console.log(`--->   helpers.console(): ${error.message}`);
    }
};

export const config: Omit<WebdriverIO.Config, 'capabilities'> = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    //
    // =====================
    // ts-node Configurations
    // =====================
    //
    // You can write tests using TypeScript to get autocompletion and type safety.
    // You will need typescript and ts-node installed as devDependencies.
    // WebdriverIO will automatically detect if these dependencies are installed
    // and will compile your config and tests for you.
    // If you need to configure how ts-node runs please use the
    // environment variables for ts-node or use wdio config's autoCompileOpts section.
    //
    autoCompileOpts: {
        autoCompile: true,
        // see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
        // for all available options
        tsNodeOpts: {
            transpileOnly: true,
        },
        // tsconfig-paths is only used if "tsConfigPathsOpts" are provided, if you
        // do please make sure "tsconfig-paths" is installed as dependency
        // tsConfigPathsOpts: {
        //     baseUrl: './'
        // }
    },
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
    specs: ["./test/specs/**/*.ts"],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    injectGlobals: true,
    // Inserts WebdriverIO's globals (e.g. `browser`, `$` and `$$`) into the global environment.
    // If you set to `false`, you should import from `@wdio/globals`. Note: WebdriverIO doesn't
    // handle injection of test framework specific globals.
    // capabilities: [
    //     {
    //     // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    //     // grid with only 5 firefox instances available you can make sure that not more than
    //     // 5 instances get started at a time.
    //         browserName: 'chrome',
    //         // or "firefox", "microsoftedge", "safari"
    //         'goog:chromeOptions': {
    //             args: ['--disable-gpu', '--enable-automation', '--disable-infobars', '--disable-notifications']
    //         }
    //     },
    //     {
    //         browserName: 'firefox'
    //     }
    //     // acceptInsecureCerts: true,
    // ],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: "warn",
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: environments[process.env.BASE_ENV].baseUrl,
    baseUrl: baseUrl,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: [
        "chromedriver",
        "geckodriver"
    ],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: "jasmine",
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: ["spec", ["allure",
        {
            outputDir: "./reports/allure-results",
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
        }]],

    //
    // Options to be passed to Jasmine.
    jasmineOpts: {
        // Jasmine default timeout
        defaultTimeoutInterval: timeout,
        //
        // The Jasmine framework allows interception of each assertion in order to log the state of the application
        // or website depending on the result. For example, it is pretty handy to take a screenshot every time
        // an assertion fails.
        expectationResultHandler: async function (passed, assertion) {
            /**
             * only take screenshot if assertion failed
             */
            if (!passed) {
                await browser.saveScreenshot(`./reports/assertionError.png`)
            }
        }
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function (config, capabilities) {
    },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialized
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {Number} exitCode 0 - success, 1 - fail
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {Number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {String} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {commandName} wdio command
     * @param {args} arguments passed to the command
     */
    beforeCommand: function (commandName, args) {
        if (commandName === '$') {
            const selector = args[0];
            // Modify the selector or add additional functionality as needed
            // For example, you can add a prefix to the selector
            global.log(`BEFORE $ COMMAND: Selector "${selector}" sent to ASB("elementSelector")`);
            // Pass the locator to the switchboard
            ASB.set("elementSelector", selector);
        }

        if (commandName === '$$') {
            const selector = args[0];
            // Modify the selector or add additional functionality as needed
            // For example, you can add a prefix to the selector for custom color logging
            global.log(`BEFORE $$ COMMAND: Selector "${selector}" sent to ASB("elementsSelector")`);
            // Pass the locator to the switchboard
            ASB.set("elementsSelector", selector);
        }

    },

    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {Object}         browser      instance of created browser/device session
     */
    before: function (capabilities, specs) {
        //Set
        //helpers.log(`process.env.DEBUG: ${process.env.DEBUG}`) // ---> process.env.DEBUG: -LH:*
        ASB.set("DEBUG", (process.env.DEBUG === undefined) ? false : (process.env.DEBUG === `true`));
        ASB.set("spinnerTimeoutInSeconds", 30);

        global.log(`DEBUG: ${ASB.get("DEBUG")}`);

        ASB.set("timeout", (ASB.get("DEBUG") === true) ? 1000000 : 10000);
        let timeout = ASB.get("timeout");

        global.log(`timeout = ${Math.ceil(timeout / 60000)} min.`);
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    beforeTest: async function (test, context) {
        //Option #1: Run browser full screen on dual monitors
        await browser.maximizeWindow();

        // Option #2: Run browser 3/4 screen on single monitor
        // Allow VS Code Terminal visible on bottom of the screen
        global.log(`Adjusting window size`);
        let windowSize = await browser.getWindowSize();
        await browser.setWindowRect(-7, 0, windowSize.width, windowSize.height * 0.85);
    },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context) {
    //   // Create custom commands here
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {Object}  test             test object
     * @param {Object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {Any}     result.result    return object of test function
     * @param {Number}  result.duration  duration of test
     * @param {Boolean} result.passed    true if test has passed, otherwise false
     * @param {Object}  result.retries   informations to spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    afterTest: async function (
        test,
        context,
        { error, result, duration, passed, retries }
    ) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },
    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    afterSuite: function (suite) {
        global.log("AFTER SUITE");
    },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    after: function (result, capabilities, specs) {
        global.log("AFTER");
    },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    afterSession: function (config, capabilities, specs) {
        global.log("AFTER SESSION");
    },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: function (exitCode, config, capabilities, results) {
        global.log("ON COMPLETE");
        if (ASB.get("alreadyFailed")) {
            throw new Error('Test failed');
        }

    },
};
