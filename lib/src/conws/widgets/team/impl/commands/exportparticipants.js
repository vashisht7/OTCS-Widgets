/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'conws/utils/commands/export',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, ExportCommandModel, commandsLang, teamLang) {

  var ExportParticipantsCommand = ExportCommandModel.extend({

    defaults: {
      signature: 'ExportParticipants',
      name: commandsLang.CommandNameExportParticipants,
      scope: 'multiple'
    },

    constructor: function () {
      ExportCommandModel.prototype.constructor.call(this, arguments);
    },

    _exportHeader: function () {
      var ret = '';
      ret += '"' + teamLang.participantNameColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantRolesColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantLoginColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantEmailColTitle.replace(/"/g, '""') + '";';
      ret += '"' + teamLang.participantDepartmentColTitle.replace(/"/g, '""') + '";';
      return ret;
    },

    _exportModel: function (model) {
      var ret = '"';
      ret += model.get('display_name') ? model.get('display_name').replace(/"/g, '""') :
             model.get('name').replace(/"/g, '""');
      ret += '";"' + model.getLeadingRole().replace(/"/g, '""') + ' ' +
             model.getRolesIndicator().replace(/"/g, '""');
      ret += '";"';
      ret += model.get('name') ? model.get('name').replace(/"/g, '""') : '';
      ret += '";"';
      ret += model.get('business_email') ? model.get('business_email').replace(/"/g, '""') : '';
      ret += '";"';
      ret += model.get('group_name') ? model.get('group_name').replace(/"/g, '""') : '';
      ret += '";';
      return ret;
    }
  });

  return ExportParticipantsCommand;
});



