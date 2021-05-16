/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/teamtables.view',
  'csui/controls/dialog/dialog.view',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js',
  'csui/utils/log'
], function ($, PageContext, TeamCollectionFactory, TeamTablesView,
             ModalDialogView,
             TestUtil, TestManager, log) {
  describe('Team Tables Expanded', function () {

    var id;

    beforeEach(function () {
      TestManager.reset();
      TestManager.init(id);
      TestManager.prepare(id);
    });

    describe('view creation', function () {

      id = 4711;

      it('succeeds without configuration', function () {

        var view = new TeamTablesView({
          context: TestManager.context,
          collection: {}
        });
        expect(TestManager.context).toBeDefined();
        expect(view.options).toBeDefined();
        expect(view.context).toBeDefined();
        expect(view.context).toBe(TestManager.context);

      });
    });

    describe('view renders', function () {

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
          className: 'conws-team',
          largeSize: true
        });
        dialog.show();

        return deferred.promise();
      }

      beforeEach(function () {
      });

      afterEach(function () {
        if (dialog) {
          dialog.destroy();
          dialog = undefined;
        }
        $('.cs-dialog.binf-modal').remove();
      });

      xit('a placeholder information for an empty team.', function (done) {
        TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
        TestUtil.run(done,function () {
          expect(view.participantCollection.length).toEqual(0);
          expect(view.participantCollection.length).toEqual(0);
          var div = view.$('.conws-teamtables');
          expect(div.length).toEqual(1);
          var participants = view.$('#participantsview', div);
          expect(participants.length).toEqual(1);
          var dataTable = view.$('#participantsview .dataTable');
          expect(dataTable.length).toEqual(1);

          var participantRows = view.$('#participantsview .csui-saved-item', dataTable);
          expect(participantRows.length).toEqual(0);
          var roles = view.$('#rolesview', div);
          expect(roles.length).toEqual(1);

          var rolesRows = view.$('#rolesview .csui-saved-item', dataTable);
          expect(rolesRows.length).toEqual(0);
        });
      });

      xit('a team with just one empty role.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true}
        ]);
        TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");

        TestUtil.waitFor(done,function () {
          return view.$('.conws-teamtables').length > 0;
        }, 'table items to be displayed ', 100);
        TestUtil.run(done,function () {
          expect(view.participantCollection.length).toEqual(0);
          var div = view.$('.conws-teamtables');
          expect(div.length).toEqual(1);
          var participants = view.$('#participantsview', div);
          expect(participants.length).toEqual(1);
          var dataTable = view.$('#participantsview .dataTable');
          expect(dataTable.length).toEqual(1);

          var participantsRows = view.$('#participantsview .csui-saved-item', dataTable);
          expect(participantsRows.length).toEqual(0);
          var roles = view.$('#rolesview', div);
          expect(roles.length).toEqual(1);

          var rolesRows = view.$('#rolesview .csui-saved-item', dataTable);
          expect(rolesRows.length).toEqual(1);
        });
      });

      xit('a team with just one role and one member.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true}
        ]);

        TestManager.createMembers([
          {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
        ]);
        TestManager.addMembers('Staff', ['bspencer']);
        TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
        TestUtil.run(done,function () {
          function expects(text, act) {
            return {
              toEqual: function (exp) {
                if (act !== exp) {
                  expect(text).toEqual(exp + "' but is '" + act);
                }
              }
            };
          }
          expects("models count", view.participantCollection.length).toEqual(1);
          var div = view.$('.conws-teamtables');
          expects("teamtables view length", div.length).toEqual(1);
          var participants = view.$('#participantsview');
          expects("participants length", participants.length).toEqual(1);

          var dataTable = view.$('#participantsview .dataTable');
          expects("data table length", dataTable.length).toEqual(1);

          var tbody = (view.$('#participantsview tbody > tr:not(".csui-details-row")', dataTable));
          expects("participantsview body length", tbody.length).toEqual(1);
        });
      });

      xit('a team with two roles, one with one and one with two members.', function (done) {
        TestManager.createRoles([
          {id: 101, name: 'Staff', leader: true},
          {id: 102, name: 'Support', leader: false}
        ]);

        TestManager.createMembers([
          {
            id: 1,
            type: 0,
            name: 'bspencer',
            display_name: 'Bud Spencer',
            business_email: 'bSpencer@opentext.net'
          },
          {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
        ]);
        TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
        TestManager.addMembers('Support', ['bspencer']);
        TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
        TestUtil.run(done,function () {
          expect(view.participantCollection.length).toEqual(2);
          var div = view.$('.conws-teamtables');
          expect(div.length).toEqual(1);
          var participants = view.$('#participantsview');
          expect(participants.length).toEqual(1);

          var dataTable = view.$('#participantsview .dataTable');
          expect(dataTable.length).toEqual(1);
          expect(view.$('#participantsview tbody > tr:not(".csui-details-row")',
              dataTable).length).toEqual(2);

          var members = view.$('#participantsview tbody > tr:not(".csui-details-row")',
               dataTable);
          expect(view.$('.conws-roles-btn', members).length).toEqual(2);
          var emails = view.$('td[data-csui-attribute="conws_participantemail"]', members);
          expect(emails.length).toEqual(2);
          expect(view.$(emails[0]).text().trim()).toEqual('bSpencer@opentext.net');
          expect(view.$(emails[1]).text().trim()).toEqual('');
          var buttons = view.$('.conws-roles-truncatebox', members);
          expect(buttons.length).toEqual(2);
          expect(buttons.children().length).toEqual(4);
          expect(view.$(buttons[0]).text().trim()).toEqual('Staff\xa0+1');
          expect(view.$(buttons[1]).text().trim()).toEqual('Staff');
          var icons = view.$('.conws-icon-roles-edit', members);
          expect(icons.length).toEqual(2);
        });
      });
    });
  });
});
