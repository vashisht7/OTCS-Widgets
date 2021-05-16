/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/roles.model.factory',
  'conws/widgets/team/impl/controls/avatar/avatar.view',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js'
], function (PageContext, ParticipantsCollectionFactory, AvatarView, TestUtil, TestManager) {
  describe('Avatar control', function () {

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

        var view = new AvatarView({model: undefined});
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

      it('a user with no icon.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff', leader: true}, actions: {"edit-role": {body: ''}}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(1);
          view = new AvatarView({model: collection.at(0).members.at(0)});
          view.render();
          var div = view.$('.participant-picture');
          expect(div.length).toEqual(1);

          var img = view.$('.participant-picture>img');
          expect(img.length).toEqual(0);

          var span = view.$('.conws-avatar-user-placeholder');
          expect(span.length).toEqual(1);
        });
      });

      it('a group.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff', leader: true}, actions: {"edit-role": {body: ''}}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 1, name: 'famousActors', display_name: 'famousActors'}
        ]);
        TestManager.addMembers('Staff', ['famousActors']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(1);
          view = new AvatarView({model: collection.at(0).members.at(0)});
          view.render();
          var div = view.$('.participant-picture');
          expect(div.length).toEqual(1);

          var img = view.$('.participant-picture>img');
          expect(img.length).toEqual(0);

          var span = view.$('.conws-avatar-group-placeholder');
          expect(span.length).toEqual(1);
        });
      });

      it('a role.', function (done) {
        TestManager.createRolesWithActions([
          {props: {id: 101, name: 'Staff', leader: true}, actions: {"edit-role": {body: ''}}}
        ]);

        TestManager.createMembers([
          {id: 1, type: 1, name: 'famousActors', display_name: 'famousActors'}
        ]);
        TestManager.addMembers('Staff', ['famousActors']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(collection.length).toEqual(1);
          view = new AvatarView({model: collection.at(0)});
          view.render();
          var div = view.$('.participant-picture');
          expect(div.length).toEqual(1);

          var img = view.$('.participant-picture>img');
          expect(img.length).toEqual(0);

          var span = view.$('.conws-avatar-role-placeholder');
          expect(span.length).toEqual(1);
        });
      });
    });
  });
});

