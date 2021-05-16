/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery.mockjax',
    'csui/lib/jquery.parse.param', 'json!./thumbnail.data.json', 'json!./mock-data.json',
    'csui/utils/deepClone/deepClone'
  ], function (_, mockjax, parseParam, mocked, mockData) {
    'use strict';

    _.each(_.range(2002, 2003, 1), function (id) {
        var node = _.deepClone(mocked.nodes[2001]);
        node.id = id;
        node.name = 'Child ' + (id - 2000);
        mocked.nodes[id] = node;
      });
      _.each(_.range(2005, 2105, 1), function (id) {
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
        var path = includeSelf ? [node] : [],
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
          url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
          type: 'POST',
          response: function (settings) {
            var body = JSON.parse(settings.data.body),
                filteredNodes = _.filter(mocked.nodes, function (node) {
                  return _.contains(body.ids, node.id);
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
                node = mocked.nodes[nodeId];
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
          url: new RegExp('^//server/otcs/cs/'+'api/(v1|v2)/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
          urlParams: ['version','nodeId', 'query'],
          response: function (settings) {
            var version = settings.urlParams.version,
                nodeId = +settings.urlParams.nodeId,
                parent = mocked.nodes[nodeId],
                allChildren = _.filter(mocked.nodes, function (node) {
                  var parent_id = node.parent_id.id || node.parent_id;
                  return parent_id === nodeId;
                }),
                parameters = parseParam(settings.urlParams.query),
                filterBy = _.chain(_.keys(parameters))
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
                    var property = filterBy.property,
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
                sortBy = parameters.sort,
                sortValues = sortBy ? _.isArray(sortBy) && sortBy || [sortBy] : [],
                sortCriteria = _.chain(sortValues.concat('asc_type'))
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
                sortedChildren = filteredChildren.sort(function (left, right) {
                  function getValues(property) {
                    var leftValue = left[property],
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
                pageSize = +parameters.limit || 10,
                pageIndex = +parameters.page || 1,
                firstIndex = (pageIndex - 1) * pageSize,
                lastIndex = firstIndex + pageSize,
                limitedChildren = sortedChildren.slice(firstIndex, lastIndex);
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
              if (version === 'v1') {
                  _.each(limitedChildren, function (node) {
                      node.actions = getNodeActions(node);
                  });
                  this.responseText = {
                      data: limitedChildren,
                      definitions: mockData.nodeMetadata,
                      definitions_order: ['type', 'name', 'size', 'modify_date', 'wnd_comments'],
                      page: pageIndex,
                      limit: pageSize,
                      total_count: filteredChildren.length,
                      page_total: Math.round(filteredChildren.length / pageSize),
                      range_min: 1,
                      range_max: Math.round(filteredChildren.length / pageSize),
                      sort: sortBy || 'asc_type'
                  };
              } else {
  
                  this.responseText = {
                      results: limitedChildren.map(getV2Node),
                      collection: {
                          paging: {
                              page: pageIndex,
                              limit: pageSize,
                              total_count: filteredChildren.length,
                              page_total: Math.round(filteredChildren.length / pageSize),
                              range_min: 1,
                              range_max: Math.round(filteredChildren.length / pageSize)
                          },
                          sorting: {
                              sort: [sortBy || 'asc_type']
                          }
                      }
                  };
              }
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
            url: new RegExp('^//server/otcs/cs/api/v1/nodes/2001'),
            status: 400,
            responseText: {
                error: "An item with the name already exists."
            }
        }));
        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/addablenodetypes'),
          responseText: mocked.addableNodeTypes
        }));
        mocks.push(mockjax({
            url: new RegExp('^//server/otcs/cs/api/v1/volumes/([^/]+)'),
            responseText: {}
        }));
        mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/targets?fields=properties&fields=versions.element(0)&expand=properties%7Boriginal_id%7D&orderBy=asc_name&actions=',
            responseText: mocked.addShortcut
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
          url: new RegExp('^//server/otcs/cs/api/v1/forms/nodes/create(?:\\?.*)?$'),
          responseText: {}
        }));
        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/forms/nodes/update?id=2002',
          responseText: {
            "forms": [
                {
                    "data": {
                        "name": "üLivelink Reports",
                        "description": "",
                        "create_date": "2003-10-01T13:30:55",
                        "create_user_id": 1000,
                        "type": 211,
                        "type_name": "Reports Volume",
                        "modify_date": "2003-10-03T11:05:17",
                        "owner_user_id": 1000,
                        "metadata_token": ""
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
                                "action": "api/v1/nodes/2002",
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
                    "data": {},
                    "options": {
                        "fields": {}
                    },
                    "role_name": "categories",
                    "schema": {
                        "properties": {},
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
                }
            ]
          }
        }));
        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=2002',
          responseText: {
            "forms": [
                {
                    "data": {
                        "name": "üLivelink Reports",
                        "description": "",
                        "create_date": "2003-10-01T13:30:55",
                        "create_user_id": 1000,
                        "type": 211,
                        "type_name": "Reports Volume",
                        "modify_date": "2003-10-03T11:05:17",
                        "owner_user_id": 1000,
                        "metadata_token": ""
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
                                "action": "api/v1/nodes/2002",
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
        }));
        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/members/1000',
          responseText: {
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
                "business_email": "Kristen",
                "business_fax": null,
                "business_phone": null,
                "cell_phone": "+49-987654321",
                "deleted": false,
                "display_name": "Admin",
                "first_name": "Admin",
                "gender": 3,
                "group_id": 1001,
                "home_address_1": null,
                "home_address_2": null,
                "home_fax": null,
                "home_phone": null,
                "id": 1000,
                "initials": "A",
                "last_name": null,
                "middle_name": null,
                "name": "Admin",
                "office_location": "Saudi",
                "pager": null,
                "personal_email": null,
                "personal_interests": null,
                "personal_url_1": null,
                "personal_url_2": null,
                "personal_url_3": null,
                "personal_website": null,
                "photo_id": 27815029,
                "photo_url": "api/v1/members/1000/photo?v=27815029.1",
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
                    "name": "Create/Modify Groups",
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
                    "name": "Create/Modify Users",
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
                "photo_id"
            ],
            "type": 0,
            "type_name": "User"
          }
        }));
  
        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/members/1000/photo?v=27815029.1',
          responseText: {}
        }));

        mocks.push(mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/auth(?:\\?.*)?$'),
          responseText: {}
        }));

        mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/serverInfo',
            responseTime: 0,
            responseText: mockData.serverInfo
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