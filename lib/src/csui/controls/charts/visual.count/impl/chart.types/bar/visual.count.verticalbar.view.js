/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', // 3rd party libraries
    'csui/controls/charts/visual.count/impl/visual.count.chart.view',
    'csui/controls/charts/visual.count/impl/chart.types/visual.count.bar.view'
], function (_, $, d3, VisualCountChartView, VisualCountBarView) {

    var VisualCountVerticalBarView = VisualCountBarView.extend({

        constructor: function VisualCountVerticalBarView(options) {
            VisualCountBarView.prototype.constructor.apply(this, arguments);

            this.defaults = _.defaults({
                marginTop: (this.chartOptions.get('chartTitle')) ? 50 : 30,
                marginLeft: (this.chartOptions.get('showAxisLabels')) ? 80 : (this.chartOptions.get('showCountAxis')) ? 60 : 30,
                marginBottom: (this.chartOptions.get('showAxisLabels') || this.chartOptions.get('showTotal')) ? 100 : 80,
                marginRight: 30,
                barValueLabelsOffset: 6,
                isVerticalOrientation: true
            }, VisualCountBarView.prototype.defaults);
        },

        chartType: 'verticalBar'

    });

    return VisualCountVerticalBarView;

});
