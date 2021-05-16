/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/models/command',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (_, ModalAlert, CommandModel, lang) {

  var RemoveParticipantCommand = CommandModel.extend({

    defaults: {
      signature: 'RemoveParticipant',
      name: lang.CommandNameRemoveParticipant,
      scope: 'multiple'
    },

    enabled: function (status) {
      if (status && status.nodes && status.nodes.length > 0) {
        var allowed = true;
        _.each(status.nodes.models, function (participant) {
          if (!participant.canRemove()) {
            allowed = false;
          }
        });
        return allowed;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      var title = (status.nodes.length === 1)
          ? lang.RemoveParticipantTitleSingle
          : lang.RemoveParticipantTitleMultiple;
      var message = lang.RemoveParticipantMessage;
      var self = this;
      ModalAlert.confirmQuestion(message, title)
          .always(function (answer) {
            if (answer) {
              var count = status.nodes.length;
              var error = false;
              _.each(status.nodes.models, function (participant) {
                participant.save({
                  add: [],
                  remove: participant.roles.models
                }, {
                  success: function (response) {
                    if ((--count) === 0) {
                      self._refresh(status, error);
                    }
                  },
                  error: function (response) {
                    error = true;
                    if ((--count) === 0) {
                      self._refresh(status, error);
                    }
                  }
                });
              });
            }
          });
    },

    _refresh: function (status, error) {
      if (error === true) {
        ModalAlert.showError(lang.RemoveParticipantErrorMessageDefault);
      }
      status.originatingView.roleCollection.fetch();
      status.originatingView.participantCollection.fetch({
        success: function () {
          status.originatingView.participantCollection.setNewParticipant();
          status.originatingView.participantCollection.trigger('saved', status.originatingView.participantCollection);
        }
      });
    }
  });

  return RemoveParticipantCommand;
});



