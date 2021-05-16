/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
    'csui/utils/namedsessionstorage',
    'xecmpf/widgets/workspaces/controls/tile/tile.view',
    'xecmpf/widgets/workspaces/controls/footer/footer.view',
    'csui/widgets/metadata/metadata.add.item.controller',
    'csui/widgets/metadata/metadata.action.one.item.properties.view',
    'conws/models/workspacecreateforms',
    'conws/models/metadata.controller',
    "csui/models/node/node.model",
    'conws/models/metadata.controller',
    'csui/utils/contexts/factories/connector',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/behaviors/keyboard.navigation/tabables.behavior',
    'csui/widgets/metadata/metadata.properties.view',
    'csui/utils/url',
    "i18n!xecmpf/widgets/workspaces/pages/create.workspace/impl/nls/lang",
    'hbs!xecmpf/widgets/workspaces/pages/create.workspace/impl/create.workspace',
    'css!xecmpf/widgets/workspaces/pages/create.workspace/impl/create.workspace'

], function (module, $, _, Backbone, Marionette, log, base,
             NamedSessionStorage,
             TileView,
             FooterView,
             MetadataAddItemController,
             MetadataActionOneItemPropertiesView,
             WorkspaceCreateFormCollection,
             WorkspaceMetadataController,
             NodeModel,
             MetadataController,
             ConnectorFactory,
             ModalAlert,
             LayoutViewEventsPropagationMixin,
             TabablesBehavior,
             MetadataPropertiesView,
             Url,
             lang,
             template,
             css) {


    var CreateWorkspaceView = Marionette.LayoutView.extend({
        tagName: "div",
        id: "xecmpf-create_wksp",
        className: "xecmpf-page",
        template: template,
        regions: {
            content: "#content",
            footer: "#footer"
        },
        behaviors: {
            TabablesBehavior: {
                behaviorClass: TabablesBehavior,
                recursiveNavigation: true,
                containTabFocus: true
            }
        },

        constructor: function CreateWorkspaceView(options) {
            Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
            var self = this;
            this.context = this.options.context || {};
            this.buttonCollecion = new Backbone.Collection(),

            this.propagateEventsToRegions();
            this.on('dom:refresh', function () {
                if ($._data) {
                    var events = $._data( this.el, "events");
                    if (events &&  events.keydown && events.keydown.length > 1) {
                        var eventName = !_.isEmpty(events.keydown[1].namespace)?
                            events.keydown[1].type  +'.' + events.keydown[1].namespace:events.keydown[1].type;
                        eventName && events.keydown[1].handler && self.$el.off( eventName, events.keydown[1].handler)
                    }
                }
            });
            require(['classifications/widgets/metadata/general.fields/classifications/metadata.general.form.field.controller',
                    'classifications/utils/commands/add.classifications'],
                    function(MetadataClassificationsGeneralFormFieldController, MetadataAddClassificationController) {
                        MetadataClassificationsGeneralFormFieldController.prototype.getGeneralFormFieldsForCreate = function() {
                            return null;
                        }
                        MetadataAddClassificationController.prototype.enabled = function() {
                            return false;
                        };

                    }, function() {
                    })
        },

        _getController: function () {
            return this.options.status.wksp_controller;
        },
        _create: function (options) {
            var namedSessionStorage = new NamedSessionStorage("create_complete_wksp");
            var data = this.metadataAddItemPropView.getValues(),
                dfd = $.Deferred();
            if (!_.isEmpty(data)) {
                data.bo_id = this.options.data.busObjectId;
                data['type'] = 848;

                this.metadataController.createItem(this.node, data)
                    .done(_.bind(function (resp) {
                        if (resp) {
                            var responseData = resp.results && resp.results.data;
                            var nodeId = responseData && responseData.properties && responseData.properties.id;
                            _.extend(options.status, {
                                workspaceNode: new NodeModel({
                                    id: nodeId,
                                    container: true
                                }),
                                viewMode: {
                                    mode: options.data.viewMode ? options.data.viewMode.mode : 'folderBrowse'
                                }
                            });
                            namedSessionStorage.set(options.data.busObjectType+'-'+options.data.busObjectId,nodeId);
                            this._getController().displayWorkspace(options);
                        }
                    }, this))
                    .fail(function (resp) {

                        var error = lang.failedToCreateItem;
                        if (resp) {
                            if (resp.responseJSON && resp.responseJSON.error) {
                                error = resp.responseJSON.error;
                            } else if (resp.responseText) {
                                error = resp.responseText;
                            }
                            ModalAlert.showError(error);
                        }
                        dfd.reject();
                    });
            } else {
                dfd.reject();
            }
            return dfd.promise()
        },
        _createFormCollection: function () {

            var options = this.options || {},
                status = options.status || {},
                context = options.context || {},
                workspaceType = status.workspaceType,
                self = this;
            this.formCollection = new WorkspaceCreateFormCollection(undefined,
                _.defaults(options, {
                    type: workspaceType.get("type"),
                    wsType: workspaceType.get("wksp_type_id"),
                    node: new NodeModel({}, {
                            connector: context.getObject(ConnectorFactory)
                        }
                    ),
                    actionContext: {
                        mode: "create"
                    }
                }));
            this.formCollection.bo_id = options.data.busObjectId;
            this.formCollection.url = function () {
                var path = 'forms/businessworkspaces/create',
                    params = {
                        bo_id: options.data.busObjectId,
                        bo_type: options.data.busObjectType,
                        ext_system_id: options.data.extSystemId
                    },
                    resource = path + '?' + $.param(_.omit(params, function (value) {
                            return value === null || value === undefined || value === '';
                        })),
                    url = context.getObject(ConnectorFactory).connection.url;
                return Url.combine(url && url.replace('/v1', '/v2') || url, resource);
            };

            this.formCollection.on("error", function (model, response, options) {
                var errmsg = response && (new base.Error(response)).message || lang.errorGettingCreateForm;
                log.error("Fetching the create forms failed: {0}", errmsg) && console.error(log.last);
                ModalAlert.showError(errmsg);
                if (_.isEmpty(status.mode)) {
                    self.buttonCollecion.length>=2 && self.buttonCollecion.at(1).set('disabled', false);
                }
                self.tileView.contentView.metadataHeaderView.metadataItemNameView.remove( );
                self.footerView && self.footerView.update();
            });

            this.formCollection.on("sync", function () {
                self._updateNameAndView(self.node, self.formCollection)
            });

        },
        _updateNameAndView: function (nodeModel, formCollection) {
            var general = formCollection.at(0);

            var data = general.get("data");
            if (data) {
                var name = data.name;
                log.debug("name fetched and used: {0}", name) && console.log(log.last);
                nodeModel.set({name: name});
            } else {
                log.debug("name set to empty.") && console.log(log.last);
                nodeModel.set({name: ""});
            }

            var metadataView = this.tileView.contentView,
                headerView = metadataView && metadataView.metadataHeaderView,
                nameView = headerView && headerView.metadataItemNameView;
            if (nameView) {
                var gs = general.get("schema"),
                    isReadOnly = (gs && gs.properties && gs.properties.name && gs.properties.name.readonly) ? true : false,
                    placeHolder = isReadOnly ? lang.nameIsGeneratedAutomatically : undefined;
                nameView.setPlaceHolder(placeHolder);
                if ((isReadOnly ? true : false) !== (nameView.readonly ? true : false)) {
                    nameView.setReadOnly(isReadOnly);
                }
            }
        },
        render: function () {

            var self = this,
                options = this.options || {},
                context = options.context || {},
                status = this.options.status || {};

            Marionette.LayoutView.prototype.render.apply(this, arguments);

            this.buttonCollecion.add({
                click: _.bind(this._create, this, this.options),
                disabled: true, primary: false,
                label: lang.createWorkspace, toolTip: lang.createWorkspaceTooltip
            });
            if (_.isEmpty(status.mode)) {
                this.buttonCollecion.add({
                    click: _.bind(function () {
                        var dfd = $.Deferred();
                        this._getController().selectWorkspace();
                        dfd.resolve();
                        return dfd.promise();
                    }, this, this.options),
                    disabled: true, primary: false, toolTip: lang.cancel,
                    label: lang.cancel, separate: false
                });
            }

            this.footerView = new FooterView({
                collection: this.buttonCollecion
            });
            this.node = new NodeModel({
                type_name: lang.businessWorkspaceTypeName,
                type: 848,
                container: true,
                rm_enabled: this.options.status.workspaceType.get('rm_enabled'), 
                name: "" // start with empty name
            }, {
                connector: context.getObject(ConnectorFactory)
            });

            this._createFormCollection();
            this.metadataController = new WorkspaceMetadataController(undefined, {
            });

            var CreatePropertiesView = MetadataActionOneItemPropertiesView.extend({
                    constructor: function CreatePropertiesView(options) {
                        MetadataActionOneItemPropertiesView.prototype.constructor.apply(this, arguments);
                        if (this.metadataPropertiesView !== undefined) {
                            this.metadataPropertiesView.stopListening(this);
                        }

                        this.metadataPropertiesView = new MetadataPropertiesView({
                            node: self.node,
                            context: self.options.context,
                            formMode: 'create',
                            action: 'create',
                            metadataView: this,
                            formCollection: self.formCollection
                        });
                        this.listenTo(this.metadataPropertiesView, 'render:forms', function () {
                            self.buttonCollecion.at(0).set('disabled', false);
                            if (_.isEmpty(status.mode)) {
                                self.buttonCollecion.at(1).set('disabled', false);
                                self.buttonCollecion.at(0).set('primary', true);
                            } else {
                                self.buttonCollecion.at(0).set('primary', true);
                            }

                            self.footerView.update();
                        });

                        this.listenTo(this.metadataPropertiesView, 'before:render', function () {
                            var conwsRef = this.metadataPropertiesView.collection.findWhere({id: "conws-reference"});
                            if (conwsRef) {
                                this.metadataPropertiesView.collection.remove(conwsRef, {silent: true});
                            }
                        });
                    }
                }
            );

            this.tileView = new TileView({
                title: lang.pageTitle,
                contentView: CreatePropertiesView,
                contentViewOptions: {
                    model: this.node,
                    context: context,
                    action: 'create',
                    formCollection: this.formCollection
                }
            });

        },
        onBeforeShow: function () {
            this.content.show(this.tileView);
            this.footer.show(this.footerView);
            this.metadataAddItemPropView = this.tileView.contentView;
        }
    });

    _.extend(CreateWorkspaceView.prototype, LayoutViewEventsPropagationMixin);
    return CreateWorkspaceView;
});

