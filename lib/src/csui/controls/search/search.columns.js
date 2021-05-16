/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone",
  'i18n!csui/models/widget/nls/lang'
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
    
  ]);

  return metadataColumns;
});