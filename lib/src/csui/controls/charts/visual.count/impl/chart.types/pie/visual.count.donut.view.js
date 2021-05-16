/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', // 3rd party libraries
    'csui/controls/charts/visual.count/impl/visual.count.chart.view',
    'csui/controls/charts/visual.count/impl/chart.types/pie/visual.count.pie.view',
    'i18n!csui/controls/charts/visual.count/impl/nls/lang'
], function (_, $, d3, VisualCountChartView, VisualCountPieView, lang) {

    var VisualCountDonutView = VisualCountPieView.extend({

        constructor: function VisualCountDonutView(options) {
            VisualCountPieView.prototype.constructor.apply(this, arguments);

            this.defaults = _.defaults({
                marginTop: (this.chartOptions.get('chartTitle')) ? 50 : 40,
                marginRight: 30,
                marginBottom: 30,
                marginLeft: 30,
                donutWidth: 1.5,
                outerRadius: function(radius){
                    return radius;
                },
                innerLabelRadius: function(radius){
                    return radius - 10;
                },
                outerLabelRadius: function(radius){
                    return radius + 50;
                }
            },VisualCountPieView.prototype.defaults);

            this.defaults.innerRadius = function(radius){
                return radius / this.defaults.donutWidth;
            };

            this.defaults.innerRadiusNudge = function(radius){
                return radius / this.defaults.donutWidth;
            };
        },

        chartType: 'donut',

        appendTotal: function(chartContext){

            var pieChartView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                pieCenter = chartContext.pieCenter,
                height = chartContext.height,
                width = chartContext.width,
                totalCount = this.getTotalCount(chartData);

            function fontSizeForTotal(innerDiscSize) {
                var stringLength = (pieChartView.formatCount(totalCount).length),
                    fontRatios = [1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8], // a hash is faster than Math ;-)
                    fontRatio = (stringLength <= fontRatios.length) ? fontRatios[stringLength - 1] : 12; // 12 is smallest size possible
                return innerDiscSize / fontRatio;
            }

            var minFontSize = 10,
                radius = this.getRadius(height, width),
                donutWidth = this.defaults.donutWidth,
                valueFontSize = (fontSizeForTotal(radius / donutWidth) >= minFontSize) ? fontSizeForTotal(radius / donutWidth) : minFontSize,
                labelRatio = 2.8,
                valueOffsetRatio = 10,
                labelOffsetRatio = 1.5,
                innerDiscMargin = 10,
                donutTotal = d3Chart.select('.csui-visual-count-vis-wrapper')
                                .append('g')
                                .attr('class','csui-visual-count-pie-total-roundel')
                                .attr('transform', 'translate(' + pieCenter.x + ',' + pieCenter.y + ')'); // center at 1/3

            donutTotal.append('g')
                      .attr('class', 'csui-visual-count-pie-total-label-disc')
                      .append('circle')
                       .attr('transform', 'translate(0,0)')
                      .attr('cx', 0)
                      .attr('cy', 0)
                      .attr('r', (radius / donutWidth) - innerDiscMargin);

            donutTotal.append('text')
                      .attr('transform', 'translate(0,' + (-(valueFontSize / labelOffsetRatio)) + ')')
                      .attr('class', 'csui-visual-count-pie-total-label')
                      .attr('text-anchor', 'middle')
                      .attr('font-size', valueFontSize / labelRatio)
                      .text(function () {
                         return (valueFontSize / labelRatio >= 8) ? lang.Total : '';
                      });

            donutTotal.append('text')
                      .attr('class', 'csui-visual-count-total')
                      .attr('transform', 'translate(0,' + (valueFontSize / valueOffsetRatio) + ')')
                      .attr('text-anchor', 'middle')
                      .attr('alignment-baseline', 'middle')
                      .attr('font-size', valueFontSize) // pass in the inner disc radius to get the right font size
                      .text(pieChartView.formatCount(totalCount));
        },

        updateTotal: function(chartContext){
            var pieChartView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                totalCount = this.getTotalCount(chartData),
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms);

            d3Chart.select('.csui-visual-count-total')
                .attr('fill-opacity',0)
                .transition(t)
                .duration(ms)
                .attr('fill-opacity',1)
                .text(pieChartView.formatCount(totalCount));

            return d3Chart;
        }
    });

    return VisualCountDonutView;

});
