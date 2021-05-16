/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
    'csui/controls/toolbar/toolitem.model',
    'csui/controls/toolbar/toolitems.filtered.model',
    'csui/controls/toolbar/toolbar.view',
    'csui/utils/commands',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/controls/tabletoolbar/tabletoolbar.view',
    "csui/utils/url",
    'xecmpf/widgets/workspaces/factories/workspace.types.factory',
    'i18n!xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang'
], function (module, require, $, _, Backbone, Marionette, log, base,
             ToolItemModel, FilteredToolItemsCollection,
             ToolbarView,
             Commands,
             LayoutViewEventsPropagationMixin,
             TableToolbarView,
             Url,
             WorkspaceTypeCollectionFactory,
             lang) {
    'use strict';

    var AddWorkspaceToolbarView = ToolbarView.extend({

            cssPrefix: "binf-",
            ui: {
                dropdown: '.binf-dropdown-toggle'
            },
            events: {
                'click @ui.dropdown': 'adjustDropdown'
            },

            _makeDropDown: function () {
                var e = '<a href="#" class="' + this.cssPrefix + 'dropdown-toggle csui-acc-focusable"  data-binf-toggle="dropdown" aria-expanded="true"';
                if (this.options.dropDownText) {
                    e += ' title="' + this.options.dropDownText + '">';
                } else {
                    e += '>';
                }
                if (this.options.dropDownIcon) {
                    e += '<span class="' + this.options.dropDownIcon + '"></span>';
                } else {
                    if (this.options.dropDownText) {
                        e += this.options.dropDownText;
                    }
                }
                e += "<span class='toolbarlabel'>" + lang.createNew + "</span></a>";
                return e;
            },
            adjustDropdown: function (event) {
                if (this.collection.length <= 1) {
                    this.$el.find("." + this.cssPrefix + "dropdown-menu").css("display", "none");
                    var args = {toolItem: this.collection.at(0)};
                    this.children.first().triggerMethod("before:toolitem:action", args);
                    this.children.first().triggerMethod("toolitem:action", args);
                }
            }
        })
        ;
    var AddWorkspaceTableToolbarView = TableToolbarView.extend({

        constructor: function TableToolbarView(options) {
            Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options

            this.context = this.options.context;
            this.commands = this.options.commands || Commands;
            this.toolbarNames = ['add'];
            var addToolbarFactory = this.options.toolbarItems['addToolbar'],
                toolbarView = this['addToolbarView'] = new AddWorkspaceToolbarView(_.extend({
                    collection: new FilteredToolItemsCollection(
                        addToolbarFactory, {
                            status: {},  // must be set
                            commands: this.commands,
                            delayedActions: false
                        }), // <=  filter toolbar items (actions) for add toolbar
                    toolbarName: "add"
                }, addToolbarFactory.options));

            this
                .listenTo(toolbarView, 'childview:toolitem:action',
                    function (toolItemView, args) {
                        this.trigger('toolbarItem:clicked', args.toolItem.attributes.commandData);
                    }
                )
                .listenTo(toolbarView, 'dom:refresh', function () {
                    this.triggerMethod('refresh:tabindexes');
                });
            this._updateAddToolbar();
            this.propagateEventsToRegions();
        },
        updateForSelectedChildren: function (selectedNodes) {
        },

        _addMenuItems: function (toolItems, businessWorkspaceTypes) {
            businessWorkspaceTypes.models.forEach(function (bwtype) {

                if (!_.isEmpty(bwtype.get("templates"))) {
                    _.each(bwtype.get("templates"), function (tmpl) {
                        var toolItem = new ToolItemModel({
                            signature: "AddConnectedWorkspace", // must match with filteredToolItemCollection
                            name: tmpl.name,
                            group: 'conws',
                            commandData: {
                                wksp_type_name: bwtype.get("wksp_type_name"), //. props.wksp_type_name,
                                wksp_type_id: bwtype.get("wksp_type_id"), // props.wksp_type_id,
                                template: tmpl,
                                type: tmpl.subType,
                                rm_enabled: bwtype.get("rm_enabled")
                            }
                        });
                        toolItems.push(toolItem);
                    });
                }
            });
        },

        onBeforeShow: function () {
            this.$el.find("li").remove();
            this.options.toolbarItems.addToolbar.reset(this.toolbarItems);
        },
        _updateAddToolbar: function () {
            this.toolbarItems = [];
            this.workspaceTypesCollection = this.options.context.getCollection(
                WorkspaceTypeCollectionFactory, {
                    busObjectType: this.options.data.busObjectType,
                    extSystemId: this.options.data.extSystemId
                });

            this._addMenuItems(this.toolbarItems, this.workspaceTypesCollection);
        }
    });

    _.extend(AddWorkspaceTableToolbarView.prototype, LayoutViewEventsPropagationMixin);

    return AddWorkspaceTableToolbarView;

});

