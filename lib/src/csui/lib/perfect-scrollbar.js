/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
define(['csui/lib/jquery', 'css!csui/lib/perfect-scrollbar/perfect-scrollbar'
], function (jQuery) {

  (function (factory) {
    'use strict';

    factory(jQuery);

  })(function ($) {
    'use strict';

    //[OT]: Obtaining offset of an element in jQuery v3 should perform only when it is attached to dom.
    var getElementOffset = function (ele) {
	    return ele.is(':visible') ? ele.offset() : {top: 0, left: 0};
    }

    function getInt(x) {
      if (typeof x === 'string') {
        return parseInt(x, 10);
      } else {
        return ~~x;
      }
    }

    var defaultSettings = {
      wheelSpeed: 1,
      wheelPropagation: false,
      swipePropagation: true,
      minScrollbarLength: null,
      maxScrollbarLength: null,
      useBothWheelAxes: false,
      useKeyboard: true,
      suppressScrollX: false,
      suppressScrollY: false,
      scrollXMarginOffset: 0,
      scrollYMarginOffset: 0,
      includePadding: false
    };

    var incrementingId = 0;
    var eventClassFactory = function () {
      var id = incrementingId++;
      return function (eventName) {
        var className = '.perfect-scrollbar-' + id;
        if (typeof eventName === 'undefined') {
          return className;
        } else {
          return eventName + className;
        }
      };
    };

    var isWebkit    = 'WebkitAppearance' in document.documentElement.style,
        winNav      = window.navigator,
        isOpera     = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge    = /Edge/.test(winNav.userAgent),
        isMSBrowser = /Trident.*11/i.test(winNav.userAgent) || isIEedge,
        isFirefox   = typeof InstallTrigger !== 'undefined',
        isSafari    = /constructor/i.test(window.HTMLElement) ||
                      (function (p) {
                        return p.toString() === "[object SafariRemoteNotification]";
                      })(!window['safari'] || safari.pushNotification);

    /*jQuery function to handle browsers incompatibilities with jQuery.fn.scrollLeft in RTL
     direction. This function checks for Browser type and then do necessary calculation for
      scrollLeft. It should only be used in RTL direction.

     scrollLeft property of a div seems to return different values in different browsers, when
     direction is RTL.
      Chrome - the initial value is positive number (say 400), and when moving the scrollbar to the
       left it is 0.
      IE - the initial value is 0 and when moving the scrollbar to the left it is positive number
       (say 400).
      Firefox - the initial value is 0 and when moving the scrollbar to the left it is negative
       number (say -400).
     https://stackoverflow.com/questions/24485043/jquery-scrollleft-in-rtl-direction-different-value-in-firefox-chrome
     https://stackoverflow.com/questions/11614994/jquery-scrollleft-when-direction-is-rtl-different-values-in-different-browse
    */
    $.fn.scrollLeftRtl = function (i) {
      var value;
      if (i === undefined) {
        value = $.fn.scrollLeft.apply(this, arguments);
        if (isMSBrowser) {
          return this[0].scrollWidth - value - this[0].clientWidth;
        } else if (isFirefox || isSafari || isOpera) {
          return value + this[0].scrollWidth - this[0].clientWidth;
        }
      } else {
        value = i;
        if (isMSBrowser) {
          value = this[0].scrollWidth - i - this[0].clientWidth;
        } else if (isFirefox || isSafari || isOpera) {
          value = i - this[0].scrollWidth + this[0].clientWidth;
        }
        value = $.fn.scrollLeft.call(this, value);
      }
      return value;
    };

    $.fn.perfectScrollbar = function (suppliedSettings, option) {

      return this.each(function () {
        var settings = $.extend(true, {}, defaultSettings);
        var $this = $(this);
        var isPluginAlive = function () { return !!$this; };

        if (typeof suppliedSettings === "object") {
          // Override default settings with any supplied
          $.extend(true, settings, suppliedSettings);
        } else {
          // If no setting was supplied, then the first param must be the option
          option = suppliedSettings;
        }

        // Catch options
        if (option === 'update') {
          if ($this.data('perfect-scrollbar-update')) {
            $this.data('perfect-scrollbar-update')();
          }
          return $this;
        }
        else if (option === 'destroy') {
          if ($this.data('perfect-scrollbar-destroy')) {
            $this.data('perfect-scrollbar-destroy')();
          }
          return $this;
        }

        if ($this.data('perfect-scrollbar')) {
          // if there's already perfect-scrollbar
          return $this.data('perfect-scrollbar');
        }


        // Or generate new perfectScrollbar

        $this.addClass('ps-container');

        var containerWidth;
        var containerHeight;
        var contentWidth;
        var contentHeight;

        var isRtl = $this.css('direction') === "rtl";
        var eventClass = eventClassFactory();
        var ownerDocument = this.ownerDocument || document;

        var $scrollbarXRail = $("<div class='ps-scrollbar-x-rail'>").appendTo($this);
        var $scrollbarX = $("<div class='ps-scrollbar-x'>").appendTo($scrollbarXRail);
        var scrollbarXActive;
        var scrollbarXWidth;
        var scrollbarXLeft;
        var scrollbarXBottom = getInt($scrollbarXRail.css('bottom'));
        var isScrollbarXUsingBottom = scrollbarXBottom === scrollbarXBottom; // !isNaN
        var scrollbarXTop = isScrollbarXUsingBottom ? null : getInt($scrollbarXRail.css('top'));
        var railBorderXWidth = getInt($scrollbarXRail.css('borderLeftWidth')) + getInt($scrollbarXRail.css('borderRightWidth'));
        var railXMarginWidth = getInt($scrollbarXRail.css('marginLeft')) + getInt($scrollbarXRail.css('marginRight'));
        var railXWidth;

        /*Adding Y-scroll with explicit display:none style to fix Y-scroll position issue in RTL
         direction when scroll object is destroyed & re-generated due to dom:refresh event. During
          re-generation of scroll object, browser apply display:block properties from css classes
           to this element and automatically calculates 'right' position of Y-scroll element,
            although 'right' is not explicitly set by any css class in RTL direction. As a result,
             $scrollbarYRail.css('right') returns some value instead of default value 'auto' and
              'isScrollbarYUsingRight' gets true. This is not the case when Y-scroll element is
               created first time, issue occurs only when scroll object is recreated. Removed
                style attribute, when 'isScrollbarYUsingRight' gets calculated.*/
        var $scrollbarYRail = $("<div class='ps-scrollbar-y-rail' style='display:none;'>").appendTo($this);
        var $scrollbarY = $("<div class='ps-scrollbar-y'>").appendTo($scrollbarYRail);
        var scrollbarYActive;
        var scrollbarYHeight;
        var scrollbarYTop;
        var scrollbarYRight = getInt($scrollbarYRail.css('right'));
        var isScrollbarYUsingRight = scrollbarYRight === scrollbarYRight;
        $scrollbarYRail.removeAttr('style');
        var scrollbarYLeft = isScrollbarYUsingRight ? null : getInt($scrollbarYRail.css('left'));
        var railBorderYWidth = getInt($scrollbarYRail.css('borderTopWidth')) + getInt($scrollbarYRail.css('borderBottomWidth'));
        var railYMarginHeight = getInt($scrollbarYRail.css('marginTop')) + getInt($scrollbarYRail.css('marginBottom'));
        var railYHeight;

        function updateScrollTop(currentTop, deltaY) {
          var newTop = currentTop + deltaY;
          var maxTop = containerHeight - scrollbarYHeight;

          if (newTop < 0) {
            scrollbarYTop = 0;
          } else if (newTop > maxTop) {
            scrollbarYTop = maxTop;
          } else {
            scrollbarYTop = newTop;
          }

          var scrollTop = getInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight));
          $this.scrollTop(scrollTop);
        }

        function updateScrollLeft(currentLeft, deltaX) {
          var newLeft = currentLeft + deltaX;
          var maxLeft = containerWidth - scrollbarXWidth;

          if (newLeft < 0) {
            scrollbarXLeft = 0;
          } else if (newLeft > maxLeft) {
            scrollbarXLeft = maxLeft;
          } else {
            scrollbarXLeft = newLeft;
          }

          var scrollLeft = getInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth));
          isRtl ? $this.scrollLeftRtl(scrollLeft) : $this.scrollLeft(scrollLeft);
        }

        function getThumbSize(thumbSize) {
          if (settings.minScrollbarLength) {
            thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
          }
          if (settings.maxScrollbarLength) {
            thumbSize = Math.min(thumbSize, settings.maxScrollbarLength);
          }
          return thumbSize;
        }

        function updateCss(optimize) {
          var updateX = optimize ? scrollbarXActive : true;
          var updateY = optimize ? scrollbarYActive : true;
          if (updateX) {
            var xRailOffset = {width: railXWidth};
            if (isRtl) {
              xRailOffset.left = $this.scrollLeftRtl() +
                                 (settings.suppressScrollX ? 0 : (containerWidth - contentWidth));
            } else {
              xRailOffset.left = $this.scrollLeft();
            }
            if (isScrollbarXUsingBottom) {
              xRailOffset.bottom = scrollbarXBottom - $this.scrollTop();
            } else {
              xRailOffset.top = scrollbarXTop + $this.scrollTop();
            }
            $scrollbarXRail.css(xRailOffset);
            $scrollbarX.css({left: scrollbarXLeft, width: scrollbarXWidth - railBorderXWidth});
          }

          if (updateY) {
            var railYOffset = {top: $this.scrollTop(), height: railYHeight};
            if (isScrollbarYUsingRight) {
              if (isRtl) {
                railYOffset.right = contentWidth - $this.scrollLeftRtl() - scrollbarYRight - $scrollbarY.outerWidth();
              } else {
                railYOffset.right = scrollbarYRight - $this.scrollLeft();
              }
            } else {
              if (isRtl) {
                railYOffset.left = $this.scrollLeftRtl() + scrollbarYLeft +
                                   (settings.suppressScrollX ? 0 : (containerWidth - contentWidth));
              } else {
                railYOffset.left = scrollbarYLeft + $this.scrollLeft();
              }
            }
            $scrollbarYRail.css(railYOffset);
            $scrollbarY.css({top: scrollbarYTop, height: scrollbarYHeight - railBorderYWidth});
          }
        }

        function updateGeometry(optimize) {
          // Hide scrollbars not to affect scrollWidth and scrollHeight
          // firefox goes in infinite scroll event emit on removing of classes and then again adding
          // in case of TBODY
          if (isFirefox) {
            if ($this.prop('tagName') !== 'TBODY') {
              $this.removeClass('ps-active-x');
              $this.removeClass('ps-active-y');
            }
          } else {
            $this.removeClass('ps-active-x');
            $this.removeClass('ps-active-y');
          }

          containerWidth = Math.round(settings.includePadding ? $this.innerWidth() : $this.width());
          containerHeight = Math.round(settings.includePadding ? $this.innerHeight() : $this.height());
          contentWidth = $this.prop('scrollWidth');
          contentHeight = $this.prop('scrollHeight');

          if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
            scrollbarXActive = true;
            railXWidth = containerWidth - railXMarginWidth;
            scrollbarXWidth = getThumbSize(getInt(railXWidth * containerWidth / contentWidth));
            scrollbarXLeft = getInt((isRtl ? $this.scrollLeftRtl() : $this.scrollLeft()) * (railXWidth - scrollbarXWidth) / (contentWidth - containerWidth));
          } else {
            scrollbarXActive = false;
            scrollbarXWidth = 0;
            scrollbarXLeft = 0;
            $this.scrollLeft(0);
          }

          if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
            scrollbarYActive = true;
            railYHeight = containerHeight - railYMarginHeight;
            scrollbarYHeight = getThumbSize(getInt(railYHeight * containerHeight / contentHeight));
            scrollbarYTop = getInt($this.scrollTop() * (railYHeight - scrollbarYHeight) / (contentHeight - containerHeight));
          } else {
            scrollbarYActive = false;
            scrollbarYHeight = 0;
            scrollbarYTop = 0;
            $this.scrollTop(0);
          }

          if (scrollbarXLeft >= railXWidth - scrollbarXWidth) {
            scrollbarXLeft = railXWidth - scrollbarXWidth;
          }
          if (scrollbarYTop >= railYHeight - scrollbarYHeight) {
            scrollbarYTop = railYHeight - scrollbarYHeight;
          }

          updateCss(optimize);

          if (scrollbarXActive) {
            $this.addClass('ps-active-x');
          }
          if (scrollbarYActive) {
            $this.addClass('ps-active-y');
          }
        }

        function bindMouseScrollXHandler() {
          var currentLeft;
          var currentPageX;

          var mouseMoveHandler = function (e) {
            updateScrollLeft(currentLeft, e.pageX - currentPageX);
            updateGeometry();
            e.stopPropagation();
            e.preventDefault();
          };

          var mouseUpHandler = function (e) {
            $this.removeClass('ps-in-scrolling');
            $(ownerDocument).off(eventClass('mousemove'), mouseMoveHandler);
          };

          $scrollbarX.on(eventClass('mousedown'), function (e) {
            currentPageX = e.pageX;
            currentLeft = $scrollbarX.position().left;
            $this.addClass('ps-in-scrolling');

            $(ownerDocument).on(eventClass('mousemove'), mouseMoveHandler);
            $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

            e.stopPropagation();
            e.preventDefault();
          });

          currentLeft =
              currentPageX = null;
        }

        function bindMouseScrollYHandler() {
          var currentTop;
          var currentPageY;

          var mouseMoveHandler = function (e) {
            isMSBrowser && scrollbarYActive && $scrollbarYRail.hide();
            updateScrollTop(currentTop, e.pageY - currentPageY);
            updateGeometry(isMSBrowser);
            isMSBrowser && scrollbarYActive && $scrollbarYRail.show();
            e.stopPropagation();
            e.preventDefault();
          };

          var mouseUpHandler = function (e) {
            $this.removeClass('ps-in-scrolling');
            $(ownerDocument).off(eventClass('mousemove'), mouseMoveHandler);
          };

          $scrollbarY.on(eventClass('mousedown'), function (e) {
            currentPageY = e.pageY;
            currentTop = $scrollbarY.position().top;
            $this.addClass('ps-in-scrolling');

            $(ownerDocument).on(eventClass('mousemove'), mouseMoveHandler);
            $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

            e.stopPropagation();
            e.preventDefault();
          });

          currentTop =
              currentPageY = null;
        }

        function shouldPreventWheel(deltaX, deltaY) {
          var scrollTop = $this.scrollTop();
          if (deltaX === 0) {
            if (!scrollbarYActive) {
              return false;
            }
            if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
              return !settings.wheelPropagation;
            }
          }

          var scrollLeft = isRtl ? $this.scrollLeftRtl() : $this.scrollLeft();
          if (deltaY === 0) {
            if (!scrollbarXActive) {
              return false;
            }
            if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
              return !settings.wheelPropagation;
            }
          }
          return true;
        }

        function shouldPreventSwipe(deltaX, deltaY) {
          var scrollTop = $this.scrollTop();
          var scrollLeft = isRtl ? $this.scrollLeftRtl() : $this.scrollLeft();
          var magnitudeX = Math.abs(deltaX);
          var magnitudeY = Math.abs(deltaY);

          if (magnitudeY > magnitudeX) {
            // user is perhaps trying to swipe up/down the page

            if (((deltaY < 0) && (scrollTop === contentHeight - containerHeight)) ||
                ((deltaY > 0) && (scrollTop === 0))) {
              return !settings.swipePropagation;
            }
          } else if (magnitudeX > magnitudeY) {
            // user is perhaps trying to swipe left/right across the page

            if (((deltaX < 0) && (scrollLeft === contentWidth - containerWidth)) ||
                ((deltaX > 0) && (scrollLeft === 0))) {
              return !settings.swipePropagation;
            }
          }

          return true;
        }

        function bindMouseWheelHandler() {
          var shouldPrevent = false;

          function getDeltaFromEvent(e) {
            var deltaX = e.originalEvent.deltaX;
            var deltaY = -1 * e.originalEvent.deltaY;

            if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
              // OS X Safari
              deltaX = -1 * e.originalEvent.wheelDeltaX / 6;
              deltaY = e.originalEvent.wheelDeltaY / 6;
            }

            if (e.originalEvent.deltaMode && e.originalEvent.deltaMode === 1) {
              // Firefox in deltaMode 1: Line scrolling
              // FP: Increased from 10 to 25 to make scroling based the
              // scrolling wheel in Firefox as fast as in Chrome
              deltaX *= 25;
              deltaY *= 25;
            }

            if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
              // IE in some mouse drivers
              deltaX = 0;
              deltaY = e.originalEvent.wheelDelta * 0.8;
            }

            return [deltaX, deltaY];
          }

          function shouldBeConsumedByTextarea(deltaX, deltaY) {
            var hoveredTextarea = $this[0].querySelector('textarea:hover');
            if (hoveredTextarea) {
              var maxScrollTop = hoveredTextarea.scrollHeight - hoveredTextarea.clientHeight;
              if (maxScrollTop > 0) {
                if (!(hoveredTextarea.scrollTop === 0 && deltaY > 0) &&
                    !(hoveredTextarea.scrollTop === maxScrollTop && deltaY < 0)) {
                  return true;
                }
              }
              var maxScrollLeft = hoveredTextarea.scrollLeft - hoveredTextarea.clientWidth;
              if (maxScrollLeft > 0) {
                if (!(hoveredTextarea.scrollLeft === 0 && deltaX < 0) &&
                    !(hoveredTextarea.scrollLeft === maxScrollLeft && deltaX > 0)) {
                  return true;
                }
              }
            }
            return false;
          }

          function mousewheelHandler(e) {
            // FIXME: this is a quick fix for the select problem in FF and IE.
            // If there comes an effective way to deal with the problem,
            // this lines should be removed.
            if (!isWebkit && $this.find('select:focus').length > 0) {
              return;
            }

            var delta = getDeltaFromEvent(e);

            var deltaX = delta[0];
            var deltaY = delta[1];
            if (shouldBeConsumedByTextarea(deltaX, deltaY)) {
              return;
            }

            isMSBrowser && scrollbarYActive && $scrollbarYRail.hide();

            shouldPrevent = false;
            if (!settings.useBothWheelAxes) {
              // deltaX will only be used for horizontal scrolling and deltaY will
              // only be used for vertical scrolling - this is the default
              $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
              if (isRtl) {
                $this.scrollLeftRtl($this.scrollLeftRtl() + (deltaX * settings.wheelSpeed));
              } else {
                $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
              }
            } else if (scrollbarYActive && !scrollbarXActive) {
              // only vertical scrollbar is active and useBothWheelAxes option is
              // active, so let's scroll vertical bar using both mouse wheel axes
              if (deltaY) {
                $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
              } else {
                $this.scrollTop($this.scrollTop() + (deltaX * settings.wheelSpeed));
              }
              shouldPrevent = true;
            } else if (scrollbarXActive && !scrollbarYActive) {
              // useBothWheelAxes and only horizontal bar is active, so use both
              // wheel axes for horizontal bar
              if (deltaX) {
                if (isRtl) {
                  $this.scrollLeftRtl($this.scrollLeftRtl() + (deltaX * settings.wheelSpeed));
                } else {
                  $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
                }
              } else {
                if (isRtl) {
                  $this.scrollLeftRtl($this.scrollLeftRtl() - (deltaY * settings.wheelSpeed));
                } else {
                  $this.scrollLeft($this.scrollLeft() - (deltaY * settings.wheelSpeed));
                }
              }
              shouldPrevent = true;
            }

            updateGeometry(isMSBrowser);  // optimize for IE only

            isMSBrowser && scrollbarYActive && $scrollbarYRail.show();

            shouldPrevent = (shouldPrevent || shouldPreventWheel(deltaX, deltaY));
            if (shouldPrevent) {
              e.stopPropagation();
              e.preventDefault();
            }
          }

          if (typeof window.onwheel !== "undefined") {
            $this.on(eventClass('wheel'), mousewheelHandler);
          } else if (typeof window.onmousewheel !== "undefined") {
            $this.on(eventClass('mousewheel'), mousewheelHandler);
          }
        }

        function bindKeyboardHandler() {
          var hovered = false;
          $this.on(eventClass('mouseenter'), function (e) {
            hovered = true;
          });
          $this.on(eventClass('mouseleave'), function (e) {
            hovered = false;
          });

          var shouldPrevent = false;
          $(ownerDocument).on(eventClass('keydown'), function (e) {
            if (e.isDefaultPrevented && e.isDefaultPrevented()) {
              return;
            }

            if (!hovered) {
              return;
            }

            var activeElement = document.activeElement ? document.activeElement : ownerDocument.activeElement;

            if (activeElement) {
              // go deeper if element is a webcomponent
              while (activeElement.shadowRoot) {
                activeElement = activeElement.shadowRoot.activeElement;
              }
              if ($(activeElement).is(":input,[contenteditable]")) {
                return;
              }
            }

            var deltaX = 0;
            var deltaY = 0;

            switch (e.which) {
            case 37: // left
              deltaX = -30;
              break;
            case 38: // up
              deltaY = 30;
              break;
            case 39: // right
              deltaX = 30;
              break;
            case 40: // down
              deltaY = -30;
              break;
            case 33: // page up
              deltaY = 90;
              break;
            case 32: // space bar
            case 34: // page down
              deltaY = -90;
              break;
            case 35: // end
              if (e.ctrlKey) {
                deltaY = -contentHeight;
              } else {
                deltaY = -containerHeight;
              }
              break;
            case 36: // home
              if (e.ctrlKey) {
                deltaY = $this.scrollTop();
              } else {
                deltaY = containerHeight;
              }
              break;
            default:
              return;
            }

            $this.scrollTop($this.scrollTop() - deltaY);
            if (isRtl) {
              $this.scrollLeftRtl($this.scrollLeftRtl() + deltaX);
            } else {
              $this.scrollLeft($this.scrollLeft() + deltaX);
            }
            shouldPrevent = shouldPreventWheel(deltaX, deltaY);
            if (shouldPrevent) {
              e.preventDefault();
            }
          });
        }

        function bindRailClickHandler() {
          function stopPropagation(e) { e.stopPropagation(); }

          $scrollbarY.on(eventClass('click'), stopPropagation);
          $scrollbarYRail.on(eventClass('click'), function (e) {
            var halfOfScrollbarLength = getInt(scrollbarYHeight / 2);
            var positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength;
            var maxPositionTop = containerHeight - scrollbarYHeight;
            var positionRatio = positionTop / maxPositionTop;

            if (positionRatio < 0) {
              positionRatio = 0;
            } else if (positionRatio > 1) {
              positionRatio = 1;
            }

            $this.scrollTop((contentHeight - containerHeight) * positionRatio);
          });

          $scrollbarX.on(eventClass('click'), stopPropagation);
          $scrollbarXRail.on(eventClass('click'), function (e) {
            var halfOfScrollbarLength = getInt(scrollbarXWidth / 2);
            var positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength;
            var maxPositionLeft = containerWidth - scrollbarXWidth;
            var positionRatio = positionLeft / maxPositionLeft;

            if (positionRatio < 0) {
              positionRatio = 0;
            } else if (positionRatio > 1) {
              positionRatio = 1;
            }

            if (isRtl) {
              $this.scrollLeftRtl((contentWidth - containerWidth) * positionRatio);
            } else {
              $this.scrollLeft((contentWidth - containerWidth) * positionRatio);
            }
          });
        }

        function bindSelectionHandler() {
          function getRangeNode() {
            var selection = window.getSelection ? window.getSelection() :
                            document.getSelection ? document.getSelection() : '';
            if (selection.toString().length === 0) {
              return null;
            } else {
              return selection.getRangeAt(0).commonAncestorContainer;
            }
          }

          var scrollingLoop = null;
          var scrollDiff = {top: 0, left: 0};
          function startScrolling() {
            if (!scrollingLoop) {
              scrollingLoop = setInterval(function () {
                if (!isPluginAlive()) {
                  clearInterval(scrollingLoop);
                  return;
                }

                $this.scrollTop($this.scrollTop() + scrollDiff.top);
                if (isRtl) {
                  $this.scrollLeftRtl($this.scrollLeftRtl() + scrollDiff.left);
                } else {
                  $this.scrollLeft($this.scrollLeft() + scrollDiff.left);
                }
                updateGeometry();
              }, 50); // every .1 sec
            }
          }
          function stopScrolling() {
            if (scrollingLoop) {
              clearInterval(scrollingLoop);
              scrollingLoop = null;
            }
            $this.removeClass('ps-in-scrolling');
            $this.removeClass('ps-in-scrolling');
          }

          var isSelected = false;
          $(ownerDocument).on(eventClass('selectionchange'), function (e) {
            if ($.contains($this[0], getRangeNode())) {
              isSelected = true;
            } else {
              isSelected = false;
              stopScrolling();
            }
          });
          $(window).on(eventClass('mouseup'), function (e) {
            if (isSelected) {
              isSelected = false;
              stopScrolling();
            }
          });

          $(window).on(eventClass('mousemove'), function (e) {
            if (isSelected) {
              var mousePosition = {x: e.pageX, y: e.pageY};
              var containerOffset = getElementOffset($this);
              var containerGeometry = {
                left: containerOffset.left,
                right: containerOffset.left + $this.outerWidth(),
                top: containerOffset.top,
                bottom: containerOffset.top + $this.outerHeight()
              };

              if (mousePosition.x < containerGeometry.left + 3) {
                scrollDiff.left = -5;
                $this.addClass('ps-in-scrolling');
              } else if (mousePosition.x > containerGeometry.right - 3) {
                scrollDiff.left = 5;
                $this.addClass('ps-in-scrolling');
              } else {
                scrollDiff.left = 0;
              }

              if (mousePosition.y < containerGeometry.top + 3) {
                if (containerGeometry.top + 3 - mousePosition.y < 5) {
                  scrollDiff.top = -5;
                } else {
                  scrollDiff.top = -20;
                }
                $this.addClass('ps-in-scrolling');
              } else if (mousePosition.y > containerGeometry.bottom - 3) {
                if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
                  scrollDiff.top = 5;
                } else {
                  scrollDiff.top = 20;
                }
                $this.addClass('ps-in-scrolling');
              } else {
                scrollDiff.top = 0;
              }

              if (scrollDiff.top === 0 && scrollDiff.left === 0) {
                stopScrolling();
              } else {
                // commenting ,as there should  be  scroll only on mousewheel but not on mousemove
                //startScrolling();
              }
            }
          });
        }

        function bindTouchHandler(supportsTouch, supportsIePointer) {
          function applyTouchMove(differenceX, differenceY) {
            $this.scrollTop($this.scrollTop() - differenceY);
            if (isRtl) {
              $this.scrollLeftRtl($this.scrollLeftRtl() - differenceX);
            } else {
              $this.scrollLeft($this.scrollLeft() - differenceX);
            }

            updateGeometry();
          }

          var startOffset = {};
          var startTime = 0;
          var speed = {};
          var easingLoop = null;
          var inGlobalTouch = false;
          var inLocalTouch = false;

          function globalTouchStart(e) {
            inGlobalTouch = true;
          }
          function globalTouchEnd(e) {
            inGlobalTouch = false;
          }

          function getTouch(e) {
            if (e.originalEvent.targetTouches) {
              return e.originalEvent.targetTouches[0];
            } else {
              // Maybe IE pointer
              return e.originalEvent;
            }
          }
          function shouldHandle(e) {
            var event = e.originalEvent;
            if (event.targetTouches && event.targetTouches.length === 1) {
              return true;
            }
            if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== event.MSPOINTER_TYPE_MOUSE) {
              return true;
            }
            return false;
          }
          function touchStart(e) {
            if (shouldHandle(e)) {
              inLocalTouch = true;

              var touch = getTouch(e);

              startOffset.pageX = touch.pageX;
              startOffset.pageY = touch.pageY;

              startTime = (new Date()).getTime();

              if (easingLoop !== null) {
                clearInterval(easingLoop);
              }

              e.stopPropagation();
            }
          }
          function touchMove(e) {
            if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
              var touch = getTouch(e);

              var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

              var differenceX = currentOffset.pageX - startOffset.pageX;
              var differenceY = currentOffset.pageY - startOffset.pageY;

              applyTouchMove(differenceX, differenceY);
              startOffset = currentOffset;

              var currentTime = (new Date()).getTime();

              var timeGap = currentTime - startTime;
              if (timeGap > 0) {
                speed.x = differenceX / timeGap;
                speed.y = differenceY / timeGap;
                startTime = currentTime;
              }

              if (shouldPreventSwipe(differenceX, differenceY)) {
                e.stopPropagation();
                e.preventDefault();
              }
            }
          }
          function touchEnd(e) {
            if (!inGlobalTouch && inLocalTouch) {
              inLocalTouch = false;

              clearInterval(easingLoop);
              easingLoop = setInterval(function () {
                if (!isPluginAlive()) {
                  clearInterval(easingLoop);
                  return;
                }

                if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                  clearInterval(easingLoop);
                  return;
                }

                applyTouchMove(speed.x * 30, speed.y * 30);

                speed.x *= 0.8;
                speed.y *= 0.8;
              }, 10);
            }
          }

          if (supportsTouch) {
            $(window).on(eventClass("touchstart"), globalTouchStart);
            $(window).on(eventClass("touchend"), globalTouchEnd);
            $this.on(eventClass("touchstart"), touchStart);
            $this.on(eventClass("touchmove"), touchMove);
            $this.on(eventClass("touchend"), touchEnd);
          }

          if (supportsIePointer) {
            if (window.PointerEvent) {
              $(window).on(eventClass("pointerdown"), globalTouchStart);
              $(window).on(eventClass("pointerup"), globalTouchEnd);
              $this.on(eventClass("pointerdown"), touchStart);
              $this.on(eventClass("pointermove"), touchMove);
              $this.on(eventClass("pointerup"), touchEnd);
            } else if (window.MSPointerEvent) {
              $(window).on(eventClass("MSPointerDown"), globalTouchStart);
              $(window).on(eventClass("MSPointerUp"), globalTouchEnd);
              $this.on(eventClass("MSPointerDown"), touchStart);
              $this.on(eventClass("MSPointerMove"), touchMove);
              $this.on(eventClass("MSPointerUp"), touchEnd);
            }
          }
        }

        function bindScrollHandler() {
          $this.on(eventClass('scroll'), function (e) {
            updateGeometry();
          });
        }

        function destroy() {
          $this.off(eventClass());
          $(window).off(eventClass());
          $(ownerDocument).off(eventClass());
          $this.data('perfect-scrollbar', null);
          $this.data('perfect-scrollbar-update', null);
          $this.data('perfect-scrollbar-destroy', null);
          $scrollbarX.remove();
          $scrollbarY.remove();
          $scrollbarXRail.remove();
          $scrollbarYRail.remove();

          // clean all variables
          $this =
              $scrollbarXRail =
                  $scrollbarYRail =
                      $scrollbarX =
                          $scrollbarY =
                              scrollbarXActive =
                                  scrollbarYActive =
                                      containerWidth =
                                          containerHeight =
                                              contentWidth =
                                                  contentHeight =
                                                      scrollbarXWidth =
                                                          scrollbarXLeft =
                                                              scrollbarXBottom =
                                                                  isScrollbarXUsingBottom =
                                                                      scrollbarXTop =
                                                                          scrollbarYHeight =
                                                                              scrollbarYTop =
                                                                                  scrollbarYRight =
                                                                                      isScrollbarYUsingRight =
                                                                                          scrollbarYLeft =
                                                                                              isRtl =
                                                                                                  eventClass = null;
        }

        var supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
        var supportsIePointer = window.navigator.msMaxTouchPoints !== null;

        function initialize() {
          updateGeometry();
          bindScrollHandler();
          bindMouseScrollXHandler();
          bindMouseScrollYHandler();
          bindRailClickHandler();
          bindSelectionHandler();
          bindMouseWheelHandler();

          if (supportsTouch || supportsIePointer) {
            bindTouchHandler(supportsTouch, supportsIePointer);
          }
          if (settings.useKeyboard) {
            bindKeyboardHandler();
          }
          $this.data('perfect-scrollbar', $this);
          $this.data('perfect-scrollbar-update', updateGeometry);
          $this.data('perfect-scrollbar-destroy', destroy);
        }

        initialize();

        return $this;
      });
    };
  });

  return jQuery.fn.perfectScrollbar;

});
