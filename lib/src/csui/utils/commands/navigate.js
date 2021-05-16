/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'csui/utils/commandhelper', 'csui/models/command',
  'csui/models/node/node.model', 'csui/utils/node.links/node.links'
], function (module, _, $, base, CommandHelper, CommandModel, NodeModel,
    nodeLinks) {
  'use strict';

  var config = _.extend({
    openInNewTab: true
  }, module.config());

  var NavigateCommand = CommandModel.extend({

    defaults: {
      signature: 'Navigate'
    },
    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 140;
    },

    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      return this._navigateTo(node, options);
    },

    _navigateTo: function (node, options) {
      var url = node.get('url'),
          promise = $.Deferred(),
          content;

      function finish() {
        content || (content = window);
        content.location.href = nodeLinks.completeUrl(node, url);
        content.focus();
        promise.resolve();
      }

      if (config.openInNewTab) {
        content = window.open('', '_blank');
      }
      if (url) {
        finish();
      } else {
        node = new NodeModel({id: node.get('id')}, {
          connector: node.connector,
          fields: {
            properties: ['url']
          }
        });
        node.fetch()
            .done(function () {
              url = node.get('url');
              if (url) {
                finish();
              } else if (content) {
                content.close();
              }
            })
            .fail(function (request) {
              if (content) {
                content.close();
              }
              promise.reject(new base.Error(request));
            });
      }
      return promise.promise();
    }

  });

  return NavigateCommand;
});
