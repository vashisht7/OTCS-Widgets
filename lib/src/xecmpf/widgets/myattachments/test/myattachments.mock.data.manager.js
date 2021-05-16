/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax',
        'xecmpf/widgets/myattachments/test/myattachments.mock'
],
    function (_, $, mockjax, MockData) {

        var doLog = true,
            logConsole = function (logobj) {
                doLog && console.log(logobj);
            };

        MockData["testMyAttachments"].enable();

         var DataManager = function DataManager() {
         };

        DataManager.test = function (totalCount, title, busObjectTypeId, addCustomColumns) {
        };


        return DataManager;
    }
)
;
