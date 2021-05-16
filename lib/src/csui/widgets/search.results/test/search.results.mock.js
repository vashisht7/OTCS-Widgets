/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
  'csui/lib/jquery.mockjax', 'json!./mockedData.json'
], function (require, _, $, parseParam, mockjax, mockData) {
  'use strict';

  function getData(page, limit) {
    var response = {}, sortedRelevanceData = mockData.searchData.byRelavance;
    response.collection = sortedRelevanceData.collection;
    response.links = sortedRelevanceData.links;
    if (limit > 10) {
      response.results = sortedRelevanceData.resultspage1.concat(sortedRelevanceData.resultspage2);
      response.results = response.results.concat(sortedRelevanceData.resultspage3);
    } else {
      if (page == '1') {
        response.results = sortedRelevanceData.resultspage1;
      } else if (page == '2') {
        response.results = sortedRelevanceData.resultspage2;
      } else {
        response.results = sortedRelevanceData.resultspage3;
      }
    }
    return response;
  }

  function sortByDate(page, limit) {
    var response = {}, sortedDateData = mockData.searchData.byDate;
    response.collection = sortedDateData.collection;
    response.links = sortedDateData.links;
    if (limit > 10) {
      response.results = sortedDateData.resultspage1.concat(sortedDateData.resultspage2);
      response.results = response.results.concat(sortedDateData.resultspage3);
    } else {
      if (page == '1') {
        response.results = sortedDateData.resultspage1;
      } else if (page == '2') {
        response.results = sortedDateData.resultspage2;
      } else {
        response.results = sortedDateData.resultspage3;
      }
    }
    return response;
  }

  var mocks = [];
  return {

    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/ancestors'),
        responseText: {
          "ancestors": [{
            "name": "Enterprise Workspace",
            "volume_id": -2000,
            "parent_id": -1,
            "type": 141,
            "id": 2000,
            "type_name": "Enterprise Workspace"
          }]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/searchbar?enterprise_slices=true',
        responseTime: 0,
        responseText: mockData.searchbar
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/search'),
        type: 'POST',
        response: function (settings) {
          var parameters = settings.data;
          if (parameters.where === 'sample') {
            this.responseText = mockData.promotedData;
          } else if (parameters.where === 'version') {
            this.responseText = mockData.versionData;
          } else if (parameters.sort === 'desc_OTObjectDate') {
            this.responseText = sortByDate(parameters.page, parameters.limit);
          } else if (parameters.page == "1" || parameters.page == "2" || parameters.page ==
                     "3") {
            this.responseText = getData(parameters.page, parameters.limit);
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth'),
        responseText: mockData.auth

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
        response: function () {
          this.responseText = {results: []};
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(\\?.*)?'),
        responseText: {
          "links": mockData.actionsdata.links,
          "results": mockData.actionsdata.results
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/update?id=27729007',
        responseText: {
          "forms": [
            {
              "data": mockData.metadata.forms[0].data,
              "options": mockData.metadata.forms[0].options
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=27729007',
        responseText: {
          "forms": [
            {
              "data": mockData.metadata.forms[0].data,
              "options": mockData.metadata.forms[0].options,
              "schema": mockData.metadata.forms[0].schema
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/27729007',
        responseText: mockData.metadata.rename.data
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members/1000',
        responseText: mockData.searchData.byRelavance.resultspage1[0].data
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs',
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/27729007?fields=properties%7Bcontainer%2C%20name%2C%20type%2C%20versions_control_advanced%2C%20permissions_model%7D&fields=permissions%7Bright_id%2C%20permissions%2C%20type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D',
        responseText: {
          "links": mockData.permissionData.links,
          "results": mockData.permissionData.results
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/27729007/descendents/subtypes/([^\/]+)'),
        responseText: {
          "links": mockData.permissionData.subtypes.links,
          "results": mockData.permissionData.subtypes.results
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)(?:\\?(.*))?$'),
        responseText: {
          "links": mockData.searchData.byRelavance.links,
          "results": mockData.searchData.byRelavance.resultspage1
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/search/template/settings/display',
        responseTime: 0,
        responseText: mockData.search_template
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/serverInfo',
        responseTime: 0,
        responseText: mockData.serverInfo
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
