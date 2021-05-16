/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/dialogs/participants/roles.edit.view',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/roles.model.factory',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js'
], function ($, PageContext, TeamCollectionFactory, RolesEditView, ParticipantsCollectionFactory,
    RolesCollectionFactory, ModalDialogView, TestUtil, TestManager) {
  describe('ParticipantsEdit', function () {

    'use strict';

    var id;

    beforeEach(function () {
      TestManager.reset();
      TestManager.init(id);
      TestManager.prepare(id);
    });

    describe('view creation', function () {

      id = 4711;

      it('succeeds without configuration', function () {

        var view = new RolesEditView({model: undefined, parent: undefined});
        expect(TestManager.context).toBeDefined();
        expect(view.options).toBeDefined();
        expect(view.context).toBeUndefined();
        expect(view.model).toBeUndefined();

      });
    });

    describe('view renders with actions remove and select', function () {

      var view;
      var collection;
      beforeEach(function () {

        collection = TestManager.context.getCollection(ParticipantsCollectionFactory);
      });

      it('a member with just one role assigend and no available role.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff', leader: true}, actions: {"edit-role": {body: ''}}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done, function () {
          expect(collection.length).toEqual(1);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = header.find('h2');
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for user Bud Spencer');

          var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
          expect(body.length).toEqual(1);

          var left = view.$('.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
          expect(left.length).toEqual(1);
          var right = view.$(
              '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
          expect(right.length).toEqual(1);
          var assigned = left.find('ul > li');
          expect(assigned.length).toEqual(1);
          var listDiv = assigned.find('div > div')
          expect(listDiv.length).toEqual(1);
          expect(listDiv.text()).toEqual('Staff');
          var remove = assigned.find('div > a')
          expect(remove.length).toEqual(1);
          expect(remove.attr('data-id')).toEqual('101');
          var unassigned = right.find('ul > li');
          expect(unassigned.length).toEqual(0);

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(buttons.find('button').length).toEqual(3);
        });
      });

      it('a member with one role assigned and one available role.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'Support'}, leader: false, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = header.find('h2');
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for user Bud Spencer');

          var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
          expect(body.length).toEqual(1);

          var left = view.$('.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
          expect(left.length).toEqual(1);
          var right = view.$(
              '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
          expect(right.length).toEqual(1);
          var assigned = left.find('ul > li');
          expect(assigned.length).toEqual(1);
          var listDiv = assigned.find('div > div')
          expect(listDiv.length).toEqual(1);
          expect(listDiv.text()).toEqual('Staff');
          var remove = assigned.find('div > a')
          expect(remove.length).toEqual(1);
          expect(remove.attr('data-id')).toEqual('101');
          var unassigned = right.find('ul > li');
          expect(unassigned.length).toEqual(1);
          var span = unassigned.find('a > span')
          expect(span.length).toEqual(1);
          expect(span.text()).toEqual('Support');
          var selection = unassigned.find('a')
          expect(selection.length).toEqual(1);
          expect(selection.attr('data-id')).toEqual('102');

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(buttons.find('button').length).toEqual(3);

          var save = buttons.find('.conws-roles-edit-button-save');
          expect(save.length).toEqual(1);
          expect(save.text()).toEqual('Save');
          expect(save.attr('disabled')).toBeDefined();
          var reset = buttons.find('.conws-roles-edit-button-reset');
          expect(reset.length).toEqual(1);
          expect(reset.text()).toEqual('Reset');
        });
      });

      it('a member with one role assigned and this role is removed.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'Support'}, leader: false, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = header.find('h2');
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for user Bud Spencer');

          var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
          expect(body.length).toEqual(1);

          var left = view.$('.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
          expect(left.length).toEqual(1);
          var right = view.$(
              '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
          expect(right.length).toEqual(1);
          var assigned = left.find('ul > li');
          expect(assigned.length).toEqual(1);
          var listDiv = assigned.find('div > div')
          expect(listDiv.length).toEqual(1);
          expect(listDiv.text()).toEqual('Staff');
          var remove = assigned.find('div > a')
          expect(remove.length).toEqual(1);
          expect(remove.attr('data-id')).toEqual('101');
          var unassigned = right.find('ul > li');
          expect(unassigned.length).toEqual(1);
          var span = unassigned.find('a > span')
          expect(span.length).toEqual(1);
          expect(span.text()).toEqual('Support');
          var selection = unassigned.find('a')
          expect(selection.length).toEqual(1);
          expect(selection.attr('data-id')).toEqual('102');
          var removeMessage = left.find('.conws-roles-edit-canedit-empty');
          expect(removeMessage.length).toEqual(0);

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(buttons.find('button').length).toEqual(3);

          var save = buttons.find('.conws-roles-edit-button-save');
          expect(save.length).toEqual(1);
          expect(save.text()).toEqual('Save');
          expect(save.attr('disabled')).toBeDefined();
          var reset = buttons.find('.conws-roles-edit-button-reset');
          expect(reset.length).toEqual(1);
          expect(reset.text()).toEqual('Reset');
          view.assignedRolesListRegion.currentView.itemRemove({
            currentTarget: remove[0], preventDefault: function () {
            }, stopPropagation: function () {
            }
          });
          assigned = left.find('ul > li');
          expect(assigned.length).toEqual(0);
          removeMessage = left.find('.conws-roles-edit-canedit-empty');
          expect(removeMessage.length).toEqual(1);
          unassigned = right.find('ul > li');
          expect(unassigned.length).toEqual(2);
          span = unassigned.find('a > span')
          expect(span.length).toEqual(2);
          expect(unassigned.find(span[0]).text()).toEqual('Staff');
          expect(unassigned.find(span[1]).text()).toEqual('Support');
          selection = unassigned.find('a')
          expect(selection.length).toEqual(2);
          expect(unassigned.find(selection[0]).attr('data-id')).toEqual('101');
          expect(unassigned.find(selection[1]).attr('data-id')).toEqual('102');
          buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(buttons.find('button').length).toEqual(3);

          save = buttons.find('.conws-roles-edit-button-save');
          expect(save.length).toEqual(1);
          expect(save.text()).toEqual('Remove');
          expect(save.attr('disabled')).toBeUndefined();
          reset = buttons.find('.conws-roles-edit-button-reset');
          expect(reset.length).toEqual(1);
          expect(reset.text()).toEqual('Reset');
        });
      });

      it('a member with one role assigned and this role is removed and in addition the other' +
         ' role is added.',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'Support'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [collection.fetch()], 100);
            TestUtil.run(done,function () {
              expect(collection.length).toEqual(2);
              view = new RolesEditView({
                model: collection.at(0),
                participantCollection: undefined,
                roleCollection: undefined
              });
              view.render();
              var div = view.$('.binf-modal-content');
              expect(div.length).toEqual(1);
              var header = view.$('.binf-modal-header');
              expect(header.length).toEqual(1);
              var headerText = header.find('h2');
              expect(headerText.length).toEqual(1);
              expect(headerText.text()).toEqual('Roles for user Bud Spencer');

              var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
              expect(body.length).toEqual(1);

              var left = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
              expect(left.length).toEqual(1);
              var right = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
              expect(right.length).toEqual(1);
              var assigned = left.find('ul > li');
              expect(assigned.length).toEqual(1);
              var listDiv = assigned.find('div > div')
              expect(listDiv.length).toEqual(1);
              expect(listDiv.text()).toEqual('Staff');
              var remove = assigned.find('div > a')
              expect(remove.length).toEqual(1);
              expect(remove.attr('data-id')).toEqual('101');
              var unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(1);
              var span = unassigned.find('a > span')
              expect(span.length).toEqual(1);
              expect(span.text()).toEqual('Support');
              var selection = unassigned.find('a')
              expect(selection.length).toEqual(1);
              expect(selection.attr('data-id')).toEqual('102');
              var removeMessage = left.find('.conws-roles-edit-canedit-empty');
              expect(removeMessage.length).toEqual(0);

              var buttons = view.$('.conws-roles-edit-buttons');
              expect(buttons.length).toEqual(1);
              expect(buttons.find('button').length).toEqual(3);

              var save = buttons.find('.conws-roles-edit-button-save');
              expect(save.length).toEqual(1);
              expect(save.text()).toEqual('Save');
              expect(save.attr('disabled')).toBeDefined();
              var reset = buttons.find('.conws-roles-edit-button-reset');
              expect(reset.length).toEqual(1);
              expect(reset.text()).toEqual('Reset');
              view.assignedRolesListRegion.currentView.itemRemove({
                currentTarget: remove[0], preventDefault: function () {
                }, stopPropagation: function () {
                }
              });
              view.availableRolesListRegion.currentView.itemSelect({
                currentTarget: selection[0], preventDefault: function () {
                }, stopPropagation: function () {
                }
              });
              assigned = left.find('ul > li');
              expect(assigned.length).toEqual(1);
              removeMessage = left.find('.conws-roles-edit-canedit-empty');
              expect(removeMessage.length).toEqual(0);
              var selected = right.find('ul > li > div > a');
              expect(selected.length).toEqual(1);
              expect(selected.attr('data-id')).toEqual('101');
              buttons = view.$('.conws-roles-edit-buttons');
              expect(buttons.length).toEqual(1);
              expect(buttons.find('button').length).toEqual(3);

              save = buttons.find('.conws-roles-edit-button-save');
              expect(save.length).toEqual(1);
              expect(save.text()).toEqual('Save');
              expect(save.attr('disabled')).toBeUndefined();
              reset = buttons.find('.conws-roles-edit-button-reset');
              expect(reset.length).toEqual(1);
              expect(reset.text()).toEqual('Reset');
            });
          });

      it('a group member with one role assigned, check title.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'Support'}, leader: false, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 1, name: 'badactors', display_name: 'Bad Actors'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['badactors', 'lfunes']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = header.find('h2');
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for group Bad Actors');

          var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
          expect(body.length).toEqual(1);

          var left = view.$('.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
          expect(left.length).toEqual(1);
          var right = view.$(
              '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
          expect(right.length).toEqual(1);
          var assigned = left.find('ul > li');
          expect(assigned.length).toEqual(1);
          var listDiv = assigned.find('div > div')
          expect(listDiv.length).toEqual(1);
          expect(listDiv.text()).toEqual('Staff');
          var remove = assigned.find('div > a')
          expect(remove.length).toEqual(1);
          expect(remove.attr('data-id')).toEqual('101');
          var unassigned = right.find('ul > li');
          expect(unassigned.length).toEqual(1);
          var span = unassigned.find('a > span')
          expect(span.length).toEqual(1);
          expect(span.text()).toEqual('Support');
          var selection = unassigned.find('a')
          expect(selection.length).toEqual(1);
          expect(selection.attr('data-id')).toEqual('102');

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(buttons.find('button').length).toEqual(3);

          var save = buttons.find('.conws-roles-edit-button-save');
          expect(save.length).toEqual(1);
          expect(save.text()).toEqual('Save');
          expect(save.attr('disabled')).toBeDefined();
          var reset = buttons.find('.conws-roles-edit-button-reset');
          expect(reset.length).toEqual(1);
          expect(reset.text()).toEqual('Reset');
        });
      });

    });

    describe('view renders and filter lists', function () {

      var view;
      var collection;
      beforeEach(function () {

        collection = TestManager.context.getCollection(ParticipantsCollectionFactory);
      });

      it('a member with five roles assigned and five roles not assigned, filter the lists.',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Abcd'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'AbcdE'}, leader: false, actions: {}},
              {props: {id: 103, name: 'AbcdeF'}, leader: false, actions: {}},
              {props: {id: 104, name: 'AbcdefG'}, leader: false, actions: {}},
              {props: {id: 105, name: 'AbcdefgH'}, leader: false, actions: {}},
              {props: {id: 106, name: 'Ubcd'}, leader: false, actions: {}},
              {props: {id: 107, name: 'UbcdE'}, leader: false, actions: {}},
              {props: {id: 108, name: 'UbcdeF'}, leader: false, actions: {}},
              {props: {id: 109, name: 'UbcdefG'}, leader: false, actions: {}},
              {props: {id: 110, name: 'UbcdefgH'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Abcd', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdE', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdeF', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdefG', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdefgH', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [collection.fetch()], 100);
            TestUtil.run(done,function () {
              expect(collection.length).toEqual(2);
              view = new RolesEditView({
                model: collection.at(0),
                participantCollection: undefined,
                roleCollection: undefined
              });
              view.render();
              var div = view.$('.binf-modal-content');
              expect(div.length).toEqual(1);
              var header = view.$('.binf-modal-header');
              expect(header.length).toEqual(1);
              var headerText = header.find('h2');
              expect(headerText.length).toEqual(1);
              expect(headerText.text()).toEqual('Roles for user Bud Spencer');

              var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
              expect(body.length).toEqual(1);

              var left = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
              expect(left.length).toEqual(1);
              var right = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
              expect(right.length).toEqual(1);
              var assigned = left.find('ul > li');
              expect(assigned.length).toEqual(5);
              var unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(5);
              view.assignedRolesListRegion.currentView.filterModel.set('filter', 'fg');
              view.availableRolesListRegion.currentView.filterModel.set('filter', '');
              assigned = left.find('ul > li');
              expect(assigned.length).toEqual(2);
              unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(5);
              view.assignedRolesListRegion.currentView.filterModel.set('filter', 'fgh');
              view.availableRolesListRegion.currentView.filterModel.set('filter', 'DE');
              assigned = left.find('ul > li');
              expect(assigned.length).toEqual(1);
              unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(4);

            });

          });
    });

    describe('view renders and filter lists with inherited roles', function () {

      var view;
      var collection;
      beforeEach(function () {
        collection = TestManager.context.getCollection(ParticipantsCollectionFactory);
      });

      it('a member with five roles assigned and five roles not assigned, each list has 1' +
         ' inherited role.',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Abcd'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'AbcdE', inherited_from_id: 99}, leader: false, actions: {}},
              {props: {id: 103, name: 'AbcdeF'}, leader: false, actions: {}},
              {props: {id: 104, name: 'AbcdefG'}, leader: false, actions: {}},
              {props: {id: 105, name: 'AbcdefgH'}, leader: false, actions: {}},
              {props: {id: 106, name: 'Ubcd', inherited_from_id: 99}, leader: false, actions: {}},
              {props: {id: 107, name: 'UbcdE'}, leader: false, actions: {}},
              {props: {id: 108, name: 'UbcdeF'}, leader: false, actions: {}},
              {props: {id: 109, name: 'UbcdefG'}, leader: false, actions: {}},
              {props: {id: 110, name: 'UbcdefgH'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Abcd', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdE', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdeF', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdefG', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdefgH', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [collection.fetch()], 100);
            TestUtil.run(done,function () {
              expect(collection.length).toEqual(2);
              view = new RolesEditView({
                model: collection.at(0),
                participantCollection: undefined,
                roleCollection: undefined
              });
              view.render();
              var div = view.$('.binf-modal-content');
              expect(div.length).toEqual(1);
              var header = view.$('.binf-modal-header');
              expect(header.length).toEqual(1);
              var headerText = header.find('h2');
              expect(headerText.length).toEqual(1);
              expect(headerText.text()).toEqual('Roles for user Bud Spencer');

              var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
              expect(body.length).toEqual(1);

              var left = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
              expect(left.length).toEqual(1);
              var right = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
              expect(right.length).toEqual(1);
              var assigned = left.find('ul > li');
              expect(assigned.length).toEqual(5);

              var inherited = left.find('div.conws-roles-edit-canedit-inherit');
              expect(inherited.length).toEqual(1);
              var unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(4);
            });
          });

      it('a member with five roles assigned and five roles not assigned, two assigned and three' +
         ' unassigned are inherited.',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Abcd'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'AbcdE', inherited_from_id: 99}, leader: false, actions: {}},
              {props: {id: 103, name: 'AbcdeF'}, leader: false, actions: {}},
              {props: {id: 104, name: 'AbcdefG'}, leader: false, actions: {}},
              {
                props: {id: 105, name: 'AbcdefgH', inherited_from_id: 99},
                leader: false,
                actions: {}
              },
              {props: {id: 106, name: 'Ubcd', inherited_from_id: 99}, leader: false, actions: {}},
              {props: {id: 107, name: 'UbcdE', inherited_from_id: 99}, leader: false, actions: {}},
              {props: {id: 108, name: 'UbcdeF', inherited_from_id: 99}, leader: false, actions: {}},
              {props: {id: 109, name: 'UbcdefG'}, leader: false, actions: {}},
              {props: {id: 110, name: 'UbcdefgH'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Abcd', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdE', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdeF', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdefG', ['bspencer', 'lfunes']);
            TestManager.addMembers('AbcdefgH', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [collection.fetch()], 100);
            TestUtil.run(done,function () {
              expect(collection.length).toEqual(2);
              view = new RolesEditView({
                model: collection.at(0),
                participantCollection: undefined,
                roleCollection: undefined
              });
              view.render();
              var div = view.$('.binf-modal-content');
              expect(div.length).toEqual(1);
              var header = view.$('.binf-modal-header');
              expect(header.length).toEqual(1);
              var headerText = header.find('h2');
              expect(headerText.length).toEqual(1);
              expect(headerText.text()).toEqual('Roles for user Bud Spencer');

              var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
              expect(body.length).toEqual(1);

              var left = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
              expect(left.length).toEqual(1);
              var right = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
              expect(right.length).toEqual(1);
              var assigned = left.find('ul > li');
              expect(assigned.length).toEqual(5);

              var inherited = left.find('div.conws-roles-edit-canedit-inherit');
              expect(inherited.length).toEqual(2);
              var unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(2);
            });
          });
    });

    describe('save action and dirty detection', function () {

      var view;
      var participants;
      var roles;
      var savedCalls = 0;

      beforeEach(function () {
        participants = TestManager.context.getCollection(ParticipantsCollectionFactory);
        roles = TestManager.context.getCollection(RolesCollectionFactory);
      });

      afterEach(function () {
        $('.cs-dialog.binf-modal').remove();
      })

      it('a member with two assigned roles and one role is removed.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'Support'}, leader: false, actions: {}},
          {props: {id: 103, name: 'StaffExt'}, leader: false, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.addMembers('StaffExt', ['bspencer', 'lfunes']);
        TestManager.waitAsync(done, [participants.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(participants.length).toEqual(2);
          view = new RolesEditView({
            model: participants.at(0),
            participantCollection: participants,
            roleCollection: roles
          });
          view.render();

          savedCalls = 0;
          view.listenTo(participants, 'saved', function () {
            savedCalls++;
          });
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = header.find('h2');
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for user Bud Spencer');

          var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
          expect(body.length).toEqual(1);

          var left = view.$('.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
          expect(left.length).toEqual(1);
          var right = view.$(
              '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
          expect(right.length).toEqual(1);
          var assigned = left.find('ul > li');
          expect(assigned.length).toEqual(2);
          var listDiv = assigned.find('div > div')
          expect(listDiv.length).toEqual(2);
          expect(listDiv[0].innerText.trim()).toEqual('Staff');
          expect(listDiv[1].innerText.trim()).toEqual('StaffExt');
          var remove = assigned.find('div > a')
          expect(remove.length).toEqual(2);
          expect(remove.attr('data-id')).toEqual('101');
          var unassigned = right.find('ul > li');
          expect(unassigned.length).toEqual(1);
          var span = unassigned.find('a > span')
          expect(span.length).toEqual(1);
          expect(span.text()).toEqual('Support');
          var selection = unassigned.find('a')
          expect(selection.length).toEqual(1);
          expect(selection.attr('data-id')).toEqual('102');
          var removeMessage = left.find('.conws-roles-edit-canedit-empty');
          expect(removeMessage.length).toEqual(0);

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(buttons.find('button').length).toEqual(3);

          var save = buttons.find('.conws-roles-edit-button-save');
          expect(save.length).toEqual(1);
          expect(save.text()).toEqual('Save');
          expect(save.attr('disabled')).toBeDefined();
          var reset = buttons.find('.conws-roles-edit-button-reset');
          expect(reset.length).toEqual(1);
          expect(reset.text()).toEqual('Reset');
          view.assignedRolesListRegion.currentView.itemRemove({
            currentTarget: remove[0], preventDefault: function () {
            }, stopPropagation: function () {
            }
          });
          view.saveClicked();
        });

        TestUtil.waitFor(done, function () {
          var deleted = (TestManager.deleteUrlCount === 1);
          var added = (TestManager.addUrlCount === 0);
          var changed = (savedCalls === 1);
          return (deleted && added && changed);
        },'deleted added and changed', 1000);
      });

      it('a member with two assigned roles and one role is removed and in addition the other' +
         ' role is added.',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'Support'}, leader: false, actions: {}},
              {props: {id: 103, name: 'StaffExt'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
            TestManager.addMembers('StaffExt', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [participants.fetch()], 100);
            TestUtil.run(done,function () {
              expect(participants.length).toEqual(2);
              view = new RolesEditView({
                model: participants.at(0),
                participantCollection: participants,
                roleCollection: roles
              });
              view.render();

              savedCalls = 0;
              view.listenTo(participants, 'saved', function () {
                savedCalls++;
              });
              var div = view.$('.binf-modal-content');
              expect(div.length).toEqual(1);
              var header = view.$('.binf-modal-header');
              expect(header.length).toEqual(1);
              var headerText = header.find('h2');
              expect(headerText.length).toEqual(1);
              expect(headerText.text()).toEqual('Roles for user Bud Spencer');

              var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
              expect(body.length).toEqual(1);

              var left = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
              expect(left.length).toEqual(1);
              var right = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
              expect(right.length).toEqual(1);
              var assigned = left.find('ul > li');
              expect(assigned.length).toEqual(2);
              var listDiv = assigned.find('div > div')
              expect(listDiv.length).toEqual(2);
              expect(listDiv[0].innerText.trim()).toEqual('Staff');
              expect(listDiv[1].innerText.trim()).toEqual('StaffExt');
              var remove = assigned.find('div > a')
              expect(remove.length).toEqual(2);
              expect(remove.attr('data-id')).toEqual('101');
              var unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(1);
              var span = unassigned.find('a > span')
              expect(span.length).toEqual(1);
              expect(span.text()).toEqual('Support');
              var selection = unassigned.find('a')
              expect(selection.length).toEqual(1);
              expect(selection.attr('data-id')).toEqual('102');
              var removeMessage = left.find('.conws-roles-edit-canedit-empty');
              expect(removeMessage.length).toEqual(0);

              var buttons = view.$('.conws-roles-edit-buttons');
              expect(buttons.length).toEqual(1);
              expect(buttons.find('button').length).toEqual(3);

              var save = buttons.find('.conws-roles-edit-button-save');
              expect(save.length).toEqual(1);
              expect(save.text()).toEqual('Save');
              expect(save.attr('disabled')).toBeDefined();
              var reset = buttons.find('.conws-roles-edit-button-reset');
              expect(reset.length).toEqual(1);
              expect(reset.text()).toEqual('Reset');
              view.assignedRolesListRegion.currentView.itemRemove({
                currentTarget: remove[0], preventDefault: function () {
                }, stopPropagation: function () {
                }
              });
              view.availableRolesListRegion.currentView.itemSelect({
                currentTarget: selection[0], preventDefault: function () {
                }, stopPropagation: function () {
                }
              });
              view.saveClicked();
            });

            TestUtil.waitFor(done,function () {
              var deleted = (TestManager.deleteUrlCount === 1);
              var added = (TestManager.addUrlCount === 1);
              var changed = (savedCalls === 1);
              return (deleted && added && changed);
            }, 'deleted, added and changed', 1000);

          });

      it('a member with two assigned roles and one role is removed but there was already a' +
          ' role added on the server side.',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'Support'}, leader: false, actions: {}},
              {props: {id: 103, name: 'StaffExt'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
            TestManager.addMembers('StaffExt', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [participants.fetch()], 100);
            TestUtil.run(done,function (done) {
              expect(participants.length).toEqual(2);
              view = new RolesEditView({
                model: participants.at(0),
                participantCollection: participants,
                roleCollection: roles
              });
              view.render();

              savedCalls = 0;
              view.listenTo(participants, 'saved', function () {
                savedCalls++;
              });
              var div = view.$('.binf-modal-content');
              expect(div.length).toEqual(1);
              var header = view.$('.binf-modal-header');
              expect(header.length).toEqual(1);
              var headerText = header.find('h2');
              expect(headerText.length).toEqual(1);
              expect(headerText.text()).toEqual('Roles for user Bud Spencer');

              var body = view.$('.binf-modal-body .conws-roles-edit-canedit');
              expect(body.length).toEqual(1);

              var left = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-left');
              expect(left.length).toEqual(1);
              var right = view.$(
                  '.binf-modal-body .conws-roles-edit-canedit .conws-roles-edit-canedit-right');
              expect(right.length).toEqual(1);
              var assigned = left.find('ul > li');
              expect(assigned.length).toEqual(2);
              var listDiv = assigned.find('div > div')
              expect(listDiv.length).toEqual(2);
              expect(listDiv[0].innerText.trim()).toEqual('Staff');
              expect(listDiv[1].innerText.trim()).toEqual('StaffExt');
              var remove = assigned.find('div > a')
              expect(remove.length).toEqual(2);
              expect(remove.attr('data-id')).toEqual('101');
              var unassigned = right.find('ul > li');
              expect(unassigned.length).toEqual(1);
              var span = unassigned.find('a > span')
              expect(span.length).toEqual(1);
              expect(span.text()).toEqual('Support');
              var selection = unassigned.find('a')
              expect(selection.length).toEqual(1);
              expect(selection.attr('data-id')).toEqual('102');
              var removeMessage = left.find('.conws-roles-edit-canedit-empty');
              expect(removeMessage.length).toEqual(0);

              var buttons = view.$('.conws-roles-edit-buttons');
              expect(buttons.length).toEqual(1);
              expect(buttons.find('button').length).toEqual(3);

              var save = buttons.find('.conws-roles-edit-button-save');
              expect(save.length).toEqual(1);
              expect(save.text()).toEqual('Save');
              expect(save.attr('disabled')).toBeDefined();
              var reset = buttons.find('.conws-roles-edit-button-reset');
              expect(reset.length).toEqual(1);
              expect(reset.text()).toEqual('Reset');
              view.assignedRolesListRegion.currentView.itemRemove({
                currentTarget: remove[0], preventDefault: function () {
                }, stopPropagation: function () {
                }
              });
              view.availableRolesListRegion.currentView.itemSelect({
                currentTarget: selection[0], preventDefault: function () {
                }, stopPropagation: function () {
                }
              });
              TestManager.addMembers('Support', ['bspencer', 'lfunes']);
              TestUtil.justWait(done,"justWait 1000",1000);
              TestUtil.run(done,function () {
                view.saveClicked();
              });
              TestUtil.waitFor(done,function () {
                var ErrorDialogTitle = document.getElementsByClassName('binf-modal-header error-header');
                return (ErrorDialogTitle.length === 1 );
              }, 'errorDialogTitle', 5000);
              TestUtil.run(done,function () {
                var dialog = $.find('.csui-alert .binf-modal-dialog');
                expect($(dialog).find('.title-text').text()).toEqual(
                    "Cannot save roles for user Bud Spencer.");
                expect($(dialog).find('.binf-modal-body').text()).toEqual(
                    "Roles for this user have been changed by someone else.");
                expect(TestManager.deleteUrlCount === 0).toBe(true);
                expect(savedCalls === 0).toBe(true);
                expect(TestManager.addUrlCount === 0).toBe(true);
                $(dialog).remove();
              });
            });
          });
    });

    describe('participantsedit1 view can be navigated with keyboard', function () {

      var view;
      var collection;
      beforeEach(function () {
        collection = TestManager.context.getCollection(ParticipantsCollectionFactory);
      });

      it('with TAB and a member with just one role assigend and no available role.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff', leader: true}, actions: {"edit-role": {body: ''}}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          view.on('dom:refresh', function () {
            view.attached_view = true;
          })
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();



          TestUtil.waitFor(done,function () {
            return view.attached_view && view.$(':tabbable').length > 2;
          }, 'attached view and tabbable length > 2', 10000);

          TestUtil.run(done,function () {
            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(3);
            expect(elems[0].innerText.trim()).toEqual("Staff");
            expect(elems[1].innerText.trim()).toEqual("Reset");
            expect(elems[2].innerText.trim()).toEqual("Cancel");
            expect(view.$('.conws-roles-remove-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-reset').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-cancel').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-save').prop('tabindex')).toEqual(-1);

          });
        });
      });

      it('with TAB and more than 15 assigned roles and more than 15 available roles', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'StaffA', leader: true}, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'StaffB', leader: true}, actions: {}},
          {props: {id: 103, name: 'StaffC', leader: true}, actions: {}},
          {props: {id: 104, name: 'StaffD', leader: true}, actions: {}},
          {props: {id: 105, name: 'StaffE', leader: true}, actions: {}},
          {props: {id: 106, name: 'StaffF', leader: true}, actions: {}},
          {props: {id: 107, name: 'StaffG', leader: true}, actions: {}},
          {props: {id: 108, name: 'StaffH', leader: true}, actions: {}},
          {props: {id: 109, name: 'StaffI', leader: true}, actions: {}},
          {props: {id: 110, name: 'StaffJ', leader: true}, actions: {}},
          {props: {id: 111, name: 'StaffK', leader: true}, actions: {}},
          {props: {id: 112, name: 'StaffL', leader: true}, actions: {}},
          {props: {id: 113, name: 'StaffM', leader: true}, actions: {}},
          {props: {id: 114, name: 'StaffN', leader: true}, actions: {}},
          {props: {id: 115, name: 'StaffO', leader: true}, actions: {}},
          {props: {id: 116, name: 'StaffP', leader: true}, actions: {}},
          {props: {id: 117, name: 'Staff1', leader: true}, actions: {}},
          {props: {id: 118, name: 'Staff11', leader: true}, actions: {}},
          {props: {id: 119, name: 'Staff12', leader: true}, actions: {}},
          {props: {id: 120, name: 'Staff13', leader: true}, actions: {}},
          {props: {id: 121, name: 'Staff14', leader: true}, actions: {}},
          {props: {id: 122, name: 'Staff15', leader: true}, actions: {}},
          {props: {id: 123, name: 'Staff16', leader: true}, actions: {}},
          {props: {id: 124, name: 'Staff17', leader: true}, actions: {}},
          {props: {id: 125, name: 'Staff18', leader: true}, actions: {}},
          {props: {id: 126, name: 'Staff19', leader: true}, actions: {}},
          {props: {id: 127, name: 'Staff20', leader: true}, actions: {}},
          {props: {id: 128, name: 'Staff21', leader: true}, actions: {}},
          {props: {id: 129, name: 'Staff22', leader: true}, actions: {}},
          {props: {id: 130, name: 'Staff23', leader: true}, actions: {}},
          {props: {id: 131, name: 'Staff24', leader: true}, actions: {}},
          {props: {id: 132, name: 'Staff25', leader: true}, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('StaffA', ['bspencer']);
        TestManager.addMembers('StaffB', ['bspencer']);
        TestManager.addMembers('StaffC', ['bspencer']);
        TestManager.addMembers('StaffD', ['bspencer']);
        TestManager.addMembers('StaffE', ['bspencer']);
        TestManager.addMembers('StaffF', ['bspencer']);
        TestManager.addMembers('StaffG', ['bspencer']);
        TestManager.addMembers('StaffH', ['bspencer']);
        TestManager.addMembers('StaffI', ['bspencer']);
        TestManager.addMembers('StaffJ', ['bspencer']);
        TestManager.addMembers('StaffK', ['bspencer']);
        TestManager.addMembers('StaffL', ['bspencer']);
        TestManager.addMembers('StaffM', ['bspencer']);
        TestManager.addMembers('StaffN', ['bspencer']);
        TestManager.addMembers('StaffO', ['bspencer']);
        TestManager.addMembers('StaffP', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();

          view.on('dom:refresh', function () {
            view.attached_view = true;
          })
          var assignedRoles = view.$('li.conws-roles-remove-item');
          expect(assignedRoles.length).toEqual(16);
          var availableRoles = view.$('li.conws-roles-edit-item');
          expect(availableRoles.length).toEqual(16);

          TestUtil.waitFor(done,function () {
            return view.attached_view;
          }, 'attached_view', 1000);

          TestUtil.run(done,function () {
            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(6);
            expect(elems[0].innerText.trim()).toEqual("");
            expect(elems[1].innerText.trim()).toEqual("StaffA");
            expect(elems[2].innerText.trim()).toEqual("");
            expect(elems[3].innerText.trim()).toEqual("Staff1");
            expect(elems[4].innerText.trim()).toEqual("Reset");
            expect(elems[5].innerText.trim()).toEqual("Cancel");
            expect(view.$('.icon-search').prop('tabindex')).toEqual(0)
            expect(view.$('.conws-roles-remove-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-reset').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-cancel').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-save').prop('tabindex')).toEqual(-1);
          });
        });
      });

      it('with TAB and more than 15 assigned roles and filter', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'StaffA', leader: true}, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'StaffB', leader: true}, actions: {}},
          {props: {id: 103, name: 'StaffC', leader: true}, actions: {}},
          {props: {id: 104, name: 'StaffD', leader: true}, actions: {}},
          {props: {id: 105, name: 'StaffE', leader: true}, actions: {}},
          {props: {id: 106, name: 'StaffF', leader: true}, actions: {}},
          {props: {id: 107, name: 'StaffG', leader: true}, actions: {}},
          {props: {id: 108, name: 'StaffH', leader: true}, actions: {}},
          {props: {id: 109, name: 'StaffI', leader: true}, actions: {}},
          {props: {id: 110, name: 'StaffJ', leader: true}, actions: {}},
          {props: {id: 111, name: 'StaffK', leader: true}, actions: {}},
          {props: {id: 112, name: 'StaffL', leader: true}, actions: {}},
          {props: {id: 113, name: 'StaffM', leader: true}, actions: {}},
          {props: {id: 114, name: 'StaffN', leader: true}, actions: {}},
          {props: {id: 115, name: 'StaffO', leader: true}, actions: {}},
          {props: {id: 116, name: 'StaffP', leader: true}, actions: {}},
          {props: {id: 117, name: 'StaffR', leader: true}, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('StaffA', ['bspencer']);
        TestManager.addMembers('StaffB', ['bspencer']);
        TestManager.addMembers('StaffC', ['bspencer']);
        TestManager.addMembers('StaffD', ['bspencer']);
        TestManager.addMembers('StaffE', ['bspencer']);
        TestManager.addMembers('StaffF', ['bspencer']);
        TestManager.addMembers('StaffG', ['bspencer']);
        TestManager.addMembers('StaffH', ['bspencer']);
        TestManager.addMembers('StaffI', ['bspencer']);
        TestManager.addMembers('StaffJ', ['bspencer']);
        TestManager.addMembers('StaffK', ['bspencer']);
        TestManager.addMembers('StaffL', ['bspencer']);
        TestManager.addMembers('StaffM', ['bspencer']);
        TestManager.addMembers('StaffN', ['bspencer']);
        TestManager.addMembers('StaffO', ['bspencer']);
        TestManager.addMembers('StaffP', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();

          view.on('dom:refresh', function () {
            view.attached_view = true;
          })
          var assignedRoles = view.$('li.conws-roles-remove-item');
          expect(assignedRoles.length).toEqual(16);
          var availableRoles = view.$('li.conws-roles-edit-item');
          expect(availableRoles.length).toEqual(1);

          TestUtil.waitFor(done,function () {
            return view.attached_view;
          }, 'attached_view', 1000);

          TestUtil.run(done,function () {
            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(5);
            expect(elems[0].innerText.trim()).toEqual("");
            expect(elems[1].innerText.trim()).toEqual("StaffA");
            expect(elems[2].innerText.trim()).toEqual("StaffR");
            expect(elems[3].innerText.trim()).toEqual("Reset");
            expect(elems[4].innerText.trim()).toEqual("Cancel");
            expect(view.$('.icon-search').prop('tabindex')).toEqual(0)
            expect(view.$('.conws-roles-remove-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-reset').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-cancel').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-save').prop('tabindex')).toEqual(-1);
          });
        });
      });

      it('with TAB and CLICK an assigned role is removed',
          function (done) {
            TestManager.createRolesWithActions([
              {props: {id: 101, name: 'Staff'}, leader: true, actions: {"edit-role": {body: ''}}},
              {props: {id: 102, name: 'Support'}, leader: false, actions: {}},
              {props: {id: 103, name: 'StaffExt'}, leader: false, actions: {}}
            ]);

            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
            TestManager.addMembers('StaffExt', ['bspencer', 'lfunes']);
            TestManager.waitAsync(done, [collection.fetch()], 100);
            TestUtil.run(done,function (done) {
              expect(collection.length).toEqual(2);
              view = new RolesEditView({
                model: collection.at(0),
                participantCollection: undefined,
                roleCollection: undefined
              });

              view.on('dom:refresh', function () {
                view.attached_view = true;
              })
              var editor = new ModalDialogView({
                body: view,
                modalClassName: 'conws-roles-edit'
              });

              editor.show();

              TestUtil.waitFor(done,function () {
                return view.attached_view;
              }, 'attached_view', 1000);

              TestUtil.run(done,function () {
                var elems = view.$(':tabbable');
                expect(elems.length).toEqual(4);
                expect(elems[0].innerText.trim()).toEqual("Staff");
                expect(elems[1].innerText.trim()).toEqual("Support");
                expect(elems[2].innerText.trim()).toEqual("Reset");
                expect(elems[3].innerText.trim()).toEqual("Cancel");
                expect(view.$('.conws-roles-edit-item').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-remove-item').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-button-reset').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-button-cancel').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-button-save').prop('tabindex')).toEqual(-1);
                elems[0].focus();
              });
              TestUtil.waitFor(done,function () {
                return view.$(document.activeElement).text().trim() === 'Staff';
              }, 'Failed to focus \'Staff\'', 100);

              TestUtil.run(done,function () {
                view.$(document.activeElement).trigger($.Event('keydown',
                    {keyCode: 13, which: 13}));
              });

              TestUtil.run(done,function () {
                var elems = view.$(':tabbable');
                expect(elems.length).toEqual(5);
                expect(elems[0].innerText.trim()).toEqual("StaffExt");
                expect(elems[1].innerText.trim()).toEqual("Staff");
                expect(elems[2].innerText.trim()).toEqual("Reset");
                expect(elems[3].innerText.trim()).toEqual("Save");
                expect(elems[4].innerText.trim()).toEqual("Cancel");
                expect(view.$('.conws-roles-remove-item').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-item').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-button-reset').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-button-save').prop('tabindex')).toEqual(0);
                expect(view.$('.conws-roles-edit-button-cancel').prop('tabindex')).toEqual(0);
              });
            });
          });

      it('with DOWN / UP in assigned list', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Service'}, leader: true, actions: {"edit-role": {body: ''}}},
          {props: {id: 102, name: 'Staff'}, leader: false, actions: {}},
          {props: {id: 103, name: 'Support'}, leader: false, actions: {}},
          {props: {id: 104, name: 'Account Manager'}, leader: false, actions: {}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Service', ['bspencer', 'lfunes']);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.addMembers('Support', ['bspencer', 'lfunes']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();

          view.on('dom:refresh', function () {
            view.attached_view = true;
          })

          TestUtil.waitFor(done,function () {
            return view.attached_view;
          }, 'attached_view', 1000);

          TestUtil.run(done,function () {
            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(4);
            expect(elems[0].innerText.trim()).toEqual("Service");
            expect(elems[1].innerText.trim()).toEqual("Account Manager");
            expect(elems[2].innerText.trim()).toEqual("Reset");
            expect(elems[3].innerText.trim()).toEqual("Cancel");
            expect(view.$('.conws-roles-edit-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-remove-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-reset').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-cancel').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button-save').prop('tabindex')).toEqual(-1);
            elems[0].focus();
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Service';
          }, 'Failed to focus \'Service\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Staff';
          }, 'Failed to focus \'Staff\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Support';
          }, 'Failed to focus \'Support\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Support';
          }, 'Failed to focus \'Support\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 38, which: 38}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Staff';
          }, 'Failed to focus \'Staff\'', 100);
        });
      });


    });
  });
  describe('ParticipantsEdit readonly', function () {

    var id;

    beforeEach(function () {
      TestManager.reset();
      TestManager.init(id);
      TestManager.prepare(id);
    });

    describe('view creation', function () {

      id = 4711;

      it('succeeds without configuration', function () {

        var view = new RolesEditView({model: undefined, parent: undefined});
        expect(TestManager.context).toBeDefined();
        expect(view.options).toBeDefined();
        expect(view.context).toBeUndefined();
        expect(view.model).toBeUndefined();

      });
    });

    describe('view renders', function () {

      var view;
      var collection;
      beforeEach(function () {

        collection = TestManager.context.getCollection(ParticipantsCollectionFactory);
      });

      it('a team with just one role and one member.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(1);
          view = new RolesEditView({model: collection.at(0), parent: undefined});
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = view.$('h2', header);
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for user Bud Spencer');

          var body = view.$('.binf-modal-body .conws-roles-edit-readonly');
          expect(body.length).toEqual(1);
          expect(view.$('ul > li', body).length).toEqual(1);
          expect(view.$('ul > li', body).text()).toEqual('Staff');

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(view.$('button', buttons).length).toEqual(1);
        });
      });

      it('a team with two roles, one with one member and one with two members.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.addMembers('Support', ['lfunes']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({model: collection.at(1), parent: undefined});
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1);
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1);
          var headerText = view.$('h2', header);
          expect(headerText.length).toEqual(1);
          expect(headerText.text()).toEqual('Roles for user Louis De Funes');

          var body = view.$('.binf-modal-body .conws-roles-edit-readonly');
          expect(body.length).toEqual(1);
          expect(view.$('ul > li', body).length).toEqual(2);
          expect(view.$('ul > li:first', body).text()).toEqual('Staff');
          expect(view.$('ul > li:last', body).text()).toEqual('Support');

          var buttons = view.$('.conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1);
          expect(view.$('button', buttons).length).toEqual(1);
        });
      });
    });

    describe('participantsedit2 view can be navigated with keyboard', function () {

      var view;
      var collection;
      beforeEach(function () {

        collection = TestManager.context.getCollection(ParticipantsCollectionFactory);
      });

      it('with TAB and just one role in the readonly list.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();

          view.on('dom:refresh', function () {
            view.attached_view = true;
          })

          TestUtil.waitFor(done,function () {
            return view.attached_view;
          }, 'attached_view', 1000);

          TestUtil.run(done,function () {
            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(2);
            expect(elems[0].innerText.trim()).toEqual("Staff");
            expect(elems[1].innerText.trim()).toEqual("Close");
            expect(view.$('.conws-roles-readonly-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button').prop('tabindex')).toEqual(0);
          });
        });
      });

      it('with TAB and two roles in the readonly list.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.addMembers('Support', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();

          view.on('dom:refresh', function () {
            view.attached_view = true;
          })

          TestUtil.waitFor(done,function () {
            return view.attached_view;
          }, 'attached_view', 1000);

          TestUtil.run(done,function () {
            var roles = view.$('li');
            expect(roles.length).toEqual(2);
            expect(roles[0].innerText.trim()).toEqual("Staff");
            expect(roles[1].innerText.trim()).toEqual("Support");

            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(2);
            expect(elems[0].innerText.trim()).toEqual("Staff");
            expect(elems[1].innerText.trim()).toEqual("Close");
            expect(view.$('.conws-roles-readonly-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button').prop('tabindex')).toEqual(0);
          });
        });
      });

      it('with DOWN / UP in readonly role list', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.addMembers('Support', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(2);
          view = new RolesEditView({
            model: collection.at(0),
            participantCollection: undefined,
            roleCollection: undefined
          });
          var editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-roles-edit'
          });

          editor.show();

          view.on('dom:refresh', function () {
            view.attached_view = true;
          })

          TestUtil.waitFor(done,function () {
            return view.attached_view;
          }, 'attached_view', 1000);

          TestUtil.run(done,function () {
            var roles = view.$('li');
            expect(roles.length).toEqual(2);
            expect(roles[0].innerText.trim()).toEqual("Staff");
            expect(roles[1].innerText.trim()).toEqual("Support");

            var elems = view.$(':tabbable');
            expect(elems.length).toEqual(2);
            expect(elems[0].innerText.trim()).toEqual("Staff");
            expect(elems[1].innerText.trim()).toEqual("Close");
            expect(view.$('.conws-roles-readonly-item').prop('tabindex')).toEqual(0);
            expect(view.$('.conws-roles-edit-button').prop('tabindex')).toEqual(0);

            view.$(elems[0]).trigger('focus');
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Staff';
          }, 'Failed to focus \'Staff\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Support';
          }, 'Failed to focus \'Support\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Support';
          }, 'Failed to focus \'Support\'', 100);

          TestUtil.run(done,function () {
            view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 38, which: 38}));
          });
          TestUtil.waitFor(done,function () {
            return view.$(document.activeElement).text().trim() === 'Staff';
          }, 'Failed to focus \'Staff\'', 100);
        });
      });
    });

    describe('ending test suite', function () {
      it('wait some time for mocks to be satisfied', function (done) {
        TestUtil.run(done,function() {
          TestUtil.justWait(done,"justWait 1000",1000);
        });
      });
    });

  });
});

