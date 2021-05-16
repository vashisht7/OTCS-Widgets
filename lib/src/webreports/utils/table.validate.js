/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module',
    'csui/lib/underscore'
], function (module, _) {

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30,
        defaultPageSizeOptions: [30, 50, 100],
        maxPageSize: 100
    });

    var tableValidate = _.extend({

        checkPageSize: function (pageSize, pageSizeOptions) {
            if (pageSize && !pageSizeOptions) {
                pageSizeOptions = config.defaultPageSizeOptions;
            }
            if (_.contains(pageSizeOptions, pageSize)) {
                return pageSize;
            }
            else {
                pageSize = config.defaultPageSize;
            }
            return pageSize;
        },

        checkPageSizeOptions: function (pageSizeOptions, pageSize) {
            if (pageSizeOptions && !pageSize) {
                pageSizeOptions = config.defaultPageSizeOptions;
            }
            pageSizeOptions = _.reject(pageSizeOptions, function (num) {
                return num < 1 || num > config.maxPageSize;
            });
            if (_.contains(pageSizeOptions, pageSize)) {
                return pageSizeOptions;
            }
            else {
                pageSizeOptions = config.defaultPageSizeOptions;
            }
            return pageSizeOptions;
        }

    });

    return tableValidate;
});
