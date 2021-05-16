/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/models/node.facets2/facet.query.mixin'
], function (_, $, Url, FacetQueryMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var originalFetch = prototype.fetch;

      FacetQueryMixin.mixin(prototype);

      return _.extend(prototype, {
        filterQueryParameterName: 'where_facet',
        facetIdQueryParameterName: 'facet_id',

        makeServerAdaptor: function (options) {
          return this.makeFacetQuery(options);
        },

        isFetchable: function () {
          var node       = this.node,
              type       = node.get('type'),
              locationId = node.get('location_id');
          if (type === 899 && locationId === 0) {
            return false;
          }
          return true;
        },

        url: function () {
          var nodeId  = this.node.get(this.node.get('type') === 899 ? 'location_id' : 'id'),
              filters = _.union(getNodeFilters(this.node), this.filters),
              filter  = this.getFilterQuery(filters),
              facetId = this.getFacetIdQuery(),
              apiBase = new Url(this.connector.connection.url).getApiBase('v2'),
              url     = Url.combine(apiBase, '/facets/', nodeId);
          this.itemsToShow && (url = Url.appendQuery(url, 'top_values_limit=' + this.itemsToShow));
          filter && (url = Url.appendQuery(url, filter));
          facetId && (url = Url.appendQuery(url, facetId));
          return url;
        },

        parse: function (response, options) {
          var topics    = response.results.data || {},
              facets    = topics.facets || {},
              selected  = topics.values.selected || [],
              available = topics.values.available || [];
          selected.forEach(markSelectedTopics.bind(null, true));
          available.forEach(markSelectedTopics.bind(null, false));
          if (this.node.get('type') === 899) {
            var nodeFacets = this.node.get('selected_facets') || [];
            nodeFacets = nodeFacets.map(function (facet) {
              return facet[0];
            });
            selected = selected.filter(function (facet) {
              var id = _.keys(facet)[0];
              return !_.contains(nodeFacets, id);
            });
          }
          return selected
              .concat(available)
              .map(mergeFacetTopics.bind(this, facets));
        }
      });
    }
  };

  function markSelectedTopics(selected, facet) {
    var id     = _.keys(facet)[0],
        topics = facet[id];
    _.each(topics, function (topic) {
      topic.value = topic.value.toString();
      topic.selected = selected;
    });
  }

  function mergeFacetTopics(facets, facet) {
    var id         = _.keys(facet)[0],
        topics     = facet[id],
        properties = facets[id] || {};
    return _.extend({
      nodeFacetsCollection: this,
      items_to_show: this.itemsToShow,
      select_multiple: true,
      topics: topics
    }, properties, {
      id: id.toString()
    });
  }

  function getNodeFilters(node) {
    var selectedFacets = [];
    if (node.get('type') === 899) {
      var virtualFacets = node.get('selected_facets');
      selectedFacets = _.map(virtualFacets, function (item) {
        var facetGroup = {'id': item[0], 'values': []};
        item[1].forEach(function (id) {
          facetGroup.values.push({'id': id});
        });
        return facetGroup;
      });
    }
    return selectedFacets;
  }

  return ServerAdaptorMixin;
});
