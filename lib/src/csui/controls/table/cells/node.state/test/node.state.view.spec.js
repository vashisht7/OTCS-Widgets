/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context', 'csui/models/nodechildren',
  'csui/controls/table/table.view', 'csui/controls/table/table.columns'
], function ($, Backbone, Marionette, PageContext, NodeChildrenCollection,
    TableView, tableColumns) {
  'use strict';

  describe('NodeStateCellView', function () {
    beforeAll(function () {
      this.tableContainer = $('<div>', { style: 'width:700px; height: 500px' })
        .appendTo('body');
      this.tableRegion = new Marionette.Region({ el: this.tableContainer });
    });

    beforeAll(function () {
      this.context = new PageContext({
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
          user: {
            attributes: { id: 1000 }
          }
        }
      });
      this.items = new NodeChildrenCollection([
        {
          id: 1,
          name: 'Reserved Item',
          reserved: true,
          reserved_user_id: 1000,
          reserved_user_id_expand: {
            id: 1000
          },
          actions: [
            { signature: 'unreserve' }
          ]
        }
      ]);
      this.columns = new Backbone.Collection([
        {
          key: 'name',
          name: 'Name',
          type: -1,
          definitions_order: 10
        },
        {
          key: 'reserved',
          name: 'Reserved',
          type: 5,
          definitions_order: 20
        }
      ]);
      this.columns.each(function (column) {
        column.set('column_key', column.get('key'));
      });
    });

    beforeAll(function () {
      this.tableView = new TableView({
        collection: this.items,
        columns: this.columns,
        tableColumns: tableColumns.deepClone(),
        context: this.context,
        selectRows: 'none',
        haveDetailsRowExpandCollapseColumn: false
      });
      this.tableRegion.show(this.tableView);
    });

    afterAll(function () {
      this.tableRegion.empty();
    });

    afterAll(function () {
      this.tableContainer.remove();
    });

    it('focuses the first icon when entering the table cell', function (done) {
      this.tableView.on('render', function () {
        var nodeStateCell = getNodeStateCell(this.tableView);
        nodeStateCell.tabIndex = -1;
        nodeStateCell.focus();
        expect(nodeStateCell).toBe(document.activeElement);
        pressKey('Enter', nodeStateCell);
        var reservationIcon = getReservationIcon(nodeStateCell);
        expect(reservationIcon.contains(document.activeElement)).toBeTruthy();
        done();
      }.bind(this));
    });

    it('focuses the table cell when leaving the icons', function () {
      var nodeStateCell = getNodeStateCell(this.tableView);
      pressKey('Escape', nodeStateCell);
      expect(nodeStateCell).toBe(document.activeElement);
    });

    function getNodeStateCell (tableView) {
      var nodeStateCell = tableView.$('tbody tr:first-child td:nth-child(2)');
      expect(nodeStateCell.length).toEqual(1);
      return nodeStateCell[0];
    }

    function getReservationIcon (nodeStateCell) {
      var reservationIcon = nodeStateCell.querySelector('.csui-node-state-reservation');
      expect(reservationIcon).toBeTruthy();
      return reservationIcon;
    }

    function pressKey (key, element) {
      var enterDownEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: key
      });
      element.dispatchEvent(enterDownEvent);
      var enterUpEvent = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: key
      });
      element.dispatchEvent(enterUpEvent);
    }
  });
});
