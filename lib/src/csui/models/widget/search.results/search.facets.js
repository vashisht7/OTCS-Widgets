/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/facets',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/browsable/v1.request.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/widget/search.results/facet.server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, FacetCollection, ConnectableMixin, FetchableMixin,
    BrowsableV1RequestMixin, BrowsableV2ResponseMixin, ServerAdaptorMixin) {
  'use strict';

  var SearchFacetCollection = FacetCollection.extend({
    constructor: function SearchFacetCollection(models, options) {
      this.options = options || (options = {});
      FacetCollection.prototype.constructor.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeBrowsableV1Request(options)
          .makeBrowsableV2Response(options)
          .makeServerAdaptor(options);
    },
    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        skip: this.skipCount,
        top: this.topCount,
        filters: _.deepClone(this.filters)
      });
    },

    isFetchable: function () {
      return (!!this.options.query.get('where') || !!this.options.query.get('query_id'));
    }
  });

  BrowsableV1RequestMixin.mixin(SearchFacetCollection.prototype);
  BrowsableV2ResponseMixin.mixin(SearchFacetCollection.prototype);
  ConnectableMixin.mixin(SearchFacetCollection.prototype);
  FetchableMixin.mixin(SearchFacetCollection.prototype);
  ServerAdaptorMixin.mixin(SearchFacetCollection.prototype);

  return SearchFacetCollection;
});
