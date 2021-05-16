/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/d3', // 3rd party libraries
    'csui/controls/charts/visual.count/impl/visual.count.chart.view',
    'i18n!csui/controls/charts/visual.count/impl/nls/lang'
], function (_, d3, VisualCountChartView,lang) {

    var VisualCountPieView = VisualCountChartView.extend({

        constructor: function VisualCountPieView(options) {
            VisualCountChartView.prototype.constructor.apply(this, arguments);

            this.defaults = _.defaults({
                marginTop: (this.chartOptions.get('chartTitle')) ? 60 : 40,
                marginRight: 30,
                marginBottom: 30,
                marginLeft: 30,
                innerRadius: 0,
                innerRadiusNudge: function(radius) {
                    return radius / 2;
                },
                outerRadius: function(radius){
                    return radius;
                },
                innerLabelRadius: function(radius){
                    return radius - 10;
                },
                outerLabelRadius: function(radius){
                    return radius + 40;
                }

            },VisualCountChartView.prototype.defaults);

        },

        chartType: 'pie',

        create: function(chartContext) {
            var pieChartView = this;

            chartContext.theme = this.getTheme(this.chartOptions.get('themeName'));
            chartContext.pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return pieChartView.getCountValue(chartContext, d);
                });

            chartContext.radius = pieChartView.getRadius(chartContext.height, chartContext.width);
            chartContext.arc = d3.arc()
                .innerRadius(pieChartView.getInnerRadius(chartContext.radius))
                .outerRadius(pieChartView.getOuterRadius(chartContext.radius));
            chartContext.labelArc = d3.arc()
                .innerRadius(pieChartView.getInnerLabelRadius(chartContext.radius))
                .outerRadius(pieChartView.getOuterLabelRadius(chartContext.radius));
            chartContext.innerLabelArc = d3.arc()
                .innerRadius(pieChartView.getInnerRadiusNudge(chartContext.radius))
                .outerRadius(pieChartView.getOuterRadius(chartContext.radius));
            chartContext.legendHeightRatio = this.defaults.legendHeightRatio;

            chartContext.arcTween = function(newSlice) {
                var i = d3.interpolate(this.currentSlice, newSlice);
                this.currentSlice = i(0);
                return function (t) {
                    return chartContext.arc(i(t));
                };
            },
            chartContext.arcCentroid = function(d) {
                var x = chartContext.arc.centroid(d)[0],
                    y = chartContext.arc.centroid(d)[1],
                    centroid = {
                        x: !isNaN(x) ? x : 0,
                        y: !isNaN(y) ? y : 0
                    };

                return centroid;
            };

            if (this.chartOptions.get('showTotal')) {
                pieChartView.appendTotal(chartContext);
            }
            pieChartView.update(chartContext);

            return chartContext.d3Chart;
        },

        update: function(chartContext) {
            var pieChartView = this;

            pieChartView.updateSlices(chartContext);
            if (this.chartOptions.get('showLegend')) {
                pieChartView.updateLegend(chartContext);
            }
            else {
                pieChartView.updateSliceLabelLines(chartContext);
                pieChartView.updateCategoryLabels(chartContext);
            }
            if (this.chartOptions.get('showValueLabels')) {
                pieChartView.updateValueLabels(chartContext);
            }
            if (this.chartOptions.get('showTotal')) {
                pieChartView.updateTotal(chartContext);
            }

            pieChartView.updateA11yTable(chartContext);
        },

        updateSlices: function(chartContext) {

            var pieChartView = this,
                chartData = chartContext.chartData,
                d3Chart = chartContext.d3Chart,
                pie = chartContext.pie,
                arc = chartContext.arc,
                arcTween = chartContext.arcTween,
                arcCentroid = chartContext.arcCentroid,
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms),
                colorOpacity = chartContext.theme.opacity;
            var pieSlices = d3Chart.select('.csui-visual-count-pie-chart')
                .selectAll('.csui-visual-count-pie-slice')
                .data(pie(chartData));
            pieSlices
                .exit()
                .attr('fill','#999')
                .transition(t)
                .attr('fill-opacity',0)
                .remove();
            pieSlices
                .transition(t)
                .attr('fill', function (d) {
                    return pieChartView.getCategoryColor(chartContext,d.data);
                })
                .attrTween('d',arcTween);
            pieSlices
                .enter()
                .append('g')
                .attr('class', 'csui-visual-count-pie-slice-group')
                .append('path')
                .attr('class', 'csui-visual-count-pie-slice')
                .attr('fill', '#999')
                .attr('d',arc)
                .attr('transform',function(d) {
                    return 'translate(' + arcCentroid(d).x + ',' + arcCentroid(d).y + ')';
                })
                .attr('fill-opacity',0)
                .transition(t)
                .attr('transform','translate(0,0)')
                .attr('fill-opacity', colorOpacity)
                .attr('fill', function (d) {
                    return pieChartView.getCategoryColor(chartContext,d.data);
                })
                .each(function(d) {
                    this.currentSlice = d;
                });

            return d3Chart;

        },

        updateCategoryLabels: function(chartContext){

            var pieChartView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                pie = chartContext.pie,
                pieLabel = pieChartView.pieLabel,
                labelArc = chartContext.labelArc,
                ms = chartContext.transitionDuration,
                label = false,
                t = d3.transition().duration(ms);

            function textAnchor(d) {
                return (labelArc.centroid(d)[0] < 0) ? 'end' : 'start';
            }

            if (!pieChartView.chartOptions.get('showLegend')) {
                label = true;
            }
            var categoryLabels = d3Chart.select('.csui-visual-count-pie-chart')
                .selectAll('.csui-visual-count-chart-label.outside')
                .data(pie(chartData));
            categoryLabels
                .transition(t)
                .attr('transform', function (d) {
                    return 'translate(' + labelArc.centroid(d) + ')';
                })
                .attr('text-anchor', textAnchor)
                .text(function(d) {
                    return pieLabel(chartContext,d,pieChartView,label);
                });

            categoryLabels
                .exit()
                .transition(t)
                .attr('fill-opacity',0)
                .remove();

            categoryLabels
                .enter()
                .append('text')
                .attr('class', 'csui-visual-count-chart-label outside')
                .style('font-size', this.getScaledFontSize(chartContext,'radial'))
                .attr('fill-opacity',0)
                .attr('transform', function (d) {
                    return 'translate(' + labelArc.centroid(d) + ')';
                })
                .transition(t)
                .attr('fill-opacity',1)
                .attr('text-anchor', textAnchor)
                .attr('alignment-baseline', 'middle')
                .text(function(d) {
                    return pieLabel(chartContext,d,pieChartView,label);
                });

            return d3Chart;
        },

        updateValueLabels: function(chartContext){

            var pieChartView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                pie = chartContext.pie,
                pieLabel = pieChartView.pieLabel,
                innnerLabelArc = chartContext.innerLabelArc,
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms);
            var valueLabels = d3Chart.select('.csui-visual-count-pie-chart')
                .selectAll('.csui-visual-count-value-label')
                .data(pie(chartData));
            valueLabels
                .transition(t)
                .attr('transform', function (d) {
                    return 'translate(' + innnerLabelArc.centroid(d) + ')';
                })
                .text(function(d) {
                    return pieLabel(chartContext,d,pieChartView);
                });

            valueLabels
                .exit()
                .transition(t)
                .attr('fill-opacity',0)
                .remove();

            valueLabels
                .enter()
                .append('text')
                .attr('class', 'csui-visual-count-value-label inside')
                .style('font-size', this.getScaledFontSize(chartContext,'value'))
                .attr('fill-opacity',0)
                .attr('transform', function (d) {
                    return 'translate(' + innnerLabelArc.centroid(d) + ')';
                })
                .transition(t)
                .attr('fill-opacity',1)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .text(function(d) {
                    return pieLabel(chartContext,d,pieChartView);
                });

            return d3Chart;
        },

        updateSliceLabelLines: function(chartContext) {

            var pieChartView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                pie = chartContext.pie,
                radius = chartContext.radius,
                lineStartArc = d3.arc()
                    .innerRadius(radius)
                    .outerRadius(pieChartView.getOuterRadius(radius)),
                lineEndArc = d3.arc()
                    .innerRadius(radius)
                    .outerRadius(pieChartView.getOuterLabelRadius(radius) - 20),
                lineGenerator = d3.line(),
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms);
            var pieSliceLabelLines = d3Chart.select('.csui-visual-count-pie-chart')
                .selectAll('.csui-visual-count-chart-labelline')
                .data(pie(chartData));

            pieSliceLabelLines
                .attr('stroke-opacity',0)
                .transition(t)
                .attr('stroke-opacity',1)
                .attr('d', function(d) {
                    var points = [lineStartArc.centroid(d),lineEndArc.centroid(d)];
                    return lineGenerator(points);
                });

            pieSliceLabelLines.exit()
                .transition(t)
                .attr('stroke-opacity',0)
                .remove();

            pieSliceLabelLines.enter()
                .append('path')
                .attr('stroke-opacity',0)
                .attr('class','csui-visual-count-chart-labelline')
                .transition(t)
                .attr('stroke-opacity',1)
                .attr('d', function(d) {
                    var points = [lineStartArc.centroid(d),lineEndArc.centroid(d)];
                    return lineGenerator(points);
                });

            return d3Chart;
        },

        updateLegend: function(chartContext){

            var pieChartView = this,
                d3Chart = chartContext.d3Chart,
                chartData = chartContext.chartData,
                pieLegendContainer = d3Chart.select('.csui-visual-count-pie-legend-container'),
                colorOpacity = chartContext.theme.opacity,
                chartHeight = this.getChartHeight(chartContext),
                activeColumn = this.getActiveColumnLabel(chartContext),
                ms = chartContext.transitionDuration,
                t = d3.transition().duration(ms),
                fontSize = getLegendFontSize();

            function getLegendFontSize() {
                var fontSize = pieChartView.getScaledFontSize(chartContext,'legend'),
                    maxFontSize = pieChartView.defaults.labelTypes.legend.max,
                    minFontSize = pieChartView.defaults.labelTypes.legend.min;

                if (fontSize * chartData.length * 1.6 > chartHeight) {
                    fontSize = chartHeight / (chartData.length * 1.6);
                }

                fontSize = (fontSize > maxFontSize) ? maxFontSize : fontSize;
                fontSize = (fontSize < minFontSize) ? minFontSize : fontSize;

                return fontSize;
            }

            function legendYPos(i) {
                var legendHeight = fontSize * 1.6,
                    offset = (legendHeight * chartData.length) / 2;

                return (i * legendHeight) - offset;
            }

            function explode(d, offset) {
                var radial = (d.startAngle + d.endAngle) / 2,
                    offsetX = Math.sin(radial) * offset,
                    offsetY = -Math.cos(radial) * offset;
                return {
                    x: offsetX,
                    y: offsetY
                };
            }

            var legends = pieLegendContainer.selectAll('.csui-visual-count-pie-legend')
                    .data(chartData);

            legends
                .transition(t)
                .attr('transform', function (d,i) {
                    return 'translate(0,' + legendYPos(i) + ')';
                });

            legends
                .select('.csui-visual-count-pie-legend-text')
                .style('font-size', fontSize)
                .attr('fill-opacity', 0)
                .transition(t)
                .attr('fill-opacity', 1)
                .attr('dx', fontSize * 1.1)
                .attr('dy', fontSize)
                .text(function (d) {
                    return pieChartView.getDataLabel(chartContext, d);
                });

            legends
                .select('.csui-visual-count-pie-legend-swatch')
                .attr('r', fontSize / 1.5)
                .attr('cy',fontSize - (fontSize / 3))
                .attr('fill-opacity', colorOpacity);
            var legendsExit = legends.exit();

            legendsExit
                .select('.csui-visual-count-pie-legend-text')
                .transition(t)
                .attr('fill-opacity',0);

            legendsExit
                .select('.csui-visual-count-pie-legend-swatch')
                .attr('fill','#999')
                .transition(t)
                .attr('fill-opacity',0);

            legendsExit
                .transition(t)
                .remove();
            var legendsEnter = legends.enter()
                .append('g')
                .attr('class', 'csui-visual-count-pie-legend')
                .on('mousedown', function (target,index) {
                    d3Chart.selectAll('.csui-visual-count-pie-slice,.csui-visual-count-pie-legend-swatch,.csui-visual-count-pie-legend-text')
                        .attr('fill-opacity', 0.3)
                        .filter(function (d,i) {
                            return i === index;
                        })
                        .attr('fill-opacity', 1);
                    d3Chart.selectAll('.csui-visual-count-pie-slice')
                        .filter(function (d,i) {
                            return i === index;
                        })
                        .attr('transform', function(d) {
                            var offset = explode(d,10);
                            return 'translate(' + offset.x + ',' + offset.y + ')';
                        });
                })
                .on('mouseup', function () {
                    d3Chart.selectAll('.csui-visual-count-pie-slice,.csui-visual-count-pie-legend-swatch,.csui-visual-count-pie-legend-text')
                        .attr('fill-opacity', colorOpacity);
                    d3Chart.selectAll('.csui-visual-count-pie-slice')
                        .attr('transform', function() {
                            return 'translate(0,0)';
                        });
                });

            legendsEnter
                .attr('transform', 'translate(0,0)')
                .transition(t)
                .attr('transform', function (d,i) {
                    return 'translate(0,' + legendYPos(i) + ')';
                });

            legendsEnter
                .append('circle')
                .attr('class', 'csui-visual-count-pie-legend-swatch')
                .attr('fill-opacity',0)
                .transition(t)
                .attr('fill-opacity', colorOpacity)
                .attr('fill', function (d) {
                    return pieChartView.getCategoryColor(chartContext,d);
                })
                .attr('r', fontSize / 1.5)
                .attr('cx',0)
                .attr('cy',fontSize - (fontSize / 3));

            legendsEnter
                .append('text')
                .attr('class', 'csui-visual-count-pie-legend-text')
                .style('font-size', fontSize)
                .attr('fill-opacity',0)
                .transition(t)
                .delay(200)
                .attr('fill-opacity',1)
                .attr('dx', fontSize * 1.1)
                .attr('dy', fontSize)
                .text(function (d) {
                    return pieChartView.getDataLabel(chartContext, d);
                });

            if (this.chartOptions.get('showAxisLabels')) {
                var legendTitle = pieLegendContainer;

                legendTitle
                    .select('.csui-visual-count-pie-legend-active-column')
                    .transition(t)
                    .attr('fill-opacity', 0)
                    .remove();

                legendTitle
                    .append('text')
                    .attr('class', 'csui-visual-count-pie-legend-active-column')
                    .style('font-size', this.getScaledFontSize(chartContext,'legendTitle'))
                    .attr('fill-opacity', 0)
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('alignment-baseline', 'baseline')
                    .attr('y', 0)
                    .attr('x', 0)
                    .attr('dy', -this.getScaledFontSize(chartContext,'legendTitle') * 1.3)
                    .transition(t)
                    .attr('fill-opacity', 1)
                    .text(activeColumn);
            }
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
                .attr('fill-opacity',1)
                .text(lang.Total + ': ' + pieChartView.formatCount(totalCount));

            return d3Chart;
        },

        getRadius: function(height, width){
            return Math.min(width / 3, height / 2); // 1/3 of width or half of height
        },
        
        getInnerRadius: function(radius){
            return _.isFunction(this.defaults.innerRadius) ? this.defaults.innerRadius.call(this, radius) : this.defaults.innerRadius;
        },

        getInnerRadiusNudge: function(radius){
            return _.isFunction(this.defaults.innerRadiusNudge) ? this.defaults.innerRadiusNudge.call(this, radius) : this.defaults.innerRadiusNudge;
        },
        
        getOuterRadius: function(radius){
            return _.isFunction(this.defaults.outerRadius) ? this.defaults.outerRadius.call(this, radius) : this.defaults.outerRadius;
        },

        getInnerLabelRadius: function(radius){
            return _.isFunction(this.defaults.innerLabelRadius) ? this.defaults.innerLabelRadius.call(this, radius) : this.defaults.innerLabelRadius;
        },

        getOuterLabelRadius: function(radius){
            return _.isFunction(this.defaults.outerLabelRadius) ? this.defaults.outerLabelRadius.call(this, radius) : this.defaults.outerLabelRadius;
        },

        appendGroups: function (chartContext) {
            var d3Chart = chartContext.d3Chart,
                minPadding = 60, // minimum padding between chart and legend when widget width is reduced
                pieCenter = chartContext.pieCenter,
                height = chartContext.height;

            d3Chart.append('g')
                   .attr('transform', 'translate(' + this.getMarginLeft() + ',' + this.getMarginTop() + ')')
                   .attr('class', 'csui-visual-count-vis-wrapper');

            d3Chart.select('.csui-visual-count-vis-wrapper')
                   .append('g')
                   .attr('class', 'csui-visual-count-pie-chart')
                   .attr('transform', 'translate(' + pieCenter.x + ',' + pieCenter.y + ')');

            if (this.chartOptions.get('showLegend')) {
                d3Chart.select('.csui-visual-count-vis-wrapper')
                    .append('g')
                    .attr('class', 'csui-visual-count-pie-legend-container')
                    .attr('height', height)
                    .attr('transform', 'translate(' + (pieCenter.x * 2 + minPadding) + ',' + pieCenter.y + ')'); // center at 2/3 + padding
            }

            return d3Chart;
        },

        appendTotal: function(chartContext) {
            var d3Chart = chartContext.d3Chart,
                height = chartContext.height;

            d3Chart.select('.csui-visual-count-vis-wrapper')
                .append('g')
                .attr('class', 'csui-visual-count-pie-total-container')
                .append('text')
                .attr('class', 'csui-visual-count-total')
                .style('font-size', this.getScaledFontSize(chartContext,'total'))
                .attr('text-anchor', 'left')
                .attr('alignment-baseline', 'baseline')
                .attr('y', height + this.getMarginBottom() - 15)
                .attr('x', 0 - this.getMarginLeft() + 20);
        },

        pieLabel: function(chartContext,d,pieChartView,label) {
            var actual = pieChartView.getCountValue(chartContext, d.data),
                percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1),
                radius = chartContext.radius,
                arcSize = d.endAngle - d.startAngle, // in radians
                minRadius = 60, // minimum radius for labels to appear
                minArcLength = 30; // ratio of radius to arcSize to determine if label will appear on this arc (arcSize / minArcSizeRatio)

            if (label) {
                label = pieChartView.getDataLabel(chartContext, d.data);
            }
            else {
                label = (pieChartView.chartOptions.get('showAsPercentage')) ? percentage + ' %' : pieChartView.formatCount(actual);
                label = ((radius * arcSize >= minArcLength) && (radius >= minRadius)) ? label : '';
            }

            return label;
        }

    });

    return VisualCountPieView;

});
