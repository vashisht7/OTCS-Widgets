/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", "csui/utils/log", "xecmpf/widgets/myattachments/metadata.attachment.model","csui/lib/jquery", "csui/lib/underscore", "csui/utils/url"
], function (module, Backbone, log, AttachmentModel, $, _, Url) {
  'use strict';

  var AttachmentCollection = Backbone.Collection.extend({

    model: AttachmentModel,

    constructor: function AttachmentCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
      if (this.options.connector) {
        this.options.connector.assignTo(this);
      }
    },

    setOrder: function (attributes, fetch) {
      if (this.orderBy !== attributes) {
        this.orderBy = attributes;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    resetOrder: function (fetch) {
      if (this.orderBy) {
        this.orderBy = undefined;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    setLimit: function (skip, top, fetch) {
      if (this.skipCount !== skip || this.topCount !== top) {
        this.skipCount = skip;
        this.topCount = top;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    resetLimit: function (fetch) {
      if (this.skipCount) {
        this.skipCount = 0;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    setFilter: function (filters, fetch, options) {
      if(this.filters) {
        for (var tempKey in this.filters) {
          if(this.filters[tempKey] === undefined) {
            delete this.filters[tempKey];
          }
        }
      }
      for (var key in filters) {
        if (!this.filters) {
          this.filters = {};
        }
        this.filters[key] = filters[key];
      }
      if (fetch !== false) {
        this.fetch(options);
      }
      return true;
    }

  });
  AttachmentCollection.version = '1.0';

  return AttachmentCollection;

});
