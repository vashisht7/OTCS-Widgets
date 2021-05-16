/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/base',
  'conws/widgets/team/impl/controls/rolepicker/rolepicker.view',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js'
], function ($, Backbone, base, RolePicker, TestUtil, TestManager) {

  describe('RolePicker control', function () {

    'use strict';

    describe('view creation', function () {

      var view;

      it('with default configuration', function () {
        view = new RolePicker({});
        expect(view.options).toBeDefined();
        expect(view.filterLength).toEqual(0);

      });
    });

    describe('view creation', function () {

      var roles;
      var view;

      it('with custom configuration', function () {
        var roles = new Backbone.Collection([
          {
            name: 'Manager',
            inherited_from_id: undefined
          },
          {
            name: 'Staff',
            inherited_from_id: undefined
          },
          {
            name: 'Staff Council',
            inherited_from_id: 4711
          }
        ]);
        var view = new RolePicker({
          delay: 100,
          minLength: 1,
          placeholder: 'Type to filter roles',
          roles: roles,
          prettyScrolling: true,
          showInherited: false
        });
        expect(view.options).toBeDefined();
        expect(view.options.delay).toEqual(100);
        expect(view.options.minLength).toEqual(1);
        expect(view.options.placeholder).toEqual('Type to filter roles');
        expect(view.options.roles).toBeDefined();
        expect(view.options.roles.length).toEqual(3);
        expect(view.options.prettyScrolling).toBeTruthy();
        expect(view.options.showInherited).toBeFalsy();

      });
    });

    describe('view renders', function () {

      var roles;
      var view;

      it('without scrolling', function (done) {
        var roles = new Backbone.Collection([
          {
            name: 'Manager',
            inherited_from_id: undefined
          },
          {
            name: 'Staff',
            inherited_from_id: undefined
          },
          {
            name: 'Staff Council',
            inherited_from_id: 4711
          }
        ]);
        var view = new RolePicker({
          placeholder: 'Type to filter roles...',
          roles: roles
        });
        view.render();
        expect(view.$el.hasClass('conws-control-rolepicker')).toBeTruthy();
        var input = view.$el.find('.typeahead.cs-search');
        expect(input.length).toEqual(1);
        expect(input.attr('placeholder')).toEqual('Type to filter roles...');
        expect(input.attr('type')).toEqual('search');
        var clear = view.$el.find('.typeahead.cs-search-clear');
        expect(clear.length).toEqual(1);
        expect(clear.css('display')).toEqual('none');
        var caret = view.$el.find('.typeahead.cs-search-icon');
        expect(caret.length).toEqual(1);
        input.val('a');
        input.trigger($.Event('keyup', {keyCode: 65}));
        TestUtil.justWait(done,"justWait 200",200);
        TestUtil.run(done,function (done) {
          expect(clear.css('display')).toEqual('');
          var dropdown = view.$el.find('.typeahead.binf-dropdown-menu');
          expect(dropdown.length).toEqual(1);
          expect(dropdown.css('display') !== 'none').toBeTruthy();
          var items = view.$el.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(3);
          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Manager');
          expect(item.attr('title')).toEqual('Manager');
          input.val('af');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 200",200);

          TestUtil.run(done,function () {
            expect(clear.css('display')).toEqual('');
            var dropdown = view.$el.find('.typeahead.binf-dropdown-menu');
            expect(dropdown.length).toEqual(1);
            expect(dropdown.css('display') !== 'none').toBeTruthy();
            var items = view.$el.find('.typeahead.binf-dropdown-menu > li');
            expect(items.length).toEqual(2);
            var item = $(items[0]).find('a > span > span');
            expect(item.length).toEqual(1);
            expect(item.text()).toEqual('Staff');
            expect(item.attr('title')).toEqual('Staff');
            input.trigger('blur');
            clear.trigger('click');
            expect(clear.css('display')).toEqual('');
            expect(input.val()).toEqual('');
            expect(dropdown.css('display')).toEqual('none');
          });
        });
      });
    });

    describe('view renders', function () {

      var roles;
      var view;

      it('with scrolling', function (done) {
        var roles = new Backbone.Collection([
          {
            name: 'Manager',
            inherited_from_id: undefined
          },
          {
            name: 'Staff',
            inherited_from_id: undefined
          },
          {
            name: 'Staff Council',
            inherited_from_id: 4711
          }
        ]);
        var view = new RolePicker({
          roles: roles,
          prettyScrolling: true,
          showInherited: false
        });
        view.render();
        expect(view.$el.hasClass('conws-control-rolepicker')).toBeTruthy();
        var input = view.$el.find('.typeahead.cs-search');
        expect(input.length).toEqual(1);
        expect(input.attr('placeholder')).toEqual('Assign the same role to all.');
        expect(input.attr('type')).toEqual('search');
        var clear = view.$el.find('.typeahead.cs-search-clear');
        expect(clear.length).toEqual(1);
        expect(clear.css('display')).toEqual('none');
        var caret = view.$el.find('.typeahead.cs-search-icon');
        expect(caret.length).toEqual(1);
        input.val('a');
        input.trigger($.Event('keyup', {keyCode: 65}));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function (done) {
          expect(clear.css('display')).toEqual('');
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);
          expect(container.css('display') !== 'none').toBeTruthy();
          var xrail = container.find('.ps-scrollbar-x-rail');
          expect(xrail.length).toEqual(1);
          var yrail = container.find('.ps-scrollbar-y-rail');
          expect(yrail.length).toEqual(1);
          var dropdown = container.find('.typeahead.binf-dropdown-menu');
          expect(dropdown.length).toEqual(1);
          expect(dropdown.css('display') !== 'none').toBeTruthy();
          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(2);
          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Manager');
          expect(item.attr('title')).toEqual('Manager');
          input.val('af');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 200",200);

          TestUtil.run(done, function () {
            expect(clear.css('display')).toEqual('');
            var container = view.$el.find('.typeahead.scroll-container');
            expect(container.length).toEqual(1);
            expect(container.css('display') !== 'none').toBeTruthy();
            var xrail = container.find('.ps-scrollbar-x-rail');
            expect(xrail.length).toEqual(1);
            var yrail = container.find('.ps-scrollbar-y-rail');
            expect(yrail.length).toEqual(1);
            var dropdown = container.find('.typeahead.binf-dropdown-menu');
            expect(dropdown.length).toEqual(1);
            expect(dropdown.css('display') !== 'none').toBeTruthy();
            var items = container.find('.typeahead.binf-dropdown-menu > li');
            expect(items.length).toEqual(1);
            var item = $(items[0]).find('a > span > span');
            expect(item.length).toEqual(1);
            expect(item.text()).toEqual('Staff');
            expect(item.attr('title')).toEqual('Staff');
            input.trigger('blur');
            clear.trigger('click');
            expect(clear.css('display')).toEqual('');
            expect(input.val()).toEqual('');
            expect(container.css('display')).toEqual('none');
            expect(dropdown.css('display')).toEqual('none');
          });
        });
      });
    });

    describe('view filters', function () {

      var roles;
      var view;

      beforeEach(function () {
        roles = new Backbone.Collection([
          {
            name: 'Manager',
            inherited_from_id: undefined
          },
          {
            name: 'Staff',
            inherited_from_id: undefined
          },
          {
            name: 'Staff Council',
            inherited_from_id: 4711
          }
        ]);
        view = new RolePicker({
          roles: roles,
          prettyScrolling: true
        });
        view.render();
      });

      it('case-insensitive', function (done) {
        var input = view.$el.find('.typeahead.cs-search');
        input.val('man');
        input.trigger($.Event('keyup', {keyCode: 78}));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function () {
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(1);

          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Manager');
          expect(item.attr('title')).toEqual('Manager');
        });
      });

      it('contains-like', function (done) {
        var input = view.$el.find('.typeahead.cs-search');
        input.val('ff c');
        input.trigger($.Event('keyup', {keyCode: 67}));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function () {
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(1);

          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Staff Council');
          expect(item.attr('title')).toEqual('Staff Council');

        });
      });
    });

    describe('view sorts', function () {

      var roles;
      var view;

      beforeEach(function () {
        roles = new Backbone.Collection([
          {name: 'cab', inherited_from_id: undefined},
          {name: 'CAB', inherited_from_id: undefined},
          {name: 'abc', inherited_from_id: undefined},
          {name: 'ABC', inherited_from_id: undefined},
          {name: 'bca', inherited_from_id: undefined},
          {name: 'BCA', inherited_from_id: undefined}
        ]);
        view = new RolePicker({
          roles: roles,
          prettyScrolling: true
        });
        view.render();
      });

      it('case-insensitive', function (done) {
        var reference = new Backbone.Collection([
          {name: 'abc', inherited_from_id: undefined},
          {name: 'ABC', inherited_from_id: undefined},
          {name: 'bca', inherited_from_id: undefined},
          {name: 'BCA', inherited_from_id: undefined},
          {name: 'cab', inherited_from_id: undefined},
          {name: 'CAB', inherited_from_id: undefined}
        ]);
        reference.comparator = function (left, right) {
          return base.localeCompareString(left.get('name'), right.get('name'));
        };
        reference.sort();
        var input = view.$el.find('.typeahead.cs-search');
        input.val('c');
        input.trigger($.Event('keyup', {keyCode: 78}));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function () {
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(6);

          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual(reference.at(0).get('name'));

          item = $(items[1]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual(reference.at(1).get('name'));

          item = $(items[2]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual(reference.at(2).get('name'));

          item = $(items[3]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual(reference.at(3).get('name'));

          item = $(items[4]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual(reference.at(4).get('name'));

          item = $(items[5]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual(reference.at(5).get('name'));
        });
      });
    });

    describe('view fires events', function () {

      var roles;
      var view;

      beforeEach(function () {
        roles = new Backbone.Collection([
          {
            name: 'Manager',
            inherited_from_id: undefined
          },
          {
            name: 'Staff',
            inherited_from_id: undefined
          },
          {
            name: 'Staff Council',
            inherited_from_id: 4711
          }
        ]);
        view = new RolePicker({
          roles: roles,
          prettyScrolling: true
        });
        view.render();
      });

      it('when a role is selected', function (done) {
        var input = view.$el.find('.typeahead.cs-search');
        input.val('Manager');
        input.trigger($.Event('keyup', {keyCode: 65}));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function (done) {
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(1);

          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Manager');
          expect(item.attr('title')).toEqual('Manager');
          var flag = false;
          view.on('item:change', function (e) {
            flag = (e.item.get('name') === 'Manager');
          });
          var link = $(items[0]).find('a');
          link.trigger('click');
          TestUtil.justWait(done,"justWait 200",200);

          TestUtil.run(done,function () {
            expect(flag).toBeTruthy();
          });
        });
      });
    });

    describe('view opens on click', function () {

      var roles;
      var view;

      beforeEach(function () {
        roles = new Backbone.Collection([
          {
            name: 'Manager',
            inherited_from_id: undefined
          },
          {
            name: 'Staff',
            inherited_from_id: undefined
          },
          {
            name: 'Staff Council',
            inherited_from_id: 4711
          }
        ]);
        view = new RolePicker({
          roles: roles,
          prettyScrolling: true
        });
        view.render();
      });

      it('and returns unfiltered list', function (done) {
        var input = view.$el.find('.typeahead.cs-search');
        input.trigger($.Event('click'));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function () {
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(3);

          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Manager');
          item = $(items[1]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Staff');
          item = $(items[2]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Staff Council');
        });
      });

      it('and filters correct on second click', function (done) {
        var input = view.$el.find('.typeahead.cs-search');
        input.val('ff c');
        input.trigger($.Event('keyup', {keyCode: 67}));
        TestUtil.justWait(done,"justWait 200",200);

        TestUtil.run(done,function (done) {
          var container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          var items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(1);

          var item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Staff Council');
          expect(item.attr('title')).toEqual('Staff Council');
          input.trigger($.Event('click'));
          TestUtil.justWait(done,"justWait 200",200);
          container = view.$el.find('.typeahead.scroll-container');
          expect(container.length).toEqual(1);

          items = container.find('.typeahead.binf-dropdown-menu > li');
          expect(items.length).toEqual(1);

          item = $(items[0]).find('a > span > span');
          expect(item.length).toEqual(1);
          expect(item.text()).toEqual('Staff Council');
          expect(item.attr('title')).toEqual('Staff Council');
        });
      });
    });

  });
});