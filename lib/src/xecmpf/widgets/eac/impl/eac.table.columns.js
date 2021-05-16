/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'i18n!xecmpf/widgets/eac/impl/nls/lang'

], function (_, Backbone, lang) {
  'use strict';

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,
      sequence: 0
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,

    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
        this.map(function (column) {
          return column.attributes;
        }));
    },

    resetCollection: function (columns, options) {
      if (columns) {
        var sequence = 0;
        var models = _.map(columns, function (column) {
          var columnData = column instanceof Backbone.Model ? column.toJSON() : column;
          sequence += 10;
          return new TableColumnModel(_.defaults(columnData,
            { key: columnData.column_key, sequence: sequence }));
        });
        this.reset(models, options);
      }
    }

  });

  var tableColumns = new TableColumnCollection([
    {
      key: 'event_name',
      title: lang.columnEventName,
      sequence: 10,
      permanentColumn: true
    },
    {
      key: 'namespace',
      title: lang.columnSystemName,
      sequence: 20,
      permanentColumn: true
    },
    {
      key: 'action_plan',
      title: lang.columnActionPlan,
      sequence: 30,
      permanentColumn: true
    }
  ]);

  return tableColumns;
});
