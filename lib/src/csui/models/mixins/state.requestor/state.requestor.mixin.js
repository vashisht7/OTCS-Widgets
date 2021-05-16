/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore'
],function (_) {
  'use strict';

  var StateRequestorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeStateRequestor: function (options) {
          this.stateEnabled = options && options.stateEnabled;
          return this;
        },

        enableState: function () {
          this.stateEnabled = true;
        },

        disableState: function () {
          this.stateEnabled = false;
        },

        getStateEnablingUrlQuery: function () {
          var stateEnabled = this.stateEnabled != null ? this.stateEnabled :
            this.collection && this.collection.stateEnabled;
          return stateEnabled ? {state: ''} : {};
        }
      });
    }
  };

  return StateRequestorMixin;
});
