/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
    'xecmpf/widgets/workspaces/controls/tile/tile.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    "xecmpf/widgets/workspaces/controls/workspaces.table/workspaces.table.view",
    "i18n!xecmpf/widgets/workspaces/pages/select.workspace/impl/nls/lang",
    'hbs!xecmpf/widgets/workspaces/pages/select.workspace/impl/select.workspace',
    'css!xecmpf/widgets/workspaces/pages/select.workspace/impl/select.workspace',

], function (module, $, _, Backbone, Marionette, log, base,
             TileView,
             LayoutViewEventsPropagationMixin,
             WorkspacesTableView,
             lang,
             template,
             css) {


    var SelectWorkspaceView = Marionette.LayoutView.extend({
            tagName: "div",
            id: "xecmpf-select_wksp",
            className: "xecmpf-page",

            template: template,
            regions: {
                content: "#content"
            },
            constructor: function SelectWorkspaceView(options) {
                Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
                this.context = this.options.context;
                this.propagateEventsToRegions();
            },
            _getController: function () {
                return this.options.status.wksp_controller;
            },
            onBeforeShow: function () {
                var options = this.options;
                this.tileView = new TileView({
                    title: lang.pageTitle,
                    contentView: WorkspacesTableView,
                    contentViewOptions: options
                });

                this.getRegion('content').show(this.tileView);
                this.listenTo(this.tileView.contentView, 'toolbarItem:clicked', function (workspaceType) {
                    _.defaults(options.status, {
                        workspaceType: new Backbone.Model(workspaceType)
                    });

                    this._getController().createWorkspace(options);
                    return $.Deferred().resolve();
                });
                this.listenTo(this.tileView.contentView, 'executed:defaultAction', function (args) {
                    options.status || (options.status = {});
                    options.status.workspace = args.node;
                    this._getController().updateWorkspace(options);
                });
            }
        })
        ;

    _.extend(SelectWorkspaceView.prototype, LayoutViewEventsPropagationMixin);

    return SelectWorkspaceView;
})
;
