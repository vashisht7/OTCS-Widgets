/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "module", 'csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/node/node.model',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/perspective/personalization.server.adaptor.mixin',
  'csui/models/perspective/localstorage.server.adaptor.mixin',
  'csui/models/perspective/personalize/personalize.guide',
  'csui/utils/perspective/perspective.util'
], function (require, module, $, _, Backbone, NodeModel,
    UploadableMixin, ConnectableMixin, ServerAdaptorMixin, LocalStorageServerAdaptorMixin,
    PersonalizeGuide, PerspectiveUtil) {
  "use strict";

  var config = _.extend({
    persistOnLocalStorage: false
  }, module.config());

  var PersonalizationModel = Backbone.Model.extend({

    constructor: function PersonalizationModel(attributes, options) {
      PersonalizationModel.__super__.constructor.apply(this, arguments);
      this.options = options;
      if (config.persistOnLocalStorage) {
        this.makeServerAdaptor(options);
      } else {
        this.makeUploadable(options)
            .makeConnectable(options)
            .makeServerAdaptor(options);
      }
      this.resolvePersonalization = true;
    },

    getPerspectiveId: function () {
      return this.get('perspective_id');
    },
    getPerspective: function () {
      if (!this.resolvePersonalization) {
        this.personalization;
      }
      this.personalization = PersonalizeGuide.getPersonalization(this.options.perspective,
          this.toJSON());
      this.resolvePersonalization = false;
      return this.personalization;
    },
    setPerspective: function (personalization, options) {
      var delta = PersonalizeGuide.getDelta(this.options.perspective, personalization);
      this.set(delta, options);
      this.resolvePersonalization = true;
    },

    update: function (changes, options) {
      var personalization = this.getPerspective();
      _.extend(personalization, changes.perspective);
      this.setPerspective(personalization, options);
    },

    prepareFormData: function (data, options) {
      var payload = {
        personalizations: JSON.stringify(data),
        perspective_id: this.get('perspective_id'),
        perspective_version: this.get('perspective_version'),
        node: this.getNodeId()
      };
      return payload;
    },

    getNodeId: function () {
      return (!this.options.sourceModel || !(this.options.sourceModel instanceof NodeModel) ||
              !(this.options.sourceModel.has('id'))) ? 'landing-page' :
             this.options.sourceModel.get('id');
    },

  }, {
    loadPersonalization: function (sourceModel, context) {
      var deferred,
          perspective = sourceModel.get('perspective');
      if (!perspective) {
        return $.Deferred().resolve().promise();
      }
      if (config.persistOnLocalStorage) {
        deferred = PersonalizationModel.loadPersonalizationFromLocalStorage(sourceModel, context,
            perspective);
      } else if (!!perspective.personalizations) {
        var personalization = new PersonalizationModel(perspective.personalizations,
            {sourceModel: sourceModel, perspective: perspective});
        deferred = $.Deferred().resolve(personalization.getPerspective());
      } else {
        deferred = $.Deferred().resolve();
      }
      deferred.then(function (personalization) {
        if (!personalization || _.isEmpty(personalization)) {
          return undefined;
        }
        return _.defaults(personalization, {perspectiveMode: PerspectiveUtil.MODE_PERSONALIZE});
      });
      return deferred.promise();
    },

    loadPersonalizationFromLocalStorage: function (sourceModel, context, perspective) {
      var deferred = $.Deferred();
      var personalization = new PersonalizationModel({},
          {sourceModel: sourceModel, context: context, perspective: perspective});
      personalization.fetch().then(function () {
        var result = personalization.getPerspective();
        if (!_.isEmpty(result)) {
          deferred.resolve(result);
        } else {
          deferred.resolve();
        }
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }
  });

  if (config.persistOnLocalStorage) {
    LocalStorageServerAdaptorMixin.mixin(PersonalizationModel.prototype);
  } else {
    UploadableMixin.mixin(PersonalizationModel.prototype);
    ConnectableMixin.mixin(PersonalizationModel.prototype);
    ServerAdaptorMixin.mixin(PersonalizationModel.prototype);
  }

  return PersonalizationModel;

});
