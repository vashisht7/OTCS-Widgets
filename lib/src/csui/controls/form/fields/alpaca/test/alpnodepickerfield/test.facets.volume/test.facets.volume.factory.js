/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/dialogs/node.picker/start.locations/node.base.factory',
  'base/src/controls/form/fields/alpaca/test/alpnodepickerfield/test.node.picker.lang.js',
  'css!src/controls/form/fields/alpaca/test/alpnodepickerfield/test.icons.css'
], function (_, NodeBaseFactory, lang) {
  "use strict";

  var FacetsVolumeFactory = NodeBaseFactory.extend({

    constructor: function FacetsVolumeFactory(options) {
      options = _.defaults({
        node: {
          id: 'volume',
          type: 901
        },
        icon: 'conws-icon-facets-volume',
        unselectable: false,
        defaultName: lang.labelFacetsVolume
      }, options);
      NodeBaseFactory.prototype.constructor.call(this, options);
    },

    updateLocationModel: function (model) {
      return NodeBaseFactory.prototype.updateLocationModel.apply(this,arguments);
    }


  });

  return FacetsVolumeFactory;

});
