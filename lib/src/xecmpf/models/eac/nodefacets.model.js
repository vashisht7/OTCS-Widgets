/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/url', 'csui/models/facets',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.facets/server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Url, FacetCollection, NodeResourceMixin, ServerAdaptorMixin) {
  'use strict';

  var EACFacetCollection = FacetCollection.extend({
    constructor: function EACFacetCollection(models, options) {
      FacetCollection.prototype.constructor.apply(this, arguments);
      this.makeNodeResource(options)
        .makeServerAdaptor(options);
    },
    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        filters: _.deepClone(this.filters)
      });
    }
  });

  NodeResourceMixin.mixin(EACFacetCollection.prototype);
  ServerAdaptorMixin.mixin(EACFacetCollection.prototype);

  EACFacetCollection.prototype.url = function () {
    var nodeId = this.node.get('id'),
      filter = this.getFilterQuery(this.filters),
      url = Url.combine(this.connector.connection.url, 'eventactioncenter', '/facets').replace('/v1', '/v2');
    if (filter) {
      url += '?' + filter;
    }
    return url;
  };

  return EACFacetCollection;
});
