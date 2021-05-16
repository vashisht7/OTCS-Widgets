/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax', 'json!./version.settings.mock.data.json'],
    function (mockjax, mockData) {
      var mocks = [], versionsControlAdvanced;
      return {
        enable: function () {
          mocks.push(mockjax({
            url: new RegExp(
                '//server/otcs/cs/api/v2/nodes/20346268'
            ),
            type: 'PUT',
            response: function (settings) {
              var data       = settings.data,
                  jsonString = decodeURIComponent(data);
              jsonString = jsonString.match('{.*}')[0];
              var dataObj = JSON.parse(jsonString);
              if (dataObj.versions_control_advanced == "true") {
                versionsControlAdvanced = true;
                this.responseText = mockData.nodeAdvtrue;
              } else {
                versionsControlAdvanced = false;
                this.responseText = mockData.nodeAdvFalse;
              }
            }
          }));

          mocks.push(mockjax({
            url: new RegExp(
                '//server/otcs/cs/api/v2/nodes/20346268?.*'
            ),
            response: function (settings) {
              if (versionsControlAdvanced) {
                this.responseText = mockData.nodewithproperties;
              } else {
                this.responseText = mockData.nodeWithPropertiesAdvFalse;
              }
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