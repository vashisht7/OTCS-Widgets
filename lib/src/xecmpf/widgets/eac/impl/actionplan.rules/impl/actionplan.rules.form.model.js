/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict'

define(['csui/lib/underscore', 'csui/models/form',
    'xecmpf/models/eac/eac.planproperties.factory',
    'i18n!xecmpf/widgets/eac/impl/nls/lang'
], function (_, FormModel, EACPlanPropertiesFactory, lang) {
    var EACRulesFormModel = FormModel.extend({

        constructor: function EACRulesFormModel(attributes, options) {
            this.options = options || (options = {});
            attributes || (attributes = {
                data: {},
                schema: { properties: {} },
                options: { fields: {} }
            });
            FormModel.prototype.constructor.call(this, attributes, options);
        },
        initialize: function (attributes, options) {
            var namespace = options.eventModel.get('namespace') || '';
            var event_name = options.eventModel.get('event_name') || '';
            var eacPlanProperties = options.context.getCollection(EACPlanPropertiesFactory, {
                eventModel: options.eventModel,
                attributes: {
                    namespace: namespace,
                    event_name: event_name
                }
            });

            if (!eacPlanProperties.planProperties) {
                this.listenToOnce(eacPlanProperties, 'sync', function () {
                    eacPlanProperties.planProperties = eacPlanProperties.map(function (model) {
                        return model.get('name');
                    });
                    this._setAttributes(eacPlanProperties.planProperties);
                });
                eacPlanProperties.fetch();
            } else {
                this._setAttributes(eacPlanProperties.planProperties);
            }
        },
        _setAttributes: function (planProperties) {
            var that = this;
            var formData = [];
            if (this.options.collection) {
                formData = this.options.collection.models.map(function (modelObj, index) {
                    return {
                        from: modelObj.get('operand'),
                        operator: modelObj.get('operator'),
                        to: modelObj.get('to'),
                        conjunction: modelObj.get('conjunction')
                    }
                });
            }
            this.set({
                "data": {
                    "rulesSet": formData
                },
                "options": {
                    "fields": {
                        "rulesSet": {
                            "fields": {
                                "item": {
                                    "fields": {
                                        "from": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "label": "",
                                            "readonly": false,
                                            "type": "select",
                                            "validator": function(callback) {
                                                var isFieldValid = false,
                                                    fieldValue = this.getValue(),
                                                    rulesSetForm = this.getParent().getParent(),
                                                    isItEmptyFirstRow = false,
                                                    currentRow = this.getParent();
                                                if (rulesSetForm.children.length === 1 && !currentRow.data.operator && !currentRow.data.to) {
                                                    isItEmptyFirstRow = true;
                                                }
                                                if (this.getValue() || isItEmptyFirstRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }
                                        },
                                        "operator": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "optionLabels": [lang.operatorEqualtoLabel, lang.operatorNotequaltoLabel],
                                            "label": "",
                                            "readonly": false,
                                            "type": "select",
                                            "validator": function(callback) {
                                                var isFieldValid = false,
                                                    fieldValue = this.getValue(),
                                                    rulesSetForm = this.getParent().getParent(),
                                                    isItEmptyFirstRow = false,
                                                    currentRow = this.getParent();
                                                if (rulesSetForm.children.length === 1 && !currentRow.data.from && !currentRow.data.to) {
                                                    isItEmptyFirstRow = true;
                                                }
                                                if (this.getValue() || isItEmptyFirstRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }                                           
                                        },
                                        "to": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "label": "",
                                            "readonly": false,
                                            "type": "text",
                                            "validator": function(callback) {
                                                var isFieldValid = false,
                                                    fieldValue = this.getValue(),
                                                    rulesSetForm = this.getParent().getParent(),
                                                    isItEmptyFirstRow = false,
                                                    currentRow = this.getParent();
                                                if (rulesSetForm.children.length === 1 && !currentRow.data.operator && !currentRow.data.from) {
                                                    isItEmptyFirstRow = true;
                                                }
                                                if (this.getValue() || isItEmptyFirstRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }

                                        },
                                        "conjunction": {
                                            "hidden": false,
                                            "hideInitValidationError": true,
                                            "optionLabels": [lang.conjunctionAndLabel, lang.conjunctionOrLabel],
                                            "label": "",
                                            "readonly": false,
                                            "type": "select",
                                            "removeDefaultNone": true,
                                            "validator": function(callback) {
                                                var isFieldValid = false,
												    rulesSetForm = this.getParent().getParent(),
											        isItPresentInLastRow = rulesSetForm.children[rulesSetForm.children.length-1].id === this.getParent().id;
                                                if (this.getValue() || isItPresentInLastRow) {
                                                    isFieldValid = true;
                                                }
                                                callback({ status: isFieldValid });
                                            }
                                        }
                                    },
                                    "type": "object"
                                }
                            },
                            "hidden": false,
                            "hideInitValidationError": true,
                            "items": {
                                "showMoveDownItemButton": false,
                                "showMoveUpItemButton": false
                            },
                            "label": "",
                            "toolbarSticky": true,
                            "showMessages": false,
                            "isSetType": true
                        }
                    }
                },
                "schema": {
                    "properties": {
                        "rulesSet": {
                            "items": {
                                "defaultItems": 1,
                                "maxItems": 50,
                                "minItems": 1,
                                "properties": {
                                    "from": {
                                        "enum": planProperties,
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    },
                                    "operator": {
                                        "enum": ['Equal to', 'Not equal to'],
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    },
                                    "to": {
                                        "maxLength": 248,
                                        "minLength": 1,
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    },
                                    "conjunction": {
                                        "enum": ['And', 'Or'],
                                        "readonly": false,
                                        "title": "",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "title": "",
                            "type": "array"
                        }
                    },
                    "type": "object"
                }
            });
        }
    });

    return EACRulesFormModel;
});