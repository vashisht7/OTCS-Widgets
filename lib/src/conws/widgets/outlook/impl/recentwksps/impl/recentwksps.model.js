/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone',
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var recentwkspsModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function recentwkspsModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);

                this.pageSize = options.pageSize;
                this.pageNo = options.pageNo;

                this.nextPageUrl = "";
            }
        },

        url: function () {
            if (this.nextPageUrl) {
                return window.ServerCgiScript + this.nextPageUrl;
            } else {
                var typeString = ''; //'where_workspace_type_id=47&';
                var pagingString = 'page=' + this.pageNo + '&limit=' + this.pageSize;
                var queryString = typeString + pagingString;

                return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspaces?expanded_view=false&' + queryString);
            }
        }

    });

    return recentwkspsModel;

});
