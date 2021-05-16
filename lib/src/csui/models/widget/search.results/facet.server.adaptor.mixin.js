/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/node.facets/facet.query.mixin'
], function (_, Url, FacetQueryMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      FacetQueryMixin.mixin(prototype);
      var originalSync = prototype.sync;

      return _.extend(prototype, {
        filterQueryParameterName: 'filter',

        makeServerAdaptor: function (options) {
          return this.makeFacetQuery(options);
        },

        cacheId: '',

        url: function () {
          var url = this.connector.getConnectionUrl().getApiBase('v2');
          return Url.combine(url, 'search');
        },

        sync: function (method, model, options) {
          var query = this.options.query.toJSON();
          if (!!this.options.query.resetDefaults) {
            this.orderBy = "";
            this.skipCount = 0;
            this.options.query.resetDefaults = false;
          } else {
            this.orderBy = ((this.orderBy) &&
                            (this.previousQuery !== this.options.query.attributes.where)) ? "" :
                           this.orderBy;
            this.skipCount = (this.previousOrderBy !== this.orderBy) ? 0 : this.skipCount;
            this.topCount = this.options.topCount ? this.options.topCount : 10;
          }

          _.extend(query, this.getFilterParam(this.filters)); // returns an object with facets array
          _.extend(query, this.getBrowsableParams()); // returns object containing browsable_params
          query.options = '{\'facets\'}';
          if ((!!this.orderBy || !!this.pagination) && !!this.cacheId) {
            query.cache_id = this.cacheId;
            this.pagination = false; // reset pagination to default.
          }

          _.extend(options, {
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: query,
            traditional: true
          });
          return originalSync.apply(this, arguments);
        },

        parse: function (response, options) {
          response.results = response.featured ? response.featured.concat(response.results) :
                             response.results;
          this.parseBrowsedState(response.collection, options);
          this._parseFacets(response.collection.searching.facets);
          response.results.sorting = response.collection.sorting;
          this.cacheId = (!!response.collection && !!response.collection.searching &&
                          !!response.collection.searching.cache_id) ?
                         response.collection.searching.cache_id : "";
          return this.parseBrowsedItems(response, options);
        },

        _parseFacets: function (facets) {
          var topics;
          if (facets) {
            topics = convertFacets(facets.selected, true)
                .concat(convertFacets(facets.available, false));
          }
          this.reset(topics);
        }
      });
    }
  };

  function convertFacets(facets, selected) {
    return _.map(facets, function (facet) {
      var topics = _.map(facet.facet_items, function (topic) {
        return {
          name: topic.display_name,
          total: topic.count,
          value: topic.value,
          selected: selected
        };
      });
      return {
        id: facet.name,
        name: facet.display_name,
        type: facet.type,
        topics: topics,
        items_to_show: 5
      };
    });
  }

  return ServerAdaptorMixin;
});
  
