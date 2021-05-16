/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui/utils/routing',
  'csui-ext!csui/utils/node.links/node.links'
], function (_, Backbone, Url, RulesMatchingMixin, routing, rules) {
  'use strict';

  var routesWithSlashes = routing.routesWithSlashes();

  var NodeLinkModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      url: null
    },

    constructor: function NodeLinkModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(NodeLinkModel.prototype);

  var NodeLinkCollection = Backbone.Collection.extend({
    model: NodeLinkModel,
    comparator: 'sequence',

    constructor: function NodeLinkCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    getUrl: function (node, options) {
      var type = node.get('type');
      if (type === 1 && node.original && node.original.get('id') > 0) {
        node = node.original;
      }
      var rule = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (rule) {
        var url = rule.get('getUrl')(node, options);
        return this.completeUrl(node, url, options);
      }
    },

    completeUrl: function (node, url, options) {
      if (!url) {
        return location.href;
      }

      var connector = node.connector || options && options.connector;
      var serverUrl = new Url(connector && connector.connection.url ||
                              location.href);
      var absoluteUrl = serverUrl.makeAbsoluteUrl(url, this._getApplicationUrlPrefix(serverUrl));      
      var context = options && options.context,
          viewStateModel = context && context.viewStateModel,
          currentRouter = viewStateModel && viewStateModel.get('activeRouterInstance'),
          urlParams = currentRouter && currentRouter.buildUrlParams();
      if (urlParams) {
        absoluteUrl += '?' + urlParams;
      }
      return absoluteUrl;
    },

    _getApplicationUrlPrefix: function (serverUrl) {
      var applicationUrlPrefix;
      if (routesWithSlashes) {
        applicationUrlPrefix = Url.combine(serverUrl.getCgiScript(), '/app/');
      } else {
        applicationUrlPrefix = location.origin + location.pathname +
                               location.search + '#';
      }
      return applicationUrlPrefix;
    }
  });

  var nodeLinks = new NodeLinkCollection();

  if (rules) {
    nodeLinks.add(_.flatten(rules, true));
  }

  return nodeLinks;
});
