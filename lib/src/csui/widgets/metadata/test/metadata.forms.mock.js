/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery.mockjax', 'json!./metadata.forms.data.json'
], function (mockjax, response) {
  'use strict';

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/forms/nodes/(?:\\w+)(?:\\?.*)$'),
        responseText: response
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
