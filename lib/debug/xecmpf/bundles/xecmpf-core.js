csui.define('xecmpf/controls/bosearch/bosearch.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone'
], function (_, $, Backbone) {
  'use strict';

  var BoSearchModel = Backbone.Model.extend({

    constructor: function BoSearchModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  return BoSearchModel;

});

/**
 * Created by stefang on 24.05.2016.
 */
// Fetches the search form.
csui.define('xecmpf/controls/bosearch/searchform/bosearchform.model',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/url", "csui/models/resource"
], function (module, $, _, Backbone, log, Url, ResourceModel) {
  "use strict";

  var BusinessObjectSearchFormModel = Backbone.Model.extend(
      _.defaults({

        constructor: function BusinessObjectSearchFormModel(attributes, options) {
          options || (options = {});

          attributes = _.extend({data:{},options:{},schema:{}},attributes);
          Backbone.Model.prototype.constructor.call(this, attributes, options);

          this.makeResource(options);

        },

        url: function () {
          var path = 'forms/businessobjects/search',
              bo_type_id = this.get("id"),
              params = { bo_type_id: bo_type_id },
              resource = path + '?' + $.param(params),
              baseurl = this.connector.connection.url,
              url = Url.combine(baseurl&&baseurl.replace('/v1', '/v2')||baseurl, resource);
          return url;
        },

        parse: function (response) {
          var form;
          if (response && response.results) {
            form = response.results[1];
            form.id = this.get("id");
            form.name = response.results[0].data.bo_type_name;
            form.bus_att_metadata_mapping = response.results["0"].data.business_attachments && response.results["0"].data.business_attachments.metadata_mapping;
            if (form.schema) {
              delete form.schema.title; // avoid title being displayed by the FormView
            }
          }
          return form;
        }

      }, ResourceModel(Backbone.Model)));
  
  return BusinessObjectSearchFormModel;

});

csui.define('xecmpf/controls/property.panels/reference/impl/workspace.reference.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  "csui/utils/url",
  "csui/models/mixins/node.connectable/node.connectable.mixin"
], function (_, $, Backbone, Url,
    NodeConnectableMixin) {
  'use strict';

  var WorkspaceReferenceModel = Backbone.Model.extend({

    constructor: function WorkspaceReferenceModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeNodeConnectable(options);

    },

    sync: function (method, model, options) {
      var node_id, path, baseurl, url, bo_id, params, bo_type_id;
      if (method === "read") {
        node_id = this.get("id");
        path = _.str.sformat('businessworkspaces/{0}', node_id);
        baseurl = this.connector.connection.url;
        url = Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, path);
        options.url = url;
      } else if (method === "update") {
        node_id = this.get("id");
        path = _.str.sformat('businessworkspaces/{0}/workspacereferences', node_id);
        bo_id = this.get("bo_id");
        bo_type_id = this.get("bo_type_id");
        params = {bo_id: bo_id, bo_type_id: bo_type_id};
        baseurl = this.connector.connection.url;
        url = Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, path);
        options.url = url;
        options.data = $.param(params);
      } else if (method === "delete") {
        var ext_system_id, queryParams;
        node_id = this.get("id");
        bo_id = this.get("bo_id");
        bo_type_id = this.get("bo_type_id");
        ext_system_id = this.get("ext_system_id");
        params = {bo_id: bo_id, bo_type_id: bo_type_id, ext_system_id: ext_system_id};
        queryParams = $.param(params);
        path = _.str.sformat('businessworkspaces/{0}/workspacereferences?{1}', node_id, queryParams);
        baseurl = this.connector.connection.url;
        url = Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, path);
        options.url = url;
      }
      return Backbone.sync(method, model, options);
    },

    parse: function (response) {
      var data       = response && response.results && response.results.data || {},
          actions    = response && response.results && response.results.actions &&
                       response.results.actions.data || {},
          properties = data.properties || {},
          business   = data.business_properties || {};
      business.business_object_id && (properties.bo_id = business.business_object_id);
      business.business_object_type_id &&
      (properties.bo_type_id = business.business_object_type_id);
      business.business_object_type_name &&
      (properties.bo_type_name = business.business_object_type_name);
      business.external_system_id && (properties.ext_system_id = business.external_system_id);
      business.external_system_name && (properties.ext_system_name = business.external_system_name);
      business.workspace_type_id && (properties.workspace_type_id = business.workspace_type_id);
      business.workspace_type_name &&
      (properties.workspace_type_name = business.workspace_type_name);
      properties.change_reference = !!actions['change-reference'];
      properties.complete_reference = !!actions['complete-reference'];

      return properties;
    }

  });

  NodeConnectableMixin.mixin(WorkspaceReferenceModel.prototype);

  return WorkspaceReferenceModel;

});

csui.define('xecmpf/controls/property.panels/reference/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/controls/property.panels/reference/impl/nls/root/lang',{
  cannotCompleteBusinessReference: "You do not have permission to complete the business reference",
  errorUpdatingWorkspaceReference: "Error updating workspace reference.",
  businessObjectIdLabel: "Reference object",
  referenceTabTitle: 'Reference',
  referenceSearchButtonTitle: 'Search',
  referenceSearchButtonLabel: '{0} in {1}',
  referenceRemoveButtonTitle: 'Remove',
  referenceReplaceButtonTitle: 'Replace',
  referencePanelOverrideNote: 'If you add a workspace reference, workspace name and other attributes will be overwritten with metadata of the business object.',
  removeBOReferenceAlertTitle: 'Remove business object reference',
  removeBOReferenceAlertDescription: 'Remove object reference {0} from this business workspace?',
  removeBOReferenceSuccessMessage: 'Business object reference successfully removed.',
  errorRemovingWorkspaceReference: 'Error removing workspace reference.'
});


csui.define('xecmpf/controls/property.panels/reference/impl/reference.panel.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang'
], function (_, $, Backbone, lang) {
  'use strict';

  var ReferencePanelModel = Backbone.Model.extend({

    constructor: function ReferencePanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.set('id', 'conws-reference');
      this.set('title', lang.referenceTabTitle);
      
    }
    
  });

  return ReferencePanelModel;

});

/**
 * Fetches the workspace info for a given node.
 */
csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.category.model',['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/url',
    'csui/models/node/node.model',
    'csui/models/mixins/fetchable/fetchable.mixin'
], function ($, _,
             Backbone,
             log,
             Url,
             NodeModel,
             FetchableMixin) {

    var AttachmentContextCategoryModel = NodeModel.extend({

        // constructor gives an explicit name to the object in the debugger
        constructor: function AttachmentContextCategoryModel(attributes, options) {
            options || (options = {});

            NodeModel.prototype.constructor.call(this, attributes, options);
            this.node = options.node;
            this.category_id = options.category_id;

        },
        fetch: function (options) {
            options || (options = {});
            // If not overridden, Use the v1 URL for GET requests
			var categoryOptions = _.extend({},options)
			 if (!categoryOptions.url) {
                categoryOptions.url = _.result(this, 'url');
            }
            if (this.node.get("id")) {
                return NodeModel.prototype.fetch.call(this, categoryOptions);
            } else {
                return $.Deferred().resolve().promise();
            }
        },

        url: function () {
            return Url.combine(this.connector.connection.url,
                // yes, take v1
                'nodes', this.node.get("id"), 'categories', this.category_id).replace('/v2/', '/v1/');
        },
        parse: function (response) {
            return response.data;
        }
    });
    return AttachmentContextCategoryModel;
});


csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.category.factory',['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.category.model'
], function (_,
             ModelFactory,
             ConnectorFactory,
             NodeModelFactory,
             AttachmentContextFactoryModel) {

    var AttachmentContextCategoryFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContextCategory',

        constructor: function AttachmentContextCategoryFactory(context, options) {
            ModelFactory.prototype.constructor.apply(this, arguments);
            options.attachmentContextCategory = options.attachmentContextCategory || {};

            var node = options.attachmentContextCategory.node ||
                    context.getModel(NodeModelFactory, options),
                connector = options.attachmentContextCategory.connector ||
                    context.getObject(ConnectorFactory, options);

            this.property = new AttachmentContextFactoryModel({},
                {
                    category_id: options.attachmentContextCategory.category_id,
                    connector: connector,
                    node: node
                });

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextCategoryFactory;

});

csui.define('xecmpf/widgets/boattachments/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('xecmpf/widgets/boattachments/impl/nls/root/lang',{
    dialogTitle: 'Business attachments',
    searchPlaceholder: 'Search %1',
    noResultsPlaceholder: 'No business attachments to display.',
    errorFieldFormatTagUnrecognized: 'Invalid format specification for {0}.',
    errorCustomColumnConfigInvalid: "Invalid custom column configuration: {0}.",
    errorCustomColumnMissingBraces: "Missing curly braces in custom column configuration: {0}.",
    errorOrderByMustNotBeString: "Configuration 'orderBy' must be an object not a string.",
    errorOrderByMissingBraces: "Missing curly braces in 'orderBy' configuration.",
    errorFilteringFailed: 'Filtering of result list failed. Please contact your administrator.',
    noAttachmentsFound: 'No business attachments found.',
    businessAttachments: 'Business attachments',
    CommandSnapshot: 'Snapshot',
    addBusinessAttachment: 'Add business attachment',
    fileSizeByte: "Bytes",
    fileSizeKByte: "KB",
    fileSizeMByte: "MB",
    parent_id: 'Location',
    reservedBy: 'Reserved by %1',
    snaphotCreated: 'Snapshot created',
    snaphotFailed: 'Snapshot creation failed',
    CommandDoneVerbCreated: 'created',
    fileSizeGByte: "GB",
    items: 'items',
    invalidConfigurationNoBusObjDisplay:'Cannot display business attachments because there is no business object defined.',
    invalidConfigurationNoBusObjConfigured:'No business object type configured for workspace display.',
    invalidConfigurationNoBusObjAvailable:'Cannot display business attachments because there is no business object available.',
    noBusinessObjectFound: 'No business object found',
    invalidConfiguration: 'Invalid widget configuration. Business object key, business object type and business application ID must be set.'
});


/**
 * Fetches the workspace info for a given node.
 */
csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.model',['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/url',
    'csui/models/node/node.model',
    'csui/dialogs/modal.alert/modal.alert',
    'xecmpf/models/boattachmentcontext/attachmentcontext.category.factory',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'csui/models/mixins/resource/resource.mixin'

], function ($, _,
             Backbone,
             log,
             Url,
             NodeModel,
             ModalAlert,
             AttachmentContextCategoryFactory,
             lang, ResourceMixin ) {

    var AttachmentContextBusinessObjectInfoModel = Backbone.Model.extend({

        // constructor gives an explicit name to the object in the debugger
        constructor: function AttachmentContextBusinessObjectInfoModel(attributes, options) {
            options || (options = {});

            Backbone.Model.prototype.constructor.call(this, attributes, options);
            this.makeResource(options);

            this.node = options.node;
            this.data = options.data;
            this.connector = options.connector;
            this.context = options.context;
            this.invalidConfigurationShown = false;
            this.invalidErrorMessage = lang.noBusinessObjectFound

        },
        _logInvalidConfiguration: function() {
          this._isConfigEmpty(this.busObjectKey) && log.warn('Business object key is not set') && console && console.log(log.last);
          this._isConfigEmpty(this.busObjectType) && log.warn('Business object type is not set') && console && console.log(log.last);
          this._isConfigEmpty(this.extSystemId) && log.warn('Business application ID is not set')  && console && console.log(log.last);
        },
        _logEmptyBusObjKeyConfiguration: function() {
          log.warn('Empty business object key in business attachment widget') && console && console.log(log.last);
          this.invalidConfigurationShown = true;
        },
        _logEmptyBusObjTypeConfiguration: function() {
          log.warn('Empty business object type in business attachment widget') && console && console.log(log.last);
          this.invalidConfigurationShown = true;
        },
        _logEmptyBusAppIDConfiguration: function() {
          log.warn('Empty business application ID in business attachment widget')  && console && console.log(log.last);
          this.invalidConfigurationShown = true;
        },

        _showInvalidConfigurationError: function(msg) {
          !this.invalidConfigurationShown && ModalAlert.showError(msg);
          this.invalidConfigurationShown = true;
        },
        _isConfigEmpty: function(config){
          // For single Value attributes, config value is of type string.
          // For multi value attribute, config value is of type object (ie., list of values).
          // If a multi value attribute has a single value then checking wheter it is empty or not.
          // If a multi value attribute has multiple empty/non empty values then it is considered as empty or non set configuration.
          var isConfigEmpty = _.isObject(config) ? (config.length === 1 ? _.isEmpty(config[0]) : true) : _.isEmpty(config);
          return isConfigEmpty

        },
        _isConfigValid: function() {
          var isBusKeyEmpty = this._isConfigEmpty(this.busObjectKey),
              isBusObjEmpty = this._isConfigEmpty(this.busObjectType),
              isExtSystemEmpty = this._isConfigEmpty(this.extSystemId);

          return !isBusObjEmpty &&  !isExtSystemEmpty && !isBusKeyEmpty;
        },
        _isWorkspaceWithoutConfig: function() {
            return  _.isEmpty(this._getCategoryInfo(this.data.busObjectId)) &&
                    _.isEmpty(this._getCategoryInfo(this.data.busObjectType)) &&
                    _.isEmpty(this._getCategoryInfo(this.data.extSystemId)) &&
                    this.node.get("id") && this.node.get("type") === 848;
        },
        _loadCategories: function() {
            var promises = [],
                self = this,
                busObjectIdCatInfo = this._getCategoryInfo(this.data.busObjectId),
                busObjectTypeCatInfo = this._getCategoryInfo(this.data.busObjectType),
                extSystemIdCatInfo = this._getCategoryInfo(this.data.extSystemId);

            if (busObjectIdCatInfo.categoryId) {
                var catModelObjectId = this.context.getModel(AttachmentContextCategoryFactory,
                    {
                        attributes: {
                            category_id: busObjectIdCatInfo.categoryId
                        },
                        category_id: busObjectIdCatInfo.categoryId,
                        node: this.node,
                        connector: this.connector
                    });

                // got the model for the bus. obj. id
                promises.push(catModelObjectId.fetch());
                this.listenTo(catModelObjectId, 'sync', function () {
                        // object key must be set via category
                        var catVal = catModelObjectId.get(busObjectIdCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectKey = catVal;
                        }  else {
                            self._logEmptyBusObjKeyConfiguration();
                        }
                        /*// but check if we can get also the business object type ....
                        catVal = catModelObjectId.get(busObjectTypeCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectType = catVal;
                        } else {
                          self._logEmptyBusObjTypeConfiguration();
                        }
                                    // ... and the external system ...
                                    catVal = catModelObjectId.get(extSystemIdCatInfo.categoryAttr);
                                    if (!self._isConfigEmpty(catVal)) {
                                        self.extSystemId = catVal;
                                    } else {
                          self._logEmptyBusAppIDConfiguration();
                        }*/
                    }
                );
                this.listenTo(catModelObjectId, "error", function () {
                    this._showInvalidConfigurationError(arguments[1].responseJSON.error);
                });

            } else {
                // key is fixed
                this.busObjectKey = busObjectIdCatInfo.categoryAttr;
            }
            // load category for business object type if necessary
            if (busObjectTypeCatInfo.categoryId) {
                var catModelObjectType =
                    this.context.getModel(AttachmentContextCategoryFactory,
                        {
                            attributes: {
                                category_id: busObjectTypeCatInfo.categoryId
                            },
                            category_id: busObjectTypeCatInfo.categoryId,
                            node: this.node,
                            connector: this.connector
                        });

                promises.push(catModelObjectType.fetch());
                this.listenTo(catModelObjectType, 'sync', function () {
                        // check again if we can get from this category all entries
                        // so we can skip further category calls
                       /* var catVal = catModelObjectType.get(busObjectIdCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectKey = catVal;
                        } else {
						              	self._logEmptyBusObjKeyConfiguration();
					            	}*/

                        var catVal = catModelObjectType.get(busObjectTypeCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectType = catVal;
                        } else {
                            self._logEmptyBusObjTypeConfiguration();
                        }

                      /*  catVal = catModelObjectType.get(extSystemIdCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.extSystemId = catVal;
                        } else {
                          self._logEmptyBusAppIDConfiguration()
                        }*/
                    }
                );
                this.listenTo(catModelObjectType, "error", function () {
                    this._showInvalidConfigurationError(arguments[1].responseJSON.error);
                });
            } else {
                this.busObjectType = busObjectTypeCatInfo.categoryAttr;
            }
            // get external system category
            if (extSystemIdCatInfo.categoryId) {
                var catModelExtSystem = this.context.getModel(AttachmentContextCategoryFactory,
                    {
                        attributes: {
                            category_id: extSystemIdCatInfo.categoryId
                        },
                        category_id: extSystemIdCatInfo.categoryId,
                        node: this.node,
                        connector: this.connector
                    });


                promises.push(catModelExtSystem.fetch());
                this.listenTo(catModelExtSystem, 'sync', function () {
                        // check again if we can get from this category all entries
                        // so we can skip further category calls
                       /* var catVal = catModelExtSystem.get(busObjectIdCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectKey = catVal;
                        } else {
                          self._logEmptyBusObjKeyConfiguration();
                        }

                                    catVal = catModelExtSystem.get(busObjectTypeCatInfo.categoryAttr);
                                    if (!self._isConfigEmpty(catVal)) {
                                        self.busObjectType = catVal;
                                    } else {
                           self._logEmptyBusObjTypeConfiguration();
                        }*/

                        var catVal = catModelExtSystem.get(extSystemIdCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.extSystemId = catVal;
                        } else {
                            self._logEmptyBusAppIDConfiguration();
                        }
                    }
                );
                this.listenTo(catModelExtSystem, "error", function () {
                    this._showInvalidConfigurationError(arguments[1].responseJSON.error);
                });
            } else {
                this.extSystemId = extSystemIdCatInfo.categoryAttr;
            }
            return promises;
        },
        _getCategoryInfo: function (configValue) {
            var res, categoryId, categoryAttr;

            if (!_.isEmpty(configValue)) {
                var regExp = /{categories.(([0-9]+)_[0-9]+[_]?[0-9]*[_]?[0-9]*)}/g;
                if (regExp.test(configValue)) {
                    regExp.lastIndex = 0;
                    res = regExp.exec(configValue);
                    categoryId = res[2];
                    categoryAttr = res[1];

                    return {
                        categoryId: categoryId,
                        categoryAttr: categoryAttr
                    }
                } else {
                    return {
                        categoryId: "",
                        categoryAttr: configValue
                    };
                }
            }
            return "";
        },

        // computes the REST API URL used to access the metadata.
        url: function () {
            var url;

            if (this._isWorkspaceWithoutConfig() === true) {
                url = Url.combine(this.connector.connection.url,
                    'businessworkspaces/' + this.node.get("id") + '?metadata');
            } else {
                url = Url.combine(this.connector.connection.url,
                    'businessworkspacetypes' +
                    '?ext_system_id=' + this.extSystemId +
                    '&expand_templates=true&bo_type=' + this.busObjectType);
            }
            return url.replace('/v1/', '/v2/');
        },
        parse: function (response) {

            if (this._isWorkspaceWithoutConfig() === true) {
                var busProps =  _.find(response.results.data.workspace_references,
                        function(wksp_ref) {
                            return (wksp_ref.has_default_display === true)
                        });
                if (_.isUndefined(busProps)) {
                    if ( response.results.data.business_properties.isEarly) {
                        this.invalidConfigurationShown = true;
                        this.invalidErrorMessage = lang.invalidConfigurationNoBusObjDisplay;
                    } else {
                        this.invalidConfigurationShown = true;
                        this.invalidErrorMessage =lang.invalidConfigurationNoBusObjAvailable;
                    }
                    return null;
                } else {
                    return {
                        busObjectKey: busProps.business_object_id,
                        busObjectType: busProps.business_object_type,
                        extSystemId: busProps.external_system_id,
                        titleIcon: response.results.data.wksp_info.wksp_type_icon
                    }
                }
            } else {
                return {
                    busObjectKey: this.busObjectKey,
                    busObjectType: this.busObjectType,
                    extSystemId: this.extSystemId,
                    titleIcon: response.results.length > 0 &&
                    response.results[0].data.wksp_info.wksp_type_icon
                }
            }
        }
    });
    ResourceMixin.mixin(AttachmentContextBusinessObjectInfoModel.prototype);

    var originalFetch = AttachmentContextBusinessObjectInfoModel.prototype.fetch;
    AttachmentContextBusinessObjectInfoModel.prototype.fetch = function (options) {
        var deferred = $.Deferred(),
            promises = this._loadCategories(),
            self = this;

        if (promises.length > 0) {
            $.when.apply($, promises).done(function () {
                // if one setting is determined via category all entries
                // must be set
                if (self._isConfigValid() === true)
                {
                    originalFetch.call(self, options).done(function () {
                        deferred.resolve();
                    });
                } else {
                    self._logInvalidConfiguration();
                    self._showInvalidConfigurationError(lang.invalidConfiguration);
                    deferred.resolve();
                }

            })
        } else {
            if (this._isWorkspaceWithoutConfig() === true || this._isConfigValid() === true)
            {
                return originalFetch.call(this, options);
            } else {
                this._logInvalidConfiguration();
                this._showInvalidConfigurationError(lang.invalidConfiguration);
                return deferred.resolve().promise();
            }

        }
        return deferred.promise();
    };

    return AttachmentContextBusinessObjectInfoModel;
});


/**
 * Fetches the workspace id of the effective businessworkspace for a given node.
 */

csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.node.model',['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/url',
    "csui/models/resource"
], function ($, _, Backbone,
             log,
             Url,
             ResourceModel) {

    var AttachmentContextNode = Backbone.Model.extend(
        _.defaults({

            workspaceSpecific: true,

            constructor: function AttachmentContextNode(attributes, options) {
                options || (options = {});

                Backbone.Model.prototype.constructor.call(this, attributes, options);

                this.options = options;
                this.makeResource(options);
                this.listenTo(this.options.node, 'change:id', this.syncToNode);

                // and initially set id if it fits.
                this.syncToNode();
            },

            syncToNode: function () {
                var node = this.options.node;
                var node_id = node.get("id");
                if (node.get("type") === 848) {
                    this.set({id: node_id, type: 848});
                }
            },

            url: function () {
                var nodeId = this.options.node.get('id');
                var url;

                if (this.options.data && this.options.data.busObjectId &&
                    this.options.data.busObjectType &&
                    this.options.data.extSystemId) {

                    url = Url.combine(this.options.connector.connection.url,
                        '/businessworkspaces');
                    url += '?expanded_view=true&where_bo_type=' + this.options.data.busObjectType;
                    url += '&where_ext_system_id=' + this.options.data.extSystemId;
                    url += '&where_bo_id=' + this.options.data.busObjectId;
                    url = url.replace('/v1', '/v2'); // yes, we need to send a v1 call!!!
                } else {
                    url = Url.combine(this.options.connector.connection.url, 'nodes', nodeId,
                        'businessworkspace');
                    url = url.replace('/v2', '/v1'); // yes, we need to send a v1 call!!!
                }
                return url;
            },

            fetch: function (options) {
                if (this.options.node.get('id')) {
                    if (this.options.node.get('type') !== 848) {
                        log.debug("Fetching the workspace id for {0} from server.", this) && console.log(log.last);
                        options || (options = {});
                        // If not overridden, Use the v1 URL for GET requests
                        if (!options.url) {
                            options.url = _.result(this, 'url');
                        }
                        return this.Fetchable.fetch.call(this, options);
                    } else {
                        log.debug("Fetching the workspace id for {0} from node.", this) && console.log(log.last);
                        this.set({id: this.options.node.get('id'), type: 848});
                        return $.Deferred().resolve().promise();
                    }

                } else if (this.options.data && this.options.data.busObjectId && // integration scenario
                            this.options.data.busObjectType &&
                            this.options.data.extSystemId) {

                    log.debug("Fetching the workspace id for {0} from server.", this) && console.log(log.last);
                    options || (options = {});
                    // If not overridden, Use the v1 URL for GET requests
                    if (!options.url) {
                        options.url = _.result(this, 'url');
                    }
                    return this.Fetchable.fetch.call(this, options);

                } else {
                    return $.Deferred().resolve().promise();
                }
            },

            parse: function (response) {
                if (response.results) {
                    response = response.results.length>0?response.results[0].data.properties:null;
                }

                if (response) {
                    return {id: response.id, type: response.type};
                }
            },

            toString: function () {
                // Format a string for logging purposes
                return "node:" + this.get('id');
            }

        }, ResourceModel(Backbone.Model)));

    return AttachmentContextNode;

});

csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.node.factory',['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.node.model'
], function (_,
             ModelFactory,
             ConnectorFactory,
             NodeModelFactory,
             AttachmentContextNodeModel) {

    var AttachmentContextNodeFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContextNode',

        constructor: function AttachmentContextNodeFactory(context, options) {
            ModelFactory.prototype.constructor.apply(this, arguments);

            var node = options.attachmentContextNode.node ||
                    context.getModel(NodeModelFactory, {}),
                connector = options.attachmentContextNode.connector ||
                    context.getObject(ConnectorFactory, {});

            this.property = new AttachmentContextNodeModel({}, {data: options.attachmentContextNode.data,
                connector: connector, node: node});

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextNodeFactory;

});

csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.model'

], function (_,
             ModelFactory,
             ConnectorFactory,
             NodeModelFactory,
             AttachmentContextBusinessObjectInfoModel) {

    var AttachmentContextBusinessObjectInfoFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContextBusinessObjectInfo',

        constructor: function AttachmentContextBusinessObjectInfoFactory(context, options) {
            options = options || {};
            ModelFactory.prototype.constructor.apply(this, arguments);

            var node = options.node ||  context.getModel(NodeModelFactory, {}),
                connector = options.connector || context.getObject(ConnectorFactory, {}),
                data = options.attachmentContextBusinessObjectInfo.data || {};

            _.defaults(data, {
                busObjectId: "",
                busObjectType: "",
                extSystemId: ""
            })

            this.property = new AttachmentContextBusinessObjectInfoModel({},
                {context: context, data: data, connector: connector, node: node});

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextBusinessObjectInfoFactory;

});

/**
 * Created by stefang on 24.11.2015.
 */
csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.model',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/contexts/context',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.node.factory',
    'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',
    'xecmpf/models/boattachmentcontext/attachmentcontext.category.factory'

], function ($, _, Backbone,
             log,
             Context,
             NodeModelFactory,
             AttachmentContextNodeFactory,
             AttachmentContextBusinessObjectInfoFactory,
             AttachmentContexCategoryFactory) {

    var AttachmentContextModel = Context.extend({

        constructor: function AttachmentContextModel(attributes, options) {
            options || (options = {});

            Context.prototype.constructor.apply(this, arguments);

            this.options = options;

            this.attachmentSpecific = {};
            this.attachmentSpecific[NodeModelFactory.prototype.propertyPrefix] = true;
            this.attachmentSpecific[AttachmentContextNodeFactory.prototype.propertyPrefix] = true;
            this.attachmentSpecific[AttachmentContextBusinessObjectInfoFactory.prototype.propertyPrefix] = true;
            this.attachmentSpecific[AttachmentContexCategoryFactory.prototype.propertyPrefix] = true;

            this.attachmentSpecificFactories = [
                NodeModelFactory,
                AttachmentContextNodeFactory,
                AttachmentContextBusinessObjectInfoFactory,
                AttachmentContexCategoryFactory
            ];

            // get the navigation node, that triggers the attachment context node
            this.options.node = this.options.context.getModel(NodeModelFactory);

            // attachment context node is the first model in the attachment context and we fetch it first
            this.wkspid = this.getModel(AttachmentContextNodeFactory,
                {data: this.options.data, node: this.options.node, connector: this.options.node.connector});

            // and provide an attachment node, for compatibility with the outer context
            this.node = this.getModel(NodeModelFactory);

            if (this.wkspid.get("id") === this.options.node.get("id")) {
                this.node.set(this.options.node.attributes);
            } else {
                this.node.set("id", this.wkspid.get("id"));
            }
        },

        setAttachmentSpecific: function (Factory) {
            this.attachmentSpecific[Factory.prototype.propertyPrefix] = true;
            if (!this._isAttachmentSpecificFactory(Factory)) {
                this.attachmentSpecificFactories.push(Factory);
            }
        },

        isAttachmentSpecific: function (Factory) {
            var found = false;
            if (this.attachmentSpecific[Factory.prototype.propertyPrefix]) {
                found = true;
            } else if (this._isAttachmentSpecificFactory(Factory)) {
                // remember property prefix, so we find it faster next time.
                this.attachmentSpecific[Factory.prototype.propertyPrefix] = true;
                found = true;
            }
            return found;
        },

        _isAttachmentSpecificFactory: function (Factory) {
            var found = false;
            for (var ii = 0; ii < this.attachmentSpecificFactories.length; ii++) {
                if (this.attachmentSpecificFactories[ii] === Factory) {
                    found = true;
                    break;
                }
            }
            return found;
        },

        getOuterContext: function () {
            return this.options.context;
        },

        getModel: function () {
            return this._getAttachmentObject("getModel", arguments);
        },
        getCollection: function () {
            return this._getAttachmentObject("getCollection", arguments);
        },
        getObject: function () {
            return this._getAttachmentObject("getObject", arguments);
        },

        _getAttachmentObject: function (methodName, params) {
            var model;
            if (this.isAttachmentSpecific(params[0])) {
                model = Context.prototype[methodName].apply(this, params);
            } else {
                model = this.options.context[methodName].apply(this.options.context, params);
            }

            return model;
        },

        fetch: function (options) {
            this.fetched = false;
            var old_id = this.wkspid.get("id"),
                self   = this;
            // First fetch attachment context node and wait for the result.
            // As we do this in the fetch, we delay the slide-in animation of the perspective,
            // so the perspective is sliding in only after we have triggered all fetches here.
            // This is for sliding in smoothly, as otherwise it is stumbling on mobiles/tablets.

            return this.wkspid // get workspace id for given node
                .fetch()
                .then(function () {
                    self.fetched = true;
                    var new_id = self.wkspid.get("id");
                    var promises;
                    log.debug("wkspid old {0}, new {1}.", old_id, new_id) &&
                    console.log(log.last);
                    // then, if possible, first get values for node models from context node
                    // and for all other models do a normal fetch using the factory.
                    // note: node models represent persisted or non persisted nodes for an id.
                    // They are triggered from outside by setting the id.
                    // So if the workspace id of the context node changes
                    // we must set the id of all our node models in the attachment context.

                    // get node factory
                    var factories = self.getFactories ? self.getFactories() : self._factories;
                    var obj = _.find(factories, function (f) {
                        return f.property === self.node
                    });
                    log.debug("going to fetch {0}.", obj.propertyPrefix) && console.log(log.last);
                    var nodepromise, isWksp;
                    // update inner node (inner context) !!!
                    // Workspaces:
                    // 1. From current navigation node we determine a parent workspace id
                    // 2. Inner node is set to workspace node
                    // Containers:
                    // Current navigation node is set to inner node
                    if (new_id === self.options.node.get("id")) {
                        self.node.set(self.options.node.attributes);
                        // Check if the current workspace is already fetched.No need to fetch again
                        // if the workspace is already fetched( breadcrumb/links from other widgets like
                        // related,business attachments,workspaces etc.,)
                        if (self.wkspStatus && self.wkspStatus.wksp_id === new_id &&
                            self.wkspStatus.fetched) {
                            return $.Deferred()
                                .resolve(self, {}, options)
                                .promise();
                        }
                        isWksp = true
                    } else {
                        isWksp = false;
                        // drill down from workspace into folder
                        if (new_id) {
                            self.node.set("id", new_id);
                            self.node.set("type", 848);
                            if (obj.fetch) {
                                // Node other than a workspace - accessed via bookmark/shortcut/direct-access
                                // 1) Fetch if the node is accessed directly via bookmark and attachment context is
                                //    not already fetched(!old_id)
                                // 2) Fetch if the node is accessed via shortcut where the attachment context is
                                //    changed (old_id !== new_id)
                                // 3) Skip the fetch when the node belongs to already fetched attachment context
                                if (!old_id || (old_id && new_id && old_id !== new_id)) {
                                    nodepromise = obj.fetch();
                                }
                            }
                        } else { // container is not a workspace

                            self.node.set(self.options.node.attributes);
                        }
                    }

                    // after setting the id in the node model, again get the factories to be sure, that
                    // we have also the factories, that were added during the change:id propagation.
                    factories = self.getFactories ? self.getFactories() : self._factories;
                    // trigger business attachment call
                    promises = _.chain(factories)
                        .map(function (obj) {
                            log.debug("going to fetch {0}.", obj.propertyPrefix) &&
                            console.log(log.last);
                            if (obj.property !== self.wkspid &&
                                obj.property !== self.node) {

                                if (obj.fetch) {
                                    // 1. Fetch if the workspace is accessed for the first time (isWksp)
                                    // 2. Fetch if the node inside a workspace is accessed directly
                                    //    and the workspace context is not fetched even once(!old_id)
                                    // 3. Fetch if the workspace is changed (ie., old_id !== new_id)
                                    if (isWksp || !old_id ||
                                        (old_id && new_id && old_id !== new_id)) {
                                        return obj.fetch();
                                    }
                                }
                            }
                        })
                        .compact()
                        .value();
                    if (nodepromise) {
                        promises.unshift(nodepromise);
                    }
                    // Set the attachment fetched status for subsequent workspace access via other widgets/breadcrumbs
                    if (promises.length > 0) {
                        self.wkspStatus = {
                            wksp_id: new_id,
                            fetched: true
                        }
                    }

                    return $.when.apply($, promises);
                })
        }
    });

    return AttachmentContextModel;

});

csui.define('xecmpf/widgets/boattachments/impl/boattachmentutil',[
    'csui/lib/jquery',
    'csui/lib/underscore',
    "i18n!xecmpf/widgets/boattachments/impl/nls/lang",

], function ($, _,
             lang) {

    function BOAttachmentUtil() {
    }

    _.extend(BOAttachmentUtil.prototype, {

        formatFilzeSize: function (node) {
            var size = node.size;
            if (node.container!==undefined && node.container === true) {
                return size + ' ' + lang.items;
            } else {
                var filesSize = lang.fileSizeByte;
                if (size > 1024) {
                    filesSize = lang.fileSizeKByte;
                    size = size / 1024;
                    if (size > 1024) {
                        filesSize = lang.fileSizeMByte;
                        size = size / 1024;
                        if (size > 1024) {
                            filesSize = lang.fileSizeGByte;
                            size = size / 1024;
                        }
                    }
                }
                return Math.ceil(size) + ' ' + filesSize;
            }
        },
        orderByAsString: function (orderBy, defCol, defOrd) {
            var sc;

            var ret, order = {sc: defCol, so: defOrd};
            if (orderBy) {
                order = _.defaults({sc: orderBy.sortColumn, so: orderBy.sortOrder}, order);
            }
            // strip curly braces from sortColumn
            if (order.sc) {
                // syntax of the sortColumn is to be checked in the constructors, so no need to
                // raise a message here
                var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
                var match = parameterPlaceholder.exec(order.sc);
                if (match) {
                    order.sc = match[1];
                } else {
                    order.sc = undefined;
                }
            }
            // if one of column or order is defined, then we must deliver something defined
            if (order.sc || order.so) {
                // and use a constant default, if one is undefined
                ret = _.str.sformat("{0} {1}", order.sc ? order.sc : "name", order.so ? order.so : "asc");
            }
            return ret;
        }

    });

    return new BOAttachmentUtil();
});

/**
 * The business attachment model for fetching business attachments from the server.
 * Provides:
 *   - Endless scrolling
 */
csui.define('xecmpf/widgets/boattachments/impl/boattachment.model',[
    'module',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/models/node/node.model',
    'csui/models/nodeancestors',
    'csui/utils/contexts/factories/factory',
    'xecmpf/widgets/boattachments/impl/boattachmentutil'


], function (module, $, _, Backbone, NodeModel,
             NodeAncestorCollection, ConnectorFactory, BOAttachmentUtil) {

    var BOAttachmentModel = NodeModel.extend({

        constructor: function BOAttachmentModel(attributes, options) {
            // The connector needs to be passed to the NodeModel constructor
            // to be processed correctly
            options || (options = {});
            if (!options.connector) {
                options.connector = options.collection && options.collection.connector || undefined;
            }
            this.connector = options.connector;
            NodeModel.prototype.constructor.call(this, attributes, options);

        },

        // Set id attribute to support endless scrolling
        // Needed to support compare attachments and add attachments to a existing collection
        idAttribute: 'id',

        // Parse one workspace and add category properties
        parse: function (response, options) {
            var node = NodeModel.prototype.parse.call(this, response, options);

            if (!node.size_formatted ) {
                node.size_formatted =
                    BOAttachmentUtil.formatFilzeSize(node);
            }

            // SAPRM-11354: If CS item has no version it should be blank
            if ( node.version === 0 ){
                node.version = "";
            }

            if (node.actions) {
                node.actions[node.actions.length] = {
                    body: "",
                    content_type: "",
                    form_href: "",
                    href: "",
                    method: "GET",
                    name: "Snapshot",
                    signature: "Snapshot"
                }
            }

            node.ancestors = new NodeAncestorCollection(
                response.data.ancestors, {
                node: this, autofetch: false
            });

            return node;
        }

    });

    return BOAttachmentModel;
});

/**
 * The business attachment model for fetching the business attachments from the server.
 * Provides:
 *   - Endless scrolling
 *   - Fetch custom attributes (categories)
 *   - Provide Workspace type icon
 */
csui.define('xecmpf/widgets/boattachments/impl/boattachments.model',['module', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/node/node.model',
  'csui/models/connectable',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/nodechildren',

  'csui/models/nodes',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/browsable/v1.response.mixin',
  'csui/models/browsable/v2.response.mixin',

  'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',
  'xecmpf/widgets/boattachments/impl/boattachment.model'
], function (module, $, _, Backbone, Url,
    NodeModel, ConnectableModel,
    NodeChildrenColumnModel,
    NodeChildrenColumnCollection,
    NodeChildrenCollection,
    NodeCollection,
    ExpandableMixin,
    NodeResourceMixin,
    BrowsableMixin,
    BrowsableV1RequestMixin,
    ResourceMixin,
    BrowsableV1ResponseMixin,
    BrowsableV2ResponseMixin,
    AttachmentContextBusinessObjectInfoFactory,
    BOAttachmentModel) {

  // Model for display columns in expanded view
  var AttachmentsColumnModel = NodeChildrenColumnModel.extend({

    constructor: function AttachmentsColumnModel() {
      NodeChildrenColumnModel.prototype.constructor.apply(this, arguments);
    }
  });

  // Collection for display columns in expanded view
  var AttachmentsColumnCollection = NodeChildrenColumnCollection.extend({

    dataCollectionName: "properties",
    model: AttachmentsColumnModel,

    constructor: function AttachmentsColumnCollection(dataCollectionName) {
      dataCollectionName && (this.dataCollectionName = dataCollectionName);
      NodeChildrenColumnCollection.prototype.constructor.apply(this);
    },

    resetColumns: function (response, options) {
      this.resetCollection(this.getColumns(response), options);
    },

    getColumns: function (response) {

      var definitions = response && response.meta_data && response.meta_data.properties || {};

      if (definitions && !definitions['modified']) {
        definitions['modified'] = definitions['modify_date'];
      }

      if (definitions && !definitions['size_formatted']) {
        definitions['size_formatted'] = definitions['size'];
      }
      var columnKeys   = _.keys(definitions),
          columnModels = this.getColumnModels(columnKeys, definitions);

      _.each(columnModels, function (model) {
        // To format user columns they must have type 14
        if (model.persona === "user" || model.persona === "member") {
          model.type = 14;
        }
      });

      return columnModels
    }

  });
  var config = module.config();

  var BOAttachmentsCollection = NodeCollection.extend({

    dataCollectionName: "properties",
    model: BOAttachmentModel,

    constructor: function BOAttachmentsCollection(models, options) {
      NodeCollection.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.options = options;

      this.makeNodeResource(options)
          .makeExpandable(options)
          .makeBrowsable(options)
          .makeBrowsableV1Request(options)
          .makeBrowsableV1Response(options);

      this.columns = new AttachmentsColumnCollection(this.dataCollectionName);
      this.totalCount = 0;
      this.titleIcon = undefined;
      // API returns if there are more pages to fetch or not
      this.next = undefined;
      this.busobjinfo = this.options.context.getModel(AttachmentContextBusinessObjectInfoFactory,
          {
            attributes: this.options.data.businessattachment.properties,
            data: this.options.data.businessattachment.properties
          });
    },

    url: function () {
      var queryParams = this.options.query || {};
      // Paging
      queryParams = this.mergeUrlPaging(config, queryParams);
      // Sorting
      queryParams = this.mergeUrlSorting(queryParams);
      // Filtering
      queryParams = this.mergeUrlFiltering(queryParams);

      var url = Url.combine(this.getBaseUrl(),
          'businessobjects',
          encodeURIComponent(this.busobjinfo.get("extSystemId")),
          encodeURIComponent(this.busobjinfo.get("busObjectType")),
          encodeURIComponent(this.busobjinfo.get("busObjectKey")),
		  'businessattachments');

      this.listenTo(this, "sync", this._cacheCollection);
      url = url.replace('/v1', '/v2');
      queryParams = _.omit(queryParams, function (value, key) {
        return value == null || value === '';
      });
      queryParams.metadata = undefined;
      return url + '?' + this.queryParamsToString(queryParams) + "&expand=" + encodeURIComponent(
          'properties{original_id,ancestors,parent_id,reserved_user_id,createdby,modifiedby}');

    },

    fetch: function (options) {
      var self = this,
          df   = $.Deferred();
      this.busobjinfo.fetch().done(function () {
        if (!this.fetching) {
          // reset total count
          this.totalCount = 0;
        }

        if (self.busobjinfo.get("extSystemId") &&
            self.busobjinfo.get("busObjectType") &&
            self.busobjinfo.get("busObjectKey")) {
          self.Fetchable.fetch.call(self, options).done(function () {
            df.resolve()
          }).fail(function () {
            df.resolve()
          })
        } else {
          self.trigger('sync');
          df.resolve()
        }
      });
      return df.promise();
    },

    clone: function () {
      // Don't share something between collapsed and expanded view (models, ...)
      // Sorting, filtering, columns, ... must also be shared since e.g. the modal view has
      // specific sorting
      var options = $.extend(true, {}, this.options);
      // remove filter parameter
      options.query && options.query.where_name && (options.query.where_name = '');
      var collection = new this.constructor([], options);

      collection.connector = this.connector;
      return collection;
    },

    parse: function (response) {
      // In case api returns properties use them, otherwise use defaults
      this.totalCount = response.paging.total_count;
      this.options.orderBy = this.orderBy;
      this.columns && this.columns.resetColumns(response, this.options);

      // If more pages available set next to true, otherwise to false
      this.next = response.paging.actions && response.paging.actions.next ? true : false;

      this.businessObjectActions = response.businessObjectActions;

      // pass the array of v2 nodes to the model parse methods
      return response.results;
    },
    mergeUrlPaging: function (config, queryParams) {
      var limit = this.topCount || config.defaultPageSize;
      if (limit) {
        queryParams.limit = limit;
        queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
      }
      return queryParams;
    },

    mergeUrlSorting: function (queryParams) {
      var orderBy;
      if (this.orderBy) {
        orderBy = this.orderBy;
        queryParams.sort = this._formatSorting(orderBy);
      } else if (_.isUndefined(queryParams.sort)) {
        queryParams.sort = "asc_name";
        this.orderBy = "name asc";
      } else if (queryParams.sort.indexOf(" ") > -1) {
        orderBy = queryParams.sort;
        this.orderBy = queryParams.sort;
        queryParams.sort = this._formatSorting(orderBy);
      }
      return queryParams;
    },

    _formatSorting: function (orderBy) {
      var slicePosition = orderBy.lastIndexOf(" ");
      return orderBy.slice(slicePosition + 1) + '_' + orderBy.slice(0, slicePosition);
    },

    mergeUrlFiltering: function (queryParams) {
      if (!$.isEmptyObject(this.filters)) {
        for (var name in this.filters) {
          if (this.filters.hasOwnProperty(name)) {
            if (this.filters[name] === "" || this.filters[name] === undefined) {
              // Clear filter
              delete queryParams["where_" + name];
              delete this.options.query["where_" + name];
            } else {
              // API like search syntax: where_name=contains_street
              // Currently it's only possible to filter for strings, since the
              // API only returns for Strings that filtering is possible
              queryParams["where_" + name] = "contains_" +
                                             encodeURIComponent(this.filters[name]);
            }
          }
        }
      }
      return queryParams;
    },

    queryParamsToString: function (params) {
      var queryParamsStr = "";
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          if (queryParamsStr.length > 0) {
            queryParamsStr += "&"
          }

          if (params[param] === undefined) {
            queryParamsStr += param;
          } else {
            queryParamsStr += param + "=" + params[param];
          }
        }
      }
      return queryParamsStr;
    },

    getBaseUrl: function () {
      var url = this.connector && this.connector.connection &&
                this.connector.connection.url;
      if (_.isUndefined(url)) {
        url = this.options.connector.connection.url;
      }
      return url;
    }
  });

  BrowsableMixin.mixin(BOAttachmentsCollection.prototype);
  ExpandableMixin.mixin(BOAttachmentsCollection.prototype);
  NodeResourceMixin.mixin(BOAttachmentsCollection.prototype);
  BrowsableV1RequestMixin.mixin(BOAttachmentsCollection.prototype);
  BrowsableV1ResponseMixin.mixin(BOAttachmentsCollection.prototype);

  // TODO: Remove this, as soon as all abandoned this.Fetchable.

  var originalFetch = NodeCollection.prototype.fetch;
  BOAttachmentsCollection.prototype.Fetchable = {

    fetch: function (options) {
      // log.warn('Using this.Fetchable.fetch has been deprecated.  ' +
      //          'Use NodeChildrenCollection.prototype.fetch. ' +
      //          'this.Fetchable is going to be removed.') && console.warn(log.last);
      // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      return originalFetch.call(this, options);
    }

  };

  return BOAttachmentsCollection;

});

csui.define('xecmpf/widgets/myattachments/metadata.attachment.model',['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/log', 'csui/utils/url', 'csui/models/actions',
    'csui/models/mixins/expandable/expandable.mixin',
    'csui/models/mixins/resource/resource.mixin',
    'csui/models/mixins/uploadable/uploadable.mixin',
    'csui/lib/jquery'
], function (module, _, Backbone, log, Url, ActionCollection,
             ExpandableMixin, ResourceMixin, UploadableMixin, $) {
    'use strict';

    var AttachmentModel = Backbone.Model.extend({

        // Not set this idAttribute as you can have the same bo_id for
        // different external systems
        // idAttribute: '_id',

        constructor: function AttachmentModel(attributes, options) {
            attributes || (attributes = {});
            options = _.extend({expand: 'user'}, options);

            if (!attributes.actions) {
				this._setCollectionProperty('actions', ActionCollection,
					attributes, options);
			}

            Backbone.Model.prototype.constructor.call(this, attributes, options);

            this.makeResource(options)
                .makeUploadable(options)
                .makeExpandable(options);
        },

        set: function (key, val, options) {
            var attrs;
            if (key == null) {
                return this;
            }

            // Save actions
            if (key.actions) {
                this.actions = key.actions;
                this._setCollectionProperty('actions', ActionCollection, key, options);
            }
            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                if (key.data) {
                    if (key.data.properties) {
                        attrs = key.data.properties;
                        // we need additional id for collapse of the table, see
                        // table.view.js line 1525:
                        // childRow.attr('id', "csui-details-row-" + aData.get('id'));
                        // ........
                        // aData could be an AttachmentModel
                        this.id = attrs.ext_system_id + attrs.bo_type + attrs.bo_id;
                        options = val;
                    }
                }
                else {
                    attrs = key;
                    options = val;
                }
            } else {
                (attrs = {})[key] = val;
            }

            options || (options = {});
            return Backbone.Model.prototype.set.call(this, attrs, options);

        },

        isNew: function () {
            if (this.id) {
                return false;
            }
            else {
                return true;
            }
        },

        isFetchable: function () {
            return !!(this.get('id') && this.get('bo_id'));
        },

        url: function () {
            var url = Url.combine(this.collection.node.urlBase(), 'businessattachments');
            if (!this.isNew()) {
                url = Url.combine(url, encodeURIComponent(this.get('ext_system_id')), encodeURIComponent(this.get('bo_type')), encodeURIComponent(this.get('bo_id')));
            }
            url = url.replace('/v1', '/v2');
            return url;
        },

        parse: function (response) {
            var attachment;
            if ( $.isArray(response.results) ){
                attachment = response.results[0];
            }
            else {
               attachment = response;
            }

            var attachmentActions = _.map(attachment, function (value, key) {
				return {
				  id: key,
				  actions: _.map(value.data, function (value, key) {
					value.signature = key;
					return value;
				  })
				};
			}, {});
			
			attachment.actions = attachmentActions[0].actions;

            return attachment;
        },

        _setCollectionProperty: function (attribute, Class, attributes, options) {
            var property   = _.str.camelize(attribute),
                models     = attributes[attribute];			  
            this[property] = new Class(models, {
                connector: this.connector || options && options.connector
            });
          }

    });

    ExpandableMixin.mixin(AttachmentModel.prototype);
    UploadableMixin.mixin(AttachmentModel.prototype);
    ResourceMixin.mixin(AttachmentModel.prototype);

    return AttachmentModel;

});


csui.define('xecmpf/widgets/myattachments/metadata.attachments.model',["module", "csui/lib/backbone", "csui/utils/log", "xecmpf/widgets/myattachments/metadata.attachment.model","csui/lib/jquery", "csui/lib/underscore", "csui/utils/url"
], function (module, Backbone, log, AttachmentModel, $, _, Url) {
  'use strict';

  var AttachmentCollection = Backbone.Collection.extend({

    model: AttachmentModel,

    constructor: function AttachmentCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
      if (this.options.connector) {
        this.options.connector.assignTo(this);
      }
    },

    setOrder: function (attributes, fetch) {
      if (this.orderBy !== attributes) {
        this.orderBy = attributes;
        if (fetch !== false) {
          this.fetch();
        }
        //this._runAllOperations();
        return true;
      }
    },

    resetOrder: function (fetch) {
      if (this.orderBy) {
        this.orderBy = undefined;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    setLimit: function (skip, top, fetch) {
      if (this.skipCount !== skip || this.topCount !== top) {
        this.skipCount = skip;
        this.topCount = top;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    resetLimit: function (fetch) {
      if (this.skipCount) {
        this.skipCount = 0;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    setFilter: function (filters, fetch, options) {
      if(this.filters) {
        for (var tempKey in this.filters) {
          if(this.filters[tempKey] === undefined) {
            delete this.filters[tempKey];
          }
        }
      }
      for (var key in filters) {
        if (!this.filters) {
          this.filters = {};
        }
        this.filters[key] = filters[key];
      }
      if (fetch !== false) {
        this.fetch(options);
      }
      return true;
    }

  });
  AttachmentCollection.version = '1.0';

  return AttachmentCollection;

});

csui.define('xecmpf/widgets/myattachments/metadata.nodeattachments.model',['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/base', 'csui/utils/log', 'csui/utils/url',
    'xecmpf/widgets/myattachments/metadata.attachments.model', 'csui/models/actions', 'csui/models/columns',
    'csui/models/mixins/node.resource/node.resource.mixin',
    'csui/models/mixins/expandable/expandable.mixin',
    'csui/lib/jquery',
    // 'csui/models/browsable/client-side.mixin',
    'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, base, log, Url, AttachmentCollection, ActionCollection,
             NodeColumnCollection, NodeResourceMixin,
             ExpandableMixin, $/* ClientSideBrowsableMixin */) {
    'use strict';

    var NodeAttachmentCollection = AttachmentCollection.extend({

        constructor: function NodeAttachmentCollection(models, options) {
            AttachmentCollection.prototype.constructor.apply(this, arguments);

            this.makeNodeResource(options)
                .makeExpandable(options);
            // .makeClientSideBrowsable(options);

            this.columns = new NodeColumnCollection();
        },

        clone: function () {
            return new this.constructor(this.models, {
                node: this.node,
                skip: this.skipCount,
                top: this.topCount,
                filter: _.deepClone(this.filters),
                orderBy: _.clone(this.orderBy),
                expand: _.clone(this.expand),
                // TODO: Use commandable mixin.
                commands: _.clone(this.options.commands)
            });
        },

        mergeUrlPaging: function () {
            var queryParams = {};
            var limit = this.topCount;
            if (limit) {
                queryParams.limit = limit;
                queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
            }
            return queryParams;
        },

        mergeUrlFiltering: function () {
            var queryParams = [];
            if (!$.isEmptyObject(this.filters)) {
                for (var name in this.filters) {
                    if (this.filters.hasOwnProperty(name)) {
                        if (this.filters[name] !== "" && this.filters[name] !== undefined) {
                            queryParams["where_" + name] = "contains_" + this.filters[name];
                        }
                    }
                }
            }
            return queryParams;
        },

        mergeUrlSorting: function () {
            var queryParams = [];
            var orderBy;
            if (this.orderBy) {
                orderBy = this.orderBy;
                queryParams.sort = this._formatSorting(orderBy);
            } else if (_.isUndefined(queryParams.sort)) {
                queryParams.sort = "asc_name";
                this.orderBy = "name asc";
            } else if (queryParams.sort.indexOf(" ") > -1) {
                orderBy = queryParams.sort;
                this.orderBy = queryParams.sort;
                queryParams.sort = this._formatSorting(orderBy);
            }
            return queryParams;
        },

        _formatSorting: function (orderBy) {
            var slicePosition = orderBy.lastIndexOf(" ");
            return orderBy.slice(slicePosition + 1) + '_' + orderBy.slice(0, slicePosition);
        },

        url: function () {
            var query = Url.combineQueryString(
                this.getExpandableResourcesUrlQuery(),
                'metadata',
                this.mergeUrlPaging(),
                this.mergeUrlFiltering(),
                this.mergeUrlSorting()
            );

            var url = this.node.urlBase();
            // SAPRM-9351:
            // this does not work for machine names like
            // http://xecmwinsrv12.eng-muc-test.opentext.net:8080/OTCS/cs.exe/api/v1/nodes/..."
            // we have to replace correctly
            // url = url.replace("v1", "v2");
            url = url.replace('/v1', '/v2');
            // End of SAPRM-9351
            return Url.combine(url, '/businessattachments?' + query);
        },

        parse: function (response) {
            this.actions = response.actions; // get actions independent from single bus. attachment, e.g. add attachment
            this.totalCount = response.paging.total_count;

            var metadata = response.meta_data;
            var columnKeys = _.keys(metadata.properties);

            if (!this.options.onlyClientSideDefinedColumns) {
                // merge metadata_order into metadata as metadata_order attribute
                if (response.metadata_order) {
                    for (var idx = 0; idx < response.metadata_order.length; idx++) {
                        var column_key = response.metadata_order[idx];
                        metadata[column_key].metadata_order = 500 + idx;
                    }
                }
            }
            // do not reset the columns in case of filtering else the searchbox is removed
            if (!this.filters) {
                this.columns.reset(this.getColumnModels(columnKeys, metadata.properties));
            }

            return response.results;
        },

        getColumnModels: function (columnKeys, metadata) {
            var columns = _.reduce(columnKeys, function (colArray, column) {
                if (column.indexOf('_formatted') >= 0) {
                    var shortColumnName = column.replace(/_formatted$/, '');
                    if (metadata[shortColumnName]) {
                        // there is also the column without the trailing _formatted: skip this and use this instead
                        return colArray;
                    }
                } else {
                    // copy the metadata_order from the *_formatted column to the non-formatted column
                    // because it is assumed that the attributes form *_formatted column are more important
                    var definition_short = metadata[column];
                    if (!definition_short.metadata_order) {
                        var definition_formatted = metadata[column + '_formatted'];
                        if (definition_formatted && definition_formatted.metadata_order) {
                            definition_short.metadata_order = definition_formatted.metadata_order;
                        }
                    }
                }
                var definition = metadata[column];

                switch (column) {
                    case "name":
                        definition = _.extend(definition, {
                            default_action: true,
                            contextual_menu: false,
                            editable: true,
                            filter_key: "name"
                        });
                        break;
                }

                colArray.push(_.extend({column_key: column}, definition));
                return colArray;
            }, []);
            return columns;
        }

    });

    // ClientSideBrowsableMixin.mixin(NodeAttachmentCollection.prototype);
    ExpandableMixin.mixin(NodeAttachmentCollection.prototype);
    NodeResourceMixin.mixin(NodeAttachmentCollection.prototype);

    return NodeAttachmentCollection;

});

csui.define('xecmpf/widgets/dossier/impl/dossier.model',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/url', 'csui/models/mixins/connectable/connectable.mixin'
], function (module, $, _, Backbone,
             Url, ConnectableMixin) {

    var DossierModel, DossierCollection;

    DossierModel = Backbone.Model.extend({
        constructor: function DossierModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        parse: function (response) {
            if (response && response.paging && response.paging.total_count > 0) {
                return response;
            }
        }
    });

    DossierCollection = Backbone.Collection.extend({
        model: DossierModel,

        constructor: function DossierCollection(attributes, options) {
            options || (options = {});
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            this.options = _.pick(options, ['connector', 'nodeModel', 'query']);
            this.makeConnectable(this.options);
        },

        parse: function (response, options) {
            var data = response.results.data,
                properties = response.results.properties;
            this.total_documents = properties.total_documents;
            data = _.filter(data, function (item) {
                return item.paging.total_count > 0
            });
            return data;
        },

        queryParamsToString: function (params) {
            return '?' + $.param(params);
        },

        fetch: function (options) {
            options || (options = {});
            if (options.query) {
                this.url = this.getUrl() + this.queryParamsToString(options.query);
            }
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        },

        url: function () {
            // Get query from options, e.g. group_by criterion already passed
            var queryParams = this.options.query || {};

            return this.getUrl() + this.queryParamsToString(queryParams);
        },

        getUrl: function () {
            var url = this.connector.connection.url;
            url = Url.combine(url, 'businessworkspaces', this.options.nodeModel.get('id'), 'dossier')
                .replace('/v1', '/v2');
            return url;
        }
    });

    ConnectableMixin.mixin(DossierCollection.prototype);

    return DossierCollection;
});

csui.define('xecmpf/widgets/dossier/impl/documentslist/impl/documents.model',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, Url,
    ConnectableMixin, BrowsableMixin,
    NodeModel) {

  var config, DocumentModel, DocumentsCollection;

  config = module.config();

  DocumentModel = NodeModel.extend({

    idAttribute: 'id',

    constructor: function DocumentModel(attributes, options) {
      options || (options = {});
      // The connector needs to be passed to the NodeModel constructor
      // to be processed correctly
      if (!options.connector) {
        options.connector = options.collection && options.collection.connector || undefined;
      }
      NodeModel.prototype.constructor.apply(this, arguments);
      this.set(NodeModel.prototype.parse.call(this, attributes, options));
    }
  });

  DocumentsCollection = Backbone.Collection.extend({

    model: DocumentModel,

    constructor: function DocumentsCollection(models, options) {
      options || (options = {});
      options.connector = options.nodeModel && options.nodeModel.connector;
      this.options = _.pick(options, ['connector', 'nodeModel', 'query', 'paging', 'metadata']);
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeConnectable(this.options)
          .makeBrowsable(this.options);

      this.totalCount = this.options.paging.total_count;
      this.options.orderBy = this.orderBy;
    },

    fetch: function () {
      return Backbone.Collection.prototype.fetch.apply(this, arguments);
    },

    parse: function (response, options) {
      return response.results.data;
    },

    mergeUrlPaging: function (config, queryParams) {
      var limit = this.topCount || config.defaultPageSize || 5;
      if (limit) {
        queryParams.limit = limit;
        queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
      }
      return queryParams;
    },

    mergeUrlMetadata: function (queryParams) {
      if (this.options.metadata) {
        queryParams.metadata = '{' + this.options.metadata + '}';
      }
      return queryParams;
    },

    queryParamsToString: function (params) {
      return '?' + $.param(params);
    },

    url: function () {
      // Get query from options
      var queryParams = this.options.query || {};

      // Paging
      queryParams = this.mergeUrlPaging(config, queryParams);

      //metadata
      queryParams = this.mergeUrlMetadata(queryParams);

      var url = this.connector.connection.url;
      url = Url.combine(url, 'businessworkspaces',
          this.options.nodeModel && this.options.nodeModel.get('id'), 'dossier/documents');
      url = url.replace('/v1', '/v2');

      return url + this.queryParamsToString(queryParams);
    }
  });

  ConnectableMixin.mixin(DocumentsCollection.prototype);
  BrowsableMixin.mixin(DocumentsCollection.prototype);
  return DocumentsCollection;
});

csui.define('xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (_, $, Backbone) {
  var MetadataCollection = Backbone.Collection.extend({

    constructor: function MetadataCollection(models, options) {
      options || (options = {});
      options.data || (options.data = {});
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (!_.isEmpty(options.data)) {
        this.hideEmptyFields = options.hideEmptyFields;
        this.catsAndAttrs = options.catsAndAttrs;
        this._addModels(options.data);
      }
    },

    _addModels: function (data) {
      _.each(this.catsAndAttrs, function (item) {
        var itemType = typeof item,
            label, value, type, attribute, category;

        if (itemType === 'number') {
          category = item;
          if (data.hasOwnProperty(category)) {
            for (attribute in data[category]['data']) {
              if (data[category]['data'].hasOwnProperty(attribute)) {
                label = data[category]['definitions'][attribute]['name'];
                value = data[category]['data'][attribute];
                type = data[category]['definitions'][attribute]['type_name'];
                if (this.hideEmptyFields === true && value === null) {continue;}
                this.add({label: label, value: value, type: type});
              }
            }
          }
        } else if (itemType === 'string') {
          category = item.split('_')[0];
          attribute = item;
          if (data.hasOwnProperty(category) && data[category]['data'].hasOwnProperty(attribute)) {
            label = data[category]['definitions'][attribute]['name'];
            value = data[category]['data'][attribute];
            type = data[category]['definitions'][attribute]['type_name'];
            if (this.hideEmptyFields === true && value === undefined) {return;}
            this.add({label: label, value: value, type: type});
          }
        }
      }, this);
    },

    comparator: 'label'
  });

  return MetadataCollection;
});

csui.define('xecmpf/widgets/header/impl/completenesscheck/impl/models/missingdocuments.model',['csui/lib/underscore', 'csui/lib/backbone',
    'csui/models/mixins/connectable/connectable.mixin', 'csui/utils/url'
], function (_, Backbone, ConnectableMixin, Url) {
    
    var MissingDocumentModel = Backbone.Model.extend({

        idAttribute: 'id',

        constructor: function MissingDocumentModel(attributes, options) {
            options || (options = {});
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },

        parse: function (response) {
            return response;
        }

    });
    ConnectableMixin.mixin(MissingDocumentModel.prototype);

    var MissingDocumentCollection = Backbone.Collection.extend({

        model: MissingDocumentModel,

        constructor: function MissingDocumentCollection(models, options) {
            this.options = options || {};
            Backbone.Collection.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },

        url: function () {
            var wrkspceId = this.options.node.get('id');
            return Url.combine(new Url(this.connector.connection.url).getApiBase('v2'),
                '/businessworkspaces/' + wrkspceId + '/missingdocuments');
        },

        parse: function (response) {
            return response.results.data;
        },

        fetch: function () {
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        }
    });
    ConnectableMixin.mixin(MissingDocumentCollection.prototype);

    return MissingDocumentCollection;
});

 csui.define('xecmpf/widgets/workspaces/models/workspace.collection',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/url',
    'csui/models/nodes',
    'csui/models/nodechildrencolumns',
    'csui/models/browsable/browsable.mixin',
    'csui/models/browsable/v1.request.mixin',
    'csui/models/mixins/resource/resource.mixin',
    'csui/models/browsable/v1.response.mixin',
    'csui/models/browsable/v2.response.mixin',
    'csui/utils/log',
    'csui/utils/deepClone/deepClone'
], function (module, $, _, Backbone, Url,
             NodeCollection,
             NodeChildrenColumnCollection,
             BrowsableMixin,
             BrowsableV1RequestMixin,
             ResourceMixin,
             BrowsableV1ResponseMixin,
             BrowsableV2ResponseMixin,
             log) {
    'use strict';

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30
    });

    var WorkspaceCollection = NodeCollection.extend({

        constructor: function WorkspaceCollection(models, options) {
            options = _.defaults({}, options, {
                top: config.defaultPageSize
            }, options);

            NodeCollection.prototype.constructor.call(this, models, options);
            this.makeBrowsable(options)
                .makeBrowsableV1Request(options)
                .makeResource(options)
                .makeBrowsableV2Response(options);

            this.options = options;
            this.orderBy = "name asc";
        },

        clone: function () {
            return new this.constructor(this.models, {
                skip: this.skipCount,
                top: this.topCount,
                orderBy: this.orderBy
            });
        },
        getBaseUrl: function () {
            //   return "//server/otcs/cs/api/v2";
            return this.options.connector.connection.url.replace('/v1', '/v2');
        },

        url: function () {
            var query = this.getBrowsableUrlQuery(),
                url = Url.combine(this.getBaseUrl(),
                    query ? '/businessworkspaces?' + query + "&" : '/businessworkspaces?');

            url += 'metadata&expanded_view=true' +
                '&where_bo_type=' + this.options.busObjectType +
                '&where_ext_system_id=' + this.options.extSystemId;
            if (this.options.early) {
                url += '&where_is_early=true';
            }
            if (this.options.busObjectId) {
                url += '&where_bo_id='+this.options.busObjectId;
            }
            url = url.replace("where_name=", "where_name=contains_");
            return url;
        },
        isFetchable: function () {
            return true;
        },
        parse: function (response, options) {
            var modifyDate = _.chain(response.meta_data.properties).pick("modify_date").value().modify_date,
                name = _.chain(response.meta_data.properties).pick("name").value().name

            this.columns = new NodeChildrenColumnCollection([
                {
                    align: modifyDate.align,
                    column_key: "modify_date",
                    name: modifyDate.name,
                    persona: modifyDate.persona,
                    sort: (modifyDate.sort ? true : false ),
                    type: modifyDate.type,
                    width_weight: modifyDate.width_weight
                },
                {
                    column_key: "name",
                    align: name.align,
                    name: name.name,
                    persona: name.persona,
                    sort: (name ? name.sort : false ),
                    type: name.type,
                    width_weight: name.width_weight
                }]);

            this.parseBrowsedState(response, options);
            return this.parseBrowsedItems(response, options);
        }

    });

    BrowsableMixin.mixin(WorkspaceCollection.prototype);
    BrowsableV1RequestMixin.mixin(WorkspaceCollection.prototype);
    ResourceMixin.mixin(WorkspaceCollection.prototype);
    BrowsableV2ResponseMixin.mixin(WorkspaceCollection.prototype);
    // TODO: Remove this, as soon as all abandoned this.Fetchable.
    var originalFetch = WorkspaceCollection.prototype.fetch;
    WorkspaceCollection.prototype.Fetchable = {

        fetch: function (options) {
            // log.warn('Using this.Fetchable.fetch has been deprecated.  ' +
            //          'Use NodeChildrenCollection.prototype.fetch. ' +
            //          'this.Fetchable is going to be removed.') && console.warn(log.last);
            // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
            return originalFetch.call(this, options);
        }

    };

    return WorkspaceCollection;

});

csui.define('xecmpf/widgets/workspaces/models/workspace.types.collection',['csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/url',
    'csui/models/mixins/resource/resource.mixin'
], function (_,
             Backbone,
             Url,
             ResourceMixin) {
    'use strict';

    var WorkspaceTypeModel = Backbone.Model.extend({

         defaults: {
            id: null,
            name: null,
            templates: null
         }
    });

    var WorkspaceTypesCollection = Backbone.Collection.extend({

        model: WorkspaceTypeModel,

        constructor: function WorkspaceTypesCollection(models, options) {
            this.options = options || (options = {});
            Backbone.Collection.prototype.constructor.apply(this, arguments);
            this.makeResource(options);
        },

        getBaseUrl: function () {
            // return "//server/otcs/cs/api/v2";
            return this.options.connector.connection.url.replace('/v1', '/v2');
        },
        queryParamsToString: function (params) {
            var queryParamsStr = "";
            for (var param in params) {
                if (params.hasOwnProperty(param)) {
                    if (queryParamsStr.length > 0) {
                        queryParamsStr += "&"
                    }

                    if (params[param] === undefined) {
                        queryParamsStr += param;
                    } else {
                        queryParamsStr += param + "=" + params[param];
                    }
                }
            }
            return queryParamsStr;
        },

        url: function () {

            var url = Url.combine(this.getBaseUrl(), '/businessworkspacetypes');
            url += '?expand_templates=true' +
                '&bo_type=' + this.options.config.busObjectType +
                '&ext_system_id=' + this.options.config.extSystemId;

            return url;

        },

        parse: function (response, options) {

            var businessworkspacetypes = response.results;
            return _.chain(businessworkspacetypes)
                .map(function (elem, index, ref) {

                    var props = elem.data.properties,
                        businessworkspacetypeAttributes = {
                            wksp_type_name: props.wksp_type_name,
                            wksp_type_id: props.wksp_type_id,
                            rm_enabled: props.rm_enabled,
                            type: 848
                        };
                     businessworkspacetypeAttributes.templates =
                        _.chain(props.templates)
                            .map(function (elem, index, ref) {
                                if (index === 0) {
                                    return {
                                        id: elem.id,
                                        name: elem.name,
                                        subType: elem.subtype
                                    };
                                }
                            })
                            .compact()
                            .value();


                    return businessworkspacetypeAttributes;
                })
                .compact()
                .value();
        }

    });

    ResourceMixin.mixin(WorkspaceTypesCollection.prototype);

    return WorkspaceTypesCollection;

});

/**
 * Created by stefang on 24.11.2015.
 */
csui.define('xecmpf/models/boattachmentcontext/attachmentcontext.factory',['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'xecmpf/models/boattachmentcontext/attachmentcontext.model'
], function (_,
             ModelFactory,
             AttachmentContextModel) {

    var AttachmentContextFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContext',

        constructor: function AttachmentContextFactory(context, options) {
            ModelFactory.prototype.constructor.apply(this, arguments);
            this.property = new AttachmentContextModel({}, {context: context, data: options.attachmentContext});
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextFactory;

});


csui.define('xecmpf/widgets/header/impl/completenesscheck/impl/missingdocuments.factory',[
  'module',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'xecmpf/widgets/header/impl/completenesscheck/impl/models/missingdocuments.model'
], function (module,
    _,
    Backbone,
    CollectionFactory,
    ConnectorFactory,
    NodeFactory,
    MissingReportCollection) {
  var MissingDocumentsFactory = CollectionFactory.extend({
    propertyPrefix: 'missingDocumentsCollection',
    constructor: function MissingDocumentsFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);
      var missingDocumentsCollection = this.options.missingDocumentsCollection || {};
      if (!(missingDocumentsCollection instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            node      = context.getModel(NodeFactory, options),
            config    = module.config();
        missingDocumentsCollection = new MissingReportCollection(missingDocumentsCollection.models, _.extend(
            {
              connector: connector,
              node: node,
              reportType: 'MissingDocuments'
            }, missingDocumentsCollection.options, config.options, {
              autofetch: true
            }));
      }
      this.property = missingDocumentsCollection;
    },
    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return MissingDocumentsFactory;
});

csui.define('bundles/xecmpf-core',[
  'xecmpf/controls/bosearch/bosearch.model',
  'xecmpf/controls/bosearch/searchform/bosearchform.model',
  'xecmpf/controls/property.panels/reference/impl/workspace.reference.model',
  'xecmpf/controls/property.panels/reference/impl/reference.panel.model',
  'xecmpf/models/boattachmentcontext/attachmentcontext.category.model',
  'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.model',
  'xecmpf/models/boattachmentcontext/attachmentcontext.node.model',
  'xecmpf/models/boattachmentcontext/attachmentcontext.model',
  'xecmpf/widgets/boattachments/impl/boattachment.model',
  'xecmpf/widgets/boattachments/impl/boattachments.model',
  'xecmpf/widgets/myattachments/metadata.attachment.model',
  'xecmpf/widgets/myattachments/metadata.attachments.model',
  'xecmpf/widgets/myattachments/metadata.nodeattachments.model',
  'xecmpf/widgets/dossier/impl/dossier.model',
  'xecmpf/widgets/dossier/impl/documentslist/impl/documents.model',
  'xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.model',
  'xecmpf/widgets/header/impl/completenesscheck/impl/models/missingdocuments.model',
  'xecmpf/widgets/workspaces/models/workspace.collection',
  'xecmpf/widgets/workspaces/models/workspace.types.collection',
  'xecmpf/models/boattachmentcontext/attachmentcontext.category.factory',
  'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',
  'xecmpf/models/boattachmentcontext/attachmentcontext.factory',
  'xecmpf/models/boattachmentcontext/attachmentcontext.node.factory',
  'xecmpf/widgets/header/impl/completenesscheck/impl/missingdocuments.factory'
], {});
