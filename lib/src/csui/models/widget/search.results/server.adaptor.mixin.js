/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node.facets/facet.query.mixin', 'csui/models/node.columns2'
], function (_, Backbone, Url, FacetQueryMixin, NodeColumn2Collection) {
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
          var queryData  = this.options.query.toJSON(),
              urlOptions = this.options.urlOptions || ["\'highlight_summaries\'"];
          if (this.fetchFacets) {
            urlOptions.push("\'facets\'");
          }
          if (!!this.options.query.resetDefaults) {
            this.orderBy = "";
            this.skipCount = 0;
            this.options.query.resetDefaults = false;
          } else {
            this.orderBy = ((this.orderBy) &&
                            (this.previousQuery !== this.options.query.attributes.where)) ? "" :
                           this.orderBy;
            this.skipCount = (this.previousOrderBy !== this.orderBy) ? 0 : this.skipCount;
          }
          if (this.searchFacets &&
              (!this.searchFacets.filters || this.searchFacets.filters.length === 0)) {
            urlOptions.push("\'featured\'");
          }

          this.searchFacets && _.extend(queryData, this.getFilterParam(this.searchFacets.filters)); // returns an object with facets array
          _.extend(queryData, this.getBrowsableParams()); // returns object containing browsable_params
          _.extend(queryData, this.getStateEnablingUrlQuery()); // returns an object containing state
          _.extend(queryData, this.getResourceFieldsUrlQuery()); // returns an object containing fields array
          _.extend(queryData, this.getRequestedCommandsUrlQuery()); // returns an object containing actions array

          queryData.options = '{' + urlOptions.toString() + '}';
          queryData.expand = 'properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id,parent_id}';
          if ((!!this.orderBy || !!this.pagination) && !!this.cacheId) {
            queryData.cache_id = this.cacheId;
            this.pagination = false; // reset pagination to default.
          }
          _.extend(options, {
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: queryData,
            traditional: true
          });
          this.fetchFacets = options.fetchFacets;
          return originalSync.apply(this, arguments);
        },

        parse: function (response, options) {
          if (response.featured) {
            response.featured = _.filter(response.featured, function (item) {
              return !!item.bestbet || !!item.nickname;
            });
          }
          this.addRegionsToPromotedList(response.featured);
          if (response.collection.searching) {
            var sortedColumns = new NodeColumn2Collection();
            var regionMetadata    = _.clone(response.collection.searching.regions_metadata),
                metadataOrder     = _.clone(_.uniq(response.collection.searching.regions_order)),
                columnDefinations = [];
            _.each(regionMetadata, function (data, key) {
              var sequence = 500 + metadataOrder.indexOf(key);
              data.definitions_order = sequence;
              data.key = key;
              data.sortable = false;
              data.column_key = key;
              data.column_name = key;
              data.default_action = ["OTLocation", "OTName", "OTMIMEType"].indexOf(key) >= 0;
              data.default = ["OTLocation", "OTName", "OTMIMEType"].indexOf(key) >= 0;
              columnDefinations.push(data);
            });
            columnDefinations.push({
              "key": "favorite",
              "column_key": "favorite",
              "default": true
            });
            columnDefinations.push({
              "key": "reserved",
              "column_key": "reserved",
              "default": true
            });
            var metadata         = _.pluck(response.results, 'search_result_metadata'),
                nodesWithVersion = _.where(metadata, {current_version: false});
            nodesWithVersion = nodesWithVersion.length ? nodesWithVersion :
                               _.where(metadata, {version_type: 'minor'});
            if (nodesWithVersion && nodesWithVersion.length > 0) {
              columnDefinations.push({
                "key": "version_id",
                "column_key": "version_id"
              });
            }
            sortedColumns.reset(columnDefinations);
            response.collection.searching.sortedColumns = sortedColumns;
            _.each(response.results, function (model) {
              if (model.data.versions && model.search_result_metadata &&
                  (model.search_result_metadata.current_version == false ||
                   model.search_result_metadata.version_type === 'minor')) {
                model.data.versions.current_version = false;
              }
            });
          }
          var sorting = response.collection.sorting.links;
          for (var sort in sorting) {
            if (sort.search("asc_") === 0) {
              var sortColumn = this.trimSortOptionName(sorting[sort].name);
              sortColumn = sortColumn.trim();
              var column = response.collection.searching.sortedColumns.where({name: sortColumn});
              (column && column.length > 0) ? column[0].set('sort', true) : '';
            }
          }
          response.results = (response.featured && response.collection.sorting &&
                              response.collection.sorting.sort[0] === "relevance") ?
                             response.featured.concat(response.results) :
                             response.results;
          this.parseBrowsedState(response.collection, options);
          this.parseSearchResponse(response, options);
          if (options.fetchFacets) {
            this._parseFacets(response.collection.searching.facets);
          }
          response.results.sorting = response.collection.sorting;
          this.cacheId = (!!response.collection && !!response.collection.searching &&
                          !!response.collection.searching.cache_id) ?
                         response.collection.searching.cache_id : "";
          return this.parseBrowsedItems(response, options);
        },

        trimSortOptionName: function (name) {
          return name.replace(/\(([;\s\w\"\=\,\:\.\/\~\{\}\?\!\-\%\&\#\$\^\(\)]*?)\)/g, "");
        },

        addRegionsToPromotedList: function (featuredList) {
          _.each(featuredList, function (featuredObject, key) {
            featuredObject.data.regions = {
              OTMIMEType: featuredObject.data.properties.mime_type,
              OTName: featuredObject.data.properties.name,
              OTLocation: featuredObject.data.properties.parent_id,
              OTObjectDate: featuredObject.data.properties.create_date,
              OTModifyDate: featuredObject.data.properties.modify_date,
              OTObjectSize: featuredObject.data.properties.size_formatted
            };
          });
        },

        _parseFacets: function (facets) {
          var topics;
          if (facets) {
            topics = convertFacets(facets.selected, true)
                .concat(convertFacets(facets.available, false));
          }
          this.searchFacets.reset(topics);
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
