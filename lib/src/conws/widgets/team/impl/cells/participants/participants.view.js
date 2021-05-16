/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/roles.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/cells/participants/impl/participants',
  'css!conws/widgets/team/impl/cells/participants/impl/participants'
], function (TemplatedCellView, cellViewRegistry, RolesTableColumnCollection, lang, template) {

  var ParticipantsCellView = TemplatedCellView.extend({

        className: 'csui-truncate',
        template: template,

        getValueData: function () {
          var valueClass = 'name';
          var value = this.model.displayMembers();
          if (!value) {
            value = lang.rolesParticipantsColNoParticipants;
            valueClass = 'name warning';
          }
          return {
            value: value,
            formattedValue: value,
            valueClass: valueClass
          };
        }
      },
      {
        hasFixedWidth: false,
        columnClassName: 'team-table-cell-participants'
      }
  );
  cellViewRegistry.registerByColumnKey(RolesTableColumnCollection.columnNames.members,
      ParticipantsCellView);

  return ParticipantsCellView;
});

