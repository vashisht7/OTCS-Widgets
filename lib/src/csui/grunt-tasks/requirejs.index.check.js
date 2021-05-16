/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var fs = require('fs'),
    path = require('path'),
    parseBuildConfig = require('./utils/parse.build.config');

module.exports = function (grunt) {

  grunt.registerMultiTask('requirejsIndexCheck',
      'Check if modules from the bundle index module are bundled in the same bundle',
      function () {
        var done = this.async(),
            options = this.options({
              appDir: '.',
              output: '.',
              bundles: [],
              config: {},
              force: false
            }),
            config = options.config,
            force = options.force,
            sourceRoot = options.appDir,
            output = options.output,
            bundles = options.bundles.map(function (name) {
              return { module: name };
            }),
            failed;
        if (typeof config === 'string') {
          config = parseBuildConfig(config);
        }
        getBundleIndexes()
            .then(getBundleContent)
            .then(checkBundleContents)
            .then(function () {
              var message;
              if (failed) {
                message = 'At least one module was declared in a ' +
                          'bundle index, but it was not included in ' +
                          'the output of that bundle. Probably modules ' +
                          'from other bundle on a lower level depend on ' +
                          'it too and pulled it to that bundle.';
                throw new Error(message);
              }
              grunt.log.ok('Checking declared modules in bundle indexes succeeded.');
              done();
            })
            .catch(function (error) {
              grunt.verbose.error(error.stack);
              grunt.log.error(error);

              var warn = force ? grunt.log.warn : grunt.fail.warn;
              warn('Checking declared modules in bundle indexes failed.');
              done();
            });
        function getBundleIndexes() {
          grunt.verbose.writeln('Getting bundle indexes...');
          return new Promise(function (resolve) {
            bundles.forEach(function (bundle) {
              var bundleFileName = path.join(sourceRoot, bundle.module + '.js');
              bundle.index = getBundleIndex(bundleFileName);
              grunt.verbose.writeln('Bundle ' + bundle.module + ' exposes ' +
                                    bundle.index.length + ' modules.');
            });
            resolve();
          });
        }
        function getBundleContent() {
          return new Promise(function (resolve) {
            bundles.forEach(function (bundle) {
              grunt.verbose.writeln('Loading ' + bundle.module + '...');
              var bundleFilePath = path.join(output, bundle.module + '.js');
              bundle.content = fs.readFileSync(bundleFilePath, 'utf-8');
            });
            resolve();
          });
        }
        function checkBundleContents() {
          bundles.forEach(checkBundleContent);
        }
        function checkBundleContent(bundle) {
          grunt.verbose.writeln(
            'Checking declared content of ' + bundle.module + '...');
          bundle.index.forEach(function (referenceName) {
            if (referenceName.endsWith('!')) {
              referenceName = referenceName.substr(0, referenceName.length - 1);
            }
            var moduleDeclaration = new RegExp(
              'csui\\.define\\(\\s*[\'"]' + referenceName + '[\'"]', 'm');
            if (!moduleDeclaration.test(bundle.content)) {
              var moduleName = referenceName.replace(/^[^!]+!(.+)$/, '$1');
              moduleDeclaration = new RegExp(
                'csui\\.define\\(\\s*[\'"]' + moduleName + '[\'"]', 'm');
              if (!moduleDeclaration.test(bundle.content)) {
                grunt.log.warn('Module ' + referenceName +
                  ' is declared in the bundle index ' + bundle.module +
                  ', but not found in the bundle content.');
                failed = true;
              }
            }
          });
        }
        function getBundleIndex(bundleFilePath) {

          var bundleFileContent = fs.readFileSync(bundleFilePath, 'utf-8'),
              bundleIndex;
          function require() {}
          function define(name, dependencies) {
            bundleIndex = Array.isArray(name) ? name : dependencies;
          }

          eval(bundleFileContent);
          if (!bundleIndex) {
            throw new Error('Missing bundle index.');
          }

          return bundleIndex;
        }
      });
};
