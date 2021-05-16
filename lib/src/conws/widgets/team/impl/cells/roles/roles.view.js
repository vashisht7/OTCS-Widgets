/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/dialogs/modaldialog/modal.dialog.view',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/dialogs/participants/roles.edit.view',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/participants.model.factory',
  'conws/widgets/team/impl/roles.model.factory',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/roles/impl/roles',
  'css!conws/widgets/team/impl/cells/roles/impl/roles'
], function (_, $, TemplatedCellView, cellViewRegistry, ModalDialogView,
    ParticipantsTableColumnCollection, EditView, WorkspaceContextFactory,
    ParticipantsCollectionFactory, RolesCollectionFactory, lang, template) {

  var RolesCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        ui: {
          roleEdit: 'a.conws-roles-btn'
        },

        events: {
          'click @ui.roleEdit': 'roleEditClicked',
          'dragstart @ui.roleEdit': 'roleEditDrag',
          'keydown': 'onKeyDown'
        },

        onKeyDown: function (e) {
          switch (e.keyCode) {
          case 13:
          case 32:
            $(e.target).find(this.ui.roleEdit).trigger('click');
            break;
          }
        },

        getValueData: function () {
          var value = this.model.getLeadingRole();
          var indicator = this.model.getRolesIndicator();
          return {
            value: value,
            indicator: indicator,
            cannotEdit: !this.model.canEdit(),
            toolTip: lang.participantRrolesColTooltip
          };
        },

        roleEditClicked: function (event) {
          if (!this.options.workspaceContext) {
            this.options.workspaceContext = this.options.context.getObject(WorkspaceContextFactory);
            this.options.workspaceContext.setWorkspaceSpecific(ParticipantsCollectionFactory);
            this.options.workspaceContext.setWorkspaceSpecific(RolesCollectionFactory);
          }
          this.editor = new ModalDialogView({
            body: new EditView({
              model: this.model,
              roleCollection: this.options.workspaceContext.getCollection(RolesCollectionFactory),
              participantCollection: this.options.workspaceContext.getCollection(
                  ParticipantsCollectionFactory)
            }),
            modalClassName: 'conws-roles-edit'
          });

          this.editor.show();

          var setFocus = _.bind(function(){
            this.options.tableView.$el.find('[conws-participant-row-id="'+this.model.get("id")+'"] .conws-team-table-cell-roles').trigger('click');
          },this);
          this.editor.once('destroy',function() {
            setFocus();
          });
          this.editor.options.body.once('refetched',function() {
            setFocus();
          });
          event.preventDefault();
          event.stopPropagation();
        },
        roleEditDrag: function (event) {
          return false;
        },

        onDestroy: function () {
          if (this.editor) {
            this.editor = undefined;
          }
        }
      },
      {
        columnClassName: 'conws-team-table-cell-roles'
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.roles,
      RolesCellView);

  return RolesCellView;
});

