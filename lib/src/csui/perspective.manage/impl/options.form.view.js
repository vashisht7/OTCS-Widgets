/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
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
        this.ui.description.hide();
        this.ui.unSupportedConfig.show();
        this.trigger('render:form');
      }
    },
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
      if (!this.hasValidSchema) {
        var reqVal = true;
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
      return this.widgetOptionsFormView.validate();
    },

    _isPreviewWidget: function () {
      return this.options.widgetConfig.type ===
             'csui/perspective.manage/widgets/perspective.widget';
    },

    _prepareFormModel: function () {
      var data = this._getOptionsData();
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
    _getOptionsData: function () {
      var data = this.options.widgetConfig.options || {};
      if (this._isPreviewWidget()) {
        data = data.options || {};
      }
      return data;
    },
    _addWidgetSizePropertyIfSupported: function (schema, options, data) {
      if (!this.options.perspectiveView.getSupportedWidgetSizes) {
        return;
      }
      var supportedKinds = this.options.perspectiveView.getSupportedWidgetSizes(this.manifest,
          this.options.widgetView);
      if (!supportedKinds || supportedKinds.length === 0) {
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
      this.alpaca.options.hideInitValidationError = false;
    }
  });

  _.extend(WidgetOptionsFormView.prototype, LayoutViewEventsPropagationMixin);

  return WidgetOptionsFormWrapperView;

});
