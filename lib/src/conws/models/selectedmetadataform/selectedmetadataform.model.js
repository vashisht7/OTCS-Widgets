/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
    'csui/utils/url', 'csui/utils/base',
    'conws/models/categoryforms/categoryforms.model'
], function (module, $, _, Backbone, Url, BaseUtils, CategoryFormCollection) {

    "use strict";

  function updateData(groupNames,data,changes) {
    _.each(groupNames,function(groupId){
      if (data[groupId]) {
        updateData(groupNames,data[groupId],changes);
      }
    });
    _.each(changes,function(value,propertyId){
      if (propertyId.indexOf("conwsgroup_")<0) {
        if (data.hasOwnProperty(propertyId)) {
          data[propertyId] = value;
        }
      }
    });
  }
    var SelectedMetadataFormModel = Backbone.Model.extend({

        constructor: function SelectedMetadataFormModel(attributes, options) {

            this.node = options.node;

            if(options.metadataConfig) {
                this.metadataConfig = options.metadataConfig.metadata;
                this.hideEmptyFields = options.metadataConfig.hideEmptyFields || false;
                this.isReadOnly = options.metadataConfig.readonly ? true : false;
            }

            this.categoryForms = this.metadataConfig && new CategoryFormCollection(undefined, {
                    node: options.node,
                    autofetch: true,
                    autoreset: true,
                    categoryFilter: this._createCategoryFilter(this.metadataConfig)
                });

            Backbone.Model.prototype.constructor.call(this, attributes, options);

            this.categoryForms && this.listenTo(this.categoryForms, 'reset', function () {
                this.update(this.metadataConfig);
            });
        },

        fetch: function (options) {
            return this.categoryForms && this.categoryForms.fetch(options)
                    .done(_.bind(this._saveData,this));
        },

        _getChanges: function (catModel) {
            var changes = catModel.get("data");
            var schema = catModel.get("schema");
            var options = catModel.get('options');
            var key;
            for (key in options.fields) {
                if(options.fields[key].hidden === true) {
                    if(schema.properties[key].type === 'string') {
                        if(key in changes && changes[key] === null) {
                            changes[key] = "";
                        }
                    }
                }
            }

            return changes;
        },

        _createCategoryFilter: function (config) {
            var categoryFilter = [];
            _.each(config, function (configElement) {
                if (configElement.type === "attribute" || configElement.type === "category") {
                    if (!_.contains(categoryFilter, configElement.categoryId)) {
                        categoryFilter.push(configElement.categoryId);
                    }
                } else if (configElement.type === "group") {
                    var innerCategoryFilter = this._createCategoryFilter(configElement.attributes);
                    _.each(innerCategoryFilter, function (innerCategory) {
                        if (!_.contains(categoryFilter, innerCategory)) {
                            categoryFilter.push(innerCategory);
                        }
                    })
                }
            }, this);
            return categoryFilter;
        },

      _saveData: function() {
        function flatten(groupNames,oldData,data) {
          _.each(groupNames,function(groupId) {
            var groupData = data[groupId];
            if (groupData) {
              delete data[groupId];
              flatten(groupNames,oldData,groupData);
              _.extend(oldData,groupData);
            }
          });
        }
        var data = this.get("data");
        this.oldData = data? JSON.parse(JSON.stringify(data)) : {};
        flatten(this.groupNames,this.oldData,this.oldData);
      },

      restoreData: function (changes) {
        var restore = _.pick(this.oldData,_.keys(changes));
        restore = JSON.parse(JSON.stringify(restore));
        updateData(this.groupNames,this.get("data"),restore);
        return restore;
      },

      updateData: function (changes) {
          updateData(this.groupNames,this.get("data"),changes);
          this._saveData();
        },

      update: function (config) {
        var data = {};
        var schema = {properties: {}};
        var options = {fields: {}};
        var destinationModel = {
          data: data,
          properties: schema.properties,
          fields: options.fields,
		  title:""
        };

        this.groupCnt = 1;
        this.groupNames = [];

        this._fillModel(config, destinationModel);
        this.set({data: data, schema: schema, options: options}); // triggers change event
        this._saveData();
      },

        _fillModel: function (config, destinationModel, prefix) {
            _.each(config, function (configElement) {
                if (configElement.type === "attribute") { // Single attribute row
                    this._createAttribute(configElement, destinationModel, prefix);
                } else if (configElement.type === "category") {  // All attributes of a category
                    this._createCategory(configElement, destinationModel, prefix);
                } else if (configElement.type === "group") { // Group of attributes
                    var groupId = "conwsgroup_" + this.groupCnt++; // Define a unique group name
					var groupName = configElement.label;
                    this.groupNames.push(groupId);
                    var innerData = {};
                    var innerProperties = {properties: {}};
                    var innerFields = {
                        label: BaseUtils.getClosestLocalizedString(configElement.label, "Undefined"),
                        fields: {}
                    };
                    var innerDestinationModel = {
                        data: innerData,
                        properties: innerProperties.properties,
                        fields: innerFields.fields,
						title:""
                    };
                    this._fillModel(configElement.attributes, innerDestinationModel, groupName);
                    if (!_.isEmpty(innerData)) { // empty groups are hidden
                        destinationModel.data[groupName] = innerData;
                        destinationModel.properties[groupName] = innerProperties;
                        destinationModel.fields[groupName] = innerFields;
                    }
                }
            }, this);
        },

        _createAttribute: function (configElement, destinationModel, prefix) {
            var fieldId = configElement.categoryId + "_" + configElement.attributeId;
            _.each(this.categoryForms.models, function (modelElement) {
                if (configElement.categoryId === modelElement.id) {
                    var sourceModel;
                    if (configElement.columnId) {
                        var setType = modelElement.attributes.schema.properties[fieldId].type;
                        if (setType === "object") { // single-row set
                            var subFieldId = fieldId + "_1_" + configElement.columnId;
                            sourceModel = {
                                data: modelElement.attributes.data[fieldId],
                                properties: modelElement.attributes.schema.properties[fieldId].properties,
                                fields: modelElement.attributes.options.fields[fieldId].fields
                            };
                            this._createRow(subFieldId, configElement, destinationModel, sourceModel, prefix);
                        } else if (setType === "array") { // multi-row set (has a different, more complex structure)
                            var subFieldId = fieldId + "_x_" + configElement.columnId;
                            sourceModel = {
                                data: modelElement.attributes.data[fieldId][0],
                                properties: modelElement.attributes.schema.properties[fieldId].items.properties,
                                fields: modelElement.attributes.options.fields[fieldId].fields.item.fields
                            };
                            this._createRow(subFieldId, configElement, destinationModel, sourceModel, prefix);
                        }
                    } else {
                        sourceModel = {
                            data: modelElement.attributes.data,
                            properties: modelElement.attributes.schema.properties,
                            fields: modelElement.attributes.options.fields
                        };
                        this._createRow(fieldId, configElement, destinationModel, sourceModel, prefix);
                    }
                }
            }, this);
        },

        _createCategory: function (configElement, destinationModel, prefix) {
            _.each(this.categoryForms.models, function (modelElement) {
                if (configElement.categoryId === modelElement.id) {
                    var sourceModel = {
                        data: modelElement.attributes.data,
                        properties: modelElement.attributes.schema.properties,
                        fields: modelElement.attributes.options.fields,
						title: modelElement.attributes.title
                    };
                    _.each(modelElement.attributes.data, function (fieldElement, fieldIndex) {
                        this._createRow(fieldIndex, configElement, destinationModel, sourceModel, prefix);
                    }, this);
                }
            }, this);
        },

        _createRow: function (fieldId, config, destinationModel, sourceModel, prefix) {
			var fieldVal = sourceModel.data[fieldId],
				prop 	 = sourceModel.properties[fieldId],
				field 	 = sourceModel.fields[fieldId],
				key;
			if (!this.hideEmptyFields || !this._isEmpty(fieldVal)) {
				destinationModel.data[fieldId] = fieldVal;
				destinationModel.properties[fieldId] = prop;
				destinationModel.fields[fieldId] = field;
				if (config.label) {
					destinationModel.fields[fieldId].label =
						BaseUtils.getClosestLocalizedString(config.label, "Undefined");
				}
				if (this.isReadOnly === true || this.categoryForms.isReadOnly === true || config.readOnly === true) {
					destinationModel.properties[fieldId].readonly = true;
					destinationModel.fields[fieldId].readonly = true;
					if('items' in prop) {
						for(key in prop.items.properties) {
							prop.items.properties[key].readonly = true;
						}
					}
					if('properties' in prop) {
						for(key in prop.properties) {
							prop.properties[key].readonly = true;
						}
					}
					if('fields' in field) {
						for(key in field.fields) {
							field.fields[key].readonly = true;
						}
					}
				}
			}
		},

        _isEmpty: function (val) {
            if (val === null || val === undefined || val === "")
                return true;
            var uniqueElements = _.uniq(_.values(val));
            if (uniqueElements.length > 0) {
                var allEmpty = true;
                for (var i = 0; i < uniqueElements.length; i++) {
                    if (!this._isEmpty(uniqueElements[i])) {
                        allEmpty = false;
                        break;
                    }
                }
                if (allEmpty) {
                    return true;
                }
            }
            return false;
        },

        _removeGroupPrefix: function(path, prefix) {
            var modifiedPath = path;
            _.each(this.groupNames, function(groupName) {
                var actGroupName = (prefix || "") + groupName;
                if (modifiedPath.indexOf(actGroupName) == 0) {
                    modifiedPath = modifiedPath.substr(actGroupName.length);
                    if (modifiedPath[0] == '_') {
                        modifiedPath = modifiedPath.substr(1);
                    }
                }
            }, this);
            return modifiedPath;
        }

    });

    return SelectedMetadataFormModel;

});
