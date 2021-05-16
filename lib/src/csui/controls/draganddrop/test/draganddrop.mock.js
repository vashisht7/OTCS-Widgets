/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./result2000.json',
  'csui/utils/deepClone/deepClone'
], function (_, mockjax, parseParam, mocked) {
  'use strict';

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

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'], // ids, actions
        response: function (settings) {
          var parameters    = parseParam(settings.urlParams.query),
              filteredNodes = _.filter(mocked.nodes, function (node) {
                return _.contains(parameters.ids, node.id.toString());
              });
          _.each(filteredNodes, function (node) {
            node.actions = getNodeActions(node);
          });
          this.responseText = {
            results: _.reduce(filteredNodes, function (results, node) {
              if (node) {
                results[node.id] = {
                  data: node.actions
                };
              }
              return results;
            }, {})
          };
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
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/ancestors'),
        urlParams: ['nodeId'],
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId;
          this.responseText = {
            ancestors: getAncestors(nodeId, true)
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/5000/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=183718",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=183718",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=183718",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=183718",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=183718"
          },
          "definitions": {
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
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "document", "folder", "shortcut", "url"]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/5001/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=183718",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=183718",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=183718",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=183718",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=183718"
          },
          "definitions": {
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
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "document", "folder", "shortcut", "url"]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/addablenodetypes'),
        responseText: {
          data: {},
          definitions: {}
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets'),
        urlParams: ['nodeId'],
        responseText: {
          facets: mocked.facets
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/5002/thumbnails/medium/content?suppress_response_codes',
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/5003/thumbnails/medium/content?suppress_response_codes',
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes',
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/create?parent_id=5000&type=144',
        responseText: {
          "forms": [
            {
              "data": {
                "file": null,
                "name": null,
                "description": "",
                "parent_id": 5000,
                "external_create_date": null,
                "external_modify_date": null,
                "external_source": "",
                "external_identity": "",
                "external_identity_type": "",
                "advanced_versioning": false,
                "type": 144
              },
              "options": {
                "fields": {
                  "file": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "File",
                    "readonly": false,
                    "type": "file"
                  },
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
                  "parent_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Location",
                    "readonly": false,
                    "type": "otcs_node_picker"
                  },
                  "external_create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Create Date",
                    "readonly": false,
                    "type": "datetime"
                  },
                  "external_modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Modify Date",
                    "readonly": false,
                    "type": "datetime"
                  },
                  "external_source": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Source",
                    "readonly": false,
                    "type": "text"
                  },
                  "external_identity": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Identity",
                    "readonly": false,
                    "type": "text"
                  },
                  "external_identity_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Identity Type",
                    "readonly": false,
                    "type": "text"
                  },
                  "advanced_versioning": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Version Control",
                    "optionLabels": [
                      "Standard - linear versioning",
                      "Advanced - major/minor versioning"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "type": "integer"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes",
                    "method": "POST"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "file": {
                    "readonly": false,
                    "required": true,
                    "title": "File",
                    "type": "string"
                  },
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "parent_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Location",
                    "type": "integer"
                  },
                  "external_create_date": {
                    "readonly": false,
                    "required": false,
                    "title": "External Create Date",
                    "type": "string"
                  },
                  "external_modify_date": {
                    "readonly": false,
                    "required": false,
                    "title": "External Modify Date",
                    "type": "string"
                  },
                  "external_source": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Source",
                    "type": "string"
                  },
                  "external_identity": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Identity",
                    "type": "string"
                  },
                  "external_identity_type": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Identity Type",
                    "type": "string"
                  },
                  "advanced_versioning": {
                    "default": false,
                    "enum": [
                      false,
                      true
                    ],
                    "readonly": false,
                    "required": true,
                    "title": "Version Control",
                    "type": "boolean"
                  },
                  "type": {
                    "required": true,
                    "type": "integer"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "id": null,
                "name": null,
                "type": null,
                "selectable": null,
                "management_type": null,
                "score": null,
                "inherit_flag": null,
                "classvolumeid": 2055,
                "parent_managed": true
              },
              "options": {
                "fields": {
                  "id": {
                    "fields": {
                      "item": {
                        "type": "number"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Classification",
                    "readonly": false,
                    "toolbarSticky": true
                  },
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Classification Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Subtype",
                    "readonly": false,
                    "type": "integer"
                  },
                  "selectable": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Selectable",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "management_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Management Type",
                    "readonly": false,
                    "type": "text"
                  },
                  "score": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Score",
                    "readonly": false,
                    "type": "text"
                  },
                  "inherit_flag": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Inherit",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "classvolumeid": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Classification Volume ID",
                    "readonly": false,
                    "type": "integer"
                  },
                  "parent_managed": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Parent managed",
                    "readonly": false,
                    "type": "checkbox"
                  }
                }
              },
              "role_name": "classifications",
              "schema": {
                "properties": {
                  "id": {
                    "items": {
                      "defaultItems": null,
                      "maxItems": null,
                      "minItems": 1,
                      "type": "integer"
                    },
                    "readonly": false,
                    "required": false,
                    "title": "Classification",
                    "type": "array"
                  },
                  "name": {
                    "readonly": false,
                    "required": false,
                    "title": "Classification Name",
                    "type": "string"
                  },
                  "type": {
                    "readonly": false,
                    "required": false,
                    "title": "Subtype",
                    "type": "integer"
                  },
                  "selectable": {
                    "readonly": false,
                    "required": false,
                    "title": "Selectable",
                    "type": "boolean"
                  },
                  "management_type": {
                    "readonly": false,
                    "required": false,
                    "title": "Management Type",
                    "type": "string"
                  },
                  "score": {
                    "readonly": false,
                    "required": false,
                    "title": "Score",
                    "type": "string"
                  },
                  "inherit_flag": {
                    "readonly": false,
                    "required": false,
                    "title": "Inherit",
                    "type": "boolean"
                  },
                  "classvolumeid": {
                    "readonly": false,
                    "required": false,
                    "title": "Classification Volume ID",
                    "type": "integer"
                  },
                  "parent_managed": {
                    "readonly": false,
                    "required": false,
                    "title": "Parent managed",
                    "type": "boolean"
                  }
                },
                "title": "Classifications",
                "type": "object"
              }
            },
            {
              "data": {
                "clearance_level": null,
                "supplemental_markings": [
                  null
                ]
              },
              "options": {
                "fields": {
                  "clearance_level": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Security Clearance Level",
                    "readonly": false,
                    "type": "integer"
                  },
                  "supplemental_markings": {
                    "fields": {
                      "item": {
                        "type": "text"
                      }
                    },
                    "hidden": true,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Supplemental Markings",
                    "readonly": false,
                    "toolbarSticky": true
                  }
                }
              },
              "role_name": "securityclearances",
              "schema": {
                "properties": {
                  "clearance_level": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Security Clearance Level",
                    "type": "integer"
                  },
                  "supplemental_markings": {
                    "items": {
                      "defaultItems": 1,
                      "maxItems": 0,
                      "minItems": 1,
                      "type": "string"
                    },
                    "readonly": false,
                    "required": false,
                    "title": "Supplemental Markings",
                    "type": "array"
                  }
                },
                "title": "Security Clearance",
                "type": "object"
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/create?parent_id=5002&type=144',
        responseText: {
          "forms": [
            {
              "data": {
                "file": null,
                "name": null,
                "description": "",
                "parent_id": 5002,
                "external_create_date": null,
                "external_modify_date": null,
                "external_source": "",
                "external_identity": "",
                "external_identity_type": "",
                "advanced_versioning": false,
                "type": 144
              },
              "options": {
                "fields": {
                  "file": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "File",
                    "readonly": false,
                    "type": "file"
                  },
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
                  "parent_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Location",
                    "readonly": false,
                    "type": "otcs_node_picker"
                  },
                  "external_create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Create Date",
                    "readonly": false,
                    "type": "datetime"
                  },
                  "external_modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Modify Date",
                    "readonly": false,
                    "type": "datetime"
                  },
                  "external_source": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Source",
                    "readonly": false,
                    "type": "text"
                  },
                  "external_identity": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Identity",
                    "readonly": false,
                    "type": "text"
                  },
                  "external_identity_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Identity Type",
                    "readonly": false,
                    "type": "text"
                  },
                  "advanced_versioning": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Version Control",
                    "optionLabels": [
                      "Standard - linear versioning",
                      "Advanced - major/minor versioning"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "type": "integer"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes",
                    "method": "POST"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "file": {
                    "readonly": false,
                    "required": true,
                    "title": "File",
                    "type": "string"
                  },
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "parent_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Location",
                    "type": "integer"
                  },
                  "external_create_date": {
                    "readonly": false,
                    "required": false,
                    "title": "External Create Date",
                    "type": "string"
                  },
                  "external_modify_date": {
                    "readonly": false,
                    "required": false,
                    "title": "External Modify Date",
                    "type": "string"
                  },
                  "external_source": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Source",
                    "type": "string"
                  },
                  "external_identity": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Identity",
                    "type": "string"
                  },
                  "external_identity_type": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Identity Type",
                    "type": "string"
                  },
                  "advanced_versioning": {
                    "default": false,
                    "enum": [
                      false,
                      true
                    ],
                    "readonly": false,
                    "required": true,
                    "title": "Version Control",
                    "type": "boolean"
                  },
                  "type": {
                    "required": true,
                    "type": "integer"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "id": null,
                "name": null,
                "type": null,
                "selectable": null,
                "management_type": null,
                "score": null,
                "inherit_flag": null,
                "classvolumeid": 2055,
                "parent_managed": true
              },
              "options": {
                "fields": {
                  "id": {
                    "fields": {
                      "item": {
                        "type": "number"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Classification",
                    "readonly": false,
                    "toolbarSticky": true
                  },
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Classification Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Subtype",
                    "readonly": false,
                    "type": "integer"
                  },
                  "selectable": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Selectable",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "management_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Management Type",
                    "readonly": false,
                    "type": "text"
                  },
                  "score": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Score",
                    "readonly": false,
                    "type": "text"
                  },
                  "inherit_flag": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Inherit",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "classvolumeid": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Classification Volume ID",
                    "readonly": false,
                    "type": "integer"
                  },
                  "parent_managed": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Parent managed",
                    "readonly": false,
                    "type": "checkbox"
                  }
                }
              },
              "role_name": "classifications",
              "schema": {
                "properties": {
                  "id": {
                    "items": {
                      "defaultItems": null,
                      "maxItems": null,
                      "minItems": 1,
                      "type": "integer"
                    },
                    "readonly": false,
                    "required": false,
                    "title": "Classification",
                    "type": "array"
                  },
                  "name": {
                    "readonly": false,
                    "required": false,
                    "title": "Classification Name",
                    "type": "string"
                  },
                  "type": {
                    "readonly": false,
                    "required": false,
                    "title": "Subtype",
                    "type": "integer"
                  },
                  "selectable": {
                    "readonly": false,
                    "required": false,
                    "title": "Selectable",
                    "type": "boolean"
                  },
                  "management_type": {
                    "readonly": false,
                    "required": false,
                    "title": "Management Type",
                    "type": "string"
                  },
                  "score": {
                    "readonly": false,
                    "required": false,
                    "title": "Score",
                    "type": "string"
                  },
                  "inherit_flag": {
                    "readonly": false,
                    "required": false,
                    "title": "Inherit",
                    "type": "boolean"
                  },
                  "classvolumeid": {
                    "readonly": false,
                    "required": false,
                    "title": "Classification Volume ID",
                    "type": "integer"
                  },
                  "parent_managed": {
                    "readonly": false,
                    "required": false,
                    "title": "Parent managed",
                    "type": "boolean"
                  }
                },
                "title": "Classifications",
                "type": "object"
              }
            },
            {
              "data": {
                "clearance_level": null,
                "supplemental_markings": [
                  null
                ]
              },
              "options": {
                "fields": {
                  "clearance_level": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Security Clearance Level",
                    "readonly": false,
                    "type": "integer"
                  },
                  "supplemental_markings": {
                    "fields": {
                      "item": {
                        "type": "text"
                      }
                    },
                    "hidden": true,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Supplemental Markings",
                    "readonly": false,
                    "toolbarSticky": true
                  }
                }
              },
              "role_name": "securityclearances",
              "schema": {
                "properties": {
                  "clearance_level": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Security Clearance Level",
                    "type": "integer"
                  },
                  "supplemental_markings": {
                    "items": {
                      "defaultItems": 1,
                      "maxItems": 0,
                      "minItems": 1,
                      "type": "string"
                    },
                    "readonly": false,
                    "required": false,
                    "title": "Supplemental Markings",
                    "type": "array"
                  }
                },
                "title": "Security Clearance",
                "type": "object"
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/5002/versions',
        responseText: {
          "data": [
            {
              "create_date": "2018-02-08T09:41:15",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2018-02-08T09:41:15",
              "file_modify_date": "2018-02-08T09:41:15",
              "file_name": "144423.png",
              "file_size": 25361,
              "file_type": "png",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image/png",
              "modify_date": "2018-02-08T09:41:15",
              "name": "144423.png",
              "owner_id": 1000,
              "provider_id": 5002,
              "version_id": 5002,
              "version_number": 1,
              "version_number_major": 0,
              "version_number_minor": 1,
              "version_number_name": "1",
              "file_size_formatted": "25 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/1/actions",
                  "name": "api/v1/nodes/5002/versions/1/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "144423.png",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2018-03-20T09:44:54",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2018-03-20T09:44:53",
              "file_modify_date": "2018-03-20T09:44:53",
              "file_name": "dt.JPG",
              "file_size": 144044,
              "file_type": "JPG",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image/jpeg",
              "modify_date": "2018-03-20T09:44:54",
              "name": "dt.JPG",
              "owner_id": 1000,
              "provider_id": 54998,
              "version_id": 54999,
              "version_number": 2,
              "version_number_major": 0,
              "version_number_minor": 2,
              "version_number_name": "2",
              "file_size_formatted": "141 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/2/actions",
                  "name": "api/v1/nodes/5002/versions/2/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "dt.JPG",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2018-03-20T09:45:11",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2018-03-20T09:45:11",
              "file_modify_date": "2018-03-20T09:45:11",
              "file_name": "Duplicate_id's_error_between_properties&versions.png",
              "file_size": 67194,
              "file_type": "png",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image/png",
              "modify_date": "2018-03-20T09:45:11",
              "name": "Duplicate_id's_error_between_properties&versions.png",
              "owner_id": 1000,
              "provider_id": 55118,
              "version_id": 55119,
              "version_number": 3,
              "version_number_major": 0,
              "version_number_minor": 3,
              "version_number_name": "3",
              "file_size_formatted": "66 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/3/actions",
                  "name": "api/v1/nodes/5002/versions/3/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "Duplicate_id's_error_between_properties&versions.png",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2018-10-15T11:24:51",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2018-10-15T11:24:50",
              "file_modify_date": "2018-10-15T11:24:50",
              "file_name": "example.html",
              "file_size": 675,
              "file_type": "html",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "text/html",
              "modify_date": "2018-10-15T11:24:51",
              "name": "example.html",
              "owner_id": 1000,
              "provider_id": 83130,
              "version_id": 83131,
              "version_number": 4,
              "version_number_major": 0,
              "version_number_minor": 4,
              "version_number_name": "4",
              "file_size_formatted": "1 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/4/actions",
                  "name": "api/v1/nodes/5002/versions/4/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "example.html",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2018-10-15T11:25:15",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2018-10-15T11:25:15",
              "file_modify_date": "2018-10-15T11:25:15",
              "file_name": "CWS HeaderView Configuration.docx",
              "file_size": 4433,
              "file_type": "docx",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "modify_date": "2018-10-15T11:25:15",
              "name": "CWS HeaderView Configuration.docx",
              "owner_id": 1000,
              "provider_id": 83133,
              "version_id": 83134,
              "version_number": 5,
              "version_number_major": 0,
              "version_number_minor": 5,
              "version_number_name": "5",
              "file_size_formatted": "5 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/5/actions",
                  "name": "api/v1/nodes/5002/versions/5/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "CWS HeaderView Configuration.docx",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2019-01-06T20:19:32",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-01-06T20:19:31",
              "file_modify_date": "2019-01-06T20:19:31",
              "file_name": "Audi-A.jpg",
              "file_size": 61726,
              "file_type": "jpg",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image/jpeg",
              "modify_date": "2019-01-06T20:19:32",
              "name": "Audi-A.jpg",
              "owner_id": 1000,
              "provider_id": 90954,
              "version_id": 90955,
              "version_number": 6,
              "version_number_major": 0,
              "version_number_minor": 6,
              "version_number_name": "6",
              "file_size_formatted": "61 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/6/actions",
                  "name": "api/v1/nodes/5002/versions/6/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "Audi-A.jpg",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2019-01-07T01:03:42",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-01-07T01:03:42",
              "file_modify_date": "2019-01-07T01:03:42",
              "file_name": "MDP1.jpg",
              "file_size": 4555,
              "file_type": "jpg",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image/jpeg",
              "modify_date": "2019-01-07T01:03:42",
              "name": "MDP1.jpg",
              "owner_id": 1000,
              "provider_id": 91727,
              "version_id": 91728,
              "version_number": 7,
              "version_number_major": 0,
              "version_number_minor": 7,
              "version_number_name": "7",
              "file_size_formatted": "5 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/7/actions",
                  "name": "api/v1/nodes/5002/versions/7/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "MDP1.jpg",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            },
            {
              "create_date": "2019-01-07T01:12:37",
              "description": null,
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "file_create_date": "2019-01-07T01:12:36",
              "file_modify_date": "2019-01-07T01:12:36",
              "file_name": "MDP1.jpg",
              "file_size": 4555,
              "file_type": "jpg",
              "id": 5002,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "image/jpeg",
              "modify_date": "2019-01-07T01:12:37",
              "name": "MDP1.jpg",
              "owner_id": 1000,
              "provider_id": 90294,
              "version_id": 90295,
              "version_number": 8,
              "version_number_major": 0,
              "version_number_minor": 8,
              "version_number_name": "8",
              "file_size_formatted": "5 KB",
              "provider_name": "Default(Database Storage)",
              "cell_metadata": {
                "data": {
                  "menu": "api/v1/nodes/5002/versions/8/actions",
                  "name": "api/v1/nodes/5002/versions/8/content?action=open",
                  "owner_id": "api/v1/members/1000"
                },
                "definitions": {
                  "menu": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "menu",
                    "display_href": "",
                    "handler": "menu",
                    "image": "",
                    "method": "GET",
                    "name": "",
                    "parameters": {},
                    "tab_href": ""
                  },
                  "name": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "file",
                    "image": "",
                    "method": "GET",
                    "name": "MDP1.jpg",
                    "parameters": {
                      "mime_type": "image/jpeg"
                    },
                    "tab_href": ""
                  },
                  "owner_id": {
                    "body": "",
                    "content_type": "",
                    "display_hint": "link",
                    "display_href": "",
                    "handler": "user",
                    "image": "",
                    "method": "GET",
                    "name": "Admin",
                    "parameters": {},
                    "tab_href": ""
                  }
                }
              },
              "menu": null
            }
          ],
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
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "version_number_name",
            "name",
            "file_size_formatted",
            "create_date",
            "owner_id",
            "provider_name"
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/5002?fields=versions.element(0)&fields=properties',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/5002?fields=properties&fields=versions.element(0)",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2018-02-08T09:41:15",
                "create_user_id": 1000,
                "description": "jjkh",
                "description_multilingual": {
                  "en": "jjkh"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 5002,
                "mime_type": "image/jpeg",
                "modify_date": "2019-01-07T01:12:38",
                "modify_user_id": 1000,
                "name": "144423.png",
                "name_multilingual": {
                  "en": "144423.png"
                },
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 3752,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 4555,
                "size_formatted": "5 KB",
                "type": 144,
                "type_name": "Document",
                "versions_control_advanced": true,
                "volume_id": -2000,
                "wnd_comments": null
              },
              "versions": {
                "create_date": "2019-01-07T01:12:37",
                "description": null,
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "file_create_date": "2019-01-07T01:12:36",
                "file_modify_date": "2019-01-07T01:12:36",
                "file_name": "MDP1.jpg",
                "file_size": 4555,
                "file_type": "jpg",
                "id": 5002,
                "locked": false,
                "locked_date": null,
                "locked_user_id": null,
                "mime_type": "image/jpeg",
                "modify_date": "2019-01-07T01:12:37",
                "name": "MDP1.jpg",
                "owner_id": 1000,
                "provider_id": 90294,
                "version_id": 90295,
                "version_number": 8,
                "version_number_major": 0,
                "version_number_minor": 8,
                "version_number_name": "8"
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/validation/nodes',
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes',
        responseText: {}
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
