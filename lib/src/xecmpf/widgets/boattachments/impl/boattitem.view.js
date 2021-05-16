/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/jquery',
    'csui/behaviors/default.action/default.action.behavior',
    'csui/utils/base',
    'csui/lib/numeral',
    'csui/utils/contexts/factories/user',
    'xecmpf/widgets/boattachments/impl/boattachmentutil',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'hbs!xecmpf/widgets/boattachments/impl/boattitem',
    'css!xecmpf/widgets/boattachments/impl/boattitem'
], function (module, _, Marionette, $,
             DefaultActionBehavior,
             base,
             numeral,
             UserModelFactory,
             BOAttachmentUtil,
             lang,
             itemTemplate) {

    var AttachmentItemView = Marionette.ItemView.extend({

        behaviors: {
            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            }
        },

        constructor: function AttachmentItemView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.user = this.options.context.getModel(UserModelFactory);
        },

        triggers: {
            'click .xecmpf-attachmentitem-border': 'click:item'
        },

        onClickItem: function () {
            this.triggerMethod('execute:defaultAction', this.model);
        },

        className: 'xecmpf-attachmentitem-object clearfix',
        template: itemTemplate,
        _checkValue: function(obj) {
            return (!_.isUndefined(obj.value) && !_.isNull(obj.value)?true:false)
        },
        _convValueToString: function(obj) {
            !_.isString(obj.value) && (obj.value = obj.value+"");
            return obj;
        },
        serializeData: function () {
            var allval = this._getObject(this.options.data || {});
            var values = {};
            allval.title && (values.title = allval.title);
            allval.description && (values.description = allval.description);
            allval.topRight && this._checkValue(allval.topRight) && (values.topRight = this._convValueToString(allval.topRight));
            allval.bottomLeft && this._checkValue(allval.bottomLeft) && (values.bottomLeft = this._convValueToString(allval.bottomLeft));
            allval.bottomRight && this._checkValue(allval.bottomRight) && (values.bottomRight = this._convValueToString(allval.bottomRight));
            values.title || (values.title = {value: this.model.get('name')});
            values.name || (values.name = this.model.get('name'));
            values.id || (values.id = this.model.get('id'));
            values.defaultActionUrl = DefaultActionBehavior.getDefaultActionNodeUrl(this.model);
            if (this.model.get("id") !==
                this.model.collection.models[this.model.collection.models.length - 1].get("id")) {
                values.notLastItem = true;
            }

            if (this.model.get("reserved_user_id")) {
                var reservedBy = lang.reservedBy.replace("%1", this.model.get("reserved_user_id_expand").name_formatted);
                if (this.user.get("id")  === this.model.get("reserved_user_id")) {
                    values.reserved_by = reservedBy;
                } else {
                    values.reserved_by_other = reservedBy;
                }
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
                    if (name === 'value' || name === 'label') {
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
            value = !_.isUndefined(attributes[propertyName])?attributes[propertyName]: "";

            switch (type) {
                case -7:
                    if (propertyName === 'modify_date' || propertyName === 'modified' ) {
                        value = attributes['modified'] || attributes['modify_date'];
                    }
                    value = base.formatDate(value);
                    break;
                case 5:
                    value = attributes[propertyName + "_formatted"];
                    if (value === null || value === undefined) {
                        value = '';
                    }
                    break;
                case 2:
                case 14:
                    if (propertyName === 'size' || propertyName === 'modifiedby' || propertyName === 'createdby') {
                        value = attributes[propertyName + '_formatted'];
                    }
                    else if (propertyName.indexOf(suffix, this.length - suffix.length) !== -1 &&
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

    return AttachmentItemView;

});
