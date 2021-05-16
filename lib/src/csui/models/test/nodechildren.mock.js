/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./nodechildren.data.json'
], function (_, mockjax, parseParam, mocked) {
  'use strict';

  var mocks = [];

  var mock = {
    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions'),
        type: 'POST',
        response: function (settings) {
          var body = JSON.parse(settings.data.body);
          var filteredNodes = _.filter(mocked.nodes, function (node) {
            return _.contains(body.ids, node.id);
          });
          if (mock.enableLogging) {
            console.log('*** NodeChildrenCollection mock: actions body >>>');
            console.log(JSON.stringify(body, undefined, 2));
            console.log('*** NodeChildrenCollection mock: actions body <<<');
          }
          this.responseText = {
            results: _.reduce(filteredNodes, function (results, node) {
              if (node) {
                results[node.id] = {
                  data: _.reduce(node.actions, function (result, action, signature) {
                    if (_.contains(body.actions, signature)) {
                      result[signature] = action;
                    }
                    return result;
                  }, {})
                };
              }
              return results;
            }, {})
          };
          if (mock.enableLogging) {
            console.log('*** NodeChildrenCollection mock: actions response >>>');
            console.log(JSON.stringify(this.responseText, undefined, 2));
            console.log('*** NodeChildrenCollection mock: actions response <<<');
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          if (mock.enableLogging) {
            console.log('*** NodeChildrenCollection mock: nodes parameters >>>');
            console.log(JSON.stringify(settings.urlParams, undefined, 2));
            console.log('*** NodeChildrenCollection mock: nodes parameters <<<');
          }
          var nodeId = +settings.urlParams.nodeId,
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
              sortCriteria = _.chain(sortValues.concat('asc_name'))
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
          if (parameters.commands) {
            limitedChildren = _.map(limitedChildren, function (node) {
              return _.extend({}, node, {
                actions: _.reduce(node.actions, function (result, value, key) {
                  if (!parameters.commands.length ||
                      _.contains(parameters.commands, key)) {
                    result[key] = value;
                  }
                  return result;
                }, {})
              });
            });
          }
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
            data: limitedChildren,
            definitions: mocked.definitions,
            definitions_order: ['type', 'name', 'size'],
            page: pageIndex,
            limit: pageSize,
            total_count: filteredChildren.length,
            page_total: Math.round(filteredChildren.length / pageSize),
            range_min: 1,
            range_max: Math.round(filteredChildren.length / pageSize),
            sort: sortBy || 'asc_name'
          };
          if (mock.enableLogging) {
            console.log('*** NodeChildrenCollection mock: nodes response >>>');
            console.log(JSON.stringify(this.responseText, undefined, 2));
            console.log('*** NodeChildrenCollection mock: nodes response <<<');
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

  return mock;
});
