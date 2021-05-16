/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define ([
    'csui/lib/marionette',
    'csui/controls/table/cells/templated/templated.view',
    'csui/controls/table/cells/cell.registry',
    'hbs!csui/controls/table/cells/search/version/version',
    'i18n!csui/controls/table/cells/search/version/nls/lang',
    'css!csui/controls/table/cells/search/version/version'
], function (Marionette, TemplatedCellView, cellViewRegistry, template, lang) {
    'use strict';

    var VersionCellView = TemplatedCellView.extend({
        className: 'csui-table-cell-version',

        template: template,
        events: {
            'click .csui-search-results-version': 'openVersionHistory'
        },
        getValueData: function () {
            var has_version  = this.hasVersion(),
                versionLabel = lang.versionLabel,
                versions     = this.model.get('versions'),
                versionNumberName = versions ? versions.version_number_name : '';
            return {
                has_version: has_version,
                versionLabel: versionLabel,
                versionNumber: versionNumberName,
                cid: this.model.cid
            };
        },

        constructor: function VersionCellView () {
            TemplatedCellView.prototype.constructor.apply(this, arguments);
        },

        hasVersion: function () {
            return this.model.get('versions') && this.model.get("search_result_metadata") &&
                    (this.model.get("search_result_metadata").current_version === false ||
                    this.model.get("search_result_metadata").version_type === 'minor');
        },

        openVersionHistory: function () {
            var args = {
                  model: this.model
                },
                searchResultsView = this.options.tableView && this.options.tableView.options.parentView;
            searchResultsView.openVersionHistory(args);
        }
    },{
        columnClassName: 'csui-table-cell-version',
        hasFixedWidth: true
    });
    cellViewRegistry.registerByColumnKey('version_id', VersionCellView);

    return VersionCellView;
});