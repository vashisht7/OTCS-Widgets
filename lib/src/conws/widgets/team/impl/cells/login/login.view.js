/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'conws/widgets/team/impl/participants.columns',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (TemplatedCellView, cellViewRegistry, ParticipantsTableColumnCollection, lang) {

  var LoginCellView = TemplatedCellView.extend({

        className: 'csui-truncate',

        getValueData: function () {
          var value = this.model.displayLogin();
          return {
            value: value,
            formattedValue: value
          };
        }
      }
  );

  cellViewRegistry.registerByColumnKey(ParticipantsTableColumnCollection.columnNames.login, LoginCellView);

  return LoginCellView;
});

