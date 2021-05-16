/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/utils/base', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/dialogs/modal.alert/modal.alert', 'csui/widgets/metadata/impl/metadata.utils',
  'csui/widgets/metadata/impl/add.properties/metadata.add.categories.view',
  'csui/models/appliedcategoryform', 'csui/dialogs/node.picker/node.picker',
  'csui/utils/commands', 'css!csui/widgets/metadata/impl/metadata'
], function (_, $, Backbone, Url, base, lang, ModalAlert,
    MetadataUtils, MetadataAddCategoriesView, AppliedCategoryFormModel,
    NodePicker, commands) {
  'use strict';

  function MetadataAddCategoriesController() {
  }

  _.extend(MetadataAddCategoriesController.prototype, Backbone.Events, {
    AddNewCategory: function (options) {
      var deferred = $.Deferred();
      var nodePicker = new NodePicker({
        startLocation: 'category.volume',
        context: options.context,
        selectableTypes: [131],
        unselectableNodes: !options.collection ? [] :
                           options.collection.where({role_name: "categories"}),
        selectMultiple: false,
        dialogTitle: lang.selectCategoryTitle,
        globalSearch: true,
        selectButtonLabel: lang.selectCategoryButtonLabel
      });
      nodePicker.show()
          .done(_.bind(function (args) {
            _.reduce(args.nodes, function (promise, node) {
                  return promise.then(_.bind(function () {
                    var catId = node.get('id');
                    var catName = node.get('name');
                    if (options.node.get('id') === undefined || options.action) {
                      return this._loadNewCategoryForm(options, catId, catName);
                    } else {
                      return this._displayAddCategoryForm(options, catId, catName);
                    }
                  }, this));
                }, $.Deferred().resolve(), this)
                .done(function (resp3) {
                  deferred.resolve(resp3);
                })
                .fail(function (error3) {
                  deferred.reject(error3);
                });
          }, this))
          .fail(function (error2) {
            deferred.reject(error2);
          });

      return deferred.promise();
    },
    _displayAddCategoryForm: function (options, catId, catName) {
      var deferred = $.Deferred();
      var self = this;
      this._getCategoryModel(options, catId, catName)
          .done(function (resp) {
            var formOptions = {
              model: options.node,
              context: options.context,
              commands: commands,
              catId: catId,
              catName: catName, catModel: resp.catModel
            };
            var metadataAddCatView = new MetadataAddCategoriesView();
            metadataAddCatView.displayForm(formOptions)
                .done(function (resp2) {
                  self._loadNewCategoryForm(options, catId, catName, "update")
                      .done(function (resp3) {
                        deferred.resolve(resp3);
                      })
                      .fail(function (error3) {
                        deferred.reject(error3);
                      });
                })
                .fail(function (error2) {
                  deferred.reject(error2);
                });
          })
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },
    _loadNewCategoryForm: function (options, catId, catName, formType) {
      if (catId && options.collection.get(catId)) {
        var title = lang.addNewCategoryFailTitle;
        var message = _.str.sformat(lang.categoryExistsMessage, catName);
        ModalAlert.showError(message, title);
        return $.Deferred().reject({});
      }

      var deferred = $.Deferred();
      this._getCategoryModel(options, catId, catName, formType)
          .done(_.bind(function (resp) {
            deferred.resolve(resp);
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });


      return deferred.promise();
    },
    _getCategoryModel: function (options, catId, catName, formType) {

      var allowDeleteCat = true;
      if (!formType) {
        formType = 'create';
        if (options.action === undefined) {
          allowDeleteCat = false;
        }
      }

      var deferred = $.Deferred();
      var fullUrl;
      var connector = (options.node && options.node.connector) ||
                      (options.container && options.container.connector);
      var nodeId = options.node.get('id');
      if (options.container) {
        options.node.pId = options.container.get('id');
      }
      if (options.node.get('id') === undefined && options.action === 'create') {
        fullUrl = Url.combine(connector.connection.url,
            'forms/nodes/create?parent_id=' + options.container.get('id') +
            '&type=' + options.node.get('type') + '&category_id=' + catId);
      } else if (options.action === 'copy' || options.action === 'move') {
        var inheritanceVal = 0;
        if (options.inheritance === 'destination') {
          inheritanceVal = 1;
        } else if (options.inheritance === 'merged') {
          inheritanceVal = 2;
        }
        fullUrl = Url.combine(connector.connection.url,
            'forms/nodes/' + options.action + '?id=' + nodeId +
            '&parent_id=' + options.container.get('id') +
            '&inheritance=' + inheritanceVal + '&category_id=' + catId);
      } else {
        fullUrl = Url.combine(connector.connection.url,
            'forms/nodes/categories/' + formType + '?id=' + nodeId +
            '&category_id=' + catId);
      }

      var ajaxOptions = {
        type: 'GET',
        url: fullUrl
      };
      if (options.parentView) {
        options.parentView.blockActions();
        options.parentView.trigger("update:button", true);
      }
      connector
          .makeAjaxCall(ajaxOptions)
          .done(_.bind(function (resp) {
            options.parentView && (options.parentView.unblockActions());
            var categoryForm, categoryData, categoryOptions, categorySchema;
            if (options.action === 'create' ||
                options.action === 'copy' || options.action === 'move') {
              if (resp.forms.length > 1) {
                categoryForm = _.find(resp.forms, function (form) {
                  return form.role_name === "categories";
                });
                if (categoryForm) {
                  categoryData = (categoryForm.data[catId]) || {};
                  categoryOptions = (categoryForm.options.fields[catId]) || {};
                  categorySchema = (categoryForm.schema.properties[catId]) || {};
                }
              }
            } else {
              categoryForm = resp && resp.forms && resp.forms[0];
              categoryData = (categoryForm && categoryForm.data) || {};
              categoryOptions = (categoryForm.options) || {};
              categorySchema = (categoryForm.schema) || {};
            }

            if (categoryForm) {
              if (categoryOptions.form) {
                categoryOptions = _.omit(categoryOptions, 'form');
              }
              if (categorySchema.title === undefined && catName) {
                categorySchema.title = catName;
              }

              var metadataUtils = new MetadataUtils();
              var required = metadataUtils.AlpacaFormOptionsSchemaHaveRequiredFields(categoryOptions,
                  categorySchema);

              var categoryModel = new AppliedCategoryFormModel({
                id: catId,
                title: catName || (categoryOptions && categoryOptions.fields && categoryOptions.fields.category_id &&
                                   categoryOptions.fields.category_id.label),
                allow_delete: allowDeleteCat,
                removeable: allowDeleteCat,
                required: required,
                data: categoryData,
                schema: _.omit(categorySchema, 'description'),
                options: categoryOptions,
                role_name: "categories"
              }, {
                node: options.node,
                categoryId: catId,
                action: 'none',
                parse: true
              });

              deferred.resolve({catModel: categoryModel});
            } else {
              deferred.reject({});
            }
          }, this))
          .fail(_.bind(function (error) {
            if (options.parentView) {
              options.parentView.unblockActions();
              options.parentView.trigger("update:button", false);
            }
            var serverError = this._getRespError(error);
            var title = lang.loadNewCategoryFailTitle;
            var message = _.str.sformat(lang.loadNewCategoryFailMessage,
                catName, options.node.get('name'), nodeId, serverError);
            ModalAlert.showError(message, title);
            deferred.reject(error);
          }, this));

      return deferred.promise();
    },
    _getRespError: function (resp) {
      var error = '';
      if (resp && resp.responseJSON && resp.responseJSON.error) {
        error = resp.responseJSON.error;
      } else if (base.MessageHelper.hasMessages()) {
        error = $(base.MessageHelper.toHtml()).text();
        base.MessageHelper.clear();
      }
      return error;
    }
  });

  _.extend(MetadataAddCategoriesController, {version: "1.0"});

  return MetadataAddCategoriesController;
});
