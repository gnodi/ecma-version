'use strict';

const ecmaVersion = require('./index');

describe('ecma-version', () => {
  describe('"getFromBrowser" method', () => {
    it('should return 5 for not compatible browsers', () => {
      const version = ecmaVersion.getFromBrowser('Firefox', 10);
      expect(version).toEqual(5);
    });

    it('should return 5 for old deprecated browsers', () => {
      const version = ecmaVersion.getFromBrowser('IE', 8);
      expect(version).toEqual(5);
    });

    it('should return 5 for unknown browsers', () => {
      const version = ecmaVersion.getFromBrowser('Firedog', 10);
      expect(version).toEqual(5);
    });

    it('should return 6 for es6 compatible browsers', () => {
      const version = ecmaVersion.getFromBrowser('Firefox', 55);
      expect(version).toEqual(6);
    });

    it('should ignore case', () => {
      let version = ecmaVersion.getFromBrowser('firefox', 10);
      expect(version).toEqual(5);

      version = ecmaVersion.getFromBrowser('firefox', 55);
      expect(version).toEqual(6);

      version = ecmaVersion.getFromBrowser('FIREFOX', 55);
      expect(version).toEqual(6);
    });

    it('should work with semver string version', () => {
      let version = ecmaVersion.getFromBrowser('Chromium', '1.1.2');
      expect(version).toEqual(5);

      version = ecmaVersion.getFromBrowser('Chromium', '56.1.2-alpha1');
      expect(version).toEqual(6);
    });
  });

  describe('"getFromUserAgent" method', () => {
    it('should return ECMAScript version from a user agent string', () => {
      let version = ecmaVersion.getFromUserAgent(
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/53.0.2785.143 Chrome/53.0.2785.143 Safari/537.36'
      );
      expect(version).toEqual(5);

      version = ecmaVersion.getFromUserAgent(
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/58.0.2785.143 Chrome/58.0.2785.143 Safari/537.36'
      );
      expect(version).toEqual(6);
    });

    it('should return 5 for not exploitable user agent', () => {
      let version = ecmaVersion.getFromUserAgent('');
      expect(version).toEqual(5);

      version = ecmaVersion.getFromUserAgent('Firefox');
      expect(version).toEqual(5);

      version = ecmaVersion.getFromUserAgent('2.3.5');
      expect(version).toEqual(5);
    });
  });

  describe('"getFromRequest" method', () => {
    it('should return ECMAScript version from a HTTP request object', () => {
      let userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/58.0.2785.143 Chrome/58.0.2785.143 Safari/537.36';
      let headers = {'user-agent': userAgent};
      let request = {headers};
      let version = ecmaVersion.getFromRequest(request);
      expect(version).toEqual(6);

      request = {
        headers: name => headers[name]
      };
      version = ecmaVersion.getFromRequest(request);
      expect(version).toEqual(6);

      userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/10.0.2785.143 Chrome/10.0.2785.143 Safari/537.36';
      headers = {'user-agent': userAgent};
      request = {
        header: name => headers[name]
      };
      version = ecmaVersion.getFromRequest(request);
      expect(version).toEqual(5);
    });

    it('should fail to retrieve a version for a request object with an unknown interface', () => {
      expect(() => ecmaVersion.getFromRequest({})).toThrowError(TypeError, 'Unknown request format');
      expect(() => ecmaVersion.getFromRequest()).toThrowError(TypeError, 'Unknown request format');
    });
  });

  describe('"getBrowserCompatibleVersion" method', () => {
    it('should return browser compatible version for an ECMAScript version', () => {
      let version = ecmaVersion.getBrowserCompatibleVersion('Firefox', 4);
      expect(version).toEqual(0);

      version = ecmaVersion.getBrowserCompatibleVersion('Firefox', 5);
      expect(version).toEqual(0);

      version = ecmaVersion.getBrowserCompatibleVersion('Firefox', 6);
      expect(version).toEqual(53);

      version = ecmaVersion.getBrowserCompatibleVersion('Edge', 5);
      expect(version).toEqual(12);
    });

    it('should return null when no compatible version exists for an ECMAScript version', () => {
      const version = ecmaVersion.getBrowserCompatibleVersion('IE', 6);
      expect(version).toBe(null);
    });
  });
});
