/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',
    'csui/utils/namedsessionstorage',
    'xecmpf/widgets/workspaces/controls/tile/tile.view',
    'xecmpf/widgets/workspaces/controls/footer/footer.view',
    "csui/widgets/metadata/metadata.properties.view",
    'csui/widgets/metadata/metadata.action.one.item.properties.view',
    'csui/models/node/node.model',
    'csui/utils/contexts/factories/connector',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/behaviors/keyboard.navigation/tabables.behavior',
    'csui/utils/url',
    'csui/utils/commands',
    'conws/models/workspacecreateforms',
    'i18n!xecmpf/widgets/workspaces/pages/update.workspace/impl/nls/lang',
    'hbs!xecmpf/widgets/workspaces/pages/update.workspace/impl/update.workspace',
    'css!xecmpf/widgets/workspaces/pages/update.workspace/impl/update.workspace'

], function (module, $, _, Backbone, Marionette, log, base,
             NamedSessionStorage,
             TileView,
             FooterView,
             MetadataPropertiesView,
             MetadataActionOneItemPropertiesView,
             NodeModel,
             ConnectorFactory,
             ModalAlert,
             LayoutViewEventsPropagationMixin,
             TabablesBehavior,
             Url,
             commands,
             WorkspaceCreateFormCollection,
             lang,
             template,
             css) {
    var propCmds = commands.clone();
    propCmds.reset();

    var UpdateWorkspaceView = Marionette.LayoutView.extend({

        tagName: "div",
        id: "xecmpf-update_wksp",
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

        constructor: function UpdateWorkspaceView(options) {
            var self = this;
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            this.context = this.options.context || {};
            this.propagateEventsToRegions();
            this.readOnlyCats = {};
            this.readOnlyCatVals = {};
            this.on('dom:refresh', function () {
                if ($._data) {
                    var events = $._data(this.el, "events");
                    if (events && events.keydown && events.keydown.length > 1) {
                        var eventName = !_.isEmpty(events.keydown[1].namespace) ?
                            events.keydown[1].type + '.' + events.keydown[1].namespace : events.keydown[1].type;
                        eventName && events.keydown[1].handler && self.$el.off(eventName, events.keydown[1].handler)
                    }
                }
            });
            var readOnlyCats = this.readOnlyCats,
                readOnlyCatVals = this.readOnlyCatVals;

            this._saveField = function (args) {
                if (this.mode === 'create') {
                    return;
                }
                var values = this.getValues(),
                    self = this;
                var currentId = this.model.get("id");
                _.chain(readOnlyCats).each(function (readOnlyCatModel, id) { // => id = 'catgpory => 52238'

                    if  ( (currentId !== undefined) &&  (currentId !== id) ){
                        return true;
                    }
                    _.chain(readOnlyCatModel.properties).each(function (schemaDef, key) { // key =>52238_2
                        if (schemaDef.type === 'object') {
                            _.chain(schemaDef.properties).each(function (setFieldDef, setFieldKey) { // setFieldKey => "52238_2_1_6"
                                if (setFieldDef.readonly === true) {
                                    values[key][setFieldKey] = readOnlyCatVals[id + ':' + key + ':' + setFieldKey];
                                }
                            })
                        } else if (schemaDef.type === 'array' && _.has(schemaDef, 'items')) {
                            var tabProps = schemaDef.items.properties;
                            _.chain(tabProps).each(
                                function (tabField, tabKey) { //  tabkey => 34359_9_x_10
                                    if (tabField.readonly === true) {
                                        _.chain(values[key]).each(function (tableRow, index) {
                                            var readOnlyVal = readOnlyCatVals[id + ':' + key + ':' +  index + ':' + tabKey];
                                            if (!_.isUndefined(readOnlyVal)) {
                                                tableRow[tabKey] = readOnlyVal;
                                            }
                                        });
                                    }
                                })

                        } else if (schemaDef.readonly === true) { // simple or array type
                            values[key] = readOnlyCatVals[id + ':' + key];
                        }
                    })
                })

                this._saveChanges(values);
            }
        },
        _getController: function () {
            return this.options.status.wksp_controller;
        },
        _createFormCollection: function () {
            var self = this,
                options = this.options || {},
                context = options.context,
                status = options.status,
                workspace = status.workspace;
            this.formCollection = new WorkspaceCreateFormCollection(undefined,
                _.defaults(options, {
                    type: workspace.get("type"),
                    wsType: workspace.get("wnf_wksp_type_id"),
                    node: new NodeModel(undefined, {
                            connector: context.getObject(ConnectorFactory)
                        }
                    )
                }));
            this.formCollection.bo_id = options.data.busObjectId;
            this.formCollection.url = function () {

                var path = 'forms/businessworkspaces/create',
                    params = {
                        template_id: workspace.get("wnf_wksp_template_id"),
                        parent_id: workspace.get("parent_id"),
                        ext_system_id: options.data.extSystemId,
                        bo_type: options.data.busObjectType,
                        bo_id: options.data.busObjectId,
                        completeWorkspace: true
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
            });

        },
        _updateWorkspaceReference: function (model, formsValues) {
            var formData = new FormData();
            formData.append('body', JSON.stringify(formsValues));

            var options = {
                type: 'PUT',
                url: Url.combine(model.connector.connection.url.replace('/v1', '/v2'),
                    'businessworkspaces', model.get("id"), 'workspacereferences'),
                data: formData,
                contentType: false,
                processData: false
            };
            return model.connector.makeAjaxCall(options);
        },
        _complete: function (options) {
            var namedSessionStorage = new NamedSessionStorage("create_complete_wksp");
            var self = this,
                data = this.tileView.contentView.getValues(),
                dfd = $.Deferred();

            if (!_.isEmpty(data)) {
                var context = options.context || {},
                    status = options.status,
                    workspace = status.workspace;
                var nodeId = workspace.get("id");

                self._updateWorkspaceReference(
                    new NodeModel({
                        id: nodeId
                    }, {
                        connector: context.getObject(ConnectorFactory)
                    }),
                    {
                        bo_type: self.getOption("data").busObjectType,
                        bo_id: self.getOption("data").busObjectId,
                        ext_system_id: self.getOption("data").extSystemId
                    }).done(_.bind(function (resp) {
                    dfd.resolve();
                    if (resp) {
                        _.extend(status, {
                            workspaceNode: new NodeModel({
                                id: nodeId,
                                container: true
                            }),
                            viewMode: {
                                mode: options.data.viewMode ? options.data.viewMode.mode : 'folderBrowse'
                            }
                        });
                        namedSessionStorage.set(options.data.busObjectType+'-'+options.data.busObjectId,nodeId);
                        self._getController().displayWorkspace(options);
                    }
                }, this))
                    .fail(function (resp) {
                        var error = lang.failedToUpdateItem;
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
            }
            else {
                $('.binf-has-error') && $('.binf-has-error')[0].scrollIntoView()
                dfd.reject();
            }
            
            return dfd.promise();
        },
        _setHeader: function (model) {
            var general = this.formCollection.at(0);
            var data = general.get("data");
            if (data) {
                var name = data.name,
                    self = this;
                log.debug("name fetched and used: {0}", name) && console.log(log.last);
                this.node.set("name", name);
            } else {
                log.debug("name set to empty.") && console.log(log.last);
                this.node.set("name", "");
            }

            var headerView = this.tileView.contentView.metadataHeaderView,
                nameView = headerView && headerView.metadataItemNameView;

            if (nameView) {
                var gs = general.get("schema"),
                    isReadOnly = (gs && gs.properties && gs.properties.name && gs.properties.name.readonly) ? true : false,
                    placeHolder = isReadOnly ? lang.nameIsGeneratedAutomatically : undefined;
                nameView.setPlaceHolder(placeHolder);
                if ((isReadOnly ? true : false) !== (nameView.readonly ? true : false)) {
                    nameView.setReadOnly(isReadOnly);
                }
                nameView.stopListening(this.node);
            }
        },
        _updateModel: function (model) {
            var self = this;
            this._setHeader(model);
            if (model) {
                this.formCollection.models.forEach(function (formModel) {
                    var formData = formModel.get("data"),
                        formSchema = formModel.get("schema");
                    if (_.has(formSchema.properties, model.get("id"))) { // =>52238
                        var modelId = model.get("id"),  // =>52238
                            origModelSchema = model.get("schema"),
                            formSchemaDef = formSchema.properties[modelId];

                        formModel = formData[modelId];
                        _.chain(formSchemaDef.properties).each(
                            function (field, key, list) { // key =>52238_2
                                if (_.has(origModelSchema.properties, key)) {  // 'catgpory => 52238'  key =>52238_2
                                    var formProps = field.properties,
                                        origModelData = model.get("data")[key],
                                        origModelFieldSchema = origModelSchema.properties[key],
                                        formModelData = formModel[key];
                                    if (field.type === 'object') {
                                        var origModelSetSchema = origModelFieldSchema.properties;
                                        _.chain(formProps).each(
                                            function (setField, setFieldKey) { //  setFieldKey => "52238_2_1_6"
                                                if (setField.readonly === true) {
                                                    origModelSetSchema[setFieldKey].readonly = setField.readonly;
                                                    self.readOnlyCatVals[modelId + ':' + key + ':' + setFieldKey] = origModelData[setFieldKey];
                                                    self.readOnlyCats[modelId] = origModelSchema;
                                                    origModelData[setFieldKey] = formModelData[setFieldKey];
                                                }
                                            })
                                    }
                                    else if (field.type === 'array' && _.has(field, 'items')) {
                                        var formTabularProps = field.items.properties,
                                            origModelTabSchema = origModelFieldSchema.items.properties;

                                        _.chain(formTabularProps).each(
                                            function (tabField, tabKey) { //  tabkey => 34359_9_x_10
                                                if (tabField.readonly === true) {
                                                    origModelTabSchema[tabKey].readonly = tabField.readonly;

                                                    _.chain(formModelData).each(function (tableRow, index) {
                                                        origModelData[index] || (origModelData[index] = {});
                                                        self.readOnlyCatVals[modelId + ':' + key + ':' + index + ':' + tabKey] =
                                                            origModelData[index][tabKey];
                                                        origModelData[index][tabKey] = tableRow[tabKey]
                                                    });

                                                    self.readOnlyCats[modelId] = origModelSchema;
                                                }
                                            })


                                    }
                                    else if (field.readonly) { // simple/array field type string
                                        origModelFieldSchema.readonly = field.readonly;
                                        self.readOnlyCatVals[modelId + ':' + key] = origModelData;
                                        self.readOnlyCats[modelId] = origModelSchema;
                                        model.get("data")[key] = formModelData;
                                    }
                                }
                            }
                        );
                    }
                });
            }
        },
        fetchForm: function () {
            this._createFormCollection();
            return this.formCollection.fetch();
        },
        render: function () {
            var self = this,
                status = this.options.status,
                workspace = status.workspace,
                buttonCollecion = new Backbone.Collection([
                    {
                        click: _.bind(this._complete, this, this.options),
                        disabled: true, primary: false,
                        label: lang.completeWorkspace, toolTip: lang.completeWorkspaceTooltip
                    },
                    {
                        click: _.bind(function () {
                            var dfd = $.Deferred();
                            this._getController().selectWorkspace();
                            dfd.resolve();
                            return dfd.promise()
                        }, this, this.options),
                        disabled: true, primary: false, toolTip: lang.cancel,
                        label: lang.cancel, separate: false
                    }
                ]);

            Marionette.LayoutView.prototype.render.apply(this, arguments);

            this.node = new NodeModel({
                    type_name: workspace.get("type_name"),
                    type: workspace.get("type"),
                    name: workspace.get("name"),
                    id: workspace.get("id"),
                    container: true
                },
                {
                    connector: this.context.getObject(ConnectorFactory)
                }
            );
            var CompleteMetadataPropertiesView = MetadataPropertiesView.extend({
                contentViewOptions: function (model) {
                    self._updateModel(model)
                    return MetadataPropertiesView.prototype.contentViewOptions.apply(this, arguments);
                }
            });

            var UpdatePropertiesView = MetadataActionOneItemPropertiesView.extend({
                    constructor: function UpdatePropertiesView(options) {
                        MetadataActionOneItemPropertiesView.prototype.constructor.apply(this, arguments);
                        if (this.metadataPropertiesView !== undefined) {
                            this.metadataPropertiesView.stopListening(this);
                        }
                        this.metadataPropertiesView = new CompleteMetadataPropertiesView({
                            node: self.node,
                            commands: propCmds,
                            context: self.options.context,
                            formMode: 'update',
                            action: 'update',
                            metadataView: this
                        });


                        this.listenTo(this.metadataPropertiesView, 'render:forms', function () {
                            buttonCollecion.at(0).set('disabled', false);
                            buttonCollecion.at(1).set('disabled', false);
                            buttonCollecion.at(0).set('primary', true);
                            self.footerView.update();
                            this.metadataPropertiesView.tabContent.children.each(function(child, key) {
                                if (child.model.get('role_name') === 'categories') {
                                    child.content.off('change:field');
                                    child.content._saveField = function(args) {
                                        self._saveField.apply(this,args);
                                    }
                                    child.content.listenTo(child.content, 'change:field', child.content._saveField);

                                }
                            })
                        });
                        this.listenTo(this.metadataPropertiesView, 'before:render',
                            function () {
                                var conwsRef = this.metadataPropertiesView.collection.findWhere({id: "conws-reference"});
                                if (conwsRef) {
                                    this.metadataPropertiesView.collection.remove(conwsRef, {silent: true});
                                }
                            });
                    }
                }
            );
            this.footerView = new FooterView({
                collection: buttonCollecion
            });

            this.tileView = new TileView({
                title: lang.pageTitle,
                contentView: UpdatePropertiesView,
                contentViewOptions: {
                    model: this.node,
                    context: this.options.context,
                    action: 'update'
                }
            });


        },
        onBeforeShow: function () {
            this.content.show(this.tileView);
            this.footer.show(this.footerView);
        }
    });
    _.extend(UpdateWorkspaceView.prototype, LayoutViewEventsPropagationMixin);
    return UpdateWorkspaceView;
});

