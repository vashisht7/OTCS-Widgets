/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper', 'csui/utils/url',
  'csui/models/perspective/perspective.template.model',
  'csui/models/perspective/perspective.model',
  'csui/utils/perspective/perspective.util',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, CommandModel, CommandHelper,
    Url, PerspectiveTemplateModel, PerspectiveModel, PerspectiveUtil, lang) {
  'use strict';
  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/contexts/perspective'] || {};
  config = _.extend({
    enableInlinePerspectiveEditing: true,
    enablePersonalization: true
  }, config, module.config());

  var ConnectorFactory, NodeModelFactory, AncestorCollectionFactory;

  var EditPerspectiveCommand = CommandModel.extend({

    defaults: {
      signature: 'EditPerspective',
      name: lang.EditPerspective
    },

    enabled: function (status, options) {
      var context     = status.context || options && options.context,
          perspective = context.perspective;
      if (!perspective) {
        return false;
      }
      return this._enablePersonalizePage(perspective, options, context) ||
             this._enableEditPerspective(perspective) ||
             this._enableCreatePerspective(perspective, context);
    },
    _enablePersonalizePage: function (perspective, options, context) {
      var enable = (config.enablePersonalization || options.enablePersonalization) &&
                   !context._applicationScope.get('id') && // Landing Page only
                   perspective.get('type') === 'flow' /** && perspective.has('override') &&
           !!perspective.get('override').perspective_version*/;
      if (!enable) {
        return enable;
      }
      var perspectiveOptions = perspective.get('options');
      var allWidgetsHasIds = perspectiveOptions &&
                             _.every(perspectiveOptions.widgets, PerspectiveUtil.hasWidgetId);
      return allWidgetsHasIds;
    },

    _enableEditPerspective: function (perspective) {
      return (perspective.has('id') || perspective.has('perspective_id')) &&
             perspective.get('canEditPerspective');
    },

    _enableCreatePerspective: function (perspective, context) {
      return !(perspective.has('id') || perspective.has('perspective_id')) &&
             perspective.get('canEditPerspective') &&
             context._applicationScope.get('id') === "node";
    },

    execute: function (status, options) {
      var deferred    = $.Deferred(),
          context     = status.context || options && options.context,
          perspective = context.perspective;

      if (perspective.has('id')) {
        this._fetchPerspective(context, perspective).then(_.bind(function (perspectiveModel) {
          if (perspectiveModel) {
            this._continueExecution(status, options, deferred, perspectiveModel);
          }
        }, this), deferred.reject);
      } else {
        this._continueExecution(status, options, deferred);
      }
      return deferred.promise();
    },

    _continueExecution: function (status, options, deferred, perspectiveModel) {
      var context                 = status.context || options && options.context,
          perspective             = context.perspective,
          enablePersonalization   = this._enablePersonalizePage(perspective, options, context),
          enableEditPerspective   = this._enableEditPerspective(perspective),
          enableCreatePerspective = this._enableCreatePerspective(perspective, context);
      if (enablePersonalization) {
        if (enableEditPerspective || enableCreatePerspective) {
          this._promptToChooseEditPage(status, options, context, deferred, perspectiveModel);
        } else {
          this._doPersonalizePage(status, options, context, deferred);
        }
      } else {
        this._doEditPage(status, options, context, deferred, perspectiveModel);
      }
    },

    _fetchPerspective: function (context, perspective) {
      var deferred      = $.Deferred(),
          perspectiveId = perspective.get('id') ||
                          perspective.get('perspective_id');
      require(['csui/utils/contexts/factories/connector', 'csui/dialogs/modal.alert/modal.alert'],
          _.bind(function (ConnectorFactory, alertDialog) {
            var perspectiveTemplate = new PerspectiveTemplateModel(
                {id: perspectiveId},
                {connector: context.getObject(ConnectorFactory)});
            perspectiveTemplate.fetch().then(_.bind(function () {
              var allPerspectives = perspectiveTemplate.get('perspectives');
              if (allPerspectives && allPerspectives.length != 1) {
                alertDialog.showError(lang.editPerspectiveErrorMessage)
                    .done(function () {
                      deferred.resolve();
                    })
                    .fail(deferred.reject);
              } else {
                deferred.resolve(allPerspectives.at(0));
              }

            }, this), deferred.reject);
          }, this));
      return deferred.promise();
    },

    _doPersonalizePage: function (status, options, context, deferred) {
      require(['csui/perspective.manage/pman.view', 'csui/utils/contexts/factories/node',
            'csui/models/perspective/personalization.model', 'csui/utils/contexts/factories/connector',
            'csui/utils/contexts/factories/application.scope.factory',
            'csui/utils/contexts/factories/user'],
          function (PManView, NodeModelFactory, PersonalizationModel, ConnectorFactory,
              ApplicationScopeModelFactory, UserModelFactory) {
            var applicationScope = context.getModel(ApplicationScopeModelFactory),
                sourceModel;
            if (applicationScope.id == 'node') {
              sourceModel = CommandHelper.getJustOneNode(status) ||
                            context.getModel(NodeModelFactory);
            } else {
              sourceModel = context.getModel(UserModelFactory);
            }
            var currentPerspective = sourceModel.get('perspective'),
                overrideInfo       = currentPerspective.override,
                defPersonal        = _.pick(currentPerspective, 'type', 'options',
                    'perspective_version',
                    'perspective_id');
            defPersonal = _.defaults(defPersonal,
                _.pick(overrideInfo, 'perspective_version', 'perspective_id'));
            defPersonal.perspective_id = defPersonal.perspective_id ||
                                         currentPerspective.id;
            var personalization = new PersonalizationModel({},
                {
                  context: context,
                  connector: context.getObject(ConnectorFactory),
                  sourceModel: sourceModel,
                  perspective: currentPerspective,
                });
            personalization.setPerspective(defPersonal);
            PersonalizationModel.loadPersonalization(sourceModel, context).then(
                function (result) {
                  if (!!result) {
                    personalization.setPerspective(result);
                  }
                  var pmanView = new PManView({
                    context: context,
                    perspective: personalization,
                    mode: PerspectiveUtil.MODE_PERSONALIZE
                  });
                  pmanView.show();
                  deferred.resolve();
                });
          }, deferred.reject);
    },

    _doEditPage: function (status, options, context, deferred, perspectiveModel) {
      if (this._enableEditPerspective(context.perspective)) {
        this._doEditPerspective(status, options, context, deferred, perspectiveModel);
      } else if (this._enableCreatePerspective(context.perspective, context)) {
        this._doCreatePerspective(status, options, context, deferred);
      }
    },

    _doCreatePerspective: function (status, options, context, deferred) {
      var isInlineEditing = (options && options.inlinePerspectiveEditing) ||
                            config.enableInlinePerspectiveEditing;
      if (isInlineEditing) {
        this._createInline(status, options, context, deferred);
      } else {
        this._createInClassicPMan(status, options, context, deferred);
      }
    },

    _doEditPerspective: function (status, options, context, deferred, perspectiveModel) {
      var isInlineEditing = (options && options.inlinePerspectiveEditing) ||
                            config.enableInlinePerspectiveEditing;
      if (isInlineEditing) {
        this._editInline(perspectiveModel, context, deferred);
      } else {
        this._editInClassicPMan(status, options, context, deferred);
      }
    },

    _promptToChooseEditPage: function (status, options, context, deferred, perspectiveModel) {
      var self = this;
      require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        self.dialog = alertDialog.confirmQuestion(lang.editPageDialogMessage,
            lang.editPageTitle,
            {
              buttons: {
                showYes: true,
                labelYes: lang.editPageButton,
                showNo: true,
                labelNo: lang.personalizePageButton,
                showCancel: true,
                labelCancel: lang.editPageCancelButton
              },
            }).then(function (result) {
          if (result === true) {
            self._doEditPage(status, options, context, deferred, perspectiveModel);
          }
        }, function (result) {
          if (result === false) {
            self._doPersonalizePage(status, options, context, deferred);
          } else {
            deferred.resolve();
          }
        });
      }, deferred.reject);
    },

    _editInline: function (perspectiveModel, context, deferred) {
      require(['csui/perspective.manage/pman.view'],
          function (PManView) {
            var perspectiveId = context.perspective.get('id') ||
                                context.perspective.get('perspective_id');
            var currentPerspective = perspectiveModel;
            currentPerspective.set('id', perspectiveId);
            var pmanView = new PManView({
              context: context,
              perspective: currentPerspective
            });
            pmanView.show();
            deferred.resolve();
          }, deferred.reject);
    },

    _editInClassicPMan: function (status, options, context, deferred) {
      var self = this;
      require(['csui/utils/contexts/factories/connector'
      ], function () {
        ConnectorFactory = arguments[0];
        var f = self._getEditForm(context, status);
        f.submit();
        f.remove();
        deferred.resolve();
      }, deferred.reject);
    },

    _getEditForm: function (context, status) {
      var f = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
        action: this._getUrl(context, status)
      }).appendTo(document.body);

      var params = this._getEditUrlQueryParameters(context);

      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          $('<input type="hidden" />').attr({
            name: i,
            value: params[i]
          }).appendTo(f);
        }
      }

      return f;
    },

    _getUrl: function (context, status) {
      var connector      = context.getObject(ConnectorFactory),
          cgiUrl         = new Url(connector.connection.url).getCgiScript(),
          perspectiveUrl = cgiUrl.toString() + "/perspectivemgr";
      return perspectiveUrl;
    },

    _getEditUrlQueryParameters: function (context) {
      var perspective_id = context.perspective.attributes.id,
          parameters;
      if (perspective_id !== undefined && perspective_id > 0) {
        parameters = {
          perspective_id: perspective_id
        };
      } else {
        parameters = {};
      }
      return parameters;
    },
    _preparePerspectiveConfig: function (context) {
      var perspectiveConfig = {
            "perspective": {
              "type": "flow",
              "options": {
                "widgets": [
                  {
                    "type": "csui/widgets/nodestable"
                  }
                ]
              }
            },
            "overrideType": "genericContainer",
            "scope": "local",
            "containerType": "-1",
            "cascading": "false"
          },
          node              = CommandHelper.getJustOneNode(status) ||
                              context.getModel(NodeModelFactory),
          collection        = context.getCollection(AncestorCollectionFactory);
      perspectiveConfig.nodepath = this._getNodePath(collection);
      perspectiveConfig.node = node.get('id');
      perspectiveConfig.containerType = node.get('type');
      perspectiveConfig.title = node.get('name');
      return perspectiveConfig;
    },

    _createInline: function (status, options, context, deferred) {
      var self = this;
      require(['csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/connector',
        'csui/utils/contexts/factories/ancestors',
        'csui/perspective.manage/pman.view'
      ], function () {
        NodeModelFactory = arguments[0];
        ConnectorFactory = arguments[1];
        AncestorCollectionFactory = arguments[2];
        var PManView          = arguments[3],
            perspectiveConfig = self._preparePerspectiveConfig(context, NodeModelFactory,
                AncestorCollectionFactory);
        perspectiveConfig.title = perspectiveConfig.title + ' ' + new Date().getTime();
        var perspective = new PerspectiveModel(perspectiveConfig,
            {connector: context.getObject(ConnectorFactory)});
        var pmanView = new PManView({
          context: context,
          perspective: perspective
        });
        pmanView.show();
        deferred.resolve();
      }, deferred.reject);
    },

    _createInClassicPMan: function (status, options, context, deferred) {
      var self = this;
      require(['csui/utils/contexts/factories/connector',
        'csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/ancestors'
      ], function () {
        ConnectorFactory = arguments[0];
        NodeModelFactory = arguments[1];
        AncestorCollectionFactory = arguments[2];
        var f = self._getCreateForm(context, status);
        f.submit();
        f.remove();
        deferred.resolve();
      }, deferred.reject);
    },

    _getCreateForm: function (context, status) {
      var f = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
        action: this._getUrl(context, status)
      }).appendTo(document.body);

      var params = this._getCreateUrlQueryParameters(context, status);

      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          $('<input type="hidden" />').attr({
            name: i,
            value: params[i]
          }).appendTo(f);
        }
      }

      return f;
    },

    _getCreateUrlQueryParameters: function (context, status) {
      var perspectiveConfig = this._preparePerspectiveConfig(context, NodeModelFactory,
          AncestorCollectionFactory);
      perspectiveConfig.ui = {
        "elements": {
          "btn-mode-code": true,
          "btn-view-general": true,
          "btn-view-rules": false,
          "btn-view-layout": true,
          "btn-view-widgets": true,

          "view-perspective-action": true,
          "perspective-action-create": true,
          "perspective-action-edit": true,
          "perspective-action-copy": true,

          "view-perspective-form": true,
          "perspective-title": true,
          "perspective-type": true,
          "perspective-scope": true,
          "perspective-nodetypes": true,
          "perspective-node": true,
          "perspective-cascading": true,

          "display-size-msg": false,
          "rules-code": true,

          "layout-flow": true,
          "layout-left-center-right": true,
          "layout-grid": false,
          "layout-tabbed": false
        },
        "widgetGroupsBlacklist": [],
        "widgetsWhitelist": [],
        "disableGrouping": false
      };
      return {
        config: JSON.stringify(perspectiveConfig)
      };
    },

    _getNodePath: function (collection) {
      var nodepath = "";
      collection.each(function (model) {
        nodepath += nodepath ? ':' : '';
        nodepath += model.get('name');
      });
      return nodepath;
    }

  });

  return EditPerspectiveCommand;
});
