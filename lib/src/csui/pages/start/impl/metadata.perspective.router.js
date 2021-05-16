/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/models/node/node.model',
  'i18n!csui/pages/start/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang'
], function (module, $, _, Backbone, PerspectiveRouter, MetadataFactory, NodeModel, publicLang, lang) {
  'use strict';

  var MetadataPerspectiveRouter = PerspectiveRouter.extend({

    routes: {
      'nodes/:node_id/metadata': 'openMetadata',
      'nodes/:node_id/metadata(?*query_string)': 'openMetadata',
      'nodes/:node_id/metadata/navigator': 'openMetadataNavigator',
      'nodes/:node_id/metadata/navigator(?*query_string)': 'openMetadataNavigator'
    },

    name: "Metadata",

    constructor: function MetadataPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.metadataModel = this.context.getModel(MetadataFactory);

      this.listenTo(this.metadataModel, 'change:metadata_info', this._updateUrl);
      this.listenTo(this.metadataModel, 'change:metadata_info', this._updatePageTitle);
    },

    openMetadata: function (id, query_string) {
      this._open(id, query_string, false);
    },

    openMetadataNavigator: function (id, query_string) {
      this._open(id, query_string, true);
    },

    isViewStateModelSupported: function() {
      return true;
    },

    getInitialViewState: function () {
      var metadata_info = this.metadataModel && this.metadataModel.get('metadata_info');
      if (metadata_info && metadata_info.selectedTab) {
        var selectedTab = metadata_info.selectedTab;
        if (_.isString(selectedTab)) {
          return {dropdown: selectedTab};
        } else if (selectedTab instanceof Backbone.Model) {
          var name = selectedTab.get('name'), title = selectedTab.get('title');
          return {dropdown: name || title};
        }
      }
      return {};
    },

    _open: function (id, query_string, navigator) {

      if (NodeModel.usesIntegerId) {
        id = parseInt(id);
      }

      var metadata_info = this.metadataModel.get('metadata_info');

      var setId = !metadata_info || (id && id !== metadata_info.id);
      this.initViewStateFromUrlParams(query_string, setId);
      this.activate(false);

      if (setId) {
        this.metadataModel.set('metadata_info', {id: id, navigator: navigator});
      }
    },

    onOtherRoute: function () {
      this.metadataModel.clear({silent: true});
      var viewStateModel = this.context.viewStateModel;
      viewStateModel.unset(viewStateModel.CONSTANTS.METADATA_CONTAINER);
      viewStateModel.unset('displayBreadcrumbUpToParentOnly');
    },

    onViewStateChanged:function() {
      var metadata_info = this.metadataModel.get('metadata_info');
      if (metadata_info && metadata_info.id) {
        this._updateUrl();
      }

      var dropdownTitle = this.context.viewStateModel.getViewState("dropdownTitle");
      if (metadata_info && metadata_info.model && dropdownTitle) {
        this._updatePageTitle();
      }
    },

    _updateUrl: function () {

      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }

      var metadata_info = this.metadataModel.get('metadata_info'),
          id = metadata_info.id,
          uri      = 'nodes/' + encodeURIComponent(id) + '/metadata';

      if (metadata_info.navigator) {
        uri += '/navigator';
        this.context.viewStateModel.set('displayBreadcrumbUpToParentOnly', true);
      }
      this.navigate(uri);
    },

    _updatePageTitle: function () {
      var metadata_info = this.metadataModel.get('metadata_info');
      if (metadata_info.model) {
        var modelTitle;

        if (this.context.viewStateModel) {
          modelTitle = this.context.viewStateModel.getViewState("dropdownTitle");
        }

        document.title = (!metadata_info.model.has('name') || !modelTitle) ?
                         _.str.sformat(lang.NodeLoadingTitle, metadata_info.model.get('id')) :
                         _.str.sformat(publicLang.MetadataTitle, modelTitle, metadata_info.model.get('name'), publicLang.ProductName);
      }
    }
  });

  return MetadataPerspectiveRouter;

});
