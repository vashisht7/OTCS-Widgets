/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/backbone', 'i18n!xecmpf/widgets/dossier/impl/nls/lang'
], function (module, Backbone, lang) {
  var config = module.config(),
      DropdownItemModel,
      DropdownItemCollection,
      dropdownItems;

  DropdownItemModel = Backbone.Model.extend({

    idAttribute: "value",

    defaults: {
      value: null,
      name: null,
      sequence: 0 // smaller number moves up
    }
  });

  DropdownItemCollection = Backbone.Collection.extend({

    model: DropdownItemModel,
    comparator: 'sequence',

    getItemValues: function () {
      return this.pluck('value');
    },

    deepClone: function () {
      return new DropdownItemCollection(
          this.map(function (item) {
            return item.attributes;
          }));
    }

  });

  dropdownItems = new DropdownItemCollection([
    {
      value: 'classification',
      name: config.groupByDocumentType ?
            lang.documentTypeLabel : lang.classificationLabel,
      sequence: 10
    },
    {
      value: 'create_date',
      name: lang.createDateLabel,
      sequence: 20
    }
  ]);

  return dropdownItems;
});
