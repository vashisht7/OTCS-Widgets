/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
    'csui/lib/jquery.mockjax', 'json!./relwkspexpview.data.json'
  ], function (require, _, $, parseParam, mockjax, mockjson) {
      'use strict';
  
    var mocks          = [];
    return {
  
      enable: function () {
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449\\?.*'),
          responseText: mockjson.wksp1response
        }));
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditems\\?.*&limit=30&page=1&sort=asc_name&.*'),
          responseText: mockjson.page1response
        }));
        mocks.push(mockjax({
          url: "//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order",
          responseText: mockjson.favorites1response
        }));
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/members/favorites\\?.*'),
          responseText: mockjson.favorites2response
        }));
      },
  
      disable: function () {
        var mock;
        while ((mock = mocks.pop()) != null) {
          mockjax.clear(mock);
        }
      },
  
      collectionOptions1: mockjson.collectionOptions1,
      expandedViewOptionsData1: mockjson.expandedViewOptionsData1,
      addItem1Attributes: mockjson.addItem1Attributes
  
    };
  
  });
  