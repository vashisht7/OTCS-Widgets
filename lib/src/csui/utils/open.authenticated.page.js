/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/utils/url'
], function ($, Url) {
  'use strict';

  function openAuthenticatedPage (connector, url, options) {
    var cgiUrl = new Url(connector.connection.url).getCgiScript();
    var ticket = connector.connection.session.ticket;

    var contentDocument = createWindowDocument();
    var form = createForm();
    createField('func', 'csui.authenticate');
    createField('otcsticket', ticket);
    createField('nexturl', url);
    form.submit();

    return $.Deferred().resolve().promise();

    function createWindowDocument() {
      options || (options = {});
      var content = options.window || (options.openInNewTab === false ?
          window : window.open('', '_blank'));
      return content.document;
    }

    function createForm() {
      var form = contentDocument.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('action', cgiUrl);
      contentDocument.body.appendChild(form);
      return form;
    }

    function createField(name, value) {
      var field = contentDocument.createElement('input');
      field.setAttribute('name', name);
      field.setAttribute('value', value);
      field.setAttribute('type', 'hidden');
      form.appendChild(field);
    }
  }

  return openAuthenticatedPage;
});
