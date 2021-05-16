/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone',   
    'csui/utils/url',      
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var searchresultModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function searchresultModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);
            if (options && options.connector) {
                options.connector.assignTo(this);

                this.wkspName = options.wkspName;
                this.wkspTypeId = options.wkspTypeId;
                this.typeAhead = options.typeAhead;
                this.pageSize = options.pageSize;
                this.pageNo = options.pageNo;

                this.nextPageUrl = "";
            }
        },

        url: function () {
            if (this.nextPageUrl) {
                return this.connector.getConnectionUrl().getCgiScript() + this.nextPageUrl;
            } else {
                var typeString = this.wkspTypeId && this.wkspTypeId > 0 ? 'where_workspace_type_id=' + this.wkspTypeId : "";
                var nameString = this.wkspName ? 'where_name=contains_' + encodeURIComponent(this.wkspName) : "";
                var pagingString = 'sort=asc_name&page=' + this.pageNo + '&limit=' + this.pageSize;
                var queryString = typeString ? typeString + '&' : '';
                queryString = queryString + (nameString ? nameString + '&' : '') + pagingString;

                return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspaces?expanded_view=true&' + queryString);
            }
        }

    });

    return searchresultModel;

});
