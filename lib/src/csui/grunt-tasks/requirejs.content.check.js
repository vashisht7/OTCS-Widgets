/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



'use strict';

var fs = require('fs');

module.exports = function (grunt) {
  grunt.registerMultiTask('requirejsContentCheck',
      'Check that output bundles contain only modules with the specified prefix',
      function () {
        var options = this.options({
              exceptions: [],
              force: false
            }),
            force = options.force,
            prefix = options.prefix,
            bundles = options.bundles,
            exceptions = options.exceptions;

        try {
          var contents = getBundleContents();
          var result = checkBundleContents(contents);
          var all = Object.keys(bundles);
          var problems = Object.keys(result);
          if (problems.length) {
            throw new Error(all.length + ' bundles checked, ' +
                problems.length + ' included foreign modules.');
          }
          grunt.log.ok(all.length + ' bundles checked, all are correct.');
        } catch (error) {
          grunt.verbose.error(error.stack);
          grunt.log.error(error);
          var warn = force ? grunt.log.warn : grunt.fail.warn;
          warn('Checking the bundle contants failed.');
        }
        function getBundleContents() {
          grunt.verbose.writeln('Getting bundle contents...');
          return bundles.reduce(function (result, bundle) {
            grunt.verbose.writeln('Loading the bundle ' + bundle + '...');
            result[bundle] = fs.readFileSync(bundle, 'utf-8');
            return result;
          }, {});
        }
        function checkBundleContents(contents) {
          grunt.verbose.writeln('Checking bundle contents...');
          var moduleDeclaration = /csui\.define\((?:'|")(?:[^\/'"]+!)?([^\/'"]+)(\/[^'"]+)?['"]/g;
          return Object
              .keys(contents)
              .reduce(function (result, bundle) {
                checkBundleContent(result, bundle);
                return result;
              }, {});

          function checkBundleContent (result, bundle) {
            grunt.verbose.writeln('Checking content of the bundle ' + bundle + '...');
            var content = contents[bundle];
            var match;
            while ((match = moduleDeclaration.exec(content))) {
              var module = match[1]; // prefix only
              if (module !== prefix) {
                module += match[2]; // full module name
                if (module.indexOf('bundles/') !== 0 &&
                    exceptions.indexOf(module) < 0) {
                  var resultBundle = result[bundle] || (result[bundle] = []);
                  grunt.log.warn('The bundle ' + bundle + ' contains a foreign module ' + module + '.');
                  resultBundle.push(module);
                }
              }
            }
          }
        }
      });
};
