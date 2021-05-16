/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'csui/controls/form/fields/base/csformfield.view',
  'csui/controls/form/fields/typeaheadfield.view.mixin'
], function (require, _, $, base,
    FormFieldView, TypeaheadFieldViewMixin) {

  var TypeaheadFieldView = FormFieldView.extend({

    constructor: function TypeaheadFieldView(options) {
      FormFieldView.apply(this, arguments);
      this.makeTypeaheadFieldView(options);
    }

  });

  TypeaheadFieldViewMixin.mixin(TypeaheadFieldView.prototype);

  return TypeaheadFieldView;
});
