/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'conws/widgets/team/impl/roles.model.factory',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/dialogs/addparticipants/addparticipants.view',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/utils/test/testutil',
  './addparticipants.mock.testmanager.js',
  'i18n!csui/controls/userpicker/nls/userpicker.lang'
], function (_, $, Backbone, Marionette, RolesCollectionFactory, ParticipantsCollectionFactory,
    AddParticipantsDialog, ModalDialogView, TestUtil, TestManager, UserPickerLang) {

  describe('Add-Participants Dialog', function () {

    'use strict';

    beforeEach(function () {
      TestManager.reset();
      TestManager.init();
      TestManager.prepare();

      TestManager.prepareDefaultData();
    });

    describe('view creation', function () {

      var view;

      it('with default configuration', function () {
        var originatingView = {
          on: function () { return; },
          context: TestManager.context,
          roleCollection: TestManager.context.getCollection(RolesCollectionFactory),
          participantCollection: TestManager.context.getCollection(ParticipantsCollectionFactory)
        };
        view = new AddParticipantsDialog({view: originatingView});
        expect(view.view).toBeDefined();
        expect(view.context).toBeDefined();
        expect(view.connector).toBeDefined();
        expect(view.workspaceContext).toBeDefined();
        expect(view.teamRoles).toBeDefined();
        expect(view.teamParticipants).toBeDefined();
      });
    });

    xdescribe('view renders', function () {

      var view;
      var debugit = false; // set it to false or "1", "2", "3", "4", ... according the value used in the test case

      afterEach(function () {
        if (!debugit) {
          $('.cs-dialog.binf-modal').remove();
        }
      });

      it('with default configuration', function () {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        var originatingView = {
          on: function () { return; },
          context: TestManager.context,
          roleCollection: roles,
          participantCollection: participants
        };
        view = new AddParticipantsDialog({view: originatingView});
        view.render();
        expect(view.$el).toBeDefined();
        var dialog = view.$('.binf-modal-content');
        expect(dialog.length).toEqual(1);
        var search = view.$('.binf-modal-content .conws-addparticipants-search');
        expect(search.length).toEqual(1);
        var userpicker = $(search).find('.conws-addparticipants-userpicker');
        expect(userpicker.length).toEqual(1);
        var rolepicker = $(search).find('.conws-addparticipants-rolepicker');
        expect(rolepicker.length).toEqual(1);
        var members = view.$('.binf-modal-content .conws-addparticipants-members > ul');
        expect(members.length).toEqual(1);
        var items = $(members).find('li');
        expect(items.length).toEqual(0);
        var button = view.$('button.clear');
        expect(button.length).toEqual(1);
        expect(button.is(':disabled')).toBeTruthy();
        expect(button.text().trim()).toEqual('Clear all');
        button = view.$('button.save');
        expect(button.length).toEqual(1);
        expect(button.is(':disabled')).toBeTruthy();
        expect(button.text().trim()).toEqual('Save');
        button = view.$('button.cancel');
        expect(button.length).toEqual(1);
        expect(button.is(':disabled')).toBeFalsy();
        expect(button.text().trim()).toEqual('Cancel');
      });

      it('and userpicker search works as expected', function (done) {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        TestManager.waitAsync(done, [roles.fetch(), participants.fetch()], 100);
        var userpicker;
        var input;
        TestUtil.run(done,function () {
          var originatingView = {
            on: function () { return; },
            context: TestManager.context,
            roleCollection: roles,
            participantCollection: participants
          };
          view = new AddParticipantsDialog({view: originatingView});
          view.render();
          expect(view.$el).toBeDefined();
          userpicker = view.$('.conws-addparticipants-userpicker .csui-control-userpicker');
          expect("userpicker.length="+userpicker.length).toEqual("userpicker.length="+1);
          input = $(userpicker).find('input');
          input.val('e');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 300",300);
          TestUtil.run(done,function () {
            var container = $(userpicker).find('.typeahead.scroll-container');
            expect("container.length="+container.length).toEqual("container.length="+1);
            var xrail = $(userpicker).find('.ps-scrollbar-x-rail');
            expect("xrail.length="+xrail.length).toEqual("xrail.length="+1);
            var yrail = $(userpicker).find('.ps-scrollbar-y-rail');
            expect("yrail.length="+yrail.length).toEqual("yrail.length="+1);
            var memberlist = $(userpicker).find('.typeahead.binf-dropdown-menu > li');
            expect(memberlist.length).toEqual(5);
            expect($(memberlist[0]).find('.member-info .name').text()).toEqual('Bruce Willis');
            expect($(memberlist[1]).find('.member-info .name').text()).toEqual('Bud Spencer');
            expect($(memberlist[2]).find('.member-info .name').text()).toEqual('Heinz Erhardt');
            expect($(memberlist[3]).find('.member-info .name').text()).toEqual('Louis De Funes');
            expect($(memberlist[4]).find('.member-info .name').text()).toEqual('Super Heroes');
            expect($(memberlist[1]).find('.member-info .name').text()).toEqual('Bud Spencer');
            expect($(memberlist[1]).find('.member-info .email').text()).toEqual('');
            expect($(memberlist[1]).find('.member-info .title').text()).toEqual('');
            expect($(memberlist[1]).find('.member-info .department').text()).toEqual('');
            expect($(memberlist[1]).find('.member-info .office').text()).toEqual('');
            expect($(memberlist[0]).find('.member-info .name').text()).toEqual('Bruce Willis');
            expect($(memberlist[0]).find('.member-info .email').text()).toEqual(
                'bwillis@elink.loc');
            expect($(memberlist[0]).find('.member-info .title').text()).toEqual(
                'New York Police Officer (Retired)');
            expect($(memberlist[0]).find('.member-info .department').text()).toEqual(
                'Famous Actors');
            expect($(memberlist[0]).find('.member-info .office').text()).toEqual(
                'Nakatomi Plaza (Office Building in Los Angeles)');
            expect($(memberlist[4]).find('.member-info .name').text()).toEqual('Super Heroes');
            expect($(memberlist[4]).find('.member-info .group-title').text()).toEqual(
                UserPickerLang.groupViewGroupTitle);
            expect($(memberlist[4]).find('.member-info .leader').text()).toEqual('Bruce Willis');
            expect($(memberlist[4]).find('.member-info .leader-title').text()).toEqual(
                UserPickerLang.groupViewLeaderTitle);
          });
        });
      });

      it('and rolepicker search works as expected', function (done) {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        TestManager.waitAsync(done, [roles.fetch(), participants.fetch()], 100);
        var rolepicker;
        var input;
        TestUtil.run(done,function (done) {
          var originatingView = {
            on: function () { return; },
            context: TestManager.context,
            roleCollection: roles,
            participantCollection: participants
          };
          view = new AddParticipantsDialog({view: originatingView});
          view.render();
          expect(view.$el).toBeDefined();
          rolepicker = view.$('.conws-addparticipants-rolepicker .conws-control-rolepicker');
          expect(rolepicker.length).toEqual(1);
          input = $(rolepicker).find('input');
          input.click();
          TestUtil.justWait(done,"justWait 200",200);
          TestUtil.run(done,function (done) {
            var container = $(rolepicker).find('.typeahead.scroll-container');
            expect(container.length).toEqual(1);
            var xrail = $(rolepicker).find('.ps-scrollbar-x-rail');
            expect(xrail.length).toEqual(1);
            var yrail = $(rolepicker).find('.ps-scrollbar-y-rail');
            expect(yrail.length).toEqual(1);
            var rolelist = $(rolepicker).find('.typeahead.binf-dropdown-menu > li');
            expect(rolelist.length).toEqual(3);
            expect($(rolelist[0]).find('a > span > span').text()).toEqual('Manager');
            expect($(rolelist[1]).find('a > span > span').text()).toEqual('Staff');
            expect($(rolelist[2]).find('a > span > span').text()).toEqual('Staff Council');
            input.val('taf');
            input.trigger($.Event('keyup', {keyCode: 70}));
            TestUtil.justWait(done,"justWait 200",200);
            TestUtil.run(done,function () {
              var rolelist = $(rolepicker).find('.typeahead.binf-dropdown-menu > li');
              expect(rolelist.length).toEqual(2);
              expect($(rolelist[0]).find('a > span > span').text()).toEqual('Staff');
              expect($(rolelist[1]).find('a > span > span').text()).toEqual('Staff Council');
            });
          });
        });
      });

      it('and a participant can be configured with multiple roles', function (done) {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        TestManager.waitAsync(done, [roles.fetch(), participants.fetch()], 100);
        var button;
        var userpicker;
        var rolepicker;
        var input;
        TestUtil.run(done,function (done) {
          var originatingView = {
            on: function () { return; },
            off: function () { return; },
            context: TestManager.context,
            roleCollection: roles,
            participantCollection: participants
          };
          view = new AddParticipantsDialog({view: originatingView});
          if (debugit==="4") {
            var dialog = new ModalDialogView({
              body: view,
              modalClassName: 'conws-addparticipants'
            });
            dialog.show();
          } else {
            view.render();
          }
          expect(view.$el).toBeDefined();
          button = view.$('button.clear');
          expect(button.length).toEqual(1);
          expect(button.is(':disabled')).toBeTruthy();
          expect(button.text().trim()).toEqual('Clear all');
          button = view.$('button.save');
          expect(button.length).toEqual(1);
          expect(button.is(':disabled')).toBeTruthy();
          expect(button.text().trim()).toEqual('Save');
          button = view.$('button.cancel');
          expect(button.length).toEqual(1);
          expect(button.is(':disabled')).toBeFalsy();
          expect(button.text().trim()).toEqual('Cancel');
          userpicker = view.$('.conws-addparticipants-userpicker .csui-control-userpicker');
          expect(userpicker.length).toEqual(1);
          rolepicker = view.$('.conws-addparticipants-rolepicker .conws-control-rolepicker');
          expect(rolepicker.length).toEqual(1);
          input = $(userpicker).find('input');
          input.val('bruce');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 300",300);
          TestUtil.run(done,function (done) {
            var memberlist = $(userpicker).find('.typeahead.binf-dropdown-menu > li');
            expect($(memberlist[0]).find('.member-info .name').text()).toEqual('Bruce Willis');
            $(memberlist[0]).find('a').click();
            button = view.$('button.clear');
            expect(button.is(':disabled')).toBeFalsy();
            button = view.$('button.save');
            expect(button.is(':disabled')).toBeTruthy();
            button = view.$('button.cancel');
            expect(button.is(':disabled')).toBeFalsy();
            input = $(rolepicker).find('input');
            input.val('taf');
            input.trigger($.Event('keyup', {keyCode: 70}));
            TestUtil.justWait(done,"justWait 200",200);
            TestUtil.run(done,function (done) {
              var rolelist = $(rolepicker).find('.typeahead.binf-dropdown-menu > li');
              expect($(rolelist[0]).find('a > span > span').text()).toEqual('Staff');
              $(rolelist[0]).find('a').click();
              var members = view.$('.conws-addparticipants-members > ul > li');
              expect(members.length).toEqual(1);
              var info = $(members[0]).find('.participant-content .participant-info');
              expect($(info).find('.name').text()).toEqual('Bruce Willis');
              expect($(info).find('.email').text()).toEqual('bwillis@elink.loc');
              expect($(info).find('.title').text()).toEqual('New York Police Officer (Retired)');
              expect($(info).find('.department').text()).toEqual('Famous Actors');
              expect($(info).find('.office').text()).toEqual(
                  'Nakatomi Plaza (Office Building in Los Angeles)');
              var roles = $(members[0]).find('.participant-roles .participant-roles-list li');
              expect(roles.length).toEqual(1);
              expect($(roles).find('strong').text()).toEqual('Staff');
              button = view.$('button.clear');
              expect(button.is(':disabled')).toBeFalsy();
              button = view.$('button.save');
              expect(button.is(':disabled')).toBeFalsy();
              button = view.$('button.cancel');
              expect(button.is(':disabled')).toBeFalsy();
              rolepicker = $(members[0]).find('.participant-roles .conws-control-rolepicker');
              input = $(rolepicker).find('input');
              input.val('man');
              input.trigger($.Event('keyup', {keyCode: 78}));
              TestUtil.justWait(done,"justWait 200",200);
              TestUtil.run(done,function (done) {
                rolelist = $(rolepicker).find('.typeahead.binf-dropdown-menu > li');
                expect($(rolelist[0]).find('a > span > span').text()).toEqual('Manager');
                $(rolelist[0]).find('a').click();
                document.stgroles = roles = $(members[0]).find('.participant-roles .participant-roles-list li');
                expect(roles.length).toEqual(2);
                expect('Role:'+$(roles[0]).find('strong').text()).toEqual('Role:Manager');
                expect('Role:'+$(roles[1]).find('strong').text()).toEqual('Role:Staff');
                button = view.$('button.clear');
                expect(button.is(':disabled')).toBeFalsy();
                button = view.$('button.save');
                expect(button.is(':disabled')).toBeFalsy();
                button = view.$('button.cancel');
                expect(button.is(':disabled')).toBeFalsy();
                view.teamParticipants.newParticipants = [];
                if (debugit!=="4") {
                  button = view.$('button.save');
                  button.click();
                  TestUtil.justWait(done);
                  TestUtil.run(done,function () {
                    expect(TestManager.workspaceRolesUrlPostCount).toEqual(2);
                  });
                }
              });
            });
          });
        });
      });

      it('and a participant cannot be added multiple times', function (done) {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        TestManager.waitAsync(done, [roles.fetch(), participants.fetch()], 100);
        var button;
        var userpicker;
        var rolepicker;
        var input;
        var editor;
        TestUtil.run(done,function (done) {
          var originatingView = {
            on: function () { return; },
            context: TestManager.context,
            roleCollection: roles,
            participantCollection: participants
          };

          view = new AddParticipantsDialog({view: originatingView});
          view.on('dom:refresh', function () {
            view._attachedToDom = true;
          });
          editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-addparticipants'
          });
          editor.show();
          userpicker = view.$('.conws-addparticipants-userpicker .csui-control-userpicker');
          expect(userpicker.length).toEqual(1);
          input = $(userpicker).find('input');
          input.val('bruce');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 300",300);
          TestUtil.run(done,function () {
            var userpickerlist = $(userpicker).find('.typeahead .binf-dropdown-menu > li');
            expect($(userpickerlist[0]).find('.member-info .name').text()).toEqual('Bruce Willis');
            expect($(userpickerlist[0]).find('.member-info .email').text()).toEqual(
                'bwillis@elink.loc');
            expect($(userpickerlist[0]).find('.member-info .title').text()).toEqual(
                'New York Police Officer (Retired)');
            expect($(userpickerlist[0]).find('.member-info .department').text()).toEqual(
                'Famous Actors');
            expect($(userpickerlist[0]).find('.member-info .office').text()).toEqual(
                'Nakatomi Plaza (Office Building in Los Angeles)');
            $(userpickerlist[0]).find('a').click();
          TestUtil.waitFor(done,function () {
            return  view.$('.conws-addparticipants-members > ul > li').length > 0;
          }, 'table items to be displayed ', 100);

            TestUtil.run(done,function () {
            var members = view.$('.conws-addparticipants-members > ul > li');
            expect(members.length).toEqual(1);
            var info = $(members[0]).find('.participant-content .participant-info');
            expect($(info).find('.name').text()).toEqual('Bruce Willis');
            input = $(userpicker).find('input');
            input.val('bruce');
            input.trigger($.Event('keyup', {keyCode: 69}));

          });
            TestUtil.justWait(done,"justWait 300",300);

            TestUtil.waitFor(done,function () {
              return view._attachedToDom;
            }, 'The view isn\'t attached to the DOM.', 1000);
            TestUtil.run(done,function () {
              var userpickerlist = $(userpicker).find('.typeahead .binf-dropdown-menu > li');
              expect($(userpickerlist[0]).find('.member-info.binf-disabled .name').text()).toEqual(
                  'Bruce Willis');
              expect($(userpickerlist[0]).find('.member-info.binf-disabled .email').text()).toEqual(
                  'bwillis@elink.loc');
              expect($(userpickerlist[0]).find('.member-info.binf-disabled .title').text()).toEqual(
                  'New York Police Officer (Retired)');
              expect(
                  $(userpickerlist[0]).find('.member-info.binf-disabled .department').text()).toEqual(
                  'Famous Actors');
              expect($(userpickerlist[0]).find('.member-info.binf-disabled .office').text()).toEqual(
                  'Nakatomi Plaza (Office Building in Los Angeles)');
              expect($(userpickerlist[0]).find('.member-info.binf-disabled .message').text()).toEqual(
                  'Is already a participant.');
          });
          });
        });
      });

      it('and a participant can be removed', function (done) {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        TestManager.waitAsync(done, [roles.fetch(), participants.fetch()], 100);
        var button;
        var userpicker;
        var rolepicker;
        var input;
        TestUtil.run(done,function (done) {
          var originatingView = {
            on: function () { return; },
            context: TestManager.context,
            roleCollection: roles,
            participantCollection: participants
          };
          view = new AddParticipantsDialog({view: originatingView});
          view.render();
          expect(view.$el).toBeDefined();
          userpicker = view.$('.conws-addparticipants-userpicker .csui-control-userpicker');
          expect(userpicker.length).toEqual(1);
          input = $(userpicker).find('input');
          input.val('bruce');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 300",300);
          TestUtil.run(done,function (done) {
            var userpickerlist = $(userpicker).find('.typeahead.binf-dropdown-menu > li');
            expect(userpickerlist.length).toEqual(1);
            expect($(userpickerlist[0]).find('.member-info .name').text()).toEqual('Bruce Willis');
            $(userpickerlist[0]).find('a').click();
            TestUtil.justWait(done);
            TestUtil.run(done,function (done) {
              var members = view.$('.conws-addparticipants-members > ul > li');
              expect(members.length).toEqual(1);
              var remove = $(members[0]).find('.participant-delete span');
              remove.click();
              TestUtil.justWait(done);
              TestUtil.run(done,function () {
                var members = view.$('.conws-addparticipants-members > ul > li');
                expect(members.length).toEqual(0);
              });
            });
          });
        });
      });

      it('and all participants can be removed', function (done) {
        var roles = TestManager.context.getCollection(RolesCollectionFactory);
        var participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        TestManager.waitAsync(done, [roles.fetch(), participants.fetch()], 100);
        var button;
        var userpicker;
        var rolepicker;
        var input;
        TestUtil.run(done,function (done) {
          var originatingView = {
            on: function () { return; },
            context: TestManager.context,
            roleCollection: roles,
            participantCollection: participants
          };
          view = new AddParticipantsDialog({view: originatingView});
          view.render();
          expect(view.$el).toBeDefined();
          userpicker = view.$('.conws-addparticipants-userpicker .csui-control-userpicker');
          expect(userpicker.length).toEqual(1);
          input = $(userpicker).find('input');
          input.val('bruce');
          input.trigger($.Event('keyup', {keyCode: 69}));
          TestUtil.justWait(done,"justWait 300",300);
          TestUtil.run(done,function (done) {
            var userpickerlist = $(userpicker).find('.typeahead.binf-dropdown-menu > li');
            expect(userpickerlist.length).toEqual(1);
            $(userpickerlist[0]).find('a').click();
            TestUtil.justWait(done);
            TestUtil.run(done,function (done) {
              input = $(userpicker).find('input');
              input.val('louis');
              input.trigger($.Event('keyup', {keyCode: 83}));
              TestUtil.justWait(done,"justWait 300",300);
              TestUtil.run(done,function (done) {
                var userpickerlist = $(userpicker).find('.typeahead.binf-dropdown-menu > li');
                expect(userpickerlist.length).toEqual(1);
                $(userpickerlist[0]).find('a').click();
                TestUtil.justWait(done);
                TestUtil.run(done,function (done) {
                  var members = view.$('.conws-addparticipants-members > ul > li');
                  expect(members.length).toEqual(2);
                  button = view.$('button.clear');
                  button.click();
                  TestUtil.justWait(done);
                  TestUtil.run(done,function () {
                    var members = view.$('.conws-addparticipants-members > ul > li');
                    expect(members.length).toEqual(0);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('ending test suite', function () {
      it('wait some time for mocks to be satisfied', function (done) {
        TestUtil.run(done,function() {
          TestUtil.justWait(done,"justWait 1000",1000);
        });
        TestManager.clearMocks();
      });
    });

  });
})
;