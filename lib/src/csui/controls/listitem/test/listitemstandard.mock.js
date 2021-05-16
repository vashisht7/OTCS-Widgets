/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/accessed?*',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/accessed?actions=open&actions=download&actions=initiateworkflow&actions=openform&expand=properties{parent_id,reserved_user_id}&fields=properties{container,id,name,original_id,type,type_name,parent_id,reserved,custom_view_search,version_number}&fields=versions{mime_type}.element(0)&state=true",
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
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 25,
                    "create_date": "2016-06-01T13:37:56",
                    "create_user_id": 1000,
                    "description": "gh",
                    "description_multilingual": {
                      "de_DE": "",
                      "en": "gh",
                      "en_IN": "",
                      "ja": "ddddd hhhh fffff fffff",
                      "ko_KR": ""
                    },
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "hidden": false,
                    "id": 749454,
                    "mime_type": null,
                    "modify_date": "2019-05-29T17:30:41",
                    "modify_user_id": 1000,
                    "name": "00_Aihua's Folder",
                    "name_multilingual": {
                      "de_DE": "Aihua's folder",
                      "en": "00_Aihua's Folder",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 24788538,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 25,
                    "size_formatted": "25 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_comments": 3
                  },
                  "reserved": true,
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
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 4,
                    "create_date": "2017-02-27T03:26:59",
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
                    "id": 1852695,
                    "mime_type": null,
                    "modify_date": "2019-11-10T21:06:09",
                    "modify_user_id": 1000,
                    "name": "amrut",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "amrut",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
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
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_att_14txsx_2": false,
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
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 4,
                    "create_date": "2018-02-06T20:04:28",
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
                    "id": 12024122,
                    "mime_type": null,
                    "modify_date": "2018-03-07T01:18:20",
                    "modify_user_id": 1000,
                    "name": "mandatory cats",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "",
                      "en_IN": "",
                      "ja": "mandatory cats",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
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
                    "versionable": false,
                    "versions_control_advanced": false,
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
                  "initiateworkflow": {
                    "body": "initiate_in_smartview",
                    "content_type": "",
                    "form_href": "",
                    "href": "",
                    "method": "",
                    "name": ""
                  }
                },
                "map": {
                  "default_action": "initiateworkflow"
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "id": 11842297,
                  "name": "WF_ReadOnly_MulitValue",
                  "parent_id": 10364169,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 18,
                    "create_date": "2017-12-07T00:43:23",
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
                    "id": 10364169,
                    "mime_type": null,
                    "modify_date": "2019-05-01T19:21:35",
                    "modify_user_id": 1000,
                    "name": "apirke_Examples",
                    "name_multilingual": {
                      "de_DE": "apirke_Examples",
                      "en": "apirke_Examples",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
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
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_comments": null
                  },
                  "reserved": false,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T19:23:15"
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
                  }
                },
                "map": {
                  "default_action": "initiateworkflow"
                },
                "order": [
                  "initiateworkflow"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "id": 10364424,
                  "name": "WF_Review",
                  "parent_id": 10364169,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 18,
                    "create_date": "2017-12-07T00:43:23",
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
                    "id": 10364169,
                    "mime_type": null,
                    "modify_date": "2019-05-01T19:21:35",
                    "modify_user_id": 1000,
                    "name": "apirke_Examples",
                    "name_multilingual": {
                      "de_DE": "apirke_Examples",
                      "en": "apirke_Examples",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
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
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_comments": null
                  },
                  "reserved": false,
                  "type": 128,
                  "type_name": "Initiate Workflow"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T19:16:15"
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
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 25,
                    "create_date": "2016-06-01T13:37:56",
                    "create_user_id": 1000,
                    "description": "gh",
                    "description_multilingual": {
                      "de_DE": "",
                      "en": "gh",
                      "en_IN": "",
                      "ja": "ddddd hhhh fffff fffff",
                      "ko_KR": ""
                    },
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "hidden": false,
                    "id": 749454,
                    "mime_type": null,
                    "modify_date": "2019-05-29T17:30:41",
                    "modify_user_id": 1000,
                    "name": "00_Aihua's Folder",
                    "name_multilingual": {
                      "de_DE": "Aihua's folder",
                      "en": "00_Aihua's Folder",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 24788538,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 25,
                    "size_formatted": "25 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
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
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 2,
                    "create_date": "2018-03-06T11:11:33",
                    "create_user_id": 1000,
                    "description": "7878",
                    "description_multilingual": null,
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "hidden": false,
                    "id": 12729103,
                    "mime_type": null,
                    "modify_date": "2019-08-12T19:00:55",
                    "modify_user_id": 1000,
                    "name": "000_subfolder",
                    "name_multilingual": null,
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 749454,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 2,
                    "size_formatted": "2 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versionable": null,
                    "versions_control_advanced": false,
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
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 81,
                    "create_date": "2016-05-13T01:29:53",
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
                    "id": 616849,
                    "mime_type": null,
                    "modify_date": "2019-10-30T17:52:23",
                    "modify_user_id": 1000,
                    "name": "000 Hyderabad",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "000 Hyderabad",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 2004,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 81,
                    "size_formatted": "81 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
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
                  "id": 12724705,
                  "name": "CategoryOrderCopyMetadata1",
                  "parent_id": 616849,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 81,
                    "create_date": "2016-05-13T01:29:53",
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
                    "id": 616849,
                    "mime_type": null,
                    "modify_date": "2019-10-30T17:52:23",
                    "modify_user_id": 1000,
                    "name": "000 Hyderabad",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "000 Hyderabad",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 2004,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 81,
                    "size_formatted": "81 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "reserved": false,
                  "type": 131,
                  "type_name": "Category"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T05:38:47"
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
                  "id": 12725145,
                  "name": "CategoryOrderCopyMetadata",
                  "parent_id": 616849,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 81,
                    "create_date": "2016-05-13T01:29:53",
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
                    "id": 616849,
                    "mime_type": null,
                    "modify_date": "2019-10-30T17:52:23",
                    "modify_user_id": 1000,
                    "name": "000 Hyderabad",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "000 Hyderabad",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 2004,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 81,
                    "size_formatted": "81 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "reserved": false,
                  "type": 131,
                  "type_name": "Category"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T05:24:43"
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
                  "id": 2387152,
                  "name": "000TKL_DTKL_OS",
                  "parent_id": 616849,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 81,
                    "create_date": "2016-05-13T01:29:53",
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
                    "id": 616849,
                    "mime_type": null,
                    "modify_date": "2019-10-30T17:52:23",
                    "modify_user_id": 1000,
                    "name": "000 Hyderabad",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "000 Hyderabad",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 2004,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 81,
                    "size_formatted": "81 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "reserved": false,
                  "type": 131,
                  "type_name": "Category"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T05:13:35"
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
                  "id": 10044623,
                  "name": "00 TKL category",
                  "parent_id": 8004436,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 26,
                    "create_date": "2017-09-15T04:12:36",
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
                    "id": 8004436,
                    "mime_type": null,
                    "modify_date": "2019-11-04T22:28:35",
                    "modify_user_id": 1000,
                    "name": "000 A TKL COMBO",
                    "name_multilingual": {
                      "de_DE": "000 A TKL COMBO",
                      "en": "",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 616849,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 26,
                    "size_formatted": "26 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "reserved": false,
                  "type": 131,
                  "type_name": "Category"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T05:12:53"
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
                    "href": "/api/v2/nodes/11517637/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/11517637/content",
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
                  "id": 11517637,
                  "name": "Chrysanthemum-up123.jpg",
                  "parent_id": 12580980,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 12,
                    "create_date": "2018-03-01T01:10:02",
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
                    "id": 12580980,
                    "mime_type": null,
                    "modify_date": "2019-11-10T21:07:50",
                    "modify_user_id": 1000,
                    "name": "renamed - empty folder",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "",
                      "en_IN": "",
                      "ja": "renamed - empty folder",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 11995091,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 12,
                    "size_formatted": "12 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_att_14txsx_2": false
                  },
                  "reserved": false,
                  "type": 144,
                  "type_name": "Document"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T00:44:19"
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
                "data": {},
                "map": {
                  "default_action": ""
                },
                "order": []
              },
              "data": {
                "properties": {
                  "container": false,
                  "id": 12716233,
                  "name": "tklwithset",
                  "parent_id": 8004436,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 26,
                    "create_date": "2017-09-15T04:12:36",
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
                    "id": 8004436,
                    "mime_type": null,
                    "modify_date": "2019-11-04T22:28:35",
                    "modify_user_id": 1000,
                    "name": "000 A TKL COMBO",
                    "name_multilingual": {
                      "de_DE": "000 A TKL COMBO",
                      "en": "",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 616849,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 26,
                    "size_formatted": "26 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "reserved": false,
                  "type": 131,
                  "type_name": "Category"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T00:11:45"
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
                  "id": 12716563,
                  "name": "testtkl",
                  "parent_id": 8004436,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 26,
                    "create_date": "2017-09-15T04:12:36",
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
                    "id": 8004436,
                    "mime_type": null,
                    "modify_date": "2019-11-04T22:28:35",
                    "modify_user_id": 1000,
                    "name": "000 A TKL COMBO",
                    "name_multilingual": {
                      "de_DE": "000 A TKL COMBO",
                      "en": "",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 616849,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 26,
                    "size_formatted": "26 Items",
                    "type": 132,
                    "type_name": "Category Folder",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "reserved": false,
                  "type": 131,
                  "type_name": "Category"
                },
                "properties_user": {
                  "access_date_last": "2018-03-06T00:11:35"
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
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/actions',
        responseTime: 0,
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
            "21487326": {
              "data": {
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/21487326",
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
            }
          }
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
