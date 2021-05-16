/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!conws/controls/inlineforms/conwstemplate/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  'conws/models/workspacetypes/workspacetype.factory',
  "hbs!conws/controls/inlineforms/conwstemplate/impl/conwstemplate",
  "css!conws/controls/inlineforms/conwstemplate/impl/conwstemplate"
], function (require, $, _, Marionette, lang, inlineFormViewRegistry, InlineFormView, WorkspaceTypeFactory, template) {

  var InlineFormConwsTemplateView = InlineFormView.extend({

    className: function () {
      var className = "conws-template-csui-inlineform";
      if (InlineFormView.prototype.className) {
        className += ' ' + _.result(InlineFormView.prototype, 'className');
      }
      return className;
    },

    template: template,

    templateHelpers: function () {
      var inlineFormViewData = this._templateHelpers();
      var data = _.extend(inlineFormViewData, {
        wstypes: this.wstypes ? this.wstypes.get('wstypes') : "",
        namePlaceholder: lang.NamePlaceholder,
        wsTypePlaceholder: lang.WSTypePlaceholder,
        createMode: this.createMode
      });
      return data;
    },

    ui: {
      wsTypeField: '.conws-inlineform-input-wstype'
    },

    events: {
      'change @ui.wsTypeField': 'keyReleased'
    },

    constructor: function InlineFormConwsTemplateView(options) {
      this.options = options || {};
      this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
      this.events = _.extend({}, this.events, InlineFormView.prototype.events);

      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.createMode = this.options.model.get("name") === "" ? true : false;

      if (this.createMode) {

        var wstypesfactory = this.options.context.getFactory("workspacetypes");
        if (wstypesfactory && wstypesfactory.property && wstypesfactory.property.fetched) {
          this.wstypes = wstypesfactory.property;
        } else {
          this.wstypes = this.options.context.getModel(WorkspaceTypeFactory, {});
          this.wstypes.fetch();
          this.listenTo(this.wstypes, 'sync', this.render);
        }

      }
    },
    _viewToModelDataExtended: function () {
      if (this.createMode) {
        this.model.set('reference_type', this._getWSTypeID(), { silent: true });
      }
    },

    toggleButton: function (event) {
      if (this.ui.saveButton.length) {
        var currentInputElementVal = this.ui.inputFieldName.val().trim(),
          enableAddButton = false;
        enableAddButton = currentInputElementVal.length !== 0;

        if (this.createMode) {
          var wsTypeFieldInputElement = !!this.ui.wsTypeField ? this.ui.wsTypeField[0] : undefined;
          if (enableAddButton && !!wsTypeFieldInputElement) {
            var wstypeID = this._getWSTypeID();
            enableAddButton = wstypeID.length !== 0;
          }
        }

        if (enableAddButton) {
          this.ui.saveButton.prop("disabled", false).addClass("binf-btn-default");
        } else {
          this.ui.saveButton.attr("disabled", "disabled").removeClass("binf-btn-default");
        }
      }
      this.refershTabableElements();
    },

    _getWSTypeID: function () {
      var elInput = this.ui.wsTypeField;
      return $(elInput).val();
    },

    _saveIfOk: function () {
      this._viewToModelData();
      var name = this.model.get('name'),
        data = {},
        isValid = false;

      if (name.length > 0) {
        data.name = name;
        isValid = true;
      }
      if (this.createMode && isValid) {
        var wstypeID = this._getWSTypeID();

        if (wstypeID.length > 0) {
          data.reference_type = wstypeID;
        } else {
          isValid = false;
        }
      }
      if (isValid) {
        this._save(data);
      }
    }
  },
    {
      CSSubType: 848
    }
  );

  inlineFormViewRegistry.registerByAddableType(InlineFormConwsTemplateView.CSSubType, InlineFormConwsTemplateView);
  return InlineFormConwsTemplateView;
});
