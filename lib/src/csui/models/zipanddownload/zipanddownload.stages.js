/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin'
], function (_, $, Backbone, URL, ConnectableMixin) {
  'use strict';

  var StagesModel = Backbone.Model.extend({
    constructor: function StageModel(attributes, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeConnectable(options);
    },

    url: function () {
      var url = this.options.connector.getConnectionUrl().getApiBase('v2');
      return URL.combine(url, 'zipanddownload', this.get('id'));
    },

    parse: function (response) {
      this.updateLocation(response.results.data.jobs);
      return response.results.data.jobs;
    },

    updateLocation: function (jobs) {
      if (jobs.complete && jobs.unprocessed_items_list && jobs.unprocessed_items_list.length > 0) {
        _.each(jobs.unprocessed_items_list, function (model, value) {
          if (model.path) {
            var locations = model.path.split('\\');
            if (locations.length > 0 && locations[locations.length - 1] !== "") {
              model.parentLocation = locations[locations.length - 1];
            } else if (locations.length > 0) {
              model.parentLocation = locations[locations.length - 2];
            }
          }
        });
      }
    }
  });
  ConnectableMixin.mixin(StagesModel.prototype);
  return StagesModel;
});