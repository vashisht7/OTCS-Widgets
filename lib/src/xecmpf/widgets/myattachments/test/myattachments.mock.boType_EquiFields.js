/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {

    var boType_EquiFields =
        {
            "links": {
                "data": {
                    "self": {
                        "body": "",
                        "content_type": "",
                        "href": "/api/v2/forms/businessobjects/search?bo_type_id=2",
                        "method": "GET",
                        "name": ""
                    }
                }
            },
            "results": [
                {
                    "data": {
                        "bo_type_id": 2,
                        "bo_type_name": "Equipment D5G",
                        "bo_type": "EQUI",
                        "ext_system_id": "D5G"
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
                        "ANLNR": "",
                        "ANLUN": "",
                        "BUKRS": "",
                        "EQUNR": "",
                        "EQKTU": ""
                    },
                    "options": {
                        "fields": {
                            "ANLNR": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Asset",
                                "readonly": false,
                                "type": "text"
                            },
                            "ANLUN": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Subnumber",
                                "readonly": false,
                                "type": "text"
                            },
                            "BUKRS": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Company Code",
                                "readonly": false,
                                "type": "text"
                            },
                            "EQUNR": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Equipment",
                                "readonly": false,
                                "type": "text"
                            },
                            "EQKTU": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Equipment descript.",
                                "readonly": false,
                                "type": "text"
                            }
                        }
                    },
                    "schema": {
                        "properties": {
                            "ANLNR": {
                                "readonly": false,
                                "required": false,
                                "title": "Asset",
                                "type": "string"
                            },
                            "ANLUN": {
                                "readonly": false,
                                "required": false,
                                "title": "Subnumber",
                                "type": "string"
                            },
                            "BUKRS": {
                                "readonly": false,
                                "required": false,
                                "title": "Company Code",
                                "type": "string"
                            },
                            "EQUNR": {
                                "readonly": false,
                                "required": false,
                                "title": "Equipment",
                                "type": "string"
                            },
                            "EQKTU": {
                                "readonly": false,
                                "required": false,
                                "title": "Equipment descript.",
                                "type": "string"
                            }
                        },
                        "title": "Equipment D5G",
                        "type": "object"
                    }
                }
            ]
        }
        ;


    return boType_EquiFields;

});
