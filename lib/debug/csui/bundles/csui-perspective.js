csui.define('csui/perspective.manage/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/impl/nls/root/lang',{
  layoutTabTitle: 'Change page layout',
  widgetTabTitle: 'Add widget',
  expandTab: 'Expand tab',
  collapseTab: 'Collapse tab',
  noTitle: 'Title not available',
  goBackTooltip: 'Go back',
  templateMessage: 'Drag and Drop tile in position',
  changePageLayoutConfirmatonText: 'All your previously added and configured widgets will be lost!',
  proceedButton: 'Proceed',
  changeLayoutCancelButton: 'Cancel',
  FlowLayoutTitle: 'Flow layout',
  LcrLayoutTitle: 'Left center right layout',
  perspectiveSaveSuccess: 'Perspective has been updated successfully.',
  personalizationSaveSuccess: 'Changes saved successfully.',
  saveConfirmMsg: 'Please be aware this action will update all perspective overrides using this layout configuration. If you do not want this to happen, you should create a new perspective.',
  saveConfirmTitle: 'Save perspective',
  addWidget: 'Add widget',
  save: 'Save',
  close: 'Close',
  cancel: 'Cancel',
  reset: 'Reset',
  resetConfirmMsg: 'Page will be reset to default page configured by the administrator.',
  configNotSupported:"This widget cannot be configured with edit page.",
  resetSuccessful: 'Reset to original page was successful.'
});



/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/options.form.wrapper',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-pman-form-header\">\r\n    <div class=\"csui-pman-form-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-pman-form-description\">"
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"csui-pman-config-unsupported\">\r\n        <div class=\"csui-state\">\r\n            <span class=\"csui-state-icon csui-icon csui-icon-notification-error-white\"></span>\r\n        </div>\r\n        <div class=\"csui-error-message\">\r\n            <span>"
    + this.escapeExpression(((helper = (helper = helpers.configNotSupported || (depth0 != null ? depth0.configNotSupported : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"configNotSupported","hash":{}}) : helper)))
    + "</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"csui-pman-form-content cs-formview-wrapper\"></div>\r\n";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_options.form.wrapper', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/impl/options.form',[],function(){});
csui.define('csui/perspective.manage/impl/options.form.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/form/form.view',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'hbs!csui/perspective.manage/impl/options.form.wrapper',
  'csui/utils/perspective/perspective.util',
  'css!csui/perspective.manage/impl/options.form',
], function (_, $, Backbone, Marionette, Alpaca, LayoutViewEventsPropagationMixin,
    PerfectScrollingBehavior,
    FormView, lang, template, PerspectiveUtil) {

  var WidgetOptionsFormWrapperView = Marionette.LayoutView.extend({

    template: template,

    className: 'csui-pman-form-wrapper',

    regions: {
      bodyRegion: '.csui-pman-form-content'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        scrollYMarginOffset: 1
      }
    },

    templateHelpers: function () {
      return {
        title: this.options.manifest.title,
        description: this.options.manifest.description,
        configNotSupported: lang.configNotSupported
      }
    },

    ui: {
      unSupportedConfig: '.csui-pman-config-unsupported',
      description: '.csui-pman-form-description'
    },

    constructor: function WidgetOptionsFormHeaderView(options) {
      this.options = options || {};
      this.manifest = this.options.manifest;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _createForm: function (formModel) {
      this.widgetOptionsFormView = new WidgetOptionsFormView({
        context: this.options.context,
        model: formModel,
        mode: 'create'
      });

      this.listenToOnce(this.widgetOptionsFormView, 'render:form', function () {
        this.trigger('render:form');
      }.bind(this))

      this.listenTo(this.widgetOptionsFormView, 'change:field', function (field) {
        this.trigger('change:field', field);
      }.bind(this))
    },

    _hasSchema: function () {
      if (!this.manifest || !this.manifest.schema || !this.manifest.schema.properties ||
          _.isEmpty(this.manifest.schema.properties)) {
        // No configuration required for the widget
        return false;
      }
      return true;
    },

    refresh: function (callback) {
      if (!!this.widgetOptionsFormView) {
        this.widgetOptionsFormView.refresh(callback);
      } else {
        callback();
      }
    },

    onRender: function () {
      this.ui.unSupportedConfig.hide();
      var hasSchema = this._hasSchema();
      if (!hasSchema) {
        // No schema defined for widget
        this.trigger('render:form');
        return;
      }
      var formModel = this._prepareFormModel();
      this.hasValidSchema = WidgetOptionsFormWrapperView._normalizeOptions(
          formModel.attributes.schema.properties, formModel.attributes.options.fields,
          formModel.attributes.data);
      if (this.hasValidSchema) {
        this._createForm(formModel);
        this.bodyRegion.show(this.widgetOptionsFormView);
      } else {
        // Widget configuration schema has unsupported alpaca fields
        this.ui.description.hide();
        this.ui.unSupportedConfig.show();
        this.trigger('render:form');
      }
    },
    //To change the border color to red for non supported widgets.
    onPopoverShow: function (popover) {
      if (this._hasSchema() && !this.hasValidSchema) {
        popover.find('.binf-popover-content').addClass("invalid-options");
        popover.find('.binf-arrow').addClass("invalid-options");
      }
    },

    getValues: function () {
      if (!this._hasSchema()) {
        return undefined;
      }
      if (this.hasValidSchema) {
        return this.widgetOptionsFormView.getValues();
      } else {
        return this._getOptionsData();
      }
    },

    validate: function () {
      if (!this._hasSchema()) {
        return true;
      }
      // Widget configuration schema has unsupported alpaca fields
      if (!this.hasValidSchema) {
        var reqVal = true;
        //Has required fields
        //TODO to handle required fields of recursive schema
        if (PerspectiveUtil.hasRequiredFields(this.manifest)) {
          var data = this._getOptionsData();
          var reqFields = this.manifest.schema.required;
          _.each(reqFields, function (fieldName) {
            if (!data[fieldName]) {
              reqVal = false;
            }
          });
        }
        return reqVal;
      }
      // Widget configuration schema has supported alpaca fields
      return this.widgetOptionsFormView.validate();
    },

    _isPreviewWidget: function () {
      return this.options.widgetConfig.type ===
             'csui/perspective.manage/widgets/perspective.widget';
    },

    _prepareFormModel: function () {
      var data = this._getOptionsData();
      // Clone schema and options from manifest as they would change by form.view
      var schema      = JSON.parse(JSON.stringify(this.manifest.schema)),
          formOptions = JSON.parse(JSON.stringify(this.manifest.options || {}));
      if (!formOptions) {
        formOptions = {};
      }
      if (!formOptions.fields) {
        formOptions.fields = {};
      }
      this._addWidgetSizePropertyIfSupported(schema, formOptions, data);

      var model = new Backbone.Model({
        schema: schema,
        options: formOptions,
        data: data
      });
      return model;
    },

    //Common method to get widget config data
    _getOptionsData: function () {
      var data = this.options.widgetConfig.options || {};
      if (this._isPreviewWidget()) {
        // For widgets added using DnD, widget will be added as preview for original widget
        // Resolve original widget options from preview widget's options
        data = data.options || {};
      }
      return data;
    },

    /**
     * Add a new properties to form to change "Size" if widgets.
     * Size that can be configured depends on perspective's supported sizes as well as supported sizes of widget
     *
     */
    _addWidgetSizePropertyIfSupported: function (schema, options, data) {
      if (!this.options.perspectiveView.getSupportedWidgetSizes) {
        // Perspective view doesn't support configuring widget sizes
        return;
      }
      var supportedKinds = this.options.perspectiveView.getSupportedWidgetSizes(this.manifest,
          this.options.widgetView);
      if (!supportedKinds || supportedKinds.length === 0) {
        // No supported sizes found for widget
        return;
      }
      var kindSchema = {
        title: lang.widgetSizeTitle,
        description: lang.widgetSizeDescription,
        type: 'string',
        enum: _.map(supportedKinds, function (sk) {
          return sk.kind;
        })
      };
      var kindOption = {
        type: 'select',
        optionLabels: _.map(supportedKinds, function (sk) {
          return sk.label;
        }),
        removeDefaultNone: true
      };
      var selectedKind = _.find(supportedKinds, function (size) {return size.selected;});
      if (!!selectedKind) {
        data[WidgetOptionsFormWrapperView.widgetSizeProperty] = selectedKind.kind;
      }
      var sizeSchema = {};
      sizeSchema[WidgetOptionsFormWrapperView.widgetSizeProperty] = kindSchema;
      schema.properties = _.extend(sizeSchema, schema.properties);

      var sizeOptions = {};
      sizeOptions[WidgetOptionsFormWrapperView.widgetSizeProperty] = kindOption;
      options.fields = _.extend(sizeOptions, options.fields);

      schema.required = schema.required || [];
      schema.required.push(WidgetOptionsFormWrapperView.widgetSizeProperty);
    },

  }, {
    widgetSizeProperty: '__widgetSize',

    /**
     * NOTE: Duplicate of Alpaca.createFieldInstance since this code is not exposed as function
     */
    _resolveOptionsType: function (schema, data) {
      var type = schema.type;
      if (!type) {
        type = Alpaca.getSchemaType(data);
      }
      if (!type) {
        if (data && Alpaca.isArray(data)) {
          type = "array";
        }
        else {
          type = "object"; // fallback
        }
      }
      if (schema && schema["enum"]) {
        if (schema["enum"].length > 3) {
          return "select";
        } else {
          return "radio";
        }
      } else {
        return Alpaca.defaultSchemaFieldMapping[type];
      }
    },

    /**
     * Recursively fill options for all respective schemas
     */
    _normalizeOptions: function (schemaProperies, optionFields, data) {
      var hasValidTypes = true;
      _.each(schemaProperies, function (field, fieldId) {
        var fieldOpts = optionFields[fieldId];
        var fieldData = data[fieldId];
        if (!fieldOpts) {
          optionFields[fieldId] = fieldOpts = {}
        }

        var optType = fieldOpts.type;
        if (!optType && !!field.type) {
          // Options not defined.. So resolve option type from Alp JSON schema type
          optType = WidgetOptionsFormWrapperView._resolveOptionsType(field, fieldData);
        }

        if (!Alpaca.getFieldClass(optType)) {
          hasValidTypes = false;
        }

        switch (field.type) {
        case 'array':
          if (!fieldOpts.fields) {
            _.defaults(fieldOpts, {
              fields: {
                item: {}
              }
            });
          }
          if (!!fieldOpts.items) {
            fieldOpts.fields.item = fieldOpts.items;
          }
          if (field.items.type === 'object') {
            if (!!fieldOpts.fields.item.type && !Alpaca.getFieldClass(fieldOpts.fields.item.type)) {
              hasValidTypes = false;
            }
            fieldOpts.fields.item.fields || (fieldOpts.fields.item.fields = {});
            if (!fieldData || fieldData.length === 0) {
              data[fieldId] = fieldData = [{}];
            }
            var hasValidArrayType = WidgetOptionsFormWrapperView._normalizeOptions(
                field.items.properties, fieldOpts.fields.item.fields,
                fieldData[0]);
            if (!hasValidArrayType) {
              hasValidTypes = false;
            }
          }
          if (!fieldData) {
            data[fieldId] = [null];
          }
          break;
        case 'object':
          if (!fieldData) {
            data[fieldId] = fieldData = {};
          }
          if (!fieldOpts.fields) {
            fieldOpts.fields = {};
          }
          var hasValidObjectType = WidgetOptionsFormWrapperView._normalizeOptions(field.properties,
              fieldOpts.fields, fieldData);
          if (!hasValidObjectType) {
            hasValidTypes = false;
          }
          break;
        default:
          if (_.isUndefined(fieldData)) {
            // Consider default value specified in schema if set
            data[fieldId] = field.default || null;
          }
          break;
        }
      });
      return hasValidTypes;
    }
  });

  var WidgetOptionsFormView = FormView.extend({
    className: function () {
      var className = FormView.prototype.className.call(this);
      return className + ' perspective-widget-form';
    },
    constructor: function WidgetOptionsFormView(options) {
      FormView.apply(this, arguments);
    },

    refresh: function (callback) {
      this.form && this.form.refresh(callback);
    },

    _modifyModel: function () {
      FormView.prototype._modifyModel.apply(this, arguments);
      // Dont hide initial validation since there is an issue in alpaca with  alpaca.refresh()
      this.alpaca.options.hideInitValidationError = false;
    }
  });

  _.extend(WidgetOptionsFormView.prototype, LayoutViewEventsPropagationMixin);

  return WidgetOptionsFormWrapperView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/widget.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "        <div>\r\n          <div class=\"csui-widget-item icon-draggable-handle\"\r\n               title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.title : stack1), depth0))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depths[1] != null ? depths[1].draggable : depths[1]),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop})) != null ? stack1 : "")
    + ">\r\n            <span>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\r\n            <div class=\"csui-layout-icon "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.icon : stack1), depth0))
    + "\"></div>\r\n          </div>\r\n        </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return " draggable=\"true\"";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"csui-accordion-header\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "\">\r\n  <div class=\"csui-accordion-header-title\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\r\n  <div class=\"csui-button-icon cs-icon icon-expandArrowDown\"></div>\r\n  <div class=\"csui-button-icon cs-icon icon-expandArrowUp\"></div>\r\n</div>\r\n<div class=\"csui-accordion-content\">\r\n  <div class=\"cs-content csui-list-pannel\">\r\n    <div class=\"cs-list-group\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.widgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n  </div>\r\n</div>";
},"useDepths":true});
Handlebars.registerPartial('csui_perspective.manage_impl_widget.item', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/widget.drag.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-widget-template\">\r\n  <div class=\"csui-template-header\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</div>\r\n  <div class=\"csui-template-body\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.body : depth0), depth0))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_widget.drag.template', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/perspective.manage/impl/widget.list.view',['module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/perspective.manage/impl/options.form.view',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'csui/models/widget/widget.collection',
  'hbs!csui/perspective.manage/impl/widget.item',
  'hbs!csui/perspective.manage/impl/widget.drag.template'
], function (module, _, $, Backbone, Marionette, base, PerfectScrollingBehavior,
    WidgetOptionsFormView, Lang,
    WidgetCollection,
    WidgetItemTemplate, WidgetDragTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    dragImageOffsetTop: 50,
    dragImageOffsetLeft: 50,
  });

  var WidgetItemView = Marionette.ItemView.extend({

    constructor: function WidgetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    className: 'csui-module-group',

    template: WidgetItemTemplate,

    templateHelpers: function () {
      var widgetCollection = new Backbone.Collection(this.model.attributes.widgets);
      var dndContainer = $('.perspective-editing .csui-dnd-container');
      var draggable = dndContainer.length === 0;
      return {
        widgets: widgetCollection.models,
        draggable: draggable
      }
    },

    ui: {
      accordionHeader: '.csui-accordion-header',
      accordionContent: '.csui-accordion-content',
      accordionHeaderIcon: '.csui-accordion-header .cs-icon',
      widget: '.csui-widget-item'
    },

    events: {
      'click @ui.accordionHeader': "toggle",
      'dragstart @ui.widget': 'onDragStart',
      'dragend @ui.widget': 'onDragEnd'
    },

    toggle: function () {
      var isClosed = this.ui.accordionHeader.hasClass('csui-accordion-expand');
      this.ui.accordionHeader.toggleClass("csui-accordion-expand");
      this.options.parentView.$el.find(".csui-module-group").removeClass('csui-accordion-visible')
          .find('.csui-accordion-header').removeClass('csui-accordion-expand');
      if (!isClosed) {
        this.$el.addClass("csui-accordion-visible");
        this.ui.accordionHeader.addClass("csui-accordion-expand");
      }

      base.onTransitionEnd(this.ui.accordionContent, function () {
        this.trigger('widgets:expanded');
      }, this);
    },

    onRender: function () {
      var dndContainer = $('.perspective-editing .csui-dnd-container');
      if (dndContainer.length) {
        // Current perspective using sortable plugin for DnD. Get ready for it.
        this._makeWidgetSortable();
      } else {
        // Current perspective relaying on HTML5 DnD. Get ready with IE workarounds
        var hasDragDropNative = (typeof document.createElement("span").dragDrop === "function");
        if (!this._hasNativeDragImageSupport() && hasDragDropNative) {
          this.ui.widget.on("mousedown", this._handleDragImageForIE.bind(this));
        }
      }
    },

    _makeWidgetSortable: function () {
      var self = this;
      var widgetEls = this.$el.find('.csui-widget-item').parent();
      widgetEls.data('pman.widget', this.model.get('widgets'));
      widgetEls.sortable({
        connectWith: [".perspective-editing .csui-dnd-container",
          ".perspective-editing .pman-trash-area"],
        containment: ".perspective-editing ",
        helper: function (event, ui) {
          // Drag Image
          var widgetModel = ui.parent().index();
          self.widgetDragTemplate = new widgetDragTemplateView({
            title: self.model.get("widgets")[widgetModel].get('title'),
            newWidget: self.model.get("widgets")[widgetModel]
          });
          self.widgetDragTemplate.render();
          //Set width and height to prevent jquery ui overriding Drag item width and height
          self.widgetDragTemplate.$el.width('220px');
          self.widgetDragTemplate.$el.height('220px');
          self.widgetDragTemplate.$el.css({opacity: 0.75});
          self.widgetDragTemplate.$el.appendTo(
              self.options.parentView.$el.closest('.pman-pannel-wrapper'));
          return self.widgetDragTemplate.$el;
        },     
        tolerance: 'pointer',
        cursorAt: {top: config.dragImageOffsetTop, left: config.dragImageOffsetLeft},
        start: function (event, ui) {
          ui.item.css('display', 'block');
          ui.placeholder.css('display', 'block');
          self.dragStart();
        },
        stop: function () {
          self.dragEnd();
        }
      });
    },

    _handleDragImageForIE: function (e) {
      var originalEvent = e.originalEvent,
          $img          = $('.csui-template-wrapper').clone(),
          widget        = this.model.get("widgets")[$(e.currentTarget).parent().index()];
      $img.find(".csui-template-header").text(widget.get("title"));
      $img.css({
        "top": Math.max(0, originalEvent.pageY - config.dragImageOffsetTop) + "px",
        "left": Math.max(0, originalEvent.pageX - config.dragImageOffsetLeft) + "px",
        "position": "absolute",
        "pointerEvents": "none"
      }).appendTo(document.body);

      setTimeout(function () {
        $img.remove();
      });
      $img.on('dragstart', _.bind(function (event) {
        var widget       = this.model.get("widgets")[$(e.currentTarget).parent().index()],
            dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData("text", JSON.stringify(widget.toJSON()));
        this.dragStart();
      }, this));
      $img.on('dragend', _.bind(function (event) {
        this.dragEnd();
      }, this));
      $img[0].dragDrop();
    },

    onDragStart: function (event) {
      var widget       = this.model.get("widgets")[$(event.currentTarget).parent().index()],
          dataTransfer = event.originalEvent.dataTransfer;
      var template = $('.csui-template-wrapper');
      template.find(".csui-template-header").text(widget.get("title"));
      if (this._hasNativeDragImageSupport()) {
        dataTransfer.setData("text", JSON.stringify(widget.toJSON()));
        // IE11 doesn't support 'setDragImage'. See `_handleDragImageForIE` function for Drag Image handling in IE.
        dataTransfer.setDragImage(template[0], config.dragImageOffsetLeft,
            config.dragImageOffsetTop);
      }
      this.dragStart();
    },

    _hasNativeDragImageSupport: function () {
      var dataTransfer = window.DataTransfer || window.Clipboard;
      return ("setDragImage" in dataTransfer.prototype);
    },

    onDragEnd: function (event) {
      this.dragEnd();
    },

    dragStart: function () {
      this.$el.closest(".csui-pman-panel").addClass("csui-pman-drag-start");
      $(document.body).addClass('csui-pman-dnd-active');
    },

    dragEnd: function () {
      this.$el.closest(".csui-pman-panel").removeClass("csui-pman-drag-start");
      $(document.body).removeClass('csui-pman-dnd-active');
    }

  });

  var widgetDragTemplateView = Marionette.ItemView.extend({
    constructor: function WidgetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    className: 'csui-template-wrapper',

    template: WidgetDragTemplate,

    templateHelpers: function () {
      return {
        header: this.options && this.options.title,
        body: Lang.templateMessage

      }
    },
    onRender: function () {
      this.$el.data('pman.widget', this.options.newWidget);
    }
  });

  var WidgetListView = Marionette.ItemView.extend({
    tagName: 'div',

    template: WidgetItemTemplate,

    constructor: function WidgetListView(options) {
      options || (options = {});
      options.data || (options.data = {});

      Marionette.ItemView.call(this, options);

      var self = this;
      this.allWidgets = new WidgetCollection();
      this.allWidgets.fetch().done(function () {
        self.collection = self._groupWidgetsByModule();
        // self._sanitiseWidgetLibrary();
        self.render();
        self.trigger("items:fetched");
      });
    },

    initialize: function () {
      _.bindAll(this, "renderItem");
    },

    className: 'cs-module-list',

    render: function () {
      this.collection && this.collection.each(this.renderItem);
    },

    renderItem: function (model) {
      var parentView = this;
      var itemView = new WidgetItemView({model: model, parentView: parentView});
      itemView.render();
      this.listenTo(itemView, 'widgets:expanded', _.bind(this.trigger, this, 'dom:refresh', this));
      $(this.el).append(itemView.el);
    },

    _groupWidgetsByModule: function () {
      // creates a data model where widgets are grouped according to their module
      var moduleCollection = new Backbone.Collection();
      var widgets = this.allWidgets.filter(function (widget) {
        var manifest = widget.get('manifest');
        if (!manifest || !_.has(manifest, 'title') || !_.has(manifest, 'description') ||
            manifest.deprecated) {
          return false;
        }
        var schema        = JSON.parse(JSON.stringify(manifest.schema || {})),
            options       = JSON.parse(JSON.stringify(manifest.options || {})),
            isValidSchema = WidgetOptionsFormView._normalizeOptions(
                schema.properties, options.fields || {}, {});
        if (!isValidSchema) {
          // Found unknown properties.. hence widget unsupported.
          return false;
        }
        return true;
      });
      _.each(widgets, function (widget) {
        var manifest = widget.get('manifest')
        widget.set("title", (manifest && manifest.title) || Lang.noTitle);
      });

      _.each(_.groupBy(widgets, function (widget) {
        return widget.serverModule.id;
      }), function (val, key) {
        var title = _.first(val).serverModule.get('title');
        title = title ? title.replace(/OpenText /, '') : Lang.noTitle; // remove superfluous OpenText prefix
        moduleCollection.add({
          id: key,
          title: title,
          widgets: val
        })
      });
      return moduleCollection;
    },

    _sanitiseWidgetLibrary: function () {
      // checks to see if any widget groups or widgets have been whitelisted or blacklisted
      // alpha-sorts the groups and the widgets within them.
    },

    onInitWidgets: function () {
      this.$el.empty(); // FIXME Make this ItemView as CollectionView 
      this.render();
    },

  });

  return WidgetListView;

});


csui.define('csui/perspective.manage/impl/perspectivelayouts',[
    'csui/lib/underscore',
    'i18n!csui/perspective.manage/impl/nls/lang',
    // Load extra layout items to be added
    'csui-ext!perspective.manage/impl/perspectivelayouts'
], function(_, Lang, extraPerspectiveLayouts) {

    var perspectivelayouts = [
        {
            title: Lang.LcrLayoutTitle, 
            type: "left-center-right",
            icon: "csui-layout-lcr"
        },
        {
            title: Lang.FlowLayoutTitle, 
            type: "flow",
            icon: "csui-layout-flow"
        }
    ];

    if(extraPerspectiveLayouts) {
        perspectivelayouts = _.union(perspectivelayouts, extraPerspectiveLayouts);
    }

    return perspectivelayouts;
});

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/pman.panel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-tab-pannel\">\r\n  <div class=\"csui-layout-tab\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.layoutTabTitle : depth0), depth0))
    + "\">\r\n    "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.layoutTabTitle : depth0), depth0))
    + "\r\n  </div>\r\n  <div class=\"csui-AddWidget-tab\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.widgetTabTitle : depth0), depth0))
    + "\">\r\n    "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.widgetTabTitle : depth0), depth0))
    + "\r\n  </div>\r\n  <div class=\"csui-widget-tab\"></div>\r\n</div>\r\n<div class=\"csui-list-pannel\"></div>\r\n<div class=\"csui-template-overlay\"></div>\r\n<div class=\"csui-template-wrapper\">\r\n  <div class=\"csui-widget-template\">\r\n    <div class=\"csui-template-header\"></div>\r\n    <div class=\"csui-template-body\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.templateMessage : depth0), depth0))
    + "</div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_pman.panel', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/list.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.className : depth0), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "\"\r\n     draggable="
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.draggable : depth0), depth0))
    + ">\r\n  <span>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</span>\r\n  <div class=\"csui-layout-icon "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.iconClass : depth0), depth0))
    + "\"></div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_list.item', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"cs-header binf-panel-heading cs-header-with-go-back\" tabindex=\"0\" role=\"link\"\r\n     aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackAria || (depth0 != null ? depth0.goBackAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon circular arrow_back cs-go-back\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackTooltip || (depth0 != null ? depth0.goBackTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackTooltip","hash":{}}) : helper)))
    + "\"></span>\r\n</div>\r\n<div class=\"cs-content\">\r\n  <div class=\"cs-list-group\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_list', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/impl/pman.panel',[],function(){});
csui.define('csui/perspective.manage/impl/pman.panel.view',['require', 'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/underscore', 'csui/lib/marionette',
  "csui/controls/progressblocker/blocker",
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/perspective.manage/impl/widget.list.view',
  'csui/perspective.manage/impl/perspectivelayouts',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'hbs!csui/perspective.manage/impl/pman.panel',
  'hbs!csui/perspective.manage/impl/list.item',
  'hbs!csui/perspective.manage/impl/list',
  'hbs!csui/perspective.manage/impl/widget.drag.template',
  'css!csui/perspective.manage/impl/pman.panel'

], function (require, module, $, Backbone, _, Marionette, BlockerView, PerfectScrollingBehavior,
    WidgetListView, perspectiveLayouts, Lang, template, ListItemTemplate, ListTemplate,
    WidgetDragTemplate) {
  'use strict';

  var PManPanelView = Marionette.ItemView.extend({
    tagName: 'div',

    template: template,

    events: {
      'click @ui.layoutTab': "onTabClicked"
    },

    ui: {
      tabPannel: ".csui-tab-pannel",
      listPannel: ".csui-list-pannel",
      layoutTab: ".csui-layout-tab",
      widgetTab: ".csui-widget-tab",
      template: ".csui-widget-template"
    },

    className: 'csui-pman-panel',

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-tab-pannel',
        suppressScrollX: true,
        scrollYMarginOffset: 8
      }
    },

    templateHelpers: function () {
      return {
        layoutTabTitle: Lang.layoutTabTitle,
        widgetTabTitle: Lang.widgetTabTitle,
        templateMessage: Lang.templateMessage
      }
    },

    onPanelOpen: function () {
      this.accordionView.triggerMethod("init:widgets");
      this.trigger('ensure:scrollbar');
    },

    onRender: function () {
      this.ui.widgetTab.hide();
      this.ui.layoutTab.hide();
      this.accordionRegion = new Marionette.Region({
        el: this.ui.widgetTab
      });
      this.accordionView = new WidgetListView();
      this.accordionRegion.show(this.accordionView);
      this.blockActions();
      this.listenTo(this.accordionView, "items:fetched", function () {
        this.unblockActions();
        this.ui.layoutTab.show();
        this.ui.widgetTab.show();
      });
      this.listenTo(this.accordionView, "dom:refresh", function () {
        // Dom refresh to ensure perfect scrollbar
        this.trigger('dom:refresh');
      });
    },

    constructor: function PManPanelView(options) {
      this.options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      BlockerView.imbue(this);
      this.listenTo(this, 'reset:items', function () {
        this.listView && this.listView.destroy();
      });
    },

    onTabClicked: function (options) {
      var args = options.data ? options : {
        data: {
          items: perspectiveLayouts
        }
      };
      args.draggable = !!args.data.draggable;
      args.itemClassName = "csui-layout-item";
      args.pmanView = this.options.pmanView;

      this.ui.tabPannel.addClass("binf-hidden");
      this.listregion = new Marionette.Region({
        el: this.ui.listPannel
      });
      this.listView = new ListView(args);
      this.listregion.show(this.listView);

      // Register events on listview to handle back
      this.listenTo(this.listView, "before:destroy", function () {
        this.ui.tabPannel.removeClass("binf-hidden");
      }).listenTo(this.listView, "click:back", function () {
        this.listView.destroy();
      });
    },
  });

  var ListItemView = Marionette.ItemView.extend({
    constructor: function ListItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    template: ListItemTemplate,

    templateHelpers: function () {
      return {
        draggable: !!this.options.draggable,
        className: this.options.itemClassName,
        iconClass: this.model.get('icon')
      }
    },

    events: {
      'click .csui-layout-item:not(.binf-active)': _.debounce(function () {
        this.trigger('change:layout');
      }, 200, true)
    },

    onRender: function () {
      if (this.model.get('type') === this.options.pmanView.perspective.get('perspective').type) {
        this.trigger('set:active');
      }
    }

  });

  var ListView = Marionette.CompositeView.extend({

    constructor: function ListView(options) {
      options || (options = {});
      options.data || (options.data = {});

      // Provide the perfect scrollbar to every list view by default
      // (Behaviors cannot be inherited; add the PerfectScrolling
      //  to the local clone of the descendant's behaviors.)
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
        return behavior.behaviorClass === PerfectScrollingBehavior;
      }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.csui-pman-list',
            suppressScrollX: true,
            // like bottom padding of container, otherwise scrollbar is shown always
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.call(this, options);

      // TODO: Deprecate this, or fix it, so that a collection can be created
      // without breaking the client
      // Passing a collection without knowing its model schema and identifier
      // is not possible in Backbone, where the collections should be indexed
      if (this.options.data && this.options.data.items) {
        if (!this.collection) {
          var ViewCollection = Backbone.Collection.extend({
            model: Backbone.Model.extend({
              idAttribute: null
            })
          });
          this.collection = new ViewCollection();
        }
        this.collection.add(this.options.data.items);
      }
    },

    ui: {
      back: '.cs-go-back'
    },
    className: 'csui-pman-list',

    events: {
      'click @ui.back': 'onClickBack'
    },

    childEvents: {
      'change:layout': 'onChangeLayout',
      'set:active': 'setActive'
    },

    template: ListTemplate,

    templateHelpers: function () {
      return {
        goBackTooltip: Lang.goBackTooltip
      };
    },

    childViewContainer: '.cs-list-group',

    childView: ListItemView,

    childViewOptions: function () {
      return this.options;
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger('click:back');
    },

    setActive: function (childView) {
      this.$el.find('.csui-layout-item').removeClass('binf-active');
      childView.$el.find('.csui-layout-item').addClass('binf-active');
    },

    onChangeLayout: function (childView) {
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlertView) {
        ModalAlertView.confirmWarning(Lang.changePageLayoutConfirmatonText, Lang.layoutTabTitle,
            {
              buttons: {
                showYes: true,
                labelYes: Lang.proceedButton,
                showNo: true,
                labelNo: Lang.changeLayoutCancelButton
              }
            })
            .done(function (labelYes) {
              if (labelYes) {
                self.setActive(childView);
                self.options.pmanView.trigger("change:layout", childView.model.get('type'));
              }
            });
      });
    }

  });

  return PManPanelView;
});



/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/impl/pman',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "        <li>\r\n          <button class=\"binf-btn icon-reset\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.reset : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.reset : depth0), depth0))
    + "</button>\r\n        </li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"pman-backdrop\"></div>\r\n<div class=\"pman-header\">\r\n  <div class=\"pman-header-backdrop\"></div>\r\n  <div class=\"pman-tools-container\">\r\n    <div class=\"pman-left-tools\">\r\n      <ul>\r\n        <li class=\"pman-toolitem\">\r\n          <button class=\"icon icon-toolbarAdd\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.addWidget : depth0), depth0))
    + "\"></button>\r\n        </li>\r\n      </ul>\r\n      <div class=\"pman-pannel-wrapper\"></div>\r\n    </div>\r\n    <div class=\"pman-right-tools\">\r\n      <ul>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.personalizeMode : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <li>\r\n          <button class=\"binf-btn icon-save\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.save : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.save : depth0), depth0))
    + "</button>\r\n        </li>\r\n        <li>\r\n          <button class=\"binf-btn cancel-edit\" title=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.cancel : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.cancel : depth0), depth0))
    + "</button>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  <div class=\"pman-trash-area\">\r\n    <div class=\"pman-trash-banner\"></div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_impl_pman', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/impl/pman',[],function(){});
csui.define('csui/perspective.manage/behaviours/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/behaviours/impl/nls/root/lang',{
  deleteConfirmMsg: 'Widget will be removed from the page.',
  deleteConfirmTitle: 'Remove Widget',
  replaceConfirmMsg: 'Do you want to replace this widget?',
  replaceConfirmTitle: 'Replace Widget',
  widgetSizeTitle: 'Widget size',
  widgetSizeDescription: 'Determines how much space the widget occupies. Note that widgets are re-sized automatically to display optimally on smaller screens.',
  removeWidget: 'Remove widget',
  replace: 'Replace',
  remove: 'Remove',
  cancel: 'Cancel',
  configNeeded: 'Configuration needed.',
  hideWidget: 'Hide',
  showWidget: 'Display'
});



/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/behaviours/impl/widget.masking',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"csui-pman-widget-error\">\r\n      <div class=\"csui-pman-widget-error-heading\"> "
    + this.escapeExpression(((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetTitle","hash":{}}) : helper)))
    + "</div>\r\n      <div class=\"csui-pman-widget-error-body\">\r\n        <div class=\"csui-pman-widget-error-icon\"></div>\r\n        <div class=\"csui-pman-widget-error-message\"> "
    + this.escapeExpression(((helper = (helper = helpers.configNeeded || (depth0 != null ? depth0.configNeeded : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"configNeeded","hash":{}}) : helper)))
    + "</div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-pman-widget-close clear-icon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeWidget || (depth0 != null ? depth0.removeWidget : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeWidget","hash":{}}) : helper)))
    + "\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"csui-pman-widget-personalize-mask\">\r\n      <button class=\"binf-btn csui-pman-personalize-btn csui-pman-hide-widget\"\r\n              title=\""
    + this.escapeExpression(((helper = (helper = helpers.hideWidget || (depth0 != null ? depth0.hideWidget : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideWidget","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.hideWidget || (depth0 != null ? depth0.hideWidget : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hideWidget","hash":{}}) : helper)))
    + "</button>\r\n      <button class=\"binf-btn csui-pman-personalize-btn csui-pman-show-widget\"\r\n              title=\""
    + this.escapeExpression(((helper = (helper = helpers.showWidget || (depth0 != null ? depth0.showWidget : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showWidget","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.showWidget || (depth0 != null ? depth0.showWidget : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showWidget","hash":{}}) : helper)))
    + "</button>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-pman-widget-masking\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isEditMode : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "</div>\r\n<div class=\"csui-pman-popover-right csui-pman-popover-holder\"></div>\r\n<div class=\"csui-pman-popover-left csui-pman-popover-holder\"></div>\r\n";
}});
Handlebars.registerPartial('csui_perspective.manage_behaviours_impl_widget.masking', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/behaviours/impl/widget.masking',[],function(){});
/**
 * Responsibilities:
 *  - Masking the unit level widget of perpsective. In case of grid.view, it will be cell
 *  - Listen and handle DnD of widgets and act accordingly - replace widgets
 *  - Fire "replace:widget" on dropping of any widget
 *  - Deleting a widget from perspective
 *  - Configuration of widget using callouts
 *
 * Usage:
 *  - Should be applied to widgets of perspective to be able to configure them
 *
 * Required Inputs:
 *  - perspectiveView
 *  - widgetView
 *
 * Events:
 *  - replace:widget
 *    - Fires on perspectiveView
 *    - When dropping any widget from tools on perpsective widget
 *  - delete:widget
 *    - Fires on perspectiveView
 *    - When deleting a perspective widget
 *  - update:widget:size
 *    - Firex Fires on perspectiveView
 *    - When change in size of widget
 *  - update:widget:config
 *    - Firex Fires on perspectiveView
 *    - When widget configuration options updated
 */
csui.define('csui/perspective.manage/behaviours/pman.widget.config.behaviour',['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/base', 'csui/lib/backbone', 'csui/utils/log',
  'csui/models/widget/widget.model',
  'csui/perspective.manage/impl/options.form.view',
  'i18n!csui/perspective.manage/behaviours/impl/nls/lang',
  'hbs!csui/perspective.manage/behaviours/impl/widget.masking',
  'csui/utils/perspective/perspective.util',
  'css!csui/perspective.manage/behaviours/impl/widget.masking',
], function (require, i18n, _, $, Marionette, base, Backbone, log, WidgetModel,
    WidgetOptionsFormView, lang, maskingTemplate, PerspectiveUtil) {
  'use strict';

  var DEFAULTS = {
    removeConfirmMsg: lang.deleteConfirmMsg,
    removeConfirmTitle: lang.deleteConfirmTitle,
    configNeededMessage: lang.configNeeded,
    confirmOnRemove: true,
    allowReplace: true,
    notifyUpdatesImmediatly: false,
    perspectiveMode: 'edit'
  };

  /**
   * View to mask the perspective widget and handles the widget configuration
   */
  var WidgetMaskingView = Marionette.ItemView.extend({
    template: maskingTemplate,
    className: function () {
      var classNames  = [WidgetMaskingView.className],
          isHidden    = PerspectiveUtil.isHiddenWidget(this.options.widgetConfig),
          widgetState = isHidden ? 'hidden' : 'shown';
      classNames.push('csui-pman-widget-mode-' + this.options.perspectiveMode);
      classNames.push('csui-pman-widget-state-' + widgetState);
      return _.unique(classNames).join(' ');
    },

    templateHelpers: function () {
      return {
        removeWidget: this.options.removeConfirmTitle,
        widgetTitle: this.manifest && this.manifest.title,
        configNeeded: this.options.configNeededMessage,
        isEditMode: this.isEditPage(),
        hideWidget: lang.hideWidget,
        showWidget: lang.showWidget
      }
    },

    ui: {
      delete: '.csui-pman-widget-close',
      masking: '.csui-pman-widget-masking',
      widgetTitle: '.csui-pman-widget-error-heading',
      hideWidgetBtn: '.csui-pman-hide-widget',
      showWidgetBtn: '.csui-pman-show-widget',
    },

    configureEvents: {
      'click @ui.masking': '_showCallout',
      'click @ui.delete': 'onDeleteClick',
    },

    events: function () {
      var evts = {};
      switch (this.options.perspectiveMode) {
      case 'edit':
        evts = _.extend(evts, this.configureEvents);
        if (!!this.options.allowReplace) {
          evts = _.extend(evts, {
            'drop': 'onDrop',
            'dragover': 'onDragOver',
            'dragenter': 'onDragEnter',
            'dragleave': 'onDragLeave'
          });
        }
        break;
      case 'personalize':
        evts = _.extend(evts, {
          'click @ui.hideWidgetBtn': '_onHideWidget',
          'click @ui.showWidgetBtn': '_onShowWidget',
        });
        if (this.options.personalizable) {
          evts = _.extend(evts, this.configureEvents);
        }
        break;
      }
      return evts;
    },

    constructor: function WidgetMaskingView(options) {
      options = _.defaults(options, DEFAULTS);
      Marionette.ItemView.apply(this, arguments);
      this.dropCounter = 0;
      this.manifest = options.manifest;
      this.perspectiveView = options.perspectiveView;
      this.widgetView = options.widgetView;
      this.widgetConfig = options.widgetConfig;
      this.perspectiveMode = options.perspectiveMode;
      this.listenTo(this.widgetView, 'refresh:mask', this._doRefreshMask);
      this.listenTo(this.widgetView, 'reposition:flyout', function () {
        if (!!this.$popoverEl && this.$popoverEl.data('binf.popover')) {
          this.$popoverEl.binf_popover('show');
        }
      });
    },

    _isConfigurable: function () {
      return !!this.widgetConfig && !_.isEmpty(this.widgetConfig) &&
             this.widgetConfig.type !== WidgetMaskingView.placeholderWidget &&
             this.widgetConfig.type !== 'csui/widgets/error';
    },

    isEditPage: function () {
      return this.perspectiveMode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE;
    },

    onRender: function () {
      if (!this._isConfigurable()) {
        // Widget configuration not found. Hence cannot show callout
        return;
      }
      var self = this;
      this._loadManifest().done(function (manifest) {
        self.ui.widgetTitle.text(manifest.title);
        if (self.manifest.selfConfigurable) {
          self._adoptToSelfConfigurableWidget();
        } else if (self.isEditPage() || self.options.personalizable) {
          self._createOptionsForm(function () {
            if (this.isDestroyed) {
              // Masking destroyed even before form render. No action required.
              return;
            }
            var openCallout = !!self.widgetConfig.options &&
                              (self.widgetConfig.options.___pman_isdropped ||
                               self.widgetConfig.options.___pman_opencallout);
            var isWidgetReplaced = self._updateWidgetOptions(false, true);
            // Refresh form to remove validation error messages created by default validation (above statement)
            self.optionsFormView.refresh(function () {
              self.$el.addClass('cs-pman-callout-ready');
              self.$el.addClass('cs-pman-config-ready');
              if (openCallout && !isWidgetReplaced) {
                self._showOptionsCallout(manifest, true);
              }
            });
          });
        } else {
          self.$el.addClass('cs-pman-config-ready');
        }
      });
    },

    onDestroy: function () {
      this.optionsFormView && this.optionsFormView.destroy();
    },

    _adoptToSelfConfigurableWidget: function () {
      if (!PerspectiveUtil.isEmptyPlaceholder(this.widgetConfig, this.perspectiveMode)
          && this.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE &&
          !PerspectiveUtil.isPersonalWidget(this.widgetConfig)) {
        // Though this widget self configurable, only personal widget can be configured in "Personalize Page".
        return;
      }
      this.$el.addClass('csui-has-editing-capability');
      delete this.widgetConfig.options.___pman_isdropped;
      this.listenTo(this.widgetView, 'update:widget:options', function (options) {
        delete this.widgetConfig.options.___pman_isdropped;
        this._notifyConfigChanges(options, options.isValid, false);
      });
      this.listenTo(this.widgetView, 'remove:widget', this._doDeleteWidget);
      this.listenTo(this.widgetView, 'replace:widget', this.onDrop);
    },

    // Instead of re-rendering the whole mask, which would close flyout, just update DOM manually with titles, text changes etc.,
    _doRefreshMask: function (options) {
      this.options = _.extend({}, this.options, DEFAULTS, options);
      this.ui.delete.attr("title", this.options.removeConfirmTitle);
    },

    _showCallout: function (event) {
      if (this.isDestroyed) {
        return;
      }
      if (!this._isConfigurable()) {
        // Widget configuration not found. Hence cannot show callout
        return;
      }
      // To prevent default click action and open fly out
      event.preventDefault();
      event.stopPropagation();
      if (!!this.ui.delete.is(event.target)) {
        // avoid showing popover on click of remove widget icon
        return;
      }
      // open widget configuration callout
      this._loadManifest().done(function (manifest) {
        this._showOptionsCallout(manifest);
      }.bind(this));
    },

    _showOptionsCallout: function (manifest, forceShow) {
      if (this.isDestroyed) {
        return;
      }
      //To resolve LPAD-73913 defect.
      if (base.isIE11() && !!document.activeElement) {
        document.activeElement.blur();
      }
      if (!!this.$popoverEl && this.$popoverEl.data('binf.popover')) {
        // Currently showing popover. Close it.
        this.$popoverEl.binf_popover('destroy');
        return;
      }
      if (this.$el.closest(".cs-perspective").find(".binf-popover").length) {
        this._closePopover();
        if (!forceShow) {
          // Callee asked to show flyout, hence, continue showing it. Dont return.
          return;
        }
      }
      this._calculatePopoverPlacement();

      if (!!this.optionsFormView) {
        // Toggle. Open popover with existing form.view
        this._showPopover();
      } else {
        this._createOptionsForm();
      }
    },

    _closePopover: function () {
      this.$el.closest(".cs-perspective").find('.' + WidgetMaskingView.className +
                                               ' .csui-pman-popover-holder').binf_popover(
          'destroy');
    },

    _createOptionsForm: function (afterRenderCallback) {
      this.optionsFormView = new WidgetOptionsFormView(_.defaults({
        context: this.perspectiveView.options.context,
        manifest: this.manifest
      }, this.options));
      if (!!afterRenderCallback) {
        this.optionsFormView.listenToOnce(this.optionsFormView, 'render:form', afterRenderCallback);
      }
      this.optionsFormView.render();
      this.optionsFormView.listenTo(this.optionsFormView, 'change:field',
          this._onChangeField.bind(this));
    },

    _calculatePopoverPlacement: function () {
      var adjust = this._determineCalloutPlacement();
      this.$popoverEl = this.$el.find('.csui-pman-popover-' + adjust.placement);
      if (adjust.mirror) {
        adjust.placement = adjust.placement == 'right' ? 'left' : 'right';
      }
      this.placement = adjust.placement;
      this.$popoverContainer = $(
          '<div class="binf-popover pman-widget-popover pman-ms-popover" role="tooltip"><div class="binf-arrow"></div><h3 class="binf-popover-title"></h3><div class="binf-popover-content"></div></div>');
      this.$popoverContainer.css("max-width", adjust.availableSpace + "px");
    },

    /**
     * Determite callout position and show widget configuration callout
     */
    _showPopover: function () {
      var popoverOptions = {
        html: true,
        content: this.optionsFormView.el,
        trigger: 'manual',
        viewport: { // Limit popover placement to perspective panel only
          selector: this.options.perspectiveSelector,
          padding: 15
        },
        placement: this.placement,
        template: this.$popoverContainer,
        animation: false
      };
      this.$popoverEl.binf_popover(popoverOptions);
      this.$popoverEl.off('hidden.binf.popover')
          .on('hidden.binf.popover', this._handleCalloutHide.bind(this));
      this.$popoverEl.binf_popover('show');
      //To change the border color to red for non supported widgets.
      this.optionsFormView.onPopoverShow(this.$popoverContainer);
      this.optionsFormView.$el.find('.cs-formview-wrapper').trigger('refresh:setcontainer');
      var popover   = this.$popoverEl.next(".binf-popover"),
          itemFirst = popover.find(".alpaca-container-item-first");
      if (itemFirst.length) {
        itemFirst = itemFirst.first();
        var ele = itemFirst.find(
            'input:visible, textarea:visible, button.binf-dropdown-toggle:visible');
        if (ele.length) {
          ele.trigger('focus');
        }
      }
      this._registerPopoverEvents();
      this.optionsFormView.trigger('ensure:scrollbar');
      // TODO Use title of on formview as labelledBy instead of hidden popover title.
      // Currently empty H tag failed html validation, hence fill it will title.
      var popoverLabelElemId = _.uniqueId('popoverLabelId'),
          popoverHeader      = popover.find('>.binf-popover-title');
      if (popoverHeader) {
        popoverHeader.attr('id', popoverLabelElemId);
        popoverHeader.html(this.manifest.title);
        popover.attr('aria-labelledby', popoverLabelElemId);
      }
    },

    _hideCallout: function () {
      this.$popoverEl && this.$popoverEl.binf_popover('destroy');
    },

    _registerPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').off('click.' + this.cid).on(
          'click.' + this.cid, {
            view: this
          },
          this._documentClickHandler);
      $('.pman-container').off('click.' + this.cid).on('click.' + this.cid, {
        view: this
      }, this._documentClickHandler);
      $(window).off('click.' + this.cid).on('resize.' + this.cid, {
        view: this
      }, this._windowResizeHandler);
    },

    _windowResizeHandler: function (event) {
      var self = event.data.view;
      // closing opened popover on window resize
      self._hideCallout();
    },

    _unregisterPopoverEvents: function () {
      $('.perspective-editing .cs-perspective-panel').off('click.' + this.cid,
          this._documentClickHandler);
      $('.pman-container').off('click.' + this.cid, this._documentClickHandler);
      $(window).off('resize.' + this.cid, this._windowResizeHandler);
    },

    /**
     * Handle callout data update to widget on hidding of popover
     */
    _handleCalloutHide: function () {
      this._validateWidgetConfig();
      this._unregisterPopoverEvents();
      delete this.widgetConfig.options.___pman_opencallout;
      this._updateWidgetOptions(true);
      this._enableorDisableSaveButton();
    },

    _validateWidgetConfig: function () {
      var options = this.optionsFormView.getValues(),
          isValid = this.optionsFormView.validate();
      if (_.isFunction(this.widgetView.validateConfiguration)) {
        isValid = isValid && this.widgetView.validateConfiguration(options);
      }
      var action = !isValid ? 'addClass' : 'removeClass';
      this.$el[action]('binf-perspective-has-error');
    },

    _enableorDisableSaveButton: function () {
      var saveBtn  = $('.perspective-editing .pman-header .icon-save'),
          hasError = $('.perspective-editing').find(".binf-perspective-has-error").length > 0;
      saveBtn.prop('disabled', hasError);
    },

    /**
     * Triggered on changing of any widget's options on form.
     * Recreates the widgets with latest options (only if valid) to make sure widget is showing live data.
     *
     * Parameters:
     *  - reloadForLiveData: widget required to be re-created to get the changes reflected
     *  - softUpdate: Trigger change even without reloading the widget
     *
     */
    _updateWidgetOptions: function (reloadForLiveData, softUpdate) {
      var isValid = this.optionsFormView.validate(),
          options = this.optionsFormView.getValues();
      softUpdate = _.isUndefined(softUpdate) ? !reloadForLiveData : softUpdate
      var isWidgetReplaced = this._notifyConfigChanges(options, isValid, reloadForLiveData,
          softUpdate);
      this._enableorDisableSaveButton();
      return isWidgetReplaced;
    },

    _notifyConfigChanges: function (options, isValid, reloadForLiveData, softUpdate) {
      options = options || {};
      var oldOptions = this.widgetConfig.options || {};
      var isOptionsSame = _.isEqual(oldOptions, options);
      this.perspectiveView.trigger("update:widget:options", {
        widgetView: this.widgetView,
        isValid: isValid,
        options: options,
        softUpdate: softUpdate
      });

      if (isOptionsSame) {
        // Avoid widget recreation when options not changed.
        return;
      }

      if (!!isValid) {
        // Check if widget should be recreated on options change (for live data). 
        if (!this.manifest.callback && (reloadForLiveData || oldOptions.___pman_isdropped)) {
          // Recreate with widget (for live data) for the first time after drop to provde widget the options with default values (from manifest)
          // OR Recreate widget with updated options.
          var widgetType = this.widgetConfig.type;
          if (this._isPreviewWidget()) {
            // Has valid options to initialize origianl widgets now
            var originalWidget = this.widgetConfig.options.widget;
            widgetType = originalWidget.id;
          }
          if (!!oldOptions.___pman_isdropped) {
            options = _.extend({___pman_opencallout: oldOptions.___pman_isdropped}, options);
          }
          var widgetToReplace = {
            type: widgetType,
            kind: this.widgetConfig.kind,
            options: options
          };
          this.perspectiveView.trigger('replace:widget', this.widgetView, widgetToReplace);
          return true;
        }
      }
    },

    /**
     * Listen document click to close callouts
     */
    _documentClickHandler: function (event) {
      var self = event.data.view;
      if (!!$(event.target).closest('.binf-popover').length) {
        // Click on popover
        return;
      }
      if (!Marionette.isNodeAttached(event.target)) {
        // after click on element in popover, the element not exist in dom
        self.widgetView.trigger('reposition:flyout');
        return;
      }
      if (self.$el.is(event.target) ||
          (!!self.$el.has(event.target).length && !self.ui.delete.is(event.target)) ||
          self.widgetView.$el.is(event.target) || self.widgetView.$el.has(event.target).length) {
        // Click on current widget
        return;
      }
      self._unregisterPopoverEvents();
      self._hideCallout();
    },

    _onChangeField: function (field) {
      if (field.name === WidgetOptionsFormView.widgetSizeProperty) {
        // Notify perspective panel about size change to do respective DOM / style updates
        this.perspectiveView.trigger("update:widget:size", this.options.widgetView, field.value);
        // Close popover for now.
        this.$popoverEl.binf_popover('destroy');
        // TODO Re-position popover as widget size may change
        // this._calculatePopoverPlacement();
        // this._showPopover();
      } else if (this.options.notifyUpdatesImmediatly) {
        this._updateWidgetOptions(false, false);
        this.widgetView.trigger('reposition:flyout');
      }
    },

    _evalRequiredFormWidth: function () {
      // var formContainer = $("<div class='pman-widget-popover'/>");
      // formContainer.appendTo(document.body);

      this.optionsFormView.$el.addClass('pman-prerender-form');
      this.optionsFormView.$el.addClass('pman-widget-popover');
      this.optionsFormView.$el.appendTo(document.body);
      this.optionsFormView.$el.find('.cs-formview-wrapper').trigger('refresh:setcontainer');
      var formWidth = this.optionsFormView.$el.width();
      if (this.optionsFormView.$el.find('.csui-scrollablecols').length > 0) {
        formWidth += this.optionsFormView.$el.find('.csui-scrollablecols')[0].scrollWidth -
                     this.optionsFormView.$el.find('.csui-scrollablecols')[0].offsetWidth;
      }
      this.optionsFormView.$el.removeClass('pman-widget-popover');
      return formWidth;
    },

    _calculateSpaceAroundWidget: function () {
      var elWidth       = this.$el.width(),
          elWidth       = (elWidth / 2),
          documentWidth = $(document).width(),
          leftOffset    = this.$el.find('.csui-pman-popover-left').offset().left,
          rightOffset   = documentWidth - this.$el.find('.csui-pman-popover-right').offset().left;

      var aroundSpaces = {
        right: {
          placement: 'right',
          mirror: false,
          availableSpace: rightOffset
        },
        rightFlip: {
          placement: 'right',
          mirror: true,
          availableSpace: (documentWidth - rightOffset)
        },
        left: {
          placement: 'left',
          mirror: false,
          availableSpace: leftOffset
        },
        leftFlip: {
          placement: 'left',
          mirror: true,
          availableSpace: (documentWidth - leftOffset)
        }
      };
      return aroundSpaces;
    },

    _determineCalloutPlacement: function () {
      var isRtl     = i18n && i18n.settings.rtl,
          formWidth = this._evalRequiredFormWidth() + 20, // For additional spacing around Form
          allSpaces = this._calculateSpaceAroundWidget(),
          i, perfectSpace, highSpace;

      var spacings = !isRtl ?
          [allSpaces.right, allSpaces.left, allSpaces.leftFlip, allSpaces.rightFlip] :
          [allSpaces.rightFlip, allSpaces.leftFlip, allSpaces.left, allSpaces.right];

      for (i = 0; i < spacings.length; i++) {
        var current = spacings[i];
        if (formWidth < current.availableSpace) {
          perfectSpace = current;
          break;
        }
        if (!highSpace || current.availableSpace > highSpace.availableSpace) {
          highSpace = current;
        }
      }
      if (!perfectSpace) {
        // Widget is not perfect fit in any edge. So take high availability
        perfectSpace = highSpace;
      }
      perfectSpace.availableSpace -= 20; // For additional spacing around popover.

      return perfectSpace;
    },

    _isPreviewWidget: function () {
      return this.widgetConfig.type === WidgetMaskingView.perspectiveWidget;
    },

    _loadManifest: function () {
      if (this.manifest !== undefined) {
        return $.Deferred().resolve(this.manifest);
      }
      if (this._isPreviewWidget()) {
        // For widgets added using DnD, get manifest from perspective widget's options 
        // since Perspective widget will be added as preview for original widget
        this.manifest = this.widgetConfig.options.widget.get('manifest');
        return this._loadManifest();
      }
      var deferred = $.Deferred();
      var self        = this,
          widgetModel = new WidgetModel({
            id: this.widgetConfig.type
          });
      widgetModel.fetch().then(function () {
        self.manifest = widgetModel.get('manifest');
        deferred.resolve(self.manifest);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    onDeleteClick: function (event) {
      this._closePopover();
      event.preventDefault();
      if (!this.options.confirmOnRemove) {
        this._doDeleteWidget();
      } else {
        var self = this;
        csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.confirmQuestion(self.options.removeConfirmMsg,
              self.options.removeConfirmTitle,
              {
                buttons: {
                  showYes: true,
                  labelYes: lang.remove,
                  showNo: true,
                  labelNo: lang.cancel
                }
              })
              .done(function (yes) {
                if (yes) {
                  self._doDeleteWidget();
                }
              });
        });
      }
    },

    _doDeleteWidget: function () {
      this.perspectiveView.trigger("delete:widget", this.widgetView);
      this._enableorDisableSaveButton();
    },

    _doReplaceWidget: function (widgetToReplace) {
      var manifest  = (widgetToReplace.get('manifest') || {}),
          newWidget = { // Widget is able to intialize with default (empty) options.
            type: widgetToReplace.id,
            kind: manifest.kind
          };
      if (!PerspectiveUtil.isEligibleForLiveWidget(manifest)) {
        // Widget has few required options / has callback. Hence create generic "perspective widget preview" widget
        newWidget = {
          type: WidgetMaskingView.perspectiveWidget,
          kind: manifest.kind,
          options: {
            options: {}, // To be used and filled by callout form
            widget: widgetToReplace
          }
        };
      }
      newWidget.options = _.extend({___pman_isdropped: true}, newWidget.options);
      this.perspectiveView.trigger('replace:widget', this.widgetView, newWidget);
    },

    onDragOver: function (event) {
      event.preventDefault();
    },

    onDragEnter: function (event) {
      event.preventDefault();
      this.dropCounter++;
      this.$el.siblings(".csui-perspective-placeholder").addClass('csui-widget-drop');
    },

    onDragLeave: function () {
      this.dropCounter--;
      if (this.dropCounter === 0) {
        this.$el.siblings(".csui-perspective-placeholder").removeClass('csui-widget-drop');
      }
    },

    _extractWidgetToDrop: function (event) {
      var dragData = event.originalEvent.dataTransfer.getData("text");
      if (!dragData) {
        return undefined;
      }
      try { // TODO get rid of try catch and handle like non-droppable object
        var widgetToReplace = new WidgetModel(JSON.parse(dragData));
        return widgetToReplace;
      } catch (e) {
        // Unsupported drop
        return false;
      }
    },

    onDrop: function (event) {
      event.preventDefault();
      this.onDragLeave();
      var widgetToReplace = this._extractWidgetToDrop(event);
      if (!widgetToReplace) {
        return;
      }
      if (this.widgetConfig.type === WidgetMaskingView.placeholderWidget) {
        this._doReplaceWidget(widgetToReplace);
      } else {
        var self = this;
        csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.confirmQuestion(lang.replaceConfirmMsg, lang.replaceConfirmTitle, {
            buttons: {
              showYes: true,
              labelYes: lang.replace,
              showNo: true,
              labelNo: lang.cancel
            }
          })
              .done(function (userConfirmed) {
                if (userConfirmed) {
                  self._doReplaceWidget(widgetToReplace);
                }
              });
        });
      }
    },

    _updateStyles: function () {
      var className = _.result(this, 'className');
      this.$el.attr('class', className);
    },

    _onHideWidget: function () {
      this.perspectiveView.trigger('before:hide:widget', this.widgetView);
      PerspectiveUtil.setWidgetHidden(this.widgetConfig, true);
      this._notifyConfigChanges(this.widgetConfig.options, true, false);
      this._updateStyles();
      this.perspectiveView.trigger('hide:widget', this.widgetView);
    },

    _onShowWidget: function () {
      this.perspectiveView.trigger('before:show:widget', this.widgetView);
      PerspectiveUtil.setWidgetHidden(this.widgetConfig, false);
      this._notifyConfigChanges(this.widgetConfig.options, true, false);
      this._updateStyles();
      this.perspectiveView.trigger('show:widget', this.widgetView);
    },

  }, {
    className: 'csui-configure-perspective-widget',
    perspectiveWidget: 'csui/perspective.manage/widgets/perspective.widget',
    placeholderWidget: 'csui/perspective.manage/widgets/perspective.placeholder',
    widgetSizeProperty: '__widgetSize'
  });

  var PerspectiveWidgetConfigurationBehaviour = Marionette.Behavior.extend({

    defaults: {
      perspectiveSelector: '.perspective-editing .cs-perspective > div'
    },

    constructor: function PerspectiveWidgetConfigurationBehaviour(options, view) {
      options || (options = {});
      options.perspectiveView = options.perspectiveView || view;
      this.perspectiveView = options.perspectiveView;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      _.extend(this.perspectiveView, {
        getPManPlaceholderWidget: function () {
          return {
            type: WidgetMaskingView.placeholderWidget,
            options: {}
          };
        }
      })
    },

    _ensureWidgetElement: function () {
      if (!_.isObject(this.$widgetEl)) {
        // Consider element to add mask can be provided through options
        this.$widgetEl = this.options.el ? $(this.options.el) : this.view.$el;
      }
      if (!this.$widgetEl || this.$widgetEl.length === 0) {
        throw new Marionette.Error('An "el" ' + this.$widgetEl.selector + ' must exist in DOM');
      }
      return true;
    },

    _checkAndApplyMask: function () {
      this._ensureWidgetElement();
      if (this.$widgetEl.children('.' + WidgetMaskingView.className).length > 0) {
        // Mask exist
        return;
      }

      // Get data configured to widget
      var widgetConfig = this._resolveWidgetConfiguration();
      if (!widgetConfig) {
        throw new Marionette.Error({
          name: 'NoWidgetConfigurationError',
          message: 'A "widgetConfig" must be specified'
        });
      }
      if (this.maskingView && this.$widgetEl.has(this.maskingView.$el).length &&
          _.isEqual(widgetConfig, this.options.widgetConfig)) {
        // No change in configuration. No rerender of mask required.
        return;
      }
      this.maskingView && this.maskingView.destroy();
      this.maskingView = new WidgetMaskingView(
          _.extend(this.options, {
            widgetView: this.view,
            widgetConfig: widgetConfig
          }));
      this.maskingView.render();
      this.$widgetEl.append(this.maskingView.el);
      this.$widgetEl.addClass('csui-pman-editable-widget')
      // To be used perspective.view to show placeholder watermark
      this.$widgetEl.data('pman.widget', {
        attributes: {
          manifest: widgetConfig
        }
      });
      if (widgetConfig.type === WidgetMaskingView.placeholderWidget) {
        // Prevent perspective placeholder to participate in sorting.
        this.$widgetEl.removeClass('csui-draggable-item');
      }
    },

    _resolveWidgetConfiguration: function () {
      if (!!this.view.model && !!this.view.model.get('widget')) {
        // Try model of widget view - Flow, LCR, Grid.. who even using grid control 
        return this.view.model.get('widget');
      }
      if (!!this.view.getPManWidgetConfig && _.isFunction(this.view.getPManWidgetConfig)) {
        // Widget configuration can be provided though a function 
        return this.view.getPManWidgetConfig();
      }
      if (!!this.options.widgetConfig) {
        // Can be provided through behaviour's options
        return _.result(this.options, 'widgetConfig');
      }
    },

    onRender: function () {
      if (this.options.notifyUpdatesImmediatly && this.view.isUpdating) {
        return;
      }
      this._checkAndApplyMask();
      this.maskingView && this.maskingView._enableorDisableSaveButton();
    },

    onDestroy: function () {
      this.maskingView && this.maskingView.destroy();
      this.maskingView = undefined;
    }

  });

  return PerspectiveWidgetConfigurationBehaviour;

})
;
csui.define('csui/perspective.manage/pman.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/perspective.manage/impl/pman.panel.view',
  'csui/utils/perspective/perspective.util',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/user',
  'csui/models/perspective/personalization.model',
  'i18n!csui/perspective.manage/impl/nls/lang',
  'hbs!csui/perspective.manage/impl/pman',
  'css!csui/perspective.manage/impl/pman',
  'csui/perspective.manage/behaviours/pman.widget.config.behaviour'
], function (_, $, Backbone, Marionette, base, NonEmptyingRegion, PManPanelView, PerspectiveUtil,
    ApplicationScopeModelFactory,
    NodeModelFactory, UserModelFactory, PersonalizationModel, lang, template) {

  var pmanContainer;

  var PManView = Marionette.ItemView.extend({
    className: function () {
      var classNames = ['pman', 'pman-container'];
      classNames.push('pman-mode-' + this.options.mode);
      return _.unique(classNames).join(' ');
    },

    template: template,

    templateHelpers: function () {
      return {
        addWidget: lang.addWidget,
        save: lang.save,
        cancel: lang.cancel,
        reset: lang.reset,
        personalizeMode: this.mode === PerspectiveUtil.MODE_PERSONALIZE &&
                         (this.options.perspective.has('perspective_id') ||
                          this.options.perspective.has('id'))
      };
    },

    ui: {
      "pmanPanel": ".pman-header .pman-pannel-wrapper",
      'cancelEdit': '.pman-header .cancel-edit',
      'addIcon': '.pman-header .icon-toolbarAdd',
      'saveBtn': '.pman-header .icon-save',
      'trashArea': '.pman-header .pman-trash-area',
      'resetBtn': '.pman-header .icon-reset'
    },

    events: {
      'click @ui.cancelEdit': "onClickClose",
      'click @ui.addIcon': "togglePannel",
      'click @ui.saveBtn': "onClickSave",
      'click @ui.resetBtn': "onClickReset"
    },

    constructor: function PManView(options) {
      options || (options = {});
      _.defaults(options, {
        applyMasking: this.applyMasking.bind(this),
        container: document.body,
        mode: PerspectiveUtil.MODE_EDIT_PERSPECTIVE
      });
      options.container = $(options.container);
      this.context = options.context;
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.mode = options.mode;
      this._prepareForEdit(options.perspective);
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._registerEventHandler();
    },

    _registerEventHandler: function () {
      this.listenTo(this, 'change:layout', function (newLayoutType) {
        this.perspective.setPerspective({
          type: newLayoutType,
          options: {perspectiveMode: this.mode}
        }, {silent: true});
        this._triggerEditMode();
        this.togglePannel();
      });
      this.listenTo(this.context, 'save:perspective', this._savePerspective);
      // listen to change perspective and exit from edit mode
      this.listenTo(this.context, 'change:perspective', this._onChangePerspective);
      this.listenTo(this.context, 'retain:perspective', this._doExitPerspective);
      this.listenTo(this.context, 'finish:exit:edit:perspective', this._doCleanup);
    },

    _prepareForEdit: function (originalPerspective) {
      if (!originalPerspective) {
        throw new Error("Missing perspective");
      }
      this.perspective = this._clonePrespective(originalPerspective);
      if (this.perspective.isNew() && this.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        // No perspectives are configues to current node
        this.perspective.setPerspective(this._getDefaultPerspectiveConfig());
      }
      // var perspectiveOptions = this.perspective.getPerspective().options || {};
      // perspectiveOptions.perspectiveMode = this.mode;
    },

    _clonePrespective: function (original) {
      var perspectiveConfig = original.getPerspective();
      var config = JSON.parse(JSON.stringify(perspectiveConfig));
      original.setPerspective(config);
      return original;
    },

    show: function () {
      var container = this.getContainer(),
          region    = new NonEmptyingRegion({
            el: container
          });
      region.show(this);
      return this;
    },

    getContainer: function () {
      if (!pmanContainer || !$.contains(this.options.container, pmanContainer)) {
        pmanContainer = $('<div>', {'class': 'binf-widgets'}).appendTo(this.options.container)[0]
      }
      return pmanContainer;
    },

    /**
     * Default perspective when no perspectives configured for a container
     */
    _getDefaultPerspectiveConfig: function () {
      // TODO check if LCR is relevant to all containers.
      return {
        "type": "left-center-right",
        "options": {
          "center": {
            "type": "csui/widgets/nodestable"
          }
        }
      };
    },

    /**
     * Updates / creates perspective
     */
    _savePerspective: function (perspectiveChanges) {
      if (!!perspectiveChanges && !!perspectiveChanges.error) {
        this.ui.saveBtn.prop('disabled', false);
        return;
      }
      this.perspective.update(perspectiveChanges);
      // Save perspective to server
      this.perspective.save().then(_.bind(this._onSaveSuccess, this),
          _.bind(this._onSaveError, this));
    },

    _onSaveSuccess: function () {
      var self = this;
      if (self.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        this._showMessage("success", lang.perspectiveSaveSuccess);
      } else {
        this._showMessage("success", lang.personalizationSaveSuccess);
      }
      // Update context's perspective and exit from inline editing
      var contextPerspectiveMode = self.context.perspective.get('perspectiveMode') ||
                                   PerspectiveUtil.MODE_EDIT_PERSPECTIVE,
          sourceModel            = self._getSourceModel();

      var updatePerspective = self.perspective.getPerspective();
      updatePerspective.id = self.perspective.getPerspectiveId();

      // Keep the perspective / personalization at sourceModel (received from server) up to date.
      if (self.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        // Update only personalization of sourceModel's perspective
        var originalPerspective = sourceModel.get('perspective');
        sourceModel.set('perspective', _.defaults(updatePerspective, originalPerspective));
      } else {
        // Update only personalization of sourceModel's perspective
        var originalPerspective = sourceModel.get('perspective');
        sourceModel.set('perspective',
            _.defaults({personalizations: self.perspective.toJSON()}, originalPerspective));
      }

      if (contextPerspectiveMode === self.mode) {
        self.context.perspective.set(updatePerspective);
      } else if (self.mode === PerspectiveUtil.MODE_EDIT_PERSPECTIVE) {
        // Original perspective changed. And the current user has personalization of current page.
        // Merge latest perspective updates to personalization
        var personalization = new PersonalizationModel({}, {perspective: updatePerspective});
        personalization.setPerspective(self.context.perspective.toJSON());
        updatePerspective = personalization.getPerspective();
        self.context.perspective.set(updatePerspective);

      } else if (self.mode === PerspectiveUtil.MODE_PERSONALIZE) {
        // Update the personalizations to context. Since content is currently showing admin's perspective.
        // Probablt this is the first time user personalizing the page.
        var personalization = new PersonalizationModel({},
            {perspective: sourceModel.get('perspective')});
        personalization.setPerspective(updatePerspective);
        updatePerspective = personalization.getPerspective();
        self.context.perspective.set(updatePerspective);
      }
      self._doExitPerspective();
    },

    _onSaveError: function (error) {
      this.ui.saveBtn.prop('disabled', false);
      // API error while saving..
      var errorMessage;
      if (error && error.responseJSON && error.responseJSON.error) {
        errorMessage = error.responseJSON.error;
      } else {
        var errorHtml = base.MessageHelper.toHtml();
        base.MessageHelper.reset();
        errorMessage = $(errorHtml).text();
      }
      this._showMessage("error", errorMessage);
    },

    _showMessage: function (type, message) {
      csui.require([
        'csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showMessage(type, message);
      });
    },

    onClickSave: function () {
      this.ui.saveBtn.prop('disabled', true);
      //Close collout if any open
      var popoverTarget = this.options.container.find(".binf-popover");
      if (popoverTarget.length) {
        popoverTarget.binf_popover('hide');
      }
      this.context.triggerMethod('serialize:perspective', this.perspective);
    },

    onClickReset: function () {
      var self = this;
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.resetConfirmMsg,
            lang.reset,
            {
              buttons: {
                showYes: true,
                labelYes: lang.reset,
                showNo: true,
                labelNo: lang.cancel
              }
            })
            .done(function (yes) {
              if (yes) {
                self._doReset();
              }
            });
      });
    },

    _doReset: function () {
      var sourceModel = this._getSourceModel();
      originalPerspective = JSON.parse(JSON.stringify(sourceModel.get('perspective')));
      originalPerspective.options = originalPerspective.options || {};
      originalPerspective.options.perspectiveMode = this.mode;
      var originalConfig = new Backbone.Model(originalPerspective);
      this.context.triggerMethod('enter:edit:perspective', originalConfig);
      this.listenToOnce(this.context, 'finish:enter:edit:perspective', function () {
        this._showMessage("success", lang.resetSuccessful);
      });
    },

    _getSourceModel: function (params) {
      var sourceModel;
      if (this.applicationScope.get('id') === 'node') {
        sourceModel = this.context.getModel(NodeModelFactory);
      } else if (!this.applicationScope.get('id')) {
        sourceModel = this.context.getModel(UserModelFactory);
      }
      return sourceModel;
    },

    onClickClose: function () {
      this._doExitPerspective();
    },

    togglePannel: function () {
      if (!this.ui.pmanPanel.hasClass('binf-active')) {
        // Reset before showing panel
        this._openToolsPanel();
      } else {
        this._closeToolsPanel();
      }
    },

    _openToolsPanel: function () {
      this.pmanPanelView.trigger('reset:items');
      this.ui.addIcon.addClass('binf-active');
      this.ui.addIcon.attr("title", lang.close);
      this.ui.pmanPanel.addClass('binf-active');
      this.pmanPanelView.triggerMethod("panel:open");
    },

    _closeToolsPanel: function () {
      this.ui.pmanPanel.removeClass('binf-active');
      this.ui.addIcon.attr("title", lang.addWidget);
      this.ui.addIcon.removeClass('binf-active');
    },

    applyMasking: function () {

    },

    _initializeWidgets: function () {
      if (this.mode === PerspectiveUtil.MODE_PERSONALIZE) {
        // Personalize doesn't need to load all available widgets for DnD
        return;
      }
      this.pmanPanelRegion = new Marionette.Region({
        el: this.ui.pmanPanel
      });
      this.pmanPanelView = new PManPanelView({
        pmanView: this
      });
      this.pmanPanelRegion.show(this.pmanPanelView);
      _.isFunction(this.ui.trashArea.droppable) && this.ui.trashArea.droppable({
        tolerance: 'pointer',
        hoverClass: "pman-trash-hover",
        accept: function () {
          return false;
        }
      });
    },

    _triggerEditMode: function () {
      var perspectiveConfig = this.perspective.getPerspective();
      perspectiveConfig.options = perspectiveConfig.options || {};
      perspectiveConfig.options.perspectiveMode = this.mode;
      var perspective = new Backbone.Model(perspectiveConfig);
      this.context.triggerMethod('enter:edit:perspective', perspective);
    },

    _beforeTransition: function () {
      var perspectiveContainer = this.options.container.find('.cs-perspective');
      this.options.container.addClass('perspective-editing-transition');
      base.onTransitionEnd(perspectiveContainer, function () {
        this.options.container.removeClass('perspective-editing-transition');
      }, this);
    },

    onRender: function () {
      var self = this;
      this._beforeTransition();
      this.options.container.addClass('perspective-editing');
      this.options.applyMasking();
      this._initializeWidgets();
      this._triggerEditMode();
      $(document).on('click.' + this.cid, {view: this}, this._documentClick);
    },

    _documentClick: function (event) {
      var self = event.data.view;
      if (self.ui.addIcon.is(event.target) || !!self.ui.addIcon.has(event.target).length) {
        // Add Icon
        return;
      }
      if (self.ui.pmanPanel.is(event.target) || !!self.ui.pmanPanel.has(event.target).length) {
        // Pman panel
        return;
      }
      self._closeToolsPanel();
    },

    _onChangePerspective: function () {
      this._doCleanup();
    },

    _doCleanup: function () {
      var popoverTarget = this.options.container.find(".binf-popover");
      this._beforeTransition();
      if (popoverTarget.length) {
        popoverTarget.binf_popover('destroy');
      }
      this.options.container.removeClass('perspective-editing');
      $(document).off('click.' + this.cid, this._documentClick);
      this.trigger('destroy');
    },

    /**
     * Edit from perspective inline editing mode.
     */
    _doExitPerspective: function () {
      this.context.triggerMethod('exit:edit:perspective', this.perspective);
    },

  });

  return PManView;
});

csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});
  
csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/root/lang',{
  dndWidgetsHere: 'Drag and Drop widgets here'
});
  


/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-placeholder-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.dndWidgetsHere || (depth0 != null ? depth0.dndWidgetsHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dndWidgetsHere","hash":{}}) : helper)))
    + "\">\r\n  <div class=\"csui-placeholder-icon\"></div>\r\n  <div>"
    + this.escapeExpression(((helper = (helper = helpers.dndWidgetsHere || (depth0 != null ? depth0.dndWidgetsHere : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dndWidgetsHere","hash":{}}) : helper)))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_widgets_perspective.placeholder_impl_perspective.placeholder', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',[],function(){});
/**
 * Placeholder view to represent an empty widget in perpsective.
 * This will be replaces by perspective.widget (preview) on dropping of widgets on this
 */
csui.define('csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/perspective.manage/widgets/perspective.placeholder/impl/nls/lang',
  'hbs!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',
  'css!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder'
], function (_, Backbone, Marionette, lang, template) {
  var PerspectivePlaceholderView = Marionette.ItemView.extend({
    className: 'csui-perspective-placeholder',
    template: template,
    templateHelpers: function () {
      return {
        dndWidgetsHere: lang.dndWidgetsHere
      }
    },

    constructor: function (options) {
      Marionette.ItemView.apply(this, arguments);
    },

    onShow: function() {
      this.$el.parent().addClass('csui-pman-placeholder-container');
    },

    onDestroy: function() {
      this.$el.parent().removeClass('csui-pman-placeholder-container');
    }

  });
  return PerspectivePlaceholderView;
});
csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});
  
csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/root/lang',{
  noConfig: 'No configuration needed',
  clickToConfig: 'Configuration needed'
});
  


/* START_TEMPLATE */
csui.define('hbs!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"tile-header\">\r\n  <div class=\"tile-title\">\r\n    <h2 class=\"csui-heading\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetTitle","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n</div>\r\n<div>\r\n  <div title=\""
    + this.escapeExpression(((helper = (helper = helpers.widgetMessage || (depth0 != null ? depth0.widgetMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetMessage","hash":{}}) : helper)))
    + "\" class=\"csui-pman-widget-msg\">\r\n    <div class=\"csui-pman-widget-icon\"></div>\r\n    <div>"
    + this.escapeExpression(((helper = (helper = helpers.widgetMessage || (depth0 != null ? depth0.widgetMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"widgetMessage","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_perspective.manage_widgets_perspective.widget_impl_perspective.widget', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',[],function(){});
/**
 * Preview view of any widget
 */
csui.define('csui/perspective.manage/widgets/perspective.widget/perspective.widget.view',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/perspective.manage/widgets/perspective.widget/impl/nls/lang',
  'hbs!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',
  'css!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget'
], function (_, Backbone, Marionette, lang, template) {
  var PerspectiveWidgetView = Marionette.ItemView.extend({
    className: 'csui-pman-widget',
    template: template,
    templateHelpers: function () {
      var wConfig  = this.widget && this.widget.get("manifest"),
          wTitle   = this.widget && this.widget.get('title'),
          noConfig = !wConfig || !wConfig.schema || !wConfig.schema.properties ||
                     _.isEmpty(wConfig.schema.properties);
      return {
        widgetTitle: wTitle || lang.noTitle,
        widgetMessage: noConfig ? lang.noConfig : lang.clickToConfig
      }
    },

    constructor: function (options) {
      options || (options = {});
      options = _.defaults(options, {
        data: {},
      });
      Marionette.ItemView.apply(this, arguments);
      this.widget = options.data.widget;
    }
  });
  return PerspectiveWidgetView;
});

csui.define('json!csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
  
);


csui.define('json!csui/perspective.manage/widgets/perspective.widget/perspective.widget.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{title}}",
  "description": "{{description}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {}
  }
}
);

csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/perspective.placeholder.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/widgets/perspective.placeholder/impl/nls/root/perspective.placeholder.manifest',{
  dndWidgetsHere: 'Drag and Drop widgets here'
});


csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/perspective.widget.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/perspective.manage/widgets/perspective.widget/impl/nls/root/perspective.widget.manifest',{
  noConfig: 'No configuration needed',
  clickToConfig: 'Configuration needed'
});


csui.define('bundles/csui-perspective',[
    'csui/perspective.manage/pman.view',
    'csui/perspective.manage/behaviours/pman.widget.config.behaviour',
    'csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.view',
    'csui/perspective.manage/widgets/perspective.widget/perspective.widget.view',
    
    // widgets manifests
    'json!csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.manifest.json',
    'json!csui/perspective.manage/widgets/perspective.widget/perspective.widget.manifest.json',

    'i18n!csui/perspective.manage/widgets/perspective.placeholder/impl/nls/perspective.placeholder.manifest',
    'i18n!csui/perspective.manage/widgets/perspective.widget/impl/nls/perspective.widget.manifest',
], {});
  
csui.require(['require', 'css'], function (require, css) {
    css.styleLoad(require, 'csui/bundles/csui-perspective', true);
});
  
