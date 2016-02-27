'use strict';

/**
 * Module dependencies.
 */

const resolve = require('path').resolve;
const fs = require('fs');

/**
 * Serve favicon.ico
 *
 * @param {String} path
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

module.exports = function (path, options){
  if (!path) {
    return (ctx, next) => {
      if ('/favicon.ico' != ctx.path) {
        return next();
      }
    };
  }

  path = resolve(path);
  options = options || {};

  let icon;
  const maxAge = options.maxAge == null
    ? 86400000
    : Math.min(Math.max(0, options.maxAge), 31556926000);
  const cacheControl = `public, max-age=${maxAge / 1000 | 0}`;

  return (ctx, next) => {
    if ('/favicon.ico' != ctx.path) {
      return next();
    }

    if ('GET' !== ctx.method && 'HEAD' !== ctx.method) {
      ctx.status = 'OPTIONS' == ctx.method ? 200 : 405;
      ctx.set('Allow', 'GET, HEAD, OPTIONS');
    } else {
      // lazily read the icon
      if (!icon) icon = fs.readFileSync(path);
      ctx.set('Cache-Control', cacheControl);
      ctx.type = 'image/x-icon';
      ctx.body = icon;
    }
  };
};
