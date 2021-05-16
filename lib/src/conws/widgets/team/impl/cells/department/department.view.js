/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/url',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/participants.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (Url, TemplatedCellView, cellViewRegistry, ParticipantsTableColumnCollection, lang, template) {

  var DepartmentCellView = TemplatedCellView.extend({

        className: 'csui-truncate',

        constructor: function AvatarCellView() {
          TemplatedCellView.apply(this, arguments);
          this.listenTo(this.model, 'change', this.render);
        },

        getValueData: function () {
          var value = this.model.displayDepartment();
          return {
            value: value,
            formattedValue: value
          };
        }
      },
      {
        columnClassName: 'team-table-cell-department'
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.department, DepartmentCellView);

  return DepartmentCellView;
});

