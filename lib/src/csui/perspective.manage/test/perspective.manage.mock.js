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
            url: '//server/otcs/cs/api/v1/nodes/facets',
            responseTime: 5,
            type: 'GET',
            responseText: {}
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/addablenodetypes',
            responseTime: 5,
            type: 'GET',
            responseText: {}
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
            url: '//server/otcs/cs/api/v2/nodes/2000?expand=properties%7Boriginal_id%7D&fields=properties%7Bcontainer%2Cid%2Cname%2Coriginal_id%2Ctype%7D&fields=versions%7Bmime_type%7D.element(0)&actions=default&actions=open&actions=download',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/nodes\/2000?actions=open&actions=download&expand=properties{original_id}&fields=properties{container,id,name,original_id,type}&fields=versions{mime_type}.element(0)",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/2000\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "properties": {
                    "container": true,
                    "id": 2000,
                    "name": "Enterprise Workspace",
                    "type": 141
                  }
                }
              }
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/searchbar?enterprise_slices=true',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "data": {
                "fields": "actions",
                "options": "{\u0027featured\u0027,\u0027highlight_summaries\u0027}",
                "slice": 17567287,
                "where": ""
              },
              "options": {
                "fields": {
                  "fields": "hidden",
                  "options": "hidden",
                  "slice": {
                    "label": "Search in:",
                    "optionLabels": ["Enterprise", "Enterprise [All Versions]", "Only documents"],
                    "type": "select"
                  }
                },
                "form": {
                  "attributes": {"action": "api\/v2\/search", "method": "post"},
                  "buttons": {"submit": {"title": "Search", "value": "Search"}}
                },
                "renderForm": true
              },
              "schema": {
                "properties": {
                  "fields": {"type": "string"},
                  "options": {"type": "string"},
                  "slice": {"enum": [17567287, 17567290, 5133299], "required": true},
                  "where": {"title": "Search for:", "type": "string"}
                }
              }
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/perspectives/398548',
            responseTime: 0,
            type: 'GET',
            responseText: {
              "perspectives": [
                  {
                      "av_id": 398548,
                      "cascading": true,
                      "constant_data": [],
                      "container_type": null,
                      "node": 0,
                      "node_path": "",
                      "override_id": 2926,
                      "override_type": "landingpage",
                      "perspective": "{\"options\":{\"widgets\":[{\"kind\":\"header\",\"options\":{\"message\":\"Hello Admin, you have a new accessible welcome video now.\",\"videoPoster\":\"\",\"videoSrc\":\"https:\\/\\/jira.opentext.com\\/secure\\/attachment\\/1369448\\/CS-IntroVideo_1e-revTL-v2.mp4\"},\"type\":\"csui\\/widgets\\/welcome.placeholder\"},{\"kind\":\"tile\",\"options\":{},\"type\":\"csui\\/widgets\\/myassignments\"},{\"kind\":\"tile\",\"options\":{},\"type\":\"csui\\/widgets\\/favorites\"},{\"kind\":\"tile\",\"options\":{},\"type\":\"csui\\/widgets\\/recentlyaccessed\"},{\"kind\":\"tile\",\"options\":{\"shortcutItems\":[{\"id\":2000,\"id_path\":\"Enterprise Workspace\",\"type\":\"141\"}],\"shortcutTheme\":\"csui-shortcut-theme-stone1\"},\"type\":\"csui\\/widgets\\/shortcuts\"},{\"kind\":\"tile\",\"options\":{\"shortcutItems\":[{\"id\":604999},{\"id\":408261},{\"id\":67449},{\"id\":77317}],\"shortcutTheme\":\"csui-shortcut-theme-teal1\"},\"type\":\"csui\\/widgets\\/shortcuts\"}]},\"type\":\"flow\"}",
                      "perspective_node_path": "Perspectives:Admin",
                      "priority": 2,
                      "rule_compatibility": 1,
                      "rule_data": [],
                      "rule_string": "",
                      "scope": "global",
                      "title": "Admin"
                  }
              ]
          }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/perspectives/398548',
            responseTime: 0,
            type: 'PUT',
            responseText: {
          }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/nodes/2000?actions=default&actions=open&actions=download&actions=browse&fields=properties',
            responseTime: 0,
            type: 'GET',
            responseText: {
          }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/2000/ancestors',
            responseTime: 0,
            type: 'GET',
            responseText: {
                "ancestors": [
                    {
                        "name": "Enterprise Workspace",
                        "volume_id": -2000,
                        "parent_id": -1,
                        "type": 141,
                        "id": 2000,
                        "type_name": "Enterprise Workspace"
                    }
                ]
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/nodes/2000?fields=properties%7Bcontainer%2Cid%2Cname%2Coriginal_id%2Ctype%7D&fields=versions%7Bmime_type%7D.element(0)&expand=properties%7Boriginal_id%7D&state=&actions=default&actions=open&actions=download&actions=browse',
            responseTime: 5,
            type: 'GET',
            responseText: {
                "links": {
                    "data": {
                        "self": {
                            "body": "",
                            "content_type": "",
                            "href": "/api/v2/nodes/2000?actions=open&actions=download&expand=properties{original_id}&fields=properties{container,id,name,original_id,type}&fields=versions{mime_type}.element(0)&state=true",
                            "method": "GET",
                            "name": ""
                        }
                    }
                },
                "results": {
                    "actions": {
                        "data": {
                            "open": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/2000/nodes",
                                "method": "GET",
                                "name": "Open"
                            }
                        },
                        "map": {
                            "default_action": "open"
                        },
                        "order": [
                            "open"
                        ]
                    },
                    "data": {
                        "properties": {
                            "container": true,
                            "id": 2000,
                            "name": "Enterprise Workspace",
                            "type": 141
                        }
                    },
                    "state": {
                        "properties": {
                            "metadata_token": ""
                        }
                    }
                }
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/searchqueries/391383',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "data": {
                  "BrowseLivelink": {
                      "BrowseLivelink_value1_ID": null
                  },
                  "Category": {
                      "Category_142987": {
                          "Category_142987_3_value1": "anydate",
                          "Category_142987_3_value2": "",
                          "Category_142987_3_value3": "",
                          "Category_142987__value1": ""
                      }
                  },
                  "FullText": {
                      "FullText_value1": "Demo"
                  },
                  "NlqComponent": {
                      "NlqComponent_value1": ""
                  },
                  "SystemAttributes": {
                      "SystemAttributes_value1": "",
                      "SystemAttributes_value2_ID": null,
                      "SystemAttributes_value3": "anydate",
                      "SystemAttributes_value4": "",
                      "SystemAttributes_value5": "",
                      "SystemAttributes_value6": ""
                  },
                  "templateId": 391383
              },
              "options": {
                  "fields": {
                      "BrowseLivelink": {
                          "fields": {
                              "BrowseLivelink_value1_ID": {
                                  "label": "Location",
                                  "name": "BrowseLivelink_value1_ID",
                                  "order": 1,
                                  "type": "otcs_node_picker",
                                  "type_control": {
                                      "action": "api/v1/volumes",
                                      "method": "GET",
                                      "name": "",
                                      "parameters": {
                                          "filter_types": [
                                              -2
                                          ],
                                          "select_types": []
                                      }
                                  }
                              }
                          },
                          "order": 650
                      },
                      "Category": {
                          "fields": {
                              "Category_142987": {
                                  "fields": {
                                      "Category_142987_3_value1": {
                                          "label": "DateField1",
                                          "name": "Category_142987_3_value1",
                                          "optionLabels": [
                                              "",
                                              "Any Date",
                                              "Past Day",
                                              "Past Week",
                                              "Past 2 Weeks",
                                              "Past Month",
                                              "Past 3 Months",
                                              "Past 6 Months",
                                              "Past Year",
                                              "Specific Date",
                                              "Date Range"
                                          ],
                                          "order": 3,
                                          "OTRegionName": "Attr_142987_4",
                                          "removeDefaultNone": true
                                      },
                                      "Category_142987_3_value1_DFor": {
                                          "dateFormat": "yyyy-mm-dd",
                                          "dependencies": {
                                              "Category_142987_3_value1": "specific"
                                          },
                                          "label": "For",
                                          "name": "Category_142987_3_value1_DFor"
                                      },
                                      "Category_142987_3_value1_DFrom": {
                                          "dateFormat": "yyyy-mm-dd",
                                          "dependencies": {
                                              "Category_142987_3_value1": "range"
                                          },
                                          "label": "From",
                                          "name": "Category_142987_3_value1_DFrom"
                                      },
                                      "Category_142987_3_value1_DTo": {
                                          "dateFormat": "yyyy-mm-dd",
                                          "dependencies": {
                                              "Category_142987_3_value1": "range"
                                          },
                                          "label": "To",
                                          "name": "Category_142987_3_value1_DTo"
                                      },
                                      "Category_142987_3_value2": {
                                          "label": "IntegerField1",
                                          "name": "Category_142987_3_value2",
                                          "order": 4,
                                          "OTRegionName": "Attr_142987_5"
                                      },
                                      "Category_142987_3_value3": {
                                          "label": "TextPopup",
                                          "name": "Category_142987_3_value3",
                                          "optionLabels": [
                                              "<None>",
                                              "Red",
                                              "Green",
                                              "Blue"
                                          ],
                                          "order": 5,
                                          "OTRegionName": "Attr_142987_6",
                                          "type": "select"
                                      },
                                      "Category_142987__value1": {
                                          "label": "TextField",
                                          "name": "Category_142987__value1",
                                          "order": 2,
                                          "OTRegionName": "Attr_142987_2"
                                      }
                                  },
                                  "order": 6
                              }
                          },
                          "order": 500
                      },
                      "FullText": {
                          "fields": {
                              "FullText_value1": {
                                  "label": "Search Terms",
                                  "name": "FullText_value1",
                                  "order": 7,
                                  "type": "text"
                              }
                          },
                          "order": 100
                      },
                      "NlqComponent": {
                          "fields": {
                              "NlqComponent_value1": {
                                  "label": "Enter a question or text",
                                  "name": "NlqComponent_value1",
                                  "type": "text"
                              }
                          },
                          "order": 150
                      },
                      "SystemAttributes": {
                          "fields": {
                              "SystemAttributes_value1": {
                                  "label": "Content Type",
                                  "name": "SystemAttributes_value1",
                                  "optionLabels": [
                                      "",
                                      "Any Type",
                                      "No Type Defined",
                                      "Document",
                                      "Folder",
                                      "Tasks",
                                      "Discussions",
                                      "Project",
                                      "Workflow Map",
                                      "Workflow",
                                      "Business Workspace",
                                      "Binder"
                                  ],
                                  "order": 8,
                                  "OTRegionName": "OTSubType",
                                  "type": "select"
                              },
                              "SystemAttributes_value2_ID": {
                                  "label": "Created By",
                                  "name": "SystemAttributes_value2_ID",
                                  "order": 9,
                                  "OTRegionName": "OTCreatedByName",
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
                              "SystemAttributes_value3": {
                                  "label": "Date",
                                  "name": "SystemAttributes_value3",
                                  "optionLabels": [
                                      "",
                                      "Any Date",
                                      "Past Day",
                                      "Past Week",
                                      "Past 2 Weeks",
                                      "Past Month",
                                      "Past 3 Months",
                                      "Past 6 Months",
                                      "Past Year",
                                      "Specific Date",
                                      "Date Range"
                                  ],
                                  "order": 10,
                                  "OTRegionName": "OTObjectDate",
                                  "removeDefaultNone": true
                              },
                              "SystemAttributes_value3_DFor": {
                                  "dateFormat": "yyyy-mm-dd",
                                  "dependencies": {
                                      "SystemAttributes_value3": "specific"
                                  },
                                  "label": "For",
                                  "name": "SystemAttributes_value3_DFor"
                              },
                              "SystemAttributes_value3_DFrom": {
                                  "dateFormat": "yyyy-mm-dd",
                                  "dependencies": {
                                      "SystemAttributes_value3": "range"
                                  },
                                  "label": "From",
                                  "name": "SystemAttributes_value3_DFrom"
                              },
                              "SystemAttributes_value3_DTo": {
                                  "dateFormat": "yyyy-mm-dd",
                                  "dependencies": {
                                      "SystemAttributes_value3": "range"
                                  },
                                  "label": "To",
                                  "name": "SystemAttributes_value3_DTo"
                              },
                              "SystemAttributes_value4": {
                                  "label": "Name",
                                  "name": "SystemAttributes_value4",
                                  "order": 11,
                                  "OTRegionName": "OTName"
                              },
                              "SystemAttributes_value5": {
                                  "label": "Description",
                                  "name": "SystemAttributes_value5",
                                  "order": 12,
                                  "OTRegionName": "OTDComment"
                              },
                              "SystemAttributes_value6": {
                                  "label": "Size",
                                  "name": "SystemAttributes_value6",
                                  "order": 13,
                                  "OTRegionName": "OTObjectSize"
                              }
                          },
                          "order": 300
                      },
                      "templateId": {
                          "type": "hidden"
                      }
                  }
              },
              "schema": {
                  "properties": {
                      "BrowseLivelink": {
                          "properties": {
                              "BrowseLivelink_value1_ID": {
                                  "type": "integer"
                              }
                          },
                          "title": "Location"
                      },
                      "Category": {
                          "properties": {
                              "Category_142987": {
                                  "OTCatVerNum": 1,
                                  "properties": {
                                      "Category_142987_3_value1": {
                                          "enum": [
                                              "anydate",
                                              "definedDate",
                                              "pastDay",
                                              "pastWeek",
                                              "past2Weeks",
                                              "pastMonth",
                                              "past3Months",
                                              "past6Months",
                                              "pastYear",
                                              "specific",
                                              "range"
                                          ]
                                      },
                                      "Category_142987_3_value1_DFor": {
                                          "dependencies": "Category_142987_3_value1",
                                          "format": "date"
                                      },
                                      "Category_142987_3_value1_DFrom": {
                                          "dependencies": "Category_142987_3_value1",
                                          "format": "date"
                                      },
                                      "Category_142987_3_value1_DTo": {
                                          "dependencies": "Category_142987_3_value1",
                                          "format": "date"
                                      },
                                      "Category_142987_3_value2": {},
                                      "Category_142987_3_value3": {
                                          "enum": [
                                              "",
                                              "Red",
                                              "Green",
                                              "Blue"
                                          ]
                                      },
                                      "Category_142987__value1": {}
                                  },
                                  "title": "Cat with set"
                              }
                          },
                          "title": "Categories..."
                      },
                      "FullText": {
                          "properties": {
                              "FullText_value1": {}
                          },
                          "title": "Full Text"
                      },
                      "NlqComponent": {
                          "properties": {
                              "NlqComponent_value1": {}
                          },
                          "title": "Natural Language Query"
                      },
                      "SystemAttributes": {
                          "properties": {
                              "SystemAttributes_value1": {
                                  "enum": [
                                      "",
                                      "__all__",
                                      "__none__",
                                      "144",
                                      "0",
                                      "206|212|204|205",
                                      "130|134|215",
                                      "202",
                                      "128",
                                      "189",
                                      "848",
                                      "31066"
                                  ]
                              },
                              "SystemAttributes_value2_ID": {},
                              "SystemAttributes_value3": {
                                  "enum": [
                                      "anydate",
                                      "definedDate",
                                      "pastDay",
                                      "pastWeek",
                                      "past2Weeks",
                                      "pastMonth",
                                      "past3Months",
                                      "past6Months",
                                      "pastYear",
                                      "specific",
                                      "range"
                                  ]
                              },
                              "SystemAttributes_value3_DFor": {
                                  "dependencies": "SystemAttributes_value3",
                                  "format": "date"
                              },
                              "SystemAttributes_value3_DFrom": {
                                  "dependencies": "SystemAttributes_value3",
                                  "format": "date"
                              },
                              "SystemAttributes_value3_DTo": {
                                  "dependencies": "SystemAttributes_value3",
                                  "format": "date"
                              },
                              "SystemAttributes_value4": {},
                              "SystemAttributes_value5": {},
                              "SystemAttributes_value6": {}
                          },
                          "title": "System Attributes"
                      },
                      "templateId": {}
                  },
                  "title": "Demo_Saved_query",
                  "type": "object"
              }
          }

          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/nodes/391383*',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                  "data": {
                      "self": {
                          "body": "",
                          "content_type": "",
                          "href": "/api/v2/nodes/391383?actions=open&actions=download&fields=properties",
                          "method": "GET",
                          "name": ""
                      }
                  }
              },
              "results": {
                  "actions": {
                      "data": {},
                      "map": {
                          "default_action": ""
                      },
                      "order": []
                  },
                  "data": {
                      "properties": {
                          "container": false,
                          "container_size": 0,
                          "create_date": "2015-12-28T09:12:33Z",
                          "create_user_id": 1000,
                          "description": "",
                          "description_multilingual": {
                              "de_DE": "",
                              "en": "",
                              "ja": ""
                          },
                          "external_create_date": null,
                          "external_identity": "",
                          "external_identity_type": "",
                          "external_modify_date": null,
                          "external_source": "",
                          "favorite": false,
                          "id": 391383,
                          "mime_type": null,
                          "modify_date": "2018-09-06T05:38:58Z",
                          "modify_user_id": 1000,
                          "name": "Demo_Saved_query",
                          "name_multilingual": {
                              "de_DE": "",
                              "en": "Demo_Saved_query",
                              "ja": ""
                          },
                          "owner": "Admin",
                          "owner_group_id": 1001,
                          "owner_user_id": 1000,
                          "parent_id": 386124,
                          "permissions_model": "advanced",
                          "reserved": false,
                          "reserved_date": null,
                          "reserved_shared_collaboration": false,
                          "reserved_user_id": 0,
                          "size": 2316,
                          "size_formatted": "1 Source",
                          "type": 258,
                          "type_name": "Search Query",
                          "versions_control_advanced": true,
                          "volume_id": -2000,
                          "wnd_comments": null
                      }
                  }
              }
            }

          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/391383/ancestors',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "ancestors": [
                  {
                      "name": "Enterprise Workspace",
                      "volume_id": -2000,
                      "parent_id": -1,
                      "type": 141,
                      "id": 2000,
                      "type_name": "Enterprise Workspace"
                  },
                  {
                      "name": "Hyd - Container AFW",
                      "volume_id": -2000,
                      "parent_id": 2000,
                      "type": 0,
                      "id": 386124,
                      "type_name": "Folder"
                  },
                  {
                      "name": "Demo_Saved_query",
                      "volume_id": -2000,
                      "parent_id": 386124,
                      "type": 258,
                      "id": 391383,
                      "type_name": "Unknown"
                  }
              ]
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
                                    "href": "/api/v2/nodes/5800857/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=5800857",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/5800857",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=5800857",
                                    "href": "/api/v2/nodes/5800857",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/5800857/nodes",
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
                                    "href": "/api/v2/nodes/5800857",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=5800857",
                                    "href": "/api/v2/nodes/5800857",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "CVS",
                                "tab_id": 15001
                            },
                            "properties": {
                                "container": true,
                                "id": 5800857,
                                "name": "00CVS",
                                "parent_id": 913574,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 52,
                                    "create_date": "2016-06-16T04:17:45",
                                    "create_user_id": 1000,
                                    "description": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                    "description_multilingual": {
                                        "de_DE": "Navya's folder\nSecond Row",
                                        "en": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                        "ja": "Navya's folder\nSecond line\n3rd line"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 913574,
                                    "mime_type": null,
                                    "modify_date": "2018-12-20T20:12:59",
                                    "modify_user_id": 1000,
                                    "name": "00 Navya Test folder",
                                    "name_multilingual": {
                                        "de_DE": "00 Navya's Test folder",
                                        "en": "00 Navya Test folder",
                                        "ja": "00 Navya Test folder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 52,
                                    "size_formatted": "52 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 15
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1563200/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=1563200",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1563200",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=1563200",
                                    "href": "/api/v2/nodes/1563200",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1563200/nodes",
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
                                    "href": "/api/v2/nodes/1563200",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=1563200",
                                    "href": "/api/v2/nodes/1563200",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "All CS standard subtypes",
                                "tab_id": 15001
                            },
                            "properties": {
                                "container": true,
                                "id": 1563200,
                                "name": "All-Object-types",
                                "parent_id": 913574,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 52,
                                    "create_date": "2016-06-16T04:17:45",
                                    "create_user_id": 1000,
                                    "description": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                    "description_multilingual": {
                                        "de_DE": "Navya's folder\nSecond Row",
                                        "en": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                        "ja": "Navya's folder\nSecond line\n3rd line"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 913574,
                                    "mime_type": null,
                                    "modify_date": "2018-12-20T20:12:59",
                                    "modify_user_id": 1000,
                                    "name": "00 Navya Test folder",
                                    "name_multilingual": {
                                        "de_DE": "00 Navya's Test folder",
                                        "en": "00 Navya Test folder",
                                        "ja": "00 Navya Test folder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 52,
                                    "size_formatted": "52 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 15
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18895705/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18895705/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18895705",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18895705",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18895705/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18895705",
                                    "href": "/api/v2/nodes/18895705",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18895705/content",
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
                                    "href": "/api/v2/nodes/18895705",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18895705",
                                    "href": "/api/v2/nodes/18895705",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18895705",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "cute-girl.jpg",
                                "tab_id": 15001
                            },
                            "properties": {
                                "container": false,
                                "id": 18895705,
                                "name": "cute-girl.jpg",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17973065/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17973065/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=17973065",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17973065/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=17973065",
                                    "href": "/api/v2/nodes/17973065",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17973065/content",
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
                                    "href": "/api/v2/nodes/17973065",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=17973065",
                                    "href": "/api/v2/nodes/17973065",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "unreserve": {
                                    "body": "reserved_user_id=null",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17973065",
                                    "method": "PUT",
                                    "name": "Unreserve"
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
                                "addversion",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "unreserve"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Audi-A8.jpgpp",
                                "tab_id": 15001
                            },
                            "properties": {
                                "container": false,
                                "id": 17973065,
                                "name": "Audi-A8.jpgpp",
                                "parent_id": 12523670,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-26T20:07:00",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 12523670,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T18:00:10",
                                    "modify_user_id": 1000,
                                    "name": "0 teju Folder",
                                    "name_multilingual": null,
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1552110/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=1552110",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1552110",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=1552110",
                                    "href": "/api/v2/nodes/1552110",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1552110/nodes",
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
                                    "href": "/api/v2/nodes/1552110",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=1552110",
                                    "href": "/api/v2/nodes/1552110",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "All widgets",
                                "tab_id": 15001
                            },
                            "properties": {
                                "container": true,
                                "id": 1552110,
                                "name": "All widgets",
                                "parent_id": 913574,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 52,
                                    "create_date": "2016-06-16T04:17:45",
                                    "create_user_id": 1000,
                                    "description": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                    "description_multilingual": {
                                        "de_DE": "Navya's folder\nSecond Row",
                                        "en": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                        "ja": "Navya's folder\nSecond line\n3rd line"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 913574,
                                    "mime_type": null,
                                    "modify_date": "2018-12-20T20:12:59",
                                    "modify_user_id": 1000,
                                    "name": "00 Navya Test folder",
                                    "name_multilingual": {
                                        "de_DE": "00 Navya's Test folder",
                                        "en": "00 Navya Test folder",
                                        "ja": "00 Navya Test folder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 52,
                                    "size_formatted": "52 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 15
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332525/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332525",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332525",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332525",
                                    "href": "/api/v2/nodes/18332525",
                                    "method": "PUT",
                                    "name": "Move"
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
                                    "href": "/api/v2/nodes/18332525",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332525",
                                    "href": "/api/v2/nodes/18332525",
                                    "method": "PUT",
                                    "name": "Rename"
                                }
                            },
                            "map": {
                                "default_action": "open",
                                "more": [
                                    "properties"
                                ]
                            },
                            "order": [
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Doc-shrt",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332525,
                                "name": "Doc-shrt",
                                "original_id": 17485552,
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 1,
                                "type_name": "Shortcut"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332544/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332544/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332544",
                                    "method": "DELETE",
                                    "name": "Delete"
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
                                    "href": "/api/v2/nodes/18332544",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332544",
                                    "href": "/api/v2/nodes/18332544",
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
                                "addversion",
                                "addcategory",
                                "rename",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Form template",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332544,
                                "name": "Form template",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 230,
                                "type_name": "Form Template"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332535/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332535/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332535",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332535",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332535/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "edit": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=18332535&uiType=2",
                                    "method": "GET",
                                    "name": "Edit"
                                },
                                "editactivex": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=18332535&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Word",
                                    "promoted": true
                                },
                                "editofficeonline": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=msofficeonline.edit&NodeID=18332535&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Word Online",
                                    "promoted": false
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332535",
                                    "href": "/api/v2/nodes/18332535",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332535/content",
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
                                    "href": "/api/v2/nodes/18332535",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332535",
                                    "href": "/api/v2/nodes/18332535",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332535",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "kalender-februar-2018-kleine-ziffern.docx",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332535,
                                "name": "kalender-februar-2018-kleine-ziffern.docx",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
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
                    },
                    {
                        "actions": {
                            "data": {
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332546/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332546",
                                    "method": "DELETE",
                                    "name": "Delete"
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
                                    "href": "/api/v2/nodes/18332546",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332546",
                                    "href": "/api/v2/nodes/18332546",
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
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Live Report",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332546,
                                "name": "Live Report",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 299,
                                "type_name": "LiveReport"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332529/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332529",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332529",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332529",
                                    "href": "/api/v2/nodes/18332529",
                                    "method": "PUT",
                                    "name": "Move"
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
                                    "href": "/api/v2/nodes/18332529",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332529",
                                    "href": "/api/v2/nodes/18332529",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332529",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "copy",
                                "move",
                                "permissions",
                                "reserve",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "non-empty-Category",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332529,
                                "name": "non-empty-Category",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 131,
                                "type_name": "Category"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332527/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332527",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332527",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332527",
                                    "href": "/api/v2/nodes/18332527",
                                    "method": "PUT",
                                    "name": "Move"
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
                                    "href": "/api/v2/nodes/18332527",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332527",
                                    "href": "/api/v2/nodes/18332527",
                                    "method": "PUT",
                                    "name": "Rename"
                                }
                            },
                            "map": {
                                "default_action": "open",
                                "more": [
                                    "properties"
                                ]
                            },
                            "order": [
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "orphand shortcut",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332527,
                                "name": "orphand shortcut",
                                "original_id": 17294050,
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 1,
                                "type_name": "Shortcut"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332550/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332550",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332550",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332550",
                                    "href": "/api/v2/nodes/18332550",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332550/nodes",
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
                                    "href": "/api/v2/nodes/18332550",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332550",
                                    "href": "/api/v2/nodes/18332550",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Physical item",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": true,
                                "id": 18332550,
                                "name": "Physical item",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 411,
                                "type_name": "Physical Item"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332543/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332543",
                                    "method": "DELETE",
                                    "name": "Delete"
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
                                    "href": "/api/v2/nodes/18332543",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332543",
                                    "href": "/api/v2/nodes/18332543",
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
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Poll",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332543,
                                "name": "Poll",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 218,
                                "type_name": "Poll"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332534/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332534/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332534",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332534",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332534/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332534",
                                    "href": "/api/v2/nodes/18332534",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332534/content",
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
                                    "href": "/api/v2/nodes/18332534",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332534",
                                    "href": "/api/v2/nodes/18332534",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332534",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "popover in edge.png",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332534,
                                "name": "popover in edge.png",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332536/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332536/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332536",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332536",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332536/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332536",
                                    "href": "/api/v2/nodes/18332536",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332536/content",
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
                                    "href": "/api/v2/nodes/18332536",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332536",
                                    "href": "/api/v2/nodes/18332536",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332536",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "Text Document",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332536,
                                "name": "Text Document",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 144,
                                "type_name": "Document"
                            },
                            "versions": {
                                "mime_type": "text/html"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332531/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332531",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332531",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332531",
                                    "href": "/api/v2/nodes/18332531",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "http://murdoch.opentext.com",
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
                                    "href": "/api/v2/nodes/18332531",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332531",
                                    "href": "/api/v2/nodes/18332531",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "URL",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332531,
                                "name": "URL",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332524/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332524",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332524",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332524",
                                    "href": "/api/v2/nodes/18332524",
                                    "method": "PUT",
                                    "name": "Move"
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
                                    "href": "/api/v2/nodes/18332524",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332524",
                                    "href": "/api/v2/nodes/18332524",
                                    "method": "PUT",
                                    "name": "Rename"
                                }
                            },
                            "map": {
                                "default_action": "open",
                                "more": [
                                    "properties"
                                ]
                            },
                            "order": [
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "UserField",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332524,
                                "name": "UserField",
                                "original_id": 13811305,
                                "original_id_expand": {
                                    "container": false,
                                    "container_size": 0,
                                    "create_date": "2018-04-12T23:18:56",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 13811305,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T17:59:58",
                                    "modify_user_id": 1000,
                                    "name": "UserField",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "UserField",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 11486653,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 408,
                                    "size_formatted": "",
                                    "type": 131,
                                    "type_name": "Category",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 1,
                                "type_name": "Shortcut"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332552/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332552",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332552",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332552",
                                    "href": "/api/v2/nodes/18332552",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332552/nodes",
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
                                    "href": "/api/v2/nodes/18332552",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332552",
                                    "href": "/api/v2/nodes/18332552",
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
                                "open",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Virtual Folder",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": true,
                                "id": 18332552,
                                "name": "Virtual Folder",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 899,
                                "type_name": "Virtual Folder"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332553/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332553",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332553",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332553",
                                    "href": "/api/v2/nodes/18332553",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332553/nodes",
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
                                    "href": "/api/v2/nodes/18332553",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332553",
                                    "href": "/api/v2/nodes/18332553",
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
                                "open",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Wiki",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": true,
                                "id": 18332553,
                                "name": "Wiki12",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 5573,
                                "type_name": "Wiki"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332528/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332528",
                                    "method": "DELETE",
                                    "name": "Delete"
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
                                    "href": "/api/v2/nodes/18332528",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332528",
                                    "href": "/api/v2/nodes/18332528",
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
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "WorkFLowMap",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332528,
                                "name": "WorkFLowMap",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 128,
                                "type_name": "Initiate Workflow"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332538/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332538",
                                    "method": "DELETE",
                                    "name": "Delete"
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
                                    "href": "/api/v2/nodes/18332538",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332538",
                                    "href": "/api/v2/nodes/18332538",
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
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "WorkFLow Status",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332538,
                                "name": "WorkFLow Status",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 190,
                                "type_name": "Workflow Status"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332547/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332547/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332547",
                                    "method": "DELETE",
                                    "name": "Delete"
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
                                    "href": "/api/v2/nodes/18332547",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332547",
                                    "href": "/api/v2/nodes/18332547",
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
                                "addversion",
                                "addcategory",
                                "rename",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "XML DTD",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332547,
                                "name": "XML DTD",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 335,
                                "type_name": "XML DTD"
                            },
                            "versions": {
                                "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332526/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332526",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332526",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332526",
                                    "href": "/api/v2/nodes/18332526",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12729103/nodes",
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
                                    "href": "/api/v2/nodes/18332526",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332526",
                                    "href": "/api/v2/nodes/18332526",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "000_subfolder",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": false,
                                "id": 18332526,
                                "name": "000_subfolder",
                                "original_id": 12729103,
                                "original_id_expand": {
                                    "container": true,
                                    "container_size": 3,
                                    "create_date": "2018-03-06T11:11:33",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 12729103,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:22:58",
                                    "modify_user_id": 1000,
                                    "name": "000_subfolder",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "000_subfolder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 749454,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 3,
                                    "size_formatted": "3 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 1,
                                "type_name": "Shortcut"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332545/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "collectionCanCollect": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "",
                                    "method": "GET",
                                    "name": "Collection can collect"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332545",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332545",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332545",
                                    "href": "/api/v2/nodes/18332545",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332545/nodes",
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
                                    "href": "/api/v2/nodes/18332545",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332545",
                                    "href": "/api/v2/nodes/18332545",
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
                                "open",
                                "collectionCanCollect",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Collection",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": true,
                                "id": 18332545,
                                "name": "Collection",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 298,
                                "type_name": "Collection"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332530/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332530",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332530",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332530",
                                    "href": "/api/v2/nodes/18332530",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332530/nodes",
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
                                    "href": "/api/v2/nodes/18332530",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332530",
                                    "href": "/api/v2/nodes/18332530",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332530",
                                    "method": "PUT",
                                    "name": "Reserve"
                                }
                            },
                            "map": {
                                "default_action": "",
                                "more": [
                                    "properties"
                                ]
                            },
                            "order": [
                                "open",
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
                                "name": "Compound Document",
                                "tab_id": 15002
                            },
                            "properties": {
                                "container": true,
                                "id": 18332530,
                                "name": "Compound Document",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 136,
                                "type_name": "Compound Document"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18891415/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18891415/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18891415",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18891415",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18891415/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18891415",
                                    "href": "/api/v2/nodes/18891415",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18891415/content",
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
                                    "href": "/api/v2/nodes/18891415",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18891415",
                                    "href": "/api/v2/nodes/18891415",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18891415",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "BMW i100.jpg",
                                "tab_id": 15003
                            },
                            "properties": {
                                "container": false,
                                "id": 18891415,
                                "name": "BMW i100.jpg",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332537/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332537/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332537",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332537/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332537",
                                    "href": "/api/v2/nodes/18332537",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332537/content",
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
                                    "href": "/api/v2/nodes/18332537",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332537",
                                    "href": "/api/v2/nodes/18332537",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "unreserve": {
                                    "body": "reserved_user_id=null",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332537",
                                    "method": "PUT",
                                    "name": "Unreserve"
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
                                "addversion",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "unreserve"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Chrysanthemum.jpg",
                                "tab_id": 15003
                            },
                            "properties": {
                                "container": false,
                                "id": 18332537,
                                "name": "Chrysanthemum.jpg",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18892185/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18892185/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18892185",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18892185",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18892185/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18892185",
                                    "href": "/api/v2/nodes/18892185",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18892185/content",
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
                                    "href": "/api/v2/nodes/18892185",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18892185",
                                    "href": "/api/v2/nodes/18892185",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18892185",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "rename.jpg",
                                "tab_id": 15003
                            },
                            "properties": {
                                "container": false,
                                "id": 18892185,
                                "name": "Boating - Copy.jpg",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/69547/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=69547",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/69547",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=69547",
                                    "href": "/api/v2/nodes/69547",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/69547/nodes",
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
                                    "href": "/api/v2/nodes/69547",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=69547",
                                    "href": "/api/v2/nodes/69547",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Classic 3000/4",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 69547,
                                "name": "Classic 3000/4",
                                "parent_id": 68333,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 9,
                                    "create_date": "2015-03-09T13:14:11",
                                    "create_user_id": 64039,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 68333,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:21:12",
                                    "modify_user_id": 1000,
                                    "name": "Water pumps",
                                    "name_multilingual": {
                                        "de_DE": "Water pumps",
                                        "en": "Water pumps",
                                        "ja": ""
                                    },
                                    "owner": "Smith, Kristen",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 64039,
                                    "parent_id": 69544,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 9,
                                    "size_formatted": "9 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12523670/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=12523670",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12523670",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=12523670",
                                    "href": "/api/v2/nodes/12523670",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12523670/nodes",
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
                                    "href": "/api/v2/nodes/12523670",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=12523670",
                                    "href": "/api/v2/nodes/12523670",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "0 teju Folder",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 12523670,
                                "name": "0 teju Folder",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/9284100/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=9284100",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/9284100",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=9284100",
                                    "href": "/api/v2/nodes/9284100",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/9284100/nodes",
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
                                    "href": "/api/v2/nodes/9284100",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=9284100",
                                    "href": "/api/v2/nodes/9284100",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "mspecht my favorite folder",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 9284100,
                                "name": "mspecht",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/10879731/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=10879731",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/10879731",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=10879731",
                                    "href": "/api/v2/nodes/10879731",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/10879731/nodes",
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
                                    "href": "/api/v2/nodes/10879731",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=10879731",
                                    "href": "/api/v2/nodes/10879731",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "0 yamini",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 10879731,
                                "name": "000 yamini",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/9343940/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=9343940",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/9343940",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=9343940",
                                    "href": "/api/v2/nodes/9343940",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/9343940/nodes",
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
                                    "href": "/api/v2/nodes/9343940",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=9343940",
                                    "href": "/api/v2/nodes/9343940",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Christine O",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 9343940,
                                "name": "Christine O",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18682203/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18682203",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18682203/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18682203",
                                    "href": "/api/v2/nodes/18682203",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18682203/content",
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
                                    "href": "/api/v2/nodes/18682203",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18682203",
                                    "href": "/api/v2/nodes/18682203",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "unreserve": {
                                    "body": "reserved_user_id=null",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18682203",
                                    "method": "PUT",
                                    "name": "Unreserve"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "unreserve"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Content Server Role Based UI-DRAFT.pptx",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 18682203,
                                "name": "Content Server Role Based UI-DRAFT.pptx",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 144,
                                "type_name": "Document"
                            },
                            "versions": {
                                "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/69554/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=69554",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/69554",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=69554",
                                    "href": "/api/v2/nodes/69554",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/69554/nodes",
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
                                    "href": "/api/v2/nodes/69554",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=69554",
                                    "href": "/api/v2/nodes/69554",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Assignments Data",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 69554,
                                "name": "Assignments Data",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18932995/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18932995",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18932995",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18932995",
                                    "href": "/api/v2/nodes/18932995",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18932995/nodes",
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
                                    "href": "/api/v2/nodes/18932995",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18932995",
                                    "href": "/api/v2/nodes/18932995",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Sindhu Team Demo Folder",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 18932995,
                                "name": "Sindhu Team Demo Folder",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16465039/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=16465039",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16465039",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=16465039",
                                    "href": "/api/v2/nodes/16465039",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16465039/nodes",
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
                                    "href": "/api/v2/nodes/16465039",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=16465039",
                                    "href": "/api/v2/nodes/16465039",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "4rename",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 16465039,
                                "name": "4rename",
                                "parent_id": 2904354,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 33,
                                    "create_date": "2017-03-29T07:41:03",
                                    "create_user_id": 1000,
                                    "description": "Admin folder text",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 2904354,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:23:56",
                                    "modify_user_id": 1000,
                                    "name": "Admin folder",
                                    "name_multilingual": null,
                                    "owner": "Smith, Kristen",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 64039,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 33,
                                    "size_formatted": "33 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 1
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/10364169/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=10364169",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/10364169",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=10364169",
                                    "href": "/api/v2/nodes/10364169",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/10364169/nodes",
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
                                    "href": "/api/v2/nodes/10364169",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=10364169",
                                    "href": "/api/v2/nodes/10364169",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "apirke_Examples",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 10364169,
                                "name": "apirke_Examples",
                                "parent_id": 2904354,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 33,
                                    "create_date": "2017-03-29T07:41:03",
                                    "create_user_id": 1000,
                                    "description": "Admin folder text",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 2904354,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:23:56",
                                    "modify_user_id": 1000,
                                    "name": "Admin folder",
                                    "name_multilingual": null,
                                    "owner": "Smith, Kristen",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 64039,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 33,
                                    "size_formatted": "33 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 1
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17778262/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=17778262",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17778262",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=17778262",
                                    "href": "/api/v2/nodes/17778262",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "http://www.google.com",
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
                                    "href": "/api/v2/nodes/17778262",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=17778262",
                                    "href": "/api/v2/nodes/17778262",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Google",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 17778262,
                                "name": "Google",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16763308/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16763308/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=16763308",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16763308",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16763308/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "edit": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=16763308&uiType=2",
                                    "method": "GET",
                                    "name": "Edit"
                                },
                                "editactivex": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=16763308&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Word",
                                    "promoted": true
                                },
                                "editofficeonline": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=msofficeonline.edit&NodeID=16763308&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Word Online",
                                    "promoted": false
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=16763308",
                                    "href": "/api/v2/nodes/16763308",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16763308/content",
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
                                    "href": "/api/v2/nodes/16763308",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=16763308",
                                    "href": "/api/v2/nodes/16763308",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16763308",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "empty123.docx",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 16763308,
                                "name": "empty123.docx",
                                "parent_id": 20122418,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 1,
                                    "create_date": "2018-11-15T20:33:15",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 20122418,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T18:00:25",
                                    "modify_user_id": 1000,
                                    "name": "Test",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "Test",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 16589999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 1,
                                    "size_formatted": "1 Item",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
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
                    },
                    {
                        "actions": {
                            "data": {
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19126043/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19126043",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19126043",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19126043",
                                    "href": "/api/v2/nodes/19126043",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19126043/nodes",
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
                                    "href": "/api/v2/nodes/19126043",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19126043",
                                    "href": "/api/v2/nodes/19126043",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "000000 hello",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 19126043,
                                "name": "ik",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17239821/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "collectionCanCollect": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "",
                                    "method": "GET",
                                    "name": "Collection can collect"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=17239821",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17239821",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=17239821",
                                    "href": "/api/v2/nodes/17239821",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/17239821/nodes",
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
                                    "href": "/api/v2/nodes/17239821",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=17239821",
                                    "href": "/api/v2/nodes/17239821",
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
                                "open",
                                "collectionCanCollect",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "0__test_rename",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 17239821,
                                "name": "0__test",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
                                "type": 298,
                                "type_name": "Collection"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19189067/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19189067",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19189067",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19189067",
                                    "href": "/api/v2/nodes/19189067",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19189067/nodes",
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
                                    "href": "/api/v2/nodes/19189067",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19189067",
                                    "href": "/api/v2/nodes/19189067",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "hasgvd",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 19189067,
                                "name": "hasgvd",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=510864",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "edit": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=510864&uiType=2",
                                    "method": "GET",
                                    "name": "Edit"
                                },
                                "editactivex": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=510864&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Word",
                                    "promoted": true
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=510864",
                                    "href": "/api/v2/nodes/510864",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864/content",
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
                                    "href": "/api/v2/nodes/510864",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=510864",
                                    "href": "/api/v2/nodes/510864",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "permissions",
                                "reserve",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "284764 haha, we add a very long name to see if this collides with the space required for the viewshortcut / vieworiginal button. happily we can report that it does not seem to be a problem.doc",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 510864,
                                "name": "284764 haha, we add a very long name to see if this collides with the space required for the viewshortcut / vieworiginal button. happily we can report that it does not seem to be a problem.doc",
                                "parent_id": 396034,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 21,
                                    "create_date": "2016-01-13T13:52:49",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 396034,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:22:55",
                                    "modify_user_id": 1000,
                                    "name": "aihua's_test_folder",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "aihua's_test_folder",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 749454,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 21,
                                    "size_formatted": "21 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 1
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19312632/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19312632",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19312632",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19312632",
                                    "href": "/api/v2/nodes/19312632",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19312632/nodes",
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
                                    "href": "/api/v2/nodes/19312632",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19312632",
                                    "href": "/api/v2/nodes/19312632",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19312632",
                                    "method": "PUT",
                                    "name": "Reserve"
                                }
                            },
                            "map": {
                                "default_action": "",
                                "more": [
                                    "properties"
                                ]
                            },
                            "order": [
                                "open",
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
                                "name": "CompDoc_01",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 19312632,
                                "name": "CompDoc_01",
                                "parent_id": 3035034,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 14,
                                    "create_date": "2017-04-03T05:10:16",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 3035034,
                                    "mime_type": null,
                                    "modify_date": "2018-12-04T07:21:26",
                                    "modify_user_id": 1000,
                                    "name": "Special_types",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "Special_types",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 1708595,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 14,
                                    "size_formatted": "14 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 136,
                                "type_name": "Compound Document"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19550549/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19550549/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19550549",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19550549",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19550549/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19550549",
                                    "href": "/api/v2/nodes/19550549",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19550549/content",
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
                                    "href": "/api/v2/nodes/19550549",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19550549",
                                    "href": "/api/v2/nodes/19550549",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19550549",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "Chrysanthemum - Copy.jpg",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 19550549,
                                "name": "Chrysanthemum - Copy.jpg",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16587579/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16587579/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=16587579",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16587579",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16587579/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=16587579",
                                    "href": "/api/v2/nodes/16587579",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16587579/content",
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
                                    "href": "/api/v2/nodes/16587579",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=16587579",
                                    "href": "/api/v2/nodes/16587579",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16587579",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "2017-07-12-16-19-49-768_2090171633_.pdf",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 16587579,
                                "name": "2017-07-12-16-19-49-768_2090171633_.pdf",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
                                "type": 144,
                                "type_name": "Document"
                            },
                            "versions": {
                                "mime_type": "application/pdf"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19588828/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19588828/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19588828",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19588828",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19588828/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19588828",
                                    "href": "/api/v2/nodes/19588828",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19588828/content",
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
                                    "href": "/api/v2/nodes/19588828",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19588828",
                                    "href": "/api/v2/nodes/19588828",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19588828",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "Background.PNG",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 19588828,
                                "name": "Background.PNG",
                                "parent_id": 17574212,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 5,
                                    "create_date": "2018-09-05T22:44:49",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 17574212,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:24:02",
                                    "modify_user_id": 1000,
                                    "name": "hhh",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "hhh",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 5,
                                    "size_formatted": "5 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19231746/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19231746/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19231746",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19231746",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19231746/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19231746",
                                    "href": "/api/v2/nodes/19231746",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19231746/content",
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
                                    "href": "/api/v2/nodes/19231746",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19231746",
                                    "href": "/api/v2/nodes/19231746",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19231746",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "780D193E-AA8B-4178-AB38-32DBF00B9D53.png",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 19231746,
                                "name": "780D193E-AA8B-4178-AB38-111132DBF00B9D53.png",
                                "parent_id": 17480602,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 24,
                                    "create_date": "2018-09-03T20:39:39",
                                    "create_user_id": 1000,
                                    "description": "ygyiyuiyiyuiyuiyi",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "ygyiyuiyiyuiyuiyi",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 17480602,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:17:09",
                                    "modify_user_id": 1000,
                                    "name": "jkhkj",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "jkhkj",
                                        "ja": "0000Gallery view"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2554572,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 24,
                                    "size_formatted": "24 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 100
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/2904354/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=2904354",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/2904354",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=2904354",
                                    "href": "/api/v2/nodes/2904354",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/2904354/nodes",
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
                                    "href": "/api/v2/nodes/2904354",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=2904354",
                                    "href": "/api/v2/nodes/2904354",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "abc",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 2904354,
                                "name": "Admin folder",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/7842956/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/7842956/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=7842956",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/7842956",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/7842956/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "edit": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=7842956&uiType=2",
                                    "method": "GET",
                                    "name": "Edit"
                                },
                                "editactivex": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=Edit.Edit&nodeid=7842956&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Excel",
                                    "promoted": true
                                },
                                "editofficeonline": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "func=msofficeonline.edit&NodeID=7842956&uiType=2",
                                    "method": "GET",
                                    "name": "Edit in Excel Online",
                                    "promoted": false
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=7842956",
                                    "href": "/api/v2/nodes/7842956",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/7842956/content",
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
                                    "href": "/api/v2/nodes/7842956",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=7842956",
                                    "href": "/api/v2/nodes/7842956",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/7842956",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "Document with 30+versions",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 7842956,
                                "name": "Document with 30+versions.jpg",
                                "parent_id": 913574,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 52,
                                    "create_date": "2016-06-16T04:17:45",
                                    "create_user_id": 1000,
                                    "description": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                    "description_multilingual": {
                                        "de_DE": "Navya's folder\nSecond Row",
                                        "en": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                        "ja": "Navya's folder\nSecond line\n3rd line"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 913574,
                                    "mime_type": null,
                                    "modify_date": "2018-12-20T20:12:59",
                                    "modify_user_id": 1000,
                                    "name": "00 Navya Test folder",
                                    "name_multilingual": {
                                        "de_DE": "00 Navya's Test folder",
                                        "en": "00 Navya Test folder",
                                        "ja": "00 Navya Test folder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 52,
                                    "size_formatted": "52 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 15
                                },
                                "type": 144,
                                "type_name": "Document"
                            },
                            "versions": {
                                "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332551/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18332551",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332551",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18332551",
                                    "href": "/api/v2/nodes/18332551",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332551/nodes",
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
                                    "href": "/api/v2/nodes/18332551",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18332551",
                                    "href": "/api/v2/nodes/18332551",
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
                                "open",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Email Folder",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 18332551,
                                "name": "Email Folder",
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 751,
                                "type_name": "Email Folder"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/14815234/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/14815234/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=14815234",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/14815234",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/14815234/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=14815234",
                                    "href": "/api/v2/nodes/14815234",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/14815234/content",
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
                                    "href": "/api/v2/nodes/14815234",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=14815234",
                                    "href": "/api/v2/nodes/14815234",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/14815234",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "old",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 14815234,
                                "name": "old",
                                "parent_id": 12523670,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-26T20:07:00",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 12523670,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T18:00:10",
                                    "modify_user_id": 1000,
                                    "name": "0 teju Folder",
                                    "name_multilingual": null,
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 144,
                                "type_name": "Document"
                            },
                            "versions": {
                                "mime_type": "text/xml"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/589182/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/589182/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=589182",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/589182",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/589182/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=589182",
                                    "href": "/api/v2/nodes/589182",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/589182/content",
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
                                    "href": "/api/v2/nodes/589182",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=589182",
                                    "href": "/api/v2/nodes/589182",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/589182",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "2015-10-03 at 11.12.12_Anton.jpg",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 589182,
                                "name": "2015-10-03 at 11.12.12_Anton.jpg",
                                "parent_id": 452402,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 40,
                                    "create_date": "2016-01-29T04:50:02",
                                    "create_user_id": 64039,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 452402,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:21:25",
                                    "modify_user_id": 1000,
                                    "name": "A class A+ folder with a very long but descriptive name that proves the ellipsis is working",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "A class A+ folder with a very long but descriptive name that proves the ellipsis is working",
                                        "ja": ""
                                    },
                                    "owner": "Smith, Kristen",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 64039,
                                    "parent_id": 205659,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 40,
                                    "size_formatted": "40 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/590290/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/590290/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=590290",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/590290",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/590290/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=590290",
                                    "href": "/api/v2/nodes/590290",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/590290/content",
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
                                    "href": "/api/v2/nodes/590290",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=590290",
                                    "href": "/api/v2/nodes/590290",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/590290",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "2015-10-03 at 11.12.16_Anton.jpg",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 590290,
                                "name": "2015-10-03 at 11.12.16_Anton.jpg",
                                "parent_id": 452402,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 40,
                                    "create_date": "2016-01-29T04:50:02",
                                    "create_user_id": 64039,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 452402,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:21:25",
                                    "modify_user_id": 1000,
                                    "name": "A class A+ folder with a very long but descriptive name that proves the ellipsis is working",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "A class A+ folder with a very long but descriptive name that proves the ellipsis is working",
                                        "ja": ""
                                    },
                                    "owner": "Smith, Kristen",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 64039,
                                    "parent_id": 205659,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 40,
                                    "size_formatted": "40 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20214048/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=20214048",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20214048",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=20214048",
                                    "href": "/api/v2/nodes/20214048",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20214048/nodes",
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
                                    "href": "/api/v2/nodes/20214048",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=20214048",
                                    "href": "/api/v2/nodes/20214048",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "TD Folder",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 20214048,
                                "name": "TD Folder",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20402704/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20402704/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=20402704",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20402704",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20402704/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=20402704",
                                    "href": "/api/v2/nodes/20402704",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20402704/content",
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
                                    "href": "/api/v2/nodes/20402704",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=20402704",
                                    "href": "/api/v2/nodes/20402704",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20402704",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "patches.zip",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 20402704,
                                "name": "patches.zip",
                                "parent_id": 20402919,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 3,
                                    "create_date": "2018-11-20T21:15:17",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 20402919,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:24:11",
                                    "modify_user_id": 1000,
                                    "name": "TestDnD",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "TestDnD",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 3,
                                    "size_formatted": "3 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 144,
                                "type_name": "Document"
                            },
                            "versions": {
                                "mime_type": "application/x-zip-compressed"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1594546/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1594546/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=1594546",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1594546",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1594546/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=1594546",
                                    "href": "/api/v2/nodes/1594546",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1594546/content",
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
                                    "href": "/api/v2/nodes/1594546",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=1594546",
                                    "href": "/api/v2/nodes/1594546",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1594546",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "Audi-A8.jpg",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 1594546,
                                "name": "Audi-A8.jpg",
                                "parent_id": 1552110,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 7,
                                    "create_date": "2016-08-04T04:50:53",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 1552110,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T17:59:05",
                                    "modify_user_id": 1000,
                                    "name": "All widgets",
                                    "name_multilingual": null,
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 913574,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 7,
                                    "size_formatted": "7 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20547678/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=20547678",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20547678",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=20547678",
                                    "href": "/api/v2/nodes/20547678",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18332553/nodes",
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
                                    "href": "/api/v2/nodes/20547678",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=20547678",
                                    "href": "/api/v2/nodes/20547678",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Wiki-shortcut",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 20547678,
                                "name": "Wiki-shortcut",
                                "original_id": 18332553,
                                "original_id_expand": {
                                    "container": true,
                                    "container_size": 2,
                                    "create_date": "2016-08-05T02:26:48",
                                    "create_user_id": 1000,
                                    "customsidebars": [],
                                    "description": "",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 18332553,
                                    "image_folder_id": 18332585,
                                    "imagebrowseenabled": true,
                                    "main_page_id": 18332584,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T18:00:28",
                                    "modify_user_id": 1000,
                                    "name": "Wiki12",
                                    "name_multilingual": null,
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 18332522,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 2,
                                    "size_formatted": "2 Items",
                                    "type": 5573,
                                    "type_name": "Wiki",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "parent_id": 18332522,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18332522,
                                    "mime_type": null,
                                    "modify_date": "2018-12-24T00:28:38",
                                    "modify_user_id": 1000,
                                    "name": "All CS Object Types - Original copy",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "All CS Object Types - Original copy",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 17317150,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "type": 1,
                                "type_name": "Shortcut"
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16958113/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=16958113",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16958113",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=16958113",
                                    "href": "/api/v2/nodes/16958113",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/16958113/nodes",
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
                                    "href": "/api/v2/nodes/16958113",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=16958113",
                                    "href": "/api/v2/nodes/16958113",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "008 Munich",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 16958113,
                                "name": "008 Munich",
                                "parent_id": 2000,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 144,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2000,
                                    "mime_type": null,
                                    "modify_date": "2018-12-21T01:29:39",
                                    "modify_user_id": 1000,
                                    "name": "Enterprise Workspace",
                                    "name_multilingual": {
                                        "de_DE": "Enterprise",
                                        "en": "Enterprise Workspace",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 144,
                                    "size_formatted": "144 Items",
                                    "type": 141,
                                    "type_name": "Enterprise Workspace",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19201720/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19201720",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19201720",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19201720",
                                    "href": "/api/v2/nodes/19201720",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19201720/nodes",
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
                                    "href": "/api/v2/nodes/19201720",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19201720",
                                    "href": "/api/v2/nodes/19201720",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "000efefefeflong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong name",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 19201720,
                                "name": "000efefefeflong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong namelong name000 name name name name name name nfdg",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20346268/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=20346268",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20346268",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=20346268",
                                    "href": "/api/v2/nodes/20346268",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/20346268/nodes",
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
                                    "href": "/api/v2/nodes/20346268",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=20346268",
                                    "href": "/api/v2/nodes/20346268",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "0009GMK",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 20346268,
                                "name": "0009GMK",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18198761/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=18198761",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18198761",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=18198761",
                                    "href": "/api/v2/nodes/18198761",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/18198761/nodes",
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
                                    "href": "/api/v2/nodes/18198761",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=18198761",
                                    "href": "/api/v2/nodes/18198761",
                                    "method": "PUT",
                                    "name": "Rename"
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
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "delete"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "Connected_Workspace",
                                "tab_id": null
                            },
                            "properties": {
                                "container": true,
                                "id": 18198761,
                                "name": "Connected_Workspace",
                                "parent_id": 18198541,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 1,
                                    "create_date": "2018-09-25T01:49:53",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 18198541,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T18:00:04",
                                    "modify_user_id": 1000,
                                    "name": "000000Esoc_demo",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "000000Esoc_demo",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 11806985,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 1,
                                    "size_formatted": "1 Item",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1394206/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1394206/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=1394206",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "delete": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1394206",
                                    "method": "DELETE",
                                    "name": "Delete"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1394206/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=1394206",
                                    "href": "/api/v2/nodes/1394206",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1394206/content",
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
                                    "href": "/api/v2/nodes/1394206",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=1394206",
                                    "href": "/api/v2/nodes/1394206",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "reserve": {
                                    "body": "reserved_user_id=1000",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1394206",
                                    "method": "PUT",
                                    "name": "Reserve"
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
                                "name": "Audi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpg",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 1394206,
                                "name": "Audi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpgAudi-A8.jpg",
                                "parent_id": 913574,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 52,
                                    "create_date": "2016-06-16T04:17:45",
                                    "create_user_id": 1000,
                                    "description": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                    "description_multilingual": {
                                        "de_DE": "Navya's folder\nSecond Row",
                                        "en": "654987\nasdfdasfasdf asdf sadf\nasdfs adfasdf\nasdfsfrg\nsgasrygth\nfsgryhrgfhsdrxfhdhsh\n\ndasetesrgh\n\nasd\nf dsa\nfsda\nfasdfd",
                                        "ja": "Navya's folder\nSecond line\n3rd line"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 913574,
                                    "mime_type": null,
                                    "modify_date": "2018-12-20T20:12:59",
                                    "modify_user_id": 1000,
                                    "name": "00 Navya Test folder",
                                    "name_multilingual": {
                                        "de_DE": "00 Navya's Test folder",
                                        "en": "00 Navya Test folder",
                                        "ja": "00 Navya Test folder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 52,
                                    "size_formatted": "52 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 15
                                },
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
                                "addcategory": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19360042/categories",
                                    "method": "POST",
                                    "name": "Add Category"
                                },
                                "addversion": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19360042/versions",
                                    "method": "POST",
                                    "name": "Add Version"
                                },
                                "copy": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/copy?id=19360042",
                                    "href": "/api/v2/nodes",
                                    "method": "POST",
                                    "name": "Copy"
                                },
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19360042/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "move": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/move?id=19360042",
                                    "href": "/api/v2/nodes/19360042",
                                    "method": "PUT",
                                    "name": "Move"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19360042/content",
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
                                    "href": "/api/v2/nodes/19360042",
                                    "method": "GET",
                                    "name": "Properties"
                                },
                                "rename": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "/api/v2/forms/nodes/rename?id=19360042",
                                    "href": "/api/v2/nodes/19360042",
                                    "method": "PUT",
                                    "name": "Rename"
                                },
                                "unreserve": {
                                    "body": "reserved_user_id=null",
                                    "content_type": "application/x-www-form-urlencoded",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/19360042",
                                    "method": "PUT",
                                    "name": "Unreserve"
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
                                "addversion",
                                "addcategory",
                                "rename",
                                "copy",
                                "move",
                                "permissions",
                                "unreserve"
                            ]
                        },
                        "data": {
                            "favorites": {
                                "name": "ashefgpic.png",
                                "tab_id": null
                            },
                            "properties": {
                                "container": false,
                                "id": 19360042,
                                "name": "ashefgpic.png",
                                "parent_id": 13052833,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 30,
                                    "create_date": "2018-03-19T23:04:51",
                                    "create_user_id": 1000,
                                    "description": "descriptionm",
                                    "description_multilingual": {
                                        "de_DE": "descriptionm",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 13052833,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T18:00:11",
                                    "modify_user_id": 1000,
                                    "name": "english - teja's folder",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "english - teja's folder",
                                        "ja": "0 teja's folder"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 30,
                                    "size_formatted": "30 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
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
                            "href": "/api/v2/members/assignments?fields=assignments{date_due,description,id,name,type,type_name,location_id,followup_id,workflow_id,workflow_open_in_smart_ui,workflow_subworkflow_id,workflow_subworkflow_task_id}&state=true",
                            "method": "GET",
                            "name": ""
                        }
                    }
                },
                "results": [
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-17T00:00:00",
                                "description": "",
                                "followup_id": 13,
                                "id": null,
                                "location_id": 11058371,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
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
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-03-08T00:00:00",
                                "description": "",
                                "followup_id": 28,
                                "id": null,
                                "location_id": 2710644,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-03-21T00:00:00",
                                "description": "",
                                "followup_id": 34,
                                "id": null,
                                "location_id": 1600816,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-03-07T00:00:00",
                                "description": "",
                                "followup_id": 36,
                                "id": null,
                                "location_id": 631424,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
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
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-04-26T00:00:00",
                                "description": "",
                                "followup_id": 45,
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
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-04-02T00:00:00",
                                "description": "",
                                "followup_id": 50,
                                "id": null,
                                "location_id": 13248857,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-04-12T00:00:00",
                                "description": "",
                                "followup_id": 53,
                                "id": null,
                                "location_id": 244861,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-04-20T00:00:00",
                                "description": "",
                                "followup_id": 62,
                                "id": null,
                                "location_id": 11602992,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-10T00:00:00",
                                "description": "",
                                "followup_id": 63,
                                "id": null,
                                "location_id": 7968806,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-12T00:00:00",
                                "description": "",
                                "followup_id": 69,
                                "id": null,
                                "location_id": 14030095,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-04-27T00:00:00",
                                "description": "",
                                "followup_id": 71,
                                "id": null,
                                "location_id": 11144391,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-16T00:00:00",
                                "description": "",
                                "followup_id": 81,
                                "id": null,
                                "location_id": 14617575,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-25T00:00:00",
                                "description": "",
                                "followup_id": 83,
                                "id": null,
                                "location_id": 13805145,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-18T00:00:00",
                                "description": "",
                                "followup_id": 84,
                                "id": null,
                                "location_id": 13805145,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-28T00:00:00",
                                "description": "",
                                "followup_id": 85,
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
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-31T00:00:00",
                                "description": "",
                                "followup_id": 86,
                                "id": null,
                                "location_id": 13130053,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "1970-01-01T05:30:00",
                                "description": "",
                                "followup_id": 88,
                                "id": null,
                                "location_id": 5886327,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-07-06T00:00:00",
                                "description": "",
                                "followup_id": 95,
                                "id": null,
                                "location_id": 11580112,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-07-06T00:00:00",
                                "description": "",
                                "followup_id": 96,
                                "id": null,
                                "location_id": 11580112,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-07-12T00:00:00",
                                "description": "",
                                "followup_id": 97,
                                "id": null,
                                "location_id": 15774819,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-07-12T00:00:00",
                                "description": "",
                                "followup_id": 98,
                                "id": null,
                                "location_id": 15774819,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-08-08T00:00:00",
                                "description": "",
                                "followup_id": 107,
                                "id": null,
                                "location_id": 6774268,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-08-08T00:00:00",
                                "description": "",
                                "followup_id": 108,
                                "id": null,
                                "location_id": 6774268,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-08-29T02:00:00",
                                "description": "",
                                "followup_id": 111,
                                "id": null,
                                "location_id": 134742,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-08-30T05:30:00",
                                "description": "",
                                "followup_id": 114,
                                "id": null,
                                "location_id": 1563766,
                                "name": "Annual Review",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-08-30T05:30:00",
                                "description": "",
                                "followup_id": 115,
                                "id": null,
                                "location_id": 14405715,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-09-12T02:00:00",
                                "description": "",
                                "followup_id": 116,
                                "id": null,
                                "location_id": 17708302,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-24T05:30:00",
                                "description": "",
                                "followup_id": 123,
                                "id": null,
                                "location_id": 17741305,
                                "name": "Test  Followup Type",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-09T05:30:00",
                                "description": "",
                                "followup_id": 127,
                                "id": null,
                                "location_id": 17317260,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-19T02:00:00",
                                "description": "",
                                "followup_id": 131,
                                "id": null,
                                "location_id": 15772509,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-11T02:00:00",
                                "description": "",
                                "followup_id": 133,
                                "id": null,
                                "location_id": 18547783,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-31T01:00:00",
                                "description": "",
                                "followup_id": 134,
                                "id": null,
                                "location_id": 11739951,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-27T02:00:00",
                                "description": "",
                                "followup_id": 140,
                                "id": null,
                                "location_id": 15772509,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-19T00:00:00",
                                "description": "",
                                "followup_id": 143,
                                "id": null,
                                "location_id": 18943110,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-23T00:00:00",
                                "description": "",
                                "followup_id": 146,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-24T00:00:00",
                                "description": "",
                                "followup_id": 147,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-25T00:00:00",
                                "description": "",
                                "followup_id": 149,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-26T00:00:00",
                                "description": "",
                                "followup_id": 151,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-29T00:00:00",
                                "description": "",
                                "followup_id": 154,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-30T00:00:00",
                                "description": "",
                                "followup_id": 158,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-31T00:00:00",
                                "description": "",
                                "followup_id": 162,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-01T00:00:00",
                                "description": "",
                                "followup_id": 163,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-02T00:00:00",
                                "description": "",
                                "followup_id": 165,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T00:00:00",
                                "description": "",
                                "followup_id": 174,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-06T00:00:00",
                                "description": "",
                                "followup_id": 188,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-07T00:00:00",
                                "description": "",
                                "followup_id": 191,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-08T00:00:00",
                                "description": "",
                                "followup_id": 193,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-09T00:00:00",
                                "description": "",
                                "followup_id": 194,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-12T00:00:00",
                                "description": "",
                                "followup_id": 195,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-13T00:00:00",
                                "description": "",
                                "followup_id": 196,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-14T00:00:00",
                                "description": "",
                                "followup_id": 197,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-15T00:00:00",
                                "description": "",
                                "followup_id": 199,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-16T00:00:00",
                                "description": "",
                                "followup_id": 204,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-19T00:00:00",
                                "description": "",
                                "followup_id": 208,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-20T00:00:00",
                                "description": "",
                                "followup_id": 211,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-21T00:00:00",
                                "description": "",
                                "followup_id": 212,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-22T00:00:00",
                                "description": "",
                                "followup_id": 215,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-23T00:00:00",
                                "description": "",
                                "followup_id": 216,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-26T00:00:00",
                                "description": "",
                                "followup_id": 218,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-27T00:00:00",
                                "description": "",
                                "followup_id": 220,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-28T00:00:00",
                                "description": "",
                                "followup_id": 221,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-29T00:00:00",
                                "description": "",
                                "followup_id": 224,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-30T00:00:00",
                                "description": "",
                                "followup_id": 225,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-03T00:00:00",
                                "description": "",
                                "followup_id": 226,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-04T00:00:00",
                                "description": "",
                                "followup_id": 232,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-05T00:00:00",
                                "description": "",
                                "followup_id": 233,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-06T00:00:00",
                                "description": "",
                                "followup_id": 235,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-07T00:00:00",
                                "description": "",
                                "followup_id": 236,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-10T00:00:00",
                                "description": "",
                                "followup_id": 237,
                                "id": null,
                                "location_id": 19089958,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-25T00:00:00",
                                "description": "",
                                "followup_id": 150,
                                "id": null,
                                "location_id": 2554572,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-26T05:30:00",
                                "description": "",
                                "followup_id": 152,
                                "id": null,
                                "location_id": 18212951,
                                "name": "Annual Review",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-31T05:30:00",
                                "description": "",
                                "followup_id": 155,
                                "id": null,
                                "location_id": 15700019,
                                "name": "Feedback (1 day)",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-29T00:00:00",
                                "description": "",
                                "followup_id": 160,
                                "id": null,
                                "location_id": 604999,
                                "name": "Feedback (1 day)",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-30T00:00:00",
                                "description": "",
                                "followup_id": 161,
                                "id": null,
                                "location_id": 16587579,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-31T00:00:00",
                                "description": "",
                                "followup_id": 164,
                                "id": null,
                                "location_id": 12775303,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-29T05:30:00",
                                "description": "",
                                "followup_id": 166,
                                "id": null,
                                "location_id": 13918885,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-01T00:00:00",
                                "description": "",
                                "followup_id": 169,
                                "id": null,
                                "location_id": 13614937,
                                "name": "Annual Review",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-01T00:00:00",
                                "description": "",
                                "followup_id": 171,
                                "id": null,
                                "location_id": 18940799,
                                "name": "Feedback (1 week)",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-01T00:00:00",
                                "description": "",
                                "followup_id": 172,
                                "id": null,
                                "location_id": 15700019,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-02T00:00:00",
                                "description": "",
                                "followup_id": 173,
                                "id": null,
                                "location_id": 11806985,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-16T01:00:00",
                                "description": "",
                                "followup_id": 175,
                                "id": null,
                                "location_id": 18943110,
                                "name": "Annual Review",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-04T19:00:00",
                                "description": "",
                                "followup_id": 176,
                                "id": null,
                                "location_id": 9343940,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-04T19:00:00",
                                "description": "",
                                "followup_id": 177,
                                "id": null,
                                "location_id": 16915543,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T05:30:00",
                                "description": "",
                                "followup_id": 179,
                                "id": null,
                                "location_id": 18587053,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T05:30:00",
                                "description": "",
                                "followup_id": 180,
                                "id": null,
                                "location_id": 19644596,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T00:00:00",
                                "description": "",
                                "followup_id": 181,
                                "id": null,
                                "location_id": 19644156,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T00:00:00",
                                "description": "",
                                "followup_id": 184,
                                "id": null,
                                "location_id": 19636236,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T00:00:00",
                                "description": "",
                                "followup_id": 186,
                                "id": null,
                                "location_id": 19643606,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-05T00:00:00",
                                "description": "",
                                "followup_id": 187,
                                "id": null,
                                "location_id": 19643606,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-06T05:30:00",
                                "description": "",
                                "followup_id": 190,
                                "id": null,
                                "location_id": 19706307,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-07T01:00:00",
                                "description": "",
                                "followup_id": 192,
                                "id": null,
                                "location_id": 2904354,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-22T05:30:00",
                                "description": "",
                                "followup_id": 198,
                                "id": null,
                                "location_id": 19648666,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-30T05:30:00",
                                "description": "",
                                "followup_id": 200,
                                "id": null,
                                "location_id": 19231746,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-20T19:00:00",
                                "description": "",
                                "followup_id": 201,
                                "id": null,
                                "location_id": 15262012,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-15T00:00:00",
                                "description": "",
                                "followup_id": 203,
                                "id": null,
                                "location_id": 14854369,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-15T00:00:00",
                                "description": "",
                                "followup_id": 205,
                                "id": null,
                                "location_id": 17914881,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-16T00:00:00",
                                "description": "",
                                "followup_id": 206,
                                "id": null,
                                "location_id": 17914327,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-16T00:00:00",
                                "description": "",
                                "followup_id": 207,
                                "id": null,
                                "location_id": 18575065,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-17T01:00:00",
                                "description": "",
                                "followup_id": 209,
                                "id": null,
                                "location_id": 1497482,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-19T00:00:00",
                                "description": "",
                                "followup_id": 210,
                                "id": null,
                                "location_id": 16589999,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-26T00:00:00",
                                "description": "",
                                "followup_id": 219,
                                "id": null,
                                "location_id": 14661910,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-27T00:00:00",
                                "description": "",
                                "followup_id": 222,
                                "id": null,
                                "location_id": 18802977,
                                "name": "Review (Priority)",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-11-27T00:00:00",
                                "description": "",
                                "followup_id": 223,
                                "id": null,
                                "location_id": 18633033,
                                "name": "Review (Priority)",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-04T05:30:00",
                                "description": "",
                                "followup_id": 229,
                                "id": null,
                                "location_id": 18198651,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-05T05:30:00",
                                "description": "",
                                "followup_id": 230,
                                "id": null,
                                "location_id": 18198651,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-05T00:00:00",
                                "description": "",
                                "followup_id": 234,
                                "id": null,
                                "location_id": 18198651,
                                "name": "Action item",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-12-07T19:00:00",
                                "description": "",
                                "followup_id": 238,
                                "id": null,
                                "location_id": 14150325,
                                "name": "Annual Review",
                                "type": 31214,
                                "type_name": "Reminder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
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
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 69217,
                                "location_id": 69554,
                                "name": "Pstage (68995)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 370046,
                                "location_id": 67341,
                                "name": "target 1 (335478)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 7299735,
                                "location_id": 2003,
                                "name": "00 DPS0 (1710581)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 20401048,
                                "location_id": 67341,
                                "name": "test email folder (20400943)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 20406931,
                                "location_id": 604999,
                                "name": "000 yamini (10879731)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 20406722,
                                "location_id": 20406829,
                                "name": "testertet (20407027)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 20406725,
                                "location_id": 604999,
                                "name": "0000NAVEEN (20406829)",
                                "type": 398,
                                "type_name": "Personal Staging Folder",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2017-10-30T18:00:00",
                                "description": "Sed porttitor lectus nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Proin eget tortor risus. Proin eget tortor risus. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Donec sollicitudin molestie malesuada.",
                                "followup_id": null,
                                "id": 5316991,
                                "location_id": 5317651,
                                "name": "Task",
                                "type": 206,
                                "type_name": "Task",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 20636990,
                                "location_id": 20636553,
                                "name": "T1",
                                "type": 206,
                                "type_name": "Task",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": 20636886,
                                "location_id": 20636553,
                                "name": "T2",
                                "type": 206,
                                "type_name": "Task",
                                "workflow_id": null,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": null,
                                "workflow_subworkflow_task_id": null
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 2384737,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 2384737,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 4256412,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 4256412,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 8677801,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 8677801,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Ravi test workflow map 1",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 13621772,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 13621772,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 13621990,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 13621990,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 ghghgh",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14238006,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14238006,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-05-17T01:36:34",
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Provide Customer with Pump Help Docs",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14414520,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 14414520,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-09-29T01:36:34",
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Update Inventory after Pump Sale",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14414520,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 14414520,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14474942,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14474942,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2018-10-02T14:55:00",
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Admin",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 18208888,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 18208888,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 3484611,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 3484611,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 9631487,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 9631487,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 WF_ItemRef_1/16/2018_2",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 11335889,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 11335889,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 WF_ReadOnly_MultiValue 2/1/2018",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 11842650,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 11842650,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 19408013,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 19408013,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 19408231,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 19408231,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2017-12-06T03:27:46",
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Update Inventory after Pump Sale",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 5904589,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 5904589,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 apirke UserField in FF 1/26/2018",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 11678132,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 11678132,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 gggg",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14237679,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14237679,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "TKL attributes - step1",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14313469,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14313469,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 aaa",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 15885380,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 15885380,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 Test paging size",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 17114768,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 17114768,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Supervisor validation",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 21177264,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 21177264,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 2383194,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 2383194,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 6815313,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 6815313,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 fdfdfdfd",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14182901,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14182901,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 ttt",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14183439,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14183439,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "TKL attributes - step1",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14187734,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14187734,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 Test_25042018",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14248451,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14248451,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14474057,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14474057,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 ghghghgh",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14237896,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14237896,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 Approve document",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 15488714,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 15488714,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 19808391,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 19808391,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 2097900,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 2097900,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 3150977,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 3150977,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 3479994,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 3479994,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 6681328,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 6681328,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 7289407,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 7289407,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 9714555,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 9714555,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14474486,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14474486,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "2nd step",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14676433,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14676437,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14676650,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 14676654,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 ffgg",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 15885819,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 15885819,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": "2017-07-16T07:22:31",
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Update Inventory after Pump Sale",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 1712778,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 1712778,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 7329556,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 7329556,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Classic UI Gurpal",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 9630497,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 9630497,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 9630932,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 9630932,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "TKL attributes - step1",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14303455,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14303455,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 19202274,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 19202274,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 19408554,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 19408554,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "<Initiator>",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 3482081,
                                "workflow_open_in_smart_ui": false,
                                "workflow_subworkflow_id": 3482081,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 6859852,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 6859852,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 7289075,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 7289075,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "Fill New Employee Joining Details",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 9716191,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 9716191,
                                "workflow_subworkflow_task_id": 2
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 FindMe12/7/2017 12:02",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 10364172,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 10364172,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 test doc",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14085541,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14085541,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 Test",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 14303682,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 14303682,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 000000 My test WF",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 16735815,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 16735815,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 Test",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 16736805,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 16736805,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    },
                    {
                        "data": {
                            "assignments": {
                                "date_due": null,
                                "description": "",
                                "followup_id": null,
                                "id": null,
                                "location_id": null,
                                "name": "#1 doc approval",
                                "type": 153,
                                "type_name": "Workflow Step",
                                "workflow_id": 21192096,
                                "workflow_open_in_smart_ui": true,
                                "workflow_subworkflow_id": 21192096,
                                "workflow_subworkflow_task_id": 1
                            }
                        }
                    }
                ]
            }
          })),
          mocks.push(mockjax({
            url: new RegExp('^//server/otcs/cs/api/v2/members/accessed.*actions=editpermissions'),
            responseTime: 5,
            type: 'GET',
            responseText: {
                "links": {
                    "data": {
                        "self": {
                            "body": "",
                            "content_type": "",
                            "href": "/api/v2/members/accessed?actions=open&actions=download&expand=properties{parent_id,reserved_user_id}&fields=properties{container,id,name,original_id,type,type_name,parent_id,reserved}&fields=versions{mime_type}.element(0)&state=true",
                            "method": "GET",
                            "name": ""
                        }
                    }
                },
                "results": [
                    {
                        "actions": {
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12863085,
                                "name": "Req_TKL_MV",
                                "parent_id": 7247375,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 7,
                                    "create_date": "2017-08-22T00:16:19",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 7247375,
                                    "mime_type": null,
                                    "modify_date": "2018-03-12T01:34:43",
                                    "modify_user_id": 1000,
                                    "name": "00 MultiValueAttributes",
                                    "name_multilingual": {
                                        "de_DE": "00 MultiValueAttributes",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 616849,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 7,
                                    "size_formatted": "7 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-12T01:35:44"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 7247706,
                                "name": "MultiValueDateFiled",
                                "parent_id": 7247375,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 7,
                                    "create_date": "2017-08-22T00:16:19",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 7247375,
                                    "mime_type": null,
                                    "modify_date": "2018-03-12T01:34:43",
                                    "modify_user_id": 1000,
                                    "name": "00 MultiValueAttributes",
                                    "name_multilingual": {
                                        "de_DE": "00 MultiValueAttributes",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 616849,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 7,
                                    "size_formatted": "7 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-12T01:34:07"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 7247708,
                                "name": "MultiValueIntPopUp",
                                "parent_id": 7247375,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 7,
                                    "create_date": "2017-08-22T00:16:19",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 7247375,
                                    "mime_type": null,
                                    "modify_date": "2018-03-12T01:34:43",
                                    "modify_user_id": 1000,
                                    "name": "00 MultiValueAttributes",
                                    "name_multilingual": {
                                        "de_DE": "00 MultiValueAttributes",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 616849,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 7,
                                    "size_formatted": "7 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-12T01:33:07"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 7247595,
                                "name": "MultiValueTextFiled",
                                "parent_id": 7247375,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 7,
                                    "create_date": "2017-08-22T00:16:19",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 7247375,
                                    "mime_type": null,
                                    "modify_date": "2018-03-12T01:34:43",
                                    "modify_user_id": 1000,
                                    "name": "00 MultiValueAttributes",
                                    "name_multilingual": {
                                        "de_DE": "00 MultiValueAttributes",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 616849,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 7,
                                    "size_formatted": "7 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-12T01:31:55"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12863083,
                                "name": "Req-MV-User-field",
                                "parent_id": 7247375,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 7,
                                    "create_date": "2017-08-22T00:16:19",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 7247375,
                                    "mime_type": null,
                                    "modify_date": "2018-03-12T01:34:43",
                                    "modify_user_id": 1000,
                                    "name": "00 MultiValueAttributes",
                                    "name_multilingual": {
                                        "de_DE": "00 MultiValueAttributes",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 616849,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 7,
                                    "size_formatted": "7 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-12T01:31:33"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12852193,
                                "name": "user_cat",
                                "parent_id": 616849,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 73,
                                    "create_date": "2016-05-13T01:29:53",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 616849,
                                    "mime_type": null,
                                    "modify_date": "2018-10-16T19:43:30",
                                    "modify_user_id": 1000,
                                    "name": "000 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "000 Hyderabad",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2004,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 73,
                                    "size_formatted": "73 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-11T18:29:04"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12821068,
                                "name": "mandatory int popup",
                                "parent_id": 1286747,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 15,
                                    "create_date": "2016-07-14T01:50:49",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 1286747,
                                    "mime_type": null,
                                    "modify_date": "2018-11-08T00:19:44",
                                    "modify_user_id": 1000,
                                    "name": "007 Ravi",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "007 Ravi",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2004,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 15,
                                    "size_formatted": "15 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-09T01:01:55"
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
                                    "href": "/api/v2/nodes/12821505/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12821505/content",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open",
                                "download"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12821505,
                                "name": "Boating-rename2.jpg",
                                "parent_id": 11995091,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 11,
                                    "create_date": "2018-02-05T23:22:30",
                                    "create_user_id": 1000,
                                    "description": "ddd",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "ddd"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 11995091,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T17:59:25",
                                    "modify_user_id": 1000,
                                    "name": "Ñ0All CS Object Types",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "Ñ0All CS Object Types",
                                        "ja": "All CS Object Types"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 1282482,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 11,
                                    "size_formatted": "11 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "reserved": false,
                                "type": 144,
                                "type_name": "Document"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-08T23:37:40"
                            },
                            "versions": {
                                "mime_type": "text/html"
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
                                    "href": "/api/v2/nodes/12821173/nodes",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": true,
                                "id": 12821173,
                                "name": "Engineering",
                                "parent_id": 12820733,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 5,
                                    "create_date": "2018-03-08T22:01:59",
                                    "create_user_id": 1000,
                                    "description": "Nam at tortor in tellus interdum sagittis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Nullam tincidunt adipiscing enim.\n\nCurabitur at lacus ac velit ornare lobortis. Aenean commodo ligula eget dolor. Sed magna purus, fermentum eu",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 12820733,
                                    "mime_type": null,
                                    "modify_date": "2018-12-23T20:55:25",
                                    "modify_user_id": 1000,
                                    "name": "Container types",
                                    "name_multilingual": null,
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2609792,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 5,
                                    "size_formatted": "5 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "reserved": false,
                                "type": 0,
                                "type_name": "Folder"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-08T22:22:00"
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
                                    "href": "/api/v2/nodes/12820733/nodes",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": true,
                                "id": 12820733,
                                "name": "Container types",
                                "parent_id": 2609792,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 23,
                                    "create_date": "2017-03-22T00:41:01",
                                    "create_user_id": 327084,
                                    "description": "This folder is created for Kaveri team demo purpose. Please don't update anything in it :)",
                                    "description_multilingual": {
                                        "de_DE": "This folder is created for Kaveri team demo purpose. Please don't update anything in it :) :)",
                                        "en": "This folder is created for Kaveri team demo purpose. Please don't update anything in it :)",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2609792,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T17:59:37",
                                    "modify_user_id": 1000,
                                    "name": "000 Kaveri team demo folder",
                                    "name_multilingual": {
                                        "de_DE": "000 Kaveri team demo folder",
                                        "en": "000 Kaveri team demo folder",
                                        "ja": ""
                                    },
                                    "owner": "Kuchana, Navya",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 327084,
                                    "parent_id": 604999,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 23,
                                    "size_formatted": "23 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 0
                                },
                                "reserved": false,
                                "type": 0,
                                "type_name": "Folder"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-08T22:02:01"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 1509470,
                                "name": "All Cat Attributes",
                                "parent_id": 2004,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 90,
                                    "create_date": "2003-10-01T13:30:55",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 2004,
                                    "mime_type": null,
                                    "modify_date": "2018-11-26T20:01:14",
                                    "modify_user_id": 1000,
                                    "name": "Categories Volume",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "Categories Volume",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": -1,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 90,
                                    "size_formatted": "90 Items",
                                    "type": 133,
                                    "type_name": "Categories Volume",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-08T08:53:27"
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
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12775303/nodes",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": true,
                                "id": 12775303,
                                "name": "Sandhya",
                                "parent_id": 604999,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 180,
                                    "create_date": "2016-04-26T10:04:49",
                                    "create_user_id": 1000,
                                    "description": "sjdhfkjdhgd",
                                    "description_multilingual": {
                                        "de_DE": "Hyderabad Smart UI team's (Kaveri & Manas) folder.",
                                        "en": "sjdhfkjdhgd",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 604999,
                                    "mime_type": null,
                                    "modify_date": "2018-12-26T01:29:28",
                                    "modify_user_id": 1000,
                                    "name": "007 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "007 Hyderabad - Deutsch",
                                        "en": "007 Hyderabad",
                                        "ja": "007 Hyderabad - Jap"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 180,
                                    "size_formatted": "180 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 27
                                },
                                "reserved": false,
                                "type": 0,
                                "type_name": "Folder"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T19:14:09"
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
                                    "href": "/api/v2/nodes/510864/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/510864/content",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open",
                                "download"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 510864,
                                "name": "284764 haha, we add a very long name to see if this collides with the space required for the viewshortcut / vieworiginal button. happily we can report that it does not seem to be a problem.doc",
                                "parent_id": 396034,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 21,
                                    "create_date": "2016-01-13T13:52:49",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 396034,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:22:55",
                                    "modify_user_id": 1000,
                                    "name": "aihua's_test_folder",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "aihua's_test_folder",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 749454,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 21,
                                    "size_formatted": "21 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 1
                                },
                                "reserved": false,
                                "type": 144,
                                "type_name": "Document"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T06:30:08"
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
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12767273/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/12767273/content",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open",
                                "download"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12767273,
                                "name": "msword01 (2).doc",
                                "parent_id": 396034,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 21,
                                    "create_date": "2016-01-13T13:52:49",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 396034,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:22:55",
                                    "modify_user_id": 1000,
                                    "name": "aihua's_test_folder",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "aihua's_test_folder",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 749454,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 21,
                                    "size_formatted": "21 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 1
                                },
                                "reserved": false,
                                "type": 144,
                                "type_name": "Document"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T06:29:45"
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
                                "download": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/511856/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/511856/content",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open",
                                "download"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 511856,
                                "name": "10585.docx",
                                "parent_id": 396034,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 21,
                                    "create_date": "2016-01-13T13:52:49",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 396034,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:22:55",
                                    "modify_user_id": 1000,
                                    "name": "aihua's_test_folder",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "aihua's_test_folder",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 749454,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 21,
                                    "size_formatted": "21 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 1
                                },
                                "reserved": false,
                                "type": 144,
                                "type_name": "Document"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T06:26:31"
                            },
                            "versions": {
                                "mime_type": "application/pdf"
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
                                    "href": "/api/v2/nodes/1274122/content?download",
                                    "method": "GET",
                                    "name": "Download"
                                },
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/1274122/content",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open",
                                "download"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 1274122,
                                "name": "000_Useful_for_testing_Flex-280.docx",
                                "parent_id": 749454,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 25,
                                    "create_date": "2016-06-01T13:37:56",
                                    "create_user_id": 1000,
                                    "description": "needs 2x Enter",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "needs 2x Enter",
                                        "ja": "ddddd hhhh fffff fffff"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 749454,
                                    "mime_type": null,
                                    "modify_date": "2018-12-23T20:57:18",
                                    "modify_user_id": 1000,
                                    "name": "00_Aihua's Folder",
                                    "name_multilingual": {
                                        "de_DE": "Aihua's folder",
                                        "en": "00_Aihua's Folder",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 25,
                                    "size_formatted": "25 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 3
                                },
                                "reserved": false,
                                "type": 144,
                                "type_name": "Document"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T05:00:56"
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
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open",
                                "download"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 1258752,
                                "name": "000 Dinosur png",
                                "parent_id": 1852695,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 4,
                                    "create_date": "2017-02-27T03:26:59",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 1852695,
                                    "mime_type": null,
                                    "modify_date": "2018-12-19T17:59:10",
                                    "modify_user_id": 1000,
                                    "name": "amrut",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "amrut",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 913574,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 4,
                                    "size_formatted": "4 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "reserved": true,
                                "type": 144,
                                "type_name": "Document"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T03:33:32"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12760124,
                                "name": "Mandatory select field - plain",
                                "parent_id": 12024122,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 4,
                                    "create_date": "2018-02-06T20:04:28",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 12024122,
                                    "mime_type": null,
                                    "modify_date": "2018-03-07T01:18:20",
                                    "modify_user_id": 1000,
                                    "name": "mandatory cats",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": "mandatory cats"
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 1286747,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 4,
                                    "size_formatted": "4 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-07T01:18:45"
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
                                "open": {
                                    "body": "",
                                    "content_type": "",
                                    "form_href": "",
                                    "href": "/api/v2/nodes/5317321/nodes",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": ""
                            },
                            "order": [
                                "open"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": true,
                                "id": 5317321,
                                "name": "Blog",
                                "parent_id": 5317542,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 4,
                                    "create_date": "2017-06-19T08:02:42",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 5317542,
                                    "mime_type": null,
                                    "modify_date": "2017-06-19T08:10:11",
                                    "modify_user_id": 1000,
                                    "name": "_2PM EST",
                                    "name_multilingual": {
                                        "de_DE": "_2PM EST",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2003,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 4,
                                    "size_formatted": "4 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2003
                                },
                                "reserved": false,
                                "type": 356,
                                "type_name": "Blog"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T22:47:29"
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
                                    "href": "/api/v2/nodes/5317215/nodes",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": ""
                            },
                            "order": [
                                "open"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": true,
                                "id": 5317215,
                                "name": "Channel",
                                "parent_id": 5317542,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 4,
                                    "create_date": "2017-06-19T08:02:42",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 5317542,
                                    "mime_type": null,
                                    "modify_date": "2017-06-19T08:10:11",
                                    "modify_user_id": 1000,
                                    "name": "_2PM EST",
                                    "name_multilingual": {
                                        "de_DE": "_2PM EST",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2003,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 4,
                                    "size_formatted": "4 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2003
                                },
                                "reserved": false,
                                "type": 207,
                                "type_name": "Channel"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T22:47:23"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 11842297,
                                "name": "WF_ReadOnly_MulitValue",
                                "parent_id": 10364169,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 18,
                                    "create_date": "2017-12-07T00:43:23",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 10364169,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:23:57",
                                    "modify_user_id": 1000,
                                    "name": "apirke_Examples",
                                    "name_multilingual": {
                                        "de_DE": "apirke_Examples",
                                        "en": "apirke_Examples",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2904354,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 18,
                                    "size_formatted": "18 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "reserved": false,
                                "type": 128,
                                "type_name": "Initiate Workflow"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T19:23:15"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 10364424,
                                "name": "WF_Review",
                                "parent_id": 10364169,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 18,
                                    "create_date": "2017-12-07T00:43:23",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": true,
                                    "id": 10364169,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:23:57",
                                    "modify_user_id": 1000,
                                    "name": "apirke_Examples",
                                    "name_multilingual": {
                                        "de_DE": "apirke_Examples",
                                        "en": "apirke_Examples",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2904354,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 18,
                                    "size_formatted": "18 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "reserved": false,
                                "type": 128,
                                "type_name": "Initiate Workflow"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T19:16:15"
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
                                    "href": "/api/v2/nodes/12729103/nodes",
                                    "method": "GET",
                                    "name": "Open"
                                }
                            },
                            "map": {
                                "default_action": "open"
                            },
                            "order": [
                                "open"
                            ]
                        },
                        "data": {
                            "properties": {
                                "container": true,
                                "id": 12729103,
                                "name": "000_subfolder",
                                "parent_id": 749454,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 25,
                                    "create_date": "2016-06-01T13:37:56",
                                    "create_user_id": 1000,
                                    "description": "needs 2x Enter",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "needs 2x Enter",
                                        "ja": "ddddd hhhh fffff fffff"
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 749454,
                                    "mime_type": null,
                                    "modify_date": "2018-12-23T20:57:18",
                                    "modify_user_id": 1000,
                                    "name": "00_Aihua's Folder",
                                    "name_multilingual": {
                                        "de_DE": "Aihua's folder",
                                        "en": "00_Aihua's Folder",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2000,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 25,
                                    "size_formatted": "25 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": 3
                                },
                                "reserved": false,
                                "type": 0,
                                "type_name": "Folder"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T11:11:33"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12729323,
                                "name": "000_category",
                                "parent_id": 12729103,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 3,
                                    "create_date": "2018-03-06T11:11:33",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": null,
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 12729103,
                                    "mime_type": null,
                                    "modify_date": "2018-12-03T18:22:58",
                                    "modify_user_id": 1000,
                                    "name": "000_subfolder",
                                    "name_multilingual": null,
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 749454,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 3,
                                    "size_formatted": "3 Items",
                                    "type": 0,
                                    "type_name": "Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2000,
                                    "wnd_comments": null
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T11:09:44"
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
                            "data": {},
                            "map": {
                                "default_action": ""
                            },
                            "order": []
                        },
                        "data": {
                            "properties": {
                                "container": false,
                                "id": 12724711,
                                "name": "00064400Category",
                                "parent_id": 616849,
                                "parent_id_expand": {
                                    "container": true,
                                    "container_size": 73,
                                    "create_date": "2016-05-13T01:29:53",
                                    "create_user_id": 1000,
                                    "description": "",
                                    "description_multilingual": {
                                        "de_DE": "",
                                        "en": "",
                                        "ja": ""
                                    },
                                    "external_create_date": null,
                                    "external_identity": "",
                                    "external_identity_type": "",
                                    "external_modify_date": null,
                                    "external_source": "",
                                    "favorite": false,
                                    "id": 616849,
                                    "mime_type": null,
                                    "modify_date": "2018-10-16T19:43:30",
                                    "modify_user_id": 1000,
                                    "name": "000 Hyderabad",
                                    "name_multilingual": {
                                        "de_DE": "",
                                        "en": "000 Hyderabad",
                                        "ja": ""
                                    },
                                    "owner": "istrator, Admin",
                                    "owner_group_id": 1001,
                                    "owner_user_id": 1000,
                                    "parent_id": 2004,
                                    "permissions_model": "advanced",
                                    "reserved": false,
                                    "reserved_date": null,
                                    "reserved_shared_collaboration": false,
                                    "reserved_user_id": 0,
                                    "size": 73,
                                    "size_formatted": "73 Items",
                                    "type": 132,
                                    "type_name": "Category Folder",
                                    "versions_control_advanced": true,
                                    "volume_id": -2004
                                },
                                "reserved": false,
                                "type": 131,
                                "type_name": "Category"
                            },
                            "properties_user": {
                                "access_date_last": "2018-03-06T05:57:50"
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
                    }
                ]
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/nodes/actions',
            responseTime: 5,
            type: 'POST',
            responseText: {
                "links": {
                    "data": {
                        "self": {
                            "body": "",
                            "content_type": "",
                            "href": "/api/v2/nodes/actions?actions=addversion&actions=copy&actions=delete&actions=edit&actions=rename&actions=move&actions=permissions&actions=reserve&actions=unreserve&ids=12863085&ids=7247706&ids=7247708&ids=7247595&ids=12863083&ids=12852193&ids=12821068&ids=12821505&ids=12821173&ids=12820733&ids=1509470&ids=12775303&ids=510864&ids=12767273&ids=511856&ids=1274122&ids=1258752&ids=12760124&ids=5317321&ids=5317215&ids=11842297&ids=10364424&ids=12729103&ids=12729323&ids=12724711",
                            "method": "GET",
                            "name": ""
                        }
                    }
                },
                "results": {
                    "510864": {
                        "data": {
                            "addversion": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/510864/versions",
                                "method": "POST",
                                "name": "Add Version"
                            },
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=510864",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/510864",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "edit": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "func=Edit.Edit&nodeid=510864&uiType=2",
                                "method": "GET",
                                "name": "Edit"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=510864",
                                "href": "/api/v2/nodes/510864",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/510864",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=510864",
                                "href": "/api/v2/nodes/510864",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/510864",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "edit",
                            "addversion",
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "511856": {
                        "data": {
                            "addversion": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/511856/versions",
                                "method": "POST",
                                "name": "Add Version"
                            },
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=511856",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/511856",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=511856",
                                "href": "/api/v2/nodes/511856",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/511856",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=511856",
                                "href": "/api/v2/nodes/511856",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/511856",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "addversion",
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "1258752": {
                        "data": {
                            "addversion": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/1258752/versions",
                                "method": "POST",
                                "name": "Add Version"
                            },
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=1258752",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=1258752",
                                "href": "/api/v2/nodes/1258752",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/1258752",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=1258752",
                                "href": "/api/v2/nodes/1258752",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "unreserve": {
                                "body": "reserved_user_id=null",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/1258752",
                                "method": "PUT",
                                "name": "Unreserve"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "addversion",
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "unreserve"
                        ]
                    },
                    "1274122": {
                        "data": {
                            "addversion": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/1274122/versions",
                                "method": "POST",
                                "name": "Add Version"
                            },
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=1274122",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/1274122",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "edit": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "func=Edit.Edit&nodeid=1274122&uiType=2",
                                "method": "GET",
                                "name": "Edit"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=1274122",
                                "href": "/api/v2/nodes/1274122",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/1274122",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=1274122",
                                "href": "/api/v2/nodes/1274122",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/1274122",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "edit",
                            "addversion",
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "1509470": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=1509470",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/1509470",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=1509470",
                                "href": "/api/v2/nodes/1509470",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/1509470",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=1509470",
                                "href": "/api/v2/nodes/1509470",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/1509470",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "5317215": {
                        "data": {
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/5317215",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=5317215",
                                "href": "/api/v2/nodes/5317215",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/5317215",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=5317215",
                                "href": "/api/v2/nodes/5317215",
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
                            "rename",
                            "move",
                            "permissions",
                            "delete"
                        ]
                    },
                    "5317321": {
                        "data": {
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/5317321",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "properties": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/5317321",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=5317321",
                                "href": "/api/v2/nodes/5317321",
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
                            "rename",
                            "delete"
                        ]
                    },
                    "7247595": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=7247595",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/7247595",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=7247595",
                                "href": "/api/v2/nodes/7247595",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/7247595",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=7247595",
                                "href": "/api/v2/nodes/7247595",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/7247595",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "7247706": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=7247706",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/7247706",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=7247706",
                                "href": "/api/v2/nodes/7247706",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/7247706",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=7247706",
                                "href": "/api/v2/nodes/7247706",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/7247706",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "7247708": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=7247708",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/7247708",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=7247708",
                                "href": "/api/v2/nodes/7247708",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/7247708",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=7247708",
                                "href": "/api/v2/nodes/7247708",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/7247708",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "10364424": {
                        "data": {
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/10364424",
                                "method": "DELETE",
                                "name": "Delete"
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
                                "href": "/api/v2/nodes/10364424",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=10364424",
                                "href": "/api/v2/nodes/10364424",
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
                            "rename",
                            "permissions",
                            "delete"
                        ]
                    },
                    "11842297": {
                        "data": {
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/11842297",
                                "method": "DELETE",
                                "name": "Delete"
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
                                "href": "/api/v2/nodes/11842297",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=11842297",
                                "href": "/api/v2/nodes/11842297",
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
                            "rename",
                            "permissions",
                            "delete"
                        ]
                    },
                    "12724711": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12724711",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12724711",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12724711",
                                "href": "/api/v2/nodes/12724711",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12724711",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12724711",
                                "href": "/api/v2/nodes/12724711",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12724711",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12729103": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12729103",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12729103",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12729103",
                                "href": "/api/v2/nodes/12729103",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12729103",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12729103",
                                "href": "/api/v2/nodes/12729103",
                                "method": "PUT",
                                "name": "Rename"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "delete"
                        ]
                    },
                    "12729323": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12729323",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12729323",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12729323",
                                "href": "/api/v2/nodes/12729323",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12729323",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12729323",
                                "href": "/api/v2/nodes/12729323",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12729323",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12760124": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12760124",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12760124",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12760124",
                                "href": "/api/v2/nodes/12760124",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12760124",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12760124",
                                "href": "/api/v2/nodes/12760124",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12760124",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12767273": {
                        "data": {
                            "addversion": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12767273/versions",
                                "method": "POST",
                                "name": "Add Version"
                            },
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12767273",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12767273",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "edit": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "func=Edit.Edit&nodeid=12767273&uiType=2",
                                "method": "GET",
                                "name": "Edit"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12767273",
                                "href": "/api/v2/nodes/12767273",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12767273",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12767273",
                                "href": "/api/v2/nodes/12767273",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12767273",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "edit",
                            "addversion",
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12775303": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12775303",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12775303",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12775303",
                                "href": "/api/v2/nodes/12775303",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12775303",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12775303",
                                "href": "/api/v2/nodes/12775303",
                                "method": "PUT",
                                "name": "Rename"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "delete"
                        ]
                    },
                    "12820733": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12820733",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12820733",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12820733",
                                "href": "/api/v2/nodes/12820733",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12820733",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12820733",
                                "href": "/api/v2/nodes/12820733",
                                "method": "PUT",
                                "name": "Rename"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "delete"
                        ]
                    },
                    "12821068": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12821068",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12821068",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12821068",
                                "href": "/api/v2/nodes/12821068",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12821068",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12821068",
                                "href": "/api/v2/nodes/12821068",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12821068",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12821173": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12821173",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12821173",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12821173",
                                "href": "/api/v2/nodes/12821173",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12821173",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12821173",
                                "href": "/api/v2/nodes/12821173",
                                "method": "PUT",
                                "name": "Rename"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "delete"
                        ]
                    },
                    "12821505": {
                        "data": {
                            "addversion": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12821505/versions",
                                "method": "POST",
                                "name": "Add Version"
                            },
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12821505",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12821505",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12821505",
                                "href": "/api/v2/nodes/12821505",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12821505",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12821505",
                                "href": "/api/v2/nodes/12821505",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12821505",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "open",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "addversion",
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12852193": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12852193",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12852193",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12852193",
                                "href": "/api/v2/nodes/12852193",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12852193",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12852193",
                                "href": "/api/v2/nodes/12852193",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12852193",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12863083": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12863083",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12863083",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12863083",
                                "href": "/api/v2/nodes/12863083",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12863083",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12863083",
                                "href": "/api/v2/nodes/12863083",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12863083",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    },
                    "12863085": {
                        "data": {
                            "copy": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/copy?id=12863085",
                                "href": "/api/v2/nodes",
                                "method": "POST",
                                "name": "Copy"
                            },
                            "delete": {
                                "body": "",
                                "content_type": "",
                                "form_href": "",
                                "href": "/api/v2/nodes/12863085",
                                "method": "DELETE",
                                "name": "Delete"
                            },
                            "move": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/move?id=12863085",
                                "href": "/api/v2/nodes/12863085",
                                "method": "PUT",
                                "name": "Move"
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
                                "href": "/api/v2/nodes/12863085",
                                "method": "GET",
                                "name": "Properties"
                            },
                            "rename": {
                                "body": "",
                                "content_type": "",
                                "form_href": "/api/v2/forms/nodes/rename?id=12863085",
                                "href": "/api/v2/nodes/12863085",
                                "method": "PUT",
                                "name": "Rename"
                            },
                            "reserve": {
                                "body": "reserved_user_id=1000",
                                "content_type": "application/x-www-form-urlencoded",
                                "form_href": "",
                                "href": "/api/v2/nodes/12863085",
                                "method": "PUT",
                                "name": "Reserve"
                            }
                        },
                        "map": {
                            "default_action": "",
                            "more": [
                                "properties"
                            ]
                        },
                        "order": [
                            "rename",
                            "copy",
                            "move",
                            "permissions",
                            "reserve",
                            "delete"
                        ]
                    }
                }
            }
          })),
          mocks.push(mockjax({
            url: new RegExp('^//server/otcs/cs/api/v2/nodes/391383.*actions=editpermissions'),
            responseTime: 5,
            type: 'GET',
            responseText: {
                "links": {
                    "data": {
                        "self": {
                            "body": "",
                            "content_type": "",
                            "href": "/api/v2/nodes/391383?actions=open&actions=download&fields=properties",
                            "method": "GET",
                            "name": ""
                        }
                    }
                },
                "results": {
                    "actions": {
                        "data": {},
                        "map": {
                            "default_action": ""
                        },
                        "order": []
                    },
                    "data": {
                        "properties": {
                            "container": false,
                            "container_size": 0,
                            "create_date": "2015-12-27T23:12:33",
                            "create_user_id": 1000,
                            "description": "",
                            "description_multilingual": {
                                "de_DE": "",
                                "en": "",
                                "ja": ""
                            },
                            "external_create_date": null,
                            "external_identity": "",
                            "external_identity_type": "",
                            "external_modify_date": null,
                            "external_source": "",
                            "favorite": false,
                            "id": 391383,
                            "mime_type": null,
                            "modify_date": "2018-12-03T18:21:35",
                            "modify_user_id": 1000,
                            "name": "Demo_Saved_query",
                            "name_multilingual": {
                                "de_DE": "",
                                "en": "Demo_Saved_query",
                                "ja": ""
                            },
                            "owner": "istrator, Admin",
                            "owner_group_id": 1001,
                            "owner_user_id": 1000,
                            "parent_id": 386124,
                            "permissions_model": "advanced",
                            "reserved": false,
                            "reserved_date": null,
                            "reserved_shared_collaboration": false,
                            "reserved_user_id": 0,
                            "size": 2316,
                            "size_formatted": "1 Source",
                            "type": 258,
                            "type_name": "Search Query",
                            "versions_control_advanced": true,
                            "volume_id": -2000,
                            "wnd_comments": null
                        }
                    }
                }
            }
          })),

          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/volumes/141?expand=node',
            responseTime: 0,
            type: 'GET',
            responseText: MockData.Enterprise
          })),

          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/volumes/142?expand=node',
            responseTime: 0,
            type: 'GET',
            responseText: MockData.Personal
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
