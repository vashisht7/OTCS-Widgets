/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (Backbone, lang) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: 'key',

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: 'sequence',

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }
  });

  var tableColumns = new TableColumnCollection([
    {
      key: 'audit_name',
      align: 'left',
      title: lang.action,
      sequence: 10
    },
    {
      key: 'audit_date',
      align: 'left',
      title: lang.date,
      sequence: 20
    },
    {
      key: 'user_id',
      align: 'left',
      title: lang.user,
      sequence: 30
    }
  ]);

  return tableColumns;
});
