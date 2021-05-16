/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/tabs.*'),
        responseTime: 0,
        responseText: {
          "results": [
            {
              "data": {
                "name": "G3",
                "order": 1,
                "tab_id": 3
              }
            },
            {
              "data": {
                "name": "G2",
                "order": 2,
                "tab_id": 2
              }
            },
            {
              "data": {
                "name": "G1",
                "order": 3,
                "tab_id": 1
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites\\?(.*)?$'),
        responseTime: 0,
        responseText: {
          "results": [
            {
              "actions": {
                "data": {
                  "addcategory": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/6853/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "AddRMClassifications": {
                    "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":true,\"managed\":false}",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/6853/rmclassifications",
                    "method": "POST",
                    "name": "Add RM Classification"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/6853",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "DispositionMove": {
                    "body": "",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": "Move"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/6853",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=6853",
                    "href": "/api/v2/nodes/6853",
                    "method": "PUT",
                    "name": "Rename"
                  }
                },
                "map": {
                  "default_action": "",
                  "more": [
                    "properties"
                  ]
                },
                "order": [
                  "addcategory",
                  "rename",
                  "AddRMClassifications",
                  "delete",
                  "DispositionMove"
                ]
              },
              "data": {
                "favorites": {
                  "name": "SavedQuery_with_form",
                  "tab_id": null
                },
                "properties": {
                  "advanced_versioning": null,
                  "container": false,
                  "container_size": 0,
                  "create_date": "2019-07-25T16:41:14",
                  "create_user_id": 1000,
                  "custom_view_search": true,
                  "description": "",
                  "description_multilingual": {
                    "en": ""
                  },
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 6853,
                  "mime_type": null,
                  "modify_date": "2019-07-25T16:44:07",
                  "modify_user_id": 1000,
                  "name": "SavedQuery_with_form",
                  "name_multilingual": {
                    "en": "SavedQuery_with_form"
                  },
                  "owner": "David Williams",
                  "owner_group_id": 999,
                  "owner_user_id": 1000,
                  "parent_id": 6981,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 3,
                    "create_date": "2019-07-25T16:19:19",
                    "create_user_id": 1000,
                    "description": "",
                    "description_multilingual": {
                      "en": ""
                    },
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 6981,
                    "mime_type": null,
                    "modify_date": "2019-07-25T16:42:13",
                    "modify_user_id": 1000,
                    "name": "CVS side panel check",
                    "name_multilingual": {
                      "en": "CVS side panel check"
                    },
                    "owner": "David Williams",
                    "owner_group_id": 999,
                    "owner_user_id": 1000,
                    "parent_id": 2000,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 0,
                    "size_formatted": "",
                    "type": 0,
                    "type_name": "Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "permissions_model": "advanced",
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_shared_collaboration": false,
                  "reserved_user_id": 0,
                  "size": 1251,
                  "size_formatted": "1 Source",
                  "type": 258,
                  "type_name": "Search Query",
                  "versionable": null,
                  "versions_control_advanced": false,
                  "volume_id": -2000
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
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/5656*'),
        responseTime: 0,
        responseText: {
          "results": {}
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/2004*'),
        status: 404,
        responseText: {
          "error": "Sorry, the item you requested could not be accessed. Either it does not exist, or you do not have permission to access it. If you were sent a link to this item, please contact the sender for assistance."
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

});
  