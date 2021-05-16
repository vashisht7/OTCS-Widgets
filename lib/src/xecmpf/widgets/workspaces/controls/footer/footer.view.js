/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/behaviors/keyboard.navigation/tabable.region.behavior',
    'csui/behaviors/keyboard.navigation/tabables.behavior',
    'css!xecmpf/widgets/workspaces/controls/footer/impl/footer'
], function (Marionette, _, $, TabableRegion) {

    var ButtonView = Marionette.ItemView.extend({

        tagName: 'button',
        className: 'binf-btn',
        template: false,
        triggers: {
            'click': 'click'
        },
        behaviors: {
            TabableRegion: {
                behaviorClass: TabableRegion
            }
        },

        constructor: function ButtonView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        isTabable: function () {
            return this.$el.is(':not(:disabled)') && this.$el.is(':not(:hidden)');
        },
        currentlyFocusedElement: function () {
            if (this.$el.prop('tabindex') === -1) {
                this.$el.prop('tabindex', 0);
            }
            return this.$el;
        },
        onRender: function () {
            var $button = this.$el;
            $button.text(this.model.get("label"));
            $button.addClass(this.model.get('primary') ? 'binf-btn-primary' : 'binf-btn-default');
            $button.attr('title', (this.model.get("toolTip") ? this.model.get("toolTip") : ""));

            if (this.model.get("separate")) {
                $button.addClass('cs-separate');
            }
            this.updateButton(this.model);
        },

        updateButton: function (model) {
            var $button = this.$el;

            if (model.get("hidden") !== undefined) {
                if (model.get("hidden")) {
                    $button.addClass('hidden');
                } else {
                    $button.removeClass('hidden');
                }
            }

            if (model.get("primary") === true) {
                $button.removeClass('binf-btn-default');
                $button.addClass('binf-btn-primary');
            } else {
                $button.addClass('binf-btn-default');
            }

            if (model.get("disabled") !== undefined) {
                $button.prop('disabled', model.get("disabled"));
            }
        }

    });

    var FooterView = Marionette.CollectionView.extend({
        id: "wksp_footer",
        tagName: "div",
        className: "binf-modal-footer",
        childView: ButtonView,

        constructor: function FooterView(options) {
            Marionette.CollectionView.prototype.constructor.apply(this, arguments);
            this.listenTo(this, 'childview:click', this.onClickButton);
        },
        onDomRefresh: function () {
            this.children.each(function (buttonView) {
                buttonView.trigger('dom:refresh');
            });
        },
        onClickButton: function (buttonView) {
            buttonView.$el.prop('disabled', true);

            if (buttonView.model.get("click")) {
                buttonView.model.get("click")().fail(function () {
                        buttonView.$el.prop('disabled', false);
                    }
                )
            }
        },
        update: function () {
            var self = this;
            this.collection.models.forEach(function (buttonModel) {
                self.children
                    .findByModel(buttonModel)
                    .updateButton(buttonModel);
            });
        }
    });

    return FooterView;
});