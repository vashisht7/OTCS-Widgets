/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  "csui/utils/log",
  'csui/utils/contexts/context',
  'csui/utils/contexts/factories/node',
  'conws/models/workspacecontext/workspacecontext.node.factory'
], function ($, _, Backbone,
    log,
    Context,
    NodeModelFactory,
    WorkspaceContextNodeFactory) {

  var WorkspaceContextModel = Context.extend({

    constructor: function WorkspaceContextModel(attributes, options) {
      options || (options = {});

      Context.prototype.constructor.apply(this, arguments);

      this.options = options;

      this.workspaceSpecific = {};
      this.workspaceSpecific[NodeModelFactory.prototype.propertyPrefix] = true;
      this.workspaceSpecific[WorkspaceContextNodeFactory.prototype.propertyPrefix] = true;

      this.workspaceSpecificFactories = [
        NodeModelFactory,
        WorkspaceContextNodeFactory
      ];
      this.options.node = this.options.context.getModel(NodeModelFactory);
      this.wkspid = this.getModel(WorkspaceContextNodeFactory, {node: this.options.node, connector: this.options.node.connector});
      this.node = this.getModel(NodeModelFactory);
      if (this.wkspid.get("id") === this.options.node.get("id")) {
        this.node.set(this.options.node.attributes);
      } else {
        this.node.set("id", this.wkspid.get("id"));
      }

      this.listenTo(this.options.node, 'change', function() {
        if (this.node.get("id") === this.options.node.get("id")) {
          this.node.set(this.options.node.attributes);
        }
      });
    },

    setWorkspaceSpecific: function(Factory) {
      this.workspaceSpecific[Factory.prototype.propertyPrefix] = true;
      if (!this._isWorkspaceSpecificFactory(Factory)) {
        this.workspaceSpecificFactories.push(Factory);
      }
    },

    isWorkspaceSpecific: function (Factory) {
      var found = false;
      if (this.workspaceSpecific[Factory.prototype.propertyPrefix]) {
        found = true;
      } else if (this._isWorkspaceSpecificFactory(Factory)) {
        this.workspaceSpecific[Factory.prototype.propertyPrefix] = true;
        found = true;
      }
      return found;
    },

    _isWorkspaceSpecificFactory: function (Factory) {
      var found = false;
      for (var ii=0; ii<this.workspaceSpecificFactories.length; ii++) {
        if (this.workspaceSpecificFactories[ii]===Factory) {
          found = true;
          break;
        }
      }
      return found;
    },

    getOuterContext: function () {
      return this.options.context;
    },

    getModel: function () { return this._getWorkspaceObject("getModel", arguments); },
    getCollection: function () { return this._getWorkspaceObject("getCollection", arguments); },
    getObject: function () { return this._getWorkspaceObject("getObject", arguments); },

    _getWorkspaceObject: function (methodName, params) {

      var model;

      if (this.isWorkspaceSpecific(params[0])) {
        model = Context.prototype[methodName].apply(this, params);
      } else {
        model = this.options.context[methodName].apply(this.options.context, params);
      }

      return model;
    },

    fetch: function (options) {
      var old_id = this.wkspid.get("id"),
          self   = this;
      var result = this.wkspid
          .fetch()
          .then(function () {
            log.debug("wkspid old {0}, new {1}.", old_id, self.wkspid.get("id")) &&
            console.log(log.last);
            var new_id = self.wkspid.get("id");
            var factories = self.getFactories ? self.getFactories() : self._factories;
            var obj = _.find(factories, function (f) {return f.property === self.node});
            log.debug("going to fetch {0}.", obj.propertyPrefix) && console.log(log.last);
            var nodepromise, isWksp;
            if (new_id === self.options.node.get("id")) {
              self.node.set(self.options.node.attributes, {silent: true});
              if (self.wkspStatus && self.wkspStatus.wksp_id == new_id &&
                  self.wkspStatus.fetched) {
                return $.Deferred()
                    .resolve(self, {}, options)
                    .promise();
              }
              isWksp = true;
            } else {
              isWksp = false;
              self.node.set("id", new_id);
              if (obj.fetch) {
                if (!old_id || (old_id && new_id && old_id !== new_id)) {
                  nodepromise = obj.fetch();
                }
              }
            }
            factories = self.getFactories ? self.getFactories() : self._factories;
            var promises = _.chain(factories)
                .map(function (obj) {
                  log.debug("going to fetch {0}.", obj.propertyPrefix) && console.log(log.last);
                  if (obj.property !== self.wkspid && obj.property !== self.node) {
                    if (obj.fetch) {
                      if (isWksp || !old_id || (old_id && new_id && old_id !== new_id)) {
                        return obj.fetch();
                      }
                    }
                  }
                })
                .compact()
                .value();
            if (nodepromise) {
              promises.unshift(nodepromise);
            }
            if (promises.length > 0) {
              self.wkspStatus = {
                wksp_id: new_id,
                fetched: true
              }
            }
            return $.when.apply($, promises);
          });
      return result;
    }

  });

  return WorkspaceContextModel;

});
