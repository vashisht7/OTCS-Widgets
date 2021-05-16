/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/models/command', 'csui/utils/commandhelper'
], function (require, $, _, CommandModel, CommandHelper) {
  'use strict';

  var OpenNodePerspectiveCommand = CommandModel.extend({

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/utils/contexts/factories/next.node'
      ], function (NextNodeModelFactory) {
        var context = status.context || options && options.context,
            nextNode = context.getModel(NextNodeModelFactory),
            node = CommandHelper.getJustOneNode(status);

        var viewState = context.viewStateModel.get('state');
        if (viewState) {
          context.viewStateModel.set('state', _.omit(viewState, 'filter'), {silent: true});
        }
        nextNode.trigger('before:change:id', node.get('id'));
        nextNode.set('id', node.get('id'));
        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  return OpenNodePerspectiveCommand;

});
