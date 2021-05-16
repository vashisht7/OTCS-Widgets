/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/favorite2column', 'i18n!csui/models/impl/nls/lang'
], function (_, Backbone, Favorite2ColumnModel, modelLang) {
  'use strict';

  var Favorite2ColumnCollection = Backbone.Collection.extend({

    model: Favorite2ColumnModel,

    constructor: function Favorite2ColumnCollection(models, options) {
      if (!models) {
        models = [
          {
            default_action: true,
            key: "type",
            name: modelLang.type,
            type: 2
          },
          {
            default_action: true,
            key: "favorite_name",
            name: modelLang.name,
            type: -1
          },
          {
            key: "reserved", // the column can hold different icons representing state-information, not just the reserved-state.
            name: modelLang.state,
            type: 5
          },
          {
            key: "parent_id",
            name: modelLang.parentID,
            type: 2
          },
          {
            key: "favorite",
            name: modelLang.favorite,
            type: 5
          }
        ];
        models.forEach(function (column, index) {
          column.definitions_order = index + 100;
          column.column_key = column.key;
        });
      }
      Backbone.Collection.prototype.constructor.call(this, models, options);
    }

  });

  return Favorite2ColumnCollection;
});
