/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/models/node.actions',
  'csui/dialogs/modal.alert/modal.alert',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/models/workflow/workflow.model',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang'
], function ($, _, CommandHelper, OpenClassicPageCommand, ApplicationScopeModelFactory, NodeActionCollection, ModalAlert, WorkitemModelFactory, WorkflowModel, lang) {
  'use strict';
  var GlobalMessage,
      ConnectorFactory;

  var InitiateWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateWorkflow',
      command_key: ['initiateworkflow'],
      scope: 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 128 && (node.get('openable') || node.actions.get('initiateworkflow'));
    },
    execute: function (status, options) {
      return this._getActionParameters(status, options)
        .then(_.bind(function (action) {
          var resp = action.get("body");
          resp = resp && JSON.parse(resp);
          if (resp && !resp.showStartStep) {

            var popupOptions = { centerVertically: true, buttons: ModalAlert.buttons.OkCancel },
              message = _.str.sformat(lang.StartWorkflowSingleMessage, status.nodes.models[0].get("name")),
              context = status.context || options && options.context,
              attrs = {},
              workItem;

            if (status.isDoc && status.mapsList && status.mapsList.length > 0) {
              workItem = context.getModel(WorkitemModelFactory);

              attrs.isDoc = status.isDoc;
              attrs.docModels = status.docModel;
              attrs.parent_id = status.parent_id;
              attrs.status = status;
              attrs.url_org = status.url_org;
              attrs.isNewDraft = true; // created label to verify from start workflow or browser back button

              workItem.set(attrs, { silent: true });
              workItem.set({ 'doc_id': status.doc_id, 'doc_names': status.docNames });
            }

            ModalAlert.confirmQuestion(message, lang.StartWorkflowTitle, popupOptions)
              .always(_.bind(function (result) {
                if (result) {
                  return this._startWorkflow(status, options, resp);
                }
                else {
                  return $.Deferred().resolve();
                }
              }, this));
          }
          else {
            return this._intiateWorkflow(status, options, resp);
          }
        }, this));
    },

    _startWorkflow: function (status, options, action) {

      var deferred = $.Deferred(), originatingView;
      var node = CommandHelper.getJustOneNode(status);
      status.workflow_parent_id = node.get("parent_id");
      if (node.get('type') === 1) {
        node = node.original;
      }

      if (options && options.originatingView) {
        originatingView = options.originatingView;
      }
      else if (status && status.originatingView) {
        originatingView = status.originatingView;
      }

      if (originatingView) {
        originatingView.blockActions();
      }
      require(['csui/controls/globalmessage/globalmessage',
        'csui/utils/contexts/factories/connector' // Factory for the server connector
      ], function () {
        GlobalMessage = arguments[0];
        ConnectorFactory = arguments[1];

        options = options || {};
        var context = status.context || options && options.context,
        connector = context.getObject(ConnectorFactory, options),
        workflow = new WorkflowModel({
          workflow_id: node.get('id'),
          DocIDs: status.doc_id
        },
        _.extend(options, {
          connector: connector
        }));
        workflow.startWorkflow()
          .done(_.bind(function (resp) {
            var successMsg = lang.SuccessInitiateMessage;
            if (resp && resp.custom_message) {
              successMsg = resp.custom_message;
            }
            GlobalMessage.showMessage('success', successMsg);
            deferred.resolve();
          }, this))
          .fail(_.bind(function (error) {
            if (error.responseJSON) {
              GlobalMessage.showMessage('error', error.responseJSON.error);
            }
            deferred.reject();
          }, this))
          .always(function() {
            if (originatingView) {
              originatingView.unblockActions();
            }
            if (status.isDoc && status.mapsList && status.mapsList.length > 1) {
              var viewStateModel = status.context.viewStateModel;
              if (viewStateModel.get("lastRouter")) {
                viewStateModel.restoreLastRouter();
              }
              else {
                this.options.context.getModel(ApplicationScopeModelFactory).set('id', '');
              }
            }
          });

      }, function (error) {
        deferred.reject(error);
      });
      return deferred;
    },

    _intiateWorkflow: function (status, options, action) {

      var deferred = $.Deferred();
      var node = CommandHelper.getJustOneNode(status);
      status.workflow_parent_id = node.get("parent_id");
      if (node.get('type') === 1) {
        node = node.original;
      }

      if (action && action.initiateInSmartView && action.initiatecmd && action.initiatecmd === 'initiate_in_smartview') {
        require(['csui/controls/globalmessage/globalmessage',
          'csui/utils/contexts/factories/connector' // Factory for the server connector
        ], function () {
          GlobalMessage = arguments[0];
          ConnectorFactory = arguments[1];

          options = options || {};
          var context   = status.context || options && options.context,
              connector = context.getObject(ConnectorFactory, options),
              workflow  = new WorkflowModel({
                    workflow_id: node.get('id'),
                    DocIDs : status.doc_id
                  },
                  _.extend(options, {
                    connector: connector
                  }));
          workflow.createDraftProcess()
              .done(_.bind(function (resp) {
                var workItem = context.getModel(WorkitemModelFactory);
                var url = location.href;
                if (status.isDoc === true) {
                  var attrs = {};
                  attrs.isDocDraft = true;
                  attrs.docModels = status.docModel;
                  attrs.parent_id = status.parent_id;
                  attrs.status = status;
                  attrs.url_org = status.url_org;
                  attrs.draft_id = resp.draftprocess_id;
                  attrs.isNewDraft = true; // created label to verify from start workflow or browser back button

                  workItem.set(attrs, {silent: true});
                  workItem.set('doc_id', status.doc_id);
                  workItem.set('doc_names', status.docNames);


                } else {
                  workItem.set('isDraft', true);
                  workItem.set('url_org', url);
                  workItem.set('process_id', resp.draftprocess_id);
                  workItem.set('parent_id', status.workflow_parent_id);
                }
              }, this))
              .fail(_.bind(function (error) {
                GlobalMessage.showMessage('error', error);
                deferred.reject();
              }, this));

        }, function (error) {
          deferred.reject(error);
        });
        return deferred;
      } else {
        var context  = status.context || options && options.context,
            workItem = context.getModel(WorkitemModelFactory);
        options = options || {};
        workItem.set('isDoc', status.isDoc);
        workItem.set('parent_id', status.parent_id);
        workItem.set('doc_id', status.doc_id);
        workItem.set('doc_names', status.docNames);
        if (status.isDoc === true) {
          options.isDoc = true;
          options.doc_id = status.doc_id;
          options.parent_id = status.parent_id;
          options.doc_names = status.docNames;
          options.connector = workItem.connector;
        }
        return this._navigateTo(node, options);
      }
    },

    _getActionParameters: function (status, options) {

      var node = CommandHelper.getJustOneNode(status);
       if (node.get('type') === 1) {
         node = node.original;
       }
      var cmd;
      if (node.actions) {
        cmd = node.actions.get(this.get('command_key')[0]);
      }
      if (cmd) {
        var deferred = $.Deferred();
        deferred.resolve(cmd);
        return deferred;
      }
      var workflowActionCollection = new NodeActionCollection(undefined, {
        connector: node.connector,
        nodes: [ node.get('id') ],
        commands: [ 'initiateworkflow' ]
      });
      var originatingView = status.originatingView || options.originatingView;
      originatingView && originatingView.blockActions && originatingView.blockActions();
      return workflowActionCollection
          .fetch()
          .then(function () {
            var action = workflowActionCollection
                .get(node.get('id'))
            .actions.get('initiateworkflow');
            return action;
          })
          .always(function () {
            originatingView && originatingView.unblockActions && originatingView.unblockActions();
          });
    },



    getUrlQueryParameters: function (node, options) {
      var urlParams;
      if (options.isDoc === true) {
        var params = {},
            baseUrl     = options.connector.connection.url.replace('/api/v1', '');
        params.func = 'wfinitiation.InitiateWorkflowMap';
        params.ParentID = options.parent_id;
        params.DocNames = options.doc_names;
        params.WFMapsDataID = node.get('id');
        params.nexturl = baseUrl + '/app' + (options.parent_id !== -1 ? '/nodes/' + params.ParentID: '');
        urlParams = $.param(params);
        var docIds = options.doc_id.split(",");
        for (var docId in  docIds) {
          urlParams += '&DocID='.concat(docIds[docId]);
        }
      } else {
        urlParams = {};
        urlParams.func = 'll';
        urlParams.objAction = 'Initiate';
        urlParams.objId = node.get('id');
        urlParams.nexturl = location.href;
      }

      return urlParams;

    }
  });

  return InitiateWorkflowCommand;

});