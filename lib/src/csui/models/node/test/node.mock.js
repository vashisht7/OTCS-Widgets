/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  var mocks = [];

  return {
    enable: function () {
      var enterpriseVolume = {
        "id": 2000,
        "name": "Enterprise",
        "type": 141
      };

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2000(?:\\?(.*))?$'),
        responseText: enterpriseVolume
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/141(?:\\?(.*))?$'),
        responseText: enterpriseVolume
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1|v2/nodes/2001(?:\\?(.*))?$'),
        responseText: {
          data: {
            "id": 2001,
            "name": "Test",
            "type": 144
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2002(?:\\?(.*))?$'),
        responseText: {
          data: {
            "id": 2002,
            "name": "Test",
            "type": 1,
            "original_id": {
              "id": 2001,
              "name": "Test",
              "type": 144,
              "commands": {
                "download": {}
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2003(?:\\?(.*))?$'),
        responseText: {
          data: {
            "id": 2003,
            "name": "Test",
            "type": 1,
            "original_id": {
              "id": 2001,
              "name": "Test",
              "type": 144
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2004(?:\\?(.*))?$'),
        responseText: {
          data: {
            "id": 2004,
            "name": "Test",
            "type": 0,
            "parent_id": {
              "id": 2000,
              "name": "Test",
              "type": 141,
              "commands": {
                "properties": {}
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2005(?:\\?(.*))?$'),
        responseText: {
          data: {
            "id": 2005,
            "name": "Test",
            "type": 0,
            "parent_id": {
              "id": 2000,
              "name": "Test",
              "type": 141
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2006(?:\\?(.*))?$'),
        responseText: {
          data: {
            "id": 2006,
            "name": "Test",
            "type": 0,
            "parent_id": {
              "id": 2000,
              "name": "Test",
              "type": 141
            },
            "original_id": {
              "id": 2001,
              "name": "Test",
              "type": 144
            },
            "volume_id": -2000
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2007(?:\\?(.*))?$'),
        responseText: {
          results: {
            actions: {
              data: {
                properties: { custom: 'test' }
              },
              map: {},
              order: {}
            },
            data: {
              "id": 2007,
              "name": "Test",
              "type": 0
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        data: function (data) {
          var body = JSON.parse(data.body);
          return (body.reference_id === 2007 && body.ids[0] === 2007 && body.actions[0] === 'delete')
            || (body.ids[0] === 2008 || body.actions[0] === 'properties')
           ;
        },
        response: function (settings) {
          var body = JSON.parse(settings.data.body);
          var id = body.ids[0];
          var data = body.actions.reduce(function (result, signature) {
            result[signature] = { custom: 'test' };
            return result;
          }, {});
          var results = {};
          results[id.toString()] = {
            data: data,
            map: {},
            order: {}
          };
          this.responseText = {
            results: results
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2008(?:\\?(.*))?$'),
        urlParams: ['query'],
        response: function (settings) {
          this.responseText = {
            results: {
              data: {
                "id": 2008,
                "name": "Test",
                "type": 0,
                "query": settings.urlParams.query,
              }
            }
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/test(?:\\?(.*))?$'),
        responseText: {
          id: 'test',
          name: 'Test'
        }
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
