/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!xecmpf/widgets/eac/impl/nls/lang'
], function (lang) {

  var EACEventListColumnsDefinition = {
    "event_name": {
      "hidden": false,
      "key": "event_name",
      "name": lang.documentTypeLabel,
      "type": -1,
      "type_name": "String",
      "sort": true,
    },

    "namespace": {
      "key": "namespace",
      "name": lang.documentNameLabel,
      "type": -2,
      "type_name": "String"
    },

    "action_plan": {
      "key": "action_plan",
      "name": lang.documentStatusLabel,
      "type": -1,
      "type_name": "String"
    }
  };

  return EACEventListColumnsDefinition;
});
