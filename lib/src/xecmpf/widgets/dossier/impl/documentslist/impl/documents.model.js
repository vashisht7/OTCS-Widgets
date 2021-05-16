/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, Url,
    ConnectableMixin, BrowsableMixin,
    NodeModel) {

  var config, DocumentModel, DocumentsCollection;

  config = module.config();

  DocumentModel = NodeModel.extend({

    idAttribute: 'id',

    constructor: function DocumentModel(attributes, options) {
      options || (options = {});
      if (!options.connector) {
        options.connector = options.collection && options.collection.connector || undefined;
      }
      NodeModel.prototype.constructor.apply(this, arguments);
      this.set(NodeModel.prototype.parse.call(this, attributes, options));
    }
  });

  DocumentsCollection = Backbone.Collection.extend({

    model: DocumentModel,

    constructor: function DocumentsCollection(models, options) {
      options || (options = {});
      options.connector = options.nodeModel && options.nodeModel.connector;
      this.options = _.pick(options, ['connector', 'nodeModel', 'query', 'paging', 'metadata']);
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeConnectable(this.options)
          .makeBrowsable(this.options);

      this.totalCount = this.options.paging.total_count;
      this.options.orderBy = this.orderBy;
    },

    fetch: function () {
      return Backbone.Collection.prototype.fetch.apply(this, arguments);
    },

    parse: function (response, options) {
      return response.results.data;
    },

    mergeUrlPaging: function (config, queryParams) {
      var limit = this.topCount || config.defaultPageSize || 5;
      if (limit) {
        queryParams.limit = limit;
        queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
      }
      return queryParams;
    },

    mergeUrlMetadata: function (queryParams) {
      if (this.options.metadata) {
        queryParams.metadata = '{' + this.options.metadata + '}';
      }
      return queryParams;
    },

    queryParamsToString: function (params) {
      return '?' + $.param(params);
    },

    url: function () {
      var queryParams = this.options.query || {};
      queryParams = this.mergeUrlPaging(config, queryParams);
      queryParams = this.mergeUrlMetadata(queryParams);

      var url = this.connector.connection.url;
      url = Url.combine(url, 'businessworkspaces',
          this.options.nodeModel && this.options.nodeModel.get('id'), 'dossier/documents');
      url = url.replace('/v1', '/v2');

      return url + this.queryParamsToString(queryParams);
    }
  });

  ConnectableMixin.mixin(DocumentsCollection.prototype);
  BrowsableMixin.mixin(DocumentsCollection.prototype);
  return DocumentsCollection;
});
