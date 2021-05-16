/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/table/cells/cell.factory', 'csui/controls/table/cells/templated/templated.view',
  'csui/utils/types/date', 'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/metadata/search.metadata',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, Marionette, base, cellViewFactory, cellView, date, lang, itemTemplate) {
  "use strict";

  var SearchMetadataItemView = Marionette.ItemView.extend({
    className: "csui-search-item-details binf-col-lg-12",
    template: itemTemplate,
    attributes: {
      'role': 'listitem'
    },
    templateHelpers: function () {
      if (this._index < this.options.displayCount) {
        if (this._index < 2) {
          this.el.classList.add('csui-search-result-item-tobe-hide');
        }
      } else {
        this.el.classList.add('csui-search-hidden-items');
        this.el.classList.add('truncated-' + this.options.rowId);
      }
      var CellView = cellViewFactory.getCellView(this.model);
      if (CellView.columnClassName === "") {
        CellView = cellView;
      }
      var column       = {
            CellView: CellView,
            attributes: this.model.attributes,
            name: this.model.get("key"),
            title: this.model.get('title') || this.model.get('name') ||
                   this.model.get("column_name")
          },
          metadataView = new CellView({
            tagName: 'span',
            model: this.options.searchItemModel,
            column: column
          });
      var metadataValue = metadataView.getValueData && metadataView.getValueData();
      return {
        label: this.model.get("name"),
        value: metadataValue &&
               (metadataValue.formattedValue || metadataValue.value || metadataValue.name),
        tooltipText: metadataValue &&
                     (metadataValue.value || metadataValue.name || metadataValue.nameAria)
      };
    }
  });

  var SearchMetadataCollectionView = Marionette.CollectionView.extend({
    className: "csui-search-items-metadata",
    childView: SearchMetadataItemView,
    ui: {
      fieldsToBeHiddenOnHover: '.csui-search-result-item-tobe-hide'
    },
    childViewOptions: function () {
      return {
        rowId: this.options.rowId,
        searchItemModel: this.model,
        displayCount: this.childDisplayCount
      };
    },

    constructor: function SearchMetadataCollectionView(options) {
      options || (options = {});
      this.options = options;

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      var desc    = this.model.get("description"),
          summary = this.model.get("summary");

      this.childDisplayCount = ((summary && summary.length) || (desc && desc.length)) ? 3 : 2;
    },
    filter: function (child, index, collection) {
      if (child.get('key') === 'size' || child.get('key') === 'OTObjectSize') {
        return (this.model.get(child.get('key')) &&
                this.model.get(child.get('key') + "_formatted") !== "");
      } else if (["OTLocation", "OTName", "OTMIMEType", "reserved", "favorite"].indexOf(
              child.get('key')) >= 0) {
        return;
      } else {
        return (this.model.get(child.get('key')) && this.model.get(child.get('key')) !== "");
      }
    },
    onRender: function () {
      var collection = this.collection;
      this.collection.comparator = function (model) {
        return model.get("definitions_order");
      };
      this.collection.sort();
      this.bindUIElements();
    }
  });

  return SearchMetadataCollectionView;
});