/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
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
