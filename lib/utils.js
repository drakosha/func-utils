'use strict';

module.exports = {
  env,
  isArray,
  identity,
  mapKeys,
  getter,
  compose,
  ensureFn,
  forEachKey,
  G: getter
};

const getterChache = {};

/**
 * Map object keys to result array
 *
 * @param {Object}   object to map
 * @param {Function} map function
 *
 * @return {Array}   mapped object
 */
function mapKeys(obj, callback) {
  const result = [];

  for (const key in obj) result.push(callback(key, obj[key]));

  return result;
}

function isArray(obj) {
  return Array.isArray(obj);
}

function ensureFn(obj, functionFactory = getter) {
  if (typeof obj === 'function') return obj;

  return functionFactory(obj);
}

function forEachKey(obj, callback) {
  for (const key in obj) callback(key, obj[key]);
}

function getter(path) {
  const cached = getterChache[path];
  if (cached) return cached;

  path = path ? path.split('.') : [];

  return getterChache[path] = ctx => {
    let result = ctx;

    for (const key of path) {
      if (!result) break;
      result = result[key];
    }

    return result;
  };
}

function identity(value) {
  // make loop function if no arguments passed
  if (!arguments.length) return val => val;

  return () => value;
}

function compose(...fns) {
  // make loop function if no arguments passed
  if (!fns.length) return val => val;

  return data => {
    let result = fns[0](data);

    for (let i = 1; i < fns.length; i++)
      result = fns[i](result);

    return result;
  }
}

function env(key, dflt) {
  if (key in process.env) return process.env[key];

  if (dflt !== undefined) return dflt;

  throw new Error(`Please set ${key} in process environment.`);
}