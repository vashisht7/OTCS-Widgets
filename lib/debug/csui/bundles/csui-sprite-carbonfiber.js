
            // In IE require the svg loader module and set spritePath to empty.
            // For other browsers, calculate the sprite path
            csui.define(/Trident.*11/i.test(navigator.userAgent) ? ['csui/themes/carbonfiber/svg_sprites/symbol/spriteLoader'] : ['require'],
                function (require) {
                  var spritePath;
                  if (/Trident.*11/i.test(navigator.userAgent)) {
                    spritePath = '';
                  } else {
                    var m = require.toUrl('csui');
                    // The replace with regexp below moves the cache busting parameter after the svg
                    // path.
                    // require.toUrl returns path including the cache busting query parameter
                    // in debug it returns ./../../src?
                    // in release it returns the path to csui plus the cache busting parameter
                    // after the ?
                    //
                    // Regexp matches:
                    //  $1: beginning of path without ?
                    //  $2: rest of path starting with the ?
                    spritePath = m.replace(/(^[^?]+)(\?[^?]*)?$/, '$1/themes/carbonfiber/svg_sprites/symbol/svg/sprite.symbol.svg$2');

                    // remove ? from the end if no cache busting parameter is there
                    if (spritePath[spritePath.length - 1] === '?') {
                      spritePath = spritePath.substr(0, spritePath.length - 1);
                    }
                  }
                  return {
                    getSpritePath: function () {
                      return spritePath;
                    }
                  };
                });
          
csui.define("csui/themes/carbonfiber/svg_sprites/symbol/sprite", function(){});

csui.define('bundles/csui-sprite-carbonfiber',[
  "csui/themes/carbonfiber/svg_sprites/symbol/sprite"
], {});

