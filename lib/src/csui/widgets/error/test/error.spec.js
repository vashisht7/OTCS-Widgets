/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/widgets/error/error.view'],
    function (Marionette, ErrorWidgetView) {
      'use strict';
      describe('Error Widget', function () {
        it('Initialize', function () {
          var errorWidgetView = new ErrorWidgetView({
            data: {
              message: 'The object cannot be accessed now.',
              suggestion: 'Please try again later or contact the administrator.'
            }
          });
          var errorRegion = new Marionette.Region({el: document.body});
          errorRegion.show(errorWidgetView);
          expect(errorWidgetView).toBeDefined();
        });
      });
    });