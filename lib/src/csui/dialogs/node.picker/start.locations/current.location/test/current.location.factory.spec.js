/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/utils/connector', 'csui/models/node/node.model',
  'csui/dialogs/node.picker/start.locations/current.location/current.location.factory',
  './current.location.factory.mock.js'
], function (Backbone, Connector, NodeModel, CurrentLocationFactory, mock) {
  'use strict';

  describe('NodeStateCellView', function () {
    beforeAll(function () {
      this.connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
    });

    beforeAll(mock.enable);
    afterAll(mock.disable);

    it('a node for a volume includes an ID before the children are initialized', function (done) {
      var categoryVolume = new NodeModel({ id: 'volume', type: 133 }, { connector: this.connector });
      var currentLocation = new CurrentLocationFactory({ container: categoryVolume });
      var menuItem = new Backbone.Model();
      currentLocation
          .updateLocationModel(menuItem)
          .then(function () {
            expect(categoryVolume.get('id')).toBeTruthy();
            done();
          });
    });

    it('a node with an ID is not re-fetched before the children are initialized', function (done) {
      var categoryVolume = new NodeModel({ id: 1234 }, { connector: this.connector });
      var currentLocation = new CurrentLocationFactory({ container: categoryVolume });
      var menuItem = new Backbone.Model();
      currentLocation
          .updateLocationModel(menuItem)
          .then(done);
    });
  });
});
