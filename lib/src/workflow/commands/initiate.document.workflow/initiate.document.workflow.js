/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'csui/models/node/node.model',
  'csui/controls/globalmessage/globalmessage',
  'csui/dialogs/modal.alert/modal.alert',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/models/workflow/workflow.model',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang'
], function ($, _, CommandHelper, OpenClassicPageCommand, NodeModel, GlobalMessage, ModalAlert, WorkitemModelFactory,
    WorkflowModel, lang) {
  'use strict';
  var ConnectorFactory,
      NodeModelFactory;

  var InitiateDocumentWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateDocumentWorkflow',
      command_key: ['initiatedocumentworkflow'],
      scope: 'multiple'
    },
    hasCommonWorkflows: function (selectedWfList) {
      var wfListLength = selectedWfList.length;
      for (var i = 0, lengthFirstSelectedWfList = selectedWfList[0].length;
           i < lengthFirstSelectedWfList; i++) {
        var item = selectedWfList[0][i];
        var j;
        for (j = 1; j < wfListLength; j++) {
          if (!_.contains(selectedWfList[j], item)) { break; }
        }
        if (j === wfListLength) { return true; }
      }
      return false;
    },

    enabled: function (status, options) {
      if (!status) {
        return false;
      }

      var signatures   = this.get("command_key"),
          nodes        = CommandHelper.getAtLeastOneNode(status).models,
          enableAction = false, 
          wfList, list;
      if (nodes.length > 0 && this.checkPermittedActions(nodes, signatures)) {
        
        list = [];

        if (nodes.length === 1) {
  
          wfList = nodes[0].actions.get("initiatedocumentworkflow").get("wfList");
          if(wfList) {
            enableAction = wfList.length > 0;
          }
        } else if (nodes.length > 1) {
  
          for (var j = 0; j < nodes.length; j++) {
  
            wfList = nodes[j].actions.get("initiatedocumentworkflow").get("wfList");
            if (wfList && wfList.length > 0) {
              enableAction = true;
              list.push(wfList);
            } else {
              enableAction = false;
              break;
            }
          }
          if (enableAction) {
            enableAction = this.hasCommonWorkflows(list);
          }
        }
      }
    
      return enableAction;
    },
    getDocIds: function (nodes) {
      var docIds = [];
      _.each(nodes, function (node) {
        docIds.push(node.get('id'));
      });
      return docIds;
    },
    getDocNames: function (nodes) {
      var docNames = {};
      _.each(nodes, function (node) {
        docNames[node.get('id')] = node.get('name');
      });
      return docNames;
    },
    getDelimitedString : function (docList , delimiter) {
      var delimitedString = '', delim = '';
      _.each(docList, function (doc) {
        delimitedString = delimitedString.concat(delim).concat(doc);
        delim = delimiter;
      });
      return delimitedString;
    },
    getCommonWorkflows: function (status, options) {
      var deferred = $.Deferred();
      var connector = status.container.connector;
      var scope      = this.get("scope"),
          cmdOptions = options || {},
          nodes      = this._getNodesByScope(status, scope);
      var workflow = new WorkflowModel({
            CheckEnable: true
          },
          _.extend(cmdOptions, {
            connector: connector
          }));
      var curSelection = this.getDocIds(nodes);
      workflow.set('DocIDs', curSelection);
      workflow.set('ParentID', status.container.attributes.id);
      workflow.set('checkEnabled', options.checkEnabled );

      var prevNodeSelection = this.get("prevNodeSelection");

      if (prevNodeSelection) {
        var newDocID = _.filter(curSelection, function (id) {
          return !_.contains(prevNodeSelection, id);
        });
        if (curSelection.length > prevNodeSelection.length &&
            $(curSelection).filter(prevNodeSelection).length === prevNodeSelection.length) {
          workflow.set('newDocID', newDocID);
        } else if (((curSelection.length < prevNodeSelection.length) ||
                    (curSelection.length === 1 && curSelection.length === prevNodeSelection.length &&
                     curSelection[0] !== prevNodeSelection[0]) ) && $("#selectionID").length > 0) {
          $("#selectionID").remove();
        }
      }
      workflow.getDocumentWorkflows()
          .done(_.bind(function (resp) {

            this.set('prevEnabledNodeLen', nodes.length);
            this.set('prevNodeSelection', curSelection);

            if (resp.data.length > 0) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          }, this))
          .fail(_.bind(function (resp) {
            this.set('prevEnabledNodeLen', nodes.length);
            this.set('prevNodeSelection', curSelection);
            deferred.reject();
          }, this));
      return deferred.promise();
    },
    execute: function (status, options) {

      var nodes     = CommandHelper.getAtLeastOneNode(status).models,
          deferred  = $.Deferred(),
          that      = this,
          docIds    = this.getDocIds(nodes),
          docNames   = this.getDocNames(nodes),
          delimitedDocIds = this.getDelimitedString(docIds, ","),
          containerId = status.container && status.container.get("id"),
          parent_id = containerId ? containerId : -1,
          docArgs   = {DocIDs: docIds, ParentID: parent_id};
      require(['csui/utils/contexts/factories/connector', // Factory for the server connector
        'csui/utils/contexts/factories/node'
      ], function () {
        ConnectorFactory = arguments[0];
        NodeModelFactory = arguments[1];

        options = options || {};
        var context   = status.context || options && options.context,
            connector = context.getObject(ConnectorFactory, options),
            workflow  = new WorkflowModel(docArgs,
                _.extend(options, {
                  connector: connector
                }));
        workflow.getDocumentWorkflows()
            .done(_.bind(function (resp) {
              var url = location.href;
              if (resp.statusMsg) {
                GlobalMessage.showMessage('error', resp.statusMsg);
                deferred.reject();
              } else {
                var docModels = [], workflowType, workModelOptions;

                workModelOptions = {
                  'isDoc': true,
                  'docModels': docModels,
                  'mapsList': resp.data,
                  'datafetched': true,
                  'url_org': url,
                  'parent_id': parent_id,
                  'status': status,
                  'isNewDraft': true,
                  'doc_id': delimitedDocIds,
                  'doc_names': docNames
                };

                if (resp.data.length === 1) {
                  var wfMapModel, wfdata = resp.data[0],
                    workflowModel = new WorkflowModel({
                      workflow_id: wfdata.DataID,
                      DocIDs: docIds
                    },
                      _.extend(options, {
                        connector: connector
                      }));
                  wfMapModel = context.getModel(NodeModelFactory, { attributes: { id: wfdata.DataID } });

                  workflowType = wfdata.WorkflowType;
                  docModels = this._prepareDocModels(workflowType, nodes, connector);
                  workModelOptions.docModels = docModels;

                  wfMapModel.fetch()
                    .done(_.bind(function (args) {
                      var cmd = wfMapModel.actions.get('initiateworkflow'),
                        cmdData = cmd ? JSON.parse(cmd.get("body")) : false;

                      if (cmdData && cmdData.showStartStep) {
                        if (cmdData.initiateInSmartView && cmdData.initiatecmd && cmdData.initiatecmd === 'initiate_in_smartview') {
                          workflowModel.createDraftProcess()
                            .done(_.bind(function (draftResp) {
                              workflowType = resp.workflow_type;
                              workModelOptions.draft_id = draftResp.draftprocess_id;
                              this._prepareWorkItem(context, workModelOptions);
                              deferred.resolve();
                            }, this))
                            .fail(_.bind(function (resp) {
                              deferred.reject(resp);
                            }, this));

                        } else {
                          options.isDoc = true;
                          options.doc_id = delimitedDocIds;
                          options.doc_names = docNames;
                          options.parent_id = parent_id;
                          return that._navigateTo(wfMapModel, options);
                        }
                      }
                      else {
                        var options = { centerVertically: true, buttons: ModalAlert.buttons.OkCancel },
                          message = _.str.sformat(lang.StartWorkflowSingleMessage, wfdata.Name);

                        ModalAlert.confirmQuestion(message, lang.StartWorkflowTitle, options).always(_.bind(function (result) {
                          if (result) {
                            if (status.originatingView) {
                              status.originatingView.blockActions();
                            }
                            workflowModel.startWorkflow()
                              .done(_.bind(function (resp) {
                                var successMsg = lang.SuccessInitiateMessage;

                                if (resp && resp.custom_message) {
                                  successMsg = resp.custom_message;
                                }

                                GlobalMessage.showMessage('success', successMsg);

                                deferred.resolve();
                              }, this))
                              .fail(_.bind(function (error) {
                                GlobalMessage.showMessage('error', error.responseJSON.error);
                                deferred.reject();
                              }, this))
                              .always(function() {
                                if (status.originatingView) {
                                  status.originatingView.unblockActions();
                                }
                              });
                          }
                          else {
                            deferred.resolve();
                          }
                        }, this));
                        }

                      }, this))
                      .fail(_.bind(function (error) {
                        if (error.responseJSON) {
                          GlobalMessage.showMessage('error', error.responseJSON.error);
                        }
                      }, this));
                }
                else {
                  docModels = this._prepareDocModels(workflowType, nodes, connector);
                  workModelOptions.docModels = docModels;
                  this._prepareWorkItem(context, workModelOptions);
                }
              }
            }, that))
            .fail(_.bind(function (error) {
              if (error.responseJSON) {
                GlobalMessage.showMessage('error', error.responseJSON.error);
              }
              deferred.reject();
            }, this));

      }, function (error) {
        deferred.reject(error);
      });
      return deferred;
    },

    _prepareDocModels: function (workflowType, nodes, connector) {
      var docModels = [], docModel;
      if (nodes && nodes.length > 0) {
        _.each(nodes, function (model) {
          if (workflowType === "101_1") {
            docModel = new NodeModel({
              "name": model.attributes.name,
              "original_id": model.attributes.id
            }, { connector: connector });
          } else {
            docModel = new NodeModel({
              "type": 1,
              "type_name": "Shortcut",
              "container": false,
              "name": model.attributes.name,
              "original_id": model.attributes.id,
              "original_id_expand": model.attributes
            }, { connector: connector });
          }
          docModels.push(docModel);
        });
      }
      return docModels;
    },

    _prepareWorkItem: function (context, modelOptions) {

      var workItem;

      workItem = context.getModel(WorkitemModelFactory);
      workItem.set(modelOptions);

      return workItem;
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

  return InitiateDocumentWorkflowCommand;

});