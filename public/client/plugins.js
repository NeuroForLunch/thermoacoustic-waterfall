// This module is basically a shim for the server's plugin-index resource to be loaded as a module (and parsed only once).

'use strict';

define(['text!plugin-index.json'], (text) => {
  const exports = {};

  const pluginIndex = JSON.parse(text);
  const moduleIds = Object.freeze(Array.prototype.slice.call(pluginIndex.js));

  const modeTable = Object.create(null);
  for (const k in pluginIndex.modes) {
    modeTable[k] = Object.freeze(pluginIndex.modes[k]);
  }
  Object.freeze(modeTable);

  exports.loadCSS = function () {
    Array.prototype.forEach.call(pluginIndex.css, cssUrl => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = String(cssUrl);
      document.querySelector('head').appendChild(link);
    });
  };

  exports.getJSModuleIds = function () {
    return moduleIds;
  };

  exports.getModeTable = function () {
    return modeTable;
  };

  return Object.freeze(exports);
});
