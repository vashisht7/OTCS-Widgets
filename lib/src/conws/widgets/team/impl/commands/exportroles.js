/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'conws/utils/commands/export',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, ExportCommandModel, commandsLang, teamLang) {

  var ExportRolesCommand = ExportCommandModel.extend({

    defaults: {
      signature: 'ExportRoles',
      name: commandsLang.CommandNameExportRoles,
      scope: 'multiple'
    },

    constructor: function () {
      ExportCommandModel.prototype.constructor.call(this, arguments);
    },

    _exportHeader: function () {
      var ret = '';
      ret += '"' + teamLang.rolesNameColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.rolesParticipantsColTitle.replace(/"/g, '""') + '";';
      return ret;
    },

    _exportModel: function (model) {
      var ret = '';
      ret += '"' + model.displayName().replace(/"/g, '""') + '";';
      ret += '"' + model.displayMembers().replace(/"/g, '""') + '";';
      return ret;
    }
  });

  return ExportRolesCommand;
});



