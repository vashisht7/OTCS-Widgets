/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
  'csui/lib/underscore',
  'csui/lib/jquery',

  'csui/controls/form/form.view',
  'conws/widgets/outlook/impl/utils/utility',
  'hbs!conws/widgets/outlook/impl/metadata/impl/form.item'
], function (Marionette, _, $, FormView, WkspUtil, FormItemTemplate) {

  var MetadataFormItemView = Marionette.ItemView.extend({
    tag: 'div',
    className: "customsearch-attr-container",  // Rely on custom view search widget styles to render the form, with minimum overwrites. 

    events: {
      'click #toggleIcon': 'clickToggle',
      'keyup #toggleIcon': 'processKeyUp'
  },

    templateHelpers: function () {
      var roleName = this.model.get("role_name"),
          title = this.model.get("title"),
          id = this.model.get("id");

      return {
        title: roleName === "categories" ? title : id,
        toggleStatus: this.expended ? WkspUtil.ToggleStatusCollapse : WkspUtil.ToggleStatusExpand
      }
    },

    constructor: function MetadataFormItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model.on('error', this.errorHandle, this);
      this.options.hideNotRequired = options.hideNotRequired || false;
      this.expended = true;
    },

    template: FormItemTemplate,

    onRender: function (e) {
      var formItemRegion = new Marionette.Region({
            el: this.$el.find('.metadata-formitems')
          }),
          formView = new FormView({
            context: this.options.context,
            model: this.model,
            layoutMode: 'singleCol',
            mode: 'create',
            node: this.model.node,
            templateId: this.model.attributes.data.templateId
          });
    
      formItemRegion.show(formView);
      formView.hideNotRequired(this.options.hideNotRequired); 
      if (this.options.hideNotRequired && !this.options.hasRequiredField){
        this.$("#propertyTitle").addClass("hiddenArea");
      } else {
        this.$("#propertyTitle").removeClass("hiddenArea");
      }

      if (this.options.requiredFormCount === 1){
        this.$("#toggleIcon").css("display", "none");
      }
      this.formView = formView;
    },

    onRenderForm: function () {
      this.options.objectView.triggerMethod("render:form");
      return;
    },

    switchToHide: function(hide){
      this.formView.hideNotRequired(hide);
      if (hide && !this.options.hasRequiredField){
        this.$("#propertyTitle").addClass("hiddenArea");
      } else {
        this.$("#propertyTitle").removeClass("hiddenArea");
      }
    },

    clickToggle: function(e){
      this.$("#toggleIcon").toggleClass("sectionExpended");
      if (this.expended){
        this.$("#propertyForm").addClass("hiddenArea");
        this.expended = false;
      } else {
        this.$("#propertyForm").removeClass("hiddenArea");
        this.expended = true;
      }
    },

    processKeyUp: function(e){
      if (e.which === 13) {
          if (e.target.id === "toggleIcon"){
              this.clickToggle(e);
          }
      }
    },
  });

  return MetadataFormItemView;

});
