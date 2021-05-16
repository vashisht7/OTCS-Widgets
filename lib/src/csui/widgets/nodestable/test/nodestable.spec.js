/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/nodestable/nodestable.view',
  '../../../utils/testutils/async.test.utils.js', 'csui/utils/contexts/page/page.context',
  './nodestable.mock.js', 'csui/controls/fileupload/fileupload'
], function (Marionette, _, $, NodesTableView, TestUtils, PageContext, mock, fileUploadHelper) {
  'use strict';

  describe('Add node to NodestableView', function () {
    var collection, context, nodesTableView, childrenCollection, regionEl,
        factories = {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: 2000}
          }
        };

    beforeAll(function (done) {
      window.csui.require.config({
        config: {
          'csui/widgets/nodestable/nodestable.view': {
            useAppContainer: false
          }
        }
      });
      mock.enable(2002, 2029, 3001, 3029);
        context = new PageContext({
          factories: factories
        });
      if (!nodesTableView) {
        nodesTableView = new NodesTableView({
          context: context
        });
        childrenCollection = nodesTableView.collection;
        regionEl = $('<div></div>').appendTo(document.body);
        new Marionette.Region({
          el: regionEl
        }).show(nodesTableView);
        context.once('sync', function () {
          expect(childrenCollection.length).toEqual(30);
          expect(childrenCollection.sorting.sort).toEqual(['asc_type']);
        }).fetch()
            .then(function () {
              done();
            });
      } else {
        done();
      }
    });

    afterAll(function () {
      nodesTableView.destroy();
      TestUtils.cancelAllAsync();
      mock.disable();
      TestUtils.restoreEnvironment();
    });

    describe('on creation of 30 nodes, by default', function () {
      var pageLength, totalCount;

      it('uses page size of 30 items', function () {
        expect(childrenCollection.topCount).toEqual(30);
      });
      it('when page is full, adding an item increases total count and no of pages by 1',
          function (done) {
            pageLength = nodesTableView.$('.csui-pager .csui-pagination ul li').length;
            totalCount = childrenCollection.totalCount;
            expect(pageLength).toBe(1);
            var fileUploadController = fileUploadHelper.newUpload({
                  container: nodesTableView.container,
                  collection: childrenCollection
                }),
                fileUploads          = fileUploadController.uploadFiles;
            childrenCollection.once('add', function (fileUpload) {
              expect(childrenCollection.first()).toBe(fileUploads.first().node);
              expect(nodesTableView.$('.csui-pager .csui-pagination ul li').length).toEqual(
                  pageLength + 1);
              expect(childrenCollection.totalCount).toEqual(totalCount + 1);
              expect(childrenCollection.length).toEqual(childrenCollection.topCount);
              done();
            });
            fileUploadController.addFilesToUpload([{
                  file: new File(['Hello', 'World'], 'file1.txt', {type: 'text/plain'})
                }],
                collection = childrenCollection);
          });
      it('when next page contains 1 item, deleting that item should decrease the no of pages and total count by 1',
          function (done) {
            pageLength = nodesTableView.$('.csui-pager .csui-pagination ul li').length;
            totalCount = childrenCollection.totalCount;
            expect(pageLength).toEqual(2);
            childrenCollection.remove(childrenCollection.models[0]);
            expect(childrenCollection.totalCount).toEqual(totalCount - 1);
            TestUtils.asyncElement(nodesTableView.$el,
                ".csui-pager .csui-pagination ul li:nth-child(2)", true).done(
                function (page2) {
                  expect(page2.length).toEqual(0);
                  expect(nodesTableView.$('.csui-pager .csui-pagination ul li').length).toEqual(
                      pageLength - 1);
                  done();
                });
          });

      it('when page is not full, deleting an item decreases the total count by 1, no of pages should be same',
          function () {
            pageLength = nodesTableView.$('.csui-pager .csui-pagination ul li').length;
            totalCount = childrenCollection.totalCount;
            childrenCollection.remove(childrenCollection.models[0]);
            expect(childrenCollection.totalCount).toEqual(totalCount - 1);
            expect(nodesTableView.$('.csui-pager .csui-pagination ul li').length).toEqual(
                pageLength);
          });

      it('when page is not full, adding an item increases the total count by 1, no of pages should be same',
          function (done) {
            pageLength = nodesTableView.$('.csui-pager .csui-pagination ul li').length;
            totalCount = childrenCollection.totalCount;
            expect(pageLength).toBe(1);
            var fileUploadController = fileUploadHelper.newUpload({
                  container: nodesTableView.container,
                  collection: childrenCollection
                }),
                fileUploads          = fileUploadController.uploadFiles;
            childrenCollection.once('add', function (fileUpload) {
              expect(childrenCollection.first()).toBe(fileUploads.first().node);
              expect(nodesTableView.$('.csui-pager .csui-pagination ul li').length).toEqual(
                  pageLength);
              expect(childrenCollection.totalCount).toEqual(totalCount + 1);
              done();

            });
            fileUploadController.addFilesToUpload([
                  {
                    file: new File(['Hello', 'World'], 'file2.txt', {type: 'text/plain'})
                  }],
                collection = childrenCollection);
          });
    });
  });

  describe('NodesTableView', function () {
    var context, contextNoDescriptionNodes, contextWithDescriptionNodes,
        factories = {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: 2000}
          }
        };

    beforeAll(function () {
      window.csui.require.config({
        config: {
          'csui/widgets/nodestable/nodestable.view': {
            useAppContainer: false
          }
        }
      });
      mock.enable(2002, 2105, 3001, 3105);
      if (!context) {
        context = new PageContext({
          factories: factories
        });
      }

      if (!contextNoDescriptionNodes) {
        var factoriesWithoutDescriptions = _.deepClone(factories);
        factoriesWithoutDescriptions.node.attributes.id = 4000;  //4000 don't have any
        contextNoDescriptionNodes = new PageContext({
          factories: factoriesWithoutDescriptions
        });
      }

      if (!contextWithDescriptionNodes) {
        var factoriesWithDescriptions = _.deepClone(factories);
        factoriesWithDescriptions.node.attributes.id = 5000;  //5000 have description nodes
        contextWithDescriptionNodes = new PageContext({
          factories: factoriesWithDescriptions
        });
      }
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    describe('on creation, by default', function () {
      var nodesTableView, children, regionEl;
      beforeAll(function (done) {
        var viewStateModel = context && context.viewStateModel;
        if (viewStateModel) {
          context.viewStateModel.setSessionViewState('selected_nodes', []);
          context.viewStateModel.set(context.viewStateModel.CONSTANTS.STATE, {}, {silent: true});
          context.viewStateModel.set(context.viewStateModel.CONSTANTS.DEFAULT_STATE, {},
              {silent: true});
          context.viewStateModel.set('enabled', true);
        }
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: context
          });
          children = nodesTableView.collection;
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          context.once('sync', function () {
            expect(children.length).toEqual(30);
            expect(children.sorting.sort).toEqual(['asc_type']);
          })
              .fetch()
              .then(function () {
                done();
              });
        } else {
          done();
        }
      });
      afterAll(function () {
        nodesTableView.destroy();
        $('body').empty();
        regionEl && regionEl.remove();
        var viewStateModel = context && context.viewStateModel;
        if (viewStateModel) {
          context.viewStateModel.set('enabled', false);
        }
      });

      it('shows the first page', function () {
        expect(children.skipCount).toEqual(0);
        expect(_.max(performance.getEntriesByName('table_render'), function( measure){
          return measure.duration;
        }).duration).toBeLessThan(10000);

      });

      it('uses page size of 30 items', function () {
        expect(children.topCount).toEqual(30);
      });

      it('orders null', function () {
        expect(children.orderBy).toEqual(undefined);
      });

      it("click on search icon", function () {
        expect(nodesTableView.tableView.$el.find(
            '.csui-table-searchbox.binf-hidden').length).toEqual(1);
        var searchIcon = nodesTableView.tableView.$el.find('.csui-table-search-icon');
        searchIcon.trigger('click');
        expect(nodesTableView.tableView.$el.find(
            '.csui-table-searchbox:visible').length).toEqual(1);
        expect(nodesTableView.tableView.$el.find(
            '.icon-search-hide:visible').length).toEqual(1);
      });

      it("search for any term", function (done) {
        TestUtils.asyncElement($('body'), ".csui-table-search-input").done(
            function (searchBox) {
              searchBox.val('i');
              searchBox.trigger('change');
              expect(nodesTableView.tableView.$el.find(
                  '.sbclearer.formfield_clear:visible').length).toEqual(1);
              done();
            });
      });

      it("click on clear icon", function () {
        var clearIcon = nodesTableView.tableView.$el.find(
            '.sbclearer.formfield_clear');
        clearIcon.trigger('click');
        expect(nodesTableView.tableView.$el.find(
            '.csui-table-searchbox:visible').length).toEqual(1);
        expect(nodesTableView.tableView.$el.find(
            '.sbclearer.formfield_clear:visible').length).toEqual(0);
      });

      it('does not filter', function () {
        expect(children.filters).toEqual({});
      });

      it("show facet panel on clicking filter icon", function (done) {
        TestUtils.asyncElement($('body'),
            ".csui-filterToolbar li[data-csui-command='filter'] .csui-toolitem").done(
            function (el) {
              expect(el.length).toEqual(1);
              var location = nodesTableView.$el.find('.csui-parent-location');
              expect(location.length).toEqual(0);
              el.trigger('click');
              done();
            });
      });

      it("show location on applying filters", function (done) {
        TestUtils.asyncElement($('body'), ".csui-filter-name").done(
            function (el) {
              expect(el).toBeTruthy();
              el[0].click();
              var location = nodesTableView.$el.find('.csui-parent-location');
              expect(location.length).toEqual(children.length);
              TestUtils.asyncElement(nodesTableView.$el, ".csui-facet-bar-hidden", true).done(
                  function () {
                    expect(nodesTableView.$el.find(
                        '.csui-table-spacing-medium.csui-table-empty').length).toEqual(1);
                    done();
                  });
            });
      });

      it("clear filters on clicking clear-all icon", function (done) {
        var clearAllButton = nodesTableView.$el.find('.csui-clear-all');
        clearAllButton.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el, ".csui-table-empty", true).done(
            function () {
              expect(nodesTableView.$el.find('.csui-facet-panel').length).toEqual(1);
              expect(nodesTableView.$el.find('.csui-saved-item').length).toEqual(children.length);
              done();
            });
      });
    });

    describe('persist select count on multiple pages', function () {
      var nodesTableView, children, regionEl;
      beforeAll(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: context
          });

          children = nodesTableView.collection;

          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          var fetching = context
              .on('sync', function () {
              })
              .fetch()
              .done(function () {
                done();
              })
              .fail(function () {
                expect(fetching.state()).toBe('resolved',
                    "Loading: context was not fetched in time");
              });

        } else {
          done();
        }
      });

      afterAll(function () {
        nodesTableView.destroy();
        $('body').empty();
        regionEl && regionEl.remove();
      });

      it('select the checkbox for any item in nodestable view, counter icon should appear',
          function () {
            var selectCheckBox = nodesTableView.tableView.$el.find('.csui-checkbox-view button')[0];
            selectCheckBox.click();
            expect(nodesTableView.$el.find(
                '.csui-selected-counter-region .csui-selected-counter-value:visible').length).toEqual(
                1);
            expect(parseInt(nodesTableView.$el.find(
                '.csui-selected-counter-region .csui-selected-counter-value').text()))
                .toEqual(nodesTableView._allSelectedNodes.length);
          });

      it('click on select counter , should open drop-down', function () {
        var counter = nodesTableView.$el.find('.csui-selected-counter-region button');
        counter.trigger('click');
        expect(counter.attr('aria-expanded')).toEqual("true");
        expect(nodesTableView.$el.find(".csui-selected-item").length).toBe(30);
      });

      it('Click on Clear all Button, shows confirmation dialog, click on cancel should remain dropdown',
          function (done) {
            nodesTableView.$el.find('.csui-selected-count-clearall > span').trigger('click');
            TestUtils.asyncElement(document.body,
                '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var cancel = el.find('button[title="No"]'),
                      yes    = el.find('button[title="Yes"]');
                  expect(cancel.length).toEqual(1);
                  expect(yes.length).toEqual(1);
                  cancel.trigger('click');
                  TestUtils.asyncElement(document.body, '.binf-modal-content', true).done(
                      function (el) {
                        expect(nodesTableView.$el.find(
                            '.csui-dropmenu-container:visible').length).toBe(1);
                        expect(nodesTableView.$el.find(
                            '.csui-selected-items-dropdown:visible').length).toEqual(1);
                        done();
                      });
                });
          });

      it('click on unselect icon from drop-down in counter, unselect item from result page',
          function () {

            var collectionLength = nodesTableView._allSelectedNodes.length,
                unselectIcon     = nodesTableView.$el.find(
                    '.csui-selected-item .csui-deselcted-icon')[0],
                unselectItemName = nodesTableView.$el.find(
                    '.csui-selected-item .csui-selected-list-item-name').first().text();
            unselectIcon.click();

            expect(nodesTableView._allSelectedNodes.length).toBe(collectionLength - 1);
            expect(parseInt(nodesTableView.$el.find(
                '.csui-selected-counter-region .csui-selected-counter-value').text()))
                .toEqual(collectionLength - 1);
            expect(nodesTableView.$el.find(
                '.csui-checkbox-view button[title~="' + unselectItemName +
                '"] ').parents('.selected').length).toBe(0);
          });

      it('move to page 2, should get table-actions and counter icon', function (done) {
        var page2 = nodesTableView.$el.find(
            '.csui-paging-navbar > ul > li:not(.csui-overflow) > a')[1];
        nodesTableView.$el.find('.csui-tabletoolbar ul').empty();
        page2.click();
        TestUtils.asyncElement(nodesTableView.$el, '.csui-tabletoolbar li').done(function (el) {
          expect(nodesTableView.$el.find(
              '.csui-selected-counter-region .csui-selected-counter-value:visible').length).toEqual(
              1);
          expect(el.length).toBeGreaterThan(0);
          expect(nodesTableView.$el.find(
              ".csui-control.csui-checkbox[title='Select all items'][aria-checked='false']").length).toBe(
              1);
          done();
        });

      });

      it('move back to page 1', function (done) {
        var page1 = nodesTableView.$el.find(
            '.csui-paging-navbar > ul > li:not(.csui-overflow) > a')[0];
        nodesTableView.$el.find('.csui-tabletoolbar ul').empty();
        page1.click();
        TestUtils.asyncElement(nodesTableView.$el, '.csui-tabletoolbar li').done(function (el) {
          expect(nodesTableView.$el.find(
              '.csui-selected-counter-region .csui-selected-counter-value:visible').length).toEqual(
              1);
          expect(el.length).toBeGreaterThan(0);
          expect(nodesTableView.$el.find(
              ".csui-control.csui-checkbox[title='Select all items'][aria-checked='mixed']").length).toBe(
              1);
          done();
        });

      });

      it('navigates away from the container the selction should be dropped', function () {
        nodesTableView.$el.find('tr.csui-saved-item:first').trigger('click');
        children.node.set('id', 2001);
        expect(nodesTableView._allSelectedNodes.length).toBe(0);
        expect(nodesTableView.$el.find(
            '.csui-selected-counter-region .csui-selected-items-dropdown:visible').length).toEqual(
            0);
        expect(nodesTableView.$el.find(
            ".csui-select-all.csui-search-item-check button[aria-checked='true']").length).toBe(0);
      });

      it('click on clearAll icon, reset all selection', function (done) {

        var selectCheckBox = nodesTableView.tableView.$el.find('.csui-checkbox-view button')[0];
        selectCheckBox.click();
        var selectCountButton = nodesTableView.$el.find(
            '.csui-selected-counter-region button:visible');
        if (nodesTableView.$el.find('.csui-dropmenu-container:visible')) {
          selectCountButton.trigger('click');
        }
        nodesTableView.$el.find('.csui-selected-count-clearall > span').trigger('click');
        TestUtils.asyncElement(document.body,
            '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
            function (el) {
              expect(el.length).toEqual(1);
              var yes = el.find('button[title="Yes"]');
              expect(yes.length).toEqual(1);
              yes.trigger('click');
              TestUtils.asyncElement(document.body, '.binf-modal-content', true).done(
                  function (el) {
                    expect(nodesTableView._allSelectedNodes.length).toBe(0);
                    expect(nodesTableView.$el.find(
                        '.csui-selected-counter-region .csui-selected-count-value:visible').length).toEqual(
                        0);
                    expect(nodesTableView.$el.find(
                        '.csui-selected-items-dropdown:visible').length).toEqual(0);
                    expect(nodesTableView.$el.find(
                        ".csui-select-all.csui-search-item-check button[aria-checked='true']").length).toBe(
                        0);
                    done();
                  });
            });
      });

    });

    describe('on drill down, by default', function () {
      var nodesTableView, children, regionEl;
      beforeEach(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: context
          });

          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);

          children = nodesTableView.collection
              .on('sync', function () {
                collectionCallback();
              });
          var collectionCnt = 0;
          var collectionCallback = _.after(1, function () {
            ++collectionCnt;
            if (collectionCnt === 1) {
              expect(children.length).toEqual(30);
              nodesTableView.tableView.setFilter({name: 'Child'});
              children.setFilter({name: 'Child'});
            } else if (collectionCnt === 2) {
              expect(children.filters.name).toEqual('Child');
              nodesTableView.tableView.table.order([2, 'desc']);
              children.setOrder('name desc');
            } else if (collectionCnt === 3) {
              expect(children.orderBy).toEqual('name desc');
              nodesTableView.paginationView.setPageSize(100, false);
              nodesTableView.paginationView.changePage(1);
            } else if (collectionCnt === 4) {
              expect(children.skipCount).toEqual(100);
              nodesTableView.facetFilters.clearFilter();
              children.clearFilter(false);
            } else if (collectionCnt === 8) {
              contextCallback();
            } else {
            }
          });
          var contextCnt = 0;
          var contextCallback = _.after(1, function () {
            ++contextCnt;
            if (contextCnt === 3) {
              expect(children.length).toEqual(1);
              expect(children.first().get('id')).toEqual(3000);
              done();
            }
          });
          var fetching = context
              .on('sync', function () {
                contextCallback();
                done();
              })
              .fetch()
              .fail(function () {
                expect(fetching.state()).toBe('resolved',
                    "Loading: context was not fetched in time");
              });

        } else {
          done();
        }
      });

      afterAll(function () {
        nodesTableView.destroy();
        $('body').empty();
        regionEl.remove();
      });

      it('resets to the first page', function () {
        expect(children.skipCount).toEqual(0);
      });

      it('update sorting with name desc', function () {
        expect(children.orderBy).toEqual('name desc');
      });

      it('update page size with 100', function () {
        expect(children.topCount).toEqual(100);
      });

      it('resets filtering', function () {
        expect(children.filters.name).toEqual(undefined);
        expect(children.filters.facet).toEqual([]);
      });
    });

    describe('folder with no description', function () {
      var nodesTableView, regionEl;
      beforeEach(function (done) {
        var self = this;
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: contextNoDescriptionNodes
          });
          contextNoDescriptionNodes.fetch().then(function () {
            regionEl = $('<div></div>').appendTo(document.body);
            new Marionette.Region({
              el: regionEl
            }).show(nodesTableView);
            self.view = nodesTableView;
            self.row = nodesTableView.$el.find(".csui-saved-item[role='row']").first().parent();
            done();
          });
        } else {
          this.view = nodesTableView;
          this.row = nodesTableView.$el.find(".csui-saved-item[role='row']").first().parent();
          done();
        }
      });
      afterAll(function () {
        $('body').empty();
        regionEl.remove();
      });

      it('should not show description toggle icon', function () {
        expect(nodesTableView.$el.find('li[data-csui-command="toggledescription"] .csui-svg-icon').length).toEqual(0);
      });
      it('should not show any description', function () {
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toEqual(0);
      });

      it('presence of copy link action in actions dropdown menu[medium]', function () {

        var copyLinkAction = "Copy link";
        var headerElement = nodesTableView.$el.find('.csui-toolbar-caption > .csui-item-title');
        var dropdownElement = headerElement.find('.csui-item-title-dropdown-menu');
        expect(dropdownElement.find(".binf-dropdown.binf-open").length).toEqual(0);
        var a = dropdownElement.find(".binf-dropdown-toggle").trigger('click');
        expect(dropdownElement.find(".binf-dropdown.binf-open").length).toEqual(1);
        var liLength = dropdownElement.find(".binf-dropdown.binf-open > ul > li").length;
        var flag = false;
        for (var i = 0; i <= liLength; i++) {
          var liElementInstance = ".binf-dropdown.binf-open > ul > li:nth-child(" + i + ")";
          var liElement = dropdownElement.find(liElementInstance);
          var liContent = liElement.text().trim();
          if (copyLinkAction === liContent) {
            flag = true;
            break;
          }
        }
        expect(flag).toEqual(true);
      });

    });

    describe('folder with description', function () {
      var nodesTableView, toggleIcon, regionEl, nodesFetched;
      beforeAll(function (done) {
        if (!nodesTableView) {
          nodesTableView = new NodesTableView({
            context: contextWithDescriptionNodes
          });
          regionEl = $('<div></div>').appendTo(document.body);
          new Marionette.Region({
            el: regionEl
          }).show(nodesTableView);
          contextWithDescriptionNodes.fetch().then(function () {
            done();
          });
        } else {
          done();
        }
      });

      afterAll(function () {
        TestUtils.restoreEnvironment();
      });

      it('should show description toggle icon', function (done) {
        TestUtils.asyncElement($('body'), 'li[data-csui-command="toggledescription"] .csui-svg-icon:visible').done(
            function (el) {
              expect(el.length).toEqual(1);
              expect(el.closest('a').prop('title')).toEqual("Show description");
              done();
            });

      });

      it('should not show any description by default', function () {
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toEqual(0);
      });

      it('show descriptions', function () {
        toggleIcon = nodesTableView.$el.find('li[data-csui-command="toggledescription"]' +
                                             ' .csui-toolitem');
        toggleIcon.trigger('click');
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toBeGreaterThan(0);
        expect(toggleIcon.prop('title')).toEqual("Hide description");
      });

      it('hide descriptions', function () {
        toggleIcon = nodesTableView.$el.find('li[data-csui-command="toggledescription"]' +
                                             ' .csui-toolitem');
        toggleIcon.trigger('click');
        expect(nodesTableView.$el.find(
            'tr.csui-details-row-description:not(.binf-hidden)').length).toEqual(0);
        expect(toggleIcon.closest('a').prop('title')).toEqual("Show description");
      });

      it('description row should not be shown, for the item which do not have any description',
          function () {
            expect(nodesTableView.$el.find('tr.csui-saved-item:last').next('tr').hasClass(
                'csui-details-row-description')).toBeFalsy();
          });
    });
  });

});