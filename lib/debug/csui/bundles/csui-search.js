csui.define('csui/models/widget/search.results/facet.server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/node.facets/facet.query.mixin'
], function (_, Url, FacetQueryMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      FacetQueryMixin.mixin(prototype);
      var originalSync = prototype.sync;

      return _.extend(prototype, {
        filterQueryParameterName: 'filter',

        makeServerAdaptor: function (options) {
          return this.makeFacetQuery(options);
        },

        cacheId: '',

        url: function () {
          var url = this.connector.getConnectionUrl().getApiBase('v2');
          return Url.combine(url, 'search');
        },

        sync: function (method, model, options) {
          var query = this.options.query.toJSON();
          //Global Search
          if (!!this.options.query.resetDefaults) {
            this.orderBy = "";
            this.skipCount = 0;
            this.options.query.resetDefaults = false;
          } else {
            this.orderBy = ((this.orderBy) &&
                            (this.previousQuery !== this.options.query.attributes.where)) ? "" :
                           this.orderBy;
            this.skipCount = (this.previousOrderBy !== this.orderBy) ? 0 : this.skipCount;
            this.topCount = this.options.topCount ? this.options.topCount : 10;
          }

          _.extend(query, this.getFilterParam(this.filters)); // returns an object with facets array
          _.extend(query, this.getBrowsableParams()); // returns object containing browsable_params
          query.options = '{\'facets\'}';

          // consider cache_id only while sorting and pagination.
          if ((!!this.orderBy || !!this.pagination) && !!this.cacheId) {
            query.cache_id = this.cacheId;
            this.pagination = false; // reset pagination to default.
          }

          _.extend(options, {
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: query,
            traditional: true
          });
          return originalSync.apply(this, arguments);
        },

        parse: function (response, options) {
          response.results = response.featured ? response.featured.concat(response.results) :
                             response.results;
          this.parseBrowsedState(response.collection, options);
          //Create search facets
          this._parseFacets(response.collection.searching.facets);
          response.results.sorting = response.collection.sorting;
          this.cacheId = (!!response.collection && !!response.collection.searching &&
                          !!response.collection.searching.cache_id) ?
                         response.collection.searching.cache_id : "";
          return this.parseBrowsedItems(response, options);
        },

        _parseFacets: function (facets) {
          var topics;
          if (facets) {
            topics = convertFacets(facets.selected, true)
                .concat(convertFacets(facets.available, false));
          }
          this.reset(topics);
        }
      });
    }
  };

  function convertFacets(facets, selected) {
    return _.map(facets, function (facet) {
      var topics = _.map(facet.facet_items, function (topic) {
        return {
          name: topic.display_name,
          total: topic.count,
          value: topic.value,
          selected: selected
        };
      });
      return {
        id: facet.name,
        name: facet.display_name,
        type: facet.type,
        topics: topics,
        items_to_show: 5
      };
    });
  }

  return ServerAdaptorMixin;
});
  

csui.define('csui/models/widget/search.results/search.facets',[
  'csui/lib/underscore', 'csui/models/facets',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/browsable/v1.request.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/widget/search.results/facet.server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, FacetCollection, ConnectableMixin, FetchableMixin,
    BrowsableV1RequestMixin, BrowsableV2ResponseMixin, ServerAdaptorMixin) {
  'use strict';

  var SearchFacetCollection = FacetCollection.extend({
    constructor: function SearchFacetCollection(models, options) {
      this.options = options || (options = {});
      FacetCollection.prototype.constructor.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeBrowsableV1Request(options)
          .makeBrowsableV2Response(options)
          .makeServerAdaptor(options);
    },
    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        skip: this.skipCount,
        top: this.topCount,
        filters: _.deepClone(this.filters)
      });
    },

    isFetchable: function () {
      return (!!this.options.query.get('where') || !!this.options.query.get('query_id'));
    }
  });

  BrowsableV1RequestMixin.mixin(SearchFacetCollection.prototype);
  BrowsableV2ResponseMixin.mixin(SearchFacetCollection.prototype);
  ConnectableMixin.mixin(SearchFacetCollection.prototype);
  FetchableMixin.mixin(SearchFacetCollection.prototype);
  ServerAdaptorMixin.mixin(SearchFacetCollection.prototype);

  return SearchFacetCollection;
});

csui.define('csui/models/widget/search.results/object.to.model',['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone"
], function ($, _, Backbone) {
  "use strict";

  var RegionsModel = Backbone.Model.extend({
    constructor: function RegionsModel() {
      Backbone.Model.apply(this, arguments);
    }
  });

  var RegionsModelCollection = Backbone.Collection.extend({
    model: RegionsModel,

    constructor: function RegionsModelCollection() {
      Backbone.Collection.apply(this, arguments);
    },

    isFetchable: false
  });

  var displayRegions = ['available', 'selected'];

  var toModel = function (model) {
    _.each(model, function(item) {
      if (_.isObject(item)) {
        displayRegions.map(function(region) {
          if (item[region]) {
            if (_.isArray(item[region])) {
              item[region] = new RegionsModelCollection(item[region]);
            }
          }
        });
      }
    });
    return model;
  };

  return toModel;
});
// Shows a form
csui.define('csui/widgets/search.custom/impl/form.view',['module', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/form.view'
], function (module, $, _, Marionette, Alpaca, FormView) {

  var CustomSearchFormView = FormView.extend({
    constructor: function CustomSearchFormView(options) {
      this.options = options || {};
      FormView.prototype.constructor.call(this, _.extend(options, {custom: {adjustHeight: true}}));
      this.jQuery = $;
      var that = this;
      //Custom Flatten the array object of set categories
      this.customFlatten = function (x, result, prefix) {
        if (_.isObject(x)) {
          _.each(x, function (v, k) {
            that.customFlatten(v, result, k);
          });
        } else {
          if (/^(anydate|anyvalue)/i.test(x)) {
            x = "";
          }
          result[prefix] = x;
        }
        return result;
      };

      this.customFilter = function () {
        var that        = this,
            result      = [],
            flattenData = that.customFlatten(that.objectList(that.getValues()), {});
        if (_.isObject(flattenData)) {
          _.each(flattenData, function (v, k) {
            if (that.customEndsWith(k, '_DFrom') || that.customEndsWith(k, '_DFor') ||
                that.customEndsWith(k, '_DTo')) {
              var original_k = k.substr(0, k.lastIndexOf('_'));
              if (!v && !!flattenData[original_k]) {
                flattenData[original_k] = "";
              }
            }
            if (v) {
              result.push(v);
            }
          });
        }
        return result;
      };

      this.customEndsWith = function (string, substring) {
        return string.indexOf(substring, string.length - substring.length) !== -1;
      };

      this.objectList = function (data) {
        var list = [];
        _.each(data, function (item) {
          if (_.isObject(item)) {
            list.push(item);
          }
        });
        return _.flatten(list);
      };

      this.$el.on("keydown", function (event) {

        if (event.keyCode === 13 &&
            (event.target.type === "text" || event.target.type === 'search') &&
            event.target.value.trim() !== "") {
          //handling typeahead field (userfield)
          if ($(event.target).is('input.typeahead') &&
              $(event.target).siblings('.typeahead.scroll-container:visible').length !== 0) {
            return;
          }
          that.triggerSearch(event);
        } else if (event.keyCode === 13 &&
                   that.jQuery(".binf-dropdown-menu").parent(".binf-open").length >= 1) {
          event.stopImmediatePropagation();
        } else if (event.keyCode === 13) {
          if (event.target.value === "") {
            var defaultValues = that.customFilter();
            if (!!defaultValues && defaultValues.length === 0) {
              that.options.customView.trigger('enable:search', false);
            } else {
              that.triggerSearch(event);
            }
          } else {
            that.options.customView.trigger('enable:search', true);
          }
        }
      });

      this.$el.on("keyup", function (event) {
        if (event.target.type === "text") {
          if (event.target.value === "") {
            var defaultValues = that.customFilter();
            if (!!defaultValues && defaultValues.length === 0) {
              that.options.customView.trigger('enable:search', false);
            }
          } else {
            that.options.customView.trigger('enable:search', true);
          }
        }
      });
    },

    triggerSearch: function (event) {
        this.options.customView.trigger("trigger:search");
    },

    updateRenderedForm: function () {
      return false;
    },

    onRenderForm: function () {
      this.options.customView.triggerMethod("render:form");
    },

    onChangeField: function (event) {
      var defaultValues = this.customFilter();
      if (defaultValues.length === 0) {
        this.options.customView.trigger('enable:search', false);
      } else {
        this.options.customView.trigger('enable:search', true);
      }
      if (window.event && (window.event.keyCode === 13 || window.event.which === 13)) {
        if (!!event.value) {
          this.options.customView.trigger('enable:search', true);
          this.options.customView.triggerMethod("field:updated");
        } else {
          if (!!defaultValues && defaultValues.length === 0) {
            this.options.customView.trigger('enable:search', false);
          } else if (defaultValues && defaultValues.length !== 0) {
            this.options.customView.triggerMethod("field:updated");
          }
        }
      }
    }
  });
  return CustomSearchFormView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/customsearchform',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isSetType : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper;

  return "      <div class=\"binf-col-md-12 cs-form-singlecolumn cs-form-set\"\r\n           id=\"csfSingleCol_"
    + this.escapeExpression(this.lambda((depths[2] != null ? depths[2].modelId : depths[2]), depth0))
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n";
},"4":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper;

  return "      <div class=\"binf-col-md-12 cs-form-doublecolumn\"\r\n           id=\"csfLeftCol_"
    + this.escapeExpression(this.lambda((depths[2] != null ? depths[2].modelId : depths[2]), depth0))
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"binf-row\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n";
},"useData":true,"useDepths":true});
Handlebars.registerPartial('csui_widgets_search.custom_impl_customsearchform', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/customsearch.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-custom-search-formitems\"></div>";
}});
Handlebars.registerPartial('csui_widgets_search.custom_impl_customsearch.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.custom/impl/search.customFormView',['csui/lib/marionette',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/widgets/search.custom/impl/form.view',
  'hbs!csui/widgets/search.custom/impl/customsearchform',
  'hbs!csui/widgets/search.custom/impl/customsearch.item'
], function (Marionette, _, $, base, CustomSearchFormView, CustomSearchTemplate,
    CustomSearchItemTemplate) {

  var CustomSearchAttrItemView = Marionette.ItemView.extend({
    tag: 'div',
    className: "customsearch-attr-container",
    constructor: function CustomSearchAttrItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model.on('error', this.errorHandle, this);
    },
    template: CustomSearchItemTemplate,
    onRender: function (e) {
      var _searchCustomFormViewEle = new Marionette.Region({
            el: this.$el.find('.csui-custom-search-formitems')
          }),
          formView                 = new CustomSearchFormView({
            context: this.options.context,
            model: this.model,
            layoutMode: 'singleCol',
            mode: 'create',
            customView: this,
            templateId: this.model.attributes.data.templateId
          });
      _searchCustomFormViewEle.show(formView);
      this.formView = formView;
    },
    onRenderForm: function () {
      this.options.objectView.triggerMethod("render:form");
      return;
    }
  });

  return CustomSearchAttrItemView;

});

csui.define('csui/widgets/search.custom/impl/search.customview.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/utils/url'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {
  var SearchCustomModel = Backbone.Model.extend({

    constructor: function SearchCustomModel(attributes, options) {
      options || (options = {});
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.options = options;
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  ConnectableMixin.mixin(SearchCustomModel.prototype);
  FetchableMixin.mixin(SearchCustomModel.prototype);
  _.extend(SearchCustomModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    },

    url: function () {
      return Url.combine(this.connector.connection.url,
          'nodes/' + this.options.nodeId + '/customviewsearchforms');
    },

    parse: function (response, options) {
      response.name = response.text;
      return response;
    }
  });

  return SearchCustomModel;
});




csui.define('csui/widgets/search.custom/impl/search.customview.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/widgets/search.custom/impl/search.customview.model'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, SearchCustomModel) {

  var SearchCustomViewFactory = ModelFactory.extend({

    propertyPrefix: 'customSearch',

    constructor: function SearchCustomViewFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var customSearch = this.options.customSearch || {};
      if (!(customSearch instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        customSearch = new SearchCustomModel(customSearch.attributes || config.attributes, _.defaults({
          connector: connector,
          nodeId: options.customQuery.nodeId
        }, customSearch.options, config.options));
      }
      this.property = customSearch;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return SearchCustomViewFactory;

});

csui.define('csui/widgets/search.custom/impl/search.customquery.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/utils/url'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {
  var SearchCustomModel = Backbone.Model.extend({

    constructor: function SearchCustomModel(attributes, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  ConnectableMixin.mixin(SearchCustomModel.prototype);
  FetchableMixin.mixin(SearchCustomModel.prototype);

  _.extend(SearchCustomModel.prototype, {

    isFetchable: function () {
      return this.options.node.isFetchable();
    },

    url: function () {
      return Url.combine(this.connector.connection.url,
          'searchqueries/' + this.get('id'));
    },

    parse: function (response, options) {
      response.name = response.text;
      return response;
    }
  });

  return SearchCustomModel;
});




csui.define('csui/widgets/search.custom/impl/search.customquery.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/widgets/search.custom/impl/search.customview.factory',
  'csui/widgets/search.custom/impl/search.customquery.model',
  'csui/utils/contexts/factories/connector'
], function (module, _, Backbone, ModelFactory, CustomViewFactory,
    SearchCustomQueryModel, ConnectorFactory) {

  var CustomQueryFactory = ModelFactory.extend({

    propertyPrefix: 'customQuery',

    constructor: function CustomQueryFactory(context, options) {
      options || (options = {});
      ModelFactory.prototype.constructor.apply(this, arguments);

      var customQuery = this.options.customQuery || {};
      if (!(customQuery instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        customQuery = new SearchCustomQueryModel(options.attributes, _.extend({
          connector: connector
        }, config.options, customQuery.options));
      }
      this.property = customQuery;
    },

    fetch: function (options) {
      return this.property.fetch(this.options);
    }

  });

  return CustomQueryFactory;

});

csui.define('csui/widgets/search.custom/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.custom/impl/nls/root/lang',{
  searchButtonMessage: "Search",
  title: "Custom View Search"
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/customsearch.main',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"csui-saved-search-submit-container\">\r\n    <button class=\"binf-btn binf-btn-primary csui-custom-search-form-submit\"\r\n            id=\""
    + this.escapeExpression(((helper = (helper = helpers.searchButton || (depth0 != null ? depth0.searchButton : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchButton","hash":{}}) : helper)))
    + "\" value=\"Search\"> "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.search : stack1), depth0))
    + " </button>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-saved-search-form\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.searchFormId || (depth0 != null ? depth0.searchFormId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchFormId","hash":{}}) : helper)))
    + "\"></div>\r\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hideSearchButton : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_search.custom_impl_customsearch.main', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.custom/impl/error.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-error-icon-div\">\r\n  <div class=\"csui-error-icon-parent\">\r\n    <div class=\"csui-error-icon notification_error\"></div>\r\n  </div>\r\n</div>\r\n<div class=\"csui-suggestion\">"
    + this.escapeExpression(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{}}) : helper)))
    + "</div>";
}});
Handlebars.registerPartial('csui_widgets_search.custom_impl_error.template', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/search.custom/impl/search.custom',[],function(){});
csui.define('csui/widgets/search.custom/impl/search.object.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/widgets/search.custom/impl/search.customFormView',
  'csui/controls/tile/behaviors/blocking.behavior',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/widgets/search.custom/impl/search.customquery.factory',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'i18n!csui/widgets/search.custom/impl/nls/lang',
  'hbs!csui/widgets/search.custom/impl/customsearch.main',
  'hbs!csui/widgets/search.custom/impl/error.template',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/contexts/factories/next.node',
  'css!csui/widgets/search.custom/impl/search.custom.css'
], function (_, $, Marionette, Backbone, SearchCustomFormView, BlockingBehavior,
    SearchQueryModelFactory, SearchCustomQueryFactory, FetchableMixin, lang, SearchObjectTemplate,
    errorTemplate, PerfectScrollingBehavior, NextNodeModelFactory) {

  var SearchObjectView = Marionette.CompositeView.extend({
    className: "csui-custom-view-search",

    templateHelpers: function () {
      var messages = {
        search: lang.searchButtonMessage
      };
      var hideSearchButton = this.options.hideSearchButton ? this.options.hideSearchButton : false;
      var searchFormId = this.searchFormId;
      var searchButton = _.uniqueId("csui-custom-search-form-submit");
      return {
        messages: messages,
        hideSearchButton: hideSearchButton,
        searchFormId: searchFormId,
        searchButton: searchButton
      };
    },
    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".csui-custom-search-formitems",
        scrollYMarginOffset: 15
      }
    },
    constructor: function SearchObjectView(options) {
      options = options || {};
      options.data || (options.data = {});
      this.context = options.context;
      this.searchFormId = _.uniqueId("csui-saved-search-form");
      this.jQuery = $;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      if (!options.model) {
        var savedSearchQueryId = options.data.savedSearchQueryId ||
                                 options.savedSearchQueryId;
        this.model = options.context.getCollection(SearchCustomQueryFactory, {
          attributes: {
            id: savedSearchQueryId
          }
        });
        FetchableMixin.mixin(SearchCustomQueryFactory);
      }
      this.listenTo(this.model, "sync", this.render);
      this.listenTo(this.model, 'error', this.handleError);

      this.$el.on({
        "change input": _.bind(this._refreshDOM, this)
      });
    },
    ui : function() {
     return { searchFormId : '#' + this.searchFormId };
    },
    _refreshDOM: function () {
      setTimeout(_.bind(function () {
        this.triggerMethod('dom:refresh');
      }, this), 500);
    },

    template: SearchObjectTemplate,
    events: {
      "click .csui-custom-search-form-submit": "loadCustomSearch"
    },
    onRender: function (e) {
      if (this.model.attributes && this.model.attributes.data) {
        if (!!this.options.parentView) {
          if (!!this.model.get("schema").title) {
            this.options.parentView.options.title = this.model.get("schema").title;
          } else {
            //consider title from server in below precedence
            //1. From server, 2. Widget options, 3. lang bundles
            this.options.parentView.options.title = (!!this.options.parentView.options.data &&
                                                     !!this.options.parentView.options.data.title) ?
                                                    this.options.parentView.options.data.title :
                                                    (this.options.parentView.options.title ||
                                                     lang.title);
          }
          this.trigger("change:title");
        } else {
          var schemaSearchTitle = !!this.model.get("schema").title ?
                                  this.model.get("schema").title : lang.title;
          if (!!this.options.titleElement) {
            this.options.titleElement.html(schemaSearchTitle);
            this.options.titleElement.attr("title", schemaSearchTitle);
          }
        }
        if (this.options.customValues) {
          this.updateCustomSearch(this.options.customValues.updatedValues,
              this.options.customValues.attributes, this.model.get("data"));
        }
        this.options.objectView = this;
        var _searchCustomFormView = new SearchCustomFormView(_.extend(this.options,
            {model: this.model}));
        this.listenTo(_searchCustomFormView, 'trigger:search', this._triggerSearch);
        this.listenTo(_searchCustomFormView, 'enable:search', function (isSearchEnabled) {
          this._enableSearch(isSearchEnabled);
        });
        var _searchCustomFormViewEle = new Marionette.Region({
          el: this.ui.searchFormId
        });
        _searchCustomFormViewEle.show(_searchCustomFormView);
        this.customFormView = _searchCustomFormView;
        if (this.options && typeof this.blockActions === 'function') {
          this.blockActions();
        }
        //Until user enters any value the search button should be in disable mode
        var defaultValues = _.filter(_.flatten(_.map(this.model.get("data"), _.values)),
            function (val) {return val; });
        if (!!defaultValues && defaultValues.length === 0) {
          this._enableSearch(false);
        } else {
          this._enableSearch(true);
        }
      }
    },
    handleError: function () {
      if (this.model.error && this.model.error.message) {
        //consider title from server in below precedence
        //1. From server, 2. Widget options, 3. lang bundles
        this.options.parentView.options.title = (!!this.options.parentView.options.data &&
                                                 !!this.options.parentView.options.data.title) ?
                                                this.options.parentView.options.data.title :
                                                (this.options.parentView.options.title ||
                                                 lang.title);
        this.trigger("change:title");
        this.ui.searchFormId.addClass("csui-custom-error");
        var emptyEl = errorTemplate.call(this, {errorMessage: this.model.error.message});
        this.ui.searchFormId.append(emptyEl);
        this.$el.find(".csui-saved-search-submit-container").addClass("binf-hidden");
      }
    },
    _triggerSearch: function () {
      var that = this;
      setTimeout(function (event) {
        if (!that.jQuery(".csui-custom-search-form-submit").hasClass("binf-disabled")) {
          that.loadCustomSearch();
        }
      }, 50);
    },
    _enableSearch: function (isSearchEnabled) {
      if (isSearchEnabled) {
        this.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
            "csui-search-form-submit-disabled");
        this.trigger('enable:search', true);
      } else {
        this.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
            "csui-search-form-submit-disabled");
        this.trigger('enable:search', false);
      }
    },

    onRenderForm: function () {
      if (this.$el.is(':visible')) {
        this._refreshDOM();
      }
      this.unblockActions();
      if (this.options.parentView &&
          typeof this.options.parentView.unblockActions === 'function') {
        this.options.parentView.unblockActions();
      }
      return;
    },
    onFieldUpdated: function () {
      this.loadCustomSearch();
    },

    updateCustomSearch: function (updatedFormValues, updatedValues, dataModel) {
      if (!!updatedFormValues) {
        this.model.attributes.data = _.extend(this.model.attributes.data, updatedFormValues);
      } else if (!!updatedValues) {
        var self               = this,
            cloneUpdatedValues = updatedValues;
        _.each(dataModel, function (dataVal, dataKey) {
          if (dataVal instanceof Object) {
            _.each(dataVal, function (cVal, cKey) {
              if (cVal instanceof Object) {
                _.each(cVal, function (cV, cK) {
                  if (!!cloneUpdatedValues[cK]) {
                    cVal[cK] = cloneUpdatedValues[cK];
                    delete cloneUpdatedValues[cK];
                  }
                });
              } else if (!!cloneUpdatedValues[cKey]) {
                dataVal[cKey] = cloneUpdatedValues[cKey];
                delete cloneUpdatedValues[cKey];
              }
            });
          }
        });
        //Add remaining values to model
        _.each(cloneUpdatedValues, function (val, key) {
          if (key !== "query_id") {
            var keyTokens = (key.indexOf("__") !== -1) ? key.split('__') : undefined,
                tempObj   = {};
            if (!!keyTokens) {
              var parentAttr = (keyTokens[0].indexOf("_") !== -1) ? key.split('_') : undefined;
              if (!!parentAttr) {
                tempObj[key] = val;
                var parentObj = this.model.attributes.data[parentAttr[0]];
                parentObj[keyTokens[0]] = _.extend(parentObj[keyTokens[0]], tempObj);
              } else {
                tempObj[key] = val;
                this.model.attributes.data[keyTokens[0]] = _.extend(
                    this.model.attributes.data[keyTokens[0]],
                    tempObj);
              }
            } else {
              var keyToken = (key.indexOf("_") !== -1) ? key.split('_') : undefined;
              tempObj[key] = val;
              this.model.attributes.data[keyToken[0]] = _.extend(
                  this.model.attributes.data[keyToken[0]],
                  tempObj);
            }
          }
        }, this);
      }
    },

    loadCustomSearch: function () {
      var defaultValues = this.customFormView.formView.customFilter();
      if (!!defaultValues && defaultValues.length !== 0) {
        if (this.$(".csui-custom-search-form-submit").hasClass("binf-disabled")) {
          this._enableSearch(true);
        }
        this.updatedFormValues = this.customFormView.formView.getValues();
        this.queryModel = this.options.query || this.context.getModel(SearchQueryModelFactory);
        this.nextNode = this.context.getModel(NextNodeModelFactory);
        if (!this.options.query && _.isEmpty(this.queryModel.attributes) &&
            _.isEmpty(this.nextNode.attributes)) {
          history.pushState({"search": {name: undefined, id: undefined}}, "", location.href);
        }
        this.queryModel.clear({silent: true});
        this.queryModel.updatedValues = this.updatedFormValues;
        var params = {};
        _.each(this.updatedFormValues, function (curChild) {
          if (curChild instanceof Object) {
            _.each(curChild, function (childValue, childKey) {
                  if (childValue instanceof Object) {
                    _.each(childValue, function (val, key) {
                      params[key] = val;
                    });
                  } else {
                    params[childKey] = childValue;
                  }
                }
            );
          }
        });
        params['query_id'] = this.model.get("data").templateId;
        // Always show results in new perspecitve even when this CVS triggered from search results itself. (using sidepanel)
        params.forcePerspectiveChange = this.options.showInSearchResultsNewPerspective;
        this.resetPageDefaults();
        this.queryModel.set(params);
        this.trigger('click:search');
      } else {
        this._enableSearch(false);
      }
    },

    resetPageDefaults: function () {
      this.queryModel.resetDefaults = true;
    }
  });
  return SearchObjectView;
});

csui.define('csui/widgets/search.custom/search.custom.view',[
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/controls/tile/tile.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/widgets/search.custom/impl/search.object.view',
  'i18n!csui/widgets/search.custom/impl/nls/lang'
], function (_, Handlebars, Marionette, $, base, TileView, DefaultActionBehavior,
    SearchCustomObjectView, lang) {

  var CustomSearchWidgetView = TileView.extend({
    constructor: function CustomSearchWidgetView(options) {
      options || (options = {});
      options.title = options.title || lang.title;
      options.icon = options.titleBarIcon || 'title-customviewsearch';
      this.context = options.context;

      TileView.prototype.constructor.call(this, options);

      options = options.data ? _.extend(options, options.data) : options;
      this.options = options;
      this.options.parentView = this;
      this.contentViewOptions = this.options;
    },
    contentView: SearchCustomObjectView,
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    onShow: function () {
      this.$el.find('.tile-title .csui-heading').html('');
      this.listenTo(this.contentView, "change:title", this.updateTitle);
    },
    updateTitle: function () {
      this.$el.find('.tile-title .csui-heading').html(base.escapeHtml(this.options.title));
      this.$el.find('.tile-title').attr("title", this.options.title);
      this.$el.find('.tile-controls').attr("title", this.options.title);
    }
  });
  return CustomSearchWidgetView;
});

csui.define('csui/controls/settings/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/settings/impl/nls/root/lang',{
  summaryDescriptionTitle: "Summary / description",
  columnSettingsTitle: "Column settings",
  selectColumns: "Select columns",
  searchBackToTooltip: 'Go back to \'{0}\'',
  searchBackToAria: 'Go back to \'{0}\'',
  addAvailableColumns:"Add columns",
  addColumnsAria: "Add table columns to show",
  removeColumn: 'Remove \'{0}\'',
  removeColumnAria: 'Remove column \'{0}\' from table',
  SearchBackToolTip: 'Back',
  SearchBackAria: 'Close',
  selected: 'Selected',
  SummaryOnly: 'Summaries only',
  SummaryPreferred: 'Summaries preferred',
  DescriptionOnly: 'Descriptions only',
  DescriptionPreferred: 'Descriptions preferred',
  SummaryAndDescription: 'Summaries and descriptions'
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/available.columns/impl/available.columns',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"column-header\">\r\n  <div class=\"icon arrow_back\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.backToButtonTitle || (depth0 != null ? depth0.backToButtonTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backToButtonTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.backToButtonAria || (depth0 != null ? depth0.backToButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backToButtonAria","hash":{}}) : helper)))
    + "\" role=\"button\"></div>\r\n  <div class=\"column-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</div>\r\n  <div class=\"selected-column-count\"></div>\r\n</div>\r\n<div class=\"columns-list binf-list-group\" role=\"group\">\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_settings_available.columns_impl_available.columns', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/available.columns/impl/available.column',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"column-item-container\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon icon-listview-checkmark\"></span>\r\n  <span class=\"column-label\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_settings_available.columns_impl_available.column', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/settings/available.columns/available.columns.view',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/settings/impl/nls/lang',
  'hbs!csui/controls/settings/available.columns/impl/available.columns',
  'hbs!csui/controls/settings/available.columns/impl/available.column'
], function ($, _, Backbone, Marionette, PerfectScrollingBehavior, lang, AvailableColumnsTemplate,
  AvailableColumnTemplate) {
  'use strict';

  var AvailableColumnsItemView = Marionette.View.extend({
    template: AvailableColumnTemplate,

    attributes: {
      tabindex: '0',
      role: 'checkbox',
      'aria-checked': 'false'
    },

    className: 'column-item',

    /*
     * if event required, replace triggers with events
     * and trigger column:add from event handler
     */
    triggers: {
      'click': 'column:add',
      'keydown': {event: "keydown:item", stopPropagation : false, preventDefault: false}
    },

    constructor: function AvailableColumnsItemView (options) {
      Marionette.View.apply(this, arguments);
    }
  });

  var AvailableColumnsCollectionView = Marionette.CollectionView.extend({
    childView: AvailableColumnsItemView,

    childViewEvents: {
      'column:add': 'onColumnAdd',
      'keydown:item': 'onChildViewKeydown'
    },
    constructor: function AvailableColumnsCollectionView (options) {
      Marionette.CollectionView.apply(this, arguments);
      this.focusIndex = 0;
    },

    onColumnAdd: function (view) {
      view.$el.toggleClass('selected');
      var selectedItem = view.$el.hasClass('selected');
      selectedItem ? view.$el.attr('aria-checked',true) : view.$el.attr('aria-checked',false);
      if (!!selectedItem) {
        view.model.set({
          isNew: true
        });
        this.options.availableSelectedColumnsCollection.add(view.model);
        //Moving the non removable columns to the top
        if (view.model.get('key') === "OTName") {
          if (!this.options.selectedColumnsCollection.findWhere({key:'OTMIMEType'})) {
            this.options.selectedColumnsCollection.add(view.model, {at:0});
          } else {
            this.options.selectedColumnsCollection.add(view.model, {at:1});
          }
        } else if (view.model.get('key') === "OTMIMEType") {
          this.options.selectedColumnsCollection.add(view.model, {at:0});
        } else {
          this.options.selectedColumnsCollection.add(view.model);
        }
      } else {
        view.model.set({
          isNew: false
        });
        this.options.availableSelectedColumnsCollection.remove(view.model);
        this.options.selectedColumnsCollection.remove(view.model);
      }

      this.options.settingsView.options.data.display_regions = 
        "{" +
        this.options.selectedColumnsCollection
          .pluck('key')
          .map(function (key) {
            return "'" + key + "'";
          })
          .join(",")
        + "}";
    },

    onBeforeDestroy: function () {
      if (this.options.availableSelectedColumnsCollection) {
        this.collection.remove(this.options.availableSelectedColumnsCollection.models);
        this.options.availableSelectedColumnsCollection.reset();
      }
    },

    onChildViewKeydown: function (childView, event) {
      var focusables = this.$el.find('*[tabindex]');
      switch (event.which) {
        case 27:
          this.$el.closest(".csui-search-settings").trigger('focus');
          this.options.settingsView.triggerMethod('close:menu', event);
          break;
        case 13:
        case 32:
          this.onColumnAdd(childView);
          event.preventDefault();
          event.stopPropagation();
          break;
        case 38:
          this.focusIndex > 0 && --this.focusIndex;
          $(focusables[this.focusIndex]).trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
        case 40:
          this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          $(focusables[this.focusIndex]).trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
        case 9:
          this.$el.parents(".available-columns-container").
                              find('.arrow_back').trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    }
  });

  var SelectedColumnsCountView = Marionette.View.extend({

    constructor: function SelectedColumnsCountView () {
      Marionette.View.apply(this, arguments);
      this.listenTo(this.options.availableSelectedColumnsCollection,
        'update', this.render);
    },

    templateContext: function () {
      return {
        count: this.options.availableSelectedColumnsCollection.length || '',
        label : lang.selected
      };
    },

    template: _.template("<span title='<%=label%> <%=count%>'><%=count%></span>")
  });

  var AvailableColumnsView = Marionette.View.extend({
    className: 'csui-available-column',

    template: AvailableColumnsTemplate,

    templateContext: function () {
      return {
        label: lang.selectColumns,
        available: this.options.availableColumns,
        backToButtonTitle: _.str.sformat(lang.searchBackToTooltip, lang.columnSettingsTitle),
        backToButtonAria: _.str.sformat(lang.searchBackToAria, lang.columnSettingsTitle),
      };
    },

    regions: {
      columnsList: '.columns-list',
      selectedColumnsCountView: '.selected-column-count'
    },

    ui: {
      backArrow: '.arrow_back'
    },

    events: {
      'keydown @ui.backArrow': 'onKeyDownArrow',
      'click @ui.backArrow': 'showSelectedColumns',
      "keydown": "onKeyInView"
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.columns-list',
        suppressScrollX: true,
        // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15
      }
    },

    onKeyDownArrow: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32 || keyCode === 37) {
        this.showSelectedColumns(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    onKeyInView: function (event) {
      var focusables = this.$el.find('.column-item*[tabindex]'),
          focusIndex = 0;
      switch (event.which) {
        case 27:
          this.$el.closest(".csui-search-settings").trigger('focus');
          this.options.settingsView.triggerMethod('close:menu', event); 
          break; 
        case 9:
          this.availableColumnsCollectionView.focusIndex = 0;
          $(focusables[focusIndex]).trigger('focus');
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    },

    constructor: function AvailableColumnsView (options) {
      Marionette.View.apply(this, arguments);
      this.options.availableSelectedColumnsCollection = new Backbone.Collection();
    },

    showSelectedColumns: function (event) {
      if (this.options.selectedColumnsCollection) {
        this.options.selectedColumnsCollection.add(this.options.collection.remove(this.options
          .availableSelectedColumnsCollection.models));
        this.options.availableSelectedColumnsCollection.reset();
      } 
      this.options.settingsView.showSettings("selectedColumnsContainer", this.options
        .selectedColumnView);
    },

    onRender: function () {
      this.availableColumnsCollectionView = new AvailableColumnsCollectionView(this.options);
      this.showChildView('columnsList', this.availableColumnsCollectionView);
      this.showChildView('selectedColumnsCountView', new SelectedColumnsCountView({
        availableSelectedColumnsCollection: this.options.availableSelectedColumnsCollection
      }));
    }

  });
  return AvailableColumnsView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/selected.columns/impl/selected.columns',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"column-header\">\r\n  <div class=\"icon arrow_back\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.backButtonTitle || (depth0 != null ? depth0.backButtonTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backButtonTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.backButtonAria || (depth0 != null ? depth0.backButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backButtonAria","hash":{}}) : helper)))
    + "\" role=\"button\"></div>\r\n  <div class=\"column-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</div>\r\n</div>\r\n<div class=\"add-button\" tabindex=\"0\" role=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.addColumnsAria || (depth0 != null ? depth0.addColumnsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addColumnsAria","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon icon-columnsadd\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.addAvailableColumns || (depth0 != null ? depth0.addAvailableColumns : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"addAvailableColumns","hash":{}}) : helper)))
    + "\"></span>\r\n</div>\r\n<div class=\"columns-list binf-list-group\" role=\"menu\">\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_settings_selected.columns_impl_selected.columns', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/selected.columns/impl/selected.column',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"remove-button icon circle_delete\" tabindex=\"0\" role=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.removeColumnAria || (depth0 != null ? depth0.removeColumnAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeColumnAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.removeColumn || (depth0 != null ? depth0.removeColumn : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"removeColumn","hash":{}}) : helper)))
    + "\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"column-item-container\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"icon icon-draggable-handle6\"></span>\r\n  <span class=\"column-label\" data-csui-key=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isRemovable : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_settings_selected.columns_impl_selected.column', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/settings/selected.columns/selected.columns.view',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/settings/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/settings/available.columns/available.columns.view',
  'csui/controls/table/table.view',
  'hbs!csui/controls/settings/selected.columns/impl/selected.columns',
  'hbs!csui/controls/settings/selected.columns/impl/selected.column'
], function ($, _, Backbone, Marionette, base, PerfectScrollingBehavior, lang, TabableRegionBehavior,
  AvailableColumnsView, TableView, SelectedColumnsTemplate, SelectedColumnTemplate) {
  'use strict';

  var SelectedColumnItemView = Marionette.View.extend({

    template: SelectedColumnTemplate,

    className: function () {
      return 'column-item' + (this.model.get('isNew') ? ' csui-new-column-item' : '');
    },

    attributes: {
      'data-value': 'column',
      'role': 'menuitem'
    },

    ui: {
      removeBtn: '.remove-button'
    },

    triggers: {
      'keydown': { event: "keydown:item", stopPropagation: false, preventDefault: false },
      'click @ui.removeBtn': { event: "column:remove", stopPropagation: false, preventDefault: false }
    },

    templateContext: function () {
      var nonRemovable = ['OTName', 'OTMIMEType'],
        key = this.model.get('key');
      return {
        name: this.model.get('name'),
        label: key,
        isRemovable: nonRemovable.indexOf(key) > -1 ? false : true,
        removeColumn: _.str.sformat(lang.removeColumn, this.model.get('name')),
        removeColumnAria: _.str.sformat(lang.removeColumnAria, this.model.get('name'))
      };
    },

    constructor: function SelectedColumnItemView(options) {
      Marionette.View.apply(this, arguments);
      //disable drag &drop of search columns for Standard results
      if (options && options.isTabularView) {
        this.$el.attr('draggable', true);
      }
      this.model.set('sequence',
        this.model && this.model.collection && this.model.collection.findIndex(this.model));
    }
  });

  var SelectedColumnsCollectionView = Marionette.CollectionView.extend({
    className: 'csui-selected-column',

    childView: SelectedColumnItemView,

    childViewOptions: function () {
      return {
        isTabularView: this.options && this.options.isTabularView
      };
    },

    childViewEvents: {
      'column:remove': 'onColumnRemove',
      'keydown:item': 'onChildViewKeydown'
    },

    constructor: function SelectedColumnsCollectionView(options) {
      options || (options = {});
      this.options = options;
      this.focusIndex = 0;
      Marionette.CollectionView.apply(this, options);
    },

    onColumnRemove: function (view) {
      this.options.availableColumnsCollection.add(this.options.collection.remove(view.model));
      this.options.settingsView.$el.css('height', this.options.settingsView.currentCard.outerHeight());
      // TODO: Find better way to append formdata with {list}.
      this.options.settingsView.options.data.display_regions =
        "{" +
        this.collection
          .pluck('key')
          .map(function (key) {
            return "'" + key + "'";
          })
          .join(",")
        + "}";
    },

    attachHtml: function (collectionView, childView, index) {
      Marionette.CollectionView.prototype.attachHtml.call(this, collectionView, childView, index);
      // Drag & Drop is disabled for OTName , OTMIMEType and Standard Result Search Columns
      if (!this.options.isTabularView || childView.model.get('key') === 'OTName' ||
        childView.model.get('key') === 'OTMIMEType') {
        childView.$el.addClass('drag-disabled');
        childView.$el.removeAttr("draggable");
      } else {
        this.attachDragListeners(childView);
      }
    },

    _getItemKey: function (el) {
      return el.find('[data-csui-key]').attr('data-csui-key');
    },

    attachDragListeners: function (childView) {
      var me = this,
        subItem = childView.$el,
        removeDragline = function () {
          me.$el.find('.csui-dragline').remove();
          delete me._dropAfter;
        };

      subItem.on('dragstart', function (event) {
        me._dragData = {
          sourceKey: me._getItemKey($(event.currentTarget))
        };
        event.originalEvent.dataTransfer.setData('text', '');
      });

      subItem.on('dragover', function (event) {
        if (!me._dragData || me._dragData.sourceKey === undefined) {
          return;
        }
        event.preventDefault();

        var dragline = $('<div class="csui-dragline">');
        var h = $(event.currentTarget).height();
        if (event.offsetY > (h / 2)) {
          if (me._dropAfter === undefined || me._dropAfter === false) {
            removeDragline();
            $(event.currentTarget).after(dragline);
            me._dropAfter = true;
          }
        } else {
          if (me._dropAfter === undefined || me._dropAfter === true) {
            removeDragline();
            $(event.currentTarget).before(dragline);
            me._dropAfter = false;
          }
        }
      });

      subItem.on('drop', _.bind(function (event) {
        if (!me._dragData || me._dragData.sourceKey === undefined) {
          return;
        }
        this.onSubItemDrop(me, event);
      }, this));

      subItem.on('dragleave', function (/*event*/) {
        removeDragline();
      });

      subItem.on('dragend', function (event) {
        event.preventDefault();
        removeDragline();
        delete me._dragData;
      });
    },
    onSubItemDrop: function (scope, event) {
      var me = scope;
      var sourceKey = me._dragData && me._dragData.sourceKey || me.keyDragSource || null,
        targetKey = me._getItemKey($(event.currentTarget)),
        sourceModel = me.collection.findWhere({ key: sourceKey }),
        targetModel = me.collection.findWhere({ key: targetKey }),
        sourceIndex = me.collection.indexOf(sourceModel),
        targetIndex = me.collection.indexOf(targetModel);
      event.preventDefault();

      if (sourceIndex === targetIndex || !sourceIndex) {
        return;
      }

      if (me._dropAfter === true) {
        targetIndex++;
      }

      if (sourceIndex < targetIndex) {
        targetIndex--;
      }

      me.collection.remove(sourceModel);
      me.collection.add(sourceModel, { at: targetIndex });
      me.$el.find('.csui-dragline').remove();
      if (me.keyDragSource) {
        me.$el.find('.active').removeClass('active');
        $(me.$el.children()[targetIndex]).addClass('active');
        me.$el.find('.active > *[tabindex]').trigger('focus');
      }
      me.triggerMethod('reorder', sourceModel);

      if (me._dragData && me._dragData.sourceKey) {
        delete me._dropAfter;
      }

      this.options.settingsView.isChanged = true;
      //update formData
      this.options.settingsView.options.data.display_regions =
        "{" +
        this.collection
          .pluck('key')
          .map(function (key) {
            return "'" + key + "'";
          })
          .join(",")
        + "}";
    },
    onSubItemPaste: function (scope, event) {
      var me = scope;
      var dragline = $('<div class="csui-dragline">');
      me.$el.find('.csui-dragline').remove();
      if (event.keyCode === 40) {
        $(event.currentTarget).after(dragline);
      }
      else {
        $(event.currentTarget).siblings('.active').before(dragline);
      }
    },
    onChildViewKeydown: function (childView, event) {
      var isMac = base.isMacintosh(),
        keyCode = event.keyCode,
        focusables = this.$el.find('*[tabindex]'),
        addButton;
        if ( this.options.isTabularView &&(isMac && event.metaKey && !event.ctrlKey || !isMac && !event.metaKey &&
          event.ctrlKey) ) {
        // control-X or command-X (MacOS)

        event.preventDefault();
        event.stopPropagation();

        if (keyCode === 88) {
          this.keyDragSource = this._getItemKey($(event.currentTarget));
        }
        else if (keyCode === 86) {
          this.onSubItemDrop(this, event);
          this.keyDragSource = undefined;
        }
      }
      else if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (keyCode === 13 || keyCode === 32) {
        this.onColumnRemove(childView, event);
        event.stopPropagation();
        (focusables.length - 1) === this.focusIndex ? --this.focusIndex : '';
        focusables = this.$el.find('*[tabindex]');
        //check if all columns has been removed
        if (focusables.length === 0) {
          addButton = this.$el.parents(".selected-columns-container").find(
            '.add-button');
          addButton.trigger('focus');
        } else {
          $(focusables[this.focusIndex]).closest('.column-item').addClass('active');
          $(focusables[this.focusIndex]).trigger('focus');
        }
      } else if (focusables.length) {
        if (keyCode === 38 || keyCode === 40) {
          $(focusables[this.focusIndex]).closest('.column-item').removeClass('active');
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).closest('.column-item').addClass('active');
          $(focusables[this.focusIndex]).trigger('focus');
          if (this.keyDragSource && this.focusIndex >= 0) {
            this.onSubItemPaste(this,event);
          }
          event.stopPropagation();
          event.preventDefault();
        }
        if (event.keyCode === 9) {
          $(focusables[this.focusIndex]).closest('.column-item').removeClass('active');
          if (event.shiftKey && this.options.availableColumnsCollection.length) {
            addButton = this.$el.parents(".selected-columns-container").find(
              '.add-button');
            addButton.trigger('focus');
          } else {
            var backButton = this.$el.parents(".selected-columns-container").
              find('.arrow_back');
            backButton.trigger('focus');
          }
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  });

  var SelectedColumnsView = Marionette.View.extend({
    constructor: function SelectedColumnView(options) {
      Marionette.View.apply(this, arguments);
    },

    template: SelectedColumnsTemplate,

    templateContext: {
      label: lang.columnSettingsTitle,
      backButtonTitle: lang.SearchBackToolTip,
      backButtonAria: lang.SearchBackAria,
      addAvailableColumns: lang.addAvailableColumns,
      addColumnsAria: lang.addColumnsAria
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.columns-list',
        suppressScrollX: true,
        // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    regions: {
      columnsList: '.columns-list'
    },

    ui: {
      backArrow: '.arrow_back',
      addButton: ".add-button"
    },

    events: {
      'click @ui.backArrow': 'showSettingsView',
      'keydown @ui.backArrow': 'onKeydownBackArrow',
      'click @ui.addButton': 'showAvailableColumns',
      "keydown": "onKeyInView"
    },

    onKeydownBackArrow: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32 || keyCode === 37) {
        this.showSettingsView(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode,
        focusables = this.$el.find('.add-button'),
        focusIndex = 0;
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (focusables.length) {
        if (keyCode === 9) { // tab
          if (event.shiftKey) {
            if ($(document.activeElement).hasClass('arrow_back')) {
              focusables = this.$el.find('.circle_delete');
              focusIndex = this.selectedColumnsCollectionView.focusIndex = focusables.length - 1;
              $(focusables[focusIndex]).closest('.column-item').addClass('active');
              $(focusables[focusIndex]).trigger('focus');
            } else {
              this.$el.find('.arrow_back').trigger('focus');
            }
          } else {
            focusIndex = 0;
            if ($(document.activeElement).hasClass('arrow_back') && this.options
              .availableColumnsCollection.length) {
              $(focusables[focusIndex]).trigger('focus');
            } else {
              focusables = this.$el.find('.circle_delete');
              this.selectedColumnsCollectionView.focusIndex = 0;
              $(focusables[focusIndex]).closest('.column-item').addClass('active');
              $(focusables[focusIndex]).trigger('focus');
            }
          }
          event.preventDefault();
          event.stopPropagation();
        } else if (keyCode === 13 || keyCode === 32) {
          this.showAvailableColumns(event);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },

    showSettingsView: function (event) {
      this.options.settingsView.showSettings("settingsDropDownContainer", this.options.settingsView.settingsDropDownView);
    },

    showAvailableColumns: function () {
      var searchSettingsModel = this.options.settings && this.options.settings.get('display'),
        availableColumnsCollection, selectedColumnsCollection;
      if (searchSettingsModel && searchSettingsModel.display_regions) {
        availableColumnsCollection = searchSettingsModel.display_regions.available;
        selectedColumnsCollection = searchSettingsModel.display_regions.selected;
      }
      this.options.settingsView.showSettings("availableColumnsContainer",
        new AvailableColumnsView({
          selectedColumnView: this,
          settingsView: this.options.settingsView,
          tableCollection: this.options.tableCollection,
          collection: availableColumnsCollection,
          selectedColumnsCollection: selectedColumnsCollection,
          settings: this.options.settings
        }));
    },

    onRender: function () {
      if (!this.options.availableColumnsCollection.length) {
        this.ui.addButton.addClass('binf-hidden');
      }
      this.selectedColumnsCollectionView = new SelectedColumnsCollectionView(this.options);
      this.showChildView('columnsList', this.selectedColumnsCollectionView);
      this.listenTo(this.options.availableColumnsCollection, 'update', _.bind(function () {
        if (!this.options.availableColumnsCollection.length) {
          this.ui.addButton.addClass('binf-hidden');
        } else {
          this.ui.addButton.removeClass('binf-hidden');
        }
      }, this));
    }
  });
  return SelectedColumnsView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/summary.description/impl/summary.descriptions',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"column-header\">\r\n  <div class=\"icon arrow_back\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.backButtonTitle || (depth0 != null ? depth0.backButtonTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backButtonTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.backButtonAria || (depth0 != null ? depth0.backButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backButtonAria","hash":{}}) : helper)))
    + "\" role=\"button\"></div>\r\n  <div class=\"column-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</div>\r\n</div>\r\n<div class=\"columns-list binf-list-group\" role=\"radiogroup\"></div>";
}});
Handlebars.registerPartial('csui_controls_settings_summary.description_impl_summary.descriptions', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/summary.description/impl/summary.description',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "selected";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"column-item-container\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" role='radio' aria-checked="
    + this.escapeExpression(((helper = (helper = helpers.checked || (depth0 != null ? depth0.checked : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checked","hash":{}}) : helper)))
    + ">\r\n  <span class=\"icon icon-listview-checkmark "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\"></span>\r\n  <span class=\"column-label\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('csui_controls_settings_summary.description_impl_summary.description', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/settings/summary.description/summary.description.view',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'i18n!csui/controls/settings/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/settings/summary.description/impl/summary.descriptions',
  'hbs!csui/controls/settings/summary.description/impl/summary.description'
], function ($, _, Backbone, Marionette, lang, TabableRegionBehavior, template, itemTemplate) {
  'use strict';

  var SummaryDescriptionItemView = Marionette.View.extend({

    template: itemTemplate,

    className: 'column-item',
    templateContext: function () {
      return {
        name: this._nameResolver(),
        label: this.model.get('key'),
        checked: !!this.model.get('selected')
      };
    },

    ui: {
      itemContainer: '.column-item-container'
    },

    triggers: {
      'click @ui.itemContainer': 'click:itemContainer',
      'keydown @ui.itemContainer': {event: "keydown:itemContainer", stopPropagation:false, preventDefault: false}
    },

    constructor: function SummaryDescriptionItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.View.call(this, options);
      this.listenTo(this.model, 'change', this.render);
    },

    _nameResolver: function () {
      var key = this.model.get('key'), name;
      switch (key) {
        case 'SO': {
          name = lang.SummaryOnly;
          break;
        }
        case 'SP': {
          name = lang.SummaryPreferred;
          break;
        }
        case 'DO': {
          name = lang.DescriptionOnly;
          break;
        }
        case 'DP': {
          name = lang.DescriptionPreferred;
          break;
        }
        case 'SD': {
          name = lang.SummaryAndDescription;
          break;
        }
        default: {
          name = this.model.get('name');
        }
      }
      return name;
    }

  });

  var SummaryDescriptionCollectionView = Marionette.CollectionView.extend({

    childView: SummaryDescriptionItemView,

    childViewOptions: {
      //Todo: provide selected collection option here
    },

    constructor: function SummaryDescriptionCollectionView(options) {
      options || (options = {});
      this.options = options;
      this.focusIndex = 0;
      Marionette.CollectionView.call(this, options);
    },

    onChildviewClickItemContainer: function (childView) {
      this.selectSummary(childView);
    },

    selectSummary: function (childView) {
      this.collection.findWhere({selected: true}).unset('selected');
      childView.model.set('selected', true);
      this.options.settingsView.options.data.summary_description = 
          childView.model.get('key');
      this.options.selectedCollection = childView.model.get('key');
      this.options.settingsView.model.get(
          'display').summary_description.selected = childView.model.get('key');
      childView.$el.find(".column-item-container").trigger('focus');
    },

    onChildviewKeydownItemContainer: function (childView, event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('*[tabindex]');
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (keyCode === 13 || keyCode === 32) {
        //Enter or Space key show settings view
        this.selectSummary(childView);
      } else if (focusables.length) {
        if (keyCode === 38 || keyCode === 40) {
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
        if (event.keyCode === 9) {
          var backArrowElement = this.$el.parents(".csui-summary-description-list").find(
              '.arrow_back');
          backArrowElement.trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }

  });

  var SummaryDescriptionView = Marionette.View.extend({

    template: template,

    className: 'csui-summary-description-list',

    ui: {
      backArrow: '.arrow_back'
    },

    events: {
      'click @ui.backArrow': 'onClickBackArrow',
      'keydown @ui.backArrow': 'onKeyPressBackArrow',
      "keydown": "onKeyInView"
    },

    regions: {
      columnsList: '.columns-list'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    templateContext: function () {
      var self = this;
      //Todo: remove this line and handle it from item view by providing options
      _.each(this.options.availableCollection && this.options.availableCollection.models,
          function (model, index) {
            if (model.get('key') === self.options.selectedCollection) {
              model.set('selected', true);
              model.set('checked',true);
            }
          });
      return {
        label: lang.summaryDescriptionTitle,
        available: this.options.availableCollection && this.options.availableCollection.models,
        backButtonTitle: lang.SearchBackToolTip,
        backButtonAria: lang.SearchBackAria
      };
    },

    constructor: function SummaryDescriptionView(options) {
      options || (options = {});
      this.options = options;
      Marionette.View.call(this, options);
    },

    onClickBackArrow: function (event) {
      this.showSettingsView(event);
    },

    onKeyPressBackArrow: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32 || keyCode === 37) {
        this.showSettingsView(event);
        event.stopPropagation();
        event.preventDefault();
      }
    },

    showSettingsView: function (event) {
      this.options.settingsView.showSettings("settingsDropDownContainer",
          this.options.settingsView.settingsDropDownView);
    },

    onRender: function () {
      this.summaryDescriptionCollectionView = new SummaryDescriptionCollectionView(this.options);
      this.showChildView('columnsList', this.summaryDescriptionCollectionView);
    },

    onKeyInView: function (event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('.column-item-container'),
          focusIndex = 0;
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (focusables.length) {
        if (keyCode === 9 || keyCode === 16) { // tab
          if (event.shiftKey) {
            focusIndex = focusables.length - 1;
          } else {
            focusIndex = 0;
          }
          this.summaryDescriptionCollectionView.focusIndex = 0;
          $(focusables[focusIndex]).trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  });

  return SummaryDescriptionView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/impl/settings.dropdown',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a class=\"csui-settings-option\" href=\"javascript:void(0);\" tabindex=\"0\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\" role=\"menuitem\">\r\n  <span class=\"csui-settings-option-title\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</span>\r\n  <span class=\"icon icon-next-card\"></span>\r\n</a>\r\n";
}});
Handlebars.registerPartial('csui_controls_settings_impl_settings.dropdown', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/settings/impl/settings.dropdown.view',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'i18n!csui/controls/settings/impl/nls/lang',
  'csui/controls/settings/selected.columns/selected.columns.view',
  'csui/controls/settings/summary.description/summary.description.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/settings/impl/settings.dropdown'
], function ($, _, Backbone, Marionette, lang, SelectedColumnsView, SummaryDescriptionView,
    TabableRegionBehavior, template) {
  'use strict';

  var SettingsDropDownOptionView = Marionette.View.extend({
    tagName: 'li',
    template: template,
    className: 'binf-list-group-item',

    //Todo: Provide false property to stopPropagation to support ctrl +
    triggers: {
      'click a': {event: "show:settings"},
      'keydown a': {event: "show:settings:dropdown", preventDefault: false}
    },

    constructor: function SettingsDropDownOptionView(options) {
      options || (options = {});
      this.options = options;
      Marionette.View.call(this, options);
    },

    showColumnsSettings: function (event) {
      var display = this.model && this.model.get('display'),
          selectedColumnsCollection, availableColumnsCollection;
      if (display && display.display_regions) {
        selectedColumnsCollection = display.display_regions.selected;
        availableColumnsCollection = display.display_regions.available;
      }
      selectedColumnsCollection && selectedColumnsCollection.where({
        isNew: true
      }).map(function (model) {
        model.set({
          isNew: false
        }, {
          silent: true
        });
      });
      this.options.showSettings('selectedColumnsContainer', new SelectedColumnsView({
        settingsDropDownView: this,
        tableCollection: this.options.tableCollection,
        collection: selectedColumnsCollection,
        availableColumnsCollection: availableColumnsCollection,
        settings: this.model
      }));
    },

    showSummaryOrDescription: function (event) {
      // TODO: use this.model
      var display = this.model && this.model.get('display'),
          availableCollection, selectedCollection;
      if (display.summary_description && display.summary_description.available) {
        availableCollection = display.summary_description.available;
        selectedCollection = display.summary_description.selected;
      }
      this.options.originatingView.showSettings('summaryOrDescriptionContainer',
          new SummaryDescriptionView({
            settingsDropDownView: this,
            selectedCollection: selectedCollection,
            availableCollection: availableCollection,
            collection: availableCollection,
            settings: this.model
          }));
    }

  });

  var SettingsDropDownView = Marionette.CollectionView.extend({
    constructor: function SettingsDropDownView() {
      this.focusIndex = 0;
      Marionette.CollectionView.apply(this, arguments);
    },

    className: 'binf-list-group',

    tagName: 'ul',

    childView: SettingsDropDownOptionView,

    childViewEvents: {
      'show:settings:dropdown': 'onShowSettingsDropdown',
      'show:settings': 'onShowSettings'
    },

    childViewOptions: function () {
      return {
        settingsView: this.options.settingsView
      };
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    onShowSettings: function (view, event) {
      this.options.settingsView.showSettings(view.model.get('id'), view.model.get(
          'view'));
    },

    onShowSettingsDropdown: function (view, event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('a[tabindex]');
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (keyCode === 13 || keyCode === 32 || keyCode === 39) {
        this.onShowSettings(view, event);
      } else if (focusables.length) {
        if (keyCode === 38 || keyCode === 40) {
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  });
  return SettingsDropDownView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/controls/settings/impl/settings',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "<div class=\"selected-columns-container\"></div>\r\n<div class=\"available-columns-container\"></div>\r\n<div class=\"summary-description-container\"></div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "<div id=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"settings-dropdown-container csui-settings-show\" tabindex=\"0\"></div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showDefaults : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.regions : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_settings_impl_settings', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/settings/impl/settings',[],function(){});
csui.define('csui/controls/settings/settings.view',['require', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3', 'i18n',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/settings/impl/settings.dropdown.view',
  'csui/controls/settings/selected.columns/selected.columns.view',
  'csui/controls/settings/summary.description/summary.description.view',
  'i18n!csui/controls/settings/impl/nls/lang',
  'hbs!csui/controls/settings/impl/settings',
  'css!csui/controls/settings/impl/settings'
], function (require, $, _, Backbone, Marionette, i18n, TabableRegionBehavior, SettingsDropDownView,
    SelectedColumnsView, SummaryDescriptionView, lang, template) {
  'use strict';

  var SettingsView = Marionette.View.extend({

    constructor: function SettingsView(options) {
      options || (options = {});
      _.defaults(options, {
        showDefaults: true
      });
      this.plugins = _.each(options.options, function (setting, key) {
        setting.region = "#" + setting.id;
      });

      Marionette.View.call(this, options);
    },

    className: 'csui-settings-container',

    template: template,

    templateContext: function () {
      var context = {
        showDefaults: this.options.showDefaults,
        regions: _.map(this.plugins, function (region) {
          return region.region.substring(1);
        })
      };
      return context;
    },

    regions: function () {
      var regions = {
        'settingsDropDownContainer': this.options.settingsDropDownContainer ||
                                     '.settings-dropdown-container'
      };
      if (this.options.showDefaults) {
        _.extend(regions, {
          'selectedColumnsContainer': '.selected-columns-container',
          'availableColumnsContainer': '.available-columns-container',
          'summaryOrDescriptionContainer': '.summary-description-container'
        });
      }

      _.each(this.plugins, function (plugin) {
        regions[plugin.id] = plugin.region;
      });

      return regions;
    },

    ui: function () {
      var ui = {
        settingsDropDownContainer: '.settings-dropdown-container'
      };
      if (this.options.showDefaults) {
        _.extend(ui, {
          selectedColumnsContainer: '.selected-columns-container',
          availableColumnsContainer: '.available-columns-container',
          summaryOrDescriptionContainer: '.summary-description-container'
        });
      }
      _.each(this.plugins, function (plugin) {
        ui[plugin.id] = plugin.region;
      });
      return ui;
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    onRender: function () {
      var optionsCollection = new Backbone.Collection(this.options.options);
      if (this.options.showDefaults) {

        var display = this.model && this.model.get('display'),
            selectedColumnsCollection, availableColumnsCollection;
        //Keeping the current state of model for ESC press
        this.prevModel = JSON.parse(JSON.stringify(display));
        if (display && display.display_regions) {
          selectedColumnsCollection = display.display_regions.selected;
          availableColumnsCollection = display.display_regions.available;
        }

        var availableCollection, selectedCollection;
        if (display && display.summary_description && display.summary_description.available) {
          availableCollection = display.summary_description.available;
          selectedCollection = display.summary_description.selected;
        }

        selectedColumnsCollection && selectedColumnsCollection.where({
          isNew: true
        }).map(function (model) {
          model.set({
            isNew: false
          }, {
            silent: true
          });
        });

        optionsCollection.add([{
          id: 'selectedColumnsContainer',
          label: lang.columnSettingsTitle,
          view: new SelectedColumnsView({
            settingsView: this,
            isTabularView: this.options.isTabularView,
            tableCollection: this.options.tableCollection,
            collection: selectedColumnsCollection,
            availableColumnsCollection: availableColumnsCollection,
            settings: this.model
          })
        }, {
          id: 'summaryOrDescriptionContainer',
          label: lang.summaryDescriptionTitle,
          view: new SummaryDescriptionView({
            settingsView: this,
            selectedCollection: selectedCollection,
            availableCollection: availableCollection,
            collection: availableCollection,
            settings: this.model
          })
        }], {
          at: 0
        });
      }
      this.settingsDropDownView = new SettingsDropDownView({
        settingsView: this,
        model: this.model,
        tableCollection: this.options.tableCollection,
        collection: optionsCollection,
        showSettings: this.showSettings.bind(this)
      });
      this.showChildView("settingsDropDownContainer", this.settingsDropDownView);
      this.currentCard = this.ui.settingsDropDownContainer;
    },

    onShow: function () {
      var self = this;
      this.$el.css('height', this.currentCard.outerHeight());
      setTimeout(function () {
        if (self.settingsDropDownView.$el.find(".binf-list-group-item a").length > 0) {
          $(self.settingsDropDownView.$el.find(".binf-list-group-item a")[0]).trigger('focus');
        }
      }, 0);
    },

    showSettings: function (regionName, childView) {
      if (!this.isCardChanging) {
        this.isCardChanging = true;
        this.showChildView(regionName, childView);
        this.animate(this.currentCard, this.ui[regionName]);
        this.currentCard = this.ui[regionName];
      }      
    },

    animate: function (current, next) {
      this.$el && this.$el.css('height', next.outerHeight());
      var self = this;
      if (next.index() > current.index()) {
        next.one('animationend', function () {
          delete self.isCardChanging;
          next.addClass('csui-settings-show').removeClass('animate-show');
          next.find("[tabindex]:first").trigger('focus');
        });
        next.addClass('animate-show');
      } else {
        current.one('animationend', function () {
          delete self.isCardChanging;
          current.removeClass('csui-settings-show animate-hide');
          next.find("[tabindex]:first").trigger('focus');
        });
        current.addClass('animate-hide');
      }
    },
  });
  return SettingsView;
});

csui.define('csui/widgets/search.results/controls/sorting/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/controls/sorting/impl/nls/root/localized.strings',{
  sortBy: 'Sort by...',
  sortByThis: 'Sort by {0}',
  sortOptionsAria: 'Sort options',
  ascending: '{0}: Click to sort ascending',
  descending: '{0}: Click to sort descending'
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/controls/sorting/impl/sort.menu',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"csui-search-sort-options \">\r\n    <button id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" type=\"button\" class=\"binf-btn binf-btn-default binf-dropdown-toggle\"\r\n            data-binf-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.sortButtonAria || (depth0 != null ? depth0.sortButtonAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sortButtonAria","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"cs-label\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n      <span class=\"cs-icon icon-caret-down\"></span>\r\n    </button>\r\n    <ul class=\"binf-dropdown-menu\" role=\"menu\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.listAria || (depth0 != null ? depth0.listAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"listAria","hash":{}}) : helper)))
    + "\"></ul>\r\n  </div>\r\n  <a href=\"javascript:void(0);\" class=\"cs-icon search-sort-btn icon-sortArrowDown\"></a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.sortEnable : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_search.results_controls_sorting_impl_sort.menu', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/controls/sorting/sort.menu.view',['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'i18n!csui/widgets/search.results/controls/sorting/impl/nls/localized.strings',
  'hbs!csui/widgets/search.results/controls/sorting/impl/sort.menu',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/lib/binf/js/binf'
], function (module, require, $, _, Backbone, Marionette, log, lang, template,
    PerfectScrollingBehavior, TabableRegionBehavior) {

  var SearchSortingView = Marionette.ItemView.extend({

    className: 'cs-sort-links',
    template: template,
    templateHelpers: function () {
      var messages = {
        sortBy: lang.sortBy
      };
      var selectedTitle = this.selected.get('title') ? this.selected.get('title') :
                          this.constants.DEFAULT_SORT;
      return {
        messages: messages,
        sortEnable: this.collection.models.length && !!this.collection.sorting &&
                    this.options.enableSorting,
        id: _.uniqueId('sortButton'),
        sortButtonAria: lang.sortOptionsAria,
        listAria: lang.sortOptionsAria
      };
    },

    constants: {
      SORT_ASC: "asc",
      SORT_DESC: "desc",
      DEFAULT_SORT: "relevance"
    },

    events: {
      'click .binf-dropdown-menu > li > a': 'onSortOptionClick',
      'click a.search-sort-btn': 'onSortOrderClick',
      "keydown": "onKeyInView"
    },

    ui: {
      toggle: '>.csui-search-sort-options>.binf-dropdown-toggle',
      selectedLabel: '>.csui-search-sort-options>.binf-dropdown-toggle >.cs-label',
      selectedIcon: '>.csui-search-sort-options>.binf-dropdown-toggle >.cs-icon',
      sortOrderBtn: 'a.search-sort-btn'
    },

    constructor: function SearchSortingView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);

      this.config = this.options.config || {};

      this.selected = new Backbone.Model();
      if (this.collection) {
        var orderBy = this.options.orderBy || this.collection.orderBy;
        this.collection.setOrder(orderBy, false);
        this.listenTo(this.collection, 'reset', this.render); // render after reset of collection
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.selected, 'change', this._updateSelection);
    },

    onRender: function () {
      this.ui.toggle.binf_dropdown();
      this.ui.sortOrderBtn.hide();
      if (this.collection.sorting !== undefined
          && this.collection.sorting.links !== undefined) {
        if (this.collection.sorting.sort &&
            this.collection.sorting.sort[0] !== this.constants.DEFAULT_SORT) {
          this._setSelection(this.collection.sorting.links[this.collection.sorting.sort]);
          this._addDropdownItems($.extend({}, this.collection.sorting.links),
              this.collection.sorting.sort[0]);
          this.ui.sortOrderBtn.show();
        } else {
          this._setSelection(this.collection.sorting.links[this.constants.DEFAULT_SORT]);
          this._addDropdownItems($.extend({}, this.collection.sorting.links), "");
          this.$el.find(".binf-dropdown-menu > :first-child").addClass("binf-active");
          this.$el.find(".binf-dropdown-menu > :first-child a.csui-sort-option").attr("aria-checked", "true");
          this.$el.find(".binf-dropdown-menu > :first-child .cs-icon").addClass(
              "icon-listview-checkmark");
          this.ui.sortOrderBtn.hide();
        }
        this.ui.selectedLabel.text(this.selected.get('title'));
        if (this.selected.get("order") === this.constants.SORT_ASC) {
          this.ui.sortOrderBtn.removeClass("icon-sortArrowDown");
          this.ui.sortOrderBtn.addClass("icon-sortArrowUp");
          var titleD = _.str.sformat(lang.descending, this.selected.get('title'));
          this.ui.sortOrderBtn.attr('title', titleD).attr('aria-label', titleD);
        } else {
          this.ui.sortOrderBtn.removeClass("icon-sortArrowUp");
          this.ui.sortOrderBtn.addClass("icon-sortArrowDown");
          var titleA = _.str.sformat(lang.ascending, this.selected.get('title'));
          this.ui.sortOrderBtn.attr('title', titleA).attr('aria-label', titleA);
        }
      }
    },
    onKeyInView: function (event) {
      // Watch for tab key
      if (event.keyCode === 9) {
        !!this.$el.find('.binf-open') && this.$el.find('.binf-open').removeClass('binf-open');
      }

    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.binf-dropdown-menu',
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        if (this.orderClicked) {
          return this.ui.sortOrderBtn;
        } else {
          return $(tabElements[0]);
        }
      }
    },

    _setSelection: function (model) {
      var sortObj = {};
      if (this.collection.sorting.sort) {
        if (this.collection.sorting.sort[0].indexOf(this.constants.SORT_DESC) === 0) {
          sortObj.id = this.collection.sorting.sort[0].replace(/desc_/g, '');
          sortObj.order = this.constants.SORT_DESC;
        }
        if (this.collection.sorting.sort[0].indexOf(this.constants.SORT_ASC) === 0) {
          sortObj.id = this.collection.sorting.sort[0].replace(/asc_/g, '');
          sortObj.order = this.constants.SORT_ASC;
        }
      } else {
        sortObj.id = "";
        sortObj.order = this.constants.SORT_DESC;
      }
      sortObj.title = _.str.trim((model && model.name) ? this.trimSortOptionName(model.name) :
                                 "empty");
      var titleVal = _.str.sformat(lang.sortByThis, sortObj.title);
      this.$el.find('.csui-search-sort-options 	.binf-dropdown-toggle').attr('title', titleVal);
      this.selected.set(sortObj);
    },

    _updateSelection: function () {
      this.ui.selectedLabel.text(this.selected.get('title'));
    },

    _refreshSelection: function (model) {
      if (!!(model.collection && model.collection.inMetadataNavigationView)) {
        model.collection.isSortOptionSelected = true;
      }
      if (model.get('id') === this.selected.get('id')) {
        this._setSelection(model);
      }
    },

    resetCollection: function (filter, autoFetch) {
      this.collection.setOrder(filter, true);
    },

    sortPage: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var orderBy = [];
      var idVal = $(e.currentTarget).attr('data-csui-sortoption-id');
      if (idVal !== undefined) {
        orderBy.push(idVal + " " + this.constants.SORT_DESC);
      } else {
        orderBy.push("");
      }
      this.resetCollection(orderBy.join(), true);
    },

    _addDropdownItems: function (sorting, activeOption) {
      var jqUl = this.$el.find('.binf-dropdown-menu'),
        self = this;
      if (sorting[this.constants.DEFAULT_SORT]) {
        var name = self.trimSortOptionName(sorting[self.constants.DEFAULT_SORT].name);
        jqUl.append(
          '<li role="presentation"><a role="menuitemradio" aria-checked="false" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon"></span><span class="cs-label" title="' +
           name + '">' + name + '</span></a></li>');
        delete sorting[self.constants.DEFAULT_SORT];
      }

      for (var sort in sorting) {
        if (sort.search("asc_") === 0) {
          delete sorting[sort];
        } else {
          var id2Use = sort.replace(/desc_/g, '');
          var nam = self.trimSortOptionName(sorting[sort].name);
          if (activeOption.split(/_(.+)/, 2)[1] === sort.split(/_(.+)/, 2)[1]) {
            jqUl.append('<li role="presentation" class="binf-active"><a role="menuitemradio" aria-checked="true" data-csui-sortoption-id="' +
              id2Use +
              '" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon icon-listview-checkmark"></span><span class="cs-label" title="' +
              nam + '">' + nam + '</span></a></li>');
          } else {
            jqUl.append('<li role="presentation"><a role="menuitemradio" aria-checked="false" data-csui-sortoption-id="' +
              id2Use +
              '" href="#" class="csui-sort-option" data-binf-toggle="tab"><span class="cs-icon"></span><span class="cs-label" title="' +
              nam + '">' + nam + '</span></a></li>');
          }
        }
      }
    },

    activate: function (element) {
      if (this.$el.find("li").hasClass("binf-active") === true) {
        this.$el.find("li").removeClass("binf-active");
        this.$el.find("li a.csui-sort-option").attr('aria-checked', 'false');
        this.$el.find("li .cs-icon").removeClass("icon-listview-checkmark");
      }
      $(element.parentElement).addClass("binf-active");
      $(element).find("a.csui-sort-option").attr('aria-checked', 'true');
      $(element).find("span.cs-icon").addClass("icon-listview-checkmark");
    },

    resetSelection: function (id, name) {
      var sortObj = {};
      sortObj.id = id;
      sortObj.title = _.str.trim(name);
      sortObj.order = this.constants.SORT_DESC;
      this.selected.set(sortObj);
    },

    onSortOptionClick: function (event) {
      this.collection.isSortOptionSelected = true;
      event.preventDefault();
      event.stopPropagation();
      if (event.currentTarget.children[1].innerHTML.toLowerCase() === this.constants.DEFAULT_SORT) {
        this.ui.sortOrderBtn.hide();
      }
      this.orderClicked = false;
      this.activate(event.currentTarget);
      var id2Use = $(event.currentTarget).attr('data-csui-sortoption-id');
      if (id2Use === undefined) {
        id2Use = "";
      }
      this.resetSelection(id2Use, event.currentTarget.children[1].innerHTML);
      this.sortPage(event);
      this.ui.toggle.binf_dropdown('toggle');
      this.trigger("change:sortOrder");
    },

    onSortOrderClick: function (event) {
      this.collection.isSortOptionSelected = true;
      event.preventDefault();
      event.stopPropagation();
      this.orderClicked = true;
      var orderBy = [];
      if (this.ui.sortOrderBtn.hasClass("icon-sortArrowDown")) {
        this.ui.sortOrderBtn.removeClass("icon-sortArrowDown");
        this.ui.sortOrderBtn.addClass("icon-sortArrowUp");
        orderBy.push(this.selected.id + " " + this.constants.SORT_ASC);
      } else {
        this.ui.sortOrderBtn.removeClass("icon-sortArrowUp");
        this.ui.sortOrderBtn.addClass("icon-sortArrowDown");
        orderBy.push(this.selected.id + " " + this.constants.SORT_DESC);
      }
      this.collection.setOrder(orderBy.join(), true);
    },

    trimSortOptionName: function (name) {
      return name.replace(/\(([;\s\w\"\=\,\:\.\/\~\{\}\?\!\-\%\&\#\$\^\(\)]*?)\)/g, "");
    }

  });

  return SearchSortingView;
});

csui.define('csui/widgets/search.results/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/impl/nls/root/lang',{
  loadingSearchResultMessage: "Loading search results...",
  noSearchResultMessage: "No results found.",
  searchQueryKeyboardShortcut:  "Press Ctrl+F3 to go to the Search Query box",
  suggestionKeyword: "Suggestions:",
  searchSuggestion1: "Make sure all words are spelled correctly.",
  searchSuggestion2: "Try different keywords.",
  searchSuggestion3: "Try more general keywords.",
  searchSuggestion4: "Try broadening or removing the location restriction.",
  failedSearchResultMessage: "Loading search results failed.",
  owner: "Owner",
  created: "Created",
  createdBy: "Created by",
  modified: "Modified",
  size: "Size",
  type: "Type",
  items: "Items",
  searchResults: "Search Results",
  searchSettings: "Search Settings",
  clearAll: "Clear all",
  about: "About",
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  relevance: "Relevance",
  name: "Name",
  creationDate: "CreationDate",
  showMore: "Show more",
  showMoreAria: "Show more metadata",
  showLess: "Show less",
  showLessAria: "Show less metadata",
  selectAll: "Select all results on current page.",
  selectAllAria: 'Select all results on current page',
  selectItem: 'Select {0}',
  selectItemAria: 'Select {0}. When selected an action bar of options can be reached per shift-tab',
  searchBackTooltip: 'Go back',
  searchBackTooltipTo: 'Go back to \'{0}\'',
  searchBackToHome: 'Home',
  versionLabel: 'v',
  versionSeparator: '.',
  filterExpandTooltip: 'Show filters',
  filterCollapseTooltip: 'Hide filters',
  filterExpandAria: 'Show filter panel',
  filterCollapseAria: 'Hide filter panel',
  customSearchTab: 'Search',
  searchFilterTab: 'Refine by',
  mimeTypeAria: 'type {0}',
  itemBreadcrumbAria: 'Breadcrumb {0}',
  formatForNone: "{0} items",
  formatForOne: "{0} item",
  formatForTwo: "{0} items",
  formatForFive: "{0} items",
  promotedLabel: "Promoted",
  dialogTitle: "Filters",
  dialogTemplate: "Applying filters would clear your current selection." + "\n" +
                  "Do you want to proceed?",
  standardSearchView: "Standard search view",
  tabularSearchView: "Tabular search view",
  showDescription: "Show description",
  hideDescription: "Hide description",
  descriptionColumnTitle: "Description",
  summaryColumnTitle: "Summary"
});



/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.results.header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <span class=\"csui-search-facet-filter-parent\">\r\n      <span class=\"csui-search-filter icon icon-toolbarFilter\" role=\"button\"\r\n            aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.filterAria : stack1), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchFilterTooltip : stack1), depth0))
    + "\"\r\n            tabindex=\"0\"></span>\r\n    </span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <div class=\"csui-search-header-action csui-search-settings\"\r\n           title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.settingsLabel : stack1), depth0))
    + "\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.settingsLabel : stack1), depth0))
    + "\" tabindex=\"0\" role=\"menu\" aria-haspopup=\"true\"\r\n           aria-expanded=\"false\">\r\n        <svg class=\"csui-svg-icon csui-svg-icon-normal\" focusable=\"false\">\r\n          <use xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_settings32\"></use>\r\n        </svg>\r\n        <svg class=\"csui-svg-icon csui-svg-icon-hover\" focusable=\"false\">\r\n          <use\r\n              xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_settings32.hover\"></use>\r\n        </svg>\r\n        <svg class=\"csui-svg-icon csui-svg-icon-active\" focusable=\"false\">\r\n          <use\r\n              xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_settings32.active\"></use>\r\n        </svg>\r\n        <div class=\"csui-settings-dropdown\"></div>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-search-header\">\r\n   <span class=\"csui-search-arrow-back-parent\">\r\n   <span class=\"icon arrow_back cs-go-back\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBackTooltip : stack1), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchBackTooltip : stack1), depth0))
    + "\" tabindex=\"0\" role=\"button\"></span>\r\n   </span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.enableSearchFilter : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <div class=\"csui-search-header-title\"></div>\r\n  <div class=\"csui-search-right-header-container\">\r\n    <div class=\"csui-search-header-action csui-search-sorting\" id=\"csui-search-sorting\"></div>\r\n    <span class=\"csui-search-header-action icon icon-description-toggle binf-hidden\"\r\n          aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.descriptionTitle : stack1), depth0))
    + "\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.descriptionTitle : stack1), depth0))
    + "\"\r\n          role=\"button\" tabindex=\"0\"></span>\r\n    <div class=\"csui-search-header-action csui-tabular-view\"\r\n         aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.tabularViewIconTitle : stack1), depth0))
    + "\"\r\n         role=\"button\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.tabularViewIconTitle : stack1), depth0))
    + "\" tabindex=\"0\">\r\n      <svg class=\"csui-svg-icon csui-svg-icon-normal csui-icon-off\" focusable=\"false\">\r\n        <use\r\n            xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_table_tabular32\"></use>\r\n      </svg>\r\n      <svg class=\"csui-svg-icon csui-svg-icon-hover csui-icon-off\" focusable=\"false\">\r\n        <use\r\n            xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_table_tabular32.hover\"></use>\r\n      </svg>\r\n      <svg class=\"csui-svg-icon csui-svg-icon-active csui-icon-off\" focusable=\"false\">\r\n        <use\r\n            xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_table_tabular32.active\"></use>\r\n      </svg>\r\n      <svg class=\"csui-svg-icon csui-svg-icon-normal csui-icon-on\" focusable=\"false\">\r\n        <use\r\n            xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_table_standard32\"></use>\r\n      </svg>\r\n      <svg class=\"csui-svg-icon csui-svg-icon-hover csui-icon-on\" focusable=\"false\">\r\n        <use\r\n            xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_table_standard32.hover\"></use>\r\n      </svg>\r\n      <svg class=\"csui-svg-icon csui-svg-icon-active csui-icon-on\" focusable=\"false\">\r\n        <use\r\n            xlink:href=\""
    + this.escapeExpression(((helper = (helper = helpers.spritePath || (depth0 != null ? depth0.spritePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"spritePath","hash":{}}) : helper)))
    + "#themes--carbonfiber--image--generated_icons--action_table_standard32.active\"></use>\r\n      </svg>\r\n    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.showSettings : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n</div>\r\n<div class=\"csui-table-rowselection-toolbar\"></div>";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.results.header', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.results.header.title',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-search-header-title-container csui-fadeout\">\r\n  <h2 id=\"resultsTitle\" class=\"csui-results-title\"></h2>\r\n  <div id=\"customSearchTitle\" class=\"csui-custom-search-title\"></div>\r\n</div>\r\n<span id=\"headerCount\" class=\"headerCount\"></span>\r\n<span id=\"searchHeaderCountLive\" role=\"status\" class=\"binf-sr-only\" aria-live=\"polite\"></span>";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.results.header.title', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/nls/root/lang',{
  aboutNHits: "About {0} hits",
  ToolbarItemReserve: "Reserve",
  ToolbarItemUnreserve: "Unreserve"
});



csui.define('css!csui/widgets/search.results/impl/search.results',[],function(){});
csui.define('csui/widgets/search.results/impl/search.results.header.title.view',[
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/impl/search.results.header.title',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, Marionette, template, publicLang, lang) {
  'use strict';

  var TitleView = Marionette.ItemView.extend({

    template: template,

    constructor: function TitleView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      resultTitle: '#resultsTitle',
      customSearchTitle: '#customSearchTitle',
      headerCount: '#headerCount',
      searchHeaderCountLive: '#searchHeaderCountLive'
    },

    _assignTotalItemElem: function () {
      this.count = this.options.count || 0;
      var countTxt     = _.str.sformat(publicLang.aboutNHits, this.count),
          countTxtAria = "";
      if (this.count !== 0) {
        countTxtAria = countTxt;
      } else {
        countTxtAria = lang.noSearchResultMessage;
      }
      this.ui.headerCount.empty();
      this.ui.headerCount.append(countTxt);

      // with aria-live for the screen reader
      this.countTextAria = lang.searchResults + ": " + countTxtAria + ". " +
                           lang.searchQueryKeyboardShortcut;
      this.ui.searchHeaderCountLive.text(this.countTextAria);

      return true;
    },

    _updateSearchResultsTitle: function () {
      var searchHeaderTitle, tooltipText;
      if (!!this.options.useCustomTitle && !!this.title) {
        this.ui.customSearchTitle.text(this.title);
        tooltipText = lang.searchResults + ': ' + this.title;
        searchHeaderTitle = lang.searchResults + ': ';
      } else {
        searchHeaderTitle = this.options.searchHeaderTitle || lang.searchResults;
        tooltipText = searchHeaderTitle;
      }
      this.ui.resultTitle.text(searchHeaderTitle);
      this.ui.resultTitle.parent().attr("title", tooltipText);
    },

    setCustomSearchTitle: function (title) {
      this.title = '"' + title + '"';
      this.ui.customSearchTitle.text(title);
      var resultsTitle = lang.searchResults + ': ';
      this.ui.resultTitle.text(resultsTitle);
      this.ui.resultTitle.parent().attr("title", resultsTitle + this.title);
    },

    onRender: function () {
      this._assignTotalItemElem();
      this._updateSearchResultsTitle();
    }

  });

  return TitleView;
});

csui.define('csui/widgets/search.results/impl/search.results.header.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/url', 'csui/utils/base',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/namedsessionstorage',
  'csui/models/nodes',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/accessibility',
  'csui/pages/start/perspective.routing',
  'csui/controls/settings/settings.view',
  'csui/controls/globalmessage/globalmessage',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/search.results/controls/sorting/sort.menu.view',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/search.results.header',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/widgets/search.results/impl/search.results.header.title.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Backbone, Marionette, Url, base, PreviousNodeModelFactory, NextNodeModelFactory,
    NamedSessionStorage, NodeCollection, UserModelFactory, SearchQueryModelFactory, Accessibility,
    PerspectiveRouting, SettingsView, GlobalMessage, TabableRegionBehavior, SortingView, lang,
    headerTemplate, ApplicationScopeModelFactory, TitleView, ViewEventsPropagationMixin, sprite) {
  "use strict";
  var accessibleTable = Accessibility.isAccessibleTable(),
      searchSortingRegion;
  var SearchHeaderView = Marionette.LayoutView.extend({
    className: "csui-search-results-header",
    template: headerTemplate,
    templateHelpers: function () {
      var messages = {
        searchResults: lang.searchResults,
        clearAll: lang.clearAll,
        about: lang.about,
        searchBackTooltip: lang.searchBackTooltip,
        searchFilterTooltip: lang.filterExpandTooltip,
        filterAria: lang.filterExpandAria,
        enableSearchFilter: this.options.enableFacetFilter,
        tabularViewIconTitle: lang.tabularSearchView,
        descriptionTitle: lang.showDescription,
        showSettings: !!this.options.enableSearchSettings,
        settingsLabel: lang.searchSettings,
        tabularSearchView: this.collection.prevSearchDisplayStyle === "TabularView"
      };
      return {
        spritePath: sprite.getSpritePath(),
        messages: messages
      };
    },

    ui: {
      back: '.cs-go-back',
      parent: '.csui-search-arrow-back-parent',
      filter: '.csui-search-filter',
      filterParent: '.csui-search-facet-filter-parent',
      resultTitle: '.csui-results-title',
      searchHeaderTitle: '.csui-search-header-title',
      settingsMenu: '.csui-search-settings',
      toggleResultsView: '.csui-tabular-view',
      toggleDescription: '.icon-description-toggle'
    },

    events: {
      'click @ui.back': 'onClickBack',
      'click @ui.parent': 'onClickBack',
      'keypress @ui.back': 'onClickBack',
      'click @ui.filter': 'onClickFilter',
      'keypress @ui.filter': 'onClickFilter',
      'click @ui.filterParent': 'onClickFilter',
      'click @ui.settingsMenu': '_createSettingsDropdown',
      'keydown @ui.settingsMenu': 'showSettingsDropdown',
      'click @ui.toggleResultsView': 'toggleView',
      'keypress @ui.toggleResultsView': 'toggleView',
      'click @ui.toggleDescription': 'onToggleDescriptionClick',
      'keypress @ui.toggleDescription': 'onToggleDescriptionClick'
    },

    regions: {
      settingsRegion: '.csui-settings-dropdown'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]).hasClass('csui-acc-focusable-active') ? this.ui.filter :
               $(tabElements[0]);
      }
    },
    namedSessionStorage: new NamedSessionStorage(),
    constructor: function SearchHeaderView(options) {
      options || (options = {});
      this.localStorage = options && options.localStorage;
      Marionette.LayoutView.prototype.constructor.call(this, options); // apply (modified)
      // options to this
      if (this.collection) {
        this.listenTo(this.collection, 'reset',
            this.updateHeader) // render after reset of collection
            .listenTo(this.collection, 'remove', this._collectionItemRemoved);
      }
      // Use a local clone to remember the node, which may have been visited
      // before the page with this widget got open; the original previousNode
      // gets reset with every perspective change
      this.previousNode = options.context.getModel(PreviousNodeModelFactory).clone();
      this.nextNode = options.context.getModel(NextNodeModelFactory);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.context = options.context;
      if (this.applicationScope.previous('id') === "" || this._isPreviousRouter("Landing")) {
        /* Previous page is Home Page */
        if (this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId")) {
          /* Clear previous node info from sessionStorage as previous page is home page */
          this.namedSessionStorage.remove("previousNodeName");
          this.namedSessionStorage.remove("previousNodeId");
        }
      }

      //retreive user preferred search display style from local storage
      if (this.localStorage.storage.getItem('PrevSearchDisplayStyle')) {
        this.showDescription = this.localStorage.get(
            this._createSearchDisplayStyleKey() + '_showDescription');
      }
    },

    initialize: function () {
      this.titleView = this.options.titleView || new TitleView({});
    },

    updateHeader: function () {
      this.renderTitleView();
      if (this.collection && this.collection.length) {
        this.ui.back.addClass('search_results_data');
        this.ui.filter.addClass('search_results_data');
        this.ui.toggleResultsView.removeClass("binf-hidden");
      } else {
        this.ui.back.addClass('search_results_nodata');
        this.ui.filter.addClass('search_results_nodata');
        this.ui.toggleResultsView.addClass("binf-hidden");
      }
      this.updateToggleIcon();
      this.updateToggleDescriptionIcon();
      this.updateToggleDescription();
      if (this.collection.prevSearchDisplayStyle === "TabularView") {
        this._createSortRegion();
        this._createSortingView();
      }
    },

    updateToggleDescriptionIcon: function () {
      if (this.collection.prevSearchDisplayStyle === "TabularView") {
        this.$el.find('.icon-description-toggle').removeClass(
            'search-settings-none');
        this.$el.find('.icon-description-toggle').removeClass(
            'binf-hidden');
        if (this.showDescription) {
          this.$el.find('.icon-description-toggle').attr("title",
              lang.hideDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label",
              lang.hideDescription);
        } else {
          this.$el.find('.icon-description-toggle').attr("title",
              lang.showDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label",
              lang.showDescription);
        }
      } else {
        this.$el.find('.icon-description-toggle').addClass(
            'binf-hidden');
        this.$el.find('.icon-description-toggle').removeClass(
            'icon-description-shown');
      }
    },

    updateToggleDescription: function () {
      if (this.options.originatingView &&
          this.options.originatingView.collection.prevSearchDisplayStyle === "TabularView") {
        if (accessibleTable && this.options.originatingView.targetView) {
          this.options.originatingView.getAdditionalColumns();
        } else {
          var descriptiveItems = this.options.originatingView.collection.filter(
              function (model) { return model.get('description') }),
              summaryItems = this.options.originatingView.collection.filter(
                  function (model) { return model.get('summary') }),
              showDescriptionFlag = this.localStorage.get(
                  this._createSearchDisplayStyleKey() + '_showDescription');
          this.selectedSettings = (this.selectedSettings) ? this.selectedSettings :
                                  this.collection.selectedSettings;
          switch (this.selectedSettings) {
          case 'DO': {
            if (descriptiveItems.length) {
              this.$el.find('.icon-description-toggle').removeClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: showDescriptionFlag});
              if (showDescriptionFlag) {
                this.$el.find('.icon-description-toggle').removeClass(
                    'icon-description-hidden')
                    .addClass('icon-description-shown');
                this.$el.find('.csui-description-collapsed').removeClass(
                    'csui-description-collapsed');
              }
            } else if (!this.$el.find('.icon-description-toggle').hasClass('binf-hidden')) {
              this.$el.find('.icon-description-toggle').addClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: false});
              this.options.originatingView && this.options.originatingView.targetView &&
              this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                  'csui-description-collapsed');
            }
            break;
          }
          case 'SP':
          case 'DP':
          case 'SD': {
            if (descriptiveItems.length || summaryItems.length) {
              this.$el.find('.icon-description-toggle').removeClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: showDescriptionFlag});
              if (showDescriptionFlag) {
                this.$el.find('.icon-description-toggle').removeClass(
                    'icon-description-hidden')
                    .addClass('icon-description-shown');
                this.$el.find('.csui-description-collapsed').removeClass(
                    'csui-description-collapsed');
              }
            } else if (!this.$el.find('.icon-description-toggle').hasClass('binf-hidden')) {
              this.$el.find('.icon-description-toggle').addClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: false});
              this.options.originatingView && this.options.originatingView.targetView &&
              this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                  'csui-description-collapsed');
            }
            break;
          }
          case 'SO': {
            if (summaryItems.length) {
              this.$el.find('.icon-description-toggle').removeClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: showDescriptionFlag});
              if (showDescriptionFlag) {
                this.$el.find('.icon-description-toggle').removeClass(
                    'icon-description-hidden')
                    .addClass('icon-description-shown');
                this.$el.find('.csui-description-collapsed').removeClass(
                    'csui-description-collapsed');
              }
            } else if (!this.$el.find('.icon-description-toggle').hasClass('binf-hidden')) {
              this.$el.find('.icon-description-toggle').addClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: false});
              this.options.originatingView && this.options.originatingView.targetView &&
              this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                  'csui-description-collapsed');
            }
            break;
          }
          case 'NONE': {
            this.$el.find('.icon-description-toggle').addClass('search-settings-none');
            this.options.originatingView && this.options.originatingView.targetView &&
            this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                'csui-description-collapsed');
            this.trigger('toggle:description', {showDescriptions: false});
            break;
          }
          }
        }
      }
    },
    onRender: function () {
      this.renderTitleView();
      if (this.collection && this.collection.length) {
        this.ui.back.addClass('search_results_data');
        this.ui.filter.addClass('search_results_data');
        this.ui.toggleResultsView.removeClass("binf-hidden");
      } else {
        this.ui.back.addClass('search_results_nodata');
        this.ui.filter.addClass('search_results_nodata');
        this.ui.toggleResultsView.addClass("binf-hidden");
      }

      this.rendered = true;
      this.$el.show();

      // This checks the whole browser history, since the page has been loaded;
      // not just the history in the window, since the Smart UI has appeared there.
      // Making the page behave differently, when opened in the browser directly
      // and when navigating to it from some link is a bad practice.  UI breaks
      // the principle, that the URL shows a resource in the same way.  *If you
      // reload the page - it is just hitting F5 - the artificial state built
      // among the internal navigation gets lost anyway*.  It is better to leave
      // the browser history on the browser and its handling on the browser and
      // its buttons and not trying to "help the user" by duplicating the
      // functionality like this.
      if (this.options.enableBackButton) {
        this.ui.back.attr('title', this.options.backButtonToolTip);
        this.ui.back.attr('aria-label', this.options.backButtonToolTip);
      } else if (PerspectiveRouting.getInstance(this.options).hasRouted() || history.state ||
                 this._isViewStateModelEnabled() ||
                 this.previousNode.get('id') ||
                 (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId")) ||
                 this._isPreviousRouter("Metadata")) {
        // In integration scenario we cannot depend on history.state to show back button.
        //So providing a option to show backbutton based on option
        this._setBackButtonTitle();
      } else {
        this.ui.back.hide();
        this.ui.parent.hide();
      }
      if (!this.tableRowSelectionToolbarRegion) {

        this._createToolbarRegion();

        this.options.originatingView._updateToolbarActions();
      }
    },

    renderTitleView: function () {
      _.extend(this.titleView.options, {
        count: this.collection && this.collection.totalCount,
        useCustomTitle: !!this.options.useCustomTitle,
        searchHeaderTitle: this.collection && this.collection.searching ?
                           this.collection.searching.result_title : lang.searchResults
      });

      this.titleView.render();
      Marionette.triggerMethodOn(this.titleView, 'before:show', this.titleView, this);
      this.ui.searchHeaderTitle.append(this.titleView.el);
      Marionette.triggerMethodOn(this.titleView, 'show', this.titleView, this);
    },

    onBeforeDestroy: function () {
      this.titleView.destroy();
    },

    showSettingsDropdown: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32) {
        this._createSettingsDropdown(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    _createSettingsDropdown: function (event) {
      var eventTarget = event.target;
      if (!eventTarget.classList.contains('csui-search-settings')) {
        return; // event bubbled from dropdown to toolbar item => ignore it
      }
      if (!this.settingsView || (this.settingsView && this.settingsView.isDestroyed())) {
        $(document).on('mouseup.dropdown' + this.cid, _.bind(this._closeSettingsMenu, this));
        this.data = {};
        this.settingsView = new SettingsView({
          model: this.options.settings,
          tableCollection: this.collection,
          data: this.data,
          isTabularView: this.collection.prevSearchDisplayStyle === 'TabularView'
        });
        this.listenTo(this.settingsView, 'close:menu', _.bind(function (event) {
          this._destroySettingsDropdown(event);
        }, this));
        this.settingsRegion.show(this.settingsView);
        this.propagateEventsToViews(this.settingsView);
        this.settingsView.$el.find('.binf-show').trigger('focus');
        this.settingsView.isVisible = true;
        this.listenTo(this.settingsView, 'update:showSummaryDescriptions', function () {
          this.selectedSettings = this.settingsView.model.get(
              'display').summary_description.selected;
          if (this.collection.prevSearchDisplayStyle === "TabularView") {
            this.options.originatingView.targetView.selectedSettings = this.selectedSettings;
            this.options.originatingView.targetView.options.descriptionRowViewOptions
                .showSummaryOnly = this.selectedSettings === 'SO';
            this.render();
            this.updateHeader();
            this._createSortRegion();
            this._createSortingView();
            this._createToolbarRegion();
            this.options.originatingView._updateToolbarActions();
            if (this.options.originatingView.collection.selectedItems &&
                this.options.originatingView.collection.selectedItems.length > 0) {
              this.options.originatingView.collection.selectedItems.reset(
                  this.options.originatingView.targetView._allSelectedNodes.models);
              this.options.originatingView.targetView._tableRowSelectionToolbarView.trigger(
                  'toggle:condensed:header');
            }
          } else {
            this.options.originatingView.targetView.render();
            this.options.originatingView.targetView.trigger('render:metadata');
          }
        });
      } else {
        this._destroySettingsDropdown();
      }
    },

    _destroySettingsDropdown: function (event) {
      this.settingsView.destroy();
      $(document).off('mouseup.dropdown' + this.cid);
      if (!!this.data.summary_description || !!this.data.display_regions) {
        this.options.originatingView.blockActions();
        // setting the isSortOptionSelected only when there is a change in search settings
        this.collection.isSortOptionSelected = true;
        this.formData = new FormData();
        var self = this;
        _.mapObject(this.data, function (value, key) {
          if (key === 'display_regions') {
            self.formData.append(key, value);
          } else if (key === 'summary_description') {
            self.formData.append(key, value);
          }
        });
        this.settingsView.model.save(null, {
          parse: false,
          data: this.formData,
          processData: false,
          cache: false,
          contentType: false
        }).done(_.bind(function (response) {
          if (!!self.data.summary_description) {
            self.settingsView.model.get(
                'display').summary_description.selected = self.data.summary_description;
            self.settingsView.trigger('update:showSummaryDescriptions');
            self.options.originatingView.collection.settings_changed = false;
          }
          if (!!self.data.display_regions) {
            self.options.originatingView.unblockActions();
            self.options.originatingView.collection.settings_changed = true;
            self.settingsView.options.tableCollection.fetch();
          }
          if (!self.options.originatingView.collection.settings_changed) {
            self.options.originatingView.executeEndProcess();
            self.trigger('render:table');
          }
          this.$el.find(".csui-search-settings").trigger('focus');
        }, this)).fail(function (error) {
          //onfailure to save search settings
          error = new base.Error(error);
          GlobalMessage.showMessage('error', error.message);
          self.options.originatingView.unblockActions();
        });
        if (this.options.originatingView && this.options.originatingView.targetView &&
            this.options.originatingView.targetView.standardHeaderView) { 
          this.options.originatingView.targetView.standardHeaderView.expandAllView.pageChange();
          this.options.originatingView.targetView.standardHeaderView.expandAllView._isExpanded = false;
        }
      }
      if (this.settingsView.isChanged) {
        var regionModelCollection = this.settingsView.model.get(
            'display').display_regions.selected;
        _.each(this.options.originatingView.tableColumns.models, _.bind(function (model) {
          var key = model.get('key');
          if (key !== 'reserved' && key !== 'favorite') {
            var availableModel = regionModelCollection.findWhere({key: key});
            var newSequence = regionModelCollection.indexOf(availableModel);
            model.set('sequence', newSequence);
          }
        }, this));
        if (this.options.originatingView) {
          this.trigger('render:table');
          this.settingsView.isChanged = false;
        }
      }
    },

    _closeSettingsMenu: function (e) {
      if ((this.ui.settingsMenu.is && this.ui.settingsMenu.is(e && e.target)) ||
          (this.settingsView && this.settingsView.$el.has(e && e.target).length)) {
        e.stopPropagation();
      } else if (!(this.settingsView && this.settingsView.isDestroyed())) {
        this._destroySettingsDropdown(e);
        this.$el.find(".csui-search-settings").trigger('focus');
      }
    },

    onToggleDescriptionClick: function (e) {
      if ((e.type === 'keypress' && (e.keyCode === 13 || e.keyCode === 32)) ||
          (e.type === 'click')) {
        e.preventDefault();
        var originatingView = this.options.originatingView;
        if (!this.showDescription) {
          this.localStorage.set(this._createSearchDisplayStyleKey() + '_showDescription', true);
          originatingView.targetView.options.descriptionRowViewOptions.showDescriptions = true;
          this.$el.find('.icon-description-toggle').attr("title", lang.hideDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label", lang.hideDescription);
          originatingView.$el.find('.icon-description-toggle').removeClass(
              'icon-description-hidden')
              .addClass('icon-description-shown');
          originatingView.$el.find('.csui-description-collapsed').removeClass(
              'csui-description-collapsed');
          this.showDescription = true;
          this.trigger('toggle:description', {showDescriptions: true});
        } else {
          this.localStorage.set(this._createSearchDisplayStyleKey() + '_showDescription', false);
          originatingView.targetView.options.descriptionRowViewOptions.showDescriptions = false;
          originatingView.$el.find('.icon-description-toggle').addClass('icon-description-hidden')
              .removeClass('icon-description-shown');
          this.$el.find('.icon-description-toggle').attr("title", lang.showDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label", lang.showDescription);
          originatingView.$el.find('.cs-description').addClass('csui-description-collapsed');
          this.showDescription = false;
          this.trigger('toggle:description', {showDescriptions: false});
        }
        this.$el.find('.icon-description-toggle').trigger('focus');
      }
    },

    toggleView: function (e) {
      if ((e.type === 'keypress' && (e.keyCode === 13 || e.keyCode === 32)) ||
          (e.type === 'click')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (this.collection.prevSearchDisplayStyle === "TabularView") {
          if (this.$el.parent('#header').hasClass('csui-show-header')) {
            this.$el.parent('#header').removeClass('csui-show-header');
          }
          this.$el.find('.csui-table-rowselection-toolbar').addClass('binf-hidden');
          this._prevSearchDisplayStyleLocalStorage("StandardView");
          this.collection.prevSearchDisplayStyle = "StandardView";
          searchSortingRegion && searchSortingRegion.$el.empty();
        } else {
          this._prevSearchDisplayStyleLocalStorage("TabularView");
          this.collection.prevSearchDisplayStyle = "TabularView";
          this._createSortRegion();
          this.collection.isSortOptionSelected = true;
          this._createSortingView();
          this._createToolbarRegion();
        }
        this.updateToggleIcon();
        this.updateToggleDescriptionIcon();
        this.updateToggleDescription();
        this.trigger('reload:searchForm');
      }
    },

    updateToggleIcon: function () {
      if (this.collection.prevSearchDisplayStyle === "TabularView") {
        this.ui.toggleResultsView.attr("title", lang.standardSearchView);
        this.ui.toggleResultsView.attr("aria-label", lang.standardSearchView);
        this.ui.toggleResultsView.find('.csui-icon-off').addClass('binf-hidden');
        this.ui.toggleResultsView.find('.csui-icon-on').removeClass('binf-hidden');
      } else {
        this.ui.toggleResultsView.attr("title", lang.tabularSearchView);
        this.ui.toggleResultsView.attr("aria-label", lang.tabularSearchView);
        this.ui.toggleResultsView.find('.csui-icon-on').addClass('binf-hidden');
        this.ui.toggleResultsView.find('.csui-icon-off').removeClass('binf-hidden');
      }

    },

    _createSortRegion: function () {
      searchSortingRegion = new Marionette.Region({
        el: '#csui-search-sorting'
      });
    },

    _createSortingView: function () {
      var originatingView = this.options.originatingView,
          sortingView;

      if (originatingView) {
        if (!originatingView.sortingView) {
          sortingView = new SortingView({
            collection: this.options.collection,
            enableSorting: this.options.enableSorting !== undefined ? this.options.enableSorting :
                           true
          });
        } else {
          sortingView = originatingView.sortingView;
        }
        searchSortingRegion.show(sortingView);
      }
    },

    _createToolbarRegion: function () {
      var tableRowSelectionToolbarRegion = new Marionette.Region({
        el: '.csui-search-results-header .csui-table-rowselection-toolbar'
      });
      this.tableRowSelectionToolbarRegion = tableRowSelectionToolbarRegion;
    },

    _isPreviousRouter: function (name) {
      var viewStateModel = this.context.viewStateModel;
      return viewStateModel && viewStateModel.get(viewStateModel.CONSTANTS.LAST_ROUTER) === name;
    },

    _syncStorage: function (name, id) {
      this.namedSessionStorage.set("previousNodeName", name);
      this.namedSessionStorage.set("previousNodeId", id);
    },

    _prevSearchDisplayStyleLocalStorage: function (searchDisplayStyle) {
      this.localStorage.set(this._createSearchDisplayStyleKey(), searchDisplayStyle);
    },

    _setBackButtonTitle: function () {
      var name;
      if (this._isPreviousRouter("Metadata")) {
        var viewStateModel = this.context.viewStateModel;
        var info = viewStateModel.get(viewStateModel.CONSTANTS.METADATA_CONTAINER);
        name = info.name;
        this._syncStorage(name, info.id);
      } else if (this.searchQuery.attributes.location_id1 === undefined &&
                 !this.previousNode.get('id') &&
                 !(this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
        name = lang.searchBackToHome;
        this.namedSessionStorage = null;
      } else {
        if (this.previousNode.get('id')) {
          name = this.previousNode.get('name');
          this._syncStorage(name, this.previousNode.get('id'));
        } else {
          name = this.namedSessionStorage.get("previousNodeName");
        }
      }
      this.ui.back.attr('title', _.str.sformat(lang.searchBackTooltipTo, name));
      this.ui.back.attr('aria-label', _.str.sformat(lang.searchBackTooltipTo, name));
    },

    setCustomSearchTitle: function (title) {
      !!this.titleView.setCustomSearchTitle &&
      this.titleView.setCustomSearchTitle(title);
    },

    _collectionItemRemoved: function () {
      var originalCount = this.collection.totalCount;
      this.collection.totalCount = --this.collection.totalCount;
      if (this.collection.prevSearchDisplayStyle === "TabularView" && this.tableRowSelectionToolbarRegion) {
        delete this.tableRowSelectionToolbarRegion;
      }
      this.render();
      this.collection.totalCount = originalCount;
    },

    onClickBack: function (event) {
      if (this.backButtonClicked) {
        // protect against getting called twice when search invoked from my assignments and hitting
        // the back button in the search result.
        return;
      }
      this.backButtonClicked = true;
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        if (this.options.enableBackButton) {
          event.stopPropagation();
          //To notify the caller about back button navigation
          //as we don't have previousNode in integration scenario
          this.trigger("go:back");
        } else if (this._isViewStateModelEnabled()) {
          this.context.viewStateModel.restoreLastRouter();
        } else if (this.previousNode.get('id') ||
                   (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
          // Force reloading of the widget data.
          this.nextNode.set('id', undefined, {silent: true});
          this.nextNode.set('id', this.namedSessionStorage.get("previousNodeId"));
        } else {
          this.applicationScope.set('id', '');
        }
      }
    },

    _isViewStateModelEnabled: function () {
      return this.context && this.context.viewStateModel;
    },

    onClickFilter: function (event) {
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();
        this.trigger("toggle:filter", this.options.originatingView);
        this.trigger("focus:filter", this.options.originatingView);
      }
    },

    _createSearchDisplayStyleKey: function () {
      var context = this.context || (this.options && this.options.context),
          srcUrl = new Url().getAbsolute(),
          userID = context && context.getModel(UserModelFactory).get('id'), hostname;
      if (srcUrl) {
        hostname = srcUrl.split('//')[1].split('/')[0].split(':')[0];
      }
      return hostname + userID;
    }
  });
  _.extend(SearchHeaderView.prototype, ViewEventsPropagationMixin);
  return SearchHeaderView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/metadata/search.metadata',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-search-metadata binf-col-lg-4 binf-col-md-4 binf-col-sm-4\r\n                    binf-col-xs-4\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</span>\r\n<span class=\"csui-search-metadata-spacer binf-col-lg-1 binf-col-md-1 binf-col-sm-1\r\n     binf-col-xs-1\"></span>\r\n<span class=\"searchDetails binf-col-lg-7 binf-col-md-7 binf-col-sm-7\r\n                    binf-col-xs-7\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.tooltipText || (depth0 != null ? depth0.tooltipText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltipText","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"value","hash":{}}) : helper)))
    + "</span>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_metadata_search.metadata', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/impl/metadata/search.metadata.view',[
  'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/table/cells/cell.factory', 'csui/controls/table/cells/templated/templated.view',
  'csui/utils/types/date', 'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/metadata/search.metadata',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, Marionette, base, cellViewFactory, cellView, date, lang, itemTemplate) {
  "use strict";

  var SearchMetadataItemView = Marionette.ItemView.extend({
    className: "csui-search-item-details binf-col-lg-12",
    template: itemTemplate,
    attributes: {
      'role': 'listitem'
    },
    templateHelpers: function () {
      if (this._index < this.options.displayCount) {
        if (this._index < 2) {
          this.el.classList.add('csui-search-result-item-tobe-hide');
        }
      } else {
        this.el.classList.add('csui-search-hidden-items');
        this.el.classList.add('truncated-' + this.options.rowId);
      }
      var CellView = cellViewFactory.getCellView(this.model);
      if (CellView.columnClassName === "") {
        CellView = cellView;
      }
      var column       = {
            CellView: CellView,
            attributes: this.model.attributes,
            name: this.model.get("key"),
            title: this.model.get('title') || this.model.get('name') ||
                   this.model.get("column_name")
          },
          metadataView = new CellView({
            tagName: 'span',
            model: this.options.searchItemModel,
            column: column
          });
      var metadataValue = metadataView.getValueData && metadataView.getValueData();
      return {
        label: this.model.get("name"),
        value: metadataValue &&
               (metadataValue.formattedValue || metadataValue.value || metadataValue.name),
        tooltipText: metadataValue &&
                     (metadataValue.value || metadataValue.name || metadataValue.nameAria)
      };
    }
  });

  var SearchMetadataCollectionView = Marionette.CollectionView.extend({
    className: "csui-search-items-metadata",
    childView: SearchMetadataItemView,
    ui: {
      fieldsToBeHiddenOnHover: '.csui-search-result-item-tobe-hide'
    },
    childViewOptions: function () {
      return {
        rowId: this.options.rowId,
        searchItemModel: this.model,
        displayCount: this.childDisplayCount
      };
    },

    constructor: function SearchMetadataCollectionView(options) {
      options || (options = {});
      this.options = options;

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      var desc    = this.model.get("description"),
          summary = this.model.get("summary");

      this.childDisplayCount = ((summary && summary.length) || (desc && desc.length)) ? 3 : 2;
    },
    filter: function (child, index, collection) {
      if (child.get('key') === 'size' || child.get('key') === 'OTObjectSize') {
        return (this.model.get(child.get('key')) &&
                this.model.get(child.get('key') + "_formatted") !== "");
      } else if (["OTLocation", "OTName", "OTMIMEType", "reserved", "favorite"].indexOf(
              child.get('key')) >= 0) {
        return;
      } else {
        return (this.model.get(child.get('key')) && this.model.get(child.get('key')) !== "");
      }
    },
    onRender: function () {
      var collection = this.collection;
      this.collection.comparator = function (model) {
        return model.get("definitions_order");
      };
      this.collection.sort();
      this.bindUIElements();
    }
  });

  return SearchMetadataCollectionView;
});

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/breadcrumbs/search.breadcrumbs',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <li role=\"menuitem\" class=\"csui-breadcrumb-menu binf-hidden\">\r\n      <a class='csui-breadcrumb csui-acc-focusable' href=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.node_link_url : stack1), depth0))
    + "\"\r\n         data-id=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <li class=\"tail\">\r\n    <a class=\"csui-breadcrumb csui-acc-focusable\" href=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.node_link_url : stack1), depth0))
    + "\"\r\n       data-id=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\"\r\n       title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\r\n  </li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<li class=\"binf-dropdown binf-hidden binf-search-breadcrumb-ddmenu\">\r\n  <a href=\"#\" class=\"binf-dropdown-toggle csui-subcrumb csui-acc-focusable\"\r\n     data-binf-toggle=\"dropdown\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.subcrumbTooltip || (depth0 != null ? depth0.subcrumbTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"subcrumbTooltip","hash":{}}) : helper)))
    + "\">...</a>\r\n  <ul class=\"binf-dropdown-menu\" role=\"menu\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.crumbs : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </ul>\r\n</li>\r\n\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.crumbs : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_breadcrumbs_search.breadcrumbs', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/impl/breadcrumbs/search.breadcrumbs.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'hbs!csui/widgets/search.results/impl/breadcrumbs/search.breadcrumbs',
  'csui/utils/contexts/factories/next.node',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/node.links/node.links'
], function (_, $, Backbone, Marionette, SearchResultsBreadCrumbTemplate, NextNodeModelFactory,
    TabableRegionBehavior, NodeLinks) {

  var SearchResultsBreadCrumbView = Marionette.View.extend({

    tagName: 'ol',

    className: 'binf-breadcrumb',

    template: SearchResultsBreadCrumbTemplate,

    templateContext: function () {
      var messages = {
        'crumbs': this.collection.models,
        'subcrumbTooltip': this.lang.subcrumbTooltip
      };
      return messages;
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {'keydown': 'onKeyInView'},

    _breadcrumbSelector: 'a.csui-acc-focusable:visible',

    constructor: function SearchResultsBreadCrumbView(options) {
      options || (options = {});
      this.lang = options.lang || {};
      this.collection = options.collection;
      this.isRtl = options.isRtl;
      this.connector = this.collection.connector;

      var crumbModels = this.collection.models;
      for (var i = 0; i < crumbModels.length; i++) {
        crumbModels[i].attributes.node_link_url = this._getAncestorUrl(crumbModels[i]);
      }
      Marionette.View.call(this, options);

      this.listenTo(this.collection, 'update reset', this._adjustToFit);
      this.context = this.options.context;
      this.accLastBreadcrumbElementFocused = true;
      this.accNthBreadcrumbElementFocused = 0;

      this.resizeTimer = undefined;
      $(window).on('resize.' + this.cid, {view: this}, this._onWindowResize);
    },

    _getAncestorUrl: function (crumbModel) {
      // If the ancestor points to a real node, which is connected
      // to a server, set href of the link to the open the container
      // perspective of the ancestor.
      return crumbModel.get('id') > 0 && (this.connector) &&
             NodeLinks.getUrl(crumbModel, {connector: this.connector}) || '#';
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        // optimization for rapid mouse movement and redraw when mouse movement slows down or stop
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function () {
          self._adjustToFit();
        }, 200);
      }
    },

    isTabable: function () {
      return this.collection.models.length > 1;
    },

    currentlyFocusedElement: function () {
      if (this.isTabable()) {
        if (this.accLastBreadcrumbElementFocused) {
          return this.$(this._breadcrumbSelector + ':last');
        } else {
          var breadcrumbElements = this.$(this._breadcrumbSelector);
          return $(breadcrumbElements[this.accNthBreadcrumbElementFocused]);
        }
      } else {
        return $();
      }
    },

    synchronizeCollections: function () {
      return true;
    },

    onKeyInView: function (event) {
      var allBreadcrumbElements;

      switch (event.keyCode) {
      case 37:
      case 38:
        // left arrow key
        // up arrow key

        allBreadcrumbElements = this.$(this._breadcrumbSelector);
        if (this.accLastBreadcrumbElementFocused) {
          if (allBreadcrumbElements.length > 1) {
            this.accLastBreadcrumbElementFocused = false;
            this.accNthBreadcrumbElementFocused = allBreadcrumbElements.length - 2;
          }
        } else {
          if (this.accNthBreadcrumbElementFocused > 0) {
            this.accNthBreadcrumbElementFocused--;
          }
        }
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().trigger('focus');

        break;
      case 39:
      case 40:
        // right arrow key
        // down arrow key

        if (!this.accLastBreadcrumbElementFocused) {
          allBreadcrumbElements = this.$(this._breadcrumbSelector);
          if (this.accNthBreadcrumbElementFocused < allBreadcrumbElements.length - 1) {
            this.accNthBreadcrumbElementFocused++;
            this.trigger('changed:focus', this);
            this.currentlyFocusedElement().trigger('focus');
          }
        }
        break;
      }
    },

    refresh: function () {
      this._adjustToFit();
    },

    _adjustToFit: function () {
      if (this.collection.length > 1) {
        if (!!this.options.hasPromoted) {
          this.render();
        }
        this.el.getElementsByClassName('binf-dropdown')[0].classList.add('binf-hidden');
        var availableWidth       = this.el.offsetWidth,
            childs               = this.el.getElementsByClassName('tail'),
            ddChilds             = this.el.getElementsByClassName('csui-breadcrumb-menu'),
            lastEle              = childs[childs.length - 1],
            widthOfPromotedLabel = 0,
            hideAndShowCrumbs    = _.bind(function (index) {
              if (index === 0) {
                this.el.getElementsByClassName('binf-dropdown')[0].classList.remove('binf-hidden');
              }
              childs[index].classList.add('binf-hidden');
              ddChilds[index].classList.remove('binf-hidden');
            }, this);
        if (this.options.hasPromoted) {
          widthOfPromotedLabel = this.$el.closest('.csui-search-promoted-breadcrumbs-row').find(
                  '.csui-search-promoted').outerWidth() + 1;
        }
        for (var i = 0; i < childs.length; i++) {
          childs[i].classList.remove('binf-hidden');
          ddChilds[i].classList.add('binf-hidden');
        }

        for (i = 0; i < this.collection.length - 1; i++) {
          if (this.isRtl) {
            // RTL case check always last element's offset left to whole element's offset left.
            if (lastEle.offsetLeft > this.el.offsetLeft) {
              hideAndShowCrumbs(i);
            } else {
              break;
            }
          } else {
            // total available width should be less than last element's offset left and 32px (last
            // element's width including at least one character and ellipses) and if the current
            // row has promoted label and exclude it's width.
            if (availableWidth < (lastEle.offsetLeft + 32 - widthOfPromotedLabel)) {
              hideAndShowCrumbs(i);
            } else {
              break;
            }
          }
        }

        this.triggerMethod('tabable');
      }
    },

    _getMaxDisplayWidth: function () {
      return (this.el.offsetWidth * 0.9);
    },

    _getDisplayWidth: function () {
      var childs       = this.el.children,
          displayWidth = 0;
      for (var i = 0; i < childs.length; i++) {
        displayWidth += childs[i].offsetWidth;
      }
      return displayWidth;
    },

    onClickAncestor: function (model, node) {
      //TODO: need to implement with proper model.
      //console.log('onClickAncestor: need to execute default action');
      //var args = {node: node};
      //this.trigger('before:defaultAction', args);
      //if (!args.cancel) {
      //  var nodeId = node.get('id');
      //  if (this._nextNode.get('id') === nodeId) {
      //    // when id is same as nextNode's id, nextNode.set(id) event is not triggered
      //    this._nextNode.unset('id', {silent: true});
      //  }
      //
      //  var viewStateModel = this.context && this.context.viewStateModel;
      //  var viewState = viewStateModel && viewStateModel.get('state');
      //  if (viewState) {
      //    this.context.viewStateModel.set('state', _.omit(viewState, 'filter'), {silent: true});
      //  }
      //
      //  // The nodestable uses this event to remove the order_by from the viewStateModel
      //  this._nextNode.trigger('before:change:id', nodeId);
      //  viewStateModel && viewStateModel.set('browsing', true);
      //  this._nextNode.set('id', nodeId);
      //}
      //
      //this.$el.trigger('setCurrentTabFocus');
    },

    onBeforeDestroy: function () {
      $(window).off('resize.' + this.cid, this._onWindowResize);
    }

  });

  return SearchResultsBreadCrumbView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.result',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " aria-describedby=\"idOfPromotedLabel\" ";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                <div class=\"csui-search-results-version csui-search-item-version-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\">\r\n                  <a href=\"javascript:void(0);\" class=\"csui-search-version-label\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.versionLabel : stack1), depth0))
    + " "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.versions : depth0)) != null ? stack1.version_number_name : stack1), depth0))
    + "\r\n                  </a>\r\n                </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "              <div class=\"csui-search-promoted\" id=\"idOfPromotedLabel\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.promoted_label || (depth0 != null ? depth0.promoted_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"promoted_label","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.promoted_label || (depth0 != null ? depth0.promoted_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"promoted_label","hash":{}}) : helper)))
    + "\">\r\n                <span class=\"csui-search-promoted-label\">"
    + this.escapeExpression(((helper = (helper = helpers.promoted_label || (depth0 != null ? depth0.promoted_label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"promoted_label","hash":{}}) : helper)))
    + "</span>\r\n              </div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "              <div class=\"csui-search-breadcrumb\">\r\n                <div class=\"csui-search-item-breadcrumb csui-search-item-breadcrumb-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\"></div>\r\n                <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12\r\n                binf-col-xs-12\"></div>\r\n              </div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "              <div class=\"csui-search-item-action-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "-"
    + this.escapeExpression(((helper = (helper = helpers.version_id || (depth0 != null ? depth0.version_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"version_id","hash":{}}) : helper)))
    + " csui-search-item-inline-actions\"></div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var helper;

  return "              <div class=\"csui-search-item-action-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + " csui-search-item-inline-actions\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-search-item-row-wrapper csui-search-item-complete-row binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n  <div class=\"csui-search-item-row binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n    <h3 class=\"csui-search-item-hide-h3\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</h3>\r\n    <div class=\"csui-search-item-check\"></div>\r\n    <div class=\"csui-search-item-icon\">\r\n      <a href="
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "\r\n       "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.has_promoted : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n                        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.mimeTypeAria || (depth0 != null ? depth0.mimeTypeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mimeTypeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.OTName || (depth0 != null ? depth0.OTName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"OTName","hash":{}}) : helper)))
    + "\"\r\n                  class=\"csui-search-item-link "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.inactiveclass : stack1), depth0))
    + "\"><span class=\"csui-type-icon\"></span></a>\r\n      </div>\r\n    <div class=\"csui-search-col2 binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n      <div class=\"csui-search-item-left-panel binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n        <div class=\"csui-search-item\">\r\n          <div class=\"csui-search-item-name-wrapper\">\r\n            <div class=\"csui-search-item-name \">\r\n              <a href="
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "  "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.has_promoted : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n                  aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.mimeTypeAria || (depth0 != null ? depth0.mimeTypeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"mimeTypeAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.OTName || (depth0 != null ? depth0.OTName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"OTName","hash":{}}) : helper)))
    + "\"\r\n                  class=\"csui-search-item-link "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.inactiveclass : stack1), depth0))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.OTName || (depth0 != null ? depth0.OTName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"OTName","hash":{}}) : helper)))
    + "</a>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.has_version : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "              <div class=\"csui-icon csui-search-results-nodestateicon csui-search-item-nodestateicon\r\n                  csui-search-item-nodestateicon-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\"></div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"csui-search-item-content-wrapper binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n          <div class=\"csui-search-promoted-breadcrumbs-row\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.has_promoted : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.showBreadcrumb : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          </div>\r\n          <p class=\"csui-search-item-desc csui-overflow-description binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></p>\r\n          <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12\r\n        binf-col-xs-12 csui-search-row-spacer-divider\"></div>\r\n          <p class=\"csui-search-item-summary csui-overflow-summary binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></p>\r\n        </div>\r\n        <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12\r\n        binf-col-xs-12 csui-search-row-spacer-divider\"></div>\r\n      </div>\r\n      <div class=\"csui-search-item-center-panel binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n      <div class=\"csui-search-item-right-panel\">\r\n        <div class=\"csui-search-item-control-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + " binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n          <div class=\"csui-search-toolbar-container binf-hidden binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.version_id : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(11, data, 0)})) != null ? stack1 : "")
    + "          </div>\r\n          <div class=\"csui-search-row-spacer binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n          <div role=\"list\" class=\"csui-search-item-details-wrapper binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-search-item-action-panel csui-search-item-action-panel-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\">\r\n      <div class=\"csui-search-item-fav search-fav-"
    + this.escapeExpression(((helper = (helper = helpers.cid || (depth0 != null ? depth0.cid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cid","hash":{}}) : helper)))
    + "\"></div>\r\n    </div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.result', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.empty',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"csui-no-result-message-wrapper\">\r\n    <p class=\"csui-no-result-message\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>\r\n    <div class=\"csui-display-hide\">\r\n        <ul class=\"csui-search-suggestion-list\">\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion1 || (depth0 != null ? depth0.searchSuggestion1 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion1","hash":{}}) : helper)))
    + "</li>\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion2 || (depth0 != null ? depth0.searchSuggestion2 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion2","hash":{}}) : helper)))
    + "</li>\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion3 || (depth0 != null ? depth0.searchSuggestion3 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion3","hash":{}}) : helper)))
    + "</li>\r\n            <li>"
    + this.escapeExpression(((helper = (helper = helpers.searchSuggestion4 || (depth0 != null ? depth0.searchSuggestion4 : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchSuggestion4","hash":{}}) : helper)))
    + "</li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.empty', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/controls/expandall/impl/expandall',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"csui-search-expandall-wrapper\">\r\n  <div class=\"csui-search-expandall-text\"\r\n       title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "</div>\r\n  <button class=\"csui-search-header-expand-all\" aria-label=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "\"\r\n          title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.expandAll : stack1), depth0))
    + "\" aria-pressed=\"false\">\r\n    <span class=\"icon csui-icon icon-expandArrowDown\"></span>\r\n  </button>\r\n</div>";
}});
Handlebars.registerPartial('csui_widgets_search.results_controls_expandall_impl_expandall', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/widgets/search.results/controls/expandall/impl/expandall',[],function(){});
csui.define('csui/widgets/search.results/controls/expandall/expandall.view',['csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/controls/expandall/impl/expandall',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/controls/expandall/impl/expandall'
], function ($, Marionette, template, lang) {

  var expandAllView = Marionette.ItemView.extend({

    template: template,
    templateHelpers: function () {
      var messages = {
        expandAll: lang.expandAll
      };
      return {
        messages: messages
      };
    },

    events: {
      'click @ui.expandAllSelector': 'expandAll'
    },

    ui: {
      expandAllSelector: '.csui-search-header-expand-all',
      expandIcon: '.icon',
      expandAllLabelText: '.csui-search-expandall-text'
    },

    expandAll: function (event) {
      if (this.collection.length > 0) {
        var that = this;
        if (this._isExpanded) {
          this._isExpanded = false;

          this.ui.expandAllLabelText.html(lang.expandAll);
          this.ui.expandAllLabelText.attr('title', lang.expandAll);
          $(".csui-expand-all").addClass("csui-collapse-all");
          this.ui.expandIcon.removeClass('icon-expandArrowUp');
          this.ui.expandIcon.addClass('icon-expandArrowDown');
          this.ui.expandIcon.attr('title', lang.expandAll);
          this.ui.expandAllSelector.attr('title', lang.expandAll).attr('aria-pressed', 'true').attr('aria-label', lang.expandAll);
          this.options.view.$el.find("." + this.options._eleCollapse).trigger('click');
        } else {
          this._isExpanded = true;

          this.ui.expandAllLabelText.html(lang.collapseAll);
          this.ui.expandAllLabelText.attr('title', lang.collapseAll);
          $(".csui-expand-all").removeClass("csui-collapse-all");
          this.ui.expandIcon.removeClass('icon-expandArrowDown');
          this.ui.expandIcon.addClass('icon-expandArrowUp');
          this.ui.expandIcon.attr('title', lang.collapseAll);
          this.ui.expandAllSelector.attr('title', lang.collapseAll).attr('aria-pressed', 'false').attr('aria-label', lang.collapseAll);
          this.options.view.$el.find("." + this.options._eleExpand).trigger('click');
        }

          if (this.options.view.options.layoutView) {
            this.options.view.options.layoutView.updateScrollbar();
          }
        event.preventDefault();
        event.stopPropagation();
      }
    },

    pageChange: function () {
      if (this.ui.expandIcon instanceof Object &&
          this.ui.expandIcon[0].classList.contains(this.options._eleCollapse)) {
        this.ui.expandIcon.removeClass(this.options._eleCollapse).addClass(
            this.options._eleExpand).attr('title', lang.expandAll);
            this.ui.expandAllLabelText.html(lang.expandAll);
            this.ui.expandAllLabelText.attr('title', lang.expandAll);
            this.ui.expandAllSelector.attr('title', lang.expandAll).attr('aria-pressed', 'false').attr('aria-label', lang.expandAll);
      }
    }

  });

  return expandAllView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/standard/standard.search.results.header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div\r\n    class=\"csui-search-header-left-actions binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n  <div class=\"binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n    <div id=\"selectAllCheckBox\" class=\"csui-select-all csui-search-item-check\"></div>\r\n    <div id=\"SelectedItemsCounter\" class=\"csui-selected-items-counter-view\"></div>\r\n    <div id=\"toolbar\"\r\n         class=\"csui-search-toolbar binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n  </div>\r\n</div>\r\n<div class=\"csui-search-header-right-actions\">\r\n  <div class=\"binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n    <div class=\"csui-search-header-actions\">\r\n      <div class=\"csui-search-sorting\" id=\"csui-search-sort\"></div>\r\n      <div class=\"csui-expand-all\" id=\"expandAllArrow\"></div>\r\n    </div>\r\n  </div>\r\n</div> \r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_standard_standard.search.results.header', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/impl/standard/standard.search.results.header.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/widgets/search.results/controls/expandall/expandall.view',
  'csui/controls/checkbox/checkbox.view',
  'csui/widgets/search.results/controls/sorting/sort.menu.view',
  'csui/controls/selected.count/selected.count.view',
  'csui/models/node/node.model',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/standard/standard.search.results.header',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Backbone, Marionette, TableToolbarView, ExpandAllView, CheckboxView, SortingView,
    SelectedCountView, NodeModel, lang, template, ViewEventsPropagationMixin) {
  'use strict';
  var StandardSearchResultsHeaderView = Marionette.LayoutView.extend({
    template: template,
    regions: {
      expandAllRegion: '#expandAllArrow',
      sortRegion: '#csui-search-sort',
      selectAllRegion: '#selectAllCheckBox',
      toolbarRegion: '#toolbar',
      selectedCounterRegion: '#SelectedItemsCounter'
    },
    constructor: function StandardSearchResultsHeaderView(options) {
      options || (options = {});
      this.collection = options.collection;
      this.resultsView = options.view;
      this.options = options.options;
      this.localStorage = options.localStorage;
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.listenTo(this.collection, 'remove', this._updateToolItems)
          .listenTo(this.collection, 'sync', this._updateToolItems);
      this.setSelectAllView();
      this.setSortingView();
      this.setExpandAllView();
      this._setToolBar();
      this._setSelectionCounterView();
      this.listenTo(this.collection, "sync", this._removeAllSelections);
      this.listenTo(this.collection, 'reset', function () {
         this.expandAllView.pageChange();
      });
      this.listenTo(this, 'dom:refresh', this._refreshEle);
      this.listenTo(this.options.originatingView, 'query:changed', function () {
        if (this.expandAllView) {
          this.expandAllView._isExpanded = false;
        }
      });
    },

    _refreshEle: function() {
      if(this.toolbarView){
        this.toolbarView.trigger('dom:refresh');
      }
      if (this._selectAllView) {
        this._selectAllView.triggerMethod('dom:refresh');
      }
      if (this.expandAllView) {
        this.expandAllView.triggerMethod('dom:refresh');
      }
    },

    onRender: function () {
        this.sortRegion.show(this.sortingView);
        this.expandAllRegion.show(this.expandAllView);
        this.selectedCounterRegion.show(this.selectedCounterView);
        this.selectAllRegion.show(this._selectAllView);
        this.toolbarRegion.show(this.toolbarView);
        this._updateToolItems();
    },

    // Toolbar view
    _setToolBar: function () {
      var self       = this,
          parentNode = new NodeModel({id: undefined},
              {connector: this.collection.connector});
      this.collection.node = parentNode;

      // toolbarItems is an object with several TooItemFactories in it (for each toolbar one)
      this.toolbarView = new TableToolbarView({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        collection: this.collection,
        originatingView: this.options.originatingView,
        container: this.container,
        context: this.options.context,
        toolbarCommandController: this.options.originatingView.commandController,
        events: function () {
          return _.extend({}, TableToolbarView.prototype.events, {
            'keydown': self.onKeyInViewInToolbarView
          });
        }
      });
      this.listenTo(this.toolbarView, 'refresh:tabindexes', function () {
        // unlike in nodes table view, for header toolbar in search results has to navigate through
        // tab key instead-of direction keys
        this.toolbarView.$el.find('.csui-otherToolbar>ul>li>a:visible').attr('tabindex', 0);
      });
    },

    _updateToolItems: function () {
      if (this.toolbarView) {
        var nodes = this.collection.selectedItems.models;
        if (nodes && nodes.length === 1) {
          this.toolbarView.options.collection.node = nodes[0].parent;
        } else {
          this.toolbarView.options.collection.node = new NodeModel({id: undefined},
              {connector: this.collection.connector});
        }
        this.toolbarView.updateForSelectedChildren(nodes);
      }
      //TODO: check for the purpose of the below code
        // if (this.collection.length === 0) {
        //   this.el.classList.add('binf-hidden');
        // } else {
        //   this.el.classList.remove('binf-hidden');
        // }
      //TODO: End
    },

    onKeyInViewInToolbarView: function (event) {
      switch (event.keyCode) {
      case 37:
      case 39:
        // right arrow
        event.preventDefault();
        event.stopPropagation();
        break;
      }
    },

    // Select counter view
    _setSelectionCounterView: function () {
      //this.collection.selectedItems = new Backbone.Collection();
      this.selectedCounterView = new SelectedCountView({
        collection: this.collection.selectedItems,
        scrollableParent: '.csui-result-list'
      });
      this.listenTo(this.collection.selectedItems, 'remove reset add', this._updateToolItems);
      this.listenTo(this.selectedCounterView.collection, 'remove', this._updateRowsState);
      this.listenTo(this.selectedCounterView.collection, 'reset', _.bind(function () {
        if (this.collection.prevSearchDisplayStyle === "StandardView") {
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              []);
        }
      }, this));
    },

    _updateRowsState: function (models) {
      var updateModels = [];
      if (!(models instanceof Array)) {
        updateModels.push(models);
      } else {
        updateModels = models;
      }
      if (this.collection.prevSearchDisplayStyle === 'StandardView') {
        _.each(updateModels, function (model) {
          var newSelectedModelIds = this.resultsView._rowStates.get(
              StandardSearchResultsHeaderView.RowStatesSelectedRows);
          newSelectedModelIds = _.without(newSelectedModelIds, model.get('id'));
          this.collection.selectedItems.remove(model);
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              newSelectedModelIds);
        }, this);

      }
    },

    // Select view
    setSelectAllView: function () {
      this._selectAllView = new CheckboxView({
        checked: this._calculateSelectAllCheckedStatus(),
        disabled: this.collection.length === 0,
        ariaLabel: lang.selectAllAria,
        title: lang.selectAll
      });

      this.listenTo(this._selectAllView, 'clicked', function (e) {
        e.cancel = true;  // don't update checkbox immediately

        var checked = this._selectAllView.model.get('checked'); // state before clicking cb

        switch (checked) {
        case 'true':
          // all rows are selected -> deselect all
          var updateModels = [],
              modelId      = this.resultsView._rowStates.get(
                  StandardSearchResultsHeaderView.RowStatesSelectedRows);
          modelId.forEach(function (modelID) {
            var model = this.collection.selectedItems.findWhere({id: modelID});
            this.collection.selectedItems.remove(model);
          }, this);
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              []);
          break;
        default:
          // no or some rows are selected -> select all, except those that are not selectable
          var selectedModelIds = [];
          var newlySelected = this.collection.filter(function (model) {
            if (model.get('selectable') !== false) {
              selectedModelIds.push(model.get('id'));
              if (!this.collection.selectedItems.findWhere({id: model.get('id')})) {
                return true;
              }
            }
            return false;
          }, this);
          this.collection.selectedItems.add(newlySelected);
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              selectedModelIds);
        }
      });

      this.listenTo(this.resultsView._rowStates,
          'change:' + StandardSearchResultsHeaderView.RowStatesSelectedRows,
          function () {
            this._updateSelectAllCheckbox();
          });

      this.listenTo(this.collection, 'reset', function () {
        this._updateSelectAllCheckbox();
      });
    },

    _updateSelectAllCheckbox: function () {
      if (this._selectAllView) {
        this._selectAllView.setChecked(this._calculateSelectAllCheckedStatus());
        this._selectAllView.setDisabled(this.collection.length === 0);
      }
    },

    _removeAllSelections: function () {
      var selectedItemCollection = [];
      this.collection.each(_.bind(function (model) {
        if (!!this.collection.selectedItems.findWhere({id: model.get('id')})) {
          selectedItemCollection.push(model.get('id'));
        }
      }, this));
      // resetting the rowstates only selectedItems present to updated checkboxes properly
      selectedItemCollection.length &&
      this.resultsView._rowStates.set({'selected': []}, {'silent': true});
      this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
          selectedItemCollection);
      // if (this.selectedItems.length > 0 && this.headerView.collection.showTabularSearchView) {
      //   this.selectedItems.reset(this.tableView._allSelectedNodes.models);
      // }
    },

    _calculateSelectAllCheckedStatus: function () {
      var selected = this.resultsView._rowStates.get(
          StandardSearchResultsHeaderView.RowStatesSelectedRows);
          if (selected && selected.length) {
                  var all  = selected.length === this.collection.length;
            if (selected.length > 0 && !all) {
              return 'mixed';
            } else {
              return selected.length > 0;
            }
          }
    },

    // Sorting view
    setSortingView: function () {
      this.sortingView = new SortingView({
        collection: this.collection,
        enableSorting: this.options.enableSorting !== undefined ? this.options.enableSorting : true
      });
      return true;
    },

    // Expand all view
    setExpandAllView: function () {
      this.expandAllView = new ExpandAllView({
        collection: this.collection,
        view: this.resultsView,
        _eleCollapse: "icon-expandArrowUp",
        _eleExpand: "icon-expandArrowDown"
      });
      return this.expandAllView;
    },
  }, {
    RowStatesSelectedRows: 'selected'
  });

  _.extend(StandardSearchResultsHeaderView.prototype, ViewEventsPropagationMixin);
  return StandardSearchResultsHeaderView;
});
csui.define('csui/widgets/search.results/impl/standard/standard.search.results.view',[
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/progressblocker/blocker',
  'csui/controls/table/cells/favorite/favorite.view',
  'csui/controls/checkbox/checkbox.view',
  'csui/controls/node.state/node.states.view',
  'csui/controls/node.state/node.state.icons',
  'csui/widgets/search.results/impl/metadata/search.metadata.view',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'csui/controls/tableactionbar/tableactionbar.view',
  'i18n', 'csui/models/node/node.model',
  'csui/utils/nodesprites', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/widgets/search.results/impl/breadcrumbs/search.breadcrumbs.view',
  'csui/models/nodeancestors',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/search.metadata.factory',
  'hbs!csui/widgets/search.results/impl/search.result',
  'hbs!csui/widgets/search.results/impl/search.empty',
  'csui/utils/node.links/node.links',
  'csui/utils/accessibility',
  'csui/utils/log',
  'csui/widgets/search.results/impl/standard/standard.search.results.header.view',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/search.results/impl/search.results',
  'csui/lib/jquery.mousehover',
  'csui/lib/jquery.redraw'
], function (module, _, $, Backbone, Marionette, base, BlockingView, FavoritesView, CheckboxView,
    NodeStateCollectionView, nodeStateIcons, SearchMetadataView, lang, TableActionBarView, i18n,
    NodeModel, NodeSpriteCollection, NodeTypeIconView, BreadcrumbsView, NodeAncestorCollection,
    DefaultActionBehavior, SearchMetadataFactory, itemTemplate, emptyTemplate, nodeLinks,
    Accessibility, log, StandardSearchResultsHeaderView) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var config = _.extend({
    enableFacetFilter: true, // LPAD-60082: Enable/disable facets
    enableBreadcrumb: true,
    enableSearchSettings: true, // global enable/disable search settings, but LPAD 81034 ctor can overrule
    showInlineActionBarOnHover: !accessibleTable,
    forceInlineActionBarOnClick: false,
    inlineActionBarStyle: "csui-table-actionbar-bubble"
  }, module.config());
  var SearchStaticUtils = {
    isAppleMobile: base.isAppleMobile(),
    mimeTypes: {},
    isRtl: i18n && i18n.settings.rtl
  };

  var NoSearchResultView = Marionette.ItemView.extend({

    className: 'csui-empty',
    template: emptyTemplate,

    constructor: function NoSearchResultView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }

  });
  var SearchResultItemView = Marionette.LayoutView.extend({

    className: function () {
      var classList = 'binf-list-group-item binf-col-lg-12 binf-col-md-12 binf-col-sm-12' +
                      ' binf-col-xs-12 ';
      classList += this.hasVersioned ? 'csui-search-result-version-item' : '';
      classList += !!this.hasPromoted ? ' csui-search-promoted-item' : '';
      return classList;
    },
    template: itemTemplate,

    regions: {
      favRegion: ".csui-search-item-fav",
      selectionRegion: ".csui-search-item-check",
      searchMetadataRegion: ".csui-search-item-details-wrapper",
      breadcrumbRegion: ".csui-search-item-breadcrumb",
      nodeStateRegion: ".csui-search-item-nodestateicon"
    },

    ui: {
      descriptionField: '.csui-overflow-description',
      summaryField: '.csui-overflow-summary',
      modifiedByField: '.csui-search-modified-by',
      metadataDetails: '.csui-search-item-details',
      inlineToolbarContainer: '.csui-search-toolbar-container',
      inlineToolbar: '.csui-search-item-row',
      arrowIcon: '.search-results-item-expand .icon'
    },

    events: {
      'click .csui-search-item-link': 'openSearchItem',
      'click .csui-search-version-label': 'openVersionHistory',
      'click .icon-expandArrowUp': 'showMetadataInfo',
      'click .icon-expandArrowDown': 'hideMetadataInfo'
    },

    templateHelpers: function () {
      var defaultActionController = this.options.defaultActionController,
          checkModelHasAction     = defaultActionController.hasAction.bind(defaultActionController),
          inActiveClass           = checkModelHasAction(this.model) ? '' :
                                    'csui-search-no-default-action',
          messages                = {
            created: lang.created,
            createdby: lang.createdBy,
            modified: lang.modified,
            owner: lang.owner,
            type: lang.type,
            items: lang.items,
            showMore: lang.showMore, // where does this show up
            showLess: lang.showLess,
            versionLabel: lang.versionLabel,
            versionSeparator: lang.versionSeparator,
            inactiveclass: inActiveClass,
            showBreadcrumb: config.enableBreadcrumb && this.model.collection.isLocationColumnAvailable
          },
          defaultActionUrl        = this.defaultActionUrl,
          promotedText            = this.promotedText;

      var retValue = {
        showOwner: this.model.attributes.hasOwnProperty('owner_user_id'), // LPAD-61022: hide owner, if not set in response
        messages: messages,
        defaultActionUrl: defaultActionUrl,
        has_promoted: this.hasPromoted,
        promoted_label: lang.promotedLabel,
        promoted_text: promotedText.replace(/,/g, ', '),
        has_version: this.hasVersioned,
        cid: this.cid,
        itemBreadcrumb: this.itemBreadcrumb,
        mimeTypeAria: this.mimeTypeAria
      };
      return retValue;
    },

    openSearchItem: function (event) {
      event.preventDefault();
      this.trigger("click:item", this.model);
    },

    constructor: function SearchResultItemView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.collection = options.collection;
      this.model.attributes.mime_type = !!this.model.attributes.mime_type ?
                                        this.model.attributes.mime_type :
                                        (this.model.attributes.versions ?
                                         this.model.attributes.versions.mime_type : "");
      this._hiddenMetadataElements = $();
      var mimType = this.model.attributes.mime_type;
      this.mimeTypeSearch = SearchStaticUtils.mimeTypes[mimType];

      if (!this.mimeTypeSearch) {
        // TODO: Share the better type name used by NodeTypeIconView
        SearchStaticUtils.mimeTypes[mimType] = NodeSpriteCollection.findTypeByNode(this.model);
      }

      this.mimeTypeSearch = SearchStaticUtils.mimeTypes[mimType];

      _.extend(this.model.attributes, {
        collection_id: this.model.cid,
        mime_type_search: this.mimeTypeSearch
      });

      var ancestors  = this.model.attributes.ancestors,
          ancLen     = ancestors ? ancestors.length : 0,
          parent     = ancLen ? ancestors[ancLen - 1] : undefined,
          parentName = parent && parent.attributes ? parent.attributes.name : undefined;

      this.itemBreadcrumb = _.str.sformat(lang.itemBreadcrumbAria, parentName);

      this.mimeTypeAria = _.str.sformat(lang.mimeTypeAria, this.mimeTypeSearch);

      this.hasVersioned = this.hasVersion();
      this.hasPromoted = this.hasPromoted();

      this.defaultActionUrl = nodeLinks.getUrl(this.model, {connector: this.model.connector});
      this.promotedText = '';
      if (!!this.hasPromoted) {
        this.promotedText = !!this.hasBestBet() ? this.model.get('bestbet') :
                            this.model.get('nickname');
        this.promotedText = this.promotedText.toString();
      }

      this._rowStates = options.rowStates;
      this.addOwnerDisplayName();
      this.addCreatedUserDisplayName();
      this.listenTo(this._rowStates, 'change:' + StandardSearchResultsView.RowStatesSelectedRows,
          this._selectionChanged
      );

      this.listenTo(this.model, 'change', function () {
        // Ignore the sole 'change:csuiDelayedActionsRetrieved' event and not re-render every row
        // for all rows in the collection.  This has performance impact and flickering effect.
        // Only the TableActionToolbar should be re-rendered, and it is already done by itself
        // with delayedActions event listening.
        if (_.size(this.model.changed) === 1 &&
            _.has(this.model.changed, 'csuiDelayedActionsRetrieved')) {
          return;
        }
        if (this.model.changed.name) {
          this.model.set({OTName: this.model.changed['name']});
        }
        this.render();
        this.updateItemdetails();
      });
      // to handle rename scenario for selected items, which are not part of existing collection.
      if (this.model.get('name') !== this.model.get('OTName')) {
        this.model.set({OTName: this.model.get('name')});
        this.render();
        this.updateItemdetails();
      }
      this.listenTo(this.options.parentView, 'render:metadata',
          _.bind(function (metadataModels) {
            this.searchMetadataView = new SearchMetadataView({
              rowId: this.cid,
              collection: this.options.parentView.metadata,
              model: this.model
            });

            var tableColumns = this.searchMetadataView.options.collection.models;
            if (tableColumns && tableColumns.length === 1 && tableColumns[0].get("key") === null) {
              this.searchMetadataView.options.collection.add(metadataModels, {'silent': true});
            }

            this.searchMetadataRegion.show(this.searchMetadataView);
          }, this));

      if (SearchStaticUtils.isAppleMobile === false) {
        this.$el.on('mouseenter.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverStart, this));
        this.$el.on('mouseleave.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverEnd, this));
      }
    },

    _hoverStart: function () {
      this.showInlineActions();
    },

    _hoverEnd: function () {
      this.hideInlineActions();
    },

    _selectionChanged: function (rowStatesModel) {
      var previous = rowStatesModel.previous(StandardSearchResultsView.RowStatesSelectedRows);
      var changed = rowStatesModel.changed[StandardSearchResultsView.RowStatesSelectedRows];

      var deselected = _.difference(previous, changed);
      var selected = _.difference(changed, previous);

      var id = this.model.get('id');

      if (_.contains(deselected, id)) {
        this.model.set('csuiIsSelected', false);
        this._checkboxView.setChecked(false);
        this.ui.inlineToolbar.removeClass('selected');
      }
      if (_.contains(selected, id)) {
        this._checkboxView.setChecked(true);
        this.ui.inlineToolbar.addClass('selected');

        this.hideInlineActions(); // hide if a item was selected by checkbox
      }
    },

    initActionViews: function (options) {
      this.favView = new FavoritesView({
        tagName: 'div',
        focusable: true,
        model: options.model,
        context: options.context,
        tableView: options.tableView
      });

      var selectedModelIds = this._rowStates.get(StandardSearchResultsView.RowStatesSelectedRows);
      var checked = _.contains(selectedModelIds, this.model.get('id'));
      var checkboxTitle = _.str.sformat(lang.selectItem, options.model.get('name'));
      var checkboxAriaLabel = _.str.sformat(lang.selectItemAria, options.model.get('name'));

      var selectable = options.model.get('selectable') !== false;
      this._checkboxView = new CheckboxView({
        checked: checked ? 'true' : 'false',
        disabled: !selectable,
        ariaLabel: checkboxAriaLabel,
        title: checkboxTitle
      });

      this.listenTo(this._checkboxView.model, 'change:checked', function (event) {
        this._markAsSelected(event.changed.checked === 'true');
      });

      //options.models = SearchMetadataItems;
      options.connector = options.model.connector;
      if (!!config.enableBreadcrumb && this.model.collection.isLocationColumnAvailable) {
        this.addBreadcrumbs(options);
      }
    },

    _getEnabledNodeStateIcons: function () {
      var nodeStateIconsPrototype, enabledNodeStateIcons;
      nodeStateIconsPrototype = Object.getPrototypeOf(nodeStateIcons);
      enabledNodeStateIcons = new nodeStateIconsPrototype.constructor(
          nodeStateIcons.filter(function (iconModel) {
            var IconView = iconModel.get('iconView');
            try {
              return IconView && (!IconView.enabled || IconView.enabled({
                    context: this.options.context,
                    node: this.model
                  }));
            } catch (error) {
              log.warn('Evaluating an icon view failed.\n{0}',
                  error.message) && console.warn(log.last);
            }
          }, this));
      return enabledNodeStateIcons;
    },

    _markAsSelected: function (select) {
      var newSelectedModelIds;
      var modelId = this.model.get('id');
      var selectedModelIds = this._rowStates.get(StandardSearchResultsView.RowStatesSelectedRows);
      if (select) {
        if (!_.contains(selectedModelIds, modelId)) {
          this.collection.selectedItems.add(this.model);
          newSelectedModelIds = selectedModelIds.concat([modelId]);
          this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      } else {
        if (_.contains(selectedModelIds, modelId)) {
          var modelRemoved = this.collection.selectedItems.findWhere({id: this.model.get('id')});
          this.collection.selectedItems.remove(modelRemoved);
          newSelectedModelIds = _.without(selectedModelIds, modelId);
          this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      }

    },

    addBreadcrumbs: function (options) {
      var ancestors = new NodeAncestorCollection(
          options.model.attributes.ancestors, {
            node: options.model, autofetch: false
          });
      if (!this.hasPromoted || (this.hasPromoted && this.model.get("ancestors"))) {
        this.breadcrumbsView = new BreadcrumbsView({
          context: options.context,
          collection: ancestors,
          startSubCrumbs: 0,
          isRtl: SearchStaticUtils.isRtl
          // TODO: Use {fetchOnCollectionUpdate: false} to prevent
          // the control from an extra fetching of the collection.
        });
        this.breadcrumbsView.synchronizeCollections(true);
      } else {
        // for volumes donot include breadcrumbs for best_bets/nick_names results.
        if (options.model.parent.get('id') > 0) {
          this.getAncestors(options).fetch().done(_.bind(function (response) {
            if(!!this.breadcrumbsView.completeCollection) {
              this.breadcrumbsView.completeCollection.length &&
              this.breadcrumbsView.completeCollection.last().set({'showAsLink': true},
                  {'silent': true});
              this.model.attributes.ancestors = this.breadcrumbsView.completeCollection.models;
            } else {
              this.breadcrumbsView.collection.length &&
              this.breadcrumbsView.collection.last().set({'showAsLink': true}, {'silent': true});
              this.model.attributes.ancestors = this.breadcrumbsView.collection.models;
            }
            this.breadcrumbsView.synchronizeCollections();
            if (this.model.collection && this.model.collection.fetched) {
              this.model.trigger("change:ancestors", this.model);
            }
          }, this));
        } else {
          this.breadcrumbsView = undefined;
        }
      }
      return true;
    },

    getAncestors: function (opts) {
      var node            = opts.model,
          ancestorOptions = {node: node.parent, autofetch: false},
          newAncestors    = new NodeAncestorCollection(undefined, ancestorOptions);
      this.breadcrumbsView = new BreadcrumbsView({
        context: opts.context,
        collection: newAncestors,
        startSubCrumbs: 0,
        hasPromoted: this.hasPromoted,
        isRtl: SearchStaticUtils.isRtl
      });
      return newAncestors;
    },

    onRender: function (e) {
      this.initActionViews(this.options);
      var enabledStateIcons = this._getEnabledNodeStateIcons();
      if (enabledStateIcons.length) {
        this.nodeStateView = new NodeStateCollectionView({
          context: this.options.context,
          node: this.options.model,
          tableView: this.options.originatingView,
          targetView: this.options.originatingView,
          collection: enabledStateIcons
        });
        this.nodeStateRegion.show(this.nodeStateView);
      }

      var meta = this.model.get("search_result_metadata");
      if (!!meta && (meta.current_version !== false && meta.version_type !== "minor") &&
          this.model.get('favorite') !== undefined) { // LPAD-61021) {
        this.favRegion.show(this.favView);
      }
      if (!!config.enableBreadcrumb && !!this.breadcrumbsView) {
        this.breadcrumbRegion.show(this.breadcrumbsView);
        this.$el.find('ol.binf-breadcrumb').attr('aria-label', this.itemBreadcrumb);

        var nodesCount = this.$el.find('ol.binf-breadcrumb > li').length;
        if (nodesCount === 1) {
          this.$el.find('.tail').addClass("one-node");
        } else if (nodesCount === 2) {
          this.$el.find('.tail').addClass("two-nodes");
        }
      }
      this.selectionRegion.show(this._checkboxView);
      if (this.model.collection && this._checkboxView.options.checked === "true") {
        this.$el.find('.csui-search-item-row').addClass('selected');
      }
      this.trigger('render:metadata');
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();

      var selectedSettings = this.model.collection.selectedSettings;
      var description = '', summary = '';
      if (selectedSettings) {
        switch (selectedSettings) {
        case 'SD' :
        {
          description = this.model.get("description");
          summary = this.model.get("summary");
          break;
        }
        case 'SO' :
        {
          description = this.model.get("summary");
          break;
        }
        case 'SP' :
        {
          description = this.model.get("summary")
                        || this.model.get("description");
          break;
        }
        case 'DP' :
        {
          description = this.model.get("description")
                        || this.model.get("summary");
          break;
        }
        case 'DO' :
        {
          description = this.model.get("description");
          break;
        }
        default :
        {
          description = '';
        }
        }
      }
      if (description && description.length > 0) {
        this.el.getElementsByClassName('csui-search-item-desc')[0].innerHTML = description;
      }
      if (summary && summary.length > 0) {
        this.el.getElementsByClassName('csui-search-item-summary')[0].innerHTML = summary;
      }
      this.listenTo(this, 'adjust:breadcrumb', function () {
        this.breadcrumbsView.refresh();
      });
    },

    hasVersion: function () {
      var hasVer = this.model.get('versions');
      if (hasVer) {
        var srMetadata = this.model.get("search_result_metadata");
        hasVer = srMetadata &&
                 (srMetadata.current_version === false || srMetadata.version_type === 'minor');
      }
      return hasVer;
    },

    hasBestBet: function () {
      var bestBets = this.model.get('bestbet');
      return !!bestBets && !!bestBets.length;
    },

    hasNickName: function () {
      var nickName = this.model.get('nickname');
      return !!nickName && !!nickName.length;
    },

    hasPromoted: function () {
      return !!this.hasBestBet() || !!this.hasNickName();
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
      if (this.$el && SearchStaticUtils.isAppleMobile === false) {
        this.$el.off('mouseenter.' + this.cid, '.csui-search-item-row', this._hoverStart);
        this.$el.off('mouseleave.' + this.cid, '.csui-search-item-row', this._hoverEnd);
      }
    },

    onShow: function (e) {
      this.updateItemdetails(e);
      if (this.nodeStateView) {
        var stateViews = this.nodeStateView.el.getElementsByTagName('li');
        if (stateViews.length === 1) {
          this.$el.addClass('csui-search-result-nodestate-item');
        } else if (stateViews.length === 2) {
          this.$el.addClass('csui-search-result-nodestate-item2');
        } else if (stateViews.length > 2) {
          this.$el.addClass('csui-search-result-nodestate-more');
        }
      }
    },

    _toggleExpand: function (buttonEl) {
      this.bindUIElements();
      if (this._isExpanded) {
        this._isExpanded = false;
        $('.truncated-' + this.cid).hide();
        buttonEl.attr('title', lang.showMore)
                .attr('aria-expanded', 'false')
                .attr('aria-label', lang.showMoreAria);
        this.ui.arrowIcon.removeClass('icon-expandArrowUp');
        this.ui.arrowIcon.addClass('icon-expandArrowDown');
        this.ui.descriptionField.removeClass("csui-search-item-desc-height");
        this.ui.descriptionField.addClass("csui-overflow");
        this.ui.summaryField.removeClass("csui-search-item-summary-height");
        this.ui.summaryField.addClass("csui-overflow");
      } else {
        this._isExpanded = true;
        $('.truncated-' + this.cid).show();
        buttonEl.attr('title', lang.showLess)
                .attr('aria-expanded', 'true')
                .attr('aria-label', lang.showLessAria);
        this.ui.arrowIcon.removeClass('icon-expandArrowDown');
        this.ui.arrowIcon.addClass('icon-expandArrowUp');
        this.ui.descriptionField.addClass("csui-search-item-desc-height");
        this.ui.descriptionField.removeClass("csui-overflow");
        this.ui.summaryField.addClass("csui-search-item-summary-height");
        this.ui.summaryField.removeClass("csui-overflow");
      }
    },

    updateItemdetails: function (e) {
      var self           = this,
          hasDescription = this.hasDescriptionText(this.ui.descriptionField[0]), // for few objects it could be summary.
          hasSummary     = this.hasDescriptionText(this.ui.summaryField[0]);

      if (hasDescription) {
        this.ui.descriptionField.addClass("csui-overflow");
      }

      this.$el.find('.truncated-' + this.cid).addClass('binf-hidden');

      if (hasSummary) {
        this.ui.summaryField.addClass("csui-overflow");
      }

      if (!!config.enableBreadcrumb && this.breadcrumbsView) {
        this.breadcrumbsView.refresh();
      }

      if (this.$el.find('.search-results-item-expand').length === 0) {
        this.$el.find('.csui-search-item-fav.search-fav-' + this.cid)
            .after(
                '<button class="search-results-item-expand" title="' + lang.showMore +
                '" aria-expanded="false" aria-label="' + lang.showMoreAria +
                '"><span class="icon icon-expandArrowDown"></span></button>')
            .next().on('click', function () {
          self._toggleExpand.call(self, $(this));
        });
      }

      if (!hasDescription) {   //when there is no description, hide description field and 'Modified' metadata property
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }

      if (!hasSummary) {   //when there is no summary, hide summary field
        this.ui.summaryField.addClass("binf-hidden");
      }
    },

    addOwnerDisplayName: function () {
      var ownerDisplayName = "";
      if (!!this.model.attributes.owner_user_id_expand) {
        ownerDisplayName = this.getDisplayName(this.model.attributes.owner_user_id_expand);
      }
      _.extend(this.model.attributes, {
        owner_display_name: ownerDisplayName
      });
    },

    addCreatedUserDisplayName: function () {
      var createUserDisplayName = "";
      if (!!this.model.attributes.create_user_id_expand) {
        createUserDisplayName = this.getDisplayName(this.model.attributes.create_user_id_expand);
      }
      _.extend(this.model.attributes, {
        create_user_display_name: createUserDisplayName
      });
    },

    getDisplayName: function (userInfo) {
      return userInfo.name_formatted || userInfo.name;
    },

    hasDescriptionText: function (el) {
      return (el && el.textContent.trim().length > 0);
    },

    showInlineActions: function () {
      if (this.ui.inlineToolbarContainer.find('.csui-table-actionbar').length === 0) {
        if (this.collection.selectedItems.length > 0) {
          // no inline bar if items are selected by checkbox
          return;
        }

        this._hiddenMetadataElements = this.$el.find('.csui-search-item-details:lt(2)');
        this._hiddenMetadataElements.addClass("binf-hidden");

        this.ui.inlineToolbarContainer.removeClass("binf-hidden");

        var versionId   = this.model.attributes.version_id ?
                          "-" + this.model.attributes.version_id :
                          "",
            selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
        var args = {
          sender: this,
          target: selectedRow,
          node: this.model
        };
        this.trigger("enterSearchRow", args);
      }
    },

    hideInlineActions: function () {
      this.ui.inlineToolbarContainer.addClass("binf-hidden");
      this._hiddenMetadataElements.removeClass("binf-hidden");
      this._hiddenMetadataElements = $();
      if (!this._isExpanded) {
        var descLength = this.ui.descriptionField.html().trim().length;
        if (descLength <= 0) {
          this.ui.descriptionField.addClass("binf-hidden");
          this.ui.modifiedByField.addClass("binf-hidden");
        }

        var summaryLength = this.ui.summaryField.html().trim().length;
        if (summaryLength <= 0) {
          this.ui.summaryField.addClass("binf-hidden");
        }
      }

      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      var args = {
        sender: this,
        target: selectedRow,
        node: []
      };
      this.trigger("leaveSearchRow", args);
    },

    openVersionHistory: function (event) {
      var self         = this,
          args         = {},
          selectedNode = [];
      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      selectedNode = this.model;
      args = {
        sender: self,
        target: selectedRow,
        model: selectedNode
      };
      self.options.originatingView.openVersionHistory(args);
    },

    showMetadataInfo: function (event) {
      this.ui.descriptionField.removeClass("binf-hidden");
      this.ui.modifiedByField.removeClass("binf-hidden");
      this.ui.summaryField.removeClass("binf-hidden");
      event.preventDefault();
      event.stopPropagation();
    },

    hideMetadataInfo: function (event) {
      var descLength = this.ui.descriptionField.html().trim().length;
      if (descLength <= 0) {
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }
      var summaryLength = this.ui.summaryField.html().trim().length;
      if (summaryLength <= 0) {
        this.ui.summaryField.addClass("binf-hidden");
      }
      event.preventDefault();
      event.stopPropagation();
    }
  });

  var StandardSearchResultsView = Marionette.CollectionView.extend({

    className: 'binf-list-group',

    childView: SearchResultItemView,
    childViewOptions: function () {

      return {
        context: this.options.context,
        defaultActionController: this.defaultActionController,
        metadata: this.metadata,
        rowStates: this._rowStates,
        originatingView: this.options.originatingView,
        headerView: this.options.originatingView.headerView,
        parentView: this,
        isLocationColumnAvailable: this.isLocationColumnAvailable > -1,
        collection: this.collection
      };
    },

    emptyView: NoSearchResultView,
    emptyViewOptions: function () {
      return {
        model: this.emptyModel
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    constructor: function SearchResultListView(options) {
      options || (options = {});
      this.options = options;
      this.context = options.context;
      this.collection = options.collection;
      this.localStorage = this.options.localStorage;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.setRowStates();
      this.setInlineActionBarEvents();
      this.metadata = this.options.metadata ||
                      this.context.getCollection(SearchMetadataFactory, this);
      this.setStandardSearchHeaderView();
      this.listenTo(this, 'update:tool:items', this._updateToolItems);

      //TODO: after sync
      this.listenTo(this.collection, 'sync', function () {
        // on page navigation new models are loaded into this.resultsView.collection,
        // so replacing with new models in this.selectedItems to maintain consistency.
        this.collection.selectedItems && this.collection.selectedItems.length &&
        this.collection.each(_.bind(function (model) {
          var index = this.collection.selectedItems.findIndex({id: model.get('id')});
          if (index !== -1 && this.collection.selectedItems.at(index) !== model) {
            this.collection.selectedItems.remove(this.collection.selectedItems.at(index));
            this.collection.selectedItems.add(model, {at: index});
            model.set('csuiIsSelected', true);
            var newSelectedModelIds;
            var modelId = model.get('id');
            var selectedModelIds = this._rowStates.get(StandardSearchResultsView.RowStatesSelectedRows);
            if (!_.contains(selectedModelIds, modelId)) {
              this.collection.selectedItems.add(this.model);
              newSelectedModelIds = selectedModelIds.concat([modelId]);
              this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
            }
          } else {
            this._updateToolItems();
          }
        }, this));
      });

      this.listenTo(this.collection, "sync", this._focusOnFirstSearchResultElement);
      this.listenTo(this.options.originatingView, 'render:metadata', this.renderMetadataModels);

      this.listenTo(this, 'dom:refresh', function () {
        this.standardHeaderView.triggerMethod('dom:refresh');
      });
      BlockingView.delegate(this, options.originatingView);

      this.collection.originatingView = options.originatingView;
      this.emptyModel = new Backbone.Model({
        message: lang.noSearchResultMessage,
        suggestionKeyword: lang.suggestionKeyword,
        searchSuggestion1: lang.searchSuggestion1,
        searchSuggestion2: lang.searchSuggestion2,
        searchSuggestion3: lang.searchSuggestion3,
        searchSuggestion4: lang.searchSuggestion4
      });
      this.listenTo(this.collection, 'sync', function () {
        var tabElements = this.options.originatingView.facetView &&
                          this.options.originatingView.facetView.$('.csui-facet');
        if (tabElements && tabElements.length) {
          tabElements.prop('tabindex', 0);
        }
      });
      this.listenTo(this.collection, 'error', function () {
        this.emptyModel.set('message', lang.failedSearchResultMessage);
      });
      this.listenTo(this, 'dom:refresh', this._refreshDom);
      this.listenTo(this, 'facet:opened', function () {
        //To adjust the breadcrumb whenever search results width changes.
        if ($(window).width() > 1023) {
          this.children.each(function (view) {
            view.trigger('adjust:breadcrumb');
          });
        }
      });
      this.listenTo(this, 'destroy:header:view', function () {
        this.standardHeaderView.destroy();
        this.standardHeaderView = undefined;
      });
    },

    _focusOnFirstSearchResultElement: function () {
      if(this.options.originatingView && (!this.options.originatingView.collection.settings_changed))
      {
        this.$el.find(".binf-list-group-item:first-child .csui-search-item-name > a").trigger(
            'focus');
      } else {
        this.options.originatingView.collection.settings_changed = false;
      }
     },

    renderMetadataModels: function () {

      this.metadata = _.extend({}, this.metadata,
          this.collection.searching && this.collection.searching.sortedColumns);
      var metadataModels = _.filter(this.metadata.models,
          function (item) {
            return !item.get("default");
          });
      this.trigger('render:metadata', metadataModels);
    },

    setRowStates: function () {
      this._rowStates = new Backbone.Model();
      this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, []);
    },

    setStandardSearchHeaderView: function () {
      this.standardHeaderView = new StandardSearchResultsHeaderView({
        collection: this.collection,
        view: this,
        options: this.options,
        selectedItems: this.collection.selectedItems
      });
    },
    _updateToolItems: function () {
      this.standardHeaderView && this.standardHeaderView._updateToolItems();
    },
    _showInlineActionBar: function (args) {
      if (!!args) {
        this._savedHoverEnterArgs = null;

        var parentId = args.node.get('parent_id');
        if (parentId instanceof Object) {
          parentId = args.node.get('parent_id').id;
        }
        var parentNode = new NodeModel({id: parentId},
            {connector: args.node.connector});

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: this.defaultActionController.commands,
              delayedActions: this.collection.delayedActions,
              collection: this.options.toolbarItems.inlineToolbar || [],
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              container: parentNode,
              containerCollection: this.collection,
              model: args.node,
              originatingView: this.options.originatingView,
              notOccupiedSpace: 0
            }, this.options.toolbarItems.inlineToolbar &&
               this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'after:execute:command',
            this.options.originatingView._toolbarCommandExecuted);
        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this._showInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },
    setInlineActionBarEvents: function () {
      this.listenTo(this, 'childview:enterSearchRow',
          this._showInlineActionBarWithDelay);
      this.listenTo(this, 'childview:openVersionHistory',
          this.openVersionHistory);
      this.listenTo(this, 'childview:leaveSearchRow', this._actionBarShouldDestroy);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
    },
    _showInlineActionBarWithDelay: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        // if (!self.targetView.lockedForOtherContols) {
        // don't show the action bar control if the searchresult view is locked because a different
        // control is already open
        self._showInlineActionBar.call(self, args);
        //}
      }, 200);
    },
    _actionBarShouldDestroy: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        //this.inlineToolbarView.updateForSelectedChildren(args.node);
        this.inlineToolbarView.destroy();
      }
    },
    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onScrollTop: function () {
      $('.binf-list-group').scrollTop(0);
    },

    _refreshDom: function () {
      this.$el.addClass("list-group-height");
      this.onScrollTop();
    }
  }, {
    RowStatesSelectedRows: 'selected'
  });

  return StandardSearchResultsView;
});
csui.define('csui/controls/table/rows/description/search.description.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/table/rows/description/description.view'
], function (_, $, Marionette, base, DescriptionView) {

  var SearchDescriptionView = DescriptionView.extend({

    templateHelpers: function () {
      var description = '',
          modded      = '',
          summaryModded= '',
          title = '',
          summaryTitle = '',
          originalDescription = '',
          originalSummary = '',
          summary ='',
          selectedSettings = this.options && this.options.tableView && this.options.tableView.selectedSettings,
          summary_description = false;

      switch (selectedSettings) {
        case 'SD' : {
          description = this.model.get("description");
          summary = this.model.get("summary");
          summary_description = true;
          break;
        }
        case 'SO' : {
          description = this.model.get("summary");
          break;
        }
        case 'SP' : {
          description = this.model.get("summary")
              || this.model.get("description");
          break;
        }
        case 'DP' : {
          description = this.model.get("description")
              || this.model.get("summary");
          break;
        }
        case 'DO' : {
          description = this.model.get("description");
          break;
        }
        case 'NONE':
          break;
        default : {
          description = '';
        }
      }
      if (description && description.length > 0) {
        description = description.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        originalDescription = description;
        var hhRegEx = /&lt;HH&gt;/gi;
        var hhEndRegEx = /&lt;\/HH&gt;/gi;
        modded = description.replace(hhRegEx, '<span class="csui-summary-hh">');
        modded = modded.replace(hhEndRegEx, '</span>');
        title = originalDescription.replace(hhRegEx, '');
        title = title.replace(hhEndRegEx, '');
      }
      if (summary_description && summary && summary.length > 0) {
        summary = summary.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        originalSummary = summary;
        var hhRegExSum = /&lt;HH&gt;/gi;
        var hhEndRegExSum = /&lt;\/HH&gt;/gi;
        summaryModded = summary.replace(hhRegExSum, '<span class="csui-summary-hh">');
        summaryModded = summaryModded.replace(hhEndRegExSum, '</span>');
        summaryTitle = originalSummary.replace(hhRegExSum, '');
        summaryTitle = summaryTitle.replace(hhEndRegExSum, '');
      }
      return _.extend(DescriptionView.prototype.templateHelpers.apply(this), {
        complete_description: title,
        current_description: modded,
        complete_summary: summaryTitle,
        current_summary: summaryModded,
        search_description: true,
        search_summary: true,
        summary_description_available: summary_description && summary,
        descriptionAvailable : description
      });
    }
  });

  return SearchDescriptionView;
});

csui.define('csui/widgets/search.results/impl/tabular/tabular.search.results.view',[
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/table/table.view',
  'csui/controls/table/rows/description/search.description.view',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/utils/accessibility',
  'csui/lib/jquery.mousehover',
  'csui/lib/jquery.redraw',
], function (module, _, $, Backbone, Marionette, base, TableView, DescriptionRowView,
  TableRowSelectionToolbarView, TableActionBarView, Accessibility) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var TabularSearchResultsView = TableView.extend({

    ui: {
      toggleDetails: '.csui-table-cell-_toggledetails.sorting_disabled'
    },

    events: {
      'mouseup @ui.toggleDetails': 'onToggleOrChangePageSize',
      'keypress @ui.toggleDetails': 'onToggleOrChangePageSize',
      'mouseup .binf-table > thead > tr > th:not(.sorting_disabled)': 'onTableSortClick',
      'keypress .binf-table > thead > tr > th:not(.sorting_disabled)': 'onTableSortClick'
    },

    constructor: function TabularSearchResultsView(options) {

      this.collection = options.collection;
      this.options = options;

      this.columns = this.collection.searching && this.collection.searching.sortedColumns;
      if (options.accessibleTable) {
        this.getAdditionalColumns();
      }
      this.collection.columns = (this.columns) ? this.columns : this.tableColumns;

      this.settings = this.options.originatingView.getSettings();
      if (this.settings && this.settings.get('display')) {
        var selectedSummary = this.settings.get('display').summary_description.selected;
        this.showSummaryOnly = (selectedSummary === 'SO') ? true : false;
      }
      this.defaultActionController = this.options.defaultActionController;
      var args = _.extend({
        context: this.options.context,
        connector: this.collection.options.connector,
        collection: this.collection,
        columns: this.options.columns,
        enableSorting: this.options.enableSorting !== undefined ? this.options.enableSorting : true,
        tableColumns: this.options.tableColumns,
        pageSize: this.options.data.pageSize || this.options.pageSize,
        originatingView: this.options.originatingView,
        container: this.options.container,
        orderBy: this.collection.orderBy,
        filterBy: this.options.filterBy,
        actionItems: this.defaultActionController.actionItems,
        descriptionRowView: DescriptionRowView,
        descriptionRowViewOptions: {
          firstColumnIndex: 2,
          lastColumnIndex: 2,
          showDescriptions: false,
          showSummary: true,
          collapsedHeightIsOneLine: true,
          displayInEntireRow: true,
          showSummaryOnly: this.showSummaryOnly,
          descriptionColspan: 7
        },
        commands: this.defaultActionController.commands,
        blockingParentView: this.options.originatingView,
        parentView: this.options.originatingView,
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.tabularInlineToolbar || [],
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.tabularInlineToolbar,
            delayedActions: this.collection.delayedActions,
            container: this.container,
            containerCollection: this.collection
          }, this.options.toolbarItems.tabularInlineToolbar &&
             this.options.toolbarItems.tabularInlineToolbar.options, {
            inlineBarStyle: this.options.config.inlineActionBarStyle,
            forceInlineBarOnClick: this.options.config.forceInlineActionBarOnClick,
            showInlineBarOnHover: this.options.config.showInlineActionBarOnHover
          })
        },
        allSelectedNodes: this.collection.selectedItems,
        customLabels: this.options.customLabels
      });

      options = _.extend(options, args);

      TableView.prototype.constructor.call(this, options);
      this.selectedSettings = this.collection.selectedSettings;
      this._showEmptyViewText = !this.collection.length;
      this.listenTo(this.options.originatingView, 'render:table',function () {
        this.columns = this.options.originatingView.columns;
        this.render();
      });
      this.listenTo(this.options.originatingView, 'toggle:description', function (showDescription) {
        this.showDetailRowDescriptions(showDescription);
        this.trigger('update:scrollbar');
      });

      this._setTableViewEvents();

      this.listenTo(this, 'set:tablerow:assets', function() {

        // must be after setTableView
        this.columns = this.options.originatingView.columns;
        this.setTableRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar || [],
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          // condensed header toggle is only available for main NodesTable, not derived tables
          showSelectionCounter: true
        });
        this._setTableRowSelectionToolbarEventListeners();
      });

      
      this.listenTo(this.options.originatingView, "properties:view:destroyed", this.onPropertiesViewDestroyed);
      
      this.listenTo(this.options.originatingView, "permissions:view:destroyed", this.onPropertiesViewDestroyed);

      this.listenTo(this.collection, 'remove', function () {
        if (!this.collection.selectedItems.length && (this.collection.models.length === 0 || 
              this.collection.totalCount < this.collection.topCount)) {
          this.collection.trigger('sync');
        }
      });
    },

    onRender: function () {
      if (this.collection.selectedItems.length) {
        this.collection.selectedItems.trigger('reset');
      }
    },

    _setTableViewEvents: function () {
      this.listenTo(this, 'tableRowSelected', function (args) {
        this.cancelAnyExistingInlineForm.call(this);
        if (this.collection.selectedItems) {
          var selectedNodes  = args.nodes,
              selectedModels = this.collection.selectedItems.models.slice(0);
          _.each(selectedNodes, function (selectedNode) {
            if (!this.collection.selectedItems.get(selectedNode)) {
              selectedModels.push(selectedNode);
            }
          }, this);
          this.collection.selectedItems.reset(selectedModels);
        }
      });
      if (this.container) {
        this.listenTo(this.container, 'change:id', function () {
          if (this.options.fixedFilterOnChange) {
            this.collection.clearFilter(false);
            this.collection.setFilter(this.options.fixedFilterOnChange, false);
          }
          else if (this.options.clearFilterOnChange) {
            this.collection.clearFilter(false);
          }
          if (this.options.resetOrderOnChange) {
            this.collection.resetOrder(false);
          }
          if (this.options.resetLimitOnChange) {
            this.collection.resetLimit(false);
          }
        });
      }
      this.listenTo(this.collection.selectedItems, 'reset', function () {
        if (this.tableToolbarView) {
          // update table toolbar after row selection changed
          //this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.tableView.thumbnailView;
          this.options.originatingView.headerView.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          this._onSelectionUpdateCssClasses(this.collection.selectedItems.length);
        }
        var selectedItems = this.collection.selectedItems;
        this.collection.each(function (node) {
          var selectedItem = selectedItems.get(node.get('id'));
          node.set('csuiIsSelected', selectedItem !== undefined);
        });
      });

      this.listenTo(this, 'tableRowUnselected', function (args) {
        if (this.collection.selectedItems) {
          var unselectedNodes = args.nodes;
          _.each(unselectedNodes, function (unselectedNode) {
            this.collection.selectedItems.remove(unselectedNode, {silent: true});
          }, this);
          this.collection.selectedItems.reset(_.clone(this.collection.selectedItems.models));
        }
      });

      this.listenTo(this, 'execute:defaultAction', function (node) {
        var args = {node: node};
        this.trigger('before:defaultAction', args);
        if (!args.cancel) {
          var self = this;
          this.defaultActionController
              .executeAction(node, {
                context: this.options.context,
                originatingView: this.options.originatingView
              })
              .done(function () {
                self.trigger('executed:defaultAction', args);
              });
        }
      });
      if (this.enableDragNDrop) {
        this.listenTo(this, 'tableRowRendered', function (row) {
          var rowdragNDrop = this.setDragNDrop(row);
          this._assignDragArea(rowdragNDrop, $(row.target));
          this._assignDragArea(rowdragNDrop, row.expandedRows);
        });
      }
      return true;
    },

    setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.options.originatingView.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        showSelectionCounter: true,
        scrollableParent: '.csui-nodetable tbody',
        // if toolbarCommandController is not defined, a new ToolbarCommandController
        // with the following commands is created
        commands: this.defaultActionController.commands,
        selectedChildren: this.collection.selectedItems,
        container: this.collection.node,
        context: this.context,
        originatingView: this.options.originatingView,
        collection: this.collection
      });
      var toolbarView = this._tableRowSelectionToolbarView;
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        // only show/hide the condensed header when in row selection mode
        this.options.originatingView.headerView.$el.find('.csui-search-header').toggleClass('csui-show-header');
        this.showingBothToolbars = this.options.originatingView.headerView &&
        this.options.originatingView.headerView.$el.find('.csui-search-header').hasClass(
                                      'csui-show-header');
        if (this.showingBothToolbars) {
          this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass(
              'csui-table-rowselection-toolbar-visible');
              this.options.originatingView.headerView.$el.parent('#header').addClass('csui-show-header');
        } else {
          this.options.originatingView.headerView.$el.find('.csui-search-header').addClass(
              'csui-table-rowselection-toolbar-visible');
              this.options.originatingView.headerView.$el.parent('#header').removeClass('csui-show-header');
        }
        // let the right toolbar know to update its attributes
        toolbarView.trigger('toolbar:activity', true, this.showingBothToolbars);
      });

      this.listenTo(toolbarView, 'render', function () {
          this.listenTo(toolbarView._selectedCountView.collection,'remove', function (models) {
            var model = this.collection.findWhere({id: models.get('id')});
            if (model) {
              model.set('csuiIsSelected', false);
            } else {
              models.set('csuiIsSelected', false);
            }
            this._onSelectionUpdateCssClasses(this.collection.selectedItems.length);
          });
      });
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      // listen for change of the selected rows in the table.view and if at least one row is
      // selected, display the table-row-selected-toolbar and hide the table-toolbar
      this.listenTo(this.collection.selectedItems, 'reset', function () {
          var headerView = this.options.originatingView && this.options.originatingView.headerView;
          headerView.tableRowSelectionToolbarRegion &&
             headerView.tableRowSelectionToolbarRegion.$el.removeClass('binf-hidden');
          this._tableRowSelectionToolbarView._rightToolbarView.options.showCondensedHeaderToggle = true;
          headerView.tableRowSelectionToolbarRegion &&
          headerView.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          this._onSelectionUpdateCssClasses(this.collection.selectedItems.length);
      });

    },

    _onSelectionUpdateCssClasses: function (selectionLength, stopTriggerToolbarActivity) {
      var $rowSelectionToolbarEl = this.options.originatingView.headerView.tableRowSelectionToolbarRegion.$el;
      var headerVisible = this.options.originatingView.headerView &&
      this.options.originatingView.headerView.$el.find('.csui-search-header').hasClass(
                              'csui-show-header');
      this._tableRowSelectionToolbarVisible = !selectionLength;
      if (accessibleTable) {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            // make tableToolbar invisible
            //  and rowSelectionToolbar visible

            // this lets the tableToolbar disappear
            if (!headerVisible && !this.showingBothToolbars) {
              this.options.originatingView.headerView.$el.find('.csui-search-header').addClass(
                  'csui-table-rowselection-toolbar-visible');
            }
            // this lets the rowSelectionToolbar appear
            $rowSelectionToolbarEl.removeClass('binf-hidden');
            $rowSelectionToolbarEl.addClass('csui-table-rowselection-toolbar-visible');
          }
          this._tableRowSelectionToolbarView.trigger('toolbar:activity',
              this._tableRowSelectionToolbarVisible, headerVisible);
        } else {
          this.showingBothToolbars = false;
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            // make tableToolbar visible
            //  and rowSelectionToolbar invisible

            // without the rowSelectionToolbar, it is not necessary to have height for both toolbars
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass('csui-show-header');

            // this lets the tableToolbar appear
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass('binf-hidden');
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass(
                'csui-table-rowselection-toolbar-visible');

            // this lets the rowSelectionToolbar disappear
            $rowSelectionToolbarEl.removeClass('csui-table-rowselection-toolbar-visible');
            this.options.originatingView.headerView.$el.parent('#header').removeClass('csui-show-header');
          }
        }
      } else {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            // make tableToolbar invisible
            //  and rowSelectionToolbar visible

            // this will start the transition on height of rowSelectionToolbar from 0 to full
            // height, which smoothly lets the rowSelectionToolbar appear
            $rowSelectionToolbarEl
                .removeClass('binf-hidden').redraw()
                .addClass('csui-table-rowselection-toolbar-visible');

            // this will start the transition on height of search header to 0, which finally lets
            // the search header disappear
            if (!headerVisible && !this.showingBothToolbars) {
              this.options.originatingView.headerView.$el.find('.csui-search-header').addClass(
                  'csui-table-rowselection-toolbar-visible');
            }
          }
          this._tableRowSelectionToolbarView.trigger('toolbar:activity',
              this._tableRowSelectionToolbarVisible, headerVisible);
        } else {
          this.showingBothToolbars = false;
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            // make tableToolbar visible
            //  and rowSelectionToolbar invisible

            // without the rowSelectionToolbar, it is not necessary to have height for both toolbars
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass('csui-show-header');
            $rowSelectionToolbarEl
                .removeClass('csui-table-rowselection-toolbar-visible');

            // this will start the transition on height of tableToolbar from 0 to full
            // height, which smoothly lets the tableToolbar appear
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass(
                'csui-table-rowselection-toolbar-visible');
                this.options.originatingView.headerView.$el.parent('#header').removeClass('csui-show-header');
          }
        }
      }
    },

    onTableSortClick: function (event) {
      //Setting the isSortOptionSelected whenever sort is performed from table columns
      //Instead of setting it after collection sync
      if ((event.type === 'keypress' && (event.keyCode === 13 || event.keyCode === 32)) ||
      (event.type === 'mouseup')) {
        this.collection.isSortOptionSelected = false;
      }
    },

    onToggleOrChangePageSize: function (event) {
      if ((event.type === 'keypress' && (event.keyCode === 13 || event.keyCode === 32)) ||
          (event.type === 'mouseup')) {
        this.collection.isSortOptionSelected = true;
      }
    },

    onPropertiesViewDestroyed: function () {
      this.onMetadataNavigationViewDestroyed();
      this.options.originatingView.headerView.updateToggleDescription();
      this.render();
    },

    onMetadataNavigationViewDestroyed: function () {
      if (!!this.collection.inMetadataNavigationView && this.isTabularView) {
        this.collection.inMetadataNavigationView = false;
      }
    },

  });

  return TabularSearchResultsView;
});
csui.define('csui/models/widget/search.results/search.metadata/search.columns',['csui/lib/underscore', "csui/lib/backbone",
  'i18n!csui/models/impl/nls/lang'
], function (_, Backbone, lang) {

  var metadataColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var metadataColumnCollection = Backbone.Collection.extend({

    model: metadataColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new metadataColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }
  });

  var metadataColumns = new metadataColumnCollection([
    {
      key: 'OTMIMEType',
      sequence: 0,
      titleIconInHeader: 'mime_type',
      permanentColumn: true // don't wrap column due to responsiveness into details row
    },
    {
      key: 'OTName',
      sequence: 1,
      permanentColumn: true, // don't wrap column due to responsiveness into details row
      isNaming: true  // use this column as a starting point for the inline forms
    },
    {
      key: 'version_id',
      column_key: 'version_id',
      title: lang.version,
      noTitleInHeader: true,
      permanentColumn: true,
      sequence: 2
    },
    {
      key: 'reserved',
      column_key: 'reserved',
      sequence: 3,
      title: lang.state, // "reserved" is just to bind the column to some property
      noTitleInHeader: true, // don't display a text in the column header
      permanentColumn: true
    },
    {
      key: 'favorite',
      column_key: 'favorite',
      sequence: 910,
      title: lang.favorite,
      noTitleInHeader: true,
      permanentColumn: true // don't wrap column due to responsiveness into details row
    }
  ]);

  return metadataColumns;
});


csui.define('csui/widgets/search.results/impl/toolbaritems',['csui/lib/underscore', "module",
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/search.results/impl/toolbaritems'
], function (_, module, extraToolItems) {

  // TODO: Deprecate this module

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      // TODO: log a deprecation warning
    });
  }

  return extraToolItems;

});

csui.define('csui/widgets/search.results/toolbaritems',[
  'csui/lib/underscore',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  // Load extra tool items to be added to this collection
  'csui-ext!csui/widgets/search.results/toolbaritems',
  // Load extra tool items from the previous module location
  'csui/widgets/search.results/impl/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, extraToolItems,
    oldExtraToolItems) {
  'use strict';

  // Keep the keys in sync with csui/widgets/search.results/toolbaritems.masks
  var toolbarItems = {

    filterToolbar: new ToolItemsFactory({
          filter: [
            {
              signature: "Filter",
              name: lang.ToolbarItemFilter,
              icon: "icon icon-toolbarFilter",
              svgId: "themes--carbonfiber--image--generated_icons--action_filter32"
            }
          ]
        },
        {
          addTrailingDivider: false
        }),
    tableHeaderToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink
            }
          ],
          edit: [
            {signature: "Edit", name: lang.ToolbarItemEdit, flyout: "edit", promoted: true},
            {signature: "EditActiveX", name: "EditActiveX", flyout: "edit"},
            {signature: "EditOfficeOnline", name: "EditOfficeOnline", flyout: "edit"},
            {signature: "EditWebDAV", name: "EditWebDAV", flyout: "edit"}
          ],
          share: [
            {
              signature: 'SendTo',
              name: lang.ToolbarItemSendTo,
              flyout: 'sendto',
              group: 'share'
            },
            {
              signature: 'Share',
              name: lang.ToolbarItemShare,
              flyout: 'share',
              promoted: true,
              group: 'share'
            },
            {
              signature: 'EmailLink',
              name: lang.ToolbarItemEmailLink,
              flyout: 'sendto',
              promoted: true,
              group: 'share'
            }
          ],
          main: [
            {signature: "InlineEdit", name: lang.ToolbarItemRename, onlyInTouchBrowser: true},
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "Collect", name: lang.ToolbarCollect},
            {signature: "Delete", name: lang.ToolbarItemDelete},
            {signature: "RemoveCollectedItems", name: lang.ToolbarItemRemoveCollectionItems},
            {signature: "ZipAndDownload", name: lang.MenuItemZipAndDownload}
          ],
          shortcut: [
            {signature: "OriginalCopyLink", name: lang.ToolbarItemOriginalCopyLink},
            {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
            {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
            {signature: "OriginalReserveDoc", name: publicLang.ToolbarItemOriginalReserve},
            {signature: "OriginalUnreserveDoc", name: publicLang.ToolbarItemOriginalUnreserve},
            {signature: "OriginalCopy", name: lang.ToolbarItemOriginalCopy},
            {signature: "OriginalMove", name: lang.ToolbarItemOriginalMove},
            {signature: "OriginalAddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload},
            {signature: "OriginalDelete", name: lang.ToolbarItemOriginalDelete}
          ]
        },
        {
          maxItemsShown: 15,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          dropDownText: lang.ToolbarItemMore,
          addGroupSeparators: false,
          lazyActions: true
        }),
    otherToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink
            }
          ],
          edit: [
            {signature: "Edit", name: lang.ToolbarItemEdit, flyout: "edit", promoted: true},
            {signature: "EditActiveX", name: "EditActiveX", flyout: "edit"},
            {signature: "EditOfficeOnline", name: "EditOfficeOnline", flyout: "edit"},
            {signature: "EditWebDAV", name: "EditWebDAV", flyout: "edit"}
          ],
          share: [
            {
              signature: 'SendTo',
              name: lang.ToolbarItemSendTo,
              flyout: 'sendto',
              group: 'share'
            },
            {
              signature: 'Share',
              name: lang.ToolbarItemShare,
              flyout: 'share',
              promoted: true,
              group: 'share'
            },
            {
              signature: 'EmailLink',
              name: lang.ToolbarItemEmailLink,
              flyout: 'sendto',
              promoted: true,
              group: 'share'
            }
          ],
          main: [
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "Collect", name: lang.ToolbarCollect},
            {signature: "Delete", name: lang.ToolbarItemDelete},
            {signature: "ZipAndDownload", name: lang.MenuItemZipAndDownload}
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          addGroupSeparators: false,
          lazyActions: true
        }),
    inlineToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink,
              icon: "icon icon-toolbar-copylink",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy_link32"
            }
          ],
          edit: [
            {
              signature: "Edit",
              name: lang.ToolbarItemEdit,
              icon: "icon icon-toolbar-edit",
              svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            }
          ],
          share: [
          ],
          other: [
            {
              signature: "permissions",
              name: lang.ToolbarItemPermissions,
              icon: "icon icon-toolbar-permissions",
              svgId: "themes--carbonfiber--image--generated_icons--action_view_perms32"
            },
            {
              signature: "Download",
              name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            },
            {
              signature: "ReserveDoc",
              name: publicLang.ToolbarItemReserve,
              icon: "icon icon-toolbar-reserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "UnreserveDoc",
              name: publicLang.ToolbarItemUnreserve,
              icon: "icon icon-toolbar-unreserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "Copy",
              name: lang.ToolbarItemCopy,
              icon: "icon icon-toolbar-copy",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy32"
            },
            {
              signature: "Move",
              name: lang.ToolbarItemMove,
              icon: "icon icon-toolbar-move",
              svgId: "themes--carbonfiber--image--generated_icons--action_move32"
            },
            {
              signature: "AddVersion",
              name: lang.ToolbarItemAddVersion,
              icon: "icon icon-toolbar-add-version",
              svgId: "themes--carbonfiber--image--generated_icons--action_add_version32"
            },
            {
              signature: "Collect",
              name: lang.ToolbarCollect,
              icon: "icon icon-toolbar-actioncollect",
              svgId: "themes--carbonfiber--image--generated_icons--action_collect32"
            },
            {
              signature: "Delete",
              name: lang.ToolbarItemDelete,
              icon: "icon icon-toolbar-delete",
              svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
              signature: "ZipAndDownload",
              name: lang.MenuItemZipAndDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          addGroupSeparators: false
        }),
    tabularInlineToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink,
              icon: "icon icon-toolbar-copylink",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy_link32"
            }
          ],
          edit: [
            {
              signature: "Edit",
              name: lang.ToolbarItemEdit,
              icon: "icon icon-toolbar-edit",
              svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            }
          ],
          share: [
           
          ],       
          other: [
            {
              signature: "permissions",
              name: lang.ToolbarItemPermissions,
              icon: "icon icon-toolbar-permissions",
              svgId: "themes--carbonfiber--image--generated_icons--action_view_perms32"
            },
            {
              signature: "Download",
              name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            },
            {
              signature: "ReserveDoc",
              name: publicLang.ToolbarItemReserve,
              icon: "icon icon-toolbar-reserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "UnreserveDoc",
              name: publicLang.ToolbarItemUnreserve,
              icon: "icon icon-toolbar-unreserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "Copy",
              name: lang.ToolbarItemCopy,
              icon: "icon icon-toolbar-copy",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy32"
            },
            {
              signature: "Move",
              name: lang.ToolbarItemMove,
              icon: "icon icon-toolbar-move",
              svgId: "themes--carbonfiber--image--generated_icons--action_move32"
            },
            {
              signature: "AddVersion",
              name: lang.ToolbarItemAddVersion,
              icon: "icon icon-toolbar-add-version",
              svgId: "themes--carbonfiber--image--generated_icons--action_add_version32"
            },
            {
              signature: "Collect",
              name: lang.ToolbarCollect,
              icon: "icon icon-toolbar-actioncollect",
              svgId: "themes--carbonfiber--image--generated_icons--action_collect32"
            },
            {
              signature: "Delete",
              name: lang.ToolbarItemDelete,
              icon: "icon icon-toolbar-delete",
              svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
              signature: "ZipAndDownload",
              name: lang.MenuItemZipAndDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          addGroupSeparators: false
        }),

    versionToolItems: ['properties', 'open', 'download', 'delete']
  };

  if (oldExtraToolItems) {
    addExtraToolItems(oldExtraToolItems);
  }

  if (extraToolItems) {
    addExtraToolItems(extraToolItems);
  }

  function addExtraToolItems(extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return toolbarItems;
});

csui.define('csui/widgets/search.results/toolbaritems.masks',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  // Keep the keys in sync with csui/widgets/search.results/toolbaritems
  var toolbars = ['otherToolbar', 'inlineToolbar'];

  function ToolbarItemsMasks() {
    var config = module.config(),
        globalMask = new GlobalMenuItemsMask();
    // Create and populate masks for every toolbar
    this.toolbars = _.reduce(toolbars, function (toolbars, toolbar) {
      var mask = new ToolItemMask(globalMask, {normalize: false});
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        source = source[toolbar];
        if (source) {
          mask.extendMask(source);
        }
      });
      // Enable restoring the mask to its initial state
      mask.storeMask();
      toolbars[toolbar] = mask;
      return toolbars;
    }, {});
  }

  ToolbarItemsMasks.toolbars = toolbars;

  return ToolbarItemsMasks;

});

csui.define('csui/models/widget/search.results/search.settings/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url'
], function (_, $, Backbone, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var originalSync = prototype.sync;
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url         = this.connector.getConnectionUrl().getApiBase('v2'),
              queryString = "",
              templateId  = this.options.templateId;
          if (templateId) {
            queryString = Url.combine(queryString, "/template/" + templateId);
          } else {
            queryString = Url.combine(queryString, "/template");
          }
          queryString = Url.combine(queryString, "/settings/display");

          return Url.combine(url, 'search' + queryString);
        },

        sync: function (method, model, options) {
          return originalSync.apply(this, arguments);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/search.results/search.settings/search.settings.model',['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/mixins/connectable/connectable.mixin', 'csui/utils/url',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.results/search.settings/server.adaptor.mixin'
], function ($, _, Backbone, ConnectableMixin, Url, FetchableMixin, ServerAdaptorMixin) {
  "use strict";

  var RegionsModel = Backbone.Model.extend({
    constructor: function RegionsModel() {
      Backbone.Model.apply(this, arguments);
    }
  });

  var RegionsModelCollection = Backbone.Collection.extend({
    model: RegionsModel,

    constructor: function RegionsModelCollection() {
      Backbone.Collection.apply(this, arguments);
    },

    isFetchable: false
  });

  var SearchSettingsModel = Backbone.Model.extend({
    constructor: function SearchSettingsModel(attributes, options) {
      this.options = options || (options = {});
      Backbone.Model.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeServerAdaptor(options);
    },

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    },

    isNew: function () {
      return false;
    },

    parse: function (response, options) {
      response = response.results && response.results.data;
      var displayRegions = ['available', 'selected'];
      _.each(response && response.display, function (item) {
        if (_.isObject(item)) {
          displayRegions.map(function (region) {
            if (item[region]) {
              if (_.isArray(item[region])) {
                item[region] = new RegionsModelCollection(item[region]);
              }
            }
          });
        }
      });
      return response;
    },

    isFetchable: function () {
      return true;
    },

    getColumnKeys: function () {
      return this.pluck('key');
    }
  });

  ConnectableMixin.mixin(SearchSettingsModel.prototype);
  FetchableMixin.mixin(SearchSettingsModel.prototype);
  ServerAdaptorMixin.mixin(SearchSettingsModel.prototype);

  return SearchSettingsModel;
});
csui.define('csui/utils/contexts/factories/search.settings.factory',['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.results/search.settings/search.settings.model'
], function (require, module, _, Backbone, CollectionFactory, ConnectorFactory,
    SearchSettingsCollection) {

  var SearchSettingsFactory = CollectionFactory.extend({
    propertyPrefix: 'searchSettings',

    constructor: function SearchSettingsFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchSettings = this.options.searchSettings || {};
      if (!(searchSettings instanceof Backbone.Collection)) {
        var connector  = context.getObject(ConnectorFactory, options),
            config     = module.config(),
            templateId = options.templateId;
        searchSettings = new SearchSettingsCollection(searchSettings.models, _.extend({
          connector: connector,
          templateId: templateId
        }, searchSettings.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = searchSettings;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return SearchSettingsFactory;
});
csui.define('csui/utils/contexts/factories/search.results.facets.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.results/search.facets'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, SearchFacetCollection) {

  var SearchResultFacetCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'searchFacets',

    constructor: function SearchResultFacetCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var facets = this.options.searchFacets || {};
      if (!(facets instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            query     = facets.options.query,
            config    = module.config();
        facets = new SearchFacetCollection(facets.models, _.extend({
          connector: connector,
          query: query,
          stateEnabled: true
        }, facets.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = facets;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return SearchResultFacetCollectionFactory;

});

/* START_TEMPLATE */
csui.define('hbs!csui/widgets/search.results/impl/search.results',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div class=\"csui-search-left-panel-tabs\">\r\n          <ul role=\"tablist\">\r\n              <li class=\"csui-tab csui-search-custom-tab\" role=\"presentation\">\r\n                <a title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.customSearchTab : stack1), depth0))
    + "\" tabindex=\"0\"  role=\"tab\">\r\n                  <span>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.customSearchTab : stack1), depth0))
    + "</span>\r\n                </a>\r\n              </li>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showFacetPanel : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "            </ul>\r\n          </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <li class=\"csui-tab csui-search-facet-tab\" role=\"presentation\">\r\n                  <a title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchFilterTab : stack1), depth0))
    + "\" tabindex=\"0\" role=\"tab\">\r\n                    <span>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.searchFilterTab : stack1), depth0))
    + "</span>\r\n                  </a>\r\n                </li>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "            <div class=\"csui-search-results-custom\">\r\n              <div id=\"csui-search-custom-container\"></div>\r\n            </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<!-- TODO: need to apply localization -->\r\n<div id=\"header\"></div>\r\n<div class=\"binf-container-fluid\">\r\n  <div class=\"csui-facet-table-container\">\r\n    <div class=\"csui-search-left-panel csui-popover-panel csui-is-hidden\">\r\n      <div class=\"csui-popover-panel-container\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCustomSearch : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <div class=\"csui-search-left-panel-content\"  role=\"tabpanel\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCustomSearch : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "          <div id=\"facetview\" class=\"csui-facetview\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"csui-search-results-body binf-col-lg-12 binf-col-md-12 binf-col-xs-12\">\r\n      <div id=\"csui-search-custom-results\">\r\n        <div class=\"csui-search-results-content binf-col-lg-12 binf-col-md-12\">\r\n          <div id=\"facetbarview\"></div>\r\n          <div\r\n              class=\"csui-search-tool-container binf-hidden binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n            <div class='csui-standard-header-view' id=\"csui-standard-header-view\"></div>\r\n          </div>\r\n          <div id=\"results\" tabindex=\"-1\" class=\"csui-result-list binf-col-lg-12 binf-col-md-12\r\n          binf-col-sm-12 binf-col-xs-12\"></div>\r\n          <div class='csui-search-loading-wrapper'>\r\n            <div class='csui-search-loading'>"
    + this.escapeExpression(((helper = (helper = helpers.loadingMessage || (depth0 != null ? depth0.loadingMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"loadingMessage","hash":{}}) : helper)))
    + "</div>\r\n          </div>\r\n          <div\r\n              class=\"csui-search-row-divider binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n        </div>\r\n\r\n        <div id=\"pagination\"\r\n             class=\"binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_widgets_search.results_impl_search.results', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/widgets/search.results/search.results.view',[
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/utils/url',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/search.results/impl/search.results.header.view',
  'csui/widgets/search.results/impl/standard/standard.search.results.view',
  'csui/widgets/search.results/impl/tabular/tabular.search.results.view',
  'csui/controls/table/table.view',
  'csui/controls/table/rows/description/search.description.view',
  'csui/models/widget/search.results/search.metadata/search.columns',
  'csui/models/nodechildrencolumn',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/pagination/nodespagination.view',
  'csui/controls/progressblocker/blocker',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks',
  'csui/widgets/search.custom/impl/search.object.view',
  'csui/utils/contexts/factories/search.settings.factory',
  'csui/controls/globalmessage/globalmessage',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/utils/contexts/factories/search.results.facets.factory',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/utils/commands/properties',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!csui/widgets/search.results/impl/search.results',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'csui/utils/namedlocalstorage',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/facet.bar/facet.bar.view',
  'csui/utils/accessibility',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/search.results/impl/search.results',
  'csui/lib/jquery.mousehover',
  'csui/lib/jquery.redraw'
], function (module, _, $, Backbone, Marionette, base, Url, SearchQueryModelFactory,
    SearchResultsCollectionFactory, LayoutViewEventsPropagationMixin, HeaderView,
    StandardSearchResultsView, TabularSearchResultsView,
    TableView, DescriptionRowView, tableColumns,
    NodeChildrenColumnModel, TableRowSelectionToolbarView, PaginationView,
    BlockingView, toolbarItems, ToolbarItemsMasks,
    SearchObjectView, SearchSettingsFactory,
    GlobalMessage, lang, TableActionBarView, SearchResultFacetCollectionFactory, NodeModel, NodeCollection,
    PropertiesCommand, UserModelFactory, DefaultActionBehavior, SearchMetadataFactory, PerfectScrollingBehavior,
    ToolbarCommandController, layoutTemplate, defaultActionItems,
    commands, NamedLocalStorage, ModalAlert, FacetPanelView, FacetBarView, Accessibility) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable(),
      STANDARD_VIEW = 'StandardView',
      TABULAR_VIEW = 'TabularView';

  var config = _.extend({
    enableFacetFilter: true, // LPAD-60082: Enable/disable facets
    enableBreadcrumb: true,
    enableSearchSettings: true, // global enable/disable search settings, but LPAD 81034 ctor can overrule
    showInlineActionBarOnHover: !accessibleTable,
    forceInlineActionBarOnClick: false,
    inlineActionBarStyle: "csui-table-actionbar-bubble"
  }, module.config());

  var SearchResultsView = Marionette.LayoutView.extend({

    className: 'csui-search-results binf-panel binf-panel-default',
    template: layoutTemplate,
    templateHelpers: function () {
      var messages = {
        customSearchTab: lang.customSearchTab,
        searchFilterTab: lang.searchFilterTab,
        enableCustomSearch: this.enableCustomSearch
      };
      return {
        messages: messages,
        enableCustomSearch: this.enableCustomSearch,
        loadingMessage: lang.loadingSearchResultMessage,
        showFacetPanel: this.options.showFacetPanel !== false
      };
    },

    ui: {
      toolBarContainer: '.csui-search-tool-container',
      customSearchContainer: '.csui-search-results-custom',
      facetView: '#facetview',
      customViewTab: '.csui-search-custom-tab',
      facetViewTab: '.csui-search-facet-tab',
      searchResultsContent: '.csui-search-results-content',
      searchResultsBody: ".csui-search-results-body",
      searchSidePanel: ".csui-search-left-panel",
      loadingEle: '.csui-search-loading-wrapper'
    },

    events: {
      'click @ui.customViewTab': 'openCustomView',
      'click @ui.facetViewTab': 'openFacetView',
      'keypress @ui.customViewTab': 'openCustomView',
      'keypress @ui.facetViewTab': 'openFacetView',
      'mouseup @ui.toggleDetails': 'onToggleOrChangePageSize',
      'keypress @ui.toggleDetails': 'onToggleOrChangePageSize',
      'mouseup .csui-paging-navbar > ul > li:not(.csui-overflow) > a': 'onChangePage',
      'keypress .csui-paging-navbar > ul > li:not(.csui-overflow) > a': 'onChangePage',
      'mouseup .csui-pagesize-menu ul.csui-dropdown-list a': 'onToggleOrChangePageSize',
      'keypress .csui-pagesize-menu ul.csui-dropdown-list a': 'onToggleOrChangePageSize',
      'click': 'stopClosingSearchBox'
    },

    regions: {
      headerRegion: '#header',
      resultsRegion: '#results',
      paginationRegion: '#pagination',
      standardHeaderRegion: '#csui-standard-header-view',
      customSearchRegion: '#csui-search-custom-container',
      facetBarRegion: '#facetbarview',
      facetRegion: '#facetview',
      tableRowSelectionToolbarRegion: '.csui-table-rowselection-toolbar'
    },

    behaviors: {

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-result-list',
        suppressScrollX: true,
        // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    namedLocalStorage: new NamedLocalStorage('PrevSearchDisplayStyle'),

    getPageSize: function() {
      var pageSize = this.namedLocalStorage.get(
          this._createSearchDisplayStyleKey() + '_PrevSRPageSize');
      return pageSize || 10;
    },

    constructor: function SearchResultsView(options) {
      options || (options = {});
      this.context = options.context;
      options.pageSize = this.getPageSize();
      options.data || (options.data = {});

      options.toolbarItems || (options.toolbarItems = toolbarItems);
      options.toolbarItemsMasks || (options.toolbarItemsMasks = new ToolbarItemsMasks());
      this.context = options.context;

      if (!options.query) {
        options.query = this.context.getModel(SearchQueryModelFactory);
      }

      if (options.collection) {
        // If the collection was passed from outside and might be of a limited scope
        if (!options.collection.fetched) {
          // Store the scope to restore later and cancel limiting the scope of the response
          this._originalScope = options.collection.getResourceScope();
        }
      } else {
        options.collection = this.context.getModel(SearchResultsCollectionFactory, options);
      }

      var doLoadSearchSettings = (options.enableSearchSettings !== undefined) ?
                                 options.enableSearchSettings : config.enableSearchSettings;

      if (doLoadSearchSettings) {
        var templateId = options.query ? options.query.get("query_id") : undefined;
        this.loadSearchSettings(templateId);
      }

      if (!options.collection.fetched) {
        // Ask the server to check for permitted actions V2 - only default actions
        options.collection.setResourceScope(
            SearchResultsCollectionFactory.getDefaultResourceScope());
        options.collection.setDefaultActionCommands(
            defaultActionItems.getAllCommandSignatures(commands));
        options.collection.setEnabledDelayRestCommands(true);
        if (options.collection.delayedActions) {
          this.listenTo(options.collection.delayedActions, 'error',
              function (collection, request, options) {
                var error = new base.Error(request);
                GlobalMessage.showMessage('error', error.message);
              });
        }
      }

      options.collection.isSortOptionSelected = true;

      Marionette.LayoutView.prototype.constructor.call(this, options);


      this.collection.selectedItems = new Backbone.Collection();
      this.metadata = options.metadata ||
                      this.context.getCollection(SearchMetadataFactory, options);
      this.query = options.query;

      this.collection.setLimit(0, options.pageSize, false);

      this._toggleCustomSearch();

      this.commandController = new ToolbarCommandController({commands: commands});
      this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
      this.listenTo(this.commandController, 'after:execute:command', this._toolbarCommandExecuted);

      var PrevSearchDisplayStyle = this.namedLocalStorage.get(this._createSearchDisplayStyleKey());
      this.collection.prevSearchDisplayStyle = PrevSearchDisplayStyle || STANDARD_VIEW;

      this.setSearchHeader();
      var self = this;
      this.listenTo(this.headerView, "go:back", function () {
        self.trigger("go:back");
      });

      this.tableColumns = options.tableColumns ? options.tableColumns : tableColumns.deepClone();

      this.listenTo(this.headerView, "toggle:filter", this._completeFilterCommand);

      this.listenTo(this.headerView, "focus:filter", this._focusFilter);

      this.listenTo(this.headerView, "reload:searchForm", this._resetTargetView);

      //TODO: specific to tb.s.r.v
      this.listenTo(this.headerView, "render:table", _.bind(function () {
        this.columns = this.collection.searching && this.collection.searching.sortedColumns;
        this.getAdditionalColumns();
         this.trigger('render:table');
      }, this));

      this.listenTo(this.headerView, 'toggle:description', function (args) {
        this.trigger('toggle:description', args.showDescriptions);
      });
      //TODO:END.


      //TODO:BEGIN: this code should execute after collection sync.
      if (!options.collection.searchFacets) {
        options.collection.searchFacets = this.context.getModel(SearchResultFacetCollectionFactory,
            {
              options: {
                query: this.options.query,
                /* TODO: need make it zero once RESt Api is fixed for error: limit must be a positive integer.*/
                topCount: 1
              },
              detached: true
            });
      }

      this.facetFilters = options.collection.searchFacets;

      //TODO:END: this code should execute after collection sync.

      if (this.enableCustomSearch) {
        this.setCustomSearchView();
        this.listenTo(this.customSearchView, "change:title", this.updateHeaderTitle);
      }

      //TODO: blocking view should come from actual s.r.v.
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      this.listenTo(this.settings, 'sync', _.bind(function () {
        var isLocationColumnAvailable = false,
            selectedSettings          = false;

        if (this.settings &&
            this.settings.get("display")) {
          if (this.settings.get("display").display_regions &&
              this.settings.get("display").display_regions.selected) {
            isLocationColumnAvailable = _.findIndex(
                this.settings.get("display").display_regions.selected.models,
                function (column, index) {
                  return column.get("key") === 'OTLocation';
                });
          }

          selectedSettings = this.settings.get("display").summary_description &&
                             this.settings.get("display").summary_description.selected;

        }
        this.collection.isLocationColumnAvailable = isLocationColumnAvailable > -1;
        this.collection.selectedSettings = selectedSettings;
      }, this));

      this.listenTo(this.collection, 'sync', function () {
        if (!this.enableCustomSearch) {
          this.$el.parents(".search-results-container").addClass("csui-global-search");
        }
      });

      // Refresh the search results whenever the search query changes
      // on the same perspective
      this.listenTo(this.query, 'change', function () {
        if (this.query.get('forcePerspectiveChange')) {
          // Refreshing of current results is not required since query change enforcing perspective change
          return;
        }
        this.collection.isSortOptionSelected = true;
        this._updatePanels();
        if (doLoadSearchSettings) {
          var templateId = this.query ? this.query.get("query_id") : undefined;
          this.loadSearchSettings(templateId);
        }
        if (this.collection.isFetchable()) {
          var fetchFacets = config.csui && config.csui.fetchFacets;
          this.facetFilters.clearFilter(fetchFacets);
          this.facetFilters.fetched = false;
          this.paginationView.nodeChange();
          this.collection.fetch({
            error: _.bind(this.onSearchResultsFailed, this, options)
          });
          this.trigger('query:changed');
          this.resetScrollToTop();
        }
        //reset selected Items
        //confirmation Message
        this.collection.selectedItems.reset([]);
      });

      this.listenTo(this.options.context, 'request', this.blockActions)
          .listenTo(this.options.context, 'sync', this._persistState)
          .listenTo(this.options.context, 'error', this.unblockActions)
          .listenTo(this.collection, "request", this.executePreProcess)
          .listenTo(this.collection, "error", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "new:page", this.resetScrollToTop);

      var prevPageSize = this.namedLocalStorage && this.namedLocalStorage.get(
            this._createSearchDisplayStyleKey() + '_PrevSRPageSize');
      this.options.pageSize = (prevPageSize) ? prevPageSize : 10;

      this.setPagination();

      this.listenTo(this.collection, 'sync', this.executeEndProcess);
      this.listenTo(this, 'target:view:changed', this.executeEndProcess);

      !base.isMozilla() && this.propagateEventsToRegions();
      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).on("resize.app", this.onWinRefresh);
      if (this.enableCustomSearch) {
        this.listenToOnce(this, 'dom:refresh', _.bind(function () {
          if (this.$el.width() > 1023) {
            this.ui.searchSidePanel.addClass('csui-is-visible');
            this.ui.searchResultsBody.addClass('csui-search-results-body-right');
          } else {
            this.ui.searchSidePanel.addClass("search-side-panel-overlay");
            this.ui.searchSidePanel.addClass("search-side-panel-auto");
          }
        }, this));
      }
    },

    executePreProcess: function () {
        if (this.$el.is(':visible')) {
      // Begin: set the loading element's position.
      var completeArea = this.el,
          resultsArea  = completeArea.getElementsByClassName('csui-result-list')[0];
      if (resultsArea.getBoundingClientRect().left !== completeArea.getBoundingClientRect().left) {
        // when there is any side panel opened without overlay, then reduce left for loading ele.
        this.ui.loadingEle.addClass('csui-side-panel-exists');
      }
      // End: set the loading element's position.
      this.ui.loadingEle.removeClass('binf-hidden');
      }
      this.blockActions();
    },

    executeEndProcess: function () {
      if (!this.targetView) {
        this.setTargetView();

        this.paginationRegion.show(this.paginationView);
        this.targetView.trigger('set:inline:actionbar:events');
        this._setFacetBarView();
        if (this.facetBarView && this.options.showFacetPanel !== false) {
          this.facetBarRegion.show(this.facetBarView);
        }
        this.correctFilterAria();
      }

      if (this.collection.length) {
        this.trigger('render:metadata');
        this.columns = this.collection.searching && this.collection.searching.sortedColumns;
        this.getAdditionalColumns();
        this.targetView.trigger('set:tablerow:assets');
        if(!!this.collection.settings_changed && this.collection.prevSearchDisplayStyle === 'TabularView') {
          // render only when column settings change
          this.trigger('render:table');
          this.collection.settings_changed = false;
        }
      }

      this.updateActionToolBar();
      this.updateScrollbar();
      this.unblockSearchResultsActions();
    },

    unblockSearchResultsActions: function () {
      this.ui.loadingEle.removeClass('csui-side-panel-exists');
      this.ui.loadingEle.addClass('binf-hidden');
      this.unblockActions();
    },

    collectionEvents: {'reset': 'updateLayoutView'},

    updateLayoutView: function () {
      //while loading search url directly - page size is set to local storage page size
      var prevPageSize = this.namedLocalStorage && this.namedLocalStorage.get(
              this._createSearchDisplayStyleKey() + '_PrevSRPageSize');
      prevPageSize = (prevPageSize) ? prevPageSize : 10;
      this.paginationView.options.pageSize = prevPageSize;
      this.paginationView.selectedPageSize = prevPageSize;
    },

    stopClosingSearchBox: function (event) {
      // return in case of binf-dropdown as it is bind at document level
      // and on click of arrow_back icon
      if ($(event.target).closest('.binf-dropdown').length
          || $(event.target).hasClass('binf-dropdown')
          || $(event.target).hasClass('arrow_back')) {
        return;
      }
      // preventing global search icon to close
      event.stopPropagation();
    },

    setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: [10, 25, 50, 100] // LPAD-48290, to make consistent with classic console
      });

      this.listenTo(this.paginationView, 'pagesize:updated', function (paginationView) {
        this.paginationView.pageSize = paginationView.pageSize;
        this.namedLocalStorage.set(this._createSearchDisplayStyleKey() + '_PrevSRPageSize',
            this.paginationView.pageSize);
      });
      return true;
    },

    onToggleOrChangePageSize: function (event) {
      if ((event.type === 'keypress' && (event.keyCode === 13 || event.keyCode === 32)) ||
          (event.type === 'mouseup')) {
        this.collection.isSortOptionSelected = true;
      }
    },

    onChangePage: function (event) {
      var targetPageTab = $(event.currentTarget),
          pageNum       = parseInt(targetPageTab.attr('data-pageid'), 10);
      if (pageNum + 1 !== this.paginationView.currentPageNum) {
        this.onToggleOrChangePageSize(event);
      }
    },

    //TODO: remove _persistState function.
    _persistState: function () {
      this.unblockActions();
    },

    loadSearchSettings: function (templateId) {
      this.options.templateId = templateId;
      if (this.settings && this.settings.options) {
        this.settings.options.templateId = templateId;
      }
      this.settings = this.options.settings ||
                      this.context.getCollection(SearchSettingsFactory, this.options);
      this.settings.fetch();
    },

    _createSearchDisplayStyleKey: function () {

      var context = this.context || (this.options && this.options.context),
          srcUrl  = new Url().getAbsolute(),
          userID  = context && context.getModel(UserModelFactory).get('id'), hostname;
      if (srcUrl) {
        hostname = srcUrl.split('//')[1].split('/')[0].split(':')[0];
      }

      return hostname + userID;

    },

    setTargetView: function() {
      this.columns = this.collection.searching && this.collection.searching.sortedColumns;
      if (accessibleTable) {
        this.getAdditionalColumns();
      }
      this.collection.columns = (this.columns) ? this.columns : this.tableColumns;
      if (this.settings && this.settings.get('display')) {
        var selectedSummary = this.settings.get('display').summary_description.selected;
        this.showSummaryOnly = (selectedSummary === 'SO') ? true : false;
      }

      var currentTemplate = this.collection.prevSearchDisplayStyle;

      if (currentTemplate === TABULAR_VIEW) {
        this.ui.toolBarContainer.addClass('binf-hidden');
        this.targetView = this.setTabularSearchView();
        this.targetView.trigger('set:tablerow:assets');
      } else {
        this.ui.toolBarContainer.removeClass('binf-hidden');
        this.targetView = this.setStandardSearchView();
      }

      this.resultsRegion.show(this.targetView, this);
      if (currentTemplate === STANDARD_VIEW) {
        this.standardHeaderRegion.show(this.targetView.standardHeaderView);
        this.targetView.standardHeaderView._removeAllSelections();
      } else {
        this.trigger('toggle:description', this.headerView.showDescription);
      }

    },

    _resetTargetView: function() {
      // BEGIN: destroy existing target view and empty the region.
      this.targetView.trigger('destroy:header:view');
      this.targetView.destroy();
      this.targetView = undefined;
      this.resultsRegion.empty();
      // END: destroy existing target view and empty the region.

      this.setTargetView();
      this.executeEndProcess();
      this.resetScrollToTop();
    },



    setStandardSearchView: function() {
      var args = _.extend(this.options, {
        collection: this.collection,
        originatingView: this,
        headerEle: this.ui.toolBarContainer,
        context: this.context,
        metadata: this.metadata
      });
      return new StandardSearchResultsView(args);
    },

    setTabularSearchView: function() {
      var args = _.extend(this.options, {
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.tableColumns,
        originatingView: this,
        container: this.container,
        defaultActionController: this.defaultActionController,
        config: config,
        customLabels: {
          emptyTableText: lang.noSearchResultMessage
        }
      });
      return new TabularSearchResultsView(args);
    },



    _focusFilter: function (view) {
      !!view && view.headerView.ui.filter.trigger('focus');
      this.correctFilterAria(view);
      var tabElements = this.facetView && this.facetView.$('.csui-facet');
      if (tabElements && tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
    },
    // adapt title, icon, aria-expanded and aria-label
    correctFilterAria: function (view) {
      if (!!view && !!view.headerView) {
        if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
          view.headerView.ui.filter
              .attr("title", lang.filterCollapseTooltip)
              .addClass('icon-toolbarFilterCollapse')
              .attr("aria-label", lang.filterCollapseAria);
        } else {
          view.headerView.ui.filter
              .attr("title", lang.filterExpandTooltip)
              .removeClass('icon-toolbarFilterCollapse')
              .attr("aria-label", lang.filterExpandAria);
        }
      }
    },
    onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      ModalAlert.showError(error.toString());
    },
    updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    },

    resetScrollToTop: function () {
      var scrollContainer = this.$('#results');
      scrollContainer.scrollTop(0);
      // if needed: triggerMethod(this, "update:scrollbar");
    },

    updateActionToolBar: function () {
      if (this.collection.length === 0) {
        this.ui.toolBarContainer.addClass('binf-hidden');
        if (!this.enableCustomSearch) {
          this.ui.customSearchContainer.addClass('binf-hidden');
        }
      } else if (this.collection.prevSearchDisplayStyle === "StandardView") {
        this.ui.toolBarContainer.removeClass('binf-hidden');
        this.ui.customSearchContainer.removeClass('binf-hidden');
      }
    },

    openVersionHistory: function (args) {
      var nodes = new NodeCollection();
      nodes.push(args.model);
      var status = {
        nodes: nodes,
        container: args.model.collection.node,
        collection: args.model.collection,
        selectedTab: new Backbone.Model({title: 'Versions'})
      };
      status = _.extend(status, {originatingView: this});
      // view properties of an existing item
      var propertiesCmd = new PropertiesCommand();
      propertiesCmd.execute(status, this.options)
          .always(function (args) {
            //self.cancel();
          });
    },

    onPropertiesViewDestroyed: function () {
      this.onMetadataNavigationViewDestroyed();
      var showDescription = this.namedLocalStorage.get(
          this._createSearchDisplayStyleKey() + '_showDescription');
      if (this.collection.prevSearchDisplayStyle === TABULAR_VIEW) {
        this.headerView.updateToggleDescription();
        this.tableView && this.tableView.render();
      }
      this.paginationView && this.paginationView.collectionChange();
    },

    onPermissionViewDestroyed: function () {
      this.onPropertiesViewDestroyed();
    },

    onMetadataNavigationViewDestroyed: function () {
      if (!!this.collection.inMetadataNavigationView && this.isTabularView) {
        this.collection.inMetadataNavigationView = false;
      }
    },

    _toggleCustomSearch: function () {
      this.enableCustomSearch = !!this.options.customSearchViewModel ||
                                !!this.options.customSearchView || this.query.get("query_id") &&
                                                                   Object.keys(
                                                                       this.query.attributes).length >
                                                                   1;
      if (this.enableCustomSearch) {
        this.$el.find("#csui-search-custom-container").addClass('csui-search-custom-container');
        this.$el.find("#csui-search-custom-results").addClass("csui-search-custom-results");
        this.$el.find(".csui-search-custom-tab").addClass('binf-active');
        this.$el.find(".csui-search-custom-tab > a").attr('aria-selected', 'true');
      } else {
        if (this.customSearchView && this.query.get("where")) {
          this.customSearchRegion.empty();
          this.$el.find("#csui-search-custom-container").removeClass(
              'csui-search-custom-container');
          this.$el.find("#csui-search-custom-results").removeClass("csui-search-custom-results");
        }
      }
    },

    _updatePanels: function () {
      this._toggleCustomSearch();
      if (!this.enableCustomSearch) {
        if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
          var view = this;
          this.ui.searchSidePanel.one(this._transitionEnd(),
              function () {
                view.$el.find(".csui-search-results-custom").addClass('binf-hidden');
                view.$el.find(".csui-search-left-panel-tabs").addClass('binf-hidden');
                if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchSidePanel.addClass('csui-is-hidden');
                }
                view.ui.facetView.removeClass('binf-hidden');
              });
          this.ui.searchResultsBody.removeClass("csui-search-results-body-right");
          this.ui.searchSidePanel.removeClass("csui-is-visible");
        } else {
          this.$el.find(".csui-search-results-custom").addClass('binf-hidden');
          this.$el.find(".csui-search-left-panel-tabs").addClass('binf-hidden');
          this.ui.facetView.removeClass('binf-hidden');
        }
      } else {
        this.$el.find(".csui-search-results-custom").removeClass('binf-hidden');
        this.$el.find(".csui-search-left-panel-tabs").removeClass('binf-hidden');
        this.ui.searchResultsBody.addClass("csui-search-results-body-right");
      }
      if (this.headerView) {
        this.headerView.options.useCustomTitle = this.enableCustomSearch;
      }
      if (this.facetView) {
        this.facetView.options.data.showTitle = !this.enableCustomSearch;
        //re-render facetView to show title
        this.facetView.render();
      }
    },

    openCustomView: function (e) {
      //Show custom search panel, hide search facet
      if (this.enableCustomSearch) {
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.ui.facetView.addClass('binf-hidden');
          this.$el.find(".csui-search-results-custom").removeClass('binf-hidden');
          this.$el.find(".csui-search-facet-tab").removeClass('binf-active');
          this.$el.find(".csui-search-facet-tab > a").removeAttr('aria-selected');
          this.$el.find(".csui-search-custom-tab").addClass('binf-active');
          this.$el.find(".csui-search-custom-tab > a").attr('aria-selected', 'true');
          e.stopPropagation();
        }
      }
    },

    openFacetView: function (e) {
      //Show search facet panel, hide custom search panel
      if (this.enableCustomSearch) {
        this.facetFilters.ensureFetched();
        this._ensureFacetPanelViewDisplayed();
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.$el.find(".csui-search-results-custom").addClass('binf-hidden');
          this.ui.facetView.removeClass('binf-hidden');
          this.$el.find(".csui-search-custom-tab").removeClass('binf-active');
          this.$el.find(".csui-search-custom-tab > a").removeAttr('aria-selected');
          this.$el.find(".csui-search-facet-tab").addClass('binf-active');
          this.$el.find(".csui-search-facet-tab > a").attr('aria-selected', 'true');
          e.stopPropagation();
          this.facetView.triggerMethod('dom:refresh');
        }
      }
    },

    onDestroy: function () {
      $(window).off("resize.app", this.onWinRefresh);
      // If the collection was passed from outside and might be of a limited scope
      if (this._originalScope) {
        // Restore the scope of the response
        this.options.collection.setResourceScope(this._originalScope);
      }
      this.tableView && this.tableView.destroy();
    },

    // bubble to regions
    //Dom refresh currently only needed for the Pagination view. When a refresh is called
    //on the searchresultview, it causes the results to constantly expand its length without cause.
    windowRefresh: function () {
      // Window resizing can be triggered between the constructor and rendering;
      // sub-views of this view are not created before the min view is rendered
      this.facetView && this.facetView.triggerMethod('dom:refresh');
      this.targetView && this.targetView.triggerMethod('dom:refresh');
      var panelPosition = this.ui.searchSidePanel.css("position");
      if (panelPosition != "absolute") {
        if (this.$el.width() > 1023 &&
            this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
          //Entered from width <1024 to width >1024
          this.ui.searchSidePanel.removeClass("search-side-panel-overlay");
          if (this.ui.searchSidePanel.hasClass("search-side-panel-auto")) {
            //open search facet
            this.ui.searchSidePanel.removeClass("search-side-panel-auto");
            this._completeFilterCommand(this, true);
          }
        }
      } else if (!this.ui.searchSidePanel.hasClass("search-side-panel-auto") &&
                 !this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
        //Entered from width >1024 to width <1024
        this.ui.searchSidePanel.addClass("search-side-panel-overlay");
        if (this.ui.searchSidePanel.hasClass("csui-is-visible")) {
          //should be opened automatically once width >1024
          this.ui.searchSidePanel.addClass("search-side-panel-auto");
          //close search facet
          this._completeFilterCommand(this, true);
        }
      }
    },

    setSearchHeader: function () {
      var showSearchSettingsButton = (this.options.enableSearchSettings !== undefined) ?
                                     this.options.enableSearchSettings :
                                     config.enableSearchSettings;
      this.headerView = new HeaderView({
        collection: this.collection,
        filter: this.options.searchString,
        context: this.options.context,
        enableBackButton: this.options.enableBackButton,
        backButtonToolTip: this.options.backButtonToolTip,
        enableFacetFilter: config.enableFacetFilter, // LPAD-60082: Enable/disable facets
        useCustomTitle: this.enableCustomSearch,
        commands: commands,
        originatingView: this,
        titleView: this.options.titleView,
        localStorage: this.namedLocalStorage,
        enableSearchSettings: showSearchSettingsButton,
        settings: !!this.settings ? this.settings : false
      });
      return true;
    },

    //setStandardSearchHeaderView: function () {
    //  this.standardHeaderView = new StandardSearchResultsHeaderView({
    //    collection: this.collection,
    //    view: this.resultsView,
    //    options: this.options,
    //    selectedItems: this.collection.selectedItems
    //  });
    //  return true;
    //},


    getSettings: function() {
      return this.settings;
    },

    setCustomSearchView: function () {
      this.customSearchView = this.options.customSearchView || new SearchObjectView({
            context: this.options.context,
            savedSearchQueryId: this.query.get("query_id"),
            customValues: this.query,
            parentView: this,
            query: this.query,
            model: this.options.customSearchViewModel
          });
      return true;
    },

    getAdditionalColumns: function () {
      if (accessibleTable) {
        var selectedSettings = this.headerView && this.headerView.selectedSettings;
        selectedSettings = (selectedSettings) ? selectedSettings :
                           this.settings && this.settings.get(
                               'display').summary_description.selected;
        switch (selectedSettings) {
        case 'SD' :
        case 'SP' :
        case 'DP' :
        {
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'description'}) ||
              !this.columns.findWhere({column_key: 'description'})) {
            this.getDescriptionColumn();
          }
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'summary'}) ||
              !this.columns.findWhere({column_key: 'summary'})) {
            this.getSummaryColumn();
          }
          break;
        }
        case 'SO' :
        {
          this.removeDescriptionColumn();
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'summary'}) ||
              !this.columns.findWhere({column_key: 'summary'})) {
            this.getSummaryColumn();
          }
          break;
        }
        case 'DO' :
        {
          this.removeSummaryColumn();
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'description'}) ||
              !this.columns.findWhere({column_key: 'description'})) {
            this.getDescriptionColumn();
          }
          break;
        }
        case 'NONE' :
        {
          this.removeSummaryColumn();
          this.removeDescriptionColumn();
        }
        }
      }
    },

    getDescriptionColumn: function () {
      this.columns.push(new NodeChildrenColumnModel({
        column_key: 'description',
        name: lang.descriptionColumnTitle,
        sortable: false,
        permanentColumn: true,
        type: -1,
        definitions_order: 505
      }));
    },

    getSummaryColumn: function () {
      this.columns.push(new NodeChildrenColumnModel({
        column_key: 'summary',
        name: lang.summaryColumnTitle,
        sortable: false,
        permanentColumn: true,
        type: -1,
        definitions_order: 506
      }));
    },

    removeDescriptionColumn: function () {
      if (this.tableView && this.tableView.columns.findWhere({column_key: 'description'})) {
        this.tableView.columns.findWhere({column_key: 'description'}).destroy();
      }
    },

    removeSummaryColumn: function () {
      if (this.tableView && this.tableView.columns.findWhere({column_key: 'summary'})) {
        this.tableView.columns.findWhere({column_key: 'summary'}).destroy();
      }
    },

    _beforeExecuteCommand: function (args) {
      // before executing action, keep the collection properties (like, commands, expands, etc.)
      !!this.collection.selectedItems && this.collection.selectedItems.each(function (model) {
        model.collection = args.status.collection;
      });
      if (args.command && args.command.get('selfBlockOnly')) {
        args.status && args.status.toolItemView
        && args.status.toolItemView.$el.find('a').addClass('binf-disabled');
      }
    },

    // controller for the toolbar actions
    _toolbarCommandExecuted: function (context) {
      if (context && context.commandSignature) {

        this.targetView && this.targetView.trigger('update:tool:items');

        // reducing performance to somewhat extent,
        // such that collection will be refetched if it meets the following conditions:
        // 1) if the current command allows to refetch from it's own implementation
        // 2) if the total count is > current page size.
        if (!!context.command && !!context.command.allowCollectionRefetch &&
            this.collection.totalCount > this.collection.topCount) {
          this.collection.fetch();
        }
        if ((context.commandSignature === "Delete" || context.commandSignature === "Move") &&
            (this.collection.models.length === 0 || this.collection.totalCount < this.collection.topCount)) {
          if(context.commandSignature === "Move") {
            this.collection.selectedItems.remove(this.collection.selectedItems.models);
          }
          this.collection.trigger('sync');
        }
      }
    },

    _updateToolbarActions: function () {
      this.targetView && this.targetView.trigger('set:tablerow:assets');
    },

    _showInlineActionBar: function (args) {
      if (!!args) {
        this._savedHoverEnterArgs = null;

        var parentId = args.node.get('parent_id');
        if (parentId instanceof Object) {
          parentId = args.node.get('parent_id').id;
        }
        var parentNode = new NodeModel({id: parentId},
            {connector: args.node.connector});

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              delayedActions: this.collection.delayedActions,
              collection: this.options.toolbarItems.inlineToolbar || [],
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              container: parentNode,
              containerCollection: this.collection,
              model: args.node,
              originatingView: this,
              notOccupiedSpace: 0
            }, this.options.toolbarItems.inlineToolbar &&
               this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'after:execute:command',
            this._toolbarCommandExecuted);
        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this._showInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    _showInlineActionBarWithDelay: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        //if (!self.targetView.lockedForOtherContols) {
          // don't show the action bar control if the searchresult view is locked because a different
          // control is already open
          self._showInlineActionBar.call(self, args);
        //}
      }, 200);
    },

    _actionBarShouldDestroy: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        //this.inlineToolbarView.updateForSelectedChildren(args.node);
        this.inlineToolbarView.destroy();
      }
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    onRender: function () {
      var self = this;
      this.headerRegion.show(this.headerView);



      if (this.enableCustomSearch) {
        this.customSearchRegion.show(this.customSearchView);
      }
      if (this.enableCustomSearch) {
        this.ui.facetView.addClass('binf-hidden');
        this.ui.searchSidePanel.removeClass('csui-is-hidden');
      } else {
        this.ui.searchSidePanel.removeClass('csui-is-visible');
        var view = this;
        this.ui.searchSidePanel.one(this._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
            });
      }
      this._toggleCustomSearch();

      // perfect scrollbar stops 'scroll' event propagation, trigger it for elements to listen to
      this.$('.csui-result-list').on('scroll', function () {
        self.trigger('scroll');
      });
    },

    _ensureFacetPanelViewDisplayed: function () {
      if (this.facetView === undefined && this.options.showFacetPanel !== false) {
        this._setFacetPanelView();
        this.facetRegion.show(this.facetView);
      }
    },

    _setFacetPanelView: function () {
      this.facetView = new FacetPanelView({
        collection: this.facetFilters,
        blockingLocal: true,
        showTitle: !this.enableCustomSearch
      });
      this.listenTo(this.facetView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetView, 'remove:all', this._removeAll)
          .listenTo(this.facetView, 'apply:filter', this._checkSelectionAndApplyFilter);
    },

    _removeFacetPanelView: function () {
      this.facetRegion.empty();
      this.facetView = undefined;
    },

    _setFacetBarView: function () {
      this.facetBarView = new FacetBarView({
        collection: this.facetFilters
      });
      this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetBarView, 'remove:all', this._removeAll)
          .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
          .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
    },

    _checkSelectionAndApplyFilter: function (filter) {
      if (this.collection.selectedItems.length) {
        ModalAlert.confirmQuestion(
            _.str.sformat(lang.dialogTemplate, lang.dialogTitle), lang.dialogTitle, {})
            .done(_.bind(function () {
              this.collection.selectedItems.reset([]);
              this._addToFacetFilter(filter);
            }, this));
      }
      else {
        this._addToFacetFilter(filter);
      }
    },

    _addToFacetFilter: function (filter) {
      // Update filters, but avoid fecet fetch as fecets will be fetched with search collection
      this.facetFilters.addFilter(filter, false);
      this.collection.setDefaultPageNum();
      this.collection.fetch({fetchFacets: true});
      this.resetScrollToTop();
    },

    _removeFacetFilter: function (filter) {
      // Update filters, but avoid fecet fetch as fecets will be fetched with search collection
      this.facetFilters.removeFilter(filter, false);
      this.collection.setDefaultPageNum();
      this.collection.fetch({fetchFacets: true});
      this.resetScrollToTop();
    },

    _removeAll: function () {
      // Update filters, but avoid fecet fetch as fecets will be fetched with search collection
      this.facetFilters.clearFilter(false);
      this.collection.setDefaultPageNum();
      this.collection.fetch({fetchFacets: true});
      this.resetScrollToTop();
    },

    _completeFilterCommand: function (view, flag) {
      var panelPosition = view.ui.searchSidePanel.css("position"),
          self          = this;
      if (panelPosition === "absolute" && flag === undefined) {
        view.ui.searchSidePanel.removeClass("search-side-panel-auto");
        view.ui.searchSidePanel.addClass("search-side-panel-overlay");
      }
      view.showSidePanel = !view.ui.searchSidePanel.hasClass("csui-is-visible");
      if (view.showSidePanel) {
        view.facetFilters.ensureFetched();
        view._ensureFacetPanelViewDisplayed();
        view.ui.searchSidePanel.removeClass('csui-is-hidden');
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (base.isMSBrowser()) {
                if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchResultsBody.addClass('csui-search-results-body-right');
                }
              }
              view.triggerMethod('dom:refresh');
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
              self.targetView && self.targetView.triggerMethod("dom:refresh");
              view.facetView.triggerMethod('dom:refresh');
              self.targetView.trigger('facet:opened', true);
            }).addClass('csui-is-visible');
        if (!base.isMSBrowser()) {
          if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
            view.ui.searchResultsBody.addClass('csui-search-results-body-right');
          }
        }
      } else {
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
              view.triggerMethod('dom:refresh');
              view._removeFacetPanelView();
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
              self.targetView && self.targetView.triggerMethod("dom:refresh");
              self.headerView.currentlyFocusedElement();
              self.headerView.trigger('focus:filter', self);
              self.targetView.trigger('facet:opened', false);
            }).removeClass('csui-is-visible');
        view.ui.searchResultsBody.removeClass('csui-search-results-body-right');
      }
      this.facetView && this.facetView.triggerMethod('dom:refresh');
      this.listenTo(this.facetView, 'dom:refresh', function () {
        this.headerView.currentlyFocusedElement();
        this.headerView.trigger('focus:filter', this);
      });
    },
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    updateHeaderTitle: function () {
      this.headerView.setCustomSearchTitle(this.options.title);
    },

    _handleFacetBarVisible: function () {
      this.ui.searchResultsContent.addClass('csui-facetbarviewOpened');
      this.ui.searchResultsContent.find(".csui-facet-list-bar .csui-facet-item:last a").trigger(
          'focus');
    },

    _handleFacetBarHidden: function () {
      this.ui.searchResultsContent.removeClass('csui-facetbarviewOpened');
      this.headerView.trigger("refresh:tabindexes");
    }
  }, {
    RowStatesSelectedRows: 'selected'
  });

  _.extend(SearchResultsView.prototype, LayoutViewEventsPropagationMixin);

  return SearchResultsView;
});

csui.define('json!csui/widgets/search.custom/search.custom.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "tile",
  "schema": {
    "type": "object",
    "properties": {
      "savedSearchQueryId": {
        "title": "{{savedSearchQueryTitle}}",
        "description": "{{savedSearchQueryDescription}}",
        "type": "string"
      }
    },
    "required": [
      "savedSearchQueryId"
    ]
  },
  "options": {
    "fields": {
      "savedSearchQueryId": {
        "type": "otcs_node_picker",
        "type_control": {
          "parameters": {
            "select_types": [258]
          }
        }
      }
    }
  }
}
);


csui.define('json!csui/widgets/search.results/search.results.manifest.json',{
  "$schema": "http://opentext.com/cs/json-schema/draft-04/schema#",
  "title": "{{widgetTitle}}",
  "description": "{{widgetDescription}}",
  "kind": "fullpage",
  "schema": {},
  "options": {},
  "actions": [
    {
      "toolItems": "csui/widgets/search.results/toolbaritems",
      "toolItemMasks": "csui/widgets/search.results/toolbaritems.masks",
      "toolbars": [
        {
          "id": "otherToolbar",
          "title": "{{otherToolbarTitle}}",
          "description": "{{otherToolbarDescription}}"
        },
        {
          "id": "inlineToolbar",
          "title": "{{inlineToolbarTitle}}",
          "description": "{{inlineToolbarDescription}}"
        }
      ]
    }
  ]
}
);

csui.define('csui/widgets/search.custom/impl/nls/search.custom.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.custom/impl/nls/root/search.custom.manifest',{
  "widgetTitle": "Custom View Search",
  "widgetDescription": "Shows custom view search form for the given saved search query.",
  "savedSearchQueryTitle": "Search query",
  "savedSearchQueryDescription": "An existing saved search query object"
});


csui.define('csui/widgets/search.results/impl/nls/search.results.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/search.results/impl/nls/root/search.results.manifest',{
  "widgetTitle": "Search Results",
  "widgetDescription": "Shows objects found by a full-text search query and offers the most important actions for them.",
  "otherToolbarTitle": "List Header Toolbar",
  "otherToolbarDescription": "Toolbar, which is activated in the list header, once a list item is selected.",
  "inlineToolbarTitle": "Inline Toolbar",
  "inlineToolbarDescription": "Toolbar, which is displayed on the right side of a list item, when the mouse cursor is moving above it."
});


csui.define('bundles/csui-search',[
  // Models
  'csui/models/widget/search.results/facet.server.adaptor.mixin',
  'csui/models/widget/search.results/search.facets',
  'csui/models/widget/search.results/object.to.model',

  // Application widgets
  'csui/widgets/search.custom/search.custom.view',
  'csui/widgets/search.custom/impl/search.object.view',
  'csui/widgets/search.custom/impl/search.customquery.factory',
  'csui/widgets/search.results/search.results.view',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/impl/toolbaritems',

  // Application widgets manifests
  'json!csui/widgets/search.custom/search.custom.manifest.json',
  'json!csui/widgets/search.results/search.results.manifest.json',
  'i18n!csui/widgets/search.custom/impl/nls/search.custom.manifest',
  'i18n!csui/widgets/search.results/impl/nls/search.results.manifest',

  // Tool items and tool item masks
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks'
], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-search', true);
});

