/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone',   
    'csui/utils/url',      
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var simpleSearchresultModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function searchresultModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.context.connector) {
                options.context.connector.assignTo(this);

                this.pageSize = options.pageSize;
                this.pageNo = options.pageNo;

                this.nextPageUrl = "";
                this.query = options.query;
            }
        },

        url: function() {
            var url = WkspUtil.v1ToV2(this.connector.connection.url),
                query = this.query.toJSON(),
                cacheId = "",
                pagingString = "";

            if (this.nextPageUrl) {
                this.pageNo++;
                var regEx = /cache_id=\d+/g;
                var cacheIdEx = regEx.exec(this.nextPageUrl);
                cacheId = cacheIdEx.length > 0 ? cacheIdEx[0] : "";
            }

            pagingString = 'page=' + this.pageNo + '&limit=' + this.pageSize;
            query = Url.combineQueryString(query, pagingString, cacheId);

            return Url.combine(url, 'search?' + query);

        }

    });

    return simpleSearchresultModel;

});
