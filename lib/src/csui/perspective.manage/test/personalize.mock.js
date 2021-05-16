/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax',
  'json!./mock-data.json',
], function (require, _, $, mockjax, MockData) {
  'use strict';
  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        responseTime: 5,
        type: 'GET',
        responseText: {
          "data": {
            "birth_date": "1900-10-31T00:00:00",
            "business_email": "murdockadmin@opentext.com",
            "business_fax": "67352895",
            "business_phone": "+78-58476846565",
            "cell_phone": "9876543210",
            "deleted": false,
            "display_name": "Admin",
            "first_name": "Admin",
            "gender": null,
            "group_id": 2426,
            "home_address_1": null,
            "home_address_2": null,
            "home_fax": null,
            "home_phone": null,
            "id": 1000,
            "initials": "A",
            "last_name": null,
            "middle_name": null,
            "name": "Admin",
            "office_location": "Hyderabad",
            "pager": null,
            "personal_email": null,
            "personal_interests": null,
            "personal_url_1": null,
            "personal_url_2": null,
            "personal_url_3": null,
            "personal_website": null,
            "photo_id": 0,
            "photo_url": null,
            "privilege_login": true,
            "privilege_modify_groups": true,
            "privilege_modify_users": true,
            "privilege_public_access": true,
            "privilege_system_admin_rights": true,
            "privilege_user_admin_rights": true,
            "time_zone": 6,
            "title": "Murdock Administrator ",
            "type": 0,
            "type_name": "User"
          }
        }
      })),

          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/auth?perspective=true',
            responseTime: 5,
            type: 'GET',
            responseText: {
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
                "photo_id": 34463715,
                "photo_url": "api/v1/members/1000/photo?v=34463715.1",
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
              "perspective": {
                "canEditPerspective": true,
                "id": 22374119,
                "options": {
                  "widgets": [
                    {
                      "kind": "header",
                      "options": {
                        "message": "As a foundational technology in the Digital Workplace, OpenText Content Suite will pave the way to personal productivity, seamless collaboration, and integration with business processes."
                      },
                      "type": "csui/widgets/welcome.placeholder"
                    },
                    {
                      "kind": "tile",
                      "options": {},
                      "type": "csui/widgets/myassignments"
                    },
                    {
                      "kind": "tile",
                      "options": {},
                      "type": "csui/widgets/favorites"
                    },
                    {
                      "kind": "tile",
                      "options": {},
                      "type": "csui/widgets/recentlyaccessed"
                    },
                    {
                      "kind": "tile",
                      "options": {
                        "shortcutItems": [
                          {
                            "type": "141"
                          },
                          {
                            "type": "141"
                          },
                          {
                            "type": "141"
                          }
                        ],
                        "shortcutTheme": "csui-shortcut-theme-stone1"
                      },
                      "type": "csui/widgets/shortcuts"
                    }
                  ]
                },
                "type": "flow"
              }
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/accessed*',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/members/accessed?actions=open&actions=download&actions=followup&actions=initiateworkflow&fields=properties{id,name,type,type_name}&fields=versions{mime_type}.element(0)&where_type=144&where_type=955&where_type=0&where_type=298&where_type=145&where_type=899",
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
                        "href": "/api/v2/nodes/12600207/content?download",
                        "method": "GET",
                        "name": "Download"
                      },
                      "FollowUp": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12600207/content",
                        "method": "GET",
                        "name": "Open"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12600207",
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
                      "download",
                      "FollowUp"
                    ]
                  },
                  "data": {
                    "properties": {
                      "id": 12600207,
                      "name": "thtyhyjuj.jpg",
                      "type": 144,
                      "type_name": "Document"
                    },
                    "properties_user": {
                      "access_date_last": "2018-03-12T10:23:48Z"
                    },
                    "versions": {
                      "mime_type": "image/jpeg"
                    }
                  }
                }
              ]
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/favorites/tabs*',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members\/favorites?actions=open&actions=download&expand=properties{original_id}&fields=favorites{name,tab_id}&fields=properties{container,id,name,original_id,type,type_name}&fields=versions{mime_type}.element(0)&sort=order",
                    "method": "GET",
                    "name": ""
                  }
                }
              }
              ,
              "results": [{
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/13142466\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "favorites": {"name": "Empty Folder", "tab_id": 14216},
                  "properties": {
                    "container": true,
                    "id": 13142466,
                    "name": "Empty Folder",
                    "type": 0,
                    "type_name": "Folder"
                  }
                }
              }, {
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/1723335\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "favorites": {"name": "Olaf\u0027s Folder", "tab_id": 14217},
                  "properties": {
                    "container": true,
                    "id": 1723335,
                    "name": "Olaf\u0027s Folder",
                    "type": 0,
                    "type_name": "Folder"
                  }
                }
              }, {
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/12231414\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "favorites": {"name": "ECM Project Charters", "tab_id": 14217},
                  "properties": {
                    "container": true,
                    "id": 12231414,
                    "name": "ECM Project Charters",
                    "type": 0,
                    "type_name": "Folder"
                  }
                }
              }]
            }

          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/favorites*',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/members/favorites?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=editactivex&actions=editofficeonline&actions=rename&actions=move&actions=permissions&actions=reserve&actions=unreserve&actions=collectioncancollect&actions=removefromcollection&expand=properties{original_id,parent_id}&fields=favorites{name,tab_id}&fields=properties{container,id,name,original_id,type,type_name,parent_id}&fields=versions{mime_type}.element(0)&sort=order&state=true",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": [
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/25211454/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "addversion": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/25211454/versions",
                        "method": "POST",
                        "name": "Add Version"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=25211454",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/25211454",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "download": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/25211454/content?download",
                        "method": "GET",
                        "name": "Download"
                      },
                      "edit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "func=msofficeonline.edit&NodeID=25211454&uiType=2",
                        "method": "GET",
                        "name": "Edit"
                      },
                      "editactivex": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "func=Edit.Edit&nodeid=25211454&uiType=2",
                        "method": "GET",
                        "name": "Edit in Word",
                        "promoted": false
                      },
                      "editofficeonline": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "func=msofficeonline.edit&NodeID=25211454&uiType=2",
                        "method": "GET",
                        "name": "Edit in Word Online",
                        "promoted": true
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=25211454",
                        "href": "/api/v2/nodes/25211454",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/25211454/content",
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
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=25211454",
                        "href": "/api/v2/nodes/25211454",
                        "method": "PUT",
                        "name": "Rename"
                      },
                      "reserve": {
                        "body": "reserved_user_id=1000",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/25211454",
                        "method": "PUT",
                        "name": "Reserve"
                      }
                    },
                    "map": {
                      "default_action": "open"
                    },
                    "order": [
                      "open",
                      "edit",
                      "editactivex",
                      "editofficeonline",
                      "download",
                      "addversion",
                      "addcategory",
                      "rename",
                      "copy",
                      "move",
                      "permissions",
                      "reserve",
                      "delete"
                    ]
                  },
                  "data": {
                    "favorites": {
                      "name": "content_4.docx",
                      "tab_id": 17796
                    },
                    "properties": {
                      "container": false,
                      "id": 25211454,
                      "name": "content_4.docx",
                      "parent_id": 25211011,
                      "parent_id_expand": {
                        "advanced_versioning": null,
                        "container": true,
                        "container_size": 31,
                        "create_date": "2019-03-18T21:37:25",
                        "create_user_id": 1000,
                        "description": "dfdfdf",
                        "description_multilingual": null,
                        "external_create_date": null,
                        "external_identity": "",
                        "external_identity_type": "",
                        "external_modify_date": null,
                        "external_source": "",
                        "favorite": true,
                        "hidden": false,
                        "id": 25211011,
                        "mime_type": null,
                        "modify_date": "2019-12-25T22:12:46",
                        "modify_user_id": 1000,
                        "name": "$ All mime types folder",
                        "name_multilingual": null,
                        "owner": "Admin, Murdock",
                        "owner_group_id": 1001,
                        "owner_user_id": 1000,
                        "parent_id": 1282482,
                        "permissions_model": "advanced",
                        "reserved": false,
                        "reserved_date": null,
                        "reserved_shared_collaboration": false,
                        "reserved_user_id": 0,
                        "size": 31,
                        "size_formatted": "31 Items",
                        "type": 0,
                        "type_name": "Folder",
                        "versionable": null,
                        "versions_control_advanced": false,
                        "volume_id": -2000
                      },
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
                }

              ]
            }

          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/assignments*',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members\/assignments?fields=assignments{date_due,description,id,name,type,type_name,location_id,followup_id,workflow_id,workflow_open_in_smart_ui,workflow_subworkflow_id,workflow_subworkflow_task_id}",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": [{
                "data": {
                  "assignments": {
                    "date_due": "2018-02-21T00:00:00",
                    "description": "",
                    "followup_id": 21,
                    "id": null,
                    "location_id": 7886377,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": "2018-02-24T00:00:00",
                    "description": "",
                    "followup_id": 25,
                    "id": null,
                    "location_id": 7509277,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": "2018-03-09T00:00:00",
                    "description": "",
                    "followup_id": 38,
                    "id": null,
                    "location_id": 12774648,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": "2018-04-11T00:00:00",
                    "description": "",
                    "followup_id": 41,
                    "id": null,
                    "location_id": 604999,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": null,
                    "description": "",
                    "followup_id": null,
                    "id": 67342,
                    "location_id": 67341,
                    "name": "Drag and Drop with Req Category (67232)",
                    "type": 398,
                    "type_name": "Personal Staging Folder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }]
            }
          })),

          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/volumes/142?expand=node',
            responseTime: 0,
            type: 'GET',
            responseText: MockData.Personal
          })),

          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/volumes/141?expand=node',
            responseTime: 0,
            type: 'GET',
            responseText: MockData.Enterprise
          })),

          mocks.push(mockjax({
            url: new RegExp('//server/otcs/cs/api/v2/perspectives/(.*)/personalization'),
            responseTime: 0,
            type: 'POST',
            response: function (settings) {
              this.responseText = {
                links: {},
                results: {}
              };
            }
          }))

    },
    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  }
});