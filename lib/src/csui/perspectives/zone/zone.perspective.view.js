/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/perspectives/mixins/perspective.edit.mixin',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/zone/impl/zone.perspective'
], function (module, _, $, Backbone, Marionette, base, GridView, WidgetContainerBehavior,
    PerspectiveEditMixin) {

  var config = module.config();

  var ZonePerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-zone-perspective grid-rows ',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model, cellView) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        model: undefined,
        perspectiveMode: this.options.perspectiveMode,
        widgetContainer: cellView
      };
    },

    cellConstructionFailed: function (model, error) {
      var widget = model.get('widget');
      if (widget) {
        var errorWidget = WidgetContainerBehavior.getErrorWidget(widget, error.message);
        model.set('widget', _.defaults(errorWidget, widget.attributes));
      }
    },

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    constructor: function ZonePerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      options.collection.each(function (row, rowIndex) {
        row.columns.each(function (column, colIndex) {
          column.get('widget').cellAddress = 'grid0:r' + rowIndex + ':c' + colIndex;
        });
      });
      if (options.perspectiveMode === 'edit') {
        this.prepareForEditMode();
      }
      GridView.prototype.constructor.call(this, options);
    },

    _createCollection: function (options) {
      var rows      = new Backbone.Collection(),
          zoneNames = getOption.call(this, 'zoneNames');
      _.extend(config, {'unSupportedWidgets': getOption.call(this, 'unSupportedWidgets')});
      _.mapObject(options, function (val, key) {
        if (_.contains(zoneNames, key)) {
          if (!base.filterUnSupportedWidgets(val, config)) {
            options[key] = undefined;
          }
        }
      });

      var layoutName = this._getLayoutName(options);

      if (layoutName) {
        var zoneLayouts = getOption.call(this, 'zoneLayouts'),
            zoneLayout  = zoneLayouts[layoutName];
        if (zoneLayout) {
          var row     = rows.add({}),
              columns = _.map(zoneLayout.zoneOrder, function (zone) {
                var zoneConfig = _.defaults({
                  widget: options[zone]
                }, zoneLayout.zoneSizes[zone]);
                if (options[zone].className) {
                  zoneConfig.className = (zoneConfig.className || '') + ' ' + options[zone].className;
                }
                return zoneConfig;
              });

          row.columns = new Backbone.Collection(columns);
        } else {
          throw new Marionette.Error({
            name: 'InvalidLayoutContentError',
            message: 'Missing widget in the important perspective zone'
          });
        }
      }
      return rows;
    },
    _getLayoutName: function (options) {
      var zoneNames = getOption.call(this, 'zoneNames');
      return _.reduce(zoneNames, function (result, zone) {
        if (options[zone] && !_.isEmpty(options[zone])) {
          result && (result += '-');
          result += zone;
        }
        return result;
      }, '');
    },

    enumerateWidgets: function (callback) {
      var zoneNames = getOption.call(this, 'zoneNames'),
          widgets   = _.compact(_.map(zoneNames, function (zone) {
            var zoneContent = this.options[zone];
            return !_.isEmpty(zoneContent) && zoneContent;
          }, this));

      if (this.options.perspectiveMode === 'edit') {
        var deferreds = _.map(widgets, function () {
          var deferred = $.Deferred();
          callback(deferred);
          return deferred;
        });
        this._resolveWidgets(widgets).then(function (widgetModel) {
          _.each(widgets, function (widget, index) {
            deferreds[index].resolve(widget);
          });
        });
      } else {
        _.each(widgets, callback, this);
      }
    },
    serializeOptions: function (perspectiveModel) {
      var self        = this,
          deferred    = $.Deferred(),
          layoutName  = this._getLayoutName(this.options),
          zoneLayouts = getOption.call(this, 'zoneLayouts'),
          zoneLayout  = zoneLayouts[layoutName],
          cells       = this.collection.at(0).columns;
      var widgetPromises = _.map(zoneLayout.zoneOrder, function (zone, index) {
        if (cells.at(index).get('widget').type ===
            'csui/perspective.manage/widgets/perspective.placeholder') {
          return $.Deferred().resolve({
            zone: zone,
            config: {widget: {}}
          });
        }
        return self.serializeWidget(cells.at(index), '/options/' + zone).then(function (result) {
          return {
            zone: zone,
            config: result
          };
        });
      });

      $.whenAll.apply($, widgetPromises).done(function (results) {
        var widgets = _.map(_.filter(results, function (layout) {
          return layout.config && layout.config.widget && !_.isEmpty(layout.config.widget);
        }), function (layout) {
          return layout.config;
        });
        self.executeCallbacks(widgets, perspectiveModel, self.options.context).done(function () {
          deferred.resolve(results);
        }).fail(function (results) {
          results = _.filter(results, function (result) {return !!result.error});
          deferred.reject(results[0].error);
        });
      }).fail(function (results) {
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });

      return deferred.promise();
    },

    getPreviousWidgets: function (perspectiveModel) {
      var perspective     = perspectiveModel.get('perspective'),
          layoutName      = this._getLayoutName(this.options),
          zoneLayouts     = getOption.call(this, 'zoneLayouts'),
          zoneLayout      = zoneLayouts[layoutName],
          previousWidgets = {};

      if (zoneLayout && zoneLayout.zoneOrder) {
        previousWidgets = _.map(_.filter(zoneLayout.zoneOrder, function (zone) {
          return perspective && perspective.options && !_.isEmpty(perspective.options[zone]);
        }), function (zone) {
          return {widget: perspective.options[zone]};
        });
      }

      return previousWidgets;
    }

  });
  function getOption(property, source) {
    var value;
    if (source) {
      value = source[property];
    } else {
      value = getOption.call(this, property, this.options || {});
      if (value === undefined) {
        value = this[property];
      }
    }
    return _.isFunction(value) ? value.call(this) : value;
  }
  PerspectiveEditMixin.mixin(ZonePerspectiveView.prototype);

  return ZonePerspectiveView;

});
