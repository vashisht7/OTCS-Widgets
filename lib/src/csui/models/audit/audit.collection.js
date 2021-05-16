/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v2.response.mixin',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/audit/server.adaptor.mixin',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, BrowsableMixin,
    BrowsableV2ResponseMixin, BrowsableV1RequestMixin, ServerAdaptorMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel) {

  var auditObject = {
    auditName: 'audit_name',
    auditDate: 'audit_date',
    userIdKey: 'user_id',
    dateType: '-7'
  };

  var AuditColumnModel = NodeChildrenColumnModel.extend({

    constructor: function AuditColumnModel(attributes, options) {
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }
  });

  var AuditColumnCollection = NodeChildrenColumnCollection.extend({

    model: AuditColumnModel,

    resetColumnsV2: function (response, options) {
      if(!this.models.length) {// Stopping reset as event data is static and doesn't change after first fetch
      this.resetCollection(this.getV2Columns(response), options);
    }
    },

    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === auditObject.auditDate) {
          column.sort = true;
        }
      });
      return columns;
    },

    getV2Columns: function (response) {
      var definitions = (response.results &&
                         response.results[0] &&
                         response.results[0].metadata &&
                         response.results[0].metadata.properties) || {};

        definitions.audit_name = {filter: true};
        definitions.audit_date = {};
        definitions.user_id = {filter: true};

        definitions.audit_name.key = auditObject.auditName;
        definitions.audit_date.key = auditObject.auditDate;
        definitions.user_id.key = auditObject.userIdKey;
        definitions.audit_date.type = auditObject.dateType;

      var columnKeys = _.keys(definitions);
      return this.getColumnModels(columnKeys, definitions);
    }

  });

  var AuditEventModel = Backbone.Model.extend({});

  var AuditEventCollection = Backbone.Collection.extend({

    model: AuditEventModel,
    constructor: function AuditEventCollection(models, options) {
      this.options = options || {};
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },
  });

  var AuditModel = NodeModel.extend({});

  var AuditCollection = Backbone.Collection.extend({

    model: AuditModel,

    constructor: function AuditCollection(models, options) {
      this.options = options || {};
      Backbone.Collection.prototype.constructor.call(this, models, options);

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeBrowsable(options)
          .makeBrowsableV2Response(options)
          .makeBrowsableV1Request(options)
          .makeServerAdaptor(options);

      this.columns = new AuditColumnCollection();
      this.auditEvents = new AuditEventCollection();
    }

  });

  ConnectableMixin.mixin(AuditCollection.prototype);
  FetchableMixin.mixin(AuditCollection.prototype);
  BrowsableMixin.mixin(AuditCollection.prototype);
  BrowsableV2ResponseMixin.mixin(AuditCollection.prototype);
  BrowsableV1RequestMixin.mixin(AuditCollection.prototype);
  ServerAdaptorMixin.mixin(AuditCollection.prototype);

  return AuditCollection;

});