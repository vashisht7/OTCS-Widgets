/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette", "csui/lib/backbone",
  "csui/widgets/metadata/metadata.view", "csui/utils/contexts/page/page.context",
  'csui/utils/connector',
  "csui/utils/contexts/factories/node", "./metadata.mock.data.js", './audit.mock.js',
  "csui/widgets/metadata/metadata.properties.view",
  "../../../utils/testutils/async.test.utils.js"
], function ($, _, Marionette, Backbone, MetaDataView, PageContext, Connector, NodeModelFactory,
    MetadataMock, AudtiMock, MetadataPropertiesView, TestUtils) {
  'use strict';

  describe("MetaDataView Widget", function () {

    var context, v1, v2, v3, metadataItemNameView, node1, node2;
    var titleProperties = "Properties",
        titleVersions   = "Versions",
        titleActivities = "Activity",
        titleGeneral    = "General";

    beforeAll(function () {
      MetadataMock.enable();
      AudtiMock.enable();

      var connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });

      context = new PageContext({
        factories: {
          connector: connector
        }
      });

      node1 = context.getModel(NodeModelFactory, {
        attributes: {
          id: 11111
        },
        delayRestCommands: true
      });
      node1.setExpand('properties', 'original_id');

      node2 = context.getModel(NodeModelFactory, {
        attributes: {
          id: 22222
        }
      });
      node2.setExpand('properties', 'original_id');

      node1.nonPromotedActionCommands = ['addcategory'];

      v1 = new MetaDataView({
        context: context,
        model: node1,
        delayTabContent: true
      });

      v2 = new MetaDataView({
        context: context,
        model: node2,
        delayTabContent: true
      });

      v3 = new MetadataPropertiesView({
        context: context,
        node: node1
      });

      metadataItemNameView = v1.metadataHeaderView.metadataItemNameView;

    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      MetadataMock.disable();
      AudtiMock.disable();
      TestUtils.restoreEnvironment();
    });

    it("the first view can be instantiated", function () {
      expect(v1).toBeDefined();
      expect(v1.$el.length > 0).toBeTruthy();
      expect(v1.$el.attr('class')).toEqual('cs-metadata');
      expect(v1.el.childNodes.length === 0).toBeTruthy();
      expect(v1).toBeDefined();
      expect(v1.$el.length > 0).toBeTruthy();
      expect(v1.el.childNodes.length === 0).toBeTruthy();
    });

    it("the second view can be instantiated", function () {
      expect(v2).toBeDefined();
      expect(v2.$el.length > 0).toBeTruthy();
      expect(v1.$el.attr('class')).toEqual('cs-metadata');
      expect(v2.el.childNodes.length === 0).toBeTruthy();

      expect(v2).toBeDefined();
      expect(v2.$el.length > 0).toBeTruthy();
      expect(v2.el.childNodes.length === 0).toBeTruthy();

    });

    describe("both views can be rendered and contain correct html elements", function () {

      it("view1 with a document object ID=11111", function (done) {
        var dataFetched = context.fetch()
            .then(function () {
              expect(node1.attributes.id).toEqual(11111);
              expect(node1.attributes.type).toEqual(144);
              expect(node1.attributes.mime_type).toEqual('application/pdf');
              $('body').append('<div id="metadata-view-v1"></div>');
              var region = new Marionette.Region({
                el: "#metadata-view-v1"
              });
              region.show(v1);

              expect(v1.$el.length > 0).toBeTruthy();
              expect(v1.el.childNodes.length > 0).toBeTruthy();
              expect(v1.$('.metadata-content-wrapper').length).toEqual(1);
              expect(v1.$('> .metadata-content-header > .metadata-header').length >
                     0).toBeTruthy();

              expect(v1.$('.metadata-content-wrapper > .cs-tab-links').length)
                  .toEqual(1);
              expect(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu'
              ).length).toEqual(
                  1);
              expect(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu > li'
              ).length).toEqual(
                  3);

              expect($(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu > li'
              )[0]).find(
                  'a span').html()).toEqual(titleProperties);
              expect($(v1.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu >' +
                  ' li')[1]).find('a span').html()).toEqual(titleVersions);
              expect(v1.$('.metadata-content-wrapper > .cs-tab-links').length)
                  .toEqual(1);

              expect(v1.$('.metadata-content-wrapper > .binf-tab-content').length)
                  .toEqual(1);
              expect(v1.$(
                      '.metadata-content-wrapper > .binf-tab-content > .binf-tab-pane >' +
                      ' .metadata-inner-wrapper').length > 0).toBeTruthy();

              expect(v1.$(
                  '.metadata-content-wrapper .binf-tab-content .binf-tab-pane')
                  .length).toEqual(3);
              expect($(v1.$(
                  '.metadata-content-wrapper .binf-tab-content .binf-tab-pane')[
                  0]).find(
                  '.cs-metadata-properties').length).toEqual(1);
              done();
            })
            .fail(function () {
              expect(dataFetched.state()).toBe('resolved', 'Data fetch timed out');
              done();
            });

      });

      it("view2 with a folder object ID=22222", function (done) {
        var dataFetched = context.fetch()
            .then(function () {
              expect(node2.attributes.id).toEqual(22222);
              expect(node2.attributes.type).toEqual(0);
              expect(node2.attributes.mime_type).not.toBeDefined();
              v2.render();
              expect(v2.$el.length > 0).toBeTruthy();
              expect(v2.el.childNodes.length > 0).toBeTruthy();
              $('body').append('<div id="metadata-view-v2"></div>');
              var region = new Marionette.Region({
                el: "#metadata-view-v2"
              });
              region.show(v2);
              expect(v2.$('.metadata-content-wrapper').length).toEqual(1);
              expect(v2.$('> .metadata-content-header > .metadata-header').length >
                     0).toBeTruthy();

              expect(v2.$('.metadata-content-wrapper > .cs-tab-links').length)
                  .toEqual(1);
              expect(v2.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu'
              ).length).toEqual(
                  1);
              expect(v2.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu >' +
                  ' li').length).toEqual(2);

              expect($(v2.$(
                  '.metadata-content-wrapper > .cs-tab-links > ul.binf-dropdown-menu > li'
              )[0]).find(
                  'a span').html()).toEqual(titleProperties);
              expect(v2.$('.metadata-content-wrapper > .cs-tab-links').length)
                  .toEqual(1);

              expect(v2.$('.metadata-content-wrapper > .binf-tab-content').length)
                  .toEqual(1);
              expect(v2.$(
                      '.metadata-content-wrapper > .binf-tab-content > .binf-tab-pane >' +
                      ' .metadata-inner-wrapper').length >
                     0).toBeTruthy();

              expect(v2.$(
                  '.metadata-content-wrapper .binf-tab-content .binf-tab-pane')
                  .length).toEqual(2);
              expect($(v2.$(
                  '.metadata-content-wrapper .binf-tab-content .binf-tab-pane')[
                  0]).find(
                  '.cs-metadata-properties').length).toEqual(1);
              done();
            })
            .fail(function () {
              expect(dataFetched.state()).toBe('resolved', 'Data fetch timed out');
              done();
            });

      });
    });

    it('should render tab content header view', function (done) {
      v3.on('update:scrollbar', function () {
        expect(!!v3.tabContentHeader).toBeTruthy();
        done();
      });
      v3.render();
    });

    it('should show required field switch for required categories ', function () {
      expect(v3.tabContentHeader.isRequiredCatPresent()).toBeTruthy();
    });

    describe("tab links", function () {
      beforeAll(function () {
        $($.fn.binf_modal.getDefaultContainer()).empty();
      });
      it('tab links present', function () {
        expect(v1.$el.find('.cs-tab-links').length).toEqual(1);
      });

      it('alphabetical order of categories', function () {
        var tabLinksText        = v1.$el.find('.tab-links-bar .binf-nav .cs-tablink-text'),
            i                   = 1, //general category is at 0
            inAlphabeticalOrder = true;
        for (; inAlphabeticalOrder && i < tabLinksText.length - 1; i++) {
          inAlphabeticalOrder = tabLinksText[i + 1].innerText.toLowerCase() >
                                tabLinksText[i].innerText.toLowerCase();
        }
        expect(inAlphabeticalOrder).toBeTruthy();
      });

      it('highlighting tab link on clicking', function () {
        var tabLink = v1.$el.find('.tab-links-bar .binf-nav > li:last-child');
        tabLink.find('> a')[0].click();
        expect(tabLink.hasClass('binf-active')).toBeTruthy();
        expect(tabLink.find('> a').attr('aria-selected')).toEqual('true');
      });

      it('shows loading icons and add-properties menu', function () {
        var loadingIcons = v1.$el.find('.csui-loading-parent-wrapper');
        expect(loadingIcons.length).toEqual(1);
      });

      it('shows add category dialog', function (done) {
        TestUtils.asyncElement(v1.$el, '[id^="addPropertiesButton"]:visible').done(
            function (el) {
              expect(el.length).toEqual(1);
              el.trigger('click');
              TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
                  '.target-browse.cs-dialog.binf-modal').done(function (el) {
                expect(el.length).toEqual(1);
                el.find('.binf-modal-footer button:last-child').trigger(
                    'click');
                done();
              });
            });
      });

      describe('remove category', function () {
        var tabLinksBar, catToDelete, deleteConfirmBtn, catName;
        beforeAll(function () {
          tabLinksBar = v1.$el.find('.tab-links-bar');
          catToDelete = tabLinksBar.find('.binf-nav-pills > li:last-child > a');
          catName = catToDelete.find('.cs-tablink-text').text();
        });

        it("Turn on the required field switch ", function () {
          if (v3.tabContentHeader && v3.tabContentHeader
                  .requiredFieldSwitchView) {
            v3.tabContentHeader.ui.requiredSwitchIcon.trigger('click');
            expect(v3.$el.find('div .required-field-switch .binf-switch-off')
                .length).toEqual(1);
          }
        });

        it('check delete button & confirm delete', function (done) {
          expect(tabLinksBar.length).toEqual(1);
          catToDelete.parent().find('.cs-tablink-delete')[0].click();
          TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
              '.csui-alert.binf-modal .binf-modal-footer .binf-btn-primary')
              .done(function (el) {
                expect(el.length).toEqual(1);
                el.trigger('click');
                done();
              });
        });

        it('Switch should be turned to off state after clicking the confirm delete button',
            function (done) {
              TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
                  '.csui-alert.binf-modal .binf-modal-footer .binf-btn-primary')
                  .done(
                      function (el) {
                        el.trigger('click');
                        expect(v3.$el.find('div .required-field-switch').attr('class'))
                            .not.toContain(
                            '.binf-switch-off');
                        done();
                      });
            });

        it('verify removal of category', function (done) {
          TestUtils.asyncElement(tabLinksBar,
              '.binf-nav-pills > li > a[title=' + catName + ']', true).done(
              function (el) {
                expect(el.length).toEqual(0);
                done();
              });
        });
      });
    });

    it('should open actions dropdown menu on click[medium]', function () {
      var headerElement = v1.$el.find('> .metadata-content-header >' +
                                      ' .metadata-header.with-right-bar >' +
                                      ' .cs-metadata-item-name-container .csui-metadata-item-name-dropdown' +
                                      ' .cs-dropdown-menu');
      expect(headerElement.find(".binf-dropdown.binf-open").length).toEqual(0);
      headerElement.find("> .binf-dropdown > .binf-dropdown-toggle").trigger('click');
      expect(headerElement.find(".binf-dropdown.binf-open").length).toEqual(1);
      expect(headerElement.find(".binf-dropdown-menu > li > a").length).toBeGreaterThan(
          0);
    });

    it('For Folder thumbnail_section icon should be present', function () {
      var thumbnail_icon = v1.$el.find('.thumbnail_section');
      expect(thumbnail_icon.length).toEqual(1);
      expect(thumbnail_icon.attr('title')).toEqual('Open ' + v1.options.model.get(
              'type_name'));
    });

    it('Item Id element must be present', function () {
      expect(v1.$el.find(
          ".owner_section .alpaca-container-item[data-alpaca-container-item-name='itemId']"
      ).length).toEqual(
          1);
      var itemid = v1.options.model.get('id');
      itemid = itemid.toString();
      expect(v1.$el.find(
          ".owner_section .alpaca-container-item[data-alpaca-container-item-name='itemId'] span"
      ).html()).toEqual(
          itemid);
    });

    it('Item Id Label must be present', function () {
      expect(v1.$el.find(
          ".owner_section .alpaca-container-item label[title='Item ID']").length)
          .toEqual(1);
    });

    describe('Limit number of rows to be displayed in set category', function () {
      it('Expect the set category has 6 rows', function () {
        var tabContent   = v1.$el.find('.binf-tab-content'),
            setContainer = tabContent.find('.cs-form-set-container')[0];
        expect(setContainer.children.length).toEqual(6);
      });

      it('Expect Show more option to be present for set category', function () {
        var tabContent = v1.$el.find('.binf-tab-content'),
            showMore   = tabContent.find('.csui-show-more');
        expect(showMore.is(":visible")).toBeTruthy();
        expect(showMore.length).toEqual(2);
      });

      it('Expect Show Less option to be present after clicking on show more',
          function () {
            var tabContent = v1.$el.find('.binf-tab-content'),
                showMore   = tabContent.find('.csui-show-more');
            expect(showMore.is(":visible")).toBeTruthy();
            expect(showMore.length).toEqual(2);
            showMore.trigger('click');
            var showLess = tabContent.find('.csui-set-show-more-label');
            expect(showLess.is(":visible")).toBeTruthy();
            if (showLess.length > 1) {
              expect(showLess[0].textContent).toEqual("Show less");
            }
          });

      it('Click on edit icon of set category', function () {
        var tabContent = v1.$el.find('.binf-tab-content'),
            editButton = tabContent.find('.csui-bulk-edit');
        expect(editButton.length).toEqual(2);
        editButton.trigger('click');
      });

      it('Expect Show more option not to be displayed while editing set category',
          function () {
            var tabContent = v1.$el.find('.binf-tab-content'),
                showMore   = tabContent.find('.csui-show-more');
            expect(showMore.length).toEqual(2);
          });

      it('Expect Show Less option to be displayed when focus out of set category',
          function (done) {
            var tabContent   = v1.$el.find('.binf-tab-content'),
                setContainer = tabContent.find('.cs-form-set-container')[0],
                showLess     = tabContent.find('.csui-set-show-more-label');
            $(document.activeElement).trigger('click').trigger({
              type: 'keydown',
              keyCode: 13
            });
            TestUtils.asyncElement(tabContent, ".csui-set-show-more-label:visible")
                .done(
                    function (el) {
                      if (el.length > 1) {
                        expect(el[0].textContent).toEqual("Show less");
                      }
                      done();
                    });
          });
    });

    describe('Name Bhevaiours', function () {
      it('check Name in Eidt Mode', function () {
        metadataItemNameView.setEditModeFocus();
        var NameContent = metadataItemNameView.$el.find(
            '.cs-metadata-item-name .title');
        expect(NameContent.length).toEqual(1);
        NameContent.trigger('click');
        var ele = metadataItemNameView.$el.find(
            '.cs-metadata-item-name .title.binf-hidden');
        expect(ele.length).toEqual(1);
      });

      it('Cancel Name Input Box', function () {
        var cancelName = metadataItemNameView.$el.find('.csui-undo.edit-cancel');
        cancelName.trigger('mousedown');
        expect(cancelName.length).toEqual(1);
      });

      it('Empty Name Input Box', function () {
        metadataItemNameView.modelHasEmptyName = '';
        var emptyname = metadataItemNameView.ItemNameBehavior.$el.find(
            '.title-input');
        emptyname.trigger({
          type: 'keydown',
          keyCode: 13
        });
        expect(emptyname.length).toEqual(1);
      });
      it('check Name in Edit Mode', function () {
        metadataItemNameView.setEditModeFocus();
        var NameContent = metadataItemNameView.$el.find(
            '.cs-metadata-item-name .title');
        var title = metadataItemNameView.ItemNameBehavior.$el.find('.title-input');
        NameContent.trigger('click');
        title.trigger({
          type: 'keyup',
          keyCode: 13
        });
        expect(title.length).toEqual(1);
        title.trigger({
          type: 'keyup',
          keyCode: 27
        });
        metadataItemNameView._validateAndSave();
        expect(title.length).toEqual(1);
      });
      it('Validate Input Name', function () {
        var inputValue = metadataItemNameView.getInputBoxValue();
        inputValue = inputValue.trim();
        metadataItemNameView.ItemNameBehavior.validateInputName(inputValue).done(
            _.bind(function (success) {
              if (success) {
                metadataItemNameView.setInputBoxValue(inputValue);
                metadataItemNameView.setValue(inputValue);
                metadataItemNameView.modelHasEmptyName = false;
                metadataItemNameView.trigger("metadata:item:name:save", {
                  sender: metadataItemNameView
                });
              } else {
                return false;
              }
            }, this));
      });
    });

    describe('AuditView', function () {
      it('Click on audit tab', function (done) {
        var dropdownEle = $('.cs-tab-links.binf-dropdown:first');
        dropdownEle.find('button').trigger('click');
        dropdownEle.find('li[title=Audit] a').trigger('click');
        TestUtils.asyncElement('body',
            '.csui-audit .csui-audit-table .csui-nodetable tbody:visible').done(
            function (el) {
              expect(el.length).toBe(1);
              var columns = v1.metadataTabView.activeTabContent.tableView.options
                  .tableColumns.getColumnKeys();
              expect(columns.indexOf('audit_date') !== -1).toBeTruthy();
              done();
            });
      });

      it('Click on Date Sorting', function (done) {
        var date           = $(
            '.csui-audit .csui-audit-table .csui-nodetable thead th:nth-child(2)'),
            beforesortdate = $(
                '.csui-audit .csui-audit-table .csui-nodetable tbody tr:first-child td:first-child'
            ).text(),
            aftersortdate;
        date.trigger('click');
        TestUtils.asyncElement('.csui-audit .csui-audit-table',
            'tbody tr:first-child td:first-child div[title="Version Added"]', false)
            .done(function (el) {
              expect(el.length).toBe(1);
              aftersortdate = $(
                  '.csui-audit .csui-audit-table .csui-nodetable tbody tr:first-child td:first-child'
              ).text();
              expect(beforesortdate === aftersortdate).toBeFalsy();
              date.trigger('click');
              done();

            });
      });

      it('Click on user search icon, search for user that exist with audits', function (done) {
        $('.csui-audit .csui-audit-table .csui-nodetable th .csui-table-search-icon:last')
            .trigger('click');
        TestUtils.asyncElement('.csui-audit .csui-audit-table .csui-nodetable th',
            '.csui-table-searchbox input:visible').done(function (el) {
          expect(el.length).toBe(1);
          el.val('vineethreddy');
          el.trigger({
            type: 'keyup'
          });
          TestUtils.asyncElement(
              '.csui-audit .csui-audit-table .csui-nodetable th',
              '.typeahead.scroll-container:visible').done(function (el) {
            expect(el.length).toBe(1);
            el.find('ul li:first-child a').trigger('click');
            TestUtils.asyncElement(
                '.csui-audit .csui-audit-table .csui-nodetable',
                'tbody tr:first td:last .csui-table-cell-text[title="vineethreddy"]'
            ).done(function (el) {
              expect(el.length).toBe(1);
              done();
            });
          });
        });
      });

      it('Search for user that do not exist', function (done) {
        var ele = $(
            '.csui-audit-table .csui-nodetable th .csui-table-searchbox input:visible'
        );
        ele.val('xxx');
        ele.trigger({
          type: 'keyup'
        });
        ele.trigger({
          type: 'keydown'
        });
        TestUtils.asyncElement('.csui-audit .csui-audit-table .csui-nodetable th',
            '.typeahead.scroll-container:visible li.csui-typeahead-no-results')
            .done(function (el) {
              expect(el.length).toBe(1);
              ele.siblings(" .formfield_clear").trigger('click');
              expect(ele.val() === "").toBeTruthy();
              done();
            });
      });

      it('Click on user search icon, search for user that has no audits', function (done) {
        var el = $(
            '.csui-audit-table .csui-nodetable th .csui-table-searchbox input:visible'
        );
        el.val('kristen');
        el.trigger({
          type: 'keyup'
        });
        TestUtils.asyncElement('.csui-audit .csui-audit-table .csui-nodetable th',
            '.typeahead.scroll-container:visible ul li:first-child a').done(
            function (el) {
              expect(el.length).toBe(1);
              el.trigger('click');
              TestUtils.asyncElement(
                  '.csui-audit .csui-audit-table .csui-nodetable',
                  '.csui-table-empty .csui-no-result-message').done(function (el) {
                expect(el.length).toBe(1);
                done();
              });
            });
      });

      it('Close the user search box', function (done) {
        $('.csui-audit .csui-audit-table .csui-nodetable th[data-csui-attribute = user_id] .icon-search-hide')
            .trigger('click');
        TestUtils.asyncElement('.csui-audit .csui-audit-table .csui-nodetable',
            'tbody tr:first td:last .csui-table-cell-text[title="Admin"]').done(
            function (el) {
              expect(el.length).toBe(1);
              done();
            });
      });

      it('Click on action search', function (done) {
        $('.csui-audit .csui-audit-table .csui-nodetable th .csui-table-search-icon:first')
            .trigger('click');
        TestUtils.asyncElement('body',
            '.typeahead.scroll-container:visible ul.binf-dropdown-menu li > a:first:visible'
        ).done(function (el) {
          expect(el.length).toBe(1);
          var input = $(
              '.csui-audit-table .csui-nodetable th .csui-table-searchbox input:visible'
          );
          input.trigger({
            type: 'keydown',
            keyCode: 40
          }); // check accessiblity using up-down keys.
          input.trigger({
            type: 'keydown',
            keyCode: 38
          });
          el.trigger('click');
          TestUtils.asyncElement('body',
              'tbody tr:first td:first > div[title="Attribute Value Changed"]:visible').done(
              function (el) {
                expect(el.length).toBe(1);
                done();
              });
        });
      });

      it('Click on action search hide button', function (done) {
        $('.csui-audit .csui-audit-table .csui-nodetable th .csui-table-search-icon .icon-search-hide')
            .trigger('click');
        expect($('.csui-table-searchbox.binf-hidden').length).toBe(2);
        TestUtils.asyncElement('body',
            'tbody tr:first td:first > div[title="Shortcut Created"]:visible').done(
            function (el) {
              expect(el.length).toBe(1);
              done();
            });
      });
    });

    describe('VersionsTable', function () {

      it('Click on versions tab', function (done) {
        var dropdownEle = $('.cs-tab-links.binf-dropdown:first');
        dropdownEle.find('button').trigger('click');
        dropdownEle.find('li[title=Versions] a').trigger('click');
        TestUtils.asyncElement('body',
            '.csui-metadata-versions tbody td.csui-table-cell-version_number_name > span[title="2.3"]').done(
            function (el) {
              done();
            });
      });

      it('Select a version and click on promote to major version', function (done) {
        var checkboxEle = $('.csui-metadata-versions tbody td.csui-table-cell-_select .csui-checkbox-view > button:first');
        checkboxEle.click();
        TestUtils.asyncElement('body',
            '.csui-metadata-versions .csui-toolbar-region ul li[data-csui-command="promoteversion"] > a:visible').done(
            function (el) {
              el.click();
              done();
            });
      });
    });

  });

});
