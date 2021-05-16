/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/dialog/dialog.view',
  'hbs!xecmpf/widgets/integration/folderbrowse/modaldialog/impl/modal.dialog',
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  'css!xecmpf/widgets/integration/folderbrowse/modaldialog/impl/modal.dialog'
], function (_, DialogView, Template, Lang) {
  var ModalDialogView = DialogView.extend({
    template: Template,
    templateHelpers: function () {
      return {
        closeToolTip: Lang.CloseToolTip
      };
    },

    events: function(){
      return _.extend({},DialogView.prototype.events,{
        'keypress .cs-close' : 'onKeyPress'
      });
    },

    onKeyPress: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        this.destroy();
      }
    }
  });
  return ModalDialogView;
});