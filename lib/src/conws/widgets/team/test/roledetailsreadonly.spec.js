/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/widgets/team/impl/dialogs/role/role.details.view',
  'conws/widgets/team/impl/roles.model.factory',
  'esoc/widgets/userwidget/userwidget',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js',
  'csui/utils/log'
], function ($, PageContext, TeamCollectionFactory, ModalDialogView, RoleDetailsView,
    RolesCollectionFactory, UserWidget, TestUtil, TestManager, log) {
  describe('RoleDetails readonly', function () {

    var id;

    beforeEach(function () {
      TestManager.reset();
      TestManager.init(id);
      TestManager.prepare(id);

      var user = {display_Name: ""};
      spyOn(UserWidget,
          'getUser').and.callFake(
          function () {return {then: function (callback) {return callback(user);}}});
    });

    describe('view creation', function () {

      id = 4711;

      it('succeeds without configuration', function () {

        var view = new RoleDetailsView({model: undefined, parent: undefined});
        expect(TestManager.context).toBeDefined("Testanager.context defined");
        expect(view.options).toBeDefined("view.options defined");
        expect(view.context).toBeUndefined("view.context defined");
        expect(view.model).toBeUndefined("view.model defined");

      });
    });

    describe('view renders', function () {

      var view;
      var collection;
      beforeEach(function () {

        collection = TestManager.context.getCollection(RolesCollectionFactory);
      });

      it('a team with just one role and no member.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', description: 'Staff description', leader: true}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1,"collection length");
          view = new RoleDetailsView({
            model: collection.at(0),
            parent: undefined,
            context: TestManager.context,
            collection: collection
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1,"div.length");
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1,"header.length");
          var headerText = view.$('h2', header);
          expect(headerText.length).toEqual(1,"headerText.length");
          expect(headerText.text()).toEqual('Role details',"headerText.text");
          var roleName = view.$('.binf-modal-body .conws-role-details-rolename-text > div');
          expect(roleName.length).toEqual(1,"roleName.length");
          expect(roleName.text()).toEqual('Staff',"roleName.text");

          var roleDescription = view.$(
              '.binf-modal-body .conws-role-details-roledescription-text > div');
          expect(roleDescription.length).toEqual(1,"roleDescription.length");
          expect(roleDescription.text()).toEqual('Staff description',"roleDescription.text");
          var leader = view.$('.binf-modal-body .conws-role-details-teamlead-switch');
          expect(leader.length).toEqual(1,"header.length");
          var leaderOn = view.$(
              '.binf-modal-body .conws-role-details-teamlead-switch .binf-switch-on');
          expect(leaderOn.length).toEqual(0,"leaderOn.length");
          var leaderOff = view.$(
              '.binf-modal-body .conws-role-details-teamlead-switch .binf-switch-off');
          expect(leaderOff.length).toEqual(1,"leaderOff.length");
          var membersList = view.$('.conws-role-details-members-list');
          expect(membersList.length).toEqual(1,"membersList.length");

          var members = view.$('.conws-role-details-members-list li');
          expect(members.length).toEqual(0,"members.length");
          var buttons = view.$('.conws-role-details-buttons-region .conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1,"buttons.length");
          expect(view.$('button', buttons).length).toEqual(1,"view buttons length");
        });
      });

      it('a team with just one role and one member.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', description: 'Staff description', leader: true}
        ]);

        TestManager.createMembers([
          {
            id: 41158,
            type: 0,
            name: 'bspencer',
            first_name: 'Bud',
            last_name: 'Spencer',
            display_name: 'Bud Spencer'
          }
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1,"collection.length");
          view = new RoleDetailsView({
            model: collection.at(0),
            parent: undefined,
            context: TestManager.context
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1,"div.length");
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1,"header.length");
          var headerText = view.$('h2', header);
          expect(headerText.length).toEqual(1,"headerText.length");
          expect(headerText.text()).toEqual('Role details',"headerText.text");
          var roleName = view.$('.binf-modal-body .conws-role-details-rolename-text > div');
          expect(roleName.length).toEqual(1,"roleName.length");
          expect(roleName.text()).toEqual('Staff',"roleName.text");

          var roleDescription = view.$(
              '.binf-modal-body .conws-role-details-roledescription-text > div');
          expect(roleDescription.length).toEqual(1,"roleDescription.length");
          expect(roleDescription.text()).toEqual('Staff description',"roleDescription.text");
          var leader = view.$('.binf-modal-body .conws-role-details-teamlead-switch');
          expect(leader.length).toEqual(1,"leader.length");
          var leaderOn = view.$(
              '.binf-modal-body .conws-role-details-teamlead-switch .binf-switch-on');
          expect(leaderOn.length).toEqual(0,"leaderOn.length");
          var leaderOff = view.$(
              '.binf-modal-body .conws-role-details-teamlead-switch .binf-switch-off');
          expect(leaderOff.length).toEqual(1,"leaderOff.length");
          var membersList = view.$('.conws-role-details-members-list');
          expect(membersList.length).toEqual(1,"membersList.length");

          var members = view.$('.conws-role-details-members-list li');
          expect(members.length).toEqual(1,"members.length");

          var member = view.$('.conws-role-details-members-list .member-details .member-name');
          expect(member.length).toEqual(1,"member.length");
          expect(member.attr('title').match('Bud Spencer')).toBeTruthy("member.attr title");
          var buttons = view.$('.conws-role-details-buttons-region .conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1,"buttons.length");
          expect(view.$('button', buttons).length).toEqual(1,"view buttons length");
        });
      });

      it('a team with one role and two members.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', description: 'Staff description', leader: false}
        ]);

        TestManager.createMembers([
          {
            id: 41158,
            type: 0,
            name: 'bspencer',
            first_name: 'Bud',
            last_name: 'Spencer',
            display_name: 'Bud Spencer'
          },
          {
            id: 39730,
            type: 0,
            name: 'lfunes',
            first_name: 'Louis',
            last_name: 'De Funes',
            display_name: 'Louis De Funes'
          }
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.waitAsync(done,[collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1,"collection.length");
          view = new RoleDetailsView({
            model: collection.at(0),
            parent: undefined,
            context: TestManager.context
          });
          view.render();
          var div = view.$('.binf-modal-content');
          expect(div.length).toEqual(1,"div.length");
          var header = view.$('.binf-modal-header');
          expect(header.length).toEqual(1,"header.length");
          var headerText = view.$('h2', header);
          expect(headerText.length).toEqual(1,"headerText.length");
          expect(headerText.text()).toEqual('Role details',"headerText.text");
          var roleName = view.$('.binf-modal-body .conws-role-details-rolename-text > div');
          expect(roleName.length).toEqual(1,"roleName.length");
          expect(roleName.text()).toEqual('Staff',"roleName.text");

          var roleDescription = view.$(
              '.binf-modal-body .conws-role-details-roledescription-text > div');
          expect(roleDescription.length).toEqual(1,"roleDescription.length");
          expect(roleDescription.text()).toEqual('Staff description',"roleDescription.text");
          var leader = view.$('.binf-modal-body .conws-role-details-teamlead-switch');
          expect(leader.length).toEqual(1,"leader.length");
          var leaderOn = view.$(
              '.binf-modal-body .conws-role-details-teamlead-switch .binf-switch-on');
          expect(leaderOn.length).toEqual(1,"leaderOn.length");
          var leaderOff = view.$(
              '.binf-modal-body .conws-role-details-teamlead-switch .binf-switch-off');
          expect(leaderOff.length).toEqual(0,"leaderOff.length");
          var membersList = view.$('.conws-role-details-members-list');
          expect(membersList.length).toEqual(1,"membersList.length");

          var members = view.$('.conws-role-details-members-list li');
          expect(members.length).toEqual(2,"members.length");

          var member = view.$('.conws-role-details-members-list .member-details .member-name');
          expect(member.length).toEqual(2,"member.length");
          expect(member.first().attr('title').match('Bud Spencer')).toBeTruthy("member.first.attr title");
          expect(member.last().attr('title').match('Louis De Funes')).toBeTruthy("member.last.attr title");
          var buttons = view.$('.conws-role-details-buttons-region .conws-roles-edit-buttons');
          expect(buttons.length).toEqual(1,"buttons.length");
          expect(view.$('button', buttons).length).toEqual(1,"view buttons length");
        });
      });
    });

    describe('roledetailsreadonly view can be navigated with keyboard', function () {

      var tries = 5;

      afterEach(function () {
        $('.cs-dialog.binf-modal').remove();
      });

	    it('(A) with TAB and less than 15 participants', function (done) {

        var tabbables;
        var stopwaiting;
        var count = 0;

        var view;
        var collection;
        var editor;

        function prepareTabbables(done, number) {

          TestUtil.run(done,function(done) {

            if (tabbables) {
              log.info("prepare tabbables (A), skip ",number,count) && console.log(log.last);
              return;
            }

            count = count + 1;
            log.info("prepare tabbables (A), try ",number,count) && console.log(log.last);

            collection = TestManager.context.getCollection(RolesCollectionFactory);
            TestManager.createRoles([
              {id: 101, name: 'Staff', description: 'Staff description', leader: false}
            ]);

            TestManager.createMembers([
              {
                id: 1,
                type: 1,
                name: 'Famous Actors',
                display_name: 'Famous Actors',
                name_formatted: 'Famous Actors'
              },
              {
                id: 2,
                type: 1,
                name: 'Super Heroes',
                display_name: 'Super Heroes',
                name_formatted: 'Super Heroes'
              },
              {
                id: 3,
                type: 1,
                name: 'Loosers',
                display_name: 'Loosers',
                name_formatted: 'Loosers'
              }
            ]);
            TestManager.addMembers('Staff', ['Famous Actors', 'Super Heroes', 'Loosers']);
            collection.fetch().done(function() {
              collection.testFetchDone = true;
            });
          });

          TestUtil.waitFor(done,function() {
            return tabbables || collection.testFetchDone;
          }, 'collection fetched', 300);
          TestUtil.run(done,function (done) {

            if (tabbables) {
              return;
            }
            expect(collection.length).toEqual(1,"collection.length");
            view = new RoleDetailsView({
              model: collection.at(0),
              parentCollection: undefined,
              context: TestManager.context
            });
            view.on('dom:refresh', function () {
              view._attachedToDom = true;
            });
            editor = new ModalDialogView({
              body: view,
              modalClassName: 'conws-role-details'
            });
            editor.show();
            var filter = view.$('.conws-filter-header .header-caption');
            expect(filter.length).toEqual(1,"filter.length");
            expect(filter.text()).toEqual('Participants',"filter.text");
            var members = view.$('li.conws-role-details-member');
            expect(members.length).toEqual(3,"members.length");
            var buttons = view.$('button.conws-roles-edit-button');
            expect(buttons.length).toEqual(1,"buttons.length");
          });

          TestUtil.waitFor(done,function () {
            return tabbables || view._attachedToDom;
          }, 'The view isn\'t attached to the DOM.', 1000);

          TestUtil.run(done,function(done) {
            if (tabbables) {
              return;
            }
            stopwaiting = false;
            var found;
            TestUtil.waitFor(done, function( ) {
              found = view.$(':tabbable');
              if (found.length>=2) {
                tabbables = found;
                return true;
              }
            },"tabbables to appear",2000).fail(function() {
              stopwaiting = true;
              log.info("tabbables (A) length only "+(found&&found.length)) && console.log(log.last);
            });
          });

          TestUtil.waitFor(done,function () {
            if (tabbables||stopwaiting) {
              return true;
            }
          }, 'tabbable elements to appear.', 2100);
        }
        for (var ii = 0; ii<tries; ii++) {
          prepareTabbables(done, ii+1);
        }

        TestUtil.run(done,function (done) {

          expect(tabbables).toBeDefined("tabbables didn't appear within "+count+" tries.");

          if (!tabbables) {
            return;
          }
          expect(tabbables.length).toEqual(3,"tabbables.length");
          var elem = view.$(tabbables[1]);
          expect(elem.hasClass('conws-role-details-member')).toBeTruthy("elem.hasClass conws-role-details-member");
          expect(elem.find('.member-name').text()).toEqual('Famous Actors',"elem with class member-name text");
          elem = view.$(tabbables[2]);
          expect(elem.hasClass('conws-roles-edit-button')).toBeTruthy("elem.hasClass conws-roles-edit-button");
          expect(elem.text()).toEqual('Close',"elem.text");
          elem = view.$(tabbables[1]).trigger('focus');
          expect(elem.find('.member-name').text()).toEqual('Famous Actors',"elem with class member-name text");
        });
		
      });

      it('(B) with TAB and more than 15 participants', function (done) {

        var tabbables;
        var stopwaiting;
        var count = 0;

        var view;
        var collection;
        var editor;

        function prepareTabbables(done, number) {

          TestUtil.run(done,function(done) {

            if (tabbables) {
              log.info("prepare tabbables (B), skip ",number,count) && console.log(log.last);
              return;
            }

            count = count + 1;
            log.info("prepare tabbables (B), try ",number,count) && console.log(log.last);

            collection = TestManager.context.getCollection(RolesCollectionFactory);
            TestManager.createRoles([
              {id: 101, name: 'Staff', description: 'Staff description', leader: false}
            ]);

            var i = 0;
            var members = [];
            for (i = 10; i < 30; i++) {
              members.push({
                id: i,
                type: 1,
                name: i.toString(),
                display_name: i.toString(),
                name_formatted: i.toString()
              });
            }
            TestManager.createMembers(members);
            members = [];
            for (i = 10; i < 30; i++) {
              members.push(i.toString());
            }
            TestManager.addMembers('Staff', members);
            collection.fetch().done(function() {
              collection.testFetchDone = true;
            });
          });

          TestUtil.waitFor(done,function() {
            return tabbables || collection.testFetchDone;
          }, 'collection fetched', 300);
          TestUtil.run(done,function (done) {

            if (tabbables) {
              return;
            }
            expect(collection.length).toEqual(1,"collection.length");
            view = new RoleDetailsView({
              model: collection.at(0),
              parentCollection: undefined,
              context: TestManager.context
            });
            view.on('dom:refresh', function () {
              view._attachedToDom = true;
            });
            editor = new ModalDialogView({
              body: view,
              modalClassName: 'conws-role-details'
            });
            editor.show();
            var filter = view.$('.conws-filter-header .header-caption');
            expect(filter.length).toEqual(1,"filter.length");
            expect(filter.text()).toEqual('Participants',"filter.text");
            var members = view.$('li.conws-role-details-member');
            expect(members.length).toEqual(20,"members.length");
            var buttons = view.$('button.conws-roles-edit-button');
            expect(buttons.length).toEqual(1,"buttons.length");
          });

          TestUtil.waitFor(done,function () {
            return tabbables || view._attachedToDom;
          }, 'The view isn\'t attached to the DOM.', 1000);

          TestUtil.run(done,function(done) {
            if (tabbables) {
              return;
            }
            stopwaiting = false;
            var found;
            TestUtil.waitFor(done, function() {
              found = view.$(':tabbable');
              if (found.length>=3) {
                tabbables = found;
                return true;
              }
            },"tabbables to appear",2000).fail(function() {
              stopwaiting = true;
              log.info("tabbables (B) length only "+(found&&found.length)) && console.log(log.last);
            });
          });

          TestUtil.waitFor(done,function () {
            if (tabbables||stopwaiting) {
              return true;
            }
          }, 'tabbable elements to appear.', 2100);
        }
        for (var ii = 0; ii<tries; ii++) {
          prepareTabbables(done, ii+1);
        }

        TestUtil.run(done,function (done) {

          expect(tabbables).toBeDefined("tabbables didn't appear within "+count+" tries.");

          if (!tabbables) {
            return;
          }
          expect(tabbables.length).toEqual(4,"tabbables.length");
          var elem = view.$(tabbables[1]);
          expect(elem.hasClass('icon-search')).toBeTruthy("elem.hasClass icon-search");
          expect(elem.attr('title')).toEqual('Participants',"elem.attr title");
          elem = view.$(tabbables[2]);
          expect(elem.hasClass('conws-role-details-member')).toBeTruthy("elem.hasClass conws-role-details-member");
          expect(elem.find('.member-name').text()).toEqual('10',"elem with class member-name text");
          elem = view.$(tabbables[3]);
          expect(elem.hasClass('conws-roles-edit-button')).toBeTruthy("elem.hasClass conws-roles-edit-button");
          expect(elem.text()).toEqual('Close',"elem.text");
        });
      });

      it('(C) with TAB and activated filter', function (done) {

        var tabbables;
        var stopwaiting;
        var count = 0;

        var view;
        var collection;
        var editor;

        function prepareTabbables(done, number) {

          TestUtil.run(done,function(done) {

            if (tabbables) {
              log.info("prepare tabbables (C), skip ",number,count) && console.log(log.last);
              return;
            }

            count = count + 1;
            log.info("prepare tabbables (C), try ",number,count) && console.log(log.last);

            collection = TestManager.context.getCollection(RolesCollectionFactory);
            TestManager.createRoles([
              {id: 101, name: 'Staff', description: 'Staff description', leader: false}
            ]);

            var i = 0;
            var members = [];
            for (i = 10; i < 30; i++) {
              members.push({
                id: i,
                type: 1,
                name: i.toString(),
                display_name: i.toString(),
                name_formatted: i.toString()
              });
            }
            TestManager.createMembers(members);
            members = [];
            for (i = 10; i < 30; i++) {
              members.push(i.toString());
            }
            TestManager.addMembers('Staff', members);
            collection.fetch().done(function() {
              collection.testFetchDone = true;
            });
          });

          TestUtil.waitFor(done,function() {
            return tabbables || collection.testFetchDone;
          }, 'collection fetched', 300);
          TestUtil.run(done,function (done) {

            if (tabbables) {
              return;
            }
            expect(collection.length).toEqual(1,"collection.length");
            view = new RoleDetailsView({
              model: collection.at(0),
              parentCollection: undefined,
              context: TestManager.context
            });
            view.on('dom:refresh', function () {
              view._attachedToDom = true;
            });
            editor = new ModalDialogView({
              body: view,
              modalClassName: 'conws-role-details'
            });
            editor.show();
            var filter = view.$('.conws-filter-header .header-caption');
            expect(filter.length).toEqual(1,"filter.length");
            expect(filter.text()).toEqual('Participants',"filter.text");
            var members = view.$('li.conws-role-details-member');
            expect(members.length).toEqual(20,"members.length");
            var buttons = view.$('button.conws-roles-edit-button');
            expect(buttons.length).toEqual(1,"buttons.length");
          });

          TestUtil.waitFor(done,function () {
            return tabbables || view._attachedToDom;
          }, 'The view isn\'t attached to the DOM.', 1000);

          TestUtil.run(done,function(done) {
            if (tabbables) {
              return;
            }
            stopwaiting = false;
            var found;
            TestUtil.waitFor(done, function() {
              found = view.$(':tabbable');
              if (found.length>=3) {
                tabbables = found;
                return true;
              }
            },"tabbables to appear",2000).fail(function() {
              stopwaiting = true;
              log.info("tabbables (C) length only "+(found&&found.length)) && console.log(log.last);
            });
          });

          TestUtil.waitFor(done, function () {
            if (tabbables||stopwaiting) {
              return true;
            }
          }, 'tabbable elements to appear.', 2100);
        }
        for (var ii = 0; ii<tries; ii++) {
          prepareTabbables(done, ii+1);
        }

        TestUtil.run(done,function (done) {

          expect(tabbables).toBeDefined("tabbables didn't appear within "+count+" tries.");

          if (!tabbables) {
            return;
          }
          expect(tabbables.length).toEqual(4,"tabbables.length");
          var elem = view.$(tabbables[1]);
          expect(elem.hasClass('icon-search')).toBeTruthy("elem.hasClass icon-search");
          expect(elem.attr('title')).toEqual('Participants',"elem.attr title");
          elem = view.$(tabbables[2]);
          expect(elem.hasClass('conws-role-details-member')).toBeTruthy("elem.hasClass conws-role-details-member");
          expect(elem.find('.member-name').text()).toEqual('10',"elem with class member-name text");
          elem = view.$(tabbables[3]);
          expect(elem.hasClass('conws-roles-edit-button')).toBeTruthy("elem.hasClass conws-roles-edit-button");
          expect(elem.text()).toEqual('Close',"elem.text");
          view.$(tabbables[1]).trigger('click');
        });
        TestUtil.waitFor(done,function () {
          return (view.$(':tabbable').length > 4);
        }, 'Failed to enable filer elements!', 500);

        TestUtil.run(done,function (done) {
          tabbables = view.$(':tabbable');
          expect(tabbables.length).toEqual(5,"tabbables.length");
          view.$('input.search').val('0');
          view.$('input.search').trigger($.Event('keyup', {keyCode: 48, which: 48}));

        });
        TestUtil.waitFor(done,function () {
          return (view.$(':tabbable').length > 5);
        }, 'Failed to enable filer elements!', 500);

        TestUtil.run(done,function (done) {
          tabbables = view.$(':tabbable');
          expect(tabbables.length).toEqual(6,"tabbables.length");
          var elem = view.$(tabbables[1]);
          expect(elem.hasClass('search')).toBeTruthy("elem.hasClass search");
          expect(elem.attr('title')).toEqual('Search participants',"elem.attr title");
          elem = view.$(tabbables[2]);
          expect(elem.hasClass('sbclearer')).toBeTruthy("elem.hasClass sbclearer");
          expect(elem.attr('title')).toEqual('Clear filter',"elem.attr title");
          elem = view.$(tabbables[3]);
          expect(elem.hasClass('icon-search')).toBeTruthy("elem.hasClass icon-search");
          expect(elem.attr('title')).toEqual('Participants',"elem.attr title");
          elem = view.$(tabbables[4]);
          expect(elem.hasClass('conws-role-details-member')).toBeTruthy("elem.hasClass conws-role-details-member");
          expect(elem.find('.member-name').text()).toEqual('10',"elem with class member-name text");
          elem = view.$(tabbables[5]);
          expect(elem.hasClass('conws-roles-edit-button')).toBeTruthy("elem.hasClass conws-roles-edit-button");
          expect(elem.text()).toEqual('Close',"elem.text");
        });
      });

      it('(D) with DOWN / UP in participants list', function (done) {

        var tabbables;
        var stopwaiting;
        var count = 0;

        var view;
        var collection;
        var editor;

        function prepareTabbables(done, number) {

          TestUtil.run(done,function(done) {

            if (tabbables) {
              log.info("prepare tabbables (D), skip ",number,count) && console.log(log.last);
              return;
            }

            count = count + 1;
            log.info("prepare tabbables (D), try ",number,count) && console.log(log.last);

            collection = TestManager.context.getCollection(RolesCollectionFactory);
            TestManager.createRoles([
              {id: 101, name: 'Staff', description: 'Staff description', leader: false}
            ]);

            TestManager.createMembers([
              {
                id: 1,
                type: 1,
                name: 'Famous Actors',
                display_name: 'Famous Actors',
                name_formatted: 'Famous Actors'
              },
              {
                id: 2,
                type: 1,
                name: 'Super Heroes',
                display_name: 'Super Heroes',
                name_formatted: 'Super Heroes'
              },
              {
                id: 3,
                type: 1,
                name: 'Loosers',
                display_name: 'Loosers',
                name_formatted: 'Loosers'
              }
            ]);
            TestManager.addMembers('Staff', ['Famous Actors', 'Super Heroes', 'Loosers']);
            collection.fetch().done(function() {
              collection.testFetchDone = true;
            });
          });

          TestUtil.waitFor(done,function() {
            return tabbables || collection.testFetchDone;
          }, 'collection fetched', 300);
          TestUtil.run(done,function (done) {

            if (tabbables) {
              return;
            }
            expect(collection.length).toEqual(1,"collectiom.length");
            view = new RoleDetailsView({
              model: collection.at(0),
              parentCollection: undefined,
              context: TestManager.context
            });
            view.on('dom:refresh', function () {
              view._attachedToDom = true;
            });
            editor = new ModalDialogView({
              body: view,
              modalClassName: 'conws-role-details'
            });
            editor.show();
            var filter = view.$('.conws-filter-header .header-caption');
            expect(filter.length).toEqual(1,"filter.length");
            expect(filter.text()).toEqual('Participants',"filter.text");
            var members = view.$('li.conws-role-details-member');
            expect(members.length).toEqual(3,"members.length");
            var buttons = view.$('button.conws-roles-edit-button');
            expect(buttons.length).toEqual(1,"buttons.length");
          });

          TestUtil.waitFor(done,function () {
            return tabbables || view._attachedToDom;
          }, 'The view isn\'t attached to the DOM.', 1000);

          TestUtil.run(done,function(done) {
            if (tabbables) {
              return;
            }
            stopwaiting = false;
            var found;
            TestUtil.waitFor(done, function() {
              found = view.$(':tabbable');
              if (found.length>0) {
                tabbables = found;
                return true;
              }
            },"tabbables to appear",2000).fail(function() {
              stopwaiting = true;
              log.info("tabbables (D) length only "+(found&&found.length)) && console.log(log.last);
            });
          });

          TestUtil.waitFor(done,function () {
            if (tabbables||stopwaiting) {
              return true;
            }
          }, 'tabbable elements to appear.', 2100);
        }
        for (var ii = 0; ii<tries; ii++) {
          prepareTabbables(done, ii+1);
        }

        TestUtil.run(done,function (done) {

          expect(tabbables).toBeDefined("tabbables didn't appear within "+count+" tries.");

          if (!tabbables) {
            return;
          }
          var elem = view.$(tabbables[1]);
          expect(elem.hasClass('conws-role-details-member')).toBeTruthy("elem.hasClass conws-role-details-member");
          expect(elem.find('.member-name').text()).toEqual('Famous Actors',"elem with class member-name text");
          elem = view.$(tabbables[1]).trigger('focus');
        });
        TestUtil.waitFor(done,function () {
          return view.$(document.activeElement).text().trim() === 'Famous Actors';
        }, 'Failed to focus \'Famous Actors\'', 100);

        TestUtil.run(done,function (done) {
          view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
        });
        TestUtil.waitFor(done, function () {
          return view.$(document.activeElement).text().trim() === 'Loosers';
        }, 'Failed to focus \'Loosers\'', 100);

        TestUtil.run(done,function (done) {
          view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
        });
        TestUtil.waitFor(done, function () {
          return view.$(document.activeElement).text().trim() === 'Super Heroes';
        }, 'Failed to focus \'Super Heroes\'', 100);

        TestUtil.run(done,function (done) {
          view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 40, which: 40}));
        });
        TestUtil.waitFor(done, function () {
          return view.$(document.activeElement).text().trim() === 'Super Heroes';
        }, 'Failed to focus \'Super Heroes\'', 100);

        TestUtil.run(done, function (done) {
          view.$(document.activeElement).trigger($.Event('keydown', {keyCode: 38, which: 38}));
        });
        TestUtil.waitFor(done, function () {
          return view.$(document.activeElement).text().trim() === 'Loosers';
        }, 'Failed to focus \'Loosers\'', 100);
      });
    });

    describe('view filter', function () {

      var view;
      var collection;
      var editor;

      beforeEach(function () {
        collection = TestManager.context.getCollection(RolesCollectionFactory);
      });

      afterEach(function () {
        $('.cs-dialog.binf-modal').remove();
      });

      it('with more than 15 participants', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', description: 'Staff description', leader: false}
        ]);

        var i = 0;
        var members = [];
        for (i = 10; i < 25; i++) {
          members.push({
            id: i,
            type: 1,
            name: i.toString(),
            display_name: i.toString(),
            name_formatted: i.toString()
          });
        }
        TestManager.createMembers(members);
        members = [];
        for (i = 10; i < 25; i++) {
          members.push(i.toString());
        }
        TestManager.addMembers('Staff', members);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done, function (done) {
          expect(collection.length).toEqual(1);
          view = new RoleDetailsView({
            model: collection.at(0),
            parentCollection: undefined,
            context: TestManager.context
          });
          view.on('dom:refresh', function () {
            view._attachedToDom = true;
          });
          editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-role-details'
          });
          editor.show();
        });

        TestUtil.waitFor(done,function () {
          return view._attachedToDom;
        }, 'The view isn\'t attached to the DOM.', 1000);

        TestUtil.run(done, function (done) {
          var fcaption = view.$('.conws-filter-header .header-caption');
          expect(fcaption.length).toEqual(1);
          expect(fcaption.text()).toEqual('Participants');
          var fbutton = view.$('.conws-filter-header .filter-icon span');
          expect(fbutton.length).toEqual(1);
          expect(fbutton.attr('title')).toEqual('Participants');
          var plist = view.$('.conws-role-details-member');
          expect(plist.length).toEqual(15);
          fbutton.trigger('click');
        });
        TestUtil.waitFor(done,function () {
          return view.$('.conws-filter-header .filter-search input').is(':visible');
        }, 'Failed to enable filer elements!', 500);
        TestUtil.run(done,function (done) {
          var ftext = view.$('.conws-filter-header .filter-search input');
          expect(ftext.length).toEqual(1);
          var fclear = view.$('.conws-filter-header .filter-clear span');
          expect(fclear.length).toEqual(1);
          expect(fclear.is(':visible')).toBeFalsy();
          ftext.val('0');
          ftext.trigger($.Event('keyup', {keyCode: 48, which: 48}));
        });
        TestUtil.waitFor(done,function () {
          return view.$('.conws-filter-header .filter-clear span').is(':visible');
        }, 'Failed to enable clear button!', 500);
        TestUtil.run(done,function (done) {
          var fclear = view.$('.conws-filter-header .filter-clear span');
          expect(fclear.length).toEqual(1);
          expect(fclear.is(':visible')).toBeTruthy();
          var members = view.$('.conws-role-details-member');
          expect(members.length).toEqual(2);
          expect($(members[0]).text().trim()).toEqual('10');
          expect($(members[1]).text().trim()).toEqual('20');
          fclear.trigger('click');
        });
        TestUtil.waitFor(done,function () {
          return !view.$('.conws-filter-header .filter-clear span').is(':visible');
        }, 'Failed to disable clear button!', 500);
        TestUtil.run(done,function (done) {
          var fclear = view.$('.conws-filter-header .filter-clear span');
          expect(fclear.length).toEqual(1);
          expect(fclear.is(':visible')).toBeFalsy();
          var ftext = view.$('.conws-filter-header .filter-clear span');
          expect(ftext.length).toEqual(1);
          expect(ftext.val()).toEqual('');
          var members = view.$('.conws-role-details-member');
          expect(members.length).toEqual(15);
        });
      });

      it('with more than 15 participants', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', description: 'Staff description', leader: false}
        ]);

        var i = 0;
        var members = [];
        for (i = 10; i < 20; i++) {
          members.push({
            id: i,
            type: 1,
            name: i.toString(),
            display_name: i.toString(),
            name_formatted: i.toString()
          });
        }
        TestManager.createMembers(members);
        members = [];
        for (i = 10; i < 20; i++) {
          members.push(i.toString());
        }
        TestManager.addMembers('Staff', members);
        TestManager.waitAsync(done, [collection.fetch()], 100);
        TestUtil.run(done,function (done) {
          expect(collection.length).toEqual(1);
          view = new RoleDetailsView({
            model: collection.at(0),
            parentCollection: undefined,
            context: TestManager.context
          });
          view.on('dom:refresh', function () {
            view._attachedToDom = true;
          });
          editor = new ModalDialogView({
            body: view,
            modalClassName: 'conws-role-details'
          });
          editor.show();
        });

        TestUtil.waitFor(done,function () {
          return view._attachedToDom;
        }, 'The view isn\'t attached to the DOM.', 1000);

        TestUtil.run(done,function (done) {
          var fcaption = view.$('.conws-filter-header .header-caption');
          expect(fcaption.length).toEqual(1);
          expect(fcaption.text()).toEqual('Participants');
          var fbutton = view.$('.conws-filter-header .filter-icon span');
          expect(fbutton.length).toEqual(0);

          var ftext = view.$('.conws-filter-header .filter-search input');
          expect(ftext.length).toEqual(0);
          var fclear = view.$('.conws-filter-header .filter-clear span');
          expect(fclear.length).toEqual(0);
        });
      });
    });
  });
});
