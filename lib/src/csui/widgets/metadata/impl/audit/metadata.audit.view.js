/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/table/table.view', 'csui/controls/pagination/nodespagination.view',
  'csui/models/audit/audit.collection',
  'csui/widgets/metadata/impl/audit/metadata.audit.columns',
  'csui/models/members',
  'csui/controls/userpicker/impl/user.view',
  'csui/utils/base',
  'hbs!csui/widgets/metadata/impl/audit/metadata.audit',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/audit/metadata.audit'
], function (module, _, $, Marionette, ConnectorFactory, LayoutViewEventsPropagationMixin, TableView,
  PaginationView, AuditCollection, metadataAuditTableColumns, MemberCollection, UserView, base,
  template, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30,
    defaultPageSizes: [30, 50, 100],
    enabled: true
  });

  var MetadataAuditTableView = Marionette.LayoutView.extend({

    className: 'csui-audit',

    template: template,

    ui: {
      tableView: '.csui-audit-table',
      paginationView: '.csui-audit-pagination'
    },

    regions: {
      tableRegion: '@ui.tableView',
      paginationRegion: '@ui.paginationView'
    },

    constructor: function MetadataAuditTableView (options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.collection.fetch();
      this.propagateEventsToRegions();
    },

    initialize: function () {
      _.defaults(this.options, {
        pageSize: config.defaultPageSize,
        ddItemsList: config.defaultPageSizes
      });
      this.collection = new AuditCollection(undefined, {
        connector: this.options.context.getObject(ConnectorFactory),
        node: this.options.model,
        autoreset: true
      });

      this._setTableView();
      this._setPagination();
      this.listenTo(this.tableView, 'before:render', function (event) {
        var eventsSearchBoxView = this.tableView.searchBoxes.length && this.tableView.searchBoxes[0];
        if (eventsSearchBoxView && !eventsSearchBoxView.ui.searchBox.hasClass('binf-hidden') &&
            !this.eventDropDownOpts.doNotShowDropDown && this.tableView.tableCaptionView.accFocusedColumn === 0) {
          this.eventDropDownOpts.doNotShowDropDown = true;
        }
      });

    },

    onRender: function () {
      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    },

    getUserSearchboxOptions: function () {

      var collection = new MemberCollection(undefined, {
          connector: this.options.context.getObject(ConnectorFactory),
          memberFilter: {
            type: [0]
          }, // filters only users
          limit: 10,
          comparator: function (item) {
            return item.get('name_formatted').toLowerCase();
          }
        }),

        _retrieveMembers = function (query) {
          var self = this;
          this.collection.query = query;
          return this.collection
            .fetch()
            .then(function () {
              return self.collection.models;
            });
        },

        _retrieveDisplayText = function (item) {
          return item.get('name');
        },

        _renderHighlighter = function (item) {
          var model = this.collection.findWhere({
              name: item
            }),
            view = new UserView({
              model: model,
              connector: this.collection.connector,
              lightWeight: false
            });
          return view.render().el;
        };

      return {
        collection: collection,
        source: _retrieveMembers,
        displayText: _retrieveDisplayText,
        highlighter: _renderHighlighter,
        filter: "user_id"
      };
    },

    getEventSearchboxOptions: function () {

      this.eventDropDownOpts = {doNotShowDropDown: false};

      var collection = this.collection.auditEvents,
        _retrieveDisplayText = function (item) {
          return item.get('name');
        },

        _retrieveEvents      = function (query) {
          var self = this;
          var filteredModels = _.filter(self.collection.models, function (model) {
            return model.get('name').toLowerCase().indexOf(query.toLowerCase()) !== -1;
          });
          return _.sortBy(filteredModels, function (action) { return action.get('name'); });
        },

        DDmenu =
        '<ul class="typeahead binf-dropdown-menu" role="listbox" id="event-picker-ul"></ul>',

        focus = function (e) {
          if (!this.focused) {
            this.focused = true;
            if (this.options.showHintOnFocus && !this.options.dropDownOpts.doNotShowDropDown) {
                this.lookup();
            }
          }
          if (this.options.dropDownOpts.doNotShowDropDown) {
            this.options.dropDownOpts.doNotShowDropDown = false;
          }
        },

        highlighter = function (item) {
          return $('<div></div>').text(item).html();
        },

        afterSelect = function (item) {
          if(this.options.dropDownOpts && !this.options.dropDownOpts.doNotShowDropDown) {
            this.options.dropDownOpts.doNotShowDropDown = true;
          }
          var val = this.options.clearOnSelect ? '' : base.formatMemberName(item);
          this.ui.searchBox.val(val);
          this.trigger(this.valueChangedEventName, {
            column: this.options.filter,
            keywords: item.get('id')
          });
        };

      return {
        collection: collection,
        source: _retrieveEvents,
        displayText: _retrieveDisplayText,
        filter: "type",
        showHintOnFocus: true,
        menu: DDmenu,
        dropDownOpts: this.eventDropDownOpts,
        focus: focus,
        afterSelect: afterSelect,
        highlighter: highlighter
      };
    },

    _setTableView: function () {

      var userSearchOptions = this.getUserSearchboxOptions(),
        eventSearchOptions = this.getEventSearchboxOptions(),
        options = _.extend({
          connector: this.model.connector,
          collection: this.collection,
          tableColumns: metadataAuditTableColumns,
          orderBy: 'audit_date desc',
          columnsWithTypeaheadSearchbox: {
            "user_id": userSearchOptions,
            "audit_name": eventSearchOptions
          },
          selectColumn: false,
          haveDetailsRowExpandCollapseColumn: true,
          actionItems: this.defaultActionItems,
          commands: this.commands,
          wfElementID: '',
          customLabels: {
            emptyTableText: lang.auditNoResultsPlaceholder
          }
        }, this.options);

      this.tableView = new TableView(options);
    },

    _setPagination: function () {
      var options = {
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: this.options.ddItemsList
      };
      this.paginationView = new PaginationView(options);
    }
  }, {
    enabled: function (options) {
      if (config.enabled === false) {
        return false;
      }
      return !!options.node.get('id');
    }
  });
  _.extend(MetadataAuditTableView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataAuditTableView;
});
