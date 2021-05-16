/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui-ext!csui/utils/dragndrop.supported.subtypes'
], function (_, ExtraDragNDropSupportedSubTypes) {
  'use strict';
  var DragNDropSupportedSubTypes = [
    0, 202, 751, 30205, 144, 136, 141, 142
  ];

  if (ExtraDragNDropSupportedSubTypes) {
    DragNDropSupportedSubTypes = DragNDropSupportedSubTypes.concat(
        _.flatten(ExtraDragNDropSupportedSubTypes, true));
  }

  return DragNDropSupportedSubTypes;

});