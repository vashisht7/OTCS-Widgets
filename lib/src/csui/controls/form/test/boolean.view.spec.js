/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/form/fields/booleanfield.view'
], function ($, Backbone, Marionette, BooleanFieldView) {

  describe("BooleanField Control", function () {
    "use strict";

    var el;

    beforeEach(function () {
      el = $('<div style="width: 960px;height: 500px">');
    });

    it("renders with just a model only, state=true", function () {
      var model = new Backbone.Model({data: true});

      var bfv = new BooleanFieldView({
        model: model
      });

      expect(bfv).toBeDefined();
      var region = new Marionette.Region({el: el});
      region.show(bfv);

      var checkbox = bfv.$el.find('input[type=checkbox]');
      expect(checkbox.length).toBe(1);

      expect(checkbox.prop('id')).toBeDefined();

      expect(checkbox.prop('checked')).toBe(true);

      var ariaChecked = checkbox.attr('aria-checked') == "true";
      expect(ariaChecked).toBe(true);
    });


    it("renders with a model and options, state=false", function () {
      var model = new Backbone.Model({
        data: false,
        id: 'lala123'
      });

      var bfv = new BooleanFieldView({
        model: model,
        labelId: 'booleanLabel',
        descriptionId: 'descriptionLabel'
      });

      expect(bfv).toBeDefined();
      var region = new Marionette.Region({el: el});
      region.show(bfv);

      var checkbox = bfv.$el.find('input[type=checkbox]');

      expect(checkbox.attr('id')).toBe('lala123');

      expect(checkbox.prop('checked')).toBe(false);

      var ariaChecked = checkbox.attr('aria-checked') == "true";
      expect(ariaChecked).toBe(false);

      expect(checkbox.attr('aria-labelledby')).toBe('booleanLabel');
      expect(checkbox.attr('aria-describedby')).toBe('descriptionLabel');

    });

    it("changes both states when clicked", function (done) {
      var model = new Backbone.Model({
        data: false,
        id: 'palim234'
      });

      var bfv = new BooleanFieldView({model: model});

      var region = new Marionette.Region({el: el});
      region.show(bfv);

      var checkbox = bfv.$el.find('input[type=checkbox]');
      expect(checkbox.attr('id')).toBe('palim234');

      expect(checkbox.prop('checked')).toBe(false);
      var ariaChecked = checkbox.attr('aria-checked') == "true";
      expect(ariaChecked).toBe(false);

      setTimeout(function () {
        expect(checkbox.prop('checked')).toBe(true);
        done();
      }, 250);

      $(checkbox).trigger('click');

    });

  });

});
