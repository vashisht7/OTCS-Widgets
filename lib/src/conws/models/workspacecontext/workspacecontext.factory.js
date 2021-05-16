/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
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
