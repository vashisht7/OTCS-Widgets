/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/marionette3',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/controls/progressblocker/blocker',
    'csui/controls/charts/visual.count/impl/chart.types/bar/visual.count.verticalbar.view',
    'csui/controls/charts/visual.count/impl/chart.types/bar/visual.count.horizontalbar.view',
    'csui/controls/charts/visual.count/impl/chart.types/pie/visual.count.donut.view',
    'csui/controls/charts/visual.count/impl/chart.types/pie/visual.count.pie.view',
    'csui/controls/charts/visual.count/impl/visual.count.empty.view',
    'hbs!csui/controls/charts/visual.count/impl/visual.count',
    'css!csui/controls/charts/visual.count/impl/visual.count'
], function(Marionette, _, $,
            BlockingView,
            VerticalBarChartView,
            HorizontalBarChartView,
            DonutChartView,
            PieChartView,
            EmptyView,
            template){
    'use strict';

    var VisualCountView = Marionette.View.extend({

        className: 'csui-visual-count-container',

        template: template,

        regions: {
            chart: {
                el: '.csui-visual-count-chart-container',
                replaceElement: true
            }
        },

        constructor: function VisualCountView(options) {

            BlockingView.imbue({
                parent: this
            });

            this.chartView = this._getChartView(options);
            Marionette.View.prototype.constructor.apply(this, arguments);
            var self = this;
            this.onWinRefresh = _.debounce(function() {
                self.render();
            },20);
            $(window).on("resize.app", this.onWinRefresh);

            this.listenTo(options.collection, 'reset', this.render)
                .listenTo(options.collection, 'request', this.blockActions)
                .listenTo(options.collection, 'sync error', this.onCollectionSynced)
                .listenTo(options.chartOptions, 'change', this.render);
        },

        childViewEvents: {
            'redraw:chart': 'render'
        },

        onDomRefresh: function(){
            var ChartView = this.chartView;
            this.showChildView('chart', new ChartView(this.options));
        },

        onCollectionSynced: function(collection) {

            this.unblockActions();

            var $chart = $('svg',this.$el);

            if (collection && collection.isEmpty()) {
                this._renderEmptyView();
            }
            else if ($chart.length === 0) {
                this.render();
            }
        },

        onDestroy: function () {
            $(window).off("resize.app", this.onWinRefresh);
        },

        _renderEmptyView: function () {
            this.showChildView('chart', new EmptyView());
        },

        _getChartView: function (options) {
            var chartType = options && options.chartType,
                chartView = VerticalBarChartView;

            if (chartType){
                switch(chartType) {
                    case "donut":
                        chartView = DonutChartView;
                        break;
                    case "pie":
                        chartView = PieChartView;
                        break;
                    case "horizontalBar":
                        chartView = HorizontalBarChartView;
                        break;
                    case "verticalBar":
                        chartView = VerticalBarChartView;
                        break;
                    default:
                }
            }

            return chartView;
        }

    });

    return VisualCountView;

});