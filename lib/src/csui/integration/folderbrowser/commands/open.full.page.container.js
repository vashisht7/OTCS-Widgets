/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/models/command',
  'i18n!csui/integration/folderbrowser/commands/nls/localized.strings'
], function (module, require, $, _, CommandModel, lang) {
  'use strict';

  var OpenFullPageWorkpsace = CommandModel.extend({
    defaults: {
      signature: 'Page',
      name: lang.OpenFullPageContainer
    },

    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      return config.enabled && !!status.container;
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/utils/node.links/node.links'], function (nodeLinks) {
        window.open(nodeLinks.getUrl(status.container));
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    }
  });

  return OpenFullPageWorkpsace;
});
