/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/controls/form/fields/base/csformfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.states.behavior',
  'csui/controls/form/fields/base/csformfield.states.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/form/impl/fields/radiofield/radiofield',
  'i18n!csui/controls/form/impl/nls/lang',  
  'css!csui/controls/form/impl/fields/radiofield/radiofield'
], function (_, $, Backbone, Marionette, FormFieldView,FormFieldEditableBehavior, FormArrayFieldEditableBehavior, FormArrayFieldStatesBehavior,
  FormFieldStatesBehavior,TabableRegion,collectionTemplate, lang) {
  "use strict";

  var RadioFieldView = FormFieldView.extend({ 

    ui: {
      writeField: '.cs-field-write',
      readField: '.cs-field-read',      
      iconContainer: '.cs-radio-container'
    },

    events: {
      'focusout': 'onFocusOutWriteArea',
      'keyup input[type="radio"]': 'focusElement',
      'click @ui.iconContainer':'clickRadio',
      'change input[type="radio"]': 'onSelectionChange',
      'click input[type="radio"]': 'updateWriteField'
    },

    constructor: function RadioFieldView(options) {

      FormFieldView.prototype.constructor.apply(this, arguments);

      if (!!options.model.attributes.options) {
        if (!!options.model.attributes.options.isMultiFieldItem) {
          this.behaviors = _.extend({
            FormFieldEditable: {
              behaviorClass: FormArrayFieldEditableBehavior
            },
            FormFieldStates: {
              behaviorClass: FormArrayFieldStatesBehavior
            }
          }, this.behaviors);
        } else {
          this.behaviors = _.extend({
            FormFieldEditable: {
              behaviorClass: FormFieldEditableBehavior
            },
            FormFieldStates: {
              behaviorClass: FormFieldStatesBehavior
            }
          }, this.behaviors);
        }
      }

      this.model = new Backbone.Model();

      if (this.options.selected) {
        this._setSelection(this.options.selected);
      } else {
        this.resetSelection();
      }
      this.listenTo(this.model, 'change', this._raiseValueChanged);

      if (!this.options.dataId) {
        this.options.dataId = this.options.id;
      }

      this.mode = this.options.mode;
      this.mode = (this.options.alpaca && this.options.alpaca.schema.readonly) ? 'readonly' : 'read';
      this.$el.addClass(this.mode === 'readonly' ? 'cs-formfield-readonly' : '');

      this.curVal = this.oldVal = this.model.clone();

      this.alpacaField = this.options.alpacaField;
      if (this.options.alpaca) {
        if ((options.alpaca.options.setRequiredFieldsEditable || !options.model.attributes.options.isMultiFieldItem) && this.mode !== "readonly") {
          this.mode = 'writeonly';
        }
      }
    },
    
    
    
    className: 'cs-formfield cs-radio-group',

    template: collectionTemplate,

    templateHelpers: function () {
      var options, data, validationErrorMsg;    

      if (this.options.model) {
        options = this.options.model.get('options');
        data = this.options.model.get('data');
      }      

      var items = this.collection.map(function (item) {
        return item.attributes;
      });

      _.each(items, function (item) {
        if (data === item.id) {
          item.checked = "checked='\checked'\'";
        }
        if (_.isString(item.category) && /Error/.test(item.category)) {
          item.class = "radio-item-error";
          if (!validationErrorMsg) {
            validationErrorMsg = lang.radioFieldValidationErrorInvalidValue;
          }
        }
      });
      var radioGroupName = this.options.dataId,
        idBtn = this.options.alpacaField ? this.options.alpacaField.id : _.uniqueId("empty");

      return {
        items: items,
        radioGroupName: radioGroupName,        
        hasData: data !== "" && data !== null && this.options.hasValue,
        writeonlyMode: this.mode === 'writeonly',
        mode: this.mode,
        emptyLabel: lang.noValueSet,
        idBtn: idBtn,
        idBtnLabel: this.options.labelId ? this.options.labelId : "",
        idValueDiv: idBtn + "ValueDiv",
        applyFlag: options.applyFlag,
        isReadOnly: this.mode === "readonly",
        validationErrorMsg: validationErrorMsg
      };
    },

    onRender: function () {
      this.alpacaField && this.alpacaField.setValue(this.model.get("data"));      
    },

    clickRadio: function(event){
      if (this.mode === "readonly") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      this.updateWriteField(event);
      var inputUnderRadioContainer = $(event.target).closest('.cs-radio-item-container').find(
          'input');
      inputUnderRadioContainer.trigger('click', function() {
        inputUnderRadioContainer.trigger('focus');
      });
      this.loadActiveRadioElement();
      this.trySetValue();
    },

    onSelectionChange: function (event) {
      if (this.mode === "readonly") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      this.loadActiveRadioElement();
      this.trySetValue();
    },

    updateWriteField: function(event) {
      if(this.ui.readField.has(event.target)) {
        this.ui.writeField.find('#w'+ $(event.target).closest('.cs-radio-item-container').find('input').attr('id').substring(1)).prop("checked", true);
      }
    },

    loadActiveRadioElement : function(){
      $(".cs-active-radio").removeClass('cs-active-radio');
      $(this.$el).find('input[type="radio"]').each(function(){
        if($(this).is(":focus")){
          $(this).parent().parent().parent().addClass("cs-active-radio");
        }
      });
    },

    trySetValue: function () {
      var editVal = this.getEditValue(),
        bIsValid = true,
        isReadyToSaveView = this.isReadyToSave();

      if (isReadyToSaveView) {
        bIsValid = this.setValue(editVal, true);
      }
      this._setSelection(editVal);
      this._updateSelection();
      var selectedModel = this.collection.where({id: this.model.get('data')});
      if (selectedModel.length>0) {
        this.ui.writeField.find('#w'+selectedModel[0].get('radioId')).prop("checked", true);
      }
      return bIsValid;
    },

    getEditValue: function () {
      if (this.$el.find('input:checked').length > 0) {
        var input = this.$el.find('input:checked').get(0).value;
        if (input && input !== '') {
          var selectedModel = _.find(this.collection.models, function (model) {
            if (model.id.toString() === input) {
              return model;
            }
          });
          var category = selectedModel.get('category'), erroneous = false;
          if (!erroneous) {
            erroneous = _.isString(category) && /Error/.test(category);
          }
          if (erroneous) {
            this.$el.find('.validation-error-message').removeClass('binf-hidden');
          } else {
            this.$el.find('.validation-error-message').addClass('binf-hidden');
          }
          return selectedModel.id;
        }
      }
      return this.getValue().id;
    },

    _setSelection: function (model) {
      var value;
      if (model instanceof Backbone.Model) {
        value = model.pick('id').id;
      } else {
        value = model;
      }
      this.options.model.attributes.data = value;
      this.model.set('data', value);
    },

    _updateSelection: function () {      
      var selectedModel = this.collection.where({id: this.model.get('data')});
      if (selectedModel.length > 0) {
        this.ui.readField.find('#r'+selectedModel[0].get('radioId')).prop("checked", true);
        this.options.hasValue = true;
      }
    },

    getDisplayValue: function () {
      var selectedModel = _.findWhere(this.collection.models, {id: this.model.get('data')});
      return selectedModel ? selectedModel.get('name') : '';
    },    

    serializeData: function () {
      return _.defaults({
        id: _.uniqueId(),
        name: this.getDisplayValue()
      }, this.model.toJSON());
    },

    _raiseValueChanged: function () {
      var data = {
        fieldvalue: this.getValue().get('data'),
        fieldid: this.options.dataId,
        fieldpath: this.options.path,
        targetfieldpath: this.options.path
      };
      this.trigger('field:changed', data);
      var event = $.Event('field:changed');
      _.extend(event, data);
      this.$el.trigger(event);
    },

    getOldValue: function () {
      return this.oldVal.get("data");
    },

    setValue: function (value, validate, silent) {
      var bIsValid = true;

      if (validate) {
        if (this.alpacaField) {
          bIsValid = this.alpacaField.setValueAndValidate(value, validate);
        }
      }
      if (bIsValid) {
        this.$el.removeClass('cs-formfield-invalid');
        if (value !== this.curVal) {
          this.curVal = value;
        }
        this.model.set('data', value, {silent: !!silent});
        this.$el.trigger($.Event('field:valid'),this);
      } else {
        this.$el.addClass('cs-formfield-invalid');
        var event = $.Event('field:invalid');
        this.$el.trigger(event);
      }
      return bIsValid;
    },

    getValue: function () {
      return this.model;
    },
    
    onFocusOutWriteArea: function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      $(".cs-active-radio").removeClass('cs-active-radio');
      this.getEditableBehavior().onFocusOutWrite(event);
    },
    
    focusElement: function(event){
      event.preventDefault();
      event.stopPropagation();
      $(".cs-active-radio").removeClass('cs-active-radio');
      $(event.target).parent().parent().parent().addClass("cs-active-radio");
    }

  });

  return RadioFieldView;

});
