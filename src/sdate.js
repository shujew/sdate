/** @type {Object} */
const dataStore = require('./dataStore');

/**
 * Provides methods to initialize and retrieve synchronized dates
 * @type {Object}
 */
const SDate = {
  /**
   * Storage wrapper around localstorage and cookies. Defaults to a volatile storage data
   * structure if both localstorage and cookies are unavailable
   * @type {Object}
   */
  dataStore,
  /** @type {string} */
  keyName: 'sdate-delta',
  /**
   * Calculates the delta between the local computer time and the server time from worldtimeapi
   * and stores it inside a cookie
   */
  initialize() {
    /**
     * Fetches server date from worldtimeapi and calls callback on parsed server date
     * @param {function} callback
     */
    const fetchServerDate = (callback) => {
      const endpoint = 'http://worldtimeapi.org/api/timezone/Etc/UTC';
      const req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          /** @type {string} */
          const respText = (req.responseText && !!req.responseText.length) ? req.responseText : '{}';
          /** @type {Object} */
          const respJson = JSON.parse(respText);
          /** @type {Object} */
          const utcDateTime = ('datetime' in respJson) ? Date.parse(respJson.datetime) : Date.now();
          callback(utcDateTime);
        }
      };
      req.open('GET', endpoint, true);
      req.send();
    };
    /**
     * Callback for fetching server date
     * @callback fetchServerDate
     * @param {Date} serverDate
     */
    const parseServerDate = (serverDate) => {
      const delta = serverDate - Date.now();
      this.dataStore.setItem(this.keyName, delta);
    };

    fetchServerDate(parseServerDate);
  },
  /**
   * Returns a synchronized date
   * @return {Date}
   */
  getDate() {
    const delta = Number(this.dataStore.getItem(this.keyName));
    return Number.isNaN(delta) ? Date.now() : new Date(Date.now() + delta);
  },
};

SDate.initialize();

module.exports = SDate;
