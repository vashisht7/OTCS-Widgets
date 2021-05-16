define([
  "csui/pages/start/perspective.router",
  "csui/utils/contexts/factories/application.scope.factory",
], function (PerspectiveRouter, ApplicationScopeModelFactory) {
  var LPPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      lp: "openLP",
    },

    constructor: function LPPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(
        ApplicationScopeModelFactory
      );
      this.listenTo(this.applicationScope, "change", this._updateUrl);
    },
    openLP: function () {
      this.applicationScope.set("id", "lp");
    },
    // onOtherRoute: function () {
    //   this.applicationScope.clear({silent: true});
    // },
    _updateUrl: function () {
      if (this.applicationScope.id !== 'lp') {
        return;
      }
      this.navigate("lp");
    },
  });
  return LPPerspectiveRouter;
});
