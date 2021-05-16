/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/utils/url',
  'csui/controls/form/impl/fields/csformfield.editable.behavior',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/form/pub.sub',
  'conws/controls/form/fields/referencefield.states.behavior',
  'hbs!conws/controls/form/impl/fields/reference/reference',
  'i18n!conws/controls/form/impl/nls/lang',
  'css!conws/controls/form/impl/fields/reference/reference'
], function (_, $, Backbone, Marionette, FormFieldView, Url,
    FormFieldEditable2Behavior, ModalAlert, PubSub, ReferenceFieldStatesBehavior, template, lang) {
  "use strict";

  var ReferenceFieldView = FormFieldView.extend({

    constructor: function ReferenceFieldView(options) {
      FormFieldView.apply(this, arguments);
      this.create = this.options.mode === "create" ? true : false;
      this.catId = this.options.dataId.split("_")[0];
      this.formView = this.options.alpacaField.connector.config.formView;
      this.node = !!this.formView.node ? this.formView.node:this.formView.model.node;
      this.connector = this.node.connector;
      this.generatereference = false;
      this.regenerateReference = false;
      this.parentsAttrDataChanged = false;
      this.parentattrIds = [];
      this.parentsattrData = [];
      this.canRegenerateReference = this.alpacaField.schema.canRegenerateReference;
      this.rmClassificationUsed = this.alpacaField.schema.rmClassificationUsed;
      this.rmClassificationsAttached = true;
      if (!!this.alpacaField.schema.oldReferenceAttributeID) {
          this.oldReferenceAttributeID = this.alpacaField.schema.oldReferenceAttributeID;
      }
      if( this.create ){
		  this.listenTo(this.formView, 'invalid:field', this.invalidFieldChange );
      }
      var attr;
      this.hasValue = this.alpacaField.data === null || this.alpacaField.data === undefined ||
                      this.alpacaField.data === "" ? false : true;
      if(!!this.alpacaField.schema.depattrlist) {
        _.each(this.options.alpaca.schema.depattrlist, function (parent) {
          this.parentattrIds.push(parent);
          attr = {id: parent, data: this.getAttrData(parent)};
          this.parentsattrData.push(attr);
		  if( this.create ) {
				this.listenTo(PubSub, parent + 'dependentattrchanged', this.parentChange);
		  }
		  
        }, this);
      }
      if (this.parentattrIds.length > 0) {
        this.checkReadyForGenerateReference();
      } else {
        if (!this.hasValue) {
          this.generatereference = true;
        }
      }
      if (this.create && this.rmClassificationUsed && this.formView.model.collection) {
        this.listenTo(this.formView.model.collection, 'add',
            this.rmClassificationChange);
        this.listenTo(this.formView.model.collection, 'remove',
            this.rmClassificationChange);
        if (!this.formView.model.collection.get("recordsDetails")) {
          this.rmClassificationsAttached = false;
          this.generatereference = false;
          this.regenerateReference = false;
        }
      }
	  if( this.create === false ) {
		  this.regenerateReference = true;
	  }
	  this.idBtnLabel = this.options.labelId ? this.options.labelId : "";
	  this.refDataId = _.uniqueId('referenceData');
	  this.depFieldsText = this.getDependencyInlineText();
	  this.btnDesc = this.alpacaField.options.label + ", " + (this.hasValue ? lang.reGenRefNumber : lang.genRefNumber) + ", " + (this.canRegenerateReference ? this.depFieldsText : "");
    },
    className: 'cs-formfield cs-referencefield',
    template: template,
    templateHelpers: function () {
      return {
        create: this.create,
        generateReference: this.generatereference,
        data: this.curVal,
        hasValue: this.hasValue,
        readOnly: this.alpacaField.schema.readonly,
        depInlineText: this.depFieldsText,
        id: this.model && this.model.get('id') ? this.model.get('id') : _.uniqueId("button"),
        genRefNumber: lang.genRefNumber,
        reGenRefNumber: lang.reGenRefNumber,
        canRegenerateReference : this.canRegenerateReference,
		idBtnLabel: this.idBtnLabel,
		refDataId: this.refDataId,
		btnDesc: this.btnDesc
      };
    },
    behaviors: {
      FormFieldEditable: {
        behaviorClass: FormFieldEditable2Behavior
      },
      FormFieldStates: {
        behaviorClass: ReferenceFieldStatesBehavior
      }
    },
    events: {
      'click button.reference-generate-number': 'generateReferenceNumber'
    },
      getDependencyInlineText: function () {
          var dependencyInlineText = '';
          var rmClassName = '';
		  var rmClassData;
          if ( this.rmClassificationUsed && this.rmClassificationsAttached && this.formView.model.collection ) {
              if ( this.formView.model.collection.get("recordsDetails").options.className ) {
                  rmClassName = this.formView.model.collection.get("recordsDetails").options.className;
              } else if( this.formView.model.collection.get("recordsDetails").get("data")) {
				  rmClassData = this.formView.model.collection.get("recordsDetails").get("data");
				  if ( rmClassData.name ) {
					  rmClassName = this.formView.model.collection.get("recordsDetails").get("data").name;
				  } else if ( rmClassData.inherited_rmclassification_name ) {
						rmClassName = rmClassData.inherited_rmclassification_name[0];
				  }
              }
          }
          if (this.parentattrIds.length > 0) {
              dependencyInlineText = lang.depFieldsText + " " + this.alpacaField.schema.depattrtext;
              if (this.rmClassificationUsed) {
                  dependencyInlineText = dependencyInlineText + ", " + lang.rmClassificationText;
                  if (this.rmClassificationsAttached) {
                      dependencyInlineText = dependencyInlineText + ". " + lang.rmClassificationNameText + " " +
                          rmClassName;
                  }
              }
          } else if (this.rmClassificationUsed) {
              dependencyInlineText = lang.depFieldsText + " " + lang.rmClassificationText;
              if (this.rmClassificationsAttached) {
                  dependencyInlineText = dependencyInlineText + ". " + lang.rmClassificationNameText + " " +
                      rmClassName;
              }
          } else {
              dependencyInlineText = lang.independentFieldsText;
          }
          return dependencyInlineText;
      },
    generateReferenceNumber: function (event) {
      if (this.$el.find('button.reference-generate-number').attr('aria-disabled') === 'true') {
		return event.preventDefault();
	  }
	  var fullUrl;
      var connector = this.node.connector;
      var url = this.getV2Url(connector.connection.url);
      var self = this;
      var formData = this.getFormData();
      fullUrl = Url.combine(
          url + '/refnumbers');

      var ajaxOptions = {
        type: 'POST',
        url: fullUrl,
        data: formData,
        success: function (response, status, jXHR) {
          if (response.results.errMsg) {
            ModalAlert.showError(response.results.errMsg);
          }
          else {
            if (self.regenerateReference && !!self.oldReferenceAttributeID) {
              var oldReferenceElement = self.getAttrElement(self.oldReferenceAttributeID);
              if ( typeof oldReferenceElement !== 'undefined' ) {
                oldReferenceElement.setValue(self.curVal);
                oldReferenceElement.refresh();
              }
            }
            self.options.alpacaField.setValue(response.results.referenceNumber);
            self.hasValue = true;
            self.curVal = self.options.alpacaField.getValue();
            self.generatereference = false;
            if (self.create === false) {
              self.regenerateReference = true;
            }
            self.parentsAttrDataChanged = false;
            if (!self.create) {
              var ele = self.$el.find('.reference-field .btn-container button');
              ele.find('span').text(self.curVal);
              ele.focus();
            } else {
              if (self.render(self.$el.find('.reference-field-data button').length > 0)) {
                self.$el.find('.reference-field-data button').focus();
              }
            }
            if (!self.create && self.node.get("type") === 848) {
              if (self.formView.options.metadataView) {
                self.formView.options.metadataView.metadataHeaderView.metadataItemNameView.model.set(
                  "name", response.results.nodeName);
              } else {
                self.formView.options.node.set("name", response.results.nodeName)
              }
            }

          }
        },
        error: function (xhr, status, text) {
          var errorContent = xhr.responseJSON ?
                             ( xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                               xhr.responseJSON.error) : lang.defaultErrorGenerateNumber;
          ModalAlert.showError(errorContent);
        }
      };
      connector.extendAjaxOptions(ajaxOptions);
      connector.makeAjaxCall(ajaxOptions);
    },
    getV2Url: function (url) {
      return url.replace('/v1', '/v2');
    },
    invalidFieldChange: function(event) {

        var fieldId = document.getElementById(event.target.id).closest('.alpaca-container-item').getAttribute('data-alpaca-container-item-name');
        var self = this;

        _.each(this.options.alpaca.schema.depattrlist, function (depattr) {
            if (depattr === fieldId) {
                _.each(self.parentsattrData, function (element) {
                    if (element.id === fieldId) {
                        element.data = null;
                    }
                });
            }
        });

        var beforeChange = this.generatereference;

        this.checkReadyForGenerateReference();

        if (this.create) {
            this.regenerateReference = false;
        } else if (!this.hasValue) {
            this.generatereference = true;
        } else {
            this.generatereference = false;
        }

        if (beforeChange !== this.generatereference) {
            if (this.generatereference) {
                this.$el.find('button.reference-generate-number').removeClass('reference-generate-number-disabled').attr('aria-disabled', 'false');
            } else {
                this.$el.find('.reference-field-generate').addClass('cursor-disabled');
                this.$el.find('button.reference-generate-number').addClass('reference-generate-number-disabled').attr('aria-disabled', 'true');
            }
        }
    },
    parentChange: function (parent) {
      var that = parent;
	  var beforeParentChange = this.generatereference;
	  var afterParentChange;
      if (that !== this) {
        this.insertParentAttrData(parent);
        this.checkReadyForGenerateReference();
        if (this.create) {
          this.regenerateReference = false;
        } else if (!this.hasValue) {
          this.generatereference = true;
        } else {
          this.generatereference = false;
        }
		afterParentChange = this.generatereference;
		if ( beforeParentChange !== afterParentChange ) {
			if( this.generatereference ) {
				this.$el.find('button.reference-generate-number').removeClass('reference-generate-number-disabled').attr('aria-disabled', 'false');
			}else {
				this.$el.find('.reference-field-generate').addClass('cursor-disabled');
				this.$el.find('button.reference-generate-number').addClass('reference-generate-number-disabled').attr('aria-disabled', 'true');
			}
		}
      }

    },
    rmClassificationChange: function () {
	  var beforeParentChange = this.generatereference;
	  var afterParentChange;
      if (this.formView.model.collection && this.formView.model.collection.get("recordsDetails")) {
        this.rmClassificationsAttached = true;
        if (this.create) {
          this.generatereference = true;
        } else {
          this.regenerateReference = true;
        }
      } else {
        this.rmClassificationsAttached = false;
        this.generatereference = false;
        this.regenerateReference = false;
      }
	  this.checkReadyForGenerateReference();
	  var depFieldsText = this.getDependencyInlineText();
	  var btnDesc = this.alpacaField.options.label + ", " + (this.hasValue ? lang.reGenRefNumber : lang.genRefNumber) + ", " 
					+ (this.canRegenerateReference ? depFieldsText : "");
	  this.$el.find('.reference-field .reference-field-generate-read .reference-field-generate-text').text(depFieldsText);
	  this.$el.find('button.reference-generate-number').attr('aria-label',btnDesc);
      afterParentChange = this.generatereference;
	  if ( beforeParentChange !== afterParentChange ) {
		if( this.generatereference ) {
			this.$el.find('.reference-field-generate').removeClass('cursor-disabled');
			this.$el.find('button.reference-generate-number').removeClass('reference-generate-number-disabled').attr('aria-disabled', 'false');
		}else {
			this.$el.find('.reference-field-generate').addClass('cursor-disabled');
			this.$el.find('button.reference-generate-number').addClass('reference-generate-number-disabled').attr('aria-disabled', 'true');
		}
	  }
    },
    checkReadyForGenerateReference: function () {
      var count = 0;
      _.each(this.parentsattrData, function (attr) {
        if (attr.data !== undefined && attr.data !== null && attr.data !== "") {
          count++;
        }
      });
        if (count === this.parentsattrData.length) {
            if (this.create && this.hasValue) {
                this.generatereference = false;
                this.regenerateReference = false;
            } else {
                if (this.rmClassificationsAttached) {
                    if (this.create) {
                        this.generatereference = true;
                        this.regenerateReference = false;
                    }
                    else if (this.parentsAttrDataChanged) {
                        this.regenerateReference = true;
                    } else {
                        this.generatereference = true;
                    }
                } else {
                    this.generatereference = false;
                    this.regenerateReference = false;
                }
            }
        }
      else {
        this.generatereference = false;
        this.regenerateReference = false;
      }

    },
    insertParentAttrData: function (parent) {
      var self = this;
      var parentData = parent.curVal;
      _.each(self.parentsattrData, function (attr) {
        if (attr.id === parent.options.dataId) {
          if (typeof parent.curVal === 'object') {
            parentData = parent.curVal.id;
          }
          if (String(attr.data) !== parentData) {
            attr.data = parentData;
            self.generatereference = true;
            self.regenerateReference = true;
            self.parentsAttrDataChanged = true;
          }
        }
      });
    },
    getAttrData: function (field) {
      var attrData, setData, setID, attrID;
      var str = field.split("_");
      var catID = str[0];
      var i = 0;
      if (str.length > 3) {
        if (str.length === 6) {
          setID = str[0] + "_" + str[1];
          setData = this.formView.alpaca.data[setID];
          attrID = field.replace(setID + "_", "");
          if (typeof setData !== 'undefined') {
            attrData = setData[attrID];
          }
          else {
            if (this.formView.metadataview.formViewList.length > 1) {
              for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
                if (typeof this.formView.metadataview.formViewList[i].alpaca.data[attrID] !==
                    'undefined') {
                  attrData = this.formView.metadataview.formViewList[i].alpaca.data[attrID];
                  break;
                }
              }
            }
          }
        } else if (str.length === 7) {
          if (str[2] === catID) {
            setID = str[0] + "_" + str[1];
            setData = this.formView.alpaca.data[setID];
            attrID = str[2] + "_" + str[3] + "_" + str[4] + "_" + str[5];
            attrData = setData[attrID][0];
          } else {
            setID = str[0] + "_" + str[1];
            setData = this.formView.alpaca.data[setID][0];
            attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
            attrData = setData[attrID];
          }

        } else {
          setID = str[0] + "_" + str[1];
          setData = this.formView.alpaca.data[setID][0];
          attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
          attrData = setData[attrID][0];
        }
      }
      else {
        field = str[0] + "_" + str[1];
        attrData = this.formView.alpaca.data[field];
        if (typeof attrData === 'undefined' && this.formView.metadataview.formViewList.length > 1) {
          for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
            if (typeof this.formView.metadataview.formViewList[i].alpaca.data[field] !==
                'undefined') {
              attrData = this.formView.metadataview.formViewList[i].alpaca.data[field];
              break;
            }
          }
        }
        if (str.length === 3) {
          attrData = attrData[0];
        }
      }
      return attrData;

    },
    getAttrElement: function (field) {
      var element, setID, attrID;
      var str = field.split("_");
      var catID = str[0];
      var i = 0;
      if (str.length > 3) {
        if (str.length === 6) {
          setID = str[0] + "_" + str[1];
          element = this.formView.$el.alpaca().childrenByPropertyId[setID];
          attrID = field.replace(setID + "_", "");
          if (typeof element !== 'undefined') {
            element = element.childrenByPropertyId[attrID];
          }
          else {
            if (this.formView.metadataview.formViewList.length > 1) {
              for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
                if (typeof this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[attrID] !==
                    'undefined') {
                  element = this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[attrID];
                  break;
                }
              }
            }
          }
        } else if (str.length === 7) {
          if (str[2] === catID) {
            setID = str[0] + "_" + str[1];
            element = this.formView.$el.alpaca().childrenByPropertyId[setID];
            attrID = str[2] + "_" + str[3] + "_" + str[4] + "_" + str[5];
            element = element.childrenByPropertyId[attrID].children[0];
          } else {
            setID = str[0] + "_" + str[1];
            element = this.formView.$el.alpaca().childrenByPropertyId[setID].children[0];
            attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
            element = element.childrenByPropertyId[attrID];
          }

        } else {
          setID = str[0] + "_" + str[1];
          element = this.formView.$el.alpaca().childrenByPropertyId[setID].children[0];
          attrID = str[3] + "_" + str[4] + "_" + str[5] + "_" + str[6];
          element = element.childrenByPropertyId[attrID].children[0];
        }

      }
      else {
        field = str[0] + "_" + str[1];
        element = this.formView.$el.alpaca().childrenByPropertyId[field];
        if (typeof element === 'undefined' && this.formView.metadataview.formViewList.length > 1) {
          for (i = 0; i < this.formView.metadataview.formViewList.length; i++) {
            if (typeof this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[field] !==
                'undefined') {
              element = this.formView.metadataview.formViewList[i].$el.alpaca().childrenByPropertyId[field];
              break;
            }
          }
        }
        if (str.length === 3) {
          element = element.children[0];
        }
      }
      return element;

    },
    allowEditOnClickReadArea: function () {
      return false;
    },
    getFormData: function () {
      var urlParameters = "";
      var formData = {};
      var create = this.create;
      var node_id = this.node.attributes.id;
      var parent_id = this.node.attributes.parent_id;
      var category_id = this.catId;
      var attribute_keys ="";
      var attribute_values = "";
      var count = 0;
      var cache_id = this.options.alpaca.schema.cacheId;
	  var rmClassData;
      if (create !== undefined) {
        formData.create = create;
      }
      if (!create) {
        if (node_id !== undefined) {
          formData.node_id = node_id;
        }
        return formData;
      }
      if (cache_id !== undefined) {
        formData.cache_id = cache_id;
      }
      if (parent_id !== undefined) {
        if (typeof parent_id === 'object') {
          parent_id = parent_id.id;
        }
        formData.parent_id = parent_id;
      }
      if (category_id !== undefined) {
        formData.category_id = category_id;
      }
	  if (this.formView.model.collection.get("recordsDetails")) {
		  rmClassData = this.formView.model.collection.get("recordsDetails").get("data")
		  if( rmClassData.rmclassification_id && rmClassData.rmclassification_id[0] !== 0 ) {
			  formData.rm_class_ids = rmClassData.rmclassification_id[0];
		  } else if( rmClassData.inherited_rmclassification_id ){
			  formData.rm_class_ids = rmClassData.inherited_rmclassification_id[0];
		  }
	  }      
      if (this.parentattrIds.length > 0) {
        var length = this.parentsattrData.length;
        _.each(this.parentsattrData, function (attr) {
          count++;
          if (count !== length) {
            attribute_keys = "" + attribute_keys + "'" + attr.id + "',";
            attribute_values = "" + attribute_values + "'" + attr.data + "',";
          } else {
            attribute_keys = attribute_keys + "'" + attr.id + "'";
            attribute_values = attribute_values + "'" + attr.data + "'";
          }
        });

        if (attribute_values !== undefined && attribute_keys !== undefined ) {
          formData.attribute_keys = attribute_keys.toString();
          formData.attribute_values = attribute_values.toString();
        }

      }

      return formData;
    }

  });

  return ReferenceFieldView;
})
;
