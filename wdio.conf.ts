import type { Options } from "@wdio/types";
import { Browser } from "webdriverio";

const DEBUG =
  process.env.DEBUG === undefined ? true : process.env.DEBUG === `true`;
console.log(`DEBUG: ${DEBUG}`);

let timeout = DEBUG === true ? 1_000_000 : 10_000;
console.log(`timeout = ${Math.ceil(timeout / 60_000)} min.`);

export const config: Options.Testrunner = {
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "test/tsconfig.json",
    },
  },
  specs: ["./test/specs/**/*.ts"],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
    },
  ],
  logLevel: "warn",
  bail: 0,
  baseUrl: "http://localhost",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ["chromedriver"],
  framework: "jasmine",
  reporters: ["spec", ["allure", { outputDir: "allure-results" }]],
  jasmineOpts: {
    defaultTimeoutInterval: timeout,
    expectationResultHandler: async function (passed, assertion) {
      if (passed) {
        return;
      }
      await browser.saveScreenshot(
        `assertionError_${assertion.error.message}.png`
      );
    },
  },
  beforeTest: async function (test, context) {
    await global.log(`Changing window size`);
    await browser.setWindowSize(1920, 770);
  },
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};

global.log = async (text: any) => {
  if (text) {
    if (text === Promise) {
      console.log(`--->     WARN: Log was passed a Promise object`);
      console.trace();
    } else {
      console.log(`---> ${text}`);
    }
  }
};
