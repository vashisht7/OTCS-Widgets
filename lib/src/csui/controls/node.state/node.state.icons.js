/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/controls/table/cells/node.state/node.state.icons',
  'csui-ext!csui/controls/node.state/node.state.icons'
], function (_, Backbone, oldNodeStateIcons, extraNodeStateIcons) {
  'use strict';

  var NodeStateIconModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      iconView: null,
      iconViewOptions: null
    },

    constructor: function NodeStateIconModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var NodeStateIconCollection = Backbone.Collection.extend({

    model: NodeStateIconModel,
    comparator: 'sequence',

    constructor: function NodeStateIconCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var nodeStateIcons = new NodeStateIconCollection();

  addExtensions(oldNodeStateIcons);
  addExtensions(extraNodeStateIcons);

  function addExtensions(extensions) {
    if (extensions) {
      var stateIconsToAdd = _.flatten(extensions, true);
      nodeStateIcons.add(stateIconsToAdd);
    }
  }

  return nodeStateIcons;

});
