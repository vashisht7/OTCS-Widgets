/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/widget/widget.collection',
  'csui/utils/base',
  'csui/controls/grid/grid.view', 'csui/utils/log',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/behaviors/drag.drop/dnd.item.behaviour',
  'csui/behaviors/drag.drop/dnd.container.behaviour',
  'csui/perspectives/mixins/perspective.edit.mixin',
  'csui/utils/perspective/perspective.util',
  'i18n!csui/perspectives/flow/impl/nls/lang',
  'i18n!csui/perspectives/impl/nls/lang',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/flow/impl/flow.perspective'
], function (require, module, _, $, Backbone, Marionette, WidgetCollection, base, GridView,
    log, WidgetContainerBehavior, DnDItemBehaviour, DnDContainerBehaviour, PerspectiveEditMixin,
    PerspectiveUtil,
    lang, commonLang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        },
        heights: {
          xs: 'full'
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      },
      widetile: {
        widths: {
          xs: 12,
          lg: 6
        }
      },
      tile: {
        widths: {
          xs: 12,
          sm: 6,
          md: 4,
          xl: 3
        }
      }
    }
  });

  var FlowPerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-flow-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        if (!widget.view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved:' +
                     widget['error']
          });
        }
        return widget.view;
      }
    },

    cellViewOptions: function (model, cellView) {
      var widget = model.get('widget');
      var cellOptions = {
        context: this.options.context,
        data: widget && widget.options || {},
        model: undefined,
        perspectiveMode: this.options.perspectiveMode,
        widgetContainer: cellView
      };
      cellOptions[PerspectiveUtil.KEY_WIDGET_ID] = widget[PerspectiveUtil.KEY_WIDGET_ID];
      return cellOptions;
    },

    cellConstructionFailed: function (model, error) {
      var widget = model.get('widget');
      if (widget) {
        var errorWidget = WidgetContainerBehavior.getErrorWidget(widget, error.message);
        model.set('widget', _.defaults(errorWidget, widget.attributes));
      }
    },

    constructor: function FlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      this._preInitialize(options);
      GridView.prototype.constructor.call(this, options);
      this._postInitialize();
    },

    _preInitialize: function (options) {
      options.widgets || (options.widgets = []);
      if (!!options.perspectiveMode) {
        this._prepareOptionsForEditMode(options);
        this.prepareForEditMode();
      } else {
        options.widgets = _.reject(options.widgets, PerspectiveUtil.isHiddenWidget, this);
      }
      if (!options.collection) {
        var extWidgets = _.chain(config)
            .pick(function (value, key) {
              return key.indexOf('-widgets') >= 0;
            })
            .values()
            .flatten();

        if (extWidgets && extWidgets._wrapped && extWidgets._wrapped.length > 0) {
          options.widgets = _.filter(options.widgets, function (widget) {
            return _.contains(extWidgets._wrapped, widget.type);
          });
        }
        options.widgets = _.filter(options.widgets, function (widget) {
          return base.filterUnSupportedWidgets(widget, config) != undefined;
        });

        options.collection = this._createCollection(options);
      }
    },

    _postInitialize: function () {
      if (!!this.options.perspectiveMode) {
        this._registerEditEvents();
      }
    },
    _prepareOptionsForEditMode: function (options) {
      var self = this;
      var firstHiddenIdx = _.findIndex(options.widgets, PerspectiveUtil.isHiddenWidget, this);
      if (firstHiddenIdx === -1) {
        firstHiddenIdx = options.widgets.length;
      }
      options.widgets.splice(firstHiddenIdx, 0, this.getEmptyPlaceholderWidget(options));

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this,
          perspectiveMode: options.perspectiveMode
        },
        DnDItemBehaviour: { // For DnD widget
          behaviorClass: DnDItemBehaviour
        }
      };

      this._createDnDPlaceholderWidget();

      function addCell(widgetConfig, index) {
        var newCell = self._prepareGridCell(widgetConfig, index);
        var cells = self.collection.at(0).columns;
        cells.add(newCell, {at: index});
        self.options.context.fetch();
      }

      options.reorderOnSort = true; // To let reorder views on collection reorder (DnD reorder)
      options.rowBehaviours = {
        DnDContainerBehaviour: {
          behaviorClass: DnDContainerBehaviour,
          placeholder: this._getDnDPlaceholder.bind(this),
          handle: '.csui-pman-widget-masking', // Limit re-ordering to mask (avoids callout popover),
          helper: 'clone', // Use clone of the original element as drag image to preserve styles of original element as it is.
          start: function (event, ui) {
            var popoverTarget = self.$el.find(".binf-popover");
            if (popoverTarget.length) {
              popoverTarget.removeClass("pman-ms-popover");
              popoverTarget.hide();
              popoverTarget.binf_popover('destroy');
            }
          },
          over: _.bind(function (event, ui) {
            var placeholderWidget = this._getDnDPlaceholder(ui.helper);
            var placeholder = ui.placeholder;
            placeholder.show();
            placeholder.attr('class', placeholderWidget.attr('class'));
            placeholder.html(placeholderWidget.html());
            placeholder.css('visibility', 'visible');
            placeholder.data('pman.widget', ui.helper.data('pman.widget'));
            placeholder.removeData('isBeyondLayout');
            if (!!ui.helper.data('pman.widget')) { // "pman.widget" is not available when reorder within flow
              this._resolveWidget({
                type: ui.helper.data('pman.widget').id
              }).done(
                  function (resolvedWidget) {
                    placeholder.data('pman.widget.view', resolvedWidget);
                  });
            }
          }, this),
          out: function (event, ui) {
            ui.placeholder.hide();
            ui.placeholder.data('isBeyondLayout', true);
          },
          receive: _.bind(function (event, ui) {
            if (ui.placeholder.data('isBeyondLayout') === true ||
                !ui.placeholder.data("pman.widget.view")) {
              ui.sender.sortable("cancel");
              return;
            }
            if (ui.position.top > 0) {
              var newWidget = ui.placeholder.data('pman.widget'),
                  index     = ui.item.index(), // this.$el.find('.binf-row >div').index(ui.item);
                  manifest  = newWidget.get('manifest');

              var widget,
                  preloadedWidgetView = ui.placeholder.data("pman.widget.view");
              if (PerspectiveUtil.isEligibleForLiveWidget(manifest)) {
                widget = {
                  type: newWidget.id,
                  kind: manifest.kind,
                  view: preloadedWidgetView.get('view')
                };
              } else {
                widget = {
                  type: 'csui/perspective.manage/widgets/perspective.widget',
                  kind: manifest.kind,
                  options: {
                    options: {}, // To be used and filled by callout form
                    widget: newWidget
                  },
                  view: (preloadedWidgetView = this.pespectiveWidgetView)
                };
              }
              widget.options = _.extend({___pman_isdropped: true}, widget.options);

              if (!preloadedWidgetView) {
                this._resolveWidget(widget).done(function (resolvedWidget) {
                  addCell(widget, index);
                });
              } else {
                addCell(widget, index);
              }
            }
            this._ensurePlaceholder();
            ui.sender.sortable("cancel");
          }, this),
          stop: _.bind(function () {
            this._ensurePlaceholder();
          }, this)
        }
      };
    },
    _ensurePlaceholder: function () {
      var cells = this.collection.at(0).columns,
          self  = this;
      var placeholderCell = cells.find(function (cell) {
        return this.isEmptyPlaceholder(cell.get("widget"));
      }, this);
      if (!placeholderCell) {
        var placeholderWidget = this.getEmptyPlaceholderWidget();
        this._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
          var newCell = self._createCell(placeholderWidget, resolvedWidget, cells.length);
          var position = self._getPlaceholderIdealIndex();
          cells.add(newCell, {at: position + 1});
        });
      } else {
        var currentIndex = cells.indexOf(placeholderCell),
            idealIndex   = this._getPlaceholderIdealIndex(currentIndex);
        if (currentIndex !== idealIndex) {
          cells.remove(placeholderCell);
          cells.add(placeholderCell, {at: idealIndex});
        }
      }
    },

    _getPlaceholderIdealIndex: function (currentPlaceIndex) {
      var cells    = this.collection.at(0).columns,
          position = cells.length;
      currentPlaceIndex = currentPlaceIndex || -1;
      switch (this.options.perspectiveMode) {
      case PerspectiveUtil.MODE_PERSONALIZE:
        while (position-- > currentPlaceIndex) {
          if (!PerspectiveUtil.isHiddenWidget(cells.at(position).get('widget'))) {
            break;
          }
        }
        return position;
      case PerspectiveUtil.MODE_EDIT_PERSPECTIVE:
        return position - 1;
      default:
        return currentPlaceIndex;
      }
    },
    _createDnDPlaceholderWidget: function () {
      var self              = this,
          placeholderWidget = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder',
          };
      this._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
        var cellOptions = self._createCell(placeholderWidget, resolvedWidget, 0);
        cellOptions.className = "pman-dnd-hover-placeholder";
        self.dndPlaceholderCell = new GridView.CellView({
          grid: self,
          model: new Backbone.Model(cellOptions)
        });
        self.dndPlaceholderCell.render();
      });

      this._resolveWidget({
        type: 'csui/perspective.manage/widgets/perspective.widget'
      }).done(function (resolvedWidget) {
        self.pespectiveWidgetView = resolvedWidget.get('view');
      });
    },
    _getDnDPlaceholder: function (dragEl) {
      var widget = dragEl.data('pman.widget');
      if (!!widget) {
        var kind = widget.attributes.manifest.kind;
        if (!kind) {
          kind = config.defaultWidgetKind;
        }
        var sizes = config.widgetSizes[kind];
        this.dndPlaceholderCell.model.set({
          sizes: sizes.widths,
          heights: sizes.heights
        });
      }
      return this.dndPlaceholderCell.$el;
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var cells = self.collection.at(0).columns;
        var model = widgetView.model;
        cells.remove(model);
      });

      this.listenTo(this, 'update:widget:size', function (widgetView, kind) {
        var sizes  = config.widgetSizes[kind],
            widget = widgetView.model.get('widget');
        widget.kind = kind;
        widgetView.model.set({
          sizes: sizes.widths,
          heights: sizes.heights,
          widget: widget
        });
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
      this.listenTo(this, 'hide:widget show:widget', function (cell) {
        this._ensurePlaceholder();
      });
      if (this.options.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE) {
        this.listenTo(this, 'update:widget:options', function (config) {
          var cell   = config.widgetView,
              widget = cell.model.get('widget');
          if (this.isEmptyPlaceholder(widget)) {
            delete widget.__isPlacehoder;
            cell.model.unset('className', {silent: true});
            cell.$el.removeClass('csui-draggable-item-disable');
            this._ensurePlaceholder();
          }
        });
      }
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        return;
      }
      var self = this;
      var cells = this.collection.at(0).columns;
      this._resolveWidget(widgetToReplace).done(function () {
        if (!self.isEmptyPlaceholder(currentWidget.model.get('widget'))) {
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = self._prepareGridCell(widgetToReplace,
            cells.indexOf(currentWidget.model));
        self.options.context.clear();
        currentWidget.model.set(widgetUpdates);
        self.options.context.fetch();
        self._ensurePlaceholder();
      });
    },

    _createCollection: function (options) {
      var self = this,
          rows = new Backbone.Collection();

      if (!!options.perspectiveMode) {
        this.widgetsResolved = this._resolveWidgets(options.widgets)
            .always(function (resolvedWidgets) {
              var firstRow = rows.add({});
              var columns = _.map(options.widgets, function (widget, index) {
                return self._createCell(widget, resolvedWidgets[index], index);
              });
              firstRow.columns = new Backbone.Collection(columns);
              return resolvedWidgets;
            });
      } else {
        var uniqueWidgets = _.chain(options.widgets)
            .pluck('type')
            .unique()
            .map(function (id) {
              return {id: id};
            })
            .value();
        var resolvedWidgets = new WidgetCollection(uniqueWidgets);
        this.widgetsResolved = resolvedWidgets
            .fetch()
            .then(function () {
              var firstRow = rows.add({});
              firstRow.columns = self._createColumns(options.widgets, resolvedWidgets);
              return resolvedWidgets;
            });
      }
      return rows;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      var columns = _.map(widgets, function (widget, columnIndex) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return this._createCell(widget, resolvedWidget, columnIndex);
      }.bind(this));
      return new Backbone.Collection(columns);
    },

    _prepareGridCell: function (widgetConfig, columnIndex) {
      var kind = widgetConfig.kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        className: widgetConfig.className,
        widget: _.defaults({kind: kind, cellAddress: 'grid0:r0:c' + columnIndex}, widgetConfig)
      };
    },

    _createCell: function (widget, resolvedWidget, columnIndex) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (widgetView) {
        widget.view = widgetView;
        return this._prepareGridCell(widget, columnIndex);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      var sizes = config.widgetSizes[config.defaultWidgetKind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },
    getSupportedWidgetSizes: function (manifest, widget) {
      return _.map(manifest.supportedKinds, function (suppKind) {
        return {
          kind: suppKind,
          label: lang[suppKind + 'Label'],
          selected: widget.model.get('widget').kind === suppKind
        };
      });
    },

    serializePerspective: function (perspectiveModel) {
      var self         = this,
          deferred     = $.Deferred(),
          cells        = this.collection.at(0).columns,
          widgetModels = cells.filter(function (cell) {
            return !this.isEmptyPlaceholder(cell.get('widget'));
          }, this);

      var widgetPromises = widgetModels.map(function (widget, index) {
        return self.serializeWidget(widget, '/options/widgets/' + index);
      });
      $.whenAll.apply($, widgetPromises).done(function (results) {
        self.executeCallbacks(results, perspectiveModel, self.options.context).done(function () {
          var widgets           = _.pluck(results, 'widget'),
              constant_data     = _.flatten(_.pluck(results, 'constantsData')),
              perspectiveResult = {
                perspective: {
                  type: 'flow',
                  options: {widgets: widgets}
                },
                constant_data: constant_data,
                constant_extraction_mode: 1
              };
          var isAllWidgetsValid = self.validateAndGenerateWidgetId(widgets);
          if (!isAllWidgetsValid) {
            deferred.reject(commonLang.widgetValidationFailed);
          } else {
            deferred.resolve(perspectiveResult);
          }
        }).fail(function (results) {
          results = _.filter(results, function (result) {return !!result.error});
          deferred.reject(results[0].error);
        });
      }, this).fail(function (results) {
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });
      return deferred.promise();
    },

    getPreviousWidgets: function (perspectiveModel) {
      var perspective     = perspectiveModel.getPerspective(),
          previousWidgets = perspective &&
                            perspective.options ?
                            perspective.options.widgets :
              {};
      previousWidgets = _.map(previousWidgets, function (widget) {
        return {widget: widget};
      });
      return previousWidgets;
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });
  PerspectiveEditMixin.mixin(FlowPerspectiveView.prototype);
  return FlowPerspectiveView;

});
