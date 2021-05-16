/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/cell.registry',
  'csui/controls/table/cells/templated/templated.view',
  'workflow/controls/usercards/usercards.list.view',
  'workflow/models/wfstatus/usercard.model',
  'workflow/utils/workitem.util',
  'hbs!workflow/controls/table/cells/impl/assignee',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/controls/table/cells/impl/assignee'
], function ($, _, Backbone, Marionette, cellViewRegistry, TemplatedCellView, UsercardsLayoutView,
    UserCardModel, WorkItemUtil, Template, lang) {
  'use strict';

  var AssigneeCellView = TemplatedCellView.extend({

    template: Template,

    renderValue: function () {
      var data = this.getValueData(),
          html = data ? this.template(data) : '';
      this.$el.html(html);
    },

    getValueData: function () {
      var model         = this.model,
          column        = this.options.column,
          columnName    = column.name,
          assigneeName  = model.get(columnName),
          assigneeCount = model.get("assignee_count"),
          status        = model.get("status_key"),
          group         = model.get('assignedto');

      assigneeName = assigneeName.toString();

      if (model.get("steps_count") > 0) {
        if (status && assigneeCount > 0 && status !== WorkItemUtil.constants.WFSTATUS_COMPLETED) {

          assigneeCount = (group && (group.groupName === assigneeName)) ? assigneeCount :
            assigneeCount - 1;

        } else {
          assigneeCount = 0;
        }
      }
      else {
        if (status !== WorkItemUtil.constants.WFSTATUS_COMPLETED && status !== WorkItemUtil.constants.WFSTATUS_STOPPED) {
          assigneeName = lang.systemUserText;
        }

      }

      return {
        assigneeName: assigneeName,
        assigneeCount: assigneeCount
      };
    }
  });
  cellViewRegistry.registerByColumnKey('assignee', AssigneeCellView);

  return AssigneeCellView;
});