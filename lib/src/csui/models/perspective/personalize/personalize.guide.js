/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/models/perspective/personalize/delta.generator',
  'csui/models/perspective/personalize/delta.resolver'
], function (module, DeltaGenerator, DeltaResolver) {

  var PersonalizeGuide = {
    getDelta: function (perspective, personalization) {
      var generator = new DeltaGenerator(
          {perspective: perspective, personalization: personalization});
      return generator.getDelta();
    },

    getPersonalization: function (perspective, delta) {
      var merger = new DeltaResolver({perspective: perspective, delta: delta});
      return merger.getPersonalization();
    }
  };

  return PersonalizeGuide;

});