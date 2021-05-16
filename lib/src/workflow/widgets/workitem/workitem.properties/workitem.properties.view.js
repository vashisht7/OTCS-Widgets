/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/form/form.view',
  'csui/controls/globalmessage/globalmessage',
  'workflow/widgets/message/message.view',
  'workflow/widgets/workitem/workitem.properties/impl/workitem.instructions.view',
  'workflow/utils/workitem.extension.controller',
  'hbs!workflow/widgets/workitem/workitem.properties/impl/workitem.properties',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang',
  'i18n!workflow/widgets/workitem/workitem.properties/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.properties/impl/workitem.properties',
  'workflow/controls/form/fields/alpaca/alpcsuirealfield',
  'workflow/controls/form/fields/alpaca/alpcsuiitemreferencefield'
], function (_, Backbone, Marionette, $, log, LayoutViewEventsPropagationMixin,
    PerfectScrollingBehavior, FormView, GlobalMessage, MessageView,
    WorkItemInstructionsView, WorkItemExtensionController, template, lang, WorkItemPropertiesLang) {
  'use strict';
  var FormsView = Marionette.CollectionView.extend({
    childView: FormView,
    tagName: 'div',
    className: 'workflow-workitem-form',

    saveFormDeferred: [],

    childViewOptions: function (model, index) {
      var columns = model.get('Columns');
      var doubleCol = columns > 1 ? 'doubelCol' : 'singleCol';
      var options = _.extend({layoutMode: doubleCol}, this.options);
      return options;
    },

    onShow: function () {
      var that = this;
      var saveFormsList = [];
      this.options.node.set('saveFormsList', saveFormsList);
      this.saveFormDeferred = [];
      if (this.options.mode) {
        _.each(this.children._views, function (formView) {
          if ((that.options.mode === "create")) {
            that.listenTo(formView, 'change:field', that.refreshSameDefFields);
            that.listenTo(formView, 'render:form', that.onRenderedForm);
          } else {
            that.listenTo(formView, 'change:field', that._saveField);
            that.listenTo(formView, 'render:form', that.onRenderedForm);
          }
        });
      }
    },

    _addValidationErrorElement: function () {

      var views = this.children._views;
      views[Object.keys(views)[0]].$el.before('<div class="metadata-validation-error"></div>');
      this.validationErrorElem = $(this.$el.find('.metadata-validation-error')[0]);

      this.validationErrorElem.append(
          '<button class="icon notification_error cs-close-error-icon" title="' +
          WorkItemPropertiesLang.HideValidationErrorMessageIconTooltip +
          '" aria-label="' + WorkItemPropertiesLang.HideValidationErrorMessageIconTooltip +
          '" ></button>');
      this.validationErrorElem.append('<span class="validation-error-message">' +
                                      WorkItemPropertiesLang.FormValidationErrorMessage +
                                      '</span>');
      this.validationErrorElem.hide();

      var closeIcon = $(this.$el.find('.metadata-validation-error .cs-close-error-icon')[0]);
      closeIcon && closeIcon.on('click', _.bind(function (event) {
        event.preventDefault();
        event.stopPropagation();
        this._hideValidationError();
      }, this));

    },

    _validateForm: function () {
      var formValid = true, currentForm;
      _.each(this.children._views, function (formView) {
        var bValidateChildren = true;
        if (formView.form) {
          formView.form.refreshValidationState(bValidateChildren);
          currentForm = formView.form.isValid(bValidateChildren);
          formValid = formValid && currentForm;
        }
      });
      return formValid;
    },

    _saveForms: function () {

      var counter = 0;
      var workItemModel = this.options.node;
      this.saveFormDeferred.push([]);

      _.each(this.children._views, _.bind(function (formView) {
        var values = formView.form.getValue();
        if (_.keys(values).length) {
          var options = {
            action: "formUpdate",
            values: values
          };
          var formToSave = $.Deferred();
          var saveFormsList = workItemModel.get('saveFormsList');
          saveFormsList.push(formToSave.promise());
          workItemModel.set('saveFormsList', saveFormsList);

          counter++;
          this.saveFormDeferred.push([]);
          _.each(this.saveFormDeferred[counter - 1], _.bind(function (deferredObject) {
            this.saveFormDeferred[counter].push(deferredObject);
          }, this));
          this.saveFormDeferred[counter].push(formToSave);
          $.when.apply($, this.saveFormDeferred[counter - 1]).done(_.bind(function () {
            formView._blockActions();
            formView.model._saveChanges(options, formView)
                .done(_.bind(function () {
                  formToSave.resolve();
                }, this))
                .fail(_.bind(function (error) {
                  GlobalMessage.showMessage('error', error.message);
                  formView.trigger('forms:error');
                  formToSave.reject();
                }, this))
                .always(_.bind(function () {
                  formView._unblockActions();
                }, this));
          }, this));
        }
      }, this));
    },

    onRenderedForm:function () {
      this.triggerMethod('rendered:formsView');
    },

    _showValidationError: function () {

      if (this.validationErrorElem === undefined) {
        this._addValidationErrorElement();
      }
      if (this.$el.find('.alpaca-message-notOptional').length > 0) {
        this.validationErrorElem && this.validationErrorElem.show();
      } else {
        this.validationErrorElem && this.validationErrorElem.hide();
      }

    },

    _hideValidationError: function () {
      this.validationErrorElem && this.validationErrorElem.hide();
    },

    _clearValidationError: function () {
      if (this.validationErrorElem) {
        this.validationErrorElem.remove();
        delete this.validationErrorElem;
      }
    },

    _saveField: function (args) {

      this._showValidationError();

      var counter = this.saveFormDeferred.length;

      var formView = args.view;
      var views = this.children._views;
      var values = formView.form.getValue();

      if (_.keys(views).length > 1 ) {
        _.each(views, function(view) {
          if ( formView.cid !== view.cid ) {
            var formValues = view.form.getValue();
            var fieldNames = _.keys(formValues);
            if ( fieldNames.length ) {
              for (var i = 0; i < fieldNames.length; i++) {
                var fieldName = fieldNames[i];
                if (!_.has(values, fieldName)) {
                  values[fieldName] = formValues[fieldName];
                }
              }
            }
          }
        });
      }

      this.args = args;
      this.values = values;
      this.name = args.parentField ? args.parentField.name : args.name;

      if (_.keys(values).length) {
        if (formView._validate(values)) {
          var options = {
            action: "formUpdate",
            values: values
          };
          formView._blockActions();
          var formToSave = $.Deferred();
          var saveFormsList = this.options.node.get('saveFormsList');
          saveFormsList.push(formToSave.promise());
          this.options.node.set('saveFormsList', saveFormsList);

          if (counter === 0) {
            this.saveFormDeferred.push([]);
            counter++;
          }
          this.saveFormDeferred.push([]);
          _.each(this.saveFormDeferred[counter - 1], _.bind(function (deferredObject) {
            this.saveFormDeferred[counter].push(deferredObject);
          }, this));
          this.saveFormDeferred[counter].push(formToSave);
          $.when.apply($, this.saveFormDeferred[counter - 1]).done(_.bind(function () {
            args.model._saveChanges(options, formView).done(_.bind(function () {
                  formView.model.attributes.data[this.name] = this.values[this.name];
                  var draftProcess = false;
                  this.checkSameDefField(this.args, draftProcess);
                  formView.trigger('forms:sync');
                  var event = $.Event('tab:content:field:changed');
                  formView.$el.trigger(event);
                  formToSave.resolve();
                }, this))
                .fail(_.bind(function (error) {
                  GlobalMessage.showMessage('error', error.message);
                  formView.trigger('forms:error');
                  formToSave.reject();
                }, this))
                .always(_.bind(function () {
                  formView._unblockActions();
                }, this));
          }, this));

        }
      }

    },

    refreshSameDefFields: function (args) {
      var draftProcess = args.draftProcess ? args.draftProcess : true;
      this.checkSameDefField(args, draftProcess);
    },

    parseSection: function (model, obj) {

      var viewId    = this.children._indexByModel[model.cid],
          fieldView = this.children._views[viewId].form ?
                      this.children._views[viewId].form.childrenByPropertyId[obj.name] : "",
          formView  = this.children._views[viewId];

      if (fieldView) {
        if (fieldView.type === "array") {

          var fieldsArrayLength = fieldView.children.length,
              valueArrayLength  = obj.currentfieldValue.length,
              length            = 0;

          if (fieldsArrayLength !== valueArrayLength) {
            this.stopListening(formView, 'change:field');
            if (fieldsArrayLength > valueArrayLength) {

              for (length = valueArrayLength; length < fieldsArrayLength; length++) {
                fieldView.removeItem(0, function () {});
              }
            } else if (fieldsArrayLength < valueArrayLength) {
              for (length = fieldsArrayLength; length < valueArrayLength; length++) {
                var itemData    = "",
                    itemOptions = fieldView.children[0].options,
                    itemSchema  = fieldView.children[0].schema;
                fieldView.addItem(1, itemSchema, itemOptions, itemData, function () {});
              }
            }
            if ((this.options.mode === "create")) {
              this.listenTo(formView, 'change:field', this.refreshSameDefFields);
            } else {
              this.listenTo(formView, 'change:field', this._saveField);
            }
          }

          if (!obj.draftprocess) {
            fieldView._showItemsInReadMode();
          }

          _.each(fieldView.children, function (view, Index) {
            if (view.data !== obj.currentfieldValue[Index]) {
              view.setValueAndValidate(obj.currentfieldValue[Index], true);
              view.refresh();
            }
          });
        } else {
          fieldView.setValueAndValidate(obj.currentfieldValue, true);
          fieldView.refresh();
        }
      }
    },

    checkSameDefField: function (args, draftprocess) {
      var formView = args.view,
          that     = this,
          obj      = {};
      obj.values = args.view.form.getValue();
      obj.name = args.parentField ? args.parentField.name : args.name;
      obj.draftprocess = draftprocess;
      obj.currentfieldValue = obj.values[obj.name];
      _.each(formView.collection.models, function (model) {
        if (model !== formView.model && obj.name in model.attributes.data
            && model.attributes.data[obj.name] !== obj.currentfieldValue) {
          model.attributes.data[obj.name] = obj.currentfieldValue;
          that.parseSection(model, obj);
        } else if (model === formView.model && args.changePerformer) {
          var viewId    = that.children._indexByModel[model.cid],
              fieldView = that.children._views[viewId].form ?
                          that.children._views[viewId].form.childrenByPropertyId[obj.name] : "";
          if (fieldView) {
            fieldView.setValueAndValidate(obj.currentfieldValue, true);
            fieldView.refresh();
          }
        }
      });
    },
  });
  var WorkItemContentView = Marionette.LayoutView.extend({
    className: 'workflow-workitem-properties',
    template: template,
    constructor: function WorkItemContentView(options) {
      options || (options = {});

      this.context = options.context;
      this.parentView = options.parentView;
      this.extensions = options.extensions;

      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();
    },

    regions: {
      message: '.workitem-message',
      instructions: '.workitem-instructions',
      forms: '.workitem-forms',
      extension: '.workitem-extension'
    },

    ui: {
      selectMultiMap: '.workitem-multimap-select-message'
    },
    behaviors: {
      ScrollingProperties: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    onRender: function () {
      if (this.model) {
        var mapsList = this.model.get('mapsList');
        if (this.model.get('isDoc') === true && mapsList && mapsList.length !== 1) {
          this.ui.selectMultiMap.text(WorkItemPropertiesLang.multiMapSelectMessage);
          this.ui.selectMultiMap.css( "display", "block" );

        }
        var msg = this.model.get('message');
        this.model.attributes.id = this.model.get('process_id');
        if (msg) {
          this.message.show(new MessageView({
            connector: this.model.connector,
            model: new Backbone.Model({
              subject: msg.type,
              sender: msg.performer,
              text: msg.text
            })
          }));
        }
        this.instructions.show(new WorkItemInstructionsView({
          context: this.context,
          model: this.model
        }));

        var FormView = new FormsView({
          context: this.options.context,
          collection: this.model.forms,
          node: this.model,
          mode: (this.model.get('isDraft') || this.model.get('isDocDraft') ||
                 (mapsList && mapsList.length === 1 )) ?
                'create' : 'update'
        });
        this.listenTo(FormView, 'rendered:formsView', this.onRenderedFormsView);
        this.forms.show(FormView);
        this.listenTo(this.model, 'form:saveForms', function () {
          FormView._saveForms();
        });

        this.listenTo(this.model, 'form:isValid', function (workitem) {
          if (FormView._validateForm()) {
            workitem.validate = true;
            FormView._clearValidationError();
          } else {
            FormView._showValidationError();
          }
        });
        var dataPackages = this.model.get('data_packages');
        _.each(dataPackages, function (dataPackage) {
          var controller = _.find(this.extensions, function (ext) {
            return ext.validate(dataPackage.type, dataPackage.sub_type);
          });
          if (controller) {
            controller.execute({
              extensionPoint: WorkItemExtensionController.ExtensionPoints.AddForm,
              model: this.model,
              data: dataPackage.data,
              parentView: this //passing in the parent view
            }).done(_.bind(function (args) {
                  if (args) {
                    args.type = dataPackage.type;
                    args.sub_type = dataPackage.sub_type;
                    if (args.viewToShow) {
                      this.extension.show(args.viewToShow);
                    }
                  }
                }, this))
                .fail(_.bind(function (args) {
                  var errorMsg = lang.ErrorMessageLoadExtension;
                  if (args && args.errorMsg && args.errorMsg.length > 0 ) {
                    errorMsg = args.errorMsg;
                  }
                  GlobalMessage.showMessage('error', errorMsg);
                }, this));
          }

        }, this);
      } else {
        log.warn('Form view cannot displayed without data');
      }
    },

    onRenderedFormsView:function () {
      this.triggerMethod('dom:refresh');
    }
  });

  _.extend(WorkItemContentView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemContentView;

});
