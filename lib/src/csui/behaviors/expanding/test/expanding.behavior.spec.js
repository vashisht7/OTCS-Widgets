/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/list/list.view',
  '../../../utils/testutils/async.test.utils.js',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/lib/jquery.mockjax'

], function ($, _, Backbone, Marionette, ExpandingBehavior,
    PageContext, ListItemStandardView, ListView, TestUtils, TabableRegionBehavior) {
  var view, expandedDialogClose, expandableBehavior, header, listView,

      dialogClassName                  = 'expandedList',
      ListItemView                     = Marionette.ItemView.extend({
        className: 'binf-list-group-item',
        template: _.template('<span> <%= name %> </span>'),
        templateHelpers: function () {
          var name = this.model.get('name') || "";
          return name;
        }
      }),
      ItemCollection                   = Backbone.Collection.extend({
        setFilter: function () {
          return this.models;
        }
      }),

      collection                       = new ItemCollection(
          [{name: "item1"}, {name: "item2"}, {name: "item3"}, {name: "item4"}]),

      expandedItemsView                = Marionette.CollectionView.extend({
        attributes: {
          style: 'width: 100%; height: 100%; overflow: auto;'
        },
        childView: ListItemView
      }),

      expandedListView                 = ListView.extend({
        className: 'my-tile',
        attributes: {
          style: 'width: 50%%; height: 50%; overflow: auto;'
        },
        templateHelpers: function () {
          return {
            title: "List Items",
            hideSearch: true
          };
        },

        childView: ListItemStandardView,

        behaviors: {
          Expanding: {
            behaviorClass: ExpandingBehavior,
            expandedView: expandedItemsView,
            expandedViewOptions: function () {
              return {
                collection: collection
              };
            },
            dialogTitle: 'List view',
            dialogClassName: dialogClassName,
            titleBarIcon: null
          },
          TabableRegion: {
            behaviorClass: TabableRegionBehavior
          }
        },
        onClickHeader: function (target) {
          view.triggerMethod('expand');
        }
      }),

      expandedListViewwithEmptyOptions = ListView.extend({
        className: 'my-tile',
        attributes: {
          style: 'width: 50%%; height: 50%; overflow: auto;'
        },
        templateHelpers: function () {
          return {
            title: "List Items",
            hideSearch: true
          };
        },
        childView: ListItemStandardView,
        behaviors: {
          Expanding: {
            behaviorClass: ExpandingBehavior,
            expandedView: expandedItemsView
          }
        },
        onClickHeader: function (target) {
          view.triggerMethod('expand');
        }
      }),

      context                          = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

  describe('expanding behavior', function () {
    beforeAll(function () {
      view = new expandedListView({
        collection: collection,
        context: context
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      view.destroy();
      header = undefined;
      dialogClassName = undefined;
      expandedDialogClose = undefined;
      $('body').empty();
    });

    it('expand behavior is there after view instantiation', function () {
      var behaviors = view._behaviors;
      behaviors && behaviors.length && _.each(behaviors, function (behavior) {
        if (behavior instanceof ExpandingBehavior) {
          expandableBehavior = behavior;
        }
      });
      expect(expandableBehavior).toBeDefined();
    });

    it('expandedItems View by clicking on header', function (done) {
      var header = view.$el.find('.tile-header');
      header.length && header.trigger('click');
      TestUtils.asyncElement('body', '.binf-modal-content:visible').done(
          function (el) {
            expect(el.length).toBe(1);
            expandedDialogClose = el.find('.cs-close');
            expect(expandedDialogClose.length).toBe(1);
            done();
          });
    });

    it(' expandedItems dialog is not open by clicking on header second time', function (done) {
      header = view.$el.find('.tile-header');
      header.length && header.trigger('click');
      TestUtils.asyncElement('body', '.binf-modal-content:visible').done(
          function (el) {
            expect(el.length).toBe(1);
            expandedDialogClose = el.find('.cs-close');
            expect(expandedDialogClose.length).toBe(1);
            done();
          });
    });

    it('close expandedView by clicking on close button', function (done) {
      expandedDialogClose.length && expandedDialogClose.trigger('click');
      TestUtils.asyncElement('body', '.binf-modal-content', true).done(
          function (el) {
            expandedDialogClose = undefined;
            expect(el.length).toBe(0);
            done();
          });
    });

    it('set Filter on collection and expand view once agian', function (done) {
      view.currentFilter = {name: 'i'};
      header.length && header.trigger('click');
      TestUtils.asyncElement('body', '.binf-modal-content:visible').done(
          function (el) {
            expect(el.length).toBe(1);
            expandedDialogClose = el.find('.cs-close');
            expect(expandedDialogClose.length).toBe(1);
            expandedDialogClose.trigger('click');
            TestUtils.asyncElement('body', '.binf-modal-content', true).done(
                function (el) {
                  expandedDialogClose = undefined;
                  expect(el.length).toBe(0);
                  done();
                });
          });
    });

  });

  describe('expanding behavior with empty options', function () {
    beforeAll(function () {
      view = new expandedListViewwithEmptyOptions({
        collection: collection,
        context: context
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      view.destroy();
      header = undefined;
      dialogClassName = undefined;
      expandedDialogClose = undefined;
      $('body').empty();
    });

    it('expandedItems View by clicking on header', function (done) {
      header = view.$el.find('.tile-header');
      header.length && header.trigger('click');
      TestUtils.asyncElement('body', '.binf-modal-content:visible').done(
          function (el) {
            expect(el.length).toBe(1);
            var title = el.find('.tile-title.binf-modal-title.csui-heading');
            expandedDialogClose = el.find('.cs-close');
            expect(title.text().trim().length).toBe(0);
            expandedDialogClose.trigger('click');
            TestUtils.asyncElement('body', '.binf-modal-content', true).done(
                function (el) {
                  expandedDialogClose = undefined;
                  expect(el.length).toBe(0);
                  done();
                });
          });
    });
  });

  describe('expanding behavior with expanded view path', function () {
    beforeAll(function () {
      var expandedListViewwithExpandedViewPath = ListView.extend({
        className: 'my-tile',
        attributes: {
          style: 'width: 50%%; height: 50%; overflow: auto;'
        },
        templateHelpers: function () {
          return {
            title: "List Items",
            hideSearch: true
          };
        },
        childView: ListItemStandardView,
        behaviors: {
          Expanding: {
            behaviorClass: ExpandingBehavior,
            expandedView: "noExapndedView"
          }
        },
        onClickHeader: function (target) {
          listView.triggerMethod('expand');
        }
      });
      listView = new expandedListViewwithExpandedViewPath({
        collection: collection,
        context: context
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(listView);
    });

    afterAll(function () {
      listView.destroy();
      header = undefined;
      dialogClassName = undefined;
      expandedDialogClose = undefined;
      $('body').empty();
    });

    it('expanded view should not open by clicking on header',
        function (done) {
          header = listView.$el.find('.tile-header');
          header.length && header.trigger('click');
          TestUtils.asyncElement('body', '.binf-modal-content', true).done(
              function (el) {
                expect(el.length).toBe(0);
                done();
              });
        });
  });

});


