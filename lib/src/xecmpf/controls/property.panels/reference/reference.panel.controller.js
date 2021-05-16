/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/utils/log'
], function (require, _, $, Backbone, Marionette, Url, log
) {
  'use strict';

  function getReferencePanel(controller,mode,marker,attributes) {
    var deferred = $.Deferred();

    require([
      'xecmpf/controls/bosearch/bosearch.model',
      'xecmpf/controls/bosearch/bosearch.dialog.controller',
      'xecmpf/controls/property.panels/reference/impl/workspace.reference.model',
      'xecmpf/controls/property.panels/reference/impl/reference.panel.model',
      'xecmpf/controls/property.panels/reference/impl/reference.panel.view'
    ], function (
        BoSearchModel,
        BoSearchDialogController,
        WorkspaceReferenceModel,
        ReferencePanelModel,
        ReferencePanelView
    ) {
      var eventobject = {};
      controller.options.context.trigger("request:actioncontext",eventobject);
      var actionContext = _.extend(eventobject.actionContext||{},{mode: mode});
      controller.options.context.once("request:actioncontext",function(eventobject) {
        eventobject.actionContext = actionContext;
      });
      if (!actionContext.workspaceReference) {
        actionContext.workspaceReference = new WorkspaceReferenceModel(attributes, {
          node: controller.options.model
        });
      } else {
        actionContext.workspaceReference.node = controller.options.model;
        actionContext.workspaceReference.set(attributes);
      }

      var bo_ref = actionContext.workspaceReference,
          fetch = bo_ref.get("id") ? bo_ref.fetch() : $.Deferred().resolve().promise();
      fetch.then(function(){
        if (marker) {
          if(bo_ref.get("bo_type_id") != null) {
            marker.addClass("conws-reference-showing")
          } else {
            marker.removeClass("conws-reference-showing")
          }
        }

        if(bo_ref.get("bo_type_id") != null) {
          deferred.resolve([
            {
              model: new ReferencePanelModel(),
              contentView: ReferencePanelView,
              contentViewOptions: {
                actionContext: actionContext
              }
            }
          ]);
        } else {
          deferred.resolve([]);
        }
      },function(error){
        deferred.reject(error);
      });
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise();
  }

  var ReferencePanelController = Marionette.Controller.extend({

    constructor: function ReferencePanelController(options) {
      Marionette.Controller.prototype.constructor.apply(this, arguments);
    },

    getPropertyPanels: function (options) {

      var isWorkspace;
      isWorkspace = this.options && this.options.model && this.options.model.get("type")===848 &&
          !this.options.context.options.suppressReferencePanel;
      if (isWorkspace) {

        log.debug("getPropertyPanels for connected workspace called") && console.log(log.last);
        var mode = "workspace_reference_edit",
            marker = $(".cs-perspective-panel .cs-properties-wrapper .metadata-content .cs-metadata"),
            boattributes = {
              id: this.options.model.get("id"),
              bo_id: undefined,
              bo_type_id: undefined,
              bo_type_name: undefined,
              ext_system_id: undefined,
              ext_system_name: undefined
        };

        return getReferencePanel(this,mode,marker,boattributes);
      }

      return null;
    },

    getPropertyPanelsForCreate: function (options) {

      var generalData, isWorkspace;
      function disableClassificationsAdd(propertiesView,controller) {
        if (propertiesView) {
          controller.listenTo(propertiesView, 'before:render', function () {
            if (propertiesView.addPropertiesView) {
              if (!propertiesView.addPropertiesViewIsXecmRecreated) {
                propertiesView._createAddPropertiesView();
                propertiesView.addPropertiesViewIsXecmRecreated = true;
              }
            }
            if (propertiesView.addPropertiesView && propertiesView.addPropertiesView.collection) {
              if (!propertiesView.addPropertiesView.collection.hasXecmFilterModelsFunction) {
                var filtermodels = propertiesView.addPropertiesView.collection.filterModels;
                propertiesView.addPropertiesView.collection.filterModels = function(models) {
                  arguments[0] = _.filter(models,function(cm){
                    var sig = cm.get("signature");
                    return sig==="AddRMClassification" || sig==="AddCategory";
                  });
                  return filtermodels.apply(this,arguments);
                };
                propertiesView.addPropertiesView.collection.hasXecmFilterModelsFunction = true;
                propertiesView.addPropertiesView.collection.refilter();
              }
            }
          });
          controller.listenTo(propertiesView, 'render', function () {
            if (propertiesView.addPropertiesViewIsXecmRecreated) {
              delete propertiesView.addPropertiesViewIsXecmRecreated;
            }
          });
        }
      }
      if (options && options.forms && options.forms.models) {
        _.each(options.forms.models, function (form) {
          if (form.get('id') === 'general') {
            generalData = form.get('data');
            isWorkspace = generalData ? generalData.type===848 : false;
          }
        }, this);
      }
	  isWorkspace = isWorkspace &&
        !this.options.context.options.suppressReferencePanel;
      if (isWorkspace) {

        log.debug("getPropertyPanelsForCreate for connected workspace called") && console.log(log.last);
        if (generalData) {

          var mode = "workspace_reference_create",
              forms = options && options.forms,
              formCollection = forms && forms.formCollection,
              bo_id = formCollection && formCollection.bo_id,
              formOptions = formCollection && formCollection.options,
              addItemController = formOptions && formOptions.metadataAddItemController,
              dialog = addItemController && addItemController.dialog,
              marker = dialog && dialog.$(".binf-modal-content .binf-modal-body .cs-add-item-metadata-form"),
              boattributes = {
                id: undefined,
                bo_id:bo_id,
                bo_type_id: generalData.bo_type_id,
                bo_type_name: generalData.bo_type_name,
                ext_system_id: generalData.ext_system_id,
                ext_system_name: generalData.ext_system_name,
                change_reference:true,
                complete_reference:true
              },
              metadataView = addItemController && addItemController.metadataAddItemPropView,
              propertiesView = metadataView && metadataView.metadataPropertiesView;
          if (propertiesView) {
            disableClassificationsAdd(propertiesView,this);
          }

          return getReferencePanel(this,mode,marker,boattributes);

        }
      }

      return null;
    }
  });

  return ReferencePanelController;
});
