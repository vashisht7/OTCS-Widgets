/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/pages/start/perspective.router',
  'i18n!csui/pages/start/nls/lang'
], function (_, PerspectiveRouter, publicLang) {
  'use strict';

  var applicationScopes = {
    myassignments: _.str.sformat(publicLang.MyAssignmentsTitle, publicLang.ProductName),
    recentlyaccessed: _.str.sformat(publicLang.RecentlyAccessedTitle, publicLang.ProductName),
    favorites: _.str.sformat(publicLang.FavoritesTitle, publicLang.ProductName)
  };

  var RootPerspectiveRouter = PerspectiveRouter.extend({

    name: 'Root',

    routes: {
      'myassignments': 'openMyAssignmentsPerspective',
      'myassignments(?*query_string)': 'openMyAssignmentsPerspective',
      'recentlyaccessed': 'openRecentlyAccessedPerspective',
      'recentlyaccessed(?*query_string)': 'openRecentlyAccessedPerspective',
      'favorites': 'openFavoritesPerspective',
      'favorites(?*query_string)': 'openFavoritesPerspective'
    },

    constructor: function RootPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.listenTo(this.applicationScope, 'change:id', this._updateUrl);
    },

    openRecentlyAccessedPerspective: function(query_string) {
      this.openApplicationScope('recentlyaccessed', query_string);
    },

    openMyAssignmentsPerspective: function(query_string) {
      this.openApplicationScope('myassignments', query_string);
    },

    openFavoritesPerspective: function(query_string) {
      this.openApplicationScope('favorites', query_string);
    },

    openApplicationScope: function (scope, query_string) {
      this.initViewStateFromUrlParams(query_string);
      this.activate(false);
      this._updatePageTitle();
      this.applicationScope.set('id', scope);
    },

    isViewStateModelSupported: function () {
      return true;
    },

    onViewStateChanged: function () {
      this._updateUrl();
    },

    _updateUrl: function () {
      var scope = this.applicationScope.id;
      if (applicationScopes[scope]){

        if (this !== this.getActiveRouter()) {
          this.activate(true);
        }

        this._updatePageTitle();
        this.navigate(scope);
      }
    },

    _updatePageTitle: function () {
      document.title = applicationScopes[this.applicationScope.id];
    }

  });

  return RootPerspectiveRouter;

});
