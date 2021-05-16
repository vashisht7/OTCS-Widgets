/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
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
