/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/errormessage', 'csui/utils/messagehelper',
  'csui/utils/types/date', 'csui/utils/types/number',
  'csui/utils/types/member', 'csui/utils/types/localizable', 'i18n'
], function (_, $, Url, Message, MessageHelper, date, number, member,
    localizable, i18n) {
  'use strict';

  var $window = $(window);
  var messageHelper = new MessageHelper();
  messageHelper.on("showErrors", function (errors, html, title, showit) {
    alert($(html).text());
  });

  var escapeHtmlHelper = $("<p></p>");

  function escapeHtml(text, preserveLineBreaks) {
    var html = escapeHtmlHelper.text(text).html();
    if (preserveLineBreaks) {
      html = html.replace(/\r?\n/g, "\r\n<br>");
    }
    return html;
  }

  function isBackbone(value) {
    return value && value.once;
  }

  function isPlaceholder(value) {
    return value && (_.isString(value) || _.isElement(value) || value instanceof $);
  }

  function isTouchBrowser() {
    return !!(('ontouchstart' in window) || (navigator.maxTouchPoints) ||
              (navigator.msMaxTouchPoints));
  }

  function isHybrid() {
    return !!('ontouchstart' in window);
  }

  function isAppleMobile() {
    if (navigator && navigator.userAgent != null) {
      var appleMatches = navigator.userAgent.match(/(iPhone |iPad)/i);
      return (appleMatches != null);
    }
    return true;
  }

  function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
  }

  function isLandscape() {
    return isAppleMobile() && (window.matchMedia("(orientation: landscape)").matches);
  }

  function isPortrait() {
    return isAppleMobile() && (window.matchMedia("(orientation: portrait)").matches);
  }

  function isIE11() {
    if (navigator && navigator.userAgent) {
      var isInternetExplorer11 = /Trident.*11/i.test(navigator.userAgent);
      return isInternetExplorer11;
    }
  }

  function isMozilla() {
    if (navigator && navigator.userAgent) {
      var isMozilla = /Mozilla/.test(navigator.userAgent);
      return isMozilla;
    }
  }

  function isEdge() {
    if (navigator && navigator.userAgent) {
      var isEdge = /Edge/.test(navigator.userAgent);
      return isEdge;
    }
  }

  function isFirefox() {
    if (navigator && navigator.userAgent) {
      var isFirefox = /Firefox/.test(navigator.userAgent);
      return isFirefox;
    }
  }
  function isMSBrowser() {
    return isIE11() || isEdge();
  }

  function isChrome() {
    var isChromium  = window.chrome,
        winNav      = window.navigator,
        vendorName  = winNav.vendor,
        isOpera     = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge    = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS"),
        retVal      = false;
    if (isIOSChrome ||
        (isChromium != null && vendorName === "Google Inc." && isOpera === false &&
         isIEedge === false)) {
      retVal = true;
    }
    return retVal;
  }

  function isSafari() {
    if (navigator && navigator.userAgent) {
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      return isSafari;
    }
  }
  function px2em(pxContainerWidth, pxElemWidth) {
    var pxInEms = 0;
    if (pxElemWidth > 0) {
      pxInEms = Math.floor(2 * pxContainerWidth / pxElemWidth);
    }
    return pxInEms;
  }

  function isVisibleInWindowViewport(el) {
    var $el = el instanceof $ ? el : $(el);
    if (!$el.is(':visible')) {
      return false;
    }
    var position = $el.offset(),
        offset   = {
          left: window.pageXOffset,
          top: window.pageYOffset
        },
        extents  = {
          width: $window.width(),
          height: $window.height()
        };
    return position.left >= offset.left && position.left - offset.left < extents.width &&
           position.top >= offset.top && position.top - offset.top < extents.height;
  }

  function isVisibleInWindowViewportHorizontally(el) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var elRect = elem.getBoundingClientRect();
    return elRect.left >= window.pageXOffset && elRect.right - window.pageXOffset < $window.width();
  }

  function isVisibleInWindowViewportVertically(el) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var elRect = elem.getBoundingClientRect();
    return elRect.top >= window.pageYOffset &&
           elRect.bottom - window.pageYOffset < $window.height();
  }
  function isElementVisibleInParents(el, levels, iPercentX, iPercentY) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var tolerance = 0.01;
    var percentX = iPercentX !== undefined ? iPercentX : 100;
    var percentY = iPercentY !== undefined ? iPercentY : 100;
    var elemRect = elem.getBoundingClientRect();
    var parentRects = [];
    var maxLevels = levels || 5;
    var curLevel = 0;
    while (elem.parentElement != null && curLevel < maxLevels) {
      parentRects.push(elem.parentElement.getBoundingClientRect());
      elem = elem.parentElement;
      curLevel++;
    }

    var visibleInAllParents = parentRects.every(function (parentRect) {
      var visiblePixelX = Math.min(elemRect.right, parentRect.right) -
                          Math.max(elemRect.left, parentRect.left);
      var visiblePixelY = Math.min(elemRect.bottom, parentRect.bottom) -
                          Math.max(elemRect.top, parentRect.top);
      var visiblePercentageX = visiblePixelX / elemRect.width * 100;
      var visiblePercentageY = visiblePixelY / elemRect.height * 100;
      return visiblePercentageX + tolerance > percentX &&
             visiblePercentageY + tolerance > percentY;
    });
    return visibleInAllParents;
  }
  function isElementVisibleInParent(el, parent, iPercentX, iPercentY) {
    if (el === undefined || parent === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var container = parent instanceof $ ? parent[0] : parent;
    if (!container || !container.getBoundingClientRect) {
      return false;
    }
    var tolerance = 0.01;
    var percentX = iPercentX !== undefined ? iPercentX : 100;
    var percentY = iPercentY !== undefined ? iPercentY : 100;
    var elemRect = elem.getBoundingClientRect();
    var contRect = container.getBoundingClientRect();
    var visiblePixelX = Math.min(elemRect.right, contRect.right) -
                        Math.max(elemRect.left, contRect.left);
    var visiblePixelY = Math.min(elemRect.bottom, contRect.bottom) -
                        Math.max(elemRect.top, contRect.top);
    var visiblePercentageX = visiblePixelX / elemRect.width * 100;
    var visiblePercentageY = visiblePixelY / elemRect.height * 100;
    return visiblePercentageX + tolerance > percentX &&
           visiblePercentageY + tolerance > percentY;
  }

  function checkAndScrollElemToViewport(elem) {
    var $elem            = $(elem),
        scrollSelector   = $elem.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        elemScrollParent = $elem.closest(scrollSelector),
        stickyHeader     = elemScrollParent.siblings(".csui-tab-contents-header-wrapper");
    if (!!stickyHeader[0]) {
      var elemTop       = $elem.offset().top,
          viewportTop   = elemScrollParent[0].getBoundingClientRect().top + stickyHeader.height(),
          isElemVisible = elemTop > viewportTop;
      if (!isElemVisible) {
        var currScrollTop = elemScrollParent.scrollTop();
        elemScrollParent.scrollTop(currScrollTop - (viewportTop - elemTop));
      }
    }

  }

  function setScrollHandler(e) {
    var eventArg = e.data;
    var inputElement      = eventArg.inputElement,
        view              = eventArg.view,
        dropdownContainer = eventArg.dropdownContainer,
        callback          = eventArg.callback;
    inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
    if (dropdownContainer.length > 0 && dropdownContainer[0] !== e.target &&
        dropdownContainer.is(":visible") && callback) {
      callback(view);
    }
  }

  function adjustDropDownField(inputElement, dropdownContainer, applyWidth, view, callback,
      scrollableDropdownContainer) {
    var scrollEl;
    var eventArg = {
      inputElement: inputElement,
      view: view,
      dropdownContainer: dropdownContainer,
      callback: callback
    };

    var isIEBrowser    = this.isIE11(),
        isTouchBrowser = this.isTouchBrowser(),
        isHybrid       = this.isHybrid();

    if (isTouchBrowser &&
        !inputElement.closest('.csui-scrollable-writemode').hasClass('csui-dropdown-open')) {
      inputElement.closest('.csui-scrollable-writemode').addClass('csui-dropdown-open');
    }
    if (inputElement.parents(".csui-scrollablecols").length > 0 &&
        inputElement.parents(".cs-form-set-container").length >
        0) {
      scrollEl = inputElement.parents(".csui-scrollablecols").parents(".cs-form-set-container").find
      (".ps-container.ps-active-x");
      var isRtl            = i18n && i18n.settings.rtl,
          inputElementLeft = inputElement.offset().left,
          leftShadow       = inputElement.parents(".csui-scrollablecols").siblings(
              ".csui-lockedcols").find(".csui-shadowleft-container"),
          leftShadowLeft   = leftShadow.offset().left,
          currentLeft,
          scrollUpdate;
      if (isRtl) {
        var inputElementRight = inputElementLeft + inputElement.outerWidth();
        scrollUpdate = inputElementRight - leftShadowLeft;
      }
      else {
        var leftShadowRight = leftShadowLeft + leftShadow.outerWidth();
        scrollUpdate = leftShadowRight - inputElementLeft;
      }
      if (scrollUpdate > 0) {
        scrollEl.off('scroll', setScrollHandler);
        scrollEl.one('set:scrolled', function () {
          if (!!scrollEl) {
            scrollEl.on('scroll', eventArg, setScrollHandler);
          }
          autoAlignDropDowns(inputElement, dropdownContainer, applyWidth,
              scrollableDropdownContainer, isIEBrowser);
          hideDropDowns(inputElement, dropdownContainer, view, callback);
        });
        if (isRtl) {
          currentLeft = scrollEl.scrollLeftRtl();
          scrollEl.scrollLeftRtl(currentLeft + scrollUpdate);
        }
        else {
          currentLeft = scrollEl.scrollLeft();
          scrollEl.scrollLeft(currentLeft - scrollUpdate);
          var that = this;
          setTimeout(function () {
            if (that.isTouchBrowser && !inputElement.closest('.csui-scrollable-writemode').hasClass(
                    '.csui-dropdown-open')) {
              inputElement.closest('.csui-scrollable-writemode').addClass('csui-dropdown-open');
            }
          }, 100);
        }
        return;
      }
    }

    if (!!scrollEl) {
      scrollEl.on('scroll', eventArg, setScrollHandler);
    }
    autoAlignDropDowns(inputElement, dropdownContainer, applyWidth, scrollableDropdownContainer,
        isIEBrowser);
    hideDropDowns(inputElement, dropdownContainer, view, callback);

  }
  function autoAlignDropDowns(inputElement, dropdownContainer, applyWidth,
      scrollableDropdownContainer, isIEBrowser) {
    if (!inputElement.is(':visible')) {
      return false;
    }
    dropdownContainer.css({
      "left": 0,
      "top": 0
    });
    var hasPerspective        = !!inputElement.closest('.cs-perspective-panel').length,
        isRtl                 = i18n && i18n.settings.rtl,
        elTop                 = inputElement.offset().top,
        elPositionX           = hasPerspective ? inputElement.offset().left : inputElement[0]
            .getBoundingClientRect().left,
        scrollSelector        = inputElement.closest('.csui-perfect-scrolling').length > 0 ?
                                '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        form                  = inputElement.closest(scrollSelector),
        modalContentElem      = isIEBrowser ? [] :
                                (form.length > 0 ?
                                 form.parents(".binf-modal-content, .csui-sidepanel-container") :
                                 inputElement.closest(
                                     ".binf-modal-content, .csui-sidepanel-container")), /*For
         IE, left & top position is calculated with respect to document*/
        modalContentPositionX = modalContentElem.length > 0 ? (isRtl ?
                                                               (modalContentElem.outerWidth() +
                                                                modalContentElem.offset().left) :
                                                               modalContentElem.offset().left) :
                                (isRtl ? $(document).width() : 0),
        modalContentTop       = modalContentElem.length > 0 ? modalContentElem.offset().top : 0,
        controlheight         = inputElement.outerHeight(),
        dropdownWidth         = inputElement.outerWidth(),
        perspectivePanel      = $(".cs-perspective-panel"),
        closestPerspectivePan = inputElement.closest(".cs-perspective-panel"),
        perspective           = closestPerspectivePan.length > 0 ? closestPerspectivePan :
                                inputElement.closest(".cs-perspective"),
        perspectiveHeight     = perspective.length > 0 ? perspective.outerHeight()
            : $(document).height(),
        perspectiveTop        = perspective.length > 0 ? perspective.offset().top : 0,
        perspectiveLeft       = perspective.length > 0 ? perspective.offset().left : 0,
        elemBoundingRect      = inputElement[0].getBoundingClientRect(),
        contextBottom, contextTop;

    if (applyWidth) {
      dropdownContainer.css({
        "width": dropdownWidth
      });
    }
    if (scrollSelector != '.csui-normal-scrolling') {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "hidden");
    }

    var perspectivePanelClientTop = perspectivePanel.length > 0 ?
                                    perspectivePanel[0].getBoundingClientRect().top : 0;
    if (perspectivePanelClientTop < 0) {
      perspectivePanelClientTop = perspectivePanel.offset().top;
    }
    var perspectiveTopSpace  = perspectiveTop > 0 ? perspectiveTop : perspectivePanelClientTop,
        spaceOnTop           = elemBoundingRect.top - perspectiveTopSpace,
        spaceOnBottom        = window.innerHeight -
                               (elemBoundingRect.top + elemBoundingRect.height),
        isDropdownShownOnTop = spaceOnTop > spaceOnBottom;

    if (!!scrollableDropdownContainer) {
      scrollableDropdownContainer.css({
        'max-height': Math.abs((isDropdownShownOnTop ? spaceOnTop : spaceOnBottom) * 0.9) + 'px'
      });
      isDropdownShownOnTop = scrollableDropdownContainer.outerHeight() > spaceOnBottom;
    }
    if (isDropdownShownOnTop) {

      if (isIEBrowser) {
        if (perspective.length > 0) {
          contextBottom = perspectiveHeight + perspectiveTop - elemBoundingRect.top;
        } else {
          contextBottom = document.documentElement.offsetHeight +
                          document.documentElement.scrollTop -
                          elTop;
        }
      } else {
        if (modalContentElem.length > 0) {
          contextBottom = modalContentElem.outerHeight() + modalContentTop - elTop;
        } else {
          if (perspective.length > 0 || isSafari()) {
            contextBottom = perspectiveHeight + perspectiveTop - elTop;
          } else {
            contextBottom = hasPerspective ? (document.documentElement.offsetHeight - elTop)
                : window.innerHeight - (inputElement[0].getBoundingClientRect().top);
          }
        }
      }
      if (isRtl) {
        dropdownContainer.css({
          "position": "fixed",
          "right": modalContentPositionX - (elPositionX + dropdownWidth),
          "top": "auto",
          "bottom": contextBottom,
          "left": "auto"
        });
      } else {
        dropdownContainer.css({
          "position": "fixed",
          "left": (elPositionX - modalContentPositionX) - perspectiveLeft,
          "top": "auto",
          "bottom": contextBottom
        });
      }
      if (dropdownContainer.hasClass('binf-datetimepicker-widget')) {
        dropdownContainer.addClass('binf-top').removeClass('binf-bottom');
      }
    } else {
      if (isIEBrowser) {
        contextTop = elTop + controlheight - document.documentElement.scrollTop;
      } else {
        if (modalContentElem.length > 0) {
          contextTop = elTop + controlheight - modalContentTop;
        } else {
          if (perspective.length > 0) {
            contextTop = elTop + controlheight - perspectiveTop;
          } else {
            contextTop = elemBoundingRect.top + elemBoundingRect.height - perspectiveTop;
          }

        }
      }
      if (isRtl) {
        dropdownContainer.css({
          "position": "fixed",
          "right": modalContentPositionX - (elPositionX + dropdownWidth),
          "top": contextTop,
          "bottom": "auto",
          "left": "auto"
        });
      } else {
        dropdownContainer.css({
          "position": "fixed",
          "left": (elPositionX - modalContentPositionX) - perspectiveLeft,
          "top": contextTop,
          "bottom": "auto"
        });
      }
      if (dropdownContainer.hasClass('binf-datetimepicker-widget')) {
        dropdownContainer.addClass('binf-bottom').removeClass('binf-top');
      }
    }
  }
  function alignDropDownMenu(options) {
    var $targetEl     = options.targetEl,
        $dropdownMenu = options.dropdownMenu || $targetEl.nextAll('.binf-dropdown-menu'),
        hAlignment    = options.hAlignment || 'left',
        vAlignment    = options.vAlignment || 'bottom',
        isRtl         = i18n && i18n.settings.rtl;

    if (!$targetEl.length || !$targetEl.is(':visible') || !$dropdownMenu.length) {
      return false;
    }

    $dropdownMenu.css({'maxHeight': '', 'maxWidth': '', top: '', left: '', right: '', bottom: ''}); // Reset all inline styles
    $dropdownMenu.removeClass('binf-dropdown-align-left-top binf-dropdown-align-left-bottom' +
                              ' binf-dropdown-align-right-top binf-dropdown-align-right-bottom');

    var dropdownHeight  = $dropdownMenu.outerHeight(),
        dropdownWidth   = $dropdownMenu.outerWidth();
    $dropdownMenu.addClass('binf-hidden');

    var documentWidth   = $(window).width(),
        documentHeight  = $(window).height(),
        maxWidthAllowed = parseInt($dropdownMenu.css('maxWidth'), 10) || 224, /** UX Suggested */
        viewportOffset  = $targetEl[0].getBoundingClientRect(),
        top             = viewportOffset.bottom,
        left            = viewportOffset.left,
        right           = documentWidth - viewportOffset.right,
        bottom          = documentHeight - viewportOffset.top,
        scrollLeft      = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop       = window.pageYOffset || document.documentElement.scrollTop,
        spaceTop        = viewportOffset.top - 10,
        spaceBottom     = documentHeight - viewportOffset.bottom - 10,
        spaceLeft       = viewportOffset.right - 10,
        spaceRight      = documentWidth - viewportOffset.left - 10;

    if (vAlignment === 'bottom' && spaceBottom <= dropdownHeight) {
      if (spaceTop > dropdownHeight || spaceTop > spaceBottom) {
        vAlignment = 'top';
      }
    } else if (vAlignment === 'top' && spaceTop <= dropdownHeight) {
      if (spaceBottom > dropdownHeight || spaceBottom > spaceTop) {
        vAlignment = 'bottom';
      }
    }
    hAlignment = isRtl ? (hAlignment === 'left' ? 'right' : 'left') : hAlignment;
    if (hAlignment === 'left' && spaceRight <= dropdownWidth) {
      if (spaceLeft > dropdownWidth || spaceLeft > spaceRight) {
        hAlignment = 'right';
      }
    } else if (hAlignment === 'right' && spaceLeft <= dropdownWidth) {
      if (spaceRight > dropdownWidth || spaceRight > spaceLeft) {
        hAlignment = 'left';
      }
    }
    $dropdownMenu.addClass('binf-dropdown-align-' + hAlignment + '-' + vAlignment);

    if (!isIE11()) {
      var closestPerspectivePan = $targetEl.closest(".cs-perspective-panel"),
          modelContent          = $targetEl.parents(".binf-modal-content"),
          $transformParent      = closestPerspectivePan.length ? closestPerspectivePan :
                                  $targetEl.closest(".cs-perspective");
      $transformParent = $transformParent.length ? $transformParent : modelContent;

      if ($transformParent.length > 0) { // To counter the transform
        var transParentOffset = $transformParent.offset(),
            $elDocOffset      = $targetEl.offset(); // Includes top, left scrolls with viewport position;
        top += (scrollTop - transParentOffset.top);
        left += (scrollLeft - transParentOffset.left);
        right = $transformParent.outerWidth() + transParentOffset.left - $elDocOffset.left -
                $targetEl.outerWidth();
        bottom = $transformParent.outerHeight() + transParentOffset.top - $elDocOffset.top;
      }
    }

    var styles = {"position": "fixed"};
    if (hAlignment === 'left') {
      styles = _.extend(styles, {
        "left": left,
      });
      if (spaceRight < maxWidthAllowed) {
        styles.maxWidth = spaceRight;
      }
    } else {
      styles = _.extend(styles, {
        "right": right
      });
    }

    if (vAlignment === 'bottom') {
      styles = _.extend(styles, {
        "top": top,
      });
    } else {
      styles = _.extend(styles, {
        "bottom": bottom
      });
    }

    $dropdownMenu.css(styles);
    $dropdownMenu.removeClass('binf-hidden');
  }

  function hideDropDowns(inputElement, dropdownContainer, view, callback) {
    var scrollSelector = inputElement.closest('.csui-perfect-scrolling').length > 0 ?
                         '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        form           = inputElement.closest(scrollSelector),
        scrollableSet;
    form.on('scroll', view, function (e) {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
    $(window).on('scroll', function () {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
    $(window).on('resize', function () {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
  }
  function stringifyDate(date) {
    return JSON.stringify(date);
  }
  function dateToLocalIsoString(dateStr, format) {
    if (format === 'YYYY-MM-DD' || format === 'MM/DD/YYYY') {
      return date.serializeDate(dateStr);
    }
    return date.serializeDateTime(dateStr);
  }

  function findFocusables(element) {
    return $(element).find('a[href], area[href], input, select, textarea, button,' +
                           ' iframe, object, embed, *[tabindex], *[contenteditable]')
        .filter(':visible:not([disabled])');
  }
  function applyEllipsis(element, numberOfLines) {
    var measure, text, lineWidth,
        lineStart, lineCount, wordStart,
        line, lineText, wasNewLine,
        updatedFirstLineWidth = false,
        createElement         = document.createElement.bind(document),
        createTextNode        = document.createTextNode.bind(document);
    if (typeof element === 'object' && element.length > 0) {
      element = element[0];
    } else {
      element = element;
    }
    measure = createElement('span');

    $(measure).css({
      'position': 'absolute', // prevent page reflow
      'whiteSpace': 'pre', // cross-browser width results
      'visibilty': 'hidden' // prevent drawing});
    });
    if (!(element.ownerDocument || element.ownerDocument === document)) {
      return;
    }
    lineStart = wordStart = 0;
    lineCount = 1;
    wasNewLine = false;
    lineWidth = (element.clientWidth);
    text = (element.textContent || element.innerText).trim().replace(/\n/g, ' ');
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
    element.appendChild(measure);
    function checkLine(pos) {
      if (lineCount === numberOfLines) {
        return;
      }
      measure.appendChild(createTextNode(text.substr(lineStart, pos + 1 - lineStart)));
      if (lineWidth < measure.clientWidth) {
        if (wasNewLine) {
          lineText = text.substr(lineStart, pos + 1 - lineStart);
          lineStart = pos + 1;
        } else {
          lineText = text.substr(lineStart, wordStart - lineStart);
          lineStart = wordStart;
        }
        line = createElement('span');
        line.appendChild(createTextNode(lineText));
        element.appendChild(line);
        wasNewLine = true;
        lineCount++;
      } else {
        wasNewLine = false;
      }
      wordStart = pos + 1;
      measure.removeChild(measure.firstChild);
    }
    text.replace(/\W|\_/g, function (m, pos) {
      checkLine(pos);
    });
    checkLine(text.substr(lineStart).length);
    element.removeChild(measure);
    line = createElement('span');
    $(line).css({
      'display': 'inline-block',
      'overflow': 'hidden',
      'whiteSpace': 'nowrap',
      'width': '100%'
    });
    if (lineCount > 1) {
      $(line).css({
        'textOverflow': 'ellipsis',
      });
    }
    line.appendChild(createTextNode(text.substr(lineStart)));
    element.appendChild(line);
  }
  function filterUnSupportedWidgets(widget, config) {
    if (widget && config && config.unSupportedWidgets) {
      var extWidgets = _.chain(config.unSupportedWidgets)
          .values()
          .flatten()._wrapped;
      if (extWidgets && extWidgets.length > 0) {
        if (_.contains(extWidgets, widget.type)) {
          return undefined;
        }
      }
    }
    return widget;
  }

  var transitionEndListener = _.once(
      function () {
        var transitions = {
              transition: 'transitionend',
              WebkitTransition: 'webkitTransitionEnd',
              MozTransition: 'transitionend',
              OTransition: 'oTransitionEnd otransitionend'
            },
            element     = document.createElement('div'),
            transition;
        for (transition in transitions) {
          if (typeof element.style[transition] !== 'undefined') {
            return transitions[transition];
          }
        }
      }
  );

  function onTransitionEnd(element, callback, context) {
    var timeoutRef,
        transitionEnded = function () {
          clearTimeout(timeoutRef);
          callback.call(context || element);
        };
    timeoutRef = setTimeout(transitionEnded, 2000);
    element.one(transitionEndListener(), transitionEnded);
  }

  function getOffset(element) {
    return element.is(':visible') ? element.offset() : {top: 0, left: 0};
  }

  return {
    MessageHelper: messageHelper,
    ErrorHandler: messageHelper,

    MessageType: Message.Type,
    Message: Message.Message,
    RequestErrorMessage: Message.RequestErrorMessage,

    ErrorStatus: Message.Type,
    ErrorToShow: Message.Message,
    ErrorMessage: Message.ErrorMessage,
    Error: Message.RequestErrorMessage,

    exactDateFormat: date.exactDateFormat,
    exactTimeFormat: date.exactTimeFormat,
    exactDateTimeFormat: date.exactDateTimeFormat,

    parseDate: date.deserializeDate,
    stringifyDate: stringifyDate,
    dateToLocalIsoString: dateToLocalIsoString,
    deserializeDate: date.deserializeDate,
    serializeDate: date.serializeDate,
    serializeDateTime: date.serializeDateTime,
    formatDate: date.formatDate,
    formatDateTime: date.formatDateTime,
    formatExactDate: date.formatExactDate,
    formatExactTime: date.formatExactTime,
    formatExactDateTime: date.formatExactDateTime,
    formatFriendlyDate: date.formatFriendlyDate,
    formatFriendlyDateTime: date.formatFriendlyDateTime,
    formatFriendlyDateTimeNow: date.formatFriendlyDateTimeNow,
    formatISODateTime: date.formatISODateTime,
    formatISODate: date.formatISODate,

    getReadableFileSizeString: number.formatFileSize,
    formatFileSize: number.formatFileSize,
    formatFriendlyFileSize: number.formatFriendlyFileSize,
    formatExactFileSize: number.formatExactFileSize,

    formatInteger: number.formatInteger,
    formatIntegerWithCommas: number.formatIntegerWithCommas,

    formatMemberName: member.formatMemberName,

    getClosestLocalizedString: localizable.getClosestLocalizedString,

    localeCompareString: localizable.localeCompareString,
    localeContainsString: localizable.localeContainsString,
    localeEndsWithString: localizable.localeEndsWithString,
    localeIndexOfString: localizable.localeIndexOfString,
    localeStartsWithString: localizable.localeStartsWithString,

    formatMessage: localizable.formatMessage,

    escapeHtml: escapeHtml,

    isBackbone: isBackbone,
    isPlaceholder: isPlaceholder,
    Url: Url,
    isTouchBrowser: isTouchBrowser,
    isHybrid: isHybrid,
    isAppleMobile: isAppleMobile,
    isMacintosh: isMacintosh,
    isIE11: isIE11,
    isEdge: isEdge,
    isMozilla: isMozilla,
    isFirefox: isFirefox,
    isSafari: isSafari,
    isLandscape: isLandscape,
    isPortrait: isPortrait,
    isMSBrowser: isMSBrowser,
    isChrome: isChrome,
    px2em: px2em,
    isVisibleInWindowViewport: isVisibleInWindowViewport,
    isVisibleInWindowViewportHorizontally: isVisibleInWindowViewportHorizontally,
    isVisibleInWindowViewportVertically: isVisibleInWindowViewportVertically,
    isElementVisibleInParents: isElementVisibleInParents,
    isElementVisibleInParent: isElementVisibleInParent,
    checkAndScrollElemToViewport: checkAndScrollElemToViewport,
    setScrollHandler: setScrollHandler,
    adjustDropDownField: adjustDropDownField,
    autoAlignDropDowns: autoAlignDropDowns,
    hideDropDowns: hideDropDowns,
    findFocusables: findFocusables,
    applyEllipsis: applyEllipsis,
    filterUnSupportedWidgets: filterUnSupportedWidgets,
    onTransitionEnd: onTransitionEnd,
    getOffset: getOffset,
    alignDropDownMenu: alignDropDownMenu
  };
});
