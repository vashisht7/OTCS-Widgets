/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/utils/contexts/factories/children',
  'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/list/list.state.view',
  './collection.state.mock.js',
  'csui/lib/jquery.mockjax'

], function ($, _, Backbone, Marionette, CollectionStateBehavior,
    ChildrenCollectionFactory, PageContext, ListItemStandardView, ListStateView, mock) {

  var context, ChildrenViewWithCollection, view, emptyCollectionview, collectionFecthFailedview,
      delayedCollectionView, collectionView,
      emptyCollection, collection, fetchFailedCollection, delayedCollection,
      viewwithCollectionStateOptions, customCollection;

  var emptyContainerNode      = {
        id: 2002
      },
      DelayContainer          = {
        id: 2001
      },
      container               = {
        id: 2003
      },
      continerwithFecthFailed = {
        id: 2004
      };

  if (!context) {
    context = new PageContext({
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
  }

  describe("CollectionStateBehavior with custom messages", function () {
    beforeAll(function () {
      mock.enable();

      collection = context.getCollection(ChildrenCollectionFactory, {
        attributes: container,
        node: {attributes: container}
      });

      if (!ChildrenViewWithCollection) {

        ChildrenViewWithCollection = Marionette.CollectionView.extend({
          className: 'my-tile',
          childView: ListItemStandardView,
          behaviors: {
            CollectionState: {
              behaviorClass: CollectionStateBehavior,
              stateMessages: {
                empty: 'No items found.',
                loading: 'Loading items...',
                failed: 'Loading items failed.'
              }
            }
          }
        });
      }

      view = new ChildrenViewWithCollection({
        collection: collection
      });

      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);

    });

    afterAll(function () {
      view.destroy();
      context.collection = undefined;
      mock.disable();
      $('body').empty();
    });

    it('view should have the behavior', function (done) {
      context.fetch().done(function () {
        expect(view._behaviors[0] instanceof CollectionStateBehavior).toBeTruthy();
        done();
      });
    });

    it('view should not have collection state div', function (done) {
      view.collection.fetch().done(function () {
        expect(view.$el.find('.csui-collection-state').length).toBe(0);
        done();
      });

    });

  });

  describe('collection state behavior with custom template helpers', function () {

    beforeAll(function () {
      mock.enable();

      var collectionwithFecthFailed      = context.getCollection(ChildrenCollectionFactory, {
            attributes: continerwithFecthFailed,
            node: {attributes: continerwithFecthFailed}
          }),

          viewwithCollectionStateOptions = Marionette.CollectionView.extend({
            className: 'my-tile',
            childView: ListItemStandardView,
            behaviors: {
              CollectionState: {
                behaviorClass: CollectionStateBehavior,
                stateMessages: {
                  empty: 'No objects found.',
                  loading: 'Loading objects...',
                  failed: 'Loading objects failed.'
                },
                stateViewOptions: {
                  template: _.template('<div> <%= message %> </div>'),
                  templateHelpers: function () {
                    var state = this.model.get('state');
                    return {message: this.options && this.options.stateMessages[state] || ""};
                  }
                }
              }
            }
          });

      collectionFecthFailedview = new viewwithCollectionStateOptions({
        collection: collectionwithFecthFailed
      });

      var FailedViewRegion = $('<div id="FailedViewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: FailedViewRegion
      }).show(collectionFecthFailedview);
    });

    afterAll(function () {
      collectionFecthFailedview.destroy();
      context.collection = undefined;
      $('body').empty();
      mock.disable();
    });

    it('view should have the behavior', function (done) {
      context.fetch().always(function () {
        expect(collectionFecthFailedview._behaviors[0] instanceof
               CollectionStateBehavior).toBeTruthy();
        done();
      });
    });

    it('view should  have failed collection state div', function (done) {
      collectionFecthFailedview.collection.fetch().always(function () {
        expect(collectionFecthFailedview.$el.find('.csui-collection-state').length).toBe(1);
        expect(collectionFecthFailedview.$el.find(
            '.csui-collection-state.csui-state-failed').length).toBe(1);
        expect(collectionFecthFailedview.$el.find(
            '.csui-collection-state.csui-state-failed').text().trim())
            .toBe('Loading objects failed.');
        done();
      });

    });

  });

  describe('collection state behavior with custom state view for empty message', function () {
    beforeAll(function () {
      mock.enable();

      var customStateViewwithCollectionState =
              Marionette.CollectionView.extend({
                className: 'my-tile',
                childView: ListItemStandardView,
                behaviors: {
                  CollectionState: {
                    behaviorClass: CollectionStateBehavior,
                    stateView: ListStateView,
                    stateMessages: {
                      empty: 'No Results Found.',
                      loading: 'Loading Results...',
                      failed: 'Loading Results failed.'
                    }
                  }
                }
              }),

          emptyCollection                    = context.getCollection(ChildrenCollectionFactory, {
            attributes: emptyContainerNode,
            node: {attributes: emptyContainerNode}
          });

      emptyCollectionview = new customStateViewwithCollectionState({
        collection: emptyCollection,
        context: context
      });

      var EmptyViewRegion = $('<div id="EmptyViewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: EmptyViewRegion
      }).show(emptyCollectionview);

    });

    afterAll(function () {
      emptyCollectionview.destroy();
      context.collection = undefined;
      mock.disable();
      $('body').empty();
    });

    it('view should have empty collection state div', function () {
      context.fetch().done(function () {
        expect(emptyCollectionview.$el.find(
            '.cs-emptylist-container.csui-collection-state').length).toBe(1);
        expect(emptyCollectionview.$el.find('.csui-collection-state.csui-state-empty').length).toBe(
            1);
        expect(
            emptyCollectionview.$el.find('.csui-collection-state.csui-state-empty').text().trim())
            .toBe(' No Results Found.');
      });

    });
  });

  describe('collection state with custom collection', function () {

    beforeAll(function () {
      mock.enable();
      var ViewCollection    = Marionette.CollectionView.extend({
            className: 'my-tile',
            childView: ListItemStandardView,
            behaviors: {
              CollectionState: {
                behaviorClass: CollectionStateBehavior,
                collection: customCollection,
                stateMessages: {
                  empty: 'No items found.',
                  loading: 'Loading items...',
                  failed: 'Loading items failed.'
                }
              }
            }
          }),

          delayedCollection = context.getCollection(ChildrenCollectionFactory, {
            attributes: DelayContainer,
            node: {attributes: DelayContainer}
          });

      delayedCollectionView = new ViewCollection({
        collection: delayedCollection,
        context: context
      });

      customCollection = new Backbone.Collection({name: 'items1'}, {name: "item2"});

      var DelayedViewRegion = $('<div id="DelayedViewRegion"></div>').appendTo(document.body);

      new Marionette.Region({
        el: DelayedViewRegion
      }).show(delayedCollectionView);
      context.fetch();
    });

    afterAll(function () {
      delayedCollectionView.destroy();
      context.collection = undefined;
      $('body').empty();
      mock.disable();
    });

    it('view should show loading message', function () {
      expect(delayedCollectionView.$el.find('.csui-collection-state').length).toBe(1);
      expect(
          delayedCollectionView.$el.find('.csui-collection-state.csui-state-loading').length).toBe(
          1);
      expect(delayedCollectionView.$el.find(
          '.csui-collection-state.csui-state-loading').text().trim()).toBe("Loading items...");
    });

  });

});
