/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/alpaca/alptypeaheadfield.mixin',
  'csui/controls/form/fields/userfield.view',
  'csui/utils/contexts/factories/member',
  'csui/controls/form/pub.sub',
  'i18n!csui/controls/form/impl/nls/lang'
], function ( _, $,
  Alpaca,
  AlpTypeaheadFieldMixin,
  UserFieldView,
  MemberModelFactory,
  PubSub,
  Lang ) {

  var CsuiUserField = AlpTypeaheadFieldMixin.mixin({

    constructor: function CsuiUserField(container, data, options, schema, view, connector, onError) {

      options = $.extend(true,options||{},{
        alpacaFieldType: 'otcs_user',
        alpacaFieldClasses: 'csui-field-otcs_user', // pass something to avoid standard typeahead class to be applied
        lang: {
          invalidItem: Lang.invalidUser
        },
        noId: -3
      });

      options.ItemModelFactory = MemberModelFactory;
      options.TypeaheadFieldView = UserFieldView;

      this.onlyUsers = schema.type === "otcs_user_picker";

      this.base(container, data, options, schema, view, connector, onError);
      this.makeAlpTypeaheadField();
    }
  
  });

  var original = _.extend({},CsuiUserField);

  CsuiUserField = _.extend(CsuiUserField, {

    showField: function(data) {

      var ret = original.showField.apply(this,arguments);
      PubSub.trigger(this.propertyId + 'tkl:asyncBuildRelation', this.fieldView);

      return ret;
    }

  });

  Alpaca.Fields.CsuiUserField = Alpaca.Fields.TextField.extend(CsuiUserField);
  Alpaca.registerFieldClass('otcs_user', Alpaca.Fields.CsuiUserField);

  return $.alpaca.Fields.CsuiUserField;
});
