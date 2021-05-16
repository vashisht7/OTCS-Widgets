/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/models/command',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (_, ModalAlert, CommandModel, lang) {

  var DeleteRoleCommand = CommandModel.extend({

    defaults: {
      signature: 'DeleteRoles',
      name: lang.CommandNameDeleteRole,
      scope: 'multiple'
    },

    enabled: function (status) {
      if (status && status.nodes && status.nodes.length > 0) {
        var allowed = true;
        _.each(status.nodes.models, function (role) {
          if (!role.canDelete()) {
            allowed = false;
          }
          if ((role.get('leader') === true) && (role.collection.length > 1)) {
            allowed = false;
          }
        });
        return allowed;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      var count = this._evaluateMembersRemoved(status).length;
      var title = (status.nodes.length === 1)
          ? lang.DeleteRoleTitleSingle
          : lang.DeleteRoleTitleMultiple;
      var message = lang.DeleteRoleMessageNoParticipantsAffected;
      if (count === 1) {
        message = lang.DeleteRoleMessageParticipantsAffectedSingle;
      } else if (count > 1) {
        message = lang.DeleteRoleMessageParticipantsAffectedMultiple.replace('{0}', count);
      }
      var self = this;
      ModalAlert.confirmQuestion(message, title)
          .always(function (answer) {
            if (answer) {
              _.each(_.clone(status.nodes.models), function (model) {
                model.destroy({
                  wait: true,
                  success: function () {
                    if (status.nodes.length === 0) {
                      self._refreshCollections(status);
                    }
                  }
                });
              });
            }
          });
    },

    _evaluateMembersRemoved: function (status) {
      var participants = status.originatingView.participantCollection;
      var roles = status.originatingView.roleCollection;
      var affectedParticipants = [];
      _.each(status.nodes.models, function (role) {
        role.members.each(function (member) {
          affectedParticipants.push(member.get('id'));
        });
      });
      affectedParticipants = _.uniq(affectedParticipants);
      var unaffectedParticipants = [];
      _.each(roles.models, function (role) {
        if (status.nodes.findWhere({id: role.get('id')}) === undefined) {
          role.members.each(function (member) {
            unaffectedParticipants.push(member.get('id'));
          });
        }
      });
      unaffectedParticipants = _.uniq(unaffectedParticipants);
      var difference = _.difference(affectedParticipants, unaffectedParticipants);
      return difference;
    },

    _refreshCollections: function (status) {
      status.originatingView.roleCollection.fetch({
           success: function() {
             status.originatingView.participantCollection.trigger('saved', status.originatingView.participantCollection);
           }
          });

    }
  });

  return DeleteRoleCommand;
});



