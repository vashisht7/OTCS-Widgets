/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/types/date',
  'css!csui/controls/table/cells/date/impl/date'
], function (_, TemplatedCellView, cellViewRegistry, date) {
  'use strict';

  var DateCellView = TemplatedCellView.extend({
    className: 'csui-nowrap',
    needsAriaLabel: true,

    constructor: function DateCellView() {
      TemplatedCellView.prototype.constructor.apply(this, arguments);
    },

    formatFunction: function (value, options) {
      return options && options.includeTime ?
          date.formatExactDateTime(value) : date.formatExactDate(value);
    },

    getValueData: function () {
      var column = this.options.column;
      var propertyValue = this.model.get(column.name);
      var formatOptions = { includeTime: column.attributes.include_time !== false };
      var formatFunction = this.formatFunction;
      function format (singleValue) {
        return formatFunction(singleValue, formatOptions);
      }
      return this.getSingleOrMultipleValueData(propertyValue, format, format);
    },
    getValueText: function () {
      return this.getValueData().formattedValue;
    }
  }, {
    flexibleWidth: true,
    columnClassName: 'csui-table-cell-date',

    getValue: function (model, column) {
      var value = TemplatedCellView.getValue(model, column);
      return value && date.deserializeDate(value);
    }
  });

  cellViewRegistry.registerByDataType(-7, DateCellView);

  return DateCellView;
});
