/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax',
  'json!./test.data.initial.json',
  'json!./test.data.sort.json',
  'json!./test.data.newColumns.json',
  'json!./test.data.lotsOfColumns.json',
  'json!./test.data.negativeValues.json',
  'json!./test.data.smallValues.json',
  'json!./test.data.tinyValues.json',
  'json!./test.data.hugeValues.json',
    'json!./test.data.fileSizes.json',
    'json!./test.data.unformattedValues.json',
    'json!./test.data.noData.json'
], function (mockjax,
             data1,
             data2,
             data3,
             data4,
             data5,
             data6,
             data7,
             data8,
             data9,
             data10,
             data11
) {

  var mocks = [];

  return {

    enable: function () {

      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/auth',
        responseText: {
          "data": {
            "id": 1000,
            "name": "Admin"
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata1',
        responseTime: 500,
        responseText: data1
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata2',
        responseTime: 500,
        responseText: data2
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata3',
        responseTime: 500,
        responseText: data3
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata4',
        responseTime: 500,
        responseText: data4
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata5',
        responseTime: 500,
        responseText: data5
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata6',
        responseTime: 500,
        responseText: data6
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata7',
        responseTime: 500,
        responseText: data7
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/mydata8',
        responseTime: 500,
        responseText: data8
      }));

        mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/mydata9',
            responseTime: 500,
            responseText: data9
        }));

        mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/mydata10',
            responseTime: 500,
            responseText: data10
        }));

        mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/mydata11',
            responseTime: 500,
            responseText: data11
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
