/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'conws/widgets/header/header.view',
  'conws/models/selectedmetadataform/selectedmetadataform.factory',
  'xecmpf/widgets/header/impl/completenesscheck/completenesscheck.view',
  'xecmpf/widgets/header/impl/displayUrl/displayUrl.view',
  'esoc/widgets/activityfeedwidget/activityfeedfactory',
  'esoc/widgets/activityfeedwidget/activityfeedcontent',
  'xecmpf/widgets/header/impl/metadata.view',
  'conws/controls/description/description.view',
  'css!xecmpf/widgets/header/impl/header'
], function (module, _, $, Marionette, Handlebars,
    ConwsHeaderView, MetadataFactory,
    CompletenessCheckView, DisplayUrlView,
    ActivityFeedFactory, ActivityFeedContent,
    MetadataView, DescriptionView) {
  var constants = {'activityfeedwidget': 'esoc/widgets/activityfeedwidget'};
  var moduleConfig = module.config();
  var HeaderView = ConwsHeaderView.extend({

    id: 'xecmpf-header',

    constructor: function HeaderView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.data.widget || (options.data.widget = {});
      options.data.widget.type || (options.data.widget.type = 'metadata');
      options.hideToolbar = !!moduleConfig.hideToolbar;
      options.hideActivityFeed = !!moduleConfig.hideActivityFeed;
      options.hideMetadata = !!moduleConfig.hideMetadata || !(options.data.metadataSettings &&
                                                              options.data.metadataSettings.metadata &&
                                                              !options.data.metadataSettings.hideMetadata);
      options.toolbarBlacklist = [];
      options.extensionToolbarBlacklist = [];
      options.delayedToolbarBlacklist = [];
      options.extensionToolbarDelayedActionsBlacklist = [];
      options.enableCollapse = !!moduleConfig.enableCollapse;

      var toolbarBlacklist = moduleConfig.toolbarBlacklist;
      if (Array.isArray(toolbarBlacklist) && toolbarBlacklist.length > 0) {
        options.toolbarBlacklist = toolbarBlacklist;
      }
      var delayedToolbarBlacklist = moduleConfig.delayedToolbarBlacklist;
      if (Array.isArray(delayedToolbarBlacklist) && delayedToolbarBlacklist.length > 0) {
        options.delayedToolbarBlacklist = delayedToolbarBlacklist;
      }
      var extensionToolbarBlacklist = moduleConfig.extensionToolbarBlacklist;
      if (Array.isArray(extensionToolbarBlacklist) && extensionToolbarBlacklist.length > 0) {
        options.extensionToolbarBlacklist = extensionToolbarBlacklist;
      }

      var extensionToolbarDelayedActionsBlacklist = moduleConfig.extensionToolbarDelayedActionsBlacklist;
      if (Array.isArray(extensionToolbarDelayedActionsBlacklist) &&
          extensionToolbarDelayedActionsBlacklist.length > 0) {
        options.extensionToolbarDelayedActionsBlacklist = extensionToolbarDelayedActionsBlacklist;
      }

      if (options.data && options.data.favoriteSettings &&
          options.data.favoriteSettings.hideFavorite) {
        if (!options.toolbarBlacklist['Favorite2']) {
          options.toolbarBlacklist.push('Favorite2');
        }
        if (!options.extensionToolbarBlacklist['Favorite2']) {
          options.extensionToolbarBlacklist.push('Favorite2');
        }
      }

      if (!options.extensionToolbarBlacklist['CompletenessCheck']) {
        options.extensionToolbarBlacklist.push('CompletenessCheck');
      }
      var cCConfig      = options.data.completenessCheckSettings,
          cCViewOptions = {
            context: options.context,
            workspaceContext: options.workspaceContext,
            hideMissingDocsCheck: cCConfig && cCConfig.hideMissingDocsCheck,
            hideOutdatedDocsCheck: cCConfig && cCConfig.hideOutdatedDocsCheck,
            hideInProcessDocsCheck: cCConfig && cCConfig.hideInProcessDocsCheck
          };

      options.cCViewOptions = cCViewOptions;
      options.statusIndicatorsView = CompletenessCheckView;
      options.statusIndicatorsViewOptions = _.extend(cCViewOptions, {originatingView: this});

      ConwsHeaderView.prototype.constructor.call(this, options);
      if (options.workspaceContext) {
        options.workspaceContext.setWorkspaceSpecific(MetadataFactory);
        options.workspaceContext.setWorkspaceSpecific(ActivityFeedFactory);
      }
    },

    initialize: function (options) {
      options || (options = {});
      if (options.data) {

        var headerwidgetConfigValue = options.data.headerwidget ? (options.data.headerwidget.type ?
                                                                   options.data.headerwidget.type :
                                                                   "metadata" ) : "metadata";
        this.headerwidgetConfigValue = headerwidgetConfigValue;

        if (headerwidgetConfigValue === 'metadata'
            && (options.data.widget.type === 'metadata') && !this.options.hideMetadata) {
          var mConfig = options.data.metadataSettings;
          var metadata = this._makeMetadataReadOnly(mConfig.metadata);
          var mViewOptions = {
            context: options.context,
            workspaceContext: options.workspaceContext,
            data: {
              hideEmptyFields: mConfig.hideEmptyFields,
              metadata: metadata,
              readonly: true,
              colOptions: options.data.metadataSettings.metadataInColumns
            }
          };
          this.metadataView = new MetadataView(mViewOptions);
          this.listenTo(this.metadataView, 'xecmpf:metadata:config', function () {
            if (this.metadataView.noDataFound) {
              this.$el.parent().addClass('xecmpf-metadata-configured-nodata').removeClass(
                  'xecmpf-metadata-configured');
            } else {
              this.$el.parent().addClass('xecmpf-metadata-configured').removeClass(
                  'xecmpf-metadata-configured-nodata');
            }
          });
        }
        if (this.headerwidgetConfigValue === 'activityfeed' && !this.options.hideActivityFeed) {
          options.data.widget.type = constants.activityfeedwidget;
          options.data.widget.options || (options.data.widget.options = {});
        }

        if (!moduleConfig.pageWidget) {
          var cCViewOptions = _.extend(options.cCViewOptions,
              {workspaceContext: options.workspaceContext});
          if (!cCViewOptions.hideMissingDocsCheck || !cCViewOptions.hideOutdatedDocsCheck ||
              !cCViewOptions.hideInProcessDocsCheck) {
            this.options.hasMetadataExtension = true;
            this.completenessCheckView = new CompletenessCheckView(cCViewOptions);
          }
        }

        var displayUrlViewOptions = {
          model: this.model,
          logging: {debug: false}
        };
        this.displayUrlView = new DisplayUrlView(displayUrlViewOptions);

        this.listenTo(this.completenessCheckView, 'completeness:check:available', function () {
          this.$el.parent().addClass('xecmpf-completenesscheck-available');
          options.expandDescription = false;
          if (!this.options.hideDescription && !this.hasEmptyDescription()) {
            var data = {
              view: this,
              complete_desc: this.resolveProperty('description'),
              expandDescription: options.expandDescription
            };
            this.descriptionView = new DescriptionView(data);
            this.descriptionRegion.show(this.descriptionView);
            this.$el.parent().addClass('conws-description-available');
            this.listenToDescriptionView();
          }
        });

       this.listenTo(this, 'render', function () {
          if (this.model.fetched) {
            this.showChildViews();
          }
        });
      }
    },

    ui: {
      completenessCheckRegion: '.conws-header-metadata-extension',
      metadataRegion: '#conws-header-childview',
      displayUrlRegion: '.conws-header-child-displayUrl'
    },

    _makeMetadataReadOnly: function (arr) {
      var metadata = arr || [];
      metadata.forEach(function (obj) {
        obj['readOnly'] = true;
      });
      return metadata;
    },

    showChildViews: function () {
      if (this.completenessCheckView) {
        this.completenessCheckRegion = new Marionette.Region({el: this.ui.completenessCheckRegion});
        this.completenessCheckRegion.show(this.completenessCheckView);
        this.listenToDescriptionView();
      }
      if (this.metadataView) {
        this.metadataRegion = new Marionette.Region({el: this.ui.metadataRegion});
        this.metadataRegion.show(this.metadataView);
      }
      if (this.displayUrlView) {
        this.displayUrlRegion = new Marionette.Region({el: this.ui.displayUrlRegion});
        this.displayUrlRegion.show(this.displayUrlView);
      }
      this.listenTo(this, 'completeness:check:available', function () {
        this.headerToolbarView.triggerMethod("status:indicator:available");
      });
    },

    listenToDescriptionView: function () {
      if (this.descriptionView) {
        this.listenTo(this.descriptionView, "show:more:description", function () {
          this.toggleCompletenessCheckView(false);
        });
        this.listenTo(this.descriptionView, "show:less:description", function () {
          this.toggleCompletenessCheckView(true);
        });
      }
    },

    toggleCompletenessCheckView: function (toggle) {
      if (toggle) {
        this.completenessCheckView.$el.removeClass("xecmpf-completenesscheck-hidden").addClass(
            "xecmpf-completenesscheck-shown");
      } else {
        this.completenessCheckView.$el.removeClass("xecmpf-completenesscheck-shown").addClass(
            "xecmpf-completenesscheck-hidden");
      }
    },

    hasChildView: function () {
      var isChildWidgetConfigured = (this.options.data && this.options.data.widget &&
                                     this.options.data.widget.type &&
                                     this.options.data.widget.type !== "none");
      if (this.headerwidgetConfigValue === 'activityfeed') {
        return !this.options.hideActivityFeed && isChildWidgetConfigured;
      } else if (this.headerwidgetConfigValue === 'metadata') {
        return !this.options.hideMetadata && isChildWidgetConfigured;
      }
    },

    onDomRefresh: function () {
      this.addActivityFeedClass();
      if (this.completenessCheckView) {
        this.toggleCompletenessCheckView(true);
      }

      if (!!this.descriptionView &&
          this.descriptionView.$el.find(this.descriptionView.ui.readMore).is(':hidden') &&
          this.descriptionView.$el.find(this.descriptionView.ui.showLess).is(':visible')) {
        this.descriptionView.ui.showLess.trigger("click");
        this.currentlyFocusedElement().trigger('focus');
      }

      this.isTabable() ? this.currentlyFocusedElement().attr("tabindex", "0") :
      this.currentlyFocusedElement().attr("tabindex", "-1");
      this._clampTexts();

      if (!this.options.hideToolbar) {
        this.headerToolbarView.triggerMethod('dom:refresh');
      }

    },

    onBeforeDestroy: function () {
      if (this.metadataView) {
        this.metadataView.destroy();
      }
      if (this.displayUrlView) {
        this.displayUrlView.destroy();
      }
    }
  });

  return HeaderView;
});