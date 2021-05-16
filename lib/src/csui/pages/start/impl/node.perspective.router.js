/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery',
  'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/next.node', 'csui/models/node/node.model',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (module, $, _, PerspectiveRouter, NextNodeModelFactory, NodeModel, publicLang, lang) {
  'use strict';

  var NodePerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'nodes/:id': 'openNodePerspective',
      'nodes/:id(?*query_string)': 'openNodePerspective'
    },

    name: 'Node',

    constructor: function NodePerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.nextNode = this.context.getModel(NextNodeModelFactory);

      this.listenTo(this.nextNode, 'change:id', this._updateNodeUrl);
      this.listenTo(this.nextNode, 'change:id', this._updatePageTitle);
      this.listenTo(this.nextNode, 'change:name', this._updatePageTitle);
    },

    openNodePerspective: function (id, query_string) {

      if (NodeModel.usesIntegerId) {
        id = parseInt(id);
      }

      var setId = id && id !== this.nextNode.get('id');
      if (!this.restoring) {
        this.initViewStateFromUrlParams(query_string, setId);
      }

      this.activate(false);

      var context = this.context,
          viewStateModel = context.viewStateModel;

      if (setId) {
        this.nextNode.get('id') && viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.navigation);
        this.nextNode.set('id', id);
      }
      setTimeout(function () {
        if (setId) {
          if (viewStateModel && viewStateModel.get('state') &&
              viewStateModel.get('state').filter) {
            viewStateModel.trigger('change:state');
          }
        }
      }, 1000);

    },

    onOtherRoute: function (/*thisRouter, activeRouter*/) {
      this.nextNode.clear({silent: true});
    },

    isViewStateModelSupported: function () {
      return true;
    },

    onViewStateChanged: function () {
      if (this.nextNode.get('id')) {
        this._updateNodeUrl();
      }
    },

    restore: function (routerInfo) {
      this.openNodePerspective(routerInfo.sessionState.id, routerInfo.state);
    },

    _updateNodeUrl: function () {
      var nextNode   = this.nextNode,
          nextNodeId = nextNode.get('id'),
          uri        = 'nodes/' + encodeURIComponent(nextNodeId);

      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }

      this.navigate(uri);

    },

    initSessionViewState: function () {
      this._updateSessionState();
    },

    _updateSessionState: function () {
      var nextNode       = this.nextNode,
          nextNodeId     = nextNode && nextNode.get('id'),
          viewStateModel = this.context && this.context.viewStateModel;
      if (viewStateModel && nextNodeId) {
        var newSessionState = {};
        _.extend(newSessionState, viewStateModel.get(viewStateModel.CONSTANTS.SESSION_STATE));
        _.extend(newSessionState, {id: nextNodeId});
        viewStateModel.unset(viewStateModel.CONSTANTS.SESSION_STATE, {silent: true});
        viewStateModel.set(viewStateModel.CONSTANTS.SESSION_STATE, newSessionState);
      }
    },

    _updatePageTitle: function () {
      if (!this.nextNode.has('name')) {
        document.title = _.str.sformat(lang.NodeLoadingTitle, this.nextNode.get('id'));
      } else {
        document.title =  _.str.sformat(publicLang.NodeTitle, this.nextNode.get('name'), this.nextNode.get('type_name'), publicLang.ProductName);
      }
    }
  });

  return NodePerspectiveRouter;
});
