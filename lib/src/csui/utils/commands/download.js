/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/jquery", "csui/utils/base",
  "i18n!csui/utils/commands/nls/localized.strings", "csui/utils/log", "csui/utils/command.error",
  "csui/utils/url", "csui/utils/commandhelper", "csui/utils/connector", "csui/models/command",
  "csui/models/version"
], function (module, _, $, base, lang, log, CommandError, Url, CommandHelper, Connector,
    CommandModel, VersionModel) {
  'use strict';

  var DownloadCommand = CommandModel.extend({

    defaults: {
      signature: "Download",
      command_key: ['download', 'Download'],
      name: lang.CommandNameDownload,
      verb: lang.CommandVerbDownload,
      doneVerb: lang.CommandDoneVerbDownload,
      scope: "single"
    },

    execute: function (status, options) {
      var node = this._getNode(status);

      if (base.isAppleMobile()) {
        return this._openContent(node, options);
      } else {
        return this._downloadContent(node, options);
      }
    },

    _getNode: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      var type = node.get('type');
      var generationVersionNumber = node.get('version_number');
      if (node.original && node.original.get('id') > 0) {
        if (type === 1 || type === 2) {  // Shortcut or Generation
          node = node.original;
        }
        if (type === 2 && generationVersionNumber !== undefined) {  // Generation
          node.set('version_number', generationVersionNumber, {silent: true});
        }
      }
      var versionsObj = node.get('versions');
      var currentVersion = !(versionsObj && (versionsObj.current_version === false));
      if (!(node instanceof VersionModel) && type !== 2 && currentVersion) {
        var cloneNode = node.clone();
        var versionNumProps = ['version_number', 'version_number_major', 'version_number_minor',
          'version_number_name'];
        versionNumProps.forEach(function (property) {
          cloneNode.unset(property, {silent: true});
          if (cloneNode.attributes.versions && _.isObject(cloneNode.attributes.versions)) {
            delete cloneNode.attributes.versions[property];
          }
        });
        return cloneNode;
      }

      return node;
    },

    _downloadContent: function (node, options, action) {
      return this._executeContentCommand(node, options)
          .then(_.bind(function (token) {
            var url = this._getContentUrl(node, options, action || "download", token);
            return this._performDownload(url);
          }, this));
    },

    _openContent: function (node, options) {
      var self = this;
      var content = window.open("");
      return this._executeContentCommand(node, options)
          .then(function (token) {
            content.location.href = self._getContentUrl(node, options, "download", token);
            content.focus();
            return $.Deferred().resolve();
          }, function () {
            content.close();
            return $.Deferred().reject();
          });
    },

    _executeContentCommand: function (node, options) {
      var promise = $.Deferred();
      node.connector.requestContentAuthToken(node)
          .done(function (data) {
            promise.resolve(data.token);
          })
          .fail(function (error) {
            promise.reject(new CommandError(error));
          });
      return promise.promise();
    },

    _getContentUrl: function (node, options, action, token) {
      var url = "";
      if (node.get('version_number')) {
        url = Url.combine(node.connector.connection.url, "nodes",
            node.get('id'), "versions", node.get('version_number'), "content");
      } else {
        url = Url.combine(node.connector.connection.url, "nodes",
            node.get('id'), "content");
      }
      return url + "?action=" + action + "&token=" + encodeURIComponent(token);
    },

    _performDownload: function (url) {
      var iframe = $("<iframe></iframe>")
          .hide()
          .attr("src", url)
          .appendTo($(document.body));
      var delay = Math.min(Connector.prototype.connectionTimeout || 60 * 1000, 60 * 1000);
      setTimeout(function () {
        iframe.remove();
      }, delay);
      return $.Deferred().resolve();
    }

  });

  return DownloadCommand;

});
