/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone",
    "i18n!xecmpf/widgets/boattachments/impl/nls/lang"], function (Backbone, lang) {

    var TableColumnModel = Backbone.Model.extend({

        defaults: {
            key: null,  // key from the resource definitions
            sequence: 0 // smaller number moves the column to the front
        }

    });

    var TableColumnCollection = Backbone.Collection.extend({

        model: TableColumnModel,
        comparator: "sequence",

        getColumnKeys: function () {
            return this.pluck('key');
        },

        deepClone: function () {
            return new TableColumnCollection(
                this.map(function (column) {
                    return column.attributes;
                }));
        }

    });

    var tableColumns = new TableColumnCollection([
        {
            key: 'type',
            permanentColumn: true,
            sequence: 10
        },
        {
            key: 'name',
            permanentColumn: true,
            sequence: 20
        },
        {
            key: 'parent_id',
            title: lang.parent_id,
            permanentColumn: true,
            sequence: 30
        },
        {
            key: 'reserved',
            sequence: 40,
            noTitleInHeader: true,
            permanentColumn: true,
        },
        {
            key: 'modify_date',
            permanentColumn: true,
            sequence: 50
        },
        {
            key: 'version',
            sequence: 60
        },
        {
            key: 'size',
            sequence: 70
        },
        {
            key: 'create_date',
            sequence: 80
        },
        {
            key: 'createdby',
            sequence: 90
        },
        {
            key: 'modifiedby',
            sequence: 100
        },
        {
            key: 'favorite',
            sequence: 910,
            noTitleInHeader: true, // don't display a column header
            permanentColumn: true // don't wrap column due to responsiveness into details row
        }
    ]);

    return tableColumns;

});
