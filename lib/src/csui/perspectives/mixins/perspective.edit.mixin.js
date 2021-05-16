/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ['require', 'csui/lib/underscore', 'csui/lib/jquery', "csui/utils/log",
      'i18n!csui/perspectives/impl/nls/lang', 'csui/models/node/node.model',
      'csui/models/widget/widget.model',
      'csui/utils/contexts/factories/connector', 'csui/utils/perspective/perspective.util'],
    function (require, _, $, log, lang, NodeModel, WidgetModel, ConnectorFactory, PerspectiveUtil) {
      'use strict';
      var CONSTANT_FIELD_TYPES = ['otcs_node_picker', 'otconws_workspacetype_id',
            'otcs_user_picker', 'otconws_metadata'];

      var PerspectiveEditMixin = {
        mixin: function (prototype) {
          return _.extend(prototype, {
            prepareForEditMode: function () {
              this.listenTo(this, 'update:widget:options',
                  function (config) {
                    var widget = config.widgetView.model.get('widget');
                    if (widget.type === 'csui/perspective.manage/widgets/perspective.widget') {
                      widget = widget.options;
                    }
                    widget.options = config.options;
                    config.widgetView.model.set('hasValidOptions', config.isValid, {
                      silent: true
                    });
                  });
            },

            _notifyAboutWidgetMigrations: function () {
              require([
                'csui/controls/globalmessage/globalmessage'
              ], function (GlobalMessage) {
                GlobalMessage.showMessage("info", lang.widgetsMigrated);
              });
            },
            _resolveWidgets: function (widgets) {
              var self          = this,
                  deferred      = $.Deferred(),
                  uniqueWidgets = _.chain(widgets)
                      .pluck('type')
                      .unique()
                      .map(function (id) {
                        return {id: id};
                      })
                      .value(),
                  allWidgets    = _.map(uniqueWidgets, function (w) {
                    return self._resolveWidget(w, true);
                  });

              function resolveDeprecates(widgetModel, widget) {
                if (widgetModel.useInstead) {
                  var migratedView = widgetModel.useInstead.get('view');
                  if (_.isFunction(migratedView.migrateData)) {
                    widget.options = migratedView.migrateData(widget.type, widget.options);
                  }
                  widget.type = widgetModel.useInstead.id;
                  widget.view = migratedView;
                  return resolveDeprecates(widgetModel.useInstead, widget);
                }
                return widgetModel;
              }

              $.whenAll.apply($, allWidgets).always(function (resolvedWidgets) {
                var foundDeprecatedWidgets = false,
                    byId                   = {};
                _.each(uniqueWidgets, function (w, index) {
                  byId[w.id] = resolvedWidgets[index];
                });

                var result = _.map(widgets, function (widget) {
                  var widgetModel = byId[widget.type];
                  var finalWidget = resolveDeprecates(widgetModel, widget);
                  if (widgetModel !== finalWidget) {
                    foundDeprecatedWidgets = true;
                  }
                  return finalWidget;
                });
                if (foundDeprecatedWidgets) {
                  self._notifyAboutWidgetMigrations();
                }
                deferred.resolve(result);
              });
              return deferred;
            },

            _resolveWidget: function (widget, supressError) {
              var self            = this,
                  deferred        = $.Deferred(),
                  _errorHandler   = function (error) {
                    if (supressError) {
                      deferred.resolve(widgetModel);
                    } else {
                      deferred.reject(error);
                    }
                  },
                  _successHandler = function () {
                    var manifest = widgetModel.get('manifest');
                    if (manifest.deprecated && manifest.useInstead) {
                      widgetModel.deprecated = manifest.deprecated;
                      self._resolveWidget({id: manifest.useInstead}).then(function (userInstead) {
                        widget.view = userInstead.view;
                        widgetModel.useInstead = userInstead;
                        deferred.resolve(widgetModel);
                      }, _errorHandler);
                    } else {
                      widget.view = widgetModel.get('view');
                      deferred.resolve(widgetModel);
                    }
                  };
              var widgetModel = new WidgetModel({id: widget.id || widget.type});
              widgetModel.fetch().then(_successHandler, _errorHandler);
              return deferred.promise();
            },
            serializeWidget: function (model, constantsDataSeed) {//constantsDataSeed: path for constant extraction
              var deferred = $.Deferred();
              var widget = model.get('widget');
              if (widget.type === 'csui/widgets/error') {
                widget = widget.options.originalWidget;
                widget = _.pick(widget, 'type', 'kind', 'options',
                    PerspectiveUtil.getExtraWidgetKeys());
                deferred.resolve({
                  widget: widget,
                });
                return deferred.promise();
              }
              if (model.get('hasValidOptions') !== false) {
                var type    = widget.type,
                    options = widget.options;
                delete options.___pman_opencallout;
                if (type === 'csui/perspective.manage/widgets/perspective.widget') {
                  type = options.widget.id;
                  widget.type = type;
                  options = options.options;
                }
                options = PerspectiveEditMixin.removeNullsInObject(options);
                this._resolveWidget(widget).done(_.bind(function (widgetModel) {
                  var widgetManifest = widgetModel ? widgetModel.get('manifest') :
                      {},
                      properties     = widgetManifest && widgetManifest.options ?
                                       widgetManifest.options : {};
                  var constantsData = [];
                  this.collectionConstantData(options, properties, constantsData,
                      constantsDataSeed + '/options');
                  widget = _.pick(widget, 'type', 'kind', PerspectiveUtil.getExtraWidgetKeys());
                  widget.options = options;
                  deferred.resolve({
                    widget: widget,
                    constantsData: constantsData
                  });
                }, this)).fail(function (error) {
                  deferred.reject({
                    error: lang.invalidWidget
                  });
                });
              } else {
                deferred.reject({
                  error: lang.invalidWidgetOptions
                });
              }
              return deferred.promise();
            },
            collectionConstantData: function (data, options, constants, seed) {
              if (_.isEmpty(options)) {
                return;
              }
              if (_.isArray(data)) {
                _.each(data, function (value, key) {
                  this.collectionConstantData(value, options.items, constants, seed + '/' + key);
                }, this);
              } else if (_.isObject(data)) {
                _.each(data, function (value, key) {
                  if (!!options.fields && !!options.fields[key]) {
                    this.collectionConstantData(value, options.fields[key], constants,
                        seed + '/' + key);
                  }
                }, this);
              } else if (CONSTANT_FIELD_TYPES.indexOf(options.type) !== -1) {
                constants.push({
                  type: options.type,
                  path: seed
                });
              }
            },
            executeCallbacks: function (models, perspectiveModel, context) {
              if (this.options.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE) {
                return $.Deferred().resolve().promise();
              }
              this.perspectiveWidgets = models;
              var deferred = $.Deferred();
              models = _.filter(models, function (config) {
                return config.widget.type !== 'csui/widgets/error';
              });
              this.loadCallbacks(models).then(_.bind(function (widgetsWithCallback) {
                var promises = _.map(widgetsWithCallback,
                    _.bind(function (widgetWithCallback) {
                      return this.initializeWidget(widgetWithCallback, perspectiveModel, context);
                    }, this));
                $.whenAll.apply($, promises)
                    .then(function () {
                      deferred.resolve();
                    }, function (error) {
                      deferred.reject(error);
                    });
              }, this));
              return deferred.promise();
            },

            loadCallbacks: function (models) {
              var self     = this,
                  deferred = $.Deferred(),
                  promises = _.chain(models)
                      .groupBy(function (model) {
                        return model.widget.type;
                      })
                      .map(function (widgetType) {
                        var deferredEach = $.Deferred();
                        self._resolveWidget(_.pick(widgetType[0].widget, 'type')).done(
                            function (widgetModel) {
                              var widgetManifest = widgetModel ? widgetModel.get('manifest') :
                                                   false,
                                  widgetCallback = widgetManifest ? widgetManifest.callback : false;
                              if (widgetCallback) {
                                require([widgetCallback], function (callback) {
                                  if (callback && _.isFunction(callback)) {
                                    widgetModel.type = widgetModel.id;
                                    deferredEach.resolve(_.extend(widgetModel, new callback()));
                                  } else {
                                    deferredEach.reject();
                                  }
                                }, function (error) {
                                  log.warn('Failed to load callback. {0}', error);
                                  deferredEach.reject(error);
                                });
                              } else {
                                deferredEach.resolve();
                              }
                            }).fail(function () {
                          deferredEach.resolve();
                        });
                        return deferredEach.promise();
                      })
                      .compact()
                      .value();
              $.whenAll.apply($, promises)
                  .then(function (results) {
                    deferred.resolve(_.compact(results));
                  });
              return deferred.promise();
            },

            initializeWidget: function (widgetWithCallback, perspectiveModel, context) {
              var deferred   = $.Deferred(),
                  widgets    = _.filter(this.perspectiveWidgets, function (widget) {
                    return widget.widget.type === widgetWithCallback.type;
                  }),
                  mode       = perspectiveModel.get('id') ? 'update' :
                               'create',
                  settings   = {
                    priority: parseInt(perspectiveModel.get('priority')) || undefined,
                    title: perspectiveModel.get('title') || '',
                    overrideType: perspectiveModel.get('overrideType'),
                    scope: perspectiveModel.get('scope') || '',
                    containerType: parseInt(perspectiveModel.get('containerType')) ||
                                   undefined,
                    perspectiveParentId: parseInt(perspectiveModel.get('override_id')) ||
                                         parseInt(perspectiveModel.get('perspectivesVolId')) ||
                                         undefined,
                    overrideObjId: parseInt(perspectiveModel.get('node')) || undefined,
                    assetContainerId: perspectiveModel.get('assetContainerId') || undefined
                  },
                  parameters = {
                    mode: mode,
                    widgets: widgets,
                    settings: settings,
                    connector: context.getObject(ConnectorFactory)
                  };
              if (mode == 'update') {
                var previousPerspectiveWidgets = this.getPreviousWidgets &&
                                                 this.getPreviousWidgets(perspectiveModel);
                parameters.previousWidgets = _.filter(previousPerspectiveWidgets,
                    function (widget) {
                      return widget.widget.type === widgetWithCallback.type;
                    });
              }
              var callbackPromise = this.getHiddenWidgetOptions(widgetWithCallback, parameters,
                  perspectiveModel),
                  that            = this;
              $.when(callbackPromise)
                  .done(_.bind(function (responseParameters) {
                    deferred.resolve();
                  }, this))
                  .fail(function (error) {
                    deferred.reject(error[0] || error);
                  });
              return deferred.promise();
            },

            getHiddenWidgetOptions: function (widgetWithCallback, parameters, perspectiveModel) {
              var deferredOptions        = $.Deferred(),
                  deferredContainer      = $.Deferred(),
                  widgetPromises         = [],
                  errors                 = [],
                  ensureContainerPromise = deferredContainer.promise(), // note: no response argument - i.e. an empty promise
                  useOverrideContainer   = false;
              if (!widgetWithCallback || !_.has(widgetWithCallback, 'defineWidgetOptionsCommon') ||
                  !_.has(widgetWithCallback, 'defineWidgetOptionsEach')) {
                deferredOptions.reject();
                return deferredOptions.promise();
              }
              if (_.has(widgetWithCallback, 'ensureContainer') &&
                  _.isFunction(widgetWithCallback.ensureContainer)) {
                if (widgetWithCallback.ensureContainer(parameters)) {
                  ensureContainerPromise = this.ensureContainer(parameters);
                } else {
                  useOverrideContainer = true;
                }
              } else {
                useOverrideContainer = true;
              }

              if (useOverrideContainer) {
                deferredContainer.resolve();
              }

              $.when(ensureContainerPromise).done(function (response) {

                if (!_.has(parameters.settings, 'assetContainerId') ||
                    _.isUndefined(parameters.settings.assetContainerId)) {
                  var id = (response) ? response.id : parameters.settings.overrideObjId, // no response if ensureContainer was an empty promise
                      ac = {assetContainerId: id};

                  _.extend(parameters.settings, ac); // the containerId is required by the callback
                  perspectiveModel.set(ac);
                }

                var promiseBefore = widgetWithCallback.defineWidgetOptionsCommon(parameters);
                if (!promiseBefore || typeof promiseBefore != 'object' ||
                    !_.has(promiseBefore, 'state')) {
                  deferredOptions.reject();
                  return deferredOptions.promise();
                }
                $.when(promiseBefore).done(function (commonOptions) {
                  if (_.has(parameters, 'widgets') && _.isArray(parameters.widgets)) {

                    _.each(parameters.widgets, function (item, index) {

                      if (!_.has(item, 'newOptions')) {
                        item.newOptions = {};
                      }

                      _.extend(item.newOptions, commonOptions);
                      widgetPromises.push(widgetWithCallback.defineWidgetOptionsEach(item,
                          parameters));
                      $.when(widgetPromises[index])
                          .done(function (newOptions) {
                            _.extend(item.newOptions, newOptions);
                          })
                          .fail(function (errorMsg) {
                            errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                          });
                    });
                    $.when.apply(this, widgetPromises)
                        .done(function () {
                          deferredOptions.resolve(parameters);
                        })
                        .fail(function (errorMsg) {
                          errors.push(errorMsg);
                          deferredOptions.reject(errors); // errors array returned to perspective manager
                        });
                  }

                })
                    .fail(function (errorMsg) {
                      errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                      deferredOptions.reject(errors);
                    });
              })
                  .fail(function (error) {
                    deferredContainer.reject(error);
                    deferredOptions.reject([error]);
                  });

              return deferredOptions.promise();
            },

            ensureContainer: function (parameters) {

              var deferredContainer = $.Deferred();

              function uniqueId() {
                return _.now() + Math.random().toString().substring(2);
              }
              if (_.has(parameters.settings, 'assetContainerId') &&
                  !isNaN(parseInt(parameters.settings.assetContainerId))) {
                deferredContainer.resolve(false);
              } else {
                this.perspectiveAssetsVolume = new NodeModel(
                    {
                      id: 'volume',
                      type: 954
                    },
                    {
                      connector: parameters.connector
                    });
                this.perspectiveAssetsVolume.fetch().then(_.bind(function () {
                  var collectOptions = {
                    url: parameters.connector.connection.url + '/nodes',
                    type: 'POST',
                    data: {
                      type: 955,
                      parent_id: this.perspectiveAssetsVolume.get('id'),
                      name: 'assets_' + uniqueId()
                    },
                    success: function (response) {
                      deferredContainer.resolve(response);
                    },
                    error: function (error) {
                      deferredContainer.reject(error.responseJSON);
                    }
                  };

                  parameters.connector.makeAjaxCall(collectOptions).done(function (resp) {
                    deferredContainer.resolve(resp);
                  }).fail(function (resp) {
                    deferredContainer.reject(resp);
                  });
                }, this));
              }

              return deferredContainer.promise();
            },
            getEmptyPlaceholderWidget: function (options) {
              options || (options = this.options);
              return {
                type: PerspectiveUtil.getEmptyPlaceholderWidgetType(options.perspectiveMode),
                className: 'csui-draggable-item-disable',
                __isPlacehoder: true, // To differentiate this from general shortcutgroup widget
                options: {}
              };
            },

            isEmptyPlaceholder: function (widget) {
              return PerspectiveUtil.isEmptyPlaceholder(widget, this.options.perspectiveMode);
            },
            validateAndGenerateWidgetId: function (widgets) {
              _.each(widgets, function (w, index) {
                if (!PerspectiveUtil.hasWidgetId(w)) {
                  w[PerspectiveUtil.KEY_WIDGET_ID] = PerspectiveUtil.generateWidgetId(
                      this.options.perspectiveMode) + index;
                }
              }, this);

              var widgetIds = _.pluck(widgets, PerspectiveUtil.KEY_WIDGET_ID);
              if (widgetIds.length !== _.uniq(widgetIds).length) {
                log.warn('Found duplicate widget IDs: {0}', widgetIds) && console.warn(log.last);
                return false;
              }
              var allWidgetsHasIds = _.every(widgets, PerspectiveUtil.hasWidgetId);
              if (!allWidgetsHasIds) {
                log.warn('Found widgets with No Ids: {0}', widgets) && console.warn(log.last);
                return false;
              }
              return true;
            }
          });
        },
        removeNullsInObject: function (obj) {

          function _checkAndRemove(value, key) {
            if (typeof value === 'object' || _.isArray(value)) {
              PerspectiveEditMixin.removeNullsInObject(value);
            }
            if (_.isNull(value) || _.isUndefined(value) || value.length === 0 ||
                (_.isObject(value) && _.isEmpty(value))) {
              if (_.isArray(obj)) {
                obj.splice(key, 1);
              } else {
                delete obj[key];
              }
            }
          }

          if (_.isArray(obj)) {
            for (var i = obj.length - 1; i >= 0; i--) {
              _checkAndRemove(obj[i], i);
            }
          } else {
            _.each(obj, _checkAndRemove);
          }
          return obj;
        }
      };

      return PerspectiveEditMixin;
    });
