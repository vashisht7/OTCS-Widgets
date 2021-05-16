/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {

    var businessAttachments =
        {
            "actions": {
                "data": {
                    "add_business_attachment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/69972/businessattachments",
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
                        "href": "/api/v2/nodes/69972/businessattachments?expand=user&limit=30&page=1&sort=asc_name&metadata",
                        "method": "GET",
                        "name": ""
                    }
                }
            },
            "paging": {
                "limit": 30,
                "page": 1,
                "page_total": 1,
                "range_max": 9,
                "range_min": 1,
                "total_count": 9
            },
            "results": [
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D5G/EQUI/000000000010006062",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D5G/EQUI/000000000010006062",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d5g.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d000000000010006062%3bOBJTYPE%3dEQUI&~OkCode=ONLI",
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
                            "name": "Equipment Delivery Truck",
                            "create_date": "2016-10-21T02:05:08",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "asdfgh",
                            "bo_id": "000000000010006062",
                            "bo_type_id": 2,
                            "bo_type": "EQUI",
                            "bo_type_name": "Equipment D5G",
                            "ext_system_id": "D5G",
                            "ext_system_name": "D5G",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D5G/EQUI/000000000010002865",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D5G/EQUI/000000000010002865",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d5g.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d000000000010002865%3bOBJTYPE%3dEQUI&~OkCode=ONLI",
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
                            "name": "Equipment External components",
                            "create_date": "2016-10-21T02:04:12",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "12345",
                            "bo_id": "000000000010002865",
                            "bo_type_id": 2,
                            "bo_type": "EQUI",
                            "bo_type_name": "Equipment D5G",
                            "ext_system_id": "D5G",
                            "ext_system_name": "D5G",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000001000",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000001000",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000001000%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
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
                            "name": "Vendor C.E.B. BERLIN",
                            "create_date": "2016-10-25T05:03:46",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000001000",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000004711",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000004711",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000004711%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
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
                            "name": "Vendor Cinsa GmbH & Co. KG",
                            "create_date": "2016-10-25T05:06:43",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000004711",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000000002",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000000002",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000000002%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
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
                            "name": "Vendor Electronic Components Distributor",
                            "create_date": "2016-10-14T05:43:36",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000000002",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000000001",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000000001",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000000001%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
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
                            "name": "Vendor Forks Manufacturing GmbH",
                            "create_date": "2016-10-21T02:05:49",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000000001",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000005200",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000005200",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000005200%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
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
                            "name": "Vendor Intershop",
                            "create_date": "2016-10-25T05:06:51",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000005200",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000005205",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000005205",
                                "method": "PUT",
                                "name": "Edit"
                            },
                            "open_sap_object": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "https://mucr3d9a.opentext.net:8443/sap/bc/gui/sap/its/webgui?~logingroup=SPACE&~transaction=%2fOTX%2fRM_WSC_START_BO+KEY%3d0000005205%3bOBJTYPE%3dLFA1&~OkCode=ONLI",
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
                            "name": "Vendor RS Components",
                            "create_date": "2016-10-25T05:06:51",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000005205",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                },
                {
                    "actions": {
                        "data": {
                            "delete_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000004445",
                                "method": "DELETE",
                                "name": "Remove"
                            },
                            "edit_business_attachment": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/69972/businessattachments/D9A/LFA1/0000004445",
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
                            "create_date": "2016-10-25T05:06:44",
                            "created_by": 1000,
                            "created_by_name": "Admin",
                            "comments": "",
                            "bo_id": "0000004445",
                            "bo_type_id": 3,
                            "bo_type": "LFA1",
                            "bo_type_name": "Vendor D9A",
                            "ext_system_id": "D9A",
                            "ext_system_name": "D9A",
                            "wksp_id": null
                        }
                    },
                    "metadata": {
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
                        "comments": {
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
                            "name": "Type id",
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
                            "name": "External system id",
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
                            "name": "Workspace id",
                            "persona": null,
                            "sort": false,
                            "type": 2,
                            "width_weight": 100
                        }
                    }
                }
            ]
        }
        ;


    return businessAttachments;

});
