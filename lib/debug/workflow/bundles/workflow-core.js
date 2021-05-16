csui.define('workflow/models/workitem/workitem.model',[
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector'
], function (Backbone, Url, base, _, $, ConnectorFactory) {
  

  var ActionModel = Backbone.Model.extend({

    defaults: {
      id: "",
      key: "",
      label: "",
      custom: false
    },
    constructor: function ActionModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    parse: function (response, options) {
      //parse the current action structure into a model structure
      var key = response.key;
      var label = response.label;
      var id = options.custom ? "custom-" + key : "standard-" + key;
      // Return the data
      return {key: key, label: label, id: id, custom: options.custom};
    }

  });

  var ActionsCollection = Backbone.Collection.extend({
    model: ActionModel,

    constructor: function ActionsCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  var FormModel = Backbone.Model.extend({

    constructor: function FormModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    _saveChanges: function (changes, formView) {
      var connector = formView.options.context.getObject(ConnectorFactory),
          baseUrl   = connector.connection.url.replace('/v1', '/v2'),
          formUrl   = (formView.alpaca.options.form.attributes.action).split("v1"),
          putUrl    = Url.combine(baseUrl, formUrl[1]),
          dfd       = $.Deferred();

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: changes
      };
      connector.makeAjaxCall(ajaxOptions)
          .done(_.bind(function () {
            dfd.resolve();
          }, this))
          .fail(_.bind(function (jqxhr) {
            // show the error
            var error = new base.Error(jqxhr);
            dfd.reject(error);
          }, this));
      return dfd;
    }
  });

  var FormsCollection = Backbone.Collection.extend({
    model: FormModel,

    constructor: function FormsCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  /**
   * Workitem model which represents an instance of a running workflow
   * It contains the REST calls to get and set the workitem properties and to send on the workflow.
   *
   * The model fires the following events:
   *
   * workitem:sendon  This event is triggered when the workitem was successful sent on.
   *
   */
  var WorkItemModel = Backbone.Model.extend({

    defaults: {
      process_id: 0,
      subprocess_id: 0,
      task_id: 0,
      isDraft: false,
      title: "",
      instructions: "",
      doc_id: 0,
      mapsList: []
    },

    // Constructor gives an explicit name to the object in the debugger
    constructor: function WorkItemModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {

      var baseUrl = this.connector.connection.url;

      var isDraft   = this.get('isDraft'),
          mapsList  = this.get('mapsList'),
          draftId   = this.get('draft_id'),
          processId = draftId ? draftId : this.get('process_id');

      if (isDraft || this.get('isDocDraft') || (mapsList && mapsList.length === 1)) {
        // URL of the REST call to get the work item
        return Url.combine(baseUrl,
            '/forms/draftprocesses/update?draftprocess_id=' + processId);
      } else {
        // URL of the REST call to get the work item
        return Url.combine(baseUrl,
            '/forms/processes/tasks/update?process_id=' + this.get('process_id') +
            '&subprocess_id=' +
            this.get('subprocess_id') + '&task_id=' + this.get('task_id'));
      }
    },

    parse: function (response) {
      // Forms
      this.forms = new FormsCollection(response.forms);

      // Actions
      this.actions = new ActionsCollection(response.data.actions, {parse: true, custom: false});
      delete response.data.actions; //remove action property, so that it is not part of the general model

      this.customActions = new ActionsCollection(response.data.custom_actions, {
        parse: true,
        custom: true
      });
      delete response.data.custom_actions;//remove action property, so that it is not part of the general model

      // Return the data
      return response.data;

    },

    isFetchable: function () {
      var docId = this.get('doc_id');
      return docId ? docId : !!this.get('process_id');
    },

    /**
     * Clear the model and its collections
     * @param options
     */
    reset: function (options) {
      this.clear(options);

      //reset the different collections
      if (!_.isUndefined(this.actions)) {
        this.actions.reset();
      }
      if (!_.isUndefined(this.customActions)) {
        this.customActions.reset();
      }
      if (!_.isUndefined(this.forms)) {
        this.forms.reset();
      }
    },

    title: function () {
      return this.get('title');
    },

    /**
     * Sends an action to the server
     * @param action Action object for the current action.
     *
     * @returns a promise object. This promise is resolved when the send action call returns from the server without an error.
     * In the case of an error the promise will be rejected.
     */
    sendAction: function (action) {
      // URL of the REST call to send the workflow with the correct action attached
      var baseUrl   = this.connector.connection.url.replace('/v1', '/v2'),
          putUrl    = Url.combine(baseUrl, 'processes', this.get('process_id'), 'subprocesses',
              this.get('subprocess_id'), 'tasks', this.get('task_id')),
          dfd       = $.Deferred(),
          isDraft   = this.get('isDraft'),
          mapsList  = this.get('mapsList'),
          draftId   = this.get('draft_id'),
          processId = draftId ? draftId : this.get('process_id');

      // is it a draft process
      if (isDraft || this.get('isDocDraft') || (mapsList && mapsList.length === 1)) {
        putUrl = Url.combine(baseUrl, 'draftprocesses', processId);
      }

      // prepare request content - action
      var content = {};
      if (action.get('custom')) {
        //custom action
        content.custom_action = action.get('key');
      } else {
        //standard action
        content.action = action.get('key');
      }
      // prepare request content - comment
      // TODO: verify whether the 'comments_on' flag is set.
      if (this.get('comment') !== undefined && this.get('comment').length > 0) {
        content.comment = this.get('comment');
      }
      // prepare request content - assignee
      if (action.get('key') === 'Delegate') {
        content.assignee = this.get('assignee').toString();
      }
      // prepare request content - assignee and assignee option
      if (action.get('key') === 'Review') {
        content.assignee = this.get('assignee').toString();
        if (_.isNumber(this.get('assigneeOption'))) {
          content.assigneeOption = this.get('assigneeOption').toString();
        } else {
          // fall back to default value which is 0 == member accept
          content.assigneeOption = '0';
        }
      }
      // prepare request content - authentication
      if (this.get('authentication') === true) {
        content.authentication_info = this.get('authentication_info');
      }

      // prepare request content - duration and duration unit
      if (this.get('duration') !== undefined && this.get('duration').length > 0) {
        content.duration = this.get('duration');
      }

      if (this.get('duration_unit') !== undefined && this.get('duration_unit').length > 0) {
        content.duration_unit = this.get('duration_unit');
      }

      var formData = new FormData();
      formData.append('body', JSON.stringify(content));

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector.makeAjaxCall(ajaxOptions)
          .done(_.bind(function (resp) {
            dfd.resolve(resp.results);
            //the workitem was sent on, fire an event
            this.trigger('workitem:sendon');
          }, this))
          .fail(_.bind(function (resp) {
            dfd.reject(resp);
          }, this));

      return dfd;
    },

    /**
     * Sends a member accept action to the server to accept the current workitem.
     *
     * @returns a promise object. This promise is resolved when the accept call returns from the server without an error. In the case of an error
     * the promise will be rejected.
     */
    sendMemberAcceptAction: function (acceptStatus) {
      // URL of the REST call to send the workflow with the accept action
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2');
      var putUrl = Url.combine(baseUrl, 'processes', this.get('process_id'), 'subprocesses',
          this.get('subprocess_id'), 'tasks', this.get('task_id'));
      acceptStatus = acceptStatus ? acceptStatus : "accept";
      var content = {action: acceptStatus};
      var formData = new FormData();
      var dfd = $.Deferred();
      formData.append('body', JSON.stringify(content));

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector.makeAjaxCall(ajaxOptions)
          .done(_.bind(function () {
            dfd.resolve();
          }, this))
          .fail(_.bind(function (resp) {
            var response = JSON.parse(resp.responseText);
            dfd.reject(response);
          }, this));
      return dfd;
    }

  });

  return WorkItemModel;

});

csui.define('workflow/models/workflow/workflow.model',[
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector'
], function (Backbone, Url, base, _, $, ConnectorFactory) {
  

  /**
   * Workflow model which represents a workflow definition
   * It contains the REST calls to create a draft process which could then be initiate.
   * Other parts for the workflow are currently not implemented
   */
  var WorkflowModel = Backbone.Model.extend({

    defaults: {
      workflow_id: 0
    },

    // Constructor gives an explicit name to the object in the debugger
    constructor: function WorkflowModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    /**
     * Create a draft process instance for the workflow
     *
     * @returns {*}
     */
    createDraftProcess: function () {
      // URL of the REST call to create a draft process
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2');
      var postUrl = Url.combine(baseUrl, 'draftprocesses');
      var content = {workflow_id: this.get('workflow_id'),doc_ids : this.get('DocIDs')};
      var formData = new FormData();
      var dfd = $.Deferred();
      formData.append('body', JSON.stringify(content));

      // call REST service to create a draft processs
      var ajaxOptions = {
        type: 'POST',
        url: postUrl,
        data: formData,
        contentType: false,
        processData: false
      };

      this.connector.makeAjaxCall(ajaxOptions)
          .done(_.bind(function (resp) {
            // call successful, return draft process id
            dfd.resolve(resp.results);
          }, this))
          .fail(_.bind(function (resp) {
            // call failed, return error
            dfd.reject(resp.responseJSON.error);
          }, this));
      return dfd;
    },

    /**
     * list workflows for document node
     *
     * @returns {*}
     */
    getDocumentWorkflows: function () {

      var generateUrl = function (attributes) {
        var url         = '',
            docIds      = (attributes.doc_id) ? attributes.doc_id.split(',') : attributes.DocIDs,
            selectionID = $("#selectionID");

        _.each(docIds, function (docId) {
          url = url.concat('doc_id').concat('=').concat(docId).concat('&');
        });

        if (attributes.ParentID) {
          url = url.concat('parent_id=').concat(attributes.ParentID);
        }
        if (attributes.checkEnabled) {
          url = url.concat('&checkEnabled=').concat(attributes.checkEnabled);
        }
        // The unique ID is used to determine that the user selection(of the documents) is happening
        // from the the same page
        // Created : On the first selection of the node(document)
        // Removed : This uinique ID is removed on deselection of a node
        if (selectionID.length === 0) {
          var firstRow = $("#tableview tbody>tr")[0];
          if(firstRow){
            $('<input>').attr({
              type: 'hidden',
              id: 'selectionID',
              value: _.uniqueId()
            }).appendTo(firstRow);
            selectionID = $("#selectionID");
          }
        }
        if(selectionID.val()){
          url = url.concat('&selectionID=').concat(selectionID.val());
        }
        // newDocID contains the document id's of the newly selected nodes(documents) if there is a
        // previous selection already exist
        if (attributes.newDocID) {
          _.each(attributes.newDocID, function (docId) {
            url = url.concat('&newDocID').concat('=').concat(docId);
          });

          
        }
        return url;
      };

      // URL of the REST call to create a draft process
      var baseUrl     = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl      = Url.combine(baseUrl, 'docworkflows?' + generateUrl(this.attributes)),
          dfd         = $.Deferred(),
          // call REST service to get matched workflow types
          ajaxOptions = {
            type: 'GET',
            url: getUrl,
            async: (this.get("CheckEnable")) ? false : true
          };

      this.connector.makeAjaxCall(ajaxOptions)
        .done(_.bind(function (resp) {
          // call successfull, return the results.
          dfd.resolve(resp.results);
        }, this))
        .fail(_.bind(function (resp) {
          // call failed, return error
          dfd.reject(resp);
        }, this));
      return dfd;
    },

    /**
     * To start the workflow for which start step is not enabled.
     */
    startWorkflow: function () {
      // URL of the REST call to start the workflow
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'),
        postUrl = Url.combine(baseUrl, 'draftprocesses/startwf'),
        content = { workflow_id: this.get('workflow_id'), doc_ids: this.get('DocIDs') },
        formData = new FormData(),
        dfd = $.Deferred();

      formData.append('body', JSON.stringify(content));

      // call REST service to start the workflow
      var ajaxOptions = {
        type: 'POST',
        url: postUrl,
        data: formData,
        contentType: false,
        processData: false
      };

      this.connector.makeAjaxCall(ajaxOptions)
        .done(_.bind(function (resp) {
          // call successful, return the process id and custom message if any
          dfd.resolve(resp.results);
        }, this))
        .fail(_.bind(function (resp) {
          // call failed, return error
          dfd.reject(resp);
        }, this));
      return dfd;
    }
    
  });

  return WorkflowModel;
});

csui.define('workflow/models/workitem/workitem.model.factory',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'workflow/models/workitem/workitem.model',     // Model to create the factory for
  'workflow/models/workflow/workflow.model'
], function ($, _, ModelFactory, ConnectorFactory, WorkItemModel, WorkflowModel) {
  

  var WorkItemModelFactory = ModelFactory.extend({

    // Unique prefix of the default model instance, when this model is placed
    // to a context to be shared by multiple widgets
    propertyPrefix: 'workitem',

    constructor: function WorkItemModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;

      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new WorkItemModel(undefined, {
        connector: connector
      });

      this.workflow = new WorkflowModel(undefined, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {

      var isDoc   = this.property.get('isDoc'),
          mapList = this.property.get('mapsList'),
          dfd     = $.Deferred();

      if (isDoc && !(this.property.get('process_id') || this.property.get('draft_id'))) {

        if (mapList && mapList.length > 0) {
          return dfd.resolve(this.property);

        } else {

          this.workflow.set('doc_id', this.property.get("doc_id"));
          this.workflow.set('ParentID', this.property.get("parent_id"));
          this.workflow.set('isNewDraft', this.property.get("isNewDraft"));

          // create a draft process
          this.workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                this.property.set({datafetched: true}, {silent: true});
                this.property.set('mapsList', resp.data);
                dfd.resolve(this.property);
              }, this))
              .fail(_.bind(function (error) {
                dfd.reject(error);
              }, this));

          return dfd.promise();

        }

      } else if (this.property.get('isDocDraft')) {
        var model = this.property.fetch({silent: true});
        model.done(_.bind(function (resp) {

          this.workflow.set('doc_id', this.property.get("doc_id"));
          this.workflow.set('ParentID', this.property.get("parent_id"));
          this.workflow.set('isNewDraft', this.property.get("isNewDraft"));
          this.property.set('workflowType', resp.data.workflow_type);

          // create a draft process
          this.workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                this.property.set({datafetched: true}, {silent: true});
                this.property.set('mapsList', resp.data);
                dfd.resolve(this.property);
              }, this))
              .fail(_.bind(function (error) {
                dfd.reject(error);
              }, this));
        }, this))
            .fail(_.bind(function (error) {
              dfd.reject(error);
            }, this));
        return dfd.promise();
      } else {
        // Just fetch the model exposed y this factory
        return this.property.fetch(options);
      }
    }

  });

  return WorkItemModelFactory;

});

csui.define('workflow/commands/defaultactionitems',[],function () {
    

    return [
        // Workflow
        {
            equals: {type: [128]},
            signature: 'InitiateWorkflow',
            sequence: 30
        },
        // WorkItem
        {
            equals: {type: [153]},
            signature: 'OpenWorkflowStep',
            sequence: 30
        },
        // Forms
        {
            equals: {type: [223]},
            signature: 'openform',
            sequence: 30
        }
    ];

});
// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/workitem/workitem/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/widgets/workitem/workitem/impl/nls/root/lang',{
  CloseButtonLabel: 'Close',
  CancelButtonLabel: 'Cancel',
  StartButtonLabel: 'Start',
  ActionFailMessageTitle: 'Action "{0}" failed',
  ActionFailMessage: 'Action "{0}" failed. \n\n{1}',
  AssigneePickerLabelTo: 'To',
  AssigneePickerLabelSendTo: 'Send to',
  CommentTextFieldLabelInstructions: 'Instructions',
  CommentTextFieldPlaceholderInstructions: 'Add instructions',
  CommentTextFieldLabelReply: 'Reply',
  CommentTextFieldPlaceholderReply: 'Add reply',
  SubmitLabelSend: 'Send',
  SuccessSendOnMessage: 'One workflow submitted by you.',
  SuccessInitiateMessage: 'Start workflow action was successful.',
  ErrorMessageLoadExtension: 'Workflow could not load extension.',
  MultipleMapsSelectPlaceholder: 'Select workflow type',
  ChangeWorkflowTypeTitle: 'Changing Workflow Type',
  ChangeWorkflowTypeMessage: 'Any changes you have made to this step will be lost.',
  ReserveDocumentMessageTitle: 'Document reserved',
  ReserveDocumentMessageText: 'The document {0} is reserved. \nDo you want to continue anyway?',
  MemberAcceptDialogTitle: 'Workflow sent to a group',
  MemberAcceptDialogMessage: 'Click Accept to work on this Workflow. It will be removed from the My Assignments tile of the other group members. It will be available on your My Assignments tile.',
  MemberAcceptAcceptButtonLabel: 'Accept',
  MemberAcceptCloseButtonLabel: 'Close',
  MemberAcceptedMessage: 'This workflow has been accepted by you',
  MemberAcceptErrorDescription: 'This Workflow was accepted by another group member.',
  MemberAcceptErrorTitle: 'Workflow no longer available',
  DialogModelTitle: '{0}: {1}',
  WorkflowStepTitle: 'Workflow Step : {0}',
  StartWorkflowTitle: 'Start workflow',
  StartWorkflowSingleMessage: 'Clicking OK will initiate the "{0}" workflow. Do you want to continue?'
});


csui.define('workflow/commands/initiate.workflow/initiate.workflow',['csui/lib/jquery',
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
  

  // Dependencies loaded in the execute method first
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
      // support both scenarios - default action only or a full node info
      return node && node.get('type') === 128 && (node.get('openable') || node.actions.get('initiateworkflow'));
    },

    // check if work item should be opened in smart or standard UI
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

      //if this is true, it is a shortcut, for which the Start Workitem command was clicked,
      // and the original node has to be extracted
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

      // init workflow in smart UI
      csui.require(['csui/controls/globalmessage/globalmessage',
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
        
        // start the workflow
        workflow.startWorkflow()
          .done(_.bind(function (resp) {
            var successMsg = lang.SuccessInitiateMessage;

            // check if the custom message available or not.
            if (resp && resp.custom_message) {
              successMsg = resp.custom_message;
            }
            // workflow started sucessfully, show the success message
            GlobalMessage.showMessage('success', successMsg);
            deferred.resolve();
          }, this))
          .fail(_.bind(function (error) {
            // starting the workflow failed, show message
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

        // set the map it to load the temp map

      }, function (error) {
        deferred.reject(error);
      });
      // Return deferred to react on issues/success in the caller
      return deferred;
    },

    _intiateWorkflow: function (status, options, action) {

      var deferred = $.Deferred();
      var node = CommandHelper.getJustOneNode(status);
      status.workflow_parent_id = node.get("parent_id");

      //if this is true, it is a shortcut, for which the Start Workitem command was clicked,
      // and the original node has to be extracted
      if (node.get('type') === 1) {
        node = node.original;
      }

      if (action && action.initiateInSmartView && action.initiatecmd && action.initiatecmd === 'initiate_in_smartview') {
        // init workflow in smart UI
        csui.require(['csui/controls/globalmessage/globalmessage',
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

          // create a draft process
          workflow.createDraftProcess()
              .done(_.bind(function (resp) {
                // creation of the draft process succeeded, load the work item model and switch perspective
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
                // creation of the draft process failed, show message
                GlobalMessage.showMessage('error', error);
                deferred.reject();
              }, this));

          // set the map it to load the temp map

        }, function (error) {
          deferred.reject(error);
        });
        // Return deferred to react on issues/success in the caller
        return deferred;
      } else {
        // classic UI
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

       //if this is true, it is a shortcut, for which the Start Workitem command was clicked,
       // and the original node has to be extracted
       if (node.get('type') === 1) {
         node = node.original;
       }

      //if this is e.g called by 'initiate from document' the necessary informatimn is
      // already available
      var cmd;
      if (node.actions) {
        cmd = node.actions.get(this.get('command_key')[0]);
      }
      if (cmd) {
        var deferred = $.Deferred();
        deferred.resolve(cmd);
        return deferred;
      }

      //get the necessary information for initiation
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
csui.define('workflow/commands/edit.workflow.map/edit.workflow.map',['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commandhelper',
    'csui/utils/commands/open.classic.page',
    'workflow/models/workitem/workitem.model.factory'
], function ($, _, CommandHelper, OpenClassicPageCommand, WorkitemModelFactory) {
    

    // Dependencies loaded in the execute method first

    var EditWorkflowMapCommand = OpenClassicPageCommand.extend({

        defaults: {
            signature: 'EditWorkflowMap',
            command_key: ['editworkflowmap'],
            scope: 'single'
        },

        execute: function (status, options) {
            var node = CommandHelper.getJustOneNode(status);

            // classic UI
            options = options || {};
            return this._navigateTo(node, options);
        },

        getUrlQueryParameters: function (node, options) {
            var urlParams;
            urlParams = {};
            urlParams.func = 'll';
            urlParams.objAction = 'paint';
            urlParams.objId = node.get('id');
            return urlParams;
        }
    });

    return EditWorkflowMapCommand;

});
csui.define('workflow/commands/initiate.document.workflow/initiate.document.workflow',['csui/lib/jquery',
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
  

  // Dependencies loaded in the execute method first
  var ConnectorFactory,
      NodeModelFactory;

  var InitiateDocumentWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateDocumentWorkflow',
      command_key: ['initiatedocumentworkflow'],
      scope: 'multiple'
    },

    // returns a boolean value by caluclating common workflows of selected doc's.
    hasCommonWorkflows: function (selectedWfList) {

      // return a boolean value by caluclating common workflows.
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

      // stopping the execution if the status object not available.
      // by using status we can get the selected nodes.
      if (!status) {
        return false;
      }

      var signatures   = this.get("command_key"),
          nodes        = CommandHelper.getAtLeastOneNode(status).models,
          enableAction = false, 
          wfList, list;

      // stopping the exection if no node selected
      // and checking permitted actions on the nodes
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
    //Get all the doc_ids for the selected nodes(document).
    getDocIds: function (nodes) {
      var docIds = [];
      _.each(nodes, function (node) {
        docIds.push(node.get('id'));
      });
      return docIds;
    },
    //Get all the doc names for the selected nodes(document).
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
        // Determine the newly selected nodes using  previous node selection
        var newDocID = _.filter(curSelection, function (id) {
          return !_.contains(prevNodeSelection, id);
        });

        // Determining the action based on the current selection(curSelection) and previous selection of
        // nodes(prevNodeSelection)
        if (curSelection.length > prevNodeSelection.length &&
            $(curSelection).filter(prevNodeSelection).length === prevNodeSelection.length) {
          // Adding newDocID if the current node selection contains previous node selection along
          // with newly added nodes
          workflow.set('newDocID', newDocID);
        } else if (((curSelection.length < prevNodeSelection.length) ||
                    (curSelection.length === 1 && curSelection.length === prevNodeSelection.length &&
                     curSelection[0] !== prevNodeSelection[0]) ) && $("#selectionID").length > 0) {
          // Removing selectionID on deselecting a node
          $("#selectionID").remove();
        }
      }

      // 'prevEnabledNodeLen'  stores the length of the selected documents.
      // Once the results are available, based on 'prevEnabledNodeLen' we make 'commandEnabled'
      // as a check to stop other 'XHR'/'REST' calls.
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
    // check if work item should be opened in smart or standard UI
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

      // init workflow in smart UI
      csui.require(['csui/utils/contexts/factories/connector', // Factory for the server connector
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

        // create a draft process
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
                  // created label to verify from start workflow or browser back button
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

                            // start the workflow
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
                                // starting a workflow failed, show message
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
              // creation of the draft process failed, show message
              if (error.responseJSON) {
                GlobalMessage.showMessage('error', error.responseJSON.error);
              }
              deferred.reject();
            }, this));

        // set the map it to load the temp map

      }, function (error) {
        deferred.reject(error);
      });

      // Return deferred to react on issues/success in the caller
      return deferred;
    },

    _prepareDocModels: function (workflowType, nodes, connector) {
      var docModels = [], docModel;
      if (nodes && nodes.length > 0) {
        _.each(nodes, function (model) {
          //For Signing workflows, we need to create a copy of the attachment
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
csui.define('workflow/commands/open.workitem/open.workitem',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'csui/utils/command.error',
  'csui/utils/contexts/factories/connector',
  'workflow/models/workitem/workitem.model.factory',
], function (_, $, CommandHelper, OpenClassicPageCommand, CommandError, ConnectorFactory, WorkitemModelFactory) {
  

  var OpenWorkItemCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenWorkflowStep'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 153;
    },

    // check if work item should be opened in smart or standard UI
    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      if (node.get('workflow_open_in_smart_ui')) {
        // smart UI
        options = options || {};
        var context   = status.context || options && options.context,
            deferred  = $.Deferred(),
            workItem = context.getModel(WorkitemModelFactory);

        // set the work item ids in the model
        workItem.set({
          process_id: node.get('workflow_id'),
          subprocess_id: node.get('workflow_subworkflow_id'),
          task_id: node.get('workflow_subworkflow_task_id'),
          url_org: location.href
        });


        // Return deferred to react on issues/success in the caller
        return deferred;
      } else {
        // classic UI
        return this._navigateTo(node, options);
      }
    },

    // URL for standard UI
    getUrlQueryParameters: function (node, options) {

      return {
        func: 'work.EditTask',
        workid: node.get('workflow_id'),
        subworkid: node.get('workflow_subworkflow_id'),
        taskid: node.get('workflow_subworkflow_task_id'),
        nexturl: location.href
      };
    }
  });

  return OpenWorkItemCommand;

});
csui.define('workflow/commands/open.form/open.form',['csui/lib/underscore', 'csui/utils/commandhelper', 'csui/utils/commands/open.classic.page', 'csui/models/node.actions'
], function (_, CommandHelper, OpenClassicPageCommand, NodeActionCollection) {
  

  var OpenFormCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'openform',
      command_key: ['openform'],
      scope: 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      // support both scenarios - default action only or a full node info
      return node && (node.get('openable') || node.actions.get('openform'));
    },

    execute: function (status, options) {
      return this._getActionParameters(status, options)
          .then(_.bind(function (action) {
            return this._openForm(status, options, action);
          }, this));
    },

    _openForm: function (status, options, action) {
      this.objAction = 'EditForm';
      var node     = CommandHelper.getJustOneNode(status);
      if (action && action.get('body')) {
        //the body contains either 'ConfirmView' or 'EditForm' dependent of the permissions of the
        // current User
        this.objAction = action.get('body');
      }
      return this._navigateTo(node, options);
    },

    _getActionParameters: function (status, options) {
      //
      var node = CommandHelper.getJustOneNode(status);
      var formActionCollection = new NodeActionCollection(undefined, {
        connector: node.connector,
        nodes: [ node.get('id') ],
        commands: [ 'openform' ]
      });
      var originatingView = status.originatingView || options.originatingView;
      originatingView && originatingView.blockActions && originatingView.blockActions();
      return formActionCollection
          .fetch()
          .then(function () {
            var action = formActionCollection
                .get(node.get('id'))
                .actions.get('openform');
            return action;
          })
          .always(function () {
            originatingView && originatingView.unblockActions && originatingView.unblockActions();
          });
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: this.objAction,
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenFormCommand;

});

csui.define('workflow/perspective/routers/workflow.perspective.router',[
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'workflow/models/workitem/workitem.model.factory'
], function (PerspectiveRouter, ApplicationScopeModelFactory,
    WorkItemModelFactory) {
  

  var WorkflowPerspectiveRouter = PerspectiveRouter.extend({

    // defined routes, see workflow.perspective.router.md for more details
    routes: {
      'processes/:process_id/:subprocess_id/:task_id': 'openProcess',
      'draftprocesses/:draftprocess_id': 'openDraftProcess',
      'docworkflows/:doc_id/:parent_id': 'openDocumentProcess',
      'docworkflows/:doc_id/:parent_id/draftprocesses/:draftprocess_id': 'openDocumentDraftProcess'
    },

    constructor: function WorkflowPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.workItem = this.context.getModel(WorkItemModelFactory);
      this.listenTo(this.workItem, 'change:process_id', this._updateUrl);
      this.listenTo(this.workItem, 'change:doc_id', this._updateUrl);
    },

    /**
     * Called when the route is activated
     * @param process_id Process id of the workflow
     * @param subprocess_id Sub process od of the workflow
     * @param task_id Task id of the workflow
     */
    openProcess: function (process_id, subprocess_id, task_id) {
      //set the ids in the model to reload it
      this.workItem.set({
        process_id: parseInt(process_id),
        subprocess_id: parseInt(subprocess_id),
        task_id: parseInt(task_id),
        isDraft: false,
        url_org: this.validateURL(this._getUrl())
      });
    },

    /**
     * Called when the route is activated
     * @param draftprocess_id Draft process id of the workflow
     */
    openDraftProcess: function (draftprocess_id) {
      //set the ids in the model to reload it
      this.workItem.set({
        process_id: parseInt(draftprocess_id),
        isDraft: true,
        url_org: this.validateURL(this._getUrl())
      });
    },

    /**
     * Called when the route is activated
     * @param doc_id docId to retrive list of workflows associated to document
     * @param parent_id parentId to retrive  list of workflows associated to document
     */
    openDocumentProcess: function (doc_id, parent_id) {

      var defaults = this.workItem.defaults;
      this.workItem.reset({silent: true});
      this.workItem.set(defaults, {silent: true});
      //set the ids in the model to reload it
      this.workItem.set({
        parent_id: parseInt(parent_id),
        isDoc: true,
        doc_id: doc_id,
        url_org: this.validateURL(this._getUrl())
      });
    },

    /**
     * Called when the route is activated
     * @param doc_id docId to retrive list of workflows associated to document
     * @param parent_id parentId to retrive  list of workflows associated to document
     * @param draftprocess_id Draft process id of the workflow
     */
    openDocumentDraftProcess: function (doc_id, parent_id, draftprocess_id) {
      //set the ids in the model to reload it
      this.workItem.set({
        parent_id: parseInt(parent_id),
        draft_id: parseInt(draftprocess_id),
        isDocDraft: true,
        doc_id: doc_id,
        url_org: this.validateURL(this._getUrl())
      });
    },

    onOtherRoute: function () {
      // reset the model in the case a different route is activated
      this.workItem.reset({silent: true});
    },

    _getUrl: function () {
      //Constructing the url to navigate to the classic ui
      var vars = {};
      //Extracting the query string values from the url
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
          function (m, key, value) {
            vars[key] = value;
          });
      var originIndex = vars["origin_index"],
          nextUrl     = vars["nexturl"],
          base_url    = this.workItem.connector.connection.url.replace("/api/v1", ""),
          strURLArray = ["func=Personal.Assignments", "func=work.Workflows&tabname=Assignments"];
      if (originIndex >= 0 && originIndex <= strURLArray.length - 1) {
        return base_url + "?" + strURLArray[originIndex];
      } else if (nextUrl) {
        return decodeURIComponent(nextUrl);
      } else if (document.referrer) {
        var referrer = document.referrer;
        if ((referrer.indexOf("/app/") >= 0) || (referrer.indexOf("?func") >= 0)) {
          return document.referrer;
        }
        else {
          return "";
        }
      }
      else {
        return "";
      }
    },

    /**
     * Update the URL when a model is changed
     * @private
     */
    _updateUrl: function () {
      // get the workflow ids for the URL
      var process_id    = this.workItem.get('process_id'),
          subprocess_id = this.workItem.get('subprocess_id'),
          task_id       = this.workItem.get('task_id'),
          isDraft       = this.workItem.get('isDraft'),
          isDocDraft    = this.workItem.get('isDocDraft'),
          isDoc         = this.workItem.get('isDoc'),
          mapsList      = this.workItem.get('mapsList'),
          doc_id        = this.workItem.get('doc_id'),
          parent_id     = this.workItem.get('parent_id'),
          draftId       = this.workItem.get('draft_id');

      if (!!process_id && !!doc_id) {
        return;
      }
      if (!(doc_id || process_id) && this.applicationScope.id !== 'workflow') {
        return;
      }

      var url = 'processes';

      if (isDraft) {
        // create the URL from the workflow ids
        url = 'draftprocesses';
        if (process_id) {
          url += '/' + process_id;
        }
      } else if (isDocDraft || (mapsList && mapsList.length === 1)) {
        url = 'docworkflows';
        if (doc_id && parent_id && draftId) {
          url += '/' + doc_id + '/' + parent_id + '/' + 'draftprocesses' + '/' +
                 draftId;
        }
      } else if (isDoc) {
        // create the URL from the workflow ids
        url = 'docworkflows';
        if (doc_id && parent_id) {
          url += '/' + doc_id + '/' + parent_id;
        }
      } else {
        // create the URL from the workflow ids
        url = 'processes';
        if (process_id) {
          url += '/' + process_id + '/' + subprocess_id + '/' + task_id;
        }
      }
      this._routeWithSlashes = false;
      this.navigate(url);
    },

    validateURL: function (surl) {
      var url = this.parseURL(surl);
      var urlHostname = url.hostname.trim();

      if (urlHostname === '') {
        return surl;
      }
      else {
        if (urlHostname.toUpperCase() === location.hostname.trim().toUpperCase()) {
          return surl;
        }
        else
        {
          return "";
        }
      }
    } ,

    parseURL: function(url) {

      var a =document.createElement('a');
      a.href = url;

      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        hostname: a.hostname,
        host: a.host,
        port: a.port,
        query: a.search,
        params: (function () {
          var ret = {},
              seg = a.search.replace(/^\?/, '').split('&'),
              len = seg.length, i = 0, s;
          for (; i < len; i++) {
            if (!seg[i]) { continue; }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
          }
          return ret;
        })(),

        hash: a.hash.replace('#', ''),

        segments: a.pathname.replace(/^\//, '').split('/')
      };
    }

  });

  return WorkflowPerspectiveRouter;

});

csui.define('bundles/workflow-core',[
  //factories
  'workflow/models/workitem/workitem.model.factory',

  // Commands
  'workflow/commands/defaultactionitems',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'workflow/commands/edit.workflow.map/edit.workflow.map',
  'workflow/commands/initiate.document.workflow/initiate.document.workflow',
  'workflow/commands/open.workitem/open.workitem',
  'workflow/commands/open.form/open.form',

  // Perspective router
  'workflow/perspective/routers/workflow.perspective.router'
], {});



