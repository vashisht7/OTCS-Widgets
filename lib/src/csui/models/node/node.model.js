/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/actions', 'csui/models/addabletypes',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/state.carrier/state.carrier.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/node.columns2', 'csui/models/node/server.adaptor.mixin',
  'csui/models/utils/v1tov2', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, ActionCollection, AddableTypesCollection,
    ResourceMixin, UploadableMixin, FieldsV2Mixin, ExpandableV2Mixin,
    StateCarrierMixin, DelayedCommandableV2Mixin, AdditionalResourcesV2Mixin,
    NodeColumn2Collection, ServerAdaptorMixin, v1tov2) {
  'use strict';

  var config = _.extend({
    idAttribute: null,
    usesIntegerId: true,
    separateCommands: false,
    separateCommandsThreshold: 10
  }, module.config());

  var NodeDefinition2Collection = Backbone.Collection.extend({
    model: Backbone.Model.extend({
      id: 'key',
      constructor: function NodeDefinition2Model(attributes, options) {
        Backbone.Model.prototype.constructor.call(this, attributes, options);
      }
    }),
    constructor: function NodeDefinition2Collection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    }
  });

  var NodeModel = Backbone.Model.extend({
    idAttribute: config.idAttribute,

    constructor: function NodeModel(attributes, options) {
      attributes || (attributes = {});
      options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.options = _.pick(options, ['connector']);

      this.makeResource(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeStateCarrier(options, attributes)
          .makeDelayedCommandableV2(options)
          .makeUploadable(options)
          .makeServerAdaptor(options);
      var separateCommands = options.separateCommands;
      this.separateCommands = separateCommands !== undefined ?
          separateCommands : config.separateCommands;

      this.setState(attributes);
      if (!attributes.actions) {
        this._setCollectionProperty('actions', ActionCollection,
            attributes, options);
      }
      if (!attributes.addable_types) {
        this._setCollectionProperty('addable_types', AddableTypesCollection,
            attributes, options);
      }
      if (!attributes.definitions) {
        this._setCollectionProperty('definitions', NodeDefinition2Collection,
            attributes, options);
      }
      if (!attributes.columns) {
        this._setCollectionProperty('columns', NodeColumn2Collection,
            attributes, options);
      }
    },

    clone: function () {
      var clone = new this.constructor(this.attributes, {
        connector: this.connector,
        fields: _.deepClone(this.fields),
        expand: _.deepClone(this.expand),
        stateEnabled: this.stateEnabled,
        includeResources: _.clone(this._additionalResources),
        commands: _.clone(this.commands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands,
        separateCommands: this.separateCommands
      });
      clone.actions.reset(this.actions.toJSON());
      clone.fetched = this.fetched;
      clone.error = this.error;
      clone.state.set(this.state.toJSON());
      return clone;
    },

    isNew: function () {
      return !this.has('id');
    },

    isFetchable: function () {
      if (NodeModel.usesIntegerId) {
        var id = this.get('id');
        return id > 0 || id === 'volume';
      }
      return !!this.get('id');
    },

    isCollectionV2ParameterSource: function (collection) {
      return collection && collection.makeFieldsV2;
    },

    getV2ParameterSource: function () {
      var collection = this.collection;
      if (this.isCollectionV2ParameterSource(collection)) {
        return collection;
      }
      var node = this.clone();
      if (collection) {
        var additionalResources = collection._additionalResources;
        if (additionalResources) {
          node.includeResources(additionalResources);
        }
        var defaultActionCommands = collection.defaultActionCommands;
        if (defaultActionCommands) {
          node.setDefaultActionCommands(defaultActionCommands);
        }
        var commands = collection.includeCommands;
        if (commands) {
          node.setCommands(commands);
        }
        var expand = collection.expand;
        if (expand) {
          node.setExpand(v1tov2.includeExpandsV1toV2(expand));
        }
      }
      return node;
    },

    set: function (key, val, options) {
      var attrs;
      if (key == null) {
        return this;
      }
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});
      this.setState(attrs);
      if (val && val.skipSetValue) {
        return;
      }
      if (attrs.actions) {
        this._setCollectionProperty('actions', ActionCollection, attrs, options);
       }
      if (attrs.addable_types) {
         this._setCollectionProperty('addable_types', AddableTypesCollection, attrs,
            options);
      }
      if (attrs.definitions) {
         this._setCollectionProperty('definitions', NodeDefinition2Collection, attrs, options);
       }
      if (attrs.columns) {
        this._setCollectionProperty('columns', NodeColumn2Collection, attrs, options);
      }
      if (attrs.original_id !== undefined) {
         this._setNodeProperty('original', attrs, options);
      }
       if (attrs.parent_id !== undefined) {
         this._setNodeProperty('parent', attrs, options);
       }
      if (attrs.volume_id !== undefined) {
         this._setNodeProperty('volume', attrs, options);
       }
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    triggerAllChanges: function () {
      triggerReset(this.actions);
      triggerReset(this.addableTypes);
      triggerReset(this.definitions);
      triggerReset(this.columns);
      triggerChange(this.original);
      triggerChange(this.parent);
      triggerChange(this.volume);
      triggerChange(this);

      function triggerReset(collection) {
        if (collection) {
          collection.trigger('reset', collection);
        }
      }

      function triggerChange(model) {
        if (model) {
          var attributes = model.attributes;
          Object
              .keys(attributes)
              .forEach(function (attributeName) {
                model.trigger('change:' + attributeName, model, attributes[attributeName]);
              });
          model.trigger('change', model);
        }
      }
    },

    _setCollectionProperty: function (attribute, Class, attributes, options) {
      var property   = _.str.camelize(attribute),
          models     = attributes[attribute],
          collection = this[property];
      if (collection) {
        collection.reset(models, {silent: options && options.silent});
      } else {
        this[property] = new Class(models, {
          connector: this.connector || options && options.connector
        });
      }
    },

    _setNodeProperty: function (name, source, options) {
      var value = source[name + '_id_expand'] || source[name + '_id'];
      if (value && !_.isObject(value)) {
        value = {id: value};
      }
      if (_.isObject(value)) {
        if (this[name]) {
          this[name].set(value, {silent: options && options.silent});
        } else {
          this[name] = new NodeModel(value, {
            connector: this.connector || options && options.connector
          });
        }
      } else {
        delete this[name];
      }
    },

    getResourceScope: function () {
      var parameterSource = this.getV2ParameterSource();
      return _.deepClone({
        fields: _.isEmpty(this.fields) ? parameterSource.fields : this.fields,
        expand: _.isEmpty(this.expand) ? parameterSource.expand : this.expand,
        includeResources: _.isEmpty(this._additionalResources) ?
                          parameterSource._additionalResources :
                          this._additionalResources,
        commands: _.isEmpty(this.commands) ? parameterSource.commands : this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    getResourceScopeFrom: function (source) {
      return _.deepClone({
        fields: source.fields,
        expand: source.expand,
        includeResources: source._additionalResources,
        commands: source.commands,
        defaultActionCommands: source.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    },

    toString: function () {
      var id = this.get('id');
      if (id === 'volume') {
        return 'volume:' + this.get('type');
      } else if (id != null) {
        return 'node:' + id;
      }
      return 'node:invalid';
    }
  }, {
    usesIntegerId: config.usesIntegerId
  });

  AdditionalResourcesV2Mixin.mixin(NodeModel.prototype);
  FieldsV2Mixin.mixin(NodeModel.prototype);
  ExpandableV2Mixin.mixin(NodeModel.prototype);
  StateCarrierMixin.mixin(NodeModel.prototype);
  DelayedCommandableV2Mixin.mixin(NodeModel.prototype);
  UploadableMixin.mixin(NodeModel.prototype);
  ResourceMixin.mixin(NodeModel.prototype);
  ServerAdaptorMixin.mixin(NodeModel.prototype);

  var originalFetch = NodeModel.prototype.fetch;
  NodeModel.prototype.fetch = function (options) {
    options || (options = {});
    if (!options.url) {
      var originalCollection = this.collection,
          newCollection      = options.collection;
      if (newCollection) {
        this.collection = newCollection;
      }
      computeUrl(this, options);
      if (newCollection) {
        this.collection = originalCollection;
      }
    }

    return originalFetch.call(this, options);
  };

  function computeUrl (node, options) {
    if (node.separateCommands && node.urlQueryWithActionsOnly &&
        node.get('id') !== 'volume') {
      var actionsQuery =  _.result(node, 'urlQueryWithActionsOnly');
      if (actionsQuery && actionsQuery.actions.length > config.separateCommandsThreshold) {
        options.urlQueryWithActionsOnly = actionsQuery;
        return;
      }
    }
    var url = _.result(node, 'url');
    if (url.indexOf('/volumes') < 0) {
      url = url.replace('/api/v1/', '/api/v2/');
    }
    options.url = url;
  }

  return NodeModel;
});
