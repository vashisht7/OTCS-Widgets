/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/utils/node.links/node.links'
], function (Backbone, nodeLinks) {
  'use strict';

  describe('nodeLinks.getUrl', function () {
    beforeAll(function () {
      this.node = new Backbone.Model({id: 1});
      this.node.connector = {
        connection: {
          url: 'http://server/otcs/cs/api/v1'
        }
      };
    });

    it('returns a node perspective URL for a common node', function () {
      var url = nodeLinks.getUrl(this.node);
      expect(url).toEqual('http://server/otcs/cs/app/nodes/1');
    });

    it('returns the URL for a URL node', function () {
      this.node.set({
        type: 140,
        url: 'http://opentext.com'
      });
      var url = nodeLinks.getUrl(this.node);
      expect(url).toEqual('http://opentext.com');
    });

    it('returns a search URL for a saved query node', function () {
      this.node.set('type', 258);
      var url = nodeLinks.getUrl(this.node);
      expect(url).toEqual('http://server/otcs/cs/app/search/query_id/1');
    });

    describe('when working with a node without any server connection', function () {
      beforeAll(function () {
        this.node = new Backbone.Model({
          id: 1,
          type: 0
        });
        this.connector = {
          connection: {
            url: 'http://server/otcs/cs/api/v1'
          }
        };
      });

      it('returns a relative URL by default', function () {
        var url = nodeLinks.getUrl(this.node);
        expect(url).toEqual('/app/nodes/1');
      });

      it('returns an absolute URL with a specified connector', function () {
        var url = nodeLinks.getUrl(this.node, { connector: this.connector });
        expect(url).toEqual('http://server/otcs/cs/app/nodes/1');
      });
    });

    describe('when working with a URL node', function () {
      beforeAll(function () {
        this.node = new Backbone.Model({
          id: 1,
          type: 140
        });
        this.node.connector = {
          connection: {
            url: 'http://server/otcs/cs/api/v1'
          }
        };
      });

      it('prepends application URL base to relative path', function () {
        this.node.set('url', 'test');
        var url = nodeLinks.getUrl(this.node);
        expect(url).toEqual('http://server/otcs/cs/app/test');
      });

      it('prepends origin to a relative URL', function () {
        this.node.set('url', '/test');
        var url = nodeLinks.getUrl(this.node);
        expect(url).toEqual('http://server/test');
      });

      it('prepends protocol to an absolute URL, if it is missing', function () {
        this.node.set('url', '//opentext.com');
        var url = nodeLinks.getUrl(this.node);
        expect(url).toEqual(location.protocol + '//opentext.com');
      });
    });
  });

  describe('nodeLinks.completeUrl', function () {
    beforeAll(function () {
      this.node = new Backbone.Model({id: 1});
      this.node.connector = {
        connection: {
          url: 'http://server/otcs/cs/api/v1'
        }
      };
    });

    it('returns a node perspective URL for a common node', function () {
      var url = nodeLinks.completeUrl(this.node, 'nodes/1');
      expect(url).toEqual('http://server/otcs/cs/app/nodes/1');
    });

    it('returns the input URL if it is absolute', function () {
      var url = nodeLinks.completeUrl(this.node, 'http://opentext.com');
      expect(url).toEqual('http://opentext.com');
    });

    describe('when working with a node without any server connection', function () {
      beforeAll(function () {
        this.node = new Backbone.Model({
          id: 1,
          type: 0
        });
        this.connector = {
          connection: {
            url: 'http://server/otcs/cs/api/v1'
          }
        };
      });

      it('returns a relative URL by default', function () {
        var url = nodeLinks.completeUrl(this.node, 'nodes/1');
        expect(url).toEqual('/app/nodes/1');
      });

      it('returns an absolute URL with a specified connector', function () {
        var url = nodeLinks.completeUrl(this.node, 'nodes/1', { connector: this.connector });
        expect(url).toEqual('http://server/otcs/cs/app/nodes/1');
      });
    });
  });
});
