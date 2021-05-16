
csui.define('css!xecmpf/pages/start/perspectivewithoutheader',[],function(){});
  csui.define('xecmpf/pages/start/perspective-only.page.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/fastclick', 'csui/utils/namedlocalstorage',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/connector', 'csui/utils/contexts/factories/user',
  'csui/pages/start/perspective.routing', 'csui/utils/url', 'csui/utils/base',
  'csui/controls/perspective.panel/perspective.panel.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/utils/page.leaving.blocker',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/iconpreload/icon.preload.view',
  "css!xecmpf/pages/start/perspectivewithoutheader"
  ], function (module, _, $, Backbone, Marionette, FastClick, NameLocalStorage,
  PerspectiveContext, ConnectorFactory, UserModelFactory, PerspectiveRouting,
  Url, base, PerspectivePanelView, ViewEventsPropagationMixin,
  TabablesBehavior, PageLeavingBlocker, GlobalMessage, IconPreloadView) {

  var config = module.config();

  var PerspectiveOnlyPageView = Marionette.ItemView.extend({

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior
      }
    },

    template: false,

    constructor: function PerspectiveOnlyPageView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      if (!this.options.el) {
        this.setElement(document.body);
      }

      // Create application context for this page
      var context = new PerspectiveContext(),
        connector = context.getObject(ConnectorFactory);

      // SAPRM-9977
      context.options = context.options || {};
      context.options.suppressReferencePanel = true;
      // End of SAPRM-9977

      // Check if the page has authentication information
      // Use Basic Authentication (known credentials)
      if (!connector.connection.credentials &&
        // Use pre-authenticated session (session.ticket)
        !connector.authenticator.isAuthenticated() &&
        // Try pre-authenticated session from session storage
        !connector.authenticator.syncStorage().isAuthenticated()) {
        this._navigateToSignIn();
        return;
      }

      this.perspectivePanel = new PerspectivePanelView({
        context: context
      });
      this.propagateEventsToViews(this.perspectivePanel);

      // Initialize URL routing
      var routing = PerspectiveRouting.getInstance({
        context: context
      });

	  // Start the client application URL router
      var historyOptions;
      if (PerspectiveRouting.routesWithSlashes()) {
        historyOptions = {
          pushState: true,
          // Use the URL path cut to the /app, without the rest of the path,
          // which should be handled by the client locally
          root: Url.combine(
            new Url(new Url(location.pathname).getCgiScript()).getPath(),
            '/xecm')
        };
      } else {
        // The current location path is the default root. However, the
        // Backbone.history.atRoot() returns true, only if the root is
        // set explicitly.  Probably a Backbone bug.
        historyOptions = {
          root: location.pathname
        };
      }
      Backbone.history.start(historyOptions);

      // Enable styling workarounds for Safari on iPad.  We might want to
      // put them to a separate CSS file loaded dynamically, instead of
      // having them in the same file identified by this class, if the size
      // of the workaround styles grows too much.
      if (base.isAppleMobile()) {
        this.$el.addClass('csui-on-ipad');
      }

      // Workaround for an iPad quirk for the price of disabling its
      // double-tap features; it waits 300ms before the click event
      // is dispatched and this makes it do it immediately
      FastClick.attach(this.el);

      // Workaround for the back-forward cache in Safari, which ignores the
      // no-store cache control flag and loads the page from cache, when the
      // back button is clicked.  As long as logging out does not invalidate
      // the LLCookie/OTCSTicket and we write the ticket to the /app, going
      // back would allow the logged-out user working with the REST API again.
      //
      // http://madhatted.com/2013/6/16/you-do-not-understand-browser-history
      // http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/
      $(window).on("unload",function () { });

      this.perspectivePanel.on("show:perspective swap:perspective", function () {
        var parent = window.opener ? window.opener :
                     window !== window.parent ? window.parent : undefined;
        if (parent) {
          if (this.$el.find(".conws-header-wrapper").length === 0) {
            // when full page view is opened from folderbrowse, folderbrowse's origin (integration system) need not necessarily be same as full page view's origin (CS).
            // So setting the targetOrigin to "*" as we dont have access to the parent origin
            parent.postMessage({"status": "showDialogHeader"}, "*");
          } else {
            // when full page view is opened from folderbrowse, folderbrowse's origin (integration system) need not necessarily be same as full page view's origin (CS).
            // So setting the targetOrigin to "*" as we dont have access to the parent origin
            parent.postMessage({"status": "hideDialogHeader"}, "*");
          }
        }
      });

      $(document).on("keyup", function (e) {
        if (e.keyCode === 27) {
          // close full page view on esc 
          e.stopPropagation();
          var parent = window.opener ? window.opener :
                       window !== window.parent ? window.parent : undefined;
          parent && parent.postMessage({"status": "closeDialog"}, "*");
        }
      });
    },

    onRender: function () {
      if (!this._redirecting) {
        this.$el.addClass("binf-widgets xecm-page-widget");
        this.$el.append("<div class='binf-widgets'></div>")
        IconPreloadView.ensureOnThePage();
        GlobalMessage.setMessageRegionView(this,
          { classes: "xecm-global-message", useClass: true, sizeToParentContainer: true });
        var perspectiveRegion = new Marionette.Region({ el: this.$el.find("div") });
        perspectiveRegion.show(this.perspectivePanel);
      }
    },

    _navigateToSignIn: function () {
      if (PerspectiveRouting.routesWithSlashes()) {
        // If the session expires or is not available, reload the /app page;
        // authentication should be performed by the server redirecting to
        // the OTDS login page
        PageLeavingBlocker.forceDisable();
        location.reload();
      }
      // The REST of the view rendering continues, until the context
      // is switched, and the page would quickly show its content
      // before the location change finally kicks in.
      this._redirecting = true;
    }

  });

  _.extend(PerspectiveOnlyPageView.prototype, ViewEventsPropagationMixin);

  return PerspectiveOnlyPageView;

});

csui.define('xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/integration/folderbrowse/impl/nls/root/localized.strings',{
  BackButtonToolItem: "Back",
  PageWidgetToolItem: "Open Full Page Workspace",
  SearchToolItem: "Search From Here",
  SearchFromHerePlaceHolder: "Search From Here",
  CloseToolTip:"Close"
});



csui.define('css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse',[],function(){});
csui.define('xecmpf/widgets/integration/folderbrowse/search.box.view',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/search.box/search.box.view',
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  "css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse"
], function (module, _, $, SearchBoxView, Lang) {
  "use strict";

  var config = _.defaults({}, module.config(), {
    showOptionsDropDown: false,
    showSearchInput: true,
    searchFromHere: true,
    customSearchIconClass: "xecmpf-icon-search",
    customSearchIconEnabledClass: "xecmpf-icon-search-md",
    placeholder: Lang.SearchFromHerePlaceHolder
  });

  var CustomSearchBoxView = SearchBoxView.extend({
    constructor: function CustomSearchBoxView(options) {
      options = options || {};
      options.data = _.defaults({}, options.data, config);
      SearchBoxView.prototype.constructor.call(this, options);
    },
    //Overriding the searchIconClicked method of SearchBoxView to prevent window beforeunload event
    //of the connector from getting called."beforeunload" method of connector sets a flag which
    //indefinitely shows the blocker in case of error
    searchIconClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      SearchBoxView.prototype.searchIconClicked.call(this, event);
    },

    // Avoid the bubbling of space key event - XECMPF-880
    inputTyped: function (event) {
      if (event.which === 32) {
        event.stopPropagation();
      } else {
        SearchBoxView.prototype.inputTyped.call(this, event);
      }
    }
  });

  return CustomSearchBoxView;

});

csui.define('xecmpf/utils/commands/workspaces/workspace.delete',['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/commandhelper', 'conws/utils/commands/delete',
  'csui/integration/folderbrowser/commands/go.to.node.history', 'csui/utils/commands/confirmable',
  'csui/controls/globalmessage/globalmessage'
], function (module, require, _, $,
  CommandHelper, DeleteCommand, GoToNodeHistoryCommand, ConfirmableCommand,
  GlobalMessage) {
  'use strict';

  var config = module.config();

  _.defaults(config, {
    extSystemViewModes: ['folderBrowse', 'fullPage'],
    extSystemEl: '#widgetWMainWindow'
  });


  var goToNodeHistoryCommand = new GoToNodeHistoryCommand();
  var origExecute = DeleteCommand.prototype._executeDelete,
    WkspDeleteCommand = DeleteCommand.extend({

      _executeDelete: function (status, options) {

        options || (options = {});

        var viewMode = this.get('viewMode') || config.viewMode,
          viewIFrame = viewMode ? (viewMode.viewIFrame === undefined ? true : viewMode.viewIFrame) : undefined,
          openFullPageWorkspaceEnabled = this.get('openFullPageWorkspaceEnabled'),
          goToNodeHistoryEnabled = this.get('goToNodeHistoryEnabled'),
          fullPageOverlayEnabled = this.get('fullPageOverlayEnabled');

        _.extend(status, {
          viewMode: viewMode && (viewMode.mode ? viewMode.mode : viewMode),
          viewIFrame: viewIFrame,
          wkspId: this.get('id') || config.id
        });

        var node = CommandHelper.getJustOneNode(status);

        options.originatingView = status.originatingView;

        // return the original CSUI delete execute call if
        // not an external system
        // OR if it is external system but deleting multiple nodes
        // OR if it is external system and deleting single node but not deleting the top level BWS
        if (config.extSystemViewModes.indexOf(status.viewMode) === -1 ||
          !node ||
          node.get('id') !== status.wkspId) {
          return origExecute.apply(this, arguments);
        }

        // bus. wksp. parameters
        _.extend(status, {
          busObjectId: this.get('busObjectId') || config['busObjectId'],
          busObjectType: this.get('busObjectType') || config['busObjectType'],
          extSystemId: this.get('extSystemId') || config['extSystemId']
        });

        var deferred = $.Deferred(),
          commandData = status.data || {},
          context = status.context || options.context,
          showProgressDialog = commandData.showProgressDialog != null ?
          commandData.showProgressDialog : true,
          self = this;

        ConfirmableCommand.execute.call(this, status, options)
          .done(function (results) {
            showProgressDialog && GlobalMessage.hideFileUploadProgress();
            csui.require(['xecmpf/widgets/workspaces/workspaces.widget'], function (WorkspacesWidget) {

              // SAPRM-10902: if workspace is deleted then clear as well the history
              goToNodeHistoryCommand.clearHistory(context);
              if (status.viewMode === 'fullPage') {
                var data = {
                  busObjectId: status.busObjectId,
                  busObjectType: status.busObjectType,
                  extSystemId: status.extSystemId,
                  folderBrowserWidget: {
                    commands: {
                      'open.full.page.workspace': {
                        enabled: openFullPageWorkspaceEnabled,
                        fullPageOverlay: fullPageOverlayEnabled
                      },
                      'go.to.node.history': {
                        enabled: goToNodeHistoryEnabled
                      }
                    }
                  },
                  viewMode: {
                    mode: status.viewMode
                  }
                };

                if (status.viewIFrame === undefined || status.viewIFrame) {
                  window.parent.postMessage(JSON.stringify(data), "*");
                } else {
                  self.trigger('xecm:delete:workspace:noiframe');
                }
              }
              else {
                self.trigger('xecm:delete:workspace:folderBrowse');
              }
            });
            deferred.resolve(results);
          })
          .fail(function (args) {
            deferred.reject(args);
          });
        return deferred.promise();
      }
    });

  DeleteCommand.prototype = WkspDeleteCommand.prototype;

  return WkspDeleteCommand;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/integration/folderbrowse/impl/full.page.workspace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <iframe id=\"xecm-full-page-frame\" width=\"100%\" height=\"100%\" src=\""
    + this.escapeExpression(((helper = (helper = helpers.fullPageWorkspaceUrl || (depth0 != null ? depth0.fullPageWorkspaceUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"fullPageWorkspaceUrl","hash":{}}) : helper)))
    + "\" />\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.viewIFrame : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_widgets_integration_folderbrowse_impl_full.page.workspace', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/integration/folderbrowse/full.page.workspace.view',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
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
      csui.require.config({
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

csui.define('xecmpf/widgets/integration/folderbrowse/search.results/search.results.view',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/search.results/search.results.view',
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  "css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse"
], function (module, _, $, SearchResultsView, Lang) {
  "use strict";

  var CustomSearchResultsView = SearchResultsView.extend({
    constructor: function CustomSearchResultsView(options) {
      options = options || {};
      options = _.extend(options, options.data);
      SearchResultsView.prototype.constructor.call(this, options);
      this.listenTo(this,"go:back",function(){
        history.back();
      })
    }
  });

  return CustomSearchResultsView;

});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/integration/folderbrowse/modaldialog/impl/modal.dialog',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"binf-modal-dialog binf-modal-lg\">\r\n  <div class=\"binf-modal-content\">\r\n    <div class=\"xecm-modal-header\">\r\n      <div title=\""
    + this.escapeExpression(((helper = (helper = helpers.closeToolTip || (depth0 != null ? depth0.closeToolTip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeToolTip","hash":{}}) : helper)))
    + "\"\r\n          class=\"cs-close icon-tileCollapse icon-pagewidget-collapse csui-acc-focusable-active\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeToolTip || (depth0 != null ? depth0.closeToolTip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeToolTip","hash":{}}) : helper)))
    + "\" role=\"button\"></div>\r\n    </div>\r\n    <div class=\"binf-modal-body\"></div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_integration_folderbrowse_modaldialog_impl_modal.dialog', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/integration/folderbrowse/modaldialog/impl/modal.dialog',[],function(){});
csui.define('xecmpf/widgets/integration/folderbrowse/modaldialog/modal.dialog.view',['csui/lib/underscore', 'csui/controls/dialog/dialog.view',
  'hbs!xecmpf/widgets/integration/folderbrowse/modaldialog/impl/modal.dialog',
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  'css!xecmpf/widgets/integration/folderbrowse/modaldialog/impl/modal.dialog'
], function (_, DialogView, Template, Lang) {
  var ModalDialogView = DialogView.extend({
    template: Template,
    templateHelpers: function () {
      return {
        closeToolTip: Lang.CloseToolTip
      };
    },

    events: function(){
      return _.extend({},DialogView.prototype.events,{
        'keypress .cs-close' : 'onKeyPress'
      });
    },

    onKeyPress: function (event) {
      var keyCode = event.keyCode;

      //Enter/space
      if (keyCode === 13 || keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        this.destroy();
      }
    }
  });
  return ModalDialogView;
});
csui.define('xecmpf/utils/commands/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/utils/commands/nls/root/localized.strings',{

  DetachPageLeavingWarning: "If you leave the page now, pending items will not be detached.",
  DetachBusAtts: 'Detaching {0} business objects',
  DetachingOneBusAtt: 'Detaching business object',

  DetachBusAttsNoneMessage: "No business objects detached.",
  DetachOneBusAttSuccessMessage: "1 business object succeeded to detach.",
  DetachSomeBusAttsSuccessMessage: "{0} business objects succeeded to detach.",
  DetachManyBusAttsSuccessMessage: "{0} business objects succeeded to detach.",
  DetachOneBusAttFailMessage: "1 business object failed to detach.",
  DetachSomeBusAttsFailMessage: "{0} business objects failed to detach.",
  DetachManyBusAttsFailMessage2: "{2} business objects failed to detach.", // {2} !!
  DetachSomeBusAttsFailMessage2: "{2} business objects failed to detach.", // {2} !!
  DetachingSomeBusAtts: 'Detaching {0} business objets',

  DetachBusAttsCommandConfirmDialogTitle: "Detach",
  DetachBusAttsCommandConfirmDialogSingleMessage: "Do you want to detach {0}?",
  DetachBusAttsCommandConfirmDialogMultipleMessage: "Do you want to detach {0} items?",
  CommandDoneVerbDetached: 'detached',
  CommandNameDetach: 'Detach Business Attachment',

  AttachPageLeavingWarning: "If you leave the page now, pending items will not be detached.",
  AttachBusAtts: 'Attaching {0} business objects',
  AttachingOneBusAtt: 'Attaching business object',

  AttachBusAttsNoneMessage: "No business objects attached.",
  AttachOneBusAttSuccessMessage: "1 business object succeeded to attach.",
  AttachSomeBusAttsSuccessMessage: "{0} business objects succeeded to attach.",
  AttachManyBusAttsSuccessMessage: "{0} business objects succeeded to attach.",
  AttachOneBusAttFailMessage: "1 business object failed to attach.",
  AttachSomeBusAttsFailMessage: "{0} business objects failed to attach.",
  AttachManyBusAttsFailMessage: "{0} business objects failed to attach.",
  AttachManyBusAttsFailMessage2: "{2} business objects failed to attach.", // {2} !!
  AttachSomeBusAttsFailMessage2: "{2} business objects failed to attach.", // {2} !!
  AttachingSomeBusAtts: 'attaching {0} business objets',

  AttachBusAttsCommandConfirmDialogTitle: "Attach",
  AttachBusAttsCommandConfirmDialogSingleMessage: "Do you want to attach {0}?",
  AttachBusAttsCommandConfirmDialogMultipleMessage: "Do you want to attach {0} items?",
  AttachBusAttsCommandConfirmDialogHtml: "<span class='msgIcon WarningIcon'>" +
    "<%- message %>" +
    "</span>",
  CommandDoneVerbAttached: 'attached',
  CommandNameAttach: 'Attach Business Attachment',

  CommandNameOpenSapObject: 'Open Sap Object',

  CommandNameGoToWorkspace: 'Go To Workspace',

  GoToWorkpsaceHistory: "Go To Workspace History",
  OpenFullPageWorkpsace: "Open Full Page Wokspace",
  SearchWorkspace: "Search From Here",
  SearchBackTooltip: "Go Back to '{0}'",  

  /* Start BO Attachment */
  BOAttachmentCreate: {
    name: 'Add business attachment',
    verb: 'attach',
    doneVerb: 'attached',
    addButtonLabel: 'Attach',
    pageLeavingWarning: 'If you leave the page now, pending items will not be attached.',
    successMessages: {
      formatForNone: 'No business attachments attached.',
      formatForOne: '1 business attachment succeeded to attach.',
      formatForMultiple: '{0} business attachments succeeded to attach.'
    },
    errorMessages: {
      //formatForNone: 'No business attachments attached.',
      formatForOne: '1 business attachment failed to attach.',
      formatForMultiple: '{0} business attachments failed to attach.'
    },
    progressBarMessages: {
      oneFileTitle: 'Attaching business attachment',
      //oneFileSuccess: '1 business attachment succeeded to attach.',
      //multiFileSuccess: '{0} business attachments succeeded to attach.',
      //oneFilePending: 'Attaching business attachment',
      multiFilePending: 'Attaching {0} business attachments',
      //oneFileFailure: '1 business attachment failed to attach.',
      multiFileFailure: '{2} business attachments failed to attach.', // {2} !!
      //someFileSuccess: '{0} business attachments succeeded to attach.',
      //someFilePending: 'Attaching {0} business attachments',
      //someFileFailure: '{2} business attachments failed to attach.' // {2} !!
    }
  },
  /* End BO Attachment */

  backButtonToolTip: 'Go back',

  // BO Attachments Snapshot Command
  CommandSnapshot: 'Snapshot',
  snapshotCreated: 'Snapshot created',
  snapshotCreatedWithName: "Snapshot '{0}' created",
  snapshotFailed: 'Snapshot creation failed',
  CommandDoneVerbCreated: 'created',

  //EAC Global Messages
  Refresh: 'Events refreshed.',
  RefreshError: 'Error while refreshing.',
  AuthenticationError: 'Authentication failed'
});

csui.define('xecmpf/utils/commands/folderbrowse/go.to.workspace.history',['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/models/command',
  'csui/lib/backbone',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, $, _, CommandModel, Backbone, lang) {
  var localHistory = [location.href]
  var listening;
  var GoToWorkpsaceHistory = CommandModel.extend({
    defaults: {
      signature: 'WorkspaceHistory',
      name: lang.GoToWorkpsaceHistory
    },
    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      if (!listening) {
        listening = true;
        window.addEventListener('popstate', function () {
          if (localHistory.length > 1 && localHistory[localHistory.length - 2] === location.href) {
            localHistory.pop();
          }
        });
        Backbone.history.on('navigate', function () {
          localHistory.push(location.href);
        });
      }
      return config.enabled && localHistory.length > 1;
    },
    execute: function (status, options) {
      history.back();
      return $.Deferred().resolve().promise();
    }

  });
  return GoToWorkpsaceHistory;
});




csui.define('xecmpf/utils/commands/folderbrowse/search.container',['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/models/command',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, require, _, $, Marionette, CommandModel, lang) {
  var SearchWorkspace = CommandModel.extend({

    defaults: {
      signature: 'SearchFromHere',
      name: lang.SearchWorkspace
    },
    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      return config.enabled;
    },

    execute: function (status, options) {
      var config = _.extend({
        pageWidget: false
      }, module.config());

      var self         = this;
      var deferred = $.Deferred();
      csui.require(['xecmpf/widgets/integration/folderbrowse/search.box.view',
        'xecmpf/controls/search.textbox/search.textbox.view',
        'csui/widgets/search.results/search.results.view',
        'csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/next.node',
        'csui/utils/contexts/factories/search.query.factory',
        this.get('commands')
      ], function (SearchBoxView, HeaderSearchBoxView, SearchResultsView, NodeModelFactory,
          NextNodeModelFactory, SearchQueryModelFactory, commands) {
        var searchIconHolder = status.originatingView.$el.find('.csui-search-button');
        if (!searchIconHolder.find('div.csui-searchbox-holder').length) {
          searchIconHolder.append("<div class='csui-searchbox-holder'></div>");
        }
        //var self         = this,
        var  searchRegion = new Marionette.Region({
              el: options.el ? options.el : searchIconHolder.find('div.csui-searchbox-holder')
            }),
            context      = status.originatingView && status.originatingView.context ? status.originatingView.context :
                           options && options.context,
            node         = !!context ? context.getModel(NodeModelFactory) : null,
            nodeId       = !!node ? node.get("id") : 0,
            wkspNodeId   = (status.originatingView && status.originatingView.options && status.originatingView.options.workspaceContext && status.originatingView.options.workspaceContext.wkspid && status.originatingView.options.workspaceContext.wkspid.get("id")) ? status.originatingView.options.workspaceContext.wkspid.get("id") : 0;
        if (!config.pageWidget) { // No need to delete the the factory in case of page widget as
          // it is cleared on perspective change
          delete context._factories["searchQuery"];
        }
        var searchInCommand = false;
        var searchView = wkspNodeId === 0 ? SearchBoxView : HeaderSearchBoxView;
        searchInCommand = wkspNodeId === 0 ? false : true;
        self.searchBoxView = new searchView({
            context: context,
            originatingView: status.originatingView,
            data: {
              nodeId: wkspNodeId === 0 ? nodeId : wkspNodeId
            }
        });

        self.originatingViewElement = status.originatingView.$el;
        self.listenTo(self.searchBoxView, "hide:searchbar", function () {
          self.searchBoxView.destroy();
          self.originatingViewElement.find("a.csui-toolitem").show();
          self.originatingViewElement.find("a.csui-toolitem").trigger("focus");
        });
        self.listenTo(self.searchBoxView, "show", function () {
          setTimeout(function () {
              var inputBoxClass = !!searchInCommand ? '.xecmpf-input' : '.csui-input';
              self.originatingViewElement.find(inputBoxClass).trigger("focus");
          }, 25);
        });
        
        status.originatingView.$el.find('.csui-search-button > a.csui-toolitem').hide();
        searchRegion.show(self.searchBoxView);
        if (!config.pageWidget || searchInCommand) {
          // replace the originatingView with sliding left/right animation
          if (status.originatingView) {
            var _searchQuery = context.getModel(SearchQueryModelFactory);
            var _viewName, _triggerViewName, _eventName;
            if (searchInCommand) {
              _viewName = self.searchBoxView,
              _triggerViewName = self.searchBoxView,
              _eventName = 'search:results'
            } else {
              _viewName = status.originatingView,
              _triggerViewName = _searchQuery,
              _eventName = 'change'
           }

            _viewName.listenTo(_triggerViewName, _eventName, function () {
              delete context._factories["searchResults"];
              var searchResultsView = new SearchResultsView({
                container: status.container,
                originatingView: status.originatingView,
                context: context,
                commands: commands,
                enableBackButton: true,
                backButtonToolTip: _.str.sformat(lang.SearchBackTooltip,
                    status.container.get("name"))
              });

              var _showOriginatingView, $csSearchResults;
              var originatingViewParent = self.originatingViewElement.parent();
              originatingViewParent.find('.cs-search-results-wrapper').remove();
              originatingViewParent.append("<div class='cs-search-results-wrapper'></div>");

              self.$csSearchResults = $(
                  originatingViewParent.find('.cs-search-results-wrapper')[0]);
              self.$csSearchResults.hide();
              searchResultsView.render();
              if (searchInCommand) {
                searchResultsView.collection.fetch();
              } else {
                context.fetch();
              }
              Marionette.triggerMethodOn(searchResultsView, 'before:show');
              self.$csSearchResults.append(searchResultsView.el);
              if (searchInCommand) {
                self.originatingViewElement.hide();
              } else {
                self.originatingViewElement.hide('blind', {
                  direction: 'left',
                  complete: function () {
                    self.$csSearchResults.show('blind',
                        {
                          direction: 'right',
                          complete: function () {
                            Marionette.triggerMethodOn(searchResultsView, 'show');
                          }
                        },
                        100);
                  }
                }, 100);
              }
              
              _showOriginatingView = function () {

                self.$csSearchResults.hide('blind', {
                  direction: 'right',
                  complete: function () {
                    self.originatingViewElement.show('blind',
                        {
                          direction: 'left',
                          complete: function () {
                            delete context._factories["searchResults"];
                            delete context._factories["searchFacets"];
                            status.originatingView.triggerMethod('dom:refresh');
                          }
                        },
                        100);
                    searchResultsView.destroy();
                    self.$csSearchResults.remove();
                  }
                }, 100);
              };
              self._nextNode = context.getModel(NextNodeModelFactory);
              self.listenToOnce(self._nextNode, 'change:id', _.bind(_showOriginatingView, self));
              self.listenToOnce(searchResultsView, 'go:back', _.bind(_showOriginatingView, self));

            });
          }
        }
        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    }
  });

  return SearchWorkspace;
});
csui.define('xecmpf/utils/commands/folderbrowse/open.full.page.workspace',['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/models/command',
  'csui/utils/contexts/factories/connector',
  'csui/utils/url',
  'csui/dialogs/modal.alert/modal.alert',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, require, $, _, CommandModel, ConnectorFactory, Url, ModalAlert, lang) {
  var OpenFullPageWorkpsace = CommandModel.extend({
    defaults: {
      signature: 'WorkspacePage',
      name: lang.OpenFullPageWorkpsace,
      scope: 'single'
    },

    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      return config.enabled && !!status.container;
    },
    execute: function (status, options) {
      var that = this,
          config = _.extend({
              fullPageOverlay: false,
          }, module.config()),
          deferred = $.Deferred(),
          context = status.originatingView ? status.originatingView.context : options && options.context,
          urlPrefix = 'xecm',
          connector = context.getObject(ConnectorFactory),
          cgiUrl = connector && connector.connection && connector.connection.url ?
                   connector.connection.url.replace('/api/v1', '') : '',
          currentWindowRef = window,
          applyTheme = !!status && !!status.data && !!status.data.applyTheme,
          themePath = applyTheme ? $(currentWindowRef.document).find(
              "head > link[data-csui-theme-overrides]").attr('href') : undefined,
          fullPageWorkspaceUrl = Url.combine(cgiUrl, urlPrefix, 'nodes',
              status.container.get('id')),
          xhr = new XMLHttpRequest(),
          targetOrigin = new Url(cgiUrl).getAbsolute();
        if (config.fullPageOverlay) {
          csui.require(['xecmpf/widgets/integration/folderbrowse/modaldialog/modal.dialog.view',
                  'xecmpf/widgets/integration/folderbrowse/full.page.workspace.view', 'csui/models/node/node.model',
                  'csui/utils/contexts/factories/node',
                  'csui/utils/contexts/perspective/perspective.context',
                  'csui/controls/perspective.panel/perspective.panel.view',
                  'csui/utils/commands',
                  'csui/utils/contexts/perspective/plugins/node/node.extra.data'
            ],
            function (ModalDialogView, FullPageWorkspaceView, NodeModel, NodeModelFactory, PerspectiveContext, PerspectivePanelView, commands, NodeExtraData) {
              that.authenticate(xhr, cgiUrl, connector);
              xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                  //TODO: will remove viewIFrame parameter once done with implementation of removing iframe
                  var viewMode = context.options.viewMode || {};
                  if (viewMode.viewIFrame === undefined || viewMode.viewIFrame) {
                    // XECMPF-1548: extSystemId, busObjectType and busObjectId are needed for the xecmpage handler
                    // in order to initialize bus.wksp. delete command correctly
                    if (config.extSystemId && config.busObjectType && config.busObjectId ) {
                      var queryParams = "where_ext_system_id=" + config.extSystemId +
                          "&where_bo_type=" + config.busObjectType +
                          "&where_bo_id=" + config.busObjectId +
                          "&view_mode=fullPage";
                      fullPageWorkspaceUrl = Url.appendQuery(fullPageWorkspaceUrl, queryParams);
                    }
                    // XECMPF-1548
                    fullPageWorkspaceUrl = Url.appendQuery(fullPageWorkspaceUrl, "pageOverlay=true");
                    var fullPageWorkspaceView = new FullPageWorkspaceView({
                            fullPageWorkspaceUrl: fullPageWorkspaceUrl
                        }),
                        dialog = new ModalDialogView({
                            title: status.container.get("name"),
                            className: 'xecm-modal-dialog',
                            iconRight: "icon-tileCollapse",
                            view: fullPageWorkspaceView
                        });
                    dialog.show();
                    currentWindowRef.addEventListener("message", function (e) {
                      if (e.origin &&
                        (new RegExp(e.origin, "i").test(new Url(cgiUrl).getOrigin()))) {
                          if (e.data) {
                            if (e.data.status === 'closeDialog') {
                              dialog.$el.find(".cs-close").trigger("click");
                            } else if (e.data.status === 'showDialogHeader') {
                              dialog.$el.find(".xecm-modal-header").show();
                            } else if (e.data.status === 'hideDialogHeader') {
                                dialog.$el.find(".xecm-modal-header").hide();
                            }
                          }
                      }
                    });

                    if (applyTheme) {
                      var setTheme = function (e) {
                        if (e.origin &&
                          (new RegExp(e.origin, "i").test(new Url(cgiUrl).getOrigin()))) {
                          if (e.data) {
                            if (e.data.status === "ok") {
                              e.source.postMessage({
                                  "themePath": themePath
                              }, targetOrigin);
                                currentWindowRef.removeEventListener("message", setTheme, false);
                            }
                          }
                        }
                      }
                      currentWindowRef.addEventListener("message", setTheme);
                    }
                  } else {
                    var data = {
                      viewMode: viewMode
                    };
                    var fullPageNoIFrameOptions = {
                      data: data,
                      nodeID: status.container.get('id'),
                      status: status,
                      context: context,
                      connector: connector,
                      renderType: 'dialog'
                    };
                    var fullPageWorkspace = new FullPageWorkspaceView(fullPageNoIFrameOptions);
                    dialog = new ModalDialogView({
                      title: status.container.get("name"),
                      className: 'xecm-modal-dialog',
                      iconRight: "icon-tileCollapse",
                      view: fullPageWorkspace
                    });
                    dialog.show();
                    csui.require.config({
                      config: {
                        'conws/widgets/header/header.view': {
                          enableCollapse: config.fullPageOverlay
                        },
                        'xecmpf/widgets/header/header.view': {
                          enableCollapse: config.fullPageOverlay
                        },
                        'xecmpf/utils/commands/folderbrowse/open.full.page.workspace': {
                          enabled: false
                        }
                      }
                    });
                  }
                }
              }
              deferred.resolve();
            },
            function (error) {
              deferred.reject(error);
            });
        } else {
          var targetWindowRef = currentWindowRef.open('');
            this.authenticate(xhr, cgiUrl, connector);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                targetWindowRef.location.href = fullPageWorkspaceUrl;
                if (applyTheme) {
                  currentWindowRef.addEventListener("message", function (e) {
                    if (e.origin && (new RegExp(e.origin, "i").test(new Url(cgiUrl).getOrigin()))) {
                      if (e.data) {
                        if (e.data.status === "ok") {
                            targetWindowRef.postMessage({
                                "themePath": themePath
                            }, targetOrigin);
                        }
                      }
                    }

                  });
                }
              }
                deferred.resolve();
            }
        }
        return deferred.promise();
    },
    authenticate: function (xhr, cgiUrl, connector) {
      if (connector.connection.session && connector.connection.session.ticket) {
        this.authenticateworkspace(xhr, cgiUrl, connector);
      } else if (!!connector.connection.credentials) {
        var that    = this,
            request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            try {
              if (request.status === 200) {
                var contentType = request.getResponseHeader('content-type');
                if (/^application\/json/i.test(contentType)) {
                  var response = JSON.parse(request.responseText);
                  connector.connection.session = response;
                  that.authenticateworkspace(xhr, cgiUrl, connector);
                } else {
                  throw new Error('Unsupported content type: ' + contentType);
                }
              } else {
                throw new Error(request.status + ' ' + request.statusText);
              }
            } catch (error) {
              console.error(error);
            }
          }
        };
        request.open('POST', connector.connection.url + '/auth', true);
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send('username=' + encodeURIComponent(connector.connection.credentials.username) +
                     '&' + 'password=' +
                     encodeURIComponent(connector.connection.credentials.password));
      } else {
        ModalAlert.showError(lang.AuthenticationError);
      }
    },
    authenticateworkspace: function (xhr, cgiUrl, connector) {
      xhr.open("GET", cgiUrl + "/xecmauth", true);
      xhr.setRequestHeader("OTCSTicket", connector.connection.session.ticket);
      xhr.withCredentials = true;
      xhr.send(null);
    }
  });

  return OpenFullPageWorkpsace;
});
csui.define('xecmpf/utils/commands/boattachments/boattachments.create',['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/commandhelper', 'csui/utils/command.error', 'csui/utils/commands/multiple.items',
  'csui/models/command', 'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, require, _, $, Url,
  CommandHelper, CommandError, MultipleItemsCommand,
  CommandModel, lang) {
  'use strict';

  var config = _.extend({
    nodesSelectionType: 'savedQuery' //browse
  }, module.config());

  var CmdModelWithMultipleItemsMixin = CommandModel.extend({});
  _.extend(CmdModelWithMultipleItemsMixin.prototype, MultipleItemsCommand);

  var GlobalMessage, BOAttachment;

  var BOAttachmentsCreate = CmdModelWithMultipleItemsMixin.extend({
    defaults: {
      signature: 'BOAttachmentsCreate',
      command_key: ['BOAttachmentsCreate'],
      name: lang.BOAttachmentCreate.name,
      verb: lang.BOAttachmentCreate.verb,
      doneVerb: lang.BOAttachmentCreate.doneVerb,
      pageLeavingWarning: lang.BOAttachmentCreate.pageLeavingWarning,
      scope: 'multiple',
      successMessages: {
        formatForNone: lang.BOAttachmentCreate.successMessages.formatForNone,
        formatForOne: lang.BOAttachmentCreate.successMessages.formatForOne,
        formatForTwo: lang.BOAttachmentCreate.successMessages.formatForMultiple,
        formatForFive: lang.BOAttachmentCreate.successMessages.formatForMultiple
      },
      errorMessages: {
        formatForNone: lang.BOAttachmentCreate.successMessages.formatForNone,
        formatForOne: lang.BOAttachmentCreate.errorMessages.formatForOne,
        formatForTwo: lang.BOAttachmentCreate.errorMessages.formatForMultiple,
        formatForFive: lang.BOAttachmentCreate.errorMessages.formatForMultiple
      }
    },

    enabled: function (status) {
      // to check the table header action in the search results table view
      if (status.data && status.data.enabledAttach) {
        var nodes = CommandHelper.getAtLeastOneNode(status);
        return !!nodes.length;
      }
      // to check if user can add BO attachment
      return !!status.collection &&
        !!status.collection.businessObjectActions &&
        !!status.collection.businessObjectActions.data &&
        _.has(status.collection.businessObjectActions.data, this.defaults.signature);
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      // avoid messages from handleExecutionResults
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;
      status.context = status.context || options && options.context;

      options = _.extend(options, status.data, {
        collection: status.collection
      });

      // SelectedNodes would be available from "Saved Query Node Picker Results Table".
      var selectedNodes = CommandHelper.getAtLeastOneNode(status);
      if (selectedNodes.length && !!status.originatingView) {
        // originating view would be Search Results View
        // to set the _result in Saved Query Node Picker
        status.originatingView.triggerMethod('set:picker:result', {
          nodes: selectedNodes.models
        });
        // resolve the Search Results Table command execute
        deferred.resolve();
        // to close the Saved Query Node Picker
        status.originatingView.triggerMethod('close');
      }
      // if selectedNodes are not available, open node picker to select nodes
      else {
        status.nodesSelectionType = status.nodesSelectionType ||
          (options && options.nodesSelectionType) ||
          config.nodesSelectionType;

        csui.require(['csui/controls/globalmessage/globalmessage',
          'xecmpf/widgets/boattachments/impl/boattachment.model'
        ], function () {
          GlobalMessage = arguments[0];
          BOAttachment = arguments[1];
          this._selectNodes(status, options)
            .then(function (results) {
              this._showProgressbarAndPerformActions(results.nodes, status, options)
                .then(deferred.resolve, deferred.reject);
            }.bind(this), function (err) {
              if (err && !err.cancelled) {
                GlobalMessage.showMessage('error', err);
              }
              deferred.reject(); // cancel action without error
            });
        }.bind(this), deferred.reject);
      }
      return deferred;
    },

    _selectNodes: function (status, options) {
      var deferred = $.Deferred(),
        that = this;
      csui.require(['csui/dialogs/node.picker/node.picker',
        'xecmpf/controls/savedquery.node.picker/savedquery.node.picker.view',
        'csui/controls/toolbar/toolitems.factory'
      ], function (NodePickerDialog, SavedQueryNodePickerView, ToolItemsFactory) {

        var toolItemsFactory = new ToolItemsFactory({
          main: [{
            signature: that.get('signature'),
            name: lang.BOAttachmentCreate.addButtonLabel,
            commandData: {
              enabledAttach: true
            }
          }]
          }, {
          maxItemsShown: 1,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: 'icon icon-toolbar-more',
          addGroupSeparators: false
        });

        var nodePicker = status.nodesSelectionType === 'savedQuery' ?

          new SavedQueryNodePickerView(_.extend({
            title: lang.BOAttachmentCreate.name,
            enableBackButton: true,
            backButtonToolTip: lang.backButtonToolTip,
            toolbarItems: {
              otherToolbar: toolItemsFactory,
              // as discussed with PM, inline actions not required
              inlineToolbar: [],
              tableHeaderToolbar: toolItemsFactory
              /*new ToolItemsFactory({
                                             other: [
                                               {
                                                 signature: that.get('signature'),
                                                 name: that.get('name'),
                                                 icon: that.get('icon')
                                               }
                                             ]
                                           }, {
                                             maxItemsShown: 1,
                                             dropDownText: lang.ToolbarItemMore,
                                             dropDownIcon: 'icon icon-toolbar-more',
                                             addGroupSeparators: false
                                           })*/
            }
          }, _.omit(status, 'collection', 'toolbarItems'))) :

          new NodePickerDialog(_.extend({
            selectMultiple: true,
            selectableTypes: [],
            unselectableTypes: [],
            showAllTypes: true,
            dialogTitle: lang.BOAttachmentCreate.name,
            selectButtonLabel: lang.selectButtonLabel
          }));

        nodePicker
          .show()
          .then(deferred.resolve, deferred.reject);

      }, deferred.reject);
      return deferred;
    },

    _showProgressbarAndPerformActions: function (selectedNodes, status, options) {
      var deferred = $.Deferred();
      csui.require(['csui/models/fileuploads'], function (UploadFileCollection) {

        var models = _.map(selectedNodes, function (node) {
            return {
              name: node.get('name'),
              state: 'pending',
              count: 0,
              total: 1,
              node: node
            };
          }),
          uploadCollection = new UploadFileCollection(models),
          newStatus = _.defaults({
            nodes: uploadCollection,
            suppressMultipleFailMessage: true
          }, status);

        uploadCollection.each(function (model) {
          model.node = model.get('node');
          model.unset('node', {
            silent: true
          });
        });

        GlobalMessage.showFileUploadProgress(uploadCollection, {
          oneFileTitle: lang.BOAttachmentCreate.progressBarMessages.oneFileTitle,
          oneFileSuccess: lang.BOAttachmentCreate.successMessages.formatForOne,
          multiFileSuccess: lang.BOAttachmentCreate.successMessages.formatForMultiple,
          oneFilePending: lang.BOAttachmentCreate.progressBarMessages.oneFileTitle,
          multiFilePending: lang.BOAttachmentCreate.progressBarMessages.multiFilePending,
          oneFileFailure: lang.BOAttachmentCreate.errorMessages.formatForOne,
          multiFileFailure: lang.BOAttachmentCreate.progressBarMessages.multiFileFailure,
          someFileSuccess: lang.BOAttachmentCreate.successMessages.formatForMultiple,
          someFilePending: lang.BOAttachmentCreate.progressBarMessages.multiFilePending,
          someFileFailure: lang.BOAttachmentCreate.progressBarMessages.multiFileFailure,
          enableCancel: false
        });

        this._performActions(newStatus, options)
          .then(function () {
            GlobalMessage.hideFileUploadProgress();
            deferred.resolve.apply(deferred, arguments);
          }.bind(this), deferred.reject);

      }.bind(this), deferred.reject);
      return deferred;
    },

    _performAction: function (model, options) {
      var node = model.node,
        connector = node.connector;

      return connector.makeAjaxCall({
        url: Url.combine(connector.connection.url.replace('/v1', '/v2'), 'businessobjects',
          encodeURIComponent(options.extId), encodeURIComponent(options.boType), encodeURIComponent(options.boid), 'businessattachments', node.get('id')),
        type: 'POST',
        data: {
          expand: {
            properties: {
              fields: ['original_id','ancestors','parent_id','reserved_user_id','createdby','modifiedby']
            }
          }
        },
        success: function (response, status, xhr) {
          var boAttachment = new BOAttachment(response.results[0], {
            connector: connector,
            parse: true
          });
          boAttachment.isLocallyCreated = true;
          options.collection.add(boAttachment, {
            at: 0
          });
          model.deferred.resolve(model);
        },
        error: function (xhr, status, err) {
          var cmdError = xhr ? new CommandError(xhr, node) : xhr;
          model.deferred.reject(model, cmdError);
        },
        complete: function (xhr, status) {
          model.set('count', 1);
        }
      });
    }
  });

  return BOAttachmentsCreate;
});
csui.define('xecmpf/widgets/eac/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
});

// Defines localizable strings in the default language (English)

csui.define('xecmpf/widgets/eac/impl/nls/root/lang',{
    //New Localization Strings
    dialogTitle: "Event Action Center",
    emptyListText: "No Events found.",
    ToolbarItemBack: "Back",
    ToolbarItemRefresh: "Refresh",
    ToolbarItemFilter: "Filter",
    actionPlan: "Action plan",
    addActionPlan: "Add action plan",
    columnEventName: "Event Name",
    columnSystemName: "System Name",
    columnActionPlan: "Action Plan",
    sourceLabel: "Source",
    rulesLabel: "Rules",
    runAs: "Run as",
    processMode: "Process mode",
    conjunctionAndLabel: "And",
    conjunctionOrLabel: "Or",
    operatorEqualtoLabel: "Equal to",
    operatorNotequaltoLabel: "Not equal to",
    synchronouslyProcessLabel: "Synchronously",
    asynchronouslyProcessLabel: "Asynchronously",
    csObjLabel: "Content Server object",
    evtPropLabel: "Event property",
    prevActLabel: "Result from previous action",
    labelExtendedECMVolume: "Extended ECM",
    saveLabel: "Save",
    cancelLabel: "Cancel",
    deleteActionPlanButton: "Delete",
    deleteActionPlanButtonAria: "Delete action plan",
    actionPlansGroup:"Action plans",
    backTitle: "Back",
    rulesTabLabel: "Rules",
    actionsTabLabel: "Actions",
    processModeTabLabel: "Process mode",
    rulesSetLegend: "Conditions",
    deleteActionPlanConfirmatonTitle: 'Delete action plan',
    deleteActionPlanConfirmatonText: 'Are you sure you want to delete {0}? ',
    newActionPlan: "New action plan",
    actionPlansListHeader: "Action plans",
    createLabel: "Create",
    closeLabel: "Close",
    genericWarningMsgOnDeletion: "Server Error: Unable to perform the action",
    warningMsgOnActionPlanNavigation: "All unsaved changes will be lost. Are you sure you want to continue?",
    actionPlanNavigationDialogTitle: "Unsaved changes",
    actionAttrParameterNameLabel: "Parameter name",
    actionAttrSourceLabel: "Source",
    actionAttrValueLabel: "Value"
});

csui.define('xecmpf/models/eac/eac.eventlist.columns.definitions',['i18n!xecmpf/widgets/eac/impl/nls/lang'
], function (lang) {

  var EACEventListColumnsDefinition = {
    "event_name": {
      "hidden": false,
      "key": "event_name",
      "name": lang.documentTypeLabel,
      "type": -1,
      "type_name": "String",
      "sort": true,
    },

    "namespace": {
      "key": "namespace",
      "name": lang.documentNameLabel,
      "type": -2,
      "type_name": "String"
    },

    "action_plan": {
      "key": "action_plan",
      "name": lang.documentStatusLabel,
      "type": -1,
      "type_name": "String"
    }
  };

  return EACEventListColumnsDefinition;
});

csui.define('xecmpf/models/eac/eventactionplans.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/expandable/expandable.mixin', 'csui/models/browsable/client-side.mixin',
  'csui/models/columns',
  'xecmpf/models/eac/eac.eventlist.columns.definitions'
], function (_, $, Backbone, Url, ConnectableMixin, ExpandableMixin, ClientSideBrowsableMixin,
  NodeColumnCollection, eacEventListColumnsDefinition) {

    var EACEventActionPlan = Backbone.Model.extend({

      idAttribute: '',

      constructor: function EACEventActionPlan(attributes, options) {
        options || (options = {});
        Backbone.Model.prototype.constructor.apply(this, arguments);
      },

      parse: function (response) {
        if(response) {
          response.has_action_plan = "false";
          if(response.action_plans) {
            response.has_action_plan = (!!response.action_plans.length).toString();
          }
        }
        return response;
      }
    });

    var EACEventActionPlans = Backbone.Collection.extend({

      model: EACEventActionPlan,

      constructor: function EACEventActionPlans(models, options) {
        this.options = options || {};
        Backbone.Collection.prototype.constructor.apply(this, arguments);
        this.makeConnectable(options)
          .makeClientSideBrowsable(options);
        this.columns = new NodeColumnCollection();
        this.columns.reset(this.getColumnModels());
      },

      url: function () {
        var url = this.connector.connection.url.replace('/v1', '/v2');
        url = Url.combine(url, 'eventactioncenter', 'actionplan') ;
        return url;
      },

      getColumnModels: function () {
        var definitions = eacEventListColumnsDefinition;
        var columnKeys = _.keys(definitions);
        var columns = _.reduce(columnKeys, function (colArray, column) {
          var definition = definitions[column];
          if (definition) {
            colArray.push(_.extend({ column_key: column }, definition));
          }
          return colArray;
        }, []);
        return columns;
      },

      parse: function (response) {
        var results = response.results.data;
        for (var i = 0; i < results.length; i++) {
          if (results[i].action_plan_count && parseInt(results[i].action_plan_count) > 0) {
            results[i].enableActionPlanCount = true;
          }
          results[i].eventIndexCount = i;
        }
        return results;
      }

    });

    ConnectableMixin.mixin(EACEventActionPlans.prototype);
    ClientSideBrowsableMixin.mixin(EACEventActionPlans.prototype);

    return EACEventActionPlans;
  });

csui.define('xecmpf/utils/commands/eac/eac.refresh',['csui/lib/underscore',
  "i18n!xecmpf/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node",
  "csui/utils/command.error",
  'xecmpf/models/eac/eventactionplans.model',
  'csui/controls/globalmessage/globalmessage'
], function (_, lang, CommandHelper, NodeCommand, CommandError, EACEventActionPlans, GlobalMessage) {
  'use strict';

  var EACRefreshCommand = NodeCommand.extend({

    defaults: {
      signature: "EACRefresh",
      command_key: ['EACRefresh'],
    },

    //only one node allowed at a time
    enabled: function (status, options) {
      return true;
    },

    execute: function (status, options) {
      status.suppressSuccessMessage = true;
      status.suppressFailMessage = true;

      if (this.eacCollection) {
        this.eacCollection = null;
      }

      this.eacCollection = new EACEventActionPlans(undefined, _.extend({}, status.collection.options));

      var promise = this.eacCollection.fetch();

      promise.done(function () {
        status.collection.reset(this.eacCollection.models);
        GlobalMessage.showMessage('success', lang.Refresh);
      }.bind(this));
      promise.done().fail(function () {
        GlobalMessage.showMessage('error', lang.RefreshError);
      }
      )
      return promise;
    }
  });

  return EACRefreshCommand;

});


csui.define('xecmpf/utils/commands/eac/eac.back',["require", 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node",
  'csui/utils/command.error'
], function (require, $, base, _, lang, CommandHelper, NodeCommand, CommandError) {
  'use strict';

  var EACBackCommand = NodeCommand.extend({

    defaults: {
      signature: "EACBack",
      command_key: ['EACBack'],
    },

    enabled: function (status, options) {
      return true;
    },

    execute: function (status, options) {
      //Back command
    }
  });

  return EACBackCommand;

});

csui.define('xecmpf/widgets/boattachments/impl/boattachment.table/commands/snapshot',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/models/command',
  'csui/utils/commandhelper',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function ($, _, CommandModel, CommandHelper, lang) {

  var SnapshotCommand = CommandModel.extend({

    defaults: {
      signature: 'Snapshot',
      name: lang.CommandSnapshot,
      scope: 'multiple',
      doneVerb: lang.CommandDoneVerbCreated
    },

    enabled: function (status) {
      return status && status.container && status.nodes && status.nodes.length > 0;
    },

    execute: function (status, options) {
      status.suppressSuccessMessage = true;
      status.suppressFailMessage = true;

      var deferred  = $.Deferred(),
          container = status.container;

      csui.require(['csui/utils/url',
        'csui/utils/base',
        'csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/children',
        'csui/utils/contexts/factories/children2',
        'csui/controls/globalmessage/globalmessage',
        'csui/widgets/nodestable/nodestable.view',
        'csui/utils/contexts/factories/next.node',
        'csui/behaviors/default.action/default.action.behavior'
      ], function (Url, base, NodeModelFactory,
          ChildrenCollectionFactory, Children2CollectionFactory,
          GlobalMessage, NodesTableView, NextNodeModelFactory,
          DefaultActionBehavior) {

        // FormData available (IE10+, WebKit)
        var formData       = new FormData(),
            ids            = JSON.stringify(
                status.nodes.map(function (node) {
                  return node.get('id');
                })
            ).replace('[', '{').replace(']', '}'),
            isoDate        = base.formatISODateTime(new Date(new Date().getTime())),
            snapshotConfig = status.collection.options.data.snapshot || {},
            snapshotName   = status.collection.options.data.foldername || // for backwards-compatibility
                             snapshotConfig.folderNamePrefix || '';

        snapshotName = snapshotName.trim() + ' ' +
                       isoDate.substring(0, isoDate.indexOf('.')).replace(/T/g, ' ')
                           .replace(/:/g, '.');
        snapshotName = snapshotName.trim();

        formData.append('body', JSON.stringify(_.extend({}, { // not adding undefined properties
          snapshot_parent_name: snapshotConfig.parentFolderName,
          snapshot_name: snapshotName,
          bus_attach_ids: ids
        })));

        var createSnapshotUrl = Url.combine(
            container.connector.connection.url.replace('/v1', '/v2'),
            'nodes', container.get('id'), 'snapshots'),
            ajaxOptions = {
              type: 'POST',
              url: createSnapshotUrl,
              data: formData,
              contentType: false,
              processData: false
            };

        var context = status.context || options.context;
        var snapshotNode;

        container.connector.makeAjaxCall(ajaxOptions)
            .done(function (response, statusText, jqxhr) {
              if (NodesTableView.useV2RestApi) {
                ChildrenCollectionFactory = Children2CollectionFactory;
              }
              var currentNode = context.getModel(NodeModelFactory);
              var children = context.getCollection(ChildrenCollectionFactory);
              var snapshotParentId = Math.abs(response.results.data.parent_id);
              snapshotNode = context.getModel(NodeModelFactory, {
                connector: container.connector,
                attributes: { id: response.results.data.id }
              });
              var snapshotParentFolder;
              if ( response.results.parent ) {
                snapshotParentFolder = context.getModel(NodeModelFactory, {
                  connector: container.connector,
                  attributes: response.results.parent
                });
              }

              // if current node in the nodes table is the parent for the new node
              // update nodes table children collection
              if (currentNode.get('id') === snapshotParentId) {
                updateChildrenCollection(children, snapshotNode);
              } else if ( snapshotParentFolder && currentNode.get('id') === Math.abs(snapshotParentFolder.get('parent_id')) ) {
                updateChildrenCollection(children, snapshotParentFolder);
              } else {
                // else, if current nodes table children collection already has the parent node
                // update the parent
                currentNode = children.findWhere({id: snapshotParentId});
                if (currentNode) {
                  currentNode.fetch().always(function() {
                    showSuccessMessageWithLink();
                    deferred.resolve();
                  });
                } else {
                  showSuccessMessageWithLink();
                  deferred.resolve();
                }
              }
            })
            .fail(function (jqXHR, statusText, error) {
              var errmsg = jqXHR.responseJSON && (new base.Error(jqXHR.responseJSON)).error;
              GlobalMessage.showMessage('error', lang.snapshotFailed, errmsg);
              deferred.reject();
            });

        function updateChildrenCollection ( children, node ) {
          node.isLocallyCreated = true;
          node.fetch().always(function() {
            children.add(node, {at: 0});
            showSuccessMessageWithLink();
            deferred.resolve();
          });
        }

        function showSuccessMessageWithLink () {
          var msgOptions = {
            context: status.context,
            nextNodeModelFactory: NextNodeModelFactory,
            link_url: DefaultActionBehavior.getDefaultActionNodeUrl(snapshotNode),
            targetFolder: snapshotNode
          };
          var message = _.str.sformat(lang.snapshotCreatedWithName, snapshotName);
          GlobalMessage.showMessage('success_with_link', message, undefined, msgOptions);
        }
      });
      return deferred.promise();
    }
  });

  return SnapshotCommand;
});

csui.define('xecmpf/behaviors/toggle.header/toggle.header.behavior',[
    'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
    'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
    'csui/utils/non-emptying.region/non-emptying.region', 'csui/lib/jquery.redraw'
  ], function ($, _, Marionette, TableRowSelectionToolbarView, NonEmptyingRegion) {
   'use strict';

    var slideTime = 500;

    var ToggleHeaderBehavior = Marionette.Behavior.extend({

        initialize: function () {
            this.listenTo(this.view, {
                'before:render': this.setTableRowSelectionToolbar,
                'render': this._setTableRowSelectionToolbarEventListeners
            });
            this.tableHeader = this.options.tableHeader;
            this.container = this.options.alternatingTableContainer;
            this.tableToolbar = this.options.tableToolbar;
            this.tableRowSlectionToolbarViewOptions = this.options.tableRowSlectionToolbarViewOptions;
        },

        setTableRowSelectionToolbar: function () {
           if (!this.view.tableView) {
                return;
            }

            this.view._tableRowSelectionToolbarView = new TableRowSelectionToolbarView(_.extend({
                toolItemFactory: this.view.options.toolbarItems.tableHeaderToolbar,
                toolbarItemsMask: this.view.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
                toolbarCommandController: this.view.commandController,
                showCondensedHeaderToggle: true,

                // if toolbarCommandController is not defined, a new ToolbarCommandController
                // with the following commands is created
                commands: this.view.defaultActionController.commands,
                selectedChildren: this.view.tableView.selectedChildren,
                container: this.view.collection.node,
                context: this.view.context,
                originatingView: this.view,
                collection: this.view.collection
            }, this.tableRowSlectionToolbarViewOptions));

            var toolbarView = this.view._tableRowSelectionToolbarView;
            // hide/show the condensed header
            this.listenTo(toolbarView, 'toggle:condensed:header', function () {
                var $tableHeaderEl = this.$el.find(this.tableHeader);
                var $container = this.$el.find(this.container);
                var showingBothToolbars;
                if ($tableHeaderEl.is(":visible")) {
                    showingBothToolbars = false;
                    $tableHeaderEl.slideUp(slideTime);
                    $container.removeClass('xecmpf-show-header');
                } else {
                    showingBothToolbars = true;
                    $tableHeaderEl.slideDown(slideTime);
                    $container.addClass('xecmpf-show-header');
                }
                // let the right toolbar know to update its attributes
                toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
            });
        },

        _setTableRowSelectionToolbarEventListeners: function () {
            // listen for change of the selected rows in the table.view and if at least one row is
            // selected, display the table-row-selected-toolbar and hide the table-toolbar
            var region = new NonEmptyingRegion({el: this.tableToolbar});
            this.listenTo(this.view.tableView.selectedChildren, 'reset', function () {
                region.show(this.view._tableRowSelectionToolbarView);
                this._onSelectionDisplayOrHide(this.view.tableView.selectedChildren.length);
            });
        },

        _onSelectionDisplayOrHide: function (selectionLength) {
            var $tableHeaderEl = this.$el.find(this.tableHeader);
            var $tableToolbar = this.$el.find(this.tableToolbar);
            var $container = this.$el.find(this.container);
            if (selectionLength > 0) {
                if ($tableToolbar.is(":hidden")) {
                    $tableHeaderEl.slideUp(slideTime);
                    $tableToolbar.slideDown(slideTime);
                    this._triggerToolbarActivityEvent(true, false);
                }
            } else {
                if ($tableToolbar.is(":visible")) {
                    $tableToolbar.slideUp(slideTime);
                    $tableHeaderEl.slideDown(slideTime);
                    $container.removeClass('xecmpf-show-header');
                    this._triggerToolbarActivityEvent(false, true);
                }
            }
        },

        _triggerToolbarActivityEvent: function (toolbarVisible, headerVisible) {
            // let the right toolbar know to update its attributes
            var toolbarView = this.view._tableRowSelectionToolbarView;
            toolbarView.trigger('toolbar:activity', toolbarVisible, headerVisible);
        }
    });
    return ToggleHeaderBehavior;
});
csui.define('xecmpf/widgets/integration/folderbrowse/toolbaritems',[
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  'css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse'
], function (FolderBrowseLang) {
  var toolbarItems = {
    leftToolbar: [
      {
        signature: "WorkspaceHistory",
        name: FolderBrowseLang.BackButtonToolItem,
        icon: "icon arrow_back "
      }
    ],
    rightToolbar: [
      {
        signature: "SearchFromHere",
        name: FolderBrowseLang.SearchToolItem,
        icon: "icon xecmpf-icon-search",
        group: "main",
        className: "csui-search-button"
      },
      {
        signature: "WorkspacePage",
        name: FolderBrowseLang.PageWidgetToolItem,
        icon: "icon csui-icon-open-full-page",
        group: "main",
        options: {
          hAlign: "right"
        },
        commandData: {applyTheme: true}
      }
    ]
  };
  return toolbarItems;
});

csui.define('xecmpf/widgets/boattachments/impl/boattachment.table/tablecell/createdby.view',[
  'csui/lib/underscore', 'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/base'
], function (_, CellView, cellViewRegistry, base) {
  'use strict';

  var MemberCellView = CellView.extend({
    className: 'csui-truncate',

    getValueText: function () {
      return MemberCellView.getValue(this.model, this.options.column);
    }
  }, {
    getValue: function (model, column) {
      var columnName = column.name,
          value = model.get(columnName + "_expand") ||
                  model.get(columnName) || '',
          text;
      if (_.isObject(value)) {
        // Prefer the expanded user information
        text = base.formatMemberName(value);
      } else {
        // Then try the server-pre-formatted value and fall back to the id
        text = model.get(columnName + "_formatted") || value.toString();
      }
      return text;
    },

    getModelExpand: function (options) {
      return {properties: [options.column.name]};
    }
  });

  cellViewRegistry.registerByDataType(14, MemberCellView);
  cellViewRegistry.registerByDataType(19, MemberCellView);
  cellViewRegistry.registerByColumnKey('createdby', MemberCellView);

  return MemberCellView;
});

csui.define('xecmpf/widgets/boattachments/impl/boattachment.table/tablecell/modifiedby.view',[
  'csui/lib/underscore', 'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/base'
], function (_, CellView, cellViewRegistry, base) {
  'use strict';

  var MemberCellView = CellView.extend({
    className: 'csui-truncate',

    getValueText: function () {
      return MemberCellView.getValue(this.model, this.options.column);
    }
  }, {
    getValue: function (model, column) {
      var columnName = column.name,
          value = model.get(columnName + "_expand") ||
                  model.get(columnName) || '',
          text;
      if (_.isObject(value)) {
        // Prefer the expanded user information
        text = base.formatMemberName(value);
      } else {
        // Then try the server-pre-formatted value and fall back to the id
        text = model.get(columnName + "_formatted") || value.toString();
      }
      return text;
    },

    getModelExpand: function (options) {
      return {properties: [options.column.name]};
    }
  });

  cellViewRegistry.registerByDataType(14, MemberCellView);
  cellViewRegistry.registerByDataType(19, MemberCellView);
  cellViewRegistry.registerByColumnKey('modifiedby', MemberCellView);

  return MemberCellView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.listitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"xecmpf-eac-action-plan-list-item-selection-marker\"></div>\r\n<a role=\"button\" href=\"#\" class=\"binf-flex-row xecmpf-eac-action-plan-name-link\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" tabindex=\""
    + this.escapeExpression(((helper = (helper = helpers.tabindex || (depth0 != null ? depth0.tabindex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tabindex","hash":{}}) : helper)))
    + "\" >\r\n    <span class=\"xecmpf-eac-action-plan-name\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n</a>\r\n<div role=\"button\" class=\"binf-btn xecmpf-eac-action-plan-list-item-delete-btn\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.deleteAria || (depth0 != null ? depth0.deleteAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"deleteAria","hash":{}}) : helper)))
    + "\" tabindex=\""
    + this.escapeExpression(((helper = (helper = helpers.tabindex || (depth0 != null ? depth0.tabindex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tabindex","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"icon circle_delete_grey\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.deleteTooltip || (depth0 != null ? depth0.deleteTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"deleteTooltip","hash":{}}) : helper)))
    + "\"></span>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.list_impl_actionplan.listitem', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.listitem',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.list/actionplan.listitem.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.listitem',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.listitem'
], function(_, $, Backbone, Marionette, ActionPlanListItemTemplate, lang ) {
    /**
     * Function: ActionPlanListItemView
     * Item view to represent individual action plan, triggers clicks on item click and delete button click
     */
    var ActionPlanListItemView = Marionette.ItemView.extend({
        tagName: 'li',
        /**
         * Function: className
         * Adds class to identify new action plan among existing action plan item
         */
        className: function() {
            var className = 'xecmpf-eac-action-plan-list-item'; 
            className += (!this.model.get('plan_id') ? ' xecmpf-new-eac-action-plan-list-item' : '');           
            return className;
        },
        template: ActionPlanListItemTemplate,
        constructor: function ActionPlanListItemView(options) {
            options = (options || {});
            Marionette.ItemView.call(this, options);
        },
        modelEvents: {
            'change': 'onActionPlanListItemModelUpdate'
        },
        templateHelpers: function() {
            // name should not include index in case of empty model - add action plan scenario
            var actionPlanName = lang.actionPlan + (!!this.model.get('plan_id') ? (' ' + _.str.pad(this._index + 1, 2, '0')) : '');
            this.model.set('name', actionPlanName, { silent: true });
            return {
                // setting tabindex of first list item to 0 for tabbing
                tabindex: this._index === 0 ? '0' : '-1',
                name: this.model.get('name'),
                deleteTooltip: lang.deleteActionPlanButton,
                deleteAria: lang.deleteActionPlanButtonAria + ' ' +  this.model.get('name')
            }
        },
        triggers: {
            'click .xecmpf-eac-action-plan-name-link': 'click:actionplan:item',
            'click .xecmpf-eac-action-plan-list-item-delete-btn': 'click:actionplan:delete'
        },

        ui: {
            actionPlanNameButton: '.xecmpf-eac-action-plan-name-link',
            deleteButton: '.xecmpf-eac-action-plan-list-item-delete-btn'
        },
        events: {
            'focusout': function (event) {
                this.trigger("actionplan:focusout", event);
            },            
            'focus @ui.actionPlanNameButton': function (event) {
                this._hasFocus = true;
                this.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').show();
            },
            "keydown ": 'onkeyInView'
        },
        /**
         * Function: onkeyInView
         * Used in keyboard navigation
         */
        onkeyInView: function(event){
            var nextActionPlan, nextView;
            switch (event.keyCode) {
                case 37: //left arrow key
                    event.preventDefault();
                    event.stopPropagation();
                    this.ui.actionPlanNameButton.trigger('focus');
                    break;
                case 39: // right arrow key
                    event.preventDefault();
                    event.stopPropagation();                       
                    this.ui.deleteButton.trigger('focus');
                    break;
                case 46: // Delete key
                    event.preventDefault();
                    event.stopPropagation();
                    this.trigger('click:actionplan:delete');
                    break;
                case 13:
                case 32:
                    if (event.target.classList.contains('xecmpf-eac-action-plan-list-item-delete-btn')) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.trigger('click:actionplan:delete');
                    }
                    break;
            }
        },

        /**
         * Function: _setFocus
         * Sets the focus on current ActionPlanListItem
         */
        _setFocus: function () {
            if (this.ui.actionPlanNameButton.length > 0) {
              this.ui.actionPlanNameButton.trigger('focus');
            }
        },

        /**
         * Function: onActionPlanListItemModelUpdate
         * It is called on model updates. code to update the view on model change can be placed here
         */
        onActionPlanListItemModelUpdate: function() {
            this.updateNewActionPlanIndication();
        },

        /**
         * Function: updateNewActionPlanIndication
         * adds and removes class (to distinguish new action plan item) from el based on model 
         */
        updateNewActionPlanIndication: function() {
            this.$el.removeClass('xecmpf-new-eac-action-plan-list-item');
            if (!this.model.get('plan_id')) {
                this.$el.addClass('xecmpf-new-eac-action-plan-list-item');
            }
        }
    });
    return ActionPlanListItemView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"cs-header xecmpf-eac-action-plan-header-region\">\r\n    <div class=\"xecmpf-eac-action-plan-header\">\r\n      <span class=\"cs-title xecmpf-eac-action-plan-header-text\">"
    + this.escapeExpression(((helper = (helper = helpers.actionPlansListHeader || (depth0 != null ? depth0.actionPlansListHeader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionPlansListHeader","hash":{}}) : helper)))
    + "</span>\r\n      <div title=\""
    + this.escapeExpression(((helper = (helper = helpers.newActionPlanLabel || (depth0 != null ? depth0.newActionPlanLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"newActionPlanLabel","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.newActionPlanLabel || (depth0 != null ? depth0.newActionPlanLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"newActionPlanLabel","hash":{}}) : helper)))
    + "\" tabindex=\"0\" role=\"button\" class=\"binf-btn csui-groups-header-plus xecmpf-eac-add-action-plan-btn\">\r\n        <span class=\"icon icon-toolbarAdd\"></span>\r\n      </div>\r\n    </div> \r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showAddActionPlan : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<div class=\"cs-content xecmpf-eac-action-plan-list binf-flex-column\" role=\"navigation\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.actionPlansGroup || (depth0 != null ? depth0.actionPlansGroup : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionPlansGroup","hash":{}}) : helper)))
    + "\"></div>";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.list_impl_actionplan.list', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.list',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.list/actionplan.list.view',['csui/lib/underscore',
'csui/lib/jquery',
'csui/lib/backbone',
'csui/lib/marionette',
'csui/utils/contexts/factories/connector',
'csui/controls/tile/behaviors/perfect.scrolling.behavior',
'xecmpf/models/eac/eventactionplans.model',
'xecmpf/widgets/eac/impl/actionplan.list/actionplan.listitem.view',
'hbs!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.list',
'i18n!xecmpf/widgets/eac/impl/nls/lang',
'css!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.list'], function(_, $, Backbone, Marionette, ConnectorFactory, PerfectScrollingBehavior, EACEventActionPlans, ActionPlanListItemView, ActionPlanListTemplate, lang) {
    /**
     * Function: ActionPlanListItemCollectionView
     * Collection view to represent set of action plans. uses ActionPlanListItemView to represent each action plan item
     * Handles click on the child item and trigger it again to propagate event
     */
    var ActionPlanListItemCollectionView = Marionette.CollectionView.extend({
        className: 'xecmpf-action-plan-list-rows',
        tagName: 'ul',
        constructor: function ActionPlanListItemCollectionView(options) {
            options = options || {};
            this.options = options;
            this._focusIndex = 0;
            Marionette.CollectionView.prototype.constructor.call(this, options);
        },
        childView: ActionPlanListItemView,
        childEvents: {
            'click:actionplan:item': 'onActionPlanClickItem',
            'click:actionplan:delete': 'onActionPlanDelete',
            'actionplan:focusout': 'onFocusoutActionPlan'
        },
        events:{
            'keydown' : 'onkeyInView'
        },
        /**
         * Function: childViewOptions 
         * Provides context to child view
         * */     
        childViewOptions: function(model, index) {
            return {
                context: this.options.context
            }
        },  

        /**
         * Function: onActionPlanClickItem
         * retriggers click item with triggerMethod
         * */    
        onActionPlanClickItem: function(src) {
            this.triggerMethod('actionplan:click:item', src);
        },

        /**
         * Function: onActionPlanDelete
         * retriggers click item with triggerMethod
         * */ 
        onActionPlanDelete: function(src) {
            this.triggerMethod('actionplan:click:delete', src);
        },

        /**
         * Function: onkeyInView
         * Used in keyboard navigation
         */
        onkeyInView: function (event) {
            var nextActionPlan, nextView,
               currentView =  this.children.findByModel(this.collection.at(this._focusIndex));
            switch (event.keyCode) {
                case 38: // up arrow key
                case 40: // down arrow key
                    event.preventDefault();
                    event.stopPropagation();
                    
                    if (event.keyCode === 38 && this._focusIndex > 0) {
                        this._focusIndex--;
                    } else if (event.keyCode === 40 && this._focusIndex < this.children.length-1) {
                        this._focusIndex++;
                    }
                    nextView = this.children.findByModel(this.collection.at(this._focusIndex));
                    this._changeTabIndexesAndSetFocus(currentView, nextView, true);
                    nextView._setFocus();
                    break;
                case 36: // home button
                    event.preventDefault();
                    event.stopPropagation();
                    this._focusIndex = 0;
                    nextView = this.children.findByModel(this.collection.at(this._focusIndex));
                    this._changeTabIndexesAndSetFocus(currentView, nextView, true);
                    nextView._setFocus();
                    break;
                case 35: // end button 
                    event.preventDefault();
                    event.stopPropagation();
                    this._focusIndex = this.children.length-1;
                    nextView = this.children.findByModel(this.collection.at(this._focusIndex));
                    this._changeTabIndexesAndSetFocus(currentView, nextView, true);
                    nextView._setFocus();
                    break;      
            }
        },
        /**
         * Function: _changeTabIndexesAndSetFocus
         * Used to change the tabindex and set the focus on next action plan.
         */
        _changeTabIndexesAndSetFocus: function (currentView, nextView, showDeleteIcon) {
            //tabindex change
            currentView.$el.find('a').prop('tabindex', -1)
            currentView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').prop('tabindex', -1)
            currentView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').hide();
            currentView._hasFocus = false;
            nextView.$el.find('a').prop('tabindex', 0);
            nextView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').prop('tabindex', 0);
            if (showDeleteIcon) {
                nextView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').show();
            }
            nextView._hasFocus = true;
        },
        /**
         * Function: onFocusoutActionPlan
         * On focus out of the ActionPlanCollectionList hiding the delete button 
         */
        onFocusoutActionPlan: function (childView, event) {
            if (event.relatedTarget) {
                if ($.contains(this.el, event.relatedTarget) === false) {
                    // focus out of this view
                    childView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').hide();
                }
            }
        }

    });

    /**
     * Function: ActionPlanListView
     * It show add action plan button and action plans collection.     
     */
    var ActionPlanListView = Marionette.LayoutView.extend({
        className:'xecmpf-eac-action-plan-list-view',
        constructor: function ActionPlanListView(options) {
            options = options || {};
            /**
             * Populates collection from the action_plans data in the model passed in. It maps namespace and event_name 
             * to collection models as those are used in rules view 
             */
            if (!options.collection) {
                options.model.attributes.action_plans = options.model.attributes.action_plans.map(function(action_plan) {
                    action_plan.namespace = options.model.attributes.namespace;
                    action_plan.event_name = options.model.attributes.event_name;
                    action_plan.event_id = options.model.attributes.event_id;
                    return action_plan;
                });
                options.collection = new Backbone.Collection(options.model.attributes.action_plans);
            }
            this.options = options;
            Marionette.LayoutView.prototype.constructor.call(this, options);
        },
        template: ActionPlanListTemplate,
        templateHelpers: function() {
            return {
                showAddActionPlan: !!this.options.showAddActionPlan,
                newActionPlanLabel: lang.newActionPlan,
                actionPlansListHeader:  lang.actionPlansListHeader,
                actionPlansGroup: lang.actionPlansGroup
            }
        },
        behaviors: {
            PerfectScrolling: {
                behaviorClass: PerfectScrollingBehavior,
                contentParent: '.xecmpf-action-plan-list-rows',
                suppressScrollX: true,
                // like bottom padding of container, otherwise scrollbar is shown always
                scrollYMarginOffset: 15
            }
        },
        regions: {
            actionPlanListRegion: '.xecmpf-eac-action-plan-list'
        },
        /**
         * Function: onRender
         * Creates collection view and shows it in the region
         */
        onRender: function() {            
            this.actionPlanListItemCollectionView = new ActionPlanListItemCollectionView({
                 collection: this.options.collection,
                 context: this.options.context
            });
            this.actionPlanListRegion.show(this.actionPlanListItemCollectionView);
            if (this.options.collection.length === 0) {
                // no action plans are present, view might have been opened from Add Action plan button click
                this.addNewActionPlan(); // to open first action plan item by default
            }
        },
        ui: {
            'addActionEle': '.xecmpf-eac-add-action-plan-btn'
        },
        events: {
            'click @ui.addActionEle': 'onAddActionPlanClick'
        },
        childEvents: {
            'actionplan:click:item': 'onActionPlanClick',
            'actionplan:click:delete': 'onActionPlanDelete'
        },

        /**
         * Function: onActionPlanClick
         * triggers event to propagate to parent views.
         */     
        onActionPlanClick: function(childView, src) {
            this.trigger('actionplan:click:item', src);
        },

        /**
         * Function: onActionPlanDelete
         * triggers event to propagate to parent views.
         */    
        onActionPlanDelete: function(childView, src) {
            this.trigger('actionplan:click:delete', src);
        },

        /**
         * Function: onAddActionPlanClick
         * triggers event to propagate to parent views.
         */  
        onAddActionPlanClick: function(src) {
            this.trigger('actionplan:add:item', src)
        },

        /**
         * Function: addNewActionPlan
         * It adds new model into collection to represent the new action plan and re-renders the form 
         */
        addNewActionPlan: function() {
            var newActionListItemModel = new Backbone.Model({
                plan_id: '',
                process_mode: '',
                rule_id: '',
                rules: [{}],
                namespace: this.options.model.attributes.namespace,
                event_name: this.options.model.attributes.event_name,
                event_id: this.options.model.attributes.event_id
            }), newActionListItem;

            this.actionPlanListItemCollectionView.collection.add(newActionListItemModel); // adding to collection
            newActionListItem = this.actionPlanListItemCollectionView.children.findByModel(newActionListItemModel);
            newActionListItem.trigger('click:actionplan:item'); // triggering event to open it
        },

        /**
         * Function: fetchEventActionPlans
         * Makes service call to fetch eventplan actions data
         * Returns: Promise
         */
        fetchEventActionPlans: function() {
            // method to refresh the collection
            var deferred = $.Deferred(),
                eacCollection = new EACEventActionPlans(undefined, {
                    connector: this.options.context.getObject(ConnectorFactory)
                });
            eacCollection.fetch().done(function () {
                deferred.resolve(eacCollection);
            }, function() {
                deferred.reject();
            });
            return deferred.promise();
        },

        /**
         * Function: refreshCurrentActionPlanItem
         * It makes service call to fetch updated event action plan data, 
         * Once data fetched it filters event model through event id
         * Fetches action plan through plan id from the event model.
         */
        refreshCurrentActionPlanItem: function(eventInfo) {
            var planID = eventInfo.planID,
                modelToBeUpdated,
                $deferred = $.Deferred();
            if (eventInfo.operation === 'create') {
                // as it is create operatin fetch model with empty plan id
                modelToBeUpdated = this.actionPlanListItemCollectionView.collection.findWhere({ plan_id: '' });
            } else {
                // fetching model through plan id
                modelToBeUpdated = this.actionPlanListItemCollectionView.collection.findWhere({ plan_id: planID });
            }
            if (!!modelToBeUpdated) {
                var actionListItemToRetrigger = this.actionPlanListItemCollectionView.children.findByModel(modelToBeUpdated);
                // TODO: Fetch only action plan which is required. currently fetching total events action plans
                // fetching new collection
                this.fetchEventActionPlans().then(function(eacPlansCollection) {
                    var eventModel = eacPlansCollection.findWhere({ event_id: eventInfo.event_id });
                    if (eventModel && eventModel.get('action_plans')) {
                        var actionPlanObj = eventModel.get('action_plans').filter(function(actionPlanObj) {
                            return actionPlanObj.plan_id === planID;
                        });
                        if (actionPlanObj.length > 0) {    
                            // updating existing model with latest model info - should not be sorted as item position should not be changed
                            modelToBeUpdated.set(actionPlanObj[0], { sort: false });                            
                        } 
                    }
                    $deferred.resolve(actionListItemToRetrigger);
                }, function() {
                    $deferred.reject();
                });
            } else {
                $deferred.reject();
            }
            return $deferred.promise();
        }
    });

    return ActionPlanListView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.header/impl/actionplan.header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"xecmpf-back-button-container\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.backTitle || (depth0 != null ? depth0.backTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTitle","hash":{}}) : helper)))
    + "\" tabindex=\"0\"\r\n     aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.backTitle || (depth0 != null ? depth0.backTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backTitle","hash":{}}) : helper)))
    + "\" role=\"button\">\r\n  <span class=\"arrow_back cs-go-back\"></span>\r\n</div>\r\n<div class=\"xecmpf-actionplan-title\">\r\n  <h2 class=\"title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h2>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.header_impl_actionplan.header', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.header/impl/actionplan.header',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.header/actionplan.header.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!xecmpf/widgets/eac/impl/actionplan.header/impl/actionplan.header',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/widgets/eac/impl/actionplan.header/impl/actionplan.header'
], function (_, $, Marionette, template, lang) {

  var ActionPlanHeaderView = Marionette.ItemView.extend({

    className: 'xecmpf-actionplan-header',

    template: template,

    events: {
      'keydown .xecmpf-back-button-container': 'onKeyInView',
      'click .cs-go-back': 'onClickBackButton'
    },

    templateHelpers: function () {
      return {
        title: this.model.get('event_name'),
        backTitle: lang.backTitle
      };
    },

    constructor: function ActionPlanHeaderView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.onClickBackButton();
      }
    },

    onClickBackButton: function() {
      this.trigger('actionplan:click:back');
    }
  });

  return ActionPlanHeaderView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='xecmpf-eac-processmode-view'>\r\n    <div class=\"xecmpf-eac-header\">\r\n        <h4 class=\"xecmpf-eac-processmode-header\" title=\"{{options.header}}\" aria-label=\"{{options.header}}\"><span class=\"binf-glyphicon binf-glyphicon-star alpaca-icon-required\"></span>{{options.header}}</h4>\r\n    </div>\r\n    <div class=\"xecmpf-eac-processmode-form\">\r\n        <div class=\"xecmpf-eac-processmode-runas\" id=\"xecmpf-eac-processmode-run_as\"></div>\r\n        <div class=\"xecmpf-eac-processmode-processmode\" id=\"xecmpf-eac-processmode-process_mode\"></div>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.processmode_impl_actionplan.processmode', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.processmode/actionplan.processmode.view',['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/controls/form/form.view',
    'hbs!xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'css!xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode',
], function (require, _, $, Backbone, FormView, formTemplate, lang) {

    var ActionPlanProcessModeView = FormView.extend({

        constructor: function ActionPlanProcessModeView(options) {
            FormView.prototype.constructor.call(this, options);
        },

        formTemplate: formTemplate,

        formTemplateHelpers: function() {
            return {
                header : lang.processModeTabLabel
            };
        },

        _getLayout: function () {
            var template = this.getOption('formTemplate'),
                html = template.call(this, {
                    data: this.alpaca.data,
                    mode: this.mode
                }),
                bindings = this._getBindings(),
                view = {
                    parent: 'bootstrap-csui',
                    layout: {
                        template: html,
                        bindings: bindings
                    }
                };
            return view;
        },

        _getBindings: function () {
            return {
                run_as: 'xecmpf-eac-processmode-run_as',
                process_mode: 'xecmpf-eac-processmode-process_mode'
            };
        }

    });
    
    return ActionPlanProcessModeView;
});


csui.define('xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode.form.model',['csui/models/form', 'i18n!xecmpf/widgets/eac/impl/nls/lang'], function (FormModel, lang
) {

    var ActionPlanProcessModeFormModel = FormModel.extend({
        constructor: function ActionPlanProcessModeFormModel(attributes, options) {
            this.options = options || (options = {});
            attributes || (attributes = {
                schema: { properties: {} },
                options: { fields: {} },
                date: {}
            });
            FormModel.prototype.constructor.call(this, attributes, options);
        },

        initialize: function (attributes, options) {
            this._setAttributes();
        },

        _setAttributes: function () {
            var that = this;
            var run_as = '';
            var process_mode = '';
            if(this.options.eventModel && this.options.eventModel.attributes && this.options.eventModel.attributes.process_mode){
                process_mode = this.options.eventModel.attributes.process_mode
            }
            if(this.options.eventModel && this.options.eventModel.attributes && this.options.eventModel.attributes.run_as_key){
                run_as = this.options.eventModel.attributes.run_as_key
            }
            
            this.set({
                schema: {
                    properties: {
                        run_as: {
                            required: true,
                            type: "otcs_user_picker"
                        },
                        process_mode: {
                            enum: ['Synchronously','Asynchronously'],
                            required: true,
                            type: "string"
                        }
                    }
                },
                options: {
                    fields: {
                        run_as: {
                            label: lang.runAs,
                            type: "otcs_user_picker",
                            events: {
                                change: function () {
                                    that.setValue(this.path, this.getValue());
                                }
                            }
                        },
                        process_mode: {
                            label: lang.processMode,
                            type: "select",
                            optionLabels: [lang.synchronouslyProcessLabel,lang.asynchronouslyProcessLabel],
                            events: {
                                change: function () {
                                    that.setValue(this.path, this.getValue());
                                }
                            },
                            removeDefaultNone: true
                        }
                    }
                },
                data: {
                    run_as: run_as,
                    process_mode: process_mode
                }
            });
        }

    });
    return ActionPlanProcessModeFormModel;
});
csui.define('xecmpf/models/eac/eac.planproperties.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/models/mixins/connectable/connectable.mixin',
    'csui/models/mixins/fetchable/fetchable.mixin',
    'csui/utils/url',
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {

    var EACPlanPropertiesModel = Backbone.Model.extend({
        constructor: function EACPlanPropertiesModel(attributes, options) {
            this.options = options || {};
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },
        parse: function (response) {
            return response;
        }
    });
    ConnectableMixin.mixin(EACPlanPropertiesModel.prototype);

    var EACPlanPropertiesCollection = Backbone.Collection.extend({

        model: EACPlanPropertiesModel,

        constructor: function EACPlanPropertiesCollection(models, options) {
            this.options = options || {};
            Backbone.Collection.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options)
                .makeFetchable(options);
        },

        url: function () {
            var url = new Url(this.connector.connection.url).getApiBase('v2');
            url = Url.combine(url, 'eventactioncenter', 'eventproperties');
            return url + this.queryParamsToString(this.options.query);
        },

        parse: function (response) {
            return response.results.data;
        },

        queryParamsToString: function (params) {
            var query = '';
            if (!_.isEmpty(params)) {
                query = '?' + $.param(params);
            }
            return query.replace(/%5B%5D/g, '');
        }
    });

    ConnectableMixin.mixin(EACPlanPropertiesCollection.prototype);
    FetchableMixin.mixin(EACPlanPropertiesCollection.prototype);

    return EACPlanPropertiesCollection;
});

csui.define('xecmpf/models/eac/eac.planproperties.factory',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'xecmpf/models/eac/eac.planproperties.model'
], function (_, Backbone,
  CollectionFactory, ConnectorFactory,
  EACPlanPropertiesCollection) {
    var EACPlanPropertiesFactory = CollectionFactory.extend({
      propertyPrefix: 'EACPlanPropertiesCollection',
      constructor: function EACPlanPropertiesFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacCollection = this.options.EACPlanPropertiesCollection || {};
        if (!(eacCollection instanceof Backbone.Collection)) {
          var namespace;
          var event_name;
          if(options.eventModel.get){
            namespace = options.eventModel.get('namespace');
            event_name = options.eventModel.get('event_name');
          } else {
            namespace = options.eventModel.attributes.namespace;
            event_name = options.eventModel.attributes.event_name;
          }
          eacCollection = new EACPlanPropertiesCollection(eacCollection.models, _.extend({
            connector: context.getModel(ConnectorFactory),
            query: {
              event_name: event_name,
              system_name: namespace
            },
            autofetch: true
          }, eacCollection.options));
        }
        this.property = eacCollection;
      },
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });
    return EACPlanPropertiesFactory;
  });
'use strict'

csui.define('xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules.form.model',['csui/lib/underscore', 'csui/models/form',
    'xecmpf/models/eac/eac.planproperties.factory',
    'i18n!xecmpf/widgets/eac/impl/nls/lang'
], function (_, FormModel, EACPlanPropertiesFactory, lang) {
    /**
     * Function: EACRulesFormModel
     * Model contains alpaca schema and options configurations for rules form 
     */
    var EACRulesFormModel = FormModel.extend({

        constructor: function EACRulesFormModel(attributes, options) {
            this.options = options || (options = {});
            attributes || (attributes = {
                data: {},
                schema: { properties: {} },
                options: { fields: {} }
            });
            FormModel.prototype.constructor.call(this, attributes, options);
        },

        /**
         * Function: initialize
         * Fetches plan properties by passing namespace and event_name. Sets model attributes after fetching data
         */
        initialize: function (attributes, options) {
            var namespace = options.eventModel.get('namespace') || '';
            var event_name = options.eventModel.get('event_name') || '';
            var eacPlanProperties = options.context.getCollection(EACPlanPropertiesFactory, {
                eventModel: options.eventModel,
                // EAC plan properties are unique by namespace and event_name both
                attributes: {
                    namespace: namespace,
                    event_name: event_name
                }
            });

            if (!eacPlanProperties.planProperties) {
                this.listenToOnce(eacPlanProperties, 'sync', function () {
                    eacPlanProperties.planProperties = eacPlanProperties.map(function (model) {
                        return model.get('name');
                    });
                    this._setAttributes(eacPlanProperties.planProperties);
                });
                eacPlanProperties.fetch();
            } else {
                this._setAttributes(eacPlanProperties.planProperties);
            }
        },

        /**
         * Function: _setAttributes
         * Sets schema and options configuration values to the model attributes for rules forms 
         */
        _setAttributes: function (planProperties) {
            var that = this;
            var formData = [];
            if (this.options.collection) {
                // preparing formData to show previous data
                formData = this.options.collection.models.map(function (modelObj, index) {
                    return {
                        from: modelObj.get('operand'),
                        operator: modelObj.get('operator'),
                        to: modelObj.get('to'),
                        conjunction: modelObj.get('conjunction')
                    }
                });
            }
            this.set({
                "data": {
                    "rulesSet": formData
                },
                "options": {
                    "fields": {
                        "rulesSet": {
                            "fields": {
                                "item": {
                                    "fields": {
                                        "from": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "label": "",
                                            "readonly": false,
                                            "type": "select",
                                            /**
                                             * Validator method for this field.
                                             * this field is valid if it is present in the empty first row or it has value
                                             */
                                            "validator": function(callback) {
                                                var isFieldValid = false,
                                                    fieldValue = this.getValue(),
                                                    rulesSetForm = this.getParent().getParent(),
                                                    isItEmptyFirstRow = false,
                                                    currentRow = this.getParent();
                                                if (rulesSetForm.children.length === 1 && !currentRow.data.operator && !currentRow.data.to) {
                                                    isItEmptyFirstRow = true;
                                                }
                                                if (this.getValue() || isItEmptyFirstRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }
                                        },
                                        "operator": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "optionLabels": [lang.operatorEqualtoLabel, lang.operatorNotequaltoLabel],
                                            "label": "",
                                            "readonly": false,
                                            "type": "select",
                                            /**
                                             * Validator method for this field.
                                             * this field is valid if it is present in the empty first row or it has value
                                             */
                                            "validator": function(callback) {
                                                var isFieldValid = false,
                                                    fieldValue = this.getValue(),
                                                    rulesSetForm = this.getParent().getParent(),
                                                    isItEmptyFirstRow = false,
                                                    currentRow = this.getParent();
                                                if (rulesSetForm.children.length === 1 && !currentRow.data.from && !currentRow.data.to) {
                                                    isItEmptyFirstRow = true;
                                                }
                                                if (this.getValue() || isItEmptyFirstRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }                                           
                                        },
                                        "to": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "label": "",
                                            "readonly": false,
                                            "type": "text",
                                            /**
                                             * Validator method for this field.
                                             * this field is valid if it is present in the empty first row or it has value
                                             */
                                            "validator": function(callback) {
                                                var isFieldValid = false,
                                                    fieldValue = this.getValue(),
                                                    rulesSetForm = this.getParent().getParent(),
                                                    isItEmptyFirstRow = false,
                                                    currentRow = this.getParent();
                                                if (rulesSetForm.children.length === 1 && !currentRow.data.operator && !currentRow.data.from) {
                                                    isItEmptyFirstRow = true;
                                                }
                                                if (this.getValue() || isItEmptyFirstRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }

                                        },
                                        "conjunction": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "optionLabels": [lang.conjunctionAndLabel, lang.conjunctionOrLabel],
                                            "label": "",
                                            "readonly": false,
                                            "type": "select",
                                            "removeDefaultNone": true,
                                            /**
                                             * Validator method for the conjunction field.
                                             * this field is optional if it is present in the last row otherwise it is mandatory
                                             */
                                            "validator": function(callback) {
                                                var isFieldValid = false,
												    rulesSetForm = this.getParent().getParent(),
											        isItPresentInLastRow = rulesSetForm.children[rulesSetForm.children.length-1].id === this.getParent().id;
                                                if (this.getValue() || isItPresentInLastRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }
                                        }
                                    },
                                    "type": "object"
                                }
                            },
                            "hidden": false,
                            "hideInitValidationError": true,
                            "items": {
                                "showMoveDownItemButton": false,
                                "showMoveUpItemButton": false
                            },
                            "label": "",
                            "toolbarSticky": true,
                            "showMessages": false,
                            "isSetType": true
                        }
                    }
                },
                "schema": {
                    "properties": {
                        "rulesSet": {
                            "items": {
                                "defaultItems": 1,
                                "maxItems": 50,
                                "minItems": 1,
                                "properties": {
                                    "from": {
                                        "enum": planProperties,
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    },
                                    "operator": {
                                        "enum": ['Equal to', 'Not equal to'],
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    },
                                    "to": {
                                        "maxLength": 248,
                                        "minLength": 1,
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    },
                                    "conjunction": {
                                        "enum": ['And', 'Or'],
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "title": "",
                            "type": "array"
                        }
                    },
                    "type": "object"
                }
            });
        }
    });

    return EACRulesFormModel;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div>\r\n    <div class=\"xecmpf-eac-rules-header-wrapper binf-col-md-12 xecmpf-eac-header\">\r\n        <h4 class=\"xecmpf-eac-rules-header\" title=\"{{options.rulesLabel}}\" aria-label=\"{{options.rulesLabel}}\">{{options.rulesLabel}}</h4>\r\n    </div>\r\n    <div class=\"xecmpf-eac-rules-container-wrapper\">\r\n        <div class=\"binf-row\">\r\n            <div class=\"xecmpf-eac-rules-container binf-col-md-12 cs-form-singlecolumn csui-form-set-array-wrapper cs-form-set\"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.rules_impl_actionplan.rules', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.rules/actionplan.rules.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'csui/utils/contexts/factories/connector', 'csui/controls/form/form.view', 'csui/controls/progressblocker/blocker',
    'xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules.form.model',
    'hbs!xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules',
    'csui/controls/globalmessage/globalmessage',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'css!xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules'
], function (_, $, Backbone, Marionette,
    ConnectorFactory, FormView, BlockingView,
    EACRuleFormModel, formTemplate, GlobalMessage, lang) {
        /**
         * Function: EACRulesView
         * It shows form to capture the eac conditions
         */
        var EACRulesView = FormView.extend({
            className: function() {
                var computedClassName = FormView.prototype.className.call(this);
                computedClassName += ' xecmpf-eac-rules xecmpf-eac-rules-hide-validation-errors';
                // adds class to indicate rules section for new action plan item
                computedClassName += (this.options.isNewActionPlan ? ' xecmpf-eac-new-action-plan-rules' : '');
                return computedClassName;
            },
            constructor: function(options) {
                FormView.prototype.constructor.call(this, options);
            },
            ui: {
                pullRight: '.cs-pull-right'
            },
            events: {
                "mouseenter @ui.pullRight": "onMouseEnterOnActionButtons",
                "mouseleave @ui.pullRight": "onMouseLeaveFromActionButtons",
            },
            formTemplate: formTemplate,
            formTemplateHelpers: function () {
                return {
                    rulesLabel: lang.rulesLabel,
                    rulesSetLegend: lang.rulesSetLegend
                };
            },
            /**
             * Function: onRenderForm
             * It would be called after form renders. It adds class to existing rows to differenatiate them from 
             * newly added rows
             */
            onRenderForm: function() {
                var rulesRowsSelector = ".xecmpf-eac-rules-container .cs-form-set .cs-array.alpaca-container-item";
                this.$el.find(rulesRowsSelector).addClass("xecmpf-eac-existing-rule");
            },            
            _getLayout: function () {
                FormView.prototype._getLayout.call(this);
                var template = this.getOption('formTemplate'),
                    html = template.call(this, {
                        data: this.alpaca.data,
                        mode: this.mode
                    }),
                    bindings = this._getBindings(),
                    view = {
                        parent: 'bootstrap-csui',
                        layout: {
                            template: html,
                            bindings: bindings
                        }
                    };
                return view;
            },
            _getBindings: function () {
                return {
                    rulesSet: '.xecmpf-eac-rules-container'
                };
            }, 
            /**
             * Function: isFormValid
             * Returns: Boolean flag to indicate form validation status
             */
            isFormValid: function() {
                this.$el.removeClass('xecmpf-eac-rules-hide-validation-errors'); // error indications can be shown after calling this method
                return this.validate();
            },  
            /**
             * Function: getSubmitData
             * Returns: Rules form data if formView is available
             */
            getSubmitData: function () {
                var data = this.getValues().rulesSet;
                // in case of only empty row, do not send any value
                data.length === 1 && !data[0].operator && !data[0].from && !data[0].to && (data = []);                
                return data;
            },
            /**
             * TODO: this behavior should be handled in the csui. Remove this method if it is fixed in csui
             * Function: onMouseEnterOnActionButtons
             * @desc: Theis method is added to fix below issue.
             * When new items are added through add button, add and delete icons in new row
             * are not being shown on mouseenter in the buttons section. triggers mouseenter event to show buttons section
             */
            onMouseEnterOnActionButtons: function(event) {
                var $currentTarget = $(event.currentTarget);
                if ($currentTarget.find('button').hasClass('binf-hidden')) {
                    $currentTarget.parent().find('.cs-pull-left .cs-field-write').trigger('mouseenter');
                }
            },
            /**
             * TODO: this behavior should be handled in the csui. Remove this method if it is fixed in csui
             * Function: onMouseLeaveFromActionButtons
             * @desc: To hide buttons section on mouse leave, triggers mouseleave event
             */
            onMouseLeaveFromActionButtons: function(event) {
                var $currentTarget = $(event.currentTarget);
                if (!$currentTarget.find('button').hasClass('binf-hidden')) {
                    $currentTarget.parent().find('.cs-pull-left .cs-field-write').trigger('mouseleave');
                }
            }
        });
        return EACRulesView;
    });

csui.define('xecmpf/models/eac/eac.defaultplans.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/models/mixins/connectable/connectable.mixin',
    'csui/models/mixins/fetchable/fetchable.mixin',
    'csui/utils/url'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {

    var EACDefaultPlansModel = Backbone.Model.extend({
        constructor: function EACDefaultPlansModel(attributes, options) {
            options || (options = {});
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },
        parse: function (response) {
            return response;
        }
    });
    ConnectableMixin.mixin(EACDefaultPlansModel.prototype);

    var EACDefaultPlansCollection = Backbone.Collection.extend({

        model: EACDefaultPlansModel,

        constructor: function EACDefaultPlansCollection(models, options) {
            this.options = options || {};
            Backbone.Collection.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options)
                .makeFetchable(options);
        },

        url: function () {
            var url = new Url(this.connector.connection.url).getApiBase('v2');
            url = Url.combine(url, 'eventactioncenter', 'actions');
            return url + this.queryParamsToString(this.options.query);
        },

        parse: function (response) {
            return response.results.actions;
        },

        queryParamsToString: function (params) {
            var query = '';
            if (!_.isEmpty(params)) {
                query = '?' + $.param(params);
            }
            return query.replace(/%5B%5D/g, '');
        }
    });

    ConnectableMixin.mixin(EACDefaultPlansCollection.prototype);
    FetchableMixin.mixin(EACDefaultPlansCollection.prototype);

    return EACDefaultPlansCollection;
});

csui.define('xecmpf/models/eac/eac.defaultplans.factory',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'xecmpf/models/eac/eac.defaultplans.model'
], function (_, Backbone,
  CollectionFactory, ConnectorFactory,
  EACDefaultPlansCollection) {

    var EACDefaultPlansFactory = CollectionFactory.extend({
      propertyPrefix: 'EACDefaultPlansCollection',
      constructor: function EACDefaultPlansFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacCollection = this.options.EACDefaultPlansCollection || {};
        if (!(eacCollection instanceof Backbone.Collection)) {
          eacCollection = new EACDefaultPlansCollection(eacCollection.models, _.extend({
            connector: context.getModel(ConnectorFactory),
            autofetch: true
          }, eacCollection.options));
        }
        this.property = eacCollection;
      },
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });

    return EACDefaultPlansFactory;
  });
'use strict'

csui.define('xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions.form.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/models/form',
    'xecmpf/models/eac/eac.planproperties.factory',
    'xecmpf/models/eac/eac.defaultplans.factory',
    'i18n!xecmpf/widgets/eac/impl/nls/lang'
], function(_, $, Form, EACPlanProperties, EACDefaultPlansFactory, lang) {

    var EACActionsFormModel = Form.extend({

        constructor: function(attributes, options) {
            this.options = options || (options = {});
            attributes || (attributes = {
                data: {},
                options: {},
                schema: {}
            });

            Form.prototype.constructor.call(this, attributes, options);
        },

        initialize: function(attributes, options) {
            var promises = [],
                namespace = options.eventModel.get('namespace'),
                eventname = options.eventModel.get('event_name'),
                eacDefaultPlans = options.context.getCollection(EACDefaultPlansFactory),
                eacPlanProperties = options.context.getCollection(EACPlanProperties, {
                    eventModel: options.eventModel,
                    // EAC plan properties are unique by namespace and event_name both
                    attributes: {
                        namespace: namespace,
                        event_name: eventname
                    }
                });
            if (!eacDefaultPlans.fetched) {
                promises.push(eacDefaultPlans.fetch());
            }

            if (!eacPlanProperties.planProperties) {
                promises.push(eacPlanProperties.fetch());
            }

            $.when.apply($, promises).done(function() {
                eacPlanProperties.planProperties = eacPlanProperties.map(function(model) {
                    return model.get('name');
                });

                if (attributes && attributes.data && attributes.data.action) {
                    eacDefaultPlans.actions = attributes.data[attributes.data.action + "_fields"];
                    this._setAttributes(eacDefaultPlans, eacPlanProperties.planProperties);
                } else {
                    this._setAttributes(eacDefaultPlans, eacPlanProperties.planProperties);
                }


            }.bind(this));
        },

        _setAttributes: function(eacDefaultPlans, planProperties) {
            var attributes = {
                "options": {
                    "fields": {
                        "actionsData": {
                            "fields": {
                                "item": {
                                    "type": "object",
                                    "fields": {                                        
                                        "action": {
                                            "readonly": false,
                                            "type": "select"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "schema": {
                    "type": "object",
                    "properties": {
                        "actionsData": {
                            "type": "array",
                            "items": {
                                "defaultItems": 1,
                                "maxItems": 50,
                                "minItems": 1,
                                "type": "object",
                                "properties": {
                                    "action": {
                                        "enum": ["CreateOrUpdateEventAction.Create Or Update Workspace", "DocGenEventAction.Create document"],
                                        "readonly": false,
                                        "required": true,
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            var actionFieldEnum = [],
                actionFieldLabels = [];
            for (var k = 0; k < eacDefaultPlans.models.length; k++) {
                var key = eacDefaultPlans.models[k].get("action_key");
                actionFieldEnum.push(key);
                actionFieldLabels.push(eacDefaultPlans.models[k].get('action_name'));

                //creating dynamic alpaca  form for source and dependent attributes
                var schema, options;

                schema = attributes.schema;
                schema.properties['actionsData'].items.properties[key + "_fields"] = { "properties": {}, "dependencies": "action", "type": "object" };
                var properties = schema.properties['actionsData'].items.properties[key + "_fields"].properties;

                options = attributes.options;
                options.fields['actionsData'].fields.item.fields[key + "_fields"] = { "fields": {}, "dependencies": { "action": key } };
                var fields = options.fields['actionsData'].fields.item.fields[key + "_fields"].fields;

                properties["actionattributes"] = {
                    "type": "object",
                    "properties": {
                        "parametername": {
                            "readonly": true,
                            "required": false,
                            "type": "text",
                            "default": lang.actionAttrParameterNameLabel
                        },
                        "sourcelabel": {
                            "readonly": true,
                            "required": false,
                            "type": "text",
                            "default": lang.actionAttrSourceLabel
                        },
                        "valuelabel": {
                            "readonly": true,
                            "required": false,
                            "type": "text",
                            "default": lang.actionAttrValueLabel
                        }
                    }
                };

                fields["actionattributes"] = {
                    "type": "object",
                    "fields": {
                        "parametername": {
                            "type": "text",
                            "label": lang.actionAttrParameterNameLabel,
                            "readonly": true
                        },
                        "sourcelabel": {
                            "type": "text",
                            "label": lang.actionAttrSourceLabel,
                            "readonly": true
                        },
                        "valuelabel": {
                            "type": "text",
                            "label": lang.actionAttrValueLabel,
                            "readonly": true
                        }
                    }
                };

                if (eacDefaultPlans.models[k].get('actions_attributes').length > 0) {
                    var actionAttributes = eacDefaultPlans.models[k].get('actions_attributes');
                    for (var i = 0; i < actionAttributes.length; i++) {
                        var requiredField = actionAttributes[i].required;
                        var fieldKey = actionAttributes[i].key;

                        properties[fieldKey] = {
                            "type": "object",
                            "properties": {
                                "actionattrname": {
                                    "readonly": true,
                                    "required": false,
                                    "type": "text",
                                    "default": eacDefaultPlans.models[k].attributes.actions_attributes[i].name
                                },
                                "source": {
                                    "type": "string",
                                    "required": requiredField,
                                    "enum": ["csObj", "evtProp", "prevAct"]
                                },
                                "csObj_field": {
                                    "dependencies": "source",
                                    "type": "string",
                                    "required": true
                                },
                                "evtProp_field": {
                                    "dependencies": "source",
                                    "type": "string",
                                    "required": true,
                                    "enum": planProperties
                                },
                                "prevAct_field": {
                                    "dependencies": "source",
                                    "type": "string",
                                    "required": true,
                                    "readonly": true
                                }
                            }
                        };

                        fields[fieldKey] = {
                            "type": "object",
                            "fields": {
                                "actionattrname": {
                                    "type": "text",
                                    "readonly": true,
                                    "fieldClass": "eac-mandatory-field-indication",
                                    "label": eacDefaultPlans.models[k].attributes.actions_attributes[i].name
                                },
                                "source": {
                                    "type": "select",
                                    "label": lang.sourceLabel,
                                    "optionLabels": [lang.csObjLabel, lang.evtPropLabel, lang.prevActLabel]
                                },
                                "csObj_field": {
                                    "type": "otcs_node_picker",
                                    "label": eacDefaultPlans.models[k].get('actions_attributes')[i].name,
                                    "type_control": {
                                        "parameters": {
                                            "startLocations": [
                                                "csui/dialogs/node.picker/start.locations/current.location",
                                                "csui/dialogs/node.picker/start.locations/enterprise.volume",
                                                "csui/dialogs/node.picker/start.locations/personal.volume",
                                                "csui/dialogs/node.picker/start.locations/favorites",
                                                "csui/dialogs/node.picker/start.locations/recent.containers",
                                                "csui/dialogs/node.picker/start.locations/category.volume",
                                                "csui/dialogs/node.picker/start.locations/perspective.assets.volume",
                                                "recman/dialogs/node.picker/start.locations/classifications.volume", "xecmpf/dialogs/node.picker/start.locations/extended.ecm.volume.container"
                                            ]
                                        }
                                    },
                                    "dependencies": {
                                        "source": "csObj"
                                    }
                                },
                                "evtProp_field": {
                                    "type": "select",
                                    "label": eacDefaultPlans.models[k].get('actions_attributes')[i].name,
                                    "dependencies": {
                                        "source": "evtProp"
                                    }
                                },
                                "prevAct_field": {
                                    "label": eacDefaultPlans.models[k].get('actions_attributes')[i].name,
                                    "type": "text",
                                    "dependencies": {
                                        "source": "prevAct"
                                    }
                                }
                            }
                        };
                    }
                }

            }
            attributes.schema.properties["actionsData"].items.properties["action"].enum = actionFieldEnum;
            attributes.options.fields['actionsData'].fields.item.fields['action'].optionLabels = actionFieldLabels;
            attributes.data = this.getFormData(this.options.collection, eacDefaultPlans);

            this.set(attributes);
        },

        getFormData: function(collection, eacDefaultPlans) {
            var formData = [];
            if (collection.models && collection.models.length > 0) {
                formData = collection.models.map(function(modelObj, index) {
                    var actionKey = modelObj.get("action_key"),
                        modelObjItem = {
                            action: actionKey
                        };
                    eacDefaultPlans.models.forEach(function(eacDefaultPlanModel) {
                        var keyName = eacDefaultPlanModel.get('action_key') + '_fields';
                        modelObjItem[keyName] = {
                            'actionattributes': {
                                'parametername': lang.actionAttrParameterNameLabel,
                                'sourcelabel': lang.actionAttrSourceLabel,
                                'valuelabel': lang.actionAttrValueLabel
                            }
                        };
                        eacDefaultPlanModel.get("actions_attributes").filter(function(actionAttr) {
                            modelObjItem[keyName][actionAttr.key] = {
                                'actionattrname': '',
                                'source': '',
                                'csObj_field': '',
                                'evtProp_field': '',
                                'prevAct_field': ''
                            }
                        });
                        if (eacDefaultPlanModel.get('action_key') === actionKey) {
                            modelObj.get('attribute_mappings').forEach(function(attribute) {
                                var attributeInfo = eacDefaultPlanModel.get("actions_attributes").filter(function(actionAttr) {
                                    return actionAttr.key === attribute.action_attr_name;
                                }), 
                                source = '',
                                propVal = '',
                                csObj_propVal = '',
                                evtProp_propVal = '';
                                
                                attributeInfo = attributeInfo.length > 0 ? attributeInfo[0] : attributeInfo;
                                source = attribute.mapping_method;
                                propVal = attribute.mapping_data;

                                if (source === 'Content Server Object') {
                                    source = "csObj";
                                    csObj_propVal = propVal;
                                } else if (source === 'Event Property') {
                                    source = "evtProp";
                                    evtProp_propVal = propVal;
                                } else if (source === 'Result from previous Action') {
                                    source = "prevAct";
                                }
                                modelObjItem[actionKey + '_fields'][attribute.action_attr_name] = {
                                    "actionattrname": attributeInfo.name,
                                    "source": source,
                                    "csObj_field": csObj_propVal,
                                    "evtProp_field": evtProp_propVal,
                                    "prevAct_field": "Result from previous action"
                                };
                            });
                        }
                    });
                    return modelObjItem;
                });
            } else {
                var emptyModel = {
                    action: ''
                };
                eacDefaultPlans.models.forEach(function(eacPlan) {
                    var keyName = eacPlan.get('action_key') + '_fields';
                    emptyModel[keyName] = {
                        'actionattributes': {
                            'parametername': lang.actionAttrParameterNameLabel,
                            'sourcelabel': lang.actionAttrSourceLabel,
                            'valuelabel': lang.actionAttrValueLabel
                        }
                    };
                    eacPlan.get("actions_attributes").filter(function(actionAttr) {
                        emptyModel[keyName][actionAttr.key] = {
                            'actionattrname': '',
                            'source': '',
                            'csObj_field': '',
                            'evtProp_field': '',
                            'prevAct_field': ''
                        }
                    });
                });
                formData.push(emptyModel);
            }

            return {
                actionsData: formData
            };
        }
    });

    return EACActionsFormModel;

});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div>\r\n    <div class=\"xecmpf-eac-actions-header-wrapper binf-col-md-12 xecmpf-eac-header\">\r\n        <h4 class=\"xecmpf-eac-actions-header\" title=\"{{options.actionsLabel}}\" aria-label=\"{{options.actionsLabel}}\"><span class=\"binf-glyphicon binf-glyphicon-star alpaca-icon-required\"></span>{{options.actionsLabel}}</h4>\r\n    </div>\r\n    <div class=\"xecmpf-eac-actions-container-wrapper\">\r\n        <div class=\"binf-row\">\r\n            <div class=\"xecmpf-eac-actions-container binf-col-md-12 csui-form-set-array-wrapper\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.actions_impl_actionplan.actions', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.actions/actionplan.actions.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'csui/utils/contexts/factories/connector', 'csui/controls/form/form.view', 'csui/controls/progressblocker/blocker',
    'csui/controls/globalmessage/globalmessage',
    'xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions.form.model',
    'hbs!xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'css!xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions',
], function(_, $, Backbone, Marionette, ConnectorFactory, FormView, BlockingView,
    GlobalMessage, EACActionFormModel, template, lang) {

    var EACActionsView = FormView.extend({

        className: function() {
            var computedClassName = FormView.prototype.className.call(this);
            computedClassName += ' xecmpf-eac-actions xecmpf-eac-actions-hide-validation-errors';
            return computedClassName;
        },

        constructor: function(options) {
            var actionPlanActionsModels,
                actions = options.eventModel && options.eventModel.get('actions') || [];
            actionPlanActionsModels = actions.map(function(action, index) {
                return new Backbone.Model({
                    sequence: index + 1,
                    action_key: action.action_key,
                    attribute_mappings: action.attribute_mappings
                });
            });
            this.collection = new Backbone.Collection();
            this.collection.add(actionPlanActionsModels);
            options.model = new EACActionFormModel(undefined, {
                context: options.context,
                eventModel: options.eventModel,
                collection: this.collection
            });
            options.mode = 'create';
            options.layoutMode = 'doubleCol';
            options.breakFieldsAt = 3;
            FormView.prototype.constructor.call(this, options);
        },

        formTemplate: template,

        formTemplateHelpers: function() {
            return {
                actionsLabel: lang.actionsTabLabel
            };
        },

        _getLayout: function() {
            var retVal = FormView.prototype._getLayout.call(this);
            var template = this.getOption('formTemplate'),
                html = template.call(this, {
                    data: this.alpaca.data,
                    mode: this.mode
                }),
                bindings = this._getBindings(),
                view = {
                    parent: 'bootstrap-csui',
                    layout: {
                        template: html,
                        bindings: bindings
                    }
                };
            return view;
        },

        _getBindings: function() {
            return {
                actionsData: '.xecmpf-eac-actions-container'
            };
        },

        /**
         * Function: getSubmitData
         * Returns: Rules form data if formView is available
         */
        getSubmitData: function() {
            var data = this.getValues().actionsData;
            return data;
        }

    });

    return EACActionsView;

});
csui.define('xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tab.content.view',['csui/lib/underscore', 'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/utils/base', 
    'csui/utils/contexts/factories/connector',
    'csui/controls/tab.panel/tab.panel.view',
    'csui/controls/tab.panel/tab.links.ext.view',
    'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
    'csui/models/form', 
    'csui/controls/form/form.view',
    'csui/controls/globalmessage/globalmessage',
    'csui/widgets/metadata/metadata.properties.view',
    'csui/controls/progressblocker/blocker',
    'csui/controls/tile/behaviors/perfect.scrolling.behavior',
    'xecmpf/widgets/eac/impl/actionplan.processmode/actionplan.processmode.view',
    'xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode.form.model',
    'xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules.form.model',
    'xecmpf/widgets/eac/impl/actionplan.rules/actionplan.rules.view',
    'xecmpf/widgets/eac/impl/actionplan.actions/actionplan.actions.view',
    'i18n!xecmpf/widgets/eac/impl/nls/lang'
], function(_, $, Backbone, base, ConnectorFactory, TabPanelView, TabLinkCollectionViewExt,
    TabLinksScrollMixin, FormModel, FormView, GlobalMessage, MetaDataPropertiesView, BlockingView, PerfectScrollingBehavior, ProcessModeView, ProcessModeFormModel, EACRuleFormModel, RulesView, ActionsView, lang) {
    // constants of content view
    var ACTIONPLAN_CONTENT_VIEW_CONST = {
        ERROR_ACTION_PLAN_CREATION: lang.genericWarningMsgOnDeletion
    };
    var ActionPlanContentView = TabPanelView.extend({

        className: (base.isTouchBrowser() ? 'cs-touch-browser ' : '') +
            'cs-metadata-actionplan-content cs-metadata-properties binf-panel binf-panel-default',

        contentView: function(model) {
            var contentView = FormView;
            var panel = _.findWhere(this._propertyPanels, {
                model: model
            });
            if (panel) {
                return panel.contentView || FormView;
            } 
            switch (model.get('role_name')) {
                case 'rules':
                    contentView = RulesView;                    
                break;
                case 'actions':
                    contentView = ActionsView;
                break;
                case 'processMode':
                    contentView = ProcessModeView;
                break;
            }
            return contentView;
        },

        contentViewOptions: function(model) {
            var eventModel = this.options.node;
            var options = {
                    eventModel: eventModel,
                    context: this.options.context
                },
                panel = _.findWhere(this._propertyPanels, {
                    model: model
                });

            switch (model.get('role_name')) {
                case 'rules':
                    var actionPlanRuleModels,
                        actionPlanRulescollection = new Backbone.Collection(),
                        actionPlanRules = [{}],
                        eacRuleFormModel;
                    if (eventModel && eventModel.get('rules') && eventModel.get('rules').length > 0) {
                        actionPlanRules = eventModel.get('rules');
                    }
                    actionPlanRuleModels = actionPlanRules.map(function(rule, index) {
                        return new Backbone.Model({
                            sequence: index + 1,
                            operand: rule.operand || '',
                            operator: rule.operator || '',
                            to: rule.value || '',
                            conjunction: rule.conjunction || ''
                        });
                    });
                    actionPlanRulescollection.set(actionPlanRuleModels);
                    eacRuleFormModel = new EACRuleFormModel(undefined, {
                        context: this.options.context,
                        eventModel: eventModel,
                        collection: actionPlanRulescollection
                    });
                    _.extend(options, {
                        mode: 'create',
                        model: eacRuleFormModel,
                        isNewActionPlan: !eventModel.get('plan_id')
                    }); 
                break;
                case 'actions':
                    _.extend(options, {
                        summary: false
                    });
                break;
                case 'processMode':
                    var processModeModel = new ProcessModeFormModel(undefined, {
                        context: this.options.context,
                        eventModel: eventModel
                    });
                    _.extend(options, {
                        mode: 'create',
                        model: processModeModel
                    });
            }
            if (panel) {
                _.extend(options, panel.contentViewOptions);
            }            
            return options;
        },

        // specific implementation for TabableRegionBehavior
        isTabable: function() {
            if (this.options.notTabableRegion === true) {
                return false;
            }
            return true; // this view can be reached by tab
        },

        constructor: function ActionPlanContentView(options) {
            options || (options = {});

            _.defaults(options, {
                tabType: 'binf-nav-pills',
                mode: 'spy',
                extraScrollTopOffset: 3,
                formMode: 'create',
                toolbar: true,
                contentView: this.getContentView,
                TabLinkCollectionViewClass: TabLinkCollectionViewExt,
                tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                    ' select:not([disabled]), textarea:not([disabled]),' +
                    ' button:not([disabled]), iframe, object, embed,' +
                    ' *[tabindex], *[cstabindex], *[contenteditable]'
            });

            // Prepare an empty collection to be populated by tabs/forms later
            options.collection = new Backbone.Collection();
            var tabItemsCollection = new Backbone.Collection();
            var tabItems = [{
                role_name: "rules",
                title: lang.rulesTabLabel
            }, {
                role_name: "actions",
                title: lang.actionsTabLabel,
                required: true
            }, {
                role_name: 'processMode',
                title: lang.processModeTabLabel,
                required: true
            }];
            tabItems.forEach(function(tabItem) {
                tabItemsCollection.push(new Backbone.Model(tabItem));
            });
            this.eacEventActionPlans = tabItemsCollection;            

            TabPanelView.prototype.constructor.apply(this, arguments);

            // saving connector from context
            this.connector = this.options.context.getObject(ConnectorFactory);

            if (this.options.blockingParentView) {
                BlockingView.delegate(this, this.options.blockingParentView);
            } else {
              BlockingView.imbue(this);
            }

            this.listenTo(this.eacEventActionPlans, "request", this.blockActions)
                .listenTo(this.eacEventActionPlans, "request", this._checkFormFetching)
                .listenTo(this.eacEventActionPlans, "sync", this._syncForms)
                .listenTo(this.eacEventActionPlans, "sync", this.unblockActions)
                .listenTo(this.eacEventActionPlans, "destroy", this.unblockActions)
                .listenTo(this.eacEventActionPlans, "error", this.unblockActions)
                // If tab panel re-renders itself when the tab collection changes, it
                // has to prevent tab links and tab content from doing the same,
                // because these two views are destroyed during tab panel re-rendering
                .listenTo(this.collection, "reset", this.render);

            this.eacEventActionPlans.trigger('sync');

            // If the collection has been fetched before passing it to the view
            // and the operation is still ongoing, turn on the blocking view right
            // away and wait for the finishing event to turn it off
            if (this.eacEventActionPlans.fetching) {
                this.blockActions();
            }

            $(window).on('resize', _.bind(this._onWindowResize, this));

            // Perform after-rendering steps after blocking view renders inside
            // into this view; it registers for the render event earlier
            this.listenTo(this, 'render', this.onRendered);
        },
        behaviors: {
            PerfectScrolling: {
                behaviorClass: PerfectScrollingBehavior,
                contentParent: '> .binf-tab-content',
                scrollXMarginOffset: 30,
                // like bottom padding of container, otherwise scrollbar is shown always
                scrollYMarginOffset: 15
            }
        },
        onBeforeDestroy: function() {
            $(window).off('resize', this._onWindowResize);
        },

        render: function() {            
            TabPanelView.prototype.render.apply(this);
            this._initializeOthers();
            return this;
        },

        onRendered: function() {
            this._setTablinksAttributes();
            // work around for the dialog fade-in delay
            // delay this call a bit since the initial dialog fade in makes the tab to be hidden
            // calling _setTabLinksAttributes() the second time here fixes the dialog fade-in delay
            // but does not have any effect if the first call already works
            setTimeout(_.bind(this._setTablinksAttributes, this), 300);

            // If tab panel re-renders itself when the tab collection changes, it
            // has to prevent tab links and tab content from doing the same,
            // because these two views are destroyed during tab panel re-rendering
            this.tabLinks.stopListening(this.collection, 'reset');
            this.tabContent.stopListening(this.collection, 'reset');
            this.tabLinks.$el.addClass('binf-hidden');
            this.tabContent.$el.addClass('binf-hidden');

            this.blockActions();

            var allFormsRendered = [],
                self = this;
            this.tabContent.children.each(_.bind(function(childView) {
                var formRendered = $.Deferred();
                allFormsRendered.push(formRendered.promise());
                if (childView.content instanceof FormView) {
                    this.listenTo(childView.content, 'render:form', function() {
                        formRendered.resolve();
                    });
                } else {
                    formRendered.resolve();
                }
            }, this));
            $.when.apply($, allFormsRendered).done(function() {
                self.unblockActions();
                self.tabLinks.$el.removeClass('binf-hidden');
                self.tabContent.$el.removeClass('binf-hidden');
                self._initializeOthers();
                self.triggerMethod('render:forms', this);

                // event for keyboard navigation
                var event = $.Event('tab:content:render');
                self.$el.trigger(event);

                self.trigger('update:scrollbar');

            });
        },

        onPanelActivated: function() {
            // delay this a bit since the fade-in may make the tabs to be hidden
            setTimeout(_.bind(function() {
                this._setTablinksAttributes();
                this._enableToolbarState('.tab-links .tab-links-bar > ul li');
            }, this), 300);
        },

        _setTablinksAttributes: function() {
            var i, limit = 5;
            var siblings, parent = this.$el.parent();
            for (i = 0; i < limit; i++) {
                siblings = parent.siblings('.cs-tab-links.binf-dropdown');
                if (siblings.length > 0) {
                    var width = $(siblings[0]).width();
                    if (width > 15) {
                        var newWidth = width - 12,
                            widForEle = newWidth + "px",
                            dirForEle = this.rtlEnabled ? "margin-right" : "margin-left",
                            tabLinksEle = this.$el.find('.tab-links');

                        tabLinksEle.css({
                            "width": function() {
                                return "calc(100% - " + widForEle + ")";
                            }
                        });

                        tabLinksEle.css(dirForEle, widForEle);
                    }
                    break;
                }
                parent = parent.parent();
            }
        },

        _syncForms: function() {
            this._fetchingForms = false;
            var panelModels = this.eacEventActionPlans.where({
                role_name: 'rules'
            });
            panelModels = _.union(panelModels, this.eacEventActionPlans.where({
                role_name: 'actions'
            }));
            panelModels = _.union(panelModels, this.eacEventActionPlans.where({
                role_name: 'processMode'
            }));

            this.panelModelsLength = panelModels.length;
            this._normalizeModels(panelModels);
            // TODO: Warn here, if not all of the pre-fetched forms were
            // handled by extensions or were categories handled here
            this.collection.reset(panelModels);
        },

        _normalizeModels: function(models) {
            _.each(models, function(model) {
                // If the view shows a form and the form has a title, which is
                // not empty, this title should be used for the tab too
                if (model instanceof FormModel) {
                    var schema = model.get('schema');
                    if (schema && schema.title) {
                        model.set('title', schema.title);
                    }
                }
                // Make sure, that the model has always an ID.  The scroll-spy
                // used within the tab control puts these IDs to the a@href on
                // the  tab links.  It could not recognize the particular link
                // to navigate to otherwise.
                if (model.get('id') == null) {
                    model.set('id', model.cid);
                }
                // When models are added to a collection, their model.collection
                // property will not be updated, if it was already set - if they
                // were already added to some other collection earlier.  Here,
                // we're creating a new collection of property panel models, which
                // should own them - they have to be removed from their previous
                // collections, which fetched them.
                if (model.collection) {
                    model.collection.remove(model);
                }
            });
        },

        // private
        _initializeOthers: function() {
            var options = {
                gotoPreviousTooltip: '',
                gotoNextTooltip: ''
            };
            this._initializeToolbars(options);
            this._listenToTabEvent();

            // delay this a bit since the initial dialog fade in makes the tab to be hidden
            setTimeout(_.bind(this._enableToolbarState, this), 300);
        },

        _onWindowResize: function() {
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            this.resizeTimer = setTimeout(_.bind(function() {
                this._setTablinksAttributes();
                this._enableToolbarState();
            }, this), 200);
        },

        /**
         * Function: saveActionPlanContent
         * Internally calls methods to validate forms and make service call
         */
        saveActionPlanContent: function() {
            if (this.isAllFormsValid()) { // validate forms
               return this.makeActionPlanServiceCall();
            } else {
                return $.Deferred().reject('FORM_NOT_VALID');
            }
        }, 

        /**
         * Function: isAllFormsValid
         * Validates three content views and returns boolean flag. All content views should implement isFormValid method to validate the forms.
         * if content view does not implement isFormValid method, it verifies whether content view is formview and calls its validate method
         * Returns: {formIsValid|boolean} - true when all forms are valid or false
         */
        isAllFormsValid: function() {
            var formIsValid = true;
            this.tabContent.children.forEach(function(childView) {
                var roleName = childView.model.get('role_name');                
                if (childView.content.isFormValid) {
                    if (!childView.content.isFormValid()) {
                        formIsValid = false;
                    }
                } else if (childView.content instanceof FormView) {
                    if (!childView.content.validate()) {
                        formIsValid = false;
                    }
                } 
            });
            return formIsValid;
        },

        /**
         * Function: getFormsData
         * Prepares formsData from all content views. all content views should implement getSubmitData method to return form data
         * Returns: { formsData | json} - forms data. 
         */
        getFormsData: function() {
            // rules, actions, summary
            var formsData = {};
            this.tabContent.children.forEach(function(childView) {
                var roleName = childView.model.get('role_name');
                // TODO: make change in os to avoid this conversion after complete implementation (savePlan data key should be summary)                
                roleName = roleName === 'processMode'? 'summary' : roleName;   

                if (childView.content.getSubmitData) {
                    formsData[roleName] = childView.content.getSubmitData(); 
                } else if (childView.content instanceof FormView) {
                    formsData[roleName] = childView.content.getValues();
                } 
            });
            return formsData;
        },

        /**
         * Function: getGeneralInformation - prepares general information from the action plan model
         * Returns: { generalInfo | json} - It contains general information
         */
        getGeneralInformation: function() {
            var generalInfo = {};
            var actionPlanModel = this.options.node;
            generalInfo['event_id'] = actionPlanModel.get('event_id');
            generalInfo['namespace'] = actionPlanModel.get('namespace');
            generalInfo['event_name'] = actionPlanModel.get('event_name');
            generalInfo['rule_id'] = actionPlanModel.get('rule_id');
            generalInfo['plan_id'] = actionPlanModel.get('plan_id');
            return generalInfo;
        },              

        /**
         * Function: makeActionPlanServiceCall - Makes service call to update action plan
         *  generate request data and make service call.
         *  On creation/failure of action plan error message is shown on screen
         */
        makeActionPlanServiceCall: function() {
            var that = this,
                actionPlanUrl = this.connector.getConnectionUrl().getApiBase('v2') + '/eventactioncenter/actionplan',
                actionPlanRequestData = new FormData(),
                requestData = this.getFormsData(),
                $deferred = $.Deferred(); 

            requestData['gen_information'] = this.getGeneralInformation(); // general information               
            actionPlanRequestData.append('action_plan_items', JSON.stringify(requestData));
            this.blockActions();
            this.connector.makeAjaxCall({
                type: "PUT",
                url: actionPlanUrl,
                data: actionPlanRequestData,
                processData: false,
                contentType: false
            }).then(function(response) {
                // on action plan creation success
                if (response.results.statusCode === 200 && response.results.ok) {
                    GlobalMessage.showMessage('success', response.results.msg);
                    var eventInfo = {
                        planID: response.results.data.planID,
                        operation: requestData.gen_information.plan_id !== ''? 'update' : 'create',
                        event_id: requestData.gen_information.event_id
                    };
                    that.trigger('refresh:current:action:plan:item', eventInfo); // Only current action plan item should be refreshed
                    $deferred.resolve(); // saved
                } else {
                    $deferred.reject('FORM_NOT_SAVED'); // not saved
                }

            }, function(xhr) {
                // on action plan creation failure
                var messageToShow = (xhr.responseJSON && (xhr.responseJSON.errorDetail || xhr.responseJSON.error)) || ACTIONPLAN_CONTENT_VIEW_CONST.ERROR_ACTION_PLAN_CREATION;
                GlobalMessage.showMessage('error', messageToShow);
                $deferred.reject('FORM_NOT_SAVED'); // not saved
            }).always(function() {
                // works as finally block
                that.unblockActions();
            });
            return $deferred.promise();
        }

    });

    _.extend(ActionPlanContentView.prototype, TabLinksScrollMixin);

    return ActionPlanContentView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.tab.content/impl/actionplan.tabbed.view',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"xecmpf-eac-actionplan-content\"></div>\r\n<div class=\"xecmpf-eac-actionplan-footer-container\">\r\n    <div class=\"xecmpf-eac-actionplan-footer binf-right\">\r\n        <button title=\""
    + this.escapeExpression(((helper = (helper = helpers.save || (depth0 != null ? depth0.save : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"save","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.save || (depth0 != null ? depth0.save : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"save","hash":{}}) : helper)))
    + "\" class=\"binf-btn binf-btn-primary xecmpf-eac-save-actionplan\">\r\n            "
    + this.escapeExpression(((helper = (helper = helpers.save || (depth0 != null ? depth0.save : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"save","hash":{}}) : helper)))
    + "</button>\r\n        <button title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\" class=\"cancel-btn binf-btn binf-btn-default xecmpf-eac-cancel-actionplan\">"
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "</button>\r\n    </div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.tab.content_impl_actionplan.tabbed.view', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.tab.content/impl/actionplan.tabbed.view',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tabbed.view',['csui/lib/underscore', 'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
    'csui/utils/page.leaving.blocker',
    'xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tab.content.view',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'hbs!xecmpf/widgets/eac/impl/actionplan.tab.content/impl/actionplan.tabbed.view',
    'css!xecmpf/widgets/eac/impl/actionplan.tab.content/impl/actionplan.tabbed.view'
], function(_, $, Backbone, Marionette, ViewEventsPropagationMixin, PageLeavingBlocker, ActionPlanContentView, lang, template) {

    var ActionPlanTabbedView = Marionette.ItemView.extend({

        className: 'metadata-inner-wrapper xecmpf-eac-actionplan-tabbed-inner-wrapper',

        template: template,

        templateHelpers: function() {
            return {
                // show create label in case of new action plan otherwise show save label
                save: !!this.model.get('plan_id') ? lang.saveLabel : lang.createLabel,
                cancel: lang.closeLabel
            }
        },

        events: {
            'click .xecmpf-eac-save-actionplan': 'saveEventActionPlan',
            'click .xecmpf-eac-cancel-actionplan': 'cancelEventActionPlan'
        },

        constructor: function ActionPlanTabbedView(options) {
            options || (options = {});
            Marionette.ItemView.prototype.constructor.call(this, options);

            var tabOptions = {
                context: this.options.context,
                node: this.options.model,
                eventname: this.options.eventname,
                namespace: this.options.namespace,
                actionplanSettingsView: this
            }

            this.actionPlanContentView = new ActionPlanContentView(tabOptions);
            this.propagateEventsToViews(this.actionPlanContentView);
        },
        onRender: function() {
            var that = this;
            var childTabView = this.actionPlanContentView.render();
            Marionette.triggerMethodOn(childTabView, 'before:show', childTabView, this);
            this.$el.find('.xecmpf-eac-actionplan-content').append(childTabView.el);
            Marionette.triggerMethodOn(childTabView, 'show', childTabView, this);
            this.listenTo(this.actionPlanContentView, 'refresh:current:action:plan:item', function(data) {
                that.trigger('refresh:current:action:plan:item', data);
            });
            
            /* 
            @desc:_tabbedViewContainsChanges - private variable, tabbedViewContainsChanges - view variable
            setting property tabbedViewContainsChanges to true makes save button enable and to false makes it disable
            created this accessor property to have a single source of truth to disable save button and to show alert while 
            navigation from one action plan to another action plan
            */
           var _tabbedViewContainsChanges = null;
            Object.defineProperty(this, 'tabbedViewContainsChanges', {
                get: function() {
                    return _tabbedViewContainsChanges;
                },
                set: function(containsChanges) {
                    _tabbedViewContainsChanges = containsChanges;
                    that.updateSaveButtonDisableStatus(!containsChanges);
                    if (containsChanges && !PageLeavingBlocker.isEnabled()) {
                        PageLeavingBlocker.enable(lang.warningMsgOnActionPlanNavigation);
                    } else if (!containsChanges) {
                        PageLeavingBlocker.disable();
                    }
                }
            });

            if (!!this.model.get('plan_id')) {
                // save scenario
                this.tabbedViewContainsChanges = false;
            } else {
                // create scenario
                this.tabbedViewContainsChanges = true;
            }

            // expecting every conent view extends form view directly
            this.actionPlanContentView.tabContent.children.forEach(function(tabContentView) {
                that.listenTo(tabContentView.content, 'change:field', function(eventInfo) {
                    // some field values changed on child view
                    that.tabbedViewContainsChanges = true;
                });
            });

        },
        
        /**
         * Function: saveEventActionPlan
         * It calls saveActionPlanContent method in the content view to save data
         */
        saveEventActionPlan: function() {
            var that = this;
            this.actionPlanContentView.saveActionPlanContent().then(function() {
                // saved
                that.tabbedViewContainsChanges = false; 
            }, function(errMsg) {
                // Not saved
            });
        },

        cancelEventActionPlan: function() {
            this.trigger('actionplan:click:back');
        },

        /**
         * Function: updateSaveButtonDisableStatus
         * Description: disable or enable save button based on parameter value
         */
        updateSaveButtonDisableStatus: function(disableIt) {
            var $saveBtn = this.$el.find('.xecmpf-eac-save-actionplan');
            $saveBtn.prop('disabled', disableIt);
        },
        /**
         * disabling pageleaving blocker
         */
        onDestroy: function() {
            if (PageLeavingBlocker.isEnabled()) {
                PageLeavingBlocker.disable();
            }
        }
    });

    _.extend(ActionPlanTabbedView.prototype, ViewEventsPropagationMixin);

    return ActionPlanTabbedView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/actionplan.details/impl/actionplan.details',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"xecmpf-actionplan-header-view\"></div>\r\n<div class=\"xecmpf-actionplan-master-view\">\r\n  <div class=\"xecmpf-actionplan-list-view\"></div>\r\n  <div class=\"xecmpf-actionpan-details-view\"></div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_actionplan.details_impl_actionplan.details', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/eac/impl/actionplan.details/impl/actionplan.details',[],function(){});
csui.define('xecmpf/widgets/eac/impl/actionplan.details/actionplan.details.view',["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin",
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/progressblocker/blocker',
  "xecmpf/widgets/eac/impl/actionplan.list/actionplan.list.view",
  "xecmpf/widgets/eac/impl/actionplan.header/actionplan.header.view",
  "xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tabbed.view",
  "hbs!xecmpf/widgets/eac/impl/actionplan.details/impl/actionplan.details",
  "i18n!xecmpf/widgets/eac/impl/nls/lang",
  "css!xecmpf/widgets/eac/impl/actionplan.details/impl/actionplan.details"
], function (module, $, _, Backbone, Marionette, LayoutViewEventsPropagationMixin, ModalAlert, Url, ConnectorFactory, GlobalMessage, BlockingView, 
    ActionPlanListView, ActionPlanHeaderView, ActionPlanTabbedView, template, lang) {
  'use strict';

  var ActionPlanDetailsView = Marionette.LayoutView.extend({

    className: 'xecmpf-actionplan-details',
    template: template,

    regions: {
      headerRegion: '.xecmpf-actionplan-header-view',
      actionPlanListRegion: '.xecmpf-actionplan-list-view',
      actionPlanDetailsRegion: '.xecmpf-actionpan-details-view'
    },

    initialize: function () {
      this.setHeaderView();
      this.setActionPlanListView();
    },

    constructor: function ActionPlanDetailsView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions(); // propagate dom:refresh to child views
    },
    onRender: function () {
      var that = this;

      this.listenTo(this.actionPlanListView, 'actionplan:click:item', function(eventSrc) {
        // checks for any form changes before navigating
        this.isContentViewCanbeUpdated(eventSrc.model).then(function() {
          that.updateContentView(eventSrc);
        });
      });

      this.listenTo(this.actionPlanListView, 'actionplan:add:item', function(eventSrc) {
        // checks for any form changes before adding any new item
        this.isContentViewCanbeUpdated().then(function() {
          that.actionplanTabbedView.destroy(); // to avoid multiple confirmations on addition of action plan
          that.actionPlanListView.addNewActionPlan(); // adds new action plan
        });
      });

      this.listenTo(this.actionPlanListView, 'actionplan:click:delete', function(eventSrc) {
        this.deleteActionPlan(eventSrc);
      });
      this.actionPlanListRegion.on('show', _.bind(this.onActionPlanListShown, this)); 
      this.headerRegion.show(this.headerView); 
      this.actionPlanListRegion.show(this.actionPlanListView);          
           
    },

    /**
     * Function: isContentViewCanbeUpdated, asks for user confirmation if there are any changes before navigation
     * Parameters: { nextModel - optional }
     * Returns: boolean flag to indicate whether content view can be updated with new action plan
     */
    isContentViewCanbeUpdated: function( nextModel ) {
      var $deferred = $.Deferred(),
        currentModel = null;
      if (this.actionplanTabbedView && !this.actionplanTabbedView.isDestroyed) {
        // if user clicks on the currently active link again
        currentModel = this.actionplanTabbedView.options.model
        if (currentModel === nextModel) {
          $deferred.reject();
        } else if (this.actionplanTabbedView.tabbedViewContainsChanges) {
          // asks for user confirmation
          ModalAlert.confirmQuestion( lang.warningMsgOnActionPlanNavigation, 
            lang.actionPlanNavigationDialogTitle, { buttons: ModalAlert.OkCancel })
          .done(function() {
            $deferred.resolve();
          })
          .fail(function() {
            $deferred.reject();
          });
        } else {
          $deferred.resolve();  
        }
      } else {
        $deferred.resolve();
      }
      return $deferred.promise();
    },

    /**
     * Function: updateContentView
     * Updates content view with selected action plan details, after updating tab content it adds active class to selected action plan item
     */
    updateContentView: function(eventSrc) {
      this.setActionPlanTabbedView(eventSrc.model);
      this.actionPlanDetailsRegion.show(this.actionplanTabbedView);
      // removes active class on all list items and add active class for current element
      this.actionPlanListView.$el.find('.binf-active').removeClass('binf-active');
      eventSrc.$el.addClass('binf-active');
    },

    setHeaderView: function () {
      this.headerView = new ActionPlanHeaderView(this.options);
      this.listenTo(this.headerView, "actionplan:click:back", function () {
        // checks for any form changes before navigating back to new screen
        this.isContentViewCanbeUpdated().then((function() {
          this.trigger("actionplan:close");
        }).bind(this));
      });
    },
    setActionPlanListView: function () {
      this.actionPlanListView = new ActionPlanListView({
        showAddActionPlan: true,
        context: this.options.context,
        model: this.options.model
      });
    },
    setActionPlanTabbedView: function (model) {
      var that = this;
      if (this.actionplanTabbedView) {
          this.actionplanTabbedView.destroy();
      }
      this.actionplanTabbedView = new ActionPlanTabbedView({
          context: this.options.context,
          model: model,
          eventname: this.options.eventname,
          namespace: this.options.namespace,
          originatingView: this.options.originatingView
      });
      this.listenTo(this.actionplanTabbedView, "actionplan:click:back", function() {
        this.trigger("actionplan:close");
      });
      this.listenTo(this.actionplanTabbedView, "refresh:current:action:plan:item", function(data) {
        this.actionPlanListView.refreshCurrentActionPlanItem(data).then(function(actionPlanListItem) {
          that.updateContentView(actionPlanListItem);
        });
      });
    },
    /**
     * Function: onActionPlanListShown
     * Parameter: actionPlanListView  - ActionPlanListView
     * trigger click event on first action plan list item 
     */
    onActionPlanListShown: function(actionPlanListView) {      
      var firstActionPlan = actionPlanListView.actionPlanListRegion.currentView.children.findByIndex(0);
      if (firstActionPlan) {
        firstActionPlan.trigger('click:actionplan:item');
      }     
    },

   /**
    * This method is used to delete the Action Plan.
    * Function: deleteActionPlan
    * Parameter: eventSrc  - ActionPlanListItemView
    * 
    */
    deleteActionPlan: function(eventSrc) {
      var that = this,
          model = eventSrc.model,
          message = _.str.sformat(lang.deleteActionPlanConfirmatonText, model.get('name') ),
          planId = model.get('plan_id');
      if (!!planId) {
        // If plan id is present, asks for confirmation and delete it          
        ModalAlert.confirmQuestion( message, 
          lang.deleteActionPlanConfirmatonTitle, {buttons: ModalAlert.OkCancel})
          .done(function () {
            /*delete the record in the database goes here */
            var connector = that.options.context.getObject(ConnectorFactory, that.options);
            var deleteActplanURL = new Url(connector.connection.url).getApiBase('v2');
            deleteActplanURL = Url.combine(deleteActplanURL, 'eventactioncenter', 'actionplan');
            var queryParameters = Url.combineQueryString({
                  rule_id : model.attributes.rule_id,
                  plan_id : planId
                });
            deleteActplanURL = Url.combine(deleteActplanURL+'?'+queryParameters);
            connector.makeAjaxCall({
                type: "DELETE",
                url: deleteActplanURL,
                processData: false,
                contentType: false,
                success: function (response) {
                    that.updateActionPlanSelection(eventSrc);
                    GlobalMessage.showMessage("success", response.results.msg);
                },
                error: function (xhr) {
                    // Unblock the layout view on error
                    that.trigger("error");
                    var errorMessage = xhr.responseJSON ?
                            (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                    xhr.responseJSON.error) :
                            "Server Error: Unable to perform the action";
                    GlobalMessage.showMessage("error", errorMessage);
                }
            });
          }).fail(function(){
            eventSrc._setFocus();
          })

        } else {
          // if planId is not present, then delete the model from collection as it is not saved at
          that.updateActionPlanSelection(eventSrc);
        }
    },

   /*
    * Function: updateActionPlanSelection
    * Parameter: actionPlan  - ActionPlanListItemView
    * trigger click event on next action plan list item 
    * To select the next/previous Action Plan when the Action Plan is deleted
    * 
    */
    updateActionPlanSelection: function(actionPlan) {
      var actionPlanCollectionView = this.actionPlanListView.actionPlanListItemCollectionView;
      var actionPlanListChildren = actionPlanCollectionView.children;
      var index = actionPlan._index;
      var nextView = actionPlanListChildren.findByIndex(index + 1);
      var prevView = actionPlanListChildren.findByIndex(index - 1);
      var nextActiveView = nextView ? nextView : (prevView ? prevView : undefined);
      var isActive = actionPlan.$el.hasClass('binf-active');
      if (nextActiveView && actionPlan._hasFocus) {
        actionPlanCollectionView._changeTabIndexesAndSetFocus(actionPlan, nextActiveView, false);
      }
      actionPlan.model.destroy();
      if (isActive === true) {
        this.actionplanTabbedView.destroy(); // destroying tab view as corresponding model is already destroyed
        if (nextActiveView) {
          nextActiveView.trigger('click:actionplan:item');
        }
      }
    }
  });

  _.extend(ActionPlanDetailsView.prototype, LayoutViewEventsPropagationMixin);

  return ActionPlanDetailsView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/table/cells/impl/actionplan',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <a href=\"\" class = \"action-plan-edit\"> "
    + this.escapeExpression(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"count","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.actionPlan || (depth0 != null ? depth0.actionPlan : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionPlan","hash":{}}) : helper)))
    + "</a>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "    <button class=\"action-plan-add\">"
    + this.escapeExpression(((helper = (helper = helpers.addActionPlan || (depth0 != null ? depth0.addActionPlan : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addActionPlan","hash":{}}) : helper)))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.count : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "</div>";
}});
Handlebars.registerPartial('xecmpf_controls_table_cells_impl_actionplan', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/controls/table/cells/impl/actionplan',[],function(){});
csui.define('xecmpf/controls/table/cells/eac.actionplan.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/contexts/factories/node',
  'csui/controls/dialog/dialog.view',
  'xecmpf/models/eac/eventactionplans.model',
  'xecmpf/widgets/eac/impl/actionplan.details/actionplan.details.view',
  'hbs!xecmpf/controls/table/cells/impl/actionplan',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/controls/table/cells/impl/actionplan'
], function ($, _, Backbone, Marionette, TemplatedCellView, cellViewRegistry, NodeFactory,
    DialogView, EACEventActionPlans, ActionPlanDetailsView, template, lang) {

  var ActionPlanCellView = TemplatedCellView.extend({

        template: template,
        className: 'csui-nowrap',

        triggers: {
          'click .action-plan-add': 'click:ActionPlanAdd'
        },

        events: {
          'click .action-plan-edit': 'editActionPlan'
        },

        getValueData: function () {
          var node  = this.model,
              count = node.get('action_plans').length;
          return {
            count: count,
            actionPlan: lang.actionPlan,
            addActionPlan: lang.addActionPlan
          };
        },

        onClickActionPlanAdd: function () {
          this.showActionPlanDetailsView();
        },

        //edit action plan
        editActionPlan: function (event) {
          event.preventDefault();
          event.stopPropagation();
          this.showActionPlanDetailsView();
        },

        /**
         * Function: showActionPlanDetailsView
         * Opens new EAC screen to show action plans
         */
        showActionPlanDetailsView: function () {
          // replace the originatingView with sliding left/right animation
          var actionPlanDetailsView = new ActionPlanDetailsView({
                context: this.options.context,
                model: this.options.model
              }),
              tableView             = this.options.tableView,
              originatingView       = tableView.options.originatingView,
              $originatingView      = tableView.options.originatingView.$el,
              actionPlanWrapper;

          $originatingView.parent().append(
              "<div class='xecmpf-actionplan-details-wrapper'></div>");
          actionPlanWrapper = $(
              $originatingView.parent().find('.xecmpf-actionplan-details-wrapper')[0]);
          actionPlanWrapper.hide();

          actionPlanDetailsView.render();
          Marionette.triggerMethodOn(actionPlanDetailsView, 'before:show');
          actionPlanWrapper.append(actionPlanDetailsView.el);
          originatingView.actionPlanDetailsView = actionPlanDetailsView;

          $originatingView.hide('blind', {
            direction: 'left',
            complete: function () {
              actionPlanWrapper.show('blind',
                  {
                    direction: 'right',
                    complete: function () {
                      Marionette.triggerMethodOn(actionPlanDetailsView, 'show');
                    }
                  }, 100);
            }
          }, 100);

          var _showOriginatingView = function () {
            var that = this;
            actionPlanWrapper.hide('blind', {
              direction: 'right',
              complete: function () {
                originatingView.$el.show('blind', {
                  direction: 'left',
                  complete: function () {
                    originatingView.actionPlanDetailsView &&
                    originatingView.actionPlanDetailsView.destroy();
                    originatingView.blockActions();
                    that.options.tableView.collection.fetch({reload: true})
                        .fail(function () {
                          //handle the fail condition
                        })
                        .always(function () {
                          originatingView.triggerMethod('dom:refresh');
                          originatingView.unblockActions();
                        });
                  }
                }, 100);
                actionPlanDetailsView.destroy();
                actionPlanWrapper.remove();
              }
            }, 100);
          };
          this.listenTo(actionPlanDetailsView, "actionplan:close",
              _.bind(_showOriginatingView, this));
        }

      },
      {
        hasFixedWidth: true,
        columnClassName: 'xecmpf-table-cell-action-plan'
      });

  cellViewRegistry.registerByColumnKey('action_plan', ActionPlanCellView);

  return ActionPlanCellView;
});

// this file is copied from //products/main/pkg/CS_CORE_UI/src/controls/dialog/impl/footer.view.js
// We use it unchanged. Please do not change it, as we want to use it from csui, when they have
// moved it from the impl directory to a public location.
csui.define('xecmpf/controls/bosearch/searchform/impl/footer.view',['csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function ( Marionette, TabableRegion) {

  var ButtonView = Marionette.ItemView.extend({

    tagName: 'button',

    className: 'binf-btn',

    template: false,

    triggers: {
      'click': 'click'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    constructor: function ButtonView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
      return this.$el.is(':not(:disabled)') && this.$el.is(':not(:hidden)');
    },
    currentlyFocusedElement: function () {
      if (this.$el.prop('tabindex') === -1){
        this.$el.prop('tabindex', 0);
      }
      return this.$el;
    },
    onRender: function () {
      var button = this.$el,
          attributes = this.model.attributes;
      button.text(attributes.label);
      button.addClass(attributes['default'] ? 'binf-btn-primary' : 'binf-btn-default');
      if (attributes.toolTip) {
        button.attr('title', attributes.toolTip);
      }
      if (attributes.separate) {
        button.addClass('cs-separate');
      }
      this.updateButton(attributes);
    },

    updateButton: function (attributes) {


      var $button = this.$el;


      attributes || (attributes = {});
      if (attributes.hidden !== undefined) {
        if (attributes.hidden) {
          $button.addClass('binf-hidden');
        } else {
          $button.removeClass('binf-hidden');
        }
      }
      if (attributes.disabled !== undefined) {
        $button.prop('disabled', attributes.disabled);
      }
    }

  });

  var DialogFooterView = Marionette.CollectionView.extend({

    childView: ButtonView,

    constructor: function DialogFooterView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },
    onDomRefresh: function(){
      this.children.each(function(buttonView){
        buttonView.trigger('dom:refresh');
      });
    },

    getButtons: function() {
      return this.children.toArray();
    },

    updateButton: function (id, attributes) {
      var button = this.collection.get(id);
      if (button) {
        this.children
            .findByModel(button)
            .updateButton(attributes);
      } else {
        // If the footer comes from the dialog template including the buttons,
        // the collection of dynamically created buttons is empty.
        // The template has to provide correct initial classes for the buttons
        // and their identifiers must be present in the "data-cs-id" attribute.
        ButtonView.updateButton(this.$('[data-cs-id="' + id + '"]'), attributes);
      }
    }

  });

  return DialogFooterView;
});

csui.define('xecmpf/controls/bosearch/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/controls/bosearch/impl/nls/root/lang',{
  boSearchFormTitle: 'Search {0}',
  boSearchFormButtonSearch: 'Search',
  boSearchFormButtonCancel: 'Cancel',
  boResultListButtonAttach: 'Attach',
  noBusinessObjectsFound: 'No business objects found.',
  resultListBannerMessage: 'Search for {0}',
  resultListRefineMessage: "More results are available but result limit has been reached. Refine your search.",
  zeroSearchFields: 'No search fields configured in the business application',
  labelBusinessObjectId: 'ID',
  ERR_COLUMNS_CHANGED: 'Configuration has changed during your search. Close the search and start a new one.',
  errorGettingSearchForm: 'Error getting form for business object search.',
  errorSearchingBusinessObjects: 'Error searching for business objects.'
});



/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/bosearch/searchform/impl/bosearchform',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-bosearchform-body csui-content-without-footer\">\r\n  <div class=\"conws-bosearchheader\">\r\n    <div class=\"conws-bosearchheader-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.search_form_title || (depth0 != null ? depth0.search_form_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"search_form_title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.search_form_title || (depth0 != null ? depth0.search_form_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"search_form_title","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"conws-spacer\"></div>\r\n  </div>\r\n  <div class=\"conws-bosearchfields\">\r\n  </div>\r\n  <div style=\"display:none;\" class=\"conws-bosearchfields-zero\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.zero_fields_title || (depth0 != null ? depth0.zero_fields_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"zero_fields_title","hash":{}}) : helper)))
    + "\">\r\n      \""
    + this.escapeExpression(((helper = (helper = helpers.zero_fields_title || (depth0 != null ? depth0.zero_fields_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"zero_fields_title","hash":{}}) : helper)))
    + "\"\r\n  </div>\r\n</div>\r\n<div class=\"conws-bosearchform-footer binf-modal-footer\">\r\n</div>\r\n<div class=\"conws-right-shadow\"></div>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_bosearch_searchform_impl_bosearchform', t);
return t;
});
/* END_TEMPLATE */
;
/**
 * Created by stefang on 05.04.2016.
 */
csui.define('xecmpf/controls/bosearch/searchform/bosearchform.view',['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/log',
  'csui/controls/form/form.view',
  'csui/utils/contexts/factories/connector',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/controls/bosearch/searchform/impl/footer.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  'xecmpf/controls/bosearch/searchform/bosearchform.model',
  'i18n!xecmpf/controls/bosearch/impl/nls/lang',
  'hbs!xecmpf/controls/bosearch/searchform/impl/bosearchform'
], function (require, $, _, Backbone, Marionette, base, log,
    FormView,
    ConnectorFactory,
    ModalAlert,
    DialogFooterView,
    PerfectScrollingBehavior,
    LayoutViewEventsPropagationMixin,
    TabableRegionBehavior,
    TabContentKeyboardBehavior,
    BoSearchFormModel,
    lang,
    template
) {

  var BoSearchFieldsFormView = FormView.extend({

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      },
      TabContentKeyboardBehavior: {
        behaviorClass: TabContentKeyboardBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true
      }
    },

    defaults: {
      tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                              ' select:not([disabled]), textarea:not([disabled]),' +
                              ' button:not([disabled]), iframe, object, embed,' +
                              ' *[tabindex], *[cstabindex], *[contenteditable]'
    },

    onKeyDown: function (event) {
      // handle tab, space, enter
      if (event.keyCode === 9 || event.keyCode === 32 || event.keyCode === 13) {
        var elem = this.onKeyInView(event);
        if (elem) {
          event.preventDefault();
          event.stopPropagation();
          // this.trigger('changed:focus', this);
          elem.prop("tabindex", "0");
          elem.trigger("focus");
        }
      }
    },

    onDomRefresh: function(){
      this.trigger("refresh:tabable:elements");
    },
    constructor: function BoSearchFieldsFormView(options) {
      _.defaults(options, this.defaults);
      options.searchTabContentForTabableElements = true;
      FormView.prototype.constructor.apply(this, arguments);
    }

  });

  var BusinessObjectSearchFormView = Marionette.LayoutView.extend({

    events: {
      'keydown': 'onKeyDown'
    },

    className: 'conws-bosearchform',
    template: template,

    triggers: {
      "click .binf-btn.search" : "bosearchform:search",
      "click .binf-btn.cancel": "bosearchform:cancel"
    },

    regions: {
      searchFields: '.conws-bosearchfields',
      footer: '.binf-modal-footer'
    },

    ui: {
      footer: '.binf-modal-footer'
    },

    constructor: function BusinessObjectSearchForm(options) {
      _.defaults(options, this.defaults);
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();
      this.listenTo(this, "bosearchform:search", this._triggerSearch);
      this.listenTo(this, "bosearchform:cancel", this._triggerCancel);
      this.listenTo(this.model, "change:bo_type_name", this._updateTitle);
      this.searchFormModel = new BoSearchFormModel(
          {
            id: this.model.get("bo_type_id"),
            name: this.model.get("bo_type_name")
          },
          {connector: this.options.context.getObject(ConnectorFactory)}
      );
      this.listenTo(this.searchFormModel, "change:name", function() {
        this.model.set("bo_type_name",this.searchFormModel.get("name"));
      });
      this.listenTo(this.searchFormModel, "change", function() {
        this.model.set("bus_att_metadata_mapping",this.searchFormModel.get("bus_att_metadata_mapping"));
      });
      this.listenTo(this.searchFormModel, "error", function(model, response, options) {
        var errmsg = response && (new base.Error(response)).message || lang.errorGettingSearchForm;
        log.error("Fetching the search forms failed: {0}",errmsg) && console.error(log.last);
        ModalAlert.showError(errmsg);
      });
      // SAPRM-9295:
      // Reference Search: when search form is empty a message should be displayed
      this.listenTo(this.searchFormModel, "sync", function() {
        var data = this.searchFormModel.get("data");
        if ( $.isEmptyObject(data) ) {
          this._updateFormFieldsZero(true);

          //SAPRM-10221: focus should be in 'search' button if there are no form fields
          this.focusOnSearchButton();

        }
        else {
          this._updateFormFieldsZero(false);

          //SAPRM-10221: focus should be in first form field if there are form fields
          this.listenToOnce(this.searchForm, "render", function() {
            this.focusOnFirstFormField();
          });

        }
      });
    },

    templateHelpers: function () {
      return {
        search_form_title: this._getTitle(),
        search_button_text: lang.boSearchFormButtonSearch,
        cancel_button_text: lang.boSearchFormButtonCancel,
        zero_fields_title: lang.zeroSearchFields
      };
    },

    onKeyDown: function (event) {
      //ctrl-enter from search form field -> set focus on search button
      if (event.keyCode === 13 && event.ctrlKey) { //ctrl-enter
       // check if ctrl-enter is from a search form field, and not from search/cancel button
       if( this.searchForm.$el.has(event.originalEvent.srcElement).length > 0 ){
             this.focusOnSearchButton();
        }
      }
    },

    _getTitle: function () {
      return _.str.sformat(lang.boSearchFormTitle,this.model.get("bo_type_name"));
    },

    _updateTitle: function () {
      var titleEl = this.$el.find(".conws-bosearchheader-title"),
          title = this._getTitle();
      titleEl.text(title);
      titleEl.attr({title:title});
    },

    _updateFormFieldsZero: function (zero) {
      var elem_fields      = this.$el.find(".conws-bosearchfields");
      var elem_fields_zero = this.$el.find(".conws-bosearchfields-zero");

      if (zero) {
        elem_fields.css({"display": "none"});
        elem_fields_zero.css({"display": ""});
      }
      else {
        elem_fields.css({"display": ""});
        elem_fields_zero.css({"display": "none"});
      }
    },

    //SAPRM-10221: focus should be in 'search' button
    focusOnSearchButton: function() {
      var btnviews = this.footerView.getButtons();
      btnviews && btnviews[0] && btnviews[0].$el.trigger("focus");
    },

    //SAPRM-10221: focus should be in first form field
    focusOnFirstFormField:function() {
      var firstField = this.searchFields.$el.find('.alpaca-container-item-first input');
      if ( firstField ) {
        firstField.trigger("focus");
      }
    },

    onRender: function () {
      // LayoutView destroys views on rendering, so we must create them every time on rendering
      this.searchForm = new BoSearchFieldsFormView({model: this.searchFormModel,mode:"create",layoutMode:"singleCol"});
      this.searchForm.model.fetch();

      var buttons = [
        {
          default: true,
          label: lang.boSearchFormButtonSearch,
          click: _.bind(this._triggerSearch, this)
        },
        {
          label: lang.boSearchFormButtonCancel,
          click: _.bind(this._triggerCancel, this)
        }
      ];
      this.footerView = new DialogFooterView({
        collection: new Backbone.Collection(buttons)
      });

      this.listenTo(this.footerView, 'childview:click', this.onClickButton);

      this.searchFields.show(this.searchForm);
      this.footer.show(this.footerView);

      var btnviews = this.footerView.getButtons();
      btnviews && btnviews[0] && btnviews[0].$el.addClass("search");
      btnviews && btnviews[1] && btnviews[1].$el.addClass("cancel");

    },


    
    onClickButton: function (view) {
      var attributes = view.model.attributes;
      if (attributes.click) {
        attributes.click();
      }
    },

    _triggerSearch: function() {
      log.debug("trigger bosearch:search") && console.log(log.last);
      // get values from form and trigger search
      // var valid = this.searchForm.validate();
      // if (valid) {
      var formData = this.searchForm.getValues(),
          formSchema = {
            data: this.searchFormModel.get("data"),
            options: this.searchFormModel.get("options"),
            schema: this.searchFormModel.get("schema")
          };
      this.model.trigger("bosearch:search",{searchParams:formData,searchForms:formSchema});
      // }
    },

    _triggerCancel: function() {
      log.debug("trigger bosearch:cancel") && console.log(log.last);
      this.model.trigger("bosearch:cancel");
    }

  });

  _.extend(BusinessObjectSearchFormView.prototype, LayoutViewEventsPropagationMixin);

  return BusinessObjectSearchFormView;
});




/**
 * Created by stefang on 06.06.2016.
 */
csui.define('xecmpf/controls/bosearch/resultlist/boresult.collection',["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/base",
  "csui/utils/log",
  "csui/models/mixins/resource/resource.mixin",
  "csui/models/browsable/browsable.mixin",
  "i18n!xecmpf/controls/bosearch/impl/nls/lang"
], function ($, _, Backbone, base, log,
    ResourceMixin, BrowsableMixin, lang) {

  function mapobj(obj,iteratee,context) {
    return _.object(_.map(_.pairs(obj),function(keyval) {
      return _.iteratee(iteratee, context)(keyval);
    }));
  }

  var BoResultTableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    },

    constructor: function BoResultTableColumnModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultTableColumnCollection = Backbone.Collection.extend({

    model: BoResultTableColumnModel,
    comparator: "sequence",

    constructor: function BoResultTableColumnCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultColumn = Backbone.Model.extend({

    idAttribute: "column_key",

    constructor: function BoResultColumn(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultColumnCollection = Backbone.Collection.extend({

    model: BoResultColumn,

    constructor: function BoResultColumnCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var BoResultModel = Backbone.Model.extend({
    constructor: function BoResultModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    get: function() {
      return Backbone.Model.prototype.get.apply(this, arguments);
    }
  });

  var csui_width = 120, csui_px = 14, csui_pad = 32, max_abbrev = 4;
  // csui uses 120px as average field length, including two times 8px left and right padding
  // when using a 14px font.
  // these values should be derived from the actual settings on the page. but we cannot.
  // thus we assume the standard values.

  // as csui uses an average field width that displays about 12 characters,
  // we use according maximum and minimum field lengths.
  function getLeveledLength(fieldLength,headerText,labelLength) {
    var length = Math.max(fieldLength||0,(headerText&&headerText.length)||0,labelLength||0,max_abbrev);
    length = Math.min(length,60);
    return length;
  }

  function getMinFactor(smallestLength,averageLength,longestLength) {
    // avg_width: average width per letter, for shortest text. varies: for texts of few characters
    // only, we assume abbreviations with more capital letters and we use larger value.
    var avg_width = smallestLength>max_abbrev ? 0.53 : 0.6;
    // csui_average: how many characters of the shortest text, can be placed in a average column
    var csui_average = (csui_width - csui_pad) / (csui_px * avg_width);
    // factor: set the min factor equal to the ratio of the smallest length to the average length,
    // so when scaled accordingly by the table view the smallest column has mostly no ellipsis.
    var factor = smallestLength / csui_average;
    log.debug("csui_average {0}",csui_average) && console.log(log.last)
    return Math.min(factor,0.8);
  }

  var BoResultCollection = Backbone.Collection.extend({

    model: BoResultModel,

    constructor: function BusinesObjectResultCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.makeResource(options);
      this.makeBrowsable(options);
      this.boSearchModel = options.boSearchModel;
      this.searchParams = options.searchParams;
      this.labelToKey = {},
      this.nameToKey = {},
      this.columns = new BoResultColumnCollection();
      this.tableColumns = new BoResultTableColumnCollection();
      this.totalCount = 0;
      this.skipCount = 0;
      this.topCount = options.pageSize || 100;
      this.maxCount = options.maxRowCount;
      this.options = options;
    }
  },
  {
    // errors
    ERR_COLUMNS_CHANGED: "ERR_COLUMNS_CHANGED"
  });

  ResourceMixin.mixin(BoResultCollection.prototype);
  BrowsableMixin.mixin(BoResultCollection.prototype);

  var defaults = _.defaults({},BoResultCollection.prototype);

  _.extend(BoResultCollection.prototype, {

    fetch: function (options) {
      // do server call only if we have search params and
      // if either we didn't yet scroll to the end (length<maxCount)
      // or we have a reset request
      var reset = options && options.reset;
      if (this.searchParams && (reset || this.maxCount===undefined || this.length < this.maxCount)) {
        reset && (options.url = this.url(options));
        return defaults.fetch.apply(this, arguments);
      } else {
        return $.Deferred().resolve().promise();
      }
    },

    url: function (options) {
      //var path = 'forms/nodes/create',
      var path = 'businessobjects',
          skipCount = (options && options.reset) ? 0 : (this.skipCount || 0),
          params = _.omit(
              _.defaults(
                  {
                    bo_type_id: this.boSearchModel.get("bo_type_id"),
                    limit: this.topCount,
                    page: this.topCount ? Math.floor(skipCount / this.topCount) + 1 : undefined
                  },
                  mapobj(this.searchParams, function (keyval) {
                    return ["where_" + keyval[0], keyval[1]];
                  }, this)), function (value) {
                return value === null || value === '';
              }),
          resource = path + '?' + $.param(params),
          baseurl  = this.connector.connection.url;
      //var url = base.Url.combine(baseurl, resource);
      var url = base.Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, resource);
      return url;
    },

    parse: function (response,options) {
      function parcmp(pnew,cnew) {
        var result;
        if (cnew) {
          var pcount = 0;
          for (var ii = 0; ii<cnew.length; ii++) {
            var celnew = cnew[ii];
            pcount += (pnew[celnew.fieldName]!==undefined) ? 1 : 0;
          }
          if (pcount===0) {
            result = "incompatible";
          }
        }
        return result;
      }
      function colcmp(cold,cnew) {
        var result;
        if (cnew) {
          for (var ii = 0; ii<cnew.length; ii++) {
            var celnew = cnew[ii], celold = cold[ii];
            if (!celold || celold.fieldName!==celnew.fieldName) {
              return "incompatible";
            } else if (celold.fieldLabel!==celnew.fieldLabel
                       || celold.position!==celnew.position
                       || celold.length!==celnew.length) {
              result = "significant";
            }
          }
        }
        return result;
      }
      //this.response = response;
      delete this.errorMessage;
      var rows = [];
      if (this.searchParams && response && response.results) {
        var columnDescriptions = response.results.column_descriptions,
            pardiff = ( $.isEmptyObject(this.searchParams)|| $.isEmptyObject(columnDescriptions) ) ? "significant" : parcmp(this.searchParams,columnDescriptions),
            coldiff,
            ok = (pardiff!=="incompatible");
        if (ok && !options.reset && this.columnDescriptions) {
          coldiff = colcmp(this.columnDescriptions, columnDescriptions);
          ok = (coldiff!=="incompatible");
        }
        if (!ok) {
          // raise an error, if old and new columns and mapped values are incompatible
          this.errorMessage = BoResultCollection.ERR_COLUMNS_CHANGED;
        } else {
          if (!columnDescriptions || !columnDescriptions.length) {
            // if column descriptions are undefined or empty use businessobjectid as default column.
            columnDescriptions = [{
                  fieldLabel: "Business Object ID",
                  fieldName: "businessObjectId",
                  keyField: "",
                  length: 15,
                  position: 1
                }];
          }
          var searchedParams = _.extend({}, this.searchParams);
          var searchedForms = _.extend({}, this.searchForms);
          var mappedValues = {};
          // rebuild columns on reset, first fetch or if column descriptions have any difference
          // column differences must be compatible at that point, as this was checked above.
          if (options.reset || !this.columnDescriptions || pardiff==="significant" || coldiff==="significant") {
            var normDescrs  = [],
                labelToKey  = {},
                nameToKey   = {},
                totalLength = 0,
                columnCount = 0,
                smallestLength,
                longestLength;
            _.each(columnDescriptions, function (attributes, index) {
              // input_attributes_are_like: {
              //   fieldLabel: "Ct",
              //   fieldName: "ATTYP",
              //   keyField: "",
              //   length: 2,
              //   position: 1
              // },
              // var column_key = attributes.fieldName || attributes.fieldLabel;
              // column_key = column_key && column_key.replace(/[^a-z-_A-Z0-9]/g,"_");
              var column_key = "conws_col_" + index,
                  labelLength = 0;
              // build value map if given and also use the mapped values for field length calculation
              if (searchedForms
                  && searchedForms.options
                  && searchedForms.options.fields
                  && searchedForms.options.fields[attributes.fieldName]
                  && searchedForms.options.fields[attributes.fieldName].optionLabels
                  && searchedForms.schema
                  && searchedForms.schema.properties
                  && searchedForms.schema.properties[attributes.fieldName]
                  && searchedForms.schema.properties[attributes.fieldName].enum
                  && searchedForms.options.fields[attributes.fieldName].optionLabels.length
                     === searchedForms.schema.properties[attributes.fieldName].enum.length) {
                var labels = searchedForms.options.fields[attributes.fieldName].optionLabels,
                    values = searchedForms.schema.properties[attributes.fieldName].enum,
                    map = mappedValues[column_key] = {};
                _.each(labels, function (label, mapidx) {
                  map[values[mapidx]] = label;
                  if (label.length>labelLength) {
                    labelLength = label.length
                  }
                }, this);
              }
              var normalized = _.extend({
                align: "left",
                name: attributes.fieldLabel,
                persona: "",
                sort: true,
                type: -1 /* for string*/,
                width_weight: 0
              }, attributes, {
                correctedLength: getLeveledLength(attributes.length,attributes.fieldLabel,labelLength),
                column_key: column_key
              });
              if (normalized.correctedLength) {
                // only if length or field label is set use length for average calculation
                // columns with unset length are assumed to get average length
                totalLength += normalized.correctedLength;
                columnCount += 1;
                if (smallestLength===undefined || normalized.correctedLength<smallestLength) {
                  smallestLength = normalized.correctedLength;
                }
                if (longestLength===undefined || normalized.correctedLength>longestLength) {
                  longestLength = normalized.correctedLength;
                }
              }
              normDescrs.push(normalized);
              labelToKey[normalized.fieldLabel] = normalized.column_key;
              nameToKey[normalized.fieldName] = normalized.column_key;
            }, this);
            // set width factors according corrected length (depending on length AND field label)
            // so variation of length is not too wide, in order to avoid truncated fields.
            var defaultKey, lowestSequence,
                tableColumns = _.map(normDescrs,function (column) {
                  var key      = column.column_key,
                      sequence = column.position + 1;
                  if (sequence !== undefined) {
                    if (lowestSequence === undefined || sequence < lowestSequence) {
                      lowestSequence = sequence;
                      defaultKey = key;
                    }
                  }
                  defaultKey || (defaultKey = key);
                  return {key: key, sequence: sequence};
                });

            if (columnCount>1
                && smallestLength && smallestLength>0
                && longestLength && longestLength>smallestLength) {
              // ensure, that smallest length is not smaller than minimal factor of average length.
              // compute a correction length accordingly and apply it on all column lengths.
              // This is done to avoid truncated headers while reflecting the expected field lengths.
              var averageLength = totalLength/columnCount,
                  minFactor = getMinFactor(smallestLength,averageLength,longestLength),
                  minLength = averageLength * minFactor,
                  correctionLength = smallestLength<minLength ? (minFactor*averageLength-smallestLength)/(1-minFactor) : 0,
                  widthFactorSum = 0,
                  maxWidthFactor = 0,
                  maxWidthFactorIndex = 0;
              log.debug("minFactor {0}",minFactor) && console.log(log.last)
              averageLength += correctionLength;
              _.each(normDescrs,function(normalized,index){
                // now set width factors. length = 0 is assumed to have average Length.
                normalized.correctedLength = normalized.correctedLength ? normalized.correctedLength+correctionLength : averageLength;
                var widthFactor = normalized.correctedLength / averageLength;
                log.debug("widthFactor {0}",widthFactor) && console.log(log.last)
                tableColumns[index].widthFactor =  widthFactor;
                widthFactorSum += widthFactor;
                if (widthFactor>=maxWidthFactor) {
                  maxWidthFactor = widthFactor;
                  maxWidthFactorIndex = index;
                }
              }, this);
              log.debug("widthFactorSum {0}",widthFactorSum) && console.log(log.last)
              var widthFactorRest = columnCount - widthFactorSum;
              log.debug("widthFactorRest {0}",widthFactorRest) && console.log(log.last)
              if (widthFactorRest!==0) {
                maxWidthFactor += widthFactorRest;
                widthFactorSum += widthFactorRest;
                tableColumns[maxWidthFactorIndex].widthFactor = maxWidthFactor;
                log.debug("widthFactorSum {0}",widthFactorSum) && console.log(log.last)
              }
            }

            this.orderByDefaultKey = defaultKey;
            this.mappedValues = mappedValues;
            this.labelToKey = labelToKey;
            this.nameToKey = nameToKey;
            this.columns.reset(normDescrs, {silent: true});
            this.tableColumns.reset(tableColumns);
            this.columnDescriptions = response.results.column_descriptions;
          }

          this.searchedParams = searchedParams;
          this.searchedForms = searchedForms;

          if (response.results.result_rows) {
            var needCount = this.maxCount===undefined ? this.topCount : Math.min(this.topCount, this.maxCount - this.length);
            for (var rowindex = 0; rowindex < needCount; rowindex++) {
              if (rowindex >= response.results.result_rows.length) {
                break;
              }
              var attributes = response.results.result_rows[rowindex];
              var row = _.extend(mapobj(attributes, function (keyval) {
                var key = this.labelToKey[keyval[0]] || this.nameToKey[keyval[0]] || keyval[0],
                    map = this.mappedValues[key],
                    val = (map && map[keyval[1]]) || keyval[1];
                return [key, val];
              }, this), {
                id: attributes.rowId
              });
              rows.push(row);
            }
          }

          this.totalCount = response && response.paging && response.paging.total_count;
          if (options.reset) {
            this.skipCount = 0;
          }
          this.maxRowsExceeded = response && response.results && response.results.max_rows_exceeded;

        }
      }
      return rows;
    }

  });

  return BoResultCollection;

});

/**
 * Created by stefang on 05.04.2016.
 */
csui.define('xecmpf/controls/bosearch/resultlist/botable.view',['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/log',
  "csui/lib/backbone", 'csui/lib/marionette',
  'csui/controls/table/table.view',
  "csui/lib/jquery.dataTables.tableTools/js/dataTables.tableTools",
  'xecmpf/controls/bosearch/resultlist/boresult.collection',
  'i18n!xecmpf/controls/bosearch/impl/nls/lang'
], function (require, $, _, log,
    Backbone, Marionette,
    TableView,
    TableTools,
    BoResultCollection,
    lang
) {

  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  var InfiniteTableScrollingBehavior = Marionette.Behavior.extend({

    defaults: {
      content: null,
      contentParent: null,
      fetchMoreItemsThreshold: 95
    },

    constructor: function InfiniteTableScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      view.infiniteScrollingBehavior = this;
      this.listenTo(view, 'render', this._bindScrollingEvents);
      this.listenTo(view, 'before:destroy', this._unbindScrollingEvents);
    },

    _scrollToPosition: function (scrollPosition,where) {
      // if possible, scroll given position to "middle", "top" or "bottom" of visible area
      // otherwise scroll to the nearest visible position without triggering an additional fetch.
      var contentParent = getOption.call(this, 'contentParent'),
          parentHeight = this._contentParent.height(),
          content = getOption.call(this, 'content'),
          contentEl = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() :
                      this.view.$el,
          contentHeight = _.reduce(contentEl, function(sum,el){return sum+$(el).height()},0);
      if (contentHeight<parentHeight) {
        scrollPosition = 0
      } else {
        if (where==="middle") {
          scrollPosition = scrollPosition - parentHeight / 2;
        } else if (where==="bottom") {
          scrollPosition =  scrollPosition - parentHeight;
        }
        scrollPosition =  Math.floor(scrollPosition);
        if (scrollPosition < 0) {
          scrollPosition = 0
        } else {
          var fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold'),
              scrollableHeight = Math.floor((contentHeight-parentHeight)*(fetchMoreItemsThreshold/100.0));
          if (scrollPosition>=scrollableHeight) {
            scrollPosition = scrollableHeight-1; // ensure, that no fetch is triggered
          }
        }
      }
      this._contentParent.scrollTop(scrollPosition);
    },

    scrollTop: function (scrollPosition) {
      this._scrollToPosition(scrollPosition,"top");
    },

    scrollMiddle: function (scrollPosition) {
      this._scrollToPosition(scrollPosition,"middle");
    },

    scrollBottom: function (scrollPosition) {
      this._scrollToPosition(scrollPosition,"bottom");
    },

    _bindScrollingEvents: function () {
      this._unbindScrollingEvents();
      var contentParent = getOption.call(this, 'contentParent');
      this._contentParent = contentParent ? this.view.$(contentParent) : this.view.$el;
      this._contentParent.on('scroll.' + this.view.cid, _.bind(this._checkScrollPosition, this));
    },

    _checkScrollPosition: function () {
      var contentParent = getOption.call(this, 'contentParent'),
          content = getOption.call(this, 'content'),
          contentEl = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() :
                      this.view.$el,
          fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold'),
          contentHeight = _.reduce(contentEl, function(sum,el){return sum+$(el).height()},0),
          scrollableHeight = contentHeight - this._contentParent.height(),
          lastScrollPosition = this._contentParent.scrollTop(),
          scrollablePercentage = lastScrollPosition * 100 / scrollableHeight;
      this.view.lastScrollPosition = lastScrollPosition;
      if (scrollablePercentage >= fetchMoreItemsThreshold) {
        this._checkScrollPositionFetch();
      }
    },

    _checkScrollPositionFetch: function () {
      var collection = this.view.collection;
      if (collection.length < collection.totalCount && !collection.fetching &&
          collection.skipCount < collection.length) {
        log.debug('fetching from {0}', collection.length) && console.log(log.last);
        var oldSkip = collection.skipCount;
        collection.setSkip(collection.length, false);
        var contentParent = getOption.call(this, 'contentParent');
        // to fix CWS-1546, just send a mouseup event to the scrollbar, so the drag
        // operation ends and element is sensitive again. And: sending this event obviously
        // does not harm the other scenarios, for example when scrolling with the mouse wheel.
        // if one finds a beter solution, for exampletirggering this mouseup only if a drag
        // operation is in progress, then feel free to update the code here.
        this.$(".ps-scrollbar-y-rail").trigger("mouseup");
        collection.fetch({
          reset: false,
          remove: false,
          merge: false,
          silent: true,
          success: _.bind(function () {
            if (collection.errorMessage && collection.errorMessage===BoResultCollection.ERR_COLUMNS_CHANGED) {
              collection.setSkip(oldSkip,false);
              if (this.view.lastScrollPosition>0) {
                this.view.$(contentParent).scrollTop(this.view.lastScrollPosition-1);
              }
            } else {
              this.view.render();
            }
          }, this)
        });
      }
    },

    _unbindScrollingEvents: function () {
      if (this._contentParent) {
        this._contentParent.off('scroll.' + this.view.cid);
      }
    }

  });

  var InfiniteScrollingTableView = TableView.extend({

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: _.defaults({
          InfiniteScrolling: {
            behaviorClass: InfiniteTableScrollingBehavior,
            contentParent: 'tbody',
            content: 'tbody>tr:visible',
            fetchMoreItemsThreshold: 100
          }
        },
        TableView.prototype.behaviors),

    constructor: function InfiniteScrollingTableView() {
      TableView.prototype.constructor.apply(this, arguments);
      this.listenTo(this,"clicked:cell", this._clickedCell);
      // this.listenTo(this,"row:clicked", this._clickedRow);
      if (this.options.disableItemsWithWorkspace){
          this.listenTo(this, "tableRowRendered", this._disableRow);  
      }

      this.listenTo(this.collection, "request", function(model,xhr,options) {
        // clear scroll position when fetch with reset:true is triggered
        if (options.reset) {
          delete this.lastScrollPosition;
        }
      });
    },

    _disableRow: function(event){
        var eventTarget = event.target;
        var node = event.node;
        if (node.get("has_workspace")){
            var row = $(eventTarget); 
            row.addClass("conws-boresulttable-disabled-row");
            row.off("pointerenter"); //disable pointer events to avoid highlighting the rows
            row.off("pointerleave");
            row.find("td").not('.csui-table-cell-_toggledetails').off("click"); // disable cell click except for the expand/collapse details button.
        }
   },

    onKeyDown: function (event) {
      // handle tab, space, enter only for selectRows single
      if (this.options && this.options.selectRows === 'single') {
        if (event.keyCode === 32 || event.keyCode === 13) {
          var btoggleDetails = event.target.classList.contains('csui-table-cell-_toggledetails');
          if (!btoggleDetails) { // it's  not a toggle cell
            event.preventDefault();
            event.stopPropagation();
            event.target.click();
          }
        }
      }
    },

    _clickedCell: function(cellEventInfo) {
      if (!this.ignoreSelectEvents) {
        var selectedRow = {
          model: cellEventInfo.model,
          // index: cellEventInfo.rowIndex,
          target: this.table.row(cellEventInfo.rowIndex).node()
        };
        this.lastSelectedRow = selectedRow;
        this.trigger("row:selected",selectedRow);
      }
    },

    // _clickedRow: function(rowEventInfo) {
    //   if (!this.ignoreSelectEvents) {
    //     var selectedRow = {
    //       model: rowEventInfo.node,
    //       // index: rowEventInfo.node.get("rowId")-1;
    //       target: rowEventInfo.target
    //     };
    //     this.lastSelectedRow = selectedRow;
    //     this.trigger("row:selected",selectedRow);
    //   }
    // },

    setSelection: function(selectedNodesById,selected) {

      this.ignoreSelectEvents = true;

      selected = selected || selected===undefined;
      function getTableTools() {
        return this.tableTools ||
               (this.tableTools = TableTools.fnGetInstance(this.table.table().node()));
      }
      function selectRowsByNodeIds(selectedNodesById) {
        if (this.table && selectedNodesById) {
          _.each(selectedNodesById,function(id) {
            var node = this.collection.get(id),
                position = this.collection.indexOf(node),
                tt = getTableTools.call(this),
                trNode = this.table.row(position).node();
            if (selected) {
              tt.fnSelect(trNode);
            } else {
              tt.fnDeselect(trNode);
            }
          },this);
        }
      }
      selectRowsByNodeIds.call(this,selectedNodesById);
      delete this.lastSelectedRow;
      if (this.table && selectedNodesById && selectedNodesById.length>0 && selected) {
        var id = selectedNodesById[0],
            node = this.collection.get(id),
            position = this.collection.indexOf(node),
            trNode = this.table.row(position).node();
        this.lastSelectedRow = {
          model: node,
          // index: position,
          target: $(trNode)
        };
      }

      if (this.lastSelectedRow && this.infiniteScrollingBehavior) {
        var lastSelectedMiddle = this.lastSelectedRow.target.position().top + this.lastSelectedRow.target.height()/2;
        this.infiniteScrollingBehavior.scrollMiddle(lastSelectedMiddle);
      }

      delete this.ignoreSelectEvents;

    },

    clearSelection: function() {

      this.ignoreSelectEvents = true;

      // forget last selected row
      delete this.lastSelectedRow;

      // clear selection state in rows
      this.clearChildrenSelection();

      if (this.lastScrollPosition!==undefined && this.infiniteScrollingBehavior) {
        this.infiniteScrollingBehavior.scrollTop(this.lastScrollPosition);
      }

      delete this.ignoreSelectEvents;

    }

  });

  return InfiniteScrollingTableView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/bosearch/resultlist/impl/boresultlist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"conws-boresultbanner-container\">\r\n        <div class=\"conws-boresultbanner\">"
    + this.escapeExpression(((helper = (helper = helpers.banner_message || (depth0 != null ? depth0.banner_message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"banner_message","hash":{}}) : helper)))
    + "</div>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"conws-boresultlist-body\">\r\n  <div class=\"conws-boresulttable\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.banner_message : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n  <div class=\"conws-boresultfooter\">\r\n    <div class=\"conws-boresultfooter-message-container  binf-modal-footer\">\r\n      <div class=\"conws-boresultfooter-message\">"
    + this.escapeExpression(((helper = (helper = helpers.footer_message || (depth0 != null ? depth0.footer_message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"footer_message","hash":{}}) : helper)))
    + "</div>\r\n    </div>\r\n    <div class=\"conws-boresultfooter-attach-container  binf-modal-footer\">\r\n      <button type=\"button\" disabled class=\"binf-btn binf-btn-default attach\">"
    + this.escapeExpression(((helper = (helper = helpers.attach_button_text || (depth0 != null ? depth0.attach_button_text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attach_button_text","hash":{}}) : helper)))
    + "</button>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_bosearch_resultlist_impl_boresultlist', t);
return t;
});
/* END_TEMPLATE */
;
/**
 * Created by stefang on 05.04.2016.
 */
csui.define('xecmpf/controls/bosearch/resultlist/boresultlist.view',['require', 'csui/lib/jquery', 'csui/lib/underscore',
  "csui/lib/backbone", 'csui/lib/marionette',
  'csui/utils/base', 'csui/utils/log',
  'csui/utils/contexts/factories/connector',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/controls/bosearch/resultlist/botable.view',
  'xecmpf/controls/bosearch/resultlist/boresult.collection',
  'hbs!xecmpf/controls/bosearch/resultlist/impl/boresultlist',
  'i18n!xecmpf/controls/bosearch/impl/nls/lang'
], function (require, $, _,
    Backbone, Marionette,
    base, log,
    ConnectorFactory,
    ModalAlert,
    InfiniteScrollingTableView,
    BoResultCollection,
    template, lang
) {

  var BusinessObjectResultListView = Marionette.LayoutView.extend({

    className: 'conws-boresultlist',
    template: template,

    regions: {
      tableRegion: '.conws-boresulttable'
    },

    triggers: {
      "click .binf-btn.attach": "attach:clicked"
    },

    constructor: function BusinessObjectResultListView(options) {

      options || (options = {});

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.listenTo(this.model, "change:bo_type_name", this._updateBanner);
      this.listenTo(this.model, "bosearch:search", this._triggerSearch);
      this.listenTo(this, "attach:clicked", this._triggerAttach);
    },

    _triggerSearch : function(searchEventInfo) {
      // get form data, set in result collection and trigger fetch.

      // first create empty collection and table view
      if (!this.collection) {
        this.collection = new BoResultCollection(undefined,
            {
              connector: this.options.context.getObject(ConnectorFactory),
              boSearchModel: this.options.model,
              autoreset: true
            });
        this.render();
        this.listenTo(this.collection,"sync",this._updateFooter);
        this.listenTo(this.collection,"sync",this._showSyncError);
        this.listenTo(this.collection,"error",this._showSearchError);
      }
      // then do search and table view renders triggered by model events and shows busy indicator
      this.collection.searchParams = searchEventInfo ? searchEventInfo.searchParams : undefined;
      this.collection.searchForms = searchEventInfo ? searchEventInfo.searchForms : undefined;

      // focus on first row in result list
      var that = this;
      this.collection.fetch({reset: true}).then(function(){
        var curFocus = that.resultTable.currentlyFocusedElement();
        if (curFocus) {
          curFocus.trigger("focus");
        }
      });


      // After search selected:
      // show attach button
      // SAPRM-9320: if metadata mapping is enabled for bus. attachments then nevertheless
      //             no attach button is shown but a single select table is displayed
      var bus_att_metadata_mapping = this.model.get("bus_att_metadata_mapping");
      if (this.options.multipleSelect && !bus_att_metadata_mapping ){
        var elem = this.$el.find(".conws-boresultfooter>.conws-boresultfooter-attach-container");
        if (elem) {
          elem.css({"display": "block"});
          // Reset attach button to disabled as no item is selected after search
          var attBtn = elem.children();
          if ( attBtn ) {
            attBtn[0].disabled = true;
          }
        }
        // here is the best place to add space for attach button
        this.$el.addClass('conws-with-attachbtn');
      }
    },

    _selectedRow: function(selectedRow) {
      log.debug("trigger reference:clicked") && console.log(log.last);
      this.listenToOnce(this.model,"reference:selected",function() {
        $(selectedRow.target).trigger("mouseleave"); // remove hover style at end of selection process
      });
      this.model.trigger("boresult:select",{selectedItems:[selectedRow.model]});
    },

    _enableAttachBtn: function(selectedRow){
      if ( selectedRow.nodes.length > 0 ){
        var selChilds = this.resultTable.getSelectedChildren();
        if ( selChilds.length > 0 ) {
          var elem = this.$el.find(".conws-boresultfooter .binf-btn.binf-btn-default.attach");
          if (elem) {
            elem[0].disabled = false;
          }
        }
      }
    },

    _disableAttachBtn: function(selectedRow){
      if ( selectedRow.nodes.length > 0 ){
        var selChilds = this.resultTable.getSelectedChildren();
        if ( selChilds.length === 0 ) {
          var elem = this.$el.find(".conws-boresultfooter .binf-btn.binf-btn-default.attach");
          if (elem) {
            elem[0].disabled = true;
          }
        }
      }
    },

    templateHelpers: function () {
      return {
        banner_message: this._getBannerMessage(),
        footer_message: this._getFooterMessage(),
        attach_button_text: lang.boResultListButtonAttach,
      };
    },

    _updateBanner: function () {
      var msg = this._getBannerMessage();
      if (msg) {
        this.$el.find(".conws-boresultbanner").text(this._getBannerMessage());
      }
    },

    _getBannerMessage: function () {
      return this.collection ? undefined : _.str.sformat(lang.resultListBannerMessage,this.model.get("bo_type_name"));
    },

    _updateFooter: function() {
      var msg = this._getFooterMessage();
      if (msg) {
        this.$el.find(".conws-boresultfooter-message").text(msg);
        this.$el.addClass("conws-with-footer");
      } else {
        this.$el.removeClass("conws-with-footer");
      }
    },

    _getFooterMessage: function () {
      return (this.collection && this.collection.maxRowsExceeded) ? lang.resultListRefineMessage : undefined;
    },

    _showSyncError: function () {
      if (this.collection.errorMessage && this.collection.errorMessage===BoResultCollection.ERR_COLUMNS_CHANGED) {
        ModalAlert.showError(lang[this.collection.errorMessage]||this.collection.errorMessage);
      }
    },

    _showSearchError: function (model, response, options) {
      var errmsg = response && (new base.Error(response)).message || lang.errorSearchingBusinessObjects;
      log.error("Searching for business objects failed: {0}",errmsg) && console.error(log.last);
      ModalAlert.showError(errmsg);
    },

    _triggerAttach : function() {
      // SAPRM-9320: together with this topic the events are aligned
      // log.debug("trigger reference:selected") && console.log(log.last);
      // this.model.trigger("reference:selected",{selectedItems:this.resultTable.getSelectedChildren()});
      log.debug("trigger boresult:select") && console.log(log.last);
      this.model.trigger("boresult:select",{selectedItems:this.resultTable.getSelectedChildren()});
    },

    onRender: function() {
      this._updateFooter();

      if (this.collection) {
        var selectRows = "single";
        var selectColumn = false;
        // SAPRM-9320: if metadata mapping is enabled for bus. attachments then nevertheless
        //             no attach button is shown but a single select table is displayed
        var bus_att_metadata_mapping = this.model.get("bus_att_metadata_mapping");
        if ( this.options.multipleSelect && ! bus_att_metadata_mapping ) {
          selectRows = "multiple";
          selectColumn = true;
        }
        var enableSorting = true;
		
        if (this.options.enableSorting !== undefined){
          enableSorting = this.options.enableSorting;
        }
        
        this.resultTable = new InfiniteScrollingTableView({
          context: this.options.context,
          connector: this.options.context.getObject(ConnectorFactory),
          collection: this.collection,
          columns: this.collection.columns,
          tableColumns: this.collection.tableColumns,
          selectRows: selectRows,
          selectColumn: selectColumn,
          enableSorting: enableSorting,
          //orderBy: this.collection.orderByDefaultKey && (this.collection.orderByDefaultKey + ' asc'),
          nameEdit: false,
          haveDetailsRowExpandCollapseColumn: true,
          disableItemsWithWorkspace: this.options.disableItemsWithWorkspace,
          //columnsWithSearch: columns,
          tableTexts: {
            zeroRecords: lang.noBusinessObjectsFound
          }
        });
        // SAPRM-9320: if metadata mapping is enabled for bus. attachments then nevertheless
        //             no attach button is shown but a single select table is displayed
        if (!this.options.multipleSelect || bus_att_metadata_mapping) {
          this.listenTo(this.resultTable,"row:selected", this._selectedRow);
        }
        else {
          this.listenTo(this.resultTable,"tableRowSelected", this._enableAttachBtn);
          this.listenTo(this.resultTable,"tableRowUnselected", this._disableAttachBtn);
        }
        this.tableRegion.show(this.resultTable);
      } else if (this.resultTable) {
        this.stopListening(this.resultTable);
        delete this.resultTable;
      }
    }

  });

  return BusinessObjectResultListView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/bosearch/impl/bosearch',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"conws-bosearch-wrapper\">\r\n  <div class=\"conws-bosearch-panel\">\r\n    <div class=\"conws-bosearch-title\">\r\n      "
    + this.escapeExpression(((helper = (helper = helpers.bosearch_title || (depth0 != null ? depth0.bosearch_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"bosearch_title","hash":{}}) : helper)))
    + "\r\n    </div>\r\n    <div class=\"conws-bosearch-form\">\r\n    </div>\r\n    <div class=\"conws-bosearch-result\">\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_bosearch_impl_bosearch', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/controls/bosearch/impl/bosearch',[],function(){});
/**
 * Created by stefang on 05.04.2016.
 */
csui.define('xecmpf/controls/bosearch/bosearch.view',['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/widgets/metadata/metadata.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'xecmpf/controls/bosearch/searchform/bosearchform.view',
  'xecmpf/controls/bosearch/resultlist/boresultlist.view',
  'hbs!xecmpf/controls/bosearch/impl/bosearch',
  'css!xecmpf/controls/bosearch/impl/bosearch'
], function (require, $, _,
    Marionette,
    MetadataView /* load metadata.css to have the styles and the same load order always */,
    LayoutViewEventsPropagationMixin,
    BoSearchFormView,
    BoResultListView,
    template
) {

  var BusinessObjectSearchView = Marionette.LayoutView.extend({

    className: 'conws-bosearch csui-metadata-overlay',
    template: template,

    regions: {
      searchRegion: '.conws-bosearch-form',
      resultRegion: '.conws-bosearch-result'
    },

    constructor: function BusinessObjectSearchView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
      this.listenTo(this.model,"reference:search",this._referenceSearchOpen);
    },

    templateHelpers: function () {
      return {
        bosearch_title: this.options.title
      };
    },

    onRender: function () {
      // LayoutView destroys views on rendering, so we must create them every time on rendering
      this.searchView = new BoSearchFormView({model: this.model, context: this.options.context});
      this.resultView = new BoResultListView({
        model: this.model, context: this.options.context,
        multipleSelect: this.options.multipleSelect,
        enableSorting:  false,
        disableItemsWithWorkspace: this.options.disableItemsWithWorkspace
      });

       if (this.options.title){
         this.$el.addClass("display-title");
       }

      this.searchRegion.show(this.searchView);
      this.resultRegion.show(this.resultView);
    },

    _referenceSearchOpen: function() {
      // TODO: where to place this code? seems a little bit tricky here, to do ALL these things.
      // TODO: do this before the animation and not during it, to have a smooth slide-in.
      var bosearchview = this;
      if (bosearchview.searchView && bosearchview.searchView.searchForm) {
        bosearchview.searchView.searchForm.$el.hide();
        var old_id = bosearchview.searchView.searchForm.model.get("id"),
            new_id = bosearchview.searchView.model.get("bo_type_id");
        if (old_id!==new_id) {
          if (bosearchview.resultView && bosearchview.resultView.collection) {
            delete bosearchview.resultView.collection;
            bosearchview.resultView.render();
          }
        }
        // be sure to use bo_type_id in model of search view also for the search form
        bosearchview.searchView.searchForm.model.set({
          "id": new_id,
          "name": bosearchview.searchView.model.get("bo_type_name")
        });
        bosearchview.searchView.searchForm.model
            .fetch({reset:true,silent:true})
            .then(function() {
              if (bosearchview.resultView
                  && bosearchview.resultView.collection
                  && bosearchview.resultView.collection.searchedParams) {
                // if we already have a result, get values for search fields from there
                var searchData = bosearchview.searchView.searchForm.model.get("data"),
                    keysSearchData = _.keys(searchData),
                    searchedParams = bosearchview.resultView.collection.searchedParams,
                    nsearchData = keysSearchData.length,
                    nsearchedParams = _.keys(searchedParams).length,
                    matchKeyCount = _.reduce(searchData,function(count,val,key){
                      return (key in searchedParams) ? count + 1 : count;
                    },0);
                // but do this only if at least half of the keys from last search exist in new
                // search form as well. Otherwise we consider both as too different and showing
                // the last result for the new search form looks strange.
                // but in case of zero search fields we have to check the plain difference between
                // last and current search fields
                if (( matchKeyCount>0 && matchKeyCount>=keysSearchData.length/2 ) || ( nsearchData === nsearchedParams) ) {
                  // extend search data an render search form with it
                  _.extend(searchData,_.pick(searchedParams,keysSearchData));
                  if (bosearchview.resultView.resultTable) {
                    var row_id = bosearchview.model.get("row_id");
                    if (row_id && bosearchview.resultView.resultTable.collection.get(row_id)) {
                      bosearchview.resultView.resultTable.setSelection([row_id]);
                    } else {
                      bosearchview.resultView.resultTable.clearSelection();
                    }
                  }
                } else {
                     var oColl = bosearchview.resultView.collection;
                     delete bosearchview.resultView.collection;
                     if (oColl){
                       oColl.stopListening();
                       bosearchview.resultView.stopListening(oColl);
                     }
                  bosearchview.resultView.render();
                }
              }
              bosearchview.searchView.searchForm.render();
              bosearchview.searchView.searchForm.$el.show();
            }, function() {
              bosearchview.searchView.searchForm.$el.show();
            });
      }
    }

  });

  _.extend(BusinessObjectSearchView.prototype, LayoutViewEventsPropagationMixin);

  return BusinessObjectSearchView;
});




/**
 * Created by stefang on 05.04.2016.
 */
csui.define('xecmpf/controls/bosearch/bosearch.dialog.controller',['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'xecmpf/controls/bosearch/bosearch.view'
], function (require, $, _,
    Marionette,
    BoSearchView
) {

  var BoSearchDialogController = Marionette.Controller.extend({
    
    constructor: function BoSearchDialogController(options) {
      Marionette.Controller.prototype.constructor.apply(this, arguments);

      this.listenTo(this.options.boSearchModel,"reference:search",this._referenceSearchOpen);
      this.listenTo(this.options.boSearchModel, "boresult:select", this._boresultSelect);
      this.listenTo(this.options.boSearchModel,"reference:selected",this._referenceSelected);
      this.listenTo(this.options.boSearchModel,"reference:rejected",this._referenceRejected);
      this.listenTo(this.options.boSearchModel,"bosearch:cancel",this._referenceSearchCanceled);
    },

    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _referenceSearchOpen: function () {
      this._showSearchView();
    },

    _boresultSelect: function () {
      this._showModalContent(); // also shows blocking circle
    },

    _referenceSelected: function () {
      this._hideSearchView();
    },

    _referenceRejected: function () {
      this._hideModalContent();
    },

    _referenceSearchCanceled: function () {
      this._showModalContent();
      this._hideSearchView();
    },

    _hideSearchView : function() {
      if (this.options.mode==="workspace_reference_edit") {
        this.bosearchview.$el.parent().removeClass('cs-item-action-metadata');
      }
      if (this.options.mode==="business_attachment_add") {
        this.bosearchview.$el.parent().removeClass('cs-item-action-metadata');
      }
      this.modalcontent.removeClass('conws-bosearch-showing');
      this.bosearchview.$el.detach();
    },

    _showModalContent: function() {
      if (this.options.mode==="workspace_reference_create") {
        this.modalcontent.find(">.binf-modal-header .cs-close").show();
        this.modalcontent.find(">.binf-modal-body").show();
        this.modalcontent.find(">.binf-modal-footer").show();
      }
      if (this.options.mode==="workspace_reference_edit") {
        this.modalcontent.find(">.metadata-content-wrapper").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").show();
      }
      if (this.options.mode==="business_attachment_add" ) {
        this.modalcontent.find(">.metadata-content-wrapper").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").show();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").show();
      }
    },

    _hideModalContent: function () {
      if (this.options.mode==="workspace_reference_create") {
        this.modalcontent.find(">.binf-modal-header .cs-close").hide();
        this.modalcontent.find(">.binf-modal-body").hide();
        this.modalcontent.find(">.binf-modal-footer").hide();
      }
      if (this.options.mode==="workspace_reference_edit") {
        this.modalcontent.find(">.metadata-content-wrapper").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").hide();
      }
      if (this.options.mode==="business_attachment_add" ) {
        this.modalcontent.find(">.metadata-content-wrapper").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-sidebar .cs-content").hide();
        this.modalcontent.find(">.metadata-wrapper .metadata-content .metadata-content-wrapper").hide();
      }
    },

    _showSearchView : function() {
      
      var options = this.options || {};
      
      this.modalcontent = $(this.options.htmlPlace);
      this.modalcontent.addClass('conws-bosearch-beforeshow');

      //if (this.bosearchview) {
        // in order to show last search result, after it was already searched for in the dialog,
        // do not delete view, just show it. it is registered on the event too and updates itself.
        // this.bosearchview.destroy();
        // delete this.bosearchview;
      //}
      if (!this.bosearchview) {
        this.bosearchview = new BoSearchView({
          model: this.options.boSearchModel,
          context: this.options.context,
          multipleSelect: this.options.multipleSelect,
          disableItemsWithWorkspace: this.options.disableItemsWithWorkspace,
          title: this.options.title
        });
        this.bosearchview.render();
        this.bosearchview.$el.addClass(this.options.mode);
        if (this.options.mode==="workspace_reference_create") {
          this.bosearchview.$el.addClass('csui-content-without-header');
        }
        if (this.options.mode==="workspace_reference_edit") {
          this.bosearchview.$el.addClass('csui-content-without-header');
          this.bosearchview.$el.find('>*').addClass('binf-modal-content');
        }
        if (this.options.mode==="business_attachment_add") {
          this.bosearchview.$el.addClass('csui-content-without-header');
          this.bosearchview.$el.find('>*').addClass('binf-modal-content');
          // SAPRM-9320:
          // space for attach button is dependent from metadata mapping of bus. attachment
          //this.bosearchview.$el.find('.conws-boresultlist').addClass('conws-with-attachbtn');
        }
      }

      this.modalcontent.append(this.bosearchview.$el);
      if (this.options.mode==="workspace_reference_edit") {
        this.bosearchview.$el.parent().addClass('cs-item-action-metadata');
      }
      if (this.options.mode==="business_attachment_add") {
        this.bosearchview.$el.parent().addClass('cs-item-action-metadata');
      }
      
      // read a property, so browser updates DOM and element is at start position
      this.bosearchview.$el.position();

      this.bosearchview.triggerMethod('dom:refresh');

      var that = this;
      this.bosearchview.$el.one(this._transitionEnd(), function () {
        that.modalcontent.removeClass("conws-bosearch-animating");
        that.modalcontent.addClass('conws-bosearch-showing');
        that._hideModalContent();
      });
      this.modalcontent.addClass('conws-bosearch-animating');
      this.modalcontent.removeClass('conws-bosearch-beforeshow');
    }

  });

  return BoSearchDialogController;
});





/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/property.panels/reference/impl/reference.panel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"conws-reference-override-note\">"
    + this.escapeExpression(((helper = (helper = helpers.override_note || (depth0 != null ? depth0.override_note : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"override_note","hash":{}}) : helper)))
    + "</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"conws-reference-panel binf-row alpaca-field\">\r\n  <div class=\"alpaca-container-label\">\r\n    <h3>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h3>\r\n  </div>\r\n  <div class=\"conws-reference-initial\">\r\n  </div>\r\n  <div class=\"conws-reference-replace\">\r\n  </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.change_reference : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_property.panels_reference_impl_reference.panel', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/property.panels/reference/impl/reference.panel-initial',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"conws-label-search\">"
    + this.escapeExpression(((helper = (helper = helpers.search_button_label || (depth0 != null ? depth0.search_button_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"search_button_label","hash":{}}) : helper)))
    + "</div>\r\n  <button type=\"button\" class=\"binf-btn binf-btn-default search\">"
    + this.escapeExpression(((helper = (helper = helpers.search_button_title || (depth0 != null ? depth0.search_button_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"search_button_title","hash":{}}) : helper)))
    + "</button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div  class=\"conws-reference-override-note\">"
    + this.escapeExpression(((helper = (helper = helpers.cannot_complete_business_reference || (depth0 != null ? depth0.cannot_complete_business_reference : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cannot_complete_business_reference","hash":{}}) : helper)))
    + "</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.complete_reference : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_controls_property.panels_reference_impl_reference.panel-initial', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/property.panels/reference/impl/reference.panel-replace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"conws-reference-buttons\">\r\n    <div class=\"conws-label-buttons\">"
    + this.escapeExpression(((helper = (helper = helpers.reference_buttons_label || (depth0 != null ? depth0.reference_buttons_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reference_buttons_label","hash":{}}) : helper)))
    + "</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.allow_remove_reference_from_create : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n    <button type=\"button\" class=\"binf-btn binf-btn-default replace\">"
    + this.escapeExpression(((helper = (helper = helpers.replace_button_title || (depth0 != null ? depth0.replace_button_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"replace_button_title","hash":{}}) : helper)))
    + "</button>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.allow_remove_reference_from_edit : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "      <button type=\"button\" class=\"binf-btn binf-btn-default remove\">"
    + this.escapeExpression(((helper = (helper = helpers.remove_button_title || (depth0 != null ? depth0.remove_button_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"remove_button_title","hash":{}}) : helper)))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"conws-reference-metadata\"></div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.change_reference : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_controls_property.panels_reference_impl_reference.panel-replace', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/controls/property.panels/reference/impl/reference.panel',[],function(){});
csui.define('xecmpf/controls/property.panels/reference/impl/reference.panel.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/utils/log',
  'csui/controls/form/form.view',
  'csui/utils/base',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/controls/bosearch/bosearch.model',
  'xecmpf/controls/bosearch/bosearch.dialog.controller',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/globalmessage/globalmessage',
  'hbs!xecmpf/controls/property.panels/reference/impl/reference.panel',
  'hbs!xecmpf/controls/property.panels/reference/impl/reference.panel-initial',
  'hbs!xecmpf/controls/property.panels/reference/impl/reference.panel-replace',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang',
  'css!xecmpf/controls/property.panels/reference/impl/reference.panel'
], function (_, $, Backbone, Marionette, Alpaca, log, FormView,
    base, ModalAlert,
    BoSearchModel,
    BoSearchDialogController,
    TabableRegionBehavior, GlobalMessage, template, initialtmpl, replacetmpl, lang) {
  'use strict';

  var ReferenceInitialView = Marionette.ItemView.extend({

    className  : "conws-reference reference-initial",

    template   : initialtmpl,

    constructor: function ReferenceInitialView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      searchButton: '.binf-btn.search'
    },

    triggers: {
      "click .binf-btn.search": "referencetab:search"
    },

    templateHelpers: function () {
      var bo_ref = this.options.actionContext.workspaceReference,
          bo_type_name = bo_ref && bo_ref.get("bo_type_name"),
          ext_system_name = bo_ref && bo_ref.get("ext_system_name");
      return {
        search_button_label: _.str.sformat(lang.referenceSearchButtonLabel,bo_type_name,ext_system_name),
        search_button_title: lang.referenceSearchButtonTitle,
        complete_reference: bo_ref.get("complete_reference"),
        cannot_complete_business_reference: lang.cannotCompleteBusinessReference
      };
    }
  });

  var ReferenceReplaceView = Marionette.LayoutView.extend({

    className  : "conws-reference reference-replace",

    template   : replacetmpl,

    constructor: function ReferenceReplaceView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      replaceButton: '.binf-btn.replace'
    },

    triggers: {
      "click .binf-btn.remove" : "referencetab:remove",
      "click .binf-btn.replace": "referencetab:replace"
    },

    regions: {
      metadataRegion: '.conws-reference-metadata'
    },

    templateHelpers: function () {
      var bo_ref = this.options.actionContext.workspaceReference,
          bo_type_name = bo_ref && bo_ref.get("bo_type_name"),
          ext_system_name = bo_ref && bo_ref.get("ext_system_name");
      return {
        allow_remove_reference_from_create: this.options.actionContext.mode==="workspace_reference_create",
        allow_remove_reference_from_edit: this.options.actionContext.mode==="workspace_reference_edit",
        remove_button_title: lang.referenceRemoveButtonTitle,
        replace_button_title: lang.referenceReplaceButtonTitle,
        reference_buttons_label: _.str.sformat(lang.referenceSearchButtonLabel,bo_type_name,ext_system_name),
        change_reference: bo_ref.get("change_reference")
      };
    },

    onRender: function() {
      var formData, formOptions, formSchema;
      if (this.options.actionContext.mode==="workspace_reference_create") {
        formData = this.options.actionContext.workspaceReference.get("data") || {};
        formOptions = this.options.actionContext.workspaceReference.get("options") || {};
        formSchema = this.options.actionContext.workspaceReference.get("schema") || {};
      }
      if (this.options.actionContext.mode==="workspace_reference_edit") {
        formData = {BOID:this.options.actionContext.workspaceReference.get("bo_id")};
        formOptions = {
          fields: {
            BOID:{}
          }
        };
        formSchema = {
          properties: {
            BOID:{
              readonly: true,
              required: false,
              title: lang.businessObjectIdLabel,
              type: "string"
            }
          }
        };
      }
      if (formData && formOptions && formSchema) {
        this.formModel = new Backbone.Model({data:formData,options:formOptions,schema:formSchema});
        this.metdataForm = new FormView({model: this.formModel, context: this.options.context});
        this.metadataRegion.show(this.metdataForm);
      }
    }
  });

  var ReferencePanelView = Marionette.LayoutView.extend({

    className: 'conws-reference reference-panel cs-form cs-form-create',

    template: template,

    regions: {
      initialRegion: '.conws-reference-initial',
      replaceRegion: '.conws-reference-replace'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function ReferencePanelView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      // if reference panel is not destroyed, when closing the create dialog, we do it here.
      if (this.options.actionContext.referencePanelView) {
        this.options.actionContext.referencePanelView.destroy();
      }
      this.options.actionContext.referencePanelView = this;

      var viewContext, anchor;
      if (this.options.mode==="create") {
        this.options.actionContext.mode = "workspace_reference_create";
        viewContext = this.options.metadataView;
        var forms = options && options.fetchedModels,
            formCollection = forms && forms.formCollection,
            formOptions = formCollection && formCollection.options,
            addItemController = formOptions && formOptions.metadataAddItemController,
            dialog = addItemController && addItemController.dialog;
        // as agreed with csui team get dialog from controller and from there get the overlay area
        anchor = dialog && dialog.$(".binf-modal-content");
      } else if (this.options.mode==="update") {
        this.options.actionContext.mode = "workspace_reference_edit";
        if (this.options.metadataView && this.options.metadataView.options.metadataNavigationView) {
          viewContext = this.options.metadataView.options.metadataNavigationView;
        } else {
          viewContext = this.options.metadataView;
        }
          // SAPRM-9072. Removed .cs-perspective-panel from css selector. This panel is not available
          // in integration scenarios.
          anchor = ".cs-metadata:has(> .metadata-content-wrapper)";
      }
      if (viewContext!==this.options.actionContext.viewContext) {
        delete this.options.actionContext.boSearchModel;
        delete this.options.actionContext.boSearchDialogController;
        this.options.actionContext.viewContext = viewContext;
      }

      var bo_ref = this.options.actionContext.workspaceReference;
      if (!this.options.actionContext.boSearchModel) {
        this.options.actionContext.boSearchModel = new BoSearchModel({
          bo_type_id: bo_ref.get("bo_type_id"),
          bo_type_name: bo_ref.get("bo_type_name"),
          row_id: bo_ref.get("row_id")
        });
      } else {
        this.options.actionContext.boSearchModel.set({
          bo_type_id: bo_ref.get("bo_type_id"),
          bo_type_name: bo_ref.get("bo_type_name"),
          row_id: bo_ref.get("row_id")
        });
      }

      if (!this.options.actionContext.boSearchDialogController) {
        this.options.actionContext.boSearchDialogController = new BoSearchDialogController({
          mode: this.options.actionContext.mode,
          context: this.options.context,
          htmlPlace: anchor,
          boSearchModel: this.options.actionContext.boSearchModel,
          disableItemsWithWorkspace: true
        });
      } else {
        this.options.actionContext.boSearchDialogController.options.mode = this.options.actionContext.mode;
        this.options.actionContext.boSearchDialogController.options.htmlPlace = anchor;
      }

      this.listenTo(this.options.actionContext.boSearchModel, "boresult:select", this._replaceReference);
      this.listenTo(this.options.actionContext.boSearchModel, "bosearch:cancel", this._cancelSearch );
      this.listenTo(this.options.actionContext.boSearchModel, "change:bo_type_name", _.bind(function(){
        this.options.actionContext.workspaceReference.set("by_type_name",this.options.actionContext.boSearchModel.get("bo_type_name"));
        this.render();
      },this));

      this.listenTo(this.options.actionContext.workspaceReference, "error", function(model, response, options) {
        var isRemoveError = (options && options.invoker && options.invoker === 'remove_bo_ref');
        var errmsg;
        if(isRemoveError) {
          errmsg = response && (new base.Error(response)).message || lang.errorRemovingWorkspaceReference;
          log.error("Removing the workspace reference failed: {0}", errmsg) && console.error(log.last);
        } else {
          errmsg = response && (new base.Error(response)).message || lang.errorUpdatingWorkspaceReference;
          log.error("Updating the workspace reference failed: {0}", errmsg) && console.error(log.last);
        }
        ModalAlert.showError(errmsg);
      });

      this.listenTo(options.originatingView, "render:forms",this._formsRendered);
      if (this.options.actionContext.mode==="workspace_reference_create") {
        this.options.actionContext.scrollToPanel = true;
        this.options.actionContext.focusButton = true;
      }

      // The below block actions must be actually in the bosearch.view.
      // But the issue there is that the spinning circle is shown below the
      // bosearch content rather than over it.
      this.listenTo(this.options.actionContext.boSearchModel, "boresult:select", function () {
        this.options.originatingView.blockActions && this.options.originatingView.blockActions();
        })
        .listenTo(this.options.actionContext.boSearchModel, "reference:selected", function () {
          this.options.originatingView.unblockActions && this.options.originatingView.unblockActions();
        })
        .listenTo(this.options.actionContext.boSearchModel, "reference:rejected", function () {
          this.options.originatingView.unblockActions && this.options.originatingView.unblockActions();
        });
    },

    onDestroy: function () {
      //console.log("ReferencePanelView destroy called ",this.cid);
      if (this===this.options.actionContext.referencePanelView) {
        delete this.options.actionContext.referencePanelView;
      }
    },

    templateHelpers: function () {
      return {
        title: lang.referenceTabTitle,
        override_note: lang.referencePanelOverrideNote,
        change_reference:this.options.actionContext.workspaceReference.get("change_reference")
      };
    },

    currentlyFocusedElement: function () {
      //console.log("currently focused element of",this.cid,"count",this.$el.find('button').length);
      //return this.$el.find('button');
      var el;
      if (this.options.actionContext.workspaceReference.get("bo_id")) {
        el = this.replaceView && this.replaceView.ui.replaceButton;
      } else {
        el = this.initialView && this.initialView.ui.searchButton;
      }
      if (el&&el.attr&&el.prop) {
        log.debug("currently focused element of {0} count {1} class {2}",this.cid,el?el.length:"no el",el.attr('class')) && console.log(log.last);
        return el;
      } else {
        return undefined;
      }
    },

    // The view is rendered whenever the model changes.
    onRender: function () {
      // LayoutView destroys views on rendering, so we must create them every time on rendering
      if (this.options.actionContext.workspaceReference.get("bo_id")) {
        delete this.initialView;
        this.replaceView = new ReferenceReplaceView(this.options);
        this.listenTo(this.replaceView, "referencetab:remove", this._removeReference);
        this.listenTo(this.replaceView, "referencetab:replace", this._triggerSearch);
        this.replaceRegion.show(this.replaceView);
      } else {
        delete this.replaceView;
        this.initialView = new ReferenceInitialView(this.options);
        this.listenTo(this.initialView, "referencetab:search", this._triggerSearch);
        this.initialRegion.show(this.initialView);
      }
    },

    _triggerSearch : function() {
      log.debug("trigger reference:search") && console.log(log.last);
      this.options.actionContext.boSearchModel.trigger("reference:search");
    },

    _removeReference : function() {
      log.debug("clear reference") && console.log(log.last);
      if (this.options.actionContext.mode === "workspace_reference_create") {
        this._refetchForms({
          "data":undefined,
          "options":{},
          "schema":{},
          "bo_id":undefined,
          "row_id":undefined
        });
      } else if (this.options.actionContext.mode === "workspace_reference_edit") {
        var self = this;
        var deferred = $.Deferred();
        // Ask if the user agrees to proceed right now or not
        ModalAlert.confirmQuestion(_.str.sformat(lang.removeBOReferenceAlertDescription, this.options.actionContext.workspaceReference.get('bo_id')),
          lang.removeBOReferenceAlertTitle)
        .done(function (result) {
          var bo_ref = self.options.actionContext.workspaceReference;
          bo_ref.destroy({wait: true, invoker: 'remove_bo_ref'})
          .done(function (data, status) {
            GlobalMessage.showMessage('success', lang.removeBOReferenceSuccessMessage);
            self.options.actionContext.viewContext.triggerMethod("metadata:close");
            deferred.resolve();
          })
          .fail(function (data, status, error) {
            deferred.reject(data.responseJSON.error);
          });
          return deferred.promise();
        });
      }
    },

    _cancelSearch : function() {
      this._focusButton({cancelSearch:true});
    },

    _replaceReference : function(selectEventInfo) {
      log.debug("set reference") && console.log(log.last);
      if (selectEventInfo && selectEventInfo.selectedItems
          && selectEventInfo.selectedItems.length>0
          && selectEventInfo.selectedItems[0]) {
        var selectedObject = selectEventInfo.selectedItems[0];
        var formData = {},
            formFields = {},
            formProperties = {},
            collection = selectedObject.collection,
            columnDefinitions =  collection.columns,
            tableColumns = collection.tableColumns,
            sortedColumns = tableColumns.toArray().sort(function(a,b){return a.get("sequence")-b.get("sequence");});
        _.each(sortedColumns,function(tc){
          var key = tc.get("key"),
              col = columnDefinitions.get(key),
              name = col.get("fieldName");
          formData[name] = selectedObject.get(key);
          formFields[name] = {
          };
          formProperties[name] = {
            readonly: true,
            required: false,
            title: col.get("fieldLabel"),
            type: "string"
          };
        });
        this._refetchForms({
          "data":formData,
          "options":{fields:formFields},
          "schema":{properties:formProperties},
          "bo_id":selectedObject.get("businessObjectId"),
          "row_id":selectedObject.get("id")
        }, "select");
      } else {
        this.render();
        this.options.actionContext.boSearchModel.trigger("reference:selected");
        this._scrollToPanel();
        this._focusButton();
      }
    },

    _getAllValues: function () {

      var data = {},
          metadataView = this.options && this.options.metadataView;
      if (metadataView) {
        data = {
          "name": metadataView.metadataHeaderView.getNameValue(),
          "type": metadataView.options.model.get('type'),
          "parent_id": metadataView.options.model.get('parent_id')
        };
        var formsValues = metadataView.metadataPropertiesView.getFormsValues();
        _.extend(data, formsValues);
      }

      return data;
    },

    _refetchForms: function(attributes,mode) {
      // and refetch all forms from server to get default values depending on bo_id
      var self = this,
          bo_ref = this.options.actionContext.workspaceReference,
          bo_id = attributes.bo_id,
          actionContext = this.options.actionContext,
          originatingView = this.options.originatingView,
          forms = this.options.fetchedModels;
      if (actionContext.mode==="workspace_reference_create") {
        var formCollection = forms.formCollection;
        if (bo_id) {
          formCollection.bo_type_id = bo_ref.get("bo_type_id");
          formCollection.bo_id = bo_id;
        } else {
          delete formCollection.bo_type_id;
          delete formCollection.bo_id;
        }
        formCollection.formsValues = this._getAllValues();
        formCollection.formsSchema = formCollection.serverForms;
        forms.fetch().then(function () {
              // on success, set attributes and options for actions after rendering
              bo_ref.set(attributes);
              if (mode === "select") {
                originatingView.once("render:forms", function () {
                  self.options.actionContext.boSearchModel.trigger("reference:selected");
                });
              }
              actionContext.scrollToPanel = true;
              actionContext.focusButton = true;
            },
            function () {
              //in case of error do not set attributes. bo_ref.set(attributes);
              if (mode === "select") {
                self.options.actionContext.boSearchModel.trigger("reference:rejected");
              }
            }
        );
      } else if (actionContext.mode==="workspace_reference_edit") {
        var bo_id_old = bo_ref.get("bo_id"),
            node = this.options.node;
        bo_ref.set("bo_id", bo_id);
        bo_ref.save({}, {wait:true})
            .then(function() {
              node.fetch().then(function(){
                    forms.fetch().then(function(){
                          bo_ref.set(attributes);
                          if (mode==="select") {
                            originatingView.once("render:forms", function () {
                              self.options.actionContext.boSearchModel.trigger("reference:selected");
                            });
                          }
                          actionContext.scrollToPanel = true;
                          actionContext.focusButton = true;
                        },
                        function () {
                          //in case of error do not set attributes. bo_ref.set(attributes);
                          bo_ref.set("bo_id",bo_id_old);
                          if (mode==="select") {
                            self.options.actionContext.boSearchModel.trigger("reference:rejected");
                          }
                        });
                  },
                  function () {
                    //in case of error do not set attributes. bo_ref.set(attributes);
                    bo_ref.set("bo_id",bo_id_old);
                    if (mode==="select") {
                      self.options.actionContext.boSearchModel.trigger("reference:rejected");
                    }
                  });
            }, function() {
              // on error: restore to state before save
              bo_ref.set("bo_id",bo_id_old);
              if (mode==="select") {
                self.options.actionContext.boSearchModel.trigger("reference:rejected");
              }
            });
      } else {
        bo_ref.set(attributes);
        this.render();
        if (mode==="select") {
          self.options.actionContext.boSearchModel.trigger("reference:selected");
        }
        this._scrollToPanel();
        this._focusButton();
      }
    },

    // scroll panel to be visible
    _scrollToPanel: function() {
      var originatingView = this.options && this.options.originatingView,
          tabLinks = originatingView && originatingView.tabLinks;
      if (tabLinks) {
        var refLink;
        tabLinks.children.each(function (tabLink) {
          if (tabLink.model.id === "conws-reference") {
            refLink = tabLink;
          }
        });
        if (refLink) {
          refLink.activate();
        }
      }
    },

    // set focus on buttton, if desired
    _focusButton: function(eventOptions) {
      var metadataView = this.options && this.options.metadataView,
          headerView = metadataView && metadataView.metadataHeaderView,
          nameView = headerView && headerView.metadataItemNameView;
      if (!nameView || nameView.readonly || nameView.model && nameView.model.get("name") ||
          (eventOptions && eventOptions.cancelSearch)) {
        if (this.options.actionContext.workspaceReference.get("bo_id")) {
          var butn;
          if (this.replaceView) {
            butn = $(this.replaceView.ui.replaceButton);
            butn.trigger("focus");
          }
        } else {
          if (this.initialView) {
            butn = $(this.initialView.ui.searchButton);
            butn.trigger("focus");
          }
        }
        var originatingView = this.options.originatingView,
            href = originatingView.$el.find("div[id='conws-reference']");
        if (href && href.length > 0) {
          var hrefTop = href[0].offsetTop;
          if (butn && butn.length>0) {
            var butnTop = butn[0].offsetTop;
            var butnHeight = butn.height();
            var panelHeight = originatingView.tabContent.$el.height();
            // adjust only, if button is not visible anyway
            if (butnTop+butnHeight>hrefTop+panelHeight) {
              var extraTopOffset = Math.max(originatingView.getOption('extraScrollTopOffset')||0,5);
              var scrollTop = butnTop + butnHeight - panelHeight + extraTopOffset;
              // var curScrollTop = originatingView.tabContent.$el.scrollTop();
              // console.log("changing scrollTop from "+curScrollTop+" to "+scrollTop);
              originatingView.tabContent.$el.animate({scrollTop:scrollTop},300);
            }
          }
        }
      } else {
        nameView.setEditModeFocus();
      }
    },

    _formsRendered: function() {
      if (this.options.actionContext.scrollToPanel) {
        delete this.options.actionContext.scrollToPanel;
        this._scrollToPanel();
      }
      if (this.options.actionContext.focusButton) {
        delete this.options.actionContext.focusButton;
        this._focusButton();
      }
    },

    // This view is displayed also during the node creation;
    // because a form view is expected, this view implements a partial FormView interface too

    validate: function () {
      return true;
    },

    getValues: function () {
      // These values will be merged into the creational object posted
      // to the server; if the model has 'role_name' property defined,
      // the properties will be posted nested in that role

      return {
        bo_id: this.options.actionContext.workspaceReference.get("bo_id"),
        bo_type_id: this.options.actionContext.workspaceReference.get("bo_type_id")
      };
    },

    hideNotRequired: function(hide) {
      return true;
    }

  });

  return ReferencePanelView;

});

csui.define('xecmpf/widgets/boattachments/impl/boattachments.factory',['module', 'csui/lib/underscore',  'csui/lib/jquery', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'xecmpf/widgets/boattachments/impl/boattachments.model',
    'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory'

], function (module, _, $, Backbone,
             CollectionFactory,
             NodeModelFactory,
             BOAttachmentCollection,
             AttachmentContextBusinessObjectInfoFactory) {

    var BOAttachmentCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'boAttachments',

        constructor: function BOAttachmentCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var boAttachments = this.options.boAttachments || {};
            if (!(boAttachments instanceof Backbone.Collection)) {

                this.property = new BOAttachmentCollection(boAttachments.models, _.extend({
                    context: context,
                    node: context.getModel(NodeModelFactory, options),
                }, boAttachments.options, module.config().options, {
                    autoreset: true
                }, options));
            }
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return BOAttachmentCollectionFactory;

});


csui.define('xecmpf/widgets/boattachments/impl/boattachment.table/toolbaritems',[
    'module',
    "csui/controls/toolbar/toolitem.model",
    'csui/controls/toolbar/toolitems.factory',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
], function (module, ToolItemModel, ToolItemsFactory, lang, _lang) {

    var toolbarItems = {

        tableHeaderToolbar: new ToolItemsFactory({
                main: [
                    {signature: "Snapshot", name: lang.CommandSnapshot}
                ]
            },
            {
                maxItemsShown: 15,
                dropDownIcon: "icon icon-toolbar-more"
            })
    };

    return toolbarItems;

});

csui.define('xecmpf/widgets/boattachments/impl/boattachment.table/boattachments.columns',["csui/lib/backbone",
    "i18n!xecmpf/widgets/boattachments/impl/nls/lang"], function (Backbone, lang) {

    var TableColumnModel = Backbone.Model.extend({

        defaults: {
            key: null,  // key from the resource definitions
            sequence: 0 // smaller number moves the column to the front
        }

    });

    var TableColumnCollection = Backbone.Collection.extend({

        model: TableColumnModel,
        comparator: "sequence",
        // modelId: "key",

        getColumnKeys: function () {
            return this.pluck('key');
        },

        deepClone: function () {
            return new TableColumnCollection(
                this.map(function (column) {
                    return column.attributes;
                }));
        }

    });

    // sequence:
    // 1-100: Fixed columns
    // 500-600: Dynamic columns (custom columns in widget configuration)
    // 900-1000: Special columns at the end (favorite, like, comment)
    // Hint: if the sequence of 'name' column is changed, the focused column in workspacestable.view
    // should be also adapted with the new id.
    // Current state is tableView.accFocusedState.body.column = 1

    var tableColumns = new TableColumnCollection([
        {
            key: 'type',
            permanentColumn: true,
            sequence: 10
        },
        {
            key: 'name',
            permanentColumn: true,
            sequence: 20
        },
        {
            key: 'parent_id',
            title: lang.parent_id,
            permanentColumn: true,
            sequence: 30
        },
        {
            key: 'reserved',
            sequence: 40,
            noTitleInHeader: true,
            permanentColumn: true,
        },
        {
            key: 'modify_date',
            permanentColumn: true,
            sequence: 50
        },
        {
            key: 'version',
            sequence: 60
        },
        {
            key: 'size',
            sequence: 70
        },
        {
            key: 'create_date',
            sequence: 80
        },
        {
            key: 'createdby',
            sequence: 90
        },
        {
            key: 'modifiedby',
            sequence: 100
        },
        {
            key: 'favorite',
            sequence: 910,
            noTitleInHeader: true, // don't display a column header
            permanentColumn: true // don't wrap column due to responsiveness into details row
        }
    ]);

    return tableColumns;

});

/**
 * Created by giddamr on 3/23/2018.
 */
csui.define('xecmpf/widgets/boattachments/impl/headertoolbaritems',[
  'csui/controls/toolbar/toolitems.factory',
  'i18n!xecmpf/widgets/boattachments/impl/nls/lang'
], function (ToolItemsFactory, lang) {

  var headerToolbarItems = {
    AddToolbar: new ToolItemsFactory({
          main: [
            {
              signature: "BOAttachmentsCreate",
              name: lang.addBusinessAttachment,
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 1,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return headerToolbarItems;

});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/dialogheader/impl/dialogheader',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"cs-close\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.dialogCloseButtonTooltip || (depth0 != null ? depth0.dialogCloseButtonTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dialogCloseButtonTooltip","hash":{}}) : helper)))
    + "\">\r\n    <div class=\"icon circular "
    + this.escapeExpression(((helper = (helper = helpers.iconRight || (depth0 != null ? depth0.iconRight : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconRight","hash":{}}) : helper)))
    + "\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaDialogClose || (depth0 != null ? depth0.ariaDialogClose : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaDialogClose","hash":{}}) : helper)))
    + "\"\r\n         role=\"button\"></div>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"left-section\"></div>\r\n<div class=\"center-section\"></div>\r\n<div class=\"right-section\"></div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hideDialogClose : depth0),{"name":"if","hash":{},"fn":this.noop,"inverse":this.program(1, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_controls_dialogheader_impl_dialogheader', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/controls/dialogheader/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/controls/dialogheader/impl/nls/root/lang',{
  dialogCloseButtonTooltip: 'Close',
  ariaDialogClose: 'Close dialog'
});



csui.define('css!xecmpf/controls/dialogheader/impl/dialogheader',[],function(){});
csui.define('xecmpf/controls/dialogheader/dialogheader.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!xecmpf/controls/dialogheader/impl/dialogheader',
  'i18n!xecmpf/controls/dialogheader/impl/nls/lang',
  'css!xecmpf/controls/dialogheader/impl/dialogheader'
], function (_, $, Backbone, Marionette, TabableRegion, template, lang) {

  var DialogHeaderView = Marionette.LayoutView.extend({

    className: 'xecmpf-header',
    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    regions: {
      LeftRegion: '.left-section',
      CenterRegion: '.center-section',
      RightRegion: '.right-section'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    templateHelpers: function () {
      return {
        iconRight: !!this.options.iconRight ? this.options.iconRight : 'cs-icon-cross',
        dialogCloseButtonTooltip: lang.dialogCloseButtonTooltip,
        ariaDialogClose: lang.ariaDialogClose,
        hideDialogClose: this.options.hideDialogClose ? this.options.hideDialogClose : false
      };
    },

    constructor: function DialogHeaderView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    onRender: function (){
      var leftView = this.options.leftView,
          centerView = this.options.centerView,
          rightView = this.options.rightView;

      if (leftView) {
        this.LeftRegion.show(leftView);
      }

      if (centerView) {
        this.CenterRegion.show(centerView);
      }

      if (rightView) {
        this.RightRegion.show(rightView);
      }
    },

    isTabable: function () {
      return this.$('*[tabindex]').length > 0;
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    onLastTabElement: function (shiftTab, event) {
      // return true if focus is on last tabable element else false.
      return (shiftTab && event.target === this.$('*[tabindex]')[0]);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;

      //Enter/space
      if (keyCode === 13 || keyCode === 32) {
        $(event.target).trigger("click");
      }
    }

  });

  return DialogHeaderView;

});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/headertoolbar/impl/headertoolbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"filter-toolbar\"></div>\r\n<div class=\"add-toolbar\"></div>\r\n<div class=\"other-toolbar\"></div>";
}});
Handlebars.registerPartial('xecmpf_controls_headertoolbar_impl_headertoolbar', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/controls/headertoolbar/impl/headertoolbar',[],function(){});
csui.define('xecmpf/controls/headertoolbar/headertoolbar.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!xecmpf/controls/headertoolbar/impl/headertoolbar',
  'css!xecmpf/controls/headertoolbar/impl/headertoolbar'
], function (_, $, Backbone, Marionette, FilteredToolItemsCollection, ToolbarView,
    ToolbarCommandController, template) {

  var HeaderToolbarView = Marionette.LayoutView.extend({
    className: 'xecmpf-header-toolbar',

    template: template,

    regions: {
      FilterToolbarRegion: '.filter-toolbar',
      AddToolbarRegion: '.add-toolbar',
      OtherToolbarRegion: '.other-toolbar'
    },

    constructor: function HeaderToolbarView(options) {
      this.commands = options.commands;
      this.commandController = options.commandController ? options.commandController :
                               new ToolbarCommandController({
                                 commands: this.commands
                               });
      this.originatingView = options.originatingView ? options.originatingView : this;

      this.context = options.context;
      this.nodes = options.selectedNodes;
      this.container = options.container;
      this.collection = options.collection;
      this.addableTypes = options.addableTypes;

      this.toolbarNames = ['Filter', 'Add', 'Other'];
      this.toolbarItems = options.toolbarItems || [];

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      var status = {
        context: this.context,
        nodes: this.selectedNodes,
        container: this.container,
        collection: this.collection,
        originatingView: this.originatingView,
        data: {
          addableTypes: this.addableTypes
        }
      };

      _.each(this.toolbarNames, function (toolbarName) {
        var fullToolbarName = toolbarName + 'Toolbar',
            toolItemFactory = this.toolbarItems[fullToolbarName];

        // create toolbar only if toolbar items (toolItemFactory) is defined
        if (toolItemFactory) {
          _.any(toolItemFactory.collection.models, function (model) {
            if (model.attributes.signature === 'disabled') {
              toolItemFactory.collection.remove(model);
              return true;
            }
          });

          var filteredCollection = new FilteredToolItemsCollection(
              toolItemFactory, {
                status: status,
                commands: this.commandController.commands
              });

          // create toolbar view
          var toolbarView = new ToolbarView(_.extend({
            collection: filteredCollection,
            toolbarName: toolbarName,
            originatingView: this.originatingView
          }, toolItemFactory.options));
          this[toolbarName + 'ToolbarView'] = toolbarView;

          // attach event listener for clicked toolbar items
          this.listenTo(toolbarView, 'childview:toolitem:action',
              this._toolbarItemClicked);
        }
      }, this);

    },

    onRender: function () {
      // call show on each toolbar region with the associated view
      _.each(this.toolbarNames, function (toolbarName) {
        // call show of view in region if view is instantiated
        if (this[toolbarName + 'ToolbarView']) {
          this[toolbarName + 'ToolbarRegion'].show(this[toolbarName + 'ToolbarView']);
        }
      }, this);
    },

    // This method is triggered as a nested 'childview:...' event; such
    // events always get the childView as the first argument.
    _toolbarItemClicked: function (toolItemView, args) {
      this.options.toolItemView = toolItemView;
      this.commandController.toolitemClicked(args.toolItem, this.options);
    }

  });

  return HeaderToolbarView;

});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/title/impl/title',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"tile-type-icon\">\r\n    <span class=\"icon title-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></span>\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageUrl : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"tile-type-image "
    + this.escapeExpression(((helper = (helper = helpers.imageClass || (depth0 != null ? depth0.imageClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageClass","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"tile-type-icon tile-type-icon-img\">\r\n        <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageUrl || (depth0 != null ? depth0.imageUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageUrl","hash":{}}) : helper)))
    + "\" alt=\"\" aria-hidden=\"true\">\r\n      </span>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n<div class=\"title-name\">\r\n  <h4 class=\"title-name-block\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h4>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_title_impl_title', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/controls/title/impl/title',[],function(){});
csui.define('xecmpf/controls/title/title.view',[
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'hbs!xecmpf/controls/title/impl/title',
  'css!xecmpf/controls/title/impl/title'
], function (_, $, Backbone, Marionette, template) {

  var TitleView = Marionette.ItemView.extend({

    className: 'title-wrapper',
    template: template,

    templateHelpers: function () {
      return {
        icon: this.options.icon,
        imageUrl: this.options.imageUrl,
        imageClass: this.options.imageClass,
        title: this.options.title
      }
    },

    constructor: function TitleView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  return TitleView;

});



/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"xecmpf-boattachmentstable\">\r\n    <div class=\"xecmpf-alternating-toolbars\">\r\n        <div class=\"xecmpf-widget-table-header\"></div>\r\n        <div id=\"botabletoolbar\" class=\"xecmpf-rowselection-toolbar\"></div>\r\n    </div>\r\n    <div id=\"botableview\"></div>\r\n    <div id=\"bopaginationview\"></div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_boattachments_impl_boattachment.table_boattachmentstable', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable',[],function(){});
csui.define('xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/base',
    'csui/behaviors/default.action/default.action.behavior',
    'csui/utils/contexts/factories/connector',
    'csui/controls/table/table.view', 'csui/controls/pagination/nodespagination.view',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/utils/commands', 'csui/controls/table/rows/description/description.view',
    'xecmpf/widgets/boattachments/impl/boattachment.table/toolbaritems',
    'xecmpf/widgets/boattachments/impl/boattachment.table/boattachments.columns',
    'xecmpf/widgets/boattachments/impl/headertoolbaritems',
    'xecmpf/controls/dialogheader/dialogheader.view',
    'xecmpf/controls/headertoolbar/headertoolbar.view',
    'xecmpf/controls/title/title.view',
    'xecmpf/behaviors/toggle.header/toggle.header.behavior',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'hbs!xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable',
    'css!xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable'
], function (module, $, _, Backbone, Marionette, base,
    DefaultActionBehavior,
    ConnectorFactory,
    TableView, PaginationView,
    ModalAlert,
    LayoutViewEventsPropagationMixin,
    commands, DetailsRowView,
    toolbarItems,
    AttachmentsColumns,
    HeaderToolbarItems,
    HeaderView,
    HeaderToolbarView,
    TitleView,
    ToggleHeaderBehavior,
    lang, template) {

    var config = module.config();

    _.defaults(config, {
        defaultPageSize: 30,
        orderBy: {
            sortColumn: '{name}',
            sortOrder: 'asc'
        }
    });

    var BOAttachmentTableView = Marionette.LayoutView.extend({

        className: 'xecmpf-boattachments-table',

        template: template,

        regions: {
            tableHeaderRegion: '.xecmpf-widget-table-header',
            tableRegion: '#botableview',
            paginationRegion: '#bopaginationview'
        },

        behaviors: {
            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            },
            ToggleHeader: {
                behaviorClass: ToggleHeaderBehavior,
                tableHeader: '.xecmpf-widget-table-header',
                alternatingTableContainer: '.xecmpf-alternating-toolbars',
                tableToolbar: '.xecmpf-rowselection-toolbar'
            }
        },

        constructor: function BOAttachmentTableView(options) {
            options || (options = {});

            _.defaults(options, {
                data: {},
                pageSize: config.defaultPageSize,
                // toolbarItems and toolbarItemsMasks are required by ToggleHeaderBehavior
                toolbarItems: toolbarItems,
                toolbarItemsMasks: {
                    toolbars: {}
                }
            });

            _.defaults(options.data, {
                pageSize: config.defaultPageSize,
                orderBy: config.orderBy
            });

            this.context = options.context;
            this.collection = options.collection;
            this.titleBarIcon = options.titleBarIcon;
            this.title = options.title;
            this.extId = options.extId;
            this.boId = options.boId;
            this.boType = options.boType;

            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            this.propagateEventsToRegions();
        },

        initialize: function (options) {
            this.setHeaderView();
            this.setTableView();
            this.setPagination();

            if (options.collection) {
                this.collection.fetched = false;
            }
        },

        setTableView: function () {
            this.columns = this.collection.columns;
            this.connector = (this.collection.node && this.collection.node.connector) ||
                this.context.getObject(ConnectorFactory);

            // For all columns where sort is true, search must be possible
            var columnsWithSearch = [''];
            _.each(this.columns.models, function (model) {
                // Enable sorting only for string types (e.g. StringField, StringMultiLine, StringPopup)
                // This is required for now, since server does not support other types
                if (model.get('sort') === true && model.get('type') === -1) {
                    columnsWithSearch.push(model.get('column_key'));
                }
            });

            // Add custom columns from widget configuration to displayed columns
            // Don't change WorkspacesColumns!
            var tableColumns = AttachmentsColumns.clone();

            this.tableView = new TableView({
                context: this.options.context,
                haveDetailsRowExpandCollapseColumn: true,
                descriptionRowView: DetailsRowView,
                descriptionRowViewOptions: {
                    firstColumnIndex: 2,
                    lastColumnIndex: 2,
                    showDescriptions: true,
                    collapsedHeightIsOneLine: true
                },
                connector: this.connector,
                collection: this.collection,
                columns: this.columns,
                tableColumns: tableColumns,
                columnsWithSearch: columnsWithSearch,
                selectColumn: true,
                pageSize: this.options.data.pageSize,
                orderBy: this.collection.options.boAttachments.attributes.sortExpanded || this.collection.orderBy,
                nameEdit: false,
                tableTexts: {
                    zeroRecords: lang.noAttachmentsFound
                },
                maxColumnsDisplayed: 10
            });

            this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
                var args = {
                    node: node
                };
                this.trigger('before:defaultAction', args);
                if (!args.cancel) {
                    this.defaultActionController.executeAction(node, {
                        context: this.options.context,
                        originatingView: this
                    }).done(function () {
                        this.trigger('executed:defaultAction', args);
                    }.bind(this));
                }
            });
        },

        setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize
            });
        },

        onRender: function () {
            this.collection.fetch({
                reload: true
            });
            this.tableHeaderRegion.show(this.headerView);
            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);
        },

        onBeforeShow: function () {
            // place overlay
            this._renderTitleIconWaterMark();
        },

        _renderTitleIconWaterMark: function () {
            var titleImgEl = this.$el.find('.tile-type-image img')[0];
      
            if (titleImgEl) {
                $(titleImgEl).after('<span class="csui-icon xecmpf-icon-boattachment-overlay" ' +
                    'title="' + lang.businessAttachments + '"></span>');
            }
        },

        setHeaderView: function () {
            var headerToolbarView = new HeaderToolbarView({
              commands: commands,
              originatingView: this,
              context: this.context,
              collection: this.collection,
              toolbarItems: HeaderToolbarItems,
              data: {
                extId: this.extId,
                boType: this.boType,
                boid: this.boId
              }
            });

            var titleIcon = this.titleBarIcon;
            var titleView = new TitleView({
              imageUrl: titleIcon.src,
              imageClass: titleIcon.cssClass,
              title: this.title
            });

            this.headerView = new HeaderView({
              iconRight: 'icon-tileCollapse',
              leftView: headerToolbarView,
              centerView: titleView
            });
        }
    });

    _.extend(BOAttachmentTableView.prototype, LayoutViewEventsPropagationMixin);

    return BOAttachmentTableView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/boattachments/impl/boattitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reserved_by : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reserved_by_other : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "                  <span class=\"csui-icon icon-reserved_self\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.reserved_by || (depth0 != null ? depth0.reserved_by : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reserved_by","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "                  <span class=\"csui-icon icon-reserved_other\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.reserved_by_other || (depth0 != null ? depth0.reserved_by_other : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reserved_by_other","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <span class=\"xecmpf-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "            <!-- add element to get proper distance to description -->\r\n            <div class=\"xecmpf-description-spacer\"></div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"xecmpf-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    return "                <!-- add element to get proper distance to value -->\r\n                <div class=\"xecmpf-spacer\"></div>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.topRight : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"xecmpf-body\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.value : stack1), depth0))
    + "</div>\r\n";
},"18":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"xecmpf-left\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n";
},"19":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"21":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomLeft : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n";
},"23":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"xecmpf-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(24, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(26, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n";
},"24":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"26":function(depth0,helpers,partials,data) {
    var stack1;

  return "              <span class=\"xecmpf-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.bottomRight : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n";
},"28":function(depth0,helpers,partials,data) {
    return "  <div class=\"xecmpf-attachmentitem-divider\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"xecmpf-attachmentitem-action-area\">\r\n  <a class=\"xecmpf-nostyle\" href=\""
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "\">\r\n    <div class=\"xecmpf-attachmentitem-border\">\r\n        <div class=\"xecmpf-attachmentitem-top\">\r\n            <span class=\"csui-type-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></span>\r\n            <div class=\"xecmpf-title xecmpf-left\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.title : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.topRight : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n\r\n      <div class=\"xecmpf-attachmentitem-center\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n\r\n      <div class=\"xecmpf-attachmentitem-bottom\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.bottomLeft : depth0),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.bottomRight : depth0),{"name":"if","hash":{},"fn":this.program(23, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n    </div>\r\n  </a>\r\n</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.notLastItem : depth0),{"name":"if","hash":{},"fn":this.program(28, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_widgets_boattachments_impl_boattitem', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/boattachments/impl/boattitem',[],function(){});
// Shows a list of workspaces related to the current one
csui.define('xecmpf/widgets/boattachments/impl/boattitem.view',['module', 'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/jquery',
    'csui/behaviors/default.action/default.action.behavior',
    'csui/utils/base',
    'csui/lib/numeral',
    'csui/utils/contexts/factories/user',
    'xecmpf/widgets/boattachments/impl/boattachmentutil',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'hbs!xecmpf/widgets/boattachments/impl/boattitem',
    'css!xecmpf/widgets/boattachments/impl/boattitem'
], function (module, _, Marionette, $,
             DefaultActionBehavior,
             base,
             numeral,
             UserModelFactory,
             BOAttachmentUtil,
             lang,
             itemTemplate) {

    var AttachmentItemView = Marionette.ItemView.extend({

        behaviors: {
            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            }
        },

        constructor: function AttachmentItemView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.user = this.options.context.getModel(UserModelFactory);
        },

        triggers: {
            'click .xecmpf-attachmentitem-border': 'click:item'
        },

        onClickItem: function () {
            this.triggerMethod('execute:defaultAction', this.model);
        },

        className: 'xecmpf-attachmentitem-object clearfix',
        template: itemTemplate,
        _checkValue: function(obj) {
            return (!_.isUndefined(obj.value) && !_.isNull(obj.value)?true:false)
        },
        _convValueToString: function(obj) {
            !_.isString(obj.value) && (obj.value = obj.value+"");
            return obj;
        },
        serializeData: function () {
            var allval = this._getObject(this.options.data || {});

            // prepare values
            var values = {};

            // take only values we want
            allval.title && (values.title = allval.title);
            allval.description && (values.description = allval.description);
            allval.topRight && this._checkValue(allval.topRight) && (values.topRight = this._convValueToString(allval.topRight));
            allval.bottomLeft && this._checkValue(allval.bottomLeft) && (values.bottomLeft = this._convValueToString(allval.bottomLeft));
            allval.bottomRight && this._checkValue(allval.bottomRight) && (values.bottomRight = this._convValueToString(allval.bottomRight));

            // default values if still no value is set
            values.title || (values.title = {value: this.model.get('name')});
            values.name || (values.name = this.model.get('name'));
            values.id || (values.id = this.model.get('id'));
            values.defaultActionUrl = DefaultActionBehavior.getDefaultActionNodeUrl(this.model);

            // provide property to indicate that this is not the last item
            if (this.model.get("id") !==
                this.model.collection.models[this.model.collection.models.length - 1].get("id")) {
                values.notLastItem = true;
            }

            if (this.model.get("reserved_user_id")) {
                var reservedBy = lang.reservedBy.replace("%1", this.model.get("reserved_user_id_expand").name_formatted);
                if (this.user.get("id")  === this.model.get("reserved_user_id")) {
                    values.reserved_by = reservedBy;
                } else {
                    values.reserved_by_other = reservedBy;
                }
            }

            return values;
        },

        templateHelpers: function (data) {
            return data;
        },

        // Loop over configuration and set proper content that should be displayed
        _getObject: function (object) {
            return _.reduce(object, function (result, expression, name) {
                if (typeof expression !== 'object') {
                    expression = this.self._getValue(expression);
                } else if (typeof expression === 'object') {
                    if (name === 'value' || name === 'label') {
                        var exp = base.getClosestLocalizedString(expression);
                        expression = this.self._getValue(exp);
                    }
                    else {
                        expression = this.self._getObject(expression);
                    }
                }
                result[name] = expression;

                return result;
            }, {}, {"self": this});
        },

        _getValue: function (expression) {
            // Replace the {} parameter placeholders
            var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
                match, propertyName, placeholder, value, valueFormat, result = expression;
            // Go over every parameter placeholder found
            // Don't change expression while doing this, because exec remembers position of last matches
            while ((match = parameterPlaceholder.exec(expression))) {
                placeholder = match[0];
                propertyName = match[1];
                valueFormat = match[3];
                // Format the value according to his type
                if (this.model.collection.columns.models) {
                    value = this._formatPlaceholder(propertyName, valueFormat, this.model.attributes,
                        this.model.collection.columns.models);
                }

                // Replace the placeholder with the value found
                result = result.replace(placeholder, value);
            }
            return result;
        },

        // returns a type specifically formatted model value.
        _formatPlaceholder: function (propertyName, valueFormat, attributes, columnModels) {
            var value, column, type, suffix = "_expand", orgPropertyName = propertyName;

            column = _.find(columnModels, function (obj) {
                return obj.get("column_key") === propertyName;
            });
            type = column && column.get("type") || undefined;

            // If exist use expanded property
            propertyName = attributes[propertyName + suffix] ? propertyName + suffix : propertyName;
            value = !_.isUndefined(attributes[propertyName])?attributes[propertyName]: "";

            switch (type) {
                case -7:
                    if (propertyName === 'modify_date' || propertyName === 'modified' ) {
                        value = attributes['modified'] || attributes['modify_date'];
                    }
                    value = base.formatDate(value);
                    break;
                case 5:
                    // Type 5 is a boolean and in this case format properly
                    value = attributes[propertyName + "_formatted"];
                    if (value === null || value === undefined) {
                        value = '';
                    }
                    break;
                case 2:
                case 14:
                    if (propertyName === 'size' || propertyName === 'modifiedby' || propertyName === 'createdby') {
                        value = attributes[propertyName + '_formatted'];
                    }
                    else if (propertyName.indexOf(suffix, this.length - suffix.length) !== -1 &&
                        (attributes[propertyName].type_name === "User" || attributes[propertyName].type_name === "Group")) {
                        value = base.formatMemberName(value);
                    }
                // No break because it must also be checked for default!
                /* falls through */
                default:
                    // Allow currency to applied for different types, e.g. also a string can be
                    // formatted as currency
                    if (valueFormat === 'currency') {
                        // FIXME: format properly if csui provide formating currencies, for now use default
                        value = numeral(value).format();
                    }

                    // In case the value is still expanded object (e.g. user property is undefined, ...)
                    // Set value the not expanded property
                    if (typeof value === 'object') {
                        value = attributes[orgPropertyName] || "";
                    }
            }
            return value;
        }
    });

    return AttachmentItemView;

});


csui.define('css!xecmpf/widgets/boattachments/impl/boattachments',[],function(){});
/**
 * The business attachment view shows a list of documents linked to a business object
 * Provides:
 *   - infinite scrolling
 *   - Empty view in case no business attachments to show
 *   - Title icon
 */
csui.define('xecmpf/widgets/boattachments/boattachments.view',['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/controls/list/list.view',
  'csui/utils/nodesprites',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/utils/contexts/factories/node',
  'csui/controls/progressblocker/blocker',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/log',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/commands',

  'xecmpf/widgets/boattachments/impl/boattachments.factory',
  'xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable.view',
  'xecmpf/widgets/boattachments/impl/boattitem.view',
  'xecmpf/models/boattachmentcontext/attachmentcontext.factory',
  'xecmpf/widgets/boattachments/impl/boattachmentutil',
  'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',

  'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
  'css!xecmpf/widgets/boattachments/impl/boattachments'
], function (Marionette, module, _, Backbone, $, base, ListView, NodeSpriteCollection,
  LimitingBehavior, ExpandingBehavior, TabableRegionBehavior, ListViewKeyboardBehavior,
  InfiniteScrollingBehavior, NodeModelFactory, BlockingView,
  ModalAlert,
  log,
  NodeTypeIconView,
  Commands,
  BusinessAttachmentsCollectionFactory,
  BusinessAttachmentsTableView,
  AttachmentItemView,
  AttachmentContextFactory,
  attachmentUtil,
  BusinessObjectInfoFacory,
  lang, css) {

  var config = module.config();

  var BOAttachmentsView = ListView.extend({

    constructor: function BOAttachmentsView(options) {
      this.viewClassName = 'xecmpf-businessattachments';
      if (!options || !options.context) {
        throw new Error('Context required to create AttachmentsView');
      }

      // get business attachment context => triggers fetchg from outside
      if (!options.businessAttachmentContext) {
        options.businessAttachmentContext = options.context.getObject(AttachmentContextFactory,
          options.data);
        options.businessAttachmentContext.setAttachmentSpecific(
          BusinessAttachmentsCollectionFactory);
      }

      options.data || (options.data = {});
      options.data.businessattachment || (options.data.businessattachment = {});
      _.defaults(options.data.businessattachment.properties, {
        busObjectId: "",
        busObjectType: "",
        extSystemId: ""
      });
      // business object info returns icon info
      this.busobjinfo = options.businessAttachmentContext.getModel(BusinessObjectInfoFacory, {
        data: options.data.businessattachment.properties,
        attributes: options.data.businessattachment.properties
      });

      ListView.prototype.constructor.apply(this, arguments);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      this.options.data.pageSize = config.defaultPageSize || 30;

      this.configOptionsData = _.clone(options.data);

      // Prepare server side filter
      this.lastFilterValue = "";

      // Per default show expand icon if more than 0 attachments are displayed
      this.limit = 0;

      // Render attachment icon
      this.listenTo(this.collection, "sync", this._renderBusinessAttachmentTitleIcon);
      // show default workspace icon
      this.listenTo(this.collection, "error", this._renderBusinessAttachmentTitleIcon);

      // Node model changed
      this.nodeModel = this.getContext().getObject(NodeModelFactory, options.context.options);
      this.listenTo(this.nodeModel, 'change:id', this._reset);

      // Note on this.messageOnError
      // Display general or error specific message

      // Loading animation
      this.listenTo(this.collection, "request", this.blockActions)
        .listenTo(this.collection, "sync", function () {
          this.messageOnError = undefined;
          this.unblockActions.apply(this, arguments);
        })
        .listenTo(this.collection, "destroy", this.unblockActions)
        .listenTo(this.collection, "error", function () {
          this.unblockActions.apply(this, arguments);
          if (this.messageOnError) {
            ModalAlert.showError(this.messageOnError);
            this.messageOnError = undefined;
          } else {
            ModalAlert.showError(arguments[1].responseJSON.error);
          }
        });
      // No empty view in case of loading animation
      this.listenTo(this.collection, "request", this.destroyEmptyView)
      // order By column configuration => object with column and order
      if (this.options &&
        this.options.data &&
        this.options.data.collapsedView &&
        this.options.data.collapsedView.orderBy) {

        if (_.isString(this.options.data.collapsedView.orderBy)) {
          log.error(lang.errorOrderByMustNotBeString) && console.log(log.last);
          ModalAlert.showError(lang.errorOrderByMustNotBeString);
        } else if (this.options.data.collapsedView.orderBy.sortColumn) {
          // check sort column format
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(this.options.data.collapsedView.orderBy.sortColumn);
          if (!match) {
            log.error(lang.errorOrderByMissingBraces) && console.log(log.last);
            ModalAlert.showError(lang.errorOrderByMissingBraces);
          }
        }
      }
      // metadata field configuration
      if (this.options &&
        this.options.data &&
        this.options.data.collapsedView) {
        var errors = [],
          that = this;
        ["title", "description", "topRight", "bottomLeft", "bottomRight"].forEach(function (n) {
          if (that.options.data.collapsedView[n] && that.options.data.collapsedView[n].format) {
            errors.push(n);
          }
        });
        // should not happen
        if (errors.length > 0) {
          ModalAlert.showError(
            _.str.sformat(lang.errorFieldFormatTagUnrecognized, errors.join(", ")));
        }
      }

    },

    getContext: function () {
      return this.options.businessAttachmentContext;
    },

    initialize: function () {
      // Limiting behaviour needs complete collection, but other behaviours expect collection ...
      this.collection = this.completeCollection;
    },

    onRender: function () {
      // Load initially only one page
      this._resetInfiniteScrolling();
      ListView.prototype.onRender.call(this);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    _resetInfiniteScrolling: function () {
      // reset infinite scrolling in case filter is changed
      this.collection.setLimit(0, this.options.data.pageSize, false);
    },

    templateHelpers: function () {
      return {
        title: this._getTitle(),
        imageUrl: this._getTitleIcon().src,
        imageClass: 'xecmpf-attachmentstitleicon',
        searchPlaceholder: this._getSearchPlaceholder()
      };
    },

    childEvents: {
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    className: function () {
      var className = this.viewClassName,
        parentClassName = _.result(ListView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    /**
     * Reset the current model/query and filter
     * Needed that it's not reused in in case widget is accessed again
     * on same perspective but with different node.
     *
     * @private
     */
    _reset: function () {
      // reset paging due to infinite scrolling
      // Page have to be reset in case wiget is accessed again
      if (this.collection) {
        this.collection.resetLimit();
      }

      // Reset filter
      if (this.ui.searchInput && this.ui.searchInput.val() !== "") {
        if (this.collection) {
          this.collection.clearFilter(false);
        }
        this.ui.searchInput.val('');
      }

      // Call search clicked if search is visible, this will cause the search box to slide out
      if (this.ui.searchInput && this.ui.searchInput.is(':visible')) {
        this.searchClicked(new CustomEvent(''));
      }
    },
    dialogClassName: 'xecmpf-businessattachments',
    behaviors: {

      // Limits the rendered collection length with a More link to expand it
      LimitedList: {
        behaviorClass: LimitingBehavior,
        // Show expand if more than 0 attachments are displayed
        limit: function () {
          return this.limit;
        },
        completeCollection: function () {
          return this.getContext().getCollection(BusinessAttachmentsCollectionFactory, {
            attributes: this._getCollectionAttributes(),
            options: {
              data: this.options.data,
              query: this._getCollectionUrlQuery()
            }
          })

        }
      },

      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: BusinessAttachmentsTableView,
        expandedViewOptions: function () {
          return {
            title: this._getTitle(),
            titleBarIcon: this._getTitleIcon(),
            data: _.clone(this.configOptionsData),
            collection: this._getExpandedViewCollection(true), //for expand view new collection is required always for default filters & sorting.
            context: this.getContext(),
            extId: this.busobjinfo.get('extSystemId'),
            boType: this.busobjinfo.get('busObjectType'),
            boId: this.busobjinfo.get('busObjectKey')
          };
        },
        dialogClassName: function () {
          return this.dialogClassName;
        }
      },

      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        // selector for scrollable area
        content: '.binf-list-group',
        contentParent: '.tile-content',
        fetchMoreItemsThreshold: 80
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      }
    },

    _getExpandedViewCollection: function (freshCollection) {
      if (!!freshCollection) {
        this.expandViewCollection = this.completeCollection ?
          this.completeCollection.clone() : this.collection.clone();
        // clone won't add the bo actions
        this.expandViewCollection.businessObjectActions = this.completeCollection.businessObjectActions || this.collection.businessObjectActions;
        this.expandViewCollection.columns = this.completeCollection.columns || this.collection.columns;
        this.listenTo(this.expandViewCollection, {
          'add': function (model) {
            this.collection.add(model, {
              at: 0
            });
          }
        });
      }
      return this.expandViewCollection;
    },

    filterChanged: function (event) {
      if (event && event.type === 'keyup' && event.keyCode === 27) {
        // Hitting Esc should get rid of the filtering control; it resets
        // the filter value automatically
        this.searchClicked();
      }

      var filterValue = this.ui.searchInput.val();
      // lastFilterValue => server filter

      if (this.lastFilterValue !== filterValue) {
        this.lastFilterValue = filterValue;
        // Wait 1 second to execute
        if (this.filterTimeout) {
          clearTimeout(this.filterTimeout);
        }
        this.filterTimeout = setTimeout(function (self) {
          self.filterTimeout = undefined;
          // reset infinite scrolling because in case filter is changed only first page should be fetched
          self._resetInfiniteScrolling();
          // reset collection that only the returned attachments are displayed
          // if not reset also old attachments are displayed ...
          self.collection.reset();
          // execute server side filtering
          var propertyName;
          if (self._getFilterPropertyName) {
            propertyName = self._getFilterPropertyName();
          }
          var filterOptions = {};
          filterOptions[propertyName || "name"] = filterValue;
          if (self.collection.setFilter(filterOptions, {
              fetch: false
            })) {
            self.messageOnError = lang.errorFilteringFailed;
            self.collection.fetch();
          }
        }, 1000, this);
      }
    },
    /**
     * Get the title icon for the widget.
     * Initially an invisible icon is returned until the rest call returns.
     * In case the rest call provides an title image this is returned as src, otherwise
     * the default workspace title image is returned as css.
     */
    _getTitleIcon: function () {
      // Set transparent gif that it can be replaced later with proper image
      var icon = {
        src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        cssClass: undefined
      };

      if (this.busobjinfo.get("titleIcon")) {
        // For each workspace type one icon exist
        icon.src = this.busobjinfo.get("titleIcon");
        icon.cssClass = 'csui-icon';
      } else {
        // Need to return as class, because URL would not point to proper image
        // icon.cssClass = NodeSprites.findClassByNode(this.collection.node);

        icon.cssClass = 'xecmpf-attachmentstitleicondefault ' +
          NodeSpriteCollection.findClass('equals', 'type', 848);
      }
      return icon;
    },

    /**
     * Render attachment icon after rest call returns.
     * Depending on what and if rest call returns an icon,
     * set icon as class (default icon) or the configured one as src.
     * Icons are set via DOM manipulation.
     */
    _renderBusinessAttachmentTitleIcon: function () {
      var titleDivEl = this.$el.find('.tile-type-image')[0],
        titleImgEl = titleDivEl && this.$el.find('.tile-type-image').find("img")[0];
      if (titleImgEl) {
        var icon = this._getTitleIcon();
        if ($(titleImgEl).attr('src') !== icon.src) {
          $(titleImgEl).attr('src', icon.src);
        }

        if (icon.cssClass) {
          // Set via dom proper class that shows icon
          if ($(titleImgEl).attr('class') !== icon.cssClass) {
            $(titleImgEl).attr('class', icon.cssClass);
          }
        }

        // BITV 1.1.c: no information icon, Empty alt
        // attributes for layout graphics
        // WCAG20: H67
        $(titleImgEl).attr('alt', '');

        $(titleImgEl).after('<span class="csui-icon xecmpf-icon-boattachment-overlay" ' +
          'title="' + lang.businessAttachments + '"></span>');

      }
    },

    _getTitle: function () {
      var ret = lang.dialogTitle;

      if (this.options.data.title) {
        ret = base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle);
      }

      return ret;
    },

    _getSearchPlaceholder: function () {
      return lang.searchPlaceholder.replace("%1", this._getTitle());
    },

    childView: AttachmentItemView,

    childViewOptions: function () {
      // at least bo attachment name is displayed
      _.defaults(this.options.data, {
        collapsedView: {
          title: {
            value: "{name}"
          }
        }
      });
      _.defaults(this.options.data.collapsedView.title, {
        value: "{name}"
      });

      if (_.isEmpty(this.options.data.collapsedView.title) ||
        _.isEmpty(this.options.data.collapsedView.title.value)) {
        this.options.data.collapsedView.title = {
          value: "{name}"
        }
      }

      return {
        context: this.options.context,
        data: this.options.data.collapsedView
      };
    },

    emptyViewOptions: {
      templateHelpers: function () {
        var noBusObj = this._parent.busobjinfo.invalidConfigurationShown ?
          this._parent.busobjinfo.invalidErrorMessage : '';
        return {
          text: this._parent._getNoResultsPlaceholder() + noBusObj

        };
      }
    },
    // Attributes identify collection/models for widget
    // In case two widgets has returns same attributes here, they share the collection!!
    _getCollectionAttributes: function () {
      var boAttachmentProps = (this.options.data.busObjectId && this.options.data) ||
        (this.options.data && this.options.data.businessattachment &&
          this.options.data.businessattachment.properties) || {};
      return {
        busObjectType: (boAttachmentProps && boAttachmentProps.busObjectType),
        extSystemId: (boAttachmentProps && boAttachmentProps.extSystemId),
        busObjectId: (boAttachmentProps && boAttachmentProps.busObjectId),
        sortExpanded: this.options.data.expandedView &&
          attachmentUtil.orderByAsString(this.options.data.expandedView.orderBy) ||
          this._getDefaultSortOrder() || undefined,
        sortCollapsed: this.options.data.collapsedView &&
          attachmentUtil.orderByAsString(this.options.data.collapsedView.orderBy) ||
          this._getDefaultSortOrder() || undefined
      };

    },

    // Get the default sort order in case no sort order is defined
    _getDefaultSortOrder: function () {
      return this._getFilterPropertyName() ? this._getFilterPropertyName() + ' asc' : undefined;
    },

    _getCollectionUrlQuery: function () {
      var options = this.options,
        query = {};
      var orderByAsString;

      if (options.data.collapsedView) {
        orderByAsString = attachmentUtil.orderByAsString(options.data.collapsedView.orderBy);
      }
      if (!orderByAsString) {
        orderByAsString = this._getDefaultSortOrder();
      }
      if (orderByAsString) {
        query.sort = orderByAsString;
      }

      return query;
    },

    // get first placeholder from string with mix of column references and free text.
    _getFirstPlaceholder: function (expression) {
      var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
        match, propertyName, placeholder, result;
      // Go over every parameter placeholder found
      // Don't change expression while doing this, because exec remembers position of last matches
      while ((match = parameterPlaceholder.exec(expression))) {
        placeholder = match[0];
        propertyName = match[1];
        if (propertyName) {
          result = match;
          break;
        }
      }
      return result;
    },

    // Get property name to use for filtering
    _getFilterPropertyName: function () {
      var propertyName;
      if (this.options && this.options.data && this.options.data.collapsedView &&
        this.options.data.collapsedView.title && this.options.data.collapsedView.title.value) {
        var placeHolder = this._getFirstPlaceholder(this.options.data.collapsedView.title.value);
        if (placeHolder) {
          propertyName = placeHolder[1];
        }
      }
      return propertyName;
    },

    // return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var $item = this.$(_.str.sformat(
        '.xecmpf-attachmentitem-object:nth-child({0}) .xecmpf-attachmentitem-border', index + 1));
      return this.$($item[0]);
    },
    _getNoResultsPlaceholder: function () {
      var ret = this.options.data &&
        this.options.data.collapsedView &&
        this.options.data.collapsedView.noResultsPlaceholder;

      if (ret) {
        ret = base.getClosestLocalizedString(ret, lang.noResultsPlaceholder);
      } else {
        ret = lang.noResultsPlaceholder;
      }

      return ret;
    },

    // To use default empty view from ListView, the following functions are needed
    collectionEvents: {
      'reset': 'onCollectionSync'
    },

    onCollectionSync: function () {
      this.synced = true;
    },

    isEmpty: function () {
      return this.synced && (this.collection.models.length === 0);
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    }
  });

  return BOAttachmentsView;
});

csui.define('css!xecmpf/widgets/workspaces/controls/tile/impl/tile',[],function(){});
csui.define('xecmpf/widgets/workspaces/controls/tile/tile.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette', 'csui/utils/log',
    'csui/utils/base',
    'csui/controls/tile/tile.view',
    'css!xecmpf/widgets/workspaces/controls/tile/impl/tile'

], function (module, $, _, Backbone, Marionette, log, base,
             TileView_
) {

    var TileView = TileView_.extend({
        constructor: function TileView(options) {
            TileView_.prototype.constructor.apply(this, arguments);
        }
    });
    return TileView;
});

csui.define('xecmpf/widgets/workspaces/factories/workspace.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'xecmpf/widgets/workspaces/models/workspace.collection',
    'csui/utils/contexts/factories/connector',
    'csui/utils/commands',
], function (module, _, Backbone,
             CollectionFactory,
             WorkspaceCollection,
             ConnectorFactory,
             allCommands) {
    'use strict';

    var WorkspaceCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'workspaces',

        constructor: function WorkspaceCollectionFactory(context, options) {
            options || (options = {});

            CollectionFactory.prototype.constructor.apply(this, arguments);
            var workspaces = this.options.workspaces || {};

            if (!(workspaces instanceof Backbone.Collection)) {
                workspaces = new WorkspaceCollection(workspaces.models, _.extend({},
                    this.options.workspaces, {
                    // Prefer refreshing the entire table to rendering one row after another.
                    autoreset: true,
                    // Ask the server to check for permitted actions V2
                    commands: allCommands.getAllSignatures(),
                    // Do not request the v1 actions, which are sent by default
                    includeActions: false,
                    connector: context.getObject(ConnectorFactory)
                }));
            }
            this.property = workspaces;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return WorkspaceCollectionFactory;

});

csui.define('xecmpf/widgets/workspaces/factories/workspace.types.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'xecmpf/widgets/workspaces/models/workspace.types.collection',
    'csui/utils/contexts/factories/connector',
], function (module, _, Backbone,
             CollectionFactory,
             WorkspaceTypesCollection,
             ConnectorFactory) {

    var WorkspaceTypesCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'workspaceTypes',

        constructor: function WorkspaceTypesCollectionFactory(context, options) {

            CollectionFactory.prototype.constructor.apply(this, arguments);
            var workspaceTypes = new WorkspaceTypesCollection(undefined, {
                // Prefer refreshing the entire table to rendering one row after another.
                autoreset: true,
                config: this.options.workspaceTypes,
                connector: context.getObject(ConnectorFactory)
            });
            this.property = workspaceTypes;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return WorkspaceTypesCollectionFactory;

});

csui.define('xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/root/lang',{
    NodeTableNoFilteredItems: 'There are no early workspaces to display.',
    createNew: "Create new",
    createNewTooltip: 'Create business workspace'
});


csui.define('xecmpf/widgets/workspaces/controls/workspaces.table/tabletoolbar.view',['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
    'csui/controls/toolbar/toolitem.model',
    // 'csui/controls/toolbar/impl/toolitems.filtered.model',
    'csui/controls/toolbar/toolitems.filtered.model',
    'csui/controls/toolbar/toolbar.view',
    'csui/utils/commands',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/controls/tabletoolbar/tabletoolbar.view',
    "csui/utils/url",
    'xecmpf/widgets/workspaces/factories/workspace.types.factory',
    'i18n!xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang'
], function (module, require, $, _, Backbone, Marionette, log, base,
             ToolItemModel, FilteredToolItemsCollection,
             ToolbarView,
             Commands,
             LayoutViewEventsPropagationMixin,
             TableToolbarView,
             Url,
             WorkspaceTypeCollectionFactory,
             lang) {
    'use strict';

    var AddWorkspaceToolbarView = ToolbarView.extend({

            cssPrefix: "binf-",
            ui: {
                dropdown: '.binf-dropdown-toggle'
            },
            events: {
                'click @ui.dropdown': 'adjustDropdown'
            },

            _makeDropDown: function () {
                var e = '<a href="#" class="' + this.cssPrefix + 'dropdown-toggle csui-acc-focusable"  data-binf-toggle="dropdown" aria-expanded="true"';
                if (this.options.dropDownText) {
                    e += ' title="' + this.options.dropDownText + '">';
                } else {
                    e += '>';
                }
                if (this.options.dropDownIcon) {
                    e += '<span class="' + this.options.dropDownIcon + '"></span>';
                } else {
                    if (this.options.dropDownText) {
                        e += this.options.dropDownText;
                    }
                }
                e += "<span class='toolbarlabel'>" + lang.createNew + "</span></a>";
                return e;
            },
            adjustDropdown: function (event) {
                if (this.collection.length <= 1) {
                    // hide drop down
                    this.$el.find("." + this.cssPrefix + "dropdown-menu").css("display", "none");
                    var args = {toolItem: this.collection.at(0)};
                    this.children.first().triggerMethod("before:toolitem:action", args);
                    this.children.first().triggerMethod("toolitem:action", args);
                }
            }
        })
        ;
    var AddWorkspaceTableToolbarView = TableToolbarView.extend({

        constructor: function TableToolbarView(options) {
            Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options

            this.context = this.options.context;
            this.commands = this.options.commands || Commands;
            this.toolbarNames = ['add'];

            // create toolbar with filtered commands
            var addToolbarFactory = this.options.toolbarItems['addToolbar'],
                toolbarView = this['addToolbarView'] = new AddWorkspaceToolbarView(_.extend({
                    // filter entries in toolbar
                    collection: new FilteredToolItemsCollection(
                        addToolbarFactory, {
                            status: {},  // must be set
                            commands: this.commands,
                            delayedActions: false
                        }), // <=  filter toolbar items (actions) for add toolbar
                    toolbarName: "add"
                }, addToolbarFactory.options));

            this
                .listenTo(toolbarView, 'childview:toolitem:action',
                    function (toolItemView, args) {
                        this.trigger('toolbarItem:clicked', args.toolItem.attributes.commandData);
                    }
                )
                .listenTo(toolbarView, 'dom:refresh', function () {
                    this.triggerMethod('refresh:tabindexes');
                });
            this._updateAddToolbar();
            this.propagateEventsToRegions();
        },
        // called from nodestable.view when the selection of nodes changed -> update the toolbars
        updateForSelectedChildren: function (selectedNodes) {
            // skip
        },

        _addMenuItems: function (toolItems, businessWorkspaceTypes) {
            businessWorkspaceTypes.models.forEach(function (bwtype) {
                // note: signature of toolbar item must match with a command or indicates entry as separator

                if (!_.isEmpty(bwtype.get("templates"))) {
                    _.each(bwtype.get("templates"), function (tmpl) {
                        var toolItem = new ToolItemModel({
                            signature: "AddConnectedWorkspace", // must match with filteredToolItemCollection
                            name: tmpl.name,
                            group: 'conws',
                            commandData: {
                                wksp_type_name: bwtype.get("wksp_type_name"), //. props.wksp_type_name,
                                wksp_type_id: bwtype.get("wksp_type_id"), // props.wksp_type_id,
                                template: tmpl,
                                type: tmpl.subType,
                                rm_enabled: bwtype.get("rm_enabled")
                            }
                        });
                        toolItems.push(toolItem);
                    });
                }
            });
        },

        onBeforeShow: function () {
            // empty toolbar
            this.$el.find("li").remove();
            this.options.toolbarItems.addToolbar.reset(this.toolbarItems);
        },
        _updateAddToolbar: function () {
            // build toolbar
            this.toolbarItems = [];
            this.workspaceTypesCollection = this.options.context.getCollection(
                WorkspaceTypeCollectionFactory, {
                    busObjectType: this.options.data.busObjectType,
                    extSystemId: this.options.data.extSystemId
                });

            this._addMenuItems(this.toolbarItems, this.workspaceTypesCollection);
        }
    });

    _.extend(AddWorkspaceTableToolbarView.prototype, LayoutViewEventsPropagationMixin);

    return AddWorkspaceTableToolbarView;

});


csui.define('xecmpf/widgets/workspaces/controls/workspaces.table/table.columns',["csui/lib/backbone"], function (Backbone) {

    var TableColumnModel = Backbone.Model.extend({

        idAttribute: "key",

        defaults: {
            key: null,  // key from the resource definitions
            sequence: 0 // smaller number moves the column to the front
        }

    });

    var TableColumnCollection = Backbone.Collection.extend({

        model: TableColumnModel,
        comparator: "sequence",

        getColumnKeys: function () {
            return this.pluck('key');
        },

        deepClone: function () {
            return new TableColumnCollection(
                this.map(function (column) {
                    return column.attributes;
                }));
        }

    });
    var tableColumns = new TableColumnCollection([
        {
            key: 'name',
            sequence: 1,
            permanentColumn: true // don't wrap column due to responsiveness into details row
        },
        {
            key: 'modify_date',
            sequence: 2,
            permanentColumn: true // don't wrap column due to responsiveness into details row
        }
    ])
    return tableColumns;

});

csui.define('xecmpf/widgets/workspaces/controls/workspaces.table/toolbaritems',['csui/lib/underscore', 'csui/utils/base',
    'csui/controls/toolbar/toolitems.factory',
    'i18n!xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang',
], function (_, base, ToolItemsFactory, lang ) {

    var toolbarItems = {

        addToolbar: new ToolItemsFactory({
                add: []
            },
            {
                maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
                dropDownIcon: "icon icon-toolbarAdd",
                dropDownText: lang.createNewTooltip,
                addTrailingDivider: false
            })

    };

    return toolbarItems;

});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/workspaces/controls/workspaces.table/impl/workspacestable',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"tabletoolbar\"></div>\r\n<div id=\"tableview\"></div>\r\n<div id=\"paginationview\"></div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_workspaces_controls_workspaces.table_impl_workspacestable', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/workspaces/controls/workspaces.table/impl/workspacestable',[],function(){});
csui.define('xecmpf/widgets/workspaces/controls/workspaces.table/workspaces.table.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',

    'csui/utils/contexts/factories/connector',
    'csui/controls/progressblocker/blocker',
    'csui/controls/table/cells/name/name.view',
    'csui/behaviors/default.action/default.action.behavior',
    'xecmpf/widgets/workspaces/factories/workspace.factory',
    'csui/utils/contexts/factories/columns',
    'csui/controls/table/table.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',

    'xecmpf/widgets/workspaces/controls/workspaces.table/tabletoolbar.view',
    'xecmpf/widgets/workspaces/controls/workspaces.table/table.columns',
    'xecmpf/widgets/workspaces/controls/workspaces.table/toolbaritems',
    'csui/controls/pagination/nodespagination.view',

    'i18n!xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang',
    'hbs!xecmpf/widgets/workspaces/controls/workspaces.table/impl/workspacestable',
    'css!xecmpf/widgets/workspaces/controls/workspaces.table/impl/workspacestable'
], function (module, $, _, Backbone,
             Marionette, log, base,
             ConnectorFactory,
             BlockingView,
             NameCellView,
             DefaultActionBehavior,
             WorkspacesCollectionFactory,
             ColumnCollectionFactory,
             TableView,
             LayoutViewEventsPropagationMixin,
             TableToolbarView,
             TableColumns,
             ToolbarItems,
             PaginationView,
             lang, template, css) {

    var config = module.config();

    _.defaults(config, {
        defaultPageSize: 30,
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false
    });

    NameCellView.prototype.getValueData = function () {

        var column = this.options.column,
            node = this.model,
            name = node.get(column.name);

        return {
            defaultAction: 'displayWorkspace',
            defaultActionUrl: '',
            contextualMenu: column.contextualMenu,
            name: name,
            inactive: node.get('inactive')
        };
    };

    var WorkspacesTableView = Marionette.LayoutView.extend({
        template: template,
        className: 'xecmpf_workspacestable',
        regions: {
            tableToolbarRegion: '#tabletoolbar',
            tableRegion: '#tableview',
            paginationRegion: '#paginationview'
        },
        ui: {
            outerTableContainer: '#outertablecontainer',
            innerTableContainer: '#innertablecontainer',
            tableView: '#tableview',
            paginationView: '#paginationview'
        },
        behaviors: {
            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            }
        },

        constructor: function WorkspacesTableView(options) {
            options || (options = {});
            _.defaults(options, {
                data: {},
                pageSize: config.defaultPageSize,
                toolbarItems: ToolbarItems,
                defaultPageSize: config.defaultPageSize,
                clearFilterOnChange: config.clearFilterOnChange,
                resetOrderOnChange: config.resetOrderOnChange,
                resetLimitOnChange: config.resetLimitOnChange,
                fixedFilterOnChange: config.fixedFilterOnChange
            });

            this.context = options.context;
            this.connector = this.context.getObject(ConnectorFactory);

            var height = options.data.height || options.height;
            if (height) {
                this.$el.height(height);
            }

            // Inheritors of this object start blocking actions in initialize().
            // Initializing of the blocking view has to happen before the parent
            // constructor gets called, or better, before initialize() is executed.
            // This is a result of breaking two rules:
            // 1. Nobody should inherit from widgets.
            // 2. constructor should not be overridden together with initialize.
            BlockingView.imbue(this);
            // calls initialize
            Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options

            this.collection = this.options.collection = this.context.getCollection(
                WorkspacesCollectionFactory, {
                    attributes: 'early'
                });
            this.columns = this.collection.columns;
            this.tableColumns = TableColumns.deepClone();
            this._setToolBar(ToolbarItems);
            this.defaultActionController.executeAction = function (node) {
                return $.Deferred().resolve();
            }

            this._setTableView();
            this._setPagination();
            this.propagateEventsToRegions();
        },

        _setTableView: function () {

            this.tableView = new TableView({
                selectRows: "none",
                context: this.options.context,
                connector: this.connector,
                collection: this.collection,
                columns: this.columns,
                selectColumn: false,
                tableColumns: this.tableColumns,
                pageSize: this.options.data.pageSize,
                originatingView: this,
                columnsWithSearch: ["name"],
                orderBy: this.options.orderBy,
                filterBy: this.options.filterBy,
                blockingParentView: this,
                tableTexts: {
                    zeroRecords: lang.NodeTableNoFilteredItems
                }
            });


            // FIXME: Computing maximum column count (_adjustColumnsAfterWindowResize)
            // does not return the same value as set by rebuilding the table (rebuild)
            // unless an extra div  is appended to the table.  Why?
            this.listenTo(this.tableView, 'render', function () {
                this.tableView.$el.append($('<div>')[0]);
            });

            this._setTableViewEvents();
        },
        _setTableViewEvents: function () {

            this.listenTo(this.tableView, 'dom:refresh', function () {
                $('.csui-nodetable')[0] && !$('.csui-not-ready')[0]  && $('.csui-nodetable').trigger("focus");
                // $('.csui-addToolbar')[0] && !$('.csui-addToolbar')[0]  && $('.csui-addToolbar').focus();
            });

            this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
                var args = {node: node};
                this.trigger('before:defaultAction', args);
                if (!args.cancel) {
                    var self = this;
                    this.defaultActionController
                        .executeAction(node, {
                            context: this.options.context,
                            originatingView: this
                        })
                        .done(function () {
                            self.trigger('executed:defaultAction', args);
                        });
                }
            });

            return true;
        },
        _setToolBar: function (toolItems) {
            // toolbarItems is an object with several TooItemFactories in it (for each toolbar one)
            this.tableToolbarView = new TableToolbarView(
                _.defaults(this.options, {
                    context: this.options.context,
                    toolbarItems: toolItems,
                    collection: this.collection,
                    originatingView: this,
                }));

            this.listenTo(this.tableToolbarView, 'before:execute:command', this._beforeExecuteCommand);
            this.listenTo(this.tableToolbarView, 'after:execute:command', this._toolbarActionTriggered);
            this.listenTo(this.tableToolbarView, 'toolbarItem:clicked',
                function (args) {
                    this.trigger('toolbarItem:clicked', args);
                }
            );

            return true;
        },

        _setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize || this.options.pageSize,
                defaultDDList: this.options.ddItemsList,
                // this.options.ddItemsList,
                externalWidget: this.options.externalWidget
            });

            return true;
        },
        onShow: function () {
            _.each(this.regionManager._regions, function (region) {
                if (region.currentView) {
                    region.currentView.triggerMethod('show');
                }
            });
        },

        onAfterShow: function () {
            _.each(this.regionManager._regions, function (region) {
                if (region.currentView) {
                    region.currentView.triggerMethod('after:show');
                }
            });
        },
        onRender: function () {
            this.tableToolbarRegion.show(this.tableToolbarView);
            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);
        }
    });
    _.extend(WorkspacesTableView.prototype, LayoutViewEventsPropagationMixin);
    return WorkspacesTableView;
});


csui.define('xecmpf/widgets/workspaces/pages/select.workspace/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/workspaces/pages/select.workspace/impl/nls/root/lang',{
  pageTitle: 'Create or complete business workspace'
});



/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/workspaces/pages/select.workspace/impl/select.workspace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"content\"></div>\r\n\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_workspaces_pages_select.workspace_impl_select.workspace', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/workspaces/pages/select.workspace/impl/select.workspace',[],function(){});
csui.define('xecmpf/widgets/workspaces/pages/select.workspace/select.workspace.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
    'xecmpf/widgets/workspaces/controls/tile/tile.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    "xecmpf/widgets/workspaces/controls/workspaces.table/workspaces.table.view",
    "i18n!xecmpf/widgets/workspaces/pages/select.workspace/impl/nls/lang",
    'hbs!xecmpf/widgets/workspaces/pages/select.workspace/impl/select.workspace',
    'css!xecmpf/widgets/workspaces/pages/select.workspace/impl/select.workspace',

], function (module, $, _, Backbone, Marionette, log, base,
             TileView,
             LayoutViewEventsPropagationMixin,
             WorkspacesTableView,
             lang,
             template,
             css) {


    var SelectWorkspaceView = Marionette.LayoutView.extend({
            tagName: "div",
            id: "xecmpf-select_wksp",
            className: "xecmpf-page",

            template: template,
            regions: {
                content: "#content"
            },
            constructor: function SelectWorkspaceView(options) {
                Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
                this.context = this.options.context;
                this.propagateEventsToRegions();
            },
            _getController: function () {
                return this.options.status.wksp_controller;
            },
            onBeforeShow: function () {
                var options = this.options;
                this.tileView = new TileView({
                    title: lang.pageTitle,
                    contentView: WorkspacesTableView,
                    contentViewOptions: options
                });

                this.getRegion('content').show(this.tileView);
                this.listenTo(this.tileView.contentView, 'toolbarItem:clicked', function (workspaceType) {
                    // workspace template selected
                    _.defaults(options.status, {
                        workspaceType: new Backbone.Model(workspaceType)
                    });

                    this._getController().createWorkspace(options);
                    return $.Deferred().resolve();
                });
                this.listenTo(this.tileView.contentView, 'executed:defaultAction', function (args) {
                    options.status || (options.status = {});
                    // set selected workspace
                    options.status.workspace = args.node;
                    this._getController().updateWorkspace(options);
                });
            }
        })
        ;

    _.extend(SelectWorkspaceView.prototype, LayoutViewEventsPropagationMixin);

    return SelectWorkspaceView;
})
;


csui.define('css!xecmpf/widgets/workspaces/controls/footer/impl/footer',[],function(){});
csui.define('xecmpf/widgets/workspaces/controls/footer/footer.view',['csui/lib/marionette',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/behaviors/keyboard.navigation/tabable.region.behavior',
    'csui/behaviors/keyboard.navigation/tabables.behavior',
    'css!xecmpf/widgets/workspaces/controls/footer/impl/footer'
], function (Marionette, _, $, TabableRegion) {

    var ButtonView = Marionette.ItemView.extend({

        tagName: 'button',
        className: 'binf-btn',
        template: false,
        triggers: {
            'click': 'click'
        },
        behaviors: {
            TabableRegion: {
                behaviorClass: TabableRegion
            }
        },

        constructor: function ButtonView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        isTabable: function () {
            return this.$el.is(':not(:disabled)') && this.$el.is(':not(:hidden)');
        },
        currentlyFocusedElement: function () {
            if (this.$el.prop('tabindex') === -1) {
                this.$el.prop('tabindex', 0);
            }
            return this.$el;
        },
        onRender: function () {
            var $button = this.$el;
            $button.text(this.model.get("label"));
            $button.addClass(this.model.get('primary') ? 'binf-btn-primary' : 'binf-btn-default');
            $button.attr('title', (this.model.get("toolTip") ? this.model.get("toolTip") : ""));

            if (this.model.get("separate")) {
                $button.addClass('cs-separate');
            }
            this.updateButton(this.model);
        },

        updateButton: function (model) {
            var $button = this.$el;

            if (model.get("hidden") !== undefined) {
                if (model.get("hidden")) {
                    $button.addClass('hidden');
                } else {
                    $button.removeClass('hidden');
                }
            }

            if (model.get("primary") === true) {
                $button.removeClass('binf-btn-default');
                $button.addClass('binf-btn-primary');
            } else {
                $button.addClass('binf-btn-default');
            }

            if (model.get("disabled") !== undefined) {
                $button.prop('disabled', model.get("disabled"));
            }
        }

    });

    var FooterView = Marionette.CollectionView.extend({
        id: "wksp_footer",
        tagName: "div",
        className: "binf-modal-footer",
        childView: ButtonView,

        constructor: function FooterView(options) {
            Marionette.CollectionView.prototype.constructor.apply(this, arguments);
            this.listenTo(this, 'childview:click', this.onClickButton);
        },
        onDomRefresh: function () {
            this.children.each(function (buttonView) {
                buttonView.trigger('dom:refresh');
            });
        },
        onClickButton: function (buttonView) {
            // button collection model attribute
            buttonView.$el.prop('disabled', true);

            if (buttonView.model.get("click")) {
                buttonView.model.get("click")().fail(function () {
                        buttonView.$el.prop('disabled', false);
                    }
                )
            }
        },
        update: function () {
            var self = this;
            this.collection.models.forEach(function (buttonModel) {
                self.children
                    .findByModel(buttonModel)
                    .updateButton(buttonModel);
            });
        }
    });

    return FooterView;
});
csui.define('xecmpf/widgets/workspaces/pages/create.workspace/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/workspaces/pages/create.workspace/impl/nls/root/lang',{
    pageTitle: 'Create business workspace',
    createWorkspace: 'Create',
    cancel: 'Cancel',
    failedToCreateItem: 'Failed to create the new item.',
    nameIsGeneratedAutomatically: 'Workspace name is generated automatically.',
    errorGettingCreateForm: 'Error getting form for workspace creation.',
    businessWorkspaceTypeName: 'Business Workspace',
    createWorkspaceTooltip: 'Create business workspace'
});



/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/workspaces/pages/create.workspace/impl/create.workspace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"content\" class=\"cs-properties-wrapper\"></div>\r\n<div id=\"footer\"></div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_workspaces_pages_create.workspace_impl_create.workspace', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/workspaces/pages/create.workspace/impl/create.workspace',[],function(){});
/**
 * Created by cknoblic on 08.09.2016.
 */
csui.define('xecmpf/widgets/workspaces/pages/create.workspace/create.workspace.view',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
    'csui/utils/namedsessionstorage',
    'xecmpf/widgets/workspaces/controls/tile/tile.view',
    'xecmpf/widgets/workspaces/controls/footer/footer.view',
    'csui/widgets/metadata/metadata.add.item.controller',
    'csui/widgets/metadata/metadata.action.one.item.properties.view',
    'conws/models/workspacecreateforms',
    'conws/models/metadata.controller',
    "csui/models/node/node.model",
    'conws/models/metadata.controller',
    'csui/utils/contexts/factories/connector',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/behaviors/keyboard.navigation/tabables.behavior',
    'csui/widgets/metadata/metadata.properties.view',
    'csui/utils/url',
    "i18n!xecmpf/widgets/workspaces/pages/create.workspace/impl/nls/lang",
    'hbs!xecmpf/widgets/workspaces/pages/create.workspace/impl/create.workspace',
    'css!xecmpf/widgets/workspaces/pages/create.workspace/impl/create.workspace'

], function (module, $, _, Backbone, Marionette, log, base,
             NamedSessionStorage,
             TileView,
             FooterView,
             MetadataAddItemController,
             MetadataActionOneItemPropertiesView,
             WorkspaceCreateFormCollection,
             WorkspaceMetadataController,
             NodeModel,
             MetadataController,
             ConnectorFactory,
             ModalAlert,
             LayoutViewEventsPropagationMixin,
             TabablesBehavior,
             MetadataPropertiesView,
             Url,
             lang,
             template,
             css) {


    var CreateWorkspaceView = Marionette.LayoutView.extend({
        tagName: "div",
        id: "xecmpf-create_wksp",
        className: "xecmpf-page",
        template: template,
        regions: {
            content: "#content",
            footer: "#footer"
        },
        behaviors: {
            TabablesBehavior: {
                behaviorClass: TabablesBehavior,
                recursiveNavigation: true,
                containTabFocus: true
            }
        },

        constructor: function CreateWorkspaceView(options) {
            Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
            var self = this;
            this.context = this.options.context || {};
            this.buttonCollecion = new Backbone.Collection(),

            this.propagateEventsToRegions();
            // FIXME keyboard keydown event is registered twice see LPAD-54770
            this.on('dom:refresh', function () {
                if ($._data) {
                    var events = $._data( this.el, "events");
                    if (events &&  events.keydown && events.keydown.length > 1) {
                        var eventName = !_.isEmpty(events.keydown[1].namespace)?
                            events.keydown[1].type  +'.' + events.keydown[1].namespace:events.keydown[1].type;
                        eventName && events.keydown[1].handler && self.$el.off( eventName, events.keydown[1].handler)
                    }
                }
            });
            // FIXME Disable classifcations
            csui.require(['classifications/widgets/metadata/general.fields/classifications/metadata.general.form.field.controller',
                    'classifications/utils/commands/add.classifications'],
                    function(MetadataClassificationsGeneralFormFieldController, MetadataAddClassificationController) {
                        MetadataClassificationsGeneralFormFieldController.prototype.getGeneralFormFieldsForCreate = function() {
                            return null;
                        }
                        MetadataAddClassificationController.prototype.enabled = function() {
                            return false;
                        };

                    }, function() {
                        // not installed?
                    })
        },

        _getController: function () {
            return this.options.status.wksp_controller;
        },
        _create: function (options) {
            var namedSessionStorage = new NamedSessionStorage("create_complete_wksp");
            var data = this.metadataAddItemPropView.getValues(),
                dfd = $.Deferred();
            if (!_.isEmpty(data)) {
                data.bo_id = this.options.data.busObjectId;
                data['type'] = 848;

                this.metadataController.createItem(this.node, data)
                    .done(_.bind(function (resp) {
                        if (resp) {
                            var responseData = resp.results && resp.results.data;
                            var nodeId = responseData && responseData.properties && responseData.properties.id;
                            _.extend(options.status, {
                                workspaceNode: new NodeModel({
                                    id: nodeId,
                                    container: true
                                }),
                                viewMode: {
                                    mode: options.data.viewMode ? options.data.viewMode.mode : 'folderBrowse'
                                }
                            });
                            namedSessionStorage.set(options.data.busObjectType+'-'+options.data.busObjectId,nodeId);
                            this._getController().displayWorkspace(options);
                        }
                    }, this))
                    .fail(function (resp) {

                        var error = lang.failedToCreateItem;
                        if (resp) {
                            if (resp.responseJSON && resp.responseJSON.error) {
                                error = resp.responseJSON.error;
                            } else if (resp.responseText) {
                                error = resp.responseText;
                            }
                            ModalAlert.showError(error);
                        }
                        dfd.reject();
                    });
            } else {
                // user entered invalid values
                dfd.reject();
            }
            return dfd.promise()
        },
        _createFormCollection: function () {

            var options = this.options || {},
                status = options.status || {},
                context = options.context || {},
                workspaceType = status.workspaceType,
                self = this;

            // options required by constructor
            this.formCollection = new WorkspaceCreateFormCollection(undefined,
                _.defaults(options, {
                    type: workspaceType.get("type"),
                    wsType: workspaceType.get("wksp_type_id"),
                    node: new NodeModel({}, {
                            // node model collection needs connector
                            connector: context.getObject(ConnectorFactory)
                        }
                    ),
                    actionContext: {
                        mode: "create"
                    }
                }));

            // bo_id is set externally
            this.formCollection.bo_id = options.data.busObjectId;
            // overwrite url calculation
            this.formCollection.url = function () {
                //var path = 'forms/nodes/create',
                var path = 'forms/businessworkspaces/create',
                    params = {
                        //     template_id: workspaceType.get("template").id,
                        bo_id: options.data.busObjectId,
                        bo_type: options.data.busObjectType,
                        ext_system_id: options.data.extSystemId
                    },
                    resource = path + '?' + $.param(_.omit(params, function (value) {
                            return value === null || value === undefined || value === '';
                        })),
                    url = context.getObject(ConnectorFactory).connection.url;
                return Url.combine(url && url.replace('/v1', '/v2') || url, resource);
            };

            this.formCollection.on("error", function (model, response, options) {
                var errmsg = response && (new base.Error(response)).message || lang.errorGettingCreateForm;
                log.error("Fetching the create forms failed: {0}", errmsg) && console.error(log.last);
                ModalAlert.showError(errmsg);
                if (_.isEmpty(status.mode)) {
                    self.buttonCollecion.length>=2 && self.buttonCollecion.at(1).set('disabled', false);
                }
                // SAPRM-9249
                self.tileView.contentView.metadataHeaderView.metadataItemNameView.remove( );
                // End of SAPRM-9249
                self.footerView && self.footerView.update();
            });

            this.formCollection.on("sync", function () {
                self._updateNameAndView(self.node, self.formCollection)
            });

        },
        _updateNameAndView: function (nodeModel, formCollection) {
            // we have special behavior for the name field, depending on the forms result.
            // so we put the code here, where we have access to the name field in the dialog header.
            var general = formCollection.at(0);

            var data = general.get("data");
            if (data) {
                var name = data.name;
                log.debug("name fetched and used: {0}", name) && console.log(log.last);
                nodeModel.set({name: name});
            } else {
                // if no server data object is set, then we set an empty name.
                log.debug("name set to empty.") && console.log(log.last);
                nodeModel.set({name: ""});
            }

            var metadataView = this.tileView.contentView,
                headerView = metadataView && metadataView.metadataHeaderView,
                nameView = headerView && headerView.metadataItemNameView;
            if (nameView) {
                var gs = general.get("schema"),
                    isReadOnly = (gs && gs.properties && gs.properties.name && gs.properties.name.readonly) ? true : false,
                    placeHolder = isReadOnly ? lang.nameIsGeneratedAutomatically : undefined;
                nameView.setPlaceHolder(placeHolder);
                if ((isReadOnly ? true : false) !== (nameView.readonly ? true : false)) {
                    nameView.setReadOnly(isReadOnly);
                }
            }
        },
        render: function () {

            var self = this,
                options = this.options || {},
                context = options.context || {},
                status = this.options.status || {};

            Marionette.LayoutView.prototype.render.apply(this, arguments);

            this.buttonCollecion.add({
                click: _.bind(this._create, this, this.options),
                disabled: true, primary: false,
                label: lang.createWorkspace, toolTip: lang.createWorkspaceTooltip
            });

            // in direct create mode there is no cancel/switch back
            // to early workspace selection
            if (_.isEmpty(status.mode)) {
                this.buttonCollecion.add({
                    click: _.bind(function () {
                        var dfd = $.Deferred();
                        this._getController().selectWorkspace();
                        dfd.resolve();
                        return dfd.promise();
                    }, this, this.options),
                    disabled: true, primary: false, toolTip: lang.cancel,
                    label: lang.cancel, separate: false
                });
            }

            this.footerView = new FooterView({
                collection: this.buttonCollecion
            });

            // created/result node
            this.node = new NodeModel({
                type_name: lang.businessWorkspaceTypeName,
                type: 848,
                container: true,
                rm_enabled: this.options.status.workspaceType.get('rm_enabled'), 
                name: "" // start with empty name
            }, {
                connector: context.getObject(ConnectorFactory)
            });

            this._createFormCollection();
            this.metadataController = new WorkspaceMetadataController(undefined, {
            });

            var CreatePropertiesView = MetadataActionOneItemPropertiesView.extend({
                    constructor: function CreatePropertiesView(options) {
                        MetadataActionOneItemPropertiesView.prototype.constructor.apply(this, arguments);
                        if (this.metadataPropertiesView !== undefined) {
                            this.metadataPropertiesView.stopListening(this);
                        }

                        this.metadataPropertiesView = new MetadataPropertiesView({
                            node: self.node,
                            context: self.options.context,
                            formMode: 'create',
                            action: 'create',
                            metadataView: this,
                            formCollection: self.formCollection
                        });
                        this.listenTo(this.metadataPropertiesView, 'render:forms', function () {
                            self.buttonCollecion.at(0).set('disabled', false);
                            // in direct create there is only one button
                            if (_.isEmpty(status.mode)) {
                                self.buttonCollecion.at(1).set('disabled', false);
                                self.buttonCollecion.at(0).set('primary', true);
                            } else {
                                self.buttonCollecion.at(0).set('primary', true);
                            }

                            self.footerView.update();
                        });

                        this.listenTo(this.metadataPropertiesView, 'before:render', function () {
                            // remove conws reference panel
                            var conwsRef = this.metadataPropertiesView.collection.findWhere({id: "conws-reference"});
                            if (conwsRef) {
                                this.metadataPropertiesView.collection.remove(conwsRef, {silent: true});
                            }
                        });
                    }
                }
            );

            this.tileView = new TileView({
                title: lang.pageTitle,
                contentView: CreatePropertiesView,
                contentViewOptions: {
                    model: this.node,
                    context: context,
                    action: 'create',
                    formCollection: this.formCollection
                }
            });

        },
        onBeforeShow: function () {
            this.content.show(this.tileView);
            this.footer.show(this.footerView);
            this.metadataAddItemPropView = this.tileView.contentView;
        }
    });

    _.extend(CreateWorkspaceView.prototype, LayoutViewEventsPropagationMixin);
    return CreateWorkspaceView;
});



csui.define('xecmpf/widgets/workspaces/pages/display.workspace/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/workspaces/pages/display.workspace/impl/nls/root/lang',{
    failedAuthentication: 'Authentication failed.'
});



/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/workspaces/pages/display.workspace/impl/display.workspace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"display_wksp_content\">\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_workspaces_pages_display.workspace_impl_display.workspace', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/workspaces/pages/display.workspace/impl/display.workspace',[],function(){});
csui.define('xecmpf/widgets/workspaces/pages/display.workspace/display.workspace.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/utils/contexts/page/page.context',
  'csui/utils/commands',
  'xecmpf/utils/commands/workspaces/workspace.delete',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/controls/perspective.panel/perspective.panel.view',
  'csui/integration/folderbrowser/folderbrowser.widget',
  'csui/utils/contexts/factories/connector',
  'xecmpf/utils/commands/folderbrowse/open.full.page.workspace',
  'csui-ext!xecmpf/widgets/workspaces/pages/display.workspace/display.workspace.view',
  'csui/dialogs/modal.alert/modal.alert',
  'i18n!xecmpf/widgets/workspaces/pages/display.workspace/impl/nls/lang',
  'hbs!xecmpf/widgets/workspaces/pages/display.workspace/impl/display.workspace',
  'css!xecmpf/widgets/workspaces/pages/display.workspace/impl/display.workspace'
], function (module, $, _, Backbone, Marionette, log, base, PageContext, CsuiCommands,
    WkspDeleteCmd, NodeModel, NodeModelFactory, PerspectiveContext, PerspectivePanelView, FolderBrowserWidget,
    ConnectorFactory, OpenFullPageWorkspaceView, ExtensionItems, ModalAlert, lang, template, css) {

  var DisplayWorkspaceView = Marionette.LayoutView.extend({
    template: template,
    tagName: "div",
    id: "xecmpf-display_wksp",
    className: "xecmpf-page",
    commands: CsuiCommands,
    templateHelpers: function () {
      return {
        //TODO: will remove viewIFrame parameter once done with implementation of removing iframe
        noIFrame: (this.options.data && this.options.data.viewMode && !this.options.data.viewMode.viewIFrame) ? true : false
      };
    },
    regions: {
      content: "#display_wksp_content",
    },
    constructor: function DisplayWorkspaceView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
    },

    // SAPRM-10672: authenticate with xecmauth before using /xecm-handler:
    authenticateXecm: function (cgiUrl, deferred) {
      var that = this;
      deferred = deferred || $.Deferred();
      if (!!this.connector.connection.session && !!this.connector.connection.session.ticket) {
        var xhr = new XMLHttpRequest();
        var openFullView = new OpenFullPageWorkspaceView();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              deferred.resolve();
            }
            else {
              deferred.reject(lang.failedAuthentication + new Error(xhr.statusText));
            }
          }
        };
        openFullView.authenticate(xhr, cgiUrl, this.connector);

      } else {
        this.options.context.once("sync", function () {
          that.authenticateXecm(cgiUrl, deferred);
        });
      }
      return deferred.promise();
    },

    onShow: function () {
      var options = this.options || {},
          status  = options.status || {};

      this.connector = this.options.context.getObject(ConnectorFactory);
      // SAPRM-8688: Improve navigation by a back button
      var require                      = window.csui && window.csui.require || window.require,
          commands                     = options.data && options.data.folderBrowserWidget &&
                                         options.data.folderBrowserWidget.commands || {},
          goToNodeHistory              = commands['go.to.node.history'] || {},
          goToNodeHistoryEnabled       = !_.isUndefined(goToNodeHistory.enabled) ?
                                         goToNodeHistory.enabled : true,

          openFullPageWorkspace        = commands['open.full.page.workspace'] || {},
          openFullPageWorkspaceEnabled = !_.isUndefined(openFullPageWorkspace.enabled) ?
                                         openFullPageWorkspace.enabled : true,
          fullPageOverlayEnabled       = !_.isUndefined(openFullPageWorkspace.fullPageOverlay) ?
                                         openFullPageWorkspace.fullPageOverlay : true,
          // SAPRM-9805
          // if viewMode is not set we show folderBrowserWidget ( = default )
          // if viewMode is 'fullPage' we show the perspective ( = page ) view
          viewMode                     = options.data.viewMode ? options.data.viewMode.mode :
                                         'folderBrowse',
          searchContainer              = commands['search.container'] || {},
          searchContainerEnabled       = !_.isUndefined(searchContainer.enabled) ?
                                         searchContainer.enabled : true;

      if (viewMode === 'fullPage') {
        this.cgiUrl = this.connector && this.connector.connection && this.connector.connection.url ?
            this.connector.connection.url.replace('/api/v1', '') : '';
        var that = this;
        this.authenticateXecm(this.cgiUrl)
            .done(function () {
              csui.require(['xecmpf/widgets/integration/folderbrowse/full.page.workspace.view',
                    'csui/utils/url'
                  ],
                  function (FullPageWorkspaceView, Url) {
                    //TODO: will remove viewIFrame parameter once done with implementation of removing iframe
                    if (options.data.viewMode.viewIFrame === undefined || options.data.viewMode.viewIFrame) {
                      var urlPrefix = 'xecm',
                      queryParams = "where_ext_system_id=" + options.data.extSystemId +
                                    "&where_bo_type=" + options.data.busObjectType +
                                    "&where_bo_id=" + options.data.busObjectId +
                                    "&view_mode=" + options.data.viewMode.mode,
                          fullPageWorkspaceUrl = Url.appendQuery(
                              Url.combine(that.cgiUrl, urlPrefix, 'nodes',
                                  status.workspaceNode.attributes.id), queryParams),
                          fullPageWorkspaceView,
                          currentWindowRef = window,
                          themePath = $(currentWindowRef.document).find(
                              "head > link[data-csui-theme-overrides]").attr('href'),
                          targetOrigin = new Url(that.cgiUrl).getAbsolute(),
                          setTheme = function (e) {
                            if (e.origin &&
                                (new RegExp(e.origin, "i").test(new Url(that.cgiUrl).getOrigin()))) {
                              if (e.data) {
                                if (e.data.status === "ok") {
                                  e.source.postMessage({"themePath": themePath}, targetOrigin);
                                  currentWindowRef.removeEventListener("message", setTheme, false);
                                }
                              }
                            }
                          };
                      csui.require.config({
                        config: {
                          'csui/integration/folderbrowser/commands/go.to.node.history': {
                            enabled: true
                          }
                        }
                      });
                      fullPageWorkspaceView = new FullPageWorkspaceView({
                        fullPageWorkspaceUrl: fullPageWorkspaceUrl,
                        connector: that.connector
                      });
                      that.content.show(fullPageWorkspaceView);
                      currentWindowRef.addEventListener("message", setTheme);
                    } else {
                      var fullPageNoIFrameOptions = _.extend(that.options, {
                        nodeID: that.options.status.workspaceNode.get('id'),
                        connector: that.connector,
                        openFullPageWorkspaceEnabled: openFullPageWorkspaceEnabled,
                        fullPageOverlayEnabled: fullPageOverlayEnabled,
                        goToNodeHistoryEnabled: goToNodeHistoryEnabled
                      });
                      var fullPageWorkspace = new FullPageWorkspaceView(fullPageNoIFrameOptions);
                      that.content.show(fullPageWorkspace);
                    }
                  });
            })
            .fail(function (error) {
              ModalAlert.showError(error.toString());
              console.error(error);
            });
      } else {
        if (ExtensionItems !== undefined && ExtensionItems.length > 0) {
          // At the moment, only the first extension item is given priority and others are ignored
          var extensionItem = new ExtensionItems[0](options);
          if (!this.connector.connection.session) {
            var self = this;
            this.options.context.once("sync", function () {
              self.content.show(extensionItem);
            });
          } else {
            this.content.show(extensionItem);
          }
        } else {
          csui.require.config({
            config: {
              'csui/integration/folderbrowser/commands/go.to.node.history': {
                enabled: goToNodeHistoryEnabled
              }
            }
          });
          // SAPRM-8746: SAP users wants to search from here
          // SAPRM-8752: SAP users wants to open the full page workspace
          csui.require.config({
            config: {
              'xecmpf/utils/commands/folderbrowse/search.container': {
                enabled: searchContainerEnabled
              },
              'xecmpf/utils/commands/folderbrowse/open.full.page.workspace': {
                enabled: openFullPageWorkspaceEnabled,
                fullPageOverlay: fullPageOverlayEnabled,
                // XECMPF-1548: the open.full.page.workspace command needs extSystemId, busObjectType and
                // busObjectId for the xecmpage handler in order to initialize bus.wksp. delete command correctly
                busObjectType:   options.data.busObjectType,
                busObjectId:     options.data.busObjectId,
                extSystemId:     options.data.extSystemId
                // XECMPF-1548
              }
            }
          });

          // SAPRM-9153
          // Remove default delete command of csui.core and add
          // our own bus. wksp. delete command
          // bus. wksp. delete command displays create/complete widget after
          // deletion of bus. wksp., but displays parent of deleted item for
          // all other CS items
          var del = CsuiCommands.get('Delete');
          if (del) {
            CsuiCommands.remove(del);
          }
          options.data.id = status.workspaceNode.attributes.id;
          options.data.viewMode.mode = viewMode;
          options.data.openFullPageWorkspaceEnabled = openFullPageWorkspaceEnabled;
          options.data.fullPageOverlayEnabled = fullPageOverlayEnabled;
          options.data.goToNodeHistoryEnabled = goToNodeHistoryEnabled;
          var busWkspDeleteCmd = new WkspDeleteCmd(options.data);
          CsuiCommands.add(busWkspDeleteCmd);
          // End of SAPRM-9153

          // XECMPF-1562
          var opt = {};
          opt.all = true;
          this.options.context.clear(opt);
          // XECMPF-1562

          // SAPRM-9977
          this.options.context.options.suppressReferencePanel = true;
          // End of SAPRM-9977
          if (this.options.context.options.viewMode === undefined) {
            this.options.context.options.viewMode = {};
          }
          this.options.context.options.viewMode.viewIFrame = this.options.data.viewMode.viewIFrame;

          // Create the widget attached to the placeholder HTML element.
          this.browser = new FolderBrowserWidget({
            breadcrumb: !goToNodeHistoryEnabled,
            connection: this.connector.connection,
            start: {
              id: status.workspaceNode.attributes.id
            },
            // SAPRM-9977
            context: this.options.context
            // End of SAPRM-9977
          });
          self = this;
          this.listenTo(busWkspDeleteCmd, 'xecm:delete:workspace:folderBrowse', function () {
            _.defaults(self.options.data, {
              deletecallback: true
            });
            self.options.status.wksp_controller.selectWorkspace(self.options);
            var backCommand = CsuiCommands.get('Back');
            if (backCommand &&
                backCommand.clearHistory &&
                self.browser.options.context) {
              backCommand.clearHistory(self.browser.options.context);
            }
          });
          // Display the widget.
          this.browser.show({
            // Placeholder is mandatory, but can be passed to the show
            // method first, because it is needed first for rendering.
            placeholder: "#display_wksp_content"
          });
        }
      }
    }
  });
  return DisplayWorkspaceView;
});

csui.define('xecmpf/widgets/workspaces/pages/update.workspace/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
});

csui.define('xecmpf/widgets/workspaces/pages/update.workspace/impl/nls/root/lang',{
    pageTitle: 'Complete workspace',
    completeWorkspace: 'Complete',
    completeWorkspaceTooltip: 'Complete workspace',
    failedToUpdateItem: 'Failed to update the item.',
    cancel: 'Cancel',
    nameIsGeneratedAutomatically: 'Workspace name is generated automatically.',
    errorGettingCreateForm: 'Error getting form for workspace creation.'
});



/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/workspaces/pages/update.workspace/impl/update.workspace',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"content\" class=\"cs-properties-wrapper\"></div>\r\n<div id=\"footer\"></div>\r\n\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_workspaces_pages_update.workspace_impl_update.workspace', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/workspaces/pages/update.workspace/impl/update.workspace',[],function(){});
/**
 * Created by cknoblic on 08.09.2016.
 */
csui.define('xecmpf/widgets/workspaces/pages/update.workspace/update.workspace.view',['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',
    'csui/utils/namedsessionstorage',
    'xecmpf/widgets/workspaces/controls/tile/tile.view',
    'xecmpf/widgets/workspaces/controls/footer/footer.view',
    "csui/widgets/metadata/metadata.properties.view",
    'csui/widgets/metadata/metadata.action.one.item.properties.view',
    'csui/models/node/node.model',
    'csui/utils/contexts/factories/connector',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/behaviors/keyboard.navigation/tabables.behavior',
    'csui/utils/url',
    'csui/utils/commands',
    'conws/models/workspacecreateforms',
    'i18n!xecmpf/widgets/workspaces/pages/update.workspace/impl/nls/lang',
    'hbs!xecmpf/widgets/workspaces/pages/update.workspace/impl/update.workspace',
    'css!xecmpf/widgets/workspaces/pages/update.workspace/impl/update.workspace'

], function (module, $, _, Backbone, Marionette, log, base,
             NamedSessionStorage,
             TileView,
             FooterView,
             MetadataPropertiesView,
             MetadataActionOneItemPropertiesView,
             NodeModel,
             ConnectorFactory,
             ModalAlert,
             LayoutViewEventsPropagationMixin,
             TabablesBehavior,
             Url,
             commands,
             WorkspaceCreateFormCollection,
             lang,
             template,
             css) {

    // XECMPF-1532: Remove all commands for early workspace
    //              In integration scenarios categories/classifications etc. should be set
    //              automatically by template configuration
    var propCmds = commands.clone();
    propCmds.reset();

    var UpdateWorkspaceView = Marionette.LayoutView.extend({

        tagName: "div",
        id: "xecmpf-update_wksp",
        className: "xecmpf-page",

        template: template,
        regions: {
            content: "#content",
            footer: "#footer"
        },

        behaviors: {
            TabablesBehavior: {
                behaviorClass: TabablesBehavior,
                recursiveNavigation: true,
                containTabFocus: true
            }
        },

        constructor: function UpdateWorkspaceView(options) {
            var self = this;
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            this.context = this.options.context || {};
            this.propagateEventsToRegions();
            this.readOnlyCats = {};
            this.readOnlyCatVals = {};
            // FIXME keyboard keydown event is registered twice see LPAD-54770
            this.on('dom:refresh', function () {
                if ($._data) {
                    var events = $._data(this.el, "events");
                    if (events && events.keydown && events.keydown.length > 1) {
                        var eventName = !_.isEmpty(events.keydown[1].namespace) ?
                            events.keydown[1].type + '.' + events.keydown[1].namespace : events.keydown[1].type;
                        eventName && events.keydown[1].handler && self.$el.off(eventName, events.keydown[1].handler)
                    }
                }
            });
            var readOnlyCats = this.readOnlyCats,
                readOnlyCatVals = this.readOnlyCatVals;

            this._saveField = function (args) {
                // This view is shared for both creation and editing scenarios.
                // Do not save immediately in the creation mode.  The creation dialog
                // has a button to get all field values and perform the action.
                if (this.mode === 'create') {
                    return;
                }


                // _.chain(this.model.get('schema').properties['52238_2'].properties)

                // Optimizing the payload to send a part of the category, which has to
                // be complete, is complicated.  The classic UI sends all data anyway.
                // Until we have PATCH behaviour in the REST API, it doesn't pay off.
                var values = this.getValues(),
                    self = this;

                // Savechanges should be invoked only for the current category which is being edited. 
                // Hence take the current category id into a var and compare while setting the attribute values.
                var currentId = this.model.get("id");

                // this.model.get('schema')
                _.chain(readOnlyCats).each(function (readOnlyCatModel, id) { // => id = 'catgpory => 52238'

                    // if the category being edited is not the workspace category, 
                    //continue the loop without processing.

                    if  ( (currentId !== undefined) &&  (currentId !== id) ){
                        return true;
                    }

                    // check readonly fields in category
                    _.chain(readOnlyCatModel.properties).each(function (schemaDef, key) { // key =>52238_2
                        if (schemaDef.type === 'object') {
                            // id == Cat Id => sets
                            _.chain(schemaDef.properties).each(function (setFieldDef, setFieldKey) { // setFieldKey => "52238_2_1_6"
                                if (setFieldDef.readonly === true) {
                                    values[key][setFieldKey] = readOnlyCatVals[id + ':' + key + ':' + setFieldKey];
                                }
                            })
                        } else if (schemaDef.type === 'array' && _.has(schemaDef, 'items')) {
                            var tabProps = schemaDef.items.properties;
                            _.chain(tabProps).each(
                                function (tabField, tabKey) { //  tabkey => 34359_9_x_10
                                    if (tabField.readonly === true) {
                                        _.chain(values[key]).each(function (tableRow, index) {
                                            var readOnlyVal = readOnlyCatVals[id + ':' + key + ':' +  index + ':' + tabKey];
                                            if (!_.isUndefined(readOnlyVal)) {
                                                tableRow[tabKey] = readOnlyVal;
                                            }
                                        });
                                    }
                                })

                        } else if (schemaDef.readonly === true) { // simple or array type
                            values[key] = readOnlyCatVals[id + ':' + key];
                        }
                    })
                })

                this._saveChanges(values);
            }
        },
        _getController: function () {
            return this.options.status.wksp_controller;
        },
        _createFormCollection: function () {
            var self = this,
                options = this.options || {},
                context = options.context,
                status = options.status,
                workspace = status.workspace;

            // options required by constructor
            this.formCollection = new WorkspaceCreateFormCollection(undefined,
                _.defaults(options, {
                    type: workspace.get("type"),
                    wsType: workspace.get("wnf_wksp_type_id"),
                    node: new NodeModel(undefined, {
                            // node model collection needs connector
                            connector: context.getObject(ConnectorFactory)
                        }
                    )
                }));

            // bo_id is set externally
            this.formCollection.bo_id = options.data.busObjectId;
            this.formCollection.url = function () {

                var path = 'forms/businessworkspaces/create',
                    params = {
                        template_id: workspace.get("wnf_wksp_template_id"),
                        parent_id: workspace.get("parent_id"),
                        ext_system_id: options.data.extSystemId,
                        bo_type: options.data.busObjectType,
                        bo_id: options.data.busObjectId,
                        completeWorkspace: true
                    },
                    resource = path + '?' + $.param(_.omit(params, function (value) {
                            return value === null || value === undefined || value === '';
                        })),
                    url = context.getObject(ConnectorFactory).connection.url;
                return Url.combine(url && url.replace('/v1', '/v2') || url, resource);
            };

            this.formCollection.on("error", function (model, response, options) {
                var errmsg = response && (new base.Error(response)).message || lang.errorGettingCreateForm;
                log.error("Fetching the create forms failed: {0}", errmsg) && console.error(log.last);
                ModalAlert.showError(errmsg);
            });

        },
        _updateWorkspaceReference: function (model, formsValues) {
            // FormData available (IE10+, WebKit)
            var formData = new FormData();
            formData.append('body', JSON.stringify(formsValues));

            var options = {
                type: 'PUT',
                url: Url.combine(model.connector.connection.url.replace('/v1', '/v2'),
                    'businessworkspaces', model.get("id"), 'workspacereferences'),
                data: formData,
                contentType: false,
                processData: false
            };
            return model.connector.makeAjaxCall(options);
        },
        _complete: function (options) {
            var namedSessionStorage = new NamedSessionStorage("create_complete_wksp");
            var self = this,
                data = this.tileView.contentView.getValues(),
                dfd = $.Deferred();

            if (!_.isEmpty(data)) {
                var context = options.context || {},
                    status = options.status,
                    workspace = status.workspace;
                var nodeId = workspace.get("id");

                self._updateWorkspaceReference(
                    new NodeModel({
                        id: nodeId
                    }, {
                        // node model collection needs connector
                        connector: context.getObject(ConnectorFactory)
                    }),
                    {
                        bo_type: self.getOption("data").busObjectType,
                        bo_id: self.getOption("data").busObjectId,
                        ext_system_id: self.getOption("data").extSystemId
                    }).done(_.bind(function (resp) {
                    dfd.resolve();
                    if (resp) {
                        _.extend(status, {
                            workspaceNode: new NodeModel({
                                id: nodeId,
                                container: true
                            }),
                            viewMode: {
                                mode: options.data.viewMode ? options.data.viewMode.mode : 'folderBrowse'
                            }
                        });
                        namedSessionStorage.set(options.data.busObjectType+'-'+options.data.busObjectId,nodeId);
                        self._getController().displayWorkspace(options);
                    }
                }, this))
                    .fail(function (resp) {
                        var error = lang.failedToUpdateItem;
                        if (resp) {
                            if (resp.responseJSON && resp.responseJSON.error) {
                                error = resp.responseJSON.error;
                            } else if (resp.responseText) {
                                error = resp.responseText;
                            }
                            ModalAlert.showError(error);
                        }
                        dfd.reject();
                    });
            }
            else {
                // Position to field with error message
                $('.binf-has-error') && $('.binf-has-error')[0].scrollIntoView()
                dfd.reject();
            }
            
            return dfd.promise();
        },
        _setHeader: function (model) {
            // we have special behavior for the name field, depending on the forms result.
            // so we put the code here, where we have access to the name field in the dialog header.
            var general = this.formCollection.at(0);
            var data = general.get("data");
            if (data) {
                var name = data.name,
                    self = this;
                log.debug("name fetched and used: {0}", name) && console.log(log.last);
                this.node.set("name", name);
            } else {
                // if no server data object is set, then we set an empty name.
                log.debug("name set to empty.") && console.log(log.last);
                this.node.set("name", "");
            }

            var headerView = this.tileView.contentView.metadataHeaderView,
                nameView = headerView && headerView.metadataItemNameView;

            if (nameView) {
                var gs = general.get("schema"),
                    isReadOnly = (gs && gs.properties && gs.properties.name && gs.properties.name.readonly) ? true : false,
                    placeHolder = isReadOnly ? lang.nameIsGeneratedAutomatically : undefined;
                nameView.setPlaceHolder(placeHolder);
                if ((isReadOnly ? true : false) !== (nameView.readonly ? true : false)) {
                    nameView.setReadOnly(isReadOnly);
                }
                nameView.stopListening(this.node);
            }
        },
        _updateModel: function (model) {
            var self = this;
            this._setHeader(model);
            if (model) {
                // each form model represents a tab e.g. 'general', 'categories' (with all categories) or 'classifications'
                // model is 'general' or applied category form (with ONE category)
                this.formCollection.models.forEach(function (formModel) {
                    // each form model consist
                    var formData = formModel.get("data"),
                        formSchema = formModel.get("schema");

                    // formSchema: 51806, 52238 (all categories)
                    if (_.has(formSchema.properties, model.get("id"))) { // =>52238

                        // get schema def from create form
                        var modelId = model.get("id"),  // =>52238
                            origModelSchema = model.get("schema"),
                            formSchemaDef = formSchema.properties[modelId];

                        formModel = formData[modelId];
                        // check all form model fields against original model
                        _.chain(formSchemaDef.properties).each(
                            function (field, key, list) { // key =>52238_2

                                // check  form model field against original model
                                if (_.has(origModelSchema.properties, key)) {  // 'catgpory => 52238'  key =>52238_2
                                    var formProps = field.properties,
                                        // no data in model? Should not happen?
                                        origModelData = model.get("data")[key],
                                        origModelFieldSchema = origModelSchema.properties[key],
                                        formModelData = formModel[key];

                                    // sets
                                    if (field.type === 'object') {
                                        var origModelSetSchema = origModelFieldSchema.properties;
                                        _.chain(formProps).each(
                                            function (setField, setFieldKey) { //  setFieldKey => "52238_2_1_6"
                                                if (setField.readonly === true) {
                                                    origModelSetSchema[setFieldKey].readonly = setField.readonly;
                                                    self.readOnlyCatVals[modelId + ':' + key + ':' + setFieldKey] = origModelData[setFieldKey];
                                                    self.readOnlyCats[modelId] = origModelSchema;
                                                    origModelData[setFieldKey] = formModelData[setFieldKey];
                                                }
                                            })
                                    }
                                    else if (field.type === 'array' && _.has(field, 'items')) {
                                        var formTabularProps = field.items.properties,
                                            origModelTabSchema = origModelFieldSchema.items.properties;

                                        _.chain(formTabularProps).each(
                                            function (tabField, tabKey) { //  tabkey => 34359_9_x_10
                                                if (tabField.readonly === true) {
                                                    origModelTabSchema[tabKey].readonly = tabField.readonly;

                                                    _.chain(formModelData).each(function (tableRow, index) {
                                                        // orig model can have less entries
                                                        origModelData[index] || (origModelData[index] = {});
                                                        self.readOnlyCatVals[modelId + ':' + key + ':' + index + ':' + tabKey] =
                                                            origModelData[index][tabKey];
                                                        origModelData[index][tabKey] = tableRow[tabKey]
                                                    });

                                                    self.readOnlyCats[modelId] = origModelSchema;
                                                }
                                            })


                                    }
                                    else if (field.readonly) { // simple/array field type string
                                        origModelFieldSchema.readonly = field.readonly;
                                        self.readOnlyCatVals[modelId + ':' + key] = origModelData;
                                        self.readOnlyCats[modelId] = origModelSchema;
                                        model.get("data")[key] = formModelData;
                                    }
                                }
                            }
                        );
                    }
                });
            }
        },
        fetchForm: function () {
            this._createFormCollection();
            return this.formCollection.fetch();
        },
        render: function () {
            var self = this,
                status = this.options.status,
                workspace = status.workspace,
                buttonCollecion = new Backbone.Collection([
                    {
                        click: _.bind(this._complete, this, this.options),
                        disabled: true, primary: false,
                        label: lang.completeWorkspace, toolTip: lang.completeWorkspaceTooltip
                    },
                    {
                        click: _.bind(function () {
                            var dfd = $.Deferred();
                            this._getController().selectWorkspace();
                            dfd.resolve();
                            return dfd.promise()
                        }, this, this.options),
                        disabled: true, primary: false, toolTip: lang.cancel,
                        label: lang.cancel, separate: false
                    }
                ]);

            Marionette.LayoutView.prototype.render.apply(this, arguments);

            this.node = new NodeModel({
                    type_name: workspace.get("type_name"),
                    type: workspace.get("type"),
                    name: workspace.get("name"),
                    id: workspace.get("id"),
                    container: true
                },
                {
                    connector: this.context.getObject(ConnectorFactory)
                }
            );

            // adjust model with data from business object
            var CompleteMetadataPropertiesView = MetadataPropertiesView.extend({
                contentViewOptions: function (model) {
                    self._updateModel(model)
                    return MetadataPropertiesView.prototype.contentViewOptions.apply(this, arguments);
                }
            });

            var UpdatePropertiesView = MetadataActionOneItemPropertiesView.extend({
                    constructor: function UpdatePropertiesView(options) {
                        MetadataActionOneItemPropertiesView.prototype.constructor.apply(this, arguments);
                        if (this.metadataPropertiesView !== undefined) {
                            this.metadataPropertiesView.stopListening(this);
                        }
                        this.metadataPropertiesView = new CompleteMetadataPropertiesView({
                            node: self.node,
                            commands: propCmds,
                            context: self.options.context,
                            formMode: 'update',
                            action: 'update',
                            metadataView: this
                        });


                        this.listenTo(this.metadataPropertiesView, 'render:forms', function () {
                            buttonCollecion.at(0).set('disabled', false);
                            buttonCollecion.at(1).set('disabled', false);
                            buttonCollecion.at(0).set('primary', true);
                            self.footerView.update();
                            this.metadataPropertiesView.tabContent.children.each(function(child, key) {
                                if (child.model.get('role_name') === 'categories') {
                                    // remove change field connected to prototype
                                    child.content.off('change:field');
                                    child.content._saveField = function(args) {
                                        self._saveField.apply(this,args);
                                    }
                                    child.content.listenTo(child.content, 'change:field', child.content._saveField);

                                }
                            })
                        });

                        // remove conws reference panel
                        this.listenTo(this.metadataPropertiesView, 'before:render',
                            function () {
                                var conwsRef = this.metadataPropertiesView.collection.findWhere({id: "conws-reference"});
                                if (conwsRef) {
                                    this.metadataPropertiesView.collection.remove(conwsRef, {silent: true});
                                }
                            });
                    }
                }
            );

            // must be displayed immediately
            this.footerView = new FooterView({
                collection: buttonCollecion
            });

            this.tileView = new TileView({
                title: lang.pageTitle,
                contentView: UpdatePropertiesView,
                contentViewOptions: {
                    model: this.node,
                    context: this.options.context,
                    action: 'update'
                }
            });


        },
        onBeforeShow: function () {
            this.content.show(this.tileView);
            this.footer.show(this.footerView);
        }
    });
    _.extend(UpdateWorkspaceView.prototype, LayoutViewEventsPropagationMixin);
    return UpdateWorkspaceView;
});


csui.define('xecmpf/widgets/workspaces/controllers/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/workspaces/controllers/impl/nls/root/lang',{
    errorGettingBusinessWorkspaceType: 'Cannot get business workspace type.'
});


csui.define('xecmpf/widgets/workspaces/controllers/dialog.controller',['require',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'csui/utils/namedsessionstorage',
    'xecmpf/widgets/workspaces/pages/select.workspace/select.workspace.view',
    'xecmpf/widgets/workspaces/pages/create.workspace/create.workspace.view',
    'xecmpf/widgets/workspaces/pages/display.workspace/display.workspace.view',
    'xecmpf/widgets/workspaces/pages/update.workspace/update.workspace.view',
    'xecmpf/widgets/workspaces/factories/workspace.factory',
    'xecmpf/widgets/workspaces/factories/workspace.types.factory',
     
    'conws/models/workspacecreateforms',

    'csui/utils/contexts/factories/connector',
    "csui/models/node/node.model",
    'csui/dialogs/modal.alert/modal.alert',

    'i18n!xecmpf/widgets/workspaces/controllers/impl/nls/lang'
], function (require, $, _,
    Marionette, Backbone,
    NamedSessionStorage,
    SelectWorkspaceView,
    CreateWorkspaceView,
    DisplayWorkspaceView,
    UpdateWorkspaceView,
    WorkspacesCollectionFactory,
    WorkspaceTypeCollectionFactory,
    WorkspaceCreateFormCollection,

    ConnectorFactory,
    NodeModel,
    ModalAlert,
    lang) {


    var DialogController = Marionette.Object.extend({

        constructor: function DialogController(options) {
            options = options || {};
            this.options = options;
            this.context = this.options.context || {};
            this.region = this.options.region;
        },
        updateWorkspace: function (options) {
            options || (options = this.options);
            this._showUpdateWorkspaceView(options);
        },
        displayWorkspace: function (options) {
            options || (options = this.options);
            this._showDisplayWorkspaceView(options);
        },
        createWorkspace: function (options) {
            options || (options = this.options);
            this._showCreateWorkspaceView(options);
        },
        selectWorkspace: function (options) {
            options || (options = this.options);
            options.status || (options.status = {});

            var context = options.context,
                data = options.data,
                that = this,
                promises = [];

            this._getBOWorkspace(context, data)
                .done(function (boWorkspace) {
                    if (boWorkspace) {
                        _.defaults(options.status, {
                            workspaceNode: boWorkspace,
                            viewMode: {
                                mode: data.viewMode ? data.viewMode.mode : 'folderBrowse'
                            }
                        });
                        that.displayWorkspace(options);
                    } else {
                        promises.push(that._getBOEarlyWorkspaces(context, data));
                        promises.push(that._getBOWorkspaceType(context, data));
                        $.when.apply($, promises)
                            .done(function (boEarlyWorkspaces, boWorkspaceType) {
                                if (boEarlyWorkspaces && !!boEarlyWorkspaces.length) {
                                    that._showSelectWorkspaceView(options);
                                } else {
                                    _.defaults(options.status, {
                                        workspaceType: new Backbone.Model({
                                            wksp_type_name: boWorkspaceType.get('wksp_type_name'),
                                            wksp_type_id: boWorkspaceType.get('wksp_type_id'),
                                            rm_enabled: boWorkspaceType.get('rm_enabled'),
                                            template: boWorkspaceType.get('templates')[0],
                                            type: 848
                                        }),
                                        mode: 'directCreate'
                                    });
                                    that._showCreateWorkspaceView(options);
                                }
                            })
                            .fail(function (jqXHR, statusText, error) {
                                if (jqXHR) {
                                    if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                                        ModalAlert.showError(lang.errorGettingBusinessWorkspaceType + ' ' + jqXHR.responseJSON.error);
                                    } else {
                                        ModalAlert.showError(lang.errorGettingBusinessWorkspaceType);
                                    }
                                }
                            });
                    }
                    // remove deletion flag for special handling in _getBOWorkspace() and
                    // _getBOEarlyWorkspaces() after business workspace was deleted
                    delete data.deletecallback;

                })
                .fail(function (jqXHR, statusText, error) {
                    if (jqXHR) {
                        if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                            ModalAlert.showError(lang.errorGettingBusinessWorkspaceType + ' ' + jqXHR.responseJSON.error);
                        } else {
                            ModalAlert.showError(lang.errorGettingBusinessWorkspaceType);
                        }
                    }
                });
        },

        _showCreateWorkspaceView: function (options) {
            this.region.show(new CreateWorkspaceView(options));
        },
        _showDisplayWorkspaceView: function (options) {
            var new_nodeId;
            // for refresh:
            // after CreateWorkspaceView
            if ( options.region.currentView instanceof CreateWorkspaceView ||
                 options.region.currentView instanceof UpdateWorkspaceView) {
                this.region.show(new DisplayWorkspaceView(options));
            }
            // folderBrowse <-> folderBrowse
            else if ( this.region.currentView &&
                 this.region.currentView.browser &&
                 this.options.data.viewMode.mode === 'folderBrowse'  ) {
                new_nodeId = this.options.status.workspaceNode.get('id');
                this.region.currentView.browser.enterContainer(new_nodeId);
            }
            // fullPage <-> fullPage
            else if ( this.region.currentView &&
                      this.region.currentView.browser === undefined &&
                      document.getElementById("xecm-full-page-frame") &&
                      this.options.data.viewMode.mode === 'fullPage' ) {
                // To be changed with XECMPF-1130
                var iFrame =  document.getElementById("xecm-full-page-frame").contentWindow;
                new_nodeId = this.options.status.workspaceNode.get('id');
                var data = {};
                data.action         = 'enterContainer';
                data.id             = new_nodeId;
                // send in iframe for the next node as well the new bus. object type/ID, external system ID
                // and view mode, so the special business workspace delete command can be inserted in the next node
                data.busObjectType 	= this.options.data.busObjectType;
                data.busObjectId 	= this.options.data.busObjectId;
                data.extSystemId 	= this.options.data.extSystemId;
                data.viewMode 		= this.options.data.viewMode.mode;
                if(this.options.data.viewMode.viewIFrame === undefined || this.options.data.viewMode.viewIFrame) {
                    iFrame.postMessage(JSON.stringify(data), "*");
                } else {
                    this.trigger('xecm:change:fullPage', data);
                }
            }
            // folderBrowse <-> fullPage
            else {
                this.region.show(new DisplayWorkspaceView(options));
            }
        },
        _showUpdateWorkspaceView: function (options) {
            var updateView = new UpdateWorkspaceView(options),
                self = this;
            updateView.fetchForm().done(function () {
                self.region.show(updateView);
            });
        },
        _showSelectWorkspaceView: function (options) {
            this.region.show(new SelectWorkspaceView(options));
        },

        _getBOWorkspace: function (context, data) {
            var deferred = $.Deferred();
            var boWorkspace = false;
            var namedSessionStorage = new NamedSessionStorage("create_complete_wksp");
            var wkspDeleted = (this.options.deletecallback||data.deletecallback);

            var collection = context.getCollection(WorkspacesCollectionFactory, {
                attributes: data.busObjectId,
                busObjectId: data.busObjectId,
                busObjectType: data.busObjectType,
                extSystemId: data.extSystemId,
                detached: false // fetching manually
            });
            //if workspace is deleted, navigate to 'Create or Complete Business Workspace widget'
            if(wkspDeleted){
               namedSessionStorage.remove(data.busObjectType+"-"+data.busObjectId);
               // force fetching if bus. object ID is requested again for refresh
               collection.fetched = false;
               // after workspace is deleted remove workspaceNodeId as nodeId will then be set again
               // from return of collection.fetch()
               delete this.options.data.workspaceNodeId;
               deferred.resolve(boWorkspace);
             }

             // workspace not just deleted, but already checked:
            else if(namedSessionStorage.get(data.busObjectType+"-"+data.busObjectId) && !(wkspDeleted)) {
                var workspaceNodeId = namedSessionStorage.get(data.busObjectType+"-"+data.busObjectId);
                boWorkspace = new NodeModel({
                    id: workspaceNodeId,
                    container: true
                })
                deferred.resolve(boWorkspace);
            }
            // SAPRM-12772:
            // if 'workspaceNodeId' property is present, the existance of CS workspace for the BO
            // is already checked from the outer application e.g. by SAP or by fiori/odata
            else if (!!data['workspaceNodeId']) {
                boWorkspace = new NodeModel({
                    id: data.workspaceNodeId,
                    container: true
                })
                deferred.resolve(boWorkspace);
            }

            // else check the existance of CS workspace for the BO
            else {

                collection.ensureFetched()
                    .done(function () {
                        if (collection.length === 1) {
                            var nodeId = collection.at(0).get('id');
                            boWorkspace = new NodeModel({
                                id: nodeId,
                                container: true
                            });
                            namedSessionStorage.set(data.busObjectType+'-'+ data.busObjectId,nodeId);
                        }

                        deferred.resolve(boWorkspace);
                    })
                    .fail(function () {
                        deferred.reject.apply(deferred, arguments);
                    });
            }
            return deferred;
        },
        _getBOEarlyWorkspaces: function (context, data) {
            var deferred = $.Deferred();
            var collection = context.getCollection(WorkspacesCollectionFactory, {
                attributes: 'early',
                early: true,
                busObjectType: data.busObjectType,
                extSystemId: data.extSystemId,
                detached: true // fetching manually
            });

            var promise;
            // if BO Workspace is deleted, then fetch the early workspaces from server again
            if (data.deletecallback || this.options.deletecallback) {
                promise = collection.fetch();
            } else {
                promise = collection.ensureFetched();
            }

            promise
                .done(function () {
                    deferred.resolve(collection);
                })
                .fail(function () {
                    deferred.reject.apply(deferred, arguments);
                });
            return deferred;
        },
        _getBOWorkspaceType: function (context, data) {
            var deferred = $.Deferred();
            var boWorkspaceType = false;
            var collection = context.getCollection(WorkspaceTypeCollectionFactory, {
                busObjectType: data.busObjectType,
                extSystemId: data.extSystemId,
                detached: true // fetching manually
            });
            collection.ensureFetched()
                .done(function () {
                    if (collection.at(0).get('templates').length === 1) {
                        boWorkspaceType = collection.at(0);
                    }
                    deferred.resolve(boWorkspaceType);
                })
                .fail(function () {
                    deferred.reject.apply(deferred, arguments);
                });

            return deferred;
        }
    });

    return DialogController;
});
csui.define('xecmpf/widgets/workspaces/routers/dialog.router',['require',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'xecmpf/widgets/workspaces/controllers/dialog.controller'
], function (require, $, _,
             Marionette,
             DialogController) {

    var DialogRouter = Marionette.AppRouter.extend({

        appRoutes: {
            "": "selectWorkspace",
            "updateWorkspace/": "updateWorkspace",
            "selectWorkspace/": "selectWorkspace",
            "displayWorkspace/": "displayWorkspace",
            "newWorkspace/": "createWorkspace"
        },

        constructor: function DialogRouter(options) {
            this.controller = new DialogController(options);
            Marionette.AppRouter.prototype.constructor.apply(this, arguments);

        },
        execute: function (callback, args, name) {
            if (callback) {
                callback.apply(this, args);
            }
        }

    });

    return DialogRouter;
});


/**
 * Created by cknoblic on 04.10.2016.
 */

csui.define('xecmpf/widgets/workspaces/utils/urlhelper',['module',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/log',
    'csui/utils/base'
], function (module, $, _, log, base) {

    var UrlHelper = {

        getParams: function (location) {
            return location.search.replace('?', '').split('&').reduce(
                function (s, c) {
                    var t = c.split('=');
                    s[t[0].toLowerCase()] = t[1];
                    return s;
                },
                {});
        },
    }
    return UrlHelper;
});

/**
 * Created by cknoblic on 28.09.2016.
 */

csui.define('xecmpf/widgets/workspaces/workspaces.widget',["module", "require", "csui/lib/jquery", "csui/lib/underscore",
  "csui/lib/marionette", "csui/utils/log",
  "csui/lib/backbone",
  'xecmpf/widgets/workspaces/routers/dialog.router',
  'xecmpf/widgets/workspaces/controllers/dialog.controller',
  'xecmpf/widgets/workspaces/utils/urlhelper',
  'csui/utils/commands',
  'csui/integration/folderbrowser/commands/go.to.node.history',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/user',
  'xecmpf/widgets/workspaces/pages/select.workspace/select.workspace.view'
], function (module, _require, $, _, Marionette, log,
    Backbone,
    DialogRouter,
    DialogController,
    UrlHelper,
    Commands,
    GoToNodeHistoryCommand,
    ConnectorFactory,
    UserModelFactory,
    SelectWorkspaceView) {

  var SlideTransitionRegion = Backbone.Marionette.Region.extend({

    show: function (view) {
      this._ensureElement();
      view.render();
      this.close(function () {
        this.currentView = view;
        this.open(view, function () {
          if (view instanceof SelectWorkspaceView) {
            Marionette.triggerMethodOn(view, 'show');
          }
        });
      });

    },
    // slide out
    close: function (cbOpen) {
      var view = this.currentView,
          that = this;

      delete this.currentView;
      // there is only one view  ==> display it
      if (!view) {
        if (cbOpen) {
          cbOpen.call(this);
        }
        return;
      }
      // close "old" view
      view.$el.hide('slide', {
        direction: 'left',
        complete: function () {

          if (view.destroy) {
            view.destroy();
          }
          // ==> display new view
          if (cbOpen) {
            cbOpen.call(that);
          }
        }
      }, 250);

    },
    // slide in
    open: function (view, cbDomRefresh) {
      var that = this;
      this.$el.hide();

      this.$el.html(view.$el);

      Marionette.triggerMethodOn(view, 'before:show');
      Marionette.triggerMethodOn(view, 'show');
      Marionette.triggerMethodOn(view, 'dom:refresh');

      this.$el.show('slide', {
        direction: 'right',
        complete: function () {
          if (cbDomRefresh) {
            cbDomRefresh.call(that);
          }
        }

      }, 250);
    }
  });

  function CompleteCreateWorkspaceWidget(options) {
    options || (options = {});
    var params = UrlHelper.getParams(window.location);
    if (_.isEmpty(options.data) && !_.isEmpty(params)) {
      this.options = _.defaults({}, options,
          {
            data: {
              busObjectId: params.busobjectid,
              busObjectType: params.busobjecttype,
              extSystemId: params.extsystemid
            }
          }
      );
    } else {
      this.options = options;
    }

    this.options.context.user = this.options.context.getModel(UserModelFactory);

  }

  _.extend(CompleteCreateWorkspaceWidget.prototype, {

    refresh: function(options){

      if ( options.data.busObjectId && options.data.busObjectType && options.data.extSystemId ) {
        // remove former workspace, so it can be reset in dialog.controller in selectWorkspace
        // with _.default() after refetch
        if (this.options.status.workspaceNode) {
          delete this.options.status.workspaceNode;
        }

        if (this.options.data.workspaceNodeId){
          delete this.options.data.workspaceNodeId;
        }

        // Point to new bus. object
        this.options.data.busObjectType   = options.data.busObjectType;
        this.options.data.extSystemId	  = options.data.extSystemId;
        this.options.data.busObjectId     = options.data.busObjectId;
      }

      // reset backcommand and history command
      var backCommand = Commands.get('Back');
      if (backCommand &&
            backCommand.clearHistory &&
            this.region.currentView.browser ) {
          backCommand.clearHistory( this.region.currentView.browser.options.context  );
      }
      var goToNodeHistoryCommand = new GoToNodeHistoryCommand();
      goToNodeHistoryCommand.clearHistory(this.options.context);

      // reset viewMode folderBrowse/fullPage
      if (options.data.viewMode  ){
        this.options.data.viewMode = {};
        this.options.data.viewMode.mode   = options.data.viewMode;
      }

      this.show(this.options);

    },

    show: function (options) {
      var that = this;
      var receiveMessage = function (event) {
        try {
          var connector  = that.options.context.getObject(ConnectorFactory),
              connection = connector.getConnectionUrl(),
                        urlProtocol          = connection.getProtocol(),
                        urlHost              = connection.getHost(),
                        urlOrigin            = urlProtocol + '://' + urlHost;
          if (connection.getOrigin().toLowerCase() === event.origin.toLowerCase() || urlOrigin.toLowerCase() === event.origin.toLowerCase()) {
            // from workspace.delete.js we get a string
            if (typeof event.data === 'string' || event.data instanceof String) {
              var callbackOptions = JSON.parse(event.data);
              if (callbackOptions.busObjectId &&
                  callbackOptions.busObjectType &&
                  callbackOptions.extSystemId) {
                // XECMPF-1548: in case of fullPage overlay, close the dialog after bus.wksp. deletion
                var oDialogClose = $(".xecm-modal-header .cs-close");
                if ( oDialogClose.length > 0 )  {
                  oDialogClose.trigger("click");
                }
                // XECMPF-1548
                var iFrame = $("#xecm-full-page-frame");
                if (iFrame.length > 0 ) {
                  iFrame.remove();
                }

                // CreateWorkspaceView should be displayed after delete:
                _.defaults(that.options.data, {
                  deletecallback: true
                });
                that.showView(that, callbackOptions);
              }
            }
          }
        } catch (e) {
          console.log(event);
        }
      };
      window.addEventListener("message", receiveMessage, false);
      this.showView(this, options);
    },

    showView: function (self, options) {
      if (!self.region) {
        self.region = new SlideTransitionRegion({el: options.placeholder});
      }
      _.defaults(self.options, options, {
        region: self.region
      });
      self.options.status = self.options.status || {};
      // dialog controller
      _.defaults(self.options.status, {
        wksp_controller: new DialogController(self.options)
      });
      self.options.status.wksp_controller.selectWorkspace(self.options);
    },

    close: function(){
      // Allow calling this method multiple times without error
      if (this.region && this.region.currentView) {
        // Destroy the application widget
        if ( this.region.currentView.content ) {
          this.region.currentView.content.destroy();
        }
        if (this.region.currentView.browser) {
          this.region.currentView.browser.destroy()
        }
        this.region.currentView.destroy();
        this.region.destroy();
        this.region = null;
      }
      return this;
    }

  });

  CompleteCreateWorkspaceWidget.version = '1.0';
  return CompleteCreateWorkspaceWidget;
});


// Lists explicit locale mappings and fallbacks
csui.define('xecmpf/widgets/myattachments/nls/myattachments.lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false,    
});

//define({ "root": true });

// Defines localizable strings in the default language (English)
csui.define('xecmpf/widgets/myattachments/nls/root/myattachments.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false,
  "attachmentsTabTitle": "Business Objects",
  "ErrorLoadingAddItemMenu": 'Cannot load business object types to the Add menu.',
  "DetachBusinessAttachment": "Detach",
  "GoToWorkspace":            "Go to Workspace",
  "OpenSapObject":            "Display",
  "AddBusinessAttachment":    "Add Business Object",
  "ErrorCreatingBusAttachment":  "Cannot create business attachment.",
  "BOSearchTitle":             "Search business objects",
  "noBusinessAttachmentsAvailable": "Add business objects to this Content Server item.",
  "tableColumnSearchNoResult": "No results found."
});


csui.define('xecmpf/utils/commands/myattachments/detach_myattachment',['module', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commands/confirmable',
    'csui/utils/command.error',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, CommandModel, CommandHelper, $, _, ConfirmableCommand, CommandError, lang) {
    'use strict';

    var messageHelper;
    var globalMessage;
    var base;
    var globals = {};

    // Dependencies initialized during execution

    var DetachAttachmentCommand = CommandModel.extend({

        defaults: {
            signature: 'detach_business_attachment',
            command_key: ['detach_business_attachment'],
            name: lang.CommandNameDetach,
            pageLeavingWarning: lang.DetachPageLeavingWarning,
            scope: 'multiple',
            doneVerb: lang.CommandDoneVerbDetached,
            successMessages: {
                formatForNone: lang.DetachBusAttsNoneMessage,
                formatForOne: lang.DetachOneBusAttSuccessMessage,
                formatForTwo: lang.DetachSomeBusAttsSuccessMessage,
                formatForFive: lang.DetachManyBusAttsSuccessMessage
            },
            errorMessages: {
                formatForNone: lang.DetachBusAttsNoneMessage,
                formatForOne: lang.DetachOneBusAttFailMessage,
                formatForTwo: lang.DetachSomeBusAttsFailMessage,
                formatForFive: lang.DetachManyBusAttsFailMessage
            }
        },

        _getConfirmTemplate: function (status, options) {
            return _.template("<span class='msgIcon WarningIcon'><%- message %></span>");
        },

        _getConfirmData: function (status, options) {
            var nodes = CommandHelper.getAtLeastOneNode(status);
            return {
                title: lang.DetachBusAttsCommandConfirmDialogTitle,
                message: nodes.length === 1 ?
                    _.str.sformat(lang.DetachBusAttsCommandConfirmDialogSingleMessage,
                        nodes.at(0).get('name')) :
                    _.str.sformat(lang.DetachBusAttsCommandConfirmDialogMultipleMessage, nodes.length)
            };
        },

        enabled: function (status, options) {
            var node = CommandHelper.getJustOneNode(status),
			signature = 'delete_business_attachment',
			action = this._getNodeActionForSignature(node, signature);
			if (action) {
				return true;
			} else {
				return false;
			}
        },

        // Perform the detach action. Return a promise, which is resolved with the detached node if
        // successful or rejected with the error.
        // Note, that the node is used later to display the name of the detached item.
        _performAction: function (model, options) {
            var self = this;
            var node = model.node;
            var d = $.Deferred();
            var collection = node.collection;
            if (collection) {
                var jqxhr = node.destroy({
                    wait: true
                })
                    .done(function () {
                        model.set('count', 1);
                        model.deferred.resolve(model);
                        d.resolve(node);
                    })
                    .fail(function (error) {
                        var cmdError = error ? new CommandError(error, node) : error;
                        model.deferred.reject(model, cmdError);
                        if (!error) {
                            jqxhr.abort();
                        }
                        d.reject(cmdError);
                    });
                return d.promise();
            }
            else {
                return d.reject(
                    new CommandError(_.str.sformat(lang.CommandFailedSingular, node.get('name'),
                        lang.CommandVerbDetach), {errorDetails: "collection is undefined"}));
            }
        },

        startGlobalMessage: function (uploadCollection) {
            globalMessage.showFileUploadProgress(uploadCollection, {
                oneFileTitle: lang.DetachingOneBusAtt,
                oneFileSuccess: lang.DetachOneBusAttSuccessMessage,
                multiFileSuccess: lang.DetachManyBusAttsSuccessMessage,
                oneFilePending: lang.DetachingOneBusAtt,
                multiFilePending: lang.DetachBusAtts,
                oneFileFailure: lang.DetachOneBusAttFailMessage,
                multiFileFailure: lang.DetachManyBusAttsFailMessage2,
                someFileSuccess: lang.DetachSomeBusAttsSuccessMessage,
                someFilePending: lang.DetachingSomeBusAtts,
                someFileFailure: lang.DetachSomeBusAttsFailMessage2,
                enableCancel: false
            });

        },

        _removeBusAtt: function (model) {
            // this.collection.destroy(model);
            return (model.destroy({wait: true}));
        },

        _getRespError: function (resp) {
            var error = '';
            if (resp && resp.responseJSON && resp.responseJSON.error) {
                error = resp.responseJSON.error;
            } else if (base.messageHelper.hasMessages()) {
                error = $(base.messageHelper.toHtml()).text();
                base.messageHelper.clear();
            }
            return error;
        },

        _announceStart: function (status) { //, PageLeavingBlocker) {
            var originatingView = status.originatingView;
            if (originatingView && originatingView.blockActions) {
                originatingView.blockActions();
            }
            var pageLeavingWarning = this.get('pageLeavingWarning');
            if (pageLeavingWarning) {
                this.PageLeavingBlocker.enable(pageLeavingWarning);
            }
        },

        _announceFinish: function (status) {
            var pageLeavingWarning = this.get('pageLeavingWarning');
            if (pageLeavingWarning) {
                this.PageLeavingBlocker.disable();
            }
            var originatingView = status.originatingView;
            if (originatingView && originatingView.unblockActions) {
                originatingView.unblockActions();
            }
        }
    });

    _.extend(DetachAttachmentCommand.prototype, ConfirmableCommand, {
        execute: function (status, options) {
            var nodes    = CommandHelper.getAtLeastOneNode(status),
                node     = nodes.length === 1 && nodes.first(),
                deferred = $.Deferred(),
                commandData = status.data || {};
            var showProgressDialog = (commandData.showProgressDialog != null)? commandData.showProgressDialog: true;
            this.showProgressDialog = showProgressDialog;
            // avoid messages from handleExecutionResults
            status.suppressFailMessage = true;
            status.suppressSuccessMessage = true;
            status.suppressMultipleFailMessage = true;
            ConfirmableCommand.execute
                .apply(this, arguments)
                .done(function (results) {
                    showProgressDialog && globalMessage.hideFileUploadProgress();
                    deferred.resolve(results);
                })
                .fail(function (args) {
                    //only return a result if there is at least one successful delete.
                    //This way the waiting CommandHelper in the tabletoolbar.view will trigger
                    //an execute complete event.
                    var oneSuccess = args && _.find(args, function (result) {
                            return !(result instanceof CommandError);
                        });
                    var rejectResults = oneSuccess ? oneSuccess: args;
                    deferred.reject(rejectResults);
                });
            return deferred.promise();
        },

        _performActions: function (status, options) {
            var deferred = $.Deferred(),
                self = this;
            csui.require(['csui/utils/taskqueue', 'csui/utils/page.leaving.blocker', 'csui/models/fileuploads',
                    "csui/utils/commands/multiple.items",
                    'csui/controls/globalmessage/globalmessage',
                    'csui/utils/messagehelper',
                    'csui/utils/base'
                ], function (TaskQueue, PageLeavingBlocker, UploadFileCollection, MultipleItemsCommand, GlobalMessage, MessageHelper, base) {
                    messageHelper = MessageHelper;
                    globalMessage = GlobalMessage;
                    base = base;
                    self.PageLeavingBlocker = arguments[1];

                    var busAtts = CommandHelper.getAtLeastOneNode(status);
                    var models = busAtts.models;
                    // var models = status.nodes.models;
                    var nodes = _.map(models, function (node) {
                        return {
                            name: node.get('name'),
                            state: 'pending',
                            count: 0,
                            total: 1,
                            node: node
                        };
                    });
                    var connector = models && models[0] && models[0].connector;
                    var uploadCollection = new UploadFileCollection(nodes, {connector: connector});
                    var newStatus = _.defaults({nodes: uploadCollection}, status);
                    // TODO: Make the progressbar a reusable component; do not
                    // misuse the file-upload-progressbar for other scenarios.
                    // TODO: Handle this in the multi-item command to be consistent
                    // with other commands; do not override the detach command only.
                    uploadCollection.each(function (fileUpload) {
                        // Replace the new node in the file upload model with the existing
                        // one to be able to destroy it; sync and destroy events will be
                        // triggered on it and the parent collection and view will see them.
                        var node = fileUpload.get('node');
                        fileUpload.node = node;
                        fileUpload.unset('node');
                    });
                    self.startGlobalMessage(uploadCollection);
                    MultipleItemsCommand._performActions.call(self, newStatus, options)
                        .done(function (results) {
                            globalMessage.hideFileUploadProgress();
                            deferred.resolve(results);
                        })
                        .fail(function (errors) {
                            deferred.reject(errors);
                        });
                },
                function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise();

        }
        
    });
    
    return DetachAttachmentCommand;

});


csui.define('xecmpf/utils/commands/myattachments/go_to_workspace',['module', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, CommandModel, CommandHelper, _, $, lang) {
    'use strict';
    //
    // var config = _.defaults({}, module.config(), {
    //     openInNewTab: false
    // });

    var GoToWorkspaceCommand = CommandModel.extend({

        defaults: {
            signature: 'go_to_workspace',
            command_key: ['go_to_workspace'],
            name: lang.CommandNameGoToWorkspace, 
            scope: 'single'
        },

        enabled: function (status) {
            var node = CommandHelper.getJustOneNode(status),
			signature = this.get('command_key'),
			action = this._getNodeActionForSignature(node, signature);
			if (action) {
				return true;
			} else {
				return false;
			}
        },

        execute: function (status, options) {
            var busAtt = CommandHelper.getJustOneNode(status);
            return this._navigateTo(busAtt, status, options);
        },

        // openInNewTab: function () {
        //     return config.openInNewTab;
        // },

        _navigateTo: function (busAtt, status, options) {
            var deferred = $.Deferred(),
                context = status.context || status.originatingView.options.context,
                wkspNodeId = busAtt.get('wksp_id'); // Get BWs ID from the business attachment
            // Require additional modules dynamically, which needed
            // for the command execution only
            csui.require(['csui/lib/backbone', 'csui/utils/contexts/factories/connector',
                'csui/models/node/node.model', 'csui/utils/commands/browse'
            ], function (Backbone, ConnectorFactory, NodeModel, BrowseCommand) {
                var connector = context.getObject(ConnectorFactory),
                    otherNode = new NodeModel({id: wkspNodeId}, {connector: connector}),
                    browseCommand = new BrowseCommand();
                browseCommand
                    .execute({
                        nodes: new Backbone.Collection([otherNode]),
                        context: context
                    });
            }, function(error) {
                console.log(error);
                deferred.reject();
            });
            return deferred.promise();
        }

    });

    return GoToWorkspaceCommand;

});

csui.define('xecmpf/utils/commands/myattachments/open_sap_object',['module', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, CommandModel, CommandHelper, _, $, lang) {
    'use strict';

    var config = _.defaults({}, module.config(), {
        openInNewTab: true
    });

    var OpenSapObjectCommand = CommandModel.extend({

        defaults: {
            signature: 'open_sap_object',
            command_key: ['open_sap_object'],
            name: lang.CommandNameOpenSapObject,
            scope: 'single'
        },

        enabled: function (status) {
            var node = CommandHelper.getJustOneNode(status),
			signature = this.get('command_key'),
			action = this._getNodeActionForSignature(node, signature);
			if (action) {
				var currAction = node.actions && node.actions.findRecursively(signature);
				if (currAction.get('href')) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
        },

        execute: function (status, options) {
            var busAtt = CommandHelper.getJustOneNode(status);
            return this._navigateTo(busAtt, options);
        },

        openInNewTab: function () {
            return config.openInNewTab;
        },

        _navigateTo: function (busAtt, options) {
            var action = busAtt.actions.findRecursively(this.attributes.signature);
            var url = action.get('href');

            if (this.openInNewTab() === true) {
                var browserTab = window.open(url, '_blank');
                browserTab.focus();
            } else {
                location.href = url;
            }

            return $.Deferred().resolve().promise();
        }

    });

    return OpenSapObjectCommand;

});

csui.define('xecmpf/utils/commands/myattachments/add_myattachment',['require', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commands/confirmable',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (require, CommandModel, CommandHelper, $, _, ConfirmableCommand, lang) {
    'use strict';

    var AttachmentModel;
    var messageHelper;
    var globalMessage;
    var commandError;
    var base;
    var globals = {};

    var AddAttachmentCommand = CommandModel.extend({

        defaults: {
            signature: 'add_business_attachment',
            command_key: ['add_business_attachment'],
            name: lang.CommandNameAttach,
            scope: 'multiple',
            doneVerb: lang.CommandDoneVerbAttached,
            successMessages: {
                formatForNone: lang.AttachBusAttsNoneMessage,
                formatForOne:  lang.AttachOneBusAttSuccessMessage,
                formatForTwo:  lang.AttachSomeBusAttsSuccessMessage,
                formatForFive: lang.AttachManyBusAttsSuccessMessage
            },
            errorMessages: {
                formatForNone: lang.AttachBusAttsNoneMessage,
                formatForOne:  lang.AttachOneBusAttFailMessage,
                formatForTwo:  lang.AttachSomeBusAttsFailMessage,
                formatForFive: lang. AttachManyBusAttsFailMessage
            }
        },

        _getConfirmTemplate: function (status, options) {
            return _.template(lang.AttachBusAttsCommandConfirmDialogHtml);
        },

        _getConfirmData: function (status, options) {
            var nodes = CommandHelper.getAtLeastOneNode(status);
            return {
                title: lang.AttachBusAttsCommandConfirmDialogTitle,
                message: nodes.length === 1 ?
                         _.str.sformat(lang.AttachBusAttsCommandConfirmDialogSingleMessage,
                             nodes.at(0).get('name')) :
                         _.str.sformat(lang.AttachBusAttsCommandConfirmDialogMultipleMessage, nodes.length)
            };
        },

        enabled: function (status) {
            if (status.container.busatts.actions) {
                var add = _.has(status.container.busatts.actions.data, this.defaults.signature);
                if (add) {
                    return true;
                }
                else {

                    return false;
                }
            }
            return false;
        },
    });

    _.extend( AddAttachmentCommand.prototype, ConfirmableCommand, {
        execute: function (status, options) {

            return (this._referenceSearchOpen(status, options));

        },

        _referenceSearchOpen: function (status, options) {
            var deferred = $.Deferred();
            var self = this;
            csui.require([
                    'csui/utils/contexts/factories/connector',
                    'i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
                    'xecmpf/widgets/myattachments/metadata.attachment.model',
                    'xecmpf/controls/bosearch/bosearch.model',
                    'xecmpf/controls/bosearch/bosearch.dialog.controller',
                    'csui/utils/command.error',
                ], function (ConnectorFactory, lang, AttachmentModelLocal,
                             BoSearchModel, BOSearchDialogController, CommandError) {
                    AttachmentModel = AttachmentModelLocal;
                    commandError = CommandError;
                    self.connector = options.context.getObject(ConnectorFactory);
                    self.collection = status.data.collection;

                    self.boSearchModel = new BoSearchModel(status.data.boType, {
                        connector: self.connector
                    });

                    // Check whether the bus. att. control is executed w/o sidebar
                    var htmlPlace;
                    htmlPlace = ".cs-metadata:has(> .metadata-content-wrapper)";

                    self.boSearchDialogController = new BOSearchDialogController({
                        context: options.context,
                        htmlPlace: htmlPlace,
                        multipleSelect: true,
                        mode: 'business_attachment_add',
                        boSearchModel: self.boSearchModel,
                        title: lang.BOSearchTitle
                    });
                    self.status = status;
                    // SAPRM-9320: together with this topic the events are aligned
                    //self.listenTo(self.boSearchModel, "reference:selected", self._referenceSearchAttach);
                    self.listenTo(self.boSearchModel, "boresult:select", self._referenceSearchAttach);
                    // End of SAPRM-9320
                    self.boSearchModel.trigger("reference:search");
                    deferred.resolve();
                },
                function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise();
        },

        _referenceSearchAttach: function (selected) {
            var deferred = $.Deferred(),
                self = this;
            csui.require(['csui/utils/page.leaving.blocker',
                    'csui/models/fileuploads',
                    "csui/utils/commands/multiple.items",
                    'csui/controls/globalmessage/globalmessage',
                    'csui/utils/messagehelper',
                    'csui/utils/command.error',
                    'csui/utils/base'
                ], function (PageLeavingBlocker, UploadFileCollection, MultipleItemsCommand, GlobalMessage, MessageHelper, CommandError, base) {
                    messageHelper = MessageHelper;
                    globalMessage = GlobalMessage;
                    commandError = CommandError;
                    base = base;
                    var options;
                    self.PageLeavingBlocker = arguments[1];
                    // SAPRM-9320:
                    // close the bo search dialog
                    self.boSearchModel.trigger("reference:selected");
                    if (selected.selectedItems) {
                        var models = selected.selectedItems;
                        var nodes = _.map(models, function (node) {
                            return {
                                name: node.get('businessObjectId'),
                                state: 'pending',
                                count: 0,
                                total: 1,
                                node: node
                            };
                        });
                        var connector = models && models[0] && models[0].connector;
                        var uploadCollection = new UploadFileCollection(nodes, {connector: connector});
                        var newStatus = _.defaults({nodes: uploadCollection}, status);
                        // prevent multiple messages:
                        newStatus.suppressMultipleFailMessage = true;
                        // TODO: Make the progressbar a reusable component; do not
                        // misuse the file-upload-progressbar for other scenarios.
                        // TODO: Handle this in the multi-item command to be consistent
                        // with other commands; do not override the attach command only.
                        uploadCollection.each(function (fileUpload) {
                            // Replace the new node in the file upload model with the existing
                            // one to be able to destroy it; sync and destroy events will be
                            // triggered on it and the parent collection and view will see them.
                            var node = fileUpload.get('node');
                            fileUpload.node = node;
                            fileUpload.unset('node');
                        });
                        self.startGlobalMessage(uploadCollection);
                        MultipleItemsCommand._performActions.call(self, newStatus, options)
                            .done(function (results) {
                                globalMessage.hideFileUploadProgress();
                                deferred.resolve(results);
                            })
                            .fail(function (errors) {
                                deferred.reject(errors);
                            });
                    }
                },
                function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise();

        },

        startGlobalMessage: function (uploadCollection) {
            globalMessage.showFileUploadProgress(uploadCollection, {
                oneFileTitle: lang.AttachingOneBusAtt,
                oneFileSuccess: lang.AttachOneBusAttSuccessMessage,
                multiFileSuccess: lang.AttachManyBusAttsSuccessMessage,
                oneFilePending: lang.AttachingOneBusAtt,
                multiFilePending: lang.AttachBusAtts,
                oneFileFailure: lang.AttachOneBusAttFailMessage,
                multiFileFailure: lang.AttachManyBusAttsFailMessage2,
                someFileSuccess: lang.AttachSomeBusAttsSuccessMessage,
                someFilePending: lang.AttachingSomeBusAtts,
                someFileFailure: lang.AttachSomeBusAttsFailMessage2,
                enableCancel: false
            });

        },

        // Perform the attach action. Return a promise, which is resolved with the attached node if
        // successful or rejected with the error.
        // Note, that the node is used later to display the name of the attached item.
        _performAction: function (model, options) {
            var node = model.node;
            var d = $.Deferred();
            var self = this;
            if (this.collection) {
                var ext_system_id = this.boSearchModel.get('ext_system_id'),
                    bo_type = this.boSearchModel.get('bo_type'),
                    comment = '';

                var bo_id = node.get('businessObjectId');
                var id = ext_system_id + bo_type + bo_id;
                var obody = {
                    "ext_system_id": ext_system_id,
                    "bo_type": bo_type,
                    "bo_id": bo_id,
                    "comment": comment
                };
                var busAttModel = new AttachmentModel(obody, { collection: this.collection, connector: this.connector});
                busAttModel.isLocallyCreated = true;

                busAttModel.save({wait: true, silent: true})
                    .done(function (args) {
                        self.collection.add(busAttModel, {at: 0});
                        model.set('count', 1);
                        model.deferred.resolve(model);
                        d.resolve(node);
                    })
                    .fail(function (error) {
                        var cmdError = error ? new commandError(error, node) : error;
                        model.deferred.reject(model, cmdError);
                        d.reject(cmdError);
                    });
                return d.promise();
            }
            else {
                return d.reject(
                    new commandError(_.str.sformat(lang.CommandFailedSingular, node.get('name'),
                        lang.CommandVerbAttach), {errorDetails: "collection is undefined"}));
            }
        },


        _announceStart: function (status) {
            var originatingView = status.originatingView;
            if (originatingView && originatingView.blockActions) {
                originatingView.blockActions();
            }
            var pageLeavingWarning = this.get('pageLeavingWarning');
            if (pageLeavingWarning) {
                this.PageLeavingBlocker.enable(pageLeavingWarning);
            }
        },

        _announceFinish: function (status) {
            if (this.get('pageLeavingWarning')) {
                this.PageLeavingBlocker.disable();
            }
            var originatingView = status.originatingView;
            if (originatingView && originatingView.unblockActions) {
                originatingView.unblockActions();
            }
        }

    });


    return AddAttachmentCommand;

})
;

csui.define('xecmpf/utils/commands/myattachments',['csui/lib/underscore', 'csui/models/commands',
    'xecmpf/utils/commands/myattachments/detach_myattachment',
    'xecmpf/utils/commands/myattachments/go_to_workspace',
    'xecmpf/utils/commands/myattachments/open_sap_object',
    'xecmpf/utils/commands/myattachments/add_myattachment'
], function (_, CommandCollection,
             DetachAttachmentCommand,
             GoToWorkspaceCommand,
             OpenSapCommand,
             AddAttachmentCommand
) {
    'use strict';

    var commands = new CommandCollection([
        new DetachAttachmentCommand(),
        new GoToWorkspaceCommand(),
        new OpenSapCommand(),
        new AddAttachmentCommand()
    ]);

    return commands;

});
csui.define('xecmpf/widgets/myattachments/metadata.attachments.columns',["csui/lib/backbone"],
    function (Backbone) {

        var TableColumnModel = Backbone.Model.extend({

            idAttribute: "key",

            defaults: {
                key: null,  // key from the resource metadata
                sequence: 0 // smaller number moves the column to the front
            }

        });

        var TableColumnCollection = Backbone.Collection.extend({

            model: TableColumnModel,
            comparator: "sequence",

            getColumnKeys: function () {
                return this.pluck('key');
            },

            deepClone: function () {
                return new TableColumnCollection(
                    this.map(function (column) {
                        return column.attributes;
                    }));
            }
        });

        // Fixed (system) columns have sequence number < 100, dynamic columns
        // have sequence number > 1000

        var tableColumns = new TableColumnCollection([

            {
                key: 'bo_id',
                sequence: 10
            },
            {
                key: 'name',
                sequence: 20
            },
            {
                key: 'ext_system_name',
                sequence: 30
            },
            {
                key: 'create_date',
                sequence: 40
            },
            {
                key: 'created_by_name',
                sequence: 50
            },
            {
                key: 'comment',
                sequence: 60
            }
        ]);

        return tableColumns;

    });


csui.define('css!xecmpf/widgets/myattachments/metadata.attachments',[],function(){});
csui.define('xecmpf/widgets/myattachments/metadata.attachments.toolbaritems',['csui/lib/underscore',
    'i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
    'csui/controls/toolbar/toolitems.factory',
    'css!xecmpf/widgets/myattachments/metadata.attachments'
], function (_, lang, ToolItemsFactory) {

    var toolbarItems = {
        addToolbar: new ToolItemsFactory({
                add: [
                    //{signature: "AddFolder", name: lang.ToolbarItemAddFolder},
                    //{signature: "AddDocument", name: lang.ToolbarItemAddDocument}
                ]
            },
            {
                maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
                dropDownIcon: "icon icon-toolbarAdd",
                dropDownText: lang.AddBusinessAttachment,
                addTrailingDivider: false

            }),

        otherToolbar: new ToolItemsFactory(
            {
                main: [
                    {
                        signature: "detach_business_attachment",
                        name: lang.DetachBusinessAttachment,
                        //  icon: "icon icon-toolbar-metadata",
                        scope: "multiple",
                        verb: "detach_business_attachment"
                    },
                    {
                        signature: "open_sap_object",
                        name: lang.OpenSapObject
                    },
                    {
                        signature: "go_to_workspace",
                        name: lang.GoToWorkspace
                    }
                ]
            },
            {
                maxItemsShown: 5,
                dropDownIcon: "icon icon-toolbar-more"
            }),
        // inline action bar
        inlineActionbar: new ToolItemsFactory({
                other: [
                    {
                        signature: "detach_business_attachment",
                        name: lang.DetachBusinessAttachment,
                        verb: "detach_business_attachment",
                        icon: "icon icon-toolbar-detach"
                    },
                    {
                        signature: "open_sap_object",
                        name: lang.OpenSapObject,
                        icon: "icon icon-toolbar-preview"
                    },
                    {
                        signature: "go_to_workspace",
                        name: lang.GoToWorkspace,
                        icon: "icon icon-toolbar-workspace"
                    }
                ]
            },
            {
                maxItemsShown: 5,
                dropDownText: lang.ToolbarItemMore,
                dropDownIcon: "icon icon-toolbar-more"
            })
    };

    return toolbarItems;

});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/myattachments/metadata.attachments',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-metadata-myattachments\">\r\n  <div id=\"att-tabletoolbar\"></div>\r\n  <div id=\"att-tableview\"></div>\r\n  <div id=\"att-paginationview\"></div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_myattachments_metadata.attachments', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/myattachments/metadata.attachments.view',["module", "csui/lib/jquery", "csui/lib/underscore", 'csui/lib/marionette',
    'csui/controls/tabletoolbar/tabletoolbar.view',
    'csui/controls/tableactionbar/tableactionbar.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/controls/table/table.view', 'csui/controls/pagination/nodespagination.view',
    'xecmpf/utils/commands/myattachments', 'csui/models/columns',
    'xecmpf/widgets/myattachments/metadata.nodeattachments.model', 'xecmpf/widgets/myattachments/metadata.attachment.model',
    'xecmpf/widgets/myattachments/metadata.attachments.columns',
    'xecmpf/widgets/myattachments/metadata.attachments.toolbaritems',
    'hbs!xecmpf/widgets/myattachments/metadata.attachments',
    'csui/controls/toolbar/toolitem.model',
    'csui/controls/globalmessage/globalmessage',
    'csui/controls/toolbar/toolbar.command.controller',
    'csui/utils/url',
    'csui/utils/base',
    'i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
    'csui/controls/tile/behaviors/perfect.scrolling.behavior',
    'css!xecmpf/widgets/myattachments/metadata.attachments'

], function (module, $, _, Marionette,
             TableToolbarView,
             TableActionBarView,
             LayoutViewEventsPropagationMixin,
             TableView,
             PaginationView,
             commands,
             NodeColumnCollection,
             NodeAttachmentsCollection,
             AttachmentModel,
             metadataAttachmentsColumns,
             toolbarItems,
             template,
             ToolItemModel,
             GlobalMessage,
             ToolbarCommandController,
             Url,
             base,
             lang,
             PerfectScrollingBehavior) {
    'use strict';

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30,
        showInlineActionBarOnHover: !base.isTouchBrowser(),
        forceInlineActionBarOnClick: false,
        inlineActionBarStyle: "csui-table-actionbar-bubble",
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false
    });


    var MetadataAttachmentsTableView = Marionette.LayoutView.extend({

        className: 'metadata-inner-wrapper',
        template: template,

        ui: {
            tableView: '#att-tableview',
            childContainer: '#att-tableview',
            paginationView: '#att-paginationview'
        },

        regions: {
            tableToolbarRegion: '#att-tabletoolbar',
            tableRegion: '#att-tableview',
            paginationRegion: '#att-paginationview'
        },

        constructor: function MetadataAttachmentsTableView(options) {
            MetadataAttachmentsTableView.__super__.constructor.call(this, options);

            this.options.data || (this.options.data = {});
            _.defaults(this.options.data, {
                pageSize: config.defaultPageSize || 30,
            });

            this.commands = commands;
            this.collection = new NodeAttachmentsCollection(undefined, {
                node: this.options.model,
                autoreset: true,
                expand: "user",
                commands: this.commands,
                onlyClientSideDefinedColumns: true  // ignore columns sent by server
            });

            // SAPRM-8811: for pagination we need an additonal collection.fetch after
            //             detaching all items of a page
            this.commandController = new ToolbarCommandController({commands: this.commands});
            this.listenTo(this.commandController, 'after:execute:command', this._toolbarActionTriggered);

            this.behaviors = _.extend({
                PerfectScrolling: {
                    behaviorClass: PerfectScrollingBehavior,
                    contentParent: '> .tab-content',
                    scrollXMarginOffset: 30,
                    // like bottom padding of container, otherwise scrollbar is shown always
                    scrollYMarginOffset: 15
                }
            }, this.behaviors);

            this.options.model.busatts = this.collection;  // connect bus.attachment collection with node

            this._setToolBar();
            this._setTableView();
            this._setPagination();

            this.setActionBarEvents();

            this.collection.fetch();

            // Cause the show events triggered on the parent view re-triggered
            // on the views placed in the inner regions
            this.propagateEventsToRegions();
        },

        onRender: function () {
            this.tableToolbarRegion.show(this.tableToolbarView);
            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);
        },

        // controller for the toolbar actions
        _toolbarActionTriggered: function (toolbarActionContext) {
            if (toolbarActionContext) {
                switch (toolbarActionContext.commandSignature) {
                case 'detach_business_attachment':
                    this.collection.fetch();
                    break;
                }
            }
        },

        _buildToolbarItems: function () {
            var deferred = $.Deferred();
            var getBoTypesUrl = Url.combine(this.model.urlBase(), 'addablebotypes');
            getBoTypesUrl = getBoTypesUrl.replace('/v1', '/v2');
            var ajaxOptions = {
                type: 'GET',
                url: getBoTypesUrl
            };

            var that = this;
            this.model.connector.makeAjaxCall(ajaxOptions)
                .done(function (response, statusText, jqxhr) {
                    var toolItems = [];
                    if (response && response.results && response.results.length > 0) {                        
                        response.results.forEach(function (boTypeRes) {
                            var toolItem = new ToolItemModel({
                                signature: 'add_business_attachment',
                                name: boTypeRes.data.properties.bo_type_name,
                                type: 123, //addType,
                                group: 'add',
                                commandData: {
                                    boType: boTypeRes.data.properties,
                                    node_id: that.model.get('id'),
                                    collection: that.collection
                                }
                            });
                            toolItems.push(toolItem);
                        });

                        // sort toolbarItems
                        if (toolItems.length > 0) {
                            toolItems.sort(function (a, b) {
                                var aname = a.get("name"),
                                    bname = b.get("name"),
                                    result = base.localeCompareString(aname, bname, {usage: "sort"});
                                return result;
                            });
                        }                        
                    }
                    toolbarItems.addToolbar.reset(toolItems);
                    deferred.resolve.apply(deferred, arguments);
                })
                .fail(function (jqXHR, statusText, error) {

                    // show failure message
                    var linesep = "\r\n",
                        lines = [];
                    if (statusText !== "error") {
                        lines.push(statusText);
                    }
                    if (jqXHR.responseText) {
                        var respObj = JSON.parse(jqXHR.responseText);
                        if (respObj && respObj.error) {
                            lines.push(respObj.error);
                        }
                    }
                    if (error) {
                        lines.push(error);
                    }
                    var errmsg = lines.length > 0 ? lines.join(linesep) : undefined;
                    GlobalMessage.showMessage("error", lang.ErrorLoadingAddItemMenu, errmsg);
                    deferred.reject.apply(deferred, arguments);
                });
        },

        _setToolBar: function () {
            var originatingView = this;
            // for metadata of bus. attachments, try to pass the parent originating view if found
            if (this.options && this.options.metadataView && this.options.metadataView.options &&
                this.options.metadataView.options.metadataNavigationView) {
                originatingView = this.options.metadataView.options.metadataNavigationView;
            }

            // Get business object types
            this._buildToolbarItems();

            this.tableToolbarView = new TableToolbarView({
                context: this.options.context,
                commands: commands,
                toolbarItems: toolbarItems,
                collection: this.collection,
                originatingView: originatingView,
                toolbarCommandController: this.commandController
                // addableTypes: this.addableTypes
            });
        },

        _updateToolItems: function () {
            if (this.tableToolbarView) {
                this.tableToolbarView.updateForSelectedChildren(this.tableView.getSelectedChildren());
            }
        },

        _setTableView: function () {
            this.options || (this.options = {});

            var args = _.extend({
                tableColumns: metadataAttachmentsColumns,
                context: this.options.context,
                connector: this.model.connector,
                collection: this.collection,
                columns: this.collection.columns,
                pageSize: this.options.data.pageSize,
                columnsWithSearch: ['name', 'bo_id'],
                orderBy: "bo_id asc",
                commands: commands,
                customLabels: {
                    zeroRecordsMsg: lang.noBusinessAttachmentsAvailable,
                    emptySearchTable: lang.tableColumnSearchNoResult
                }
            }, this.options);

            this.tableView = new TableView(args);

            // Events

            this.listenTo(this.tableView, "tableRowSelected", this._updateToolItems);
            this.listenTo(this.tableView, "tableRowUnselected", this._updateToolItems);
            this.listenTo(this.collection, "reset", this._updateToolItems);
            this.listenTo(this.collection, "change", this._updateToolItems);
            this.listenTo(this.collection, "remove", this._updateToolItems);

            // rebuild toolbar items because of possible metadata option (SAPRM-8812)
            this.listenTo(this.collection, "add", this._buildToolbarItems);
            this.listenTo(this.collection, "remove", this._buildToolbarItems);
        },

        _setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize
            });

            //this.listenTo(this.paginationView, 'render:complete', _.bind(this._setTableViewHeight, this));
            return true;
        },

        setActionBarEvents: function () {
            if (config.forceInlineActionBarOnClick) {
                this.listenTo(this.tableView, 'row:clicked', function (args) {
                    if (this.tableActionBarView) {
                        var oldModelId = this.tableActionBarView.model.get('id');
                        var newModelId = args.node.get('id');
                        if (oldModelId === newModelId) {
                            return;
                        }
                    }
                    this._destroyOldAndCreateNewActionBarWithoutDelay(args);
                });
            } else {
                if (config.showInlineActionBarOnHover) {
                    this.listenTo(this.tableView, 'enterTableRow', this._showActionBarWithDelay);
                    this.listenTo(this.tableView, 'leaveTableRow', this._actionBarShouldDestroy);
                }
            }
            this.listenTo(this.collection, "reset", this._destroyActionBar);
            if (this.collection.node) {
                this.listenTo(this.collection.node, 'change:id', this._destroyActionBar);
            }
        },

        _showActionBar: function (args) {
            var selectedItems = this.tableView.getSelectedChildren();
            if (selectedItems.length > 0) {
                // no action bar if items are selected
                return;
            }
            if (this.tableActionBarView) {
                this._savedHoverEnterArgs = args;
                // ignore until action bar removed itself
            } else {
                this._savedHoverEnterArgs = null;

                this.tableActionBarView = new TableActionBarView(_.extend({
                        context: this.options.context,
                        commands: /*this.defaultActionController.*/commands,
                        collection: toolbarItems.inlineActionbar,
                        delayedActions: this.collection.delayedActions,
                        container: this.collection.node,
                        model: args.node,
                        originatingView: this
                    }, toolbarItems.inlineActionbar.options, {
                        inlineActionBarStyle: config.inlineActionBarStyle
                    })
                );
                this.tableActionBarView.render();
                this.listenToOnce(this.tableActionBarView, 'destroy', function () {
                    //Even though we are listening to tableActionBar 'destroy' even once, that event listener is not
                    //being removed after the fact. To ensure memory cleanup, the event listener if forcibly removed.
                    if (this.tableActionBarView) {
                        this.stopListening(this.tableActionBarView);
                    }
                    if (this._savedHoverEnterArgs) {
                        this._showActionBarWithDelay(this._savedHoverEnterArgs);
                    }
                }, this);
                var abEl = this.tableActionBarView.$el;

                var nameCell = this.tableView.getNameCell(args.target);
                if (nameCell && nameCell.length === 1) {
                    var actionBarDiv = nameCell.find('.csui-table-cell-name-appendix');
                    actionBarDiv.append(abEl);
                    actionBarDiv.addClass('csui-table-cell-name-appendix-full');
                    this.tableActionBarView.triggerMethod("after:show");
                }
            }
        },

        _showActionBarWithDelay: function (args) {
            if (this._showActionbarTimeout) {
                clearTimeout(this._showActionbarTimeout);
            }
            var self = this;
            this._showActionbarTimeout = setTimeout(function () {
                self._showActionbarTimeout = null;
                if (!self.tableView.lockedForOtherContols) {
                    // don't show the action bar control if the table view is locked because a different
                    // control is already open
                    self._showActionBar.call(self, args);
                }
            }, 200);
        },

        _destroyOldAndCreateNewActionBarWithoutDelay: function (args) {
            this._actionBarShouldDestroy();
            if (!this.tableView.lockedForOtherContols) {
                // don't show the action bar control if the table view is locked because a different
                // control is already open
                this._showActionBar.call(this, args);
            }
        },

        _actionBarShouldDestroy: function () {
            if (this._showActionbarTimeout) {
                clearTimeout(this._showActionbarTimeout);
                this._showActionbarTimeout = null;
            }
            this._destroyActionBar();
        },

        _destroyActionBar: function () {
            if (this.tableActionBarView) {
                var actionBarDiv = this.tableActionBarView.$el.parent();
                actionBarDiv.removeClass('csui-table-cell-name-appendix-full');

                this.tableActionBarView.destroy();
                this.tableActionBarView = null;
            }
        },

    });

    // Add the mixin functionality to the target view
    _.extend(MetadataAttachmentsTableView.prototype, LayoutViewEventsPropagationMixin);

    return MetadataAttachmentsTableView;

});

csui.define('xecmpf/widgets/myattachments/metadata.property.panels',['i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
  "xecmpf/widgets/myattachments/metadata.attachments.view"
], function (lang, MyAttachmentsView) {

  return [

    {
      title: lang.attachmentsTabTitle,
      sequence: 40,
      contentView:  MyAttachmentsView
    }

  ];

});

csui.define('xecmpf/widgets/dossier/impl/dossier.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'xecmpf/widgets/dossier/impl/dossier.model'
], function (module, _, Backbone,
    CollectionFactory, ConnectorFactory, NodeModelFactory,
    DossierCollection) {

  var DossierCollectionFactory;

  DossierCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'dossierCollection',

    constructor: function DossierFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);
      var dossierCollection = this.options.dossierCollection || {};
      if (!(dossierCollection instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        dossierCollection = new DossierCollection(dossierCollection.models, _.extend({
          connector: connector
        }, dossierCollection.options, config.options, {
          autofetch: true
        }, options));
      }
      this.property = dossierCollection;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return DossierCollectionFactory;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/behaviors/scroll.controls/impl/scroll.controls',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "glyphicon glyphicon-chevron-left";
},"3":function(depth0,helpers,partials,data) {
    return "glyphicon glyphicon-chevron-right";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"cs-scroll-control cs-scroll-control-left\">\r\n  <span class=\""
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.leftControlIconClass : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  cs-scroll-control-icon cs-scroll-control-icon-left "
    + this.escapeExpression(((helper = (helper = helpers.leftControlIconClass || (depth0 != null ? depth0.leftControlIconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"leftControlIconClass","hash":{}}) : helper)))
    + "\"></span>\r\n</div>\r\n<div class=\"cs-scroll-control cs-scroll-control-right\">\r\n  <span class=\""
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.rightControlIconClass : depth0),{"name":"unless","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  cs-scroll-control-icon cs-scroll-control-icon-right "
    + this.escapeExpression(((helper = (helper = helpers.rightControlIconClass || (depth0 != null ? depth0.rightControlIconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"rightControlIconClass","hash":{}}) : helper)))
    + "\"></span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_behaviors_scroll.controls_impl_scroll.controls', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/behaviors/scroll.controls/impl/scroll.controls',[],function(){});
csui.define('xecmpf/behaviors/scroll.controls/scroll.controls.behavior',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!xecmpf/behaviors/scroll.controls/impl/scroll.controls',
  'css!xecmpf/behaviors/scroll.controls/impl/scroll.controls'
], function (_, $, Marionette, template, css) {
  "use strict";

  var ScrollControlsBehavior;

  ScrollControlsBehavior = Marionette.Behavior.extend({

    defaults: {
      contentParent: null,
      controlsContainer: null,
      scrollableWidth: null, //px
      animateDuration: 400 //ms
    },

    ui: {
      leftControl: '.cs-scroll-control-left',
      rightControl: '.cs-scroll-control-right'
    },

    triggers: {
      'mousedown @ui.leftControl': 'scroll:left',
      'mousedown @ui.rightControl': 'scroll:right'
    },

    constructor: function ScrollControlsBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderControls)
          .listenTo(view, 'dom:refresh', this._updateScrollControls)
          .listenTo(view, 'update:scroll:controls', this._updateScrollControls)
          .listenTo(view, 'scroll:left', this._scrollLeft)
          .listenTo(view, 'scroll:right', this._scrollRight)
          .listenTo(view, 'before:destroy', this._unbindUpdateControlsEvents);
    },

    _renderControls: function () {
      var controlsContainerSelector = getOption.call(this, 'controlsContainer');
      this._controlsContainer = controlsContainerSelector ?
                                this.view.$(controlsContainerSelector) : this.view.$el;

      var contentParentSelector = getOption.call(this, 'contentParent');
      this._contentParent = contentParentSelector ?
                            this.view.$(contentParentSelector) : this.view.$el;
      this._bindControlsUpdatingEvents();

      this.animateDuration = getOption.call(this, 'animateDuration');

      var data = {
        leftControlIconClass: getOption.call(this, 'leftControlIconClass'),
        rightControlIconClass: getOption.call(this, 'rightControlIconClass')
      };

      this._controlsContainer.append(template(data));
      this.view._bindUIElements.call(this);
    },

    _updateScrollControls: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        var currentPos         = this._contentParent.scrollLeft(),
            scrollWidth        = this._contentParent.get(0).scrollWidth,
            contentParentWidth = this._contentParent.width();

        // for left control
        currentPos === 0 ? this.ui.leftControl.hide(100) : this.ui.leftControl.show(100);

        // for right control
        currentPos === (scrollWidth - contentParentWidth) ?
        this.ui.rightControl.hide(100) : this.ui.rightControl.show(100);
      }
    },

    _scrollLeft: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        var scrollableWidth = getOption.call(this, 'scrollableWidth') ||
                              this._contentParent.innerWidth();
        var currentPos = this._contentParent.scrollLeft();
        this._contentParent
            .trigger("focus")
            .filter(':not(:animated)')
            .animate({scrollLeft: currentPos - scrollableWidth}, this.animateDuration, 'swing',
                $.proxy(function () {this.view.triggerMethod('update:scroll:controls')}, this));
      }
    },

    _scrollRight: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        var scrollableWidth = getOption.call(this, 'scrollableWidth') ||
                              this._contentParent.innerWidth();
        var currentPos = this._contentParent.scrollLeft();
        this._contentParent
            .trigger("focus")
            .filter(':not(:animated)')
            .animate({scrollLeft: currentPos + scrollableWidth}, this.animateDuration, 'swing',
                $.proxy(function () {this.view.triggerMethod('update:scroll:controls')}, this));
      }
    },

    _bindControlsUpdatingEvents: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        //Add 'tabindex=1' to div element to enable the capturing of the key events
        this._contentParent.attr('tabindex', 1);
        this._contentParent.on('keydown', $.proxy(function (e) {
          switch (e.which) {
          case 37:  // left arrow key
            this.view.triggerMethod('scroll:left');
            break;
          case 39:  // right arrow key
            this.view.triggerMethod('scroll:right');
            break;
          }
        }, this));

        $(window).on('resize', $.proxy(function () {this._updateScrollControls();}, this));
      }
    },

    _unbindUpdateControlsEvents: function () {
      if (this._contentParent && this._contentParent instanceof $) {
        this._contentParent.off('keydown');
        $(window).off('resize');
      }
    }
  });

  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ScrollControlsBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/utils/document.thumbnail/impl/document.thumbnail',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"document-thumbnail-caption\">\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.disableIcon : depth0),{"name":"unless","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    <span class=\"document-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"csui-type-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"document-thumbnail-wrapper\">\r\n  <div><a href=\"#\" class=\"thumbnail_not_loaded thumbnail_empty\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.document_name || (depth0 != null ? depth0.document_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"document_name","hash":{}}) : helper)))
    + "\"></a></div>\r\n  <button class=\"wrapper\"><img src=\"\" class=\"img-doc-preview binf-hidden\" alt=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" /></button>\r\n</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCaption : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_utils_document.thumbnail_impl_document.thumbnail', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/utils/document.thumbnail/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


// Defines localizable strings in the default language (English)
csui.define('xecmpf/utils/document.thumbnail/impl/nls/root/lang',{
  open: 'Open',
  toOpen:'to open '
});



csui.define('css!xecmpf/utils/document.thumbnail/impl/document.thumbnail',[],function(){});
csui.define('xecmpf/utils/document.thumbnail/document.thumbnail.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'csui/utils/nodesprites', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/behaviors/default.action/default.action.behavior',
  'hbs!xecmpf/utils/document.thumbnail/impl/document.thumbnail',
  'i18n!xecmpf/utils/document.thumbnail/impl/nls/lang',
  'css!xecmpf/utils/document.thumbnail/impl/document.thumbnail'
], function (_, $, Marionette, Url,
    ConnectorFactory, NodeSpriteCollection, NodeTypeIconView, DefaultActionBehavior,
    template, lang) {

  var DocumentThumbnailView = Marionette.ItemView.extend({

    className: 'xecmpf-document-thumbnail',

    constructor: function DocumentThumbnailView(options) {
      options || (options = {});
      options.model || (options.model = options.node);
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (!this.model) {
        throw new Error('node is missing in the constructor options.');
      }
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    template: template,

    templateHelpers: function () {
      return {
        title: this.options.title || lang.open,
        document_name:lang.toOpen + this.options.model.get('name'),
        enableCaption: this.options.enableCaption
      };
    },

    ui: {
      thumbnailNotLoadedEl: '.thumbnail_not_loaded',
      imgEl: '.img-doc-preview',
      iconEl: '.csui-type-icon',
      buttonToHide:'.document-thumbnail-wrapper > button'
    },
    
    events:{
        'keydown .thumbnail_not_loaded': function(event){
            if (event.keyCode === 13 || event.keyCode === 32){
            var activeEl = this.$el.find(document.activeElement);
			$(activeEl).trigger("click");
            }
        },
        'keydown button.wrapper': function(event){
            if (event.keyCode === 13 || event.keyCode === 32){
            var activeEl = this.$el.find(document.activeElement);
			$(activeEl).trigger("click");
            }
        }
        
    },

    _showThumbnail: function () {
      // show thumbnail empty svg and hide img tag
      this.ui.thumbnailNotLoadedEl
          .addClass('thumbnail_empty')
          .removeClass('binf-hidden thumbnail_missing');
      this.ui.imgEl.addClass('binf-hidden');

      var that = this;
      this.model.connector
          .requestContentAuthToken({id: that.model.get('id')})
          .then(function (response) {
            var url;
            url = Url.combine(that.model.connector.connection.url, '/nodes', that.model.get('id'),
                '/thumbnails/medium/content?token=' + encodeURIComponent(response.token));

            if (typeof $ === 'function' && that.ui.imgEl instanceof $ &&
                that.ui.thumbnailNotLoadedEl instanceof $) {
              that.ui.imgEl.one('error', function () {
                // show thumbnail missing svg and hide img tag
                var className = NodeSpriteCollection.findClassByNode(that.model) ||
                                'thumbnail_missing';
                that.ui.thumbnailNotLoadedEl
                    .removeClass('binf-hidden thumbnail_empty')
                    .addClass(className);
                that.ui.imgEl.addClass('binf-hidden');
                that.ui.buttonToHide.addClass('binf-hidden');
                
              });

              that.ui.imgEl
                  .attr('src', url)
                  .one('load', function (evt) {
                    if (evt.target.clientHeight >= evt.target.clientWidth) {
                      that.ui.imgEl.addClass('cs-form-img-vertical');
                    } else {
                      that.ui.imgEl.addClass('cs-form-img-horizontal');
                    }

                    // hide the thumbnail background span and show the real img
                    that.ui.thumbnailNotLoadedEl.addClass('binf-hidden');
                    that.ui.imgEl
                        .removeClass('binf-hidden')
                        .addClass('cs-form-img-border');
                  });

              // default action
              // For SAPSSF-4393 - JQuery Migrate - Short hand methods are deprecated
              that.ui.imgEl.parent().parent().on('click', function () {
                var args = {
                  model: that.model,
                  abortDefaultAction: false
                };
                that.triggerMethod('before:defaultAction', args);
                if (args.abortDefaultAction === false) {
                  that.triggerMethod('execute:DefaultAction', that.model);
                }
                that.triggerMethod('after:defaultAction', args);
              });
            }
          }, function () {
            if (typeof $ === 'function' && that.ui.imgEl instanceof $ &&
                that.ui.thumbnailNotLoadedEl instanceof $) {
              that.ui.imgEl.addClass('binf-hidden');
              that.ui.thumbnailNotLoadedEl
                  .removeClass('binf-hidden thumbnail_empty')
                  .addClass('csui-icon thumbnail_missing');
            }
          });
    },

    _renderNodeTypeIconView: function () {
      this._nodeIconView = new NodeTypeIconView({
        el: this.ui.iconEl,
        node: this.model
      });
      this._nodeIconView.render();
    },

    onRender: function () {
      this._renderNodeTypeIconView();
      this._showThumbnail();
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {this._nodeIconView.destroy();}
    }
  });

  return DocumentThumbnailView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<td class=\"label\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</td>\r\n<td class=\"value\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "</td>";
}});
Handlebars.registerPartial('xecmpf_widgets_dossier_impl_documentslistitem_impl_metadata', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'hbs!xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata'
], function (_, $, Backbone, Marionette, base,
    template) {

  var MetadataItemView = Marionette.ItemView.extend({

    tagName: 'tr',

    constructor: function MetadataItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: template,

    templateHelpers: function () {
      var value = this.model.get('value');
      return {
        value: this.model.get('type') === 'Date' ? base.formatFriendlyDate(value) : value
      }
    }
  });

  var MetadataView = Marionette.CollectionView.extend({

    tagName: 'table',

    constructor: function MetadataView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    childView: MetadataItemView
  });

  return MetadataView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/dossier/impl/documentslistitem/impl/documentslistitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"document-favorite\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.favorite : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "")
    + "    </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "           <a href=\"#\" class=\"socialFav selected\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeFav || (depth0 != null ? depth0.removeFav : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeFav","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.removeFav || (depth0 != null ? depth0.removeFav : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeFav","hash":{}}) : helper)))
    + "\">\r\n          <span class=\"icon icon-socialFav\"></span>\r\n        </a>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "        <a href=\"#\" class=\"socialFav notselected\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.addFav || (depth0 != null ? depth0.addFav : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addFav","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.addFav || (depth0 != null ? depth0.addFav : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addFav","hash":{}}) : helper)))
    + "\">\r\n          <span class=\"icon icon-socialFavOpen\"></span>\r\n        </a>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <div class=\"document-category-attributes\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"xecmpf-document-preview\"></div>\r\n\r\n<div class=\"xecmpf-document-metadata\">\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideFavorite : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideMetadata : depth0),{"name":"unless","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_dossier_impl_documentslistitem_impl_documentslistitem', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/dossier/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/dossier/impl/nls/root/lang',{
  searchPlaceholder: 'Search groups.',
  emptyListText: 'No documents.',
  groupByLabel: 'Group by',
  classificationLabel: 'Classification',
  createDateLabel: 'Creation date',
  documentTypeLabel: 'Document type',
  tilesLabel: 'group(s)',
  documentsLabel: 'document(s)',
  addFav: 'Add to favorite',
  removeFav: 'Remove from favorite',
  selectByClassificationLabel:'Select group by Classification',
  selectByCreatedateLabel:'Select group by Created Date'
});



csui.define('css!xecmpf/widgets/dossier/impl/documentslistitem/impl/documentslistitem',[],function(){});
csui.define('xecmpf/widgets/dossier/impl/documentslistitem/documentslistitem.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'conws/models/favorite.model',
  'xecmpf/utils/document.thumbnail/document.thumbnail.view',
  'xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.model',
  'xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.view',
  'hbs!xecmpf/widgets/dossier/impl/documentslistitem/impl/documentslistitem',
  'i18n!xecmpf/widgets/dossier/impl/nls/lang',
  'css!xecmpf/widgets/dossier/impl/documentslistitem/impl/documentslistitem'
], function ($, _, Backbone, Marionette,
    FavoriteModel, DocumentThumbnailView, MetadataCollection, MetadataView,
    template, lang) {

  var DocumentsListItem;

  DocumentsListItem = Marionette.ItemView.extend({

    tagName: 'li',

    className: 'xecmpf-document-list-item',

    constructor: function DocumentsListItem(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.favModel = new FavoriteModel({
            selected: this.model.get('favorite')
          },
          {
            connector: this.model.connector,
            node: this.model
          });
      this.listenTo(this.favModel, 'change:selected', this.render);
    },

    template: template,

    templateHelpers: function () {
      return {
        enableIcon: true,
        hideMetadata: this.options.hideMetadata,
        hideFavorite: this.options.hideFavorite,
        addFav: lang.addFav + this.options.model.get('name'),
        removeFav: lang.removeFav + this.options.model.get('name')
      }
    },

    ui: {
      thumbnailEL: '.xecmpf-document-preview',
      metadataEl: '.document-category-attributes'
    },

    triggers: {
      'click a.socialFav.selected': 'remove:favorite',
      'click a.socialFav.notselected': 'add:favorite'

    },
    events: {
      'keydown a.socialFav.selected': function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          this.triggerMethod('remove:favorite');
        }
      },

      'keydown a.socialFav.notselected': function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          this.triggerMethod('add:favorite');
        }
      }
    },

    onRemoveFavorite: function (e) {
      this.favModel.remove();
      this.model.set('favorite', false);
      // Show directly that favorite was removed
      this.render();
    },

    onAddFavorite: function (e) {
      this.favModel.add();
      this.model.set('favorite', true);
      // Show directly that favorite was added
      this.render();
    },

    _renderMetadata: function () {
      var metadata_categories = this.model.get('metadata_categories');
      if (!_.isEmpty(metadata_categories)) {
        var metadataCollection = new MetadataCollection(undefined, {
          data: metadata_categories,
          hideEmptyFields: this.options.hideEmptyFields,
          catsAndAttrs: this.options.catsAndAttrs
        });
        this._metadataView = new MetadataView({collection: metadataCollection});
        this.ui.metadataEl.html(this._metadataView.render().el);
      }
    },

    _renderThumbnail: function () {
      this._documentThumbnailView = new DocumentThumbnailView({
        model: this.model,
        enableCaption: true
      });
      this.ui.thumbnailEL.html(this._documentThumbnailView.render().el);
    },

    onRender: function () {
      this._renderThumbnail();
      if (this.options.hideMetadata !== true) {
        this._renderMetadata();
      }
    },

    onBeforeDestroy: function () {
      this._documentThumbnailView.destroy();
      if (this._metadataView) {this._metadataView.destroy();}
    }
  });

  return DocumentsListItem;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/dossier/impl/documentslist/impl/documentslist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<ul class=\"xecmpf-document-list-group\"></ul>";
}});
Handlebars.registerPartial('xecmpf_widgets_dossier_impl_documentslist_impl_documentslist', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/dossier/impl/documentslist/impl/documentslist',[],function(){});
csui.define('xecmpf/widgets/dossier/impl/documentslist/documentslist.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/tile/behaviors/blocking.behavior',
  'csui/controls/tile/tile.view',
  'csui/controls/list/emptylist.view',
  'xecmpf/widgets/dossier/impl/documentslist/impl/documents.model',
  'xecmpf/widgets/dossier/impl/documentslistitem/documentslistitem.view',
  'i18n!xecmpf/widgets/dossier/impl/nls/lang',
  'hbs!xecmpf/widgets/dossier/impl/documentslist/impl/documentslist',
  'css!xecmpf/widgets/dossier/impl/documentslist/impl/documentslist'
], function ($, _, Backbone, Marionette,
    InfiniteScrollingBehavior, PerfectScrollingBehavior, BlockingBehavior,
    TileView, EmptyListView, DocumentsCollection, DocumentsListItem,
    lang, template) {

  var DocumentsListView, DocumentsTileView;

  DocumentsListView = Marionette.CompositeView.extend({

    className: 'list-group-container',

    constructor: function DocumentsListView(options) {
      options || (options = {});
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    template: template,

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },

      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        content: '>ul.xecmpf-document-list-group',
        fetchMoreItemsThreshold: 80
      }
    },

    childViewContainer: '>ul.xecmpf-document-list-group',

    childView: DocumentsListItem,

    childViewOptions: function () {
      return {
        context: this.options.context,
        workspaceContext: this.options.workspaceContext,
        nodeModel: this.options.nodeModel,
        hideMetadata: this.options.hideMetadata,
        hideEmptyFields: this.options.hideEmptyFields,
        hideFavorite: this.options.hideFavorite,
        catsAndAttrs: this.options.catsAndAttrs
      }
    },

    emptyView: EmptyListView,

    emptyViewOptions: {
      text: lang.emptyListText || 'No documents.'
    },

    onRender: function () {
      // this is important to make the perfect scrolling work.
      this.$el.one('mouseenter', $.proxy(function () {
        this.triggerMethod("dom:refresh");
      }, this))
    }
  });

  DocumentsTileView = TileView.extend({

    className: function () {
      var className       = 'xecmpf-documents-tile',
          parentClassName = _.result(TileView.prototype, 'className');
      if (parentClassName) {
        className += ' ' + parentClassName;
      }
      return className;
    },
    _focusedChild: undefined,
    _activeChild: undefined,
    constructor: function DocumentsTileView(options) {
      options || (options = {});
      TileView.prototype.constructor.apply(this, arguments);
      this.childrens = DocumentsListView
    },

    templateHelpers: function () {
      var title = this.model && this.model.get('name');
      return {
        title: title,
        icon: false
      };
    },

    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      }
    },
    _accSelector: '.thumbnail_not_loaded',

    currentlyFocusedElement: function () {
      return this.$(this._accSelector);
    },

    getActiveChild: function () {
      return this._activeChild;
    },
    toggleFocus: function (on) {
      this.ui.listItem.prop('tabindex', on === true ? '0' : '-1'); // set or remove tabstop
      if (on) {
        this.ui.listItem.trigger("focus"); // if tabstop then set focus too
      }
      // this._focusOnTree = false;
    },
    contentView: DocumentsListView,

    contentViewOptions: function () {
      var queryParams = _.extend(this.options.model && this.options.model.get('query_params'), {
            metadata_categories: this.options.metadata_categories
          }),
          models      = this.options.model && this.options.model.get('documents'),
          paging      = this.options.model && this.options.model.get('paging');

      var collection = new DocumentsCollection(models, {
        nodeModel: this.options.nodeModel,
        query: queryParams,
        paging: paging
      });

      // Loading animation
      this.listenTo(collection, "request", this.blockActions)
          .listenTo(collection, "sync", this.unblockActions)
          .listenTo(collection, "error", this.unblockActions);

      return {
        collection: collection,
        context: this.options.context,
        workspaceContext: this.options.workspaceContext,
        nodeModel: this.options.nodeModel,
        hideMetadata: this.options.hideMetadata,
        hideEmptyFields: this.options.hideEmptyFields,
        hideFavorite: this.options.hideFavorite,
        catsAndAttrs: this.options.catsAndAttrs
      }
    },

    _renderTileProperties: function () {
      var docsCount = (this.model && this.model.get('paging').total_count) || '0',
          $tilePropEl, $docsCountLabel;

      this.$docsCountEl = $('<span></span>')
          .addClass('count docs-count')
          .text(docsCount);
      $docsCountLabel = $('<span></span>')
          .addClass('count-label')
          .text(lang.documentsLabel || 'document(s)');

      $tilePropEl = $('<div></div>')
          .addClass('tile-properties')
          .append(this.$docsCountEl).append($docsCountLabel);

      this.$('>.tile-header').append($tilePropEl);
    },

    onRender: function () {
      this._renderTileProperties();
    },

    onBeforeShow: function () {
      this.listenTo(this.contentView, 'execute:defaultAction', function (node) {
        this.triggerMethod('execute:defaultAction', node);
      });
    }
  });

  return DocumentsTileView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/dropdown/impl/dropdownitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#\" tabindex=\"-1\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>";
}});
Handlebars.registerPartial('xecmpf_controls_dropdown_impl_dropdownitem', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/controls/dropdown/dropdownitem.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'hbs!xecmpf/controls/dropdown/impl/dropdownitem'
], function (_, $, Backbone, Marionette,
    template) {

  var DropdownItemView;

  DropdownItemView = Marionette.ItemView.extend({

    className: 'dropdown-menu-item',

    tagName: 'li',

    constructor: function DropdownItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: template,

    triggers: {
      'click': 'click:item'
    },

    modelEvents: {
      'change': 'render'
    }
  });

  return DropdownItemView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/dropdown/impl/dropdown',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a class=\"binf-dropdown-toggle csui-acc-focusable\" role=\"button\"\r\n        data-binf-toggle=\"dropdown\" aria-expanded=\"false\" tabindex=\"-1\">\r\n  <span class=\"dropdown-label\">"
    + this.escapeExpression(((helper = (helper = helpers.dropdownLabel || (depth0 != null ? depth0.dropdownLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dropdownLabel","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"csui-button-icon icon-expandArrowDown\"></span>\r\n</a>\r\n<ul class=\"binf-dropdown-menu\" role=\"menu\"></ul>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_dropdown_impl_dropdown', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/controls/dropdown/impl/dropdown',[],function(){});
csui.define('xecmpf/controls/dropdown/dropdown.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/lib/binf/js/binf',
  'xecmpf/controls/dropdown/dropdownitem.view',
  'hbs!xecmpf/controls/dropdown/impl/dropdown',
  'css!xecmpf/controls/dropdown/impl/dropdown'
], function (_, $, Backbone, Marionette, BinfJS,
    DropdownItemView, template, css) {

  var DropdownView;

  DropdownView = Marionette.CompositeView.extend({

    className: 'xecmpf-dropdown binf-dropdown',

    constructor: function DropdownView(options) {
      options || (options = {});
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.label = this.options.label;
    },

    template: template,

    templateHelpers: function () {
      return {
        dropdownLabel: this.label || 'Dropdown'
      }
    },

    ui: {
      control: '.binf-dropdown-toggle',
      label: '.dropdown-label'
    },

    childView: DropdownItemView,

    childViewContainer: 'ul.binf-dropdown-menu',

    childEvents: {
      'render': 'onRenderChild',
      'click:item': 'onClickItem'
    },

    onRenderChild: function (childView) {
      var currModel = childView.model;
      if (currModel.get('active') === true) {
        childView.$el
            .addClass('binf-active')
            .siblings().removeClass('binf-active');
        this.currModel = currModel;
      }
      if (currModel.get('hide') === true) {
        childView.$el.addClass('binf-hidden');
      }
    },

    onClickItem: function (childView) {
      if (!childView.$el.hasClass('binf-active')) {
        var newModel = childView.model,
            args     = {
              currModel: this.currModel,
              newModel: newModel
            };
        this.triggerMethod('change:dropdown:item', args);
        if (args.change !== false) {
          childView.$el
              .addClass('binf-active')
              .siblings().removeClass('binf-active');
          this.currModel = newModel;
        }
        this.hideDropdownMenu();
      }
    },

    showDropdownMenu: function () {
      this.$el.addClass('binf-open');
      this.ui.control.attr('aria-expanded', true);
    },

    hideDropdownMenu: function () {
      this.$el.removeClass('binf-open');
      this.ui.control.attr('aria-expanded', false);
    },

    updateLabel: function (newLabel) {
      if (newLabel && typeof newLabel === 'string') {
        this.ui.label.text(newLabel);
      }
    },

    setModelActive: function (model) {
      if (model instanceof Backbone.Model) {
        model.unset('active', {silent: true});
        model.set('active', true);
      }
    },

    setModelHide: function (model) {
      if (model instanceof Backbone.Model) {
        model.unset('hide', {silent: true});
        model.set('hide', true);
      }
    },

    onRender: function () {
      this.ui.control.binf_dropdown();
    }
  });

  return DropdownView;
});

csui.define('xecmpf/widgets/dossier/impl/dropdown.items',['module', 'csui/lib/backbone', 'i18n!xecmpf/widgets/dossier/impl/nls/lang'
], function (module, Backbone, lang) {
  var config = module.config(),
      DropdownItemModel,
      DropdownItemCollection,
      dropdownItems;

  DropdownItemModel = Backbone.Model.extend({

    idAttribute: "value",

    defaults: {
      value: null,
      name: null,
      sequence: 0 // smaller number moves up
    }
  });

  DropdownItemCollection = Backbone.Collection.extend({

    model: DropdownItemModel,
    comparator: 'sequence',

    getItemValues: function () {
      return this.pluck('value');
    },

    deepClone: function () {
      return new DropdownItemCollection(
          this.map(function (item) {
            return item.attributes;
          }));
    }

  });

  dropdownItems = new DropdownItemCollection([
    {
      value: 'classification',
      name: config.groupByDocumentType ?
            lang.documentTypeLabel : lang.classificationLabel,
      sequence: 10
    },
    {
      value: 'create_date',
      name: lang.createDateLabel,
      sequence: 20
    }
  ]);

  return dropdownItems;
});


csui.define('css!xecmpf/widgets/dossier/impl/dossier',[],function(){});
csui.define('xecmpf/widgets/dossier/dossier.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/node', 'conws/models/workspacecontext/workspacecontext.factory',
  'xecmpf/widgets/dossier/impl/dossier.factory',
  'csui/controls/tile/behaviors/blocking.behavior', 'csui/behaviors/limiting/limiting.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'xecmpf/behaviors/scroll.controls/scroll.controls.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/list/list.view', 'xecmpf/widgets/dossier/impl/documentslist/documentslist.view',
  'xecmpf/controls/dropdown/dropdown.view',
  'xecmpf/widgets/dossier/impl/dropdown.items',
  'i18n!xecmpf/widgets/dossier/impl/nls/lang',
  'css!xecmpf/widgets/dossier/impl/dossier'
], function (_, $, Backbone, Marionette,
    NodeModelFactory, WorkspaceContextFactory, DossierFactory,
    BlockingBehavior, LimitingBehavior, PerfectScrollingBehavior,
    ScrollControlsBehavior, ListViewKeyboardBehavior, ModalAlert,
    ListView, DocumentsListView, DropdownView,
    dropdownMenuItems, lang) {

  var DossierView;

  DossierView = ListView.extend({

    id: 'xecmpf-dossier',

    constructor: function DossierView(options) {
      options || (options = {});
      options = options.data ? _.extend(options, options.data) : options;
      if (!options.workspaceContext) {
        if (options.context) {
          options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        } else {
          throw new Error('Context is missing in the constructor options!');
        }
      }
      options.workspaceContext.setWorkspaceSpecific(DossierFactory);
      ListView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.completeCollection, 'request', this.blockActions)
          .listenTo(this.completeCollection, 'error', this.unblockActions)
          .listenTo(this.completeCollection, 'sync', this.onCompleteCollectionSync);

      this.synced = false;
    },

    templateHelpers: function () {
      return {
        icon: undefined,
        title: undefined,
        searchPlaceholder: lang.searchPlaceholder
      };
    },

    events: {
      'focus span[title="Search"]': function () {
        var dropdown = this.$el.find('.xecmpf-dropdown');
        dropdown.removeClass('binf-open');
      },

      'keydown .clearer': function () {
        var searchInput = this.$('.search');
        searchInput.val('');
        searchInput.trigger("focus");
        this.filterChanged();
      },

      'keydown li.dropdown-menu-item': function () {
        if (event.keyCode === 13 || event.keyCode === 32) {
          $('.dropdown-menu-item').trigger("click");
          var dropdown = this.$el.find('.xecmpf-dropdown');
          dropdown.removeClass('binf-open');
        }
      },
      'keydown .dossier-dropdown': 'getDossierViewFilter',
      'keydown .tile-header span[title="Search"]': function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          $('.tile-header span[title="Search"]').trigger("click");
        }
      },
      'keydown .tile-header input[class="search"]': function (event) {
        if (event.keyCode === 27) {
          $('.tile-header span[title="Hide"]').trigger("click");
          $('.tile-header span[title="Hide"]').trigger("focus");
        }
      }
    },
    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        // never show expand icon
        limit: undefined,
        completeCollection: function () {
          this.nodeModel = this.options.workspaceContext.getObject(NodeModelFactory);
          this.groupBy = this.options.groupBy;

          (function (metadata, ctx) {
            metadata || (metadata = []);
            ctx.metadata_categories = '';
            ctx.catsAndAttrs = [];
            if (metadata.length > 0) {
              var categories = '', catsAndAttrs = [];
              metadata.forEach(function (item) {
                if (item.attributeId) {
                  categories += item.categoryId + ',';
                  catsAndAttrs.push(item.categoryId + '_' + item.attributeId);
                } else if (item.categoryId) {
                  categories += item.categoryId + ',';
                  catsAndAttrs.push(item.categoryId);
                }
              });
              ctx.metadata_categories = categories.substr(0, categories.length - 1);
              ctx.catsAndAttrs = catsAndAttrs;
            }
          })(this.options.metadata, this);
          return this.options.workspaceContext.getCollection(DossierFactory, {
            options: {
              nodeModel: this.nodeModel,
              query: {
                group_by: this.groupBy,
                metadata_categories: this.metadata_categories
              }
            }
          });
        }
      },

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        // disable the PerfectScrolling because ScrollControlsBehavior will be used for scrolling.
        scrollingDisabled: true
      },

      ScrollControls: {
        behaviorClass: ScrollControlsBehavior,
        controlsContainer: '>.tile-content',
        contentParent: '>.tile-content>.binf-list-group',
        animateDuration: 500, //ms
        scrollableWidth: function () { //px
          var contentParentWidth = this.$('>.tile-content').innerWidth(),
              // tileWidth: width of a tile including border, padding and margin.
              tileWidth          = this.$('>.tile-content>.binf-list-group>.tile').outerWidth(true),
              // tilesInView: number of completely visible tiles.
              tilesInView        = Math.floor(contentParentWidth / tileWidth),
              // scrollableWidth: width of completely visible tiles.
              scrollableWidth    = (tilesInView * tileWidth) || tileWidth;
          return scrollableWidth;
        },
        leftControlIconClass: 'caret-left',
        rightControlIconClass: 'caret-right'
      },

      Blocking: {
        behaviorClass: BlockingBehavior
      }

    },

    getDossierViewFilter: function (e) {
      switch (e.keyCode) {
      case 13:  // enter

      case 32:  // space

        var dropdown = this.$el.find('.xecmpf-dropdown');
        dropdown.hasClass('binf-open') ? dropdown.removeClass('binf-open') :
        dropdown.addClass('binf-open');

        break;

          //xecmpf-dropdown binf-dropdown
      }
    },

    childView: DocumentsListView,

    childViewOptions: function () {
      return {
        context: this.options.context,
        workspaceContext: this.options.workspaceContext,
        nodeModel: this.nodeModel,
        hideMetadata: this.options.hideMetadata,
        hideEmptyFields: this.options.hideEmptyFields,
        metadata_categories: this.metadata_categories,
        hideFavorite: this.options.hideFavorite,
        catsAndAttrs: this.catsAndAttrs
      }
    },

    onRenderTemplate: function () {
      if (this.options.hideGroupByCriterionDropdown !== true) {
        this._renderGroupByDropdownView();
      }
      this._renderDossierProperties();
    },

    onRenderCollection: function () {
      this.triggerMethod('update:scroll:controls');
    },

    onCompleteCollectionSync: function () {
      this.synced = true;
      this._updateDossierProperties();
      this.unblockActions();
    },

    isEmpty: function () {
      return (this.synced === true) && (this.collection.models.length === 0);
    },

    emptyViewOptions: {
      text: lang.emptyListText || "No documents."
    },

    _renderGroupByDropdownView: function () {
      var $dropdownEl = $('<div></div>')
          .addClass('dossier-dropdown-wrapper');
      var $dropdownLabel = $('<span></span>')
          .addClass('dossier-dropdown-label')
          .text(lang.groupByLabel);
      var $dropdown = $('<div></div>')
          .addClass('dossier-dropdown');
      $dropdownEl
          .append($dropdownLabel)
          .append($dropdown);

      this.$('>.tile-header>.tile-controls').prepend($dropdownEl);

      var dropdownRegion = new Marionette.Region({el: $dropdown});

      this.groupBydropdownView = new DropdownView({
        label: this._getGroupByDropdownLabel(dropdownMenuItems),
        collection: dropdownMenuItems
      });

      this.listenTo(this.groupBydropdownView, 'change:dropdown:item', function (args) {
        // re-fetch the completeCollection according to the selected group_by criterion.
        var value = args.newModel.get('value'),
            that  = this;
        this.synced = false;
        this.completeCollection
            .fetch({
              query: {
                group_by: value,
                metadata_categories: this.metadata_categories
              }
            })
            .done(function (response, status, jqXHR) {
              that.groupBy = value;
              that.groupBydropdownView.updateLabel(that._getGroupByDropdownLabel(args.newModel));
              // move the scroll to initial position
              var $scrollEl = that.$('>.tile-content>.binf-list-group');
              $scrollEl.scrollLeft(0);
              that.triggerMethod('update:scroll:controls');
              that._setGroupByDropdownModelActive(that.groupBydropdownView.collection);
            })
            .fail(function (jqXHR, status, error) {
              var errMsg = jqXHR.responseJSON ? jqXHR.responseJSON.error :
                           'Internal Server Error!';
              ModalAlert
                  .showError(errMsg)
                  .always(function () {
                    that._setGroupByDropdownModelActive(args.currModel);
                  });
            });
      });
      dropdownRegion.show(this.groupBydropdownView);
      this._setGroupByDropdownModelActive(dropdownMenuItems);
    },

    _getGroupByDropdownLabel: function (arg) {
      var label = /*lang.groupByLabelPrefix +*/ ' ',
          dropdownActiveModel;
      if (arg instanceof Backbone.Model) {
        dropdownActiveModel = arg;
      } else if (arg instanceof Backbone.Collection) {
        dropdownActiveModel = this._getGroupByDropdownActiveModel(arg);
      }

      if (dropdownActiveModel) {
        label += dropdownActiveModel.get('name');
      }
      return label;
    },

    _getGroupByDropdownActiveModel: function (collection) {
      if (collection instanceof Backbone.Collection) {
        return collection.find($.proxy(function (model) {
          return model.get('value') === this.groupBy;
        }, this));
      }
    },

    _setGroupByDropdownModelActive: function (arg) {
      var activeModel;
      if (arg instanceof Backbone.Model) {
        activeModel = arg;
      } else if (arg instanceof Backbone.Collection) {
        activeModel = this._getGroupByDropdownActiveModel(arg);
      }

      if (activeModel) {
        this.groupBydropdownView.setModelActive(activeModel);
      }
    },

    _renderDossierProperties: function () {
      var tilesCount = this.completeCollection.length || '0',
          docsCount  = this.completeCollection.total_documents || '0',
          $dossierPropEl, $tilesCountLabel, $docsCountLabel;

      this.$tilesCountEl = $('<span></span>')
          .addClass('count tiles-count')
          .text(tilesCount);
      $tilesCountLabel = $('<span></span>')
          .addClass('count-label')
          .text(lang.tilesLabel || 'group(s)');

      this.$docsCountEl = $('<span></span>')
          .addClass('count docs-count')
          .text(docsCount);
      $docsCountLabel = $('<span></span>')
          .addClass('count-label')
          .text(lang.documentsLabel || 'document(s)');

      $dossierPropEl = $('<div></div>')
          .addClass('dossier-properties')
          .append(this.$tilesCountEl).append($tilesCountLabel)
          .append(this.$docsCountEl).append($docsCountLabel);

      var _dropdownElement = this.$('.dossier-dropdown .csui-acc-focusable').get(0);
      _dropdownElement.setAttribute('tabindex', '0');
      var groupBy = this.groupBy;
      var toolTop
      if (groupBy === 'create_date') {
        toolTop = lang.selectByClassificationLabel;
      } else {
        toolTop = lang.selectByCreatedateLabel;
      }
      _dropdownElement.setAttribute('aria-label', toolTop);
      this.$('>.tile-header>.tile-title').remove();
      this.$('>.tile-header').prepend($dossierPropEl);

      var searchButton = this.$('>.tile-header span[title="Search"]');
      $(searchButton).addClass('csui-acc-focusable');
      $(searchButton).attr('tabindex', '0');

    },

    _updateDossierProperties: function () {
      var activeTiles = _.filter(this.completeCollection.models, function (model) {
        return model.attributes.documents;
      });
      var tilesCount = activeTiles.length,
          docsCount  = this.completeCollection.total_documents;
      this.$tilesCountEl.text(tilesCount);
      this.$docsCountEl.text(docsCount);
    }
  });

  return DossierView;
});

csui.define('xecmpf/models/eac/eventactionplans.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'xecmpf/models/eac/eventactionplans.model'
], function (module, _, Backbone,
  CollectionFactory, NodeFactory, EACEventActionPlans) {

    var EACEventActionPlansFactory = CollectionFactory.extend({

      propertyPrefix: 'EACEventActionPlans',

      constructor: function EACEventActionPlansFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacEventActionPlans = this.options.EACEventActionPlans || {};

        if (!(eacEventActionPlans instanceof Backbone.Collection)) {
          var node = context.getModel(NodeFactory, options), config = module.config();

          eacEventActionPlans = new EACEventActionPlans(eacEventActionPlans.models, _.extend({
            node: node,
            connector: node.connector,
            extSysTypes: options.extSysTypes
          }, eacEventActionPlans.options, config.options, {
              autofetch: true
            }));
        }

        this.property = eacEventActionPlans;
      },

      fetch: function (options) {
        return this.property.fetch(options);
      }
    });

    return EACEventActionPlansFactory;
  });

csui.define('xecmpf/models/eac/nodefacets.model',['csui/lib/underscore', 'csui/utils/url', 'csui/models/facets',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.facets/server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Url, FacetCollection, NodeResourceMixin, ServerAdaptorMixin) {
  'use strict';

  var EACFacetCollection = FacetCollection.extend({
    constructor: function EACFacetCollection(models, options) {
      FacetCollection.prototype.constructor.apply(this, arguments);
      this.makeNodeResource(options)
        .makeServerAdaptor(options);
    },
    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        filters: _.deepClone(this.filters)
      });
    }
  });

  NodeResourceMixin.mixin(EACFacetCollection.prototype);
  ServerAdaptorMixin.mixin(EACFacetCollection.prototype);

  EACFacetCollection.prototype.url = function () {
    var nodeId = this.node.get('id'),
      filter = this.getFilterQuery(this.filters),
      url = Url.combine(this.connector.connection.url, 'eventactioncenter', '/facets').replace('/v1', '/v2');
    if (filter) {
      url += '?' + filter;
    }
    return url;
  };

  return EACFacetCollection;
});

csui.define('xecmpf/models/eac/node.facet.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'xecmpf/models/eac/nodefacets.model'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeFacetCollection) {

  var FacetCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'eacfacets',

    constructor: function FacetCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var facets = this.options.eacfacets || {};
      if (!(facets instanceof Backbone.Collection)) {
        var node = facets.options && facets.options.node ||
          context.getModel(NodeModelFactory, options),
          config = module.config();
        facets = new NodeFacetCollection(facets.models, _.defaults(
          config.options,
          facets.options,
          {
            autoreset: true
          },
          { node: node }
        ));
      }
      this.property = facets;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return FacetCollectionFactory;

});

csui.define('xecmpf/widgets/eac/impl/eac.table.columns',['csui/lib/underscore', 'csui/lib/backbone', 'i18n!xecmpf/widgets/eac/impl/nls/lang'

], function (_, Backbone, lang) {
  'use strict';

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,
      sequence: 0
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,

    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
        this.map(function (column) {
          return column.attributes;
        }));
    },

    resetCollection: function (columns, options) {
      if (columns) {
        var sequence = 0;
        var models = _.map(columns, function (column) {
          var columnData = column instanceof Backbone.Model ? column.toJSON() : column;
          sequence += 10;
          return new TableColumnModel(_.defaults(columnData,
            { key: columnData.column_key, sequence: sequence }));
        });
        this.reset(models, options);
      }
    }

  });

  var tableColumns = new TableColumnCollection([
    {
      key: 'event_name',
      title: lang.columnEventName,
      sequence: 10,
      permanentColumn: true
    },
    {
      key: 'namespace',
      title: lang.columnSystemName,
      sequence: 20,
      permanentColumn: true
    },
    {
      key: 'action_plan',
      title: lang.columnActionPlan,
      sequence: 30,
      permanentColumn: true
    }
  ]);

  return tableColumns;
});


csui.define('css!xecmpf/widgets/eac/impl/eac',[],function(){});
csui.define('xecmpf/widgets/eac/impl/toolbaritems',['csui/controls/toolbar/toolitems.factory',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/widgets/eac/impl/eac'
], function (ToolItemsFactory, lang) {

  // Keep the keys in sync with csui/widgets/nodestable/toolbaritems.masks
  var toolbarItems = {

    leftToolbar: {
      OtherToolbar: new ToolItemsFactory({
        main: [{
          signature: "EACBack",
          name: lang.ToolbarItemBack,
          toolItemAria: lang.ToolbarItemBackAria,
          icon: "icon icon-arrowBack"

        }, {
          signature: "Filter",
          name: lang.ToolbarItemFilter,
          icon: "icon icon-toolbarFilter",
          toolItemAria: lang.ToolbarItemFilterAria,
          toolItemAriaExpand: false
        }]
      })
    },


    rightToolbar: {
      OtherToolbar: new ToolItemsFactory({
        main: [{
          signature: "EACRefresh",
          name: lang.ToolbarItemRefresh,
          icon: "icon icon-refresh",
          toolItemAria: lang.ToolbarItemRefreshAria,
          commandData: { useContainer: true }
        }]
      })
    }
  };
  return toolbarItems;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/eac/impl/eac',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"xecmpf-eac-toolbar\"></div>\r\n<div id=\"xecmpf-eac-facet-table-container\">\r\n  <div id=\"xecmpf-eac-facet\" class=\"csui-table-facetview csui-facetview-hidden csui-facetview-visibility\"></div>\r\n  <div class=\"csui-outertablecontainer\">\r\n    <div id=\"xecmpf-eac-table-container\">\r\n      <div id=\"xecmpf-eac-facet-bar\"></div>\r\n      <div id=\"xecmpf-eac-table-contents\"></div>\r\n      <div id=\"xecmpf-eac-pagination\"></div>\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_widgets_eac_impl_eac', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/eac/eac.view',['require', 'module', 'csui/lib/underscore', 'csui/lib/marionette',
      'csui/utils/contexts/factories/connector', 'csui/utils/contexts/factories/node',
      'csui/controls/progressblocker/blocker',
      'csui/controls/table/table.view',
      'xecmpf/models/eac/eventactionplans.factory',
      'xecmpf/models/eac/node.facet.factory',
      'csui/controls/facet.bar/facet.bar.view',
      'xecmpf/controls/dialogheader/dialogheader.view',
      'xecmpf/controls/title/title.view',
      'xecmpf/widgets/eac/impl/eac.table.columns',
      'xecmpf/controls/headertoolbar/headertoolbar.view',
      'xecmpf/widgets/eac/impl/toolbaritems',
      'csui/utils/commands',
      'csui/controls/facet.panel/facet.panel.view',
      'csui/utils/contexts/factories/node',
      'xecmpf/models/eac/eventactionplans.model',
      'csui/controls/toolbar/toolbar.command.controller',
      'hbs!xecmpf/widgets/eac/impl/eac',
      'i18n!xecmpf/widgets/eac/impl/nls/lang',
      'css!xecmpf/widgets/eac/impl/eac',
    ],
    function (require, module, _, Marionette,
        ConnectorFactory, NodeModelFactory,
        BlockingView,
        TableView,
        EACEventActionPlansFactory,
        EACFacetFactory,
        FacetBarView,
        HeaderView,
        TitleView,
        eacTableColumns,
        HeaderToolbarView,
        toolbarItems,
        commands,
        FacetPanelView,
        NodeFactory,
        EACEventActionPlans,
        ToolbarCommandController,
        template, lang) {

      var config = module.config();
      _.defaults(config, {
        defaultPageSize: 30
      });

      var EACView = Marionette.LayoutView.extend({

        className: 'xecmpf-eac csui-nodestable',

        template: template,

        ui: {
          facetView: '.csui-table-facetview'
        },

        regions: {
          toolbarRegion: '#xecmpf-eac-toolbar',
          facetRegion: '#xecmpf-eac-facet',
          facetBarRegion: '#xecmpf-eac-facet-bar',
          tableRegion: '#xecmpf-eac-table-contents',
          paginationRegion: '#xecmpf-eac-pagination'
        },

        events: {
          'click li[data-csui-command="eacback"]': function (event) {
            if (history.state) {
              history.back();
            }
          }
        },

        constructor: function EACView(options) {
          options || (options = {});
          options = options.data ? _.extend(options, options.data) : options;
          _.defaults(options, {
            pageSize: config.defaultPageSize
          });

          if (!options.context) {
            throw new Error('Context is missing in the constructor options');
          }

          BlockingView.imbue(this);
          Marionette.LayoutView.prototype.constructor.apply(this, arguments);
          this.connector = options.connector || options.context.getObject(ConnectorFactory);
        },

        initialize: function (options) {
          this.node = options.context.getModel(NodeModelFactory, options);
          this.collection = options.context.getCollection(EACEventActionPlansFactory, options);
          this.commands = options.commands || commands;

          this.commandController = new ToolbarCommandController({
            commands: this.commands
          });
          this.listenTo(this.commandController, 'after:execute:command',
              this._toolbarActionTriggered);

          this.setHeaderView();
          this.setFacetView();
          this.setFacetBarView();
          this.setTableView();
        },

        setFacetView: function () {
          this.facetFilters = this.options.facetFilters ||
                              this.options.context.getCollection(EACFacetFactory, {
                                options: {
                                  node: this.node
                                },
                                attributes: this.options.data.containerId ?
                                    {id: this.options.data.containerId} : undefined,
                                detached: true
                              });
          this.listenToOnce(this.options.context, 'request', function () {
            this.facetFilters.fetch();
          });

          this.facetView = new FacetPanelView({
            collection: this.facetFilters,
            blockingLocal: true
          });

          this.listenTo(this.facetView, {
            'remove:filter': this._removeFacetFilter,
            'remove:all': this._removeAll,
            'apply:filter': this._addToFacetFilter,
            'apply:all': this._setFacetFilter
          });
        },

        setFacetBarView: function () {
          this.facetBarView = new FacetBarView({
            collection: this.facetFilters,
            context: this.options.context,
            showSaveFilter: false
          });
          this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
              .listenTo(this.facetBarView, 'remove:all', this._removeAll)
              .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
              .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
        },

        setHeaderView: function () {
          var leftToolbar = new HeaderToolbarView({
            commands: commands,
            originatingView: this,
            context: this.options.context,
            collection: this.collection,
            toolbarItems: toolbarItems.leftToolbar,
            container: this.node,
            commandController: this.commandController
          });

          var titleView = new TitleView({title: lang.dialogTitle});

          var rightToolbar = new HeaderToolbarView({
            commands: commands,
            originatingView: this,
            context: this.options.context,
            collection: this.collection,
            toolbarItems: toolbarItems.rightToolbar,
            container: this.node,
            commandController: this.commandController
          });

          this.headerView = new HeaderView({
            leftView: leftToolbar,
            centerView: titleView,
            hideDialogClose: true,
            rightView: rightToolbar
          });
        },

        setTableView: function () {
          this.tableView = new TableView({
            context: this.options.context,
            connector: this.connector,
            collection: this.collection,
            columns: this.collection.columns,
            tableColumns: eacTableColumns.clone(),
            pageSize: this.options.pageSize,
            originatingView: this,
            columnsWithSearch: ['event_name'],
            orderBy: this.options.data.orderBy || this.options.orderBy || this.collection.orderBy ||
                     'event_name asc',
            blockingParentView: this,
            parentView: this,
            selectColumn: false,
            selectRows: 'none',
            tableTexts: {
              zeroRecords: lang.emptyTableText || 'No results found'
            },
            haveToggleAllDetailsRows: false,
            haveDetailsRowExpandCollapseColumn: false,
          });

        },

        onRender: function () {

          if (!history.state) {
            var backbutton = this.$el.find('li[data-csui-command="eacback"]');
            backbutton.css({"display": "none"});
          }
          this.listenTo(this.collection, 'sync', function () {
            this.setTableView();
            this.showChildView('tableRegion', this.tableView);
            this.showChildView('toolbarRegion', this.headerView);
            this.showChildView('facetRegion', this.facetView);
            this.showChildView('facetBarRegion', this.facetBarView);
            var that = this;
            waitUntilElementVisible({
              $el: that.tableView.$el,
              success: function () {
                that.tableView.triggerMethod('dom:refresh');
              }
            });
          });
        },

        _handleFacetBarVisible: function () {
          this.facetBarView.$el.find(
              "#xecmpf-eac-facet-bar .csui-facet-list-bar .csui-facet-item:last a").trigger("focus");
        },

        _handleFacetBarHidden: function () { },

        _setFacetPanelView: function () {
          this.facetView = new FacetPanelView({
            collection: this.facetFilters,
            blockingLocal: true
          });
          this.listenTo(this.facetView, {
            'remove:filter': this._removeFacetFilter,
            'remove:all': this._removeAll,
            'apply:filter': this._addToFacetFilter,
            'apply:all': this._setFacetFilter
          })
        },

        _filterArray: function (facetValues) {
          return facetValues.reduce(function (memo, facetValue) {
            var temp = facetValue.split(':');
            memo[temp[0]] = temp[1].split("|");
            return memo;
          }, {});
        },

        _addToFacetFilter: function (filter) {
          this.facetFilters.addFilter(filter);
          var facetValues = this.facetFilters.getFilterQueryValue();
          this.collection.setFilter(this._filterArray(facetValues));
        },

        _setFacetFilter: function (filter) {
          this.facetFilters.setFilter(filter);
          var facetValues = this.facetFilters.getFilterQueryValue();
          this.collection.setFilter(this._filterArray(facetValues));
        },

        _removeFacetFilter: function (filter) {
          this.facetFilters.removeFilter(filter);
          var facetValues = this.facetFilters.getFilterQueryValue();
          if (facetValues.length === 0) {
            this._removeAll();
          } else {
            this.collection.setFilter(this._filterArray(facetValues));
          }
        },

        _removeAll: function () {
          this.facetFilters.clearFilter();
          this.collection.reset(this.collection.allModels);
        },

        _toolbarActionTriggered: function (toolbarActionContext) {
          switch (toolbarActionContext.commandSignature) {
          case 'EACBack':
            break;
          case 'Filter':
            this._completeFilterCommand();
            break;
          case 'EACRefresh':
            break;
          }
        },

        _transitionEnd: _.once(
            function () {
              var transitions = {
                    transition: 'transitionend',
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend'
                  },
                  element     = document.createElement('div'),
                  transition;
              for (transition in transitions) {
                if (typeof element.style[transition] !== 'undefined') {
                  return transitions[transition];
                }
              }
            }
        ),

        _completeFilterCommand: function () {
          var that = this;
          this.showFilter = !this.showFilter;
          if (this.showFilter) {
            this._ensureFacetPanelViewDisplayed();
            this.ui.facetView.removeClass('csui-facetview-visibility');
            this.ui.facetView.one(this._transitionEnd(), function () {
              that.tableView.triggerMethod('dom:refresh');
            }).removeClass('csui-facetview-hidden');
          } else {
            this.ui.facetView.one(this._transitionEnd(), function () {
              that.tableView.triggerMethod('dom:refresh');
              that.ui.facetView.hasClass('csui-facetview-hidden') &&
              that.ui.facetView.addClass('csui-facetview-visibility');
              that._removeFacetPanelView();
            }).addClass('csui-facetview-hidden');
          }
        },

        _ensureFacetPanelViewDisplayed: function () {
          if (this.facetView === undefined) {
            this._setFacetPanelView();
            this.facetRegion.show(this.facetView);
          }
        },

        _removeFacetPanelView: function () {
          this.facetRegion.empty();
          this.facetView = undefined;
        }
      });

      function waitUntilElementVisible(options) {
        if (options.$el.is(':visible')) {

          options.success();
          return;
        }
        options.count || (options.count = 'noLimit');
        options.interval || (options.interval = 200);
        setTimeout(function () {
          if (options.count === 0) {
            if (options.error !== undefined) {
              options.error();
            }
          } else {
            if (typeof options.count === 'number') {
              options.count--;
            }
            waitUntilElementVisible(options);
          }
        }, options.interval);
      }

      return EACView;
    });


csui.define('xecmpf/widgets/header/impl/previewpane/impl/previewpane.list.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  // This behavior implements a default keyboard navigation for the simple list (fly-out)
  // in xecmpf header widget.

  var TabPosition = {
    none: -1,
    list: 1
  };

  var PreviewPaneListKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function PreviewPaneListKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;

      this.listenTo(view, 'show', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'click:item', function (item) {
        // clear the currently focused element
        var selIndex = view.selectedIndex;
        var selectedElem = view.selectedIndexElem(selIndex);
        selectedElem && selectedElem.prop('tabindex', '-1');
        // set the new element tabindex
        view.currentTabPosition = TabPosition.list;
        view.selectedIndex = view.collection.indexOf(item.model);
      });

      _.extend(view, {


        _focusList: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          this.currentTabPosition = TabPosition.list;
          return this.getSelectedItem().$el;
        },

        _setFocus: function () {

            return this._focusList();
        },

        _listIsInFocus: function () {
          var inFocus = false;
          var i;
          for (i = 0; i < this.collection.length; i++) {
            var $elem = this.selectedIndexElem(i);
            if ($elem && $elem.is(":focus")) {
              inFocus = true;
              break;
            }
          }

          return inFocus;
        },

        _checkFocusAndSetCurrentTabPosition: function () {
          if (this._listIsInFocus()) {
            this.currentTabPosition = TabPosition.list;
          } else {
            this.currentTabPosition = TabPosition.none;
          }
        },

        // handle scenario that currentlyFocusedElement does not have event param for shiftTab
        _setFirstAndLastFocusable: function () {
          this.getSelectedItem() && this.getSelectedItem().$el.prop('tabindex', '0');
        },

        currentlyFocusedElement: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          this._setFirstAndLastFocusable();
          if (event && event.shiftKey) {
            return this._focusList();
          }
          // maintain old position
          if (this.currentTabPosition === TabPosition.list) {
            return this._focusList();
          } else {
            return this._setFocus();
          }
        },

        _resetFocusedListElem: function () {
          // workaround the general behaviors that it keeps the old focus
          // reset focus back to the active list item before moving out of the region
          var selIndex, selectedElem;

          // clear the currently focused element
          selIndex = this.selectedIndex;
          selectedElem = this.selectedIndexElem(selIndex);
          selectedElem && selectedElem.prop('tabindex', '-1');

          // set to the active element
          selIndex = this.getSelectedIndex();
          selectedElem = this.selectedIndexElem(selIndex);
          if (selectedElem) {
            selectedElem.prop('tabindex', '0');
            this.selectedIndex = selIndex;
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(_.bind(function () {
            $preElem && $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
            $elem.trigger("focus");
          }, this), 50);
        },

        onKeyInView: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          if (event.keyCode === 9) {
            // tab
            if (event.shiftKey) {  // shift tab -> activate previous region
              setTimeout(_.bind(function () {
                this._resetFocusedListElem();
              }, this), 50);
              // }
            }
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            // space(32) or enter(13)
            if (this.currentTabPosition === TabPosition.list) {
              event.preventDefault();
              event.stopPropagation();
              this.selectAt(this.selectedIndex);
            }
          }
          else if (event.keyCode === 27) { // escape
            if (this.previewPane) {
              this.previewPane.hide();
              // reset focus to button of missing documents/displayUrl
              var but = this.previewPane.parent.$el.find('button');
              if (but){
                but.trigger("focus");
              }
            }
         }

        },

        onKeyDown: function (event) {
          if (this.config.debug === true) {
            console.log('preview-behavior: onKeydown - keyCode:' + event.which );
          }
          this._checkFocusAndSetCurrentTabPosition();
          if (this.currentTabPosition !== TabPosition.list) {
            this.onKeyInView(event);
            return;
          }

          var selIndex = this.selectedIndex;
          if (selIndex < 0 || selIndex === undefined) {
            selIndex = this.getSelectedIndex();
          }
          var $preElem = this.selectedIndexElem(selIndex);

          switch (event.which) {
          case 33: // page up
            this._moveTo(event, this._selectFirst(), $preElem);
            break;
          case 34: // page down
            this._moveTo(event, this._selectLast(), $preElem);
            break;
          case 38: // up
            this._moveTo(event, this._selectPrevious(), $preElem);
            break;
          case 40: // down
            this._moveTo(event, this._selectNext(), $preElem);
            break;
          default:
            this.onKeyInView(event);
            return; // exit this handler for other keys
          }
        },

        _selectFirst: function () {
          this.selectedIndex = 0;
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectLast: function () {
          this.selectedIndex = this.collection.length - 1;
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectNext: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          if (this.selectedIndex < this.collection.length - 1) {
            this.selectedIndex++;
          }
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectPrevious: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.selectedIndexElem(this.selectedIndex);
        },

        selectAt: function (index) {
          if (index >= this.collection.length || index < 0) {
            return;
          }
          var $elem = this.selectedIndexElem(index);
          $elem && $elem.trigger("click");
        }

      });

    }, // constructor

    refreshTabableElements: function (view) {
      log.debug('PreviewPaneListKeyboardBehavior::refreshTabableElements ' +
                view.constructor.name) &&
      console.log(log.last);
      this.view.currentTabPosition = TabPosition.none;
      this.view.selectedIndex = -1;
    }

  });

  return PreviewPaneListKeyboardBehavior;
});

/**
 * Created by mtanwar on 26-07-2016.
 */

csui.define('xecmpf/widgets/header/impl/previewpane/impl/previewpane.list.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/list/simplelist.view', 'csui/controls/node-type.icon/node-type.icon.view',
  'xecmpf/widgets/header/impl/previewpane/impl/previewpane.list.keyboard.behavior',
  'csui/dialogs/modal.alert/modal.alert'

], function (_, $, Backbone, Marionette,
    SimpleListView, NodeTypeIconView, PreviewPaneListKeyboardBehavior, ModalAlert) {

  var PreviewPaneListView = SimpleListView.extend({

    constructor: function PreviewPaneListView(options) {
      SimpleListView.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PreviewPaneListKeyboardBehavior: {
        behaviorClass: PreviewPaneListKeyboardBehavior
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    initialize: function (options) {
      options || (options = {});
      this.enableIcon = options.enableIcon;
      this.enableDescription = options.enableDescription;
      // for preview pane list keyboard behavior:
      this.previewPane = options.previewPane;
      // for debugging option
      this.config = options.config;

      this.listenTo(this, 'childview:render', this.onRenderItem);
      this.listenTo(this, 'childview:before:destroy', this.onBeforeDestroyItem);
      this.listenTo(this, 'click:item', this.onClickListItem);
    },

    childViewOptions: function (childViewModel) {
      return {
        templateHelpers: function () {
          return {
            enableIcon: this.enableIcon,
            enableDescription: this.enableDescription,
            name: childViewModel.get('name')
          };
        }.bind(this)
      };
    },

    onClickListItem: function (src) {
      var url   = src.model.get('displayUrl'),
          error = src.model.get('displayUrlError');
      if (error) {
        ModalAlert.showError(error);
      } else if (url) {
        var browserTab = window.open(url, '_blank');
        browserTab.focus();
      }
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();
      if (this.options && childView.model
          && childView.model.attributes
          && childView.model.attributes.name
          && this.options.enableDescription) {
        var locHTML = '<div class="SLITitleDiv"><div class="SLITitle"><span title="' +
                      childView.model.attributes.name
                      + '">' +
                      childView.model.attributes.name
                      + '</span></div><div class="SLIDescription"><span title="' +
                      childView.model.attributes.classification_name
                      + '">' +
                      childView.model.attributes.classification_name
                      + '</span></div></div>';
        childView.$('.list-item-title').replaceWith(locHTML);
      }
      var displayUrl = childView.model.get('displayUrl');
      if ( displayUrl) {
        var a = childView.$el[0];
        a.href = displayUrl;
      }
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    }
  });

  return PreviewPaneListView;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/header/impl/previewpane/impl/previewpane',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n<div class=\"binf-panel-body xecmpf-preview-body\"></div>\r\n\r\n<div class=\"binf-panel-footer xecmpf-preview-footer\">"
    + this.escapeExpression(((helper = (helper = helpers.info || (depth0 != null ? depth0.info : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"info","hash":{}}) : helper)))
    + "</div>\r\n";
}});
Handlebars.registerPartial('xecmpf_widgets_header_impl_previewpane_impl_previewpane', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!xecmpf/widgets/header/impl/previewpane/impl/previewpane',[],function(){});
csui.define('xecmpf/widgets/header/impl/previewpane/previewpane.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'xecmpf/widgets/header/impl/previewpane/impl/previewpane.list.view',
  'hbs!xecmpf/widgets/header/impl/previewpane/impl/previewpane', 'i18n',
  'css!xecmpf/widgets/header/impl/previewpane/impl/previewpane'
], function (_, $, Marionette,
    base, PerfectScrollingBehavior, LayoutViewEventsPropagationMixin,
    PreviewListView, template, i18n) {

  var PreviewPaneView = Marionette.LayoutView.extend({

    className: 'xecmpf-preview binf-panel binf-panel-default',

    constructor: function PreviewPaneView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
      options || (options = {});
      this.config = options.config;

      if (this.config) {
        // the related item view to show the preview for
        this.parent = options.parent;
        this.config.readonly = true;

        this.docsCollection = options.collection;
        this.headerTitle = options.headerTitle;
        this.footerInfoText = options.info;

        //---------------------------------------------------------------
        // setup binf-popover
        //---------------------------------------------------------------
        this.direction = i18n.settings.rtl ? 'left' : 'right';
        options.parent.$el.binf_popover({
          content: this.$el,
          placement: "auto " + this.direction,
          trigger: 'manual',
          container: 'body',
          html: true,
          // html accessiblity check: no empty headings are allowed
          // -> use pop-over title instead of our own missing documents header
          title: options.headerTitle
        });

        var $tip = this.parent.$el.data('binf.popover');
        var $pop = $tip.tip();
        var customPopoverClass = !options.customPopoverClass ? options.customPopoverClass : "";
        $pop.addClass('xecmpf-previewpane-popover').addClass(options.customPopoverClass);
        //Added a background colour to the header to match the colour of the MissingDocument/Outdated/InProcess icon
        if (options && options.headerColor) {
          if (this.config.debug === true) {
            console.log('add headerColor ' + options.headerColor + ' to ' +
                        $pop.find('.binf-popover-title'));
          }
          $pop.find('.binf-popover-title').addClass(options.headerColor);
        }

        //---------------------------------------------------------------
        // setup event handlers for binf-popover and its associated item view
        //---------------------------------------------------------------
        // SAPRM-11635:
        this.parent.$el.off('click').on('click', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Keyboard enter item');
          }
          this.show();
          // we have to set focus in simple list else keyboard navigation is
          // not working:
          var index = 0;
          var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1);
          var $item = this.docsListView.$(nthChildSel);
          $item.first().trigger("focus");
        }, this));

        this.parent.$el.off('mouseenter').on('mouseenter', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseenter item');
          }
          this.show();
        }, this));

        this.parent.$el.off('keydown').on('keydown', $.proxy(function () {
          if(event.keyCode === 13 || event.keyCode === 32  )
          {
            this.show();
          }
          if (event.keyCode === 27 && this.isRendered ){
          this._delayedHide();	
          }
        }, this));

        this.toggle = 0;
        this.parent.$el.on('touchend', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : touchend item');
          }

          if (!this.$el.is(":visible")) {
            this.toggle = 0;
          }

          if (this.toggle === 0) {
            this.show();
          } else if (this.toggle === 1) {
            this._delayedHide();
          }
        }, this));

        this.parent.$el.off('mouseleave').on('mouseleave', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseleave item');
          }
          this._delayedHide();
        }, this));

        $pop.off('mouseenter').on('mouseenter', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseenter binf-popover');
          }
          this.show();
        }, this));

        $pop.off('keydown').on('keydown', $.proxy(function (event) {
          if(event.keyCode === 27){this._delayedHide();}
                  }, this));

        $pop.off('mouseleave').on('mouseleave', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseleave binf-popover');
          }
          this._delayedHide();
        }, this));

        this.propagateEventsToRegions();
        this.listenTo(this, 'dom:refresh', function () {
          this.options.parent.$el.binf_popover('show');
        });
      }
    },

    template: template,

    regions: {
      contentRegion: '.xecmpf-preview-body',
      footerRegion: '.xecmpf-preview-footer'
    },

    templateHelpers: function () {
      return {
        title: this.headerTitle,
        info: this.footerInfoText
      };
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.xecmpf-preview-body',
        suppressScrollX: true
      }
    },

    onBeforeDestroy: function (e) {
      if (this.config) {
        this.parent.$el.binf_popover('destroy');
      }
    },

    show: function () {
      if (this.config) {
        var that = this;

        if (this.config.debug === true) {
          console.log('Preview : Preparing show');
        }

        // clear hide timeout if there is one
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
          if (this.config.debug === true) {
            console.log('Preview : Cleared hide timeout');
          }
          this.hideTimeout = null;
        }

        // nothing to do if already visible
        if (this.$el.is(":visible")) {
          if (this.config.debug === true) {
            console.log('Preview : Already visible');
          }
          return;
        }

        this.showCancelled = false;

        this.$el.hide();
        this.render();

        if (this.docsListView) {
          this.docsListView.destroy()
        }

        this.docsListView = new PreviewListView({
          collection: this.docsCollection,
          enableIcon: this.options.enableIcon,
          enableDescription: this.options.enableDescription,
          // for hiding in preview pane list keyboard behaviour
          previewPane: this,
          // for logging in preview pane list keyboard behaviour
          config: this.config
        });

        this.listenTo(this.docsListView, 'before:DefaultAction', function (args) {
          args.cancelDefaultAction = this.options.cancelDefaultAction
        });

        if (!this.showCancelled) {
          // in case of keyboard navigation this
          // closes every second time the popup
          // mouse hover is nevetheless working fine
          // therefore commented out
          // close all other preview popovers
          // $(".xecmpf-previewpane-popover").each(function (i, el) {
          //   var popoverId = $(el).attr('id');
          //   $("[aria-describedby^='" + popoverId + "']").binf_popover('hide');
          // });

          if (this.config.debug === true) {
            console.log('Preview : Showing');
          }

          // prepare and show binf-popover for this item
          this.contentRegion.show(this.docsListView, {
            render: true
          });
          this.$el.show();
          this.triggerMethod('before:show', this);
          this.toggle = 1;
          this.options.parent.$el.binf_popover('show');
          this.triggerMethod('show', this);

          if (this.config.debug === true) {
            console.log("Viewport height: " + $(window).height());
            console.log("document height: " + $(document).height());
            console.log("body     height: " + $('body').height());
            console.log("binf-popover  height: " + this.$el.height());
            console.log("list     height: " +
                        this.$el.find('.xecmpf-preview-body').height());
          }
        } else if (this.config.debug === true) {
          console.log('Preview : Show was cancelled');
        }
      }
    },

    hide: function () {
      if (this.config.debug === true) {
        console.log('Preview : Going to hide');
      }

      if (this.config && !this.config.debugNoHide) {
        if (this.config.debug === true) {
          console.log('Preview : Hidden');
        }
        this.toggle = 0;
        this.options.parent.$el.binf_popover('hide');
        this.hideTimeout = null;
      } else {
        if (this.config.debug === true) {
          console.log('Preview : Leaving visible');
        }
      }

      this.showCancelled = true;
      this.hideTimeout = null;
    },

    _delayedHide: function () {
      if (this.config.debug === true) {
        console.log('Preview : Setting hide timeout');
      }
      this.hideTimeout = window.setTimeout($.proxy(this.hide, this), 200);
    },

    onShow: function () {
      /**
       * to make the PerfectScrollingBehavior works for the simplelist.view,
       * the height needs to be set
       */
      this.$('.cs-simplelist.binf-panel').css('height',
          this.$('.binf-panel-body.xecmpf-preview-body').height());

      if (!this.footerInfoText) {
        $(this.regions.footerRegion).hide()
      }
    }
  });

  _.extend(PreviewPaneView.prototype, LayoutViewEventsPropagationMixin);

  return PreviewPaneView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheckitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"csui-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\"></span>\r\n  <button class=\"count binf-btn binf-btn-default xecmpf-docscount-without-text\">"
    + this.escapeExpression(((helper = (helper = helpers.docsCount || (depth0 != null ? depth0.docsCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"docsCount","hash":{}}) : helper)))
    + "</button>\r\n  <button class=\"count binf-btn binf-btn-default xecmpf-docscount-with-text\">"
    + this.escapeExpression(((helper = (helper = helpers.docsCountWithText || (depth0 != null ? depth0.docsCountWithText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"docsCountWithText","hash":{}}) : helper)))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.docsCount : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_widgets_header_impl_completenesscheck_impl_completenesscheckitem', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheck',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div class=\"missing-docs-check\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideMissingDocsCheck : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_widgets_header_impl_completenesscheck_impl_completenesscheck', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/header/impl/completenesscheck/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


csui.define('xecmpf/widgets/header/impl/completenesscheck/impl/nls/root/lang',{
  missingDocsTitle: "Missing documents",
  dialogTitle: "Reports",
  recentReportName: "Last 10 added documents",
  addedReportName: "Documents you added",
  missingReportName: "{0} missing",
  emptyMessage: "No documents to display"
});



csui.define('css!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheck',[],function(){});
csui.define('xecmpf/widgets/header/impl/completenesscheck/completenesscheck.view',[
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'conws/models/workspacecontext/workspacecontext.factory',
    'xecmpf/widgets/header/impl/completenesscheck/impl/missingdocuments.factory',
    //Load and register external views document items.
    'csui-ext!xecmpf/widgets/header/completenesscheck/completenesscheck.factory',
    'xecmpf/widgets/header/impl/previewpane/previewpane.view',
    'hbs!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheckitem',
    'hbs!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheck',
    'i18n!xecmpf/widgets/header/impl/completenesscheck/impl/nls/lang',
    'css!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheck'
], function (_, $, Backbone, Marionette, WorkspaceContextFactory,
    MissingDocumentsFactory, extraItems,
    PreviewPaneView, itemTemplate, layoutTemplate, lang) {

        var OUTDATED_DOCUMENTS_FACTORY = "selfserviceOutdatedCollection",
            INPROCESS_DOCUMENT_FACTORY = "selfserviceQueuedCollection";

        var DocsCheckItemView = Marionette.ItemView.extend({

            className: 'docs-check-list-item',

            constructor: function DocsCheckItemView(options) {
                options || (options = {});
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.listenTo(this.options.collection, 'change', this.render);

                if (this.options && this.options.preview) {
                    this.previewPane = new PreviewPaneView({
                        parent: this,
                        context: this.options.workspaceContext,
                        config: this.options.preview,
                        collection: this.options.collection,
                        headerTitle: this.options.title,
                        enableIcon: this.options.enableIcon,
                        headerColor: options.headerColor,
                        enableDescription: options.enableDescription,
                        info: this.options.info,
                        cancelDefaultAction: this.options.cancelDefaultAction,
                        customPopoverClass: this.options.customPopoverClass
                    });
                }
            },

            template: itemTemplate,

            templateHelpers: function () {
                return {
                    icon: this.options.icon,
                    docsCount: this.options.collection.length,
                    docsCountWithText: _.str.sformat(this.options.label, this.options.collection.length)
                }
            },

            onBeforeDestroy: function () {
                if (this.previewPane) {
                    this.previewPane.destroy();
                    delete this.previewPane;
                }
            }
        });

        var CompletenessCheckView = Marionette.LayoutView.extend({

            className: 'xecmpf-completenesscheck',

            constructor: function CompletenessCheckView(options) {
                options || (options = {});
                Marionette.LayoutView.prototype.constructor.apply(this, arguments);

                if (!options.workspaceContext) {
                    options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
                }
                options.workspaceContext.setWorkspaceSpecific(MissingDocumentsFactory);

                this.missingDocsCollection = !options.hideMissingDocsCheck ?
                    options.workspaceContext.getCollection(MissingDocumentsFactory) :
                    undefined;


            },

            template: layoutTemplate,

            templateHelpers: function () {
                return {
                    hideMissingDocsCheck: this.options.hideMissingDocsCheck
                }
            },

            onRender: function () {
                this.showCompletenessCheck({
                    collection: this.missingDocsCollection,
                    title: lang.missingDocsTitle,
                    label: lang.missingReportName,
                    icon: 'missing-icon',
                    index: 0,
                    enableIcon: false,
                    region: this.missingDocsRegion,
                    enableDescription: false,
                    cancelDefaultAction: true,
                    customPopoverClass: 'xecmpf-missing-docs-check'
                });
                
                //Getting the external items
                this.showExternalViews(this.options);
            },

            regions: {
                missingDocsRegion: '.missing-docs-check'
            },

            showCompletenessCheck: function (options) {
                if (options.collection) {
                    if (options.collection.fetched === true && options.collection.length > 0) {
                        this._showCompletenessCheck(options);
                        this._completenessCheckAvailable();
                    }
                    this.listenToOnce(options.collection, 'sync', function () {
                        if (options.collection.length > 0) {
                            options.collection.fetched = true;
							
							// Read the options once the collection is synced. This helps to set the icon, label, title and popover class dynamically using the response from server.
                            options.title = (options.collection.options && options.collection.options.name) ?
											options.collection.options.name : options.title;
                            options.label = (options.collection.options && options.collection.options.label) ?
											options.collection.options.label : options.label;
                            options.icon = (options.collection.options && options.collection.options.iconClass) ?
											options.collection.options.iconClass : options.icon;
                            options.customPopoverClass = (options.collection.options &&
														 options.collection.options.customPopoverClass ) ?
														options.collection.options.customPopoverClass :
														options.customPopoverClass;
														 
                            this._showCompletenessCheck(options);
                            this._completenessCheckAvailable();
                        }
                    });
                }
            },

            _completenessCheckAvailable: function () {
                this.trigger('completeness:check:available');
                if (this.options.originatingView) {
                    this.options.originatingView.trigger('completeness:check:available');
                }
            },

            _showCompletenessCheck: function (options) {
                this.showRegion = true;
                if (!options.region) {
                    var regionClass0 = this.regionManager.completenesscheck_view0;
                    var regionClass1 = this.regionManager.completenesscheck_view1;
                    if ((regionClass0 && options.index === 0) || (regionClass1 && options.index === 1)) {
                        this.showRegion = false;
                    } else {
                        var newRegion = 'completenesscheck_view' + options.index;
                        this.addRegion(newRegion);
                        options.region = this.regionManager[newRegion]
                    }
                }
                if (this.showRegion) {
                    options.region.show(new DocsCheckItemView({
                        workspaceContext: this.options.workspaceContext,
                        collection: options.collection,
                        preview: { debug: false },
                        title: options.title,
                        label: options.label,
                        icon: options.icon,
                        headerColor: options.headerColor,
                        enableIcon: options.enableIcon,
                        enableDescription: options.enableDescription,
                        cancelDefaultAction: options.cancelDefaultAction,
                        customPopoverClass: options.customPopoverClass
                    }));
                }
            },
            showExternalViews: function (options) {
                if (extraItems && extraItems.length > 0) {
                    var collection,
                        that = this;
                    _.each(extraItems, function (item, index) {
                        if (options.hideOutdatedDocsCheck &&
                            item.prototype.propertyPrefix === OUTDATED_DOCUMENTS_FACTORY) { return; }
                        if (options.hideInProcessDocsCheck &&
                            item.prototype.propertyPrefix === INPROCESS_DOCUMENT_FACTORY) { return; }
                        if (!options.workspaceContext) {
                            options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
                        }
                        options.workspaceContext.setWorkspaceSpecific(item);
                        collection = options.workspaceContext.getCollection(item);
                        that.showCompletenessCheck({
                            collection: collection,
                            title: collection.options.name,
                            label: collection.options.label ? collection.options.label : collection.options.name,
                            icon: collection.options.iconClass,
                            headerColor: collection.options.headerColor,
                            enableIcon: collection.options.enableIcon,
                            enableDescription: collection.options.enableDescription,
                            index: index,
                            cancelDefaultAction: collection.options.cancelDefaultAction,
                            customPopoverClass: collection.options.customPopoverClass
                        });

                    });
                }
            },
            addRegion: function (regionName) {
                if (!this.regionManager) {
                    this.regionManager = {};
                }
                var that = this;
                var $el = $(this.el);
                $el.append($('<div></div>').attr({ class: regionName }));
                // Manipulate the template - add the new region to the end.
                /* For SAPSSF-4393 - JQuery Migrate - selector property removed in jQuery 3.0. Earlier jQuery object used to have selector property but in jQuery 3.0 that property has been removed and that was causing an exception in the buildRegion method. Hence making syntactic changes to send the el option */
                var temRegion = Marionette.Region.buildRegion({ el: $el.find('.' + regionName) }, Marionette.Region);
                temRegion.getEl = function (selector) {
                    return that.$(selector);
                };
                this.regionManager[regionName] = temRegion;
            }
        });
        return CompletenessCheckView;
    });

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/header/impl/displayUrl/impl/displayUrlItem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <a class=\"xecmpf-displayUrl-icon conws-quick_link "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.displayUrlError : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.displayUrlTooltip || (depth0 != null ? depth0.displayUrlTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayUrlTooltip","hash":{}}) : helper)))
    + "\"\r\n     aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaLabelBusApplText || (depth0 != null ? depth0.ariaLabelBusApplText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaLabelBusApplText","hash":{}}) : helper)))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.displayUrlError : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0)})) != null ? stack1 : "")
    + "></a>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "\r\n    xecmpf-displayUrl-error ";
},"4":function(depth0,helpers,partials,data) {
    return "  href=\"#\"  ";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n     href=\""
    + this.escapeExpression(((helper = (helper = helpers.displayUrl || (depth0 != null ? depth0.displayUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayUrl","hash":{}}) : helper)))
    + "\" target=\"_blank\"";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "  <button class=\"xecmpf-displayUrl-icon conws-quick_link binf-btn binf-btn-default\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaLabelBusApplText || (depth0 != null ? depth0.ariaLabelBusApplText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaLabelBusApplText","hash":{}}) : helper)))
    + "\"></button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.displayUrl : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(8, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_widgets_header_impl_displayUrl_impl_displayUrlItem', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!xecmpf/widgets/header/impl/displayUrl/impl/displayUrl',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div id=\"displayUrl-check\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.bDisplayUrl : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('xecmpf_widgets_header_impl_displayUrl_impl_displayUrl', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/widgets/header/impl/displayUrl/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


csui.define('xecmpf/widgets/header/impl/displayUrl/impl/nls/root/lang',{
  displayUrlTooltip: "Business application",
  displayUrlTitle: "Business applications",
  ariaLabelBusApplText: "Go to business application"
});



csui.define('css!xecmpf/widgets/header/impl/displayUrl/impl/displayUrl',[],function(){});
csui.define('xecmpf/widgets/header/impl/displayUrl/displayUrl.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/widgets/header/impl/previewpane/previewpane.view',
  'hbs!xecmpf/widgets/header/impl/displayUrl/impl/displayUrlItem',
  'hbs!xecmpf/widgets/header/impl/displayUrl/impl/displayUrl',
  'i18n!xecmpf/widgets/header/impl/displayUrl/impl/nls/lang',
  'css!xecmpf/widgets/header/impl/displayUrl/impl/displayUrl'
], function (_, $, Backbone, Marionette, ModalAlert, PreviewPaneView, itemTemplate,
    layoutTemplate, lang) {

  var DisplayUrlItemView = Marionette.ItemView.extend({

    className: 'xecmpf-displayUrl-item',

    constructor: function DisplayUrlItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.collection, 'change', this.render);

      if (this.options && this.options.preview &&
          // only in case of more than 1 display url:
          options.collection.length > 1
      ) {
        this.previewPane = new PreviewPaneView({
          parent: this,
          config: {debug: true},
          collection: options.collection,
          headerTitle: lang.displayUrlTitle,
          headerColor: options.headerColor
        });
      }
    },

    events: {
      "click .xecmpf-displayUrl-error": 'showError'
    },

    template: itemTemplate,

    templateHelpers: function () {
      // displayUrl: the display Url if bus. wksp. is assigned to exactly 1 bus. appl.
      var displayUrl = (this.options.collection.length === 1) ?
                       this.options.collection.models[0].get('displayUrl') : false;

      var displayUrlError = (this.options.collection.length === 1) ?
                            this.options.collection.models[0].get('displayUrlError') : "";

      // in case wksp. is assigned to exactly 1 bus. appl.:
      // aria label: lang.ariaLabelBusApplText + external system name
      // in case wksp. is assigned to several bus. appls.:
      // aria label: lang.ariaLabelBusApplText
      var ariaLabelBusApplText = lang.ariaLabelBusApplText + (displayUrl ?
                                 ' ' +
                                 this.options.collection.models[0].get('external_system_name') :
                                                              '');

      // Tooltip only useful exactly 1 bus. appl.
      var displayUrlTooltip = displayUrl ? lang.displayUrlTooltip : '';

      return {
        ariaLabelBusApplText: ariaLabelBusApplText,
        displayUrlTooltip: displayUrlTooltip,
        displayUrl: displayUrl,
        displayUrlError: displayUrlError
      }
    },

    onBeforeDestroy: function () {
      if (this.previewPane) {
        this.previewPane.destroy();
        delete this.previewPane;
      }
    },

    showError: function () {
      ModalAlert.showError(this.options.collection.models[0].get('displayUrlError'));
    }

  });

  var DisplayUrlView = Marionette.LayoutView.extend({

    className: 'xecmpf-displayUrlcheck',

    constructor: function DisplayUrlView(options) {
      options || (options = {});
      this.model = options.model;
      this.options.headerColor = 'xecmpf-displayUrl-header-background';
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    template: layoutTemplate,

    templateHelpers: function () {
      // bDisplayUrl: whether the link should be displayed at all:
      var bDisplayUrl = (this.model.display_urls && (this.model.display_urls.length > 0)) ?
                        true : false;
      return {
        bDisplayUrl: bDisplayUrl
      }
    },

    regions: {
      displayUrlRegion: '#displayUrl-check'
    },

    onRender: function () {
      var collection;
      if (this.model.display_urls && this.model.display_urls.length >= 1) {
        var displayUrlArray = _.map(this.model.display_urls, function (item) {
          var name = item.business_object_type_name + ' (' + item.external_system_name +
                     ')';
          return {
            name: name,
            displayUrl: item.displayUrl,
            external_system_name: item.external_system_name,
            displayUrlError: item.errMsg
          }
        });
        collection = new Backbone.Collection();
        collection.add(displayUrlArray);

        this.displayUrlRegion.show(new DisplayUrlItemView({
          collection: collection,
          preview: {debug: true},
          headerColor: this.options.headerColor
        }));
      }
    }
  });

  return DisplayUrlView;

});

// Lists explicit locale mappings and fallbacks

csui.define('xecmpf/widgets/header/impl/nls/header.lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
  });
// Defines localizable strings in the default language (English)

csui.define('xecmpf/widgets/header/impl/nls/root/header.lang',{
    noMetadataMessage: 'No data to display.',
    CollapsePageOverlay: "Close"
  });

csui.define('xecmpf/widgets/header/impl/metadata.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'i18n!xecmpf/widgets/header/impl/nls/header.lang'
], function (_, $, Marionette, Handlebars,
    EmptyListView, PerfectScrollingBehavior,
    WorkspaceContextFactory, SelectedMetadataFormFactory, SelectedMetadataFormView, lang) {

  var MetadataView = Marionette.ItemView.extend({
    className: 'xecmpf-form-metadata',

    attributes: {
      style: 'height: 100%'
    },

    template: false,

    constructor: function MetadataView(options) {
      options || (options = {});
      if (!options.context) {
        throw new Error('Context is missing in the constructor options');
      }

      // get workspace context
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
      }
      options.workspaceContext.setWorkspaceSpecific(SelectedMetadataFormFactory);

      // get model collection from the model factory
      options.model = options.workspaceContext.getObject(SelectedMetadataFormFactory, {
        metadataConfig: options.data,
        unique: true
      });

      this.noMetadataMessage = lang.noMetadataMessage;

      Marionette.ItemView.prototype.constructor.call(this, options);

      this.listenTo(options.model, 'change', this.render);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: this.$el,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    onRender: function () {
      this.formRegion = new Marionette.Region({el: this.$el});
      if (!_.isEmpty(this.model.attributes.data)) {
        // Code to remove the null values in the data
        this.noDataFound = false;
        var metadata = this.model.attributes.data;
        var colOptions = this.options.data.colOptions;
        var fields = this.model.attributes.options.fields;
        _.each(_.keys(metadata), function (key) {
          if (metadata[key] === "null") {
            metadata = _.omit(metadata, key);
            fields[key].hidden = true;
          }
        });
        this.model.attributes.data = metadata;
        this.model.attributes.options.fields = fields;

        // XECMPF-422
        if(colOptions === "doubleCol") {
          var count = _.size(_.filter(_.keys(fields), function(key){
            return fields[key].hidden !== undefined && fields[key].hidden === false;
          }));
          colOptions = count > 5 ? "doubleCol" : "singleCol";
        }

        this.formView = new SelectedMetadataFormView({
          model: this.model,
          context: this.options.context,
          layoutMode: !!colOptions && colOptions === 'singleCol' ? colOptions : 'doubleCol',
          breakFieldsAt: 5
        });
        this.formRegion.show(this.formView);
        this.triggerMethod("xecmpf:metadata:config");
      } else {
        this.noDataFound = true;
        this.formView = new EmptyListView({text: this.noMetadataMessage});
        this.formRegion.show(this.formView);
        this.triggerMethod("xecmpf:metadata:config");
      }
      this.listenTo(this.formView, 'render:form', function () {
        this.triggerMethod("dom:refresh");
      });
    }
  });

  return MetadataView;
});


csui.define('css!xecmpf/widgets/header/impl/header',[],function(){});
// Workspace Header View
csui.define('xecmpf/widgets/header/header.view',['module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'conws/widgets/header/header.view',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'xecmpf/widgets/header/impl/completenesscheck/completenesscheck.view',
  'xecmpf/widgets/header/impl/displayUrl/displayUrl.view',
  'esoc/widgets/activityfeedwidget/activityfeedfactory',
  'esoc/widgets/activityfeedwidget/activityfeedcontent',
  'xecmpf/widgets/header/impl/metadata.view',
  'conws/controls/description/description.view',
  'css!xecmpf/widgets/header/impl/header'
], function (module, _, $, Marionette, Handlebars,
    ConwsHeaderView, MetadataFactory,
    CompletenessCheckView, DisplayUrlView,
    ActivityFeedFactory, ActivityFeedContent,
    MetadataView, DescriptionView) {

  // activity feed widget
  var constants = {'activityfeedwidget': 'esoc/widgets/activityfeedwidget'};
  var moduleConfig = module.config();
  var HeaderView = ConwsHeaderView.extend({

    id: 'xecmpf-header',

    constructor: function HeaderView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.data.widget || (options.data.widget = {});
      options.data.widget.type || (options.data.widget.type = 'metadata');
      options.hideToolbar = !!moduleConfig.hideToolbar;
      options.hideActivityFeed = !!moduleConfig.hideActivityFeed;
      options.hideMetadata = !!moduleConfig.hideMetadata || !(options.data.metadataSettings &&
                                                              options.data.metadataSettings.metadata &&
                                                              !options.data.metadataSettings.hideMetadata);
      options.toolbarBlacklist = [];
      options.extensionToolbarBlacklist = [];
      options.delayedToolbarBlacklist = [];
      options.extensionToolbarDelayedActionsBlacklist = [];
      options.enableCollapse = !!moduleConfig.enableCollapse;

      var toolbarBlacklist = moduleConfig.toolbarBlacklist;
      if (Array.isArray(toolbarBlacklist) && toolbarBlacklist.length > 0) {
        options.toolbarBlacklist = toolbarBlacklist;
      }
      var delayedToolbarBlacklist = moduleConfig.delayedToolbarBlacklist;
      if (Array.isArray(delayedToolbarBlacklist) && delayedToolbarBlacklist.length > 0) {
        options.delayedToolbarBlacklist = delayedToolbarBlacklist;
      }
      var extensionToolbarBlacklist = moduleConfig.extensionToolbarBlacklist;
      if (Array.isArray(extensionToolbarBlacklist) && extensionToolbarBlacklist.length > 0) {
        options.extensionToolbarBlacklist = extensionToolbarBlacklist;
      }

      var extensionToolbarDelayedActionsBlacklist = moduleConfig.extensionToolbarDelayedActionsBlacklist;
      if (Array.isArray(extensionToolbarDelayedActionsBlacklist) &&
          extensionToolbarDelayedActionsBlacklist.length > 0) {
        options.extensionToolbarDelayedActionsBlacklist = extensionToolbarDelayedActionsBlacklist;
      }

      if (options.data && options.data.favoriteSettings &&
          options.data.favoriteSettings.hideFavorite) {
        if (!options.toolbarBlacklist['Favorite2']) {
          options.toolbarBlacklist.push('Favorite2');
        }
        if (!options.extensionToolbarBlacklist['Favorite2']) {
          options.extensionToolbarBlacklist.push('Favorite2');
        }
      }

      if (!options.extensionToolbarBlacklist['CompletenessCheck']) {
        options.extensionToolbarBlacklist.push('CompletenessCheck');
      }
      var cCConfig      = options.data.completenessCheckSettings,
          cCViewOptions = {
            context: options.context,
            workspaceContext: options.workspaceContext,
            hideMissingDocsCheck: cCConfig && cCConfig.hideMissingDocsCheck,
            hideOutdatedDocsCheck: cCConfig && cCConfig.hideOutdatedDocsCheck,
            hideInProcessDocsCheck: cCConfig && cCConfig.hideInProcessDocsCheck
          };

      options.cCViewOptions = cCViewOptions;
      options.statusIndicatorsView = CompletenessCheckView;
      options.statusIndicatorsViewOptions = _.extend(cCViewOptions, {originatingView: this});

      ConwsHeaderView.prototype.constructor.call(this, options);
      if (options.workspaceContext) {
        options.workspaceContext.setWorkspaceSpecific(MetadataFactory);
        options.workspaceContext.setWorkspaceSpecific(ActivityFeedFactory);
      }
    },

    initialize: function (options) {
      options || (options = {});
      if (options.data) {

        var headerwidgetConfigValue = options.data.headerwidget ? (options.data.headerwidget.type ?
                                                                   options.data.headerwidget.type :
                                                                   "metadata" ) : "metadata";
        this.headerwidgetConfigValue = headerwidgetConfigValue;

        if (headerwidgetConfigValue === 'metadata'
            && (options.data.widget.type === 'metadata') && !this.options.hideMetadata) {
          var mConfig = options.data.metadataSettings;
          var metadata = this._makeMetadataReadOnly(mConfig.metadata);
          var mViewOptions = {
            context: options.context,
            workspaceContext: options.workspaceContext,
            data: {
              hideEmptyFields: mConfig.hideEmptyFields,
              metadata: metadata,
              readonly: true,
              colOptions: options.data.metadataSettings.metadataInColumns
            }
          };
          this.metadataView = new MetadataView(mViewOptions);
          this.listenTo(this.metadataView, 'xecmpf:metadata:config', function () {
            if (this.metadataView.noDataFound) {
              this.$el.parent().addClass('xecmpf-metadata-configured-nodata').removeClass(
                  'xecmpf-metadata-configured');
            } else {
              this.$el.parent().addClass('xecmpf-metadata-configured').removeClass(
                  'xecmpf-metadata-configured-nodata');
            }
          });
        }
        if (this.headerwidgetConfigValue === 'activityfeed' && !this.options.hideActivityFeed) {
          options.data.widget.type = constants.activityfeedwidget;
          options.data.widget.options || (options.data.widget.options = {});
        }

        if (!moduleConfig.pageWidget) {
          var cCViewOptions = _.extend(options.cCViewOptions,
              {workspaceContext: options.workspaceContext});
          if (!cCViewOptions.hideMissingDocsCheck || !cCViewOptions.hideOutdatedDocsCheck ||
              !cCViewOptions.hideInProcessDocsCheck) {
            this.options.hasMetadataExtension = true;
            this.completenessCheckView = new CompletenessCheckView(cCViewOptions);
          }
        }

        var displayUrlViewOptions = {
          model: this.model,
          logging: {debug: false}
        };
        this.displayUrlView = new DisplayUrlView(displayUrlViewOptions);

        this.listenTo(this.completenessCheckView, 'completeness:check:available', function () {
          this.$el.parent().addClass('xecmpf-completenesscheck-available');
          options.expandDescription = false;
          if (!this.options.hideDescription && !this.hasEmptyDescription()) {
            var data = {
              view: this,
              complete_desc: this.resolveProperty('description'),
              expandDescription: options.expandDescription
            };
            this.descriptionView = new DescriptionView(data);
            this.descriptionRegion.show(this.descriptionView);
            this.$el.parent().addClass('conws-description-available');
            this.listenToDescriptionView();
          }
        });

       this.listenTo(this, 'render', function () {
          if (this.model.fetched) {
            this.showChildViews();
          }
        });
      }
    },

    ui: {
      completenessCheckRegion: '.conws-header-metadata-extension',
      metadataRegion: '#conws-header-childview',
      displayUrlRegion: '.conws-header-child-displayUrl'
    },

    _makeMetadataReadOnly: function (arr) {
      var metadata = arr || [];
      metadata.forEach(function (obj) {
        obj['readOnly'] = true;
      });
      return metadata;
    },

    showChildViews: function () {
      if (this.completenessCheckView) {
        this.completenessCheckRegion = new Marionette.Region({el: this.ui.completenessCheckRegion});
        this.completenessCheckRegion.show(this.completenessCheckView);
        this.listenToDescriptionView();
      }
      if (this.metadataView) {
        this.metadataRegion = new Marionette.Region({el: this.ui.metadataRegion});
        this.metadataRegion.show(this.metadataView);
      }
      if (this.displayUrlView) {
        this.displayUrlRegion = new Marionette.Region({el: this.ui.displayUrlRegion});
        this.displayUrlRegion.show(this.displayUrlView);
      }
      this.listenTo(this, 'completeness:check:available', function () {
        // since status indicator is having an indirect dependency with completeness check via header, 
        // instead of dependending on just the events, maintain the value within the instance variable 
        // so that it can be used incase required..mostly when the reinitialize is called for all regions.
        this.headerToolbarView.triggerMethod("status:indicator:available");
      });
    },

    listenToDescriptionView: function () {
      if (this.descriptionView) {
        this.listenTo(this.descriptionView, "show:more:description", function () {
          this.toggleCompletenessCheckView(false);
        });
        this.listenTo(this.descriptionView, "show:less:description", function () {
          this.toggleCompletenessCheckView(true);
        });
      }
    },

    toggleCompletenessCheckView: function (toggle) {
      if (toggle) {
        this.completenessCheckView.$el.removeClass("xecmpf-completenesscheck-hidden").addClass(
            "xecmpf-completenesscheck-shown");
      } else {
        this.completenessCheckView.$el.removeClass("xecmpf-completenesscheck-shown").addClass(
            "xecmpf-completenesscheck-hidden");
      }
    },

    hasChildView: function () {
      var isChildWidgetConfigured = (this.options.data && this.options.data.widget &&
                                     this.options.data.widget.type &&
                                     this.options.data.widget.type !== "none");
      if (this.headerwidgetConfigValue === 'activityfeed') {
        return !this.options.hideActivityFeed && isChildWidgetConfigured;
      } else if (this.headerwidgetConfigValue === 'metadata') {
        return !this.options.hideMetadata && isChildWidgetConfigured;
      }
    },

    onDomRefresh: function () {
      this.addActivityFeedClass();
      if (this.completenessCheckView) {
        this.toggleCompletenessCheckView(true);
      }

      if (!!this.descriptionView &&
          this.descriptionView.$el.find(this.descriptionView.ui.readMore).is(':hidden') &&
          this.descriptionView.$el.find(this.descriptionView.ui.showLess).is(':visible')) {
        this.descriptionView.ui.showLess.trigger("click");
        this.currentlyFocusedElement().trigger('focus');
      }

      this.isTabable() ? this.currentlyFocusedElement().attr("tabindex", "0") :
      this.currentlyFocusedElement().attr("tabindex", "-1");

      // line clamping
      this._clampTexts();

      if (!this.options.hideToolbar) {
        this.headerToolbarView.triggerMethod('dom:refresh');
      }

    },

    onBeforeDestroy: function () {
      if (this.metadataView) {
        this.metadataView.destroy();
      }
      if (this.displayUrlView) {
        this.displayUrlView.destroy();
      }
    }
  });

  return HeaderView;
});
csui.define('xecmpf/widgets/scan/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/scan/impl/nls/root/lang',{
  title: 'Scan barcode',
  defaultTextForDesktop:'This widget is only supported for mobile UI.'
});


csui.define('xecmpf/widgets/scan/scan.content.view',['csui/lib/marionette','i18n!xecmpf/widgets/scan/impl/nls/lang'],function(Marionette,Lang){
  var ContentView = Marionette.ItemView.extend({
    constructor: function ContentView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    render: function () {
      this.$el.text(Lang.defaultTextForDesktop);
      return this;
    }
  });
  return ContentView;
});
csui.define('xecmpf/widgets/scan/scan.view',['csui/lib/underscore',
      'csui/controls/tile/tile.view',
      'xecmpf/widgets/scan/scan.content.view',
      'i18n!xecmpf/widgets/scan/impl/nls/lang'],
    function (_, TileView, ScanContentView, Lang) {
      var ScanView = TileView.extend({
        constructor: function ScanView(options) {
          TileView.prototype.constructor.call(this, options);
        },
        contentView: ScanContentView,
        icon: 'title-recentlyaccessed',// TODO : change the icon
        title: Lang.title
      });
      return ScanView;
    });
 


csui.define('xecmpf/controls/savedquery.node.picker/impl/search.query.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var SearchQueryModel = Backbone.Model.extend({

    constructor: function SearchQueryModel(attributes, options) {
      SearchQueryModel.__super__.constructor.apply(this, arguments);
    },

    toJSON: function () {
      return SearchQueryModel.__super__.toJSON.apply(this, arguments);
    }

  });

  var SearchQueryModelFactory = ModelFactory.extend({

    propertyPrefix: 'xecmpfSearchQuery',

    constructor: function SearchQueryModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var searchQuery = this.options.xecmpfSearchQuery || {};
      if (!(searchQuery instanceof Backbone.Model)) {
        var config = module.config();
        searchQuery = new SearchQueryModel(searchQuery.models, _.extend({},
            searchQuery.options, config.options));
      }
      this.property = searchQuery;
    }

  });

  return SearchQueryModelFactory;
});

csui.define('xecmpf/controls/savedquery.node.picker/impl/search.results.factory',['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.results/search.results.model',
  'csui/utils/commands',
  'csui/utils/base'
], function (require, module, _, Backbone, CollectionFactory, ConnectorFactory,
    SearchResultCollection, commands, base) {

  var SearchResultCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'xecmpfSearchResults',

    constructor: function SearchResultCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchResults = this.options.xecmpfSearchResults || {};
      if (!(searchResults instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            query     = options.xecmpfSearchResults.query,
            config    = module.config();
        searchResults = new SearchResultCollection(searchResults.models, _.extend({
          connector: connector,
          query: query,
          // Ask the server to check for permitted actions V2
          commands: commands.getAllSignatures()
        }, searchResults.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = searchResults;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      this.property.fetch({
        success: _.bind(this._onSearchResultsFetched, this, options),
        error: _.bind(this._onSearchResultsFailed, this, options)
      });
    },

    _onSearchResultsFetched: function (options) {
      //nothing to-do for now upon success.
      return true;
    },

    _onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }

  });

  return SearchResultCollectionFactory;
});


/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/savedquery.node.picker/impl/savedquery.form',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"xecmpf-sq-select-container\"></div>\r\n<div class=\"xecmpf-custom-search-container\"></div>\r\n";
}});
Handlebars.registerPartial('xecmpf_controls_savedquery.node.picker_impl_savedquery.form', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/controls/savedquery.node.picker/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/controls/savedquery.node.picker/impl/nls/root/lang',{
  selectQuery: 'Select Search Query'
});



csui.define('css!xecmpf/controls/savedquery.node.picker/impl/savedquery.form',[],function(){});


csui.define('xecmpf/controls/savedquery.node.picker/impl/savedquery.form.view',['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/children2',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'xecmpf/controls/savedquery.node.picker/impl/search.query.factory',
  'csui/models/form', 'csui/controls/form/form.view',
  'csui/widgets/search.custom/search.custom.view',
  'hbs!xecmpf/controls/savedquery.node.picker/impl/savedquery.form',
  'i18n!xecmpf/controls/savedquery.node.picker/impl/nls/lang',
  'css!xecmpf/controls/savedquery.node.picker/impl/savedquery.form'
], function (module, require, _, $, Marionette, NodeModel, ConnectorFactory,
    Children2CollectionFactory, TabablesBehavior, SearchQueryModelFactory,
    FormModel, FormView, CustomSearchView,
    template, lang) {

  var config = _.extend({
    csSubTypes: {
      queryVolume: 860,
      query: 258
    }
  }, module.config());

  var SavedQueryFormView = Marionette.LayoutView.extend({

    className: 'xecmpf-savedquery-form',

    template: template,

    regions: {
      querySelectRegion: '.xecmpf-sq-select-container',
      customSearchRegion: '.xecmpf-custom-search-container'
    },

    constructor: function SavedQueryFormView(options) {
      options || (options = {});
      options.query || (options.query = options.context.getModel(SearchQueryModelFactory));

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      this.query = options.query;
    },

    setQuerySelectField: function () {
      var deferred = $.Deferred();
      this._getQueryCollection()
          .then(function (searchQueryCollection) {
            var map = {};
            searchQueryCollection.each(function (node) {
              // map key is `name` to keep the list sorted by name
              map[node.get('name')] = node.get('id');
            });

            this.query.set('query_id', map[_.keys(map)[0]] || '', {
              silent: true
            });

            var that = this;
            this.querySelectForm = new FormView({
              mode: 'create',
              model: new FormModel({
                data: {
                  searchQueryId: this.query.get('query_id')
                },
                schema: {
                  properties: {
                    searchQueryId: {
                      enum: _.values(map)
                    }
                  }
                },
                options: {
                  fields: {
                    searchQueryId: {
                      label: lang.selectQuery,
                      name: 'searchQueryId',
                      type: 'select',
                      optionLabels: _.keys(map),
                      removeDefaultNone: true,
                      onFieldChange: function () {
                        that.onChangeSavedQuerySelectField(this.getValue());
                      }
                    }
                  }
                }
              })
            });
            deferred.resolve();
          }.bind(this), deferred.reject);

      return deferred;
    },

    onChangeSavedQuerySelectField: function (queryId) {
      this.query.clear({
        silent: true
      }).set('query_id', queryId, {
        silent: true
      });

      this.setCustomSearchView()
          .then(function () {
            this.showChildView('customSearchRegion', this.customSearchView);
          }.bind(this), function (err) {
            console.error('Unable to set custom search form view.');
          });
    },

    _getQueryCollection: function () {
      var searchQueryCollection = this.options.context.getCollection(Children2CollectionFactory, {
        options: {
          // use this node model as parent node to get the children
          node: new NodeModel({
            id: config.queryVolumeId,
            type: config.csSubTypes.queryVolume
          }, {
            // node model collection needs connector
            connector: this.options.context.getObject(ConnectorFactory)
          }),
          filter: {
            type: config.csSubTypes.query // fetch only first level queries not query folders
          }
        },
        // specify id-attribute to give the collection factory in the context a unique key
        attributes: {
          id: config.queryVolumeId
        }
      });

      var deferred = $.Deferred();

      searchQueryCollection
          .ensureFetched()
          .then(function () {
            deferred.resolve(searchQueryCollection);
          }, deferred.reject);

      return deferred;
    },

    setCustomSearchView: function () {
      var deferred = $.Deferred();
      csui.require(['csui/widgets/search.custom/impl/search.object.view'], function (SearchObjectView) {
        this.customSearchView && this.customSearchView.destroy();
        var queryId = this.query.get('query_id');
        this.customSearchView = queryId ?
                                new SearchObjectView({
                                  context: this.options.context,
                                  query: this.options.query,
                                  savedSearchQueryId: queryId
                                }) : new Marionette.View();
        this.customSearchView.model && this.customSearchView.model.ensureFetched();
        deferred.resolve();
      }.bind(this), deferred.reject);
      return deferred;
    },

    onRender: function () {
      this.setQuerySelectField()
          .then(function () {
            this.showChildView('querySelectRegion', this.querySelectForm);
            this.setCustomSearchView()
                .then(function () {
                  this.showChildView('customSearchRegion', this.customSearchView);
                }.bind(this), function (err) {
                  console.error('Unable to set custom search form view.');
                });
          }.bind(this), function (err) {
            console.error('Unable to set saved queries select field.');
          });
    },

    onBeforeDestroy: function () {
      this.customSearchView && this.customSearchView.destroy();
    }

  });

  return SavedQueryFormView;
});

csui.define('css!xecmpf/controls/savedquery.node.picker/impl/savedquery.node.picker',[],function(){});
csui.define('xecmpf/controls/savedquery.node.picker/savedquery.node.picker.view',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/handlebars',
  'xecmpf/controls/savedquery.node.picker/impl/search.query.factory',
  'xecmpf/controls/savedquery.node.picker/impl/search.results.factory',
  'xecmpf/controls/savedquery.node.picker/impl/savedquery.form.view',
  'csui/widgets/search.results/search.results.view',
  'css!xecmpf/controls/savedquery.node.picker/impl/savedquery.node.picker'
], function (_, $, Backbone, Marionette, Handlebars,
  SearchQueryModelFactory, SearchResultsCollectionFactory,
  SearchFormView, SearchResultsView) {

  var SavedQueryNodePickerView = Marionette.Object.extend({

    constructor: function SavedQueryNodePickerView(options) {
      options || (options = {});
      options.query || (options.query = options.context.getModel(SearchQueryModelFactory));
      options.collection ||
      (options.collection = options.context.getCollection(SearchResultsCollectionFactory, _.extend({}, options, {
          // to get a new collection object every time
          unique: true,
          temporary: true,
          detached: true,
          internal: false
      })));
      Marionette.Object.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      this.searchFormView = new SearchFormView({
        context: options.context,
        query: options.query
      });

      this.searchResultsView = new SearchResultsView({
        context: options.context,
        query: options.query,
        collection: options.collection,
        customSearchView: this.searchFormView,
        toolbarItems: this.options.toolbarItems,
        enableBackButton: this.options.enableBackButton,
        titleView: new Marionette.ItemView({
          tagName: 'h2',
          template: Handlebars.compile('<span>{{title}}</span>')({
            title: this.options.title
          })
        })
      });

      if (!this.options.toolbarItems.inlineToolbar) {
        this.searchResultsView.resultsView.lockedForOtherContols = true;
        this.searchResultsView.resultsView.$el.addClass('xecmpf-sq-np-no-inline-toolbar');
      }

      this.listenTo(this.searchResultsView, {
        'set:picker:result': function (result) {
          this._result = result;
        },
        'close go:back': function () {
          this.triggerMethod('close');
        }
      });
    },

    onBeforeDestroy: function () {
      this.options.query.clear();
      this.searchFormView.destroy();
      this.searchResultsView.destroy();
    },

    show: function () {
      this._deferred = $.Deferred();
      var originatingView = this.options.originatingView,
        containerEl = this.options.containerEl;

      if (originatingView instanceof Backbone.View) {
        var $pickerEl = $('<div/>', {
            class: 'xecmpf-savedquery-node-picker'
          }),
          $originatingView = (_.isString(containerEl) && $(containerEl + '>*')) ||
          originatingView.$el;

        $originatingView.parent().append($pickerEl);

        this.searchResultsView.render();
        Marionette.triggerMethodOn(this.searchResultsView, 'before:show');
        $pickerEl.append(this.searchResultsView.el);

        var that = this;
        $pickerEl.show('blind', {
          direction: 'right',
          complete: function () {
            $originatingView.hide();
            originatingView.isDisplayed = false;
            // SAPRM-12354 BA widget: Upon pressing the add button, Business Attachment form the search form appears blank
            // - if Side panel is hidden, toggle it.  
            if (that.searchResultsView.ui.searchSidePanel.hasClass('csui-is-hidden')) {
              that.searchResultsView.headerView.triggerMethod('toggle:filter', that.searchResultsView);
            }
            Marionette.triggerMethodOn(that.searchResultsView, 'show');
          }
        }, 100);

        this.listenTo(this, 'close', function () {
          $originatingView.show();
          $originatingView.promise()
            .done(function () {
              originatingView.isDisplayed = true;
              $pickerEl.hide('blind', {
                direction: 'right',
                complete: function () {
                  if (that._result) {
                    that._deferred.resolve(that._result);
                  } else if (that._deferred.state() === 'pending') {
                    that._deferred.reject({
                      cancelled: true
                    });
                  }
                  that.destroy();
                  $pickerEl.remove();
                }
              }, 100);
            });
        });
        return this._deferred;
      }
      return this._deferred.reject().promise();
    }
  });

  return SavedQueryNodePickerView;
});

/* START_TEMPLATE */
csui.define('hbs!xecmpf/controls/search.textbox/impl/search.textbox',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"xecmpf-search-bar\" role=\"dialog\">\r\n  <div class=\"xecmpf-search-bar-content\">  \r\n      <span class=\"xecmpf-search-icon-static\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchTooltip || (depth0 != null ? depth0.searchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchTooltip","hash":{}}) : helper)))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.searchTooltip || (depth0 != null ? depth0.searchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchTooltip","hash":{}}) : helper)))
    + "\"></span>  \r\n    <div class=\"xecmpf-search-input-container\">\r\n      <input type=\"text\" class=\"xecmpf-input\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.searchFromHere || (depth0 != null ? depth0.searchFromHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchFromHere","hash":{}}) : helper)))
    + "\"\r\n             title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchFromHere || (depth0 != null ? depth0.searchFromHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchFromHere","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.searchFromHere || (depth0 != null ? depth0.searchFromHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchFromHere","hash":{}}) : helper)))
    + "\">\r\n    </div>\r\n    <a href=\"#\" class=\"xecmpf-clearer formfield_clear\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.clearTextTooltip || (depth0 != null ? depth0.clearTextTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearTextTooltip","hash":{}}) : helper)))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearTextTooltip || (depth0 != null ? depth0.clearTextTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearTextTooltip","hash":{}}) : helper)))
    + "\"></a>\r\n  </div>\r\n</div>\r\n<div role=\"button\" class=\"xempf-search-close\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeSearchTooltip || (depth0 != null ? depth0.closeSearchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeSearchTooltip","hash":{}}) : helper)))
    + "\">\r\n  <a href=\"javascript:void(0);\" class=\"icon xecmpf-icon-close xempf-search-hide csui-acc-focusable\"\r\n    title=\""
    + this.escapeExpression(((helper = (helper = helpers.closeSearchTooltip || (depth0 != null ? depth0.closeSearchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeSearchTooltip","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.closeSearchTooltip || (depth0 != null ? depth0.closeSearchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"closeSearchTooltip","hash":{}}) : helper)))
    + "\" aria-expanded=\"false\"></a>\r\n</div>";
}});
Handlebars.registerPartial('xecmpf_controls_search.textbox_impl_search.textbox', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('xecmpf/controls/search.textbox/impl/nls/lang',{
    // Always load the root bundle for the default locale (en-us)
    "root": true,
    // Do not load English locale bundle provided by the root bundle
    "en-us": false,
    "en": false
  });
csui.define('xecmpf/controls/search.textbox/impl/nls/root/lang',{
    searchFromHere: 'Search from here',
    closeSearchTooltip: 'Clear all text and hide search',
    clearTextTooltip: 'Clear all text in this field',
    search: 'search'
});
  


csui.define('css!xecmpf/controls/search.textbox/impl/search.textbox',[],function(){});
csui.define('xecmpf/controls/search.textbox/search.textbox.view',[
    'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
    'csui/utils/contexts/factories/search.query.factory',
    'hbs!xecmpf/controls/search.textbox/impl/search.textbox',
    'i18n!xecmpf/controls/search.textbox/impl/nls/lang',
    'i18n', 'css!xecmpf/controls/search.textbox/impl/search.textbox'
],function(module, _, $, Marionette, SearchQueryModelFactory, 
    template, lang, i18n) {
    "use strict";
    
    var config = _.defaults({}, module.config(), {
        inputValue: '',
        nodeId: '',
        nodeName: ''
    });

    var SearchTextBoxView = Marionette.ItemView.extend({
        className: 'xecmpf-search-text-box',
        template: template,
        
        ui: {
            input: '.xecmpf-input',
            clearer: '.xecmpf-clearer',
            closeSearchBtn: '.xempf-search-hide'
        },

        events: {
			'keyup @ui.input': 'inputTyped',
			'keydown @ui.input': 'inputTyped',
            'paste @ui.input': 'inputChanged',
            'change @ui.input': 'inputChanged',
            'click @ui.clearer': 'clearerClicked',
            'keydown @ui.clearer': 'keyDownOnClear',
            'click @ui.closeSearchBtn': 'closeSearchButtonClicked',
            'keydown @ui.closeSearchBtn': 'KeyDownOnCloseSearchBtn'
        },

        templateHelpers: function () {
            return {
                searchFromHere : lang.searchFromHere,
                clearTextTooltip: lang.clearTextTooltip,
                closeSearchTooltip: lang.closeSearchTooltip,
                searchTooltip: lang.search
            }
        },

        constructor: function SearchTextBoxView(options) {
            options || (options = {});
            options.data = _.defaults({}, options.data, config);
            this.direction = i18n.settings.rtl ? 'left' : 'right';

            var context = options.context;
            if (!options.model) {
                options.model = context.getModel(SearchQueryModelFactory);
            }
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        onRender: function() {
            var value = this.options.data.inputValue || this.model.get('where');
            if (value) {
                this._setInputValue(value);
            }
        },

        inputTyped: function(event) {
            var value = this.ui.input.val().trim();
            if (event.which === 32) {
                event.stopPropagation();
            } else if (event.which === 13) {
                event.preventDefault();
                event.stopPropagation();
                this._setInputValue(value);
                if (!!value) {
                this.searchIconClicked(event);
                }
                if (this.previousValue !== value) {
                this.previousValue = value;
                }
            } else {
                this.inputChanged(event);
            }
		},
		
        inputChanged: function(event) {
            var value = this.ui.input.val();
            this.ui.clearer.toggle(!!value.length);
        },

        clearerClicked: function(event) {
            event.preventDefault();
            event.stopPropagation();

            this._setInputValue('');
            this.ui.input.trigger("focus");
        },

        keyDownOnClear: function (event) {
            if (event.keyCode === 13) {
                this.clearerClicked(event);
            }
        },

        searchIconClicked: function(event) {
            var value = this.ui.input.val().trim();
            if (!!value) {
                this._setInputValue(value);
                var searchOption = this.options.data.nodeId;

                if (!!value) {
                this._setSearchQuery(value, this.options.sliceString, searchOption, event);
                this._updateInput();
                this.options.data.searchFromHere = true;
                }

                this._triggerSearchResults();
            }    
        },

        _updateInput: function() {
            if (this._isRendered) {
                var value = this.model.get('where') || '';
                this._setInputValue(value);
              }
        },

        _setSearchQuery: function(value, sliceString, searchOption, event) {
            this.model.clear({silent: true});
            var params = {};
            if (!!sliceString) {
                params['slice'] = sliceString;
            }
            if (!!searchOption) {
                params['location_id1'] = searchOption;
            }
            if (value) {
                params['where'] = value;
            }
            this.model.set(params);
        },

        _setInputValue: function(value) {
            this.ui.input.val(value);
            this.ui.clearer.toggle(!!value.length);
        },

        closeSearchButtonClicked: function (event) {
            this.trigger("hide:searchbar");
        },

        KeyDownOnCloseSearchBtn: function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
		        event.stopPropagation();
                this.trigger("hide:searchbar");
            }
        },

        _triggerSearchResults: function() {
            this.trigger("search:results");
        }

    });

    return SearchTextBoxView;

});
csui.define('xecmpf/controls/property.panels/reference/reference.panel.controller',['require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/utils/log'
], function (require, _, $, Backbone, Marionette, Url, log
) {
  'use strict';

  function getReferencePanel(controller,mode,marker,attributes) {
    var deferred = $.Deferred();

    csui.require([
      'xecmpf/controls/bosearch/bosearch.model',
      'xecmpf/controls/bosearch/bosearch.dialog.controller',
      'xecmpf/controls/property.panels/reference/impl/workspace.reference.model',
      'xecmpf/controls/property.panels/reference/impl/reference.panel.model',
      'xecmpf/controls/property.panels/reference/impl/reference.panel.view'
    ], function (
        BoSearchModel,
        BoSearchDialogController,
        WorkspaceReferenceModel,
        ReferencePanelModel,
        ReferencePanelView
    ) {
      // we want to reuse the action context from a previous panel
      // so we attach it as listener to the context and request it when we need it again
      var eventobject = {};
      controller.options.context.trigger("request:actioncontext",eventobject);
      var actionContext = _.extend(eventobject.actionContext||{},{mode: mode});
      controller.options.context.once("request:actioncontext",function(eventobject) {
        eventobject.actionContext = actionContext;
      });

      // determine bo_type_id and bo_id, then display reference section
      if (!actionContext.workspaceReference) {
        actionContext.workspaceReference = new WorkspaceReferenceModel(attributes, {
          node: controller.options.model
        });
      } else {
        actionContext.workspaceReference.node = controller.options.model;
        actionContext.workspaceReference.set(attributes);
      }

      var bo_ref = actionContext.workspaceReference,
          fetch = bo_ref.get("id") ? bo_ref.fetch() : $.Deferred().resolve().promise();
      fetch.then(function(){
        if (marker) {
          // add css class, so we can set styles depending on whether reference tab exists or not.
          if(bo_ref.get("bo_type_id") != null) {
            marker.addClass("conws-reference-showing")
          } else {
            marker.removeClass("conws-reference-showing")
          }
        }

        if(bo_ref.get("bo_type_id") != null) {
          deferred.resolve([
            {
              model: new ReferencePanelModel(),
              contentView: ReferencePanelView,
              contentViewOptions: {
                actionContext: actionContext
              }
            }
          ]);
        } else {
          // there is no reference panel to display.
          deferred.resolve([]);
        }
      },function(error){
        deferred.reject(error);
      });
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise();
  }

  var ReferencePanelController = Marionette.Controller.extend({

    constructor: function ReferencePanelController(options) {
      Marionette.Controller.prototype.constructor.apply(this, arguments);
    },

    getPropertyPanels: function (options) {
      // var node = this.options.model,
      //     connector = node.connector,
      //     nodeV1Url = Url.combine(connector.connection.url, 'nodes', node.get('id')),
      //     volumeV1Url = Url.combine(connector.connection.url, 'volumes/198');

      var isWorkspace;

       // first determine, whether a workspace is to be displayed
      isWorkspace = this.options && this.options.model && this.options.model.get("type")===848 &&
          // suppress reference panel for early workspaces => bus. obj. is set automatically
          !this.options.context.options.suppressReferencePanel;
		  

      // if a workspace is about to be displayed and general data is available
      if (isWorkspace) {

        log.debug("getPropertyPanels for connected workspace called") && console.log(log.last);
        var mode = "workspace_reference_edit",
            marker = $(".cs-perspective-panel .cs-properties-wrapper .metadata-content .cs-metadata"),
            boattributes = {
              id: this.options.model.get("id"),
              bo_id: undefined,
              bo_type_id: undefined,
              bo_type_name: undefined,
              ext_system_id: undefined,
              ext_system_name: undefined
        };

        return getReferencePanel(this,mode,marker,boattributes);
      }

      return null;
    },

    getPropertyPanelsForCreate: function (options) {

      var generalData, isWorkspace;

      // helper method to remove the add classifications button
      function disableClassificationsAdd(propertiesView,controller) {
        if (propertiesView) {
          controller.listenTo(propertiesView, 'before:render', function () {
            if (propertiesView.addPropertiesView) {
              if (!propertiesView.addPropertiesViewIsXecmRecreated) {
                propertiesView._createAddPropertiesView();
                propertiesView.addPropertiesViewIsXecmRecreated = true;
              }
            }
            if (propertiesView.addPropertiesView && propertiesView.addPropertiesView.collection) {
              if (!propertiesView.addPropertiesView.collection.hasXecmFilterModelsFunction) {
                var filtermodels = propertiesView.addPropertiesView.collection.filterModels;
                propertiesView.addPropertiesView.collection.filterModels = function(models) {
                  // replace the collection in the view with one that always filters classifications
                  // signatures "AddCategory", "AddRMClassification", "AddPropertiesClassifications"
                  arguments[0] = _.filter(models,function(cm){
                    var sig = cm.get("signature");
                    return sig==="AddRMClassification" || sig==="AddCategory";
                  });
                  return filtermodels.apply(this,arguments);
                };
                propertiesView.addPropertiesView.collection.hasXecmFilterModelsFunction = true;
                propertiesView.addPropertiesView.collection.refilter();
              }
            }
          });
          controller.listenTo(propertiesView, 'render', function () {
            if (propertiesView.addPropertiesViewIsXecmRecreated) {
              delete propertiesView.addPropertiesViewIsXecmRecreated;
            }
          });
        }
      }

      // first determine, whether a workspace is to be created
      if (options && options.forms && options.forms.models) {
        _.each(options.forms.models, function (form) {
          if (form.get('id') === 'general') {
            generalData = form.get('data');
            isWorkspace = generalData ? generalData.type===848 : false;
          }
        }, this);
      }
	  isWorkspace = isWorkspace &&
        // suppress reference panel for early workspaces => bus. obj. is set automatically
        !this.options.context.options.suppressReferencePanel;
		
      // if a workspace is about to be created
      if (isWorkspace) {

        log.debug("getPropertyPanelsForCreate for connected workspace called") && console.log(log.last);

        // check, if general data is available and then display reference section
        if (generalData) {

          var mode = "workspace_reference_create",
              forms = options && options.forms,
              formCollection = forms && forms.formCollection,
              bo_id = formCollection && formCollection.bo_id,
              formOptions = formCollection && formCollection.options,
              addItemController = formOptions && formOptions.metadataAddItemController,
              dialog = addItemController && addItemController.dialog,
              marker = dialog && dialog.$(".binf-modal-content .binf-modal-body .cs-add-item-metadata-form"),
              boattributes = {
                id: undefined,
                bo_id:bo_id,
                bo_type_id: generalData.bo_type_id,
                bo_type_name: generalData.bo_type_name,
                ext_system_id: generalData.ext_system_id,
                ext_system_name: generalData.ext_system_name,
                change_reference:true,
                complete_reference:true
              },
              metadataView = addItemController && addItemController.metadataAddItemPropView,
              propertiesView = metadataView && metadataView.metadataPropertiesView;

          // in create mode, we disallow adding classifications, so we workaround CWS-2188
          if (propertiesView) {
            disableClassificationsAdd(propertiesView,this);
          }

          return getReferencePanel(this,mode,marker,boattributes);

        }
      }

      return null;
    }
  });

  return ReferencePanelController;
});

csui.define('xecmpf/controls/property.panels/reference/reference.panel',[
  'xecmpf/controls/property.panels/reference/reference.panel.controller'
], function (ReferencePanelController) {

  return [{
      sequence  : 10,
      controller: ReferencePanelController
  }];

});

csui.define('xecmpf/dialogs/node.picker/start.locations/businessobjecttypes.container/businessobjecttypes.container.factory',['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/node.base.factory'
], function (_, $, NodeBaseFactory) {
  "use strict";
  var BusinessObjectTypesContainerFactory = NodeBaseFactory.extend({
    constructor: function BusinessWorkspaceVolumeFactory(options) {
      options = _.defaults({
        node: {
          type: 888
        }
      }, options);
      NodeBaseFactory.prototype.constructor.call(this, options);
    },
    updateLocationModel: function (model) {
      model.set({
        invalid: true
      });
      return $.Deferred().resolve().promise();
    }
  });
  return BusinessObjectTypesContainerFactory;
});



csui.define('xecmpf/dialogs/node.picker/start.locations/extended.ecm.volume.container/extended.ecm.volume.container.factory',['csui/lib/underscore',
  'csui/dialogs/node.picker/start.locations/node.base.factory',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang'
], function (_, NodeBaseFactory, lang) {
  "use strict";

  var ExtendedECMVolumeFactory = NodeBaseFactory.extend({

    constructor: function ExtendedECMVolumeFactory(options) {
      options = _.defaults({
        node: {
          id: 'volume',
          type: 882
        },
        unselectable : true,
        defaultName: lang.labelExtendedECMVolume
      }, options);
      NodeBaseFactory.prototype.constructor.call(this, options);
    }
  });

  return ExtendedECMVolumeFactory;

});


csui.define('json!xecmpf/widgets/workspaces/workspaces.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "Workspaces Creation and Completion Widget",
  "description": "User gets a list of early workspaces so he can select one workspace to complete the reference. If the user does not find an appropriate early workspace he can create a new workspace.",
  "schema": {
    "type": "object",
    "properties": {
      "busObjectId": {
        "type": "string",
        "title": "Business object id",
        "description": "ID of a business object"
      },
      "busObjectType": {
        "type": "string",
        "title": "Business object type",
        "description": "Type of a business object"
      },
      "extSystemId": {
        "type": "string",
        "title": "External system id",
        "description": "ID of an external system"
      }
    }
  }
}
);


csui.define('json!xecmpf/widgets/boattachments/boattachments.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "Business Attachments",
  "description": "Shows business attachments for a business object",
  "schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "object",
        "title": "Title",
        "description": "Title of the business attachments widget"
      },
      "businessattachment": {
        "type": "object",
        "title": "Business attachment",
        "description": "Business attachment specific options",
        "properties": {
          "properties": {
            "type": "object",
            "title": "Properties",
            "description": "Configuration properties",
            "properties": {
              "busObjectId": {
                "type": "string",
                "title": "Business object id",
                "default": "",
                "description": "ID of the business object whose business attachments are displayed"
              },
              "busObjectType": {
                "type": "string",
                "title": "Business object type",
                "default": "",
                "description": "Type of the business object"
              },
              "extSystemId": {
                "type": "string",
                "title": "Business application ID",
                "default": "",
                "description": "Business application of the business object"
              }
            }
          }
        }
      },
      "collapsedView": {
        "type": "object",
        "title": "Collapsed view",
        "description": "Options for the collapsed view of this widget",
        "properties": {
          "noResultsPlaceholder": {
            "type": "object",
            "title": "Message for empty result",
            "description": "Message if there are no business attachments to display"
          },
          "orderBy": {
            "type": "object",
            "title": "Order by",
            "description": "Sort order of the displayed business attachments",
            "properties": {
              "sortColumn": {
                "type": "string",
                "title": "Column",
                "description": "Column to order by"
              },
              "sortOrder": {
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ],
                "title": "Sort order",
                "description": "Sort order to be used"
              }
            }
          },
          "title": {
            "type": "object",
            "title": "Business attachment title",
            "description": "Title of the business attachment in collapsed view",
            "properties": {
              "value": {
                "type": "string",
                "title": "Title",
                "description": "Value for the Title field"
              }
            }
          },
          "description": {
            "type": "object",
            "title": "Business attachment description",
            "description": "Description of the business attachment in collapsed view",
            "properties": {
              "value": {
                "type": "string",
                "title": "Description",
                "description": "Value for the description field"
              }
            }
          },
          "topRight": {
            "type": "object",
            "title": "Top right metadata field",
            "description": "Metadata displayed in top right metadata field in collapsed view",
            "properties": {
              "label": {
                "type": "object",
                "title": "Label",
                "description": "Label for the metadata field"
              },
              "value": {
                "type": "string",
                "title": "Value",
                "description": "Value for the top right metadata field"
              }
            }
          },
          "bottomLeft": {
            "type": "object",
            "title": "Bottom left  metadata field",
            "description": "Metadata displayed in bottom left metadata field in collapsed view",
            "properties": {
              "label": {
                "type": "object",
                "title": "Label",
                "description": "Label for the metadata field"
              },
              "value": {
                "type": "string",
                "title": "Value",
                "description": "Value for the bottom left metadata field"
              }
            }
          },
          "bottomRight": {
            "type": "object",
            "title": "Bottom right metadata field",
            "description": "Metadata displayed in bottom right metadata field in collapsed view",
            "properties": {
              "label": {
                "type": "object",
                "title": "Label",
                "description": "Label for the metadata field"
              },
              "value": {
                "type": "string",
                "title": "Value",
                "description": "Value for the bottom right metadata  metadata field"
              }
            }
          }
        }
      },
      "expandedView": {
        "type": "object",
        "title": "Expanded view",
        "description": "Options for the expanded view of this widget",
        "properties": {
          "orderBy": {
            "type": "object",
            "title": "Order by",
            "description": "Sort order of the displayed business attachments",
            "properties": {
              "sortColumn": {
                "type": "string",
                "title": "Column",
                "description": "Column to order by"
              },
              "sortOrder": {
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ],
                "title": "Sort order",
                "description": "Sort order to be used"
              }
            }
          }
        }
      },
      "snapshot": {
        "type": "object",
        "title": "Snapshot",
        "description": "Options for the snapshots of Business Attachments",
        "properties": {
          "parentFolderName": {
            "type": "string",
            "title": "Parent folder name",
            "description": "Folder in business workspace, where Snapshots are created."
          },
          "folderNamePrefix": {
            "type": "string",
            "title": "Snapshot name prefix",
            "description": "The name of a snapshot consists of the prefix and a timestamp."
          }
        }
      }
    }
  },
  "options": {
    "fields": {
      "businessattachment": {
        "fields": {
          "properties": {
            "fields": {
              "busObjectId": {
                "type": "otconws_metadata_string"
              },
              "busObjectType": {
                "type": "otconws_metadata_string"
              },
              "extSystemId": {
                "type": "otconws_metadata_string"
              }
            }
          }
        }
      },
      "title": {
        "type": "otcs_multilingual_string"
      },
      "collapsedView": {
        "fields": {
          "noResultsPlaceholder": {
            "type": "otcs_multilingual_string"
          },
          "orderBy": {
            "fields": {
              "sortColumn": {
                "type": "otconws_customcolumn"
              },
              "sortOrder": {
                "type": "select",
                "optionLabels": [
                  "Ascending",
                  "Descending"
                ]
              }
            }
          },
          "title": {
            "fields": {
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "description": {
            "fields": {
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "topRight": {
            "fields": {
              "label": {
                "type": "otcs_multilingual_string"
              },
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "bottomLeft": {
            "fields": {
              "label": {
                "type": "otcs_multilingual_string"
              },
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          },
          "bottomRight": {
            "fields": {
              "label": {
                "type": "otcs_multilingual_string"
              },
              "value": {
                "type": "otconws_customcolumn"
              }
            }
          }
        }
      },
      "expandedView": {
        "fields": {
          "orderBy": {
            "fields": {
              "sortColumn": {
                "type": "otconws_customcolumn"
              },
              "sortOrder": {
                "type": "select",
                "optionLabels": [
                  "Ascending",
                  "Descending"
                ]
              }
            }
          }
        }
      },
      "snapshot": {
        "fields": {
          "parentFolderName": {
            "type": "text"
          },
          "folderNamePrefix": {
            "type": "text"
          }
        }
      }
    }
  }
}
);


csui.define('json!xecmpf/widgets/dossier/dossier.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "Dossier",
  "description": "Dossier View for business workspaces grouped by some criterion say create date ,classification",
  "schema": {
    "type": "object",
    "properties": {
      "groupBy": {
        "type": "string",
        "enum": [
          "classification",
          "create_date"
        ],
        "default": "create_date",
        "title": "Default group by criterion",
        "description": "Group by criterion that dossier view will use to load for the first time"
      },
      "hideGroupByCriterionDropdown": {
        "type": "boolean",
        "enum": [
          true,
          false
        ],
        "default": false,
        "title": "Hide group by criterion dropdown",
        "description": "Option to hide the dropdown to choose the group by criterion"
      },
      "hideMetadata": {
        "type": "boolean",
        "enum": [
          true,
          false
        ],
        "default": false,
        "title": "Hide metadata",
        "description": "Option to hide the document's metadata view"
      },
      "metadata": {
        "type": "array",
        "title": "Metadata",
        "description": "Metadata displayed for document",
        "items": {
          "type": "object",
          "title": "Category or attribute",
          "description": "Category or attribute with metadata"
        }
      },
      "hideEmptyFields": {
        "type": "boolean",
        "enum": [
          true,
          false
        ],
        "default": false,
        "title": "Hide empty fields",
        "description": "Display only fields with values"
      },
      "hideFavorite": {
        "type": "boolean",
        "enum": [
          true,
          false
        ],
        "default": false,
        "title": "Hide favorite",
        "description": "Option to hide the favorite icon"
      }
    }
  },
  "options": {
    "fields": {
      "groupBy": {
        "type": "select",
        "optionLabels": [
          "Classification",
          "Create Date"
        ]
      },
      "metadata": {
        "fields": {
          "item": {
            "type": "otconws_metadata"
          }
        }
      }
    }
  }
}
);


csui.define('json!xecmpf/widgets/header/header.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "Header",
  "description": "Header widget for business workspaces",
  "schema": {
    "type": "object",
    "properties": {
      "workspace": {
        "type": "object",
        "title": "Workspace",
        "description": "Workspace specific options",
        "properties": {
          "properties": {
            "type": "object",
            "title": "Properties",
            "description": "Configuration properties",
            "properties": {
              "title": {
                "type": "string",
                "title": "Title",
                "default": "{name}",
                "description": "Name of the business workspace"
              },
              "type": {
                "type": "string",
                "title": "Type",
                "default": "{business_properties.workspace_type_name}",
                "description": "Name of the workspace type"
              },
              "description": {
                "type": "string",
                "title": "Description",
                "default": "{description}",
                "description": "Description of the business workspace"
              }
            }
          }
        }
      },
      "completenessCheckSettings": {
        "type": "object",
        "title": "Completeness check",
        "description": "Completeness check configuration",
        "properties": {
          "hideMissingDocsCheck": {
            "title": "Hide missing documents check",
            "description": "Option to show or hide the missing document check",
            "type": "boolean",
            "default": false
          },
          "hideOutdatedDocsCheck": {
            "title": "Hide outdated documents check",
            "description": "Option to show or hide the outdated document check. This option will be effective only if the Extended ECM for SAP SuccessFactors module is installed on the system",
            "type": "boolean",
            "default": false
          },
          "hideInProcessDocsCheck": {
            "title": "Hide In process documents check",
            "description": "Option to show or hide the In process document check. This option will be effective only if the Extended ECM for SAP SuccessFactors module is installed on the system",
            "type": "boolean",
            "default": false
          }
        }
      },
      "headerwidget": {
        "type": "object",
        "title": "Widget",
        "description": "Additional widget that can be embedded in the header widget",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "none",
              "activityfeed",
              "metadata"
            ],
            "default": "none",
            "title": "Embed widget",
            "description": "Widget to be embedded in the header widget"
          }
        }
      },
      "metadataSettings": {
        "type": "object",
        "title": "Metadata",
        "description": "Header metadata configuration",
        "properties": {  
          "metadataInColumns":{          
            "type": "string",			
            "enum": [
              "singleCol",
              "doubleCol"
            ],
            "default": "doubleCol",
            "title": "Show Metadata In Columns",
            "description": "Show Metadata In Columns"
        },      
          "hideMetadata": {
            "type": "boolean",
            "enum": [
              true,
              false
            ],
            "default": false,
            "title": "Hide Metadata",
            "description": "Hide metadata on header"
          },
          "hideEmptyFields": {
            "type": "boolean",
            "enum": [
              true,
              false
            ],
            "default": false,
            "title": "Hide empty fields",
            "description": "Display only fields with values"
          },
          "metadata": {
            "type": "array",
            "title": "Metadata",
            "description": "Metadata displayed in Header widget",
            "items": {
              "type": "object",
              "title": "Category or attribute",
              "description": "Category or attribute with metadata"
            }
          }
        }
      },
      "favoriteSettings": {
        "type": "object",
        "title": "Favorite",
        "description": "Favorite configuration",
        "properties": {
          "hideFavorite": {
            "type": "boolean",
            "enum": [
              true,
              false
            ],
            "default": false,
            "title": "Hide Favorite",
            "description": "Option to hide the favorite icon on the header"
          }
        }
      }
    }
  },
  "options": {
    "fields": {
      "workspace": {
        "fields": {
          "properties": {
            "fields": {
              "title": {
                "type": "otconws_metadata_string"
              },
              "type": {
                "type": "otconws_metadata_string"
              },
              "description": {
                "type": "otconws_metadata_string"
              }
            }
          }
        }
      },
      "metadataSettings": {
        "fields": {
            "metadata": {
              "fields": {                        
                "item": {
                  "type": "otconws_metadata"          
                }
              }
            },
          "metadataInColumns": {
            "type": "select",            
            "optionLabels": [
              "Single",
              "Double"
            ]
          }
        }
      },
      
      "headerwidget": {
        "fields": {
          "type": {
            "type": "select",
            "optionLabels": [
              "None",
              "Activity Feed",
              "Metadata"
            ]
          }
        }
      }
    }
  }
}
);


csui.define('json!xecmpf/widgets/scan/scan.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "schema": {
    "type": "object",
    "properties": {
      "businessobjecttypes": {
        "title": "{{botypesTitle}}",
        "description": "{{botypesDescription}}",
        "type": "array",
        "items":{
          "type":"object",
          "properties": {
            "id":{
              "type":"integer",
			  "description": "{{botypeBrowseDescription}}",
              "title":"{{botypeBrowseTitle}}"
            }
          }
        }
      }
    }
  },
  "options": {
    "fields": {
      "businessobjecttypes": {
        "items":{
          "fields":{
            "id":{
              "type": "otcs_node_picker",
              "type_control": {
                "parameters": {
                  "select_types": [889],
                  "startLocation":"xecmpf/dialogs/node.picker/start.locations/businessobjecttypes.container"
                }
              }
            }

          }
        }
      }
    }
  }
}
);


csui.define('json!xecmpf/utils/perspective/custom.search.json',{
  "type": "grid",
  "options": {
    "rows": [
      {
        "columns": [
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "full"
            },
            "widget": {
              "type": "xecmpf/widgets/integration/folderbrowse/search.results",
              "options": {
                "enableBackButton": true
              }
            }
          }
        ]
      }
    ]
  }
}
);

csui.define('xecmpf/widgets/scan/impl/nls/scan.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/scan/impl/nls/root/scan.manifest',{
  widgetTitle:"Scan barcode",
  widgetDescription:"Scans the barcode and opens the corresponding workspace",
  botypesTitle: 'Business Object Types',
  botypesDescription:"List of business object types which are relavant for the scan",
  botypeBrowseTitle:"Business Object Type",
  botypeBrowseDescription:"Select the business object type which is relavant for the scan"
});

csui.define('xecmpf/utils/perspective/custom.search.perspective',['csui/lib/backbone'], function (Backbone) {
  return [
    {
      decides: function () {
        return Backbone.history.root && !!Backbone.history.root.match("xecm");
      },
      module: 'json!xecmpf/utils/perspective/custom.search.json'
    }
  ];
});

csui.define('xecmpf/utils/perspective/eventactionnode.perspective',[],function () {
    'use strict';
    return [
      {
        equals: {type: [898]},
        important: true,
        module: 'json!xecmpf/utils/perspective/impl/perspectives/eventaction.json'
      }
    ];
  
  });

csui.define('json!xecmpf/utils/perspective/impl/perspectives/eventaction.json',{
  "type": "left-center-right",
  "options": {
    "center": {
      "kind": "fullpage",
      "options":{
      },
      "type": "xecmpf/widgets/eac"
    },
    "left":{},
    "right":{}
  }
}
  );

// Placeholder for the build target file; the name must be the same,
// include public modules from this component

csui.define('bundles/xecmpf-app',[
  //Pages
  'xecmpf/pages/start/perspective-only.page.view',

  //Search box widget extension
  'xecmpf/widgets/integration/folderbrowse/search.box.view',

  //Page as dialog
  'xecmpf/widgets/integration/folderbrowse/full.page.workspace.view',

  //Custom Search Results
  'xecmpf/widgets/integration/folderbrowse/search.results/search.results.view',

  // Custom modal dialog for Full page wokrspace
  'xecmpf/widgets/integration/folderbrowse/modaldialog/modal.dialog.view',

  // Commands
  'xecmpf/utils/commands/folderbrowse/go.to.workspace.history',
  'xecmpf/utils/commands/folderbrowse/search.container',
  'xecmpf/utils/commands/folderbrowse/open.full.page.workspace',
  'xecmpf/utils/commands/workspaces/workspace.delete',
  'xecmpf/utils/commands/boattachments/boattachments.create',
  'xecmpf/utils/commands/eac/eac.refresh',
  'xecmpf/utils/commands/eac/eac.back',
  'xecmpf/widgets/boattachments/impl/boattachment.table/commands/snapshot',

  // Behaviors
  'xecmpf/behaviors/toggle.header/toggle.header.behavior',

  // Toolbar buttons
  'xecmpf/widgets/integration/folderbrowse/toolbaritems',

  // Cell views
  'xecmpf/widgets/boattachments/impl/boattachment.table/tablecell/createdby.view',
  'xecmpf/widgets/boattachments/impl/boattachment.table/tablecell/modifiedby.view',
  'xecmpf/controls/table/cells/eac.actionplan.view',

  // Inline forms

  // Integration widgets

  // workspace reference
  'xecmpf/controls/bosearch/bosearch.dialog.controller',
  'xecmpf/controls/property.panels/reference/impl/reference.panel.view',

  // Public widgets
  'xecmpf/widgets/boattachments/boattachments.view',

  // Application widgets
  'xecmpf/widgets/workspaces/workspaces.widget',

  // Metadata widget extensions
  // Metadata panel collection
  'xecmpf/widgets/myattachments/metadata.property.panels',

  // Widgets
  'xecmpf/widgets/dossier/dossier.view',
  'xecmpf/widgets/eac/eac.view',
  'xecmpf/widgets/header/header.view',
  'xecmpf/widgets/scan/scan.view',

  // Public Views
  'xecmpf/utils/document.thumbnail/document.thumbnail.view',
  'xecmpf/controls/savedquery.node.picker/savedquery.node.picker.view',
  'xecmpf/controls/savedquery.node.picker/impl/savedquery.form.view',
  'xecmpf/controls/search.textbox/search.textbox.view',
  
  // Public Controls
  'xecmpf/controls/property.panels/reference/reference.panel',
  'xecmpf/dialogs/node.picker/start.locations/businessobjecttypes.container/businessobjecttypes.container.factory',
  'xecmpf/dialogs/node.picker/start.locations/extended.ecm.volume.container/extended.ecm.volume.container.factory',

  // Application widgets manifests
  'json!xecmpf/widgets/workspaces/workspaces.manifest.json',
  'json!xecmpf/widgets/boattachments/boattachments.manifest.json',
  'json!xecmpf/widgets/dossier/dossier.manifest.json',
  'json!xecmpf/widgets/header/header.manifest.json',
  'json!xecmpf/widgets/scan/scan.manifest.json',
  'json!xecmpf/utils/perspective/custom.search.json',

  // Application widgets nls language files
  'i18n!xecmpf/widgets/scan/impl/nls/scan.manifest',
  'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang',

  // Perspective overrides
  'xecmpf/utils/perspective/custom.search.perspective',

  //Utils
  'xecmpf/widgets/boattachments/impl/boattachmentutil',

  //eventaction Content
  'xecmpf/utils/perspective/eventactionnode.perspective',

  //eventaction perspective
  'json!xecmpf/utils/perspective/impl/perspectives/eventaction.json'

], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'xecmpf/bundles/xecmpf-app', true);
});

