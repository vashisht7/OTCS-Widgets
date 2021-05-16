/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
  'csui/lib/jquery.mockjax', 'json!./showcolinform.data.json'
], function (require, _, $, parseParam, mockjax, mockjson) {
    'use strict';

  var mocks          = [];
  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pickers/otconws_customcolumn?config_id=wnf_att_w81_2',
        responseText: mockjson.response_customcolumn_name
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pickers/otconws_customcolumn?object_id=208963',
        responseText: mockjson.response_customcolumn_name
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pickers/otconws_customcolumn?config_id=wnf_att_w81_3',
        responseText: mockjson.response_customcolumn_country
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pickers/otconws_customcolumn?object_id=209623',
        responseText: mockjson.response_customcolumn_country
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pickers/otconws_customcolumn?config_id=wnf_att_w81_4',
        responseText: mockjson.response_customcolumn_area
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/pickers/otconws_customcolumn?object_id=209293',
        responseText: mockjson.response_customcolumn_area
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/208963/ancestors',
        responseText: mockjson.response_ancestors_name
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/209623/ancestors',
        responseText: mockjson.response_ancestors_country
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/209293/ancestors',
        responseText: mockjson.response_ancestors_area
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/208963\\?.*'),
        responseText: mockjson.response_node_name
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/209623\\?.*'),
        responseText: mockjson.response_node_country
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/209293\\?.*'),
        responseText: mockjson.response_node_area
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/901',
        responseText: mockjson.response_volumes_facets
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/209403/ancestors',
        responseText: mockjson.response_ancestors_contractcolumns
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/209403\\?.*'),
        responseText: mockjson.response_node_contractcolumns
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/209403/nodes\\?.*'),
        responseText: mockjson.response_nodes_contractcolumns
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/3092/ancestors',
        responseText: mockjson.response_ancestors_facetsvolume
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/3092\\?.*'),
        responseText: mockjson.response_node_facetsvolume
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/3092/nodes\\?.*'),
        responseText: mockjson.response_nodes_facetsvolume
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
