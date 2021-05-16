/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/impl/teamtables.view',
  'conws/utils/commands/addparticipant',
  'conws/widgets/team/impl/commands/exportparticipants',
  'conws/utils/commands/showroles',
  'conws/utils/commands/removeparticipant',
  'conws/widgets/team/impl/commands/exportroles',
  'conws/utils/commands/showdetails',
  'conws/utils/commands/deleterole',
  'csui/controls/dialog/dialog.view',
  'conws/utils/test/testutil',
  './team.mock.testmanager.js',
  'csui/utils/log'
], function (_, $, Backbone, PageContext, TeamTablesView, AddParticipantCommand,
    ExportParticipantsCommand, ShowRolesCommand, RemoveParticipantCommand,
    ExportRolesCommand, ShowDetailsCommand, DeleteRoleCommand,
    ModalDialogView,
    TestUtil, TestManager, log) {

  describe('Team Tables Toolbars', function () {

    describe('Participants team tables toolbar and commands', function () {

      describe('Toolbar', function () {
        var id = 4711;
        var view;
        var dialog;

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

        it('is rendered correctly when the participants list is empty and no roles exist',
            function (done) {
              TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
              TestUtil.run(done,function () {
                var toolbar = view.$('#participantstoolbar');
                expect(toolbar.length).toEqual(1);
                var commands = toolbar.find('li');
                expect(commands.length).toEqual(0);
              });
            });

        it('is rendered correctly when the participants list is empty and a editable role is available.', function (done) {
          TestManager.createRolesWithActions([
            {props: {id: 101, name: 'Staff', leader: true}, actions: {'edit-role': {}}}
          ]);
          TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
          TestUtil.run(done,function () {
            var toolbar = view.$('#participantstoolbar');
            expect(toolbar.length).toEqual(1,"toolbar.length");
            var commands = toolbar.find('li');
            expect(commands.length).toEqual(1,"commands.length");
            var command = toolbar.find("a[title='Add participants']");
            expect(command.length).toEqual(1,"Add participants command");
            expect(command.find('>span').hasClass('binf-glyphicon-plus')).toBeTruthy("binf-glyphicon-plus");
          });
        });

        it('is rendered correctly when the participants list is empty and a editable inherited role is available.', function (done) {
          TestManager.createRolesWithActions([
            {
              props: {
                id: 101,
                name: 'Staff',
                leader: true,
                inherited_from_id: 4711
              },
              actions: {'edit-role': {}}
            }
          ]);
          TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
          TestUtil.run(done,function () {
            var toolbar = view.$('#participantstoolbar');
            expect(toolbar.length).toEqual(1);
            var commands = toolbar.find('li');
            expect(commands.length).toEqual(0);
          });
        });

        it('is rendered correctly when the participants list is empty and a non-editable role is available.', function (done) {
          TestManager.createRolesWithActions([
            {
              props: {
                id: 101,
                name: 'Staff',
                leader: true,
                inherited_from_id: null
              },
              actions: {}
            }
          ]);
          TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
          TestUtil.run(done,function () {
            var toolbar = view.$('#participantstoolbar');
            expect(toolbar.length).toEqual(1);
            var commands = toolbar.find('li');
            expect(commands.length).toEqual(0);
          });
        });

        xit('is rendered correctly when a single participant is selected', function (done) {
          TestManager.createRolesWithActions([
            {props: {id: 101, name: 'Staff', leader: true}, actions: {'edit-role': {}}}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
          ]);
          TestManager.addMembers('Staff', ['bspencer']);
          TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");
          TestUtil.run(done,function () {
            var rows = view.$('#participantsview tbody > tr > td.csui-table-cell-_select');
            view.$(rows[0]).trigger('click');
            var toolbar = view.$('#participantstoolbar');
            expect(toolbar.length).toEqual(1,"toolbar.length");
            var commands = toolbar.find('li:not(.binf-divider)');
            expect(commands.length).toEqual(4,"commands.length");
            var command = toolbar.find("a[title='Add participants']");
            expect(command.length).toEqual(1,"Add participants command");
            expect(command.find('>span').hasClass('binf-glyphicon-plus')).toBeTruthy("binf-glyphicon-plus");
            command = toolbar.find("a[title='Download list of participants']");
            expect(command.length).toEqual(1,"Export participants command");
            expect(command.find('>span').hasClass('binf-glyphicon-download')).toBeTruthy("binf-glyphicon-download");
            command = toolbar.find("a:contains('Show roles')");
            expect(command.length).toEqual(1,"Show roles command");
            command = toolbar.find("a:contains('Remove from team')");
            expect(command.length).toEqual(1,"Remove participants command");
          });
        });

        xit('is rendered correctly when multiple participants are selected', function (done) {
          TestManager.createRolesWithActions([
            {props: {id: 101, name: 'Staff', leader: true}, actions: {'edit-role': {}}}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
          TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");

          TestUtil.waitFor(done,function () {
            return view.$('#participantsview tbody > tr > td.csui-table-cell-_select').length > 0;
          }, 'table items to be displayed ', 100);
          TestUtil.run(done,function () {
            var rows = view.$('#participantsview tbody > tr > td.csui-table-cell-_select');
            view.$(rows[0]).trigger('click');
            view.$(rows[1]).trigger('click');

            TestUtil.waitFor(done, function () {
              return view.$('#participantstoolbar').length > 0;
            }, 'table items to be displayed ', 100);

            TestUtil.run(done,function () {
              var toolbar = view.$('#participantstoolbar');
              expect(toolbar.length).toEqual(1,"toolbar.length");
              var commands = toolbar.find('li:not(.binf-divider)');
              expect(commands.length).toEqual(3,"commands.length");
              var command = toolbar.find("a[title='Add participants']");
              expect(command.length).toEqual(1,"Add participants command");
              command = toolbar.find("a[title='Download list of participants']");
              expect(command.length).toEqual(1,"Export participants command");
              command = toolbar.find("a:contains('Remove from team')");
              expect(command.length).toEqual(1,"Remove participants command");
            });
          });
        });

        xit('is rendered correctly when permissions are insufficient', function (done) {
          TestManager.createRolesWithActions([
            {props: {id: 101, name: 'Manager', leader: true}, actions: {}},
            {props: {id: 102, name: 'Staff', leader: false}, actions: {'edit-role': {}}}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'},
            {id: 2, type: 0, name: 'lfunes', display_name: 'Louis De Funes'}
          ]);
          TestManager.addMembers('Manager', ['bspencer']);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
          TestUtil.awaitPromise(done,createAndShowTeamTables(),"participants table shown");

          TestUtil.waitFor(done,function () {
            return view.$('#participantsview tbody > tr > td.csui-table-cell-_select').length > 0;
          }, 'participantsview to be displayed ', 100);
          TestUtil.run(done,function (done) {
            var rows = view.$('#participantsview tbody > tr > td.csui-table-cell-_select');
            view.$(rows[0])().trigger('click');

            TestUtil.waitFor(done,function () {
              return view.$('#participantstoolbar').length > 0;
            }, 'table items to be displayed ', 100);

            TestUtil.run(done,function (done) {
              var toolbar = view.$('#participantstoolbar');
              expect(toolbar.length).toEqual(1,"toolbar.length");
              var commands = toolbar.find('li:not(.binf-divider)');
              expect(commands.length).toEqual(3,"commands.length");
              var command = toolbar.find("a[title='Add participants']");
              expect(command.length).toEqual(1,"Add participants command");
              command = toolbar.find("a[title='Download list of participants']");
              expect(command.length).toEqual(1,"Export participants command");
              command = toolbar.find("a:contains('Show roles')");
              expect(command.length).toEqual(1,"Show roles command");
              view.$(rows[1]).trigger('click');

              TestUtil.waitFor(done,function () {
                return view.$('#participantstoolbar li').length > 0;
              }, 'table items to be displayed ', 100);

              TestUtil.run(done,function (done) {
                commands = toolbar.find('li:not(.binf-divider)');
                expect(commands.length).toEqual(2,"2nd commands.length");
                command = toolbar.find("a[title='Add participants']");
                expect(command.length).toEqual(1,"2nd Add participants command");
                command = toolbar.find("a[title='Download list of participants']");
                expect(command.length).toEqual(1,"2nd Export participants command");
                view.$(rows[0]).trigger('click');

                TestUtil.waitFor(done,function () {
                  return view.$('#participantstoolbar li').length > 0;
                }, 'table items to be displayed ', 100);

                TestUtil.run(done,function () {
                  commands = toolbar.find('li:not(.binf-divider)');
                  expect(commands.length).toEqual(4,"3rd commands.length");
                  command = toolbar.find("a[title='Add participants']");
                  expect(command.length).toEqual(1,"3rd Add participants command");
                  command = toolbar.find("a[title='Download list of participants']");
                  expect(command.length).toEqual(1,"3rd Export participants command");
                  command = toolbar.find("a:contains('Show roles')");
                  expect(command.length).toEqual(1,"3rd Show roles command");
                  command = toolbar.find("a:contains('Remove from team')");
                  expect(command.length).toEqual(1,"3rd Remove participants command");
                });
              });
            });
          });
        });
      });

      describe('Commands', function () {
        var id = 4711;
        var view;

        beforeEach(function (done) {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.render();
          TestManager.createRolesWithActions([
            {
              props: {id: 101, name: 'Staff', leader: true},
              actions: {'edit-role': {}}
            },
            {
              props: {id: 102, name: 'Staff Council', leader: false},
              actions: {}
            },
            {
              props: {id: 103, name: 'Manager', leader: true, inherited_from_id: 4711},
              actions: {'edit-role': {}}
            }
          ]);
          TestManager.createMembers([
            {
              id: 1,
              type: 0,
              display_name: 'Bud Spencer',
              name: 'bspencer',
              first_name: 'Bud',
              last_name: 'Spencer',
              business_email: 'bspencer@elink.loc',
              group_name: 'Famous Actors'
            },
            {
              id: 2,
              type: 0,
              display_name: 'Louis De Funes',
              name: 'lfunes',
              first_name: 'Louis',
              last_name: 'De Funes',
              business_email: 'lfunes@elink.loc',
              group_name: 'Famous Actors'
            },
            {
              id: 3,
              type: 0,
              display_name: 'Marlon Brando',
              name: 'mbrando',
              first_name: 'Marlon',
              last_name: 'Brando',
              business_email: 'mbrando@elink.loc',
              group_name: 'Famous Actors'
            },
            {
              id: 4,
              type: 0,
              display_name: 'Robert De Niro',
              name: 'rdeniro',
              first_name: 'Robert',
              last_name: 'De Niro',
              business_email: 'rdeniro@elink.loc',
              group_name: 'Famous Actors'
            }
          ]);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
          TestManager.addMembers('Staff Council', ['mbrando']);
          TestManager.addMembers('Manager', ['rdeniro']);
          TestManager.waitAsync(done, [view.participantCollection.fetch()], 100);

        });

        afterEach(function () {
          $('.cs-dialog.binf-modal').remove();
        });

        it('ExportParticipants', function () {
          var command;
          var status;
          command = new ExportParticipantsCommand();
          expect(command.get('signature')).toEqual('ExportParticipants');
          expect(command.get('name')).toEqual('Download list of participants');
          expect(command.get('scope')).toEqual('multiple');
          status = {
            nodes: {
              length: 0,
              models: []
            }
          };
          expect(command.enabled(status)).toBeFalsy();
          status = {
            nodes: {
              length: 1,
              models: [view.participantCollection.models[0]]
            }
          };
          expect(command.enabled(status)).toBeTruthy();
          expect(command._export(status.nodes.models)).toEqual(
              '"Name";"Roles";"Login";"Business e-mail";"Department";\n' +
              '"Bud Spencer";"Staff ";"bspencer";"bspencer@elink.loc";"Famous Actors";\n');
          status = {
            nodes: {
              length: 2,
              models: [view.participantCollection.models[0], view.participantCollection.models[1]]
            }
          };
          expect(command.enabled(status)).toBeTruthy();
          expect(command._export(status.nodes.models)).toEqual(
              '"Name";"Roles";"Login";"Business e-mail";"Department";\n' +
              '"Bud Spencer";"Staff ";"bspencer";"bspencer@elink.loc";"Famous Actors";\n' +
              '"Louis De Funes";"Staff ";"lfunes";"lfunes@elink.loc";"Famous Actors";\n');
        });

        it('ShowRoles', function () {
          var command;
          var status;
          command = new ShowRolesCommand();
          expect(command.get('signature')).toEqual('ShowRoles');
          expect(command.get('name')).toEqual('Show roles');
          expect(command.get('scope')).toEqual('single');
          status = {
            nodes: {
              length: 0,
              models: []
            }
          };
          expect(command.enabled(status)).toBeFalsy();
          status = {
            nodes: {
              length: 1,
              models: [view.participantCollection.models[0]]
            }
          };
          expect(command.enabled(status)).toBeTruthy();
          expect(function () {
            command.execute(status, '');
          }).toThrow(new Error('The \'ShowRoles\' action must be handled by the caller.'));
          status = {
            nodes: {
              length: 2,
              models: [view.participantCollection.models[0], view.participantCollection.models[1]]
            }
          };
          expect(command.enabled(status)).toBeFalsy();
        });

        xit('RemoveParticipant', function (done) {
          var command;
          var status;
          command = new RemoveParticipantCommand();
          expect(command.get('signature')).toEqual('RemoveParticipant');
          expect(command.get('name')).toEqual('Remove from team');
          expect(command.get('scope')).toEqual('multiple');
          status = {
            nodes: {
              length: 0,
              models: []
            }
          };
          expect(command.enabled(status)).toBeFalsy();
          TestUtil.run(done,function (done) {
            status = {
              nodes: new Backbone.Collection([view.participantCollection.models[0]]),
              originatingView: view
            };
            view.dirty = false;

            expect(command.enabled(status)).toBeTruthy();
            command.execute(status, '');
            TestUtil.waitFor(done,function () {
              return $.find('.binf-modal-dialog .binf-modal-content').length > 0;
            }, 5000);

            TestUtil.run(done,function () {
              var dialog = $.find('.binf-modal-dialog');
              expect($(dialog).find('.title-text').text()).toEqual('Remove participant');
              expect($(dialog).find('.binf-modal-body').text()).toEqual(
                  'Removing participants from the team will also remove them from their roles.');
              var button = $(dialog).find('.binf-modal-footer .csui-yes')[0];
              button.trigger('click');
            });

          });
          TestUtil.waitFor(done,function () {
            var confirmed = ($.find('.binf-modal-dialog').length === 0);
            var deleted = (TestManager.deleteUrlCount === 1);
            var dirty = view.dirty; //check for the dirty flag
            return (confirmed && deleted && dirty);
          }, 1000);
          TestUtil.run(done,function (done) {
            status = {
              nodes: new Backbone.Collection([
                view.participantCollection.models[0],
                view.participantCollection.models[1]]),
              originatingView: view
            };
            view.dirty = false;

            expect(command.enabled(status)).toBeTruthy();
            command.execute(status, '');

            TestUtil.waitFor(done,function () {
              return $.find('.binf-modal-dialog .binf-modal-content').length > 0;
            }, 5000);

            TestUtil.run(done,function () {
              var dialog = $.find('.binf-modal-dialog');
              expect($(dialog).find('.title-text').text()).toEqual('Remove participants');
              expect($(dialog).find('.binf-modal-body').text()).toEqual(
                  'Removing participants from the team will also remove them from their roles.');
              $(dialog).find('.csui-yes')[0].trigger('click');
            });
          });


          TestUtil.run(done,function () {
            status = {
              nodes: new Backbone.Collection([view.participantCollection.models[2]]),
              originatingView: view
            };
            view.dirty = false;

            expect(command.enabled(status)).toBeFalsy();
            status = {
              nodes: new Backbone.Collection([view.participantCollection.models[3]]),
              originatingView: view
            };
            view.dirty = false;

            expect(command.enabled(status)).toBeFalsy();
          });
        });
      });
    });

    describe('Roles team tables toolbar and commands', function () {

      describe('Toolbar', function () {
        var id = 4711;
        var view;

        beforeEach(function () {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.render();
          var tabs = view.$el.find('.teamtables-tabs > ul > li');
          view.$(tabs[1]).trigger('click');
        });

        it('is rendered correctly when the roles list is empty', function (done) {
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
          TestUtil.run(done,function () {
            var toolbar = view.$('#rolestoolbar');
            expect(toolbar.length).toEqual(1);
            var commands = toolbar.find('li');
            expect(commands.length).toEqual(0);
          });
        });

        xit('is rendered correctly when a single role is selected', function (done) {
          TestManager.createRolesWithActions([
            {props: {id: 101, name: 'Staff', leader: true}, actions: {'delete-role': {}}}
          ]);
          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
          ]);
          TestManager.addMembers('Staff', ['bspencer']);
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
          TestUtil.run(done,function () {
            var rows = view.$('#rolesview tbody > tr > td.csui-table-cell-_select');
            view.$(rows[0]).trigger('click');
            var toolbar = view.$('#rolestoolbar');
            expect(toolbar.length).toEqual(1,"toolbar.length");
            var commands = toolbar.find('li:not(.binf-divider)');
            expect(commands.length).toEqual(3,"commands.length");
            var command = toolbar.find("a[title='Download list of roles']");
            expect(command.length).toEqual(1,"Export roles command");
            expect(command.find('>span').hasClass('binf-glyphicon-download')).toBeTruthy();
            command = toolbar.find("a:contains('Show details')");
            expect(command.length).toEqual(1,"Show details command");
            command = toolbar.find("a:contains('Delete')");
            expect(command.length).toEqual(1,"Delete roles command");
          });
        });

        xit('is rendered correctly when multiple roles are selected', function (done) {
          TestManager.createRolesWithActions([
            {props: {id: 102, name: 'Staff', leader: false}, actions: {'delete-role': {}}},
            {props: {id: 102, name: 'Staff Council', leader: false}, actions: {'delete-role': {}}}
          ]);

          TestManager.createMembers([
            {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
          ]);
          TestManager.addMembers('Staff', ['bspencer']);
          TestManager.addMembers('Staff Council', ['bspencer']);
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
          TestUtil.run(done,function () {
            var rows = view.$('#rolesview tbody > tr > td.csui-table-cell-_select');
            view.$(rows[0]).trigger('click');
            view.$(rows[1]).trigger('click');
            var toolbar = view.$('#rolestoolbar');
            expect(toolbar.length).toEqual(1,"toolbar.length");
            var commands = toolbar.find('li:not(.binf-divider)');
            expect(commands.length).toEqual(2,"commands.length");
            var command = toolbar.find("a[title='Download list of roles']");
            expect(command.length).toEqual(1,"Export roles command");
            expect(command.find('>span').hasClass('binf-glyphicon-download')).toBeTruthy();
            command = toolbar.find("a:contains('Delete')");
            expect(command.length).toEqual(1,"Delete roles command");
          });
        });

        xit('is rendered correctly when multiple roles are selected containing the leader role',
            function (done) {
              TestManager.createRolesWithActions([
                {props: {id: 101, name: 'Manager', leader: true}, actions: {'delete-role': {}}},
                {props: {id: 102, name: 'Staff', leader: false}, actions: {'delete-role': {}}}
              ]);

              TestManager.createMembers([
                {id: 1, type: 0, name: 'bspencer', display_name: 'Bud Spencer'}
              ]);
              TestManager.addMembers('Manager', ['bspencer']);
              TestManager.addMembers('Staff', ['bspencer']);
              TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
              TestUtil.run(done,function () {
                var rows = view.$('#rolesview tbody > tr > td.csui-table-cell-_select');
                view.$(rows[0]).trigger('click');
                view.$(rows[1]).trigger('click');
                var toolbar = view.$('#rolestoolbar');
                expect(toolbar.length).toEqual(1,"toolbar.length");
                var commands = toolbar.find('li');
                expect(commands.length).toEqual(1,"commands.length");
                var command = toolbar.find("a[title='Download list of roles']");
                expect(command.length).toEqual(1,"Export roles command");
                expect(command.find('>span').hasClass('binf-glyphicon-download')).toBeTruthy();
              });
            });
      });

      describe('Commands', function () {
        var id = 4711;
        var view;

        beforeEach(function (done) {
          TestManager.reset();
          TestManager.init(id);
          TestManager.prepare(id);
          view = new TeamTablesView({
            context: TestManager.context,
            collection: {}
          });
          view.render();
          TestManager.createRolesWithActions([
            {props: {id: 101, name: 'Manager', leader: true}, actions: {'delete-role': {}}},
            {props: {id: 102, name: 'Staff', leader: false}, actions: {'delete-role': {}}},
            {props: {id: 103, name: 'Staff Council', leader: false}, actions: {'delete-role': {}}},
            {props: {id: 104, name: 'Support', leader: false}, actions: {'delete-role': {}}}
          ]);
          TestManager.createMembers([
            {
              id: 1,
              type: 0,
              display_name: 'Bud Spencer',
              name: 'bspencer',
              first_name: 'Bud',
              last_name: 'Spencer',
              business_email: 'bspencer@elink.loc',
              group_name: 'Famous Actors'
            },
            {
              id: 2,
              type: 0,
              display_name: 'Louis De Funes',
              name: 'lfunes',
              first_name: 'Louis',
              last_name: 'De Funes',
              business_email: 'lfunes@elink.loc',
              group_name: 'Famous Actors'
            },
            {
              id: 3,
              type: 0,
              display_name: 'Heinz Erhardt',
              name: 'herhardt',
              first_name: 'Heinz',
              last_name: 'Erhardt',
              business_email: 'herhardt@elink.loc',
              group_name: 'Famous Actors'
            }
          ]);
          TestManager.addMembers('Manager', ['bspencer']);
          TestManager.addMembers('Staff', ['bspencer', 'lfunes']);
          TestManager.addMembers('Staff Council', ['herhardt']);
          TestManager.addMembers('Support', ['bspencer']);
          TestManager.waitAsync(done, [view.roleCollection.fetch()], 100);
        });

        afterEach(function () {
          $('.cs-dialog.binf-modal').remove();
        });

        it('ExportRoles', function () {
          var command;
          var status;
          command = new ExportRolesCommand();
          expect(command.get('signature')).toEqual('ExportRoles');
          expect(command.get('name')).toEqual('Download list of roles');
          expect(command.get('scope')).toEqual('multiple');
          status = {
            nodes: {
              length: 0,
              models: []
            }
          };
          expect(command.enabled(status)).toBeFalsy();
          status = {
            nodes: {
              length: 1,
              models: [view.roleCollection.models[0]]
            }
          };
          expect(command.enabled(status)).toBeTruthy();
          expect(command._export(status.nodes.models)).toEqual(
              '"Name";"Participants";\n' +
              '"Manager";"Bud Spencer";\n');
          status = {
            nodes: {
              length: 2,
              models: [view.roleCollection.models[0], view.roleCollection.models[1]]
            }
          };
          expect(command.enabled(status)).toBeTruthy();
          expect(command._export(status.nodes.models)).toEqual(
              '"Name";"Participants";\n' +
              '"Manager";"Bud Spencer";\n' +
              '"Staff";"Bud Spencer +1";\n');
        });

        it('ShowDetails', function () {
          var command;
          var status;
          command = new ShowDetailsCommand();
          expect(command.get('signature')).toEqual('ShowDetails');
          expect(command.get('name')).toEqual('Show details');
          expect(command.get('scope')).toEqual('single');
          status = {
            nodes: {
              length: 0,
              models: []
            }
          };
          expect(command.enabled(status)).toBeFalsy();
          status = {
            nodes: {
              length: 1,
              models: [view.roleCollection.models[0]]
            }
          };
          expect(command.enabled(status)).toBeTruthy();
          expect(function () {
            command.execute(status, '');
          }).toThrow(new Error('The \'ShowDetails\' action must be handled by the caller.'));
          status = {
            nodes: {
              length: 2,
              models: [view.roleCollection.models[0], view.roleCollection.models[1]]
            }
          };
          expect(command.enabled(status)).toBeFalsy();
        });

        xit('DeleteRole', function (done) {
          var command;
          var status;
          var stop_waiting;
          command = new DeleteRoleCommand();
          expect(command.get('signature')).toEqual('DeleteRoles');
          expect(command.get('name')).toEqual('Delete');
          expect(command.get('scope')).toEqual('multiple');
          status = {
            nodes: new Backbone.Collection(),
            originatingView: view
          };
          expect(command.enabled(status)).toBeFalsy();

          TestUtil.run(done,function () {
            status = {
              nodes: new Backbone.Collection([view.roleCollection.models[0]]),
              originatingView: view
            };
            expect(command.enabled(status)).toBeFalsy();
          });
          TestUtil.run(done,function () {
            status = {
              nodes: new Backbone.Collection([view.roleCollection.models[1]]),
              originatingView: view
            };
            view.dirty = false;

            expect(command.enabled(status)).toBeTruthy();
            command.execute(status, '')
          });

          TestUtil.waitFor(done,function () {
            return $.find('.binf-modal-dialog').length > 0;
          });
          TestUtil.run(done,function () {
            var dialog = $.find('.binf-modal-dialog');
            expect($(dialog).find('.title-text').text()).toEqual('Delete role');
            expect($(dialog).find('.binf-modal-body').text()).toEqual(
                'When you delete this role, 1 participant will be removed from the team.');
            $(dialog).find('.csui-yes')[0].trigger('click');
          });

          TestUtil.waitFor(done, function () {
            var confirmed = ($.find('.binf-modal-dialog').length === 0);
            var deleted = (TestManager.deleteUrlCount === 1);
            var dirty = view.dirty; //check for the dirty flag
            return (confirmed && deleted && dirty);
          }, 5000, "single role delete dialog to be closed and animation to end");
          stop_waiting = false;
          TestUtil.run(done,function() {
            setTimeout(function(){
              stop_waiting = true;
            },2000);
          });
          TestUtil.waitFor(done,function () {
            return stop_waiting;
          },2100, "end of single role delete waiting period");
          TestUtil.run(done,function () {
            status = {
              nodes: new Backbone.Collection([
                view.roleCollection.models[0],
                view.roleCollection.models[1]]),
              originatingView: view
            };
            view.dirty = false;
            TestManager.deleteUrlCount = 0;

            expect(command.enabled(status)).toBeFalsy();
            command.execute(status, '')
          });

          TestUtil.waitFor(done,function () {
            return $.find('.binf-modal-dialog').length > 0;
          });
          TestUtil.run(done,function () {
            var dialog = $.find('.binf-modal-dialog');
            expect($(dialog).find('.title-text').text()).toEqual('Delete roles');
            expect($(dialog).find('.binf-modal-body').text()).toEqual(
                'When you delete this role, 1 participant will be removed from the team.');
            $(dialog).find('.csui-yes')[0].trigger('click');
          });

          TestUtil.waitFor(done,function () {
            var confirmed = ($.find('.binf-modal-dialog').length === 0);
            var deleted = (TestManager.deleteUrlCount === 2);
            var dirty = view.dirty; //check for the dirty flag
            return (confirmed && deleted && dirty);
          }, 1000, "multiple role delete dialog to be closed");
          stop_waiting = false;
          TestUtil.run(done,function() {
            setTimeout(function(){
              stop_waiting = true;
            },2000);
          });
          TestUtil.waitFor(done,function () {
            return stop_waiting;
          },2100, "end of multi role delete waiting period");

          TestUtil.run(done,function () {
            var model = view.roleCollection.models[0];
            model.collection.remove([
              model.collection.models[0],
              model.collection.models[1]]);
            status = {
              nodes: new Backbone.Collection([model]),
              originatingView: view
            };
            expect(command.enabled(status)).toBeTruthy();
          });
        });
      });
    });
  });
});
