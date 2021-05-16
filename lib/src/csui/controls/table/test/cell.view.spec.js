/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/date/date.view',
  'csui/controls/table/cells/datetime/datetime.view',
  'csui/controls/table/cells/duedate/duedate.view'

], function (module, $, _, Backbone, Marionette, CellView, DateView, DateTimeView, DueDateView) {
  'use strict';

  describe("Cell View", function () {

    beforeEach(function () {

      this.node = new Backbone.Model({
        keywords: [
          'A', 'B', 'C'
        ],
        singleValue: 'A',
        dates: [
          '2018-05-25T14:28:55.286Z',
          '2018-05-25T14:28:55.286Z',
          '2018-05-25T14:28:55.286Z'
        ],
        date: '2018-05-25T14:28:55.286Z',
        dateOnly: '2018-05-25'
      });

    });

    describe("With multi value plain text", function () {

      beforeEach(function () {

        var column = {
          name: 'keywords',
          attributes: {}
        };

        this.cellview = new CellView({
          model: this.node,
          column: column
        });

      });

      it('renders with comma separated values', function () {
        expect(this.cellview.getValueText()).toEqual("A, B, C");
      });

    });

    describe("With single value plain text", function () {

      beforeEach(function () {

        var column = {
          name: 'singleValue',
          attributes: {}
        };

        this.cellview = new CellView({
          model: this.node,
          column: column
        });

      });

      it('renders single value', function () {
        expect(this.cellview.getValueText()).toEqual("A");
      });

    });

    function testMultiValues(instance) {
      var value = instance.getValueData(),
          valueText = instance.getValueText(),
          expectedResult = "05/25/2018";
      expect(value.value).toContain(expectedResult);
      expect(value.formattedValue).toContain(expectedResult);
      expect(value.value).toContain(',');
      expect(value.formattedValue).toContain(',');
      expect(valueText).toContain(expectedResult);
      expect(valueText).toContain(expectedResult);
    }

    function testSingleValue(instance) {
      var value = instance.getValueData(),
          valueText = instance.getValueText(),
          expectedResult = "05/25/2018";
      expect(value.value).toContain(expectedResult);
      expect(value.formattedValue).toContain(expectedResult);
      expect(valueText).toContain(expectedResult);
    }

    function testSingleDateValue(instance, includeTime) {
      testSingleValue(instance);
      testDateValue(instance, includeTime);
    }

    function testDateValue(instance, includeTime) {
      testSingleValue(instance);
      var valueData = instance.getValueData(),
          valueText = instance.getValueText();
      if (includeTime) {
        expect(valueData.value).toContain(':');
        expect(valueData.formattedValue).toContain(':');
        expect(valueText).toContain(':');
      } else {
        expect(valueData.value).not.toContain(':');
        expect(valueData.formattedValue).not.toContain(':');
        expect(valueText).not.toContain(':');
      }
    }

    describe("With single value date", function () {

      beforeEach(function () {

        var column = {
          name: 'date',
          attributes: {}
        };

        this.dateview = new DateView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleDateValue(this.dateview, true);
      });
    });
    describe("With multi value date", function () {

      beforeEach(function () {

        var column = {
          name: 'dates',
          attributes: {}
        };

        this.dateview = new DateView({
          model: this.node,
          column: column
        });
      });

      it('renders with comma separated values', function () {
        testMultiValues(this.dateview);
      });

    });

    describe("With single value date-only", function () {

      beforeEach(function () {

        var column = {
          name: 'dateOnly',
          attributes: { include_time: false }
        };

        this.dateview = new DateView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleDateValue(this.dateview, false);
      });
    });

    describe("With single value datetime", function () {

      beforeEach(function () {

        var column = {
          name: 'date',
          attributes: {}
        };

        this.dateview = new DateTimeView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleValue(this.dateview);
      });
    });
    describe("With multi value datetime", function () {

      beforeEach(function () {

        var column = {
          name: 'dates',
          attributes: {}
        };

        this.dateview = new DateTimeView({
          model: this.node,
          column: column
        });
      });

      it('renders with comma separated values', function () {
        testMultiValues(this.dateview);
      });

    });

    describe("With single value duedate", function () {

      beforeEach(function () {

        var column = {
          name: 'date',
          attributes: {}
        };

        this.dateview = new DueDateView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleValue(this.dateview);
      });
    });
    describe("With multi value duedate", function () {

      beforeEach(function () {

        var column = {
          name: 'dates',
          attributes: {}
        };

        this.dateview = new DueDateView({
          model: this.node,
          column: column
        });
      });

      it('renders with comma separated values', function () {
        testMultiValues(this.dateview);
      });

    });

  });


});
