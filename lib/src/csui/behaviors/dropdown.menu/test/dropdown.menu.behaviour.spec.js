/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  'csui/lib/marionette',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  "../../../utils/testutils/async.test.utils.js",
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/lib/binf/js/binf'
], function ($, _, Backbone, Marionette, DropdownMenuBehavior, TestUtils, lang) {

  describe("dropdownmenu behaviour", function () {

    var DropdownMenuView = Marionette.ItemView.extend({
      className: "cs-dropdown-menu",
      templateHelpers: function () {
        return {
          hasCommands: true,
          btnId: 123,
          showMoreTooltip: lang.showMore,
          showMoreAria: lang.showMoreAria
        };
      },

      ui: {
        dropdownToggle: '.binf-dropdown-toggle',
        dropdownMenu: '.binf-dropdown-menu',
        loadingIconsDiv: '.csui-loading-parent-wrapper'
      },

      behaviors: [
        {
          behaviorClass: DropdownMenuBehavior
        }
      ],
      initialize: function () {
        var templateHtml = "<div class='binf-dropdown'>" +
                           "<button id='{{btnId}}' type='button' class='binf-btn binf-dropdown-toggle'" +
                           "data-binf-toggle='dropdown' aria-haspopup='true' aria-expanded='false'" +
                           "aria-label='{{showMoreAria}}' title='{{showMoreTooltip}}'>" +
                           "<span class='csui-button-icon icon-expandArrowDown' title='{{showMoreTooltip}}'></span>" +
                           "</button>" +
                           "<ul class='binf-dropdown-menu' role='menu'></ul>" +
                           "</div>";
        this.template = _.template(templateHtml);
      }

    });
    var dropdown = new DropdownMenuView({collection: new Backbone.Collection()});
    beforeAll(function (done) {
      dropdown.render();
      $(document.body).append(dropdown.$el);
      var list = dropdown.$el.find('ul');
      list.append("<li>html</li>");
      list.append("<li>javascript</li>");
      list.append("<li>CSS</li>");
      done();
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    it("click to open dropdown", function (done) {
      dropdown.$el.find('button').trigger('click');
      TestUtils.asyncElement(dropdown.$el,
          'li:visible').done(function (el) {
        expect(el.length).toEqual(3);
        done();
      });
    });

    it("click to close dropdown", function (done) {
      dropdown.$el.find('button').trigger('click');
      TestUtils.asyncElement(dropdown.$el,
          'li:visible', true).done(function (el) {
        expect(el.length).toEqual(0);
        done();
      });
    });

    it("keydown enter to open dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 13}); // enter
      TestUtils.asyncElement(dropdown.$el,
          'li:visible').done(function (el) {
        expect(el.length).toEqual(3);
        done();
      });
    });

    it("keydown enter to close dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 13}); // enter
      TestUtils.asyncElement(dropdown.$el,
          'li:visible', true).done(function (el) {
        expect(el.length).toEqual(0);
        done();
      });
    });

    it("keydown space to open dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 32}); // space
      TestUtils.asyncElement(dropdown.$el,
          'li:visible').done(function (el) {
        expect(el.length).toEqual(3);
        done();
      });
    });

    it("keydown space to close dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 32}); // space
      TestUtils.asyncElement(dropdown.$el,
          'li:visible', true).done(function (el) {
        expect(el.length).toEqual(0);
        done();
      });
    });

    it("keydown tab to close dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 32}); // space to open dropdown
      TestUtils.asyncElement(dropdown.$el,
          'li:visible').done(function (el) {
        expect(el.length).toEqual(3);
        dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 9}); // tab
        TestUtils.asyncElement(dropdown.$el,
            'li:visible', true).done(function (el) {
          expect(el.length).toEqual(0);
          done();
        });
      });
    });

    it("keyup esc to close dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 32}); // space to open dropdown
      TestUtils.asyncElement(dropdown.$el,
          'li:visible').done(function (el) {
        expect(el.length).toEqual(3);
        dropdown.ui.dropdownToggle.trigger({type: 'keyup', keyCode: 27}); // Esc
        TestUtils.asyncElement(dropdown.$el,
            'li:visible', true).done(function (el) {
          expect(el.length).toEqual(0);
          done();
        });
      });
    });

    it("keydown esc doesn't close dropdown", function (done) {
      dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 32}); // space to open dropdown
      TestUtils.asyncElement(dropdown.$el,
          'li:visible').done(function (el) {
        expect(el.length).toEqual(3);
        dropdown.ui.dropdownToggle.trigger({type: 'keydown', keyCode: 27}); // Esc
        TestUtils.asyncElement(dropdown.$el,
            'li:visible').done(function (el) {
          expect(el.length).toEqual(3);
          done();
        });
      });

    });
  });
});