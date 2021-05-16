/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {

    var businessAttachments_filter =
        {
            "actions": {
                "data": {
                    "add_business_attachment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/123652/businessattachments",
                        "method": "POST",
                        "name": "Add"
                    }
                },
                "map": {
                    "default_action": null
                },
                "order": [
                    "add_business_attachment"
                ]
            },
            "links": {
                "data": {
                    "self": {
                        "body": "",
                        "content_type": "",
                        "href": "/api/v2/nodes/123652/businessattachments?expand=user&limit=30&page=1&where_name=contains_Hamburg&sort=asc_bo_id&metadata",
                        "method": "GET",
                        "name": ""
                    }
                }
            },
            "meta_data": {
                "properties": {
                    "name": {
                        "align": "left",
                        "name": "Name",
                        "persona": null,
                        "sort": true,
                        "type": -1,
                        "width_weight": 100
                    },
                    "create_date": {
                        "align": "left",
                        "name": "Date created",
                        "persona": null,
                        "sort": true,
                        "type": -7,
                        "width_weight": 100
                    },
                    "created_by": {
                        "align": "left",
                        "name": "Created by",
                        "persona": null,
                        "sort": true,
                        "type": -1,
                        "width_weight": 100
                    },
                    "created_by_name": {
                        "align": "left",
                        "name": "Created by",
                        "persona": null,
                        "sort": true,
                        "type": -1,
                        "width_weight": 100
                    },
                    "comment": {
                        "align": "left",
                        "name": "Comments",
                        "persona": null,
                        "sort": false,
                        "type": -1,
                        "width_weight": 100
                    },
                    "bo_id": {
                        "align": "left",
                        "name": "Number",
                        "persona": null,
                        "sort": true,
                        "type": -1,
                        "width_weight": 100
                    },
                    "bo_type_id": {
                        "align": "left",
                        "name": "Type ID",
                        "persona": null,
                        "sort": false,
                        "type": 2,
                        "width_weight": 100
                    },
                    "bo_type": {
                        "align": "left",
                        "name": "Type",
                        "persona": null,
                        "sort": false,
                        "type": -1,
                        "width_weight": 100
                    },
                    "bo_type_name": {
                        "align": "left",
                        "name": "Type name",
                        "persona": null,
                        "sort": true,
                        "type": -1,
                        "width_weight": 100
                    },
                    "ext_system_id": {
                        "align": "left",
                        "name": "External system ID",
                        "persona": null,
                        "sort": false,
                        "type": 2,
                        "width_weight": 100
                    },
                    "ext_system_name": {
                        "align": "left",
                        "name": "Location",
                        "persona": null,
                        "sort": true,
                        "type": -1,
                        "width_weight": 100
                    },
                    "wksp_id": {
                        "align": "left",
                        "name": "Workspace ID",
                        "persona": null,
                        "sort": false,
                        "type": 2,
                        "width_weight": 100
                    }
                }
            },
            "paging": {
                "limit": 30,
                "page": 1,
                "page_total": 1,
                "range_max": 1,
                "range_min": 1,
                "total_count": 1
            },
            "results": [
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/123652/businessattachments/D9A/LFA1/0000004445",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/123652/businessattachments/D9A/LFA1/0000004445",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000004445%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
                                "method": "GET",
                                "name": "Display"
                            }
                        },
                        "map": {
                            "default_action": null
                        },
                        "order": [
                            "open_sap_object",
                            "edit_business_attachment",
                            "delete_business_attachment"
                        ]
                    },
                    "data": {
                        "properties": {
                            "name": "Vendor Werk Hamburg (1000)",
                            "create_date": "2016-12-08T05:25:30",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comment": "",
                            "bo_id": "0000004445",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    }
                }
            ]
        }
        ;


    return businessAttachments_filter;

});
