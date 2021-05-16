/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/lib/jquery',
  'conws/utils/previewpane/previewpane.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/base',
  'csui/lib/numeral',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  'hbs!conws/widgets/relatedworkspaces/impl/relateditem',
  'css!conws/widgets/relatedworkspaces/impl/relateditem'
], function (module, _, Marionette, $,
    PreviewPaneView,
    DefaultActionBehavior,
    base,
    numeral,
    lang,
    itemTemplate) {

  var RelatedItemView = Marionette.ItemView.extend({

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function RelatedItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    triggers: {
      'click .conws-relateditem-border': 'click:item'
    },

    events: {
      'mouseenter': 'showPreviewPane',
      'mouseleave': 'hidePreviewPane'
    },

    onClickItem: function () {
      this.destroyPreviewPane();
      this.triggerMethod('execute:defaultAction', this.model);
    },

    onBeforeDestroy: function (e) {
      this.destroyPreviewPane();
    },

    showPreviewPane: function () {
      if (this.options && this.options.data && this.options.data.preview && (this.options.data.preview.roleId || this.options.data.preview.metadata)) {
        if (!this.previewPane) {
          this.previewPane = new PreviewPaneView({
            parent: this,
            context: this.options.context,
            config: this.options.data && this.options.data.preview,
            node: this.model
          });
        }
        this.previewPane.show();
      }
    },

    hidePreviewPane: function () {
      if (this.previewPane) {
        this.previewPane.delayedHide();
      }
    },

    destroyPreviewPane: function() {
      if (this.previewPane) {
        this.previewPane.destroy();
        delete this.previewPane;
      }
    },

    className: 'conws-relateditem-object clearfix',
    template: itemTemplate,

    serializeData: function () {
      var allval = this._getObject(this.options.data || {});

      var values = {};
      allval.title && (values.title = allval.title);
      allval.description && (values.description = allval.description);
      allval.topRight && (values.topRight = allval.topRight);
      allval.bottomLeft && (values.bottomLeft = allval.bottomLeft);
      allval.bottomRight && (values.bottomRight = allval.bottomRight);
      values.title || (values.title = {value: this.model.get('name')});
      values.name || (values.name = this.model.get('name'));
      values.id || (values.id = this.model.get('id'));
      values.defaultActionUrl = DefaultActionBehavior.getDefaultActionNodeUrl(this.model);
      if (this.model.get("id") !==
          this.model.collection.models[this.model.collection.models.length - 1].get("id")) {
        values.notLastItem = true;
      }

      return values;
    },

    templateHelpers: function (data) {
      return data;
    },
    _getObject: function (object) {
      return _.reduce(object, function (result, expression, name) {
        if (typeof expression !== 'object') {
          expression = this.self._getValue(expression);
        } else if (typeof expression === 'object') {
          if(name === 'value' || name === 'label') {
            var exp = base.getClosestLocalizedString(expression);
            expression = this.self._getValue(exp);
          }
          else {
            expression = this.self._getObject(expression);
          }
        }
        result[name] = expression;

        return result;
      }, {}, {"self": this});
    },

    _getValue: function (expression) {
      var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
          match, propertyName, placeholder, value, valueFormat, result = expression;
      while ((match = parameterPlaceholder.exec(expression))) {
        placeholder = match[0];
        propertyName = match[1];
        valueFormat = match[3];
        if (this.model.collection.columns.models) {
          value = this._formatPlaceholder(propertyName, valueFormat, this.model.attributes,
              this.model.collection.columns.models);
        }
        result = result.replace(placeholder, value);
      }
      return result;
    },
    _formatPlaceholder: function (propertyName, valueFormat, attributes, columnModels) {
      var value, column, type, suffix = "_expand", orgPropertyName = propertyName;

      column = _.find(columnModels, function (obj) {
        return obj.get("column_key") === propertyName;
      });
      type = column && column.get("type") || undefined;
      propertyName = attributes[propertyName + suffix] ? propertyName + suffix : propertyName;
      value = attributes[propertyName] || "";

      switch (type) {
      case -7:
        value = base.formatDate(value);
        break;
      case 5:
        value = attributes[propertyName + "_formatted"];
        if (value === null || value === undefined) {
          value = '';
        }
        break;
      case 2, 14:
        if (propertyName.indexOf(suffix, this.length - suffix.length) !== -1 &&
            (attributes[propertyName].type_name === "User" || attributes[propertyName].type_name === "Group")) {
          value = base.formatMemberName(value);
        }
      default:
        if (valueFormat === 'currency') {
          value = numeral(value).format();
        }
        if (typeof value === 'object') {
          value = attributes[orgPropertyName] || "";
        }
      }
      return value;
    }
  });

  return RelatedItemView;

});
