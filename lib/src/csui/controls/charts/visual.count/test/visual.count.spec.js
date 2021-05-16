/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/lib/d3',
    'csui/utils/contexts/page/page.context',
    'csui/controls/charts/visual.count/visual.count.view',
    'i18n!csui/controls/charts/visual.count/impl/nls/lang',
    './visual.count.mock.js'
], function (Backbone, _, $, Marionette, d3, PageContext, VisualCountView, lang, mock) {
    'use strict';

    describe('VisualCountView', function () {
        var context,
            factories = {
                factories: {
                    connector: {
                        connection: {
                            url: '//server/cgi/cs.exe/api/v1',
                            supportPath: '/support',
                            credentials: {
                                username: 'Admin',
                                password: 'livelink'
                            }
                        }
                    }
                }
            };

        beforeEach(function () {
            mock.enable();
            if (!context) {
                context = new PageContext({
                    factories: factories
                });
            }
        });

        afterEach(function () {
            mock.disable();
        });

        describe('on creation, by default', function () {
            var chartOptions = new Backbone.Model({
                    showAsPercentage: false,
                    animate: false,
                    chartTitle: 'Test title',
                    showAxisLabels: true,
                    showValueLabels: true,
                    showCountAxis: true,
                    showLegend: true,
                    themeName: 'otPrimary',
                    showGridLines: true,
                    showTotal: true
                }),
                columnCollection = new Backbone.Collection({
                }),
                Collection = Backbone.Collection.extend({
                    url: '//server/otcs/cs/api/v2/mydata1',
                    parse: function(response) {
                        columnCollection.set(response.columns);
                        return response.data;
                    }
                }),
                dataCollection = new Collection(),
                pageContext = new PageContext(),
                chartRegion = new Marionette.Region({el: '#chart'}),
                verticalBarView = new VisualCountView({
                    context: pageContext,
                    chartType: 'verticalBar',
                    chartOptions: chartOptions,
                    collection: dataCollection,
                    columns: columnCollection
                }),
                horizontalBarView = new VisualCountView({
                    context: pageContext,
                    chartType: 'horizontalBar',
                    chartOptions: chartOptions,
                    collection: dataCollection,
                    columns: columnCollection
                }),
                pieView = new VisualCountView({
                    context: pageContext,
                    chartType: 'pie',
                    chartOptions: chartOptions,
                    collection: dataCollection,
                    columns: columnCollection
                }),
                donutView = new VisualCountView({
                    context: pageContext,
                    chartType: 'donut',
                    chartOptions: chartOptions,
                    collection: dataCollection,
                    columns: columnCollection
                }),
                childView,
                chartContext,
                $parentEl,
                $svg;

            function testValues($valueLabels,showAsPercentage) {
                var expectedResult = true;

                _.each(dataCollection.models,function(item,index) {
                    var countVal = item.get('Count'),
                        totalCount = childView.getTotalCount(chartContext.chartData),
                        displayedVal = $($valueLabels[index]).html(),
                        expectedVal;
                    if (showAsPercentage) {
                        expectedVal = ((countVal / totalCount) * 100).toFixed(1) + '%';
                    }
                    else {
                        expectedVal = childView.formatCount(countVal);
                    }

                    if (displayedVal !== expectedVal) {
                        expectedResult = false;
                    }
                });
                return expectedResult;
            }

            beforeEach(function (done) {

                $.whenAll(dataCollection.fetch())
                    .then(function(){
                        var $body = $('body').addClass('binf-widgets'),
                            $container = $('<div class="binf-container-fluid grid-rows"></div>');

                        $container.append('<div class="binf-col-sm-12 binf-col-md-6"><div id="chart" class="chart"></div></div>');

                        $container.appendTo($body);

                        done();
                    })
                    .fail(function(){
                        done();
                    });


            });

            it('instantiates a vertical bar chart', function () {

                chartRegion.show(verticalBarView);

                childView = verticalBarView.getChildView('chart');
                chartContext = childView.getChartContext();
                $parentEl = $('.csui-visual-count-chart-container','#chart');
                $svg = $('svg',$parentEl);

                $svg.css('min-height','200px');
                $svg.css('min-width','300px');

                expect(verticalBarView instanceof VisualCountView).toBeTruthy();
            });

            it('for a vertical bar chart, renders a SVG element', function () {
                expect($svg.length).toBeTruthy();
            });

            it('for a vertical bar chart, sets dimensions for SVG element', function () {
                expect(Number($svg.attr('width')) > 0).toBeTruthy();
                expect(Number($svg.attr('width')) <= chartContext.containerWidth).toBeTruthy();
                expect(Number($svg.attr('height')) <= chartContext.containerHeight).toBeTruthy();
            });

            it('for a vertical bar chart, draws a bar for each category in the collection', function () {
                var $barsContainer = $('.csui-visual-count-bars',$parentEl),
                    $bars = $('rect',$barsContainer);

                expect($bars.length === dataCollection.length).toBeTruthy();
            });

            it('for a vertical bar chart, draws the chart title', function () {
                var $titleContainer = $('.csui-visual-count-chart-title',$parentEl),
                    $title = $('text',$titleContainer);

                expect($title.html() === 'Test title').toBeTruthy();
            });

            it('for a vertical bar chart, draws the axes', function () {
                var $xAxisContainer = $('.x.axis',$parentEl),
                    $yAxisContainer = $('.y.axis',$parentEl),
                    $xTicks = $('.tick',$xAxisContainer),
                    $yTicks = $('.tick',$yAxisContainer);

                expect($xTicks.length === dataCollection.length).toBeTruthy();
                expect($yTicks.length > 0).toBeTruthy();
            });

            it('for a vertical bar chart, draws the axis labels', function () {
                var $xAxisLabel = $('.csui-visual-count-x-label',$parentEl),
                    $yAxisLabel = $('.csui-visual-count-y-label',$parentEl);

                expect($xAxisLabel.html() === chartContext.activeColumn.get('name_formatted')).toBeTruthy();
                expect($yAxisLabel.html() === lang.TotalCount).toBeTruthy();
            });

            it('for a vertical bar chart, draws the gridlines and zero line', function () {
                var $gridLines = $('.csui-visual-count-gridlines',$parentEl),
                    $gridTicks = $('.tick',$gridLines),
                    $zeroLineContainer = $('.csui-visual-count-zero-line',$parentEl),
                    $zeroLine = $('line',$zeroLineContainer);

                expect($gridTicks.length > 0).toBeTruthy();
                expect(Number($zeroLine.attr('x2')) > 0).toBeTruthy();
            });

            it('for a vertical bar chart, draws the value labels and values are shown correctly', function () {
                var $valueLabelsContainer = $('.csui-visual-count-chart-labels',$parentEl),
                    $valueLabels = $('.csui-visual-count-value-label',$valueLabelsContainer);
                expect($valueLabels.length === dataCollection.length).toBeTruthy();
                expect(testValues($valueLabels,false)).toBeTruthy();
            });

            it('instantiates a horizontal bar chart', function () {
                chartOptions.set({showAsPercentage: true});

                chartRegion.show(horizontalBarView);

                childView = horizontalBarView.getChildView('chart');
                chartContext = childView.getChartContext();
                $parentEl = $('.csui-visual-count-chart-container','#chart');
                $svg = $('svg',$parentEl);

                expect(horizontalBarView instanceof VisualCountView).toBeTruthy();
            });

            it('for a horizontal bar chart, renders a SVG element', function () {
                expect($svg.length).toBeTruthy();
            });

            it('for a horizontal bar chart, sets dimensions for SVG element', function () {
                expect(Number($svg.attr('width')) > 0).toBeTruthy();
                expect(Number($svg.attr('width')) <= chartContext.containerWidth).toBeTruthy();
                expect(Number($svg.attr('height')) <= chartContext.containerHeight).toBeTruthy();
            });

            it('for a horizontal bar chart, draws a bar for each category in the collection', function () {
                var $barsContainer = $('.csui-visual-count-bars',$parentEl),
                    $bars = $('rect',$barsContainer);

                expect($bars.length === dataCollection.length).toBeTruthy();
            });

            it('for a horizontal bar chart, draws the chart title', function () {
                var $titleContainer = $('.csui-visual-count-chart-title',$parentEl),
                    $title = $('text',$titleContainer);

                expect($title.html() === 'Test title').toBeTruthy();
            });

            it('for a horizontal bar chart, draws the axes', function () {
                var $xAxisContainer = $('.x.axis',$parentEl),
                    $yAxisContainer = $('.y.axis',$parentEl),
                    $xTicks = $('.tick',$xAxisContainer),
                    $yTicks = $('.tick',$yAxisContainer);

                expect($yTicks.length === dataCollection.length).toBeTruthy();
                expect($xTicks.length > 0).toBeTruthy();
            });

            it('for a horizontal bar chart, draws the axis labels', function () {
                var $xAxisLabel = $('.csui-visual-count-x-label',$parentEl),
                    $yAxisLabel = $('.csui-visual-count-y-label',$parentEl);

                expect($xAxisLabel.html() === lang.TotalCount).toBeTruthy();
                expect($yAxisLabel.html() === chartContext.activeColumn.get('name_formatted')).toBeTruthy();
            });

            it('for a horizontal bar chart, draws the gridlines and zero line', function () {
                var $gridLines = $('.csui-visual-count-gridlines',$parentEl),
                    $gridTicks = $('.tick',$gridLines),
                    $zeroLineContainer = $('.csui-visual-count-zero-line',$parentEl),
                    $zeroLine = $('line',$zeroLineContainer);

                expect($gridTicks.length > 0).toBeTruthy();
                expect(Number($zeroLine.attr('y2')) > 0).toBeTruthy();
            });

            it('for a horizontal bar chart, draws the value labels and values are shown correctly', function () {
                var $valueLabelsContainer = $('.csui-visual-count-chart-labels',$parentEl),
                    $valueLabels = $('.csui-visual-count-value-label',$valueLabelsContainer);
                expect($valueLabels.length === dataCollection.length).toBeTruthy();
                expect(testValues($valueLabels,true)).toBeTruthy();

            });

            it('instantiates a pie chart', function () {

                chartRegion.show(pieView);

                childView = pieView.getChildView('chart');
                chartContext = childView.getChartContext();
                $parentEl = $('.csui-visual-count-chart-container','#chart');
                $svg = $('svg',$parentEl);

                expect(pieView instanceof VisualCountView).toBeTruthy();
            });

            it('for a pie chart, renders a SVG element', function () {
                expect($svg.length).toBeTruthy();
            });

            it('for a pie chart, sets dimensions for SVG element', function () {
                expect(Number($svg.attr('width')) > 0).toBeTruthy();
                expect(Number($svg.attr('width')) <= chartContext.containerWidth).toBeTruthy();
                expect(Number($svg.attr('height')) <= chartContext.containerHeight).toBeTruthy();
            });

            it('for a pie chart, draws a slice for each category in the collection', function () {
                var $pieContainer = $('.csui-visual-count-pie-chart',$parentEl),
                    $slices = $('.csui-visual-count-pie-slice-group',$pieContainer);

                expect($slices.length === dataCollection.length).toBeTruthy();
            });

            it('for a pie chart, draws the chart title', function () {
                var $titleContainer = $('.csui-visual-count-chart-title',$parentEl),
                    $title = $('text',$titleContainer);

                expect($title.html() === 'Test title').toBeTruthy();
            });

            it('for a pie chart, draws the legend and its category (axis) label', function () {
                var $legendContainer = $('.csui-visual-count-pie-legend-container',$parentEl),
                    $legends = $('.csui-visual-count-pie-legend',$legendContainer),
                    $label = $('.csui-visual-count-pie-legend-active-column',$legendContainer);

                expect($legends.length === dataCollection.length).toBeTruthy();
                expect($label.html() === chartContext.activeColumn.get('name_formatted')).toBeTruthy();
            });

            it('for a pie chart, draws the value labels and values are shown correctly', function () {
                var $pieContainer = $('.csui-visual-count-pie-chart',$parentEl),
                    $valueLabels = $('.csui-visual-count-value-label.inside',$pieContainer);
                expect($valueLabels.length === dataCollection.length).toBeTruthy();
            });

            it('instantiates a donut chart', function () {

                chartRegion.show(donutView);

                childView = donutView.getChildView('chart');
                chartContext = childView.getChartContext();
                $parentEl = $('.csui-visual-count-chart-container','#chart');
                $svg = $('svg',$parentEl);

                expect(donutView instanceof VisualCountView).toBeTruthy();
            });

            it('for a donut chart, renders a SVG element', function () {
                expect($svg.length).toBeTruthy();
            });

            it('for a donut chart, sets dimensions for SVG element', function () {
                expect(Number($svg.attr('width')) > 0).toBeTruthy();
                expect(Number($svg.attr('width')) <= chartContext.containerWidth).toBeTruthy();
                expect(Number($svg.attr('height')) <= chartContext.containerHeight).toBeTruthy();
            });

            it('for a donut chart, draws a slice for each category in the collection', function () {
                var $pieContainer = $('.csui-visual-count-pie-chart',$parentEl),
                    $slices = $('.csui-visual-count-pie-slice-group',$pieContainer);

                expect($slices.length === dataCollection.length).toBeTruthy();
            });

            it('for a donut chart, draws the chart title', function () {
                var $titleContainer = $('.csui-visual-count-chart-title',$parentEl),
                    $title = $('text',$titleContainer);

                expect($title.html() === 'Test title').toBeTruthy();
            });

            it('for a donut chart, draws the legend and its category (axis) label', function () {
                var $legendContainer = $('.csui-visual-count-pie-legend-container',$parentEl),
                    $legends = $('.csui-visual-count-pie-legend',$legendContainer),
                    $label = $('.csui-visual-count-pie-legend-active-column',$legendContainer);

                expect($legends.length === dataCollection.length).toBeTruthy();
                expect($label.html() === chartContext.activeColumn.get('name_formatted')).toBeTruthy();
            });

            it('for a donut chart, draws the value labels and values are shown correctly', function () {
                var $pieContainer = $('.csui-visual-count-pie-chart',$parentEl),
                    $valueLabels = $('.csui-visual-count-value-label.inside',$pieContainer);
                expect($valueLabels.length === dataCollection.length).toBeTruthy();
            });

        });


    });
});