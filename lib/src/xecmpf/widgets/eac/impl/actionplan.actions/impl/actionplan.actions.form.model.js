/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict'

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/models/form',
    'xecmpf/models/eac/eac.planproperties.factory',
    'xecmpf/models/eac/eac.defaultplans.factory',
    'i18n!xecmpf/widgets/eac/impl/nls/lang'
], function(_, $, Form, EACPlanProperties, EACDefaultPlansFactory, lang) {

    var EACActionsFormModel = Form.extend({

        constructor: function(attributes, options) {
            this.options = options || (options = {});
            attributes || (attributes = {
                data: {},
                options: {},
                schema: {}
            });

            Form.prototype.constructor.call(this, attributes, options);
        },

        initialize: function(attributes, options) {
            var promises = [],
                namespace = options.eventModel.get('namespace'),
                eventname = options.eventModel.get('event_name'),
                eacDefaultPlans = options.context.getCollection(EACDefaultPlansFactory),
                eacPlanProperties = options.context.getCollection(EACPlanProperties, {
                    eventModel: options.eventModel,
                    attributes: {
                        namespace: namespace,
                        event_name: eventname
                    }
                });
            if (!eacDefaultPlans.fetched) {
                promises.push(eacDefaultPlans.fetch());
            }

            if (!eacPlanProperties.planProperties) {
                promises.push(eacPlanProperties.fetch());
            }

            $.when.apply($, promises).done(function() {
                eacPlanProperties.planProperties = eacPlanProperties.map(function(model) {
                    return model.get('name');
                });

                if (attributes && attributes.data && attributes.data.action) {
                    eacDefaultPlans.actions = attributes.data[attributes.data.action + "_fields"];
                    this._setAttributes(eacDefaultPlans, eacPlanProperties.planProperties);
                } else {
                    this._setAttributes(eacDefaultPlans, eacPlanProperties.planProperties);
                }


            }.bind(this));
        },

        _setAttributes: function(eacDefaultPlans, planProperties) {
            var attributes = {
                "options": {
                    "fields": {
                        "actionsData": {
                            "fields": {
                                "item": {
                                    "type": "object",
                                    "fields": {                                        
                                        "action": {
                                            "readonly": false,
                                            "type": "select"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "schema": {
                    "type": "object",
                    "properties": {
                        "actionsData": {
                            "type": "array",
                            "items": {
                                "defaultItems": 1,
                                "maxItems": 50,
                                "minItems": 1,
                                "type": "object",
                                "properties": {
                                    "action": {
                                        "enum": ["CreateOrUpdateEventAction.Create Or Update Workspace", "DocGenEventAction.Create document"],
                                        "readonly": false,
                                        "required": true,
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            var actionFieldEnum = [],
                actionFieldLabels = [];
            for (var k = 0; k < eacDefaultPlans.models.length; k++) {
                var key = eacDefaultPlans.models[k].get("action_key");
                actionFieldEnum.push(key);
                actionFieldLabels.push(eacDefaultPlans.models[k].get('action_name'));
                var schema, options;

                schema = attributes.schema;
                schema.properties['actionsData'].items.properties[key + "_fields"] = { "properties": {}, "dependencies": "action", "type": "object" };
                var properties = schema.properties['actionsData'].items.properties[key + "_fields"].properties;

                options = attributes.options;
                options.fields['actionsData'].fields.item.fields[key + "_fields"] = { "fields": {}, "dependencies": { "action": key } };
                var fields = options.fields['actionsData'].fields.item.fields[key + "_fields"].fields;

                properties["actionattributes"] = {
                    "type": "object",
                    "properties": {
                        "parametername": {
                            "readonly": true,
                            "required": false,
                            "type": "text",
                            "default": lang.actionAttrParameterNameLabel
                        },
                        "sourcelabel": {
                            "readonly": true,
                            "required": false,
                            "type": "text",
                            "default": lang.actionAttrSourceLabel
                        },
                        "valuelabel": {
                            "readonly": true,
                            "required": false,
                            "type": "text",
                            "default": lang.actionAttrValueLabel
                        }
                    }
                };

                fields["actionattributes"] = {
                    "type": "object",
                    "fields": {
                        "parametername": {
                            "type": "text",
                            "label": lang.actionAttrParameterNameLabel,
                            "readonly": true
                        },
                        "sourcelabel": {
                            "type": "text",
                            "label": lang.actionAttrSourceLabel,
                            "readonly": true
                        },
                        "valuelabel": {
                            "type": "text",
                            "label": lang.actionAttrValueLabel,
                            "readonly": true
                        }
                    }
                };

                if (eacDefaultPlans.models[k].get('actions_attributes').length > 0) {
                    var actionAttributes = eacDefaultPlans.models[k].get('actions_attributes');
                    for (var i = 0; i < actionAttributes.length; i++) {
                        var requiredField = actionAttributes[i].required;
                        var fieldKey = actionAttributes[i].key;

                        properties[fieldKey] = {
                            "type": "object",
                            "properties": {
                                "actionattrname": {
                                    "readonly": true,
                                    "required": false,
                                    "type": "text",
                                    "default": eacDefaultPlans.models[k].attributes.actions_attributes[i].name
                                },
                                "source": {
                                    "type": "string",
                                    "required": requiredField,
                                    "enum": ["csObj", "evtProp", "prevAct"]
                                },
                                "csObj_field": {
                                    "dependencies": "source",
                                    "type": "string",
                                    "required": true
                                },
                                "evtProp_field": {
                                    "dependencies": "source",
                                    "type": "string",
                                    "required": true,
                                    "enum": planProperties
                                },
                                "prevAct_field": {
                                    "dependencies": "source",
                                    "type": "string",
                                    "required": true,
                                    "readonly": true
                                }
                            }
                        };

                        fields[fieldKey] = {
                            "type": "object",
                            "fields": {
                                "actionattrname": {
                                    "type": "text",
                                    "readonly": true,
                                    "fieldClass": "eac-mandatory-field-indication",
                                    "label": eacDefaultPlans.models[k].attributes.actions_attributes[i].name
                                },
                                "source": {
                                    "type": "select",
                                    "label": lang.sourceLabel,
                                    "optionLabels": [lang.csObjLabel, lang.evtPropLabel, lang.prevActLabel]
                                },
                                "csObj_field": {
                                    "type": "otcs_node_picker",
                                    "label": eacDefaultPlans.models[k].get('actions_attributes')[i].name,
                                    "type_control": {
                                        "parameters": {
                                            "startLocations": [
                                                "csui/dialogs/node.picker/start.locations/current.location",
                                                "csui/dialogs/node.picker/start.locations/enterprise.volume",
                                                "csui/dialogs/node.picker/start.locations/personal.volume",
                                                "csui/dialogs/node.picker/start.locations/favorites",
                                                "csui/dialogs/node.picker/start.locations/recent.containers",
                                                "csui/dialogs/node.picker/start.locations/category.volume",
                                                "csui/dialogs/node.picker/start.locations/perspective.assets.volume",
                                                "recman/dialogs/node.picker/start.locations/classifications.volume", "xecmpf/dialogs/node.picker/start.locations/extended.ecm.volume.container"
                                            ]
                                        }
                                    },
                                    "dependencies": {
                                        "source": "csObj"
                                    }
                                },
                                "evtProp_field": {
                                    "type": "select",
                                    "label": eacDefaultPlans.models[k].get('actions_attributes')[i].name,
                                    "dependencies": {
                                        "source": "evtProp"
                                    }
                                },
                                "prevAct_field": {
                                    "label": eacDefaultPlans.models[k].get('actions_attributes')[i].name,
                                    "type": "text",
                                    "dependencies": {
                                        "source": "prevAct"
                                    }
                                }
                            }
                        };
                    }
                }

            }
            attributes.schema.properties["actionsData"].items.properties["action"].enum = actionFieldEnum;
            attributes.options.fields['actionsData'].fields.item.fields['action'].optionLabels = actionFieldLabels;
            attributes.data = this.getFormData(this.options.collection, eacDefaultPlans);

            this.set(attributes);
        },

        getFormData: function(collection, eacDefaultPlans) {
            var formData = [];
            if (collection.models && collection.models.length > 0) {
                formData = collection.models.map(function(modelObj, index) {
                    var actionKey = modelObj.get("action_key"),
                        modelObjItem = {
                            action: actionKey
                        };
                    eacDefaultPlans.models.forEach(function(eacDefaultPlanModel) {
                        var keyName = eacDefaultPlanModel.get('action_key') + '_fields';
                        modelObjItem[keyName] = {
                            'actionattributes': {
                                'parametername': lang.actionAttrParameterNameLabel,
                                'sourcelabel': lang.actionAttrSourceLabel,
                                'valuelabel': lang.actionAttrValueLabel
                            }
                        };
                        eacDefaultPlanModel.get("actions_attributes").filter(function(actionAttr) {
                            modelObjItem[keyName][actionAttr.key] = {
                                'actionattrname': '',
                                'source': '',
                                'csObj_field': '',
                                'evtProp_field': '',
                                'prevAct_field': ''
                            }
                        });
                        if (eacDefaultPlanModel.get('action_key') === actionKey) {
                            modelObj.get('attribute_mappings').forEach(function(attribute) {
                                var attributeInfo = eacDefaultPlanModel.get("actions_attributes").filter(function(actionAttr) {
                                    return actionAttr.key === attribute.action_attr_name;
                                }), 
                                source = '',
                                propVal = '',
                                csObj_propVal = '',
                                evtProp_propVal = '';
                                
                                attributeInfo = attributeInfo.length > 0 ? attributeInfo[0] : attributeInfo;
                                source = attribute.mapping_method;
                                propVal = attribute.mapping_data;

                                if (source === 'Content Server Object') {
                                    source = "csObj";
                                    csObj_propVal = propVal;
                                } else if (source === 'Event Property') {
                                    source = "evtProp";
                                    evtProp_propVal = propVal;
                                } else if (source === 'Result from previous Action') {
                                    source = "prevAct";
                                }
                                modelObjItem[actionKey + '_fields'][attribute.action_attr_name] = {
                                    "actionattrname": attributeInfo.name,
                                    "source": source,
                                    "csObj_field": csObj_propVal,
                                    "evtProp_field": evtProp_propVal,
                                    "prevAct_field": "Result from previous action"
                                };
                            });
                        }
                    });
                    return modelObjItem;
                });
            } else {
                var emptyModel = {
                    action: ''
                };
                eacDefaultPlans.models.forEach(function(eacPlan) {
                    var keyName = eacPlan.get('action_key') + '_fields';
                    emptyModel[keyName] = {
                        'actionattributes': {
                            'parametername': lang.actionAttrParameterNameLabel,
                            'sourcelabel': lang.actionAttrSourceLabel,
                            'valuelabel': lang.actionAttrValueLabel
                        }
                    };
                    eacPlan.get("actions_attributes").filter(function(actionAttr) {
                        emptyModel[keyName][actionAttr.key] = {
                            'actionattrname': '',
                            'source': '',
                            'csObj_field': '',
                            'evtProp_field': '',
                            'prevAct_field': ''
                        }
                    });
                });
                formData.push(emptyModel);
            }

            return {
                actionsData: formData
            };
        }
    });

    return EACActionsFormModel;

});