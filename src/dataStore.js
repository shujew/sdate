/**
 * Storage wrapper around localstorage and cookies. Defaults to a volatile storage data
 * structure if both localstorage and cookies are unavailable
 * @type {Object}
 */
const dataStore = {
  /**
   * Used as fallback if localstorage and custom storage are not available. This is a volatile
   * date structure thus contents will be wiped across different sessions/tabs/...
   * @type {Object}
   */
  customStorage: {},
  /**
   * Retrieves an item from the data store
   * @param  {string} name
   * @return {string|null}
   */
  getItem(name) {
    if (window.localStorage) {
      return window.localStorage.getItem(name);
    } else if (window.document) {
      return this.getCookie(name);
    } else {
      return this.customStorage[name] || null;
    }
  },
  /**
   * Sets a value for a key in the data store. Will override any existing value.
   * @param  {string} key
   * @param  {string|number} value
   * @return {boolean}
   */
  setItem(key, value) {
    if (window.localStorage) {
      window.localStorage.setItem(key, value);
    } else if (window.document) {
      this.setCookie(key, value);
    } else {
      this.customStorage[key] = value;
    }
    return true;
  },
  /**
   * Retrieves a cookie from document
   * @private
   * @param  {string} name
   * @return {string|null}
   */
  getCookie(name) {
    /** @type {string} */
    const value = window.document.cookie.split('; ')
      .reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
      }, '');
    return value.length > 0 ? value : null;
  },
  /**
   * Sets a cookie on the document
   * @private
   * @param {string} name
   * @param {string|number} value
   * @param {number} days
   * @param {string} path
   */
  setCookie(name, value, days = 365, path = '/') {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const location = window.location || { protocol: '' };
    window.document.cookie = `${name}=${encodeURIComponent(value)};`
      + `expires=${expires};`
      + `path=${path};`
      + `${location.protocol === 'https:' ? 'SameSite=None;' : ''}`
      + `${location.protocol === 'https:' ? 'secure' : ''}`;
  },
};

module.exports = dataStore;
