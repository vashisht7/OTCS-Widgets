/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./results734591.json',
  'json!./results734591asc.json', 'json!./results734591desc.json',
  'json!./results208875v2nodes.json', 'json!./resultsV2Actions.json', 'json!./resultsV1Forms.json'
], function ($, _, mockjax, parseParam, results734591, results734591asc, results734591desc,
             results208875v2nodes, resultsV2Actions, resultsV1Forms) {
  'use strict';
  return {

    enable: function () {
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
      });

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/183718(?:\\?(.*))?$'),
        response: function () {
          this.responseText = results734591;
        }
      });

      mockjax({
        name: 'controls/table/test/table.mock.nodes.actions',
        url: new RegExp('//server/otcs/cs/api/v2/nodes/actions(?:\\?(.+))?$'),
        urlParams: ['query'],
        response: function (settings) {
          var query = settings.urlParams.query || '';
          var parameters = _.reduce(query.split('&'), function (result, parameter) {
            var parts = parameter.split(/=(.+)/, 2),
              name  = parts[0].toLowerCase(),
              value = parts[1];
            result[name] = value && decodeURIComponent(value) || value;
            return result;
          }, {});
          this.responseText = resultsV2Actions;
        }
      });

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/183718/nodes(?:\\?(.+))?$'),
        urlParams: ['query'],
        response: function (settings) {
          var query      = settings.urlParams.query || '',
            parameters = _.reduce(query.split('&'), function (result, parameter) {
              var parts = parameter.split(/=(.+)/, 2),
                name  = parts[0].toLowerCase(),
                value = parts[1];
              result[name] = value && decodeURIComponent(value) || value;
              return result;
            }, {});
          if (parameters.sort === "asc_name") {
            this.responseText = results734591asc;
          } else {
            this.responseText = results734591desc;
          }
        }
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
