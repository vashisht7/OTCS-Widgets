/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./zip.download.mock.json',
  'csui/utils/deepClone/deepClone'
], function (_, $, mockjax, parseParam, mocked) {
  'use strict';

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
      var newNodeName,
          newNodeRoles;

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/addablenodetypes',
        type: 'GET',
        responseText: {
          "data": {
            "Collection": "api\/v1\/forms\/nodes\/create?type=298&parent_id=5752567",
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=5752567",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=5752567",
            "email_folder": "api\/v1\/forms\/nodes\/create?type=751&parent_id=5752567",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=5752567",
            "physical_item": "api\/v1\/forms\/nodes\/create?type=411&parent_id=5752567",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=5752567",
            "tasklist": "api\/v1\/forms\/nodes\/create?type=204&parent_id=5752567",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=5752567",
            "Wiki": "api\/v1\/forms\/nodes\/create?type=5573&parent_id=5752567"
          },
          "definitions": {
            "Collection": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/collections\/collection.gif",
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
              "image": "\/alphasupport\/webdoc\/cd.gif",
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
              "image": "\/alphasupport\/webdoc\/doc.gif",
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
              "image": "\/alphasupport\/otemail\/emailfolder.gif",
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
              "image": "\/alphasupport\/webdoc\/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "physical_item": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/physicalobjects\/physical_item.gif",
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
              "image": "\/alphasupport\/tinyali.gif",
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
              "image": "\/alphasupport\/task\/16tasklist.gif",
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
              "image": "\/alphasupport\/webdoc\/url.gif",
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
              "image": "\/alphasupport\/wiki\/wiki.gif",
              "method": "GET",
              "name": "Wiki",
              "parameters": {},
              "tab_href": "",
              "type": 5573
            }
          },
          "definitions_map": {},
          "definitions_order": ["Collection", "compound_document", "document", "email_folder",
            "folder", "physical_item", "shortcut", "tasklist", "url", "Wiki"]
        }
      });
      mockjax({
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
      });
      mockjax({
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
      });
      mockjax({
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
      });
      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets'),
        urlParams: ['nodeId'],
        responseText: {
          facets: mocked.facets
        },
        responseTime: 0,
      });

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        },
        responseTime: 0,
      });

      mockjax({
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
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/zipanddownload',
        responseText: {
          "links": {
              "data": {
                  "self": {
                      "body": "",
                      "content_type": "",
                      "href": "/api/v2/zipanddownload",
                      "method": "POST",
                      "name": ""
                  }
              }
          },
          "results": {
              "data": {
                  "jobs": {
                      "id": 2099316297
                  }
              }
          }
      }
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/zipanddownload/2099316297',
        responseText: {
          "links": {
              "data": {
                  "self": {
                      "body": "",
                      "content_type": "",
                      "href": "/api/v2/zipanddownload/2099316297",
                      "method": "GET",
                      "name": ""
                  }
              }
          },
          "results": {
              "data": {
                  "jobs": {
                      "complete": true,
                      "current_stage": 4,
                      "current_stage_formatted": "Download archive",
                      "date_completed": "2019-03-18T18:32:21",
                      "date_started": "2019-03-18T18:32:21",
                      "id": 2099316297,
                      "link": "?func=multifile.downloadfile&cacheid=2099316297",
                      "name": "New_Archive_20190318T183221.zip",
                      "stage_summary": [
                          {
                              "complete": true,
                              "date_completed": "2019-03-18T18:32:21",
                              "date_started": "2019-03-18T18:32:21",
                              "name": "Extraction",
                              "name_formatted": "Extracting files",
                              "summary": "Extracting 2 of 2",
                              "total": 2,
                              "total_completed": 2,
                              "total_size": 838,
                              "total_successful": 2,
                              "total_unsuccessful": 0
                          },
                          {
                              "complete": true,
                              "date_completed": "2019-03-18T18:32:21",
                              "date_started": "2019-03-18T18:32:21",
                              "name": "Compression",
                              "name_formatted": "Compress files into archive",
                              "summary": "Compressing files",
                              "total": 2,
                              "total_completed": 2,
                              "total_size": 838,
                              "total_successful": 2,
                              "total_unsuccessful": 0
                          },
                          {
                              "complete": true,
                              "date_completed": "2019-03-18T18:32:21",
                              "date_started": "2019-03-18T18:32:21",
                              "name": "Clean up",
                              "name_formatted": "Cleaning up temporary files",
                              "summary": "Cleaning up temporary files",
                              "total": 2,
                              "total_completed": 2,
                              "total_size": 838,
                              "total_successful": 2,
                              "total_unsuccessful": 0
                          },
                          {
                              "complete": true,
                              "date_completed": "2019-03-18T18:32:21",
                              "date_started": "2019-03-18T18:32:21",
                              "name": "Download",
                              "name_formatted": "Download archive",
                              "summary": "Preparing the archive for download",
                              "total": 2,
                              "total_completed": 2,
                              "total_size": 838,
                              "total_successful": 2,
                              "total_unsuccessful": 0
                          }
                      ],
                      "status_date": "2019-03-18T18:52:26",
                      "status_formatted": "Preparing the archive for download",
                      "total": 2,
                      "total_completed": 2,
                      "total_size": 838,
                      "type": "ZipAndDownload",
                      "unprocessed_items_list": []
                  }
              }
          }
        }
      });

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(?:\\?.*)?$'),
        responseText: {}
      });
    },
    disable: function () {
      mockjax.clear();
    }
  };
});
