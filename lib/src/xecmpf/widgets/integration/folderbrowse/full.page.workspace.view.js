/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/factories/node', 'csui/models/node/node.model',
  'csui/utils/contexts/perspective/plugins/node/node.extra.data',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/controls/perspective.panel/perspective.panel.view',
  'csui/utils/commands', 'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/globalmessage/globalmessage',
  'xecmpf/utils/commands/workspaces/workspace.delete',
  'hbs!xecmpf/widgets/integration/folderbrowse/impl/full.page.workspace',
  'css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse'
], function (module, _, $, Marionette, NodeModelFactory, NodeModel, NodeExtraData, PerspectiveContext,
  PerspectivePanelView, CsuiCommands, ModalAlert, GlobalMessage, WkspDeleteCmd, FullPageWorkspaceTemplate) {
  "use strict";

  var FullPageWorkpsaceView = Marionette.ItemView.extend({

    className: 'xecm-full-page-workspace',

    constructor: function FullPageWorkpsaceView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      require.config({
        config: {
          'conws/widgets/header/header.view': {
            hideActivityFeed: true,
            hideDescription: true,
            hideWorkspaceType: true,
            toolbarBlacklist: ['SearchFromHere'],
            hideToolbarExtension:true
          },
          'xecmpf/widgets/header/header.view':{
            hideMetadata: true,
            hideDescription: true,
            hideActivityFeed: true,
            pageWidget: true,
            toolbarBlacklist: ['SearchFromHere'],
            hideToolbarExtension:true
          },
          'csui/integration/folderbrowser/commands/go.to.node.history': {
            enabled: true
          },
          'xecmpf/utils/commands/folderbrowse/search.container': {
            pageWidget : true,
            enabled: true
          }
        }
      });
    },

    template: FullPageWorkspaceTemplate,

    templateHelpers: function () {
      return {
        fullPageWorkspaceUrl: this.options.fullPageWorkspaceUrl,
        viewIFrame: this.isIFrameRequired()
      };
    },

    commands: CsuiCommands,

    onRender: function(){
      if (!this.isIFrameRequired()) {
        var nodeModel = new NodeModel({
          id: this.options.nodeID
        }, {
          connector: this.options.connector,
          includeResources: ['perspective', 'metadata'],
          fields: NodeExtraData.getModelFields(),
          commands: this.commands.getAllSignatures()
        });
        var that = this;
        nodeModel.fetch()
        .done(function () {
          var factories = {
            connector: that.options.connector
          },
          perspectiveContext = new PerspectiveContext({
            factories: factories
          }),
          perspectiveView = new PerspectivePanelView({
            context: perspectiveContext
          });

          if(that.options.renderType === undefined || that.options.renderType !== 'dialog') {
            var del = CsuiCommands.get('Delete');
            if (del) {
              CsuiCommands.remove(del);
            }
            var deleteData = {};
            deleteData.id = that.options.nodeID;
            deleteData.viewMode = {};
            deleteData.viewMode.mode = that.options.data.viewMode.mode;
            deleteData.viewMode.viewIFrame = that.options.data.viewMode.viewIFrame;
            deleteData.openFullPageWorkspaceEnabled = that.options.openFullPageWorkspaceEnabled;
            deleteData.fullPageOverlayEnabled = that.options.fullPageOverlayEnabled;
            deleteData.goToNodeHistoryEnabled = that.options.goToNodeHistoryEnabled;
            deleteData.busObjectId = that.options.data.busObjectId;
            deleteData.busObjectType = that.options.data.busObjectType;
            deleteData.extSystemId = that.options.data.extSystemId;
            var busWkspDeleteCmd = new WkspDeleteCmd(deleteData);
            CsuiCommands.add(busWkspDeleteCmd);

            that.listenTo(busWkspDeleteCmd, 'xecm:delete:workspace:noiframe', function () {
              _.defaults(that.options.data, {
                deletecallback: true
              });
              that.options.status.wksp_controller.selectWorkspace(that.options);
              var backCommand = CsuiCommands.get('Back');
              if (backCommand &&
                  backCommand.clearHistory &&
                  that.options.context) {
                backCommand.clearHistory(that.options.context);
              }
            });
          }

          perspectiveContext.options.suppressReferencePanel = true;
          that.listenTo(perspectiveContext, 'clear', function () {
            var nodeModelFactory = perspectiveContext.getModel(NodeModelFactory);
            if (!nodeModelFactory.get('id')) {
              nodeModelFactory.set(nodeModel.toJSON());
            }
          });

          GlobalMessage.setMessageRegionView(perspectiveView,
            { classes: "xecm-global-message", useClass: true, sizeToParentContainer: true });

          var contentRegion = new Marionette.Region({
            el: that.el
          });
          that.$el.addClass("binf-widgets xecm-page-widget xecm-no-iframe-wrap");
          contentRegion.show(perspectiveView);
          perspectiveContext.applyPerspective(nodeModel);
        })
        .fail(function (error) {
          ModalAlert.showError(error.responseJSON.error);
          console.error(error);
        });
      }
    },

    isIFrameRequired: function () {
      if (!this.options.data || !this.options.data.viewMode || this.options.data.viewMode.viewIFrame === undefined 
          || this.options.data.viewMode.viewIFrame) {
        return true;
      }
      return false;
    },

  });

  return FullPageWorkpsaceView;
});
