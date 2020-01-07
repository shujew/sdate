/** @type {string} */
const cookieName = 'sdate-delta';

const helpers = {
  getCookie: (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  },
};

/**
 * Calculates the delta between the local computer time and the server time from worldtimeapi and
 * stores it inside a cookie
 */
const initialize = () => {
  /** @type {number} */
  const cookieExpDays = 7;

  /**
   * Sets a cookie on the page
   * @param {string} name
   * @param {string|number} value
   * @param {number} days
   * @param {string} path
   */
  const setCookie = (name, value, days, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};`
      + `expires=${expires};`
      + `path=${path};`; // + 'SameSite=None';
  };

  /**
   * Fetches server date from worldtimeapi and calls callback on parsed server date
   * @param {Function} callback
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
    setCookie(cookieName, delta, cookieExpDays);
  };

  fetchServerDate(parseServerDate);
};

const getSDate = () => {
  const delta = Number(helpers.getCookie(cookieName));
  return Number.isNaN(delta) ? Date.now() : new Date(Date.now() + delta);
};

initialize();

window.getSDate = getSDate;
