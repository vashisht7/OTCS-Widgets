/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/commandhelper', 'csui/utils/commands/open.classic.page', 'csui/models/node.actions'
], function (_, CommandHelper, OpenClassicPageCommand, NodeActionCollection) {
  'use strict';

  var OpenFormCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'openform',
      command_key: ['openform'],
      scope: 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && (node.get('openable') || node.actions.get('openform'));
    },

    execute: function (status, options) {
      return this._getActionParameters(status, options)
          .then(_.bind(function (action) {
            return this._openForm(status, options, action);
          }, this));
    },

    _openForm: function (status, options, action) {
      this.objAction = 'EditForm';
      var node     = CommandHelper.getJustOneNode(status);
      if (action && action.get('body')) {
        this.objAction = action.get('body');
      }
      return this._navigateTo(node, options);
    },

    _getActionParameters: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      var formActionCollection = new NodeActionCollection(undefined, {
        connector: node.connector,
        nodes: [ node.get('id') ],
        commands: [ 'openform' ]
      });
      var originatingView = status.originatingView || options.originatingView;
      originatingView && originatingView.blockActions && originatingView.blockActions();
      return formActionCollection
          .fetch()
          .then(function () {
            var action = formActionCollection
                .get(node.get('id'))
                .actions.get('openform');
            return action;
          })
          .always(function () {
            originatingView && originatingView.unblockActions && originatingView.unblockActions();
          });
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: this.objAction,
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenFormCommand;

});
