/**
 * Created by stefang on 09.10.2015.
 */
csui.define('conws/models/workspacecreateforms',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/nodeforms"
], function (module, $, _, Backbone, log, base, NodeFormCollection) {
  

  // copy values from UI into server form, but not if the fields from the server are readonly.
  // And if the fields from the server are writable and the fields from the UI are readonly, then
  // also don't copy, because then the fields must be set to the default values from the server.
  function copyWritables(dst,dst_options,dst_schema,src,src_options, src_schema) {
    var iskey = _.reduce(_.keys(dst),function(iskey,key){iskey[key]=true;return iskey;},{});
    _.each(src,function(src_val,key) {
      if (iskey[key]) {
        var copyValue = true,
            new_options = dst_options && dst_options.fields && (dst_options.fields[key] ? dst_options.fields[key] : dst_options.fields.item ),
            new_schema  = dst_schema && (dst_schema.properties ? dst_schema.properties[key] : dst_schema.items),
            old_options = src_options && src_options.fields && (src_options.fields[key] ? src_options.fields[key] : src_options.fields.item ),
            old_schema = src_schema && (src_schema.properties ? src_schema.properties[key] : src_schema.items);
        if (new_options && new_options.readonly || new_schema && new_schema.readonly ||
            old_options && old_options.readonly || old_schema && old_schema.readonly) {
          copyValue = false;
        }
        if (copyValue) {
          var dst_val = dst[key],
              is_dst_obj = _.isObject(dst_val),
              is_src_obj = _.isObject(src_val);
          if (is_dst_obj && is_src_obj) {
            copyWritables(dst_val,new_options,new_schema,src_val,old_options,old_schema);
          } else if (!is_dst_obj && !is_src_obj) {
            dst[key] = src[key];
          }
        }
      }
    });
  }
  // WorkspaceCreateFormCollection
  // ------------------------

  var WorkspaceCreateFormCollection = NodeFormCollection.extend({

        constructor: function WorkspaceCreateFormCollection(models, options) {
          NodeFormCollection.prototype.constructor.apply(this, arguments);
          this.type = options.type;
          this.actionContext = options.actionContext;
          if (this.type === undefined) {
            throw new Error(WorkspaceCreateFormCollection.ERR_CONSTRUCTOR_NO_TYPE_GIVEN);
          }
          if (this.options.wsType === undefined) {
            throw new Error(WorkspaceCreateFormCollection.ERR_CONSTRUCTOR_NO_WSTYPE_GIVEN);
          }
        },

        url: function () {
          //var path = 'forms/nodes/create',
          var path = 'forms/businessworkspaces/create',
              wsType = this.options.wsType,
              template = this.options.template,
              params = {
                parent_id: this.node.get("id"),
                type: this.type,
                wksp_type_id: wsType.id,
                template_id: template ? template.id : undefined,
                bo_type_id: this.bo_type_id /*can be set by caller before fetch*/,
                bo_id: this.bo_id /*can be set by caller before fetch*/
              },
              resource = path + '?' + $.param(_.omit(params,function (value) {
                    return value === null || value === undefined || value === '';
                  })),
              url = this.node.connector.connection.url;
          //return base.Url.combine(url, resource);
          return base.Url.combine(url&&url.replace('/v1', '/v2')||url, resource);
        },

        parse: function (response) {
          var forms = response.forms;

          // TODO this should be sent by server, remove when possible
          _.each(forms, function (form) {
            form.id = form.schema.title;
          });
          forms.length && (forms[0].id = "general");

          if (forms.length>0) {
            var forms_map = _.reduce(forms, function (map,form) {form.role_name && (map[form.role_name] = form); return map;},{}),
                schema_map = _.reduce(this.formsSchema, function (map,form) {form.role_name && (map[form.role_name] = form); return map;},{}),
                general = forms[0];

            // if server sends name as readonly and required but empty name, set required to false.
            if (general && general.schema && general.schema.properties && general.schema.properties.name) {
              if (general.schema.properties.name.readonly && general.schema.properties.name.required) {
                if (!general.data || !general.data.name) {
                  general.schema.properties.name.required = false;
                }
              }
            }

            // for simplicity, we avoid category and others be manually added. PM decision.
            // And at least as long as issue LPAD-50706 exists, we have to avoid that as well.
            if (general && general.data && general.data.bo_type_id) {
              if (!forms_map.categories) {
                forms_map.categories = { role_name: "categories" };
                forms.push(forms_map.categories);
              }
              _.each(forms, function (form) {
                if (form.role_name) {
                  form.schema || (form.schema = {});
                  form.schema.additionalProperties = false;
                }
              });
            }

            if (general && general.data) {
              // because rest call does not deliver bo_type_id and bo_id, if these params
              // were send with the request, we must propagate it here.
              var old = this.at(0) && this.at(0).get("data") || {};
              _.defaults(general.data,{bo_id:this.bo_id},_.pick(old,"bo_id","bo_type_id","bo_type_name","ext_system_id","ext_system_name"));
            }

            // copy all values from before the server call to the writable fields
            if (this.formsValues) {
              var role_options, role_schema;
              if (general && general.data) {
                role_options = this.formsSchema && this.formsSchema[0] && this.formsSchema[0].options;
                role_schema = this.formsSchema && this.formsSchema[0] && this.formsSchema[0].schema;
                copyWritables(general.data,general.options,general.schema,
                    {
                      name: this.formsValues.name,
                      description: this.formsValues.description
                    },role_options,role_schema);
              }
              if (this.formsValues.roles) {
                _.each(this.formsValues.roles, function(role_data,role_name) {
                  var role_form = forms_map[role_name];
                  if (role_form) {
                    role_options = schema_map[role_name] && schema_map[role_name].options;
                    role_schema = schema_map[role_name] && schema_map[role_name].schema;
                    copyWritables(
                        role_form.data,role_form.options,role_form.schema,
                        role_data, role_options, role_schema
                    );
                  }
                }, this);
              }
            }
          }

          this.serverForms = forms;
          return forms;
        }

      },
      // statics
      {
        // errors
        ERR_CONSTRUCTOR_NO_TYPE_GIVEN: "No creation type given in constructor",
        ERR_CONSTRUCTOR_NO_WSTYPE_GIVEN: "No workspace type given in constructor"
      });

  // Module
  // ------

  _.extend(WorkspaceCreateFormCollection, {
    version: '1.0'
  });

  return WorkspaceCreateFormCollection;

});



/**
 * Created by stefang on 12.10.2015.
 */
csui.define('conws/models/metadata.controller',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/url",
  "csui/utils/base"
], function (_, $, Backbone, Url, base) {

  // handling server calls for metadata
  function MetadataController(status, options, attributes) {
    this.status = status || {};
    this.options = options || {};
    this.attributes = attributes || {};
  }

  _.extend(MetadataController.prototype, Backbone.Events, {

    save: function (model, data) {
      // Pass the data via 'attributes' param.  They would be set to the node model.

      // Note: if data does not contain common attributes,
      // it should be passed via the second param as options as the following:
      //   model.save({}, {data: data, wait: true, patch: true})
      // We'll revisit this later if such scenario arises.

      return model.save(data, {
        wait: true,
        patch: true
      });
    },

    createItem: function (model, formsValues) {
      if (!model.connector) {
        return $.Deferred().reject();
      }

      if(!!model && !!model.attributes && !!model.attributes.parent_id){
        formsValues.source_parent_id = model.attributes.parent_id;
      }

      // FormData available (IE10+, WebKit)
      var formData = new FormData();
      formData.append('body', JSON.stringify(_.extend({
        template_id: this.options.template ? this.options.template.id : undefined
      },formsValues)));

      var url = model.connector.connection.url;
      var options = {
        type: 'POST',
        //url: Url.combine(model.connector.connection.url, "nodes"),
        url: Url.combine(url&&url.replace('/v1', '/v2')||url, "businessworkspaces"),
        data: formData,
        contentType: false,
        processData: false
      };

      model.connector.extendAjaxOptions(options);

      var collection = this.options.collection;
      return model.connector.makeAjaxCall(options)
        .then(function (response) {
          // Update all attributes sent from the server. Currently there is only the id.
          // But do not propagate the events to the view.
          // As we fetch the new node to also get all actions, all change events are triggered,
          // except "change:id". But this event is not needed: only the MetadataPropertiesView
          // is listening on it, to get the create forms again.
          // But this is not needed and not desired in this case. So we are safe to do a silent set.
          model.set(response.results, { silent: true });
          //updating the model collection 
          model.collection = collection;
          model.attributes.sub_folder_id = response.results.sub_folder_id;
          return model.fetch({ collection: collection });
        });
    }

  });

  MetadataController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataController, {version: "1.0"});

  return MetadataController;
});

csui.define('conws/models/favorite.model',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  'csui/utils/url',
], function (module, $, _, Backbone, Url) {
  

  var Favorite = Backbone.Model.extend({

    constructor: function Favorite(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      //assign mode to connector so all header info is made available.
      options.connector.assignTo(this);


      var nodeid = options.node.get('id');
      if (nodeid) {
        this.set('id',nodeid);
        this.set('selected',options.node.get('favorite'));
      }
      this.listenTo(options.node,'change:id',function(){
        this.set('id',options.node.get('id'));
      })
    },

    url: function () {
      var nodeId = this.get('id'),
          url = this.connector.connection.url.replace('/v1', '/v2');
      url = Url.combine(url, 'members', 'favorites', nodeId);
      return url;
    },

    isNew: function () {
      return this.get('selected'); // this.attributes.selected
    },

    add: function () {
      this.set('selected', true);
      return this.save();
    },

    remove: function () {
      this.set('selected', false);
      return this.destroy();
    }
  });

  return Favorite;
});
/**
 * Created by stefang on 26.11.2015.
 */
// Fetches the workspace id of the effective businessworkspace for a given node.
csui.define('conws/models/workspacecontext/workspacecontext.node.model',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  "csui/utils/log",
  'csui/utils/url',
  "csui/models/resource"
], function ($, _, Backbone,
    log,
    Url,
    ResourceModel) {

  var WorkspaceContextNode = Backbone.Model.extend(
      _.defaults({

        workspaceSpecific: true,

        constructor: function WorkspaceContextNode(attributes, options) {
          options || (options = {});

          Backbone.Model.prototype.constructor.call(this, attributes, options);

          this.options = options;

          this.makeResource(options);

          this.listenTo(this.options.node, 'change:id', this.syncToNode);

          // and initially set id if it fits.
          this.syncToNode();
        },

        syncToNode: function() {
          var node = this.options.node;
          var node_id = node.get("id");
          if (node.get("type")===848) {
            this.set({id:node_id,type:848});
          }
        },

        url: function () {
          var nodeId = this.options.node.get('id');
          // URLs like /nodes/:id/blablabla
          //var url = this.node.urlBase() + '/blablabla';
          // Alternative for URLs like /businessworkspace/:id
          var url = Url.combine(this.options.connector.connection.url, 'nodes', nodeId,
              'businessworkspace');
          url = url.replace('/v2', '/v1'); // yes, we need to send a v1 call!!!
          return url;
        },

        fetch: function (options) {
          if (this.options.node.get('type')!==848) {
            log.debug("Fetching the workspace id for {0} from server.", this) && console.log(log.last);
            options || (options = {});
            // If not overridden, Use the v1 URL for GET requests
            if (!options.url) {
              options.url = _.result(this, 'url');
            }
            return this.Fetchable.fetch.call(this, options);
          } else {
            log.debug("Fetching the workspace id for {0} from node.", this) && console.log(log.last);
            this.set({id:this.options.node.get('id'),type:848});
            return $.Deferred().resolve().promise();
          }
        },

        parse: function (response) {
          return {id:response.id,type:response.type};
        },

        toString: function () {
          // Format a string for logging purposes
          return "node:" + this.get('id');
        }

      }, ResourceModel(Backbone.Model)));

  return WorkspaceContextNode;

});

/**
 * Created by stefang on 26.11.2015.
 */
csui.define('conws/models/workspacecontext/workspacecontext.node.factory',['csui/lib/underscore',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'conws/models/workspacecontext/workspacecontext.node.model'
], function (_,
    ModelFactory,
    ConnectorFactory,
    NodeModelFactory,
    WorkspaceContextNodeModel) {

  var WorkspaceContextNodeFactory = ModelFactory.extend({

    propertyPrefix: 'workspaceContextNode',

    constructor: function WorkspaceContextNodeFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var node = options.workspaceContextNode.node || context.getModel(NodeModelFactory, options),
          connector = options.workspaceContextNode.connector || context.getObject(ConnectorFactory, options);

      this.property = new WorkspaceContextNodeModel({},{connector: connector,node:node});

    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return WorkspaceContextNodeFactory;

});

/**
 * Created by stefang on 24.11.2015.
 */
csui.define('conws/models/workspacecontext/workspacecontext.model',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
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

      // get the navigation node, that triggers the workspace context node
      this.options.node = this.options.context.getModel(NodeModelFactory);

      // workspace context node is the first model in the workspace context and we fetch it first
      this.wkspid = this.getModel(WorkspaceContextNodeFactory, {node: this.options.node, connector: this.options.node.connector});

      // and provide a workspace node, for compatibility with the outer context
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
        // remember property prefix, so we find it faster next time.
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
      // First fetch workspace context node and wait for the result.
      // As we do this in the fetch, we delay the slide-in animation of the perspective,
      // so the perspective is sliding in only after we have triggered all fetches here.
      // This is for sliding in smoothly, as otherwise it is stumbling on mobiles/tablets.
      var result = this.wkspid
          .fetch()
          .then(function () {
            log.debug("wkspid old {0}, new {1}.", old_id, self.wkspid.get("id")) &&
            console.log(log.last);
            var new_id = self.wkspid.get("id");

            // then, if possible, first get values for node models from context node
            // and for all other models do a normal fetch using the factory.
            // note: node models represent persisted or non persisted nodes for an id.
            // They are triggered from outside by setting the id.
            // So if the workspace id of the workspace context node changes
            // we must set the id of all our node models in the workspace context.
            var factories = self.getFactories ? self.getFactories() : self._factories;
            var obj = _.find(factories, function (f) {return f.property === self.node});
            log.debug("going to fetch {0}.", obj.propertyPrefix) && console.log(log.last);
            var nodepromise, isWksp;
            if (new_id === self.options.node.get("id")) {
              self.node.set(self.options.node.attributes, {silent: true});
              // Check if the current workspace is already fetched.No need to fetch again
              // if the workspace is already fetched( breadcrumb/links from other widgets like
              // related,business attachments,workspaces etc.,)
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
                // Node other than a workspace - accessed via bookmark/shortcut/direct-access
                // 1) Fetch if the node is accessed directly via bookmark and workspace context is
                //    not already fetched(!old_id)
                // 2) Fetch if the node is accessed via shortcut where the workspace context is
                //    changed (old_id !== new_id)
                // 3) Skip the fetch when the node belongs to already fetched workspace
                if (!old_id || (old_id && new_id && old_id !== new_id)) {
                  nodepromise = obj.fetch();
                }
              }
            }
            // after setting the id in the node model, again get the factories to be sure, that
            // we have also the factories, that were added during the change:id propagation.
            factories = self.getFactories ? self.getFactories() : self._factories;
            var promises = _.chain(factories)
                .map(function (obj) {
                  log.debug("going to fetch {0}.", obj.propertyPrefix) && console.log(log.last);
                  if (obj.property !== self.wkspid && obj.property !== self.node) {
                    if (obj.fetch) {
                      // 1. Fetch if the workspace is accessed for the first time (isWksp)
                      // 2. Fetch if the node inside a workspace is accessed directly and the
                      //    workspace context is not fetched even once // (!old_id)
                      // 3. Fetch if the workspace is changed (ie., old_id !== new_id)
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
            // Set the workspace fetched status for subsequent workspace access via other widgets/breadcrumbs
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

/**
 * Created by stefang on 24.11.2015.
 */
csui.define('conws/models/workspacecontext/workspacecontext.factory',['csui/lib/underscore',
  'csui/utils/contexts/factories/factory',
  'conws/models/workspacecontext/workspacecontext.model'
], function (_,
    ModelFactory,
    WorkspaceContextModel) {

  var WorkspaceContextFactory = ModelFactory.extend({

    propertyPrefix: 'workspaceContext',

    constructor: function WorkspaceContextFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      this.property = new WorkspaceContextModel({}, {context: context});

    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return WorkspaceContextFactory;

});

// Lists explicit locale mappings and fallbacks

csui.define('conws/utils/previewpane/impl/nls/previewpane.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


// Defines localizable strings in the default language (English)
csui.define('conws/utils/previewpane/impl/nls/root/previewpane.lang',{
  noMetadataMessage: 'No metadata available',
  noRoleMembersMessage: 'No role members assigned',
  quickLinkTooltipText: 'Open in external system'
});


csui.define('conws/utils/previewpane/impl/previewheader.model',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang'
], function (_, Backbone, Url, base, lang) {

  var PreviewHeaderModel = Backbone.Model.extend({

    // constructor gives an explicit name to the object in the debugger
    constructor: function PreviewHeaderModel(options) {
      Backbone.Model.prototype.constructor.call(this, {
            id: options.node.get('id'),
            typeName: base.getClosestLocalizedString(options.config.typeName, ""),
            name: options.node.get('name'),
            quickLinkTooltip: lang.quickLinkTooltipText
          },
          options
      );

      options || (options = {});

      // enable the model for communication with the CS REST API
      if (options && options.node && options.node.connector) {
        options.node.connector.assignTo(this);
      }
    },

    isFetchable: function () {
      return true;
    },

    // computes the REST API URL used to access the metadata.
    url: function () {
      var url = Url.combine(this.connector.connection.url, 'businessworkspaces/' + this.get('id'));
      url = url.replace('/v1/', '/v2/');
      return url;
    },

    // parses the REST call response and stores the data
    parse: function (response) {
      var ret = response.results && response.results.data && response.results.data.business_properties;
      this.display_url = ret && ret.display_url;
      return ret;
    }
  });

  // return the model
  return PreviewHeaderModel;
});

csui.define('conws/utils/previewpane/impl/attributes.model',[
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, Url, NodeModel) {

  var config = module.config();

  var PreviewAttributesModel = Backbone.Model.extend({

    // constructor gives an explicit name to the object in the debugger
    constructor: function PreviewAttributesModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      options || (options={});

      // enable the model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }

      this.categoryId = options.categoryId;
    },

    isFetchable: function () {
      return true;
    },

    // computes the REST API URL used to access the metadata.
    url: function () {
      return Url.combine(
        this.connector.connection.url,
        '/forms/nodes/categories/update?id=' + this.get('id') + '&category_id=' + this.categoryId);
    },

    // parses the REST call response and stores the data
    parse: function (response) {
      return response.forms[0];
    }
  });

  // return the model
  return PreviewAttributesModel;
});

csui.define('conws/utils/previewpane/impl/role.model',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/base',
  'csui/utils/url',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin'
], function (_, Backbone, base, Url, NodeConnectableMixin, FetchableMixin) {

  var RoleMemberModel = Backbone.Model.extend({

        constructor: function RoleMemberModel(attributes, options) {
            Backbone.Model.prototype.constructor.call(this, attributes.member, options);

            this.memberType = attributes.memberType;
            this.member = attributes.member;
            this.roles = attributes.roles;
            this.connector = options.connector;
        },

        getLeadingRole: function () {
            var first = '';
            var lead = '';
            var roles = this.roles;
            _.each(roles, function (role) {
                first = roles[0].name;
                if (role.leader){
                    lead = role.name;
                }
            });
            return lead || first;
        },

        getRolesIndicator: function () {
            var ret = '';
            if (this.roles.length > 1) {
                ret = '+' + (this.roles.length - 1);
            }
            return ret;
        },

        getMemberType: function(){
          var ret = 'user';
            var member = this.member;
            if (member && member.type !== 0){
                ret = 'group';
            }
            return ret;
        },

        // whenever the icon url has changed, trigger model
        // change event
        setIconUrl: function(url){
            if (this.iconUrl !== url){
                this.iconUrl = url;
                this.trigger('change', this, this.options);
            }
        },

        // gets the icon url
        getIconUrl: function(){
            return this.iconUrl;
        }
    });

    var RoleMemberCollection = Backbone.Collection.extend({

        model: RoleMemberModel,

        constructor: function RoleMemberCollection(models, options) {
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            this.roleId = options.config.roleId;
            this.context = options && options.context ? options.context : undefined;
            this.makeNodeConnectable(options);
            this.makeFetchable(options);
        },

        url: function () {
            var id = this.node.get('id');
            var url = this.connector.connection.url.replace('/v1', '/v2');
            url = Url.combine(url, 'businessworkspaces', id, 'roles');
            url = url + '?fields=members';
            return url;
        },

        parse: function (response) {

            var team = {};

            var roles = response.results;
            //var members = [response.results.data.members];

            var self = this;
            _.each(roles, function (role, i) {
                if(role && role.data && role.data.properties && self.roleId === role.data.properties.name) {
                  // add display_name to role
                  var r = _.clone(role.data.properties);
                  r = _.extend({display_name: r.name}, r);
                  var hasMembers = role.data.members.length;
                  if (hasMembers) {
                    // role has members
                    _.each(role.data.members, function (member, j) {

                      var teamMember = team[member.id];
                      if (!teamMember) {
                        teamMember = {
                          data: {
                            properties: _.clone(member)
                          },
                          memberType: 'member',
                          member: _.clone(member),
                          roles: []
                        };
                        team[member.id] = teamMember;
                      }
                      teamMember.roles.push(r);
                    });
                  }
                }
            });

            // return team
            var ret = _.values(team);
            ret.sort(function (a,b) {
              var ma  = a.member, mb = b.member;
              var ret = base.localeCompareString(ma.display_name  , mb.display_name  , {usage:'sort'}) ;
              return ret;
            });
            return ret;
        }
    });

    NodeConnectableMixin.mixin(RoleMemberCollection.prototype);
    FetchableMixin.mixin(RoleMemberCollection.prototype);

    return RoleMemberCollection;
});

csui.define('conws/widgets/team/impl/team.model',['csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model',
  "csui/models/nodechildren"
], function (_, Backbone, Url, ConnectableMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, NodeChildrenCollection) {

  var TeamColumnModel = NodeChildrenColumnModel.extend({});

  var TeamColumnCollection = NodeChildrenColumnCollection.extend({

    model: TeamColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'modify_date') {
          column.sort = true;
        }
      });
      return columns;
    }

  });

  var TeamModel = NodeModel.extend({

    parse: function (response, options) {
      this.memberType = response.memberType;
      this.member = response.member;
      this.roles = response.roles;
      return NodeModel.prototype.parse.call(this, response, options);
    },

    getLeadingRole: function () {
      var first = '';
      var lead = '';
      var roles = this.roles;
      _.each(roles, function (role) {
        first = roles[0].name;
        if (role.leader) {
          lead = role.name;
        }
      });
      return lead || first;
    },

    getRolesIndicator: function () {
      var ret = '';
      if (this.roles.length > 1) {
        ret = '+' + (this.roles.length - 1);
      }
      return ret;
    },

    getMemberType: function () {
      var ret = 'user';
      var member = this.member;
      if (member && member.type !== 0) {
        ret = 'group';
      }
      return ret;
    },

    // whenever the icon url has changed, trigger model
    // change event
    setIconUrl: function (url) {
      if (this.iconUrl !== url) {
        this.iconUrl = url;
        this.trigger('change', this, this.options);
      }
    },

    // gets the icon url
    getIconUrl: function () {
      return this.iconUrl;
    }
  });

  var TeamCollection = NodeChildrenCollection.extend({

        model: TeamModel,

        constructor: function TeamCollection(attributes, options) {
          Backbone.Collection.prototype.constructor.apply(this, arguments);
          this.context = options && options.context ? options.context : undefined;
          this.makeNodeResource(options)
              .makeConnectable(options);

          this.columns = new TeamColumnCollection();
          this.listenTo(this, "sync", this._sortByName);
        },

        url: function () {
          var id = this.node.get('id');
          var url = this.connector.connection.url.replace('/v1', '/v2');
          return Url.combine(url, 'businessworkspaces', id, 'roles?fields=members');
        },

        fetch: function () {
          return this.Fetchable.fetch.apply(this, arguments);
        },

        parse: function (response) {

          var team = {};

          var roles = response.results;
          _.each(roles, function (role, i) {
            // add display_name to role
            var r = _.clone(role.data.properties);
            r = _.extend({display_name: r.name}, r);
            var hasMembers = role.data.members.length;
            if (hasMembers) {
              // role has members
              _.each(role.data.members, function (member, j) {
                var teamMember = team[member.id];
                if (!teamMember) {
                  teamMember = {
                    data: {
                      properties: _.clone(member)
                    },
                    memberType: 'member',
                    member: _.clone(member),
                    roles: []
                  };
                  team[member.id] = teamMember;
                }
                teamMember.roles.push(r);
              });
            }
            else {
              // role is empty
              var teamRole = {
                data: {
                  properties: r
                },
                memberType: 'role',
                member: undefined,
                roles: [r]
              };
              team[role.data.properties.id] = teamRole;
            }
          });

          // return team
          return _.values(team);
        },

        _sortByName: function () {
          this.comparator = function (model1, model2) {
            // sorting by memeber type -> 'role' or 'member'
            // if both from the same type, sorting by display_name
            var type1 = model1.memberType;
            var type2 = model2.memberType;

            var name1, name2;
            if (type1 === type2) {
              name1 = model1.get('display_name').toLowerCase();
              name2 = model2.get('display_name').toLowerCase();
            }
            return type1 > type2 ? 1 :
                   type1 < type2 ? -1 : type1 === type2 && name1 > name2 ? 1 :
                                        type1 === type2 && name1 < name2 ? -1 : 0;
          };
          this.sort();
        }
      }
  );

  ConnectableMixin.mixin(TeamCollection.prototype);
  return TeamCollection;

});

csui.define('conws/widgets/team/impl/team.model.factory',['module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/team/impl/team.model'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, ConnectorFactory, TeamCollection) {

    var TeamCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'team',

        constructor: function TeamCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var team = this.options.team || {};
            if (!(team instanceof Backbone.Collection)) {
                var node = context.getModel(NodeModelFactory, options),
                    connector = context.getObject(ConnectorFactory, options),
                    config = module.config();

                team = new TeamCollection(team.models, _.extend({
                    context: context,
                    node: node,
                    connector: connector
                }, team.options, config.options, {
                    autoreset: true
                }));
            }
            this.property = team;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return TeamCollectionFactory;

});

csui.define('conws/widgets/team/impl/participants.columns',[
    'csui/lib/backbone'
], function (Backbone) {

    var ParticipantsTableColumnModel = Backbone.Model.extend({

        idAttribute: 'key',

        defaults: {
            key: null,  // key from the resource definitions
            sequence: 0 // smaller number moves the column to the front
        }
    });

    var ParticipantsTableColumnCollection = Backbone.Collection.extend({

        columnNames: {
            avatar: 'conws_participantavatar',
            name: 'conws_participantname',
            roles: 'conws_participantroles',
            login: 'conws_participantlogin',
            email: 'conws_participantemail',
            department: 'conws_participantdepartment'
        },

        model: ParticipantsTableColumnModel,
        comparator: 'sequence',

        getColumnKeys: function () {
            return this.pluck('key');
        },

        deepClone: function () {
            return new ParticipantsTableColumnCollection(
                this.map(function (column) {
                    return column.attributes;
                }));
        }
    });

    // Fixed (system) columns have sequence number < 100, dynamic columns
    // have sequence number > 1000

    var tableColumns = new ParticipantsTableColumnCollection([
        {
            key: ParticipantsTableColumnCollection.prototype.columnNames.avatar,
            sequence: 10
        },
        {
            key: ParticipantsTableColumnCollection.prototype.columnNames.name,
            sequence: 20
        },
        {
            key: ParticipantsTableColumnCollection.prototype.columnNames.roles,
            sequence: 30
        },
        {
            key: ParticipantsTableColumnCollection.prototype.columnNames.login,
            sequence: 40
        },
        {
            key: ParticipantsTableColumnCollection.prototype.columnNames.email,
            sequence: 50
        },
        {
            key: ParticipantsTableColumnCollection.prototype.columnNames.department,
            sequence: 60
        }
    ]);

    return tableColumns;

});


csui.define('conws/widgets/team/impl/roles.columns',[
    'csui/lib/backbone'
], function (Backbone) {

    var RolesTableColumnModel = Backbone.Model.extend({

        idAttribute: 'key',

        defaults: {
            key: null,  // key from the resource definitions
            sequence: 0 // smaller number moves the column to the front
        }
    });

    var RolesTableColumnCollection = Backbone.Collection.extend({

        columnNames: {
            avatar: 'conws_roleavatar',
            name: 'conws_rolename',
            members: 'conws_rolemembers'
        },

        model: RolesTableColumnModel,
        comparator: 'sequence',

        getColumnKeys: function () {
            return this.pluck('key');
        },

        deepClone: function () {
            return new RolesTableColumnCollection(
                this.map(function (column) {
                    return column.attributes;
                }));
        }
    });

    // Fixed (system) columns have sequence number < 100, dynamic columns
    // have sequence number > 1000

    var tableColumns = new RolesTableColumnCollection([
        {
            key: RolesTableColumnCollection.prototype.columnNames.avatar,
            sequence: 10
        },
        {
            key: RolesTableColumnCollection.prototype.columnNames.name,
            sequence: 20
        },
        {
            key: RolesTableColumnCollection.prototype.columnNames.members,
            sequence: 30
        }
    ]);

    return tableColumns;

});


csui.define('conws/widgets/team/impl/cells/metadata',[], function () {

  function integer(key, name) {
    return {
      "allow_undefined": false,
      "bulk_shared": false,
      "default_value": null,
      "description": null,
      "hidden": false,
      "key": key,
      "max_value": null,
      "min_value": null,
      "multi_value": null,
      "name": name,
      "persona": "node",
      "read_only": false,
      "required": false,
      "title": undefined,
      "type": 2,
      "type_name": "Integer",
      "valid_values": [],
      "valid_values_name": []
    }
  }

  function string(key, name) {
    return {
      "allow_undefined": false,
      "bulk_shared": false,
      "default_value": null,
      "description": null,
      "hidden": false,
      "key": key,
      "max_length": null,
      "min_length": null,
      "multiline": false,
      "multilingual": false,
      "multi_value": false,
      "name": name,
      "password": false,
      "persona": "",
      "read_only": false,
      "regex": "",
      "required": true,
      "title": undefined,
      "type": -1,
      "type_name": "String",
      "valid_values": [],
      "valid_values_name": []
    }
  }

  return {
    integer: integer,
    string: string
  }
});
csui.define('conws/widgets/team/impl/roles.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/base'
], function (_, $, Backbone, base) {

  var RoleModel = Backbone.Model.extend({

    constructor: function RoleModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var RolesCollection = Backbone.Collection.extend({
    model: RoleModel,

    constructor: function RolesCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    comparator: function (left, right) {
      return base.localeCompareString(left.get('name'), right.get('name'));
    },

    // Filter method for the roles collection, used from the two roles lists in the role dialog
    // The method filters the roles for a given value, the filter is done case insensitive (toLowerCase)
    filterList: function (value) {
      if (!_.isUndefined(value) && value.length > 0) {
        var models = this.filter(function (model) {
          var name = model.get('name').toLowerCase();
          return name.indexOf(value.toLowerCase()) > -1;
        });

        return new Backbone.Collection(models);
      } else {
        return this;
      }
    }

  });

  return RolesCollection;
});

// Lists explicit locale mappings and fallbacks

csui.define('conws/widgets/team/impl/nls/team.lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});


// Defines localizable strings in the default language (English)
csui.define('conws/widgets/team/impl/nls/root/team.lang',{
  dialogTitle: 'Team',
  noResultsPlaceholder: 'No team configured for this business workspace.',
  zeroRecordsOrFilteredParticipants: 'This business workspace has no participants, or no participants match your search criteria. Add new participants, or clear the search box.',
  zeroRecordsOrFilteredRoles: 'This business workspace has no roles, or no roles match your search criteria. Add new roles, or clear the search box.',

  searchAria: 'Search for team members',
  expandAria: 'Expand the team widget',

  participantNameColTitle: 'Name',
  participantAvatarColTitle: 'Avatar',
  participantRolesColTitle: 'Roles',
  participantLoginColTitle: 'Login',
  participantEmailColTitle: 'Business e-mail',
  participantDepartmentColTitle: 'Department',
  participantRrolesColTooltip: 'View or edit participant role memberships',

  participantStateNew: 'Newly added participant',

  userRolesDialogTitle: 'Roles for user {0}',
  groupRolesDialogTitle: 'Roles for group {0}',
  rolesAvatarColTitle: 'Avatar',
  rolesNameColTitle: 'Name',
  rolesNameColTooltip: 'View or edit role details',
  rolesNameColTeamLead: 'Team lead',
  rolesNameColInherited: 'Inherited',
  rolesParticipantsColTitle: 'Participants',
  rolesParticipantsColTooltip: 'Participants',
  rolesParticipantsColNoParticipants: 'No participants',

  rolesDialogAssignedRoles: 'Assigned roles',
  rolesDialogTooltipAssignedRoles: 'assigned roles',
  rolesDialogAvailableRoles: 'Available roles',
  rolesDialogTooltipAvailableRoles: 'available roles',

  rolesDialogRemoveParticipant1: 'This participant is not a member of any role. A participant with no roles will be removed from the team.',
  rolesDialogRemoveParticipant2: 'You can assign new roles to keep the participant in the team.',
  rolesDialogRemoveParticipantWarning: 'Warning',
  rolesDialogRemoveRole: 'Remove role',

  rolesDialogButtonClose: 'Close',
  rolesDialogButtonSave: 'Save',
  rolesDialogButtonCancel: 'Cancel',
  rolesDialogButtonReset: 'Reset',
  rolesDialogButtonRemove: 'Remove',

  rolesEditDialogErrorTitleUser: 'Cannot save roles for user {0}.',
  rolesEditDialogErrorTitleGroup: 'Cannot save roles for group {0}.',

  rolesEditDialogSuccessfulAdded: 'Roles successfully added:',
  rolesEditDialogSuccessfulRemoved: 'Roles successfully removed:',
  rolesEditDialogNotAdded: 'Roles not added:',
  rolesEditDialogNotRemoved: 'Roles not removed:',
  rolesEditDialogDataNotUptoDateUser: 'Roles for this user have been changed by someone else.',
  rolesEditDialogDataNotUptoDateGroup: 'Roles for this group have been changed by someone else.',

  searchPlaceholder: 'Search {0}',
  searchIconTooltip: '{0}',
  searchClearIconTooltip: 'Clear filter',

  roleDetailsTitle: 'Role details',
  roleDetailsName: 'Role name',
  roleDetailsDescription: 'Description',
  roleDetailsPermissions: 'Permissions',
  roleDetailsRead: 'Read',
  roleDetailsWrite: 'Write',
  roleDetailsManage: 'Manage',
  roleDetailsAdvanced: 'Advanced',

  addParticipantsTitle: 'Add participants',
  addParticipantsRolesHelp: 'All participants must have a role.',
  addParticipantsUserPickerPlaceholder: 'Enter a name.',
  addParticipantsRolePickerPlaceholder: 'Assign the same role to all.',
  addParticipantsRolePickerPlaceholderMore: 'Assign role.',
  addParticipantsRolePickerClear: 'Clear search value',
  addParticipantsRolePickerShow: 'Show available roles',
  addParticipantsSearchAria: 'Search for participants',
  addParticipantsButtonClear: 'Clear all',
  addParticipantsButtonSave: 'Save',
  addParticipantsButtonCancel: 'Cancel',
  addParticipantsDisabledMemberMessage: 'Is already a participant.',
  addParticipantsErrorMessageDefault: 'Cannot add one or more participants.',
  addParticipantsRemove: 'Remove participant',
  removeParticipantAria: 'Remove participant {0}'
});


csui.define('conws/widgets/team/impl/participant.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/nodeconnectable',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  'conws/widgets/team/impl/cells/metadata',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.model',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, $, Backbone, Url, NodeConnectableModel, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, NodeChildrenCollection, Metadata,
    ParticipantsTableColumnCollection, Roles, lang) {

  // TODO: ParticipantModel and TeamModel have the same implementation. Refactor to have
  // TODO: a base implementation.
  var ParticipantModel = NodeModel.extend({

    constructor: function ParticipantModel(attributes, options) {
      NodeModel.prototype.constructor.apply(this, arguments);
      // update the participant attributes
      this.set({
        'conws_participantname': this.displayName(),
        'conws_participantroles': this.displayRoles(),
        'conws_participantlogin': this.displayLogin(),
        'conws_participantemail': this.displayEmail(),
        'conws_participantdepartment': this.displayDepartment()
      });
    },

    parse: function (response, options) {
      if (!_.isUndefined(options.parse) && options.parse === false) {
        return this;
      }
      this.roles = new Roles(response.roles);

      return NodeModel.prototype.parse.call(this, response, options);
    },

    save: function (data, options) {

      if (!this.collection || !this.collection.node) {
        return;
      }

      var id = this.collection.node.get('id');
      var url = this.connector.connection.url.replace('/v1', '/v2');
      var memberId = this.get('id');

      var successRemove = [];
      var errorRemove = [];
      var successAdd = [];
      var errorAdd = [];

      // add all new roles, which is transformed into an add member call for the role
      _.each(data.add, function (role) {
        var roleId = role.get('id');
        var postUrl = Url.combine(url, 'businessworkspaces', id, 'roles', roleId, 'members');

        // FormData available (IE10+, WebKit)
        var formData = new FormData();
        formData.append('body', '{"id":' + memberId + '}');

        var options = {
          type: 'POST',
          url: postUrl,
          async: false, // set the call as synchronous, so that one call after the other is done and the results are collected
          data: formData,
          contentType: false,
          processData: false
        };
        this.connector && this.connector.extendAjaxOptions(options);

        // do the AJAX call
        this.connector.makeAjaxCall(options).done(_.bind(function (response) {
              successAdd.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this))
            .fail(_.bind(function (response) {
              errorAdd.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this));
      }, this);

      // remove all marked roles, which is transformed into a remove member call for the role
      _.each(data.remove, function (role) {
        var roleId = role.get('id');
        var delUrl = Url.combine(url, 'businessworkspaces', id, 'roles', roleId, 'members',
            memberId);

        var options = {
          type: 'DELETE',
          url: delUrl,
          async: false // set the call as synchronous, so that one call after the other is done and the results are collected
        };
        this.connector && this.connector.extendAjaxOptions(options);

        // do the AJAX call
        this.connector.makeAjaxCall(options).done(_.bind(function (response) {
              successRemove.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this))
            .fail(_.bind(function (response) {
              errorRemove.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this));
      }, this);

      // call the registered callbacks
      if (errorAdd.length <= 0 && errorRemove.length <= 0) {
        if (!_.isUndefined(options.success)) {
          options.success({successAdd: successAdd, successRemove: successRemove});
        }
      } else {
        if (!_.isUndefined(options.error)) {
          options.error({
            successAdd: successAdd,
            errorAdd: errorAdd,
            successRemove: successRemove,
            errorRemove: errorRemove
          });
        }
      }
    },

    displayName: function () {
      return this.get('display_name');
    },

    displayRoles: function () {
      var ret = this.getLeadingRole();
      if (ret) {
        var indicator = this.getRolesIndicator();
        if (indicator) {
          ret = ret + ' ' + indicator;
        }
      }
      return ret;
    },

    displayLogin: function () {
      var ret = '';
      if (this.getMemberType() === 'user') {
        ret = this.get('name');
      }
      return ret;
    },

    displayEmail: function () {
      var ret = this.get('business_email');
      if (_.isUndefined(ret) || _.isNull(ret)) {
        ret = '';
      }
      return ret;
    },

    displayTitle: function () {
      var ret = this.get('title');
      return ret;
    },

    displayOffice: function () {
      var ret = this.get('office_location');
      return ret;
    },

    displayDepartment: function () {
      // either the group name is stored in
      // the 'group_name' property, or in the
      // expanded 'group_id' object.
      var ret = this.get('group_name');
      if (_.isUndefined(ret)) {
        var group = this.get('group_id');
        if (_.isObject(group)) {
          ret = group.name;
        }
      }
      return ret;
    },

    getLeadingRole: function () {
      var first = '';
      var lead = '';
      var roles = this.roles;

      if (roles && (roles.length > 0)) {
        first = roles.at(0).get('name');
        roles.each(function (role) {
          if (role.get('leader')) {
            lead = role.get('name');
          }
        });
      }
      return lead || first;
    },

    canEdit: function () {
      var roles = this.collection.availableRoles;
      var edit = roles.find(function (role) {
        // the role can be edited by the current user and is not inherited from parent
        return (role.get('actions').actionEdit && _.isNull(role.get('inherited_from_id')));
      });
      // exits a role with the edit permission
      return !_.isUndefined(edit);
    },

    canRemove: function () {
      var roles = this.roles;
      var editable = roles.filter(function (role) {
        // the role can be edited by the current user and is not inherited from parent
        return (role.get('actions').actionEdit && _.isNull(role.get('inherited_from_id')));
      });
      // all participant roles must be editable
      return (roles.length === editable.length);
    },

    getRolesIndicator: function () {
      var ret = '';
      if (this.roles.length > 1) {
        ret = '+' + (this.roles.length - 1);
      }
      return ret;
    },

    getMemberType: function () {
      var ret = 'user';
      if (this.get('type') !== 0) {
        ret = 'group';
      }
      return ret;
    },

    // whenever the icon url has changed, trigger model
    // change event
    setIconUrl: function (url) {
      if (this.iconUrl !== url) {
        this.iconUrl = url;
        this.trigger('change', this, this.options);
      }
    },

    // gets the icon url
    getIconUrl: function () {
      return this.iconUrl;
    }

  });

  return ParticipantModel;

});

csui.define('conws/widgets/team/impl/participants.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/base',
  'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  'csui/models/browsable/client-side.mixin',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/cells/metadata',
  'conws/widgets/team/impl/participant.model',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.model',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, base, Url, ConnectableMixin, NodeConnectableMixin, FetchableMixin,
    NodeChildrenColumnModel, NodeChildrenColumnCollection, NodeModel, NodeChildrenCollection,
    ClientSideBrowsableMixin, WorkspaceContextFactory, Metadata, ParticipantModel,
    ParticipantsTableColumnCollection, Roles, lang) {

  var ParticipantsColumnModel = NodeChildrenColumnModel.extend({
    constructor: function ParticipantsColumnModel() {
      NodeChildrenColumnModel.prototype.constructor.apply(this, arguments);
    }
  });

  var ParticipantsColumnCollection = NodeChildrenColumnCollection.extend({

    model: ParticipantsColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      // get column collection
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      // enable sorting for all columns except 'avatar' column.
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey !== ParticipantsTableColumnCollection.columnNames.avatar) {
          column.sort = true;
        }
      });
      // return
      return columns;
    }
  });

  // TODO: ParticipantCollection and TeamCollection differ only in the parsing
  // TODO: function. Refactor to have a base implementation.
  var ParticipantCollection = Backbone.Collection.extend({

        model: ParticipantModel,

        // a property which contains all available roles
        availableRoles: new Roles(),

        constructor: function ParticipantCollection(attributes, options) {
          _.defaults(options, {orderBy:  ParticipantsTableColumnCollection.columnNames.name + ' asc'});
          Backbone.Collection.prototype.constructor.apply(this, arguments);

          // Support collection cloning
          if (options) {
            this.options = _.pick(options, ['connector', 'context', 'autoreset', 'node',
              'includeResources', 'fields', 'expand', 'commands']);
          }
          this.makeConnectable(options)
              .makeNodeConnectable(options)
              .makeFetchable(options)
              .makeClientSideBrowsable(options);
          // get workspace context
          if (options !== undefined) {
            if (!options.workspaceContext) {
              options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
            }
            this.workspaceContext = options.workspaceContext;
          }
          this.columns = new ParticipantsColumnCollection();
        },

        url: function () {
          var id = this.node.get('id');
          var url = this.connector.connection.url.replace('/v1', '/v2');
          return Url.combine(url, 'businessworkspaces', id, 'roles?fields=members');
        },

        parse: function (response) {

          var team = {};
          var availableRoles = [];

          // we don't want empty roles to be displayed in the
          // participants list, so only roles with members are parsed.
          var roles = response.results;
          _.each(roles, function (role, i) {

            var r = _.clone(role.data.properties);

            // get the possible actions for the role
            var a = {};
            a.actionDelete = !_.isUndefined(role.actions.data['delete-role']);
            a.actionEdit = !_.isUndefined(role.actions.data['edit-role']);
            // add the actions to the cloned roles object
            r = _.extend({actions: a}, r);
            // add display name to role
            r = _.extend({display_name: r.name}, r);

            // add all roles to this array
            availableRoles.push(r);

            var hasMembers = role.data.members.length;
            if (hasMembers) {
              // role has members
              _.each(role.data.members, function (member, j) {

                var teamMember = team[member.id];
                if (!teamMember) {
                  teamMember = {
                    data: {
                      properties: member
                    },
                    member: member,
                    roles: []
                  };
                  team[member.id] = teamMember;
                }
                teamMember.roles.push(r);
              });
            }
          });

          // create metadata for custom column models
          var metadata = {
            conws_participantavatar: Metadata.integer(
                ParticipantsTableColumnCollection.columnNames.avatar,
                lang.participantAvatarColTitle),
            conws_participantname: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.name,
                lang.participantNameColTitle),
            conws_participantroles: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.roles,
                lang.participantRolesColTitle),
            conws_participantlogin: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.login,
                lang.participantLoginColTitle),
            conws_participantemail: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.email,
                lang.participantEmailColTitle),
            conws_participantdepartment: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.department,
                lang.participantDepartmentColTitle)
          };

          // create column models
          this.columns && this.columns.resetCollection(
              this.columns.getColumnModels(_.keys(metadata), metadata), this.options);

          // build a roles model with all available roles
          this.availableRoles = new Roles(availableRoles);

          // return team
          return _.values(team);
        },

        clone: function () {
          // Provide the options; they may include connector and other parameters
          var clone = new this.constructor(this.models, this.options);
          // Clone sub-models not covered by Backbone
          if (this.columns) {
            clone.columns.reset(this.columns.toJSON());
          }
          // Clone properties about the full (not-yet fetched) collection
          clone.actualSkipCount = this.actualSkipCount;
          clone.totalCount = this.totalCount;
          clone.filteredCount = this.filteredCount;
          return clone;
        },

        addNewParticipant: function (model) {
          // clone the model, as otherwise strange behaviour can occur when
          // saving the model the same time. E.g. the add participant dialog
          // doesn't close after safe.
          // We do not know the exact cause, but cloning helps ;-)
          var clone = model.clone();

          var exist = false;
          if (!_.isUndefined(this.newParticipants) && this.newParticipants.length > 0) {
            for (var participant in this.newParticipants) {
              if (this.newParticipants[participant].get('id') === clone.get('id')) {
                exist = true;
                break;
              }
            }
          }
          if (!exist) {
            clone.set({isNew: true});
            this.newParticipants.push(clone);
          }
        },

        setNewParticipant: function () {
          if (!_.isUndefined(this.newParticipants) && this.newParticipants.length > 0) {
            for (var participant in this.newParticipants) {
              for (var item in this.models) {
                if (this.models[item].get('id') ===
                    this.newParticipants[participant].get('id')) {
                  this.models[item].set({isNew: true});
                }
              }
            }
          }
        }
      }
  );
  ClientSideBrowsableMixin.mixin(ParticipantCollection.prototype);
  ConnectableMixin.mixin(ParticipantCollection.prototype);
  NodeConnectableMixin.mixin(ParticipantCollection.prototype);
  FetchableMixin.mixin(ParticipantCollection.prototype);
  return ParticipantCollection;

});

csui.define('conws/widgets/team/impl/participants.model.factory',['module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/team/impl/participants.model',
    'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, ConnectorFactory, ParticipantCollection) {
  
    var ParticipantCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'participants',

        constructor: function ParticipantCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var participants = this.options.participants || {};
            if (!(participants instanceof Backbone.Collection)) {
                var node = context.getModel(NodeModelFactory, options),
                    connector = context.getObject(ConnectorFactory, options),
                    config = module.config();

                participants = new ParticipantCollection(participants.models, _.extend({
                    context: context,
                    node: node,
                    connector: connector
                }, participants.options, config.options,
                    ParticipantCollectionFactory.getDefaultResourceScope(), {
                      autoreset: true
                    }));
            }
            this.property = participants;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }
    }, {
      getDefaultResourceScope: function () {
        return _.deepClone({
          // Return only assignment-specific properties
          fields: {
            properties: [],
            'versions.element(0)': []
          },
          // User information needs to be resolved to support UI and actions.
          expand: {
            properties: []
          },
          // Get property definitions to support table columns or similar
          // and actions to support clickability and others
          includeResources: ['metadata']
        });
      }
    });

    return ParticipantCollectionFactory;
});


csui.define('conws/widgets/team/impl/roles.model.expanded',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/base',
  'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  'csui/models/browsable/client-side.mixin',
  'conws/widgets/team/impl/cells/metadata',
  'conws/widgets/team/impl/roles.columns',
  'conws/widgets/team/impl/participant.model',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, $, Backbone, base, Url, ConnectableMixin, NodeConnectableMixin, FetchableMixin,
    NodeChildrenColumnModel, NodeChildrenColumnCollection, NodeModel, NodeChildrenCollection,
    ClientSideBrowsableMixin, Metadata, RolesTableColumnCollection, ParticipantModel, lang) {

  var RolesColumnModel = NodeChildrenColumnModel.extend({
    constructor: function RolesColumnModel() {
      NodeChildrenColumnModel.prototype.constructor.apply(this, arguments);
    }
  });

  var RolesColumnCollection = NodeChildrenColumnCollection.extend({

    model: RolesColumnModel,

    // private
    getColumnModels: function (columnKeys, definitions) {
      // get column collection
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      // enable sorting for all columns except 'avatar' column.
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey !== RolesTableColumnCollection.columnNames.avatar) {
          column.sort = true;
        }
      });
      // return
      return columns;
    }
  });

  // TODO: RolesModel and TeamModel have the same implementation. Refactor to have
  // TODO: a base implementation.
  var RoleModel = NodeModel.extend({

    constructor: function RoleModel(attributes, options) {
      NodeModel.prototype.constructor.apply(this, arguments);
      // update the role attributes
      this.set({
        'conws_rolename': this.displayName(),
        'conws_rolemembers': this.displayMembers()
      });
    },

    url: function () {
      var wid = this.collection && this.collection.node && this.collection.node.get('id');
      var rid = this.get('id');
      var url = this.connector.connection.url.replace('/v1', '/v2');
      return Url.combine(url, 'businessworkspaces', wid, 'roles', rid);
    },

    parse: function (response, options) {

      var self = this;
      // members
      var col = new Backbone.Collection();

      // comperator for members collection using the display name
      col.comparator = function (m1, m2) {
        var ret1 = m1.get('display_name');
        var ret2 = m2.get('display_name');

        return ret1.localeCompare(ret2);
      }

      _.each(response.data.members, function (m) {
        var mm = new ParticipantModel(m, options);
        col.push(mm);
      });

      // sort the members collection for the role
      col.sort();

      this.members = col;
      // parse
      return NodeModel.prototype.parse.call(this, response, options);
    },

    displayName: function () {
      var ret = this.get('display_name');
      return ret;
    },

    displayMembers: function () {
      var ret = this.getLeadingMember();
      if (ret) {
        var indicator = this.getMembersIndicator();
        if (indicator) {
          ret = ret + ' ' + indicator;
        }
      }
      return ret;
    },

    getLeadingMember: function () {
      var first = '';
      if (this.members && this.members.length > 0) {
        first = this.getMemberName(this.members.at(0));
      }
      return first;
    },

    getMembersIndicator: function () {
      var ret = '';
      if (this.members.length > 1) {
        ret = '+' + (this.members.length - 1);
      }
      return ret;
    },

    getMemberName: function (member) {
      var ret = '';
      if (member) {
        ret = member.get('display_name') ? member.get('display_name') : member.get('name');
      }
      return ret;
    },

    getMemberType: function () {
      return 'role';
    },

    // whenever the icon url has changed, trigger model
    // change event
    setIconUrl: function (url) {
      if (this.iconUrl !== url) {
        this.iconUrl = url;
        this.trigger('change', this, this.options);
      }
    },

    // gets the icon url
    getIconUrl: function () {
      return this.iconUrl;
    },

    // evaluates the 'delete-role' action and returns
    // true if available
    canDelete: function () {
      return (this.actions.get('delete-role') !== undefined);
    }
  });

  // TODO: RoleCollection and TeamCollection differ only in the parsing
  // TODO: function. Refactor to have a base implementation.
  var RoleCollection = Backbone.Collection.extend({

        model: RoleModel,

        constructor: function RoleCollection(attributes, options) {
          _.defaults(options, {orderBy:  RolesTableColumnCollection.columnNames.name + ' asc'});
          Backbone.Collection.prototype.constructor.apply(this, arguments);
          this.context = options && options.context ? options.context : undefined;
          // Support collection cloning
          if (options) {
            this.options = _.pick(options, ['connector', 'context', 'autoreset', 'node',
              'includeResources', 'fields', 'expand', 'commands']);
          }
          this.makeConnectable(options)
              .makeNodeConnectable(options)
              .makeFetchable(options)
              .makeClientSideBrowsable(options);

          this.columns = new RolesColumnCollection();
        },

        clone: function () {
          // Provide the options; they may include connector and other parameters
          var clone = new this.constructor(this.models, this.options);
          // Clone sub-models not covered by Backbone
          if (this.columns) {
            clone.columns.reset(this.columns.toJSON());
          }
          // Clone properties about the full (not-yet fetched) collection
          clone.actualSkipCount = this.actualSkipCount;
          clone.totalCount = this.totalCount;
          clone.filteredCount = this.filteredCount;
          return clone;
        },

        url: function () {
          var id = this.node.get('id');
          var url = this.connector.connection.url.replace('/v1', '/v2');
          return Url.combine(url, 'businessworkspaces', id, 'roles?fields=members');
        },

        parse: function (response) {

          // roles
          var roles = response.results;
          _.each(roles, function (role) {
            // add display name to role
            role.data.properties = _.extend({display_name: role.data.properties.name},
                role.data.properties);
          });

          // create metadata for custom column models
          var metadata = {
            conws_roleavatar: Metadata.integer(
                RolesTableColumnCollection.columnNames.avatar, lang.rolesAvatarColTitle),
            conws_rolename: Metadata.string(
                RolesTableColumnCollection.columnNames.name, lang.rolesNameColTitle),
            conws_rolemembers: Metadata.string(
                RolesTableColumnCollection.columnNames.roles, lang.rolesParticipantsColTitle)
          };

          // create column models
          this.columns && this.columns.resetCollection(
              this.columns.getColumnModels(_.keys(metadata), metadata), this.options);

          // return roles
          return roles;
        }
      }
  );
  ClientSideBrowsableMixin.mixin(RoleCollection.prototype);
  ConnectableMixin.mixin(RoleCollection.prototype);
  NodeConnectableMixin.mixin(RoleCollection.prototype);
  FetchableMixin.mixin(RoleCollection.prototype);
  return RoleCollection;

});

csui.define('conws/widgets/team/impl/roles.model.factory',['module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/team/impl/roles.model.expanded'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, ConnectorFactory, RolesCollection) {

    var RoleCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'roles',

        constructor: function RoleCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var roles = this.options.roles || {};
            if (!(roles instanceof Backbone.Collection)) {
                var node = context.getModel(NodeModelFactory, options),
                    connector = context.getObject(ConnectorFactory, options),
                    config = module.config();

                roles = new RolesCollection(roles.models, _.extend({
                    context: context,
                    node: node,
                    connector: connector
                }, roles.options, config.options, {
                    autoreset: true
                }));
            }
            this.property = roles;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }
    });

    return RoleCollectionFactory;
});

csui.define('conws/widgets/team/impl/controls/filter/impl/filter.model',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone'
], function ($, _, Backbone) {

  var FilterModel = Backbone.Model.extend({

    defaults: {
      // the filter header control caption
      caption: '',
      // the tooltip for the filter control
      tooltip: '',
      // the filter value
      filter: '',
      // defines whether the filter elements are active or not
      active: true,
      // defines whether the search box is visible or not
      showSearch: false
    },

    constructor: function FilterModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });

  // return the model
  return FilterModel;

});


csui.define('conws/models/categoryforms/categoryforms.model',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
    "csui/utils/log", "csui/utils/base", 'csui/utils/url',
    "csui/models/appliedcategoryform",
    'csui/models/mixins/node.connectable/node.connectable.mixin',
    'csui/models/mixins/fetchable/fetchable.mixin'
], function (module, $, _, Backbone, log, base, Url, AppliedCategoryFormModel,
    NodeConnectableMixin, FetchableMixin) {

    

    var CategoryFormCollection = Backbone.Collection.extend({

        constructor: function CategoryFormCollection(models, options) {

            this.isReadOnly = true;
            this.options = options;
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            this.makeNodeConnectable(options);
            this.makeFetchable(options);
        },

        sync: function (method, model, options) {

            if (method === 'read') {
                if (this.node.get("id")) {
                    options.categoryFilter = this.options.categoryFilter;
                    return this._getMetadataForms(method, model, options);
                }
            } else {
                // create/delete/update
                return Backbone.Collection.prototype.sync.apply(this, arguments);
            }

        },

        // Get metadata forms for an existing node
        _getMetadataForms: function (method, model, options) {

            var deferred = $.Deferred();

            model.trigger('request', model, undefined, options);

            // filter categories to be fetched
            var categoryFilter = options.categoryFilter;

            // fetch categories
            var node = this.node;
            var catsUrl = Url.combine(node.urlBase(), 'categories');
            this.connector.makeAjaxCall(this.connector.extendAjaxOptions({
                type: 'GET',
                url: catsUrl
            }))
                .done(_.bind(function (data) {

                    // get read-only flag
                    var actionsUrl = Url.combine(node.urlBase(), 'categories/actions');
                    this.connector.makeAjaxCall(this.connector.extendAjaxOptions({
                        type: 'GET',
                        url: actionsUrl
                    }))
                        .done(_.bind(function (data2) {

                            this.isReadOnly = data2.data === null || !data2.data.hasOwnProperty("categories_add");

                            // have categories -> fetch forms
                            var promises = [],
                                forms = [];

                            // category form models
                            _.each(data.data, function (curCategory) {
                                if (!categoryFilter || _.contains(categoryFilter, curCategory.id)) {
                                    var nodeId = node.get('id');
                                    var categoryId = curCategory.id;
                                    var catModel = new AppliedCategoryFormModel({
                                        id: curCategory.id,
                                        title: curCategory.name,
                                        allow_delete: true
                                    }, {
                                        node: node,
                                        categoryId: categoryId,
                                        action: 'update'
                                    });
                                    if (this.options.reset || this.options.autoreset) {
                                        forms.push(catModel);
                                    } else {
                                        this.add(catModel);
                                    }
                                    promises.push(catModel.fetch());
                                }
                            }, this);

                            $.when.apply($, promises).then(
                                _.bind(function () {
                                    if (options.success) {
                                        options.success(forms, 'success');
                                    }
                                    deferred.resolve();
                                }, this),
                                _.bind(function () {
                                    if (options.error) {
                                        options.error.apply(options.error, arguments);
                                    }
                                    deferred.reject();
                                }));

                        }, this))
                        .fail(_.bind(function () {
                            deferred.reject();
                        }, this));

                }, this))
                .fail(_.bind(function () {
                    deferred.reject();
                }, this));

            return deferred.promise();

        },

    });

    NodeConnectableMixin.mixin(CategoryFormCollection.prototype);
    FetchableMixin.mixin(CategoryFormCollection.prototype);

    return CategoryFormCollection;

});

csui.define('conws/models/selectedmetadataform/selectedmetadataform.model',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
    'csui/utils/url', 'csui/utils/base',
    'conws/models/categoryforms/categoryforms.model'
], function (module, $, _, Backbone, Url, BaseUtils, CategoryFormCollection) {

    

  function updateData(groupNames,data,changes) {
    _.each(groupNames,function(groupId){
      if (data[groupId]) {
        updateData(groupNames,data[groupId],changes);
      }
    });
    _.each(changes,function(value,propertyId){
      // should not occur, that a propertyId starts with the group prefix.
      // but for safety, we check it, and do nothing if it occurs.
      if (propertyId.indexOf("conwsgroup_")<0) {
        if (data.hasOwnProperty(propertyId)) {
          data[propertyId] = value;
        }
      }
    });
  }
    var SelectedMetadataFormModel = Backbone.Model.extend({

        constructor: function SelectedMetadataFormModel(attributes, options) {

            this.node = options.node;

            if(options.metadataConfig) {
                this.metadataConfig = options.metadataConfig.metadata;
                this.hideEmptyFields = options.metadataConfig.hideEmptyFields || false;
                this.isReadOnly = options.metadataConfig.readonly ? true : false;
            }

            this.categoryForms = this.metadataConfig && new CategoryFormCollection(undefined, {
                    node: options.node,
                    autofetch: true,
                    autoreset: true,
                    categoryFilter: this._createCategoryFilter(this.metadataConfig)
                });

            Backbone.Model.prototype.constructor.call(this, attributes, options);

            this.categoryForms && this.listenTo(this.categoryForms, 'reset', function () {
                this.update(this.metadataConfig);
            });
        },

        fetch: function (options) {
            return this.categoryForms && this.categoryForms.fetch(options)
                    .done(_.bind(this._saveData,this));
        },

        _getChanges: function (catModel) {
            var changes = catModel.get("data");
            var schema = catModel.get("schema");
            var options = catModel.get('options');
            var key;

            // workaround for LPAD-47456: set value of hidden string fields
            // to "" instead of null
            for (key in options.fields) {
                if(options.fields[key].hidden === true) {
                    if(schema.properties[key].type === 'string') {
                        if(key in changes && changes[key] === null) {
                            changes[key] = "";
                        }
                    }
                }
            }

            return changes;
        },

        _createCategoryFilter: function (config) {
            var categoryFilter = [];
            _.each(config, function (configElement) {
                if (configElement.type === "attribute" || configElement.type === "category") {
                    if (!_.contains(categoryFilter, configElement.categoryId)) {
                        categoryFilter.push(configElement.categoryId);
                    }
                } else if (configElement.type === "group") {
                    var innerCategoryFilter = this._createCategoryFilter(configElement.attributes);
                    _.each(innerCategoryFilter, function (innerCategory) {
                        if (!_.contains(categoryFilter, innerCategory)) {
                            categoryFilter.push(innerCategory);
                        }
                    })
                }
            }, this);
            return categoryFilter;
        },

      _saveData: function() {
        function flatten(groupNames,oldData,data) {
          _.each(groupNames,function(groupId) {
            var groupData = data[groupId];
            if (groupData) {
              delete data[groupId];
              flatten(groupNames,oldData,groupData);
              _.extend(oldData,groupData);
            }
          });
        }
        var data = this.get("data");
        this.oldData = data? JSON.parse(JSON.stringify(data)) : {};
        flatten(this.groupNames,this.oldData,this.oldData);
      },

      restoreData: function (changes) {
        var restore = _.pick(this.oldData,_.keys(changes));
        restore = JSON.parse(JSON.stringify(restore));
        updateData(this.groupNames,this.get("data"),restore);
        return restore;
      },

      updateData: function (changes) {
          updateData(this.groupNames,this.get("data"),changes);
          this._saveData();
        },

      update: function (config) {

        // Initialize backbone model with empty objects - will be filled afterwards
        var data = {};
        var schema = {properties: {}};
        var options = {fields: {}};

        // Provide easy access to backbone model
        var destinationModel = {
          data: data,
          properties: schema.properties,
          fields: options.fields,
		  title:""
        };

        this.groupCnt = 1;
        this.groupNames = [];

        this._fillModel(config, destinationModel);
        this.set({data: data, schema: schema, options: options}); // triggers change event
        this._saveData();
      },

        _fillModel: function (config, destinationModel, prefix) {
            // Iterate over all metadata sections of widget configuration
            _.each(config, function (configElement) {
                if (configElement.type === "attribute") { // Single attribute row
                    this._createAttribute(configElement, destinationModel, prefix);
                } else if (configElement.type === "category") {  // All attributes of a category
                    this._createCategory(configElement, destinationModel, prefix);
                } else if (configElement.type === "group") { // Group of attributes
                    // Create an artifact using set schema, as expected by FormView
                    var groupId = "conwsgroup_" + this.groupCnt++; // Define a unique group name
					var groupName = configElement.label;
                    this.groupNames.push(groupId);
                    var innerData = {};
                    var innerProperties = {properties: {}};
                    var innerFields = {
                        label: BaseUtils.getClosestLocalizedString(configElement.label, "Undefined"),
                        fields: {}
                    };
                    var innerDestinationModel = {
                        data: innerData,
                        properties: innerProperties.properties,
                        fields: innerFields.fields,
						title:""
                    };
                    this._fillModel(configElement.attributes, innerDestinationModel, groupName);
                    if (!_.isEmpty(innerData)) { // empty groups are hidden
						// instead of using groupId we are now using group name
                        destinationModel.data[groupName] = innerData;
                        destinationModel.properties[groupName] = innerProperties;
                        destinationModel.fields[groupName] = innerFields;
                    }
                }
            }, this);
        },

        _createAttribute: function (configElement, destinationModel, prefix) {
            var fieldId = configElement.categoryId + "_" + configElement.attributeId;
            _.each(this.categoryForms.models, function (modelElement) {
                if (configElement.categoryId === modelElement.id) {
                    var sourceModel;
                    if (configElement.columnId) {
                        var setType = modelElement.attributes.schema.properties[fieldId].type;
                        if (setType === "object") { // single-row set
                            var subFieldId = fieldId + "_1_" + configElement.columnId;
                            sourceModel = {
                                data: modelElement.attributes.data[fieldId],
                                properties: modelElement.attributes.schema.properties[fieldId].properties,
                                fields: modelElement.attributes.options.fields[fieldId].fields
                            };
                            this._createRow(subFieldId, configElement, destinationModel, sourceModel, prefix);
                        } else if (setType === "array") { // multi-row set (has a different, more complex structure)
                            var subFieldId = fieldId + "_x_" + configElement.columnId;
                            sourceModel = {
                                data: modelElement.attributes.data[fieldId][0],
                                properties: modelElement.attributes.schema.properties[fieldId].items.properties,
                                fields: modelElement.attributes.options.fields[fieldId].fields.item.fields
                            };
                            this._createRow(subFieldId, configElement, destinationModel, sourceModel, prefix);
                        }
                    } else {
                        sourceModel = {
                            data: modelElement.attributes.data,
                            properties: modelElement.attributes.schema.properties,
                            fields: modelElement.attributes.options.fields
                        };
                        this._createRow(fieldId, configElement, destinationModel, sourceModel, prefix);
                    }
                }
            }, this);
        },

        _createCategory: function (configElement, destinationModel, prefix) {
            _.each(this.categoryForms.models, function (modelElement) {
                if (configElement.categoryId === modelElement.id) {
                    var sourceModel = {
                        data: modelElement.attributes.data,
                        properties: modelElement.attributes.schema.properties,
                        fields: modelElement.attributes.options.fields,
						title: modelElement.attributes.title
                    };
                    _.each(modelElement.attributes.data, function (fieldElement, fieldIndex) {
                        this._createRow(fieldIndex, configElement, destinationModel, sourceModel, prefix);
                    }, this);
                }
            }, this);
        },

        _createRow: function (fieldId, config, destinationModel, sourceModel, prefix) {
			var fieldVal = sourceModel.data[fieldId],
				prop 	 = sourceModel.properties[fieldId],
				field 	 = sourceModel.fields[fieldId],
				key;
			if (!this.hideEmptyFields || !this._isEmpty(fieldVal)) {
				destinationModel.data[fieldId] = fieldVal;
				destinationModel.properties[fieldId] = prop;
				destinationModel.fields[fieldId] = field;
				if (config.label) {
					destinationModel.fields[fieldId].label =
						BaseUtils.getClosestLocalizedString(config.label, "Undefined");
				}
				if (this.isReadOnly === true || this.categoryForms.isReadOnly === true || config.readOnly === true) {
					destinationModel.properties[fieldId].readonly = true;
					destinationModel.fields[fieldId].readonly = true;
					// if this is a Set attribute (contains an 'items' member) the readonly=true
					// is propagated down to the members of the Set attribute
					if('items' in prop) {
						for(key in prop.items.properties) {
							prop.items.properties[key].readonly = true;
						}
					}
					if('properties' in prop) {
						for(key in prop.properties) {
							prop.properties[key].readonly = true;
						}
					}
					if('fields' in field) {
						for(key in field.fields) {
							field.fields[key].readonly = true;
						}
					}
				}
			}
		},

        _isEmpty: function (val) {
            if (val === null || val === undefined || val === "")
                return true;
            var uniqueElements = _.uniq(_.values(val));
            if (uniqueElements.length > 0) {
                var allEmpty = true;
                for (var i = 0; i < uniqueElements.length; i++) {
                    if (!this._isEmpty(uniqueElements[i])) {
                        allEmpty = false;
                        break;
                    }
                }
                if (allEmpty) {
                    return true;
                }
            }
            return false;
        },

        _removeGroupPrefix: function(path, prefix) {
            var modifiedPath = path;
            _.each(this.groupNames, function(groupName) {
                var actGroupName = (prefix || "") + groupName;
                if (modifiedPath.indexOf(actGroupName) == 0) {
                    modifiedPath = modifiedPath.substr(actGroupName.length);
                    if (modifiedPath[0] == '_') {
                        modifiedPath = modifiedPath.substr(1);
                    }
                }
            }, this);
            return modifiedPath;
        }

    });

    return SelectedMetadataFormModel;

});

csui.define('conws/models/selectedmetadataform/selectedmetadataform.factory',[
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'conws/models/categoryforms/categoryforms.model',
    'conws/models/selectedmetadataform/selectedmetadataform.model'
], function (ModelFactory, NodeModelFactory, CategoryFormCollection, SelectedMetadataFormModel) {

    var SelectedMetadataFormFactory = ModelFactory.extend({

        // unique prefix for the metadata model instance.
        propertyPrefix: 'metadata',

        constructor: function SelectedMetadataFormFactory(context, options) {

            ModelFactory.prototype.constructor.apply(this, arguments);

            var node = context.getModel(NodeModelFactory);
            this.property = new SelectedMetadataFormModel(undefined, {
                node: node,
                metadataConfig: options[this.propertyPrefix].metadataConfig,
                autofetch: true,
                autoreset: true
            });

        },

        fetch: function (options) {
            // fetch the model contents exposed by this factory.
            return this.property.fetch(options);
        }
    });

    return SelectedMetadataFormFactory;
});

/**
 * Created by stefang on 11.12.2015.
 */
csui.define('conws/utils/workspaces/impl/workspaceutil',[
  'csui/lib/jquery',
  'csui/lib/underscore'
], function ($, _, Backbone, NodeModel) {

  function WorkspaceUtil () {}

  _.extend(WorkspaceUtil.prototype,{

    orderByAsString: function (orderBy,defCol,defOrd) {
      var sc;

      var ret, order = {sc:defCol, so:defOrd};
      if (orderBy) {
        order = _.defaults({sc:orderBy.sortColumn,so:orderBy.sortOrder},order);
      }
      // strip curly braces from sortColumn
      if (order.sc) {
        // syntax of the sortColumn is to be checked in the constructors, so no need to
        // raise a message here
        var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
        var match = parameterPlaceholder.exec(order.sc);
        if (match) {
          order.sc = match[1];
        } else {
          order.sc = undefined;
        }
      }
      // if one of column or order is defined, then we must deliver something defined
      if (order.sc || order.so) {
        // and use a constant default, if one is undefined
        ret = _.str.sformat("{0} {1}", order.sc?order.sc:"name", order.so?order.so:"asc");
      }
      return ret;
    },

    getFilterValueString: function(colattrs,colvalue,allowempty) {
      var format = filter_map[type_key(colattrs.type)];
      if (!format) {
        if (allowempty) {
          return undefined;
        }
        format = "{0}";
      }
      return _.str.sformat(format,colvalue);
    },

    getFormFieldTemplate: function (colattrs) {
      // currently only support text fields (CWS-5783) in search form.
      if (colattrs.type!==-1) {
        return undefined;
      }
      return template_map[type_key(colattrs.type,colattrs.persona)] || template_map[type_key(colattrs.type)];
    }

  });

  function type_key(type,persona) {
    return [type,persona].toString();
  }

  var filter_map = {};
  filter_map[type_key(-1,"")] = "contains_{0}";

  var template_map = {};
  template_map[type_key(-1,"")] = {
    // normal text attribute
    options: { type: "text"},
    schema: { type: "string" } };
  template_map[type_key(2,"")] =  {
    // normal integer, like size and others
    options: { type: "integer" },
    schema: { type: "integer" }
  };
    undefined; 
  template_map[type_key(2,"node")] =
    // node picker
    undefined/*= not supported */; 
  template_map[type_key(2,"user")] = {
    // user picker
    options: {
      "type": "otcs_user_picker",
      "type_control": {
        "action": "api/v1/members",
        "method": "GET",
        "name": "user001",
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
    schema: {
      "type": "otcs_user_picker"
    }
  };
  template_map[type_key(14,"user")] = template_map[type_key(2,"user")];
  template_map[type_key(-7,"")] = {
    // date attribute
    options: { type: "date" },
    schema: { type: "string" }
  };
  template_map[type_key(5,"")] = {
    // boolean attribute
    options: { type: "checkbox" },
    schema: { type: "boolean" }
  };

  return new WorkspaceUtil();
});

/**
 * The workspaces model for fetching the workspaces from the server.
 * Provides:
 *   - Endless scrolling
 *   - Fetch custom attributes (categories)
 *   - Provide Workspace type icon
 */
csui.define('conws/utils/workspaces/workspace.model',[
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, NodeModel) {

  var WorkspaceModel = NodeModel.extend({

    constructor: function WorkspaceModel(attributes, options) {
      // The connector needs to be passed to teh NodeModel constructor
      // to be processed correctly
      options || (options = {});
      if (!options.connector) {
        options.connector = options.collection && options.collection.connector || undefined;
      }

      NodeModel.prototype.constructor.call(this, attributes, options);
    },

    // Set id attribute to support endless scrolling
    // Needed to support compare workspaces and add workspaces to a existing collection
    idAttribute: 'id',

    // Parse one workspace and add category properties
    parse: function (response, options) {
      var node = NodeModel.prototype.parse.call(this, response, options);

      // Add container attribute that core ui allow browse
      if (!node.container) {
        node.container = true;
      }

      return node;
    }

  });

  return WorkspaceModel;
});

/**
 * The workspaces mixin model parts for fetching the workspaces from the server.
 * Provides:
 *   - Endless scrolling
 *   - Fetch custom attributes (categories)
 *   - Provide Workspace type icon
 */
csui.define('conws/utils/workspaces/impl/workspaces.collection.mixin',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'conws/utils/workspaces/workspace.model', 'conws/utils/workspaces/impl/workspaceutil'
], function (module, $, _, Backbone, Url,
    NodeChildrenColumnModel, NodeChildrenColumnCollection,
    WorkspaceModel, WorkspaceUtil) {

  // Model for display columns in expanded view
  var WorkspacesColumnModel = NodeChildrenColumnModel.extend({

    idAttribute: "column_key",

    constructor: function WorkspacesColumnModel() {
      NodeChildrenColumnModel.prototype.constructor.apply(this, arguments);
    }
  });

  // Collection for display columns in expanded view
  var WorkspacesColumnCollection = NodeChildrenColumnCollection.extend({

    dataCollectionName: "properties",
    model: WorkspacesColumnModel,

    constructor: function WorkspacesColumnCollection(models,options) {
      this.dataCollectionName = options && options.dataCollectionName;
      NodeChildrenColumnCollection.prototype.constructor.apply(this,arguments);
    },

    resetColumns: function (response, options) {
      var definitions = (response.meta_data && response.meta_data[this.dataCollectionName]) || {};
      var coldefstr = JSON.stringify(definitions);
      if (this.coldefstr!==coldefstr) {
        this.coldefstr = coldefstr;
        this.resetCollection(this.getColumns(response), options);
      }
    },

    getColumns: function (response) {
      var definitions = (response.meta_data &&
                         response.meta_data[this.dataCollectionName]) || {};

      var columnKeys   = _.keys(definitions),
          columnModels = this.getColumnModels(columnKeys, definitions);

      _.each(columnModels, function (model) {
        // To format user columns they must have type 14
        if (model.persona === "user" || model.persona === "member") {
          model.type = 14;
        }
      });

      return columnModels;
    }

  });

  var WorkspacesCollectionMixin = {
    mixin: function(prototype) {
      var defaults = _.defaults({},prototype);

      return _.extend(prototype,{
        dataCollectionName: "properties",
        model: WorkspaceModel,

        makeWorkspacesCollection: function (options) {
          this.columns = new WorkspacesColumnCollection([],{dataCollectionName:this.dataCollectionName});
          this.listenTo(this, "sync", this._cacheCollection);
          this.totalCount = 0;
          this.titleIcon = undefined;
          // API returns if there are more pages to fetch or not
          this.next = undefined;
          this.listenTo(this,"sync reset",function() {
            this.updateSelectableState();
          });
        },

        updateSelectableState: function (models) {
          models || (models = this.models);
          var selectActions = this.selectActions;
          if (selectActions) {
            this.existsSelectable = false;
            this.existsNonSelectable = false;
            if (models && models.length>0) {
              // look for actions and set selectable flags accordingly
              var self = this;
              _.each(models,function(el){
                var selectable = true;
                if (el.attributes) {
                  if (el.actions) {
                    selectable = !!_.find(selectActions,function(act){
                      if (el.actions.models) {
                        return el.actions.get(act);
                      } else {
                        return el.actions[act];
                      }
                    });
                  } else {
                    selectable = false
                  }
                  el.attributes.selectable = selectable;
                }
                if (selectable) {
                  self.existsSelectable = true;
                } else {
                  self.existsNonSelectable = true;
                }
              });
            }
          }
        },

        fetch: function () {
          if (!this.fetching) {
            // reset total count
            this.totalCount = 0;
          }
          return defaults.fetch.apply(this, arguments);
        },

        clone: function () {
          // Don't share something between collapsed and expanded view (models, ...)
          // Sorting, filtering, columns, ... must also be shared since e.g. the modal view has
          // specific sorting
          var options = $.extend(true, {}, this.options);
          this._cleanupQuery(options.query);
          var collection = new this.constructor([], options);
          collection.connector = this.connector;
          collection.titleIcon = this.titleIcon;
          return collection;
        },

        /**
         * Cleanup query, e.g. all custom filters, expand
         *
         * @private
         */
        _cleanupQuery: function (query) {
          if (this.wherePart) {
            _.each(query, function (value, key, obj) {
              if (key.substring(0, 6) === 'where_' && $.inArray(key, this.wherePart) < 0) {
                delete obj[key];
              }
            }, this);
          }

          // delete expand
          if (query.expand) {
            delete query.expand;
          }

          return query;
        },

        parse: function (response,options) {

          // In case api returns properties use them, otherwise use defaults
          this.totalCount = response.paging.total_count;
          this.titleIcon = response.wksp_info && response.wksp_info.wksp_type_icon;

          this.options.orderBy = this.orderBy;
          this.columns && this.columns.resetColumns(response, this.options);

          // If more pages available set next to true, otherwise to false
          this.next = response.paging.actions && response.paging.actions.next ? true : false;
    
          // pass the array of v2 nodes to the model parse methods
          return response.results;
        },

        /**
         * Set paging parameter for rest call
         *
         * @param skip Number of items to skip at current rest call
         * @param top  Number of items to fetch at current rest call
         * @param fetch true to fetch items from server
         */
        setLimit: function (skip, top, fetch) {
          if (this.skipCount !== skip || this.topCount !== top) {
            this.skipCount = skip;
            this.topCount = top;

            // Fetch next page from server and show data
            if (fetch) {
              this.fetch();
            }
          }
          return true;
        },

        /**
         * Reset paging parameter
         */
        resetLimit: function () {
          this.setLimit(0, this.topCount, false);
        },

        setFilter: function (value, attributes, fetch) {
          // In case filter is changed, reset paging to get first page
          this.setLimit(0, this.topCount, false);

          return defaults.setFilter.apply(this, arguments);
        },

        clearFilter: function () {
          defaults.clearFilter.apply(this, arguments);
          if (this.options.query) {
            this._cleanupQuery(this.options.query);
          }
        },

        mergeUrlPaging: function (config, queryParams) {
          var limit = this.topCount || config.defaultPageSize;
          if (limit) {
            queryParams.limit = limit;
            queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
          }
          return queryParams;
        },

        mergeUrlSorting: function (queryParams) {
          var orderBy;
          if (this.orderBy) {
            orderBy = this.orderBy;
            queryParams.sort = this._formatSorting(orderBy);
          } else if (_.isUndefined(queryParams.sort)) {
            queryParams.sort = "asc_name";
            this.orderBy = "name asc";
          } else if (queryParams.sort.indexOf(" ") > -1) {
            orderBy = queryParams.sort;
            this.orderBy = queryParams.sort;
            queryParams.sort = this._formatSorting(orderBy);
          }
          return queryParams;
        },

        _formatSorting: function (orderBy) {
          var slicePosition = orderBy.lastIndexOf(" ");
          return orderBy.slice(slicePosition + 1) + '_' + orderBy.slice(0, slicePosition);
        },

        mergeUrlFiltering: function (queryParams) {
          if (!$.isEmptyObject(this.filters)) {
            for (var name in this.filters) {
              if (this.filters.hasOwnProperty(name)) {
                if (this.filters[name]) {
                  var column = this.columns && this.columns.get(name);
                  var attributes = column && column.attributes;
                  var valstring = WorkspaceUtil.getFilterValueString(attributes,this.filters[name]);
                  queryParams["where_" + name] = encodeURIComponent(valstring);
                } else {
                  // Clear filter
                  delete queryParams["where_" + name];
                  delete this.options.query["where_" + name];
                }
              }
            }
          }
          return queryParams;
        },

        queryParamsToString: function (params) {
          var queryParamsStr = "";
          for (var param in params) {
            if (params.hasOwnProperty(param)) {
              if (queryParamsStr.length > 0) {
                queryParamsStr += "&";
              }

              if (params[param] === undefined) {
                queryParamsStr += param;
              } else {
                queryParamsStr += param + "=" + params[param];
              }
            }
          }
          return queryParamsStr;
        },

        getBaseUrl: function () {
          var url = this.connector && this.connector.connection &&
                    this.connector.connection.url;
          if (_.isUndefined(url)) {
            url = this.options.connector.connection.url;
          }
          return url;
        }
      });
    }
  };

  return WorkspacesCollectionMixin;

});

// Fetches the list of related workspaces
csui.define('conws/widgets/relatedworkspaces/impl/relatedworkspaces.model',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/nodes',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'conws/utils/workspaces/impl/workspaces.collection.mixin',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, Url,
    NodeCollection, BrowsableMixin, NodeResourceMixin, ExpandableMixin,
    WorkspacesCollectionMixin) {

  var config = module.config();

  var RelatedWorkspacesCollection = NodeCollection.extend({

    constructor: function RelatedWorkspacesCollection(models, options) {
      // Core filter values needed for rest api
      this.wherePart = ["where_workspace_type_id", "where_relationtype"];
      NodeCollection.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.options = options;

      this.makeBrowsable(options);
      this.makeNodeResource(options);
      this.makeExpandable(options);
      this.makeWorkspacesCollection(options);

    }
  });

  BrowsableMixin.mixin(RelatedWorkspacesCollection.prototype);
  NodeResourceMixin.mixin(RelatedWorkspacesCollection.prototype);
  ExpandableMixin.mixin(RelatedWorkspacesCollection.prototype);
  WorkspacesCollectionMixin.mixin(RelatedWorkspacesCollection.prototype);

  _.extend(RelatedWorkspacesCollection.prototype, {

    url: function () {
      var queryParams = this.options.query || {};

      // Paging
      queryParams = this.mergeUrlPaging(config, queryParams);

      // Sorting
      queryParams = this.mergeUrlSorting(queryParams);

      // Filtering
      queryParams = this.mergeUrlFiltering(queryParams);

      // URLs like /nodes/:id/relatedworkspaces
      //var url = this.node.urlBase() + '/relatedworkspaces';
      // Alternative for URLs like /businessworkspaces/:id
      var workspaceNodeId = this.node.get('id');
      var url = Url.combine(this.getBaseUrl(),
          'businessworkspaces', workspaceNodeId, 'relateditems');
      url = url.replace('/v1', '/v2');
      queryParams = _.omit(queryParams, function (value, key) {
        return value == null || value === '';
      });
      queryParams.metadata = undefined;
      return url + '?' + this.queryParamsToString(queryParams);
    }

  });

  return RelatedWorkspacesCollection;

});

csui.define('conws/widgets/relatedworkspaces/impl/relatedworkspaces.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/node',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.model'
], function (module, _, Backbone,
             CollectionFactory,
             NodeModelFactory,
             RelatedWorkspaceCollection) {

  var RelatedWorkspaceCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'relatedWorkspaces',

    constructor: function RelatedWorkspacesCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var relatedWorkspaces = this.options.relatedWorkspaces || {};
      if (!(relatedWorkspaces instanceof Backbone.Collection)) {
        var node = context.getModel(NodeModelFactory, options),
            config = module.config();
        relatedWorkspaces = new RelatedWorkspaceCollection(relatedWorkspaces.models, _.extend({
          node: node
        }, relatedWorkspaces.options, config.options, {
          autoreset: true
        }, options));
      }
      this.property = relatedWorkspaces;
    },

    fetch: function(options) {
      return this.property.fetch(options);
    }

  });

  return RelatedWorkspaceCollectionFactory;

});

csui.define('conws/widgets/header/impl/header.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/member',
  'csui/lib/jquery.when.all'
], function (_, $, Backbone, Url, NodeConnectableMixin, MemberModel) {

  var HeaderModel = Backbone.Model.extend({

    // constructor gives an explicit name to the object in the debugger
    constructor: function HeaderModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeNodeConnectable(options);
      if (this.node.get("type") === 848) {
        // if we are initialized with a workspace node, we get initially all attributes from it
        // but note: there are no business properties yet, as the model is not yet fetched
        this.set(this.node.attributes);
      }
      this.listenTo(this.node,"change:name",function(){
        if (this.node.get("type") === 848) {
          this.set("name",this.node.get("name"));
        }
      })
    },

    // computes the REST API URL used to access the business workspace information
    // required for the header.
    url: function () {
      return Url.combine(new Url(this.connector.connection.url).getApiBase('v2'),
          '/businessworkspaces/' + this.node.get('id') +
          '?metadata&fields=categories&include_icon=true&expand=' +
          encodeURIComponent('properties{create_user_id,modify_user_id,owner_group_id,owner_user_id,reserved_user_id}'));
    },

    // parses the REST call response and stores the data
    parse: function (response) {
      // store allowed actions
      this.actions = response.results.actions && response.results.actions.data;
      // store business properties
      var data = response.results.data || {};
      this.display_urls = data.display_urls || {};
      this.business_properties = data.business_properties || {};
      // store icon information
      if (this.business_properties.workspace_widget_icon_content) {
        this.icon = {
          content: this.business_properties.workspace_widget_icon_content,
          location: 'node'
        }
      } else if (this.business_properties.workspace_type_widget_icon_content) {
        this.icon = {
          content: this.business_properties.workspace_type_widget_icon_content,
          location: 'type'
        }
      } else {
        this.icon = {
          content: null,
          location: 'none'
        }
      }
      // store category information
      this.categories = data.categories || {};
      // store metadata information
      this.metadata = response.results.metadata || {};
      // as a workaround I set these properties, as
      // otherwise the model doesn't change
      data.properties.workspace_type_id = this.business_properties.workspace_type_id;
      data.properties.workspace_type_name = this.business_properties.workspace_type_name;
      data.properties.workspace_widget_icon_content = this.icon.content;
      // return workspace node info
      return data.properties;
    },

    // true if the model is fetched already
    isWorkspaceType: function () {
      return (this.get('workspace_type_id') !== undefined);
    },

    // returns the available action if available,
    // otherwise undefined.
    hasAction: function (name) {
      var ret;
      if (this.actions) {
        ret = this.actions[name];
      }
      return ret;
    },

    expandMemberValue: function (value) {
      var self = this;
      var key = value.name + '_expand';
      var category = key.split('_')[0];
      // fetch the member information if it doesn't exist already
      if (_.isUndefined(self.categories[category][key])) {
        var ids = _.isArray(value.value) ? value.value : [value.value];
        var values = ids.slice(0);

        var deferred = [];
        _.each(ids, function (id) {
          var member = new MemberModel({id: id}, {connector: self.connector});
          deferred.push(member.fetch({
            success: function (response) {
              // append to expanded values
              values[_.indexOf(values, id)] = response.attributes;
            },
            error: function (response) {
              // append to expanded values
              values[_.indexOf(values, id)] = id;
            }
          }));
        });
        // trigger change when all items are fetched
        $.whenAll.apply($, deferred).done(function () {
          // set values and trigger 'change' event.
          self.categories[category][key] = values;
          self.trigger('change');
        });
      }
    }
  });

  NodeConnectableMixin.mixin(HeaderModel.prototype)

  // return the model
  return HeaderModel;

});

csui.define('conws/widgets/header/impl/header.model.factory',[
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'conws/widgets/header/impl/header.model'
], function (ModelFactory, ConnectorFactory, NodeModelFactory, HeaderModel) {

  var HeaderModelFactory = ModelFactory.extend({

      // unique prefix for the header model instance.
      propertyPrefix: 'header',

      constructor: function HeaderModelFactory(context, options){
          ModelFactory.prototype.constructor.apply(this, arguments);

          // get the server connector from the application context
          var node = context.getModel(NodeModelFactory),
              connector = context.getObject(ConnectorFactory, options);

          // the model is contained in the 'property' key
          this.property = new HeaderModel( {}, {
            node: node,
              connector: connector
          });
      },

      fetch: function(options){
          // fetch the model contents exposed by this factory.
          return this.property.fetch(options);
      }
  });

  return HeaderModelFactory;
});

csui.define('conws/widgets/header/impl/header.icon.model',[
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/url',
    'csui/utils/commands/delete'
], function (_, Backbone, Url, DeleteCommand) {

    var HeaderIconModel = Backbone.Model.extend({

        // default icon
        blankImage: 'data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAScAAAEpCAYAAADRUOQxAAAABmJLR0QA\/wD\/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QUbEBMqi\/7RiwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAgAElEQVR42uydd3hc1Zn\/v+fe6X0kjXqXLVnFHdtgg22KKaY4GExISAiQAEnIbjbZ\/SXZ3WyAZDdlN8mmQQJJlkBIQmx6BwO2sXEvsmWrWn1Up\/dyy\/n9IUOIdUeWbUkeSefzPH7g8VijW875nve85y0Ag8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYKQ9lD7Iffj\/D1LKbaaUp6P\/EOWfpSr2BBmpIOwRMFIIB79lC7AFW\/CVlTfk72\/xc01NnSjJU2frjebijmEew14PErEEN+QJymoV5WrK7NW5WcYqEKgJ4UAplagkywPeSPOJk\/5mmRI5J9PCGQw6mp+TSUqzk5yr39fi9xNfTXUZ5paQ2O8O7\/R8s3wTZ7G0cZWVlQn2Jpg4MWYpmynl57vdOQ29gu31948LtgzbvEF3LENn1Cxyh1HQN+hSaTSqSl8MxnA0CZlKepWKy4wKPERRBKWAKEkAAFmWOQpKAEJAANCREUZAJI4QCgAqngchBCoVD4NGgpAUXTynTpgMGuh4cRgyuosLcpBn4z1iPHEky6weDEQjrbetnW+pssd8hY7CDkKIxN4cEyfGDMIZcGYGRX3eEy81JAQY5rUOi\/lyMrQoKsh1rhgpHPKGoFHzhaG4DFGWVYJMQClAQU8JzSQOF0o\/FLIR8eJkaHhONOk4Koi0P9Nmohkaucem4xo5jbm+xM51alXCyS9trLM4KO3MyMgIsDfMxIkxPbZl6oe2b6cX6Utqm1zh8rbB8Fx\/WFo+EEzWtvf5dRyHQk+UIilRFT2lPdNhsHIEUHGcaDcQkeO4weoiKzHw3Ac2A793SZmpr6Y0r2O3q\/H4w2vXSiN6SigbDUycGBeYbZ2duh6nJrulb6DaHRQvaxsK1Q75EzWBuFToCyU1CYmqJHmSLaCpV2FwHIFOBTHDpE5a9RpntlndWJhpOlyardpbYss+YckPuW+rq0uyEcLEiTGF7O7p0b+1N1jmisRX9QyHLu33J5a5gvESV0jQJiTwVKYzS4zGIVaEI9DxRHJY+IRVp27JtenqKwvte+0G1Y6Vi\/Rd65mjnYkTY1ImH9m8p1fXOuBbeKI\/uKLfG73C6Y4t8kbl\/GBcnFrL6JSf6EPH9\/h+ZqotNwqeEFh1nGjRq3oKM7T1pdmmXRU5lp21BbYTt60sjrFBxcSJcc4aQMmWLeB2xI5WxCLhDR3DsXVOX3Rxvz9piwlQ0Yn\/haOc03oVB42Kh1ajglGrhl6jgk7Nw6wFdDyFRSdDw8kpvzIhc4jEOcREgmASSAgSwgkB0YSIpCBCECVEBBkS5UApHXHCT8Lw5ECh13BijknlLskxHS21a94yGzJfvdRU07FpEwghRGQjjokT4wy0trZq97qtRU29gzceahte2dQXWRCIixWhBOUnTpAoOEKgUwF6rQaZJg4Okw4Fdg0KMwzIzrKhyK5GgUkFk04Dk0EDo04NFc9DzXNQqziQUz8\/lkEkUUAQKWQKCKIMQZKQEGXE4gIisQSCsSScYQn9PgHDbj+c3iicvgRc4QS8ERnReBIJCZDpxIkWAWDSQLTp1R0VucZDy+bYd82vKHjj4oxQP4uxYuLEUOB4T0\/Glr3Diw62+69z+oRr+32xeZ6opJLPV5FOOY+NGoIMkxYFdh3m5hpRlWdBVb4ZBRkmOKxq2HQaGHRqqHmAkBHraSoGCh2xEkEphSBRROIiAvEkhgMC+jwhtA6E0dQfxMnBKPr9MXhCCUQFev6Cdeq5ZOi5RGGWsa00U\/fm0vKsN5bO1xy8bu6fwoQ8LLNRycRp1vIgfZBb0fYP+ZvfaV\/dMhDc0OeLrh0OJLLj4vn4aCh4AlgNahTZtajKt2BhqR0Li60oyzYhx6KHyaCCmhBwXPoPBVmmEGSKcEzAUCCOjuEwjvb4cazbh+a+EJz+BAJREdL5iBWl0KsJ8u06b45V905dkfWVTyzP275+YZGTUkpYaAITp1nF955vqDjc4b25P5DY1DEUWeAOCzp6jq+GgMKs5VGcqceCYguWV2RgcUUWKhwGZJh10PLctBCisxGshCTDE4yj3RXF4XY3DnR4cbQniF5PFOEEPecYLo4AWSZVfE6O6WhRpn7z9RcVv\/3ZlUUnmEAxcZrRUEr5\/3m5ofb1w4M3DASFTf2+WF0oKavO5ZVwBHCY1KjON2FlZRZWVWWiptCGHJseWhUHbhaFEsiUIiHKGPLF0NDrx542D3a3uNDUH4E7IuDctsYUVi0nluaY2nJN\/F\/WL3G8+o\/XLTzG0miYOM04UXrk7daL3jwyuKltKHJjtztcHhehOqut2ykfSbZZjfnFNlxZ48Ca6mzMzTPDZtSAnyLL6O9SW\/Dhf6jiMCMfG3Ejp4BT87wlmcIXTqBtIIydzUN4r9GFYz0BDIXOTah0PBXn5Jp6Sx2m56+qK\/jrV68rP8xEionTdFcl8rM3Oi56t6Hn9k5XdGOnK1oaEc5+y2Y3qLCwyIwr63JxeV0OqgtssOpVE7pVowCoPHKcHxMoEkkBcUGEL0YRigqIJxIIJZIYjgDBqIRYPAFBEJFICkgmk6OCADQaNbQaDdRqFfQ6LcwGFbKNgEWrgV6rgcWggk3PQatWQatRQ68mIwLGTawjXpYpAjERzX1+vHd8CO8eH8SRnhACMRFnu402qoFyh6Gr3GF4fv3Swj\/dd2XiOCEsCp2J0zTjBy90lr57ov2OoaBwd\/tQpCKalMfv5KYUWhVBZa4RV9bl4JoFuVhanoFMk3ZCBOkjJ3NcRDCSwIA\/gT5vBCeHY+hz+9HlTcITSiIcjcMbp4gnKQRRhCBJGEkMJn+zmcawRMjHTCdCADUnQ83zUKtUMGgAm46DyaBDhlmL0gwtihwWVOToUGAzIdemhc2ohVmvAj9BzntZpvCEEtjf4cXWYwN47\/gQWoeiSIj0rN6NQcOh0K5rKMvUPXPVgsK\/\/L8N8zrZiGfilO7bN7JlZ1vWloPDn2nqD32y0xW+KCKAPxv7JcOgwqq5dly\/OB9Xzs9FqcMEFc+d1zZMkmUET512dQ6HccIZxHFnACeHonAHY3CHRUQTSSSlDysSXJhBSQig4WXoNVo4zCo4LHpU5hoxr8CCmkIrKnJMyLFoYTWowRHuvLaJgiSjaziEdxsG8dqRAXzQ5oMvJo5\/elAKk5aTyhzGg7VF5r\/euLjoD3dcVuJjs4CJU9pRP0CNv39t\/ye2tXg2Dfji6z1RUT3eR80BKM7Q4JqFebhxST5WVTlgNWjOefKJkgxfRECvJ4L6bj+OdHlxrNuPHk8c7nAC0SSd0MDGSZZ8cITAoOGQZdagJEOHBSV2LCmzY0GxDcVZRtgM6nMWcEoBfySBXS1uvHq4D28eG4TTm4B8Frk5WSa1kGnUvHDpvJxnP3\/d0ldXFhOWHsPEKR2spc38j16oueSFQ\/2fdQXjd3R44sbxPmKeUFTlmrDhogLcfFE+FpbaoVHx53ANFFFBRp87jPouP\/a1DWNfhx8drhjcYQGiREFn2ADW8ECGSYOKbANWlNtw8ZxsLCy1oiDLBL16JIL9bEkKEo50+fDiwX68dKgPrYNhSJSM+5rKHfpInlX3p\/ULc373b7fMP8BmBxOnC8ajO7vtr+3qvK\/HF7u\/qT9cJo4zppgnwOJiC25eVoANFxWgKt9y1iu\/TEeiqU8OhrC7ZRjbW7w41uVFj09AQjh7Z+\/0HtAUejWPIrsGC0ozcXl1Bi6e60BFrhkmneqswypESUZzXxDP7Xfi5UN9ONYbgjhOdVdzwLw848nyLMPv1i8p+s396ypYQTwmTlNlKYEAlPvXPzdsfOlQz20D\/sQGf1xWj9dSWlxsxq0rinDL8iKU55jPytFLKRBLSmgdDGLHiUFsPzGEA11BuIIJJGX2Wj9Ew1M4LDosLbHiqrpsrK3JQUWeBXo1f1ZbZUmm6BwK4rl9TjyztxcNzjCkcYpUhp4X8qzaFy6dm\/G733zx4vdY6AETp0kXpjePuSp\/8frxu7vc8fuaB0L28VgoBBTz8kz45MWF+OQlRajMs56VKIkSRa87jG2Nw9jaMIzdJ73o88UgyZS9zjOg4giK7FpcUpmJdfNzsKY6G0WZhrOyVGWZorEvgOf29eKZPb1oGYxgvO+90K7rmpdneuZLG2p\/t3F+Tjt7I0ycJkGYKP+NP9dv3HbCdW\/bYHhdID6ehZCiwKbF7ZcU41Mri7Gw1A7VOEWJUiAcF3Cw3Ys3jw5ga8MgmgbCiItMkM7xDUKn4jAv34Sr5+fgukV5WFqWAZNePe6nKckUhzu8+MueHmze04u+QGJc78Kq4zEnx\/D2mqqMR8yfW\/bqw4SwpGImThMiSuTdho7sR97s\/WrrcOyLjf3js5asWg4bLsrHZy8txpqaXKhV41upZUox4Ivj3YZ+vHJkADuaPXCHBLDEromdANkWNVZXZeKmpXm4cn4BcqzacfumBFHG9hODeOqDXrx0sA+hhDyO30lRlWvsr8zWP37f+iW\/uGGBjYUdMHE6H2HazD\/29vz1z+xx3nuiL3SDKyKd8dnxBFgzLxP3rC7GTctKYNaPr4fkh\/6Nlw\/14cWDgzjY6UNMlNnrmmRryqAmWFaegQ1L83DD0gKUZ5vHnQoUiIp4YV83ntjZgw9aPePyRzkMnFyeY3p24yXFv\/nmDdXb2Dtg4nQuFpPqUz\/beXdDX\/Afmgei8894pEwpSjJ1uHN1Ge5aXYryHNO4RampL4Dn9jvx0gEnjvWFITGjf8pRccCCIgs2LM3HxuWFqC6wjkukKAXah8L4w\/td+OP7HejxJs4Ybc4Tiup8S8OiYtuv\/viVFb9nznImTuPmsW3NWX9+v+9f2ocj9zm9cfuZBpuOBzZclI\/Pry3D5bW5UPFnfsQfF6Xn9jvR2Df+kyDG5METoKbAhFuWF+KWsxApUaJ4r2EAv93ehZcO9UM40wJDKQozdL45OabH7r6m8sefW1HoYU+fidOY\/OT11jV\/3NHx5Q5XdFMwfoZtHKWoyjPh3svLcOfqMjgs2jN+v0wpTg6E8MzeHjy7j4lSuovUpy8pwqaLi1CeYxlXGMJwII4ndnTgd+914KQrfsZ\/b9eraIXDsOXeK+Y+ev\/V5TuYODEU+fyjOze92+j7cq8vsfZMgqHmgI3L8vHFKytwWXX2uFbXQV8Um\/f24k+7e3CoM8BEaRqg5oClZTbcsaoYm1YUIcemH5dVvO3EIB5\/rxMvHjyzFaXigLIM\/farah2P\/vr+FVuYODE+IhKJFNz328P31DvD\/3CiL+Q40xJZkqHF\/VdW4POXlyPbqjvz9ydEvHqoD3\/c2YV3T7gQZx6GaYdOBayrzcFnLyvB+iX5MGpVZ9y2DQUT+P277XjsvXb0+M5UWYVifqHNVZVj\/NEjn5nzWE5OTpiJ0yxna2Mg8+evHn2ovtt3j9OXNIz94CiuqnXggXUVuGFp4RmtJUmm2NPqxlM7u\/DsPid8MaZK0x27gcdtK4pw9+pSXDQn84xjQJRkvHKoD49sbce7ja4zTr9cq9pXl2d67Ju3XvnjdTVk1vmhmDid4g\/vdlf84LXGf\/KEEg+4I8KYz0WvJrhnTRm+cvUczCuwnPG7+30xPPl+J57Y0YW2oQh77DMKito8E+5eU4o7LitDru3M1nNjrx+\/fOskntzZjdgZEvUcJjXNtmgfWTs\/46FHPrdiVgkUzwYX8OT7PWue2NH+wxN9oU8FE2M7vsuy9PjXDfPwjRvnoSBjTOMKgiTj9cN9+N4LjXh8WxfcYYEJ0wxc311hATuaXGgdCMGs5VGWbRozJclh1WH1PAesBhVa+oMIxFL38YwmZRKOi8uiMaHsJ\/\/zPdfzv\/95NxOnWcK\/P3viqqd3dHznYKfvyqQ8tt9g9bwsPLixGp9bUwadeuxH1+OO4H9fb8F\/vtCEg11ByMzhPaORKNA8EMau5mFEEwLm5Jph0afOAdeqeayYk4nSLD36vTH0eKIpY6JEmRJPOFnbPRQtve+r\/9azffMjXWxbN5ONcUq1X3tq37VvNvj\/taU\/uGKsNBSeUNy+ogBfu74KS8oyx+5sK1O8Vd+Px95tx2tHh9kp3CxExQE3LsrBl64sxxUL8sf0RVEKHGz34Cevt2LLPueYhe04UJRmG7evq834\/m++MPOrG8xay6lev+qqd5v83+oYjq4cS210ag5fvboC\/7GxFlUF1jGFyRNO4ldvteG7zzdhX2eA5cDNUuRTVtSeNjcECagusECvUZ5qhAAFGQYsr8gEpUB9tx9iCjObgsAXTpYO+ROlO446O1vee2pGW1CzUpy++fSRB\/a2B77b7oovGkttHCY1vnHjPHzzpnnIsozt6Dzc4cV\/vdCIX77dDs\/ZtlVhzMhNiTcq4v1mF4b8cRRnGpA7RlyU1aDGyrmZ0Kp5HOv2IZYqIIoQBONSCeW4hZ\/\/0tflD158\/DATpxkkTNua3Q\/W94aKxvp35Vl6fOfmGjxw9dyUqx4wkqqwZV8PHn6uES\/XD7JcOMZp23zgSLcfTX1BWHQ8qvItKSseaNU8Lp6bBbtBhUZnAP5oake5JyLkChQXf+a+r0c\/eP6xGVkGeFaJ0zefPvLA9mb3g\/s7\/I6x\/t3CIjMeuqUWn11dOmZuXDAq4OdvtuK\/XmzCif4w2EkcI5UV1e2JYW+rG5IMLCi2QpviQIXnCJaUZyDbrEXzQBiuUCLlt\/b54kZRkpfded9Xo7uef3zGCdSsECdKKYnNvfHe7c3e755JmC6dm4Hv3lKDDcsKx6zp0z4Yxg9easRP32iDd4wVjsH4kEBcwq4WN4LRJKryLbAb1IondIQQ1BVZUZRpQPdwGE5ffEyBCkXFeWs23tdy\/K0nuh5++OEZ4+qcFeJ0TLf6ig\/aA\/9xtCdYPpaPaV2tAw9trMGV83PH7Nixu9mFh55vxNO7es6ccc5gfNwNIFMcaPfC6Y2iNEuPgkyjsq1FCCrzTChzGOB0R9DpTt1haiiYsAdiydKmnmHn4df+MGPK\/854cbr7scNrdrR6Hux0xS4eS5iuqXPgoVtqsGpedkphohR46aATDz3fhK0nhmdVVxPGBFryIGjsD6JtIIQskwaV+ZaUAlWWbUJlrglOTxTtw9EUu0aCYFwqdkdReM8D3+7a++IjMyJQc0aL0yNv96x54UDXQx3DkbVnEqYHN9bg4srUeb6iRPHkjg489Fwj6nuDYP4lxvkx4oeq7\/bDrONQV2RTdCMQAhRmGjEnx3hmgYolS2OJROl\/fe\/7XS8\/+b\/TXqBmrDi9sLd76e+2nfz+kW7\/2rEsnKvrRrZyYwlTXJDx6Nsn8Z8vNqHLE2fzijFhuENJHGz3QKvmsLDErngAQwhQmGFERfYZBAoE7lC81BWM5v\/3Dx8+9Nzvf+5m4pRm\/HlPe84PXmr+9pHu4E3iGCG3V9c58OAttbhkDGGKxAX8+LVW\/ODl5lO5cQzGxBKMS9jX5oEM4KIyu2IDjI8sqGwjut1RdLiUBUoGwXAgUX68x6955Ic\/3rfliZ9EmTilCe1ean3wz0ceauoPfyEqpO4uuaYqAw\/fWouVYwhTMCrgv19uwv+81opwgpU4YUweMUHGvpNeSJKM5eV2aBRCDT4UqOJMPdoHw+jxKjvJJQoiivISTzhq3vL0E9t\/85OHp+WqOuPE6Zj+sn9qHQx\/wx0RU97b0lIbHr61FmtrUju\/3cEEvv9iI\/73rZOn+sMxGJOLIFHsa\/dClimWV6QWqBKHEXk2PY47gxgKKMdBxUVKQjGh5r36LvfAB3+aljFQM0qcvvDrPfce6Q1+u9ebMKcyh6pyTfiPjTW4YUleamEKJfD9l5rwy7dPIskMpjSHQssDmWYdyjK1KHOYUJRpQGGGHtkmFdQqHqAUokSnRa6jJAMH2r2gMsXyiowUAkUwJ9eETJMGR7u88EaU4+zCCUlj0GmXfeqef\/QfeOV30y7NZcYcOX3t94fXvHZ84GetQ9FFqf5NgVWD7902H3etKU0pTL5IEv\/5\/An88u12FsOUxmh4YF6uESurHLhkbgZqCu3Is6qh0\/ytTIkkyfBERfS5wzjY4cWOZhcOdfrhDgtpHwaiUxH88\/q5+NZN1TClKL1CKcWT2zvwb5tPYCCYuvTvvFxj\/c1LC\/\/pB3cs2MHEaYr5w67uil+93vLo4S7\/1an83xYdj4c21uAfrq1MmZISjgn4wcvN+PFrrUiyWidpiYojuLQyA5uW5+OahXkodpig4rkzDmRZpgjERBzqcOOlg314dn8fBoPp7Yr5UKD+dUM1jDplgRIlip+93oyHn29EOKk8ZjlQXFGTtetbN8194KoFRcfYtm6K6A8GHd\/+U8N\/1HcHNgkplEnNAV+\/rgJfX1+VMqcplpTw36+OCFOCCVNaUpplwL9cX4nvbKzFlfPzkGHWgufIuFZYQgj0Gh7lOWZcWZeD2kIrEkkRbYNhpKuBLMrAwQ4feI7DijkZUPGjT\/E4jmBRqR2xpIR9J72KRQ0pCAb9iaImZ0h6\/6Vf7Pn5j34UZ+I02d4Guk11+0967613Rr4ajEuaVD6Ju1eX4t9vroPVqPxPBJHi52+04EevtCLK9nJpybpaBx66pRZ3rymDzagZV9+4lNYXz6Eyz4zVVZnQqjgc6\/Gn7aGHKFPUd3lh1HC4qEK5iYJaxaGu2I7hQAJHe\/yKGyJBpkQQpdqGDr+v5Z0n9zJxmmQ8xQ9cs6\/d\/x2nP5Gbaod67fwcPHRLLUodyjlMMgV+v60dP3ipCb4o836nI7dclIfvbqrBmpqcMXMezxazXoOVlVkwa3kc7vQikkzPhSkuUhzr9sNuUGNxmV3xGZh0KlRkG9ExFE4ZpBlOShoQMvf2L3695cCLj6d9Dt60Fae\/7Oqu+Mue3u81DkaWpRKmmnzTSFrK3MyUg\/qve7rx3eeb4PQnmQqkIRuW5OLhW+uwsDRjUr5fxXNYUpYJvZrH3pPutLWgwgkJjc4A8u0G1BYq5+JlW7TIMmlwsMMLj2LAMIE3nLRLIs3+6c9+vOe5x3\/sY+I0wRw\/TjX\/8dK+bzX2hz8jSMrKlGng8Z2ba3DrxUUphem944N48NlGNA1EmAqkISvKrfjeproz1m0\/70lwym+TECTsbvOkbTMKX1RElyuCqlwjShym0dJzKsRAwwE7m11IKAotQTgulHf1+2M9O57ans4lVqalOIVqrr3naG\/wXz0RUbF2rooDvnrNnFMnc5zid5zo9ePh55uws9XLVGBSObexbzOo8Z2ba3D94vwJ3cqltqAIqvMt6BgKo6k\/fRvs9vvj8IQSWFRqh8OiVRSo2iIrQnEB+056FEMmkhIlhJDaXcf7OpveefJEut6raroN9V+80rLwDx90fNnpjVuUl1OKm5cW4Evr5qY8mXMHE\/jp661449ggWHWBSVz5CHB1XQZyjOTUm6H48GyNfrSOK7xBwqG2OAu3riieEmH6kFybHl9YW4Y9bR70B9J3m\/9K\/SBybHr88Pb5yDSPFii9RoUHrp6LtoEwXjw0oFjQrscbtRvU+OIzOzu7b7+sbC8Tp\/Ok0enM\/MJjjV8+3hdemMrOrysw44F1FSkbXiYEGb94sxV\/3NXDhGmSserV+OZN87GqKuujv5PpiCxxZxAdAoBPYfVOFoQAV8zPwcZlBfjVOx1pPD4IntrZheIMHb65oQYahUTh4kwjvnL1HLQMhFK4LQi6PLE1v93Wec\/rra1H1ldWJti27jwQaz5938FO79d8UeWwAbOWw79vqMYtK5T9TJQCT+7oxA9ebkY4yUIGJhu9hsdnVhWjxDHSAXfAE8L\/vXcSnmAYVYV2qHgOHEdS\/jmnTSQ9JYAU52R18RwHg5rgjfqBtD29A0aaeJ7o9SPXqsPCEvuotZoQoCzbCAKKHU3DEBQOokUZRJBoZTKidh157beH0u0eueky0J\/e1rLoYIfnc05vwqC8llB85tIS3HFZ6tSU7U0u\/Pytk\/BEWM3vC+Fu6vXG8D9vnMRzB3sw0YdigiTjWLcXT77fie+\/1IL\/ffMk3jzaj+HA2ccbLqlw4OIKO5Dm2XjDYRG\/eOskdre4UliCBJ9dXYY7VhWnvBenN2Y+1O27579f765g27pzwEWp+XM\/2nl\/ozOYss\/cigo77r+yHGad8i053RE88lYrGpxBJhpTvAX5OLKMCT8Nc3oi+PU7HXhmTw+c3hgEeeS3mrUcLqvKwn2Xl+LGZcXj\/j6Tlsdl1Vl49Zgr7dvIH+kJ4BdvnUR5jgl59tF98Sx6Ne6\/ogJHu\/zY1xlQ3Mu2DQSXvbKv9d5tlH77ckLSZuWeFpbTfz995IaO4fAdMVHZCWDVcbjv8jIsKLYp+5lECY9ubceLh\/qZVky5LtGPGVJkJFVkAl05w8EEHtxyAj96pRkdrhiS0odbOyAQl\/Fq\/RC+8ZcGbNkz\/qq1HEewpNwBi256uGSfP9iHx95pQ1JU3oYuLrPj\/isrYNUpT\/dIUiausHD\/W39tuJlt686Cx7a2W18+2PeJlsGwOeV2blUJbluZejv33J4e\/HZbByTKHOAX2nJS3O+dI7I8Utf9jx\/0pH63hKB5KIpHt55E9\/D4QwRKsnRwmKeHS1aUgcfe7cAL+3tSbu9uu6QYn76kGETp2ROCloGw7ZWDzls3H2y3MnEaJ2\/V937BFU5uTFXiYkmJDfdeUQqjVnkgHesJ4NF3O+FmLcJnHIOBGF484BxHaRuCD0768c6xAVA6PmG06jWwG7XT51mEBPzmnQ40OQOKnxt1Knz+inIsKlaOLqcgGA4mNj63s+\/zTJzGwc+3ti5uHY59zhuVFO1ro5rg82tLsaBEObUhkpDw2Lvt+KDNCxY2MPPocUXRMji+6H5BkrG\/0w1hnE4knueg1WimlYW6o8WD377XjniKComLy+y4a00ZtCrlueAKCeFTDdUAACAASURBVKrjfeFP\/+8bHVVMnMaAUsq\/sq\/3Mx3DkbpUwZYbLsrHJ1cWK28cKPDM7h78aVc3m8UzlFgiiaQojXvyDkWkcRcQVPE81KrpFaNMQfDkzm48t697ZAKcPtkJwadWlWDDknzFz0EIulzRJTsaOr88NDRkYuKUgm\/\/9fCqk4ORjdGkcpOCQrsOd60uHTG9FcSryenH77d3IBBnlQZmKkadBlrV+PxCBBT5ZhXU4xzxSUFEPJGYds\/EGxXx+HtdaEmRgpNl0uKu1SXItylvWSOCTI47Yzc9um1wCRMnBXb39Oh3nnDd6fTFS5SEhyPAHSuLsbY2R9GoSooyfr+9E\/tOsry5mUyxw4h5ecZx\/Vs1z2FZmQPqcQZ3CqKIWDwxDZ8Kwa5WD\/5ve7vi6R0hwJXzc\/GplSmc4yDo8sZLth4f+ORmSi\/oiUBaitOzO1zrOtzxG1L1nFtcYsVnLiuFOkV6w+uH+\/D0rh7IzM80o8mx6nDL8iJo+TO\/5zVVGbhyfu64o8ZdoSRc07RPoQyCp3Z148165dAZjYrDZy8rwYIixQNwiJJMhkPC7c3PH7ugoQVpJ06bd1P9\/jbvHQNBQdEsUnPAHauKUZOips2gL4b\/29GF4TCrzzTT+TAC+vNrSsbcrtXlG\/HA1XNQlGUY93c39gWndSbBYFDAEzu6MJQiQn5+sQ13rCqBilN8sOh0xzPeO+7atLuH6pk4neL95gM39Xhj16cq471mXiY2rShSTByVKcWfd3fjrYZhsNO52UGmWYuHNtXhOzfPQ3WeERp+xPHLEyDLqMKtF+Xhf+5YiJsuKhy31SRKMva0uhEXpnct+TePDWLznp6Pkq3\/3jVC8MlLirG6UvmkW6KA0xe\/\/s199TdcqOtPq+OIt+qp8cFnt25yeuNGJXExqgk+vaoYBRnKYt7QG8Afd3WzzimzDIdFh29tqMUtK4pQ3xvEcEiCUQNU5RpQV2iD3Xh2IQF9nhh2Nnsw3UdRXASe3NmNy2tzUFc0OrayKNOAO1aVYG+7X7F2fqcrZtzR6Ll1dw99dWUxic1qcXrn2KH1A\/74tal8RVfVOXDjUuUVUJBk\/GlXF472hNhsnYWoeILqAivmFVg\/CrTkzqEqAaXA1oY+NPbPjBzMI90B\/OWDbjy8qW5U4UVCCK5fWoDnDvbh9aPDitZTny9+\/Zv7Gm4AsGXWbut291D9gU7frU5fQvH4xaThcNuKImSalFfBD5qHsXlPL5jNNLshp0SJO8cidYOBGLbs758xLehlCjyzpxd72zyKn2dbtPj0JUUwa5SfV6crZtx2bODGzZuPT3lEatqI08sfHLqs2x29SlJsvEVxZW0Wrk1RsjWalPCXPb3o9sbZ7GScF+2DIexr82Am+Sw73DE8s7sbCYWiToQQXLc4H1fUOhQDMyWZotefuGZ7MHDxrBSn3T09+g+a3Bt6vUm70gmdSTtiNaXyHWw7PoSXDvaBOcEZ52VlyBTzi23YcFEBMMNs8GcP9GNnk3LdJ7tRg00rCmHUKsgBIej3JRwneqO3DQxQ41Re8wUXJ0pB9jZEl\/T7k9eLlCqWr1xbndpqCickPLO3F0MhVkBuJiJJ0pTUVGrr9+OtIz0w6dS4Z00ZKrP1M+o5DgUT2LKvB9GksvV01YJ8XFqZqWg9JSVKXOHkzS80NM2fZZYT5d5tcF7b54sXKlk+eg2Hm5cVjGE1DeL1+kE2i2coJ7o9ePaDTkiTWDG3eSCKB19owz89fRy7W1y4tDobn1tdphwDNG0hePnwAD5oHlb8NNuixcZlhcpJwYSgYziW\/dK+gasonbrtyQV\/\/M\/s7aocDIi3xEXleubLymy4ZmFBCqtJxHP7euCNsIDLmYorLOK7Lzbi8XdOIi5MfJ7k0S4vHnq2AX\/Z3Y3W4Sieer8T0aSEO1eX4uo6x4x6loPBJDbvdaa0nq5bnI+lZcoFG+OSrPLFkp98pcFVNVUCdcHF6YXd\/Rd3DMfmKvmaVBywYWk+8uyK7emwu8WFN48NgfmaZjY93gT+fXMDHtxyHO1DE9NTLinK2LK3B1\/741H8dW\/PR9bFlv19eH5fDwoyDLhnTRkcJtUMepIErx4ZwL42t+KnBXY9PrEkDyqinHPX4YrNe6++5zpCpsYhd0HFad9QOLcvELvVHxMVR0BVrhHXL85XPBZOihJeONDHfE2zBF9Mwo9fb8P9vz2AP77fAW84AXoOU0SQZBzu8OLfnjmKr\/zhCLY1\/\/3JXCAu4Ykd3egYiuD6pQW4Y2URyAxyjg8GE3jhQJ9iUjDHEaxfko+KHOU0H09EUh3r9l+zeffUpLRcUHF6\/u2GeW2DwUXKOk2xfmEuKnKVkxOPdPmZr2mWIVPg3SYPvvyHetz5yF489k4rmvr8CMYlyLI8piAN+WN4+2gfvvXnenz6V3vw0zdOYjgkKI68Xa0ePPl+B1QcwV1ryrC41DajrKdXjgziWI9yxczKfCuuW5iXokYaRa8ncknT0LGVU3GlF8xmbaVU+42f7tgYiIl5Stsyh1mD9YvzFduJi7KMlw854fTFzmtLR4hyzS2eAMtLLVARMqpI\/4XdQtIR2aZATJBx2Bk6J+thuhNOyHjtmAtbT7hQlKFHdYEZiwtNmJNvR47N8JGlXVdoRJZFj+cO9OKnr7WifTAIX4yeepup36NEgad2dmNNdTauqMvBXWvKcMJ5DAlxZvQ67PFE8crhPiwutYE\/rYSMiudw\/aJcPL2rG+6INGrCOL0J86EW7zpK6XZCiDQjxWn\/7s7ctv7IqoT4UYfqj0s0Lq3MwJJy5aTEnuEw3jjSD\/k8GhYYtDzWVGXg\/SY3IqcleBZmGvDIPUtR6jCknTdrRIwo9rR58JnHDsN3Wm10q47HirkZ2NbohjDDcwyTEtDuiqHdFcPr9cMgHIFOzYOckp67Li3ADz+zBPlWLQKRBLyx8T+Pbk8c\/7ejC0vKM3DHymLsaXHjL3udM8YCff1wH+5eXYLSbPNpdhWwfI4Dl1Zm4sUjo\/25MZGSXl9i3fP7PL8C4Jxx4kTpg9w\/\/ylwuSssKJbg1aoI1i\/MVexBRynwdsMgmvoj53UNZVkGfGdjNX74UjNeOjL6eNVu1sFuTsNYF0oBQmA1RRVWf4obl+Tg7svL0DYYRacrgtmCfGrWRRJ\/80H+eY8Tl1Zn45YVxbh7TSkefK4JKQqrKprVLx3qw9rqTHzhirm4Z20pdre6Z0wWQoMzhK0NQ\/jCFeZRU9CsV+Hahbl4\/dgwRh\/sEfT7Y7W7WjsuBfDMjPM5bd\/+EFff7l7tCScVg5fm5Zmwti5PMXzAH0ni1cMDiJ+nVdAyEMbeNi9uXVEEk3YaBbR8tBelOD2KOdOoxs3L8rGjcRjd7tkjTKnwREX8YUcXBnwx3HlZGa6Zn3tWPx9Jynjy\/W609AewtiYbd64uBT9DDoYTEsXr9QMIxgSFIUawtjYHFY4UjvGwoKnv8l8+2ZUyL8is3B9ornD6E5cq6QvBSER4SYrCYIc6Pdjb7jtv348oy3h2nxM1hRZcWZM1DYfXaKvpmoW5yLXr8PyBgbTvVDtVz+idEy48vasLOXYD7l5bihwTf1Y\/v6fdj6fe7wIFcNeaMqytzpoxz2Z3qxdHOpUTgsuzzVhbm51i7oD0+xJr+7e2l884cWoaCqxyB5NlSgJj1qlweV0eeE7BES7JePvYILwTUqGQ4ECnH+83urFpReqs7MlCkuVz\/0MpTk+Qthk0uGlpLt6sH0JjX5jp0ikEGXhiRzf2tLqxfnE+Pn1p6VktazIF\/rirG+8cG0CZw4B71pTCZpgZsU\/uiIC3jw1BKdlexXNYV5ejPC8IgScslLf0By6dUT6nzcePa376V+dl\/rhyL7raAiOWVyjm\/8LpjWLr8eEJizpJSsDmfX341V0LsbY2B68cmZrQhM4BP57Y1nbKP3L2d0MADARFRD\/mX1FzFK8fcuKdE940s5roBf8dbUNh\/HFn56m+beXY1erBgQ7fuL\/d6U\/iifd7sGxOFjYsK8LOFg9+817nOdxbeu0JZQq81TCEL62LoCjLNMp7sHxOJublm3Gga3RtK29UUh3v8ly6+fjxP91WV5ecEeLU368r8YSElbJMR7V04kBxeU02sq3KjujdLW60DgQn9CUf6PRhW5Mbm1bkY1vjMMKJyT8uHggKeHR7P7yRJHT8+U3eDxsdB2NJbNnXD\/ljf3eh0XCTL0wcAa6osSH7VOtwqiBbBIAKMfS7A5hflIGvXVOGN46qIMjjb4GhVyXgdAewsNSB+68oBc+J8ISjZwzQ5E5dgzcCbD3hndQcwXOhpT+EPW3uUeIEjDSQuKzagYNdwVF3KcsU\/khyjUkyLqGU7ieEyNNanCjt0X9ni2+dLyKWK5lGVj2PtdWOUbEXAJAUJGw97kJUmNjVR5Qpnt3fh199biEur3HglSNDU\/QsKC6tsuIrV1dAfz5eVnqaVtP0WaAJIagrNE\/q7zBqCL6+vhpXzM8HOYMtoz0VM3f7qgrcfEnZWT8mNUdACMGiskz8pNg+bluJAtjT6sG+jt2jQj8uNBFBxtbjw7hpWRF0p\/UA5DkOl9dk43fbOhGMy6O2dkNBoeSdo8MV6xeW7Z32ltMWFCX3tbXM98dExbW9Ks+E+Slai3e4Ivig1TUp13Www4cdTW5sWp6PbY2uqZAmEEJRYufxiWVl0PAzKv19qiUQGo77SHjGJ5qA7jyfufYsf17NcUjPHFCC3S0e9LkjqMi1jHpOi0vtqMwx4mD36PLXgYjA728O1lFK+ckIyJzSWVHcOVw35E+uEBWiJwmASyodyDJrFawMYG+rCz2e6KRclyhTbNnfh5pCGy6vyZ7058CDgjv1h6UszxbS9\/i00x1NXcbXqsPFlQ7FcZqQCXGGEstv++meSSnhO2XiRCnIgXZXrTcmz1NaQQwagkurHIqndAlJwvZmFxKTWNd5xHpyYdPyPJgn2WkjgYMMDjJOBQ8ymEBdQGKCjPea3IrpOSqOYHVVFgzqVHckr1hYbl5NKZ1wLZkycSIEdPcJT7ErEFW8zZJMHRaXWhVP6fo9URyYgNimM1tP\/agutOLyWseUDFMWijSrdp9pfXEHTnow6IsqzFuCJaVWFGUoly0aCiS0HUPhZZMxnKdMnDZtpnynR1qWlDiV0lRdWGJDrl058LK+y4duV3TSr\/FvvqcCGDXMD8RskdlDpzuC+m6\/4me5mSbML7YrPu2kSFU97siKX7zRNuFbuymbgTfYj1Z4ApE6pW2MihBcPDcLWoW6qJIsY3ebB9Ep6L4qyhQv7HeiIMMAh1XPRiwzSGaNikYSFPva3IoBmXo1h0vm2KFUwVcG0BcQqpNaU+5EX9OUnNZRSvUPv3BiaVSiiuHudqMaF5VnKhaV84aT2NvmnrJ3u7\/Tj5cP9eEfr6s6595nM2pSTQPCCXn0UXfaXWN6qxMFxb42D\/yRJDJPO5TiCMGSOQ6YDRqFUAiCQDiZ29HZUw6ge9qJEyEk9okf7yhxBeKK07IkU4fybOWuM52uKNqGp64TsiBR\/HWPE7k2c8oGnufL8R4vQGUMhSjeaXBBw3HnPKTS156hI3Wx5thh0qsnVZj+85WT+Pm7PWkm\/xT4WORVNC4iEE3nqq0ETYNRdLkjo8QJAOZmG1CaoVGM0\/KEE1p3VFpBKd0xkcGYUyJOm3f36B9\/r3WVKEPR37Sg2IZMk1IIAcXhDg+84eSUvqS9HX6c+N3ByRmwhIBSikhCxrbGAPad3HMWE+nUgCeATNM\/DCHTqMYzX1mOi6sckyoBB9vdzHycALzhBI52+bCkNGPUwVSWRYfaoiwc6R1d7UKQicoTTCzbsuWECkByWomTn1PnDoeEalkhellFKC4qs4JXiJIWJYpDHV6I8tSGPZu0HD653AGzYikVcp5TaeQ76Dl9GwUoEEhSbN4\/MCWpNueDhicsVGIakZCAve1+fHa1DPVpQaYqnsOyciv+ukeGcFrUgCxT+ELxumRFft5Ebu2mRJyON3dn9HujRqU4AbNei7qSFP6mSBINvYEpN9EzzTp86+YFKE1Rz+ZC0+0OYWfLMNqG03zqk3TYXjHOzuXgQyCSRJbl70MHOEIwv9gCo04Nf2x0+d4+b9R0+HhTxrQTp7hAFidFKBbCybNpUJSlfDLm9ETR5bkwlQd5jigGhKYDPEemx5Rn5\/zTjm5PDL2++ChxAoDiLCOyrVr4Y6PDehIylx1IqmsppUcnyu806bOPUsr7ouLCmCAphl1XOIzIVnA8UwBNfQH4Iwk2YiZwY8lgjIU3nERzX1BxXcmy6FHu0Ct2BYklRd4fjM2fyOE56eK0vatLPeCNVogyUcynm1eYAa1m9GmOLMs40h1AUmJTcdqKE3t1046ERNHY64WsEO9k0nKoLbAols8WJEKGA7F5t23ZMmHXMuni1N6vzQlEhQqqoLY6XsbiIj0UKqQgkqRoTKHgDAZj0nY6ONEbQCyp0HSTEMwrsEGpIAOlFGGBzts4d13RtBGnrvYe23AgblByhuu1GpRkKytxMBKF0x1io4XBmGJzt80lIBBVbnwwN88Ck1bBVU0I+r1xXV93m32irmTSxclDjRUSOMXQ9gyzBtk25YTCPp+AwaDExgqDMcW4AlG4\/Mp16PPtWmSmahJBuHyPoJs7LcSJ0gc5n8+bHYkrV\/8rsGqRYVQIvgTQ6YogFEuykcJgTDGheBKdHuWsjAyjFjkWZYMiHBPg8oQmLOJ2UsVpCx4igqxakJSgILUUZQ4tTHqFxpkyxcmBIAQWwcdgTDlxEWgZjCo6xY16FYoylU\/skpKkEgi3iFI6ISFKkytOW4AhfzhHVji34QhBscMClYK\/SaYUzmEvZMrc4QzGVEMp0DvkA1U4jlJzHEqzzSAKp1gi5dA9HLM9fujQhJzTTqo4ffkST55M5TlKJ3WEAEUOs2JxuXBCRodbYKOEwbgQ4gSK9uEYIgrpUYQAJdkmcArCRSlFIpmcs7y0ekJqXU+qOB1sFNSusGxRigcwqDmUZOgUT+piCREDIQksUIbBuBAQuEIJxBKjfb4cISjP1MKgVoonAHxR2fbB0UD6b+u6utvUvlAcSuaRTqOGzaSctuILx+ELx9kYYTAuEK6oBE9M2elrMxmgUQicBiHwh2I4dPTEhBThn1Rxys62zdXpVPmKN6inyDQp\/\/pAOI5YQmQjhMG4QERiIgIh5dQxq5GHSfnADjoNya2eY5+T9uLUPSTrognlrgwWnRYmjbL1544mkRCZODEYF4qkICIUVQ4nsOnUsOuVCzGGk5wqkDDkUdqpS2tx6u0fIklBWWSMBh00aoWcOkrRHaCIiazBAINxoUiIMgaDglLEADRqFQx6Ze2JCzKCwaAJg7rz3tpNngJQSkoK9JWiLBOFz2AzEmg0iuFP8PijiseYjJkBe7Ppj0QJ+n1JKJ20a9Q8rAZO8U1KkoSCTNUi5BJT2ooTBTi9Xj9fpnSUAhFCkGvkoVV0+FMEQmE2ghmMC7mAUMAfCisaCVoVQV4K6RFkqkoQzRzg\/IuhTVqxuf5+aIcDRCfKvKLC2owGxUgBSoFgJHbqobBQAiVEADLhMYHlmicHwk2g6TQdVquZM14pKHyRqOK2jiOA3aAH+Vi56Q+RKYfmAcm9BY7htBWno5E2yR2MiYrbMwKYjAbFl5kQZbgiLG9lLHQ8h41LczDoDSsMj\/TBrNchw\/A3gcow8Pj0sizUlVgUg\/iUcJhVuGN5JmJCeieBCzKHtxsDcIdnTvDwcFSGQEeLBAGBQa8FIUpZLBT+QBiYgLJOkyZO++qT1BdQ3p59\/OZG7VllIJQgzGoagzy7Cf91+9Jpca2qjxX\/qSrKxE\/vWQWAQsWPz1+6oCwbv7w3K+3vMxyXcOsv9uPd4wMzZJQRBOM8BJFCr1IwLvSpD+MCgeDEjJ3JurXawiD\/wt6EYsMyjsiwKO\/qIIoSEgILIzibST\/Tr3s63CvPzzwnaSIpQhQlQCFv35CiFyGlQCQSw5YJMJ0m7a1XV1VlWS3aMqVtHU8ozDqqGDkuyTIEkdVxYjAuNJIkK57WERDY9BSqFH0MkvLExAFNmjiFOY6XIFtSfa7hlLdtskwhSkycGIwLjSAKkJTmIgG0auX5S0FhN6tKvnX55TlpK0566AhPlI9rNCoeFrWKeZUYjHS2nOTU0Yb8GG7hREIQXEOx806OnTSfUzweB5C64atSE80PVTldXowkXzg\/As8x6Z5+zCy\/Exnj701qNTQ8j6RElZ4CtVgs5\/37J7WpJp2mxeL8UQE\/e7MdNoPmgoilWcvjzsuKkGvTs\/k+I6bzzIPnuFPljiZvjk+aOKk4wvEc4abjEAlGBfx6a9sFe\/F5Vi2um5\/FxGnaTdhzHXsUlDk5pk6cZAoqUzrl0ZQEwDULs1Dt0J6fTH24IPzd9nNqLEGrQYMMk5qNzmmEmqO4dXEmarP5sxyvFHEReP6wC4PB6dPQIyZJk+72mDRx4glSryN0JGQgpSicxz3zHHD76nLcsbxwWq9FPMeqMkwndBoV7rmq8px+1htK4ohzNwaD3rS6JzrG34cF8dSp+uhxquI5tRiPnndVgkkUpyRHUjj7k5KEkCCmzp47T1VRcaf2xGzOMKbBgsKlaZCpmueRyjOjHmOaJgU56B0OnPdp3aQ9FRWlwWRSGiApbiGRwiRUqTho1OenmaygAWN6kZ4jVqXiwaU4NY4kqOJRPAFBQiDeP\/U3RNPWctqyY4c3FFP3K30myhwCMR6U0lENDgjIeW1pCKGQZRmSLKet5UQAcByn2BeMMbvgOAICAi4Nt\/EqXlmcKKXwRQkk5SK30Gu0AM4\/AXrSxGmtYxn3tqGFBwmNWhgoCIJR5ShwtZqHTnvuzmBRInjm\/S7UNw2lrTCtnpeFa5aW4KX9PegcjkzMXpYxLSwkeuo1EwqUOYy4+eISqFUcjJoPSwulzzjQa3nwvHJByFg8mcI4AExGPTbhE+edXTdp4hQrEKjVYpGBkNIrQjQaHym3QE7f5xLYdPScXxQF8OZRN95MV6vp1C2tXViC5w8PYGuLh83ZWcKH5W0oCDgAV1ZmYP2ykpFPSLpV4qCw6SXFNBUKIByNpdyMWs2WCbmCSROnhUYjn22LqBTDtCgQicUUBUjFEWQZuPN8rOntXqAADBoOX1xXiptX5oMwo2m2GE6gZEScCChyDBoYNBwiSRkSTa9BQECQoVeNpKko3Eg4Fk8x0QgcDiOPTWksTvn5+UmzzulWcTKSEjfKcvKEY5Dp6GIMhABWk1Gxyt7M8jUAa+cVsN3crLem0vfCMk7Nw9OR6EiHJKVqtTyRUZ7FmTZh2AFg8LzmyORtX4joDYTqORBRaQUZDElIiMrlGKwW86ywJggZebXsz+z9k77aRGC3GBXnYUIAhsNE0XJScUQMBOO7gWz\/eS\/gk3mDoQg3oFbxirMyGJWRVCi9SgiQZdMqtilnMBhTg5pIKLQpVw5JCgJC0aRiPTaVikckxvUAvec9gSdVnMoKM4lGrRwoGo3HISg1ziQExRYCg4odszMYFwqNWoVsi7KRkBBFhGPK3YANagKTRRskpDiW1uJUkkVDRo1ywEMgnkQwLijuwbMMWmjVKjZCGIwLJU4a9akmJKPxRmV4Y8rpZ5IoDIsxd\/tEXMOkilN7Z6gtKUIx4CgQAzwh5Vgnm1kPY4p2xwwGY\/Kx6QkyTMq7nmA4jlhCee5qNdpkPKSekCTBSRWn2oW1UpZZo9Q\/BvGkCG9YOcLdotfAYWTixGBcKLKMGth0ysHQrlAMSUFhQ0QpHFYtlq2qmRCH8eSKU34gYFBJTiXfdkyg6HDFISsIl0HHo9A6uYWsGAxGKijybRoYtKNdKzKlaHclEFN0FxPY9HR4dV4iNhFXMamOnUcPlIbMho5BkNEBW5QCPUP+kWqZp6mXQcOhxGEAgW9GypNSadOxkCmFKxCbUc\/AYdWnLNU87I9e8PeeYzPMWmkiICh1GKFVcwrGEUX3UECxEzAhgEFn6nmqKWdC0h4mVZw2bwI+9UtNj5qjSErkNG2m6HBHkZCA0wPCCSEoyskAIX2gM0ydKCh6AzKiSQqzbnw\/c7TLh\/\/39BF4IjOjm2y2RYef3LkEdYUWRWH656cO4Xh\/5IJdX3GWAb+8aymKs4yzU5wIQVFuhuJJXUyg6HDHFI0KDUdhM9CTD60FfTjdxYkQIm36+Qf1Gp4Xk5KsOm2WoteTRCSWhEGtG\/Vw5uaZYFAThJMzzXYauaezuSt\/JI79nQGEEjOjTXuOVUKq7uKUAif6wqh3Xjhx8sVkzOaCESY1MC9HpyhO0XgCg96oYoyTWqUS4wlaTwiZkN5uk16nobzA4rcYVIo24FAoAXc4qTB9geJME8wG5hQHAE8kqRwTNs1FOpVtyVJ6LixmgwbFGQbF1zAcEjAUUq5IYNLzwsVV9gmrNTzp4iQHw81UlpyKFkE4gUGf8gqZa1Ejz8LqaMuUotcvISnz0\/5eOAJY9Tyqc3TQp2zfTWDTa9KyvtFsociuh8OqvKXt90bhT+Fe4IAhDY\/2ibqOSY90XLmsMv5Oqz88EAiNMgVjSRHtA2GsqaGjnKMWow6l2RYc7gnP6oFCKeDxR0Cn8dGAQU2wqMSCdXW5WFWVhbm5ZpQ4lAe\/w6rHw5tqsb3Zg60NgzjSFUA4KYGZU1M24jAvVwOrkVdcKJv7g4gmZcWfy7OpA3UV+RNWA2jSxWk40TloM2rbCBeuO925Lcgc6nsjinWddCqCBcUWvHCof8Y5xc92sHiD4WkZVaHmCa6oduC2i\/Nx7cJ85Nj0Z2wWynEEl9XkYtW8HNx7RTneaxjAX\/c68WaD66xPORnnYt0SVBZmQq1gucoyxYle\/6nwHzLq5zKMulbv0czBaSNOl1ss3PuZyVYtTxEXTz+xA5qcXoRjSViN2lGDdFGJDcYZ6RQfP3GRoj8oKJanZn\/CtQAAIABJREFUSGfKs\/S474pyfHZ1GfJsurOuMsFxBLk2PT59WTnWLSjAUzu78Nh7HWgbijAFmUwrV8OhrtiuWJ43GBPR1B9W7LGn4SBnW3UnTmyauGV00jf2lZWVCZNWd9CoVSt6dLu8MQyk6NdVkWOG3aSb1YMlmZTgCcvTSpiuqM7Ez+9chH+5cR7y7brzLn\/jsGrxT+sr8cs7F+OaOgdTkEkk26JBZa7ylnswEEePV7mpitmglg0GbcPDhEzYkfKUeB21NNasInRA6TNXMImu4ZDiz+Xb9ShzzHJxEkVEU2SApyOfWJKLH35qPm5YWnDGLdzZwHME1yzKxQ9vn4+bl+YyFZksizfblDIAtWsoAG9QORhYTeT+TLXQPKFbzKm44XWXVfkKs4xeJcdJNCGhocun2InEYlBhcaltVrtCgwkJvvj0CL68siYL\/\/6JaiyryJq037GoLAPf2ViL6xbkMCWZYAiAJWUZMOtGe3skmeJwVxjKB3UUxQ6j75NXVU1oGsOU1CWJHc0czNSTIzzBwtN9mhKlONgZQFyUYdD8\/QmBiuNwcUUmHld1KubyzAYCURnhRPrL89xsA\/55fSUuqsic9N+1qNSOr6+fi253BI39E3+aK1OgvjcCb4x+bNqe5apPKGryDNCopk9IhEENLC+3KVq8iaSIw51exeBUnhBY9epDohwdmnbidNttRLrr13vqtaqgGBWo6nS9buwLwB2IodhhGvWzC4ptyLHq0OWJz0ZtQjSWQFJIb2XW8AT3XTUH1yzMmzorrS4XD6yrwP\/78zFEhYk9MOn1RHH\/7w6e13dkmdT4v3sXY8XcrGkz1nJsetQWWhU\/Gwgm0DQQUPxMr4ZYlGE4fFFBQXQir2dKxIlSqv6vF461OszqZLc3Oep39vriaBoIK4pTQaYB8\/KMs1acfNF42ovTtfOzcedlJSm7w07KFoQAt68swY6mYWzePzDh3z8cOL95Fo1zCE0jXyEA1BSYkJ+h7G9q7Q+iz6c8Bw0alVfHywcm+nq4qRlIRCjRq+t1vErRYRaKS9h30q3odzLp1FhZ5ZiV7ZNkStEXkJCQ0vfmTVoOn7ykENkW7ZT\/7gyTBrdfXAybPv2qpiZFCcMhYdqEp3EEWFWZCZNW2d+0v82FSFxSsjxQmm3wr105b8K72E7Zhlgbqh62GjT7eTL6dcmnbj6cGG0h8BzBykoHrDoesw4KuP1RpHME5oryDFwz\/9xOzySZIiHKiAsSpHPMtF1bl43LKu1p91xEmUOfNzmSvT8NsBtUuKQyW9H6DcVF7D7pg6zge+M5wKrFLvmE3TnR1zRlS85ttxHpnl\/vaWgcCIjh5Gl+J0LQ2B9BrzuC2iKbgrlpRmWuEfs7g7NMmyg8gWDaRsjzBLhqfi7slrML90gIEj5odeP9piG09AUgU4rKfAsunZeLtdUOaNXjX4hsBg2uXZCDt467kJTS6N3Rkch+Ok1iZ6tyDajONyt+1uMKobkvmGJLx4uVhRn1mzZN\/AqqmrqXtZl\/fPv\/b++84+Oqzrz\/O9P7jDQalVEd9Wa54l7B2JhigsEm4IUASTYJCyEkbMib9yUY+CTsJksCGyBAnNBCB2NwwTbgCu5FtmVLltW7NCNNr\/fOPfuHbDZvuCPJxLZGo\/P9fICPmDszd0753ec85znPk1y\/q87u9dnDX3vUdTlDONTYj\/Is09eWcBaDCnOKLTjU7BlXuTE5Aej2xm90eJJWjnmlKTGTxon6clwhPP3JGbyyuwU9Xu4ry4KgD5bPW3Dn3Fw8eG0JrOaRJXsjhGB6sQXJOgV63JH4ESdQ9HkDiFIKaZyrEwEwu8QCs14ptmrD\/oaBmIHSZq1soDRdeZhcxODLy76sI2RVNNOsOmLWKk6K1fINRym+qLODi3798SeTSjC\/zAKtYnydVA9HonB441eOc5JVsKWOPGOkP8zjNx+dxu821aPbw52zCAfLS1IAfT4eT29twG8+qoM7MPLYrtwUHXLMmrib8t1uAWEu\/h+nepUEC8pSIRU5Txfio9hdZwcX41yjSaupjhhN1Zfivi7rbL9uQo7HatYclIsWYCc40DiAzgHxOK6ptiQUp+vGlThFOP7cjk88PnkpcswKGDUjd4RvONyJV3a3gKexfw9PCV7d3Yz1B9tGvJzVa2SwWZSIN9+cM8DH\/U4rAJRk6DAlT9xv193vx7HmAdExqCBRPkVNt\/9sds4lySF9uU0RWm7VfZGiU4j+mGZ7AIcbxTMuWJM1uLIiDePJdgpwUXiC8RkdTkBgNcihko9MOINhHpuO9cAdGt7690UEbKruQSA8MieSXEKQbVKCxJmIB4OhuE8SSAAsqkhDqkkt+vr+sw40O8S1J82k4eZVpNRdqnu7rHOdECJMqMw9mmpUnRV7yvk5YMdpOzj+6wNYKiG4qsICg3r8yJMrKMAdx6EyBu3Il1K+QBj1nc6RDhTUdrrgCgRHOMEINCpV3IWbOEMCXKH4Tq1s0siwuCINMpFduggfxY7TfQiKLk0pUnSK2gWTs04nhDgBwLcrk7vSdGRXLPfR7rpetDjEjyRMyU\/GpBzjuBEnnz+MSCROz9WRwUDIkVorFEBUGPlEDfNRRC4gvIDEYSBcIELhCcS35TQ5x4DJeeJzqrnPjz314ks6uYQgWS\/bvqDA0pQw4kQIiZblpuxO0ilEw02b+kLYe8Yh6m9I0SuxpCoNknESkOkNxfGygAK+QHDEGToVMin0F+CfsujV0CvkI7wVimA4HHchF5EIh0Awfk82yCUUyyamI1kkLRGlwBd1vWi1+2P0jzxQlmHYfrGKGcSFOAHA3PK8Q5km5RmxpV2QF\/DpyV4ERcpzSCQES6oykJ2sRKJDKdDr5eI2+yMFRZcnOuLYIr1WibnlI3uwEADzytJgGmHVZ0EAet2huEtlHOF59Pvjd11uTdJgcVWGaOBlIBLFtpN9CPHivZ+RpD6zqCLj5KW8v1ERp5unJHUkaWVbFDF27b4804+6TvFDhuVZJiwoS0WiVwOmlKJzgAMvxKuZSNDaH4E3MLLYIqmEYOWMLEy1mYa9tipLjxVXZEImHdnw9IZ4NNrjb1czIkjR7hJEq1rHw+NlcWUqSjMNoq+e7nBi39l+0RJQSimB1Sj\/\/Aor7b+Udzgq4kQIiVZkmj5PN8hFT1e2O0P49GS36Fk7tUKK6yalQ5fgMU8UFANuX1znT293htDWP\/Jd5KocE362rAgVmbqYD5fyDC1+fkMJpheOPPVK50AQrf3BuOxDh8sfl32oV8lw7aR0qESi8QWB4tPj3eh0xQi81MsHss3KDTk5OZe00Udthk+2pRxKM6oPir0WFSi2Hu+B3Su+Xp9fnobpBUlIZAQK9HrDcV11xeUN4uBZxwWdH7t1di7++J0puHtBHgosKhjUchhUcuSblbhjbg6euXMybp+bd0HL34MNdvS549C3QwG72494VKdZBSbMLxVPedzjDmPz8T7R3E0EFPlp+tMr5044fanvcdSOc9+9yOa66ak9W051uOcGePK1s3aHm134oq4PN8\/I\/dp7Uw1KLJ9ixe4zTvAJWpo1GKHocsd3SaSwQLD1ZB\/+ZV4uDBdQAHVRRSpmFJnRZvejxz0YKZ5hlCHbooNWeWEHvP2RKLbW2BGOxqU2ocsbRTgKaOLo3LpCCiyfmiF+XAXA7tpeVLe5RN+rkUt4q1G9YVGpwXGp73NU10YLy8y7MpPUosl4vGEBG4\/1ICjicZUQguumWDEhM3EjxjmOg38M5AP6ot6OXbX2C36fRiFFaaYBC8vNWFRhRmmW8YKFCQAO1Nux+7Q9btvH5YsgHImvHdcJWXosm5QpXm48HMWmY93wR8TDPjJMirYZBfqtl+M+R1WcllxhOZWsUWwS9YuD4LOTvahuHhB9ry1VjxumWBM2rCDC8wiE4j\/B3oCfw3v72+ENXf4J6A9H8e7+NvR641fEA8FwXIWDSAlw47RM5FnEH+xHm\/vx+ak+UYtdRgCrSfl5drCyJuHFqcxi8VZlGz6O5RjvdEXw8dEu8CLb6VIJwbeuyEJRqgaJiCsUhScUHQN3SvDx0S68t6\/tsrtWPj7Ujg8Odsb10tcbjsAXR5ZTUZoWy6dmiYYP8FEBHx\/uRE+MYwnpRkVgTlHKllWryGUZmKO+5XXPsrza0ix9vdjuDQWw8VgXGnrEc8lU5hhx45SMhKzO4vbzCETGyL2GBLywvQmHGh2X7TuPtTjxp8+b0B+IbwH3hglcgfjwi0oIsGJ6Zsw84ac73dhwrFu0aCYBRbZZvfeG+bkHLtv9jnaDzbJltGSaVG8YlBLRx0tttx8bDreLhhXIpRLcPD0bthR1womTLxRBiIuOmfs91OTCf21qQFNf4JJ\/V1t\/EL\/f3HDuaEV8E4xE4QvEx7KzOE2NW6ZnQSbiRxEEio1HOtHQK95\/RrWMzzCo356dk9I5bsQJAOZPzNiQm6I+LWY9RQVg3eEutDnEw+gnFyTjpiusIAkUlEkB9Hg5BDlhTN33+wfb8Z8f1aLFfukEqmMgiCc\/PI0397aMiTbheB6e0OiLEwGw4oosTMgRD4Jt6vNi\/eEOiB5IoBT5Fk396gWXz2qKG3EqmGNrzEtRbtbIiajCHG1xY\/2hDtFIW7lUgttm56AkRgnlMSlOlKLHFYZAx9aClYJg7c4m\/PLtEzjSdPGtmpOtTjzybg3+vLNpzLRNiCfocPGjHiVebtVh5Yxs0ah7gVJ8fLgTx9rED9yr5SSablS9s+KK7DPjTpwWEcJfNSFrXY5Z0yr2ekQgeO9AB9pjHEKcmJuMlTOyE2bnjlJgwOWN6wDMWAggeGt\/O+5\/rRp\/29MC\/0UIQApxUbyztw0PvFaNV\/a0IDqmRJuizxkY1dNWUgKsmpmFCbnigctt9gA+ONQJXhAfjAWp2vbFkzI3EkIua4qMuDkD8sCykqMZJuW6WKEuh5rdWHeoUzQaWSYluHV2DiblGBLGcnJ5fGOmcofYImLf2QE88Nox\/Oz1o9h1qgeBMH9B85PSQX\/N7tO9eOj1Y7jvlaPYUdcPjLHtD0oBp2d0HzTTbCZ8e3aOaCVfgVJ8cKANh5rEc20pZQRZSep1D15TePxy33fcFPwihEQfefvk28324IqW\/lDe19buAsV7B9px4zQr8tO+XiWiLNOAO+fm4FRHTVxGC1\/YUoCi1zP2668PBKJ4cUcLNhztxsIyC5ZWpWJGkQVpJg30SslgECD5ysAApRS+sIBuZwCHmxzYdtKO7ad60ekKjzlR+l+7iaLLy4ETBssoXW5UUmD1nBwUpYtXVmnq8eCd\/W3gYhwwzzKrW64oTXn7UqZGiXtxAoAJt1YeTT7eva7TGfqpmC\/4UJMT7+5rxb8vr\/jaU0BCCFbOysWWE33YcrJvTE\/qMCfA7idjdkL+oxXV5Y7gzf0d+PBwJ6zJWhSkKFGUqkSKyQDduWyafn8ADpcHZ\/vCOGsPo9vpR5A\/X3WGjOnf3+uhCEcEqGSXX50WT0jFqpnZotHgUUHAO\/s6cLTVK241SQGrSb3u8RWVR58YhZaLK3FaRUj0oTdOvO8NRVad7Q1m\/ePrPCV4a18Hrp2ciSqR9bM1SY3vzMvBgYZ+OINj13yKcFG4QlEkFgRBHmjs86Oxz4dPTwOEdOPvTSdKzy9+yFfvSQQCwfC5QgeXd7qZtTLcOS8PaTHygx9vceGtvW2IlTIs26xuWTghc1SsprjyOZ3nd7dPOJiTpHxfEcP3VNPhxZtftoKLim+z3zAtCytnZGEs53vyhzh4QhEkLgQUBAId9HkM\/oNzwX+JF1LrCUYQGIUqLKtmZuO6KZmir3G8gDe+bMXpbvFNJpUMyE5WrXt8RcnR0Wq3uBMnQkj0qqqctwtTtS1i5yEEELy1tw27a8WXblqlDHfNz0NZhn7MDmZvIIxQmAMjMXCFAVfw8j4sq7L0uHtBHjQxnvI7TvXgnX1t4o9wSlGUpm25cVrWqFlNcSlOAHDbRMXxCqt6nU4p\/hRtGwjj1T1t8ATFn0YzilJw90IbxDNtxj++YAThSJTN6gQhEuHgD1y+Q9xKGcHdC\/MwNT9ZXCwDHF7\/og2dMSok61VSFKao3n5g2ehZTXErTjabLbR0SvbL+am646KnSQnB+kMdWHegVfRliYTgznm5uGFyxpgbyBRAp1+An6dsVicIHB+F77IVOqC4eZoVd86ziZaJpxR4f38bPjwc68A0Ra5Zc3DhhIK1o2k1xa04AcB3Fx6tLUnTvJGskYqaR96wgFd3t6KxVzyqNc2owvcX2ZBvVo0tcaIU3R4eUYFN6oQRp2gUvV7usmRtKEzV4p6FNiTrxJP\/ne3x4LXdLfBHxG\/GrJXzc8qSP\/nxMu2oJ8mKW3EiZFX07hsq3spO0WyLdW5ud\/0AXtnVDD7GTF5clY7vXZkP+RhKN04p4HT5x2R0OCOGOAkSdLr4Sx5Uq5ASfG+RDQsr0sSXl7yAV3Y248sG8aNFBBRWo+Lj+RONzxKS4mHiNATXFqd0VGUZX7GlaERPkgoUeHV3Cz49IZpME1IJwXcX5eOmKzLH1MJuwO0B06bEgVKg3+W75A+clTOycM+iAtFIcADYUt2NV\/e0xDyXmJei9swtTXt79bRSRzy0W9zbFD+6cdZGq0n1t1jWT4crjLU7WtDtFC8EkWpU4UdX5aPSOjYOBnNRij5PmFlOiSROoOjyhHApSxBWZelw71U2WPTiy7nO\/gDW7mxBl5uLYXUBFp3i1UUzp34UL+0W9+I0O4cEr5+U\/pfCVE3M1KAbjnXj5V3NiMYodrCgPBX3LimCXhknWeaH2EQMRqLo81EAhM3qhIGg1yMgzF0adTKopLh3SSFmlaSKvs5HKdbuaMKW6q6Yn2GzaKtvmpz18qpKEjcBdmPCG\/PwTRXVlVm6N8wxnOOcAKzd3oRtx8UbnxCC78y34Z6FtvjIXDDEqXqO4+ELRth8TjD8gSAiHHcJJjDF9xfZcOc8m1j9SwDAJ9VdWLuzGVyMcZeilfFV2YY3\/8\/KimPx1GZjQpwIIZGVM20v5aZo1scSl+b+EF74vAltDvFEZxqlFPdeXYhlVelxYjmJ\/xA\/x8MTZuKUaARCIXCXIEr8+ilW3Ht1IdQxgi2b+\/x44fMmdDjFE95JCJBr0ay7Y57t5XhrM9lY6dyVs\/7iarLf8lYg0j69rsefI3bNpupeVH7WiEdvqYBC5JBlcYYOP76mEE12H2q7fKP2W7hoFI29bgAyEAwe3wiHOVBQ1PUE4AqyJV2i4QwK2FHrQG5KECAEKoUcEkLOHdnhwX2D+ouVWQbcv7QI+WnilVRCXBQvfNaALSd6Yj4Mi9O0bSunZ7y2fFqmI97abEzNAkqp5Jpfb3\/4YLP7cWcwKiqsFp0Mf\/iXiVg9zxbjM4C\/7GjEL94+iX7\/6KQlkUkJspMU8HMSEAw6TDkuinN\/wBlgR1cSkSSN\/HwXQy6Xnpt8BBq5gPaByAUViLXo5PjP26pw1wLx5RylwKu7mvHQG8fRHxAf58lqCT+zwLxm8y8X\/joe20syljqXECJcMyf\/T9nJqnUS8Yy+sPt4PPdpIw41OGJ8BnDHvDz829WFUIySf5yPUjQ7wuhzB9HrDqLPHYIzwMHp55gwJbL1FOAwEBjs4z53CL3uEHrdQTQ7whckTEopwf1Li7B6bm5MP9OBs3Y8+2lDTGGSEAqbRbvuh0uKXozX9pKMtQ5+cJHNdePU7L8Wp+uaYl2zr9GJP247iz63eHiBUi7FA8uKcc8CW0IVRmAkPgTA96\/Mw4+vKRR1XQBAtzOIZ7c14EiLK+bnlFsNLavm2F6Nx+XcmBUnAHji2xO2ZpqUT6foZIFYXfj2vk48u60B4RgVTJJ1Cvz0uhLcNM3KRjxjzHDL9Ez89NpSGDXi8UxhTsCzW8\/inQOxi41a9LKA1Sh76ufXF38Sz79VOlY76ZnfPVlzotlpdfjCU8WC2wQKnG53I9WoxOS8JFHz16xTIN+iwdkeH1ocATbyGXHN1RVmrLm5HOUximKe96c++XEdAjFiqpRSgvJM48tP3nPVkzkmEtc+BMlY7ajl0zID91xd\/nyBRbsz1olKh5\/HU5vqhww+u6IwBT+\/oRRVOUY2+hlxy9S8JPzihlJMyTfHvGbTsS78fnM9XDGzwFKUpOt23ruk5PnZOSQY779ZOpY7bNNrf+i9818f5F1Bfr7DF9GICpQvArs7iKpsI9JjpCstStchWSvH8RYnBvzMIc2IL0rTtfjVivKYWS0B4EjTAB5fV4sjLe6Y11Rl6h2Lyy1rfn5j2fax8LulY73j9q5\/rGnrcZfEG+Dm+cKCqCXY2OeHN8RjZpEZerVc9HMqsgwwqGQ41twPd4glemPEBzazCmtuLse3Z+fGvKbFHsATH57CxuqemNek6WWhwiT5o397cP5fx8pvl4z1ziMkw\/\/ozQv\/O8OofkElI7Euwtv72vDUxjq4A5EYlxDcMd+GR26qQHaSks0KxqiTk6TEL28sw21z82Je4\/RH8PtNdXh3f0fMazRygkk5hnde+rcp74yl3y9NhE586b8fCz\/5+K\/rW\/t9pT2uUAEV2aWgIDja4oJMIsHMQrNoWWYJIZiYlwS1TIIjjf3wR1jGN8boCdMjN5Xj7iFSoAQjUfxu4xk8s7UBsRKnSkAx1Za07QdXTXh4XllaGxOnUWD9a087V3\/v39sHAuFJDl9E9ABdVACOtTihU0oxrcAs2ukSQjDJlgyNXIITrS54w2yJxxhNYRK\/hotS\/HHLWfzHhjMIcrEfopkm1c5b5xQ8cd\/S3GNjrR2kidSpe9f\/qfWOHz4o+ILcrD4vJ+ogD\/MUJ1pdMGnkmGRLFs1SIJUQTM03w6SR43jLAPNBMS6jMCnwyE0VQwpTVAD+vL0BT350Gs5A7LE5MUvvmFOctObpOydtHottIU20zt2\/\/qWjU5bdEwpE+NnesCCaQNwXjuJkqxMWnRwTRYpzAoNFEibmJcOkkeFUuxvOAM9mDuOSUpSqwZqby\/GdhbGFiVLglV2N+PWHtTETxwGA1aRylabpfvXuT+e9MlbbQ5qInbz\/vd\/X1XR6LAM+frovxrLMHYziVLsLZp0cE3JiCBQBJuUlI9WgQG2nF3YvS2XCuDRUZhnw6IoyrB4iLxMAvPVlCx7\/sBYt\/bGruWQaFZica3h64y8W\/Paxxx4bs+ezElKcfvvb34bfeOWPh7+s6VW7g9z0SIz8qP1+Hifb3TBr5ZiQYxK9hhBgQo4J2WYN2ux+tA8E2UxiXFTml5jx6M0VWDE9a8jr3vyiGY99cBoN9thj0KiWocKqf\/aZ+xf9JlVF\/GO5XaSJ2uEvPPWk\/+FfPXmwutmuCXHR6XwMn+GAn0NNu2tIgQKAEqsexWla2D0h1Pf62YxiXAQolk\/OwKMrynBVZfqwwrTmg1qc7YstTGq5BOlG1bMP3DRzzdUFqv6x3jrSRO76T17\/fXD1HQ8cDFEhr98XqYiVlaLfz+FkuwvJGhkqc5JimtW5Fi2qckzwh6I41eGGwBIaML4hcglw17w8\/GpFBabEqMwLDJ4RfX13E574sA5n+2Kf\/1RIAatJ8dKqKZZHHrquoD8R2kia6IPg0Cdrgy\/98bf2rv5AXkd\/IE+IcVJ7wM\/hWPNgmEFVXpJotVRgsJrLzEIzCIATbU5EokyhGBeGSSXBT64pwi9vKkdeauyqQLxA8fKORqz54BSahvAxySXAvGLzzoevK37iJ8snNCdKO0nHw2B468WnWn\/92BMtbQ5vXo87lEdjCJQryONY8wBUcgkm5iVBFiP4Ta+WYW6xGUkaGeo6PXAF2U4eY2QUWNT4vzeW4YFrS2DSKmJeF+YEPL+tAb9efxodQ+zKyQgwvzRl10+uL11z88ycA4nUVuMqWfUzm5sW\/G1Pw5qjba6F0SEqoCRrZXhwWQkeXFYIrUo+hMlN8dGhDjy9pQG7zzjAyjkxYk80iivLU\/DjpUW4fmpmTMscAHxBDr\/fXI8\/fHJ2yAeflFBMyTXtfHBp8RO3zc\/dQQihidVm44zzAnWszbWQH0Kg1HIJfrykAA9eV4I0o2rIz6xuduLZbQ3425dtCLNlHuMfUMoI7pqXg\/uWFKIyRtjKebqcIfxhcx2e3daIEE+HXMrNyE\/auXJm\/poHrs3flYjtJh1vA2XLG8+0Pvqrx1pcgXBelzOYF8upzQsUBxoH0O8NoyhdD4sh9mHg9CQ15pRYYFDL0NDtgTvIIsoZg+SZVfj5DaV4eHkZciy6Ia891e7G4+tq8dL2JgxxIgVyCTC32LzzJ9eWrbl7Yc6uRG076XgcMBtff6b1j7\/9j5b2fq+1xxUqiGXsCBQ41upCm92PzCQVcocYXBqlFLOKU1CYpoHbH0GzPcCyk49jpARYVpWKR1aU4zvzbdAoh67CtutUDx5bV4v3D3aADrGgUckIJmUb1j38rYr\/\/NY0666EbsPxOnje+vNTrb\/8+SP7jrT0S3iK6VzM5RhBfY8fJ9q90KlkKM80QBLDUS4hBCVWI2YVJkMhJTjT5UGAY5kNxhsWnRz3Ly3CozdXYHqheUj\/Eh+lePPLFjz2QS121w9gqPBwrVKK3BTVS6smmR76\/pLyU4nejuPeg7t2W6117a72Rxv7\/P9qH6aOXZZJgfuXFuEHiwth1MiHvDbMRbH+YAde3N6EXWf6WUzUOEBCgEVlKfj+Ihtump4dszrKeVz+CP70WSOe21qPTvfQGVjT9XJkp+ief\/yWit9dM+mFNkIeS\/innnS8D6iPX3\/O+\/KLr+3r6OvVuEORSn9YiKk6nlAUX5xxwOENIz9VC4shtqNcJpWgMseE2cVmqBUSNPb44GPpVxKWLJMC9y0pwCMrKjCvLDVmDqbznGp349cf1uKZLQ1wDuOjtBrkgekFyS8+ec\/CRxcU\/1fveBAmZjn9HW2Uqm\/4xZZ7PEFhTbMjkDL01RSLKyy4f0lxEN76AAAQf0lEQVQhrpuSOexAjPACtlR34eVdLdh8vJcFbiYQChnB9ZPScfeCPCytyoB8GGspKlBsONKB57Y14rPT9mGnYIFF60jSSNes+82Sv+YQMq4OdjJx+gd++NL+fzvU4v75kRZ3znDNk5eswo+uLsR3FxXArJcP+9m97hDe\/LIVr+9pQXWbZ0jHJyPOl3AApuQZcOe8PNw6OwepBtWw77F7Ili7owEvfNaItoHwMBOToiRdc3JukfmPa38068\/jsY3Z7BDhvtdPXLfrRPdDdd2ehcP5sxVSgltnZuPexfmYUZQyZLoLYDBws6bNhb990Yq39rWjwxli3TCmoMhJVuO2WdlYPTcXFdnGIR3ewGAOpgNn+vD85814+0AHuGEsZ6UUmJRt2HN1ufm3T6xu+oSQVePSH8BmRQzWbj41+anPWn9k90a+7xiuXBSlmJhjxA+utGH13DwYNMNbURwvYHddH978og0bjnbC7mf+qHjHopXhxmmZuH12DuaWWSCXDl8fxB3k8OaeFrzweRNOdHiH\/w6dHOkG+Us\/WVb2\/D1XHq4Zr8LExGkY1h3oMP\/p0\/qHzvQEftg2EDQNd71OQXDrrGz866J8TBtmC\/k8vlAU209248297dh6svtcQUTWLfFkKZnUMiybmIHbZmfjygnp0CqG30cSKMXBsw6s3dmMd\/a1wxcZ3s9oM6tcpZn6F366fPJ\/XV1u7B\/vLc9mwXBDk1Lpnc\/tv+dgk\/Pehl7fpKHO5J0fzBOzDbh7gQ23z82DRa8Y0fe4Axw+P9GFdw90YOvJvnNnqlj3jCbJGikWV6Zh1YwsLK7KGDZ85Dx2TxhvfdmCP+9oRk2nd9h+lBKgNF1XPa3Q9PwrP5z5V0IIM6PZ6B85j607veDT6s6fnu7yLh8IDD92lDKC5VOsuGdBLq6akD6iJcB5kdpR04N1hzqx9WQP7F6OOc4v64SgSNUrsGRiBm6ZnokFZakjFqUIL2DbiR68srsFm451ITSCZBVJamm0KF2\/7uYZuc89vLx4F+sBJk7fiM3H27Ne2NJ0\/+ku710N9kDqsM1HKbKSFFg9Jxd3zrehNNMwoqUeAPjDPPbWO\/DxkU5sqe5BsyMIFoFw6ZASIN+ixrWT0nH9VCtmFqVCpxxZGKBAKU53ePDa7ia88WUbulwRDLszAoqydF3\/xCzlq7fPL33yhqnW\/kTLKsDE6TJTU1Oj+NP+wIoDTa77TnV45gT54ceThABX5Blw2+wcrJyVC2uSesTfF+EFnG534ZPqLmw+1oVj7d5zxT5Z112ERTu0Cgkm5Rhx\/eR0XDMpExVZxmFjlf7u2YNuZwDv7GvDm3vbcKTFPSIrV6sgKMs07LmqPHXtf9yetIGQXCfrCyZOF403vmwufXpT\/Xd7PJHvtQ8ETSNpSrmU4KqyFKyek43rp2bDpJWP+PsEgaLbFcQXtb3YVN2L3XV2dDjDzJr6JlaSBMhOUmF+qRnXTkzH3LJ0ZJhUMc9MijHgi+DjI51468s27KhzDBsecF4MC1K0LqtJ8dLdV9rW3rOw8CzrDSZOl4QdlMpeePrLm2s63N9r7Q8t9o2wfLleSbC0KgO3zszC1ROtMKplF\/S9gUgU9Z0ufFbTi09P9qK6zQOHj2Pn94axXlN0ckzJM+LqyjQsrkxDkdUIteLCTnC5Axw+PdGNt\/e1Y+uJnhHtwp3v8+xk9bbpeUlrv3PfrA8XEcLSpzJxuvS88kVrwSuf1X+v1xv54Zluv0kYSbNSCpNaimWTrVg5IxNXVqSP2PH699aUK8DhVIcHe2q7seO0A9XtXjh9EWZRnfMjmXVyVGUbsKjcgvll6ajINsCokY\/Y9\/f3ovTZiS68s78D2072wR3kR+BXGnSw51vUXfkpqtfvWlz6l9Wzspm1xMTpMnsvKJX+v3dOrth5qveuum7fkv4AJ8MFiNTVE9KxckYmFk9Ig0mrwgXOHQgChTPAoa7Tg731fdhzxoHadg863BGEOWFc5JYiAJRyCbKMclTmJGFOcTJml6SixGpAkkZ+Qcu28z6lAV8In53swQeHuvDpiZ7BODQysn5N0Sv4cqv281lFyc\/dMVG5tbKyklVlZeI0euyvd2Q9vaH21rN9vrtqe\/yVAY6OeCYY1FLML7Fg+bQMLJ1oRVaS+oIn1Hmh8kei6HL4Ud3qwsEGOw42u9BkD6LfF0aER0KIFQGgkAEpOiVyLVpMtxkxqzAFE3NNyEzRQqOQQCKRfKP2a+8PYOuJXnx0uBN7zvTBGxIw0ieGRk5QYNEcqcgwvvXQt\/Lem1aQ2cZmBhOnuOGvn7VMeXN\/4+oWR\/DbzfaAdfjgzf9FJaWYnJeEGyan49rJVpRlGaGQffPsNnxUgNPPoXMggJoON6pbnKhpd6HJHoDdy8Mb4iAI8S1YBIBEAuhVMlgMChSkaDAhx4SJeUmozDIgy6yFUSOD7BuI0XkifBSn2t3YXN2NDUe7cLzVjdAFhEPKCEVuirotO0n15rKptr8+fANzeDNxiuOl3kOvHp2z56z9jn4ff3uzI6ARLkCkpASwpaiwuDIN10xKx8wiCyx65Teypv5+qSJQAb5QFHZvCF0DQZzp8uJMlwtnev3o6g+iz8fBF+QQjPDgBAJKL49wEQwaJwqJAJVCAZ1ahlS9AplJKpSka1GcaUJxhgGZySqkGtTQKgcto39mEAsChd0bwr56Bz6p7sZnNX1o7Q9dkM9OAor8VE3ArJW\/ObM45a9P3znlIIvyZuI0JtjbRtXv76y+fndd7y3dzuD1XW5Oc6FR30YVweRcE5ZUpWHxhAyUZRqhUUov2LErOkEpBaUUAY4iEAzD7uPh9ATR7gqixR5G74AHHe4wHN4ogsEQAuEIfBxFkJeA46IQqADh3FZhhI+CnhtYFBQSEMhlUlAAUiKBRDr4t0YmQKsg0CiVUKuUsBhkyDIqkG42wpaigNWkRrJBjRStHBq1Aho5gYRIcBF+LgRK4Q\/xONXpxvaTPfj0RA+OtbrhDl9Y\/BgBRYZJGbCaVBsXVaS+f9O8SRtn54yvnEtMnBKEd\/e2qTccblt+vN19S78\/urzbFVZcaEpDKaFINyoxoyAJV5anYW6ZBfnpBugUEhBycbuTAqACBQUFJwChcBQczyPM8\/BHKHxhinCYAxeNguejoKDwRXiEBXpuZFEoiQQ6hQwEBDKpFDK5FEqFAgYVoJUTKGQyyOUyqBRSyCUAAQGRkIs+MCml8EUENPe4sbvOge01vTjQ6ESPJ3LBIRgSABlJyohFJ9s4ryRt07zSKW+tms1EiYlTAnC4zpPyxoH6m3bUOBYPhKPf6uz3Ky7EJ3V+fSaTElhNKkyzmXBluQWzSyywpeqhV8uGzc55yZayIv+DjNIoiwoU3hCH5h4f9p7pw45aOw43u9DpCoOPXviNSQmF1aQMpBlVG6+uSt2+\/ArD+pn5EjchthAb1UycEorN9Q7DkVM9t312vPvKZntgYbc7kvpNi7XIJATpehlKMw2YXWzB7GIzSq0GpJpUUMokF2X5F+8IlCLMC+hzhVDX6cbes\/3Ye9aBug4vur0cot8kSpVSyKUE6UZZT1GqbvesIvP6iXkp61fNzmGWEhOnxIbSZtW+9jzyt217r6jrCt3a5Qota+sPZAc4Kvum3UMIYFBKkJ2sRlWOAdPykzHJZkaBRQOzQQWVXArJJVg6Xd52GxSjQCSKAW8ITfYAqpv7cahxACfbPWgbCMIXjkKg3\/RXUmjkhM9LUbelG1Uby7ON795+1bSjs7J3coQsYtHdTJzGFzuam1U1jXz5juNdSzsGwt9qdfgnOnycMkr\/mW6ikBACo1oGq0mBojQdKnOSUJltRGG6HpkmJbQaJTRyAkJIXFpYXznsIxTeYBjdrjAaez040ebGiVYXmvp86HRG4A1x53bZvvlvkBLAopcFclO0NRkG5YdXVqV\/kr60uGYV231j4sQY5MOTHdnbj\/XMP9nqvqarP7CgyxW2+iOC9J\/O7UQpiIRAKQWMGiUyjHJkmjUoSdOgMMOIgjQtzAYtLHopdAo51Eo5FLLBoUIIQMjFtbgoBp3VlA7+FeEpgmEe\/giHPm8UTo8Pjb0B1He7caY3gHZHAL0eDp5ACKEoARX+eacWAYVOIRFSDYqW\/DTNgfIMw0eLJtr2fGuqpYuNRCZOjBhsrq9X1jcIVc393lWHzgxMbOoLVHjC0YwAJ5CL1n2UnrOaKDQKKdQqBVI0BEkaJdKMcmQmKZFsNCI5SYMMPZCqlEKlkA0Kl0IGlUIGQgiUX6UaIfj\/XOMUCEcFUEoRDvMIcTxCYR6BCAd7OIoeLzDgDGDA7UaXM4weNwdnIAyHnyIYjiAYiSJKyUWOtaLQyCUwqqRdhWna00VZxl0FZuX6pTMtTdMyMwNs5DFxYowQh6PesL1exe041lPpp9FbTnd5prr8kVlt\/UEFJ0B2SbJl0sGQADL4LxAQyCUCVDIJZFIJ5DIppBIJZDIJ5FIJNArZV8OKgH4lJgQE\/gj\/VchBVKDgeAE8H0UoKoATJINXU3z130uxxUcAKKTgrUnKgFmnOFxmNRzSyWUfFE5Ir\/HMyg4\/RgirHc\/EifHPaQZVvb7tuPSsVzq9url\/eiBCl9d3unM8QT7dF6GyqDCK+\/fx1VCQSgCdUsob1NLuzGRtbYZBtb0827CvJIkemWnT8MXFxWHWUEycGJeIA72+9K27GzI63ZFZjT3e6b3u8FRXIJLv8HKKcBQyYbyIFaWQSAgUUspb9IqIRa9oz05WHc+y6HcY1PIvJuckN7IQACZOjFHi3XdrFL40U1p9R1eJj8PC+g53Wa8nXNnl4kwhLpoc4gQZL5CEyUoglQBquYTXqaSedIPCYTHKa9JNmoNmg\/LgVJu1aVKhtL8yLc3HRgYTJ0ZcGRJt6vfey47oCrtLjrf2pjY5wiU9zsAkCrKorsunDIYiJn+Y6NxhHoQQmUBpnA6JwXAISsEbVVIoZVGXXqP2VWTroyq5dJdJrTyYrpfUTqzI6uRrU1tWrWLb\/kycGGOOmhqqMOcOFL3+aVeo3+vLONsrTXMFPIVKwk\/1CpLyTjevdXv9RCGXWv0hSnghKg1Hz5UF+XuHNfDPLxVFHO5KqQCZVMprFAQRLtqRZNQiyyjz64lwOkgVR0waXUOmyd9ZkpPluHGOWSPRJTVkEsJ215g4MRKVF198UT5\/5crSfSd82H+mkTNqtMX1XT61xayeGBKUJW3dHsE+MCDVaxVF\/ohE5w1FEYkMHvrVq2VplAhySgn8nOxczNIgEgJo5Py5dCgk4g3wfXKpFCqFAlqVDDol7wsE+IYkk4G3WU0KtTzSMDDAH82yqL0uh+vM\/GmFsjnlOmx\/\/\/36H\/zgBxzrKSZOjHG5DAQh\/+COopQq29vbJT\/bnx0B3sN9s6+ynj1DJLXNzeh2usCFfJIrptkKdBq5MQrgbLcCkcj\/rqo0aiLJTwlTiURKA\/6Aa8+BtkatzkAzMkwos9lQni3wf9i\/vafcYiH3li9UpaaCI4SEh7svBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDDik\/8BCSI+mWbtTGUAAAAASUVORK5CYII=',

        constructor: function HeaderIconModel(attributes, options) {
            Backbone.Model.prototype.constructor.call(this, attributes, options);

            // enable the model for communication with the CS REST API
            if (options && options.connector) {
                options.connector.assignTo(this);
            }

            var nodeid = options.node.get('id');
            if (nodeid) {
              this.set('id',nodeid);
            }
            this.listenTo(options.node,'change:id',function(){
              this.set({
                'id': options.node.get('id'),
                'icon': undefined
              });
            })
        },

        url: function () {
            var nodeId = this.get('id'),
                url = new Url(this.connector.connection.url).getApiBase('v2');
            url = Url.combine(url, 'businessworkspaces', nodeId, 'icons');
            return url;
        },

        add: function (files) {
            var file = files.length ? files[0] : undefined;
            if (file) {
                return this.uploadFile(file, 'POST');
            }
        },

        update: function (files) {
            var file = files.length ? files[0] : undefined;
            if (file) {
                return this.uploadFile(file, 'POST');
            }
        },

        remove: function () {
            var self = this;
            return this.destroy({
                success: function () {
                    self.trigger('icon:change');
                }
            });
        },

        uploadFile: function (file, type) {
            var self = this;
            // add file to form data
            var data = new FormData();
            data.append('file', file);
            // send to server
            return this.save(data, {
                data: data,
                type: type,
                processData: false,
                contentType: false,
                success: function () {
                    self.trigger('icon:change');
                }
            });
        }
    });

    return HeaderIconModel;
});
// The model for fetching the workspaces from the server
csui.define('conws/widgets/myworkspaces/impl/myworkspaces.model',['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/nodes',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'conws/utils/workspaces/impl/workspaces.collection.mixin'
], function (module, $, _, Backbone, Url,
    NodeCollection, BrowsableMixin, ResourceMixin, ExpandableMixin,
    WorkspacesCollectionMixin) {

  var config = module.config();

  var MyWorkspacesCollection = NodeCollection.extend({

      constructor: function MyWorkspacesCollection(models, options) {
        // Core filter values needed for rest api
        this.wherePart = ["where_workspace_type_id"];
        NodeCollection.prototype.constructor.apply(this, arguments);
        options || (options = {});
        this.options = options;

        this.makeBrowsable(options);
        this.makeResource(options);
        this.makeExpandable(options);
        this.makeWorkspacesCollection(options);
      }
  });

  BrowsableMixin.mixin(MyWorkspacesCollection.prototype);
  ResourceMixin.mixin(MyWorkspacesCollection.prototype);
  ExpandableMixin.mixin(MyWorkspacesCollection.prototype);
  WorkspacesCollectionMixin.mixin(MyWorkspacesCollection.prototype);

  _.extend(MyWorkspacesCollection.prototype, {

      url: function () {
          // Get query from options, e.g. workspace type already passed
          var queryParams = this.options.query || {};

          // Paging
          queryParams = this.mergeUrlPaging(config, queryParams);

          // Sorting, only sorting in case expanded_view is enabled
          if (queryParams.expanded_view === "true") {
            queryParams = this.mergeUrlSorting(queryParams);
          } else if (queryParams.sort) {
            delete queryParams.sort;
          }

          // Filtering
          queryParams = this.mergeUrlFiltering(queryParams);

          queryParams.metadata = undefined;

          var url = Url.combine(this.getBaseUrl(), 'businessworkspaces');
          url = url.replace('/v1', '/v2');
          // Add params to query
          return url + '?' + this.queryParamsToString(queryParams);
        }
      }
  );

  return MyWorkspacesCollection;

});
csui.define('conws/widgets/myworkspaces/impl/myworkspaces.model.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/myworkspaces/impl/myworkspaces.model'
], function (module, _, Backbone,
             CollectionFactory,
             ConnectorFactory,
             MyWorkspacesCollection) {

    var MyWorkspacesCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'myworkspaces',

        constructor: function MyWorkspacesCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var myworkspaces = this.options.myworkspaces || {};
            if (!(myworkspaces instanceof Backbone.Collection)) {
                var connector = context.getObject(ConnectorFactory, options),
                    config = module.config();
                myworkspaces = new MyWorkspacesCollection(myworkspaces.models, _.extend({
                    connector: connector
                }, myworkspaces.options, config.options, {
                    autoreset: true
                }, options));
            }

            // The initialized MyWorkspacesCollection
            this.property = myworkspaces;
        },

        fetch: function (options) {
            return this.property.ensureFetched(options);
        }

    });

    return MyWorkspacesCollectionFactory;

});

csui.define('conws/widgets/outlook/impl/utils/utility',[
    'module',
    'csui/lib/jquery',
    'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/connector',
    'csui/utils/authenticators/request.authenticator',
    'csui/utils/log'
], function Utility(module, $, PageContext, ConnectorFactory, RequestAuthenticator, log) {

    return {
        v1ToV2: replaceV1ToV2,
        startGlobalSpinner: startGlobalSpinner,
        stopGlobalSpinner: stopGlobalSpinner,
        startLocalSpinner: startLocalSpinner,
        stopLocalSpinner: stopLocalSpinner,
        modalOpen: modalOpen,
        modalClose: modalClose,
        escapeNameToCreate: escapeNameToCreate,
        escapeNameToVerify: escapeNameToVerify,

        ToggleStatusExpand: "toggleIcon toggleExpand",
        ToggleStatusCollapse: "toggleIcon toggleCollapse",
        ToggleStatusEmpty: "toggleIcon toggleEmpty",

        writeTrace: traceOutput,
        setConnector: setConnector,
        getConnector: getConnector,

        // Initial configuration values
        pageSize: 5,
        TraceEnabled: typeof(Storage) === 'undefined' ? false : localStorage.getItem('outlookTraceEnabled') ? localStorage.getItem('outlookTraceEnabled') === 'true' : false, 
        SSOEnabled: typeof(Storage) === 'undefined' ? false : localStorage.getItem('outlookAddinSSO') ? localStorage.getItem('outlookAddinSSO') === 'true' : false,
        ShowSearchFormSelection: true,
        DisplayedSearchForms: [],
        emailSavingConfig: {
            allowExpandWorkspace: true,
            onlySaveToEmailFolder: false,
            preConfigFolderToSave: {
                enabled: false,
                saveToFirstEmailFolder:  false,
                specificFolderName: ""
            }
        },
        setConfig: setConfig,

        messageListeners: {}, //one listener per source origin
        registerMessageListener: registerMessageListener,
        detachMessageListener: detachMessageListener,

        SSOLoginURL: '?func=outlookaddin.login',

        isSafeURL: isSafeURL,
        getPersistentSetting: getPersistentSetting,
        setPersistentSetting: setPersistentSetting,
        getCookie: getCookie,
        setCookie: setCookie,

        getCurrentTopDomain: getCurrentTopDomain,

        getErrorMessage: getErrorMessage,

        getSuggestedWkspFilters: getSuggestedWkspFilters,
        getSuggestedWkspEmailSearchConfig: getSuggestedWkspEmailSearchConfig,

        SuggestedWkspsView: null,

        emailProperties: {
            "project": { value: "project", displayName: "Project" },
            "from": { value: "from", displayName: "from" },
            "to": { value: "to", displayName: "To" }
        },

        disableSimpleSearch: disableSimpleSearch,
        collapsibleClicked: collapsibleClicked,
        SelectedWkspTypeId: -100,
        WkspSearchPerformed: false,

        SearchButtonHeight: 32,
        SearchFormBottomPadding: 88,
        TraceAreaHeight: 219,

        PreSaveSection: "standardSections",
        ScorllPositionBeforeSaving: -1,  // -1 means the scroll position not affected by saving panel

        uiHide: uiHide,
        uiShow: uiShow,

        ConflictHighlighted: false,
        SavingSubmitted: false,
        EmailChangedAfterSaving: false
    }

    function replaceV1ToV2(url) {
        return url.replace("/v1", "/v2/");
    }

    function startGlobalSpinner(force) {
        var spinner = $('#blockingSpinner'),
            top,
            scrollY = window.scrollY ? window.scrollY : document.documentElement.scrollTop;

        // calculate top of centered position
        top = scrollY;
        var marginCss = top > 0 ? ";margin-top: " + top + "px" : "";

        spinner.css("cssText", "display:inline-block !important; visibility:visible !important" + marginCss);
        $('body').css('pointer-events', 'none');

        //traceOutput("Spinner started by: " + arguments.callee.caller.toString());
        if (!force) {
            setTimeout(function() {
                var connector = getConnector();
                if (connector.confirmingReload) {
                    stopGlobalSpinner();
                }
            }, 500);
        }
    }

    function stopGlobalSpinner() {
        var spinner = $('#blockingSpinner');
        spinner.css("cssText", "display:none; visibility:hidden");
        $('body').css('pointer-events', '');

        //traceOutput("Spinner stopped by:" + arguments.callee.caller.toString());
    }

    function startLocalSpinner(spinnerId) {
        var id = '#' + spinnerId;
        var spinner = $(id);

        spinner.css("cssText", "display:inline-block !important; visibility:visible !important");
    }

    function stopLocalSpinner(spinnerId) {
        var id = '#' + spinnerId;
        var spinner = $(id);
        spinner.css("cssText", "display:none; visibility:hidden");
    }

    function modalOpen() {
        $('body').addClass("binf-modal-open");
    }

    function modalClose() {
        $('body').removeClass("binf-modal-open");
    }

    function setConnector(connector) {
        window.contextConnector = connector;
    }

    function getConnector() {
        if (window.contextConnector == null) {
            var context = new PageContext(),
                options = {
                    authenticator: new RequestAuthenticator({})
                };

            var connector = context.getObject(ConnectorFactory, options);
            window.contextConnector = connector;
            return connector;
        } else {
            return window.contextConnector;
        }
    }

    function escapeNameToCreate(originalString) {
        var string = originalString.replace(/:/g, '_').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
            .replace(/\u2029/g, '\\u2029');
        return string;
    }

    function escapeNameToVerify(originalString) {
        var string = originalString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return string;
    }

    function traceOutput(message) {
        var self = this;
        if (!self.TraceEnabled) {
            return;
        }

        // var traceMsgControl = $('#tracingMessage'),
        //     currentTime = new Date(),
        //     hour = currentTime.getHours(),
        //     min = ('0' + currentTime.getMinutes()).slice(-2),
        //     sec = ('0' + currentTime.getSeconds()).slice(-2),
        //     milliSec = ('00' + currentTime.getMilliseconds()).slice(-3);

        // var tiemStamp = hour + ":" + min + ":" + sec + "." + milliSec;

        // traceMsgControl.append(tiemStamp + ": " + message + '<br>');
        log.info(message);
    }

    /**
     * Helper function to register the message listener
     */
    function registerMessageListener(callback, sourceOrigin) {
        var self = this;

        if (typeof window.postMessage !== 'undefined') {
            // bind the callback to the actual event associated with window.postMessage
            if (callback && typeof sourceOrigin === 'string' && sourceOrigin) {
                self.messageListeners[sourceOrigin] = callback;
                var attachedCallback = function(e) {
                    if (e.origin) {
                        // self.writeTrace('A message received from: "' + e.origin + '"');
                        for (var source in self.messageListeners) {
                            if (self.messageListeners.hasOwnProperty(source)) {
                                if (e.origin.toLowerCase() === source.toLowerCase()) {
                                    self.writeTrace('Found matched source origin "' + e.origin);
                                    self.messageListeners[source](e);
                                }
                            }
                        }
                    }
                    return false;
                };
                if (typeof window.addEventListener !== 'undefined') {
                    window.addEventListener('message', attachedCallback, false);
                } else {
                    window.attachEvent('onmessage', attachedCallback);
                }
                self.writeTrace('Attached event listener for "' + sourceOrigin + '"');
                return attachedCallback;
            }
        } else {
            this.writeTrace('Cannot register message listener, your browser does not support window.postMessage!');
        }
        return null;
    }

    /**
     * Helper function to detach the message listener
     */
    function detachMessageListener(attachedCallback, sourceOrigin) {
        if (typeof window.postMessage !== 'undefined') {

            if (typeof sourceOrigin === 'undefined') { //remove all sources
                for (var source in this.messageListeners) {
                    if (this.messageListeners.hasOwnProperty(source)) {
                        delete this.messageListeners[source];
                        this.writeTrace('Removed event source for "' + source + '"');
                    }
                }
            } else { //remove specific source
                if (this.messageListeners.hasOwnProperty(sourceOrigin)) {
                    delete this.messageListeners[sourceOrigin];
                    this.writeTrace('Removed event source for "' + sourceOrigin + '"');
                }
            }

            for (var listener in this.messageListeners) { //check if any source remains
                if (this.messageListeners.hasOwnProperty(listener)) {
                    return; //do not detach the event listener if any source exists.
                }
            }

            if (typeof window.addEventListener !== 'undefined') {
                window.removeEventListener('message', attachedCallback, false);
            } else {
                window.detachEvent('onmessage', attachedCallback);
            }
            this.writeTrace('Detached message event listener.');
        } else {
            this.writeTrace('Cannot detach message listener, your browser does not support window.postMessage!');
        }
    }

    function getPersistentSetting(name) {
        var setting;
        if (window.SettingStorage) {
            setting = window.SettingStorage.getItem(name);
        }
        if (setting) {
            return setting;
        } else {
            return this.getCookie(name);
        }
    }

    function setPersistentSetting(name, value, expire, domain) {
        if (window.SettingStorage) {
            window.SettingStorage.setItem(name, value);
        } else {
            //this.writeTrace('-- set ticket to cookie, with domain: ' + domain + ', and expire: ' + expire);
            this.setCookie(name, value, expire, domain);
        }
    }

    function getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start === -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start === -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = c_value.length;
            }
            c_value = decodeURI(c_value.substring(c_start, c_end));
        }
        return c_value;
    }

    function setCookie(c_name, value, expire, domain) {
        var c_value = encodeURI(value);
        if (typeof expire !== 'undefined' && expire) {
            if ((new Date(expire)).toString() !== 'Invalid Date') {
                c_value += "; expires=" + (new Date(expire)).toUTCString();
            }
        }
        if (typeof domain === 'undefined' || !domain) {
            domain = this.getCurrentTopDomain();
        }
        c_value += ("; domain=." + domain + ";path=/");

        document.cookie = c_name + "=" + c_value;
    }

    function getCurrentTopDomain() {
        var i,
            h,
            weird_cookie = 'weird_get_top_level_domain=cookie',
            hostname = document.location.hostname.split('.');
        for (i = hostname.length - 1; i >= 0; i--) {
            h = hostname.slice(i).join('.');
            document.cookie = weird_cookie + ';domain=.' + h + ';';
            if (document.cookie.indexOf(weird_cookie) > -1) {
                document.cookie = weird_cookie.split('=')[0] + '=;domain=.' + h + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                return h;
            }
        }
    }

    function isSafeURL(urlString) {
        if (urlString) {
            var urlStr = urlString.toLowerCase();
            //var pattern = new RegExp('^(https?:\/)?/');
            if (urlStr.indexOf('javascript:') > -1
                || urlStr.indexOf('<') > -1) {
                this.writeTrace('URL contains unsafe string: ' + urlString);
                return false;
            }
            return true;
        }
        return false;
    }

    function getSuggestedWkspFilters(emailItem, config) {
        var filterConfig = config.filter;

        var xecmRule = window.xECMRule;
        if (typeof xecmRule !== 'undefined'){
            filterConfig.rules.push(xecmRule);
        }

        var filters = [];

        if (emailItem != null && filterConfig.rules != null && filterConfig.rules.length > 0) {
            for (var i = 0; i < filterConfig.rules.length; i++) {
                var rule = filterConfig.rules[i],
                    ruleMatch = false;

                if (!rule.enabled || rule.wkspTypeId === 0) {
                    continue;
                }

                if (rule.onlyGroup1 == null) {
                    rule.onlyGroup1 = true;
                }
                if (rule.weight == null || rule.weight === -1) {
                    rule.weight = filterConfig.weight;
                }

                var processingString = "";
                switch (rule.property) {
                case "subject":
                    processingString = emailItem.subject;
                    break;
                case "sender":
                case "from":
                    processingString = emailItem.sender.displayName + "," + emailItem.sender.emailAddress;
                    break;
                case "to":
                    processingString = emailItem.to.map(function(elem) { return elem.displayName + "," + elem.emailAddress }).join(";");
                    break;
                case "cc":
                    processingString = emailItem.cc.map(function(elem) { return elem.displayName + "," + elem.emailAddress }).join(";");
                    break;
                case "recipient":
                    var recipients = emailItem.to.map(function(elem) { return elem.displayName + "," + elem.emailAddress });
                    recipients = recipients.concat(emailItem.cc.map(function(elem) { return elem.displayName + "," + elem.emailAddress }));
                    processingString = recipients.join(";");
                    break;
                default:
                }
                if (rule.method === "RegEx") {
                    try {
                        var matchPatt = new RegExp(rule.match, "i");
                        ruleMatch = matchPatt.test(processingString);
                    } catch (e) {
                        ruleMatch = false;
                    }
                } else {
                    var processingStringLower = processingString.toLocaleLowerCase(),
                        matchLower = rule.match.toLocaleLowerCase();
                    ruleMatch = processingStringLower.indexOf(matchLower) !== -1;
                }

                if (ruleMatch) {
                    try {
                        var retrievePatt = new RegExp(rule.retrieve, "ig");

                        var retrieves = retrievePatt.exec(processingString);
                        if (rule.retrieveMethod === "capturingGroup"){
                            if (retrieves && retrieves.length > 2){
                                filters.push({ typeName: retrieves[rule.wkspTypeGroup], 
                                               typeId: -999, //a non existing wksp type ID
                                               filterName: retrieves[rule.wkspNameGroup], 
                                               weight: rule.weight });
                            }
                        } else if (retrieves && retrieves.length > 0) {
                            var term = retrieves.length > 1 ? retrieves[1] : retrieves[0];
                            filters.push({ typeName: "", typeId: rule.wkspTypeId, filterName: term, weight: rule.weight });
                        }
                    } catch (e) {
                        // Just in case invalid extraction term defined, even though it has been blocked by UI already.
                    }
                }
            }
        }
        return {
            suggestedWeight: filterConfig.weight,
            rules: filters
        };
    }

    function getSuggestedWkspEmailSearchConfig(emailItem, config) {
        var searchTerm = [];
        var searchConfig = config.search;
        //sortBy: "desc_OTObjectDate",

        if (searchConfig.weight == null) {
            searchConfig.weight = 1;
        }
        if (emailItem != null) {
            var currentUserAddress = window.currentUser,
                senderAddress = emailItem.sender.emailAddress;

            if (searchConfig.searchSender) {
                // By default, if the current user is the same as the sender of current email, then don't issue this search
                var noCurrentUserAsSender = searchConfig.noCurrentUserAsSender != null ? searchConfig.noCurrentUserAsSender : true;
                if (! noCurrentUserAsSender || currentUserAddress !== senderAddress) {
                    searchTerm.push({ region: "OTEmailSenderAddress", searchTerm: senderAddress + "," }); // has to add ',' to make the REST search working
                }
            }

            if (searchConfig.searchRecipient) {
                // By default, not include the current user in the recipient search term
                var noCurrentUserInRecipient = searchConfig.noCurrentUserInRecipient != null ? searchConfig.noCurrentUserInRecipient : true;

                // the email address for "to" is not properly populated
                var tos = emailItem.to.map(function(elem) { return noCurrentUserInRecipient && elem.emailAddress === currentUserAddress ? "" : elem.emailAddress; });
                var ccs = emailItem.cc.map(function(elem) { return noCurrentUserInRecipient && elem.emailAddress === currentUserAddress ? "" : elem.emailAddress; });

                var allRecipients = tos.concat(ccs);
                var recipients = allRecipients.reduce(function(a, b) {
                    if (a.indexOf(b) < 0) {
                        a.push(b);
                    }
                    return a;
                }, []);
                for (var i = recipients.length - 1; i >= 0; i--) {
                    if (!recipients[i]) {
                        recipients.splice(i, 1);
                    }
                }

                if (recipients.length > 0) {
                    var term = recipients.join(",") + ","; // has to add ',' in case of there is only one address
                    searchTerm.push({ region: "OTEmailRecipientAddress", searchTerm: term });
                }
            }
        }

        return {
            sort: searchConfig.sort,
            weight: searchConfig.weight,
            searchTerm: searchTerm
        };
    }

    function getErrorMessage(error) {
        if (typeof(error) === "string") {
            return error;
        }

        var errMsg = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error :
            error.message ? error.message :
            error.responseText ? error.responseText :
            error.statusText ? error.statusText : JSON.stringify(error);
        return errMsg;
    }

    function disableSimpleSearch() {
        $('#csui-custom-search-form-submit').addClass("binf-disabled csui-search-form-submit-disabled");
    }

    function setConfig(config, csUserLoginName) {
        this.pageSize = config.pageSize;
        
        var loginName = csUserLoginName ? csUserLoginName.toUpperCase() : "";

        if (!this.TraceEnabled){
            this.TraceAreaHeight = 0;
        }

        var traceEnabled = config.trace.enabled && (config.trace.userName === "" || config.trace.userName.toUpperCase() === loginName);
        this.TraceEnabled = traceEnabled;
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('outlookTraceEnabled',traceEnabled.toString());
        }

        this.SSOEnabled = config.sso;
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('outlookAddinSSO', config.sso.toString());
        }
        this.ShowSearchFormSelection = config.searchForm.enabled;
        this.DisplayedSearchForms = []; // bypass the filtering here. The search forms returned from the REST API already has this logic
        this.emailSavingConfig = {
            allowExpandWorkspace: config.save.expand,
            onlySaveToEmailFolder: config.save.emailFolderOnly,
            preConfigFolderToSave: {
                enabled: config.save.preConfig.enabled,
                saveToFirstEmailFolder: config.save.preConfig.firstEmailFolder,
                specificFolderName: config.save.preConfig.specificName
            }
        };
    }

    function collapsibleClicked(section){
        var displayArea = $("#" + section + "Section");

        if (displayArea.length === 0){
            return;
        }

        var displayStyle = displayArea[0].style.display;
        if (displayStyle === "none"){
            displayArea.css("display", "block");
        } else{
            displayArea.css("display", "none");
        }

        var collapsibleIcon = $("#" + section + "ToggleIcon");
        collapsibleIcon.toggleClass("sectionExpended");
    }

    function uiHide(uiId, uiClass){
        if (uiId){
            $("#" + uiId).addClass("hiddenArea");
        }
        if (uiClass){
            $("." + uiId).addClass("hiddenArea");
        }
    }

    function uiShow(uiId, uiClass){
        if (uiId){
            $("#" + uiId).removeClass("hiddenArea");
        }
        if (uiClass){
            $("." + uiId).removeClass("hiddenArea");
        }
    }
});
csui.define('conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model',[
    'csui/lib/backbone',
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var recentwkspsModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function recentwkspsModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);

                this.pageSize = options.pageSize;
                this.pageNo = options.pageNo;

                this.nextPageUrl = "";
            }
        },

        url: function () {
            if (this.nextPageUrl) {
                return window.ServerCgiScript + this.nextPageUrl;
            } else {
                // workspace type is no longer a required parameter. See CWS-1608
                var typeString = ''; //'where_workspace_type_id=47&';
                var pagingString = 'page=' + this.pageNo + '&limit=' + this.pageSize;
                var queryString = typeString + pagingString;

                return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspaces?expanded_view=false&' + queryString);
            }
        }

    });

    return recentwkspsModel;

});

csui.define('conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model.factory',[
    'module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model',
    'conws/widgets/outlook/impl/utils/utility'
], function (module, _, Backbone, ModelFactory, RecentWkspsModel, WkspUtil) {

  var recentwkspsModelFactory = ModelFactory.extend({

    propertyPrefix: 'recentwksps',

    constructor: function recentwkspsModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      this.property = new RecentWkspsModel(undefined, {
          connector: context.connector,
          pageNo: 1,
          pageSize: WkspUtil.pageSize
      });
    },

    fetch: function (options) {
        // Just fetch the model exposed by this factory
        return this.property.fetch(options);
    }

  });

  return recentwkspsModelFactory;

});

csui.define('conws/widgets/outlook/impl/folder/impl/folders.model',[
    'csui/lib/backbone', 
    'csui/utils/url', 

    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var foldersModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function foldersModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            } else {
                var connector = WkspUtil.getConnector();
                connector.assignTo(this);
            }

            this.id = options.id;
            this.pageSize = options.pageSize;
            this.pageNo = options.pageNo;
            this.nextPageUrl = "";
        },

        url: function () {
            if (this.nextPageUrl) {
                return window.ServerCgiScript + this.nextPageUrl;
            } else {
                var typeString = "where_type=0&where_type=751&where_type=136";
                var pagingString = 'page=' + this.pageNo + '&limit=' + this.pageSize;
                var queryString = typeString + '&' + pagingString;

                return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'nodes', this.id, 'nodes?' + queryString);
            }
        }

    });

    return foldersModel;
});


csui.define('conws/widgets/outlook/impl/wksp/impl/wksp.model',[
    'csui/lib/backbone',
    'csui/lib/jquery', 
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, $, Url, WkspUtil) {

    var wkspModel = Backbone.Model.extend({
        defaults: {
            name: 'Unnamed'
        },

        constructor: function wkspModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
            this.id = attributes.id;
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), "businessworkspaces", this.id);
        },

        getPreConfigFolder: function() {
            var self = this,
                deferred = $.Deferred(),
                promise = deferred.promise();
            if (!WkspUtil.emailSavingConfig.preConfigFolderToSave.enabled) {
                deferred.resolve({ hasPreConfigFolder: false });
            } else {
                var query, specificFolderName;
                if (WkspUtil.emailSavingConfig.preConfigFolderToSave.saveToFirstEmailFolder) {
                    query = "?where_type=751&sort=asc_name&limit=1";
                } else if (WkspUtil.emailSavingConfig.preConfigFolderToSave.specificFolderName) {
                    specificFolderName = WkspUtil.emailSavingConfig.preConfigFolderToSave.specificFolderName;
                    query = "?where_type=0&where_type=751&where_name=" + specificFolderName;
                } 

                if (query) {
                    var connector = WkspUtil.getConnector(),
                        url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), 'nodes', self.id, 'nodes', query);
                    var retrievePromise = $.ajax({
                        type: "GET",
                        headers: {
                            'OTCSTicket': connector.connection.session.ticket
                        },
                        url: url
                    });
                    retrievePromise.done(function(data) {
                        var results = data.results,
                            foundFolder = false;

                        if (results.length === 0) {
                            foundFolder = false;
                        } else if (specificFolderName) {
                            for (var i = 0; i < results.length; i++) {
                                if (results[i].data.properties.name === specificFolderName) {
                                    deferred.resolve({
                                            hasPreConfigFolder: true,
                                            folderId: results[i].data.properties.id,
                                            folderName: results[i].data.properties.name
                                        }
                                    );
                                    foundFolder = true;
                                }
                            }
                        } else if (results.length === 1) {
                            deferred.resolve({
                                    hasPreConfigFolder: true,
                                    folderId: results[0].data.properties.id,
                                    folderName: results[0].data.properties.name
                                }
                            );
                            foundFolder = true;
                        } 

                        if (!foundFolder){
                            deferred.resolve({ hasPreConfigFolder: false });
                        }
                    });
                    retrievePromise.fail(function(error, errorText) {
                        deferred.resolve({ hasPreConfigFolder: false });
                    });
                } else {
                    setTimeout(function () { deferred.resolve({ hasPreConfigFolder: false });}, 300);
                }
            }
            return promise;
        }

    });

    return wkspModel;

});

csui.define('conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model',[
    'csui/lib/jquery',
    'csui/lib/backbone',   
    'csui/utils/url',
    'conws/widgets/outlook/impl/wksp/impl/wksp.model',
    'conws/widgets/outlook/impl/utils/utility'
], function ($, Backbone, Url, WkspModel, WkspUtil) {

    var favoritewkspsModel = Backbone.Model.extend({
        defaults: {
            name: 'favoriteWksps'
        },

        constructor: function favoritewkspsModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            this.options = options;

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), "members/favorites");
        },

        parse: function (response) {
            if (response && response.results && response.results.length > 0) {
                for (var i = response.results.length-1; i >= 0; i--) {
                    if (response.results[i].data.properties.type !== 848) {
                        response.results.splice(i, 1);
                        continue;
                    }

                    response.results[i].data.properties.icon = "impl/images/mime_workspace.svg";
                }
            }
            return response;
        }

    });

    function updateIconUrl(wksp, options) {

        // this is not working. revisit later. the async called are executed after return method..... 

        var wkspModel = new WkspModel({ id: wksp.data.properties.id }, options);

        $.when(wkspModel.fetch()).then(function(data, status, jqXhr) {
            wksp.data.properties.icon = data.results.data.properties.icon;
        });
    }

    function getIcon(wksp, options) {
        var deferred = $.Deferred();
        var wkspModel = new WkspModel({ id: wksp.data.properties.id }, options);
        wkspModel.fetch({
            success: (function(result) {
                var iconUrl = result.get('results').data.properties.icon;
                wksp.data.properties.icon = iconUrl;
            })
        });
        return deferred.promise();
    }

    return favoritewkspsModel;

});

csui.define('conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model.factory',[
    'module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',   
    'conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model'    
], function (module, _, Backbone, ModelFactory, FavoriteWkspsModel) {

  var favoritewkspsModelFactory = ModelFactory.extend({

    propertyPrefix: 'favoritewksps',

    constructor: function favoritewkspsModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
     
      this.property = new FavoriteWkspsModel(undefined, {
          connector: context.connector,
          context: context
      });
    },

    fetch: function (options) {
        options.context = this.property.options.context;
        return this.property.fetch(options);
    }

  });

  return favoritewkspsModelFactory;
});

// Lists explicit locale mappings and fallbacks

csui.define('conws/widgets/outlook/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('conws/widgets/outlook/impl/nls/root/lang',{
    config_CS_missing: "The Content Server that this add-in connects to has not been specified properly.",

    error_create_Blob: "Creating the Blob object for the email content failed with error: {0}",
    error_create_CORS: "Creating CORS request failed.",
    error_CORS_NoResponse: "CORS call does not return anything.",
    error_retrieve_config: "Retrieving add-in configuration failed with error: {0}",
    error_retrieve_email: "Retrieving current email failed with error: ",
    error_retrieve_email_body: "Retrieving email body failed with error: {0}",
    error_retrieve_email_content: "Retrieving email content through Exchange Web Service failed with error: {0}",
    error_retrieve_favorite: "Retrieving favorite business workspace failed with message: {0}",
    error_retrieve_recent: "Retrieving recently accessed business workspace failed with message: {0}",
    error_retrieve_search: "Searching business workspace failed with message: {0}",
    error_retrieve_searchQueries: "Retrieving custom view search queries failed with message: {0}",
    error_retrieve_suggested: "An error occurred when retrieving suggested business workspaces: {0}",
    error_retrieve_suggestedConfig: "Retrieving configuration failed with message: {0}",
    error_retrieve_token: "Retrieving accessing token for EWS failed.",
    error_save_email: "The saving process did not complete successfully. {0}",
    error_validate_name: "Validating the name failed with message: {0}",

    help_button_tooltip: "Help",

    info_confirm_saving: 'The email will be saved to folder "{0}".',
    info_retrieving: 'Retrieving...',
    info_save_successful: "The email has been saved successfully.",

    name_untitled: "Untitled",

    noWksp_favorite: "No favorite business workspace",
    noWksp_recent: "No recently accessed business workspace",
    noWksp_search: "No business workspace found",
    noWksp_suggested: "No suggested business workspace",

    required_fields_title: "Enter required fields",
    required_fields_switchLabel: "Only required fields (*)",

    save_action_both: "Save email and attachment(s)",
    save_action_attachment: "Save attachment(s)",
    save_action_email: "Save email",
    save_attachment_text: "Save attachments separately",
    save_attachment_option: "Save all attachments",
    save_button_back: "Back",
    save_button_next: "Next",
    save_button_close: "Close",
    save_enterName: "Enter a unique name to save this email.",
    save_email_info: 'Save email to folder "{0}".',
    save_email_text: "Save email and attachments as one file",
    save_email_text_noAttachment: "Save email as one file",
    save_failed: "{0} failed with message: {1}.",
    save_label: "Save",
    save_metadate_form_invalid: "Correct the values on the form then click Next to save.",
    save_nameNotUnique: "Add this email with a unique name:",
    save_noSelection: "You must select the email or the attachment(s) you want to save.",
    save_successful_all: "The email and attachment(s) have been saved successfully.",
    save_successful_attachment: "The attachment has been saved successfully.",
    save_successful_attachments: "The attachments have been saved successfully.",
    save_successful_email: "The email has been saved successfully.",
    save_selection_conflict: "Conflict",
    save_selection_conflict_msg: "File(s) with the same name already exists. Please rename the file(s) then click Next to continue.",

    search_all_wksp: "Search all workspaces",
    search_button_tooltip: "Search",
    search_clear_button_tooltip: "Clear search",
    search_custom_button_label: "Custom search",
    search_noCondition: "Specify the search condition",
    search_result_title: "Search results",
    search_select_form: "Select a Search Form",
    search_select_wksp_type: "Select a workspace type",
    search_selected_wksp_type: "Workspace type",
    search_wksp_typeName: "Workspace Type and Name",
    search_wkspName_placeholder: "Search for Business Workspaces",

    sectionTitle_customSearch: "Custom search",
    sectionTitle_favorite: "Favorite workspaces",
    sectionTitle_recent: "Recent workspaces",
    sectionTitle_search: "Search workspaces",
    sectionTitle_suggested: "Suggested workspaces",

    showMore_link: "Show more...",
    showMore_folders: "Show more folders",
    showMore_wksp: "Show more workspaces",

    signIn_button_Title: "Sign in",
    signIn_required: "Enter the user name and password.",
    signIn_message: "Sign in to continue to {0}",
    signIn_password: "Password",
    signIn_title: "Sign in Content Server",
    signIn_username: "User name",

    ssoTimeout: "Single sign-on timeout.",

    title_cancel: "Cancel",
    title_ok: "OK",
    title_save_email: "Save email",
    title_save_email_to: "Save email to ",
    title_save_error: "Error",
    title_save_success: "Success",

    validation_name_conflict: 'An email item "{0}" already exists in the folder "{1}".',
    validation_no_subject: "The email does not contain a subject.",

    warning_no_outlook_context: "Cannot retrieve email information. Make sure the add-in is running within Outlook context.",
    warning_session_expired: "Session expired",

    wksp_open_link: "Open in browser"
});


csui.define('conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model',[
    'csui/lib/backbone', 
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function (Backbone, Url, WkspUtil, lang) {

    var searchwkspsModel = Backbone.Model.extend({

        defaults: { name: 'Unnamed' }, 

        constructor: function searchwkspsModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspacetypes');
        },

        parse: function (response) {
            response.results.unshift({ data: { properties: { wksp_type_id: -100, wksp_type_name: lang.search_select_wksp_type} } });
            return response;
        }

    });

    return searchwkspsModel;

});

csui.define('conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model.factory',[
    'module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',   // Factory base to inherit from
    'conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model'     // Model to create the factory for
], function (module, _, Backbone, ModelFactory, SearchWkspsModel) {

  var searchwkspsModelFactory = ModelFactory.extend({

    propertyPrefix: 'searchwksps',

    constructor: function searchwkspsModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      this.property = new SearchWkspsModel(undefined, {
          connector: context.connector
      });
    },

    fetch: function (options) {
        // Just fetch the model exposed y this factory
        return this.property.fetch(options);
    }

  });

  return searchwkspsModelFactory;

});

csui.define('conws/widgets/outlook/impl/searchwksps/impl/searchresult.model',[
    'csui/lib/backbone',   
    'csui/utils/url',      
    'conws/widgets/outlook/impl/utils/utility'
], function (Backbone, Url, WkspUtil) {

    var searchresultModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function searchresultModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            // Enable this model for communication with the CS REST API
            if (options && options.connector) {
                options.connector.assignTo(this);

                this.wkspName = options.wkspName;
                this.wkspTypeId = options.wkspTypeId;
                this.typeAhead = options.typeAhead;
                this.pageSize = options.pageSize;
                this.pageNo = options.pageNo;

                this.nextPageUrl = "";
            }
        },

        url: function () {
            if (this.nextPageUrl) {
                return this.connector.getConnectionUrl().getCgiScript() + this.nextPageUrl;
            } else {
                var typeString = this.wkspTypeId && this.wkspTypeId > 0 ? 'where_workspace_type_id=' + this.wkspTypeId : "";
                var nameString = this.wkspName ? 'where_name=contains_' + encodeURIComponent(this.wkspName) : "";
                // Combining "sort by name" and "expanded_view=true" together requires to index the workspace name column, 
                // otherwise will see 404 error. 
                var pagingString = 'sort=asc_name&page=' + this.pageNo + '&limit=' + this.pageSize;
                var queryString = typeString ? typeString + '&' : '';
                queryString = queryString + (nameString ? nameString + '&' : '') + pagingString;

                return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspaces?expanded_view=true&' + queryString);
            }
        }

    });

    return searchresultModel;

});

csui.define('conws/widgets/outlook/impl/searchwksps/impl/wksptypes.model',[
    'csui/lib/backbone',
    'csui/utils/url',
    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function (Backbone, Url, WkspUtil, lang) {

    var wksptypesModel = Backbone.Model.extend({

        defaults: {
            name: 'Unnamed'
        },

        constructor: function wksptypesModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

            if (options && options.connector) {
                options.connector.assignTo(this);
            }
        },

        url: function () {
            return Url.combine(WkspUtil.v1ToV2(this.connector.connection.url), 'businessworkspacetypes');
        },

        parse: function (response) {
            var types = [];
            types.push({ value: 0, name: lang.search_all_wksp });

            return types;
        }

    });

    return wksptypesModel;

});

csui.define('conws/models/configurationvolume/configurationvolume.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/fetchable/fetchable.mixin'
], function (_, $, Backbone, Url, FetchableMixin) {
  

  var VolumesModel = Backbone.Model.extend({

    constructor: function VolumesModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
      this.makeFetchable(options);
    },

    url: function () {
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl  = Url.combine(baseUrl, 'configurationvolumes');
      return getUrl;

    },

    parse: function (response) {
      this.fetched = true;
      return {shortcutItems: response.results};
    },

    isFetchable: function () {
      return true;
    }
  });

  FetchableMixin.mixin(VolumesModel.prototype);
  
  return VolumesModel;
}); 

csui.define('conws/models/configurationvolume/configurationvolume.factory',[
  'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'conws/models/configurationvolume/configurationvolume.model', 'csui/utils/commands'
], function (module, $, Backbone, ModelFactory, ConnectorFactory,
    volumesModel, commands) {
  

  var ConfigurationVolumeFactory = ModelFactory.extend({
    propertyPrefix: 'configurationvolume',

    constructor: function ConfigurationVolumeFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new volumesModel(options, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.ensureFetched(options);
    }
  });

  return ConfigurationVolumeFactory;
});

csui.define('bundles/conws-models',[
  'conws/models/workspacecreateforms',
  'conws/models/metadata.controller',
  'conws/models/favorite.model',
  'conws/models/workspacecontext/workspacecontext.model',
  'conws/models/workspacecontext/workspacecontext.node.model',
  'conws/models/workspacecontext/workspacecontext.node.factory',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/utils/previewpane/impl/previewheader.model',
  'conws/utils/previewpane/impl/attributes.model',
  'conws/utils/previewpane/impl/role.model',
  'conws/widgets/team/impl/team.model',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.columns',
  'conws/widgets/team/impl/participant.model',
  'conws/widgets/team/impl/participants.model',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/roles.model',
  'conws/widgets/team/impl/roles.model.expanded',
  'conws/widgets/team/impl/roles.model.factory',
  'conws/widgets/team/impl/controls/filter/impl/filter.model',
  'conws/models/categoryforms/categoryforms.model',
  'conws/models/selectedmetadataform/selectedmetadataform.model',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'conws/utils/workspaces/impl/workspaceutil',
  'conws/utils/workspaces/workspace.model',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.model',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.factory',
  'conws/widgets/header/impl/header.model',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/header/impl/header.icon.model',
  'conws/widgets/myworkspaces/impl/myworkspaces.model',
  'conws/widgets/myworkspaces/impl/myworkspaces.model.factory',
  'conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model',
  'conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model.factory',
  'conws/widgets/outlook/impl/folder/impl/folders.model',
  'conws/widgets/outlook/impl/wksp/impl/wksp.model',
  'conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model',
  'conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model.factory',
  'conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model',
  'conws/widgets/outlook/impl/searchwksps/impl/searchwksps.model.factory',
  'conws/widgets/outlook/impl/searchwksps/impl/searchresult.model',
  'conws/widgets/outlook/impl/searchwksps/impl/wksptypes.model',
  'conws/models/configurationvolume/configurationvolume.factory',
  'conws/models/configurationvolume/configurationvolume.model'

], {});
