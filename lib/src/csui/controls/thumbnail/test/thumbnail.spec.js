/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/lib/backbone',
  'csui/widgets/nodestable/nodestable.view', 'csui/controls/thumbnail/thumbnail.view',
  'csui/utils/contexts/page/page.context', './thumbnail.mock.js',
  '../../../utils/testutils/async.test.utils.js', "csui/lib/jquery.mousehover"
], function ($, _, Marionette, Backbone, NodesTableView, ThumbnailView, PageContext, mock,
    TestUtils) {
  describe("Thumbnail View", function () {
    var pageSize            = 30,
        nodeIdCustomColumns = 2000,
        nodesTableView,
        regionEl;
    var context = new PageContext({
      factories: {
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
          attributes: {id: nodeIdCustomColumns}
        }
      }
    });

    var options = {
      context: context,
      data: {
        pageSize: pageSize
      }
    };

    beforeAll(function (done) {
      mock.enable();
      nodesTableView = new NodesTableView(options);
      regionEl = $('<div></div>').appendTo(document.body);      
      context.fetch().then(function () {
        new Marionette.Region({
          el: regionEl
        }).show(nodesTableView);
        done();
      });
      var viewStateModel = context && context.viewStateModel;
      if (viewStateModel) {
        context.viewStateModel.setSessionViewState('selected_nodes', []);
        context.viewStateModel.set(context.viewStateModel.CONSTANTS.STATE,
            {order_by: 'name_asc', page: '30_0'}, {silent: true});
        context.viewStateModel.set(context.viewStateModel.CONSTANTS.DEFAULT_STATE, {},
            {silent: true});
      }
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    describe('on creation, by default', function () {

      it('Nodestable view', function (done) {
        TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail'] > a").done(
            function () {
              expect($("li[data-csui-command='thumbnail']").is(":visible")).toBeTruthy();
              done();
            });
      });

      it('To verify the ThumbnailView functionality', function (done) {
        var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
        clickMenuItem.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-container").done(
            function () {
              expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
              done();
            });
      });

      it('verifying for other action items', function () {
        var favoriteIcon = $(".csui-thumbnail-favorite").is(":visible");
        expect(favoriteIcon).toBeTruthy();
        var overViewIcon = $(".csui-thumbnail-overview").is(":visible");
        expect(overViewIcon).toBeTruthy();
        var nodeIcon = $(".csui-thumbnail-thumbnailIcon").is(":visible");
        expect(nodeIcon).toBeTruthy();
        var toolbar = $(".csui-thumbnail-actionbar > .csui-table-actionbar-bubble").is(":visible");
        expect(toolbar).toBeFalsy();
      });

      it('verify that item is clickable', function () {
        var object = $(".csui-thumbnail-item");
        var nameContainer = object.eq(0).find('.csui-thumbnail-name-value.csui-thumbnail-default-action');
        expect(nameContainer.is(':visible')).toBeTruthy();
        var iconContainer = object.eq(0).find('.csui-thumbnail-overview-icon.csui-thumbnail-default-action');
        expect(iconContainer.is(':visible')).toBeTruthy();
      });

      it('keydown on thumbnail item name', function () {
        var object = $(".csui-thumbnail-item");
        var nameContainer = object.eq(0).find('.csui-thumbnail-name-value.csui-thumbnail-default-action');
        expect(nameContainer.is(':visible')).toBeTruthy();
        nameContainer.trigger({type: 'keydown', keyCode: 13});
      });

      it('click on thumbnail item name', function () {
        var object = $(".csui-thumbnail-item");
        var nameContainer = object.eq(0).find('.csui-thumbnail-name-value.csui-thumbnail-default-action');
        expect(nameContainer.is(':visible')).toBeTruthy();
        nameContainer.trigger('click');
      });

      it('Hovering on the node', function (done) {
        var object = $(".csui-thumbnail-item");
        object.eq(0).trigger(
            {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
        TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
            function () {
              var toolbar = $(".csui-table-actionbar-bubble").is(":visible");
              expect(toolbar).toBe(true);
              done();
            });
      });

      it('Clicking on the favorite icon', function (done) {
        var favoriteIcon = $(".csui-favorite-star").eq(1);
        favoriteIcon.trigger('click');
        TestUtils.asyncElement('body', ".binf-popover-content").done(
            function () {
              expect(".binf-popover-content:visible").toBeTruthy();
              $("button[title='Cancel']").trigger('click');
              done();
            });
      });

      it('Clicking on the OverView icon', function (done) {
        var overViewIcon = $(".icon-thumbnail-metadata-overview").eq(0);
        overViewIcon.trigger('click');
        TestUtils.asyncElement('body', ".binf-popover-content").done(
            function () {
              expect(".binf-popover-content:visible").toBeTruthy();
              done();
            });
      });

      it('Click the Selectall checkbox in thumbnail view', function (done) {
        var selectAll = $(".csui-selectAll-input");
        selectAll.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el, '.csui-selected-checkbox').done(
            function () {
              var thumbnailcol = $(".csui-thumbnail-item").find('input[title="Select item"]');
              expect(thumbnailcol.filter(':checked').length).toEqual(thumbnailcol.length);
              expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();
              done();
            });
      });

      it('Check whether Selectall checkbox is checked in table view', function (done) {
        var headertoggle = $(".csui-condensed-header-toggle");
        headertoggle.trigger('click');
        var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
        clickMenuItem.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el, 'thead th[data-csui-attribute=_select]').done(
            function () {
              var tablecol = nodesTableView.$el.find('td[data-csui-attribute=_select]');
              var selectedTableCol = nodesTableView.$el.find('td[data-csui-attribute=_select]' +
                                                             ' .csui-control.csui-checkbox[aria-checked=true]');
              expect(selectedTableCol.length).toEqual(tablecol.length);
              expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();

              var tableselectall = nodesTableView.$el.find('td[data-csui-attribute=_select]' +
                                                           ' .csui-control.csui-checkbox');
              var checked = tableselectall.attr('aria-checked');
              expect(checked).toBeDefined();
              expect(checked).toBe('true');
              done();
            });
      });

      it('verify whether the checkboxes are checked in thumbnailview or not', function (done) {
        var clickMenuItem = $("li[data-csui-command='thumbnail'] > a");
        clickMenuItem.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el, '.csui-selected-checkbox').done(
            function () {
              var thumbnailcol = $(".csui-thumbnail-item").find('input[title="Select item"]');
              expect(thumbnailcol.filter(':checked').length).toEqual(thumbnailcol.length);
              expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();
              done();
            });
      });

      it('Clicking on the Selectall checkbox again in thumbnail view', function (done) {
        var selectAll = $(".csui-selectAll-input");
        selectAll.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el, '.csui-selected-checkbox').done(
            function ($el) {
              expect($el.length).toBeGreaterThan(0);
              done();
            });
      });

    });

    describe('Thumbnail add action', function () {

      it('Adding a folder', function (done) {
        TestUtils.asyncElement('body', ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Folder']");
              addFolder.trigger('click');
              TestUtils.asyncElement(nodesTableView.$el,
                  ".csui-inlineform-input-name:visible").done(
                  function () {
                    var inputField = $(".csui-inlineform-input-name:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });

      it('Adding a Web Url', function (done) {
        TestUtils.asyncElement('body', ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Web address']");
              addFolder.trigger('click');
              TestUtils.asyncElement(nodesTableView.$el,
                  ".csui-inlineform-input-name:visible").done(
                  function () {
                    var inputField = $(".csui-inlineform-input-name:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });

      it('Adding a Collection', function (done) {
        TestUtils.asyncElement('body', ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Collection']");
              addFolder.trigger('click');
              TestUtils.asyncElement(nodesTableView.$el,
                  ".csui-inlineform-input-name:visible").done(
                  function () {
                    var inputField = $(".csui-inlineform-input-name:visible");
                    expect(inputField).toBeTruthy();
                    done();
                  });
            });
      });

      it('after checking for the inline form view click on cancel', function (done) {
        var cancel = nodesTableView.$el.find("button.csui-btn-cancel");
        cancel.trigger('click');
        TestUtils.asyncElement(nodesTableView.$el,
            ".csui-inlineform-input-name", true).done(
            function () {
              var inputField = $(".csui-inlineform-input-name").length;
              expect(inputField).toBeFalsy();
              done();
            });
      });

      it('Adding a Shortcut', function (done) {
        TestUtils.asyncElement('body', ".csui-addToolbar:visible").done(
            function () {
              var addToolbar = $(".binf-dropdown-toggle").eq(0);
              addToolbar.trigger('click');
              var addFolder = $("a[title='Add Shortcut']");
              addFolder.trigger('click');
              TestUtils.asyncElement('body', ".binf-modal-content:visible").done(
                  function () {
                    var dialogBox = $(".binf-modal-content:visible");
                    expect(dialogBox).toBeTruthy();
                    done();
                  });
            });
      });

      it('After clicking on cancel button the dialog-box should close', function (done) {
        var cancelButton = $("#cancel");
        cancelButton.trigger('click');
        TestUtils.asyncElement('body', ".binf-modal-content:not(:visible)").done(function ($el) {
          expect($el).toBeTruthy();
          done();
        });

      });

    });

    describe('Thumbnail Header', function () {

      it('To verify the thumbnail header elements', function (done) {
        var thumbnailHeader = $(".csui-thumbnail-header");
        expect(thumbnailHeader.is(':visible')).toBeTruthy();
        TestUtils.asyncElement(thumbnailHeader, ".csui-checkbox-selectAll").done(
            function ($el) {
              expect($el.is(":visible")).toBeTruthy();
              expect($el.text().trim()).toEqual("Select all");
              TestUtils.asyncElement(thumbnailHeader, ".csui-thumbnail-itemcount").done(
                  function ($el) {
                    expect($el.is(":visible")).toBeTruthy();
                    expect($el.text().trim()).toBeLessThanOrEqual(pageSize + " items");
                    done();
                  });
            });
        var sortOptions = $(".csui-search-sort-options").is(":visible");
        expect(sortOptions).toBeTruthy();
        var searchIcon = $(".csui-thumbnail-column-search").is(":visible");
        expect(searchIcon).toBeTruthy();
      });
    });

    xdescribe('Thumbnail Sorting', function () {

      it('To verify thumbnail items in Ascending order by Name(A-Z)', function (done) {
        var sortDropdown     = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        TestUtils.asyncElement(sortingContainer, "#asc_name").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Name (A-Z)");
              $el.trigger('click');
              TestUtils.asyncElement(sortingContainer, ".icon-sortArrowDown").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(sortDropdown.text().trim()).toEqual("Name");
                    var object = $(".csui-thumbnail-item");
                    expect(object.eq(29).find('.csui-thumbnail-name-value').text().trim()).toBeLessThanOrEqual("Child 30");
                    done();
                  });
            });

      });

      it('To verify thumbnail items in Descending order by Name(Z-A)', function (done) {
        var sortDropdown     = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        TestUtils.asyncElement(sortingContainer, "#desc_name").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Name (Z-A)");
              $el.trigger('click');
              TestUtils.asyncElement(sortingContainer, ".icon-sortArrowUp").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(sortDropdown.text().trim()).toEqual("Name");
                    var object = $(".csui-thumbnail-item");
                    expect(object.eq(2).find('.csui-thumbnail-name-value').text().trim()).toEqual('Child 3');
                    done();
                  });
            });
      });

      it('To verify thumbnail items in Ascending order by Modified (new-old)', function (done) {
        var sortDropdown     = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        TestUtils.asyncElement(sortingContainer, "#asc_modify_date").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Modified (new-old)");
              $el.trigger('click');
              TestUtils.asyncElement(sortingContainer, ".icon-sortArrowDown").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(nodesTableView.collection.models["1"].attributes.modify_date).toEqual("2019-05-10T00:03:07");
                    done();

                  });
            });

      });

      it('To verify thumbnail items in Descending order by Modified (old-new)', function (done) {
        var sortDropdown     = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        TestUtils.asyncElement(sortingContainer, "#desc_modify_date").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Modified (old-new)");
              $el.trigger('click');
              TestUtils.asyncElement(sortingContainer, ".icon-sortArrowUp").done(
                  function ($el) {
                    expect($el.length).toEqual(1);
                    expect(nodesTableView.collection.models["1"].attributes.modify_date).toEqual("2019-05-10T00:03:07");
                    done();

                  });
            });
      });

      it('To verify thumbnail items in Ascending order by Size (small-large)', function (done) {
        var sortDropdown     = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        TestUtils.asyncElement(sortingContainer, "#asc_size").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Size (small-large)");
              $el.trigger('click');
              TestUtils.asyncElement(sortingContainer, ".icon-sortArrowDown").done(
                  function ($el) {
                    expect(sortDropdown.text().trim()).toEqual("Size");
                    expect($el.length).toEqual(1);
                    var object = $(".csui-thumbnail-item");
                    expect(object.eq(2).find('.csui-thumbnail-name-value').text().trim()).toEqual('Child 3');
                    done();
                  });
            });

      });

      it('To verify thumbnail items in Descending order by Size (large-small)', function (done) {
        var sortDropdown     = $(".csui-search-sort-options button.binf-btn"),
            sortingContainer = $(".cs-sort-links");
        sortDropdown.trigger('click');
        TestUtils.asyncElement(sortingContainer, "#desc_size").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.text().trim()).toEqual("Size (large-small)");
              $el.trigger('click');
              TestUtils.asyncElement(sortingContainer, ".icon-sortArrowUp").done(
                  function ($el) {
                    expect(sortDropdown.text().trim()).toEqual("Size");
                    expect($el.length).toEqual(1);
                    var object = $(".csui-thumbnail-item");
                    expect(object.eq(2).find('.csui-thumbnail-name-value').text().trim()).toEqual("Desert - Copy - Copy - Copy.jpg");
                    done();
                  });
            });
      });

    });

    describe('Thumbnail overview popover', function () {

      it('click on inline action bar of first item', function (done) {
        var object = $(".csui-thumbnail-item");
        object.eq(0).trigger(
            {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
        TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
            function (el) {
              expect(el.is(":visible")).toBe(true);
              el.find('.binf-dropdown-toggle').trigger('click');
              done();
            });
      });

      it('select rename action for first item', function (done) {
      TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
        function ($el) {
          expect($el.is(':visible')).toBeTruthy();
          var renameCommand = $("li[data-csui-command='inlineedit'] > a");
          renameCommand.eq(0).trigger('click');
          done();
        });
      });

      it('verify inline form is displayed',  function (done) {
      TestUtils.asyncElement(nodesTableView.$el, '.csui-inlineform').done(
        function ($el) {
          expect($el.is(':visible')).toBeTruthy();
          done();
        });
      });

      it('To verify thumbnail overview popover', function (done) {
        var overViewButton = $(".icon-thumbnail-metadata-overview").eq(1);
        overViewButton.trigger('click');
        TestUtils.asyncElement('body', ".binf-popover-content:visible").done(
            function () {
              expect($(".binf-popover-content").is(":visible")).toBeTruthy();
              done();
            });
      });

      it('To verify thumbnail properties actions in popover', function (done) {
        TestUtils.asyncElement(".binf-popover-content", ".icon-toolbar-metadata").done(
            function ($el) {
              expect($el.length).toEqual(1);
              expect($el.is(':visible')).toBeTruthy();
              $el.trigger('click');
              TestUtils.asyncElement('body', ".cs-properties-wrapper:visible").done(
                  function ($el) {
                    expect($el.is(':visible')).toBeTruthy();
                    done();
                  });
            });
      });
      it('To verify thumbnail icons in metadata navigation panel', function (done) {
        TestUtils.asyncElement(".metadata-sidebar", ".cs-list-group").done(
            function ($el) {
              TestUtils.asyncElement('.cs-list-group', '.csui-icon:visible').done(
                  function ($el) {
                    expect($el.length).toBeGreaterThan(0);
                    expect($el.is(':visible')).toBeTruthy();
                    done();
                  });
            });
      });

      it('click on the back arrow button to navigate back', function (done) {
        var sidebar    = $('.cs-properties-wrapper'),
            backButton = sidebar.find('.cs-header-with-go-back');
        backButton.trigger('click');
        TestUtils.asyncElement('body', '.cs-properties-wrapper', true).done(
            function ($el) {
              expect($('.cs-properties-wrapper').is(':visible')).toBeFalsy();
              expect($(".binf-popover-content").is(':visible')).toBeTruthy();
              expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
              done();
            });
      });

      it('on click at any place the popover should close', function (done) {
        var overViewButton = $(".icon-thumbnail-metadata-overview").eq(1);
        overViewButton.trigger('mouseup');
        TestUtils.asyncElement(nodesTableView.$el, '.binf-popover-content', true).done(
            function ($el) {
              expect($el.is(':visible')).toBeFalsy();
              done();
            });
      });
    });

    describe('Thumbnail rename action', function () {
      describe('verify webaddress view', function () {
        it('click on inline action bar of webaddress', function (done) {
          var object = $(".csui-thumbnail-item");
          object.eq(2).trigger(
              {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
          TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
              function (el) {
                expect(el.is(":visible")).toBe(true);
                el.find('.binf-dropdown-toggle').trigger('click');
                done();
              });
        });
        it('navigate to permission page', function (done) {
          TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              var permissionCommand = $("li[data-csui-command='permissions'] > a");
              permissionCommand.eq(1).trigger('click');
              TestUtils.asyncElement('body', ".cs-permissions-wrapper:visible").done(
                function ($el) {
                  expect($el.is(':visible')).toBeTruthy();
                  done();
                });
            });
        });
        it('click on the back arrow button to navigate back', function (done) {
          var sidebar    = $('.cs-permissions-wrapper'),
              backButton = sidebar.find('.cs-header-with-go-back');
          backButton.trigger('click');
          TestUtils.asyncElement('body', '.cs-permissions-wrapper', true).done(
              function ($el) {
                expect($('.cs-permissions-wrapper').is(':visible')).toBeFalsy();
                expect($(".csui-thumbnail-container").is(':visible')).toBeTruthy();
                expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
                done();
              });
        });
        it('verify webaddress view is not distorted', function () {
          var object = $(".csui-thumbnail-item");
          expect(object.eq(2).hasClass('csui-new-thumbnail-item')).toBeFalsy();
        });
      });
      xdescribe('verify on renaming an item, font color of name is not changed', function () {
        it('click on inline action bar of first item', function (done) {
            var object = $(".csui-thumbnail-item");
            object.eq(0).trigger(
                {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
            TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
                function (el) {
                  expect(el.is(":visible")).toBe(true);
                  el.find('.binf-dropdown-toggle').trigger('click');
                  done();
                });
        });
        it('select rename action for first item', function (done) {
          TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              var renameCommand = $("li[data-csui-command='inlineedit'] > a");
              renameCommand.eq(0).trigger('click');
              done();
            });
        });
        it('verify inline form is displayed',  function (done) {
          TestUtils.asyncElement('body', '.csui-inlineform').done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              done();
            });
        });
        it('click on inline action bar of second item', function (done) {
          var object = $(".csui-thumbnail-item");
          object.eq(1).trigger(
              {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
          TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
              function (el) {
                expect(el.is(":visible")).toBe(true);
                el.find('.binf-dropdown-toggle').trigger('click');
                done();
              });
        });
        it('select rename action for second item', function (done) {
          TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              var renameCommand = $("li[data-csui-command='inlineedit'] > a");
              renameCommand.eq(0).trigger('click');
              done();
            });
        });
        it('verify inline form is displayed for second item', function (done) {
          TestUtils.asyncElement(nodesTableView.$el, '.csui-inlineform').done(
            function ($el) {
              var object = $(".csui-thumbnail-item");
              var inlineForm = object.eq(0).find('.csui-inlineform');
              expect(inlineForm.is(':visible')).toBeFalsy();
              expect(object.eq(0).find('.csui-thumbnail-no-default-action').length).toBe(0);
              expect($el.is(':visible')).toBeTruthy();
              done();
            });
        });
      });
      describe('To verify inline form is not displayed on navigating back from permissions page', function () {
        it('click on inline action bar of first item', function (done) {
          var object = $(".csui-thumbnail-item");
          object.eq(0).trigger(
              {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
          TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
              function (el) {
                expect(el.is(":visible")).toBe(true);
                el.find('.binf-dropdown-toggle').trigger('click');
                done();
              });
        });
        it('select rename action for first item', function (done) {
        TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
          function ($el) {
            expect($el.is(':visible')).toBeTruthy();
            var renameCommand = $("li[data-csui-command='inlineedit'] > a");
            renameCommand.eq(0).trigger('click');
            done();
          });
        });
        it('verify inline form is displayed',  function (done) {
        TestUtils.asyncElement(nodesTableView.$el, '.csui-inlineform').done(
          function ($el) {
            expect($el.is(':visible')).toBeTruthy();
            done();
          });
        });
        it('click on inline action bar of another item', function (done) {
            var object = $(".csui-thumbnail-item");
            object.eq(2).trigger(
                {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
            TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
                function (el) {
                  expect(el.is(":visible")).toBe(true);
                  el.find('.binf-dropdown-toggle').trigger('click');
                  done();
                });
        });
        it('navigate to permission page', function (done) {
            TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
              function ($el) {
                expect($el.is(':visible')).toBeTruthy();
                var permissionCommand = $("li[data-csui-command='permissions'] > a");
                permissionCommand.eq(1).trigger('click');
                TestUtils.asyncElement('body', ".cs-permissions-wrapper:visible").done(
                  function ($el) {
                    expect($el.is(':visible')).toBeTruthy();
                    done();
                  });
              });
        });
        it('click on the back arrow button to navigate back', function (done) {
            var sidebar    = $('.cs-permissions-wrapper'),
                backButton = sidebar.find('.cs-header-with-go-back');
            backButton.trigger('click');
            TestUtils.asyncElement('body', '.cs-permissions-wrapper', true).done(
                function ($el) {
                  expect($('.cs-permissions-wrapper').is(':visible')).toBeFalsy();
                  expect($(".csui-thumbnail-container").is(':visible')).toBeTruthy();
                  expect(nodesTableView.$el.find('.csui-thumbnail-container').length).toEqual(1);
                  done();
                });
        });
        it('verify inline form is not displayed', function () {
          var object = $(".csui-thumbnail-item");
          var inlineForm = object.eq(0).find('.csui-inlineform');
          expect(inlineForm.length).toBe(0);
        });
      });
      describe('To validate rename error conditions for items', function () {
        it('click on inline action bar of first item', function (done) {
          var object = $(".csui-thumbnail-item");
          object.eq(0).trigger(
              {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
          TestUtils.asyncElement(nodesTableView.$el, '.csui-table-actionbar-bubble').done(
              function (el) {
                expect(el.is(":visible")).toBe(true);
                el.find('.binf-dropdown-toggle').trigger('click');
                done();
              });
        });

        it('select rename action for first item', function (done) {
          TestUtils.asyncElement(".csui-table-actionbar-bubble", ".binf-dropdown.binf-open").done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              var renameCommand = $("li[data-csui-command='inlineedit'] > a");
              renameCommand.eq(0).trigger('click');
              done();
          });
        });

        it('verify inline form is displayed',  function (done) {
          TestUtils.asyncElement(nodesTableView.$el, '.csui-inlineform').done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              done();
            });
        });

        it("Validating error scenario with existing name", function (done) {
          var nameInput = nodesTableView.$el.find('.csui-inlineform-input-name');
          nameInput.val('Child 2');
          $( "form.csui-inlineform-group").trigger('submit');
          TestUtils.asyncElement(nodesTableView.$el, '.csui-inlineform-group-error').done(function (el) {
            expect(el.length).toEqual(1);
            done();
          });
        });

        it("Check whether previous name is displayed on cancelling", function (done) {
          var cancelButton = nodesTableView.$el.find('.csui-btn-edit-cancel');
          cancelButton.trigger('click');
          TestUtils.asyncElement(nodesTableView.$el, '.csui-thumbnail-name-justify-div').done(function (el) {
             var presentName = el.find('span');
             expect(presentName[0].innerText).toEqual('First child');
             done();
          });
        });
      });
      describe('To validate rename error conditions for header title', function () {

        it("Click on dropdown icon beside header title", function () {
          var itemDropdown = $('.csui-item-title-dropdown-menu').find(":button");
          expect(itemDropdown.length).toEqual(1);
          itemDropdown.trigger('click');
        });

        it("Click on Rename command in dropdown", function (done) {
          TestUtils.asyncElement('ul.binf-dropdown-menu',
            'li[data-csui-command="rename"] .csui-toolitem').done(function (el) {
              expect(el.length).toEqual(1);
              expect(el.text().trim()).toEqual("Rename");
              el.trigger('click');
              done();
          });
        });

        it("Validating error scenario with unacceptable character", function (done) {
          var titleInput = $('.title-edit-div').find(".title-input");
          expect(titleInput.length).toEqual(1);
          titleInput.val('Innovate:');
          titleInput.trigger({type: 'keyup', keyCode: 13});
          TestUtils.asyncElement(nodesTableView.$el, '.csui-item-name-error').done(function (el) {
            expect(el.length).toEqual(1);
            done();
          });
        });

        it("Check whether previous name is displayed on cancelling", function (done) {
          var cancelButton = nodesTableView.$el.find('.csui-undo');
          cancelButton.trigger({type: 'keyup', keyCode: 27});
          TestUtils.asyncElement(nodesTableView.$el, '.csui-item-name-block').done(function (el) {
             expect(el[0].innerText).toEqual('Innovate');
             done();
          });
        });
      });
    });
  });

  describe("Single select in Thumbnail View", function () {
    var pageSize            = 30,
        nodeIdCustomColumns = 2000,
        nodesTableView,
        regionEl;
    var context = new PageContext({
      factories: {
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
          attributes: {id: nodeIdCustomColumns}
        }
      }
    });

    var options = {
      context: context,
      selectThumbnails: "single",
      data: {
        pageSize: pageSize
      }
    };

    beforeAll(function (done) {
      mock.enable();
      nodesTableView = new NodesTableView(options);
      regionEl = $('<div></div>').appendTo(document.body);      
      context.fetch().then(function () {
        new Marionette.Region({
          el: regionEl
        }).show(nodesTableView);
        done();
      });
      var viewStateModel = context && context.viewStateModel;
      if (viewStateModel) {
        context.viewStateModel.setSessionViewState('selected_nodes', []);
        context.viewStateModel.set(context.viewStateModel.CONSTANTS.STATE,
            {order_by: 'name_asc', page: '30_0'}, {silent: true});
        context.viewStateModel.set(context.viewStateModel.CONSTANTS.DEFAULT_STATE, {},
            {silent: true});
      }
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    it('Click on Thumbnail view', function (done) {
      TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail'] > a").done(
          function (el) {
            el.trigger('click');
            TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-item:visible").done(
                function (el) {
                  expect(el.is(":visible")).toBeTruthy();
                  expect(el.length).toEqual(30);
                  done();
                });
          });
    });

    it('select all checkbox should not be present', function (done) {
      TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-header:visible").done(
          function ($el) {
            expect($el.is(":visible")).toBeTruthy();
            TestUtils.asyncElement(".csui-thumbnail-header", ".csui-checkbox-selectAll").done(
                function ($el) {
                  expect($el.is(":visible")).toBeFalsy();
                  done();
                });
          });
    });

    xit('Click on select checkbox of first thumbnail item', function () {
      var object = $(".csui-thumbnail-item");
      var selectInput = object.eq(0).find(".selectAction");
      expect(selectInput.length).toEqual(1);
      selectInput.trigger('click');
      expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();
    });

    xit('Click on select checkbox of second thumbnail item', function () {
      var object = $(".csui-thumbnail-item");
      var selectInput = object.eq(1).find(".selectAction");
      expect(selectInput.length).toEqual(1);
      selectInput.trigger('click');
      expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();
    });

    xit(' Verify that only one item should be checked,after selecting two items', function (done) {
      TestUtils.asyncElement(nodesTableView.$el, '.csui-selected-checkbox').done(
          function () {
            var thumbnailcol = $(".csui-thumbnail-item .selectAction");
            expect(thumbnailcol.filter(':checked').length).toEqual(1);
            expect(".csui-table-rowselection-toolbar-visible:visible").toBeTruthy();
            done();
          });
    });

  });

  describe("None select in Thumbnail View", function () {
    var pageSize            = 30,
        nodeIdCustomColumns = 2000,
        nodesTableView,
        regionEl;
    var context = new PageContext({
      factories: {
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
          attributes: {id: nodeIdCustomColumns}
        }
      }
    });

    var options = {
      context: context,
      selectThumbnails: "none",
      data: {
        pageSize: pageSize
      }
    };

    beforeAll(function (done) {
      mock.enable();
      nodesTableView = new NodesTableView(options);
      regionEl = $('<div></div>').appendTo(document.body);      
      context.fetch().then(function () {
        new Marionette.Region({
          el: regionEl
        }).show(nodesTableView);
        done();
      });
      var viewStateModel = context && context.viewStateModel;
      if (viewStateModel) {
        context.viewStateModel.setSessionViewState('selected_nodes', []);
        context.viewStateModel.set(context.viewStateModel.CONSTANTS.STATE,
            {order_by: 'name_asc', page: '30_0'}, {silent: true});
        context.viewStateModel.set(context.viewStateModel.CONSTANTS.DEFAULT_STATE, {},
            {silent: true});
      }
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();    
      window.localStorage.clear();  
    });

    it('Click on Thumbnail view', function (done) {
      TestUtils.asyncElement(nodesTableView.$el, "li[data-csui-command='thumbnail'] > a").done(
          function (el) {
            el.trigger('click');
            TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-item:visible").done(
                function (el) {
                  expect(el.is(":visible")).toBeTruthy();
                  expect(el.length).toEqual(30);
                  done();
                });
          });
    });

    it('select all checkbox should not be present', function (done) {
      TestUtils.asyncElement(nodesTableView.$el, ".csui-thumbnail-header:visible").done(
          function ($el) {
            expect($el.is(":visible")).toBeTruthy();
            TestUtils.asyncElement(".csui-thumbnail-header", ".csui-checkbox-selectAll").done(
                function ($el) {
                  expect($el.is(":visible")).toBeFalsy();
                  done();
                });
          });
    });

    it('Checkbox of thumnail items should not be visible', function (done) {
      var object = $(".csui-thumbnail-item");
      object.eq(0).trigger(
          {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
      TestUtils.asyncElement(nodesTableView.$el, ".selectAction:visible", true).done(
          function ($el) {
            expect($el.is(":visible")).toBeFalsy();
            done();
          });
    });    
  });

});
  


