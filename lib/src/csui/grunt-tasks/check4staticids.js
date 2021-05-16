/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

module.exports = function (grunt) {

  var fs = require('fs-extra'),
      _ = grunt.util._;
  grunt.registerMultiTask('checkSrc4StaticIds',
      'check for the use of static ids',

      function () {

        var taskName = this.name;
        grunt.log.debug(taskName + ": found " + this.files.length + " files");
        var idsFound = 0;
        _.each(this.files, function (file) {
          var src = file.src[0];
          var isTestSpec = src.search(/spec.js$/) >= 0;
          var isMock = src.search(/mock.js$/) >= 0;
          var isInTestDir = src.search(/\/test\//) >= 0;
          var isInLibDir = src.search(/^lib\//) >= 0;

          if (!(isTestSpec || isMock || isInTestDir || isInLibDir)) {
            var jsText = fs.readFileSync(src, 'utf8');
            var regex = /\sid=['"]([a-zA-Z0-9_-]+)['"]/g;
            var searchRes = jsText.match(regex);
            if (searchRes) {
              idsFound += searchRes.length;
              grunt.log.error(src + " has " + searchRes.length + " static ids: " + searchRes);
            }
            var regex2 = /\sid:\s*['"]([a-zA-Z0-9_-]+)['"]/g;
            var searchRes2 = jsText.match(regex2);
            if (searchRes2) {
              idsFound += searchRes2.length;
              grunt.log.error(src + " has " + searchRes2.length + " static ids: " + searchRes2);
            }
          }
        });
        if (idsFound > 0) {
          grunt.log.error("Found " + idsFound + " static ids in files");
        } else {
          grunt.log.debug("No static ids found in files");
        }
      });
  grunt.registerMultiTask('checkHtml4StaticIds',
      'check the snapshots for static ids',

      function () {

        var taskName = this.name;
        grunt.log.debug(taskName + ": found " + this.files.length + " files");
        var idsFound = [];

        _.each(this.files, function (file) {
          var src = file.src[0];
          var htmlText = fs.readFileSync(src, 'utf8');
          var regex = /\sid=['"]([a-zA-Z_-]+)['"]/g;
          var searchRes = htmlText.match(regex);
          if (searchRes) {
            idsFound.push(searchRes);
            grunt.log.debug(src + " has " + searchRes.length + " static ids: " + searchRes);
          }
        });
        if (idsFound.length > 0) {
          idsFound = _.uniq(_.flatten(idsFound));
          grunt.log.error("Found " + idsFound.length + " static ids in files: " + idsFound);
        } else {
          grunt.log.debug("No static ids found in files");
        }
      });

};