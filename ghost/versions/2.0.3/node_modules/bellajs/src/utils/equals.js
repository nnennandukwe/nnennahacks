// utils / equals

import {
  isEmpty,
  isObject,
  isArray,
  isString,
  isNumber,
  isDate,
  hasProperty,
} from './detection';

export const equals = (a, b) => {
  let re = true;
  if (isEmpty(a) && isEmpty(b)) {
    return true;
  }
  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }
  if (isNumber(a) && isNumber(b) || isString(a) && isString(b)) {
    return a === b;
  }
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    if (a.length > 0) {
      for (let i = 0, l = a.length; i < l; i++) {
        if (!equals(a[i], b[i])) {
          re = false;
          break;
        }
      }
    }
  } else if (isObject(a) && isObject(b)) {
    let as = [];
    let bs = [];
    for (let k1 in a) {
      if (hasProperty(a, k1)) {
        as.push(k1);
      }
    }
    for (let k2 in b) {
      if (hasProperty(b, k2)) {
        bs.push(k2);
      }
    }
    if (as.length !== bs.length) {
      return false;
    }
    for (let k in a) {
      if (!hasProperty(b, k) || !equals(a[k], b[k])) {
        re = false;
        break;
      }
    }
  }
  return re;
};
