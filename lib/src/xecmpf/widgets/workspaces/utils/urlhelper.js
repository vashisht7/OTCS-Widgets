/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define(['module',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/log',
    'csui/utils/base'
], function (module, $, _, log, base) {

    var UrlHelper = {

        getParams: function (location) {
            return location.search.replace('?', '').split('&').reduce(
                function (s, c) {
                    var t = c.split('=');
                    s[t[0].toLowerCase()] = t[1];
                    return s;
                },
                {});
        },
    }
    return UrlHelper;
});
