/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone',
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function (Backbone, Url, WkspUtil, lang) {

    var wksptypesModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function wksptypesModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspacetypes');
        },

        parse: function (response) {
            var types = [];
            types.push({ value: 0, name: lang.search_all_wksp });

            return types;
        }

    });

    return wksptypesModel;

});
