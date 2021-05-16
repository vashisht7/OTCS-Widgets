/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/backbone',   
    'csui/utils/url',
    'conws/widgets/outlook/impl/wksp/impl/wksp.model',
    'conws/widgets/outlook/impl/utils/utility'
], function ($, Backbone, Url, WkspModel, WkspUtil) {

    var favoritewkspsModel = Backbone.Model.extend({
        defaults: {
            name: 'favoriteWksps'
        },

        constructor: function favoritewkspsModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            this.options = options;

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), "members/favorites");
        },

        parse: function (response) {
            if (response && response.results && response.results.length > 0) {
                for (var i = response.results.length-1; i >= 0; i--) {
                    if (response.results[i].data.properties.type !== 848) {
                        response.results.splice(i, 1);
                        continue;
                    }

                    response.results[i].data.properties.icon = "impl/images/mime_workspace.svg";
                }
            }
            return response;
        }

    });

    function updateIconUrl(wksp, options) {

        var wkspModel = new WkspModel({ id: wksp.data.properties.id }, options);

        $.when(wkspModel.fetch()).then(function(data, status, jqXhr) {
            wksp.data.properties.icon = data.results.data.properties.icon;
        });
    }

    function getIcon(wksp, options) {
        var deferred = $.Deferred();
        var wkspModel = new WkspModel({ id: wksp.data.properties.id }, options);
        wkspModel.fetch({
            success: (function(result) {
                var iconUrl = result.get('results').data.properties.icon;
                wksp.data.properties.icon = iconUrl;
            })
        });
        return deferred.promise();
    }

    return favoritewkspsModel;

});
