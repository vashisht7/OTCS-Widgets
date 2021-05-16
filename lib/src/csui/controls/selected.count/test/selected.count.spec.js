/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
      'csui/lib/backbone', 'csui/lib/marionette',
      'csui/controls/selected.count/selected.count.view',
      "../../../utils/testutils/async.test.utils.js",
      'csui/lib/handlebars.helpers.xif'],
    function (_, $, Backbone, Marionette, SelectedCountView, TestUtils) {

      describe('Select Counter View', function () {
        var selectedCountView, region, counter, selectedItems;

        beforeAll(function (done) {
          region = new Marionette.Region({
            el: $('<div class="csui-selected-count"></div>').appendTo(document.body)
          });
          selectedItems = new Backbone.Collection();
          selectedCountView = new SelectedCountView({
            collection: selectedItems
          });
          selectedCountView.listenTo(selectedCountView, 'show', done);
          region.show(selectedCountView);
        });

        afterAll(function () {
          TestUtils.cancelAllAsync();

          region.reset();
          region.destroy();
          TestUtils.restoreEnvironment();
        });

        it('Render the counter icon', function () {
          expect(selectedCountView.isRendered).toBeTruthy();
          expect(selectedCountView.$el.is(':visible')).toBeFalsy();
        });

        it('shows selected counter after adding collection', function () {
          selectedItems.add({
            name: 'model_1'
          });
          selectedItems.add({
            name: 'model_2'
          });
          selectedItems.add({
            name: 'model_2'
          });
          selectedItems.add({
            name: 'model_3'
          });
          expect(selectedCountView.$el.is(':visible')).toBeTruthy();
        });

        it('Click on counter Icon , show drop-down', function () {
          counter = selectedCountView.ui.selectedCountButton;
          counter.trigger('click');
          expect(counter.attr('aria-expanded')).toEqual("true");
          expect(selectedCountView.ui.dropdownContainer.is(':visible')).toBeTruthy();
        });

        it('Check length of the Drop-down, same as collection', function () {
          expect(selectedCountView.children.length).toEqual(selectedCountView.collection.length);
        });

        it('toggled on button dropdown should close', function () {
          selectedCountView.ui.selectedCountButton.trigger('click');
          expect(counter.attr('aria-expanded')).toEqual("false");

        });

        it('delete 1 item from drop-down, counter value should get update', function () {
          var deleteIcon = selectedCountView.$el.find(
              '.csui-selected-item .csui-deselcted-icon:first');
          var actualLength = selectedCountView.collection.length;
          deleteIcon.trigger('click');
          expect(parseInt(selectedCountView.ui.selectedCountValue.text()))
              .toEqual(actualLength - 1);
        });

        it('add 1 item to the collection, counter value should get update', function () {
          var actualLength = selectedCountView.collection.length;
          selectedItems.add({name: 'hello'});
          expect(selectedCountView.collection.length).toBeGreaterThan(actualLength);
          expect(parseInt(selectedCountView.ui.selectedCountValue.text()))
              .toEqual(actualLength + 1);
        });

        it('Check presence of Clear all Button', function () {
          expect(selectedCountView.ui.clearAll.is(':visible')).toBeFalsy();
          selectedItems.add({name: 'world'});
          expect(selectedCountView.collection.length).toBeGreaterThan(4);
          selectedCountView.ui.selectedCountButton.trigger('click');
          expect(selectedCountView.ui.clearAll.is(':visible')).toBeTruthy();
        });

        xit('Click on Clear all Button, shows confirmation dialog, click on cancel should remain dropdown',
            function (done) {
              selectedCountView.ui.ClearAllButton.trigger('click');
              TestUtils.asyncElement(document.body,
                  '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                  function (el) {
                    expect(el.length).toEqual(1);
                    var cancel = el.find('button[title="No"]'),
                        yes    = el.find('button[title="Yes"]');
                    expect(cancel.length).toEqual(1);
                    expect(yes.length).toEqual(1);
                    cancel.trigger('click');
                    expect(selectedCountView.ui.dropdownContainer.is(':visible')).toBeTruthy();
                    done();
                  });
            });

        xit('Click on Clear all Button, shows confirmation dialog, click on yes should clear all selection',
            function (done) {
              selectedCountView.ui.ClearAllButton.trigger('click');
              TestUtils.asyncElement(document.body,
                  '[aria-hidden="false"] [role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                  function (el) {
                    expect(el.length).toEqual(1);
                    var yes = el.find('button[title="Yes"]');
                    expect(yes.length).toEqual(1);
                    expect(selectedCountView.ui.dropdownContainer.is(':visible')).toBeTruthy();
                    yes.trigger('click');
                    setTimeout(function(){
                      expect(selectedCountView.ui.dropdownContainer.is(':visible')).toBeFalsy();
                      expect(selectedCountView.collection.length).toEqual(0);
                      done();
                    }, 500);
                  });
            });
      });
    });