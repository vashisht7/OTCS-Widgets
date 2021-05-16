/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/133',
        responseText: {
          data: { id: 2004 }
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
