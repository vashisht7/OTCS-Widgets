/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/widgets/metadata/impl/metadata.properties.view',
  'css!csui/widgets/metadata/impl/metadata'
], function (module, _, MetadataPropertiesViewImpl) {

  var config = module.config();
  _.defaults(config, {
    topAlignLabel: false
  });
  var MetadataPropertiesView = MetadataPropertiesViewImpl.extend({

    constructor: function MetadataPropertiesView(options) {
      options.topAlignLabel = config.topAlignLabel;
      MetadataPropertiesViewImpl.prototype.constructor.apply(this, arguments);
    },

    validateForms: function () {
      return MetadataPropertiesViewImpl.prototype.validateForms.apply(this, arguments);
    },

    getFormsValues: function () {
      return MetadataPropertiesViewImpl.prototype.getFormsValues.apply(this, arguments);
    }

  });

  return MetadataPropertiesView;

});
