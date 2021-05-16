/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {
  "use strict";

  var AppContainerMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeAppContainer: function (options) {
          return this;
        },

        massageResponse: function (properties) {
          _.map(['original', 'create_user', 'owner_user',
              'reserved_user', 'modify_user', 'parent'],
            function (item) {
              var idprop = item + '_id',
                expandprop = idprop + '_expand';
              if (properties[expandprop]) {
                properties[expandprop].id = properties[idprop];
              }
            });

          properties.reserved = !!properties.reserved_user_id;
          if (properties.parent_id && !properties.parent_id_expand) {
            properties.parent_id_expand = {
              type: this.node.get('type'),
              name: this.node.get('name'),
              openable: this.node.get('openable')
            };
          }
          if( properties.parent_id_expand) {
            properties.parent_id_expand.container = true;
            properties.parent_id_expand.mime_type = properties.parent_id_expand.mime_type || null;
          }

          return properties;
        }
      });
    }
  };

  return AppContainerMixin;
});
