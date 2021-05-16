/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
    'csui/lib/jquery.mockjax', 'json!./relwkspexpchkbox.data.json'
  ], function (require, _, $, parseParam, mockjax, mockjson) {
      'use strict';
  
    var mocks          = [];
    return {
  
      enable: function () {
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/98015\\?.*'),
          responseText: mockjson.wkspResponse
        }));
        mocks.push(mockjax({
          url: "//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order",
          responseText: mockjson.favorites1Response
        }));
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/members/favorites\\?.*'),
          responseText: mockjson.favorites2Response
        }));
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/98015/relateditems\\?.*&limit=30&page=1&sort=asc_name&.*'),
          responseText: mockjson.page1Response
        }));
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/98015/relateditems\\?.*&limit=30&page=2&sort=asc_name&.*'),
          responseText: mockjson.page2Response
        }));
      },
  
      disable: function () {
        var mock;
        while ((mock = mocks.pop()) != null) {
          mockjax.clear(mock);
        }
      },
  
      collectionOptions1: mockjson.collectionOptions1,
      collectionOptions2: mockjson.collectionOptions2,
      expandedViewOptionsData: mockjson.expandedViewOptionsData
  
    };
  
  });
  