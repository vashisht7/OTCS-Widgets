/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/alpaca/js/alpaca',
  'csui/utils/namedsessionstorage',
  'csui/controls/form/fields/alpaca/alpcsuipickerfield.mixin',
  'csui/controls/form/fields/nodepickerfield.view'
], function (module, _, $, Alpaca,
  NamedSessionStorage,
  AlpCsuiPickerFieldMixin,
  NodePickerFieldView) {

  var storage = new NamedSessionStorage(module.id);

  var CsuiNodePickerField = AlpCsuiPickerFieldMixin.mixin({
    constructor: function NodePickerField(container, data, options, schema, view, connector, onError) {
      options = _.extend(options||{},{
        alpacaFieldType: 'otcs_node_picker',
        PickerFieldView: NodePickerFieldView
      });
      this.base(container, data, options, schema, view, connector, onError);
      this.makeAlpCsuiPickerField();
    }
  });

  Alpaca.Fields.CsuiNodePickerField = Alpaca.Fields.IntegerField.extend(CsuiNodePickerField);

  Alpaca.registerFieldClass('otcs_node_picker', Alpaca.Fields.CsuiNodePickerField,
      'bootstrap-csui');
  Alpaca.registerFieldClass('otcs_node_picker', Alpaca.Fields.CsuiNodePickerField,
      'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiNodePickerField;
});
