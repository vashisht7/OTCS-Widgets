/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    "csui/lib/jquery",
    'csui/lib/marionette',
    'csui/lib/backbone',

    'conws/widgets/outlook/impl/folder/impl/folders.model',
    'conws/widgets/outlook/impl/folder/folder.view',
    'conws/widgets/outlook/impl/utils/utility',

    'i18n!conws/widgets/outlook/impl/nls/lang',
    'hbs!conws/widgets/outlook/impl/folder/impl/folders',
    'css!conws/widgets/outlook/impl/conwsoutlook'
], function (_, $, Marionette, Backbone, FoldersModel, FolderView, WkspUtil, lang, template) {
    var foldersView = Marionette.CompositeView.extend({
        className: 'folders-conwsoutlook',

        template: template,

        childView: FolderView,
        
        childViewContainer: '#folders-list',

        templateHelpers: function () {
            return {
                id: this.id,
                showMoreLink: lang.showMore_link,
                showMoreFoldersTitle: lang.showMore_folders
            };
        },

        events: {
            'click #moreLink': 'retrieveNextPage'
        },

        initialize: function (options) {

        },

        constructor: function foldersView(options) {
            options.model = new FoldersModel({}, options);
            this.parentNode = options.parentNode;
            this.id = options.id;
            this.pageNo = options.pageNo;

            Marionette.CompositeView.prototype.constructor.call(this, options);

            this.listenTo(this.model, 'sync', this.renderFolders);
            options.model.fetch();
        },

        retrieveNextPage: function (options) {
            var targetId = $(options.currentTarget).data("id");
            if (targetId !== this.id) {
                return;
            }
            var collection = this.model.get('collection'),
                paging = collection ? collection.paging : null;
            if (paging && paging.links && paging.links.data && paging.links.data.next && paging.links.data.next.href) {
                this.model.nextPageUrl = paging.links.data.next.href;
                this.model.fetch();
            }
        },

        renderFolders: function (model, response, options) {
            var self = this,
                collection = model.get('collection'),
                paging = collection ? collection.paging : null;

            var isFirstPage = paging == null || paging.links == null || paging.links.data == null || paging.links.data.previous == null;
            var values = model.get('results');

            if (isFirstPage) {
                self.parentNode.folderRetrieved = true;
                self.parentNode.toggleStatus = WkspUtil.ToggleStatusCollapse;
                self.parentNode.folderExpended = true;
                if (values.length === 0) {
                    self.parentNode.model.set("hasChild", false);
                } else {
                    self.parentNode.model.set("hasChild", true);
                }
            }

            if (values.length !== 0 || !isFirstPage) {
                if (self.collection == null) {
                    self.collection = new Backbone.Collection(values);
                    self.render();
                } else {
                    var origLength = self.collection.length; //original length before addition
                    self.collection.add((new Backbone.Collection(values)).toJSON());
                    self._addItems(self.collection.slice(origLength), origLength); //get latest added models   
                }
            }

            self.$('.moreLink').each(function() {
                var button = $(this);
                if (button.data('id') === self.id) {
                    if (paging && paging.links && paging.links.data && paging.links.data.next && paging.links.data.next.href) {
                        button.css("display", "block");
                    } else {
                        button.css("display", "none");
                    }
                }
            });
        },

        _addItems: function (models, collIndex) {
            var self = this,
                ChildView;

            _.each(models, function (model, index) {
                ChildView = self.getChildView(model);
                self._addChild(model, ChildView, collIndex + index);
            });
        },

        _addChild: function (child, ChildView, index) {
            return Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
        }

    });

    return foldersView;

});
