'use strict';
const https = require('https');
const querystring = require('querystring');
const fiveYears = 5 * 365 * 24 * 3600 * 1000;

/**
 * Sends a pageview to google analytics using measurement protocol
 * @param {String} propertyId the GA property ID, like UA-00000-1
 * @param {String} cookieName the name of the cookie to use as cid
 * @return {Function}
 */
module.exports = function gaPageview(propertyId, cookieName) {
    return function* gaPageview(next) {
        let cookie = this.cookies.get(cookieName) || uuid();
        this.cookies.set(cookieName, cookie, {
            maxAge: fiveYears,
            overwrite: true,
            signed: false
        });

        postToGa({
            v: '1',
            t: 'pageview',
            tid: propertyId,
            cid: cookie,
            uip: this.request.ip,
            ua: this.request.header['user-agent'],
            dr: this.request.referer || this.request.referrer,
            dl: this.request.url,
            z: Math.random()
        });

        yield* next;
    };
};

/**
 * Returns a pseudo-random uuid v4
 * from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @return {String}
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * Turns the params into a query string and posts them to GA
 * @param {Object} params
 */
function postToGa(params) {
    https.request({
        method: 'POST',
        hostname: 'google-analytics.com',
        path: '/collect'
    }).end(querystring.stringify(params));
}
