/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



var fs = require('fs'),
    path = require('path');

var
    csuiPath = path.join(__dirname, '../csui'),
    csuiComponent = require(path.join(csuiPath, '/component')),
    bundlePrefix = 'xecmpf',
    bundleNames = ['xecmpf-core','xecmpf-app'],
    bundlePath = path.join(__dirname, 'bundles');

module.exports = {

  getAllModules: function () {
    return csuiComponent.getAllComponentModules(bundleNames, bundlePath, bundlePrefix);
  }

};
