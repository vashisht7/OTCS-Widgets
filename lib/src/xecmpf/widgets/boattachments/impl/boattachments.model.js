/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/node/node.model',
  'csui/models/connectable',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/nodechildren',

  'csui/models/nodes',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/browsable/v1.response.mixin',
  'csui/models/browsable/v2.response.mixin',

  'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',
  'xecmpf/widgets/boattachments/impl/boattachment.model'
], function (module, $, _, Backbone, Url,
    NodeModel, ConnectableModel,
    NodeChildrenColumnModel,
    NodeChildrenColumnCollection,
    NodeChildrenCollection,
    NodeCollection,
    ExpandableMixin,
    NodeResourceMixin,
    BrowsableMixin,
    BrowsableV1RequestMixin,
    ResourceMixin,
    BrowsableV1ResponseMixin,
    BrowsableV2ResponseMixin,
    AttachmentContextBusinessObjectInfoFactory,
    BOAttachmentModel) {
  var AttachmentsColumnModel = NodeChildrenColumnModel.extend({

    constructor: function AttachmentsColumnModel() {
      NodeChildrenColumnModel.prototype.constructor.apply(this, arguments);
    }
  });
  var AttachmentsColumnCollection = NodeChildrenColumnCollection.extend({

    dataCollectionName: "properties",
    model: AttachmentsColumnModel,

    constructor: function AttachmentsColumnCollection(dataCollectionName) {
      dataCollectionName && (this.dataCollectionName = dataCollectionName);
      NodeChildrenColumnCollection.prototype.constructor.apply(this);
    },

    resetColumns: function (response, options) {
      this.resetCollection(this.getColumns(response), options);
    },

    getColumns: function (response) {

      var definitions = response && response.meta_data && response.meta_data.properties || {};

      if (definitions && !definitions['modified']) {
        definitions['modified'] = definitions['modify_date'];
      }

      if (definitions && !definitions['size_formatted']) {
        definitions['size_formatted'] = definitions['size'];
      }
      var columnKeys   = _.keys(definitions),
          columnModels = this.getColumnModels(columnKeys, definitions);

      _.each(columnModels, function (model) {
        if (model.persona === "user" || model.persona === "member") {
          model.type = 14;
        }
      });

      return columnModels
    }

  });
  var config = module.config();

  var BOAttachmentsCollection = NodeCollection.extend({

    dataCollectionName: "properties",
    model: BOAttachmentModel,

    constructor: function BOAttachmentsCollection(models, options) {
      NodeCollection.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.options = options;

      this.makeNodeResource(options)
          .makeExpandable(options)
          .makeBrowsable(options)
          .makeBrowsableV1Request(options)
          .makeBrowsableV1Response(options);

      this.columns = new AttachmentsColumnCollection(this.dataCollectionName);
      this.totalCount = 0;
      this.titleIcon = undefined;
      this.next = undefined;
      this.busobjinfo = this.options.context.getModel(AttachmentContextBusinessObjectInfoFactory,
          {
            attributes: this.options.data.businessattachment.properties,
            data: this.options.data.businessattachment.properties
          });
    },

    url: function () {
      var queryParams = this.options.query || {};
      queryParams = this.mergeUrlPaging(config, queryParams);
      queryParams = this.mergeUrlSorting(queryParams);
      queryParams = this.mergeUrlFiltering(queryParams);

      var url = Url.combine(this.getBaseUrl(),
          'businessobjects',
          encodeURIComponent(this.busobjinfo.get("extSystemId")),
          encodeURIComponent(this.busobjinfo.get("busObjectType")),
          encodeURIComponent(this.busobjinfo.get("busObjectKey")),
		  'businessattachments');

      this.listenTo(this, "sync", this._cacheCollection);
      url = url.replace('/v1', '/v2');
      queryParams = _.omit(queryParams, function (value, key) {
        return value == null || value === '';
      });
      queryParams.metadata = undefined;
      return url + '?' + this.queryParamsToString(queryParams) + "&expand=" + encodeURIComponent(
          'properties{original_id,ancestors,parent_id,reserved_user_id,createdby,modifiedby}');

    },

    fetch: function (options) {
      var self = this,
          df   = $.Deferred();
      this.busobjinfo.fetch().done(function () {
        if (!this.fetching) {
          this.totalCount = 0;
        }

        if (self.busobjinfo.get("extSystemId") &&
            self.busobjinfo.get("busObjectType") &&
            self.busobjinfo.get("busObjectKey")) {
          self.Fetchable.fetch.call(self, options).done(function () {
            df.resolve()
          }).fail(function () {
            df.resolve()
          })
        } else {
          self.trigger('sync');
          df.resolve()
        }
      });
      return df.promise();
    },

    clone: function () {
      var options = $.extend(true, {}, this.options);
      options.query && options.query.where_name && (options.query.where_name = '');
      var collection = new this.constructor([], options);

      collection.connector = this.connector;
      return collection;
    },

    parse: function (response) {
      this.totalCount = response.paging.total_count;
      this.options.orderBy = this.orderBy;
      this.columns && this.columns.resetColumns(response, this.options);
      this.next = response.paging.actions && response.paging.actions.next ? true : false;

      this.businessObjectActions = response.businessObjectActions;
      return response.results;
    },
    mergeUrlPaging: function (config, queryParams) {
      var limit = this.topCount || config.defaultPageSize;
      if (limit) {
        queryParams.limit = limit;
        queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
      }
      return queryParams;
    },

    mergeUrlSorting: function (queryParams) {
      var orderBy;
      if (this.orderBy) {
        orderBy = this.orderBy;
        queryParams.sort = this._formatSorting(orderBy);
      } else if (_.isUndefined(queryParams.sort)) {
        queryParams.sort = "asc_name";
        this.orderBy = "name asc";
      } else if (queryParams.sort.indexOf(" ") > -1) {
        orderBy = queryParams.sort;
        this.orderBy = queryParams.sort;
        queryParams.sort = this._formatSorting(orderBy);
      }
      return queryParams;
    },

    _formatSorting: function (orderBy) {
      var slicePosition = orderBy.lastIndexOf(" ");
      return orderBy.slice(slicePosition + 1) + '_' + orderBy.slice(0, slicePosition);
    },

    mergeUrlFiltering: function (queryParams) {
      if (!$.isEmptyObject(this.filters)) {
        for (var name in this.filters) {
          if (this.filters.hasOwnProperty(name)) {
            if (this.filters[name] === "" || this.filters[name] === undefined) {
              delete queryParams["where_" + name];
              delete this.options.query["where_" + name];
            } else {
              queryParams["where_" + name] = "contains_" +
                                             encodeURIComponent(this.filters[name]);
            }
          }
        }
      }
      return queryParams;
    },

    queryParamsToString: function (params) {
      var queryParamsStr = "";
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          if (queryParamsStr.length > 0) {
            queryParamsStr += "&"
          }

          if (params[param] === undefined) {
            queryParamsStr += param;
          } else {
            queryParamsStr += param + "=" + params[param];
          }
        }
      }
      return queryParamsStr;
    },

    getBaseUrl: function () {
      var url = this.connector && this.connector.connection &&
                this.connector.connection.url;
      if (_.isUndefined(url)) {
        url = this.options.connector.connection.url;
      }
      return url;
    }
  });

  BrowsableMixin.mixin(BOAttachmentsCollection.prototype);
  ExpandableMixin.mixin(BOAttachmentsCollection.prototype);
  NodeResourceMixin.mixin(BOAttachmentsCollection.prototype);
  BrowsableV1RequestMixin.mixin(BOAttachmentsCollection.prototype);
  BrowsableV1ResponseMixin.mixin(BOAttachmentsCollection.prototype);

  var originalFetch = NodeCollection.prototype.fetch;
  BOAttachmentsCollection.prototype.Fetchable = {

    fetch: function (options) {
      return originalFetch.call(this, options);
    }

  };

  return BOAttachmentsCollection;

});
