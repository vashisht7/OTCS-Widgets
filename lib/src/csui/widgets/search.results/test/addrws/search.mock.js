/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
  'csui/lib/jquery.mockjax', 'json!./search.data.json'
], function (require, _, $, parseParam, mockjax, mockjson) {
    'use strict';

  var mocks          = [];
  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2513449\\?.*&actions=add-relitem-test'),
        responseText: mockjson.node1response
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditemspicklist\\?.*&limit=10&page=1&sort=asc_name&.*&where_rel_type=child&metadata'),
        responseText: mockjson.page1response
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order",
        responseText: mockjson.favorites1response
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites\\?(.*)?$'),
        responseText: mockjson.favorites2response
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditemspicklist\\?.*&limit=10&page=5&.*'),
        responseText: mockjson.page5response
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditemspicklist\\?.*&limit=10&page=1&sort=asc_name&.*&where_rel_type=child&where_wnf_att_yw39_7=contains_DE&metadata'),
        responseText: mockjson.searchDEresponse
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditemspicklist\\?.*&limit=10&page=1&sort=asc_wnf_att_yw39_6&.*&where_rel_type=child&where_wnf_att_yw39_7=contains_DE&metadata'),
        responseText: mockjson.searchDEASCresponse
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditemspicklist\\?.*&limit=10&page=1&sort=desc_wnf_att_yw39_6&.*&where_rel_type=child&where_wnf_att_yw39_7=contains_DE&metadata'),
        responseText: mockjson.searchDEDESCresponse
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/businessworkspaces/2513449/relateditemspicklist\\?.*&limit=10&page=1&sort=desc_wnf_att_yw39_6&.*&where_rel_type=child&metadata'),
        responseText: mockjson.searchDEDESCresponse
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
