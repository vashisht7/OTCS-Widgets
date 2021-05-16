/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

module.exports = function (grunt) {

  var fs = require('fs-extra'),
    _ = grunt.util._;
  grunt.registerMultiTask('checkHbs4UnescapedValues',
    'check for the use of unescaped values',

    function () {

      var taskName = this.name;
      grunt.log.debug(taskName + ": found " + this.files.length + " files");
      var numFound = 0;
      _.each(this.files, function (file) {

        var src = file.src[0];
        var jsText = fs.readFileSync(src, 'utf8');

        var regex = /{{{/g;
        var searchRes = jsText.match(regex);
        if (searchRes) {
          numFound += searchRes.length;
          grunt.log.error(src + " uses " + searchRes.length + " unescaped values");
        }
      });
      if (numFound > 0) {
        grunt.log.error("Found " + numFound + " unescaped values in handlebars templates");
      } else {
        grunt.log.debug("No unescaped values found in handlebars templates");
      }
    });

};