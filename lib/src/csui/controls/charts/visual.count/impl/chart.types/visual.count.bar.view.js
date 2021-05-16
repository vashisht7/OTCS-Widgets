/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', // 3rd party libraries
    'csui/controls/charts/visual.count/impl/visual.count.chart.view',
    'i18n!csui/controls/charts/visual.count/impl/nls/lang'
], function (_, $, d3, VisualCountChartView, lang) {

    var VisualCountBarView = VisualCountChartView.extend({

        constructor: function VisualCountBarView(options) {
            VisualCountChartView.prototype.constructor.apply(this, arguments);

            this.defaults = _.defaults({
                marginTop: 30,
                marginRight: 30,
                marginBottom: 30,
                marginLeft: 30,
                marginLeftMax: 300,
                categoryAxisLabelMargin: 20,
                barValueLabelsOffset: 10,
                isVerticalOrientation: true
            },VisualCountChartView.prototype.defaults);
        },

        chartType: null, // Define a unique name in extended objects to identify your visualization type

        create: function (chartContext) {
            chartContext.countScale = this.getCountScale(chartContext);
            chartContext.countAxis = this.getCountAxis(chartContext);

            chartContext.categoryScale = this.getCategoryScale(chartContext);
            chartContext.categoryAxis = this.getCategoryAxis(chartContext);

            chartContext.XAxisGroup = this.appendXAxisGroup(chartContext);
            chartContext.YAxisGroup = this.appendYAxisGroup(chartContext);

            chartContext.gridlinesGroup = this.appendGridlinesGroup(chartContext);
            chartContext.zeroLine = this.appendZeroLine(chartContext);
            chartContext.barGroup = this.appendBarGroup(chartContext);
            chartContext.valueLabels = this.appendBarValueLabels(chartContext);

            chartContext.theme = this.getTheme(this.chartOptions.get('themeName'));

            if (this.chartOptions.get('showAxisLabels')) {
                this.appendXAxisLabel(chartContext);
                this.appendYAxisLabel(chartContext);
            }

            if (this.chartOptions.get('showTotal')) {
                this.appendTotalCount(chartContext);
            }
            this.update(chartContext);

            return chartContext.d3Chart;
        },

        update: function (chartContext) {

            var genericBarView = this,
                chartData = chartContext.chartData,
                categoryScale = chartContext.categoryScale,
                countScale = chartContext.countScale,
                limits = (this.defaults.isVerticalOrientation) ? [chartContext.height,0] : [0,chartContext.width], //TODO: for RTL, swap the horizontal limits
                extent = d3.extent(chartData.map(function (d) {
                    return genericBarView.getCountValue(chartContext, d);
                }));
            categoryScale.domain(chartData.map(function (d) {
                return genericBarView.getDataLabel(chartContext, d);
            }));
            extent = (extent[0] > 0) ? [0, extent[1]*1.1] : [extent[0] * 1.1, extent[1] * 1.1];

            countScale.domain(extent)
                .range(limits)
                .nice(); // extend range to nearest nice value

            genericBarView.updateAxes(chartContext);
            genericBarView.updateBars(chartContext);

            genericBarView.updateA11yTable(chartContext);


            if (!this.chartOptions.get('showCountAxis') || this.chartOptions.get('showValueLabels')) {
                genericBarView.updateValueLabels(chartContext);
            }

            if (this.chartOptions.get('showTotal')) {
                genericBarView.updateTotal(chartContext);
            }

            _.delay(function() {
                genericBarView.updateTickLabelOrientation(chartContext);
            },20);

        },

        updateAxes: function(chartContext) {

            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                countScale = chartContext.countScale,
                lineLength = -chartContext.width,
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms),
                translation = '0,' + countScale(0),
                xAxis = this.getCategoryAxis(chartContext),
                yAxis = (this.chartOptions.get('showCountAxis')) ? this.getCountAxis(chartContext) : null,
                memo;

            if (!this.defaults.isVerticalOrientation) {
                lineLength = chartContext.height;
                translation = countScale(0) + ',0';
                memo = xAxis;
                xAxis = yAxis; // intentional
                yAxis = memo;
            }

            if (!this.chartOptions.get('showGridLines')) {
                lineLength = 0;
            }
            if (!_.isNull(xAxis)) {
                chartContext.XAxisGroup
                    .transition(t)
                    .call(xAxis)
                    .selectAll('text');
            }
            if (!_.isNull(yAxis)) {
                chartContext.YAxisGroup
                    .transition(t)
                    .call(yAxis);
            }
            chartContext.gridlinesGroup
                .transition(t)
                .call(genericBarView.getCountAxis(chartContext)
                    .tickFormat('')
                    .tickSize(lineLength))
                .selectAll('line')
                .attr('class', 'csui-visual-count-gridline');
            chartContext.zeroLine
                .transition(t)
                .attr('transform', 'translate(' + translation + ')');

            return d3Chart;
        },

        updateBars: function(chartContext) {

            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                categoryScale = chartContext.categoryScale,
                countScale = chartContext.countScale,
                colorOpacity = chartContext.theme.opacity,
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms),
                barMagnitudeProp = 'height', // the variable dimension that shows magnitude of data value
                barThicknessProp = 'width',
                xProp = 'x',
                yProp = 'y';

            if (!this.defaults.isVerticalOrientation) {
                barMagnitudeProp = 'width';
                barThicknessProp = 'height';
                xProp = 'y';
                yProp = 'x';
            }
            var bars = chartContext.barGroup
                .selectAll('.csui-visual-count-bar')
                .data(chartData, function (d) {
                    return genericBarView.getDataValue(chartContext, d);
                });
            bars.exit()
                .attr('fill-opacity', 0.3)
                .style('fill','#000')
                .transition(t)
                .attr('fill-opacity', 0)
                .remove();
            bars.enter()
                .append('rect')
                .attr('class', 'csui-visual-count-bar')
                .attr('fill-opacity', colorOpacity)
                .style('fill', '#999')
                .attr(xProp, function(d) {
                    return categoryScale(genericBarView.getDataLabel(chartContext, d));
                })
                .attr(yProp, function() {
                    return countScale(0);
                })
                .attr(barThicknessProp, categoryScale.bandwidth())
                .attr(barMagnitudeProp, 0)
                .merge(bars)
                .transition(t)
                .style('fill', function (d, i) {
                    return genericBarView.getCategoryColor(chartContext,d);
                })
                .attr(xProp, function(d) {
                    return categoryScale(genericBarView.getDataLabel(chartContext, d));
                })
                .attr(yProp, function(d) {
                    var countValue = genericBarView.getCountValue(chartContext,d),
                        yPos = (genericBarView.defaults.isVerticalOrientation) ? Math.max(0,countValue) : Math.min(0,countValue);
                    return countScale(yPos);
                })
                .attr(barThicknessProp, categoryScale.bandwidth())
                .attr(barMagnitudeProp, function (d) {
                    var barMagnitude = countScale(genericBarView.getCountValue(chartContext,d));
                    return Math.abs(barMagnitude - countScale(0));
                });

            return d3Chart;
        },

        updateValueLabels: function(chartContext) {

            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                categoryScale = chartContext.categoryScale,
                countScale = chartContext.countScale,
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms),
                isVertical = this.defaults.isVerticalOrientation,
                fontSize = this.getScaledFontSize(chartContext,'value'),
                barThickness = categoryScale.bandwidth(),
                xProp = 'x',
                yProp = 'y';

            if (!this.defaults.isVerticalOrientation) {
                xProp = 'y';
                yProp = 'x';
            }

            function getDisplayValue(d) {

                var displayValue = '';

                if ((isVertical && barThickness > 24) || (!isVertical && barThickness >= fontSize)) {
                    displayValue = genericBarView.formatCount(genericBarView.getCountValue(chartContext, d));

                    if (genericBarView.chartOptions.get('showAsPercentage')) {
                        displayValue = ((genericBarView.getCountValue(chartContext, d) / genericBarView.getTotalCount(chartData)) * 100).toFixed(1) + '%';
                    }
                }

                return displayValue;
            }

            function getLabelPositionX(d) {
                var dataLabel =  genericBarView.getDataLabel(chartContext, d) || genericBarView.getDataValue(chartContext, d),
                    labelPosition = categoryScale(dataLabel) + (barThickness / 2);

                if (!isVertical) {
                    labelPosition += (fontSize / 2);
                }

                return labelPosition;
            }

            function getLabelPositionY(d) {
                var sign = genericBarView.checkSign(genericBarView.getCountValue(chartContext, d)) || 1, // zero is treated as positive for label offset purposes
                    labelOffset = genericBarView.defaults.barValueLabelsOffset,
                    labelPosition;

                if (isVertical) {
                    labelOffset += fontSize;
                    labelOffset = (labelOffset * sign) - fontSize;
                    labelPosition = countScale(genericBarView.getCountValue(chartContext,d)) - labelOffset;
                }
                else {
                    labelOffset = (labelOffset * sign);
                    labelPosition = countScale(genericBarView.getCountValue(chartContext,d)) + labelOffset;
                }

                return labelPosition;
            }

            function getTextAnchorPosition(d) {
                var anchorPos = 'middle';
                if (!isVertical) {
                    anchorPos = (genericBarView.getCountValue(chartContext, d) < 0) ? 'end' : 'start';
                }
                return anchorPos;
            }
            var valueLabels = chartContext.valueLabels
                .selectAll('.csui-visual-count-value-label')
                .data(chartData, function (d) {
                    return genericBarView.getDataValue(chartContext, d);
                });
            valueLabels
                .exit()
                .transition(t)
                .attr('fill-opacity',0)
                .delay(100)
                .remove();
            valueLabels
                .enter()
                .append('text')
                .attr('class', 'csui-visual-count-value-label')
                .attr('dy','-0.5em')
                .style('font-size', fontSize)
                .style('text-anchor', function(d) {
                    return getTextAnchorPosition(d);
                })
                .attr(xProp, function (d) {
                    return getLabelPositionX(d);
                })
                .attr(yProp, countScale(0))
                .merge(valueLabels)
                .attr('fill-opacity', 0.2)
                .transition(t)
                .attr('dy','-0.1em')
                .style('text-anchor', function(d) {
                    return getTextAnchorPosition(d);
                })
                .attr(xProp, function (d) {
                    return getLabelPositionX(d);
                })
                .attr(yProp, function (d) {
                    return getLabelPositionY(d);
                })
                .delay(100)
                .attr('fill-opacity', 1)
                .text(function(d) {
                    return getDisplayValue(d);
                });

            return d3Chart;
        },

        updateTickLabelOrientation: function(chartContext) {
            var d3Chart = chartContext.d3Chart,
                categoryScale = chartContext.categoryScale,
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms),
                longestTickLabelWidth = 0,
                tickLabels = d3Chart.select('.x.axis')
                    .selectAll('text')
                    .style('font-size',this.getScaledFontSize(chartContext,'tick'))
                    .attr('dy', '0.8em');

            if (!this.defaults.isVerticalOrientation) {
                tickLabels = d3Chart.select('.y.axis')
                    .selectAll('text')
                    .style('font-size',this.getScaledFontSize(chartContext,'tick'))
                    .attr('dx', '-0.5em');
            }
            _.each(tickLabels._groups[0],function(item) {
                var tickLabelWidth = item.getComputedTextLength();
                longestTickLabelWidth = (tickLabelWidth > longestTickLabelWidth) ? tickLabelWidth : longestTickLabelWidth;
            });
            if (this.defaults.isVerticalOrientation) {
                if (longestTickLabelWidth > categoryScale.bandwidth()) {
                    tickLabels
                        .style('text-anchor', 'end')
                        .transition(t)
                        .attr('transform', function () {
                            return 'rotate(-30)';
                        });
                } else {
                    tickLabels
                        .style('text-anchor', 'middle')
                        .transition(t)
                        .attr('transform', function () {
                            return 'rotate(0)';
                        });
                }
            }
            else {
                if (longestTickLabelWidth > this.defaults.marginLeft) {
                    this.defaults.marginLeft = Math.min(this.defaults.marginLeftMax, longestTickLabelWidth);
                }
            }

        },

        updateTotal: function(chartContext){
            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                totalCount = this.getTotalCount(chartData),
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms);

            d3Chart.select('.csui-visual-count-total')
                .attr('fill-opacity',0)
                .transition(t)
                .attr('fill-opacity',1)
                .text(lang.Total+': ' + genericBarView.formatCount(totalCount));

            return d3Chart;
        },

        getCategoryScale: function(chartContext){
            var genericBarView = this,
                chartData = chartContext.chartData,
                limit = (this.defaults.isVerticalOrientation) ? chartContext.width : chartContext.height;

            return d3.scaleBand()
                .range([0, limit])
                .round(true)
                .padding(0.1)
                .domain(chartData.map(function (d) {
                    return genericBarView.getDataLabel(chartContext, d);
                }));
        },

        getCategoryAxis: function(chartContext){
            var categoryScale = chartContext.categoryScale,
                axisGenerator = (this.defaults.isVerticalOrientation) ? d3.axisBottom : d3.axisLeft;

            return axisGenerator(categoryScale).tickFormat(_.bind(this.shortenText,this));
        },

        getCountScale: function(){
            return d3.scaleLinear();
        },

        getCountAxis: function(chartContext){
            var genericBarView = this,
                countScale = chartContext.countScale,
                axisGenerator = (this.defaults.isVerticalOrientation) ? d3.axisLeft : d3.axisBottom,
                countAxisTicks =this.chartOptions.get('countAxisTicks');
            return axisGenerator(countScale);

        },

        appendGroups: function (chartContext) {
            var genericBarView = this,
                d3Chart = chartContext.d3Chart;

            return d3Chart.append('g')
                .attr('transform', 'translate(' + genericBarView.getMarginLeft() + ',' + genericBarView.getMarginTop() + ')')
                .attr('class', 'csui-visual-count-bar-chart');
        },

        appendXAxisGroup: function(chartContext) {
            var d3Chart = chartContext.d3Chart;

            return d3Chart.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + chartContext.height + ')');
        },

        appendYAxisGroup: function(chartContext) {
            var d3Chart = chartContext.d3Chart;

            return d3Chart.append('g')
                .attr('class', 'y axis');
        },

        appendZeroLine: function(chartContext) {

            var d3Chart = chartContext.d3Chart,
                zeroLineLimit = chartContext.width,
                zeroLinePos = chartContext.height,
                zeroLineStart = 'x1',
                zeroLineEnd = 'x2';

            if (!this.defaults.isVerticalOrientation) {
                zeroLinePos = chartContext.width;
                zeroLineStart = 'y1';
                zeroLineEnd = 'y2';
                zeroLineLimit = chartContext.height;
            }

            return d3Chart.append('g')
                .attr('class', 'csui-visual-count-zero-line')
                .append('line')
                .attr(zeroLineStart,0)
                .attr(zeroLineEnd,zeroLineLimit)
                .attr('transform', 'translate(0,' + zeroLinePos + ')');
        },

        appendGridlinesGroup: function(chartContext) {
            var d3Chart = chartContext.d3Chart;

            return d3Chart.append('g')
                .attr('class', 'csui-visual-count-gridlines');
        },

        appendXAxisLabel: function(chartContext){
            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                width = chartContext.width,
                height = chartContext.height,
                xAxisLabel = (this.defaults.isVerticalOrientation) ? genericBarView.getActiveColumnLabel(chartContext) : lang.TotalCount;

            return d3Chart.append('text')
                .attr('class', 'csui-visual-count-x-label')
                .text(xAxisLabel)
                .attr('y', height + genericBarView.getMarginBottom() - 15)
                .attr('x', (width / 2))
                .style('text-anchor', 'middle')
                .style('font-size', this.getScaledFontSize(chartContext,'axis'));
        },

        appendYAxisLabel: function(chartContext){
            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                height = chartContext.height,
                yAxisLabel = (this.defaults.isVerticalOrientation) ? lang.TotalCount : genericBarView.getActiveColumnLabel(chartContext);

            return d3Chart.append('text')
                .attr('class', 'csui-visual-count-y-label')
                .text(yAxisLabel)
                .attr('transform', 'rotate(-90)')
                .attr('y', -genericBarView.getMarginLeft())
                .attr('x', -(height / 2))
                .attr('dy', this.getScaledFontSize(chartContext,'axis'))
                .style('text-anchor', 'middle')
                .style('font-size', this.getScaledFontSize(chartContext,'axis'));
        },

        appendBarGroup: function(chartContext){

            var d3Chart = chartContext.d3Chart;

            return d3Chart.append('g').attr('class', 'csui-visual-count-bars');
        },

        appendBarValueLabels: function(chartContext){

            var d3Chart = chartContext.d3Chart;

            return d3Chart.append('g').attr('class', 'csui-visual-count-chart-labels');

        },

        appendTotalCount: function(chartContext){
            var genericBarView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                height = chartContext.height,
                totalCount = genericBarView.getTotalCount(chartData);

            d3Chart.append('text')
                .attr('class', 'csui-visual-count-total')
                .attr('text-anchor', 'left')
                .attr('alignment-baseline', 'baseline')
                .attr('y', height + genericBarView.getMarginBottom() - 15)
                .attr('x', 0 - genericBarView.getMarginLeft() + 20)
                .text(lang.Total+': ' + genericBarView.formatCount(totalCount))
                .style('font-size', this.getScaledFontSize(chartContext,'total'));

        }
    });

    return VisualCountBarView;

});
