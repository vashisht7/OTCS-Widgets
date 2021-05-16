/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/commands/open.document/delegates/open.document.delegates'
], function (_, Backbone, RulesMatchingMixin, rules) {
  'use strict';

  var OpenDocumentDelegateModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      command: null
    },

    constructor: function OpenDocumentDelegateModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    },

    enabled: function (node, status, options) {
      return this.matchRules(node, this.attributes) &&
        this.get('command').enabled(status, options);
    }
  });

  RulesMatchingMixin.mixin(OpenDocumentDelegateModel.prototype);

  var OpenDocumentDelegateCollection = Backbone.Collection.extend({
    model: OpenDocumentDelegateModel,
    comparator: 'sequence',

    constructor: function OpenDocumentDelegateCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    findByNode: function (node, status, options) {
      var rule = this.find(function (rule) {
        return rule.enabled(node, status, options);
      });
      return rule && rule.get('command');
    }
  });

  var openDocumentDelegates = new OpenDocumentDelegateCollection();

  if (rules) {
    openDocumentDelegates.add(_
      .chain(rules)
      .flatten(rules)
      .map(function (rule) {
        return _.defaults({
          command: new rule.command()
        }, rule);
      })
      .value());
  }

  return openDocumentDelegates;
});
