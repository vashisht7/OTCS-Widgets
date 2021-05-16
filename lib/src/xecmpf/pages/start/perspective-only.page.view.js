/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

  define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
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
      var context = new PerspectiveContext(),
        connector = context.getObject(ConnectorFactory);
      context.options = context.options || {};
      context.options.suppressReferencePanel = true;
      if (!connector.connection.credentials &&
        !connector.authenticator.isAuthenticated() &&
        !connector.authenticator.syncStorage().isAuthenticated()) {
        this._navigateToSignIn();
        return;
      }

      this.perspectivePanel = new PerspectivePanelView({
        context: context
      });
      this.propagateEventsToViews(this.perspectivePanel);
      var routing = PerspectiveRouting.getInstance({
        context: context
      });
      var historyOptions;
      if (PerspectiveRouting.routesWithSlashes()) {
        historyOptions = {
          pushState: true,
          root: Url.combine(
            new Url(new Url(location.pathname).getCgiScript()).getPath(),
            '/xecm')
        };
      } else {
        historyOptions = {
          root: location.pathname
        };
      }
      Backbone.history.start(historyOptions);
      if (base.isAppleMobile()) {
        this.$el.addClass('csui-on-ipad');
      }
      FastClick.attach(this.el);
      $(window).on("unload",function () { });

      this.perspectivePanel.on("show:perspective swap:perspective", function () {
        var parent = window.opener ? window.opener :
                     window !== window.parent ? window.parent : undefined;
        if (parent) {
          if (this.$el.find(".conws-header-wrapper").length === 0) {
            parent.postMessage({"status": "showDialogHeader"}, "*");
          } else {
            parent.postMessage({"status": "hideDialogHeader"}, "*");
          }
        }
      });

      $(document).on("keyup", function (e) {
        if (e.keyCode === 27) {
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
        PageLeavingBlocker.forceDisable();
        location.reload();
      }
      this._redirecting = true;
    }

  });

  _.extend(PerspectiveOnlyPageView.prototype, ViewEventsPropagationMixin);

  return PerspectiveOnlyPageView;

});
