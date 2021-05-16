/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/url', 'csui/utils/namedsessionstorage'
], function (module, _, Backbone, log, Url, NamedSessionStorage) {
  'use strict';
  var storage = new NamedSessionStorage(module.id);

  var MAX_ROUTERS_INFO_STACK = 10;

  var constants = Object.freeze({
    LAST_ROUTER: 'lastRouter',
    CURRENT_ROUTER: 'currentRouter',
    CURRENT_ROUTER_FRAGMENT: 'currentRouterFragment',
    CURRENT_ROUTER_NAVIGATE_OPTIONS: 'currentRouterNavigateOptions',
    CURRENT_ROUTER_SCOPE_ID: 'currentRouterScopeId',
    METADATA_CONTAINER: 'metadata_container',
    STATE: 'state',
    DEFAULT_STATE: 'default_state',
    SESSION_STATE: 'session_state',
    ROUTERS_HISTORY_ARRAY: 'routersHistoryArray',
    URL_PARAMS: 'urlParams',
    ALLOW_WIDGET_URL_PARAMS: 'allowWidgetUrlParams'
  });
  var ViewStateModel = Backbone.Model.extend({

    constructor: function ViewStateModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.set('enabled', false);

      this._routersHistory = [];
      _.values(constants).forEach(function (property) {
        var value = storage.get(property);
        if (property.indexOf("Array") !== -1 && value) {
          value = JSON.parse(value);
        }
        this.set(property, value);
        this.listenTo(this, 'change:' + property, this._syncWithStorage.bind(this, property));
      }.bind(this));

      this._routersHistory = this.get(constants.ROUTERS_HISTORY_ARRAY) || [];
    },

    BROWSING_TYPE: {
      none: 0,
      nodestable: 1,
      breadcrumbs: 2,
      navigation: 3
    },

    CONSTANTS: constants,

    _setViewStateAttribute: function (attributeName, key, value, options) {
      options || (options = {});
      if (this._getViewStateAttribute(attributeName, key) === value) {
        return;
      }

      var object = this.get(attributeName) || {};
      object = _.clone(object);
      if (options.encode) {
        value = encodeURIComponent(value);
      }
      if (value === undefined) {
        delete object[key];
      } else {
        object[key] = value;
      }
      options = _.omit(options, 'encode');
      this.set(attributeName, object, options);
      return true;
    },

    _getViewStateAttribute: function(attributeName, key, decode) {
      var state = this.get(attributeName);
      if (state) {
        var value = state[key];
        if (value && decode) {
          value = decodeURIComponent(value);
        }
        return value;
      }
    },
    setViewState: function (key, value, options) {
      return this._setViewStateAttribute(constants.STATE, key, value, options);
    },

    getViewState: function (key, decode) {
      return this._getViewStateAttribute(constants.STATE, key, decode);
    },
    setDefaultViewState: function(key, value, options) {
      return this._setViewStateAttribute(constants.DEFAULT_STATE, key, value, options);
    },

    getDefaultViewState: function(key, decode) {
      return this._getViewStateAttribute(constants.DEFAULT_STATE, key, decode);
    },
    setSessionViewState: function (key, value, options) {
      options || (options = {});
      if (this.getSessionViewState(key) === value) {
        return;
      }
      var sessionState = this.get(constants.SESSION_STATE) || {};
      sessionState = _.clone(sessionState);
      sessionState[key] = value;
      this.set(constants.SESSION_STATE, sessionState, options);
      return true;
    },

    getSessionViewState: function (key) {
      var state = this.get(constants.SESSION_STATE);
      if (state) {
        return state[key];
      }
    },

    _syncWithStorage: function (property) {
      var value = this.get(property);
      if (_.isArray(value)) {
        value = JSON.stringify(value);
      }
      storage.set(property, value);
    },

    updateRoutingHistory: function (newRouterInfo) {

      var restore =  this.isSameRoutingInfo(newRouterInfo, this.getLastRouterInfo());
      this.set(this.CONSTANTS.LAST_ROUTER, this.get(this.CONSTANTS.CURRENT_ROUTER));

      if (restore) {
        this._restoreStatesFromRouterInfo(this._routersHistory.pop());
        this.unset(constants.ROUTERS_HISTORY_ARRAY, {silent: true});
        this.set(constants.ROUTERS_HISTORY_ARRAY, this._routersHistory);
      } else {
        if (!this.get('disableLastRouterOnChange')) {
          this._addRouterInfoToHistory();
        } else {
          this.set('disableLastRouterOnChange', false);
        }
      }
    },

    _restoreStatesFromRouterInfo : function(routerInfo) {
      if (routerInfo) {
        var restoreStates = {
          'state': routerInfo.state,
          'default_state': routerInfo.defaultState,
          'session_state': routerInfo.sessionState
        };
        this.set(restoreStates, {silent: true});
        ['state', 'default_state', 'session_state'].forEach(function (property) {
          this._syncWithStorage(property);
        }.bind(this));
      }
    },

    _addRouterInfoToHistory: function () {
      var routerName = storage.get(constants.CURRENT_ROUTER);
      if (routerName) {
        this._routersHistory.push({
          'router': routerName,
          'urlParam': storage.get(constants.URL_PARAMS),
          'fragment': storage.get(constants.CURRENT_ROUTER_FRAGMENT),
          'scopeId': storage.get(constants.CURRENT_ROUTER_SCOPE_ID),
          'navigateOptions': storage.get(constants.CURRENT_ROUTER_NAVIGATE_OPTIONS),
          'state': storage.get(constants.STATE),
          'sessionState': storage.get(constants.SESSION_STATE),
          'defaultState': storage.get(constants.DEFAULT_STATE)
        });

        if (this._routersHistory.length > MAX_ROUTERS_INFO_STACK) {
          this._routersHistory.shift();
        }

        this.unset(constants.ROUTERS_HISTORY_ARRAY, {silent: true});
        this.set(constants.ROUTERS_HISTORY_ARRAY, this._routersHistory);
      }
    },

    getLastRouterInfo: function () {
      return this._routersHistory && this._routersHistory.length > 0 &&
             this._routersHistory[this._routersHistory.length - 1];
    },

    isSameRoutingInfo: function (router1Info, router2Info) {
      return router1Info && router2Info &&
             router1Info.router === router2Info.router &&
             router1Info.router === router2Info.router &&
             router1Info.fragment === router2Info.fragment;
    },
    disableLastRouterOnChange: function () {
    },
    clean: function() {
      this.clear(); 
      storage.destroy(); 
    },

    restoreLastRouter: function () {
      require(['csui/pages/start/perspective.routing'
      ], function (perspectiveRouting){

        var routerInfo = this.getLastRouterInfo();
        if (routerInfo) {
          this._restoreStatesFromRouterInfo(routerInfo);
          perspectiveRouting.getInstance().restoreRouter(routerInfo);
        } else {
          window.history.back();
        }

      }.bind(this));
    },

    addUrlParameters: function (urlParameters, context) {
      require(['csui/pages/start/perspective.routing'
      ], function (perspectiveRouting){
        perspectiveRouting.getInstance({context:context}).addUrlParameters(this.get(constants.CURRENT_ROUTER), urlParameters);
      }.bind(this));
    }

  }, {
    CONSTANTS: constants
  });

  return new ViewStateModel();
});
