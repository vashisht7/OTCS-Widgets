/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery.mockjax'
], function (_, mockjax) {

  var mocks = [];

  var mocked = {
    nodes: [
      {
        id: 2001,
        actions: {
          open: {}
        },
        type: 144
      }
    ]
  } ;

  function getNodeActions(node) {
    return _.chain(mocked.actions[node.type] || [])
      .reduce(function (result, action) {
        result[action] = {};
        return result;
      }, {})
      .value();
  }

  return {

    enable: function () {

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=2001',
        responseText: {
          token: 'dummy'
        }
      }));



      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        response: function (settings) {
          var body = JSON.parse(settings.data.body),
            filteredNodes = _.filter(mocked.nodes, function (node) {
              return _.contains(body.ids, node.id);
            });
          this.responseText = {
            results: _.reduce(filteredNodes, function (results, node) {
              if (node) {
                results[node.id] = {
                  data: node.actions
                };
              }
              return results;
            }, {})
          };
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
