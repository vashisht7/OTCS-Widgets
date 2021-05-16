/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/contexts/context', 'csui/utils/contexts/factories/ancestors'
], function (Context, AncestorCollectionFactory) {
  'use strict';

  describe('AncestorCollectionFactory', function () {
    var context;

    beforeEach(function () {
      context = new Context({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });
    });

    it('does not add the contextual node with the permanent flag as a side-effect', function () {
      context.getModel(AncestorCollectionFactory, {
        permanent: true
      });
      var nodeFactory = context.getFactory('node');
      expect(nodeFactory.options.permanent).toBeFalsy();
    });
  });
});
