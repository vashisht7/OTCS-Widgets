/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone",
  'i18n!csui/models/impl/nls/lang'
], function (_, Backbone, lang) {

  var metadataColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var metadataColumnCollection = Backbone.Collection.extend({

    model: metadataColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new metadataColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }
  });

  var metadataColumns = new metadataColumnCollection([
    {
      key: 'OTMIMEType',
      sequence: 0,
      titleIconInHeader: 'mime_type',
      permanentColumn: true // don't wrap column due to responsiveness into details row
    },
    {
      key: 'OTName',
      sequence: 1,
      permanentColumn: true, // don't wrap column due to responsiveness into details row
      isNaming: true  // use this column as a starting point for the inline forms
    },
    {
      key: 'version_id',
      column_key: 'version_id',
      title: lang.version,
      noTitleInHeader: true,
      permanentColumn: true,
      sequence: 2
    },
    {
      key: 'reserved',
      column_key: 'reserved',
      sequence: 3,
      title: lang.state, // "reserved" is just to bind the column to some property
      noTitleInHeader: true, // don't display a text in the column header
      permanentColumn: true
    },
    {
      key: 'favorite',
      column_key: 'favorite',
      sequence: 910,
      title: lang.favorite,
      noTitleInHeader: true,
      permanentColumn: true // don't wrap column due to responsiveness into details row
    }
  ]);

  return metadataColumns;
});