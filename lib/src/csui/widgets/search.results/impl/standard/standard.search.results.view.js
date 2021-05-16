/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/progressblocker/blocker',
  'csui/controls/table/cells/favorite/favorite.view',
  'csui/controls/checkbox/checkbox.view',
  'csui/controls/node.state/node.states.view',
  'csui/controls/node.state/node.state.icons',
  'csui/widgets/search.results/impl/metadata/search.metadata.view',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'csui/controls/tableactionbar/tableactionbar.view',
  'i18n', 'csui/models/node/node.model',
  'csui/utils/nodesprites', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/widgets/search.results/impl/breadcrumbs/search.breadcrumbs.view',
  'csui/models/nodeancestors',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/search.metadata.factory',
  'hbs!csui/widgets/search.results/impl/search.result',
  'hbs!csui/widgets/search.results/impl/search.empty',
  'csui/utils/node.links/node.links',
  'csui/utils/accessibility',
  'csui/utils/log',
  'csui/widgets/search.results/impl/standard/standard.search.results.header.view',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/search.results/impl/search.results',
  'csui/lib/jquery.mousehover',
  'csui/lib/jquery.redraw'
], function (module, _, $, Backbone, Marionette, base, BlockingView, FavoritesView, CheckboxView,
    NodeStateCollectionView, nodeStateIcons, SearchMetadataView, lang, TableActionBarView, i18n,
    NodeModel, NodeSpriteCollection, NodeTypeIconView, BreadcrumbsView, NodeAncestorCollection,
    DefaultActionBehavior, SearchMetadataFactory, itemTemplate, emptyTemplate, nodeLinks,
    Accessibility, log, StandardSearchResultsHeaderView) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var config = _.extend({
    enableFacetFilter: true, // LPAD-60082: Enable/disable facets
    enableBreadcrumb: true,
    enableSearchSettings: true, // global enable/disable search settings, but LPAD 81034 ctor can overrule
    showInlineActionBarOnHover: !accessibleTable,
    forceInlineActionBarOnClick: false,
    inlineActionBarStyle: "csui-table-actionbar-bubble"
  }, module.config());
  var SearchStaticUtils = {
    isAppleMobile: base.isAppleMobile(),
    mimeTypes: {},
    isRtl: i18n && i18n.settings.rtl
  };

  var NoSearchResultView = Marionette.ItemView.extend({

    className: 'csui-empty',
    template: emptyTemplate,

    constructor: function NoSearchResultView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }

  });
  var SearchResultItemView = Marionette.LayoutView.extend({

    className: function () {
      var classList = 'binf-list-group-item binf-col-lg-12 binf-col-md-12 binf-col-sm-12' +
                      ' binf-col-xs-12 ';
      classList += this.hasVersioned ? 'csui-search-result-version-item' : '';
      classList += !!this.hasPromoted ? ' csui-search-promoted-item' : '';
      return classList;
    },
    template: itemTemplate,

    regions: {
      favRegion: ".csui-search-item-fav",
      selectionRegion: ".csui-search-item-check",
      searchMetadataRegion: ".csui-search-item-details-wrapper",
      breadcrumbRegion: ".csui-search-item-breadcrumb",
      nodeStateRegion: ".csui-search-item-nodestateicon"
    },

    ui: {
      descriptionField: '.csui-overflow-description',
      summaryField: '.csui-overflow-summary',
      modifiedByField: '.csui-search-modified-by',
      metadataDetails: '.csui-search-item-details',
      inlineToolbarContainer: '.csui-search-toolbar-container',
      inlineToolbar: '.csui-search-item-row',
      arrowIcon: '.search-results-item-expand .icon'
    },

    events: {
      'click .csui-search-item-link': 'openSearchItem',
      'click .csui-search-version-label': 'openVersionHistory',
      'click .icon-expandArrowUp': 'showMetadataInfo',
      'click .icon-expandArrowDown': 'hideMetadataInfo'
    },

    templateHelpers: function () {
      var defaultActionController = this.options.defaultActionController,
          checkModelHasAction     = defaultActionController.hasAction.bind(defaultActionController),
          inActiveClass           = checkModelHasAction(this.model) ? '' :
                                    'csui-search-no-default-action',
          messages                = {
            created: lang.created,
            createdby: lang.createdBy,
            modified: lang.modified,
            owner: lang.owner,
            type: lang.type,
            items: lang.items,
            showMore: lang.showMore, // where does this show up
            showLess: lang.showLess,
            versionLabel: lang.versionLabel,
            versionSeparator: lang.versionSeparator,
            inactiveclass: inActiveClass,
            showBreadcrumb: config.enableBreadcrumb && this.model.collection.isLocationColumnAvailable
          },
          defaultActionUrl        = this.defaultActionUrl,
          promotedText            = this.promotedText;

      var retValue = {
        showOwner: this.model.attributes.hasOwnProperty('owner_user_id'), // LPAD-61022: hide owner, if not set in response
        messages: messages,
        defaultActionUrl: defaultActionUrl,
        has_promoted: this.hasPromoted,
        promoted_label: lang.promotedLabel,
        promoted_text: promotedText.replace(/,/g, ', '),
        has_version: this.hasVersioned,
        cid: this.cid,
        itemBreadcrumb: this.itemBreadcrumb,
        mimeTypeAria: this.mimeTypeAria
      };
      return retValue;
    },

    openSearchItem: function (event) {
      event.preventDefault();
      this.trigger("click:item", this.model);
    },

    constructor: function SearchResultItemView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.collection = options.collection;
      this.model.attributes.mime_type = !!this.model.attributes.mime_type ?
                                        this.model.attributes.mime_type :
                                        (this.model.attributes.versions ?
                                         this.model.attributes.versions.mime_type : "");
      this._hiddenMetadataElements = $();
      var mimType = this.model.attributes.mime_type;
      this.mimeTypeSearch = SearchStaticUtils.mimeTypes[mimType];

      if (!this.mimeTypeSearch) {
        SearchStaticUtils.mimeTypes[mimType] = NodeSpriteCollection.findTypeByNode(this.model);
      }

      this.mimeTypeSearch = SearchStaticUtils.mimeTypes[mimType];

      _.extend(this.model.attributes, {
        collection_id: this.model.cid,
        mime_type_search: this.mimeTypeSearch
      });

      var ancestors  = this.model.attributes.ancestors,
          ancLen     = ancestors ? ancestors.length : 0,
          parent     = ancLen ? ancestors[ancLen - 1] : undefined,
          parentName = parent && parent.attributes ? parent.attributes.name : undefined;

      this.itemBreadcrumb = _.str.sformat(lang.itemBreadcrumbAria, parentName);

      this.mimeTypeAria = _.str.sformat(lang.mimeTypeAria, this.mimeTypeSearch);

      this.hasVersioned = this.hasVersion();
      this.hasPromoted = this.hasPromoted();

      this.defaultActionUrl = nodeLinks.getUrl(this.model, {connector: this.model.connector});
      this.promotedText = '';
      if (!!this.hasPromoted) {
        this.promotedText = !!this.hasBestBet() ? this.model.get('bestbet') :
                            this.model.get('nickname');
        this.promotedText = this.promotedText.toString();
      }

      this._rowStates = options.rowStates;
      this.addOwnerDisplayName();
      this.addCreatedUserDisplayName();
      this.listenTo(this._rowStates, 'change:' + StandardSearchResultsView.RowStatesSelectedRows,
          this._selectionChanged
      );

      this.listenTo(this.model, 'change', function () {
        if (_.size(this.model.changed) === 1 &&
            _.has(this.model.changed, 'csuiDelayedActionsRetrieved')) {
          return;
        }
        if (this.model.changed.name) {
          this.model.set({OTName: this.model.changed['name']});
        }
        this.render();
        this.updateItemdetails();
      });
      if (this.model.get('name') !== this.model.get('OTName')) {
        this.model.set({OTName: this.model.get('name')});
        this.render();
        this.updateItemdetails();
      }
      this.listenTo(this.options.parentView, 'render:metadata',
          _.bind(function (metadataModels) {
            this.searchMetadataView = new SearchMetadataView({
              rowId: this.cid,
              collection: this.options.parentView.metadata,
              model: this.model
            });

            var tableColumns = this.searchMetadataView.options.collection.models;
            if (tableColumns && tableColumns.length === 1 && tableColumns[0].get("key") === null) {
              this.searchMetadataView.options.collection.add(metadataModels, {'silent': true});
            }

            this.searchMetadataRegion.show(this.searchMetadataView);
          }, this));

      if (SearchStaticUtils.isAppleMobile === false) {
        this.$el.on('mouseenter.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverStart, this));
        this.$el.on('mouseleave.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverEnd, this));
      }
    },

    _hoverStart: function () {
      this.showInlineActions();
    },

    _hoverEnd: function () {
      this.hideInlineActions();
    },

    _selectionChanged: function (rowStatesModel) {
      var previous = rowStatesModel.previous(StandardSearchResultsView.RowStatesSelectedRows);
      var changed = rowStatesModel.changed[StandardSearchResultsView.RowStatesSelectedRows];

      var deselected = _.difference(previous, changed);
      var selected = _.difference(changed, previous);

      var id = this.model.get('id');

      if (_.contains(deselected, id)) {
        this.model.set('csuiIsSelected', false);
        this._checkboxView.setChecked(false);
        this.ui.inlineToolbar.removeClass('selected');
      }
      if (_.contains(selected, id)) {
        this._checkboxView.setChecked(true);
        this.ui.inlineToolbar.addClass('selected');

        this.hideInlineActions(); // hide if a item was selected by checkbox
      }
    },

    initActionViews: function (options) {
      this.favView = new FavoritesView({
        tagName: 'div',
        focusable: true,
        model: options.model,
        context: options.context,
        tableView: options.tableView
      });

      var selectedModelIds = this._rowStates.get(StandardSearchResultsView.RowStatesSelectedRows);
      var checked = _.contains(selectedModelIds, this.model.get('id'));
      var checkboxTitle = _.str.sformat(lang.selectItem, options.model.get('name'));
      var checkboxAriaLabel = _.str.sformat(lang.selectItemAria, options.model.get('name'));

      var selectable = options.model.get('selectable') !== false;
      this._checkboxView = new CheckboxView({
        checked: checked ? 'true' : 'false',
        disabled: !selectable,
        ariaLabel: checkboxAriaLabel,
        title: checkboxTitle
      });

      this.listenTo(this._checkboxView.model, 'change:checked', function (event) {
        this._markAsSelected(event.changed.checked === 'true');
      });
      options.connector = options.model.connector;
      if (!!config.enableBreadcrumb && this.model.collection.isLocationColumnAvailable) {
        this.addBreadcrumbs(options);
      }
    },

    _getEnabledNodeStateIcons: function () {
      var nodeStateIconsPrototype, enabledNodeStateIcons;
      nodeStateIconsPrototype = Object.getPrototypeOf(nodeStateIcons);
      enabledNodeStateIcons = new nodeStateIconsPrototype.constructor(
          nodeStateIcons.filter(function (iconModel) {
            var IconView = iconModel.get('iconView');
            try {
              return IconView && (!IconView.enabled || IconView.enabled({
                    context: this.options.context,
                    node: this.model
                  }));
            } catch (error) {
              log.warn('Evaluating an icon view failed.\n{0}',
                  error.message) && console.warn(log.last);
            }
          }, this));
      return enabledNodeStateIcons;
    },

    _markAsSelected: function (select) {
      var newSelectedModelIds;
      var modelId = this.model.get('id');
      var selectedModelIds = this._rowStates.get(StandardSearchResultsView.RowStatesSelectedRows);
      if (select) {
        if (!_.contains(selectedModelIds, modelId)) {
          this.collection.selectedItems.add(this.model);
          newSelectedModelIds = selectedModelIds.concat([modelId]);
          this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      } else {
        if (_.contains(selectedModelIds, modelId)) {
          var modelRemoved = this.collection.selectedItems.findWhere({id: this.model.get('id')});
          this.collection.selectedItems.remove(modelRemoved);
          newSelectedModelIds = _.without(selectedModelIds, modelId);
          this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      }

    },

    addBreadcrumbs: function (options) {
      var ancestors = new NodeAncestorCollection(
          options.model.attributes.ancestors, {
            node: options.model, autofetch: false
          });
      if (!this.hasPromoted || (this.hasPromoted && this.model.get("ancestors"))) {
        this.breadcrumbsView = new BreadcrumbsView({
          context: options.context,
          collection: ancestors,
          startSubCrumbs: 0,
          isRtl: SearchStaticUtils.isRtl
        });
        this.breadcrumbsView.synchronizeCollections(true);
      } else {
        if (options.model.parent.get('id') > 0) {
          this.getAncestors(options).fetch().done(_.bind(function (response) {
            if(!!this.breadcrumbsView.completeCollection) {
              this.breadcrumbsView.completeCollection.length &&
              this.breadcrumbsView.completeCollection.last().set({'showAsLink': true},
                  {'silent': true});
              this.model.attributes.ancestors = this.breadcrumbsView.completeCollection.models;
            } else {
              this.breadcrumbsView.collection.length &&
              this.breadcrumbsView.collection.last().set({'showAsLink': true}, {'silent': true});
              this.model.attributes.ancestors = this.breadcrumbsView.collection.models;
            }
            this.breadcrumbsView.synchronizeCollections();
            if (this.model.collection && this.model.collection.fetched) {
              this.model.trigger("change:ancestors", this.model);
            }
          }, this));
        } else {
          this.breadcrumbsView = undefined;
        }
      }
      return true;
    },

    getAncestors: function (opts) {
      var node            = opts.model,
          ancestorOptions = {node: node.parent, autofetch: false},
          newAncestors    = new NodeAncestorCollection(undefined, ancestorOptions);
      this.breadcrumbsView = new BreadcrumbsView({
        context: opts.context,
        collection: newAncestors,
        startSubCrumbs: 0,
        hasPromoted: this.hasPromoted,
        isRtl: SearchStaticUtils.isRtl
      });
      return newAncestors;
    },

    onRender: function (e) {
      this.initActionViews(this.options);
      var enabledStateIcons = this._getEnabledNodeStateIcons();
      if (enabledStateIcons.length) {
        this.nodeStateView = new NodeStateCollectionView({
          context: this.options.context,
          node: this.options.model,
          tableView: this.options.originatingView,
          targetView: this.options.originatingView,
          collection: enabledStateIcons
        });
        this.nodeStateRegion.show(this.nodeStateView);
      }

      var meta = this.model.get("search_result_metadata");
      if (!!meta && (meta.current_version !== false && meta.version_type !== "minor") &&
          this.model.get('favorite') !== undefined) { // LPAD-61021) {
        this.favRegion.show(this.favView);
      }
      if (!!config.enableBreadcrumb && !!this.breadcrumbsView) {
        this.breadcrumbRegion.show(this.breadcrumbsView);
        this.$el.find('ol.binf-breadcrumb').attr('aria-label', this.itemBreadcrumb);

        var nodesCount = this.$el.find('ol.binf-breadcrumb > li').length;
        if (nodesCount === 1) {
          this.$el.find('.tail').addClass("one-node");
        } else if (nodesCount === 2) {
          this.$el.find('.tail').addClass("two-nodes");
        }
      }
      this.selectionRegion.show(this._checkboxView);
      if (this.model.collection && this._checkboxView.options.checked === "true") {
        this.$el.find('.csui-search-item-row').addClass('selected');
      }
      this.trigger('render:metadata');
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();

      var selectedSettings = this.model.collection.selectedSettings;
      var description = '', summary = '';
      if (selectedSettings) {
        switch (selectedSettings) {
        case 'SD' :
        {
          description = this.model.get("description");
          summary = this.model.get("summary");
          break;
        }
        case 'SO' :
        {
          description = this.model.get("summary");
          break;
        }
        case 'SP' :
        {
          description = this.model.get("summary")
                        || this.model.get("description");
          break;
        }
        case 'DP' :
        {
          description = this.model.get("description")
                        || this.model.get("summary");
          break;
        }
        case 'DO' :
        {
          description = this.model.get("description");
          break;
        }
        default :
        {
          description = '';
        }
        }
      }
      if (description && description.length > 0) {
        this.el.getElementsByClassName('csui-search-item-desc')[0].innerHTML = description;
      }
      if (summary && summary.length > 0) {
        this.el.getElementsByClassName('csui-search-item-summary')[0].innerHTML = summary;
      }
      this.listenTo(this, 'adjust:breadcrumb', function () {
        this.breadcrumbsView.refresh();
      });
    },

    hasVersion: function () {
      var hasVer = this.model.get('versions');
      if (hasVer) {
        var srMetadata = this.model.get("search_result_metadata");
        hasVer = srMetadata &&
                 (srMetadata.current_version === false || srMetadata.version_type === 'minor');
      }
      return hasVer;
    },

    hasBestBet: function () {
      var bestBets = this.model.get('bestbet');
      return !!bestBets && !!bestBets.length;
    },

    hasNickName: function () {
      var nickName = this.model.get('nickname');
      return !!nickName && !!nickName.length;
    },

    hasPromoted: function () {
      return !!this.hasBestBet() || !!this.hasNickName();
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
      if (this.$el && SearchStaticUtils.isAppleMobile === false) {
        this.$el.off('mouseenter.' + this.cid, '.csui-search-item-row', this._hoverStart);
        this.$el.off('mouseleave.' + this.cid, '.csui-search-item-row', this._hoverEnd);
      }
    },

    onShow: function (e) {
      this.updateItemdetails(e);
      if (this.nodeStateView) {
        var stateViews = this.nodeStateView.el.getElementsByTagName('li');
        if (stateViews.length === 1) {
          this.$el.addClass('csui-search-result-nodestate-item');
        } else if (stateViews.length === 2) {
          this.$el.addClass('csui-search-result-nodestate-item2');
        } else if (stateViews.length > 2) {
          this.$el.addClass('csui-search-result-nodestate-more');
        }
      }
    },

    _toggleExpand: function (buttonEl) {
      this.bindUIElements();
      if (this._isExpanded) {
        this._isExpanded = false;
        $('.truncated-' + this.cid).hide();
        buttonEl.attr('title', lang.showMore)
                .attr('aria-expanded', 'false')
                .attr('aria-label', lang.showMoreAria);
        this.ui.arrowIcon.removeClass('icon-expandArrowUp');
        this.ui.arrowIcon.addClass('icon-expandArrowDown');
        this.ui.descriptionField.removeClass("csui-search-item-desc-height");
        this.ui.descriptionField.addClass("csui-overflow");
        this.ui.summaryField.removeClass("csui-search-item-summary-height");
        this.ui.summaryField.addClass("csui-overflow");
      } else {
        this._isExpanded = true;
        $('.truncated-' + this.cid).show();
        buttonEl.attr('title', lang.showLess)
                .attr('aria-expanded', 'true')
                .attr('aria-label', lang.showLessAria);
        this.ui.arrowIcon.removeClass('icon-expandArrowDown');
        this.ui.arrowIcon.addClass('icon-expandArrowUp');
        this.ui.descriptionField.addClass("csui-search-item-desc-height");
        this.ui.descriptionField.removeClass("csui-overflow");
        this.ui.summaryField.addClass("csui-search-item-summary-height");
        this.ui.summaryField.removeClass("csui-overflow");
      }
    },

    updateItemdetails: function (e) {
      var self           = this,
          hasDescription = this.hasDescriptionText(this.ui.descriptionField[0]), // for few objects it could be summary.
          hasSummary     = this.hasDescriptionText(this.ui.summaryField[0]);

      if (hasDescription) {
        this.ui.descriptionField.addClass("csui-overflow");
      }

      this.$el.find('.truncated-' + this.cid).addClass('binf-hidden');

      if (hasSummary) {
        this.ui.summaryField.addClass("csui-overflow");
      }

      if (!!config.enableBreadcrumb && this.breadcrumbsView) {
        this.breadcrumbsView.refresh();
      }

      if (this.$el.find('.search-results-item-expand').length === 0) {
        this.$el.find('.csui-search-item-fav.search-fav-' + this.cid)
            .after(
                '<button class="search-results-item-expand" title="' + lang.showMore +
                '" aria-expanded="false" aria-label="' + lang.showMoreAria +
                '"><span class="icon icon-expandArrowDown"></span></button>')
            .next().on('click', function () {
          self._toggleExpand.call(self, $(this));
        });
      }

      if (!hasDescription) {   //when there is no description, hide description field and 'Modified' metadata property
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }

      if (!hasSummary) {   //when there is no summary, hide summary field
        this.ui.summaryField.addClass("binf-hidden");
      }
    },

    addOwnerDisplayName: function () {
      var ownerDisplayName = "";
      if (!!this.model.attributes.owner_user_id_expand) {
        ownerDisplayName = this.getDisplayName(this.model.attributes.owner_user_id_expand);
      }
      _.extend(this.model.attributes, {
        owner_display_name: ownerDisplayName
      });
    },

    addCreatedUserDisplayName: function () {
      var createUserDisplayName = "";
      if (!!this.model.attributes.create_user_id_expand) {
        createUserDisplayName = this.getDisplayName(this.model.attributes.create_user_id_expand);
      }
      _.extend(this.model.attributes, {
        create_user_display_name: createUserDisplayName
      });
    },

    getDisplayName: function (userInfo) {
      return userInfo.name_formatted || userInfo.name;
    },

    hasDescriptionText: function (el) {
      return (el && el.textContent.trim().length > 0);
    },

    showInlineActions: function () {
      if (this.ui.inlineToolbarContainer.find('.csui-table-actionbar').length === 0) {
        if (this.collection.selectedItems.length > 0) {
          return;
        }

        this._hiddenMetadataElements = this.$el.find('.csui-search-item-details:lt(2)');
        this._hiddenMetadataElements.addClass("binf-hidden");

        this.ui.inlineToolbarContainer.removeClass("binf-hidden");

        var versionId   = this.model.attributes.version_id ?
                          "-" + this.model.attributes.version_id :
                          "",
            selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
        var args = {
          sender: this,
          target: selectedRow,
          node: this.model
        };
        this.trigger("enterSearchRow", args);
      }
    },

    hideInlineActions: function () {
      this.ui.inlineToolbarContainer.addClass("binf-hidden");
      this._hiddenMetadataElements.removeClass("binf-hidden");
      this._hiddenMetadataElements = $();
      if (!this._isExpanded) {
        var descLength = this.ui.descriptionField.html().trim().length;
        if (descLength <= 0) {
          this.ui.descriptionField.addClass("binf-hidden");
          this.ui.modifiedByField.addClass("binf-hidden");
        }

        var summaryLength = this.ui.summaryField.html().trim().length;
        if (summaryLength <= 0) {
          this.ui.summaryField.addClass("binf-hidden");
        }
      }

      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      var args = {
        sender: this,
        target: selectedRow,
        node: []
      };
      this.trigger("leaveSearchRow", args);
    },

    openVersionHistory: function (event) {
      var self         = this,
          args         = {},
          selectedNode = [];
      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      selectedNode = this.model;
      args = {
        sender: self,
        target: selectedRow,
        model: selectedNode
      };
      self.options.originatingView.openVersionHistory(args);
    },

    showMetadataInfo: function (event) {
      this.ui.descriptionField.removeClass("binf-hidden");
      this.ui.modifiedByField.removeClass("binf-hidden");
      this.ui.summaryField.removeClass("binf-hidden");
      event.preventDefault();
      event.stopPropagation();
    },

    hideMetadataInfo: function (event) {
      var descLength = this.ui.descriptionField.html().trim().length;
      if (descLength <= 0) {
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }
      var summaryLength = this.ui.summaryField.html().trim().length;
      if (summaryLength <= 0) {
        this.ui.summaryField.addClass("binf-hidden");
      }
      event.preventDefault();
      event.stopPropagation();
    }
  });

  var StandardSearchResultsView = Marionette.CollectionView.extend({

    className: 'binf-list-group',

    childView: SearchResultItemView,
    childViewOptions: function () {

      return {
        context: this.options.context,
        defaultActionController: this.defaultActionController,
        metadata: this.metadata,
        rowStates: this._rowStates,
        originatingView: this.options.originatingView,
        headerView: this.options.originatingView.headerView,
        parentView: this,
        isLocationColumnAvailable: this.isLocationColumnAvailable > -1,
        collection: this.collection
      };
    },

    emptyView: NoSearchResultView,
    emptyViewOptions: function () {
      return {
        model: this.emptyModel
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    constructor: function SearchResultListView(options) {
      options || (options = {});
      this.options = options;
      this.context = options.context;
      this.collection = options.collection;
      this.localStorage = this.options.localStorage;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.setRowStates();
      this.setInlineActionBarEvents();
      this.metadata = this.options.metadata ||
                      this.context.getCollection(SearchMetadataFactory, this);
      this.setStandardSearchHeaderView();
      this.listenTo(this, 'update:tool:items', this._updateToolItems);
      this.listenTo(this.collection, 'sync', function () {
        this.collection.selectedItems && this.collection.selectedItems.length &&
        this.collection.each(_.bind(function (model) {
          var index = this.collection.selectedItems.findIndex({id: model.get('id')});
          if (index !== -1 && this.collection.selectedItems.at(index) !== model) {
            this.collection.selectedItems.remove(this.collection.selectedItems.at(index));
            this.collection.selectedItems.add(model, {at: index});
            model.set('csuiIsSelected', true);
            var newSelectedModelIds;
            var modelId = model.get('id');
            var selectedModelIds = this._rowStates.get(StandardSearchResultsView.RowStatesSelectedRows);
            if (!_.contains(selectedModelIds, modelId)) {
              this.collection.selectedItems.add(this.model);
              newSelectedModelIds = selectedModelIds.concat([modelId]);
              this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
            }
          } else {
            this._updateToolItems();
          }
        }, this));
      });

      this.listenTo(this.collection, "sync", this._focusOnFirstSearchResultElement);
      this.listenTo(this.options.originatingView, 'render:metadata', this.renderMetadataModels);

      this.listenTo(this, 'dom:refresh', function () {
        this.standardHeaderView.triggerMethod('dom:refresh');
      });
      BlockingView.delegate(this, options.originatingView);

      this.collection.originatingView = options.originatingView;
      this.emptyModel = new Backbone.Model({
        message: lang.noSearchResultMessage,
        suggestionKeyword: lang.suggestionKeyword,
        searchSuggestion1: lang.searchSuggestion1,
        searchSuggestion2: lang.searchSuggestion2,
        searchSuggestion3: lang.searchSuggestion3,
        searchSuggestion4: lang.searchSuggestion4
      });
      this.listenTo(this.collection, 'sync', function () {
        var tabElements = this.options.originatingView.facetView &&
                          this.options.originatingView.facetView.$('.csui-facet');
        if (tabElements && tabElements.length) {
          tabElements.prop('tabindex', 0);
        }
      });
      this.listenTo(this.collection, 'error', function () {
        this.emptyModel.set('message', lang.failedSearchResultMessage);
      });
      this.listenTo(this, 'dom:refresh', this._refreshDom);
      this.listenTo(this, 'facet:opened', function () {
        if ($(window).width() > 1023) {
          this.children.each(function (view) {
            view.trigger('adjust:breadcrumb');
          });
        }
      });
      this.listenTo(this, 'destroy:header:view', function () {
        this.standardHeaderView.destroy();
        this.standardHeaderView = undefined;
      });
    },

    _focusOnFirstSearchResultElement: function () {
      if(this.options.originatingView && (!this.options.originatingView.collection.settings_changed))
      {
        this.$el.find(".binf-list-group-item:first-child .csui-search-item-name > a").trigger(
            'focus');
      } else {
        this.options.originatingView.collection.settings_changed = false;
      }
     },

    renderMetadataModels: function () {

      this.metadata = _.extend({}, this.metadata,
          this.collection.searching && this.collection.searching.sortedColumns);
      var metadataModels = _.filter(this.metadata.models,
          function (item) {
            return !item.get("default");
          });
      this.trigger('render:metadata', metadataModels);
    },

    setRowStates: function () {
      this._rowStates = new Backbone.Model();
      this._rowStates.set(StandardSearchResultsView.RowStatesSelectedRows, []);
    },

    setStandardSearchHeaderView: function () {
      this.standardHeaderView = new StandardSearchResultsHeaderView({
        collection: this.collection,
        view: this,
        options: this.options,
        selectedItems: this.collection.selectedItems
      });
    },
    _updateToolItems: function () {
      this.standardHeaderView && this.standardHeaderView._updateToolItems();
    },
    _showInlineActionBar: function (args) {
      if (!!args) {
        this._savedHoverEnterArgs = null;

        var parentId = args.node.get('parent_id');
        if (parentId instanceof Object) {
          parentId = args.node.get('parent_id').id;
        }
        var parentNode = new NodeModel({id: parentId},
            {connector: args.node.connector});

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: this.defaultActionController.commands,
              delayedActions: this.collection.delayedActions,
              collection: this.options.toolbarItems.inlineToolbar || [],
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              container: parentNode,
              containerCollection: this.collection,
              model: args.node,
              originatingView: this.options.originatingView,
              notOccupiedSpace: 0
            }, this.options.toolbarItems.inlineToolbar &&
               this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'after:execute:command',
            this.options.originatingView._toolbarCommandExecuted);
        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this._showInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },
    setInlineActionBarEvents: function () {
      this.listenTo(this, 'childview:enterSearchRow',
          this._showInlineActionBarWithDelay);
      this.listenTo(this, 'childview:openVersionHistory',
          this.openVersionHistory);
      this.listenTo(this, 'childview:leaveSearchRow', this._actionBarShouldDestroy);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
    },
    _showInlineActionBarWithDelay: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        self._showInlineActionBar.call(self, args);
      }, 200);
    },
    _actionBarShouldDestroy: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
      }
    },
    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onScrollTop: function () {
      $('.binf-list-group').scrollTop(0);
    },

    _refreshDom: function () {
      this.$el.addClass("list-group-height");
      this.onScrollTop();
    }
  }, {
    RowStatesSelectedRows: 'selected'
  });

  return StandardSearchResultsView;
});