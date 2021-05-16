/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!csui/utils/commands/versions/nls/localized.strings',
  'csui/utils/commandhelper', 'csui/models/command', 'csui/models/version',
  'csui/utils/base', 'csui/utils/url'
], function (_, $, versionLang, CommandHelper, Command, VersionModel, base, Url) {
  'use strict';

  var PromoteVersionCommand = Command.extend({
    defaults: {
      signature: 'PromoteVersion',
      command_key: ['versions_promote'],
      name: versionLang.CommandNamePromoteVersion,
      verb: versionLang.CommandVerbPromoteVersion,
      scope: 'single'
    },

    enabled: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status).models;
      return (nodes && nodes.length === 1) &&
             (status.container && status.container.get('advanced_versioning'));
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      this._confirmAction(status, options)
          .done(function () {
            deferred.resolve();
          })
          .fail(function () {
            deferred.reject();
          });

      return deferred.promise();
    },

    _confirmAction: function (status, options) {
      status.originatingView.blockActions();
      var deferred   = $.Deferred(),
          node       = status.container,
          newVersion = CommandHelper.getJustOneNode(status).clone(),
          connector  = status.container && status.container.connector;
      require(['csui/controls/globalmessage/globalmessage'], function (GlobalMessage) {
        var data = {};
        newVersion.save(undefined, {
          data: data,
          type: 'POST',
          wait: true,
          url: Url.combine(connector.getConnectionUrl().getApiBase('v2'), '/nodes/' + newVersion.get("id") +
               '/versions/' + newVersion.get("version_number") + '/promote')
        }).done(function () {
          newVersion.fetch().done(function () {
            if (node.versions || (!!node.attributes && !!node.attributes.versions)) {
              newVersion.isLocallyCreated = true;
              fakeActions(node, newVersion);
              !!node.versions && node.versions.add(newVersion, {at: 0});
              if (Array.isArray(node.get('versions'))) {
                !!node.attributes && !!node.attributes.versions &&
                node.attributes.versions.push(newVersion.attributes);
              }
            }
            deferred.resolve();
            GlobalMessage.showMessage('success', versionLang.MessageVersionPromoted);
          });
        }).fail(function (error) {
          deferred.reject();
          if (error) {
            var errorObj = new base.Error(error);
            GlobalMessage.showMessage('error', errorObj.message);
          }
        }).always(function () {
          status.originatingView.unblockActions();
        });

      });
      function fakeActions(node, version) {
        var actions = [];
        if (node.actions.findRecursively('download') || node.actions.findRecursively('Download')) {
          actions.push({signature: 'versions_download'}, {signature: 'versions_open'});
        }
        if (node.actions.findRecursively('delete') || node.actions.findRecursively('Delete')) {
          actions.push({signature: 'versions_delete'});
        }
        if (node.actions.findRecursively('properties') ||
            node.actions.findRecursively('Properties')) {
          actions.push({signature: 'versions_properties'});
        }
        version.actions.reset(actions);
      }

      return deferred.promise();
    },
  });

  return PromoteVersionCommand;
});
