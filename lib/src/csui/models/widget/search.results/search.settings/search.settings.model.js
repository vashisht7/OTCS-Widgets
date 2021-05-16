/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/mixins/connectable/connectable.mixin', 'csui/utils/url',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.results/search.settings/server.adaptor.mixin'
], function ($, _, Backbone, ConnectableMixin, Url, FetchableMixin, ServerAdaptorMixin) {
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

  var SearchSettingsModel = Backbone.Model.extend({
    constructor: function SearchSettingsModel(attributes, options) {
      this.options = options || (options = {});
      Backbone.Model.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeServerAdaptor(options);
    },

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    },

    isNew: function () {
      return false;
    },

    parse: function (response, options) {
      response = response.results && response.results.data;
      var displayRegions = ['available', 'selected'];
      _.each(response && response.display, function (item) {
        if (_.isObject(item)) {
          displayRegions.map(function (region) {
            if (item[region]) {
              if (_.isArray(item[region])) {
                item[region] = new RegionsModelCollection(item[region]);
              }
            }
          });
        }
      });
      return response;
    },

    isFetchable: function () {
      return true;
    },

    getColumnKeys: function () {
      return this.pluck('key');
    }
  });

  ConnectableMixin.mixin(SearchSettingsModel.prototype);
  FetchableMixin.mixin(SearchSettingsModel.prototype);
  ServerAdaptorMixin.mixin(SearchSettingsModel.prototype);

  return SearchSettingsModel;
});