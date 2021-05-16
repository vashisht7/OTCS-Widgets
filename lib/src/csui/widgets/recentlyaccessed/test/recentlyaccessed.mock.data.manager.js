/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
  'csui/lib/jquery.mockjax'
], function (_, $, parseParam, mockjax) {

  var DataManager       = function DataManager() {},
      test0Mocks        = [],
      test1Mocks        = [],
      test100Mocks      = [],
      testMockDataMocks = [];

  DataManager.url = '//server/otcs/cs/api/v2/members/accessed*';

  DataManager.test0 = {

    enable: function () {
      test0Mocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: {
          "results": []
        }
      }));
      test0Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs*',
        responseTime: 0,
        responseText: {
          "results": [
            {"data": {"name": "first", "order": 1, "tab_id": 1}},
            {"data": {"name": "second", "order": 2, "tab_id": 2}},
            {"data": {"name": "third", "order": 3, "tab_id": 3}}
          ]
        }
      }));
      test0Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites?*', responseTime: 0,
        responseText: [
          {id: '21', name: 'Customers', perspective: 'browse'},
          {id: '22', name: 'Orders', perspective: 'browse'},
          {id: '23', name: 'Vendors', perspective: 'browse'}
        ]
      }));
      test0Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        data: function (data) {
          return JSON.parse(data.body).ids[0] === 1;
        },
        responseTime: 10,
        responseText: {
          "results": {
            '1': {
              data: {
                'delete': {}
              },
              map: {},
              order: {}
            }
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test0Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test1 = {

    enable: function () {
      test1Mocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: DataManager._createElements(1, 1, 'Name')
      }));
      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/tabs.*'),
        responseTime: 0,
        responseText: {
          "results": [
            {"data": {"name": "first", "order": 1, "tab_id": 1}},
            {"data": {"name": "second", "order": 2, "tab_id": 2}},
            {"data": {"name": "third", "order": 3, "tab_id": 3}}
          ]
        }
      }));
      test1Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites?*', responseTime: 0,
        responseText: [
          {id: '21', name: 'Customers', perspective: 'browse'},
          {id: '22', name: 'Orders', perspective: 'browse'},
          {id: '23', name: 'Vendors', perspective: 'browse'}
        ]
      }));
      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        data: function (data) {
          return JSON.parse(data.body).ids[0] === 1;
        },
        responseTime: 10,
        responseText: {
          "results": {
            '1': {
              data: {
                'delete': {}
              },
              map: {},
              order: {}
            }
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test1Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test100 = {

    enable: function () {
      test100Mocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: DataManager._createElements(21, 120, 'Name')
      }));
      test100Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites?*', responseTime: 0,
        responseText: [
          {id: '21', name: 'Customers', perspective: 'browse'},
          {id: '22', name: 'Orders', perspective: 'browse'},
          {id: '23', name: 'Vendors', perspective: 'browse'}
        ]
      }));
      test100Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/tabs.*'),
        responseTime: 0,
        responseText: {
          "results": [
            {"data": {"name": "first", "order": 1, "tab_id": 1}},
            {"data": {"name": "second", "order": 2, "tab_id": 2}},
            {"data": {"name": "third", "order": 3, "tab_id": 3}}
          ]
        }
      }));
      test100Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        data: function (data) {
          return JSON.parse(data.body).ids[0] === 1;
        },
        responseTime: 10,
        responseText: {
          "results": {
            '1': {
              data: {
                'delete': {}
              },
              map: {},
              order: {}
            }
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test100Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.mockData = {

    enable: function (idFrom, idTo, name) {
      testMockDataMocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: DataManager._createElements(idFrom, idTo, name)
      }));
      testMockDataMocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/tabs.*'),
        responseTime: 0,
        responseText: {
          "results": [
            {"data": {"name": "first", "order": 1, "tab_id": 1}},
            {"data": {"name": "second", "order": 2, "tab_id": 2}},
            {"data": {"name": "third", "order": 3, "tab_id": 3}}
          ]
        }
      }));
      testMockDataMocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites?*',
        responseTime: 0,
        responseText: [
          {id: '21', name: 'Customers', perspective: 'browse'},
          {id: '22', name: 'Orders', perspective: 'browse'},
          {id: '23', name: 'Vendors', perspective: 'browse'}
        ]
      }));
      testMockDataMocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
        responseTime: 0,
        responseText:{
          "results": [
            {"data": {"name": "first", "order": 1, "tab_id": 17966}},
            {"data": {"name": "second", "order": 2, "tab_id": 17967}},
            {"data": {"name": "third", "order": 3, "tab_id": 17968}}
          ]
        }
      }));
      testMockDataMocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        response: function (settings) {
          var body = JSON.parse(settings.data.body);
          this.responseText = {
            results: _.reduce(body.ids, function (results, id) {
              results[id] = {
                data: {
                  'delete': {}
                },
                map: {},
                order: {}
              };
              return results;
            }, {})
          };
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = testMockDataMocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager._createElements = function (idFrom, idTo, name) {

    var Element = function Element(id, name) {
      _.extend(this, {
        "data": {
          "properties": {
            "create_date": "2014-07-10T14:12:31",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {
              "en": "",
              "fr": ""
            },

            "modify_date": "2014-10-15T14:54:06",
            "modify_user_id": 1000,
            "name_multilingual": {
              "en": "Document 001",
              "fr": "Document 001"
            },
            "parent_id": -1,
            "type": 144,
            "type_name": "Document"

          }
        },
        "metadata": {
          "properties": {
            "id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "ID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "modify_date",
              "multi_value": false,
              "name": "Modified",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "name",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": true,
              "multi_value": false,
              "name": "Name",
              "password": false,
              "persona": "",
              "read_only": false,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            },
            "type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "type",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Type",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "type_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "type_name",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": false,
              "multi_value": false,
              "name": "Type",
              "password": false,
              "persona": "",
              "read_only": true,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            }
          }
        }

      });
      this.data.properties.id = id;
      this.data.properties.name = name;
    };

    var response = {
      "results": []
    };

    for (var i = idFrom; i <= idTo; i++) {
      response.results.push(new Element(i, name + i));
    }

    return response;
  };

  return DataManager;

});
