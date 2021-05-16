/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/teamtables.view',
  'conws/widgets/team/impl/cells/name/name.view',
  'conws/widgets/team/impl/cells/roles/roles.view',
  'conws/widgets/team/impl/cells/rolename/rolename.view',
  'csui/controls/dialog/dialog.view',
  'conws/utils/test/testutil',
  'esoc/widgets/userwidget/userwidget',
  'csui/lib/marionette',
  './team.mock.testmanager.js',
  './addparticipants.mock.testmanager.js',
  'csui/utils/log'
], function (_, $, PageContext, TeamTablesView, NameCellView, RolesCellView, RoleNameCellView,
             ModalDialogView,
             TestUtil, UserWidget, Marionette, TestManager, TestManagerParticipants, log) {

  describe('Team Tables Cells', function () {
    var contentRegion;
    var view;


    beforeEach(function () {
      var user = {display_Name: ""};
      spyOn(UserWidget,
          'getUser').and.callFake(
          function () {return {then: function (callback) {return callback(user);}}});
    });


    describe('Participants team tables cells and columns', function () {

      describe('Table columns 1', function () {
        var id = 4711;

        beforeEach(function () {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);

          $("body").append('<div id="test_team_cells" style="width: 1260px;height: 500px"</div>');
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.render();
          contentRegion = new Marionette.Region({ el: "#test_team_cells" });
          contentRegion.show(view);
        });

        afterEach(function(){
          $("body #test_team_cells").remove();
        });

        afterAll(function(done){
          $.mockjax.clear();
          done();
        });

        it('render all columns with correct names and filter control', function (done) {
          TestManager.waitAsync(done, [view.participantCollection.fetch()], 100);
          TestUtil.waitFor(done,function () {
            var header = view.$('th.team-table-cell-avatar');
            return header.length === 1;
          }, 'render all columns with correct names and filter control to be displayed ', 200);
           TestUtil.run(done,function () {

            var header;
            header = view.$('th.team-table-cell-avatar');
            expect(header.length).toEqual(1);
            expect(header.text()).toEqual('');
            expect(header.find('.csui-table-column-search').length).toEqual(0);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting_disabled')).not.toEqual(-1);
            header = view.$('th[data-csui-attribute="conws_participantname"]');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Name');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting_asc')).toBeGreaterThan(-1);
            header = view.$('th.conws-team-table-cell-roles');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Roles');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting')).toBeGreaterThan(-1);
            header = view.$('th[data-csui-attribute="conws_participantlogin"]');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Login');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting')).toBeGreaterThan(-1);
            header = view.$('th[data-csui-attribute="conws_participantemail"]');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Business e-mail');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting')).toBeGreaterThan(-1);
            header = view.$('th.team-table-cell-department');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Department');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting')).not.toEqual(-1);
          });
        });
      });

      describe('Table row cells 1', function () {
        var id = 4711;

        var view, dialog;

        function createAndShowTeamTables(){

          var deferred = $.Deferred();
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.once("render",function(){
            log.info("teamTables render") && console.log(log.last);
            view.participantsRegion.once("show",function(){
              log.info("participantsRegion show") && console.log(log.last);
              view.participantsTableView.once("show",function(){
                log.info("participantsTable show") && console.log(log.last);
                deferred.resolve();
              });
            });
          });

          dialog = new ModalDialogView({
            view: view,
            className: 'conws-team'
          });
          dialog.show();

          return deferred.promise();
        }
        beforeEach(function () {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);
        });

        afterEach(function () {
          if (dialog) {
            dialog.destroy();
            dialog = undefined;
          }
          $('.cs-dialog.binf-modal').remove();
        });

        describe('Avatar cell view', function () {

          beforeEach(function () {
            $("body").append('<div id="test_team_cells" style="width: 1260px;height: 500px"</div>');
            view = new TeamTablesView({
              context: TestManager.context,
              collection: {}
            });
            view.render();
            contentRegion = new Marionette.Region({ el: "#test_team_cells" });
            contentRegion.show(view);
          });

          afterEach(function(){
            $("body #test_team_cells").remove();
          });

          it('renders correctly depending on the provided properties', function (done) {

            TestManager.createRoles([
              {id: 101, name: 'Staff', leader: true}
            ]);
            TestManager.createMembers([
              {
                id: 1,
                type: 0,
                name: 'bspencer',
                isNew: true,
                display_name: 'Bud Spencer'
              },
              {
                id: 2,
                type: 0,
                name: 'cbronson',
                last_name: 'Bronson',
                isNew: true,
                display_name: 'cbronson'
              },
              {
                id: 3,
                type: 0,
                name: 'lfunes',
                last_name: 'De Funes',
                first_name: 'Louis',
                display_name: 'Louis De Funes'
              }
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'cbronson', 'lfunes']);
            TestManager.waitAsync(done, [view.participantCollection.fetch()], 100);

            TestUtil.waitFor(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              var cbronson = view.$(rows[0]).find('td.team-table-cell-avatar');
              return cbronson.length === 1;
            }, 'avatar to be displayed ', 200);
            TestUtil.run(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              expect(rows.length).toEqual(3);
              var cbronson = view.$(rows[0]).find('td.team-table-cell-avatar');
              expect(cbronson.length).toEqual(1);
              expect(cbronson.find('span').length).toEqual(1);
              expect(cbronson.find('span.status-indicator-new')).toBeTruthy();
              expect(cbronson.find('div.conws-avatar').length).toEqual(1);
              expect(cbronson.find('.conws-avatar').length).toEqual(1);
              var bspencer = view.$(rows[1]).find('td.team-table-cell-avatar');
              expect(bspencer.length).toEqual(1);
              expect(bspencer.find('span').length).toEqual(1);
              expect(bspencer.find('span.status-indicator-new')).toBeTruthy();
              expect(bspencer.find('div.conws-avatar').length).toEqual(1);
              expect(bspencer.find('.conws-avatar').length).toEqual(1);
              var lfunes = view.$(rows[2]).find('td.team-table-cell-avatar');
              expect(lfunes.length).toEqual(1);
              expect(lfunes.find('span').length).toEqual(0);
              expect(lfunes.find('div.conws-avatar').length).toEqual(1);
              expect(lfunes.find('.conws-avatar').length).toEqual(1);
            });
          });

        });

        describe('Name cell view', function () {

          it('isn\'t draggable', function () {
            var cell = new NameCellView();
            expect(cell.events['dragstart ' + cell.ui.userProfileName]).toEqual('onDrag');
            expect(cell.onDrag()).toBeFalsy();
          });

          xit('renders correctly depending on the provided properties', function (done) {
            TestManager.createRoles([
              {id: 101, name: 'Staff', leader: true}
            ]);
            TestManager.createMembers([
              {
                id: 41158,
                type: 0,
                name: 'bspencer',
                last_name: 'Spencer',
                first_name: 'Bud',
                display_name: 'Bud Spencer'
              },
              {
                id: 41268,
                type: 0,
                name: 'cbronson',
                last_name: 'Bronson',
                first_name: '',
                display_name: 'Bronson'
              },
              {
                id: 39730,
                type: 0,
                name: 'lfunes',
                last_name: 'De Funes',
                first_name: 'Louis',
                display_name: 'Louis De Funes'
              }
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'cbronson', 'lfunes']);
            TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
            TestUtil.run(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              expect(rows.length).toEqual(3);

              var bspencer = view.$(rows[0]).find('td[data-csui-attribute="conws_participantname"]' +
                                                  ' .csui-name');
              expect(bspencer.length).toEqual(1);
              expect(bspencer.attr('title')).toEqual('Bronson');

              var cbronson = view.$(rows[1]).find('td[data-csui-attribute="conws_participantname"]' +
                                                  ' .csui-name');
              expect(cbronson.length).toEqual(1);
              expect(cbronson.attr('title')).toEqual('Bud Spencer');

              var lfunes = view.$(rows[2]).find('td[data-csui-attribute="conws_participantname"]' +
                                                ' .csui-name');
              expect(lfunes.length).toEqual(1);
              expect(lfunes.attr('title')).toEqual('Louis De Funes');

            });
          });
        });

        describe('Roles cell view', function () {

          it('isn\'t draggable', function () {
            var cell = new RolesCellView();
            expect(cell.events['dragstart ' + cell.ui.roleEdit]).toEqual('roleEditDrag');
            expect(cell.roleEditDrag()).toBeFalsy();
          });

          xit('renders correctly including roles indicator', function (done) {
            TestManager.createRoles([
              {id: 101, name: 'Staff', leader: false},
              {id: 102, name: 'Famous Actors', leader: false},
              {id: 103, name: 'Super Heroes', leader: true},
              {id: 104, name: 'Looser', leader: false}
            ]);
            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 0, name: 'bwillis', display_name: 'Bruce Willis'},
              {id: 3, type: 0, name: 'lcaprio', display_name: 'Leonardo Di Caprio'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'bwillis', 'lcaprio']);
            TestManager.addMembers('Famous Actors', ['bspencer', 'lcaprio']);
            TestManager.addMembers('Super Heroes', ['bwillis']);
            TestManager.addMembers('Looser', ['lcaprio']);
            TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
            TestUtil.run(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              expect(rows.length).toEqual(3);
              var bspencer = view.$(rows[0]).find('td.conws-team-table-cell-roles');
              expect(bspencer.length).toEqual(1);
              expect(bspencer.find(
                  '.conws-roles-text > .conws-roles-truncatebox > span').length).toEqual(2);
              expect(
                  bspencer.find('.conws-roles-text > div.conws-roles-truncatebox').length).toEqual(
                  1);
              expect($(bspencer.find('.conws-roles-text > div > span')[0]).text()).toEqual(
                  'Super Heroes');
              expect($(bspencer.find('.conws-roles-text > div > span')[1]).text()).toEqual('+1');
              var bwillis = view.$(rows[1]).find('td.conws-team-table-cell-roles');
              expect(bwillis.length).toEqual(1);
              expect(bwillis.find(
                  '.conws-roles-text > .conws-roles-truncatebox > span').length).toEqual(2);
              expect($(bwillis.find('.conws-roles-text > div > span')[0]).text()).toEqual(
                  'Famous Actors');
              expect($(bwillis.find('.conws-roles-text > div > span')[1]).text()).toEqual('+1');
              var lcaprio = view.$(rows[2]).find('td.conws-team-table-cell-roles');
              expect(lcaprio.length).toEqual(1);
              expect(lcaprio.find(
                  '.conws-roles-text > .conws-roles-truncatebox > span').length).toEqual(2);
              expect($(lcaprio.find('.conws-roles-text > div > span')[0]).text()).toEqual(
                  'Famous Actors');
              expect($(lcaprio.find('.conws-roles-text > div > span')[1]).text()).toEqual('+2');
            });
          });
        });

        describe('Login cell view', function () {

          xit('renders correctly for users and groups', function (done) {
            TestManager.createRoles([
              {id: 101, name: 'Staff', leader: true}
            ]);
            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {id: 2, type: 1, name: 'super heroes', display_name: 'super heroes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'super heroes']);
            TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
            TestUtil.run(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              expect(rows.length).toEqual(2);
              var bspencer = view.$(rows[0]).find('td[data-csui-attribute="conws_participantlogin"]');
              expect(bspencer.length).toEqual(1);
              expect(bspencer.find('span').text()).toEqual('bspencer');
              var superHeroes = view.$(rows[1]).find('td[data-csui-attribute="conws_participantlogin"]');
              expect(superHeroes.length).toEqual(1);
              expect(superHeroes.find('span').text()).toEqual('');
            });
          });
        });

        describe('Email cell view', function () {

          beforeEach(function () {
            $("body").append('<div id="test_team_cells" style="width: 1260px;height: 500px"</div>');
            view = new TeamTablesView({
              context: TestManager.context,
              collection: {}
            });
            view.render();
            contentRegion = new Marionette.Region({ el: "#test_team_cells" });
            contentRegion.show(view);
          });

          afterEach(function(){
            $("body #test_team_cells").remove();
          });

          it('renders correctly with or without email', function (done) {
            TestManager.createRoles([
              {id: 101, name: 'Staff', leader: true}
            ]);
            TestManager.createMembers([
              {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
              {
                id: 2,
                type: 0,
                name: 'lfunes',
                business_email: 'lfunes@elink.loc',
                display_name: 'Louis De Funes'
              },
              {id: 3, type: 1, name: 'super heroes', display_name: 'super heroes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'lfunes', 'super heroes']);
            TestManager.waitAsync(done, [view.participantCollection.fetch()], 100);

            TestUtil.waitFor(done,function () {
              return view.$('#participantsview tbody > tr').length > 0;
            }, 'table items to be displayed ', 200);
            TestUtil.run(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              expect(rows.length).toEqual(3);
              var bspencer = view.$(rows[0]).find('td[data-csui-attribute="conws_participantemail"]');
              expect(bspencer.length).toEqual(1);
              expect(bspencer.find('span').text()).toEqual('');
              var lfunes = view.$(rows[1]).find('td[data-csui-attribute="conws_participantemail"]');
              expect(lfunes.length).toEqual(1);
              expect(lfunes.find('span').text()).toEqual('lfunes@elink.loc');
              var superHeroes = view.$(rows[2]).find('td[data-csui-attribute="conws_participantemail"]');
              expect(superHeroes.length).toEqual(1);
              expect(superHeroes.find('span').text()).toEqual('');
            });
          });
        });

        describe('Department cell view', function () {

          xit('renders correctly for users and groups', function (done) {
            TestManager.createRoles([
              {id: 101, name: 'Staff', leader: true}
            ]);
            TestManager.createMembers([
              {
                id: 1,
                type: 0,
                name: 'bspencer',
                group_name: 'famous actors',
                display_name: 'famous actors'
              },
              {id: 2, type: 1, name: 'super heroes', display_name: 'super heroes'}
            ]);
            TestManager.addMembers('Staff', ['bspencer', 'super heroes']);
            TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
            TestUtil.run(done,function () {
              var rows = view.$('#participantsview tbody > tr');
              expect(rows.length).toEqual(2);
              var bspencer = view.$(rows[0]).find('td.team-table-cell-department');
              expect(bspencer.length).toEqual(1);
              expect(bspencer.find('span').text()).toEqual('famous actors');
              var superHeroes = view.$(rows[1]).find('td.team-table-cell-department');
              expect(superHeroes.length).toEqual(1);
              expect(superHeroes.find('span').text()).toEqual('');
            });
          });
        });
      });
    });

    describe('Roles team tables cells and columns', function () {

      describe('Table columns 2', function () {
        var id = 4711;

        beforeEach(function () {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);

          $("body").append('<div id="test_team_cells" style="width: 1260px;height: 500px"</div>');
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.render();
          contentRegion = new Marionette.Region({ el: "#test_team_cells" });
          contentRegion.show(view);
          var tabs = view.$el.find('.teamtables-tabs > ul > li');
          view.$(tabs[1]).click();
        });

        afterEach(function(){
          $("body #test_team_cells").remove();
        });

        xit('render all columns with correct names and filter control', function (done) {
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
          TestUtil.run(done,function () {

            var header;
            header = view.$('#rolestab th.team-table-cell-avatar');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('');
            expect(header.find('.csui-table-column-search').length).toEqual(0);
            expect(_.indexOf(header.attr('class').split(/\s/),
                'sorting_disabled')).toBeGreaterThan(-1);
            header = view.$('th.team-table-cell-rolename');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Name');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting_asc')).toBeGreaterThan(-1);
            header = view.$('th.team-table-cell-participants');
            expect(header.length).toEqual(1);
            expect(header.find('.csui-table-column-text').text()).toEqual('Participants');
            expect(header.find('.csui-table-column-search').length).toEqual(1);
            expect(_.indexOf(header.attr('class').split(/\s/), 'sorting')).toBeGreaterThan(-1);
          });
        });
      });

      describe('Table row cells 2', function () {
        var id = 4711;
        beforeEach(function () {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);

          $("body").append('<div id="test_team_cells" style="width: 1260px;height: 500px"</div>');
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.render();
          contentRegion = new Marionette.Region({ el: "#test_team_cells" });
          contentRegion.show(view);
        });

        afterEach(function(){
          $("body #test_team_cells").remove();
        });

        xit('Avatar cell renders correctly depending on the provided properties', function (done) {
          TestManager.createRoles([
            {id: 101, name: 'Manager', leader: false, inherited_from_id: 815},
            {id: 102, name: 'Site Leader', leader: true},
            {id: 103, name: 'Staff', leader: false}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'cbronson', display_name: 'cbronson'},
            {id: 3, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Manager', ['bspencer']);
          TestManager.addMembers('Site Leader', ['cbronson']);
          TestManager.addMembers('Staff', ['bspencer', 'cbronson', 'lfunes']);
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);

          TestUtil.waitFor(done,function () {
            var rows = view.$('#rolesview tbody > tr');
            return rows.length === 3;
          }, 'Avatar cell renders correctly depending on the provided properties', 100);
          TestUtil.run(done,function () {
            var rows = view.$('#rolesview tbody > tr');
            expect(rows.length).toEqual(3);
            var manager = view.$(rows[0]).find('td.team-table-cell-avatar');
            expect(manager.length).toEqual(1);
            expect(manager.find('span').length).toEqual(1);
            expect(manager.find('span.status-indicator').attr('id').match(
                'status-indicator-inherited')).toBeTruthy();
            expect(manager.find('div.conws-avatar').length).toEqual(1);
            expect(manager.find('img').length).toEqual(1);
            var leader = view.$(rows[1]).find('td.team-table-cell-avatar');
            expect(leader.length).toEqual(1);
            expect(leader.find('span').length).toEqual(0);
            expect(leader.find('div.conws-avatar').length).toEqual(1);
            expect(leader.find('img').length).toEqual(1);
            var staff = view.$(rows[2]).find('td.team-table-cell-avatar');
            expect(staff.length).toEqual(1);
            expect(staff.find('span').length).toEqual(0);
            expect(staff.find('div.conws-avatar').length).toEqual(1);
            expect(staff.find('img').length).toEqual(1);
          });
        });

        xit('Roles cell isn\'t draggable', function (done) {
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);

          TestUtil.waitFor(done,function () {
            return view.$('#rolesview tbody').length > 0;
          }, 'table items to be displayed ', 100);

          TestUtil.run(done,function(){
            var cell = new RoleNameCellView();
            expect(cell.events['dragstart ' + cell.ui.roleDetails]).toEqual('roleDetailsDrag');
            expect(cell.roleDetailsDrag()).toBeFalsy();
          });
        });

        xit('Roles cell renders correctly depending on the provided properties', function (done) {
          TestManager.createRoles([
            {id: 101, name: 'Manager', leader: false, inherited_from_id: 815},
            {id: 102, name: 'Site Leader', leader: true},
            {id: 103, name: 'Staff', leader: false}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'cbronson', display_name: 'cbronson'},
            {id: 3, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Manager', ['bspencer']);
          TestManager.addMembers('Site Leader', ['cbronson']);
          TestManager.addMembers('Staff', ['bspencer', 'cbronson', 'lfunes']);
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
          TestUtil.run(done,function () {
            var rows = view.$('#participantsview tbody > tr');
            expect(rows.length).toEqual(3);
            var manager = view.$(rows[0]).find('td.conws-team-table-cell-roles');
            expect(manager.length).toEqual(1);
            expect(manager.find('span.conws-roles-text-truncate').text()).toEqual('Manager');
            expect(manager.find('.role-name-icon-cell span').css('background-image')).toEqual('');
            expect(manager.find('span.teamlead').text()).toEqual('');
            expect(manager.find('span.inherited').text()).toEqual('Inherited');
            var leader = view.$(rows[2]).find('td.conws-team-table-cell-roles');
            expect(leader.length).toEqual(1);
            expect(leader.find('span.conws-roles-text-truncate').text()).toEqual('Site Leader');
            expect(manager.find('.role-name-icon-cell span').css('background-image')).toEqual('');
            expect(leader.find('span.teamlead').text()).toEqual('Team lead');
            expect(leader.find('span.inherited').text()).toEqual('');
            var staff = view.$(rows[4]).find('td.conws-team-table-cell-roles');
            expect(staff.length).toEqual(1);
            expect(staff.find('span.conws-roles-text-truncate').text()).toEqual('Staff');
            expect(manager.find('.role-name-icon-cell span').css('background-image')).toEqual('');
            expect(staff.find('span.teamlead').text()).toEqual('');
            expect(staff.find('span.inherited').text()).toEqual('');
          });
        });

        xit('Participants cell renders correctly depending on the provided properties', function (done) {
          TestManager.createRoles([
            {id: 101, name: 'Manager', leader: false, inherited_from_id: 815},
            {id: 102, name: 'Site Leader', leader: true},
            {id: 103, name: 'Staff', leader: false}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'cbronson', display_name: 'cbronson'},
            {id: 3, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Manager', ['bspencer']);
          TestManager.addMembers('Staff', ['bspencer', 'cbronson', 'lfunes']);
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
          TestUtil.run(done,function () {
            var rows = view.$('#rolesview tbody > tr');
            expect(rows.length).toEqual(3);
            var manager = view.$(rows[0]).find('td.team-table-cell-participants');
            expect(manager.length).toEqual(1);
            expect(manager.find('span').text()).toEqual('Bud Spencer');
            expect(manager.find('span')[0].className).toEqual('name');
            var leader = view.$(rows[1]).find('td.team-table-cell-participants');
            expect(leader.length).toEqual(1);
            expect(leader.find('span').text()).toEqual('No participants');
            expect(leader.find('span')[0].className).toEqual('name warning');
            var staff = view.$(rows[2]).find('td.team-table-cell-participants');
            expect(staff.length).toEqual(1);
            expect(staff.find('span').text()).toEqual('Bud Spencer +2');
            expect(staff.find('span')[0].className).toEqual('name');
          });
        });
      });
    });
  });
});
