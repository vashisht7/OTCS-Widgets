/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';
  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/searchqueries/2001',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "data": {
                "FullText": {"FullText_value1": "jpg"},
                "SystemAttributes": {"SystemAttributes_value4": ""},
                "templateId": 26160642
              },
              "options": {
                "fields": {
                  "FullText": {
                    "fields": {
                      "FullText_value1": {
                        "label": "Search Terms",
                        "name": "FullText_value1",
                        "order": 1,
                        "type": "text"
                      }
                    }, "order": 100
                  },
                  "SystemAttributes": {
                    "fields": {
                      "SystemAttributes_value4": {
                        "label": "Name",
                        "name": "SystemAttributes_value4",
                        "order": 2,
                        "OTRegionName": "OTName"
                      }
                    }, "order": 300
                  },
                  "templateId": {"type": "hidden"}
                }
              },
              "schema": {
                "description": "",
                "properties": {
                  "FullText": {
                    "properties": {"FullText_value1": {}},
                    "title": "Full Text"
                  },
                  "SystemAttributes": {
                    "properties": {"SystemAttributes_value4": {}},
                    "title": "System Attributes"
                  },
                  "templateId": {}
                },
                "title": "12123123123213",
                "type": "object"
              }
            }
          }
      ));
    },
    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});

