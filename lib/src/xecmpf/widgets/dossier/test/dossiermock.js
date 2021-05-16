/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery.mockjax"], function (mockjax) {

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
            url: "//server/otcs/cs/api/v2/businessworkspaces/dossier" +
                 "?group_by=classification" +
                 "&metadata_categories=15064",
            responseTime: 0,
            responseText: {
              "results": {
                "data": [
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/76834/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2017-01-07T16:38:17",
                        "create_user_id": 20620,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": false,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 76834,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-01-01T00:00:00",
                              "15064_3": "2017-01-07T00:00:00",
                              "15064_4": null,
                              "15064_5": null
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:24:08",
                        "modify_user_id": 1000,
                        "name": "birth11-03final-ACC.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "birth11-03final-ACC.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Birth/Adoption Certificate",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15867
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30575/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-20T10:22:35",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/doc.gif",
                        "icon_large": "/img/webdoc/doc_large.gif",
                        "id": 30575,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-06-02T00:00:00",
                              "15064_3": "2016-06-04T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "image/tiff",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Resume.tif",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Resume.tif"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30570/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-10T10:19:33",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30570,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-08-01T00:00:00",
                              "15064_3": "2014-08-05T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Resume.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Resume.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30569/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-10T10:19:29",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30569,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-01-01T00:00:00",
                              "15064_3": "2016-01-07T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Resume.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Resume.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Resume",
                    "paging": {
                      "total_count": 3
                    },
                    "query_params": {
                      "classification_id": 15938
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30574/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-19T10:21:44",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30574,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-07-01T00:00:00",
                              "15064_3": "2014-08-20T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Internal Letter of Application.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Internal Letter of Application.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22289,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30568/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-02T10:18:31",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30568,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-09-10T00:00:00",
                              "15064_3": "2014-10-02T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Application.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Application.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22288,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Application Documents",
                    "paging": {
                      "total_count": 2
                    },
                    "query_params": {
                      "classification_id": 17171
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30324/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-15T12:03:22",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30324,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-12-08T00:00:00",
                              "15064_3": "2016-12-15T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:28",
                        "modify_user_id": 1000,
                        "name": "Car Allowance.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Car Allowance.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22304,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Company Car - Allowance",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15927
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30572/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-08T10:20:43",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30572,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-01-01T00:00:00",
                              "15064_3": "2014-01-02T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Internal Letter of Application.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Internal Letter of Application.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30571/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-04T10:20:12",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30571,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2015-01-01T00:00:00",
                              "15064_3": "2015-01-02T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Internal Letter of Application.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Internal Letter of Application.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Employment Contract/Offer Letter",
                    "paging": {
                      "total_count": 2
                    },
                    "query_params": {
                      "classification_id": 15940
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30586/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-07T10:27:47",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30586,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-08-02T00:00:00",
                              "15064_3": "2016-07-13T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "employment-eligibility-verification.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "employment-eligibility-verification.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Background Check",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15910
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30585/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-07T10:27:29",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30585,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-01-01T00:00:00",
                              "15064_3": "2014-01-12T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "school certificate.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "school certificate.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Personal Details Form/Entry Form",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15942
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30583/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-02T10:25:54",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30583,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-06-27T00:00:00",
                              "15064_3": "2014-06-30T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:29",
                        "modify_user_id": 1000,
                        "name": "Certificat.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Certificat.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22307,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Training Certificate",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15868
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30577/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-01T10:23:26",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30577,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2015-11-11T00:00:00",
                              "15064_3": "2015-11-10T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:28",
                        "modify_user_id": 1000,
                        "name": "Disciplinary Warning.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Disciplinary Warning.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22299,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Disciplinary/Grievance Documentation",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15926
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30581/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-06-09T10:24:46",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/doc.gif",
                        "icon_large": "/img/webdoc/doc_large.gif",
                        "id": 30581,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2015-01-01T00:00:00",
                              "15064_3": "2015-01-06T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "image/tiff",
                        "modify_date": "2017-01-07T17:14:28",
                        "modify_user_id": 1000,
                        "name": "Tax Document.tif",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Tax Document.tif"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22302,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Tax Correspondence",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "classification_id": 15918
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30582/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-02T10:25:15",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30582,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2017-01-01T00:00:00",
                              "15064_3": "2017-01-01T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:28",
                        "modify_user_id": 1000,
                        "name": "Payslip.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Payslip.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22302,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30579/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-18T10:24:02",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/doc.gif",
                        "icon_large": "/img/webdoc/doc_large.gif",
                        "id": 30579,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2017-01-01T00:00:00",
                              "15064_3": "2016-12-26T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "image/tiff",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Employment Contract.tif",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Employment Contract.tif"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Unclassified Documents",
                    "paging": {
                      "total_count": 2
                    },
                    "query_params": {
                      "classification_id": -1
                    }
                  }
                ],
                "properties": {
                  "group_by": "classification",
                  "total_count": 11,
                  "total_documents": 16
                }
              }
            }
          }
      ));

      mocks.push(mockjax({
            url: "//server/otcs/cs/api/v2/businessworkspaces/dossier" +
                 "?group_by=create_date" +
                 "&metadata_categories=15064",
            responseTime: 0,
            responseText: {
              "results": {
                "data": [
                  {
                    "documents": [],
                    "name": "Today",
                    "paging": {
                      "total_count": 0
                    },
                    "query_params": {
                      "end_create_date": "2017-01-10T00:00:00",
                      "start_create_date": "2017-01-09T00:00:00"
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/76834/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2017-01-07T16:38:17",
                        "create_user_id": 20620,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": false,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 76834,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-01-01T00:00:00",
                              "15064_3": "2017-01-07T00:00:00",
                              "15064_4": null,
                              "15064_5": null
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:24:08",
                        "modify_user_id": 1000,
                        "name": "birth11-03final-ACC.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "birth11-03final-ACC.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Last week",
                    "paging": {
                      "total_count": 1
                    },
                    "query_params": {
                      "end_create_date": "2017-01-09T00:00:00",
                      "start_create_date": "2017-01-02T00:00:00"
                    }
                  },
                  {
                    "documents": [],
                    "name": "Two weeks ago",
                    "paging": {
                      "total_count": 0
                    },
                    "query_params": {
                      "end_create_date": "2017-01-02T00:00:00",
                      "start_create_date": "2016-12-26T00:00:00"
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30575/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-20T10:22:35",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/doc.gif",
                        "icon_large": "/img/webdoc/doc_large.gif",
                        "id": 30575,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-06-02T00:00:00",
                              "15064_3": "2016-06-04T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "image/tiff",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Resume.tif",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Resume.tif"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30574/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-19T10:21:44",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30574,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-07-01T00:00:00",
                              "15064_3": "2014-08-20T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Internal Letter of Application.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Internal Letter of Application.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22289,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Three weeks ago",
                    "paging": {
                      "total_count": 2
                    },
                    "query_params": {
                      "end_create_date": "2016-12-26T00:00:00",
                      "start_create_date": "2016-12-19T00:00:00"
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30324/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-15T12:03:22",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30324,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-12-08T00:00:00",
                              "15064_3": "2016-12-15T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:28",
                        "modify_user_id": 1000,
                        "name": "Car Allowance.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Car Allowance.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22304,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30572/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-08T10:20:43",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30572,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-01-01T00:00:00",
                              "15064_3": "2014-01-02T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Internal Letter of Application.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Internal Letter of Application.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30586/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-07T10:27:47",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30586,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-08-02T00:00:00",
                              "15064_3": "2016-07-13T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "employment-eligibility-verification.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "employment-eligibility-verification.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30585/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-07T10:27:29",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30585,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-01-01T00:00:00",
                              "15064_3": "2014-01-12T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "school certificate.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "school certificate.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30583/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-12-02T10:25:54",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30583,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-06-27T00:00:00",
                              "15064_3": "2014-06-30T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:29",
                        "modify_user_id": 1000,
                        "name": "Certificat.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Certificat.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22307,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Last Month",
                    "paging": {
                      "total_count": 6
                    },
                    "query_params": {
                      "end_create_date": "2016-12-19T00:00:00",
                      "start_create_date": "2016-12-01T00:00:00"
                    }
                  },
                  {
                    "documents": [
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30579/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-18T10:24:02",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/doc.gif",
                        "icon_large": "/img/webdoc/doc_large.gif",
                        "id": 30579,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2017-01-01T00:00:00",
                              "15064_3": "2016-12-26T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "image/tiff",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Employment Contract.tif",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Employment Contract.tif"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30570/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-10T10:19:33",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30570,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-08-01T00:00:00",
                              "15064_3": "2014-08-05T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Resume.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Resume.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30569/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-10T10:19:29",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30569,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2016-01-01T00:00:00",
                              "15064_3": "2016-01-07T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Resume.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Resume.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22285,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30571/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-04T10:20:12",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/apppdf.gif",
                        "icon_large": "/img/webdoc/apppdf_large.gif",
                        "id": 30571,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2015-01-01T00:00:00",
                              "15064_3": "2015-01-02T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/pdf",
                        "modify_date": "2017-01-07T17:14:26",
                        "modify_user_id": 1000,
                        "name": "Richard Maxx-Internal Letter of Application.pdf",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Richard Maxx-Internal Letter of Application.pdf"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22277,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      },
                      {
                        "actions": {
                          "data": {
                            "default": {
                              "body": "",
                              "content_type": "",
                              "href": "api/v1/nodes/30568/content?action=open",
                              "href_form": "",
                              "method": "GET",
                              "name": "Open"
                            }
                          },
                          "map": {
                            "default_action": "Open"
                          },
                          "order": [
                            "default"
                          ]
                        },
                        "container": false,
                        "container_size": 0,
                        "create_date": "2016-11-02T10:18:31",
                        "create_user_id": 1000,
                        "description": "",
                        "description_multilingual": {
                          "en": "",
                          "en_IN": ""
                        },
                        "favorite": true,
                        "guid": null,
                        "icon": "/img/webdoc/appword.gif",
                        "icon_large": "/img/webdoc/appword_large.gif",
                        "id": 30568,
                        "metadata_categories": {
                          "15064": {
                            "data": {
                              "15064_2": "2014-09-10T00:00:00",
                              "15064_3": "2014-10-02T00:00:00",
                              "15064_4": "Admin",
                              "15064_5": "Admin"
                            },
                            "definitions": {
                              "15064": {
                                "key": "15064",
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "Document Categories",
                                "next_id": 6,
                                "persona": "category",
                                "read_only": true,
                                "required": false,
                                "type": -18,
                                "valid_values": [],
                                "version_number": 1
                              },
                              "15064_2": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_2",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "DateOfOrigin",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_3": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "include_time": false,
                                "key": "15064_3",
                                "key_value_pairs": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchiveDate",
                                "persona": "",
                                "read_only": false,
                                "required": false,
                                "type": -7,
                                "type_name": "Date",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_4": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_4",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "CreatedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              },
                              "15064_5": {
                                "allow_undefined": false,
                                "bulk_shared": false,
                                "default_value": null,
                                "description": null,
                                "hidden": false,
                                "key": "15064_5",
                                "key_value_pairs": false,
                                "max_length": 32,
                                "min_length": null,
                                "multiline": false,
                                "multilingual": false,
                                "multi_value": false,
                                "multi_value_length_default": 1,
                                "multi_value_length_fixed": true,
                                "multi_value_length_max": 1,
                                "name": "ArchivedBy",
                                "password": false,
                                "persona": "",
                                "read_only": false,
                                "regex": "",
                                "required": false,
                                "type": -1,
                                "type_name": "String",
                                "valid_values": [],
                                "valid_values_name": []
                              }
                            },
                            "definitions_map": {},
                            "definitions_order": [
                              "15064_2",
                              "15064_3",
                              "15064_4",
                              "15064_5"
                            ]
                          }
                        },
                        "mime_type": "application/msword",
                        "modify_date": "2017-01-07T17:14:27",
                        "modify_user_id": 1000,
                        "name": "Application.doc",
                        "name_multilingual": {
                          "en": "",
                          "en_IN": "Application.doc"
                        },
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 22288,
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_user_id": 0,
                        "type": 144,
                        "type_name": "Document",
                        "versions_control_advanced": false,
                        "volume_id": 22272
                      }
                    ],
                    "name": "Older",
                    "paging": {
                      "total_count": 7
                    },
                    "query_params": {
                      "end_create_date": "2016-12-01T00:00:00",
                      "start_create_date": null
                    }
                  }
                ],
                "properties": {
                  "group_by": "create_date",
                  "total_count": 12,
                  "total_documents": 16
                }
              }
            }
          }
      ));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=*',
        responseTime: 0,
        responseText: {
          token: 'dummy'
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/*/businessworkspace',
        responseTime: 0,
        responseText: {
          results: {}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes?actions',
        responseTime: 0,
        responseText: {}
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop())) {
        mockjax.clear(mock);
      }
    }
  }
});
