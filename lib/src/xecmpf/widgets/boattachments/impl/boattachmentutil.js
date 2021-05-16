/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',
    "i18n!xecmpf/widgets/boattachments/impl/nls/lang",

], function ($, _,
             lang) {

    function BOAttachmentUtil() {
    }

    _.extend(BOAttachmentUtil.prototype, {

        formatFilzeSize: function (node) {
            var size = node.size;
            if (node.container!==undefined && node.container === true) {
                return size + ' ' + lang.items;
            } else {
                var filesSize = lang.fileSizeByte;
                if (size > 1024) {
                    filesSize = lang.fileSizeKByte;
                    size = size / 1024;
                    if (size > 1024) {
                        filesSize = lang.fileSizeMByte;
                        size = size / 1024;
                        if (size > 1024) {
                            filesSize = lang.fileSizeGByte;
                            size = size / 1024;
                        }
                    }
                }
                return Math.ceil(size) + ' ' + filesSize;
            }
        },
        orderByAsString: function (orderBy, defCol, defOrd) {
            var sc;

            var ret, order = {sc: defCol, so: defOrd};
            if (orderBy) {
                order = _.defaults({sc: orderBy.sortColumn, so: orderBy.sortOrder}, order);
            }
            if (order.sc) {
                var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
                var match = parameterPlaceholder.exec(order.sc);
                if (match) {
                    order.sc = match[1];
                } else {
                    order.sc = undefined;
                }
            }
            if (order.sc || order.so) {
                ret = _.str.sformat("{0} {1}", order.sc ? order.sc : "name", order.so ? order.so : "asc");
            }
            return ret;
        }

    });

    return new BOAttachmentUtil();
});
