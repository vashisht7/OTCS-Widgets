/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'i18n!csui/models/node/impl/nls/lang', 'csui/models/utils/v1tov2',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'csui/utils/deepClone/deepClone'
], function (require, _, $, Url, lang, v1tov2, SyncableFromMultipleSources) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var originalSync = prototype.sync;
      SyncableFromMultipleSources.mixin(prototype);
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          this.fetchExactFields = options && options.fetchExactFields;
          return this;
        },

        isFetchableDirectly: function () {
          return this.get('id') > 0;
        },
        urlCacheBase: function () {
          var url = this.urlBase();
          if (url.indexOf('/volumes') < 0) {
            url = url.replace('/api/v1/', '/api/v2/');
          }
          return url + '?';
        },

        urlBase: function () {
          var id  = this.get('id'),
              url = this.connector.connection.url;
          if (!id) {
            url = Url.combine(url, 'nodes');
          } else if (id === 'volume') {
            url = Url.combine(url, 'volumes', this.get('type'));
          } else if (!_.isNumber(id) || id > 0) {
            url = Url.combine(url, 'nodes', id);
          } else {
            throw new Error('Unsupported id value');
          }
          if (this.options.apiVersion) {
            url.getApiBase(this.options.apiVersion);
          }
          return url;
        },

        url: function () {
          var url = this.urlBase();
          var query;
          if (!this.isNew()) {
            if (this.get('id') === 'volume') {
              var expands = v1tov2.expandsV2toV1(this.expand);
              if (expands.length) {
                query = $.param({expand: expands}, true);
              }
            } else {
              if (this.collection) {
                query = this._getCombinedUrlQuery({ withActions: true });
              } else {
                query = this._getNodeUrlQuery({ withActions: true });
              }
              if (!this.hasFields('properties') && !this.fetchExactFields) {
                query = Url.combineQueryString(query, 'fields=properties');
              }
            }
          }
          return Url.appendQuery(url, query);
        },

        urlQueryWithoutActions: function () {
          var query;
          if (this.collection) {
            query = this._getCombinedUrlQuery({ withActions: false });
          } else {
            query = this._getNodeUrlQuery({ withActions: false });
          }
          if (!this.hasFields('properties') && !this.fetchExactFields) {
            query = query.concat({ fields: 'properties' });
          }
          return query;
        },

        urlQueryWithActionsOnly: function () {
          var query;
          if (this.collection) {
            var collection = this.getV2ParameterSource();
            query = this._getUrlQueryActionsFromSource(collection);
          } else {
            query = this.getRequestedCommandsUrlQuery();
          }
          return query;
        },
        _getNodeUrlQuery: function (options) {
          var query = Url.combineQueryString(
            this.getResourceFieldsUrlQuery(),
            this.getExpandableResourcesUrlQuery(),
            this.getStateEnablingUrlQuery(),
            this.getAdditionalResourcesUrlQuery()
          );
          if (options.withActions) {
            query = Url.combineQueryString(
              query, this.getRequestedCommandsUrlQuery());
          }
          return query;
        },
        _getCombinedUrlQuery: function (options) {
          var collection = this.getV2ParameterSource();
          var queryParts = this._getUrlQueryWithoutActionsFromSource(collection);
          if (options.withActions) {
            var actions = this._getUrlQueryActionsFromSource(collection);
            queryParts =  queryParts.concat(actions);
          }
          return Url.combineQueryString.apply(Url, queryParts);
        },

        _getUrlQueryWithoutActionsFromSource: function (collection) {
          return [
            'getExpandableResourcesUrlQuery',
            'getAdditionalResourcesUrlQuery',
            'getResourceFieldsUrlQuery'
          ].map(function (method) {
            var parameters = this[method]();
            if (_.isEmpty(parameters)) {
              method = collection[method];
              if (method) {
                return method.call(collection);
              }
            }
            return parameters;
          }, this);
        },

        _getUrlQueryActionsFromSource: function (collection) {
            var method = this.delayRestCommands ?
                  'getRequestedCommandsUrlQuery' :
                  'getAllCommandsUrlQuery';
            var commands = this[method]();
          if (_.isEmpty(commands)) {
            method = collection.getAllCommandsUrlQuery ||
                     collection.getRequestedCommandsUrlQuery;
            if (method) {
              commands = method.call(collection);
            }
          }
          if (this.refernce_id || this.attributes.reference_id) {
            commands = _.extend({
              reference_id: this.refernce_id || this.attributes.reference_id
            }, commands);
          }
          return commands;
        },

        sync: function (method, model, options) {
          if (method !== 'read') {
            adaptNotFetching(this, options);
          }
          if (method === 'read' && options.urlQueryWithActionsOnly) {
            return syncNodeWithSeparateCommands(this, options);
          }
          return originalSync.call(this, method, model, options);
        },

        parse: function (response) {
          var results    = response.results || response,
              resultData = results.data,
              data       = resultData && (resultData.id || resultData.properties) && resultData,
              node       = data && data.properties  || data || response;
          if (response.type !== undefined) {
            node.type = response.type;
          }
          if (response.type_name !== undefined) {
            node.type_name = response.type_name;
          }
          if (data && data.versions) {
            node.versions = data.versions;
          }
          _.extend(node, response.type_info);
          if (node.versions) {
            var version = node.versions;
            if (_.isArray(version)) {
              version = version[version.length - 1];
            }
            if (version) {
              _.extend(node, _.pick(version, ['file_size', 'mime_type',
                'version_id', 'version_number',
                'version_number_major',
                'version_number_minor']));
            }
          }
          _.defaults(node, {
            perspective: results && results.perspective || response.perspective
          });
          this.parseState(node, results);
          this._parseActions(node, results, response);
          var original = node.original_id && node.original_id.id ?
                         node.original_id : node.original_id_expand;
          if (original) {
            this._parseActions(original, {}, {});
          }
          var parent = node.parent_id && node.parent_id.id ?
                       node.parent_id : node.parent_id_expand;
          if (parent) {
            this._parseActions(parent, {}, {});
            if (!parent.actions.length) {
              this._makeAccessible(parent);
            }
          }
          if (node.type === 140 && !node.url) {
            var defaultAction = _.findWhere(node.actions, {signature: 'default'});
            node.url = defaultAction && defaultAction.href;
          }
          node.addable_types = response.addable_types;
          var columns = data && data.columns;
          if (columns) {
            node.columns = this._parseColumns(columns, response);
          }
          var definitions = response.definitions || results.metadata &&
                                                    results.metadata.properties;
          if (definitions) {
            node.definitions = this._parseDefinitions(definitions, columns);
          }
          if (data && data.properties) {
            node.data = _.omit(data, 'columns', 'metadata', 'properties');
          }
          if (this.collection && this.collection.node && this.collection.node.get('type') === 298) {
            node.reference_id = this.collection.node.get('id');
          }
          if (this.get('csuiLazyActionsRetrieved') === undefined &&
              !!this.get('csuiDelayedActionsRetrieved') && !_.isEmpty(this.changed)) {
            node.csuiLazyActionsRetrieved = true;
          }
          return node;
        },

        _parseColumns: function (columns, response) {
          var columnKeys = response.definitions_order ||
                           columns && _.pluck(columns, 'key');
          return _.map(columnKeys, function (key) {
            return {key: key};
          });
        },

        _parseDefinitions: function (definitions, columns) {
          if (!definitions.size &&
              (definitions.container_size || definitions.file_size)) {
            definitions.size = definitions.container_size ||
                               definitions.file_size;
            definitions.size.key = 'size';
            definitions.size.name = lang.sizeColumnTitle;
          }
          if (columns) {
            _.each(columns, function (column) {
              var columnKey  = column.key,
                  definition = definitions[columnKey];
              if (!definition) {
                definition = definitions[columnKey] = _.omit(column, 'data_type');
                definition.type = column.data_type;
              }
              var supportedPersonas = ['user', 'group', 'member'];
              if ($.inArray(definition.persona, supportedPersonas) !== -1) {
                definition.type = 14;
              }
              definition.sort = !!column.sort_key;
            });
            _.each(columns, function (column) {
              var columnKey      = column.key,
                  formattedIndex = columnKey.lastIndexOf('_formatted');
              if (formattedIndex >= 0) {
                var realColumnKey = columnKey.substr(0, columnKey.length - 10),
                    definition    = definitions[realColumnKey];
                if (!definition) {
                  definition = definitions[realColumnKey] = _.omit(column, 'data_type');
                  definition.type = definition.data_type;
                }
                definition.sort = !!column.sort_key;
              }
            });
          }
          return _.map(definitions, function (definition, key) {
            if (!definition.key) {
              definition.key = key;
            }
            return definition;
          });
        },

        _parseActions: function (node, results, response) {
          var actions = node.actions || response.actions ||
                        response.available_actions,
              commands;
          if (_.isArray(actions)) {
            _.each(actions, function (action) {
              if (!action.signature) {
                action.signature = action.type;
                action.name = action.type_name;
                delete action.type;
                delete action.type_name;
              }
            });
            commands = _.reduce(actions, function (result, action) {
              result[action.signature] = {};
              return result;
            }, {});
            node.actions = actions;
          } else {
            commands = node.commands || response.commands || response.actions ||
                       results && results.actions || {};
            if (commands.data && commands.order && commands.map) {
              commands = commands.data;
            }
            node.actions = _.chain(commands)
                .keys()
                .map(function (key) {
                  var attributes = commands[key];
                  attributes.signature = key;
                  return attributes;
                })
                .value();
            delete node.commands;
            delete node.commands_map;
            delete node.commands_order;
          }
        },
        _makeAccessible: function (original) {
          original.actions = [
            {signature: 'open'}
          ];
        }
      });
    }
  };

  var NodeActionCollection;

  function syncNodeWithSeparateCommands (node, options) {
    var deferred = $.Deferred();
    require(['csui/models/node.actions'], function () {
      NodeActionCollection = arguments[0];
      var promiseForNode = fetchNodeWithoutActions(node, options);
      var promiseForActions = fetchNodeActions(node, options);
      options = _.defaults({ parse: false }, options);
      node.syncFromMultipleSources(
            [promiseForNode, promiseForActions],
            mergeNodeWithActions, options)
          .then(deferred.resolve, deferred.reject);
    }, deferred.reject);
    return deferred.promise();
  }

  function mergeNodeWithActions (node, actions) {
    node.actions = actions;
    return node;
  }

  function fetchNodeWithoutActions (originalNode, options) {
    var node = originalNode.clone();
    node.separateCommands = false;
    var collection = options.collection || originalNode.collection;
    if (node.isCollectionV2ParameterSource(collection)) {
      var parameterScope = node.getResourceScopeFrom(collection);
      node.setResourceScope(parameterScope);
    }
    node.resetCommands();
    node.resetDefaultActionCommands();
    node.invalidateFetch();
    return node
      .fetch()
      .then(function () {
        return node.attributes;
      });
  }

  function fetchNodeActions (node, options) {
    var actions = new NodeActionCollection(undefined, {
      connector: node.connector,
      nodes: [node.get('id')],
      commands: options.urlQueryWithActionsOnly.actions
    });
    return actions
      .fetch()
      .then(function () {
        return actions.reduce(function (actions, node) {
          var attributes = node.actions.toJSON();
          return actions.concat(attributes);
        }, []);
      });
  }

  function adaptNotFetching(node, options) {
    var url = options.url;
    if (url && _.isString(url)) {
      options.url = url.replace(/\?.*$/, '');
    } else {
      options.url = node.urlBase();
    }
  }

  return ServerAdaptorMixin;
});
