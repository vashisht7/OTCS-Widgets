# Visual Count Control

**Module: csui/controls/charts/visual.count/visual.count.view**

The Visual Count control provides some charts for use in the Smart View.  

## VisualCountView(options)

Creates a new instance.

#### Options

`context` (PageContext: csui/utils/contexts/page/page.context)  
**Mandatory.** The page context for the application.

`chartOptions` (Backbone.model instance: csui/lib/backbone)  
**Optional.** Options to be passed to the chart. These override the *defaults* if supplied. Possible chart options are:

* `animate` (Boolean)  
default: `true`  
Charts have animation transitions when data changes, (e.g. if categories are filtered or sorted). These can help make the data easier to understand, as the user can see when values reduce or increase, when categories move in relation to one another (e.g. when sorting), and when categories are added or removed. However, if multiple charts appear on a page they may be distracting. Note: Animations will only show during data transitions, not on initial load. 
* `showAsPercentage` (Boolean)  
default: `false`    
If true, values are shown as a percentage of the total of all values. If false, values are shown as actual, abbreviated using SI notation or bytes, according to what client_format.type option is passed in the count column definition. 
* `showAxisLabels` (Boolean)  
default: `true`
If true, values are shown as a percentage of the total of all values. If false, values are shown as actual, abbreviated using SI notation or bytes, according to what client_format.type option is passed in the count column definition. 
* `showCountAxis` (Boolean)  
default: `true`  
* `countAxisTicks` (Integer)  
default: `0`  
Specifies the desired number of ticks along the count axis. The actual number of ticks displayed may be greater or fewer than this number, as the scale algorithm automatically chooses 'nice' values for the scale (e.g. 5, 10, 15). Omitting this option, or supplying a value of 0 will cause D3 to determine the best number of ticks based on the data.  
* `showValueLabels` (Boolean)  
default: `true`     
If true, values will be displayed above bars on a bar chart, or inside segments on a pie or donut chart. Note that if countAxis is disabled, value labels will be shown regardless of this option setting.
* `showLegend` (Boolean)    
default: `true`    
If true, a pie/donut legend will be shown for each segment. If false, each segment will have a radial label outside the pie/donut.
* `showGridLines` (Boolean)    
default: `true`    
Shows faint lines across the whole chart that correspond with the ticks on the count axis. This makes it easier to measure bars with very close values.  
* `showTotal` (Boolean)    
default: `true`  
If true, the total of all values will be shown in the bottom left of bar and pie charts, or in the central roundel of a donut chart.

* `chartTitle` (String)  
default: `undefined`   
An optional chart title can be added above the chart. The chart will rescale slightly to accomodate it.

* `themeName` (String)  
default: `dataClarity`  
Color scheme used for charts. Possible values are `otPrimary`, `otSecondary`, `otTertiary` or `dataClarity`. Themes have an array of colours which the chart will cycle through for each new data category. If the number of categories exceeds the number of colours in the theme, the colour will cycle back to the start of the palette.
 
`collection` (Backbone.Collection instance: csui/lib/backbone)  
**Mandatory.** A collection of data to chart. 

`columns` (Backbone.Collection instance: csui/lib/backbone)  
**Mandatory.** Column definitions that relate to the data collection. 

`chartType` (String)  
**Optional.** Defines the type of chart used for your data set. Valid values are: `verticalBar` (default),`donut` or `pie`.

## Events

Trigger: `redraw:chart`  
Trigger context: VisualCountChartView (controls/charts/visual.count/visual.count.chart.view)  
Triggers a re-render when changes to the data require the entire chart to be redrawn rather than updated: for example when the active columns changes, or when a chart option is changed that requires a new chart layout, such as enabling/disabling pie legends.

## Formatting Options
In addition to the chart display options listed above, it is also possible to determine how data values are formatted.  
  
By default, large numbers are formatted according to standard SI notation with 1 decimal place and with a localised suffix.  

If the data relates to filesize, it can be more helpful to display byte notation for the values. Note that byte size is base 2, so 1024K in SI notation is 1000Kb in bytes notation.  
 
Optionally, it is possible to have no formatting, and numbers will be rendered in their 'raw' format.
To supply a number format, set the `client_format.type` property in the same column definition that has `count_column: true` (see example column collection below).  
Possible values are:  
* `'si'` (scientific notation, e.g. 23K, 43.2M) 
* `'business'` (business/finance notation, e.g. 23K 43.2B - the same as SI but with B for billions instead of G)
* `'bytes'` (bytes notation, e.g. 34.5KB, 19.4MB - note that 'kilo' here is 1024 not 1000, so 65536 = 64KB)
* `'none'` (no formatting, e.g. 13456600000) 

## Example script
```javascript
    var pageContext = new PageContext(),
        teamsColumnsCollection = new Backbone.Collection(teamData.columns),
        teamsCollection = new Backbone.Collection(teamData.data),
        visualCountVerticalBarView = new VisualCountView({
            context: pageContext,
            chartType: 'verticalBar',
            chartOptions: {
                showAsPercentage: true
            },
            collection: teamsCollection,
            columns: teamsColumnsCollection
        }),
        VisualCountVerticalBarApp = Marionette.Application.extend({
            region: '.visual-count-vertical-bar-app',

            onStart: function() {
                this.showView(visualCountVerticalBarView);
            }
        }),
        visualCountVerticalBarApp = new VisualCountVerticalBarApp();

    visualCountVerticalBarApp.start();
```

## Example data collection
```json
[
    {
      "performerid": 326475,
      "performerid_formatted": "Team Alpha",
      "Count": 8,
      "Count_formatted": "8"
    },
    {
      "performerid": 463664,
      "performerid_formatted": "Team Bravo",
      "Count": 6,
      "Count_formatted": "6"
    },
    {
      "performerid": 364577,
      "performerid_formatted": "Team Charlie",
      "Count": 2,
      "Count_formatted": "2"
    }
]
```


## Example column collection
```json
[
    {
      "active_column": true,
      "client_format": {
        "type": "none"
      },
      "column_key": "performerid",
      "count_column": false,
      "data_type": 10,
      "id": 1003,
      "name": "performerid",
      "name_formatted": "Performer"
    },
    {
      "active_column": false,
      "client_format": {
        "type": "si"
      },
      "column_key": "count",
      "count_column": true,
      "data_type": 12,
      "id": 1004,
      "name": "Count"
    }
  ]
```
