/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';

  _.extend($.mockjaxSettings, {
    responseTime: 0,
    headers: {}
  });

  var enterpriseVolume = {
    "id": 2000,
    "name": "Enterprise",
    "type": 141
  };
  var personalVolume = {
    "id": 2004,
    "name": "Personal",
    "type": 142
  };
  var categoriesVolume = {
    "id": 2006,
    "name": "Categories",
    "type": 133
  };
  var perspectiveAssetsVolume = {
    "id": 2007,
    "name": "Perspective Assets",
    "type": 954
  };

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members/1000/photo',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 404;
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/validation/nodes',
        responseTime: 5,
        type: 'POST',
        response: function () {
          this.status = 200;
          this.responseText =
          {"results": [{"id": null, "name": "download.jpg", "type": 144, "versioned": true}]};
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=109661',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
          {"token": "1000\/182623\/158049\/15589\/7f6f59393680830f4a04677d617abae15a9ae3c3"};
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=11111',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
          {"token": "1000\/182623\/158049\/15589\/7f6f59393680830f4a04677d617abae15a9ae3c3"};
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2006/ancestors',
        responseTime: 0,
        responseText: {
          "ancestors": [{
            "id": 2006,
            "name": "Content Server Categories",
            "volume_id": -2006,
            "parent_id": -1,
            "type": 133,
            "type_name": "Categories Volume"
          }]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2006?fields=properties',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/2006?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "container": true,
                "container_size": 26,
                "create_date": "2016-12-13T16:03:47",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"en_IN": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2006,
                "mime_type": null,
                "modify_date": "2017-05-05T16:56:04",
                "modify_user_id": 1000,
                "name": "Content Server Categories",
                "name_multilingual": {"en_IN": "Content Server Categories"},
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 26,
                "size_formatted": "26 Items",
                "type": 133,
                "type_name": "Categories Volume",
                "versions_control_advanced": true,
                "volume_id": -2006
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2006/nodes?fields=properties&expand=properties%7Boriginal_id%2Cparent_id%7D&actions=default&limit=30&page=1&sort=asc_name&where_type=131&where_type=-1',
        responseTime: 0,
        responseText: {
          "collection": {
            "filtering": {
              "filter": [{
                "key": "where_type",
                "value": 131
              }, {
                "key": "where_type",
                "value": -1
              }]
            },
            "paging": {
              "limit": 30,
              "links": {
                "data": {
                  "next": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/nodes\/2006\/nodes?expand=properties{original_id,parent_id}&fields=properties&limit=30&page=2&sort=asc_name",
                    "method": "GET",
                    "name": "Next"
                  }
                }
              },
              "page": 1,
              "page_total": 4,
              "range_max": 30,
              "range_min": 1,
              "total_count": 103
            },
            "sorting": {
              "sort": [{
                "key": "sort",
                "value": "asc_name"
              }]
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/2006\/nodes?expand=properties{original_id,parent_id}&fields=properties&limit=30&page=1&sort=asc_name",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [{
            "data": {
              "properties": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 3,
                "create_date": "2019-06-11T11:29:01Z",
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
                "id": 28830457,
                "mime_type": null,
                "modify_date": "2019-06-18T05:49:46Z",
                "modify_user_id": 1000,
                "name": "$$ Demo categories $$",
                "name_multilingual": {
                  "en": "$$ Demo categories $$"
                },
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2006,
                "parent_id_expand": {
                  "advanced_versioning": null,
                  "container": true,
                  "container_size": 103,
                  "create_date": "2003-10-01T23:30:55Z",
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
                  "id": 2006,
                  "mime_type": null,
                  "modify_date": "2019-06-20T19:05:19Z",
                  "modify_user_id": 1000,
                  "name": "Categories Volume",
                  "name_multilingual": {
                    "de_DE": "",
                    "en": "Categories Volume",
                    "en_IN": "",
                    "ja": "",
                    "ko_KR": ""
                  },
                  "owner": "Admin",
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "parent_id": -1,
                  "permissions_model": "advanced",
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_shared_collaboration": false,
                  "reserved_user_id": 0,
                  "size": 103,
                  "size_formatted": "103 Items",
                  "type": 133,
                  "type_name": "Categories Volume",
                  "versionable": false,
                  "versions_control_advanced": false,
                  "volume_id": -2004
                },
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 3,
                "size_formatted": "3 Items",
                "type": 132,
                "type_name": "Category Folder",
                "versionable": null,
                "versions_control_advanced": false,
                "volume_id": -2004
              }
            }
          }, {
            "data": {
              "properties": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 3,
                "create_date": "2019-06-03T08:40:45Z",
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
                "id": 28548529,
                "mime_type": null,
                "modify_date": "2019-06-03T08:47:11Z",
                "modify_user_id": 1000,
                "name": "$$ TKL Performance test $$",
                "name_multilingual": {
                  "en": "$$ TKL Performance test $$"
                },
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2006,
                "parent_id_expand": {
                  "advanced_versioning": null,
                  "container": true,
                  "container_size": 103,
                  "create_date": "2003-10-01T23:30:55Z",
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
                  "id": 2006,
                  "mime_type": null,
                  "modify_date": "2019-06-20T19:05:19Z",
                  "modify_user_id": 1000,
                  "name": "Categories Volume",
                  "name_multilingual": {
                    "de_DE": "",
                    "en": "Categories Volume",
                    "en_IN": "",
                    "ja": "",
                    "ko_KR": ""
                  },
                  "owner": "Admin",
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "parent_id": -1,
                  "permissions_model": "advanced",
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_shared_collaboration": false,
                  "reserved_user_id": 0,
                  "size": 103,
                  "size_formatted": "103 Items",
                  "type": 133,
                  "type_name": "Categories Volume",
                  "versionable": false,
                  "versions_control_advanced": false,
                  "volume_id": -2004
                },
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 3,
                "size_formatted": "3 Items",
                "type": 132,
                "type_name": "Category Folder",
                "versionable": null,
                "versions_control_advanced": false,
                "volume_id": -2004
              }
            }
          },
            {
              "data": {
                "properties": {
                  "advanced_versioning": null,
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-07-29T13:06:57",
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
                  "hidden": false,
                  "id": 66666,
                  "mime_type": null,
                  "modify_date": "2018-10-09T00:01:35",
                  "modify_user_id": 1000,
                  "name": "All Cat Attributes",
                  "name_multilingual": {
                    "en": "All Cat Attributes"
                  },
                  "owner": "Admin",
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "parent_id": 2004,
                  "parent_id_expand": {
                    "advanced_versioning": null,
                    "container": true,
                    "container_size": 109,
                    "create_date": "2003-10-01T13:30:55",
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
                    "id": 2004,
                    "mime_type": null,
                    "modify_date": "2019-09-24T17:50:29",
                    "modify_user_id": 1000,
                    "name": "Categories volume",
                    "name_multilingual": {
                      "de_DE": "",
                      "en": "Categories volume",
                      "en_IN": "",
                      "ja": "",
                      "ko_KR": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": -1,
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "size": 109,
                    "size_formatted": "109 Items",
                    "type": 133,
                    "type_name": "Categories Volume",
                    "versionable": false,
                    "versions_control_advanced": false,
                    "volume_id": -2004
                  },
                  "permissions_model": "advanced",
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_shared_collaboration": false,
                  "reserved_user_id": 0,
                  "size": 7802,
                  "size_formatted": "",
                  "type": 131,
                  "type_name": "Category",
                  "versionable": null,
                  "versions_control_advanced": false,
                  "volume_id": -2004
                }
              }
            }]
        }
      }));

      var childrenOf2006 = {
        "data": [{
          "volume_id": {
            "container": true,
            "container_size": 26,
            "create_date": "2016-12-13T16:03:47",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"en_IN": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/img\/webattribute\/16vol_categories.gif",
            "icon_large": "\/img\/webattribute\/16vol_categories_large.gif",
            "id": 2006,
            "modify_date": "2017-05-05T16:56:04",
            "modify_user_id": 1000,
            "name": "Content Server Categories",
            "name_multilingual": {"en_IN": "Content Server Categories"},
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 133,
            "type_name": "Categories Volume",
            "versions_control_advanced": true,
            "volume_id": -2006
          },
          "id": 84943,
          "parent_id": {
            "container": true,
            "container_size": 26,
            "create_date": "2016-12-13T16:03:47",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"en_IN": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/img\/webattribute\/16vol_categories.gif",
            "icon_large": "\/img\/webattribute\/16vol_categories_large.gif",
            "id": 2006,
            "modify_date": "2017-05-05T16:56:04",
            "modify_user_id": 1000,
            "name": "Content Server Categories",
            "name_multilingual": {"en_IN": "Content Server Categories"},
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 133,
            "type_name": "Categories Volume",
            "versions_control_advanced": true,
            "volume_id": -2006
          },
          "name": "Dummy Category",
          "type": 131,
          "description": "",
          "create_date": "2017-04-26T09:45:37",
          "modify_date": "2017-04-26T12:00:04",
          "reserved": false,
          "reserved_user_id": 0,
          "reserved_date": null,
          "icon": "\/img\/webattribute\/16category.gif",
          "mime_type": null,
          "original_id": 0,
          "type_name": "Category",
          "container": false,
          "size": 1474,
          "perm_see": true,
          "perm_see_contents": true,
          "perm_modify": true,
          "perm_modify_attributes": true,
          "perm_modify_permissions": true,
          "perm_create": true,
          "perm_delete": true,
          "perm_delete_versions": true,
          "perm_reserve": true,
          "favorite": false,
          "size_formatted": "",
          "reserved_user_login": null,
          "action_url": "\/v1\/actions\/84943",
          "parent_id_url": "\/v1\/nodes\/2006",
          "commands": {
            "copy": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "api\/v1\/forms\/nodes\/copy?id=84943",
              "method": "",
              "name": "Copy"
            },
            "delete": {
              "body": "",
              "content_type": "",
              "href": "api\/v1\/nodes\/84943",
              "href_form": "",
              "method": "DELETE",
              "name": "Delete"
            },
            "move": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "api\/v1\/forms\/nodes\/move?id=84943",
              "method": "",
              "name": "Move"
            },
            "properties": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "",
              "method": "",
              "name": "Properties"
            },
            "properties_audit": {
              "body": "",
              "content_type": "",
              "href": "api\/v1\/nodes\/84943\/audit?limit=1000",
              "href_form": "",
              "method": "GET",
              "name": "Audit"
            },
            "properties_categories": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "",
              "method": "",
              "name": "Categories"
            },
            "properties_general": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "api\/v1\/forms\/nodes\/properties\/general?id=84943",
              "method": "",
              "name": "General"
            },
            "rename": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "\/api\/v1\/forms\/nodes\/rename?id=84943",
              "method": "",
              "name": "Rename"
            },
            "reserve": {
              "body": "reserved_user_id=1000",
              "content_type": "application\/x-www-form-urlencoded",
              "href": "api\/v1\/nodes\/84943",
              "href_form": "",
              "method": "PUT",
              "name": "Reserve"
            }
          },
          "commands_map": {
            "properties": ["properties_general", "properties_audit", "properties_categories"]
          },
          "commands_order": ["rename", "copy", "move", "reserve", "delete", "properties"]
        }],
        "definitions": {
          "create_date": {
            "align": "center",
            "name": "Created",
            "persona": "",
            "type": -7,
            "width_weight": 0
          },
          "description": {
            "align": "left",
            "name": "Description",
            "persona": "",
            "type": -1,
            "width_weight": 100
          },
          "favorite": {
            "align": "center",
            "name": "Favorite",
            "persona": "",
            "type": 5,
            "width_weight": 0
          },
          "icon": {
            "align": "center",
            "name": "Icon",
            "persona": "",
            "type": -1,
            "width_weight": 0
          },
          "id": {"align": "left", "name": "ID", "persona": "node", "type": 2, "width_weight": 0},
          "mime_type": {
            "align": "left",
            "name": "MIME Type",
            "persona": "",
            "type": -1,
            "width_weight": 0
          },
          "modify_date": {
            "align": "left",
            "name": "Modified",
            "persona": "",
            "sort": true,
            "type": -7,
            "width_weight": 0
          },
          "name": {
            "align": "left",
            "name": "Name",
            "persona": "",
            "sort": true,
            "type": -1,
            "width_weight": 100
          },
          "original_id": {
            "align": "left",
            "name": "Original ID",
            "persona": "node",
            "type": 2,
            "width_weight": 0
          },
          "parent_id": {
            "align": "left",
            "name": "Parent ID",
            "persona": "node",
            "type": 2,
            "width_weight": 0
          },
          "reserved": {
            "align": "center",
            "name": "Reserve",
            "persona": "",
            "type": 5,
            "width_weight": 0
          },
          "reserved_date": {
            "align": "center",
            "name": "Reserved",
            "persona": "",
            "type": -7,
            "width_weight": 0
          },
          "reserved_user_id": {
            "align": "center",
            "name": "Reserved By",
            "persona": "member",
            "type": 2,
            "width_weight": 0
          },
          "size": {
            "align": "right",
            "name": "Size",
            "persona": "",
            "sort": true,
            "sort_key": "size",
            "type": 2,
            "width_weight": 0
          },
          "size_formatted": {
            "align": "right",
            "name": "Size",
            "persona": "",
            "sort": true,
            "sort_key": "size",
            "type": 2,
            "width_weight": 0
          },
          "type": {
            "align": "center",
            "name": "Type",
            "persona": "",
            "sort": true,
            "type": 2,
            "width_weight": 0
          },
          "volume_id": {
            "align": "left",
            "name": "VolumeID",
            "persona": "node",
            "type": 2,
            "width_weight": 0
          }
        },
        "definitions_map": {"name": ["menu"]},
        "definitions_order": ["type", "name", "size_formatted", "modify_date"],
        "limit": 30,
        "page": 1,
        "page_total": 1,
        "range_max": 26,
        "range_min": 1,
        "sort": "asc_name",
        "total_count": 26,
        "where_facet": [],
        "where_name": "",
        "where_type": [131, -1]
      };
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2006/nodes(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: childrenOf2006
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2006/nodes(?:\\?(.*))?$'),
        responseTime: 0,
        response: function () {
          var responseText = childrenOf2006;
          if (false) {
          } else {
            responseText = {
              results: responseText.data.map(getV2Node),
              collection: {
                paging: {
                  page: responseText.page,
                  limit: responseText.limit,
                  total_count: responseText.total_count,
                  page_total: responseText.page_total,
                  range_min: responseText.range_min,
                  range_max: responseText.range_max,
                },
                sorting: {
                  sort: [responseText.sort]
                }
              }
            };
          }

          return responseText;

          function getV2Node(node) {
            var columns = [
              {
                "key": "type",
                "name": "Type",
                "data_type": 2,
                "sortable": true
              },
              {
                "key": "name",
                "name": "Name",
                "data_type": -1,
                "sortable": true
              },
              {
                "key": "size",
                "name": "Size",
                "data_type": 2,
                "sortable": true
              }
            ];
            return {
              actions: getNodeActions(node),
              data: {
                columns: node.container && columns,
                properties: node
              },
              metadata: {
                properties: responseText.definitions
              }
            };
          }

          function getNodeActions(node) {
            var actions = {
              "0": [
                "browse"
              ],
              "141": [
                "browse"
              ]
            };
            return _.chain(actions[node.type] || [])
                .reduce(function (result, action) {
                  result[action] = {};
                  return result;
                }, {})
                .value();
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/nodes/11111\\?expand=(.*)$'),
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/11111?expand=properties%7Boriginal_id%7D&fields=properties&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "addversion": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/versions",
                  "method": "POST",
                  "name": "Add Version"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=11111",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "download": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/content?download",
                  "method": "GET",
                  "name": "Download"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=11111",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/content",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=11111",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "PUT",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=1000",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "PUT",
                  "name": "Reserve"
                }
              },
              "map": {"default_action": "open", "more": ["properties"]},
              "order": ["open", "download", "addversion", "rename", "copy", "move",
                "reserve", "delete"]
            },
            "data": {
              "properties": {
                "advanced_versioning": true,
                "container": false,
                "container_size": 0,
                "create_date": "2017-01-12T11:17:45",
                "create_user_id": 1000,
                "description": "\u4f60\u597d\uff0c\u4e16\u754c",
                "description_multilingual": {"en_IN": "\u4f60\u597d\uff0c\u4e16\u754c"},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "id": 11111,
                "mime_type": "application\/pdf",
                "modify_date": "2017-05-15T17:20:16",
                "modify_user_id": 1000,
                "name": "Comparison-Safety.pdf",
                "name_multilingual": {"en_IN": "react basic.pdf"},
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 41381,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 1244967,
                "size_formatted": "2 MB",
                "type": 144,
                "type_name": "Document",
                "versions_control_advanced": true,
                "volume_id": -2000,
                "wnd_comments": 0
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/(.+)/categories/(.+)/actions$'),
        responseTime: 0,
        responseText: {
          "data": {
            "categories_remove": "api\/v1\/nodes\/24400\/categories\/6390",
            "categories_update": "api\/v1\/forms\/nodes\/categories\/update?id=24400&category_id=6390"
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
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111',
        responseTime: 0,
        response: function () {
          return {
            "data": {"categories_add": "api\/v1\/forms\/nodes\/categories\/create?id=66666"},
            "definitions": {
              "categories_add": {
                "body": "",
                "content_type": "",
                "display_hint": "",
                "display_href": "",
                "handler": "node_picker_form",
                "image": "",
                "method": "GET",
                "name": "Add Categories",
                "parameters": {},
                "tab_href": ""
              }
            },
            "definitions_map": {},
            "definitions_order": ["categories_add"]
          };
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111/categories/66666/actions',
        responseTime: 0,
        response: function () {
          return {
            "data": {"categories_add": "api\/v1\/forms\/nodes\/categories\/create?id=66666"},
            "definitions": {
              "categories_add": {
                "body": "",
                "content_type": "",
                "display_hint": "",
                "display_href": "",
                "handler": "node_picker_form",
                "image": "",
                "method": "GET",
                "name": "Add Categories",
                "parameters": {},
                "tab_href": ""
              }
            },
            "definitions_map": {},
            "definitions_order": ["categories_add"]
          };
        }

      }));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/11111/categories/66667/actions',
            responseText: {
              "data": {
                "categories_remove": "api\/v1\/nodes\/11111\/categories\/66667",
                "categories_update": "api\/v1\/forms\/nodes\/categories\/update?id=11111&category_id=66667"
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
              "definitions_order": ["categories_remove", "categories_update"]
            }
          }
      ));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/11111\\?(.*)$'),
        responseTime: 0,
        responseText: {
          data: {
            container: false,
            container_size: 0,
            id: 11111,
            name: "Comparison-Safety.pdf",
            description: "This is a document from mockjax data on the client side.",
            mime_type: 'application/pdf',
            type: 144,
            type_name: "Document"
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/5869/versions/8/promote',
        responseTime: 0,
        responseText: {
          "links": {
              "data": {
                  "self": {
                      "body": "",
                      "content_type": "",
                      "href": "\/api\/v2\/nodes\/5869\/versions\/8\/promote",
                      "method": "POST",
                      "name": ""
                  }
              }
          },
          "results": {
              "data": {
                  "properties": {
                      "advanced_versioning": true,
                      "container": false,
                      "container_size": 0,
                      "create_date": "2019-11-29T11:20:23",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                          "en_IN": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": "2019-11-26T15:04:54",
                      "external_source": "file_system",
                      "favorite": false,
                      "hidden": false,
                      "id": 5869,
                      "mime_type": "text\/plain",
                      "modify_date": "2019-12-20T14:35:17",
                      "modify_user_id": 5868,
                      "name": "1257px-ISS_configuration_2017-06_en.svg.png",
                      "name_multilingual": {
                          "en_IN": "1257px-ISS_configuration_2017-06_en.svg.png"
                      },
                      "owner": "Admin",
                      "owner_group_id": 999,
                      "owner_user_id": 1000,
                      "parent_id": 2000,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 3286,
                      "size_formatted": "4 KB",
                      "type": 144,
                      "type_name": "Document",
                      "versionable": true,
                      "versions_control_advanced": false,
                      "volume_id": -2000
                  },
                  "versions": {
                      "create_date": "2019-12-23T11:49:00",
                      "description": null,
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "file_create_date": "2019-12-20T14:35:17",
                      "file_modify_date": "2019-12-20T14:35:17",
                      "file_name": "CSUI.txt",
                      "file_size": 3286,
                      "file_type": "txt",
                      "id": 5869,
                      "locked": false,
                      "locked_date": null,
                      "locked_user_id": null,
                      "mime_type": "text\/plain",
                      "modify_date": "2019-12-23T11:49:00",
                      "name": "CSUI.txt",
                      "owner_id": 1000,
                      "provider_id": 17449,
                      "version_id": 16803,
                      "version_number": 9,
                      "version_number_major": 3,
                      "version_number_minor": 0,
                      "version_number_name": "3.0"
                  }
              }
          }
      }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/5869/versions/9\\?(.*)$'),
        responseTime: 0,
        responseText: {
          "links": {
              "data": {
                  "self": {
                      "body": "",
                      "content_type": "",
                      "href": "\/api\/v2\/nodes\/5869\/versions\/9?expand=user&expand=versions{id,owner_id}",
                      "method": "GET",
                      "name": ""
                  }
              }
          },
          "results": {
              "data": {
                  "versions": {
                      "create_date": "2019-12-23T11:49:00",
                      "description": null,
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "file_create_date": "2019-12-20T14:35:17",
                      "file_modify_date": "2019-12-20T14:35:17",
                      "file_name": "CSUI.txt",
                      "file_size": 3286,
                      "file_type": "txt",
                      "id": 5869,
                      "id_expand": {
                          "advanced_versioning": true,
                          "container": false,
                          "container_size": 0,
                          "create_date": "2019-11-29T11:20:23",
                          "create_user_id": 1000,
                          "description": "",
                          "description_multilingual": {
                              "en_IN": ""
                          },
                          "external_create_date": null,
                          "external_identity": "",
                          "external_identity_type": "",
                          "external_modify_date": "2019-11-26T15:04:54",
                          "external_source": "file_system",
                          "favorite": false,
                          "hidden": false,
                          "id": 5869,
                          "mime_type": "text\/plain",
                          "modify_date": "2019-12-23T11:49:00",
                          "modify_user_id": 1000,
                          "name": "1257px-ISS_configuration_2017-06_en.svg.png",
                          "name_multilingual": {
                              "en_IN": "1257px-ISS_configuration_2017-06_en.svg.png"
                          },
                          "owner": "Admin",
                          "owner_group_id": 999,
                          "owner_user_id": 1000,
                          "parent_id": 2000,
                          "permissions_model": "advanced",
                          "reserved": false,
                          "reserved_date": null,
                          "reserved_shared_collaboration": false,
                          "reserved_user_id": 0,
                          "size": 3286,
                          "size_formatted": "4 KB",
                          "type": 144,
                          "type_name": "Document",
                          "versionable": true,
                          "versions_control_advanced": false,
                          "volume_id": -2000
                      },
                      "locked": false,
                      "locked_date": null,
                      "locked_user_id": null,
                      "mime_type": "text\/plain",
                      "modify_date": "2019-12-23T11:49:00",
                      "name": "CSUI.txt",
                      "owner_id": 1000,
                      "owner_id_expand": {
                          "birth_date": null,
                          "business_email": null,
                          "business_fax": null,
                          "business_phone": null,
                          "cell_phone": null,
                          "deleted": false,
                          "display_language": null,
                          "first_name": null,
                          "gender": null,
                          "group_id": 999,
                          "home_address_1": null,
                          "home_address_2": null,
                          "home_fax": null,
                          "home_phone": null,
                          "id": 1000,
                          "initials": "A",
                          "last_name": null,
                          "middle_name": null,
                          "name": "Admin",
                          "name_formatted": "Admin",
                          "office_location": null,
                          "pager": null,
                          "personal_email": null,
                          "personal_interests": null,
                          "personal_url_1": null,
                          "personal_url_2": null,
                          "personal_url_3": null,
                          "personal_website": null,
                          "photo_id": null,
                          "photo_url": null,
                          "time_zone": null,
                          "title": null,
                          "type": 0,
                          "type_name": "User"
                      },
                      "provider_id": 17449,
                      "version_id": 16803,
                      "version_number": 9,
                      "version_number_major": 3,
                      "version_number_minor": 0,
                      "version_number_name": "3.0"
                  }
              }
          }
      }
      }));


      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/11111/versions\\?(.*)$'),
        responseTime: 0,
        responseText: {
          "data": [{
              "create_date": "2019-11-29T11:20:23",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": "2019-11-26T15:04:54",
              "external_source": "file_system",
              "file_create_date": "2019-11-29T11:20:22",
              "file_modify_date": "2019-11-26T15:04:54",
              "file_name": "1257px-ISS_configuration_2017-06_en.svg.png",
              "file_size": 285915,
              "file_type": "png",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image\/png",
              "modify_date": "2019-11-29T11:20:23",
              "name": "1257px-ISS_configuration_2017-06_en.svg.png",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 999,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/1000\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 5869,
              "version_id": 5869,
              "version_number": 1,
              "version_number_major": 0,
              "version_number_minor": 1,
              "version_number_name": "0.1",
              "file_size_formatted": "280 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/1",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/1\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/1\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=1",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=1",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T11:33:37",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T11:33:37",
              "file_modify_date": "2019-12-20T11:33:37",
              "file_name": "CSUI.txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T11:33:37",
              "name": "CSUI.txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 999,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/1000\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 16898,
              "version_id": 16899,
              "version_number": 2,
              "version_number_major": 1,
              "version_number_minor": 0,
              "version_number_name": "1.0",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/2",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/2\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/2\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=2",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=2",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T11:33:52",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T11:33:52",
              "file_modify_date": "2019-12-20T11:33:52",
              "file_name": "CSUI (2).txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T11:33:52",
              "name": "CSUI (2).txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 999,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/1000\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 17670,
              "version_id": 17671,
              "version_number": 3,
              "version_number_major": 1,
              "version_number_minor": 1,
              "version_number_name": "1.1",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/3",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/3\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/3\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=3",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=3",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T12:36:32",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T12:36:32",
              "file_modify_date": "2019-12-20T12:36:32",
              "file_name": "CSUI.txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T12:36:32",
              "name": "CSUI.txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 5868,
                  "last_name": null,
                  "middle_name": null,
                  "name": "gundetiv",
                  "name_formatted": "gundetiv",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/5868\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 16901,
              "version_id": 16902,
              "version_number": 4,
              "version_number_major": 1,
              "version_number_minor": 2,
              "version_number_name": "1.2",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/4",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/4\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/4\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=4",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=4",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T14:33:18",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T14:33:18",
              "file_modify_date": "2019-12-20T14:33:18",
              "file_name": "CSUI (2).txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T14:33:18",
              "name": "CSUI (2).txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 999,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/1000\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 16910,
              "version_id": 16911,
              "version_number": 5,
              "version_number_major": 2,
              "version_number_minor": 0,
              "version_number_name": "2.0",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/5",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/5\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/5\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=5",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=5",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T14:33:55",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T14:33:55",
              "file_modify_date": "2019-12-20T14:33:55",
              "file_name": "CSUI (2).txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T14:33:55",
              "name": "CSUI (2).txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 999,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/1000\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 17008,
              "version_id": 17009,
              "version_number": 6,
              "version_number_major": 2,
              "version_number_minor": 1,
              "version_number_name": "2.1",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/6",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/6\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/6\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=6",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=6",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T14:34:16",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T14:34:16",
              "file_modify_date": "2019-12-20T14:34:16",
              "file_name": "CSUI (2).txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T14:34:16",
              "name": "CSUI (2).txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 999,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/1000\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 16913,
              "version_id": 16914,
              "version_number": 7,
              "version_number_major": 2,
              "version_number_minor": 2,
              "version_number_name": "2.2",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/7",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/7\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/7\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=7",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=7",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }, {
              "create_date": "2019-12-20T14:35:17",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-12-20T14:35:17",
              "file_modify_date": "2019-12-20T14:35:17",
              "file_name": "CSUI.txt",
              "file_size": 3286,
              "file_type": "txt",
              "id": 5869,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text\/plain",
              "modify_date": "2019-12-20T14:35:17",
              "name": "CSUI.txt",
              "owner_id": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_language": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 5868,
                  "last_name": null,
                  "middle_name": null,
                  "name": "gundetiv",
                  "name_formatted": "gundetiv",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": "api\/v1\/members\/5868\/photo",
                  "privilege_grant_discovery": null,
                  "privilege_login": null,
                  "privilege_modify_groups": null,
                  "privilege_modify_users": null,
                  "privilege_public_access": null,
                  "privilege_system_admin_rights": null,
                  "privilege_user_admin_rights": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
              },
              "provider_id": 17449,
              "version_id": 17450,
              "version_number": 8,
              "version_number_major": 2,
              "version_number_minor": 3,
              "version_number_name": "2.3",
              "file_size_formatted": "4 KB",
              "provider_name": "Default(Database Storage)",
              "commands": {
                  "versions_delete": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/8",
                      "href_form": "",
                      "method": "DELETE",
                      "name": "Delete"
                  },
                  "versions_download": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/8\/content?action=download",
                      "href_form": "",
                      "method": "GET",
                      "name": "Download"
                  },
                  "versions_open": {
                      "body": "",
                      "content_type": "",
                      "href": "api\/v1\/nodes\/5869\/versions\/8\/content?action=open",
                      "href_form": "",
                      "method": "GET",
                      "name": "Open"
                  },
                  "versions_properties": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "",
                      "method": "",
                      "name": "Properties"
                  },
                  "versions_properties_versions_general": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/general?id=5869&version_number=8",
                      "method": "",
                      "name": "General"
                  },
                  "versions_properties_versions_specific": {
                      "body": "",
                      "content_type": "",
                      "href": "",
                      "href_form": "api\/v1\/forms\/nodes\/versions\/properties\/specific?id=5869&version_number=8",
                      "method": "",
                      "name": "Specific"
                  }
              },
              "commands_order": ["versions_open", "versions_download", "versions_delete", "versions_properties"],
              "commands_map": {
                  "versions_properties": ["versions_properties_versions_general", "versions_properties_versions_specific"]
              }
          }],
          "definitions": {
              "create_date": {
                  "key": "create_date",
                  "name": "Created",
                  "persona": "",
                  "type": -7
              },
              "description": {
                  "key": "description",
                  "name": "Description",
                  "persona": "",
                  "type": -1
              },
              "external_create_date": {
                  "key": "external_create_date",
                  "name": "External Create Date",
                  "persona": "",
                  "type": -7
              },
              "external_identity": {
                  "key": "external_identity",
                  "name": "External Identity",
                  "persona": "",
                  "type": -1
              },
              "external_identity_type": {
                  "key": "external_identity_type",
                  "name": "External Identity Type",
                  "persona": "",
                  "type": -1
              },
              "external_modify_date": {
                  "key": "external_modify_date",
                  "name": "External Modify Date",
                  "persona": "",
                  "type": -7
              },
              "external_source": {
                  "key": "external_source",
                  "name": "External Source",
                  "persona": "",
                  "type": -1
              },
              "file_create_date": {
                  "key": "file_create_date",
                  "name": "File Created",
                  "persona": "",
                  "type": -7
              },
              "file_modify_date": {
                  "key": "file_modify_date",
                  "name": "File Modified",
                  "persona": "",
                  "type": -7
              },
              "file_name": {
                  "key": "file_name",
                  "name": "File Name",
                  "persona": "",
                  "type": -1
              },
              "file_size": {
                  "key": "file_size",
                  "name": "File Size",
                  "persona": "",
                  "type": 2
              },
              "file_size_formatted": {
                  "key": "file_size_formatted",
                  "name": "Size",
                  "persona": "",
                  "type": -1
              },
              "file_type": {
                  "key": "file_type",
                  "name": "File Type",
                  "persona": "",
                  "type": -1
              },
              "id": {
                  "key": "id",
                  "name": "ID",
                  "persona": "node",
                  "type": 2
              },
              "locked": {
                  "key": "locked",
                  "persona": "",
                  "type": 5
              },
              "locked_date": {
                  "key": "locked_date",
                  "persona": "",
                  "type": -7
              },
              "locked_user_id": {
                  "key": "locked_user_id",
                  "persona": "user",
                  "type": 2
              },
              "mime_type": {
                  "key": "mime_type",
                  "name": "MIME Type",
                  "persona": "",
                  "type": -1
              },
              "modify_date": {
                  "key": "modify_date",
                  "name": "Modified",
                  "persona": "",
                  "type": -7
              },
              "name": {
                  "key": "name",
                  "name": "Name",
                  "persona": "",
                  "type": -1
              },
              "owner_id": {
                  "key": "owner_id",
                  "name": "Created By",
                  "persona": "user",
                  "type": 2
              },
              "provider_id": {
                  "key": "provider_id",
                  "name": "Storage Provider",
                  "persona": "storage_provider",
                  "type": 2
              },
              "provider_name": {
                  "key": "provider_name",
                  "name": "Storage Provider",
                  "persona": "",
                  "type": -1
              },
              "version_id": {
                  "key": "version_id",
                  "persona": "",
                  "type": 2
              },
              "version_number": {
                  "key": "version_number",
                  "name": "Version Number",
                  "persona": "",
                  "type": 2
              },
              "version_number_major": {
                  "key": "version_number_major",
                  "persona": "",
                  "type": 2
              },
              "version_number_minor": {
                  "key": "version_number_minor",
                  "persona": "",
                  "type": 2
              },
              "version_number_name": {
                  "key": "version_number_name",
                  "name": "Version",
                  "persona": "",
                  "type": -1
              }
          },
          "definitions_map": {
              "name": ["menu"]
          },
          "definitions_order": ["version_number_name", "name", "file_size_formatted", "create_date", "owner_id", "provider_name"]
      }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/11111/categories(\/(.*))*$'),
        responseTime: 0,
        responseText: {
          data: [
            {
              id: 66666,
              name: "BRFG-Payment"
            },
            {
              id: 66667,
              name: "BC Asset Images"
            },
            {
              id: 66668,
              name: "BC Event Photos"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111/categories/actions',
        responseTime: 0,
        responseText: {
          data: {
            categories_add: "api/v1/forms/nodes/categories/create?id=11111"
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=11111',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "name": "Enterprise",
                "description": "",
                "create_date": "2010-10-20T18:31:01",
                "create_user_id": "Admin",
                "type": 141,
                "type_name": "Enterprise Workspace",
                "modify_date": "2015-03-26T15:45:22",
                "owner_user_id": "Admin"
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
                    "type": "text"
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
                    "type": "text"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes/2000",
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
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "string"
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
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            }
          ]
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories',
        responseTime: 0,
        responseText: {
          data: [
            {
              id: 66666,
              name: "BRFG-Payment"
            },
            {
              id: 66667,
              name: "BC Asset Images"
            },
            {
              id: 66668,
              name: "BC Event Photos"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories/actions',
        responseTime: 0,
        responseText: {
          data: {
            categories_add: "api/v1/forms/nodes/categories/create?id=22222"
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=22222',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "name": "Enterprise",
                "description": "",
                "create_date": "2010-10-20T18:31:01",
                "create_user_id": "Admin",
                "type": 141,
                "type_name": "Enterprise Workspace",
                "modify_date": "2015-03-26T15:45:22",
                "owner_user_id": "Admin"
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
                    "type": "text"
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
                    "type": "text"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes/2000",
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
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "string"
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
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            }
          ]
        }

      }));

      var categoryForm = {
        "forms": [{
          "data": {
            "186529_2": null,
            "186529_3": null,
            "186529_4": null,
            "186529_5": false,
            "186529_6": [{
              "186529_6_x_3": [null, null],
              "186529_6_x_4": [null, null],
              "186529_6_x_5": [null, null]
            }, {
              "186529_6_x_3": [null, null],
              "186529_6_x_4": [null, null],
              "186529_6_x_5": [null, null]
            }],
            "186529_6_1": null,
            "186529_6_2": null
          },
          "options": {
            "fields": {
              "186529_2": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Manual Description",
                "readonly": false,
                "type": "text"
              },
              "186529_3": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Manual Id",
                "readonly": false,
                "type": "integer"
              },
              "186529_4": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Long Description",
                "readonly": false,
                "type": "textarea"
              },
              "186529_5": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Type",
                "readonly": false,
                "type": "checkbox"
              },
              "186529_6": {
                "fields": {
                  "item": {
                    "fields": {
                      "186529_6_x_3": {
                        "fields": {
                          "item": {
                            "type": "date"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "DateField",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "186529_6_x_4": {
                        "fields": {
                          "item": {
                            "optionLabels": ["2018-03-05", "2018-05-05", "2018-09-05"],
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "Date-popup",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "186529_6_x_5": {
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
                        "label": "Text-area",
                        "readonly": false,
                        "toolbarSticky": true
                      }
                    },
                    "type": "object"
                  }
                },
                "hidden": false,
                "hideInitValidationError": true,
                "items": {
                  "showMoveDownItemButton": false,
                  "showMoveUpItemButton": false
                },
                "label": "Set attribute",
                "toolbarSticky": true
              },
              "186529_6_1": {
                "hidden": true
              },
              "186529_6_2": {
                "hidden": true
              }
            },
            "form": {
              "attributes": {
                "action": "api\/v1\/nodes\/103827\/categories\/186529",
                "method": "PUT"
              }, "renderForm": true
            }
          },
          "schema": {
            "properties": {
              "186529_2": {
                "maxLength": 32,
                "readonly": false,
                "required": false,
                "title": "Manual Description",
                "type": "string"
              },
              "186529_3": {
                "readonly": false,
                "required": false,
                "title": "Manual Id",
                "type": "integer"
              },
              "186529_4": {
                "readonly": false,
                "required": false,
                "title": "Long Description",
                "type": "string"
              },
              "186529_5": {
                "readonly": false,
                "required": true,
                "title": "Type",
                "type": "boolean"
              },
              "186529_6": {
                "items": {
                  "defaultItems": 2,
                  "maxItems": 8,
                  "minItems": 1,
                  "properties": {
                    "186529_6_x_3": {
                      "items": {
                        "defaultItems": 2,
                        "maxItems": 5,
                        "minItems": 1,
                        "type": "date"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "DateField",
                      "type": "array"
                    },
                    "186529_6_x_4": {
                      "items": {
                        "defaultItems": 2,
                        "enum": ["2018-03-05T00:00:00", "2018-05-05T00:00:00",
                          "2018-09-05T00:00:00"],
                        "maxItems": 5,
                        "minItems": 1,
                        "type": "date"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "Date-popup",
                      "type": "array"
                    },
                    "186529_6_x_5": {
                      "items": {
                        "defaultItems": 2,
                        "maxItems": 5,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "Text-area",
                      "type": "array"
                    }
                  },
                  "type": "object"
                },
                "title": "Set attribute",
                "type": "array"
              },
              "186529_6_1": {
                "type": "string"
              },
              "186529_6_2": {
                "type": "string"
              }
            }, "type": "object"
          }
        }]
      };

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111/thumbnails/medium/content?suppress_response_codes',
        responseTime: 0,
        responseText: ''

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=11111&category_id=66666',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=11111&category_id=66667',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=11111&category_id=66668',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=22222&category_id=66666',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=22222&category_id=66667',
        responseTime: 0,
        responseText: categoryForm
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=22222&category_id=66668',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories/66666/actions',
        responseTime: 0,
        response: function () {
          return {
            "data": {"categories_add": "api\/v1\/forms\/nodes\/categories\/create?id=66666"},
            "definitions": {
              "categories_add": {
                "body": "",
                "content_type": "",
                "display_hint": "",
                "display_href": "",
                "handler": "node_picker_form",
                "image": "",
                "method": "GET",
                "name": "Add Categories",
                "parameters": {},
                "tab_href": ""
              }
            },
            "definitions_map": {},
            "definitions_order": ["categories_add"]
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories/66667/actions',
        responseTime: 0,
        responseText: {
          "data": {
            "categories_remove": "api\/v1\/nodes\/22222\/categories\/66667",
            "categories_update": "api\/v1\/forms\/nodes\/categories\/update?id=22222&category_id=66667"
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
          "definitions_order": ["categories_remove", "categories_update"]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/22222\\?(.*)$'),
        responseTime: 0,
        responseText: {
          "actions": {
            "data": {
              "addversion": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v2\/nodes\/22222\/versions",
                "method": "POST",
                "name": "Add Version"
              },
              "copy": {
                "body": "",
                "content_type": "",
                "form_href": "\/api\/v2\/forms\/nodes\/copy?id=22222",
                "href": "\/api\/v2\/nodes",
                "method": "POST",
                "name": "Copy"
              },
              "delete": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v2\/nodes\/22222",
                "method": "DELETE",
                "name": "Delete"
              },
              "download": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v2\/nodes\/22222\/content?download",
                "method": "GET",
                "name": "Download"
              },
              "move": {
                "body": "",
                "content_type": "",
                "form_href": "\/api\/v2\/forms\/nodes\/move?id=22222",
                "href": "\/api\/v2\/nodes\/22222",
                "method": "PUT",
                "name": "Move"
              },
              "open": {
                "body": "",
                "content_type": "",
                "form_href": "",
                "href": "\/api\/v2\/nodes\/22222\/content",
                "method": "GET",
                "name": "Open"
              }
            },
            "map": {"default_action": "open", "more": ["properties"]},
            "order": ["open", "download", "addversion", "copy", "move", "delete"]
          },
          container: true,
          container_size: 1,
          id: 22222,
          name: "Folder 1",
          description: "This is a folder from mockjax data on the client side.",
          type: 0,
          type_name: "Folder"
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/141'),
        responseTime: 0,
        responseText: enterpriseVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/142'),
        responseTime: 0,
        responseText: personalVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/133'),
        responseTime: 0,
        responseText: categoriesVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/954'),
        responseTime: 0,
        responseText: perspectiveAssetsVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/141(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: enterpriseVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/142(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: personalVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/133(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: categoriesVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/954(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: perspectiveAssetsVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/members/targets(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: {     // TODO: return useful result
          "results": []
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/info?id=22222',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "id": 109661,
                "name": "Assignment folder",
                "description": "",
                "create_date": "2015-04-21T11:43:20",
                "create_user_id": "Admin",
                "modify_date": "2015-04-21T11:43:20",
                "modify_user_id": "Admin",
                "owner_user_id": "Admin",
                "owner_group_id": "DefaultGroup",
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": "<Unknown>"
              },
              "options": {
                "fields": {
                  "id": {
                    "hidden": false,
                    "label": "ID",
                    "readonly": true,
                    "type": "number"
                  },
                  "name": {
                    "hidden": false,
                    "label": "Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "label": "Description",
                    "readonly": true,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "label": "Created By",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "modify_user_id": {
                    "hidden": false,
                    "label": "Modified By",
                    "readonly": true,
                    "type": "text"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "text"
                  },
                  "owner_group_id": {
                    "hidden": false,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "text"
                  },
                  "reserved": {
                    "hidden": false,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "checkbox"
                  },
                  "reserved_date": {
                    "hidden": false,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "reserved_user_id": {
                    "hidden": false,
                    "label": "Reserved By",
                    "readonly": true,
                    "type": "text"
                  }
                }
              },
              "schema": {
                "properties": {
                  "id": {
                    "readonly": true,
                    "required": false,
                    "title": "ID",
                    "type": "integer"
                  },
                  "name": {
                    "readonly": true,
                    "required": false,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "readonly": true,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "format": "datetime",
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "string"
                  },
                  "modify_date": {
                    "format": "datetime",
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "string"
                  },
                  "modify_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified By",
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  },
                  "owner_group_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  },
                  "reserved": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "boolean"
                  },
                  "reserved_date": {
                    "format": "datetime",
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "string"
                  },
                  "reserved_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved By",
                    "type": "string"
                  }
                },
                "title": null,
                "type": "object"
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/forms/nodes/update\\?id=(.+)$'),
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "name": "minion1.jpg",
                "description": "",
                "create_date": "2018-04-26T14:15:36",
                "create_user_id": 1000,
                "type": 144,
                "type_name": "Document",
                "modify_date": "2018-05-14T16:15:59",
                "owner_user_id": 1000,
                "reserved_user_id": 1000,
                "reserved_date": "2018-04-30T11:26:55"
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
                      "action": "api\/v1\/members",
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
                      "action": "api\/v1\/members",
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
                      "action": "api\/v1\/members",
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
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api\/v1\/nodes\/24400",
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
                    "type": "string"
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
                    "type": "string"
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
                    "type": "string"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "6390": {
                  "6390_3": 12,
                  "6390_1": {
                    "version_number": 2
                  }
                },
                "6963": {
                  "6963_2": "hello world",
                  "6963_1": {
                    "version_number": 2
                  }
                },
                "30205": {
                  "30205_2": "2",
                  "30205_1": {
                    "version_number": 2
                  }
                }
              },
              "options": {
                "fields": {
                  "6390": {
                    "fields": {
                      "6390_3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Integer",
                        "readonly": false,
                        "type": "integer"
                      },
                      "6390_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Integer Field",
                    "type": "object"
                  },
                  "6963": {
                    "fields": {
                      "6963_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextField",
                        "readonly": false,
                        "type": "text"
                      },
                      "6963_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Text*",
                    "type": "object"
                  },
                  "30205": {
                    "fields": {
                      "30205_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Select field",
                        "readonly": false,
                        "type": "select"
                      },
                      "30205_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "select field",
                    "type": "object"
                  }
                }
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "6390": {
                    "properties": {
                      "6390_3": {
                        "readonly": false,
                        "required": true,
                        "title": "Integer",
                        "type": "integer"
                      },
                      "6390_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Integer Field",
                    "type": "object"
                  },
                  "6963": {
                    "properties": {
                      "6963_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": true,
                        "title": "TextField",
                        "type": "string"
                      },
                      "6963_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Text",
                    "type": "object"
                  },
                  "30205": {
                    "properties": {
                      "30205_2": {
                        "enum": [
                          "1",
                          "2",
                          "3",
                          "4",
                          "5"
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Select field",
                        "type": "string"
                      },
                      "30205_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "select field*",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }

            },
            {
              "data": {
                "608292": {
                  "608292_2": [
                    {
                      "608292_2_x_3": [
                        null
                      ],
                      "608292_2_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_2_x_3": [
                        null
                      ],
                      "608292_2_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_2_x_3": [
                        null
                      ],
                      "608292_2_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_2_x_3": [
                        null
                      ],
                      "608292_2_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_2_x_3": [
                        null
                      ],
                      "608292_2_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_2_x_3": [
                        null
                      ],
                      "608292_2_x_4": [
                        null
                      ]
                    }
                  ],
                  "608292_2_1": null,
                  "608292_2_2": null,
                  "608292_2_3": null,
                  "608292_2_4": null,
                  "608292_2_5": null,
                  "608292_2_6": null,
                  "608292_3": [
                    {
                      "608292_3_x_3": [
                        null
                      ],
                      "608292_3_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_3_x_3": [
                        null
                      ],
                      "608292_3_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_3_x_3": [
                        null
                      ],
                      "608292_3_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_3_x_3": [
                        null
                      ],
                      "608292_3_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_3_x_3": [
                        null
                      ],
                      "608292_3_x_4": [
                        null
                      ]
                    },
                    {
                      "608292_3_x_3": [
                        null
                      ],
                      "608292_3_x_4": [
                        null
                      ]
                    }
                  ],
                  "608292_3_1": null,
                  "608292_3_2": null,
                  "608292_3_3": null,
                  "608292_3_4": null,
                  "608292_3_5": null,
                  "608292_3_6": null,
                  "608292_1": {
                    "metadata_token": "",
                    "version_number": 1
                  }
                }
              },
              "options": {
                "fields": {
                  "608292": {
                    "fields": {
                      "608292_2": {
                        "fields": {
                          "item": {
                            "fields": {
                              "608292_2_x_3": {
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
                                "label": "MyTextField",
                                "readonly": false,
                                "toolbarSticky": true
                              },
                              "608292_2_x_4": {
                                "fields": {
                                  "item": {
                                    "type": "integer"
                                  }
                                },
                                "hidden": false,
                                "hideInitValidationError": true,
                                "items": {
                                  "showMoveDownItemButton": false,
                                  "showMoveUpItemButton": false
                                },
                                "label": "MyIntegerField",
                                "readonly": false,
                                "toolbarSticky": true
                              }
                            },
                            "type": "object"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "myset",
                        "rows_to_display": 4,
                        "showExpanded": false,
                        "toolbarSticky": true
                      },
                      "608292_2_1": {
                        "hidden": true
                      },
                      "608292_2_2": {
                        "hidden": true
                      },
                      "608292_2_3": {
                        "hidden": true
                      },
                      "608292_2_4": {
                        "hidden": true
                      },
                      "608292_2_5": {
                        "hidden": true
                      },
                      "608292_2_6": {
                        "hidden": true
                      },
                      "608292_3": {
                        "fields": {
                          "item": {
                            "fields": {
                              "608292_3_x_3": {
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
                                "label": "MyTextField",
                                "readonly": false,
                                "toolbarSticky": true
                              },
                              "608292_3_x_4": {
                                "fields": {
                                  "item": {
                                    "type": "integer"
                                  }
                                },
                                "hidden": false,
                                "hideInitValidationError": true,
                                "items": {
                                  "showMoveDownItemButton": false,
                                  "showMoveUpItemButton": false
                                },
                                "label": "MyIntegerField",
                                "readonly": false,
                                "toolbarSticky": true
                              }
                            },
                            "type": "object"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "myset1",
                        "rows_to_display": 3,
                        "showExpanded": false,
                        "toolbarSticky": true
                      },
                      "608292_3_1": {
                        "hidden": true
                      },
                      "608292_3_2": {
                        "hidden": true
                      },
                      "608292_3_3": {
                        "hidden": true
                      },
                      "608292_3_4": {
                        "hidden": true
                      },
                      "608292_3_5": {
                        "hidden": true
                      },
                      "608292_3_6": {
                        "hidden": true
                      },
                      "608292_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "SetCategory",
                    "type": "object"
                  }
                }
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "608292": {
                    "properties": {
                      "608292_2": {
                        "items": {
                          "defaultItems": 1,
                          "maxItems": 6,
                          "minItems": 1,
                          "properties": {
                            "608292_2_x_3": {
                              "items": {
                                "defaultItems": 1,
                                "maxItems": 4,
                                "maxLength": 32,
                                "minItems": 1,
                                "type": "string"
                              },
                              "readonly": false,
                              "required": false,
                              "title": "MyTextField",
                              "type": "array"
                            },
                            "608292_2_x_4": {
                              "items": {
                                "defaultItems": 1,
                                "maxItems": 6,
                                "minItems": 1,
                                "type": "integer"
                              },
                              "readonly": false,
                              "required": false,
                              "title": "MyIntegerField",
                              "type": "array"
                            }
                          },
                          "type": "object"
                        },
                        "title": "myset",
                        "type": "array"
                      },
                      "608292_2_1": {
                        "type": "string"
                      },
                      "608292_2_2": {
                        "type": "string"
                      },
                      "608292_2_3": {
                        "type": "string"
                      },
                      "608292_2_4": {
                        "type": "string"
                      },
                      "608292_2_5": {
                        "type": "string"
                      },
                      "608292_2_6": {
                        "type": "string"
                      },
                      "608292_3": {
                        "items": {
                          "defaultItems": 1,
                          "maxItems": 6,
                          "minItems": 1,
                          "properties": {
                            "608292_3_x_3": {
                              "items": {
                                "defaultItems": 1,
                                "maxItems": 4,
                                "maxLength": 32,
                                "minItems": 1,
                                "type": "string"
                              },
                              "readonly": false,
                              "required": false,
                              "title": "MyTextField",
                              "type": "array"
                            },
                            "608292_3_x_4": {
                              "items": {
                                "defaultItems": 1,
                                "maxItems": 6,
                                "minItems": 1,
                                "type": "integer"
                              },
                              "readonly": false,
                              "required": false,
                              "title": "MyIntegerField",
                              "type": "array"
                            }
                          },
                          "type": "object"
                        },
                        "title": "myset1",
                        "type": "array"
                      },
                      "608292_3_1": {
                        "type": "string"
                      },
                      "608292_3_2": {
                        "type": "string"
                      },
                      "608292_3_3": {
                        "type": "string"
                      },
                      "608292_3_4": {
                        "type": "string"
                      },
                      "608292_3_5": {
                        "type": "string"
                      },
                      "608292_3_6": {
                        "type": "string"
                      },
                      "608292_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "SetCategory",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/actions',
        type: 'POST',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/actions?actions=addcategory&ids=11111",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "11111": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/11111/categories",
                  "method": "POST",
                  "name": "Add Category"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": [
                "addcategory"
              ]
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/create?id=11111&category_id=66666',
        responseTime: 0,
        responseText: categoryForm
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
