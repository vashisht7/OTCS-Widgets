/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ "module", "csui/lib/underscore", "csui/lib/jquery"
], function (module, _, $) {

  //is onprogress supported by browser?
  var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

  //If not supported, do nothing
  if (!hasOnProgress) {
    return;
  }

  //patch ajax settings to call a progress callback
  var oldXHR = $.ajaxSettings.xhr;
  $.ajaxSettings.xhr = function () {
    var xhr = oldXHR();

    // Execute the progress callback only if the caller of $.ajax() specified
    // it in the options object. This is the jQuery object instance enriched
    // with the parameters passed to the $.ajax() options.
    if (this.progress) {
      if (xhr instanceof window.XMLHttpRequest) {
        xhr.addEventListener('progress', this.progress, false);
      }

      if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.progress, false);
      }
    }

    return xhr;
  };

  return $;

});
