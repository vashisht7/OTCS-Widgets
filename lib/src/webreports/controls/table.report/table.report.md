# TableReportView

**Module: webreports/controls/table.report/table.report.view**

Shows a Smart UI table based on the output of WebReports data. The WebReport used by this control must be based on either the widget_table_report_process_data_in_webreport or widget_table_report_process_data_in_datasource default reportviews which use the INSERTJSON @TABLEREPORT directive.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

      // Create the data managing context
      var context = new PageContext(),

      sampleTableReportView = new TableReportView({
          context: context,
          data: {
            id: 24024,
            sortBy: "SubType",
            SortOrder: "ASC",
            pageSize: 30,
            pageSizeOptions: [30, 50, 100]
            columnsWithSearch: "SubType",
            titleBarIcon: 'mime_audio',
            title: 'Sample WebReports Table',
            header: true,
            swrLaunchCell: {
                id: 12345,
                iconClass: 'my-icon-class',
                hoverText: 'Some hover text for my icon.'
            },
            parameters: [
                {
                    name: 'myparm1',
                    value: 'val1'
                },
                {
                    name: 'myparm2',
                    value: 'val2'
                }
            ]
          }
      }),
      // Create helpers to show the views on the page
      region = new Marionette.Region({
        el: "#content"
      });

      // Show the views on the page
      region.show(sampleTableReportView);

      // Fetch the WebReport output from the server to populate the tile with
      context.fetch();

### Options

`context` (PageContext)
: **Mandatory.** A PageContext object instance referencing RequireJS path `csui/utils/contexts/page/page.context`.

### Options Data

`id` (integer)
: **Mandatory.** The DataID for the WebReport that you want to appear on the tile.

`sortBy` (string)
: **Mandatory.**The column name for the default sort column.

`sortOrder` (string)
: **Mandatory.** The default sort order. Valid values are "ASC" or "DESC".

`pageSize` (integer)
: **Optional.** The number of objects to be displayed per page. Valid values are defined by the pageSizeOptions parameter. If the pageSizeOptions parameter is set, pageSize must also be set.
  Default = If no value is provided, the default of the pagination component (30) will be used. 

`pageSizeOptions` (array)
**Optional.** The available page size values that are displayed in the pagination drop down. 
Default = if no value is provided, the default of [30, 50, 100] will be used.
Valid values are 1-100.

`columnsWithSearch` (string)
: **Optional.** The name of a column that to be enabled for searching. 
  Default = If no column is specified then there won't be a searchable column.

`title` (string)
: **Optional.** The title for the table.
  Default = HTML WebReport

`titleBarIcon` (string)
: **Optional.** The CSS class for the icon that you want to appear in the top left corner. For example: support/csui/themes/carbonfiber/icons.css contains icons such as title-assignments, title-customers, title-favourites, title-opportunities, title-recentlyaccessed, title-activityfeed, title-customviewsearch. Default = WebReports icon.

`header` (boolean)
: **Optional.** Specifies whether the table will include a header area that contains the title and title icon.
  Default = True.

`swrLaunchCell` (object)
  **Optional.** Specify a WebReport to be used when launching a SubWebReport. This renders a cell using 'webreports/controls/table.report/cells/launch.subwebreport/launch.subwebreport.view' using the ID value specified by the `id` property. The `iconClass` property can be used to provide a css class to customize the cell icon. The `hoverText` property can be used to specify custom hover text for the icon.

`parameters` (array)
: **Optional.** One or more "name"-"value" pairs for the parameters that you want to pass into the WebReport.