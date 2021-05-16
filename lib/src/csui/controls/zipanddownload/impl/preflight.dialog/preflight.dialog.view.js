/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/dialog/dialog.view',
      'csui/controls/tile/behaviors/perfect.scrolling.behavior',
      'csui/controls/zipanddownload/impl/dialog.header/dialog.header.view',
      'i18n!csui/controls/zipanddownload/impl/nls/lang',
      'hbs!csui/controls/zipanddownload/impl/preflight.dialog/impl/preflight.dialog',
      'css!csui/controls/zipanddownload/impl/preflight.dialog/impl/preflight.dialog'
    ],
    function (DialogView, PerfectScrollingBehavior,
      DialogHeaderView, lang, template) {
      var PreflightDialogView = DialogView.extend({        
        className: 'csui-zipanddownload-dialog csui-zipanddownload-preflight-dialog csui-preflight-check',
        template: template,
        templateHelpers: function () {
          var jobs = {};
          if (this.options.model.get("results") && this.options.model.get("results").data &&
              this.options.model.get("results").data.jobs) {
            jobs = this.options.model.get("results").data.jobs;            
          }          
          return {
            itemsExcludedMessage: lang.itemsExcludedMessage,
            skipped: jobs.total_skipped,
            skippedTypes: jobs.skipped_types.map(function(type) {
              return type.name;
            }).join(", ")           
          };
        },
        behaviors: {
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.csui-preflight-table-body',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        },
        constructor: function PreflightDialogView(options) {          
          DialogView.prototype.constructor.call(this, options);
        },
        _renderHeader: function () {                      
          this.getRegion('header').show(new DialogHeaderView({
            title: lang.preflightDialogTitle            
          }));          
        }
      });
      return PreflightDialogView;
    }
);