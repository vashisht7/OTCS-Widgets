/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore'
], function (_) {
  'use strict';

  function getMimeType(fileName) {
    if (!fileName || fileName.indexOf('.') === -1) {
      return '';
    }

    var mimeType = '',
        name     = fileName.split('.').pop();

    switch (name) {
    case 'dwg':
    case 'dxf':
    case 'svf':
      mimeType = 'drawing/dwg';
      break;
    case 'jar':
    case 'war':
      mimeType = 'application/x-zip';
      break;
    case 'XLS5':
    case 'xlb':
    case 'xlsx':
      mimeType = 'application/vnd.ms-excel';
      break;
    case 'pptx':  //chrome does not provide the 'type' information for office docs while drand drop from desktop.
    case 'ppt':
      mimeType = 'application/vnd.ms-powerpoint';
      break;
    case 'docx':
    case 'doc':
      mimeType = 'application/msword';
      break;
    case 'vob':
      mimeType = 'video/mpeg';
      break;
    case 'odf':
    case 'xsm':
      mimeType = 'application/vnd.oasis.opendocument.formula';
      break;
    }

    return mimeType;
  }

  return {
    getMimeType: getMimeType
  };

});