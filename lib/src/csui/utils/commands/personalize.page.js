/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, CommandModel, CommandHelper, lang) {
  'use strict';
  var config = _.extend({
    enablePersonalization: true
  }, config, module.config());

  var PersonalizePageCommand = CommandModel.extend({

    defaults: {
      signature: 'PersonalizePage',
      name: lang.personalizePage
    },

    enabled: function (status, options) {
      var context    = status.context || options && options.context,
          perspective = context.perspective;
      return config.enablePersonalization && perspective && perspective.get('type') === 'flow';
    },

    execute: function (status, options) {
      var context         = status.context || options && options.context,
      enablePersonalization = (options && options.enablePersonalization) ||
                            config.enablePersonalization;
      if (enablePersonalization) {
        return this._initPersonalization(status, options, context);
      }
    },

    _initPersonalization: function (status, options, context) {
      var deferred = $.Deferred(),
          self     = this;
      require(['csui/perspective.manage/pman.view', 'csui/utils/contexts/factories/node', 
      'csui/models/perspective/personalization.model'],
          function (PManView,  NodeModelFactory, PersonalizationModel) {
                var node              = CommandHelper.getJustOneNode(status) ||
                              context.getModel(NodeModelFactory),
                              currentPerspective = context.perspective.toJSON(),
                personalizationModel = new PersonalizationModel(currentPerspective, {node: node, context: context});
                personalizationModel.fetch().then(function() {
                  var pmanView = new PManView({
                    context: context,
                    perspective: personalizationModel,
                    mode: PManView.MODE_PERSONALIZE
                  });
                  pmanView.show();
                  deferred.resolve();
                });                
          }, deferred.reject);
      return deferred.promise();
    },
  });

  return PersonalizePageCommand;
});
