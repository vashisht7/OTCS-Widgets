/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/base',
  'csui/utils/accessibility',
  'i18n!csui/controls/table/cells/size/impl/nls/localized.strings',
  'css!csui/controls/table/cells/size/impl/size'
], function (_, TemplatedCellView, cellViewRegistry, base, Accessibility, lang) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var SizeCellView = TemplatedCellView.extend({
    className: 'csui-nowrap',
    needsAriaLabel: true,

    getValueData: function () {
      var model      = this.model,
          column     = this.options.column,
          columnName = column.name,
          value      = model.get(columnName),
          type       = model.get('type'),
          formattedValue;

      if (value == null) {
        if (accessibleTable) {
          value = formattedValue = lang.sizeUnavailable;
        } else {
          return TemplatedCellView.prototype.getValueData.apply(this, arguments);
        }
      } else if (model.get('container')) {
        value = formattedValue = type !== 899 && type !== 411 ?
                                 model.get(columnName + '_formatted') : '';

        if (accessibleTable && !value) {
          value = formattedValue = lang.sizeUnavailable;
        }
      } else if (type === 144 || type === 749 || type === 736 || type === 30309) {
        formattedValue = base.formatFriendlyFileSize(value);
        value = base.formatExactFileSize(value);
      } else {
        return TemplatedCellView.prototype.getValueData.apply(this, arguments);
      }

      return {
        value: value,
        formattedValue: formattedValue
      };
    },

    getValueText: function () {
      var data = this.getValueData(),
          formattedValue;
      if (data && (data.formattedValue === undefined || data.formattedValue === null)) {
        formattedValue = data && data.value;
      }
      else {
        formattedValue = data && data.formattedValue;
      }
      return formattedValue;
    },

    getTooltipValueText: function () {
      var data           = this.getValueData(),
          formattedValue = data && data.value || this.getValueText();
      return formattedValue;
    },

    getAriaLabel: function () {
      var data = this.getValueData();
      return data && data.value ||
        _.str.sformat(lang.sizeUnavailableAria, this.model.get('type_name'));
    }
  }, {
    flexibleWidth: true,
    columnClassName: 'csui-table-cell-size'
  });

  cellViewRegistry.registerByColumnKey('size', SizeCellView);
  cellViewRegistry.registerByColumnKey('container_size', SizeCellView);
  cellViewRegistry.registerByColumnKey('file_size', SizeCellView);
  cellViewRegistry.registerByColumnKey('OTObjectSize', SizeCellView);

  return SizeCellView;
});
