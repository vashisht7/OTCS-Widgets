/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'hbs!xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata'
], function (_, $, Backbone, Marionette, base,
    template) {

  var MetadataItemView = Marionette.ItemView.extend({

    tagName: 'tr',

    constructor: function MetadataItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: template,

    templateHelpers: function () {
      var value = this.model.get('value');
      return {
        value: this.model.get('type') === 'Date' ? base.formatFriendlyDate(value) : value
      }
    }
  });

  var MetadataView = Marionette.CollectionView.extend({

    tagName: 'table',

    constructor: function MetadataView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    childView: MetadataItemView
  });

  return MetadataView;
});
