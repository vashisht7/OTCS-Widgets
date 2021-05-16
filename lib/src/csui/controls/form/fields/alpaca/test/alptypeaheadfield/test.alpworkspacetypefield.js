/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/alpaca/alptypeaheadfield.mixin',
  'csui/utils/contexts/factories/connector',
  './test.workspacetypes.model.js',
  './test.workspacetype.factory.js',
  'csui/controls/form/fields/typeaheadfield.view',
  './test.form.lang.js',
  'css!src/controls/form/fields/alpaca/test/alptypeaheadfield/test.workspacetypepicker.css'
], function ( _, $,
  Alpaca,
  AlpTypeaheadFieldMixin,
  ConnectorFactory,
  WorkspaceTypesModel,
  WorkspaceTypeFactory,
  TypeaheadFieldView,
  lang ) {

  var ConwsWorkspaceTypeField = AlpTypeaheadFieldMixin.mixin({

    constructor: function ConwsWorkspaceTypeField(container, data, options, schema, view, connector, onError) {

      options = $.extend(true,options||{},{
        alpacaFieldType: 'otconws_workspacetype_id',
        css: {
          customImage: 'wksp-type-custom-image',
          defaultIcon: 'csui-icon csui-nodesprites'
        },
        lang: {
          alpacaPlaceholder: lang.alpacaPlaceholderOTWorkspaceTypePicker
        },
        pickerOptions: {
          collection: new WorkspaceTypesModel( undefined, {
            connector: connector.config.context.getObject(ConnectorFactory)
          }),
          css: {
          },
          itemOptions: {
            css: {
              customImage: 'csui-icon wksp-type-custom-image',
              defaultIcon: 'csui-icon csui-nodesprites'
            }
          }
        }
      });

      options.ItemModelFactory = WorkspaceTypeFactory;

      this.base(container, data, options, schema, view, connector, onError);
      this.makeAlpTypeaheadField();
    }
  
  });

  Alpaca.Fields.ConwsWorkspaceTypeField = Alpaca.Fields.TextField.extend(ConwsWorkspaceTypeField);
  Alpaca.registerFieldClass('otconws_workspacetype_id', Alpaca.Fields.ConwsWorkspaceTypeField, 'bootstrap-csui');
  Alpaca.registerFieldClass('otconws_workspacetype_id', Alpaca.Fields.ConwsWorkspaceTypeField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.ConwsWorkspaceTypeField;
});
