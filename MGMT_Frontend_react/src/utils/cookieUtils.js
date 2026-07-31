// src/utils/cookieUtils.js

/**
 * Set a cookie in the browser
 * @param {string} name 
 * @param {string} value 
 * @param {number} days 
 */
export const setCookie = (name, value, days = 30) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value || "") +
    expires +
    "; path=/; SameSite=Lax";
};

/**
 * Get a cookie value by name
 * @param {string} name 
 * @returns {string|null}
 */
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

/**
 * Remove a cookie by name
 * @param {string} name 
 */
export const removeCookie = (name) => {
  document.cookie =
    name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const Cookies = {
  get: getCookie,
  set: (name, value, options) => {
    const days = options?.expires || 30;
    setCookie(name, value, days);
  },
  remove: removeCookie,
};

export default Cookies;
