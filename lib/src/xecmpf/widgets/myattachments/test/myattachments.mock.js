/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/jquery.mockjax',
    'xecmpf/widgets/myattachments/test/myattachments.mock.businessattachments_asc_bo_id',
    'xecmpf/widgets/myattachments/test/myattachments.mock.businessattachments_desc_bo_id',
    'xecmpf/widgets/myattachments/test/myattachments.mock.businessattachments_asc_name',
    'xecmpf/widgets/myattachments/test/myattachments.mock.businessattachments_desc_name',
    'xecmpf/widgets/myattachments/test/myattachments.mock.businessattachments_filter',
    'xecmpf/widgets/myattachments/test/myattachments.mock.boType_EquiFields',
    'xecmpf/widgets/myattachments/test/myattachments.mock.boType_VendorFields',
    'xecmpf/widgets/myattachments/test/myattachments.mock.boType_SearchResult',
    'xecmpf/widgets/myattachments/test/myattachments.mock.boType_AttachResult'
], function ($, mockjax, businessAttachments_asc_bo_id,businessAttachments_desc_bo_id,
             businessAttachments_asc_name,
             businessAttachments_desc_name, businessAttachments_filter, boTypeEquiFieds, boTypeVendorFieds, boTypeSearchResult, boTypeAttachResult) {

    var DataManager = function DataManager() {
    };

    var url = '//server/otcs/cs/api/v2';
    var url_node = url + '/nodes/120';
    DataManager.url = url;
    DataManager.testMyAttachments = {

        mocks: [],
        enable: function () {
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&sort=asc_bo_id&metadata',
                responseTime: 0,
                responseText: businessAttachments_asc_bo_id
            }));
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&sort=desc_bo_id&metadata',
                responseTime: 0,
                responseText: businessAttachments_desc_bo_id
            }));
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&sort=asc_name&metadata',
                responseTime: 0,
                responseText: businessAttachments_desc_name
            }));
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&sort=desc_name&metadata',
                responseTime: 0,
                responseText: businessAttachments_asc_name
            }));

            this.mocks.push(mockjax({
                url: url_node + '/businessattachments',
                responseTime: 0,
                responseText: businessAttachments_asc_bo_id
            }));
            
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&where_name=contains_Hamburg&sort=asc_bo_id&metadata',
                responseTime: 0,
                responseText: businessAttachments_filter
            }));
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&where_name=contains_Hamburg&sort=desc_name&metadata',
                responseTime: 0,
                responseText: businessAttachments_asc_name
            }));
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments?expand=user&limit=30&page=1&where_name=contains_Hamburg&sort=asc_name&metadata',
                responseTime: 0,
                responseText: businessAttachments_desc_name
            }));
            this.mocks.push(mockjax({
                url: url_node + '/addablebotypes',
                responseTime: 0,
                responseText: {
                    "links": {
                        "data": {
                            "self": {
                                "body": "",
                                "content_type": "",
                                "href": "/api/v2/nodes/69972/addablebotypes",
                                "method": "GET",
                                "name": ""
                            }
                        }
                    },
                    "results": [
                        {
                            "data": {
                                "properties": {
                                    "bo_type": "EQUI",
                                    "bo_type_id": 2,
                                    "bo_type_name": "Equipment D5G",
                                    "ext_system_id": "D5G",
                                    "is_default_Search": true
                                }
                            }
                        },
                        {
                            "data": {
                                "properties": {
                                    "bo_type": "EQUI",
                                    "bo_type_id": 1,
                                    "bo_type_name": "Equipment D9A",
                                    "ext_system_id": "D9A",
                                    "is_default_Search": false
                                }
                            }
                        },
                        {
                            "data": {
                                "properties": {
                                    "bo_type": "LFA1",
                                    "bo_type_id": 3,
                                    "bo_type_name": "Vendor D9A",
                                    "ext_system_id": "D9A",
                                    "is_default_Search": true
                                }
                            }
                        }
                    ]
                }
            }));
            this.mocks.push(mockjax({
                url: url + '/forms/businessobjects/search?bo_type_id=2',
                responseTime: 0,
                responseText: boTypeEquiFieds
            }));
            this.mocks.push(mockjax({
                url: url + '/forms/businessobjects/search?bo_type_id=3',
                responseTime: 0,
                responseText: boTypeVendorFieds
            }));

            this.mocks.push(mockjax({
                url: url_node + '/businessattachments/D5G/EQUI/000000000010002865',
                type: 'DELETE',
                responseTime: 50,
                responseText: {
                    "links": {
                        "data": {
                            "self": {
                                "body": "",
                                "content_type": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D5G/EQUI/000000000010002865",
                                "method": "DELETE",
                                "name": ""
                            }
                        }
                    },
                    "results": {}
                }

            }));
            this.mocks.push(mockjax({
                url: url + '/businessobjects?bo_type_id=3&limit=100&page=1',
                responseTime: 0,
                responseText: boTypeSearchResult
            }));
            var s = url_node + '/businessattachments';
            this.mocks.push(mockjax({
                url: url_node + '/businessattachments',
                type: 'POST',
                responseTime: 50,
                response: {
                    "ext_system_id": "D9A",
                    "bo_type": "LFA1",
                    "bo_id": "0000000005",
                    "comment": "",
                    "wait": true,
                    "silent": true
                },
                responseText: boTypeAttachResult
            }));

            this.mocks.push(mockjax({
                url: '//server/otcs/cs/api/v1/...',
                responseTime: 0,
                responseText: {/*...*/}
            }));
        },

        disable: function () {
            var mock;
            while ((mock = this.mocks.pop())) {
                mockjax.clear(mock);
            }
            $.mockjax.clear();
        }

    };

    return DataManager;

});


