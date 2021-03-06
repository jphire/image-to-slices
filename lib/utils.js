'use strict';

var utils = {};

// whether is browser
utils.isBrowser = function() {
  var isElectron = utils.isElectron();
  var isNW = utils.isNW();
  return !isElectron && !isNW && !(typeof window === 'undefined' || typeof navigator === 'undefined');
};

// whether is Node
utils.isNode = function() {
  return !(typeof process === 'undefined' || !process.platform || !process.versions);
};

// whether is NW.js (Node-webkit)
utils.isNW = function() {
  var isNode = utils.isNode();
  return isNode && !(typeof global === 'undefined' || !process.__node_webkit || !process.versions['node-webkit']);
};

// whether is Electron
utils.isElectron = function() {
  var isNode = utils.isNode();
  return isNode && !(typeof global === 'undefined' || !process.versions.electron);
};

// detect object type
utils.type = function(obj) {
  return Object.prototype.toString.call(obj).split(' ')[1].replace(']', '');
};

utils.each = function(stack, handler) {
  var len = stack.length;

  // Array
  if (len) {
    for (var i = 0; i < len; i++) {
      if (handler.call(stack[i], stack[i], i) === false) {
        break;
      }
    }
  }
  // Object
  else if (typeof len === 'undefined') {
    for (var name in stack) {
      if (handler.call(stack[name], stack[name], name) === false) {
        break;
      }
    }
  }
};

// shallow copy
// utils.extend(target, obj1, obj2, ...)
utils.extend = function(target) {
  utils.each(arguments, function(source, index) {
    if (index > 0) {
      utils.each(source, function(value, key) {
        if (typeof value !== 'undefined') {
          target[key] = value;
        }
      });
    }
  });
};

// setter
utils.setter = function(target, name, value) {
  var nameType = utils.type(name);

  // setter(name, value)
  if (nameType === 'String') {
    if (typeof target[name] === 'undefined') {
      throw new Error('Invalid configuration name.');
    }

    if (typeof value === 'undefined') {
      throw new Error('Lack of a value corresponding to the name');
    }

    if (utils.type(value) === 'Object' && utils.type(target[name]) === 'Object') {
      utils.extend(target[name], value);
    } else {
      target[name] = value;
    }
  }
  // setter({...})
  else if (nameType === 'Object') {
    value = name;
    utils.extend(target, value);
  }
  // otherwise throws
  else {
    throw new Error('Invalid arguments');
  }
};

// get file format
utils.getFileFormat = function(str) {
  var format = str.substr(str.lastIndexOf('.') + 1, str.length);
  return format;
};

// sort and unique for array
utils.sortAndUnique = function(arr) {
  var result = [];
  var lineHash = {};

  utils.each(arr, function(line) {
    if (!lineHash[line]) {
      result.push(line);
      lineHash[line] = true;
    }
  });

  return result.sort(function(a, b) {
    return a - b > 0;
  });
};

module.exports = utils;
