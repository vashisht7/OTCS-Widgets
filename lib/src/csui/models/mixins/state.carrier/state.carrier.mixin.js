/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/state.requestor/state.requestor.mixin'
], function (_, Backbone, StateRequestorMixin) {
  'use strict';

  var StateCarrierMixin = {
    mixin: function (prototype) {
      StateRequestorMixin.mixin(prototype);

      return _.extend(prototype, {
        makeStateCarrier: function (options, attributes) {
          this.state = new Backbone.Model(getStateAttributes(attributes));
          return this.makeStateRequestor(options);
        },

        setState: function (attributes) {
          if (this.state) {
            var state = getStateAttributes(attributes);
            if (state) {
              this.state.set(state);
            }
          }
        },

        parseState: function (node, results, role) {
          node.state = getStateAttributes(results);
        }
      });
    }
  };

  function getStateAttributes(attributes) {
    var state = attributes && attributes.state;
    return state && state.properties || state;
  }

  return StateCarrierMixin;
});
