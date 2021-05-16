/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/children',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/models/node.columns2',
  'csui/models/nodechildren',
  "csui/controls/table/table.view",
  'csui/controls/table/table.columns',
  'csui/behaviors/default.action/impl/defaultaction',
  './table_performance.mock.data.js',
  'csui/lib/jquery.mockjax',
  'css!csui/themes/carbonfiber/theme',
  'css!csui/controls/table/impl/table',
  'css!csui/widgets/nodestable/impl/nodestable'
], function (module, $, _,
    Backbone,
    Marionette,
    PageContext,
    ConnectorFactory,
    ChildrenCollectionFactory,
    NodeModel,
    NodeCollection,
    NodeColumn2Collection,
    NodeChildrenCollection,
    TableView,
    tableColumns,
    DefaultActionController,
    mock,
    mockjax) {

  var TestTableColumnModel = Backbone.Model.extend({
    idAttribute: "key",
    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }
  });

  var TestTableColumnCollection = Backbone.Collection.extend({
    model: TestTableColumnModel,
    comparator: "sequence",
    getColumnKeys: function () {
      return this.pluck('key');
    },
    deepClone: function () {
      return new TestTableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    },
    resetCollection: function (columns, options) {
      if (columns) {
        var sequence = 0;
        var models = _.map(columns, function (column) {
          var columnData = column instanceof Backbone.Model ? column.toJSON() : column;
          sequence += 10;
          return new TestTableColumnModel(_.defaults(columnData,
              {key: columnData.column_key, sequence: sequence}));
        });
        this.reset(models, options);
      }
    }
  });

  describe("TableView Performance Regression Test:", function () {

    var tableRegion, tableColumns, collectionPreloaded, nodeChildrenModelData, columns, context,
        connector, collection, delayedActionsLoaded;
    var maxTestWaitInMilliseconds = 100;

    beforeAll(function () {
      mockjax.publishHandlers();
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    beforeEach(function () {
      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: 183718}
          }
        }
      });
      tableColumns = new TestTableColumnCollection([
        {
          key: 'type',
          sequence: 2,
          permanentColumn: true
        },
        {
          key: 'name',
          sequence: 3,
          permanentColumn: true,
          isNaming: true
        },
        {
          key: 'reserved',
          sequence: 4,
          title: 'State',
          noTitleInHeader: true
        },
        {
          key: 'wnd_comments',
          sequence: 900,
          noTitleInHeader: true,
          permanentColumn: true
        },
        {
          key: 'favorite',
          sequence: 910,
          noTitleInHeader: true,
          permanentColumn: true
        }
      ]);

      var columnDefinitions = [
        {
          "default_action": true,
          "column_key": "type",
          "key_value_pairs": false,
          "max_value": null,
          "min_value": null,
          "multi_value": false,
          "name": "Type",
          "required": false,
          "type": 2,
          "type_name": "Integer"
        },
        {
          "default_action": true,
          "column_key": "name",
          "max_length": null,
          "min_length": null,
          "multi_value": false,
          "multiline": false,
          "multilingual": false,
          "name": "Name",
          "password": false,
          "required": false,
          "type": -1,
          "type_name": "String"
        }
      ];

      columns = new NodeColumn2Collection(columnDefinitions);

      nodeChildrenModelData = {
        "container": false,
        "container_size": 0,
        "create_date": "2019-01-31T14:30:10",
        "create_user_id": 4660,
        "description": "",
        "description_multilingual": {"en": ""},
        "external_create_date": null,
        "external_identity": "",
        "external_identity_type": "",
        "external_modify_date": null,
        "external_source": "",
        "favorite": false,
        "id": 4708,
        "mime_type": "application\/pdf",
        "modify_date": "2019-02-21T10:11:11",
        "modify_user_id": 1000,
        "name": "PD502172-INT.pdf",
        "name_multilingual": {"en": "PD502172-INT.pdf"},
        "owner": "Smith, Kristen",
        "owner_group_id": 1001,
        "owner_user_id": 4660,
        "parent_id": 4707,
        "permissions_model": "advanced",
        "reserved": true,
        "reserved_date": "2019-02-21T10:11:12",
        "reserved_shared_collaboration": false,
        "reserved_user_id": 1000,
        "size": 226954,
        "size_formatted": "222 KB",
        "type": 144,
        "type_name": "Document",
        "versions_control_advanced": false,
        "volume_id": -2000,
        "wnf_att_4px_2": "Grindex AB"
      };
      collectionPreloaded = new NodeChildrenCollection([nodeChildrenModelData]);
      connector = context.getObject(ConnectorFactory);
      var defaultActionController = new DefaultActionController();
      var commands           = defaultActionController.commands,
          defaultActionItems = defaultActionController.actionItems;
      collection = context.getCollection(
          ChildrenCollectionFactory, {
            options: {
              commands: defaultActionController.commands,
              defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands),
              delayRestCommands: true
            }
          });
      delayedActionsLoaded = false;
      collection.delayedActions.once('sync', function () {
        delayedActionsLoaded = true;
      });

      var el = $('<div style="width: 960px;height: 500px">');
      $(document.body).empty().append(el);

      tableRegion = new Marionette.Region({el: el});
    });

    afterEach(function () {
      tableRegion.destroy();
      $(document.body).empty();
    });

    it('table.view not beeing drawn when not in DOM', function (done) {

      var tv = new TableView({
        columns: columns,
        collection: collectionPreloaded,
        tableColumns: tableColumns,
        columnsWithSearch: ["name"],
        context: context
      });

      var drawCnt = 0;
      var renderCnt = 0;
      tv.listenTo(tv, 'tableBodyRendered', function () {
        drawCnt++;
      });
      var t = setTimeout(function () {
        expect(drawCnt).toBe(0);
        expect(renderCnt).toBe(1);
        done();
      }, maxTestWaitInMilliseconds);

      tv.listenTo(tv, 'render', function () {
        renderCnt++;
      });

      tv.render();
    });

    it('table.view beeing drawn once when in DOM and have columns', function (done) {

      var tv = new TableView({
        columns: columns,
        collection: collectionPreloaded,
        tableColumns: tableColumns,
        columnsWithSearch: ["name"],
        context: context
      });

      var drawCnt = 0;
      var renderCnt = 0;
      tv.listenTo(tv, 'tableBodyRendered', function () {
        drawCnt++;
      });
      var t = setTimeout(function () {
        expect(drawCnt).toBe(1);
        expect(renderCnt).toBe(2);
        done();
      }, maxTestWaitInMilliseconds);

      tv.listenTo(tv, 'render', function () {
        renderCnt++;
      });

      tableRegion.show(tv);
    });

    it('table.view beeing drawn once when in DOM and have columns with many rows', function (done) {
      var rowModels = [];
      for (var i = 0; i < 66; i++) {
        var data = _.clone(nodeChildrenModelData);
        data.id = data.id + i;
        data.name = i.toString() + data.name;
        data.size = data.size + i;
        data.reserved = (i % 7) === 0;
        rowModels.push(data);
      }

      var tv = new TableView({
        columns: columns,
        collection: new NodeChildrenCollection(rowModels),
        tableColumns: tableColumns,
        columnsWithSearch: ["name"],
        context: context
      });

      var drawCnt = 0;
      var renderCnt = 0;
      tv.listenTo(tv, 'tableBodyRendered', function () {
        drawCnt++;
      });
      var t = setTimeout(function () {
        expect(drawCnt).toBe(1);
        expect(renderCnt).toBe(2);
        done();
      }, maxTestWaitInMilliseconds);

      tv.listenTo(tv, 'render', function () {
        renderCnt++;
      });

      tableRegion.show(tv);
    });

    it('table.view not beeing drawn when in DOM and have no columns', function (done) {

      var tv = new TableView({
        columns: [],
        collection: collectionPreloaded,
        tableColumns: tableColumns,
        columnsWithSearch: ["name"],
        context: context
      });

      var drawCnt = 0;
      var renderCnt = 0;
      tv.listenTo(tv, 'tableBodyRendered', function () {
        drawCnt++;
      });
      var t = setTimeout(function () {
        expect(drawCnt).toBe(0);
        expect(renderCnt).toBe(1);
        done();
      }, maxTestWaitInMilliseconds);

      tv.listenTo(tv, 'render', function () {
        renderCnt++;
      });

      tableRegion.show(tv);
    });

    it('table.view beeing drawn once when in DOM and columns are set after being rendered',
        function (done) {

          var tv = new TableView({
            columns: new NodeColumn2Collection(),
            collection: collectionPreloaded,
            tableColumns: tableColumns,
            columnsWithSearch: ["name"],
            context: context
          });

          var drawCnt = 0;
          var renderCnt = 0;
          tv.listenTo(tv, 'tableBodyRendered', function () {
            drawCnt++;
          });
          var t = setTimeout(function () {
            expect(renderCnt).toBe(2);
            expect(drawCnt).toBe(1);

            var maxRenderingTime = _.max(performance.getEntriesByName('table_render'), function( measure){
              return measure.duration;
            }).duration;
            console.log('maxRenderingTime', maxRenderingTime);
            expect(maxRenderingTime).toBeLessThan(2000);

            done();
          }, maxTestWaitInMilliseconds);

          tv.listenTo(tv, 'render', function () {
            renderCnt++;
          });
          tableRegion.show(tv);
          tv.columns.reset(columns.models);
        });

    it('table.view beeing drawn once when in DOM and nodes are set in collection after' +
       ' being rendered',
        function (done) {

          var tv = new TableView({
            columns: columns,
            collection: new NodeChildrenCollection(),
            tableColumns: tableColumns,
            columnsWithSearch: ["name"],
            context: context
          });

          var drawCnt = 0;
          var renderCnt = 0;
          tv.listenTo(tv, 'tableBodyRendered', function () {
            drawCnt++;
          });
          var t = setTimeout(function () {
            expect(renderCnt).toBe(2);
            expect(drawCnt).toBe(1);
            done();
          }, maxTestWaitInMilliseconds);

          tv.listenTo(tv, 'render', function () {
            renderCnt++;
          });
          tableRegion.show(tv);
          tv.collection.reset(collectionPreloaded.models);
        });

    it('table.view beeing drawn when in DOM and data gets fetched by context', function (done) {

      var tv = new TableView({
        collection: collection,
        tableColumns: tableColumns,
        columnsWithSearch: ["name"],
        context: context
      });

      var drawCnt = 0;
      var renderCnt = 0;
      tv.listenTo(tv, 'tableBodyRendered', function () {
        drawCnt++;
      });
      var t = setTimeout(function () {
        expect(drawCnt).toBe(1);
        expect(renderCnt).toBe(2);
        done();
      }, maxTestWaitInMilliseconds);

      tv.listenTo(tv, 'render', function () {
        renderCnt++;
      });

      tableRegion.show(tv);
      context.fetch();
    });

  });

});
