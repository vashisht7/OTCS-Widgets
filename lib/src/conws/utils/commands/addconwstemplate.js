/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/base',
  'csui/utils/log',
  'csui/models/command',
  'csui/models/node/node.model',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (require, $, _, base, log,
  CommandModel,
  NodeModel,
  lang) {

    var DocTemplateVolumeType = 20541;

    var AddWorkspaceTemplateCommand = CommandModel.extend({

      defaults: {
        signature: 'AddCONWSTemplate',
        name: lang.CommandNameAddCONWSTemplate,
        scope: 'single'
      },

      enabled: function (status) {
        var container = status.container || {}
        return container.get("type") === DocTemplateVolumeType ? true : false;
      },

      execute: function (status, options) {

        var deferred = $.Deferred(),
          subType = options.addableType,
          subTypeName = options.addableTypeName,
          newNode = new NodeModel({
            "type": subType,
            "type_name": subTypeName,
            "container": true,
            "name": "",
            "parent_id": status.container.attributes.id,
            "is_doctemplate": true
          }, {
              connector: status.container.connector
            });

        status.forwardToTable = true;
        deferred.resolve(newNode);
        return deferred.promise();
      }
    });

    return AddWorkspaceTemplateCommand;
  });



