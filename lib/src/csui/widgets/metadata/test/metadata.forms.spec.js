/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/connector',
  'csui/models/node/node.model', 'csui/widgets/metadata/metadata.forms',
  './metadata.forms.mock.js'
], function (_, Connector, NodeModel, MetadataFormCollection, mock) {
  'use strict';

  describe('MetadataFormCollection', function () {
    beforeAll(function () {
      mock.enable();
      this.connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: { ticket: 'dummy' }
        }
      });
      this.node = new NodeModel({
        id: 11111,
        type: 0
      }, {
        connector: this.connector
      });
    });

    afterAll(function () {
      mock.disable();
    });

    var modes = ['update', 'create', 'copy', 'move'];
    modes.forEach(function (mode) {
      describe('in the ' + mode + ' mode', function () {
        beforeAll(function (done) {
          this.forms = new MetadataFormCollection(undefined, {
            node: this.node,
            container: this.node,
            connector: this.connector,
            action: mode,
            autoreset: true
          });
          this.forms
              .fetch()
              .done(done);
        });
  
        var formIndexes = {
          update: [1, 2],
          create: [1, 2],
          copy: [0, 1],
          move: [0, 1]
        };
    
        describe('for categories', function () {
          it('sets the removeable flag to true by default', function () {
            var form = this.forms.at(formIndexes[mode][0]);
            expect(form.get('removeable')).toBe(true);
            expect(form.get('allow_delete')).toBe(true);
          });
  
          it('keeps the removeable as false if requested', function () {
            var form = this.forms.at(formIndexes[mode][1]);
            expect(form.get('removeable')).toBe(false);
            expect(form.get('allow_delete')).toBe(false);
          });
        });
      });
    });
  });
});
