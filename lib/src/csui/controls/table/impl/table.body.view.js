/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/focusable', 'i18n'
], function ($, Marionette, focusable, i18n) {
  'use strict';

  var TableBodyView = Marionette.View.extend({
    constructor: function TableBodyView(options) {
      TableBodyView.__super__.constructor.apply(this, arguments);
      this._getActiveInlineForm = options._getActiveInlineForm;
      this.startInlineFormForEdit = options.startInlineFormForEdit;
      this.collection = options.collection;
      this.displayedColumns = options.displayedColumns;
      this.nameColumnIndex = TableBodyView.getNameColumnIndex(options.displayedColumns) || 0;

      this.accFocusedCell = options.accFocusedCell || {column: this.nameColumnIndex, row: 0};
      this.tableView = options.tableView;
    },

    events: {
      "keydown": "onKeyInView"
    },

    render: function () {
      this.triggerMethod('before:render', this);
      var headerCells = this.$el.parent().find('thead>tr>th');
      this._columnCount = headerCells.length;

      this.triggerMethod('render', this);
    },

    remove: function () {
      this.stopListening();
      this.undelegateEvents();
      return this;
    },

    currentlyFocusedElement: function () {
      if (!this.tableView.table) {
        return $();
      }
      if (this.accFocusedCell) {
        var model = this.collection.at(this.accFocusedCell.row);
        var detailRowsInfo = _accGetDetailRowInfo.call(this.tableView, model);

        if (detailRowsInfo.accFocusedViewIndex !== undefined) {
          return $();
        } else {
          var tableRowEl = $(this.tableView.table.row(this.accFocusedCell.row).node());
          var tableCellEl = tableRowEl.children()[this.accFocusedCell.column];
          var focusables = focusable.findFocusables(tableCellEl);
          return focusables.length === 1 ? $(focusables[0]) : $(tableCellEl);
        }
      } else {
        return $();
      }
    },

    onClickedCell: function (args) {
      this.accFocusedCell.row = args.rowIndex;
      this.accFocusedCell.column = args.colIndex;
      this._accSetFocusAfterTabableRegionActivated();
    },

    onKeyInView: function (event) {
      var model, detailRowsInfo;
      var focusedElement = $();
      if (this._getActiveInlineForm()) {
        return;
      }
      if (event.keyCode === 37) {
        if (i18n && i18n.settings.rtl) {
          while (this.accFocusedCell.column < this.displayedColumns.length - 1) {
            this.accFocusedCell.column++;
            if (this._isCurrentBodyCellFocusable()) {
              break;
            }
          }
        } else {
          while (this.accFocusedCell.column > 0) {
            this.accFocusedCell.column--;
            if (this._isCurrentBodyCellFocusable()) {
              break;
            }
          }
        }
        event.preventDefault();
        event.stopPropagation();
        this.trigger('closeOtherControls'); // force inline bar to close
        this._accSetFocusAfterTabableRegionActivated();
      } else {
        if (event.keyCode === 38) {

          event.preventDefault();
          event.stopPropagation();
          this.trigger('closeOtherControls'); // force inline bar to close

          model = this.collection.at(this.accFocusedCell.row);
          detailRowsInfo = _accGetDetailRowInfo.call(this.tableView, model);
          if (detailRowsInfo.accFocusedViewIndex === undefined) {

            if (this.accFocusedCell.row > 0) {
              this.accFocusedCell.row--;  // move focus into previous main row or it's detail rows
            } else {
              return; // can't move focus upwards anymore -> ignore the key
            }
          } else {
            if (detailRowsInfo.accFocusedViewIndex > 0) {
              detailRowsInfo.accFocusedViewIndex--;
            } else {
              delete detailRowsInfo.accFocusedViewIndex;
            }
          }

          this._accSetFocusAfterTabableRegionActivated();
        } else {
          if (event.keyCode === 39) {
            if (i18n && i18n.settings.rtl) {
              while (this.accFocusedCell.column > 0) {
                this.accFocusedCell.column--;
                if (this._isCurrentBodyCellFocusable()) {
                  break;
                }
              }
            } else {
              while (this.accFocusedCell.column < this.displayedColumns.length - 1) {
                this.accFocusedCell.column++;
                if (this._isCurrentBodyCellFocusable()) {
                  break;
                }
              }
            }
            event.preventDefault();
            event.stopPropagation();
            this.trigger('closeOtherControls'); // force inline bar to close
            this._accSetFocusAfterTabableRegionActivated();
          } else {
            if (event.keyCode === 40) {

              model = this.collection.at(this.accFocusedCell.row);
              detailRowsInfo = _accGetDetailRowInfo.call(this.tableView, model);
              var detailLastFocusedView = detailRowsInfo.accFocusedViewIndex;
              if (detailRowsInfo.accFocusedViewIndex === undefined &&
                  detailRowsInfo.views.length > 0) {
                detailRowsInfo.accFocusedViewIndex = -1;
              }
              while (focusedElement.length === 0) {
                if (detailRowsInfo.accFocusedViewIndex !== undefined &&
                    (detailRowsInfo.accFocusedViewIndex + 1) < detailRowsInfo.views.length) {

                  detailRowsInfo.accFocusedViewIndex = detailRowsInfo.accFocusedViewIndex + 1;
                } else {
                  if ((this.accFocusedCell.row + 1) < this.collection.length) {  // still more rows downwards
                    delete detailRowsInfo.accFocusedViewIndex;
                    this.accFocusedCell.row++;
                    model = this.collection.at(this.accFocusedCell.row);
                    if (model) {
                      detailRowsInfo = _accGetDetailRowInfo.call(this.tableView, model);
                    }
                  } else {
                    detailRowsInfo.accFocusedViewIndex = detailLastFocusedView;
                    break;
                  }
                }
                focusedElement = this.currentlyFocusedElement();
              }

              event.preventDefault();
              event.stopPropagation();
              this.trigger('closeOtherControls'); // force inline bar to close
              this._accSetFocusAfterTabableRegionActivated();
            } else {
              if (event.keyCode === 33) {
                this.accFocusedCell.row = 0;
                model = this.collection.at(this.accFocusedCell.row);
                detailRowsInfo = _accGetDetailRowInfo.call(this.tableView, model);
                delete detailRowsInfo.accFocusedViewIndex;  // main row in every case

                event.preventDefault();
                event.stopPropagation();
                this.trigger('closeOtherControls'); // force inline bar to close
                this._accSetFocusAfterTabableRegionActivated();
              } else {
                if (event.keyCode === 34) {
                  if (this.collection.length > 0) {
                    this.accFocusedCell.row = this.collection.length - 1;
                    model = this.collection.at(this.accFocusedCell.row);
                    detailRowsInfo = _accGetDetailRowInfo.call(this.tableView, model);
                    delete detailRowsInfo.accFocusedViewIndex;
                  } else {
                    this.accFocusedCell.row = 0;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                  this.trigger('closeOtherControls'); // force inline bar to close
                  this._accSetFocusAfterTabableRegionActivated();
                } else {
                  if (event.keyCode === 35) {
                    this.accFocusedCell.column = this.displayedColumns.length - 1;
                    event.preventDefault();
                    event.stopPropagation();
                    this.trigger('closeOtherControls'); // force inline bar to close
                    this._accSetFocusAfterTabableRegionActivated();
                  } else {
                    if (event.keyCode === 36) {
                      this.accFocusedCell.column = 0;
                      event.preventDefault();
                      event.stopPropagation();
                      this.trigger('closeOtherControls'); // force inline bar to close
                      this._accSetFocusAfterTabableRegionActivated();
                    } else {
                      if (event.keyCode === 113) {
                        model = this.collection.at(this.accFocusedCell.row);
                        if (model) {
                          this.startInlineFormForEdit(model);
                        }
                        event.preventDefault();
                        event.stopPropagation();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    _accSetFocusAfterTabableRegionActivated: function () {
      if (this._getActiveInlineForm()) {
        return;
      }
      var tdEl = this.currentlyFocusedElement();
      if (tdEl.length > 0) {
        var el = $(tdEl);
        this.trigger('changed:focus', this);
        if (this._isVisible(el)) {
          el.trigger('focus');
        }
      }
    },

    _isVisible: function (el) {
      return $(el).is(':visible');
    },

    _isCurrentBodyCellFocusable: function() {
      var column = this.displayedColumns[this.accFocusedCell.column];
      return !(column.name === 'description' && !this.hasCustomDescriptionColumn);
    }
  }, {
    getNameColumnIndex: function (displayedColumns) {
      if (!displayedColumns) {
        return undefined;
      }

      for (var colIdx = 0; colIdx < displayedColumns.length; colIdx++) {
        var column = displayedColumns[colIdx];
        if (column.isNaming) {
          return colIdx;
        }
      }
      return undefined;
    }
  });

  function _accGetDetailRowInfo(model) {
    var detailRowInfo;
    if (model) {
      detailRowInfo = this._detailRowViewsByModelId[model.id || model.get('id')];
    }
    if (!detailRowInfo) {
      return {views: []}; // return always a valid object
    } else {
      return detailRowInfo;
    }
  }

  return TableBodyView;
});
