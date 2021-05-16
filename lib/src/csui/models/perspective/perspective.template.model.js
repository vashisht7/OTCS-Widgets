/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["module", 'csui/lib/underscore', "csui/lib/backbone",
  "csui/models/perspective/server.adaptor.mixin",
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/perspective/perspective.model',
  "csui/utils/log", "csui/utils/base"
], function (module, _, Backbone, ServerAdaptorMixin, UploadableMixin, ConnectableMixin,
    PerspectiveModel, log,
    base) {
  "use strict";

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var PerspectiveTemplateModel = Backbone.Model.extend({
    idAttribute: config.idAttribute,

    constructor: function PerspectiveTemplateModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.options = _.pick(options, ['connector']);
      this.makeUploadable(options)
          .makeConnectable(options)
          .makeServerAdaptor(options);
    },

    isNew: function () {
      return !this.get('id') || this.get('id') === 0;
    },

    isFetchable: function () {
      return !!this.get('id');
    },

    set: function (key, value, options) {
      var attrs;
      if (key == null) {
        return this;
      }
      if (typeof key === 'object') {
        attrs = key;
        options = value;
      } else {
        (attrs = {})[key] = value;
      }
      if (attrs.perspectives) {
        key = 'perspectives';
        var perspectiveCollection = new Backbone.Collection();
        options = _.pick(this.options, ['connector']);

        _.each(attrs.perspectives, function (perspective) {
          perspectiveCollection.add(new PerspectiveModel(perspective, options));
        });
        value = perspectiveCollection;
        (attrs = {})[key] = value;
      }
      return Backbone.Model.prototype.set.call(this, attrs, options);
    }
  });

  UploadableMixin.mixin(PerspectiveTemplateModel.prototype);
  ConnectableMixin.mixin(PerspectiveTemplateModel.prototype);
  ServerAdaptorMixin.mixin(PerspectiveTemplateModel.prototype);

  return PerspectiveTemplateModel;

});
