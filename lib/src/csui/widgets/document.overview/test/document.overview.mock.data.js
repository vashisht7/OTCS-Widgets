/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  return {
    enable: function () {
      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/26820417/thumbnails/medium/content?suppress_response_codes',
        responseText: {}
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/26820417*',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/26820417?expand=properties{reserved_user_id,reserved_user_id}&fields=columns&fields=followups&fields=properties&fields=rmiconsdata&fields=versions{owner_id}.element(0)&metadata&state=true",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "columns": [
                {
                  "data_type": 2,
                  "key": "type",
                  "name": "Type",
                  "sort_key": "type"
                },
                {
                  "data_type": -1,
                  "key": "name",
                  "name": "Name",
                  "sort_key": "name"
                },
                {
                  "data_type": -1,
                  "key": "size_formatted",
                  "name": "Size",
                  "sort_key": "size"
                },
                {
                  "data_type": 401,
                  "include_time": true,
                  "key": "modify_date",
                  "name": "Modified",
                  "sort_key": "modify_date"
                },
                {
                  "data_type": 14,
                  "key": "owner_user_id",
                  "name": "Owner",
                  "sort_key": ""
                },
                {
                  "data_type": 401,
                  "include_time": true,
                  "key": "create_date",
                  "name": "Creation Date",
                  "sort_key": "create_date"
                },
                {
                  "data_type": 14,
                  "key": "create_user_id",
                  "name": "Created By",
                  "sort_key": ""
                },
                {
                  "data_type": 2,
                  "key": "wnd_comments",
                  "name": "Comments",
                  "sort_key": ""
                },
                {
                  "data_type": 14,
                  "key": "reserved_user_id",
                  "name": "Reserved By",
                  "sort_key": ""
                }
              ],
              "followups": [],
              "properties": {
                "advanced_versioning": false,
                "container": false,
                "container_size": 0,
                "create_date": "2018-10-24T23:49:36",
                "create_user_id": 1000,
                "description": "The version control options in Content Server offer versatility. In\nmany file storage systems, when you modify a document, you\nreplace the document with the modified document. Content\nServer keeps each version of a modified document. Keeping the\nolder versions allows you to:\n\uf0b7 Go back to previous work \u2013 Maybe changes were made to\na document that should be reversed. Without versions, you\ncannot go back to previous work.\n\uf0b7 View the historical progression of a document \u2013 you can\nview the history of a document to see the progression of\nchange.\n\uf0b7 Have multiple backups as opposed to a single copy \u2013\nWithout versions, if something happens to the most recent\nversion, you have lost all your work.\n\uf0b7 Search old versions of documents for information \u2013\nsometimes historical information is just what someone is\nlooking for.\nTracking document changes and maintaining versioning is\nespecially important for organizations that have or are working\ntowards ISO (International Standards Organization) certification\nand Sarbanes-Oxley requirements.\nStep Set 4-6: Accessing an Item\u2019s Versions\n1. Select Properties > Versions from the Functions menu for\nthe item.\nOpen Text Internal Use",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "The version control options in Content Server offer versatility. In\nmany file storage systems, when you modify a document, you\nreplace the document with the modified document. Content\nServer keeps each version of a modified document. Keeping the\nolder versions allows you to:\n\uf0b7 Go back to previous work \u2013 Maybe changes were made to\na document that should be reversed. Without versions, you\ncannot go back to previous work.\n\uf0b7 View the historical progression of a document \u2013 you can\nview the history of a document to see the progression of\nchange.\n\uf0b7 Have multiple backups as opposed to a single copy \u2013\nWithout versions, if something happens to the most recent\nversion, you have lost all your work.\n\uf0b7 Search old versions of documents for information \u2013\nsometimes historical information is just what someone is\nlooking for.\nTracking document changes and maintaining versioning is\nespecially important for organizations that have or are working\ntowards ISO (International Standards Organization) certification\nand Sarbanes-Oxley requirements.\nStep Set 4-6: Accessing an Item\u2019s Versions\n1. Select Properties > Versions from the Functions menu for\nthe item.\nOpen Text Internal Use",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "hidden": false,
                "id": 26820417,
                "mime_type": "application\/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "modify_date": "2020-01-08T20:11:46",
                "modify_user_id": 1000,
                "name": "CS10_5_Setup - Cowqeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeepeeeeeeesdfdsfdseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeey.docx",
                "name_multilingual": {
                  "de_DE": "",
                  "en": "CS10_5_Setup - Cowqeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeepeeeeeeesdfdsfdseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeey.docx",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner": "Admin, Murdock",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 26817807,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 17427,
                "size_formatted": "18 KB",
                "type": 144,
                "type_name": "Document",
                "versionable": true,
                "versions_control_advanced": false,
                "volume_id": -2000,
                "wnd_comments": null
              },
              "rmiconsdata": {
                "class_id": 15741269,
                "official": 0,
                "show_classify": true,
                "show_hold": false,
                "show_hold_tab": true,
                "show_official": false,
                "show_xref_tab": true
              },
              "versions": {
                "owner_id": 64151
              }
            },
            "metadata": {
              "followups": {
                "activation_by_day": {
                  "key": "activation_by_day",
                  "name": "Activation by day",
                  "persona": "",
                  "type": 2,
                  "width_weight": 100
                },
                "activation_date": {
                  "key": "activation_date",
                  "name": "Activation date",
                  "persona": "",
                  "type": -7,
                  "width_weight": 0
                },
                "assignees": {
                  "key": "assignees",
                  "name": "assignees",
                  "persona": "",
                  "type": -1,
                  "width_weight": 100
                },
                "create_date": {
                  "key": "create_date",
                  "name": "Create date",
                  "persona": "",
                  "type": -7,
                  "width_weight": 100
                },
                "create_user_id": {
                  "key": "create_user_id",
                  "name": "Create user id",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "data_id": {
                  "key": "data_id",
                  "name": "Reminder node id",
                  "persona": "",
                  "type": 2,
                  "width_weight": 100
                },
                "description": {
                  "key": "description",
                  "name": "Description",
                  "persona": "",
                  "type": -1,
                  "width_weight": 100
                },
                "due_date": {
                  "key": "due_date",
                  "name": "Due Date",
                  "persona": "",
                  "type": -7,
                  "width_weight": 100
                },
                "end_sequence_date": {
                  "key": "end_sequence_date",
                  "name": "End sequence date",
                  "persona": "",
                  "type": -7,
                  "width_weight": 0
                },
                "followup_client_id": {
                  "key": "followup_client_id",
                  "name": "Reminder client id",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "followup_client_name": {
                  "key": "followup_client_name",
                  "name": "Reminder client name",
                  "persona": "",
                  "type": -1,
                  "width_weight": 100
                },
                "followup_handler": {
                  "key": "followup_handler",
                  "name": "Reminder handler",
                  "persona": "",
                  "type": 2,
                  "width_weight": 100
                },
                "followup_id": {
                  "key": "followup_id",
                  "name": "Reminder id",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "followup_type": {
                  "key": "followup_type",
                  "name": "Reminder type",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "followup_type_name": {
                  "key": "followup_type_name",
                  "name": "Reminder type name",
                  "persona": "",
                  "type": -1,
                  "width_weight": 100
                },
                "modify_date": {
                  "key": "modify_date",
                  "name": "Modify date",
                  "persona": "",
                  "type": -7,
                  "width_weight": 0
                },
                "name": {
                  "key": "name",
                  "name": "Name",
                  "persona": "",
                  "type": -1,
                  "width_weight": 100
                },
                "parent_id": {
                  "key": "parent_id",
                  "name": "Reminder parent id",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "rule": {
                  "key": "rule",
                  "name": "Rule",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "start_sequence_date": {
                  "key": "start_sequence_date",
                  "name": "Start sequence date",
                  "persona": "",
                  "type": -7,
                  "width_weight": 100
                },
                "status": {
                  "key": "status",
                  "name": "Status",
                  "persona": "",
                  "type": 2,
                  "width_weight": 0
                },
                "status_by": {
                  "key": "status_by",
                  "name": "Status_by",
                  "persona": "",
                  "type": 2,
                  "width_weight": 100
                }
              },
              "properties": {
                "advanced_versioning": {
                  "allow_undefined": true,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "advanced_versioning",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Advanced Versioning",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "container": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "container",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Container",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "container_size": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "container_size",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Container Size",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "create_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "create_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Created",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "create_user_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "create_user_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Created By",
                  "persona": "user",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "description": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "description",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": true,
                  "multilingual": true,
                  "name": "Description",
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
                "external_create_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "external_create_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "External Create Date",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_identity": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_identity",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Identity",
                  "password": false,
                  "persona": "",
                  "read_only": true,
                  "regex": "",
                  "required": false,
                  "type": -1,
                  "type_name": "String",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_identity_type": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_identity_type",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Identity Type",
                  "password": false,
                  "persona": "",
                  "read_only": true,
                  "regex": "",
                  "required": false,
                  "type": -1,
                  "type_name": "String",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_modify_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "external_modify_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "External Modify Date",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "external_source": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "external_source",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "External Source",
                  "password": false,
                  "persona": "",
                  "read_only": true,
                  "regex": "",
                  "required": false,
                  "type": -1,
                  "type_name": "String",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "favorite": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "favorite",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Favorite",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "hidden": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": false,
                  "description": null,
                  "hidden": false,
                  "key": "hidden",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Hidden",
                  "persona": "",
                  "read_only": false,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "ID",
                  "persona": "node",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "modify_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "modify_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Modified",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "modify_user_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "modify_user_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Modified By",
                  "persona": "user",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "name": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "name",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": true,
                  "name": "Name",
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
                "owner": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "Owner",
                  "password": false,
                  "persona": "",
                  "read_only": true,
                  "regex": "",
                  "required": false,
                  "type": -1,
                  "type_name": "String",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "owner_group_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner_group_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Owned By",
                  "persona": "group",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "owner_user_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "owner_user_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Owned By",
                  "persona": "user",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "parent_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "parent_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Parent ID",
                  "persona": "node",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "reserved": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "reserved",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Reserved",
                  "persona": "",
                  "read_only": false,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "reserved_date": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "include_time": true,
                  "key": "reserved_date",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Reserved",
                  "persona": "",
                  "read_only": false,
                  "required": false,
                  "type": -7,
                  "type_name": "Date",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "reserved_user_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "reserved_user_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Reserved By",
                  "persona": "member",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "type": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "type",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Type",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "type_name": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "type_name",
                  "key_value_pairs": false,
                  "max_length": null,
                  "min_length": null,
                  "multi_value": false,
                  "multiline": false,
                  "multilingual": false,
                  "name": "Type",
                  "password": false,
                  "persona": "",
                  "read_only": true,
                  "regex": "",
                  "required": false,
                  "type": -1,
                  "type_name": "String",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "versionable": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "versionable",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Versionable",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "versions_control_advanced": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": false,
                  "description": null,
                  "hidden": false,
                  "key": "versions_control_advanced",
                  "key_value_pairs": false,
                  "multi_value": false,
                  "name": "Versions Control Advanced",
                  "persona": "",
                  "read_only": false,
                  "required": false,
                  "type": 5,
                  "type_name": "Boolean",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "volume_id": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "volume_id",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "VolumeID",
                  "persona": "node",
                  "read_only": false,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                },
                "wnd_comments": {
                  "allow_undefined": false,
                  "bulk_shared": false,
                  "default_value": null,
                  "description": null,
                  "hidden": false,
                  "key": "wnd_comments",
                  "key_value_pairs": false,
                  "max_value": null,
                  "min_value": null,
                  "multi_value": false,
                  "name": "Comments",
                  "persona": "",
                  "read_only": true,
                  "required": false,
                  "type": 2,
                  "type_name": "Integer",
                  "valid_values": [],
                  "valid_values_name": []
                }
              },
              "rmiconsdata": {
                "class_id": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                },
                "official": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                },
                "show_classify": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                },
                "show_hold": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                },
                "show_hold_tab": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                },
                "show_official": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                },
                "show_xref_tab": {
                  "hidden": false,
                  "name": "show_xref_tab",
                  "required": false,
                  "type": 5
                }
              },
              "versions": {
                "owner_id": {
                  "key": "owner_id",
                  "name": "Created By",
                  "persona": "user",
                  "type": 2
                }
              }
            },
            "metadata_map": {},
            "metadata_order": {
              "followups": [
                "followup_id",
                "parent_id",
                "data_id",
                "followup_type",
                "rule",
                "status",
                "create_user_id",
                "create_date",
                "description",
                "due_date",
                "start_sequence_date",
                "end_sequence_date",
                "status_by",
                "activation_by_day",
                "activation_date",
                "followup_handler",
                "followup_type_name",
                "followup_client",
                "followup_client_name",
                "assignees"
              ],
              "properties": [
                "id",
                "type",
                "type_name",
                "name",
                "description",
                "parent_id",
                "volume_id",
                "hidden",
                "create_date",
                "create_user_id",
                "modify_date",
                "modify_user_id",
                "owner_user_id",
                "owner_group_id",
                "reserved",
                "reserved_date",
                "reserved_user_id",
                "versionable",
                "advanced_versioning",
                "versions_control_advanced",
                "container",
                "container_size",
                "favorite",
                "external_create_date",
                "external_modify_date",
                "external_source",
                "external_identity",
                "external_identity_type",
                "owner",
                "wnd_comments"
              ]
            },
            "perspective": {
              "canEditPerspective": true,
              "options": {
                "center": {
                  "type": "csui\/widgets\/nodestable"
                }
              },
              "type": "left-center-right"
            },
            "state": {
              "properties": {
                "metadata_token": "5f4e02577f26e07f6135d5657de4309a"
              }
            }
          }
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites*',
        responseText: {
          "collection": {
            "paging": {
              "limit": 67,
              "page": 1,
              "page_total": 1,
              "range_max": 67,
              "range_min": 1,
              "total_count": 67
            },
            "sorting": {
              "sort": [
                {
                  "key": "sort",
                  "value": "asc_order"
                }
              ]
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/favorites?actions=open&actions=download&actions=properties&actions=initiateworkflow&actions=openform&expand=properties{original_id}&fields=favorites{name,tab_id}&fields=properties{container,id,name,original_id,type,type_name,parent_id,custom_view_search,version_number}&fields=versions{mime_type}.element(0)&sort=asc_order&state=true&limit=67&page=1",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25211454/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25211454/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25211454",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "content_4.docx",
                  "tab_id": 17862
                },
                "properties": {
                  "container": false,
                  "id": 25211454,
                  "name": "content_4.docx",
                  "parent_id": 25211011,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/30593841/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/30593841",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "perspective test folder",
                  "tab_id": 17862
                },
                "properties": {
                  "container": true,
                  "id": 30593841,
                  "name": "perspective test folder",
                  "parent_id": 24788426,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/26517239/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/26517239/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/26517239",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "testing with longest name 12345678901234567890_testing 134568987542262646527454572546254258254825482458258254825487258258725825825.PNG",
                  "tab_id": 17862
                },
                "properties": {
                  "container": false,
                  "id": 26517239,
                  "name": "testing with longest name 12345678901234567890_testing 134568987542262646527454572546254258254825482458258254825487258258725825825.PNG",
                  "parent_id": 35773377,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/png"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "$$ Sort_options.docx",
                  "tab_id": 17862
                },
                "properties": {
                  "container": false,
                  "id": 1563420,
                  "name": "$$ Sort_options.docx",
                  "parent_id": 914014,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/30453142/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/30453142",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "<script>alert('hello7777')</script>",
                  "tab_id": 17862
                },
                "properties": {
                  "container": true,
                  "id": 30453142,
                  "name": "<script>alert('hello999')</script>",
                  "parent_id": 14802690,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "http://google.co.in",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/29874498",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "5544",
                  "tab_id": 17862
                },
                "properties": {
                  "container": false,
                  "id": 29874498,
                  "name": "5544",
                  "parent_id": 24788426,
                  "type": 140,
                  "type_name": "URL"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/24801819/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/24801819",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "karthik folder",
                  "tab_id": 17862
                },
                "properties": {
                  "container": true,
                  "id": 24801819,
                  "name": "karthik folder",
                  "parent_id": 24788425,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20346268/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20346268",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "0009GMK",
                  "tab_id": 17862
                },
                "properties": {
                  "container": true,
                  "id": 20346268,
                  "name": "0009GMK",
                  "parent_id": 24788425,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20401051/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20401051",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Business_Workspace_ollie",
                  "tab_id": 17862
                },
                "properties": {
                  "container": true,
                  "id": 20401051,
                  "name": "Business_Workspace_ollie",
                  "parent_id": 18213611,
                  "type": 848,
                  "type_name": "Business Workspace"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/22095156/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/22095156",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Business_workspace_template",
                  "tab_id": 17862
                },
                "properties": {
                  "container": true,
                  "id": 22095156,
                  "name": "Business_workspace_template",
                  "parent_id": 22095155,
                  "type": 848,
                  "type_name": "Business Workspace"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/30639716/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/30639716",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "refcat",
                  "tab_id": 17863
                },
                "properties": {
                  "container": true,
                  "id": 30639716,
                  "name": "refcat",
                  "parent_id": 18109685,
                  "type": 848,
                  "type_name": "Business Workspace"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/26160642",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": []
              },
              "data": {
                "favorites": {
                  "name": "SavedQuery with custom view form created in classic UI and only few fields are enabled.",
                  "tab_id": 17865
                },
                "properties": {
                  "container": false,
                  "custom_view_search": true,
                  "id": 26160642,
                  "name": "SavedQuery with custom view form created in classic UI and only few fields are enabled.",
                  "parent_id": 26160752,
                  "type": 258,
                  "type_name": "Search Query"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25211011/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25211011",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "$ All mime types folder",
                  "tab_id": 17865
                },
                "properties": {
                  "container": true,
                  "id": 25211011,
                  "name": "$ All mime types folder",
                  "parent_id": 1282482,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/408261/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/408261",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Ferda",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 408261,
                  "name": "Ferda",
                  "parent_id": 16958113,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/67449/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/67449",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "MyFolder",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 67449,
                  "name": "HH_Folder",
                  "parent_id": 24788538,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "initiateworkflow": {
                    "body": "initiate_in_smartview",
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/11796866",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "initiateworkflow",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "favorites": {
                  "name": "WF with set TKL attr",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 11796866,
                  "name": "WF with set TKL attr",
                  "parent_id": 7325365,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "versions": {
                  "mime_type": null
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25170653/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25170653/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25170653",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "007 content_updated my own name.docx",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 25170653,
                  "name": "007 content_updated.docx",
                  "parent_id": 1282482,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "api/v2/nodes/32054821/versions/4/content?action=open",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/32054607",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "MARBLE24.PNG Generation version4",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 32054607,
                  "name": "MARBLE24.PNG Generation version4",
                  "original_id": 32054821,
                  "original_id_expand": {
                    "advanced_versioning": false,
                    "container": false,
                    "container_size": 0,
                    "create_date": "2019-09-12T16:29:26",
                    "create_user_id": 1000,
                    "description": "",
                    "description_multilingual": {
                      "de_DE": "",
                      "en": "",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "hidden": false,
                    "id": 32054821,
                    "mime_type": "image/png",
                    "modify_date": "2019-09-12T16:35:27",
                    "modify_user_id": 1000,
                    "name": "MARBLE24.PNG",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "MARBLE24.PNG",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin, Murdock",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 32054929,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 2081345,
                    "size_formatted": "2 MB",
                    "type": 144,
                    "type_name": "Document",
                    "versionable": true,
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_comments": null
                  },
                  "parent_id": 32054929,
                  "type": 2,
                  "type_name": "Generation",
                  "version_number": 4
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1258752/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1258752/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1258752",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "000 Dinosur png",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 1258752,
                  "name": "000 Dinosur png",
                  "parent_id": 1852695,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/jpeg"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/18109685/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/18109685",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Content Server Document Templates",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 18109685,
                  "name": "Content Server Document Templates",
                  "parent_id": -1,
                  "type": 20541,
                  "type_name": "Content Server Document Templates"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406726/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406726/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406726",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "SmartUI-Jasmine testcases overview- Vijay - July 13, 2018.mp4",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406726,
                  "name": "SmartUI-Jasmine testcases overview- Vijay - July 13, 2018.mp4",
                  "parent_id": 20406725,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "video/mp4"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "initiateworkflow": {
                    "body": "initiate_in_smartview",
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/32514154",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "initiateworkflow",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "favorites": {
                  "name": "$$$workflow",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 32514154,
                  "name": "$$$workflow",
                  "parent_id": 15892843,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "versions": {
                  "mime_type": null
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "initiateworkflow": {
                    "body": null,
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/342033",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "initiateworkflow",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "favorites": {
                  "name": "AddressWorkflow",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 342033,
                  "name": "AddressWorkflow",
                  "parent_id": 341483,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "versions": {
                  "mime_type": null
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "initiateworkflow": {
                    "body": null,
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/23232538",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "initiateworkflow",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "favorites": {
                  "name": "ddddd",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 23232538,
                  "name": "ddddd",
                  "parent_id": 1563200,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "versions": {
                  "mime_type": null
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "initiateworkflow": {
                    "body": "initiate_in_smartview",
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/28965411",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "initiateworkflow",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Completion & Signoff",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 28965411,
                  "name": "Completion & Signoff",
                  "parent_id": 29060971,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "versions": {
                  "mime_type": null
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "initiateworkflow": {
                    "body": null,
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25180761",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "initiateworkflow",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Disposition workflow map",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 25180761,
                  "name": "Disposition workflow map",
                  "parent_id": 21947873,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "versions": {
                  "mime_type": null
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406891/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406891/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406891",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (28) - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406891,
                  "name": "001 - Copy (28) - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406791/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406791/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406791",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (28) - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406791,
                  "name": "001 - Copy (28) - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/jpeg"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407120/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407120/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407120",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (28) - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20407120,
                  "name": "001 - Copy (28) - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407122/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407122/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407122",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (28) - Let's_see_how_it_works_when_the name_of_an_item_is_very_lengthy_like_this_Let's_see_how_it_works_when_the name_of_an_item_is_very_lengthy_like_this",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20407122,
                  "name": "001 - Copy (28) - Let's_see_how_it_works_when_the name_of_an_item_is_very_lengthy_like_this_Let's_see_how_it_works_when_the name_of_an_item_is_very_lengthy_like_this",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/jpeg"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406893/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406893/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406893",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406893,
                  "name": "001 - Copy (29) - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406795/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406795/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406795",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406795,
                  "name": "001 - Copy (29) - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406995/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406995/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406995",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406995,
                  "name": "001 - Copy (29) - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407439/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407439/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407439",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20407439,
                  "name": "001 - Copy (29) - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406895/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406895/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406895",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy - Copy -Rename - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406895,
                  "name": "001 - Copy (29) - Copy - Copy -Rename - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406897/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406897/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406897",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406897,
                  "name": "001 - Copy (29) - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406797/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406797/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406797",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (29) - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406797,
                  "name": "001 - Copy (29) - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406581/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406581/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406581",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406581,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/jpeg"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406799/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406799/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406799",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406799,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406678/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406678/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406678",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406678,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406585/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406585/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406585",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406585,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407341/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407341/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407341",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20407341,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407128/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407128/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407128",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20407128,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406801/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406801/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406801",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406801,
                  "name": "001 - Copy (2) - Copy - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407343/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407343/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20407343",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20407343,
                  "name": "001 - Copy (2) - Copy - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406587/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406587/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/20406587",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "001 - Copy (2) - Copy - Copy.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 20406587,
                  "name": "001 - Copy (2) - Copy - Copy.txt",
                  "parent_id": 20406677,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/27385500/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/27385500",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "TestFolder",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 27385500,
                  "name": "TestFolder",
                  "parent_id": 25439371,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/18755455/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/18755455",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Advanced Versioning",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 18755455,
                  "name": "Advanced Versioning",
                  "parent_id": 77317,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/29900489/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/29900489",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "A Physical Item",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 29900489,
                  "name": "A Physical Item",
                  "parent_id": 16958113,
                  "type": 424,
                  "type_name": "Physical Item Box"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/913574/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/913574",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "00 Navyas Test folder",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 913574,
                  "name": "00 Navyas Test folder",
                  "parent_id": 604999,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": "ecd341cf3fea3bfce86aabe0b489b94b"
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/15419307/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/15419307",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "folder2-updated",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 15419307,
                  "name": "folder2-updated",
                  "parent_id": 15419967,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25472475/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25472475",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Anton",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 25472475,
                  "name": "Anton",
                  "parent_id": 16958113,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563766/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563766/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563766",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Desert1.jpg",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 1563766,
                  "name": "Desert1.jpg",
                  "parent_id": 914014,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/jpeg"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "alt-rt.jar",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 1563760,
                  "name": "alt-rt.jar",
                  "parent_id": 914014,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "application/octet-stream"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "multibyte.txt",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 1563770,
                  "name": "multibyte.txt",
                  "parent_id": 914014,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "text/plain"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/18198651/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/18198651",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "000000Esoc_demo. js",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 18198651,
                  "name": "000000Esoc_demo. js",
                  "parent_id": 24788099,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/5194672/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/5194672",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Anusha Test Folder",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 5194672,
                  "name": "Anusha Test Folder",
                  "parent_id": 604999,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/33872403/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/33872403",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "LPAD-80749 test",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 33872403,
                  "name": "LPAD-80749 test",
                  "parent_id": 616849,
                  "type": 132,
                  "type_name": "Category Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25133027/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25133027/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25133027",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Butterfly Blue",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 25133027,
                  "name": "Butterfly Blue",
                  "parent_id": 25133021,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "image/jpeg"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25133033/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25133033/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/25133033",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Word with many Attributes.docx",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 25133033,
                  "name": "Word with many Attributes.docx",
                  "parent_id": 25133022,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "application/msword"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/24689645/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/24689645",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "HR Employee File",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 24689645,
                  "name": "HR Employee File",
                  "parent_id": 18109685,
                  "type": 848,
                  "type_name": "Business Workspace"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/28795124/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/28795124",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Arvinder",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 28795124,
                  "name": "Arvinder",
                  "parent_id": 24787987,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/34991146",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": []
              },
              "data": {
                "favorites": {
                  "name": "CVS with sidepanel",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "custom_view_search": true,
                  "id": 34991146,
                  "name": "CVS with sidepanel",
                  "parent_id": 25432343,
                  "type": 258,
                  "type_name": "Search Query"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/19964479/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/19964479",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "aa",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 19964479,
                  "name": "aa",
                  "parent_id": 18121016,
                  "type": 848,
                  "type_name": "Business Workspace"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/21454555/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/21454555",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Mumbling Irrigation Systems Plc. (BP0000004)",
                  "tab_id": null
                },
                "properties": {
                  "container": true,
                  "id": 21454555,
                  "name": "Mumbling Irrigation Systems Plc. (BP0000004)",
                  "parent_id": 21487223,
                  "type": 848,
                  "type_name": "Business Workspace"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1909455/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1909455/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1909455",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open",
                  "download"
                ]
              },
              "data": {
                "favorites": {
                  "name": "Application Widget Update.pptx",
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "id": 1909455,
                  "name": "Application Widget Update.pptx",
                  "parent_id": 408261,
                  "type": 144,
                  "type_name": "Document"
                },
                "versions": {
                  "mime_type": "application/wps-office.pptx"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/24788099/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/24788099",
                    "method": "GET",
                    "name": "Properties"
                  }
                },
                "map": {
                  "default_action": "open",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "open"
                ]
              },
              "data": {
                "favorites": {
                  "name": "$$Will be deleted",
                  "tab_id": 17861
                },
                "properties": {
                  "container": true,
                  "id": 24788099,
                  "name": "$$Will be deleted",
                  "parent_id": 24788535,
                  "type": 0,
                  "type_name": "Folder"
                }
              },
              "state": {
                "properties": {
                  "metadata_token": ""
                }
              }
            }
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/update*',
        responseText: {
          "forms": [
            {
              "data": {
                "name": "CS10_5_Setup - Cowqeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeepeeeeeeesdfdsfdseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeey.docx",
                "hidden": false,
                "description": "The version control options in Content Server offer versatility. In\nmany file storage systems, when you modify a document, you\nreplace the document with the modified document. Content\nServer keeps each version of a modified document. Keeping the\nolder versions allows you to:\n Go back to previous work – Maybe changes were made to\na document that should be reversed. Without versions, you\ncannot go back to previous work.\n View the historical progression of a document – you can\nview the history of a document to see the progression of\nchange.\n Have multiple backups as opposed to a single copy –\nWithout versions, if something happens to the most recent\nversion, you have lost all your work.\n Search old versions of documents for information –\nsometimes historical information is just what someone is\nlooking for.\nTracking document changes and maintaining versioning is\nespecially important for organizations that have or are working\ntowards ISO (International Standards Organization) certification\nand Sarbanes-Oxley requirements.\nStep Set 4-6: Accessing an Item’s Versions\n1. Select Properties > Versions from the Functions menu for\nthe item.\nOpen Text Internal Use",
                "create_date": "2018-10-24T23:49:36",
                "create_user_id": 1000,
                "type": 144,
                "type_name": "Document",
                "modify_date": "2020-01-06T19:36:32",
                "owner_user_id": 1000,
                "reserved_user_id": 1000,
                "reserved_date": "2020-01-01T18:27:46",
                "metadata_token": "f36a46c24a9fb7d26d4705de9ab606cc"
              },
              "options": {
                "fields": {
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "hidden": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Hidden",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created By",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "integer"
                  },
                  "type_name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "reserved_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reserved By",
                    "readonly": true,
                    "type": "otcs_member_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0,
                          1
                        ],
                        "select_types": [
                          0,
                          1
                        ]
                      }
                    }
                  },
                  "reserved_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "metadata_token": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Metadata Token",
                    "readonly": true,
                    "type": "text"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes/26820417",
                    "method": "PUT"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "hidden": {
                    "default": false,
                    "readonly": false,
                    "required": false,
                    "title": "Hidden",
                    "type": "boolean"
                  },
                  "description": {
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "date"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "otcs_user_picker"
                  },
                  "type": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "integer"
                  },
                  "type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "string"
                  },
                  "modify_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "date"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "otcs_user_picker"
                  },
                  "reserved_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved By",
                    "type": "otcs_member_picker"
                  },
                  "reserved_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "date"
                  },
                  "metadata_token": {
                    "maxLength": 64,
                    "minLength": 0,
                    "readonly": true,
                    "required": false,
                    "title": "Metadata Token",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "520012": {
                  "520012_2": null,
                  "520012_3": [
                    "a\naa\naaa..."
                  ],
                  "520012_4": null,
                  "520012_9": 1928347934,
                  "520012_10": false,
                  "520012_11": null,
                  "520012_12": null,
                  "520012_13": null,
                  "520012_1": {
                    "metadata_token": "",
                    "upgradeable": true,
                    "version_number": 12
                  }
                }
              },
              "options": {
                "fields": {
                  "520012": {
                    "fields": {
                      "520012_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextField",
                        "readonly": false,
                        "type": "text"
                      },
                      "520012_3": {
                        "fields": {
                          "item": {
                            "type": "textarea"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextMulti",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "520012_4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "textpopup",
                        "readonly": false,
                        "type": "select"
                      },
                      "520012_9": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "IntegerField",
                        "readonly": false,
                        "type": "integer"
                      },
                      "520012_10": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "checkbox",
                        "readonly": false,
                        "type": "checkbox"
                      },
                      "520012_11": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "textpopup_2",
                        "readonly": false,
                        "type": "text"
                      },
                      "520012_12": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "DatePopup",
                        "readonly": false,
                        "type": "date"
                      },
                      "520012_13": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "integerpopup",
                        "readonly": false,
                        "type": "integer"
                      },
                      "520012_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Category_afu",
                    "type": "object"
                  }
                }
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "520012": {
                    "properties": {
                      "520012_2": {
                        "maxLength": 64,
                        "readonly": false,
                        "required": false,
                        "title": "TextField",
                        "type": "string"
                      },
                      "520012_3": {
                        "items": {
                          "defaultItems": 3,
                          "maxItems": 3,
                          "minItems": 1,
                          "type": "string"
                        },
                        "readonly": false,
                        "required": false,
                        "title": "TextMulti",
                        "type": "array"
                      },
                      "520012_4": {
                        "enum": [
                          "line one",
                          "line two",
                          "line three",
                          "line four",
                          "Red",
                          "White",
                          "Blue",
                          "Green",
                          "Pink"
                        ],
                        "readonly": false,
                        "required": false,
                        "title": "textpopup",
                        "type": "string"
                      },
                      "520012_9": {
                        "readonly": false,
                        "required": false,
                        "title": "IntegerField",
                        "type": "integer"
                      },
                      "520012_10": {
                        "readonly": false,
                        "required": false,
                        "title": "checkbox",
                        "type": "boolean"
                      },
                      "520012_11": {
                        "readonly": false,
                        "required": false,
                        "title": "textpopup_2",
                        "type": "string"
                      },
                      "520012_12": {
                        "readonly": false,
                        "required": false,
                        "title": "DatePopup",
                        "type": "date"
                      },
                      "520012_13": {
                        "readonly": false,
                        "required": false,
                        "title": "integerpopup",
                        "type": "integer"
                      },
                      "520012_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Category_afu",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            },
            {
              "data": {
                "followup_id": null,
                "status": null
              },
              "options": {
                "fields": {
                  "followup_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reminder ID",
                    "readonly": false,
                    "type": "integer"
                  },
                  "status": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status",
                    "readonly": false,
                    "type": "integer"
                  }
                }
              },
              "role_name": "followups",
              "schema": {
                "properties": {
                  "followup_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Reminder ID",
                    "type": "integer"
                  },
                  "status": {
                    "readonly": false,
                    "required": true,
                    "title": "Status",
                    "type": "integer"
                  }
                },
                "title": "Reminder",
                "type": "object"
              }
            },
            {
              "data": {
                "interests": null
              },
              "options": {
                "fields": {
                  "interests": null
                }
              },
              "role_name": "interests",
              "schema": {
                "properties": {
                  "interests": null
                },
                "title": "Interests",
                "type": "object"
              }
            },
            {
              "data": {
                "nickname": null
              },
              "options": {
                "fields": {
                  "nickname": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Nickname",
                    "readonly": false,
                    "type": "text"
                  }
                }
              },
              "role_name": "nicknames",
              "schema": {
                "properties": {
                  "nickname": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Nickname",
                    "type": "string"
                  }
                },
                "title": "Nicknames",
                "type": "object"
              }
            },
            {
              "data": {
                "inherited_rmclassification_id": null,
                "default_rmclassification_id": null,
                "rmclassification_id": 15741269,
                "file_number": "3",
                "rsi": null,
                "record_date": "2018-10-24T00:00:00",
                "record_type": null,
                "status": "CODE4",
                "status_date": "2019-06-20T00:00:00",
                "received_date": null,
                "essential": "NO",
                "cycle_period": null,
                "last_review_date": null,
                "next_review_date": null,
                "official": false,
                "storage": "MIXED",
                "accession": null,
                "subject": null,
                "originator": null,
                "addressee": null,
                "sent_to": null,
                "establishment": null,
                "record_officer_id": 0,
                "records_manager_id": 0,
                "secondary_class_ids": [
                  17863745
                ],
                "name": "RMClassificationLengthynameWithoutAnySpacesInIt",
                "type": 551,
                "selectable": true,
                "management_type": "manual",
                "score": null,
                "is_primary": 1,
                "record_officer_name": "",
                "records_manager_name": "",
                "inherit_from": false,
                "extradata": {
                  "canBeUnclassified": true,
                  "canFinalize": true,
                  "canRMClassify": true,
                  "classVolumeID": 1707840,
                  "inherit_from": false,
                  "inheritanceMetadataUpdate": {
                    "essential": true,
                    "official": true,
                    "rsi": true,
                    "status": true,
                    "status_date": true,
                    "storage": true
                  },
                  "multiClass": false,
                  "rm_metadataToken": "",
                  "showTab": true,
                  "vitalRecordCodes": [
                    "VITAL"
                  ]
                }
              },
              "options": {
                "fields": {
                  "inherited_rmclassification_id": {
                    "fields": {
                      "item": {
                        "type": "integer"
                      }
                    },
                    "hidden": true,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Inherited Classifications:",
                    "readonly": true,
                    "toolbarSticky": true
                  },
                  "default_rmclassification_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Default RM Classification",
                    "readonly": true,
                    "type": "integer"
                  },
                  "rmclassification_id": {
                    "fields": {
                      "item": {
                        "type": "text"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "RM Classification",
                    "readonly": true,
                    "toolbarSticky": true,
                    "type": "otcs_node_picker"
                  },
                  "file_number": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "File Number",
                    "readonly": true,
                    "type": "text"
                  },
                  "rsi": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "RSI",
                    "readonly": false,
                    "type": "select"
                  },
                  "record_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Record Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "record_type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Record Type",
                    "optionLabels": [
                      "Record 10 year RSI",
                      "Record",
                      "Non-Record"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "status": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status",
                    "optionLabels": [
                      "ACTIVE..ACTIVE STATUS",
                      "CLOSED..FILE IS CLOSED",
                      "CODE4..SYSTEM CREATED",
                      "FINAL..ITEM IS IN A FINALIZED STATE"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "status_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Status Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "received_date": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Received Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "essential": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Essential",
                    "optionLabels": [
                      "111..",
                      "ESSENTIAL1..SYSTEM CREATED",
                      "NO..NON-ESSENTIAL",
                      "VITAL..VITAL RECORD"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "cycle_period": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Update Cycle Period",
                    "optionLabels": [
                      "Monthly",
                      "Semi-annual based on calendar year",
                      "Quarterly based on calendar year",
                      "Annual based on calendar year",
                      "Daily",
                      "Weekly"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "last_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Last Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "next_review_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Next Review Date",
                    "readonly": false,
                    "type": "date"
                  },
                  "official": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Official",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "storage": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Storage Medium",
                    "optionLabels": [
                      "222..",
                      "ELE..ELECTRONIC",
                      "MEDIUM1..SYSTEM CREATED",
                      "MIXED..PAPER AND ELECTRONIC"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "accession": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Accession",
                    "optionLabels": [
                      "ACC123..ACCESSION 123"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "subject": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Subject",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "originator": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Author or Originator",
                    "readonly": false,
                    "type": "text"
                  },
                  "addressee": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "sent_to": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Other Addressee(s)",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "establishment": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Originating Organization",
                    "readonly": false,
                    "type": "text"
                  },
                  "record_officer_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Records Officer",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "records_manager_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Records Manager Group",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "secondary_class_ids": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "RM Classification",
                    "readonly": true,
                    "type": "text"
                  },
                  "name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "RM Classification",
                    "readonly": true,
                    "type": "text"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Subtype",
                    "readonly": true,
                    "type": "integer"
                  },
                  "selectable": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Selectable",
                    "readonly": true,
                    "type": "checkbox"
                  },
                  "management_type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Management Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "score": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Score",
                    "readonly": true,
                    "type": "text"
                  },
                  "is_primary": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Primary RM Classification",
                    "readonly": true,
                    "type": "integer"
                  },
                  "record_officer_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Records Officers Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "records_manager_name": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Records Managers Group Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "inherit_from": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Inherit Flag",
                    "readonly": true,
                    "type": "checkbox"
                  },
                  "extradata": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Not important no visible",
                    "readonly": false,
                    "type": "text"
                  }
                }
              },
              "role_name": "rmclassifications",
              "schema": {
                "properties": {
                  "inherited_rmclassification_id": {
                    "items": {
                      "defaultItems": null,
                      "maxItems": null,
                      "minItems": 1,
                      "type": "integer"
                    },
                    "readonly": true,
                    "required": false,
                    "title": "Inherited Classifications:",
                    "type": "array"
                  },
                  "default_rmclassification_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Default RM Classification",
                    "type": "integer"
                  },
                  "rmclassification_id": {
                    "items": {
                      "defaultItems": null,
                      "maxItems": null,
                      "minItems": 1,
                      "type": "string"
                    },
                    "readonly": true,
                    "required": false,
                    "title": "RM Classification",
                    "type": "array"
                  },
                  "file_number": {
                    "readonly": true,
                    "required": false,
                    "title": "File Number",
                    "type": "string"
                  },
                  "rsi": {
                    "enum": [
                      "10 YEAR",
                      "3 YEAR",
                      "5 YEAR",
                      "7 YEAR",
                      "HR PERSONNEL",
                      "HYD TEST RSI",
                      "MULTIPLE",
                      "RSI",
                      "TRANSITORY",
                      "UNDER"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "RSI",
                    "type": "string"
                  },
                  "record_date": {
                    "readonly": false,
                    "required": true,
                    "title": "Record Date",
                    "type": "date"
                  },
                  "record_type": {
                    "enum": [
                      20375418,
                      20375748,
                      20376078
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Record Type",
                    "type": "integer"
                  },
                  "status": {
                    "enum": [
                      "ACTIVE",
                      "CLOSED",
                      "CODE4",
                      "FINAL"
                    ],
                    "readonly": false,
                    "required": true,
                    "title": "Status",
                    "type": "string"
                  },
                  "status_date": {
                    "readonly": false,
                    "required": true,
                    "title": "Status Date",
                    "type": "date"
                  },
                  "received_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Received Date",
                    "type": "date"
                  },
                  "essential": {
                    "enum": [
                      "111",
                      "ESSENTIAL1",
                      "NO",
                      "VITAL"
                    ],
                    "readonly": false,
                    "required": true,
                    "title": "Essential",
                    "type": "string"
                  },
                  "cycle_period": {
                    "enum": [
                      1,
                      2,
                      3,
                      12,
                      365,
                      7
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Update Cycle Period",
                    "type": "integer"
                  },
                  "last_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Last Review Date",
                    "type": "date"
                  },
                  "next_review_date": {
                    "readonly": false,
                    "required": false,
                    "title": "Next Review Date",
                    "type": "date"
                  },
                  "official": {
                    "default": false,
                    "readonly": false,
                    "required": false,
                    "title": "Official",
                    "type": "boolean"
                  },
                  "storage": {
                    "enum": [
                      "222",
                      "ELE",
                      "MEDIUM1",
                      "MIXED"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Storage Medium",
                    "type": "string"
                  },
                  "accession": {
                    "enum": [
                      "ACC123"
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Accession",
                    "type": "string"
                  },
                  "subject": {
                    "readonly": false,
                    "required": false,
                    "title": "Subject",
                    "type": "string"
                  },
                  "originator": {
                    "readonly": false,
                    "required": false,
                    "title": "Author or Originator",
                    "type": "string"
                  },
                  "addressee": {
                    "readonly": false,
                    "required": false,
                    "title": "Addressee(s)",
                    "type": "string"
                  },
                  "sent_to": {
                    "readonly": false,
                    "required": false,
                    "title": "Other Addressee(s)",
                    "type": "string"
                  },
                  "establishment": {
                    "readonly": false,
                    "required": false,
                    "title": "Originating Organization",
                    "type": "string"
                  },
                  "record_officer_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Records Officer",
                    "type": "otcs_user_picker"
                  },
                  "records_manager_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Records Manager Group",
                    "type": "otcs_user_picker"
                  },
                  "secondary_class_ids": {
                    "readonly": true,
                    "required": false,
                    "title": "RM Classification",
                    "type": "string"
                  },
                  "name": {
                    "readonly": true,
                    "required": false,
                    "title": "RM Classification",
                    "type": "string"
                  },
                  "type": {
                    "readonly": true,
                    "required": false,
                    "title": "Subtype",
                    "type": "integer"
                  },
                  "selectable": {
                    "readonly": true,
                    "required": false,
                    "title": "Selectable",
                    "type": "boolean"
                  },
                  "management_type": {
                    "readonly": true,
                    "required": false,
                    "title": "Management Type",
                    "type": "string"
                  },
                  "score": {
                    "readonly": true,
                    "required": false,
                    "title": "Score",
                    "type": "string"
                  },
                  "is_primary": {
                    "readonly": true,
                    "required": false,
                    "title": "Primary RM Classification",
                    "type": "integer"
                  },
                  "record_officer_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Records Officers Name",
                    "type": "string"
                  },
                  "records_manager_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Records Managers Group Name",
                    "type": "string"
                  },
                  "inherit_from": {
                    "readonly": true,
                    "required": false,
                    "title": "Inherit Flag",
                    "type": "boolean"
                  },
                  "extradata": {
                    "readonly": false,
                    "required": false,
                    "title": "Not important no visible",
                    "type": "string"
                  }
                },
                "title": "Records Management",
                "type": "object"
              }
            },
            {
              "data": {
                "clearance_level": null,
                "supplemental_markings": [
                  ""
                ],
                "extradata": {
                  "applyToSetting": {
                    "bUpdateBoxContents": true,
                    "secLevelOpts": [
                      "upgrade",
                      "downgrade"
                    ],
                    "suppMarkOpts": [
                      "merge",
                      "replace"
                    ]
                  },
                  "can_user_edit_security": true,
                  "has_user_security_codes": true,
                  "inherit_from": false
                }
              },
              "options": {
                "fields": {
                  "clearance_level": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Security Clearance Level",
                    "optionLabels": [
                      "1..SM2",
                      "4..SM1",
                      "10..Public use",
                      "30..Internal",
                      "40..Restricted",
                      "50..Secret",
                      "60..Top Secret"
                    ],
                    "readonly": false,
                    "type": "select"
                  },
                  "supplemental_markings": {
                    "fields": {
                      "item": {
                        "optionLabels": [
                          "SUPPLEMENTAL_MARKINGS..Supplemental markings descriptio",
                          "SUPPLEMENTAL_MARKINGS22..Supplemental_markings22 descript"
                        ],
                        "type": "select"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Supplemental Markings",
                    "readonly": false,
                    "toolbarSticky": true
                  },
                  "extradata": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Not important no visible",
                    "readonly": false,
                    "type": "text"
                  }
                }
              },
              "role_name": "securityclearances",
              "schema": {
                "properties": {
                  "clearance_level": {
                    "default": "",
                    "enum": [
                      1,
                      4,
                      10,
                      30,
                      40,
                      50,
                      60
                    ],
                    "readonly": false,
                    "required": false,
                    "title": "Security Clearance Level",
                    "type": "integer"
                  },
                  "supplemental_markings": {
                    "items": {
                      "defaultItems": 1,
                      "enum": [
                        "SUPPLEMENTAL_MARKINGS",
                        "SUPPLEMENTAL_MARKINGS22"
                      ],
                      "maxItems": 2,
                      "minItems": 1,
                      "type": "string"
                    },
                    "readonly": false,
                    "required": false,
                    "title": "Supplemental Markings",
                    "type": "array"
                  },
                  "extradata": {
                    "readonly": false,
                    "required": false,
                    "title": "Not important no visible",
                    "type": "string"
                  }
                },
                "title": "Security Clearance",
                "type": "object"
              }
            },
            {
              "data": {},
              "options": {
                "fields": {}
              },
              "role_name": "systemattributes",
              "schema": {
                "properties": {},
                "title": "System Attributes",
                "type": "object"
              }
            },
            {
              "data": {
                "description": null,
                "mime_type": null,
                "version_number": null
              },
              "options": {
                "fields": {
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "mime_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "MIME Type",
                    "readonly": false,
                    "type": "select"
                  },
                  "version_number": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Version Number",
                    "readonly": false,
                    "type": "integer"
                  }
                }
              },
              "role_name": "versions",
              "schema": {
                "properties": {
                  "description": {
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "mime_type": {
                    "enum": [
                      "application/acad",
                      "application/activemessage",
                      "application/andrew-inset",
                      "application/applefile",
                      "application/atomicmail",
                      "application/autocad_dwg",
                      "application/dca-rft",
                      "application/dec-dx",
                      "application/download",
                      "application/dwg",
                      "application/force-download",
                      "application/gzip-compressed",
                      "application/iges",
                      "application/ip",
                      "application/java",
                      "application/java-archive",
                      "application/mac-binhex40",
                      "application/macwriteii",
                      "application/mindmap",
                      "application/ms-excel",
                      "application/ms-tnef",
                      "application/msaccess",
                      "application/msexcel",
                      "application/msword",
                      "application/msword-template",
                      "application/news-message-id",
                      "application/news-transmission",
                      "application/octet-stream",
                      "application/oda",
                      "application/pdf",
                      "application/postscript",
                      "application/powerpoint",
                      "application/ppt",
                      "application/remote-printing",
                      "application/rtf",
                      "application/slate",
                      "application/visio",
                      "application/vnd.calcomp",
                      "application/vnd.filemaker",
                      "application/vnd.framemaker",
                      "application/vnd.framemaker-book",
                      "application/vnd.hp-HPGL",
                      "application/vnd.lotus-1-2-3",
                      "application/vnd.lotus-freelance",
                      "application/vnd.lotus-notes",
                      "application/vnd.microplanner",
                      "application/vnd.mindjet.mindmanager",
                      "application/vnd.ms-access",
                      "application/vnd.ms-bitmap",
                      "application/vnd.ms-excel",
                      "application/vnd.ms-excel+xml",
                      "application/vnd.ms-excel-template",
                      "application/vnd.ms-excel.12",
                      "application/vnd.ms-excel.addin.macroEnabled.12",
                      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
                      "application/vnd.ms-excel.sheet.macroEnabled.12",
                      "application/vnd.ms-excel.template.macroEnabled.12",
                      "application/vnd.ms-outlook",
                      "application/vnd.ms-outlook-message",
                      "application/vnd.ms-outlook-template",
                      "application/vnd.ms-powerpoint",
                      "application/vnd.ms-powerpoint+xml",
                      "application/vnd.ms-powerpoint.addin.macroEnabled.12",
                      "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
                      "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
                      "application/vnd.ms-powerpoint.template.macroEnabled.12",
                      "application/vnd.ms-pps",
                      "application/vnd.ms-project",
                      "application/vnd.ms-tnef",
                      "application/vnd.ms-visio.drawing",
                      "application/vnd.ms-visio.drawing.macroEnabled",
                      "application/vnd.ms-visio.stencil",
                      "application/vnd.ms-visio.stencil.macroEnabled",
                      "application/vnd.ms-visio.template",
                      "application/vnd.ms-visio.template.macroEnabled",
                      "application/vnd.ms-visio.viewer",
                      "application/vnd.ms-word",
                      "application/vnd.ms-word+xml",
                      "application/vnd.ms-word.document.macroEnabled.12",
                      "application/vnd.ms-word.template.macroEnabled.12",
                      "application/vnd.ms-xpsdocument",
                      "application/vnd.oasis.opendocument.chart",
                      "application/vnd.oasis.opendocument.chart-template",
                      "application/vnd.oasis.opendocument.database",
                      "application/vnd.oasis.opendocument.formula",
                      "application/vnd.oasis.opendocument.formula-template",
                      "application/vnd.oasis.opendocument.graphics",
                      "application/vnd.oasis.opendocument.graphics-template",
                      "application/vnd.oasis.opendocument.image",
                      "application/vnd.oasis.opendocument.image-template",
                      "application/vnd.oasis.opendocument.presentation",
                      "application/vnd.oasis.opendocument.presentation-template",
                      "application/vnd.oasis.opendocument.spreadsheet",
                      "application/vnd.oasis.opendocument.spreadsheet-template",
                      "application/vnd.oasis.opendocument.text",
                      "application/vnd.oasis.opendocument.text",
                      "application/vnd.oasis.opendocument.text-master",
                      "application/vnd.oasis.opendocument.text-template",
                      "application/vnd.oasis.opendocument.text-web",
                      "application/vnd.openofficeorg.extension",
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                      "application/vnd.openxmlformats-officedocument.presentationml.template",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
                      "application/vnd.panorama",
                      "application/vnd.photoshop",
                      "application/vnd.quark-xpress",
                      "application/vnd.sparxsystems.ea",
                      "application/vnd.sun.xml.calc",
                      "application/vnd.sun.xml.calc.template",
                      "application/vnd.sun.xml.draw",
                      "application/vnd.sun.xml.draw.template",
                      "application/vnd.sun.xml.impress",
                      "application/vnd.sun.xml.impress.template",
                      "application/vnd.sun.xml.math",
                      "application/vnd.sun.xml.writer",
                      "application/vnd.sun.xml.writer.global",
                      "application/vnd.sun.xml.writer.template",
                      "application/vnd.visio",
                      "application/vnd.wavesoft",
                      "application/vnd.wordperfect",
                      "application/wita",
                      "application/wordperfect",
                      "application/wordperfect5.1",
                      "application/x-3df",
                      "application/x-acad",
                      "application/x-ami",
                      "application/x-amipro",
                      "application/x-arj-compressed",
                      "application/x-autocad",
                      "application/x-bcpio",
                      "application/x-bravadtx",
                      "application/x-bravax",
                      "application/x-bz2",
                      "application/x-captivate",
                      "application/x-compress",
                      "application/x-compressed",
                      "application/x-cpio",
                      "application/x-csh",
                      "application/x-dvi",
                      "application/x-dwg",
                      "application/x-eloquent-studioproject",
                      "application/x-emf",
                      "application/x-exe",
                      "application/x-gtar",
                      "application/x-gzip",
                      "application/x-gzip-compressed",
                      "application/x-hdf",
                      "application/x-iphone",
                      "application/x-javascript",
                      "application/x-jmp-data",
                      "application/x-js-taro",
                      "application/x-latex",
                      "application/x-lotus-dxl",
                      "application/x-lotus-dxl",
                      "application/x-macbinary",
                      "application/x-maker",
                      "application/x-mif",
                      "application/x-msdownload",
                      "application/x-msexcel",
                      "application/x-msmetafile",
                      "application/x-mspowerpoint",
                      "application/x-mspublisher",
                      "application/x-netcdf",
                      "application/x-outlook-msg",
                      "application/x-pdf",
                      "application/x-perfmon",
                      "application/x-perl",
                      "application/x-pkcs7-signature",
                      "application/x-quattro",
                      "application/x-quattropro",
                      "application/x-quattroproj",
                      "application/x-rar-compressed",
                      "application/x-rpt",
                      "application/x-sh",
                      "application/x-shar",
                      "application/x-shockwave-flash",
                      "application/x-stuffit",
                      "application/x-sv4cpio",
                      "application/x-sv4crc",
                      "application/x-tar",
                      "application/x-tcl",
                      "application/x-tex",
                      "application/x-texinfo",
                      "application/x-troff",
                      "application/x-troff-man",
                      "application/x-troff-me",
                      "application/x-troff-ms",
                      "application/x-unknown-content-type-WinZip",
                      "application/x-url",
                      "application/x-ustar",
                      "application/x-visio",
                      "application/x-wais-source",
                      "application/x-wordperfect",
                      "application/x-wordperfect4.2",
                      "application/x-wordperfect5.1j",
                      "application/x-wordperfect5e",
                      "application/x-wordperfect6.0",
                      "application/x-wordperfect6.1",
                      "application/x-wordperfect6e",
                      "application/x-wordperfect7",
                      "application/x-wordperfect8",
                      "application/x-wordperfectmac",
                      "application/x-zip-compressed",
                      "application/x-zip-encoded",
                      "application/xml",
                      "application/zip",
                      "audio/3gpp",
                      "audio/aiff",
                      "audio/basic",
                      "audio/it",
                      "audio/mid",
                      "audio/midi",
                      "audio/mod",
                      "audio/mpeg",
                      "audio/mpeg3",
                      "audio/playlist",
                      "audio/s3m",
                      "audio/tsp-audio",
                      "audio/tsplayer",
                      "audio/wav",
                      "audio/x-adpcm",
                      "audio/x-aiff",
                      "audio/x-au",
                      "audio/x-gsm",
                      "audio/x-jam",
                      "audio/x-liveaudio",
                      "audio/x-mid",
                      "audio/x-midi",
                      "audio/x-mod",
                      "audio/x-mpeg",
                      "audio/x-mpeg-3",
                      "audio/x-mpequrl",
                      "audio/x-ms-wma",
                      "audio/x-nspaudio",
                      "audio/x-pn-realaudio",
                      "audio/x-pn-realaudio-plugin",
                      "audio/x-realaudio",
                      "audio/x-wav",
                      "audio/xm",
                      "drawing/dwg",
                      "drawing/vnd.dwf",
                      "drawing/x-dwf",
                      "image/bmp",
                      "image/cgm",
                      "image/cmu-raster",
                      "image/dgn",
                      "image/fif",
                      "image/g3fax",
                      "image/gif",
                      "image/ief",
                      "image/jp2",
                      "image/jpeg",
                      "image/pct",
                      "image/pict",
                      "image/pjpeg",
                      "image/png",
                      "image/svg+xml",
                      "image/tif",
                      "image/tiff",
                      "image/vasa",
                      "image/vnd.dgn",
                      "image/vnd.dwf",
                      "image/vnd.dwg",
                      "image/vnd.dxf",
                      "image/vnd.fpx",
                      "image/vnd.ms-modi",
                      "image/vnd.net-fpx",
                      "image/vnd.rn-realflash",
                      "image/vnd.rn-realpix",
                      "image/vnd.wap.wbmp",
                      "image/vnd.xiff",
                      "image/x-MS-bmp",
                      "image/x-bmp",
                      "image/x-cadra",
                      "image/x-canon-cr2",
                      "image/x-cmu-raster",
                      "image/x-dwg",
                      "image/x-emf",
                      "image/x-icon",
                      "image/x-jg",
                      "image/x-jps",
                      "image/x-me10",
                      "image/x-niff",
                      "image/x-nikon-nef",
                      "image/x-pcx",
                      "image/x-pict",
                      "image/x-png",
                      "image/x-portable-anymap",
                      "image/x-portable-bitmap",
                      "image/x-portable-graymap",
                      "image/x-portable-pixmap",
                      "image/x-quicktime",
                      "image/x-rgb",
                      "image/x-tiff",
                      "image/x-windows-bmp",
                      "image/x-wmf",
                      "image/x-xbitmap",
                      "image/x-xbm",
                      "image/x-xpixmap",
                      "image/x-xwd",
                      "image/x-xwindowdump",
                      "image/xbm",
                      "image/xpm",
                      "message/external-body",
                      "message/news",
                      "message/partial",
                      "message/rfc822",
                      "model/iges",
                      "multipart/alternative",
                      "multipart/appledouble",
                      "multipart/digest",
                      "multipart/mixed",
                      "multipart/parallel",
                      "text/cgm",
                      "text/css",
                      "text/csv",
                      "text/html",
                      "text/mspg-legacyinfo",
                      "text/plain",
                      "text/richtext",
                      "text/sgml",
                      "text/tab-separated-values",
                      "text/webviewhtml",
                      "text/x-setext",
                      "text/x-sgml",
                      "text/x-vcard",
                      "text/xml",
                      "text/xml",
                      "text/xml+dxl",
                      "video/3gpp",
                      "video/animaflex",
                      "video/avi",
                      "video/avs-video",
                      "video/dl",
                      "video/dvd",
                      "video/fli",
                      "video/gl",
                      "video/mp4",
                      "video/mpeg",
                      "video/msvideo",
                      "video/quicktime",
                      "video/vdo",
                      "video/vivo",
                      "video/vnd.rn-realvideo",
                      "video/vnd.vivo",
                      "video/vosaic",
                      "video/x-flv",
                      "video/x-gl",
                      "video/x-isvideo",
                      "video/x-motion-jpeg",
                      "video/x-mpeg",
                      "video/x-mpeq2a",
                      "video/x-ms-asf",
                      "video/x-ms-asf-plugin",
                      "video/x-ms-wmv",
                      "video/x-msvideo",
                      "video/x-qtc",
                      "video/x-scm",
                      "video/x-sgi-movie"
                    ],
                    "readonly": false,
                    "required": true,
                    "title": "MIME Type",
                    "type": "string"
                  },
                  "version_number": {
                    "readonly": false,
                    "required": true,
                    "title": "Version Number",
                    "type": "integer"
                  }
                },
                "title": "Versions",
                "type": "object"
              }
            }
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general*',
        responseText: {
          "forms": [
            {
              "data": {
                "name": "CS10_5_Setup - Cowqeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeepeeeeeeesdfdsfdseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeey.docx",
                "hidden": false,
                "description": "The version control options in Content Server offer versatility. In\nmany file storage systems, when you modify a document, you\nreplace the document with the modified document. Content\nServer keeps each version of a modified document. Keeping the\nolder versions allows you to:\n Go back to previous work – Maybe changes were made to\na document that should be reversed. Without versions, you\ncannot go back to previous work.\n View the historical progression of a document – you can\nview the history of a document to see the progression of\nchange.\n Have multiple backups as opposed to a single copy –\nWithout versions, if something happens to the most recent\nversion, you have lost all your work.\n Search old versions of documents for information –\nsometimes historical information is just what someone is\nlooking for.\nTracking document changes and maintaining versioning is\nespecially important for organizations that have or are working\ntowards ISO (International Standards Organization) certification\nand Sarbanes-Oxley requirements.\nStep Set 4-6: Accessing an Item’s Versions\n1. Select Properties > Versions from the Functions menu for\nthe item.\nOpen Text Internal Use",
                "create_date": "2018-10-24T23:49:36",
                "create_user_id": 1000,
                "type": 144,
                "type_name": "Document",
                "modify_date": "2020-01-06T19:36:32",
                "owner_user_id": 1000,
                "reserved_user_id": 1000,
                "reserved_date": "2020-01-01T18:27:46",
                "metadata_token": "f36a46c24a9fb7d26d4705de9ab606cc"
              },
              "options": {
                "fields": {
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "hidden": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Hidden",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created By",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "integer"
                  },
                  "type_name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "reserved_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reserved By",
                    "readonly": true,
                    "type": "otcs_member_picker",
                    "type_control": {
                      "action": "api/v1/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0,
                          1
                        ],
                        "select_types": [
                          0,
                          1
                        ]
                      }
                    }
                  },
                  "reserved_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "metadata_token": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Metadata Token",
                    "readonly": true,
                    "type": "text"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes/26820417",
                    "method": "PUT"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "hidden": {
                    "default": false,
                    "readonly": false,
                    "required": false,
                    "title": "Hidden",
                    "type": "boolean"
                  },
                  "description": {
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "date"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "otcs_user_picker"
                  },
                  "type": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "integer"
                  },
                  "type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "string"
                  },
                  "modify_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "date"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "otcs_user_picker"
                  },
                  "reserved_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved By",
                    "type": "otcs_member_picker"
                  },
                  "reserved_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "date"
                  },
                  "metadata_token": {
                    "maxLength": 64,
                    "minLength": 0,
                    "readonly": true,
                    "required": false,
                    "title": "Metadata Token",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            }
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/1000',
        responseText:{
          "available_actions": [
            {
              "parameterless": true,
              "read_only": false,
              "type": "delete",
              "type_name": "Delete",
              "webnode_signature": null
            },
            {
              "parameterless": false,
              "read_only": false,
              "type": "create",
              "type_name": "Create",
              "webnode_signature": null
            },
            {
              "parameterless": false,
              "read_only": false,
              "type": "update",
              "type_name": "Update",
              "webnode_signature": null
            }
          ],
          "data": {
            "birth_date": "1900-10-31T00:00:00",
            "business_email": "test@murdock.com",
            "business_fax": null,
            "business_phone": null,
            "cell_phone": "432343254354364",
            "deleted": false,
            "display_language": "",
            "display_name": "Admin",
            "first_name": "Murdock",
            "gender": 3,
            "group_id": 1001,
            "home_address_1": null,
            "home_address_2": null,
            "home_fax": null,
            "home_phone": null,
            "id": 1000,
            "initials": "A",
            "last_name": "Admin",
            "middle_name": null,
            "name": "Admin",
            "office_location": null,
            "pager": null,
            "personal_email": null,
            "personal_interests": null,
            "personal_url_1": null,
            "personal_url_2": null,
            "personal_url_3": null,
            "personal_website": null,
            "photo_id": 36905608,
            "photo_url": "api\/v1\/members\/1000\/photo?v=36905608.1",
            "privilege_grant_discovery": true,
            "privilege_login": true,
            "privilege_modify_groups": true,
            "privilege_modify_users": true,
            "privilege_public_access": true,
            "privilege_system_admin_rights": true,
            "privilege_user_admin_rights": true,
            "time_zone": 43,
            "title": null,
            "type": 0,
            "type_name": "User"
          },
          "definitions": {
            "birth_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": false,
              "key": "birth_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Birthday",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "business_email": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "business_email",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Business E-mail",
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
            "business_fax": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "business_fax",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Business Fax",
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
            "business_phone": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "business_phone",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Business Phone",
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
            "cell_phone": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "cell_phone",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Cell Phone",
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
            "deleted": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "deleted",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Deleted",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "display_language": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "display_language",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Display Language",
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
            "first_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "first_name",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "First Name",
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
            "gender": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "gender",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Gender",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "group_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "group_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Group",
              "persona": "group",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "home_address_1": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "home_address_1",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Home Address",
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
            "home_address_2": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "home_address_2",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Home Address",
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
            "home_fax": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "home_fax",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Home Fax",
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
            "home_phone": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "home_phone",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Home Phone",
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
            "id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "ID",
              "persona": "",
              "read_only": false,
              "required": true,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "last_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "last_name",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Last Name",
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
            "metadata_language": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "metadata_language",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "[CSNODE_LABEL.?MetadataLanguage?]",
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
            "middle_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "middle_name",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Middle Name",
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
            "name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "name",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Name",
              "password": false,
              "persona": "",
              "read_only": false,
              "regex": "",
              "required": true,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            },
            "office_location": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "office_location",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "OfficeLocation",
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
            "pager": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "pager",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Pager",
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
            "personal_email": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "personal_email",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Personal Email",
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
            "personal_interests": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "personal_interests",
              "key_value_pairs": false,
              "max_length": 255,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Interests",
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
            "personal_url_1": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "personal_url_1",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Favorites",
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
            "personal_url_2": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "personal_url_2",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Favorites",
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
            "personal_url_3": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "personal_url_3",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Favorites",
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
            "personal_website": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "personal_website",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Home Page",
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
            "photo_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "photo_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Photo ID",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_grant_discovery": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_grant_discovery",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "eDiscovery Rights",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_login": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_login",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Log-in",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_modify_groups": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_modify_groups",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Create\/Modify Groups",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_modify_users": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_modify_users",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Create\/Modify Users",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_public_access": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_public_access",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Public Access",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_system_admin_rights": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_system_admin_rights",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "System Administration Rights",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "privilege_user_admin_rights": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "privilege_user_admin_rights",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "User Administration Rights",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "time_zone": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": -1,
              "description": null,
              "hidden": false,
              "key": "time_zone",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "TimeZone",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "title": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "title",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Title",
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
            "type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "type",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Type",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "type_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "type_name",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Type",
              "password": false,
              "persona": "",
              "read_only": true,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            }
          },
          "definitions_order": [
            "id",
            "type",
            "type_name",
            "name",
            "deleted",
            "first_name",
            "last_name",
            "middle_name",
            "group_id",
            "title",
            "business_email",
            "business_phone",
            "business_fax",
            "office_location",
            "time_zone",
            "privilege_grant_discovery",
            "privilege_login",
            "privilege_public_access",
            "privilege_modify_users",
            "privilege_modify_groups",
            "privilege_user_admin_rights",
            "privilege_system_admin_rights",
            "birth_date",
            "cell_phone",
            "personal_url_1",
            "personal_url_2",
            "personal_url_3",
            "gender",
            "home_address_1",
            "home_address_2",
            "home_fax",
            "personal_website",
            "home_phone",
            "personal_interests",
            "pager",
            "personal_email",
            "photo_id",
            "display_language",
            "metadata_language"
          ],
          "type": 0,
          "type_name": "User"
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/members/1000/photo*',
        responseText: {}
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/actions',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/actions",
                "method": "POST",
                "name": ""
              }
            }
          },
          "results": {
            "26820417": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddReminder": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "GET",
                  "name": "Reminder"
                },
                "AddRMClassifications": {
                  "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":true}",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/rmclassifications",
                  "method": "POST",
                  "name": "Add RM Classification"
                },
                "addversion": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/versions",
                  "method": "POST",
                  "name": "Add Version"
                },
                "ApplyHold": {
                  "body": "",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Apply Hold"
                },
                "AssignXRef": {
                  "body": "",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Assign Cross-Reference"
                },
                "Classify": {
                  "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":false}",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/rmclassifications",
                  "method": "POST",
                  "name": "Add RM Classification"
                },
                "comment": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "POST",
                  "name": "Comments"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/copy?id=26820417",
                  "href": "/api/v2/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "DispositionMove": {
                  "body": "",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Move"
                },
                "download": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/content?download",
                  "method": "GET",
                  "name": "Download"
                },
                "edit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "func=Edit.Edit&nodeid=26820417&uiType=2",
                  "method": "GET",
                  "name": "Edit"
                },
                "editactivex": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "func=Edit.Edit&nodeid=26820417&uiType=2",
                  "method": "GET",
                  "name": "Edit in Word",
                  "promoted": true
                },
                "editpermissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Edit Permissions"
                },
                "FinalizeRecord": {
                  "body": "false",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417",
                  "method": "PUT",
                  "name": "Finalize Record"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/move?id=26820417",
                  "href": "/api/v2/nodes/26820417",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/content",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417",
                  "method": "GET",
                  "name": "Properties"
                },
                "RemoveClassification": {
                  "body": "",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417/rmclassifications",
                  "method": "POST",
                  "name": "Remove Classificfation"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=26820417",
                  "href": "/api/v2/nodes/26820417",
                  "method": "PUT",
                  "name": "Rename"
                },
                "RMMetadata": {
                  "body": "",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "RM Metadata"
                },
                "unreserve": {
                  "body": "reserved_user_id=null",
                  "content_type": "application/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "/api/v2/nodes/26820417",
                  "method": "PUT",
                  "name": "Unreserve"
                },
                "zipanddownload": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/zipanddownload",
                  "method": "POST",
                  "name": "Zip and Download"
                }
              },
              "map": {
                "default_action": "open",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "open",
                "edit",
                "editactivex",
                "download",
                "addversion",
                "addcategory",
                "rename",
                "copy",
                "move",
                "AddReminder",
                "editpermissions",
                "permissions",
                "unreserve",
                "AddRMClassifications",
                "ApplyHold",
                "AssignXRef",
                "Classify",
                "DispositionMove",
                "FinalizeRecord",
                "RemoveClassification",
                "RMMetadata",
                "zipanddownload",
                "comment"
              ]
            }
          }
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/26820417/categories/520012/actions',
        responseText: {
          "data": {
            "categories_remove": "api/v1/nodes/26820417/categories/520012",
            "categories_update": "api/v1/forms/nodes/categories/update?id=26820417&category_id=520012"
          },
          "definitions": {
            "categories_remove": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "",
              "image": "",
              "method": "DELETE",
              "name": "Remove",
              "parameters": {},
              "tab_href": ""
            },
            "categories_update": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "",
              "method": "GET",
              "name": "Update",
              "parameters": {},
              "tab_href": ""
            }
          },
          "definitions_map": {},
          "definitions_order": [
            "categories_remove",
            "categories_update"
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/26820417/ancestors',
        responseText: {
          "ancestors": [
            {
              "id": 2000,
              "name": "Enterprise",
              "parent_id": -1,
              "type": 141,
              "volume_id": -2000,
              "type_name": "Enterprise Workspace"
            },
            {
              "id": 24788095,
              "name": "Development",
              "parent_id": 2000,
              "type": 0,
              "volume_id": -2000,
              "type_name": "Folder"
            },
            {
              "id": 24788535,
              "name": "Core Hyderabad",
              "parent_id": 24788095,
              "type": 0,
              "volume_id": -2000,
              "type_name": "Folder"
            },
            {
              "id": 604999,
              "name": "007 Hyderabad",
              "parent_id": 24788535,
              "type": 0,
              "volume_id": -2000,
              "type_name": "Folder"
            },
            {
              "id": 24788425,
              "name": "$$$ Sindhu",
              "parent_id": 604999,
              "type": 0,
              "volume_id": -2000,
              "type_name": "Folder"
            },
            {
              "id": 26817794,
              "name": "NAVEEN",
              "parent_id": 24788425,
              "type": 0,
              "volume_id": -2000,
              "type_name": "Folder"
            },
            {
              "id": 26817807,
              "name": "All file types",
              "parent_id": 26817794,
              "type": 0,
              "volume_id": -2000,
              "type_name": "Folder"
            },
            {
              "id": 26820417,
              "name": "CS10_5_Setup - Cowqeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeepeeeeeeesdfdsfdseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeey.docx",
              "parent_id": 26817807,
              "type": 144,
              "volume_id": -2000,
              "type_name": "Document"
            }
          ]
        }
      });
    },

    disable: function () {
      mockjax.clear();
    }
  };
});