/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', // 3rd party libraries
    'csui/controls/charts/visual.count/impl/visual.count.chart.view',
    'csui/controls/charts/visual.count/impl/chart.types/visual.count.bar.view'
], function (_, $, d3, VisualCountChartView, VisualCountBarView) {

    var VisualCountHorizontalBarView = VisualCountBarView.extend({

        constructor: function VisualCountHorizontalBarView(options) {
            VisualCountBarView.prototype.constructor.apply(this, arguments);

            var marginBottom = 30;

            if (this.chartOptions.get('showCountAxis')) {
                marginBottom += 20;
            }

            if (this.chartOptions.get('showAxisLabels') || this.chartOptions.get('showTotal')) {
                marginBottom += 40;
            }

            this.defaults = _.defaults({
                marginTop: (this.chartOptions.get('chartTitle')) ? 50 : 30,
                marginLeft: (this.chartOptions.get('showAxisLabels')) ? 140 : 120,
                marginLeftMax: 200,
                marginBottom: marginBottom,
                marginRight: 30,
                barValueLabelsOffset: 8,
                isVerticalOrientation: false
            }, VisualCountBarView.prototype.defaults);
        },

        chartType: 'horizontalBar'

    });

    return VisualCountHorizontalBarView;

});
