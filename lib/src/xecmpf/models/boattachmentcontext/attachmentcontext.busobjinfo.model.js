/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery',
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
                promises.push(catModelObjectId.fetch());
                this.listenTo(catModelObjectId, 'sync', function () {
                        var catVal = catModelObjectId.get(busObjectIdCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectKey = catVal;
                        }  else {
                            self._logEmptyBusObjKeyConfiguration();
                        }
                    }
                );
                this.listenTo(catModelObjectId, "error", function () {
                    this._showInvalidConfigurationError(arguments[1].responseJSON.error);
                });

            } else {
                this.busObjectKey = busObjectIdCatInfo.categoryAttr;
            }
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

                        var catVal = catModelObjectType.get(busObjectTypeCatInfo.categoryAttr);
                        if (!self._isConfigEmpty(catVal)) {
                            self.busObjectType = catVal;
                        } else {
                            self._logEmptyBusObjTypeConfiguration();
                        }
                    }
                );
                this.listenTo(catModelObjectType, "error", function () {
                    this._showInvalidConfigurationError(arguments[1].responseJSON.error);
                });
            } else {
                this.busObjectType = busObjectTypeCatInfo.categoryAttr;
            }
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

