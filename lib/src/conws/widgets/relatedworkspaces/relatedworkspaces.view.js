/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery','csui/utils/log',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/utils/workspaces/workspaces.view',
  'conws/widgets/relatedworkspaces/impl/relateditem.view',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.factory',
  'conws/widgets/relatedworkspaces/impl/relatedworkspacestable.view',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/base',
  'conws/utils/workspaces/impl/workspaceutil',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  'css!conws/utils/icons/icons',
  'hbs!conws/widgets/relatedworkspaces/impl/relateditem',
  'css!conws/widgets/relatedworkspaces/impl/relateditem'
], function (Marionette, module, _, Backbone, $, log,
    WorkspaceContextFactory,
    WorkspacesView,
    RelatedItemView,
    RelatedWorkspacesCollectionFactory,
    RelatedWorkspacesTableView,
    ModalAlert,
    BaseUtils,
    workspaceUtil,
    langWksp,
    lang) {

  var RelatedWorkspacesView = WorkspacesView.extend({

    constructor: function RelatedWorkspacesView(options) {
      this.viewClassName = 'conws-relatedworkspaces';
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(RelatedWorkspacesCollectionFactory);
      }

      WorkspacesView.prototype.constructor.apply(this, arguments);
      this.limit = -1;

      if (this.options &&
          this.options.data &&
          this.options.data.collapsedView &&
          this.options.data.collapsedView.orderBy) {
        if (_.isString(this.options.data.collapsedView.orderBy)) {
          log.error(langWksp.errorOrderByMustNotBeString) && console.log(log.last);
          ModalAlert.showError(langWksp.errorOrderByMustNotBeString);
        } else if (this.options.data.collapsedView.orderBy.sortColumn) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(this.options.data.collapsedView.orderBy.sortColumn);
          if (!match) {
            log.error(langWksp.errorOrderByMissingBraces) && console.log(log.last);
            ModalAlert.showError(langWksp.errorOrderByMissingBraces);
          }
        }
      }

      if (this.options &&
          this.options.data &&
          this.options.data.collapsedView) {
        var errors = [], that = this;
        [ "title", "description", "topRight", "bottomLeft", "bottomRight"].forEach(function (n) {
          if (that.options.data.collapsedView[n] && that.options.data.collapsedView[n].format) {
            errors.push(n);
          }
        });
        if (errors.length>0) {
          ModalAlert.showError(_.str.sformat(lang.errorFieldFormatTagUnrecognized, errors.join(", ")));
        }
      }

    },

    getContext: function () {
      return this.options.workspaceContext;
    },

    childView: RelatedItemView,

    childViewOptions: function () {
      return {context: this.options.context, data: this.options.data.collapsedView};
    },

    emptyViewOptions: {
      templateHelpers: function () {
        return {
          text: this._parent._getNoResultsPlaceholder()
        };
      }
    },

    workspacesCollectionFactory: RelatedWorkspacesCollectionFactory,
    workspacesTableView: RelatedWorkspacesTableView,
    dialogClassName: 'relatedworkspaces',
    lang: lang,

    _getExpandedViewOptions: function() {
      var options = _.extend( WorkspacesView.prototype._getExpandedViewOptions.apply(this, arguments),{
        title: this._getTitle()
      });
      return options;
    },
    _getCollectionAttributes: function () {
      var attributes = {
        workspaceTypeId: this.options.data.workspaceTypeId,
        relationType: this.options.data.relationType,
        sortExpanded: this.options.data.expandedView && workspaceUtil.orderByAsString(this.options.data.expandedView.orderBy) ||
                      undefined,
        sortCollapsed: this.options.data.collapsedView && workspaceUtil.orderByAsString(this.options.data.collapsedView.orderBy) ||
                       this._getDefaultSortOrder() || undefined,
        title:  BaseUtils.getClosestLocalizedString(this.options.data.title, lang.dialogTitle)
      };
      return attributes;
    },
    _getDefaultSortOrder: function () {
      return this._getFilterPropertyName() ? this._getFilterPropertyName() + ' asc' : undefined;
    },

    _getCollectionUrlQuery: function () {
      var options                 = this.options,
          query                   = {},
          customPropertiesToFetch = this._getPropertiesToFetch(options.data.collapsedView),
          propertiesToFetch       = ["id", "container", "name", "type"];
      propertiesToFetch = _.union(propertiesToFetch, customPropertiesToFetch);
      query.fields = encodeURIComponent("properties{" + propertiesToFetch.join(",") + "}");
      query.action = "properties-properties";

      query.where_workspace_type_id = options.data.workspaceTypeId;
      query.where_relationtype = options.data.relationType;
      var orderByAsString;
      if (options.data.collapsedView) {
        orderByAsString = workspaceUtil.orderByAsString(options.data.collapsedView.orderBy);
      }
      if (!orderByAsString) {
        orderByAsString = this._getDefaultSortOrder();
      }
      if (orderByAsString) {
        query.sort = orderByAsString;
      }
      query.expand_users = "true";

      return query;
    },
    _getFirstPlaceholder: function (expression) {
      var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
          match, propertyName, placeholder, result;
      while ((match = parameterPlaceholder.exec(expression))) {
        placeholder = match[0];
        propertyName = match[1];
        if (propertyName) {
          result = match;
          break;
        }
      }
      return result;
    },
    _getFilterPropertyName: function () {
      var propertyName;
      if (this.options && this.options.data && this.options.data.collapsedView &&
          this.options.data.collapsedView.title && this.options.data.collapsedView.title.value) {
        var placeHolder = this._getFirstPlaceholder(this.options.data.collapsedView.title.value);
        if (placeHolder) {
          propertyName = placeHolder[1];
        }
      }
      return propertyName;
    },
    _getConfiguredProperties: function (object) {
      var properties = {}, regex = /{([^:}]+)(:([^}]+))?}/g, match;
      var recurse = function (object) {
        if (typeof object !== 'object') {
          while ((match = regex.exec(object))) {
            properties[match[1]] = "";
          }
        } else {
          $.each(object, function (key, value) {
            recurse(value);
          });
        }
      };
      recurse(object);
      return properties;
    },
    _getPropertiesToFetch: function (object) {
      var properties = this._getConfiguredProperties(object);
      return Object.keys(properties);
    },
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var $item = this.$(_.str.sformat('.conws-relateditem-object:nth-child({0}) .conws-relateditem-border', index + 1));
      return this.$($item[0]);
    }

  });

  return RelatedWorkspacesView;

});
