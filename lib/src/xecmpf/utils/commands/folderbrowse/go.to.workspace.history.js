/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
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



