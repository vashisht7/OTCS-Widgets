/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/nodeupdateforms',
  'json!./nodeupdateforms.data.json',
  'csui/utils/deepClone/deepClone'
], function (_, NodeUpdateFormCollection, formResponse) {
  'use strict';

  describe("NodeUpdateFormCollection", function () {
    describe("when parsing a response with categories", function () {
      beforeAll(function () {
        this.updateForms = new NodeUpdateFormCollection();
      });

      beforeEach(function () {
        this.formResponse = _.deepClone(formResponse);
      });

      it('sets the removeable flag to true by default', function () {
        var forms = this.updateForms.parse(this.formResponse);
        expect(forms[0].removeable).toBe(true);
        expect(forms[0].allow_delete).toBe(true);
      });

      it('keeps the removeable as false if requested', function () {
        this.formResponse.forms[0].options.fields['1'].removeable = false;
        var forms = this.updateForms.parse(this.formResponse);
        expect(forms[0].removeable).toBe(false);
        expect(forms[0].allow_delete).toBe(false);
      });
    });
  });
});
