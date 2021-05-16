/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/team.view',
  'esoc/widgets/userwidget/userwidget',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js'
], function ($, PageContext, TeamCollectionFactory, TeamView, UserWidget, TestUtil, TestManager) {
  describe('TeamView Collapsed Tile', function () {

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

    afterAll(function(done){
      $.mockjax.clear();
      done();
    });

    describe('view creation', function () {

      id = 4711;

      it('succeeds without configuration', function () {
        var view = new TeamView({
          context: TestManager.context
        });
        expect(view.options).toBeDefined();
        expect(view.options.context).toBeDefined();
        expect(view.options.context).toBe(TestManager.context);
        expect(view.options.data).toBeDefined();
        expect(view.options.data.showTitleIcon).toBeTruthy();
        expect(view.options.data.showWorkspaceIcon).toBeFalsy();
      });

      it('succeeds with configuration', function () {
        var view = new TeamView({
          context: TestManager.context,
          data: {
            showTitleIcon: false,
            showWorkspaceIcon: true,
            title: 'title'
          }
        });
        expect(view.options).toBeDefined();
        expect(view.options.context).toBeDefined();
        expect(view.options.context).toBe(TestManager.context);
        expect(view.options.data).toBeDefined();
        expect(view.options.data.title).toEqual('title');
        expect(view.options.data.showTitleIcon).toBeFalsy();
        expect(view.options.data.showWorkspaceIcon).toBeTruthy();
      });
    });

    describe('collection model parses workspace roles and members', function () {

      var view;

      beforeEach(function () {
        view = new TeamView({
          context: TestManager.context
        });
        view.render();
      });

      it('without roles and members', function (done) {
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(0);
        });
      });

      it('with empty roles', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Primary Contact', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(2);
          var member = view.completeCollection.models[0];
          expect(member.memberType).toEqual('role');
          expect(member.get('name')).toEqual('Primary Contact');
          expect(member.member).toBeUndefined();
          expect(member.roles.length).toEqual(1);
          expect(member.roles[0].name).toEqual('Primary Contact');
          expect(member.roles[0].id).toEqual(101);

          member = view.completeCollection.models[1];
          expect(member.memberType).toEqual('role');
          expect(member.get('name')).toEqual('Support');
          expect(member.member).toBeUndefined();
          expect(member.roles.length).toEqual(1);
          expect(member.roles[0].name).toEqual('Support');
          expect(member.roles[0].id).toEqual(102);
        });
      });

      it('with 2 roles each containing 1 members', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Primary Contact', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);
        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Primary Contact', ['bspencer']);
        TestManager.addMembers('Support', ['lfunes']);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(2);
          var member = view.completeCollection.models[0];
          expect(member.memberType).toEqual('member');
          expect(member.get('name')).toEqual('bspencer');
          expect(member.get('id')).toEqual(1);
          expect(member.member).toBeDefined();
          expect(member.member.name).toEqual('bspencer');
          expect(member.member.id).toEqual(1);
          expect(member.roles.length).toEqual(1);
          expect(member.roles[0].name).toEqual('Primary Contact');
          expect(member.roles[0].id).toEqual(101);

          member = view.completeCollection.models[1];
          expect(member.memberType).toEqual('member');
          expect(member.get('name')).toEqual('lfunes');
          expect(member.get('id')).toEqual(2);
          expect(member.member).toBeDefined();
          expect(member.member.name).toEqual('lfunes');
          expect(member.member.id).toEqual(2);
          expect(member.roles.length).toEqual(1);
          expect(member.roles[0].name).toEqual('Support');
          expect(member.roles[0].id).toEqual(102);
        });
      });

      it('with 2 roles and 3 members', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Primary Contact', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);
        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 0, name: 'herhardt', display_name: 'Heinz Erhardt'},
          {id: 3, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Primary Contact', ['bspencer', 'herhardt']);
        TestManager.addMembers('Support', ['herhardt', 'lfunes']);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(3);
          var member = view.completeCollection.models[0];
          expect(member.memberType).toEqual('member');
          expect(member.get('name')).toEqual('bspencer');
          expect(member.get('id')).toEqual(1);
          expect(member.member).toBeDefined();
          expect(member.member.name).toEqual('bspencer');
          expect(member.member.id).toEqual(1);
          expect(member.roles.length).toEqual(1);
          expect(member.roles[0].name).toEqual('Primary Contact');
          expect(member.roles[0].id).toEqual(101);

          member = view.completeCollection.models[1];
          expect(member.memberType).toEqual('member');
          expect(member.get('name')).toEqual('herhardt');
          expect(member.get('id')).toEqual(2);
          expect(member.member).toBeDefined();
          expect(member.member.name).toEqual('herhardt');
          expect(member.member.id).toEqual(2);
          expect(member.roles.length).toEqual(2);
          expect(member.roles[0].name).toEqual('Primary Contact');
          expect(member.roles[0].id).toEqual(101);
          expect(member.roles[1].name).toEqual('Support');
          expect(member.roles[1].id).toEqual(102);

          member = view.completeCollection.models[2];
          expect(member.memberType).toEqual('member');
          expect(member.get('name')).toEqual('lfunes');
          expect(member.get('id')).toEqual(3);
          expect(member.member).toBeDefined();
          expect(member.member.name).toEqual('lfunes');
          expect(member.member.id).toEqual(3);
          expect(member.roles.length).toEqual(1);
          expect(member.roles[0].name).toEqual('Support');
          expect(member.roles[0].id).toEqual(102);
        });
      });
    });

    describe('collection model sorts', function () {

      var view;

      beforeEach(function () {
        view = new TeamView({
          context: TestManager.context
        });
        view.render();
      });

      it('roles and members ascending by display name', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true}
        ]);
        TestManager.createMembers([
          {id: 1, type: 1, name: 'Famous Actors', display_name: 'Famous Actors'},
          {
            id: 2,
            type: 0,
            name: 'herhardt',
            last_name: 'Erhardt',
            display_name: 'Heinz Erhardt'
          },
          {id: 3, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {
            id: 4,
            type: 0,
            name: 'lfunes',
            last_name: 'De Funes',
            first_name: 'Louis',
            display_name: 'Louis De Funes'
          }
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'Famous Actors', 'herhardt', 'lfunes']);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(4);
          var member = view.completeCollection.models[0];
          expect(member.memberType).toEqual('member');
          expect(member.get('display_name')).toEqual('Bud Spencer');

          member = view.completeCollection.models[1];
          expect(member.memberType).toEqual('member');
          expect(member.get('display_name')).toEqual('Famous Actors');

          member = view.completeCollection.models[2];
          expect(member.memberType).toEqual('member');
          expect(member.get('display_name')).toEqual('Heinz Erhardt');

          member = view.completeCollection.models[3];
          expect(member.memberType).toEqual('member');
          expect(member.get('display_name')).toEqual('Louis De Funes');
        });
      });
    });

    describe('model functions', function () {

      var view;

      beforeEach(function () {
        view = new TeamView({
          context: TestManager.context
        });
        view.render();
      });

      it('\'getLeadingRole\' and \'getRolesIndicator\' work correct.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Primary Contact', leader: false},
          {id: 102, name: 'Support', leader: true},
          {id: 103, name: 'Staff', leader: false}
        ]);
        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
          {id: 2, type: 1, name: 'Famous Actors', display_name: 'Famous Actors'},
          {id: 3, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Primary Contact', ['bspencer', 'Famous Actors']);
        TestManager.addMembers('Support', ['bspencer']);
        TestManager.addMembers('Staff', ['bspencer', 'Famous Actors', 'lfunes']);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(3);
          member = view.completeCollection.models[0];
          expect(member.get('name')).toEqual('bspencer');
          expect(member.getLeadingRole()).toEqual('Support');
          expect(member.getRolesIndicator()).toEqual('+2');
          var member = view.completeCollection.models[1];
          expect(member.get('name')).toEqual('Famous Actors');
          expect(member.getLeadingRole()).toEqual('Primary Contact');
          expect(member.getRolesIndicator()).toEqual('+1');
          member = view.completeCollection.models[2];
          expect(member.get('name')).toEqual('lfunes');
          expect(member.getLeadingRole()).toEqual('Staff');
          expect(member.getRolesIndicator()).toEqual('');
        });
      });

      it('\'getMemberName\' and \'getMemberType\' work correct.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true}
        ]);
        TestManager.createMembers([
          {
            id: 1,
            type: 0,
            type_name: 'User',
            name: 'bspencer',
            display_name: 'Bud Spencer'
          },
          {
            id: 2,
            type: 0,
            type_name: 'Benutzer',
            name: 'herhardt',
            last_name: 'Erhardt',
            display_name: 'Heinz Erhardt'
          },
          {
            id: 3,
            type: 1,
            type_name: 'Group',
            name: 'Famous Actors',
            display_name: 'Famous Actors'
          },
          {
            id: 4,
            type: 0,
            type_name: 'User',
            name: 'lfunes',
            last_name: 'De Funes',
            first_name: 'Louis',
            display_name: 'Louis De Funes'
          },
          {
            id: 5,
            type: 1,
            type_name: 'Gruppe',
            name: 'Schlechte Schauspieler',
            display_name: 'Schlechte Schauspieler'
          }
        ]);
        TestManager.addMembers('Staff',
            ['bspencer', 'Famous Actors', 'herhardt', 'lfunes', 'Schlechte Schauspieler']);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(5);
          member = view.completeCollection.models[0];
          expect(member.get('name')).toEqual('bspencer');
          expect(member.get('display_name')).toEqual('Bud Spencer');
          expect(member.getMemberType()).toEqual('user');
          member = view.completeCollection.models[1];
          expect(member.get('name')).toEqual('Famous Actors');
          expect(member.get('display_name')).toEqual('Famous Actors');
          expect(member.getMemberType()).toEqual('group');
          member = view.completeCollection.models[2];
          expect(member.get('name')).toEqual('herhardt');
          expect(member.get('display_name')).toEqual('Heinz Erhardt');
          expect(member.getMemberType()).toEqual('user');
          var member = view.completeCollection.models[3];
          expect(member.get('name')).toEqual('lfunes');
          expect(member.get('display_name')).toEqual('Louis De Funes');
          expect(member.getMemberType()).toEqual('user');

        });
      });

      it('\'setIconUrl\' and \'getIconUrl\' work correct.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Primary Contact', leader: false}
        ]);
        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Primary Contact', ['bspencer']);
        TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
        TestUtil.run(done,function () {
          expect(view.completeCollection.length).toEqual(1);
          var member = view.completeCollection.models[0];
          expect(member.get('name')).toEqual('bspencer');
          expect(member.getIconUrl()).toBeUndefined();
          member = view.completeCollection.models[0];
          expect(member.get('name')).toEqual('bspencer');
          expect(member.getIconUrl()).toBeUndefined();
          member.setIconUrl('//icon/url');
          expect(member.getIconUrl()).toEqual('//icon/url');
        });
      });
    });

    describe('view renders', function () {

      describe('collapsed view', function () {

        var view;

        beforeEach(function () {
          view = new TeamView({
            context: TestManager.context
          });
          view.render();
        });

        it('a placeholder information for an empty team.', function (done) {
          TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(0);
            var div = view.$('.conws-team');
            expect(div.length).toEqual(1);
            expect(div.attr('class')).toEqual('conws-team emptyview cs-emptylist-text');
            expect(div.children().text()).toEqual(
                'No team configured for this business workspace.');
          });
        });

        it('a team with multiple items.', function (done) {
          TestManager.createRoles([
            {id: 101, name: 'Manager', leader: true},
            {id: 102, name: 'Staff', leader: false},
            {id: 103, name: 'Work Council', leader: false}
          ]);
          TestManager.createMembers([
            {
              id: 41158,
              type: 0,
              name: 'bspencer',
              last_name: 'Spencer',
              first_name: 'Bud',
              business_email: 'bspencer@elink.loc',
              display_name: 'Bud Spencer'
            },
            {
              id: 39730,
              type: 0,
              name: 'lfunes',
              last_name: 'De Funes',
              first_name: 'Louis',
              display_name: 'Louis De Funes'
            },
            {id: 63488, type: 1, name: 'Famous Actors', display_name: 'Famous Actors'}
          ]);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes', 'Famous Actors']);
          TestManager.addMembers('Manager', ['bspencer']);
          TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(4);
            var div = view.$('.binf-list-group');
            expect(div.length).toEqual(1);
            var members = div.find('.conws-item-member');
            expect(members.length).toEqual(4);
            var icon = view.$(members[0]).find('.conws-user-avatar');
            expect(icon.attr('class')).toEqual('conws-user-avatar');
            var name = view.$(members[0]).find('.cs-left .cs-title .cs-name');
            expect(name.attr('title').match('Bud Spencer')).toBeTruthy();
            var roles = view.$(members[0]).find('.cs-stage');
            expect(view.$(roles.children()[0]).text()).toEqual('Manager');
            expect(view.$(roles.children()[1]).text()).toEqual('+1');
            icon = view.$(members[1]).find('.csui-icon');
            expect(icon.attr('class')).toEqual('csui-icon binf-img-circle' +
                                               ' conws-avatar-group-placeholder');
            name = view.$(members[1]).find('.cs-title > span');
            expect(name.text()).toEqual('Famous Actors');
            roles = view.$(members[1]).find('.cs-stage');
            expect(view.$(roles.children()[0]).text()).toEqual('Staff');
            expect(view.$(roles.children()[1]).text()).toEqual('');
            spyOn(view, 'onClickItem');
            view.$(members[1]).trigger('click');
            expect(view.onClickItem).toHaveBeenCalled();
            icon = view.$(members[2]).find('.conws-user-avatar');
            expect(icon.attr('class')).toEqual('conws-user-avatar');
            name = view.$(members[2]).find('.cs-title .cs-name');
            expect(name.attr('title').match('Louis De Funes')).toBeTruthy();
            roles = view.$(members[2]).find('.cs-stage');
            expect(view.$(roles.children()[0]).text()).toEqual('Staff');
            expect(view.$(roles.children()[1]).text()).toEqual('');
            icon = view.$(members[3]).find('.cs-icon');
            expect(icon.attr('class')).toEqual('cs-icon circular cs-icon-add');
            name = view.$(members[3]).find('.cs-title > span');
            expect(name.text()).toEqual('Work Council');
            roles = view.$(members[3]).find('.cs-stage');
            expect(roles.length).toEqual(0);
          });
        });
      });

      describe('collapsed view', function () {

        var view;

        it('with localized title', function () {
          view = new TeamView({
            context: TestManager.context,
            data: {
              title: {
                de: 'title-de',
                en: 'title-en'
              }
            }
          });
          view.render();
          var div = view.$('.tile-title > .csui-heading');
          expect(div.length).toEqual(1);
          expect(div.text()).toEqual('title-en');
        });

        it('without localized title', function () {
          view = new TeamView({
            context: TestManager.context,
            data: {
              title: 'title'
            }
          });
          view.render();
          var div = view.$('.tile-title > .csui-heading');
          expect(div.length).toEqual(1);
          expect(div.text()).toEqual('title');
        });

        it('without configured title', function () {
          view = new TeamView({
            context: TestManager.context
          });
          view.render();
          var div = view.$('.tile-title > .csui-heading');
          expect(div.length).toEqual(1);
          expect(div.text()).toEqual('Team');
        });
      });

      describe('expanded view', function () {

        var view;

        afterEach(function () {
          $('.cs-dialog.binf-modal').remove();
        });

        it('with default configuration.', function (done) {
          view = new TeamView({
            context: TestManager.context,
            collection: TestManager.context.getCollection(TeamCollectionFactory)
          });
          view.render();
          TestManager.createRoles([
            {id: 101, name: 'Staff', leader: true}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
          TestManager.waitAsync(done, [view.completeCollection.fetch()], 100, "waiting for" +
                                                                        " completeCollection.fetch");
          TestManager.waitAsync(done, [view.headerModel.fetch()], 100, "waiting for" +
                                                                    " headerModel.fetch");
          expect(view.collection.length === 0).toBeTruthy();
          TestUtil.run(done,function (done) {
            var expand = view.$('.icon-tileExpand');
            expect(expand.length).toEqual(1);
            expand.trigger('click');

            TestUtil.waitFor(done,function () {
              return $('.conws-team .binf-modal-dialog').length > 0;
            }, 'table items to be displayed ', 100);

            TestUtil.run(done,function () {
              var expandedView = $('.conws-team .binf-modal-dialog');
              expect(expandedView.length).toEqual(1);
              var icon = expandedView.find('.tile-header.binf-modal-header > span');
              expect(icon.length).toEqual(1);
              expect(icon.hasClass('mime-team')).toBeTruthy();
              var primary = expandedView.find('.primary-title');
              expect(primary.length).toEqual(1);
              expect(primary.text()).toEqual('Roller Support Stand');
              var secondary = expandedView.find('.secondary-title');
              expect(secondary.length).toEqual(1);
              expect(secondary.text()).toEqual('Equipment');
            });
          });
        });

        it('with custom configuration.', function (done) {
          view = new TeamView({
            context: TestManager.context,
            data: {
              showTitleIcon: true,
              showWorkspaceIcon: true
            }
          });
          view.render();
          TestManager.createRoles([
            {id: 101, name: 'Staff', leader: true}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
          TestManager.waitAsync(done, [view.completeCollection.fetch()], 100);
          TestManager.waitAsync(done, [view.headerModel.fetch()], 100);
          TestUtil.run(done,function (done) {
            var expand = view.$('.icon-tileExpand');
            expect(expand.length).toEqual(1);
            expand.trigger('click');

            TestUtil.waitFor(done,function () {
              return $('.conws-team .binf-modal-dialog').length > 0;
            }, 'table items to be displayed ', 100);

            TestUtil.run(done,function () {
              var expandedView = $('.conws-team .binf-modal-dialog');
              expect(expandedView.length).toEqual(1);
              var icon = expandedView.find(
                  '.tile-header.binf-modal-header > span.conws-mime_workspace');
              expect(icon.length).toEqual(1);
              var primary = expandedView.find('.primary-title');
              expect(primary.length).toEqual(1);
              expect(primary.text()).toEqual('Roller Support Stand');
              var secondary = expandedView.find('.secondary-title');
              expect(secondary.length).toEqual(1);
              expect(secondary.text()).toEqual('Equipment');
            });
          });
        });
      });
    });

    describe('ending test suite', function () {
      it('wait some time for mocks to be satisfied', function (done) {
        TestUtil.run(done,function () {
          TestUtil.justWait(done,"justWait 1000",1000);
        });
      });
    });

  });
});
