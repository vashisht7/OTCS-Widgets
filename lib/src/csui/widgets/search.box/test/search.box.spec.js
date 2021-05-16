/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/widgets/search.box/search.box.view',
  'csui/utils/contexts/page/page.context', './search.box.mock.js',
  'csui/utils/contexts/factories/search.box.factory',
  "../../../utils/testutils/async.test.utils.js"
], function (Marionette, _, $, SearchBoxView, PageContext, mock, SearchBoxFactory, TestUtils) {

  describe('SearchBoxView', function () {
    var pageContext, searchBoxView, searchboxModel;
    beforeAll(function () {
      pageContext = new PageContext({
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
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    describe('given empty configuration', function () {

      beforeAll(function () {
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        new Marionette.Region({
          el: document.body
        }).show(searchBoxView);        
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();
        TestUtils.restoreEnvironment();
      });

      it('can be constructed', function () {
        expect(searchBoxView instanceof SearchBoxView).toBeTruthy();
      });

      it('assigns right classes', function () {
        var className = searchBoxView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('csui-search-box');
      });

      it('should fetch the model', function (done) {
        var searchboxModel = pageContext.getModel(SearchBoxFactory);
        expect(searchboxModel.isFetchable()).toBeTruthy();
        searchboxModel.fetch().done(done);
      });

      it('should show options dropdown', function () {
        expect(searchBoxView.options.data.showOptionsDropDown).toBe(true);
      });

      it('should focus on downcaret', function () {
        expect(searchBoxView.ui.downCaret.trigger('focus')).toBeTruthy();
      });

      it('should clear on clearerClicked', function () {
        var e                 = jasmine.createSpyObj('e', ['preventDefault', 'stopPropagation']),
            inputField        = searchBoxView.ui.input,
            getInputTextValue = function (_ele) {
              var qryText = !!_ele ? _ele.val().trim() : '';
              return qryText;
            };
        inputField.val('query text 1');
        expect(getInputTextValue(inputField).length).toBeGreaterThan(0);
        searchBoxView.clearerClicked(e);
        expect(e.preventDefault).toHaveBeenCalled();
        expect(e.stopPropagation).toHaveBeenCalled();
        expect(searchBoxView.ui.searchIcon.removeClass(
            searchBoxView.options.data.customSearchIconEnabledClass).addClass(
            searchBoxView.options.data.customSearchIconClass)).toBeTruthy();
        expect(getInputTextValue(inputField).length).toBe(0);
      });

      it('should show search bar content on pressing spacebar', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
      });

      it('should show search bar content on pressing enter', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keypress', keyCode: 13});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
      });

      it('should hide search bar on pressing escape', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.csui-search').length).toEqual(0);
      });

      it('should show downCaret', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 13});
        expect(searchBoxView.ui.downCaret.trigger('focus')).toBeTruthy();
        expect(searchBoxView.ui.downCaret.hasClass('csui-search-box-slice-popover')).toBeTruthy();
      });

      it('should show downCaret', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.ui.downCaret.trigger('focus')).toBeTruthy();
        expect(searchBoxView.ui.downCaret.hasClass('csui-search-box-slice-popover')).toBeTruthy();
      });

      it('should hide options dropdown data on pressing escape', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 13});
        searchBoxView.ui.downCaret.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.binf-popover').length).toEqual(0);
      });

      it('should show search options dropdown on pressing enter', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 13});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
        expect(searchBoxView.$el.find('.csui-search-options-dropdown').length).toEqual(1);
        expect(searchBoxView.$el.find(".csui-searchbox-option:checked")).toBeTruthy();
      });

      it('should show search options dropdown on pressing spacebar', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
        expect(searchBoxView.$el.find('.csui-search-options-dropdown').length).toEqual(1);
        expect(searchBoxView.$el.find(".csui-searchbox-option:checked")).toBeTruthy();
      });

      it('should hide search options dropdown on pressing escape', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.$el.find('.csui-search-options-dropdown').length).toEqual(1);
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.csui-search').length).toEqual(0);
      });

    });
    describe('given configuration', function() {
       beforeAll(function (done) {
          searchBoxView = new SearchBoxView({
          context: pageContext,
          data: {
            showSearchInput : true,
            inputValue: "*",
            showOptionsDropDown: true
          }
        });
        new Marionette.Region({
          el: document.body
        }).show(searchBoxView);
        pageContext.fetch().done(done);
       });

      afterAll(function () {
        TestUtils.cancelAllAsync();
        TestUtils.restoreEnvironment();
      });

      it('should open search bar on ctrl + F3', function (done) {
        $(document).trigger({type: 'keydown', ctrlKey: true, keyCode: 114});
        TestUtils.asyncElement(searchBoxView.$el, ".search-bar:visible").done(
          function (el) {
           $(document).trigger({type: 'keydown', ctrlKey: true, keyCode: 114});
            expect(searchBoxView.ui.input.is(document.activeElement)).toBeTruthy();
            done();
          });
      });

      it('should show search bar on keydown of search', function() {
        searchBoxView.ui.input.val("*");
        searchBoxView.ui.searchIcon.trigger('click');
        expect(searchBoxView.$el.find('.search-bar:visible')).toBeTruthy();
      });

      it('should clear text on clicking clear', function(){
        searchBoxView.ui.input.val("Adding text");
        searchBoxView.ui.clearer.trigger({type: 'keydown', keyCode: 13});
        expect(searchBoxView.ui.input.val().length).toEqual(0);
      });

      it('sync perspective', function(done) {
        searchBoxView.listenTo(searchBoxView.searchboxModel,'change',function() {          
        expect(searchBoxView.searchboxModel.nodeName).toBeUndefined;
         done();
      });
      pageContext.trigger('sync:perspective');
    });

      it('should focusout on slice popover', function() {
        searchBoxView.ui.downCaret.trigger('focusout');
        searchBoxView.$el.find('.csui-search-box-slice-popover').trigger('focusout');
        expect(searchBoxView.$el.find('.csui-search-box-slice-popover').is(document.activeElement)).toBeFalsy();
      });

      it('show/hide slice popover', function() {    
        searchBoxView.ui.downCaret.trigger({type: 'keydown', keyCode: 13});
        searchBoxView.ui.downCaret.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.csui-search-box-slice-popover').is(document.activeElement)).toBeTruthy();
      });

      it('accessibility', function() {
        searchBoxView.ui.downCaret.trigger('focus');
        searchBoxView.ui.downCaret.trigger({type: 'keydown', keyCode: 32});
        searchBoxView.ui.downCaret.trigger({type: 'keydown', keyCode: 40});
        searchBoxView.$el.find('.csui-search-popover-row').trigger('focus');
        searchBoxView.$el.find('.csui-search-popover-row').trigger({type: 'keydown', keyCode: 13});
        /*Expectation will be updated*/ 
      });

      it('should trigger keydown on input element', function() {
        searchBoxView.ui.input.trigger({type: 'keydown', keycode: 65});
        searchBoxView.ui.input.trigger({type: 'keydown', which: 13});
        searchBoxView.ui.input.trigger({type: 'keydown', which: 40});
        /*Expectation will be updated*/ 
       }); 
     
      it('show/hide options drop down', function(done) {
        searchBoxView.ui.input.trigger('focusout');
        setTimeout(done, 2000);
        /*Expectation will be updated*/ 
      });
      
    });

  });

});

