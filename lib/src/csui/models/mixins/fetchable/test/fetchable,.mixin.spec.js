/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/mixins/fetchable/fetchable.mixin'
], function (Backbone, FetchableMixin) {
  'use strict';

  describe('FetchableMixin', function () {
    describe('when applied to a model', function () {
      var TestModel = Backbone.Model.extend({
        constructor: function TestModel(attributes, options) {
          Backbone.Model.prototype.constructor.apply(this, arguments);
          this.makeFetchable(options);
        }
      });
      FetchableMixin.mixin(TestModel.prototype);

      beforeEach(function () {
        this.model = new TestModel();
      });

      describe('and calling prefetch', function () {
        it('honours the silent option', function (done) {
          var triggered;
          this.model
              .on('request change sync', function () {
                triggered = true;
              })
              .prefetch({id: 2000}, {silent: true})
              .done(function () {
                expect(triggered).toBeFalsy();
                done();
              });
        });
      });
    });

    describe('when applied to a collection', function () {
      var TestCollection = Backbone.Collection.extend({
        constructor: function TestCollection(models, options) {
          Backbone.Collection.prototype.constructor.apply(this, arguments);
          this.makeFetchable(options);
        }
      });
      FetchableMixin.mixin(TestCollection.prototype);

      beforeEach(function () {
        this.collection = new TestCollection();
      });

      describe('and calling prefetch', function () {
        function checkEventTriggered(name, options, done) {
          var triggered;
          this.collection
              .on(name, function () {
                triggered = true;
              })
              .prefetch([{}], options)
              .done(function () {
                expect(triggered).toBeTruthy();
                done();
              });
        }

        it('calls the set method by default', function (done) {
          checkEventTriggered.call(this, 'update', undefined, done);
        });

        it('honours the reset option', function (done) {
          checkEventTriggered.call(this, 'reset', {reset: true}, done);
        });

        it('honours the autoreset option', function (done) {
          this.collection.autoreset = true;
          checkEventTriggered.call(this, 'reset', undefined, done);
        });
      });
    });

    describe('in any case', function () {
      var TestModel = Backbone.Model.extend({
        parse: function (response) {
          response.parsed = true;
          return response;
        }
      });
      var TestCollection = Backbone.Collection.extend({
        model: TestModel,
        constructor: function TestCollection(models, options) {
          Backbone.Collection.prototype.constructor.apply(this, arguments);
          this.makeFetchable(options);
        }
      });
      FetchableMixin.mixin(TestCollection.prototype);

      beforeEach(function () {
        this.collection = new TestCollection();
      });

      it('calling prefetch uses the parse method by default', function (done) {
        this.collection
            .prefetch([{ fetched: true }])
            .then(function () {
              var firstModel = this.collection.first();
              expect(firstModel.get('fetched')).toBeTruthy();
              expect(firstModel.get('parsed')).toBeTruthy();
              done();
            }.bind(this));
      });

      it('calling prefetch allows specifying the parse option', function (done) {
        this.collection
            .prefetch([{ fetched: true }], { parse: false })
            .then(function () {
              var firstModel = this.collection.first();
              expect(firstModel.get('fetched')).toBeTruthy();
              expect(firstModel.get('parsed')).toBeFalsy();
              done();
            }.bind(this));
      });
    });
  });
});
