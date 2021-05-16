/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2000(\\?.*)?$'),
        responseText: {
          "data": {
            "id": 2000,
            "name": "Enterprise",
            "container": true
          },
          "perspective": {
            "node": 2000
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/app/container/2000(\\?.*)?$'),
        responseText: {
          "collection": {},
          "links": {},
          "results": {
            "add_menu": [{}],
            "ancestors": [{}],
            "contents": [{}]
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
