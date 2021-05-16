/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/utils/commands'
], function (module, _, $, Backbone, ModelFactory, ConnectorFactory,
    NodeModel, commands) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var NextNodeModelFactory = ModelFactory.extend({
    propertyPrefix: 'nextNode',

    constructor: function NextNodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var nextNode = this.options.nextNode || {},
          config   = module.config();
      if (prefetch) {
        this.initialResponse = nextNode.initialResponse || config.initialResponse;
      }
      if (!(nextNode instanceof Backbone.Model)) {
        var fields  = {
              properties: [],
              'versions.element(0)': ['owner_id']
            },
            expands = {
              properties: ['original_id']
            };
        if (nextNode.options) {
          _.mapObject(nextNode.options.fields, function (val, key) {
            fields[key] = _.union(fields[key], val);
          });
          _.mapObject(nextNode.options.expand, function (val, key) {
            expands[key] = _.union(expands[key], val);
          });
        }

        var connector       = context.getObject(ConnectorFactory, options),
            creationOptions = $.extend(true, {
              connector: connector,
              fields: fields,
              expand: expands,
              stateEnabled: true,
              commands: commands.getAllSignatures()
            }, config.options, nextNode.options);
        nextNode = new NodeModel(nextNode.attributes || config.attributes,
            creationOptions);
      }
      this.property = nextNode;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return NextNodeModelFactory;
});
