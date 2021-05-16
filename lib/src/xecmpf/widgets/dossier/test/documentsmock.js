/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery.mockjax"], function (mockjax) {

  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/businessworkspaces/dossier/documents" +
             "?end_create_date=2016-12-19T00%3A00%3A00" +
             "&start_create_date=2016-12-01T00%3A00%3A00" +
             "&metadata_categories=15064" +
             "&limit=5&page=2",
        responseTime: 0,
        responseText: {
          "results": {
            "data": [
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
              }
            ]
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/businessworkspaces/dossier/documents" +
             "?end_create_date=2016-12-01T00%3A00%3A00" +
             "&start_create_date=" +
             "&metadata_categories=15064" +
             "&limit=5&page=2",
        responseTime: 0,
        responseText: {
          "results": {
            "data": [
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
              },
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
            ]
          }
        }
      }));
    },
    disable: function () {
      var mock;
      while ((mock = mocks.pop())) {
        mockjax.clear(mock);
      }
    }
  };
});
