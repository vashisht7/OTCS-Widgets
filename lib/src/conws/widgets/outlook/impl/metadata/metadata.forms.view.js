/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/lib/jsonpath',
  'csui/controls/tile/behaviors/blocking.behavior',
    
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/page/page.context',
  'csui/controls/form/fields/booleanfield.view',

  'conws/widgets/outlook/impl/metadata/impl/metadata.forms.factory',
  'conws/widgets/outlook/impl/metadata/form.item.view',
  'conws/widgets/outlook/impl/utils/utility',

  'i18n!conws/widgets/outlook/impl/nls/lang',
  'hbs!conws/widgets/outlook/impl/metadata/impl/metadata.forms'
], function (_, $, Marionette, Backbone, jsonPath, BlockingBehavior,
    PerfectScrollingBehavior, NodeModelFactory, PageContext, BooleanFieldView,  
    CreateFormsFactory, MetadataFormItemView, WkspUtil, lang, MetadataFormsTemplate) {

  var MetadataFormsView = Marionette.LayoutView.extend({
    className: "csui-custom-view-search", // Rely on custom view search widget styles to render the form, with minimum overwrites.

    templateHelpers: function () {
      var messages = {
        requiredFieldsTitle: lang.required_fields_title, 
        requiredFieldsSwitchTitle: lang.required_fields_switchLabel
      };
      return messages;
    },

    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".csui-saved-search-form",
        scrollYMarginOffset: 15
      }
    },
    regions: {
      requiredSwitchRegion: "#required-fields-switch"
    },

    constructor: function MetadataFormsView(options) {
      options = options || {};
      options.data || (options.data = {});
      this.context = options.context || (new PageContext());
      this.parentView = options.parentView;

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      
      options.container = this.context.getModel(NodeModelFactory, {attributes: {id: options.parentId }, connector: WkspUtil.getConnector()});
      options.node = this.context.getModel(NodeModelFactory, {attributes: {type: 144, docParentId: options.parentId}, connector: WkspUtil.getConnector()});
     
      this.model = this.context.getCollection(CreateFormsFactory, options);

      this.options.context = this.context;

      this.listenTo(this.model, "sync", this.renderForms);

      this.categoryChecked = false;
      this.hasRequired = false; // including all forms except the 'general' form
      this.requiredFormCount = 0;

      this.requiredFieldSwitchModel = new Backbone.Model({data: false});

      this.$el.on({
        "change input": _.bind(this._refreshDOM, this)
      });

      this.model.fetch();

    },

    _refreshDOM: function () {
      setTimeout(_.bind(function() {
        this.triggerMethod('dom:refresh');
      }, this), 500);
    },

    template: MetadataFormsTemplate,

    renderForms: function (e) {
      var self = this;
      if (self.model.length > 0){
          self.checkRequired(self.model.models);
          
          self.formViews = [];
          var formView;

          for(var i = 0; i < self.model.length; i++){
            var m = self.model.models[i];
            if (m.id === "general"){
              continue;
            } else if (m.get("role_name") === "categories"){
              if (self.hasRequired){
                formView = new MetadataFormItemView(_.extend(self.options, {model: m, hideNotRequired: false, hasRequiredField: m.attributes.hasRequiredField, requiredFormCount: self.requiredFormCount}));
                self.formViews.push(formView);
                self.appendView("view" + i, formView);
              }
            } else {
              if (m.attributes.hasRequiredField){
                formView = new MetadataFormItemView(_.extend(self.options, {model: m, hideNotRequired: false, hasRequiredField: true, requiredFormCount: self.requiredFormCount}));
                self.formViews.push(formView);
                self.appendView("view" + i, formView);
              }
            }
          }

          if (self.hasRequired){
            self.requiredFieldSwitchView = new BooleanFieldView({
              mode: 'writeonly',
              model: self.requiredFieldSwitchModel,
              labelId: 'requiredFieldsLabelId'
            }); 
            self.getRegion("requiredSwitchRegion").show(self.requiredFieldSwitchView);
            self.listenTo(self.requiredFieldSwitchView, 'field:changed', function (event) {
              self.toggleRequiredFields(event.fieldvalue);  
            });
          }

          self.parentView.metadataFormRetrieved = true;
          self.parentView.model.set("hasRequired", self.hasRequired);

          self.parentView.processMetadata();

      }
    },

    checkRequired: function(models){
      var self = this,
          categoryFormCount = 0;

      if (!self.categoryChecked){
        self.categoryChecked = true;
        for (var i = 0; i < models.length; i++){
          var m = models[i];
          if (m.id === "general"){
            continue;
          }
          if (m.get("role_name") === "categories"){
            categoryFormCount++;
          }

          m.attributes.hasRequiredField = false;
          var reqFields = jsonPath(m.attributes.schema.properties, "$..[?(@.required===true)]");
          if (_.isArray(reqFields) && reqFields.length > 0){
            self.hasRequired = true;
            m.attributes.hasRequiredField = true;
            if (m.get("role_name") !== "categories"){
              self.requiredFormCount++;
            }
          }
        }
        if (self.hasRequired){
          self.requiredFormCount = self.requiredFormCount + categoryFormCount; // we only care of it is > 1 or not.
        }
      }
    },

    toggleRequiredFields: function(hideNotRequired){
      _.each(this.formViews, function(view){
        view.switchToHide(hideNotRequired);
      })
    },

    getValuesToParent: function(e){
      var allValid = true,
          value = {roles: {categories:{}}};

      _.each(this.formViews, function(view){
        if (!view.formView.validate()){
          allValid = false;
          return;
        }
        var roleName = view.formView.model.get("role_name");
        if (roleName === "categories"){
          value.roles.categories[view.formView.model.id] = view.formView.getValues();
        } else {
          value.roles[roleName] = view.formView.getValues();
        }
      })
      if (allValid){
        this.parentView.metadataValue = value;
      }
      return allValid;
    },

    appendView: function(viewId, newView){
      var self = this;
      self.$el.append('<div id="view' + viewId + '">');
      self.addRegion('view' + viewId, '#view' + viewId);
      self['view' + viewId].show(newView);
    },

  });
  return MetadataFormsView;
});
