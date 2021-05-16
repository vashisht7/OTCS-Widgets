/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/limiting/limiting.behavior'
], function (Backbone, Marionette, LimitingBehavior) {
  'use strict';

  describe("LimitingBehavior", function () {
    beforeEach(function () {
      var completeCollection = new Backbone.Collection([
        { id: 1 }
      ]);
      var TextCollectionView = Marionette.CollectionView.extend({
        childView: Marionette.ItemView.extend({ template: false }),
        behaviors: {
          LimitedList: {
            behaviorClass: LimitingBehavior,
            completeCollection: completeCollection,
            limit: 0
          }
        }
      });
      this.collectionView = new TextCollectionView();
      this.completeCollection = completeCollection;
    });

    it('view collection is synchronised with the complete collection after constructing the view', function () {
      expect(this.collectionView.collection.length).toEqual(1);
    });

    it('adds items added to the complete collection to the view collection', function () {
      this.completeCollection.add({ id: 2 });
      expect(this.collectionView.collection.length).toEqual(2);
    });

    it('removes items removed from complete collection from the view collection', function () {
      this.completeCollection.remove(this.completeCollection.last());
      expect(this.collectionView.collection.length).toEqual(0);
    });
  });
});
