/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module'],
  function (module) {
  "use strict";

  var _accessibleMode = module.config().enabled || false;
  var _accessibleTable = module.config().accessibleTable || false;
  var Accessibility = {
    isAccessibleMode: function () {
      return _accessibleMode;
    },
    isAccessibleTable: function() {
      return _accessibleMode || _accessibleTable;
    }
  };

  return Accessibility;

});