/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/underscore',
      'csui/controls/dialog/dialog.view', 'csui/utils/base', 'csui/utils/nodesprites',
      'csui/controls/tile/behaviors/perfect.scrolling.behavior',
      'csui/controls/zipanddownload/impl/dialog.header/dialog.header.view',
      'i18n!csui/controls/zipanddownload/impl/nls/lang', 'csui/models/node/node.model',
      'hbs!csui/controls/zipanddownload/impl/download.dialog/impl/download.dialog',
      'css!csui/controls/zipanddownload/impl/download.dialog/impl/download.dialog'
    ],
    function ($, Backbone, _, DialogView, base, NodeSprites, PerfectScrollingBehavior,
        DialogHeaderView, lang, NodeModel, template) {
      var DownloadDialogView = DialogView.extend({
        className: 'csui-zipanddownload-dialog csui-download-dialog',
        template: template,
        templateHelpers: function () {
          var jobs                 = this.options.model,
              unprocessedItemsSize = this.options.model.get("unprocessed_items_list") &&
                                     this.options.model.get("unprocessed_items_list").length;
          if (this.options.model.get("unprocessed_items_list")) {
            this.options.model.get("unprocessed_items_list").map(function (skippedModel) {
              skippedModel.mimeIcon = NodeSprites.findClassByNode(new NodeModel({
                id: skippedModel.id,
                container: skippedModel.container,
                mime_type: skippedModel.mimetype,
                type: skippedModel.subtype
              }));
            });
          }
          return {
            skipped: jobs.get("total_skipped"),
            skippedTypes: jobs.get("unprocessed_items_list"),
            supported: jobs.get("total_supported"),
            size: base.formatFriendlyFileSize(jobs.get("total_supported_size")),
            fileName: this.options.model.get('name'),
            zipFileName: lang.zipFileName,
            labelType: lang.labelType,
            labelName: lang.labelName,
            labelLocation: lang.labelLocation,
            labelMessage: lang.labelMessage,
            skippedItemsLabel: _.str.sformat(
                unprocessedItemsSize === 1 ? lang.skippedItemLabel : lang.skippedItemsLabel,
                unprocessedItemsSize)
          };
        },

        ui: _.extend(
            {
              fileName: 'input[name=download-name]',
              errorEl: '.csui-archive-name-error'
            }, DialogView.prototype.ui
        ),

        events: _.extend(
            {
              'keypress @ui.fileName': 'downloadArchive',
              'focusin @ui.fileName': 'onFocusInFileName'
            }, DialogView.prototype.events
        ),

        behaviors: {
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.csui-download-table-body',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        },
        constructor: function DownloadDialogView(options) {
          options || (options = {});
          DialogView.prototype.constructor.call(this, options);
        },

        onShown: function () {
          if (this.triggerMethod) {
            this.triggerMethod('dom:refresh');
            this.triggerMethod('after:show');
          }
          if (this.header.currentView && this.header.currentView.triggerMethod) {
            this.header.currentView.triggerMethod('dom:refresh');
            this.header.currentView.triggerMethod('after:show');
          }
          if (this.footerView && this.footerView.triggerMethod) {
            this.footerView.triggerMethod('dom:refresh');
            this.footerView.triggerMethod('after:show');
          }
          this.ui.fileName.trigger('focus');
        },

        _renderHeader: function () {
          var jobs = this.options.model;
          this.getRegion('header').show(new DialogHeaderView({
            title: lang.downloadDialogTitle,
            itemsCount: jobs.get("total"),
            size: jobs.get("total_size")
          }));
        },

        downloadArchive: function (e) {
          if (e.type === 'keypress' && e.keyCode === 13) {
            e.preventDefault();
            var downloadBtn = this.$el.find("#zipDownload").first();
            if (downloadBtn.length && !downloadBtn.is(':disabled')) {
              downloadBtn.trigger('click');
            }
          }
        },

        onFocusInFileName: function (event) {
          var currentInputElement    = $(event.target)[0],
              currentInputElementVal = currentInputElement.value,
              selEnd                 = !!currentInputElementVal ? currentInputElementVal.length : 0;

          if (currentInputElementVal.lastIndexOf('.') > 0 &&
              currentInputElementVal.lastIndexOf('.') < currentInputElementVal.length - 1) {
            selEnd = currentInputElementVal.lastIndexOf('.');
          }
          currentInputElement.selectionEnd = selEnd;
        }
      });
      return DownloadDialogView;
    }
);