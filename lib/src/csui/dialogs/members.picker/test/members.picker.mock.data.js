/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax', 'json!./mock-data.json'
], function (require, _, $, mockjax, mockData) {

  return {
    enable: function () {
      mockjax({
        url: '//server/otcs/cs',
        responseText: {}
      });
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members(?:\\?(.*))$'),
        type: 'GET',
        responseText: mockData.result1
      });
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/memberof(?:\\?(.*))$'),
        type: 'GET',
        responseText: mockData.result2
      });
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/2001/members(?:\\?(.*))$'),
        type: 'GET',
        responseText: mockData.result3
      });
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/999/members(?:\\?(.*))$'),
        type: 'GET',
        responseText: mockData.result4
      });
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/1001/members(?:\\?(.*))$'),
        type: 'GET',
        responseText: mockData.result5
      });
    },

    disable: function () {
      mockjax.clear();
    }
  };
});