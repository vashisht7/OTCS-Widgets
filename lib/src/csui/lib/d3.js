/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

// https://d3js.org Version 4.11.0. Copyright 2017 Mike Bostock.

// [OT] Modifications done:
//
// * Replaced UMD with csui AMD at the top and bottom of the file.
// * Returns exports object which has all d3 functions. d3 is written to support es6 modules and is returned
//   as an object with a series of properties, each represents an independent es6 module.

// [OT] Declare a csui module
define(function(){

    // [OT] Define exports variable
    var exports = {};

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
        var prefix = name += "", i = prefix.indexOf(":");
        if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
        return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
    }

    function creatorInherit(name) {
        return function() {
            var document = this.ownerDocument,
                uri = this.namespaceURI;
            return uri === xhtml && document.documentElement.namespaceURI === xhtml
                ? document.createElement(name)
                : document.createElementNS(uri, name);
        };
    }

    function creatorFixed(fullname) {
        return function() {
            return this.ownerDocument.createElementNS(fullname.space, fullname.local);
        };
    }

    function creator(name) {
        var fullname = namespace(name);
        return (fullname.local
            ? creatorFixed
            : creatorInherit)(fullname);
    }

    var nextId = 0;

    function local() {
        return new Local;
    }

    function Local() {
        this._ = "@" + (++nextId).toString(36);
    }

    Local.prototype = local.prototype = {
        constructor: Local,
        get: function(node) {
            var id = this._;
            while (!(id in node)) if (!(node = node.parentNode)) return;
            return node[id];
        },
        set: function(node, value) {
            return node[this._] = value;
        },
        remove: function(node) {
            return this._ in node && delete node[this._];
        },
        toString: function() {
            return this._;
        }
    };

    var matcher = function(selector) {
        return function() {
            return this.matches(selector);
        };
    };

    if (typeof document !== "undefined") {
        var element = document.documentElement;
        if (!element.matches) {
            var vendorMatches = element.webkitMatchesSelector
                || element.msMatchesSelector
                || element.mozMatchesSelector
                || element.oMatchesSelector;
            matcher = function(selector) {
                return function() {
                    return vendorMatches.call(this, selector);
                };
            };
        }
    }

    var matcher$1 = matcher;

    var filterEvents = {};

    exports.event = null;

    if (typeof document !== "undefined") {
        var element$1 = document.documentElement;
        if (!("onmouseenter" in element$1)) {
            filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
        }
    }

    function filterContextListener(listener, index, group) {
        listener = contextListener(listener, index, group);
        return function(event) {
            var related = event.relatedTarget;
            if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
                listener.call(this, event);
            }
        };
    }

    function contextListener(listener, index, group) {
        return function(event1) {
            var event0 = exports.event; // Events can be reentrant (e.g., focus).
            exports.event = event1;
            try {
                listener.call(this, this.__data__, index, group);
            } finally {
                exports.event = event0;
            }
        };
    }

    function parseTypenames(typenames) {
        return typenames.trim().split(/^|\s+/).map(function(t) {
            var name = "", i = t.indexOf(".");
            if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
            return {type: t, name: name};
        });
    }

    function onRemove(typename) {
        return function() {
            var on = this.__on;
            if (!on) return;
            for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
                if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                    this.removeEventListener(o.type, o.listener, o.capture);
                } else {
                    on[++i] = o;
                }
            }
            if (++i) on.length = i;
            else delete this.__on;
        };
    }

    function onAdd(typename, value, capture) {
        var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
        return function(d, i, group) {
            var on = this.__on, o, listener = wrap(value, i, group);
            if (on) for (var j = 0, m = on.length; j < m; ++j) {
                if ((o = on[j]).type === typename.type && o.name === typename.name) {
                    this.removeEventListener(o.type, o.listener, o.capture);
                    this.addEventListener(o.type, o.listener = listener, o.capture = capture);
                    o.value = value;
                    return;
                }
            }
            this.addEventListener(typename.type, listener, capture);
            o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
            if (!on) this.__on = [o];
            else on.push(o);
        };
    }

    function selection_on(typename, value, capture) {
        var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

        if (arguments.length < 2) {
            var on = this.node().__on;
            if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
                for (i = 0, o = on[j]; i < n; ++i) {
                    if ((t = typenames[i]).type === o.type && t.name === o.name) {
                        return o.value;
                    }
                }
            }
            return;
        }

        on = value ? onAdd : onRemove;
        if (capture == null) capture = false;
        for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
        return this;
    }

    function customEvent(event1, listener, that, args) {
        var event0 = exports.event;
        event1.sourceEvent = exports.event;
        exports.event = event1;
        try {
            return listener.apply(that, args);
        } finally {
            exports.event = event0;
        }
    }

    function sourceEvent() {
        var current = exports.event, source;
        while (source = current.sourceEvent) current = source;
        return current;
    }

    function point(node, event) {
        var svg = node.ownerSVGElement || node;

        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = event.clientX, point.y = event.clientY;
            point = point.matrixTransform(node.getScreenCTM().inverse());
            return [point.x, point.y];
        }

        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }

    function mouse(node) {
        var event = sourceEvent();
        if (event.changedTouches) event = event.changedTouches[0];
        return point(node, event);
    }

    function none() {}

    function selector(selector) {
        return selector == null ? none : function() {
            return this.querySelector(selector);
        };
    }

    function selection_select(select) {
        if (typeof select !== "function") select = selector(select);

        for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
                if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                    if ("__data__" in node) subnode.__data__ = node.__data__;
                    subgroup[i] = subnode;
                }
            }
        }

        return new Selection(subgroups, this._parents);
    }

    function empty() {
        return [];
    }

    function selectorAll(selector) {
        return selector == null ? empty : function() {
            return this.querySelectorAll(selector);
        };
    }

    function selection_selectAll(select) {
        if (typeof select !== "function") select = selectorAll(select);

        for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
                if (node = group[i]) {
                    subgroups.push(select.call(node, node.__data__, i, group));
                    parents.push(node);
                }
            }
        }

        return new Selection(subgroups, parents);
    }

    function selection_filter(match) {
        if (typeof match !== "function") match = matcher$1(match);

        for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
                if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                    subgroup.push(node);
                }
            }
        }

        return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
        return new Array(update.length);
    }

    function selection_enter() {
        return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
        this.ownerDocument = parent.ownerDocument;
        this.namespaceURI = parent.namespaceURI;
        this._next = null;
        this._parent = parent;
        this.__data__ = datum;
    }

    EnterNode.prototype = {
        constructor: EnterNode,
        appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
        insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
        querySelector: function(selector) { return this._parent.querySelector(selector); },
        querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant(x) {
        return function() {
            return x;
        };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
        var i = 0,
            node,
            groupLength = group.length,
            dataLength = data.length;

        // Put any non-null nodes that fit into update.
        // Put any null nodes into enter.
        // Put any remaining data into enter.
        for (; i < dataLength; ++i) {
            if (node = group[i]) {
                node.__data__ = data[i];
                update[i] = node;
            } else {
                enter[i] = new EnterNode(parent, data[i]);
            }
        }

        // Put any non-null nodes that don’t fit into exit.
        for (; i < groupLength; ++i) {
            if (node = group[i]) {
                exit[i] = node;
            }
        }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
        var i,
            node,
            nodeByKeyValue = {},
            groupLength = group.length,
            dataLength = data.length,
            keyValues = new Array(groupLength),
            keyValue;

        // Compute the key for each node.
        // If multiple nodes have the same key, the duplicates are added to exit.
        for (i = 0; i < groupLength; ++i) {
            if (node = group[i]) {
                keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
                if (keyValue in nodeByKeyValue) {
                    exit[i] = node;
                } else {
                    nodeByKeyValue[keyValue] = node;
                }
            }
        }

        // Compute the key for each datum.
        // If there a node associated with this key, join and add it to update.
        // If there is not (or the key is a duplicate), add it to enter.
        for (i = 0; i < dataLength; ++i) {
            keyValue = keyPrefix + key.call(parent, data[i], i, data);
            if (node = nodeByKeyValue[keyValue]) {
                update[i] = node;
                node.__data__ = data[i];
                nodeByKeyValue[keyValue] = null;
            } else {
                enter[i] = new EnterNode(parent, data[i]);
            }
        }

        // Add any remaining nodes that were not bound to data to exit.
        for (i = 0; i < groupLength; ++i) {
            if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
                exit[i] = node;
            }
        }
    }

    function selection_data(value, key) {
        if (!value) {
            data = new Array(this.size()), j = -1;
            this.each(function(d) { data[++j] = d; });
            return data;
        }

        var bind = key ? bindKey : bindIndex,
            parents = this._parents,
            groups = this._groups;

        if (typeof value !== "function") value = constant(value);

        for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
            var parent = parents[j],
                group = groups[j],
                groupLength = group.length,
                data = value.call(parent, parent && parent.__data__, j, parents),
                dataLength = data.length,
                enterGroup = enter[j] = new Array(dataLength),
                updateGroup = update[j] = new Array(dataLength),
                exitGroup = exit[j] = new Array(groupLength);

            bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

            // Now connect the enter nodes to their following update node, such that
            // appendChild can insert the materialized enter node before this node,
            // rather than at the end of the parent node.
            for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
                if (previous = enterGroup[i0]) {
                    if (i0 >= i1) i1 = i0 + 1;
                    while (!(next = updateGroup[i1]) && ++i1 < dataLength);
                    previous._next = next || null;
                }
            }
        }

        update = new Selection(update, parents);
        update._enter = enter;
        update._exit = exit;
        return update;
    }

    function selection_exit() {
        return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_merge(selection) {

        for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
            for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
                if (node = group0[i] || group1[i]) {
                    merge[i] = node;
                }
            }
        }

        for (; j < m0; ++j) {
            merges[j] = groups0[j];
        }

        return new Selection(merges, this._parents);
    }

    function selection_order() {

        for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
            for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
                if (node = group[i]) {
                    if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
                    next = node;
                }
            }
        }

        return this;
    }

    function selection_sort(compare) {
        if (!compare) compare = ascending;

        function compareNode(a, b) {
            return a && b ? compare(a.__data__, b.__data__) : !a - !b;
        }

        for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
                if (node = group[i]) {
                    sortgroup[i] = node;
                }
            }
            sortgroup.sort(compareNode);
        }

        return new Selection(sortgroups, this._parents).order();
    }

    function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
        var callback = arguments[0];
        arguments[0] = this;
        callback.apply(null, arguments);
        return this;
    }

    function selection_nodes() {
        var nodes = new Array(this.size()), i = -1;
        this.each(function() { nodes[++i] = this; });
        return nodes;
    }

    function selection_node() {

        for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
            for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
                var node = group[i];
                if (node) return node;
            }
        }

        return null;
    }

    function selection_size() {
        var size = 0;
        this.each(function() { ++size; });
        return size;
    }

    function selection_empty() {
        return !this.node();
    }

    function selection_each(callback) {

        for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
            for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
                if (node = group[i]) callback.call(node, node.__data__, i, group);
            }
        }

        return this;
    }

    function attrRemove(name) {
        return function() {
            this.removeAttribute(name);
        };
    }

    function attrRemoveNS(fullname) {
        return function() {
            this.removeAttributeNS(fullname.space, fullname.local);
        };
    }

    function attrConstant(name, value) {
        return function() {
            this.setAttribute(name, value);
        };
    }

    function attrConstantNS(fullname, value) {
        return function() {
            this.setAttributeNS(fullname.space, fullname.local, value);
        };
    }

    function attrFunction(name, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) this.removeAttribute(name);
            else this.setAttribute(name, v);
        };
    }

    function attrFunctionNS(fullname, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
            else this.setAttributeNS(fullname.space, fullname.local, v);
        };
    }

    function selection_attr(name, value) {
        var fullname = namespace(name);

        if (arguments.length < 2) {
            var node = this.node();
            return fullname.local
                ? node.getAttributeNS(fullname.space, fullname.local)
                : node.getAttribute(fullname);
        }

        return this.each((value == null
            ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
                ? (fullname.local ? attrFunctionNS : attrFunction)
                : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
        return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
            || (node.document && node) // node is a Window
            || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
        return function() {
            this.style.removeProperty(name);
        };
    }

    function styleConstant(name, value, priority) {
        return function() {
            this.style.setProperty(name, value, priority);
        };
    }

    function styleFunction(name, value, priority) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) this.style.removeProperty(name);
            else this.style.setProperty(name, v, priority);
        };
    }

    function selection_style(name, value, priority) {
        return arguments.length > 1
            ? this.each((value == null
                ? styleRemove : typeof value === "function"
                    ? styleFunction
                    : styleConstant)(name, value, priority == null ? "" : priority))
            : style(this.node(), name);
    }

    function style(node, name) {
        return node.style.getPropertyValue(name)
            || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
        return function() {
            delete this[name];
        };
    }

    function propertyConstant(name, value) {
        return function() {
            this[name] = value;
        };
    }

    function propertyFunction(name, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) delete this[name];
            else this[name] = v;
        };
    }

    function selection_property(name, value) {
        return arguments.length > 1
            ? this.each((value == null
                ? propertyRemove : typeof value === "function"
                    ? propertyFunction
                    : propertyConstant)(name, value))
            : this.node()[name];
    }

    function classArray(string) {
        return string.trim().split(/^|\s+/);
    }

    function classList(node) {
        return node.classList || new ClassList(node);
    }

    function ClassList(node) {
        this._node = node;
        this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
        add: function(name) {
            var i = this._names.indexOf(name);
            if (i < 0) {
                this._names.push(name);
                this._node.setAttribute("class", this._names.join(" "));
            }
        },
        remove: function(name) {
            var i = this._names.indexOf(name);
            if (i >= 0) {
                this._names.splice(i, 1);
                this._node.setAttribute("class", this._names.join(" "));
            }
        },
        contains: function(name) {
            return this._names.indexOf(name) >= 0;
        }
    };

    function classedAdd(node, names) {
        var list = classList(node), i = -1, n = names.length;
        while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
        var list = classList(node), i = -1, n = names.length;
        while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
        return function() {
            classedAdd(this, names);
        };
    }

    function classedFalse(names) {
        return function() {
            classedRemove(this, names);
        };
    }

    function classedFunction(names, value) {
        return function() {
            (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
        };
    }

    function selection_classed(name, value) {
        var names = classArray(name + "");

        if (arguments.length < 2) {
            var list = classList(this.node()), i = -1, n = names.length;
            while (++i < n) if (!list.contains(names[i])) return false;
            return true;
        }

        return this.each((typeof value === "function"
            ? classedFunction : value
                ? classedTrue
                : classedFalse)(names, value));
    }

    function textRemove() {
        this.textContent = "";
    }

    function textConstant(value) {
        return function() {
            this.textContent = value;
        };
    }

    function textFunction(value) {
        return function() {
            var v = value.apply(this, arguments);
            this.textContent = v == null ? "" : v;
        };
    }

    function selection_text(value) {
        return arguments.length
            ? this.each(value == null
                ? textRemove : (typeof value === "function"
                    ? textFunction
                    : textConstant)(value))
            : this.node().textContent;
    }

    function htmlRemove() {
        this.innerHTML = "";
    }

    function htmlConstant(value) {
        return function() {
            this.innerHTML = value;
        };
    }

    function htmlFunction(value) {
        return function() {
            var v = value.apply(this, arguments);
            this.innerHTML = v == null ? "" : v;
        };
    }

    function selection_html(value) {
        return arguments.length
            ? this.each(value == null
                ? htmlRemove : (typeof value === "function"
                    ? htmlFunction
                    : htmlConstant)(value))
            : this.node().innerHTML;
    }

    function raise() {
        if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
        return this.each(raise);
    }

    function lower() {
        if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
        return this.each(lower);
    }

    function selection_append(name) {
        var create = typeof name === "function" ? name : creator(name);
        return this.select(function() {
            return this.appendChild(create.apply(this, arguments));
        });
    }

    function constantNull() {
        return null;
    }

    function selection_insert(name, before) {
        var create = typeof name === "function" ? name : creator(name),
            select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
        return this.select(function() {
            return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
        });
    }

    function remove() {
        var parent = this.parentNode;
        if (parent) parent.removeChild(this);
    }

    function selection_remove() {
        return this.each(remove);
    }

    function selection_datum(value) {
        return arguments.length
            ? this.property("__data__", value)
            : this.node().__data__;
    }

    function dispatchEvent(node, type, params) {
        var window = defaultView(node),
            event = window.CustomEvent;

        if (typeof event === "function") {
            event = new event(type, params);
        } else {
            event = window.document.createEvent("Event");
            if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
            else event.initEvent(type, false, false);
        }

        node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
        return function() {
            return dispatchEvent(this, type, params);
        };
    }

    function dispatchFunction(type, params) {
        return function() {
            return dispatchEvent(this, type, params.apply(this, arguments));
        };
    }

    function selection_dispatch(type, params) {
        return this.each((typeof params === "function"
            ? dispatchFunction
            : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
        this._groups = groups;
        this._parents = parents;
    }

    function selection() {
        return new Selection([[document.documentElement]], root);
    }

    Selection.prototype = selection.prototype = {
        constructor: Selection,
        select: selection_select,
        selectAll: selection_selectAll,
        filter: selection_filter,
        data: selection_data,
        enter: selection_enter,
        exit: selection_exit,
        merge: selection_merge,
        order: selection_order,
        sort: selection_sort,
        call: selection_call,
        nodes: selection_nodes,
        node: selection_node,
        size: selection_size,
        empty: selection_empty,
        each: selection_each,
        attr: selection_attr,
        style: selection_style,
        property: selection_property,
        classed: selection_classed,
        text: selection_text,
        html: selection_html,
        raise: selection_raise,
        lower: selection_lower,
        append: selection_append,
        insert: selection_insert,
        remove: selection_remove,
        datum: selection_datum,
        on: selection_on,
        dispatch: selection_dispatch
    };

    function select(selector) {
        return typeof selector === "string"
            ? new Selection([[document.querySelector(selector)]], [document.documentElement])
            : new Selection([[selector]], root);
    }

    function selectAll(selector) {
        return typeof selector === "string"
            ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
            : new Selection([selector == null ? [] : selector], root);
    }

    function touch(node, touches, identifier) {
        if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

        for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
            if ((touch = touches[i]).identifier === identifier) {
                return point(node, touch);
            }
        }

        return null;
    }

    function touches(node, touches) {
        if (touches == null) touches = sourceEvent().touches;

        for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
            points[i] = point(node, touches[i]);
        }

        return points;
    }

    function ascending$1(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(compare) {
        if (compare.length === 1) compare = ascendingComparator(compare);
        return {
            left: function(a, x, lo, hi) {
                if (lo == null) lo = 0;
                if (hi == null) hi = a.length;
                while (lo < hi) {
                    var mid = lo + hi >>> 1;
                    if (compare(a[mid], x) < 0) lo = mid + 1;
                    else hi = mid;
                }
                return lo;
            },
            right: function(a, x, lo, hi) {
                if (lo == null) lo = 0;
                if (hi == null) hi = a.length;
                while (lo < hi) {
                    var mid = lo + hi >>> 1;
                    if (compare(a[mid], x) > 0) hi = mid;
                    else lo = mid + 1;
                }
                return lo;
            }
        };
    }

    function ascendingComparator(f) {
        return function(d, x) {
            return ascending$1(f(d), x);
        };
    }

    var ascendingBisect = bisector(ascending$1);
    var bisectRight = ascendingBisect.right;
    var bisectLeft = ascendingBisect.left;

    function pairs(array, f) {
        if (f == null) f = pair;
        var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
        while (i < n) pairs[i] = f(p, p = array[++i]);
        return pairs;
    }

    function pair(a, b) {
        return [a, b];
    }

    function cross(values0, values1, reduce) {
        var n0 = values0.length,
            n1 = values1.length,
            values = new Array(n0 * n1),
            i0,
            i1,
            i,
            value0;

        if (reduce == null) reduce = pair;

        for (i0 = i = 0; i0 < n0; ++i0) {
            for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
                values[i] = reduce(value0, values1[i1]);
            }
        }

        return values;
    }

    function descending(a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    }

    function number(x) {
        return x === null ? NaN : +x;
    }

    function variance(values, valueof) {
        var n = values.length,
            m = 0,
            i = -1,
            mean = 0,
            value,
            delta,
            sum = 0;

        if (valueof == null) {
            while (++i < n) {
                if (!isNaN(value = number(values[i]))) {
                    delta = value - mean;
                    mean += delta / ++m;
                    sum += delta * (value - mean);
                }
            }
        }

        else {
            while (++i < n) {
                if (!isNaN(value = number(valueof(values[i], i, values)))) {
                    delta = value - mean;
                    mean += delta / ++m;
                    sum += delta * (value - mean);
                }
            }
        }

        if (m > 1) return sum / (m - 1);
    }

    function deviation(array, f) {
        var v = variance(array, f);
        return v ? Math.sqrt(v) : v;
    }

    function extent(values, valueof) {
        var n = values.length,
            i = -1,
            value,
            min,
            max;

        if (valueof == null) {
            while (++i < n) { // Find the first comparable value.
                if ((value = values[i]) != null && value >= value) {
                    min = max = value;
                    while (++i < n) { // Compare the remaining values.
                        if ((value = values[i]) != null) {
                            if (min > value) min = value;
                            if (max < value) max = value;
                        }
                    }
                }
            }
        }

        else {
            while (++i < n) { // Find the first comparable value.
                if ((value = valueof(values[i], i, values)) != null && value >= value) {
                    min = max = value;
                    while (++i < n) { // Compare the remaining values.
                        if ((value = valueof(values[i], i, values)) != null) {
                            if (min > value) min = value;
                            if (max < value) max = value;
                        }
                    }
                }
            }
        }

        return [min, max];
    }

    var array = Array.prototype;

    var slice = array.slice;
    var map = array.map;

    function constant$1(x) {
        return function() {
            return x;
        };
    }

    function identity(x) {
        return x;
    }

    function sequence(start, stop, step) {
        start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

        var i = -1,
            n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
            range = new Array(n);

        while (++i < n) {
            range[i] = start + i * step;
        }

        return range;
    }

    var e10 = Math.sqrt(50);
    var e5 = Math.sqrt(10);
    var e2 = Math.sqrt(2);
    function ticks(start, stop, count) {
        var reverse,
            i = -1,
            n,
            ticks,
            step;

        stop = +stop, start = +start, count = +count;
        if (start === stop && count > 0) return [start];
        if (reverse = stop < start) n = start, start = stop, stop = n;
        if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

        if (step > 0) {
            start = Math.ceil(start / step);
            stop = Math.floor(stop / step);
            ticks = new Array(n = Math.ceil(stop - start + 1));
            while (++i < n) ticks[i] = (start + i) * step;
        } else {
            start = Math.floor(start * step);
            stop = Math.ceil(stop * step);
            ticks = new Array(n = Math.ceil(start - stop + 1));
            while (++i < n) ticks[i] = (start - i) / step;
        }

        if (reverse) ticks.reverse();

        return ticks;
    }

    function tickIncrement(start, stop, count) {
        var step = (stop - start) / Math.max(0, count),
            power = Math.floor(Math.log(step) / Math.LN10),
            error = step / Math.pow(10, power);
        return power >= 0
            ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
            : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
        var step0 = Math.abs(stop - start) / Math.max(0, count),
            step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
            error = step0 / step1;
        if (error >= e10) step1 *= 10;
        else if (error >= e5) step1 *= 5;
        else if (error >= e2) step1 *= 2;
        return stop < start ? -step1 : step1;
    }

    function sturges(values) {
        return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
    }

    function histogram() {
        var value = identity,
            domain = extent,
            threshold = sturges;

        function histogram(data) {
            var i,
                n = data.length,
                x,
                values = new Array(n);

            for (i = 0; i < n; ++i) {
                values[i] = value(data[i], i, data);
            }

            var xz = domain(values),
                x0 = xz[0],
                x1 = xz[1],
                tz = threshold(values, x0, x1);

            // Convert number of thresholds into uniform thresholds.
            if (!Array.isArray(tz)) {
                tz = tickStep(x0, x1, tz);
                tz = sequence(Math.ceil(x0 / tz) * tz, Math.floor(x1 / tz) * tz, tz); // exclusive
            }

            // Remove any thresholds outside the domain.
            var m = tz.length;
            while (tz[0] <= x0) tz.shift(), --m;
            while (tz[m - 1] > x1) tz.pop(), --m;

            var bins = new Array(m + 1),
                bin;

            // Initialize bins.
            for (i = 0; i <= m; ++i) {
                bin = bins[i] = [];
                bin.x0 = i > 0 ? tz[i - 1] : x0;
                bin.x1 = i < m ? tz[i] : x1;
            }

            // Assign data to bins by value, ignoring any outside the domain.
            for (i = 0; i < n; ++i) {
                x = values[i];
                if (x0 <= x && x <= x1) {
                    bins[bisectRight(tz, x, 0, m)].push(data[i]);
                }
            }

            return bins;
        }

        histogram.value = function(_) {
            return arguments.length ? (value = typeof _ === "function" ? _ : constant$1(_), histogram) : value;
        };

        histogram.domain = function(_) {
            return arguments.length ? (domain = typeof _ === "function" ? _ : constant$1([_[0], _[1]]), histogram) : domain;
        };

        histogram.thresholds = function(_) {
            return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant$1(slice.call(_)) : constant$1(_), histogram) : threshold;
        };

        return histogram;
    }

    function threshold(values, p, valueof) {
        if (valueof == null) valueof = number;
        if (!(n = values.length)) return;
        if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
        if (p >= 1) return +valueof(values[n - 1], n - 1, values);
        var n,
            i = (n - 1) * p,
            i0 = Math.floor(i),
            value0 = +valueof(values[i0], i0, values),
            value1 = +valueof(values[i0 + 1], i0 + 1, values);
        return value0 + (value1 - value0) * (i - i0);
    }

    function freedmanDiaconis(values, min, max) {
        values = map.call(values, number).sort(ascending$1);
        return Math.ceil((max - min) / (2 * (threshold(values, 0.75) - threshold(values, 0.25)) * Math.pow(values.length, -1 / 3)));
    }

    function scott(values, min, max) {
        return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
    }

    function max(values, valueof) {
        var n = values.length,
            i = -1,
            value,
            max;

        if (valueof == null) {
            while (++i < n) { // Find the first comparable value.
                if ((value = values[i]) != null && value >= value) {
                    max = value;
                    while (++i < n) { // Compare the remaining values.
                        if ((value = values[i]) != null && value > max) {
                            max = value;
                        }
                    }
                }
            }
        }

        else {
            while (++i < n) { // Find the first comparable value.
                if ((value = valueof(values[i], i, values)) != null && value >= value) {
                    max = value;
                    while (++i < n) { // Compare the remaining values.
                        if ((value = valueof(values[i], i, values)) != null && value > max) {
                            max = value;
                        }
                    }
                }
            }
        }

        return max;
    }

    function mean(values, valueof) {
        var n = values.length,
            m = n,
            i = -1,
            value,
            sum = 0;

        if (valueof == null) {
            while (++i < n) {
                if (!isNaN(value = number(values[i]))) sum += value;
                else --m;
            }
        }

        else {
            while (++i < n) {
                if (!isNaN(value = number(valueof(values[i], i, values)))) sum += value;
                else --m;
            }
        }

        if (m) return sum / m;
    }

    function median(values, valueof) {
        var n = values.length,
            i = -1,
            value,
            numbers = [];

        if (valueof == null) {
            while (++i < n) {
                if (!isNaN(value = number(values[i]))) {
                    numbers.push(value);
                }
            }
        }

        else {
            while (++i < n) {
                if (!isNaN(value = number(valueof(values[i], i, values)))) {
                    numbers.push(value);
                }
            }
        }

        return threshold(numbers.sort(ascending$1), 0.5);
    }

    function merge(arrays) {
        var n = arrays.length,
            m,
            i = -1,
            j = 0,
            merged,
            array;

        while (++i < n) j += arrays[i].length;
        merged = new Array(j);

        while (--n >= 0) {
            array = arrays[n];
            m = array.length;
            while (--m >= 0) {
                merged[--j] = array[m];
            }
        }

        return merged;
    }

    function min(values, valueof) {
        var n = values.length,
            i = -1,
            value,
            min;

        if (valueof == null) {
            while (++i < n) { // Find the first comparable value.
                if ((value = values[i]) != null && value >= value) {
                    min = value;
                    while (++i < n) { // Compare the remaining values.
                        if ((value = values[i]) != null && min > value) {
                            min = value;
                        }
                    }
                }
            }
        }

        else {
            while (++i < n) { // Find the first comparable value.
                if ((value = valueof(values[i], i, values)) != null && value >= value) {
                    min = value;
                    while (++i < n) { // Compare the remaining values.
                        if ((value = valueof(values[i], i, values)) != null && min > value) {
                            min = value;
                        }
                    }
                }
            }
        }

        return min;
    }

    function permute(array, indexes) {
        var i = indexes.length, permutes = new Array(i);
        while (i--) permutes[i] = array[indexes[i]];
        return permutes;
    }

    function scan(values, compare) {
        if (!(n = values.length)) return;
        var n,
            i = 0,
            j = 0,
            xi,
            xj = values[j];

        if (compare == null) compare = ascending$1;

        while (++i < n) {
            if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
                xj = xi, j = i;
            }
        }

        if (compare(xj, xj) === 0) return j;
    }

    function shuffle(array, i0, i1) {
        var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
            t,
            i;

        while (m) {
            i = Math.random() * m-- | 0;
            t = array[m + i0];
            array[m + i0] = array[i + i0];
            array[i + i0] = t;
        }

        return array;
    }

    function sum(values, valueof) {
        var n = values.length,
            i = -1,
            value,
            sum = 0;

        if (valueof == null) {
            while (++i < n) {
                if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
            }
        }

        else {
            while (++i < n) {
                if (value = +valueof(values[i], i, values)) sum += value;
            }
        }

        return sum;
    }

    function transpose(matrix) {
        if (!(n = matrix.length)) return [];
        for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
            for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
                row[j] = matrix[j][i];
            }
        }
        return transpose;
    }

    function length(d) {
        return d.length;
    }

    function zip() {
        return transpose(arguments);
    }

    var prefix = "$";

    function Map() {}

    Map.prototype = map$1.prototype = {
        constructor: Map,
        has: function(key) {
            return (prefix + key) in this;
        },
        get: function(key) {
            return this[prefix + key];
        },
        set: function(key, value) {
            this[prefix + key] = value;
            return this;
        },
        remove: function(key) {
            var property = prefix + key;
            return property in this && delete this[property];
        },
        clear: function() {
            for (var property in this) if (property[0] === prefix) delete this[property];
        },
        keys: function() {
            var keys = [];
            for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
            return keys;
        },
        values: function() {
            var values = [];
            for (var property in this) if (property[0] === prefix) values.push(this[property]);
            return values;
        },
        entries: function() {
            var entries = [];
            for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
            return entries;
        },
        size: function() {
            var size = 0;
            for (var property in this) if (property[0] === prefix) ++size;
            return size;
        },
        empty: function() {
            for (var property in this) if (property[0] === prefix) return false;
            return true;
        },
        each: function(f) {
            for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
        }
    };

    function map$1(object, f) {
        var map = new Map;

        // Copy constructor.
        if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

        // Index array by numeric index or specified key function.
        else if (Array.isArray(object)) {
            var i = -1,
                n = object.length,
                o;

            if (f == null) while (++i < n) map.set(i, object[i]);
            else while (++i < n) map.set(f(o = object[i], i, object), o);
        }

        // Convert object to map.
        else if (object) for (var key in object) map.set(key, object[key]);

        return map;
    }

    function nest() {
        var keys = [],
            sortKeys = [],
            sortValues,
            rollup,
            nest;

        function apply(array, depth, createResult, setResult) {
            if (depth >= keys.length) {
                if (sortValues != null) array.sort(sortValues);
                return rollup != null ? rollup(array) : array;
            }

            var i = -1,
                n = array.length,
                key = keys[depth++],
                keyValue,
                value,
                valuesByKey = map$1(),
                values,
                result = createResult();

            while (++i < n) {
                if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
                    values.push(value);
                } else {
                    valuesByKey.set(keyValue, [value]);
                }
            }

            valuesByKey.each(function(values, key) {
                setResult(result, key, apply(values, depth, createResult, setResult));
            });

            return result;
        }

        function entries(map, depth) {
            if (++depth > keys.length) return map;
            var array, sortKey = sortKeys[depth - 1];
            if (rollup != null && depth >= keys.length) array = map.entries();
            else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
            return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
        }

        return nest = {
            object: function(array) { return apply(array, 0, createObject, setObject); },
            map: function(array) { return apply(array, 0, createMap, setMap); },
            entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
            key: function(d) { keys.push(d); return nest; },
            sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
            sortValues: function(order) { sortValues = order; return nest; },
            rollup: function(f) { rollup = f; return nest; }
        };
    }

    function createObject() {
        return {};
    }

    function setObject(object, key, value) {
        object[key] = value;
    }

    function createMap() {
        return map$1();
    }

    function setMap(map, key, value) {
        map.set(key, value);
    }

    function Set() {}

    var proto = map$1.prototype;

    Set.prototype = set.prototype = {
        constructor: Set,
        has: proto.has,
        add: function(value) {
            value += "";
            this[prefix + value] = value;
            return this;
        },
        remove: proto.remove,
        clear: proto.clear,
        values: proto.keys,
        size: proto.size,
        empty: proto.empty,
        each: proto.each
    };

    function set(object, f) {
        var set = new Set;

        // Copy constructor.
        if (object instanceof Set) object.each(function(value) { set.add(value); });

        // Otherwise, assume it’s an array.
        else if (object) {
            var i = -1, n = object.length;
            if (f == null) while (++i < n) set.add(object[i]);
            else while (++i < n) set.add(f(object[i], i, object));
        }

        return set;
    }

    function keys(map) {
        var keys = [];
        for (var key in map) keys.push(key);
        return keys;
    }

    function values(map) {
        var values = [];
        for (var key in map) values.push(map[key]);
        return values;
    }

    function entries(map) {
        var entries = [];
        for (var key in map) entries.push({key: key, value: map[key]});
        return entries;
    }

    var array$1 = Array.prototype;

    var map$2 = array$1.map;
    var slice$1 = array$1.slice;

    var implicit = {name: "implicit"};

    function ordinal(range) {
        var index = map$1(),
            domain = [],
            unknown = implicit;

        range = range == null ? [] : slice$1.call(range);

        function scale(d) {
            var key = d + "", i = index.get(key);
            if (!i) {
                if (unknown !== implicit) return unknown;
                index.set(key, i = domain.push(d));
            }
            return range[(i - 1) % range.length];
        }

        scale.domain = function(_) {
            if (!arguments.length) return domain.slice();
            domain = [], index = map$1();
            var i = -1, n = _.length, d, key;
            while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
            return scale;
        };

        scale.range = function(_) {
            return arguments.length ? (range = slice$1.call(_), scale) : range.slice();
        };

        scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        };

        scale.copy = function() {
            return ordinal()
                .domain(domain)
                .range(range)
                .unknown(unknown);
        };

        return scale;
    }

    function band() {
        var scale = ordinal().unknown(undefined),
            domain = scale.domain,
            ordinalRange = scale.range,
            range = [0, 1],
            step,
            bandwidth,
            round = false,
            paddingInner = 0,
            paddingOuter = 0,
            align = 0.5;

        delete scale.unknown;

        function rescale() {
            var n = domain().length,
                reverse = range[1] < range[0],
                start = range[reverse - 0],
                stop = range[1 - reverse];
            step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
            if (round) step = Math.floor(step);
            start += (stop - start - step * (n - paddingInner)) * align;
            bandwidth = step * (1 - paddingInner);
            if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
            var values = sequence(n).map(function(i) { return start + step * i; });
            return ordinalRange(reverse ? values.reverse() : values);
        }

        scale.domain = function(_) {
            return arguments.length ? (domain(_), rescale()) : domain();
        };

        scale.range = function(_) {
            return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
        };

        scale.rangeRound = function(_) {
            return range = [+_[0], +_[1]], round = true, rescale();
        };

        scale.bandwidth = function() {
            return bandwidth;
        };

        scale.step = function() {
            return step;
        };

        scale.round = function(_) {
            return arguments.length ? (round = !!_, rescale()) : round;
        };

        scale.padding = function(_) {
            return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
        };

        scale.paddingInner = function(_) {
            return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
        };

        scale.paddingOuter = function(_) {
            return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
        };

        scale.align = function(_) {
            return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
        };

        scale.copy = function() {
            return band()
                .domain(domain())
                .range(range)
                .round(round)
                .paddingInner(paddingInner)
                .paddingOuter(paddingOuter)
                .align(align);
        };

        return rescale();
    }

    function pointish(scale) {
        var copy = scale.copy;

        scale.padding = scale.paddingOuter;
        delete scale.paddingInner;
        delete scale.paddingOuter;

        scale.copy = function() {
            return pointish(copy());
        };

        return scale;
    }

    function point$1() {
        return pointish(band().paddingInner(1));
    }

    function define(constructor, factory, prototype) {
        constructor.prototype = factory.prototype = prototype;
        prototype.constructor = constructor;
    }

    function extend(parent, definition) {
        var prototype = Object.create(parent.prototype);
        for (var key in definition) prototype[key] = definition[key];
        return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*";
    var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
    var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
    var reHex3 = /^#([0-9a-f]{3})$/;
    var reHex6 = /^#([0-9a-f]{6})$/;
    var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
    var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
    var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
    var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
    var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
    var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
    var named = {
        aliceblue: 0xf0f8ff,
        antiquewhite: 0xfaebd7,
        aqua: 0x00ffff,
        aquamarine: 0x7fffd4,
        azure: 0xf0ffff,
        beige: 0xf5f5dc,
        bisque: 0xffe4c4,
        black: 0x000000,
        blanchedalmond: 0xffebcd,
        blue: 0x0000ff,
        blueviolet: 0x8a2be2,
        brown: 0xa52a2a,
        burlywood: 0xdeb887,
        cadetblue: 0x5f9ea0,
        chartreuse: 0x7fff00,
        chocolate: 0xd2691e,
        coral: 0xff7f50,
        cornflowerblue: 0x6495ed,
        cornsilk: 0xfff8dc,
        crimson: 0xdc143c,
        cyan: 0x00ffff,
        darkblue: 0x00008b,
        darkcyan: 0x008b8b,
        darkgoldenrod: 0xb8860b,
        darkgray: 0xa9a9a9,
        darkgreen: 0x006400,
        darkgrey: 0xa9a9a9,
        darkkhaki: 0xbdb76b,
        darkmagenta: 0x8b008b,
        darkolivegreen: 0x556b2f,
        darkorange: 0xff8c00,
        darkorchid: 0x9932cc,
        darkred: 0x8b0000,
        darksalmon: 0xe9967a,
        darkseagreen: 0x8fbc8f,
        darkslateblue: 0x483d8b,
        darkslategray: 0x2f4f4f,
        darkslategrey: 0x2f4f4f,
        darkturquoise: 0x00ced1,
        darkviolet: 0x9400d3,
        deeppink: 0xff1493,
        deepskyblue: 0x00bfff,
        dimgray: 0x696969,
        dimgrey: 0x696969,
        dodgerblue: 0x1e90ff,
        firebrick: 0xb22222,
        floralwhite: 0xfffaf0,
        forestgreen: 0x228b22,
        fuchsia: 0xff00ff,
        gainsboro: 0xdcdcdc,
        ghostwhite: 0xf8f8ff,
        gold: 0xffd700,
        goldenrod: 0xdaa520,
        gray: 0x808080,
        green: 0x008000,
        greenyellow: 0xadff2f,
        grey: 0x808080,
        honeydew: 0xf0fff0,
        hotpink: 0xff69b4,
        indianred: 0xcd5c5c,
        indigo: 0x4b0082,
        ivory: 0xfffff0,
        khaki: 0xf0e68c,
        lavender: 0xe6e6fa,
        lavenderblush: 0xfff0f5,
        lawngreen: 0x7cfc00,
        lemonchiffon: 0xfffacd,
        lightblue: 0xadd8e6,
        lightcoral: 0xf08080,
        lightcyan: 0xe0ffff,
        lightgoldenrodyellow: 0xfafad2,
        lightgray: 0xd3d3d3,
        lightgreen: 0x90ee90,
        lightgrey: 0xd3d3d3,
        lightpink: 0xffb6c1,
        lightsalmon: 0xffa07a,
        lightseagreen: 0x20b2aa,
        lightskyblue: 0x87cefa,
        lightslategray: 0x778899,
        lightslategrey: 0x778899,
        lightsteelblue: 0xb0c4de,
        lightyellow: 0xffffe0,
        lime: 0x00ff00,
        limegreen: 0x32cd32,
        linen: 0xfaf0e6,
        magenta: 0xff00ff,
        maroon: 0x800000,
        mediumaquamarine: 0x66cdaa,
        mediumblue: 0x0000cd,
        mediumorchid: 0xba55d3,
        mediumpurple: 0x9370db,
        mediumseagreen: 0x3cb371,
        mediumslateblue: 0x7b68ee,
        mediumspringgreen: 0x00fa9a,
        mediumturquoise: 0x48d1cc,
        mediumvioletred: 0xc71585,
        midnightblue: 0x191970,
        mintcream: 0xf5fffa,
        mistyrose: 0xffe4e1,
        moccasin: 0xffe4b5,
        navajowhite: 0xffdead,
        navy: 0x000080,
        oldlace: 0xfdf5e6,
        olive: 0x808000,
        olivedrab: 0x6b8e23,
        orange: 0xffa500,
        orangered: 0xff4500,
        orchid: 0xda70d6,
        palegoldenrod: 0xeee8aa,
        palegreen: 0x98fb98,
        paleturquoise: 0xafeeee,
        palevioletred: 0xdb7093,
        papayawhip: 0xffefd5,
        peachpuff: 0xffdab9,
        peru: 0xcd853f,
        pink: 0xffc0cb,
        plum: 0xdda0dd,
        powderblue: 0xb0e0e6,
        purple: 0x800080,
        rebeccapurple: 0x663399,
        red: 0xff0000,
        rosybrown: 0xbc8f8f,
        royalblue: 0x4169e1,
        saddlebrown: 0x8b4513,
        salmon: 0xfa8072,
        sandybrown: 0xf4a460,
        seagreen: 0x2e8b57,
        seashell: 0xfff5ee,
        sienna: 0xa0522d,
        silver: 0xc0c0c0,
        skyblue: 0x87ceeb,
        slateblue: 0x6a5acd,
        slategray: 0x708090,
        slategrey: 0x708090,
        snow: 0xfffafa,
        springgreen: 0x00ff7f,
        steelblue: 0x4682b4,
        tan: 0xd2b48c,
        teal: 0x008080,
        thistle: 0xd8bfd8,
        tomato: 0xff6347,
        turquoise: 0x40e0d0,
        violet: 0xee82ee,
        wheat: 0xf5deb3,
        white: 0xffffff,
        whitesmoke: 0xf5f5f5,
        yellow: 0xffff00,
        yellowgreen: 0x9acd32
    };

    define(Color, color, {
        displayable: function() {
            return this.rgb().displayable();
        },
        toString: function() {
            return this.rgb() + "";
        }
    });

    function color(format) {
        var m;
        format = (format + "").trim().toLowerCase();
        return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
            : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
                : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
                    : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
                        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
                            : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
                                : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
                                    : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
                                        : named.hasOwnProperty(format) ? rgbn(named[format])
                                            : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
                                                : null;
    }

    function rgbn(n) {
        return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
        if (a <= 0) r = g = b = NaN;
        return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
        if (!(o instanceof Color)) o = color(o);
        if (!o) return new Rgb;
        o = o.rgb();
        return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function colorRgb(r, g, b, opacity) {
        return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
        this.r = +r;
        this.g = +g;
        this.b = +b;
        this.opacity = +opacity;
    }

    define(Rgb, colorRgb, extend(Color, {
        brighter: function(k) {
            k = k == null ? brighter : Math.pow(brighter, k);
            return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker : Math.pow(darker, k);
            return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        rgb: function() {
            return this;
        },
        displayable: function() {
            return (0 <= this.r && this.r <= 255)
                && (0 <= this.g && this.g <= 255)
                && (0 <= this.b && this.b <= 255)
                && (0 <= this.opacity && this.opacity <= 1);
        },
        toString: function() {
            var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
            return (a === 1 ? "rgb(" : "rgba(")
                + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
                + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
                + Math.max(0, Math.min(255, Math.round(this.b) || 0))
                + (a === 1 ? ")" : ", " + a + ")");
        }
    }));

    function hsla(h, s, l, a) {
        if (a <= 0) h = s = l = NaN;
        else if (l <= 0 || l >= 1) h = s = NaN;
        else if (s <= 0) h = NaN;
        return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
        if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
        if (!(o instanceof Color)) o = color(o);
        if (!o) return new Hsl;
        if (o instanceof Hsl) return o;
        o = o.rgb();
        var r = o.r / 255,
            g = o.g / 255,
            b = o.b / 255,
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            h = NaN,
            s = max - min,
            l = (max + min) / 2;
        if (s) {
            if (r === max) h = (g - b) / s + (g < b) * 6;
            else if (g === max) h = (b - r) / s + 2;
            else h = (r - g) / s + 4;
            s /= l < 0.5 ? max + min : 2 - max - min;
            h *= 60;
        } else {
            s = l > 0 && l < 1 ? 0 : h;
        }
        return new Hsl(h, s, l, o.opacity);
    }

    function colorHsl(h, s, l, opacity) {
        return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    }

    define(Hsl, colorHsl, extend(Color, {
        brighter: function(k) {
            k = k == null ? brighter : Math.pow(brighter, k);
            return new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker : Math.pow(darker, k);
            return new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = this.h % 360 + (this.h < 0) * 360,
                s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
                l = this.l,
                m2 = l + (l < 0.5 ? l : 1 - l) * s,
                m1 = 2 * l - m2;
            return new Rgb(
                hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
                hsl2rgb(h, m1, m2),
                hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
                this.opacity
            );
        },
        displayable: function() {
            return (0 <= this.s && this.s <= 1 || isNaN(this.s))
                && (0 <= this.l && this.l <= 1)
                && (0 <= this.opacity && this.opacity <= 1);
        }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
        return (h < 60 ? m1 + (m2 - m1) * h / 60
                : h < 180 ? m2
                    : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
                        : m1) * 255;
    }

    var deg2rad = Math.PI / 180;
    var rad2deg = 180 / Math.PI;

    var Kn = 18;
    var Xn = 0.950470;
    var Yn = 1;
    var Zn = 1.088830;
    var t0 = 4 / 29;
    var t1 = 6 / 29;
    var t2 = 3 * t1 * t1;
    var t3 = t1 * t1 * t1;
    function labConvert(o) {
        if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
        if (o instanceof Hcl) {
            var h = o.h * deg2rad;
            return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
        }
        if (!(o instanceof Rgb)) o = rgbConvert(o);
        var b = rgb2xyz(o.r),
            a = rgb2xyz(o.g),
            l = rgb2xyz(o.b),
            x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
            y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
            z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
        return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab(l, a, b, opacity) {
        return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab(l, a, b, opacity) {
        this.l = +l;
        this.a = +a;
        this.b = +b;
        this.opacity = +opacity;
    }

    define(Lab, lab, extend(Color, {
        brighter: function(k) {
            return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
        },
        darker: function(k) {
            return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
        },
        rgb: function() {
            var y = (this.l + 16) / 116,
                x = isNaN(this.a) ? y : y + this.a / 500,
                z = isNaN(this.b) ? y : y - this.b / 200;
            y = Yn * lab2xyz(y);
            x = Xn * lab2xyz(x);
            z = Zn * lab2xyz(z);
            return new Rgb(
                xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
                xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
                xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
                this.opacity
            );
        }
    }));

    function xyz2lab(t) {
        return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
        return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function xyz2rgb(x) {
        return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2xyz(x) {
        return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert(o) {
        if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
        if (!(o instanceof Lab)) o = labConvert(o);
        var h = Math.atan2(o.b, o.a) * rad2deg;
        return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function colorHcl(h, c, l, opacity) {
        return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl(h, c, l, opacity) {
        this.h = +h;
        this.c = +c;
        this.l = +l;
        this.opacity = +opacity;
    }

    define(Hcl, colorHcl, extend(Color, {
        brighter: function(k) {
            return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
        },
        darker: function(k) {
            return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
        },
        rgb: function() {
            return labConvert(this).rgb();
        }
    }));

    var A = -0.14861;
    var B = +1.78277;
    var C = -0.29227;
    var D = -0.90649;
    var E = +1.97294;
    var ED = E * D;
    var EB = E * B;
    var BC_DA = B * C - D * A;
    function cubehelixConvert(o) {
        if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
        if (!(o instanceof Rgb)) o = rgbConvert(o);
        var r = o.r / 255,
            g = o.g / 255,
            b = o.b / 255,
            l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
            bl = b - l,
            k = (E * (g - l) - C * bl) / D,
            s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
            h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
        return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix(h, s, l, opacity) {
        return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    }

    define(Cubehelix, cubehelix, extend(Color, {
        brighter: function(k) {
            k = k == null ? brighter : Math.pow(brighter, k);
            return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker : Math.pow(darker, k);
            return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
                l = +this.l,
                a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
                cosh = Math.cos(h),
                sinh = Math.sin(h);
            return new Rgb(
                255 * (l + a * (A * cosh + B * sinh)),
                255 * (l + a * (C * cosh + D * sinh)),
                255 * (l + a * (E * cosh)),
                this.opacity
            );
        }
    }));

    function basis(t1, v0, v1, v2, v3) {
        var t2 = t1 * t1, t3 = t2 * t1;
        return ((1 - 3 * t1 + 3 * t2 - t3) * v0
            + (4 - 6 * t2 + 3 * t3) * v1
            + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
            + t3 * v3) / 6;
    }

    function basis$1(values) {
        var n = values.length - 1;
        return function(t) {
            var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
                v1 = values[i],
                v2 = values[i + 1],
                v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
                v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
            return basis((t - i / n) * n, v0, v1, v2, v3);
        };
    }

    function basisClosed(values) {
        var n = values.length;
        return function(t) {
            var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
                v0 = values[(i + n - 1) % n],
                v1 = values[i % n],
                v2 = values[(i + 1) % n],
                v3 = values[(i + 2) % n];
            return basis((t - i / n) * n, v0, v1, v2, v3);
        };
    }

    function constant$2(x) {
        return function() {
            return x;
        };
    }

    function linear$1(a, d) {
        return function(t) {
            return a + t * d;
        };
    }

    function exponential(a, b, y) {
        return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
            return Math.pow(a + t * b, y);
        };
    }

    function hue(a, b) {
        var d = b - a;
        return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$2(isNaN(a) ? b : a);
    }

    function gamma(y) {
        return (y = +y) === 1 ? nogamma : function(a, b) {
            return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
        };
    }

    function nogamma(a, b) {
        var d = b - a;
        return d ? linear$1(a, d) : constant$2(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
        var color = gamma(y);

        function rgb(start, end) {
            var r = color((start = colorRgb(start)).r, (end = colorRgb(end)).r),
                g = color(start.g, end.g),
                b = color(start.b, end.b),
                opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                start.r = r(t);
                start.g = g(t);
                start.b = b(t);
                start.opacity = opacity(t);
                return start + "";
            };
        }

        rgb.gamma = rgbGamma;

        return rgb;
    })(1);

    function rgbSpline(spline) {
        return function(colors) {
            var n = colors.length,
                r = new Array(n),
                g = new Array(n),
                b = new Array(n),
                i, color;
            for (i = 0; i < n; ++i) {
                color = colorRgb(colors[i]);
                r[i] = color.r || 0;
                g[i] = color.g || 0;
                b[i] = color.b || 0;
            }
            r = spline(r);
            g = spline(g);
            b = spline(b);
            color.opacity = 1;
            return function(t) {
                color.r = r(t);
                color.g = g(t);
                color.b = b(t);
                return color + "";
            };
        };
    }

    var rgbBasis = rgbSpline(basis$1);
    var rgbBasisClosed = rgbSpline(basisClosed);

    function array$2(a, b) {
        var nb = b ? b.length : 0,
            na = a ? Math.min(nb, a.length) : 0,
            x = new Array(nb),
            c = new Array(nb),
            i;

        for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
        for (; i < nb; ++i) c[i] = b[i];

        return function(t) {
            for (i = 0; i < na; ++i) c[i] = x[i](t);
            return c;
        };
    }

    function date(a, b) {
        var d = new Date;
        return a = +a, b -= a, function(t) {
            return d.setTime(a + b * t), d;
        };
    }

    function interpolateNumber(a, b) {
        return a = +a, b -= a, function(t) {
            return a + b * t;
        };
    }

    function object(a, b) {
        var i = {},
            c = {},
            k;

        if (a === null || typeof a !== "object") a = {};
        if (b === null || typeof b !== "object") b = {};

        for (k in b) {
            if (k in a) {
                i[k] = interpolateValue(a[k], b[k]);
            } else {
                c[k] = b[k];
            }
        }

        return function(t) {
            for (k in i) c[k] = i[k](t);
            return c;
        };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
    var reB = new RegExp(reA.source, "g");
    function zero(b) {
        return function() {
            return b;
        };
    }

    function one(b) {
        return function(t) {
            return b(t) + "";
        };
    }

    function interpolateString(a, b) {
        var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
            am, // current match in a
            bm, // current match in b
            bs, // string preceding current number in b, if any
            i = -1, // index in s
            s = [], // string constants and placeholders
            q = []; // number interpolators

        // Coerce inputs to strings.
        a = a + "", b = b + "";

        // Interpolate pairs of numbers in a & b.
        while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
            if ((bs = bm.index) > bi) { // a string precedes the next number in b
                bs = b.slice(bi, bs);
                if (s[i]) s[i] += bs; // coalesce with previous string
                else s[++i] = bs;
            }
            if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
                if (s[i]) s[i] += bm; // coalesce with previous string
                else s[++i] = bm;
            } else { // interpolate non-matching numbers
                s[++i] = null;
                q.push({i: i, x: interpolateNumber(am, bm)});
            }
            bi = reB.lastIndex;
        }

        // Add remains of b.
        if (bi < b.length) {
            bs = b.slice(bi);
            if (s[i]) s[i] += bs; // coalesce with previous string
            else s[++i] = bs;
        }

        // Special optimization for only a single match.
        // Otherwise, interpolate each of the numbers and rejoin the string.
        return s.length < 2 ? (q[0]
            ? one(q[0].x)
            : zero(b))
            : (b = q.length, function(t) {
                for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
                return s.join("");
            });
    }

    function interpolateValue(a, b) {
        var t = typeof b, c;
        return b == null || t === "boolean" ? constant$2(b)
            : (t === "number" ? interpolateNumber
                : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
                    : b instanceof color ? interpolateRgb
                        : b instanceof Date ? date
                            : Array.isArray(b) ? array$2
                                : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
                                    : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
        return a = +a, b -= a, function(t) {
            return Math.round(a + b * t);
        };
    }

    var degrees = 180 / Math.PI;

    var identity$2 = {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1
    };

    function decompose(a, b, c, d, e, f) {
        var scaleX, scaleY, skewX;
        if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
        if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
        if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
        if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
        return {
            translateX: e,
            translateY: f,
            rotate: Math.atan2(b, a) * degrees,
            skewX: Math.atan(skewX) * degrees,
            scaleX: scaleX,
            scaleY: scaleY
        };
    }

    var cssNode;
    var cssRoot;
    var cssView;
    var svgNode;
    function parseCss(value) {
        if (value === "none") return identity$2;
        if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
        cssNode.style.transform = value;
        value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
        cssRoot.removeChild(cssNode);
        value = value.slice(7, -1).split(",");
        return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
    }

    function parseSvg(value) {
        if (value == null) return identity$2;
        if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgNode.setAttribute("transform", value);
        if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
        value = value.matrix;
        return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
    }

    function interpolateTransform(parse, pxComma, pxParen, degParen) {

        function pop(s) {
            return s.length ? s.pop() + " " : "";
        }

        function translate(xa, ya, xb, yb, s, q) {
            if (xa !== xb || ya !== yb) {
                var i = s.push("translate(", null, pxComma, null, pxParen);
                q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
            } else if (xb || yb) {
                s.push("translate(" + xb + pxComma + yb + pxParen);
            }
        }

        function rotate(a, b, s, q) {
            if (a !== b) {
                if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
                q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
            } else if (b) {
                s.push(pop(s) + "rotate(" + b + degParen);
            }
        }

        function skewX(a, b, s, q) {
            if (a !== b) {
                q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
            } else if (b) {
                s.push(pop(s) + "skewX(" + b + degParen);
            }
        }

        function scale(xa, ya, xb, yb, s, q) {
            if (xa !== xb || ya !== yb) {
                var i = s.push(pop(s) + "scale(", null, ",", null, ")");
                q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
            } else if (xb !== 1 || yb !== 1) {
                s.push(pop(s) + "scale(" + xb + "," + yb + ")");
            }
        }

        return function(a, b) {
            var s = [], // string constants and placeholders
                q = []; // number interpolators
            a = parse(a), b = parse(b);
            translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
            rotate(a.rotate, b.rotate, s, q);
            skewX(a.skewX, b.skewX, s, q);
            scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
            a = b = null; // gc
            return function(t) {
                var i = -1, n = q.length, o;
                while (++i < n) s[(o = q[i]).i] = o.x(t);
                return s.join("");
            };
        };
    }

    var interpolateTransform$1 = interpolateTransform(parseCss, "px, ", "px)", "deg)");
    var interpolateTransform$2 = interpolateTransform(parseSvg, ", ", ")", ")");

    var rho = Math.SQRT2;
    var rho2 = 2;
    var rho4 = 4;
    var epsilon2 = 1e-12;
    function cosh(x) {
        return ((x = Math.exp(x)) + 1 / x) / 2;
    }

    function sinh(x) {
        return ((x = Math.exp(x)) - 1 / x) / 2;
    }

    function tanh(x) {
        return ((x = Math.exp(2 * x)) - 1) / (x + 1);
    }

    // p0 = [ux0, uy0, w0]
    // p1 = [ux1, uy1, w1]
    function zoom(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
            ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
            dx = ux1 - ux0,
            dy = uy1 - uy0,
            d2 = dx * dx + dy * dy,
            i,
            S;

        // Special case for u0 ≅ u1.
        if (d2 < epsilon2) {
            S = Math.log(w1 / w0) / rho;
            i = function(t) {
                return [
                    ux0 + t * dx,
                    uy0 + t * dy,
                    w0 * Math.exp(rho * t * S)
                ];
            }
        }

        // General case.
        else {
            var d1 = Math.sqrt(d2),
                b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
                b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
                r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
                r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
            S = (r1 - r0) / rho;
            i = function(t) {
                var s = t * S,
                    coshr0 = cosh(r0),
                    u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
                return [
                    ux0 + u * dx,
                    uy0 + u * dy,
                    w0 * coshr0 / cosh(rho * s + r0)
                ];
            }
        }

        i.duration = S * 1000;

        return i;
    }

    function hsl(hue) {
        return function(start, end) {
            var h = hue((start = colorHsl(start)).h, (end = colorHsl(end)).h),
                s = nogamma(start.s, end.s),
                l = nogamma(start.l, end.l),
                opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                start.h = h(t);
                start.s = s(t);
                start.l = l(t);
                start.opacity = opacity(t);
                return start + "";
            };
        }
    }

    var hsl$1 = hsl(hue);
    var hslLong = hsl(nogamma);

    function lab$1(start, end) {
        var l = nogamma((start = lab(start)).l, (end = lab(end)).l),
            a = nogamma(start.a, end.a),
            b = nogamma(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
            start.l = l(t);
            start.a = a(t);
            start.b = b(t);
            start.opacity = opacity(t);
            return start + "";
        };
    }

    function hcl(hue) {
        return function(start, end) {
            var h = hue((start = colorHcl(start)).h, (end = colorHcl(end)).h),
                c = nogamma(start.c, end.c),
                l = nogamma(start.l, end.l),
                opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                start.h = h(t);
                start.c = c(t);
                start.l = l(t);
                start.opacity = opacity(t);
                return start + "";
            };
        }
    }

    var hcl$1 = hcl(hue);
    var hclLong = hcl(nogamma);

    function cubehelix$1(hue) {
        return (function cubehelixGamma(y) {
            y = +y;

            function cubehelix$$(start, end) {
                var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
                    s = nogamma(start.s, end.s),
                    l = nogamma(start.l, end.l),
                    opacity = nogamma(start.opacity, end.opacity);
                return function(t) {
                    start.h = h(t);
                    start.s = s(t);
                    start.l = l(Math.pow(t, y));
                    start.opacity = opacity(t);
                    return start + "";
                };
            }

            cubehelix$$.gamma = cubehelixGamma;

            return cubehelix$$;
        })(1);
    }

    var cubehelix$2 = cubehelix$1(hue);
    var interpolateCubehelixLong = cubehelix$1(nogamma);

    function quantize(interpolator, n) {
        var samples = new Array(n);
        for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
        return samples;
    }

    function constant$3(x) {
        return function() {
            return x;
        };
    }

    function number$1(x) {
        return +x;
    }

    var unit = [0, 1];

    function deinterpolate(a, b) {
        return (b -= (a = +a))
            ? function(x) { return (x - a) / b; }
            : constant$3(b);
    }

    function deinterpolateClamp(deinterpolate) {
        return function(a, b) {
            var d = deinterpolate(a = +a, b = +b);
            return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
        };
    }

    function reinterpolateClamp(reinterpolate) {
        return function(a, b) {
            var r = reinterpolate(a = +a, b = +b);
            return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
        };
    }

    function bimap(domain, range, deinterpolate, reinterpolate) {
        var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
        if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
        else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
        return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, deinterpolate, reinterpolate) {
        var j = Math.min(domain.length, range.length) - 1,
            d = new Array(j),
            r = new Array(j),
            i = -1;

        // Reverse descending domains.
        if (domain[j] < domain[0]) {
            domain = domain.slice().reverse();
            range = range.slice().reverse();
        }

        while (++i < j) {
            d[i] = deinterpolate(domain[i], domain[i + 1]);
            r[i] = reinterpolate(range[i], range[i + 1]);
        }

        return function(x) {
            var i = bisectRight(domain, x, 1, j) - 1;
            return r[i](d[i](x));
        };
    }

    function copy(source, target) {
        return target
            .domain(source.domain())
            .range(source.range())
            .interpolate(source.interpolate())
            .clamp(source.clamp());
    }

    // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
    function continuous(deinterpolate$$, reinterpolate) {
        var domain = unit,
            range = unit,
            interpolate = interpolateValue,
            clamp = false,
            piecewise,
            output,
            input;

        function rescale() {
            piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
            output = input = null;
            return scale;
        }

        function scale(x) {
            return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate$$) : deinterpolate$$, interpolate)))(+x);
        }

        scale.invert = function(y) {
            return (input || (input = piecewise(range, domain, deinterpolate, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
        };

        scale.domain = function(_) {
            return arguments.length ? (domain = map$2.call(_, number$1), rescale()) : domain.slice();
        };

        scale.range = function(_) {
            return arguments.length ? (range = slice$1.call(_), rescale()) : range.slice();
        };

        scale.rangeRound = function(_) {
            return range = slice$1.call(_), interpolate = interpolateRound, rescale();
        };

        scale.clamp = function(_) {
            return arguments.length ? (clamp = !!_, rescale()) : clamp;
        };

        scale.interpolate = function(_) {
            return arguments.length ? (interpolate = _, rescale()) : interpolate;
        };

        return rescale();
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimal(1.23) returns ["123", 0].
    function formatDecimal(x, p) {
        if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
        var i, coefficient = x.slice(0, i);

        // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
        // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
        return [
            coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
            +x.slice(i + 1)
        ];
    }

    function exponent(x) {
        return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
        return function(value, width) {
            var i = value.length,
                t = [],
                j = 0,
                g = grouping[0],
                length = 0;

            while (i > 0 && g > 0) {
                if (length + g + 1 > width) g = Math.max(1, width - length);
                t.push(value.substring(i -= g, i + g));
                if ((length += g + 1) > width) break;
                g = grouping[j = (j + 1) % grouping.length];
            }

            return t.reverse().join(thousands);
        };
    }

    function formatNumerals(numerals) {
        return function(value) {
            return value.replace(/[0-9]/g, function(i) {
                return numerals[+i];
            });
        };
    }

    function formatDefault(x, p) {
        x = x.toPrecision(p);

        out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
            switch (x[i]) {
                case ".": i0 = i1 = i; break;
                case "0": if (i0 === 0) i0 = i; i1 = i; break;
                case "e": break out;
                default: if (i0 > 0) i0 = 0; break;
            }
        }

        return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
        var d = formatDecimal(x, p);
        if (!d) return x + "";
        var coefficient = d[0],
            exponent = d[1],
            i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
            n = coefficient.length;
        return i === n ? coefficient
            : i > n ? coefficient + new Array(i - n + 1).join("0")
                : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
                    : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
        var d = formatDecimal(x, p);
        if (!d) return x + "";
        var coefficient = d[0],
            exponent = d[1];
        return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
            : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
                : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
        "": formatDefault,
        "%": function(x, p) { return (x * 100).toFixed(p); },
        "b": function(x) { return Math.round(x).toString(2); },
        "c": function(x) { return x + ""; },
        "d": function(x) { return Math.round(x).toString(10); },
        "e": function(x, p) { return x.toExponential(p); },
        "f": function(x, p) { return x.toFixed(p); },
        "g": function(x, p) { return x.toPrecision(p); },
        "o": function(x) { return Math.round(x).toString(8); },
        "p": function(x, p) { return formatRounded(x * 100, p); },
        "r": formatRounded,
        "s": formatPrefixAuto,
        "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
        "x": function(x) { return Math.round(x).toString(16); }
    };

    // [[fill]align][sign][symbol][0][width][,][.precision][type]
    var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
        return new FormatSpecifier(specifier);
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
        if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

        var match,
            fill = match[1] || " ",
            align = match[2] || ">",
            sign = match[3] || "-",
            symbol = match[4] || "",
            zero = !!match[5],
            width = match[6] && +match[6],
            comma = !!match[7],
            precision = match[8] && +match[8].slice(1),
            type = match[9] || "";

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // Map invalid types to the default format.
        else if (!formatTypes[type]) type = "";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        this.fill = fill;
        this.align = align;
        this.sign = sign;
        this.symbol = symbol;
        this.zero = zero;
        this.width = width;
        this.comma = comma;
        this.precision = precision;
        this.type = type;
    }

    FormatSpecifier.prototype.toString = function() {
        return this.fill
            + this.align
            + this.sign
            + this.symbol
            + (this.zero ? "0" : "")
            + (this.width == null ? "" : Math.max(1, this.width | 0))
            + (this.comma ? "," : "")
            + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
            + this.type;
    };

    function identity$3(x) {
        return x;
    }

    var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
        var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
            currency = locale.currency,
            decimal = locale.decimal,
            numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$3,
            percent = locale.percent || "%";

        function newFormat(specifier) {
            specifier = formatSpecifier(specifier);

            var fill = specifier.fill,
                align = specifier.align,
                sign = specifier.sign,
                symbol = specifier.symbol,
                zero = specifier.zero,
                width = specifier.width,
                comma = specifier.comma,
                precision = specifier.precision,
                type = specifier.type;

            // Compute the prefix and suffix.
            // For SI-prefix, the suffix is lazily computed.
            var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
                suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

            // What format function should we use?
            // Is this an integer type?
            // Can this type generate exponential notation?
            var formatType = formatTypes[type],
                maybeSuffix = !type || /[defgprs%]/.test(type);

            // Set the default precision if not specified,
            // or clamp the specified precision to the supported range.
            // For significant precision, it must be in [1, 21].
            // For fixed precision, it must be in [0, 20].
            precision = precision == null ? (type ? 6 : 12)
                : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
                    : Math.max(0, Math.min(20, precision));

            function format(value) {
                var valuePrefix = prefix,
                    valueSuffix = suffix,
                    i, n, c;

                if (type === "c") {
                    valueSuffix = formatType(value) + valueSuffix;
                    value = "";
                } else {
                    value = +value;

                    // Perform the initial formatting.
                    var valueNegative = value < 0;
                    value = formatType(Math.abs(value), precision);

                    // If a negative value rounds to zero during formatting, treat as positive.
                    if (valueNegative && +value === 0) valueNegative = false;

                    // Compute the prefix and suffix.
                    valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
                    valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

                    // Break the formatted value into the integer “value” part that can be
                    // grouped, and fractional or exponential “suffix” part that is not.
                    if (maybeSuffix) {
                        i = -1, n = value.length;
                        while (++i < n) {
                            if (c = value.charCodeAt(i), 48 > c || c > 57) {
                                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                                value = value.slice(0, i);
                                break;
                            }
                        }
                    }
                }

                // If the fill character is not "0", grouping is applied before padding.
                if (comma && !zero) value = group(value, Infinity);

                // Compute the padding.
                var length = valuePrefix.length + value.length + valueSuffix.length,
                    padding = length < width ? new Array(width - length + 1).join(fill) : "";

                // If the fill character is "0", grouping is applied after padding.
                if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

                // Reconstruct the final output based on the desired alignment.
                switch (align) {
                    case "<": value = valuePrefix + value + valueSuffix + padding; break;
                    case "=": value = valuePrefix + padding + value + valueSuffix; break;
                    case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
                    default: value = padding + valuePrefix + value + valueSuffix; break;
                }

                return numerals(value);
            }

            format.toString = function() {
                return specifier + "";
            };

            return format;
        }

        function formatPrefix(specifier, value) {
            var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
                e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
                k = Math.pow(10, -e),
                prefix = prefixes[8 + e / 3];
            return function(value) {
                return f(k * value) + prefix;
            };
        }

        return {
            format: newFormat,
            formatPrefix: formatPrefix
        };
    }

    var locale;
    exports.format;
    exports.formatPrefix;

    defaultLocale({
        decimal: ".",
        thousands: ",",
        grouping: [3],
        currency: ["$", ""]
    });

    function defaultLocale(definition) {
        locale = formatLocale(definition);
        exports.format = locale.format;
        exports.formatPrefix = locale.formatPrefix;
        return locale;
    }

    function precisionFixed(step) {
        return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
        return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
        step = Math.abs(step), max = Math.abs(max) - step;
        return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(domain, count, specifier) {
        var start = domain[0],
            stop = domain[domain.length - 1],
            step = tickStep(start, stop, count == null ? 10 : count),
            precision;
        specifier = formatSpecifier(specifier == null ? ",f" : specifier);
        switch (specifier.type) {
            case "s": {
                var value = Math.max(Math.abs(start), Math.abs(stop));
                if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
                return exports.formatPrefix(specifier, value);
            }
            case "":
            case "e":
            case "g":
            case "p":
            case "r": {
                if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
                break;
            }
            case "f":
            case "%": {
                if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
                break;
            }
        }
        return exports.format(specifier);
    }

    function linearish(scale) {
        var domain = scale.domain;

        scale.ticks = function(count) {
            var d = domain();
            return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
        };

        scale.tickFormat = function(count, specifier) {
            return tickFormat(domain(), count, specifier);
        };

        scale.nice = function(count) {
            if (count == null) count = 10;

            var d = domain(),
                i0 = 0,
                i1 = d.length - 1,
                start = d[i0],
                stop = d[i1],
                step;

            if (stop < start) {
                step = start, start = stop, stop = step;
                step = i0, i0 = i1, i1 = step;
            }

            step = tickIncrement(start, stop, count);

            if (step > 0) {
                start = Math.floor(start / step) * step;
                stop = Math.ceil(stop / step) * step;
                step = tickIncrement(start, stop, count);
            } else if (step < 0) {
                start = Math.ceil(start * step) / step;
                stop = Math.floor(stop * step) / step;
                step = tickIncrement(start, stop, count);
            }

            if (step > 0) {
                d[i0] = Math.floor(start / step) * step;
                d[i1] = Math.ceil(stop / step) * step;
                domain(d);
            } else if (step < 0) {
                d[i0] = Math.ceil(start * step) / step;
                d[i1] = Math.floor(stop * step) / step;
                domain(d);
            }

            return scale;
        };

        return scale;
    }

    function linear() {
        var scale = continuous(deinterpolate, interpolateNumber);

        scale.copy = function() {
            return copy(scale, linear());
        };

        return linearish(scale);
    }

    function identity$1() {
        var domain = [0, 1];

        function scale(x) {
            return +x;
        }

        scale.invert = scale;

        scale.domain = scale.range = function(_) {
            return arguments.length ? (domain = map$2.call(_, number$1), scale) : domain.slice();
        };

        scale.copy = function() {
            return identity$1().domain(domain);
        };

        return linearish(scale);
    }

    function nice(domain, interval) {
        domain = domain.slice();

        var i0 = 0,
            i1 = domain.length - 1,
            x0 = domain[i0],
            x1 = domain[i1],
            t;

        if (x1 < x0) {
            t = i0, i0 = i1, i1 = t;
            t = x0, x0 = x1, x1 = t;
        }

        domain[i0] = interval.floor(x0);
        domain[i1] = interval.ceil(x1);
        return domain;
    }

    function deinterpolate$1(a, b) {
        return (b = Math.log(b / a))
            ? function(x) { return Math.log(x / a) / b; }
            : constant$3(b);
    }

    function reinterpolate(a, b) {
        return a < 0
            ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
            : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
    }

    function pow10(x) {
        return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
    }

    function powp(base) {
        return base === 10 ? pow10
            : base === Math.E ? Math.exp
                : function(x) { return Math.pow(base, x); };
    }

    function logp(base) {
        return base === Math.E ? Math.log
            : base === 10 && Math.log10
            || base === 2 && Math.log2
            || (base = Math.log(base), function(x) { return Math.log(x) / base; });
    }

    function reflect(f) {
        return function(x) {
            return -f(-x);
        };
    }

    function log() {
        var scale = continuous(deinterpolate$1, reinterpolate).domain([1, 10]),
            domain = scale.domain,
            base = 10,
            logs = logp(10),
            pows = powp(10);

        function rescale() {
            logs = logp(base), pows = powp(base);
            if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
            return scale;
        }

        scale.base = function(_) {
            return arguments.length ? (base = +_, rescale()) : base;
        };

        scale.domain = function(_) {
            return arguments.length ? (domain(_), rescale()) : domain();
        };

        scale.ticks = function(count) {
            var d = domain(),
                u = d[0],
                v = d[d.length - 1],
                r;

            if (r = v < u) i = u, u = v, v = i;

            var i = logs(u),
                j = logs(v),
                p,
                k,
                t,
                n = count == null ? 10 : +count,
                z = [];

            if (!(base % 1) && j - i < n) {
                i = Math.round(i) - 1, j = Math.round(j) + 1;
                if (u > 0) for (; i < j; ++i) {
                    for (k = 1, p = pows(i); k < base; ++k) {
                        t = p * k;
                        if (t < u) continue;
                        if (t > v) break;
                        z.push(t);
                    }
                } else for (; i < j; ++i) {
                    for (k = base - 1, p = pows(i); k >= 1; --k) {
                        t = p * k;
                        if (t < u) continue;
                        if (t > v) break;
                        z.push(t);
                    }
                }
            } else {
                z = ticks(i, j, Math.min(j - i, n)).map(pows);
            }

            return r ? z.reverse() : z;
        };

        scale.tickFormat = function(count, specifier) {
            if (specifier == null) specifier = base === 10 ? ".0e" : ",";
            if (typeof specifier !== "function") specifier = exports.format(specifier);
            if (count === Infinity) return specifier;
            if (count == null) count = 10;
            var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
            return function(d) {
                var i = d / pows(Math.round(logs(d)));
                if (i * base < base - 0.5) i *= base;
                return i <= k ? specifier(d) : "";
            };
        };

        scale.nice = function() {
            return domain(nice(domain(), {
                floor: function(x) { return pows(Math.floor(logs(x))); },
                ceil: function(x) { return pows(Math.ceil(logs(x))); }
            }));
        };

        scale.copy = function() {
            return copy(scale, log().base(base));
        };

        return scale;
    }

    function raise$1(x, exponent) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    }

    function pow() {
        var exponent = 1,
            scale = continuous(deinterpolate, reinterpolate),
            domain = scale.domain;

        function deinterpolate(a, b) {
            return (b = raise$1(b, exponent) - (a = raise$1(a, exponent)))
                ? function(x) { return (raise$1(x, exponent) - a) / b; }
                : constant$3(b);
        }

        function reinterpolate(a, b) {
            b = raise$1(b, exponent) - (a = raise$1(a, exponent));
            return function(t) { return raise$1(a + b * t, 1 / exponent); };
        }

        scale.exponent = function(_) {
            return arguments.length ? (exponent = +_, domain(domain())) : exponent;
        };

        scale.copy = function() {
            return copy(scale, pow().exponent(exponent));
        };

        return linearish(scale);
    }

    function sqrt() {
        return pow().exponent(0.5);
    }

    function quantile() {
        var domain = [],
            range = [],
            thresholds = [];

        function rescale() {
            var i = 0, n = Math.max(1, range.length);
            thresholds = new Array(n - 1);
            while (++i < n) thresholds[i - 1] = threshold(domain, i / n);
            return scale;
        }

        function scale(x) {
            if (!isNaN(x = +x)) return range[bisectRight(thresholds, x)];
        }

        scale.invertExtent = function(y) {
            var i = range.indexOf(y);
            return i < 0 ? [NaN, NaN] : [
                i > 0 ? thresholds[i - 1] : domain[0],
                i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
            ];
        };

        scale.domain = function(_) {
            if (!arguments.length) return domain.slice();
            domain = [];
            for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
            domain.sort(ascending$1);
            return rescale();
        };

        scale.range = function(_) {
            return arguments.length ? (range = slice$1.call(_), rescale()) : range.slice();
        };

        scale.quantiles = function() {
            return thresholds.slice();
        };

        scale.copy = function() {
            return quantile()
                .domain(domain)
                .range(range);
        };

        return scale;
    }

    function quantize$1() {
        var x0 = 0,
            x1 = 1,
            n = 1,
            domain = [0.5],
            range = [0, 1];

        function scale(x) {
            if (x <= x) return range[bisectRight(domain, x, 0, n)];
        }

        function rescale() {
            var i = -1;
            domain = new Array(n);
            while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
            return scale;
        }

        scale.domain = function(_) {
            return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
        };

        scale.range = function(_) {
            return arguments.length ? (n = (range = slice$1.call(_)).length - 1, rescale()) : range.slice();
        };

        scale.invertExtent = function(y) {
            var i = range.indexOf(y);
            return i < 0 ? [NaN, NaN]
                : i < 1 ? [x0, domain[0]]
                    : i >= n ? [domain[n - 1], x1]
                        : [domain[i - 1], domain[i]];
        };

        scale.copy = function() {
            return quantize$1()
                .domain([x0, x1])
                .range(range);
        };

        return linearish(scale);
    }

    function threshold$1() {
        var domain = [0.5],
            range = [0, 1],
            n = 1;

        function scale(x) {
            if (x <= x) return range[bisectRight(domain, x, 0, n)];
        }

        scale.domain = function(_) {
            return arguments.length ? (domain = slice$1.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
        };

        scale.range = function(_) {
            return arguments.length ? (range = slice$1.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
        };

        scale.invertExtent = function(y) {
            var i = range.indexOf(y);
            return [domain[i - 1], domain[i]];
        };

        scale.copy = function() {
            return threshold$1()
                .domain(domain)
                .range(range);
        };

        return scale;
    }

    var t0$1 = new Date;
    var t1$1 = new Date;
    function newInterval(floori, offseti, count, field) {

        function interval(date) {
            return floori(date = new Date(+date)), date;
        }

        interval.floor = interval;

        interval.ceil = function(date) {
            return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
        };

        interval.round = function(date) {
            var d0 = interval(date),
                d1 = interval.ceil(date);
            return date - d0 < d1 - date ? d0 : d1;
        };

        interval.offset = function(date, step) {
            return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
        };

        interval.range = function(start, stop, step) {
            var range = [];
            start = interval.ceil(start);
            step = step == null ? 1 : Math.floor(step);
            if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
            do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
            return range;
        };

        interval.filter = function(test) {
            return newInterval(function(date) {
                if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
            }, function(date, step) {
                if (date >= date) {
                    if (step < 0) while (++step <= 0) {
                        while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
                    } else while (--step >= 0) {
                        while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
                    }
                }
            });
        };

        if (count) {
            interval.count = function(start, end) {
                t0$1.setTime(+start), t1$1.setTime(+end);
                floori(t0$1), floori(t1$1);
                return Math.floor(count(t0$1, t1$1));
            };

            interval.every = function(step) {
                step = Math.floor(step);
                return !isFinite(step) || !(step > 0) ? null
                    : !(step > 1) ? interval
                        : interval.filter(field
                            ? function(d) { return field(d) % step === 0; }
                            : function(d) { return interval.count(0, d) % step === 0; });
            };
        }

        return interval;
    }

    var millisecond = newInterval(function() {
        // noop
    }, function(date, step) {
        date.setTime(+date + step);
    }, function(start, end) {
        return end - start;
    });

    // An optimized implementation for this simple case.
    millisecond.every = function(k) {
        k = Math.floor(k);
        if (!isFinite(k) || !(k > 0)) return null;
        if (!(k > 1)) return millisecond;
        return newInterval(function(date) {
            date.setTime(Math.floor(date / k) * k);
        }, function(date, step) {
            date.setTime(+date + step * k);
        }, function(start, end) {
            return (end - start) / k;
        });
    };

    var durationSecond$1 = 1e3;
    var durationMinute$1 = 6e4;
    var durationHour$1 = 36e5;
    var durationDay$1 = 864e5;
    var durationWeek$1 = 6048e5;

    var second = newInterval(function(date) {
        date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
    }, function(date, step) {
        date.setTime(+date + step * durationSecond$1);
    }, function(start, end) {
        return (end - start) / durationSecond$1;
    }, function(date) {
        return date.getUTCSeconds();
    });

    var minute = newInterval(function(date) {
        date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
    }, function(date, step) {
        date.setTime(+date + step * durationMinute$1);
    }, function(start, end) {
        return (end - start) / durationMinute$1;
    }, function(date) {
        return date.getMinutes();
    });

    var hour = newInterval(function(date) {
        var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
        if (offset < 0) offset += durationHour$1;
        date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
    }, function(date, step) {
        date.setTime(+date + step * durationHour$1);
    }, function(start, end) {
        return (end - start) / durationHour$1;
    }, function(date) {
        return date.getHours();
    });

    var day = newInterval(function(date) {
        date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setDate(date.getDate() + step);
    }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
    }, function(date) {
        return date.getDate() - 1;
    });

    function weekday(i) {
        return newInterval(function(date) {
            date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
            date.setHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setDate(date.getDate() + step * 7);
        }, function(start, end) {
            return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
        });
    }

    var timeSunday = weekday(0);
    var timeMonday = weekday(1);
    var timeThursday = weekday(4);

    var month = newInterval(function(date) {
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setMonth(date.getMonth() + step);
    }, function(start, end) {
        return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
    }, function(date) {
        return date.getMonth();
    });

    var year = newInterval(function(date) {
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
        return end.getFullYear() - start.getFullYear();
    }, function(date) {
        return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
        return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
            date.setFullYear(Math.floor(date.getFullYear() / k) * k);
            date.setMonth(0, 1);
            date.setHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setFullYear(date.getFullYear() + step * k);
        });
    };

    var utcMinute = newInterval(function(date) {
        date.setUTCSeconds(0, 0);
    }, function(date, step) {
        date.setTime(+date + step * durationMinute$1);
    }, function(start, end) {
        return (end - start) / durationMinute$1;
    }, function(date) {
        return date.getUTCMinutes();
    });

    var utcHour = newInterval(function(date) {
        date.setUTCMinutes(0, 0, 0);
    }, function(date, step) {
        date.setTime(+date + step * durationHour$1);
    }, function(start, end) {
        return (end - start) / durationHour$1;
    }, function(date) {
        return date.getUTCHours();
    });

    var utcDay = newInterval(function(date) {
        date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
        return (end - start) / durationDay$1;
    }, function(date) {
        return date.getUTCDate() - 1;
    });

    function utcWeekday(i) {
        return newInterval(function(date) {
            date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
            date.setUTCHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setUTCDate(date.getUTCDate() + step * 7);
        }, function(start, end) {
            return (end - start) / durationWeek$1;
        });
    }

    var utcWeek = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    var utcThursday = utcWeekday(4);

    var utcMonth = newInterval(function(date) {
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCMonth(date.getUTCMonth() + step);
    }, function(start, end) {
        return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
    }, function(date) {
        return date.getUTCMonth();
    });

    var utcYear = newInterval(function(date) {
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
        return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
        return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
        return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
            date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
            date.setUTCMonth(0, 1);
            date.setUTCHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setUTCFullYear(date.getUTCFullYear() + step * k);
        });
    };

    function localDate(d) {
        if (0 <= d.y && d.y < 100) {
            var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
            date.setFullYear(d.y);
            return date;
        }
        return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
        if (0 <= d.y && d.y < 100) {
            var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
            date.setUTCFullYear(d.y);
            return date;
        }
        return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newYear(y) {
        return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale$1(locale) {
        var locale_dateTime = locale.dateTime,
            locale_date = locale.date,
            locale_time = locale.time,
            locale_periods = locale.periods,
            locale_weekdays = locale.days,
            locale_shortWeekdays = locale.shortDays,
            locale_months = locale.months,
            locale_shortMonths = locale.shortMonths;

        var periodRe = formatRe(locale_periods),
            periodLookup = formatLookup(locale_periods),
            weekdayRe = formatRe(locale_weekdays),
            weekdayLookup = formatLookup(locale_weekdays),
            shortWeekdayRe = formatRe(locale_shortWeekdays),
            shortWeekdayLookup = formatLookup(locale_shortWeekdays),
            monthRe = formatRe(locale_months),
            monthLookup = formatLookup(locale_months),
            shortMonthRe = formatRe(locale_shortMonths),
            shortMonthLookup = formatLookup(locale_shortMonths);

        var formats = {
            "a": formatShortWeekday,
            "A": formatWeekday,
            "b": formatShortMonth,
            "B": formatMonth,
            "c": null,
            "d": formatDayOfMonth,
            "e": formatDayOfMonth,
            "f": formatMicroseconds,
            "H": formatHour24,
            "I": formatHour12,
            "j": formatDayOfYear,
            "L": formatMilliseconds,
            "m": formatMonthNumber,
            "M": formatMinutes,
            "p": formatPeriod,
            "Q": formatUnixTimestamp,
            "s": formatUnixTimestampSeconds,
            "S": formatSeconds,
            "u": formatWeekdayNumberMonday,
            "U": formatWeekNumberSunday,
            "V": formatWeekNumberISO,
            "w": formatWeekdayNumberSunday,
            "W": formatWeekNumberMonday,
            "x": null,
            "X": null,
            "y": formatYear,
            "Y": formatFullYear,
            "Z": formatZone,
            "%": formatLiteralPercent
        };

        var utcFormats = {
            "a": formatUTCShortWeekday,
            "A": formatUTCWeekday,
            "b": formatUTCShortMonth,
            "B": formatUTCMonth,
            "c": null,
            "d": formatUTCDayOfMonth,
            "e": formatUTCDayOfMonth,
            "f": formatUTCMicroseconds,
            "H": formatUTCHour24,
            "I": formatUTCHour12,
            "j": formatUTCDayOfYear,
            "L": formatUTCMilliseconds,
            "m": formatUTCMonthNumber,
            "M": formatUTCMinutes,
            "p": formatUTCPeriod,
            "Q": formatUnixTimestamp,
            "s": formatUnixTimestampSeconds,
            "S": formatUTCSeconds,
            "u": formatUTCWeekdayNumberMonday,
            "U": formatUTCWeekNumberSunday,
            "V": formatUTCWeekNumberISO,
            "w": formatUTCWeekdayNumberSunday,
            "W": formatUTCWeekNumberMonday,
            "x": null,
            "X": null,
            "y": formatUTCYear,
            "Y": formatUTCFullYear,
            "Z": formatUTCZone,
            "%": formatLiteralPercent
        };

        var parses = {
            "a": parseShortWeekday,
            "A": parseWeekday,
            "b": parseShortMonth,
            "B": parseMonth,
            "c": parseLocaleDateTime,
            "d": parseDayOfMonth,
            "e": parseDayOfMonth,
            "f": parseMicroseconds,
            "H": parseHour24,
            "I": parseHour24,
            "j": parseDayOfYear,
            "L": parseMilliseconds,
            "m": parseMonthNumber,
            "M": parseMinutes,
            "p": parsePeriod,
            "Q": parseUnixTimestamp,
            "s": parseUnixTimestampSeconds,
            "S": parseSeconds,
            "u": parseWeekdayNumberMonday,
            "U": parseWeekNumberSunday,
            "V": parseWeekNumberISO,
            "w": parseWeekdayNumberSunday,
            "W": parseWeekNumberMonday,
            "x": parseLocaleDate,
            "X": parseLocaleTime,
            "y": parseYear,
            "Y": parseFullYear,
            "Z": parseZone,
            "%": parseLiteralPercent
        };

        // These recursive directive definitions must be deferred.
        formats.x = newFormat(locale_date, formats);
        formats.X = newFormat(locale_time, formats);
        formats.c = newFormat(locale_dateTime, formats);
        utcFormats.x = newFormat(locale_date, utcFormats);
        utcFormats.X = newFormat(locale_time, utcFormats);
        utcFormats.c = newFormat(locale_dateTime, utcFormats);

        function newFormat(specifier, formats) {
            return function(date) {
                var string = [],
                    i = -1,
                    j = 0,
                    n = specifier.length,
                    c,
                    pad,
                    format;

                if (!(date instanceof Date)) date = new Date(+date);

                while (++i < n) {
                    if (specifier.charCodeAt(i) === 37) {
                        string.push(specifier.slice(j, i));
                        if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
                        else pad = c === "e" ? " " : "0";
                        if (format = formats[c]) c = format(date, pad);
                        string.push(c);
                        j = i + 1;
                    }
                }

                string.push(specifier.slice(j, i));
                return string.join("");
            };
        }

        function newParse(specifier, newDate) {
            return function(string) {
                var d = newYear(1900),
                    i = parseSpecifier(d, specifier, string += "", 0),
                    week, day$$;
                if (i != string.length) return null;

                // If a UNIX timestamp is specified, return it.
                if ("Q" in d) return new Date(d.Q);

                // The am-pm flag is 0 for AM, and 1 for PM.
                if ("p" in d) d.H = d.H % 12 + d.p * 12;

                // Convert day-of-week and week-of-year to day-of-year.
                if ("V" in d) {
                    if (d.V < 1 || d.V > 53) return null;
                    if (!("w" in d)) d.w = 1;
                    if ("Z" in d) {
                        week = utcDate(newYear(d.y)), day$$ = week.getUTCDay();
                        week = day$$ > 4 || day$$ === 0 ? utcMonday.ceil(week) : utcMonday(week);
                        week = utcDay.offset(week, (d.V - 1) * 7);
                        d.y = week.getUTCFullYear();
                        d.m = week.getUTCMonth();
                        d.d = week.getUTCDate() + (d.w + 6) % 7;
                    } else {
                        week = newDate(newYear(d.y)), day$$ = week.getDay();
                        week = day$$ > 4 || day$$ === 0 ? timeMonday.ceil(week) : timeMonday(week);
                        week = day.offset(week, (d.V - 1) * 7);
                        d.y = week.getFullYear();
                        d.m = week.getMonth();
                        d.d = week.getDate() + (d.w + 6) % 7;
                    }
                } else if ("W" in d || "U" in d) {
                    if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
                    day$$ = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
                    d.m = 0;
                    d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$ + 5) % 7 : d.w + d.U * 7 - (day$$ + 6) % 7;
                }

                // If a time zone is specified, all fields are interpreted as UTC and then
                // offset according to the specified time zone.
                if ("Z" in d) {
                    d.H += d.Z / 100 | 0;
                    d.M += d.Z % 100;
                    return utcDate(d);
                }

                // Otherwise, all fields are in local time.
                return newDate(d);
            };
        }

        function parseSpecifier(d, specifier, string, j) {
            var i = 0,
                n = specifier.length,
                m = string.length,
                c,
                parse;

            while (i < n) {
                if (j >= m) return -1;
                c = specifier.charCodeAt(i++);
                if (c === 37) {
                    c = specifier.charAt(i++);
                    parse = parses[c in pads ? specifier.charAt(i++) : c];
                    if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
                } else if (c != string.charCodeAt(j++)) {
                    return -1;
                }
            }

            return j;
        }

        function parsePeriod(d, string, i) {
            var n = periodRe.exec(string.slice(i));
            return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
        }

        function parseShortWeekday(d, string, i) {
            var n = shortWeekdayRe.exec(string.slice(i));
            return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
        }

        function parseWeekday(d, string, i) {
            var n = weekdayRe.exec(string.slice(i));
            return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
        }

        function parseShortMonth(d, string, i) {
            var n = shortMonthRe.exec(string.slice(i));
            return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
        }

        function parseMonth(d, string, i) {
            var n = monthRe.exec(string.slice(i));
            return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
        }

        function parseLocaleDateTime(d, string, i) {
            return parseSpecifier(d, locale_dateTime, string, i);
        }

        function parseLocaleDate(d, string, i) {
            return parseSpecifier(d, locale_date, string, i);
        }

        function parseLocaleTime(d, string, i) {
            return parseSpecifier(d, locale_time, string, i);
        }

        function formatShortWeekday(d) {
            return locale_shortWeekdays[d.getDay()];
        }

        function formatWeekday(d) {
            return locale_weekdays[d.getDay()];
        }

        function formatShortMonth(d) {
            return locale_shortMonths[d.getMonth()];
        }

        function formatMonth(d) {
            return locale_months[d.getMonth()];
        }

        function formatPeriod(d) {
            return locale_periods[+(d.getHours() >= 12)];
        }

        function formatUTCShortWeekday(d) {
            return locale_shortWeekdays[d.getUTCDay()];
        }

        function formatUTCWeekday(d) {
            return locale_weekdays[d.getUTCDay()];
        }

        function formatUTCShortMonth(d) {
            return locale_shortMonths[d.getUTCMonth()];
        }

        function formatUTCMonth(d) {
            return locale_months[d.getUTCMonth()];
        }

        function formatUTCPeriod(d) {
            return locale_periods[+(d.getUTCHours() >= 12)];
        }

        return {
            format: function(specifier) {
                var f = newFormat(specifier += "", formats);
                f.toString = function() { return specifier; };
                return f;
            },
            parse: function(specifier) {
                var p = newParse(specifier += "", localDate);
                p.toString = function() { return specifier; };
                return p;
            },
            utcFormat: function(specifier) {
                var f = newFormat(specifier += "", utcFormats);
                f.toString = function() { return specifier; };
                return f;
            },
            utcParse: function(specifier) {
                var p = newParse(specifier, utcDate);
                p.toString = function() { return specifier; };
                return p;
            }
        };
    }

    var pads = {"-": "", "_": " ", "0": "0"};
    var numberRe = /^\s*\d+/;
    var percentRe = /^%/;
    var requoteRe = /[\\^$*+?|[\]().{}]/g;
    function pad(value, fill, width) {
        var sign = value < 0 ? "-" : "",
            string = (sign ? -value : value) + "",
            length = string.length;
        return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
        return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
        return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
        var map = {}, i = -1, n = names.length;
        while (++i < n) map[names[i].toLowerCase()] = i;
        return map;
    }

    function parseWeekdayNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 4));
        return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
        var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
        return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 6));
        return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
        var n = percentRe.exec(string.slice(i, i + 1));
        return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
        return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
        return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
        return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
        return pad(1 + day.count(year(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
        return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
        return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
        return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
        return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
        return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
        var day = d.getDay();
        return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
        return pad(timeSunday.count(year(d), d), p, 2);
    }

    function formatWeekNumberISO(d, p) {
        var day = d.getDay();
        d = (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
        return pad(timeThursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
        return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
        return pad(timeMonday.count(year(d), d), p, 2);
    }

    function formatYear(d, p) {
        return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
        return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
        var z = d.getTimezoneOffset();
        return (z > 0 ? "-" : (z *= -1, "+"))
            + pad(z / 60 | 0, "0", 2)
            + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
        return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
        return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
        return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
        return pad(1 + utcDay.count(utcYear(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
        return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
        return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
        return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
        return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
        return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
        var dow = d.getUTCDay();
        return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
        return pad(utcWeek.count(utcYear(d), d), p, 2);
    }

    function formatUTCWeekNumberISO(d, p) {
        var day = d.getUTCDay();
        d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
        return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
        return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
        return pad(utcMonday.count(utcYear(d), d), p, 2);
    }

    function formatUTCYear(d, p) {
        return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
        return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
        return "+0000";
    }

    function formatLiteralPercent() {
        return "%";
    }

    function formatUnixTimestamp(d) {
        return +d;
    }

    function formatUnixTimestampSeconds(d) {
        return Math.floor(+d / 1000);
    }

    var locale$1;
    var timeFormat;
    var timeParse;
    var utcFormat;
    var utcParse;

    defaultLocale$1({
        dateTime: "%x, %X",
        date: "%-m/%-d/%Y",
        time: "%-I:%M:%S %p",
        periods: ["AM", "PM"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale$1(definition) {
        locale$1 = formatLocale$1(definition);
        timeFormat = locale$1.format;
        timeParse = locale$1.parse;
        utcFormat = locale$1.utcFormat;
        utcParse = locale$1.utcParse;
        return locale$1;
    }

    var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

    function formatIsoNative(date) {
        return date.toISOString();
    }

    var formatIso = Date.prototype.toISOString
        ? formatIsoNative
        : utcFormat(isoSpecifier);

    function parseIsoNative(string) {
        var date = new Date(string);
        return isNaN(date) ? null : date;
    }

    var parseIso = +new Date("2000-01-01T00:00:00.000Z")
        ? parseIsoNative
        : utcParse(isoSpecifier);

    var durationSecond = 1000;
    var durationMinute = durationSecond * 60;
    var durationHour = durationMinute * 60;
    var durationDay = durationHour * 24;
    var durationWeek = durationDay * 7;
    var durationMonth = durationDay * 30;
    var durationYear = durationDay * 365;
    function date$1(t) {
        return new Date(t);
    }

    function number$2(t) {
        return t instanceof Date ? +t : +new Date(+t);
    }

    function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
        var scale = continuous(deinterpolate, interpolateNumber),
            invert = scale.invert,
            domain = scale.domain;

        var formatMillisecond = format(".%L"),
            formatSecond = format(":%S"),
            formatMinute = format("%I:%M"),
            formatHour = format("%I %p"),
            formatDay = format("%a %d"),
            formatWeek = format("%b %d"),
            formatMonth = format("%B"),
            formatYear = format("%Y");

        var tickIntervals = [
            [second,  1,      durationSecond],
            [second,  5,  5 * durationSecond],
            [second, 15, 15 * durationSecond],
            [second, 30, 30 * durationSecond],
            [minute,  1,      durationMinute],
            [minute,  5,  5 * durationMinute],
            [minute, 15, 15 * durationMinute],
            [minute, 30, 30 * durationMinute],
            [  hour,  1,      durationHour  ],
            [  hour,  3,  3 * durationHour  ],
            [  hour,  6,  6 * durationHour  ],
            [  hour, 12, 12 * durationHour  ],
            [   day,  1,      durationDay   ],
            [   day,  2,  2 * durationDay   ],
            [  week,  1,      durationWeek  ],
            [ month,  1,      durationMonth ],
            [ month,  3,  3 * durationMonth ],
            [  year,  1,      durationYear  ]
        ];

        function tickFormat(date) {
            return (second(date) < date ? formatMillisecond
                : minute(date) < date ? formatSecond
                    : hour(date) < date ? formatMinute
                        : day(date) < date ? formatHour
                            : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
                                : year(date) < date ? formatMonth
                                    : formatYear)(date);
        }

        function tickInterval(interval, start, stop, step) {
            if (interval == null) interval = 10;

            // If a desired tick count is specified, pick a reasonable tick interval
            // based on the extent of the domain and a rough estimate of tick size.
            // Otherwise, assume interval is already a time interval and use it.
            if (typeof interval === "number") {
                var target = Math.abs(stop - start) / interval,
                    i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
                if (i === tickIntervals.length) {
                    step = tickStep(start / durationYear, stop / durationYear, interval);
                    interval = year;
                } else if (i) {
                    i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
                    step = i[1];
                    interval = i[0];
                } else {
                    step = tickStep(start, stop, interval);
                    interval = millisecond;
                }
            }

            return step == null ? interval : interval.every(step);
        }

        scale.invert = function(y) {
            return new Date(invert(y));
        };

        scale.domain = function(_) {
            return arguments.length ? domain(map$2.call(_, number$2)) : domain().map(date$1);
        };

        scale.ticks = function(interval, step) {
            var d = domain(),
                t0 = d[0],
                t1 = d[d.length - 1],
                r = t1 < t0,
                t;
            if (r) t = t0, t0 = t1, t1 = t;
            t = tickInterval(interval, t0, t1, step);
            t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
            return r ? t.reverse() : t;
        };

        scale.tickFormat = function(count, specifier) {
            return specifier == null ? tickFormat : format(specifier);
        };

        scale.nice = function(interval, step) {
            var d = domain();
            return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
                ? domain(nice(d, interval))
                : scale;
        };

        scale.copy = function() {
            return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
        };

        return scale;
    }

    function time() {
        return calendar(year, month, timeSunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
    }

    function utcTime() {
        return calendar(utcYear, utcMonth, utcWeek, utcDay, utcHour, utcMinute, second, millisecond, utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
    }

    function colors(s) {
        return s.match(/.{6}/g).map(function(x) {
            return "#" + x;
        });
    }

    var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

    var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

    var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

    var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

    function define$1(constructor, factory, prototype) {
        constructor.prototype = factory.prototype = prototype;
        prototype.constructor = constructor;
    }

    function extend$1(parent, definition) {
        var prototype = Object.create(parent.prototype);
        for (var key in definition) prototype[key] = definition[key];
        return prototype;
    }

    function Color$1() {}

    var darker$1 = 0.7;
    var brighter$1 = 1 / darker$1;

    var reI$1 = "\\s*([+-]?\\d+)\\s*";
    var reN$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
    var reP$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
    var reHex3$1 = /^#([0-9a-f]{3})$/;
    var reHex6$1 = /^#([0-9a-f]{6})$/;
    var reRgbInteger$1 = new RegExp("^rgb\\(" + [reI$1, reI$1, reI$1] + "\\)$");
    var reRgbPercent$1 = new RegExp("^rgb\\(" + [reP$1, reP$1, reP$1] + "\\)$");
    var reRgbaInteger$1 = new RegExp("^rgba\\(" + [reI$1, reI$1, reI$1, reN$1] + "\\)$");
    var reRgbaPercent$1 = new RegExp("^rgba\\(" + [reP$1, reP$1, reP$1, reN$1] + "\\)$");
    var reHslPercent$1 = new RegExp("^hsl\\(" + [reN$1, reP$1, reP$1] + "\\)$");
    var reHslaPercent$1 = new RegExp("^hsla\\(" + [reN$1, reP$1, reP$1, reN$1] + "\\)$");
    var named$1 = {
        aliceblue: 0xf0f8ff,
        antiquewhite: 0xfaebd7,
        aqua: 0x00ffff,
        aquamarine: 0x7fffd4,
        azure: 0xf0ffff,
        beige: 0xf5f5dc,
        bisque: 0xffe4c4,
        black: 0x000000,
        blanchedalmond: 0xffebcd,
        blue: 0x0000ff,
        blueviolet: 0x8a2be2,
        brown: 0xa52a2a,
        burlywood: 0xdeb887,
        cadetblue: 0x5f9ea0,
        chartreuse: 0x7fff00,
        chocolate: 0xd2691e,
        coral: 0xff7f50,
        cornflowerblue: 0x6495ed,
        cornsilk: 0xfff8dc,
        crimson: 0xdc143c,
        cyan: 0x00ffff,
        darkblue: 0x00008b,
        darkcyan: 0x008b8b,
        darkgoldenrod: 0xb8860b,
        darkgray: 0xa9a9a9,
        darkgreen: 0x006400,
        darkgrey: 0xa9a9a9,
        darkkhaki: 0xbdb76b,
        darkmagenta: 0x8b008b,
        darkolivegreen: 0x556b2f,
        darkorange: 0xff8c00,
        darkorchid: 0x9932cc,
        darkred: 0x8b0000,
        darksalmon: 0xe9967a,
        darkseagreen: 0x8fbc8f,
        darkslateblue: 0x483d8b,
        darkslategray: 0x2f4f4f,
        darkslategrey: 0x2f4f4f,
        darkturquoise: 0x00ced1,
        darkviolet: 0x9400d3,
        deeppink: 0xff1493,
        deepskyblue: 0x00bfff,
        dimgray: 0x696969,
        dimgrey: 0x696969,
        dodgerblue: 0x1e90ff,
        firebrick: 0xb22222,
        floralwhite: 0xfffaf0,
        forestgreen: 0x228b22,
        fuchsia: 0xff00ff,
        gainsboro: 0xdcdcdc,
        ghostwhite: 0xf8f8ff,
        gold: 0xffd700,
        goldenrod: 0xdaa520,
        gray: 0x808080,
        green: 0x008000,
        greenyellow: 0xadff2f,
        grey: 0x808080,
        honeydew: 0xf0fff0,
        hotpink: 0xff69b4,
        indianred: 0xcd5c5c,
        indigo: 0x4b0082,
        ivory: 0xfffff0,
        khaki: 0xf0e68c,
        lavender: 0xe6e6fa,
        lavenderblush: 0xfff0f5,
        lawngreen: 0x7cfc00,
        lemonchiffon: 0xfffacd,
        lightblue: 0xadd8e6,
        lightcoral: 0xf08080,
        lightcyan: 0xe0ffff,
        lightgoldenrodyellow: 0xfafad2,
        lightgray: 0xd3d3d3,
        lightgreen: 0x90ee90,
        lightgrey: 0xd3d3d3,
        lightpink: 0xffb6c1,
        lightsalmon: 0xffa07a,
        lightseagreen: 0x20b2aa,
        lightskyblue: 0x87cefa,
        lightslategray: 0x778899,
        lightslategrey: 0x778899,
        lightsteelblue: 0xb0c4de,
        lightyellow: 0xffffe0,
        lime: 0x00ff00,
        limegreen: 0x32cd32,
        linen: 0xfaf0e6,
        magenta: 0xff00ff,
        maroon: 0x800000,
        mediumaquamarine: 0x66cdaa,
        mediumblue: 0x0000cd,
        mediumorchid: 0xba55d3,
        mediumpurple: 0x9370db,
        mediumseagreen: 0x3cb371,
        mediumslateblue: 0x7b68ee,
        mediumspringgreen: 0x00fa9a,
        mediumturquoise: 0x48d1cc,
        mediumvioletred: 0xc71585,
        midnightblue: 0x191970,
        mintcream: 0xf5fffa,
        mistyrose: 0xffe4e1,
        moccasin: 0xffe4b5,
        navajowhite: 0xffdead,
        navy: 0x000080,
        oldlace: 0xfdf5e6,
        olive: 0x808000,
        olivedrab: 0x6b8e23,
        orange: 0xffa500,
        orangered: 0xff4500,
        orchid: 0xda70d6,
        palegoldenrod: 0xeee8aa,
        palegreen: 0x98fb98,
        paleturquoise: 0xafeeee,
        palevioletred: 0xdb7093,
        papayawhip: 0xffefd5,
        peachpuff: 0xffdab9,
        peru: 0xcd853f,
        pink: 0xffc0cb,
        plum: 0xdda0dd,
        powderblue: 0xb0e0e6,
        purple: 0x800080,
        rebeccapurple: 0x663399,
        red: 0xff0000,
        rosybrown: 0xbc8f8f,
        royalblue: 0x4169e1,
        saddlebrown: 0x8b4513,
        salmon: 0xfa8072,
        sandybrown: 0xf4a460,
        seagreen: 0x2e8b57,
        seashell: 0xfff5ee,
        sienna: 0xa0522d,
        silver: 0xc0c0c0,
        skyblue: 0x87ceeb,
        slateblue: 0x6a5acd,
        slategray: 0x708090,
        slategrey: 0x708090,
        snow: 0xfffafa,
        springgreen: 0x00ff7f,
        steelblue: 0x4682b4,
        tan: 0xd2b48c,
        teal: 0x008080,
        thistle: 0xd8bfd8,
        tomato: 0xff6347,
        turquoise: 0x40e0d0,
        violet: 0xee82ee,
        wheat: 0xf5deb3,
        white: 0xffffff,
        whitesmoke: 0xf5f5f5,
        yellow: 0xffff00,
        yellowgreen: 0x9acd32
    };

    define$1(Color$1, color$1, {
        displayable: function() {
            return this.rgb().displayable();
        },
        toString: function() {
            return this.rgb() + "";
        }
    });

    function color$1(format) {
        var m;
        format = (format + "").trim().toLowerCase();
        return (m = reHex3$1.exec(format)) ? (m = parseInt(m[1], 16), new Rgb$1((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
            : (m = reHex6$1.exec(format)) ? rgbn$1(parseInt(m[1], 16)) // #ff0000
                : (m = reRgbInteger$1.exec(format)) ? new Rgb$1(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
                    : (m = reRgbPercent$1.exec(format)) ? new Rgb$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
                        : (m = reRgbaInteger$1.exec(format)) ? rgba$1(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
                            : (m = reRgbaPercent$1.exec(format)) ? rgba$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
                                : (m = reHslPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
                                    : (m = reHslaPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
                                        : named$1.hasOwnProperty(format) ? rgbn$1(named$1[format])
                                            : format === "transparent" ? new Rgb$1(NaN, NaN, NaN, 0)
                                                : null;
    }

    function rgbn$1(n) {
        return new Rgb$1(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba$1(r, g, b, a) {
        if (a <= 0) r = g = b = NaN;
        return new Rgb$1(r, g, b, a);
    }

    function rgbConvert$1(o) {
        if (!(o instanceof Color$1)) o = color$1(o);
        if (!o) return new Rgb$1;
        o = o.rgb();
        return new Rgb$1(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
        return arguments.length === 1 ? rgbConvert$1(r) : new Rgb$1(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb$1(r, g, b, opacity) {
        this.r = +r;
        this.g = +g;
        this.b = +b;
        this.opacity = +opacity;
    }

    define$1(Rgb$1, rgb, extend$1(Color$1, {
        brighter: function(k) {
            k = k == null ? brighter$1 : Math.pow(brighter$1, k);
            return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker$1 : Math.pow(darker$1, k);
            return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        rgb: function() {
            return this;
        },
        displayable: function() {
            return (0 <= this.r && this.r <= 255)
                && (0 <= this.g && this.g <= 255)
                && (0 <= this.b && this.b <= 255)
                && (0 <= this.opacity && this.opacity <= 1);
        },
        toString: function() {
            var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
            return (a === 1 ? "rgb(" : "rgba(")
                + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
                + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
                + Math.max(0, Math.min(255, Math.round(this.b) || 0))
                + (a === 1 ? ")" : ", " + a + ")");
        }
    }));

    function hsla$1(h, s, l, a) {
        if (a <= 0) h = s = l = NaN;
        else if (l <= 0 || l >= 1) h = s = NaN;
        else if (s <= 0) h = NaN;
        return new Hsl$1(h, s, l, a);
    }

    function hslConvert$1(o) {
        if (o instanceof Hsl$1) return new Hsl$1(o.h, o.s, o.l, o.opacity);
        if (!(o instanceof Color$1)) o = color$1(o);
        if (!o) return new Hsl$1;
        if (o instanceof Hsl$1) return o;
        o = o.rgb();
        var r = o.r / 255,
            g = o.g / 255,
            b = o.b / 255,
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            h = NaN,
            s = max - min,
            l = (max + min) / 2;
        if (s) {
            if (r === max) h = (g - b) / s + (g < b) * 6;
            else if (g === max) h = (b - r) / s + 2;
            else h = (r - g) / s + 4;
            s /= l < 0.5 ? max + min : 2 - max - min;
            h *= 60;
        } else {
            s = l > 0 && l < 1 ? 0 : h;
        }
        return new Hsl$1(h, s, l, o.opacity);
    }

    function hsl$2(h, s, l, opacity) {
        return arguments.length === 1 ? hslConvert$1(h) : new Hsl$1(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl$1(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    }

    define$1(Hsl$1, hsl$2, extend$1(Color$1, {
        brighter: function(k) {
            k = k == null ? brighter$1 : Math.pow(brighter$1, k);
            return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker$1 : Math.pow(darker$1, k);
            return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = this.h % 360 + (this.h < 0) * 360,
                s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
                l = this.l,
                m2 = l + (l < 0.5 ? l : 1 - l) * s,
                m1 = 2 * l - m2;
            return new Rgb$1(
                hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
                hsl2rgb$1(h, m1, m2),
                hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
                this.opacity
            );
        },
        displayable: function() {
            return (0 <= this.s && this.s <= 1 || isNaN(this.s))
                && (0 <= this.l && this.l <= 1)
                && (0 <= this.opacity && this.opacity <= 1);
        }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb$1(h, m1, m2) {
        return (h < 60 ? m1 + (m2 - m1) * h / 60
                : h < 180 ? m2
                    : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
                        : m1) * 255;
    }

    var deg2rad$1 = Math.PI / 180;
    var rad2deg$1 = 180 / Math.PI;

    var Kn$1 = 18;
    var Xn$1 = 0.950470;
    var Yn$1 = 1;
    var Zn$1 = 1.088830;
    var t0$2 = 4 / 29;
    var t1$2 = 6 / 29;
    var t2$1 = 3 * t1$2 * t1$2;
    var t3$1 = t1$2 * t1$2 * t1$2;
    function labConvert$1(o) {
        if (o instanceof Lab$1) return new Lab$1(o.l, o.a, o.b, o.opacity);
        if (o instanceof Hcl$1) {
            var h = o.h * deg2rad$1;
            return new Lab$1(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
        }
        if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
        var b = rgb2xyz$1(o.r),
            a = rgb2xyz$1(o.g),
            l = rgb2xyz$1(o.b),
            x = xyz2lab$1((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn$1),
            y = xyz2lab$1((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn$1),
            z = xyz2lab$1((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn$1);
        return new Lab$1(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab$2(l, a, b, opacity) {
        return arguments.length === 1 ? labConvert$1(l) : new Lab$1(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab$1(l, a, b, opacity) {
        this.l = +l;
        this.a = +a;
        this.b = +b;
        this.opacity = +opacity;
    }

    define$1(Lab$1, lab$2, extend$1(Color$1, {
        brighter: function(k) {
            return new Lab$1(this.l + Kn$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
        },
        darker: function(k) {
            return new Lab$1(this.l - Kn$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
        },
        rgb: function() {
            var y = (this.l + 16) / 116,
                x = isNaN(this.a) ? y : y + this.a / 500,
                z = isNaN(this.b) ? y : y - this.b / 200;
            y = Yn$1 * lab2xyz$1(y);
            x = Xn$1 * lab2xyz$1(x);
            z = Zn$1 * lab2xyz$1(z);
            return new Rgb$1(
                xyz2rgb$1( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
                xyz2rgb$1(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
                xyz2rgb$1( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
                this.opacity
            );
        }
    }));

    function xyz2lab$1(t) {
        return t > t3$1 ? Math.pow(t, 1 / 3) : t / t2$1 + t0$2;
    }

    function lab2xyz$1(t) {
        return t > t1$2 ? t * t * t : t2$1 * (t - t0$2);
    }

    function xyz2rgb$1(x) {
        return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2xyz$1(x) {
        return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert$1(o) {
        if (o instanceof Hcl$1) return new Hcl$1(o.h, o.c, o.l, o.opacity);
        if (!(o instanceof Lab$1)) o = labConvert$1(o);
        var h = Math.atan2(o.b, o.a) * rad2deg$1;
        return new Hcl$1(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function hcl$2(h, c, l, opacity) {
        return arguments.length === 1 ? hclConvert$1(h) : new Hcl$1(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl$1(h, c, l, opacity) {
        this.h = +h;
        this.c = +c;
        this.l = +l;
        this.opacity = +opacity;
    }

    define$1(Hcl$1, hcl$2, extend$1(Color$1, {
        brighter: function(k) {
            return new Hcl$1(this.h, this.c, this.l + Kn$1 * (k == null ? 1 : k), this.opacity);
        },
        darker: function(k) {
            return new Hcl$1(this.h, this.c, this.l - Kn$1 * (k == null ? 1 : k), this.opacity);
        },
        rgb: function() {
            return labConvert$1(this).rgb();
        }
    }));

    var A$1 = -0.14861;
    var B$1 = +1.78277;
    var C$1 = -0.29227;
    var D$1 = -0.90649;
    var E$1 = +1.97294;
    var ED$1 = E$1 * D$1;
    var EB$1 = E$1 * B$1;
    var BC_DA$1 = B$1 * C$1 - D$1 * A$1;
    function cubehelixConvert$1(o) {
        if (o instanceof Cubehelix$1) return new Cubehelix$1(o.h, o.s, o.l, o.opacity);
        if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
        var r = o.r / 255,
            g = o.g / 255,
            b = o.b / 255,
            l = (BC_DA$1 * b + ED$1 * r - EB$1 * g) / (BC_DA$1 + ED$1 - EB$1),
            bl = b - l,
            k = (E$1 * (g - l) - C$1 * bl) / D$1,
            s = Math.sqrt(k * k + bl * bl) / (E$1 * l * (1 - l)), // NaN if l=0 or l=1
            h = s ? Math.atan2(k, bl) * rad2deg$1 - 120 : NaN;
        return new Cubehelix$1(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix$4(h, s, l, opacity) {
        return arguments.length === 1 ? cubehelixConvert$1(h) : new Cubehelix$1(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix$1(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    }

    define$1(Cubehelix$1, cubehelix$4, extend$1(Color$1, {
        brighter: function(k) {
            k = k == null ? brighter$1 : Math.pow(brighter$1, k);
            return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker$1 : Math.pow(darker$1, k);
            return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad$1,
                l = +this.l,
                a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
                cosh = Math.cos(h),
                sinh = Math.sin(h);
            return new Rgb$1(
                255 * (l + a * (A$1 * cosh + B$1 * sinh)),
                255 * (l + a * (C$1 * cosh + D$1 * sinh)),
                255 * (l + a * (E$1 * cosh)),
                this.opacity
            );
        }
    }));

    var cubehelix$3 = interpolateCubehelixLong(cubehelix$4(300, 0.5, 0.0), cubehelix$4(-240, 0.5, 1.0));

    var warm = interpolateCubehelixLong(cubehelix$4(-100, 0.75, 0.35), cubehelix$4(80, 1.50, 0.8));

    var cool = interpolateCubehelixLong(cubehelix$4(260, 0.75, 0.35), cubehelix$4(80, 1.50, 0.8));

    var rainbow = cubehelix$4();

    function rainbow$1(t) {
        if (t < 0 || t > 1) t -= Math.floor(t);
        var ts = Math.abs(t - 0.5);
        rainbow.h = 360 * t - 100;
        rainbow.s = 1.5 - 1.5 * ts;
        rainbow.l = 0.8 - 0.9 * ts;
        return rainbow + "";
    }

    function ramp(range) {
        var n = range.length;
        return function(t) {
            return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
        };
    }

    var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

    var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

    var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

    var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

    function sequential(interpolator) {
        var x0 = 0,
            x1 = 1,
            clamp = false;

        function scale(x) {
            var t = (x - x0) / (x1 - x0);
            return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
        }

        scale.domain = function(_) {
            return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
        };

        scale.clamp = function(_) {
            return arguments.length ? (clamp = !!_, scale) : clamp;
        };

        scale.interpolator = function(_) {
            return arguments.length ? (interpolator = _, scale) : interpolator;
        };

        scale.copy = function() {
            return sequential(interpolator).domain([x0, x1]).clamp(clamp);
        };

        return linearish(scale);
    }

    var pi = Math.PI;
    var tau = 2 * pi;
    var epsilon = 1e-6;
    var tauEpsilon = tau - epsilon;
    function Path() {
        this._x0 = this._y0 = // start of current subpath
            this._x1 = this._y1 = null; // end of current subpath
        this._ = "";
    }

    function path() {
        return new Path;
    }

    Path.prototype = path.prototype = {
        constructor: Path,
        moveTo: function(x, y) {
            this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
        },
        closePath: function() {
            if (this._x1 !== null) {
                this._x1 = this._x0, this._y1 = this._y0;
                this._ += "Z";
            }
        },
        lineTo: function(x, y) {
            this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
        },
        quadraticCurveTo: function(x1, y1, x, y) {
            this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
        },
        bezierCurveTo: function(x1, y1, x2, y2, x, y) {
            this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
        },
        arcTo: function(x1, y1, x2, y2, r) {
            x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
            var x0 = this._x1,
                y0 = this._y1,
                x21 = x2 - x1,
                y21 = y2 - y1,
                x01 = x0 - x1,
                y01 = y0 - y1,
                l01_2 = x01 * x01 + y01 * y01;

            // Is the radius negative? Error.
            if (r < 0) throw new Error("negative radius: " + r);

            // Is this path empty? Move to (x1,y1).
            if (this._x1 === null) {
                this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
            }

            // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
            else if (!(l01_2 > epsilon)) {}

            // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
            // Equivalently, is (x1,y1) coincident with (x2,y2)?
            // Or, is the radius zero? Line to (x1,y1).
            else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
                this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
            }

            // Otherwise, draw an arc!
            else {
                var x20 = x2 - x0,
                    y20 = y2 - y0,
                    l21_2 = x21 * x21 + y21 * y21,
                    l20_2 = x20 * x20 + y20 * y20,
                    l21 = Math.sqrt(l21_2),
                    l01 = Math.sqrt(l01_2),
                    l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                    t01 = l / l01,
                    t21 = l / l21;

                // If the start tangent is not coincident with (x0,y0), line to.
                if (Math.abs(t01 - 1) > epsilon) {
                    this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
                }

                this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
            }
        },
        arc: function(x, y, r, a0, a1, ccw) {
            x = +x, y = +y, r = +r;
            var dx = r * Math.cos(a0),
                dy = r * Math.sin(a0),
                x0 = x + dx,
                y0 = y + dy,
                cw = 1 ^ ccw,
                da = ccw ? a0 - a1 : a1 - a0;

            // Is the radius negative? Error.
            if (r < 0) throw new Error("negative radius: " + r);

            // Is this path empty? Move to (x0,y0).
            if (this._x1 === null) {
                this._ += "M" + x0 + "," + y0;
            }

            // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
            else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
                this._ += "L" + x0 + "," + y0;
            }

            // Is this arc empty? We’re done.
            if (!r) return;

            // Does the angle go the wrong way? Flip the direction.
            if (da < 0) da = da % tau + tau;

            // Is this a complete circle? Draw two arcs to complete the circle.
            if (da > tauEpsilon) {
                this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
            }

            // Is this arc non-empty? Draw an arc!
            else if (da > epsilon) {
                this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
            }
        },
        rect: function(x, y, w, h) {
            this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
        },
        toString: function() {
            return this._;
        }
    };

    function constant$4(x) {
        return function constant() {
            return x;
        };
    }

    var abs = Math.abs;
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var max$1 = Math.max;
    var min$1 = Math.min;
    var sin = Math.sin;
    var sqrt$1 = Math.sqrt;

    var epsilon$1 = 1e-12;
    var pi$1 = Math.PI;
    var halfPi = pi$1 / 2;
    var tau$1 = 2 * pi$1;

    function acos(x) {
        return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
    }

    function asin(x) {
        return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
    }

    function arcInnerRadius(d) {
        return d.innerRadius;
    }

    function arcOuterRadius(d) {
        return d.outerRadius;
    }

    function arcStartAngle(d) {
        return d.startAngle;
    }

    function arcEndAngle(d) {
        return d.endAngle;
    }

    function arcPadAngle(d) {
        return d && d.padAngle; // Note: optional!
    }

    function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
        var x10 = x1 - x0, y10 = y1 - y0,
            x32 = x3 - x2, y32 = y3 - y2,
            t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
        return [x0 + t * x10, y0 + t * y10];
    }

    // Compute perpendicular offset line of length rc.
    // http://mathworld.wolfram.com/Circle-LineIntersection.html
    function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
        var x01 = x0 - x1,
            y01 = y0 - y1,
            lo = (cw ? rc : -rc) / sqrt$1(x01 * x01 + y01 * y01),
            ox = lo * y01,
            oy = -lo * x01,
            x11 = x0 + ox,
            y11 = y0 + oy,
            x10 = x1 + ox,
            y10 = y1 + oy,
            x00 = (x11 + x10) / 2,
            y00 = (y11 + y10) / 2,
            dx = x10 - x11,
            dy = y10 - y11,
            d2 = dx * dx + dy * dy,
            r = r1 - rc,
            D = x11 * y10 - x10 * y11,
            d = (dy < 0 ? -1 : 1) * sqrt$1(max$1(0, r * r * d2 - D * D)),
            cx0 = (D * dy - dx * d) / d2,
            cy0 = (-D * dx - dy * d) / d2,
            cx1 = (D * dy + dx * d) / d2,
            cy1 = (-D * dx + dy * d) / d2,
            dx0 = cx0 - x00,
            dy0 = cy0 - y00,
            dx1 = cx1 - x00,
            dy1 = cy1 - y00;

        // Pick the closer of the two intersection points.
        // TODO Is there a faster way to determine which intersection to use?
        if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

        return {
            cx: cx0,
            cy: cy0,
            x01: -ox,
            y01: -oy,
            x11: cx0 * (r1 / r - 1),
            y11: cy0 * (r1 / r - 1)
        };
    }

    function arc() {
        var innerRadius = arcInnerRadius,
            outerRadius = arcOuterRadius,
            cornerRadius = constant$4(0),
            padRadius = null,
            startAngle = arcStartAngle,
            endAngle = arcEndAngle,
            padAngle = arcPadAngle,
            context = null;

        function arc() {
            var buffer,
                r,
                r0 = +innerRadius.apply(this, arguments),
                r1 = +outerRadius.apply(this, arguments),
                a0 = startAngle.apply(this, arguments) - halfPi,
                a1 = endAngle.apply(this, arguments) - halfPi,
                da = abs(a1 - a0),
                cw = a1 > a0;

            if (!context) context = buffer = path();

            // Ensure that the outer radius is always larger than the inner radius.
            if (r1 < r0) r = r1, r1 = r0, r0 = r;

            // Is it a point?
            if (!(r1 > epsilon$1)) context.moveTo(0, 0);

            // Or is it a circle or annulus?
            else if (da > tau$1 - epsilon$1) {
                context.moveTo(r1 * cos(a0), r1 * sin(a0));
                context.arc(0, 0, r1, a0, a1, !cw);
                if (r0 > epsilon$1) {
                    context.moveTo(r0 * cos(a1), r0 * sin(a1));
                    context.arc(0, 0, r0, a1, a0, cw);
                }
            }

            // Or is it a circular or annular sector?
            else {
                var a01 = a0,
                    a11 = a1,
                    a00 = a0,
                    a10 = a1,
                    da0 = da,
                    da1 = da,
                    ap = padAngle.apply(this, arguments) / 2,
                    rp = (ap > epsilon$1) && (padRadius ? +padRadius.apply(this, arguments) : sqrt$1(r0 * r0 + r1 * r1)),
                    rc = min$1(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
                    rc0 = rc,
                    rc1 = rc,
                    t0,
                    t1;

                // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
                if (rp > epsilon$1) {
                    var p0 = asin(rp / r0 * sin(ap)),
                        p1 = asin(rp / r1 * sin(ap));
                    if ((da0 -= p0 * 2) > epsilon$1) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
                    else da0 = 0, a00 = a10 = (a0 + a1) / 2;
                    if ((da1 -= p1 * 2) > epsilon$1) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
                    else da1 = 0, a01 = a11 = (a0 + a1) / 2;
                }

                var x01 = r1 * cos(a01),
                    y01 = r1 * sin(a01),
                    x10 = r0 * cos(a10),
                    y10 = r0 * sin(a10);

                // Apply rounded corners?
                if (rc > epsilon$1) {
                    var x11 = r1 * cos(a11),
                        y11 = r1 * sin(a11),
                        x00 = r0 * cos(a00),
                        y00 = r0 * sin(a00);

                    // Restrict the corner radius according to the sector angle.
                    if (da < pi$1) {
                        var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                            ax = x01 - oc[0],
                            ay = y01 - oc[1],
                            bx = x11 - oc[0],
                            by = y11 - oc[1],
                            kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt$1(ax * ax + ay * ay) * sqrt$1(bx * bx + by * by))) / 2),
                            lc = sqrt$1(oc[0] * oc[0] + oc[1] * oc[1]);
                        rc0 = min$1(rc, (r0 - lc) / (kc - 1));
                        rc1 = min$1(rc, (r1 - lc) / (kc + 1));
                    }
                }

                // Is the sector collapsed to a line?
                if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

                // Does the sector’s outer ring have rounded corners?
                else if (rc1 > epsilon$1) {
                    t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
                    t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

                    context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

                    // Have the corners merged?
                    if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

                    // Otherwise, draw the two corners and the ring.
                    else {
                        context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
                        context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                        context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
                    }
                }

                // Or is the outer ring just a circular arc?
                else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

                // Is there no inner ring, and it’s a circular sector?
                // Or perhaps it’s an annular sector collapsed due to padding?
                if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

                // Does the sector’s inner ring (or point) have rounded corners?
                else if (rc0 > epsilon$1) {
                    t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
                    t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

                    context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

                    // Have the corners merged?
                    if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

                    // Otherwise, draw the two corners and the ring.
                    else {
                        context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
                        context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                        context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
                    }
                }

                // Or is the inner ring just a circular arc?
                else context.arc(0, 0, r0, a10, a00, cw);
            }

            context.closePath();

            if (buffer) return context = null, buffer + "" || null;
        }

        arc.centroid = function() {
            var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
                a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
            return [cos(a) * r, sin(a) * r];
        };

        arc.innerRadius = function(_) {
            return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : innerRadius;
        };

        arc.outerRadius = function(_) {
            return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : outerRadius;
        };

        arc.cornerRadius = function(_) {
            return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : cornerRadius;
        };

        arc.padRadius = function(_) {
            return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), arc) : padRadius;
        };

        arc.startAngle = function(_) {
            return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : startAngle;
        };

        arc.endAngle = function(_) {
            return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : endAngle;
        };

        arc.padAngle = function(_) {
            return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : padAngle;
        };

        arc.context = function(_) {
            return arguments.length ? ((context = _ == null ? null : _), arc) : context;
        };

        return arc;
    }

    function Linear(context) {
        this._context = context;
    }

    Linear.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._point = 0;
        },
        lineEnd: function() {
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                case 1: this._point = 2; // proceed
                default: this._context.lineTo(x, y); break;
            }
        }
    };

    function curveLinear(context) {
        return new Linear(context);
    }

    function pointX(p) {
        return p[0];
    }

    function pointY(p) {
        return p[1];
    }

    function line() {
        var x = pointX,
            y = pointY,
            defined = constant$4(true),
            context = null,
            curve = curveLinear,
            output = null;

        function line(data) {
            var i,
                n = data.length,
                d,
                defined0 = false,
                buffer;

            if (context == null) output = curve(buffer = path());

            for (i = 0; i <= n; ++i) {
                if (!(i < n && defined(d = data[i], i, data)) === defined0) {
                    if (defined0 = !defined0) output.lineStart();
                    else output.lineEnd();
                }
                if (defined0) output.point(+x(d, i, data), +y(d, i, data));
            }

            if (buffer) return output = null, buffer + "" || null;
        }

        line.x = function(_) {
            return arguments.length ? (x = typeof _ === "function" ? _ : constant$4(+_), line) : x;
        };

        line.y = function(_) {
            return arguments.length ? (y = typeof _ === "function" ? _ : constant$4(+_), line) : y;
        };

        line.defined = function(_) {
            return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), line) : defined;
        };

        line.curve = function(_) {
            return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
        };

        line.context = function(_) {
            return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
        };

        return line;
    }

    function area() {
        var x0 = pointX,
            x1 = null,
            y0 = constant$4(0),
            y1 = pointY,
            defined = constant$4(true),
            context = null,
            curve = curveLinear,
            output = null;

        function area(data) {
            var i,
                j,
                k,
                n = data.length,
                d,
                defined0 = false,
                buffer,
                x0z = new Array(n),
                y0z = new Array(n);

            if (context == null) output = curve(buffer = path());

            for (i = 0; i <= n; ++i) {
                if (!(i < n && defined(d = data[i], i, data)) === defined0) {
                    if (defined0 = !defined0) {
                        j = i;
                        output.areaStart();
                        output.lineStart();
                    } else {
                        output.lineEnd();
                        output.lineStart();
                        for (k = i - 1; k >= j; --k) {
                            output.point(x0z[k], y0z[k]);
                        }
                        output.lineEnd();
                        output.areaEnd();
                    }
                }
                if (defined0) {
                    x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
                    output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
                }
            }

            if (buffer) return output = null, buffer + "" || null;
        }

        function arealine() {
            return line().defined(defined).curve(curve).context(context);
        }

        area.x = function(_) {
            return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), x1 = null, area) : x0;
        };

        area.x0 = function(_) {
            return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), area) : x0;
        };

        area.x1 = function(_) {
            return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : x1;
        };

        area.y = function(_) {
            return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), y1 = null, area) : y0;
        };

        area.y0 = function(_) {
            return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), area) : y0;
        };

        area.y1 = function(_) {
            return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : y1;
        };

        area.lineX0 =
            area.lineY0 = function() {
                return arealine().x(x0).y(y0);
            };

        area.lineY1 = function() {
            return arealine().x(x0).y(y1);
        };

        area.lineX1 = function() {
            return arealine().x(x1).y(y0);
        };

        area.defined = function(_) {
            return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), area) : defined;
        };

        area.curve = function(_) {
            return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
        };

        area.context = function(_) {
            return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
        };

        return area;
    }

    function descending$1(a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    }

    function identity$4(d) {
        return d;
    }

    function pie() {
        var value = identity$4,
            sortValues = descending$1,
            sort = null,
            startAngle = constant$4(0),
            endAngle = constant$4(tau$1),
            padAngle = constant$4(0);

        function pie(data) {
            var i,
                n = data.length,
                j,
                k,
                sum = 0,
                index = new Array(n),
                arcs = new Array(n),
                a0 = +startAngle.apply(this, arguments),
                da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
                a1,
                p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
                pa = p * (da < 0 ? -1 : 1),
                v;

            for (i = 0; i < n; ++i) {
                if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
                    sum += v;
                }
            }

            // Optionally sort the arcs by previously-computed values or by data.
            if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
            else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

            // Compute the arcs! They are stored in the original data's order.
            for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
                j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
                    data: data[j],
                    index: i,
                    value: v,
                    startAngle: a0,
                    endAngle: a1,
                    padAngle: p
                };
            }

            return arcs;
        }

        pie.value = function(_) {
            return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), pie) : value;
        };

        pie.sortValues = function(_) {
            return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
        };

        pie.sort = function(_) {
            return arguments.length ? (sort = _, sortValues = null, pie) : sort;
        };

        pie.startAngle = function(_) {
            return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : startAngle;
        };

        pie.endAngle = function(_) {
            return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : endAngle;
        };

        pie.padAngle = function(_) {
            return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : padAngle;
        };

        return pie;
    }

    var curveRadialLinear = curveRadial(curveLinear);

    function Radial(curve) {
        this._curve = curve;
    }

    Radial.prototype = {
        areaStart: function() {
            this._curve.areaStart();
        },
        areaEnd: function() {
            this._curve.areaEnd();
        },
        lineStart: function() {
            this._curve.lineStart();
        },
        lineEnd: function() {
            this._curve.lineEnd();
        },
        point: function(a, r) {
            this._curve.point(r * Math.sin(a), r * -Math.cos(a));
        }
    };

    function curveRadial(curve) {

        function radial(context) {
            return new Radial(curve(context));
        }

        radial._curve = curve;

        return radial;
    }

    function lineRadial(l) {
        var c = l.curve;

        l.angle = l.x, delete l.x;
        l.radius = l.y, delete l.y;

        l.curve = function(_) {
            return arguments.length ? c(curveRadial(_)) : c()._curve;
        };

        return l;
    }

    function lineRadial$1() {
        return lineRadial(line().curve(curveRadialLinear));
    }

    function areaRadial() {
        var a = area().curve(curveRadialLinear),
            c = a.curve,
            x0 = a.lineX0,
            x1 = a.lineX1,
            y0 = a.lineY0,
            y1 = a.lineY1;

        a.angle = a.x, delete a.x;
        a.startAngle = a.x0, delete a.x0;
        a.endAngle = a.x1, delete a.x1;
        a.radius = a.y, delete a.y;
        a.innerRadius = a.y0, delete a.y0;
        a.outerRadius = a.y1, delete a.y1;
        a.lineStartAngle = function() { return lineRadial(x0()); }, delete a.lineX0;
        a.lineEndAngle = function() { return lineRadial(x1()); }, delete a.lineX1;
        a.lineInnerRadius = function() { return lineRadial(y0()); }, delete a.lineY0;
        a.lineOuterRadius = function() { return lineRadial(y1()); }, delete a.lineY1;

        a.curve = function(_) {
            return arguments.length ? c(curveRadial(_)) : c()._curve;
        };

        return a;
    }

    function pointRadial(x, y) {
        return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }

    var slice$2 = Array.prototype.slice;

    function linkSource(d) {
        return d.source;
    }

    function linkTarget(d) {
        return d.target;
    }

    function link(curve) {
        var source = linkSource,
            target = linkTarget,
            x = pointX,
            y = pointY,
            context = null;

        function link() {
            var buffer, argv = slice$2.call(arguments), s = source.apply(this, argv), t = target.apply(this, argv);
            if (!context) context = buffer = path();
            curve(context, +x.apply(this, (argv[0] = s, argv)), +y.apply(this, argv), +x.apply(this, (argv[0] = t, argv)), +y.apply(this, argv));
            if (buffer) return context = null, buffer + "" || null;
        }

        link.source = function(_) {
            return arguments.length ? (source = _, link) : source;
        };

        link.target = function(_) {
            return arguments.length ? (target = _, link) : target;
        };

        link.x = function(_) {
            return arguments.length ? (x = typeof _ === "function" ? _ : constant$4(+_), link) : x;
        };

        link.y = function(_) {
            return arguments.length ? (y = typeof _ === "function" ? _ : constant$4(+_), link) : y;
        };

        link.context = function(_) {
            return arguments.length ? ((context = _ == null ? null : _), link) : context;
        };

        return link;
    }

    function curveHorizontal(context, x0, y0, x1, y1) {
        context.moveTo(x0, y0);
        context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
    }

    function curveVertical(context, x0, y0, x1, y1) {
        context.moveTo(x0, y0);
        context.bezierCurveTo(x0, y0 = (y0 + y1) / 2, x1, y0, x1, y1);
    }

    function curveRadial$1(context, x0, y0, x1, y1) {
        var p0 = pointRadial(x0, y0),
            p1 = pointRadial(x0, y0 = (y0 + y1) / 2),
            p2 = pointRadial(x1, y0),
            p3 = pointRadial(x1, y1);
        context.moveTo(p0[0], p0[1]);
        context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    }

    function linkHorizontal() {
        return link(curveHorizontal);
    }

    function linkVertical() {
        return link(curveVertical);
    }

    function linkRadial() {
        var l = link(curveRadial$1);
        l.angle = l.x, delete l.x;
        l.radius = l.y, delete l.y;
        return l;
    }

    var circle = {
        draw: function(context, size) {
            var r = Math.sqrt(size / pi$1);
            context.moveTo(r, 0);
            context.arc(0, 0, r, 0, tau$1);
        }
    };

    var cross$1 = {
        draw: function(context, size) {
            var r = Math.sqrt(size / 5) / 2;
            context.moveTo(-3 * r, -r);
            context.lineTo(-r, -r);
            context.lineTo(-r, -3 * r);
            context.lineTo(r, -3 * r);
            context.lineTo(r, -r);
            context.lineTo(3 * r, -r);
            context.lineTo(3 * r, r);
            context.lineTo(r, r);
            context.lineTo(r, 3 * r);
            context.lineTo(-r, 3 * r);
            context.lineTo(-r, r);
            context.lineTo(-3 * r, r);
            context.closePath();
        }
    };

    var tan30 = Math.sqrt(1 / 3);
    var tan30_2 = tan30 * 2;
    var diamond = {
        draw: function(context, size) {
            var y = Math.sqrt(size / tan30_2),
                x = y * tan30;
            context.moveTo(0, -y);
            context.lineTo(x, 0);
            context.lineTo(0, y);
            context.lineTo(-x, 0);
            context.closePath();
        }
    };

    var ka = 0.89081309152928522810;
    var kr = Math.sin(pi$1 / 10) / Math.sin(7 * pi$1 / 10);
    var kx = Math.sin(tau$1 / 10) * kr;
    var ky = -Math.cos(tau$1 / 10) * kr;
    var star = {
        draw: function(context, size) {
            var r = Math.sqrt(size * ka),
                x = kx * r,
                y = ky * r;
            context.moveTo(0, -r);
            context.lineTo(x, y);
            for (var i = 1; i < 5; ++i) {
                var a = tau$1 * i / 5,
                    c = Math.cos(a),
                    s = Math.sin(a);
                context.lineTo(s * r, -c * r);
                context.lineTo(c * x - s * y, s * x + c * y);
            }
            context.closePath();
        }
    };

    var square = {
        draw: function(context, size) {
            var w = Math.sqrt(size),
                x = -w / 2;
            context.rect(x, x, w, w);
        }
    };

    var sqrt3 = Math.sqrt(3);

    var triangle = {
        draw: function(context, size) {
            var y = -Math.sqrt(size / (sqrt3 * 3));
            context.moveTo(0, y * 2);
            context.lineTo(-sqrt3 * y, -y);
            context.lineTo(sqrt3 * y, -y);
            context.closePath();
        }
    };

    var c = -0.5;
    var s = Math.sqrt(3) / 2;
    var k = 1 / Math.sqrt(12);
    var a = (k / 2 + 1) * 3;
    var wye = {
        draw: function(context, size) {
            var r = Math.sqrt(size / a),
                x0 = r / 2,
                y0 = r * k,
                x1 = x0,
                y1 = r * k + r,
                x2 = -x1,
                y2 = y1;
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
            context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
            context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
            context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
            context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
            context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
            context.closePath();
        }
    };

    var symbols = [
        circle,
        cross$1,
        diamond,
        square,
        star,
        triangle,
        wye
    ];

    function symbol() {
        var type = constant$4(circle),
            size = constant$4(64),
            context = null;

        function symbol() {
            var buffer;
            if (!context) context = buffer = path();
            type.apply(this, arguments).draw(context, +size.apply(this, arguments));
            if (buffer) return context = null, buffer + "" || null;
        }

        symbol.type = function(_) {
            return arguments.length ? (type = typeof _ === "function" ? _ : constant$4(_), symbol) : type;
        };

        symbol.size = function(_) {
            return arguments.length ? (size = typeof _ === "function" ? _ : constant$4(+_), symbol) : size;
        };

        symbol.context = function(_) {
            return arguments.length ? (context = _ == null ? null : _, symbol) : context;
        };

        return symbol;
    }

    function noop() {}

    function point$2(that, x, y) {
        that._context.bezierCurveTo(
            (2 * that._x0 + that._x1) / 3,
            (2 * that._y0 + that._y1) / 3,
            (that._x0 + 2 * that._x1) / 3,
            (that._y0 + 2 * that._y1) / 3,
            (that._x0 + 4 * that._x1 + x) / 6,
            (that._y0 + 4 * that._y1 + y) / 6
        );
    }

    function Basis(context) {
        this._context = context;
    }

    Basis.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 =
                this._y0 = this._y1 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 3: point$2(this, this._x1, this._y1); // proceed
                case 2: this._context.lineTo(this._x1, this._y1); break;
            }
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                case 1: this._point = 2; break;
                case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
                default: point$2(this, x, y); break;
            }
            this._x0 = this._x1, this._x1 = x;
            this._y0 = this._y1, this._y1 = y;
        }
    };

    function basis$2(context) {
        return new Basis(context);
    }

    function BasisClosed(context) {
        this._context = context;
    }

    BasisClosed.prototype = {
        areaStart: noop,
        areaEnd: noop,
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
                this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 1: {
                    this._context.moveTo(this._x2, this._y2);
                    this._context.closePath();
                    break;
                }
                case 2: {
                    this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
                    this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
                    this._context.closePath();
                    break;
                }
                case 3: {
                    this.point(this._x2, this._y2);
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    break;
                }
            }
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
                case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
                case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
                default: point$2(this, x, y); break;
            }
            this._x0 = this._x1, this._x1 = x;
            this._y0 = this._y1, this._y1 = y;
        }
    };

    function basisClosed$1(context) {
        return new BasisClosed(context);
    }

    function BasisOpen(context) {
        this._context = context;
    }

    BasisOpen.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 =
                this._y0 = this._y1 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; break;
                case 1: this._point = 2; break;
                case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
                case 3: this._point = 4; // proceed
                default: point$2(this, x, y); break;
            }
            this._x0 = this._x1, this._x1 = x;
            this._y0 = this._y1, this._y1 = y;
        }
    };

    function basisOpen(context) {
        return new BasisOpen(context);
    }

    function Bundle(context, beta) {
        this._basis = new Basis(context);
        this._beta = beta;
    }

    Bundle.prototype = {
        lineStart: function() {
            this._x = [];
            this._y = [];
            this._basis.lineStart();
        },
        lineEnd: function() {
            var x = this._x,
                y = this._y,
                j = x.length - 1;

            if (j > 0) {
                var x0 = x[0],
                    y0 = y[0],
                    dx = x[j] - x0,
                    dy = y[j] - y0,
                    i = -1,
                    t;

                while (++i <= j) {
                    t = i / j;
                    this._basis.point(
                        this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
                        this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
                    );
                }
            }

            this._x = this._y = null;
            this._basis.lineEnd();
        },
        point: function(x, y) {
            this._x.push(+x);
            this._y.push(+y);
        }
    };

    var bundle = (function custom(beta) {

        function bundle(context) {
            return beta === 1 ? new Basis(context) : new Bundle(context, beta);
        }

        bundle.beta = function(beta) {
            return custom(+beta);
        };

        return bundle;
    })(0.85);

    function point$3(that, x, y) {
        that._context.bezierCurveTo(
            that._x1 + that._k * (that._x2 - that._x0),
            that._y1 + that._k * (that._y2 - that._y0),
            that._x2 + that._k * (that._x1 - x),
            that._y2 + that._k * (that._y1 - y),
            that._x2,
            that._y2
        );
    }

    function Cardinal(context, tension) {
        this._context = context;
        this._k = (1 - tension) / 6;
    }

    Cardinal.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 =
                this._y0 = this._y1 = this._y2 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 2: this._context.lineTo(this._x2, this._y2); break;
                case 3: point$3(this, this._x1, this._y1); break;
            }
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
                case 2: this._point = 3; // proceed
                default: point$3(this, x, y); break;
            }
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
            this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };

    var cardinal = (function custom(tension) {

        function cardinal(context) {
            return new Cardinal(context, tension);
        }

        cardinal.tension = function(tension) {
            return custom(+tension);
        };

        return cardinal;
    })(0);

    function CardinalClosed(context, tension) {
        this._context = context;
        this._k = (1 - tension) / 6;
    }

    CardinalClosed.prototype = {
        areaStart: noop,
        areaEnd: noop,
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
                this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 1: {
                    this._context.moveTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
                case 2: {
                    this._context.lineTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
                case 3: {
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    this.point(this._x5, this._y5);
                    break;
                }
            }
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
                case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
                case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
                default: point$3(this, x, y); break;
            }
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
            this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };

    var cardinalClosed = (function custom(tension) {

        function cardinal(context) {
            return new CardinalClosed(context, tension);
        }

        cardinal.tension = function(tension) {
            return custom(+tension);
        };

        return cardinal;
    })(0);

    function CardinalOpen(context, tension) {
        this._context = context;
        this._k = (1 - tension) / 6;
    }

    CardinalOpen.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 =
                this._y0 = this._y1 = this._y2 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; break;
                case 1: this._point = 2; break;
                case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
                case 3: this._point = 4; // proceed
                default: point$3(this, x, y); break;
            }
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
            this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };

    var cardinalOpen = (function custom(tension) {

        function cardinal(context) {
            return new CardinalOpen(context, tension);
        }

        cardinal.tension = function(tension) {
            return custom(+tension);
        };

        return cardinal;
    })(0);

    function point$4(that, x, y) {
        var x1 = that._x1,
            y1 = that._y1,
            x2 = that._x2,
            y2 = that._y2;

        if (that._l01_a > epsilon$1) {
            var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
                n = 3 * that._l01_a * (that._l01_a + that._l12_a);
            x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
            y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
        }

        if (that._l23_a > epsilon$1) {
            var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
                m = 3 * that._l23_a * (that._l23_a + that._l12_a);
            x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
            y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
        }

        that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
    }

    function CatmullRom(context, alpha) {
        this._context = context;
        this._alpha = alpha;
    }

    CatmullRom.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 =
                this._y0 = this._y1 = this._y2 = NaN;
            this._l01_a = this._l12_a = this._l23_a =
                this._l01_2a = this._l12_2a = this._l23_2a =
                    this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 2: this._context.lineTo(this._x2, this._y2); break;
                case 3: this.point(this._x2, this._y2); break;
            }
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;

            if (this._point) {
                var x23 = this._x2 - x,
                    y23 = this._y2 - y;
                this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
            }

            switch (this._point) {
                case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                case 1: this._point = 2; break;
                case 2: this._point = 3; // proceed
                default: point$4(this, x, y); break;
            }

            this._l01_a = this._l12_a, this._l12_a = this._l23_a;
            this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
            this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };

    var catmullRom = (function custom(alpha) {

        function catmullRom(context) {
            return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
        }

        catmullRom.alpha = function(alpha) {
            return custom(+alpha);
        };

        return catmullRom;
    })(0.5);

    function CatmullRomClosed(context, alpha) {
        this._context = context;
        this._alpha = alpha;
    }

    CatmullRomClosed.prototype = {
        areaStart: noop,
        areaEnd: noop,
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
                this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
            this._l01_a = this._l12_a = this._l23_a =
                this._l01_2a = this._l12_2a = this._l23_2a =
                    this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 1: {
                    this._context.moveTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
                case 2: {
                    this._context.lineTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
                case 3: {
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    this.point(this._x5, this._y5);
                    break;
                }
            }
        },
        point: function(x, y) {
            x = +x, y = +y;

            if (this._point) {
                var x23 = this._x2 - x,
                    y23 = this._y2 - y;
                this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
            }

            switch (this._point) {
                case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
                case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
                case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
                default: point$4(this, x, y); break;
            }

            this._l01_a = this._l12_a, this._l12_a = this._l23_a;
            this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
            this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };

    var catmullRomClosed = (function custom(alpha) {

        function catmullRom(context) {
            return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
        }

        catmullRom.alpha = function(alpha) {
            return custom(+alpha);
        };

        return catmullRom;
    })(0.5);

    function CatmullRomOpen(context, alpha) {
        this._context = context;
        this._alpha = alpha;
    }

    CatmullRomOpen.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 =
                this._y0 = this._y1 = this._y2 = NaN;
            this._l01_a = this._l12_a = this._l23_a =
                this._l01_2a = this._l12_2a = this._l23_2a =
                    this._point = 0;
        },
        lineEnd: function() {
            if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;

            if (this._point) {
                var x23 = this._x2 - x,
                    y23 = this._y2 - y;
                this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
            }

            switch (this._point) {
                case 0: this._point = 1; break;
                case 1: this._point = 2; break;
                case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
                case 3: this._point = 4; // proceed
                default: point$4(this, x, y); break;
            }

            this._l01_a = this._l12_a, this._l12_a = this._l23_a;
            this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
            this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };

    var catmullRomOpen = (function custom(alpha) {

        function catmullRom(context) {
            return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
        }

        catmullRom.alpha = function(alpha) {
            return custom(+alpha);
        };

        return catmullRom;
    })(0.5);

    function LinearClosed(context) {
        this._context = context;
    }

    LinearClosed.prototype = {
        areaStart: noop,
        areaEnd: noop,
        lineStart: function() {
            this._point = 0;
        },
        lineEnd: function() {
            if (this._point) this._context.closePath();
        },
        point: function(x, y) {
            x = +x, y = +y;
            if (this._point) this._context.lineTo(x, y);
            else this._point = 1, this._context.moveTo(x, y);
        }
    };

    function linearClosed(context) {
        return new LinearClosed(context);
    }

    function sign(x) {
        return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
        var h0 = that._x1 - that._x0,
            h1 = x2 - that._x1,
            s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
            s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
            p = (s0 * h1 + s1 * h0) / (h0 + h1);
        return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
        var h = that._x1 - that._x0;
        return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point$5(that, t0, t1) {
        var x0 = that._x0,
            y0 = that._y0,
            x1 = that._x1,
            y1 = that._y1,
            dx = (x1 - x0) / 3;
        that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
        this._context = context;
    }

    MonotoneX.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 =
                this._y0 = this._y1 =
                    this._t0 = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            switch (this._point) {
                case 2: this._context.lineTo(this._x1, this._y1); break;
                case 3: point$5(this, this._t0, slope2(this, this._t0)); break;
            }
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            var t1 = NaN;

            x = +x, y = +y;
            if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
            switch (this._point) {
                case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                case 1: this._point = 2; break;
                case 2: this._point = 3; point$5(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
                default: point$5(this, this._t0, t1 = slope3(this, x, y)); break;
            }

            this._x0 = this._x1, this._x1 = x;
            this._y0 = this._y1, this._y1 = y;
            this._t0 = t1;
        }
    }

    function MonotoneY(context) {
        this._context = new ReflectContext(context);
    }

    (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
        MonotoneX.prototype.point.call(this, y, x);
    };

    function ReflectContext(context) {
        this._context = context;
    }

    ReflectContext.prototype = {
        moveTo: function(x, y) { this._context.moveTo(y, x); },
        closePath: function() { this._context.closePath(); },
        lineTo: function(x, y) { this._context.lineTo(y, x); },
        bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
    };

    function monotoneX(context) {
        return new MonotoneX(context);
    }

    function monotoneY(context) {
        return new MonotoneY(context);
    }

    function Natural(context) {
        this._context = context;
    }

    Natural.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x = [];
            this._y = [];
        },
        lineEnd: function() {
            var x = this._x,
                y = this._y,
                n = x.length;

            if (n) {
                this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
                if (n === 2) {
                    this._context.lineTo(x[1], y[1]);
                } else {
                    var px = controlPoints(x),
                        py = controlPoints(y);
                    for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
                        this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
                    }
                }
            }

            if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
            this._line = 1 - this._line;
            this._x = this._y = null;
        },
        point: function(x, y) {
            this._x.push(+x);
            this._y.push(+y);
        }
    };

    // See https://www.particleincell.com/2012/bezier-splines/ for derivation.
    function controlPoints(x) {
        var i,
            n = x.length - 1,
            m,
            a = new Array(n),
            b = new Array(n),
            r = new Array(n);
        a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
        for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
        a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
        for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
        a[n - 1] = r[n - 1] / b[n - 1];
        for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
        b[n - 1] = (x[n] + a[n - 1]) / 2;
        for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
        return [a, b];
    }

    function natural(context) {
        return new Natural(context);
    }

    function Step(context, t) {
        this._context = context;
        this._t = t;
    }

    Step.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x = this._y = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                case 1: this._point = 2; // proceed
                default: {
                    if (this._t <= 0) {
                        this._context.lineTo(this._x, y);
                        this._context.lineTo(x, y);
                    } else {
                        var x1 = this._x * (1 - this._t) + x * this._t;
                        this._context.lineTo(x1, this._y);
                        this._context.lineTo(x1, y);
                    }
                    break;
                }
            }
            this._x = x, this._y = y;
        }
    };

    function step(context) {
        return new Step(context, 0.5);
    }

    function stepBefore(context) {
        return new Step(context, 0);
    }

    function stepAfter(context) {
        return new Step(context, 1);
    }

    function none$1(series, order) {
        if (!((n = series.length) > 1)) return;
        for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
            s0 = s1, s1 = series[order[i]];
            for (j = 0; j < m; ++j) {
                s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
            }
        }
    }

    function none$2(series) {
        var n = series.length, o = new Array(n);
        while (--n >= 0) o[n] = n;
        return o;
    }

    function stackValue(d, key) {
        return d[key];
    }

    function stack() {
        var keys = constant$4([]),
            order = none$2,
            offset = none$1,
            value = stackValue;

        function stack(data) {
            var kz = keys.apply(this, arguments),
                i,
                m = data.length,
                n = kz.length,
                sz = new Array(n),
                oz;

            for (i = 0; i < n; ++i) {
                for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
                    si[j] = sij = [0, +value(data[j], ki, j, data)];
                    sij.data = data[j];
                }
                si.key = ki;
            }

            for (i = 0, oz = order(sz); i < n; ++i) {
                sz[oz[i]].index = i;
            }

            offset(sz, oz);
            return sz;
        }

        stack.keys = function(_) {
            return arguments.length ? (keys = typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : keys;
        };

        stack.value = function(_) {
            return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), stack) : value;
        };

        stack.order = function(_) {
            return arguments.length ? (order = _ == null ? none$2 : typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : order;
        };

        stack.offset = function(_) {
            return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
        };

        return stack;
    }

    function expand(series, order) {
        if (!((n = series.length) > 0)) return;
        for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
            for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
            if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
        }
        none$1(series, order);
    }

    function diverging(series, order) {
        if (!((n = series.length) > 1)) return;
        for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
            for (yp = yn = 0, i = 0; i < n; ++i) {
                if ((dy = (d = series[order[i]][j])[1] - d[0]) >= 0) {
                    d[0] = yp, d[1] = yp += dy;
                } else if (dy < 0) {
                    d[1] = yn, d[0] = yn += dy;
                } else {
                    d[0] = yp;
                }
            }
        }
    }

    function silhouette(series, order) {
        if (!((n = series.length) > 0)) return;
        for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
            for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
            s0[j][1] += s0[j][0] = -y / 2;
        }
        none$1(series, order);
    }

    function wiggle(series, order) {
        if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
        for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
            for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
                var si = series[order[i]],
                    sij0 = si[j][1] || 0,
                    sij1 = si[j - 1][1] || 0,
                    s3 = (sij0 - sij1) / 2;
                for (var k = 0; k < i; ++k) {
                    var sk = series[order[k]],
                        skj0 = sk[j][1] || 0,
                        skj1 = sk[j - 1][1] || 0;
                    s3 += skj0 - skj1;
                }
                s1 += sij0, s2 += s3 * sij0;
            }
            s0[j - 1][1] += s0[j - 1][0] = y;
            if (s1) y -= s2 / s1;
        }
        s0[j - 1][1] += s0[j - 1][0] = y;
        none$1(series, order);
    }

    function ascending$2(series) {
        var sums = series.map(sum$1);
        return none$2(series).sort(function(a, b) { return sums[a] - sums[b]; });
    }

    function sum$1(series) {
        var s = 0, i = -1, n = series.length, v;
        while (++i < n) if (v = +series[i][1]) s += v;
        return s;
    }

    function descending$2(series) {
        return ascending$2(series).reverse();
    }

    function insideOut(series) {
        var n = series.length,
            i,
            j,
            sums = series.map(sum$1),
            order = none$2(series).sort(function(a, b) { return sums[b] - sums[a]; }),
            top = 0,
            bottom = 0,
            tops = [],
            bottoms = [];

        for (i = 0; i < n; ++i) {
            j = order[i];
            if (top < bottom) {
                top += sums[j];
                tops.push(j);
            } else {
                bottom += sums[j];
                bottoms.push(j);
            }
        }

        return bottoms.reverse().concat(tops);
    }

    function reverse(series) {
        return none$2(series).reverse();
    }

    var slice$3 = Array.prototype.slice;

    function identity$5(x) {
        return x;
    }

    var top = 1;
    var right = 2;
    var bottom = 3;
    var left = 4;
    var epsilon$2 = 1e-6;
    function translateX(x) {
        return "translate(" + (x + 0.5) + ",0)";
    }

    function translateY(y) {
        return "translate(0," + (y + 0.5) + ")";
    }

    function number$3(scale) {
        return function(d) {
            return +scale(d);
        };
    }

    function center(scale) {
        var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
        if (scale.round()) offset = Math.round(offset);
        return function(d) {
            return +scale(d) + offset;
        };
    }

    function entering() {
        return !this.__axis;
    }

    function axis(orient, scale) {
        var tickArguments = [],
            tickValues = null,
            tickFormat = null,
            tickSizeInner = 6,
            tickSizeOuter = 6,
            tickPadding = 3,
            k = orient === top || orient === left ? -1 : 1,
            x = orient === left || orient === right ? "x" : "y",
            transform = orient === top || orient === bottom ? translateX : translateY;

        function axis(context) {
            var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
                format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$5) : tickFormat,
                spacing = Math.max(tickSizeInner, 0) + tickPadding,
                range = scale.range(),
                range0 = +range[0] + 0.5,
                range1 = +range[range.length - 1] + 0.5,
                position = (scale.bandwidth ? center : number$3)(scale.copy()),
                selection = context.selection ? context.selection() : context,
                path = selection.selectAll(".domain").data([null]),
                tick = selection.selectAll(".tick").data(values, scale).order(),
                tickExit = tick.exit(),
                tickEnter = tick.enter().append("g").attr("class", "tick"),
                line = tick.select("line"),
                text = tick.select("text");

            path = path.merge(path.enter().insert("path", ".tick")
                .attr("class", "domain")
                .attr("stroke", "#000"));

            tick = tick.merge(tickEnter);

            line = line.merge(tickEnter.append("line")
                .attr("stroke", "#000")
                .attr(x + "2", k * tickSizeInner));

            text = text.merge(tickEnter.append("text")
                .attr("fill", "#000")
                .attr(x, k * spacing)
                .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

            if (context !== selection) {
                path = path.transition(context);
                tick = tick.transition(context);
                line = line.transition(context);
                text = text.transition(context);

                tickExit = tickExit.transition(context)
                    .attr("opacity", epsilon$2)
                    .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

                tickEnter
                    .attr("opacity", epsilon$2)
                    .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
            }

            tickExit.remove();

            path
                .attr("d", orient === left || orient == right
                    ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
                    : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

            tick
                .attr("opacity", 1)
                .attr("transform", function(d) { return transform(position(d)); });

            line
                .attr(x + "2", k * tickSizeInner);

            text
                .attr(x, k * spacing)
                .text(format);

            selection.filter(entering)
                .attr("fill", "none")
                .attr("font-size", 10)
                .attr("font-family", "sans-serif")
                .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

            selection
                .each(function() { this.__axis = position; });
        }

        axis.scale = function(_) {
            return arguments.length ? (scale = _, axis) : scale;
        };

        axis.ticks = function() {
            return tickArguments = slice$3.call(arguments), axis;
        };

        axis.tickArguments = function(_) {
            return arguments.length ? (tickArguments = _ == null ? [] : slice$3.call(_), axis) : tickArguments.slice();
        };

        axis.tickValues = function(_) {
            return arguments.length ? (tickValues = _ == null ? null : slice$3.call(_), axis) : tickValues && tickValues.slice();
        };

        axis.tickFormat = function(_) {
            return arguments.length ? (tickFormat = _, axis) : tickFormat;
        };

        axis.tickSize = function(_) {
            return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
        };

        axis.tickSizeInner = function(_) {
            return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
        };

        axis.tickSizeOuter = function(_) {
            return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
        };

        axis.tickPadding = function(_) {
            return arguments.length ? (tickPadding = +_, axis) : tickPadding;
        };

        return axis;
    }

    function axisTop(scale) {
        return axis(top, scale);
    }

    function axisRight(scale) {
        return axis(right, scale);
    }

    function axisBottom(scale) {
        return axis(bottom, scale);
    }

    function axisLeft(scale) {
        return axis(left, scale);
    }

    var noop$1 = {value: function() {}};

    function dispatch() {
        for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
            if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
            _[t] = [];
        }
        return new Dispatch(_);
    }

    function Dispatch(_) {
        this._ = _;
    }

    function parseTypenames$1(typenames, types) {
        return typenames.trim().split(/^|\s+/).map(function(t) {
            var name = "", i = t.indexOf(".");
            if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
            if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
            return {type: t, name: name};
        });
    }

    Dispatch.prototype = dispatch.prototype = {
        constructor: Dispatch,
        on: function(typename, callback) {
            var _ = this._,
                T = parseTypenames$1(typename + "", _),
                t,
                i = -1,
                n = T.length;

            // If no callback was specified, return the callback of the given type and name.
            if (arguments.length < 2) {
                while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
                return;
            }

            // If a type was specified, set the callback for the given type and name.
            // Otherwise, if a null callback was specified, remove callbacks of the given name.
            if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
            while (++i < n) {
                if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);
                else if (callback == null) for (t in _) _[t] = set$2(_[t], typename.name, null);
            }

            return this;
        },
        copy: function() {
            var copy = {}, _ = this._;
            for (var t in _) copy[t] = _[t].slice();
            return new Dispatch(copy);
        },
        call: function(type, that) {
            if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
            if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
            for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
        },
        apply: function(type, that, args) {
            if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
            for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
        }
    };

    function get$1(type, name) {
        for (var i = 0, n = type.length, c; i < n; ++i) {
            if ((c = type[i]).name === name) {
                return c.value;
            }
        }
    }

    function set$2(type, name, callback) {
        for (var i = 0, n = type.length; i < n; ++i) {
            if (type[i].name === name) {
                type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
                break;
            }
        }
        if (callback != null) type.push({name: name, value: callback});
        return type;
    }

    var frame = 0;
    var timeout = 0;
    var interval = 0;
    var pokeDelay = 1000;
    var taskHead;
    var taskTail;
    var clockLast = 0;
    var clockNow = 0;
    var clockSkew = 0;
    var clock = typeof performance === "object" && performance.now ? performance : Date;
    var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };
    function now() {
        return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
        clockNow = 0;
    }

    function Timer() {
        this._call =
            this._time =
                this._next = null;
    }

    Timer.prototype = timer.prototype = {
        constructor: Timer,
        restart: function(callback, delay, time) {
            if (typeof callback !== "function") throw new TypeError("callback is not a function");
            time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
            if (!this._next && taskTail !== this) {
                if (taskTail) taskTail._next = this;
                else taskHead = this;
                taskTail = this;
            }
            this._call = callback;
            this._time = time;
            sleep();
        },
        stop: function() {
            if (this._call) {
                this._call = null;
                this._time = Infinity;
                sleep();
            }
        }
    };

    function timer(callback, delay, time) {
        var t = new Timer;
        t.restart(callback, delay, time);
        return t;
    }

    function timerFlush() {
        now(); // Get the current time, if not already set.
        ++frame; // Pretend we’ve set an alarm, if we haven’t already.
        var t = taskHead, e;
        while (t) {
            if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
            t = t._next;
        }
        --frame;
    }

    function wake() {
        clockNow = (clockLast = clock.now()) + clockSkew;
        frame = timeout = 0;
        try {
            timerFlush();
        } finally {
            frame = 0;
            nap();
            clockNow = 0;
        }
    }

    function poke() {
        var now = clock.now(), delay = now - clockLast;
        if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
        var t0, t1 = taskHead, t2, time = Infinity;
        while (t1) {
            if (t1._call) {
                if (time > t1._time) time = t1._time;
                t0 = t1, t1 = t1._next;
            } else {
                t2 = t1._next, t1._next = null;
                t1 = t0 ? t0._next = t2 : taskHead = t2;
            }
        }
        taskTail = t0;
        sleep(time);
    }

    function sleep(time) {
        if (frame) return; // Soonest alarm already set, or will be.
        if (timeout) timeout = clearTimeout(timeout);
        var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
        if (delay > 24) {
            if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
            if (interval) interval = clearInterval(interval);
        } else {
            if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
            frame = 1, setFrame(wake);
        }
    }

    function timeout$1(callback, delay, time) {
        var t = new Timer;
        delay = delay == null ? 0 : +delay;
        t.restart(function(elapsed) {
            t.stop();
            callback(elapsed + delay);
        }, delay, time);
        return t;
    }

    var emptyOn = dispatch("start", "end", "interrupt");
    var emptyTween = [];

    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;

    function schedule(node, name, id, index, group, timing) {
        var schedules = node.__transition;
        if (!schedules) node.__transition = {};
        else if (id in schedules) return;
        create(node, id, {
            name: name,
            index: index, // For context during callback.
            group: group, // For context during callback.
            on: emptyOn,
            tween: emptyTween,
            time: timing.time,
            delay: timing.delay,
            duration: timing.duration,
            ease: timing.ease,
            timer: null,
            state: CREATED
        });
    }

    function init(node, id) {
        var schedule = node.__transition;
        if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
        return schedule;
    }

    function set$1(node, id) {
        var schedule = node.__transition;
        if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
        return schedule;
    }

    function get(node, id) {
        var schedule = node.__transition;
        if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
        return schedule;
    }

    function create(node, id, self) {
        var schedules = node.__transition,
            tween;

        // Initialize the self timer when the transition is created.
        // Note the actual delay is not known until the first callback!
        schedules[id] = self;
        self.timer = timer(schedule, 0, self.time);

        function schedule(elapsed) {
            self.state = SCHEDULED;
            self.timer.restart(start, self.delay, self.time);

            // If the elapsed delay is less than our first sleep, start immediately.
            if (self.delay <= elapsed) start(elapsed - self.delay);
        }

        function start(elapsed) {
            var i, j, n, o;

            // If the state is not SCHEDULED, then we previously errored on start.
            if (self.state !== SCHEDULED) return stop();

            for (i in schedules) {
                o = schedules[i];
                if (o.name !== self.name) continue;

                // While this element already has a starting transition during this frame,
                // defer starting an interrupting transition until that transition has a
                // chance to tick (and possibly end); see d3/d3-transition#54!
                if (o.state === STARTED) return timeout$1(start);

                // Interrupt the active transition, if any.
                // Dispatch the interrupt event.
                if (o.state === RUNNING) {
                    o.state = ENDED;
                    o.timer.stop();
                    o.on.call("interrupt", node, node.__data__, o.index, o.group);
                    delete schedules[i];
                }

                // Cancel any pre-empted transitions. No interrupt event is dispatched
                // because the cancelled transitions never started. Note that this also
                // removes this transition from the pending list!
                else if (+i < id) {
                    o.state = ENDED;
                    o.timer.stop();
                    delete schedules[i];
                }
            }

            // Defer the first tick to end of the current frame; see d3/d3#1576.
            // Note the transition may be canceled after start and before the first tick!
            // Note this must be scheduled before the start event; see d3/d3-transition#16!
            // Assuming this is successful, subsequent callbacks go straight to tick.
            timeout$1(function() {
                if (self.state === STARTED) {
                    self.state = RUNNING;
                    self.timer.restart(tick, self.delay, self.time);
                    tick(elapsed);
                }
            });

            // Dispatch the start event.
            // Note this must be done before the tween are initialized.
            self.state = STARTING;
            self.on.call("start", node, node.__data__, self.index, self.group);
            if (self.state !== STARTING) return; // interrupted
            self.state = STARTED;

            // Initialize the tween, deleting null tween.
            tween = new Array(n = self.tween.length);
            for (i = 0, j = -1; i < n; ++i) {
                if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
                    tween[++j] = o;
                }
            }
            tween.length = j + 1;
        }

        function tick(elapsed) {
            var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
                i = -1,
                n = tween.length;

            while (++i < n) {
                tween[i].call(null, t);
            }

            // Dispatch the end event.
            if (self.state === ENDING) {
                self.on.call("end", node, node.__data__, self.index, self.group);
                stop();
            }
        }

        function stop() {
            self.state = ENDED;
            self.timer.stop();
            delete schedules[id];
            for (var i in schedules) return; // eslint-disable-line no-unused-vars
            delete node.__transition;
        }
    }

    function interrupt(node, name) {
        var schedules = node.__transition,
            schedule,
            active,
            empty = true,
            i;

        if (!schedules) return;

        name = name == null ? null : name + "";

        for (i in schedules) {
            if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
            active = schedule.state > STARTING && schedule.state < ENDING;
            schedule.state = ENDED;
            schedule.timer.stop();
            if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
            delete schedules[i];
        }

        if (empty) delete node.__transition;
    }

    function selection_interrupt(name) {
        return this.each(function() {
            interrupt(this, name);
        });
    }

    function tweenRemove(id, name) {
        var tween0, tween1;
        return function() {
            var schedule = set$1(this, id),
                tween = schedule.tween;

            // If this node shared tween with the previous node,
            // just assign the updated shared tween and we’re done!
            // Otherwise, copy-on-write.
            if (tween !== tween0) {
                tween1 = tween0 = tween;
                for (var i = 0, n = tween1.length; i < n; ++i) {
                    if (tween1[i].name === name) {
                        tween1 = tween1.slice();
                        tween1.splice(i, 1);
                        break;
                    }
                }
            }

            schedule.tween = tween1;
        };
    }

    function tweenFunction(id, name, value) {
        var tween0, tween1;
        if (typeof value !== "function") throw new Error;
        return function() {
            var schedule = set$1(this, id),
                tween = schedule.tween;

            // If this node shared tween with the previous node,
            // just assign the updated shared tween and we’re done!
            // Otherwise, copy-on-write.
            if (tween !== tween0) {
                tween1 = (tween0 = tween).slice();
                for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
                    if (tween1[i].name === name) {
                        tween1[i] = t;
                        break;
                    }
                }
                if (i === n) tween1.push(t);
            }

            schedule.tween = tween1;
        };
    }

    function transition_tween(name, value) {
        var id = this._id;

        name += "";

        if (arguments.length < 2) {
            var tween = get(this.node(), id).tween;
            for (var i = 0, n = tween.length, t; i < n; ++i) {
                if ((t = tween[i]).name === name) {
                    return t.value;
                }
            }
            return null;
        }

        return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
    }

    function tweenValue(transition, name, value) {
        var id = transition._id;

        transition.each(function() {
            var schedule = set$1(this, id);
            (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
        });

        return function(node) {
            return get(node, id).value[name];
        };
    }

    function define$2(constructor, factory, prototype) {
        constructor.prototype = factory.prototype = prototype;
        prototype.constructor = constructor;
    }

    function extend$2(parent, definition) {
        var prototype = Object.create(parent.prototype);
        for (var key in definition) prototype[key] = definition[key];
        return prototype;
    }

    function Color$2() {}

    var darker$2 = 0.7;
    var brighter$2 = 1 / darker$2;

    var reI$2 = "\\s*([+-]?\\d+)\\s*";
    var reN$2 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
    var reP$2 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
    var reHex3$2 = /^#([0-9a-f]{3})$/;
    var reHex6$2 = /^#([0-9a-f]{6})$/;
    var reRgbInteger$2 = new RegExp("^rgb\\(" + [reI$2, reI$2, reI$2] + "\\)$");
    var reRgbPercent$2 = new RegExp("^rgb\\(" + [reP$2, reP$2, reP$2] + "\\)$");
    var reRgbaInteger$2 = new RegExp("^rgba\\(" + [reI$2, reI$2, reI$2, reN$2] + "\\)$");
    var reRgbaPercent$2 = new RegExp("^rgba\\(" + [reP$2, reP$2, reP$2, reN$2] + "\\)$");
    var reHslPercent$2 = new RegExp("^hsl\\(" + [reN$2, reP$2, reP$2] + "\\)$");
    var reHslaPercent$2 = new RegExp("^hsla\\(" + [reN$2, reP$2, reP$2, reN$2] + "\\)$");
    var named$2 = {
        aliceblue: 0xf0f8ff,
        antiquewhite: 0xfaebd7,
        aqua: 0x00ffff,
        aquamarine: 0x7fffd4,
        azure: 0xf0ffff,
        beige: 0xf5f5dc,
        bisque: 0xffe4c4,
        black: 0x000000,
        blanchedalmond: 0xffebcd,
        blue: 0x0000ff,
        blueviolet: 0x8a2be2,
        brown: 0xa52a2a,
        burlywood: 0xdeb887,
        cadetblue: 0x5f9ea0,
        chartreuse: 0x7fff00,
        chocolate: 0xd2691e,
        coral: 0xff7f50,
        cornflowerblue: 0x6495ed,
        cornsilk: 0xfff8dc,
        crimson: 0xdc143c,
        cyan: 0x00ffff,
        darkblue: 0x00008b,
        darkcyan: 0x008b8b,
        darkgoldenrod: 0xb8860b,
        darkgray: 0xa9a9a9,
        darkgreen: 0x006400,
        darkgrey: 0xa9a9a9,
        darkkhaki: 0xbdb76b,
        darkmagenta: 0x8b008b,
        darkolivegreen: 0x556b2f,
        darkorange: 0xff8c00,
        darkorchid: 0x9932cc,
        darkred: 0x8b0000,
        darksalmon: 0xe9967a,
        darkseagreen: 0x8fbc8f,
        darkslateblue: 0x483d8b,
        darkslategray: 0x2f4f4f,
        darkslategrey: 0x2f4f4f,
        darkturquoise: 0x00ced1,
        darkviolet: 0x9400d3,
        deeppink: 0xff1493,
        deepskyblue: 0x00bfff,
        dimgray: 0x696969,
        dimgrey: 0x696969,
        dodgerblue: 0x1e90ff,
        firebrick: 0xb22222,
        floralwhite: 0xfffaf0,
        forestgreen: 0x228b22,
        fuchsia: 0xff00ff,
        gainsboro: 0xdcdcdc,
        ghostwhite: 0xf8f8ff,
        gold: 0xffd700,
        goldenrod: 0xdaa520,
        gray: 0x808080,
        green: 0x008000,
        greenyellow: 0xadff2f,
        grey: 0x808080,
        honeydew: 0xf0fff0,
        hotpink: 0xff69b4,
        indianred: 0xcd5c5c,
        indigo: 0x4b0082,
        ivory: 0xfffff0,
        khaki: 0xf0e68c,
        lavender: 0xe6e6fa,
        lavenderblush: 0xfff0f5,
        lawngreen: 0x7cfc00,
        lemonchiffon: 0xfffacd,
        lightblue: 0xadd8e6,
        lightcoral: 0xf08080,
        lightcyan: 0xe0ffff,
        lightgoldenrodyellow: 0xfafad2,
        lightgray: 0xd3d3d3,
        lightgreen: 0x90ee90,
        lightgrey: 0xd3d3d3,
        lightpink: 0xffb6c1,
        lightsalmon: 0xffa07a,
        lightseagreen: 0x20b2aa,
        lightskyblue: 0x87cefa,
        lightslategray: 0x778899,
        lightslategrey: 0x778899,
        lightsteelblue: 0xb0c4de,
        lightyellow: 0xffffe0,
        lime: 0x00ff00,
        limegreen: 0x32cd32,
        linen: 0xfaf0e6,
        magenta: 0xff00ff,
        maroon: 0x800000,
        mediumaquamarine: 0x66cdaa,
        mediumblue: 0x0000cd,
        mediumorchid: 0xba55d3,
        mediumpurple: 0x9370db,
        mediumseagreen: 0x3cb371,
        mediumslateblue: 0x7b68ee,
        mediumspringgreen: 0x00fa9a,
        mediumturquoise: 0x48d1cc,
        mediumvioletred: 0xc71585,
        midnightblue: 0x191970,
        mintcream: 0xf5fffa,
        mistyrose: 0xffe4e1,
        moccasin: 0xffe4b5,
        navajowhite: 0xffdead,
        navy: 0x000080,
        oldlace: 0xfdf5e6,
        olive: 0x808000,
        olivedrab: 0x6b8e23,
        orange: 0xffa500,
        orangered: 0xff4500,
        orchid: 0xda70d6,
        palegoldenrod: 0xeee8aa,
        palegreen: 0x98fb98,
        paleturquoise: 0xafeeee,
        palevioletred: 0xdb7093,
        papayawhip: 0xffefd5,
        peachpuff: 0xffdab9,
        peru: 0xcd853f,
        pink: 0xffc0cb,
        plum: 0xdda0dd,
        powderblue: 0xb0e0e6,
        purple: 0x800080,
        rebeccapurple: 0x663399,
        red: 0xff0000,
        rosybrown: 0xbc8f8f,
        royalblue: 0x4169e1,
        saddlebrown: 0x8b4513,
        salmon: 0xfa8072,
        sandybrown: 0xf4a460,
        seagreen: 0x2e8b57,
        seashell: 0xfff5ee,
        sienna: 0xa0522d,
        silver: 0xc0c0c0,
        skyblue: 0x87ceeb,
        slateblue: 0x6a5acd,
        slategray: 0x708090,
        slategrey: 0x708090,
        snow: 0xfffafa,
        springgreen: 0x00ff7f,
        steelblue: 0x4682b4,
        tan: 0xd2b48c,
        teal: 0x008080,
        thistle: 0xd8bfd8,
        tomato: 0xff6347,
        turquoise: 0x40e0d0,
        violet: 0xee82ee,
        wheat: 0xf5deb3,
        white: 0xffffff,
        whitesmoke: 0xf5f5f5,
        yellow: 0xffff00,
        yellowgreen: 0x9acd32
    };

    define$2(Color$2, color$2, {
        displayable: function() {
            return this.rgb().displayable();
        },
        toString: function() {
            return this.rgb() + "";
        }
    });

    function color$2(format) {
        var m;
        format = (format + "").trim().toLowerCase();
        return (m = reHex3$2.exec(format)) ? (m = parseInt(m[1], 16), new Rgb$2((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
            : (m = reHex6$2.exec(format)) ? rgbn$2(parseInt(m[1], 16)) // #ff0000
                : (m = reRgbInteger$2.exec(format)) ? new Rgb$2(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
                    : (m = reRgbPercent$2.exec(format)) ? new Rgb$2(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
                        : (m = reRgbaInteger$2.exec(format)) ? rgba$2(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
                            : (m = reRgbaPercent$2.exec(format)) ? rgba$2(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
                                : (m = reHslPercent$2.exec(format)) ? hsla$2(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
                                    : (m = reHslaPercent$2.exec(format)) ? hsla$2(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
                                        : named$2.hasOwnProperty(format) ? rgbn$2(named$2[format])
                                            : format === "transparent" ? new Rgb$2(NaN, NaN, NaN, 0)
                                                : null;
    }

    function rgbn$2(n) {
        return new Rgb$2(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba$2(r, g, b, a) {
        if (a <= 0) r = g = b = NaN;
        return new Rgb$2(r, g, b, a);
    }

    function rgbConvert$2(o) {
        if (!(o instanceof Color$2)) o = color$2(o);
        if (!o) return new Rgb$2;
        o = o.rgb();
        return new Rgb$2(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
        return arguments.length === 1 ? rgbConvert$2(r) : new Rgb$2(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb$2(r, g, b, opacity) {
        this.r = +r;
        this.g = +g;
        this.b = +b;
        this.opacity = +opacity;
    }

    define$2(Rgb$2, rgb$1, extend$2(Color$2, {
        brighter: function(k) {
            k = k == null ? brighter$2 : Math.pow(brighter$2, k);
            return new Rgb$2(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker$2 : Math.pow(darker$2, k);
            return new Rgb$2(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        rgb: function() {
            return this;
        },
        displayable: function() {
            return (0 <= this.r && this.r <= 255)
                && (0 <= this.g && this.g <= 255)
                && (0 <= this.b && this.b <= 255)
                && (0 <= this.opacity && this.opacity <= 1);
        },
        toString: function() {
            var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
            return (a === 1 ? "rgb(" : "rgba(")
                + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
                + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
                + Math.max(0, Math.min(255, Math.round(this.b) || 0))
                + (a === 1 ? ")" : ", " + a + ")");
        }
    }));

    function hsla$2(h, s, l, a) {
        if (a <= 0) h = s = l = NaN;
        else if (l <= 0 || l >= 1) h = s = NaN;
        else if (s <= 0) h = NaN;
        return new Hsl$2(h, s, l, a);
    }

    function hslConvert$2(o) {
        if (o instanceof Hsl$2) return new Hsl$2(o.h, o.s, o.l, o.opacity);
        if (!(o instanceof Color$2)) o = color$2(o);
        if (!o) return new Hsl$2;
        if (o instanceof Hsl$2) return o;
        o = o.rgb();
        var r = o.r / 255,
            g = o.g / 255,
            b = o.b / 255,
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            h = NaN,
            s = max - min,
            l = (max + min) / 2;
        if (s) {
            if (r === max) h = (g - b) / s + (g < b) * 6;
            else if (g === max) h = (b - r) / s + 2;
            else h = (r - g) / s + 4;
            s /= l < 0.5 ? max + min : 2 - max - min;
            h *= 60;
        } else {
            s = l > 0 && l < 1 ? 0 : h;
        }
        return new Hsl$2(h, s, l, o.opacity);
    }

    function hsl$3(h, s, l, opacity) {
        return arguments.length === 1 ? hslConvert$2(h) : new Hsl$2(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl$2(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    }

    define$2(Hsl$2, hsl$3, extend$2(Color$2, {
        brighter: function(k) {
            k = k == null ? brighter$2 : Math.pow(brighter$2, k);
            return new Hsl$2(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker$2 : Math.pow(darker$2, k);
            return new Hsl$2(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = this.h % 360 + (this.h < 0) * 360,
                s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
                l = this.l,
                m2 = l + (l < 0.5 ? l : 1 - l) * s,
                m1 = 2 * l - m2;
            return new Rgb$2(
                hsl2rgb$2(h >= 240 ? h - 240 : h + 120, m1, m2),
                hsl2rgb$2(h, m1, m2),
                hsl2rgb$2(h < 120 ? h + 240 : h - 120, m1, m2),
                this.opacity
            );
        },
        displayable: function() {
            return (0 <= this.s && this.s <= 1 || isNaN(this.s))
                && (0 <= this.l && this.l <= 1)
                && (0 <= this.opacity && this.opacity <= 1);
        }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb$2(h, m1, m2) {
        return (h < 60 ? m1 + (m2 - m1) * h / 60
                : h < 180 ? m2
                    : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
                        : m1) * 255;
    }

    var deg2rad$2 = Math.PI / 180;
    var rad2deg$2 = 180 / Math.PI;

    var Kn$2 = 18;
    var Xn$2 = 0.950470;
    var Yn$2 = 1;
    var Zn$2 = 1.088830;
    var t0$3 = 4 / 29;
    var t1$3 = 6 / 29;
    var t2$2 = 3 * t1$3 * t1$3;
    var t3$2 = t1$3 * t1$3 * t1$3;
    function labConvert$2(o) {
        if (o instanceof Lab$2) return new Lab$2(o.l, o.a, o.b, o.opacity);
        if (o instanceof Hcl$2) {
            var h = o.h * deg2rad$2;
            return new Lab$2(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
        }
        if (!(o instanceof Rgb$2)) o = rgbConvert$2(o);
        var b = rgb2xyz$2(o.r),
            a = rgb2xyz$2(o.g),
            l = rgb2xyz$2(o.b),
            x = xyz2lab$2((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn$2),
            y = xyz2lab$2((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn$2),
            z = xyz2lab$2((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn$2);
        return new Lab$2(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab$3(l, a, b, opacity) {
        return arguments.length === 1 ? labConvert$2(l) : new Lab$2(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab$2(l, a, b, opacity) {
        this.l = +l;
        this.a = +a;
        this.b = +b;
        this.opacity = +opacity;
    }

    define$2(Lab$2, lab$3, extend$2(Color$2, {
        brighter: function(k) {
            return new Lab$2(this.l + Kn$2 * (k == null ? 1 : k), this.a, this.b, this.opacity);
        },
        darker: function(k) {
            return new Lab$2(this.l - Kn$2 * (k == null ? 1 : k), this.a, this.b, this.opacity);
        },
        rgb: function() {
            var y = (this.l + 16) / 116,
                x = isNaN(this.a) ? y : y + this.a / 500,
                z = isNaN(this.b) ? y : y - this.b / 200;
            y = Yn$2 * lab2xyz$2(y);
            x = Xn$2 * lab2xyz$2(x);
            z = Zn$2 * lab2xyz$2(z);
            return new Rgb$2(
                xyz2rgb$2( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
                xyz2rgb$2(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
                xyz2rgb$2( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
                this.opacity
            );
        }
    }));

    function xyz2lab$2(t) {
        return t > t3$2 ? Math.pow(t, 1 / 3) : t / t2$2 + t0$3;
    }

    function lab2xyz$2(t) {
        return t > t1$3 ? t * t * t : t2$2 * (t - t0$3);
    }

    function xyz2rgb$2(x) {
        return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2xyz$2(x) {
        return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert$2(o) {
        if (o instanceof Hcl$2) return new Hcl$2(o.h, o.c, o.l, o.opacity);
        if (!(o instanceof Lab$2)) o = labConvert$2(o);
        var h = Math.atan2(o.b, o.a) * rad2deg$2;
        return new Hcl$2(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function hcl$3(h, c, l, opacity) {
        return arguments.length === 1 ? hclConvert$2(h) : new Hcl$2(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl$2(h, c, l, opacity) {
        this.h = +h;
        this.c = +c;
        this.l = +l;
        this.opacity = +opacity;
    }

    define$2(Hcl$2, hcl$3, extend$2(Color$2, {
        brighter: function(k) {
            return new Hcl$2(this.h, this.c, this.l + Kn$2 * (k == null ? 1 : k), this.opacity);
        },
        darker: function(k) {
            return new Hcl$2(this.h, this.c, this.l - Kn$2 * (k == null ? 1 : k), this.opacity);
        },
        rgb: function() {
            return labConvert$2(this).rgb();
        }
    }));

    var A$2 = -0.14861;
    var B$2 = +1.78277;
    var C$2 = -0.29227;
    var D$2 = -0.90649;
    var E$2 = +1.97294;
    var ED$2 = E$2 * D$2;
    var EB$2 = E$2 * B$2;
    var BC_DA$2 = B$2 * C$2 - D$2 * A$2;
    function cubehelixConvert$2(o) {
        if (o instanceof Cubehelix$2) return new Cubehelix$2(o.h, o.s, o.l, o.opacity);
        if (!(o instanceof Rgb$2)) o = rgbConvert$2(o);
        var r = o.r / 255,
            g = o.g / 255,
            b = o.b / 255,
            l = (BC_DA$2 * b + ED$2 * r - EB$2 * g) / (BC_DA$2 + ED$2 - EB$2),
            bl = b - l,
            k = (E$2 * (g - l) - C$2 * bl) / D$2,
            s = Math.sqrt(k * k + bl * bl) / (E$2 * l * (1 - l)), // NaN if l=0 or l=1
            h = s ? Math.atan2(k, bl) * rad2deg$2 - 120 : NaN;
        return new Cubehelix$2(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix$5(h, s, l, opacity) {
        return arguments.length === 1 ? cubehelixConvert$2(h) : new Cubehelix$2(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix$2(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    }

    define$2(Cubehelix$2, cubehelix$5, extend$2(Color$2, {
        brighter: function(k) {
            k = k == null ? brighter$2 : Math.pow(brighter$2, k);
            return new Cubehelix$2(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            k = k == null ? darker$2 : Math.pow(darker$2, k);
            return new Cubehelix$2(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad$2,
                l = +this.l,
                a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
                cosh = Math.cos(h),
                sinh = Math.sin(h);
            return new Rgb$2(
                255 * (l + a * (A$2 * cosh + B$2 * sinh)),
                255 * (l + a * (C$2 * cosh + D$2 * sinh)),
                255 * (l + a * (E$2 * cosh)),
                this.opacity
            );
        }
    }));

    function interpolate(a, b) {
        var c;
        return (typeof b === "number" ? interpolateNumber
            : b instanceof color$2 ? interpolateRgb
                : (c = color$2(b)) ? (b = c, interpolateRgb)
                    : interpolateString)(a, b);
    }

    function attrRemove$1(name) {
        return function() {
            this.removeAttribute(name);
        };
    }

    function attrRemoveNS$1(fullname) {
        return function() {
            this.removeAttributeNS(fullname.space, fullname.local);
        };
    }

    function attrConstant$1(name, interpolate, value1) {
        var value00,
            interpolate0;
        return function() {
            var value0 = this.getAttribute(name);
            return value0 === value1 ? null
                : value0 === value00 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value1);
        };
    }

    function attrConstantNS$1(fullname, interpolate, value1) {
        var value00,
            interpolate0;
        return function() {
            var value0 = this.getAttributeNS(fullname.space, fullname.local);
            return value0 === value1 ? null
                : value0 === value00 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value1);
        };
    }

    function attrFunction$1(name, interpolate, value) {
        var value00,
            value10,
            interpolate0;
        return function() {
            var value0, value1 = value(this);
            if (value1 == null) return void this.removeAttribute(name);
            value0 = this.getAttribute(name);
            return value0 === value1 ? null
                : value0 === value00 && value1 === value10 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value10 = value1);
        };
    }

    function attrFunctionNS$1(fullname, interpolate, value) {
        var value00,
            value10,
            interpolate0;
        return function() {
            var value0, value1 = value(this);
            if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
            value0 = this.getAttributeNS(fullname.space, fullname.local);
            return value0 === value1 ? null
                : value0 === value00 && value1 === value10 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value10 = value1);
        };
    }

    function transition_attr(name, value) {
        var fullname = namespace(name), i = fullname === "transform" ? interpolateTransform$2 : interpolate;
        return this.attrTween(name, typeof value === "function"
            ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
            : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
                : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value + ""));
    }

    function attrTweenNS(fullname, value) {
        function tween() {
            var node = this, i = value.apply(node, arguments);
            return i && function(t) {
                    node.setAttributeNS(fullname.space, fullname.local, i(t));
                };
        }
        tween._value = value;
        return tween;
    }

    function attrTween(name, value) {
        function tween() {
            var node = this, i = value.apply(node, arguments);
            return i && function(t) {
                    node.setAttribute(name, i(t));
                };
        }
        tween._value = value;
        return tween;
    }

    function transition_attrTween(name, value) {
        var key = "attr." + name;
        if (arguments.length < 2) return (key = this.tween(key)) && key._value;
        if (value == null) return this.tween(key, null);
        if (typeof value !== "function") throw new Error;
        var fullname = namespace(name);
        return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    }

    function delayFunction(id, value) {
        return function() {
            init(this, id).delay = +value.apply(this, arguments);
        };
    }

    function delayConstant(id, value) {
        return value = +value, function() {
            init(this, id).delay = value;
        };
    }

    function transition_delay(value) {
        var id = this._id;

        return arguments.length
            ? this.each((typeof value === "function"
                ? delayFunction
                : delayConstant)(id, value))
            : get(this.node(), id).delay;
    }

    function durationFunction(id, value) {
        return function() {
            set$1(this, id).duration = +value.apply(this, arguments);
        };
    }

    function durationConstant(id, value) {
        return value = +value, function() {
            set$1(this, id).duration = value;
        };
    }

    function transition_duration(value) {
        var id = this._id;

        return arguments.length
            ? this.each((typeof value === "function"
                ? durationFunction
                : durationConstant)(id, value))
            : get(this.node(), id).duration;
    }

    function easeConstant(id, value) {
        if (typeof value !== "function") throw new Error;
        return function() {
            set$1(this, id).ease = value;
        };
    }

    function transition_ease(value) {
        var id = this._id;

        return arguments.length
            ? this.each(easeConstant(id, value))
            : get(this.node(), id).ease;
    }

    function transition_filter(match) {
        if (typeof match !== "function") match = matcher$1(match);

        for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
                if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                    subgroup.push(node);
                }
            }
        }

        return new Transition(subgroups, this._parents, this._name, this._id);
    }

    function transition_merge(transition) {
        if (transition._id !== this._id) throw new Error;

        for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
            for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
                if (node = group0[i] || group1[i]) {
                    merge[i] = node;
                }
            }
        }

        for (; j < m0; ++j) {
            merges[j] = groups0[j];
        }

        return new Transition(merges, this._parents, this._name, this._id);
    }

    function start(name) {
        return (name + "").trim().split(/^|\s+/).every(function(t) {
            var i = t.indexOf(".");
            if (i >= 0) t = t.slice(0, i);
            return !t || t === "start";
        });
    }

    function onFunction(id, name, listener) {
        var on0, on1, sit = start(name) ? init : set$1;
        return function() {
            var schedule = sit(this, id),
                on = schedule.on;

            // If this node shared a dispatch with the previous node,
            // just assign the updated shared dispatch and we’re done!
            // Otherwise, copy-on-write.
            if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

            schedule.on = on1;
        };
    }

    function transition_on(name, listener) {
        var id = this._id;

        return arguments.length < 2
            ? get(this.node(), id).on.on(name)
            : this.each(onFunction(id, name, listener));
    }

    function removeFunction(id) {
        return function() {
            var parent = this.parentNode;
            for (var i in this.__transition) if (+i !== id) return;
            if (parent) parent.removeChild(this);
        };
    }

    function transition_remove() {
        return this.on("end.remove", removeFunction(this._id));
    }

    function transition_select(select) {
        var name = this._name,
            id = this._id;

        if (typeof select !== "function") select = selector(select);

        for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
                if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                    if ("__data__" in node) subnode.__data__ = node.__data__;
                    subgroup[i] = subnode;
                    schedule(subgroup[i], name, id, i, subgroup, get(node, id));
                }
            }
        }

        return new Transition(subgroups, this._parents, name, id);
    }

    function transition_selectAll(select) {
        var name = this._name,
            id = this._id;

        if (typeof select !== "function") select = selectorAll(select);

        for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
                if (node = group[i]) {
                    for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
                        if (child = children[k]) {
                            schedule(child, name, id, k, children, inherit);
                        }
                    }
                    subgroups.push(children);
                    parents.push(node);
                }
            }
        }

        return new Transition(subgroups, parents, name, id);
    }

    var Selection$1 = selection.prototype.constructor;

    function transition_selection() {
        return new Selection$1(this._groups, this._parents);
    }

    function styleRemove$1(name, interpolate) {
        var value00,
            value10,
            interpolate0;
        return function() {
            var value0 = style(this, name),
                value1 = (this.style.removeProperty(name), style(this, name));
            return value0 === value1 ? null
                : value0 === value00 && value1 === value10 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value10 = value1);
        };
    }

    function styleRemoveEnd(name) {
        return function() {
            this.style.removeProperty(name);
        };
    }

    function styleConstant$1(name, interpolate, value1) {
        var value00,
            interpolate0;
        return function() {
            var value0 = style(this, name);
            return value0 === value1 ? null
                : value0 === value00 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value1);
        };
    }

    function styleFunction$1(name, interpolate, value) {
        var value00,
            value10,
            interpolate0;
        return function() {
            var value0 = style(this, name),
                value1 = value(this);
            if (value1 == null) value1 = (this.style.removeProperty(name), style(this, name));
            return value0 === value1 ? null
                : value0 === value00 && value1 === value10 ? interpolate0
                    : interpolate0 = interpolate(value00 = value0, value10 = value1);
        };
    }

    function transition_style(name, value, priority) {
        var i = (name += "") === "transform" ? interpolateTransform$1 : interpolate;
        return value == null ? this
            .styleTween(name, styleRemove$1(name, i))
            .on("end.style." + name, styleRemoveEnd(name))
            : this.styleTween(name, typeof value === "function"
                ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
                : styleConstant$1(name, i, value + ""), priority);
    }

    function styleTween(name, value, priority) {
        function tween() {
            var node = this, i = value.apply(node, arguments);
            return i && function(t) {
                    node.style.setProperty(name, i(t), priority);
                };
        }
        tween._value = value;
        return tween;
    }

    function transition_styleTween(name, value, priority) {
        var key = "style." + (name += "");
        if (arguments.length < 2) return (key = this.tween(key)) && key._value;
        if (value == null) return this.tween(key, null);
        if (typeof value !== "function") throw new Error;
        return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    }

    function textConstant$1(value) {
        return function() {
            this.textContent = value;
        };
    }

    function textFunction$1(value) {
        return function() {
            var value1 = value(this);
            this.textContent = value1 == null ? "" : value1;
        };
    }

    function transition_text(value) {
        return this.tween("text", typeof value === "function"
            ? textFunction$1(tweenValue(this, "text", value))
            : textConstant$1(value == null ? "" : value + ""));
    }

    function transition_transition() {
        var name = this._name,
            id0 = this._id,
            id1 = newId();

        for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
                if (node = group[i]) {
                    var inherit = get(node, id0);
                    schedule(node, name, id1, i, group, {
                        time: inherit.time + inherit.delay + inherit.duration,
                        delay: 0,
                        duration: inherit.duration,
                        ease: inherit.ease
                    });
                }
            }
        }

        return new Transition(groups, this._parents, name, id1);
    }

    var id = 0;

    function Transition(groups, parents, name, id) {
        this._groups = groups;
        this._parents = parents;
        this._name = name;
        this._id = id;
    }

    function transition(name) {
        return selection().transition(name);
    }

    function newId() {
        return ++id;
    }

    var selection_prototype = selection.prototype;

    Transition.prototype = transition.prototype = {
        constructor: Transition,
        select: transition_select,
        selectAll: transition_selectAll,
        filter: transition_filter,
        merge: transition_merge,
        selection: transition_selection,
        transition: transition_transition,
        call: selection_prototype.call,
        nodes: selection_prototype.nodes,
        node: selection_prototype.node,
        size: selection_prototype.size,
        empty: selection_prototype.empty,
        each: selection_prototype.each,
        on: transition_on,
        attr: transition_attr,
        attrTween: transition_attrTween,
        style: transition_style,
        styleTween: transition_styleTween,
        text: transition_text,
        remove: transition_remove,
        tween: transition_tween,
        delay: transition_delay,
        duration: transition_duration,
        ease: transition_ease
    };

    function cubicInOut(t) {
        return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }

    var exponent$1 = 3;

    var polyIn = (function custom(e) {
        e = +e;

        function polyIn(t) {
            return Math.pow(t, e);
        }

        polyIn.exponent = custom;

        return polyIn;
    })(exponent$1);

    var polyOut = (function custom(e) {
        e = +e;

        function polyOut(t) {
            return 1 - Math.pow(1 - t, e);
        }

        polyOut.exponent = custom;

        return polyOut;
    })(exponent$1);

    var polyInOut = (function custom(e) {
        e = +e;

        function polyInOut(t) {
            return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
        }

        polyInOut.exponent = custom;

        return polyInOut;
    })(exponent$1);

    var overshoot = 1.70158;

    var backIn = (function custom(s) {
        s = +s;

        function backIn(t) {
            return t * t * ((s + 1) * t - s);
        }

        backIn.overshoot = custom;

        return backIn;
    })(overshoot);

    var backOut = (function custom(s) {
        s = +s;

        function backOut(t) {
            return --t * t * ((s + 1) * t + s) + 1;
        }

        backOut.overshoot = custom;

        return backOut;
    })(overshoot);

    var backInOut = (function custom(s) {
        s = +s;

        function backInOut(t) {
            return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
        }

        backInOut.overshoot = custom;

        return backInOut;
    })(overshoot);

    var tau$2 = 2 * Math.PI;
    var amplitude = 1;
    var period = 0.3;
    var elasticIn = (function custom(a, p) {
        var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

        function elasticIn(t) {
            return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
        }

        elasticIn.amplitude = function(a) { return custom(a, p * tau$2); };
        elasticIn.period = function(p) { return custom(a, p); };

        return elasticIn;
    })(amplitude, period);

    var elasticOut = (function custom(a, p) {
        var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

        function elasticOut(t) {
            return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
        }

        elasticOut.amplitude = function(a) { return custom(a, p * tau$2); };
        elasticOut.period = function(p) { return custom(a, p); };

        return elasticOut;
    })(amplitude, period);

    var elasticInOut = (function custom(a, p) {
        var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

        function elasticInOut(t) {
            return ((t = t * 2 - 1) < 0
                    ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
                    : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
        }

        elasticInOut.amplitude = function(a) { return custom(a, p * tau$2); };
        elasticInOut.period = function(p) { return custom(a, p); };

        return elasticInOut;
    })(amplitude, period);

    var defaultTiming = {
        time: null, // Set on use.
        delay: 0,
        duration: 250,
        ease: cubicInOut
    };

    function inherit(node, id) {
        var timing;
        while (!(timing = node.__transition) || !(timing = timing[id])) {
            if (!(node = node.parentNode)) {
                return defaultTiming.time = now(), defaultTiming;
            }
        }
        return timing;
    }

    function selection_transition(name) {
        var id,
            timing;

        if (name instanceof Transition) {
            id = name._id, name = name._name;
        } else {
            id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
        }

        for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
            for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
                if (node = group[i]) {
                    schedule(node, name, id, i, group, timing || inherit(node, id));
                }
            }
        }

        return new Transition(groups, this._parents, name, id);
    }

    selection.prototype.interrupt = selection_interrupt;
    selection.prototype.transition = selection_transition;

    var root$1 = [null];

    function active(node, name) {
        var schedules = node.__transition,
            schedule,
            i;

        if (schedules) {
            name = name == null ? null : name + "";
            for (i in schedules) {
                if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
                    return new Transition([[node]], root$1, name, +i);
                }
            }
        }

        return null;
    }

    exports.creator = creator;
    exports.local = local;
    exports.matcher = matcher$1;
    exports.mouse = mouse;
    exports.namespace = namespace;
    exports.namespaces = namespaces;
    exports.select = select;
    exports.selectAll = selectAll;
    exports.selection = selection;
    exports.selector = selector;
    exports.selectorAll = selectorAll;
    exports.style = style;
    exports.touch = touch;
    exports.touches = touches;
    exports.window = defaultView;
    exports.customEvent = customEvent;
    exports.bisect = bisectRight;
    exports.bisectRight = bisectRight;
    exports.bisectLeft = bisectLeft;
    exports.ascending = ascending$1;
    exports.bisector = bisector;
    exports.cross = cross;
    exports.descending = descending;
    exports.deviation = deviation;
    exports.extent = extent;
    exports.histogram = histogram;
    exports.thresholdFreedmanDiaconis = freedmanDiaconis;
    exports.thresholdScott = scott;
    exports.thresholdSturges = sturges;
    exports.max = max;
    exports.mean = mean;
    exports.median = median;
    exports.merge = merge;
    exports.min = min;
    exports.pairs = pairs;
    exports.permute = permute;
    exports.quantile = threshold;
    exports.range = sequence;
    exports.scan = scan;
    exports.shuffle = shuffle;
    exports.sum = sum;
    exports.ticks = ticks;
    exports.tickIncrement = tickIncrement;
    exports.tickStep = tickStep;
    exports.transpose = transpose;
    exports.variance = variance;
    exports.zip = zip;
    exports.scaleBand = band;
    exports.scalePoint = point$1;
    exports.scaleIdentity = identity$1;
    exports.scaleLinear = linear;
    exports.scaleLog = log;
    exports.scaleOrdinal = ordinal;
    exports.scaleImplicit = implicit;
    exports.scalePow = pow;
    exports.scaleSqrt = sqrt;
    exports.scaleQuantile = quantile;
    exports.scaleQuantize = quantize$1;
    exports.scaleThreshold = threshold$1;
    exports.scaleTime = time;
    exports.scaleUtc = utcTime;
    exports.schemeCategory10 = category10;
    exports.schemeCategory20b = category20b;
    exports.schemeCategory20c = category20c;
    exports.schemeCategory20 = category20;
    exports.interpolateCubehelixDefault = cubehelix$3;
    exports.interpolateRainbow = rainbow$1;
    exports.interpolateWarm = warm;
    exports.interpolateCool = cool;
    exports.interpolateViridis = viridis;
    exports.interpolateMagma = magma;
    exports.interpolateInferno = inferno;
    exports.interpolatePlasma = plasma;
    exports.scaleSequential = sequential;
    exports.arc = arc;
    exports.area = area;
    exports.line = line;
    exports.pie = pie;
    exports.areaRadial = areaRadial;
    exports.radialArea = areaRadial;
    exports.lineRadial = lineRadial$1;
    exports.radialLine = lineRadial$1;
    exports.pointRadial = pointRadial;
    exports.linkHorizontal = linkHorizontal;
    exports.linkVertical = linkVertical;
    exports.linkRadial = linkRadial;
    exports.symbol = symbol;
    exports.symbols = symbols;
    exports.symbolCircle = circle;
    exports.symbolCross = cross$1;
    exports.symbolDiamond = diamond;
    exports.symbolSquare = square;
    exports.symbolStar = star;
    exports.symbolTriangle = triangle;
    exports.symbolWye = wye;
    exports.curveBasisClosed = basisClosed$1;
    exports.curveBasisOpen = basisOpen;
    exports.curveBasis = basis$2;
    exports.curveBundle = bundle;
    exports.curveCardinalClosed = cardinalClosed;
    exports.curveCardinalOpen = cardinalOpen;
    exports.curveCardinal = cardinal;
    exports.curveCatmullRomClosed = catmullRomClosed;
    exports.curveCatmullRomOpen = catmullRomOpen;
    exports.curveCatmullRom = catmullRom;
    exports.curveLinearClosed = linearClosed;
    exports.curveLinear = curveLinear;
    exports.curveMonotoneX = monotoneX;
    exports.curveMonotoneY = monotoneY;
    exports.curveNatural = natural;
    exports.curveStep = step;
    exports.curveStepAfter = stepAfter;
    exports.curveStepBefore = stepBefore;
    exports.stack = stack;
    exports.stackOffsetExpand = expand;
    exports.stackOffsetDiverging = diverging;
    exports.stackOffsetNone = none$1;
    exports.stackOffsetSilhouette = silhouette;
    exports.stackOffsetWiggle = wiggle;
    exports.stackOrderAscending = ascending$2;
    exports.stackOrderDescending = descending$2;
    exports.stackOrderInsideOut = insideOut;
    exports.stackOrderNone = none$2;
    exports.stackOrderReverse = reverse;
    exports.axisTop = axisTop;
    exports.axisRight = axisRight;
    exports.axisBottom = axisBottom;
    exports.axisLeft = axisLeft;
    exports.nest = nest;
    exports.set = set;
    exports.map = map$1;
    exports.keys = keys;
    exports.values = values;
    exports.entries = entries;
    exports.transition = transition;
    exports.active = active;
    exports.interrupt = interrupt;
    exports.interpolate = interpolateValue;
    exports.interpolateArray = array$2;
    exports.interpolateBasis = basis$1;
    exports.interpolateBasisClosed = basisClosed;
    exports.interpolateDate = date;
    exports.interpolateNumber = interpolateNumber;
    exports.interpolateObject = object;
    exports.interpolateRound = interpolateRound;
    exports.interpolateString = interpolateString;
    exports.interpolateTransformCss = interpolateTransform$1;
    exports.interpolateTransformSvg = interpolateTransform$2;
    exports.interpolateZoom = zoom;
    exports.interpolateRgb = interpolateRgb;
    exports.interpolateRgbBasis = rgbBasis;
    exports.interpolateRgbBasisClosed = rgbBasisClosed;
    exports.interpolateHsl = hsl$1;
    exports.interpolateHslLong = hslLong;
    exports.interpolateLab = lab$1;
    exports.interpolateHcl = hcl$1;
    exports.interpolateHclLong = hclLong;
    exports.interpolateCubehelix = cubehelix$2;
    exports.interpolateCubehelixLong = interpolateCubehelixLong;
    exports.quantize = quantize;
    exports.formatDefaultLocale = defaultLocale;
    exports.formatLocale = formatLocale;
    exports.formatSpecifier = formatSpecifier;
    exports.precisionFixed = precisionFixed;
    exports.precisionPrefix = precisionPrefix;
    exports.precisionRound = precisionRound;

    Object.defineProperty(exports, '__esModule', { value: true });

    // [OT] Return exports variable
    return exports;

});