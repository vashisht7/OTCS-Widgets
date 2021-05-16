/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone', 'csui/lib/marionette3', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/d3', 'csui/lib/numeral', // 3rd party libraries
    'i18n!csui/controls/charts/visual.count/impl/nls/lang',
    'css!csui/controls/charts/visual.count/impl/visual.count'
], function(Backbone, Marionette, _, $, d3, numeral, lang){
    'use strict';

    var VisualCountChartView = Marionette.View.extend({

        defaults: {
            marginTop: 20,
            marginRight: 20,
            marginBottom: 20,
            marginLeft: 20,
            xAxisLabelMargin: 0,
            maxCategoryLabelLength: 18,
            transitionDuration: 600,
            chartOptions: {
                showAsPercentage: false,
                animate: true,
                chartTitle: '',
                showAxisLabels: true,
                showValueLabels: true,
                showCountAxis: true,
                countAxisTicks: 6,
                showLegend: true,
                themeName: 'dataClarity',
                showTotal: true,
                showGridLines: true
            },
            labelTypes: {
                default: {
                    heightRatio: 0.02,
                    min: 11,
                    max: 18
                },
                'tick': {
                    heightRatio: 0.025
                },
                'value': {
                    heightRatio: 0.025
                },
                'radial': {
                    heightRatio: 0.025
                },
                'legend': {
                    heightRatio: 0.05,
                    min: 8,
                    max: 18
                },
                'legendTitle': {
                    heightRatio: 0.06,
                    min: 14,
                    max: 24
                },
                'axis': {
                    heightRatio: 0.04,
                    min: 14,
                    max: 20
                },
                'total': {
                    heightRatio: 0.03,
                    min: 12,
                    max: 20
                },
                'title': {
                    heightRatio: 0.06,
                    min: 16,
                    max: 28
                }
            }
        },

        themes: [
            {
                name: 'otPrimary',
                label: lang.OTPrimary,
                palette: ['#111b58','#00b8ba','#2E3D98','#09bcef','#4f3690','#7e929f','#5d0026','#055e78','#f05822','#090e2c'],
                opacity: 1
            },
            {
                name: 'otSecondary',
                label: lang.OTSecondary,
                palette: ['#006353','#4f3690','#003B4D','#0084ce','#4f3690','#067d14','#111b58','#00b8ba','#232e72','#775909'],
                opacity: 1
            },
            {
                name: 'otTertiary',
                label: lang.OTTertiary,
                palette: ['#4f3690','#004267','#7e929f','#111b58','#00b8ba','#4f3690','#a7261b','#a0006b','#e00051','#5d0026'],
                opacity: 1
            },
            {
                name: 'dataClarity',
                label: lang.DataClarity,
                palette: ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#7f7f7f','#bcbd22','#17becf','#e377c2','#8c564b','#aec7e8','#ffbb78','#98df8a','#ff9896','#c5b0d5','#c7c7c7','#dbdb8d','#9edae5','#f7b6d2','#c49c94'],
                opacity: 0.9
            }
        ],

        className: 'csui-visual-count-chart-container',

        template: false,

        constructor: function VisualCountChartView(options){

            var optionsToApply = _.clone(this.defaults.chartOptions);
            if (options.chartOptions) {
                this.chartOptions = options.chartOptions; // Note: Backbone.Model, not object
                optionsToApply = _.defaults(options.chartOptions.toJSON(),optionsToApply);
                this.chartOptions.set(optionsToApply);
            }
            else {
                this.chartOptions = new Backbone.Model(this.defaults.chartOptions);
            }

            this.columns = options.columns;

            this.listenTo(options.collection, 'update', this._updateChart);

            Marionette.View.prototype.constructor.apply(this, arguments);
        },

        chartType: null, // Define a unique name in extended objects to identify your visualization type

        onDomRefresh: function () {
            var chartContext = this.getChartContext(),
                d3Chart = (chartContext) ? chartContext.d3Chart : undefined;
            if (!d3Chart) {
                this.draw();
            }
        },

        create: function (chartContext) {
            var d3Chart = chartContext.d3Chart;

            return d3Chart;
        },

        appendChartTitle: function(chartContext) {
            var d3Chart = chartContext.d3Chart;

            d3Chart.append('g')
                .attr('transform', 'translate(' + chartContext.containerWidth / 2 + ',20)')
                .attr('class', 'csui-visual-count-chart-title')
                .append('text')
                .style('text-anchor', 'middle')
                .style('font-size', this.getScaledFontSize(chartContext,'title'))
                .text(this.chartOptions.get('chartTitle'));

            return d3Chart;
        },

        appendGroups: function(chartContext){
            var d3Chart = chartContext.d3Chart;
            return d3Chart;
        },

        update: function (chartContext) {
            var d3Chart = chartContext.d3Chart;

            return d3Chart;
        },

        draw: function () {
            var chartContext = this.chartContext || {};

            if (!this.collection.isEmpty()) {
                this.appendRootElement(chartContext);
                chartContext.chartData = this.getChartDataJSON();
                chartContext.height = this.getChartHeight(chartContext);
                chartContext.width = this.getChartWidth(chartContext);
                chartContext.pieCenter = {
                    x: (this.chartOptions.get('showLegend')) ? chartContext.width / 3 : chartContext.width / 2, // center pie at 1/3 width of legend is shown
                    y: chartContext.height / 2
                };
                chartContext.activeColumn = this.getActiveColumn();
                chartContext.countColumn = this.getCountColumn();
                chartContext.colorMap = _.pluck(chartContext.chartData,this.getActiveColumnName(chartContext));
                chartContext.transitionDuration = 0;
                if (this.chartOptions.get('showChartTitle')) {
                    chartContext.height -= 100;
                }
                this.chartContext = chartContext;

                chartContext.d3Chart = this.appendChartTitle(chartContext);
                chartContext.d3Chart = this.appendGroups(chartContext);
                chartContext.d3Chart = this.create(chartContext);
            }
        },

        activeColumnChanged: function() {

            var activeColumn = this.getActiveColumn();

            return activeColumn.hasChanged('active_column');
        },

        getChartContext: function(){
            return this.chartContext;
        },

        checkSign: function (x) {
            if (!Math.sign) {
                Math.sign = function (x) {
                    return ((x > 0) - (x < 0)) || +x;
                };
            }
            return Math.sign(x);
        },

        shortenText: function(t) {

            t = t || '';
            var maxLength = this.defaults.maxCategoryLabelLength;
            t = (t.length >= maxLength) ? t.substr(0, maxLength) + '\u2026' : t;
            return t;
        },

        formatCount: function(n){

            var formattedValue, formatTemplate,
                countColumn = this.getCountColumn(),
                format = countColumn.get('client_format').type;

            switch(format) {
                case "si":
                    formattedValue = this.formatSi(n);
                    break;
                case "bytes":
                    formatTemplate = (n < 1024) ? '0b' : '0.0b';
                    formattedValue = numeral(n).format( formatTemplate );
                    break;
                case "business":
                    formattedValue = this.formatBusiness(n).replace('G','B'); // change Giga to Billion
                    break;
                default:
                    formattedValue = n.toString();
            }
            return formattedValue;
        },

        formatSi: function(n) {

            var formatNumber = d3.format('.3s'),
                displayNumber = formatNumber(n);

            n = n.toPrecision(3) || 0;
            n = Number(n); // remove precision decimal places for integers

            if (n === 0 || (n >= 1 && n < 1000) || (n <= -1 && n > -1000)) {
                displayNumber = n.toString();
            }

            return displayNumber;
        },

        formatBusiness: function(n) {
            var formatNumber = d3.format('.3s');

            return formatNumber(n);
        },

        getChartData: function(){
        },

        getChartDataJSON: function(){
            return this.collection.toJSON();
        },

        getActiveColumn: function(){
            return this.columns.findWhere(function(column){
                return column.get('active_column');
            });
        },

        getCountColumn: function(){
            return this.columns.findWhere(function(column){
                return column.get('count_column');
            });
        },

        getTotalCount: function(chartData){
            return chartData.reduce(_.bind(function (memo, value) {
                return memo + this.getCountValue(this.getChartContext(),value);
            }, this), 0);
        },

        getTransitionDuration: function() {
            if (this.chartOptions.get('animate') && !this.skipAnimation) {
                return this.defaults.transitionDuration;
            }
            else {
                return 0;
            }
        },

        getMarginTop: function () {
            return this.defaults.marginTop;
        },

        getMarginBottom: function () {
            return this.defaults.marginBottom;
        },

        getMarginLeft: function () {
            var marginLeft = this.defaults.marginLeft;
            if (this.chartOptions.get('showAxisLabels')) {
                marginLeft = this.defaults.marginLeft + this.defaults.xAxisLabelMargin;
            }
            return marginLeft;
        },

        getMarginRight: function () {
            return this.defaults.marginRight;
        },

        getChartWidth: function (chartContext) {
            return chartContext.containerWidth - this.getMarginLeft() - this.getMarginRight();
        },

        getChartHeight: function (chartContext) {
            return chartContext.containerHeight - this.getMarginTop() - this.getMarginBottom();
        },

        appendRootElement: function(chartContext){
            var containerDimensions = this.getContainerDimensions(),
                d3Chart = d3.select(this.el)
                            .append('svg')
                            .attr('aria-hidden', 'true')
                            .attr('width', containerDimensions.width)
                            .attr('height', containerDimensions.height),
                a11yTable = d3.select(this.el)
                    .append('div')
                    .attr('class','csui-visual-count-a11y-table-wrapper');

            chartContext.containerHeight = containerDimensions.height;
            chartContext.containerWidth = containerDimensions.width;
            chartContext.d3Chart = d3Chart;
            chartContext.a11yTable = a11yTable;
            this.initA11yTable(chartContext);
        },

        updateRootElement: function(chartContext){
            var containerDimensions = this.getContainerDimensions(),
                d3Chart = chartContext.d3Chart;

            d3Chart.select('svg')
                    .attr('width', containerDimensions.width)
                    .attr('height', containerDimensions.height);

            chartContext.containerHeight = containerDimensions.height;
            chartContext.containerWidth = containerDimensions.width;
            chartContext.d3Chart = d3Chart;

            return chartContext;
        },

        initA11yTable: function(chartContext) {
            var a11yTable = chartContext.a11yTable
                    .append('table');

            a11yTable.append('caption')
                .html(this.chartOptions.get('chartTitle') || lang.A11yTableCaption);

            a11yTable.append('thead'); // THEAD is not actually needed for screen readers
            a11yTable.append('tbody');

            return chartContext;
        },

        updateA11yTable: function(chartContext) {
            var chartView = this,
                chartData = chartContext.chartData,
                a11yTable = chartContext.a11yTable.select('tbody'),
                a11yTableRows;

            a11yTableRows = a11yTable
                .selectAll('tr')
                .data(chartData, function (d) {
                    return chartView.getDataValue(chartContext, d);
                });
            a11yTableRows.exit().remove();
            a11yTableRows.select('th')
                .text(function (d) {
                    return chartView.getDataLabel(chartContext, d);
                });
            a11yTableRows.select('td')
                .text(function (d) {
                    var uiValue = chartView.getCountValue(chartContext, d);
                    if (chartView.chartOptions.get('showAsPercentage')) {
                        uiValue = ((chartView.getCountValue(chartContext, d) / chartView.getTotalCount(chartData)) * 100).toFixed(1) + '%';
                    }
                    return uiValue ;
                });
            a11yTableRows = a11yTableRows.enter()
                .append('tr');

            a11yTableRows
                .append('th')
                .attr('scope','row')
                .text(function (d) {
                    return chartView.getDataLabel(chartContext, d);
                });

            a11yTableRows
                .append('td')
                .text(function (d) {
                    var uiValue = chartView.getCountValue(chartContext, d);
                    if (chartView.chartOptions.get('showAsPercentage')) {
                        uiValue = ((chartView.getCountValue(chartContext, d) / chartView.getTotalCount(chartData)) * 100).toFixed(1) + '%';
                    }
                    return uiValue ;
                });

            return chartContext;
        },

        getContainerDimensions: function(){
            var boundingRect = this.el.getBoundingClientRect(),
                width = boundingRect.width,
                height = boundingRect.height;

            return {
                height: height,
                width: width
            };
        },

        getCountValue: function(chartContext,d){
            var countColumnName = this.getCountColumnName(chartContext);
            return this.getCaseInsensitiveProperty(d,countColumnName);
        },

        getCountLabel: function(chartContext,d){
            var countColumnName = this.getCountColumnName(chartContext);
            return this.getCaseInsensitiveProperty(d,countColumnName + '_formatted');
        },

        getDataValue: function(chartContext,d){
            var activeColumnName = this.getActiveColumnName(chartContext);
            return this.getCaseInsensitiveProperty(d,activeColumnName);
        },

        getDataLabel: function(chartContext,d){
            var activeColumnName = this.getActiveColumnName(chartContext);
            return this.getCaseInsensitiveProperty(d,activeColumnName + '_formatted');

        },

        getActiveColumnName: function(chartContext){
            return chartContext.activeColumn.get('column_key');
        },

        getActiveColumnLabel: function(chartContext){
            return chartContext.activeColumn.get('name_formatted');
        },

        getCountColumnName: function(chartContext){
            return chartContext.countColumn.get('name');
        },

        getTheme: function(name) {
            var theme = this.themes[0];

            if (!_.isUndefined(name)) {
                theme = _.findWhere(this.themes,{ name: name } ) || theme;
            }

            return theme;
        },

        getCategoryColor: function(chartContext,d) {
            var colorMap = chartContext.colorMap,
                palette = chartContext.theme.palette,
                uid = this.getDataValue(chartContext, d);

            if (colorMap.indexOf(uid) === -1) {
                colorMap.push(uid);
            }
            var colorIndex = chartContext.colorMap.indexOf(uid) % palette.length;

            return palette[colorIndex];
        },

        getScaledFontSize: function(chartContext,type) {

            type = type || 'default';
            
            var labelTypes = this.defaults.labelTypes,
            labelType = labelTypes[type],
            fontSize = chartContext.height * labelType.heightRatio,
            minSize = labelType.min || labelTypes['default'].min,
            maxSize = labelType.max || labelTypes['default'].max;

            if (fontSize < minSize) {
                return minSize;
            }
            else if (fontSize > maxSize) {
                return maxSize;
            }

            return fontSize;
        },

        getCaseInsensitiveProperty: function(obj, name) {
            if (obj && name){
                return obj[name] || obj[_.find(_.keys(obj), function(key){
                    return key.toLowerCase() === name.toLowerCase();
                })];
            } else {
                return undefined;
            }
        },

        _updateChart: function(updatedCollection) {

            var chartContext = this.getChartContext();

            if (chartContext) {

                if (this.activeColumnChanged() || updatedCollection.length === 0) {
                    this.trigger('redraw:chart');
                } else {
                    chartContext.transitionDuration = this.getTransitionDuration();
                    chartContext.chartData = this.getChartDataJSON();
                    this.updateRootElement(chartContext);
                    this.updateA11yTable(chartContext);
                    chartContext.height = this.getChartHeight(chartContext);
                    chartContext.width = this.getChartWidth(chartContext);
                    this.update(chartContext);
                }
            }
        }

    });

    return VisualCountChartView;

});