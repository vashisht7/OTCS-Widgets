/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (_, $, Backbone) {
  var MetadataCollection = Backbone.Collection.extend({

    constructor: function MetadataCollection(models, options) {
      options || (options = {});
      options.data || (options.data = {});
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (!_.isEmpty(options.data)) {
        this.hideEmptyFields = options.hideEmptyFields;
        this.catsAndAttrs = options.catsAndAttrs;
        this._addModels(options.data);
      }
    },

    _addModels: function (data) {
      _.each(this.catsAndAttrs, function (item) {
        var itemType = typeof item,
            label, value, type, attribute, category;

        if (itemType === 'number') {
          category = item;
          if (data.hasOwnProperty(category)) {
            for (attribute in data[category]['data']) {
              if (data[category]['data'].hasOwnProperty(attribute)) {
                label = data[category]['definitions'][attribute]['name'];
                value = data[category]['data'][attribute];
                type = data[category]['definitions'][attribute]['type_name'];
                if (this.hideEmptyFields === true && value === null) {continue;}
                this.add({label: label, value: value, type: type});
              }
            }
          }
        } else if (itemType === 'string') {
          category = item.split('_')[0];
          attribute = item;
          if (data.hasOwnProperty(category) && data[category]['data'].hasOwnProperty(attribute)) {
            label = data[category]['definitions'][attribute]['name'];
            value = data[category]['data'][attribute];
            type = data[category]['definitions'][attribute]['type_name'];
            if (this.hideEmptyFields === true && value === undefined) {return;}
            this.add({label: label, value: value, type: type});
          }
        }
      }, this);
    },

    comparator: 'label'
  });

  return MetadataCollection;
});
