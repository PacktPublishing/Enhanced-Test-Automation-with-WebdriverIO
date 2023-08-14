import type { Options } from '@wdio/types';
import { ASB } from './helpers/globalObjects';

const DEBUG =
    process.env.DEBUG === undefined ? true : process.env.DEBUG === `true`;
console.log(`DEBUG: ${DEBUG}`);

let timeout = DEBUG === true ? 1_000_000 : 10_000;
console.log(`timeout = ${Math.ceil(timeout / 60_000)} min.`);

const addToElement = true //
//const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
// Chapter 4 - Automation SwitchBoard

export const config = {
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
      project: "tsconfig.json",
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
  // of the configuration file being run.
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
  specs: [
    './test/specs/**/*.ts'
  ],
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
  capabilities: [{
    // capabilities for local browser web tests
    browserName: 'chrome', // or "firefox", "microsoftedge", "safari"
    'goog:chromeOptions': {
      args: ['--disable-gpu', '--enable-automation', '--disable-infobars', '--disable-notifications']
    },
    acceptInsecureCerts: true,
  }],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'warn',
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
  baseUrl: 'http://localhost',
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
  services: ['chromedriver'],

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'jasmine',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  reporters: ['spec', ['allure', {outputDir: 'reports/allure-results'}]],
  //
  // Options to be passed to Jasmine.
  jasmineOpts: {
    defaultTimeoutInterval: timeout,
    expectationResultHandler: async function (passed, assertion) {
      if (passed) {
        return;
      }
      await browser.saveScreenshot(
          `assertionError_${assertion.error}.png`
      );
    },
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
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed before a worker process is spawned and can be used to initialise specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  // beforeSession: function (config, capabilities, specs, cid) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  // before: function (capabilities, specs) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {commandName} wdio command
   * @param {args} arguments passed to the command
   */
  beforeCommand: function (commandName, args) {
    // Chapter 5 - Keep the current object locator for future manipulation
    let elementSelectorType: String
    let elementSelector: String
    let paddedCommandName: String = commandName.padEnd(12, ' ');
    switch (commandName) {
      case 'findElements':
      case 'findElement':
        // Pass the class and locator to the Automation Switchboard  
        elementSelectorType = args[0];
        elementSelector = args[1];
        global.log(`beforeCommand ${paddedCommandName}: ASB.get("selectorType") will return '${elementSelectorType}'`)
        global.log(`beforeCommand ${paddedCommandName}: ASB.get("selector") will return '${elementSelector}'`)
        ASB.set("selectorType", elementSelectorType)
        ASB.set("selector", elementSelector)
        break;

      default:
        // X-Ray Vision - see all the commands that get executed 
        // Uncomment to see all commands executed, but logging will mpact execution run time.
        // global.log(`beforeCommand ${commandName}`);
        break;
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

    ASB.set("DEBUG", (process.env.DEBUG === undefined) ? false : (process.env.DEBUG === `true`))
    ASB.set("spinnerTimeoutInSeconds", 30)

    global.log(`DEBUG: ${ASB.get("DEBUG")}`)

    ASB.set("timeout", (ASB.get("DEBUG") === true) ? 1_000_000 : 10_000)
    let timeout = ASB.get("timeout")

    global.log(`timeout = ${Math.ceil(timeout / 60_000)} min.`)

    // Samples of overidding and adding custom methods.

    // browser.addCommand("clickAdv", async function ()
    // {
    //     // `this` is return value of $(selector)
    //     //await this.waitForDisplayed()
    //     helpers.log(`Clicking ${this.selector} ...`)
    //     let locator = "ELEMENT NOT FOUND"

    //     try
    //     {
    //         if (ASB.get(`alreadyFailed`) === true)
    //         {
    //             helpers.log(`  SKIPPED: browser.clickAdv(${this.selector})`);

    //         } else
    //         {
    //             await this.click({ block: 'center' })
    //             helpers.log(`  button clicked.`)
    //             await helpers.pageSync()
    //         }
    //     } catch (error)
    //     {
    //         helpers.log(`Element was not clicked.\n${error}`)
    //         //Skip any remaining steps
    //         ASB.set(`alreadyFailed`, false)
    //     }
    // }, addToElement)

    // Override the default click command

    // browser.overwriteCommand('click', async (element: ElementFinder) => {

    //     // Do something before clicking the element
    //     console.log('Overwrite the intrinsic click command...');

    //     // Perform the click action
    //     try
    //     {
    //         helpers.log(`Clicking ${this.selector} ...`)
    //         await this.click({ block: 'center' })

    //         await helpers.pageSync()
    //         helpers.log(`done`)
    //     } catch (error)
    //     {
    //         helpers.log(`Element was not clicked.\n${error}`)
    //     }

    // })
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
    //browser.maximizeWindow();

    // Option #2: Run browser 3/4 screen on single monitor
    // Allow VS Code Terminal visible on bottom of the screen
    await global.log(`Changing window size`);
    await browser.setWindowSize(1920, 770);
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
      {error, result, duration, passed, retries}
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
    global.log("AFTER SUITE")
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
    global.log("AFTER")
  },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  afterSession: function (config, capabilities, specs) {
    global.log("AFTER SESSION")
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
    global.log("ON COMPLETE")
    if (ASB.get("alreadyFailed")) {
      throw new Error('Test failed');
    }

  },
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  // onReload: function(oldSessionId, newSessionId) {
  // }
  /**
   * Hook that gets executed after the suite has ended
   * @param {object} suite suite details
   */
// afterSuite: function (suite) {
// },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
// afterCommand: function (commandName, args, result, error) {
// },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
// after: function (result, capabilities, specs) {
// },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
// afterSession: function (config, capabilities, specs) {
// },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
// onComplete: function(exitCode, config, capabilities, results) {
// },
  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
// onReload: function(oldSessionId, newSessionId) {
// }
}
global.log = async (text: any) => {
    if (text) {
        //truthy value check
        if (text === Promise) {
            console.log(`--->     WARN: Log was passed a Promise object`);
            console.trace();
        } else {
            console.log(`---> ${text}`);
        }
    }
};
