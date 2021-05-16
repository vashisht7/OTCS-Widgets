/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/table/rows/description/description.view'
], function (_, $, Marionette, base, DescriptionView) {

  var SearchDescriptionView = DescriptionView.extend({

    templateHelpers: function () {
      var description = '',
          modded      = '',
          summaryModded= '',
          title = '',
          summaryTitle = '',
          originalDescription = '',
          originalSummary = '',
          summary ='',
          selectedSettings = this.options && this.options.tableView && this.options.tableView.selectedSettings,
          summary_description = false;

      switch (selectedSettings) {
        case 'SD' : {
          description = this.model.get("description");
          summary = this.model.get("summary");
          summary_description = true;
          break;
        }
        case 'SO' : {
          description = this.model.get("summary");
          break;
        }
        case 'SP' : {
          description = this.model.get("summary")
              || this.model.get("description");
          break;
        }
        case 'DP' : {
          description = this.model.get("description")
              || this.model.get("summary");
          break;
        }
        case 'DO' : {
          description = this.model.get("description");
          break;
        }
        case 'NONE':
          break;
        default : {
          description = '';
        }
      }
      if (description && description.length > 0) {
        description = description.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        originalDescription = description;
        var hhRegEx = /&lt;HH&gt;/gi;
        var hhEndRegEx = /&lt;\/HH&gt;/gi;
        modded = description.replace(hhRegEx, '<span class="csui-summary-hh">');
        modded = modded.replace(hhEndRegEx, '</span>');
        title = originalDescription.replace(hhRegEx, '');
        title = title.replace(hhEndRegEx, '');
      }
      if (summary_description && summary && summary.length > 0) {
        summary = summary.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        originalSummary = summary;
        var hhRegExSum = /&lt;HH&gt;/gi;
        var hhEndRegExSum = /&lt;\/HH&gt;/gi;
        summaryModded = summary.replace(hhRegExSum, '<span class="csui-summary-hh">');
        summaryModded = summaryModded.replace(hhEndRegExSum, '</span>');
        summaryTitle = originalSummary.replace(hhRegExSum, '');
        summaryTitle = summaryTitle.replace(hhEndRegExSum, '');
      }
      return _.extend(DescriptionView.prototype.templateHelpers.apply(this), {
        complete_description: title,
        current_description: modded,
        complete_summary: summaryTitle,
        current_summary: summaryModded,
        search_description: true,
        search_summary: true,
        summary_description_available: summary_description && summary,
        descriptionAvailable : description
      });
    }
  });

  return SearchDescriptionView;
});
