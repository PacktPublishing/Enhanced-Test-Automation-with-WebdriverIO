import * as helpers from './helpers/helpers.js';
import { ASB } from './helpers/globalObjects.js'

import url from 'node:url'
import path from 'node:path'
import { browser } from '@wdio/globals';
const addToElement = true // 
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
// Chapter 4 - Automation SwitchBoard 

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
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
    capabilities: [{

        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: 5,
        //
        browserName: 'chrome',
        acceptInsecureCerts: true
        // If outputDir is provided WebdriverIO can capture driver session logs
        // it is possible to configure which logTypes to include/exclude.
        // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
        // excludeDriverLogs: ['bugreport', 'server'],
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'debug',
    outputDir: path.resolve(__dirname, 'logs'),
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
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
    baseUrl: 'http://the-internet.herokuapp.com',
    //
    // Default timeout for all waitFor* commands. Reduced to 3 sec
    waitforTimeout: 3000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,

    services: [],
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.

    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: ['spec'],
    //
    // Options to be passed to Jasmine.
    framework: 'jasmine',
    jasmineOpts: {
        // Jasmine default timeout
        defaultTimeoutInterval: 9999999,

        //
        // The Jasmine framework allows interception of each assertion in order to log the state of the application
        // or website depending on the result. For example, it is pretty handy to take a screenshot every time
        // an assertion fails.
        // expectationResultHandler: function(passed, assertion) {
        //     do something
        // }
    // The Jasmine framework allows interception of each assertion in order to log the state of the application
    // or website depending on the result. For example, it is pretty handy to take a screenshot every time
    // an assertion fails.
    expectationResultHandler: async function (passed, assertion) {
      /**
       * only take screenshot if assertion failed
       */
      if (passed) {
        return;
      }

      try {
        await console.log (`Jasmine screenshot of ${assertion.error.message}.`)
        await console.log (`Waiting for ${timeout/60000} min...`)
        await browser.saveScreenshot(
            `assertionError_${assertion.error.message}.png`);
        await browser.pause(timeout);
        await console.log(`DEBUG wait done`)
      } catch (error) {
            await console.log(`The screen capture failed. Check for a missing await statement. ${error}`)
      }
    },


    // Option #2: Run browser 3/4 screen on single monitor
    // Allow VS Code Terminal visible on bottom of the screen
    await global.log(`Changing window size`);
    await browser.setWindowSize(1920, 770);
  },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  beforeHook: function (test, context) {
    // Create custom commands here
  },
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
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs)
    {

        //Set 
        //helpers.log(`process.env.DEBUG: ${process.env.DEBUG}`) // ---> process.env.DEBUG: -LH:*

        ASB.set("DEBUG", (process.env.DEBUG === undefined) ? false : (process.env.DEBUG === `true`))
        ASB.set("spinnerTimeoutInSeconds", 30) 

        helpers.log(`DEBUG: ${ASB.get("DEBUG")}`)

        ASB.set("timeout", (ASB.get("DEBUG") === true) ? 1_000_000 : 10_000)
        let timeout = ASB.get("timeout")

        helpers.log(`timeout = ${Math.ceil(timeout / 60_000)} min.`)

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


        // });

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

    beforeTest: async function (text: any, context: any)
    {
        //Option #1: Run browser full screen on dual monitors
        //browser.maximizeWindow();

        // Option #2: Run browser 3/4 screen on single monitor
        // Allow VS Code Terminal visible on bottom of the screen  
        await helpers.log(`Changing window size`)
        await browser.setWindowSize(1920, 770)
    },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine).
     */

    afterTest: async function (test: any, context: any, { error, result, duration, passed, retries }: any)
    {
        helpers.log("AFTER TEST")
        // Check if a missing element failed the test
       

        if (!passed)
        {
            await browser.takeScreenshot();
        }
    },


    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    afterSuite: function (suite) {
        helpers.log("AFTER SUITE")
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
    helpers.log("AFTER")

    },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    afterSession: function (config, capabilities, specs) {
        helpers.log("AFTER SESSION")
    },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: function(exitCode, config, capabilities, results) {
        helpers.log("ON COMPLETE")
        if (ASB.get("alreadyFailed")){
            throw new Error('Test failed');
        }

    },
    /**
    * Gets executed when a refresh happens.
    * @param {String} oldSessionId session ID of the old session
    * @param {String} newSessionId session ID of the new session
    */
    //onReload: function(oldSessionId, newSessionId) {
    //}
}