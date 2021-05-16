/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {

    var boType_VendorFields =
        {
            "links": {
                "data": {
                    "self": {
                        "body": "",
                        "content_type": "",
                        "href": "/api/v2/forms/businessobjects/search?bo_type_id=3",
                        "method": "GET",
                        "name": ""
                    }
                }
            },
            "results": [
                {
                    "data": {
                        "bo_type_id": 3,
                        "bo_type_name": "Vendor D9A",
                        "bo_type": "LFA1",
                        "ext_system_id": "D9A"
                    },
                    "options": {
                        "fields": {
                            "bo_type_id": {
                                "hidden": true,
                                "hideInitValidationError": true,
                                "label": "Business Object Type Id",
                                "readonly": true,
                                "type": "number"
                            },
                            "bo_type_name": {
                                "hidden": true,
                                "hideInitValidationError": true,
                                "label": "Business Object Type Name",
                                "readonly": true,
                                "type": "text"
                            },
                            "bo_type": {
                                "hidden": true,
                                "hideInitValidationError": true,
                                "label": "Business Object Type",
                                "readonly": true,
                                "type": "text"
                            },
                            "ext_system_id": {
                                "hidden": true,
                                "hideInitValidationError": true,
                                "label": "External Sytem Id",
                                "readonly": true,
                                "type": "text"
                            }
                        }
                    },
                    "schema": {
                        "properties": {
                            "bo_type_id": {
                                "readonly": true,
                                "required": true,
                                "title": "Business Object Type Id",
                                "type": "integer"
                            },
                            "bo_type_name": {
                                "readonly": true,
                                "required": false,
                                "title": "Business Object Type Name",
                                "type": "string"
                            },
                            "bo_type": {
                                "readonly": true,
                                "required": false,
                                "title": "Business Object Type",
                                "type": "string"
                            },
                            "ext_system_id": {
                                "readonly": true,
                                "required": false,
                                "title": "External Sytem Id",
                                "type": "string"
                            }
                        }
                    }
                },
                {
                    "data": {
                        "LAND1": "",
                        "SORTL": "",
                        "MCOD1": "",
                        "MCOD3": "",
                        "LIFNR": ""
                    },
                    "options": {
                        "fields": {
                            "LAND1": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Country",
                                "readonly": false,
                                "type": "text"
                            },
                            "SORTL": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Search term",
                                "readonly": false,
                                "type": "text"
                            },
                            "MCOD1": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Name",
                                "readonly": false,
                                "type": "text"
                            },
                            "MCOD3": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "City",
                                "readonly": false,
                                "type": "text"
                            },
                            "LIFNR": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Vendor",
                                "readonly": false,
                                "type": "text"
                            }
                        }
                    },
                    "schema": {
                        "properties": {
                            "LAND1": {
                                "readonly": false,
                                "required": false,
                                "title": "Country",
                                "type": "string"
                            },
                            "SORTL": {
                                "readonly": false,
                                "required": false,
                                "title": "Search term",
                                "type": "string"
                            },
                            "MCOD1": {
                                "readonly": false,
                                "required": false,
                                "title": "Name",
                                "type": "string"
                            },
                            "MCOD3": {
                                "readonly": false,
                                "required": false,
                                "title": "City",
                                "type": "string"
                            },
                            "LIFNR": {
                                "readonly": false,
                                "required": false,
                                "title": "Vendor",
                                "type": "string"
                            }
                        },
                        "title": "Vendor D9A",
                        "type": "object"
                    }
                }
            ]
        }
        ;


    return boType_VendorFields;

});
