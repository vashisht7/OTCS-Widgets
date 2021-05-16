/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/form/fields/selectfield.view',
  'csui/controls/form/fields/userfield.view',
  'csui/controls/form/fields/textfield.view',
  'workflow/controls/userpicker/userpicker.view',
  'hbs!workflow/widgets/action/action.body/impl/action.body',
  'hbs!workflow/widgets/action/action.body/impl/action.body.comment',
  'hbs!workflow/widgets/action/action.body/impl/action.body.reviewDurationDate',
  'hbs!workflow/widgets/action/action.body/impl/action.body.reviewDurationUnit',
  'hbs!workflow/widgets/action/action.body/impl/action.body.authenticate',
  'hbs!workflow/widgets/action/action.body/impl/assigneetypeselector',
  'i18n!workflow/widgets/action/action.body/impl/nls/lang',
  'css!workflow/widgets/action/action.body/impl/action.body',
], function ($, _, Backbone, Marionette, Alpaca, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
    SelectFieldView, UserFieldView, TextFieldView, UserPicker, template, templateComment, templateReviewDurationDate, templateReviewDurationUnit, templateAuthenticate, templateSelector, lang) {
  'use strict';
  var ActionBodyCommentView = Marionette.LayoutView.extend({
    className: 'action-comment',
    template: templateComment,
    templateHelpers: function () {
      return {
        label: this.labelText,
        placeholder: this.placeholderText,
        ariaLabel: this.ariaLabel
      };
    },
    ui: {
      textbox: '.comment-input'
    },
    events: {
      'keyup @ui.textbox': 'onKeyUpTextBox'
    },
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },
    constructor: function ActionBodyCommentView(options) {
      this.options = (options || {});
      this.labelText = this.options.commentLabel || lang.commentTextFieldLabel;
      this.ariaLabel = this.options.commentAriaLabel || lang.commentTextFieldLabel;
      this.placeholderText = this.options.commentPlaceholder || lang.commentTextFieldPlaceholder;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },
    onKeyUpTextBox: function () {
      this.triggerMethod('comment:changed', {text: this.ui.textbox.val()});
    },
    currentlyFocusedElement: function () {
      return $(this.ui.textbox);
    }
  });

  var ActionBodyReviewDurationDateView = Marionette.LayoutView.extend({

    className: 'action-reviewDuration',

    template: templateReviewDurationDate,
    templateHelpers: function () {
      return {
        durationLabel: this.durationLabel
      };
    },
    regions: {
      durationTextField: '.durationRegion'
    },

    ui: {
      textbox: '#durationField',
      lblErrorMessage: '.has-error-label',
      lblErrorMessageText: '#errorDuration'
    },

    constructor: function ActionBodyReviewDurationDateView(duration) {

      this.durationLabel = lang.durationLabel;
      Marionette.LayoutView.prototype.constructor.call(this);
    },

    onRender: function () {

      this.durationField = new TextFieldView({
        model: new Backbone.Model({
          id: 'durationField',
          options:{placeholder: lang.durationPlaceholder}
        }),
        id: 'durationFieldDIV',
        mode:'writeonly',
        labelId:lang.durationLabel,
        alpaca: {
          options:{mode:'writeonly'}
        }
      });

      this.durationTextField.show(this.durationField);
    },
    onKeyUpTextBox: function () {
      this.triggerMethod('duration:changed', {number: this.$('#durationField').val()});
    },

    currentlyFocusedElement: function () {
      return this.$('#durationField');
    },

    events: {
      'keyup @ui.textbox': 'onKeyUpTextBox'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    }
  });

  var ActionBodyReviewDurationUnitView = Marionette.LayoutView.extend({

    className: 'action-reviewDuration',

    template: templateReviewDurationUnit,
    templateHelpers: function () {
      return {};
    },
    regions: {
      selectUnit: '.durationUnitRegion'
    },

    constructor: function ActionBodyReviewDurationDateView(durationUnit) {

      this.durationUnit = durationUnit || lang.durationDayUnit;
      Marionette.LayoutView.prototype.constructor.call(this);
    },

    onRender: function () {
      var collection = new Backbone.Collection([
        {id: lang.durationDayUnit, name: lang.durationDayUnit},
        {id: lang.durationHourUnit, name: lang.durationHourUnit}
      ]);
      this.unitOptions = new SelectFieldView({
        id: 'unitOptionSelector', //field id
        model: new Backbone.Model({options: {isMultiFieldItem: false, label: lang.durationUnitOptionLabel}}),
        selected: collection.get(lang.durationDayUnit),
        collection: collection,
        alpaca: {
          options: {
            setRequiredFieldsEditable: true
          },
          schema: {readonly: false}
        }
      });
      this.unitOptions.alpacaField = {
        options: {mode: 'create'},
        schema: {readonly: false},
        setValueAndValidate: function () { return true; },
        setValue: function () { return; },
        parent: {}
      };
      this.selectUnit.show(this.unitOptions);
      this.listenTo(this.unitOptions, "field:changed", _.bind(function (event) {
        this.triggerMethod('durationUnit:changed', {option: event.fieldvalue});
      }, this));
    },


    currentlyFocusedElement: function () {
         return this.$('.binf-btn');
    },


    behaviors: {
      TabableRegion: {
          behaviorClass: TabableRegionBehavior,
          initialActivationWeight: 100
      }
    }
  });

  var ActionBodyAuthenticateView = Marionette.LayoutView.extend({

    className: 'action-authenticate',

    template:  templateAuthenticate,
    templateHelpers: function () {
      return {
        lang: lang,
        label: this.labelText,
        placeholder: this.placeholderText,
        ariaLabel: this.ariaLabel,
        authenticateDescLabelAndUser: this.authenticateDescLabel,
        authenticateFailed: this.authenticationFailed,
        authenticateEnterPassword: this.authenticateEnterPassword
      };
    },

    constructor: function ActionBodyAuthenticateView(options) {
      this.options = (options || {});
      this.labelText = lang.authenticateTextFieldLabel;
      this.ariaLabel = lang.authenticateTextFieldLabel;
      this.placeholderText = lang.authenticateTextFieldPlaceholder;
      this.authenticateDescLabel = lang.authenticateDescriptionLabel;
      var user = options || "";
      this.authenticateEnterPassword = _.str.sformat(lang.authenticateEnterPassword, user);
      this.authenticationFailed = lang.authenticationFailed;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    ui: {
      txtPassword: '.authenticate-input',
      lblErrorMessage: '.has-error-label'
    },

    events: {
      'keyup @ui.txtPassword': 'onKeyUpTextBox'
    },

    onKeyUpTextBox: function () {
      this.triggerMethod('authenticate:changed', {text: this.ui.txtPassword.val()});
    },

    currentlyFocusedElement: function () {
      return $(this.ui.txtPassword);
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    }
  });
  var AssigneeTypeSelector = Marionette.LayoutView.extend({
    className: 'assignee-options-select',
    template: templateSelector,
    templateHelpers: function () {
      return {
        lang: lang
      };
    },
    regions: {
      selectField: '.assignee-type-selector-region'
    },
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },
    constructor: function AssigneeTypeSelector(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var collection = new Backbone.Collection([
        {id: lang.assigneeOptionOneMember, name: lang.assigneeOptionOneMember},
        {id: lang.assigneeOptionAllMembers, name: lang.assigneeOptionAllMembers}
      ]);
      this.assingeeOptions = new SelectFieldView({
        id: 'assigneeOptionSelector', //field id
        model: new Backbone.Model({options: {isMultiFieldItem: false, label: lang.assigneeOptionLabel}}),
        selected: collection.get(lang.assigneeOptionOneMember), // show first item selected
        collection: collection,
        alpaca: {
          options: {
            setRequiredFieldsEditable: true
          },
          schema: {readonly: false}
        }
      });
      this.assingeeOptions.alpacaField = {
        options: {mode: 'create'},
        schema: {readonly: false},
        setValueAndValidate: function () { return true; },
        setValue: function () { return; },
        parent: {}
      };
      this.selectField.show(this.assingeeOptions);
      this.listenTo(this.assingeeOptions, "field:changed", _.bind(function (event) {
        this.triggerMethod('assigneeOption:changed', {option: event.fieldvalue});
      }, this));
    },
    currentlyFocusedElement: function () {
      if (this.$el.is(':visible')) {
        return this.$('.binf-dropdown-toggle');
      }
      return;
    }

  });
  var ActionBodyView = Marionette.LayoutView.extend({
    className: 'workitem-action-body',
    template: template,
    templateHelpers: function () {
      return {
        lang: lang,
        showAssigneeSelector: this.showAssigneeSelector,
        showAssigneeOptionsSelector: this.showAssigneeOptionsSelector,
        showAssigneeReadOnly: this.showAssigneeReadOnly,
        showComment: this.showComment,
        showAuthenticate: this.showAuthenticate,
        showDurationOption: this.showDurationOption,
        assigneePickerLabel: this.texts.assigneeLabel || lang.assigneePickerLabel
      };
    },
    regions: {
      assigneeRegion: '.workitem-action-assignee .assignee-picker',
      assigneeTypeRegion: '.workitem-action-assignee-options .assignee-options',
      assigneeLabelRegion: '.workitem-action-assignee-label .assignee-name',
      commentRegion: '.workitem-action-comment',
      authenticateInputRegion: '.workitem-action-authenticate',
      reviewDurationDateRegion: '.workitem-action-reviewDuration .durationTextField',
      reviewDurationUnitRegion: '.workitem-action-reviewDuration .durationUnitSection'

    },

    ui: {
      assigneeOptionsLabel: '.workitem-action-assignee-options .assignee-label',
      assigneeOptionsSelector: '.workitem-action-assignee-options .assignee-options'
    },
    constructor: function ActionBodyView(options) {
      this.showAssigneeSelector = options.model.get('requireAssignee');
      this.showAssigneeReadOnly = !this.showAssigneeSelector &&
                                  options.model.get('readonlyAssignee');
      this.showAssigneeOptionsSelector = options.model.get('assigneeOptions');
      this.showComment = options.model.get('requireComment');
      if (options.model.get('assignee')) {
        this.userId = options.model.get('assignee').get('id');
        this.assigneeAttributes = options.model.get('assignee').attributes;
      }

      this.showAuthenticate = options.model.get('authentication');
      if(options.model.get('currentUser')){
        this.currentUser = options.model.get('currentUser');
      }
      this.showDurationOption = options.model.get('durationOption');
      this.duration = options.model.get('duration');
      this.durationUnit = options.model.get('durationUnit');
      this.texts = options.model.get('texts') || {};
      if (this.showAssigneeReadOnly) {
        this.texts.commentAriaLabel = _.str.sformat(lang.commentAriaLabelReply, this.texts.commentLabel,
            this.assigneeAttributes.display_name);
      }
        else{
        this.texts.commentAriaLabel = this.texts.commentLabel;
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.listenTo(this.model, 'change:authentication_error', this._onAuthenticationError);
      this.propagateEventsToRegions();
    },
    onRender: function () {
      if (this.showAssigneeSelector) {
        var user = new UserPicker({
          context: this.options.context,
          limit: 20,
          clearOnSelect: false,
          placeholder: this.texts.assigneePlaceholder || lang.assigneePickerPlaceholder,
          ariaLabel: this.texts.assigneeLabel || lang.assigneePickerLabel,
          disabledMessage: lang.assigneeCurrentUserMessage,
          onRetrieveMembers: _.bind(this.onRetrieveMembers, this),
          prettyScrolling: true,
          initialActivationWeight: 100,
          isRequired: true
        });
        this.listenTo(user, 'dom:refresh', function () {
            if(!this.showAuthenticate) {
              user.$('input').trigger("focus");
            }
          });
        this.assigneeRegion.show(user);
        this.listenTo(user, 'item:change', this.onUserChanged);
        this.listenTo(user, 'item:remove', this.onUserRemoved);
      }
      if (this.showAssigneeReadOnly) {
        var label = new UserFieldView({
          context: this.options.context,
          mode: 'readonly',
          model: new Backbone.Model({
            data: this.assigneeAttributes,
            schema: {
              readonly: true
            }
          }),
          alpaca: {
            options: {}
          }
        });
        this.assigneeLabelRegion.show(label);
      }
      if (this.showAssigneeOptionsSelector) {
        var assigneeOptions = new AssigneeTypeSelector({
          context: this.options.context
        });
        this.listenTo(assigneeOptions, 'assigneeOption:changed', this.onAssigneeOptionChanged);
        this.assigneeTypeRegion.show(assigneeOptions);
        this._hideAssigneeOptions(true);
      }
      if (this.showAuthenticate) {
        this.authenticate = new ActionBodyAuthenticateView(this.currentUser);

        this.listenTo(this.authenticate, 'dom:refresh', function()
        {
          this.authenticate.$('input').trigger("focus");
          this.authenticate.$('input').val('');
          this.authenticate.triggerMethod('authenticate:changed');
        });
        this.listenTo(this.authenticate, 'authenticate:changed', this._onAuthenticateChanged);
        this.authenticateInputRegion.show(this.authenticate);
      }
      if (this.showComment) {
        var comment = new ActionBodyCommentView(this.texts);
        this.listenTo(comment, 'comment:changed', this.onCommentChanged);
        this.commentRegion.show(comment);
      }
      if(this.showDurationOption){
        this.reviewDurationDate = new ActionBodyReviewDurationDateView(this.duration);
        this.reviewDurationUnit = new ActionBodyReviewDurationUnitView(this.durationUnit);
        this.listenTo(this.reviewDurationDate, 'duration:changed', this._onReviewDurationChanged);
        this.listenTo(this.reviewDurationUnit, 'durationUnit:changed', this._onReviewDurationUnitChanged);
        this.reviewDurationDateRegion.show(this.reviewDurationDate);
        this.reviewDurationUnitRegion.show(this.reviewDurationUnit);
      }
    },

    _onReviewDurationChanged:function(e){
      var valid =  this._validateNumberAndMax(e.number);
      if(valid) {
        this.model.set('duration', e.number);
        this.reviewDurationUnit.triggerMethod('durationUnit:changed');
        this.reviewDurationDate.ui.lblErrorMessage.addClass('binf-hidden');
        this.reviewDurationDate.$('#durationField').removeClass('has-error');
      }
      else{
        this.model.set('duration', "error");
        this.reviewDurationDate.ui.lblErrorMessage.removeClass('binf-hidden');
        this.reviewDurationDate.$('#durationField').addClass('has-error');
      }
    },

    _onReviewDurationUnitChanged:function(e){
      if(_.isUndefined(e)) {
        this.model.set('duration_unit' , this.reviewDurationUnit.unitOptions.curVal.id);
      }
      else{
        this.model.set('duration_unit' , e.option );
      }
    },

    _validateNumberAndMax: function(args) {

      this.reviewDurationDate.ui.lblErrorMessageText.text("");
      if(_.isEmpty(args)){
        return true;
      }
      var validNumber = Alpaca.testRegex(Alpaca.regexps.number, args);
      if (!validNumber)
      {
        this.reviewDurationDate.ui.lblErrorMessageText.text(lang.durationNumberFailed);
        return false;
      }
      var floatValue = parseFloat(args);
      if (isNaN(floatValue)) {
        return false;
      }
      if(floatValue > 11574){
        this.reviewDurationDate.ui.lblErrorMessageText.text(_.str.sformat(lang.durationMaximumFailed, "11574"));
        return false;
      }

      return true;
    },

    _onAuthenticationError:function(e){
      this.authenticate.ui.txtPassword.addClass('has-error');
      this.authenticate.ui.txtPassword.val('');
      this.authenticate.ui.txtPassword.trigger("focus");
      this.authenticate.ui.txtPassword.removeAttr('aria-labelledby');
      this.authenticate.ui.txtPassword.attr('aria-labelledby','error');
      this.authenticate.triggerMethod('authenticate:changed');
      this.authenticate.ui.lblErrorMessage.removeClass('binf-hidden');
    },

    _onAuthenticateChanged: function (e) {
      if(_.isUndefined(e)) {
        this.model.set('authentication_info',{ password: ''});
      }
      else{
        this.model.set('authentication_info', {password: e.text});
      }
      if(this.model.get('authentication_error') !== "") {
        this.model.set('authentication_error', '');
      }
    },

    onCommentChanged: function (data) {
      this.model.set('comment', data.text);
    },
    onAssigneeOptionChanged: function (data) {
      if (data.option === lang.assigneeOptionAllMembers) {
        this.model.set('assigneeOption', 2);
      }
      else{
        this.model.set('assigneeOption', 0);
      }
    },
    onUserChanged: function (e) {
      var assignee = e.item;
      if (assignee.get('disabled')) {
        var picker = this.assigneeRegion.currentView;
        if (picker) {
          picker.ui.searchbox.val('');
        }
        assignee = undefined;
      }
      this.model.set('assignee', assignee);
      if ((assignee && assignee.get('type') === 0) || _.isUndefined(assignee) ){
        this._hideAssigneeOptions(true);
      } else {
        this._hideAssigneeOptions(false);
      }
    },
    onUserRemoved: function (e) {
      this.model.set('assignee', undefined);
      this._hideAssigneeOptions(true);
    },
    onRetrieveMembers: function (args) {
      var self = this;
      if (this.userId) {
        args.collection.each(function (current) {
          if (current.get('id') === self.userId) {
            current.set('disabled', true);
          }
        });
      }
    },
    _hideAssigneeOptions: function (hide) {
      if (hide) {
        this.ui.assigneeOptionsLabel.addClass('binf-hidden');
        this.ui.assigneeOptionsSelector.addClass('binf-hidden');
      } else {
        this.ui.assigneeOptionsLabel.removeClass('binf-hidden');
        this.ui.assigneeOptionsSelector.removeClass('binf-hidden');
      }
    }
  });
  _.extend(ActionBodyView.prototype, LayoutViewEventsPropagationMixin);
  return ActionBodyView;
});
