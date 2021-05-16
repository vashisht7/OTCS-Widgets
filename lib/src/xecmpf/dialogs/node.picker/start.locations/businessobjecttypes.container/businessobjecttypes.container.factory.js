/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/node.base.factory'
], function (_, $, NodeBaseFactory) {
  "use strict";
  var BusinessObjectTypesContainerFactory = NodeBaseFactory.extend({
    constructor: function BusinessWorkspaceVolumeFactory(options) {
      options = _.defaults({
        node: {
          type: 888
        }
      }, options);
      NodeBaseFactory.prototype.constructor.call(this, options);
    },
    updateLocationModel: function (model) {
      model.set({
        invalid: true
      });
      return $.Deferred().resolve().promise();
    }
  });
  return BusinessObjectTypesContainerFactory;
});

