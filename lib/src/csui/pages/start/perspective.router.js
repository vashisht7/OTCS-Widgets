/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/pages/start/impl/location',
  'csui/utils/url'
], function (Backbone, $, _, ApplicationScopeModelFactory, location, Url) {
  'use strict';

  var activeRouter, previousRouter;

  var PerspectiveRouter = Backbone.Router.extend({
    constructor: function PerspectiveRouter(options) {
      Backbone.Router.prototype.constructor.apply(this, arguments);
      this.context = options.context;
      this._routeWithSlashes = options.routeWithSlashes;

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this, 'other:route', this.onOtherRoute);
    },

    execute: function (callback, args) {
      this.trigger('before:route', this);
      this._restoreUrlParamsFromViewState();
      return Backbone.Router.prototype.execute.apply(this, arguments);
    },

    _restoreUrlParamsFromViewState: function () {
      if (!this.urlParams || this.urlParams.length === 0) {
        var viewStateModel = this.context.viewStateModel;
        var urlParams = viewStateModel.get(viewStateModel.CONSTANTS.URL_PARAMS);
        urlParams && _.isString(urlParams) && (urlParams = JSON.parse(urlParams)) && (this.urlParams = urlParams.slice());
      }
    },

    getUrlParametersList: function() {
      return this.urlParams;
    },

    addUrlParameters: function(urlParameters) {
      var urlParams = this.getUrlParametersList() || [];
      this.urlParams = _.unique(urlParams.concat(urlParameters));

      var viewStateModel = this.context.viewStateModel;
      viewStateModel.set(viewStateModel.CONSTANTS.URL_PARAMS, this.urlParams);
      this._clearViewStateModel(this.urlParams);
    } ,

    _clearViewStateModel: function (keys) {
      var viewStateModel = this.context.viewStateModel,
          modified;
      var state = viewStateModel.get('state');
      _.keys(state).forEach(function (key) {
        if (keys.indexOf(key) === -1) {
          delete state[key];
          modified = true;
        }
      });
      if (modified) {
        viewStateModel.unset('state', {silent: true});
        viewStateModel.set('state', state);
      }
    },

    getActiveRouter : function() {
      return activeRouter;
    },

    getPreviousRouter : function() {
      return previousRouter;
    },

    onViewStateChanged:function() {
    },

    getInitialViewState: function () {
      return {};
    },

    activate: function (setDefault) {
      if (activeRouter !== this) {
        previousRouter = activeRouter;
        activeRouter = this;
        var urlParams = this.getUrlParametersList();
        if (previousRouter && !this.restoring && urlParams && urlParams.length > 0) {
          urlParams.length = 0;
        }
        
        this._activeRouterChanged();
      }

      var viewStateModel = this.context.viewStateModel;

      viewStateModel.set('enabled', this.isViewStateModelSupported());
      if (setDefault) {
        this._initializeViewState();
      }
    },

    _initializeViewState:function() {
      var viewStateModel = this.context.viewStateModel;
      var state = viewStateModel.get('state');
      if (state && _.keys(state).length === 0) {
        viewStateModel.unset('state', {silent: true});
      }
      viewStateModel.set('state', this.getInitialViewState(), {silent: true});
    },

    _activeRouterChanged: function () {
      var viewStateModel = this.context.viewStateModel;

      if (activeRouter === this) {
        viewStateModel.set('activeRouterInstance', this);
        this.listenTo(viewStateModel, 'change:state', this.onViewStateChanged);
        if (previousRouter) {
          previousRouter.stopListening(viewStateModel, 'change:state', previousRouter.onViewStateChanged);
        }
      } 
    },
    buildUrlParams: function () {
      var urlParams = this.urlParams,
          context = this.context,
          viewStateModel = context && context.viewStateModel,
          viewState = viewStateModel && viewStateModel.get('state'),
          defaultViewState = viewStateModel.get('default_state');
      var paramsArray = [];

      var initialUrlParams = viewStateModel && viewStateModel.get('initialUrlParams');
      if (initialUrlParams && initialUrlParams.length) {
        paramsArray = paramsArray.concat(initialUrlParams);
        paramsArray.forEach(function (entry) {
          viewState[entry.name] = entry.value;
          urlParams = urlParams || [];
          urlParams.push(entry.name);
        });
      }

      if (urlParams && viewState) {
        urlParams.forEach(function (param) {
          var value        = viewState[param],
              defaultValue = defaultViewState && defaultViewState[param];
          if (value && value !== defaultValue) {
            this._addToParamsArray(paramsArray, {
              name: param,
              value: value
            });
          }
        }.bind(this));
      }

      paramsArray = paramsArray || [];
      _.keys(viewState).forEach(function (key) {
        if (paramsArray.indexOf(key) !== -1) {
          if (defaultViewState && defaultViewState[key] === viewState[key]) {
            return true;
          }
          this._addToParamsArray(paramsArray, {
            name: key,
            value: viewState[key]
          });
        }

      }.bind(this));

      return $.param(paramsArray);
    },

    _addToParamsArray: function(paramsArray, object) {
        if (object && object.name) {
          var found = false;
          paramsArray.some(function(entry) {
            if (entry.name === object.name) {
              found = true;
              return true;
            }
          });
          if (!found) {
            paramsArray.push(object);
            return true;
          }
        }
    },

    restore: function (routerInfo) {

      var viewStateModel = this.context.viewStateModel,
          fragment       = routerInfo.fragment,
          applicationScopeId = routerInfo.scopeId;

      if (viewStateModel) {
        this.restoring = true;
        viewStateModel.set(viewStateModel.CONSTANTS.URL_PARAMS, routerInfo.urlParam);
        if (viewStateModel.get(viewStateModel.CONSTANTS.CURRENT_ROUTER) ===
            viewStateModel.get(viewStateModel.CONSTANTS.LAST_ROUTER)) {
          this.applicationScope.set('id', '');
        } else {
          if (viewStateModel.get('enabled')) {
            applicationScopeId ? this.applicationScope.set('id', applicationScopeId ) :
            this.applicationScope.set('id', '');
          } else {
            fragment && Backbone.Router.prototype.navigate.call(this, fragment, {trigger: true});
          }
        }
      } else {
        window.history.back();
      }

    },

    initSessionViewState: function () {
      var viewStateModel = this.context && this.context.viewStateModel;
      viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.SESSION_STATE, {});
    },

    initDefaultViewState: function () {
      if (!this.restoring) {
        var viewStateModel = this.context && this.context.viewStateModel;
        viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.DEFAULT_STATE, {});
      }
    },

    getUrlParamsNotInFragment: function (fragment) {
      var notInFragment = [],
          inUrl = _.keys(Url.urlParams(fragment));
      var allRoutersUrlParams = this.getUrlParametersList();
      allRoutersUrlParams && allRoutersUrlParams.forEach(function (param) {
        if (inUrl.indexOf(param) === -1) {
          notInFragment.push(param);
        }
      });
      return notInFragment;
    },

    initViewStateFromUrlParams: function (query_string, silent) {
      var viewState,
          viewStateModel = this.context && this.context.viewStateModel;

      if (_.isString(query_string)) {
        var urlParams = this.getUrlParametersList();
        if (!urlParams) {
          viewState = $.parseParams(query_string);
        } else {
          viewState = _.pick($.parseParams(query_string), this.getUrlParametersList());
        }
        var defaultViewState = this.context.viewStateModel.get('default_state');
        if (defaultViewState) {
          var original = {};
          _.extend(original, viewState);
          _.extend(viewState, defaultViewState);
          _.extend(viewState, original);
        }
      } else {
        viewState = query_string;
      }

      viewStateModel &&
      viewStateModel.unset('state', {silent: true}) &&
      viewStateModel.set('state', viewState, {silent: silent});
    },

    isViewStateModelSupported: function() {
      return false;
    },

    navigate: function (fragment, options) {

      var params = this.buildUrlParams(),
          originalFragment = fragment;
          
      if (params) {
        fragment += '?' + params;
      }

      if (this !== activeRouter) {
        this.activate(true);
      }

      this.trigger('before:route', this);
      if (this._routeWithSlashes) {
        var excludeUrlParams = previousRouter ? previousRouter.getUrlParametersList() : [];
        excludeUrlParams = excludeUrlParams || [];
        var urlParamsNotInfragment = this.getUrlParamsNotInFragment(fragment);
        if (urlParamsNotInfragment) {
          excludeUrlParams = excludeUrlParams.concat(urlParamsNotInfragment);
        }
        fragment = Url.appendQuery(fragment, Url.mergeUrlParams(fragment, location.search, excludeUrlParams));
        fragment += location.hash;
      }

      var viewStateModel = this.context.viewStateModel,
          ViewStateConstants = viewStateModel.CONSTANTS,
          viewStateCurrentRouter = viewStateModel.get(ViewStateConstants.CURRENT_ROUTER);

      if (this.name !== viewStateCurrentRouter) {
        var newRouterInfo = {
          'router': this.name,
          'fragment': originalFragment,
          'scopeId': this.applicationScope,
          'navigateOptions': options,
          'state': viewStateModel.get(ViewStateConstants.STATE),
          'sessionState': viewStateModel.get(ViewStateConstants.SESSION_STATE),
          'defaultState': viewStateModel.get(ViewStateConstants.DEFAULT_STATE)
        };

        viewStateModel.updateRoutingHistory(newRouterInfo);
      }
      viewStateModel.set('initialUrlParams', undefined);

      var navigate = Backbone.Router.prototype.navigate.call(this, fragment, options);

      this.initSessionViewState();

      if (viewStateModel.get(ViewStateConstants.CURRENT_ROUTER) !== this.name) {
        viewStateModel.set(ViewStateConstants.CURRENT_ROUTER, this.name);

        this.initDefaultViewState();
      }
      viewStateModel.set(ViewStateConstants.CURRENT_ROUTER_FRAGMENT, originalFragment);
      viewStateModel.set(ViewStateConstants.CURRENT_ROUTER_NAVIGATE_OPTIONS, options);
      this.applicationScope ?
        viewStateModel.set(ViewStateConstants.CURRENT_ROUTER_SCOPE_ID, this.applicationScope.get('id')) :
        viewStateModel.unset(ViewStateConstants.CURRENT_ROUTER_SCOPE_ID);

      this.restoring = false;

      return navigate;
    }
  });

  return PerspectiveRouter;
});
