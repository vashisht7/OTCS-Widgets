/*
 * TODO: remove this file, and change the occurances to point to "csui/lib/jquery.ui/js/jquery-ui"
 */

csui.define('esoc/lib/jquery-ui', ['module',
    'csui/lib/jquery.ui/js/jquery-ui',
    'css!esoc/lib/jquery.ui/themes/opentext/jquery-ui.css'
], function (module, ui) {
    //console.warn(" 'esoc/lib/jquery-ui' is deprecated, instead, use" +
    //             " 'csui/lib/jquery.ui/js/jquery-ui' ");
    return ui;
});