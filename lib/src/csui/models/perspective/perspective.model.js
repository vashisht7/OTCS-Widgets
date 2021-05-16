/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["module", 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  "csui/utils/log", "csui/utils/base", 'csui/utils/url'
], function (module, _, Backbone, UploadableMixin, ConnectableMixin, log,
    base, Url) {
  "use strict";

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var PerspectiveModel = Backbone.Model.extend({
    idAttribute: config.idAttribute,

    constructor: function PerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.options = _.pick(options, ['connector']);
      this.makeUploadable(options)
          .makeConnectable(options);
    },

    getPerspectiveId: function() {
      return this.get('id');
    },

    getPerspective: function () {
      return this.get('perspective');
    },

    setPerspective: function (attributes, options) {
      this.set('perspective', attributes, options);
    },

    update: function (changes) {
      this.set.apply(this, arguments);
    },

    isNew: function () {
      return !this.get('id') || this.get('id') === 0;
    },

    urlBase: function () {
      var id  = this.get('id'),
          url = this.connector.connection.url;
      if (!id) {
        url = Url.combine(url, 'perspectives');
      } else if (!_.isNumber(id) || id > 0) {
        url = Url.combine(url, 'perspectives', id);
      } else {
        throw new Error('Unsupported id value');
      }
      return url;
    },

    url: function () {
      var url = this.urlBase();
      return url;
    },

    prepareFormData: function (data, options) {
      return {pData: JSON.stringify(data)};
    }
  });

  UploadableMixin.mixin(PerspectiveModel.prototype);
  ConnectableMixin.mixin(PerspectiveModel.prototype);

  return PerspectiveModel;

});