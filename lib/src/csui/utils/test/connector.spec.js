/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/basicauthenticator', 'csui/utils/connector',
  'csui/models/node/node.model', './connector.mock.data.js'
], function (_, BasicAuthenticator, Connector,
    NodeModel, ConnectorMock) {
  'use strict';

  describe('Connector', function () {
    var authenticator, connector;

    beforeAll(function () {
      ConnectorMock.enable();

      authenticator = new BasicAuthenticator({
        credentials: {
          username: 'Admin',
          password: 'livelink'
        }
      });
      connector = new Connector({
        authenticator: authenticator,
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/otcssupport'
        }
      });
    });

    afterAll(function () {
      ConnectorMock.disable();
    });

    it('can be instantiated', function () {
      expect(connector).toBeDefined();
    });

    it('provides connection URL as an object', function () {
      var url = connector.getConnectionUrl();
      expect(url.toString()).toEqual('//server/otcs/cs/api/v1');
      expect(url.getApiBase('v2')).toEqual('//server/otcs/cs/api/v2/');
    });

    it('can authenticate ...', function () {
      connector.authenticator.authenticate({
        credentials: {
          username: 'Admin',
          password: 'livelink'
        }
      }, function () {
        expect(true).toBeTruthy();
      }, function () {
        expect(false).toBeTruthy('Authentication failed');
      });
    });

    it('can connect and get NodeModel...', function (done) {
      var node = new NodeModel({id: 2000}, {
        connector: connector
      });

      var fetched = node.fetch()
                        .then(function () {
                          var name = node.get('name');
                          expect(name).toEqual('Enterprise');
                          done();
                        })
                        .fail(function () {
                          expect(false).toBeTruthy(
                              'Fetch failed (state=' + fetched.state() + '\').');
                        });
    });

    describe('makeAjaxCall', function () {
      it('enables the right processing of FormData in jQuery', function (done) {
        connector
            .makeAjaxCall({
              type: 'POST',
              url: '//server/otcs/cs/api/v1/auth/photo',
              data: new FormData()
            })
            .done(function (response) {
              expect(response.contentType).toEqual(false);
              expect(response.processData).toEqual(false);
              done();
            });
      });
    });

    describe('with a connection authenticated by OTCSTicket', function () {
      beforeAll(function () {
        connector = new Connector({
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/otcssupport',
            session: {ticket: 'dummy'}
          }
        });
      });

      it('makeAjaxCall makes the request right away', function (done) {
        var jqxhr = connector.makeAjaxCall({
          url: '//server/otcs/cs/api/v2/nodes/2000'
        });
        expect(typeof jqxhr.abort).toEqual('function');
        jqxhr.then(done);
      });

      it('sync makes the request right away', function (done) {
        var node = new NodeModel({id: 2000}, {
          connector: connector
        });
        var jqxhr = node.fetch();
        expect(typeof jqxhr.abort).toEqual('function');
        jqxhr.then(done);
      });
    });

    describe('with a connection authenticated by OTDSTicket', function () {
      beforeEach(function () {
        connector = new Connector({
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/otcssupport',
            authenticationHeaders: {OTDSTicket: 'dummy'}
          }
        });
      });

      it('makeAjaxCall exchanges the ticket for OTCSTicket', function (done) {
        var jqxhr = connector.makeAjaxCall({
          url: '//server/otcs/cs/api/v2/nodes/2000'
        });
        expect(jqxhr.abort).toBeUndefined();
        jqxhr.then(function () {
          expect(typeof connector.connection.session).toEqual('object');
          expect(connector.connection.session.ticket).toEqual('dummy');
          done();
        });
      });

      it('sync exchanges the ticket for OTCSTicket', function (done) {
        var node = new NodeModel({id: 2000}, {
          connector: connector
        });
        var jqxhr = node.fetch();
        expect(jqxhr.abort).toBeUndefined();
        jqxhr.then(function () {
          expect(typeof connector.connection.session).toEqual('object');
          expect(connector.connection.session.ticket).toEqual('dummy');
          done();
        });
      });
    });
  });
});
