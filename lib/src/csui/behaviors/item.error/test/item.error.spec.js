/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/lib/underscore',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/node',
  'csui/behaviors/item.error/item.error.behavior',
  '../../../utils/testutils/async.test.utils.js',
  './item.error.mock.js',
  'csui/lib/binf/js/binf'
], function ($, Backbone, Marionette, _, PageContext,
    NodeModelFactory, ItemErrorBehavior, TestUtils, mock) {
  var view,
      context               = new PageContext({
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
      }),

      nodeWithErrorTemplate =
          '<div class="my-header"> Node Information </div>' +
          '<div class="my-content"> <p>{{name}}</p> </div>' +
          '<div class="my-error" style="display: none"></div>';

  describe("ItemError behavior", function () {
    var view,
        viewWithItemErrorBehavior = Marionette.ItemView.extend({
          className: 'my-tile',
          template: _.template('<div> <%= name %> </div>'),
          behaviors: {
            ItemError: {
              behaviorClass: ItemErrorBehavior
            }
          },
          modelEvents: {
            change: 'render'
          }
        });

    beforeAll(function () {
      mock.enable();
      view = new viewWithItemErrorBehavior({
        model: context.getModel(NodeModelFactory, {
          attributes: {id: 2002}
        })
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      mock.disable();
      view.destroy();
      $('body').empty();
    });

    it('behavior should instatiate with view', function (done) {
      context.fetch().always(function () {
        expect(view._behaviors[0] instanceof ItemErrorBehavior).toBeTruthy();
        done();
      });
    });

  });

  describe('item error behavior with custom model', function () {
    var ViewWithViewModel = Marionette.ItemView.extend({
      className: 'my-tile',
      template: _.template('<div> <%= name %> </div>'),
      behaviors: {
        ItemError: {
          behaviorClass: ItemErrorBehavior,
          model: function () {
            return this.backendModel;
          }
        }
      },
      modelEvents: {
        change: 'render'
      },
      constructor: function NodeViewWithViewModel(options) {
        this.backendModel = options.model;
        options.model = new Backbone.Model(this.backendModel.attributes);
        Marionette.ItemView.prototype.constructor.call(this, options);
      }
    });

    beforeAll(function () {
      mock.enable();
      view = new ViewWithViewModel({
        model: context.getModel(NodeModelFactory, {
          attributes: {id: 2002}
        })
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      mock.disable();
      view.destroy();
      $('body').empty();
    });

    it('behavior should instatiate with view', function (done) {
      context.fetch().always(function () {
        expect(view._behaviors[0] instanceof ItemErrorBehavior).toBeTruthy();
        done();
      });
    });
  });

  describe("item error with custom element", function () {
    var allReg;
    var NodeViewWithErrorElement = Marionette.ItemView.extend({
      className: 'my-tile',
      template: _.template(nodeWithErrorTemplate),
      ui: {
        content: '.my-content',
        error: '.my-error'
      },
      behaviors: {
        ItemError: {
          behaviorClass: ItemErrorBehavior,
          el: '.my-error'
        }
      },
      modelEvents: {
        change: 'render'
      },
      onRender: function () {
        if (this.model.error) {
          this.ui.content.hide();
          this.ui.error.show();
        } else {
          this.ui.content.show();
          this.ui.error.hide();
        }
      }
    });

    beforeAll(function () {
      mock.enable();
      view = new NodeViewWithErrorElement({
        model: context.getModel(NodeModelFactory, {
          attributes: {id: 2002}
        })
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
      allReg = $(document.body).find('#viewRegion');
      allReg.css('width','470px');
    });

    afterAll(function () {
      mock.disable();
      view.destroy();
      $('body').empty();
    });

    it('display error view in custom error element', function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        done();
      });

    });

    it("show pop over with the mouseenter event", function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        var listItem = view.$el.find('.csui-error.content-tile');
        listItem.trigger('mouseenter');
        expect(listItem.find('.binf-popover.binf-in').length).toEqual(1);
        done();
      });
    });

    it("hover on the errorItem, renders pop over-left Side", function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        allReg.css('float', 'left');
        var listItem = view.$el.find('.csui-error.content-tile');
        listItem.trigger('mouseenter');
        expect(listItem.find('.binf-popover.binf-right.binf-in').length).toEqual(1);
        done();
      });
    });

    it("hover on the errorItem, renders pop over- right side", function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        allReg.css('float', 'right');
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        var listItem = view.$el.find('.csui-error.content-tile');
        listItem.trigger('mouseenter');
        expect(listItem.find('.binf-popover.binf-left.binf-in').length).toEqual(1);
        done();
      });
    });

    it("hover on the errorItem, renders pop over - down Side", function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        var message = "Item cannot be accessed.Set lengthy message to get popover down, for case when not enough space is available on either right or left side.";
        view.$el.find('.csui-message').text(message);
        allReg.css({'width': '100%'});
        var listItem = view.$el.find('.csui-error.content-tile');
        listItem.trigger('mouseenter');
        expect(listItem.find('.binf-popover.binf-bottom.binf-in').length).toEqual(1);
        done();
      });
    });

    it("hover on the errorItem, renders pop over - Up Side", function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        var message = "Item cannot be accessed.Set lengthy message to get popover down, for case when not enough space is available on either right or left side.";
        view.$el.find('.csui-message').text(message);
        allReg.css({'position': 'fixed', 'bottom': '0'});
        var listItem = view.$el.find('.csui-error.content-tile');
        listItem.trigger('mouseenter');
        expect(listItem.find('.binf-popover.binf-top.binf-in').length).toEqual(1);
        done();
      });
    });

    it("pop over will disapper with the mouseleave event", function (done) {
      context.fetch().always(function () {
        var contentEle = view.$el.find('.my-content');
        expect(contentEle.is(":visible")).toBeFalsy();
        var errorEle = view.$el.find('.my-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        var listItem = view.$el.find('.csui-error.content-tile');
        listItem.trigger('mouseenter');
        TestUtils.asyncElement(listItem,
            '.binf-popover-content').done(
            function (el) {
              expect(el.length).toEqual(1);
              expect(listItem.find('.binf-popover.binf-in').length).toEqual(1);
              listItem.trigger('mouseleave');
              expect(listItem.find('.binf-popover.binf-in').length).toEqual(0);
              done();
            });
      });
    });
  });

  describe('ItemErrorBehaviorwithCustomErrorRegion', function () {
    var NodeViewWithErrorRegion = Marionette.LayoutView.extend({
      className: 'my-tile',
      template: _.template(nodeWithErrorTemplate),
      regions: {
        error: '.my-content'
      },
      behaviors: {
        ItemError: {
          behaviorClass: ItemErrorBehavior,
          region: function () {
            return this.error;
          }
        }
      },
      modelEvents: {
        change: 'render'
      }
    });

    beforeAll(function () {
      mock.enable();
      view = new NodeViewWithErrorRegion({
        model: context.getModel(NodeModelFactory, {
          attributes: {id: 2002}
        })
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      mock.disable();
      view.destroy();
      $('body').empty();
    });

    it('display error view in custom error region', function (done) {
      context.fetch().always(function () {
        var errorEle = view.$el.find('.my-content');
        expect(errorEle.is(":visible")).toBeTruthy();
        done();
      });

    });
  });

  describe('ItemErrorWithErrorViewClass', function () {

    var ErrorView            = Marionette.ItemView.extend({
          className: 'item-error',
          template: _.template('<div> <%= message %> </div>')
        }),

        NodeViewWithErroView = Marionette.ItemView.extend({
          className: 'my-tile',
          template: _.template('<div> <%= name %> </div>'),
          behaviors: {
            ItemError: {
              behaviorClass: ItemErrorBehavior,
              errorView: ErrorView,
              errorViewOptions: {
                templateHelpers: function () {
                  return {message: this.model.get('name') || this.model.error};
                }
              }
            }
          },
          modelEvents: {
            change: 'render'
          }
        });

    beforeAll(function () {
      mock.enable();
      view = new NodeViewWithErroView({
        model: context.getModel(NodeModelFactory, {
          attributes: {id: 2002}
        })
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      mock.disable();
      view.destroy();
      $('body').empty();
    });

    it('display error view in custom error region', function (done) {
      context.fetch().always(function () {
        var errorEle = view.$el.find('.item-error');
        expect(errorEle.is(":visible")).toBeTruthy();
        done();
      });

    });

  });

  describe('ItemErrorWithErrorViewClass', function () {

    var ErrorView            = Marionette.ItemView.extend({
          className: 'item-error',
          template: _.template('<div> <%= message %> </div>')
        }),

        NodeViewWithErroView = Marionette.ItemView.extend({
          className: 'my-tile',
          template: _.template('<div> <%= name %> </div>'),
          behaviors: {
            ItemError: {
              behaviorClass: ItemErrorBehavior,
              errorView: function () {
                return ErrorView;
              }
            }
          },
          modelEvents: {
            change: 'render'
          }
        });

    beforeAll(function () {
      mock.enable();
      view = new NodeViewWithErroView({
        model: context.getModel(NodeModelFactory, {
          attributes: {id: 2001}
        })
      });
      var viewRegion = $('<div id="viewRegion"></div>').appendTo(document.body);
      new Marionette.Region({
        el: viewRegion
      }).show(view);
    });

    afterAll(function () {
      mock.disable();
      view.destroy();
      $('body').empty();
    });

    it('display error view in custom error region', function (done) {
      context.fetch().always(function () {
        var errorEle = view.$el.find('.item-error');
        expect(errorEle.is(":visible")).toBeFalsy();
        done();
      });

    });

  });

});
