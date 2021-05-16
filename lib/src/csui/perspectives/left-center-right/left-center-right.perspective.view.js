/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/perspectives/zone/zone.perspective.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'i18n!csui/perspectives/impl/nls/lang',
], function (require, module, $, _, ZonePerspectiveView, WidgetContainerBehavior, commonLang) {

  var config = module.config();
  _.defaults(config, {
    zoneNames: ['left', 'center', 'right'],
    zoneLayouts: {
      'center': {
        zoneOrder: ['center'],
        zoneSizes: {
          center: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left': {
        zoneOrder: ['left'],
        zoneSizes: {
          left: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'right': {
        zoneOrder: ['right'],
        zoneSizes: {
          right: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-center': {
        zoneOrder: ['center', 'left'],
        zoneSizes: {
          left: {
            sizes: {
              "md": 4,
              "xl": 3
            },
            "pulls": {
              "md": 8,
              "xl": 9
            },
            heights: {
              xs: 'full'
            }
          },
          center: {
            sizes: {
              "md": 8,
              "xl": 9
            },
            "pushes": {
              "md": 4,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'center-right': {
        zoneOrder: ['center', 'right'],
        zoneSizes: {
          center: {
            sizes: {
              "md": 8,
              "xl": 9
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "md": 4,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-right': {
        zoneOrder: ['left', 'right'],
        zoneSizes: {
          left: {
            sizes: {
              "md": 6
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "md": 6
            },
            heights: {
              xs: 'full'
            }
          }
        }
      },
      'left-center-right': {
        zoneOrder: ['center', 'left', 'right'],
        zoneSizes: {
          left: {
            sizes: {
              "sm": 6,
              "md": 6,
              "lg": 3,
              "xl": 3
            },
            "pulls": {
              "lg": 6,
              "xl": 6
            },
            heights: {
              xs: 'full'
            }
          },
          center: {
            sizes: {
              "sm": 12,
              "md": 12,
              "lg": 6,
              "xl": 6
            },
            "pushes": {
              "lg": 3,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          },
          right: {
            sizes: {
              "sm": 6,
              "md": 6,
              "lg": 3,
              "xl": 3
            },
            heights: {
              xs: 'full'
            }
          }
        }
      }
    }
  });

  var LeftCenterRightPerspectiveView = ZonePerspectiveView.extend({

    className: function () {
      var className       = 'cs-left-center-right-perspective',
          parentClassName = _.result(ZonePerspectiveView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    zoneNames: config.zoneNames,
    zoneLayouts: config.zoneLayouts,
    unSupportedWidgets: config.unSupportedWidgets,

    constructor: function LeftCenterRightPerspectiveView(options) {
      if (!!options && options.perspectiveMode === 'edit') {
        this._prepareForEditMode(options);
      }
      ZonePerspectiveView.prototype.constructor.apply(this, arguments);
      if (!!options && options.perspectiveMode === 'edit') {
        this._registerEditEvents();
      }
    },
    _prepareForEditMode: function (options) {
      if (!options.left || _.isEmpty(options.left.type)) {
        options.left = {
          kind: 'tile',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }
      if (!options.center || _.isEmpty(options.center.type)) {
        options.center = {
          kind: 'fullpage',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }
      if (!options.right || _.isEmpty(options.right.type)) {
        options.right = {
          kind: 'tile',
          type: 'csui/perspective.manage/widgets/perspective.placeholder'
        };
      }

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this
        }
      };
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widget) {
        if (self.getPManPlaceholderWidget) { // Provided by pman.config.behaviour
          var newWidget = self.getPManPlaceholderWidget();
          this._resolveWidget(newWidget).done(function () {
            widget.model.set('widget', newWidget);
          });
        }
      });
      this.listenTo(this, 'replace:widget', function (widgetView, widgetToReplace) {
        var self = this;
        this._resolveWidget(widgetToReplace).done(function () {
          self.options.context.clear();
          widgetView.model.set('widget', widgetToReplace);
          self.options.context.fetch();
        });
      }.bind(this));
    },
    serializePerspective: function (perspectiveModel) {
      var self     = this,
          deferred = $.Deferred();
      var optionsPromise = this.serializeOptions(perspectiveModel);
      optionsPromise.then(function (results) {
        var constant_data     = _.flatten(results.map(function (result) {
              return result.config.constantsData || [];
            })),
            options           = _.reduce(results, function (seed, result) {
              seed[result.zone] = result.config.widget;
              return seed;
            }, {}),
            perspectiveResult = {
              perspective: {
                type: 'left-center-right',
                options: options
              },
              constant_data: constant_data,
              constant_extraction_mode: 1
            };
        var allWidgets = _.reject(_.values(options), _.isEmpty);
        var isAllWidgetsValid = self.validateAndGenerateWidgetId(allWidgets);
        if (!isAllWidgetsValid) {
          deferred.reject(commonLang.widgetValidationFailed);
        } else {
          deferred.resolve(perspectiveResult);
        }
      }, deferred.reject);
      return deferred.promise();
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  return LeftCenterRightPerspectiveView;

});
