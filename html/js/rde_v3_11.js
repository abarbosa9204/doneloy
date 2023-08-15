!function(a, b) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document)
            throw new Error("jQuery requires a window with a document");
        return b(a)
    }
    : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    "use strict";
    var c = []
      , d = a.document
      , e = Object.getPrototypeOf
      , f = c.slice
      , g = c.concat
      , h = c.push
      , i = c.indexOf
      , j = {}
      , k = j.toString
      , l = j.hasOwnProperty
      , m = l.toString
      , n = m.call(Object)
      , o = {};
    function p(a, b) {
        b = b || d;
        var c = b.createElement("script");
        c.text = a,
        b.head.appendChild(c).parentNode.removeChild(c)
    }
    var q = "3.1.1"
      , r = function(a, b) {
        return new r.fn.init(a,b)
    }
      , s = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , t = /^-ms-/
      , u = /-([a-z])/g
      , v = function(a, b) {
        return b.toUpperCase()
    };
    r.fn = r.prototype = {
        jquery: q,
        constructor: r,
        length: 0,
        toArray: function() {
            return f.call(this)
        },
        get: function(a) {
            return null == a ? f.call(this) : a < 0 ? this[a + this.length] : this[a]
        },
        pushStack: function(a) {
            var b = r.merge(this.constructor(), a);
            return b.prevObject = this,
            b
        },
        each: function(a) {
            return r.each(this, a)
        },
        map: function(a) {
            return this.pushStack(r.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(f.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length
              , c = +a + (a < 0 ? b : 0);
            return this.pushStack(c >= 0 && c < b ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: h,
        sort: c.sort,
        splice: c.splice
    },
    r.extend = r.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g,
        g = arguments[h] || {},
        h++),
        "object" == typeof g || r.isFunction(g) || (g = {}),
        h === i && (g = this,
        h--); h < i; h++)
            if (null != (a = arguments[h]))
                for (b in a)
                    c = g[b],
                    d = a[b],
                    g !== d && (j && d && (r.isPlainObject(d) || (e = r.isArray(d))) ? (e ? (e = !1,
                    f = c && r.isArray(c) ? c : []) : f = c && r.isPlainObject(c) ? c : {},
                    g[b] = r.extend(j, f, d)) : void 0 !== d && (g[b] = d));
        return g
    }
    ,
    r.extend({
        expando: "jQuery" + (q + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === r.type(a)
        },
        isArray: Array.isArray,
        isWindow: function(a) {
            return null != a && a === a.window
        },
        isNumeric: function(a) {
            var b = r.type(a);
            return ("number" === b || "string" === b) && !isNaN(a - parseFloat(a))
        },
        isPlainObject: function(a) {
            var b, c;
            return !(!a || "[object Object]" !== k.call(a)) && (!(b = e(a)) || (c = l.call(b, "constructor") && b.constructor,
            "function" == typeof c && m.call(c) === n))
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a)
                return !1;
            return !0
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? j[k.call(a)] || "object" : typeof a
        },
        globalEval: function(a) {
            p(a)
        },
        camelCase: function(a) {
            return a.replace(t, "ms-").replace(u, v)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b) {
            var c, d = 0;
            if (w(a)) {
                for (c = a.length; d < c; d++)
                    if (b.call(a[d], d, a[d]) === !1)
                        break
            } else
                for (d in a)
                    if (b.call(a[d], d, a[d]) === !1)
                        break;
            return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(s, "")
        },
        makeArray: function(a, b) {
            var c = b || [];
            return null != a && (w(Object(a)) ? r.merge(c, "string" == typeof a ? [a] : a) : h.call(c, a)),
            c
        },
        inArray: function(a, b, c) {
            return null == b ? -1 : i.call(b, a, c)
        },
        merge: function(a, b) {
            for (var c = +b.length, d = 0, e = a.length; d < c; d++)
                a[e++] = b[d];
            return a.length = e,
            a
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++)
                d = !b(a[f], f),
                d !== h && e.push(a[f]);
            return e
        },
        map: function(a, b, c) {
            var d, e, f = 0, h = [];
            if (w(a))
                for (d = a.length; f < d; f++)
                    e = b(a[f], f, c),
                    null != e && h.push(e);
            else
                for (f in a)
                    e = b(a[f], f, c),
                    null != e && h.push(e);
            return g.apply([], h)
        },
        guid: 1,
        proxy: function(a, b) {
            var c, d, e;
            if ("string" == typeof b && (c = a[b],
            b = a,
            a = c),
            r.isFunction(a))
                return d = f.call(arguments, 2),
                e = function() {
                    return a.apply(b || this, d.concat(f.call(arguments)))
                }
                ,
                e.guid = a.guid = a.guid || r.guid++,
                e
        },
        now: Date.now,
        support: o
    }),
    "function" == typeof Symbol && (r.fn[Symbol.iterator] = c[Symbol.iterator]),
    r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(a, b) {
        j["[object " + b + "]"] = b.toLowerCase()
    });
    function w(a) {
        var b = !!a && "length"in a && a.length
          , c = r.type(a);
        return "function" !== c && !r.isWindow(a) && ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a)
    }
    var x = function(a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date, v = a.document, w = 0, x = 0, y = ha(), z = ha(), A = ha(), B = function(a, b) {
            return a === b && (l = !0),
            0
        }, C = {}.hasOwnProperty, D = [], E = D.pop, F = D.push, G = D.push, H = D.slice, I = function(a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] === b)
                    return c;
            return -1
        }, J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", K = "[\\x20\\t\\r\\n\\f]", L = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+", M = "\\[" + K + "*(" + L + ")(?:" + K + "*([*^$|!~]?=)" + K + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + L + "))|)" + K + "*\\]", N = ":(" + L + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + M + ")*)|.*)\\)|)", O = new RegExp(K + "+","g"), P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$","g"), Q = new RegExp("^" + K + "*," + K + "*"), R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"), S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]","g"), T = new RegExp(N), U = new RegExp("^" + L + "$"), V = {
            ID: new RegExp("^#(" + L + ")"),
            CLASS: new RegExp("^\\.(" + L + ")"),
            TAG: new RegExp("^(" + L + "|[*])"),
            ATTR: new RegExp("^" + M),
            PSEUDO: new RegExp("^" + N),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)","i"),
            bool: new RegExp("^(?:" + J + ")$","i"),
            needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)","i")
        }, W = /^(?:input|select|textarea|button)$/i, X = /^h\d$/i, Y = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, $ = /[+~]/, _ = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)","ig"), aa = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : d < 0 ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, ba = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ca = function(a, b) {
            return b ? "\0" === a ? "�" : a.slice(0, -1) + "\\" + a.charCodeAt(a.length - 1).toString(16) + " " : "\\" + a
        }, da = function() {
            m()
        }, ea = ta(function(a) {
            return a.disabled === !0 && ("form"in a || "label"in a)
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            G.apply(D = H.call(v.childNodes), v.childNodes),
            D[v.childNodes.length].nodeType
        } catch (fa) {
            G = {
                apply: D.length ? function(a, b) {
                    F.apply(a, H.call(b))
                }
                : function(a, b) {
                    var c = a.length
                      , d = 0;
                    while (a[c++] = b[d++])
                        ;
                    a.length = c - 1
                }
            }
        }
        function ga(a, b, d, e) {
            var f, h, j, k, l, o, r, s = b && b.ownerDocument, w = b ? b.nodeType : 9;
            if (d = d || [],
            "string" != typeof a || !a || 1 !== w && 9 !== w && 11 !== w)
                return d;
            if (!e && ((b ? b.ownerDocument || b : v) !== n && m(b),
            b = b || n,
            p)) {
                if (11 !== w && (l = Z.exec(a)))
                    if (f = l[1]) {
                        if (9 === w) {
                            if (!(j = b.getElementById(f)))
                                return d;
                            if (j.id === f)
                                return d.push(j),
                                d
                        } else if (s && (j = s.getElementById(f)) && t(b, j) && j.id === f)
                            return d.push(j),
                            d
                    } else {
                        if (l[2])
                            return G.apply(d, b.getElementsByTagName(a)),
                            d;
                        if ((f = l[3]) && c.getElementsByClassName && b.getElementsByClassName)
                            return G.apply(d, b.getElementsByClassName(f)),
                            d
                    }
                if (c.qsa && !A[a + " "] && (!q || !q.test(a))) {
                    if (1 !== w)
                        s = b,
                        r = a;
                    else if ("object" !== b.nodeName.toLowerCase()) {
                        (k = b.getAttribute("id")) ? k = k.replace(ba, ca) : b.setAttribute("id", k = u),
                        o = g(a),
                        h = o.length;
                        while (h--)
                            o[h] = "#" + k + " " + sa(o[h]);
                        r = o.join(","),
                        s = $.test(a) && qa(b.parentNode) || b
                    }
                    if (r)
                        try {
                            return G.apply(d, s.querySelectorAll(r)),
                            d
                        } catch (x) {} finally {
                            k === u && b.removeAttribute("id")
                        }
                }
            }
            return i(a.replace(P, "$1"), b, d, e)
        }
        function ha() {
            var a = [];
            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()],
                b[c + " "] = e
            }
            return b
        }
        function ia(a) {
            return a[u] = !0,
            a
        }
        function ja(a) {
            var b = n.createElement("fieldset");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b),
                b = null
            }
        }
        function ka(a, b) {
            var c = a.split("|")
              , e = c.length;
            while (e--)
                d.attrHandle[c[e]] = b
        }
        function la(a, b) {
            var c = b && a
              , d = c && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;
            if (d)
                return d;
            if (c)
                while (c = c.nextSibling)
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function ma(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }
        function na(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function oa(a) {
            return function(b) {
                return "form"in b ? b.parentNode && b.disabled === !1 ? "label"in b ? "label"in b.parentNode ? b.parentNode.disabled === a : b.disabled === a : b.isDisabled === a || b.isDisabled !== !a && ea(b) === a : b.disabled === a : "label"in b && b.disabled === a
            }
        }
        function pa(a) {
            return ia(function(b) {
                return b = +b,
                ia(function(c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--)
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }
        function qa(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        c = ga.support = {},
        f = ga.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return !!b && "HTML" !== b.nodeName
        }
        ,
        m = ga.setDocument = function(a) {
            var b, e, g = a ? a.ownerDocument || a : v;
            return g !== n && 9 === g.nodeType && g.documentElement ? (n = g,
            o = n.documentElement,
            p = !f(n),
            v !== n && (e = n.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", da, !1) : e.attachEvent && e.attachEvent("onunload", da)),
            c.attributes = ja(function(a) {
                return a.className = "i",
                !a.getAttribute("className")
            }),
            c.getElementsByTagName = ja(function(a) {
                return a.appendChild(n.createComment("")),
                !a.getElementsByTagName("*").length
            }),
            c.getElementsByClassName = Y.test(n.getElementsByClassName),
            c.getById = ja(function(a) {
                return o.appendChild(a).id = u,
                !n.getElementsByName || !n.getElementsByName(u).length
            }),
            c.getById ? (d.filter.ID = function(a) {
                var b = a.replace(_, aa);
                return function(a) {
                    return a.getAttribute("id") === b
                }
            }
            ,
            d.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c ? [c] : []
                }
            }
            ) : (d.filter.ID = function(a) {
                var b = a.replace(_, aa);
                return function(a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }
            ,
            d.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c, d, e, f = b.getElementById(a);
                    if (f) {
                        if (c = f.getAttributeNode("id"),
                        c && c.value === a)
                            return [f];
                        e = b.getElementsByName(a),
                        d = 0;
                        while (f = e[d++])
                            if (c = f.getAttributeNode("id"),
                            c && c.value === a)
                                return [f]
                    }
                    return []
                }
            }
            ),
            d.find.TAG = c.getElementsByTagName ? function(a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
            }
            : function(a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++])
                        1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }
            ,
            d.find.CLASS = c.getElementsByClassName && function(a, b) {
                if ("undefined" != typeof b.getElementsByClassName && p)
                    return b.getElementsByClassName(a)
            }
            ,
            r = [],
            q = [],
            (c.qsa = Y.test(n.querySelectorAll)) && (ja(function(a) {
                o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + K + "*(?:''|\"\")"),
                a.querySelectorAll("[selected]").length || q.push("\\[" + K + "*(?:value|" + J + ")"),
                a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="),
                a.querySelectorAll(":checked").length || q.push(":checked"),
                a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
            }),
            ja(function(a) {
                a.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var b = n.createElement("input");
                b.setAttribute("type", "hidden"),
                a.appendChild(b).setAttribute("name", "D"),
                a.querySelectorAll("[name=d]").length && q.push("name" + K + "*[*^$|!~]?="),
                2 !== a.querySelectorAll(":enabled").length && q.push(":enabled", ":disabled"),
                o.appendChild(a).disabled = !0,
                2 !== a.querySelectorAll(":disabled").length && q.push(":enabled", ":disabled"),
                a.querySelectorAll("*,:x"),
                q.push(",.*:")
            })),
            (c.matchesSelector = Y.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ja(function(a) {
                c.disconnectedMatch = s.call(a, "*"),
                s.call(a, "[s!='']:x"),
                r.push("!=", N)
            }),
            q = q.length && new RegExp(q.join("|")),
            r = r.length && new RegExp(r.join("|")),
            b = Y.test(o.compareDocumentPosition),
            t = b || Y.test(o.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a
                  , d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            }
            : function(a, b) {
                if (b)
                    while (b = b.parentNode)
                        if (b === a)
                            return !0;
                return !1
            }
            ,
            B = b ? function(a, b) {
                if (a === b)
                    return l = !0,
                    0;
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
                1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === n || a.ownerDocument === v && t(v, a) ? -1 : b === n || b.ownerDocument === v && t(v, b) ? 1 : k ? I(k, a) - I(k, b) : 0 : 4 & d ? -1 : 1)
            }
            : function(a, b) {
                if (a === b)
                    return l = !0,
                    0;
                var c, d = 0, e = a.parentNode, f = b.parentNode, g = [a], h = [b];
                if (!e || !f)
                    return a === n ? -1 : b === n ? 1 : e ? -1 : f ? 1 : k ? I(k, a) - I(k, b) : 0;
                if (e === f)
                    return la(a, b);
                c = a;
                while (c = c.parentNode)
                    g.unshift(c);
                c = b;
                while (c = c.parentNode)
                    h.unshift(c);
                while (g[d] === h[d])
                    d++;
                return d ? la(g[d], h[d]) : g[d] === v ? -1 : h[d] === v ? 1 : 0
            }
            ,
            n) : n
        }
        ,
        ga.matches = function(a, b) {
            return ga(a, null, null, b)
        }
        ,
        ga.matchesSelector = function(a, b) {
            if ((a.ownerDocument || a) !== n && m(a),
            b = b.replace(S, "='$1']"),
            c.matchesSelector && p && !A[b + " "] && (!r || !r.test(b)) && (!q || !q.test(b)))
                try {
                    var d = s.call(a, b);
                    if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                        return d
                } catch (e) {}
            return ga(b, n, null, [a]).length > 0
        }
        ,
        ga.contains = function(a, b) {
            return (a.ownerDocument || a) !== n && m(a),
            t(a, b)
        }
        ,
        ga.attr = function(a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()]
              , f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
        }
        ,
        ga.escape = function(a) {
            return (a + "").replace(ba, ca)
        }
        ,
        ga.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }
        ,
        ga.uniqueSort = function(a) {
            var b, d = [], e = 0, f = 0;
            if (l = !c.detectDuplicates,
            k = !c.sortStable && a.slice(0),
            a.sort(B),
            l) {
                while (b = a[f++])
                    b === a[f] && (e = d.push(f));
                while (e--)
                    a.splice(d[e], 1)
            }
            return k = null,
            a
        }
        ,
        e = ga.getText = function(a) {
            var b, c = "", d = 0, f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent)
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        c += e(a)
                } else if (3 === f || 4 === f)
                    return a.nodeValue
            } else
                while (b = a[d++])
                    c += e(b);
            return c
        }
        ,
        d = ga.selectors = {
            cacheLength: 50,
            createPseudo: ia,
            match: V,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(_, aa),
                    a[3] = (a[3] || a[4] || a[5] || "").replace(_, aa),
                    "~=" === a[2] && (a[3] = " " + a[3] + " "),
                    a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(),
                    "nth" === a[1].slice(0, 3) ? (a[3] || ga.error(a[0]),
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                    a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && ga.error(a[0]),
                    a
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return V.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && T.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
                    a[2] = c.slice(0, b)),
                    a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(_, aa).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    }
                    : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = y[a + " "];
                    return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && y(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, b, c) {
                    return function(d) {
                        var e = ga.attr(d, a);
                        return null == e ? "!=" === b : !b || (e += "",
                        "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(O, " ") + " ").indexOf(c) > -1 : "|=" === b && (e === c || e.slice(0, c.length + 1) === c + "-"))
                    }
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3)
                      , g = "last" !== a.slice(-4)
                      , h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode
                    }
                    : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h, t = !1;
                        if (q) {
                            if (f) {
                                while (p) {
                                    m = b;
                                    while (m = m[p])
                                        if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType)
                                            return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild],
                            g && s) {
                                m = q,
                                l = m[u] || (m[u] = {}),
                                k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                                j = k[a] || [],
                                n = j[0] === w && j[1],
                                t = n && j[2],
                                m = n && q.childNodes[n];
                                while (m = ++n && m && m[p] || (t = n = 0) || o.pop())
                                    if (1 === m.nodeType && ++t && m === b) {
                                        k[a] = [w, n, t];
                                        break
                                    }
                            } else if (s && (m = b,
                            l = m[u] || (m[u] = {}),
                            k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                            j = k[a] || [],
                            n = j[0] === w && j[1],
                            t = n),
                            t === !1)
                                while (m = ++n && m && m[p] || (t = n = 0) || o.pop())
                                    if ((h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) && ++t && (s && (l = m[u] || (m[u] = {}),
                                    k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                                    k[a] = [w, t]),
                                    m === b))
                                        break;
                            return t -= e,
                            t === d || t % d === 0 && t / d >= 0
                        }
                    }
                },
                PSEUDO: function(a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || ga.error("unsupported pseudo: " + a);
                    return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b],
                    d.setFilters.hasOwnProperty(a.toLowerCase()) ? ia(function(a, c) {
                        var d, f = e(a, b), g = f.length;
                        while (g--)
                            d = I(a, f[g]),
                            a[d] = !(c[d] = f[g])
                    }) : function(a) {
                        return e(a, 0, c)
                    }
                    ) : e
                }
            },
            pseudos: {
                not: ia(function(a) {
                    var b = []
                      , c = []
                      , d = h(a.replace(P, "$1"));
                    return d[u] ? ia(function(a, b, c, e) {
                        var f, g = d(a, null, e, []), h = a.length;
                        while (h--)
                            (f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function(a, e, f) {
                        return b[0] = a,
                        d(b, null, f, c),
                        b[0] = null,
                        !c.pop()
                    }
                }),
                has: ia(function(a) {
                    return function(b) {
                        return ga(a, b).length > 0
                    }
                }),
                contains: ia(function(a) {
                    return a = a.replace(_, aa),
                    function(b) {
                        return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                    }
                }),
                lang: ia(function(a) {
                    return U.test(a || "") || ga.error("unsupported lang: " + a),
                    a = a.replace(_, aa).toLowerCase(),
                    function(b) {
                        var c;
                        do
                            if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                                return c = c.toLowerCase(),
                                c === a || 0 === c.indexOf(a + "-");
                        while ((b = b.parentNode) && 1 === b.nodeType);return !1
                    }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === o
                },
                focus: function(a) {
                    return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: oa(!1),
                disabled: oa(!0),
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex,
                    a.selected === !0
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(a) {
                    return !d.pseudos.empty(a)
                },
                header: function(a) {
                    return X.test(a.nodeName)
                },
                input: function(a) {
                    return W.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: pa(function() {
                    return [0]
                }),
                last: pa(function(a, b) {
                    return [b - 1]
                }),
                eq: pa(function(a, b, c) {
                    return [c < 0 ? c + b : c]
                }),
                even: pa(function(a, b) {
                    for (var c = 0; c < b; c += 2)
                        a.push(c);
                    return a
                }),
                odd: pa(function(a, b) {
                    for (var c = 1; c < b; c += 2)
                        a.push(c);
                    return a
                }),
                lt: pa(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; --d >= 0; )
                        a.push(d);
                    return a
                }),
                gt: pa(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; ++d < b; )
                        a.push(d);
                    return a
                })
            }
        },
        d.pseudos.nth = d.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            d.pseudos[b] = ma(b);
        for (b in {
            submit: !0,
            reset: !0
        })
            d.pseudos[b] = na(b);
        function ra() {}
        ra.prototype = d.filters = d.pseudos,
        d.setFilters = new ra,
        g = ga.tokenize = function(a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k)
                return b ? 0 : k.slice(0);
            h = a,
            i = [],
            j = d.preFilter;
            while (h) {
                c && !(e = Q.exec(h)) || (e && (h = h.slice(e[0].length) || h),
                i.push(f = [])),
                c = !1,
                (e = R.exec(h)) && (c = e.shift(),
                f.push({
                    value: c,
                    type: e[0].replace(P, " ")
                }),
                h = h.slice(c.length));
                for (g in d.filter)
                    !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(),
                    f.push({
                        value: c,
                        type: g,
                        matches: e
                    }),
                    h = h.slice(c.length));
                if (!c)
                    break
            }
            return b ? h.length : h ? ga.error(a) : z(a, i).slice(0)
        }
        ;
        function sa(a) {
            for (var b = 0, c = a.length, d = ""; b < c; b++)
                d += a[b].value;
            return d
        }
        function ta(a, b, c) {
            var d = b.dir
              , e = b.next
              , f = e || d
              , g = c && "parentNode" === f
              , h = x++;
            return b.first ? function(b, c, e) {
                while (b = b[d])
                    if (1 === b.nodeType || g)
                        return a(b, c, e);
                return !1
            }
            : function(b, c, i) {
                var j, k, l, m = [w, h];
                if (i) {
                    while (b = b[d])
                        if ((1 === b.nodeType || g) && a(b, c, i))
                            return !0
                } else
                    while (b = b[d])
                        if (1 === b.nodeType || g)
                            if (l = b[u] || (b[u] = {}),
                            k = l[b.uniqueID] || (l[b.uniqueID] = {}),
                            e && e === b.nodeName.toLowerCase())
                                b = b[d] || b;
                            else {
                                if ((j = k[f]) && j[0] === w && j[1] === h)
                                    return m[2] = j[2];
                                if (k[f] = m,
                                m[2] = a(b, c, i))
                                    return !0
                            }
                return !1
            }
        }
        function ua(a) {
            return a.length > 1 ? function(b, c, d) {
                var e = a.length;
                while (e--)
                    if (!a[e](b, c, d))
                        return !1;
                return !0
            }
            : a[0]
        }
        function va(a, b, c) {
            for (var d = 0, e = b.length; d < e; d++)
                ga(a, b[d], c);
            return c
        }
        function wa(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)
                (f = a[h]) && (c && !c(f, d, e) || (g.push(f),
                j && b.push(h)));
            return g
        }
        function xa(a, b, c, d, e, f) {
            return d && !d[u] && (d = xa(d)),
            e && !e[u] && (e = xa(e, f)),
            ia(function(f, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, p = f || va(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : wa(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i),
                d) {
                    j = wa(r, n),
                    d(j, [], h, i),
                    k = j.length;
                    while (k--)
                        (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [],
                            k = r.length;
                            while (k--)
                                (l = r[k]) && j.push(q[k] = l);
                            e(null, r = [], j, i)
                        }
                        k = r.length;
                        while (k--)
                            (l = r[k]) && (j = e ? I(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                    }
                } else
                    r = wa(r === g ? r.splice(o, r.length) : r),
                    e ? e(null, g, r, i) : G.apply(g, r)
            })
        }
        function ya(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = ta(function(a) {
                return a === b
            }, h, !0), l = ta(function(a) {
                return I(b, a) > -1
            }, h, !0), m = [function(a, c, d) {
                var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                return b = null,
                e
            }
            ]; i < f; i++)
                if (c = d.relative[a[i].type])
                    m = [ta(ua(m), c)];
                else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches),
                    c[u]) {
                        for (e = ++i; e < f; e++)
                            if (d.relative[a[e].type])
                                break;
                        return xa(i > 1 && ua(m), i > 1 && sa(a.slice(0, i - 1).concat({
                            value: " " === a[i - 2].type ? "*" : ""
                        })).replace(P, "$1"), c, i < e && ya(a.slice(i, e)), e < f && ya(a = a.slice(e)), e < f && sa(a))
                    }
                    m.push(c)
                }
            return ua(m)
        }
        function za(a, b) {
            var c = b.length > 0
              , e = a.length > 0
              , f = function(f, g, h, i, k) {
                var l, o, q, r = 0, s = "0", t = f && [], u = [], v = j, x = f || e && d.find.TAG("*", k), y = w += null == v ? 1 : Math.random() || .1, z = x.length;
                for (k && (j = g === n || g || k); s !== z && null != (l = x[s]); s++) {
                    if (e && l) {
                        o = 0,
                        g || l.ownerDocument === n || (m(l),
                        h = !p);
                        while (q = a[o++])
                            if (q(l, g || n, h)) {
                                i.push(l);
                                break
                            }
                        k && (w = y)
                    }
                    c && ((l = !q && l) && r--,
                    f && t.push(l))
                }
                if (r += s,
                c && s !== r) {
                    o = 0;
                    while (q = b[o++])
                        q(t, u, g, h);
                    if (f) {
                        if (r > 0)
                            while (s--)
                                t[s] || u[s] || (u[s] = E.call(i));
                        u = wa(u)
                    }
                    G.apply(i, u),
                    k && !f && u.length > 0 && r + b.length > 1 && ga.uniqueSort(i)
                }
                return k && (w = y,
                j = v),
                t
            };
            return c ? ia(f) : f
        }
        return h = ga.compile = function(a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)),
                c = b.length;
                while (c--)
                    f = ya(b[c]),
                    f[u] ? d.push(f) : e.push(f);
                f = A(a, za(e, d)),
                f.selector = a
            }
            return f
        }
        ,
        i = ga.select = function(a, b, c, e) {
            var f, i, j, k, l, m = "function" == typeof a && a, n = !e && g(a = m.selector || a);
            if (c = c || [],
            1 === n.length) {
                if (i = n[0] = n[0].slice(0),
                i.length > 2 && "ID" === (j = i[0]).type && 9 === b.nodeType && p && d.relative[i[1].type]) {
                    if (b = (d.find.ID(j.matches[0].replace(_, aa), b) || [])[0],
                    !b)
                        return c;
                    m && (b = b.parentNode),
                    a = a.slice(i.shift().value.length)
                }
                f = V.needsContext.test(a) ? 0 : i.length;
                while (f--) {
                    if (j = i[f],
                    d.relative[k = j.type])
                        break;
                    if ((l = d.find[k]) && (e = l(j.matches[0].replace(_, aa), $.test(i[0].type) && qa(b.parentNode) || b))) {
                        if (i.splice(f, 1),
                        a = e.length && sa(i),
                        !a)
                            return G.apply(c, e),
                            c;
                        break
                    }
                }
            }
            return (m || h(a, n))(e, b, !p, c, !b || $.test(a) && qa(b.parentNode) || b),
            c
        }
        ,
        c.sortStable = u.split("").sort(B).join("") === u,
        c.detectDuplicates = !!l,
        m(),
        c.sortDetached = ja(function(a) {
            return 1 & a.compareDocumentPosition(n.createElement("fieldset"))
        }),
        ja(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || ka("type|href|height|width", function(a, b, c) {
            if (!c)
                return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }),
        c.attributes && ja(function(a) {
            return a.innerHTML = "<input/>",
            a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || ka("value", function(a, b, c) {
            if (!c && "input" === a.nodeName.toLowerCase())
                return a.defaultValue
        }),
        ja(function(a) {
            return null == a.getAttribute("disabled")
        }) || ka(J, function(a, b, c) {
            var d;
            if (!c)
                return a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
        ga
    }(a);
    r.find = x,
    r.expr = x.selectors,
    r.expr[":"] = r.expr.pseudos,
    r.uniqueSort = r.unique = x.uniqueSort,
    r.text = x.getText,
    r.isXMLDoc = x.isXML,
    r.contains = x.contains,
    r.escapeSelector = x.escape;
    var y = function(a, b, c) {
        var d = []
          , e = void 0 !== c;
        while ((a = a[b]) && 9 !== a.nodeType)
            if (1 === a.nodeType) {
                if (e && r(a).is(c))
                    break;
                d.push(a)
            }
        return d
    }
      , z = function(a, b) {
        for (var c = []; a; a = a.nextSibling)
            1 === a.nodeType && a !== b && c.push(a);
        return c
    }
      , A = r.expr.match.needsContext
      , B = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i
      , C = /^.[^:#\[\.,]*$/;
    function D(a, b, c) {
        return r.isFunction(b) ? r.grep(a, function(a, d) {
            return !!b.call(a, d, a) !== c
        }) : b.nodeType ? r.grep(a, function(a) {
            return a === b !== c
        }) : "string" != typeof b ? r.grep(a, function(a) {
            return i.call(b, a) > -1 !== c
        }) : C.test(b) ? r.filter(b, a, c) : (b = r.filter(b, a),
        r.grep(a, function(a) {
            return i.call(b, a) > -1 !== c && 1 === a.nodeType
        }))
    }
    r.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"),
        1 === b.length && 1 === d.nodeType ? r.find.matchesSelector(d, a) ? [d] : [] : r.find.matches(a, r.grep(b, function(a) {
            return 1 === a.nodeType
        }))
    }
    ,
    r.fn.extend({
        find: function(a) {
            var b, c, d = this.length, e = this;
            if ("string" != typeof a)
                return this.pushStack(r(a).filter(function() {
                    for (b = 0; b < d; b++)
                        if (r.contains(e[b], this))
                            return !0
                }));
            for (c = this.pushStack([]),
            b = 0; b < d; b++)
                r.find(a, e[b], c);
            return d > 1 ? r.uniqueSort(c) : c
        },
        filter: function(a) {
            return this.pushStack(D(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(D(this, a || [], !0))
        },
        is: function(a) {
            return !!D(this, "string" == typeof a && A.test(a) ? r(a) : a || [], !1).length
        }
    });
    var E, F = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, G = r.fn.init = function(a, b, c) {
        var e, f;
        if (!a)
            return this;
        if (c = c || E,
        "string" == typeof a) {
            if (e = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : F.exec(a),
            !e || !e[1] && b)
                return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
            if (e[1]) {
                if (b = b instanceof r ? b[0] : b,
                r.merge(this, r.parseHTML(e[1], b && b.nodeType ? b.ownerDocument || b : d, !0)),
                B.test(e[1]) && r.isPlainObject(b))
                    for (e in b)
                        r.isFunction(this[e]) ? this[e](b[e]) : this.attr(e, b[e]);
                return this
            }
            return f = d.getElementById(e[2]),
            f && (this[0] = f,
            this.length = 1),
            this
        }
        return a.nodeType ? (this[0] = a,
        this.length = 1,
        this) : r.isFunction(a) ? void 0 !== c.ready ? c.ready(a) : a(r) : r.makeArray(a, this)
    }
    ;
    G.prototype = r.fn,
    E = r(d);
    var H = /^(?:parents|prev(?:Until|All))/
      , I = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    r.fn.extend({
        has: function(a) {
            var b = r(a, this)
              , c = b.length;
            return this.filter(function() {
                for (var a = 0; a < c; a++)
                    if (r.contains(this, b[a]))
                        return !0
            })
        },
        closest: function(a, b) {
            var c, d = 0, e = this.length, f = [], g = "string" != typeof a && r(a);
            if (!A.test(a))
                for (; d < e; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && r.find.matchesSelector(c, a))) {
                            f.push(c);
                            break
                        }
            return this.pushStack(f.length > 1 ? r.uniqueSort(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? i.call(r(a), this[0]) : i.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(r.uniqueSort(r.merge(this.get(), r(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });
    function J(a, b) {
        while ((a = a[b]) && 1 !== a.nodeType)
            ;
        return a
    }
    r.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return y(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return y(a, "parentNode", c)
        },
        next: function(a) {
            return J(a, "nextSibling")
        },
        prev: function(a) {
            return J(a, "previousSibling")
        },
        nextAll: function(a) {
            return y(a, "nextSibling")
        },
        prevAll: function(a) {
            return y(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return y(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return y(a, "previousSibling", c)
        },
        siblings: function(a) {
            return z((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return z(a.firstChild)
        },
        contents: function(a) {
            return a.contentDocument || r.merge([], a.childNodes)
        }
    }, function(a, b) {
        r.fn[a] = function(c, d) {
            var e = r.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c),
            d && "string" == typeof d && (e = r.filter(d, e)),
            this.length > 1 && (I[a] || r.uniqueSort(e),
            H.test(a) && e.reverse()),
            this.pushStack(e)
        }
    });
    var K = /[^\x20\t\r\n\f]+/g;
    function L(a) {
        var b = {};
        return r.each(a.match(K) || [], function(a, c) {
            b[c] = !0
        }),
        b
    }
    r.Callbacks = function(a) {
        a = "string" == typeof a ? L(a) : r.extend({}, a);
        var b, c, d, e, f = [], g = [], h = -1, i = function() {
            for (e = a.once,
            d = b = !0; g.length; h = -1) {
                c = g.shift();
                while (++h < f.length)
                    f[h].apply(c[0], c[1]) === !1 && a.stopOnFalse && (h = f.length,
                    c = !1)
            }
            a.memory || (c = !1),
            b = !1,
            e && (f = c ? [] : "")
        }, j = {
            add: function() {
                return f && (c && !b && (h = f.length - 1,
                g.push(c)),
                function d(b) {
                    r.each(b, function(b, c) {
                        r.isFunction(c) ? a.unique && j.has(c) || f.push(c) : c && c.length && "string" !== r.type(c) && d(c)
                    })
                }(arguments),
                c && !b && i()),
                this
            },
            remove: function() {
                return r.each(arguments, function(a, b) {
                    var c;
                    while ((c = r.inArray(b, f, c)) > -1)
                        f.splice(c, 1),
                        c <= h && h--
                }),
                this
            },
            has: function(a) {
                return a ? r.inArray(a, f) > -1 : f.length > 0
            },
            empty: function() {
                return f && (f = []),
                this
            },
            disable: function() {
                return e = g = [],
                f = c = "",
                this
            },
            disabled: function() {
                return !f
            },
            lock: function() {
                return e = g = [],
                c || b || (f = c = ""),
                this
            },
            locked: function() {
                return !!e
            },
            fireWith: function(a, c) {
                return e || (c = c || [],
                c = [a, c.slice ? c.slice() : c],
                g.push(c),
                b || i()),
                this
            },
            fire: function() {
                return j.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!d
            }
        };
        return j
    }
    ;
    function M(a) {
        return a
    }
    function N(a) {
        throw a
    }
    function O(a, b, c) {
        var d;
        try {
            a && r.isFunction(d = a.promise) ? d.call(a).done(b).fail(c) : a && r.isFunction(d = a.then) ? d.call(a, b, c) : b.call(void 0, a)
        } catch (a) {
            c.call(void 0, a)
        }
    }
    r.extend({
        Deferred: function(b) {
            var c = [["notify", "progress", r.Callbacks("memory"), r.Callbacks("memory"), 2], ["resolve", "done", r.Callbacks("once memory"), r.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", r.Callbacks("once memory"), r.Callbacks("once memory"), 1, "rejected"]]
              , d = "pending"
              , e = {
                state: function() {
                    return d
                },
                always: function() {
                    return f.done(arguments).fail(arguments),
                    this
                },
                "catch": function(a) {
                    return e.then(null, a)
                },
                pipe: function() {
                    var a = arguments;
                    return r.Deferred(function(b) {
                        r.each(c, function(c, d) {
                            var e = r.isFunction(a[d[4]]) && a[d[4]];
                            f[d[1]](function() {
                                var a = e && e.apply(this, arguments);
                                a && r.isFunction(a.promise) ? a.promise().progress(b.notify).done(b.resolve).fail(b.reject) : b[d[0] + "With"](this, e ? [a] : arguments)
                            })
                        }),
                        a = null
                    }).promise()
                },
                then: function(b, d, e) {
                    var f = 0;
                    function g(b, c, d, e) {
                        return function() {
                            var h = this
                              , i = arguments
                              , j = function() {
                                var a, j;
                                if (!(b < f)) {
                                    if (a = d.apply(h, i),
                                    a === c.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    j = a && ("object" == typeof a || "function" == typeof a) && a.then,
                                    r.isFunction(j) ? e ? j.call(a, g(f, c, M, e), g(f, c, N, e)) : (f++,
                                    j.call(a, g(f, c, M, e), g(f, c, N, e), g(f, c, M, c.notifyWith))) : (d !== M && (h = void 0,
                                    i = [a]),
                                    (e || c.resolveWith)(h, i))
                                }
                            }
                              , k = e ? j : function() {
                                try {
                                    j()
                                } catch (a) {
                                    r.Deferred.exceptionHook && r.Deferred.exceptionHook(a, k.stackTrace),
                                    b + 1 >= f && (d !== N && (h = void 0,
                                    i = [a]),
                                    c.rejectWith(h, i))
                                }
                            }
                            ;
                            b ? k() : (r.Deferred.getStackHook && (k.stackTrace = r.Deferred.getStackHook()),
                            a.setTimeout(k))
                        }
                    }
                    return r.Deferred(function(a) {
                        c[0][3].add(g(0, a, r.isFunction(e) ? e : M, a.notifyWith)),
                        c[1][3].add(g(0, a, r.isFunction(b) ? b : M)),
                        c[2][3].add(g(0, a, r.isFunction(d) ? d : N))
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? r.extend(a, e) : e
                }
            }
              , f = {};
            return r.each(c, function(a, b) {
                var g = b[2]
                  , h = b[5];
                e[b[1]] = g.add,
                h && g.add(function() {
                    d = h
                }, c[3 - a][2].disable, c[0][2].lock),
                g.add(b[3].fire),
                f[b[0]] = function() {
                    return f[b[0] + "With"](this === f ? void 0 : this, arguments),
                    this
                }
                ,
                f[b[0] + "With"] = g.fireWith
            }),
            e.promise(f),
            b && b.call(f, f),
            f
        },
        when: function(a) {
            var b = arguments.length
              , c = b
              , d = Array(c)
              , e = f.call(arguments)
              , g = r.Deferred()
              , h = function(a) {
                return function(c) {
                    d[a] = this,
                    e[a] = arguments.length > 1 ? f.call(arguments) : c,
                    --b || g.resolveWith(d, e)
                }
            };
            if (b <= 1 && (O(a, g.done(h(c)).resolve, g.reject),
            "pending" === g.state() || r.isFunction(e[c] && e[c].then)))
                return g.then();
            while (c--)
                O(e[c], h(c), g.reject);
            return g.promise()
        }
    });
    var P = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    r.Deferred.exceptionHook = function(b, c) {
        a.console && a.console.warn && b && P.test(b.name) && a.console.warn("jQuery.Deferred exception: " + b.message, b.stack, c)
    }
    ,
    r.readyException = function(b) {
        a.setTimeout(function() {
            throw b
        })
    }
    ;
    var Q = r.Deferred();
    r.fn.ready = function(a) {
        return Q.then(a)["catch"](function(a) {
            r.readyException(a)
        }),
        this
    }
    ,
    r.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? r.readyWait++ : r.ready(!0)
        },
        ready: function(a) {
            (a === !0 ? --r.readyWait : r.isReady) || (r.isReady = !0,
            a !== !0 && --r.readyWait > 0 || Q.resolveWith(d, [r]))
        }
    }),
    r.ready.then = Q.then;
    function R() {
        d.removeEventListener("DOMContentLoaded", R),
        a.removeEventListener("load", R),
        r.ready()
    }
    "complete" === d.readyState || "loading" !== d.readyState && !d.documentElement.doScroll ? a.setTimeout(r.ready) : (d.addEventListener("DOMContentLoaded", R),
    a.addEventListener("load", R));
    var S = function(a, b, c, d, e, f, g) {
        var h = 0
          , i = a.length
          , j = null == c;
        if ("object" === r.type(c)) {
            e = !0;
            for (h in c)
                S(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0,
        r.isFunction(d) || (g = !0),
        j && (g ? (b.call(a, d),
        b = null) : (j = b,
        b = function(a, b, c) {
            return j.call(r(a), c)
        }
        )),
        b))
            for (; h < i; h++)
                b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }
      , T = function(a) {
        return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType
    };
    function U() {
        this.expando = r.expando + U.uid++
    }
    U.uid = 1,
    U.prototype = {
        cache: function(a) {
            var b = a[this.expando];
            return b || (b = {},
            T(a) && (a.nodeType ? a[this.expando] = b : Object.defineProperty(a, this.expando, {
                value: b,
                configurable: !0
            }))),
            b
        },
        set: function(a, b, c) {
            var d, e = this.cache(a);
            if ("string" == typeof b)
                e[r.camelCase(b)] = c;
            else
                for (d in b)
                    e[r.camelCase(d)] = b[d];
            return e
        },
        get: function(a, b) {
            return void 0 === b ? this.cache(a) : a[this.expando] && a[this.expando][r.camelCase(b)]
        },
        access: function(a, b, c) {
            return void 0 === b || b && "string" == typeof b && void 0 === c ? this.get(a, b) : (this.set(a, b, c),
            void 0 !== c ? c : b)
        },
        remove: function(a, b) {
            var c, d = a[this.expando];
            if (void 0 !== d) {
                if (void 0 !== b) {
                    r.isArray(b) ? b = b.map(r.camelCase) : (b = r.camelCase(b),
                    b = b in d ? [b] : b.match(K) || []),
                    c = b.length;
                    while (c--)
                        delete d[b[c]]
                }
                (void 0 === b || r.isEmptyObject(d)) && (a.nodeType ? a[this.expando] = void 0 : delete a[this.expando])
            }
        },
        hasData: function(a) {
            var b = a[this.expando];
            return void 0 !== b && !r.isEmptyObject(b)
        }
    };
    var V = new U
      , W = new U
      , X = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Y = /[A-Z]/g;
    function Z(a) {
        return "true" === a || "false" !== a && ("null" === a ? null : a === +a + "" ? +a : X.test(a) ? JSON.parse(a) : a)
    }
    function $(a, b, c) {
        var d;
        if (void 0 === c && 1 === a.nodeType)
            if (d = "data-" + b.replace(Y, "-$&").toLowerCase(),
            c = a.getAttribute(d),
            "string" == typeof c) {
                try {
                    c = Z(c)
                } catch (e) {}
                W.set(a, b, c)
            } else
                c = void 0;
        return c
    }
    r.extend({
        hasData: function(a) {
            return W.hasData(a) || V.hasData(a)
        },
        data: function(a, b, c) {
            return W.access(a, b, c)
        },
        removeData: function(a, b) {
            W.remove(a, b)
        },
        _data: function(a, b, c) {
            return V.access(a, b, c)
        },
        _removeData: function(a, b) {
            V.remove(a, b)
        }
    }),
    r.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = W.get(f),
                1 === f.nodeType && !V.get(f, "hasDataAttrs"))) {
                    c = g.length;
                    while (c--)
                        g[c] && (d = g[c].name,
                        0 === d.indexOf("data-") && (d = r.camelCase(d.slice(5)),
                        $(f, d, e[d])));
                    V.set(f, "hasDataAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                W.set(this, a)
            }) : S(this, function(b) {
                var c;
                if (f && void 0 === b) {
                    if (c = W.get(f, a),
                    void 0 !== c)
                        return c;
                    if (c = $(f, a),
                    void 0 !== c)
                        return c
                } else
                    this.each(function() {
                        W.set(this, a, b)
                    })
            }, null, b, arguments.length > 1, null, !0)
        },
        removeData: function(a) {
            return this.each(function() {
                W.remove(this, a)
            })
        }
    }),
    r.extend({
        queue: function(a, b, c) {
            var d;
            if (a)
                return b = (b || "fx") + "queue",
                d = V.get(a, b),
                c && (!d || r.isArray(c) ? d = V.access(a, b, r.makeArray(c)) : d.push(c)),
                d || []
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = r.queue(a, b)
              , d = c.length
              , e = c.shift()
              , f = r._queueHooks(a, b)
              , g = function() {
                r.dequeue(a, b)
            };
            "inprogress" === e && (e = c.shift(),
            d--),
            e && ("fx" === b && c.unshift("inprogress"),
            delete f.stop,
            e.call(a, g, f)),
            !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return V.get(a, c) || V.access(a, c, {
                empty: r.Callbacks("once memory").add(function() {
                    V.remove(a, [b + "queue", c])
                })
            })
        }
    }),
    r.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a,
            a = "fx",
            c--),
            arguments.length < c ? r.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = r.queue(this, a, b);
                r._queueHooks(this, a),
                "fx" === a && "inprogress" !== c[0] && r.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                r.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c, d = 1, e = r.Deferred(), f = this, g = this.length, h = function() {
                --d || e.resolveWith(f, [f])
            };
            "string" != typeof a && (b = a,
            a = void 0),
            a = a || "fx";
            while (g--)
                c = V.get(f[g], a + "queueHooks"),
                c && c.empty && (d++,
                c.empty.add(h));
            return h(),
            e.promise(b)
        }
    });
    var _ = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , aa = new RegExp("^(?:([+-])=|)(" + _ + ")([a-z%]*)$","i")
      , ba = ["Top", "Right", "Bottom", "Left"]
      , ca = function(a, b) {
        return a = b || a,
        "none" === a.style.display || "" === a.style.display && r.contains(a.ownerDocument, a) && "none" === r.css(a, "display")
    }
      , da = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b)
            g[f] = a.style[f],
            a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b)
            a.style[f] = g[f];
        return e
    };
    function ea(a, b, c, d) {
        var e, f = 1, g = 20, h = d ? function() {
            return d.cur()
        }
        : function() {
            return r.css(a, b, "")
        }
        , i = h(), j = c && c[3] || (r.cssNumber[b] ? "" : "px"), k = (r.cssNumber[b] || "px" !== j && +i) && aa.exec(r.css(a, b));
        if (k && k[3] !== j) {
            j = j || k[3],
            c = c || [],
            k = +i || 1;
            do
                f = f || ".5",
                k /= f,
                r.style(a, b, k + j);
            while (f !== (f = h() / i) && 1 !== f && --g)
        }
        return c && (k = +k || +i || 0,
        e = c[1] ? k + (c[1] + 1) * c[2] : +c[2],
        d && (d.unit = j,
        d.start = k,
        d.end = e)),
        e
    }
    var fa = {};
    function ga(a) {
        var b, c = a.ownerDocument, d = a.nodeName, e = fa[d];
        return e ? e : (b = c.body.appendChild(c.createElement(d)),
        e = r.css(b, "display"),
        b.parentNode.removeChild(b),
        "none" === e && (e = "block"),
        fa[d] = e,
        e)
    }
    function ha(a, b) {
        for (var c, d, e = [], f = 0, g = a.length; f < g; f++)
            d = a[f],
            d.style && (c = d.style.display,
            b ? ("none" === c && (e[f] = V.get(d, "display") || null,
            e[f] || (d.style.display = "")),
            "" === d.style.display && ca(d) && (e[f] = ga(d))) : "none" !== c && (e[f] = "none",
            V.set(d, "display", c)));
        for (f = 0; f < g; f++)
            null != e[f] && (a[f].style.display = e[f]);
        return a
    }
    r.fn.extend({
        show: function() {
            return ha(this, !0)
        },
        hide: function() {
            return ha(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                ca(this) ? r(this).show() : r(this).hide()
            })
        }
    });
    var ia = /^(?:checkbox|radio)$/i
      , ja = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i
      , ka = /^$|\/(?:java|ecma)script/i
      , la = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    la.optgroup = la.option,
    la.tbody = la.tfoot = la.colgroup = la.caption = la.thead,
    la.th = la.td;
    function ma(a, b) {
        var c;
        return c = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : [],
        void 0 === b || b && r.nodeName(a, b) ? r.merge([a], c) : c
    }
    function na(a, b) {
        for (var c = 0, d = a.length; c < d; c++)
            V.set(a[c], "globalEval", !b || V.get(b[c], "globalEval"))
    }
    var oa = /<|&#?\w+;/;
    function pa(a, b, c, d, e) {
        for (var f, g, h, i, j, k, l = b.createDocumentFragment(), m = [], n = 0, o = a.length; n < o; n++)
            if (f = a[n],
            f || 0 === f)
                if ("object" === r.type(f))
                    r.merge(m, f.nodeType ? [f] : f);
                else if (oa.test(f)) {
                    g = g || l.appendChild(b.createElement("div")),
                    h = (ja.exec(f) || ["", ""])[1].toLowerCase(),
                    i = la[h] || la._default,
                    g.innerHTML = i[1] + r.htmlPrefilter(f) + i[2],
                    k = i[0];
                    while (k--)
                        g = g.lastChild;
                    r.merge(m, g.childNodes),
                    g = l.firstChild,
                    g.textContent = ""
                } else
                    m.push(b.createTextNode(f));
        l.textContent = "",
        n = 0;
        while (f = m[n++])
            if (d && r.inArray(f, d) > -1)
                e && e.push(f);
            else if (j = r.contains(f.ownerDocument, f),
            g = ma(l.appendChild(f), "script"),
            j && na(g),
            c) {
                k = 0;
                while (f = g[k++])
                    ka.test(f.type || "") && c.push(f)
            }
        return l
    }
    !function() {
        var a = d.createDocumentFragment()
          , b = a.appendChild(d.createElement("div"))
          , c = d.createElement("input");
        c.setAttribute("type", "radio"),
        c.setAttribute("checked", "checked"),
        c.setAttribute("name", "t"),
        b.appendChild(c),
        o.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked,
        b.innerHTML = "<textarea>x</textarea>",
        o.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue
    }();
    var qa = d.documentElement
      , ra = /^key/
      , sa = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , ta = /^([^.]*)(?:\.(.+)|)/;
    function ua() {
        return !0
    }
    function va() {
        return !1
    }
    function wa() {
        try {
            return d.activeElement
        } catch (a) {}
    }
    function xa(a, b, c, d, e, f) {
        var g, h;
        if ("object" == typeof b) {
            "string" != typeof c && (d = d || c,
            c = void 0);
            for (h in b)
                xa(a, h, c, d, b[h], f);
            return a
        }
        if (null == d && null == e ? (e = c,
        d = c = void 0) : null == e && ("string" == typeof c ? (e = d,
        d = void 0) : (e = d,
        d = c,
        c = void 0)),
        e === !1)
            e = va;
        else if (!e)
            return a;
        return 1 === f && (g = e,
        e = function(a) {
            return r().off(a),
            g.apply(this, arguments)
        }
        ,
        e.guid = g.guid || (g.guid = r.guid++)),
        a.each(function() {
            r.event.add(this, b, e, d, c)
        })
    }
    r.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = V.get(a);
            if (q) {
                c.handler && (f = c,
                c = f.handler,
                e = f.selector),
                e && r.find.matchesSelector(qa, e),
                c.guid || (c.guid = r.guid++),
                (i = q.events) || (i = q.events = {}),
                (g = q.handle) || (g = q.handle = function(b) {
                    return "undefined" != typeof r && r.event.triggered !== b.type ? r.event.dispatch.apply(a, arguments) : void 0
                }
                ),
                b = (b || "").match(K) || [""],
                j = b.length;
                while (j--)
                    h = ta.exec(b[j]) || [],
                    n = p = h[1],
                    o = (h[2] || "").split(".").sort(),
                    n && (l = r.event.special[n] || {},
                    n = (e ? l.delegateType : l.bindType) || n,
                    l = r.event.special[n] || {},
                    k = r.extend({
                        type: n,
                        origType: p,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && r.expr.match.needsContext.test(e),
                        namespace: o.join(".")
                    }, f),
                    (m = i[n]) || (m = i[n] = [],
                    m.delegateCount = 0,
                    l.setup && l.setup.call(a, d, o, g) !== !1 || a.addEventListener && a.addEventListener(n, g)),
                    l.add && (l.add.call(a, k),
                    k.handler.guid || (k.handler.guid = c.guid)),
                    e ? m.splice(m.delegateCount++, 0, k) : m.push(k),
                    r.event.global[n] = !0)
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = V.hasData(a) && V.get(a);
            if (q && (i = q.events)) {
                b = (b || "").match(K) || [""],
                j = b.length;
                while (j--)
                    if (h = ta.exec(b[j]) || [],
                    n = p = h[1],
                    o = (h[2] || "").split(".").sort(),
                    n) {
                        l = r.event.special[n] || {},
                        n = (d ? l.delegateType : l.bindType) || n,
                        m = i[n] || [],
                        h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        g = f = m.length;
                        while (f--)
                            k = m[f],
                            !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1),
                            k.selector && m.delegateCount--,
                            l.remove && l.remove.call(a, k));
                        g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || r.removeEvent(a, n, q.handle),
                        delete i[n])
                    } else
                        for (n in i)
                            r.event.remove(a, n + b[j], c, d, !0);
                r.isEmptyObject(i) && V.remove(a, "handle events")
            }
        },
        dispatch: function(a) {
            var b = r.event.fix(a), c, d, e, f, g, h, i = new Array(arguments.length), j = (V.get(this, "events") || {})[b.type] || [], k = r.event.special[b.type] || {};
            for (i[0] = b,
            c = 1; c < arguments.length; c++)
                i[c] = arguments[c];
            if (b.delegateTarget = this,
            !k.preDispatch || k.preDispatch.call(this, b) !== !1) {
                h = r.event.handlers.call(this, b, j),
                c = 0;
                while ((f = h[c++]) && !b.isPropagationStopped()) {
                    b.currentTarget = f.elem,
                    d = 0;
                    while ((g = f.handlers[d++]) && !b.isImmediatePropagationStopped())
                        b.rnamespace && !b.rnamespace.test(g.namespace) || (b.handleObj = g,
                        b.data = g.data,
                        e = ((r.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i),
                        void 0 !== e && (b.result = e) === !1 && (b.preventDefault(),
                        b.stopPropagation()))
                }
                return k.postDispatch && k.postDispatch.call(this, b),
                b.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g, h = [], i = b.delegateCount, j = a.target;
            if (i && j.nodeType && !("click" === a.type && a.button >= 1))
                for (; j !== this; j = j.parentNode || this)
                    if (1 === j.nodeType && ("click" !== a.type || j.disabled !== !0)) {
                        for (f = [],
                        g = {},
                        c = 0; c < i; c++)
                            d = b[c],
                            e = d.selector + " ",
                            void 0 === g[e] && (g[e] = d.needsContext ? r(e, this).index(j) > -1 : r.find(e, this, null, [j]).length),
                            g[e] && f.push(d);
                        f.length && h.push({
                            elem: j,
                            handlers: f
                        })
                    }
            return j = this,
            i < b.length && h.push({
                elem: j,
                handlers: b.slice(i)
            }),
            h
        },
        addProp: function(a, b) {
            Object.defineProperty(r.Event.prototype, a, {
                enumerable: !0,
                configurable: !0,
                get: r.isFunction(b) ? function() {
                    if (this.originalEvent)
                        return b(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[a]
                }
                ,
                set: function(b) {
                    Object.defineProperty(this, a, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: b
                    })
                }
            })
        },
        fix: function(a) {
            return a[r.expando] ? a : new r.Event(a)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== wa() && this.focus)
                        return this.focus(),
                        !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === wa() && this.blur)
                        return this.blur(),
                        !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && r.nodeName(this, "input"))
                        return this.click(),
                        !1
                },
                _default: function(a) {
                    return r.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        }
    },
    r.removeEvent = function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c)
    }
    ,
    r.Event = function(a, b) {
        return this instanceof r.Event ? (a && a.type ? (this.originalEvent = a,
        this.type = a.type,
        this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ua : va,
        this.target = a.target && 3 === a.target.nodeType ? a.target.parentNode : a.target,
        this.currentTarget = a.currentTarget,
        this.relatedTarget = a.relatedTarget) : this.type = a,
        b && r.extend(this, b),
        this.timeStamp = a && a.timeStamp || r.now(),
        void (this[r.expando] = !0)) : new r.Event(a,b)
    }
    ,
    r.Event.prototype = {
        constructor: r.Event,
        isDefaultPrevented: va,
        isPropagationStopped: va,
        isImmediatePropagationStopped: va,
        isSimulated: !1,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = ua,
            a && !this.isSimulated && a.preventDefault()
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = ua,
            a && !this.isSimulated && a.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = ua,
            a && !this.isSimulated && a.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    r.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(a) {
            var b = a.button;
            return null == a.which && ra.test(a.type) ? null != a.charCode ? a.charCode : a.keyCode : !a.which && void 0 !== b && sa.test(a.type) ? 1 & b ? 1 : 2 & b ? 3 : 4 & b ? 2 : 0 : a.which
        }
    }, r.event.addProp),
    r.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        r.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return e && (e === d || r.contains(d, e)) || (a.type = f.origType,
                c = f.handler.apply(this, arguments),
                a.type = b),
                c
            }
        }
    }),
    r.fn.extend({
        on: function(a, b, c, d) {
            return xa(this, a, b, c, d)
        },
        one: function(a, b, c, d) {
            return xa(this, a, b, c, d, 1)
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj)
                return d = a.handleObj,
                r(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                this;
            if ("object" == typeof a) {
                for (e in a)
                    this.off(e, b, a[e]);
                return this
            }
            return b !== !1 && "function" != typeof b || (c = b,
            b = void 0),
            c === !1 && (c = va),
            this.each(function() {
                r.event.remove(this, a, c, b)
            })
        }
    });
    var ya = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi
      , za = /<script|<style|<link/i
      , Aa = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Ba = /^true\/(.*)/
      , Ca = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function Da(a, b) {
        return r.nodeName(a, "table") && r.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a : a
    }
    function Ea(a) {
        return a.type = (null !== a.getAttribute("type")) + "/" + a.type,
        a
    }
    function Fa(a) {
        var b = Ba.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"),
        a
    }
    function Ga(a, b) {
        var c, d, e, f, g, h, i, j;
        if (1 === b.nodeType) {
            if (V.hasData(a) && (f = V.access(a),
            g = V.set(b, f),
            j = f.events)) {
                delete g.handle,
                g.events = {};
                for (e in j)
                    for (c = 0,
                    d = j[e].length; c < d; c++)
                        r.event.add(b, e, j[e][c])
            }
            W.hasData(a) && (h = W.access(a),
            i = r.extend({}, h),
            W.set(b, i))
        }
    }
    function Ha(a, b) {
        var c = b.nodeName.toLowerCase();
        "input" === c && ia.test(a.type) ? b.checked = a.checked : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue)
    }
    function Ia(a, b, c, d) {
        b = g.apply([], b);
        var e, f, h, i, j, k, l = 0, m = a.length, n = m - 1, q = b[0], s = r.isFunction(q);
        if (s || m > 1 && "string" == typeof q && !o.checkClone && Aa.test(q))
            return a.each(function(e) {
                var f = a.eq(e);
                s && (b[0] = q.call(this, e, f.html())),
                Ia(f, b, c, d)
            });
        if (m && (e = pa(b, a[0].ownerDocument, !1, a, d),
        f = e.firstChild,
        1 === e.childNodes.length && (e = f),
        f || d)) {
            for (h = r.map(ma(e, "script"), Ea),
            i = h.length; l < m; l++)
                j = e,
                l !== n && (j = r.clone(j, !0, !0),
                i && r.merge(h, ma(j, "script"))),
                c.call(a[l], j, l);
            if (i)
                for (k = h[h.length - 1].ownerDocument,
                r.map(h, Fa),
                l = 0; l < i; l++)
                    j = h[l],
                    ka.test(j.type || "") && !V.access(j, "globalEval") && r.contains(k, j) && (j.src ? r._evalUrl && r._evalUrl(j.src) : p(j.textContent.replace(Ca, ""), k))
        }
        return a
    }
    function Ja(a, b, c) {
        for (var d, e = b ? r.filter(b, a) : a, f = 0; null != (d = e[f]); f++)
            c || 1 !== d.nodeType || r.cleanData(ma(d)),
            d.parentNode && (c && r.contains(d.ownerDocument, d) && na(ma(d, "script")),
            d.parentNode.removeChild(d));
        return a
    }
    r.extend({
        htmlPrefilter: function(a) {
            return a.replace(ya, "<$1></$2>")
        },
        clone: function(a, b, c) {
            var d, e, f, g, h = a.cloneNode(!0), i = r.contains(a.ownerDocument, a);
            if (!(o.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || r.isXMLDoc(a)))
                for (g = ma(h),
                f = ma(a),
                d = 0,
                e = f.length; d < e; d++)
                    Ha(f[d], g[d]);
            if (b)
                if (c)
                    for (f = f || ma(a),
                    g = g || ma(h),
                    d = 0,
                    e = f.length; d < e; d++)
                        Ga(f[d], g[d]);
                else
                    Ga(a, h);
            return g = ma(h, "script"),
            g.length > 0 && na(g, !i && ma(a, "script")),
            h
        },
        cleanData: function(a) {
            for (var b, c, d, e = r.event.special, f = 0; void 0 !== (c = a[f]); f++)
                if (T(c)) {
                    if (b = c[V.expando]) {
                        if (b.events)
                            for (d in b.events)
                                e[d] ? r.event.remove(c, d) : r.removeEvent(c, d, b.handle);
                        c[V.expando] = void 0
                    }
                    c[W.expando] && (c[W.expando] = void 0)
                }
        }
    }),
    r.fn.extend({
        detach: function(a) {
            return Ja(this, a, !0)
        },
        remove: function(a) {
            return Ja(this, a)
        },
        text: function(a) {
            return S(this, function(a) {
                return void 0 === a ? r.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = a)
                })
            }, null, a, arguments.length)
        },
        append: function() {
            return Ia(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = Da(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function() {
            return Ia(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = Da(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return Ia(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return Ia(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++)
                1 === a.nodeType && (r.cleanData(ma(a, !1)),
                a.textContent = "");
            return this
        },
        clone: function(a, b) {
            return a = null != a && a,
            b = null == b ? a : b,
            this.map(function() {
                return r.clone(this, a, b)
            })
        },
        html: function(a) {
            return S(this, function(a) {
                var b = this[0] || {}
                  , c = 0
                  , d = this.length;
                if (void 0 === a && 1 === b.nodeType)
                    return b.innerHTML;
                if ("string" == typeof a && !za.test(a) && !la[(ja.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = r.htmlPrefilter(a);
                    try {
                        for (; c < d; c++)
                            b = this[c] || {},
                            1 === b.nodeType && (r.cleanData(ma(b, !1)),
                            b.innerHTML = a);
                        b = 0
                    } catch (e) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = [];
            return Ia(this, arguments, function(b) {
                var c = this.parentNode;
                r.inArray(this, a) < 0 && (r.cleanData(ma(this)),
                c && c.replaceChild(b, this))
            }, a)
        }
    }),
    r.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        r.fn[a] = function(a) {
            for (var c, d = [], e = r(a), f = e.length - 1, g = 0; g <= f; g++)
                c = g === f ? this : this.clone(!0),
                r(e[g])[b](c),
                h.apply(d, c.get());
            return this.pushStack(d)
        }
    });
    var Ka = /^margin/
      , La = new RegExp("^(" + _ + ")(?!px)[a-z%]+$","i")
      , Ma = function(b) {
        var c = b.ownerDocument.defaultView;
        return c && c.opener || (c = a),
        c.getComputedStyle(b)
    };
    !function() {
        function b() {
            if (i) {
                i.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",
                i.innerHTML = "",
                qa.appendChild(h);
                var b = a.getComputedStyle(i);
                c = "1%" !== b.top,
                g = "2px" === b.marginLeft,
                e = "4px" === b.width,
                i.style.marginRight = "50%",
                f = "4px" === b.marginRight,
                qa.removeChild(h),
                i = null
            }
        }
        var c, e, f, g, h = d.createElement("div"), i = d.createElement("div");
        i.style && (i.style.backgroundClip = "content-box",
        i.cloneNode(!0).style.backgroundClip = "",
        o.clearCloneStyle = "content-box" === i.style.backgroundClip,
        h.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",
        h.appendChild(i),
        r.extend(o, {
            pixelPosition: function() {
                return b(),
                c
            },
            boxSizingReliable: function() {
                return b(),
                e
            },
            pixelMarginRight: function() {
                return b(),
                f
            },
            reliableMarginLeft: function() {
                return b(),
                g
            }
        }))
    }();
    function Na(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ma(a),
        c && (g = c.getPropertyValue(b) || c[b],
        "" !== g || r.contains(a.ownerDocument, a) || (g = r.style(a, b)),
        !o.pixelMarginRight() && La.test(g) && Ka.test(b) && (d = h.width,
        e = h.minWidth,
        f = h.maxWidth,
        h.minWidth = h.maxWidth = h.width = g,
        g = c.width,
        h.width = d,
        h.minWidth = e,
        h.maxWidth = f)),
        void 0 !== g ? g + "" : g
    }
    function Oa(a, b) {
        return {
            get: function() {
                return a() ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    var Pa = /^(none|table(?!-c[ea]).+)/
      , Qa = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , Ra = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , Sa = ["Webkit", "Moz", "ms"]
      , Ta = d.createElement("div").style;
    function Ua(a) {
        if (a in Ta)
            return a;
        var b = a[0].toUpperCase() + a.slice(1)
          , c = Sa.length;
        while (c--)
            if (a = Sa[c] + b,
            a in Ta)
                return a
    }
    function Va(a, b, c) {
        var d = aa.exec(b);
        return d ? Math.max(0, d[2] - (c || 0)) + (d[3] || "px") : b
    }
    function Wa(a, b, c, d, e) {
        var f, g = 0;
        for (f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0; f < 4; f += 2)
            "margin" === c && (g += r.css(a, c + ba[f], !0, e)),
            d ? ("content" === c && (g -= r.css(a, "padding" + ba[f], !0, e)),
            "margin" !== c && (g -= r.css(a, "border" + ba[f] + "Width", !0, e))) : (g += r.css(a, "padding" + ba[f], !0, e),
            "padding" !== c && (g += r.css(a, "border" + ba[f] + "Width", !0, e)));
        return g
    }
    function Xa(a, b, c) {
        var d, e = !0, f = Ma(a), g = "border-box" === r.css(a, "boxSizing", !1, f);
        if (a.getClientRects().length && (d = a.getBoundingClientRect()[b]),
        d <= 0 || null == d) {
            if (d = Na(a, b, f),
            (d < 0 || null == d) && (d = a.style[b]),
            La.test(d))
                return d;
            e = g && (o.boxSizingReliable() || d === a.style[b]),
            d = parseFloat(d) || 0
        }
        return d + Wa(a, b, c || (g ? "border" : "content"), e, f) + "px"
    }
    r.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Na(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = r.camelCase(b), i = a.style;
                return b = r.cssProps[h] || (r.cssProps[h] = Ua(h) || h),
                g = r.cssHooks[b] || r.cssHooks[h],
                void 0 === c ? g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c,
                "string" === f && (e = aa.exec(c)) && e[1] && (c = ea(a, b, e),
                f = "number"),
                null != c && c === c && ("number" === f && (c += e && e[3] || (r.cssNumber[h] ? "" : "px")),
                o.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                g && "set"in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)),
                void 0)
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = r.camelCase(b);
            return b = r.cssProps[h] || (r.cssProps[h] = Ua(h) || h),
            g = r.cssHooks[b] || r.cssHooks[h],
            g && "get"in g && (e = g.get(a, !0, c)),
            void 0 === e && (e = Na(a, b, d)),
            "normal" === e && b in Ra && (e = Ra[b]),
            "" === c || c ? (f = parseFloat(e),
            c === !0 || isFinite(f) ? f || 0 : e) : e
        }
    }),
    r.each(["height", "width"], function(a, b) {
        r.cssHooks[b] = {
            get: function(a, c, d) {
                if (c)
                    return !Pa.test(r.css(a, "display")) || a.getClientRects().length && a.getBoundingClientRect().width ? Xa(a, b, d) : da(a, Qa, function() {
                        return Xa(a, b, d)
                    })
            },
            set: function(a, c, d) {
                var e, f = d && Ma(a), g = d && Wa(a, b, d, "border-box" === r.css(a, "boxSizing", !1, f), f);
                return g && (e = aa.exec(c)) && "px" !== (e[3] || "px") && (a.style[b] = c,
                c = r.css(a, b)),
                Va(a, c, g)
            }
        }
    }),
    r.cssHooks.marginLeft = Oa(o.reliableMarginLeft, function(a, b) {
        if (b)
            return (parseFloat(Na(a, "marginLeft")) || a.getBoundingClientRect().left - da(a, {
                marginLeft: 0
            }, function() {
                return a.getBoundingClientRect().left
            })) + "px"
    }),
    r.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        r.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; d < 4; d++)
                    e[a + ba[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        },
        Ka.test(a) || (r.cssHooks[a + b].set = Va)
    }),
    r.fn.extend({
        css: function(a, b) {
            return S(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (r.isArray(b)) {
                    for (d = Ma(a),
                    e = b.length; g < e; g++)
                        f[b[g]] = r.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? r.style(a, b, c) : r.css(a, b)
            }, a, b, arguments.length > 1)
        }
    });
    function Ya(a, b, c, d, e) {
        return new Ya.prototype.init(a,b,c,d,e)
    }
    r.Tween = Ya,
    Ya.prototype = {
        constructor: Ya,
        init: function(a, b, c, d, e, f) {
            this.elem = a,
            this.prop = c,
            this.easing = e || r.easing._default,
            this.options = b,
            this.start = this.now = this.cur(),
            this.end = d,
            this.unit = f || (r.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = Ya.propHooks[this.prop];
            return a && a.get ? a.get(this) : Ya.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = Ya.propHooks[this.prop];
            return this.options.duration ? this.pos = b = r.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a,
            this.now = (this.end - this.start) * b + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            c && c.set ? c.set(this) : Ya.propHooks._default.set(this),
            this
        }
    },
    Ya.prototype.init.prototype = Ya.prototype,
    Ya.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = r.css(a.elem, a.prop, ""),
                b && "auto" !== b ? b : 0)
            },
            set: function(a) {
                r.fx.step[a.prop] ? r.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[r.cssProps[a.prop]] && !r.cssHooks[a.prop] ? a.elem[a.prop] = a.now : r.style(a.elem, a.prop, a.now + a.unit)
            }
        }
    },
    Ya.propHooks.scrollTop = Ya.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    },
    r.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        },
        _default: "swing"
    },
    r.fx = Ya.prototype.init,
    r.fx.step = {};
    var Za, $a, _a = /^(?:toggle|show|hide)$/, ab = /queueHooks$/;
    function bb() {
        $a && (a.requestAnimationFrame(bb),
        r.fx.tick())
    }
    function cb() {
        return a.setTimeout(function() {
            Za = void 0
        }),
        Za = r.now()
    }
    function db(a, b) {
        var c, d = 0, e = {
            height: a
        };
        for (b = b ? 1 : 0; d < 4; d += 2 - b)
            c = ba[d],
            e["margin" + c] = e["padding" + c] = a;
        return b && (e.opacity = e.width = a),
        e
    }
    function eb(a, b, c) {
        for (var d, e = (hb.tweeners[b] || []).concat(hb.tweeners["*"]), f = 0, g = e.length; f < g; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function fb(a, b, c) {
        var d, e, f, g, h, i, j, k, l = "width"in b || "height"in b, m = this, n = {}, o = a.style, p = a.nodeType && ca(a), q = V.get(a, "fxshow");
        c.queue || (g = r._queueHooks(a, "fx"),
        null == g.unqueued && (g.unqueued = 0,
        h = g.empty.fire,
        g.empty.fire = function() {
            g.unqueued || h()
        }
        ),
        g.unqueued++,
        m.always(function() {
            m.always(function() {
                g.unqueued--,
                r.queue(a, "fx").length || g.empty.fire()
            })
        }));
        for (d in b)
            if (e = b[d],
            _a.test(e)) {
                if (delete b[d],
                f = f || "toggle" === e,
                e === (p ? "hide" : "show")) {
                    if ("show" !== e || !q || void 0 === q[d])
                        continue;
                    p = !0
                }
                n[d] = q && q[d] || r.style(a, d)
            }
        if (i = !r.isEmptyObject(b),
        i || !r.isEmptyObject(n)) {
            l && 1 === a.nodeType && (c.overflow = [o.overflow, o.overflowX, o.overflowY],
            j = q && q.display,
            null == j && (j = V.get(a, "display")),
            k = r.css(a, "display"),
            "none" === k && (j ? k = j : (ha([a], !0),
            j = a.style.display || j,
            k = r.css(a, "display"),
            ha([a]))),
            ("inline" === k || "inline-block" === k && null != j) && "none" === r.css(a, "float") && (i || (m.done(function() {
                o.display = j
            }),
            null == j && (k = o.display,
            j = "none" === k ? "" : k)),
            o.display = "inline-block")),
            c.overflow && (o.overflow = "hidden",
            m.always(function() {
                o.overflow = c.overflow[0],
                o.overflowX = c.overflow[1],
                o.overflowY = c.overflow[2]
            })),
            i = !1;
            for (d in n)
                i || (q ? "hidden"in q && (p = q.hidden) : q = V.access(a, "fxshow", {
                    display: j
                }),
                f && (q.hidden = !p),
                p && ha([a], !0),
                m.done(function() {
                    p || ha([a]),
                    V.remove(a, "fxshow");
                    for (d in n)
                        r.style(a, d, n[d])
                })),
                i = eb(p ? q[d] : 0, d, m),
                d in q || (q[d] = i.start,
                p && (i.end = i.start,
                i.start = 0))
        }
    }
    function gb(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = r.camelCase(c),
            e = b[d],
            f = a[c],
            r.isArray(f) && (e = f[1],
            f = a[c] = f[0]),
            c !== d && (a[d] = f,
            delete a[c]),
            g = r.cssHooks[d],
            g && "expand"in g) {
                f = g.expand(f),
                delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c],
                    b[c] = e)
            } else
                b[d] = e
    }
    function hb(a, b, c) {
        var d, e, f = 0, g = hb.prefilters.length, h = r.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            if (e)
                return !1;
            for (var b = Za || cb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; g < i; g++)
                j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]),
            f < 1 && i ? c : (h.resolveWith(a, [j]),
            !1)
        }, j = h.promise({
            elem: a,
            props: r.extend({}, b),
            opts: r.extend(!0, {
                specialEasing: {},
                easing: r.easing._default
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: Za || cb(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = r.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d),
                d
            },
            stop: function(b) {
                var c = 0
                  , d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; c < d; c++)
                    j.tweens[c].run(1);
                return b ? (h.notifyWith(a, [j, 1, 0]),
                h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]),
                this
            }
        }), k = j.props;
        for (gb(k, j.opts.specialEasing); f < g; f++)
            if (d = hb.prefilters[f].call(j, a, k, j.opts))
                return r.isFunction(d.stop) && (r._queueHooks(j.elem, j.opts.queue).stop = r.proxy(d.stop, d)),
                d;
        return r.map(k, eb, j),
        r.isFunction(j.opts.start) && j.opts.start.call(a, j),
        r.fx.timer(r.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })),
        j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    r.Animation = r.extend(hb, {
        tweeners: {
            "*": [function(a, b) {
                var c = this.createTween(a, b);
                return ea(c.elem, a, aa.exec(b), c),
                c
            }
            ]
        },
        tweener: function(a, b) {
            r.isFunction(a) ? (b = a,
            a = ["*"]) : a = a.match(K);
            for (var c, d = 0, e = a.length; d < e; d++)
                c = a[d],
                hb.tweeners[c] = hb.tweeners[c] || [],
                hb.tweeners[c].unshift(b)
        },
        prefilters: [fb],
        prefilter: function(a, b) {
            b ? hb.prefilters.unshift(a) : hb.prefilters.push(a)
        }
    }),
    r.speed = function(a, b, c) {
        var e = a && "object" == typeof a ? r.extend({}, a) : {
            complete: c || !c && b || r.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !r.isFunction(b) && b
        };
        return r.fx.off || d.hidden ? e.duration = 0 : "number" != typeof e.duration && (e.duration in r.fx.speeds ? e.duration = r.fx.speeds[e.duration] : e.duration = r.fx.speeds._default),
        null != e.queue && e.queue !== !0 || (e.queue = "fx"),
        e.old = e.complete,
        e.complete = function() {
            r.isFunction(e.old) && e.old.call(this),
            e.queue && r.dequeue(this, e.queue)
        }
        ,
        e
    }
    ,
    r.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(ca).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = r.isEmptyObject(a)
              , f = r.speed(b, c, d)
              , g = function() {
                var b = hb(this, r.extend({}, a), f);
                (e || V.get(this, "finish")) && b.stop(!0)
            };
            return g.finish = g,
            e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop,
                b(c)
            };
            return "string" != typeof a && (c = b,
            b = a,
            a = void 0),
            b && a !== !1 && this.queue(a || "fx", []),
            this.each(function() {
                var b = !0
                  , e = null != a && a + "queueHooks"
                  , f = r.timers
                  , g = V.get(this);
                if (e)
                    g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g)
                        g[e] && g[e].stop && ab.test(e) && d(g[e]);
                for (e = f.length; e--; )
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
                    b = !1,
                    f.splice(e, 1));
                !b && c || r.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"),
            this.each(function() {
                var b, c = V.get(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = r.timers, g = d ? d.length : 0;
                for (c.finish = !0,
                r.queue(this, a, []),
                e && e.stop && e.stop.call(this, !0),
                b = f.length; b--; )
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
                    f.splice(b, 1));
                for (b = 0; b < g; b++)
                    d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }),
    r.each(["toggle", "show", "hide"], function(a, b) {
        var c = r.fn[b];
        r.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(db(b, !0), a, d, e)
        }
    }),
    r.each({
        slideDown: db("show"),
        slideUp: db("hide"),
        slideToggle: db("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        r.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }),
    r.timers = [],
    r.fx.tick = function() {
        var a, b = 0, c = r.timers;
        for (Za = r.now(); b < c.length; b++)
            a = c[b],
            a() || c[b] !== a || c.splice(b--, 1);
        c.length || r.fx.stop(),
        Za = void 0
    }
    ,
    r.fx.timer = function(a) {
        r.timers.push(a),
        a() ? r.fx.start() : r.timers.pop()
    }
    ,
    r.fx.interval = 13,
    r.fx.start = function() {
        $a || ($a = a.requestAnimationFrame ? a.requestAnimationFrame(bb) : a.setInterval(r.fx.tick, r.fx.interval))
    }
    ,
    r.fx.stop = function() {
        a.cancelAnimationFrame ? a.cancelAnimationFrame($a) : a.clearInterval($a),
        $a = null
    }
    ,
    r.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    r.fn.delay = function(b, c) {
        return b = r.fx ? r.fx.speeds[b] || b : b,
        c = c || "fx",
        this.queue(c, function(c, d) {
            var e = a.setTimeout(c, b);
            d.stop = function() {
                a.clearTimeout(e)
            }
        })
    }
    ,
    function() {
        var a = d.createElement("input")
          , b = d.createElement("select")
          , c = b.appendChild(d.createElement("option"));
        a.type = "checkbox",
        o.checkOn = "" !== a.value,
        o.optSelected = c.selected,
        a = d.createElement("input"),
        a.value = "t",
        a.type = "radio",
        o.radioValue = "t" === a.value
    }();
    var ib, jb = r.expr.attrHandle;
    r.fn.extend({
        attr: function(a, b) {
            return S(this, r.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                r.removeAttr(this, a)
            })
        }
    }),
    r.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f)
                return "undefined" == typeof a.getAttribute ? r.prop(a, b, c) : (1 === f && r.isXMLDoc(a) || (e = r.attrHooks[b.toLowerCase()] || (r.expr.match.bool.test(b) ? ib : void 0)),
                void 0 !== c ? null === c ? void r.removeAttr(a, b) : e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""),
                c) : e && "get"in e && null !== (d = e.get(a, b)) ? d : (d = r.find.attr(a, b),
                null == d ? void 0 : d))
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!o.radioValue && "radio" === b && r.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b),
                        c && (a.value = c),
                        b
                    }
                }
            }
        },
        removeAttr: function(a, b) {
            var c, d = 0, e = b && b.match(K);
            if (e && 1 === a.nodeType)
                while (c = e[d++])
                    a.removeAttribute(c)
        }
    }),
    ib = {
        set: function(a, b, c) {
            return b === !1 ? r.removeAttr(a, c) : a.setAttribute(c, c),
            c
        }
    },
    r.each(r.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = jb[b] || r.find.attr;
        jb[b] = function(a, b, d) {
            var e, f, g = b.toLowerCase();
            return d || (f = jb[g],
            jb[g] = e,
            e = null != c(a, b, d) ? g : null,
            jb[g] = f),
            e
        }
    });
    var kb = /^(?:input|select|textarea|button)$/i
      , lb = /^(?:a|area)$/i;
    r.fn.extend({
        prop: function(a, b) {
            return S(this, r.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return this.each(function() {
                delete this[r.propFix[a] || a]
            })
        }
    }),
    r.extend({
        prop: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f)
                return 1 === f && r.isXMLDoc(a) || (b = r.propFix[b] || b,
                e = r.propHooks[b]),
                void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = r.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : kb.test(a.nodeName) || lb.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    o.optSelected || (r.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && b.parentNode && b.parentNode.selectedIndex,
            null
        },
        set: function(a) {
            var b = a.parentNode;
            b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex)
        }
    }),
    r.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        r.propFix[this.toLowerCase()] = this
    });
    function mb(a) {
        var b = a.match(K) || [];
        return b.join(" ")
    }
    function nb(a) {
        return a.getAttribute && a.getAttribute("class") || ""
    }
    r.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (r.isFunction(a))
                return this.each(function(b) {
                    r(this).addClass(a.call(this, b, nb(this)))
                });
            if ("string" == typeof a && a) {
                b = a.match(K) || [];
                while (c = this[i++])
                    if (e = nb(c),
                    d = 1 === c.nodeType && " " + mb(e) + " ") {
                        g = 0;
                        while (f = b[g++])
                            d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                        h = mb(d),
                        e !== h && c.setAttribute("class", h)
                    }
            }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (r.isFunction(a))
                return this.each(function(b) {
                    r(this).removeClass(a.call(this, b, nb(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ("string" == typeof a && a) {
                b = a.match(K) || [];
                while (c = this[i++])
                    if (e = nb(c),
                    d = 1 === c.nodeType && " " + mb(e) + " ") {
                        g = 0;
                        while (f = b[g++])
                            while (d.indexOf(" " + f + " ") > -1)
                                d = d.replace(" " + f + " ", " ");
                        h = mb(d),
                        e !== h && c.setAttribute("class", h)
                    }
            }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : r.isFunction(a) ? this.each(function(c) {
                r(this).toggleClass(a.call(this, c, nb(this), b), b)
            }) : this.each(function() {
                var b, d, e, f;
                if ("string" === c) {
                    d = 0,
                    e = r(this),
                    f = a.match(K) || [];
                    while (b = f[d++])
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                } else
                    void 0 !== a && "boolean" !== c || (b = nb(this),
                    b && V.set(this, "__className__", b),
                    this.setAttribute && this.setAttribute("class", b || a === !1 ? "" : V.get(this, "__className__") || ""))
            })
        },
        hasClass: function(a) {
            var b, c, d = 0;
            b = " " + a + " ";
            while (c = this[d++])
                if (1 === c.nodeType && (" " + mb(nb(c)) + " ").indexOf(b) > -1)
                    return !0;
            return !1
        }
    });
    var ob = /\r/g;
    r.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            {
                if (arguments.length)
                    return d = r.isFunction(a),
                    this.each(function(c) {
                        var e;
                        1 === this.nodeType && (e = d ? a.call(this, c, r(this).val()) : a,
                        null == e ? e = "" : "number" == typeof e ? e += "" : r.isArray(e) && (e = r.map(e, function(a) {
                            return null == a ? "" : a + ""
                        })),
                        b = r.valHooks[this.type] || r.valHooks[this.nodeName.toLowerCase()],
                        b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                    });
                if (e)
                    return b = r.valHooks[e.type] || r.valHooks[e.nodeName.toLowerCase()],
                    b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
                    "string" == typeof c ? c.replace(ob, "") : null == c ? "" : c)
            }
        }
    }),
    r.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = r.find.attr(a, "value");
                    return null != b ? b : mb(r.text(a))
                }
            },
            select: {
                get: function(a) {
                    var b, c, d, e = a.options, f = a.selectedIndex, g = "select-one" === a.type, h = g ? null : [], i = g ? f + 1 : e.length;
                    for (d = f < 0 ? i : g ? f : 0; d < i; d++)
                        if (c = e[d],
                        (c.selected || d === f) && !c.disabled && (!c.parentNode.disabled || !r.nodeName(c.parentNode, "optgroup"))) {
                            if (b = r(c).val(),
                            g)
                                return b;
                            h.push(b)
                        }
                    return h
                },
                set: function(a, b) {
                    var c, d, e = a.options, f = r.makeArray(b), g = e.length;
                    while (g--)
                        d = e[g],
                        (d.selected = r.inArray(r.valHooks.option.get(d), f) > -1) && (c = !0);
                    return c || (a.selectedIndex = -1),
                    f
                }
            }
        }
    }),
    r.each(["radio", "checkbox"], function() {
        r.valHooks[this] = {
            set: function(a, b) {
                if (r.isArray(b))
                    return a.checked = r.inArray(r(a).val(), b) > -1
            }
        },
        o.checkOn || (r.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        }
        )
    });
    var pb = /^(?:focusinfocus|focusoutblur)$/;
    r.extend(r.event, {
        trigger: function(b, c, e, f) {
            var g, h, i, j, k, m, n, o = [e || d], p = l.call(b, "type") ? b.type : b, q = l.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = i = e = e || d,
            3 !== e.nodeType && 8 !== e.nodeType && !pb.test(p + r.event.triggered) && (p.indexOf(".") > -1 && (q = p.split("."),
            p = q.shift(),
            q.sort()),
            k = p.indexOf(":") < 0 && "on" + p,
            b = b[r.expando] ? b : new r.Event(p,"object" == typeof b && b),
            b.isTrigger = f ? 2 : 3,
            b.namespace = q.join("."),
            b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            b.result = void 0,
            b.target || (b.target = e),
            c = null == c ? [b] : r.makeArray(c, [b]),
            n = r.event.special[p] || {},
            f || !n.trigger || n.trigger.apply(e, c) !== !1)) {
                if (!f && !n.noBubble && !r.isWindow(e)) {
                    for (j = n.delegateType || p,
                    pb.test(j + p) || (h = h.parentNode); h; h = h.parentNode)
                        o.push(h),
                        i = h;
                    i === (e.ownerDocument || d) && o.push(i.defaultView || i.parentWindow || a)
                }
                g = 0;
                while ((h = o[g++]) && !b.isPropagationStopped())
                    b.type = g > 1 ? j : n.bindType || p,
                    m = (V.get(h, "events") || {})[b.type] && V.get(h, "handle"),
                    m && m.apply(h, c),
                    m = k && h[k],
                    m && m.apply && T(h) && (b.result = m.apply(h, c),
                    b.result === !1 && b.preventDefault());
                return b.type = p,
                f || b.isDefaultPrevented() || n._default && n._default.apply(o.pop(), c) !== !1 || !T(e) || k && r.isFunction(e[p]) && !r.isWindow(e) && (i = e[k],
                i && (e[k] = null),
                r.event.triggered = p,
                e[p](),
                r.event.triggered = void 0,
                i && (e[k] = i)),
                b.result
            }
        },
        simulate: function(a, b, c) {
            var d = r.extend(new r.Event, c, {
                type: a,
                isSimulated: !0
            });
            r.event.trigger(d, null, b)
        }
    }),
    r.fn.extend({
        trigger: function(a, b) {
            return this.each(function() {
                r.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            if (c)
                return r.event.trigger(a, b, c, !0)
        }
    }),
    r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(a, b) {
        r.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }),
    r.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    }),
    o.focusin = "onfocusin"in a,
    o.focusin || r.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            r.event.simulate(b, a.target, r.event.fix(a))
        };
        r.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this
                  , e = V.access(d, b);
                e || d.addEventListener(a, c, !0),
                V.access(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this
                  , e = V.access(d, b) - 1;
                e ? V.access(d, b, e) : (d.removeEventListener(a, c, !0),
                V.remove(d, b))
            }
        }
    });
    var qb = a.location
      , rb = r.now()
      , sb = /\?/;
    r.parseXML = function(b) {
        var c;
        if (!b || "string" != typeof b)
            return null;
        try {
            c = (new a.DOMParser).parseFromString(b, "text/xml")
        } catch (d) {
            c = void 0
        }
        return c && !c.getElementsByTagName("parsererror").length || r.error("Invalid XML: " + b),
        c
    }
    ;
    var tb = /\[\]$/
      , ub = /\r?\n/g
      , vb = /^(?:submit|button|image|reset|file)$/i
      , wb = /^(?:input|select|textarea|keygen)/i;
    function xb(a, b, c, d) {
        var e;
        if (r.isArray(b))
            r.each(b, function(b, e) {
                c || tb.test(a) ? d(a, e) : xb(a + "[" + ("object" == typeof e && null != e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== r.type(b))
            d(a, b);
        else
            for (e in b)
                xb(a + "[" + e + "]", b[e], c, d)
    }
    r.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            var c = r.isFunction(b) ? b() : b;
            d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(null == c ? "" : c)
        };
        if (r.isArray(a) || a.jquery && !r.isPlainObject(a))
            r.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                xb(c, a[c], b, e);
        return d.join("&")
    }
    ,
    r.fn.extend({
        serialize: function() {
            return r.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = r.prop(this, "elements");
                return a ? r.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !r(this).is(":disabled") && wb.test(this.nodeName) && !vb.test(a) && (this.checked || !ia.test(a))
            }).map(function(a, b) {
                var c = r(this).val();
                return null == c ? null : r.isArray(c) ? r.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(ub, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(ub, "\r\n")
                }
            }).get()
        }
    });
    var yb = /%20/g
      , zb = /#.*$/
      , Ab = /([?&])_=[^&]*/
      , Bb = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Cb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
      , Db = /^(?:GET|HEAD)$/
      , Eb = /^\/\//
      , Fb = {}
      , Gb = {}
      , Hb = "*/".concat("*")
      , Ib = d.createElement("a");
    Ib.href = qb.href;
    function Jb(a) {
        return function(b, c) {
            "string" != typeof b && (c = b,
            b = "*");
            var d, e = 0, f = b.toLowerCase().match(K) || [];
            if (r.isFunction(c))
                while (d = f[e++])
                    "+" === d[0] ? (d = d.slice(1) || "*",
                    (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function Kb(a, b, c, d) {
        var e = {}
          , f = a === Gb;
        function g(h) {
            var i;
            return e[h] = !0,
            r.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
                g(j),
                !1)
            }),
            i
        }
        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }
    function Lb(a, b) {
        var c, d, e = r.ajaxSettings.flatOptions || {};
        for (c in b)
            void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
        return d && r.extend(!0, a, d),
        a
    }
    function Mb(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0])
            i.shift(),
            void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
        if (d)
            for (e in h)
                if (h[e] && h[e].test(d)) {
                    i.unshift(e);
                    break
                }
        if (i[0]in c)
            f = i[0];
        else {
            for (e in c) {
                if (!i[0] || a.converters[e + " " + i[0]]) {
                    f = e;
                    break
                }
                g || (g = e)
            }
            f = f || g
        }
        if (f)
            return f !== i[0] && i.unshift(f),
            c[f]
    }
    function Nb(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b),
            !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
            i = f,
            f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f],
                    !g)
                        for (e in j)
                            if (h = e.split(" "),
                            h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
                                k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a["throws"])
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (l) {
                                return {
                                    state: "parsererror",
                                    error: g ? l : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    r.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: qb.href,
            type: "GET",
            isLocal: Cb.test(qb.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Hb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": r.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? Lb(Lb(a, r.ajaxSettings), b) : Lb(r.ajaxSettings, a)
        },
        ajaxPrefilter: Jb(Fb),
        ajaxTransport: Jb(Gb),
        ajax: function(b, c) {
            "object" == typeof b && (c = b,
            b = void 0),
            c = c || {};
            var e, f, g, h, i, j, k, l, m, n, o = r.ajaxSetup({}, c), p = o.context || o, q = o.context && (p.nodeType || p.jquery) ? r(p) : r.event, s = r.Deferred(), t = r.Callbacks("once memory"), u = o.statusCode || {}, v = {}, w = {}, x = "canceled", y = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (k) {
                        if (!h) {
                            h = {};
                            while (b = Bb.exec(g))
                                h[b[1].toLowerCase()] = b[2]
                        }
                        b = h[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return k ? g : null
                },
                setRequestHeader: function(a, b) {
                    return null == k && (a = w[a.toLowerCase()] = w[a.toLowerCase()] || a,
                    v[a] = b),
                    this
                },
                overrideMimeType: function(a) {
                    return null == k && (o.mimeType = a),
                    this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (k)
                            y.always(a[y.status]);
                        else
                            for (b in a)
                                u[b] = [u[b], a[b]];
                    return this
                },
                abort: function(a) {
                    var b = a || x;
                    return e && e.abort(b),
                    A(0, b),
                    this
                }
            };
            if (s.promise(y),
            o.url = ((b || o.url || qb.href) + "").replace(Eb, qb.protocol + "//"),
            o.type = c.method || c.type || o.method || o.type,
            o.dataTypes = (o.dataType || "*").toLowerCase().match(K) || [""],
            null == o.crossDomain) {
                j = d.createElement("a");
                try {
                    j.href = o.url,
                    j.href = j.href,
                    o.crossDomain = Ib.protocol + "//" + Ib.host != j.protocol + "//" + j.host
                } catch (z) {
                    o.crossDomain = !0
                }
            }
            if (o.data && o.processData && "string" != typeof o.data && (o.data = r.param(o.data, o.traditional)),
            Kb(Fb, o, c, y),
            k)
                return y;
            l = r.event && o.global,
            l && 0 === r.active++ && r.event.trigger("ajaxStart"),
            o.type = o.type.toUpperCase(),
            o.hasContent = !Db.test(o.type),
            f = o.url.replace(zb, ""),
            o.hasContent ? o.data && o.processData && 0 === (o.contentType || "").indexOf("application/x-www-form-urlencoded") && (o.data = o.data.replace(yb, "+")) : (n = o.url.slice(f.length),
            o.data && (f += (sb.test(f) ? "&" : "?") + o.data,
            delete o.data),
            o.cache === !1 && (f = f.replace(Ab, "$1"),
            n = (sb.test(f) ? "&" : "?") + "_=" + rb++ + n),
            o.url = f + n),
            o.ifModified && (r.lastModified[f] && y.setRequestHeader("If-Modified-Since", r.lastModified[f]),
            r.etag[f] && y.setRequestHeader("If-None-Match", r.etag[f])),
            (o.data && o.hasContent && o.contentType !== !1 || c.contentType) && y.setRequestHeader("Content-Type", o.contentType),
            y.setRequestHeader("Accept", o.dataTypes[0] && o.accepts[o.dataTypes[0]] ? o.accepts[o.dataTypes[0]] + ("*" !== o.dataTypes[0] ? ", " + Hb + "; q=0.01" : "") : o.accepts["*"]);
            for (m in o.headers)
                y.setRequestHeader(m, o.headers[m]);
            if (o.beforeSend && (o.beforeSend.call(p, y, o) === !1 || k))
                return y.abort();
            if (x = "abort",
            t.add(o.complete),
            y.done(o.success),
            y.fail(o.error),
            e = Kb(Gb, o, c, y)) {
                if (y.readyState = 1,
                l && q.trigger("ajaxSend", [y, o]),
                k)
                    return y;
                o.async && o.timeout > 0 && (i = a.setTimeout(function() {
                    y.abort("timeout")
                }, o.timeout));
                try {
                    k = !1,
                    e.send(v, A)
                } catch (z) {
                    if (k)
                        throw z;
                    A(-1, z)
                }
            } else
                A(-1, "No Transport");
            function A(b, c, d, h) {
                var j, m, n, v, w, x = c;
                k || (k = !0,
                i && a.clearTimeout(i),
                e = void 0,
                g = h || "",
                y.readyState = b > 0 ? 4 : 0,
                j = b >= 200 && b < 300 || 304 === b,
                d && (v = Mb(o, y, d)),
                v = Nb(o, v, y, j),
                j ? (o.ifModified && (w = y.getResponseHeader("Last-Modified"),
                w && (r.lastModified[f] = w),
                w = y.getResponseHeader("etag"),
                w && (r.etag[f] = w)),
                204 === b || "HEAD" === o.type ? x = "nocontent" : 304 === b ? x = "notmodified" : (x = v.state,
                m = v.data,
                n = v.error,
                j = !n)) : (n = x,
                !b && x || (x = "error",
                b < 0 && (b = 0))),
                y.status = b,
                y.statusText = (c || x) + "",
                j ? s.resolveWith(p, [m, x, y]) : s.rejectWith(p, [y, x, n]),
                y.statusCode(u),
                u = void 0,
                l && q.trigger(j ? "ajaxSuccess" : "ajaxError", [y, o, j ? m : n]),
                t.fireWith(p, [y, x]),
                l && (q.trigger("ajaxComplete", [y, o]),
                --r.active || r.event.trigger("ajaxStop")))
            }
            return y
        },
        getJSON: function(a, b, c) {
            return r.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return r.get(a, void 0, b, "script")
        }
    }),
    r.each(["get", "post"], function(a, b) {
        r[b] = function(a, c, d, e) {
            return r.isFunction(c) && (e = e || d,
            d = c,
            c = void 0),
            r.ajax(r.extend({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            }, r.isPlainObject(a) && a))
        }
    }),
    r._evalUrl = function(a) {
        return r.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    r.fn.extend({
        wrapAll: function(a) {
            var b;
            return this[0] && (r.isFunction(a) && (a = a.call(this[0])),
            b = r(a, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && b.insertBefore(this[0]),
            b.map(function() {
                var a = this;
                while (a.firstElementChild)
                    a = a.firstElementChild;
                return a
            }).append(this)),
            this
        },
        wrapInner: function(a) {
            return r.isFunction(a) ? this.each(function(b) {
                r(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = r(this)
                  , c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = r.isFunction(a);
            return this.each(function(c) {
                r(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function(a) {
            return this.parent(a).not("body").each(function() {
                r(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    r.expr.pseudos.hidden = function(a) {
        return !r.expr.pseudos.visible(a)
    }
    ,
    r.expr.pseudos.visible = function(a) {
        return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length)
    }
    ,
    r.ajaxSettings.xhr = function() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }
    ;
    var Ob = {
        0: 200,
        1223: 204
    }
      , Pb = r.ajaxSettings.xhr();
    o.cors = !!Pb && "withCredentials"in Pb,
    o.ajax = Pb = !!Pb,
    r.ajaxTransport(function(b) {
        var c, d;
        if (o.cors || Pb && !b.crossDomain)
            return {
                send: function(e, f) {
                    var g, h = b.xhr();
                    if (h.open(b.type, b.url, b.async, b.username, b.password),
                    b.xhrFields)
                        for (g in b.xhrFields)
                            h[g] = b.xhrFields[g];
                    b.mimeType && h.overrideMimeType && h.overrideMimeType(b.mimeType),
                    b.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest");
                    for (g in e)
                        h.setRequestHeader(g, e[g]);
                    c = function(a) {
                        return function() {
                            c && (c = d = h.onload = h.onerror = h.onabort = h.onreadystatechange = null,
                            "abort" === a ? h.abort() : "error" === a ? "number" != typeof h.status ? f(0, "error") : f(h.status, h.statusText) : f(Ob[h.status] || h.status, h.statusText, "text" !== (h.responseType || "text") || "string" != typeof h.responseText ? {
                                binary: h.response
                            } : {
                                text: h.responseText
                            }, h.getAllResponseHeaders()))
                        }
                    }
                    ,
                    h.onload = c(),
                    d = h.onerror = c("error"),
                    void 0 !== h.onabort ? h.onabort = d : h.onreadystatechange = function() {
                        4 === h.readyState && a.setTimeout(function() {
                            c && d()
                        })
                    }
                    ,
                    c = c("abort");
                    try {
                        h.send(b.hasContent && b.data || null)
                    } catch (i) {
                        if (c)
                            throw i
                    }
                },
                abort: function() {
                    c && c()
                }
            }
    }),
    r.ajaxPrefilter(function(a) {
        a.crossDomain && (a.contents.script = !1)
    }),
    r.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(a) {
                return r.globalEval(a),
                a
            }
        }
    }),
    r.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1),
        a.crossDomain && (a.type = "GET")
    }),
    r.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c;
            return {
                send: function(e, f) {
                    b = r("<script>").prop({
                        charset: a.scriptCharset,
                        src: a.url
                    }).on("load error", c = function(a) {
                        b.remove(),
                        c = null,
                        a && f("error" === a.type ? 404 : 200, a.type)
                    }
                    ),
                    d.head.appendChild(b[0])
                },
                abort: function() {
                    c && c()
                }
            }
        }
    });
    var Qb = []
      , Rb = /(=)\?(?=&|$)|\?\?/;
    r.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = Qb.pop() || r.expando + "_" + rb++;
            return this[a] = !0,
            a
        }
    }),
    r.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (Rb.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && Rb.test(b.data) && "data");
        if (h || "jsonp" === b.dataTypes[0])
            return e = b.jsonpCallback = r.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
            h ? b[h] = b[h].replace(Rb, "$1" + e) : b.jsonp !== !1 && (b.url += (sb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
            b.converters["script json"] = function() {
                return g || r.error(e + " was not called"),
                g[0]
            }
            ,
            b.dataTypes[0] = "json",
            f = a[e],
            a[e] = function() {
                g = arguments
            }
            ,
            d.always(function() {
                void 0 === f ? r(a).removeProp(e) : a[e] = f,
                b[e] && (b.jsonpCallback = c.jsonpCallback,
                Qb.push(e)),
                g && r.isFunction(f) && f(g[0]),
                g = f = void 0
            }),
            "script"
    }),
    o.createHTMLDocument = function() {
        var a = d.implementation.createHTMLDocument("").body;
        return a.innerHTML = "<form></form><form></form>",
        2 === a.childNodes.length
    }(),
    r.parseHTML = function(a, b, c) {
        if ("string" != typeof a)
            return [];
        "boolean" == typeof b && (c = b,
        b = !1);
        var e, f, g;
        return b || (o.createHTMLDocument ? (b = d.implementation.createHTMLDocument(""),
        e = b.createElement("base"),
        e.href = d.location.href,
        b.head.appendChild(e)) : b = d),
        f = B.exec(a),
        g = !c && [],
        f ? [b.createElement(f[1])] : (f = pa([a], b, g),
        g && g.length && r(g).remove(),
        r.merge([], f.childNodes))
    }
    ,
    r.fn.load = function(a, b, c) {
        var d, e, f, g = this, h = a.indexOf(" ");
        return h > -1 && (d = mb(a.slice(h)),
        a = a.slice(0, h)),
        r.isFunction(b) ? (c = b,
        b = void 0) : b && "object" == typeof b && (e = "POST"),
        g.length > 0 && r.ajax({
            url: a,
            type: e || "GET",
            dataType: "html",
            data: b
        }).done(function(a) {
            f = arguments,
            g.html(d ? r("<div>").append(r.parseHTML(a)).find(d) : a)
        }).always(c && function(a, b) {
            g.each(function() {
                c.apply(this, f || [a.responseText, b, a])
            })
        }
        ),
        this
    }
    ,
    r.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        r.fn[b] = function(a) {
            return this.on(b, a)
        }
    }),
    r.expr.pseudos.animated = function(a) {
        return r.grep(r.timers, function(b) {
            return a === b.elem
        }).length
    }
    ;
    function Sb(a) {
        return r.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
    }
    r.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = r.css(a, "position"), l = r(a), m = {};
            "static" === k && (a.style.position = "relative"),
            h = l.offset(),
            f = r.css(a, "top"),
            i = r.css(a, "left"),
            j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1,
            j ? (d = l.position(),
            g = d.top,
            e = d.left) : (g = parseFloat(f) || 0,
            e = parseFloat(i) || 0),
            r.isFunction(b) && (b = b.call(a, c, r.extend({}, h))),
            null != b.top && (m.top = b.top - h.top + g),
            null != b.left && (m.left = b.left - h.left + e),
            "using"in b ? b.using.call(a, m) : l.css(m)
        }
    },
    r.fn.extend({
        offset: function(a) {
            if (arguments.length)
                return void 0 === a ? this : this.each(function(b) {
                    r.offset.setOffset(this, a, b)
                });
            var b, c, d, e, f = this[0];
            if (f)
                return f.getClientRects().length ? (d = f.getBoundingClientRect(),
                d.width || d.height ? (e = f.ownerDocument,
                c = Sb(e),
                b = e.documentElement,
                {
                    top: d.top + c.pageYOffset - b.clientTop,
                    left: d.left + c.pageXOffset - b.clientLeft
                }) : d) : {
                    top: 0,
                    left: 0
                }
        },
        position: function() {
            if (this[0]) {
                var a, b, c = this[0], d = {
                    top: 0,
                    left: 0
                };
                return "fixed" === r.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(),
                b = this.offset(),
                r.nodeName(a[0], "html") || (d = a.offset()),
                d = {
                    top: d.top + r.css(a[0], "borderTopWidth", !0),
                    left: d.left + r.css(a[0], "borderLeftWidth", !0)
                }),
                {
                    top: b.top - d.top - r.css(c, "marginTop", !0),
                    left: b.left - d.left - r.css(c, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent;
                while (a && "static" === r.css(a, "position"))
                    a = a.offsetParent;
                return a || qa
            })
        }
    }),
    r.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = "pageYOffset" === b;
        r.fn[a] = function(d) {
            return S(this, function(a, d, e) {
                var f = Sb(a);
                return void 0 === e ? f ? f[b] : a[d] : void (f ? f.scrollTo(c ? f.pageXOffset : e, c ? e : f.pageYOffset) : a[d] = e)
            }, a, d, arguments.length)
        }
    }),
    r.each(["top", "left"], function(a, b) {
        r.cssHooks[b] = Oa(o.pixelPosition, function(a, c) {
            if (c)
                return c = Na(a, b),
                La.test(c) ? r(a).position()[b] + "px" : c
        })
    }),
    r.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        r.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            r.fn[d] = function(e, f) {
                var g = arguments.length && (c || "boolean" != typeof e)
                  , h = c || (e === !0 || f === !0 ? "margin" : "border");
                return S(this, function(b, c, e) {
                    var f;
                    return r.isWindow(b) ? 0 === d.indexOf("outer") ? b["inner" + a] : b.document.documentElement["client" + a] : 9 === b.nodeType ? (f = b.documentElement,
                    Math.max(b.body["scroll" + a], f["scroll" + a], b.body["offset" + a], f["offset" + a], f["client" + a])) : void 0 === e ? r.css(b, c, h) : r.style(b, c, e, h)
                }, b, g ? e : void 0, g)
            }
        })
    }),
    r.fn.extend({
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    }),
    r.parseJSON = JSON.parse,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return r
    });
    var Tb = a.jQuery
      , Ub = a.$;
    return r.noConflict = function(b) {
        return a.$ === r && (a.$ = Ub),
        b && a.jQuery === r && (a.jQuery = Tb),
        r
    }
    ,
    b || (a.jQuery = a.$ = r),
    r
});
if ("undefined" == typeof jQuery)
    throw new Error("Bootstrap's JavaScript requires jQuery");
+function(a) {
    "use strict";
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1 || b[0] > 3)
        throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")
}(jQuery),
+function(a) {
    "use strict";
    function b() {
        var a = document.createElement("bootstrap")
          , b = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var c in b)
            if (void 0 !== a.style[c])
                return {
                    end: b[c]
                };
        return !1
    }
    a.fn.emulateTransitionEnd = function(b) {
        var c = !1
          , d = this;
        a(this).one("bsTransitionEnd", function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b),
        this
    }
    ,
    a(function() {
        a.support.transition = b(),
        a.support.transition && (a.event.special.bsTransitionEnd = {
            bindType: a.support.transition.end,
            delegateType: a.support.transition.end,
            handle: function(b) {
                if (a(b.target).is(this))
                    return b.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var c = a(this)
              , e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)),
            "string" == typeof b && e[b].call(c)
        })
    }
    var c = '[data-dismiss="alert"]'
      , d = function(b) {
        a(b).on("click", c, this.close)
    };
    d.VERSION = "3.3.7",
    d.TRANSITION_DURATION = 150,
    d.prototype.close = function(b) {
        function c() {
            g.detach().trigger("closed.bs.alert").remove()
        }
        var e = a(this)
          , f = e.attr("data-target");
        f || (f = e.attr("href"),
        f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a("#" === f ? [] : f);
        b && b.preventDefault(),
        g.length || (g = e.closest(".alert")),
        g.trigger(b = a.Event("close.bs.alert")),
        b.isDefaultPrevented() || (g.removeClass("in"),
        a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
    }
    ;
    var e = a.fn.alert;
    a.fn.alert = b,
    a.fn.alert.Constructor = d,
    a.fn.alert.noConflict = function() {
        return a.fn.alert = e,
        this
    }
    ,
    a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.button")
              , f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this,f)),
            "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }
    var c = function(b, d) {
        this.$element = a(b),
        this.options = a.extend({}, c.DEFAULTS, d),
        this.isLoading = !1
    };
    c.VERSION = "3.3.7",
    c.DEFAULTS = {
        loadingText: "loading..."
    },
    c.prototype.setState = function(b) {
        var c = "disabled"
          , d = this.$element
          , e = d.is("input") ? "val" : "html"
          , f = d.data();
        b += "Text",
        null == f.resetText && d.data("resetText", d[e]()),
        setTimeout(a.proxy(function() {
            d[e](null == f[b] ? this.options[b] : f[b]),
            "loadingText" == b ? (this.isLoading = !0,
            d.addClass(c).attr(c, c).prop(c, !0)) : this.isLoading && (this.isLoading = !1,
            d.removeClass(c).removeAttr(c).prop(c, !1))
        }, this), 0)
    }
    ,
    c.prototype.toggle = function() {
        var a = !0
          , b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") ? (c.prop("checked") && (a = !1),
            b.find(".active").removeClass("active"),
            this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1),
            this.$element.toggleClass("active")),
            c.prop("checked", this.$element.hasClass("active")),
            a && c.trigger("change")
        } else
            this.$element.attr("aria-pressed", !this.$element.hasClass("active")),
            this.$element.toggleClass("active")
    }
    ;
    var d = a.fn.button;
    a.fn.button = b,
    a.fn.button.Constructor = c,
    a.fn.button.noConflict = function() {
        return a.fn.button = d,
        this
    }
    ,
    a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(c) {
        var d = a(c.target).closest(".btn");
        b.call(d, "toggle"),
        a(c.target).is('input[type="radio"], input[type="checkbox"]') || (c.preventDefault(),
        d.is("input,button") ? d.trigger("focus") : d.find("input:visible,button:visible").first().trigger("focus"))
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(b) {
        a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
    })
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.carousel")
              , f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b)
              , g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this,f)),
            "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }
    var c = function(b, c) {
        this.$element = a(b),
        this.$indicators = this.$element.find(".carousel-indicators"),
        this.options = c,
        this.paused = null,
        this.sliding = null,
        this.interval = null,
        this.$active = null,
        this.$items = null,
        this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)),
        "hover" == this.options.pause && !("ontouchstart"in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.3.7",
    c.TRANSITION_DURATION = 600,
    c.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    },
    c.prototype.keydown = function(a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
            switch (a.which) {
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default:
                return
            }
            a.preventDefault()
        }
    }
    ,
    c.prototype.cycle = function(b) {
        return b || (this.paused = !1),
        this.interval && clearInterval(this.interval),
        this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)),
        this
    }
    ,
    c.prototype.getItemIndex = function(a) {
        return this.$items = a.parent().children(".item"),
        this.$items.index(a || this.$active)
    }
    ,
    c.prototype.getItemForDirection = function(a, b) {
        var c = this.getItemIndex(b)
          , d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
        if (d && !this.options.wrap)
            return b;
        var e = "prev" == a ? -1 : 1
          , f = (c + e) % this.$items.length;
        return this.$items.eq(f)
    }
    ,
    c.prototype.to = function(a) {
        var b = this
          , c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (!(a > this.$items.length - 1 || a < 0))
            return this.sliding ? this.$element.one("slid.bs.carousel", function() {
                b.to(a)
            }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
    }
    ,
    c.prototype.pause = function(b) {
        return b || (this.paused = !0),
        this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end),
        this.cycle(!0)),
        this.interval = clearInterval(this.interval),
        this
    }
    ,
    c.prototype.next = function() {
        if (!this.sliding)
            return this.slide("next")
    }
    ,
    c.prototype.prev = function() {
        if (!this.sliding)
            return this.slide("prev")
    }
    ,
    c.prototype.slide = function(b, d) {
        var e = this.$element.find(".item.active")
          , f = d || this.getItemForDirection(b, e)
          , g = this.interval
          , h = "next" == b ? "left" : "right"
          , i = this;
        if (f.hasClass("active"))
            return this.sliding = !1;
        var j = f[0]
          , k = a.Event("slide.bs.carousel", {
            relatedTarget: j,
            direction: h
        });
        if (this.$element.trigger(k),
        !k.isDefaultPrevented()) {
            if (this.sliding = !0,
            g && this.pause(),
            this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                l && l.addClass("active")
            }
            var m = a.Event("slid.bs.carousel", {
                relatedTarget: j,
                direction: h
            });
            return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b),
            f[0].offsetWidth,
            e.addClass(h),
            f.addClass(h),
            e.one("bsTransitionEnd", function() {
                f.removeClass([b, h].join(" ")).addClass("active"),
                e.removeClass(["active", h].join(" ")),
                i.sliding = !1,
                setTimeout(function() {
                    i.$element.trigger(m)
                }, 0)
            }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"),
            f.addClass("active"),
            this.sliding = !1,
            this.$element.trigger(m)),
            g && this.cycle(),
            this
        }
    }
    ;
    var d = a.fn.carousel;
    a.fn.carousel = b,
    a.fn.carousel.Constructor = c,
    a.fn.carousel.noConflict = function() {
        return a.fn.carousel = d,
        this
    }
    ;
    var e = function(c) {
        var d, e = a(this), f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
        if (f.hasClass("carousel")) {
            var g = a.extend({}, f.data(), e.data())
              , h = e.attr("data-slide-to");
            h && (g.interval = !1),
            b.call(f, g),
            h && f.data("bs.carousel").to(h),
            c.preventDefault()
        }
    };
    a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e),
    a(window).on("load", function() {
        a('[data-ride="carousel"]').each(function() {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d)
    }
    function c(b) {
        return this.each(function() {
            var c = a(this)
              , e = c.data("bs.collapse")
              , f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
            !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1),
            e || c.data("bs.collapse", e = new d(this,f)),
            "string" == typeof b && e[b]()
        })
    }
    var d = function(b, c) {
        this.$element = a(b),
        this.options = a.extend({}, d.DEFAULTS, c),
        this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'),
        this.transitioning = null,
        this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
        this.options.toggle && this.toggle()
    };
    d.VERSION = "3.3.7",
    d.TRANSITION_DURATION = 350,
    d.DEFAULTS = {
        toggle: !0
    },
    d.prototype.dimension = function() {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }
    ,
    d.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(e && e.length && (b = e.data("bs.collapse"),
            b && b.transitioning))) {
                var f = a.Event("show.bs.collapse");
                if (this.$element.trigger(f),
                !f.isDefaultPrevented()) {
                    e && e.length && (c.call(e, "hide"),
                    b || e.data("bs.collapse", null));
                    var g = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0),
                    this.$trigger.removeClass("collapsed").attr("aria-expanded", !0),
                    this.transitioning = 1;
                    var h = function() {
                        this.$element.removeClass("collapsing").addClass("collapse in")[g](""),
                        this.transitioning = 0,
                        this.$element.trigger("shown.bs.collapse")
                    };
                    if (!a.support.transition)
                        return h.call(this);
                    var i = a.camelCase(["scroll", g].join("-"));
                    this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                }
            }
        }
    }
    ,
    d.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b),
            !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight,
                this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1),
                this.$trigger.addClass("collapsed").attr("aria-expanded", !1),
                this.transitioning = 1;
                var e = function() {
                    this.transitioning = 0,
                    this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
            }
        }
    }
    ,
    d.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }
    ,
    d.prototype.getParent = function() {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function(c, d) {
            var e = a(d);
            this.addAriaAndCollapsedClass(b(e), e)
        }, this)).end()
    }
    ,
    d.prototype.addAriaAndCollapsedClass = function(a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c),
        b.toggleClass("collapsed", !c).attr("aria-expanded", c)
    }
    ;
    var e = a.fn.collapse;
    a.fn.collapse = c,
    a.fn.collapse.Constructor = d,
    a.fn.collapse.noConflict = function() {
        return a.fn.collapse = e,
        this
    }
    ,
    a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e)
          , g = f.data("bs.collapse")
          , h = g ? "toggle" : e.data();
        c.call(f, h)
    })
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"),
        c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }
    function c(c) {
        c && 3 === c.which || (a(e).remove(),
        a(f).each(function() {
            var d = a(this)
              , e = b(d)
              , f = {
                relatedTarget: this
            };
            e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)),
            c.isDefaultPrevented() || (d.attr("aria-expanded", "false"),
            e.removeClass("open").trigger(a.Event("hidden.bs.dropdown", f)))))
        }))
    }
    function d(b) {
        return this.each(function() {
            var c = a(this)
              , d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)),
            "string" == typeof b && d[b].call(c)
        })
    }
    var e = ".dropdown-backdrop"
      , f = '[data-toggle="dropdown"]'
      , g = function(b) {
        a(b).on("click.bs.dropdown", this.toggle)
    };
    g.VERSION = "3.3.7",
    g.prototype.toggle = function(d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = b(e)
              , g = f.hasClass("open");
            if (c(),
            !g) {
                "ontouchstart"in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
                var h = {
                    relatedTarget: this
                };
                if (f.trigger(d = a.Event("show.bs.dropdown", h)),
                d.isDefaultPrevented())
                    return;
                e.trigger("focus").attr("aria-expanded", "true"),
                f.toggleClass("open").trigger(a.Event("shown.bs.dropdown", h))
            }
            return !1
        }
    }
    ,
    g.prototype.keydown = function(c) {
        if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
            var d = a(this);
            if (c.preventDefault(),
            c.stopPropagation(),
            !d.is(".disabled, :disabled")) {
                var e = b(d)
                  , g = e.hasClass("open");
                if (!g && 27 != c.which || g && 27 == c.which)
                    return 27 == c.which && e.find(f).trigger("focus"),
                    d.trigger("click");
                var h = " li:not(.disabled):visible a"
                  , i = e.find(".dropdown-menu" + h);
                if (i.length) {
                    var j = i.index(c.target);
                    38 == c.which && j > 0 && j--,
                    40 == c.which && j < i.length - 1 && j++,
                    ~j || (j = 0),
                    i.eq(j).trigger("focus")
                }
            }
        }
    }
    ;
    var h = a.fn.dropdown;
    a.fn.dropdown = d,
    a.fn.dropdown.Constructor = g,
    a.fn.dropdown.noConflict = function() {
        return a.fn.dropdown = h,
        this
    }
    ,
    a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown)
}(jQuery),
+function(a) {
    "use strict";
    function b(b, d) {
        return this.each(function() {
            var e = a(this)
              , f = e.data("bs.modal")
              , g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this,g)),
            "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }
    var c = function(b, c) {
        this.options = c,
        this.$body = a(document.body),
        this.$element = a(b),
        this.$dialog = this.$element.find(".modal-dialog"),
        this.$backdrop = null,
        this.isShown = null,
        this.originalBodyPad = null,
        this.scrollbarWidth = 0,
        this.ignoreBackdropClick = !1,
        this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.3.7",
    c.TRANSITION_DURATION = 300,
    c.BACKDROP_TRANSITION_DURATION = 150,
    c.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    },
    c.prototype.toggle = function(a) {
        return this.isShown ? this.hide() : this.show(a)
    }
    ,
    c.prototype.show = function(b) {
        var d = this
          , e = a.Event("show.bs.modal", {
            relatedTarget: b
        });
        this.$element.trigger(e),
        this.isShown || e.isDefaultPrevented() || (this.isShown = !0,
        this.checkScrollbar(),
        this.setScrollbar(),
        this.$body.addClass("modal-open"),
        this.escape(),
        this.resize(),
        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)),
        this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            d.$element.one("mouseup.dismiss.bs.modal", function(b) {
                a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0)
            })
        }),
        this.backdrop(function() {
            var e = a.support.transition && d.$element.hasClass("fade");
            d.$element.parent().length || d.$element.appendTo(d.$body),
            d.$element.show().scrollTop(0),
            d.adjustDialog(),
            e && d.$element[0].offsetWidth,
            d.$element.addClass("in"),
            d.enforceFocus();
            var f = a.Event("shown.bs.modal", {
                relatedTarget: b
            });
            e ? d.$dialog.one("bsTransitionEnd", function() {
                d.$element.trigger("focus").trigger(f)
            }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
        }))
    }
    ,
    c.prototype.hide = function(b) {
        b && b.preventDefault(),
        b = a.Event("hide.bs.modal"),
        this.$element.trigger(b),
        this.isShown && !b.isDefaultPrevented() && (this.isShown = !1,
        this.escape(),
        this.resize(),
        a(document).off("focusin.bs.modal"),
        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),
        this.$dialog.off("mousedown.dismiss.bs.modal"),
        a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
    }
    ,
    c.prototype.enforceFocus = function() {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
            document === a.target || this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }
    ,
    c.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function(a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }
    ,
    c.prototype.resize = function() {
        this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
    }
    ,
    c.prototype.hideModal = function() {
        var a = this;
        this.$element.hide(),
        this.backdrop(function() {
            a.$body.removeClass("modal-open"),
            a.resetAdjustments(),
            a.resetScrollbar(),
            a.$element.trigger("hidden.bs.modal")
        })
    }
    ,
    c.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(),
        this.$backdrop = null
    }
    ,
    c.prototype.backdrop = function(b) {
        var d = this
          , e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var f = a.support.transition && e;
            if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body),
            this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                return this.ignoreBackdropClick ? void (this.ignoreBackdropClick = !1) : void (a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
            }, this)),
            f && this.$backdrop[0].offsetWidth,
            this.$backdrop.addClass("in"),
            !b)
                return;
            f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var g = function() {
                d.removeBackdrop(),
                b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
        } else
            b && b()
    }
    ,
    c.prototype.handleUpdate = function() {
        this.adjustDialog()
    }
    ,
    c.prototype.adjustDialog = function() {
        var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
        })
    }
    ,
    c.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    }
    ,
    c.prototype.checkScrollbar = function() {
        var a = window.innerWidth;
        if (!a) {
            var b = document.documentElement.getBoundingClientRect();
            a = b.right - Math.abs(b.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < a,
        this.scrollbarWidth = this.measureScrollbar()
    }
    ,
    c.prototype.setScrollbar = function() {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "",
        this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
    }
    ,
    c.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad)
    }
    ,
    c.prototype.measureScrollbar = function() {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure",
        this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a),
        b
    }
    ;
    var d = a.fn.modal;
    a.fn.modal = b,
    a.fn.modal.Constructor = c,
    a.fn.modal.noConflict = function() {
        return a.fn.modal = d,
        this
    }
    ,
    a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(c) {
        var d = a(this)
          , e = d.attr("href")
          , f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, ""))
          , g = f.data("bs.modal") ? "toggle" : a.extend({
            remote: !/#/.test(e) && e
        }, f.data(), d.data());
        d.is("a") && c.preventDefault(),
        f.one("show.bs.modal", function(a) {
            a.isDefaultPrevented() || f.one("hidden.bs.modal", function() {
                d.is(":visible") && d.trigger("focus")
            })
        }),
        b.call(f, g, this)
    })
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.tooltip")
              , f = "object" == typeof b && b;
            !e && /destroy|hide/.test(b) || (e || d.data("bs.tooltip", e = new c(this,f)),
            "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.type = null,
        this.options = null,
        this.enabled = null,
        this.timeout = null,
        this.hoverState = null,
        this.$element = null,
        this.inState = null,
        this.init("tooltip", a, b)
    };
    c.VERSION = "3.3.7",
    c.TRANSITION_DURATION = 150,
    c.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    },
    c.prototype.init = function(b, c, d) {
        if (this.enabled = !0,
        this.type = b,
        this.$element = a(c),
        this.options = this.getOptions(d),
        this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport),
        this.inState = {
            click: !1,
            hover: !1,
            focus: !1
        },
        this.$element[0]instanceof document.constructor && !this.options.selector)
            throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var e = this.options.trigger.split(" "), f = e.length; f--; ) {
            var g = e[f];
            if ("click" == g)
                this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
            else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin"
                  , i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)),
                this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }
    ,
    c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }
    ,
    c.prototype.getOptions = function(b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b),
        b.delay && "number" == typeof b.delay && (b.delay = {
            show: b.delay,
            hide: b.delay
        }),
        b
    }
    ,
    c.prototype.getDelegateOptions = function() {
        var b = {}
          , c = this.getDefaults();
        return this._options && a.each(this._options, function(a, d) {
            c[a] != d && (b[a] = d)
        }),
        b
    }
    ,
    c.prototype.enter = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget,this.getDelegateOptions()),
        a(b.currentTarget).data("bs." + this.type, c)),
        b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0),
        c.tip().hasClass("in") || "in" == c.hoverState ? void (c.hoverState = "in") : (clearTimeout(c.timeout),
        c.hoverState = "in",
        c.options.delay && c.options.delay.show ? void (c.timeout = setTimeout(function() {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show())
    }
    ,
    c.prototype.isInStateTrue = function() {
        for (var a in this.inState)
            if (this.inState[a])
                return !0;
        return !1
    }
    ,
    c.prototype.leave = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        if (c || (c = new this.constructor(b.currentTarget,this.getDelegateOptions()),
        a(b.currentTarget).data("bs." + this.type, c)),
        b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1),
        !c.isInStateTrue())
            return clearTimeout(c.timeout),
            c.hoverState = "out",
            c.options.delay && c.options.delay.hide ? void (c.timeout = setTimeout(function() {
                "out" == c.hoverState && c.hide()
            }, c.options.delay.hide)) : c.hide()
    }
    ,
    c.prototype.show = function() {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(b);
            var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (b.isDefaultPrevented() || !d)
                return;
            var e = this
              , f = this.tip()
              , g = this.getUID(this.type);
            this.setContent(),
            f.attr("id", g),
            this.$element.attr("aria-describedby", g),
            this.options.animation && f.addClass("fade");
            var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement
              , i = /\s?auto?\s?/i
              , j = i.test(h);
            j && (h = h.replace(i, "") || "top"),
            f.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(h).data("bs." + this.type, this),
            this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element),
            this.$element.trigger("inserted.bs." + this.type);
            var k = this.getPosition()
              , l = f[0].offsetWidth
              , m = f[0].offsetHeight;
            if (j) {
                var n = h
                  , o = this.getPosition(this.$viewport);
                h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h,
                f.removeClass(n).addClass(h)
            }
            var p = this.getCalculatedOffset(h, k, l, m);
            this.applyPlacement(p, h);
            var q = function() {
                var a = e.hoverState;
                e.$element.trigger("shown.bs." + e.type),
                e.hoverState = null,
                "out" == a && e.leave(e)
            };
            a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q()
        }
    }
    ,
    c.prototype.applyPlacement = function(b, c) {
        var d = this.tip()
          , e = d[0].offsetWidth
          , f = d[0].offsetHeight
          , g = parseInt(d.css("margin-top"), 10)
          , h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0),
        isNaN(h) && (h = 0),
        b.top += g,
        b.left += h,
        a.offset.setOffset(d[0], a.extend({
            using: function(a) {
                d.css({
                    top: Math.round(a.top),
                    left: Math.round(a.left)
                })
            }
        }, b), 0),
        d.addClass("in");
        var i = d[0].offsetWidth
          , j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c)
          , m = l ? 2 * k.left - e + i : 2 * k.top - f + j
          , n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b),
        this.replaceArrow(m, d[0][n], l)
    }
    ,
    c.prototype.replaceArrow = function(a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
    }
    ,
    c.prototype.setContent = function() {
        var a = this.tip()
          , b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b),
        a.removeClass("fade in top bottom left right")
    }
    ,
    c.prototype.hide = function(b) {
        function d() {
            "in" != e.hoverState && f.detach(),
            e.$element && e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type),
            b && b()
        }
        var e = this
          , f = a(this.$tip)
          , g = a.Event("hide.bs." + this.type);
        if (this.$element.trigger(g),
        !g.isDefaultPrevented())
            return f.removeClass("in"),
            a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(),
            this.hoverState = null,
            this
    }
    ,
    c.prototype.fixTitle = function() {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }
    ,
    c.prototype.hasContent = function() {
        return this.getTitle()
    }
    ,
    c.prototype.getPosition = function(b) {
        b = b || this.$element;
        var c = b[0]
          , d = "BODY" == c.tagName
          , e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {
            width: e.right - e.left,
            height: e.bottom - e.top
        }));
        var f = window.SVGElement && c instanceof window.SVGElement
          , g = d ? {
            top: 0,
            left: 0
        } : f ? null : b.offset()
          , h = {
            scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
        }
          , i = d ? {
            width: a(window).width(),
            height: a(window).height()
        } : null;
        return a.extend({}, e, h, i, g)
    }
    ,
    c.prototype.getCalculatedOffset = function(a, b, c, d) {
        return "bottom" == a ? {
            top: b.top + b.height,
            left: b.left + b.width / 2 - c / 2
        } : "top" == a ? {
            top: b.top - d,
            left: b.left + b.width / 2 - c / 2
        } : "left" == a ? {
            top: b.top + b.height / 2 - d / 2,
            left: b.left - c
        } : {
            top: b.top + b.height / 2 - d / 2,
            left: b.left + b.width
        }
    }
    ,
    c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
        var e = {
            top: 0,
            left: 0
        };
        if (!this.$viewport)
            return e;
        var f = this.options.viewport && this.options.viewport.padding || 0
          , g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll
              , i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f
              , k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k)
        }
        return e
    }
    ,
    c.prototype.getTitle = function() {
        var a, b = this.$element, c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }
    ,
    c.prototype.getUID = function(a) {
        do
            a += ~~(1e6 * Math.random());
        while (document.getElementById(a));return a
    }
    ,
    c.prototype.tip = function() {
        if (!this.$tip && (this.$tip = a(this.options.template),
        1 != this.$tip.length))
            throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }
    ,
    c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }
    ,
    c.prototype.enable = function() {
        this.enabled = !0
    }
    ,
    c.prototype.disable = function() {
        this.enabled = !1
    }
    ,
    c.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }
    ,
    c.prototype.toggle = function(b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type),
        c || (c = new this.constructor(b.currentTarget,this.getDelegateOptions()),
        a(b.currentTarget).data("bs." + this.type, c))),
        b ? (c.inState.click = !c.inState.click,
        c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }
    ,
    c.prototype.destroy = function() {
        var a = this;
        clearTimeout(this.timeout),
        this.hide(function() {
            a.$element.off("." + a.type).removeData("bs." + a.type),
            a.$tip && a.$tip.detach(),
            a.$tip = null,
            a.$arrow = null,
            a.$viewport = null,
            a.$element = null
        })
    }
    ;
    var d = a.fn.tooltip;
    a.fn.tooltip = b,
    a.fn.tooltip.Constructor = c,
    a.fn.tooltip.noConflict = function() {
        return a.fn.tooltip = d,
        this
    }
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.popover")
              , f = "object" == typeof b && b;
            !e && /destroy|hide/.test(b) || (e || d.data("bs.popover", e = new c(this,f)),
            "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip)
        throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.3.7",
    c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }),
    c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype),
    c.prototype.constructor = c,
    c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }
    ,
    c.prototype.setContent = function() {
        var a = this.tip()
          , b = this.getTitle()
          , c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b),
        a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c),
        a.removeClass("fade top bottom left right in"),
        a.find(".popover-title").html() || a.find(".popover-title").hide()
    }
    ,
    c.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }
    ,
    c.prototype.getContent = function() {
        var a = this.$element
          , b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }
    ,
    c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }
    ;
    var d = a.fn.popover;
    a.fn.popover = b,
    a.fn.popover.Constructor = c,
    a.fn.popover.noConflict = function() {
        return a.fn.popover = d,
        this
    }
}(jQuery),
+function(a) {
    "use strict";
    function b(c, d) {
        this.$body = a(document.body),
        this.$scrollElement = a(a(c).is(document.body) ? window : c),
        this.options = a.extend({}, b.DEFAULTS, d),
        this.selector = (this.options.target || "") + " .nav li > a",
        this.offsets = [],
        this.targets = [],
        this.activeTarget = null,
        this.scrollHeight = 0,
        this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)),
        this.refresh(),
        this.process()
    }
    function c(c) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.scrollspy")
              , f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this,f)),
            "string" == typeof c && e[c]()
        })
    }
    b.VERSION = "3.3.7",
    b.DEFAULTS = {
        offset: 10
    },
    b.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }
    ,
    b.prototype.refresh = function() {
        var b = this
          , c = "offset"
          , d = 0;
        this.offsets = [],
        this.targets = [],
        this.scrollHeight = this.getScrollHeight(),
        a.isWindow(this.$scrollElement[0]) || (c = "position",
        d = this.$scrollElement.scrollTop()),
        this.$body.find(this.selector).map(function() {
            var b = a(this)
              , e = b.data("target") || b.attr("href")
              , f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [[f[c]().top + d, e]] || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            b.offsets.push(this[0]),
            b.targets.push(this[1])
        })
    }
    ,
    b.prototype.process = function() {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset, c = this.getScrollHeight(), d = this.options.offset + c - this.$scrollElement.height(), e = this.offsets, f = this.targets, g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(),
        b >= d)
            return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0])
            return this.activeTarget = null,
            this.clear();
        for (a = e.length; a--; )
            g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a])
    }
    ,
    b.prototype.activate = function(b) {
        this.activeTarget = b,
        this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]'
          , d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")),
        d.trigger("activate.bs.scrollspy")
    }
    ,
    b.prototype.clear = function() {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    }
    ;
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c,
    a.fn.scrollspy.Constructor = b,
    a.fn.scrollspy.noConflict = function() {
        return a.fn.scrollspy = d,
        this
    }
    ,
    a(window).on("load.bs.scrollspy.data-api", function() {
        a('[data-spy="scroll"]').each(function() {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)),
            "string" == typeof b && e[b]()
        })
    }
    var c = function(b) {
        this.element = a(b)
    };
    c.VERSION = "3.3.7",
    c.TRANSITION_DURATION = 150,
    c.prototype.show = function() {
        var b = this.element
          , c = b.closest("ul:not(.dropdown-menu)")
          , d = b.data("target");
        if (d || (d = b.attr("href"),
        d = d && d.replace(/.*(?=#[^\s]*$)/, "")),
        !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a")
              , f = a.Event("hide.bs.tab", {
                relatedTarget: b[0]
            })
              , g = a.Event("show.bs.tab", {
                relatedTarget: e[0]
            });
            if (e.trigger(f),
            b.trigger(g),
            !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                var h = a(d);
                this.activate(b.closest("li"), c),
                this.activate(h, h.parent(), function() {
                    e.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: b[0]
                    }),
                    b.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: e[0]
                    })
                })
            }
        }
    }
    ,
    c.prototype.activate = function(b, d, e) {
        function f() {
            g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1),
            b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0),
            h ? (b[0].offsetWidth,
            b.addClass("in")) : b.removeClass("fade"),
            b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0),
            e && e()
        }
        var g = d.find("> .active")
          , h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(),
        g.removeClass("in")
    }
    ;
    var d = a.fn.tab;
    a.fn.tab = b,
    a.fn.tab.Constructor = c,
    a.fn.tab.noConflict = function() {
        return a.fn.tab = d,
        this
    }
    ;
    var e = function(c) {
        c.preventDefault(),
        b.call(a(this), "show")
    };
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery),
+function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this)
              , e = d.data("bs.affix")
              , f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this,f)),
            "string" == typeof b && e[b]()
        })
    }
    var c = function(b, d) {
        this.options = a.extend({}, c.DEFAULTS, d),
        this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)),
        this.$element = a(b),
        this.affixed = null,
        this.unpin = null,
        this.pinnedOffset = null,
        this.checkPosition()
    };
    c.VERSION = "3.3.7",
    c.RESET = "affix affix-top affix-bottom",
    c.DEFAULTS = {
        offset: 0,
        target: window
    },
    c.prototype.getState = function(a, b, c, d) {
        var e = this.$target.scrollTop()
          , f = this.$element.offset()
          , g = this.$target.height();
        if (null != c && "top" == this.affixed)
            return e < c && "top";
        if ("bottom" == this.affixed)
            return null != c ? !(e + this.unpin <= f.top) && "bottom" : !(e + g <= a - d) && "bottom";
        var h = null == this.affixed
          , i = h ? e : f.top
          , j = h ? g : b;
        return null != c && e <= c ? "top" : null != d && i + j >= a - d && "bottom"
    }
    ,
    c.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset)
            return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop()
          , b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }
    ,
    c.prototype.checkPositionWithEventLoop = function() {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }
    ,
    c.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var b = this.$element.height()
              , d = this.options.offset
              , e = d.top
              , f = d.bottom
              , g = Math.max(a(document).height(), a(document.body).height());
            "object" != typeof d && (f = e = d),
            "function" == typeof e && (e = d.top(this.$element)),
            "function" == typeof f && (f = d.bottom(this.$element));
            var h = this.getState(g, b, e, f);
            if (this.affixed != h) {
                null != this.unpin && this.$element.css("top", "");
                var i = "affix" + (h ? "-" + h : "")
                  , j = a.Event(i + ".bs.affix");
                if (this.$element.trigger(j),
                j.isDefaultPrevented())
                    return;
                this.affixed = h,
                this.unpin = "bottom" == h ? this.getPinnedOffset() : null,
                this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == h && this.$element.offset({
                top: g - b - f
            })
        }
    }
    ;
    var d = a.fn.affix;
    a.fn.affix = b,
    a.fn.affix.Constructor = c,
    a.fn.affix.noConflict = function() {
        return a.fn.affix = d,
        this
    }
    ,
    a(window).on("load", function() {
        a('[data-spy="affix"]').each(function() {
            var c = a(this)
              , d = c.data();
            d.offset = d.offset || {},
            null != d.offsetBottom && (d.offset.bottom = d.offsetBottom),
            null != d.offsetTop && (d.offset.top = d.offsetTop),
            b.call(c, d)
        })
    })
}(jQuery);
!function() {
    "use strict";
    function e(e) {
        e.fn.swiper = function(a) {
            var r;
            return e(this).each(function() {
                var e = new t(this,a);
                r || (r = e)
            }),
            r
        }
    }
    var a, t = function(e, i) {
        function s(e) {
            return Math.floor(e)
        }
        function n() {
            b.autoplayTimeoutId = setTimeout(function() {
                b.params.loop ? (b.fixLoop(),
                b._slideNext(),
                b.emit("onAutoplay", b)) : b.isEnd ? i.autoplayStopOnLast ? b.stopAutoplay() : (b._slideTo(0),
                b.emit("onAutoplay", b)) : (b._slideNext(),
                b.emit("onAutoplay", b))
            }, b.params.autoplay)
        }
        function o(e, t) {
            var r = a(e.target);
            if (!r.is(t))
                if ("string" == typeof t)
                    r = r.parents(t);
                else if (t.nodeType) {
                    var i;
                    return r.parents().each(function(e, a) {
                        a === t && (i = t)
                    }),
                    i ? t : void 0
                }
            if (0 !== r.length)
                return r[0]
        }
        function l(e, a) {
            a = a || {};
            var t = window.MutationObserver || window.WebkitMutationObserver
              , r = new t(function(e) {
                e.forEach(function(e) {
                    b.onResize(!0),
                    b.emit("onObserverUpdate", b, e)
                })
            }
            );
            r.observe(e, {
                attributes: "undefined" == typeof a.attributes ? !0 : a.attributes,
                childList: "undefined" == typeof a.childList ? !0 : a.childList,
                characterData: "undefined" == typeof a.characterData ? !0 : a.characterData
            }),
            b.observers.push(r)
        }
        function p(e) {
            e.originalEvent && (e = e.originalEvent);
            var a = e.keyCode || e.charCode;
            if (!b.params.allowSwipeToNext && (b.isHorizontal() && 39 === a || !b.isHorizontal() && 40 === a))
                return !1;
            if (!b.params.allowSwipeToPrev && (b.isHorizontal() && 37 === a || !b.isHorizontal() && 38 === a))
                return !1;
            if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
                if (37 === a || 39 === a || 38 === a || 40 === a) {
                    var t = !1;
                    if (b.container.parents(".swiper-slide").length > 0 && 0 === b.container.parents(".swiper-slide-active").length)
                        return;
                    var r = {
                        left: window.pageXOffset,
                        top: window.pageYOffset
                    }
                      , i = window.innerWidth
                      , s = window.innerHeight
                      , n = b.container.offset();
                    b.rtl && (n.left = n.left - b.container[0].scrollLeft);
                    for (var o = [[n.left, n.top], [n.left + b.width, n.top], [n.left, n.top + b.height], [n.left + b.width, n.top + b.height]], l = 0; l < o.length; l++) {
                        var p = o[l];
                        p[0] >= r.left && p[0] <= r.left + i && p[1] >= r.top && p[1] <= r.top + s && (t = !0)
                    }
                    if (!t)
                        return
                }
                b.isHorizontal() ? ((37 === a || 39 === a) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1),
                (39 === a && !b.rtl || 37 === a && b.rtl) && b.slideNext(),
                (37 === a && !b.rtl || 39 === a && b.rtl) && b.slidePrev()) : ((38 === a || 40 === a) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1),
                40 === a && b.slideNext(),
                38 === a && b.slidePrev())
            }
        }
        function d(e) {
            e.originalEvent && (e = e.originalEvent);
            var a = b.mousewheel.event
              , t = 0
              , r = b.rtl ? -1 : 1;
            if ("mousewheel" === a)
                if (b.params.mousewheelForceToAxis)
                    if (b.isHorizontal()) {
                        if (!(Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)))
                            return;
                        t = e.wheelDeltaX * r
                    } else {
                        if (!(Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)))
                            return;
                        t = e.wheelDeltaY
                    }
                else
                    t = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? -e.wheelDeltaX * r : -e.wheelDeltaY;
            else if ("DOMMouseScroll" === a)
                t = -e.detail;
            else if ("wheel" === a)
                if (b.params.mousewheelForceToAxis)
                    if (b.isHorizontal()) {
                        if (!(Math.abs(e.deltaX) > Math.abs(e.deltaY)))
                            return;
                        t = -e.deltaX * r
                    } else {
                        if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX)))
                            return;
                        t = -e.deltaY
                    }
                else
                    t = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX * r : -e.deltaY;
            if (0 !== t) {
                if (b.params.mousewheelInvert && (t = -t),
                b.params.freeMode) {
                    var i = b.getWrapperTranslate() + t * b.params.mousewheelSensitivity
                      , s = b.isBeginning
                      , n = b.isEnd;
                    if (i >= b.minTranslate() && (i = b.minTranslate()),
                    i <= b.maxTranslate() && (i = b.maxTranslate()),
                    b.setWrapperTransition(0),
                    b.setWrapperTranslate(i),
                    b.updateProgress(),
                    b.updateActiveIndex(),
                    (!s && b.isBeginning || !n && b.isEnd) && b.updateClasses(),
                    b.params.freeModeSticky ? (clearTimeout(b.mousewheel.timeout),
                    b.mousewheel.timeout = setTimeout(function() {
                        b.slideReset()
                    }, 300)) : b.params.lazyLoading && b.lazy && b.lazy.load(),
                    0 === i || i === b.maxTranslate())
                        return
                } else {
                    if ((new window.Date).getTime() - b.mousewheel.lastScrollTime > 60)
                        if (0 > t)
                            if (b.isEnd && !b.params.loop || b.animating) {
                                if (b.params.mousewheelReleaseOnEdges)
                                    return !0
                            } else
                                b.slideNext();
                        else if (b.isBeginning && !b.params.loop || b.animating) {
                            if (b.params.mousewheelReleaseOnEdges)
                                return !0
                        } else
                            b.slidePrev();
                    b.mousewheel.lastScrollTime = (new window.Date).getTime()
                }
                return b.params.autoplay && b.stopAutoplay(),
                e.preventDefault ? e.preventDefault() : e.returnValue = !1,
                !1
            }
        }
        function u(e, t) {
            e = a(e);
            var r, i, s, n = b.rtl ? -1 : 1;
            r = e.attr("data-swiper-parallax") || "0",
            i = e.attr("data-swiper-parallax-x"),
            s = e.attr("data-swiper-parallax-y"),
            i || s ? (i = i || "0",
            s = s || "0") : b.isHorizontal() ? (i = r,
            s = "0") : (s = r,
            i = "0"),
            i = i.indexOf("%") >= 0 ? parseInt(i, 10) * t * n + "%" : i * t * n + "px",
            s = s.indexOf("%") >= 0 ? parseInt(s, 10) * t + "%" : s * t + "px",
            e.transform("translate3d(" + i + ", " + s + ",0px)")
        }
        function c(e) {
            return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e),
            e
        }
        if (!(this instanceof t))
            return new t(e,i);
        var m = {
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            autoplay: !1,
            autoplayDisableOnInteraction: !0,
            autoplayStopOnLast: !1,
            iOSEdgeSwipeDetection: !1,
            iOSEdgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: .02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: !0
            },
            flip: {
                slideShadows: !0,
                limitRotation: !0
            },
            cube: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            },
            fade: {
                crossFade: !1
            },
            parallax: !1,
            scrollbar: null,
            scrollbarHide: !0,
            scrollbarDraggable: !1,
            scrollbarSnapOnRelease: !1,
            keyboardControl: !1,
            mousewheelControl: !1,
            mousewheelReleaseOnEdges: !1,
            mousewheelInvert: !1,
            mousewheelForceToAxis: !1,
            mousewheelSensitivity: 1,
            hashnav: !1,
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            centeredSlides: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            onlyExternal: !1,
            threshold: 0,
            touchMoveStopPropagation: !0,
            uniqueNavElements: !0,
            pagination: null,
            paginationElement: "span",
            paginationClickable: !1,
            paginationHide: !1,
            paginationBulletRender: null,
            paginationProgressRender: null,
            paginationFractionRender: null,
            paginationCustomRender: null,
            paginationType: "bullets",
            resistance: !0,
            resistanceRatio: .85,
            nextButton: null,
            prevButton: null,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            lazyLoading: !1,
            lazyLoadingInPrevNext: !1,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            control: void 0,
            controlInverse: !1,
            controlBy: "slide",
            allowSwipeToPrev: !0,
            allowSwipeToNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            slideClass: "swiper-slide",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            buttonDisabledClass: "swiper-button-disabled",
            paginationCurrentClass: "swiper-pagination-current",
            paginationTotalClass: "swiper-pagination-total",
            paginationHiddenClass: "swiper-pagination-hidden",
            paginationProgressbarClass: "swiper-pagination-progressbar",
            observer: !1,
            observeParents: !1,
            a11y: !1,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
            paginationBulletMessage: "Go to slide {{index}}",
            runCallbacksOnInit: !0
        }
          , h = i && i.virtualTranslate;
        i = i || {};
        var f = {};
        for (var g in i)
            if ("object" != typeof i[g] || null === i[g] || (i[g].nodeType || i[g] === window || i[g] === document || "undefined" != typeof r && i[g]instanceof r || "undefined" != typeof jQuery && i[g]instanceof jQuery))
                f[g] = i[g];
            else {
                f[g] = {};
                for (var v in i[g])
                    f[g][v] = i[g][v]
            }
        for (var w in m)
            if ("undefined" == typeof i[w])
                i[w] = m[w];
            else if ("object" == typeof i[w])
                for (var y in m[w])
                    "undefined" == typeof i[w][y] && (i[w][y] = m[w][y]);
        var b = this;
        if (b.params = i,
        b.originalParams = f,
        b.classNames = [],
        "undefined" != typeof a && "undefined" != typeof r && (a = r),
        ("undefined" != typeof a || (a = "undefined" == typeof r ? window.Dom7 || window.Zepto || window.jQuery : r)) && (b.$ = a,
        b.currentBreakpoint = void 0,
        b.getActiveBreakpoint = function() {
            if (!b.params.breakpoints)
                return !1;
            var e, a = !1, t = [];
            for (e in b.params.breakpoints)
                b.params.breakpoints.hasOwnProperty(e) && t.push(e);
            t.sort(function(e, a) {
                return parseInt(e, 10) > parseInt(a, 10)
            });
            for (var r = 0; r < t.length; r++)
                e = t[r],
                e >= window.innerWidth && !a && (a = e);
            return a || "max"
        }
        ,
        b.setBreakpoint = function() {
            var e = b.getActiveBreakpoint();
            if (e && b.currentBreakpoint !== e) {
                var a = e in b.params.breakpoints ? b.params.breakpoints[e] : b.originalParams
                  , t = b.params.loop && a.slidesPerView !== b.params.slidesPerView;
                for (var r in a)
                    b.params[r] = a[r];
                b.currentBreakpoint = e,
                t && b.destroyLoop && b.reLoop(!0)
            }
        }
        ,
        b.params.breakpoints && b.setBreakpoint(),
        b.container = a(e),
        0 !== b.container.length)) {
            if (b.container.length > 1) {
                var x = [];
                return b.container.each(function() {
                    x.push(new t(this,i))
                }),
                x
            }
            b.container[0].swiper = b,
            b.container.data("swiper", b),
            b.classNames.push("swiper-container-" + b.params.direction),
            b.params.freeMode && b.classNames.push("swiper-container-free-mode"),
            b.support.flexbox || (b.classNames.push("swiper-container-no-flexbox"),
            b.params.slidesPerColumn = 1),
            b.params.autoHeight && b.classNames.push("swiper-container-autoheight"),
            (b.params.parallax || b.params.watchSlidesVisibility) && (b.params.watchSlidesProgress = !0),
            ["cube", "coverflow", "flip"].indexOf(b.params.effect) >= 0 && (b.support.transforms3d ? (b.params.watchSlidesProgress = !0,
            b.classNames.push("swiper-container-3d")) : b.params.effect = "slide"),
            "slide" !== b.params.effect && b.classNames.push("swiper-container-" + b.params.effect),
            "cube" === b.params.effect && (b.params.resistanceRatio = 0,
            b.params.slidesPerView = 1,
            b.params.slidesPerColumn = 1,
            b.params.slidesPerGroup = 1,
            b.params.centeredSlides = !1,
            b.params.spaceBetween = 0,
            b.params.virtualTranslate = !0,
            b.params.setWrapperSize = !1),
            ("fade" === b.params.effect || "flip" === b.params.effect) && (b.params.slidesPerView = 1,
            b.params.slidesPerColumn = 1,
            b.params.slidesPerGroup = 1,
            b.params.watchSlidesProgress = !0,
            b.params.spaceBetween = 0,
            b.params.setWrapperSize = !1,
            "undefined" == typeof h && (b.params.virtualTranslate = !0)),
            b.params.grabCursor && b.support.touch && (b.params.grabCursor = !1),
            b.wrapper = b.container.children("." + b.params.wrapperClass),
            b.params.pagination && (b.paginationContainer = a(b.params.pagination),
            b.params.uniqueNavElements && "string" == typeof b.params.pagination && b.paginationContainer.length > 1 && 1 === b.container.find(b.params.pagination).length && (b.paginationContainer = b.container.find(b.params.pagination)),
            "bullets" === b.params.paginationType && b.params.paginationClickable ? b.paginationContainer.addClass("swiper-pagination-clickable") : b.params.paginationClickable = !1,
            b.paginationContainer.addClass("swiper-pagination-" + b.params.paginationType)),
            (b.params.nextButton || b.params.prevButton) && (b.params.nextButton && (b.nextButton = a(b.params.nextButton),
            b.params.uniqueNavElements && "string" == typeof b.params.nextButton && b.nextButton.length > 1 && 1 === b.container.find(b.params.nextButton).length && (b.nextButton = b.container.find(b.params.nextButton))),
            b.params.prevButton && (b.prevButton = a(b.params.prevButton),
            b.params.uniqueNavElements && "string" == typeof b.params.prevButton && b.prevButton.length > 1 && 1 === b.container.find(b.params.prevButton).length && (b.prevButton = b.container.find(b.params.prevButton)))),
            b.isHorizontal = function() {
                return "horizontal" === b.params.direction
            }
            ,
            b.rtl = b.isHorizontal() && ("rtl" === b.container[0].dir.toLowerCase() || "rtl" === b.container.css("direction")),
            b.rtl && b.classNames.push("swiper-container-rtl"),
            b.rtl && (b.wrongRTL = "-webkit-box" === b.wrapper.css("display")),
            b.params.slidesPerColumn > 1 && b.classNames.push("swiper-container-multirow"),
            b.device.android && b.classNames.push("swiper-container-android"),
            b.container.addClass(b.classNames.join(" ")),
            b.translate = 0,
            b.progress = 0,
            b.velocity = 0,
            b.lockSwipeToNext = function() {
                b.params.allowSwipeToNext = !1
            }
            ,
            b.lockSwipeToPrev = function() {
                b.params.allowSwipeToPrev = !1
            }
            ,
            b.lockSwipes = function() {
                b.params.allowSwipeToNext = b.params.allowSwipeToPrev = !1
            }
            ,
            b.unlockSwipeToNext = function() {
                b.params.allowSwipeToNext = !0
            }
            ,
            b.unlockSwipeToPrev = function() {
                b.params.allowSwipeToPrev = !0
            }
            ,
            b.unlockSwipes = function() {
                b.params.allowSwipeToNext = b.params.allowSwipeToPrev = !0
            }
            ,
            b.params.grabCursor && (b.container[0].style.cursor = "move",
            b.container[0].style.cursor = "-webkit-grab",
            b.container[0].style.cursor = "-moz-grab",
            b.container[0].style.cursor = "grab"),
            b.imagesToLoad = [],
            b.imagesLoaded = 0,
            b.loadImage = function(e, a, t, r, i) {
                function s() {
                    i && i()
                }
                var n;
                e.complete && r ? s() : a ? (n = new window.Image,
                n.onload = s,
                n.onerror = s,
                t && (n.srcset = t),
                a && (n.src = a)) : s()
            }
            ,
            b.preloadImages = function() {
                function e() {
                    "undefined" != typeof b && null !== b && (void 0 !== b.imagesLoaded && b.imagesLoaded++,
                    b.imagesLoaded === b.imagesToLoad.length && (b.params.updateOnImagesReady && b.update(),
                    b.emit("onImagesReady", b)))
                }
                b.imagesToLoad = b.container.find("img");
                for (var a = 0; a < b.imagesToLoad.length; a++)
                    b.loadImage(b.imagesToLoad[a], b.imagesToLoad[a].currentSrc || b.imagesToLoad[a].getAttribute("src"), b.imagesToLoad[a].srcset || b.imagesToLoad[a].getAttribute("srcset"), !0, e)
            }
            ,
            b.autoplayTimeoutId = void 0,
            b.autoplaying = !1,
            b.autoplayPaused = !1,
            b.startAutoplay = function() {
                return "undefined" != typeof b.autoplayTimeoutId ? !1 : b.params.autoplay ? b.autoplaying ? !1 : (b.autoplaying = !0,
                b.emit("onAutoplayStart", b),
                void n()) : !1
            }
            ,
            b.stopAutoplay = function(e) {
                b.autoplayTimeoutId && (b.autoplayTimeoutId && clearTimeout(b.autoplayTimeoutId),
                b.autoplaying = !1,
                b.autoplayTimeoutId = void 0,
                b.emit("onAutoplayStop", b))
            }
            ,
            b.pauseAutoplay = function(e) {
                b.autoplayPaused || (b.autoplayTimeoutId && clearTimeout(b.autoplayTimeoutId),
                b.autoplayPaused = !0,
                0 === e ? (b.autoplayPaused = !1,
                n()) : b.wrapper.transitionEnd(function() {
                    b && (b.autoplayPaused = !1,
                    b.autoplaying ? n() : b.stopAutoplay())
                }))
            }
            ,
            b.minTranslate = function() {
                return -b.snapGrid[0]
            }
            ,
            b.maxTranslate = function() {
                return -b.snapGrid[b.snapGrid.length - 1]
            }
            ,
            b.updateAutoHeight = function() {
                var e = b.slides.eq(b.activeIndex)[0];
                if ("undefined" != typeof e) {
                    var a = e.offsetHeight;
                    a && b.wrapper.css("height", a + "px")
                }
            }
            ,
            b.updateContainerSize = function() {
                var e, a;
                e = "undefined" != typeof b.params.width ? b.params.width : b.container[0].clientWidth,
                a = "undefined" != typeof b.params.height ? b.params.height : b.container[0].clientHeight,
                0 === e && b.isHorizontal() || 0 === a && !b.isHorizontal() || (e = e - parseInt(b.container.css("padding-left"), 10) - parseInt(b.container.css("padding-right"), 10),
                a = a - parseInt(b.container.css("padding-top"), 10) - parseInt(b.container.css("padding-bottom"), 10),
                b.width = e,
                b.height = a,
                b.size = b.isHorizontal() ? b.width : b.height)
            }
            ,
            b.updateSlidesSize = function() {
                b.slides = b.wrapper.children("." + b.params.slideClass),
                b.snapGrid = [],
                b.slidesGrid = [],
                b.slidesSizesGrid = [];
                var e, a = b.params.spaceBetween, t = -b.params.slidesOffsetBefore, r = 0, i = 0;
                if ("undefined" != typeof b.size) {
                    "string" == typeof a && a.indexOf("%") >= 0 && (a = parseFloat(a.replace("%", "")) / 100 * b.size),
                    b.virtualSize = -a,
                    b.rtl ? b.slides.css({
                        marginLeft: "",
                        marginTop: ""
                    }) : b.slides.css({
                        marginRight: "",
                        marginBottom: ""
                    });
                    var n;
                    b.params.slidesPerColumn > 1 && (n = Math.floor(b.slides.length / b.params.slidesPerColumn) === b.slides.length / b.params.slidesPerColumn ? b.slides.length : Math.ceil(b.slides.length / b.params.slidesPerColumn) * b.params.slidesPerColumn,
                    "auto" !== b.params.slidesPerView && "row" === b.params.slidesPerColumnFill && (n = Math.max(n, b.params.slidesPerView * b.params.slidesPerColumn)));
                    var o, l = b.params.slidesPerColumn, p = n / l, d = p - (b.params.slidesPerColumn * p - b.slides.length);
                    for (e = 0; e < b.slides.length; e++) {
                        o = 0;
                        var u = b.slides.eq(e);
                        if (b.params.slidesPerColumn > 1) {
                            var c, m, h;
                            "column" === b.params.slidesPerColumnFill ? (m = Math.floor(e / l),
                            h = e - m * l,
                            (m > d || m === d && h === l - 1) && ++h >= l && (h = 0,
                            m++),
                            c = m + h * n / l,
                            u.css({
                                "-webkit-box-ordinal-group": c,
                                "-moz-box-ordinal-group": c,
                                "-ms-flex-order": c,
                                "-webkit-order": c,
                                order: c
                            })) : (h = Math.floor(e / p),
                            m = e - h * p),
                            u.css({
                                "margin-top": 0 !== h && b.params.spaceBetween && b.params.spaceBetween + "px"
                            }).attr("data-swiper-column", m).attr("data-swiper-row", h)
                        }
                        "none" !== u.css("display") && ("auto" === b.params.slidesPerView ? (o = b.isHorizontal() ? u.outerWidth(!0) : u.outerHeight(!0),
                        b.params.roundLengths && (o = s(o))) : (o = (b.size - (b.params.slidesPerView - 1) * a) / b.params.slidesPerView,
                        b.params.roundLengths && (o = s(o)),
                        b.isHorizontal() ? b.slides[e].style.width = o + "px" : b.slides[e].style.height = o + "px"),
                        b.slides[e].swiperSlideSize = o,
                        b.slidesSizesGrid.push(o),
                        b.params.centeredSlides ? (t = t + o / 2 + r / 2 + a,
                        0 === e && (t = t - b.size / 2 - a),
                        Math.abs(t) < .001 && (t = 0),
                        i % b.params.slidesPerGroup === 0 && b.snapGrid.push(t),
                        b.slidesGrid.push(t)) : (i % b.params.slidesPerGroup === 0 && b.snapGrid.push(t),
                        b.slidesGrid.push(t),
                        t = t + o + a),
                        b.virtualSize += o + a,
                        r = o,
                        i++)
                    }
                    b.virtualSize = Math.max(b.virtualSize, b.size) + b.params.slidesOffsetAfter;
                    var f;
                    if (b.rtl && b.wrongRTL && ("slide" === b.params.effect || "coverflow" === b.params.effect) && b.wrapper.css({
                        width: b.virtualSize + b.params.spaceBetween + "px"
                    }),
                    (!b.support.flexbox || b.params.setWrapperSize) && (b.isHorizontal() ? b.wrapper.css({
                        width: b.virtualSize + b.params.spaceBetween + "px"
                    }) : b.wrapper.css({
                        height: b.virtualSize + b.params.spaceBetween + "px"
                    })),
                    b.params.slidesPerColumn > 1 && (b.virtualSize = (o + b.params.spaceBetween) * n,
                    b.virtualSize = Math.ceil(b.virtualSize / b.params.slidesPerColumn) - b.params.spaceBetween,
                    b.wrapper.css({
                        width: b.virtualSize + b.params.spaceBetween + "px"
                    }),
                    b.params.centeredSlides)) {
                        for (f = [],
                        e = 0; e < b.snapGrid.length; e++)
                            b.snapGrid[e] < b.virtualSize + b.snapGrid[0] && f.push(b.snapGrid[e]);
                        b.snapGrid = f
                    }
                    if (!b.params.centeredSlides) {
                        for (f = [],
                        e = 0; e < b.snapGrid.length; e++)
                            b.snapGrid[e] <= b.virtualSize - b.size && f.push(b.snapGrid[e]);
                        b.snapGrid = f,
                        Math.floor(b.virtualSize - b.size) - Math.floor(b.snapGrid[b.snapGrid.length - 1]) > 1 && b.snapGrid.push(b.virtualSize - b.size)
                    }
                    0 === b.snapGrid.length && (b.snapGrid = [0]),
                    0 !== b.params.spaceBetween && (b.isHorizontal() ? b.rtl ? b.slides.css({
                        marginLeft: a + "px"
                    }) : b.slides.css({
                        marginRight: a + "px"
                    }) : b.slides.css({
                        marginBottom: a + "px"
                    })),
                    b.params.watchSlidesProgress && b.updateSlidesOffset()
                }
            }
            ,
            b.updateSlidesOffset = function() {
                for (var e = 0; e < b.slides.length; e++)
                    b.slides[e].swiperSlideOffset = b.isHorizontal() ? b.slides[e].offsetLeft : b.slides[e].offsetTop
            }
            ,
            b.updateSlidesProgress = function(e) {
                if ("undefined" == typeof e && (e = b.translate || 0),
                0 !== b.slides.length) {
                    "undefined" == typeof b.slides[0].swiperSlideOffset && b.updateSlidesOffset();
                    var a = -e;
                    b.rtl && (a = e),
                    b.slides.removeClass(b.params.slideVisibleClass);
                    for (var t = 0; t < b.slides.length; t++) {
                        var r = b.slides[t]
                          , i = (a - r.swiperSlideOffset) / (r.swiperSlideSize + b.params.spaceBetween);
                        if (b.params.watchSlidesVisibility) {
                            var s = -(a - r.swiperSlideOffset)
                              , n = s + b.slidesSizesGrid[t]
                              , o = s >= 0 && s < b.size || n > 0 && n <= b.size || 0 >= s && n >= b.size;
                            o && b.slides.eq(t).addClass(b.params.slideVisibleClass)
                        }
                        r.progress = b.rtl ? -i : i
                    }
                }
            }
            ,
            b.updateProgress = function(e) {
                "undefined" == typeof e && (e = b.translate || 0);
                var a = b.maxTranslate() - b.minTranslate()
                  , t = b.isBeginning
                  , r = b.isEnd;
                0 === a ? (b.progress = 0,
                b.isBeginning = b.isEnd = !0) : (b.progress = (e - b.minTranslate()) / a,
                b.isBeginning = b.progress <= 0,
                b.isEnd = b.progress >= 1),
                b.isBeginning && !t && b.emit("onReachBeginning", b),
                b.isEnd && !r && b.emit("onReachEnd", b),
                b.params.watchSlidesProgress && b.updateSlidesProgress(e),
                b.emit("onProgress", b, b.progress)
            }
            ,
            b.updateActiveIndex = function() {
                var e, a, t, r = b.rtl ? b.translate : -b.translate;
                for (a = 0; a < b.slidesGrid.length; a++)
                    "undefined" != typeof b.slidesGrid[a + 1] ? r >= b.slidesGrid[a] && r < b.slidesGrid[a + 1] - (b.slidesGrid[a + 1] - b.slidesGrid[a]) / 2 ? e = a : r >= b.slidesGrid[a] && r < b.slidesGrid[a + 1] && (e = a + 1) : r >= b.slidesGrid[a] && (e = a);
                (0 > e || "undefined" == typeof e) && (e = 0),
                t = Math.floor(e / b.params.slidesPerGroup),
                t >= b.snapGrid.length && (t = b.snapGrid.length - 1),
                e !== b.activeIndex && (b.snapIndex = t,
                b.previousIndex = b.activeIndex,
                b.activeIndex = e,
                b.updateClasses())
            }
            ,
            b.updateClasses = function() {
                b.slides.removeClass(b.params.slideActiveClass + " " + b.params.slideNextClass + " " + b.params.slidePrevClass);
                var e = b.slides.eq(b.activeIndex);
                e.addClass(b.params.slideActiveClass);
                var t = e.next("." + b.params.slideClass).addClass(b.params.slideNextClass);
                b.params.loop && 0 === t.length && b.slides.eq(0).addClass(b.params.slideNextClass);
                var r = e.prev("." + b.params.slideClass).addClass(b.params.slidePrevClass);
                if (b.params.loop && 0 === r.length && b.slides.eq(-1).addClass(b.params.slidePrevClass),
                b.paginationContainer && b.paginationContainer.length > 0) {
                    var i, s = b.params.loop ? Math.ceil((b.slides.length - 2 * b.loopedSlides) / b.params.slidesPerGroup) : b.snapGrid.length;
                    if (b.params.loop ? (i = Math.ceil((b.activeIndex - b.loopedSlides) / b.params.slidesPerGroup),
                    i > b.slides.length - 1 - 2 * b.loopedSlides && (i -= b.slides.length - 2 * b.loopedSlides),
                    i > s - 1 && (i -= s),
                    0 > i && "bullets" !== b.params.paginationType && (i = s + i)) : i = "undefined" != typeof b.snapIndex ? b.snapIndex : b.activeIndex || 0,
                    "bullets" === b.params.paginationType && b.bullets && b.bullets.length > 0 && (b.bullets.removeClass(b.params.bulletActiveClass),
                    b.paginationContainer.length > 1 ? b.bullets.each(function() {
                        a(this).index() === i && a(this).addClass(b.params.bulletActiveClass)
                    }) : b.bullets.eq(i).addClass(b.params.bulletActiveClass)),
                    "fraction" === b.params.paginationType && (b.paginationContainer.find("." + b.params.paginationCurrentClass).text(i + 1),
                    b.paginationContainer.find("." + b.params.paginationTotalClass).text(s)),
                    "progress" === b.params.paginationType) {
                        var n = (i + 1) / s
                          , o = n
                          , l = 1;
                        b.isHorizontal() || (l = n,
                        o = 1),
                        b.paginationContainer.find("." + b.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + o + ") scaleY(" + l + ")").transition(b.params.speed)
                    }
                    "custom" === b.params.paginationType && b.params.paginationCustomRender && (b.paginationContainer.html(b.params.paginationCustomRender(b, i + 1, s)),
                    b.emit("onPaginationRendered", b, b.paginationContainer[0]))
                }
                b.params.loop || (b.params.prevButton && b.prevButton && b.prevButton.length > 0 && (b.isBeginning ? (b.prevButton.addClass(b.params.buttonDisabledClass),
                b.params.a11y && b.a11y && b.a11y.disable(b.prevButton)) : (b.prevButton.removeClass(b.params.buttonDisabledClass),
                b.params.a11y && b.a11y && b.a11y.enable(b.prevButton))),
                b.params.nextButton && b.nextButton && b.nextButton.length > 0 && (b.isEnd ? (b.nextButton.addClass(b.params.buttonDisabledClass),
                b.params.a11y && b.a11y && b.a11y.disable(b.nextButton)) : (b.nextButton.removeClass(b.params.buttonDisabledClass),
                b.params.a11y && b.a11y && b.a11y.enable(b.nextButton))))
            }
            ,
            b.updatePagination = function() {
                if (b.params.pagination && b.paginationContainer && b.paginationContainer.length > 0) {
                    var e = "";
                    if ("bullets" === b.params.paginationType) {
                        for (var a = b.params.loop ? Math.ceil((b.slides.length - 2 * b.loopedSlides) / b.params.slidesPerGroup) : b.snapGrid.length, t = 0; a > t; t++)
                            e += b.params.paginationBulletRender ? b.params.paginationBulletRender(t, b.params.bulletClass) : "<" + b.params.paginationElement + ' class="' + b.params.bulletClass + '"></' + b.params.paginationElement + ">";
                        b.paginationContainer.html(e),
                        b.bullets = b.paginationContainer.find("." + b.params.bulletClass),
                        b.params.paginationClickable && b.params.a11y && b.a11y && b.a11y.initPagination()
                    }
                    "fraction" === b.params.paginationType && (e = b.params.paginationFractionRender ? b.params.paginationFractionRender(b, b.params.paginationCurrentClass, b.params.paginationTotalClass) : '<span class="' + b.params.paginationCurrentClass + '"></span> / <span class="' + b.params.paginationTotalClass + '"></span>',
                    b.paginationContainer.html(e)),
                    "progress" === b.params.paginationType && (e = b.params.paginationProgressRender ? b.params.paginationProgressRender(b, b.params.paginationProgressbarClass) : '<span class="' + b.params.paginationProgressbarClass + '"></span>',
                    b.paginationContainer.html(e)),
                    "custom" !== b.params.paginationType && b.emit("onPaginationRendered", b, b.paginationContainer[0])
                }
            }
            ,
            b.update = function(e) {
                function a() {
                    r = Math.min(Math.max(b.translate, b.maxTranslate()), b.minTranslate()),
                    b.setWrapperTranslate(r),
                    b.updateActiveIndex(),
                    b.updateClasses()
                }
                if (b.updateContainerSize(),
                b.updateSlidesSize(),
                b.updateProgress(),
                b.updatePagination(),
                b.updateClasses(),
                b.params.scrollbar && b.scrollbar && b.scrollbar.set(),
                e) {
                    var t, r;
                    b.controller && b.controller.spline && (b.controller.spline = void 0),
                    b.params.freeMode ? (a(),
                    b.params.autoHeight && b.updateAutoHeight()) : (t = ("auto" === b.params.slidesPerView || b.params.slidesPerView > 1) && b.isEnd && !b.params.centeredSlides ? b.slideTo(b.slides.length - 1, 0, !1, !0) : b.slideTo(b.activeIndex, 0, !1, !0),
                    t || a())
                } else
                    b.params.autoHeight && b.updateAutoHeight()
            }
            ,
            b.onResize = function(e) {
                b.params.breakpoints && b.setBreakpoint();
                var a = b.params.allowSwipeToPrev
                  , t = b.params.allowSwipeToNext;
                b.params.allowSwipeToPrev = b.params.allowSwipeToNext = !0,
                b.updateContainerSize(),
                b.updateSlidesSize(),
                ("auto" === b.params.slidesPerView || b.params.freeMode || e) && b.updatePagination(),
                b.params.scrollbar && b.scrollbar && b.scrollbar.set(),
                b.controller && b.controller.spline && (b.controller.spline = void 0);
                var r = !1;
                if (b.params.freeMode) {
                    var i = Math.min(Math.max(b.translate, b.maxTranslate()), b.minTranslate());
                    b.setWrapperTranslate(i),
                    b.updateActiveIndex(),
                    b.updateClasses(),
                    b.params.autoHeight && b.updateAutoHeight()
                } else
                    b.updateClasses(),
                    r = ("auto" === b.params.slidesPerView || b.params.slidesPerView > 1) && b.isEnd && !b.params.centeredSlides ? b.slideTo(b.slides.length - 1, 0, !1, !0) : b.slideTo(b.activeIndex, 0, !1, !0);
                b.params.lazyLoading && !r && b.lazy && b.lazy.load(),
                b.params.allowSwipeToPrev = a,
                b.params.allowSwipeToNext = t
            }
            ;
            var T = ["mousedown", "mousemove", "mouseup"];
            window.navigator.pointerEnabled ? T = ["pointerdown", "pointermove", "pointerup"] : window.navigator.msPointerEnabled && (T = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]),
            b.touchEvents = {
                start: b.support.touch || !b.params.simulateTouch ? "touchstart" : T[0],
                move: b.support.touch || !b.params.simulateTouch ? "touchmove" : T[1],
                end: b.support.touch || !b.params.simulateTouch ? "touchend" : T[2]
            },
            (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === b.params.touchEventsTarget ? b.container : b.wrapper).addClass("swiper-wp8-" + b.params.direction),
            b.initEvents = function(e) {
                var a = e ? "off" : "on"
                  , t = e ? "removeEventListener" : "addEventListener"
                  , r = "container" === b.params.touchEventsTarget ? b.container[0] : b.wrapper[0]
                  , s = b.support.touch ? r : document
                  , n = b.params.nested ? !0 : !1;
                b.browser.ie ? (r[t](b.touchEvents.start, b.onTouchStart, !1),
                s[t](b.touchEvents.move, b.onTouchMove, n),
                s[t](b.touchEvents.end, b.onTouchEnd, !1)) : (b.support.touch && (r[t](b.touchEvents.start, b.onTouchStart, !1),
                r[t](b.touchEvents.move, b.onTouchMove, n),
                r[t](b.touchEvents.end, b.onTouchEnd, !1)),
                !i.simulateTouch || b.device.ios || b.device.android || (r[t]("mousedown", b.onTouchStart, !1),
                document[t]("mousemove", b.onTouchMove, n),
                document[t]("mouseup", b.onTouchEnd, !1))),
                window[t]("resize", b.onResize),
                b.params.nextButton && b.nextButton && b.nextButton.length > 0 && (b.nextButton[a]("click", b.onClickNext),
                b.params.a11y && b.a11y && b.nextButton[a]("keydown", b.a11y.onEnterKey)),
                b.params.prevButton && b.prevButton && b.prevButton.length > 0 && (b.prevButton[a]("click", b.onClickPrev),
                b.params.a11y && b.a11y && b.prevButton[a]("keydown", b.a11y.onEnterKey)),
                b.params.pagination && b.params.paginationClickable && (b.paginationContainer[a]("click", "." + b.params.bulletClass, b.onClickIndex),
                b.params.a11y && b.a11y && b.paginationContainer[a]("keydown", "." + b.params.bulletClass, b.a11y.onEnterKey)),
                (b.params.preventClicks || b.params.preventClicksPropagation) && r[t]("click", b.preventClicks, !0)
            }
            ,
            b.attachEvents = function() {
                b.initEvents()
            }
            ,
            b.detachEvents = function() {
                b.initEvents(!0)
            }
            ,
            b.allowClick = !0,
            b.preventClicks = function(e) {
                b.allowClick || (b.params.preventClicks && e.preventDefault(),
                b.params.preventClicksPropagation && b.animating && (e.stopPropagation(),
                e.stopImmediatePropagation()))
            }
            ,
            b.onClickNext = function(e) {
                e.preventDefault(),
                (!b.isEnd || b.params.loop) && b.slideNext()
            }
            ,
            b.onClickPrev = function(e) {
                e.preventDefault(),
                (!b.isBeginning || b.params.loop) && b.slidePrev()
            }
            ,
            b.onClickIndex = function(e) {
                e.preventDefault();
                var t = a(this).index() * b.params.slidesPerGroup;
                b.params.loop && (t += b.loopedSlides),
                b.slideTo(t)
            }
            ,
            b.updateClickedSlide = function(e) {
                var t = o(e, "." + b.params.slideClass)
                  , r = !1;
                if (t)
                    for (var i = 0; i < b.slides.length; i++)
                        b.slides[i] === t && (r = !0);
                if (!t || !r)
                    return b.clickedSlide = void 0,
                    void (b.clickedIndex = void 0);
                if (b.clickedSlide = t,
                b.clickedIndex = a(t).index(),
                b.params.slideToClickedSlide && void 0 !== b.clickedIndex && b.clickedIndex !== b.activeIndex) {
                    var s, n = b.clickedIndex;
                    if (b.params.loop) {
                        if (b.animating)
                            return;
                        s = a(b.clickedSlide).attr("data-swiper-slide-index"),
                        b.params.centeredSlides ? n < b.loopedSlides - b.params.slidesPerView / 2 || n > b.slides.length - b.loopedSlides + b.params.slidesPerView / 2 ? (b.fixLoop(),
                        n = b.wrapper.children("." + b.params.slideClass + '[data-swiper-slide-index="' + s + '"]:not(.swiper-slide-duplicate)').eq(0).index(),
                        setTimeout(function() {
                            b.slideTo(n)
                        }, 0)) : b.slideTo(n) : n > b.slides.length - b.params.slidesPerView ? (b.fixLoop(),
                        n = b.wrapper.children("." + b.params.slideClass + '[data-swiper-slide-index="' + s + '"]:not(.swiper-slide-duplicate)').eq(0).index(),
                        setTimeout(function() {
                            b.slideTo(n)
                        }, 0)) : b.slideTo(n)
                    } else
                        b.slideTo(n)
                }
            }
            ;
            var S, C, z, M, E, P, k, I, L, B, D = "input, select, textarea, button", H = Date.now(), A = [];
            b.animating = !1,
            b.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };
            var G, O;
            if (b.onTouchStart = function(e) {
                if (e.originalEvent && (e = e.originalEvent),
                G = "touchstart" === e.type,
                G || !("which"in e) || 3 !== e.which) {
                    if (b.params.noSwiping && o(e, "." + b.params.noSwipingClass))
                        return void (b.allowClick = !0);
                    if (!b.params.swipeHandler || o(e, b.params.swipeHandler)) {
                        var t = b.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX
                          , r = b.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (!(b.device.ios && b.params.iOSEdgeSwipeDetection && t <= b.params.iOSEdgeSwipeThreshold)) {
                            if (S = !0,
                            C = !1,
                            z = !0,
                            E = void 0,
                            O = void 0,
                            b.touches.startX = t,
                            b.touches.startY = r,
                            M = Date.now(),
                            b.allowClick = !0,
                            b.updateContainerSize(),
                            b.swipeDirection = void 0,
                            b.params.threshold > 0 && (I = !1),
                            "touchstart" !== e.type) {
                                var i = !0;
                                a(e.target).is(D) && (i = !1),
                                document.activeElement && a(document.activeElement).is(D) && document.activeElement.blur(),
                                i && e.preventDefault()
                            }
                            b.emit("onTouchStart", b, e)
                        }
                    }
                }
            }
            ,
            b.onTouchMove = function(e) {
                if (e.originalEvent && (e = e.originalEvent),
                !G || "mousemove" !== e.type) {
                    if (e.preventedByNestedSwiper)
                        return b.touches.startX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        void (b.touches.startY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY);
                    if (b.params.onlyExternal)
                        return b.allowClick = !1,
                        void (S && (b.touches.startX = b.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        b.touches.startY = b.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                        M = Date.now()));
                    if (G && document.activeElement && e.target === document.activeElement && a(e.target).is(D))
                        return C = !0,
                        void (b.allowClick = !1);
                    if (z && b.emit("onTouchMove", b, e),
                    !(e.targetTouches && e.targetTouches.length > 1)) {
                        if (b.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        b.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                        "undefined" == typeof E) {
                            var t = 180 * Math.atan2(Math.abs(b.touches.currentY - b.touches.startY), Math.abs(b.touches.currentX - b.touches.startX)) / Math.PI;
                            E = b.isHorizontal() ? t > b.params.touchAngle : 90 - t > b.params.touchAngle
                        }
                        if (E && b.emit("onTouchMoveOpposite", b, e),
                        "undefined" == typeof O && b.browser.ieTouch && (b.touches.currentX !== b.touches.startX || b.touches.currentY !== b.touches.startY) && (O = !0),
                        S) {
                            if (E)
                                return void (S = !1);
                            if (O || !b.browser.ieTouch) {
                                b.allowClick = !1,
                                b.emit("onSliderMove", b, e),
                                e.preventDefault(),
                                b.params.touchMoveStopPropagation && !b.params.nested && e.stopPropagation(),
                                C || (i.loop && b.fixLoop(),
                                k = b.getWrapperTranslate(),
                                b.setWrapperTransition(0),
                                b.animating && b.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),
                                b.params.autoplay && b.autoplaying && (b.params.autoplayDisableOnInteraction ? b.stopAutoplay() : b.pauseAutoplay()),
                                B = !1,
                                b.params.grabCursor && (b.container[0].style.cursor = "move",
                                b.container[0].style.cursor = "-webkit-grabbing",
                                b.container[0].style.cursor = "-moz-grabbin",
                                b.container[0].style.cursor = "grabbing")),
                                C = !0;
                                var r = b.touches.diff = b.isHorizontal() ? b.touches.currentX - b.touches.startX : b.touches.currentY - b.touches.startY;
                                r *= b.params.touchRatio,
                                b.rtl && (r = -r),
                                b.swipeDirection = r > 0 ? "prev" : "next",
                                P = r + k;
                                var s = !0;
                                if (r > 0 && P > b.minTranslate() ? (s = !1,
                                b.params.resistance && (P = b.minTranslate() - 1 + Math.pow(-b.minTranslate() + k + r, b.params.resistanceRatio))) : 0 > r && P < b.maxTranslate() && (s = !1,
                                b.params.resistance && (P = b.maxTranslate() + 1 - Math.pow(b.maxTranslate() - k - r, b.params.resistanceRatio))),
                                s && (e.preventedByNestedSwiper = !0),
                                !b.params.allowSwipeToNext && "next" === b.swipeDirection && k > P && (P = k),
                                !b.params.allowSwipeToPrev && "prev" === b.swipeDirection && P > k && (P = k),
                                b.params.followFinger) {
                                    if (b.params.threshold > 0) {
                                        if (!(Math.abs(r) > b.params.threshold || I))
                                            return void (P = k);
                                        if (!I)
                                            return I = !0,
                                            b.touches.startX = b.touches.currentX,
                                            b.touches.startY = b.touches.currentY,
                                            P = k,
                                            void (b.touches.diff = b.isHorizontal() ? b.touches.currentX - b.touches.startX : b.touches.currentY - b.touches.startY)
                                    }
                                    (b.params.freeMode || b.params.watchSlidesProgress) && b.updateActiveIndex(),
                                    b.params.freeMode && (0 === A.length && A.push({
                                        position: b.touches[b.isHorizontal() ? "startX" : "startY"],
                                        time: M
                                    }),
                                    A.push({
                                        position: b.touches[b.isHorizontal() ? "currentX" : "currentY"],
                                        time: (new window.Date).getTime()
                                    })),
                                    b.updateProgress(P),
                                    b.setWrapperTranslate(P)
                                }
                            }
                        }
                    }
                }
            }
            ,
            b.onTouchEnd = function(e) {
                if (e.originalEvent && (e = e.originalEvent),
                z && b.emit("onTouchEnd", b, e),
                z = !1,
                S) {
                    b.params.grabCursor && C && S && (b.container[0].style.cursor = "move",
                    b.container[0].style.cursor = "-webkit-grab",
                    b.container[0].style.cursor = "-moz-grab",
                    b.container[0].style.cursor = "grab");
                    var t = Date.now()
                      , r = t - M;
                    if (b.allowClick && (b.updateClickedSlide(e),
                    b.emit("onTap", b, e),
                    300 > r && t - H > 300 && (L && clearTimeout(L),
                    L = setTimeout(function() {
                        b && (b.params.paginationHide && b.paginationContainer.length > 0 && !a(e.target).hasClass(b.params.bulletClass) && b.paginationContainer.toggleClass(b.params.paginationHiddenClass),
                        b.emit("onClick", b, e))
                    }, 300)),
                    300 > r && 300 > t - H && (L && clearTimeout(L),
                    b.emit("onDoubleTap", b, e))),
                    H = Date.now(),
                    setTimeout(function() {
                        b && (b.allowClick = !0)
                    }, 0),
                    !S || !C || !b.swipeDirection || 0 === b.touches.diff || P === k)
                        return void (S = C = !1);
                    S = C = !1;
                    var i;
                    if (i = b.params.followFinger ? b.rtl ? b.translate : -b.translate : -P,
                    b.params.freeMode) {
                        if (i < -b.minTranslate())
                            return void b.slideTo(b.activeIndex);
                        if (i > -b.maxTranslate())
                            return void (b.slides.length < b.snapGrid.length ? b.slideTo(b.snapGrid.length - 1) : b.slideTo(b.slides.length - 1));
                        if (b.params.freeModeMomentum) {
                            if (A.length > 1) {
                                var s = A.pop()
                                  , n = A.pop()
                                  , o = s.position - n.position
                                  , l = s.time - n.time;
                                b.velocity = o / l,
                                b.velocity = b.velocity / 2,
                                Math.abs(b.velocity) < b.params.freeModeMinimumVelocity && (b.velocity = 0),
                                (l > 150 || (new window.Date).getTime() - s.time > 300) && (b.velocity = 0)
                            } else
                                b.velocity = 0;
                            A.length = 0;
                            var p = 1e3 * b.params.freeModeMomentumRatio
                              , d = b.velocity * p
                              , u = b.translate + d;
                            b.rtl && (u = -u);
                            var c, m = !1, h = 20 * Math.abs(b.velocity) * b.params.freeModeMomentumBounceRatio;
                            if (u < b.maxTranslate())
                                b.params.freeModeMomentumBounce ? (u + b.maxTranslate() < -h && (u = b.maxTranslate() - h),
                                c = b.maxTranslate(),
                                m = !0,
                                B = !0) : u = b.maxTranslate();
                            else if (u > b.minTranslate())
                                b.params.freeModeMomentumBounce ? (u - b.minTranslate() > h && (u = b.minTranslate() + h),
                                c = b.minTranslate(),
                                m = !0,
                                B = !0) : u = b.minTranslate();
                            else if (b.params.freeModeSticky) {
                                var f, g = 0;
                                for (g = 0; g < b.snapGrid.length; g += 1)
                                    if (b.snapGrid[g] > -u) {
                                        f = g;
                                        break
                                    }
                                u = Math.abs(b.snapGrid[f] - u) < Math.abs(b.snapGrid[f - 1] - u) || "next" === b.swipeDirection ? b.snapGrid[f] : b.snapGrid[f - 1],
                                b.rtl || (u = -u)
                            }
                            if (0 !== b.velocity)
                                p = b.rtl ? Math.abs((-u - b.translate) / b.velocity) : Math.abs((u - b.translate) / b.velocity);
                            else if (b.params.freeModeSticky)
                                return void b.slideReset();
                            b.params.freeModeMomentumBounce && m ? (b.updateProgress(c),
                            b.setWrapperTransition(p),
                            b.setWrapperTranslate(u),
                            b.onTransitionStart(),
                            b.animating = !0,
                            b.wrapper.transitionEnd(function() {
                                b && B && (b.emit("onMomentumBounce", b),
                                b.setWrapperTransition(b.params.speed),
                                b.setWrapperTranslate(c),
                                b.wrapper.transitionEnd(function() {
                                    b && b.onTransitionEnd()
                                }))
                            })) : b.velocity ? (b.updateProgress(u),
                            b.setWrapperTransition(p),
                            b.setWrapperTranslate(u),
                            b.onTransitionStart(),
                            b.animating || (b.animating = !0,
                            b.wrapper.transitionEnd(function() {
                                b && b.onTransitionEnd()
                            }))) : b.updateProgress(u),
                            b.updateActiveIndex()
                        }
                        return void ((!b.params.freeModeMomentum || r >= b.params.longSwipesMs) && (b.updateProgress(),
                        b.updateActiveIndex()))
                    }
                    var v, w = 0, y = b.slidesSizesGrid[0];
                    for (v = 0; v < b.slidesGrid.length; v += b.params.slidesPerGroup)
                        "undefined" != typeof b.slidesGrid[v + b.params.slidesPerGroup] ? i >= b.slidesGrid[v] && i < b.slidesGrid[v + b.params.slidesPerGroup] && (w = v,
                        y = b.slidesGrid[v + b.params.slidesPerGroup] - b.slidesGrid[v]) : i >= b.slidesGrid[v] && (w = v,
                        y = b.slidesGrid[b.slidesGrid.length - 1] - b.slidesGrid[b.slidesGrid.length - 2]);
                    var x = (i - b.slidesGrid[w]) / y;
                    if (r > b.params.longSwipesMs) {
                        if (!b.params.longSwipes)
                            return void b.slideTo(b.activeIndex);
                        "next" === b.swipeDirection && (x >= b.params.longSwipesRatio ? b.slideTo(w + b.params.slidesPerGroup) : b.slideTo(w)),
                        "prev" === b.swipeDirection && (x > 1 - b.params.longSwipesRatio ? b.slideTo(w + b.params.slidesPerGroup) : b.slideTo(w))
                    } else {
                        if (!b.params.shortSwipes)
                            return void b.slideTo(b.activeIndex);
                        "next" === b.swipeDirection && b.slideTo(w + b.params.slidesPerGroup),
                        "prev" === b.swipeDirection && b.slideTo(w)
                    }
                }
            }
            ,
            b._slideTo = function(e, a) {
                return b.slideTo(e, a, !0, !0)
            }
            ,
            b.slideTo = function(e, a, t, r) {
                "undefined" == typeof t && (t = !0),
                "undefined" == typeof e && (e = 0),
                0 > e && (e = 0),
                b.snapIndex = Math.floor(e / b.params.slidesPerGroup),
                b.snapIndex >= b.snapGrid.length && (b.snapIndex = b.snapGrid.length - 1);
                var i = -b.snapGrid[b.snapIndex];
                b.params.autoplay && b.autoplaying && (r || !b.params.autoplayDisableOnInteraction ? b.pauseAutoplay(a) : b.stopAutoplay()),
                b.updateProgress(i);
                for (var s = 0; s < b.slidesGrid.length; s++)
                    -Math.floor(100 * i) >= Math.floor(100 * b.slidesGrid[s]) && (e = s);
                return !b.params.allowSwipeToNext && i < b.translate && i < b.minTranslate() ? !1 : !b.params.allowSwipeToPrev && i > b.translate && i > b.maxTranslate() && (b.activeIndex || 0) !== e ? !1 : ("undefined" == typeof a && (a = b.params.speed),
                b.previousIndex = b.activeIndex || 0,
                b.activeIndex = e,
                b.rtl && -i === b.translate || !b.rtl && i === b.translate ? (b.params.autoHeight && b.updateAutoHeight(),
                b.updateClasses(),
                "slide" !== b.params.effect && b.setWrapperTranslate(i),
                !1) : (b.updateClasses(),
                b.onTransitionStart(t),
                0 === a ? (b.setWrapperTranslate(i),
                b.setWrapperTransition(0),
                b.onTransitionEnd(t)) : (b.setWrapperTranslate(i),
                b.setWrapperTransition(a),
                b.animating || (b.animating = !0,
                b.wrapper.transitionEnd(function() {
                    b && b.onTransitionEnd(t)
                }))),
                !0))
            }
            ,
            b.onTransitionStart = function(e) {
                "undefined" == typeof e && (e = !0),
                b.params.autoHeight && b.updateAutoHeight(),
                b.lazy && b.lazy.onTransitionStart(),
                e && (b.emit("onTransitionStart", b),
                b.activeIndex !== b.previousIndex && (b.emit("onSlideChangeStart", b),
                b.activeIndex > b.previousIndex ? b.emit("onSlideNextStart", b) : b.emit("onSlidePrevStart", b)))
            }
            ,
            b.onTransitionEnd = function(e) {
                b.animating = !1,
                b.setWrapperTransition(0),
                "undefined" == typeof e && (e = !0),
                b.lazy && b.lazy.onTransitionEnd(),
                e && (b.emit("onTransitionEnd", b),
                b.activeIndex !== b.previousIndex && (b.emit("onSlideChangeEnd", b),
                b.activeIndex > b.previousIndex ? b.emit("onSlideNextEnd", b) : b.emit("onSlidePrevEnd", b))),
                b.params.hashnav && b.hashnav && b.hashnav.setHash()
            }
            ,
            b.slideNext = function(e, a, t) {
                if (b.params.loop) {
                    if (b.animating)
                        return !1;
                    b.fixLoop();
                    b.container[0].clientLeft;
                    return b.slideTo(b.activeIndex + b.params.slidesPerGroup, a, e, t)
                }
                return b.slideTo(b.activeIndex + b.params.slidesPerGroup, a, e, t)
            }
            ,
            b._slideNext = function(e) {
                return b.slideNext(!0, e, !0)
            }
            ,
            b.slidePrev = function(e, a, t) {
                if (b.params.loop) {
                    if (b.animating)
                        return !1;
                    b.fixLoop();
                    b.container[0].clientLeft;
                    return b.slideTo(b.activeIndex - 1, a, e, t)
                }
                return b.slideTo(b.activeIndex - 1, a, e, t)
            }
            ,
            b._slidePrev = function(e) {
                return b.slidePrev(!0, e, !0)
            }
            ,
            b.slideReset = function(e, a, t) {
                return b.slideTo(b.activeIndex, a, e)
            }
            ,
            b.setWrapperTransition = function(e, a) {
                b.wrapper.transition(e),
                "slide" !== b.params.effect && b.effects[b.params.effect] && b.effects[b.params.effect].setTransition(e),
                b.params.parallax && b.parallax && b.parallax.setTransition(e),
                b.params.scrollbar && b.scrollbar && b.scrollbar.setTransition(e),
                b.params.control && b.controller && b.controller.setTransition(e, a),
                b.emit("onSetTransition", b, e)
            }
            ,
            b.setWrapperTranslate = function(e, a, t) {
                var r = 0
                  , i = 0
                  , n = 0;
                b.isHorizontal() ? r = b.rtl ? -e : e : i = e,
                b.params.roundLengths && (r = s(r),
                i = s(i)),
                b.params.virtualTranslate || (b.support.transforms3d ? b.wrapper.transform("translate3d(" + r + "px, " + i + "px, " + n + "px)") : b.wrapper.transform("translate(" + r + "px, " + i + "px)")),
                b.translate = b.isHorizontal() ? r : i;
                var o, l = b.maxTranslate() - b.minTranslate();
                o = 0 === l ? 0 : (e - b.minTranslate()) / l,
                o !== b.progress && b.updateProgress(e),
                a && b.updateActiveIndex(),
                "slide" !== b.params.effect && b.effects[b.params.effect] && b.effects[b.params.effect].setTranslate(b.translate),
                b.params.parallax && b.parallax && b.parallax.setTranslate(b.translate),
                b.params.scrollbar && b.scrollbar && b.scrollbar.setTranslate(b.translate),
                b.params.control && b.controller && b.controller.setTranslate(b.translate, t),
                b.emit("onSetTranslate", b, b.translate)
            }
            ,
            b.getTranslate = function(e, a) {
                var t, r, i, s;
                return "undefined" == typeof a && (a = "x"),
                b.params.virtualTranslate ? b.rtl ? -b.translate : b.translate : (i = window.getComputedStyle(e, null),
                window.WebKitCSSMatrix ? (r = i.transform || i.webkitTransform,
                r.split(",").length > 6 && (r = r.split(", ").map(function(e) {
                    return e.replace(",", ".")
                }).join(", ")),
                s = new window.WebKitCSSMatrix("none" === r ? "" : r)) : (s = i.MozTransform || i.OTransform || i.MsTransform || i.msTransform || i.transform || i.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"),
                t = s.toString().split(",")),
                "x" === a && (r = window.WebKitCSSMatrix ? s.m41 : 16 === t.length ? parseFloat(t[12]) : parseFloat(t[4])),
                "y" === a && (r = window.WebKitCSSMatrix ? s.m42 : 16 === t.length ? parseFloat(t[13]) : parseFloat(t[5])),
                b.rtl && r && (r = -r),
                r || 0)
            }
            ,
            b.getWrapperTranslate = function(e) {
                return "undefined" == typeof e && (e = b.isHorizontal() ? "x" : "y"),
                b.getTranslate(b.wrapper[0], e)
            }
            ,
            b.observers = [],
            b.initObservers = function() {
                if (b.params.observeParents)
                    for (var e = b.container.parents(), a = 0; a < e.length; a++)
                        l(e[a]);
                l(b.container[0], {
                    childList: !1
                }),
                l(b.wrapper[0], {
                    attributes: !1
                })
            }
            ,
            b.disconnectObservers = function() {
                for (var e = 0; e < b.observers.length; e++)
                    b.observers[e].disconnect();
                b.observers = []
            }
            ,
            b.createLoop = function() {
                b.wrapper.children("." + b.params.slideClass + "." + b.params.slideDuplicateClass).remove();
                var e = b.wrapper.children("." + b.params.slideClass);
                "auto" !== b.params.slidesPerView || b.params.loopedSlides || (b.params.loopedSlides = e.length),
                b.loopedSlides = parseInt(b.params.loopedSlides || b.params.slidesPerView, 10),
                b.loopedSlides = b.loopedSlides + b.params.loopAdditionalSlides,
                b.loopedSlides > e.length && (b.loopedSlides = e.length);
                var t, r = [], i = [];
                for (e.each(function(t, s) {
                    var n = a(this);
                    t < b.loopedSlides && i.push(s),
                    t < e.length && t >= e.length - b.loopedSlides && r.push(s),
                    n.attr("data-swiper-slide-index", t)
                }),
                t = 0; t < i.length; t++)
                    b.wrapper.append(a(i[t].cloneNode(!0)).addClass(b.params.slideDuplicateClass));
                for (t = r.length - 1; t >= 0; t--)
                    b.wrapper.prepend(a(r[t].cloneNode(!0)).addClass(b.params.slideDuplicateClass))
            }
            ,
            b.destroyLoop = function() {
                b.wrapper.children("." + b.params.slideClass + "." + b.params.slideDuplicateClass).remove(),
                b.slides.removeAttr("data-swiper-slide-index")
            }
            ,
            b.reLoop = function(e) {
                var a = b.activeIndex - b.loopedSlides;
                b.destroyLoop(),
                b.createLoop(),
                b.updateSlidesSize(),
                e && b.slideTo(a + b.loopedSlides, 0, !1)
            }
            ,
            b.fixLoop = function() {
                var e;
                b.activeIndex < b.loopedSlides ? (e = b.slides.length - 3 * b.loopedSlides + b.activeIndex,
                e += b.loopedSlides,
                b.slideTo(e, 0, !1, !0)) : ("auto" === b.params.slidesPerView && b.activeIndex >= 2 * b.loopedSlides || b.activeIndex > b.slides.length - 2 * b.params.slidesPerView) && (e = -b.slides.length + b.activeIndex + b.loopedSlides,
                e += b.loopedSlides,
                b.slideTo(e, 0, !1, !0))
            }
            ,
            b.appendSlide = function(e) {
                if (b.params.loop && b.destroyLoop(),
                "object" == typeof e && e.length)
                    for (var a = 0; a < e.length; a++)
                        e[a] && b.wrapper.append(e[a]);
                else
                    b.wrapper.append(e);
                b.params.loop && b.createLoop(),
                b.params.observer && b.support.observer || b.update(!0)
            }
            ,
            b.prependSlide = function(e) {
                b.params.loop && b.destroyLoop();
                var a = b.activeIndex + 1;
                if ("object" == typeof e && e.length) {
                    for (var t = 0; t < e.length; t++)
                        e[t] && b.wrapper.prepend(e[t]);
                    a = b.activeIndex + e.length
                } else
                    b.wrapper.prepend(e);
                b.params.loop && b.createLoop(),
                b.params.observer && b.support.observer || b.update(!0),
                b.slideTo(a, 0, !1)
            }
            ,
            b.removeSlide = function(e) {
                b.params.loop && (b.destroyLoop(),
                b.slides = b.wrapper.children("." + b.params.slideClass));
                var a, t = b.activeIndex;
                if ("object" == typeof e && e.length) {
                    for (var r = 0; r < e.length; r++)
                        a = e[r],
                        b.slides[a] && b.slides.eq(a).remove(),
                        t > a && t--;
                    t = Math.max(t, 0)
                } else
                    a = e,
                    b.slides[a] && b.slides.eq(a).remove(),
                    t > a && t--,
                    t = Math.max(t, 0);
                b.params.loop && b.createLoop(),
                b.params.observer && b.support.observer || b.update(!0),
                b.params.loop ? b.slideTo(t + b.loopedSlides, 0, !1) : b.slideTo(t, 0, !1)
            }
            ,
            b.removeAllSlides = function() {
                for (var e = [], a = 0; a < b.slides.length; a++)
                    e.push(a);
                b.removeSlide(e)
            }
            ,
            b.effects = {
                fade: {
                    setTranslate: function() {
                        for (var e = 0; e < b.slides.length; e++) {
                            var a = b.slides.eq(e)
                              , t = a[0].swiperSlideOffset
                              , r = -t;
                            b.params.virtualTranslate || (r -= b.translate);
                            var i = 0;
                            b.isHorizontal() || (i = r,
                            r = 0);
                            var s = b.params.fade.crossFade ? Math.max(1 - Math.abs(a[0].progress), 0) : 1 + Math.min(Math.max(a[0].progress, -1), 0);
                            a.css({
                                opacity: s
                            }).transform("translate3d(" + r + "px, " + i + "px, 0px)")
                        }
                    },
                    setTransition: function(e) {
                        if (b.slides.transition(e),
                        b.params.virtualTranslate && 0 !== e) {
                            var a = !1;
                            b.slides.transitionEnd(function() {
                                if (!a && b) {
                                    a = !0,
                                    b.animating = !1;
                                    for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], t = 0; t < e.length; t++)
                                        b.wrapper.trigger(e[t])
                                }
                            })
                        }
                    }
                },
                flip: {
                    setTranslate: function() {
                        for (var e = 0; e < b.slides.length; e++) {
                            var t = b.slides.eq(e)
                              , r = t[0].progress;
                            b.params.flip.limitRotation && (r = Math.max(Math.min(t[0].progress, 1), -1));
                            var i = t[0].swiperSlideOffset
                              , s = -180 * r
                              , n = s
                              , o = 0
                              , l = -i
                              , p = 0;
                            if (b.isHorizontal() ? b.rtl && (n = -n) : (p = l,
                            l = 0,
                            o = -n,
                            n = 0),
                            t[0].style.zIndex = -Math.abs(Math.round(r)) + b.slides.length,
                            b.params.flip.slideShadows) {
                                var d = b.isHorizontal() ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top")
                                  , u = b.isHorizontal() ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
                                0 === d.length && (d = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "left" : "top") + '"></div>'),
                                t.append(d)),
                                0 === u.length && (u = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "right" : "bottom") + '"></div>'),
                                t.append(u)),
                                d.length && (d[0].style.opacity = Math.max(-r, 0)),
                                u.length && (u[0].style.opacity = Math.max(r, 0))
                            }
                            t.transform("translate3d(" + l + "px, " + p + "px, 0px) rotateX(" + o + "deg) rotateY(" + n + "deg)")
                        }
                    },
                    setTransition: function(e) {
                        if (b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                        b.params.virtualTranslate && 0 !== e) {
                            var t = !1;
                            b.slides.eq(b.activeIndex).transitionEnd(function() {
                                if (!t && b && a(this).hasClass(b.params.slideActiveClass)) {
                                    t = !0,
                                    b.animating = !1;
                                    for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], r = 0; r < e.length; r++)
                                        b.wrapper.trigger(e[r])
                                }
                            })
                        }
                    }
                },
                cube: {
                    setTranslate: function() {
                        var e, t = 0;
                        b.params.cube.shadow && (b.isHorizontal() ? (e = b.wrapper.find(".swiper-cube-shadow"),
                        0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'),
                        b.wrapper.append(e)),
                        e.css({
                            height: b.width + "px"
                        })) : (e = b.container.find(".swiper-cube-shadow"),
                        0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'),
                        b.container.append(e))));
                        for (var r = 0; r < b.slides.length; r++) {
                            var i = b.slides.eq(r)
                              , s = 90 * r
                              , n = Math.floor(s / 360);
                            b.rtl && (s = -s,
                            n = Math.floor(-s / 360));
                            var o = Math.max(Math.min(i[0].progress, 1), -1)
                              , l = 0
                              , p = 0
                              , d = 0;
                            r % 4 === 0 ? (l = 4 * -n * b.size,
                            d = 0) : (r - 1) % 4 === 0 ? (l = 0,
                            d = 4 * -n * b.size) : (r - 2) % 4 === 0 ? (l = b.size + 4 * n * b.size,
                            d = b.size) : (r - 3) % 4 === 0 && (l = -b.size,
                            d = 3 * b.size + 4 * b.size * n),
                            b.rtl && (l = -l),
                            b.isHorizontal() || (p = l,
                            l = 0);
                            var u = "rotateX(" + (b.isHorizontal() ? 0 : -s) + "deg) rotateY(" + (b.isHorizontal() ? s : 0) + "deg) translate3d(" + l + "px, " + p + "px, " + d + "px)";
                            if (1 >= o && o > -1 && (t = 90 * r + 90 * o,
                            b.rtl && (t = 90 * -r - 90 * o)),
                            i.transform(u),
                            b.params.cube.slideShadows) {
                                var c = b.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top")
                                  , m = b.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");
                                0 === c.length && (c = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "left" : "top") + '"></div>'),
                                i.append(c)),
                                0 === m.length && (m = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "right" : "bottom") + '"></div>'),
                                i.append(m)),
                                c.length && (c[0].style.opacity = Math.max(-o, 0)),
                                m.length && (m[0].style.opacity = Math.max(o, 0))
                            }
                        }
                        if (b.wrapper.css({
                            "-webkit-transform-origin": "50% 50% -" + b.size / 2 + "px",
                            "-moz-transform-origin": "50% 50% -" + b.size / 2 + "px",
                            "-ms-transform-origin": "50% 50% -" + b.size / 2 + "px",
                            "transform-origin": "50% 50% -" + b.size / 2 + "px"
                        }),
                        b.params.cube.shadow)
                            if (b.isHorizontal())
                                e.transform("translate3d(0px, " + (b.width / 2 + b.params.cube.shadowOffset) + "px, " + -b.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + b.params.cube.shadowScale + ")");
                            else {
                                var h = Math.abs(t) - 90 * Math.floor(Math.abs(t) / 90)
                                  , f = 1.5 - (Math.sin(2 * h * Math.PI / 360) / 2 + Math.cos(2 * h * Math.PI / 360) / 2)
                                  , g = b.params.cube.shadowScale
                                  , v = b.params.cube.shadowScale / f
                                  , w = b.params.cube.shadowOffset;
                                e.transform("scale3d(" + g + ", 1, " + v + ") translate3d(0px, " + (b.height / 2 + w) + "px, " + -b.height / 2 / v + "px) rotateX(-90deg)")
                            }
                        var y = b.isSafari || b.isUiWebView ? -b.size / 2 : 0;
                        b.wrapper.transform("translate3d(0px,0," + y + "px) rotateX(" + (b.isHorizontal() ? 0 : t) + "deg) rotateY(" + (b.isHorizontal() ? -t : 0) + "deg)")
                    },
                    setTransition: function(e) {
                        b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                        b.params.cube.shadow && !b.isHorizontal() && b.container.find(".swiper-cube-shadow").transition(e)
                    }
                },
                coverflow: {
                    setTranslate: function() {
                        for (var e = b.translate, t = b.isHorizontal() ? -e + b.width / 2 : -e + b.height / 2, r = b.isHorizontal() ? b.params.coverflow.rotate : -b.params.coverflow.rotate, i = b.params.coverflow.depth, s = 0, n = b.slides.length; n > s; s++) {
                            var o = b.slides.eq(s)
                              , l = b.slidesSizesGrid[s]
                              , p = o[0].swiperSlideOffset
                              , d = (t - p - l / 2) / l * b.params.coverflow.modifier
                              , u = b.isHorizontal() ? r * d : 0
                              , c = b.isHorizontal() ? 0 : r * d
                              , m = -i * Math.abs(d)
                              , h = b.isHorizontal() ? 0 : b.params.coverflow.stretch * d
                              , f = b.isHorizontal() ? b.params.coverflow.stretch * d : 0;
                            Math.abs(f) < .001 && (f = 0),
                            Math.abs(h) < .001 && (h = 0),
                            Math.abs(m) < .001 && (m = 0),
                            Math.abs(u) < .001 && (u = 0),
                            Math.abs(c) < .001 && (c = 0);
                            var g = "translate3d(" + f + "px," + h + "px," + m + "px)  rotateX(" + c + "deg) rotateY(" + u + "deg)";
                            if (o.transform(g),
                            o[0].style.zIndex = -Math.abs(Math.round(d)) + 1,
                            b.params.coverflow.slideShadows) {
                                var v = b.isHorizontal() ? o.find(".swiper-slide-shadow-left") : o.find(".swiper-slide-shadow-top")
                                  , w = b.isHorizontal() ? o.find(".swiper-slide-shadow-right") : o.find(".swiper-slide-shadow-bottom");
                                0 === v.length && (v = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "left" : "top") + '"></div>'),
                                o.append(v)),
                                0 === w.length && (w = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "right" : "bottom") + '"></div>'),
                                o.append(w)),
                                v.length && (v[0].style.opacity = d > 0 ? d : 0),
                                w.length && (w[0].style.opacity = -d > 0 ? -d : 0)
                            }
                        }
                        if (b.browser.ie) {
                            var y = b.wrapper[0].style;
                            y.perspectiveOrigin = t + "px 50%"
                        }
                    },
                    setTransition: function(e) {
                        b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
                    }
                }
            },
            b.lazy = {
                initialImageLoaded: !1,
                loadImageInSlide: function(e, t) {
                    if ("undefined" != typeof e && ("undefined" == typeof t && (t = !0),
                    0 !== b.slides.length)) {
                        var r = b.slides.eq(e)
                          , i = r.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");
                        !r.hasClass("swiper-lazy") || r.hasClass("swiper-lazy-loaded") || r.hasClass("swiper-lazy-loading") || (i = i.add(r[0])),
                        0 !== i.length && i.each(function() {
                            var e = a(this);
                            e.addClass("swiper-lazy-loading");
                            var i = e.attr("data-background")
                              , s = e.attr("data-src")
                              , n = e.attr("data-srcset");
                            b.loadImage(e[0], s || i, n, !1, function() {
                                if (i ? (e.css("background-image", 'url("' + i + '")'),
                                e.removeAttr("data-background")) : (n && (e.attr("srcset", n),
                                e.removeAttr("data-srcset")),
                                s && (e.attr("src", s),
                                e.removeAttr("data-src"))),
                                e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),
                                r.find(".swiper-lazy-preloader, .preloader").remove(),
                                b.params.loop && t) {
                                    var a = r.attr("data-swiper-slide-index");
                                    if (r.hasClass(b.params.slideDuplicateClass)) {
                                        var o = b.wrapper.children('[data-swiper-slide-index="' + a + '"]:not(.' + b.params.slideDuplicateClass + ")");
                                        b.lazy.loadImageInSlide(o.index(), !1)
                                    } else {
                                        var l = b.wrapper.children("." + b.params.slideDuplicateClass + '[data-swiper-slide-index="' + a + '"]');
                                        b.lazy.loadImageInSlide(l.index(), !1)
                                    }
                                }
                                b.emit("onLazyImageReady", b, r[0], e[0])
                            }),
                            b.emit("onLazyImageLoad", b, r[0], e[0])
                        })
                    }
                },
                load: function() {
                    var e;
                    if (b.params.watchSlidesVisibility)
                        b.wrapper.children("." + b.params.slideVisibleClass).each(function() {
                            b.lazy.loadImageInSlide(a(this).index())
                        });
                    else if (b.params.slidesPerView > 1)
                        for (e = b.activeIndex; e < b.activeIndex + b.params.slidesPerView; e++)
                            b.slides[e] && b.lazy.loadImageInSlide(e);
                    else
                        b.lazy.loadImageInSlide(b.activeIndex);
                    if (b.params.lazyLoadingInPrevNext)
                        if (b.params.slidesPerView > 1 || b.params.lazyLoadingInPrevNextAmount && b.params.lazyLoadingInPrevNextAmount > 1) {
                            var t = b.params.lazyLoadingInPrevNextAmount
                              , r = b.params.slidesPerView
                              , i = Math.min(b.activeIndex + r + Math.max(t, r), b.slides.length)
                              , s = Math.max(b.activeIndex - Math.max(r, t), 0);
                            for (e = b.activeIndex + b.params.slidesPerView; i > e; e++)
                                b.slides[e] && b.lazy.loadImageInSlide(e);
                            for (e = s; e < b.activeIndex; e++)
                                b.slides[e] && b.lazy.loadImageInSlide(e)
                        } else {
                            var n = b.wrapper.children("." + b.params.slideNextClass);
                            n.length > 0 && b.lazy.loadImageInSlide(n.index());
                            var o = b.wrapper.children("." + b.params.slidePrevClass);
                            o.length > 0 && b.lazy.loadImageInSlide(o.index())
                        }
                },
                onTransitionStart: function() {
                    b.params.lazyLoading && (b.params.lazyLoadingOnTransitionStart || !b.params.lazyLoadingOnTransitionStart && !b.lazy.initialImageLoaded) && b.lazy.load()
                },
                onTransitionEnd: function() {
                    b.params.lazyLoading && !b.params.lazyLoadingOnTransitionStart && b.lazy.load()
                }
            },
            b.scrollbar = {
                isTouched: !1,
                setDragPosition: function(e) {
                    var a = b.scrollbar
                      , t = b.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY
                      , r = t - a.track.offset()[b.isHorizontal() ? "left" : "top"] - a.dragSize / 2
                      , i = -b.minTranslate() * a.moveDivider
                      , s = -b.maxTranslate() * a.moveDivider;
                    i > r ? r = i : r > s && (r = s),
                    r = -r / a.moveDivider,
                    b.updateProgress(r),
                    b.setWrapperTranslate(r, !0)
                },
                dragStart: function(e) {
                    var a = b.scrollbar;
                    a.isTouched = !0,
                    e.preventDefault(),
                    e.stopPropagation(),
                    a.setDragPosition(e),
                    clearTimeout(a.dragTimeout),
                    a.track.transition(0),
                    b.params.scrollbarHide && a.track.css("opacity", 1),
                    b.wrapper.transition(100),
                    a.drag.transition(100),
                    b.emit("onScrollbarDragStart", b)
                },
                dragMove: function(e) {
                    var a = b.scrollbar;
                    a.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1,
                    a.setDragPosition(e),
                    b.wrapper.transition(0),
                    a.track.transition(0),
                    a.drag.transition(0),
                    b.emit("onScrollbarDragMove", b))
                },
                dragEnd: function(e) {
                    var a = b.scrollbar;
                    a.isTouched && (a.isTouched = !1,
                    b.params.scrollbarHide && (clearTimeout(a.dragTimeout),
                    a.dragTimeout = setTimeout(function() {
                        a.track.css("opacity", 0),
                        a.track.transition(400)
                    }, 1e3)),
                    b.emit("onScrollbarDragEnd", b),
                    b.params.scrollbarSnapOnRelease && b.slideReset())
                },
                enableDraggable: function() {
                    var e = b.scrollbar
                      , t = b.support.touch ? e.track : document;
                    a(e.track).on(b.touchEvents.start, e.dragStart),
                    a(t).on(b.touchEvents.move, e.dragMove),
                    a(t).on(b.touchEvents.end, e.dragEnd)
                },
                disableDraggable: function() {
                    var e = b.scrollbar
                      , t = b.support.touch ? e.track : document;
                    a(e.track).off(b.touchEvents.start, e.dragStart),
                    a(t).off(b.touchEvents.move, e.dragMove),
                    a(t).off(b.touchEvents.end, e.dragEnd)
                },
                set: function() {
                    if (b.params.scrollbar) {
                        var e = b.scrollbar;
                        e.track = a(b.params.scrollbar),
                        b.params.uniqueNavElements && "string" == typeof b.params.scrollbar && e.track.length > 1 && 1 === b.container.find(b.params.scrollbar).length && (e.track = b.container.find(b.params.scrollbar)),
                        e.drag = e.track.find(".swiper-scrollbar-drag"),
                        0 === e.drag.length && (e.drag = a('<div class="swiper-scrollbar-drag"></div>'),
                        e.track.append(e.drag)),
                        e.drag[0].style.width = "",
                        e.drag[0].style.height = "",
                        e.trackSize = b.isHorizontal() ? e.track[0].offsetWidth : e.track[0].offsetHeight,
                        e.divider = b.size / b.virtualSize,
                        e.moveDivider = e.divider * (e.trackSize / b.size),
                        e.dragSize = e.trackSize * e.divider,
                        b.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px" : e.drag[0].style.height = e.dragSize + "px",
                        e.divider >= 1 ? e.track[0].style.display = "none" : e.track[0].style.display = "",
                        b.params.scrollbarHide && (e.track[0].style.opacity = 0)
                    }
                },
                setTranslate: function() {
                    if (b.params.scrollbar) {
                        var e, a = b.scrollbar, t = (b.translate || 0,
                        a.dragSize);
                        e = (a.trackSize - a.dragSize) * b.progress,
                        b.rtl && b.isHorizontal() ? (e = -e,
                        e > 0 ? (t = a.dragSize - e,
                        e = 0) : -e + a.dragSize > a.trackSize && (t = a.trackSize + e)) : 0 > e ? (t = a.dragSize + e,
                        e = 0) : e + a.dragSize > a.trackSize && (t = a.trackSize - e),
                        b.isHorizontal() ? (b.support.transforms3d ? a.drag.transform("translate3d(" + e + "px, 0, 0)") : a.drag.transform("translateX(" + e + "px)"),
                        a.drag[0].style.width = t + "px") : (b.support.transforms3d ? a.drag.transform("translate3d(0px, " + e + "px, 0)") : a.drag.transform("translateY(" + e + "px)"),
                        a.drag[0].style.height = t + "px"),
                        b.params.scrollbarHide && (clearTimeout(a.timeout),
                        a.track[0].style.opacity = 1,
                        a.timeout = setTimeout(function() {
                            a.track[0].style.opacity = 0,
                            a.track.transition(400)
                        }, 1e3))
                    }
                },
                setTransition: function(e) {
                    b.params.scrollbar && b.scrollbar.drag.transition(e)
                }
            },
            b.controller = {
                LinearSpline: function(e, a) {
                    this.x = e,
                    this.y = a,
                    this.lastIndex = e.length - 1;
                    var t, r;
                    this.x.length;
                    this.interpolate = function(e) {
                        return e ? (r = i(this.x, e),
                        t = r - 1,
                        (e - this.x[t]) * (this.y[r] - this.y[t]) / (this.x[r] - this.x[t]) + this.y[t]) : 0
                    }
                    ;
                    var i = function() {
                        var e, a, t;
                        return function(r, i) {
                            for (a = -1,
                            e = r.length; e - a > 1; )
                                r[t = e + a >> 1] <= i ? a = t : e = t;
                            return e
                        }
                    }()
                },
                getInterpolateFunction: function(e) {
                    b.controller.spline || (b.controller.spline = b.params.loop ? new b.controller.LinearSpline(b.slidesGrid,e.slidesGrid) : new b.controller.LinearSpline(b.snapGrid,e.snapGrid))
                },
                setTranslate: function(e, a) {
                    function r(a) {
                        e = a.rtl && "horizontal" === a.params.direction ? -b.translate : b.translate,
                        "slide" === b.params.controlBy && (b.controller.getInterpolateFunction(a),
                        s = -b.controller.spline.interpolate(-e)),
                        s && "container" !== b.params.controlBy || (i = (a.maxTranslate() - a.minTranslate()) / (b.maxTranslate() - b.minTranslate()),
                        s = (e - b.minTranslate()) * i + a.minTranslate()),
                        b.params.controlInverse && (s = a.maxTranslate() - s),
                        a.updateProgress(s),
                        a.setWrapperTranslate(s, !1, b),
                        a.updateActiveIndex()
                    }
                    var i, s, n = b.params.control;
                    if (b.isArray(n))
                        for (var o = 0; o < n.length; o++)
                            n[o] !== a && n[o]instanceof t && r(n[o]);
                    else
                        n instanceof t && a !== n && r(n)
                },
                setTransition: function(e, a) {
                    function r(a) {
                        a.setWrapperTransition(e, b),
                        0 !== e && (a.onTransitionStart(),
                        a.wrapper.transitionEnd(function() {
                            s && (a.params.loop && "slide" === b.params.controlBy && a.fixLoop(),
                            a.onTransitionEnd())
                        }))
                    }
                    var i, s = b.params.control;
                    if (b.isArray(s))
                        for (i = 0; i < s.length; i++)
                            s[i] !== a && s[i]instanceof t && r(s[i]);
                    else
                        s instanceof t && a !== s && r(s)
                }
            },
            b.hashnav = {
                init: function() {
                    if (b.params.hashnav) {
                        b.hashnav.initialized = !0;
                        var e = document.location.hash.replace("#", "");
                        if (e)
                            for (var a = 0, t = 0, r = b.slides.length; r > t; t++) {
                                var i = b.slides.eq(t)
                                  , s = i.attr("data-hash");
                                if (s === e && !i.hasClass(b.params.slideDuplicateClass)) {
                                    var n = i.index();
                                    b.slideTo(n, a, b.params.runCallbacksOnInit, !0)
                                }
                            }
                    }
                },
                setHash: function() {
                    b.hashnav.initialized && b.params.hashnav && (document.location.hash = b.slides.eq(b.activeIndex).attr("data-hash") || "")
                }
            },
            b.disableKeyboardControl = function() {
                b.params.keyboardControl = !1,
                a(document).off("keydown", p)
            }
            ,
            b.enableKeyboardControl = function() {
                b.params.keyboardControl = !0,
                a(document).on("keydown", p)
            }
            ,
            b.mousewheel = {
                event: !1,
                lastScrollTime: (new window.Date).getTime()
            },
            b.params.mousewheelControl) {
                try {
                    new window.WheelEvent("wheel"),
                    b.mousewheel.event = "wheel"
                } catch (N) {
                    (window.WheelEvent || b.container[0] && "wheel"in b.container[0]) && (b.mousewheel.event = "wheel")
                }
                !b.mousewheel.event && window.WheelEvent,
                b.mousewheel.event || void 0 === document.onmousewheel || (b.mousewheel.event = "mousewheel"),
                b.mousewheel.event || (b.mousewheel.event = "DOMMouseScroll")
            }
            b.disableMousewheelControl = function() {
                return b.mousewheel.event ? (b.container.off(b.mousewheel.event, d),
                !0) : !1
            }
            ,
            b.enableMousewheelControl = function() {
                return b.mousewheel.event ? (b.container.on(b.mousewheel.event, d),
                !0) : !1
            }
            ,
            b.parallax = {
                setTranslate: function() {
                    b.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        u(this, b.progress)
                    }),
                    b.slides.each(function() {
                        var e = a(this);
                        e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            var a = Math.min(Math.max(e[0].progress, -1), 1);
                            u(this, a)
                        })
                    })
                },
                setTransition: function(e) {
                    "undefined" == typeof e && (e = b.params.speed),
                    b.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        var t = a(this)
                          , r = parseInt(t.attr("data-swiper-parallax-duration"), 10) || e;
                        0 === e && (r = 0),
                        t.transition(r)
                    })
                }
            },
            b._plugins = [];
            for (var R in b.plugins) {
                var W = b.plugins[R](b, b.params[R]);
                W && b._plugins.push(W)
            }
            return b.callPlugins = function(e) {
                for (var a = 0; a < b._plugins.length; a++)
                    e in b._plugins[a] && b._plugins[a][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            }
            ,
            b.emitterEventListeners = {},
            b.emit = function(e) {
                b.params[e] && b.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                var a;
                if (b.emitterEventListeners[e])
                    for (a = 0; a < b.emitterEventListeners[e].length; a++)
                        b.emitterEventListeners[e][a](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                b.callPlugins && b.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            }
            ,
            b.on = function(e, a) {
                return e = c(e),
                b.emitterEventListeners[e] || (b.emitterEventListeners[e] = []),
                b.emitterEventListeners[e].push(a),
                b
            }
            ,
            b.off = function(e, a) {
                var t;
                if (e = c(e),
                "undefined" == typeof a)
                    return b.emitterEventListeners[e] = [],
                    b;
                if (b.emitterEventListeners[e] && 0 !== b.emitterEventListeners[e].length) {
                    for (t = 0; t < b.emitterEventListeners[e].length; t++)
                        b.emitterEventListeners[e][t] === a && b.emitterEventListeners[e].splice(t, 1);
                    return b
                }
            }
            ,
            b.once = function(e, a) {
                e = c(e);
                var t = function() {
                    a(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]),
                    b.off(e, t)
                };
                return b.on(e, t),
                b
            }
            ,
            b.a11y = {
                makeFocusable: function(e) {
                    return e.attr("tabIndex", "0"),
                    e
                },
                addRole: function(e, a) {
                    return e.attr("role", a),
                    e
                },
                addLabel: function(e, a) {
                    return e.attr("aria-label", a),
                    e
                },
                disable: function(e) {
                    return e.attr("aria-disabled", !0),
                    e
                },
                enable: function(e) {
                    return e.attr("aria-disabled", !1),
                    e
                },
                onEnterKey: function(e) {
                    13 === e.keyCode && (a(e.target).is(b.params.nextButton) ? (b.onClickNext(e),
                    b.isEnd ? b.a11y.notify(b.params.lastSlideMessage) : b.a11y.notify(b.params.nextSlideMessage)) : a(e.target).is(b.params.prevButton) && (b.onClickPrev(e),
                    b.isBeginning ? b.a11y.notify(b.params.firstSlideMessage) : b.a11y.notify(b.params.prevSlideMessage)),
                    a(e.target).is("." + b.params.bulletClass) && a(e.target)[0].click())
                },
                liveRegion: a('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                notify: function(e) {
                    var a = b.a11y.liveRegion;
                    0 !== a.length && (a.html(""),
                    a.html(e))
                },
                init: function() {
                    b.params.nextButton && b.nextButton && b.nextButton.length > 0 && (b.a11y.makeFocusable(b.nextButton),
                    b.a11y.addRole(b.nextButton, "button"),
                    b.a11y.addLabel(b.nextButton, b.params.nextSlideMessage)),
                    b.params.prevButton && b.prevButton && b.prevButton.length > 0 && (b.a11y.makeFocusable(b.prevButton),
                    b.a11y.addRole(b.prevButton, "button"),
                    b.a11y.addLabel(b.prevButton, b.params.prevSlideMessage)),
                    a(b.container).append(b.a11y.liveRegion)
                },
                initPagination: function() {
                    b.params.pagination && b.params.paginationClickable && b.bullets && b.bullets.length && b.bullets.each(function() {
                        var e = a(this);
                        b.a11y.makeFocusable(e),
                        b.a11y.addRole(e, "button"),
                        b.a11y.addLabel(e, b.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1))
                    })
                },
                destroy: function() {
                    b.a11y.liveRegion && b.a11y.liveRegion.length > 0 && b.a11y.liveRegion.remove()
                }
            },
            b.init = function() {
                b.params.loop && b.createLoop(),
                b.updateContainerSize(),
                b.updateSlidesSize(),
                b.updatePagination(),
                b.params.scrollbar && b.scrollbar && (b.scrollbar.set(),
                b.params.scrollbarDraggable && b.scrollbar.enableDraggable()),
                "slide" !== b.params.effect && b.effects[b.params.effect] && (b.params.loop || b.updateProgress(),
                b.effects[b.params.effect].setTranslate()),
                b.params.loop ? b.slideTo(b.params.initialSlide + b.loopedSlides, 0, b.params.runCallbacksOnInit) : (b.slideTo(b.params.initialSlide, 0, b.params.runCallbacksOnInit),
                0 === b.params.initialSlide && (b.parallax && b.params.parallax && b.parallax.setTranslate(),
                b.lazy && b.params.lazyLoading && (b.lazy.load(),
                b.lazy.initialImageLoaded = !0))),
                b.attachEvents(),
                b.params.observer && b.support.observer && b.initObservers(),
                b.params.preloadImages && !b.params.lazyLoading && b.preloadImages(),
                b.params.autoplay && b.startAutoplay(),
                b.params.keyboardControl && b.enableKeyboardControl && b.enableKeyboardControl(),
                b.params.mousewheelControl && b.enableMousewheelControl && b.enableMousewheelControl(),
                b.params.hashnav && b.hashnav && b.hashnav.init(),
                b.params.a11y && b.a11y && b.a11y.init(),
                b.emit("onInit", b)
            }
            ,
            b.cleanupStyles = function() {
                b.container.removeClass(b.classNames.join(" ")).removeAttr("style"),
                b.wrapper.removeAttr("style"),
                b.slides && b.slides.length && b.slides.removeClass([b.params.slideVisibleClass, b.params.slideActiveClass, b.params.slideNextClass, b.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),
                b.paginationContainer && b.paginationContainer.length && b.paginationContainer.removeClass(b.params.paginationHiddenClass),
                b.bullets && b.bullets.length && b.bullets.removeClass(b.params.bulletActiveClass),
                b.params.prevButton && a(b.params.prevButton).removeClass(b.params.buttonDisabledClass),
                b.params.nextButton && a(b.params.nextButton).removeClass(b.params.buttonDisabledClass),
                b.params.scrollbar && b.scrollbar && (b.scrollbar.track && b.scrollbar.track.length && b.scrollbar.track.removeAttr("style"),
                b.scrollbar.drag && b.scrollbar.drag.length && b.scrollbar.drag.removeAttr("style"))
            }
            ,
            b.destroy = function(e, a) {
                b.detachEvents(),
                b.stopAutoplay(),
                b.params.scrollbar && b.scrollbar && b.params.scrollbarDraggable && b.scrollbar.disableDraggable(),
                b.params.loop && b.destroyLoop(),
                a && b.cleanupStyles(),
                b.disconnectObservers(),
                b.params.keyboardControl && b.disableKeyboardControl && b.disableKeyboardControl(),
                b.params.mousewheelControl && b.disableMousewheelControl && b.disableMousewheelControl(),
                b.params.a11y && b.a11y && b.a11y.destroy(),
                b.emit("onDestroy"),
                e !== !1 && (b = null)
            }
            ,
            b.init(),
            b
        }
    };
    t.prototype = {
        isSafari: function() {
            var e = navigator.userAgent.toLowerCase();
            return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
        }(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function(e) {
            return "[object Array]" === Object.prototype.toString.apply(e)
        },
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
        },
        device: function() {
            var e = navigator.userAgent
              , a = e.match(/(Android);?[\s\/]+([\d.]+)?/)
              , t = e.match(/(iPad).*OS\s([\d_]+)/)
              , r = e.match(/(iPod)(.*OS\s([\d_]+))?/)
              , i = !t && e.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: t || i || r,
                android: a
            }
        }(),
        support: {
            touch: window.Modernizr && Modernizr.touch === !0 || function() {
                return !!("ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch)
            }(),
            transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function() {
                var e = document.createElement("div").style;
                return "webkitPerspective"in e || "MozPerspective"in e || "OPerspective"in e || "MsPerspective"in e || "perspective"in e
            }(),
            flexbox: function() {
                for (var e = document.createElement("div").style, a = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), t = 0; t < a.length; t++)
                    if (a[t]in e)
                        return !0
            }(),
            observer: function() {
                return "MutationObserver"in window || "WebkitMutationObserver"in window
            }()
        },
        plugins: {}
    };
    for (var r = (function() {
        var e = function(e) {
            var a = this
              , t = 0;
            for (t = 0; t < e.length; t++)
                a[t] = e[t];
            return a.length = e.length,
            this
        }
          , a = function(a, t) {
            var r = []
              , i = 0;
            if (a && !t && a instanceof e)
                return a;
            if (a)
                if ("string" == typeof a) {
                    var s, n, o = a.trim();
                    if (o.indexOf("<") >= 0 && o.indexOf(">") >= 0) {
                        var l = "div";
                        for (0 === o.indexOf("<li") && (l = "ul"),
                        0 === o.indexOf("<tr") && (l = "tbody"),
                        (0 === o.indexOf("<td") || 0 === o.indexOf("<th")) && (l = "tr"),
                        0 === o.indexOf("<tbody") && (l = "table"),
                        0 === o.indexOf("<option") && (l = "select"),
                        n = document.createElement(l),
                        n.innerHTML = a,
                        i = 0; i < n.childNodes.length; i++)
                            r.push(n.childNodes[i])
                    } else
                        for (s = t || "#" !== a[0] || a.match(/[ .<>:~]/) ? (t || document).querySelectorAll(a) : [document.getElementById(a.split("#")[1])],
                        i = 0; i < s.length; i++)
                            s[i] && r.push(s[i])
                } else if (a.nodeType || a === window || a === document)
                    r.push(a);
                else if (a.length > 0 && a[0].nodeType)
                    for (i = 0; i < a.length; i++)
                        r.push(a[i]);
            return new e(r)
        };
        return e.prototype = {
            addClass: function(e) {
                if ("undefined" == typeof e)
                    return this;
                for (var a = e.split(" "), t = 0; t < a.length; t++)
                    for (var r = 0; r < this.length; r++)
                        this[r].classList.add(a[t]);
                return this
            },
            removeClass: function(e) {
                for (var a = e.split(" "), t = 0; t < a.length; t++)
                    for (var r = 0; r < this.length; r++)
                        this[r].classList.remove(a[t]);
                return this
            },
            hasClass: function(e) {
                return this[0] ? this[0].classList.contains(e) : !1
            },
            toggleClass: function(e) {
                for (var a = e.split(" "), t = 0; t < a.length; t++)
                    for (var r = 0; r < this.length; r++)
                        this[r].classList.toggle(a[t]);
                return this
            },
            attr: function(e, a) {
                if (1 === arguments.length && "string" == typeof e)
                    return this[0] ? this[0].getAttribute(e) : void 0;
                for (var t = 0; t < this.length; t++)
                    if (2 === arguments.length)
                        this[t].setAttribute(e, a);
                    else
                        for (var r in e)
                            this[t][r] = e[r],
                            this[t].setAttribute(r, e[r]);
                return this
            },
            removeAttr: function(e) {
                for (var a = 0; a < this.length; a++)
                    this[a].removeAttribute(e);
                return this
            },
            data: function(e, a) {
                if ("undefined" != typeof a) {
                    for (var t = 0; t < this.length; t++) {
                        var r = this[t];
                        r.dom7ElementDataStorage || (r.dom7ElementDataStorage = {}),
                        r.dom7ElementDataStorage[e] = a
                    }
                    return this
                }
                if (this[0]) {
                    var i = this[0].getAttribute("data-" + e);
                    return i ? i : this[0].dom7ElementDataStorage && e in this[0].dom7ElementDataStorage ? this[0].dom7ElementDataStorage[e] : void 0
                }
            },
            transform: function(e) {
                for (var a = 0; a < this.length; a++) {
                    var t = this[a].style;
                    t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e
                }
                return this
            },
            transition: function(e) {
                "string" != typeof e && (e += "ms");
                for (var a = 0; a < this.length; a++) {
                    var t = this[a].style;
                    t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e
                }
                return this
            },
            on: function(e, t, r, i) {
                function s(e) {
                    var i = e.target;
                    if (a(i).is(t))
                        r.call(i, e);
                    else
                        for (var s = a(i).parents(), n = 0; n < s.length; n++)
                            a(s[n]).is(t) && r.call(s[n], e)
                }
                var n, o, l = e.split(" ");
                for (n = 0; n < this.length; n++)
                    if ("function" == typeof t || t === !1)
                        for ("function" == typeof t && (r = arguments[1],
                        i = arguments[2] || !1),
                        o = 0; o < l.length; o++)
                            this[n].addEventListener(l[o], r, i);
                    else
                        for (o = 0; o < l.length; o++)
                            this[n].dom7LiveListeners || (this[n].dom7LiveListeners = []),
                            this[n].dom7LiveListeners.push({
                                listener: r,
                                liveListener: s
                            }),
                            this[n].addEventListener(l[o], s, i);
                return this
            },
            off: function(e, a, t, r) {
                for (var i = e.split(" "), s = 0; s < i.length; s++)
                    for (var n = 0; n < this.length; n++)
                        if ("function" == typeof a || a === !1)
                            "function" == typeof a && (t = arguments[1],
                            r = arguments[2] || !1),
                            this[n].removeEventListener(i[s], t, r);
                        else if (this[n].dom7LiveListeners)
                            for (var o = 0; o < this[n].dom7LiveListeners.length; o++)
                                this[n].dom7LiveListeners[o].listener === t && this[n].removeEventListener(i[s], this[n].dom7LiveListeners[o].liveListener, r);
                return this
            },
            once: function(e, a, t, r) {
                function i(n) {
                    t(n),
                    s.off(e, a, i, r)
                }
                var s = this;
                "function" == typeof a && (a = !1,
                t = arguments[1],
                r = arguments[2]),
                s.on(e, a, i, r)
            },
            trigger: function(e, a) {
                for (var t = 0; t < this.length; t++) {
                    var r;
                    try {
                        r = new window.CustomEvent(e,{
                            detail: a,
                            bubbles: !0,
                            cancelable: !0
                        })
                    } catch (i) {
                        r = document.createEvent("Event"),
                        r.initEvent(e, !0, !0),
                        r.detail = a
                    }
                    this[t].dispatchEvent(r)
                }
                return this
            },
            transitionEnd: function(e) {
                function a(s) {
                    if (s.target === this)
                        for (e.call(this, s),
                        t = 0; t < r.length; t++)
                            i.off(r[t], a)
                }
                var t, r = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], i = this;
                if (e)
                    for (t = 0; t < r.length; t++)
                        i.on(r[t], a);
                return this
            },
            width: function() {
                return this[0] === window ? window.innerWidth : this.length > 0 ? parseFloat(this.css("width")) : null
            },
            outerWidth: function(e) {
                return this.length > 0 ? e ? this[0].offsetWidth + parseFloat(this.css("margin-right")) + parseFloat(this.css("margin-left")) : this[0].offsetWidth : null
            },
            height: function() {
                return this[0] === window ? window.innerHeight : this.length > 0 ? parseFloat(this.css("height")) : null
            },
            outerHeight: function(e) {
                return this.length > 0 ? e ? this[0].offsetHeight + parseFloat(this.css("margin-top")) + parseFloat(this.css("margin-bottom")) : this[0].offsetHeight : null
            },
            offset: function() {
                if (this.length > 0) {
                    var e = this[0]
                      , a = e.getBoundingClientRect()
                      , t = document.body
                      , r = e.clientTop || t.clientTop || 0
                      , i = e.clientLeft || t.clientLeft || 0
                      , s = window.pageYOffset || e.scrollTop
                      , n = window.pageXOffset || e.scrollLeft;
                    return {
                        top: a.top + s - r,
                        left: a.left + n - i
                    }
                }
                return null
            },
            css: function(e, a) {
                var t;
                if (1 === arguments.length) {
                    if ("string" != typeof e) {
                        for (t = 0; t < this.length; t++)
                            for (var r in e)
                                this[t].style[r] = e[r];
                        return this
                    }
                    if (this[0])
                        return window.getComputedStyle(this[0], null).getPropertyValue(e)
                }
                if (2 === arguments.length && "string" == typeof e) {
                    for (t = 0; t < this.length; t++)
                        this[t].style[e] = a;
                    return this
                }
                return this
            },
            each: function(e) {
                for (var a = 0; a < this.length; a++)
                    e.call(this[a], a, this[a]);
                return this
            },
            html: function(e) {
                if ("undefined" == typeof e)
                    return this[0] ? this[0].innerHTML : void 0;
                for (var a = 0; a < this.length; a++)
                    this[a].innerHTML = e;
                return this
            },
            text: function(e) {
                if ("undefined" == typeof e)
                    return this[0] ? this[0].textContent.trim() : null;
                for (var a = 0; a < this.length; a++)
                    this[a].textContent = e;
                return this
            },
            is: function(t) {
                if (!this[0])
                    return !1;
                var r, i;
                if ("string" == typeof t) {
                    var s = this[0];
                    if (s === document)
                        return t === document;
                    if (s === window)
                        return t === window;
                    if (s.matches)
                        return s.matches(t);
                    if (s.webkitMatchesSelector)
                        return s.webkitMatchesSelector(t);
                    if (s.mozMatchesSelector)
                        return s.mozMatchesSelector(t);
                    if (s.msMatchesSelector)
                        return s.msMatchesSelector(t);
                    for (r = a(t),
                    i = 0; i < r.length; i++)
                        if (r[i] === this[0])
                            return !0;
                    return !1
                }
                if (t === document)
                    return this[0] === document;
                if (t === window)
                    return this[0] === window;
                if (t.nodeType || t instanceof e) {
                    for (r = t.nodeType ? [t] : t,
                    i = 0; i < r.length; i++)
                        if (r[i] === this[0])
                            return !0;
                    return !1
                }
                return !1
            },
            index: function() {
                if (this[0]) {
                    for (var e = this[0], a = 0; null !== (e = e.previousSibling); )
                        1 === e.nodeType && a++;
                    return a
                }
            },
            eq: function(a) {
                if ("undefined" == typeof a)
                    return this;
                var t, r = this.length;
                return a > r - 1 ? new e([]) : 0 > a ? (t = r + a,
                new e(0 > t ? [] : [this[t]])) : new e([this[a]])
            },
            append: function(a) {
                var t, r;
                for (t = 0; t < this.length; t++)
                    if ("string" == typeof a) {
                        var i = document.createElement("div");
                        for (i.innerHTML = a; i.firstChild; )
                            this[t].appendChild(i.firstChild)
                    } else if (a instanceof e)
                        for (r = 0; r < a.length; r++)
                            this[t].appendChild(a[r]);
                    else
                        this[t].appendChild(a);
                return this
            },
            prepend: function(a) {
                var t, r;
                for (t = 0; t < this.length; t++)
                    if ("string" == typeof a) {
                        var i = document.createElement("div");
                        for (i.innerHTML = a,
                        r = i.childNodes.length - 1; r >= 0; r--)
                            this[t].insertBefore(i.childNodes[r], this[t].childNodes[0])
                    } else if (a instanceof e)
                        for (r = 0; r < a.length; r++)
                            this[t].insertBefore(a[r], this[t].childNodes[0]);
                    else
                        this[t].insertBefore(a, this[t].childNodes[0]);
                return this
            },
            insertBefore: function(e) {
                for (var t = a(e), r = 0; r < this.length; r++)
                    if (1 === t.length)
                        t[0].parentNode.insertBefore(this[r], t[0]);
                    else if (t.length > 1)
                        for (var i = 0; i < t.length; i++)
                            t[i].parentNode.insertBefore(this[r].cloneNode(!0), t[i])
            },
            insertAfter: function(e) {
                for (var t = a(e), r = 0; r < this.length; r++)
                    if (1 === t.length)
                        t[0].parentNode.insertBefore(this[r], t[0].nextSibling);
                    else if (t.length > 1)
                        for (var i = 0; i < t.length; i++)
                            t[i].parentNode.insertBefore(this[r].cloneNode(!0), t[i].nextSibling)
            },
            next: function(t) {
                return new e(this.length > 0 ? t ? this[0].nextElementSibling && a(this[0].nextElementSibling).is(t) ? [this[0].nextElementSibling] : [] : this[0].nextElementSibling ? [this[0].nextElementSibling] : [] : [])
            },
            nextAll: function(t) {
                var r = []
                  , i = this[0];
                if (!i)
                    return new e([]);
                for (; i.nextElementSibling; ) {
                    var s = i.nextElementSibling;
                    t ? a(s).is(t) && r.push(s) : r.push(s),
                    i = s
                }
                return new e(r)
            },
            prev: function(t) {
                return new e(this.length > 0 ? t ? this[0].previousElementSibling && a(this[0].previousElementSibling).is(t) ? [this[0].previousElementSibling] : [] : this[0].previousElementSibling ? [this[0].previousElementSibling] : [] : [])
            },
            prevAll: function(t) {
                var r = []
                  , i = this[0];
                if (!i)
                    return new e([]);
                for (; i.previousElementSibling; ) {
                    var s = i.previousElementSibling;
                    t ? a(s).is(t) && r.push(s) : r.push(s),
                    i = s
                }
                return new e(r)
            },
            parent: function(e) {
                for (var t = [], r = 0; r < this.length; r++)
                    e ? a(this[r].parentNode).is(e) && t.push(this[r].parentNode) : t.push(this[r].parentNode);
                return a(a.unique(t))
            },
            parents: function(e) {
                for (var t = [], r = 0; r < this.length; r++)
                    for (var i = this[r].parentNode; i; )
                        e ? a(i).is(e) && t.push(i) : t.push(i),
                        i = i.parentNode;
                return a(a.unique(t))
            },
            find: function(a) {
                for (var t = [], r = 0; r < this.length; r++)
                    for (var i = this[r].querySelectorAll(a), s = 0; s < i.length; s++)
                        t.push(i[s]);
                return new e(t)
            },
            children: function(t) {
                for (var r = [], i = 0; i < this.length; i++)
                    for (var s = this[i].childNodes, n = 0; n < s.length; n++)
                        t ? 1 === s[n].nodeType && a(s[n]).is(t) && r.push(s[n]) : 1 === s[n].nodeType && r.push(s[n]);
                return new e(a.unique(r))
            },
            remove: function() {
                for (var e = 0; e < this.length; e++)
                    this[e].parentNode && this[e].parentNode.removeChild(this[e]);
                return this
            },
            add: function() {
                var e, t, r = this;
                for (e = 0; e < arguments.length; e++) {
                    var i = a(arguments[e]);
                    for (t = 0; t < i.length; t++)
                        r[r.length] = i[t],
                        r.length++
                }
                return r
            }
        },
        a.fn = e.prototype,
        a.unique = function(e) {
            for (var a = [], t = 0; t < e.length; t++)
                -1 === a.indexOf(e[t]) && a.push(e[t]);
            return a
        }
        ,
        a
    }()), i = ["jQuery", "Zepto", "Dom7"], s = 0; s < i.length; s++)
        window[i[s]] && e(window[i[s]]);
    var n;
    n = "undefined" == typeof r ? window.Dom7 || window.Zepto || window.jQuery : r,
    n && ("transitionEnd"in n.fn || (n.fn.transitionEnd = function(e) {
        function a(s) {
            if (s.target === this)
                for (e.call(this, s),
                t = 0; t < r.length; t++)
                    i.off(r[t], a)
        }
        var t, r = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], i = this;
        if (e)
            for (t = 0; t < r.length; t++)
                i.on(r[t], a);
        return this
    }
    ),
    "transform"in n.fn || (n.fn.transform = function(e) {
        for (var a = 0; a < this.length; a++) {
            var t = this[a].style;
            t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e
        }
        return this
    }
    ),
    "transition"in n.fn || (n.fn.transition = function(e) {
        "string" != typeof e && (e += "ms");
        for (var a = 0; a < this.length; a++) {
            var t = this[a].style;
            t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e
        }
        return this
    }
    )),
    window.Swiper = t
}(),
"undefined" != typeof module ? module.exports = window.Swiper : "function" == typeof define && define.amd && define([], function() {
    "use strict";
    return window.Swiper
});
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(a, b, c) {
        var d = function(a) {
            var b, c = [], d = a.length;
            for (b = 0; b !== d; c.push(a[b++]))
                ;
            return c
        }
          , e = function(a, b, c) {
            var d, e, f = a.cycle;
            for (d in f)
                e = f[d],
                a[d] = "function" == typeof e ? e(c, b[c]) : e[c % e.length];
            delete a.cycle
        }
          , f = function(a, b, d) {
            c.call(this, a, b, d),
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._dirty = !0,
            this.render = f.prototype.render
        }
          , g = 1e-10
          , h = c._internals
          , i = h.isSelector
          , j = h.isArray
          , k = f.prototype = c.to({}, .1, {})
          , l = [];
        f.version = "1.19.1",
        k.constructor = f,
        k.kill()._gc = !1,
        f.killTweensOf = f.killDelayedCallsTo = c.killTweensOf,
        f.getTweensOf = c.getTweensOf,
        f.lagSmoothing = c.lagSmoothing,
        f.ticker = c.ticker,
        f.render = c.render,
        k.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            c.prototype.invalidate.call(this)
        }
        ,
        k.updateTo = function(a, b) {
            var d, e = this.ratio, f = this.vars.immediateRender || a.immediateRender;
            b && this._startTime < this._timeline._time && (this._startTime = this._timeline._time,
            this._uncache(!1),
            this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
            for (d in a)
                this.vars[d] = a[d];
            if (this._initted || f)
                if (b)
                    this._initted = !1,
                    f && this.render(0, !0, !0);
                else if (this._gc && this._enabled(!0, !1),
                this._notifyPluginsOfEnabled && this._firstPT && c._onPluginEvent("_onDisable", this),
                this._time / this._duration > .998) {
                    var g = this._totalTime;
                    this.render(0, !0, !1),
                    this._initted = !1,
                    this.render(g, !0, !1)
                } else if (this._initted = !1,
                this._init(),
                this._time > 0 || f)
                    for (var h, i = 1 / (1 - e), j = this._firstPT; j; )
                        h = j.s + j.c,
                        j.c *= i,
                        j.s = h - j.c,
                        j = j._next;
            return this
        }
        ,
        k.render = function(a, b, c) {
            this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
            var d, e, f, i, j, k, l, m, n = this._dirty ? this.totalDuration() : this._totalDuration, o = this._time, p = this._totalTime, q = this._cycle, r = this._duration, s = this._rawPrevTime;
            if (a >= n - 1e-7 && a >= 0 ? (this._totalTime = n,
            this._cycle = this._repeat,
            this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = r,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1),
            this._reversed || (d = !0,
            e = "onComplete",
            c = c || this._timeline.autoRemoveChildren),
            0 === r && (this._initted || !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0),
            (0 > s || 0 >= a && a >= -1e-7 || s === g && "isPause" !== this.data) && s !== a && (c = !0,
            s > g && (e = "onReverseComplete")),
            this._rawPrevTime = m = !b || a || s === a ? a : g)) : 1e-7 > a ? (this._totalTime = this._time = this._cycle = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
            (0 !== p || 0 === r && s > 0) && (e = "onReverseComplete",
            d = this._reversed),
            0 > a && (this._active = !1,
            0 === r && (this._initted || !this.vars.lazy || c) && (s >= 0 && (c = !0),
            this._rawPrevTime = m = !b || a || s === a ? a : g)),
            this._initted || (c = !0)) : (this._totalTime = this._time = a,
            0 !== this._repeat && (i = r + this._repeatDelay,
            this._cycle = this._totalTime / i >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / i && a >= p && this._cycle--,
            this._time = this._totalTime - this._cycle * i,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = r - this._time),
            this._time > r ? this._time = r : this._time < 0 && (this._time = 0)),
            this._easeType ? (j = this._time / r,
            k = this._easeType,
            l = this._easePower,
            (1 === k || 3 === k && j >= .5) && (j = 1 - j),
            3 === k && (j *= 2),
            1 === l ? j *= j : 2 === l ? j *= j * j : 3 === l ? j *= j * j * j : 4 === l && (j *= j * j * j * j),
            1 === k ? this.ratio = 1 - j : 2 === k ? this.ratio = j : this._time / r < .5 ? this.ratio = j / 2 : this.ratio = 1 - j / 2) : this.ratio = this._ease.getRatio(this._time / r)),
            o === this._time && !c && q === this._cycle)
                return void (p !== this._totalTime && this._onUpdate && (b || this._callback("onUpdate")));
            if (!this._initted) {
                if (this._init(),
                !this._initted || this._gc)
                    return;
                if (!c && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))
                    return this._time = o,
                    this._totalTime = p,
                    this._rawPrevTime = s,
                    this._cycle = q,
                    h.lazyTweens.push(this),
                    void (this._lazy = [a, b]);
                this._time && !d ? this.ratio = this._ease.getRatio(this._time / r) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }
            for (this._lazy !== !1 && (this._lazy = !1),
            this._active || !this._paused && this._time !== o && a >= 0 && (this._active = !0),
            0 === p && (2 === this._initted && a > 0 && this._init(),
            this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")),
            this.vars.onStart && (0 !== this._totalTime || 0 === r) && (b || this._callback("onStart"))),
            f = this._firstPT; f; )
                f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s,
                f = f._next;
            this._onUpdate && (0 > a && this._startAt && this._startTime && this._startAt.render(a, b, c),
            b || (this._totalTime !== p || e) && this._callback("onUpdate")),
            this._cycle !== q && (b || this._gc || this.vars.onRepeat && this._callback("onRepeat")),
            e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(a, b, c),
            d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !b && this.vars[e] && this._callback(e),
            0 === r && this._rawPrevTime === g && m !== g && (this._rawPrevTime = 0))
        }
        ,
        f.to = function(a, b, c) {
            return new f(a,b,c)
        }
        ,
        f.from = function(a, b, c) {
            return c.runBackwards = !0,
            c.immediateRender = 0 != c.immediateRender,
            new f(a,b,c)
        }
        ,
        f.fromTo = function(a, b, c, d) {
            return d.startAt = c,
            d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
            new f(a,b,d)
        }
        ,
        f.staggerTo = f.allTo = function(a, b, g, h, k, m, n) {
            h = h || 0;
            var o, p, q, r, s = 0, t = [], u = function() {
                g.onComplete && g.onComplete.apply(g.onCompleteScope || this, arguments),
                k.apply(n || g.callbackScope || this, m || l)
            }, v = g.cycle, w = g.startAt && g.startAt.cycle;
            for (j(a) || ("string" == typeof a && (a = c.selector(a) || a),
            i(a) && (a = d(a))),
            a = a || [],
            0 > h && (a = d(a),
            a.reverse(),
            h *= -1),
            o = a.length - 1,
            q = 0; o >= q; q++) {
                p = {};
                for (r in g)
                    p[r] = g[r];
                if (v && (e(p, a, q),
                null != p.duration && (b = p.duration,
                delete p.duration)),
                w) {
                    w = p.startAt = {};
                    for (r in g.startAt)
                        w[r] = g.startAt[r];
                    e(p.startAt, a, q)
                }
                p.delay = s + (p.delay || 0),
                q === o && k && (p.onComplete = u),
                t[q] = new f(a[q],b,p),
                s += h
            }
            return t
        }
        ,
        f.staggerFrom = f.allFrom = function(a, b, c, d, e, g, h) {
            return c.runBackwards = !0,
            c.immediateRender = 0 != c.immediateRender,
            f.staggerTo(a, b, c, d, e, g, h)
        }
        ,
        f.staggerFromTo = f.allFromTo = function(a, b, c, d, e, g, h, i) {
            return d.startAt = c,
            d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
            f.staggerTo(a, b, d, e, g, h, i)
        }
        ,
        f.delayedCall = function(a, b, c, d, e) {
            return new f(b,0,{
                delay: a,
                onComplete: b,
                onCompleteParams: c,
                callbackScope: d,
                onReverseComplete: b,
                onReverseCompleteParams: c,
                immediateRender: !1,
                useFrames: e,
                overwrite: 0
            })
        }
        ,
        f.set = function(a, b) {
            return new f(a,0,b)
        }
        ,
        f.isTweening = function(a) {
            return c.getTweensOf(a, !0).length > 0
        }
        ;
        var m = function(a, b) {
            for (var d = [], e = 0, f = a._first; f; )
                f instanceof c ? d[e++] = f : (b && (d[e++] = f),
                d = d.concat(m(f, b)),
                e = d.length),
                f = f._next;
            return d
        }
          , n = f.getAllTweens = function(b) {
            return m(a._rootTimeline, b).concat(m(a._rootFramesTimeline, b))
        }
        ;
        f.killAll = function(a, c, d, e) {
            null == c && (c = !0),
            null == d && (d = !0);
            var f, g, h, i = n(0 != e), j = i.length, k = c && d && e;
            for (h = 0; j > h; h++)
                g = i[h],
                (k || g instanceof b || (f = g.target === g.vars.onComplete) && d || c && !f) && (a ? g.totalTime(g._reversed ? 0 : g.totalDuration()) : g._enabled(!1, !1))
        }
        ,
        f.killChildTweensOf = function(a, b) {
            if (null != a) {
                var e, g, k, l, m, n = h.tweenLookup;
                if ("string" == typeof a && (a = c.selector(a) || a),
                i(a) && (a = d(a)),
                j(a))
                    for (l = a.length; --l > -1; )
                        f.killChildTweensOf(a[l], b);
                else {
                    e = [];
                    for (k in n)
                        for (g = n[k].target.parentNode; g; )
                            g === a && (e = e.concat(n[k].tweens)),
                            g = g.parentNode;
                    for (m = e.length,
                    l = 0; m > l; l++)
                        b && e[l].totalTime(e[l].totalDuration()),
                        e[l]._enabled(!1, !1)
                }
            }
        }
        ;
        var o = function(a, c, d, e) {
            c = c !== !1,
            d = d !== !1,
            e = e !== !1;
            for (var f, g, h = n(e), i = c && d && e, j = h.length; --j > -1; )
                g = h[j],
                (i || g instanceof b || (f = g.target === g.vars.onComplete) && d || c && !f) && g.paused(a)
        };
        return f.pauseAll = function(a, b, c) {
            o(!0, a, b, c)
        }
        ,
        f.resumeAll = function(a, b, c) {
            o(!1, a, b, c)
        }
        ,
        f.globalTimeScale = function(b) {
            var d = a._rootTimeline
              , e = c.ticker.time;
            return arguments.length ? (b = b || g,
            d._startTime = e - (e - d._startTime) * d._timeScale / b,
            d = a._rootFramesTimeline,
            e = c.ticker.frame,
            d._startTime = e - (e - d._startTime) * d._timeScale / b,
            d._timeScale = a._rootTimeline._timeScale = b,
            b) : d._timeScale
        }
        ,
        k.progress = function(a, b) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration()
        }
        ,
        k.totalProgress = function(a, b) {
            return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime / this.totalDuration()
        }
        ,
        k.time = function(a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            a > this._duration && (a = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(a, b)) : this._time
        }
        ,
        k.duration = function(b) {
            return arguments.length ? a.prototype.duration.call(this, b) : this._duration
        }
        ,
        k.totalDuration = function(a) {
            return arguments.length ? -1 === this._repeat ? this : this.duration((a - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat,
            this._dirty = !1),
            this._totalDuration)
        }
        ,
        k.repeat = function(a) {
            return arguments.length ? (this._repeat = a,
            this._uncache(!0)) : this._repeat
        }
        ,
        k.repeatDelay = function(a) {
            return arguments.length ? (this._repeatDelay = a,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        k.yoyo = function(a) {
            return arguments.length ? (this._yoyo = a,
            this) : this._yoyo
        }
        ,
        f
    }, !0),
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(a, b, c) {
        var d = function(a) {
            b.call(this, a),
            this._labels = {},
            this.autoRemoveChildren = this.vars.autoRemoveChildren === !0,
            this.smoothChildTiming = this.vars.smoothChildTiming === !0,
            this._sortChildren = !0,
            this._onUpdate = this.vars.onUpdate;
            var c, d, e = this.vars;
            for (d in e)
                c = e[d],
                i(c) && -1 !== c.join("").indexOf("{self}") && (e[d] = this._swapSelfInParams(c));
            i(e.tweens) && this.add(e.tweens, 0, e.align, e.stagger)
        }
          , e = 1e-10
          , f = c._internals
          , g = d._internals = {}
          , h = f.isSelector
          , i = f.isArray
          , j = f.lazyTweens
          , k = f.lazyRender
          , l = _gsScope._gsDefine.globals
          , m = function(a) {
            var b, c = {};
            for (b in a)
                c[b] = a[b];
            return c
        }
          , n = function(a, b, c) {
            var d, e, f = a.cycle;
            for (d in f)
                e = f[d],
                a[d] = "function" == typeof e ? e(c, b[c]) : e[c % e.length];
            delete a.cycle
        }
          , o = g.pauseCallback = function() {}
          , p = function(a) {
            var b, c = [], d = a.length;
            for (b = 0; b !== d; c.push(a[b++]))
                ;
            return c
        }
          , q = d.prototype = new b;
        return d.version = "1.19.1",
        q.constructor = d,
        q.kill()._gc = q._forcingPlayhead = q._hasPause = !1,
        q.to = function(a, b, d, e) {
            var f = d.repeat && l.TweenMax || c;
            return b ? this.add(new f(a,b,d), e) : this.set(a, d, e)
        }
        ,
        q.from = function(a, b, d, e) {
            return this.add((d.repeat && l.TweenMax || c).from(a, b, d), e)
        }
        ,
        q.fromTo = function(a, b, d, e, f) {
            var g = e.repeat && l.TweenMax || c;
            return b ? this.add(g.fromTo(a, b, d, e), f) : this.set(a, e, f)
        }
        ,
        q.staggerTo = function(a, b, e, f, g, i, j, k) {
            var l, o, q = new d({
                onComplete: i,
                onCompleteParams: j,
                callbackScope: k,
                smoothChildTiming: this.smoothChildTiming
            }), r = e.cycle;
            for ("string" == typeof a && (a = c.selector(a) || a),
            a = a || [],
            h(a) && (a = p(a)),
            f = f || 0,
            0 > f && (a = p(a),
            a.reverse(),
            f *= -1),
            o = 0; o < a.length; o++)
                l = m(e),
                l.startAt && (l.startAt = m(l.startAt),
                l.startAt.cycle && n(l.startAt, a, o)),
                r && (n(l, a, o),
                null != l.duration && (b = l.duration,
                delete l.duration)),
                q.to(a[o], b, l, o * f);
            return this.add(q, g)
        }
        ,
        q.staggerFrom = function(a, b, c, d, e, f, g, h) {
            return c.immediateRender = 0 != c.immediateRender,
            c.runBackwards = !0,
            this.staggerTo(a, b, c, d, e, f, g, h)
        }
        ,
        q.staggerFromTo = function(a, b, c, d, e, f, g, h, i) {
            return d.startAt = c,
            d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
            this.staggerTo(a, b, d, e, f, g, h, i)
        }
        ,
        q.call = function(a, b, d, e) {
            return this.add(c.delayedCall(0, a, b, d), e)
        }
        ,
        q.set = function(a, b, d) {
            return d = this._parseTimeOrLabel(d, 0, !0),
            null == b.immediateRender && (b.immediateRender = d === this._time && !this._paused),
            this.add(new c(a,0,b), d)
        }
        ,
        d.exportRoot = function(a, b) {
            a = a || {},
            null == a.smoothChildTiming && (a.smoothChildTiming = !0);
            var e, f, g = new d(a), h = g._timeline;
            for (null == b && (b = !0),
            h._remove(g, !0),
            g._startTime = 0,
            g._rawPrevTime = g._time = g._totalTime = h._time,
            e = h._first; e; )
                f = e._next,
                b && e instanceof c && e.target === e.vars.onComplete || g.add(e, e._startTime - e._delay),
                e = f;
            return h.add(g, 0),
            g
        }
        ,
        q.add = function(e, f, g, h) {
            var j, k, l, m, n, o;
            if ("number" != typeof f && (f = this._parseTimeOrLabel(f, 0, !0, e)),
            !(e instanceof a)) {
                if (e instanceof Array || e && e.push && i(e)) {
                    for (g = g || "normal",
                    h = h || 0,
                    j = f,
                    k = e.length,
                    l = 0; k > l; l++)
                        i(m = e[l]) && (m = new d({
                            tweens: m
                        })),
                        this.add(m, j),
                        "string" != typeof m && "function" != typeof m && ("sequence" === g ? j = m._startTime + m.totalDuration() / m._timeScale : "start" === g && (m._startTime -= m.delay())),
                        j += h;
                    return this._uncache(!0)
                }
                if ("string" == typeof e)
                    return this.addLabel(e, f);
                if ("function" != typeof e)
                    throw "Cannot add " + e + " into the timeline; it is not a tween, timeline, function, or string.";
                e = c.delayedCall(0, e)
            }
            if (b.prototype.add.call(this, e, f),
            (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                for (n = this,
                o = n.rawTime() > e._startTime; n._timeline; )
                    o && n._timeline.smoothChildTiming ? n.totalTime(n._totalTime, !0) : n._gc && n._enabled(!0, !1),
                    n = n._timeline;
            return this
        }
        ,
        q.remove = function(b) {
            if (b instanceof a) {
                this._remove(b, !1);
                var c = b._timeline = b.vars.useFrames ? a._rootFramesTimeline : a._rootTimeline;
                return b._startTime = (b._paused ? b._pauseTime : c._time) - (b._reversed ? b.totalDuration() - b._totalTime : b._totalTime) / b._timeScale,
                this
            }
            if (b instanceof Array || b && b.push && i(b)) {
                for (var d = b.length; --d > -1; )
                    this.remove(b[d]);
                return this
            }
            return "string" == typeof b ? this.removeLabel(b) : this.kill(null, b)
        }
        ,
        q._remove = function(a, c) {
            b.prototype._remove.call(this, a, c);
            var d = this._last;
            return d ? this._time > this.duration() && (this._time = this._duration,
            this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0,
            this
        }
        ,
        q.append = function(a, b) {
            return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
        }
        ,
        q.insert = q.insertMultiple = function(a, b, c, d) {
            return this.add(a, b || 0, c, d)
        }
        ,
        q.appendMultiple = function(a, b, c, d) {
            return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
        }
        ,
        q.addLabel = function(a, b) {
            return this._labels[a] = this._parseTimeOrLabel(b),
            this
        }
        ,
        q.addPause = function(a, b, d, e) {
            var f = c.delayedCall(0, o, d, e || this);
            return f.vars.onComplete = f.vars.onReverseComplete = b,
            f.data = "isPause",
            this._hasPause = !0,
            this.add(f, a)
        }
        ,
        q.removeLabel = function(a) {
            return delete this._labels[a],
            this
        }
        ,
        q.getLabelTime = function(a) {
            return null != this._labels[a] ? this._labels[a] : -1
        }
        ,
        q._parseTimeOrLabel = function(b, c, d, e) {
            var f;
            if (e instanceof a && e.timeline === this)
                this.remove(e);
            else if (e && (e instanceof Array || e.push && i(e)))
                for (f = e.length; --f > -1; )
                    e[f]instanceof a && e[f].timeline === this && this.remove(e[f]);
            if ("string" == typeof c)
                return this._parseTimeOrLabel(c, d && "number" == typeof b && null == this._labels[c] ? b - this.duration() : 0, d);
            if (c = c || 0,
            "string" != typeof b || !isNaN(b) && null == this._labels[b])
                null == b && (b = this.duration());
            else {
                if (f = b.indexOf("="),
                -1 === f)
                    return null == this._labels[b] ? d ? this._labels[b] = this.duration() + c : c : this._labels[b] + c;
                c = parseInt(b.charAt(f - 1) + "1", 10) * Number(b.substr(f + 1)),
                b = f > 1 ? this._parseTimeOrLabel(b.substr(0, f - 1), 0, d) : this.duration()
            }
            return Number(b) + c
        }
        ,
        q.seek = function(a, b) {
            return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), b !== !1)
        }
        ,
        q.stop = function() {
            return this.paused(!0)
        }
        ,
        q.gotoAndPlay = function(a, b) {
            return this.play(a, b)
        }
        ,
        q.gotoAndStop = function(a, b) {
            return this.pause(a, b)
        }
        ,
        q.render = function(a, b, c) {
            this._gc && this._enabled(!0, !1);
            var d, f, g, h, i, l, m, n = this._dirty ? this.totalDuration() : this._totalDuration, o = this._time, p = this._startTime, q = this._timeScale, r = this._paused;
            if (a >= n - 1e-7 && a >= 0)
                this._totalTime = this._time = n,
                this._reversed || this._hasPausedChild() || (f = !0,
                h = "onComplete",
                i = !!this._timeline.autoRemoveChildren,
                0 === this._duration && (0 >= a && a >= -1e-7 || this._rawPrevTime < 0 || this._rawPrevTime === e) && this._rawPrevTime !== a && this._first && (i = !0,
                this._rawPrevTime > e && (h = "onReverseComplete"))),
                this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e,
                a = n + 1e-4;
            else if (1e-7 > a)
                if (this._totalTime = this._time = 0,
                (0 !== o || 0 === this._duration && this._rawPrevTime !== e && (this._rawPrevTime > 0 || 0 > a && this._rawPrevTime >= 0)) && (h = "onReverseComplete",
                f = this._reversed),
                0 > a)
                    this._active = !1,
                    this._timeline.autoRemoveChildren && this._reversed ? (i = f = !0,
                    h = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (i = !0),
                    this._rawPrevTime = a;
                else {
                    if (this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e,
                    0 === a && f)
                        for (d = this._first; d && 0 === d._startTime; )
                            d._duration || (f = !1),
                            d = d._next;
                    a = 0,
                    this._initted || (i = !0)
                }
            else {
                if (this._hasPause && !this._forcingPlayhead && !b) {
                    if (a >= o)
                        for (d = this._first; d && d._startTime <= a && !l; )
                            d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (l = d),
                            d = d._next;
                    else
                        for (d = this._last; d && d._startTime >= a && !l; )
                            d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (l = d),
                            d = d._prev;
                    l && (this._time = a = l._startTime,
                    this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                }
                this._totalTime = this._time = this._rawPrevTime = a
            }
            if (this._time !== o && this._first || c || i || l) {
                if (this._initted || (this._initted = !0),
                this._active || !this._paused && this._time !== o && a > 0 && (this._active = !0),
                0 === o && this.vars.onStart && (0 === this._time && this._duration || b || this._callback("onStart")),
                m = this._time,
                m >= o)
                    for (d = this._first; d && (g = d._next,
                    m === this._time && (!this._paused || r)); )
                        (d._active || d._startTime <= m && !d._paused && !d._gc) && (l === d && this.pause(),
                        d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                        d = g;
                else
                    for (d = this._last; d && (g = d._prev,
                    m === this._time && (!this._paused || r)); ) {
                        if (d._active || d._startTime <= o && !d._paused && !d._gc) {
                            if (l === d) {
                                for (l = d._prev; l && l.endTime() > this._time; )
                                    l.render(l._reversed ? l.totalDuration() - (a - l._startTime) * l._timeScale : (a - l._startTime) * l._timeScale, b, c),
                                    l = l._prev;
                                l = null,
                                this.pause()
                            }
                            d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                        }
                        d = g
                    }
                this._onUpdate && (b || (j.length && k(),
                this._callback("onUpdate"))),
                h && (this._gc || (p === this._startTime || q !== this._timeScale) && (0 === this._time || n >= this.totalDuration()) && (f && (j.length && k(),
                this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !b && this.vars[h] && this._callback(h)))
            }
        }
        ,
        q._hasPausedChild = function() {
            for (var a = this._first; a; ) {
                if (a._paused || a instanceof d && a._hasPausedChild())
                    return !0;
                a = a._next
            }
            return !1
        }
        ,
        q.getChildren = function(a, b, d, e) {
            e = e || -9999999999;
            for (var f = [], g = this._first, h = 0; g; )
                g._startTime < e || (g instanceof c ? b !== !1 && (f[h++] = g) : (d !== !1 && (f[h++] = g),
                a !== !1 && (f = f.concat(g.getChildren(!0, b, d)),
                h = f.length))),
                g = g._next;
            return f
        }
        ,
        q.getTweensOf = function(a, b) {
            var d, e, f = this._gc, g = [], h = 0;
            for (f && this._enabled(!0, !0),
            d = c.getTweensOf(a),
            e = d.length; --e > -1; )
                (d[e].timeline === this || b && this._contains(d[e])) && (g[h++] = d[e]);
            return f && this._enabled(!1, !0),
            g
        }
        ,
        q.recent = function() {
            return this._recent
        }
        ,
        q._contains = function(a) {
            for (var b = a.timeline; b; ) {
                if (b === this)
                    return !0;
                b = b.timeline
            }
            return !1
        }
        ,
        q.shiftChildren = function(a, b, c) {
            c = c || 0;
            for (var d, e = this._first, f = this._labels; e; )
                e._startTime >= c && (e._startTime += a),
                e = e._next;
            if (b)
                for (d in f)
                    f[d] >= c && (f[d] += a);
            return this._uncache(!0)
        }
        ,
        q._kill = function(a, b) {
            if (!a && !b)
                return this._enabled(!1, !1);
            for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, e = !1; --d > -1; )
                c[d]._kill(a, b) && (e = !0);
            return e
        }
        ,
        q.clear = function(a) {
            var b = this.getChildren(!1, !0, !0)
              , c = b.length;
            for (this._time = this._totalTime = 0; --c > -1; )
                b[c]._enabled(!1, !1);
            return a !== !1 && (this._labels = {}),
            this._uncache(!0)
        }
        ,
        q.invalidate = function() {
            for (var b = this._first; b; )
                b.invalidate(),
                b = b._next;
            return a.prototype.invalidate.call(this)
        }
        ,
        q._enabled = function(a, c) {
            if (a === this._gc)
                for (var d = this._first; d; )
                    d._enabled(a, !0),
                    d = d._next;
            return b.prototype._enabled.call(this, a, c)
        }
        ,
        q.totalTime = function(b, c, d) {
            this._forcingPlayhead = !0;
            var e = a.prototype.totalTime.apply(this, arguments);
            return this._forcingPlayhead = !1,
            e
        }
        ,
        q.duration = function(a) {
            return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a),
            this) : (this._dirty && this.totalDuration(),
            this._duration)
        }
        ,
        q.totalDuration = function(a) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var b, c, d = 0, e = this._last, f = 999999999999; e; )
                        b = e._prev,
                        e._dirty && e.totalDuration(),
                        e._startTime > f && this._sortChildren && !e._paused ? this.add(e, e._startTime - e._delay) : f = e._startTime,
                        e._startTime < 0 && !e._paused && (d -= e._startTime,
                        this._timeline.smoothChildTiming && (this._startTime += e._startTime / this._timeScale),
                        this.shiftChildren(-e._startTime, !1, -9999999999),
                        f = 0),
                        c = e._startTime + e._totalDuration / e._timeScale,
                        c > d && (d = c),
                        e = b;
                    this._duration = this._totalDuration = d,
                    this._dirty = !1
                }
                return this._totalDuration
            }
            return a && this.totalDuration() ? this.timeScale(this._totalDuration / a) : this
        }
        ,
        q.paused = function(b) {
            if (!b)
                for (var c = this._first, d = this._time; c; )
                    c._startTime === d && "isPause" === c.data && (c._rawPrevTime = 0),
                    c = c._next;
            return a.prototype.paused.apply(this, arguments)
        }
        ,
        q.usesFrames = function() {
            for (var b = this._timeline; b._timeline; )
                b = b._timeline;
            return b === a._rootFramesTimeline
        }
        ,
        q.rawTime = function(a) {
            return a && (this._paused || this._repeat && this.time() > 0 && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(a) - this._startTime) * this._timeScale
        }
        ,
        d
    }, !0),
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(a, b, c) {
        var d = function(b) {
            a.call(this, b),
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._dirty = !0
        }
          , e = 1e-10
          , f = b._internals
          , g = f.lazyTweens
          , h = f.lazyRender
          , i = _gsScope._gsDefine.globals
          , j = new c(null,null,1,0)
          , k = d.prototype = new a;
        return k.constructor = d,
        k.kill()._gc = !1,
        d.version = "1.19.1",
        k.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            a.prototype.invalidate.call(this)
        }
        ,
        k.addCallback = function(a, c, d, e) {
            return this.add(b.delayedCall(0, a, d, e), c)
        }
        ,
        k.removeCallback = function(a, b) {
            if (a)
                if (null == b)
                    this._kill(null, a);
                else
                    for (var c = this.getTweensOf(a, !1), d = c.length, e = this._parseTimeOrLabel(b); --d > -1; )
                        c[d]._startTime === e && c[d]._enabled(!1, !1);
            return this
        }
        ,
        k.removePause = function(b) {
            return this.removeCallback(a._internals.pauseCallback, b)
        }
        ,
        k.tweenTo = function(a, c) {
            c = c || {};
            var d, e, f, g = {
                ease: j,
                useFrames: this.usesFrames(),
                immediateRender: !1
            }, h = c.repeat && i.TweenMax || b;
            for (e in c)
                g[e] = c[e];
            return g.time = this._parseTimeOrLabel(a),
            d = Math.abs(Number(g.time) - this._time) / this._timeScale || .001,
            f = new h(this,d,g),
            g.onStart = function() {
                f.target.paused(!0),
                f.vars.time !== f.target.time() && d === f.duration() && f.duration(Math.abs(f.vars.time - f.target.time()) / f.target._timeScale),
                c.onStart && c.onStart.apply(c.onStartScope || c.callbackScope || f, c.onStartParams || [])
            }
            ,
            f
        }
        ,
        k.tweenFromTo = function(a, b, c) {
            c = c || {},
            a = this._parseTimeOrLabel(a),
            c.startAt = {
                onComplete: this.seek,
                onCompleteParams: [a],
                callbackScope: this
            },
            c.immediateRender = c.immediateRender !== !1;
            var d = this.tweenTo(b, c);
            return d.duration(Math.abs(d.vars.time - a) / this._timeScale || .001)
        }
        ,
        k.render = function(a, b, c) {
            this._gc && this._enabled(!0, !1);
            var d, f, i, j, k, l, m, n, o = this._dirty ? this.totalDuration() : this._totalDuration, p = this._duration, q = this._time, r = this._totalTime, s = this._startTime, t = this._timeScale, u = this._rawPrevTime, v = this._paused, w = this._cycle;
            if (a >= o - 1e-7 && a >= 0)
                this._locked || (this._totalTime = o,
                this._cycle = this._repeat),
                this._reversed || this._hasPausedChild() || (f = !0,
                j = "onComplete",
                k = !!this._timeline.autoRemoveChildren,
                0 === this._duration && (0 >= a && a >= -1e-7 || 0 > u || u === e) && u !== a && this._first && (k = !0,
                u > e && (j = "onReverseComplete"))),
                this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e,
                this._yoyo && 0 !== (1 & this._cycle) ? this._time = a = 0 : (this._time = p,
                a = p + 1e-4);
            else if (1e-7 > a)
                if (this._locked || (this._totalTime = this._cycle = 0),
                this._time = 0,
                (0 !== q || 0 === p && u !== e && (u > 0 || 0 > a && u >= 0) && !this._locked) && (j = "onReverseComplete",
                f = this._reversed),
                0 > a)
                    this._active = !1,
                    this._timeline.autoRemoveChildren && this._reversed ? (k = f = !0,
                    j = "onReverseComplete") : u >= 0 && this._first && (k = !0),
                    this._rawPrevTime = a;
                else {
                    if (this._rawPrevTime = p || !b || a || this._rawPrevTime === a ? a : e,
                    0 === a && f)
                        for (d = this._first; d && 0 === d._startTime; )
                            d._duration || (f = !1),
                            d = d._next;
                    a = 0,
                    this._initted || (k = !0)
                }
            else if (0 === p && 0 > u && (k = !0),
            this._time = this._rawPrevTime = a,
            this._locked || (this._totalTime = a,
            0 !== this._repeat && (l = p + this._repeatDelay,
            this._cycle = this._totalTime / l >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / l && a >= r && this._cycle--,
            this._time = this._totalTime - this._cycle * l,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = p - this._time),
            this._time > p ? (this._time = p,
            a = p + 1e-4) : this._time < 0 ? this._time = a = 0 : a = this._time)),
            this._hasPause && !this._forcingPlayhead && !b && p > a) {
                if (a = this._time,
                a >= q || this._repeat && w !== this._cycle)
                    for (d = this._first; d && d._startTime <= a && !m; )
                        d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (m = d),
                        d = d._next;
                else
                    for (d = this._last; d && d._startTime >= a && !m; )
                        d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (m = d),
                        d = d._prev;
                m && (this._time = a = m._startTime,
                this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
            }
            if (this._cycle !== w && !this._locked) {
                var x = this._yoyo && 0 !== (1 & w)
                  , y = x === (this._yoyo && 0 !== (1 & this._cycle))
                  , z = this._totalTime
                  , A = this._cycle
                  , B = this._rawPrevTime
                  , C = this._time;
                if (this._totalTime = w * p,
                this._cycle < w ? x = !x : this._totalTime += p,
                this._time = q,
                this._rawPrevTime = 0 === p ? u - 1e-4 : u,
                this._cycle = w,
                this._locked = !0,
                q = x ? 0 : p,
                this.render(q, b, 0 === p),
                b || this._gc || this.vars.onRepeat && (this._cycle = A,
                this._locked = !1,
                this._callback("onRepeat")),
                q !== this._time)
                    return;
                if (y && (this._cycle = w,
                this._locked = !0,
                q = x ? p + 1e-4 : -1e-4,
                this.render(q, !0, !1)),
                this._locked = !1,
                this._paused && !v)
                    return;
                this._time = C,
                this._totalTime = z,
                this._cycle = A,
                this._rawPrevTime = B
            }
            if (!(this._time !== q && this._first || c || k || m))
                return void (r !== this._totalTime && this._onUpdate && (b || this._callback("onUpdate")));
            if (this._initted || (this._initted = !0),
            this._active || !this._paused && this._totalTime !== r && a > 0 && (this._active = !0),
            0 === r && this.vars.onStart && (0 === this._totalTime && this._totalDuration || b || this._callback("onStart")),
            n = this._time,
            n >= q)
                for (d = this._first; d && (i = d._next,
                n === this._time && (!this._paused || v)); )
                    (d._active || d._startTime <= this._time && !d._paused && !d._gc) && (m === d && this.pause(),
                    d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                    d = i;
            else
                for (d = this._last; d && (i = d._prev,
                n === this._time && (!this._paused || v)); ) {
                    if (d._active || d._startTime <= q && !d._paused && !d._gc) {
                        if (m === d) {
                            for (m = d._prev; m && m.endTime() > this._time; )
                                m.render(m._reversed ? m.totalDuration() - (a - m._startTime) * m._timeScale : (a - m._startTime) * m._timeScale, b, c),
                                m = m._prev;
                            m = null,
                            this.pause()
                        }
                        d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                    }
                    d = i
                }
            this._onUpdate && (b || (g.length && h(),
            this._callback("onUpdate"))),
            j && (this._locked || this._gc || (s === this._startTime || t !== this._timeScale) && (0 === this._time || o >= this.totalDuration()) && (f && (g.length && h(),
            this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !b && this.vars[j] && this._callback(j)))
        }
        ,
        k.getActive = function(a, b, c) {
            null == a && (a = !0),
            null == b && (b = !0),
            null == c && (c = !1);
            var d, e, f = [], g = this.getChildren(a, b, c), h = 0, i = g.length;
            for (d = 0; i > d; d++)
                e = g[d],
                e.isActive() && (f[h++] = e);
            return f
        }
        ,
        k.getLabelAfter = function(a) {
            a || 0 !== a && (a = this._time);
            var b, c = this.getLabelsArray(), d = c.length;
            for (b = 0; d > b; b++)
                if (c[b].time > a)
                    return c[b].name;
            return null
        }
        ,
        k.getLabelBefore = function(a) {
            null == a && (a = this._time);
            for (var b = this.getLabelsArray(), c = b.length; --c > -1; )
                if (b[c].time < a)
                    return b[c].name;
            return null
        }
        ,
        k.getLabelsArray = function() {
            var a, b = [], c = 0;
            for (a in this._labels)
                b[c++] = {
                    time: this._labels[a],
                    name: a
                };
            return b.sort(function(a, b) {
                return a.time - b.time
            }),
            b
        }
        ,
        k.invalidate = function() {
            return this._locked = !1,
            a.prototype.invalidate.call(this)
        }
        ,
        k.progress = function(a, b) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration()
        }
        ,
        k.totalProgress = function(a, b) {
            return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime / this.totalDuration()
        }
        ,
        k.totalDuration = function(b) {
            return arguments.length ? -1 !== this._repeat && b ? this.timeScale(this.totalDuration() / b) : this : (this._dirty && (a.prototype.totalDuration.call(this),
            this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat),
            this._totalDuration)
        }
        ,
        k.time = function(a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            a > this._duration && (a = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(a, b)) : this._time
        }
        ,
        k.repeat = function(a) {
            return arguments.length ? (this._repeat = a,
            this._uncache(!0)) : this._repeat
        }
        ,
        k.repeatDelay = function(a) {
            return arguments.length ? (this._repeatDelay = a,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        k.yoyo = function(a) {
            return arguments.length ? (this._yoyo = a,
            this) : this._yoyo
        }
        ,
        k.currentLabel = function(a) {
            return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1e-8)
        }
        ,
        d
    }, !0),
    function() {
        var a = 180 / Math.PI
          , b = []
          , c = []
          , d = []
          , e = {}
          , f = _gsScope._gsDefine.globals
          , g = function(a, b, c, d) {
            c === d && (c = d - (d - b) / 1e6),
            a === b && (b = a + (c - a) / 1e6),
            this.a = a,
            this.b = b,
            this.c = c,
            this.d = d,
            this.da = d - a,
            this.ca = c - a,
            this.ba = b - a
        }
          , h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,"
          , i = function(a, b, c, d) {
            var e = {
                a: a
            }
              , f = {}
              , g = {}
              , h = {
                c: d
            }
              , i = (a + b) / 2
              , j = (b + c) / 2
              , k = (c + d) / 2
              , l = (i + j) / 2
              , m = (j + k) / 2
              , n = (m - l) / 8;
            return e.b = i + (a - i) / 4,
            f.b = l + n,
            e.c = f.a = (e.b + f.b) / 2,
            f.c = g.a = (l + m) / 2,
            g.b = m - n,
            h.b = k + (d - k) / 4,
            g.c = h.a = (g.b + h.b) / 2,
            [e, f, g, h]
        }
          , j = function(a, e, f, g, h) {
            var j, k, l, m, n, o, p, q, r, s, t, u, v, w = a.length - 1, x = 0, y = a[0].a;
            for (j = 0; w > j; j++)
                n = a[x],
                k = n.a,
                l = n.d,
                m = a[x + 1].d,
                h ? (t = b[j],
                u = c[j],
                v = (u + t) * e * .25 / (g ? .5 : d[j] || .5),
                o = l - (l - k) * (g ? .5 * e : 0 !== t ? v / t : 0),
                p = l + (m - l) * (g ? .5 * e : 0 !== u ? v / u : 0),
                q = l - (o + ((p - o) * (3 * t / (t + u) + .5) / 4 || 0))) : (o = l - (l - k) * e * .5,
                p = l + (m - l) * e * .5,
                q = l - (o + p) / 2),
                o += q,
                p += q,
                n.c = r = o,
                0 !== j ? n.b = y : n.b = y = n.a + .6 * (n.c - n.a),
                n.da = l - k,
                n.ca = r - k,
                n.ba = y - k,
                f ? (s = i(k, y, r, l),
                a.splice(x, 1, s[0], s[1], s[2], s[3]),
                x += 4) : x++,
                y = p;
            n = a[x],
            n.b = y,
            n.c = y + .4 * (n.d - y),
            n.da = n.d - n.a,
            n.ca = n.c - n.a,
            n.ba = y - n.a,
            f && (s = i(n.a, y, n.c, n.d),
            a.splice(x, 1, s[0], s[1], s[2], s[3]))
        }
          , k = function(a, d, e, f) {
            var h, i, j, k, l, m, n = [];
            if (f)
                for (a = [f].concat(a),
                i = a.length; --i > -1; )
                    "string" == typeof (m = a[i][d]) && "=" === m.charAt(1) && (a[i][d] = f[d] + Number(m.charAt(0) + m.substr(2)));
            if (h = a.length - 2,
            0 > h)
                return n[0] = new g(a[0][d],0,0,a[-1 > h ? 0 : 1][d]),
                n;
            for (i = 0; h > i; i++)
                j = a[i][d],
                k = a[i + 1][d],
                n[i] = new g(j,0,0,k),
                e && (l = a[i + 2][d],
                b[i] = (b[i] || 0) + (k - j) * (k - j),
                c[i] = (c[i] || 0) + (l - k) * (l - k));
            return n[i] = new g(a[i][d],0,0,a[i + 1][d]),
            n
        }
          , l = function(a, f, g, i, l, m) {
            var n, o, p, q, r, s, t, u, v = {}, w = [], x = m || a[0];
            l = "string" == typeof l ? "," + l + "," : h,
            null == f && (f = 1);
            for (o in a[0])
                w.push(o);
            if (a.length > 1) {
                for (u = a[a.length - 1],
                t = !0,
                n = w.length; --n > -1; )
                    if (o = w[n],
                    Math.abs(x[o] - u[o]) > .05) {
                        t = !1;
                        break
                    }
                t && (a = a.concat(),
                m && a.unshift(m),
                a.push(a[1]),
                m = a[a.length - 3])
            }
            for (b.length = c.length = d.length = 0,
            n = w.length; --n > -1; )
                o = w[n],
                e[o] = -1 !== l.indexOf("," + o + ","),
                v[o] = k(a, o, e[o], m);
            for (n = b.length; --n > -1; )
                b[n] = Math.sqrt(b[n]),
                c[n] = Math.sqrt(c[n]);
            if (!i) {
                for (n = w.length; --n > -1; )
                    if (e[o])
                        for (p = v[w[n]],
                        s = p.length - 1,
                        q = 0; s > q; q++)
                            r = p[q + 1].da / c[q] + p[q].da / b[q] || 0,
                            d[q] = (d[q] || 0) + r * r;
                for (n = d.length; --n > -1; )
                    d[n] = Math.sqrt(d[n])
            }
            for (n = w.length,
            q = g ? 4 : 1; --n > -1; )
                o = w[n],
                p = v[o],
                j(p, f, g, i, e[o]),
                t && (p.splice(0, q),
                p.splice(p.length - q, q));
            return v
        }
          , m = function(a, b, c) {
            b = b || "soft";
            var d, e, f, h, i, j, k, l, m, n, o, p = {}, q = "cubic" === b ? 3 : 2, r = "soft" === b, s = [];
            if (r && c && (a = [c].concat(a)),
            null == a || a.length < q + 1)
                throw "invalid Bezier data";
            for (m in a[0])
                s.push(m);
            for (j = s.length; --j > -1; ) {
                for (m = s[j],
                p[m] = i = [],
                n = 0,
                l = a.length,
                k = 0; l > k; k++)
                    d = null == c ? a[k][m] : "string" == typeof (o = a[k][m]) && "=" === o.charAt(1) ? c[m] + Number(o.charAt(0) + o.substr(2)) : Number(o),
                    r && k > 1 && l - 1 > k && (i[n++] = (d + i[n - 2]) / 2),
                    i[n++] = d;
                for (l = n - q + 1,
                n = 0,
                k = 0; l > k; k += q)
                    d = i[k],
                    e = i[k + 1],
                    f = i[k + 2],
                    h = 2 === q ? 0 : i[k + 3],
                    i[n++] = o = 3 === q ? new g(d,e,f,h) : new g(d,(2 * e + d) / 3,(2 * e + f) / 3,f);
                i.length = n
            }
            return p
        }
          , n = function(a, b, c) {
            for (var d, e, f, g, h, i, j, k, l, m, n, o = 1 / c, p = a.length; --p > -1; )
                for (m = a[p],
                f = m.a,
                g = m.d - f,
                h = m.c - f,
                i = m.b - f,
                d = e = 0,
                k = 1; c >= k; k++)
                    j = o * k,
                    l = 1 - j,
                    d = e - (e = (j * j * g + 3 * l * (j * h + l * i)) * j),
                    n = p * c + k - 1,
                    b[n] = (b[n] || 0) + d * d
        }
          , o = function(a, b) {
            b = b >> 0 || 6;
            var c, d, e, f, g = [], h = [], i = 0, j = 0, k = b - 1, l = [], m = [];
            for (c in a)
                n(a[c], g, b);
            for (e = g.length,
            d = 0; e > d; d++)
                i += Math.sqrt(g[d]),
                f = d % b,
                m[f] = i,
                f === k && (j += i,
                f = d / b >> 0,
                l[f] = m,
                h[f] = j,
                i = 0,
                m = []);
            return {
                length: j,
                lengths: h,
                segments: l
            }
        }
          , p = _gsScope._gsDefine.plugin({
            propName: "bezier",
            priority: -1,
            version: "1.3.7",
            API: 2,
            global: !0,
            init: function(a, b, c) {
                this._target = a,
                b instanceof Array && (b = {
                    values: b
                }),
                this._func = {},
                this._mod = {},
                this._props = [],
                this._timeRes = null == b.timeResolution ? 6 : parseInt(b.timeResolution, 10);
                var d, e, f, g, h, i = b.values || [], j = {}, k = i[0], n = b.autoRotate || c.vars.orientToBezier;
                this._autoRotate = n ? n instanceof Array ? n : [["x", "y", "rotation", n === !0 ? 0 : Number(n) || 0]] : null;
                for (d in k)
                    this._props.push(d);
                for (f = this._props.length; --f > -1; )
                    d = this._props[f],
                    this._overwriteProps.push(d),
                    e = this._func[d] = "function" == typeof a[d],
                    j[d] = e ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d : "get" + d.substr(3)]() : parseFloat(a[d]),
                    h || j[d] !== i[0][d] && (h = j);
                if (this._beziers = "cubic" !== b.type && "quadratic" !== b.type && "soft" !== b.type ? l(i, isNaN(b.curviness) ? 1 : b.curviness, !1, "thruBasic" === b.type, b.correlate, h) : m(i, b.type, j),
                this._segCount = this._beziers[d].length,
                this._timeRes) {
                    var p = o(this._beziers, this._timeRes);
                    this._length = p.length,
                    this._lengths = p.lengths,
                    this._segments = p.segments,
                    this._l1 = this._li = this._s1 = this._si = 0,
                    this._l2 = this._lengths[0],
                    this._curSeg = this._segments[0],
                    this._s2 = this._curSeg[0],
                    this._prec = 1 / this._curSeg.length
                }
                if (n = this._autoRotate)
                    for (this._initialRotations = [],
                    n[0]instanceof Array || (this._autoRotate = n = [n]),
                    f = n.length; --f > -1; ) {
                        for (g = 0; 3 > g; g++)
                            d = n[f][g],
                            this._func[d] = "function" == typeof a[d] ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d : "get" + d.substr(3)] : !1;
                        d = n[f][2],
                        this._initialRotations[f] = (this._func[d] ? this._func[d].call(this._target) : this._target[d]) || 0,
                        this._overwriteProps.push(d)
                    }
                return this._startRatio = c.vars.runBackwards ? 1 : 0,
                !0
            },
            set: function(b) {
                var c, d, e, f, g, h, i, j, k, l, m = this._segCount, n = this._func, o = this._target, p = b !== this._startRatio;
                if (this._timeRes) {
                    if (k = this._lengths,
                    l = this._curSeg,
                    b *= this._length,
                    e = this._li,
                    b > this._l2 && m - 1 > e) {
                        for (j = m - 1; j > e && (this._l2 = k[++e]) <= b; )
                            ;
                        this._l1 = k[e - 1],
                        this._li = e,
                        this._curSeg = l = this._segments[e],
                        this._s2 = l[this._s1 = this._si = 0]
                    } else if (b < this._l1 && e > 0) {
                        for (; e > 0 && (this._l1 = k[--e]) >= b; )
                            ;
                        0 === e && b < this._l1 ? this._l1 = 0 : e++,
                        this._l2 = k[e],
                        this._li = e,
                        this._curSeg = l = this._segments[e],
                        this._s1 = l[(this._si = l.length - 1) - 1] || 0,
                        this._s2 = l[this._si]
                    }
                    if (c = e,
                    b -= this._l1,
                    e = this._si,
                    b > this._s2 && e < l.length - 1) {
                        for (j = l.length - 1; j > e && (this._s2 = l[++e]) <= b; )
                            ;
                        this._s1 = l[e - 1],
                        this._si = e
                    } else if (b < this._s1 && e > 0) {
                        for (; e > 0 && (this._s1 = l[--e]) >= b; )
                            ;
                        0 === e && b < this._s1 ? this._s1 = 0 : e++,
                        this._s2 = l[e],
                        this._si = e
                    }
                    h = (e + (b - this._s1) / (this._s2 - this._s1)) * this._prec || 0
                } else
                    c = 0 > b ? 0 : b >= 1 ? m - 1 : m * b >> 0,
                    h = (b - c * (1 / m)) * m;
                for (d = 1 - h,
                e = this._props.length; --e > -1; )
                    f = this._props[e],
                    g = this._beziers[f][c],
                    i = (h * h * g.da + 3 * d * (h * g.ca + d * g.ba)) * h + g.a,
                    this._mod[f] && (i = this._mod[f](i, o)),
                    n[f] ? o[f](i) : o[f] = i;
                if (this._autoRotate) {
                    var q, r, s, t, u, v, w, x = this._autoRotate;
                    for (e = x.length; --e > -1; )
                        f = x[e][2],
                        v = x[e][3] || 0,
                        w = x[e][4] === !0 ? 1 : a,
                        g = this._beziers[x[e][0]],
                        q = this._beziers[x[e][1]],
                        g && q && (g = g[c],
                        q = q[c],
                        r = g.a + (g.b - g.a) * h,
                        t = g.b + (g.c - g.b) * h,
                        r += (t - r) * h,
                        t += (g.c + (g.d - g.c) * h - t) * h,
                        s = q.a + (q.b - q.a) * h,
                        u = q.b + (q.c - q.b) * h,
                        s += (u - s) * h,
                        u += (q.c + (q.d - q.c) * h - u) * h,
                        i = p ? Math.atan2(u - s, t - r) * w + v : this._initialRotations[e],
                        this._mod[f] && (i = this._mod[f](i, o)),
                        n[f] ? o[f](i) : o[f] = i)
                }
            }
        })
          , q = p.prototype;
        p.bezierThrough = l,
        p.cubicToQuadratic = i,
        p._autoCSS = !0,
        p.quadraticToCubic = function(a, b, c) {
            return new g(a,(2 * b + a) / 3,(2 * b + c) / 3,c)
        }
        ,
        p._cssRegister = function() {
            var a = f.CSSPlugin;
            if (a) {
                var b = a._internals
                  , c = b._parseToProxy
                  , d = b._setPluginRatio
                  , e = b.CSSPropTween;
                b._registerComplexSpecialProp("bezier", {
                    parser: function(a, b, f, g, h, i) {
                        b instanceof Array && (b = {
                            values: b
                        }),
                        i = new p;
                        var j, k, l, m = b.values, n = m.length - 1, o = [], q = {};
                        if (0 > n)
                            return h;
                        for (j = 0; n >= j; j++)
                            l = c(a, m[j], g, h, i, n !== j),
                            o[j] = l.end;
                        for (k in b)
                            q[k] = b[k];
                        return q.values = o,
                        h = new e(a,"bezier",0,0,l.pt,2),
                        h.data = l,
                        h.plugin = i,
                        h.setRatio = d,
                        0 === q.autoRotate && (q.autoRotate = !0),
                        !q.autoRotate || q.autoRotate instanceof Array || (j = q.autoRotate === !0 ? 0 : Number(q.autoRotate),
                        q.autoRotate = null != l.end.left ? [["left", "top", "rotation", j, !1]] : null != l.end.x ? [["x", "y", "rotation", j, !1]] : !1),
                        q.autoRotate && (g._transform || g._enableTransforms(!1),
                        l.autoRotate = g._target._gsTransform,
                        l.proxy.rotation = l.autoRotate.rotation || 0,
                        g._overwriteProps.push("rotation")),
                        i._onInitTween(l.proxy, q, g._tween),
                        h
                    }
                })
            }
        }
        ,
        q._mod = function(a) {
            for (var b, c = this._overwriteProps, d = c.length; --d > -1; )
                b = a[c[d]],
                b && "function" == typeof b && (this._mod[c[d]] = b)
        }
        ,
        q._kill = function(a) {
            var b, c, d = this._props;
            for (b in this._beziers)
                if (b in a)
                    for (delete this._beziers[b],
                    delete this._func[b],
                    c = d.length; --c > -1; )
                        d[c] === b && d.splice(c, 1);
            if (d = this._autoRotate)
                for (c = d.length; --c > -1; )
                    a[d[c][2]] && d.splice(c, 1);
            return this._super._kill.call(this, a)
        }
    }(),
    _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(a, b) {
        var c, d, e, f, g = function() {
            a.call(this, "css"),
            this._overwriteProps.length = 0,
            this.setRatio = g.prototype.setRatio
        }, h = _gsScope._gsDefine.globals, i = {}, j = g.prototype = new a("css");
        j.constructor = g,
        g.version = "1.19.1",
        g.API = 2,
        g.defaultTransformPerspective = 0,
        g.defaultSkewType = "compensated",
        g.defaultSmoothOrigin = !0,
        j = "px",
        g.suffixMap = {
            top: j,
            right: j,
            bottom: j,
            left: j,
            width: j,
            height: j,
            fontSize: j,
            padding: j,
            margin: j,
            perspective: j,
            lineHeight: ""
        };
        var k, l, m, n, o, p, q, r, s = /(?:\-|\.|\b)(\d|\.|e\-)+/g, t = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g, u = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, v = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, w = /(?:\d|\-|\+|=|#|\.)*/g, x = /opacity *= *([^)]*)/i, y = /opacity:([^;]*)/i, z = /alpha\(opacity *=.+?\)/i, A = /^(rgb|hsl)/, B = /([A-Z])/g, C = /-([a-z])/gi, D = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, E = function(a, b) {
            return b.toUpperCase()
        }, F = /(?:Left|Right|Width)/i, G = /(M11|M12|M21|M22)=[\d\-\.e]+/gi, H = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, I = /,(?=[^\)]*(?:\(|$))/gi, J = /[\s,\(]/i, K = Math.PI / 180, L = 180 / Math.PI, M = {}, N = {
            style: {}
        }, O = _gsScope.document || {
            createElement: function() {
                return N
            }
        }, P = function(a, b) {
            return O.createElementNS ? O.createElementNS(b || "http://www.w3.org/1999/xhtml", a) : O.createElement(a)
        }, Q = P("div"), R = P("img"), S = g._internals = {
            _specialProps: i
        }, T = (_gsScope.navigator || {}).userAgent || "", U = function() {
            var a = T.indexOf("Android")
              , b = P("a");
            return m = -1 !== T.indexOf("Safari") && -1 === T.indexOf("Chrome") && (-1 === a || parseFloat(T.substr(a + 8, 2)) > 3),
            o = m && parseFloat(T.substr(T.indexOf("Version/") + 8, 2)) < 6,
            n = -1 !== T.indexOf("Firefox"),
            (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(T) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(T)) && (p = parseFloat(RegExp.$1)),
            b ? (b.style.cssText = "top:1px;opacity:.55;",
            /^0.55/.test(b.style.opacity)) : !1
        }(), V = function(a) {
            return x.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
        }, W = function(a) {
            _gsScope.console && console.log(a)
        }, X = "", Y = "", Z = function(a, b) {
            b = b || Q;
            var c, d, e = b.style;
            if (void 0 !== e[a])
                return a;
            for (a = a.charAt(0).toUpperCase() + a.substr(1),
            c = ["O", "Moz", "ms", "Ms", "Webkit"],
            d = 5; --d > -1 && void 0 === e[c[d] + a]; )
                ;
            return d >= 0 ? (Y = 3 === d ? "ms" : c[d],
            X = "-" + Y.toLowerCase() + "-",
            Y + a) : null
        }, $ = O.defaultView ? O.defaultView.getComputedStyle : function() {}
        , _ = g.getStyle = function(a, b, c, d, e) {
            var f;
            return U || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || $(a)) ? f = c[b] || c.getPropertyValue(b) || c.getPropertyValue(b.replace(B, "-$1").toLowerCase()) : a.currentStyle && (f = a.currentStyle[b]),
            null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f : e) : V(a)
        }
        , aa = S.convertToPixels = function(a, c, d, e, f) {
            if ("px" === e || !e)
                return d;
            if ("auto" === e || !d)
                return 0;
            var h, i, j, k = F.test(c), l = a, m = Q.style, n = 0 > d, o = 1 === d;
            if (n && (d = -d),
            o && (d *= 100),
            "%" === e && -1 !== c.indexOf("border"))
                h = d / 100 * (k ? a.clientWidth : a.clientHeight);
            else {
                if (m.cssText = "border:0 solid red;position:" + _(a, "position") + ";line-height:0;",
                "%" !== e && l.appendChild && "v" !== e.charAt(0) && "rem" !== e)
                    m[k ? "borderLeftWidth" : "borderTopWidth"] = d + e;
                else {
                    if (l = a.parentNode || O.body,
                    i = l._gsCache,
                    j = b.ticker.frame,
                    i && k && i.time === j)
                        return i.width * d / 100;
                    m[k ? "width" : "height"] = d + e
                }
                l.appendChild(Q),
                h = parseFloat(Q[k ? "offsetWidth" : "offsetHeight"]),
                l.removeChild(Q),
                k && "%" === e && g.cacheWidths !== !1 && (i = l._gsCache = l._gsCache || {},
                i.time = j,
                i.width = h / d * 100),
                0 !== h || f || (h = aa(a, c, d, e, !0))
            }
            return o && (h /= 100),
            n ? -h : h
        }
        , ba = S.calculateOffset = function(a, b, c) {
            if ("absolute" !== _(a, "position", c))
                return 0;
            var d = "left" === b ? "Left" : "Top"
              , e = _(a, "margin" + d, c);
            return a["offset" + d] - (aa(a, b, parseFloat(e), e.replace(w, "")) || 0)
        }
        , ca = function(a, b) {
            var c, d, e, f = {};
            if (b = b || $(a, null))
                if (c = b.length)
                    for (; --c > -1; )
                        e = b[c],
                        (-1 === e.indexOf("-transform") || Da === e) && (f[e.replace(C, E)] = b.getPropertyValue(e));
                else
                    for (c in b)
                        (-1 === c.indexOf("Transform") || Ca === c) && (f[c] = b[c]);
            else if (b = a.currentStyle || a.style)
                for (c in b)
                    "string" == typeof c && void 0 === f[c] && (f[c.replace(C, E)] = b[c]);
            return U || (f.opacity = V(a)),
            d = Ra(a, b, !1),
            f.rotation = d.rotation,
            f.skewX = d.skewX,
            f.scaleX = d.scaleX,
            f.scaleY = d.scaleY,
            f.x = d.x,
            f.y = d.y,
            Fa && (f.z = d.z,
            f.rotationX = d.rotationX,
            f.rotationY = d.rotationY,
            f.scaleZ = d.scaleZ),
            f.filters && delete f.filters,
            f
        }, da = function(a, b, c, d, e) {
            var f, g, h, i = {}, j = a.style;
            for (g in c)
                "cssText" !== g && "length" !== g && isNaN(g) && (b[g] !== (f = c[g]) || e && e[g]) && -1 === g.indexOf("Origin") && ("number" == typeof f || "string" == typeof f) && (i[g] = "auto" !== f || "left" !== g && "top" !== g ? "" !== f && "auto" !== f && "none" !== f || "string" != typeof b[g] || "" === b[g].replace(v, "") ? f : 0 : ba(a, g),
                void 0 !== j[g] && (h = new sa(j,g,j[g],h)));
            if (d)
                for (g in d)
                    "className" !== g && (i[g] = d[g]);
            return {
                difs: i,
                firstMPT: h
            }
        }, ea = {
            width: ["Left", "Right"],
            height: ["Top", "Bottom"]
        }, fa = ["marginLeft", "marginRight", "marginTop", "marginBottom"], ga = function(a, b, c) {
            if ("svg" === (a.nodeName + "").toLowerCase())
                return (c || $(a))[b] || 0;
            if (a.getCTM && Oa(a))
                return a.getBBox()[b] || 0;
            var d = parseFloat("width" === b ? a.offsetWidth : a.offsetHeight)
              , e = ea[b]
              , f = e.length;
            for (c = c || $(a, null); --f > -1; )
                d -= parseFloat(_(a, "padding" + e[f], c, !0)) || 0,
                d -= parseFloat(_(a, "border" + e[f] + "Width", c, !0)) || 0;
            return d
        }, ha = function(a, b) {
            if ("contain" === a || "auto" === a || "auto auto" === a)
                return a + " ";
            (null == a || "" === a) && (a = "0 0");
            var c, d = a.split(" "), e = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : d[0], f = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : d[1];
            if (d.length > 3 && !b) {
                for (d = a.split(", ").join(",").split(","),
                a = [],
                c = 0; c < d.length; c++)
                    a.push(ha(d[c]));
                return a.join(",")
            }
            return null == f ? f = "center" === e ? "50%" : "0" : "center" === f && (f = "50%"),
            ("center" === e || isNaN(parseFloat(e)) && -1 === (e + "").indexOf("=")) && (e = "50%"),
            a = e + " " + f + (d.length > 2 ? " " + d[2] : ""),
            b && (b.oxp = -1 !== e.indexOf("%"),
            b.oyp = -1 !== f.indexOf("%"),
            b.oxr = "=" === e.charAt(1),
            b.oyr = "=" === f.charAt(1),
            b.ox = parseFloat(e.replace(v, "")),
            b.oy = parseFloat(f.replace(v, "")),
            b.v = a),
            b || a
        }, ia = function(a, b) {
            return "function" == typeof a && (a = a(r, q)),
            "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b) || 0
        }, ja = function(a, b) {
            return "function" == typeof a && (a = a(r, q)),
            null == a ? b : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) + b : parseFloat(a) || 0
        }, ka = function(a, b, c, d) {
            var e, f, g, h, i, j = 1e-6;
            return "function" == typeof a && (a = a(r, q)),
            null == a ? h = b : "number" == typeof a ? h = a : (e = 360,
            f = a.split("_"),
            i = "=" === a.charAt(1),
            g = (i ? parseInt(a.charAt(0) + "1", 10) * parseFloat(f[0].substr(2)) : parseFloat(f[0])) * (-1 === a.indexOf("rad") ? 1 : L) - (i ? 0 : b),
            f.length && (d && (d[c] = b + g),
            -1 !== a.indexOf("short") && (g %= e,
            g !== g % (e / 2) && (g = 0 > g ? g + e : g - e)),
            -1 !== a.indexOf("_cw") && 0 > g ? g = (g + 9999999999 * e) % e - (g / e | 0) * e : -1 !== a.indexOf("ccw") && g > 0 && (g = (g - 9999999999 * e) % e - (g / e | 0) * e)),
            h = b + g),
            j > h && h > -j && (h = 0),
            h
        }, la = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0]
        }, ma = function(a, b, c) {
            return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a,
            255 * (1 > 6 * a ? b + (c - b) * a * 6 : .5 > a ? c : 2 > 3 * a ? b + (c - b) * (2 / 3 - a) * 6 : b) + .5 | 0
        }, na = g.parseColor = function(a, b) {
            var c, d, e, f, g, h, i, j, k, l, m;
            if (a)
                if ("number" == typeof a)
                    c = [a >> 16, a >> 8 & 255, 255 & a];
                else {
                    if ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)),
                    la[a])
                        c = la[a];
                    else if ("#" === a.charAt(0))
                        4 === a.length && (d = a.charAt(1),
                        e = a.charAt(2),
                        f = a.charAt(3),
                        a = "#" + d + d + e + e + f + f),
                        a = parseInt(a.substr(1), 16),
                        c = [a >> 16, a >> 8 & 255, 255 & a];
                    else if ("hsl" === a.substr(0, 3))
                        if (c = m = a.match(s),
                        b) {
                            if (-1 !== a.indexOf("="))
                                return a.match(t)
                        } else
                            g = Number(c[0]) % 360 / 360,
                            h = Number(c[1]) / 100,
                            i = Number(c[2]) / 100,
                            e = .5 >= i ? i * (h + 1) : i + h - i * h,
                            d = 2 * i - e,
                            c.length > 3 && (c[3] = Number(a[3])),
                            c[0] = ma(g + 1 / 3, d, e),
                            c[1] = ma(g, d, e),
                            c[2] = ma(g - 1 / 3, d, e);
                    else
                        c = a.match(s) || la.transparent;
                    c[0] = Number(c[0]),
                    c[1] = Number(c[1]),
                    c[2] = Number(c[2]),
                    c.length > 3 && (c[3] = Number(c[3]))
                }
            else
                c = la.black;
            return b && !m && (d = c[0] / 255,
            e = c[1] / 255,
            f = c[2] / 255,
            j = Math.max(d, e, f),
            k = Math.min(d, e, f),
            i = (j + k) / 2,
            j === k ? g = h = 0 : (l = j - k,
            h = i > .5 ? l / (2 - j - k) : l / (j + k),
            g = j === d ? (e - f) / l + (f > e ? 6 : 0) : j === e ? (f - d) / l + 2 : (d - e) / l + 4,
            g *= 60),
            c[0] = g + .5 | 0,
            c[1] = 100 * h + .5 | 0,
            c[2] = 100 * i + .5 | 0),
            c
        }
        , oa = function(a, b) {
            var c, d, e, f = a.match(pa) || [], g = 0, h = f.length ? "" : a;
            for (c = 0; c < f.length; c++)
                d = f[c],
                e = a.substr(g, a.indexOf(d, g) - g),
                g += e.length + d.length,
                d = na(d, b),
                3 === d.length && d.push(1),
                h += e + (b ? "hsla(" + d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : "rgba(" + d.join(",")) + ")";
            return h + a.substr(g)
        }, pa = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
        for (j in la)
            pa += "|" + j + "\\b";
        pa = new RegExp(pa + ")","gi"),
        g.colorStringFilter = function(a) {
            var b, c = a[0] + a[1];
            pa.test(c) && (b = -1 !== c.indexOf("hsl(") || -1 !== c.indexOf("hsla("),
            a[0] = oa(a[0], b),
            a[1] = oa(a[1], b)),
            pa.lastIndex = 0
        }
        ,
        b.defaultStringFilter || (b.defaultStringFilter = g.colorStringFilter);
        var qa = function(a, b, c, d) {
            if (null == a)
                return function(a) {
                    return a
                }
                ;
            var e, f = b ? (a.match(pa) || [""])[0] : "", g = a.split(f).join("").match(u) || [], h = a.substr(0, a.indexOf(g[0])), i = ")" === a.charAt(a.length - 1) ? ")" : "", j = -1 !== a.indexOf(" ") ? " " : ",", k = g.length, l = k > 0 ? g[0].replace(s, "") : "";
            return k ? e = b ? function(a) {
                var b, m, n, o;
                if ("number" == typeof a)
                    a += l;
                else if (d && I.test(a)) {
                    for (o = a.replace(I, "|").split("|"),
                    n = 0; n < o.length; n++)
                        o[n] = e(o[n]);
                    return o.join(",")
                }
                if (b = (a.match(pa) || [f])[0],
                m = a.split(b).join("").match(u) || [],
                n = m.length,
                k > n--)
                    for (; ++n < k; )
                        m[n] = c ? m[(n - 1) / 2 | 0] : g[n];
                return h + m.join(j) + j + b + i + (-1 !== a.indexOf("inset") ? " inset" : "")
            }
            : function(a) {
                var b, f, m;
                if ("number" == typeof a)
                    a += l;
                else if (d && I.test(a)) {
                    for (f = a.replace(I, "|").split("|"),
                    m = 0; m < f.length; m++)
                        f[m] = e(f[m]);
                    return f.join(",")
                }
                if (b = a.match(u) || [],
                m = b.length,
                k > m--)
                    for (; ++m < k; )
                        b[m] = c ? b[(m - 1) / 2 | 0] : g[m];
                return h + b.join(j) + i
            }
            : function(a) {
                return a
            }
        }
          , ra = function(a) {
            return a = a.split(","),
            function(b, c, d, e, f, g, h) {
                var i, j = (c + "").split(" ");
                for (h = {},
                i = 0; 4 > i; i++)
                    h[a[i]] = j[i] = j[i] || j[(i - 1) / 2 >> 0];
                return e.parse(b, h, f, g)
            }
        }
          , sa = (S._setPluginRatio = function(a) {
            this.plugin.setRatio(a);
            for (var b, c, d, e, f, g = this.data, h = g.proxy, i = g.firstMPT, j = 1e-6; i; )
                b = h[i.v],
                i.r ? b = Math.round(b) : j > b && b > -j && (b = 0),
                i.t[i.p] = b,
                i = i._next;
            if (g.autoRotate && (g.autoRotate.rotation = g.mod ? g.mod(h.rotation, this.t) : h.rotation),
            1 === a || 0 === a)
                for (i = g.firstMPT,
                f = 1 === a ? "e" : "b"; i; ) {
                    if (c = i.t,
                    c.type) {
                        if (1 === c.type) {
                            for (e = c.xs0 + c.s + c.xs1,
                            d = 1; d < c.l; d++)
                                e += c["xn" + d] + c["xs" + (d + 1)];
                            c[f] = e
                        }
                    } else
                        c[f] = c.s + c.xs0;
                    i = i._next
                }
        }
        ,
        function(a, b, c, d, e) {
            this.t = a,
            this.p = b,
            this.v = c,
            this.r = e,
            d && (d._prev = this,
            this._next = d)
        }
        )
          , ta = (S._parseToProxy = function(a, b, c, d, e, f) {
            var g, h, i, j, k, l = d, m = {}, n = {}, o = c._transform, p = M;
            for (c._transform = null,
            M = b,
            d = k = c.parse(a, b, d, e),
            M = p,
            f && (c._transform = o,
            l && (l._prev = null,
            l._prev && (l._prev._next = null))); d && d !== l; ) {
                if (d.type <= 1 && (h = d.p,
                n[h] = d.s + d.c,
                m[h] = d.s,
                f || (j = new sa(d,"s",h,j,d.r),
                d.c = 0),
                1 === d.type))
                    for (g = d.l; --g > 0; )
                        i = "xn" + g,
                        h = d.p + "_" + i,
                        n[h] = d.data[i],
                        m[h] = d[i],
                        f || (j = new sa(d,i,h,j,d.rxp[i]));
                d = d._next
            }
            return {
                proxy: m,
                end: n,
                firstMPT: j,
                pt: k
            }
        }
        ,
        S.CSSPropTween = function(a, b, d, e, g, h, i, j, k, l, m) {
            this.t = a,
            this.p = b,
            this.s = d,
            this.c = e,
            this.n = i || b,
            a instanceof ta || f.push(this.n),
            this.r = j,
            this.type = h || 0,
            k && (this.pr = k,
            c = !0),
            this.b = void 0 === l ? d : l,
            this.e = void 0 === m ? d + e : m,
            g && (this._next = g,
            g._prev = this)
        }
        )
          , ua = function(a, b, c, d, e, f) {
            var g = new ta(a,b,c,d - c,e,(-1),f);
            return g.b = c,
            g.e = g.xs0 = d,
            g
        }
          , va = g.parseComplex = function(a, b, c, d, e, f, h, i, j, l) {
            c = c || f || "",
            "function" == typeof d && (d = d(r, q)),
            h = new ta(a,b,0,0,h,l ? 2 : 1,null,(!1),i,c,d),
            d += "",
            e && pa.test(d + c) && (d = [c, d],
            g.colorStringFilter(d),
            c = d[0],
            d = d[1]);
            var m, n, o, p, u, v, w, x, y, z, A, B, C, D = c.split(", ").join(",").split(" "), E = d.split(", ").join(",").split(" "), F = D.length, G = k !== !1;
            for ((-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (D = D.join(" ").replace(I, ", ").split(" "),
            E = E.join(" ").replace(I, ", ").split(" "),
            F = D.length),
            F !== E.length && (D = (f || "").split(" "),
            F = D.length),
            h.plugin = j,
            h.setRatio = l,
            pa.lastIndex = 0,
            m = 0; F > m; m++)
                if (p = D[m],
                u = E[m],
                x = parseFloat(p),
                x || 0 === x)
                    h.appendXtra("", x, ia(u, x), u.replace(t, ""), G && -1 !== u.indexOf("px"), !0);
                else if (e && pa.test(p))
                    B = u.indexOf(")") + 1,
                    B = ")" + (B ? u.substr(B) : ""),
                    C = -1 !== u.indexOf("hsl") && U,
                    p = na(p, C),
                    u = na(u, C),
                    y = p.length + u.length > 6,
                    y && !U && 0 === u[3] ? (h["xs" + h.l] += h.l ? " transparent" : "transparent",
                    h.e = h.e.split(E[m]).join("transparent")) : (U || (y = !1),
                    C ? h.appendXtra(y ? "hsla(" : "hsl(", p[0], ia(u[0], p[0]), ",", !1, !0).appendXtra("", p[1], ia(u[1], p[1]), "%,", !1).appendXtra("", p[2], ia(u[2], p[2]), y ? "%," : "%" + B, !1) : h.appendXtra(y ? "rgba(" : "rgb(", p[0], u[0] - p[0], ",", !0, !0).appendXtra("", p[1], u[1] - p[1], ",", !0).appendXtra("", p[2], u[2] - p[2], y ? "," : B, !0),
                    y && (p = p.length < 4 ? 1 : p[3],
                    h.appendXtra("", p, (u.length < 4 ? 1 : u[3]) - p, B, !1))),
                    pa.lastIndex = 0;
                else if (v = p.match(s)) {
                    if (w = u.match(t),
                    !w || w.length !== v.length)
                        return h;
                    for (o = 0,
                    n = 0; n < v.length; n++)
                        A = v[n],
                        z = p.indexOf(A, o),
                        h.appendXtra(p.substr(o, z - o), Number(A), ia(w[n], A), "", G && "px" === p.substr(z + A.length, 2), 0 === n),
                        o = z + A.length;
                    h["xs" + h.l] += p.substr(o)
                } else
                    h["xs" + h.l] += h.l || h["xs" + h.l] ? " " + u : u;
            if (-1 !== d.indexOf("=") && h.data) {
                for (B = h.xs0 + h.data.s,
                m = 1; m < h.l; m++)
                    B += h["xs" + m] + h.data["xn" + m];
                h.e = B + h["xs" + m]
            }
            return h.l || (h.type = -1,
            h.xs0 = h.e),
            h.xfirst || h
        }
          , wa = 9;
        for (j = ta.prototype,
        j.l = j.pr = 0; --wa > 0; )
            j["xn" + wa] = 0,
            j["xs" + wa] = "";
        j.xs0 = "",
        j._next = j._prev = j.xfirst = j.data = j.plugin = j.setRatio = j.rxp = null,
        j.appendXtra = function(a, b, c, d, e, f) {
            var g = this
              , h = g.l;
            return g["xs" + h] += f && (h || g["xs" + h]) ? " " + a : a || "",
            c || 0 === h || g.plugin ? (g.l++,
            g.type = g.setRatio ? 2 : 1,
            g["xs" + g.l] = d || "",
            h > 0 ? (g.data["xn" + h] = b + c,
            g.rxp["xn" + h] = e,
            g["xn" + h] = b,
            g.plugin || (g.xfirst = new ta(g,"xn" + h,b,c,g.xfirst || g,0,g.n,e,g.pr),
            g.xfirst.xs0 = 0),
            g) : (g.data = {
                s: b + c
            },
            g.rxp = {},
            g.s = b,
            g.c = c,
            g.r = e,
            g)) : (g["xs" + h] += b + (d || ""),
            g)
        }
        ;
        var xa = function(a, b) {
            b = b || {},
            this.p = b.prefix ? Z(a) || a : a,
            i[a] = i[this.p] = this,
            this.format = b.formatter || qa(b.defaultValue, b.color, b.collapsible, b.multi),
            b.parser && (this.parse = b.parser),
            this.clrs = b.color,
            this.multi = b.multi,
            this.keyword = b.keyword,
            this.dflt = b.defaultValue,
            this.pr = b.priority || 0
        }
          , ya = S._registerComplexSpecialProp = function(a, b, c) {
            "object" != typeof b && (b = {
                parser: c
            });
            var d, e, f = a.split(","), g = b.defaultValue;
            for (c = c || [g],
            d = 0; d < f.length; d++)
                b.prefix = 0 === d && b.prefix,
                b.defaultValue = c[d] || g,
                e = new xa(f[d],b)
        }
          , za = S._registerPluginProp = function(a) {
            if (!i[a]) {
                var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                ya(a, {
                    parser: function(a, c, d, e, f, g, j) {
                        var k = h.com.greensock.plugins[b];
                        return k ? (k._cssRegister(),
                        i[d].parse(a, c, d, e, f, g, j)) : (W("Error: " + b + " js file not loaded."),
                        f)
                    }
                })
            }
        }
        ;
        j = xa.prototype,
        j.parseComplex = function(a, b, c, d, e, f) {
            var g, h, i, j, k, l, m = this.keyword;
            if (this.multi && (I.test(c) || I.test(b) ? (h = b.replace(I, "|").split("|"),
            i = c.replace(I, "|").split("|")) : m && (h = [b],
            i = [c])),
            i) {
                for (j = i.length > h.length ? i.length : h.length,
                g = 0; j > g; g++)
                    b = h[g] = h[g] || this.dflt,
                    c = i[g] = i[g] || this.dflt,
                    m && (k = b.indexOf(m),
                    l = c.indexOf(m),
                    k !== l && (-1 === l ? h[g] = h[g].split(m).join("") : -1 === k && (h[g] += " " + m)));
                b = h.join(", "),
                c = i.join(", ")
            }
            return va(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
        }
        ,
        j.parse = function(a, b, c, d, f, g, h) {
            return this.parseComplex(a.style, this.format(_(a, this.p, e, !1, this.dflt)), this.format(b), f, g)
        }
        ,
        g.registerSpecialProp = function(a, b, c) {
            ya(a, {
                parser: function(a, d, e, f, g, h, i) {
                    var j = new ta(a,e,0,0,g,2,e,(!1),c);
                    return j.plugin = h,
                    j.setRatio = b(a, d, f._tween, e),
                    j
                },
                priority: c
            })
        }
        ,
        g.useSVGTransformAttr = !0;
        var Aa, Ba = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","), Ca = Z("transform"), Da = X + "transform", Ea = Z("transformOrigin"), Fa = null !== Z("perspective"), Ga = S.Transform = function() {
            this.perspective = parseFloat(g.defaultTransformPerspective) || 0,
            this.force3D = g.defaultForce3D !== !1 && Fa ? g.defaultForce3D || "auto" : !1
        }
        , Ha = _gsScope.SVGElement, Ia = function(a, b, c) {
            var d, e = O.createElementNS("http://www.w3.org/2000/svg", a), f = /([a-z])([A-Z])/g;
            for (d in c)
                e.setAttributeNS(null, d.replace(f, "$1-$2").toLowerCase(), c[d]);
            return b.appendChild(e),
            e
        }, Ja = O.documentElement || {}, Ka = function() {
            var a, b, c, d = p || /Android/i.test(T) && !_gsScope.chrome;
            return O.createElementNS && !d && (a = Ia("svg", Ja),
            b = Ia("rect", a, {
                width: 100,
                height: 50,
                x: 100
            }),
            c = b.getBoundingClientRect().width,
            b.style[Ea] = "50% 50%",
            b.style[Ca] = "scaleX(0.5)",
            d = c === b.getBoundingClientRect().width && !(n && Fa),
            Ja.removeChild(a)),
            d
        }(), La = function(a, b, c, d, e, f) {
            var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = a._gsTransform, w = Qa(a, !0);
            v && (t = v.xOrigin,
            u = v.yOrigin),
            (!d || (h = d.split(" ")).length < 2) && (n = a.getBBox(),
            0 === n.x && 0 === n.y && n.width + n.height === 0 && (n = {
                x: parseFloat(a.hasAttribute("x") ? a.getAttribute("x") : a.hasAttribute("cx") ? a.getAttribute("cx") : 0) || 0,
                y: parseFloat(a.hasAttribute("y") ? a.getAttribute("y") : a.hasAttribute("cy") ? a.getAttribute("cy") : 0) || 0,
                width: 0,
                height: 0
            }),
            b = ha(b).split(" "),
            h = [(-1 !== b[0].indexOf("%") ? parseFloat(b[0]) / 100 * n.width : parseFloat(b[0])) + n.x, (-1 !== b[1].indexOf("%") ? parseFloat(b[1]) / 100 * n.height : parseFloat(b[1])) + n.y]),
            c.xOrigin = k = parseFloat(h[0]),
            c.yOrigin = l = parseFloat(h[1]),
            d && w !== Pa && (m = w[0],
            n = w[1],
            o = w[2],
            p = w[3],
            q = w[4],
            r = w[5],
            s = m * p - n * o,
            s && (i = k * (p / s) + l * (-o / s) + (o * r - p * q) / s,
            j = k * (-n / s) + l * (m / s) - (m * r - n * q) / s,
            k = c.xOrigin = h[0] = i,
            l = c.yOrigin = h[1] = j)),
            v && (f && (c.xOffset = v.xOffset,
            c.yOffset = v.yOffset,
            v = c),
            e || e !== !1 && g.defaultSmoothOrigin !== !1 ? (i = k - t,
            j = l - u,
            v.xOffset += i * w[0] + j * w[2] - i,
            v.yOffset += i * w[1] + j * w[3] - j) : v.xOffset = v.yOffset = 0),
            f || a.setAttribute("data-svg-origin", h.join(" "))
        }, Ma = function(a) {
            var b, c = P("svg", this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), d = this.parentNode, e = this.nextSibling, f = this.style.cssText;
            if (Ja.appendChild(c),
            c.appendChild(this),
            this.style.display = "block",
            a)
                try {
                    b = this.getBBox(),
                    this._originalGetBBox = this.getBBox,
                    this.getBBox = Ma
                } catch (g) {}
            else
                this._originalGetBBox && (b = this._originalGetBBox());
            return e ? d.insertBefore(this, e) : d.appendChild(this),
            Ja.removeChild(c),
            this.style.cssText = f,
            b
        }, Na = function(a) {
            try {
                return a.getBBox()
            } catch (b) {
                return Ma.call(a, !0)
            }
        }, Oa = function(a) {
            return !(!(Ha && a.getCTM && Na(a)) || a.parentNode && !a.ownerSVGElement)
        }, Pa = [1, 0, 0, 1, 0, 0], Qa = function(a, b) {
            var c, d, e, f, g, h, i = a._gsTransform || new Ga, j = 1e5, k = a.style;
            if (Ca ? d = _(a, Da, null, !0) : a.currentStyle && (d = a.currentStyle.filter.match(G),
            d = d && 4 === d.length ? [d[0].substr(4), Number(d[2].substr(4)), Number(d[1].substr(4)), d[3].substr(4), i.x || 0, i.y || 0].join(",") : ""),
            c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d,
            c && Ca && ((h = "none" === $(a).display) || !a.parentNode) && (h && (f = k.display,
            k.display = "block"),
            a.parentNode || (g = 1,
            Ja.appendChild(a)),
            d = _(a, Da, null, !0),
            c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d,
            f ? k.display = f : h && Va(k, "display"),
            g && Ja.removeChild(a)),
            (i.svg || a.getCTM && Oa(a)) && (c && -1 !== (k[Ca] + "").indexOf("matrix") && (d = k[Ca],
            c = 0),
            e = a.getAttribute("transform"),
            c && e && (-1 !== e.indexOf("matrix") ? (d = e,
            c = 0) : -1 !== e.indexOf("translate") && (d = "matrix(1,0,0,1," + e.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")",
            c = 0))),
            c)
                return Pa;
            for (e = (d || "").match(s) || [],
            wa = e.length; --wa > -1; )
                f = Number(e[wa]),
                e[wa] = (g = f - (f |= 0)) ? (g * j + (0 > g ? -.5 : .5) | 0) / j + f : f;
            return b && e.length > 6 ? [e[0], e[1], e[4], e[5], e[12], e[13]] : e
        }, Ra = S.getTransform = function(a, c, d, e) {
            if (a._gsTransform && d && !e)
                return a._gsTransform;
            var f, h, i, j, k, l, m = d ? a._gsTransform || new Ga : new Ga, n = m.scaleX < 0, o = 2e-5, p = 1e5, q = Fa ? parseFloat(_(a, Ea, c, !1, "0 0 0").split(" ")[2]) || m.zOrigin || 0 : 0, r = parseFloat(g.defaultTransformPerspective) || 0;
            if (m.svg = !(!a.getCTM || !Oa(a)),
            m.svg && (La(a, _(a, Ea, c, !1, "50% 50%") + "", m, a.getAttribute("data-svg-origin")),
            Aa = g.useSVGTransformAttr || Ka),
            f = Qa(a),
            f !== Pa) {
                if (16 === f.length) {
                    var s, t, u, v, w, x = f[0], y = f[1], z = f[2], A = f[3], B = f[4], C = f[5], D = f[6], E = f[7], F = f[8], G = f[9], H = f[10], I = f[12], J = f[13], K = f[14], M = f[11], N = Math.atan2(D, H);
                    m.zOrigin && (K = -m.zOrigin,
                    I = F * K - f[12],
                    J = G * K - f[13],
                    K = H * K + m.zOrigin - f[14]),
                    m.rotationX = N * L,
                    N && (v = Math.cos(-N),
                    w = Math.sin(-N),
                    s = B * v + F * w,
                    t = C * v + G * w,
                    u = D * v + H * w,
                    F = B * -w + F * v,
                    G = C * -w + G * v,
                    H = D * -w + H * v,
                    M = E * -w + M * v,
                    B = s,
                    C = t,
                    D = u),
                    N = Math.atan2(-z, H),
                    m.rotationY = N * L,
                    N && (v = Math.cos(-N),
                    w = Math.sin(-N),
                    s = x * v - F * w,
                    t = y * v - G * w,
                    u = z * v - H * w,
                    G = y * w + G * v,
                    H = z * w + H * v,
                    M = A * w + M * v,
                    x = s,
                    y = t,
                    z = u),
                    N = Math.atan2(y, x),
                    m.rotation = N * L,
                    N && (v = Math.cos(-N),
                    w = Math.sin(-N),
                    x = x * v + B * w,
                    t = y * v + C * w,
                    C = y * -w + C * v,
                    D = z * -w + D * v,
                    y = t),
                    m.rotationX && Math.abs(m.rotationX) + Math.abs(m.rotation) > 359.9 && (m.rotationX = m.rotation = 0,
                    m.rotationY = 180 - m.rotationY),
                    m.scaleX = (Math.sqrt(x * x + y * y) * p + .5 | 0) / p,
                    m.scaleY = (Math.sqrt(C * C + G * G) * p + .5 | 0) / p,
                    m.scaleZ = (Math.sqrt(D * D + H * H) * p + .5 | 0) / p,
                    m.rotationX || m.rotationY ? m.skewX = 0 : (m.skewX = B || C ? Math.atan2(B, C) * L + m.rotation : m.skewX || 0,
                    Math.abs(m.skewX) > 90 && Math.abs(m.skewX) < 270 && (n ? (m.scaleX *= -1,
                    m.skewX += m.rotation <= 0 ? 180 : -180,
                    m.rotation += m.rotation <= 0 ? 180 : -180) : (m.scaleY *= -1,
                    m.skewX += m.skewX <= 0 ? 180 : -180))),
                    m.perspective = M ? 1 / (0 > M ? -M : M) : 0,
                    m.x = I,
                    m.y = J,
                    m.z = K,
                    m.svg && (m.x -= m.xOrigin - (m.xOrigin * x - m.yOrigin * B),
                    m.y -= m.yOrigin - (m.yOrigin * y - m.xOrigin * C))
                } else if (!Fa || e || !f.length || m.x !== f[4] || m.y !== f[5] || !m.rotationX && !m.rotationY) {
                    var O = f.length >= 6
                      , P = O ? f[0] : 1
                      , Q = f[1] || 0
                      , R = f[2] || 0
                      , S = O ? f[3] : 1;
                    m.x = f[4] || 0,
                    m.y = f[5] || 0,
                    i = Math.sqrt(P * P + Q * Q),
                    j = Math.sqrt(S * S + R * R),
                    k = P || Q ? Math.atan2(Q, P) * L : m.rotation || 0,
                    l = R || S ? Math.atan2(R, S) * L + k : m.skewX || 0,
                    Math.abs(l) > 90 && Math.abs(l) < 270 && (n ? (i *= -1,
                    l += 0 >= k ? 180 : -180,
                    k += 0 >= k ? 180 : -180) : (j *= -1,
                    l += 0 >= l ? 180 : -180)),
                    m.scaleX = i,
                    m.scaleY = j,
                    m.rotation = k,
                    m.skewX = l,
                    Fa && (m.rotationX = m.rotationY = m.z = 0,
                    m.perspective = r,
                    m.scaleZ = 1),
                    m.svg && (m.x -= m.xOrigin - (m.xOrigin * P + m.yOrigin * R),
                    m.y -= m.yOrigin - (m.xOrigin * Q + m.yOrigin * S))
                }
                m.zOrigin = q;
                for (h in m)
                    m[h] < o && m[h] > -o && (m[h] = 0)
            }
            return d && (a._gsTransform = m,
            m.svg && (Aa && a.style[Ca] ? b.delayedCall(.001, function() {
                Va(a.style, Ca)
            }) : !Aa && a.getAttribute("transform") && b.delayedCall(.001, function() {
                a.removeAttribute("transform")
            }))),
            m
        }
        , Sa = function(a) {
            var b, c, d = this.data, e = -d.rotation * K, f = e + d.skewX * K, g = 1e5, h = (Math.cos(e) * d.scaleX * g | 0) / g, i = (Math.sin(e) * d.scaleX * g | 0) / g, j = (Math.sin(f) * -d.scaleY * g | 0) / g, k = (Math.cos(f) * d.scaleY * g | 0) / g, l = this.t.style, m = this.t.currentStyle;
            if (m) {
                c = i,
                i = -j,
                j = -c,
                b = m.filter,
                l.filter = "";
                var n, o, q = this.t.offsetWidth, r = this.t.offsetHeight, s = "absolute" !== m.position, t = "progid:DXImageTransform.Microsoft.Matrix(M11=" + h + ", M12=" + i + ", M21=" + j + ", M22=" + k, u = d.x + q * d.xPercent / 100, v = d.y + r * d.yPercent / 100;
                if (null != d.ox && (n = (d.oxp ? q * d.ox * .01 : d.ox) - q / 2,
                o = (d.oyp ? r * d.oy * .01 : d.oy) - r / 2,
                u += n - (n * h + o * i),
                v += o - (n * j + o * k)),
                s ? (n = q / 2,
                o = r / 2,
                t += ", Dx=" + (n - (n * h + o * i) + u) + ", Dy=" + (o - (n * j + o * k) + v) + ")") : t += ", sizingMethod='auto expand')",
                -1 !== b.indexOf("DXImageTransform.Microsoft.Matrix(") ? l.filter = b.replace(H, t) : l.filter = t + " " + b,
                (0 === a || 1 === a) && 1 === h && 0 === i && 0 === j && 1 === k && (s && -1 === t.indexOf("Dx=0, Dy=0") || x.test(b) && 100 !== parseFloat(RegExp.$1) || -1 === b.indexOf(b.indexOf("Alpha")) && l.removeAttribute("filter")),
                !s) {
                    var y, z, A, B = 8 > p ? 1 : -1;
                    for (n = d.ieOffsetX || 0,
                    o = d.ieOffsetY || 0,
                    d.ieOffsetX = Math.round((q - ((0 > h ? -h : h) * q + (0 > i ? -i : i) * r)) / 2 + u),
                    d.ieOffsetY = Math.round((r - ((0 > k ? -k : k) * r + (0 > j ? -j : j) * q)) / 2 + v),
                    wa = 0; 4 > wa; wa++)
                        z = fa[wa],
                        y = m[z],
                        c = -1 !== y.indexOf("px") ? parseFloat(y) : aa(this.t, z, parseFloat(y), y.replace(w, "")) || 0,
                        A = c !== d[z] ? 2 > wa ? -d.ieOffsetX : -d.ieOffsetY : 2 > wa ? n - d.ieOffsetX : o - d.ieOffsetY,
                        l[z] = (d[z] = Math.round(c - A * (0 === wa || 2 === wa ? 1 : B))) + "px"
                }
            }
        }, Ta = S.set3DTransformRatio = S.setTransformRatio = function(a) {
            var b, c, d, e, f, g, h, i, j, k, l, m, o, p, q, r, s, t, u, v, w, x, y, z = this.data, A = this.t.style, B = z.rotation, C = z.rotationX, D = z.rotationY, E = z.scaleX, F = z.scaleY, G = z.scaleZ, H = z.x, I = z.y, J = z.z, L = z.svg, M = z.perspective, N = z.force3D, O = z.skewY, P = z.skewX;
            if (O && (P += O,
            B += O),
            ((1 === a || 0 === a) && "auto" === N && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !N) && !J && !M && !D && !C && 1 === G || Aa && L || !Fa)
                return void (B || P || L ? (B *= K,
                x = P * K,
                y = 1e5,
                c = Math.cos(B) * E,
                f = Math.sin(B) * E,
                d = Math.sin(B - x) * -F,
                g = Math.cos(B - x) * F,
                x && "simple" === z.skewType && (b = Math.tan(x - O * K),
                b = Math.sqrt(1 + b * b),
                d *= b,
                g *= b,
                O && (b = Math.tan(O * K),
                b = Math.sqrt(1 + b * b),
                c *= b,
                f *= b)),
                L && (H += z.xOrigin - (z.xOrigin * c + z.yOrigin * d) + z.xOffset,
                I += z.yOrigin - (z.xOrigin * f + z.yOrigin * g) + z.yOffset,
                Aa && (z.xPercent || z.yPercent) && (q = this.t.getBBox(),
                H += .01 * z.xPercent * q.width,
                I += .01 * z.yPercent * q.height),
                q = 1e-6,
                q > H && H > -q && (H = 0),
                q > I && I > -q && (I = 0)),
                u = (c * y | 0) / y + "," + (f * y | 0) / y + "," + (d * y | 0) / y + "," + (g * y | 0) / y + "," + H + "," + I + ")",
                L && Aa ? this.t.setAttribute("transform", "matrix(" + u) : A[Ca] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + u) : A[Ca] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + E + ",0,0," + F + "," + H + "," + I + ")");
            if (n && (q = 1e-4,
            q > E && E > -q && (E = G = 2e-5),
            q > F && F > -q && (F = G = 2e-5),
            !M || z.z || z.rotationX || z.rotationY || (M = 0)),
            B || P)
                B *= K,
                r = c = Math.cos(B),
                s = f = Math.sin(B),
                P && (B -= P * K,
                r = Math.cos(B),
                s = Math.sin(B),
                "simple" === z.skewType && (b = Math.tan((P - O) * K),
                b = Math.sqrt(1 + b * b),
                r *= b,
                s *= b,
                z.skewY && (b = Math.tan(O * K),
                b = Math.sqrt(1 + b * b),
                c *= b,
                f *= b))),
                d = -s,
                g = r;
            else {
                if (!(D || C || 1 !== G || M || L))
                    return void (A[Ca] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) translate3d(" : "translate3d(") + H + "px," + I + "px," + J + "px)" + (1 !== E || 1 !== F ? " scale(" + E + "," + F + ")" : ""));
                c = g = 1,
                d = f = 0
            }
            k = 1,
            e = h = i = j = l = m = 0,
            o = M ? -1 / M : 0,
            p = z.zOrigin,
            q = 1e-6,
            v = ",",
            w = "0",
            B = D * K,
            B && (r = Math.cos(B),
            s = Math.sin(B),
            i = -s,
            l = o * -s,
            e = c * s,
            h = f * s,
            k = r,
            o *= r,
            c *= r,
            f *= r),
            B = C * K,
            B && (r = Math.cos(B),
            s = Math.sin(B),
            b = d * r + e * s,
            t = g * r + h * s,
            j = k * s,
            m = o * s,
            e = d * -s + e * r,
            h = g * -s + h * r,
            k *= r,
            o *= r,
            d = b,
            g = t),
            1 !== G && (e *= G,
            h *= G,
            k *= G,
            o *= G),
            1 !== F && (d *= F,
            g *= F,
            j *= F,
            m *= F),
            1 !== E && (c *= E,
            f *= E,
            i *= E,
            l *= E),
            (p || L) && (p && (H += e * -p,
            I += h * -p,
            J += k * -p + p),
            L && (H += z.xOrigin - (z.xOrigin * c + z.yOrigin * d) + z.xOffset,
            I += z.yOrigin - (z.xOrigin * f + z.yOrigin * g) + z.yOffset),
            q > H && H > -q && (H = w),
            q > I && I > -q && (I = w),
            q > J && J > -q && (J = 0)),
            u = z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix3d(" : "matrix3d(",
            u += (q > c && c > -q ? w : c) + v + (q > f && f > -q ? w : f) + v + (q > i && i > -q ? w : i),
            u += v + (q > l && l > -q ? w : l) + v + (q > d && d > -q ? w : d) + v + (q > g && g > -q ? w : g),
            C || D || 1 !== G ? (u += v + (q > j && j > -q ? w : j) + v + (q > m && m > -q ? w : m) + v + (q > e && e > -q ? w : e),
            u += v + (q > h && h > -q ? w : h) + v + (q > k && k > -q ? w : k) + v + (q > o && o > -q ? w : o) + v) : u += ",0,0,0,0,1,0,",
            u += H + v + I + v + J + v + (M ? 1 + -J / M : 1) + ")",
            A[Ca] = u
        }
        ;
        j = Ga.prototype,
        j.x = j.y = j.z = j.skewX = j.skewY = j.rotation = j.rotationX = j.rotationY = j.zOrigin = j.xPercent = j.yPercent = j.xOffset = j.yOffset = 0,
        j.scaleX = j.scaleY = j.scaleZ = 1,
        ya("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
            parser: function(a, b, c, d, f, h, i) {
                if (d._lastParsedTransform === i)
                    return f;
                d._lastParsedTransform = i;
                var j, k = i.scale && "function" == typeof i.scale ? i.scale : 0;
                "function" == typeof i[c] && (j = i[c],
                i[c] = b),
                k && (i.scale = k(r, a));
                var l, m, n, o, p, s, t, u, v, w = a._gsTransform, x = a.style, y = 1e-6, z = Ba.length, A = i, B = {}, C = "transformOrigin", D = Ra(a, e, !0, A.parseTransform), E = A.transform && ("function" == typeof A.transform ? A.transform(r, q) : A.transform);
                if (d._transform = D,
                E && "string" == typeof E && Ca)
                    m = Q.style,
                    m[Ca] = E,
                    m.display = "block",
                    m.position = "absolute",
                    O.body.appendChild(Q),
                    l = Ra(Q, null, !1),
                    D.svg && (s = D.xOrigin,
                    t = D.yOrigin,
                    l.x -= D.xOffset,
                    l.y -= D.yOffset,
                    (A.transformOrigin || A.svgOrigin) && (E = {},
                    La(a, ha(A.transformOrigin), E, A.svgOrigin, A.smoothOrigin, !0),
                    s = E.xOrigin,
                    t = E.yOrigin,
                    l.x -= E.xOffset - D.xOffset,
                    l.y -= E.yOffset - D.yOffset),
                    (s || t) && (u = Qa(Q, !0),
                    l.x -= s - (s * u[0] + t * u[2]),
                    l.y -= t - (s * u[1] + t * u[3]))),
                    O.body.removeChild(Q),
                    l.perspective || (l.perspective = D.perspective),
                    null != A.xPercent && (l.xPercent = ja(A.xPercent, D.xPercent)),
                    null != A.yPercent && (l.yPercent = ja(A.yPercent, D.yPercent));
                else if ("object" == typeof A) {
                    if (l = {
                        scaleX: ja(null != A.scaleX ? A.scaleX : A.scale, D.scaleX),
                        scaleY: ja(null != A.scaleY ? A.scaleY : A.scale, D.scaleY),
                        scaleZ: ja(A.scaleZ, D.scaleZ),
                        x: ja(A.x, D.x),
                        y: ja(A.y, D.y),
                        z: ja(A.z, D.z),
                        xPercent: ja(A.xPercent, D.xPercent),
                        yPercent: ja(A.yPercent, D.yPercent),
                        perspective: ja(A.transformPerspective, D.perspective)
                    },
                    p = A.directionalRotation,
                    null != p)
                        if ("object" == typeof p)
                            for (m in p)
                                A[m] = p[m];
                        else
                            A.rotation = p;
                    "string" == typeof A.x && -1 !== A.x.indexOf("%") && (l.x = 0,
                    l.xPercent = ja(A.x, D.xPercent)),
                    "string" == typeof A.y && -1 !== A.y.indexOf("%") && (l.y = 0,
                    l.yPercent = ja(A.y, D.yPercent)),
                    l.rotation = ka("rotation"in A ? A.rotation : "shortRotation"in A ? A.shortRotation + "_short" : "rotationZ"in A ? A.rotationZ : D.rotation, D.rotation, "rotation", B),
                    Fa && (l.rotationX = ka("rotationX"in A ? A.rotationX : "shortRotationX"in A ? A.shortRotationX + "_short" : D.rotationX || 0, D.rotationX, "rotationX", B),
                    l.rotationY = ka("rotationY"in A ? A.rotationY : "shortRotationY"in A ? A.shortRotationY + "_short" : D.rotationY || 0, D.rotationY, "rotationY", B)),
                    l.skewX = ka(A.skewX, D.skewX),
                    l.skewY = ka(A.skewY, D.skewY)
                }
                for (Fa && null != A.force3D && (D.force3D = A.force3D,
                o = !0),
                D.skewType = A.skewType || D.skewType || g.defaultSkewType,
                n = D.force3D || D.z || D.rotationX || D.rotationY || l.z || l.rotationX || l.rotationY || l.perspective,
                n || null == A.scale || (l.scaleZ = 1); --z > -1; )
                    v = Ba[z],
                    E = l[v] - D[v],
                    (E > y || -y > E || null != A[v] || null != M[v]) && (o = !0,
                    f = new ta(D,v,D[v],E,f),
                    v in B && (f.e = B[v]),
                    f.xs0 = 0,
                    f.plugin = h,
                    d._overwriteProps.push(f.n));
                return E = A.transformOrigin,
                D.svg && (E || A.svgOrigin) && (s = D.xOffset,
                t = D.yOffset,
                La(a, ha(E), l, A.svgOrigin, A.smoothOrigin),
                f = ua(D, "xOrigin", (w ? D : l).xOrigin, l.xOrigin, f, C),
                f = ua(D, "yOrigin", (w ? D : l).yOrigin, l.yOrigin, f, C),
                (s !== D.xOffset || t !== D.yOffset) && (f = ua(D, "xOffset", w ? s : D.xOffset, D.xOffset, f, C),
                f = ua(D, "yOffset", w ? t : D.yOffset, D.yOffset, f, C)),
                E = "0px 0px"),
                (E || Fa && n && D.zOrigin) && (Ca ? (o = !0,
                v = Ea,
                E = (E || _(a, v, e, !1, "50% 50%")) + "",
                f = new ta(x,v,0,0,f,(-1),C),
                f.b = x[v],
                f.plugin = h,
                Fa ? (m = D.zOrigin,
                E = E.split(" "),
                D.zOrigin = (E.length > 2 && (0 === m || "0px" !== E[2]) ? parseFloat(E[2]) : m) || 0,
                f.xs0 = f.e = E[0] + " " + (E[1] || "50%") + " 0px",
                f = new ta(D,"zOrigin",0,0,f,(-1),f.n),
                f.b = m,
                f.xs0 = f.e = D.zOrigin) : f.xs0 = f.e = E) : ha(E + "", D)),
                o && (d._transformType = D.svg && Aa || !n && 3 !== this._transformType ? 2 : 3),
                j && (i[c] = j),
                k && (i.scale = k),
                f
            },
            prefix: !0
        }),
        ya("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: !0,
            color: !0,
            multi: !0,
            keyword: "inset"
        }),
        ya("borderRadius", {
            defaultValue: "0px",
            parser: function(a, b, c, f, g, h) {
                b = this.format(b);
                var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], z = a.style;
                for (q = parseFloat(a.offsetWidth),
                r = parseFloat(a.offsetHeight),
                i = b.split(" "),
                j = 0; j < y.length; j++)
                    this.p.indexOf("border") && (y[j] = Z(y[j])),
                    m = l = _(a, y[j], e, !1, "0px"),
                    -1 !== m.indexOf(" ") && (l = m.split(" "),
                    m = l[0],
                    l = l[1]),
                    n = k = i[j],
                    o = parseFloat(m),
                    t = m.substr((o + "").length),
                    u = "=" === n.charAt(1),
                    u ? (p = parseInt(n.charAt(0) + "1", 10),
                    n = n.substr(2),
                    p *= parseFloat(n),
                    s = n.substr((p + "").length - (0 > p ? 1 : 0)) || "") : (p = parseFloat(n),
                    s = n.substr((p + "").length)),
                    "" === s && (s = d[c] || t),
                    s !== t && (v = aa(a, "borderLeft", o, t),
                    w = aa(a, "borderTop", o, t),
                    "%" === s ? (m = v / q * 100 + "%",
                    l = w / r * 100 + "%") : "em" === s ? (x = aa(a, "borderLeft", 1, "em"),
                    m = v / x + "em",
                    l = w / x + "em") : (m = v + "px",
                    l = w + "px"),
                    u && (n = parseFloat(m) + p + s,
                    k = parseFloat(l) + p + s)),
                    g = va(z, y[j], m + " " + l, n + " " + k, !1, "0px", g);
                return g
            },
            prefix: !0,
            formatter: qa("0px 0px 0px 0px", !1, !0)
        }),
        ya("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
            defaultValue: "0px",
            parser: function(a, b, c, d, f, g) {
                return va(a.style, c, this.format(_(a, c, e, !1, "0px 0px")), this.format(b), !1, "0px", f)
            },
            prefix: !0,
            formatter: qa("0px 0px", !1, !0)
        }),
        ya("backgroundPosition", {
            defaultValue: "0 0",
            parser: function(a, b, c, d, f, g) {
                var h, i, j, k, l, m, n = "background-position", o = e || $(a, null), q = this.format((o ? p ? o.getPropertyValue(n + "-x") + " " + o.getPropertyValue(n + "-y") : o.getPropertyValue(n) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"), r = this.format(b);
                if (-1 !== q.indexOf("%") != (-1 !== r.indexOf("%")) && r.split(",").length < 2 && (m = _(a, "backgroundImage").replace(D, ""),
                m && "none" !== m)) {
                    for (h = q.split(" "),
                    i = r.split(" "),
                    R.setAttribute("src", m),
                    j = 2; --j > -1; )
                        q = h[j],
                        k = -1 !== q.indexOf("%"),
                        k !== (-1 !== i[j].indexOf("%")) && (l = 0 === j ? a.offsetWidth - R.width : a.offsetHeight - R.height,
                        h[j] = k ? parseFloat(q) / 100 * l + "px" : parseFloat(q) / l * 100 + "%");
                    q = h.join(" ")
                }
                return this.parseComplex(a.style, q, r, f, g)
            },
            formatter: ha
        }),
        ya("backgroundSize", {
            defaultValue: "0 0",
            formatter: function(a) {
                return a += "",
                ha(-1 === a.indexOf(" ") ? a + " " + a : a)
            }
        }),
        ya("perspective", {
            defaultValue: "0px",
            prefix: !0
        }),
        ya("perspectiveOrigin", {
            defaultValue: "50% 50%",
            prefix: !0
        }),
        ya("transformStyle", {
            prefix: !0
        }),
        ya("backfaceVisibility", {
            prefix: !0
        }),
        ya("userSelect", {
            prefix: !0
        }),
        ya("margin", {
            parser: ra("marginTop,marginRight,marginBottom,marginLeft")
        }),
        ya("padding", {
            parser: ra("paddingTop,paddingRight,paddingBottom,paddingLeft")
        }),
        ya("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function(a, b, c, d, f, g) {
                var h, i, j;
                return 9 > p ? (i = a.currentStyle,
                j = 8 > p ? " " : ",",
                h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")",
                b = this.format(b).split(",").join(j)) : (h = this.format(_(a, this.p, e, !1, this.dflt)),
                b = this.format(b)),
                this.parseComplex(a.style, h, b, f, g)
            }
        }),
        ya("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: !0,
            multi: !0
        }),
        ya("autoRound,strictUnits", {
            parser: function(a, b, c, d, e) {
                return e
            }
        }),
        ya("border", {
            defaultValue: "0px solid #000",
            parser: function(a, b, c, d, f, g) {
                var h = _(a, "borderTopWidth", e, !1, "0px")
                  , i = this.format(b).split(" ")
                  , j = i[0].replace(w, "");
                return "px" !== j && (h = parseFloat(h) / aa(a, "borderTopWidth", 1, j) + j),
                this.parseComplex(a.style, this.format(h + " " + _(a, "borderTopStyle", e, !1, "solid") + " " + _(a, "borderTopColor", e, !1, "#000")), i.join(" "), f, g)
            },
            color: !0,
            formatter: function(a) {
                var b = a.split(" ");
                return b[0] + " " + (b[1] || "solid") + " " + (a.match(pa) || ["#000"])[0]
            }
        }),
        ya("borderWidth", {
            parser: ra("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
        }),
        ya("float,cssFloat,styleFloat", {
            parser: function(a, b, c, d, e, f) {
                var g = a.style
                  , h = "cssFloat"in g ? "cssFloat" : "styleFloat";
                return new ta(g,h,0,0,e,(-1),c,(!1),0,g[h],b)
            }
        });
        var Ua = function(a) {
            var b, c = this.t, d = c.filter || _(this.data, "filter") || "", e = this.s + this.c * a | 0;
            100 === e && (-1 === d.indexOf("atrix(") && -1 === d.indexOf("radient(") && -1 === d.indexOf("oader(") ? (c.removeAttribute("filter"),
            b = !_(this.data, "filter")) : (c.filter = d.replace(z, ""),
            b = !0)),
            b || (this.xn1 && (c.filter = d = d || "alpha(opacity=" + e + ")"),
            -1 === d.indexOf("pacity") ? 0 === e && this.xn1 || (c.filter = d + " alpha(opacity=" + e + ")") : c.filter = d.replace(x, "opacity=" + e))
        };
        ya("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function(a, b, c, d, f, g) {
                var h = parseFloat(_(a, "opacity", e, !1, "1"))
                  , i = a.style
                  , j = "autoAlpha" === c;
                return "string" == typeof b && "=" === b.charAt(1) && (b = ("-" === b.charAt(0) ? -1 : 1) * parseFloat(b.substr(2)) + h),
                j && 1 === h && "hidden" === _(a, "visibility", e) && 0 !== b && (h = 0),
                U ? f = new ta(i,"opacity",h,b - h,f) : (f = new ta(i,"opacity",100 * h,100 * (b - h),f),
                f.xn1 = j ? 1 : 0,
                i.zoom = 1,
                f.type = 2,
                f.b = "alpha(opacity=" + f.s + ")",
                f.e = "alpha(opacity=" + (f.s + f.c) + ")",
                f.data = a,
                f.plugin = g,
                f.setRatio = Ua),
                j && (f = new ta(i,"visibility",0,0,f,(-1),null,(!1),0,0 !== h ? "inherit" : "hidden",0 === b ? "hidden" : "inherit"),
                f.xs0 = "inherit",
                d._overwriteProps.push(f.n),
                d._overwriteProps.push(c)),
                f
            }
        });
        var Va = function(a, b) {
            b && (a.removeProperty ? (("ms" === b.substr(0, 2) || "webkit" === b.substr(0, 6)) && (b = "-" + b),
            a.removeProperty(b.replace(B, "-$1").toLowerCase())) : a.removeAttribute(b))
        }
          , Wa = function(a) {
            if (this.t._gsClassPT = this,
            1 === a || 0 === a) {
                this.t.setAttribute("class", 0 === a ? this.b : this.e);
                for (var b = this.data, c = this.t.style; b; )
                    b.v ? c[b.p] = b.v : Va(c, b.p),
                    b = b._next;
                1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null)
            } else
                this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
        };
        ya("className", {
            parser: function(a, b, d, f, g, h, i) {
                var j, k, l, m, n, o = a.getAttribute("class") || "", p = a.style.cssText;
                if (g = f._classNamePT = new ta(a,d,0,0,g,2),
                g.setRatio = Wa,
                g.pr = -11,
                c = !0,
                g.b = o,
                k = ca(a, e),
                l = a._gsClassPT) {
                    for (m = {},
                    n = l.data; n; )
                        m[n.p] = 1,
                        n = n._next;
                    l.setRatio(1)
                }
                return a._gsClassPT = g,
                g.e = "=" !== b.charAt(1) ? b : o.replace(new RegExp("(?:\\s|^)" + b.substr(2) + "(?![\\w-])"), "") + ("+" === b.charAt(0) ? " " + b.substr(2) : ""),
                a.setAttribute("class", g.e),
                j = da(a, k, ca(a), i, m),
                a.setAttribute("class", o),
                g.data = j.firstMPT,
                a.style.cssText = p,
                g = g.xfirst = f.parse(a, j.difs, g, h)
            }
        });
        var Xa = function(a) {
            if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                var b, c, d, e, f, g = this.t.style, h = i.transform.parse;
                if ("all" === this.e)
                    g.cssText = "",
                    e = !0;
                else
                    for (b = this.e.split(" ").join("").split(","),
                    d = b.length; --d > -1; )
                        c = b[d],
                        i[c] && (i[c].parse === h ? e = !0 : c = "transformOrigin" === c ? Ea : i[c].p),
                        Va(g, c);
                e && (Va(g, Ca),
                f = this.t._gsTransform,
                f && (f.svg && (this.t.removeAttribute("data-svg-origin"),
                this.t.removeAttribute("transform")),
                delete this.t._gsTransform))
            }
        };
        for (ya("clearProps", {
            parser: function(a, b, d, e, f) {
                return f = new ta(a,d,0,0,f,2),
                f.setRatio = Xa,
                f.e = b,
                f.pr = -10,
                f.data = e._tween,
                c = !0,
                f
            }
        }),
        j = "bezier,throwProps,physicsProps,physics2D".split(","),
        wa = j.length; wa--; )
            za(j[wa]);
        j = g.prototype,
        j._firstPT = j._lastParsedTransform = j._transform = null,
        j._onInitTween = function(a, b, h, j) {
            if (!a.nodeType)
                return !1;
            this._target = q = a,
            this._tween = h,
            this._vars = b,
            r = j,
            k = b.autoRound,
            c = !1,
            d = b.suffixMap || g.suffixMap,
            e = $(a, ""),
            f = this._overwriteProps;
            var n, p, s, t, u, v, w, x, z, A = a.style;
            if (l && "" === A.zIndex && (n = _(a, "zIndex", e),
            ("auto" === n || "" === n) && this._addLazySet(A, "zIndex", 0)),
            "string" == typeof b && (t = A.cssText,
            n = ca(a, e),
            A.cssText = t + ";" + b,
            n = da(a, n, ca(a)).difs,
            !U && y.test(b) && (n.opacity = parseFloat(RegExp.$1)),
            b = n,
            A.cssText = t),
            b.className ? this._firstPT = p = i.className.parse(a, b.className, "className", this, null, null, b) : this._firstPT = p = this.parse(a, b, null),
            this._transformType) {
                for (z = 3 === this._transformType,
                Ca ? m && (l = !0,
                "" === A.zIndex && (w = _(a, "zIndex", e),
                ("auto" === w || "" === w) && this._addLazySet(A, "zIndex", 0)),
                o && this._addLazySet(A, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (z ? "visible" : "hidden"))) : A.zoom = 1,
                s = p; s && s._next; )
                    s = s._next;
                x = new ta(a,"transform",0,0,null,2),
                this._linkCSSP(x, null, s),
                x.setRatio = Ca ? Ta : Sa,
                x.data = this._transform || Ra(a, e, !0),
                x.tween = h,
                x.pr = -1,
                f.pop()
            }
            if (c) {
                for (; p; ) {
                    for (v = p._next,
                    s = t; s && s.pr > p.pr; )
                        s = s._next;
                    (p._prev = s ? s._prev : u) ? p._prev._next = p : t = p,
                    (p._next = s) ? s._prev = p : u = p,
                    p = v
                }
                this._firstPT = t
            }
            return !0
        }
        ,
        j.parse = function(a, b, c, f) {
            var g, h, j, l, m, n, o, p, s, t, u = a.style;
            for (g in b)
                n = b[g],
                "function" == typeof n && (n = n(r, q)),
                h = i[g],
                h ? c = h.parse(a, n, g, this, c, f, b) : (m = _(a, g, e) + "",
                s = "string" == typeof n,
                "color" === g || "fill" === g || "stroke" === g || -1 !== g.indexOf("Color") || s && A.test(n) ? (s || (n = na(n),
                n = (n.length > 3 ? "rgba(" : "rgb(") + n.join(",") + ")"),
                c = va(u, g, m, n, !0, "transparent", c, 0, f)) : s && J.test(n) ? c = va(u, g, m, n, !0, null, c, 0, f) : (j = parseFloat(m),
                o = j || 0 === j ? m.substr((j + "").length) : "",
                ("" === m || "auto" === m) && ("width" === g || "height" === g ? (j = ga(a, g, e),
                o = "px") : "left" === g || "top" === g ? (j = ba(a, g, e),
                o = "px") : (j = "opacity" !== g ? 0 : 1,
                o = "")),
                t = s && "=" === n.charAt(1),
                t ? (l = parseInt(n.charAt(0) + "1", 10),
                n = n.substr(2),
                l *= parseFloat(n),
                p = n.replace(w, "")) : (l = parseFloat(n),
                p = s ? n.replace(w, "") : ""),
                "" === p && (p = g in d ? d[g] : o),
                n = l || 0 === l ? (t ? l + j : l) + p : b[g],
                o !== p && "" !== p && (l || 0 === l) && j && (j = aa(a, g, j, o),
                "%" === p ? (j /= aa(a, g, 100, "%") / 100,
                b.strictUnits !== !0 && (m = j + "%")) : "em" === p || "rem" === p || "vw" === p || "vh" === p ? j /= aa(a, g, 1, p) : "px" !== p && (l = aa(a, g, l, p),
                p = "px"),
                t && (l || 0 === l) && (n = l + j + p)),
                t && (l += j),
                !j && 0 !== j || !l && 0 !== l ? void 0 !== u[g] && (n || n + "" != "NaN" && null != n) ? (c = new ta(u,g,l || j || 0,0,c,(-1),g,(!1),0,m,n),
                c.xs0 = "none" !== n || "display" !== g && -1 === g.indexOf("Style") ? n : m) : W("invalid " + g + " tween value: " + b[g]) : (c = new ta(u,g,j,l - j,c,0,g,k !== !1 && ("px" === p || "zIndex" === g),0,m,n),
                c.xs0 = p))),
                f && c && !c.plugin && (c.plugin = f);
            return c
        }
        ,
        j.setRatio = function(a) {
            var b, c, d, e = this._firstPT, f = 1e-6;
            if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                    for (; e; ) {
                        if (b = e.c * a + e.s,
                        e.r ? b = Math.round(b) : f > b && b > -f && (b = 0),
                        e.type)
                            if (1 === e.type)
                                if (d = e.l,
                                2 === d)
                                    e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2;
                                else if (3 === d)
                                    e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3;
                                else if (4 === d)
                                    e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4;
                                else if (5 === d)
                                    e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4 + e.xn4 + e.xs5;
                                else {
                                    for (c = e.xs0 + b + e.xs1,
                                    d = 1; d < e.l; d++)
                                        c += e["xn" + d] + e["xs" + (d + 1)];
                                    e.t[e.p] = c
                                }
                            else
                                -1 === e.type ? e.t[e.p] = e.xs0 : e.setRatio && e.setRatio(a);
                        else
                            e.t[e.p] = b + e.xs0;
                        e = e._next
                    }
                else
                    for (; e; )
                        2 !== e.type ? e.t[e.p] = e.b : e.setRatio(a),
                        e = e._next;
            else
                for (; e; ) {
                    if (2 !== e.type)
                        if (e.r && -1 !== e.type)
                            if (b = Math.round(e.s + e.c),
                            e.type) {
                                if (1 === e.type) {
                                    for (d = e.l,
                                    c = e.xs0 + b + e.xs1,
                                    d = 1; d < e.l; d++)
                                        c += e["xn" + d] + e["xs" + (d + 1)];
                                    e.t[e.p] = c
                                }
                            } else
                                e.t[e.p] = b + e.xs0;
                        else
                            e.t[e.p] = e.e;
                    else
                        e.setRatio(a);
                    e = e._next
                }
        }
        ,
        j._enableTransforms = function(a) {
            this._transform = this._transform || Ra(this._target, e, !0),
            this._transformType = this._transform.svg && Aa || !a && 3 !== this._transformType ? 2 : 3
        }
        ;
        var Ya = function(a) {
            this.t[this.p] = this.e,
            this.data._linkCSSP(this, this._next, null, !0)
        };
        j._addLazySet = function(a, b, c) {
            var d = this._firstPT = new ta(a,b,0,0,this._firstPT,2);
            d.e = c,
            d.setRatio = Ya,
            d.data = this
        }
        ,
        j._linkCSSP = function(a, b, c, d) {
            return a && (b && (b._prev = a),
            a._next && (a._next._prev = a._prev),
            a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next,
            d = !0),
            c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a),
            a._next = b,
            a._prev = c),
            a
        }
        ,
        j._mod = function(a) {
            for (var b = this._firstPT; b; )
                "function" == typeof a[b.p] && a[b.p] === Math.round && (b.r = 1),
                b = b._next
        }
        ,
        j._kill = function(b) {
            var c, d, e, f = b;
            if (b.autoAlpha || b.alpha) {
                f = {};
                for (d in b)
                    f[d] = b[d];
                f.opacity = 1,
                f.autoAlpha && (f.visibility = 1)
            }
            for (b.className && (c = this._classNamePT) && (e = c.xfirst,
            e && e._prev ? this._linkCSSP(e._prev, c._next, e._prev._prev) : e === this._firstPT && (this._firstPT = c._next),
            c._next && this._linkCSSP(c._next, c._next._next, e._prev),
            this._classNamePT = null),
            c = this._firstPT; c; )
                c.plugin && c.plugin !== d && c.plugin._kill && (c.plugin._kill(b),
                d = c.plugin),
                c = c._next;
            return a.prototype._kill.call(this, f)
        }
        ;
        var Za = function(a, b, c) {
            var d, e, f, g;
            if (a.slice)
                for (e = a.length; --e > -1; )
                    Za(a[e], b, c);
            else
                for (d = a.childNodes,
                e = d.length; --e > -1; )
                    f = d[e],
                    g = f.type,
                    f.style && (b.push(ca(f)),
                    c && c.push(f)),
                    1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Za(f, b, c)
        };
        return g.cascadeTo = function(a, c, d) {
            var e, f, g, h, i = b.to(a, c, d), j = [i], k = [], l = [], m = [], n = b._internals.reservedProps;
            for (a = i._targets || i.target,
            Za(a, k, m),
            i.render(c, !0, !0),
            Za(a, l),
            i.render(0, !0, !0),
            i._enabled(!0),
            e = m.length; --e > -1; )
                if (f = da(m[e], k[e], l[e]),
                f.firstMPT) {
                    f = f.difs;
                    for (g in d)
                        n[g] && (f[g] = d[g]);
                    h = {};
                    for (g in f)
                        h[g] = k[e][g];
                    j.push(b.fromTo(m[e], c, h, f))
                }
            return j
        }
        ,
        a.activate([g]),
        g
    }, !0),
    function() {
        var a = _gsScope._gsDefine.plugin({
            propName: "roundProps",
            version: "1.6.0",
            priority: -1,
            API: 2,
            init: function(a, b, c) {
                return this._tween = c,
                !0
            }
        })
          , b = function(a) {
            for (; a; )
                a.f || a.blob || (a.m = Math.round),
                a = a._next
        }
          , c = a.prototype;
        c._onInitAllProps = function() {
            for (var a, c, d, e = this._tween, f = e.vars.roundProps.join ? e.vars.roundProps : e.vars.roundProps.split(","), g = f.length, h = {}, i = e._propLookup.roundProps; --g > -1; )
                h[f[g]] = Math.round;
            for (g = f.length; --g > -1; )
                for (a = f[g],
                c = e._firstPT; c; )
                    d = c._next,
                    c.pg ? c.t._mod(h) : c.n === a && (2 === c.f && c.t ? b(c.t._firstPT) : (this._add(c.t, a, c.s, c.c),
                    d && (d._prev = c._prev),
                    c._prev ? c._prev._next = d : e._firstPT === c && (e._firstPT = d),
                    c._next = c._prev = null,
                    e._propLookup[a] = i)),
                    c = d;
            return !1
        }
        ,
        c._add = function(a, b, c, d) {
            this._addTween(a, b, c, c + d, b, Math.round),
            this._overwriteProps.push(b)
        }
    }(),
    function() {
        _gsScope._gsDefine.plugin({
            propName: "attr",
            API: 2,
            version: "0.6.0",
            init: function(a, b, c, d) {
                var e, f;
                if ("function" != typeof a.setAttribute)
                    return !1;
                for (e in b)
                    f = b[e],
                    "function" == typeof f && (f = f(d, a)),
                    this._addTween(a, "setAttribute", a.getAttribute(e) + "", f + "", e, !1, e),
                    this._overwriteProps.push(e);
                return !0
            }
        })
    }(),
    _gsScope._gsDefine.plugin({
        propName: "directionalRotation",
        version: "0.3.0",
        API: 2,
        init: function(a, b, c, d) {
            "object" != typeof b && (b = {
                rotation: b
            }),
            this.finals = {};
            var e, f, g, h, i, j, k = b.useRadians === !0 ? 2 * Math.PI : 360, l = 1e-6;
            for (e in b)
                "useRadians" !== e && (h = b[e],
                "function" == typeof h && (h = h(d, a)),
                j = (h + "").split("_"),
                f = j[0],
                g = parseFloat("function" != typeof a[e] ? a[e] : a[e.indexOf("set") || "function" != typeof a["get" + e.substr(3)] ? e : "get" + e.substr(3)]()),
                h = this.finals[e] = "string" == typeof f && "=" === f.charAt(1) ? g + parseInt(f.charAt(0) + "1", 10) * Number(f.substr(2)) : Number(f) || 0,
                i = h - g,
                j.length && (f = j.join("_"),
                -1 !== f.indexOf("short") && (i %= k,
                i !== i % (k / 2) && (i = 0 > i ? i + k : i - k)),
                -1 !== f.indexOf("_cw") && 0 > i ? i = (i + 9999999999 * k) % k - (i / k | 0) * k : -1 !== f.indexOf("ccw") && i > 0 && (i = (i - 9999999999 * k) % k - (i / k | 0) * k)),
                (i > l || -l > i) && (this._addTween(a, e, g, g + i, e),
                this._overwriteProps.push(e)));
            return !0
        },
        set: function(a) {
            var b;
            if (1 !== a)
                this._super.setRatio.call(this, a);
            else
                for (b = this._firstPT; b; )
                    b.f ? b.t[b.p](this.finals[b.p]) : b.t[b.p] = this.finals[b.p],
                    b = b._next
        }
    })._autoCSS = !0,
    _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(a) {
        var b, c, d, e = _gsScope.GreenSockGlobals || _gsScope, f = e.com.greensock, g = 2 * Math.PI, h = Math.PI / 2, i = f._class, j = function(b, c) {
            var d = i("easing." + b, function() {}, !0)
              , e = d.prototype = new a;
            return e.constructor = d,
            e.getRatio = c,
            d
        }, k = a.register || function() {}
        , l = function(a, b, c, d, e) {
            var f = i("easing." + a, {
                easeOut: new b,
                easeIn: new c,
                easeInOut: new d
            }, !0);
            return k(f, a),
            f
        }, m = function(a, b, c) {
            this.t = a,
            this.v = b,
            c && (this.next = c,
            c.prev = this,
            this.c = c.v - b,
            this.gap = c.t - a)
        }, n = function(b, c) {
            var d = i("easing." + b, function(a) {
                this._p1 = a || 0 === a ? a : 1.70158,
                this._p2 = 1.525 * this._p1
            }, !0)
              , e = d.prototype = new a;
            return e.constructor = d,
            e.getRatio = c,
            e.config = function(a) {
                return new d(a)
            }
            ,
            d
        }, o = l("Back", n("BackOut", function(a) {
            return (a -= 1) * a * ((this._p1 + 1) * a + this._p1) + 1
        }), n("BackIn", function(a) {
            return a * a * ((this._p1 + 1) * a - this._p1)
        }), n("BackInOut", function(a) {
            return (a *= 2) < 1 ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2)
        })), p = i("easing.SlowMo", function(a, b, c) {
            b = b || 0 === b ? b : .7,
            null == a ? a = .7 : a > 1 && (a = 1),
            this._p = 1 !== a ? b : 0,
            this._p1 = (1 - a) / 2,
            this._p2 = a,
            this._p3 = this._p1 + this._p2,
            this._calcEnd = c === !0
        }, !0), q = p.prototype = new a;
        return q.constructor = p,
        q.getRatio = function(a) {
            var b = a + (.5 - a) * this._p;
            return a < this._p1 ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a : b - (a = 1 - a / this._p1) * a * a * a * b : a > this._p3 ? this._calcEnd ? 1 - (a = (a - this._p3) / this._p1) * a : b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a : this._calcEnd ? 1 : b
        }
        ,
        p.ease = new p(.7,.7),
        q.config = p.config = function(a, b, c) {
            return new p(a,b,c)
        }
        ,
        b = i("easing.SteppedEase", function(a) {
            a = a || 1,
            this._p1 = 1 / a,
            this._p2 = a + 1
        }, !0),
        q = b.prototype = new a,
        q.constructor = b,
        q.getRatio = function(a) {
            return 0 > a ? a = 0 : a >= 1 && (a = .999999999),
            (this._p2 * a >> 0) * this._p1
        }
        ,
        q.config = b.config = function(a) {
            return new b(a)
        }
        ,
        c = i("easing.RoughEase", function(b) {
            b = b || {};
            for (var c, d, e, f, g, h, i = b.taper || "none", j = [], k = 0, l = 0 | (b.points || 20), n = l, o = b.randomize !== !1, p = b.clamp === !0, q = b.template instanceof a ? b.template : null, r = "number" == typeof b.strength ? .4 * b.strength : .4; --n > -1; )
                c = o ? Math.random() : 1 / l * n,
                d = q ? q.getRatio(c) : c,
                "none" === i ? e = r : "out" === i ? (f = 1 - c,
                e = f * f * r) : "in" === i ? e = c * c * r : .5 > c ? (f = 2 * c,
                e = f * f * .5 * r) : (f = 2 * (1 - c),
                e = f * f * .5 * r),
                o ? d += Math.random() * e - .5 * e : n % 2 ? d += .5 * e : d -= .5 * e,
                p && (d > 1 ? d = 1 : 0 > d && (d = 0)),
                j[k++] = {
                    x: c,
                    y: d
                };
            for (j.sort(function(a, b) {
                return a.x - b.x
            }),
            h = new m(1,1,null),
            n = l; --n > -1; )
                g = j[n],
                h = new m(g.x,g.y,h);
            this._prev = new m(0,0,0 !== h.t ? h : h.next)
        }, !0),
        q = c.prototype = new a,
        q.constructor = c,
        q.getRatio = function(a) {
            var b = this._prev;
            if (a > b.t) {
                for (; b.next && a >= b.t; )
                    b = b.next;
                b = b.prev
            } else
                for (; b.prev && a <= b.t; )
                    b = b.prev;
            return this._prev = b,
            b.v + (a - b.t) / b.gap * b.c
        }
        ,
        q.config = function(a) {
            return new c(a)
        }
        ,
        c.ease = new c,
        l("Bounce", j("BounceOut", function(a) {
            return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
        }), j("BounceIn", function(a) {
            return (a = 1 - a) < 1 / 2.75 ? 1 - 7.5625 * a * a : 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
        }), j("BounceInOut", function(a) {
            var b = .5 > a;
            return a = b ? 1 - 2 * a : 2 * a - 1,
            a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375,
            b ? .5 * (1 - a) : .5 * a + .5
        })),
        l("Circ", j("CircOut", function(a) {
            return Math.sqrt(1 - (a -= 1) * a)
        }), j("CircIn", function(a) {
            return -(Math.sqrt(1 - a * a) - 1)
        }), j("CircInOut", function(a) {
            return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        })),
        d = function(b, c, d) {
            var e = i("easing." + b, function(a, b) {
                this._p1 = a >= 1 ? a : 1,
                this._p2 = (b || d) / (1 > a ? a : 1),
                this._p3 = this._p2 / g * (Math.asin(1 / this._p1) || 0),
                this._p2 = g / this._p2
            }, !0)
              , f = e.prototype = new a;
            return f.constructor = e,
            f.getRatio = c,
            f.config = function(a, b) {
                return new e(a,b)
            }
            ,
            e
        }
        ,
        l("Elastic", d("ElasticOut", function(a) {
            return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * this._p2) + 1
        }, .3), d("ElasticIn", function(a) {
            return -(this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2))
        }, .3), d("ElasticInOut", function(a) {
            return (a *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2) * .5 + 1
        }, .45)),
        l("Expo", j("ExpoOut", function(a) {
            return 1 - Math.pow(2, -10 * a)
        }), j("ExpoIn", function(a) {
            return Math.pow(2, 10 * (a - 1)) - .001
        }), j("ExpoInOut", function(a) {
            return (a *= 2) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
        })),
        l("Sine", j("SineOut", function(a) {
            return Math.sin(a * h)
        }), j("SineIn", function(a) {
            return -Math.cos(a * h) + 1
        }), j("SineInOut", function(a) {
            return -.5 * (Math.cos(Math.PI * a) - 1)
        })),
        i("easing.EaseLookup", {
            find: function(b) {
                return a.map[b]
            }
        }, !0),
        k(e.SlowMo, "SlowMo", "ease,"),
        k(c, "RoughEase", "ease,"),
        k(b, "SteppedEase", "ease,"),
        o
    }, !0)
}),
_gsScope._gsDefine && _gsScope._gsQueue.pop()(),
function(a, b) {
    "use strict";
    var c = {}
      , d = a.document
      , e = a.GreenSockGlobals = a.GreenSockGlobals || a;
    if (!e.TweenLite) {
        var f, g, h, i, j, k = function(a) {
            var b, c = a.split("."), d = e;
            for (b = 0; b < c.length; b++)
                d[c[b]] = d = d[c[b]] || {};
            return d
        }, l = k("com.greensock"), m = 1e-10, n = function(a) {
            var b, c = [], d = a.length;
            for (b = 0; b !== d; c.push(a[b++]))
                ;
            return c
        }, o = function() {}, p = function() {
            var a = Object.prototype.toString
              , b = a.call([]);
            return function(c) {
                return null != c && (c instanceof Array || "object" == typeof c && !!c.push && a.call(c) === b)
            }
        }(), q = {}, r = function(d, f, g, h) {
            this.sc = q[d] ? q[d].sc : [],
            q[d] = this,
            this.gsClass = null,
            this.func = g;
            var i = [];
            this.check = function(j) {
                for (var l, m, n, o, p, s = f.length, t = s; --s > -1; )
                    (l = q[f[s]] || new r(f[s],[])).gsClass ? (i[s] = l.gsClass,
                    t--) : j && l.sc.push(this);
                if (0 === t && g) {
                    if (m = ("com.greensock." + d).split("."),
                    n = m.pop(),
                    o = k(m.join("."))[n] = this.gsClass = g.apply(g, i),
                    h)
                        if (e[n] = c[n] = o,
                        p = "undefined" != typeof module && module.exports,
                        !p && "function" == typeof define && define.amd)
                            define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + d.split(".").pop(), [], function() {
                                return o
                            });
                        else if (p)
                            if (d === b) {
                                module.exports = c[b] = o;
                                for (s in c)
                                    o[s] = c[s]
                            } else
                                c[b] && (c[b][n] = o);
                    for (s = 0; s < this.sc.length; s++)
                        this.sc[s].check()
                }
            }
            ,
            this.check(!0)
        }, s = a._gsDefine = function(a, b, c, d) {
            return new r(a,b,c,d)
        }
        , t = l._class = function(a, b, c) {
            return b = b || function() {}
            ,
            s(a, [], function() {
                return b
            }, c),
            b
        }
        ;
        s.globals = e;
        var u = [0, 0, 1, 1]
          , v = t("easing.Ease", function(a, b, c, d) {
            this._func = a,
            this._type = c || 0,
            this._power = d || 0,
            this._params = b ? u.concat(b) : u
        }, !0)
          , w = v.map = {}
          , x = v.register = function(a, b, c, d) {
            for (var e, f, g, h, i = b.split(","), j = i.length, k = (c || "easeIn,easeOut,easeInOut").split(","); --j > -1; )
                for (f = i[j],
                e = d ? t("easing." + f, null, !0) : l.easing[f] || {},
                g = k.length; --g > -1; )
                    h = k[g],
                    w[f + "." + h] = w[h + f] = e[h] = a.getRatio ? a : a[h] || new a
        }
        ;
        for (h = v.prototype,
        h._calcEnd = !1,
        h.getRatio = function(a) {
            if (this._func)
                return this._params[0] = a,
                this._func.apply(null, this._params);
            var b = this._type
              , c = this._power
              , d = 1 === b ? 1 - a : 2 === b ? a : .5 > a ? 2 * a : 2 * (1 - a);
            return 1 === c ? d *= d : 2 === c ? d *= d * d : 3 === c ? d *= d * d * d : 4 === c && (d *= d * d * d * d),
            1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
        }
        ,
        f = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"],
        g = f.length; --g > -1; )
            h = f[g] + ",Power" + g,
            x(new v(null,null,1,g), h, "easeOut", !0),
            x(new v(null,null,2,g), h, "easeIn" + (0 === g ? ",easeNone" : "")),
            x(new v(null,null,3,g), h, "easeInOut");
        w.linear = l.easing.Linear.easeIn,
        w.swing = l.easing.Quad.easeInOut;
        var y = t("events.EventDispatcher", function(a) {
            this._listeners = {},
            this._eventTarget = a || this
        });
        h = y.prototype,
        h.addEventListener = function(a, b, c, d, e) {
            e = e || 0;
            var f, g, h = this._listeners[a], k = 0;
            for (this !== i || j || i.wake(),
            null == h && (this._listeners[a] = h = []),
            g = h.length; --g > -1; )
                f = h[g],
                f.c === b && f.s === c ? h.splice(g, 1) : 0 === k && f.pr < e && (k = g + 1);
            h.splice(k, 0, {
                c: b,
                s: c,
                up: d,
                pr: e
            })
        }
        ,
        h.removeEventListener = function(a, b) {
            var c, d = this._listeners[a];
            if (d)
                for (c = d.length; --c > -1; )
                    if (d[c].c === b)
                        return void d.splice(c, 1)
        }
        ,
        h.dispatchEvent = function(a) {
            var b, c, d, e = this._listeners[a];
            if (e)
                for (b = e.length,
                b > 1 && (e = e.slice(0)),
                c = this._eventTarget; --b > -1; )
                    d = e[b],
                    d && (d.up ? d.c.call(d.s || c, {
                        type: a,
                        target: c
                    }) : d.c.call(d.s || c))
        }
        ;
        var z = a.requestAnimationFrame
          , A = a.cancelAnimationFrame
          , B = Date.now || function() {
            return (new Date).getTime()
        }
          , C = B();
        for (f = ["ms", "moz", "webkit", "o"],
        g = f.length; --g > -1 && !z; )
            z = a[f[g] + "RequestAnimationFrame"],
            A = a[f[g] + "CancelAnimationFrame"] || a[f[g] + "CancelRequestAnimationFrame"];
        t("Ticker", function(a, b) {
            var c, e, f, g, h, k = this, l = B(), n = b !== !1 && z ? "auto" : !1, p = 500, q = 33, r = "tick", s = function(a) {
                var b, d, i = B() - C;
                i > p && (l += i - q),
                C += i,
                k.time = (C - l) / 1e3,
                b = k.time - h,
                (!c || b > 0 || a === !0) && (k.frame++,
                h += b + (b >= g ? .004 : g - b),
                d = !0),
                a !== !0 && (f = e(s)),
                d && k.dispatchEvent(r)
            };
            y.call(k),
            k.time = k.frame = 0,
            k.tick = function() {
                s(!0)
            }
            ,
            k.lagSmoothing = function(a, b) {
                p = a || 1 / m,
                q = Math.min(b, p, 0)
            }
            ,
            k.sleep = function() {
                null != f && (n && A ? A(f) : clearTimeout(f),
                e = o,
                f = null,
                k === i && (j = !1))
            }
            ,
            k.wake = function(a) {
                null !== f ? k.sleep() : a ? l += -C + (C = B()) : k.frame > 10 && (C = B() - p + 5),
                e = 0 === c ? o : n && z ? z : function(a) {
                    return setTimeout(a, 1e3 * (h - k.time) + 1 | 0)
                }
                ,
                k === i && (j = !0),
                s(2)
            }
            ,
            k.fps = function(a) {
                return arguments.length ? (c = a,
                g = 1 / (c || 60),
                h = this.time + g,
                void k.wake()) : c
            }
            ,
            k.useRAF = function(a) {
                return arguments.length ? (k.sleep(),
                n = a,
                void k.fps(c)) : n
            }
            ,
            k.fps(a),
            setTimeout(function() {
                "auto" === n && k.frame < 5 && "hidden" !== d.visibilityState && k.useRAF(!1)
            }, 1500)
        }),
        h = l.Ticker.prototype = new l.events.EventDispatcher,
        h.constructor = l.Ticker;
        var D = t("core.Animation", function(a, b) {
            if (this.vars = b = b || {},
            this._duration = this._totalDuration = a || 0,
            this._delay = Number(b.delay) || 0,
            this._timeScale = 1,
            this._active = b.immediateRender === !0,
            this.data = b.data,
            this._reversed = b.reversed === !0,
            W) {
                j || i.wake();
                var c = this.vars.useFrames ? V : W;
                c.add(this, c._time),
                this.vars.paused && this.paused(!0)
            }
        });
        i = D.ticker = new l.Ticker,
        h = D.prototype,
        h._dirty = h._gc = h._initted = h._paused = !1,
        h._totalTime = h._time = 0,
        h._rawPrevTime = -1,
        h._next = h._last = h._onUpdate = h._timeline = h.timeline = null,
        h._paused = !1;
        var E = function() {
            j && B() - C > 2e3 && i.wake(),
            setTimeout(E, 2e3)
        };
        E(),
        h.play = function(a, b) {
            return null != a && this.seek(a, b),
            this.reversed(!1).paused(!1)
        }
        ,
        h.pause = function(a, b) {
            return null != a && this.seek(a, b),
            this.paused(!0)
        }
        ,
        h.resume = function(a, b) {
            return null != a && this.seek(a, b),
            this.paused(!1)
        }
        ,
        h.seek = function(a, b) {
            return this.totalTime(Number(a), b !== !1)
        }
        ,
        h.restart = function(a, b) {
            return this.reversed(!1).paused(!1).totalTime(a ? -this._delay : 0, b !== !1, !0)
        }
        ,
        h.reverse = function(a, b) {
            return null != a && this.seek(a || this.totalDuration(), b),
            this.reversed(!0).paused(!1)
        }
        ,
        h.render = function(a, b, c) {}
        ,
        h.invalidate = function() {
            return this._time = this._totalTime = 0,
            this._initted = this._gc = !1,
            this._rawPrevTime = -1,
            (this._gc || !this.timeline) && this._enabled(!0),
            this
        }
        ,
        h.isActive = function() {
            var a, b = this._timeline, c = this._startTime;
            return !b || !this._gc && !this._paused && b.isActive() && (a = b.rawTime(!0)) >= c && a < c + this.totalDuration() / this._timeScale
        }
        ,
        h._enabled = function(a, b) {
            return j || i.wake(),
            this._gc = !a,
            this._active = this.isActive(),
            b !== !0 && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)),
            !1
        }
        ,
        h._kill = function(a, b) {
            return this._enabled(!1, !1)
        }
        ,
        h.kill = function(a, b) {
            return this._kill(a, b),
            this
        }
        ,
        h._uncache = function(a) {
            for (var b = a ? this : this.timeline; b; )
                b._dirty = !0,
                b = b.timeline;
            return this
        }
        ,
        h._swapSelfInParams = function(a) {
            for (var b = a.length, c = a.concat(); --b > -1; )
                "{self}" === a[b] && (c[b] = this);
            return c
        }
        ,
        h._callback = function(a) {
            var b = this.vars
              , c = b[a]
              , d = b[a + "Params"]
              , e = b[a + "Scope"] || b.callbackScope || this
              , f = d ? d.length : 0;
            switch (f) {
            case 0:
                c.call(e);
                break;
            case 1:
                c.call(e, d[0]);
                break;
            case 2:
                c.call(e, d[0], d[1]);
                break;
            default:
                c.apply(e, d)
            }
        }
        ,
        h.eventCallback = function(a, b, c, d) {
            if ("on" === (a || "").substr(0, 2)) {
                var e = this.vars;
                if (1 === arguments.length)
                    return e[a];
                null == b ? delete e[a] : (e[a] = b,
                e[a + "Params"] = p(c) && -1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c,
                e[a + "Scope"] = d),
                "onUpdate" === a && (this._onUpdate = b)
            }
            return this
        }
        ,
        h.delay = function(a) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay),
            this._delay = a,
            this) : this._delay
        }
        ,
        h.duration = function(a) {
            return arguments.length ? (this._duration = this._totalDuration = a,
            this._uncache(!0),
            this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0),
            this) : (this._dirty = !1,
            this._duration)
        }
        ,
        h.totalDuration = function(a) {
            return this._dirty = !1,
            arguments.length ? this.duration(a) : this._totalDuration
        }
        ,
        h.time = function(a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            this.totalTime(a > this._duration ? this._duration : a, b)) : this._time
        }
        ,
        h.totalTime = function(a, b, c) {
            if (j || i.wake(),
            !arguments.length)
                return this._totalTime;
            if (this._timeline) {
                if (0 > a && !c && (a += this.totalDuration()),
                this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var d = this._totalDuration
                      , e = this._timeline;
                    if (a > d && !c && (a = d),
                    this._startTime = (this._paused ? this._pauseTime : e._time) - (this._reversed ? d - a : a) / this._timeScale,
                    e._dirty || this._uncache(!1),
                    e._timeline)
                        for (; e._timeline; )
                            e._timeline._time !== (e._startTime + e._totalTime) / e._timeScale && e.totalTime(e._totalTime, !0),
                            e = e._timeline
                }
                this._gc && this._enabled(!0, !1),
                (this._totalTime !== a || 0 === this._duration) && (J.length && Y(),
                this.render(a, b, !1),
                J.length && Y())
            }
            return this
        }
        ,
        h.progress = h.totalProgress = function(a, b) {
            var c = this.duration();
            return arguments.length ? this.totalTime(c * a, b) : c ? this._time / c : this.ratio
        }
        ,
        h.startTime = function(a) {
            return arguments.length ? (a !== this._startTime && (this._startTime = a,
            this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)),
            this) : this._startTime
        }
        ,
        h.endTime = function(a) {
            return this._startTime + (0 != a ? this.totalDuration() : this.duration()) / this._timeScale
        }
        ,
        h.timeScale = function(a) {
            if (!arguments.length)
                return this._timeScale;
            if (a = a || m,
            this._timeline && this._timeline.smoothChildTiming) {
                var b = this._pauseTime
                  , c = b || 0 === b ? b : this._timeline.totalTime();
                this._startTime = c - (c - this._startTime) * this._timeScale / a
            }
            return this._timeScale = a,
            this._uncache(!1)
        }
        ,
        h.reversed = function(a) {
            return arguments.length ? (a != this._reversed && (this._reversed = a,
            this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)),
            this) : this._reversed
        }
        ,
        h.paused = function(a) {
            if (!arguments.length)
                return this._paused;
            var b, c, d = this._timeline;
            return a != this._paused && d && (j || a || i.wake(),
            b = d.rawTime(),
            c = b - this._pauseTime,
            !a && d.smoothChildTiming && (this._startTime += c,
            this._uncache(!1)),
            this._pauseTime = a ? b : null,
            this._paused = a,
            this._active = this.isActive(),
            !a && 0 !== c && this._initted && this.duration() && (b = d.smoothChildTiming ? this._totalTime : (b - this._startTime) / this._timeScale,
            this.render(b, b === this._totalTime, !0))),
            this._gc && !a && this._enabled(!0, !1),
            this
        }
        ;
        var F = t("core.SimpleTimeline", function(a) {
            D.call(this, 0, a),
            this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        h = F.prototype = new D,
        h.constructor = F,
        h.kill()._gc = !1,
        h._first = h._last = h._recent = null,
        h._sortChildren = !1,
        h.add = h.insert = function(a, b, c, d) {
            var e, f;
            if (a._startTime = Number(b || 0) + a._delay,
            a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale),
            a.timeline && a.timeline._remove(a, !0),
            a.timeline = a._timeline = this,
            a._gc && a._enabled(!0, !0),
            e = this._last,
            this._sortChildren)
                for (f = a._startTime; e && e._startTime > f; )
                    e = e._prev;
            return e ? (a._next = e._next,
            e._next = a) : (a._next = this._first,
            this._first = a),
            a._next ? a._next._prev = a : this._last = a,
            a._prev = e,
            this._recent = a,
            this._timeline && this._uncache(!0),
            this
        }
        ,
        h._remove = function(a, b) {
            return a.timeline === this && (b || a._enabled(!1, !0),
            a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next),
            a._next ? a._next._prev = a._prev : this._last === a && (this._last = a._prev),
            a._next = a._prev = a.timeline = null,
            a === this._recent && (this._recent = this._last),
            this._timeline && this._uncache(!0)),
            this
        }
        ,
        h.render = function(a, b, c) {
            var d, e = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = a; e; )
                d = e._next,
                (e._active || a >= e._startTime && !e._paused) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)),
                e = d
        }
        ,
        h.rawTime = function() {
            return j || i.wake(),
            this._totalTime;
        }
        ;
        var G = t("TweenLite", function(b, c, d) {
            if (D.call(this, c, d),
            this.render = G.prototype.render,
            null == b)
                throw "Cannot tween a null target.";
            this.target = b = "string" != typeof b ? b : G.selector(b) || b;
            var e, f, g, h = b.jquery || b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType), i = this.vars.overwrite;
            if (this._overwrite = i = null == i ? U[G.defaultOverwrite] : "number" == typeof i ? i >> 0 : U[i],
            (h || b instanceof Array || b.push && p(b)) && "number" != typeof b[0])
                for (this._targets = g = n(b),
                this._propLookup = [],
                this._siblings = [],
                e = 0; e < g.length; e++)
                    f = g[e],
                    f ? "string" != typeof f ? f.length && f !== a && f[0] && (f[0] === a || f[0].nodeType && f[0].style && !f.nodeType) ? (g.splice(e--, 1),
                    this._targets = g = g.concat(n(f))) : (this._siblings[e] = Z(f, this, !1),
                    1 === i && this._siblings[e].length > 1 && _(f, this, null, 1, this._siblings[e])) : (f = g[e--] = G.selector(f),
                    "string" == typeof f && g.splice(e + 1, 1)) : g.splice(e--, 1);
            else
                this._propLookup = {},
                this._siblings = Z(b, this, !1),
                1 === i && this._siblings.length > 1 && _(b, this, null, 1, this._siblings);
            (this.vars.immediateRender || 0 === c && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -m,
            this.render(Math.min(0, -this._delay)))
        }, !0)
          , H = function(b) {
            return b && b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType)
        }
          , I = function(a, b) {
            var c, d = {};
            for (c in a)
                T[c] || c in b && "transform" !== c && "x" !== c && "y" !== c && "width" !== c && "height" !== c && "className" !== c && "border" !== c || !(!Q[c] || Q[c] && Q[c]._autoCSS) || (d[c] = a[c],
                delete a[c]);
            a.css = d
        };
        h = G.prototype = new D,
        h.constructor = G,
        h.kill()._gc = !1,
        h.ratio = 0,
        h._firstPT = h._targets = h._overwrittenProps = h._startAt = null,
        h._notifyPluginsOfEnabled = h._lazy = !1,
        G.version = "1.19.1",
        G.defaultEase = h._ease = new v(null,null,1,1),
        G.defaultOverwrite = "auto",
        G.ticker = i,
        G.autoSleep = 120,
        G.lagSmoothing = function(a, b) {
            i.lagSmoothing(a, b)
        }
        ,
        G.selector = a.$ || a.jQuery || function(b) {
            var c = a.$ || a.jQuery;
            return c ? (G.selector = c,
            c(b)) : "undefined" == typeof d ? b : d.querySelectorAll ? d.querySelectorAll(b) : d.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
        }
        ;
        var J = []
          , K = {}
          , L = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi
          , M = function(a) {
            for (var b, c = this._firstPT, d = 1e-6; c; )
                b = c.blob ? 1 === a ? this.end : a ? this.join("") : this.start : c.c * a + c.s,
                c.m ? b = c.m(b, this._target || c.t) : d > b && b > -d && !c.blob && (b = 0),
                c.f ? c.fp ? c.t[c.p](c.fp, b) : c.t[c.p](b) : c.t[c.p] = b,
                c = c._next
        }
          , N = function(a, b, c, d) {
            var e, f, g, h, i, j, k, l = [], m = 0, n = "", o = 0;
            for (l.start = a,
            l.end = b,
            a = l[0] = a + "",
            b = l[1] = b + "",
            c && (c(l),
            a = l[0],
            b = l[1]),
            l.length = 0,
            e = a.match(L) || [],
            f = b.match(L) || [],
            d && (d._next = null,
            d.blob = 1,
            l._firstPT = l._applyPT = d),
            i = f.length,
            h = 0; i > h; h++)
                k = f[h],
                j = b.substr(m, b.indexOf(k, m) - m),
                n += j || !h ? j : ",",
                m += j.length,
                o ? o = (o + 1) % 5 : "rgba(" === j.substr(-5) && (o = 1),
                k === e[h] || e.length <= h ? n += k : (n && (l.push(n),
                n = ""),
                g = parseFloat(e[h]),
                l.push(g),
                l._firstPT = {
                    _next: l._firstPT,
                    t: l,
                    p: l.length - 1,
                    s: g,
                    c: ("=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * parseFloat(k.substr(2)) : parseFloat(k) - g) || 0,
                    f: 0,
                    m: o && 4 > o ? Math.round : 0
                }),
                m += k.length;
            return n += b.substr(m),
            n && l.push(n),
            l.setRatio = M,
            l
        }
          , O = function(a, b, c, d, e, f, g, h, i) {
            "function" == typeof d && (d = d(i || 0, a));
            var j, k = typeof a[b], l = "function" !== k ? "" : b.indexOf("set") || "function" != typeof a["get" + b.substr(3)] ? b : "get" + b.substr(3), m = "get" !== c ? c : l ? g ? a[l](g) : a[l]() : a[b], n = "string" == typeof d && "=" === d.charAt(1), o = {
                t: a,
                p: b,
                s: m,
                f: "function" === k,
                pg: 0,
                n: e || b,
                m: f ? "function" == typeof f ? f : Math.round : 0,
                pr: 0,
                c: n ? parseInt(d.charAt(0) + "1", 10) * parseFloat(d.substr(2)) : parseFloat(d) - m || 0
            };
            return ("number" != typeof m || "number" != typeof d && !n) && (g || isNaN(m) || !n && isNaN(d) || "boolean" == typeof m || "boolean" == typeof d ? (o.fp = g,
            j = N(m, n ? o.s + o.c : d, h || G.defaultStringFilter, o),
            o = {
                t: j,
                p: "setRatio",
                s: 0,
                c: 1,
                f: 2,
                pg: 0,
                n: e || b,
                pr: 0,
                m: 0
            }) : (o.s = parseFloat(m),
            n || (o.c = parseFloat(d) - o.s || 0))),
            o.c ? ((o._next = this._firstPT) && (o._next._prev = o),
            this._firstPT = o,
            o) : void 0
        }
          , P = G._internals = {
            isArray: p,
            isSelector: H,
            lazyTweens: J,
            blobDif: N
        }
          , Q = G._plugins = {}
          , R = P.tweenLookup = {}
          , S = 0
          , T = P.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1,
            lazy: 1,
            onOverwrite: 1,
            callbackScope: 1,
            stringFilter: 1,
            id: 1
        }
          , U = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            "true": 1,
            "false": 0
        }
          , V = D._rootFramesTimeline = new F
          , W = D._rootTimeline = new F
          , X = 30
          , Y = P.lazyRender = function() {
            var a, b = J.length;
            for (K = {}; --b > -1; )
                a = J[b],
                a && a._lazy !== !1 && (a.render(a._lazy[0], a._lazy[1], !0),
                a._lazy = !1);
            J.length = 0
        }
        ;
        W._startTime = i.time,
        V._startTime = i.frame,
        W._active = V._active = !0,
        setTimeout(Y, 1),
        D._updateRoot = G.render = function() {
            var a, b, c;
            if (J.length && Y(),
            W.render((i.time - W._startTime) * W._timeScale, !1, !1),
            V.render((i.frame - V._startTime) * V._timeScale, !1, !1),
            J.length && Y(),
            i.frame >= X) {
                X = i.frame + (parseInt(G.autoSleep, 10) || 120);
                for (c in R) {
                    for (b = R[c].tweens,
                    a = b.length; --a > -1; )
                        b[a]._gc && b.splice(a, 1);
                    0 === b.length && delete R[c]
                }
                if (c = W._first,
                (!c || c._paused) && G.autoSleep && !V._first && 1 === i._listeners.tick.length) {
                    for (; c && c._paused; )
                        c = c._next;
                    c || i.sleep()
                }
            }
        }
        ,
        i.addEventListener("tick", D._updateRoot);
        var Z = function(a, b, c) {
            var d, e, f = a._gsTweenID;
            if (R[f || (a._gsTweenID = f = "t" + S++)] || (R[f] = {
                target: a,
                tweens: []
            }),
            b && (d = R[f].tweens,
            d[e = d.length] = b,
            c))
                for (; --e > -1; )
                    d[e] === b && d.splice(e, 1);
            return R[f].tweens
        }
          , $ = function(a, b, c, d) {
            var e, f, g = a.vars.onOverwrite;
            return g && (e = g(a, b, c, d)),
            g = G.onOverwrite,
            g && (f = g(a, b, c, d)),
            e !== !1 && f !== !1
        }
          , _ = function(a, b, c, d, e) {
            var f, g, h, i;
            if (1 === d || d >= 4) {
                for (i = e.length,
                f = 0; i > f; f++)
                    if ((h = e[f]) !== b)
                        h._gc || h._kill(null, a, b) && (g = !0);
                    else if (5 === d)
                        break;
                return g
            }
            var j, k = b._startTime + m, l = [], n = 0, o = 0 === b._duration;
            for (f = e.length; --f > -1; )
                (h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (j = j || aa(b, 0, o),
                0 === aa(h, j, o) && (l[n++] = h)) : h._startTime <= k && h._startTime + h.totalDuration() / h._timeScale > k && ((o || !h._initted) && k - h._startTime <= 2e-10 || (l[n++] = h)));
            for (f = n; --f > -1; )
                if (h = l[f],
                2 === d && h._kill(c, a, b) && (g = !0),
                2 !== d || !h._firstPT && h._initted) {
                    if (2 !== d && !$(h, b))
                        continue;
                    h._enabled(!1, !1) && (g = !0)
                }
            return g
        }
          , aa = function(a, b, c) {
            for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline; ) {
                if (f += d._startTime,
                e *= d._timeScale,
                d._paused)
                    return -100;
                d = d._timeline
            }
            return f /= e,
            f > b ? f - b : c && f === b || !a._initted && 2 * m > f - b ? m : (f += a.totalDuration() / a._timeScale / e) > b + m ? 0 : f - b - m
        };
        h._init = function() {
            var a, b, c, d, e, f, g = this.vars, h = this._overwrittenProps, i = this._duration, j = !!g.immediateRender, k = g.ease;
            if (g.startAt) {
                this._startAt && (this._startAt.render(-1, !0),
                this._startAt.kill()),
                e = {};
                for (d in g.startAt)
                    e[d] = g.startAt[d];
                if (e.overwrite = !1,
                e.immediateRender = !0,
                e.lazy = j && g.lazy !== !1,
                e.startAt = e.delay = null,
                this._startAt = G.to(this.target, 0, e),
                j)
                    if (this._time > 0)
                        this._startAt = null;
                    else if (0 !== i)
                        return
            } else if (g.runBackwards && 0 !== i)
                if (this._startAt)
                    this._startAt.render(-1, !0),
                    this._startAt.kill(),
                    this._startAt = null;
                else {
                    0 !== this._time && (j = !1),
                    c = {};
                    for (d in g)
                        T[d] && "autoCSS" !== d || (c[d] = g[d]);
                    if (c.overwrite = 0,
                    c.data = "isFromStart",
                    c.lazy = j && g.lazy !== !1,
                    c.immediateRender = j,
                    this._startAt = G.to(this.target, 0, c),
                    j) {
                        if (0 === this._time)
                            return
                    } else
                        this._startAt._init(),
                        this._startAt._enabled(!1),
                        this.vars.immediateRender && (this._startAt = null)
                }
            if (this._ease = k = k ? k instanceof v ? k : "function" == typeof k ? new v(k,g.easeParams) : w[k] || G.defaultEase : G.defaultEase,
            g.easeParams instanceof Array && k.config && (this._ease = k.config.apply(k, g.easeParams)),
            this._easeType = this._ease._type,
            this._easePower = this._ease._power,
            this._firstPT = null,
            this._targets)
                for (f = this._targets.length,
                a = 0; f > a; a++)
                    this._initProps(this._targets[a], this._propLookup[a] = {}, this._siblings[a], h ? h[a] : null, a) && (b = !0);
            else
                b = this._initProps(this.target, this._propLookup, this._siblings, h, 0);
            if (b && G._onPluginEvent("_onInitAllProps", this),
            h && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)),
            g.runBackwards)
                for (c = this._firstPT; c; )
                    c.s += c.c,
                    c.c = -c.c,
                    c = c._next;
            this._onUpdate = g.onUpdate,
            this._initted = !0
        }
        ,
        h._initProps = function(b, c, d, e, f) {
            var g, h, i, j, k, l;
            if (null == b)
                return !1;
            K[b._gsTweenID] && Y(),
            this.vars.css || b.style && b !== a && b.nodeType && Q.css && this.vars.autoCSS !== !1 && I(this.vars, b);
            for (g in this.vars)
                if (l = this.vars[g],
                T[g])
                    l && (l instanceof Array || l.push && p(l)) && -1 !== l.join("").indexOf("{self}") && (this.vars[g] = l = this._swapSelfInParams(l, this));
                else if (Q[g] && (j = new Q[g])._onInitTween(b, this.vars[g], this, f)) {
                    for (this._firstPT = k = {
                        _next: this._firstPT,
                        t: j,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 1,
                        n: g,
                        pg: 1,
                        pr: j._priority,
                        m: 0
                    },
                    h = j._overwriteProps.length; --h > -1; )
                        c[j._overwriteProps[h]] = this._firstPT;
                    (j._priority || j._onInitAllProps) && (i = !0),
                    (j._onDisable || j._onEnable) && (this._notifyPluginsOfEnabled = !0),
                    k._next && (k._next._prev = k)
                } else
                    c[g] = O.call(this, b, g, "get", l, g, 0, null, this.vars.stringFilter, f);
            return e && this._kill(e, b) ? this._initProps(b, c, d, e, f) : this._overwrite > 1 && this._firstPT && d.length > 1 && _(b, this, c, this._overwrite, d) ? (this._kill(c, b),
            this._initProps(b, c, d, e, f)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (K[b._gsTweenID] = !0),
            i)
        }
        ,
        h.render = function(a, b, c) {
            var d, e, f, g, h = this._time, i = this._duration, j = this._rawPrevTime;
            if (a >= i - 1e-7 && a >= 0)
                this._totalTime = this._time = i,
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1,
                this._reversed || (d = !0,
                e = "onComplete",
                c = c || this._timeline.autoRemoveChildren),
                0 === i && (this._initted || !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0),
                (0 > j || 0 >= a && a >= -1e-7 || j === m && "isPause" !== this.data) && j !== a && (c = !0,
                j > m && (e = "onReverseComplete")),
                this._rawPrevTime = g = !b || a || j === a ? a : m);
            else if (1e-7 > a)
                this._totalTime = this._time = 0,
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
                (0 !== h || 0 === i && j > 0) && (e = "onReverseComplete",
                d = this._reversed),
                0 > a && (this._active = !1,
                0 === i && (this._initted || !this.vars.lazy || c) && (j >= 0 && (j !== m || "isPause" !== this.data) && (c = !0),
                this._rawPrevTime = g = !b || a || j === a ? a : m)),
                this._initted || (c = !0);
            else if (this._totalTime = this._time = a,
            this._easeType) {
                var k = a / i
                  , l = this._easeType
                  , n = this._easePower;
                (1 === l || 3 === l && k >= .5) && (k = 1 - k),
                3 === l && (k *= 2),
                1 === n ? k *= k : 2 === n ? k *= k * k : 3 === n ? k *= k * k * k : 4 === n && (k *= k * k * k * k),
                1 === l ? this.ratio = 1 - k : 2 === l ? this.ratio = k : .5 > a / i ? this.ratio = k / 2 : this.ratio = 1 - k / 2
            } else
                this.ratio = this._ease.getRatio(a / i);
            if (this._time !== h || c) {
                if (!this._initted) {
                    if (this._init(),
                    !this._initted || this._gc)
                        return;
                    if (!c && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))
                        return this._time = this._totalTime = h,
                        this._rawPrevTime = j,
                        J.push(this),
                        void (this._lazy = [a, b]);
                    this._time && !d ? this.ratio = this._ease.getRatio(this._time / i) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                }
                for (this._lazy !== !1 && (this._lazy = !1),
                this._active || !this._paused && this._time !== h && a >= 0 && (this._active = !0),
                0 === h && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")),
                this.vars.onStart && (0 !== this._time || 0 === i) && (b || this._callback("onStart"))),
                f = this._firstPT; f; )
                    f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s,
                    f = f._next;
                this._onUpdate && (0 > a && this._startAt && a !== -1e-4 && this._startAt.render(a, b, c),
                b || (this._time !== h || d || c) && this._callback("onUpdate")),
                e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && a !== -1e-4 && this._startAt.render(a, b, c),
                d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !b && this.vars[e] && this._callback(e),
                0 === i && this._rawPrevTime === m && g !== m && (this._rawPrevTime = 0))
            }
        }
        ,
        h._kill = function(a, b, c) {
            if ("all" === a && (a = null),
            null == a && (null == b || b === this.target))
                return this._lazy = !1,
                this._enabled(!1, !1);
            b = "string" != typeof b ? b || this._targets || this.target : G.selector(b) || b;
            var d, e, f, g, h, i, j, k, l, m = c && this._time && c._startTime === this._startTime && this._timeline === c._timeline;
            if ((p(b) || H(b)) && "number" != typeof b[0])
                for (d = b.length; --d > -1; )
                    this._kill(a, b[d], c) && (i = !0);
            else {
                if (this._targets) {
                    for (d = this._targets.length; --d > -1; )
                        if (b === this._targets[d]) {
                            h = this._propLookup[d] || {},
                            this._overwrittenProps = this._overwrittenProps || [],
                            e = this._overwrittenProps[d] = a ? this._overwrittenProps[d] || {} : "all";
                            break
                        }
                } else {
                    if (b !== this.target)
                        return !1;
                    h = this._propLookup,
                    e = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
                }
                if (h) {
                    if (j = a || h,
                    k = a !== e && "all" !== e && a !== h && ("object" != typeof a || !a._tempKill),
                    c && (G.onOverwrite || this.vars.onOverwrite)) {
                        for (f in j)
                            h[f] && (l || (l = []),
                            l.push(f));
                        if ((l || !a) && !$(this, c, b, l))
                            return !1
                    }
                    for (f in j)
                        (g = h[f]) && (m && (g.f ? g.t[g.p](g.s) : g.t[g.p] = g.s,
                        i = !0),
                        g.pg && g.t._kill(j) && (i = !0),
                        g.pg && 0 !== g.t._overwriteProps.length || (g._prev ? g._prev._next = g._next : g === this._firstPT && (this._firstPT = g._next),
                        g._next && (g._next._prev = g._prev),
                        g._next = g._prev = null),
                        delete h[f]),
                        k && (e[f] = 1);
                    !this._firstPT && this._initted && this._enabled(!1, !1)
                }
            }
            return i
        }
        ,
        h.invalidate = function() {
            return this._notifyPluginsOfEnabled && G._onPluginEvent("_onDisable", this),
            this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null,
            this._notifyPluginsOfEnabled = this._active = this._lazy = !1,
            this._propLookup = this._targets ? {} : [],
            D.prototype.invalidate.call(this),
            this.vars.immediateRender && (this._time = -m,
            this.render(Math.min(0, -this._delay))),
            this
        }
        ,
        h._enabled = function(a, b) {
            if (j || i.wake(),
            a && this._gc) {
                var c, d = this._targets;
                if (d)
                    for (c = d.length; --c > -1; )
                        this._siblings[c] = Z(d[c], this, !0);
                else
                    this._siblings = Z(this.target, this, !0)
            }
            return D.prototype._enabled.call(this, a, b),
            this._notifyPluginsOfEnabled && this._firstPT ? G._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1
        }
        ,
        G.to = function(a, b, c) {
            return new G(a,b,c)
        }
        ,
        G.from = function(a, b, c) {
            return c.runBackwards = !0,
            c.immediateRender = 0 != c.immediateRender,
            new G(a,b,c)
        }
        ,
        G.fromTo = function(a, b, c, d) {
            return d.startAt = c,
            d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
            new G(a,b,d)
        }
        ,
        G.delayedCall = function(a, b, c, d, e) {
            return new G(b,0,{
                delay: a,
                onComplete: b,
                onCompleteParams: c,
                callbackScope: d,
                onReverseComplete: b,
                onReverseCompleteParams: c,
                immediateRender: !1,
                lazy: !1,
                useFrames: e,
                overwrite: 0
            })
        }
        ,
        G.set = function(a, b) {
            return new G(a,0,b)
        }
        ,
        G.getTweensOf = function(a, b) {
            if (null == a)
                return [];
            a = "string" != typeof a ? a : G.selector(a) || a;
            var c, d, e, f;
            if ((p(a) || H(a)) && "number" != typeof a[0]) {
                for (c = a.length,
                d = []; --c > -1; )
                    d = d.concat(G.getTweensOf(a[c], b));
                for (c = d.length; --c > -1; )
                    for (f = d[c],
                    e = c; --e > -1; )
                        f === d[e] && d.splice(c, 1)
            } else
                for (d = Z(a).concat(),
                c = d.length; --c > -1; )
                    (d[c]._gc || b && !d[c].isActive()) && d.splice(c, 1);
            return d
        }
        ,
        G.killTweensOf = G.killDelayedCallsTo = function(a, b, c) {
            "object" == typeof b && (c = b,
            b = !1);
            for (var d = G.getTweensOf(a, b), e = d.length; --e > -1; )
                d[e]._kill(c, a)
        }
        ;
        var ba = t("plugins.TweenPlugin", function(a, b) {
            this._overwriteProps = (a || "").split(","),
            this._propName = this._overwriteProps[0],
            this._priority = b || 0,
            this._super = ba.prototype
        }, !0);
        if (h = ba.prototype,
        ba.version = "1.19.0",
        ba.API = 2,
        h._firstPT = null,
        h._addTween = O,
        h.setRatio = M,
        h._kill = function(a) {
            var b, c = this._overwriteProps, d = this._firstPT;
            if (null != a[this._propName])
                this._overwriteProps = [];
            else
                for (b = c.length; --b > -1; )
                    null != a[c[b]] && c.splice(b, 1);
            for (; d; )
                null != a[d.n] && (d._next && (d._next._prev = d._prev),
                d._prev ? (d._prev._next = d._next,
                d._prev = null) : this._firstPT === d && (this._firstPT = d._next)),
                d = d._next;
            return !1
        }
        ,
        h._mod = h._roundProps = function(a) {
            for (var b, c = this._firstPT; c; )
                b = a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")],
                b && "function" == typeof b && (2 === c.f ? c.t._applyPT.m = b : c.m = b),
                c = c._next
        }
        ,
        G._onPluginEvent = function(a, b) {
            var c, d, e, f, g, h = b._firstPT;
            if ("_onInitAllProps" === a) {
                for (; h; ) {
                    for (g = h._next,
                    d = e; d && d.pr > h.pr; )
                        d = d._next;
                    (h._prev = d ? d._prev : f) ? h._prev._next = h : e = h,
                    (h._next = d) ? d._prev = h : f = h,
                    h = g
                }
                h = b._firstPT = e
            }
            for (; h; )
                h.pg && "function" == typeof h.t[a] && h.t[a]() && (c = !0),
                h = h._next;
            return c
        }
        ,
        ba.activate = function(a) {
            for (var b = a.length; --b > -1; )
                a[b].API === ba.API && (Q[(new a[b])._propName] = a[b]);
            return !0
        }
        ,
        s.plugin = function(a) {
            if (!(a && a.propName && a.init && a.API))
                throw "illegal plugin definition.";
            var b, c = a.propName, d = a.priority || 0, e = a.overwriteProps, f = {
                init: "_onInitTween",
                set: "setRatio",
                kill: "_kill",
                round: "_mod",
                mod: "_mod",
                initAll: "_onInitAllProps"
            }, g = t("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin", function() {
                ba.call(this, c, d),
                this._overwriteProps = e || []
            }, a.global === !0), h = g.prototype = new ba(c);
            h.constructor = g,
            g.API = a.API;
            for (b in f)
                "function" == typeof a[b] && (h[f[b]] = a[b]);
            return g.version = a.version,
            ba.activate([g]),
            g
        }
        ,
        f = a._gsQueue) {
            for (g = 0; g < f.length; g++)
                f[g]();
            for (h in q)
                q[h].func || a.console.log("GSAP encountered missing dependency: " + h)
        }
        j = !1
    }
}("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax");
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(a, b, c) {
        var d = function(b) {
            a.call(this, b),
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._dirty = !0
        }
          , e = 1e-10
          , f = b._internals
          , g = f.lazyTweens
          , h = f.lazyRender
          , i = _gsScope._gsDefine.globals
          , j = new c(null,null,1,0)
          , k = d.prototype = new a;
        return k.constructor = d,
        k.kill()._gc = !1,
        d.version = "1.19.1",
        k.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            a.prototype.invalidate.call(this)
        }
        ,
        k.addCallback = function(a, c, d, e) {
            return this.add(b.delayedCall(0, a, d, e), c)
        }
        ,
        k.removeCallback = function(a, b) {
            if (a)
                if (null == b)
                    this._kill(null, a);
                else
                    for (var c = this.getTweensOf(a, !1), d = c.length, e = this._parseTimeOrLabel(b); --d > -1; )
                        c[d]._startTime === e && c[d]._enabled(!1, !1);
            return this
        }
        ,
        k.removePause = function(b) {
            return this.removeCallback(a._internals.pauseCallback, b)
        }
        ,
        k.tweenTo = function(a, c) {
            c = c || {};
            var d, e, f, g = {
                ease: j,
                useFrames: this.usesFrames(),
                immediateRender: !1
            }, h = c.repeat && i.TweenMax || b;
            for (e in c)
                g[e] = c[e];
            return g.time = this._parseTimeOrLabel(a),
            d = Math.abs(Number(g.time) - this._time) / this._timeScale || .001,
            f = new h(this,d,g),
            g.onStart = function() {
                f.target.paused(!0),
                f.vars.time !== f.target.time() && d === f.duration() && f.duration(Math.abs(f.vars.time - f.target.time()) / f.target._timeScale),
                c.onStart && c.onStart.apply(c.onStartScope || c.callbackScope || f, c.onStartParams || [])
            }
            ,
            f
        }
        ,
        k.tweenFromTo = function(a, b, c) {
            c = c || {},
            a = this._parseTimeOrLabel(a),
            c.startAt = {
                onComplete: this.seek,
                onCompleteParams: [a],
                callbackScope: this
            },
            c.immediateRender = c.immediateRender !== !1;
            var d = this.tweenTo(b, c);
            return d.duration(Math.abs(d.vars.time - a) / this._timeScale || .001)
        }
        ,
        k.render = function(a, b, c) {
            this._gc && this._enabled(!0, !1);
            var d, f, i, j, k, l, m, n, o = this._dirty ? this.totalDuration() : this._totalDuration, p = this._duration, q = this._time, r = this._totalTime, s = this._startTime, t = this._timeScale, u = this._rawPrevTime, v = this._paused, w = this._cycle;
            if (a >= o - 1e-7 && a >= 0)
                this._locked || (this._totalTime = o,
                this._cycle = this._repeat),
                this._reversed || this._hasPausedChild() || (f = !0,
                j = "onComplete",
                k = !!this._timeline.autoRemoveChildren,
                0 === this._duration && (0 >= a && a >= -1e-7 || 0 > u || u === e) && u !== a && this._first && (k = !0,
                u > e && (j = "onReverseComplete"))),
                this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e,
                this._yoyo && 0 !== (1 & this._cycle) ? this._time = a = 0 : (this._time = p,
                a = p + 1e-4);
            else if (1e-7 > a)
                if (this._locked || (this._totalTime = this._cycle = 0),
                this._time = 0,
                (0 !== q || 0 === p && u !== e && (u > 0 || 0 > a && u >= 0) && !this._locked) && (j = "onReverseComplete",
                f = this._reversed),
                0 > a)
                    this._active = !1,
                    this._timeline.autoRemoveChildren && this._reversed ? (k = f = !0,
                    j = "onReverseComplete") : u >= 0 && this._first && (k = !0),
                    this._rawPrevTime = a;
                else {
                    if (this._rawPrevTime = p || !b || a || this._rawPrevTime === a ? a : e,
                    0 === a && f)
                        for (d = this._first; d && 0 === d._startTime; )
                            d._duration || (f = !1),
                            d = d._next;
                    a = 0,
                    this._initted || (k = !0)
                }
            else if (0 === p && 0 > u && (k = !0),
            this._time = this._rawPrevTime = a,
            this._locked || (this._totalTime = a,
            0 !== this._repeat && (l = p + this._repeatDelay,
            this._cycle = this._totalTime / l >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / l && a >= r && this._cycle--,
            this._time = this._totalTime - this._cycle * l,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = p - this._time),
            this._time > p ? (this._time = p,
            a = p + 1e-4) : this._time < 0 ? this._time = a = 0 : a = this._time)),
            this._hasPause && !this._forcingPlayhead && !b && p > a) {
                if (a = this._time,
                a >= q || this._repeat && w !== this._cycle)
                    for (d = this._first; d && d._startTime <= a && !m; )
                        d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (m = d),
                        d = d._next;
                else
                    for (d = this._last; d && d._startTime >= a && !m; )
                        d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (m = d),
                        d = d._prev;
                m && (this._time = a = m._startTime,
                this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
            }
            if (this._cycle !== w && !this._locked) {
                var x = this._yoyo && 0 !== (1 & w)
                  , y = x === (this._yoyo && 0 !== (1 & this._cycle))
                  , z = this._totalTime
                  , A = this._cycle
                  , B = this._rawPrevTime
                  , C = this._time;
                if (this._totalTime = w * p,
                this._cycle < w ? x = !x : this._totalTime += p,
                this._time = q,
                this._rawPrevTime = 0 === p ? u - 1e-4 : u,
                this._cycle = w,
                this._locked = !0,
                q = x ? 0 : p,
                this.render(q, b, 0 === p),
                b || this._gc || this.vars.onRepeat && (this._cycle = A,
                this._locked = !1,
                this._callback("onRepeat")),
                q !== this._time)
                    return;
                if (y && (this._cycle = w,
                this._locked = !0,
                q = x ? p + 1e-4 : -1e-4,
                this.render(q, !0, !1)),
                this._locked = !1,
                this._paused && !v)
                    return;
                this._time = C,
                this._totalTime = z,
                this._cycle = A,
                this._rawPrevTime = B
            }
            if (!(this._time !== q && this._first || c || k || m))
                return void (r !== this._totalTime && this._onUpdate && (b || this._callback("onUpdate")));
            if (this._initted || (this._initted = !0),
            this._active || !this._paused && this._totalTime !== r && a > 0 && (this._active = !0),
            0 === r && this.vars.onStart && (0 === this._totalTime && this._totalDuration || b || this._callback("onStart")),
            n = this._time,
            n >= q)
                for (d = this._first; d && (i = d._next,
                n === this._time && (!this._paused || v)); )
                    (d._active || d._startTime <= this._time && !d._paused && !d._gc) && (m === d && this.pause(),
                    d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                    d = i;
            else
                for (d = this._last; d && (i = d._prev,
                n === this._time && (!this._paused || v)); ) {
                    if (d._active || d._startTime <= q && !d._paused && !d._gc) {
                        if (m === d) {
                            for (m = d._prev; m && m.endTime() > this._time; )
                                m.render(m._reversed ? m.totalDuration() - (a - m._startTime) * m._timeScale : (a - m._startTime) * m._timeScale, b, c),
                                m = m._prev;
                            m = null,
                            this.pause()
                        }
                        d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                    }
                    d = i
                }
            this._onUpdate && (b || (g.length && h(),
            this._callback("onUpdate"))),
            j && (this._locked || this._gc || (s === this._startTime || t !== this._timeScale) && (0 === this._time || o >= this.totalDuration()) && (f && (g.length && h(),
            this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !b && this.vars[j] && this._callback(j)))
        }
        ,
        k.getActive = function(a, b, c) {
            null == a && (a = !0),
            null == b && (b = !0),
            null == c && (c = !1);
            var d, e, f = [], g = this.getChildren(a, b, c), h = 0, i = g.length;
            for (d = 0; i > d; d++)
                e = g[d],
                e.isActive() && (f[h++] = e);
            return f
        }
        ,
        k.getLabelAfter = function(a) {
            a || 0 !== a && (a = this._time);
            var b, c = this.getLabelsArray(), d = c.length;
            for (b = 0; d > b; b++)
                if (c[b].time > a)
                    return c[b].name;
            return null
        }
        ,
        k.getLabelBefore = function(a) {
            null == a && (a = this._time);
            for (var b = this.getLabelsArray(), c = b.length; --c > -1; )
                if (b[c].time < a)
                    return b[c].name;
            return null
        }
        ,
        k.getLabelsArray = function() {
            var a, b = [], c = 0;
            for (a in this._labels)
                b[c++] = {
                    time: this._labels[a],
                    name: a
                };
            return b.sort(function(a, b) {
                return a.time - b.time
            }),
            b
        }
        ,
        k.invalidate = function() {
            return this._locked = !1,
            a.prototype.invalidate.call(this)
        }
        ,
        k.progress = function(a, b) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration()
        }
        ,
        k.totalProgress = function(a, b) {
            return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime / this.totalDuration()
        }
        ,
        k.totalDuration = function(b) {
            return arguments.length ? -1 !== this._repeat && b ? this.timeScale(this.totalDuration() / b) : this : (this._dirty && (a.prototype.totalDuration.call(this),
            this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat),
            this._totalDuration)
        }
        ,
        k.time = function(a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            a > this._duration && (a = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(a, b)) : this._time
        }
        ,
        k.repeat = function(a) {
            return arguments.length ? (this._repeat = a,
            this._uncache(!0)) : this._repeat
        }
        ,
        k.repeatDelay = function(a) {
            return arguments.length ? (this._repeatDelay = a,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        k.yoyo = function(a) {
            return arguments.length ? (this._yoyo = a,
            this) : this._yoyo
        }
        ,
        k.currentLabel = function(a) {
            return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1e-8)
        }
        ,
        d
    }, !0),
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(a, b, c) {
        var d = function(a) {
            b.call(this, a),
            this._labels = {},
            this.autoRemoveChildren = this.vars.autoRemoveChildren === !0,
            this.smoothChildTiming = this.vars.smoothChildTiming === !0,
            this._sortChildren = !0,
            this._onUpdate = this.vars.onUpdate;
            var c, d, e = this.vars;
            for (d in e)
                c = e[d],
                i(c) && -1 !== c.join("").indexOf("{self}") && (e[d] = this._swapSelfInParams(c));
            i(e.tweens) && this.add(e.tweens, 0, e.align, e.stagger)
        }
          , e = 1e-10
          , f = c._internals
          , g = d._internals = {}
          , h = f.isSelector
          , i = f.isArray
          , j = f.lazyTweens
          , k = f.lazyRender
          , l = _gsScope._gsDefine.globals
          , m = function(a) {
            var b, c = {};
            for (b in a)
                c[b] = a[b];
            return c
        }
          , n = function(a, b, c) {
            var d, e, f = a.cycle;
            for (d in f)
                e = f[d],
                a[d] = "function" == typeof e ? e(c, b[c]) : e[c % e.length];
            delete a.cycle
        }
          , o = g.pauseCallback = function() {}
          , p = function(a) {
            var b, c = [], d = a.length;
            for (b = 0; b !== d; c.push(a[b++]))
                ;
            return c
        }
          , q = d.prototype = new b;
        return d.version = "1.19.1",
        q.constructor = d,
        q.kill()._gc = q._forcingPlayhead = q._hasPause = !1,
        q.to = function(a, b, d, e) {
            var f = d.repeat && l.TweenMax || c;
            return b ? this.add(new f(a,b,d), e) : this.set(a, d, e)
        }
        ,
        q.from = function(a, b, d, e) {
            return this.add((d.repeat && l.TweenMax || c).from(a, b, d), e)
        }
        ,
        q.fromTo = function(a, b, d, e, f) {
            var g = e.repeat && l.TweenMax || c;
            return b ? this.add(g.fromTo(a, b, d, e), f) : this.set(a, e, f)
        }
        ,
        q.staggerTo = function(a, b, e, f, g, i, j, k) {
            var l, o, q = new d({
                onComplete: i,
                onCompleteParams: j,
                callbackScope: k,
                smoothChildTiming: this.smoothChildTiming
            }), r = e.cycle;
            for ("string" == typeof a && (a = c.selector(a) || a),
            a = a || [],
            h(a) && (a = p(a)),
            f = f || 0,
            0 > f && (a = p(a),
            a.reverse(),
            f *= -1),
            o = 0; o < a.length; o++)
                l = m(e),
                l.startAt && (l.startAt = m(l.startAt),
                l.startAt.cycle && n(l.startAt, a, o)),
                r && (n(l, a, o),
                null != l.duration && (b = l.duration,
                delete l.duration)),
                q.to(a[o], b, l, o * f);
            return this.add(q, g)
        }
        ,
        q.staggerFrom = function(a, b, c, d, e, f, g, h) {
            return c.immediateRender = 0 != c.immediateRender,
            c.runBackwards = !0,
            this.staggerTo(a, b, c, d, e, f, g, h)
        }
        ,
        q.staggerFromTo = function(a, b, c, d, e, f, g, h, i) {
            return d.startAt = c,
            d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
            this.staggerTo(a, b, d, e, f, g, h, i)
        }
        ,
        q.call = function(a, b, d, e) {
            return this.add(c.delayedCall(0, a, b, d), e)
        }
        ,
        q.set = function(a, b, d) {
            return d = this._parseTimeOrLabel(d, 0, !0),
            null == b.immediateRender && (b.immediateRender = d === this._time && !this._paused),
            this.add(new c(a,0,b), d)
        }
        ,
        d.exportRoot = function(a, b) {
            a = a || {},
            null == a.smoothChildTiming && (a.smoothChildTiming = !0);
            var e, f, g = new d(a), h = g._timeline;
            for (null == b && (b = !0),
            h._remove(g, !0),
            g._startTime = 0,
            g._rawPrevTime = g._time = g._totalTime = h._time,
            e = h._first; e; )
                f = e._next,
                b && e instanceof c && e.target === e.vars.onComplete || g.add(e, e._startTime - e._delay),
                e = f;
            return h.add(g, 0),
            g
        }
        ,
        q.add = function(e, f, g, h) {
            var j, k, l, m, n, o;
            if ("number" != typeof f && (f = this._parseTimeOrLabel(f, 0, !0, e)),
            !(e instanceof a)) {
                if (e instanceof Array || e && e.push && i(e)) {
                    for (g = g || "normal",
                    h = h || 0,
                    j = f,
                    k = e.length,
                    l = 0; k > l; l++)
                        i(m = e[l]) && (m = new d({
                            tweens: m
                        })),
                        this.add(m, j),
                        "string" != typeof m && "function" != typeof m && ("sequence" === g ? j = m._startTime + m.totalDuration() / m._timeScale : "start" === g && (m._startTime -= m.delay())),
                        j += h;
                    return this._uncache(!0)
                }
                if ("string" == typeof e)
                    return this.addLabel(e, f);
                if ("function" != typeof e)
                    throw "Cannot add " + e + " into the timeline; it is not a tween, timeline, function, or string.";
                e = c.delayedCall(0, e)
            }
            if (b.prototype.add.call(this, e, f),
            (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                for (n = this,
                o = n.rawTime() > e._startTime; n._timeline; )
                    o && n._timeline.smoothChildTiming ? n.totalTime(n._totalTime, !0) : n._gc && n._enabled(!0, !1),
                    n = n._timeline;
            return this
        }
        ,
        q.remove = function(b) {
            if (b instanceof a) {
                this._remove(b, !1);
                var c = b._timeline = b.vars.useFrames ? a._rootFramesTimeline : a._rootTimeline;
                return b._startTime = (b._paused ? b._pauseTime : c._time) - (b._reversed ? b.totalDuration() - b._totalTime : b._totalTime) / b._timeScale,
                this
            }
            if (b instanceof Array || b && b.push && i(b)) {
                for (var d = b.length; --d > -1; )
                    this.remove(b[d]);
                return this
            }
            return "string" == typeof b ? this.removeLabel(b) : this.kill(null, b)
        }
        ,
        q._remove = function(a, c) {
            b.prototype._remove.call(this, a, c);
            var d = this._last;
            return d ? this._time > this.duration() && (this._time = this._duration,
            this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0,
            this
        }
        ,
        q.append = function(a, b) {
            return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
        }
        ,
        q.insert = q.insertMultiple = function(a, b, c, d) {
            return this.add(a, b || 0, c, d)
        }
        ,
        q.appendMultiple = function(a, b, c, d) {
            return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
        }
        ,
        q.addLabel = function(a, b) {
            return this._labels[a] = this._parseTimeOrLabel(b),
            this
        }
        ,
        q.addPause = function(a, b, d, e) {
            var f = c.delayedCall(0, o, d, e || this);
            return f.vars.onComplete = f.vars.onReverseComplete = b,
            f.data = "isPause",
            this._hasPause = !0,
            this.add(f, a)
        }
        ,
        q.removeLabel = function(a) {
            return delete this._labels[a],
            this
        }
        ,
        q.getLabelTime = function(a) {
            return null != this._labels[a] ? this._labels[a] : -1
        }
        ,
        q._parseTimeOrLabel = function(b, c, d, e) {
            var f;
            if (e instanceof a && e.timeline === this)
                this.remove(e);
            else if (e && (e instanceof Array || e.push && i(e)))
                for (f = e.length; --f > -1; )
                    e[f]instanceof a && e[f].timeline === this && this.remove(e[f]);
            if ("string" == typeof c)
                return this._parseTimeOrLabel(c, d && "number" == typeof b && null == this._labels[c] ? b - this.duration() : 0, d);
            if (c = c || 0,
            "string" != typeof b || !isNaN(b) && null == this._labels[b])
                null == b && (b = this.duration());
            else {
                if (f = b.indexOf("="),
                -1 === f)
                    return null == this._labels[b] ? d ? this._labels[b] = this.duration() + c : c : this._labels[b] + c;
                c = parseInt(b.charAt(f - 1) + "1", 10) * Number(b.substr(f + 1)),
                b = f > 1 ? this._parseTimeOrLabel(b.substr(0, f - 1), 0, d) : this.duration()
            }
            return Number(b) + c
        }
        ,
        q.seek = function(a, b) {
            return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), b !== !1)
        }
        ,
        q.stop = function() {
            return this.paused(!0)
        }
        ,
        q.gotoAndPlay = function(a, b) {
            return this.play(a, b)
        }
        ,
        q.gotoAndStop = function(a, b) {
            return this.pause(a, b)
        }
        ,
        q.render = function(a, b, c) {
            this._gc && this._enabled(!0, !1);
            var d, f, g, h, i, l, m, n = this._dirty ? this.totalDuration() : this._totalDuration, o = this._time, p = this._startTime, q = this._timeScale, r = this._paused;
            if (a >= n - 1e-7 && a >= 0)
                this._totalTime = this._time = n,
                this._reversed || this._hasPausedChild() || (f = !0,
                h = "onComplete",
                i = !!this._timeline.autoRemoveChildren,
                0 === this._duration && (0 >= a && a >= -1e-7 || this._rawPrevTime < 0 || this._rawPrevTime === e) && this._rawPrevTime !== a && this._first && (i = !0,
                this._rawPrevTime > e && (h = "onReverseComplete"))),
                this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e,
                a = n + 1e-4;
            else if (1e-7 > a)
                if (this._totalTime = this._time = 0,
                (0 !== o || 0 === this._duration && this._rawPrevTime !== e && (this._rawPrevTime > 0 || 0 > a && this._rawPrevTime >= 0)) && (h = "onReverseComplete",
                f = this._reversed),
                0 > a)
                    this._active = !1,
                    this._timeline.autoRemoveChildren && this._reversed ? (i = f = !0,
                    h = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (i = !0),
                    this._rawPrevTime = a;
                else {
                    if (this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e,
                    0 === a && f)
                        for (d = this._first; d && 0 === d._startTime; )
                            d._duration || (f = !1),
                            d = d._next;
                    a = 0,
                    this._initted || (i = !0)
                }
            else {
                if (this._hasPause && !this._forcingPlayhead && !b) {
                    if (a >= o)
                        for (d = this._first; d && d._startTime <= a && !l; )
                            d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (l = d),
                            d = d._next;
                    else
                        for (d = this._last; d && d._startTime >= a && !l; )
                            d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (l = d),
                            d = d._prev;
                    l && (this._time = a = l._startTime,
                    this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                }
                this._totalTime = this._time = this._rawPrevTime = a
            }
            if (this._time !== o && this._first || c || i || l) {
                if (this._initted || (this._initted = !0),
                this._active || !this._paused && this._time !== o && a > 0 && (this._active = !0),
                0 === o && this.vars.onStart && (0 === this._time && this._duration || b || this._callback("onStart")),
                m = this._time,
                m >= o)
                    for (d = this._first; d && (g = d._next,
                    m === this._time && (!this._paused || r)); )
                        (d._active || d._startTime <= m && !d._paused && !d._gc) && (l === d && this.pause(),
                        d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                        d = g;
                else
                    for (d = this._last; d && (g = d._prev,
                    m === this._time && (!this._paused || r)); ) {
                        if (d._active || d._startTime <= o && !d._paused && !d._gc) {
                            if (l === d) {
                                for (l = d._prev; l && l.endTime() > this._time; )
                                    l.render(l._reversed ? l.totalDuration() - (a - l._startTime) * l._timeScale : (a - l._startTime) * l._timeScale, b, c),
                                    l = l._prev;
                                l = null,
                                this.pause()
                            }
                            d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                        }
                        d = g
                    }
                this._onUpdate && (b || (j.length && k(),
                this._callback("onUpdate"))),
                h && (this._gc || (p === this._startTime || q !== this._timeScale) && (0 === this._time || n >= this.totalDuration()) && (f && (j.length && k(),
                this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !b && this.vars[h] && this._callback(h)))
            }
        }
        ,
        q._hasPausedChild = function() {
            for (var a = this._first; a; ) {
                if (a._paused || a instanceof d && a._hasPausedChild())
                    return !0;
                a = a._next
            }
            return !1
        }
        ,
        q.getChildren = function(a, b, d, e) {
            e = e || -9999999999;
            for (var f = [], g = this._first, h = 0; g; )
                g._startTime < e || (g instanceof c ? b !== !1 && (f[h++] = g) : (d !== !1 && (f[h++] = g),
                a !== !1 && (f = f.concat(g.getChildren(!0, b, d)),
                h = f.length))),
                g = g._next;
            return f
        }
        ,
        q.getTweensOf = function(a, b) {
            var d, e, f = this._gc, g = [], h = 0;
            for (f && this._enabled(!0, !0),
            d = c.getTweensOf(a),
            e = d.length; --e > -1; )
                (d[e].timeline === this || b && this._contains(d[e])) && (g[h++] = d[e]);
            return f && this._enabled(!1, !0),
            g
        }
        ,
        q.recent = function() {
            return this._recent
        }
        ,
        q._contains = function(a) {
            for (var b = a.timeline; b; ) {
                if (b === this)
                    return !0;
                b = b.timeline
            }
            return !1
        }
        ,
        q.shiftChildren = function(a, b, c) {
            c = c || 0;
            for (var d, e = this._first, f = this._labels; e; )
                e._startTime >= c && (e._startTime += a),
                e = e._next;
            if (b)
                for (d in f)
                    f[d] >= c && (f[d] += a);
            return this._uncache(!0)
        }
        ,
        q._kill = function(a, b) {
            if (!a && !b)
                return this._enabled(!1, !1);
            for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, e = !1; --d > -1; )
                c[d]._kill(a, b) && (e = !0);
            return e
        }
        ,
        q.clear = function(a) {
            var b = this.getChildren(!1, !0, !0)
              , c = b.length;
            for (this._time = this._totalTime = 0; --c > -1; )
                b[c]._enabled(!1, !1);
            return a !== !1 && (this._labels = {}),
            this._uncache(!0)
        }
        ,
        q.invalidate = function() {
            for (var b = this._first; b; )
                b.invalidate(),
                b = b._next;
            return a.prototype.invalidate.call(this)
        }
        ,
        q._enabled = function(a, c) {
            if (a === this._gc)
                for (var d = this._first; d; )
                    d._enabled(a, !0),
                    d = d._next;
            return b.prototype._enabled.call(this, a, c)
        }
        ,
        q.totalTime = function(b, c, d) {
            this._forcingPlayhead = !0;
            var e = a.prototype.totalTime.apply(this, arguments);
            return this._forcingPlayhead = !1,
            e
        }
        ,
        q.duration = function(a) {
            return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a),
            this) : (this._dirty && this.totalDuration(),
            this._duration)
        }
        ,
        q.totalDuration = function(a) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var b, c, d = 0, e = this._last, f = 999999999999; e; )
                        b = e._prev,
                        e._dirty && e.totalDuration(),
                        e._startTime > f && this._sortChildren && !e._paused ? this.add(e, e._startTime - e._delay) : f = e._startTime,
                        e._startTime < 0 && !e._paused && (d -= e._startTime,
                        this._timeline.smoothChildTiming && (this._startTime += e._startTime / this._timeScale),
                        this.shiftChildren(-e._startTime, !1, -9999999999),
                        f = 0),
                        c = e._startTime + e._totalDuration / e._timeScale,
                        c > d && (d = c),
                        e = b;
                    this._duration = this._totalDuration = d,
                    this._dirty = !1
                }
                return this._totalDuration
            }
            return a && this.totalDuration() ? this.timeScale(this._totalDuration / a) : this
        }
        ,
        q.paused = function(b) {
            if (!b)
                for (var c = this._first, d = this._time; c; )
                    c._startTime === d && "isPause" === c.data && (c._rawPrevTime = 0),
                    c = c._next;
            return a.prototype.paused.apply(this, arguments)
        }
        ,
        q.usesFrames = function() {
            for (var b = this._timeline; b._timeline; )
                b = b._timeline;
            return b === a._rootFramesTimeline
        }
        ,
        q.rawTime = function(a) {
            return a && (this._paused || this._repeat && this.time() > 0 && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(a) - this._startTime) * this._timeScale
        }
        ,
        d
    }, !0)
}),
_gsScope._gsDefine && _gsScope._gsQueue.pop()(),
function(a) {
    "use strict";
    var b = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[a]
    };
    "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("./TweenLite.js"),
    module.exports = b())
}("TimelineMax");
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    var a = document.documentElement
      , b = _gsScope
      , c = function(c, d) {
        var e = "x" === d ? "Width" : "Height"
          , f = "scroll" + e
          , g = "client" + e
          , h = document.body;
        return c === b || c === a || c === h ? Math.max(a[f], h[f]) - (b["inner" + e] || a[g] || h[g]) : c[f] - c["offset" + e]
    }
      , d = function(a) {
        return "string" == typeof a && (a = TweenLite.selector(a)),
        a.length && a !== b && a[0] && a[0].style && !a.nodeType && (a = a[0]),
        a === b || a.nodeType && a.style ? a : null
    }
      , e = function(c, d) {
        var e = "scroll" + ("x" === d ? "Left" : "Top");
        return c === b && (null != c.pageXOffset ? e = "page" + d.toUpperCase() + "Offset" : c = null != a[e] ? a : document.body),
        function() {
            return c[e]
        }
    }
      , f = function(c, f) {
        var g = d(c).getBoundingClientRect()
          , h = !f || f === b || f === document.body
          , i = (h ? a : f).getBoundingClientRect()
          , j = {
            x: g.left - i.left,
            y: g.top - i.top
        };
        return !h && f && (j.x += e(f, "x")(),
        j.y += e(f, "y")()),
        j
    }
      , g = function(a, b, d) {
        var e = typeof a;
        return "number" === e || "string" === e && "=" === a.charAt(1) ? a : "max" === a ? c(b, d) : Math.min(c(b, d), f(a, b)[d])
    }
      , h = _gsScope._gsDefine.plugin({
        propName: "scrollTo",
        API: 2,
        global: !0,
        version: "1.8.1",
        init: function(a, c, d) {
            return this._wdw = a === b,
            this._target = a,
            this._tween = d,
            "object" != typeof c ? (c = {
                y: c
            },
            "string" == typeof c.y && "max" !== c.y && "=" !== c.y.charAt(1) && (c.x = c.y)) : c.nodeType && (c = {
                y: c,
                x: c
            }),
            this.vars = c,
            this._autoKill = c.autoKill !== !1,
            this.getX = e(a, "x"),
            this.getY = e(a, "y"),
            this.x = this.xPrev = this.getX(),
            this.y = this.yPrev = this.getY(),
            null != c.x ? (this._addTween(this, "x", this.x, g(c.x, a, "x") - (c.offsetX || 0), "scrollTo_x", !0),
            this._overwriteProps.push("scrollTo_x")) : this.skipX = !0,
            null != c.y ? (this._addTween(this, "y", this.y, g(c.y, a, "y") - (c.offsetY || 0), "scrollTo_y", !0),
            this._overwriteProps.push("scrollTo_y")) : this.skipY = !0,
            !0
        },
        set: function(a) {
            this._super.setRatio.call(this, a);
            var d = this._wdw || !this.skipX ? this.getX() : this.xPrev
              , e = this._wdw || !this.skipY ? this.getY() : this.yPrev
              , f = e - this.yPrev
              , g = d - this.xPrev
              , i = h.autoKillThreshold;
            this.x < 0 && (this.x = 0),
            this.y < 0 && (this.y = 0),
            this._autoKill && (!this.skipX && (g > i || -i > g) && d < c(this._target, "x") && (this.skipX = !0),
            !this.skipY && (f > i || -i > f) && e < c(this._target, "y") && (this.skipY = !0),
            this.skipX && this.skipY && (this._tween.kill(),
            this.vars.onAutoKill && this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []))),
            this._wdw ? b.scrollTo(this.skipX ? d : this.x, this.skipY ? e : this.y) : (this.skipY || (this._target.scrollTop = this.y),
            this.skipX || (this._target.scrollLeft = this.x)),
            this.xPrev = this.x,
            this.yPrev = this.y
        }
    })
      , i = h.prototype;
    h.max = c,
    h.getOffset = f,
    h.autoKillThreshold = 7,
    i._kill = function(a) {
        return a.scrollTo_x && (this.skipX = !0),
        a.scrollTo_y && (this.skipY = !0),
        this._super._kill.call(this, a)
    }
}),
_gsScope._gsDefine && _gsScope._gsQueue.pop()(),
function(a) {
    "use strict";
    var b = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[a]
    };
    "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("../TweenLite.min.js"),
    module.exports = b())
}("ScrollToPlugin");
(function($) {
    $.fn.flowtype = function(options) {
        var settings = $.extend({
            maximum: 9999,
            minimum: 1,
            maxFont: 9999,
            minFont: 1,
            fontRatio: 35
        }, options)
          , changes = function(el) {
            var $el = $(el)
              , elw = $el.width()
              , width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw
              , fontBase = width / settings.fontRatio
              , fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
            $el.css("font-size", fontSize + "px")
        };
        return this.each(function() {
            var that = this;
            $(window).resize(function() {
                changes(that)
            });
            changes(this)
        })
    }
}
)(jQuery);
(function($, window, document, undefined) {
    (function() {
        var lastTime = 0;
        var vendors = ["ms", "moz", "webkit", "o"];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
            window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"]
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback) {
                var currTime = (new Date).getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall)
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id
            }
            ;
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id)
            }
    }
    )();
    function Parallax(element, options) {
        var self = this;
        if (typeof options == "object") {
            delete options.refresh;
            delete options.render;
            $.extend(this, options)
        }
        this.$element = $(element);
        if (!this.imageSrc && this.$element.is("img")) {
            this.imageSrc = this.$element.attr("src")
        }
        var positions = (this.position + "").toLowerCase().match(/\S+/g) || [];
        if (positions.length < 1) {
            positions.push("center")
        }
        if (positions.length == 1) {
            positions.push(positions[0])
        }
        if (positions[0] == "top" || positions[0] == "bottom" || positions[1] == "left" || positions[1] == "right") {
            positions = [positions[1], positions[0]]
        }
        if (this.positionX != undefined)
            positions[0] = this.positionX.toLowerCase();
        if (this.positionY != undefined)
            positions[1] = this.positionY.toLowerCase();
        self.positionX = positions[0];
        self.positionY = positions[1];
        if (this.positionX != "left" && this.positionX != "right") {
            if (isNaN(parseInt(this.positionX))) {
                this.positionX = "center"
            } else {
                this.positionX = parseInt(this.positionX)
            }
        }
        if (this.positionY != "top" && this.positionY != "bottom") {
            if (isNaN(parseInt(this.positionY))) {
                this.positionY = "center"
            } else {
                this.positionY = parseInt(this.positionY)
            }
        }
        this.position = this.positionX + (isNaN(this.positionX) ? "" : "px") + " " + this.positionY + (isNaN(this.positionY) ? "" : "px");
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            if (this.imageSrc && this.iosFix && !this.$element.is("img")) {
                this.$element.css({
                    backgroundImage: "url(" + this.imageSrc + ")",
                    backgroundSize: "cover",
                    backgroundPosition: this.position
                })
            }
            return this
        }
        if (navigator.userAgent.match(/(Android)/)) {
            if (this.imageSrc && this.androidFix && !this.$element.is("img")) {
                this.$element.css({
                    backgroundImage: "url(" + this.imageSrc + ")",
                    backgroundSize: "cover",
                    backgroundPosition: this.position
                })
            }
            return this
        }
        this.$mirror = $("<div />").prependTo("body");
        var slider = this.$element.find(">.parallax-slider");
        var sliderExisted = false;
        if (slider.length == 0)
            this.$slider = $("<img />").prependTo(this.$mirror);
        else {
            this.$slider = slider.prependTo(this.$mirror);
            sliderExisted = true
        }
        this.$mirror.addClass("parallax-mirror").css({
            visibility: "hidden",
            zIndex: this.zIndex,
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "hidden"
        });
        this.$slider.addClass("parallax-slider").one("load", function() {
            if (!self.naturalHeight || !self.naturalWidth) {
                self.naturalHeight = this.naturalHeight || this.height || 1;
                self.naturalWidth = this.naturalWidth || this.width || 1
            }
            self.aspectRatio = self.naturalWidth / self.naturalHeight;
            Parallax.isSetup || Parallax.setup();
            Parallax.sliders.push(self);
            Parallax.isFresh = false;
            Parallax.requestRender()
        });
        if (!sliderExisted)
            this.$slider[0].src = this.imageSrc;
        if (this.naturalHeight && this.naturalWidth || this.$slider[0].complete || slider.length > 0) {
            this.$slider.trigger("load")
        }
    }
    $.extend(Parallax.prototype, {
        speed: .2,
        bleed: 0,
        zIndex: -100,
        iosFix: true,
        androidFix: true,
        position: "center",
        overScrollFix: false,
        refresh: function() {
            this.boxWidth = this.$element.outerWidth();
            this.boxHeight = this.$element.outerHeight() + this.bleed * 2;
            this.boxOffsetTop = this.$element.offset().top - this.bleed;
            this.boxOffsetLeft = this.$element.offset().left;
            this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;
            var winHeight = Parallax.winHeight;
            var docHeight = Parallax.docHeight;
            var maxOffset = Math.min(this.boxOffsetTop, docHeight - winHeight);
            var minOffset = Math.max(this.boxOffsetTop + this.boxHeight - winHeight, 0);
            var imageHeightMin = this.boxHeight + (maxOffset - minOffset) * (1 - this.speed) | 0;
            var imageOffsetMin = (this.boxOffsetTop - maxOffset) * (1 - this.speed) | 0;
            if (imageHeightMin * this.aspectRatio >= this.boxWidth) {
                this.imageWidth = imageHeightMin * this.aspectRatio | 0;
                this.imageHeight = imageHeightMin;
                this.offsetBaseTop = imageOffsetMin;
                var margin = this.imageWidth - this.boxWidth;
                if (this.positionX == "left") {
                    this.offsetLeft = 0
                } else if (this.positionX == "right") {
                    this.offsetLeft = -margin
                } else if (!isNaN(this.positionX)) {
                    this.offsetLeft = Math.max(this.positionX, -margin)
                } else {
                    this.offsetLeft = -margin / 2 | 0
                }
            } else {
                this.imageWidth = this.boxWidth;
                this.imageHeight = this.boxWidth / this.aspectRatio | 0;
                this.offsetLeft = 0;
                var margin = this.imageHeight - imageHeightMin;
                if (this.positionY == "top") {
                    this.offsetBaseTop = imageOffsetMin
                } else if (this.positionY == "bottom") {
                    this.offsetBaseTop = imageOffsetMin - margin
                } else if (!isNaN(this.positionY)) {
                    this.offsetBaseTop = imageOffsetMin + Math.max(this.positionY, -margin)
                } else {
                    this.offsetBaseTop = imageOffsetMin - margin / 2 | 0
                }
            }
        },
        render: function() {
            var scrollTop = Parallax.scrollTop;
            var scrollLeft = Parallax.scrollLeft;
            var overScroll = this.overScrollFix ? Parallax.overScroll : 0;
            var scrollBottom = scrollTop + Parallax.winHeight;
            if (this.boxOffsetBottom > scrollTop && this.boxOffsetTop <= scrollBottom) {
                this.visibility = "visible";
                this.mirrorTop = this.boxOffsetTop - scrollTop;
                this.mirrorLeft = this.boxOffsetLeft - scrollLeft;
                this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed)
            } else {
                this.visibility = "hidden"
            }
            this.$mirror.css({
                transform: "translate3d(0px, 0px, 0px)",
                visibility: this.visibility,
                top: this.mirrorTop - overScroll,
                left: this.mirrorLeft,
                height: this.boxHeight,
                width: this.boxWidth
            });
            this.$slider.css({
                transform: "translate3d(0px, 0px, 0px)",
                position: "absolute",
                top: this.offsetTop,
                left: this.offsetLeft,
                height: this.imageHeight,
                width: this.imageWidth,
                maxWidth: "none"
            })
        }
    });
    $.extend(Parallax, {
        scrollTop: 0,
        scrollLeft: 0,
        winHeight: 0,
        winWidth: 0,
        docHeight: 1 << 30,
        docWidth: 1 << 30,
        sliders: [],
        isReady: false,
        isFresh: false,
        isBusy: false,
        setup: function() {
            if (this.isReady)
                return;
            var $doc = $(document)
              , $win = $(window);
            var loadDimensions = function() {
                Parallax.winHeight = $win.height();
                Parallax.winWidth = $win.width();
                Parallax.docHeight = $doc.height();
                Parallax.docWidth = $doc.width()
            };
            var loadScrollPosition = function() {
                var winScrollTop = $win.scrollTop();
                var scrollTopMax = Parallax.docHeight - Parallax.winHeight;
                var scrollLeftMax = Parallax.docWidth - Parallax.winWidth;
                Parallax.scrollTop = Math.max(0, Math.min(scrollTopMax, winScrollTop));
                Parallax.scrollLeft = Math.max(0, Math.min(scrollLeftMax, $win.scrollLeft()));
                Parallax.overScroll = Math.max(winScrollTop - scrollTopMax, Math.min(winScrollTop, 0))
            };
            $win.on("resize.px.parallax load.px.parallax", function() {
                loadDimensions();
                Parallax.isFresh = false;
                Parallax.requestRender()
            }).on("scroll.px.parallax load.px.parallax", function() {
                loadScrollPosition();
                Parallax.requestRender()
            });
            loadDimensions();
            loadScrollPosition();
            this.isReady = true
        },
        configure: function(options) {
            if (typeof options == "object") {
                delete options.refresh;
                delete options.render;
                $.extend(this.prototype, options)
            }
        },
        refresh: function() {
            $.each(this.sliders, function() {
                this.refresh()
            });
            this.isFresh = true
        },
        render: function() {
            this.isFresh || this.refresh();
            $.each(this.sliders, function() {
                this.render()
            })
        },
        requestRender: function() {
            var self = this;
            if (!this.isBusy) {
                this.isBusy = true;
                window.requestAnimationFrame(function() {
                    self.render();
                    self.isBusy = false
                })
            }
        },
        destroy: function(el) {
            var i, parallaxElement = $(el).data("px.parallax");
            parallaxElement.$mirror.remove();
            for (i = 0; i < this.sliders.length; i += 1) {
                if (this.sliders[i] == parallaxElement) {
                    this.sliders.splice(i, 1)
                }
            }
            $(el).data("px.parallax", false);
            if (this.sliders.length === 0) {
                $(window).off("scroll.px.parallax resize.px.parallax load.px.parallax");
                this.isReady = false;
                Parallax.isSetup = false
            }
        }
    });
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var options = typeof option == "object" && option;
            if (this == window || this == document || $this.is("body")) {
                Parallax.configure(options)
            } else if (!$this.data("px.parallax")) {
                options = $.extend({}, $this.data(), options);
                $this.data("px.parallax", new Parallax(this,options))
            } else if (typeof option == "object") {
                $.extend($this.data("px.parallax"), options)
            }
            if (typeof option == "string") {
                if (option == "destroy") {
                    Parallax["destroy"](this)
                } else {
                    Parallax[option]()
                }
            }
        })
    }
    var old = $.fn.parallax;
    $.fn.parallax = Plugin;
    $.fn.parallax.Constructor = Parallax;
    $.fn.parallax.noConflict = function() {
        $.fn.parallax = old;
        return this
    }
    ;
    $(document).on("ready.px.parallax.data-api", function() {
        $('[data-parallax="scroll"]').parallax()
    })
}
)(jQuery, window, document);
!function(a, b) {
    function d(c, d) {
        c = a(c);
        var e = c.is("body")
          , g = c.data("LoadingOverlayCount");
        if (g === b && (g = 0),
        0 == g) {
            var h = a("<div>", {
                "class": "loadingoverlay",
                css: {
                    "background-color": d.color,
                    display: "flex",
                    "flex-direction": "column",
                    "align-items": "center",
                    "justify-content": "center"
                }
            });
            if (d.zIndex !== b && h.css("z-index", d.zIndex),
            d.image && h.css({
                "background-image": "url(" + d.image + ")",
                "background-position": "center center",
                "background-repeat": "no-repeat"
            }),
            d.fontawesome && a("<div>", {
                "class": "loadingoverlay_fontawesome " + d.fontawesome
            }).appendTo(h),
            d.custom && a(d.custom).appendTo(h),
            e ? h.css({
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            }) : (h.css({
                position: "absolute",
                top: 0,
                left: 0
            }),
            "static" == c.css("position") && h.css({
                top: c.position().top + parseInt(c.css("margin-top")) + parseInt(c.css("border-top-width")),
                left: c.position().left + parseInt(c.css("margin-left")) + parseInt(c.css("border-left-width"))
            })),
            f(c, h, d, e),
            d.resizeInterval > 0) {
                var i = setInterval(function() {
                    f(c, h, d, e)
                }, d.resizeInterval);
                c.data("LoadingOverlayResizeIntervalId", i)
            }
            d.fade ? d.fade === !0 ? d.fade = [400, 200] : ("string" == typeof d.fade || "number" == typeof d.fade) && (d.fade = [d.fade, d.fade]) : d.fade = [0, 0],
            c.data("LoadingOverlayFadeOutDuration", d.fade[1]),
            h.hide().appendTo(c).fadeIn(d.fade[0])
        }
        g++,
        c.data("LoadingOverlayCount", g)
    }
    function e(c, d) {
        c = a(c);
        var e = c.data("LoadingOverlayCount");
        if (e !== b)
            if (e--,
            d || 0 >= e) {
                var f = c.data("LoadingOverlayResizeIntervalId");
                f && clearInterval(f),
                c.children(".loadingoverlay").fadeOut(c.data("LoadingOverlayFadeOutDuration"), function() {
                    a(this).remove()
                }),
                c.removeData(["LoadingOverlayCount", "LoadingOverlayFadeOutDuration", "LoadingOverlayResizeIntervalId"])
            } else
                c.data("LoadingOverlayCount", e)
    }
    function f(b, c, d, e) {
        e || c.css({
            width: b.innerWidth(),
            height: b.innerHeight()
        });
        var f = "auto";
        if (d.size && "auto" != d.size) {
            var g = e ? a(window) : b;
            f = Math.min(g.innerWidth(), g.innerHeight()) * parseFloat(d.size) / 100,
            d.maxSize && f > parseInt(d.maxSize) && (f = parseInt(d.maxSize) + "px"),
            d.minSize && f < parseInt(d.minSize) && (f = parseInt(d.minSize) + "px")
        }
        c.css("background-size", f),
        c.children(".loadingoverlay_fontawesome").css("font-size", f)
    }
    var c = {
        color: "rgba(255, 255, 255, 0.8)",
        custom: "",
        fade: !0,
        fontawesome: "",
        image: "loading.gif",
        maxSize: "100px",
        minSize: "20px",
        resizeInterval: 0,
        size: "50%",
        zIndex: b
    };
    a.LoadingOverlaySetup = function(b) {
        a.extend(!0, c, b)
    }
    ,
    a.LoadingOverlay = function(b, f) {
        switch (b.toLowerCase()) {
        case "show":
            var g = a.extend(!0, {}, c, f);
            d("body", g);
            break;
        case "hide":
            e("body", f)
        }
    }
    ,
    a.fn.LoadingOverlay = function(b, f) {
        switch (b.toLowerCase()) {
        case "show":
            var g = a.extend(!0, {}, c, f);
            return this.each(function() {
                d(this, g)
            });
        case "hide":
            return this.each(function() {
                e(this, f)
            })
        }
    }
}(jQuery);
(function($) {
    $.fn.onScreen = function(options) {
        var params = {
            container: window,
            direction: "vertical",
            toggleClass: null,
            doIn: null,
            doOut: null,
            tolerance: 0,
            throttle: null,
            lazyAttr: null,
            lazyPlaceholder: "data:image/gif;base64,R0lGODlhEAAFAIAAAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQAAACwAAAAAEAAFAAACCIyPqcvtD00BACH5BAkJAAIALAAAAAAQAAUAgfT29Pz6/P///wAAAAIQTGCiywKPmjxUNhjtMlWrAgAh+QQJCQAFACwAAAAAEAAFAIK8urzc2tzEwsS8vrzc3tz///8AAAAAAAADFEiyUf6wCEBHvLPemIHdTzCMDegkACH5BAkJAAYALAAAAAAQAAUAgoSChLS2tIyKjLy+vIyOjMTCxP///wAAAAMUWCQ09jAaAiqQmFosdeXRUAkBCCUAIfkECQkACAAsAAAAABAABQCDvLq83N7c3Nrc9Pb0xMLE/P78vL68/Pr8////AAAAAAAAAAAAAAAAAAAAAAAAAAAABCEwkCnKGbegvQn4RjGMx8F1HxBi5Il4oEiap2DcVYlpZwQAIfkECQkACAAsAAAAABAABQCDvLq85OLkxMLE9Pb0vL685ObkxMbE/Pr8////AAAAAAAAAAAAAAAAAAAAAAAAAAAABCDwnCGHEcIMxPn4VAGMQNBx0zQEZHkiYNiap5RaBKG9EQAh+QQJCQAJACwAAAAAEAAFAIOEgoTMysyMjozs6uyUlpSMiozMzsyUkpTs7uz///8AAAAAAAAAAAAAAAAAAAAAAAAEGTBJiYgoBM09DfhAwHEeKI4dGKLTIHzCwEUAIfkECQkACAAsAAAAABAABQCDvLq85OLkxMLE9Pb0vL685ObkxMbE/Pr8////AAAAAAAAAAAAAAAAAAAAAAAAAAAABCAQSTmMEGaco8+UBSACwWBqHxKOJYd+q1iaXFoRRMbtEQAh+QQJCQAIACwAAAAAEAAFAIO8urzc3tzc2tz09vTEwsT8/vy8vrz8+vz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAEIhBJWc6wJZAtJh3gcRBAaXiIZV2kiRbgNZbA6VXiUAhGL0QAIfkECQkABgAsAAAAABAABQCChIKEtLa0jIqMvL68jI6MxMLE////AAAAAxRoumxFgoxGCbiANos145e3DJcQJAAh+QQJCQAFACwAAAAAEAAFAIK8urzc2tzEwsS8vrzc3tz///8AAAAAAAADFFi6XCQwtCmAHbPVm9kGWKcEQxkkACH5BAkJAAIALAAAAAAQAAUAgfT29Pz6/P///wAAAAIRlI8SAZsPYnuJMUCRnNksWwAAOw==",
            debug: false
        };
        if (options !== "remove") {
            $.extend(params, options)
        }
        return this.each(function() {
            var self = this;
            var isOnScreen = false;
            var scrollTop;
            var scrollLeft;
            var $el = $(this);
            var $container;
            var containerHeight;
            var containerWidth;
            var containerBottom;
            var containerRight;
            var elHeight;
            var elWidth;
            var elTop;
            var elLeft;
            var containerIsWindow = $.isWindow(params.container);
            function remove() {
                $(self).off("scroll.onScreen resize.onScreen");
                $(window).off("resize.onScreen")
            }
            function verticalIn() {
                if (containerIsWindow) {
                    return elTop < containerBottom - params.tolerance && scrollTop < elTop + elHeight - params.tolerance
                } else {
                    return elTop < containerHeight - params.tolerance && elTop > -elHeight + params.tolerance
                }
            }
            function verticalOut() {
                if (containerIsWindow) {
                    return elTop + (elHeight - params.tolerance) < scrollTop || elTop > containerBottom - params.tolerance
                } else {
                    return elTop > containerHeight - params.tolerance || -elHeight + params.tolerance > elTop
                }
            }
            function horizontalIn() {
                if (containerIsWindow) {
                    return elLeft < containerRight - params.tolerance && scrollLeft < elLeft + elWidth - params.tolerance
                } else {
                    return elLeft < containerWidth - params.tolerance && elLeft > -elWidth + params.tolerance
                }
            }
            function horizontalOut() {
                if (containerIsWindow) {
                    return elLeft + (elWidth - params.tolerance) < scrollLeft || elLeft > containerRight - params.tolerance
                } else {
                    return elLeft > containerWidth - params.tolerance || -elWidth + params.tolerance > elLeft
                }
            }
            function directionIn() {
                if (isOnScreen) {
                    return false
                }
                if (params.direction === "horizontal") {
                    return horizontalIn()
                } else {
                    return verticalIn()
                }
            }
            function directionOut() {
                if (!isOnScreen) {
                    return false
                }
                if (params.direction === "horizontal") {
                    return horizontalOut()
                } else {
                    return verticalOut()
                }
            }
            function throttle(fn, timeout, ctx) {
                var timer, args, needInvoke;
                return function() {
                    args = arguments;
                    needInvoke = true;
                    ctx = ctx || this;
                    if (!timer) {
                        (function() {
                            if (needInvoke) {
                                fn.apply(ctx, args);
                                needInvoke = false;
                                timer = setTimeout(arguments.callee, timeout)
                            } else {
                                timer = null
                            }
                        }
                        )()
                    }
                }
            }
            if (options === "remove") {
                remove();
                return
            }
            var checkPos = function() {
                if (!containerIsWindow && $(params.container).css("position") === "static") {
                    $(params.container).css("position", "relative")
                }
                $container = $(params.container);
                containerHeight = $container.height();
                containerWidth = $container.width();
                containerBottom = $container.scrollTop() + containerHeight;
                containerRight = $container.scrollLeft() + containerWidth;
                elHeight = $el.outerHeight(true);
                elWidth = $el.outerWidth(true);
                if (containerIsWindow) {
                    var offset = $el.offset();
                    elTop = offset.top;
                    elLeft = offset.left
                } else {
                    var position = $el.position();
                    elTop = position.top;
                    elLeft = position.left
                }
                scrollTop = $container.scrollTop();
                scrollLeft = $container.scrollLeft();
                if (params.debug) {
                    console.log("Container: " + params.container + "\n" + "Width: " + containerHeight + "\n" + "Height: " + containerWidth + "\n" + "Bottom: " + containerBottom + "\n" + "Right: " + containerRight);
                    console.log("Matched element: " + ($el.attr("class") !== undefined ? $el.prop("tagName").toLowerCase() + "." + $el.attr("class") : $el.prop("tagName").toLowerCase()) + "\n" + "Left: " + elLeft + "\n" + "Top: " + elTop + "\n" + "Width: " + elWidth + "\n" + "Height: " + elHeight)
                }
                if (directionIn()) {
                    if (params.toggleClass) {
                        $el.addClass(params.toggleClass)
                    }
                    if ($.isFunction(params.doIn)) {
                        params.doIn.call($el[0])
                    }
                    if (params.lazyAttr && $el.prop("tagName") === "IMG") {
                        var lazyImg = $el.attr(params.lazyAttr);
                        if (lazyImg !== $el.prop("src")) {
                            $el.css({
                                background: "url(" + params.lazyPlaceholder + ") 50% 50% no-repeat",
                                minHeight: "5px",
                                minWidth: "16px"
                            });
                            $el.prop("src", lazyImg).load(function() {
                                $(this).css({
                                    background: "none"
                                })
                            })
                        }
                    }
                    isOnScreen = true
                } else if (directionOut()) {
                    if (params.toggleClass) {
                        $el.removeClass(params.toggleClass)
                    }
                    if ($.isFunction(params.doOut)) {
                        params.doOut.call($el[0])
                    }
                    isOnScreen = false
                }
            };
            if (window.location.hash) {
                throttle(checkPos, 50)
            } else {
                checkPos()
            }
            if (params.throttle) {
                checkPos = throttle(checkPos, params.throttle)
            }
            $(params.container).on("scroll.onScreen resize.onScreen", checkPos);
            if (!containerIsWindow) {
                $(window).on("resize.onScreen", checkPos)
            }
            if (typeof module === "object" && module && typeof module.exports === "object") {
                module.exports = jQuery
            } else {
                if (typeof define === "function" && define.amd) {
                    define("jquery-onscreen", [], function() {
                        return jQuery
                    })
                }
            }
        })
    }
}
)(jQuery);
!function(a, b, c) {
    function d(a, c) {
        var d = b(a);
        d.data(f, this),
        this._$element = d,
        this.shares = [],
        this._init(c),
        this._render()
    }
    var e = "JSSocials"
      , f = e
      , g = function(a, c) {
        return b.isFunction(a) ? a.apply(c, b.makeArray(arguments).slice(2)) : a
    }
      , h = /(\.(jpeg|png|gif|bmp|svg)$|^data:image\/(jpeg|png|gif|bmp|svg\+xml);base64)/i
      , i = /(&?[a-zA-Z0-9]+=)?\{([a-zA-Z0-9]+)\}/g
      , j = {
        G: 1e9,
        M: 1e6,
        K: 1e3
    }
      , k = {};
    d.prototype = {
        url: "",
        text: "",
        shareIn: "blank",
        showLabel: function(a) {
            return this.showCount === !1 ? a > this.smallScreenWidth : a >= this.largeScreenWidth
        },
        showCount: function(a) {
            return a <= this.smallScreenWidth ? "inside" : !0
        },
        smallScreenWidth: 640,
        largeScreenWidth: 1024,
        resizeTimeout: 200,
        elementClass: "jssocials",
        sharesClass: "jssocials-shares",
        shareClass: "jssocials-share",
        shareButtonClass: "jssocials-share-button",
        shareLinkClass: "jssocials-share-link",
        shareLogoClass: "jssocials-share-logo",
        shareLabelClass: "jssocials-share-label",
        shareLinkCountClass: "jssocials-share-link-count",
        shareCountBoxClass: "jssocials-share-count-box",
        shareCountClass: "jssocials-share-count",
        shareZeroCountClass: "jssocials-share-no-count",
        _init: function(a) {
            this._initDefaults(),
            b.extend(this, a),
            this._initShares(),
            this._attachWindowResizeCallback()
        },
        _initDefaults: function() {
            this.url = a.location.href,
            this.text = b.trim(b("meta[name=description]").attr("content") || b("title").text())
        },
        _initShares: function() {
            this.shares = b.map(this.shares, b.proxy(function(a) {
                "string" == typeof a && (a = {
                    share: a
                });
                var c = a.share && k[a.share];
                if (!c && !a.renderer)
                    throw Error("Share '" + a.share + "' is not found");
                return b.extend({
                    url: this.url,
                    text: this.text
                }, c, a)
            }, this))
        },
        _attachWindowResizeCallback: function() {
            b(a).on("resize", b.proxy(this._windowResizeHandler, this))
        },
        _detachWindowResizeCallback: function() {
            b(a).off("resize", this._windowResizeHandler)
        },
        _windowResizeHandler: function() {
            (b.isFunction(this.showLabel) || b.isFunction(this.showCount)) && (a.clearTimeout(this._resizeTimer),
            this._resizeTimer = setTimeout(b.proxy(this.refresh, this), this.resizeTimeout))
        },
        _render: function() {
            this._clear(),
            this._defineOptionsByScreen(),
            this._$element.addClass(this.elementClass),
            this._$shares = b("<div>").addClass(this.sharesClass).appendTo(this._$element),
            this._renderShares()
        },
        _defineOptionsByScreen: function() {
            this._screenWidth = b(a).width(),
            this._showLabel = g(this.showLabel, this, this._screenWidth),
            this._showCount = g(this.showCount, this, this._screenWidth)
        },
        _renderShares: function() {
            b.each(this.shares, b.proxy(function(a, b) {
                this._renderShare(b)
            }, this))
        },
        _renderShare: function(a) {
            var c;
            c = b.isFunction(a.renderer) ? b(a.renderer()) : this._createShare(a),
            c.addClass(this.shareClass).addClass(a.share ? "jssocials-share-" + a.share : "").addClass(a.css).appendTo(this._$shares)
        },
        _createShare: function(a) {
            var c = b("<div>")
              , d = this._createShareLink(a).appendTo(c);
            if (this._showCount) {
                var e = "inside" === this._showCount
                  , f = e ? d : b("<div>").addClass(this.shareCountBoxClass).appendTo(c);
                f.addClass(e ? this.shareLinkCountClass : this.shareCountBoxClass),
                this._renderShareCount(a, f)
            }
            return c
        },
        _createShareLink: function(a) {
            var c = this._getShareStrategy(a)
              , d = c.call(a, {
                shareUrl: this._getShareUrl(a)
            });
            return d.addClass(this.shareLinkClass).append(this._createShareLogo(a)),
            this._showLabel && d.append(this._createShareLabel(a)),
            b.each(this.on || {}, function(c, e) {
                b.isFunction(e) && d.on(c, b.proxy(e, a))
            }),
            d
        },
        _getShareStrategy: function(a) {
            var b = m[a.shareIn || this.shareIn];
            if (!b)
                throw Error("Share strategy '" + this.shareIn + "' not found");
            return b
        },
        _getShareUrl: function(a) {
            var b = g(a.shareUrl, a);
            return this._formatShareUrl(b, a)
        },
        _createShareLogo: function(a) {
            var c = a.logo
              , d = h.test(c) ? b("<img>").attr("src", a.logo) : b("<i>").addClass(c);
            return d.addClass(this.shareLogoClass),
            d
        },
        _createShareLabel: function(a) {
            return b("<span>").addClass(this.shareLabelClass).text(a.label)
        },
        _renderShareCount: function(a, c) {
            var d = b("<span>").addClass(this.shareCountClass);
            c.addClass(this.shareZeroCountClass).append(d),
            this._loadCount(a).done(b.proxy(function(a) {
                a && (c.removeClass(this.shareZeroCountClass),
                d.text(a))
            }, this))
        },
        _loadCount: function(a) {
            var c = b.Deferred()
              , d = this._getCountUrl(a);
            if (!d)
                return c.resolve(0).promise();
            var e = b.proxy(function(b) {
                c.resolve(this._getCountValue(b, a))
            }, this);
            return b.getJSON(d).done(e).fail(function() {
                b.get(d).done(e).fail(function() {
                    c.resolve(0)
                })
            }),
            c.promise()
        },
        _getCountUrl: function(a) {
            var b = g(a.countUrl, a);
            return this._formatShareUrl(b, a)
        },
        _getCountValue: function(a, c) {
            var d = (b.isFunction(c.getCount) ? c.getCount(a) : a) || 0;
            return "string" == typeof d ? d : this._formatNumber(d)
        },
        _formatNumber: function(a) {
            return b.each(j, function(b, c) {
                return a >= c ? (a = parseFloat((a / c).toFixed(2)) + b,
                !1) : void 0
            }),
            a
        },
        _formatShareUrl: function(b, c) {
            return b.replace(i, function(b, d, e) {
                var f = c[e] || "";
                return f ? (d || "") + a.encodeURIComponent(f) : ""
            })
        },
        _clear: function() {
            a.clearTimeout(this._resizeTimer),
            this._$element.empty()
        },
        _passOptionToShares: function(a, c) {
            var d = this.shares;
            b.each(["url", "text"], function(e, f) {
                f === a && b.each(d, function(b, d) {
                    d[a] = c
                })
            })
        },
        _normalizeShare: function(a) {
            return b.isNumeric(a) ? this.shares[a] : "string" == typeof a ? b.grep(this.shares, function(b) {
                return b.share === a
            })[0] : a
        },
        refresh: function() {
            this._render()
        },
        destroy: function() {
            this._clear(),
            this._detachWindowResizeCallback(),
            this._$element.removeClass(this.elementClass).removeData(f)
        },
        option: function(a, b) {
            return 1 === arguments.length ? this[a] : (this[a] = b,
            this._passOptionToShares(a, b),
            void this.refresh())
        },
        shareOption: function(a, b, c) {
            return a = this._normalizeShare(a),
            2 === arguments.length ? a[b] : (a[b] = c,
            void this.refresh())
        }
    },
    b.fn.jsSocials = function(a) {
        var e = b.makeArray(arguments)
          , g = e.slice(1)
          , h = this;
        return this.each(function() {
            var e, i = b(this), j = i.data(f);
            if (j)
                if ("string" == typeof a) {
                    if (e = j[a].apply(j, g),
                    e !== c && e !== j)
                        return h = e,
                        !1
                } else
                    j._detachWindowResizeCallback(),
                    j._init(a),
                    j._render();
            else
                new d(i,a)
        }),
        h
    }
    ;
    var l = function(a) {
        var c;
        b.isPlainObject(a) ? c = d.prototype : (c = k[a],
        a = arguments[1] || {}),
        b.extend(c, a)
    }
      , m = {
        popup: function(c) {
            return b("<a>").attr("href", "#").on("click", function() {
                return a.open(c.shareUrl, null, "width=600, height=400, location=0, menubar=0, resizeable=0, scrollbars=0, status=0, titlebar=0, toolbar=0"),
                !1
            })
        },
        blank: function(a) {
            return b("<a>").attr({
                target: "_blank",
                href: a.shareUrl
            })
        },
        self: function(a) {
            return b("<a>").attr({
                target: "_self",
                href: a.shareUrl
            })
        }
    };
    a.jsSocials = {
        Socials: d,
        shares: k,
        shareStrategies: m,
        setDefaults: l
    }
}(window, jQuery),
function(a, b, c) {
    b.extend(c.shares, {
        email: {
            label: "E-mail",
            logo: "fa fa-at",
            shareUrl: "mailto:{to}?subject={text}&body={url}",
            countUrl: "",
            shareIn: "self"
        },
        twitter: {
            label: "Tweet",
            logo: "fa fa-twitter",
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: ""
        },
        facebook: {
            label: "Like",
            logo: "fa fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: "https://graph.facebook.com/?id={url}",
            getCount: function(a) {
                return a.share && a.share.share_count || 0
            }
        },
        vkontakte: {
            label: "Like",
            logo: "fa fa-vk",
            shareUrl: "https://vk.com/share.php?url={url}&title={title}&description={text}",
            countUrl: "https://vk.com/share.php?act=count&index=1&url={url}",
            getCount: function(a) {
                return parseInt(a.slice(15, -2).split(", ")[1])
            }
        },
        googleplus: {
            label: "+1",
            logo: "fa fa-google",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: ""
        },
        linkedin: {
            label: "Share",
            logo: "fa fa-linkedin",
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}",
            countUrl: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            getCount: function(a) {
                return a.count
            }
        },
        pinterest: {
            label: "Pin it",
            logo: "fa fa-pinterest",
            shareUrl: "https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",
            countUrl: "https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",
            getCount: function(a) {
                return a.count
            }
        },
        stumbleupon: {
            label: "Share",
            logo: "fa fa-stumbleupon",
            shareUrl: "http://www.stumbleupon.com/submit?url={url}&title={title}",
            countUrl: "https://cors-anywhere.herokuapp.com/https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}",
            getCount: function(a) {
                return a.result.views
            }
        },
        telegram: {
            label: "Telegram",
            logo: "fa fa-paper-plane",
            shareUrl: "tg://msg?text={url} {text}",
            countUrl: "",
            shareIn: "self"
        },
        whatsapp: {
            label: "WhatsApp",
            logo: "fa fa-whatsapp",
            shareUrl: "whatsapp://send?text={url} {text}",
            countUrl: "",
            shareIn: "self"
        },
        line: {
            label: "LINE",
            logo: "fa fa-comment",
            shareUrl: "http://line.me/R/msg/text/?{text} {url}",
            countUrl: ""
        },
        viber: {
            label: "Viber",
            logo: "fa fa-volume-control-phone",
            shareUrl: "viber://forward?text={url} {text}",
            countUrl: "",
            shareIn: "self"
        },
        pocket: {
            label: "Pocket",
            logo: "fa fa-get-pocket",
            shareUrl: "https://getpocket.com/save?url={url}&title={title}",
            countUrl: ""
        },
        messenger: {
            label: "Share",
            logo: "fa fa-commenting",
            shareUrl: "fb-messenger://share?link={url}",
            countUrl: "",
            shareIn: "self"
        }
    })
}(window, jQuery, window.jsSocials);
!function(a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], function(a) {
        return b(a)
    }) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(jQuery)
}(this, function(a) {
    function b(a) {
        this.$container,
        this.constraints = null,
        this.__$tooltip,
        this.__init(a)
    }
    function c(b, c) {
        var d = !0;
        return a.each(b, function(a, e) {
            return void 0 === c[a] || b[a] !== c[a] ? (d = !1,
            !1) : void 0
        }),
        d
    }
    function d(b) {
        var c = b.attr("id")
          , d = c ? h.window.document.getElementById(c) : null;
        return d ? d === b[0] : a.contains(h.window.document.body, b[0])
    }
    function e() {
        if (!g)
            return !1;
        var a = g.document.body || g.document.documentElement
          , b = a.style
          , c = "transition"
          , d = ["Moz", "Webkit", "Khtml", "O", "ms"];
        if ("string" == typeof b[c])
            return !0;
        c = c.charAt(0).toUpperCase() + c.substr(1);
        for (var e = 0; e < d.length; e++)
            if ("string" == typeof b[d[e] + c])
                return !0;
        return !1
    }
    var f = {
        animation: "fade",
        animationDuration: 350,
        content: null,
        contentAsHTML: !1,
        contentCloning: !1,
        debug: !0,
        delay: 300,
        delayTouch: [300, 500],
        functionInit: null,
        functionBefore: null,
        functionReady: null,
        functionAfter: null,
        functionFormat: null,
        IEmin: 6,
        interactive: !1,
        multiple: !1,
        parent: null,
        plugins: ["sideTip"],
        repositionOnScroll: !1,
        restoration: "none",
        selfDestruction: !0,
        theme: [],
        timer: 0,
        trackerInterval: 500,
        trackOrigin: !1,
        trackTooltip: !1,
        trigger: "hover",
        triggerClose: {
            click: !1,
            mouseleave: !1,
            originClick: !1,
            scroll: !1,
            tap: !1,
            touchleave: !1
        },
        triggerOpen: {
            click: !1,
            mouseenter: !1,
            tap: !1,
            touchstart: !1
        },
        updateAnimation: "rotate",
        zIndex: 9999999
    }
      , g = "undefined" != typeof window ? window : null
      , h = {
        hasTouchCapability: !(!g || !("ontouchstart"in g || g.DocumentTouch && g.document instanceof g.DocumentTouch || g.navigator.maxTouchPoints)),
        hasTransitions: e(),
        IE: !1,
        semVer: "4.2.2",
        window: g
    }
      , i = function() {
        this.__$emitterPrivate = a({}),
        this.__$emitterPublic = a({}),
        this.__instancesLatestArr = [],
        this.__plugins = {},
        this._env = h
    };
    i.prototype = {
        __bridge: function(b, c, d) {
            if (!c[d]) {
                var e = function() {};
                e.prototype = b;
                var g = new e;
                g.__init && g.__init(c),
                a.each(b, function(a, b) {
                    0 != a.indexOf("__") && (c[a] ? f.debug && console.log("The " + a + " method of the " + d + " plugin conflicts with another plugin or native methods") : (c[a] = function() {
                        return g[a].apply(g, Array.prototype.slice.apply(arguments))
                    }
                    ,
                    c[a].bridged = g))
                }),
                c[d] = g
            }
            return this
        },
        __setWindow: function(a) {
            return h.window = a,
            this
        },
        _getRuler: function(a) {
            return new b(a)
        },
        _off: function() {
            return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)),
            this
        },
        _on: function() {
            return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)),
            this
        },
        _one: function() {
            return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)),
            this
        },
        _plugin: function(b) {
            var c = this;
            if ("string" == typeof b) {
                var d = b
                  , e = null;
                return d.indexOf(".") > 0 ? e = c.__plugins[d] : a.each(c.__plugins, function(a, b) {
                    return b.name.substring(b.name.length - d.length - 1) == "." + d ? (e = b,
                    !1) : void 0
                }),
                e
            }
            if (b.name.indexOf(".") < 0)
                throw new Error("Plugins must be namespaced");
            return c.__plugins[b.name] = b,
            b.core && c.__bridge(b.core, c, b.name),
            this
        },
        _trigger: function() {
            var a = Array.prototype.slice.apply(arguments);
            return "string" == typeof a[0] && (a[0] = {
                type: a[0]
            }),
            this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, a),
            this.__$emitterPublic.trigger.apply(this.__$emitterPublic, a),
            this
        },
        instances: function(b) {
            var c = []
              , d = b || ".tooltipstered";
            return a(d).each(function() {
                var b = a(this)
                  , d = b.data("tooltipster-ns");
                d && a.each(d, function(a, d) {
                    c.push(b.data(d))
                })
            }),
            c
        },
        instancesLatest: function() {
            return this.__instancesLatestArr
        },
        off: function() {
            return this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        },
        on: function() {
            return this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        },
        one: function() {
            return this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        },
        origins: function(b) {
            var c = b ? b + " " : "";
            return a(c + ".tooltipstered").toArray()
        },
        setDefaults: function(b) {
            return a.extend(f, b),
            this
        },
        triggerHandler: function() {
            return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        }
    },
    a.tooltipster = new i,
    a.Tooltipster = function(b, c) {
        this.__callbacks = {
            close: [],
            open: []
        },
        this.__closingTime,
        this.__Content,
        this.__contentBcr,
        this.__destroyed = !1,
        this.__$emitterPrivate = a({}),
        this.__$emitterPublic = a({}),
        this.__enabled = !0,
        this.__garbageCollector,
        this.__Geometry,
        this.__lastPosition,
        this.__namespace = "tooltipster-" + Math.round(1e6 * Math.random()),
        this.__options,
        this.__$originParents,
        this.__pointerIsOverOrigin = !1,
        this.__previousThemes = [],
        this.__state = "closed",
        this.__timeouts = {
            close: [],
            open: null
        },
        this.__touchEvents = [],
        this.__tracker = null,
        this._$origin,
        this._$tooltip,
        this.__init(b, c)
    }
    ,
    a.Tooltipster.prototype = {
        __init: function(b, c) {
            var d = this;
            if (d._$origin = a(b),
            d.__options = a.extend(!0, {}, f, c),
            d.__optionsFormat(),
            !h.IE || h.IE >= d.__options.IEmin) {
                var e = null;
                if (void 0 === d._$origin.data("tooltipster-initialTitle") && (e = d._$origin.attr("title"),
                void 0 === e && (e = null),
                d._$origin.data("tooltipster-initialTitle", e)),
                null !== d.__options.content)
                    d.__contentSet(d.__options.content);
                else {
                    var g, i = d._$origin.attr("data-tooltip-content");
                    i && (g = a(i)),
                    g && g[0] ? d.__contentSet(g.first()) : d.__contentSet(e)
                }
                d._$origin.removeAttr("title").addClass("tooltipstered"),
                d.__prepareOrigin(),
                d.__prepareGC(),
                a.each(d.__options.plugins, function(a, b) {
                    d._plug(b)
                }),
                h.hasTouchCapability && a(h.window.document.body).on("touchmove." + d.__namespace + "-triggerOpen", function(a) {
                    d._touchRecordEvent(a)
                }),
                d._on("created", function() {
                    d.__prepareTooltip()
                })._on("repositioned", function(a) {
                    d.__lastPosition = a.position
                })
            } else
                d.__options.disabled = !0
        },
        __contentInsert: function() {
            var a = this
              , b = a._$tooltip.find(".tooltipster-content")
              , c = a.__Content
              , d = function(a) {
                c = a
            };
            return a._trigger({
                type: "format",
                content: a.__Content,
                format: d
            }),
            a.__options.functionFormat && (c = a.__options.functionFormat.call(a, a, {
                origin: a._$origin[0]
            }, a.__Content)),
            "string" != typeof c || a.__options.contentAsHTML ? b.empty().append(c) : b.text(c),
            a
        },
        __contentSet: function(b) {
            return b instanceof a && this.__options.contentCloning && (b = b.clone(!0)),
            this.__Content = b,
            this._trigger({
                type: "updated",
                content: b
            }),
            this
        },
        __destroyError: function() {
            throw new Error("This tooltip has been destroyed and cannot execute your method call.")
        },
        __geometry: function() {
            var b = this
              , c = b._$origin
              , d = b._$origin.is("area");
            if (d) {
                var e = b._$origin.parent().attr("name");
                c = a('img[usemap="#' + e + '"]')
            }
            var f = c[0].getBoundingClientRect()
              , g = a(h.window.document)
              , i = a(h.window)
              , j = c
              , k = {
                available: {
                    document: null,
                    window: null
                },
                document: {
                    size: {
                        height: g.height(),
                        width: g.width()
                    }
                },
                window: {
                    scroll: {
                        left: h.window.scrollX || h.window.document.documentElement.scrollLeft,
                        top: h.window.scrollY || h.window.document.documentElement.scrollTop
                    },
                    size: {
                        height: i.height(),
                        width: i.width()
                    }
                },
                origin: {
                    fixedLineage: !1,
                    offset: {},
                    size: {
                        height: f.bottom - f.top,
                        width: f.right - f.left
                    },
                    usemapImage: d ? c[0] : null,
                    windowOffset: {
                        bottom: f.bottom,
                        left: f.left,
                        right: f.right,
                        top: f.top
                    }
                }
            };
            if (d) {
                var l = b._$origin.attr("shape")
                  , m = b._$origin.attr("coords");
                if (m && (m = m.split(","),
                a.map(m, function(a, b) {
                    m[b] = parseInt(a)
                })),
                "default" != l)
                    switch (l) {
                    case "circle":
                        var n = m[0]
                          , o = m[1]
                          , p = m[2]
                          , q = o - p
                          , r = n - p;
                        k.origin.size.height = 2 * p,
                        k.origin.size.width = k.origin.size.height,
                        k.origin.windowOffset.left += r,
                        k.origin.windowOffset.top += q;
                        break;
                    case "rect":
                        var s = m[0]
                          , t = m[1]
                          , u = m[2]
                          , v = m[3];
                        k.origin.size.height = v - t,
                        k.origin.size.width = u - s,
                        k.origin.windowOffset.left += s,
                        k.origin.windowOffset.top += t;
                        break;
                    case "poly":
                        for (var w = 0, x = 0, y = 0, z = 0, A = "even", B = 0; B < m.length; B++) {
                            var C = m[B];
                            "even" == A ? (C > y && (y = C,
                            0 === B && (w = y)),
                            w > C && (w = C),
                            A = "odd") : (C > z && (z = C,
                            1 == B && (x = z)),
                            x > C && (x = C),
                            A = "even")
                        }
                        k.origin.size.height = z - x,
                        k.origin.size.width = y - w,
                        k.origin.windowOffset.left += w,
                        k.origin.windowOffset.top += x
                    }
            }
            var D = function(a) {
                k.origin.size.height = a.height,
                k.origin.windowOffset.left = a.left,
                k.origin.windowOffset.top = a.top,
                k.origin.size.width = a.width
            };
            for (b._trigger({
                type: "geometry",
                edit: D,
                geometry: {
                    height: k.origin.size.height,
                    left: k.origin.windowOffset.left,
                    top: k.origin.windowOffset.top,
                    width: k.origin.size.width
                }
            }),
            k.origin.windowOffset.right = k.origin.windowOffset.left + k.origin.size.width,
            k.origin.windowOffset.bottom = k.origin.windowOffset.top + k.origin.size.height,
            k.origin.offset.left = k.origin.windowOffset.left + k.window.scroll.left,
            k.origin.offset.top = k.origin.windowOffset.top + k.window.scroll.top,
            k.origin.offset.bottom = k.origin.offset.top + k.origin.size.height,
            k.origin.offset.right = k.origin.offset.left + k.origin.size.width,
            k.available.document = {
                bottom: {
                    height: k.document.size.height - k.origin.offset.bottom,
                    width: k.document.size.width
                },
                left: {
                    height: k.document.size.height,
                    width: k.origin.offset.left
                },
                right: {
                    height: k.document.size.height,
                    width: k.document.size.width - k.origin.offset.right
                },
                top: {
                    height: k.origin.offset.top,
                    width: k.document.size.width
                }
            },
            k.available.window = {
                bottom: {
                    height: Math.max(k.window.size.height - Math.max(k.origin.windowOffset.bottom, 0), 0),
                    width: k.window.size.width
                },
                left: {
                    height: k.window.size.height,
                    width: Math.max(k.origin.windowOffset.left, 0)
                },
                right: {
                    height: k.window.size.height,
                    width: Math.max(k.window.size.width - Math.max(k.origin.windowOffset.right, 0), 0)
                },
                top: {
                    height: Math.max(k.origin.windowOffset.top, 0),
                    width: k.window.size.width
                }
            }; "html" != j[0].tagName.toLowerCase(); ) {
                if ("fixed" == j.css("position")) {
                    k.origin.fixedLineage = !0;
                    break
                }
                j = j.parent()
            }
            return k
        },
        __optionsFormat: function() {
            return "number" == typeof this.__options.animationDuration && (this.__options.animationDuration = [this.__options.animationDuration, this.__options.animationDuration]),
            "number" == typeof this.__options.delay && (this.__options.delay = [this.__options.delay, this.__options.delay]),
            "number" == typeof this.__options.delayTouch && (this.__options.delayTouch = [this.__options.delayTouch, this.__options.delayTouch]),
            "string" == typeof this.__options.theme && (this.__options.theme = [this.__options.theme]),
            null === this.__options.parent ? this.__options.parent = a(h.window.document.body) : "string" == typeof this.__options.parent && (this.__options.parent = a(this.__options.parent)),
            "hover" == this.__options.trigger ? (this.__options.triggerOpen = {
                mouseenter: !0,
                touchstart: !0
            },
            this.__options.triggerClose = {
                mouseleave: !0,
                originClick: !0,
                touchleave: !0
            }) : "click" == this.__options.trigger && (this.__options.triggerOpen = {
                click: !0,
                tap: !0
            },
            this.__options.triggerClose = {
                click: !0,
                tap: !0
            }),
            this._trigger("options"),
            this
        },
        __prepareGC: function() {
            var b = this;
            return b.__options.selfDestruction ? b.__garbageCollector = setInterval(function() {
                var c = (new Date).getTime();
                b.__touchEvents = a.grep(b.__touchEvents, function(a, b) {
                    return c - a.time > 6e4
                }),
                d(b._$origin) || b.close(function() {
                    b.destroy()
                })
            }, 2e4) : clearInterval(b.__garbageCollector),
            b
        },
        __prepareOrigin: function() {
            var a = this;
            if (a._$origin.off("." + a.__namespace + "-triggerOpen"),
            h.hasTouchCapability && a._$origin.on("touchstart." + a.__namespace + "-triggerOpen touchend." + a.__namespace + "-triggerOpen touchcancel." + a.__namespace + "-triggerOpen", function(b) {
                a._touchRecordEvent(b)
            }),
            a.__options.triggerOpen.click || a.__options.triggerOpen.tap && h.hasTouchCapability) {
                var b = "";
                a.__options.triggerOpen.click && (b += "click." + a.__namespace + "-triggerOpen "),
                a.__options.triggerOpen.tap && h.hasTouchCapability && (b += "touchend." + a.__namespace + "-triggerOpen"),
                a._$origin.on(b, function(b) {
                    a._touchIsMeaningfulEvent(b) && a._open(b)
                })
            }
            if (a.__options.triggerOpen.mouseenter || a.__options.triggerOpen.touchstart && h.hasTouchCapability) {
                var b = "";
                a.__options.triggerOpen.mouseenter && (b += "mouseenter." + a.__namespace + "-triggerOpen "),
                a.__options.triggerOpen.touchstart && h.hasTouchCapability && (b += "touchstart." + a.__namespace + "-triggerOpen"),
                a._$origin.on(b, function(b) {
                    !a._touchIsTouchEvent(b) && a._touchIsEmulatedEvent(b) || (a.__pointerIsOverOrigin = !0,
                    a._openShortly(b))
                })
            }
            if (a.__options.triggerClose.mouseleave || a.__options.triggerClose.touchleave && h.hasTouchCapability) {
                var b = "";
                a.__options.triggerClose.mouseleave && (b += "mouseleave." + a.__namespace + "-triggerOpen "),
                a.__options.triggerClose.touchleave && h.hasTouchCapability && (b += "touchend." + a.__namespace + "-triggerOpen touchcancel." + a.__namespace + "-triggerOpen"),
                a._$origin.on(b, function(b) {
                    a._touchIsMeaningfulEvent(b) && (a.__pointerIsOverOrigin = !1)
                })
            }
            return a
        },
        __prepareTooltip: function() {
            var b = this
              , c = b.__options.interactive ? "auto" : "";
            return b._$tooltip.attr("id", b.__namespace).css({
                "pointer-events": c,
                zIndex: b.__options.zIndex
            }),
            a.each(b.__previousThemes, function(a, c) {
                b._$tooltip.removeClass(c)
            }),
            a.each(b.__options.theme, function(a, c) {
                b._$tooltip.addClass(c)
            }),
            b.__previousThemes = a.merge([], b.__options.theme),
            b
        },
        __scrollHandler: function(b) {
            var c = this;
            if (c.__options.triggerClose.scroll)
                c._close(b);
            else if (d(c._$origin) && d(c._$tooltip)) {
                if (b.target === h.window.document)
                    c.__Geometry.origin.fixedLineage || c.__options.repositionOnScroll && c.reposition(b);
                else {
                    var e = c.__geometry()
                      , f = !1;
                    if ("fixed" != c._$origin.css("position") && c.__$originParents.each(function(b, c) {
                        var d = a(c)
                          , g = d.css("overflow-x")
                          , h = d.css("overflow-y");
                        if ("visible" != g || "visible" != h) {
                            var i = c.getBoundingClientRect();
                            if ("visible" != g && (e.origin.windowOffset.left < i.left || e.origin.windowOffset.right > i.right))
                                return f = !0,
                                !1;
                            if ("visible" != h && (e.origin.windowOffset.top < i.top || e.origin.windowOffset.bottom > i.bottom))
                                return f = !0,
                                !1
                        }
                        return "fixed" == d.css("position") ? !1 : void 0
                    }),
                    f)
                        c._$tooltip.css("visibility", "hidden");
                    else if (c._$tooltip.css("visibility", "visible"),
                    c.__options.repositionOnScroll)
                        c.reposition(b);
                    else {
                        var g = e.origin.offset.left - c.__Geometry.origin.offset.left
                          , i = e.origin.offset.top - c.__Geometry.origin.offset.top;
                        c._$tooltip.css({
                            left: c.__lastPosition.coord.left + g,
                            top: c.__lastPosition.coord.top + i
                        })
                    }
                }
                c._trigger({
                    type: "scroll",
                    event: b
                })
            }
            return c
        },
        __stateSet: function(a) {
            return this.__state = a,
            this._trigger({
                type: "state",
                state: a
            }),
            this
        },
        __timeoutsClear: function() {
            return clearTimeout(this.__timeouts.open),
            this.__timeouts.open = null,
            a.each(this.__timeouts.close, function(a, b) {
                clearTimeout(b)
            }),
            this.__timeouts.close = [],
            this
        },
        __trackerStart: function() {
            var a = this
              , b = a._$tooltip.find(".tooltipster-content");
            return a.__options.trackTooltip && (a.__contentBcr = b[0].getBoundingClientRect()),
            a.__tracker = setInterval(function() {
                if (d(a._$origin) && d(a._$tooltip)) {
                    if (a.__options.trackOrigin) {
                        var e = a.__geometry()
                          , f = !1;
                        c(e.origin.size, a.__Geometry.origin.size) && (a.__Geometry.origin.fixedLineage ? c(e.origin.windowOffset, a.__Geometry.origin.windowOffset) && (f = !0) : c(e.origin.offset, a.__Geometry.origin.offset) && (f = !0)),
                        f || (a.__options.triggerClose.mouseleave ? a._close() : a.reposition())
                    }
                    if (a.__options.trackTooltip) {
                        var g = b[0].getBoundingClientRect();
                        g.height === a.__contentBcr.height && g.width === a.__contentBcr.width || (a.reposition(),
                        a.__contentBcr = g)
                    }
                } else
                    a._close()
            }, a.__options.trackerInterval),
            a
        },
        _close: function(b, c, d) {
            var e = this
              , f = !0;
            if (e._trigger({
                type: "close",
                event: b,
                stop: function() {
                    f = !1
                }
            }),
            f || d) {
                c && e.__callbacks.close.push(c),
                e.__callbacks.open = [],
                e.__timeoutsClear();
                var g = function() {
                    a.each(e.__callbacks.close, function(a, c) {
                        c.call(e, e, {
                            event: b,
                            origin: e._$origin[0]
                        })
                    }),
                    e.__callbacks.close = []
                };
                if ("closed" != e.__state) {
                    var i = !0
                      , j = new Date
                      , k = j.getTime()
                      , l = k + e.__options.animationDuration[1];
                    if ("disappearing" == e.__state && l > e.__closingTime && (i = !1),
                    i) {
                        e.__closingTime = l,
                        "disappearing" != e.__state && e.__stateSet("disappearing");
                        var m = function() {
                            clearInterval(e.__tracker),
                            e._trigger({
                                type: "closing",
                                event: b
                            }),
                            e._$tooltip.off("." + e.__namespace + "-triggerClose").removeClass("tooltipster-dying"),
                            a(h.window).off("." + e.__namespace + "-triggerClose"),
                            e.__$originParents.each(function(b, c) {
                                a(c).off("scroll." + e.__namespace + "-triggerClose")
                            }),
                            e.__$originParents = null,
                            a(h.window.document.body).off("." + e.__namespace + "-triggerClose"),
                            e._$origin.off("." + e.__namespace + "-triggerClose"),
                            e._off("dismissable"),
                            e.__stateSet("closed"),
                            e._trigger({
                                type: "after",
                                event: b
                            }),
                            e.__options.functionAfter && e.__options.functionAfter.call(e, e, {
                                event: b,
                                origin: e._$origin[0]
                            }),
                            g()
                        };
                        h.hasTransitions ? (e._$tooltip.css({
                            "-moz-animation-duration": e.__options.animationDuration[1] + "ms",
                            "-ms-animation-duration": e.__options.animationDuration[1] + "ms",
                            "-o-animation-duration": e.__options.animationDuration[1] + "ms",
                            "-webkit-animation-duration": e.__options.animationDuration[1] + "ms",
                            "animation-duration": e.__options.animationDuration[1] + "ms",
                            "transition-duration": e.__options.animationDuration[1] + "ms"
                        }),
                        e._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"),
                        e.__options.animationDuration[1] > 0 && e._$tooltip.delay(e.__options.animationDuration[1]),
                        e._$tooltip.queue(m)) : e._$tooltip.stop().fadeOut(e.__options.animationDuration[1], m)
                    }
                } else
                    g()
            }
            return e
        },
        _off: function() {
            return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)),
            this
        },
        _on: function() {
            return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)),
            this
        },
        _one: function() {
            return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)),
            this
        },
        _open: function(b, c) {
            var e = this;
            if (!e.__destroying && d(e._$origin) && e.__enabled) {
                var f = !0;
                if ("closed" == e.__state && (e._trigger({
                    type: "before",
                    event: b,
                    stop: function() {
                        f = !1
                    }
                }),
                f && e.__options.functionBefore && (f = e.__options.functionBefore.call(e, e, {
                    event: b,
                    origin: e._$origin[0]
                }))),
                f !== !1 && null !== e.__Content) {
                    c && e.__callbacks.open.push(c),
                    e.__callbacks.close = [],
                    e.__timeoutsClear();
                    var g, i = function() {
                        "stable" != e.__state && e.__stateSet("stable"),
                        a.each(e.__callbacks.open, function(a, b) {
                            b.call(e, e, {
                                origin: e._$origin[0],
                                tooltip: e._$tooltip[0]
                            })
                        }),
                        e.__callbacks.open = []
                    };
                    if ("closed" !== e.__state)
                        g = 0,
                        "disappearing" === e.__state ? (e.__stateSet("appearing"),
                        h.hasTransitions ? (e._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"),
                        e.__options.animationDuration[0] > 0 && e._$tooltip.delay(e.__options.animationDuration[0]),
                        e._$tooltip.queue(i)) : e._$tooltip.stop().fadeIn(i)) : "stable" == e.__state && i();
                    else {
                        if (e.__stateSet("appearing"),
                        g = e.__options.animationDuration[0],
                        e.__contentInsert(),
                        e.reposition(b, !0),
                        h.hasTransitions ? (e._$tooltip.addClass("tooltipster-" + e.__options.animation).addClass("tooltipster-initial").css({
                            "-moz-animation-duration": e.__options.animationDuration[0] + "ms",
                            "-ms-animation-duration": e.__options.animationDuration[0] + "ms",
                            "-o-animation-duration": e.__options.animationDuration[0] + "ms",
                            "-webkit-animation-duration": e.__options.animationDuration[0] + "ms",
                            "animation-duration": e.__options.animationDuration[0] + "ms",
                            "transition-duration": e.__options.animationDuration[0] + "ms"
                        }),
                        setTimeout(function() {
                            "closed" != e.__state && (e._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"),
                            e.__options.animationDuration[0] > 0 && e._$tooltip.delay(e.__options.animationDuration[0]),
                            e._$tooltip.queue(i))
                        }, 0)) : e._$tooltip.css("display", "none").fadeIn(e.__options.animationDuration[0], i),
                        e.__trackerStart(),
                        a(h.window).on("resize." + e.__namespace + "-triggerClose", function(b) {
                            var c = a(document.activeElement);
                            (c.is("input") || c.is("textarea")) && a.contains(e._$tooltip[0], c[0]) || e.reposition(b)
                        }).on("scroll." + e.__namespace + "-triggerClose", function(a) {
                            e.__scrollHandler(a)
                        }),
                        e.__$originParents = e._$origin.parents(),
                        e.__$originParents.each(function(b, c) {
                            a(c).on("scroll." + e.__namespace + "-triggerClose", function(a) {
                                e.__scrollHandler(a)
                            })
                        }),
                        e.__options.triggerClose.mouseleave || e.__options.triggerClose.touchleave && h.hasTouchCapability) {
                            e._on("dismissable", function(a) {
                                a.dismissable ? a.delay ? (m = setTimeout(function() {
                                    e._close(a.event)
                                }, a.delay),
                                e.__timeouts.close.push(m)) : e._close(a) : clearTimeout(m)
                            });
                            var j = e._$origin
                              , k = ""
                              , l = ""
                              , m = null;
                            e.__options.interactive && (j = j.add(e._$tooltip)),
                            e.__options.triggerClose.mouseleave && (k += "mouseenter." + e.__namespace + "-triggerClose ",
                            l += "mouseleave." + e.__namespace + "-triggerClose "),
                            e.__options.triggerClose.touchleave && h.hasTouchCapability && (k += "touchstart." + e.__namespace + "-triggerClose",
                            l += "touchend." + e.__namespace + "-triggerClose touchcancel." + e.__namespace + "-triggerClose"),
                            j.on(l, function(a) {
                                if (e._touchIsTouchEvent(a) || !e._touchIsEmulatedEvent(a)) {
                                    var b = "mouseleave" == a.type ? e.__options.delay : e.__options.delayTouch;
                                    e._trigger({
                                        delay: b[1],
                                        dismissable: !0,
                                        event: a,
                                        type: "dismissable"
                                    })
                                }
                            }).on(k, function(a) {
                                !e._touchIsTouchEvent(a) && e._touchIsEmulatedEvent(a) || e._trigger({
                                    dismissable: !1,
                                    event: a,
                                    type: "dismissable"
                                })
                            })
                        }
                        e.__options.triggerClose.originClick && e._$origin.on("click." + e.__namespace + "-triggerClose", function(a) {
                            e._touchIsTouchEvent(a) || e._touchIsEmulatedEvent(a) || e._close(a)
                        }),
                        (e.__options.triggerClose.click || e.__options.triggerClose.tap && h.hasTouchCapability) && setTimeout(function() {
                            if ("closed" != e.__state) {
                                var b = ""
                                  , c = a(h.window.document.body);
                                e.__options.triggerClose.click && (b += "click." + e.__namespace + "-triggerClose "),
                                e.__options.triggerClose.tap && h.hasTouchCapability && (b += "touchend." + e.__namespace + "-triggerClose"),
                                c.on(b, function(b) {
                                    e._touchIsMeaningfulEvent(b) && (e._touchRecordEvent(b),
                                    e.__options.interactive && a.contains(e._$tooltip[0], b.target) || e._close(b))
                                }),
                                e.__options.triggerClose.tap && h.hasTouchCapability && c.on("touchstart." + e.__namespace + "-triggerClose", function(a) {
                                    e._touchRecordEvent(a)
                                })
                            }
                        }, 0),
                        e._trigger("ready"),
                        e.__options.functionReady && e.__options.functionReady.call(e, e, {
                            origin: e._$origin[0],
                            tooltip: e._$tooltip[0]
                        })
                    }
                    if (e.__options.timer > 0) {
                        var m = setTimeout(function() {
                            e._close()
                        }, e.__options.timer + g);
                        e.__timeouts.close.push(m)
                    }
                }
            }
            return e
        },
        _openShortly: function(a) {
            var b = this
              , c = !0;
            if ("stable" != b.__state && "appearing" != b.__state && !b.__timeouts.open && (b._trigger({
                type: "start",
                event: a,
                stop: function() {
                    c = !1
                }
            }),
            c)) {
                var d = 0 == a.type.indexOf("touch") ? b.__options.delayTouch : b.__options.delay;
                d[0] ? b.__timeouts.open = setTimeout(function() {
                    b.__timeouts.open = null,
                    b.__pointerIsOverOrigin && b._touchIsMeaningfulEvent(a) ? (b._trigger("startend"),
                    b._open(a)) : b._trigger("startcancel")
                }, d[0]) : (b._trigger("startend"),
                b._open(a))
            }
            return b
        },
        _optionsExtract: function(b, c) {
            var d = this
              , e = a.extend(!0, {}, c)
              , f = d.__options[b];
            return f || (f = {},
            a.each(c, function(a, b) {
                var c = d.__options[a];
                void 0 !== c && (f[a] = c)
            })),
            a.each(e, function(b, c) {
                void 0 !== f[b] && ("object" != typeof c || c instanceof Array || null == c || "object" != typeof f[b] || f[b]instanceof Array || null == f[b] ? e[b] = f[b] : a.extend(e[b], f[b]))
            }),
            e
        },
        _plug: function(b) {
            var c = a.tooltipster._plugin(b);
            if (!c)
                throw new Error('The "' + b + '" plugin is not defined');
            return c.instance && a.tooltipster.__bridge(c.instance, this, c.name),
            this
        },
        _touchIsEmulatedEvent: function(a) {
            for (var b = !1, c = (new Date).getTime(), d = this.__touchEvents.length - 1; d >= 0; d--) {
                var e = this.__touchEvents[d];
                if (!(c - e.time < 500))
                    break;
                e.target === a.target && (b = !0)
            }
            return b
        },
        _touchIsMeaningfulEvent: function(a) {
            return this._touchIsTouchEvent(a) && !this._touchSwiped(a.target) || !this._touchIsTouchEvent(a) && !this._touchIsEmulatedEvent(a)
        },
        _touchIsTouchEvent: function(a) {
            return 0 == a.type.indexOf("touch")
        },
        _touchRecordEvent: function(a) {
            return this._touchIsTouchEvent(a) && (a.time = (new Date).getTime(),
            this.__touchEvents.push(a)),
            this
        },
        _touchSwiped: function(a) {
            for (var b = !1, c = this.__touchEvents.length - 1; c >= 0; c--) {
                var d = this.__touchEvents[c];
                if ("touchmove" == d.type) {
                    b = !0;
                    break
                }
                if ("touchstart" == d.type && a === d.target)
                    break
            }
            return b
        },
        _trigger: function() {
            var b = Array.prototype.slice.apply(arguments);
            return "string" == typeof b[0] && (b[0] = {
                type: b[0]
            }),
            b[0].instance = this,
            b[0].origin = this._$origin ? this._$origin[0] : null,
            b[0].tooltip = this._$tooltip ? this._$tooltip[0] : null,
            this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, b),
            a.tooltipster._trigger.apply(a.tooltipster, b),
            this.__$emitterPublic.trigger.apply(this.__$emitterPublic, b),
            this
        },
        _unplug: function(b) {
            var c = this;
            if (c[b]) {
                var d = a.tooltipster._plugin(b);
                d.instance && a.each(d.instance, function(a, d) {
                    c[a] && c[a].bridged === c[b] && delete c[a]
                }),
                c[b].__destroy && c[b].__destroy(),
                delete c[b]
            }
            return c
        },
        close: function(a) {
            return this.__destroyed ? this.__destroyError() : this._close(null, a),
            this
        },
        content: function(a) {
            var b = this;
            if (void 0 === a)
                return b.__Content;
            if (b.__destroyed)
                b.__destroyError();
            else if (b.__contentSet(a),
            null !== b.__Content) {
                if ("closed" !== b.__state && (b.__contentInsert(),
                b.reposition(),
                b.__options.updateAnimation))
                    if (h.hasTransitions) {
                        var c = b.__options.updateAnimation;
                        b._$tooltip.addClass("tooltipster-update-" + c),
                        setTimeout(function() {
                            "closed" != b.__state && b._$tooltip.removeClass("tooltipster-update-" + c)
                        }, 1e3)
                    } else
                        b._$tooltip.fadeTo(200, .5, function() {
                            "closed" != b.__state && b._$tooltip.fadeTo(200, 1)
                        })
            } else
                b._close();
            return b
        },
        destroy: function() {
            var b = this;
            if (b.__destroyed)
                b.__destroyError();
            else {
                "closed" != b.__state && b.option("animationDuration", 0)._close(null, null, !0),
                b._trigger("destroy"),
                b.__destroyed = !0,
                b._$origin.removeData(b.__namespace).off("." + b.__namespace + "-triggerOpen"),
                a(h.window.document.body).off("." + b.__namespace + "-triggerOpen");
                var c = b._$origin.data("tooltipster-ns");
                if (c)
                    if (1 === c.length) {
                        var d = null;
                        "previous" == b.__options.restoration ? d = b._$origin.data("tooltipster-initialTitle") : "current" == b.__options.restoration && (d = "string" == typeof b.__Content ? b.__Content : a("<div></div>").append(b.__Content).html()),
                        d && b._$origin.attr("title", d),
                        b._$origin.removeClass("tooltipstered"),
                        b._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")
                    } else
                        c = a.grep(c, function(a, c) {
                            return a !== b.__namespace
                        }),
                        b._$origin.data("tooltipster-ns", c);
                b._trigger("destroyed"),
                b._off(),
                b.off(),
                b.__Content = null,
                b.__$emitterPrivate = null,
                b.__$emitterPublic = null,
                b.__options.parent = null,
                b._$origin = null,
                b._$tooltip = null,
                a.tooltipster.__instancesLatestArr = a.grep(a.tooltipster.__instancesLatestArr, function(a, c) {
                    return b !== a
                }),
                clearInterval(b.__garbageCollector)
            }
            return b
        },
        disable: function() {
            return this.__destroyed ? (this.__destroyError(),
            this) : (this._close(),
            this.__enabled = !1,
            this)
        },
        elementOrigin: function() {
            return this.__destroyed ? void this.__destroyError() : this._$origin[0]
        },
        elementTooltip: function() {
            return this._$tooltip ? this._$tooltip[0] : null
        },
        enable: function() {
            return this.__enabled = !0,
            this
        },
        hide: function(a) {
            return this.close(a)
        },
        instance: function() {
            return this
        },
        off: function() {
            return this.__destroyed || this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        },
        on: function() {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        },
        one: function() {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        },
        open: function(a) {
            return this.__destroyed ? this.__destroyError() : this._open(null, a),
            this
        },
        option: function(b, c) {
            return void 0 === c ? this.__options[b] : (this.__destroyed ? this.__destroyError() : (this.__options[b] = c,
            this.__optionsFormat(),
            a.inArray(b, ["trigger", "triggerClose", "triggerOpen"]) >= 0 && this.__prepareOrigin(),
            "selfDestruction" === b && this.__prepareGC()),
            this)
        },
        reposition: function(a, b) {
            var c = this;
            return c.__destroyed ? c.__destroyError() : "closed" != c.__state && d(c._$origin) && (b || d(c._$tooltip)) && (b || c._$tooltip.detach(),
            c.__Geometry = c.__geometry(),
            c._trigger({
                type: "reposition",
                event: a,
                helper: {
                    geo: c.__Geometry
                }
            })),
            c
        },
        show: function(a) {
            return this.open(a)
        },
        status: function() {
            return {
                destroyed: this.__destroyed,
                enabled: this.__enabled,
                open: "closed" !== this.__state,
                state: this.__state
            }
        },
        triggerHandler: function() {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
            this
        }
    },
    a.fn.tooltipster = function() {
        var b = Array.prototype.slice.apply(arguments)
          , c = "You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";
        if (0 === this.length)
            return this;
        if ("string" == typeof b[0]) {
            var d = "#*$~&";
            return this.each(function() {
                var e = a(this).data("tooltipster-ns")
                  , f = e ? a(this).data(e[0]) : null;
                if (!f)
                    throw new Error("You called Tooltipster's \"" + b[0] + '" method on an uninitialized element');
                if ("function" != typeof f[b[0]])
                    throw new Error('Unknown method "' + b[0] + '"');
                this.length > 1 && "content" == b[0] && (b[1]instanceof a || "object" == typeof b[1] && null != b[1] && b[1].tagName) && !f.__options.contentCloning && f.__options.debug && console.log(c);
                var g = f[b[0]](b[1], b[2]);
                return g !== f || "instance" === b[0] ? (d = g,
                !1) : void 0
            }),
            "#*$~&" !== d ? d : this
        }
        a.tooltipster.__instancesLatestArr = [];
        var e = b[0] && void 0 !== b[0].multiple
          , g = e && b[0].multiple || !e && f.multiple
          , h = b[0] && void 0 !== b[0].content
          , i = h && b[0].content || !h && f.content
          , j = b[0] && void 0 !== b[0].contentCloning
          , k = j && b[0].contentCloning || !j && f.contentCloning
          , l = b[0] && void 0 !== b[0].debug
          , m = l && b[0].debug || !l && f.debug;
        return this.length > 1 && (i instanceof a || "object" == typeof i && null != i && i.tagName) && !k && m && console.log(c),
        this.each(function() {
            var c = !1
              , d = a(this)
              , e = d.data("tooltipster-ns")
              , f = null;
            e ? g ? c = !0 : m && (console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."),
            console.log(this)) : c = !0,
            c && (f = new a.Tooltipster(this,b[0]),
            e || (e = []),
            e.push(f.__namespace),
            d.data("tooltipster-ns", e),
            d.data(f.__namespace, f),
            f.__options.functionInit && f.__options.functionInit.call(f, f, {
                origin: this
            }),
            f._trigger("init")),
            a.tooltipster.__instancesLatestArr.push(f)
        }),
        this
    }
    ,
    b.prototype = {
        __init: function(b) {
            this.__$tooltip = b,
            this.__$tooltip.css({
                left: 0,
                overflow: "hidden",
                position: "absolute",
                top: 0
            }).find(".tooltipster-content").css("overflow", "auto"),
            this.$container = a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo(h.window.document.body)
        },
        __forceRedraw: function() {
            var a = this.__$tooltip.parent();
            this.__$tooltip.detach(),
            this.__$tooltip.appendTo(a)
        },
        constrain: function(a, b) {
            return this.constraints = {
                width: a,
                height: b
            },
            this.__$tooltip.css({
                display: "block",
                height: "",
                overflow: "auto",
                width: a
            }),
            this
        },
        destroy: function() {
            this.__$tooltip.detach().find(".tooltipster-content").css({
                display: "",
                overflow: ""
            }),
            this.$container.remove()
        },
        free: function() {
            return this.constraints = null,
            this.__$tooltip.css({
                display: "",
                height: "",
                overflow: "visible",
                width: ""
            }),
            this
        },
        measure: function() {
            this.__forceRedraw();
            var a = this.__$tooltip[0].getBoundingClientRect()
              , b = {
                size: {
                    height: a.height || a.bottom,
                    width: a.width || a.right
                }
            };
            if (this.constraints) {
                var c = this.__$tooltip.find(".tooltipster-content")
                  , d = this.__$tooltip.outerHeight()
                  , e = c[0].getBoundingClientRect()
                  , f = {
                    height: d <= this.constraints.height,
                    width: a.width <= this.constraints.width && e.width >= c[0].scrollWidth - 1
                };
                b.fits = f.height && f.width
            }
            return h.IE && h.IE <= 11 && b.size.width !== h.window.document.documentElement.clientWidth && (b.size.width = Math.ceil(b.size.width) + 1),
            b
        }
    };
    var j = navigator.userAgent.toLowerCase();
    -1 != j.indexOf("msie") ? h.IE = parseInt(j.split("msie")[1]) : -1 !== j.toLowerCase().indexOf("trident") && -1 !== j.indexOf(" rv:11") ? h.IE = 11 : -1 != j.toLowerCase().indexOf("edge/") && (h.IE = parseInt(j.toLowerCase().split("edge/")[1]));
    var k = "tooltipster.sideTip";
    return a.tooltipster._plugin({
        name: k,
        instance: {
            __defaults: function() {
                return {
                    arrow: !0,
                    distance: 6,
                    functionPosition: null,
                    maxWidth: null,
                    minIntersection: 16,
                    minWidth: 0,
                    position: null,
                    side: "top",
                    viewportAware: !0
                }
            },
            __init: function(a) {
                var b = this;
                b.__instance = a,
                b.__namespace = "tooltipster-sideTip-" + Math.round(1e6 * Math.random()),
                b.__previousState = "closed",
                b.__options,
                b.__optionsFormat(),
                b.__instance._on("state." + b.__namespace, function(a) {
                    "closed" == a.state ? b.__close() : "appearing" == a.state && "closed" == b.__previousState && b.__create(),
                    b.__previousState = a.state
                }),
                b.__instance._on("options." + b.__namespace, function() {
                    b.__optionsFormat()
                }),
                b.__instance._on("reposition." + b.__namespace, function(a) {
                    b.__reposition(a.event, a.helper)
                })
            },
            __close: function() {
                this.__instance.content()instanceof a && this.__instance.content().detach(),
                this.__instance._$tooltip.remove(),
                this.__instance._$tooltip = null
            },
            __create: function() {
                var b = a('<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>');
                this.__options.arrow || b.find(".tooltipster-box").css("margin", 0).end().find(".tooltipster-arrow").hide(),
                this.__options.minWidth && b.css("min-width", this.__options.minWidth + "px"),
                this.__options.maxWidth && b.css("max-width", this.__options.maxWidth + "px"),
                this.__instance._$tooltip = b,
                this.__instance._trigger("created");
            },
            __destroy: function() {
                this.__instance._off("." + self.__namespace)
            },
            __optionsFormat: function() {
                var b = this;
                if (b.__options = b.__instance._optionsExtract(k, b.__defaults()),
                b.__options.position && (b.__options.side = b.__options.position),
                "object" != typeof b.__options.distance && (b.__options.distance = [b.__options.distance]),
                b.__options.distance.length < 4 && (void 0 === b.__options.distance[1] && (b.__options.distance[1] = b.__options.distance[0]),
                void 0 === b.__options.distance[2] && (b.__options.distance[2] = b.__options.distance[0]),
                void 0 === b.__options.distance[3] && (b.__options.distance[3] = b.__options.distance[1]),
                b.__options.distance = {
                    top: b.__options.distance[0],
                    right: b.__options.distance[1],
                    bottom: b.__options.distance[2],
                    left: b.__options.distance[3]
                }),
                "string" == typeof b.__options.side) {
                    var c = {
                        top: "bottom",
                        right: "left",
                        bottom: "top",
                        left: "right"
                    };
                    b.__options.side = [b.__options.side, c[b.__options.side]],
                    "left" == b.__options.side[0] || "right" == b.__options.side[0] ? b.__options.side.push("top", "bottom") : b.__options.side.push("right", "left")
                }
                6 === a.tooltipster._env.IE && b.__options.arrow !== !0 && (b.__options.arrow = !1)
            },
            __reposition: function(b, c) {
                var d, e = this, f = e.__targetFind(c), g = [];
                e.__instance._$tooltip.detach();
                var h = e.__instance._$tooltip.clone()
                  , i = a.tooltipster._getRuler(h)
                  , j = !1
                  , k = e.__instance.option("animation");
                switch (k && h.removeClass("tooltipster-" + k),
                a.each(["window", "document"], function(d, k) {
                    var l = null;
                    if (e.__instance._trigger({
                        container: k,
                        helper: c,
                        satisfied: j,
                        takeTest: function(a) {
                            l = a
                        },
                        results: g,
                        type: "positionTest"
                    }),
                    1 == l || 0 != l && 0 == j && ("window" != k || e.__options.viewportAware))
                        for (var d = 0; d < e.__options.side.length; d++) {
                            var m = {
                                horizontal: 0,
                                vertical: 0
                            }
                              , n = e.__options.side[d];
                            "top" == n || "bottom" == n ? m.vertical = e.__options.distance[n] : m.horizontal = e.__options.distance[n],
                            e.__sideChange(h, n),
                            a.each(["natural", "constrained"], function(a, d) {
                                if (l = null,
                                e.__instance._trigger({
                                    container: k,
                                    event: b,
                                    helper: c,
                                    mode: d,
                                    results: g,
                                    satisfied: j,
                                    side: n,
                                    takeTest: function(a) {
                                        l = a
                                    },
                                    type: "positionTest"
                                }),
                                1 == l || 0 != l && 0 == j) {
                                    var h = {
                                        container: k,
                                        distance: m,
                                        fits: null,
                                        mode: d,
                                        outerSize: null,
                                        side: n,
                                        size: null,
                                        target: f[n],
                                        whole: null
                                    }
                                      , o = "natural" == d ? i.free() : i.constrain(c.geo.available[k][n].width - m.horizontal, c.geo.available[k][n].height - m.vertical)
                                      , p = o.measure();
                                    if (h.size = p.size,
                                    h.outerSize = {
                                        height: p.size.height + m.vertical,
                                        width: p.size.width + m.horizontal
                                    },
                                    "natural" == d ? c.geo.available[k][n].width >= h.outerSize.width && c.geo.available[k][n].height >= h.outerSize.height ? h.fits = !0 : h.fits = !1 : h.fits = p.fits,
                                    "window" == k && (h.fits ? "top" == n || "bottom" == n ? h.whole = c.geo.origin.windowOffset.right >= e.__options.minIntersection && c.geo.window.size.width - c.geo.origin.windowOffset.left >= e.__options.minIntersection : h.whole = c.geo.origin.windowOffset.bottom >= e.__options.minIntersection && c.geo.window.size.height - c.geo.origin.windowOffset.top >= e.__options.minIntersection : h.whole = !1),
                                    g.push(h),
                                    h.whole)
                                        j = !0;
                                    else if ("natural" == h.mode && (h.fits || h.size.width <= c.geo.available[k][n].width))
                                        return !1
                                }
                            })
                        }
                }),
                e.__instance._trigger({
                    edit: function(a) {
                        g = a
                    },
                    event: b,
                    helper: c,
                    results: g,
                    type: "positionTested"
                }),
                g.sort(function(a, b) {
                    if (a.whole && !b.whole)
                        return -1;
                    if (!a.whole && b.whole)
                        return 1;
                    if (a.whole && b.whole) {
                        var c = e.__options.side.indexOf(a.side)
                          , d = e.__options.side.indexOf(b.side);
                        return d > c ? -1 : c > d ? 1 : "natural" == a.mode ? -1 : 1
                    }
                    if (a.fits && !b.fits)
                        return -1;
                    if (!a.fits && b.fits)
                        return 1;
                    if (a.fits && b.fits) {
                        var c = e.__options.side.indexOf(a.side)
                          , d = e.__options.side.indexOf(b.side);
                        return d > c ? -1 : c > d ? 1 : "natural" == a.mode ? -1 : 1
                    }
                    return "document" == a.container && "bottom" == a.side && "natural" == a.mode ? -1 : 1
                }),
                d = g[0],
                d.coord = {},
                d.side) {
                case "left":
                case "right":
                    d.coord.top = Math.floor(d.target - d.size.height / 2);
                    break;
                case "bottom":
                case "top":
                    d.coord.left = Math.floor(d.target - d.size.width / 2)
                }
                switch (d.side) {
                case "left":
                    d.coord.left = c.geo.origin.windowOffset.left - d.outerSize.width;
                    break;
                case "right":
                    d.coord.left = c.geo.origin.windowOffset.right + d.distance.horizontal;
                    break;
                case "top":
                    d.coord.top = c.geo.origin.windowOffset.top - d.outerSize.height;
                    break;
                case "bottom":
                    d.coord.top = c.geo.origin.windowOffset.bottom + d.distance.vertical
                }
                "window" == d.container ? "top" == d.side || "bottom" == d.side ? d.coord.left < 0 ? c.geo.origin.windowOffset.right - this.__options.minIntersection >= 0 ? d.coord.left = 0 : d.coord.left = c.geo.origin.windowOffset.right - this.__options.minIntersection - 1 : d.coord.left > c.geo.window.size.width - d.size.width && (c.geo.origin.windowOffset.left + this.__options.minIntersection <= c.geo.window.size.width ? d.coord.left = c.geo.window.size.width - d.size.width : d.coord.left = c.geo.origin.windowOffset.left + this.__options.minIntersection + 1 - d.size.width) : d.coord.top < 0 ? c.geo.origin.windowOffset.bottom - this.__options.minIntersection >= 0 ? d.coord.top = 0 : d.coord.top = c.geo.origin.windowOffset.bottom - this.__options.minIntersection - 1 : d.coord.top > c.geo.window.size.height - d.size.height && (c.geo.origin.windowOffset.top + this.__options.minIntersection <= c.geo.window.size.height ? d.coord.top = c.geo.window.size.height - d.size.height : d.coord.top = c.geo.origin.windowOffset.top + this.__options.minIntersection + 1 - d.size.height) : (d.coord.left > c.geo.window.size.width - d.size.width && (d.coord.left = c.geo.window.size.width - d.size.width),
                d.coord.left < 0 && (d.coord.left = 0)),
                e.__sideChange(h, d.side),
                c.tooltipClone = h[0],
                c.tooltipParent = e.__instance.option("parent").parent[0],
                c.mode = d.mode,
                c.whole = d.whole,
                c.origin = e.__instance._$origin[0],
                c.tooltip = e.__instance._$tooltip[0],
                delete d.container,
                delete d.fits,
                delete d.mode,
                delete d.outerSize,
                delete d.whole,
                d.distance = d.distance.horizontal || d.distance.vertical;
                var l = a.extend(!0, {}, d);
                if (e.__instance._trigger({
                    edit: function(a) {
                        d = a
                    },
                    event: b,
                    helper: c,
                    position: l,
                    type: "position"
                }),
                e.__options.functionPosition) {
                    var m = e.__options.functionPosition.call(e, e.__instance, c, l);
                    m && (d = m)
                }
                i.destroy();
                var n, o;
                "top" == d.side || "bottom" == d.side ? (n = {
                    prop: "left",
                    val: d.target - d.coord.left
                },
                o = d.size.width - this.__options.minIntersection) : (n = {
                    prop: "top",
                    val: d.target - d.coord.top
                },
                o = d.size.height - this.__options.minIntersection),
                n.val < this.__options.minIntersection ? n.val = this.__options.minIntersection : n.val > o && (n.val = o);
                var p;
                p = c.geo.origin.fixedLineage ? c.geo.origin.windowOffset : {
                    left: c.geo.origin.windowOffset.left + c.geo.window.scroll.left,
                    top: c.geo.origin.windowOffset.top + c.geo.window.scroll.top
                },
                d.coord = {
                    left: p.left + (d.coord.left - c.geo.origin.windowOffset.left),
                    top: p.top + (d.coord.top - c.geo.origin.windowOffset.top)
                },
                e.__sideChange(e.__instance._$tooltip, d.side),
                c.geo.origin.fixedLineage ? e.__instance._$tooltip.css("position", "fixed") : e.__instance._$tooltip.css("position", ""),
                e.__instance._$tooltip.css({
                    left: d.coord.left,
                    top: d.coord.top,
                    height: d.size.height,
                    width: d.size.width
                }).find(".tooltipster-arrow").css({
                    left: "",
                    top: ""
                }).css(n.prop, n.val),
                e.__instance._$tooltip.appendTo(e.__instance.option("parent")),
                e.__instance._trigger({
                    type: "repositioned",
                    event: b,
                    position: d
                })
            },
            __sideChange: function(a, b) {
                a.removeClass("tooltipster-bottom").removeClass("tooltipster-left").removeClass("tooltipster-right").removeClass("tooltipster-top").addClass("tooltipster-" + b)
            },
            __targetFind: function(a) {
                var b = {}
                  , c = this.__instance._$origin[0].getClientRects();
                if (c.length > 1) {
                    var d = this.__instance._$origin.css("opacity");
                    1 == d && (this.__instance._$origin.css("opacity", .99),
                    c = this.__instance._$origin[0].getClientRects(),
                    this.__instance._$origin.css("opacity", 1))
                }
                if (c.length < 2)
                    b.top = Math.floor(a.geo.origin.windowOffset.left + a.geo.origin.size.width / 2),
                    b.bottom = b.top,
                    b.left = Math.floor(a.geo.origin.windowOffset.top + a.geo.origin.size.height / 2),
                    b.right = b.left;
                else {
                    var e = c[0];
                    b.top = Math.floor(e.left + (e.right - e.left) / 2),
                    e = c.length > 2 ? c[Math.ceil(c.length / 2) - 1] : c[0],
                    b.right = Math.floor(e.top + (e.bottom - e.top) / 2),
                    e = c[c.length - 1],
                    b.bottom = Math.floor(e.left + (e.right - e.left) / 2),
                    e = c.length > 2 ? c[Math.ceil((c.length + 1) / 2) - 1] : c[c.length - 1],
                    b.left = Math.floor(e.top + (e.bottom - e.top) / 2)
                }
                return b
            }
        }
    }),
    a
});
!function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a, b) {
    function c() {
        return new Date(Date.UTC.apply(Date, arguments))
    }
    function d() {
        var a = new Date;
        return c(a.getFullYear(), a.getMonth(), a.getDate())
    }
    function e(a, b) {
        return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate()
    }
    function f(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    function g(a) {
        return a && !isNaN(a.getTime())
    }
    function h(b, c) {
        function d(a, b) {
            return b.toLowerCase()
        }
        var e, f = a(b).data(), g = {}, h = new RegExp("^" + c.toLowerCase() + "([A-Z])");
        c = new RegExp("^" + c.toLowerCase());
        for (var i in f)
            c.test(i) && (e = i.replace(h, d),
            g[e] = f[i]);
        return g
    }
    function i(b) {
        var c = {};
        if (q[b] || (b = b.split("-")[0],
        q[b])) {
            var d = q[b];
            return a.each(p, function(a, b) {
                b in d && (c[b] = d[b])
            }),
            c
        }
    }
    var j = function() {
        var b = {
            get: function(a) {
                return this.slice(a)[0]
            },
            contains: function(a) {
                for (var b = a && a.valueOf(), c = 0, d = this.length; d > c; c++)
                    if (this[c].valueOf() === b)
                        return c;
                return -1
            },
            remove: function(a) {
                this.splice(a, 1)
            },
            replace: function(b) {
                b && (a.isArray(b) || (b = [b]),
                this.clear(),
                this.push.apply(this, b))
            },
            clear: function() {
                this.length = 0
            },
            copy: function() {
                var a = new j;
                return a.replace(this),
                a
            }
        };
        return function() {
            var c = [];
            return c.push.apply(c, arguments),
            a.extend(c, b),
            c
        }
    }()
      , k = function(b, c) {
        a(b).data("datepicker", this),
        this._process_options(c),
        this.dates = new j,
        this.viewDate = this.o.defaultViewDate,
        this.focusDate = null,
        this.element = a(b),
        this.isInput = this.element.is("input"),
        this.inputField = this.isInput ? this.element : this.element.find("input"),
        this.component = this.element.hasClass("date") ? this.element.find(".add-on, .input-group-addon, .btn") : !1,
        this.hasInput = this.component && this.inputField.length,
        this.component && 0 === this.component.length && (this.component = !1),
        this.isInline = !this.component && this.element.is("div"),
        this.picker = a(r.template),
        this._check_template(this.o.templates.leftArrow) && this.picker.find(".prev").html(this.o.templates.leftArrow),
        this._check_template(this.o.templates.rightArrow) && this.picker.find(".next").html(this.o.templates.rightArrow),
        this._buildEvents(),
        this._attachEvents(),
        this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"),
        this.o.rtl && this.picker.addClass("datepicker-rtl"),
        this.viewMode = this.o.startView,
        this.o.calendarWeeks && this.picker.find("thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan", function(a, b) {
            return parseInt(b) + 1
        }),
        this._allow_update = !1,
        this.setStartDate(this._o.startDate),
        this.setEndDate(this._o.endDate),
        this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled),
        this.setDaysOfWeekHighlighted(this.o.daysOfWeekHighlighted),
        this.setDatesDisabled(this.o.datesDisabled),
        this.fillDow(),
        this.fillMonths(),
        this._allow_update = !0,
        this.update(),
        this.showMode(),
        this.isInline && this.show()
    };
    k.prototype = {
        constructor: k,
        _resolveViewName: function(a, c) {
            return 0 === a || "days" === a || "month" === a ? 0 : 1 === a || "months" === a || "year" === a ? 1 : 2 === a || "years" === a || "decade" === a ? 2 : 3 === a || "decades" === a || "century" === a ? 3 : 4 === a || "centuries" === a || "millennium" === a ? 4 : c === b ? !1 : c
        },
        _check_template: function(c) {
            try {
                if (c === b || "" === c)
                    return !1;
                if ((c.match(/[<>]/g) || []).length <= 0)
                    return !0;
                var d = a(c);
                return d.length > 0
            } catch (e) {
                return !1
            }
        },
        _process_options: function(b) {
            this._o = a.extend({}, this._o, b);
            var e = this.o = a.extend({}, this._o)
              , f = e.language;
            q[f] || (f = f.split("-")[0],
            q[f] || (f = o.language)),
            e.language = f,
            e.startView = this._resolveViewName(e.startView, 0),
            e.minViewMode = this._resolveViewName(e.minViewMode, 0),
            e.maxViewMode = this._resolveViewName(e.maxViewMode, 4),
            e.startView = Math.min(e.startView, e.maxViewMode),
            e.startView = Math.max(e.startView, e.minViewMode),
            e.multidate !== !0 && (e.multidate = Number(e.multidate) || !1,
            e.multidate !== !1 && (e.multidate = Math.max(0, e.multidate))),
            e.multidateSeparator = String(e.multidateSeparator),
            e.weekStart %= 7,
            e.weekEnd = (e.weekStart + 6) % 7;
            var g = r.parseFormat(e.format);
            e.startDate !== -(1 / 0) && (e.startDate ? e.startDate instanceof Date ? e.startDate = this._local_to_utc(this._zero_time(e.startDate)) : e.startDate = r.parseDate(e.startDate, g, e.language, e.assumeNearbyYear) : e.startDate = -(1 / 0)),
            e.endDate !== 1 / 0 && (e.endDate ? e.endDate instanceof Date ? e.endDate = this._local_to_utc(this._zero_time(e.endDate)) : e.endDate = r.parseDate(e.endDate, g, e.language, e.assumeNearbyYear) : e.endDate = 1 / 0),
            e.daysOfWeekDisabled = e.daysOfWeekDisabled || [],
            a.isArray(e.daysOfWeekDisabled) || (e.daysOfWeekDisabled = e.daysOfWeekDisabled.split(/[,\s]*/)),
            e.daysOfWeekDisabled = a.map(e.daysOfWeekDisabled, function(a) {
                return parseInt(a, 10)
            }),
            e.daysOfWeekHighlighted = e.daysOfWeekHighlighted || [],
            a.isArray(e.daysOfWeekHighlighted) || (e.daysOfWeekHighlighted = e.daysOfWeekHighlighted.split(/[,\s]*/)),
            e.daysOfWeekHighlighted = a.map(e.daysOfWeekHighlighted, function(a) {
                return parseInt(a, 10)
            }),
            e.datesDisabled = e.datesDisabled || [],
            a.isArray(e.datesDisabled) || (e.datesDisabled = [e.datesDisabled]),
            e.datesDisabled = a.map(e.datesDisabled, function(a) {
                return r.parseDate(a, g, e.language, e.assumeNearbyYear)
            });
            var h = String(e.orientation).toLowerCase().split(/\s+/g)
              , i = e.orientation.toLowerCase();
            if (h = a.grep(h, function(a) {
                return /^auto|left|right|top|bottom$/.test(a)
            }),
            e.orientation = {
                x: "auto",
                y: "auto"
            },
            i && "auto" !== i)
                if (1 === h.length)
                    switch (h[0]) {
                    case "top":
                    case "bottom":
                        e.orientation.y = h[0];
                        break;
                    case "left":
                    case "right":
                        e.orientation.x = h[0]
                    }
                else
                    i = a.grep(h, function(a) {
                        return /^left|right$/.test(a)
                    }),
                    e.orientation.x = i[0] || "auto",
                    i = a.grep(h, function(a) {
                        return /^top|bottom$/.test(a)
                    }),
                    e.orientation.y = i[0] || "auto";
            else
                ;if (e.defaultViewDate) {
                var j = e.defaultViewDate.year || (new Date).getFullYear()
                  , k = e.defaultViewDate.month || 0
                  , l = e.defaultViewDate.day || 1;
                e.defaultViewDate = c(j, k, l)
            } else
                e.defaultViewDate = d()
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function(a) {
            for (var c, d, e, f = 0; f < a.length; f++)
                c = a[f][0],
                2 === a[f].length ? (d = b,
                e = a[f][1]) : 3 === a[f].length && (d = a[f][1],
                e = a[f][2]),
                c.on(e, d)
        },
        _unapplyEvents: function(a) {
            for (var c, d, e, f = 0; f < a.length; f++)
                c = a[f][0],
                2 === a[f].length ? (e = b,
                d = a[f][1]) : 3 === a[f].length && (e = a[f][1],
                d = a[f][2]),
                c.off(d, e)
        },
        _buildEvents: function() {
            var b = {
                keyup: a.proxy(function(b) {
                    -1 === a.inArray(b.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) && this.update()
                }, this),
                keydown: a.proxy(this.keydown, this),
                paste: a.proxy(this.paste, this)
            };
            this.o.showOnFocus === !0 && (b.focus = a.proxy(this.show, this)),
            this.isInput ? this._events = [[this.element, b]] : this.component && this.hasInput ? this._events = [[this.inputField, b], [this.component, {
                click: a.proxy(this.show, this)
            }]] : this._events = [[this.element, {
                click: a.proxy(this.show, this),
                keydown: a.proxy(this.keydown, this)
            }]],
            this._events.push([this.element, "*", {
                blur: a.proxy(function(a) {
                    this._focused_from = a.target
                }, this)
            }], [this.element, {
                blur: a.proxy(function(a) {
                    this._focused_from = a.target
                }, this)
            }]),
            this.o.immediateUpdates && this._events.push([this.element, {
                "changeYear changeMonth": a.proxy(function(a) {
                    this.update(a.date)
                }, this)
            }]),
            this._secondaryEvents = [[this.picker, {
                click: a.proxy(this.click, this)
            }], [a(window), {
                resize: a.proxy(this.place, this)
            }], [a(document), {
                mousedown: a.proxy(function(a) {
                    this.element.is(a.target) || this.element.find(a.target).length || this.picker.is(a.target) || this.picker.find(a.target).length || this.isInline || this.hide()
                }, this)
            }]]
        },
        _attachEvents: function() {
            this._detachEvents(),
            this._applyEvents(this._events)
        },
        _detachEvents: function() {
            this._unapplyEvents(this._events)
        },
        _attachSecondaryEvents: function() {
            this._detachSecondaryEvents(),
            this._applyEvents(this._secondaryEvents)
        },
        _detachSecondaryEvents: function() {
            this._unapplyEvents(this._secondaryEvents)
        },
        _trigger: function(b, c) {
            var d = c || this.dates.get(-1)
              , e = this._utc_to_local(d);
            this.element.trigger({
                type: b,
                date: e,
                dates: a.map(this.dates, this._utc_to_local),
                format: a.proxy(function(a, b) {
                    0 === arguments.length ? (a = this.dates.length - 1,
                    b = this.o.format) : "string" == typeof a && (b = a,
                    a = this.dates.length - 1),
                    b = b || this.o.format;
                    var c = this.dates.get(a);
                    return r.formatDate(c, b, this.o.language)
                }, this)
            })
        },
        show: function() {
            return this.inputField.prop("disabled") || this.inputField.prop("readonly") && this.o.enableOnReadonly === !1 ? void 0 : (this.isInline || this.picker.appendTo(this.o.container),
            this.place(),
            this.picker.show(),
            this._attachSecondaryEvents(),
            this._trigger("show"),
            (window.navigator.msMaxTouchPoints || "ontouchstart"in document) && this.o.disableTouchKeyboard && a(this.element).blur(),
            this)
        },
        hide: function() {
            return this.isInline || !this.picker.is(":visible") ? this : (this.focusDate = null,
            this.picker.hide().detach(),
            this._detachSecondaryEvents(),
            this.viewMode = this.o.startView,
            this.showMode(),
            this.o.forceParse && this.inputField.val() && this.setValue(),
            this._trigger("hide"),
            this)
        },
        destroy: function() {
            return this.hide(),
            this._detachEvents(),
            this._detachSecondaryEvents(),
            this.picker.remove(),
            delete this.element.data().datepicker,
            this.isInput || delete this.element.data().date,
            this
        },
        paste: function(b) {
            var c;
            if (b.originalEvent.clipboardData && b.originalEvent.clipboardData.types && -1 !== a.inArray("text/plain", b.originalEvent.clipboardData.types))
                c = b.originalEvent.clipboardData.getData("text/plain");
            else {
                if (!window.clipboardData)
                    return;
                c = window.clipboardData.getData("Text")
            }
            this.setDate(c),
            this.update(),
            b.preventDefault()
        },
        _utc_to_local: function(a) {
            return a && new Date(a.getTime() + 6e4 * a.getTimezoneOffset())
        },
        _local_to_utc: function(a) {
            return a && new Date(a.getTime() - 6e4 * a.getTimezoneOffset())
        },
        _zero_time: function(a) {
            return a && new Date(a.getFullYear(),a.getMonth(),a.getDate())
        },
        _zero_utc_time: function(a) {
            return a && new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()))
        },
        getDates: function() {
            return a.map(this.dates, this._utc_to_local)
        },
        getUTCDates: function() {
            return a.map(this.dates, function(a) {
                return new Date(a)
            })
        },
        getDate: function() {
            return this._utc_to_local(this.getUTCDate())
        },
        getUTCDate: function() {
            var a = this.dates.get(-1);
            return "undefined" != typeof a ? new Date(a) : null
        },
        clearDates: function() {
            this.inputField && this.inputField.val(""),
            this.update(),
            this._trigger("changeDate"),
            this.o.autoclose && this.hide()
        },
        setDates: function() {
            var b = a.isArray(arguments[0]) ? arguments[0] : arguments;
            return this.update.apply(this, b),
            this._trigger("changeDate"),
            this.setValue(),
            this
        },
        setUTCDates: function() {
            var b = a.isArray(arguments[0]) ? arguments[0] : arguments;
            return this.update.apply(this, a.map(b, this._utc_to_local)),
            this._trigger("changeDate"),
            this.setValue(),
            this
        },
        setDate: f("setDates"),
        setUTCDate: f("setUTCDates"),
        remove: f("destroy"),
        setValue: function() {
            var a = this.getFormattedDate();
            return this.inputField.val(a),
            this
        },
        getFormattedDate: function(c) {
            c === b && (c = this.o.format);
            var d = this.o.language;
            return a.map(this.dates, function(a) {
                return r.formatDate(a, c, d)
            }).join(this.o.multidateSeparator)
        },
        getStartDate: function() {
            return this.o.startDate
        },
        setStartDate: function(a) {
            return this._process_options({
                startDate: a
            }),
            this.update(),
            this.updateNavArrows(),
            this
        },
        getEndDate: function() {
            return this.o.endDate
        },
        setEndDate: function(a) {
            return this._process_options({
                endDate: a
            }),
            this.update(),
            this.updateNavArrows(),
            this
        },
        setDaysOfWeekDisabled: function(a) {
            return this._process_options({
                daysOfWeekDisabled: a
            }),
            this.update(),
            this.updateNavArrows(),
            this
        },
        setDaysOfWeekHighlighted: function(a) {
            return this._process_options({
                daysOfWeekHighlighted: a
            }),
            this.update(),
            this
        },
        setDatesDisabled: function(a) {
            this._process_options({
                datesDisabled: a
            }),
            this.update(),
            this.updateNavArrows()
        },
        place: function() {
            if (this.isInline)
                return this;
            var b = this.picker.outerWidth()
              , c = this.picker.outerHeight()
              , d = 10
              , e = a(this.o.container)
              , f = e.width()
              , g = "body" === this.o.container ? a(document).scrollTop() : e.scrollTop()
              , h = e.offset()
              , i = [];
            this.element.parents().each(function() {
                var b = a(this).css("z-index");
                "auto" !== b && 0 !== b && i.push(parseInt(b))
            });
            var j = Math.max.apply(Math, i) + this.o.zIndexOffset
              , k = this.component ? this.component.parent().offset() : this.element.offset()
              , l = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1)
              , m = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1)
              , n = k.left - h.left
              , o = k.top - h.top;
            "body" !== this.o.container && (o += g),
            this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"),
            "auto" !== this.o.orientation.x ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x),
            "right" === this.o.orientation.x && (n -= b - m)) : k.left < 0 ? (this.picker.addClass("datepicker-orient-left"),
            n -= k.left - d) : n + b > f ? (this.picker.addClass("datepicker-orient-right"),
            n += m - b) : this.picker.addClass("datepicker-orient-left");
            var p, q = this.o.orientation.y;
            if ("auto" === q && (p = -g + o - c,
            q = 0 > p ? "bottom" : "top"),
            this.picker.addClass("datepicker-orient-" + q),
            "top" === q ? o -= c + parseInt(this.picker.css("padding-top")) : o += l,
            this.o.rtl) {
                var r = f - (n + m);
                this.picker.css({
                    top: o,
                    right: r,
                    zIndex: j
                })
            } else
                this.picker.css({
                    top: o,
                    left: n,
                    zIndex: j
                });
            return this
        },
        _allow_update: !0,
        update: function() {
            if (!this._allow_update)
                return this;
            var b = this.dates.copy()
              , c = []
              , d = !1;
            return arguments.length ? (a.each(arguments, a.proxy(function(a, b) {
                b instanceof Date && (b = this._local_to_utc(b)),
                c.push(b)
            }, this)),
            d = !0) : (c = this.isInput ? this.element.val() : this.element.data("date") || this.inputField.val(),
            c = c && this.o.multidate ? c.split(this.o.multidateSeparator) : [c],
            delete this.element.data().date),
            c = a.map(c, a.proxy(function(a) {
                return r.parseDate(a, this.o.format, this.o.language, this.o.assumeNearbyYear)
            }, this)),
            c = a.grep(c, a.proxy(function(a) {
                return !this.dateWithinRange(a) || !a
            }, this), !0),
            this.dates.replace(c),
            this.dates.length ? this.viewDate = new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ? this.viewDate = new Date(this.o.startDate) : this.viewDate > this.o.endDate ? this.viewDate = new Date(this.o.endDate) : this.viewDate = this.o.defaultViewDate,
            d ? this.setValue() : c.length && String(b) !== String(this.dates) && this._trigger("changeDate"),
            !this.dates.length && b.length && this._trigger("clearDate"),
            this.fill(),
            this.element.change(),
            this
        },
        fillDow: function() {
            var b = this.o.weekStart
              , c = "<tr>";
            for (this.o.calendarWeeks && (this.picker.find(".datepicker-days .datepicker-switch").attr("colspan", function(a, b) {
                return parseInt(b) + 1
            }),
            c += '<th class="cw">&#160;</th>'); b < this.o.weekStart + 7; )
                c += '<th class="dow',
                a.inArray(b, this.o.daysOfWeekDisabled) > -1 && (c += " disabled"),
                c += '">' + q[this.o.language].daysMin[b++ % 7] + "</th>";
            c += "</tr>",
            this.picker.find(".datepicker-days thead").append(c)
        },
        fillMonths: function() {
            for (var a = this._utc_to_local(this.viewDate), b = "", c = 0; 12 > c; ) {
                var d = a && a.getMonth() === c ? " focused" : "";
                b += '<span class="month' + d + '">' + q[this.o.language].monthsShort[c++] + "</span>"
            }
            this.picker.find(".datepicker-months td").html(b)
        },
        setRange: function(b) {
            b && b.length ? this.range = a.map(b, function(a) {
                return a.valueOf()
            }) : delete this.range,
            this.fill()
        },
        getClassNames: function(b) {
            var c = []
              , d = this.viewDate.getUTCFullYear()
              , e = this.viewDate.getUTCMonth()
              , f = new Date;
            return b.getUTCFullYear() < d || b.getUTCFullYear() === d && b.getUTCMonth() < e ? c.push("old") : (b.getUTCFullYear() > d || b.getUTCFullYear() === d && b.getUTCMonth() > e) && c.push("new"),
            this.focusDate && b.valueOf() === this.focusDate.valueOf() && c.push("focused"),
            this.o.todayHighlight && b.getUTCFullYear() === f.getFullYear() && b.getUTCMonth() === f.getMonth() && b.getUTCDate() === f.getDate() && c.push("today"),
            -1 !== this.dates.contains(b) && c.push("active"),
            this.dateWithinRange(b) || c.push("disabled"),
            this.dateIsDisabled(b) && c.push("disabled", "disabled-date"),
            -1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekHighlighted) && c.push("highlighted"),
            this.range && (b > this.range[0] && b < this.range[this.range.length - 1] && c.push("range"),
            -1 !== a.inArray(b.valueOf(), this.range) && c.push("selected"),
            b.valueOf() === this.range[0] && c.push("range-start"),
            b.valueOf() === this.range[this.range.length - 1] && c.push("range-end")),
            c
        },
        _fill_yearsView: function(c, d, e, f, g, h, i, j) {
            var k, l, m, n, o, p, q, r, s, t, u;
            for (k = "",
            l = this.picker.find(c),
            m = parseInt(g / e, 10) * e,
            o = parseInt(h / f, 10) * f,
            p = parseInt(i / f, 10) * f,
            n = a.map(this.dates, function(a) {
                return parseInt(a.getUTCFullYear() / f, 10) * f
            }),
            l.find(".datepicker-switch").text(m + "-" + (m + 9 * f)),
            q = m - f,
            r = -1; 11 > r; r += 1)
                s = [d],
                t = null,
                -1 === r ? s.push("old") : 10 === r && s.push("new"),
                -1 !== a.inArray(q, n) && s.push("active"),
                (o > q || q > p) && s.push("disabled"),
                q === this.viewDate.getFullYear() && s.push("focused"),
                j !== a.noop && (u = j(new Date(q,0,1)),
                u === b ? u = {} : "boolean" == typeof u ? u = {
                    enabled: u
                } : "string" == typeof u && (u = {
                    classes: u
                }),
                u.enabled === !1 && s.push("disabled"),
                u.classes && (s = s.concat(u.classes.split(/\s+/))),
                u.tooltip && (t = u.tooltip)),
                k += '<span class="' + s.join(" ") + '"' + (t ? ' title="' + t + '"' : "") + ">" + q + "</span>",
                q += f;
            l.find("td").html(k)
        },
        fill: function() {
            var d, e, f = new Date(this.viewDate), g = f.getUTCFullYear(), h = f.getUTCMonth(), i = this.o.startDate !== -(1 / 0) ? this.o.startDate.getUTCFullYear() : -(1 / 0), j = this.o.startDate !== -(1 / 0) ? this.o.startDate.getUTCMonth() : -(1 / 0), k = this.o.endDate !== 1 / 0 ? this.o.endDate.getUTCFullYear() : 1 / 0, l = this.o.endDate !== 1 / 0 ? this.o.endDate.getUTCMonth() : 1 / 0, m = q[this.o.language].today || q.en.today || "", n = q[this.o.language].clear || q.en.clear || "", o = q[this.o.language].titleFormat || q.en.titleFormat;
            if (!isNaN(g) && !isNaN(h)) {
                this.picker.find(".datepicker-days .datepicker-switch").text(r.formatDate(f, o, this.o.language)),
                this.picker.find("tfoot .today").text(m).toggle(this.o.todayBtn !== !1),
                this.picker.find("tfoot .clear").text(n).toggle(this.o.clearBtn !== !1),
                this.picker.find("thead .datepicker-title").text(this.o.title).toggle("" !== this.o.title),
                this.updateNavArrows(),
                this.fillMonths();
                var p = c(g, h - 1, 28)
                  , s = r.getDaysInMonth(p.getUTCFullYear(), p.getUTCMonth());
                p.setUTCDate(s),
                p.setUTCDate(s - (p.getUTCDay() - this.o.weekStart + 7) % 7);
                var t = new Date(p);
                p.getUTCFullYear() < 100 && t.setUTCFullYear(p.getUTCFullYear()),
                t.setUTCDate(t.getUTCDate() + 42),
                t = t.valueOf();
                for (var u, v = []; p.valueOf() < t; ) {
                    if (p.getUTCDay() === this.o.weekStart && (v.push("<tr>"),
                    this.o.calendarWeeks)) {
                        var w = new Date(+p + (this.o.weekStart - p.getUTCDay() - 7) % 7 * 864e5)
                          , x = new Date(Number(w) + (11 - w.getUTCDay()) % 7 * 864e5)
                          , y = new Date(Number(y = c(x.getUTCFullYear(), 0, 1)) + (11 - y.getUTCDay()) % 7 * 864e5)
                          , z = (x - y) / 864e5 / 7 + 1;
                        v.push('<td class="cw">' + z + "</td>")
                    }
                    u = this.getClassNames(p),
                    u.push("day"),
                    this.o.beforeShowDay !== a.noop && (e = this.o.beforeShowDay(this._utc_to_local(p)),
                    e === b ? e = {} : "boolean" == typeof e ? e = {
                        enabled: e
                    } : "string" == typeof e && (e = {
                        classes: e
                    }),
                    e.enabled === !1 && u.push("disabled"),
                    e.classes && (u = u.concat(e.classes.split(/\s+/))),
                    e.tooltip && (d = e.tooltip)),
                    u = a.isFunction(a.uniqueSort) ? a.uniqueSort(u) : a.unique(u),
                    v.push('<td class="' + u.join(" ") + '"' + (d ? ' title="' + d + '"' : "") + ">" + p.getUTCDate() + "</td>"),
                    d = null,
                    p.getUTCDay() === this.o.weekEnd && v.push("</tr>"),
                    p.setUTCDate(p.getUTCDate() + 1)
                }
                this.picker.find(".datepicker-days tbody").empty().append(v.join(""));
                var A = q[this.o.language].monthsTitle || q.en.monthsTitle || "Months"
                  , B = this.picker.find(".datepicker-months").find(".datepicker-switch").text(this.o.maxViewMode < 2 ? A : g).end().find("span").removeClass("active");
                if (a.each(this.dates, function(a, b) {
                    b.getUTCFullYear() === g && B.eq(b.getUTCMonth()).addClass("active")
                }),
                (i > g || g > k) && B.addClass("disabled"),
                g === i && B.slice(0, j).addClass("disabled"),
                g === k && B.slice(l + 1).addClass("disabled"),
                this.o.beforeShowMonth !== a.noop) {
                    var C = this;
                    a.each(B, function(c, d) {
                        var e = new Date(g,c,1)
                          , f = C.o.beforeShowMonth(e);
                        f === b ? f = {} : "boolean" == typeof f ? f = {
                            enabled: f
                        } : "string" == typeof f && (f = {
                            classes: f
                        }),
                        f.enabled !== !1 || a(d).hasClass("disabled") || a(d).addClass("disabled"),
                        f.classes && a(d).addClass(f.classes),
                        f.tooltip && a(d).prop("title", f.tooltip)
                    })
                }
                this._fill_yearsView(".datepicker-years", "year", 10, 1, g, i, k, this.o.beforeShowYear),
                this._fill_yearsView(".datepicker-decades", "decade", 100, 10, g, i, k, this.o.beforeShowDecade),
                this._fill_yearsView(".datepicker-centuries", "century", 1e3, 100, g, i, k, this.o.beforeShowCentury)
            }
        },
        updateNavArrows: function() {
            if (this._allow_update) {
                var a = new Date(this.viewDate)
                  , b = a.getUTCFullYear()
                  , c = a.getUTCMonth();
                switch (this.viewMode) {
                case 0:
                    this.o.startDate !== -(1 / 0) && b <= this.o.startDate.getUTCFullYear() && c <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({
                        visibility: "hidden"
                    }) : this.picker.find(".prev").css({
                        visibility: "visible"
                    }),
                    this.o.endDate !== 1 / 0 && b >= this.o.endDate.getUTCFullYear() && c >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({
                        visibility: "hidden"
                    }) : this.picker.find(".next").css({
                        visibility: "visible"
                    });
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    this.o.startDate !== -(1 / 0) && b <= this.o.startDate.getUTCFullYear() || this.o.maxViewMode < 2 ? this.picker.find(".prev").css({
                        visibility: "hidden"
                    }) : this.picker.find(".prev").css({
                        visibility: "visible"
                    }),
                    this.o.endDate !== 1 / 0 && b >= this.o.endDate.getUTCFullYear() || this.o.maxViewMode < 2 ? this.picker.find(".next").css({
                        visibility: "hidden"
                    }) : this.picker.find(".next").css({
                        visibility: "visible"
                    })
                }
            }
        },
        click: function(b) {
            b.preventDefault(),
            b.stopPropagation();
            var e, f, g, h, i, j, k;
            e = a(b.target),
            e.hasClass("datepicker-switch") && this.showMode(1);
            var l = e.closest(".prev, .next");
            l.length > 0 && (f = r.modes[this.viewMode].navStep * (l.hasClass("prev") ? -1 : 1),
            0 === this.viewMode ? (this.viewDate = this.moveMonth(this.viewDate, f),
            this._trigger("changeMonth", this.viewDate)) : (this.viewDate = this.moveYear(this.viewDate, f),
            1 === this.viewMode && this._trigger("changeYear", this.viewDate)),
            this.fill()),
            e.hasClass("today") && !e.hasClass("day") && (this.showMode(-2),
            this._setDate(d(), "linked" === this.o.todayBtn ? null : "view")),
            e.hasClass("clear") && this.clearDates(),
            e.hasClass("disabled") || (e.hasClass("day") && (g = parseInt(e.text(), 10) || 1,
            h = this.viewDate.getUTCFullYear(),
            i = this.viewDate.getUTCMonth(),
            e.hasClass("old") && (0 === i ? (i = 11,
            h -= 1,
            j = !0,
            k = !0) : (i -= 1,
            j = !0)),
            e.hasClass("new") && (11 === i ? (i = 0,
            h += 1,
            j = !0,
            k = !0) : (i += 1,
            j = !0)),
            this._setDate(c(h, i, g)),
            k && this._trigger("changeYear", this.viewDate),
            j && this._trigger("changeMonth", this.viewDate)),
            e.hasClass("month") && (this.viewDate.setUTCDate(1),
            g = 1,
            i = e.parent().find("span").index(e),
            h = this.viewDate.getUTCFullYear(),
            this.viewDate.setUTCMonth(i),
            this._trigger("changeMonth", this.viewDate),
            1 === this.o.minViewMode ? (this._setDate(c(h, i, g)),
            this.showMode()) : this.showMode(-1),
            this.fill()),
            (e.hasClass("year") || e.hasClass("decade") || e.hasClass("century")) && (this.viewDate.setUTCDate(1),
            g = 1,
            i = 0,
            h = parseInt(e.text(), 10) || 0,
            this.viewDate.setUTCFullYear(h),
            e.hasClass("year") && (this._trigger("changeYear", this.viewDate),
            2 === this.o.minViewMode && this._setDate(c(h, i, g))),
            e.hasClass("decade") && (this._trigger("changeDecade", this.viewDate),
            3 === this.o.minViewMode && this._setDate(c(h, i, g))),
            e.hasClass("century") && (this._trigger("changeCentury", this.viewDate),
            4 === this.o.minViewMode && this._setDate(c(h, i, g))),
            this.showMode(-1),
            this.fill())),
            this.picker.is(":visible") && this._focused_from && a(this._focused_from).focus(),
            delete this._focused_from
        },
        _toggle_multidate: function(a) {
            var b = this.dates.contains(a);
            if (a || this.dates.clear(),
            -1 !== b ? (this.o.multidate === !0 || this.o.multidate > 1 || this.o.toggleActive) && this.dates.remove(b) : this.o.multidate === !1 ? (this.dates.clear(),
            this.dates.push(a)) : this.dates.push(a),
            "number" == typeof this.o.multidate)
                for (; this.dates.length > this.o.multidate; )
                    this.dates.remove(0)
        },
        _setDate: function(a, b) {
            b && "date" !== b || this._toggle_multidate(a && new Date(a)),
            b && "view" !== b || (this.viewDate = a && new Date(a)),
            this.fill(),
            this.setValue(),
            b && "view" === b || this._trigger("changeDate"),
            this.inputField && this.inputField.change(),
            !this.o.autoclose || b && "date" !== b || this.hide()
        },
        moveDay: function(a, b) {
            var c = new Date(a);
            return c.setUTCDate(a.getUTCDate() + b),
            c
        },
        moveWeek: function(a, b) {
            return this.moveDay(a, 7 * b)
        },
        moveMonth: function(a, b) {
            if (!g(a))
                return this.o.defaultViewDate;
            if (!b)
                return a;
            var c, d, e = new Date(a.valueOf()), f = e.getUTCDate(), h = e.getUTCMonth(), i = Math.abs(b);
            if (b = b > 0 ? 1 : -1,
            1 === i)
                d = -1 === b ? function() {
                    return e.getUTCMonth() === h
                }
                : function() {
                    return e.getUTCMonth() !== c
                }
                ,
                c = h + b,
                e.setUTCMonth(c),
                (0 > c || c > 11) && (c = (c + 12) % 12);
            else {
                for (var j = 0; i > j; j++)
                    e = this.moveMonth(e, b);
                c = e.getUTCMonth(),
                e.setUTCDate(f),
                d = function() {
                    return c !== e.getUTCMonth()
                }
            }
            for (; d(); )
                e.setUTCDate(--f),
                e.setUTCMonth(c);
            return e
        },
        moveYear: function(a, b) {
            return this.moveMonth(a, 12 * b)
        },
        moveAvailableDate: function(a, b, c) {
            do {
                if (a = this[c](a, b),
                !this.dateWithinRange(a))
                    return !1;
                c = "moveDay"
            } while (this.dateIsDisabled(a));return a
        },
        weekOfDateIsDisabled: function(b) {
            return -1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekDisabled)
        },
        dateIsDisabled: function(b) {
            return this.weekOfDateIsDisabled(b) || a.grep(this.o.datesDisabled, function(a) {
                return e(b, a)
            }).length > 0
        },
        dateWithinRange: function(a) {
            return a >= this.o.startDate && a <= this.o.endDate
        },
        keydown: function(a) {
            if (!this.picker.is(":visible"))
                return void ((40 === a.keyCode || 27 === a.keyCode) && (this.show(),
                a.stopPropagation()));
            var b, c, d = !1, e = this.focusDate || this.viewDate;
            switch (a.keyCode) {
            case 27:
                this.focusDate ? (this.focusDate = null,
                this.viewDate = this.dates.get(-1) || this.viewDate,
                this.fill()) : this.hide(),
                a.preventDefault(),
                a.stopPropagation();
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                if (!this.o.keyboardNavigation || 7 === this.o.daysOfWeekDisabled.length)
                    break;
                b = 37 === a.keyCode || 38 === a.keyCode ? -1 : 1,
                0 === this.viewMode ? a.ctrlKey ? (c = this.moveAvailableDate(e, b, "moveYear"),
                c && this._trigger("changeYear", this.viewDate)) : a.shiftKey ? (c = this.moveAvailableDate(e, b, "moveMonth"),
                c && this._trigger("changeMonth", this.viewDate)) : 37 === a.keyCode || 39 === a.keyCode ? c = this.moveAvailableDate(e, b, "moveDay") : this.weekOfDateIsDisabled(e) || (c = this.moveAvailableDate(e, b, "moveWeek")) : 1 === this.viewMode ? ((38 === a.keyCode || 40 === a.keyCode) && (b = 4 * b),
                c = this.moveAvailableDate(e, b, "moveMonth")) : 2 === this.viewMode && ((38 === a.keyCode || 40 === a.keyCode) && (b = 4 * b),
                c = this.moveAvailableDate(e, b, "moveYear")),
                c && (this.focusDate = this.viewDate = c,
                this.setValue(),
                this.fill(),
                a.preventDefault());
                break;
            case 13:
                if (!this.o.forceParse)
                    break;
                e = this.focusDate || this.dates.get(-1) || this.viewDate,
                this.o.keyboardNavigation && (this._toggle_multidate(e),
                d = !0),
                this.focusDate = null,
                this.viewDate = this.dates.get(-1) || this.viewDate,
                this.setValue(),
                this.fill(),
                this.picker.is(":visible") && (a.preventDefault(),
                a.stopPropagation(),
                this.o.autoclose && this.hide());
                break;
            case 9:
                this.focusDate = null,
                this.viewDate = this.dates.get(-1) || this.viewDate,
                this.fill(),
                this.hide()
            }
            d && (this.dates.length ? this._trigger("changeDate") : this._trigger("clearDate"),
            this.inputField && this.inputField.change())
        },
        showMode: function(a) {
            a && (this.viewMode = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, this.viewMode + a))),
            this.picker.children("div").hide().filter(".datepicker-" + r.modes[this.viewMode].clsName).show(),
            this.updateNavArrows()
        }
    };
    var l = function(b, c) {
        a(b).data("datepicker", this),
        this.element = a(b),
        this.inputs = a.map(c.inputs, function(a) {
            return a.jquery ? a[0] : a
        }),
        delete c.inputs,
        n.call(a(this.inputs), c).on("changeDate", a.proxy(this.dateUpdated, this)),
        this.pickers = a.map(this.inputs, function(b) {
            return a(b).data("datepicker")
        }),
        this.updateDates()
    };
    l.prototype = {
        updateDates: function() {
            this.dates = a.map(this.pickers, function(a) {
                return a.getUTCDate()
            }),
            this.updateRanges()
        },
        updateRanges: function() {
            var b = a.map(this.dates, function(a) {
                return a.valueOf()
            });
            a.each(this.pickers, function(a, c) {
                c.setRange(b)
            })
        },
        dateUpdated: function(b) {
            if (!this.updating) {
                this.updating = !0;
                var c = a(b.target).data("datepicker");
                if ("undefined" != typeof c) {
                    var d = c.getUTCDate()
                      , e = a.inArray(b.target, this.inputs)
                      , f = e - 1
                      , g = e + 1
                      , h = this.inputs.length;
                    if (-1 !== e) {
                        if (a.each(this.pickers, function(a, b) {
                            b.getUTCDate() || b.setUTCDate(d)
                        }),
                        d < this.dates[f])
                            for (; f >= 0 && d < this.dates[f]; )
                                this.pickers[f--].setUTCDate(d);
                        else if (d > this.dates[g])
                            for (; h > g && d > this.dates[g]; )
                                this.pickers[g++].setUTCDate(d);
                        this.updateDates(),
                        delete this.updating
                    }
                }
            }
        },
        remove: function() {
            a.map(this.pickers, function(a) {
                a.remove()
            }),
            delete this.element.data().datepicker
        }
    };
    var m = a.fn.datepicker
      , n = function(c) {
        var d = Array.apply(null, arguments);
        d.shift();
        var e;
        if (this.each(function() {
            var b = a(this)
              , f = b.data("datepicker")
              , g = "object" == typeof c && c;
            if (!f) {
                var j = h(this, "date")
                  , m = a.extend({}, o, j, g)
                  , n = i(m.language)
                  , p = a.extend({}, o, n, j, g);
                b.hasClass("input-daterange") || p.inputs ? (a.extend(p, {
                    inputs: p.inputs || b.find("input").toArray()
                }),
                f = new l(this,p)) : f = new k(this,p),
                b.data("datepicker", f)
            }
            "string" == typeof c && "function" == typeof f[c] && (e = f[c].apply(f, d))
        }),
        e === b || e instanceof k || e instanceof l)
            return this;
        if (this.length > 1)
            throw new Error("Using only allowed for the collection of a single element (" + c + " function)");
        return e
    };
    a.fn.datepicker = n;
    var o = a.fn.datepicker.defaults = {
        assumeNearbyYear: !1,
        autoclose: !1,
        beforeShowDay: a.noop,
        beforeShowMonth: a.noop,
        beforeShowYear: a.noop,
        beforeShowDecade: a.noop,
        beforeShowCentury: a.noop,
        calendarWeeks: !1,
        clearBtn: !1,
        toggleActive: !1,
        daysOfWeekDisabled: [],
        daysOfWeekHighlighted: [],
        datesDisabled: [],
        endDate: 1 / 0,
        forceParse: !0,
        format: "mm/dd/yyyy",
        keyboardNavigation: !0,
        language: "en",
        minViewMode: 0,
        maxViewMode: 4,
        multidate: !1,
        multidateSeparator: ",",
        orientation: "auto",
        rtl: !1,
        startDate: -(1 / 0),
        startView: 0,
        todayBtn: !1,
        todayHighlight: !1,
        weekStart: 0,
        disableTouchKeyboard: !1,
        enableOnReadonly: !0,
        showOnFocus: !0,
        zIndexOffset: 10,
        container: "body",
        immediateUpdates: !1,
        title: "",
        templates: {
            leftArrow: "&laquo;",
            rightArrow: "&raquo;"
        }
    }
      , p = a.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
    a.fn.datepicker.Constructor = k;
    var q = a.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear",
            titleFormat: "MM yyyy"
        }
    }
      , r = {
        modes: [{
            clsName: "days",
            navFnc: "Month",
            navStep: 1
        }, {
            clsName: "months",
            navFnc: "FullYear",
            navStep: 1
        }, {
            clsName: "years",
            navFnc: "FullYear",
            navStep: 10
        }, {
            clsName: "decades",
            navFnc: "FullDecade",
            navStep: 100
        }, {
            clsName: "centuries",
            navFnc: "FullCentury",
            navStep: 1e3
        }],
        isLeapYear: function(a) {
            return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
        },
        getDaysInMonth: function(a, b) {
            return [31, r.isLeapYear(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
        parseFormat: function(a) {
            if ("function" == typeof a.toValue && "function" == typeof a.toDisplay)
                return a;
            var b = a.replace(this.validParts, "\0").split("\0")
              , c = a.match(this.validParts);
            if (!b || !b.length || !c || 0 === c.length)
                throw new Error("Invalid date format.");
            return {
                separators: b,
                parts: c
            }
        },
        parseDate: function(e, f, g, h) {
            function i(a, b) {
                return b === !0 && (b = 10),
                100 > a && (a += 2e3,
                a > (new Date).getFullYear() + b && (a -= 100)),
                a
            }
            function j() {
                var a = this.slice(0, s[n].length)
                  , b = s[n].slice(0, a.length);
                return a.toLowerCase() === b.toLowerCase()
            }
            if (!e)
                return b;
            if (e instanceof Date)
                return e;
            if ("string" == typeof f && (f = r.parseFormat(f)),
            f.toValue)
                return f.toValue(e, f, g);
            var l, m, n, o, p = /([\-+]\d+)([dmwy])/, s = e.match(/([\-+]\d+)([dmwy])/g), t = {
                d: "moveDay",
                m: "moveMonth",
                w: "moveWeek",
                y: "moveYear"
            }, u = {
                yesterday: "-1d",
                today: "+0d",
                tomorrow: "+1d"
            };
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(e)) {
                for (e = new Date,
                n = 0; n < s.length; n++)
                    l = p.exec(s[n]),
                    m = parseInt(l[1]),
                    o = t[l[2]],
                    e = k.prototype[o](e, m);
                return c(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())
            }
            if ("undefined" != typeof u[e] && (e = u[e],
            s = e.match(/([\-+]\d+)([dmwy])/g),
            /^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(e))) {
                for (e = new Date,
                n = 0; n < s.length; n++)
                    l = p.exec(s[n]),
                    m = parseInt(l[1]),
                    o = t[l[2]],
                    e = k.prototype[o](e, m);
                return c(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())
            }
            s = e && e.match(this.nonpunctuation) || [],
            e = new Date;
            var v, w, x = {}, y = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"], z = {
                yyyy: function(a, b) {
                    return a.setUTCFullYear(h ? i(b, h) : b)
                },
                yy: function(a, b) {
                    return a.setUTCFullYear(h ? i(b, h) : b)
                },
                m: function(a, b) {
                    if (isNaN(a))
                        return a;
                    for (b -= 1; 0 > b; )
                        b += 12;
                    for (b %= 12,
                    a.setUTCMonth(b); a.getUTCMonth() !== b; )
                        a.setUTCDate(a.getUTCDate() - 1);
                    return a
                },
                d: function(a, b) {
                    return a.setUTCDate(b)
                }
            };
            z.M = z.MM = z.mm = z.m,
            z.dd = z.d,
            e = d();
            var A = f.parts.slice();
            if (s.length !== A.length && (A = a(A).filter(function(b, c) {
                return -1 !== a.inArray(c, y)
            }).toArray()),
            s.length === A.length) {
                var B;
                for (n = 0,
                B = A.length; B > n; n++) {
                    if (v = parseInt(s[n], 10),
                    l = A[n],
                    isNaN(v))
                        switch (l) {
                        case "MM":
                            w = a(q[g].months).filter(j),
                            v = a.inArray(w[0], q[g].months) + 1;
                            break;
                        case "M":
                            w = a(q[g].monthsShort).filter(j),
                            v = a.inArray(w[0], q[g].monthsShort) + 1
                        }
                    x[l] = v
                }
                var C, D;
                for (n = 0; n < y.length; n++)
                    D = y[n],
                    D in x && !isNaN(x[D]) && (C = new Date(e),
                    z[D](C, x[D]),
                    isNaN(C) || (e = C))
            }
            return e
        },
        formatDate: function(b, c, d) {
            if (!b)
                return "";
            if ("string" == typeof c && (c = r.parseFormat(c)),
            c.toDisplay)
                return c.toDisplay(b, c, d);
            var e = {
                d: b.getUTCDate(),
                D: q[d].daysShort[b.getUTCDay()],
                DD: q[d].days[b.getUTCDay()],
                m: b.getUTCMonth() + 1,
                M: q[d].monthsShort[b.getUTCMonth()],
                MM: q[d].months[b.getUTCMonth()],
                yy: b.getUTCFullYear().toString().substring(2),
                yyyy: b.getUTCFullYear()
            };
            e.dd = (e.d < 10 ? "0" : "") + e.d,
            e.mm = (e.m < 10 ? "0" : "") + e.m,
            b = [];
            for (var f = a.extend([], c.separators), g = 0, h = c.parts.length; h >= g; g++)
                f.length && b.push(f.shift()),
                b.push(e[c.parts[g]]);
            return b.join("")
        },
        headTemplate: '<thead><tr><th colspan="7" class="datepicker-title"></th></tr><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
    };
    r.template = '<div class="datepicker"><div class="datepicker-days"><table class="table-condensed">' + r.headTemplate + "<tbody></tbody>" + r.footTemplate + '</table></div><div class="datepicker-months"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + '</table></div><div class="datepicker-years"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + '</table></div><div class="datepicker-decades"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + '</table></div><div class="datepicker-centuries"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + "</table></div></div>",
    a.fn.datepicker.DPGlobal = r,
    a.fn.datepicker.noConflict = function() {
        return a.fn.datepicker = m,
        this
    }
    ,
    a.fn.datepicker.version = "1.6.4",
    a(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(b) {
        var c = a(this);
        c.data("datepicker") || (b.preventDefault(),
        n.call(c, "show"))
    }),
    a(function() {
        n.call(a('[data-provide="datepicker-inline"]'))
    })
});
!function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function($) {
            return factory(root, $)
        })
    } else if (typeof exports === "object") {
        factory(root, require("jquery"))
    } else {
        factory(root, root.jQuery || root.Zepto)
    }
}(this, function(global, $) {
    "use strict";
    var PLUGIN_NAME = "remodal";
    var NAMESPACE = global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.NAMESPACE || PLUGIN_NAME;
    var ANIMATIONSTART_EVENTS = $.map(["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"], function(eventName) {
        return eventName + "." + NAMESPACE
    }).join(" ");
    var ANIMATIONEND_EVENTS = $.map(["animationend", "webkitAnimationEnd", "MSAnimationEnd", "oAnimationEnd"], function(eventName) {
        return eventName + "." + NAMESPACE
    }).join(" ");
    var DEFAULTS = $.extend({
        hashTracking: true,
        closeOnConfirm: true,
        closeOnCancel: true,
        closeOnEscape: true,
        closeOnOutsideClick: true,
        modifier: "",
        appendTo: null
    }, global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.DEFAULTS);
    var STATES = {
        CLOSING: "closing",
        CLOSED: "closed",
        OPENING: "opening",
        OPENED: "opened"
    };
    var STATE_CHANGE_REASONS = {
        CONFIRMATION: "confirmation",
        CANCELLATION: "cancellation"
    };
    var IS_ANIMATION = function() {
        var style = document.createElement("div").style;
        return style.animationName !== undefined || style.WebkitAnimationName !== undefined || style.MozAnimationName !== undefined || style.msAnimationName !== undefined || style.OAnimationName !== undefined
    }();
    var IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);
    var current;
    var scrollTop;
    function getAnimationDuration($elem) {
        if (IS_ANIMATION && $elem.css("animation-name") === "none" && $elem.css("-webkit-animation-name") === "none" && $elem.css("-moz-animation-name") === "none" && $elem.css("-o-animation-name") === "none" && $elem.css("-ms-animation-name") === "none") {
            return 0
        }
        var duration = $elem.css("animation-duration") || $elem.css("-webkit-animation-duration") || $elem.css("-moz-animation-duration") || $elem.css("-o-animation-duration") || $elem.css("-ms-animation-duration") || "0s";
        var delay = $elem.css("animation-delay") || $elem.css("-webkit-animation-delay") || $elem.css("-moz-animation-delay") || $elem.css("-o-animation-delay") || $elem.css("-ms-animation-delay") || "0s";
        var iterationCount = $elem.css("animation-iteration-count") || $elem.css("-webkit-animation-iteration-count") || $elem.css("-moz-animation-iteration-count") || $elem.css("-o-animation-iteration-count") || $elem.css("-ms-animation-iteration-count") || "1";
        var max;
        var len;
        var num;
        var i;
        duration = duration.split(", ");
        delay = delay.split(", ");
        iterationCount = iterationCount.split(", ");
        for (i = 0,
        len = duration.length,
        max = Number.NEGATIVE_INFINITY; i < len; i++) {
            num = parseFloat(duration[i]) * parseInt(iterationCount[i], 10) + parseFloat(delay[i]);
            if (num > max) {
                max = num
            }
        }
        return max
    }
    function getScrollbarWidth() {
        if ($(document).height() <= $(window).height()) {
            return 0
        }
        var outer = document.createElement("div");
        var inner = document.createElement("div");
        var widthNoScroll;
        var widthWithScroll;
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        document.body.appendChild(outer);
        widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";
        inner.style.width = "100%";
        outer.appendChild(inner);
        widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll
    }
    function lockScreen() {
        if (IS_IOS) {
            return
        }
        var $html = $("html");
        var lockedClass = namespacify("is-locked");
        var paddingRight;
        var $body;
        if (!$html.hasClass(lockedClass)) {
            $body = $(document.body);
            paddingRight = parseInt($body.css("padding-right"), 10) + getScrollbarWidth();
            $body.css("padding-right", paddingRight + "px");
            $html.addClass(lockedClass)
        }
    }
    function unlockScreen() {
        if (IS_IOS) {
            return
        }
        var $html = $("html");
        var lockedClass = namespacify("is-locked");
        var paddingRight;
        var $body;
        if ($html.hasClass(lockedClass)) {
            $body = $(document.body);
            paddingRight = parseInt($body.css("padding-right"), 10) - getScrollbarWidth();
            $body.css("padding-right", paddingRight + "px");
            $html.removeClass(lockedClass)
        }
    }
    function setState(instance, state, isSilent, reason) {
        var newState = namespacify("is", state);
        var allStates = [namespacify("is", STATES.CLOSING), namespacify("is", STATES.OPENING), namespacify("is", STATES.CLOSED), namespacify("is", STATES.OPENED)].join(" ");
        instance.$bg.removeClass(allStates).addClass(newState);
        instance.$overlay.removeClass(allStates).addClass(newState);
        instance.$wrapper.removeClass(allStates).addClass(newState);
        instance.$modal.removeClass(allStates).addClass(newState);
        instance.state = state;
        !isSilent && instance.$modal.trigger({
            type: state,
            reason: reason
        }, [{
            reason: reason
        }])
    }
    function syncWithAnimation(doBeforeAnimation, doAfterAnimation, instance) {
        var runningAnimationsCount = 0;
        var handleAnimationStart = function(e) {
            if (e.target !== this) {
                return
            }
            runningAnimationsCount++
        };
        var handleAnimationEnd = function(e) {
            if (e.target !== this) {
                return
            }
            if (--runningAnimationsCount === 0) {
                $.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
                    instance[elemName].off(ANIMATIONSTART_EVENTS + " " + ANIMATIONEND_EVENTS)
                });
                doAfterAnimation()
            }
        };
        $.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
            instance[elemName].on(ANIMATIONSTART_EVENTS, handleAnimationStart).on(ANIMATIONEND_EVENTS, handleAnimationEnd)
        });
        doBeforeAnimation();
        if (getAnimationDuration(instance.$bg) === 0 && getAnimationDuration(instance.$overlay) === 0 && getAnimationDuration(instance.$wrapper) === 0 && getAnimationDuration(instance.$modal) === 0) {
            $.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
                instance[elemName].off(ANIMATIONSTART_EVENTS + " " + ANIMATIONEND_EVENTS)
            });
            doAfterAnimation()
        }
    }
    function halt(instance) {
        if (instance.state === STATES.CLOSED) {
            return
        }
        $.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
            instance[elemName].off(ANIMATIONSTART_EVENTS + " " + ANIMATIONEND_EVENTS)
        });
        instance.$bg.removeClass(instance.settings.modifier);
        instance.$overlay.removeClass(instance.settings.modifier).hide();
        instance.$wrapper.hide();
        unlockScreen();
        setState(instance, STATES.CLOSED, true)
    }
    function parseOptions(str) {
        var obj = {};
        var arr;
        var len;
        var val;
        var i;
        str = str.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ",");
        arr = str.split(",");
        for (i = 0,
        len = arr.length; i < len; i++) {
            arr[i] = arr[i].split(":");
            val = arr[i][1];
            if (typeof val === "string" || val instanceof String) {
                val = val === "true" || (val === "false" ? false : val)
            }
            if (typeof val === "string" || val instanceof String) {
                val = !isNaN(val) ? +val : val
            }
            obj[arr[i][0]] = val
        }
        return obj
    }
    function namespacify() {
        var result = NAMESPACE;
        for (var i = 0; i < arguments.length; ++i) {
            result += "-" + arguments[i]
        }
        return result
    }
    function handleHashChangeEvent() {
        var id = location.hash.replace("#", "");
        var instance;
        var $elem;
        if (!id) {
            if (current && current.state === STATES.OPENED && current.settings.hashTracking) {
                current.close()
            }
        } else {
            try {
                $elem = $("[data-" + PLUGIN_NAME + '-id="' + id + '"]')
            } catch (err) {}
            if ($elem && $elem.length) {
                instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];
                if (instance && instance.settings.hashTracking) {
                    instance.open()
                }
            }
        }
    }
    function Remodal($modal, options) {
        var $body = $(document.body);
        var $appendTo = $body;
        var remodal = this;
        remodal.settings = $.extend({}, DEFAULTS, options);
        remodal.index = $[PLUGIN_NAME].lookup.push(remodal) - 1;
        remodal.state = STATES.CLOSED;
        remodal.$overlay = $("." + namespacify("overlay"));
        if (remodal.settings.appendTo !== null && remodal.settings.appendTo.length) {
            $appendTo = $(remodal.settings.appendTo)
        }
        if (!remodal.$overlay.length) {
            remodal.$overlay = $("<div>").addClass(namespacify("overlay") + " " + namespacify("is", STATES.CLOSED)).hide();
            $appendTo.append(remodal.$overlay)
        }
        remodal.$bg = $("." + namespacify("bg")).addClass(namespacify("is", STATES.CLOSED));
        remodal.$modal = $modal.addClass(NAMESPACE + " " + namespacify("is-initialized") + " " + remodal.settings.modifier + " " + namespacify("is", STATES.CLOSED)).attr("tabindex", "-1");
        remodal.$wrapper = $("<div>").addClass(namespacify("wrapper") + " " + remodal.settings.modifier + " " + namespacify("is", STATES.CLOSED)).hide().append(remodal.$modal);
        $appendTo.append(remodal.$wrapper);
        remodal.$wrapper.on("click." + NAMESPACE, "[data-" + PLUGIN_NAME + '-action="close"]', function(e) {
            e.preventDefault();
            remodal.close()
        });
        remodal.$wrapper.on("click." + NAMESPACE, "[data-" + PLUGIN_NAME + '-action="cancel"]', function(e) {
            e.preventDefault();
            remodal.$modal.trigger(STATE_CHANGE_REASONS.CANCELLATION);
            if (remodal.settings.closeOnCancel) {
                remodal.close(STATE_CHANGE_REASONS.CANCELLATION)
            }
        });
        remodal.$wrapper.on("click." + NAMESPACE, "[data-" + PLUGIN_NAME + '-action="confirm"]', function(e) {
            e.preventDefault();
            remodal.$modal.trigger(STATE_CHANGE_REASONS.CONFIRMATION);
            if (remodal.settings.closeOnConfirm) {
                remodal.close(STATE_CHANGE_REASONS.CONFIRMATION)
            }
        });
        remodal.$wrapper.on("click." + NAMESPACE, function(e) {
            var $target = $(e.target);
            if (!$target.hasClass(namespacify("wrapper"))) {
                return
            }
            if (remodal.settings.closeOnOutsideClick) {
                remodal.close()
            }
        })
    }
    Remodal.prototype.open = function() {
        var remodal = this;
        var id;
        if (remodal.state === STATES.OPENING || remodal.state === STATES.CLOSING) {
            return
        }
        id = remodal.$modal.attr("data-" + PLUGIN_NAME + "-id");
        if (id && remodal.settings.hashTracking) {
            scrollTop = $(window).scrollTop();
            location.hash = id
        }
        if (current && current !== remodal) {
            halt(current)
        }
        current = remodal;
        lockScreen();
        remodal.$bg.addClass(remodal.settings.modifier);
        remodal.$overlay.addClass(remodal.settings.modifier).show();
        remodal.$wrapper.show().scrollTop(0);
        remodal.$modal.focus();
        syncWithAnimation(function() {
            setState(remodal, STATES.OPENING)
        }, function() {
            setState(remodal, STATES.OPENED)
        }, remodal)
    }
    ;
    Remodal.prototype.close = function(reason) {
        var remodal = this;
        if (remodal.state === STATES.OPENING || remodal.state === STATES.CLOSING || remodal.state === STATES.CLOSED) {
            return
        }
        if (remodal.settings.hashTracking && remodal.$modal.attr("data-" + PLUGIN_NAME + "-id") === location.hash.substr(1)) {
            location.hash = "";
            $(window).scrollTop(scrollTop)
        }
        syncWithAnimation(function() {
            setState(remodal, STATES.CLOSING, false, reason)
        }, function() {
            remodal.$bg.removeClass(remodal.settings.modifier);
            remodal.$overlay.removeClass(remodal.settings.modifier).hide();
            remodal.$wrapper.hide();
            unlockScreen();
            setState(remodal, STATES.CLOSED, false, reason)
        }, remodal)
    }
    ;
    Remodal.prototype.getState = function() {
        return this.state
    }
    ;
    Remodal.prototype.destroy = function() {
        var lookup = $[PLUGIN_NAME].lookup;
        var instanceCount;
        halt(this);
        this.$wrapper.remove();
        delete lookup[this.index];
        instanceCount = $.grep(lookup, function(instance) {
            return !!instance
        }).length;
        if (instanceCount === 0) {
            this.$overlay.remove();
            this.$bg.removeClass(namespacify("is", STATES.CLOSING) + " " + namespacify("is", STATES.OPENING) + " " + namespacify("is", STATES.CLOSED) + " " + namespacify("is", STATES.OPENED))
        }
    }
    ;
    $[PLUGIN_NAME] = {
        lookup: []
    };
    $.fn[PLUGIN_NAME] = function(opts) {
        var instance;
        var $elem;
        this.each(function(index, elem) {
            $elem = $(elem);
            if ($elem.data(PLUGIN_NAME) == null) {
                instance = new Remodal($elem,opts);
                $elem.data(PLUGIN_NAME, instance.index);
                if (instance.settings.hashTracking && $elem.attr("data-" + PLUGIN_NAME + "-id") === location.hash.substr(1)) {
                    instance.open()
                }
            } else {
                instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)]
            }
        });
        return instance
    }
    ;
    $(document).ready(function() {
        $(document).on("click", "[data-" + PLUGIN_NAME + "-target]", function(e) {
            e.preventDefault();
            var elem = e.currentTarget;
            var id = elem.getAttribute("data-" + PLUGIN_NAME + "-target");
            var $target = $("[data-" + PLUGIN_NAME + '-id="' + id + '"]');
            $[PLUGIN_NAME].lookup[$target.data(PLUGIN_NAME)].open()
        });
        $(document).find("." + NAMESPACE).each(function(i, container) {
            var $container = $(container);
            var options = $container.data(PLUGIN_NAME + "-options");
            if (!options) {
                options = {}
            } else if (typeof options === "string" || options instanceof String) {
                options = parseOptions(options)
            }
            $container[PLUGIN_NAME](options)
        });
        $(document).on("keydown." + NAMESPACE, function(e) {
            if (current && current.settings.closeOnEscape && current.state === STATES.OPENED && e.keyCode === 27) {
                current.close()
            }
        });
        $(window).on("hashchange." + NAMESPACE, handleHashChangeEvent)
        
    })
});
(function(factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory)
    } else {
        if (typeof module === "object" && module.exports) {
            module.exports = factory(require("jquery"))
        } else {
            factory(window.jQuery)
        }
    }
}
)(function($) {
    "use strict";
    $.fn.ratingLocales = {};
    var NAMESPACE, DEFAULT_MIN, DEFAULT_MAX, DEFAULT_STEP, isEmpty, getCss, addCss, getDecimalPlaces, applyPrecision, handler, Rating;
    NAMESPACE = ".rating";
    DEFAULT_MIN = 0;
    DEFAULT_MAX = 5;
    DEFAULT_STEP = .5;
    isEmpty = function(value, trim) {
        return value === null || value === undefined || value.length === 0 || trim && $.trim(value) === ""
    }
    ;
    getCss = function(condition, css) {
        return condition ? " " + css : ""
    }
    ;
    addCss = function($el, css) {
        $el.removeClass(css).addClass(css)
    }
    ;
    getDecimalPlaces = function(num) {
        var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0))
    }
    ;
    applyPrecision = function(val, precision) {
        return parseFloat(val.toFixed(precision))
    }
    ;
    handler = function($el, event, callback, skipNS) {
        var ev = skipNS ? event : event.split(" ").join(NAMESPACE + " ") + NAMESPACE;
        $el.off(ev).on(ev, callback)
    }
    ;
    Rating = function(element, options) {
        var self = this;
        self.$element = $(element);
        self._init(options)
    }
    ;
    Rating.prototype = {
        constructor: Rating,
        _parseAttr: function(vattr, options) {
            var self = this, $el = self.$element, elType = $el.attr("type"), finalVal, val, chk, out;
            if (elType === "range" || elType === "number") {
                val = options[vattr] || $el.data(vattr) || $el.attr(vattr);
                switch (vattr) {
                case "min":
                    chk = DEFAULT_MIN;
                    break;
                case "max":
                    chk = DEFAULT_MAX;
                    break;
                default:
                    chk = DEFAULT_STEP
                }
                finalVal = isEmpty(val) ? chk : val;
                out = parseFloat(finalVal)
            } else {
                out = parseFloat(options[vattr])
            }
            return isNaN(out) ? chk : out
        },
        _setDefault: function(key, val) {
            var self = this;
            if (isEmpty(self[key])) {
                self[key] = val
            }
        },
        _listenClick: function(e, callback) {
            e.stopPropagation();
            e.preventDefault();
            if (e.handled !== true) {
                callback(e);
                e.handled = true
            } else {
                return false
            }
        },
        _starClick: function(e) {
            var self = this, pos;
            self._listenClick(e, function(ev) {
                if (self.inactive) {
                    return false
                }
                pos = self._getTouchPosition(ev);
                self._setStars(pos);
                self.$element.trigger("change").trigger("rating.change", [self.$element.val(), self._getCaption()]);
                self.starClicked = true
            })
        },
        _starMouseMove: function(e) {
            var self = this, pos, out;
            if (!self.hoverEnabled || self.inactive || e && e.isDefaultPrevented()) {
                return
            }
            self.starClicked = false;
            pos = self._getTouchPosition(e);
            out = self.calculate(pos);
            self._toggleHover(out);
            self.$element.trigger("rating.hover", [out.val, out.caption, "stars"])
        },
        _starMouseLeave: function(e) {
            var self = this, out;
            if (!self.hoverEnabled || self.inactive || self.starClicked || e && e.isDefaultPrevented()) {
                return
            }
            out = self.cache;
            self._toggleHover(out);
            self.$element.trigger("rating.hoverleave", ["stars"])
        },
        _clearClick: function(e) {
            var self = this;
            self._listenClick(e, function() {
                if (!self.inactive) {
                    self.clear();
                    self.clearClicked = true
                }
            })
        },
        _clearMouseMove: function(e) {
            var self = this, caption, val, width, out;
            if (!self.hoverEnabled || self.inactive || !self.hoverOnClear || e && e.isDefaultPrevented()) {
                return
            }
            self.clearClicked = false;
            caption = '<span class="' + self.clearCaptionClass + '">' + self.clearCaption + "</span>";
            val = self.clearValue;
            width = self.getWidthFromValue(val) || 0;
            out = {
                caption: caption,
                width: width,
                val: val
            };
            self._toggleHover(out);
            self.$element.trigger("rating.hover", [val, caption, "clear"])
        },
        _clearMouseLeave: function(e) {
            var self = this, out;
            if (!self.hoverEnabled || self.inactive || self.clearClicked || !self.hoverOnClear || e && e.isDefaultPrevented()) {
                return
            }
            out = self.cache;
            self._toggleHover(out);
            self.$element.trigger("rating.hoverleave", ["clear"])
        },
        _resetForm: function(e) {
            var self = this;
            if (e && e.isDefaultPrevented()) {
                return
            }
            if (!self.inactive) {
                self.reset()
            }
        },
        _setTouch: function(e, flag) {
            var self = this, ev, touches, pos, out, caption, w, width, isTouchCapable = "ontouchstart"in window || window.DocumentTouch && document instanceof window.DocumentTouch;
            if (!isTouchCapable || self.inactive) {
                return
            }
            ev = e.originalEvent;
            touches = !isEmpty(ev.touches) ? ev.touches : ev.changedTouches;
            pos = self._getTouchPosition(touches[0]);
            if (flag) {
                self._setStars(pos);
                self.$element.trigger("change").trigger("rating.change", [self.$element.val(), self._getCaption()]);
                self.starClicked = true
            } else {
                out = self.calculate(pos);
                caption = out.val <= self.clearValue ? self.fetchCaption(self.clearValue) : out.caption;
                w = self.getWidthFromValue(self.clearValue);
                width = out.val <= self.clearValue ? w + "%" : out.width;
                self._setCaption(caption);
                self.$filledStars.css("width", width)
            }
        },
        _initTouch: function(e) {
            var self = this
              , flag = e.type === "touchend";
            self._setTouch(e, flag)
        },
        _initSlider: function(options) {
            var self = this;
            if (isEmpty(self.$element.val())) {
                self.$element.val(0)
            }
            self.initialValue = self.$element.val();
            self._setDefault("min", self._parseAttr("min", options));
            self._setDefault("max", self._parseAttr("max", options));
            self._setDefault("step", self._parseAttr("step", options));
            if (isNaN(self.min) || isEmpty(self.min)) {
                self.min = DEFAULT_MIN
            }
            if (isNaN(self.max) || isEmpty(self.max)) {
                self.max = DEFAULT_MAX
            }
            if (isNaN(self.step) || isEmpty(self.step) || self.step === 0) {
                self.step = DEFAULT_STEP
            }
            self.diff = self.max - self.min
        },
        _initHighlight: function(v) {
            var self = this, w, cap = self._getCaption();
            if (!v) {
                v = self.$element.val()
            }
            w = self.getWidthFromValue(v) + "%";
            self.$filledStars.width(w);
            self.cache = {
                caption: cap,
                width: w,
                val: v
            }
        },
        _getContainerCss: function() {
            var self = this;
            return "rating-container" + getCss(self.theme, "theme-" + self.theme) + getCss(self.rtl, "rating-rtl") + getCss(self.size, "rating-" + self.size) + getCss(self.animate, "rating-animate") + getCss(self.disabled || self.readonly, "rating-disabled") + getCss(self.containerClass, self.containerClass)
        },
        _checkDisabled: function() {
            var self = this
              , $el = self.$element
              , opts = self.options;
            self.disabled = opts.disabled === undefined ? $el.attr("disabled") || false : opts.disabled;
            self.readonly = opts.readonly === undefined ? $el.attr("readonly") || false : opts.readonly;
            self.inactive = self.disabled || self.readonly;
            $el.attr({
                disabled: self.disabled,
                readonly: self.readonly
            })
        },
        _addContent: function(type, content) {
            var self = this
              , $container = self.$container
              , isClear = type === "clear";
            if (self.rtl) {
                return isClear ? $container.append(content) : $container.prepend(content)
            } else {
                return isClear ? $container.prepend(content) : $container.append(content)
            }
        },
        _generateRating: function() {
            var self = this, $el = self.$element, $rating, $container, w;
            $container = self.$container = $(document.createElement("div")).insertBefore($el);
            addCss($container, self._getContainerCss());
            self.$rating = $rating = $(document.createElement("div")).attr("class", "rating").appendTo($container).append(self._getStars("empty")).append(self._getStars("filled"));
            self.$emptyStars = $rating.find(".empty-stars");
            self.$filledStars = $rating.find(".filled-stars");
            self._renderCaption();
            self._renderClear();
            self._initHighlight();
            $container.append($el);
            if (self.rtl) {
                w = Math.max(self.$emptyStars.outerWidth(), self.$filledStars.outerWidth());
                self.$emptyStars.width(w)
            }
        },
        _getCaption: function() {
            var self = this;
            return self.$caption && self.$caption.length ? self.$caption.html() : self.defaultCaption
        },
        _setCaption: function(content) {
            var self = this;
            if (self.$caption && self.$caption.length) {
                self.$caption.html(content)
            }
        },
        _renderCaption: function() {
            var self = this, val = self.$element.val(), html, $cap = self.captionElement ? $(self.captionElement) : "";
            if (!self.showCaption) {
                return
            }
            html = self.fetchCaption(val);
            if ($cap && $cap.length) {
                addCss($cap, "caption");
                $cap.html(html);
                self.$caption = $cap;
                return
            }
            self._addContent("caption", '<div class="caption">' + html + "</div>");
            self.$caption = self.$container.find(".caption")
        },
        _renderClear: function() {
            var self = this, css, $clr = self.clearElement ? $(self.clearElement) : "";
            if (!self.showClear) {
                return
            }
            css = self._getClearClass();
            if ($clr.length) {
                addCss($clr, css);
                $clr.attr({
                    title: self.clearButtonTitle
                }).html(self.clearButton);
                self.$clear = $clr;
                return
            }
            self._addContent("clear", '<div class="' + css + '" title="' + self.clearButtonTitle + '">' + self.clearButton + "</div>");
            self.$clear = self.$container.find("." + self.clearButtonBaseClass)
        },
        _getClearClass: function() {
            return this.clearButtonBaseClass + " " + (this.inactive ? "" : this.clearButtonActiveClass)
        },
        _getTouchPosition: function(e) {
            var pageX = isEmpty(e.pageX) ? e.originalEvent.touches[0].pageX : e.pageX;
            return pageX - this.$rating.offset().left
        },
        _toggleHover: function(out) {
            var self = this, w, width, caption;
            if (!out) {
                return
            }
            if (self.hoverChangeStars) {
                w = self.getWidthFromValue(self.clearValue);
                width = out.val <= self.clearValue ? w + "%" : out.width;
                self.$filledStars.css("width", width)
            }
            if (self.hoverChangeCaption) {
                caption = out.val <= self.clearValue ? self.fetchCaption(self.clearValue) : out.caption;
                if (caption) {
                    self._setCaption(caption + "")
                }
            }
        },
        _init: function(options) {
            var self = this
              , $el = self.$element.addClass("hide");
            self.options = options;
            $.each(options, function(key, value) {
                self[key] = value
            });
            if (self.rtl || $el.attr("dir") === "rtl") {
                self.rtl = true;
                $el.attr("dir", "rtl")
            }
            self.starClicked = false;
            self.clearClicked = false;
            self._initSlider(options);
            self._checkDisabled();
            if (self.displayOnly) {
                self.inactive = true;
                self.showClear = false;
                self.showCaption = false
            }
            self._generateRating();
            self._listen();
            return $el.removeClass("rating-loading")
        },
        _listen: function() {
            var self = this
              , $el = self.$element
              , $form = $el.closest("form")
              , $rating = self.$rating
              , $clear = self.$clear;
            handler($rating, "touchstart touchmove touchend", $.proxy(self._initTouch, self));
            handler($rating, "click touchstart", $.proxy(self._starClick, self));
            handler($rating, "mousemove", $.proxy(self._starMouseMove, self));
            handler($rating, "mouseleave", $.proxy(self._starMouseLeave, self));
            if (self.showClear && $clear.length) {
                handler($clear, "click touchstart", $.proxy(self._clearClick, self));
                handler($clear, "mousemove", $.proxy(self._clearMouseMove, self));
                handler($clear, "mouseleave", $.proxy(self._clearMouseLeave, self))
            }
            if ($form.length) {
                handler($form, "reset", $.proxy(self._resetForm, self))
            }
            return $el
        },
        _getStars: function(type) {
            var self = this, stars = '<span class="' + type + '-stars">', i;
            for (i = 1; i <= self.stars; i++) {
                stars += '<span class="star">' + self[type + "Star"] + "</span>"
            }
            return stars + "</span>"
        },
        _setStars: function(pos) {
            var self = this
              , out = arguments.length ? self.calculate(pos) : self.calculate()
              , $el = self.$element;
            $el.val(out.val);
            self.$filledStars.css("width", out.width);
            self._setCaption(out.caption);
            self.cache = out;
            return $el
        },
        showStars: function(val) {
            var self = this
              , v = parseFloat(val);
            self.$element.val(isNaN(v) ? self.clearValue : v);
            return self._setStars()
        },
        calculate: function(pos) {
            var self = this
              , defaultVal = isEmpty(self.$element.val()) ? 0 : self.$element.val()
              , val = arguments.length ? self.getValueFromPosition(pos) : defaultVal
              , caption = self.fetchCaption(val)
              , width = self.getWidthFromValue(val);
            width += "%";
            return {
                caption: caption,
                width: width,
                val: val
            }
        },
        getValueFromPosition: function(pos) {
            var self = this, precision = getDecimalPlaces(self.step), val, factor, maxWidth = self.$rating.width();
            factor = self.diff * pos / (maxWidth * self.step);
            factor = self.rtl ? Math.floor(factor) : Math.ceil(factor);
            val = applyPrecision(parseFloat(self.min + factor * self.step), precision);
            val = Math.max(Math.min(val, self.max), self.min);
            return self.rtl ? self.max - val : val
        },
        getWidthFromValue: function(val) {
            var self = this, min = self.min, max = self.max, factor, $r = self.$emptyStars, w;
            if (!val || val <= min || min === max) {
                return 0
            }
            w = $r.outerWidth();
            factor = w ? $r.width() / w : 1;
            if (val >= max) {
                return 100
            }
            return (val - min) * factor * 100 / (max - min)
        },
        fetchCaption: function(rating) {
            var self = this, val = parseFloat(rating) || self.clearValue, css, cap, capVal, cssVal, caption, vCap = self.starCaptions, vCss = self.starCaptionClasses;
            if (val && val !== self.clearValue) {
                val = applyPrecision(val, getDecimalPlaces(self.step))
            }
            cssVal = typeof vCss === "function" ? vCss(val) : vCss[val];
            capVal = typeof vCap === "function" ? vCap(val) : vCap[val];
            cap = isEmpty(capVal) ? self.defaultCaption.replace(/\{rating}/g, val) : capVal;
            css = isEmpty(cssVal) ? self.clearCaptionClass : cssVal;
            caption = val === self.clearValue ? self.clearCaption : cap;
            return '<span class="' + css + '">' + caption + "</span>"
        },
        destroy: function() {
            var self = this
              , $el = self.$element;
            if (!isEmpty(self.$container)) {
                self.$container.before($el).remove()
            }
            $.removeData($el.get(0));
            return $el.off("rating").removeClass("hide")
        },
        create: function(options) {
            var self = this
              , opts = options || self.options || {};
            return self.destroy().rating(opts)
        },
        clear: function() {
            var self = this
              , title = '<span class="' + self.clearCaptionClass + '">' + self.clearCaption + "</span>";
            if (!self.inactive) {
                self._setCaption(title)
            }
            return self.showStars(self.clearValue).trigger("change").trigger("rating.clear")
        },
        reset: function() {
            var self = this;
            return self.showStars(self.initialValue).trigger("rating.reset")
        },
        update: function(val) {
            var self = this;
            return arguments.length ? self.showStars(val) : self.$element
        },
        refresh: function(options) {
            var self = this
              , $el = self.$element;
            if (!options) {
                return $el
            }
            return self.destroy().rating($.extend(true, self.options, options)).trigger("rating.refresh")
        }
    };
    $.fn.rating = function(option) {
        var args = Array.apply(null, arguments)
          , retvals = [];
        args.shift();
        this.each(function() {
            var self = $(this), data = self.data("rating"), options = typeof option === "object" && option, lang = options.language || self.data("language") || "en", loc = {}, opts;
            if (!data) {
                if (lang !== "en" && !isEmpty($.fn.ratingLocales[lang])) {
                    loc = $.fn.ratingLocales[lang]
                }
                opts = $.extend(true, {}, $.fn.rating.defaults, $.fn.ratingLocales.en, loc, options, self.data());
                data = new Rating(this,opts);
                self.data("rating", data)
            }
            if (typeof option === "string") {
                retvals.push(data[option].apply(data, args))
            }
        });
        switch (retvals.length) {
        case 0:
            return this;
        case 1:
            return retvals[0] === undefined ? this : retvals[0];
        default:
            return retvals
        }
    }
    ;
    $.fn.rating.defaults = {
        theme: "",
        language: "en",
        stars: 5,
        filledStar: '<i class="glyphicon glyphicon-star"></i>',
        emptyStar: '<i class="glyphicon glyphicon-star-empty"></i>',
        containerClass: "",
        size: "md",
        animate: true,
        displayOnly: false,
        rtl: false,
        showClear: true,
        showCaption: true,
        starCaptionClasses: {
            .5: "label label-danger",
            1: "label label-danger",
            1.5: "label label-warning",
            2: "label label-warning",
            2.5: "label label-info",
            3: "label label-info",
            3.5: "label label-primary",
            4: "label label-primary",
            4.5: "label label-success",
            5: "label label-success"
        },
        clearButton: '<i class="glyphicon glyphicon-minus-sign"></i>',
        clearButtonBaseClass: "clear-rating",
        clearButtonActiveClass: "clear-rating-active",
        clearCaptionClass: "label label-default",
        clearValue: null,
        captionElement: null,
        clearElement: null,
        hoverEnabled: true,
        hoverChangeCaption: true,
        hoverChangeStars: true,
        hoverOnClear: true
    };
    $.fn.ratingLocales.en = {
        defaultCaption: "{rating} Stars",
        starCaptions: {
            .5: "Half Star",
            1: "One Star",
            1.5: "One & Half Star",
            2: "Two Stars",
            2.5: "Two & Half Stars",
            3: "Three Stars",
            3.5: "Three & Half Stars",
            4: "Four Stars",
            4.5: "Four & Half Stars",
            5: "Five Stars"
        },
        clearButtonTitle: "Clear",
        clearCaption: "Not Rated"
    };
    $.fn.rating.Constructor = Rating;
    $(document).ready(function() {
        var $input = $("input.rating");
        if ($input.length) {
            $input.removeClass("rating-loading").addClass("rating-loading").rating()
        }
    })
});
$raiz = "";
var galleryTop;
var rotarForm;
var sedes;
if (window.location.href.indexOf("app_dev.php") > -1) {
    $raiz = "/app_dev.php"
}
$(function() {
    newsletter();
    header();
    banners();
    link_home();
    otros_Serv();
    producto();
    itemHover();
    link_full();
    video_l();
    sucursales();
    inspiracion();
    anonimo();
    documento();
    direcciones();
    ciudades();
    if (isMobile) {
        $("#v_menu").click(function() {
            $(".header ul, .header .opciones").slideToggle("slow", function() {})
        });
        $(".sucursal .filter h5").click(function() {
            if ($(this).next("ul").css("display") != "block") {
                var clicked = $(this).next("ul");
                var index = $(this).next("ul").index();
                console.log(index);
                $(this).next("ul").slideToggle("slow", function() {});
                $(".filter ul").each(function() {
                    if ($(this).css("display") == "block" && $(this).index() != index)
                        $(this).slideToggle("slow", function() {})
                })
            } else {
                $(".filter ul").each(function() {
                    if ($(this).css("display") == "block")
                        $(this).slideToggle("slow", function() {})
                })
            }
        });
        fixFilter();
        filter()
    }
    prensa();
    $("#moneda").tooltipster({
        interactive: true
    });
    moneda()
});
function documento() {
    $("#factura_tipodocumento").change(function() {
        var tipo = $("#factura_tipodocumento").val();
        if (tipo == 3) {
            $("#factura_documento").val($("#factura_documento").val().substr(0, 9))
        }
    });
    $("#factura_documento").on("input", function(event) {
        var tipo = $("#factura_tipodocumento").val();
        this.value = this.value.replace(/\W+/g, " ");
        console.log(tipo);
        if (tipo == 3) {
            this.value = this.value.substr(0, 9)
        }
    })
}
function anonimo() {
    $("#anonimo").click(function() {
        var checked = $(this).prop("checked");
        console.log(checked);
        if (checked) {
            $("#dedicatoria_de").val("Anonimo");
            $("#dedicatoria_de").attr("type", "hidden")
        } else {
            $("#dedicatoria_de").attr("type", "text");
            if ($("#dedicatoria_de").val() == "Anonimo") {
                $("#dedicatoria_de").val("")
            }
        }
    })
}
function moneda() {
    $(".monedas input").click(function(e) {
        console.log("monedas");
        var item = $(this).parent().attr("data-moneda");
        console.log(item);
        $("#moneda").find("span").html(item);
        e.stopPropagation();
        $.ajax({
            url: $raiz + "/set-moneda/" + item
        }).done(function(data) {
            window.location.reload()
        }).fail(function() {}).always(function() {})
    })
}
$(document).ready(function() {});
$(window).resize(function() {
    header()
});
$(window).on("load", function() {
    fixHeightProds()
});
$(window).scroll(function() {
    fixFilter()
});
function isMobile() {
    return /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function isIpad() {
    return navigator.userAgent.match(/iPad/i)
}
function prensa() {
    $(".articulos .rotador a").click(function() {
        var titulo = $(this).attr("data-titulo");
        var resumen = $(this).attr("data-resumen");
        var imagen = $(this).attr("data-imagenEn");
        $(".the_blog .txt h2").html(titulo);
        $(".the_blog .txt .resumen").html(resumen);
        $(".the_blog .txt .big_img").attr("src", imagen)
    });
    $(".articulos .rotador a:first-child").on("click", function() {});
    $(".articulos .rotador a:first-child").trigger("click")
}
function filter() {
    if (isMobile()) {
        $("#v_filtro").click(function() {
            var icoV = $(this);
            var filter = $(".filter");
            var dataVisible = icoV.attr("data-visible");
            if (dataVisible == 0) {
                TweenMax.to(filter, .5, {
                    left: "0",
                    backgroundColor: "rgba(1, 24, 52, 1)"
                });
                TweenMax.to(icoV, 1, {
                    left: "0"
                });
                $(this).attr("data-visible", 1);
                icoV.find("i").addClass("fa-times")
            } else {
                TweenMax.to(filter, .7, {
                    left: "-100%",
                    backgroundColor: "rgba(250, 250, 250, 0.5)"
                });
                TweenMax.to(icoV, .5, {
                    left: "100%"
                });
                $(this).attr("data-visible", 0);
                icoV.find("i").removeClass("fa-times")
            }
        })
    }
}
function fixFilter() {
    scrollPosition = $(window).scrollTop();
    if (isMobile()) {
        if (scrollPosition >= 400) {
            $("#filtro").css({
                position: "fixed"
            })
        } else {
            $("#filtro").css({
                position: "absolute"
            })
        }
    } else {
        if (scrollPosition >= 200) {
            $(".header .social").css("top", 105).css({
                position: "fixed"
            })
        } else {
            $(".header .social").css("top", 205).css({
                position: "absolute"
            })
        }
        if (scrollPosition >= 100) {
            $(".header").addClass("fijo")
        } else {
            $(".header").removeClass("fijo")
        }
    }
}
function link_full() {
    $(".link_full .boton").click(function() {
        var txt = $(this).parent().find(".txt");
        var hover = $(this).parent();
        var dataEstado = $(this).attr("data-estado");
        if (dataEstado == 0) {
            txt.slideDown("slow");
            TweenMax.to(hover, 1, {
                backgroundColor: "rgba(1, 24, 52, 0.8)"
            });
            $(this).attr("data-estado", 1)
        } else {
            txt.slideUp("slow");
            TweenMax.to(hover, 1, {
                backgroundColor: "rgba(1, 24, 52, 0.2)"
            });
            $(this).attr("data-estado", 0)
        }
    })
}
function itemHover() {
    var item = $(".itemHover");
    $(item).hover(function() {
        var ihover = $(this).find(".hover");
        TweenMax.to(ihover, .5, {
            opacity: 1
        })
    }, function() {
        var ihover = $(this).find(".hover");
        TweenMax.to(ihover, .5, {
            opacity: 0
        })
    })
}
function producto() {
    $("#shareButtonLabel").jsSocials({
        showCount: false,
        showLabel: false,
        shares: ["twitter", "facebook", "email"]
    });
    $("#input-id").rating({
        min: 0,
        max: 10,
        step: 1,
        emptyStar: '<i class="fa fa-star-o" aria-hidden="true"></i>',
        filledStar: '<i class="fa fa-star" aria-hidden="true"></i>',
        rtl: false,
        showCaption: false,
        size: "xs"
    }).on("rating.change", function(event, value, caption) {
        $.LoadingOverlay("show", {
            zIndex: 9999,
            image: "/js/jquery-loading-overlay/src/loading.gif"
        });
        console.log("You rated: " + value);
        var id = $("#id_prod").val();
        $.ajax({
            url: $raiz + "/calificar/" + value + "/" + id
        }).done(function(data) {}).fail(function() {
            $.LoadingOverlay("hide")
        }).always(function() {
            $.LoadingOverlay("hide")
        })
    })
}
var scrollPosition = 0;
function reduceMenu() {
    var menu = $(".header ul");
    scrollPosition = $(window).scrollTop();
    if (!isMobile() && scrollPosition > 1) {
        TweenMax.to(menu, .5, {
            marginTop: "-50px"
        })
    } else {
        TweenMax.to(menu, .2, {
            marginTop: "30px"
        })
    }
}
var l_video = 0;
function video_l() {
    $(".video_l a").click(function() {
        l_video = $(this).attr("data-video");
        $(".video_viewer iframe").attr("src", l_video)
    });
    $(document).on("opened", ".video_viewer", function() {
        $(".video_viewer iframe").attr("src", l_video)
    });
    $(document).on("closing", ".video_viewer", function(e) {
        $("#popup-youtube-player")[0].contentWindow.postMessage('{"event":"command","func":"' + "stopVideo" + '","args":""}', "*")
    })
}
function header() {
    var headerH = $(".header").height();
    var bannerH = $(".banner").height();
    var noHeaderH = bannerH - headerH;
    $(".no_header").each(function() {
        $(this).height(noHeaderH)
    })
}
function link_home() {
    var item = $(".links .item");
    item.mouseenter(function() {
        TweenMax.to($(this).find(".hover img"), 1, {
            marginTop: "10%"
        });
        TweenMax.to($(this).find(".hover p"), .5, {
            opacity: 1
        });
        TweenMax.to($(this).find(".hover"), .5, {
            backgroundColor: "rgba(1, 24, 52, 0.8)"
        })
    });
    item.mouseleave(function() {
        TweenMax.to($(this).find(".hover img"), .5, {
            marginTop: "18%"
        });
        TweenMax.to($(this).find(".hover p"), .3, {
            opacity: 0
        });
        TweenMax.to($(this).find(".hover"), .3, {
            backgroundColor: "rgba(1, 24, 52, 0.2)"
        })
    })
}
function otros_Serv() {
    var item = $(".otros_servicios .item");
    item.mouseenter(function() {
        TweenMax.to($(this).find(".hover p"), .5, {
            opacity: 1
        });
        TweenMax.to($(this).find(".hover"), .5, {
            backgroundColor: "rgba(1, 24, 52, 0.7)"
        })
    });
    item.mouseleave(function() {
        TweenMax.to($(this).find(".hover p"), .3, {
            opacity: 0
        });
        TweenMax.to($(this).find(".hover"), .3, {
            backgroundColor: "rgba(1, 24, 52, 0)"
        })
    })
}
function banners() {
    var Home = new Swiper(".sliderHome",{
        pagination: ".swiper-pagination",
        paginationClickable: true,
        autoplay: 6e3
    });
    var videosHome = new Swiper(".banner_videos .root",{
        paginationClickable: true,
        nextButton: ".banner_videos .next",
        prevButton: ".banner_videos .prev",
        spaceBetween: 30,
        slidesPerView: 4,
        breakpoints: {
            767: {
                slidesPerView: 1,
                spaceBetween: 30
            }
        }
    });
    var complementsProduct = new Swiper(".banner_complementos .root",{
        paginationClickable: true,
        nextButton: ".banner_complementos .next",
        prevButton: ".banner_complementos .prev",
        spaceBetween: 0,
        slidesPerView: 2,
        breakpoints: {
            767: {
                slidesPerView: 1,
                spaceBetween: 0
            }
        }
    });
    sedes = new Swiper(".sede",{
        paginationClickable: true,
        spaceBetween: 10
    });
    rotarForm = new Swiper(".carrito .rotar",{
        paginationClickable: true,
        effect: "flip",
        simulateTouch: false
    });
    $(".opcion label:first-child input").attr("checked", "checked");
    $(".carrito .opcion label").click(function(e) {
        var pos = $(this).data("pos");
        if ($.isNumeric(pos))
            rotarForm.slideTo(pos - 1)
    });
    var pasos_hacer = new Swiper(".rota_pasos",{
        nextButton: ".rota_pasos .next",
        prevButton: ".rota_pasos .prev",
        pagination: ".rota_pasos .pagination",
        paginationType: "fraction"
    });
    var articulos = new Swiper(".articulos .rotador",{
        nextButton: ".articulos .next",
        prevButton: ".articulos .prev",
        slidesPerView: 5,
        spaceBetween: 10,
        breakpoints: {
            767: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    })
}
function FontSize() {
    if (!isMobile()) {
        $(".menu li a").flowtype({
            fontRatio: 7,
            maxFont: 24
        })
    }
}
var form_news;
function newsletter() {
    $("#form_newsletter").submit(function(e) {
        $.LoadingOverlay("show", {
            zIndex: 9999,
            image: "/js/jquery-loading-overlay/src/loading.gif"
        });
        e.preventDefault();
        $("#terms_error,#news_email_error").hide();
        $acepto = $("#acepta").prop("checked");
        if ($acepto) {
            if (validateEmail($(this).find('input[type="email"]').val())) {
                data = $(this).serialize();
                $.ajax({
                    url: $raiz + "/newsletter/" + $(this).find('input[type="email"]').val()
                }).done(function(data) {
                    $.LoadingOverlay("hide");
                    $("#exitoso").remove();
                    if (data.success == 1 || data.success == "1") {
                        $("#form_newsletter").prepend('<p id="exitoso">Inscrito exitosamente</p>');
                        $("#form_newsletter").find('input[type="email"]').val("")
                    } else {
                        $("#form_newsletter").prepend('<p id="exitoso" class="error">Email inscrito anteriormente</p>')
                    }
                })
            } else {
                $.LoadingOverlay("hide");
                $("#news_email_error").css("display", "inline-block")
            }
        } else {
            $.LoadingOverlay("hide");
            $("#terms_error").css("display", "inline-block")
        }
    })
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}
function sucursales() {
    $(".sede_t").click(function() {
        var id = $(this).data("id");
        var sede_rot = $("#sede_" + id);
        var pos = sede_rot.index();
        console.log("listado " + pos);
        map.setCenter(markers[id].getPosition());
        sedes.slideTo(pos)
    })
}
function inspiracion() {
    $("#tipo_inspiracion").change(function() {
        var val = $(this).val();
        console.log(val);
        if ($.isNumeric(val)) {
            $(".resumen_mensaje").hide();
            $(".tipo_" + val).show()
        } else {
            $(".resumen_mensaje").show()
        }
    });
    $(".select_inspiracion").click(function() {
        var val = $(this).data("id");
        console.log(val);
        $("#dedicatoria_mensaje").val(" ");
        $("#dedicatoria_mensaje").val($("#dedicatoria_" + val).text());
        $(".opcion label:first-child").click()
    })
}
function fixHeightProds() {
    var h = 0;
    $(".productos .item").each(function() {
        h = Math.max(h, $(this).height())
    });
    $(".productos .item").height(h)
}
function direcciones() {
    var campos = ["nombre", "apellidos", "ciudad", "direccion", "oficina", "telefono", "adicionales"];
    $("#direcciones").change(function() {
        var opcion = $("#direcciones").find(":selected");
        for (var i = 0; i <= campos.length; i++) {
            campo = campos[i];
            valor = opcion.data(campo);
            if (campo == "oficina") {
                if (valor == "Si")
                    valor = 1;
                if (valor == "No")
                    valor = 2
            }
            $("#envio_" + campo).val(valor);
            console.log(valor)
        }
    })
}
function showBuscador() {
    $("#buscador_header").toggle()
}
var modal_cambiar, modal_seleccionar;
function ciudades() {
    $("#b_cc").click(function(e) {
        e.preventDefault();
        modal_seleccionar = $("[data-remodal-id=cambiar_ciudad]").remodal();
        modal_seleccionar.open()
    });
    if ($("#modal_ciudades").length > 0) {
        if ($("#envio_ciudad").val() == 0) {
            if(getCookie('city_seted')){
                location.reload();
            }else{
                modal_seleccionar = $("[data-remodal-id=cambiar_ciudad]").remodal();
                modal_seleccionar.open()
            }
        }else if(getCookie('city_seted') && $('.list_products .productos > div').length == 0){
            location.reload();
            deleteCookie('city_seted');
        }
    }
    $("#envio_ciudad").change(function() {
        modal_seleccionar.close();
        var ciudad_id = $(this).val();
        if ($.isNumeric(ciudad_id) && ciudad_id != 0) {
            if (parseInt($("#cant_prod").data("cant")) > 0) {
                modal_cambiar = $("[data-remodal-id=aceptar_ciudad]").remodal();
                modal_cambiar.open()
            } else {
                sendCiudad();
                $.LoadingOverlay("show", {
                    zIndex: 9999,
                    image: "/js/jquery-loading-overlay/src/loading.gif"
                })
            }
        }
    });
    $("#aceptar_ciudad").click(function(e) {
        e.preventDefault();
        sendCiudad();
        $.LoadingOverlay("show", {
            zIndex: 9999,
            image: "/js/jquery-loading-overlay/src/loading.gif"
        });
        modal_cambiar.close()
    });
    $("#cancelar_ciudad").click(function(e) {
        e.preventDefault();
        modal_cambiar.close()
    })
}
function sendCiudad() {
    console.log($("#envio_ciudad").val());
    var url = $raiz + "/cambio_ciudad/" + $("#envio_ciudad").val();
    $.ajax({
        url: url
    }).done(function(data) {
        console.log(data);
        var alteredURL = removeParam("ciudad", data.url);
        setCookie('city_seted',1,0.5);
        location.reload();
        // window.location.href = alteredURL + "?ciudad=" + $("#envio_ciudad").val()
    }).fail(function() {}).always(function() {})
}

/**
 * This function create a cookie
 * @param {string} cname  The name of var
 * @param {mixed} cvalue The values of the var
 * @param {int} exdays Days of expire
 * @param {String} path   The path of cookie
 */
function setCookie(cname, cvalue, exdays, path='') {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"+path;
}
/**
 * Return the value of a cookie
 * @param  {string} cname The name of the cookie
 * @return {string}       The value found or null if it not exists
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}
/**
 * This function delete a cookie
 * @param  {string} name The name of the cookie
 */
function deleteCookie(name) {
    setCookie(name,'',-1);
}
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0], param, params_arr = [], queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1)
            }
        }
        rtn = rtn + "?" + params_arr.join("&")
    }
    return rtn
}
var fila;
$(function() {
    listado_productos();
    clickColores();
    agregar();
    paisChange();
    departamentoChange();
    // getDepartamentosPais();
    getCiudadesDept();
    getCostoEnvio();
    hideUser();
    activeTalla();
    complementos();
    datosIgual();
    planAbasto();
    cambioTalla();
    seleccionarColor();
    deleteCityFilter();
});
function clickColores() {
    $(".colors a").click(function() {
        var check = $(this).find("input");
        if (check.is(":checked")) {
            check.prop("checked", false);
            $(this).removeClass("active")
        } else {
            check.prop("checked", true);
            $(this).addClass("active")
        }
        filtrar()
    })
}
function listado_productos() {
    var inputs = $(".filter input");
    inputs.click(function() {
        filtrar()
    })
}
function filtrar() {
    var arrs = []
      , arrs_class = [];
    $(".filter ul.grupo").each(function() {
        arrs.push($(this).find("input:checked"))
    });
    $.each(arrs, function(index, value) {
        var arr_temp = $.map(value, function(el) {
            return "." + $(el).data("class")
        });
        arrs_class.push(arr_temp)
    });
    var cp = [];
    for (var i = 0; i < arrs_class.length - 1; i++) {
        if (i == 0)
            cp = cartesianProductOf(arrs_class[i], arrs_class[i + 1]);
        else
            cp = cartesianProductOf(cp, arrs_class[i + 1])
    }
    cp = cp.join(",");
    $(".list .item").hide();
    if (cp)
        $(cp).show();
    else
        $(".list .item").show()
}
function cartesianProductOf(arr1, arr2) {
    var customerDebtorMatrix = [];
    for (var i = 0; i < arr1.length; i++) {
        for (var l = 0; l < arr2.length; l++) {
            customerDebtorMatrix.push(arr1[i] + arr2[l])
        }
    }
    if (arr1.length == 0)
        return arr2;
    if (arr2.length == 0)
        return arr1;
    return customerDebtorMatrix
}
function agregar() {
    $(".eliminar").click(function(e) {
        e.preventDefault();
        fila = $(this).closest("tr");
        eliminarSolos($(this).data("id"), $(this).data("id-talla"))
    });
    $(".eliminar_comp").click(function(e) {
        fila = $(this).closest("tr");
        e.preventDefault();
        eliminarComple($(this).data("id"), $(this).data("id-talla"), $(this).data("key"), $(this).data("key-comp"))
    });
    $(".eliminar_combo").click(function(e) {
        fila = $(this).closest("tr");
        e.preventDefault();
        eliminarCombo($(this).data("id"), $(this).data("id-talla"), $(this).data("key"))
    });
    $(".add_talla").click(function(e) {
        e.preventDefault();
        var color = $("#color").val();
        console.log(color);
        if (color == 0) {
            alertify.alert("Alerta", "Debes seleccionar el color de Rosa")
        } else {
            $.LoadingOverlay("show", {
                zIndex: 9999,
                image: "/js/jquery-loading-overlay/src/loading.gif"
            });
            console.log($("#complementos_ids").val());
            console.log($('input[name="complementos_ids[]"]').val());
            var id = $(this).data("id");
            var cant = $(this).data("cant");
            var talla = $("#select-talla").val();
            var complementos_ids = $("#complementos_ids").val();
            var complementos_cant = $("#complementos_cant").val();
            addCarritoTalla(id, cant, talla, complementos_ids, complementos_cant, color)
        }
    });
    $(".add_plan").click(function(e) {
        e.preventDefault();
            
        if($('[name=size-plan]:checked').length && $('#abasto_duration').val() != '' && (parseInt($('#abasto_delivery').val())) != 0) {
            $.LoadingOverlay("show", {
                zIndex: 9999,
                image: "/js/jquery-loading-overlay/src/loading.gif"
            });
            var product = $('#product_id').val();
            var size = $('[name=size-plan]:checked').val();
            var duration = $('#abasto_duration').val().split('-')[0];
            var cant = $('#abasto_delivery').val();
            var flor = 'not';
            if($('[name="flor-plan[]"]:checked').length){
                flor = [];
                $('[name="flor-plan[]"]:checked').each(function(){
                    flor.push(this.value);
                });
                flor = flor.join(',');
            }
            var florero = 'not';
            if($('[name=florero-plan]').length){
                if($('[name=step5]').val() == 1 && $('[name=florero-plan]:checked').length){
                    florero = $('[name=florero-plan]:checked').val();
                }
            }
            var date = $('#abasto_fechaDeEnvio').val();
            $.ajax({
                url: $raiz + "/add-plan/" + product + "/" + size + "/" + duration + "/" + cant + "/" + flor + "/" + florero + "/" + date
            }).done(function(data) {
                console.log(data.cantidad);
                if (window.location.href.indexOf("carrito-de-compras") > -1) {
                    window.location.reload()
                }
                window.location = $raiz + "/carrito-de-compras"
            }).fail(function() {
                $.LoadingOverlay("hide")
            }).always(function() {})
        }else{
            alert('Te faltan pasos por completar');
        }
    });
    $(".add_workshop").click(function(e) {
        e.preventDefault();
            $.LoadingOverlay("show", {
                zIndex: 9999,
                image: "/js/jquery-loading-overlay/src/loading.gif"
            });
            var id = $(this).data("id");
            var cant = $(this).data("cant");
            addCarritoTaller(id, cant);
    });
    $(".select-cant").change(function() {
        $.LoadingOverlay("show", {
            zIndex: 9999,
            image: "/js/jquery-loading-overlay/src/loading.gif"
        });
        setCarritoTalla($(this).parent().parent().data("id"), $(this).val(), $(this).parent().parent().data("id-talla"))
    });
    $(".eliminar_bono").click(function(e) {
        e.preventDefault();
        removeCarritoBono($(this).data("id"))
    });
    $("#rosa_veloz").change(function() {
        rosa = 0;
        var checked = $(this).prop("checked");
        if (checked)
            rosa = 1;
        setRosa(rosa)
    });
    $(".eliminar_rosa").click(function(e) {
        e.preventDefault();
        setRosa(0)
    })
}
function addCarrito(id, cant) {
    $.ajax({
        url: $raiz + "/add-carrito/" + id + "/" + cant
    }).done(function(data) {
        console.log(data.cantidad);
        $("#cantidad_" + id).html(data.cantidad);
        verGocarrito();
        if (window.location.href.indexOf("datos") > -1) {
            window.location.reload()
        }
    }).fail(function() {}).always(function() {});
    function verGocarrito() {
        TweenMax.to($(".go_carrito"), .8, {
            opacity: 1
        })
    }
}
function setRosa(rosa) {
    $.ajax({
        url: $raiz + "/set-rosa/" + rosa
    }).done(function(data) {
        if (window.location.href.indexOf("carrito-de-compras") > -1 || window.location.href.indexOf("resumen-compra") > -1) {
            window.location.reload()
        }
    }).fail(function() {}).always(function() {})
}
function eliminarComple(id, talla, key, key_comp) {
    $.LoadingOverlay("show", {
        zIndex: 9999,
        image: "/js/jquery-loading-overlay/src/loading.gif"
    });
    $.ajax({
        url: $raiz + "/remove-comp/" + id + "/" + talla + "/" + key + "/" + key_comp
    }).done(function(data) {
        console.log(data.cantidad);
        fila.remove();
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}
function eliminarCombo(id, talla, key) {
    $.LoadingOverlay("show", {
        zIndex: 9999,
        image: "/js/jquery-loading-overlay/src/loading.gif"
    });
    $.ajax({
        url: $raiz + "/remove-combo/" + id + "/" + talla + "/" + key
    }).done(function(data) {
        console.log(data.cantidad);
        fila.remove();
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}
function eliminarSolos(id, talla, key) {
    $.LoadingOverlay("show", {
        zIndex: 9999,
        image: "/js/jquery-loading-overlay/src/loading.gif"
    });
    $.ajax({
        url: $raiz + "/remove-solos/" + id + "/" + talla
    }).done(function(data) {
        console.log(data.cantidad);
        fila.remove();
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}
function cambiarCantidad(id, talla) {
    $.LoadingOverlay("show", {
        zIndex: 9999,
        image: "/js/jquery-loading-overlay/src/loading.gif"
    });
    $.ajax({
        url: $raiz + "/cambiar-cantidad/" + id + "/" + talla
    }).done(function(data) {
        console.log(data.cantidad);
        fila.remove();
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}
function addCarritoTalla(id, cant, talla, complementos_ids, complementos_cant, color) {
    if (complementos_ids.length == 0) {
        complementos_ids = 0;
        complementos_cant = 0
    }
    $.ajax({
        url: $raiz + "/add-carrito-talla/" + id + "/" + talla + "/" + complementos_ids + "/" + complementos_cant + "/" + color
    }).done(function(data) {
        console.log(data.cantidad);
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}

function removeCarritoBono(id) {
    $.ajax({
        url: $raiz + "/remove-carrito-bono/" + id
    }).done(function(data) {
        console.log(data.cantidad);
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}
function setCarritoTalla(id, cant, talla) {
    $.ajax({
        url: $raiz + "/set-carrito-talla/" + id + "/" + cant + "/" + talla
    }).done(function(data) {
        console.log(data.cantidad);
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}
function paisChange() {
    $("#factura_paisEn").change(function() {
        $('#factura_pais').val($("#factura_paisEn option:selected").text());
        getDepartamentosPais()
    })
}
function getDepartamentosPais() {
    if (!$.isNumeric($("#factura_paisEn").val())) {
        $("#factura_departamento").html("<option>Departamento</option>")
    } else {
        $.ajax({
            url: $raiz + "/departamentos-pais/" + $("#factura_paisEn").val()
        }).done(function(html) {
            $("#factura_departamento").html(html);
            getCiudadesDept();
        }).fail(function() {}).always(function() {})
    }
}
function departamentoChange() {
    $("#factura_departamento").change(function() {
        getCiudadesDept()
    })
}
function getCiudadesDept() {
    if (!$.isNumeric($("#factura_departamento").val())) {
        $("#factura_ciudad").html("<option>Ciudad</option>")
    } else {
        $.ajax({
            url: $raiz + "/ciudades-dept/" + $("#factura_departamento").val()
        }).done(function(html) {
            $("#factura_ciudad").html(html)
        }).fail(function() {}).always(function() {})
    }
}
function getCostoEnvio() {
    $("#factura_ciudad").change(function() {
        costoEnvio()
    })
}
function costoEnvio() {
    $("#costo-envio-span").html($("#factura_ciudad").find(":selected").data("costo"));
    $("#costo-envio").val($("#factura_ciudad").find(":selected").data("costo"));
    var result = parseInt($("#total-carrito").val()) + parseInt($("#factura_ciudad").find(":selected").data("costo-noformato"));
    var iva = Math.round(result * .16 / 1.16);
    $("#carrito-iva").html("$" + iva);
    $("#total-resultado").html("$" + (result + iva))
}
function hideUser() {
    $("#envio_user").parent().hide()
}
function activeTalla() {
    $(".size a").click(function() {
        var value = $(this).data("value");
        $("#select-talla").val(value);
        $(".size a").removeClass("active");
        $(this).addClass("active")
    })
}
var prod_talla_carrito = false;
function complementos() {
    $(".add_complemento").click(function() {
        console.log(prod_talla_carrito);
        if (!prod_talla_carrito) {
            var id = $(this).data("id");
            if (existe(id)) {
                $(this).find("span").text($(this).data("add"));
                var pos = $('#complementos_ids option[value="' + id + '"]').index();
                console.log(pos);
                console.log("after" + pos);
                $('#complementos_ids option[value="' + id + '"]').remove();
                $("#complementos_cant option").eq(pos).remove()
            } else {
                $(this).find("span").text($(this).data("remove"));
                $("#complementos_ids").append('<option type="hidden"value="' + id + '" selected></option>');
                $("#complementos_cant").append('<option type="hidden"value="1" selected></option>')
            }
        } else {
            var id_comp = $(this).data("id");
            var talla = $("#select-talla").val();
            var id = $(".add_talla").data("id");
            var comple = $(this);
            $.ajax({
                url: $raiz + "/check-complemento/" + id + "/" + talla + "/" + id_comp,
                dataType: "json"
            }).done(function(data) {
                console.log(data);
                comple.find("span").text(comple.data(data.action))
            }).fail(function() {}).always(function() {})
        }
    });
    $(".add_complemento").each(function() {
        var id = $(this).data("id");
        var complementos_ids = $("#complementos_ids").val();
        if (existe(id)) {
            $(this).find("span").text($(this).data("remove"))
        }
    });
    $(".abrir_complementos").click(function() {
        var id = $(this).data("id");
        var talla = $("#select-talla").val();
        complementosInit();
        $.ajax({
            url: $raiz + "/carrito-complementos/" + id + "/" + talla,
            dataType: "json"
        }).done(function(data) {
            var cant_comp = 0;
            for (var i = 0; i < data.length; i++) {
                var grupo = data[i];
                var complementos = grupo.complementos;
                var productos = grupo.productos;
                cant_comp += complementos.length
            }
            if (i > 0) {
                prod_talla_carrito = true
            } else {
                prod_talla_carrito = false
            }
            console.log(cant_comp);
            var tiene_comp = false;
            if (cant_comp > 0) {
                tiene_comp = true
            }
            if (tiene_comp) {
                for (var j = 0; j < complementos.length; j++) {
                    var complemento = complementos[j];
                    console.log(complemento.producto.id);
                    complementoAgregado(complemento.producto.id)
                }
            }
        }).fail(function() {}).always(function() {})
    })
}
function complementosInit() {
    $(".add_complemento").each(function() {
        $(this).find("span").text($(this).data("add"));
        $("#complementos_ids").empty();
        $("#complementos_cant").empty()
    })
}
function complementoAgregado(id) {
    var elem = $("#comp_" + id);
    elem.find("span").text(elem.data("remove"))
}
function existe(id) {
    var exists = false;
    $("#complementos_ids option").each(function() {
        console.log(this.value, id);
        if (this.value == id) {
            exists = true;
            return exists
        }
    });
    return exists
}
function datosIgual() {
    $("#datos_igual").change(function() {
        $('form input[type="text"],#envio_ciudad').each(function() {
            $val = $(this).data("val");
            $(this).val($val)
        })
    })
}
function planAbasto() {
    $(".cont_perio input").click(function() {
        $(".add_talla").data("id", $(this).val());
        console.log($(".add_talla").data("id"))
    })
}
function cambioTalla() {
    mostrarColores();
    $("#select-talla").val();
    $("#select-talla").change(function() {
        var precio = $(this).find("option:selected").data("precio");
        console.log(precio);
        $("#precio").html(precio);
        mostrarColores()
    })
}
function mostrarColores() {
    var t_id = $("#select-talla").val();
    if ($("#tc_" + t_id).length > 0) {
        var tcols = $("#tc_" + t_id).val().split(" ");
        $(".colores").show();
        $(".color_padre").hide();
        var c = 0;
        for (var i = 0; i < tcols.length; i++) {
            $("#color_" + tcols[i]).show();
            c++
        }
        if (c > 0) {
            $(".color_padre:last-child").show()
        }
    } else {
        $(".color_padre").hide()
    }
}
function seleccionarColor() {
    $(".color").click(function(e) {
        e.preventDefault();
        $(".color").removeClass("active");
        $(this).addClass("active");
        $("#color").val($(this).data("id"))
    })
}

$( ".steps-form .containerItem span.sizeInput").click(function(){
    $(".step-2").fadeIn();
    if($( ".steps-form .containerItem span.sizeInput.active").length) {
        $( ".steps-form .containerItem span.sizeInput.active").removeClass('active');
    }
    $(this).addClass('active');
    var tam_id = $('[name=size-plan]:checked').val();
    $('.florero').hide();
    $('.florero.active input').prop('checked',false);
    $('.florero.active').removeClass('active');
    $('[name=florero-plan][data-tam='+tam_id+']').each(function(){
        $(this).parent('span.florero').show();
    });
    deliveryChange();
})
$( ".steps-form .containerItem span.florero").click(function(){
    if($( ".steps-form .containerItem span.florero.active").length) {
        $( ".steps-form .containerItem span.florero.active").removeClass('active');
    }
    $(this).addClass('active');
    var price = $(this).find('input').data('price');
    price = price == ''?0:Number(price);
    $('#pPrice').html('$'+price.formatMoney());
    if($('#totalPrice').css('display') != 'none'){
        $('#pPrice').parent().show();
    }
});
$( ".steps-form .containerItem span.flor").click(function(){
    if($(this).hasClass('active')){
        $(this).removeClass('active');
    }else{
        if($('input[type=checkbox][name="flor-plan[]"]:checked').length > $('#abasto_delivery').val()){
            $(this).find('input').prop('checked',false);
        }else{
            $(this).addClass('active');
        }
    }

})

function createCustomSelect() {
    
    var x, i, j, selElmnt, a, lastA, b, lastB, c, onChange, onChangeName;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      onChangeName = selElmnt.dataset.change;
      lastA = x[i].getElementsByClassName('select-selected');
      if(lastA.length){
          lastA[0].parentNode.removeChild(lastA[0]);
          lastB = x[i].getElementsByClassName('select-items')[0];
          lastB.parentNode.removeChild(lastB);
      }
      /*for each element, create a new DIV that will act as the selected item:*/
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /*for each element, create a new DIV that will contain the option list:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < selElmnt.length; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
              if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected");
                for (k = 0; k < y.length; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
              }
            }
            h.click();
            if(h.dataset.onChangeName != 'undefined') {
                if(window[h.dataset.onChangeName] !== undefined){
                    window[h.dataset.onChangeName]();
                }
            }
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.dataset.onChangeName = onChangeName;
      a.addEventListener("click", function(e) {
          /*when the select box is clicked, close any other select boxes,
          and open/close the current select box:*/
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide");
          this.classList.toggle("select-arrow-active");
        });
    }
}

createCustomSelect();

function durationChange() {
    // var dur = $('#abasto_duration').val();
    // $('#abasto_delivery').html('');
    // $('#abasto_delivery').append('<option value="0" selected>Selecciona la cantidad de entregas</option>');
    // if(dur != ''){
    //     var days = parseInt(dur.split('-')[1]);
    //     var numDevOptions = [];
    //     var now = new Date();
    //     var month = now.getMonth();
    //     var minMonths = 3;
    //     var lastMonth = 11 - month - minMonths;
    //     if(days <= 30){
    //         var devsInMonth = Math.floor(30 / days);
    //         numDevOptions = [devsInMonth * minMonths];
    //         var next = devsInMonth * minMonths;
    //         for(var i = 1; i <= lastMonth; i++){
    //             next += devsInMonth;
    //             numDevOptions.push(next);
    //         }
    //     }else{
    //         numDevOptions = [1];
    //         var current = 0;
    //         for(var i = 1; i <= lastMonth; i++){
    //             current += 5;
    //             numDevOptions.push(current);
    //         }
    //         numDevOptions = [1, 5, 10, 15, 20, 25];
    //     }
    //     var l = numDevOptions.length;
    //     for(var i = 0; i < l; i++){
    //         $('#abasto_delivery').append('<option value="'+numDevOptions[i]+'">'+numDevOptions[i]+'</option>');
    //     }
    // }else{
    //     $('#abasto_delivery').append('<option value="1">1</option>');
    // }
    // createCustomSelect();
    deliveryChange();
}

function deliveryChange() {
    var plan = $('#plan_id').val();
    var size = $('[name=size-plan]:checked').val();
    var duration = $('#abasto_duration').val();
    var entregas = parseInt($('#abasto_delivery').val());
    var politics = $('.containerCheck.politics input').prop('checked');
    if(size !== undefined && duration != '' && entregas){
        switch (entregas) {
            case 1:
                entregas = 3;
                break;
            case 2:
                entregas = 6;
                break;
            case 3:
                entregas = 12;
        }
        var dias = parseInt(duration.split('-')[1]);
        var entregasMes = 1;
        if(dias <= 30) {
            entregasMes = Math.floor(30/dias);
        }
        var precioMes = parseFloat($('[name=size-plan]:checked').data('p'+entregasMes));
        var now = new Date();
        var month = now.getMonth() + 1;
        var total = entregas * precioMes;
        if(month + entregas > 12){
            var primerasEntregas = 12 - month;
            var segundasEntregas = entregas - primerasEntregas;
            var aumentoSegundasEntregas = 1.07;
            total = (primerasEntregas * precioMes) + (segundasEntregas * precioMes * aumentoSegundasEntregas);
        }
        setPlanPrice(total,entregas * entregasMes);
        $('#product_id').val($('[name=size-plan]:checked').data('prod'));
        $('#totalPrice').show();
        if(politics){
            $('.add_plan').show();
        }else{
            $('.add_plan').hide();
        }
        if($('.florero.active').length && $('[name=step5]').val() == 1){
            $('#discount2').next().show();
        }else{
            $('#discount2').next().hide();
        }
    }else{
        // $('#totalPrice').hide();
        $('.add_plan').hide();
        // $('#discount1').hide();
        // $('#discount2').hide();
        // $('#discount2').next().hide();
    }
}

deliveryChange();

Number.prototype.formatMoney = function() {
    var n = Number(this.toFixed(2));
    var str = n.toLocaleString("de-De");
    var a = "" + n;
    if (a.length > 6) {
        str = str.replace(".", "'");
    }
    return str;
};

function setPlanPrice(price, entregas) {
    price = parseFloat(price);
    var tamData = $('.sizeInput.active input').data();
    if(entregas >= parseFloat(tamData.ent1) && entregas < parseFloat(tamData.ent2)){
        var priceWithDiscount = price * (1 - (parseFloat(tamData.desc1)/100));
        $('#totalPrice').html('Plan: <strike style="font-size: 0.8em;">$'+price.formatMoney()+'</strike> $'+priceWithDiscount.formatMoney());
        price = priceWithDiscount;
        $('#discount1').show();
        $('#discount2').hide();
    }else if(entregas >= parseFloat(tamData.ent2)){
        var priceWithDiscount = price * (1 - (parseFloat(tamData.desc2)/100));
        $('#totalPrice').html('Plan: <strike style="font-size: 0.8em;">$'+price.formatMoney()+'</strike> $'+priceWithDiscount.formatMoney());
        price = priceWithDiscount;
        $('#discount2').show();
        $('#discount1').hide();
    }else{
        $('#discount2').hide();
        $('#discount1').hide();
        $('#totalPrice').html('Plan: $'+price.formatMoney());
    }
    $('#plan_total').val(price);
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

$('.step-5 .switch.basic.customSwitch').click(function() {
    var target = $(this);
    var id = target.data('switch');
    target.toggleClass('active');
    target.find('p').toggleClass('active');
    if (target.hasClass('active')) {
        $('[name=' + id + ']').val(1);
        $(".step-6").fadeIn();
        if($('.florero.active').length && $('#totalPrice').css('display') != 'none'){
            $("#pPrice").parent().show();
        }
    } else {
        $('[name=' + id + ']').val(0);
        $(".step-6").fadeOut();
        $("#pPrice").parent().hide();
    }
});

$('.step-6 .switch.basic.customSwitch').click(function() {
    var target = $(this);
    var id = target.data('switch');
    target.toggleClass('active');
    target.find('p').toggleClass('active');
    if (target.hasClass('active')) {
            $('[name=' + id + ']').val(1);
            $(".step-7").fadeIn();
    } else {
            $('[name=' + id + ']').val(0);
            $(".step-7").fadeOut();
    }
});


$(".step-2 .select-items div").click(()=>{
    $(".step-3").fadeIn();
})
$(".step-3 .select-items div").click(()=>{
    $(".step-4").fadeIn();
})
if($(".step-5").length){ 
    $(".step-4 #abasto_fechaDeEnvio").change(()=>{
        $(".step-5").fadeIn();
    })
}
if($(".step-6").length){ 
    $(".step-5 .containerItem span.flor").click(()=>{
        $(".step-6").fadeIn();
    })
}
if($('#pPrice').length) {
    $('#pPrice').parent().hide();
}
if($('.containerCheck.politics').length){
    $('.containerCheck.politics').click(function(){
        deliveryChange();
    })
}


function addCarritoTaller(id) {
    $.ajax({
        url: $raiz + "/add-taller/" + id + "/" + $('#date-workshop').val()
    }).done(function(data) {
        console.log(data.cantidad);
        if (window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload()
        }
        window.location = $raiz + "/carrito-de-compras"
    }).fail(function() {
        $.LoadingOverlay("hide")
    }).always(function() {})
}

function filter_taller(cityID) {
    if(cityID == 0){
        $('.li-taller').show();
    }else{
        $('.li-taller').hide();
        $('.li-taller[data-city-id="'+cityID+'"]').show();
    }
}

function deleteCityFilter() {
    $('.city-filter').each(function(){
        var cityID = $(this).data('cityId');
        if($('.li-taller[data-city-id="'+cityID+'"]').length == 0 && cityID != 0){
            $(this).remove();
        }
    });
}

function showLoading() {
    $.LoadingOverlay("show", {
        zIndex: 9999,
        image: "/js/jquery-loading-overlay/src/loading.gif"
    });
}

$(()=>{
    if($('.florero').length){
        $('a.tooltip').tooltip();
    }
    if($('.call-1').length && window.innerWidth <= 768){
        var tel = $('.call-1').data('tel');
        $('.call-1').attr('href','tel:'+tel);
    }
    if($('[data-remodal-id="teLlamamos"]').length){
        $('[data-remodal-id="teLlamamos"] form').submit( function(e){
            var nameValid = $('#name_call').length && ($('#name_call').val() != '' && $('#name_call').val().length > 2);
            var telTest = /(?:\+?\(?(\d{1,3})\)?)?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)/;
            var telValid = $('#phone_call').length && ($('#phone_call').val() != '' && telTest.test($('#phone_call').val()));
            if(nameValid && telValid){
               return true; 
            }else{
                e.preventDefault();
                if(!nameValid){
                    $('#name_call').parent().find('span.error').remove();
                    $('#name_call').before('<span class="error">El nombre es requerido</span>');
                }
                if(!telValid){
                    $('#phone_call').parent().find('span.error').remove();
                    $('#phone_call').before('<span class="error">El teléfono es requerido y debe ser un teléfono válido</span>');
                }
            }
        });
    }
});
