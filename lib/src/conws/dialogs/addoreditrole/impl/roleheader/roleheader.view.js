/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/roleheader/impl/roleheader.view',
  'css!conws/dialogs/addoreditrole/impl/roleheader/impl/roleheader.view'
], function (_, Marionette, lang, template) {

  var RoleHeaderView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      StepHeaderRegion: '.conws-addoreditrole-wizardstep-header',
    },

    templateHelpers: {
      Step1: lang.RoleStepName,
      Step2: lang.PermissionsStepName,
      Step3: lang.ParticipantsStepName
    },

    constructor: function RoleHeaderView(options) {
      options || (options = {});

      this.context = options.context;
      this.connector = options.connector;

      if (!!options.currentStep) {
        this.listenTo(this, 'render', this._updateClasses);
        _.bind(this._updateClasses, options);
      }
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _updateClasses: function (self) {

      switch (self.options.currentStep) {
        case "step1":
          this.$el.find('.conws-addoreditrole-wizardstep1').addClass('conws-addoreditrole-wizardstep-header-active');
          break;
        case "step2":
          this.$el.find('.conws-addoreditrole-wizardstep2').addClass('conws-addoreditrole-wizardstep-header-active');
          break;
        case "step3":
          this.$el.find('.conws-addoreditrole-wizardstep3').addClass('conws-addoreditrole-wizardstep-header-active');
          break;
        default:
      }
    }

  });
  return RoleHeaderView;
});