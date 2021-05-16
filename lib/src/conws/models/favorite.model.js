/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  'csui/utils/url',
], function (module, $, _, Backbone, Url) {
  "use strict";

  var Favorite = Backbone.Model.extend({

    constructor: function Favorite(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      options.connector.assignTo(this);


      var nodeid = options.node.get('id');
      if (nodeid) {
        this.set('id',nodeid);
        this.set('selected',options.node.get('favorite'));
      }
      this.listenTo(options.node,'change:id',function(){
        this.set('id',options.node.get('id'));
      })
    },

    url: function () {
      var nodeId = this.get('id'),
          url = this.connector.connection.url.replace('/v1', '/v2');
      url = Url.combine(url, 'members', 'favorites', nodeId);
      return url;
    },

    isNew: function () {
      return this.get('selected'); // this.attributes.selected
    },

    add: function () {
      this.set('selected', true);
      return this.save();
    },

    remove: function () {
      this.set('selected', false);
      return this.destroy();
    }
  });

  return Favorite;
});