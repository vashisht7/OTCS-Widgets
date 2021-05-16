/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/base',
  'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/user', 'i18n!csui/pages/start/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang'
], function (_, base, PerspectiveRouter, ApplicationScopeModelFactory,
    UserModelFactory, publicLang, lang) {
  'use strict';

  var LandingPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      '*other': 'openLandingPerspective'
    },

    name: 'Landing',

    constructor: function LandingPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:id', this._updateHomeUrl);

      this.user = this.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change:id', this._updatePageTitle);
    },

    openLandingPerspective: function (/*viewState*/) {
      this._updatePageTitle();
      this.applicationScope.set('id', '');
    },

    onViewStateChanged: function () {
      this._updateHomeUrl();
    },

    restore: function (viewState/*, sessionViewState*/) {
      this.openLandingPerspective(viewState);
    },

    _updateHomeUrl: function () {
      if (this.applicationScope.id) {
        return;
      }

      if (this !== this.getActiveRouter()) {
        this.activate(true);
      }

      this._updatePageTitle();
      this.navigate('');
    },

    _updatePageTitle: function () {
      if (this.applicationScope.id === "") {
        document.title = !this.user.has('name') ? lang.UserLoadingTitle :
                         _.str.sformat(publicLang.UserTitle, base.formatMemberName(this.user), publicLang.ProductName);
      }
    }
  }, {
    isDefault: true
  });

  return LandingPerspectiveRouter;
});
