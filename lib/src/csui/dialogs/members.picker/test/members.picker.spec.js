/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context', './members.picker.mock.data.js',
  'csui/models/node/node.model', 'i18n!csui/utils/commands/nls/localized.strings',
  'csui/dialogs/members.picker/members.picker.wizard', 'csui/utils/contexts/factories/connector',
  "../../../utils/testutils/async.test.utils.js", 'csui/dialogs/members.picker/start.locations/start.location.collection'
], function (_, $, Marionette, PageContext,  MembersPickerMock, NodeModel, lang,
    MembersPickerDialog, ConnectorFactory, TestUtils, StartLocationCollection) {
    describe("Memberspicker", function () {
        var context, config ,node, membersPickerDialog, memberPickerView, connector,
        dialogClass = "cs-permission-group-picker",
        dialogTitle = "Add users or groups",
        displayName = "Users and Groups",
        startLocations = ['all.members', 'member.groups'];
        var deferred = $.Deferred();
        beforeAll(function () {
            TestUtils.restoreEnvironment();
            MembersPickerMock.enable();
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
            connector = context.getObject(ConnectorFactory);
            node = new NodeModel({id: 37474}, {connector: connector});
            config = window.csui.requirejs.s.contexts._.config
                         .config['csui/dialogs/members.picker/members.picker.wizard'] || {};
            membersPickerDialog = new MembersPickerDialog({
              command: 'adduserorgroup',
              context: context,
                    connector: connector,
                    dialogClass: dialogClass,
                    displayName: displayName,
                    dialogTitle: dialogTitle,
                    startLocation: 'all.members',
                    adduserorgroup: true,
                    addButtonLabel: lang.AddButtonLabel,
                    startLocations: startLocations,
                    nodeModel: node,
            });
                membersPickerDialog.show()
                  .done(function () {
                    deferred.resolve.apply(deferred, arguments);
                   }).fail(function (error) {
                     deferred.reject.apply(deferred, arguments);
                });
        });

        afterAll(function () {
            TestUtils.cancelAllAsync();

            MembersPickerMock.disable();
            TestUtils.restoreEnvironment();
        });

          it('can be constructed', function (done) {
            TestUtils.asyncElement('body', '.binf-modal-content:visible').done(
                function ($el) {
                expect(membersPickerDialog instanceof MembersPickerDialog).toBeTruthy();
                done();
            });
          });

          it("Checking for the presence of dialog title", function (done) {
            TestUtils.asyncElement('.binf-modal-content', '.member-title').done(
                function (el) {
                expect(el[0].innerText).toEqual("Add users or groups");
                done();
            });
          });

          it("Checking for the presence of dropdown-locations", function (done) {
            TestUtils.asyncElement('.binf-modal-content', '.dropdown-locations').done(
                function (el) {
                expect(el).toBeTruthy();
                done();
            });
          });

          it('confirm add button is not enabled', function () {
            var addButton = $('.cs-add-button');
            expect(addButton.prop('disabled')).toBe(true);
          });

        describe('validate the presence of search icon', function () {

          it("Checking for the presence of search icon", function () {
            expect($(".icon-sv-search").is(":visible")).toBeTruthy();
          });

          it('confirm search icon is not present on right panel after selecting a group', function () {
            var list = $('.csui-list-group-item');
            list.eq(0).trigger('click');
            var searchIcon = $('.csui-slideMidLeft .icon-sv-search');
            expect(searchIcon.is(":visible")).toBeFalsy();
          });

          it('confirm search icon is not visible after selecting a group from right panel', function (done) {
            TestUtils.asyncElement('.binf-modal-content', '.csui-slideMidLeft .csui-list-group-item').done(
                function (el) {
                expect(el.length).toBe(5);
                el.eq(1).trigger('click');
                var searchIcon = $('.csui-slideMidLeft .icon-sv-search');
                expect(searchIcon.is(":visible")).toBeFalsy();
                done();
            });
          });

          it("click on the dropdown button and check whether dropdown menu has expanded", function (done) {

            var dropdownButton = $('.binf-modal-content .binf-dropdown-toggle');
            dropdownButton.trigger('click');
            TestUtils.asyncElement('.binf-modal-content', '.binf-dropdown-menu:visible').done(
                function (el) {
                  expect(el.length).toBe(1);
                  done();
            });
          });

          it("select 'Groups where I am member' from dropdown", function(done) {
            TestUtils.asyncElement('.binf-modal-content', '.binf-dropdown-menu:visible').done( function($el){
                var list = $el.find('li');
                var groupsList = list.eq(1).find('a');
                groupsList.trigger('click');
                var buttonLabel = $('.dropdown-locations .binf-dropdown-toggle .cs-label');
                expect(buttonLabel[0].innerText).toEqual("Groups where I am member");
                done();
            });
          });

          it("confirm search icon is not present after selecting 'Groups where I am member'", function (done) {
            TestUtils.asyncElement('.binf-modal-content', '.cs-start-locations .icon-sv-search', true).done( function($el){
                expect($el.is(":visible")).toBeFalsy();
                done();
            });
          });
        });
    });
});