/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'csui/models/node.children2/node.children2', 'csui/utils/commands',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang'
], function (_, $, LocationBaseFactory, NodeChildren2Collection, commands, lang) {
  "use strict";

  var CurrentLocationFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      var container = this.options.container;
      model.set({
        name: lang.labelCurrentLocation,
        icon: 'location',
        invalid: !(container && container.isFetchable())
      });
      return ensureNodeID(container, model);
    },

    getLocationParameters: function () {
      var container = this.options.container;
      var children = new NodeChildren2Collection(undefined, {
        node: this.options.container,
        autoreset: true,
        expand: {
          properties: ['original_id', 'parent_id']
        },
        fields: {
          properties: []
        },
        commands: 'default,open'
      });
      container.set('unselectable', false);
      return {
        container: container,
        collection: children,
        locationName: lang.labelCurrentLocation
      };
    }
  });

  function ensureNodeID (node, startLocation) {
    var deferred  = $.Deferred();
    if (node && node.isFetchable() && !node.isFetchableDirectly()) {
      node.fetch()
          .then(function () {
            deferred.resolve();
          }, function () {
            startLocation.set({ invalid: true });
            startLocation.collection.remove(startLocation);
            deferred.reject();
          });
    } else {
      deferred.resolve();
    }
    return deferred.promise();
  }

  return CurrentLocationFactory;
});
