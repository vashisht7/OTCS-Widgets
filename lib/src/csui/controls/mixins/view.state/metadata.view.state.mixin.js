/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/marionette',
          'csui/utils/contexts/factories/metadata.factory'
], function (module, _, Marionette, MetadataModelFactory) {
  'use strict';

  return {

    getViewStateDropdown: function () {
      return this.context && this.context.viewStateModel.getViewState('dropdown');
    },

    getDefaultViewStateDropdown: function () {
      return this.context && this.context.viewStateModel.getDefaultViewState('dropdown');
    },

    setViewStateDropdown: function (value, options) {
      var viewStateModel = this.context && this.context.viewStateModel;
      if (options) {
        if (options.default) {
          viewStateModel.setDefaultViewState('dropdown', value);
        }
        if (options.title) {
          viewStateModel.setViewState('dropdownTitle', options.title);
        }
      }
      return viewStateModel.setViewState('dropdown', value);
    },

    setViewStateId: function (id, options) {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      var metadataInfo = _.clone(metadataModel.get('metadata_info'));
      if (metadataInfo) {
        metadataInfo.id = id;
        metadataInfo.model = options.model;
        metadataModel.set('metadata_info', metadataInfo, options);
      }
    },

    getViewStateId: function (id) {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      var metadataInfo = _.clone(metadataModel.get('metadata_info'));
      if (metadataInfo) {
        return metadataInfo.id;
      }
    },

    isMetadataNavigation: function () {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      if (metadataModel) {
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo) {
          return metadataInfo.navigator;
        }
      }
      return true;
    },

    getThumbnailViewState: function () {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      if (metadataModel) {
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo) {
          return metadataInfo.isThumbnailView;
        }
      }
    },

    getViewStateSelectedProperty: function () {
      var metadataModel = this.context && this.context.getModel(MetadataModelFactory);
      if (metadataModel) {
        var metadataInfo = metadataModel.get('metadata_info');
        if (metadataInfo) {
          return metadataInfo.selectedProperty;
        }
      }
    }

  };

});
