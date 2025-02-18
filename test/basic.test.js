const wdio = require('webdriverio');
const assert = require('assert');

const opts = {
  port: 4723,
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:app':
      '/home/karpagamb/Appium/appium/android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:appPackage': 'com.appium',
    'appium:appActivity': 'com.appium.MainActivity',
    'appium:newCommandTimeout': 3600,
    'appium:fullReset': true,
  },
  protocol: 'http',
  hostname: 'localhost',
  path: '/',
  connectionRetryCount: 3,
  connectionRetryTimeout: 30000,
};

describe('Basic App Testing', () => {
  let client;

  before(async () => {
    try {
      console.log(
        'Starting Appium session with options:',
        JSON.stringify(opts, null, 2),
      );
      client = await wdio.remote(opts);
      console.log('Appium session started successfully');
    } catch (error) {
      console.error('Failed to start Appium session:', error.message);
      throw error;
    }
  });

  after(async () => {
    if (client) {
      try {
        await client.deleteSession();
      } catch (error) {
        console.error('Error cleaning up session:', error.message);
      }
    }
  });

  it('should launch the app successfully', async () => {
    try {
      await client.waitUntil(
        async () => {
          const appRoot = await client.$(
            'android=new UiSelector().packageName("com.appium")',
          );
          return await appRoot.isDisplayed();
        },
        {
          timeout: 10000,
          timeoutMsg: 'App did not launch within 10 seconds',
        },
      );
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });

  it('should find welcome text', async () => {
    try {
      // Added wait for element to be visible
      const welcomeText = await client.$(
        'android=new UiSelector().textContains("Welcome")',
      );
      await welcomeText.waitForDisplayed({
        timeout: 5000,
        timeoutMsg: 'Welcome text not found within 5 seconds',
      });
      assert.strictEqual(await welcomeText.isDisplayed(), true);
    } catch (error) {
      console.error('Welcome text test failed:', error.message);
      throw error;
    }
  });
  it('should find App.tsx text', async () => {
    try {
      // Added wait for element to be visible
      const appText = await client.$(
        'android=new UiSelector().textContains("App.tsx")',
      );
      await appText.waitForDisplayed({
        timeout: 5000,
        timeoutMsg: 'App.tsx text not found within 5 seconds',
      });
      assert.strictEqual(await appText.isDisplayed(), true);
    } catch (error) {
      console.error('App.tsx text test failed:', error.message);
      throw error;
    }
  });
});
