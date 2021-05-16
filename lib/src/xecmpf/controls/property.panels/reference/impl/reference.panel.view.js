/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/utils/log',
  'csui/controls/form/form.view',
  'csui/utils/base',
  'csui/dialogs/modal.alert/modal.alert',
  'xecmpf/controls/bosearch/bosearch.model',
  'xecmpf/controls/bosearch/bosearch.dialog.controller',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/globalmessage/globalmessage',
  'hbs!xecmpf/controls/property.panels/reference/impl/reference.panel',
  'hbs!xecmpf/controls/property.panels/reference/impl/reference.panel-initial',
  'hbs!xecmpf/controls/property.panels/reference/impl/reference.panel-replace',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang',
  'css!xecmpf/controls/property.panels/reference/impl/reference.panel'
], function (_, $, Backbone, Marionette, Alpaca, log, FormView,
    base, ModalAlert,
    BoSearchModel,
    BoSearchDialogController,
    TabableRegionBehavior, GlobalMessage, template, initialtmpl, replacetmpl, lang) {
  'use strict';

  var ReferenceInitialView = Marionette.ItemView.extend({

    className  : "conws-reference reference-initial",

    template   : initialtmpl,

    constructor: function ReferenceInitialView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      searchButton: '.binf-btn.search'
    },

    triggers: {
      "click .binf-btn.search": "referencetab:search"
    },

    templateHelpers: function () {
      var bo_ref = this.options.actionContext.workspaceReference,
          bo_type_name = bo_ref && bo_ref.get("bo_type_name"),
          ext_system_name = bo_ref && bo_ref.get("ext_system_name");
      return {
        search_button_label: _.str.sformat(lang.referenceSearchButtonLabel,bo_type_name,ext_system_name),
        search_button_title: lang.referenceSearchButtonTitle,
        complete_reference: bo_ref.get("complete_reference"),
        cannot_complete_business_reference: lang.cannotCompleteBusinessReference
      };
    }
  });

  var ReferenceReplaceView = Marionette.LayoutView.extend({

    className  : "conws-reference reference-replace",

    template   : replacetmpl,

    constructor: function ReferenceReplaceView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      replaceButton: '.binf-btn.replace'
    },

    triggers: {
      "click .binf-btn.remove" : "referencetab:remove",
      "click .binf-btn.replace": "referencetab:replace"
    },

    regions: {
      metadataRegion: '.conws-reference-metadata'
    },

    templateHelpers: function () {
      var bo_ref = this.options.actionContext.workspaceReference,
          bo_type_name = bo_ref && bo_ref.get("bo_type_name"),
          ext_system_name = bo_ref && bo_ref.get("ext_system_name");
      return {
        allow_remove_reference_from_create: this.options.actionContext.mode==="workspace_reference_create",
        allow_remove_reference_from_edit: this.options.actionContext.mode==="workspace_reference_edit",
        remove_button_title: lang.referenceRemoveButtonTitle,
        replace_button_title: lang.referenceReplaceButtonTitle,
        reference_buttons_label: _.str.sformat(lang.referenceSearchButtonLabel,bo_type_name,ext_system_name),
        change_reference: bo_ref.get("change_reference")
      };
    },

    onRender: function() {
      var formData, formOptions, formSchema;
      if (this.options.actionContext.mode==="workspace_reference_create") {
        formData = this.options.actionContext.workspaceReference.get("data") || {};
        formOptions = this.options.actionContext.workspaceReference.get("options") || {};
        formSchema = this.options.actionContext.workspaceReference.get("schema") || {};
      }
      if (this.options.actionContext.mode==="workspace_reference_edit") {
        formData = {BOID:this.options.actionContext.workspaceReference.get("bo_id")};
        formOptions = {
          fields: {
            BOID:{}
          }
        };
        formSchema = {
          properties: {
            BOID:{
              readonly: true,
              required: false,
              title: lang.businessObjectIdLabel,
              type: "string"
            }
          }
        };
      }
      if (formData && formOptions && formSchema) {
        this.formModel = new Backbone.Model({data:formData,options:formOptions,schema:formSchema});
        this.metdataForm = new FormView({model: this.formModel, context: this.options.context});
        this.metadataRegion.show(this.metdataForm);
      }
    }
  });

  var ReferencePanelView = Marionette.LayoutView.extend({

    className: 'conws-reference reference-panel cs-form cs-form-create',

    template: template,

    regions: {
      initialRegion: '.conws-reference-initial',
      replaceRegion: '.conws-reference-replace'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function ReferencePanelView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      if (this.options.actionContext.referencePanelView) {
        this.options.actionContext.referencePanelView.destroy();
      }
      this.options.actionContext.referencePanelView = this;

      var viewContext, anchor;
      if (this.options.mode==="create") {
        this.options.actionContext.mode = "workspace_reference_create";
        viewContext = this.options.metadataView;
        var forms = options && options.fetchedModels,
            formCollection = forms && forms.formCollection,
            formOptions = formCollection && formCollection.options,
            addItemController = formOptions && formOptions.metadataAddItemController,
            dialog = addItemController && addItemController.dialog;
        anchor = dialog && dialog.$(".binf-modal-content");
      } else if (this.options.mode==="update") {
        this.options.actionContext.mode = "workspace_reference_edit";
        if (this.options.metadataView && this.options.metadataView.options.metadataNavigationView) {
          viewContext = this.options.metadataView.options.metadataNavigationView;
        } else {
          viewContext = this.options.metadataView;
        }
          anchor = ".cs-metadata:has(> .metadata-content-wrapper)";
      }
      if (viewContext!==this.options.actionContext.viewContext) {
        delete this.options.actionContext.boSearchModel;
        delete this.options.actionContext.boSearchDialogController;
        this.options.actionContext.viewContext = viewContext;
      }

      var bo_ref = this.options.actionContext.workspaceReference;
      if (!this.options.actionContext.boSearchModel) {
        this.options.actionContext.boSearchModel = new BoSearchModel({
          bo_type_id: bo_ref.get("bo_type_id"),
          bo_type_name: bo_ref.get("bo_type_name"),
          row_id: bo_ref.get("row_id")
        });
      } else {
        this.options.actionContext.boSearchModel.set({
          bo_type_id: bo_ref.get("bo_type_id"),
          bo_type_name: bo_ref.get("bo_type_name"),
          row_id: bo_ref.get("row_id")
        });
      }

      if (!this.options.actionContext.boSearchDialogController) {
        this.options.actionContext.boSearchDialogController = new BoSearchDialogController({
          mode: this.options.actionContext.mode,
          context: this.options.context,
          htmlPlace: anchor,
          boSearchModel: this.options.actionContext.boSearchModel,
          disableItemsWithWorkspace: true
        });
      } else {
        this.options.actionContext.boSearchDialogController.options.mode = this.options.actionContext.mode;
        this.options.actionContext.boSearchDialogController.options.htmlPlace = anchor;
      }

      this.listenTo(this.options.actionContext.boSearchModel, "boresult:select", this._replaceReference);
      this.listenTo(this.options.actionContext.boSearchModel, "bosearch:cancel", this._cancelSearch );
      this.listenTo(this.options.actionContext.boSearchModel, "change:bo_type_name", _.bind(function(){
        this.options.actionContext.workspaceReference.set("by_type_name",this.options.actionContext.boSearchModel.get("bo_type_name"));
        this.render();
      },this));

      this.listenTo(this.options.actionContext.workspaceReference, "error", function(model, response, options) {
        var isRemoveError = (options && options.invoker && options.invoker === 'remove_bo_ref');
        var errmsg;
        if(isRemoveError) {
          errmsg = response && (new base.Error(response)).message || lang.errorRemovingWorkspaceReference;
          log.error("Removing the workspace reference failed: {0}", errmsg) && console.error(log.last);
        } else {
          errmsg = response && (new base.Error(response)).message || lang.errorUpdatingWorkspaceReference;
          log.error("Updating the workspace reference failed: {0}", errmsg) && console.error(log.last);
        }
        ModalAlert.showError(errmsg);
      });

      this.listenTo(options.originatingView, "render:forms",this._formsRendered);
      if (this.options.actionContext.mode==="workspace_reference_create") {
        this.options.actionContext.scrollToPanel = true;
        this.options.actionContext.focusButton = true;
      }
      this.listenTo(this.options.actionContext.boSearchModel, "boresult:select", function () {
        this.options.originatingView.blockActions && this.options.originatingView.blockActions();
        })
        .listenTo(this.options.actionContext.boSearchModel, "reference:selected", function () {
          this.options.originatingView.unblockActions && this.options.originatingView.unblockActions();
        })
        .listenTo(this.options.actionContext.boSearchModel, "reference:rejected", function () {
          this.options.originatingView.unblockActions && this.options.originatingView.unblockActions();
        });
    },

    onDestroy: function () {
      if (this===this.options.actionContext.referencePanelView) {
        delete this.options.actionContext.referencePanelView;
      }
    },

    templateHelpers: function () {
      return {
        title: lang.referenceTabTitle,
        override_note: lang.referencePanelOverrideNote,
        change_reference:this.options.actionContext.workspaceReference.get("change_reference")
      };
    },

    currentlyFocusedElement: function () {
      var el;
      if (this.options.actionContext.workspaceReference.get("bo_id")) {
        el = this.replaceView && this.replaceView.ui.replaceButton;
      } else {
        el = this.initialView && this.initialView.ui.searchButton;
      }
      if (el&&el.attr&&el.prop) {
        log.debug("currently focused element of {0} count {1} class {2}",this.cid,el?el.length:"no el",el.attr('class')) && console.log(log.last);
        return el;
      } else {
        return undefined;
      }
    },
    onRender: function () {
      if (this.options.actionContext.workspaceReference.get("bo_id")) {
        delete this.initialView;
        this.replaceView = new ReferenceReplaceView(this.options);
        this.listenTo(this.replaceView, "referencetab:remove", this._removeReference);
        this.listenTo(this.replaceView, "referencetab:replace", this._triggerSearch);
        this.replaceRegion.show(this.replaceView);
      } else {
        delete this.replaceView;
        this.initialView = new ReferenceInitialView(this.options);
        this.listenTo(this.initialView, "referencetab:search", this._triggerSearch);
        this.initialRegion.show(this.initialView);
      }
    },

    _triggerSearch : function() {
      log.debug("trigger reference:search") && console.log(log.last);
      this.options.actionContext.boSearchModel.trigger("reference:search");
    },

    _removeReference : function() {
      log.debug("clear reference") && console.log(log.last);
      if (this.options.actionContext.mode === "workspace_reference_create") {
        this._refetchForms({
          "data":undefined,
          "options":{},
          "schema":{},
          "bo_id":undefined,
          "row_id":undefined
        });
      } else if (this.options.actionContext.mode === "workspace_reference_edit") {
        var self = this;
        var deferred = $.Deferred();
        ModalAlert.confirmQuestion(_.str.sformat(lang.removeBOReferenceAlertDescription, this.options.actionContext.workspaceReference.get('bo_id')),
          lang.removeBOReferenceAlertTitle)
        .done(function (result) {
          var bo_ref = self.options.actionContext.workspaceReference;
          bo_ref.destroy({wait: true, invoker: 'remove_bo_ref'})
          .done(function (data, status) {
            GlobalMessage.showMessage('success', lang.removeBOReferenceSuccessMessage);
            self.options.actionContext.viewContext.triggerMethod("metadata:close");
            deferred.resolve();
          })
          .fail(function (data, status, error) {
            deferred.reject(data.responseJSON.error);
          });
          return deferred.promise();
        });
      }
    },

    _cancelSearch : function() {
      this._focusButton({cancelSearch:true});
    },

    _replaceReference : function(selectEventInfo) {
      log.debug("set reference") && console.log(log.last);
      if (selectEventInfo && selectEventInfo.selectedItems
          && selectEventInfo.selectedItems.length>0
          && selectEventInfo.selectedItems[0]) {
        var selectedObject = selectEventInfo.selectedItems[0];
        var formData = {},
            formFields = {},
            formProperties = {},
            collection = selectedObject.collection,
            columnDefinitions =  collection.columns,
            tableColumns = collection.tableColumns,
            sortedColumns = tableColumns.toArray().sort(function(a,b){return a.get("sequence")-b.get("sequence");});
        _.each(sortedColumns,function(tc){
          var key = tc.get("key"),
              col = columnDefinitions.get(key),
              name = col.get("fieldName");
          formData[name] = selectedObject.get(key);
          formFields[name] = {
          };
          formProperties[name] = {
            readonly: true,
            required: false,
            title: col.get("fieldLabel"),
            type: "string"
          };
        });
        this._refetchForms({
          "data":formData,
          "options":{fields:formFields},
          "schema":{properties:formProperties},
          "bo_id":selectedObject.get("businessObjectId"),
          "row_id":selectedObject.get("id")
        }, "select");
      } else {
        this.render();
        this.options.actionContext.boSearchModel.trigger("reference:selected");
        this._scrollToPanel();
        this._focusButton();
      }
    },

    _getAllValues: function () {

      var data = {},
          metadataView = this.options && this.options.metadataView;
      if (metadataView) {
        data = {
          "name": metadataView.metadataHeaderView.getNameValue(),
          "type": metadataView.options.model.get('type'),
          "parent_id": metadataView.options.model.get('parent_id')
        };
        var formsValues = metadataView.metadataPropertiesView.getFormsValues();
        _.extend(data, formsValues);
      }

      return data;
    },

    _refetchForms: function(attributes,mode) {
      var self = this,
          bo_ref = this.options.actionContext.workspaceReference,
          bo_id = attributes.bo_id,
          actionContext = this.options.actionContext,
          originatingView = this.options.originatingView,
          forms = this.options.fetchedModels;
      if (actionContext.mode==="workspace_reference_create") {
        var formCollection = forms.formCollection;
        if (bo_id) {
          formCollection.bo_type_id = bo_ref.get("bo_type_id");
          formCollection.bo_id = bo_id;
        } else {
          delete formCollection.bo_type_id;
          delete formCollection.bo_id;
        }
        formCollection.formsValues = this._getAllValues();
        formCollection.formsSchema = formCollection.serverForms;
        forms.fetch().then(function () {
              bo_ref.set(attributes);
              if (mode === "select") {
                originatingView.once("render:forms", function () {
                  self.options.actionContext.boSearchModel.trigger("reference:selected");
                });
              }
              actionContext.scrollToPanel = true;
              actionContext.focusButton = true;
            },
            function () {
              if (mode === "select") {
                self.options.actionContext.boSearchModel.trigger("reference:rejected");
              }
            }
        );
      } else if (actionContext.mode==="workspace_reference_edit") {
        var bo_id_old = bo_ref.get("bo_id"),
            node = this.options.node;
        bo_ref.set("bo_id", bo_id);
        bo_ref.save({}, {wait:true})
            .then(function() {
              node.fetch().then(function(){
                    forms.fetch().then(function(){
                          bo_ref.set(attributes);
                          if (mode==="select") {
                            originatingView.once("render:forms", function () {
                              self.options.actionContext.boSearchModel.trigger("reference:selected");
                            });
                          }
                          actionContext.scrollToPanel = true;
                          actionContext.focusButton = true;
                        },
                        function () {
                          bo_ref.set("bo_id",bo_id_old);
                          if (mode==="select") {
                            self.options.actionContext.boSearchModel.trigger("reference:rejected");
                          }
                        });
                  },
                  function () {
                    bo_ref.set("bo_id",bo_id_old);
                    if (mode==="select") {
                      self.options.actionContext.boSearchModel.trigger("reference:rejected");
                    }
                  });
            }, function() {
              bo_ref.set("bo_id",bo_id_old);
              if (mode==="select") {
                self.options.actionContext.boSearchModel.trigger("reference:rejected");
              }
            });
      } else {
        bo_ref.set(attributes);
        this.render();
        if (mode==="select") {
          self.options.actionContext.boSearchModel.trigger("reference:selected");
        }
        this._scrollToPanel();
        this._focusButton();
      }
    },
    _scrollToPanel: function() {
      var originatingView = this.options && this.options.originatingView,
          tabLinks = originatingView && originatingView.tabLinks;
      if (tabLinks) {
        var refLink;
        tabLinks.children.each(function (tabLink) {
          if (tabLink.model.id === "conws-reference") {
            refLink = tabLink;
          }
        });
        if (refLink) {
          refLink.activate();
        }
      }
    },
    _focusButton: function(eventOptions) {
      var metadataView = this.options && this.options.metadataView,
          headerView = metadataView && metadataView.metadataHeaderView,
          nameView = headerView && headerView.metadataItemNameView;
      if (!nameView || nameView.readonly || nameView.model && nameView.model.get("name") ||
          (eventOptions && eventOptions.cancelSearch)) {
        if (this.options.actionContext.workspaceReference.get("bo_id")) {
          var butn;
          if (this.replaceView) {
            butn = $(this.replaceView.ui.replaceButton);
            butn.trigger("focus");
          }
        } else {
          if (this.initialView) {
            butn = $(this.initialView.ui.searchButton);
            butn.trigger("focus");
          }
        }
        var originatingView = this.options.originatingView,
            href = originatingView.$el.find("div[id='conws-reference']");
        if (href && href.length > 0) {
          var hrefTop = href[0].offsetTop;
          if (butn && butn.length>0) {
            var butnTop = butn[0].offsetTop;
            var butnHeight = butn.height();
            var panelHeight = originatingView.tabContent.$el.height();
            if (butnTop+butnHeight>hrefTop+panelHeight) {
              var extraTopOffset = Math.max(originatingView.getOption('extraScrollTopOffset')||0,5);
              var scrollTop = butnTop + butnHeight - panelHeight + extraTopOffset;
              originatingView.tabContent.$el.animate({scrollTop:scrollTop},300);
            }
          }
        }
      } else {
        nameView.setEditModeFocus();
      }
    },

    _formsRendered: function() {
      if (this.options.actionContext.scrollToPanel) {
        delete this.options.actionContext.scrollToPanel;
        this._scrollToPanel();
      }
      if (this.options.actionContext.focusButton) {
        delete this.options.actionContext.focusButton;
        this._focusButton();
      }
    },

    validate: function () {
      return true;
    },

    getValues: function () {

      return {
        bo_id: this.options.actionContext.workspaceReference.get("bo_id"),
        bo_type_id: this.options.actionContext.workspaceReference.get("bo_type_id")
      };
    },

    hideNotRequired: function(hide) {
      return true;
    }

  });

  return ReferencePanelView;

});
