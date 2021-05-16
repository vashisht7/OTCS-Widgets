/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone"],
    function (Backbone) {

        var TableColumnModel = Backbone.Model.extend({

            idAttribute: "key",

            defaults: {
                key: null,  // key from the resource metadata
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
                key: 'bo_id',
                sequence: 10
            },
            {
                key: 'name',
                sequence: 20
            },
            {
                key: 'ext_system_name',
                sequence: 30
            },
            {
                key: 'create_date',
                sequence: 40
            },
            {
                key: 'created_by_name',
                sequence: 50
            },
            {
                key: 'comment',
                sequence: 60
            }
        ]);

        return tableColumns;

    });
