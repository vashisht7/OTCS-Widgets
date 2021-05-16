/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
  'csui/lib/jquery.mockjax', 'json!./showinform.data.json'
], function (require, _, $, parseParam, mockjax, mockjson) {
    'use strict';

  var mocks          = [];
  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/businessworkspacetypes',
        responseText: mockjson.response_businessworkspacetypes
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    },

    columns: mockjson.columns,
    tableColumns: mockjson.tableColumns

  };

});
