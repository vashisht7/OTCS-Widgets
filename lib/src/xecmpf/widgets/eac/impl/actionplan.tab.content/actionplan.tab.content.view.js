/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/utils/base', 
    'csui/utils/contexts/factories/connector',
    'csui/controls/tab.panel/tab.panel.view',
    'csui/controls/tab.panel/tab.links.ext.view',
    'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
    'csui/models/form', 
    'csui/controls/form/form.view',
    'csui/controls/globalmessage/globalmessage',
    'csui/widgets/metadata/metadata.properties.view',
    'csui/controls/progressblocker/blocker',
    'csui/controls/tile/behaviors/perfect.scrolling.behavior',
    'xecmpf/widgets/eac/impl/actionplan.processmode/actionplan.processmode.view',
    'xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode.form.model',
    'xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules.form.model',
    'xecmpf/widgets/eac/impl/actionplan.rules/actionplan.rules.view',
    'xecmpf/widgets/eac/impl/actionplan.actions/actionplan.actions.view',
    'i18n!xecmpf/widgets/eac/impl/nls/lang'
], function(_, $, Backbone, base, ConnectorFactory, TabPanelView, TabLinkCollectionViewExt,
    TabLinksScrollMixin, FormModel, FormView, GlobalMessage, MetaDataPropertiesView, BlockingView, PerfectScrollingBehavior, ProcessModeView, ProcessModeFormModel, EACRuleFormModel, RulesView, ActionsView, lang) {
    var ACTIONPLAN_CONTENT_VIEW_CONST = {
        ERROR_ACTION_PLAN_CREATION: lang.genericWarningMsgOnDeletion
    };
    var ActionPlanContentView = TabPanelView.extend({

        className: (base.isTouchBrowser() ? 'cs-touch-browser ' : '') +
            'cs-metadata-actionplan-content cs-metadata-properties binf-panel binf-panel-default',

        contentView: function(model) {
            var contentView = FormView;
            var panel = _.findWhere(this._propertyPanels, {
                model: model
            });
            if (panel) {
                return panel.contentView || FormView;
            } 
            switch (model.get('role_name')) {
                case 'rules':
                    contentView = RulesView;                    
                break;
                case 'actions':
                    contentView = ActionsView;
                break;
                case 'processMode':
                    contentView = ProcessModeView;
                break;
            }
            return contentView;
        },

        contentViewOptions: function(model) {
            var eventModel = this.options.node;
            var options = {
                    eventModel: eventModel,
                    context: this.options.context
                },
                panel = _.findWhere(this._propertyPanels, {
                    model: model
                });

            switch (model.get('role_name')) {
                case 'rules':
                    var actionPlanRuleModels,
                        actionPlanRulescollection = new Backbone.Collection(),
                        actionPlanRules = [{}],
                        eacRuleFormModel;
                    if (eventModel && eventModel.get('rules') && eventModel.get('rules').length > 0) {
                        actionPlanRules = eventModel.get('rules');
                    }
                    actionPlanRuleModels = actionPlanRules.map(function(rule, index) {
                        return new Backbone.Model({
                            sequence: index + 1,
                            operand: rule.operand || '',
                            operator: rule.operator || '',
                            to: rule.value || '',
                            conjunction: rule.conjunction || ''
                        });
                    });
                    actionPlanRulescollection.set(actionPlanRuleModels);
                    eacRuleFormModel = new EACRuleFormModel(undefined, {
                        context: this.options.context,
                        eventModel: eventModel,
                        collection: actionPlanRulescollection
                    });
                    _.extend(options, {
                        mode: 'create',
                        model: eacRuleFormModel,
                        isNewActionPlan: !eventModel.get('plan_id')
                    }); 
                break;
                case 'actions':
                    _.extend(options, {
                        summary: false
                    });
                break;
                case 'processMode':
                    var processModeModel = new ProcessModeFormModel(undefined, {
                        context: this.options.context,
                        eventModel: eventModel
                    });
                    _.extend(options, {
                        mode: 'create',
                        model: processModeModel
                    });
            }
            if (panel) {
                _.extend(options, panel.contentViewOptions);
            }            
            return options;
        },
        isTabable: function() {
            if (this.options.notTabableRegion === true) {
                return false;
            }
            return true; // this view can be reached by tab
        },

        constructor: function ActionPlanContentView(options) {
            options || (options = {});

            _.defaults(options, {
                tabType: 'binf-nav-pills',
                mode: 'spy',
                extraScrollTopOffset: 3,
                formMode: 'create',
                toolbar: true,
                contentView: this.getContentView,
                TabLinkCollectionViewClass: TabLinkCollectionViewExt,
                tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                    ' select:not([disabled]), textarea:not([disabled]),' +
                    ' button:not([disabled]), iframe, object, embed,' +
                    ' *[tabindex], *[cstabindex], *[contenteditable]'
            });
            options.collection = new Backbone.Collection();
            var tabItemsCollection = new Backbone.Collection();
            var tabItems = [{
                role_name: "rules",
                title: lang.rulesTabLabel
            }, {
                role_name: "actions",
                title: lang.actionsTabLabel,
                required: true
            }, {
                role_name: 'processMode',
                title: lang.processModeTabLabel,
                required: true
            }];
            tabItems.forEach(function(tabItem) {
                tabItemsCollection.push(new Backbone.Model(tabItem));
            });
            this.eacEventActionPlans = tabItemsCollection;            

            TabPanelView.prototype.constructor.apply(this, arguments);
            this.connector = this.options.context.getObject(ConnectorFactory);

            if (this.options.blockingParentView) {
                BlockingView.delegate(this, this.options.blockingParentView);
            } else {
              BlockingView.imbue(this);
            }

            this.listenTo(this.eacEventActionPlans, "request", this.blockActions)
                .listenTo(this.eacEventActionPlans, "request", this._checkFormFetching)
                .listenTo(this.eacEventActionPlans, "sync", this._syncForms)
                .listenTo(this.eacEventActionPlans, "sync", this.unblockActions)
                .listenTo(this.eacEventActionPlans, "destroy", this.unblockActions)
                .listenTo(this.eacEventActionPlans, "error", this.unblockActions)
                .listenTo(this.collection, "reset", this.render);

            this.eacEventActionPlans.trigger('sync');
            if (this.eacEventActionPlans.fetching) {
                this.blockActions();
            }

            $(window).on('resize', _.bind(this._onWindowResize, this));
            this.listenTo(this, 'render', this.onRendered);
        },
        behaviors: {
            PerfectScrolling: {
                behaviorClass: PerfectScrollingBehavior,
                contentParent: '> .binf-tab-content',
                scrollXMarginOffset: 30,
                scrollYMarginOffset: 15
            }
        },
        onBeforeDestroy: function() {
            $(window).off('resize', this._onWindowResize);
        },

        render: function() {            
            TabPanelView.prototype.render.apply(this);
            this._initializeOthers();
            return this;
        },

        onRendered: function() {
            this._setTablinksAttributes();
            setTimeout(_.bind(this._setTablinksAttributes, this), 300);
            this.tabLinks.stopListening(this.collection, 'reset');
            this.tabContent.stopListening(this.collection, 'reset');
            this.tabLinks.$el.addClass('binf-hidden');
            this.tabContent.$el.addClass('binf-hidden');

            this.blockActions();

            var allFormsRendered = [],
                self = this;
            this.tabContent.children.each(_.bind(function(childView) {
                var formRendered = $.Deferred();
                allFormsRendered.push(formRendered.promise());
                if (childView.content instanceof FormView) {
                    this.listenTo(childView.content, 'render:form', function() {
                        formRendered.resolve();
                    });
                } else {
                    formRendered.resolve();
                }
            }, this));
            $.when.apply($, allFormsRendered).done(function() {
                self.unblockActions();
                self.tabLinks.$el.removeClass('binf-hidden');
                self.tabContent.$el.removeClass('binf-hidden');
                self._initializeOthers();
                self.triggerMethod('render:forms', this);
                var event = $.Event('tab:content:render');
                self.$el.trigger(event);

                self.trigger('update:scrollbar');

            });
        },

        onPanelActivated: function() {
            setTimeout(_.bind(function() {
                this._setTablinksAttributes();
                this._enableToolbarState('.tab-links .tab-links-bar > ul li');
            }, this), 300);
        },

        _setTablinksAttributes: function() {
            var i, limit = 5;
            var siblings, parent = this.$el.parent();
            for (i = 0; i < limit; i++) {
                siblings = parent.siblings('.cs-tab-links.binf-dropdown');
                if (siblings.length > 0) {
                    var width = $(siblings[0]).width();
                    if (width > 15) {
                        var newWidth = width - 12,
                            widForEle = newWidth + "px",
                            dirForEle = this.rtlEnabled ? "margin-right" : "margin-left",
                            tabLinksEle = this.$el.find('.tab-links');

                        tabLinksEle.css({
                            "width": function() {
                                return "calc(100% - " + widForEle + ")";
                            }
                        });

                        tabLinksEle.css(dirForEle, widForEle);
                    }
                    break;
                }
                parent = parent.parent();
            }
        },

        _syncForms: function() {
            this._fetchingForms = false;
            var panelModels = this.eacEventActionPlans.where({
                role_name: 'rules'
            });
            panelModels = _.union(panelModels, this.eacEventActionPlans.where({
                role_name: 'actions'
            }));
            panelModels = _.union(panelModels, this.eacEventActionPlans.where({
                role_name: 'processMode'
            }));

            this.panelModelsLength = panelModels.length;
            this._normalizeModels(panelModels);
            this.collection.reset(panelModels);
        },

        _normalizeModels: function(models) {
            _.each(models, function(model) {
                if (model instanceof FormModel) {
                    var schema = model.get('schema');
                    if (schema && schema.title) {
                        model.set('title', schema.title);
                    }
                }
                if (model.get('id') == null) {
                    model.set('id', model.cid);
                }
                if (model.collection) {
                    model.collection.remove(model);
                }
            });
        },
        _initializeOthers: function() {
            var options = {
                gotoPreviousTooltip: '',
                gotoNextTooltip: ''
            };
            this._initializeToolbars(options);
            this._listenToTabEvent();
            setTimeout(_.bind(this._enableToolbarState, this), 300);
        },

        _onWindowResize: function() {
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            this.resizeTimer = setTimeout(_.bind(function() {
                this._setTablinksAttributes();
                this._enableToolbarState();
            }, this), 200);
        },
        saveActionPlanContent: function() {
            if (this.isAllFormsValid()) { // validate forms
               return this.makeActionPlanServiceCall();
            } else {
                return $.Deferred().reject('FORM_NOT_VALID');
            }
        }, 
        isAllFormsValid: function() {
            var formIsValid = true;
            this.tabContent.children.forEach(function(childView) {
                var roleName = childView.model.get('role_name');                
                if (childView.content.isFormValid) {
                    if (!childView.content.isFormValid()) {
                        formIsValid = false;
                    }
                } else if (childView.content instanceof FormView) {
                    if (!childView.content.validate()) {
                        formIsValid = false;
                    }
                } 
            });
            return formIsValid;
        },
        getFormsData: function() {
            var formsData = {};
            this.tabContent.children.forEach(function(childView) {
                var roleName = childView.model.get('role_name');
                roleName = roleName === 'processMode'? 'summary' : roleName;   

                if (childView.content.getSubmitData) {
                    formsData[roleName] = childView.content.getSubmitData(); 
                } else if (childView.content instanceof FormView) {
                    formsData[roleName] = childView.content.getValues();
                } 
            });
            return formsData;
        },
        getGeneralInformation: function() {
            var generalInfo = {};
            var actionPlanModel = this.options.node;
            generalInfo['event_id'] = actionPlanModel.get('event_id');
            generalInfo['namespace'] = actionPlanModel.get('namespace');
            generalInfo['event_name'] = actionPlanModel.get('event_name');
            generalInfo['rule_id'] = actionPlanModel.get('rule_id');
            generalInfo['plan_id'] = actionPlanModel.get('plan_id');
            return generalInfo;
        },              
        makeActionPlanServiceCall: function() {
            var that = this,
                actionPlanUrl = this.connector.getConnectionUrl().getApiBase('v2') + '/eventactioncenter/actionplan',
                actionPlanRequestData = new FormData(),
                requestData = this.getFormsData(),
                $deferred = $.Deferred(); 

            requestData['gen_information'] = this.getGeneralInformation(); // general information               
            actionPlanRequestData.append('action_plan_items', JSON.stringify(requestData));
            this.blockActions();
            this.connector.makeAjaxCall({
                type: "PUT",
                url: actionPlanUrl,
                data: actionPlanRequestData,
                processData: false,
                contentType: false
            }).then(function(response) {
                if (response.results.statusCode === 200 && response.results.ok) {
                    GlobalMessage.showMessage('success', response.results.msg);
                    var eventInfo = {
                        planID: response.results.data.planID,
                        operation: requestData.gen_information.plan_id !== ''? 'update' : 'create',
                        event_id: requestData.gen_information.event_id
                    };
                    that.trigger('refresh:current:action:plan:item', eventInfo); // Only current action plan item should be refreshed
                    $deferred.resolve(); // saved
                } else {
                    $deferred.reject('FORM_NOT_SAVED'); // not saved
                }

            }, function(xhr) {
                var messageToShow = (xhr.responseJSON && (xhr.responseJSON.errorDetail || xhr.responseJSON.error)) || ACTIONPLAN_CONTENT_VIEW_CONST.ERROR_ACTION_PLAN_CREATION;
                GlobalMessage.showMessage('error', messageToShow);
                $deferred.reject('FORM_NOT_SAVED'); // not saved
            }).always(function() {
                that.unblockActions();
            });
            return $deferred.promise();
        }

    });

    _.extend(ActionPlanContentView.prototype, TabLinksScrollMixin);

    return ActionPlanContentView;
});