/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/alpaca/alpcsuipickerfield.mixin',
  './test.customcolumnpickerfield.view.js',
  './test.form.lang.js'
], function ( _, $,
  Alpaca,
  AlpCsuiPickerFieldMixin,
  CustomColumnPickerFieldView,
  lang ) {

  var ConwsCustColPickerField = AlpCsuiPickerFieldMixin.mixin({

    constructor: function ConwsCustColPickerField(container, data, options, schema, view, connector, onError) {
      options = _.extend(options||{},{
        placeholder: lang.alpacaPlaceholderOTCustomColumnPicker,
        alpacaFieldType: 'otconws_customcolumn',
        PickerFieldView: CustomColumnPickerFieldView
      });
      this.base(container, data, options, schema, view, connector, onError);
      this.makeAlpCsuiPickerField(container, data, options, schema, view, connector, onError);
    }
  
  });

  Alpaca.Fields.ConwsCustColPickerField = Alpaca.Fields.TextField.extend(ConwsCustColPickerField);
  Alpaca.registerFieldClass('otconws_customcolumn', Alpaca.Fields.ConwsCustColPickerField, 'bootstrap-csui');
  Alpaca.registerFieldClass('otconws_customcolumn', Alpaca.Fields.ConwsCustColPickerField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.ConwsCustColPickerField;
});
