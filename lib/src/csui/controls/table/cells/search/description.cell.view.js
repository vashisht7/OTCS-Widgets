/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/text/text.view',
  'csui/controls/table/cells/cell.registry'
], function (TextView, cellViewRegistry) {
  'use strict';
   var DescriptionCellView = TextView.extend({
      getValueText: function () {
        var column = this.options.column;
        if (column) {
          var columnName = column.name,
              model = this.model,
              value = model.get(columnName + "_formatted");
          if (this.options.tableView.selectedSettings === 'DP' ||
              this.options.tableView.selectedSettings === 'SP') {
              if (this.options.tableView.selectedSettings === 'DP' && columnName === 'summary') {
                value = model.get('description') === '' ? value : '';
              } else if (this.options.tableView.selectedSettings === 'SP' && columnName === 'description') {
                value = model.get('summary') === '' ? value : '';
              }
          }
          if (value === null || value === undefined) {
            value = model.get(columnName);
            if (value === null || value === undefined) {
              value = '';
            }
          }
          return this.getSingleOrMultipleValueText(value);
        }
        return '';
      },
  });

  cellViewRegistry.registerByColumnKey('description', DescriptionCellView);
  cellViewRegistry.registerByColumnKey('summary', DescriptionCellView);
  return DescriptionCellView;
});