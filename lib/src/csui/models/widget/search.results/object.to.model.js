/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone"
], function ($, _, Backbone) {
  "use strict";

  var RegionsModel = Backbone.Model.extend({
    constructor: function RegionsModel() {
      Backbone.Model.apply(this, arguments);
    }
  });

  var RegionsModelCollection = Backbone.Collection.extend({
    model: RegionsModel,

    constructor: function RegionsModelCollection() {
      Backbone.Collection.apply(this, arguments);
    },

    isFetchable: false
  });

  var displayRegions = ['available', 'selected'];

  var toModel = function (model) {
    _.each(model, function(item) {
      if (_.isObject(item)) {
        displayRegions.map(function(region) {
          if (item[region]) {
            if (_.isArray(item[region])) {
              item[region] = new RegionsModelCollection(item[region]);
            }
          }
        });
      }
    });
    return model;
  };

  return toModel;
});