'use strict';

exports.defaultSectionElementRenderer = defaultSectionElementRenderer;
exports.defaultMarkupElementRenderer = defaultMarkupElementRenderer;

var _utilsTagNames = require('../utils/tag-names');

var _sanitizationUtils = require('./sanitization-utils');

function defaultSectionElementRenderer(tagName, dom) {
  var element = undefined;
  if ((0, _utilsTagNames.isMarkupSectionElementName)(tagName)) {
    element = dom.createElement(tagName);
  } else {
    element = dom.createElement('div');
    element.setAttribute('class', tagName);
  }

  return element;
}

function sanitizeAttribute(tagName, attrName, attrValue) {
  if (tagName === 'a' && attrName === 'href') {
    return (0, _sanitizationUtils.sanitizeHref)(attrValue);
  } else {
    return attrValue;
  }
}

function defaultMarkupElementRenderer(tagName, dom, attrsObj) {
  var element = dom.createElement(tagName);
  Object.keys(attrsObj).forEach(function (attrName) {
    var attrValue = attrsObj[attrName];
    attrValue = sanitizeAttribute(tagName, attrName, attrValue);
    element.setAttribute(attrName, attrValue);
  });
  return element;
}