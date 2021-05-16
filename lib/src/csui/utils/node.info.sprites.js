/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui-ext!csui/utils/node.info.sprites'
], function (_, Backbone, extraNodeInfoSprites) {

  var NodeSpriteModel = Backbone.Model.extend({

    defaults: {
      sequence: 100
    },

    constructor: function NodeSpriteModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var NodeSpriteCollection = Backbone.Collection.extend({

    model: NodeSpriteModel,
    comparator: "sequence",

    constructor: function NodeSpriteCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var nodeSprites = new NodeSpriteCollection();

  if (extraNodeInfoSprites) {
    nodeSprites.add(_.flatten(extraNodeInfoSprites, true));
  }

  return nodeSprites;

});
