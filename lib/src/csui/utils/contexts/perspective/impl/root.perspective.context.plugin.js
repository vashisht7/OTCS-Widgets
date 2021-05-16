/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin'
], function (_, Backbone, ApplicationScopeModelFactory,
    PerspectiveContextPlugin) {
  'use strict';

  var supportedPerspectives = {
    myassignments: 'myassignmentstable',
    recentlyaccessed: 'recentlyaccessedtable',
    favorites: 'favorites2.table'
  };

  var RootPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function RootPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory)
          .on('change', this._fetchRootPerspective, this);
    },

    _fetchRootPerspective: function () {
      var scope = this.applicationScope.id;
      if (!supportedPerspectives[scope] || this.loadingPerspective){
        return;
      }

      this.context.loadPerspective('json!csui/utils/contexts/perspective/impl/perspectives/' +
        supportedPerspectives[scope] + '.json');
    }

  });

  return RootPerspectiveContextPlugin;

});
