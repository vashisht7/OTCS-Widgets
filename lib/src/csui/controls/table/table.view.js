/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone", "csui/lib/marionette",
  "csui/lib/jquery.dataTables.bootstrap/js/dataTables.bootstrap",
  "csui/lib/jquery.dataTables.tableTools/js/dataTables.tableTools",
  'i18n!csui/controls/table/impl/nls/lang', "csui/utils/log", "csui/utils/base",
  'csui/utils/focusable',
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  "csui/controls/table/cells/cell.factory",
  "csui/models/nodechildrencolumn",
  "csui/controls/progressblocker/blocker",
  'csui/utils/contexts/factories/connector',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/controls/checkbox/checkbox.view',
  'csui/controls/table/cells/select/select.view',
  'csui/controls/table/cells/searchbox/searchbox.view',
  'csui/controls/table/cells/searchbox/typeahead.searchbox.view',
  'csui/controls/table/inlineforms/inlineform.factory',
  'csui/controls/table/rows/metadata/metadatarow.view',
  'csui/controls/table/rows/error/errorrow.view',
  'csui/controls/table/impl/table.header.view',
  'csui/controls/table/impl/table.body.view',
  'csui/utils/accessibility',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/mixins/view.state/node.view.state.mixin',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/mixins/global.alert/global.alert.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'i18n!csui/controls/table/cells/toggledetails/impl/nls/lang',
  "css!csui/controls/table/impl/table",
  'csui/lib/perfect-scrollbar', 'csui/lib/jquery.mousehover',
  'csui/lib/jquery.scrollbarwidth', 'csui/lib/jquery.renametag'
], function (module, $, _, Backbone, Marionette, DataTables, TableTools,
    lang, log, base,
    focusable,
    PerfectScrollingBehavior,
    TabableRegionBehavior,
    cellViewFactory,
    NodeChildrenColumnModel,
    BlockingView,
    ConnectorFactory,
    DefaultActionController,
    CheckboxView,
    SelectCellView,
    SearchBoxView,
    TypeaheadSearchBoxView,
    inlineFormViewFactory,
    MetadataRowView,
    ErrorRowView,
    TableHeaderView,
    TableBodyView,
    Accessibility,
    ViewEventsPropagationMixin,
    NodeViewStateMixin,
    FilteredToolItemsCollection,
    ToolbarCommandController,
    GlobalAlertMixin,
    FieldsV2Mixin,
    toggleDetailsLang) {
  'use strict';

  log = log(module.id);

  var accessibleTable = Accessibility.isAccessibleTable();

  var TableView = Marionette.View.extend({

    className: function () {
      var className = 'csui-nodetable';
      if (accessibleTable) {
        className += ' csui-wrap-text';
      }
      return className;
    },

    constructor: function TableView(options) {
      this.accFocusedState = {focusView: 'tableBody', headerColumn: 0, body: {column: 0, row: 0}};
      options || (options = {});
      this.context = options.context;
      this.enableViewState = options.enableViewState && this.context &&
                             this.context.viewStateModel.get('enabled');
      this._allSelectedNodes = options.allSelectedNodes || new Backbone.Collection();

      this.expandedDetailRows = {};
      this._showEmptyViewText = true;

      this.columnHeadersVisible = true;
      this.columnsWithSearch = options.columnsWithSearch || [];
      _.each(this.columnsWithSearch, _.bind(function (c, i) {
        this.columnsWithSearch[i] = this.columnsWithSearch[i].toLowerCase();
      }, this));

      this.columnsWithTypeaheadSearchbox = _.keys(options.columnsWithTypeaheadSearchbox) || [];
      _.each(this.columnsWithTypeaheadSearchbox, _.bind(function (c, i) {
        this.columnsWithTypeaheadSearchbox[i] = this.columnsWithTypeaheadSearchbox[i].toLowerCase();
      }, this));

      this.searchBoxes = [];
      if (options.filterBy) {
        _.each(options.filterBy, _.bind(function (val, key) {
          if (options.collection.filters) {
            options.collection.filters[key] = val;
          }
        }, this));
      }
      if (options.actionItems && options.commands) {
        this.defaultActionController = new DefaultActionController({
          actionItems: options.actionItems,
          commands: options.commands
        });
        this.checkModelHasAction = this.defaultActionController.hasAction.bind(
            this.defaultActionController);
      } else {
        this.checkModelHasAction = function () {
          return true;
        };
      }

      this.additionalColumns = options.additionalColumns || [];
      if (!options.collection) {
        throw new Error("table.view options require a collection to be set");
      }

      Marionette.View.prototype.constructor.apply(this, arguments); // apply (modified)

      var defaultOptions = {
        enableSorting: true,
        selectColumn: true,
        haveToggleAllDetailsRows: true,
        haveDetailsRowExpandCollapseColumn: true,
        selectRows: "multiple",
        selectAllColumnHeader: true,
        nameEdit: true,
        maxColumnsDisplayed: 25,
        spacing: 'medium'  // possible values: 'narrow', 'middle', 'wide'
      };

      _.defaults(this.options, defaultOptions);
      switch (this.options.selectRows) {
      case 'single':
        this.options.selectAllColumnHeader = false;
        break;
      case 'multiple':
        break;
      default:
        this.options.selectRows = 'none';
        this.options.selectAllColumnHeader = false;
        this.options.selectColumn = false;
      }

      if (accessibleTable) {
        this.options.haveToggleAllDetailsRows = false;
        this.options.haveDetailsRowExpandCollapseColumn = false;
      }

      if (this.options.orderBy || this.enableViewState) {
        this.collection.setOrder(this.options.orderBy, false);
        delete this.options.orderBy;  // from now on, use the order stored with the collection
      } else if (!this.options.collection.orderBy) {
        this.collection.setOrder("name asc", false);
      }

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      this.connector = this.options.connector;
      if (!this.connector) {
        this.connector = this.context.getObject(ConnectorFactory);
      }

      this.columns = this.options.columns;
      if (!this.columns) {
        this.columns = this.collection.columns;
        if (!this.columns) {
          throw new Error("table.view options require columns or collection.columns to be set");
        }
      }

      this._ViewCollection = Backbone.Collection.extend({
        model: this.collection.model
      });

      this.selectedChildren = new this._ViewCollection();
      this.listenTo(this.selectedChildren, 'reset', function () {
        this._showOrHideAlternativeHeaderView();
      });
      this.listenTo(this.collection, "reset", this._handleModelsReset)
          .listenTo(this.collection, "update", this._handleModelsUpdate)
          .listenTo(this.collection, "remove", this._handleModelRemove)
          .listenTo(this.collection, "change", this.updateRow)
          .listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", this.unblockActions)
          .listenTo(this.collection, "sync", this._handlePendingFilter)
          .listenTo(this.collection, "sync", this._handleResponseSortBy)
          .listenTo(this.collection, 'new:page', this.resetScrollToTop)
          .listenTo(this.collection, "reset", this._updateSelectedChildren)
          .listenTo(this.collection, "remove", this._updateSelectedChildren)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", this.unblockActions)
          .listenTo(this.columns, 'reset remain', this._handleColumnsReset);
      if (this.enableViewState) {
        this.listenTo(this.context.viewStateModel, 'change:state', this.onViewStateChanged)
            .listenTo(this.collection, 'paging:change', this._pagingChanged)
            .listenTo(this.collection, 'limits:change', this._pagingChanged);
      }

      this.listenTo(this.collection, 'orderBy:change', this._collectionOrderByChanged)
          .listenTo(this.collection, 'filter:change', this._collectionFilterChanged)
          .listenTo(this.collection, 'filter:clear', this._collectionFilterCleared);

      if (this.options.tableColumns) {
        this.listenTo(this.options.tableColumns, 'reset update', this._handleTableColumnsReset);
      }

      if (this.context) {
        this.listenTo(this.context, 'request:perspective', this._handlePerspectiveContextRequest)
            .listenTo(this.context, 'request request:perspective', this._handleContextRequest)
            .listenTo(this.context, 'sync', this._handleContextSync)
            .listenTo(this.context, 'sync error error:perspective', this._handleContextFinish);
      }

      this.listenTo(this.collection, "reset", function () {
        if (!this.isRendered) {
          return;
        }
        if (!this.table) {
          return;
        }
        updateSelectAllCheckbox.call(this);
      });

      this.listenTo(this.collection, "reset", this.setFocusToFirstRow)
          .listenTo(this.collection, "add", this.setFocusToFirstRow)
          .listenTo(this.collection, "remove", this.setFocusToFirstRow)
          .listenTo(this.collection, "destroy", this.setFocusToFirstRow);
      if (this.collection.fetching) {
        this.blockActions();
        this.disableEmptyViewText();
      }

      this.disableEmptyViewText();  // switch empty text off initially

      this.listenTo(this, 'dom:refresh', this._handleDomRefresh);

      this.listenTo(this, "clickDefaultPreAction", function (event) {
        this.triggerMethod('execute:defaultAction', event.node);
      });
      if (this.collection.node) {
        this.listenTo(this.collection.node, "change:id", this.setFocusToFirstRow);
        this.listenTo(this.collection.node, "change:id", this._clearSearchBoxes);
        this.listenTo(this.collection.node, "change:id", this._clearExpandedRows);
        this.listenTo(this.collection.node, "change:id", function () {
        });
      }

      var tableView = this;

      if (!accessibleTable) {
        this.resizeHandler = _.debounce(_.bind(this._adjustColumnsIfViewResized, this), 50);
        addEventListener('resize', this.resizeHandler);
      }

      this.listenTo(this, 'before:destroy', function () {
        if (!accessibleTable) {
          removeEventListener('resize', this.resizeHandler);
        }
        destroyTable.call(this);
      });

      if (this.options.inlineBar) {
        this._setInlineBarEvents();
      }
      this.prepareForGlobalAlert();
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: 'tbody',
        suppressScrollX: true
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    events: {"keydown": "onKeyInView"},

    render: function () {
      if (this._renderingTableDelayedAsync) {
        log.debug("render: currently in async render -> skip") && console.log(log.last);
        return;
      }

      this._initializeLocalizableLabels();

      if (!(this.columns && this.columns.length)) {
        if (this.collection && this.collection.length) {
          log.debug("No columns -> skip render") && console.log(log.last);
          this._renderFake();
        } else {
          log.debug("No columns and no rows -> render empty text") && console.log(log.last);
          this._renderEmpty();
        }
        return;
      }

      log.debug("render") && console.log(log.last);
      this._startTableRendering = new Date();
      performance.mark('start_table_render');

      this._ensureViewIsIntact();

      this._inlineBarShouldDestroy();
      if (this.table) {
        saveStateBeforeRebuild.call(this);
        cleanUpTableEventListeners.call(this);
        destroyTable.call(this);
      }

      this._getColumns();
      this.updateCollectionParameters();

      if (this._canMeasureTableSize()) {
        this._renderTableDelayed = false;
        this._preRenderTable();
        this._renderTable();
      } else {
        this._renderTableDelayed = true;
        this._renderingTableDelayedAsync = false;
        this._renderFake();
      }
    },

    onBeforeRender: function () {
      this._startBeforeTableRendering = new Date();
    },

    onRender: function () {
      var endTableRendering = new Date();
      var diff = endTableRendering - this._startBeforeTableRendering;
      if (this._startTableRendering) {
        var diffTotal = endTableRendering - this._startTableRendering;
        log.debug(
            "TIMINGS: rendering totally " + diffTotal + "ms. beforeRender...render " + diff +
            "ms") && console.log(log.last);

        performance.mark('end_table_render');
        performance.measure('table_render', 'start_table_render', 'end_table_render');

      } else {
        log.debug("TIMINGS: beforeRender...render took " + diff + "ms") && console.log(log.last);
      }
      delete this._startTableRendering;
    },

    _handleDomRefresh: function () {
      if (this._renderingTableDelayedAsync) {
        log.debug("onDomRefresh: currently in async render -> skip") && console.log(log.last);
      } else {
        if (this._renderTableDelayed) {
          log.debug("onDomRefresh -> need to render table delayed") && console.log(log.last);
          this._startTableRendering = new Date();

          if (this._canMeasureTableSize()) {
            this._renderingTableDelayedAsync = true;

            log.debug("onDomRefresh: el is visible -> start rendering (async)") &&
            console.log(log.last);

            var self = this;
            setTimeout(function () {
              self._renderTableDelayed = false;
              self._renderingTableDelayedAsync = false;
              self._preRenderTable();
              self._renderTable();
            });
          } else {
            if (document.body.contains(this.el)) {
              log.debug("onDomRefresh: el is in DOM but still not measurable -> skip render") &&
              console.log(log.last);
            } else {
              log.warn("WARNING: onDomRefresh: el is not in DOM and therefore not measurable ->" +
                       " skip render (dom:refresh should not be triggered on table.view if" +
                       " table.view is not attached to the DOM)") &&
              console.log(log.last);
            }
          }
        } else {
          log.debug("dom:refresh -> checking if columns must be adjusted") &&
          console.log(log.last);
          this._adjustColumnsIfViewResized();
        }

        if (this.activeInlineForm) {
          this.activeInlineForm.triggerMethod('dom:refresh', this.activeInlineForm);
        }
      }
    },

    _canMeasureTableSize: function () {
      var isVisible = document.body.contains(this.el) &&
                      (this.el.offsetWidth || this.el.offsetHeight ||
                       this.el.getClientRects().length);
      return isVisible;
    },

    _renderFake: function () {
      log.debug("_renderFake") && console.log(log.last);
      this.triggerMethod('before:render', this);
      this.isRendered = true;
      this.triggerMethod('render', this);
    },

    _renderEmpty: function () {
      log.debug("_renderEmpty") && console.log(log.last);
      this.triggerMethod('before:render', this);
      this.showOrHideZeroRecordsMessage();
      this.isRendered = true;
      this.triggerMethod('render', this);
    },

    _preRenderTable: function () {
      log.debug("_preRenderTable") && console.log(log.last);

      this.isRendered = false;
      this.triggerMethod('before:render', this);

      if (this._extraWidthForToolbarItems === undefined) {
        this._extraWidthForToolbarItems = 0;
        if (this.options.inlineBar && this.options.inlineBar.viewClass) {
          var inlineActionBarViewClass = this.options.inlineBar.viewClass;
          if (inlineActionBarViewClass.estimateWidthForToolbarItems) {
            var minNumberOfToolbarItems = 2;
            var fontSize = 13;
            this._extraWidthForToolbarItems = Math.floor(
                inlineActionBarViewClass.estimateWidthForToolbarItems(
                    minNumberOfToolbarItems, fontSize));
          }
        }
      }

      this._setSpacing();
      var tableWidth = this.$el.outerWidth();
      tableWidth -= $.scrollbarWidth();
      this.maxColumnsDisplayed = this._calculateMaxColumnsDisplayed(tableWidth);

      log.debug("Table width is " + tableWidth + ". Displaying max. " + this.maxColumnsDisplayed +
                " columns") && console.log(log.last);

      this._setColumnsWrappedByAvailableWidth();

      log.debug("Columns displayed: " + this.displayedColumns.length + ", wrapped: " +
                this.wrappedColumns.length) && console.log(log.last);
    },

    _renderTable: function () {
      log.debug("_renderTable") && console.log(log.last);
      this.$el.addClass("csui-nodetable");

      createTable.call(this);
      this.accFocusedState.body.row = 0;
      this.accFocusedState.body.column = TableBodyView.getNameColumnIndex(this.displayedColumns) ||
                                         0;

      this.showOrHideZeroRecordsMessage();
      if (this.$el.parent().length > 0) {
        var displayStyle = this.$el.parent().css('display');
        if (displayStyle.indexOf('flex') < 0) {
          this.$el.addClass("csui-not-in-flex-container");
        }
      }
      this.$el.removeClass('csui-not-ready');
      this._adjustColumns();

      this._previousViewWidth = this._calculateActualTableWidth();  // for _viewChanged with threshold
      this.isRendered = true;

      this.triggerMethod('render', this);
    },
    _drawTable: function () {
      if (this.table) {
        this._inlineBarShouldDestroy();
        this.triggerMethod('before:render', this);
        this.showOrHideZeroRecordsMessage();
        this.table.draw();
        this.triggerMethod('render', this);
      } else {
        this.render();
      }
    },

    _calculateMaxColumnsDisplayed: function (maxWidth) {
      var averageWidth = 90; // assume an average of this amount of px width per column
      var maxColumnsDisplayed = 0, usedWidth = 0, widthFactor, width;

      _.each(this.allColumns, function (column) {
        if (column.attributes) {
          if (column.attributes.permanentColumn === true) {
            widthFactor = column.attributes && column.attributes.widthFactor;
            width = widthFactor ? averageWidth * widthFactor : averageWidth;
            if (column.isNaming) {
              width += this._extraWidthForToolbarItems;
            }
            usedWidth += width;
            maxColumnsDisplayed++;
          }
        }
      }, this);
      for (var colno = 0; colno < this.allColumns.length; colno++) {
        var column = this.allColumns[colno], selectorWidth, childrenInNthColumn;
        if (column.attributes) {
          if (!column.attributes.permanentColumn) {
            widthFactor = column.attributes && column.attributes.widthFactor;
            selectorWidth = averageWidth;
            width = widthFactor ? selectorWidth * widthFactor : selectorWidth;
            usedWidth += width;
            if (usedWidth > maxWidth) {
              break;
            }
            maxColumnsDisplayed++;
          }
        }
      }
      if (maxColumnsDisplayed > this.options.maxColumnsDisplayed) {
        maxColumnsDisplayed = this.options.maxColumnsDisplayed;
      }
      if (maxColumnsDisplayed < 1) {
        maxColumnsDisplayed = 1;
      }
      return maxColumnsDisplayed;
    },

    _getColumns: function () {
      this.trigger("buildingColumnDefinitions", {
        sender: this
      });

      var cols = [];
      if (this.options.tableColumns) {
        var tableColumns = this.options.tableColumns.deepClone(); // use fresh collection every time
        var columnModelsByKey = {};
        var clientNamingKey, serverNamingKey;
        this.columns.each(function (nodeColumnModel) {
          var key = nodeColumnModel.get("column_key");
          var order = nodeColumnModel.get("definitions_order");
          if (nodeColumnModel.get("isNaming") === true) {
            serverNamingKey = key;
            nodeColumnModel.unset('isNaming', {silent: true});
          }
          columnModelsByKey[key] = nodeColumnModel;
          if (nodeColumnModel.get("type") && order) {
            var tableColumnToMergeWithServerColumn = tableColumns.findWhere({key: key});
            if (tableColumnToMergeWithServerColumn) {
              if (tableColumnToMergeWithServerColumn.get('isNaming') === true) {
                clientNamingKey = tableColumnToMergeWithServerColumn.get("key");
              }
              var sequence = tableColumnToMergeWithServerColumn.get('sequence');
              var mergedColumnAttributes = _.extend({sequence: sequence},
                  nodeColumnModel.attributes);
              tableColumnToMergeWithServerColumn.set(mergedColumnAttributes);
            } else {
              var keyRegistedInCellView = cellViewFactory.hasCellViewByOtherKey(key);
              if (!keyRegistedInCellView) {  // key not registered
                tableColumns.add({
                  key: key,
                  sequence: order,
                  permanentColumn: false
                });
              }
            }
          }
        }, this);
        var namingKey = clientNamingKey || serverNamingKey || 'name';
        var sortedColumns = [];
        tableColumns.each(function (tableColumn) {
          var column_key = tableColumn.get('key');
          if (column_key === namingKey) {
            tableColumn.set('isNaming', true);
          }
          if (columnModelsByKey[column_key]) {
            var colDef = columnModelsByKey[column_key];
            if (column_key === namingKey) {
              colDef.set('isNaming', true); // needed for factory to return cell view for naming column
            }
            var CellView = cellViewFactory.getCellView(colDef);
            var propertiesToMerge = ['permanentColumn', 'noTitleInHeader', 'titleIconInHeader',
              'title', 'align', 'widthFactor', 'isNaming'];
            _.each(propertiesToMerge, function (propName) {
              var propToMerge = tableColumn.get(propName);
              if (propToMerge) {
                colDef.set(propName, propToMerge, {silent: true});
              } else {
                if (CellView[propName]) {
                  colDef.set(propName, CellView[propName], {silent: true});
                }
              }
            });
            sortedColumns.push(colDef);
          }
        }, this);
        if (sortedColumns.length > 0) {
          sortedColumns = getAdditionalColumns(this, sortedColumns);
        }

        cols = _.map(sortedColumns, function (definition) {
          var propertyName = definition.get("column_key"),
              CellView = cellViewFactory.getCellView(definition),
              accessibleText = definition.get('title') || definition.get('name');

          if (!accessibleText && propertyName !== '_toggledetails') {
            console.log("No accessible text for column header " + propertyName);
          }

          var column = {
            CellView: CellView,
            name: propertyName,
            noTitleInHeader: definition.get('noTitleInHeader'),
            titleIconInHeader: definition.get('titleIconInHeader'),
            isNaming: definition.get('isNaming'), // if true, use this column for
            title: accessibleText,
            orderable: !!definition.get("sort"),
            filterable: !!definition.get("filter"),
            className: CellView.columnClassName,
            defaultAction: definition.get("default_action"),
            contextualMenu: definition.get("contextual_menu"),
            data: function (source, type) {
              if (type === 'orderBy') {
                return definition.get('sort_key') ||
                       definition.get("column_key");
              }
              if (type === 'filterBy') {
                return definition.get('filter_key') ||
                       definition.get("column_key");
              }
              if (type === 'set') {
                throw new Error('Setting column value not implemented');
              } else {
                return CellView.getValue(source, column);
              }
            },

            render: function () {
              return '';
            }
          };

          var alignment = definition.get("align");
          if (alignment) {
            if (window.csui && window.csui.rtl) {
              alignment === "left" && (alignment = "right") ||
              alignment === "right" && (alignment = "left");
            }
            column.className += " csui-align-" + alignment;
          }
          if (definition.attributes) {
            column.attributes = column.attributes || {};
            _.extend(column.attributes, definition.attributes);
          }
          return column;
        }, this);
      }

      this.allColumns = cols;
      this.displayedColumns = [];
      this.wrappedColumns = [];
      _.each(cols, function (colDef) {
        if (colDef.attributes && colDef.attributes.permanentColumn === true) {
          colDef.columnWrapped = false;
          this.displayedColumns.push(colDef);
        }
      }, this);

      this.trigger("columnDefinitionsBuilt", {
        sender: this, columns: cols
      });
    },
    _setColumnsWrappedByAvailableWidth: function () {

      if (this.allColumns.length &&
          (this.maxColumnsDisplayed || this.options.maxColumnsDisplayed)) {

        var maxColumnsDisplayed = this.maxColumnsDisplayed || this.options.maxColumnsDisplayed;

        this.displayedColumns = [];
        this.wrappedColumns = [];
        var colCount = 0;
        _.each(this.allColumns, function (colDef) {
          if (colDef.attributes && colDef.attributes.permanentColumn === true) {
            colDef.columnWrapped = false;
            colCount++;
          }
        }, this);

        if (accessibleTable) {
          this.displayedColumns = _.clone(this.allColumns);
          this.wrappedColumns = [];
        } else {
          _.each(this.allColumns, function (colDef) {
            if (!colDef.attributes || colDef.attributes.permanentColumn !== true) {
              colCount++;
              if (maxColumnsDisplayed) {
                colDef.columnWrapped = (colCount > maxColumnsDisplayed);
              } else {
                colDef.columnWrapped = false; // have no maxColumnsDisplayed -> don't wrap
              }
            }
          }, this);

          this.displayedColumns = _.where(this.allColumns, {columnWrapped: false});
          this.wrappedColumns = _.where(this.allColumns, {columnWrapped: true});
        }
      }
    },

    _calculateActualTableWidth: function () {
      var actualWidth = this.$el.outerWidth();
      var tbodyEl = this.$el.find('tbody');
      if (_.size(tbodyEl) > 0) {
        var h1 = tbodyEl[0].scrollHeight;
        var h2 = tbodyEl.innerHeight();
        if (h1 > h2) {
          actualWidth -= $.scrollbarWidth();
        }
      }
      return actualWidth;
    },

    _adjustColumnsIfViewResized: function () {
      if (this.isRendered && this.columns && this.columns.length > 0) {  // table must be
        var actualWidth = this._calculateActualTableWidth();
        if (actualWidth !== this._previousViewWidth) {
          var upperLimit = this._previousViewWidth + 100;
          var lowerLimit = this._previousViewWidth - 100;

          if (actualWidth > upperLimit || actualWidth < lowerLimit) {
            var maxColumns = this._calculateMaxColumnsDisplayed(actualWidth);
            if (maxColumns !== this.maxColumnsDisplayed) {
              log.debug("_adjustColumnsIfViewResized: maxColumnsDisplayed differ -> render new" +
                        " table") && console.log(log.last);
              this.render();
            } else {
              log.debug("_adjustColumnsIfViewResized: maxColumnsDisplayed equal -> adjust" +
                        " columns") && console.log(log.last);
              this._adjustColumns();
            }
            this._previousViewWidth = actualWidth;
          } else {
            log.debug("_adjustColumnsIfViewResized: table width changed minimally -> adjust" +
                      " columns") && console.log(log.last);
            this._adjustColumns();
          }
        } else {
          log.debug("_adjustColumnsIfViewResized: width not changed -> skip") &&
          console.log(log.last);
        }
      }
    },

    enableEmptyViewText: function () {
      this._showEmptyViewText = true;
    },

    disableEmptyViewText: function () {
      this._showEmptyViewText = false;
    },

    _updateSelectedChildren: function () {
      if (!this.isRendered) {
        return;
      }
      if (this.deletingNodes) {
        return;
      }
      if (!this.table) {
        return;
      }
      var selectedChildren = this.getSelectedChildren();
      this.selectedChildren.reset(selectedChildren);
    },

    _setInlineBarEvents: function () {
      this.listenTo(this, 'closeOther', this._inlineBarShouldDestroy);
      if (this.options.inlineBar.options.forceInlineBarOnClick) {
        this.listenTo(this, 'row:clicked', function (args) {
          if (this.inlineBarView) {
            var oldModelId = this.inlineBarView.model.get('id');
            var newModelId = args.node.get('id');
            if (oldModelId === newModelId) {
              return;
            }
          }
          if (this.options.inlineBar.viewClass) {
            this._destroyOldAndCreateNewInlineBarWithoutDelay(args);
          }
        });
      } else {
        if (this.options.inlineBar.options.showInlineBarOnHover) {
          this.listenTo(this, 'enterTableRow', this._destroyOldAndCreateNewInlineBarWithDelay);
          this.listenTo(this, 'leaveTableRow', this._inlineBarShouldDestroy);
        }
      }
      this.listenTo(this.collection, "reset", this._destroyInlineBar);
      if (this.collection.node) {
        this.listenTo(this.collection.node, 'change:id', this._destroyInlineBar);
      }
    },

    _showInlineBar: function (args) {
      var showInlineActionBar = this._allSelectedNodes.length === 0 &&
                                this.getSelectedChildren().length === 0;
      if (!showInlineActionBar) {
        return;
      }
      if (this.inlineBarView) {
        this._savedHoverEnterArgs = args;
      } else {
        this._savedHoverEnterArgs = null;

        this.inlineBarView = new this.options.inlineBar.viewClass(_.extend({
              context: this.options.context,
              originatingView: this.options.originatingView,
              commands: this.defaultActionController.commands,
              model: args.node
            }, this.options.inlineBar.options)
        );
        this.listenToOnce(this.inlineBarView, 'destroy', function () {
          if (this.inlineBarView) {
            this.stopListening(this.inlineBarView);
          }
          if (this._savedHoverEnterArgs) {
            this._destroyOldAndCreateNewInlineBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);

        var nameCell = this.getNameCell(args.target);
        if (nameCell && nameCell.length === 1) {
          var inlineBarDiv = nameCell.find('.csui-table-cell-name-appendix');
          var inlineBarRegion = new Marionette.Region({el: inlineBarDiv});
          inlineBarRegion.show(this.inlineBarView);
          if (this.inlineBarView.$el.parent().length > 0) {
            nameCell.addClass('csui-table-actionbar-shown');
          }
        }
      }
    },

    _destroyOldAndCreateNewInlineBarWithDelay: function (args) {
      this._inlineBarShouldDestroy();
      if (this._showInlineBarTimeout) {
        clearTimeout(this._showInlineBarTimeout);
      }
      var self = this;
      var timeout = 750;
      this._showInlineBarTimeout = setTimeout(function () {
        self._showInlineBarTimeout = null;
        if (!self.lockedForOtherContols) {
          self._showInlineBar.call(self, args);
        }
      }, timeout);
    },

    _inlineBarShouldDestroy: function () {
      if (this._showInlineBarTimeout) {
        clearTimeout(this._showInlineBarTimeout);
        this._showInlineBarTimeout = null;
      }
      this._destroyInlineBar();
    },

    _destroyOldAndCreateNewInlineBarWithoutDelay: function (args) {
      this._inlineBarShouldDestroy();
      if (!this.lockedForOtherContols) {
        this._showInlineBar.call(this, args);
      }
    },

    _destroyInlineBar: function () {
      if (this.inlineBarView) {
        var inlineBarEl = this.inlineBarView.$el.parent();
        inlineBarEl.closest('.csui-table-actionbar-shown').removeClass(
            'csui-table-actionbar-shown');
        this.inlineBarView.destroy();
        this.inlineBarView = null;
      }
    },

    _clearExpandedRows: function () {
      if (!this.isRendered) {
        return;
      }
      this.expandedDetailRows = {};
    },

    onKeyInView: function (event) {
      if (event.keyCode === 9) {
        if (this.activeInlineForm) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (event.shiftKey) {
          if (this.accFocusedState.focusView === 'tableBody') {
            event.preventDefault();
            event.stopPropagation();

            this.accFocusedState.focusView = 'tableHeader';
            this.trigger('changed:focus');
            this.currentlyFocusedElement().trigger('focus');
          }
        } else {
          if (this.accFocusedState.focusView === 'tableHeader') {
            event.preventDefault();
            event.stopPropagation();

            this.accFocusedState.focusView = 'tableBody';
            this.trigger('changed:focus');
            this.currentlyFocusedElement().trigger('focus');
          }
        }
      }
    },

    currentlyFocusedElement: function () {
      if (this.accFocusedState.focusView === 'tableHeader') {
        if (this.tableCaptionView) {
          return this.tableCaptionView.currentlyFocusedElement();
        }
      } else {
        if (this.tableBodyView) {
          return this.tableBodyView.currentlyFocusedElement();
        }
      }
      return $();
    },

    setFocusToFirstRow: function () {
      if (!this.isRendered) {
        return;
      }
      this.accFocusedState.body.row = 0;
      this.accFocusedState.body.column = TableBodyView.getNameColumnIndex(this.displayedColumns) ||
                                         0;
    },

    renderError: function () {
      if (!this.table) {
        cleanPlaceholder.call(this);
        $("<div></div>", {id: "message"}).html(base.MessageHelper.toHtml()).appendTo(this.$el);
      }
    },

    _plugHeaderBodyViews: function () {
      var self = this;

      this.tableCaptionView = new TableHeaderView({
        el: this.$('thead'),
        displayedColumns: this.displayedColumns,
        searchBoxes: this.searchBoxes,
        _getActiveInlineForm: _.bind(function () {
          return this.activeInlineForm;
        }, this),
        accFocusedColumn: this.accFocusedState.headerColumn,
        accSearchFocused: this.accFocusedState.accSearchFocused
      });

      this.propagateEventsToViews(this.tableCaptionView);

      this.tableCaptionView.listenTo(this.tableCaptionView, 'closeOtherControls', function () {
        self.trigger('closeOther');
      });
      this.tableCaptionView.listenTo(this.tableCaptionView, 'sorting:toggle',
          function (columnIndex) {
            if (self.displayedColumns[columnIndex].bSortable) {
              var direction = 'asc';
              var currentOrder = self.table.order();
              if (_.isArray(currentOrder) && currentOrder.length > 0) {
                var sortedColumnIndex = currentOrder[0][0];
                var sortedColumnSortDirection = currentOrder[0][1];
                if (sortedColumnIndex === columnIndex &&
                    sortedColumnSortDirection === direction) {
                  direction = 'desc';
                }
              }
              self.table.order([columnIndex, direction]).draw();
            }
          });
      this.tableCaptionView.listenTo(this.tableCaptionView, 'changed:focus', function () {
        self.accFocusedState.focusView = 'tableHeader';
        self.trigger('changed:focus');
      });
      this.tableCaptionView.render();
      Marionette.triggerMethodOn(this.tableCaptionView, 'before:show');
      Marionette.triggerMethodOn(this.tableCaptionView, 'show');

      this.tableBodyView = new TableBodyView({
        el: this.$('tbody'),
        collection: this.collection,
        displayedColumns: this.displayedColumns,
        _getActiveInlineForm: _.bind(function () {
          return this.activeInlineForm;
        }, this),
        startInlineFormForEdit: _.bind(this.startInlineFormForEdit, this),
        accFocusedCell: this.accFocusedState.body,
        tableView: this
      });
      this.propagateEventsToViews(this.tableBodyView);

      this.tableBodyView.listenTo(this.tableBodyView, 'closeOtherControls', function () {
        self.trigger('closeOther');
      });
      this.tableBodyView.listenTo(this.tableBodyView, 'changed:focus', function () {
        self.accFocusedState.focusView = 'tableBody';
        self.trigger('changed:focus');
      });

      this.tableBodyView.render();
      Marionette.triggerMethodOn(this.tableBodyView, 'before:show');
      this.tableBodyView.triggerMethod('show');
    },

    _destroyTableHeaderAndBodyViews: function () {
      if (this.tableCaptionView) {
        this.accFocusedState.headerColumn = this.tableCaptionView.accFocusedColumn;
        this.accFocusedState.accSearchFocused = this.tableCaptionView.accSearchFocused;
        this.tableCaptionView.destroy();
        this.tableCaptionView = null;
      }
      if (this.tableBodyView) {
        this.tableBodyView.destroy();
        this.tableBodyView = null;
      }
    },
    setDeletingNodesState: function (state) {
      this.deletingNodes = state;
    },

    _handleContextRequest: function () {
      if (!this._fetchingContext) {
        this._fetchingContext = true;
        this._columnsReset = false;
        this._collectionReset = false;
        if (this.context.perspective && !this._fetchingPerspectiveContext) {
          this._columnsReset = this.columns.length > 0;
        }
      }
    },

    _handlePerspectiveContextRequest: function () {
      this._fetchingPerspectiveContext = true;
    },

    _handleContextSync: function () {
      if (!this._fetchingContext) {
        return;
      }
      this._fetchingContext = false;
      if (this._columnsReset) {
        log.debug("_handleContextSync: columns reset -> full render") && console.log(log.last);
        this.render();
      } else if (this._collectionReset && this.isRendered) {
        log.debug("_handleContextSync: collection reset -> draw") && console.log(log.last);
        this._drawTable();
      }
    },

    _handleContextFinish: function () {
      this._fetchingContext = false;
      this._fetchingPerspectiveContext = false;
    },
    _handleTableColumnsReset: function () {
      if (this._fetchingContext) {
        this._columnsReset = true;
        log.debug("_handleTableColumnsReset: fetching -> skip") && console.log(log.last);
      } else {
        log.debug("_handleTableColumnsReset -> full render") && console.log(log.last);
        this.render();
      }
    },

    _handleColumnsReset: function () {
      if (this._fetchingContext) {
        this._columnsReset = true;
        if (this._collectionReset) {
          log.debug("_handleColumnsReset: fetching -> collection was reset -> handleContextSync") &&
          console.log(log.last);
          this._handleContextSync();
        } else {
          log.debug("_handleColumnsReset: fetching -> skip") && console.log(log.last);
        }
      } else {
        log.debug("_handleColumnsReset -> full render") && console.log(log.last);
        this.render();
      }
    },

    _handleModelsReset: function () {
      this.enableEmptyViewText();
      if (this._fetchingContext) {
        this._collectionReset = true;
        if (this._columnsReset) {
          log.debug("ModelsReset: fetching and columns reset -> handleContextSync") &&
          console.log(log.last);
          this._handleContextSync();
        } else {
          log.debug("ModelsReset: fetching -> skip") && console.log(log.last);
        }
      } else {
        if (this.isRendered) {
          log.debug("ModelsReset: -> draw") && console.log(log.last);
          this._drawTable();
        } else {
          log.debug("ModelsReset: table not rendered -> full render") && console.log(log.last);
          this.render();
        }
      }
    },

    _handleModelsUpdate: function (collection, options) {
      if (!this.isRendered) {
        return;
      }
      if (collection.node && (collection.node.get("versionable") ||
                              collection.node.get("versionable") === null)) {
        collection.node.fetch({refreshCache: true});
      }
      var models = options.changes.added;
      if (models.length > 0 && this.table) {

        _.each(models, function (model) {
          model.unset(SelectCellView.isSelectedModelAttributeName);
        });
      }
      log.debug("_handleModelsUpdate: -> draw") && console.log(log.last);
      this._drawTable();
    },

    _handleModelRemove: function (model) {
      if (!this.isRendered) {
        return;
      }
      if (this.deletingNodes === true) {
        if (model) {
          var targetIdx;
          this.table.rows(function (idx, data, node) {
            if (data.get('id') === model.get('id')) {
              targetIdx = idx;
              return true;
            } else {
              return false;
            }
          }).data();

          if (targetIdx !== undefined) {
            $(this.$el.find(this.table.row(targetIdx).node())).hide();
          }
        }
      } else {
        log.debug("_handleModelRemove: -> draw") && console.log(log.last);
        this._drawTable();
      }
    },
    updateRow: function (model) {
      if (!(this.isRendered && this.table)) {
        return;
      }

      var idx = this.collection.indexOf(model);
      if (idx === undefined) {
        return; // don't update if model can't be found in the collection (caller mistake)
      }

      if (this.table) {
        var $row = $(this.table.row(idx).node());
        var detailRows = this.table.row(idx).child();

        if (_.keys(model.changed).length === 1) {
          if (model.changed[SelectCellView.isSelectedModelAttributeName] != null) {
            var isSelected = model.get(SelectCellView.isSelectedModelAttributeName);
            if (isSelected) {
              $row.addClass('binf-active');
              _.each(detailRows, function (detailRow) {
                $(detailRow).addClass('binf-active');
              });
            } else {
              $row.removeClass('binf-active');
              _.each(detailRows, function (detailRow) {
                $(detailRow).removeClass('binf-active');
              });
            }
            updateSelectAllCheckbox.call(this);
            return;
          }
          if (model.changed.csuiDelayedActionsRetrieved != null) {
            return;
          }
        }
        if (model.get('isCut') === true) {
          $row && $row.addClass('csui-cut-row');
          detailRows && detailRows.addClass('csui-cut-row');
        } else {
          $row && $row.removeClass('csui-cut-row');
          detailRows && detailRows.removeClass('csui-cut-row');
        }
      }

      if (this.activeInlineForm && this.activeInlineForm.model !== model) {
        this.cancelAnyExistingInlineForm({silent: true});
      }
      var currentScollPosition = this.$('tbody').scrollTop();

      log.debug("updateRow: -> draw") && console.log(log.last);
      this.triggerMethod('before:render');
      this.table.row(idx).invalidate();
      this.table.draw();
      this.$('tbody').scrollTop(currentScollPosition);
      this.triggerMethod('render');
      if (!this.table) {
        return;
      }

      if (this.activeInlineForm) {
        this.activeInlineForm.triggerMethod('dom:refresh', this.activeInlineForm);
      }
      this._adjustColumns();  // recalculate column widths after redrawing table
    },
    onAfterShow: function () {
      this._adjustColumns();
    },

    getNameCell: function (nRow) {
      var nameColumnIdx = TableBodyView.getNameColumnIndex(this.displayedColumns);
      if (nameColumnIdx === undefined) {
        return undefined;
      }
      var nameCell = $(nRow).children()[nameColumnIdx];
      return $(nameCell);
    },
    updateCollectionParameters: function () {
      var collection = this.collection,
          context = this.context,
          supportsFields = collection.makeFieldsV2,
          supportsExpand = collection.makeExpandableV2,
          fields = {},
          expands = {};

      if (!this.collection.setFields) {
        return;
      }
      if ((supportsFields || supportsExpand) &&
          collection.getResourceScope && collection.setResourceScope) {
        if (this._originalCollectionScope) {
          collection.setResourceScope(this._originalCollectionScope);
        } else {
          this._originalCollectionScope = collection.getResourceScope();
        }
      }
      _.each(this.allColumns, function (column) {
        var CellView = column.CellView;
        if (CellView) {
          if (supportsFields && CellView.getModelFields) {
            var field = CellView.getModelFields({
              collection: collection,
              context: context,
              column: column
            });
            if (field) {
              FieldsV2Mixin.mergePropertyParameters(fields, field);
            }
          }
          if (supportsExpand && CellView.getModelExpand) {
            var expand = CellView.getModelExpand({
              collection: collection,
              context: context,
              column: column
            });
            if (expand) {
              FieldsV2Mixin.mergePropertyParameters(expands, expand);
            }
          }
          if (CellView.updateCollectionParameters) {
            CellView.updateCollectionParameters({
              collection: collection,
              context: context,
              column: column
            });
          }
        }
      }, this);
      if (!_.isEmpty(fields)) {
        collection.setFields(fields);
      }
      if (!_.isEmpty(expands)) {
        collection.setExpand(expands);
      }
    },

    clearFilter: function (refresh, filter) {
      if (this.table) {
        if (filter && !$.isEmptyObject(this.options.filter)) {
          this.options.filter = _.omit(this.options.filter,
              filter.split(","));
        }
        if (this.options.filter) {
          delete this.options.filter.name;
        }

        this.table.search('').columns().search('').draw();
      }
      return this;
    },

    setFilter: function (filter) {
      if (this.table) {
        if ($.isEmptyObject(this.options.filter)) {
          this.options.filter = filter;
        } else {
          this.options.filter = _.extend(this.options.filter, filter);
        }
        this._drawTable();
      }
    },

    resetOrder: function (refresh) {
      this.collection.resetOrder();
      return this;
    },
    getScreenRowCount: function (filter) {
      var tableTools = this.table && getTableTools.call(this);

      if (tableTools) {
        var jqTable = $('#' + tableTools.dom.table.id);
        var tbodyH = jqTable && jqTable[0].childNodes[1] &&
                     jqTable[0].childNodes[1].clientHeight ||
                     0;
        var rows = jqTable && jqTable.dataTable().$('tbody tr');
        var rowH = rows[0] && rows[0].clientHeight || 0; //make sure at least one so you don't divide by 0'
        return (rowH > 0) ? Math.floor(tbodyH / rowH) : 0;
      }
      return 0;
    },

    getSelectedChildren: function () {
      var crit = {};
      crit[SelectCellView.isSelectedModelAttributeName] = true;
      return this.collection.where(crit);
    },

    clearChildrenSelection: function () {
      var tableTools = this.table && getTableTools.call(this);
      tableTools && tableTools.fnSelectNone();
    },

    getFocusedChild: function () {
      if (this.accFocusedState.body.row) {
        return this.collection.at(this.accFocusedState.body.row);
      } else {
        return undefined;
      }
    },

    cancelFetch: function () {
      if (this.table) {
        this.table.clear();
      }
    },

    _setSpacing: function () {
      switch (this.options.spacing) {
      case 'medium':
        this.$el.removeClass('csui-table-spacing-narrow');
        this.$el.addClass('csui-table-spacing-medium');
        this.$el.removeClass('csui-table-spacing-wide');
        break;
      case 'wide':
        this.$el.removeClass('csui-table-spacing-narrow');
        this.$el.removeClass('csui-table-spacing-medium');
        this.$el.addClass('csui-table-spacing-wide');
        break;
      default:
        this.$el.addClass('csui-table-spacing-narrow');
        this.$el.removeClass('csui-table-spacing-medium');
        this.$el.removeClass('csui-table-spacing-wide');
      }
    },

    toggleSpacing: function () {

      switch (this.options.spacing) {
      case 'medium':
        this.options.spacing = 'wide';
        break;
      case 'wide':
        this.options.spacing = 'narrow';
        break;
      default:
        this.options.spacing = 'medium';
      }

      this._setSpacing();
      this._adjustColumns();
    },

    showDetailRowDescriptions: function (show) {
      if (this.options.descriptionRowView) {
        this.options.descriptionRowViewOptions.showDescriptions = show;
        _.each(this._detailRowsDescriptionTRs, function (description) {
          if (show) {
            description.rowEl.removeClass("binf-hidden");
          } else {
            description.rowEl.addClass("binf-hidden");
          }
          description.view.trigger('dom:refresh');  // let the view adjust due to visibility change
        });
        this.trigger('dom:refresh');  // let the table refresh keyboard navigation
      }
    },

    enableLocationColumn: function (enable) {
      if (this.options.locationColumn !== enable) {
        this.options.locationColumn = enable;
      }
    },

    enableRefresh: function (enabled) {
      this.refreshEnabled = enabled;
    },

    applyFilter: function (data) {
      if (this.options.clientSideDataOperation) {
        this.clientSideSearch(data.column);
      } else {
        var filterObj = {};
        if (_.keys(data).indexOf('column') === -1) {
          filterObj = data;
        } else {
          filterObj[data.column] = data.keywords;
        }
        if (this.collection.fetching) {
          this.filterValuePending = filterObj;
        } else {
          this.collection.resetLimit(false);
          this.collection.setFilter(filterObj);
        }
      }
    },

    cancelAnyExistingInlineForm: function (options) {
      if (this.activeInlineForm) {
        this.activeInlineForm.cancel(options);
      }
    },

    startCreateNewModel: function (newNode, inlineFormView) {
      this.cancelAnyExistingInlineForm();
      if (this.collection && this.collection.node) {
        newNode.set("parent_id", this.collection.node.get('id'));
        newNode.isLocallyCreated = true;
        newNode.inlineFormView = inlineFormView;
        this.collection.add(newNode, {at: 0});
      }
    },

    startInlineFormForEdit: function (model) {
      if (this.collection.contains(model)) {
        this.cancelAnyExistingInlineForm();

        var inlineFormView = inlineFormViewFactory.getInlineFormView(model.get('type'));
        if (!inlineFormView) {
          inlineFormView = inlineFormViewFactory.getInlineFormView(-1);
        }
        if (inlineFormView) {
          model.inlineFormView = inlineFormView;
          model.set('csuiInlineFormErrorMessage', 'dummy', {silent: true});
          model.unset('csuiInlineFormErrorMessage');
        }
      }
    },

    showOrHideZeroRecordsMessage: function () {
      this.$el.find('div.csui-table-empty').remove();
      if (this.collection.length === 0) {
        this.$el.find('tbody').empty();
        this.$el.addClass("csui-table-empty");
        this._setEmptyViewText();
        var classNameToBeAdd = "csui-table-empty csui-table-empty-default" +
                               (!!this.canAddItemsToContainer && !!this.addItemsPermissions ?
                                " csui-can-add-items" : ""),
            emptyEl = $("<div class='" + classNameToBeAdd + "'><p" +
                        " class='csui-no-result-message' title='" +
                        this.emptyTableText + "'>" + this.emptyTableText + "</p></div>");
        if (!this._showEmptyViewText) {
          emptyEl.addClass('csui-state-loading');
        }
        this.$el.append(emptyEl);
      } else {
        this.$el.removeClass("csui-table-empty");
        if (this._renderedEmptyTable) {
          this._previousViewWidth = 0;
        }
      }
      this._renderedEmptyTable = (this.collection.length === 0);
    },

    _setEmptyViewText: function () {
      this.emptyTableText = "";
      if (this._showEmptyViewText) {
        var labels = this.options.customLabels ? this.options.customLabels : this.localizableLabels;
        if (this.options.customLabels && labels.emptyTableText) {
          this.emptyTableText = labels.emptyTableText;
        } else {
          this.emptyTableText = !!this.addItemsPermissions ? labels.zeroRecords :
                                lang.noPermissions;
          this.emptyTableText = !!this.canAddItemsToContainer ? this.emptyTableText :
                                labels.zeroRecords;
          var filterLength = _.size(this.collection.filters);
          if (filterLength > 1) {
            this.emptyTableText = labels.emptySearchTable;
          } else if (filterLength === 1) {
            if (!!this.collection.filters.name) {
              this.emptyTableText = labels.emptySearchTable;
            }
          }
        }
      }
    },

    setCustomLabels: function (otherLabels) {
      var customLabels = this.getOption('customLabels') ||
                         this.getOption('tableTexts') || {};
      if (_.isFunction(customLabels)) {
        customLabels = customLabels.call(this);
      }
      this.options.customLabels = this._fillDefaultLocalizableLabels(otherLabels, customLabels);

      function mergeCustomLabels(customLabels, oLanguage) {
        return _.reduce(_.keys(customLabels), function (result, labelKey) {
          var customLabel = customLabels[labelKey];
          if (_.isObject(customLabel)) {
            var originalLabels = oLanguage[labelKey] || (oLanguage[labelKey] = {});
            return result || mergeCustomLabels(customLabel, originalLabels);
          }
          var differs = oLanguage[labelKey] != customLabel;
          oLanguage[labelKey] = customLabel;
          return result || differs;
        }, false);
      }
      if (this.table) {
        var hungarianLabels = _.deepClone(this.options.customLabels);
        DataTables.camelToHungarian(DataTables.defaults.oLanguage, hungarianLabels);
        var differs = mergeCustomLabels(hungarianLabels, this.table.settings()[0].oLanguage);
        if (differs) {
          this._drawTable();
        }
      }
    },

    _fillDefaultLocalizableLabels: function () {
      var customLabels = Array.prototype.slice.call(arguments),
          completeLabels = {
            paginate: {},
            aria: {},
            tooltip: {}
          };
      _.each(customLabels, function (customLabels) {
        if (customLabels.zeroRecordsMsg != null && customLabels.zeroRecords == null) {
          customLabels.zeroRecords = customLabels.zeroRecordsMsg;
          delete customLabels.zeroRecordsMsg;
        }
        _.defaults(completeLabels, customLabels);
        _.defaults(completeLabels.paginate, customLabels.paginate);
        _.defaults(completeLabels.aria, customLabels.aria);
      });

      function removeDefaultingLabels(completeLabels) {
        _.each(_.keys(completeLabels), function (labelKey) {
          var label = completeLabels[labelKey];
          if (_.isObject(label)) {
            removeDefaultingLabels(label);
          } else {
            if (label === false || label === null) {
              delete completeLabels[labelKey];
            }
          }
        });
      }
      removeDefaultingLabels(completeLabels);
      _.defaults(completeLabels, {
        emptyTable: lang.NodeTableNoItems,
        emptySearchTable: lang.NodeTableNoSearchResult,
        zeroRecords: lang.NodeTableNoItems,
        loadingRecords: lang.NodeTableLoadingItems,
        processing: lang.NodeTableProcessingItems,
        info: lang.NodeTablePageInfo,
        infoEmpty: lang.NodeTableEmptyPageInfo,
        infoFiltered: lang.NodeTableFilteredPageInfo,
        infoThousands: lang.NodeTablePageThousandsSeparator,
        infoPostFix: lang.NodeTablePageInfoSuffix,
        lengthMenu: lang.NodeTablePageSizeSelector,
        search: lang.NodeTablePageFilterLabel
      });
      _.defaults(completeLabels.paginate, {
        first: lang.NodeTablePagingFirst,
        last: lang.NodeTablePagingLast,
        previous: lang.NodeTablePagingPrevious,
        next: lang.NodeTablePagingNext
      });
      _.defaults(completeLabels.aria, {
        sortedDescending: lang.NodeTableSortedDescendingColumnAria,
        sortedAscending: lang.NodeTableSortedAscendingColumnAria
      });
      _.defaults(completeLabels.tooltip, {
        sortAscending: lang.NodeTableSortAscendingTooltip,
        sortDescending: lang.NodeTableSortDescendingTooltip,
        isUnsorted: lang.NodeTableIsUnsortedTooltip
      });
      return completeLabels;
    },

    _initializeLocalizableLabels: function () {
      var customLabels = this.getOption('customLabels') ||
                         this.getOption('tableTexts') || {};
      if (_.isFunction(customLabels)) {
        customLabels = customLabels.call(this);
      }
      this.localizableLabels = this._fillDefaultLocalizableLabels(customLabels);
    },

    _handlePendingFilter: function () {
      if (!this.isRendered) {
        return;
      }
      if (!_.isEmpty(this.filterValuePending)) {
        this.collection.resetLimit(false);
        this.collection.setFilter(this.filterValuePending);
        this.filterValuePending = {};
      }
    },

    _handleResponseSortBy: function () {
      var sorting = this.collection.sorting;
      if (sorting && sorting.sort && sorting.sort.length > 0 && sorting.sort[0].value) {
        var sortValue = sorting.sort[0].value,
            markerIndex = sortValue.indexOf('_'),
            sortKey = sortValue.substring(markerIndex + 1),
            sortDirection = sortValue.substring(0, markerIndex);
        var sortingColumnKey = this.collection.sortingColumnKey;
        var sortBy = (!!sortingColumnKey && sortingColumnKey.lastIndexOf('_formatted') === -1) ? sortingColumnKey : this._getSortableColumnKey(sortKey);
        if (this.table) {
          this.table.order(parseInt(this._getColumnIndex(sortBy)), sortDirection);
          ensureTableHeaderOrder.call(this, this.table.order(), sortKey);
        }
        var orderDiff = this.collection.setOrder(sortBy + ' ' + sortDirection, false);
        if (this.enableViewState && orderDiff) {
          this.setViewStateOrderBy([sortKey + ' ' + sortDirection], {default: true});
        }
      }
    },
    clientSideSearch: function (column) {
      var filterObj = {};
      _.each(this.searchBoxes, function (sb) {
        var col = sb.getColumn();
        var keywords = sb.getValue();
        if (keywords.length) {
          filterObj[col] = keywords;
        }
      });
      this.collection.resetLimit(false);
      this.collection.setFilter(filterObj);
    },

    resetScrollToTop: function () {
      if (!this.isRendered) {
        return;
      }
      var scrollContainer = this.$('tbody');
      scrollContainer.scrollTop(0);
    },

    _clearSearchBoxes: function () {
      if (!this.isRendered) {
        return;
      }
      _.each(this.searchBoxes, function (sb) {
        sb.hideAndClear();
      });
    },

    _adjustColumns: function () {
      if (accessibleTable) {
        return;
      }

      if (!this.displayedColumns || !this.$el.is(':visible')) {
        return;
      }

      var tableWidth = this.$el.width();
      if (!PerfectScrollingBehavior.usePerfectScrollbar()) {
        if (this.$el.find('.csui-normal-scrolling').hasScroll()) {
          tableWidth -= $.scrollbarWidth();
        }
      }
      var numberColumnsWithFixedWidth = 0;
      var sumFixedWidth = 0;
      var columnCells;
      var headerCells = this.$el.find('table>thead>tr>th');
      if (this.collection.length > 0) {
        if (this.activeInlineForm) {
          var firstRowModelId = this.collection.at(0).get('id');
          var inlineFormModelId = this.activeInlineForm.model.get('id');
          if (firstRowModelId === inlineFormModelId) {
            if (this.collection.length > 1) {
              columnCells = this.$el.find('table>tbody>tr:nth-child(3)').children();
            } else {
              columnCells = headerCells;
            }
          } else {
            columnCells = this.$el.find('table>tbody>tr:first-child').children();
          }
        } else {
          columnCells = this.$el.find('table>tbody>tr:first-child').children();
        }
      } else {
        columnCells = headerCells;
      }

      var widerCellIndexes = {};
      var normalCellIndexes = [];
      var displayedColumns = this.displayedColumns;
      var widthFactorSum = 0,
          widestColumnIndex,
          largestWidthFactor = 0,
          flexibleColumnWidth = 0,
          numberColumnsWithFlexibleWidth = 0;

      var extraWidthForToolbarItems = this._extraWidthForToolbarItems;
      var nameColumn = _.findWhere(displayedColumns, {isNaming: true});
      if (!nameColumn) {
        extraWidthForToolbarItems = 0;  // there is no name column and so no extra width
      }

      columnCells.each(function (index) {
        if (index < displayedColumns.length) {
          var el = $(this),
              columnWidth = Math.max(el.outerWidth(), $(headerCells[index]).outerWidth());

          var column = displayedColumns[index];
          if (column.CellView.hasFixedWidth) {
            sumFixedWidth += columnWidth;
            numberColumnsWithFixedWidth++;
          } else {
            var widthFactor = (column.attributes && column.attributes.widthFactor) || 1.0;
            if (widthFactor && widthFactor !== 1.0) {
              widerCellIndexes[index] = widthFactor;
              widthFactorSum += widthFactor;
            } else {
              if (column.CellView && column.CellView.flexibleWidth) {
                flexibleColumnWidth += columnWidth;
                numberColumnsWithFlexibleWidth++;
              } else {
                normalCellIndexes.push(index);
                widthFactorSum += 1;
              }

            }
            if (widthFactor > largestWidthFactor) {
              largestWidthFactor = widthFactor;
              widestColumnIndex = index;
            }
          }
        }
      });
      var remainingWidth = tableWidth - sumFixedWidth - flexibleColumnWidth -
                           extraWidthForToolbarItems,
          numberColumnsNonFixedWidth = displayedColumns.length - numberColumnsWithFixedWidth -
                                       numberColumnsWithFlexibleWidth,
          remainingWidthPerCell = numberColumnsNonFixedWidth > 0 ?
                                  remainingWidth / numberColumnsNonFixedWidth : 0,
          sumWidthOfWideCells = 0,
          averageWidthFactor = widthFactorSum / numberColumnsNonFixedWidth;

      _.each(widerCellIndexes, function (widthFactor, columnIndex) {
        var // scale width factors so sum of width factors equals number of columns and the
            wf = widthFactor / averageWidthFactor,
            w = remainingWidthPerCell * wf;
        if (sumWidthOfWideCells + w > remainingWidth) {
          w = remainingWidth - sumWidthOfWideCells;
          if (w < 0) {
            w = 0;
          }
        }
        w = Math.floor(w);
        widerCellIndexes[columnIndex] = w;
        sumWidthOfWideCells += w;
      });
      var correctionWidth;
      if (normalCellIndexes.length > 0) {
        remainingWidthPerCell = (remainingWidth - sumWidthOfWideCells) /
                                normalCellIndexes.length / averageWidthFactor;
        remainingWidthPerCell = Math.floor(remainingWidthPerCell);
        correctionWidth = remainingWidth - sumWidthOfWideCells -
                          remainingWidthPerCell * normalCellIndexes.length;
      } else {
        remainingWidthPerCell = 0;
        correctionWidth = remainingWidth - sumWidthOfWideCells;
      }
      correctionWidth = Math.floor(correctionWidth);

      var cachedColumnWidths = {};
      var cssTextPattern = '#{0} [data-csui-attribute="{1}"] {2} \n';
      var cssTextAcc = '';
      var self = this;
      columnCells.each(function (index) {
        if (index >= displayedColumns.length) {return;}

        var el = $(this);
        var extraWidth = 0;
        var column = displayedColumns[index];
        if (column.isNaming) {
          extraWidth = extraWidthForToolbarItems;
        }

        var widthStyle;
        if (column.CellView.hasFixedWidth || column.CellView.flexibleWidth) {
          var colContentWidth = Math.max(el.outerWidth(), $(headerCells[index]).outerWidth()) +
                                extraWidth;
          widthStyle = _.str.sformat('{width: {0}px}', colContentWidth);
        } else {
          var columnWidth;
          if (widerCellIndexes[index] && widerCellIndexes[index] > 0) {
            columnWidth = widerCellIndexes[index];
          } else {
            columnWidth = remainingWidthPerCell;
          }
          if (index === widestColumnIndex && correctionWidth) {
            columnWidth += correctionWidth;
          }

          columnWidth += extraWidth;
          widthStyle = _.str.sformat('{min-width: {0}px; max-width: {1}px}', columnWidth,
              columnWidth);
        }
        cssTextAcc += _.str.sformat(cssTextPattern, self.cid, column.attributes["column_key"],
            widthStyle);
        cachedColumnWidths[column.className] = widthStyle;

      });
      writeStyles('adjusted_colstyles_js_' + self.cid, cssTextAcc);

      this.cachedColumnWidths = cachedColumnWidths;
      if (this.accFocusedState.body.column > displayedColumns.length - 1) {
        this.accFocusedState.body.column = displayedColumns.length - 1;
      }

      function writeStyles(styleName, cssText) {
        var styleElement = document.getElementById(styleName);
        if (styleElement) {
          document.getElementsByTagName('head')[0].removeChild(styleElement);
        }
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = styleName;
        styleElement.innerHTML = cssText;
        document.getElementsByTagName('head')[0].appendChild(styleElement);
      }
      this._showOrHideAlternativeHeaderView();
    },
    _showOrHideAlternativeHeaderView: function () {
      if (this._alternativeHeaderRegion) {
        if (this.selectedChildren.length > 0) {
          this._alternativeHeaderRegion.$el.addClass('csui-table-alternative-header-visible');
        } else {
          this._alternativeHeaderRegion.$el.removeClass('csui-table-alternative-header-visible');
        }
      }
    },
    _createAlternativeHeaderView: function () {
      var alternativeHeaderOptions = this.options.alternativeHeader.options;

      var toolItemFactoryOptions;
      var filteredCollection;

      if (alternativeHeaderOptions && alternativeHeaderOptions.toolbarItems &&
          alternativeHeaderOptions.toolbarItems.tableHeaderToolbar) {
        var toolItemFactory = alternativeHeaderOptions.toolbarItems.tableHeaderToolbar;
        toolItemFactoryOptions = toolItemFactory ? toolItemFactory.options : undefined;

        var status = {
          nodes: this.selectedChildren,
          container: this.collection.node,
          context: this.context,
          collection: this.collection
        };

        this._alternativeHeaderCommandController = alternativeHeaderOptions.toolbarCommandController ||
                                                   new ToolbarCommandController({
                                                     commands: alternativeHeaderOptions.commands
                                                   });
        filteredCollection = new FilteredToolItemsCollection(
            toolItemFactory, {
              status: status,
              commands: this._alternativeHeaderCommandController.commands,
              delayedActions: this.collection.delayedActions,
              mask: alternativeHeaderOptions.toolbarItemsMask
            });

      }
      var alternativeHeaderView = new this.options.alternativeHeader.viewClass(_.extend({
        collection: filteredCollection,
        toolbarName: 'tableHeader',
        originatingView: this.options.parentView,
        keyboardNavigationEnabled: true,
        selectedNodes: this.selectedChildren
      }, toolItemFactoryOptions));

      if (this._alternativeHeaderCommandController) {
        this.listenTo(this._alternativeHeaderCommandController, 'before:execute:command',
            function (eventArgs) {
              log.debug("command " + eventArgs.commandSignature + " is starting") &&
              console.log(log.last);
              this.lockedForOtherContols = true;
              this._destroyInlineBar();

              alternativeHeaderView.trigger('before:execute:command', eventArgs);
            });
        this.listenTo(this._alternativeHeaderCommandController, 'after:execute:command',
            function (eventArgs) {
              log.debug("command is finished") && console.log(log.last);
              this.lockedForOtherContols = false;

              alternativeHeaderView.trigger('after:execute:command', eventArgs);
            });
      }

      return alternativeHeaderView;
    },
    _toolbarItemClicked: function (toolItemView, args) {
      var selectedNodes = this.getSelectedChildren();
      var executionContext = {
        context: this.context,
        nodes: new this._ViewCollection(selectedNodes),
        container: this.collection.node,
        collection: this.collection,
        originatingView: this.options.originatingView,
        toolItemView: toolItemView
      };
      this._alternativeHeaderCommandController.toolitemClicked(args.toolItem, executionContext);
    },

    _getSortableColumnKey: function (name) {
      var key = name;
      name = name.toLowerCase();
      _.find(this.displayedColumns, function (column, index) {
        if (column.attributes.sort_key === name || column.name.toLowerCase() === name ||
            column.attributes.column_key === name) {
          key = column.attributes.column_key;
          return true;
        }
      });
      return key;
    },

    _getColumnIndex: function (columnName) {
      var columnIndex = -1;
      this.displayedColumns && this.displayedColumns.some(function (cellValue, index) {
        if (cellValue.name == columnName) {
          columnIndex = index;
          return true;
        }
      }, this);
      return columnIndex;
    },

    _collectionOrderByChanged: function () {
      var orderBy = this.collection.orderBy;
      if (orderBy && this.table) {
        orderBy = orderBy.split(' ');
        var columnName = orderBy[0], direction = orderBy[1],
            columnIndex = this._getColumnIndex(columnName),
            currentOrder = this.table.order(),
            currentColumnIndex, currentDirection;
        if (currentOrder && currentOrder.length > 0) {
          currentColumnIndex = currentOrder[0][0];
          currentDirection = currentOrder[0][1];
        }
        if (columnIndex !== -1 &&
            (currentColumnIndex !== columnIndex || currentDirection !== direction)) {
          this.table.order(parseInt(columnIndex), direction);
          this.collection.fetch();
        }
      }
    },

    _collectionFilterChanged: function () {
      if (!this.searchBoxes || this.searchBoxes.length === 0) {
        ensureAllSearchBox.call(this);
      }

      var filters = this.collection.filters;
      _.each(this.searchBoxes, function (searchbox) {

        var columnName = searchbox.getColumn();
        var filterValue = filters[columnName];
        if ((filterValue !== undefined && filterValue !== "") || searchbox.showInputField) {
          if (!searchbox.getShown()) {
            searchbox.showSearchInput();
          }
          searchbox.setValue(filterValue);
        } else {
          if (searchbox.getShown()) {
            searchbox.hideAndClear();
          }
        }
      });

      if (this.enableViewState) {
        this.setViewStateFilter(this.collection.getFilterAsString());
      }
    },

    _collectionFilterCleared: function () {
      _.each(this.searchBoxes, function (searchbox) {
        searchbox.hideAndClear();
      });

      if (this.enableViewState) {
        this.setViewStateFilter('');
      }
    },

    onViewStateChanged: function () {
      var viewStateModel = this.context.viewStateModel,
          orderBy = this.getViewStateOrderBy() ||
                    this.getDefaultViewStateOrderBy() || 'name asc',
          pageInfo = this.getViewStatePage() || this.getDefaultViewStatePage(),
          filter = viewStateModel.getViewState('filter', true);

      if (orderBy && orderBy !== this.collection.orderBy) {
        this.collection.setOrder(orderBy, false);
      }

      if (pageInfo) {
        if (pageInfo.top !== undefined && pageInfo.skip !== undefined &&
            (pageInfo.top !== this.collection.topCount ||
             pageInfo.skip !== this.collection.skipCount)) {
          this.collection.setLimit(pageInfo.skip, pageInfo.top);
        }
      }

      if (filter) {
        if (this.collection.getFilterAsString() !== filter) {
          this.applyFilter(this.collection.filterStringToObject(filter));
        }
      } else if (this.collection.filters) {
        this.collection.clearFilter();
      }
    },

    _pagingChanged: function () {
      if (this.collection.topCount !== undefined && this.collection.skipCount !== undefined) {
        return this.setViewStatePage(this.collection.topCount,
            this.collection.skipCount,
            {default: this.collection.skipCount === 0});
      }
    }
  });

  TableView.version = '1.0';

  function getClassesFromElement(el) {
    var ca = el.attr('class');
    var rval = [];
    if (ca && ca.length && ca.split) {
      ca = $.trim(ca);
      ca = ca.replace(/\s+/g, ' ');
      rval = ca.split(' ');
    }
    return rval;
  }

  function _resolveDetailRowColspan(masterRow, detailsRow, options) {

    var colspan = 0;
    var allTh = this.$el.find('thead th');
    var allThLength = allTh.length;
    if (this.wrappedColumns.length === 0 &&
        allTh.last().hasClass('csui-table-cell-_toggledetails')) {
      allThLength = allThLength - 1;  // the toggledetails column will be removed later
    }

    if (options && options.firstColumnIndex >= 0) {
      if (allThLength > 0 && options.firstColumnIndex < allThLength) {
        var detailTableCell = $(detailsRow.children()[0]);
        if (options.lastColumnIndex && options.lastColumnIndex >= options.firstColumnIndex) {
          colspan = options.lastColumnIndex - options.firstColumnIndex + 1;
          if (colspan > 1) {
            detailTableCell.attr('colspan', colspan);
          }
          detailsRow.attr('style', '');
        }
        for (var i = 0; i < options.firstColumnIndex; i++) {
          detailsRow.prepend('<td></td>');
        }
        var remainingTdCount = allThLength - options.firstColumnIndex - colspan;
        if (options.displayInEntireRow) {
          options.descriptionColspan = remainingTdCount + 1;
        } else if (remainingTdCount > 0) {
          for (var j = 0; j < remainingTdCount; j++) {
            detailsRow.append('<td></td>');
          }
        }
      }
    } else {
      var masterRowCells = $(masterRow).children();
      var detailsRowCells = detailsRow.children();
      if (detailsRowCells.length === 1 && masterRowCells.length > 1) {
        colspan = masterRowCells.length;
        if (this.wrappedColumns.length === 0 && colspan > 0) {
          colspan = colspan - 1;  // the toggledetails column will be removed later
        }
        detailsRowCells.attr('colspan', colspan);
      }
    }
  }

  function _rememberDetailRowViewByModel(model, view) {
    var id = model.id || model.get('id');
    var detailRowViews = this._detailRowViewsByModelId[id];
    if (!detailRowViews) {
      detailRowViews = {views: []};
      this._detailRowViewsByModelId[id] = detailRowViews;
    }
    detailRowViews.views.push(view);
  }

  function addDetailRow(table, iDataIndex, nRow, aData) {
    var childRows;
    var errorMessage = aData.get('csuiErrorMessage');
    if (errorMessage) {
      var errorRowView = new ErrorRowView({errorMessage: errorMessage});
      errorRowView.render();
      table.row(iDataIndex).child(errorRowView.el, "csui-details-row").show();
      $(nRow).addClass("csui-has-details-row");

      childRows = table.row(iDataIndex).child();
      if (aData.isLocallyCreated) {
        childRows.addClass("csui-new-item");
      }
      if (aData.get('id') !== undefined) {
        childRows.addClass("csui-saved-item");
      }
    } else {

      var detailRows = [];
      var trEl, tdEl;

      if (accessibleTable) {
        childRows = $();
      } else {
        if (this.options.descriptionRowView) {
          var descriptionAvailable = aData.get('description') &&
                                     aData.get('description').length > 0;

          if ((!descriptionAvailable && this.options.descriptionRowViewOptions.showSummary) ||
              this.options.descriptionRowViewOptions.showSummaryOnly) {
            descriptionAvailable = aData.get('summary') && aData.get('summary').length > 0;
          }
          if (descriptionAvailable) {
            var collapsedHeightIsOneLine = false;
            if (this.options.descriptionRowViewOptions &&
                this.options.descriptionRowViewOptions.collapsedHeightIsOneLine) {
              collapsedHeightIsOneLine = true;
            }
            var descriptionRowView = new this.options.descriptionRowView(
                {
                  model: aData,
                  collapsedHeightIsOneLine: collapsedHeightIsOneLine,
                  tableView: this
                });
            descriptionRowView.render();

            tdEl = $('<td class="csui-details-row"></td>');
            trEl = $('<tr class="csui-details-row csui-details-row-description"></tr>');
            tdEl.appendTo(trEl);

            descriptionRowView.triggerMethod('before:show');
            descriptionRowView.$el.appendTo(tdEl);  // insert into td of tr
            descriptionRowView.triggerMethod('show');

            _resolveDetailRowColspan.call(this, nRow, trEl, this.options.descriptionRowViewOptions);

            if (this.options.descriptionRowViewOptions) {
              if (this.options.descriptionRowViewOptions.displayInEntireRow &&
                  this.options.descriptionRowViewOptions.descriptionColspan) {
                tdEl.attr("colspan", this.options.descriptionRowViewOptions.descriptionColspan);
              }

              if (!this.options.descriptionRowViewOptions.showDescriptions) {
                trEl.addClass('binf-hidden');
              }
            }
            this._detailRowsDescriptionTRs.push({rowEl: trEl, view: descriptionRowView});
            _rememberDetailRowViewByModel.call(this, aData, descriptionRowView);

            detailRows.push(trEl[0]);
          }
        }

        if (this.wrappedColumns.length > 0) {
          var metadataRowView = new MetadataRowView({
            context: this.context,
            model: aData,
            columns: this.wrappedColumns
          });
          metadataRowView.render();
          tdEl = $('<td class="csui-details-row"></td>');
          trEl = $('<tr class="csui-details-row csui-details-row-metadata"></tr>');
          tdEl.appendTo(trEl);

          if (this.options.haveDetailsRowExpandCollapseColumn &&
              this.options.haveToggleAllDetailsRows) {
            if (this.detailsRowsAreExpanded ||
                this.expandedDetailRows[aData.id || aData.get('id')]) {
              trEl.addClass("binf-collapse binf-in"); // show the row expanded
            } else {
              trEl.addClass("binf-collapse"); //binf-show it collapsed
            }
          } else {
            trEl.addClass("binf-collapse binf-in"); // show it initially expanded
          }
          trEl.attr('id', "csui-details-row-" + aData.cid);

          metadataRowView.triggerMethod('before:show');
          metadataRowView.$el.appendTo(tdEl);  // insert into td of tr
          metadataRowView.triggerMethod('show');

          _resolveDetailRowColspan.call(this, nRow, trEl);
          aData.set('hasMetadataRow', true, {silent: true});

          _rememberDetailRowViewByModel.call(this, aData, metadataRowView);
          detailRows.push(trEl[0]);
        } else {
          aData.set('hasMetadataRow', false, {silent: true});
        }
        table.row(iDataIndex).child(detailRows, "csui-details-row").show();
        childRows = table.row(iDataIndex).child();
      }
    }

    if (childRows.length > 0) {
      $(nRow).addClass("csui-has-details-row");
    }
    return childRows;
  }

  function createTable() {
    if (!this.allColumns.length) {
      return;
    }

    this.trigger("creatingTable", {
      sender: this
    });
    var self = this;
    self.hoveredRowDataId = undefined;
    this._detailRowsDescriptionTRs = [];
    this._detailRowViewsByModelId = {};
    var useServerSideProcessing = true;
    cleanPlaceholder.call(this);

    var originUrl = new base.Url(this.connector.connection.url).getOrigin(true);
    var supportUrl = base.Url.combine(originUrl, this.connector.connection.supportPath);
    var additionalCreationOptions = getCreationOptions.call(this);

    this.csuiDestroyRowCallbacks = [];

    var creationOptions = _.extend({
      columns: _.map(this.displayedColumns, function (column) {
        if (column.attributes.initialSortingDescending) {
          column.asSorting = ['desc', 'asc'];   // apply sorting ranking
        }
        return column;
      }),
      jQueryUI: false,
      autoWidth: false,
      deferRender: useServerSideProcessing,
      serverSide: useServerSideProcessing,
      language: self.localizableLabels,

      ajax: function (aoData, fnCallback, oSettings) {
        if (this.refreshEnabled === false) {
          return;
        }
        var api = this.api();
        if (api.context.length > 0) {
          if (self.options.clientSideDataOperation) {
            clientSideUpdateData.call(self, api, aoData, oSettings, fnCallback);
          } else {
            fetchData.call(self, api, aoData, oSettings, fnCallback);
          }
        }
      },

      initComplete: function (oSettings, json) {
        self.trigger("tableFrameRendered", {
          sender: self, target: this[0]
        });
      },

      drawCallback: function (oSettings) {
        var $table = $(this);
        if (self.collection) {
          if (self.collection.length === 0 ||
              self.collection.length === 1 && self.collection.at(0).inlineFormView) {
            $table.addClass('csui-table-empty');
          } else {
            $table.removeClass('csui-table-empty');
          }
        }

        if (accessibleTable) {
          $table.css('display', 'table');
          $table.find('thead')
              .css('display', 'table-header-group');
          $table.find('tbody')
              .css('display', 'table-row-group');
          $table.find('tr')
              .css('display', 'table-row');
          $table.find('td,th')
              .css('display', 'table-cell');
          $table.find('thead > tr')
              .children()
              .each(function () {
                var header = $(this);
                if (header.find('.csui-table-column-search').length) {
                  var wrapper = $('<div>', {style: 'display: flex'});
                  header.wrapInner(wrapper);
                }
              });
          $table.parent()
              .css({
                display: 'block',
                width: '100%',
                'overflow-x': 'auto'
              });
        }

        self.hoveredRowDataId = undefined;
        self.hoveredRow = undefined;
        if (self.options.haveDetailsRowExpandCollapseColumn &&
            self.options.haveToggleAllDetailsRows) {
          if (!$table.find('td.csui-table-cell-_toggledetails >' +
                           ' .expand-details-row-toggle').length &&
              self.collection.length) {
            self.displayedColumns = _.filter(self.displayedColumns, function (col) {
              return col.sName !== '_toggledetails';
            });

            var toggleDetailEls = $table.find('.csui-table-cell-_toggledetails');
            toggleDetailEls.remove();
          }
        }
        $table.find('thead th').each(function () {
          var subElement = $(this).find('div.csui-focusable-table-column-header');
          if (subElement.hasClass('csui-empty')) {
            if (!subElement.hasClass('csui-iconButSorted')) {
              $(this).removeAttr('title');
              subElement.removeAttr('role');
            }
            subElement.removeClass('csui-iconButSorted');
          }
          if (subElement.attr('role') === 'button') {
            var currentAriaLabel = subElement.attr('aria-label');
            if (!currentAriaLabel) {
              var nextSortDir = $(this).attr('data-csui-column-next-sort-dir');
              var buttonAriaLabel = nextSortDir === "desc" ?
                                    lang.NodeTableSortDescendingButtonAria :
                                    (nextSortDir === "asc") ?
                                    lang.NodeTableSortAscendingButtonAria : "LaLaLa";
              var visibleColumnName = $(this).text().trim();
              if (!visibleColumnName || visibleColumnName.length === 0) {
                var key = $(this).attr("data-csui-attribute");
                var columnFound = _.find(self.displayedColumns, function (column2Check) {
                  return column2Check.name === key;
                });
                visibleColumnName = columnFound.title;
              }
              buttonAriaLabel = _.str.sformat(buttonAriaLabel, visibleColumnName);
              subElement.attr('aria-label', buttonAriaLabel);
            }
          }
          $(this).removeAttr('data-csui-column-current-sort-dir');
          $(this).removeAttr('data-csui-column-next-sort-dir');
        });
        $table.find('th[aria-sort]').each(function () {
          $(this).removeAttr('aria-sort');
        });

        $table.find('tr:not(.csui-details-row)').each(function () {
          $(this).find('> *').last().addClass('csui-table-cell-last-visible');
        });

        self.trigger("tableBodyRendered", {
          sender: self, target: $("tbody", this)[0]
        });

        self._plugHeaderBodyViews();
        if (self.table) {
          setTimeout(function () {
            self.trigger('update:scrollbar');
          });
        }
      },

      headerCallback: function (nHead, aData, iStart, iEnd, aiDisplay) {
        if (_.find(self.searchBoxes, function (sb) { return sb.getShown(); })) {
          if (self.collection.length && self._selectAllCheckboxRegion &&
              !!self._selectAllCheckboxRegion.currentView.model.get('disabled')) {
            self._selectAllCheckboxRegion.currentView.model.set('disabled', false);
          }
          return;
        }

        var excludeTableHeaderCellsWithClass = [
          SelectCellView.columnClassName,
          'csui-table-cell-_toggledetails'
        ];

        var trEl = $(nHead);
        var headerCells = trEl.find('>th');

        var orderIdx;
        var order = this.api().order();
        if (order.length > 0) {
          var firstOrder = order[0];
          if (firstOrder.length > 0) {
            orderIdx = firstOrder[0];
          }
        }

        headerCells.each(function (index) {
          var thEl = $(this);

          if (self.displayedColumns.length > index) {
            var column = self.displayedColumns[index];

            thEl.attr('data-csui-attribute', column.name);
            if (_.find(excludeTableHeaderCellsWithClass, function (classToCheck) {
              return thEl.hasClass(classToCheck);
            }) === undefined) {
              $(this).empty();
              if (thEl.attr('aria-label') === undefined) {
                thEl.attr('aria-label', column.title);
              }
              if (column.titleIconInHeader && thEl.attr('title') === undefined) {
                thEl.attr('title', column.title);
              }
              var contentWrapper = $('<div class="csui-focusable-table-column-header"></div>');
              var iconButSorted = column.titleIconInHeader && orderIdx === index;
              var headerEmpty = (column.noTitleInHeader === true &&
                                 (!column.titleIconInHeader || iconButSorted));

              if (accessibleTable) {
                headerEmpty = false;
              }
              if (headerEmpty) {
                contentWrapper.addClass('csui-empty');
                if (iconButSorted) {
                  contentWrapper.addClass('csui-iconButSorted');
                  contentWrapper.attr('role', 'button');
                }
              } else {
                if (column.attributes.sort) {
                  contentWrapper.attr('role', 'button');
                }

                var contentEl;
                if (column.titleIconInHeader) {
                  contentEl = $(
                      '<span class="csui-icon csui-table-header-icon ' + column.titleIconInHeader +
                      '">');
                } else {
                  contentEl = $('<div class="csui-table-column-text"></div>').text(column.title);
                }
                contentWrapper.append(contentEl);
              }
              $(this).append(contentWrapper);
            }
          }
        });

        ensureExpandAllDetailRowsColumn.call(self, nHead);
        ensureSelectAllCheckbox.call(self, nHead);
        ensureTableHeaderOrder.call(self, this.api().order());
        ensureAllSearchBox.call(self);

        self.trigger("tableHeaderRendered", {
          sender: self, target: nHead
        });
      },

      footerCallback: function (nFoot, aData, iStart, iEnd, aiDisplay) {
        self.trigger("tableFooterRendered", {
          sender: self, target: nFoot
        });
      },

      rowCallback: function (nRow, aData, iDataIndex) {
        var $row = $(nRow);
        var detailRows = addDetailRow.call(self, this.api(), iDataIndex, nRow, aData);
        var initiallySelected = self._allSelectedNodes.get(aData);
        if (initiallySelected) {
          aData.set(SelectCellView.isSelectedModelAttributeName, true);
        }

        var isSelected = aData.get(SelectCellView.isSelectedModelAttributeName);
        if (isSelected) {
          $row.addClass('binf-active');
          _.each(detailRows, function (detailRow) {
            $(detailRow).addClass('binf-active');
          });
        } else {
          $row.removeClass('binf-active');
          _.each(detailRows, function (detailRow) {
            $(detailRow).removeClass('binf-active');
          });
        }
        if (aData.isLocallyCreated) {
          $row.addClass("csui-new-item");
          detailRows.addClass("csui-new-item");
        }
        if (aData.get('id') !== undefined) {
          $row.addClass("csui-saved-item");
          detailRows.addClass("csui-saved-item");
          aData.set('inactive', !self.checkModelHasAction(aData), {silent: true});
        } else {
          aData.set('inactive', true, {silent: true});
        }
        if (aData.get('isCut') === true) {
          $row && $row.addClass('csui-cut-row');
          detailRows && detailRows.addClass('csui-cut-row');
        }

        var cellViews = [];
        var displayInlineForm = aData.inlineFormView !== undefined;
        if (displayInlineForm) {
          $row.addClass("csui-table-row-shows-inlineform");
        }
        var inlineFormColspan = 0;
        var tdForInlineForm;
        var tdForDeletion = [];
        self.csuiDestroyRowCallbacks.push(destroyCellViews, destroyRowViews);
        for (var index = 0; index < self.displayedColumns.length; index++) {
          var column = self.displayedColumns[index];
          if (column.CellView) {
            var $td = $($row.children()[index]);
            if (self.cachedColumnWidths && self.cachedColumnWidths[column.className] &&
                !column.CellView.hasFixedWidth) {
              var widthStyle = self.cachedColumnWidths[column.className];
              $td.css(widthStyle);
            }
            var cellViewOptions = {
              el: $td,
              tableView: self,
              column: column,
              model: aData,
              context: self.context,
              originUrl: originUrl,
              supportUrl: supportUrl,
              nameEdit: self.options.nameEdit,
              favoritesTableOptions: self.options.favoritesTableOptions,
              rowIndex: iDataIndex
            };
            if (column.name === '_toggledetails') {
              cellViewOptions.rowIsExpanded =
                  self.detailsRowsAreExpanded ||
                  self.expandedDetailRows[aData.id || aData.get('id')];
            }
            var cellView = new column.CellView(cellViewOptions);

            if (column.name === '_toggledetails') {
              self.listenTo(cellView, 'toggle:detailsrow', function (args) {
                delete self.detailsRowsAreExpanded;
                _updateToggleButton.call(self);

                self.expandedDetailRows[args.model.id ||
                                        args.model.get('id')] = args.detailsRowIsExpanded;
                self.trigger('update:scrollbar');
              });
            }
            if (displayInlineForm) {
              if (column.name === 'type') {
                cellView.render();
                self.listenTo(cellView, 'type:clicked', function () {
                  self.triggerMethod('type:clicked');
                });
              } else {
                if ((column.isNaming || column.name === 'name') && !tdForInlineForm) {
                  inlineFormColspan = 1;
                  tdForInlineForm = $td;
                } else {
                  if (column.name !== '_select') {  // skip select column
                    inlineFormColspan++; // count remaining td name and all td that come after it
                    tdForDeletion.push($td);
                  }
                }
              }
            } else {
              cellView.render();
            }
            self.listenTo(cellView, 'cellCloseOther', function () {
              self.cancelAnyExistingInlineForm();
              self.trigger('closeOther', cellView);
              self.lockedForOtherContols = true;
              _.each(cellViews, function (otherCellView) {
                if (otherCellView !== cellView) {
                  otherCellView.triggerMethod('closeOther');
                }
              });
            });
            self.listenTo(cellView, 'cellAllowOther', function () {
              self.trigger('allowOther', cellView);
              self.lockedForOtherContols = false;
              _.each(cellViews, function (otherCellView) {
                if (otherCellView !== cellView) {
                  otherCellView.triggerMethod('allowOther');
                }
              });
            });
            self.listenTo(cellView, 'cancelEdit', function () {
              var unsavedModel = self.collection.at(0);
              if (unsavedModel && unsavedModel.get('id') === undefined) {
                unsavedModel.csuiIsRemoved = true;
                self.collection.remove(unsavedModel);
              }
            });
            self.listenTo(cellView, 'show:add:favorite:form', function () {
              self._destroyInlineBar();
              self.lockedForOtherContols = true;
            });
            self.listenTo(cellView, 'close:add:favorite:form', function () {
              self.lockedForOtherContols = false;
            });

            if (iDataIndex >= 0) {
              var theFunc = function (colIndex, event) {
                self.trigger('clicked:cell', {
                  cellView: cellView,
                  rowIndex: iDataIndex,
                  colIndex: colIndex,
                  model: aData
                });
              };
              self.listenTo(cellView, 'clicked:cell', theFunc.bind(null, index));
			  
              self.listenTo(cellView, 'clicked:checkbox', function (event) {
                if (aData.get('selectable') !== false) {
                  var tt = getTableTools.call(self);
                  if (event.checked === 'false') {
                    tt.fnSelect(nRow);
                  } else {
                    tt.fnDeselect(nRow);
                  }
                }
              });
            }
            cellViews.push(cellView);
          }
        }

        function destroyRowViews() {
          var allRowViews = self._detailRowViewsByModelId || {};
          Object
              .keys(allRowViews)
              .forEach(function (rowViewId) {
                var itemRowViews = allRowViews[rowViewId].views;
                itemRowViews.forEach(function (rowView) {
                  self.stopListening(rowView);
                  rowView.destroy();
                });
              });
          self._detailRowsDescriptionTRs = [];
          self._detailRowViewsByModelId = {};
          self.hoveredRowDataId = undefined;
        }

        function destroyCellViews() {
          var a = cellViews;
          setTimeout(function () {
            for (var i = 0; i < a.length; i++) {
              self.stopListening(a[i]);
              a[i].destroy();
            }
          }, 0);
        }

        function handleRowHover(dtRow, detailRows) {
          if (detailRows === undefined) {
            detailRows = $();
          }

          var hoveredNodeChanged = true;
          var rowDataId = dtRow._DT_RowIndex;

          if (self.hoveredRowDataId && self.hoveredRowDataId === rowDataId) {
            hoveredNodeChanged = false;
          }
          self.hoveredRowDataId = rowDataId;

          if (hoveredNodeChanged) {
            if (self.hoveredRow) {
              $(self.hoveredRow).removeClass("csui-state-hover");
              var prevDetailRows = self.table.row(self.hoveredRow).child();
              prevDetailRows.removeClass("csui-state-hover");
            }
            var node = self.table.row(dtRow).data();
            if (node) {
              var nodeId = node.id || node.get('id');
              if (nodeId !== undefined) {
                var args = {
                  sender: self,
                  targets: [dtRow],
                  nodes: getNodes.call(self, [dtRow])
                };
                self.trigger("selectingTableRow", args);
                if (!args.cancel) {
                  self.hoveredRow = dtRow;
                  $(dtRow).addClass("csui-state-hover");
                  detailRows.addClass("csui-state-hover");
                }
              }
            }
          }
        }

        function handleRowHoverLeave(dtRow, detailRows) {
          if (detailRows === undefined) {
            detailRows = $();
          }
          $(dtRow).removeClass("csui-state-hover");
          detailRows.removeClass("csui-state-hover");
          self.hoveredRowDataId = undefined;
          self.hoveredRow = undefined;
        }
        if (displayInlineForm && tdForInlineForm && inlineFormColspan > 1) {
          _.each(tdForDeletion, function (el) {
            el.remove();
          });
          tdForInlineForm.attr('colspan', inlineFormColspan);
          tdForInlineForm.addClass('csui-inlineform-parent');

          self.trigger('closeOther'); // force inline bar to close
          if (aData.inlineFormView) {
            if (self.activeInlineForm) {
              self.activeInlineForm.destroy();
            }
            self.activeInlineForm = new aData.inlineFormView({
              model: aData,
              originatingView: self.options.originatingView,
              context: self.context
            });
          }

          self.activeInlineForm.listenTo(self.activeInlineForm, 'destroy', function () {
            self.lockedForOtherContols = false;
            if (!!self.activeInlineForm.model.get('id')) {
              setTimeout(function () {
                self.accFocusedState.focusView = 'tableBody';
                self.trigger('changed:focus');
                self.currentlyFocusedElement().trigger('focus');
              }, 1);
            }
            self._adjustColumns();
            delete self.activeInlineForm;
          });

          var inlineFormRegion = new Marionette.Region({el: tdForInlineForm});
          inlineFormRegion.show(self.activeInlineForm);
        } else {

          $row.mousehover(function () {
            var args = {
              sender: self,
              target: nRow,
              node: self.table.row(nRow).data()
            };
            self.trigger("enterTableRow", args);
          }, function () {
            var args = {
              sender: self,
              target: nRow,
              node: self.table.row(nRow).data()
            };
            self.trigger("leaveTableRow", args);
          }, {
            namespace: self.cid
          });
          $row.mousehover(
              function () { handleRowHover.call(self, nRow, detailRows); },
              function () { handleRowHoverLeave.call(self, nRow, detailRows); },
              {namespace: self.cid});
          detailRows.mousehover(
              function () { handleRowHover.call(self, nRow, detailRows); },
              function () { },
              {namespace: self.cid});
        }

        self.trigger("tableRowRendered", {
          sender: self, target: nRow, node: aData, expandedRows: detailRows
        });

      } // end rowCallback
    }, additionalCreationOptions);

    if (!!this.collection.state) {
      _.extend(creationOptions, {
        order: saveSortOrderState.call(this),
        ordering: true
      });
    }

    function saveSortOrderState() {
      this.res = this.collection.state.split("_");
      this.order = this.order || [[]];
      self.foundcolumn = false;
      var stateValue = this.collection.state.substring(this.collection.state.indexOf("_") + 1,
          this.collection.state.length).trim();
      var found = this.displayedColumns.some(function (cellValue, index) {
        if (cellValue.name == stateValue) {
          self.index = index;
          return true;
        }
      }, this);
      if (found) {
        this.order[0].push(this.index);
        this.order[0].push(this.res[0]);
        this.foundcolumn = true;
      } else {
        this.foundcolumn = false;
        var notFound = this.displayedColumns.some(function (cellValue, index) {
          if (cellValue.attributes && cellValue.attributes.isNaming === true) {
            self.index = index;
            return true;
          }
        }, this);
        if (notFound) {
          this.order[0].push(this.index);
          this.order[0].push(this.res[0]);
        }
      }
      return this.order;
    }

    if (!useServerSideProcessing) {
      creationOptions.data = this.collection.models;
    }
    var tableEl = $("<table></table>").addClass("binf-table").attr("id", this.cid);
    if (!accessibleTable) {
      this.$el.addClass('csui-not-ready');
    }

    tableEl.appendTo(this.el);
    this.table = tableEl.DataTable(creationOptions);
    $(this.$el.children()[0]).attr('tabindex', '-1');
    selectRowsByNodeIds.call(this, additionalCreationOptions.selectedNodesById);
    if (this.collection.length > 0 && additionalCreationOptions.currentScollPosition !==
        undefined) {
      this.$('tbody').scrollTop(additionalCreationOptions.currentScollPosition);
    }
    this.$('tbody').on('scroll', function () {
      self.trigger('scroll');
    });

    this.table.on("click", ".csui-table-cell-default-action", function (event) {
      delegateClickAction.call(self, event, "DefaultPre");
    }).on("click", "a#parentAction", function (event) {
      delegateClickAction.call(self, event, "Parent");
    }).on("click", "a#menuAction", function (event) {
      delegateClickAction.call(self, event, "Menu");
    }).on("click", "input[id^='selectAction']", function (event) {
      event.stopPropagation();
      var target = $(event.target);
      var td = target.closest("td,th");
      td.trigger('click');
    }).on("processing", function (event, oSettings, shown) {
      ensureProcessingPanel.call(self, oSettings, shown);
    }).on("destroy", function (event, oSettings) {
      destroyProcessingPanel.call(self, oSettings);
      cleanUpTableEventListeners.call(self);
      self._destroyTableHeaderAndBodyViews();
    }).on("preDraw", function (event, oSettings) {

      if (!oSettings.oFeatures.bServerSide || oSettings.bDrawing) {
        cleanUpTableEventListeners.call(self);
        if (self.activeInlineForm) {
          self.activeInlineForm.destroy();
        }
        self._destroyTableHeaderAndBodyViews();
      }
    });

    tableEl.on('order.dt', function () {
      var order = self.table.order();

      if (self.displayedColumns) {
        var orderBy = [];
        _.each(self.table.order(), function (orderinfo) {
          var sortColumnIndex = orderinfo[0];
          var sortColumnKey = self.displayedColumns[sortColumnIndex].data(undefined, 'orderBy');
          if (sortColumnKey) {
            if (orderinfo[1]) {
              orderBy.push(sortColumnKey + " " + orderinfo[1]);
            } else {
              orderBy.push(sortColumnKey);
            }
          }
        });
        if (!(self.collection && self.collection.isSortOptionSelected)) {
          if (orderBy.length) {
            self.collection.setOrder(orderBy.join());
          } else {
            self.collection.resetOrder();
          }
        }
      }
    });
    if (this.options.alternativeHeader) {
      log.warn("Using of options.alternativeHeader with table.view is deprecated. Please use" +
               " csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view" +
               " instead and render this view ouside of table.view. The behavior" +
               " csui/behaviors/table.rowselection.toolbar/table.rowselection.toolbar.behavior" +
               " might help using it.") && console.log(log.last);

      this.$el.find('.csui-table-alternative-header').remove();
      var alternativeHeaderRegionEl = $('<div class="csui-table-alternative-header"></div>');
      this.$el.prepend(alternativeHeaderRegionEl);
      this._alternativeHeaderRegion = new Marionette.Region({el: alternativeHeaderRegionEl});
      var alternativeHeaderView = this._createAlternativeHeaderView();
      this._alternativeHeaderRegion.show(alternativeHeaderView);
      this.triggerMethod('alternativeHeader:show', alternativeHeaderView);
      this.listenTo(alternativeHeaderView, 'childview:toolitem:action', this._toolbarItemClicked);
    }

    this.trigger("tableCreated", {
      sender: this
    });
  }

  function ensureProcessingPanel(oSettings, shown) {
    if (!this.disablingOverlay) {
      this.disablingOverlay = $("<div id='disabling_overlay'></div>")
          .hide().prependTo(this.table);
    }
    if (shown) {
      this.disablingOverlay.show();
    } else {
      this.disablingOverlay.hide();
    }
  }

  function destroyProcessingPanel(oSettings) {
    if (this.disablingOverlay) {
      this.disablingOverlay.remove();
      this.disablingOverlay = undefined;
    }
  }

  function getTableTools() {
    return this.tableTools ||
           (this.tableTools = TableTools.fnGetInstance(this.table.table().node()));
  }

  function getCreationOptions() {
    var options;
    switch (this.options.paginationStyle) {
    case "all_buttons":
      options = {
        pagingType: "full_numbers"
      };
      break;
    case "two_buttons":
      options = {
        pagingType: "two_button"
      };
      break;
    case "infinite_scrolling":
      options = {
        scrollCollapse: true, // 260 would be better but with scrollCollapse on the scrollbar
        scrollY: this.options.pageSize ?
                 (this.options.pageSize * 25 - 1) + "px" : "249px"
      };
      break;
    default:
      options = {
        paging: false
      };
    }
    if (!this.recreated) {
      this.recreated = this.columns.length || this.columns.fetched;
    }

    options.order = getOrderFromOrderBy.call(this, this.collection.orderBy);
    options.ordering = getTableOrderingOption.call(this);

    var selectRows = this.options.selectRows;
    if (selectRows === "none") {
      options.dom = '<"H"lfr>t<"F"ip>';
    } else {
      options.dom = '<"H"lTfr>t<"F"ip>';

      var self = this;
      options.tableTools = {
        aButtons: [],

        sRowSelect: selectRows,

        fnPreRowSelect: function (ev, rows, selecting) {
          if (self._rebuildingTable) {
            return; // don't handle row selection event while in table rebuild/render
          }

          function triggerRowClickedEvent() {
            var node = self.table.row(rows[0]).data();
            if (!node.inlineFormView) {
              var rowClickedEventArgs = {sender: self, target: rows[0], node: node};
              self.triggerMethod('row:clicked', rowClickedEventArgs);
              return !rowClickedEventArgs.cancel;
            }
          }

          function triggerRowSelectingEvent() {
            var nodes = getNodes.call(self, rows);
            var args = {sender: self, targets: rows, nodes: nodes};
            self.trigger(selecting ? "selectingTableRow" : "unselectingTableRow", args);
            return !args.cancel;
          }

          Marionette.triggerMethodOn(self.tableBodyView, 'before:render');

          if (rows && rows.length > 0) {
            var ok = triggerRowClickedEvent();
            if (ok) {
              if (self.options.selectColumn) {
                var selectByClick = ev && ev.target;
                var canSel = !selectByClick ||
                             $(ev.target).hasClass(SelectCellView.columnClassName);
                if (canSel) {
                  return triggerRowSelectingEvent();
                } else {
                  return false;
                }
              } else {
                return triggerRowSelectingEvent();
              }
            } else {
              return false;
            }
          } else {
            return true;
          }
        },

        fnRowSelected: function (rows) {
          if (self._rebuildingTable) {
            return; // don't handle row selection event while in table rebuild/render
          }
          if (_.isArray(rows) && rows.length > 0) {

            _.each(rows, function (r) {
              var node = self.table.row(r).data(),
                  currentRow = $(r);

              node.set(SelectCellView.isSelectedModelAttributeName, true);
            });
            updateSelectAllCheckbox.call(self);
            Marionette.triggerMethodOn(self.tableBodyView, 'render');

            self.trigger('closeOther'); // force inline bar to close (updateRow rendered row
            self.selectedChildren.reset(self.getSelectedChildren());

            self.trigger("tableRowSelected", {
              sender: self, targets: rows, nodes: getNodes.call(self, rows)
            });
          }
        },

        fnRowDeselected: function (rows) {
          if (self._rebuildingTable) {
            return; // don't handle row deselection event while in table rebuild/render
          }
          if (_.isArray(rows) && rows.length > 0) {
            _.each(rows, function (r) {
              var node = self.table.row(r).data(),
                  currentRow = $(r);

              node.set(SelectCellView.isSelectedModelAttributeName, false);
            });
            updateSelectAllCheckbox.call(self);
            Marionette.triggerMethodOn(self.tableBodyView, 'render');

            self.selectedChildren.reset(self.getSelectedChildren());
            self.trigger("tableRowUnselected", {
              sender: self, targets: rows, nodes: getNodes.call(self, rows)
            });
          }
        }
      };
    }
    options.searching || options.lengthChange ||
    (options.dom = options.dom.replace('"H"', '').replace('l',
        '').replace('f', ''));
    options.info || options.pagingType ||
    (options.dom = options.dom.replace('"F"', '').replace('i',
        '').replace('p', ''));

    tryApplyingStateSavedBeforeRebuild.call(this, options);

    return options;
  }

  function getOrderFromOrderBy(orderBy) {
    var orders = [];
    if (orderBy) {
      orders = _.map(orderBy.split(","),
          function (orderBy) {
            orderBy = orderBy.split(" ");
            var columnKey = orderBy[0],
                columnNumber = getSortableColumnNumber.call(this, columnKey);
            if (columnNumber !== undefined) {
              columnKey = this.displayedColumns[columnNumber].attributes.column_key;
              if (this.columns.findWhere({column_key: columnKey}).get('sort')) {
                return [columnNumber, orderBy[1] || "asc"];
              }
            }
          }, this);
    }

    var definedOrders = _.filter(orders, function (orderBy) {return !!orderBy; });
    return definedOrders;
  }

  function getTableOrderingOption() {
    if (this.options.enableSorting !== true) {
      return false;
    }
    var sortableColumn = _.find(this.displayedColumns, function (col) {
      return col.attributes && col.attributes.sort === true;
    });
    return !!sortableColumn;
  }

  function _updateToggleButton() {
    if (this.toggleExpandDetailsRowEl) {
      if (this.detailsRowsAreExpanded) {
        this.toggleExpandDetailsRowEl.removeClass('icon-expandArrowDown');
        this.toggleExpandDetailsRowEl.addClass('icon-expandArrowUp');
        this.toggleExpandDetailsRowEl.attr('title', toggleDetailsLang.collapseAllTooltip);
        this.toggleExpandDetailsRowEl.attr('aria-label', toggleDetailsLang.collapseAllAria);

      } else {
        this.toggleExpandDetailsRowEl.removeClass('icon-expandArrowUp');
        this.toggleExpandDetailsRowEl.addClass('icon-expandArrowDown');
        this.toggleExpandDetailsRowEl.attr('title', toggleDetailsLang.expandAllTooltip);
        this.toggleExpandDetailsRowEl.attr('aria-label', toggleDetailsLang.expandAllAria);
      }
    }
  }

  function ensureExpandAllDetailRowsColumn(nHead) {
    var expandDetailRowColumn;
    var self = this;

    function toggleDetailsRow(event) {
      event.stopPropagation();
      event.preventDefault();

      this.detailsRowsAreExpanded = !this.detailsRowsAreExpanded;
      this._clearExpandedRows();  // collapse or expand all clears single toggle states
      this._detailRowsDescriptionTRs = [];   // clear the row description trs else the array will be populated with the same elems after 'draw()'.
      _updateToggleButton.call(this);

      this._drawTable();

      if (this.options.descriptionRowViewOptions &&
          this.options.descriptionRowViewOptions.showDescriptions) { // call show detail row description only if show description is already set to true before 'draw()'.
        this.showDetailRowDescriptions(true);
      } else {
        this.trigger('dom:refresh');      // let the table refresh keyboard navigation
      }
      this._adjustColumns();
      if (!!this.collection.isSortOptionSelected) {
        this.collection.isSortOptionSelected = false;
      }
    }

    var anchor;
    if (this.options.haveDetailsRowExpandCollapseColumn &&
        this.options.haveToggleAllDetailsRows) {
      expandDetailRowColumn = $("th.csui-table-cell-_toggledetails", nHead);
      if (expandDetailRowColumn.length > 0) {
        anchor = $("a", expandDetailRowColumn);
        if (anchor.length) {
          this.toggleExpandDetailsRowEl = anchor.find('.csui-button-icon');
          _updateToggleButton.call(this);
        } else {
          if (this.collection.length) {
            expandDetailRowColumn.addClass("csui-table-cell-_toggledetails");
            anchor = $('<a class="csui-focusable-table-column-header expand-details-row-toggle"' +
                       ' title="' + toggleDetailsLang.expandAllTooltip + '" aria-label="' +
                       toggleDetailsLang.expandAllAria +
                       '" href="#" aria-expanded="false">' +
                       '<span class="csui-button-icon icon-expandArrowDown"></span></a>');
            this.toggleExpandDetailsRowEl = anchor.find('.csui-button-icon');
            _updateToggleButton.call(this);
            anchor.prependTo(expandDetailRowColumn);
            expandDetailRowColumn.on('click', _.bind(toggleDetailsRow, this));
            anchor.on('click', _.bind(toggleDetailsRow, this));
            expandDetailRowColumn.on('keypress', function (event) {
              var keyCode = event.keyCode || event.charCode;  // note: not all browser give
              if (!(event.ctrlKey || event.metaKey) && (keyCode === 32 || keyCode === 13)) {
                toggleDetailsRow.call(self, event);
              }
            });
          } else {
            anchor.remove();
          }
        }
      }
    }
  }

  function ensureSelectAllCheckbox(nHead) {
    var self = this;
    var selectColumn = $("th:first-child", nHead);
    if (selectColumn.length === 0) {
      return;
    }

    function toggleSelection() {

      var selectedRows = [];
      var selectedModels = [];
      var deselectedRows = [];
      var deselectedModels = [];
      var index, row;

      if (self._selectAllCheckboxRegion && self._selectAllCheckboxRegion.currentView) {
        Backbone.trigger('closeToggleAction');

        var cbView = self._selectAllCheckboxRegion.currentView;
        var checked = cbView.model.get("checked");

        switch (checked) {
        case 'true':
          self.collection.each(function (model) {
            if (model.get(SelectCellView.isSelectedModelAttributeName)) {
              index = self.collection.indexOf(model);
              row = self.table.row(index);
              deselectedModels.push(model);
              deselectedRows.push(row.node());
            }
          });
          break;
        default:
          self.collection.each(function (model) {
            if (model.get('selectable') !== false) {
              if (!model.get(SelectCellView.isSelectedModelAttributeName)) {
                index = self.collection.indexOf(model);
                row = self.table.row(index);
                selectedModels.push(model);
                selectedRows.push(row.node());
              }
            } else {
              if (model.get(SelectCellView.isSelectedModelAttributeName)) {
                index = self.collection.indexOf(model);
                row = self.table.row(index);
                deselectedModels.push(model);
                deselectedRows.push(row.node());
              }
            }
          });
        }
        if (deselectedRows.length > 0) {
          self.trigger("tableRowUnselected", {
            sender: self, targets: deselectedRows, nodes: deselectedModels
          });
          deselectedModels.forEach(function (model) {
            model.set(SelectCellView.isSelectedModelAttributeName, false);
          });
        }
        if (selectedRows.length > 0) {
          selectedModels.forEach(function (model) {
            model.set(SelectCellView.isSelectedModelAttributeName, true);
          });
          self.trigger("tableRowSelected", {
            sender: self, targets: selectedRows, nodes: selectedModels
          });
        }
        self.selectedChildren.reset(self.getSelectedChildren());
        updateSelectAllCheckbox.call(this);
        self.trigger('dom:refresh');
      }
    }

    function _markSelectAllCheckboxFocusable() {
      var checkboxFocusableElement = focusable.findFocusables(checkboxView.el);
      $(checkboxFocusableElement).addClass('csui-focusable-table-column-header');
    }

    if (this.options.selectColumn && this.options.selectAllColumnHeader) {
      if (!this._selectAllCheckboxRegion) {
        var checkboxView = new CheckboxView({
          checked: false,
          disabled: false,
          ariaLabel: lang.selectAllAria,
          title: lang.selectAll
        });

        this.listenTo(checkboxView, 'clicked', function (e) {
          e.cancel = true;
          toggleSelection.call(self);
        });
        this.listenTo(checkboxView, 'render', function () {
          _markSelectAllCheckboxFocusable();
        });

        this._selectAllCheckboxRegion = new Marionette.Region({el: selectColumn});
        this._selectAllCheckboxRegion.show(checkboxView);
        _markSelectAllCheckboxFocusable();
      }

      if (this.collection.length) {
        this._selectAllCheckboxRegion.currentView.setDisabled(false); // todo remove hide
        var selected = this.collection.where({csuiIsSelected: true}).length;
        if (selected > 0) {
          updateSelectAllCheckbox.call(this);
        }
      } else {
        this._selectAllCheckboxRegion.currentView.setDisabled(true);  // todo hide instead
      }
    }
  }

  function destroyAllSearchBox() {
    _.each(this.searchBoxes, function (sb) {
      sb.destroy();
    });
    this.searchBoxes.splice(0, this.searchBoxes.length);
  }

  function ensureTableHeaderOrder(order, sortKey) {
    if (order && order.length > 0 && order[0].length > 1) {
      var self = this;
      var sortDefCol0 = order[0];
      var sortColumnIndex = sortDefCol0[0];
      var sortDirection = sortDefCol0[1];
      var found = self.displayedColumns.some(function (cellValue) {
        return (cellValue === self.allColumns[sortColumnIndex]);
      });
      if (found) {
        var cssClass = 'icon-sortArrowUnknown';
        if (sortDirection === 'asc') {
          cssClass = 'icon-sortArrowUp';
        } else {
          if (sortDirection === 'desc') {
            cssClass = 'icon-sortArrowDown';
          }
        }
        var arrowEl = '<span class="csui-sort-arrow ' + cssClass + '"></span>';
        var thEl = self.$('th:eq(' + sortColumnIndex + ') .csui-focusable-table-column-header');
        self.$el.find('.csui-sort-arrow').remove();
        thEl.append(arrowEl);
        _.find(self.searchBoxes, function (searchbox) {
          var searchColumnName = searchbox.getColumn();
          if (sortKey === searchColumnName && searchbox.getShown()) {
            self.$el.find('.csui-sort-arrow').addClass('binf-hidden');
            return true;
          }
        });
      }
    }
  }

  function ensureAllSearchBox() {
    var self = this;
    destroyAllSearchBox.call(self);
    this.$('thead th').each(function (index) {
      if ($(this).find('.csui-table-column-search').length === 0) {
        if (self.displayedColumns.length > index) {
          var columnName = self.displayedColumns[index].name.toLowerCase();
          var columnTitle = self.displayedColumns[index].title;
          if (self.displayedColumns[index].noTitleInHeader === true) {
            columnTitle = '';
          }
          var searchOn = _.indexOf(self.columnsWithSearch, columnName);
          if (searchOn > -1 || self.displayedColumns[index].filterable === true) {
            var filterKey = self.displayedColumns[index].data &&
                            self.displayedColumns[index].data(undefined, 'filterBy'),
                searchbox,
                isTypeAheadSearchbox = self.columnsWithTypeaheadSearchbox &&
                                       _.indexOf(self.columnsWithTypeaheadSearchbox, columnName) !==
                                       -1,
                filterOpts = {
                  column: filterKey,
                  columnTitle: columnTitle,
                  context: self.options.context,
                };

            if (isTypeAheadSearchbox) {
              var typeaheadSearchboxOptions = self.options.columnsWithTypeaheadSearchbox[columnName];
              _.extend(filterOpts, typeaheadSearchboxOptions);
              searchbox = new TypeaheadSearchBoxView(filterOpts);
            } else {
              var filterVal = self.collection.filters && self.collection.filters[columnName];
              searchbox = new SearchBoxView(filterVal, filterOpts);
            }

            self.searchBoxes.push(searchbox);
            searchbox.off(searchbox.valueChangedEventName).on(searchbox.valueChangedEventName,
                function (data) {
                  self.applyFilter(data);
                });
            var searchWrapper = $(this).find('.csui-table-column-search');
            var textDiv = $(this).find('.csui-table-column-text');
            var thead = this;
            searchbox.off('opened').on('opened', function () {
              textDiv.addClass('binf-hidden');
              $(thead).find('.csui-sort-arrow').addClass('binf-hidden');
              self.searchColumn = columnName;
            });
            searchbox.off('closed').on('closed', function () {
              textDiv.removeClass('binf-hidden');
              $(thead).find('.csui-sort-arrow').removeClass('binf-hidden');
              self.collection.filters[columnName] = undefined;
            });
            searchbox.off('changed:focus').on('changed:focus', function () {
              if (self.tableCaptionView) {
                self.tableCaptionView._accSearchBoxFocused(
                    {columnName: columnName, columnIndex: index});
              }
            });
            searchbox.render();
            $(this).append(searchbox.el);
            if (columnName === self.searchColumn) {
              searchbox.setFocus();
            }

            searchWrapper = $(this).find('.csui-table-column-search');
            if (searchWrapper && columnTitle) {
              searchWrapper.attr('aria-label',
                  _.str.sformat(lang.searchIconTooltip, columnTitle.toLowerCase()));
            }
          }
        }
      }
    });
  }

  function selectRowsByNodeIds(selectedNodesById) {
    if (this.table && selectedNodesById) {
      _.each(this.table.rows(), function (rows) {
        _.each(rows, function (position) {
          var node = this.table.row(position).data(),
              nodeSelection = false;
          if (this._allSelectedNodes.length) {
            nodeSelection = !!this._allSelectedNodes.get(node);
          } else {
            var id = node.id || node.get('id');
            nodeSelection = !!selectedNodesById[id];
          }
          if (nodeSelection) {
            var tt = getTableTools.call(this);
            var trNode = this.table.row(position).node();
            tt.fnSelect(trNode);
          }
        }, this);
      }, this);
    }
  }

  function updateSelectAllCheckbox() {
    if (this._selectAllCheckboxRegion && this._selectAllCheckboxRegion.currentView) {
      var checkboxView = this._selectAllCheckboxRegion.currentView;
      if (this.collection.length) {
        checkboxView.setDisabled(false);

        var selection = this.collection.filter(function (model) {
          return model.get(SelectCellView.isSelectedModelAttributeName);
        });

        var numNotDisabled;
        if (this.table) {
          numNotDisabled = this.table.rows().nodes().to$().find(".csui-checkbox").not(
              ":disabled").length;
        } else {
          numNotDisabled = this.collection.length;
        }

        var all = selection.length >= numNotDisabled;

        if (selection.length > 0 && !all) {
          checkboxView.setChecked('mixed');
        } else {
          checkboxView.setChecked(selection.length > 0);
        }
      } else {
        checkboxView.model.set('checked', false);
        checkboxView.setDisabled(true);
      }
    }
  }

  function getNodes(rows) {
    return _.map(rows, function (row) {
      var position = this.table.row(row).index();
      return this.table.row(position).data();
    }, this);
  }

  function getSortableColumnNumber(name) {
    name = name.toLowerCase();
    var number;
    _.find(this.displayedColumns, function (column, index) {
      if (column.attributes.sort_key === name || column.name.toLowerCase() === name ||
          column.attributes.column_key === name) {
        number = index;
        return true;
      }
    });
    return number;
  }

  function getAdditionalColumns(self, columns) {

    var options = self.options;

    if (options.selectColumn) {
      columns.unshift(new NodeChildrenColumnModel({
        column_key: '_select',
        name: lang.selectionColumnTitle,
        sortable: false,
        alignment: 'center',
        permanentColumn: true
      }));
    }

    if (options.additionalColumns && options.additionalColumns.length > 0) {
      _.each(options.additionalColumns, function (column, index) {
        columns.push(new NodeChildrenColumnModel(column));
      });
    }
    if (accessibleTable && options.enforceDescriptionColumnInAccessibleMode) {
      var hasCustomDescriptionColumn = columns.some(function (column) {
        return column.get("column_key") === 'description';
      });
      if (!hasCustomDescriptionColumn) {
        columns.push(new NodeChildrenColumnModel({
          column_key: 'description',
          name: lang.descriptionColumnTitle,
          sortable: false,
          permanentColumn: true
        }));
      }
    }
    if (options.haveDetailsRowExpandCollapseColumn) {
      columns.push(new NodeChildrenColumnModel({
        column_key: '_toggledetails',
        name: '',
        sortable: false,
        alignment: 'center',
        permanentColumn: true,
        title: '',
        noTitleInHeader: true
      }));
    }

    return columns;
  }

  function destroyTable() {
    if (this.table) {
      this.trigger("destroyingTable", {
        sender: this
      });
      this._inlineBarShouldDestroy();

      destroyAllSearchBox.call(this);
      if (this._alternativeHeaderRegion) {
        this._alternativeHeaderRegion.empty();
        delete this._alternativeHeaderRegion;
      }

      if (this._selectAllCheckboxRegion) {
        this._selectAllCheckboxRegion.empty();
        delete this._selectAllCheckboxRegion;
      }
      delete this._detailRowsDescriptionTRs;
      delete this._detailRowViewsByModelId;

      this.table.destroy();
      cleanPlaceholder.call(this);
      delete this.table;
      delete this.tableTools;
      this.trigger("tableDestroyed", {
        sender: this
      });
    }
  }

  function cleanUpTableEventListeners() {
    _.each(this.csuiDestroyRowCallbacks, function (callBack) {
      callBack();
    });
    this.csuiDestroyRowCallbacks = [];
  }

  function cleanPlaceholder() {
    $("> table , > #message", this.$el).remove();
  }

  function saveStateBeforeRebuild() {
    var collection = this.collection;

    var selectedRowsData = this.table.rows('.selected').data();
    var selectedNodesById = {};
    _.each(selectedRowsData, function (node) {
      node.get(SelectCellView.isSelectedModelAttributeName) &&
      (selectedNodesById[node.id || node.get('id')] = true);
    });
    this.stateBeforeRebuild = {
      pageLength: (collection) ? collection.topCount : this.options.pageSize,
      selectedNodesById: selectedNodesById,
      currentScollPosition: this.$('tbody').scrollTop()
    };
  }

  function tryApplyingStateSavedBeforeRebuild(options) {
    if (this.stateBeforeRebuild) {
      _.extend(options, this.stateBeforeRebuild);
      delete this.stateBeforeRebuild;
    }
  }

  function fetchData(oTable, aoData, oSettings, fnCallback) {
    if (this.refreshEnabled === false) {
      return;
    }
    if (!(this.columns.length || this.columns.fetched)) {
      return;
    }
    var fetch = setOrder.call(this, aoData, oSettings);

    if (fetch) {
      this.collection.fetch();
    }

    var result = {
      sEcho: getDataParameter(aoData, "sEcho"),
      data: this.collection.models
    };
    this.trigger("settingServerData", {
      sender: this,
      result: result
    });
    fnCallback(result);
  }
  function clientSideUpdateData(oTable, aoData, oSettings, fnCallback) {
    if (!this.options.clientSideDataOperation) {
      return;
    }

    setOrder.call(this, aoData, oSettings);

    var result = {
      sEcho: getDataParameter(aoData, "sEcho"),
      data: this.collection.models
    };
    this.trigger("settingServerData", {
      sender: this, result: result
    });
    fnCallback(result);
  }

  function delegateClickAction(event, kind) {
    event.preventDefault();
    event.stopPropagation();
    var target = $(event.target);
    var tr = target.closest("tr");
    var position = tr[0]._DT_RowIndex;  // can't use tr.index() because detail rows (datatable

    if (position !== undefined) {
      var node = this.table.row(position).data();
      this.trigger("click" + kind + "Action", {
        sender: this, target: target[0], node: node, event: event
      });
    }
  }

  function setOrder(aoData, oSettings) {
    var columns = oSettings.aoColumns;
    var orderBy = [];
    var api = oSettings.oInstance.api();
    var table = api.table();
    _.each(table.order(), function (orderinfo) {
      var sortColumnIndex = orderinfo[0];
      var sortColumnKey = columns[sortColumnIndex].data(undefined,
          'orderBy');
      if (sortColumnKey) {
        if (orderinfo[1]) {
          orderBy.push(sortColumnKey + " " + orderinfo[1]);
        } else {
          orderBy.push(sortColumnKey);
        }
      }
    });

    if (this.enableViewState) {
      var makeItDefault = false;
      if (!this.getViewStateOrderBy()) {
        makeItDefault = true;
      }
      if (orderBy.length > 0 && this.setViewStateOrderBy(orderBy, {default: makeItDefault})) {
        return true;
      }
    }
    return false;

  }

  function getDataParameter(aoData, name) {
    return aoData ? aoData[name] : undefined;
  }

  _.extend(TableView.prototype, ViewEventsPropagationMixin);
  _.extend(TableView.prototype, GlobalAlertMixin);
  _.extend(TableView.prototype, NodeViewStateMixin);

  TableView.prototype._eventsToPropagateToViews.push('clicked:cell');

  return TableView;
})
;
