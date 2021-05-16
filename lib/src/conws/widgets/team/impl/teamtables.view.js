/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/utils/commands',
  'conws/utils/commands/addparticipant',
  'conws/widgets/team/impl/commands/exportparticipants',
  'conws/utils/commands/showroles',
  'conws/utils/commands/removeparticipant',
  'conws/widgets/team/impl/commands/exportroles',
  'conws/utils/commands/showdetails',
  'conws/utils/commands/deleterole',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/table/table.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/participants.toolbaritems',
  'conws/widgets/team/impl/roles.model.factory',
  'conws/widgets/team/impl/roles.columns',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/roles.toolbaritems',
  'conws/widgets/team/impl/dialogs/participants/roles.edit.view',
  'conws/widgets/team/impl/dialogs/role/role.details.view',
  'conws/widgets/team/impl/team.tablinks.view',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/teamtables',
  'css!conws/widgets/team/impl/team',
  'conws/widgets/team/impl/cells/avatar/avatar.view',
  'conws/widgets/team/impl/cells/name/name.view',
  'conws/widgets/team/impl/cells/roles/roles.view',
  'conws/widgets/team/impl/cells/login/login.view',
  'conws/widgets/team/impl/cells/email/email.view',
  'conws/widgets/team/impl/cells/department/department.view',
  'conws/widgets/team/impl/cells/rolename/rolename.view',
  'conws/widgets/team/impl/cells/participants/participants.view'
], function ($, _, Marionette, ConnectorFactory, commands, AddParticipantCommand,
    ExportParticipantsCommand, ShowRolesCommand, RemoveParticipantCommand, ExportRolesCommand,
    ShowDetailsCommand, DeleteRoleCommand, ModalAlert, TableToolbarView, TableView,
    LayoutViewEventsPropagationMixin, ParticipantsCollectionFactory,
    ParticipantsTableColumnCollection, participantToolbarItems, RolesCollectionFactory,
    RolesTableColumnCollection, WorkspaceContextFactory, roleToolbarItems, ParticipantsView,
    RolesView, TeamTabView, ModalDialogView, lang, template) {

  var TeamTablesView = Marionette.LayoutView.extend({

    template: template,
    dirty: false,

    events: {
      'shown.binf.tab .binf-nav-tabs a': 'onShownTab'
    },

    regions: {
      tabParticipantsRegion: '#tabParticipants',
      tabRolesRegion: '#tabRoles',
      participantsToolbarRegion: '#participantstoolbar',
      participantsRegion: '#participantsview',
      rolesToolbarRegion: '#rolestoolbar',
      rolesRegion: '#rolesview'
    },

    constructor: function TeamTablesView(options) {
      if (options === undefined || !options.context) {
        throw new Error('Context is missing in the constructor options');
      }
      this.context = options.context;

      if (!_.isUndefined(options.collapsedView)) {
        this.collapsedView = options.collapsedView;
      }
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(ParticipantsCollectionFactory);
        options.workspaceContext.setWorkspaceSpecific(RolesCollectionFactory);
      }
      this.workspaceContext = options.workspaceContext;
      this.participantCollection = options.workspaceContext.getCollection(
          ParticipantsCollectionFactory);
      this.roleCollection = options.workspaceContext.getCollection(RolesCollectionFactory);
      this.participantCollection.newParticipants = [];
      _.each(this.participantCollection.where({isNew: true}), function (part) {
        part.unset('isNew')
      });
      if (options.filterBy && options.filterBy.name.length > 0) {
        this.participantCollection.setFilter({conws_participantname: options.filterBy.name});
        this.roleCollection.setFilter({conws_rolename: options.filterBy.name});
      } else {
        this.participantCollection.filters =  {};
        this.participantCollection.orderBy =  ParticipantsTableColumnCollection.columnNames.name + ' asc';
        this.roleCollection.filters =  {};
        this.roleCollection.orderBy =  RolesTableColumnCollection.columnNames.name + ' asc';
      }
      this.listenTo(this.participantCollection, 'saved', this.onParticipantsChanged);
      this.listenTo(this.roleCollection, 'saved', this.onChanged);
      this.dirty = false;

      options.data || (options.data = {});
      Marionette.LayoutView.prototype.constructor.call(this, arguments);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var self = this;
      this.tabParticipantsRegion.show(new TeamTabView(_.defaults({
        initialActivationWeight: 202
      },this.options), {
        attributes: {aria: 'participants', 'aria-controls': 'participantstab', href: '#participantstab'}
      }));
      this.tabRolesRegion.show(new TeamTabView(_.defaults({
        initialActivationWeight: 201
      },this.options), {
        attributes: {aria: 'roles', 'aria-controls': 'rolestab', href: '#rolestab'}
      }));

      if (this.participantCollection.fetched) {
        this.participantCollection.fetch({reload: true});
      }
      if (this.roleCollection.fetched) {
        this.roleCollection.fetch({reload: true});
      }

      this.participantCollection.once('sync', function () {
        self.tabParticipantsRegion.currentView.$el.trigger('click');
      }).fetch();
      this.roleCollection.once('sync', function () {
        self.renderRolesAfterFetch();
      }).fetch();
    },

    renderParticipantsAfterFetch: function () {
      if (!this.participantsToolbarView) {
        var cmd = commands.get(AddParticipantCommand.prototype.defaults.signature)
        if (cmd) {
          cmd.roles = this.participantCollection.availableRoles;
        } else {
          commands.add(new AddParticipantCommand({
            roles: this.participantCollection.availableRoles
          }));
          commands.add(new ExportParticipantsCommand());
          commands.add(_.extend(new ShowRolesCommand(), {
            execute: this.onShowRoles
          }));
          commands.add(new RemoveParticipantCommand());
        }

        this.participantsToolbarView = new TableToolbarView({
          originatingView: this,
          toolbarItems: participantToolbarItems,
          collection: this.participantCollection
        });
      }
      if (!this.participantsTableView) {
        var colsWithSearch = _.rest(ParticipantsTableColumnCollection.getColumnKeys(), 1);
        this.participantsTableView = new TableView({
          context: this.workspaceContext,
          connector: this.context.getObject(ConnectorFactory),
          collection: this.participantCollection,
          columns: this.participantCollection.columns,
          filterBy: this.participantCollection.filters,
          tableColumns: ParticipantsTableColumnCollection,
          selectColumn: true,
          enableSorting: true,
          orderBy: ParticipantsTableColumnCollection.columnNames.name + ' asc',
          nameEdit: false,
          haveDetailsRowExpandCollapseColumn: true,
          columnsWithSearch: colsWithSearch,
          tableTexts: {
            zeroRecords: lang.zeroRecordsOrFilteredParticipants
          }
        });
        this.listenTo(this.participantsTableView, 'tableRowSelected',
            this.updateParticipantsToolItems);
        this.listenTo(this.participantsTableView, 'tableRowUnselected',
            this.updateParticipantsToolItems);
        this.listenTo(this.participantsTableView, 'tableRowRendered', function(row) {
          $(row.target).attr("conws-participant-row-id",row.node.get("id"));
        });
        if (!_.isUndefined(this.participantsTableView.accFocusedState.body.column)) {
          this.participantsTableView.accFocusedState.body.column = 3;
        }
      }
      this.participantsToolbarRegion.show(this.participantsToolbarView);
      this.participantsRegion.show(this.participantsTableView);
    },

    renderRolesAfterFetch: function () {
      if (!this.rolesToolbarView) {
        commands.add(new ExportRolesCommand());
        commands.add(_.extend(new ShowDetailsCommand(), {
          execute: this.onShowDetails
        }));
        commands.add(new DeleteRoleCommand());

        this.rolesToolbarView = new TableToolbarView({
          originatingView: this,
          toolbarItems: roleToolbarItems,
          collection: this.roleCollection
        });
      }
      if (!this.rolesTableView) {
        var colsWithSearch = _.rest(RolesTableColumnCollection.getColumnKeys(), 1);
        this.rolesTableView = new TableView({
          context: this.workspaceContext,
          connector: this.context.getObject(ConnectorFactory),
          collection: this.roleCollection,
          columns: this.roleCollection.columns,
          filterBy: this.roleCollection.filters,
          tableColumns: RolesTableColumnCollection,
          selectColumn: true,
          enableSorting: true,
          orderBy: RolesTableColumnCollection.columnNames.name + ' asc',
          nameEdit: false,
          haveDetailsRowExpandCollapseColumn: true,
          columnsWithSearch: colsWithSearch,
          tableTexts: {
            zeroRecords: lang.zeroRecordsOrFilteredRoles
          }
        });
        this.listenTo(this.rolesTableView, 'tableRowSelected', this.updateRolesToolItems);
        this.listenTo(this.rolesTableView, 'tableRowUnselected', this.updateRolesToolItems);
        if (!_.isUndefined(this.rolesTableView.accFocusedState.body.column)) {
          this.rolesTableView.accFocusedState.body.column = 2;
        }
      }
      this.rolesToolbarRegion.show(this.rolesToolbarView);
      this.rolesRegion.show(this.rolesTableView);
    },

    onShowRoles: function (status, options) {
      this.editor = new ModalDialogView({
        body: new ParticipantsView({
          model: status.nodes.models[0],
          roleCollection: status.originatingView.roleCollection,
          participantCollection: status.originatingView.participantCollection
        }),
        modalClassName: 'conws-roles-edit'
      });
      this.editor.show();
      return [];
    },

    onShowDetails: function (status, options) {
      this.editor = new ModalDialogView({
        body: new RolesView({
          model: status.nodes.models[0],
          roleCollection: status.originatingView.roleCollection,
          participantCollection: status.originatingView.participantCollection
        }),
        modalClassName: 'conws-role-details'
      });
      this.editor.show();
      return [];
    },

    updateParticipantsToolItems: function () {
      this.participantsToolbarView.updateForSelectedChildren(
          this.participantsTableView.getSelectedChildren());
    },

    participantsTableDomRefresh: function () {
      this.participantsToolbarView.updateForSelectedChildren(
          this.participantsTableView.getSelectedChildren());
      this.participantsTableView.triggerMethod(
          'dom:refresh', this.participantsTableView);
    },

    updateRolesToolItems: function () {
      this.rolesToolbarView.updateForSelectedChildren(
          this.rolesTableView.getSelectedChildren());
    },

    rolesTableDomRefresh: function () {
      this.rolesToolbarView.updateForSelectedChildren(
          this.rolesTableView.getSelectedChildren());
      this.rolesTableView.triggerMethod(
          'dom:refresh', this.rolesTableView);
    },

    onShownTab: function (e) {
      var hash = e.target.hash;
      switch (hash) {
      case '#participantstab':
        this.renderParticipantsAfterFetch();
        this.participantsTableDomRefresh();
        break;
      case '#rolestab':
        this.renderRolesAfterFetch();
        this.rolesTableDomRefresh();
        break;
      }
    },

    onParticipantsChanged: function () {
      var self = this;
      this.dirty = true;

      self.participantCollection.fetch({
        reload: true,
        success: function () {
          self.participantCollection.setNewParticipant();
          self.updateParticipantsToolItems();
        }
      });
      self.roleCollection.fetch({reload: true});
      this.updateRolesToolItems();
    },
    onChanged: function () {
      this.dirty = true;
      this.updateParticipantsToolItems();
      this.updateRolesToolItems();
    },
    onDestroy: function () {
      if (this.rolesEditor) {
        this.rolesEditor.close();
        this.rolesEditor = undefined;
      }
      if (this.detailsEditor) {
        this.detailsEditor.close();
        this.detailsEditor = undefined;
      }
      if (this.dirty && !_.isUndefined(this.collapsedView)) {
        this.collapsedView.triggerMethod('refresh:list');
      }
      return true;
    }

  });
  _.extend(TeamTablesView.prototype, LayoutViewEventsPropagationMixin);

  return TeamTablesView;
});
