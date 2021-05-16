/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/lib/backbone',
    'conws/controls/description/description.view'
  ], function ($, _, Marionette, Backbone, DescriptionView) {
  
    describe("DescriptionView", function () {
      var descriptionView;
  
      beforeAll(function (done) {
  
        descriptionView = new DescriptionView({
            complete_desc: "Hello this is Description. Hello this is Description.",
            has_more_desc: false, 
            collapsedHeightIsOneLine: true, 
            hideShowLess: true
        });
        descriptionView.render();
        $('body').append(descriptionView.$el);
        done();
      });
  
      it("can be instantiated", function () {
        expect(descriptionView instanceof DescriptionView).toBeTruthy();
      });
  
      it("has description", function (done) {       
        var el = descriptionView.$el;        
        var description = el.find(".description");
        expect(description.length).toBeGreaterThan(0);
        expect(description.text()).toEqual("Hello this is Description. Hello this is Description.");
  
        done();
      });
  
    });
  
  });
  