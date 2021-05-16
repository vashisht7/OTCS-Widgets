/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param',
  'json!./savedqueries.json',
  'json!./savedqueryforms.json',
  'json!./searchresults.json'

], function (_, MockJax, parseParam,
    SavedQueries, SavedQueryForms, SearchResults) {

  var mocks = [];

  return {

    enable: function () {

      mocks.push(MockJax({
        urlParams: ['query'],
        url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/[0-9]+\/nodes(?:(.*))$/,
        responseText: SavedQueries
      }));

      mocks.push(MockJax({
        url: /\/\/server\/otcs\/cs\/api\/v1\/searchqueries\/[0-9]+$/,
        response: function (config) {
          var arr          = config.url.split('/'),
              savedQueryId = arr[arr.length - 1];
          this.responseText = SavedQueryForms[savedQueryId];
        }
      }));

      mocks.push(MockJax({
        url: /\/\/server\/otcs\/cs\/api\/v2\/search(?:(.*))$/,
        responseText: SearchResults
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop())) {
        MockJax.clear(mock);
      }
    }
  };

});
