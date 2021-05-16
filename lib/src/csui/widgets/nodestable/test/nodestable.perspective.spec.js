/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/contexts/perspective/perspective.context', './nodestable.mock.js'
], function (NodesTableView, PerspectiveContext, mock) {
  'use strict';

  describe('NodesTableView in the perspective context', function () {
    beforeAll(function () {
      mock.enable();
      this.context = new PerspectiveContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: { ticket: 'dummy' }
            }
          }
        }
      });
      this.nextNode = this.context.getModel('nextNode');
    });

    afterAll(function () {
      mock.disable();
    });
    it('with a filter applied before a drill-down, the filter will be cleared by default', function (done) {
      this.nextNode.set('id', 2000);
      this.context.once('change:perspective', function () {
        this.context.clear();
        this.nodesTableView = new NodesTableView({ context: this.context });
        this.nodesTableView.render();
        this.context.fetch();
        this.context.once('sync', function () {
          this.nodesTableView.collection.setFilter({ name: 'test' }, false);
          this.nextNode.set('id', 2001);
          this.context.once('sync', function () {
            var filters = this.nodesTableView.collection.filters || {};
            expect(filters.name).toBeFalsy();
            done();
          }, this);
        }.bind(this));
      }, this);
    });
  });
});
