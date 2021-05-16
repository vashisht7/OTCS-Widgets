/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./nodestable.data.json', 'json!./mock-data.json',
  'csui/utils/deepClone/deepClone'
], function (_, mockjax, parseParam, mocked, mockData) {
  'use strict';

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
    enable: function (idfrom, idTo, childFrom, childTo) {
      _.each(_.range(idfrom, idTo, 1), function (id) {
        var node = _.deepClone(mocked.nodes[2001]);
        node.id = id;
        node.name = 'Child ' + (id - 2000);
        mocked.nodes[id] = node;
      });
      _.each(_.range(childFrom, childTo, 1), function (id) {
        var node = _.deepClone(mocked.nodes[3000]);
        node.id = id;
        node.name = 'Child ' + (id - 3000);
        mocked.nodes[id] = node;
      });
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        response: function (settings) {
          var body          = JSON.parse(settings.data.body),
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

      mockjax({
        url: '//server/otcs/cs/api/v1/validation/nodes',
        responseText: {
          results: [
            {
              id: null,
              name: 'test.txt',
              type: 144
            }
          ]
        }
      });

      mockjax({
        url: new RegExp('//server/otcs/cs/api/(v1|v2)/nodes$'),
        responseText: {
          results: [
            {
              name: "logo.JPG",
              type: 144,
              parent_id: 2000
            }
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/create*',
        responseText: {
          forms: [
            {
              'data': {
                'parent_id': 2000,
                'type': 144
              },
              'options': {
                fields: {}
              },
              'schema': {
                properties: {}
              }
            }
          ]
        }
      });
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/' + 'api/(v1|v2)/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['version', 'nodeId', 'query'],
        response: function (settings) {
          var version          = settings.urlParams.version,
              nodeId           = +settings.urlParams.nodeId,
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
              sortCriteria     = _.chain(sortValues.concat('asc_type'))
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
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/addablenodetypes'),
        responseText: {
          data: {},
          definitions: {}
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/facets(.*)$'),
        responseText: {
          results: mocked.facets
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
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
