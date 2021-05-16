/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/jquery.mockjax'], function ($, mockjax) {

  var DataManager = function DataManager() {};

  var wsTypeName1 = "Contract Workspace Type",
      wsTypeName2 = "Customer Workspace Type",
      wsTmplName1 = "Contract Workspace",
      wsTmplName2 = "Customer Workspace";

  DataManager.test0 = {

    mocks: [],

    enable: function () {
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/businessworkspacetypes',
        responseTime: 0,
        status: 404,
        responseText: { error: "TableToolBarExtension Test Error." }
      }));
      this.mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseTime: 0,
        responseText: {
          results: []
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = this.mocks.pop())!=null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test1 = {

    mocks: [],
    expectedMenuEntries: [],
    enable: function () {
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1/businessworkspacetypes',
        responseTime: 0,
        responseText: {
          "businessworkspacetypes": []
        }
      }));
      this.mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseTime: 0,
        responseText: {
          results: []
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = this.mocks.pop())!=null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test25980 = {

    mocks: [],
    expectedMenuEntries: [ wsTmplName1, wsTmplName2 ],
    enable: function () {
      this.mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/25980/businessworkspacetypes',
        responseTime: 0,
        responseText: {
          "businessworkspacetypes": [
            {
              "id": 1,
              "name": wsTypeName1,
              "templates": [
                {
                  "id": 25981,
                  "name": wsTmplName1,
                  "subType": 848
                }
              ]
            },
            {
              "id": 2,
              "name": wsTypeName2,
              "templates": [
                {
                  "id": 29725,
                  "name": wsTmplName2,
                  "subType": 848
                }
              ]
            }
          ]
        }
      }));
      this.mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseTime: 0,
        responseText: {
          results: []
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = this.mocks.pop())!=null) {
        mockjax.clear(mock);
      }
    }

  };
  return DataManager;

});

