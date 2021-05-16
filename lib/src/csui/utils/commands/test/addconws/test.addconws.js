/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/base',
  'csui/utils/log',
  'csui/models/command',
  'csui/models/node/node.model',
  './test.commands.lang.js',
], function (require, $, _, base, log,
    CommandModel,
    NodeModel,
    lang) {

  var forwardToTable = false;

  var AddWorkspaceCommand = CommandModel.extend({

    defaults:{
      signature: 'AddConnectedWorkspace',
      name: lang.CommandNameAddConnectedWorkspace,
      verb: "create",//lang.CommandVerbCopy,
      doneVerb: "created",//lang.CommandDoneVerbCopy,
      scope: 'single'
    },

    enabled: function(status){
      return true;
    },

    execute: function (status, options) {

      var deferred = $.Deferred(),
          data = status.data || {},
          container = status.container || {},
          wsType = data.wsType || {},
          template = data.template || {},
          subType = data.subType,
          subTypeName = data.subTypeName,
          newNode = new NodeModel({
            "type": subType, //options.addableType,
            "type_name": subTypeName,
            "container": true,
            "name": "", // start with empty name
            "parent_id": container.attributes.id,
            "rm_enabled": wsType.rm_enabled,
            "sub_folder_id": 0
          }, {
            connector: status.container.connector
          });

      if (forwardToTable) {
        status.forwardToTable = true;
        deferred.resolve(newNode);
      }
      else {
        status.suppressSuccessMessage = true;
        require(['csui/models/nodes',
          'csui/utils/commandhelper',
          'csui/widgets/metadata/metadata.add.item.controller',
          'csui/dialogs/modal.alert/modal.alert',
          'csui/controls/globalmessage/globalmessage',
          './test.workspacecreateforms.js',
          './test.metadata.controller.js',
          'csui/behaviors/default.action/default.action.behavior',
          'csui/utils/contexts/factories/next.node'
        ], function (NodeCollection,
            CommandHelper,
            MetadataAddItemController,
            ModalAlert,
            GlobalMessage,
            WorkspaceCreateFormCollection,
            WorkspaceMetadataController,
            DefaultActionBehavior,
            NextNodeModelFactory
        ) {

          var metadataAddItemController = new MetadataAddItemController();
          options.dialogTitle = _.str.sformat(lang.AddConwsMetadataDialogTitle,template.name||lang.BusinessWorkspace);
          options.addButtonTitle = lang.AddConwsMetadataDialogAddButtonTitle;
          status.nodes = new NodeCollection([newNode]);
          options = _.extend({
            formCollection: new WorkspaceCreateFormCollection(undefined, {
              metadataAddItemController : metadataAddItemController,
              node: status.container,
              type: subType, //options.addableType
              wsType: wsType,
              template: template
            }),
            metadataController: new WorkspaceMetadataController(undefined, {
              type: subType,
              wsType: wsType,
              template: template,
              collection: status.collection
            })
          }, options);

          var formCollection = options.formCollection;
          function hideNameAndView() {
            var dialog = metadataAddItemController.dialog;
            if (dialog && dialog.$el) {
              dialog.$el.addClass("conws-initializing");
              formCollection.off(null,hideNameAndView);
            }
          }
          function unhideNameAndView() {
            var dialog = metadataAddItemController.dialog;
            if (dialog && dialog.$el) {
              dialog.$el.removeClass("conws-initializing");
              formCollection.off(null,unhideNameAndView);
            }
          }

          function successWithLinkMessage() {
            var message = _.str.sformat(lang.BusinessWorkspaceSuccessfullyCreated, newNode.get('name'));
            var msgOptions = {
              context: status.context,
              nextNodeModelFactory: NextNodeModelFactory,
              link_url: DefaultActionBehavior.getDefaultActionNodeUrl(newNode),
              targetFolder: newNode
            };
            GlobalMessage.showMessage('success_with_link', message, undefined, msgOptions);
          }
          function showNodeOrMessage() {
            var update = false;
            status.collection.forEach(function (item) {
              if (item.get("id") === newNode.get("id")) {
                item.set(newNode.attributes);
                update = true;
              }
            });
            if (!update) {
              var folder_id = status.collection.node.get('id'),
                  parent_id = newNode.get('parent_id'),
                  sub_folder_id = newNode.get('sub_folder_id');
              if (folder_id === parent_id || folder_id === -parent_id) {
                  status.collection.add(newNode, {at: 0});
              } else {
                if ( folder_id !== sub_folder_id && sub_folder_id !== 0 ) { //CWS-5155
                  var sub_folder = new NodeModel( {id: sub_folder_id }, { connector: status.container.connector, collection: status.collection });
                  sub_folder.fetch( { success: function () {
                    if ( sub_folder.get('parent_id') === folder_id ) {
                      if (status.collection.findWhere({id: sub_folder.get("id")}) === undefined) {
                        sub_folder.isLocallyCreated = true;
                        status.collection.add(sub_folder, {at: 0});
                      }
                    }
                    successWithLinkMessage();
                  }, error: function(err) {
                    ModalAlert.showError(lang.ErrorAddingSubfolderToNodesTable);
                    successWithLinkMessage();
                  }});
                } else { 
                  successWithLinkMessage();
                }
              }
            }
          }
          formCollection.on("request",function() {
            var dialog = metadataAddItemController.dialog;
            if (dialog && dialog.$el) {
              dialog.$el.addClass("conws-add-workspace");
            }
          });

          formCollection.once("request",hideNameAndView); // hide when forms is fetched first time
          formCollection.once("sync",unhideNameAndView); // unhide when forms have been fetched
          formCollection.once("error",unhideNameAndView); // unhide also in error case
          formCollection.on("sync",function(){ updateNameAndView(newNode,formCollection,metadataAddItemController);});
          formCollection.on("error",function(request, message, statusText){
            if (!(request && request.status && request.status === 401)){
              var errmsg = request && (new base.Error(request)).message || lang.errorGettingCreateForm;
              log.error("Fetching the create forms failed: {0}",errmsg) && console.error(log.last);
              ModalAlert.showError(errmsg);
            }
          });

          metadataAddItemController
              .displayForm(status, options)
              .then(function () {
                newNode.isLocallyCreated = true;
                showNodeOrMessage();
                deferred.resolve.apply(deferred, arguments);
              })
              .fail(function () {
                deferred.reject.apply(deferred, arguments);
              });
          status.metadataAddItemController = metadataAddItemController;
        }, function (error) {
          deferred.reject(error);
        });
      }

      return deferred.promise();
    }
  });

  function updateNameAndView (nodeModel, formCollection, metadataAddItemController) {
    var general = formCollection.at(0);
    if (!nodeModel.get("id")) {
      var data = general.get("data");
      if (data) {
        var name = data.name;
        log.debug("name fetched and used: {0}",name) && console.log(log.last);
        nodeModel.set("name",name);
      } else {
        log.debug("name set to empty.") && console.log(log.last);
        nodeModel.set("name","");
      }
    }
    var metadataView = metadataAddItemController.metadataAddItemPropView,
        headerView = metadataView && metadataView.metadataHeaderView,
        nameView = headerView && headerView.metadataItemNameView;
    if (nameView) {
      var gs = general.get("schema"),
          isReadOnly = (gs && gs.properties && gs.properties.name && gs.properties.name.readonly) ? true : false,
          placeHolder = isReadOnly ? lang.nameIsGeneratedAutomatically : undefined;
      nameView.setPlaceHolder(placeHolder);
      if (isReadOnly && metadataView && metadataView.metadataPropertiesView) {
        metadataView.metadataPropertiesView.once("render:forms",function() {
          this.options.metadataView.metadataHeaderView.metadataItemNameView.$el.find('span.title').removeAttr("role");
		  var focusEl = this.currentlyFocusedElement();
          if (focusEl) {
            focusEl.focus();
          }
        });
      }
    }
  }

  return AddWorkspaceCommand;
});



