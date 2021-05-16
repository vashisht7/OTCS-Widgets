/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param',
  'json!./copy.mock.json',
  'csui/utils/deepClone/deepClone'
], function (require, _, $, mockjax, parseParam, mocked) {
  'use strict';
  var mocks = [];

  _.extend($.mockjaxSettings, {
    responseTime: 0,
    headers: {}
  });

  _.each(_.range(2002, 2105, 1), function (id) {
    var node = _.deepClone(mocked.nodes[2001]);
    node.id = id;
    node.name = 'Child ' + (id - 2000);
    mocked.nodes[id] = node;
  });

  function getV2Node(node) {
    return {
      actions: getNodeActions(node),
      data: {
        columns: node.container && mocked.columns,
        properties: node
      },
      metadata: {
        properties: mocked.definitions
      }
    };
  }

  function getAncestors(nodeId, includeSelf) {
    var node = mocked.nodes[nodeId];
    if (node) {
      var path      = includeSelf ? [node] : [],
          parent_id = node.parent_id.id || node.parent_id;
      if (parent_id > 0) {
        path = getAncestors(parent_id, true).concat(path);
      }
      return path;
    }
  }

  function getNodeActions(node) {
    return _.chain(mocked.actions[node.type] || [])
        .reduce(function (result, action) {
          result[action] = {};
          return result;
        }, {})
        .value();
  }

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'], // ids, actions
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/actions?actions=addversion&actions=copy&actions=delete&actions=edit&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve&ids=5752677&ids=5752347&reference_id=5752567",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "5752347": {
              "data": {
                "addversion": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/5752347\/versions",
                  "method": "POST",
                  "name": "Add Version"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=5752347",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/5752347",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "edit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "func=Edit.Edit&nodeid=5752347&uiType=2",
                  "method": "GET",
                  "name": "Edit"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=5752347",
                  "href": "\/api\/v2\/nodes\/5752347",
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
                  "href": "\/api\/v2\/nodes\/5752347",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=5752347",
                  "href": "\/api\/v2\/nodes\/5752347",
                  "method": "PUT",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=1000",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/5752347",
                  "method": "PUT",
                  "name": "Reserve"
                },
                "zipanddownload": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "GET",
                  "name": "zipanddownload"
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
                "delete",
                "zipanddownload"
              ]
            },
            "5752677": {
              "data": {
                "addversion": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/5752677\/versions",
                  "method": "POST",
                  "name": "Add Version"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=5752677",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/5752677",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "edit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "func=Edit.Edit&nodeid=5752677&uiType=2",
                  "method": "GET",
                  "name": "Edit"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=5752677",
                  "href": "\/api\/v2\/nodes\/5752677",
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
                  "href": "\/api\/v2\/nodes\/5752677",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=5752677",
                  "href": "\/api\/v2\/nodes\/5752677",
                  "method": "PUT",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=1000",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/5752677",
                  "method": "PUT",
                  "name": "Reserve"
                },
                "zipanddownload": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "GET",
                  "name": "zipanddownload"
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
                "delete",
                "zipanddownload"
              ]
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'], // actions, perspective
        type: 'GET',
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              node   = mocked.nodes[nodeId];
          if (!node) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.dataType = 'json';
            this.responseText = {
              error: 'Invalid node identifier.'
            };
            return;
          }
          this.responseText = getV2Node(node);
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          var nodeId           = +settings.urlParams.nodeId,
              parent           = mocked.nodes[nodeId],
              allChildren      = _.filter(mocked.nodes, function (node) {
                var parent_id = node.parent_id.id || node.parent_id;
                return parent_id === nodeId;
              }),
              parameters       = parseParam(settings.urlParams.query),
              filterBy         = _.chain(_.keys(parameters))
                  .filter(function (key) {
                    return key.indexOf('where_') === 0 && parameters[key];
                  })
                  .map(function (key) {
                    return {
                      property: key.substring(6),
                      value: parameters[key]
                    };
                  })
                  .value(),
              filteredChildren = _.filter(allChildren, function (node) {
                return _.all(filterBy, function (filterBy) {
                  var property    = filterBy.property,
                      filterValue = filterBy.value.toLowerCase(),
                      actualValue = node[property];
                  switch (property) {
                  case 'type':
                    return filterValue == -1 ? node.container :
                           filterValue == actualValue;
                  }
                  if (_.isString(actualValue)) {
                    return actualValue.toLowerCase().indexOf(filterValue) >= 0;
                  }
                  return actualValue == filterValue;
                });
              }),
              sortBy           = parameters.sort,
              sortValues       = sortBy ? _.isArray(sortBy) && sortBy || [sortBy] : [],
              sortCriteria     = _.chain(sortValues.concat('asc_name'))
                  .compact()
                  .unique()
                  .map(function (sortBy) {
                    sortBy = sortBy.split(/_(.+)/, 2);
                    return {
                      ascending: sortBy[0] === 'asc',
                      property: sortBy[1]
                    };
                  })
                  .value(),
              sortedChildren   = filteredChildren.sort(function (left, right) {
                function getValues(property) {
                  var leftValue  = left[property],
                      rightValue = right[property];
                  if (property === 'type') {
                    left.container || (leftValue += 1000000);
                    right.container || (rightValue += 1000000);
                  } else if (property.indexOf('date') >= 0) {
                    leftValue && (leftValue = new Date(leftValue));
                    rightValue && (rightValue = new Date(rightValue));
                  }
                  return {
                    left: leftValue || null,
                    right: rightValue || null
                  };
                }

                var sortBy = _.find(sortCriteria, function (sortBy) {
                  var values = getValues(sortBy.property);
                  return values.left != values.right;
                });
                if (sortBy) {
                  var values = getValues(sortBy.property);
                  return values.left > values.right === sortBy.ascending;
                }
              }),
              pageSize         = +parameters.limit || 10,
              pageIndex        = +parameters.page || 1,
              firstIndex       = (pageIndex - 1) * pageSize,
              lastIndex        = firstIndex + pageSize,
              limitedChildren  = sortedChildren.slice(firstIndex, lastIndex);
          if (!parent) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.dataType = 'json';
            this.responseText = {
              error: 'Invalid node identifier.'
            };
            return;
          }
          this.dataType = 'json';
          this.responseText = {
            results: limitedChildren.map(getV2Node),
            collection: {
              paging: {
                page: pageIndex,
                limit: pageSize,
                total_count: filteredChildren.length,
                page_total: Math.round(filteredChildren.length / pageSize),
                range_min: 1,
                range_max: Math.round(filteredChildren.length / pageSize),
              },
              sorting: {
                sort: [sortBy || 'asc_name']
              }
            }
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets'),
        urlParams: ['nodeId'],
        responseText: {
          facets: mocked.facets
        },
        responseTime: 0,
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        },
        responseTime: 0,
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members\/favorites\/tabs?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": []
        },
        responseTime: 0,
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/volumes/141",
        responseText: {
          "addable_types": [
            {
              "icon": "/alphasupport/webdoc/folder.gif",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "icon": "/alphasupport/tinyali.gif",
              "type": 1,
              "type_name": "Shortcut"
            },
            {
              "icon": "/alphasupport/tinygen.gif",
              "type": 2,
              "type_name": "Generation"
            },
            {
              "icon": "/alphasupport/webattribute/16category.gif",
              "type": 131,
              "type_name": "Category"
            },
            {
              "icon": "/alphasupport/webdoc/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            },
            {
              "icon": "/alphasupport/webdoc/url.gif",
              "type": 140,
              "type_name": "URL"
            },
            {
              "icon": "/alphasupport/webdoc/doc.gif",
              "type": 144,
              "type_name": "Document"
            },
            {
              "icon": "/alphasupport/project/16project.gif",
              "type": 202,
              "type_name": "Project"
            },
            {
              "icon": "/alphasupport/task/16tasklist.gif",
              "type": 204,
              "type_name": "Task List"
            },
            {
              "icon": "/alphasupport/channel/16channel.gif",
              "type": 207,
              "type_name": "Channel"
            },
            {
              "icon": "/alphasupport/collections/collection.gif",
              "type": 298,
              "type_name": "Collection"
            },
            {
              "icon": "/alphasupport/physicalobjects/media_type.gif",
              "type": 410,
              "type_name": "Physical Item Type"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 411,
              "type_name": "Physical Item"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 412,
              "type_name": "Physical Item Container"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 424,
              "type_name": "Physical Item Box"
            },
            {
              "icon": "/alphasupport/recman/rims_disposition.gif",
              "type": 555,
              "type_name": "Disposition Search"
            },
            {
              "icon": "/alphasupport/otemail/emailcontainer.gif",
              "type": 557,
              "type_name": "Compound Email"
            },
            {
              "icon": "/alphasupport/otemail/email.gif",
              "type": 749,
              "type_name": "Email"
            },
            {
              "icon": "/alphasupport/otemail/emailfolder.gif",
              "type": 751,
              "type_name": "Email Folder"
            },
            {
              "icon": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "type": 848,
              "type_name": "Business Workspace"
            },
            {
              "icon": "/alphasupport/webdoc/virtual_folder.png",
              "type": 899,
              "type_name": "Virtual Folder"
            },
            {
              "icon": "/alphasupport/supportasset/support_asset_document.png",
              "type": 1307,
              "type_name": "Support Asset"
            },
            {
              "icon": "/alphasupport/wiki/wiki.gif",
              "type": 5573,
              "type_name": "Wiki"
            },
            {
              "icon": "/alphasupport/webreports/webreports.gif",
              "type": 30303,
              "type_name": "WebReport"
            },
            {
              "icon": "/alphasupport/activeview/activeview.gif",
              "type": 30309,
              "type_name": "ActiveView"
            },
            {
              "icon": "/alphasupport/cmbase/folder.gif",
              "type": 31109,
              "type_name": "Hierarchical Storage Folder"
            },
            {
              "icon": "/alphasupport/forums/forum.gif",
              "type": 123469,
              "type_name": "Forums"
            },
            {
              "icon": "/alphasupport/spdcommittee/16committee.gif",
              "type": 3030202,
              "type_name": "Community"
            }
          ],
          "available_actions": [
            {
              "parameterless": false,
              "read_only": true,
              "type": "browse",
              "type_name": "Browse",
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
          "available_roles": [
            {
              "type": "permissions",
              "type_name": "Permissions"
            },
            {
              "type": "audit",
              "type_name": "Audit"
            },
            {
              "type": "categories",
              "type_name": "Categories"
            },
            {
              "type": "doctemplates",
              "type_name": "Create Instance From Template"
            },
            {
              "type": "followups",
              "type_name": "Reminder"
            },
            {
              "type": "nicknames",
              "type_name": "Nicknames"
            },
            {
              "type": "systemattributes",
              "type_name": "System Attributes"
            }
          ],
          "data": {
            "advanced_versioning": null,
            "container": true,
            "container_size": 7,
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
            "favorite": true,
            "guid": null,
            "icon": "/alphasupport/webdoc/icon_library.gif",
            "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
            "id": 2000,
            "modify_date": "2019-06-02T20:22:32",
            "modify_user_id": 1000,
            "name": "Enterprise Workspace",
            "name_multilingual": {
              "de_DE": "Enterprise",
              "en": "Enterprise Workspace",
              "en_IN": "",
              "ja": "",
              "ko_KR": ""
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 141,
            "type_name": "Enterprise Workspace",
            "versionable": false,
            "versions_control_advanced": false,
            "volume_id": -2000
          },
          "definitions": {
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
            "guid": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "guid",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "GUID",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": -95,
              "type_name": "GUID",
              "valid_values": [],
              "valid_values_name": []
            },
            "icon": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "icon",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Icon",
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
            "icon_large": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "icon_large",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Large Icon",
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
            }
          },
          "definitions_base": [
            "advanced_versioning",
            "container",
            "container_size",
            "create_date",
            "create_user_id",
            "description",
            "external_create_date",
            "external_identity",
            "external_identity_type",
            "external_modify_date",
            "external_source",
            "favorite",
            "guid",
            "icon",
            "icon_large",
            "id",
            "modify_date",
            "modify_user_id",
            "name",
            "owner_group_id",
            "owner_user_id",
            "parent_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "type",
            "type_name",
            "versionable",
            "versions_control_advanced",
            "volume_id"
          ],
          "definitions_order": [
            "id",
            "type",
            "type_name",
            "name",
            "description",
            "parent_id",
            "volume_id",
            "guid",
            "create_date",
            "create_user_id",
            "modify_date",
            "modify_user_id",
            "owner_user_id",
            "owner_group_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "icon",
            "icon_large",
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
            "external_identity_type"
          ],
          "type": 141,
          "type_info": {
            "advanced_versioning": false,
            "container": true
          },
          "type_name": "Enterprise Workspace"
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/volumes/142",
        responseText: {
          "addable_types": [
            {
              "icon": "/alphasupport/webdoc/folder.gif",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "icon": "/alphasupport/tinyali.gif",
              "type": 1,
              "type_name": "Shortcut"
            },
            {
              "icon": "/alphasupport/tinygen.gif",
              "type": 2,
              "type_name": "Generation"
            },
            {
              "icon": "/alphasupport/webattribute/16category.gif",
              "type": 131,
              "type_name": "Category"
            },
            {
              "icon": "/alphasupport/webdoc/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            },
            {
              "icon": "/alphasupport/webdoc/url.gif",
              "type": 140,
              "type_name": "URL"
            },
            {
              "icon": "/alphasupport/webdoc/doc.gif",
              "type": 144,
              "type_name": "Document"
            },
            {
              "icon": "/alphasupport/project/16project.gif",
              "type": 202,
              "type_name": "Project"
            },
            {
              "icon": "/alphasupport/task/16tasklist.gif",
              "type": 204,
              "type_name": "Task List"
            },
            {
              "icon": "/alphasupport/channel/16channel.gif",
              "type": 207,
              "type_name": "Channel"
            },
            {
              "icon": "/alphasupport/collections/collection.gif",
              "type": 298,
              "type_name": "Collection"
            },
            {
              "icon": "/alphasupport/physicalobjects/media_type.gif",
              "type": 410,
              "type_name": "Physical Item Type"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 411,
              "type_name": "Physical Item"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 412,
              "type_name": "Physical Item Container"
            },
            {
              "icon": "/alphasupport/physicalobjects/physical_item.gif",
              "type": 424,
              "type_name": "Physical Item Box"
            },
            {
              "icon": "/alphasupport/recman/rims_disposition.gif",
              "type": 555,
              "type_name": "Disposition Search"
            },
            {
              "icon": "/alphasupport/otemail/emailcontainer.gif",
              "type": 557,
              "type_name": "Compound Email"
            },
            {
              "icon": "/alphasupport/otemail/email.gif",
              "type": 749,
              "type_name": "Email"
            },
            {
              "icon": "/alphasupport/otemail/emailfolder.gif",
              "type": 751,
              "type_name": "Email Folder"
            },
            {
              "icon": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "type": 848,
              "type_name": "Business Workspace"
            },
            {
              "icon": "/alphasupport/webdoc/virtual_folder.png",
              "type": 899,
              "type_name": "Virtual Folder"
            },
            {
              "icon": "/alphasupport/supportasset/support_asset_document.png",
              "type": 1307,
              "type_name": "Support Asset"
            },
            {
              "icon": "/alphasupport/wiki/wiki.gif",
              "type": 5573,
              "type_name": "Wiki"
            },
            {
              "icon": "/alphasupport/webreports/webreports.gif",
              "type": 30303,
              "type_name": "WebReport"
            },
            {
              "icon": "/alphasupport/activeview/activeview.gif",
              "type": 30309,
              "type_name": "ActiveView"
            },
            {
              "icon": "/alphasupport/cmbase/folder.gif",
              "type": 31109,
              "type_name": "Hierarchical Storage Folder"
            },
            {
              "icon": "/alphasupport/forums/forum.gif",
              "type": 123469,
              "type_name": "Forums"
            },
            {
              "icon": "/alphasupport/spdcommittee/16committee.gif",
              "type": 3030202,
              "type_name": "Community"
            }
          ],
          "available_actions": [
            {
              "parameterless": false,
              "read_only": true,
              "type": "browse",
              "type_name": "Browse",
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
          "available_roles": [
            {
              "type": "permissions",
              "type_name": "Permissions"
            },
            {
              "type": "audit",
              "type_name": "Audit"
            },
            {
              "type": "categories",
              "type_name": "Categories"
            },
            {
              "type": "doctemplates",
              "type_name": "Create Instance From Template"
            },
            {
              "type": "followups",
              "type_name": "Reminder"
            },
            {
              "type": "nicknames",
              "type_name": "Nicknames"
            },
            {
              "type": "systemattributes",
              "type_name": "System Attributes"
            }
          ],
          "data": {
            "advanced_versioning": null,
            "container": true,
            "container_size": 9,
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
            "favorite": true,
            "guid": null,
            "icon": "/alphasupport/webdoc/icon_mystuff.gif",
            "icon_large": "/alphasupport/webdoc/icon_mystuff_large.gif",
            "id": 2003,
            "modify_date": "2019-06-03T22:16:25",
            "modify_user_id": 1000,
            "name": "Admin's Home",
            "name_multilingual": {
              "de_DE": "Germany",
              "en": "Admin's Home",
              "en_IN": "",
              "ja": "",
              "ko_KR": ""
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 142,
            "type_name": "My Workspace",
            "versionable": false,
            "versions_control_advanced": false,
            "volume_id": -2003
          },
          "definitions": {
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
            "guid": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "guid",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "GUID",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": -95,
              "type_name": "GUID",
              "valid_values": [],
              "valid_values_name": []
            },
            "icon": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "icon",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Icon",
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
            "icon_large": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "icon_large",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Large Icon",
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
            }
          },
          "definitions_base": [
            "advanced_versioning",
            "container",
            "container_size",
            "create_date",
            "create_user_id",
            "description",
            "external_create_date",
            "external_identity",
            "external_identity_type",
            "external_modify_date",
            "external_source",
            "favorite",
            "guid",
            "icon",
            "icon_large",
            "id",
            "modify_date",
            "modify_user_id",
            "name",
            "owner_group_id",
            "owner_user_id",
            "parent_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "type",
            "type_name",
            "versionable",
            "versions_control_advanced",
            "volume_id"
          ],
          "definitions_order": [
            "id",
            "type",
            "type_name",
            "name",
            "description",
            "parent_id",
            "volume_id",
            "guid",
            "create_date",
            "create_user_id",
            "modify_date",
            "modify_user_id",
            "owner_user_id",
            "owner_group_id",
            "reserved",
            "reserved_date",
            "reserved_user_id",
            "icon",
            "icon_large",
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
            "external_identity_type"
          ],
          "type": 142,
          "type_info": {
            "advanced_versioning": false,
            "container": true
          },
          "type_name": "My Workspace"
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/ancestors',
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

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/nodes?extra=false&actions=false&expand=node&commands=addcategory&commands=addversion&commands=default&commands=open&commands=browse&commands=copy&commands=delete&commands=download&commands=ZipAndDownload&commands=edit&commands=editactivex&commands=editofficeonline&commands=editwebdav&commands=favorite&commands=nonfavorite&commands=rename&commands=move&commands=permissions&commands=properties&commands=favorite_rename&commands=reserve&commands=unreserve&commands=description&commands=thumbnail&commands=savefilter&commands=editpermissions&commands=collectionCanCollect&commands=removefromcollection&limit=30&page=1&sort=asc_type',
        responseText: {
          "data": [
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 69544,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Alberi - Demo Content",
              "type": 0,
              "description": "This is a short description",
              "create_date": "2015-03-09T10:49:00",
              "create_user_id": 1000,
              "modify_date": "2019-06-02T20:56:50",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": 1,
              "type_name": "Folder",
              "container": true,
              "size": 5,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": true,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2015-03-09T10:49:00",
              "wnd_modifiedby": 1000,
              "size_formatted": "5 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/69544",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=69544",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=69544",
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
                  "href": "api/v1/nodes/69544/audit?limit=1000",
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
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/69544/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=69544",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=69544",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=69544",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": "1"
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24838339,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Content to be removed",
              "type": 0,
              "description": null,
              "create_date": "2019-03-10T23:27:40",
              "create_user_id": 1000,
              "modify_date": "2019-06-03T22:57:04",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 55,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-10T23:27:40",
              "wnd_modifiedby": 1000,
              "size_formatted": "55 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24838339",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24838339",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24838339",
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
                  "href": "api/v1/nodes/24838339/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24838339&category_id=511081",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24838339/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24838339",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24838339",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24838339",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24788095,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Development",
              "type": 0,
              "description": "test",
              "create_date": "2019-03-07T03:42:29",
              "create_user_id": 1000,
              "modify_date": "2019-06-03T23:31:25",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": 5,
              "type_name": "Folder",
              "container": true,
              "size": 14,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-07T03:42:29",
              "wnd_modifiedby": 1000,
              "size_formatted": "14 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24788095",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24788095",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24788095",
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
                  "href": "api/v1/nodes/24788095/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24788095&category_id=17525044",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788095/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24788095",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24788095",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24788095",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": "5"
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 526301,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 64039,
              "name": "Innovate Company Main",
              "type": 0,
              "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
              "create_date": "2016-03-07T10:49:01",
              "create_user_id": 64039,
              "modify_date": "2019-05-01T19:19:01",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 10,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 64039,
              "wnd_createdby": 64039,
              "wnd_createdate": "2016-03-07T10:49:01",
              "wnd_modifiedby": 1000,
              "size_formatted": "10 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/526301",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=526301",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=526301",
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
                  "href": "api/v1/nodes/526301/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=526301&category_id=520012",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/526301/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=526301",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=526301",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=526301",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 28121796,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Product Information",
              "type": 0,
              "description": null,
              "create_date": "2019-05-21T07:37:17",
              "create_user_id": 1000,
              "modify_date": "2019-05-21T07:38:10",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 4,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-05-21T07:37:17",
              "wnd_modifiedby": 1000,
              "size_formatted": "4 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/28121796",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=28121796",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=28121796",
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
                  "href": "api/v1/nodes/28121796/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=28121796&category_id=17525044",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/28121796/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=28121796",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=28121796",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=28121796",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24787987,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "Product Management",
              "type": 0,
              "description": null,
              "create_date": "2019-03-07T03:46:04",
              "create_user_id": 1000,
              "modify_date": "2019-05-27T22:21:25",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 7,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-07T03:46:04",
              "wnd_modifiedby": 1000,
              "size_formatted": "7 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24787987",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24787987",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24787987",
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
                  "href": "api/v1/nodes/24787987/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24787987&category_id=10483401",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24787987/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24787987",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24787987",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24787987",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            },
            {
              "volume_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "id": 24788645,
              "parent_id": {
                "advanced_versioning": null,
                "container": true,
                "container_size": 7,
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
                "favorite": true,
                "guid": null,
                "icon": "/alphasupport/webdoc/icon_library.gif",
                "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
                "id": 2000,
                "modify_date": "2019-06-02T20:22:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise",
                  "en": "Enterprise Workspace",
                  "en_IN": "",
                  "ja": "",
                  "ko_KR": ""
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versionable": false,
                "versions_control_advanced": false,
                "volume_id": -2000
              },
              "user_id": 1000,
              "name": "User Experience",
              "type": 0,
              "description": null,
              "create_date": "2019-03-07T03:45:38",
              "create_user_id": 1000,
              "modify_date": "2019-05-29T00:12:37",
              "modify_user_id": 1000,
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "mime_type": null,
              "original_id": 0,
              "wnd_comments": null,
              "type_name": "Folder",
              "container": true,
              "size": 16,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "perm_add_major_version": true,
              "favorite": false,
              "wnd_owner": 1000,
              "wnd_createdby": 1000,
              "wnd_createdate": "2019-03-07T03:45:38",
              "wnd_modifiedby": 1000,
              "size_formatted": "16 Items",
              "reserved_user_login": null,
              "action_url": "/v1/actions/24788645",
              "parent_id_url": "/v1/nodes/2000",
              "commands": {
                "copy": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/copy?id=24788645",
                  "method": "",
                  "name": "Copy"
                },
                "default": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645/nodes",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645",
                  "href_form": "",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/move?id=24788645",
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
                  "href": "api/v1/nodes/24788645/audit?limit=1000",
                  "href_form": "",
                  "method": "GET",
                  "name": "Audit"
                },
                "properties_categories": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/categories/update?id=24788645&category_id=17525044",
                  "method": "",
                  "name": "Categories"
                },
                "properties_classifications": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/24788645/classifications",
                  "href_form": "",
                  "method": "GET",
                  "name": "Classifications"
                },
                "properties_general": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/general?id=24788645",
                  "method": "",
                  "name": "General"
                },
                "properties_rmclassifications": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "api/v1/forms/nodes/properties/rmclassifications?id=24788645",
                  "method": "",
                  "name": "Records Detail"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "/api/v1/forms/nodes/rename?id=24788645",
                  "method": "",
                  "name": "Rename"
                }
              },
              "commands_map": {
                "properties": [
                  "properties_general",
                  "properties_audit",
                  "properties_categories",
                  "properties_classifications",
                  "properties_rmclassifications"
                ]
              },
              "commands_order": [
                "default",
                "rename",
                "copy",
                "move",
                "delete",
                "properties"
              ],
              "wnf_att_690t_4_formatted": null,
              "wnd_att_690t_3_formatted": null,
              "wnf_att_690t_5_formatted": null,
              "wnd_att_690t_6_formatted": null,
              "wnf_att_690t_7_formatted": null,
              "wnd_comments_formatted": null
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "create_user_id": {
              "align": "left",
              "name": "Created By",
              "persona": "user",
              "type": 2,
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
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
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
            "modify_user_id": {
              "align": "left",
              "name": "Modified By",
              "persona": "user",
              "type": 2,
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
            "owner": {
              "align": "center",
              "name": "Owner",
              "sort": true,
              "type": 14,
              "width_weight": 1
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
            "reservedby": {
              "align": "center",
              "name": "Reserved By",
              "sort": true,
              "type": 14,
              "width_weight": 1
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
            },
            "wnd_comments": {
              "align": "center",
              "name": "Comments",
              "sort": false,
              "type": 2,
              "width_weight": 1
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date",
            "owner",
            "wnd_comments",
            "reservedby"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 7,
          "range_min": 1,
          "sort": "asc_type",
          "total_count": 7,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/addablenodetypes',
        responseText: {
          "data": {
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]": "api/v1/forms/nodes/create?type=848&parent_id=2000",
            "Collection": "api/v1/forms/nodes/create?type=298&parent_id=2000",
            "compound_document": "api/v1/forms/nodes/create?type=136&parent_id=2000",
            "document": "api/v1/forms/nodes/create?type=144&parent_id=2000",
            "email_folder": "api/v1/forms/nodes/create?type=751&parent_id=2000",
            "folder": "api/v1/forms/nodes/create?type=0&parent_id=2000",
            "Forum": "api/v1/forms/nodes/create?type=123469&parent_id=2000",
            "physical_item": "api/v1/forms/nodes/create?type=411&parent_id=2000",
            "shortcut": "api/v1/forms/nodes/create?type=1&parent_id=2000",
            "tasklist": "api/v1/forms/nodes/create?type=204&parent_id=2000",
            "url": "api/v1/forms/nodes/create?type=140&parent_id=2000",
            "Wiki": "api/v1/forms/nodes/create?type=5573&parent_id=2000"
          },
          "definitions": {
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/otsapxecm/otsapwksp_workspace_b8.png",
              "method": "GET",
              "name": "Business Workspace",
              "parameters": {},
              "tab_href": "",
              "type": 848
            },
            "Collection": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/collections/collection.gif",
              "method": "GET",
              "name": "Collection",
              "parameters": {},
              "tab_href": "",
              "type": 298
            },
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "email_folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/otemail/emailfolder.gif",
              "method": "GET",
              "name": "Email Folder",
              "parameters": {},
              "tab_href": "",
              "type": 751
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "Forum": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/forums/forum.gif",
              "method": "GET",
              "name": "Forums",
              "parameters": {},
              "tab_href": "",
              "type": 123469
            },
            "physical_item": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/physicalobjects/physical_item.gif",
              "method": "GET",
              "name": "Physical Item",
              "parameters": {},
              "tab_href": "",
              "type": 411
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "tasklist": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/task/16tasklist.gif",
              "method": "GET",
              "name": "Task List",
              "parameters": {},
              "tab_href": "",
              "type": 204
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/webdoc/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            },
            "Wiki": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "/alphasupport/wiki/wiki.gif",
              "method": "GET",
              "name": "Wiki",
              "parameters": {},
              "tab_href": "",
              "type": 5573
            }
          },
          "definitions_map": {},
          "definitions_order": [
            "[?OTSAPWKSP_LABEL?.BusinessWorkspace]",
            "Collection",
            "compound_document",
            "document",
            "email_folder",
            "folder",
            "Forum",
            "physical_item",
            "shortcut",
            "tasklist",
            "url",
            "Wiki"
          ]
        }

      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/19785506",
        responseText: {}
      }));
      mocks.push(mockjax({
        url: new RegExp("//server/otcs/cs/api/v1/forms/nodes/create(?:\\?(.*))?$"),
        responseText: {forms: []}
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/nodes",
        responseText: {id: 158}
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/validation/nodes",
        responseText: {
          results: [{
            name: "Folder created from target picker",
            type: 0,
            versioned: true
          }]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp("//server/otcs/cs/api/v1/forms/nodes/copy(?:\\?(.*))?$"),
        responseText: {forms: []}
      }));
      mocks.push(mockjax({
        url: new RegExp("//server/otcs/cs/api/v1/forms/nodes/move(?:\\?(.*))?$"),
        responseText: {forms: []}
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(?:\\?.*)?$'),
        responseText: {}
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