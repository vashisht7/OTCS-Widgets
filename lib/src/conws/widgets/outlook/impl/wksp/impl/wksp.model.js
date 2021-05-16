/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
    'csui/lib/backbone',
    'csui/lib/jquery', 
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, $, Url, WkspUtil) {

    var wkspModel = Backbone.Model.extend({
        defaults: {
            name: 'Unnamed'
        },

        constructor: function wkspModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
            this.id = attributes.id;
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), "businessworkspaces", this.id);
        },

        getPreConfigFolder: function() {
            var self = this,
                deferred = $.Deferred(),
                promise = deferred.promise();
            if (!WkspUtil.emailSavingConfig.preConfigFolderToSave.enabled) {
                deferred.resolve({ hasPreConfigFolder: false });
            } else {
                var query, specificFolderName;
                if (WkspUtil.emailSavingConfig.preConfigFolderToSave.saveToFirstEmailFolder) {
                    query = "?where_type=751&sort=asc_name&limit=1";
                } else if (WkspUtil.emailSavingConfig.preConfigFolderToSave.specificFolderName) {
                    specificFolderName = WkspUtil.emailSavingConfig.preConfigFolderToSave.specificFolderName;
                    query = "?where_type=0&where_type=751&where_name=" + specificFolderName;
                } 

                if (query) {
                    var connector = WkspUtil.getConnector(),
                        url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), 'nodes', self.id, 'nodes', query);
                    var retrievePromise = $.ajax({
                        type: "GET",
                        headers: {
                            'OTCSTicket': connector.connection.session.ticket
                        },
                        url: url
                    });
                    retrievePromise.done(function(data) {
                        var results = data.results,
                            foundFolder = false;

                        if (results.length === 0) {
                            foundFolder = false;
                        } else if (specificFolderName) {
                            for (var i = 0; i < results.length; i++) {
                                if (results[i].data.properties.name === specificFolderName) {
                                    deferred.resolve({
                                            hasPreConfigFolder: true,
                                            folderId: results[i].data.properties.id,
                                            folderName: results[i].data.properties.name
                                        }
                                    );
                                    foundFolder = true;
                                }
                            }
                        } else if (results.length === 1) {
                            deferred.resolve({
                                    hasPreConfigFolder: true,
                                    folderId: results[0].data.properties.id,
                                    folderName: results[0].data.properties.name
                                }
                            );
                            foundFolder = true;
                        } 

                        if (!foundFolder){
                            deferred.resolve({ hasPreConfigFolder: false });
                        }
                    });
                    retrievePromise.fail(function(error, errorText) {
                        deferred.resolve({ hasPreConfigFolder: false });
                    });
                } else {
                    setTimeout(function () { deferred.resolve({ hasPreConfigFolder: false });}, 300);
                }
            }
            return promise;
        }

    });

    return wkspModel;

});
