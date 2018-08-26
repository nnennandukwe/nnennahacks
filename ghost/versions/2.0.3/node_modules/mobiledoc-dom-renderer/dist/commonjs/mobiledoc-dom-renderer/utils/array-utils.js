"use strict";

exports.includes = includes;

function includes(array, detectValue) {
  for (var i = 0; i < array.length; i++) {
    var value = array[i];
    if (value === detectValue) {
      return true;
    }
  }
  return false;
}