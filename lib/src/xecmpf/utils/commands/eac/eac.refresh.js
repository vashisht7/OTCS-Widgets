/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
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
