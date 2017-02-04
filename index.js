'use strict';

const parseUserAgent = require('ua-parser-js');

// Browsers versions ES6 compatibility map.
const defaultCompatibleVersion = 5;
const browsersCompatibilities = [];
browsersCompatibilities[5] = {
  chrome: 0,
  chromium: 0,
  edge: 12,
  firefox: 0,
  ie: 5,
  'mobile safari': 0,
  mozilla: 0,
  opera: 0,
  safari: 0
};
browsersCompatibilities[6] = {
  chrome: 56,
  chromium: 56,
  edge: 15,
  firefox: 53,
  'mobile safari': 10,
  mozilla: 53,
  opera: 43,
  safari: 10
};

/**
 * Get ECMAScript version from a browser name and version.
 *
 * @param {string} browser - The browser name.
 * @param {string|number} version - The browser version.
 *
 * @returns {number} The corresponding ECMAScript version.
 */
exports.getFromBrowser = function getFromBrowser(browser, version) {
  const browserName = browser.toLowerCase();
  const majorVersion = typeof version === 'string'
    ? version.replace(/^(\d+).*/, '$1')
    : version;
  const comparedVersion = Number.parseInt(majorVersion, 10);
  let compatibleVersion = defaultCompatibleVersion;

  browsersCompatibilities.forEach((versionCompatibilities, ecmaVersion) => {
    if (
      browserName in versionCompatibilities
      && versionCompatibilities[browserName] <= comparedVersion
    ) {
      compatibleVersion = ecmaVersion;
    }
  });

  return compatibleVersion;
};

/**
 * Get ECMAScript version from a user agent string.
 *
 * @param {string} userAgent - The user agent string.
 *
 * @returns {number} The corresponding ECMAScript version.
 */
exports.getFromUserAgent = function getFromUserAgent(userAgent) {
  const ua = parseUserAgent(userAgent);
  const browser = ua.browser;

  // Return default compatible version in case of a not exploitable
  // user agent string.
  if (!browser.name || !browser.version) {
    return defaultCompatibleVersion;
  }

  return this.getFromBrowser(
    browser.name,
    browser.version
  );
};

/**
 * Get ECMAScript version from a HTTP request.
 *
 * @param {Object} request - The request object.
 *
 * @returns {number} The corresponding ECMAScript version.
 *
 * @throws {TypeError} If the request has an unknow format.
 */
exports.getFromRequest = function getFromRequest(request) {
  let userAgent;

  // Try to retrieve user agent string from various request interfaces.
  if (request && request.headers && typeof request.headers === 'object') {
    userAgent = request.headers['user-agent'];
  } else if (request && typeof request.headers === 'function') {
    userAgent = request.headers('user-agent');
  } else if (request && typeof request.header === 'function') {
    userAgent = request.header('user-agent');
  } else {
    throw new TypeError('Unknown request format');
  }

  return this.getFromUserAgent(userAgent);
};

/**
 * Get browser compatible version for an ECMAScript version.
 *
 * @param {string} browser - The browser version.
 * @param {number} ecmaVersion - The ECMAScript version.
 *
 * @returns {number|null} The corresponding browser major version or null if no compatible version.
 */
exports.getBrowserCompatibleVersion = function getCompatibleBrowserVersion(
  browser,
  ecmaVersion
) {
  let version = ecmaVersion <= defaultCompatibleVersion ? 0 : null;
  const browserName = browser.toLowerCase();

  if (
    ecmaVersion in browsersCompatibilities
    && browserName in browsersCompatibilities[ecmaVersion]
  ) {
    version = browsersCompatibilities[ecmaVersion][browserName];
  }

  return version;
};
