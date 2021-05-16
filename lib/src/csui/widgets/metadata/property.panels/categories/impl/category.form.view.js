/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'csui/utils/url', 'csui/utils/log', 'csui/controls/form/form.view',
  'csui/controls/globalmessage/globalmessage'
], function (module, _, $, base, Url, log, FormView, GlobalMessage) {
  'use strict';

  log = log(module.id);

  var CategoryFormView = FormView.extend({
    constructor: function CategoryFormView(options) {
      FormView.prototype.constructor.call(this, options);

      this.node = this.options.node;
      this.listenTo(this, 'change:field', this._saveField);
      this.listenTo(this, 'disable:active:item', this._disableItem);
    },

    onRequestProcessing: function (view) {
      this.propagatedView = view;
    },

    _disableItem: function (args) {
      this.options.metadataView && this.options.metadataView.trigger('disable:active:item');
    },

    _saveField: function (args) {
      if (this.mode === 'create') {
        return;
      }
      var values = this.getValues();
      this._saveChanges(values);
    },

    _saveChanges: function (changes) {
      if (!this.node) {
        throw new Error('Missing node to save the categories to.');
      }
      this.isDataUpdating = true;
      if (_.keys(changes).length) {
        if (this._validate(changes)) {
          this._removeInternalProperties(changes);
          this._blockActions();
          return this.node.connector
              .makeAjaxCall({
                type: 'PUT',
                url: Url.combine(this.node.urlBase(), 'categories', this.model.get('id')),
                data: changes
              })
              .done(_.bind(function (response) {
                this._updateMetadataToken(response);
                this.trigger('forms:sync');
                var event = $.Event('tab:content:field:changed');
                this.options.metadataView &&
                this.options.metadataView.trigger('enable:active:item');
                this.$el.trigger(event);
              }, this))
              .fail(_.bind(function (jqxhr) {
                var preValues = this.model.get('data');
                this.form.children.forEach(function (formField) {
                  formField.setValue(preValues[formField.propertyId]);
                  formField.refresh();
                });
                var error = new base.Error(jqxhr);
                GlobalMessage.showMessage('error', error.message);
                this.trigger('forms:error');
              }, this))
              .always(_.bind(function () {
                this.isDataUpdating = false;
                this.options.metadataView && this.options.metadataView.unblockActions();
                this.trigger("request:completed", this.propagatedView);
                this._unblockActions();
              }, this));
        }
        return $.Deferred().reject().promise();
      }
      return $.Deferred().resolve().promise();
    },
    _removeInternalProperties: function (categoryData) {
      var categoryId = this.model.get('id');
      var stateId = categoryId + '_1';
      var categorySchema = this.model.get('schema') || {};
      var stateSchema = categorySchema.properties && categorySchema.properties[stateId];
      if (stateSchema) {
        stateSchema = stateSchema.properties || (stateSchema.properties = {});
        var stateData = categoryData[stateId] || {};
        Object
          .keys(stateSchema)
          .forEach(function (propertyName) {
            if (propertyName === 'metadata_token') {
              log.debug('Metadata token "{1}" detected in the category "{0}".',
                  categoryId, stateData[propertyName]) && console.log(log.last);
            }
            if (stateSchema[propertyName].readonly) {
              delete stateData[propertyName];
            }
          });
      }
    },
    _updateMetadataToken: function (response) {
      var categoryId = this.model.get('id');
      var stateId = categoryId + '_1';
      var categorySchema = this.model.get('schema') || {};
      var stateSchema = categorySchema.properties && categorySchema.properties[stateId];
      if (stateSchema) {
        stateSchema = stateSchema.properties || (stateSchema.properties = {});
        if (stateSchema.metadata_token) {
          try {
            var metadataTokenValue = response.state.categories[0][categoryId].metadata_token;
            var metadataTokenField = this.form.childrenByPropertyId[stateId].childrenByPropertyId.metadata_token;
            metadataTokenField.setValue(metadataTokenValue);
            log.debug('Metadata token in the category "{0}" updated to "{1}".',
                categoryId, metadataTokenValue) && console.log(log.last);
          } catch (error) {
            log.warn('Updating metadata token the category "{0}" failed.',
                categoryId) && console.log(log.last);
          }
        }
      }
    }
  });

  return CategoryFormView;
});
