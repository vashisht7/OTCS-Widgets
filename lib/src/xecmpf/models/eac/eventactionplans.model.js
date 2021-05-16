/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/expandable/expandable.mixin', 'csui/models/browsable/client-side.mixin',
  'csui/models/columns',
  'xecmpf/models/eac/eac.eventlist.columns.definitions'
], function (_, $, Backbone, Url, ConnectableMixin, ExpandableMixin, ClientSideBrowsableMixin,
  NodeColumnCollection, eacEventListColumnsDefinition) {

    var EACEventActionPlan = Backbone.Model.extend({

      idAttribute: '',

      constructor: function EACEventActionPlan(attributes, options) {
        options || (options = {});
        Backbone.Model.prototype.constructor.apply(this, arguments);
      },

      parse: function (response) {
        if(response) {
          response.has_action_plan = "false";
          if(response.action_plans) {
            response.has_action_plan = (!!response.action_plans.length).toString();
          }
        }
        return response;
      }
    });

    var EACEventActionPlans = Backbone.Collection.extend({

      model: EACEventActionPlan,

      constructor: function EACEventActionPlans(models, options) {
        this.options = options || {};
        Backbone.Collection.prototype.constructor.apply(this, arguments);
        this.makeConnectable(options)
          .makeClientSideBrowsable(options);
        this.columns = new NodeColumnCollection();
        this.columns.reset(this.getColumnModels());
      },

      url: function () {
        var url = this.connector.connection.url.replace('/v1', '/v2');
        url = Url.combine(url, 'eventactioncenter', 'actionplan') ;
        return url;
      },

      getColumnModels: function () {
        var definitions = eacEventListColumnsDefinition;
        var columnKeys = _.keys(definitions);
        var columns = _.reduce(columnKeys, function (colArray, column) {
          var definition = definitions[column];
          if (definition) {
            colArray.push(_.extend({ column_key: column }, definition));
          }
          return colArray;
        }, []);
        return columns;
      },

      parse: function (response) {
        var results = response.results.data;
        for (var i = 0; i < results.length; i++) {
          if (results[i].action_plan_count && parseInt(results[i].action_plan_count) > 0) {
            results[i].enableActionPlanCount = true;
          }
          results[i].eventIndexCount = i;
        }
        return results;
      }

    });

    ConnectableMixin.mixin(EACEventActionPlans.prototype);
    ClientSideBrowsableMixin.mixin(EACEventActionPlans.prototype);

    return EACEventActionPlans;
  });
