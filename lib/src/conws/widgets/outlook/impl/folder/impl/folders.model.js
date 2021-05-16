/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone', 
    'csui/utils/url', 

    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var foldersModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function foldersModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            } else {
                var connector = WkspUtil.getConnector();
                connector.assignTo(this);
            }

            this.id = options.id;
            this.pageSize = options.pageSize;
            this.pageNo = options.pageNo;
            this.nextPageUrl = "";
        },

        url: function () {
            if (this.nextPageUrl) {
                return window.ServerCgiScript + this.nextPageUrl;
            } else {
                var typeString = "where_type=0&where_type=751&where_type=136";
                var pagingString = 'page=' + this.pageNo + '&limit=' + this.pageSize;
                var queryString = typeString + '&' + pagingString;

                return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'nodes', this.id, 'nodes?' + queryString);
            }
        }

    });

    return foldersModel;
});
