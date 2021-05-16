/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/alpaca/js/alpaca'
], function (Alpaca) {
  'use strict';

  describe('Alpaca', function () {
    describe('includes AbstractTemplateEngine, that', function () {
      describe('strips the template of the wrapper script, and can handle', function () {
        beforeAll(function () {
          this.templateEngine = new Alpaca.AbstractTemplateEngine('test');
        });

        it('null input', function () {
          var result = this.templateEngine.cleanup(null);
          expect(result).toEqual(null);
        });

        it('empty content', function () {
          var result = this.templateEngine.cleanup('');
          expect(result).toEqual('');
        });

        it('content wrapped in script', function () {
          var result = this.templateEngine.cleanup('<script>test</script>');
          expect(result).toEqual('test');
        });

        it('content wrapped in a not trimmed script', function () {
          var result = this.templateEngine.cleanup(' <script>test</script> ');
          expect(result).toEqual('test');
        });

        it('text not wrapped in script', function () {
          var result = this.templateEngine.cleanup('test');
          expect(result).toEqual('test');
        });

        it('element not wrapped in script', function () {
          var result = this.templateEngine.cleanup('<p>test</p>');
          expect(result).toEqual('<p>test</p>');
        });

        it('more than one element', function () {
          // This would be a bad template, but the original Alpaca does not report it
          // as an error, but returns the unchanged template text.
          var result = this.templateEngine.cleanup('<script>test</script><script>test</script>');
          expect(result).toEqual('<script>test</script><script>test</script>');
        });
      });
    });
  });
});
