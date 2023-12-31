/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.5',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && navigator && document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value !== 'string') {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (getOwn(config.pkgs, baseName)) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    }

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = getOwn(config.pkgs, (pkgName = name[0]));
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                removeScript(id);
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                getModule(depMap).on(name, fn);
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length - 1, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return mod.exports;
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return (config.config && getOwn(config.config, mod.map.id)) || {};
                        },
                        exports: defined[mod.map.id]
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var map, modId, err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                map = mod.map;
                modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error.
                            if (this.events.error) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                        cjsModule.exports !== undefined &&
                                        //Make sure it is not already the exports value
                                        cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                                } else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = [this.map.id];
                                err.requireType = 'define';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', this.errback);
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    objs = {
                        paths: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (prop === 'map') {
                            if (!config.map) {
                                config.map = {};
                            }
                            mixin(config[prop], value, true, true);
                        } else {
                            mixin(config[prop], value, true);
                        }
                    } else {
                        config[prop] = value;
                    }
                });

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                  .replace(currDirRegExp, '')
                                  .replace(jsSuffixRegExp, '')
                        };
                    });

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overriden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = getOwn(pkgs, parentModule);
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        } else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                            } else {
                                pkgPath = pkg.location;
                            }
                            syms.splice(0, i, pkgPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callack function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error', evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = function (err) {
        throw err;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = config.xhtml ?
                    document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                    document.createElement('script');
            node.type = config.scriptType || 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = dataMain.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                    dataMain = mainScript;
                }

                //Strip off any trailing .js since dataMain is now
                //like a module name.
                dataMain = dataMain.replace(jsSuffixRegExp, '');

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(dataMain) : [dataMain];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = [];
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps.length && isFunction(callback)) {
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

var components = {
    "packages": [
        {
            "name": "elfinder",
            "main": "elfinder-built.js"
        },
        {
            "name": "jquery",
            "main": "jquery-built.js"
        },
        {
            "name": "jquery-ui",
            "main": "jquery-ui-built.js"
        }
    ],
    "shim": {
        "jquery-ui": {
            "deps": [
                "jquery"
            ],
            "exports": "jQuery"
        }
    },
    "baseUrl": "components"
};
if (typeof require !== "undefined" && require.config) {
    require.config(components);
} else {
    var require = components;
}
if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = components;
}
define('elfinder', function (require, exports, module) {
/*!
 * elFinder - file manager for web
 * Version 2.1.20 (2017-01-11)
 * http://elfinder.org
 * 
 * Copyright 2009-2017, Studio 42
 * Licensed under a 3-clauses BSD license
 */
!function(e,t){if("function"==typeof define&&define.amd)define(["jquery","jquery-ui"],t);else if("undefined"!=typeof exports){var n,i;try{n=require("jquery"),i=require("jquery-ui")}catch(a){}module.exports=t(n,i)}else t(e.jQuery,e.jQuery.ui,!0)}(this,function(e,t,n){n=n||!1;var i=function(t,n){var a,r,o,s=this,t=e(t),l=e("<div/>").append(t.contents()),d=t.attr("style"),c=t.attr("id")||"",u="elfinder-"+(c?c:Math.random().toString().substr(2,7)),h="mousedown."+u,p="keydown."+u,f="keypress."+u,m=!0,g=!0,v=["enable","disable","load","open","reload","select","add","remove","change","dblclick","getfile","lockfiles","unlockfiles","selectfiles","unselectfiles","dragstart","dragstop","search","searchend","viewchange"],b="",y={path:"",url:"",tmbUrl:"",disabled:[],separator:"/",archives:[],extract:[],copyOverwrite:!0,uploadOverwrite:!0,uploadMaxSize:0,jpgQuality:100,tmbCrop:!1,tmb:!1},w={},k=[],x={},C={},T=[],z=[],A=[],I=[],S=new s.command(s),U="auto",M=400,O="./sounds/",D=e(document.createElement("audio")).hide().appendTo("body")[0],F=0,E="",P=function(n){var i,a,r,o,l,d,c,u,h={},p={};s.api>=2.1?(s.commandMap=n.options.uiCmdMap&&Object.keys(n.options.uiCmdMap).length?n.options.uiCmdMap:{},E!==JSON.stringify(s.commandMap)&&(E=JSON.stringify(s.commandMap),Object.keys(s.commandMap).length&&(a=s.getUI("contextmenu"),a.data("cmdMaps")||a.data("cmdMaps",{}),i=n.cwd?n.cwd.volumeid:null,i&&!a.data("cmdMaps")[i]&&(a.data("cmdMaps")[i]=s.commandMap)))):s.options.sync=0,n.init?w={}:(u=b,r="elfinder-subtree-loaded "+s.res("class","navexpand"),c=s.res("class","navcollapse"),o=Object.keys(w),l=function(t,n){if(!w[n])return!0;var i="directory"===w[n].mime,a=w[n].phash;(!i||h[a]||!p[a]&&e("#"+s.navHash2Id(w[n].hash)).is(":hidden")&&e("#"+s.navHash2Id(a)).next(".elfinder-navbar-subtree").children().length>100)&&(i||a!==b)&&-1===e.inArray(n,z)?(i&&!h[a]&&(h[a]=!0,e("#"+s.navHash2Id(a)).removeClass(r).next(".elfinder-navbar-subtree").empty()),delete w[n]):i&&(p[a]=!0)},d=function(){o.length&&(e.each(o.splice(0,100),l),o.length&&setTimeout(d,20))},s.trigger("filesgc").one("filesgc",function(){o=[]}),s.one("opendone",function(){u!==b&&(t.data("lazycnt")?s.one("lazydone",d):d())})),s.sorters=[],b=n.cwd.hash,R(n.files),w[b]||R([n.cwd]),s.lastDir(b),s.autoSync()},R=function(t){var n,i,a={name:!0,perm:!0,date:!0,size:!0,kind:!0},r=0===s.sorters.length,o=t.length;for(i=0;o>i;i++)n=t[i],n.name&&n.hash&&n.mime&&(r&&n.phash===b&&(e.each(s.sortRules,function(e){(a[e]||"undefined"!=typeof n[e]||"mode"===e&&"undefined"!=typeof n.perm)&&s.sorters.push(e)}),r=!1),n.isroot&&n.phash&&(s.leafRoots[n.phash]?-1===e.inArray(n.hash,s.leafRoots[n.phash])&&s.leafRoots[n.phash].push(n.hash):s.leafRoots[n.phash]=[n.hash],w[n.phash]&&(w[n.phash].dirs||(w[n.phash].dirs=1),n.ts&&(w[n.phash].ts||0)<n.ts&&(w[n.phash].ts=n.ts))),w[n.hash]=n)},j=function(n){var i,a=n.keyCode,r=!(!n.ctrlKey&&!n.metaKey);m&&(e.each(C,function(e,t){t.type==n.type&&t.keyCode==a&&t.shiftKey==n.shiftKey&&t.ctrlKey==r&&t.altKey==n.altKey&&(n.preventDefault(),n.stopPropagation(),t.callback(n,s),s.debug("shortcut-exec",e+" : "+t.description))}),a!=e.ui.keyCode.TAB||e(n.target).is(":input")||n.preventDefault(),"keydown"===n.type&&a==e.ui.keyCode.ESCAPE&&(t.find(".ui-widget:visible").length||s.clipboard().length&&s.clipboard([]),e.ui.ddmanager&&(i=e.ui.ddmanager.current,i&&i.helper&&i.cancel()),t.find(".ui-widget.elfinder-button-menu").hide()))},H=new Date,N=window.parent!==window,q=function(){var t,n;if(N)try{n=e("iframe",window.parent.document),n.length&&e.each(n,function(n,i){return i.contentWindow===window?(t=e(i),!1):void 0})}catch(i){}return t}();return this.api=null,this.newAPI=!1,this.oldAPI=!1,this.netDrivers=[],this.options=e.extend(!0,{},this._options,n||{}),this.options.cssAutoLoad&&!function(n){var i,a,r,o,s=e('head > script[src$="js/elfinder.min.js"],script[src$="js/elfinder.full.js"]:first');s.length?(a=e("<style>.elfinder{visibility:hidden;overflow:hidden}</style>"),e("head").append(a),i=s.attr("src").replace(/js\/[^\/]+$/,""),n.loadCss([i+"css/elfinder.min.css",i+"css/theme.css"]),e.isArray(n.options.cssAutoLoad)&&n.loadCss(n.options.cssAutoLoad),o=1e3,r=setInterval(function(){--o>0&&"hidden"!==t.css("visibility")&&(clearInterval(r),a.remove(),n.trigger("cssloaded"))},10)):n.options.cssAutoLoad=!1}(this),this.optionProperties=["icon","csscls","tmbUrl","uiCmdMap","netkey"],n.ui&&(this.options.ui=n.ui),n.commands&&(this.options.commands=n.commands),n.uiOptions&&n.uiOptions.toolbar&&(this.options.uiOptions.toolbar=n.uiOptions.toolbar),n.uiOptions&&n.uiOptions.cwd&&n.uiOptions.cwd.listView&&n.uiOptions.cwd.listView.columns&&(this.options.uiOptions.cwd.listView.columns=n.uiOptions.cwd.listView.columns),n.uiOptions&&n.uiOptions.cwd&&n.uiOptions.cwd.listView&&n.uiOptions.cwd.listView.columnsCustomName&&(this.options.uiOptions.cwd.listView.columnsCustomName=n.uiOptions.cwd.listView.columnsCustomName),N||this.options.enableAlways||2!==e("body").children().length||(this.options.enableAlways=!0),this.isCORS=!1,function(){var t,i=document.createElement("a");i.href=n.url,n.urlUpload&&n.urlUpload!==n.url&&(t=document.createElement("a"),t.href=n.urlUpload),(window.location.host!==i.host||t&&window.location.host!==t.host)&&(s.isCORS=!0,e.isPlainObject(s.options.customHeaders)||(s.options.customHeaders={}),e.isPlainObject(s.options.xhrFields)||(s.options.xhrFields={}),s.options.requestType="post",s.options.customHeaders["X-Requested-With"]="XMLHttpRequest",s.options.xhrFields.withCredentials=!0)}(),e.extend(this.options.contextmenu,n.contextmenu),this.requestType=/^(get|post)$/i.test(this.options.requestType)?this.options.requestType.toLowerCase():"get",this.customData=e.isPlainObject(this.options.customData)?this.options.customData:{},this.customHeaders=e.isPlainObject(this.options.customHeaders)?this.options.customHeaders:{},this.xhrFields=e.isPlainObject(this.options.xhrFields)?this.options.xhrFields:{},this.abortCmdsOnOpen=this.options.abortCmdsOnOpen||["tmb"],this.id=c,this.navPrefix="nav"+(i.prototype.uniqueid?i.prototype.uniqueid:"")+"-",this.cwdPrefix=i.prototype.uniqueid?"cwd"+i.prototype.uniqueid+"-":"",++i.prototype.uniqueid,this.uploadURL=n.urlUpload||n.url,this.namespace=u,this.lang=this.i18[this.options.lang]&&this.i18[this.options.lang].messages?this.options.lang:"en",o="en"==this.lang?this.i18.en:e.extend(!0,{},this.i18.en,this.i18[this.lang]),this.direction=o.direction,this.messages=o.messages,this.dateFormat=this.options.dateFormat||o.dateFormat,this.fancyFormat=this.options.fancyDateFormat||o.fancyDateFormat,this.today=new Date(H.getFullYear(),H.getMonth(),H.getDate()).getTime()/1e3,this.yesterday=this.today-86400,r=this.options.UTCDate?"UTC":"",this.getHours="get"+r+"Hours",this.getMinutes="get"+r+"Minutes",this.getSeconds="get"+r+"Seconds",this.getDate="get"+r+"Date",this.getDay="get"+r+"Day",this.getMonth="get"+r+"Month",this.getFullYear="get"+r+"FullYear",this.cssClass="ui-helper-reset ui-helper-clearfix ui-widget ui-widget-content ui-corner-all elfinder elfinder-"+("rtl"==this.direction?"rtl":"ltr")+(this.UA.Touch?" elfinder-touch"+(this.options.resizable?" touch-punch":""):"")+(this.UA.Mobile?" elfinder-mobile":"")+" "+this.options.cssClass,this.zIndex,this.searchStatus={state:0,query:"",target:"",mime:"",mixed:!1,ininc:!1},this.storage=function(){try{return"localStorage"in window&&null!==window.localStorage?(s.UA.Safari&&(window.localStorage.setItem("elfstoragecheck",1),window.localStorage.removeItem("elfstoragecheck")),s.localStorage):s.cookie}catch(e){return s.cookie}}(),this.viewType=this.storage("view")||this.options.defaultView||"icons",this.sortType=this.storage("sortType")||this.options.sortType||"name",this.sortOrder=this.storage("sortOrder")||this.options.sortOrder||"asc",this.sortStickFolders=this.storage("sortStickFolders"),null===this.sortStickFolders?this.sortStickFolders=!!this.options.sortStickFolders:this.sortStickFolders=!!this.sortStickFolders,this.sortAlsoTreeview=this.storage("sortAlsoTreeview"),null===this.sortAlsoTreeview?this.sortAlsoTreeview=!!this.options.sortAlsoTreeview:this.sortAlsoTreeview=!!this.sortAlsoTreeview,this.sortRules=e.extend(!0,{},this._sortRules,this.options.sortRules),e.each(this.sortRules,function(e,t){"function"!=typeof t&&delete s.sortRules[e]}),this.compare=e.proxy(this.compare,this),this.notifyDelay=this.options.notifyDelay>0?parseInt(this.options.notifyDelay):500,this.draggingUiHelper=null,function(){var n,i,a,r,o=p+"draggable keyup."+u+"draggable";s.draggable={appendTo:t,addClasses:!1,distance:4,revert:!0,refreshPositions:!1,cursor:"crosshair",cursorAt:{left:50,top:47},scroll:!1,start:function(o,l){var d,c,u=l.helper,h=e.map(u.data("files")||[],function(e){return e||null}),p=!1;for(r=t.attr("style"),t.width(t.width()).height(t.height()),n="ltr"===s.direction,i=s.getUI("workzone").data("rectangle"),a=i.top+i.height,s.draggingUiHelper=u,d=h.length;d--;)if(c=h[d],w[c].locked){p=!0,u.data("locked",!0);break}!p&&s.trigger("lockfiles",{files:h}),u.data("autoScrTm",setInterval(function(){u.data("autoScr")&&s.autoScroll[u.data("autoScr")](u.data("autoScrVal"))},50))},drag:function(t,r){var o,s=r.helper;(o=i.top>t.pageY)||a<t.pageY?(i.cwdEdge>t.pageX?s.data("autoScr",(n?"navbar":"cwd")+(o?"Up":"Down")):s.data("autoScr",(n?"cwd":"navbar")+(o?"Up":"Down")),s.data("autoScrVal",Math.pow(o?i.top-t.pageY:t.pageY-a,1.3))):s.data("autoScr")&&s.data("refreshPositions",1).data("autoScr",null),s.data("refreshPositions")&&e(this).elfUiWidgetInstance("draggable")&&(s.data("refreshPositions")>0?(e(this).draggable("option",{refreshPositions:!0,elfRefresh:!0}),s.data("refreshPositions",-1)):(e(this).draggable("option",{refreshPositions:!1,elfRefresh:!1}),s.data("refreshPositions",null)))},stop:function(n,i){var a,l=i.helper;e(document).off(o),e(this).elfUiWidgetInstance("draggable")&&e(this).draggable("option",{refreshPositions:!1}),s.draggingUiHelper=null,s.trigger("focus").trigger("dragstop"),l.data("droped")||(a=e.map(l.data("files")||[],function(e){return e||null}),s.trigger("unlockfiles",{files:a}),s.trigger("selectfiles",{files:a})),s.enable(),t.attr("style",r),l.data("autoScrTm")&&clearInterval(l.data("autoScrTm"))},helper:function(t,n){var i,a,r,l=this.id?e(this):e(this).parents("[id]:first"),d=e('<div class="elfinder-drag-helper"><span class="elfinder-drag-helper-icon-status"/></div>'),c=function(t){var n,i=t.mime,a=s.tmb(t);return n='<div class="elfinder-cwd-icon '+s.mime2class(i)+' ui-corner-all"/>',a&&(n=e(n).addClass(a.className).css("background-image","url('"+a.url+"')").get(0).outerHTML),n};return s.draggingUiHelper&&s.draggingUiHelper.stop(!0,!0),s.trigger("dragstart",{target:l[0],originalEvent:t}),i=l.hasClass(s.res("class","cwdfile"))?s.selected():[s.navId2Hash(l.attr("id"))],d.append(c(w[i[0]])).data("files",i).data("locked",!1).data("droped",!1).data("namespace",u).data("dropover",0),(a=i.length)>1&&d.append(c(w[i[a-1]])+'<span class="elfinder-drag-num">'+a+"</span>"),e(document).on(o,function(e){var t=e.shiftKey||e.ctrlKey||e.metaKey;r!==t&&(r=t,d.is(":visible")&&d.data("dropover")&&!d.data("droped")&&(d.toggleClass("elfinder-drag-helper-plus",d.data("locked")?!0:r),s.trigger(r?"unlockfiles":"lockfiles",{files:i,helper:d})))}),d}}}(),this.droppable={greedy:!0,tolerance:"pointer",accept:".elfinder-cwd-file-wrapper,.elfinder-navbar-dir,.elfinder-cwd-file,.elfinder-cwd-filename",hoverClass:this.res("class","adroppable"),classes:{"ui-droppable-hover":this.res("class","adroppable")},autoDisable:!0,drop:function(t,n){var i,a,r,o=e(this),l=e.map(n.helper.data("files")||[],function(e){return e||null}),d=[],c=[],h=[],p=n.helper.hasClass("elfinder-drag-helper-plus"),f="class";if("undefined"==typeof t.button||n.helper.data("namespace")!==u||!s.insideWorkzone(t.pageX,t.pageY))return!1;for(a=o.hasClass(s.res(f,"cwdfile"))?s.cwdId2Hash(o.attr("id")):o.hasClass(s.res(f,"navdir"))?s.navId2Hash(o.attr("id")):b,i=l.length;i--;)r=l[i],r!=a&&w[r].phash!=a?d.push(r):(p&&r!==a&&w[a].write?c:h).push(r);return h.length?!1:(n.helper.data("droped",!0),c.length&&(n.helper.hide(),s.exec("duplicate",c)),void(d.length&&(n.helper.hide(),s.clipboard(d,!p),s.exec("paste",a,void 0,a).always(function(){s.clipboard([]),s.trigger("unlockfiles",{files:l})}),s.trigger("drop",{files:l}))))}},this.enabled=function(){return m&&this.visible()},this.visible=function(){return t[0].elfinder&&t.is(":visible")},this.isRoot=function(e){return!(!e.isroot&&e.phash)},this.root=function(t,n){t=t||b;var i,a;if(!n&&(e.each(s.roots,function(e,n){return 0===t.indexOf(e)?(i=n,!1):void 0}),i))return i;for(i=w[t];i&&i.phash&&(n||!i.isroot);)i=w[i.phash];if(i)return i.hash;for(;a in w&&w.hasOwnProperty(a);)if(i=w[a],!i.phash&&"directory"==!i.mime&&i.read)return i.hash;return""},this.cwd=function(){return w[b]||{}},this.option=function(t,n){var i;return n=n||b,s.optionsByHashes[n]&&"undefined"!=typeof s.optionsByHashes[n][t]?s.optionsByHashes[n][t]:b!==n?(i="",e.each(s.volOptions,function(e,a){return 0===n.indexOf(e)?(i=a[t]||"",!1):void 0}),i):y[t]||""},this.getDisabledCmds=function(t){var n=[];return e.isArray(t)||(t=[t]),e.each(t,function(t,i){var a=s.option("disabled",i);a&&e.each(a,function(t,i){-1===e.inArray(i,n)&&n.push(i)})}),n},this.file=function(e){return e?w[e]:void 0},this.files=function(){return e.extend(!0,{},w)},this.parents=function(e){for(var t,n=[];t=this.file(e);)n.unshift(t.hash),e=t.phash;return n},this.path2array=function(e,t){for(var n,i=[];e;){if(!(n=w[e])||!n.hash){i=[];break}i.unshift(t&&n.i18?n.i18:n.name),e=n.isroot?null:n.phash}return i},this.path=function(t,n,i){var a=w[t]&&w[t].path?w[t].path:this.path2array(t,n).join(y.separator);if(i&&w[t]){i=e.extend({notify:{type:"parents",cnt:1,hideCnt:!0}},i);var r,o=e.Deferred(),l=i.notify,d=!1,c=function(){s.request({data:{cmd:"parents",target:w[t].phash},notify:l,preventFail:!0}).done(u).fail(function(){o.reject()})},u=function(){s.one("parentsdone",function(){a=s.path(t,n),""===a&&d?(d=!1,c()):(l&&(clearTimeout(r),l.cnt=-parseInt(l.cnt||0),s.notify(l)),o.resolve(a))})};return a?o.resolve(a):(s.ui.tree?(l&&(r=setTimeout(function(){s.notify(l)},s.notifyDelay)),d=!0,u(!0)):c(),o)}return a},this.url=function(t){var n,i=w[t];if(!i||!i.read)return"";if("1"==i.url&&this.request({data:{cmd:"url",target:t},preventFail:!0,options:{async:!1}}).done(function(e){i.url=e.url||""}).fail(function(){i.url=""}),i.url)return i.url;if(n=0===i.hash.indexOf(s.cwd().volumeid)?y.url:this.option("url",i.hash))return n+e.map(this.path2array(t),function(e){return encodeURIComponent(e)}).slice(1).join("/");var a=e.extend({},this.customData,{cmd:"file",target:i.hash});return this.oldAPI&&(a.cmd="open",a.current=i.phash),this.options.url+(-1===this.options.url.indexOf("?")?"?":"&")+e.param(a,!0)},this.openUrl=function(t,n){var i=w[t],a="";if(!i||!i.read)return"";if(!n)if(i.url){if(1!=i.url)return i.url}else if(y.url&&0===i.hash.indexOf(s.cwd().volumeid))return y.url+e.map(this.path2array(t),function(e){return encodeURIComponent(e)}).slice(1).join("/");return a=this.options.url,a=a+(-1===a.indexOf("?")?"?":"&")+(this.oldAPI?"cmd=open&current="+i.phash:"cmd=file")+"&target="+i.hash,n&&(a+="&download=1"),e.each(this.options.customData,function(e,t){a+="&"+encodeURIComponent(e)+"="+encodeURIComponent(t)}),a},this.tmb=function(t){var n,i,a="elfinder-cwd-bgurl",r="";return e.isPlainObject(t)&&(s.searchStatus.state&&0!==t.hash.indexOf(s.cwd().volumeid)?(n=s.option("tmbUrl",t.hash),i=s.option("tmbCrop",t.hash)):(n=y.tmbUrl,i=y.tmbCrop),i&&(a+=" elfinder-cwd-bgurl-crop"),"self"===n&&0===t.mime.indexOf("image/")?(r=s.openUrl(t.hash),a+=" elfinder-cwd-bgself"):(s.oldAPI||n)&&t&&t.tmb&&1!=t.tmb&&(r=n+t.tmb),r)?{url:r,className:a}:!1},this.selected=function(){return k.slice(0)},this.selectedFiles=function(){return e.map(k,function(t){return w[t]?e.extend({},w[t]):null})},this.fileByName=function(e,t){var n;for(n in w)if(w.hasOwnProperty(n)&&w[n].phash==t&&w[n].name==e)return w[n]},this.validResponse=function(e,t){return t.error||this.rules[this.rules[e]?e:"defaults"](t)},this.returnBytes=function(e){var t;return isNaN(e)?(e||(e=""),e=e.replace(/b$/i,""),t=e.charAt(e.length-1).toLowerCase(),e=e.replace(/[tgmk]$/i,""),"t"==t?e=1024*e*1024*1024*1024:"g"==t?e=1024*e*1024*1024:"m"==t?e=1024*e*1024:"k"==t&&(e=1024*e),e=isNaN(e)?0:parseInt(e)):(e=parseInt(e),1>e&&(e=0)),e},this.request=function(t){var n,i,a,r=this,o=this.options,s=e.Deferred(),l=e.extend({},o.customData,{mimes:o.onlyMimes},t.data||t),d=l.cmd,c="open"===d,u=!(t.preventDefault||t.preventFail),h=!(t.preventDefault||t.preventDone),p=e.extend({},t.notify),f=!!t.cancel,m=!!t.raw,g=t.syncOnFail,v=!!t.lazy,w=t.prepare,k=e.extend({url:o.url,async:!0,type:this.requestType,dataType:"json",cache:!1,data:l,headers:this.customHeaders,xhrFields:this.xhrFields},t.options||{}),x=function(e){e.warning&&r.error(e.warning),c&&P(e),r.lazy(function(){e.removed&&e.removed.length&&r.remove(e),e.added&&e.added.length&&r.add(e),e.changed&&e.changed.length&&r.change(e)}).then(function(){return r.lazy(function(){r.trigger(d,e)})}).then(function(){return r.lazy(function(){r.trigger(d+"done")})}).then(function(){e.sync&&r.sync()})},C=function(e,t){var n,i;switch(t){case"abort":n=e.quiet?"":["errConnect","errAbort"];break;case"timeout":n=["errConnect","errTimeout"];break;case"parsererror":n=["errResponse","errDataNotJSON"],e.responseText&&(r.debug("backend-debug",{debug:{phpErrors:[e.responseText]}}),b||e.responseText&&n.push(e.responseText));break;default:if(e.responseText)try{i=JSON.parse(e.responseText),i&&i.error&&(n=i.error)}catch(a){}if(!n)if(403==e.status)n=["errConnect","errAccess","HTTP error "+e.status];else if(404==e.status)n=["errConnect","errNotFound","HTTP error "+e.status];else{if(414==e.status&&"get"===k.type)return k.type="post",void(s.xhr=e=r.transport.send(k).fail(n).done(T));n=e.quiet?"":["errConnect","HTTP error "+e.status]}}r.trigger(d+"done"),s.reject(n,e,t)},T=function(t){if(r.currentReqCmd=d,m)return t&&t.debug&&r.debug("backend-debug",t),s.resolve(t);if(!t)return s.reject(["errResponse","errDataEmpty"],i,t);if(!e.isPlainObject(t))return s.reject(["errResponse","errDataNotJSON"],i,t);if(t.error)return s.reject(t.error,i,t);if(!r.validResponse(d,t))return s.reject("errResponse",i,t);var n=function(){var n=function(n){r.leafRoots[l.target]&&t[n]&&e.each(r.leafRoots[l.target],function(e,i){var a;(a=r.file(i))&&t[n].push(a)})};c?n("files"):"tree"===d&&n("tree"),t=r.normalize(t),r.api||(r.api=t.api||1,"2.0"==r.api&&"undefined"!=typeof t.options.uploadMaxSize&&(r.api="2.1"),r.newAPI=r.api>=2,r.oldAPI=!r.newAPI),t.options&&(y=e.extend({},y,t.options)),t.netDrivers&&(r.netDrivers=t.netDrivers),t.maxTargets&&(r.maxTargets=t.maxTargets),c&&l.init&&(r.uplMaxSize=r.returnBytes(t.uplMaxSize),r.uplMaxFile=t.uplMaxFile?parseInt(t.uplMaxFile):20),"function"==typeof w&&w(t),s.resolve(t),t.debug&&r.debug("backend-debug",t)};v?r.lazy(n):n()},z=function(e){if(r.trigger(d+"done"),"autosync"==e.type){if("stop"!=e.data.action)return}else if(!("unload"==e.type||"destroy"==e.type||"openxhrabort"==e.type||e.data.added&&e.data.added.length))return;"pending"==i.state()&&(i.quiet=!0,i.abort(),"unload"!=e.type&&"destroy"!=e.type&&r.autoSync())},S=function(){if(s.fail(function(e,t,n){r.trigger(d+"fail",n),e&&(u?r.error(e):r.debug("error",r.i18n(e))),g&&r.sync()}),!d)return g=!1,s.reject("errCmdReq");if(r.maxTargets&&l.targets&&l.targets.length>r.maxTargets)return g=!1,s.reject(["errMaxTargets",r.maxTargets]);if(h&&s.done(x),p.type&&p.cnt&&(f&&(p.cancel=s),n=setTimeout(function(){r.notify(p),s.always(function(){p.cnt=-(parseInt(p.cnt)||0),r.notify(p)})},r.notifyDelay),s.always(function(){clearTimeout(n)})),c){for(;a=A.pop();)"pending"==a.state()&&(a.quiet=!0,a.abort());if(b!==l.target)for(;a=I.pop();)"pending"==a.state()&&(a.quiet=!0,a.abort())}return-1!==e.inArray(d,(r.cmdsToAdd+" autosync").split(" "))&&("autosync"!==d&&(r.autoSync("stop"),s.always(function(){r.autoSync()})),r.trigger("openxhrabort")),delete k.preventFail,s.xhr=i=r.transport.send(k).fail(C).done(T),c||l.compare&&"info"===d?(A.unshift(i),l.compare&&r.bind(r.cmdsToAdd+" autosync openxhrabort",z),s.always(function(){var t=e.inArray(i,A);l.compare&&r.unbind(r.cmdsToAdd+" autosync openxhrabort",z),-1!==t&&A.splice(t,1)})):-1!==e.inArray(d,r.abortCmdsOnOpen)&&(I.unshift(i),s.always(function(){var t=e.inArray(i,I);-1!==t&&I.splice(t,1)})),r.bind("unload destroy",z),s.always(function(){r.unbind("unload destroy",z)}),s},U={opts:t,result:!0};return r.trigger("request."+d,U,!0),U.result?"object"==typeof U.result&&U.result.promise?(U.result.done(S).fail(function(){r.trigger(d+"done"),s.reject()}),s):S():(r.trigger(d+"done"),s.reject())},this.diff=function(t,n,i){var a={},r=[],o=[],s=[],l=function(e){for(var t=s.length;t--;)if(s[t].hash==e)return!0};return e.each(t,function(e,t){a[t.hash]=t}),e.each(w,function(e,t){a[e]||n&&t.phash!==n||o.push(e)}),e.each(a,function(t,n){var a=w[t];a?e.each(n,function(t){return i&&-1!==e.inArray(t,i)||n[t]===a[t]?void 0:(s.push(n),!1)}):r.push(n)}),e.each(o,function(t,n){var i=w[n],r=i.phash;r&&"directory"==i.mime&&-1===e.inArray(r,o)&&a[r]&&!l(r)&&s.push(a[r])}),{added:r,removed:o,changed:s}},this.sync=function(t,n){this.autoSync("stop");var i=this,a=function(){var i="",a=0,r=0;return t&&n&&e.each(w,function(e,n){n.phash&&n.phash===t&&(++a,r=Math.max(r,n.ts)),i=a+":"+r}),i},r=a(),o=e.Deferred().done(function(){i.trigger("sync")}),s=[this.request({data:{cmd:"open",reload:1,target:b,tree:!t&&this.ui.tree?1:0,compare:r},preventDefault:!0})],l=function(){for(var e,t=[],n=i.file(i.root(b)),a=n?n.volumeid:null,r=i.cwd().phash;r;)(e=i.file(r))?(0!==r.indexOf(a)&&(i.isRoot(e)||t.push({target:r,cmd:"tree"}),t.push({target:r,cmd:"parents"}),n=i.file(i.root(r)),a=n?n.volumeid:null),r=e.phash):r=null;return t};return t||(b!==this.root()&&s.push(this.request({data:{cmd:"parents",target:b},preventDefault:!0})),e.each(l(),function(e,t){s.push(i.request({data:{cmd:t.cmd,target:t.target},preventDefault:!0}))})),e.when.apply(e,s).fail(function(t,a){n&&-1===e.inArray("errOpen",t)?o.reject(t&&0!=a.status?t:void 0):(o.reject(t),t&&i.request({data:{cmd:"open",target:i.lastDir("")||i.root(),tree:1,init:1},notify:{type:"open",cnt:1,hideCnt:!0}}))}).done(function(e){var n,a,s;if(e.cwd.compare&&r===e.cwd.compare)return o.reject();if(n={tree:[]},a=arguments.length,a>1)for(s=1;a>s;s++)arguments[s].tree&&arguments[s].tree.length&&n.tree.push.apply(n.tree,arguments[s].tree);i.api<2.1&&(n.tree=(n.tree||[]).push(e.cwd)),e=i.normalize(e),n=i.normalize(n);var l=i.diff(e.files.concat(n&&n.tree?n.tree:[]),t);return l.added.push(e.cwd),l.removed.length&&i.remove(l),l.added.length&&i.add(l),l.changed.length&&i.change(l),o.resolve(l)}).always(function(){i.autoSync()}),o},this.upload=function(e){return this.transport.upload(e,this)},this.bind=function(e,t){var n;if("function"==typeof t)for(e=(""+e).toLowerCase().split(/\s+/),n=0;n<e.length;n++)void 0===x[e[n]]&&(x[e[n]]=[]),x[e[n]].push(t);return this},this.unbind=function(t,n){var i,a,r;for(t=(""+t).toLowerCase().split(/\s+/),i=0;i<t.length;i++)a=x[t[i]]||[],r=e.inArray(n,a),r>-1&&a.splice(r,1);return n=null,this},this.trigger=function(t,n,i){var a,r,o,t=t.toLowerCase(),s="open"===t,l=x[t]||[];if(this.debug("event-"+t,n),s&&!i&&(o=JSON.stringify(n)),r=l.length)for(t=e.Event(t),i&&(t.data=n),a=0;r>a;a++)if(l[a]){l[a].length&&(i||(t.data=s?JSON.parse(o):e.extend(!0,{},n)));try{if(l[a](t,this)===!1||t.isDefaultPrevented()){this.debug("event-stoped",t.type);break}}catch(d){window.console&&window.console.log&&window.console.log(d)}}return this},this.getListeners=function(e){return e?x[e.toLowerCase()]:x},this.shortcut=function(t){var n,i,a,r,o;if(this.options.allowShortcuts&&t.pattern&&e.isFunction(t.callback))for(n=t.pattern.toUpperCase().split(/\s+/),r=0;r<n.length;r++)i=n[r],o=i.split("+"),a=1==(a=o.pop()).length?a>0?a:a.charCodeAt(0):a>0?a:e.ui.keyCode[a],a&&!C[i]&&(C[i]={keyCode:a,altKey:-1!=e.inArray("ALT",o),ctrlKey:-1!=e.inArray("CTRL",o),shiftKey:-1!=e.inArray("SHIFT",o),type:t.type||"keydown",callback:t.callback,description:t.description,pattern:i});return this},this.shortcuts=function(){var t=[];return e.each(C,function(e,n){t.push([n.pattern,s.i18n(n.description)])}),t},this.clipboard=function(t,n){var i=function(){return e.map(T,function(e){return e.hash})};return void 0!==t&&(T.length&&this.trigger("unlockfiles",{files:i()}),z=[],T=e.map(t||[],function(e){var t=w[e];return t?(z.push(e),{hash:e,phash:t.phash,name:t.name,mime:t.mime,read:t.read,locked:t.locked,cut:!!n}):null}),this.trigger("changeclipboard",{clipboard:T.slice(0,T.length)}),n&&this.trigger("lockfiles",{files:i()})),T.slice(0,T.length)},this.isCommandEnabled=function(t,n){var i,a=s.cwd().volumeid||"";return!n||a&&0===n.indexOf(a)?i=y.disabled:(i=s.option("disabled",n),i||(i=[])),this._commands[t]?-1===e.inArray(t,i):!1},this.exec=function(t,n,i,a){return"open"===t&&((this.searchStatus.state||this.searchStatus.ininc)&&this.trigger("searchend",{noupdate:!0}),this.autoSync("stop")),this._commands[t]&&this.isCommandEnabled(t,a)?this._commands[t].exec(n,i):e.Deferred().reject("No such command")},this.dialog=function(n,i){var a=e("<div/>").append(n).appendTo(t).elfinderdialog(i,this),r=a.closest(".ui-dialog"),o=function(){!a.data("draged")&&a.is(":visible")&&a.elfinderdialog("posInit")};return r.length&&(s.bind("resize",o),r.on("remove",function(){s.unbind("resize",o)})),a},this.toast=function(t){return e('<div class="ui-front"/>').appendTo(this.ui.toast).elfindertoast(t||{},this)},this.getUI=function(e){return this.ui[e]||t},this.getCommand=function(e){return void 0===e?this._commands:this._commands[e]},this.resize=function(e,n){t.css("width",e).height(n).trigger("resize"),this.trigger("resize",{width:t.width(),height:t.height()})},this.restoreSize=function(){this.resize(U,M)},this.show=function(){t.show(),this.enable().trigger("show")},this.hide=function(){this.options.enableAlways&&(g=m,m=!1),this.disable().trigger("hide"),t.hide()},this.lazy=function(n,i,a){var r=function(e){var n,i=t.data("lazycnt");e?(n=t.data("lazyrepaint")?!1:a.repaint,i?t.data("lazycnt",++i):t.data("lazycnt",1).addClass("elfinder-processing"),n&&t.data("lazyrepaint",!0).css("display")):i&&i>1?t.data("lazycnt",--i):(n=t.data("lazyrepaint"),t.data("lazycnt",0).removeData("lazyrepaint").removeClass("elfinder-processing"),n&&t.css("display"),s.trigger("lazydone"))},o=e.Deferred();return i=i||0,a=a||{},r(!0),setTimeout(function(){o.resolve(n.call(o)),r(!1)},i),o},this.destroy=function(){t&&t[0].elfinder&&(this.options.syncStart=!1,this.autoSync("forcestop"),this.trigger("destroy").disable(),T=[],k=[],x={},C={},e(window).off("."+u),e(document).off("."+u),s.trigger=function(){},t.off(),t.removeData(),t.empty(),t[0].elfinder=null,e(D).remove(),t.append(l.contents()).removeClass(this.cssClass).attr("style",d))},this.autoSync=function(t){var n;if(s.options.sync>=1e3){if(a&&(clearTimeout(a),a=null,s.trigger("autosync",{action:"stop"})),"stop"===t?++F:F=Math.max(0,--F),F||"forcestop"===t||!s.options.syncStart)return;n=function(t){var i;y.syncMinMs&&(t||a)&&(t&&s.trigger("autosync",{action:"start"}),i=Math.max(s.options.sync,y.syncMinMs),a&&clearTimeout(a),a=setTimeout(function(){var t,r=!0,o=b;y.syncChkAsTs&&(t=w[o].ts)?s.request({data:{cmd:"info",targets:[o],compare:t,reload:1},preventDefault:!0}).done(function(e){var i;r=!0,e.compare&&(i=e.compare,i==t&&(r=!1)),r?s.sync(o).always(function(){i&&(w[o].ts=i),n()}):n()}).fail(function(t,r){t&&0!=r.status?(s.error(t),-1!==e.inArray("errOpen",t)&&s.request({data:{cmd:"open",target:s.lastDir("")||s.root(),tree:1,init:1},notify:{type:"open",cnt:1,hideCnt:!0}})):a=setTimeout(function(){n()},i)}):s.sync(b,!0).always(function(){n()})},i))},n(!0)}},this.insideWorkzone=function(e,t,n){var i=this.getUI("workzone").data("rectangle");return n=n||1,!(e<i.left+n||e>i.left+i.width+n||t<i.top+n||t>i.top+i.height+n)},this.toFront=function(n){var i=t.children(":last");n=e(n),i.get(0)!==n.get(0)&&i.after(n)},this.getMaximizeCss=function(){return{width:"100%",height:"100%",margin:0,padding:0,top:0,left:0,display:"block",position:"fixed",zIndex:Math.max(s.zIndex?s.zIndex+1:0,1e3)}},function(){N&&s.UA.Fullscreen&&(s.UA.Fullscreen=!1,q&&"undefined"!=typeof q.attr("allowfullscreen")&&(s.UA.Fullscreen=!0));var n,i,a,r="elfinder-fullscreen",o="elfinder-fullscreen-native",l=function(){var n=0,i=0;e.each(t.children(".ui-dialog,.ui-draggable"),function(t,a){var r=e(a),o=r.position();o.top<0&&(r.css("top",n),n+=20),o.left<0&&(r.css("left",i),i+=20)})},d=s.UA.Fullscreen?{fullElm:function(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement||null},exitFull:function(){return document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen?document.msExitFullscreen():void 0},toFull:function(e){return e.requestFullscreen?e.requestFullscreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.msRequestFullscreen?e.msRequestFullscreen():!1}}:{fullElm:function(){var e;return t.hasClass(r)?t.get(0):(e=t.find("."+r),e.length?e.get(0):null)},exitFull:function(){var t;e(window).off("resize."+u,h),void 0!==i&&e("body").css("overflow",i),i=void 0,n&&(t=n.elm,c(t),e(t).trigger("resize",{fullscreen:"off"})),e(window).trigger("resize")},toFull:function(t){return i=e("body").css("overflow")||"",e("body").css("overflow","hidden"),e(t).css(s.getMaximizeCss()).addClass(r).trigger("resize",{fullscreen:"on"}),l(),e(window).on("resize."+u,h).trigger("resize"),!0}},c=function(t){n&&n.elm==t&&(e(t).removeClass(r+" "+o).attr("style",n.style),n=null)},h=function(t){var n;t.target===window&&(a&&clearTimeout(a),a=setTimeout(function(){(n=d.fullElm())&&e(n).trigger("resize",{fullscreen:"on"})},100))};e(document).on("fullscreenchange."+u+" webkitfullscreenchange."+u+" mozfullscreenchange."+u+" MSFullscreenChange."+u,function(t){if(s.UA.Fullscreen){var i=d.fullElm(),p=e(window);a&&clearTimeout(a),null===i?(p.off("resize."+u,h),n&&(i=n.elm,c(i),e(i).trigger("resize",{fullscreen:"off"}))):(e(i).addClass(r+" "+o).attr("style","width:100%; height:100%; margin:0; padding:0;").trigger("resize",{fullscreen:"on"}),p.on("resize."+u,h),l()),p.trigger("resize")}}),s.toggleFullscreen=function(t,i){var a=e(t).get(0),r=null;if(r=d.fullElm()){if(r==a){if(i===!0)return r}else if(i===!1)return r;return d.exitFull(),null}return i===!1?null:(n={elm:a,style:e(a).attr("style")},d.toFull(a)!==!1?a:(n=null,null))}}(),function(){var t,n="elfinder-maximized",i=function(e){if(e.target===window&&e.data&&e.data.elm){var n=e.data.elm;t&&clearTimeout(t),t=setTimeout(function(){n.trigger("resize",{maximize:"on"})},100)}},a=function(t){e(window).off("resize."+u,i),e("body").css("overflow",t.data("bodyOvf")),t.removeClass(n).attr("style",t.data("orgStyle")).removeData("bodyOvf").removeData("orgStyle"),t.trigger("resize",{maximize:"off"})},r=function(t){t.data("bodyOvf",e("body").css("overflow")||"").data("orgStyle",t.attr("style")).addClass(n).css(s.getMaximizeCss()),e("body").css("overflow","hidden"),e(window).on("resize."+u,{elm:t},i).trigger("resize")};s.toggleMaximize=function(t,i){var o=e(t),s=o.hasClass(n);if(s){if(i===!0)return;a(o)}else{if(i===!1)return;r(o)}}}(),e.fn.selectable&&e.fn.draggable&&e.fn.droppable?t.length?this.options.url?(e.extend(e.ui.keyCode,{F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,CONTEXTMENU:93}),this.dragUpload=!1,this.xhrUpload=("undefined"!=typeof XMLHttpRequestUpload||"undefined"!=typeof XMLHttpRequestEventTarget)&&"undefined"!=typeof File&&"undefined"!=typeof FormData,this.transport={},"object"==typeof this.options.transport&&(this.transport=this.options.transport,"function"==typeof this.transport.init&&this.transport.init(this)),"function"!=typeof this.transport.send&&(this.transport.send=function(t){
return e.ajax(t)}),"iframe"==this.transport.upload?this.transport.upload=e.proxy(this.uploads.iframe,this):"function"==typeof this.transport.upload?this.dragUpload=!!this.options.dragUploadAllow:this.xhrUpload&&this.options.dragUploadAllow?(this.transport.upload=e.proxy(this.uploads.xhr,this),this.dragUpload=!0):this.transport.upload=e.proxy(this.uploads.iframe,this),this.decodeRawString=e.isFunction(this.options.rawStringDecoder)?this.options.rawStringDecoder:function(e){var t=function(e){var t,n,i;for(t=0,n=e.length,i=[];n>t;t++)i.push(e.charCodeAt(t));return i},n=function(e){var n,i,a,r=[];for("string"==typeof e&&(e=t(e)),n=0,i=e.length;a=e[n],i>n;n++)a>=55296&&56319>=a?r.push((1023&a)+64<<10|1023&e[++n]):r.push(a);return r},i=function(e){var t,n,i,a,r=String.fromCharCode;for(t=0,n=e.length,a="";i=e[t],n>t;t++)a+=127>=i?r(i):223>=i&&i>=194?r((31&i)<<6|63&e[++t]):239>=i&&i>=224?r((15&i)<<12|(63&e[++t])<<6|63&e[++t]):247>=i&&i>=240?r(55296|((7&i)<<8|(63&e[++t])<<2|e[++t]>>>4&3)-64,56320|(15&e[t++])<<6|63&e[t]):r(65533);return a};return i(n(e))},this.error=function(){var e=arguments[0],t=arguments[1]||null;return 1==arguments.length&&"function"==typeof e?s.bind("error",e):e===!0?this:s.trigger("error",{error:e,opts:t})},e.each(v,function(t,n){s[n]=function(){var t=arguments[0];return 1==arguments.length&&"function"==typeof t?s.bind(n,t):s.trigger(n,e.isPlainObject(t)?t:{})}}),this.enable(function(){!m&&s.visible()&&s.ui.overlay.is(":hidden")&&!t.children(".elfinder-dialog").find("."+s.res("class","editing")).length&&(m=!0,document.activeElement&&document.activeElement.blur(),t.removeClass("elfinder-disabled"))}).disable(function(){g=m,m=!1,t.addClass("elfinder-disabled")}).open(function(){k=[]}).select(function(t){var n=0,i=[];k=e.map(t.data.selected||t.data.value||[],function(e){return i.length||s.maxTargets&&++n>s.maxTargets?(i.push(e),null):w[e]?e:null}),i.length&&(s.trigger("unselectfiles",{files:i,inselect:!0}),s.toast({mode:"warning",msg:s.i18n(["errMaxTargets",s.maxTargets])}))}).error(function(t){var n={cssClass:"elfinder-dialog-error",title:s.i18n(s.i18n("error")),resizable:!1,destroyOnClose:!0,buttons:{}};n.buttons[s.i18n(s.i18n("btnClose"))]=function(){e(this).elfinderdialog("close")},t.data.opts&&e.isPlainObject(t.data.opts)&&e.extend(n,t.data.opts),s.dialog('<span class="elfinder-dialog-icon elfinder-dialog-icon-error"/>'+s.i18n(t.data.error),n)}).bind("tree parents",function(e){R(e.data.tree||[])}).bind("tmb",function(t){e.each(t.data.images||[],function(e,t){w[e]&&(w[e].tmb=t)})}).add(function(e){R(e.data.added||[])}).change(function(t){e.each(t.data.changed||[],function(t,n){var i=n.hash;w[i]&&e.each(["locked","hidden","width","height"],function(e,t){w[i][t]&&!n[t]&&delete w[i][t]}),w[i]=w[i]?e.extend(w[i],n):n})}).remove(function(t){var n=t.data.removed||[],i=n.length,a={},r=function(t){var n=w[t];n&&("directory"===n.mime&&(a[t]&&delete s.roots[a[t]],e.each(w,function(e,n){n.phash==t&&r(e)})),delete w[t])};for(e.each(s.roots,function(e,t){a[t]=e});i--;)r(n[i])}).bind("searchstart",function(t){e.extend(s.searchStatus,t.data),s.searchStatus.state=1}).bind("search",function(e){s.searchStatus.state=2,R(e.data.files||[])}).bind("searchend",function(){s.searchStatus.state=0,s.searchStatus.mixed=!1}),!0===this.options.sound&&this.bind("rm",function(t){var n=D.canPlayType&&D.canPlayType('audio/wav; codecs="1"');n&&""!=n&&"no"!=n&&e(D).html('<source src="'+O+'rm.wav" type="audio/wav">')[0].play()}),e.each(this.options.handlers,function(e,t){s.bind(e,t)}),this.history=new this.history(this),this.commands.getfile&&("function"==typeof this.options.getFileCallback?(this.bind("dblclick",function(e){e.preventDefault(),s.exec("getfile").fail(function(){s.exec("open")})}),this.shortcut({pattern:"enter",description:this.i18n("cmdgetfile"),callback:function(){s.exec("getfile").fail(function(){s.exec("mac"==s.OS?"rename":"open")})}}).shortcut({pattern:"ctrl+enter",description:this.i18n("mac"==this.OS?"cmdrename":"cmdopen"),callback:function(){s.exec("mac"==s.OS?"rename":"open")}})):this.options.getFileCallback=null),this.roots={},this.leafRoots={},this._commands={},e.isArray(this.options.commands)||(this.options.commands=[]),-1!==e.inArray("*",this.options.commands)&&(this.options.commands=Object.keys(this.commands)),e.each(this.commands,function(t,n){var i,a,r=e.extend({},n.prototype);if(e.isFunction(n)&&!s._commands[t]&&(n.prototype.forceLoad||-1!==e.inArray(t,s.options.commands))){if(i=n.prototype.extendsCmd||""){if(!e.isFunction(s.commands[i]))return!0;n.prototype=e.extend({},S,new s.commands[i],n.prototype)}else n.prototype=e.extend({},S,n.prototype);s._commands[t]=new n,n.prototype=r,a=s.options.commandsOptions[t]||{},i&&s.options.commandsOptions[i]&&(a=e.extend(!0,{},s.options.commandsOptions[i],a)),s._commands[t].setup(t,a),s._commands[t].linkedCmds.length&&e.each(s._commands[t].linkedCmds,function(t,n){var i=s.commands[n];e.isFunction(i)&&!s._commands[n]&&(i.prototype=S,s._commands[n]=new i,s._commands[n].setup(n,s.options.commandsOptions[n]||{}))})}}),this.commandMap={},this.volOptions={},this.optionsByHashes={},t.addClass(this.cssClass).on(h,function(){!m&&s.enable()}),this.ui={workzone:e("<div/>").appendTo(t).elfinderworkzone(this),navbar:e("<div/>").appendTo(t).elfindernavbar(this,this.options.uiOptions.navbar||{}),contextmenu:e("<div/>").appendTo(t).elfindercontextmenu(this),overlay:e("<div/>").appendTo(t).elfinderoverlay({show:function(){s.disable()},hide:function(){g&&s.enable()}}),cwd:e("<div/>").appendTo(t).elfindercwd(this,this.options.uiOptions.cwd||{}),notify:this.dialog("",{cssClass:"elfinder-dialog-notify",position:this.options.notifyDialog.position,absolute:!0,resizable:!1,autoOpen:!1,closeOnEscape:!1,title:"&nbsp;",width:parseInt(this.options.notifyDialog.width)}),statusbar:e('<div class="ui-widget-header ui-helper-clearfix ui-corner-bottom elfinder-statusbar"/>').hide().appendTo(t),toast:e('<div class="elfinder-toast"/>').appendTo(t),bottomtray:e('<div class="elfinder-bottomtray">').appendTo(t)},this.uiAutoHide=[],this.one("open",function(){s.uiAutoHide.length&&setTimeout(function(){s.trigger("uiautohide")},500)}),this.bind("uiautohide",function(){s.uiAutoHide.length&&s.uiAutoHide.shift()()}),e.each(this.options.ui||[],function(n,i){var a="elfinder"+i,r=s.options.uiOptions[i]||{};!s.ui[i]&&e.fn[a]&&(s.ui[i]=e("<"+(r.tag||"div")+"/>").appendTo(t),s.ui[i][a](s,r))}),t[0].elfinder=this,this.options.resizable&&e.fn.resizable&&t.resizable({resize:function(e,t){s.resize(t.size.width,t.size.height)},handles:"se",minWidth:300,minHeight:200}),this.options.width&&(U=this.options.width),this.options.height&&(M=parseInt(this.options.height)),this.options.soundPath&&(O=this.options.soundPath.replace(/\/+$/,"")+"/"),s.resize(U,M),e(document).on("click."+u,function(n){m&&!s.options.enableAlways&&!e(n.target).closest(t).length&&s.disable()}).on(p+" "+f,j),s.options.useBrowserHistory&&e(window).on("popstate."+u,function(t){var n=t.originalEvent.state&&t.originalEvent.state.thash;n&&!e.isEmptyObject(s.files())&&s.request({data:{cmd:"open",target:n,onhistory:1},notify:{type:"open",cnt:1,hideCnt:!0},syncOnFail:!0})}),function(){var n;e(window).on("resize."+u,function(e){e.target===this&&(n&&clearTimeout(n),n=setTimeout(function(){s.trigger("resize",{width:t.width(),height:t.height()})},100))}).on("beforeunload."+u,function(n){var i,a;return t.is(":visible")&&(s.ui.notify.children().length&&-1!==e.inArray("hasNotifyDialog",s.options.windowCloseConfirm)?i=s.i18n("ntfsmth"):t.find("."+s.res("class","editing")).length&&-1!==e.inArray("editingFile",s.options.windowCloseConfirm)?i=s.i18n("editingFile"):(a=Object.keys(s.selected()).length)&&-1!==e.inArray("hasSelectedItem",s.options.windowCloseConfirm)?i=s.i18n("hasSelected",""+a):(a=Object.keys(s.clipboard()).length)&&-1!==e.inArray("hasClipboardData",s.options.windowCloseConfirm)&&(i=s.i18n("hasClipboard",""+a)),i)?(n.returnValue=i,i):void s.trigger("unload")})}(),e(window).on("message."+u,function(e){var t,n,i=e.originalEvent||null;if(i&&0===s.uploadURL.indexOf(i.origin))try{t=JSON.parse(i.data),n=t.data||null,n&&(n.error?(t.bind&&s.trigger(t.bind+"fail",n),s.error(n.error)):(n.warning&&s.error(n.warning),n.removed&&n.removed.length&&s.remove(n),n.added&&n.added.length&&s.add(n),n.changed&&n.changed.length&&s.change(n),t.bind&&(s.trigger(t.bind,n),s.trigger(t.bind+"done")),n.sync&&s.sync()))}catch(e){s.sync()}}),s.options.enableAlways?(e(window).on("focus."+u,function(e){e.target===this&&s.enable()}),N&&e(window.top).on("focus."+u,function(){!s.enable()||q&&!q.is(":visible")||setTimeout(function(){e(window).focus()},10)})):N&&e(window).on("blur."+u,function(e){m&&e.target===this&&s.disable()}),function(){var e=s.getUI("navbar"),t=s.getUI("cwd").parent();s.autoScroll={navbarUp:function(t){e.scrollTop(Math.max(0,e.scrollTop()-t))},navbarDown:function(t){e.scrollTop(e.scrollTop()+t)},cwdUp:function(e){t.scrollTop(Math.max(0,t.scrollTop()-e))},cwdDown:function(e){t.scrollTop(t.scrollTop()+e)}}}(),s.dragUpload&&!function(){var n,i,a=function(t){return"TEXTAREA"!==t.target.nodeName&&"INPUT"!==t.target.nodeName&&0===e(t.target).closest("div.ui-dialog-content").length},r="native-drag-enter",o="native-drag-disable",l="class",d=s.res(l,"navdir"),u=(s.res(l,"droppable"),s.res(l,"adroppable"),s.res(l,"navarrow"),s.res(l,"adroppable")),h=s.getUI("workzone"),p="ltr"===s.direction,f=function(){i&&clearTimeout(i),i=null};t.on("dragenter",function(e){f(),a(e)&&(e.preventDefault(),e.stopPropagation(),n=h.data("rectangle"))}).on("dragleave",function(e){f(),a(e)&&(e.preventDefault(),e.stopPropagation())}).on("dragover",function(e){var t;a(e)?(e.preventDefault(),e.stopPropagation(),e.originalEvent.dataTransfer.dropEffect="none",i||(i=setTimeout(function(){var a,r=n.top+n.height;((t=e.pageY<n.top)||e.pageY>r)&&(a=n.cwdEdge>e.pageX?(p?"navbar":"cwd")+(t?"Up":"Down"):(p?"cwd":"navbar")+(t?"Up":"Down"),s.autoScroll[a](Math.pow(t?n.top-e.pageY:e.pageY-r,1.3))),i=null},20))):f()}).on("drop",function(e){f(),a(e)&&(e.stopPropagation(),e.preventDefault())}),t.on("dragenter",".native-droppable",function(t){if(t.originalEvent.dataTransfer){var n,i=e(t.currentTarget),a=t.currentTarget.id||null,l=null;if(!a){l=s.cwd(),i.data(o,!1);try{e.each(t.originalEvent.dataTransfer.types,function(e,t){"elfinderfrom:"===t.substr(0,13)&&(n=t.substr(13).toLowerCase())})}catch(t){}}l&&(!l.write||n&&n===(window.location.href+l.hash).toLowerCase())?i.data(o,!0):(t.preventDefault(),t.stopPropagation(),i.data(r,!0),i.addClass(u))}}).on("dragleave",".native-droppable",function(t){if(t.originalEvent.dataTransfer){var n=e(t.currentTarget);t.preventDefault(),t.stopPropagation(),n.data(r)?n.data(r,!1):n.removeClass(u)}}).on("dragover",".native-droppable",function(t){if(t.originalEvent.dataTransfer){var n=e(t.currentTarget);t.preventDefault(),t.stopPropagation(),t.originalEvent.dataTransfer.dropEffect=n.data(o)?"none":"copy",n.data(r,!1)}}).on("drop",".native-droppable",function(t){if(t.originalEvent&&t.originalEvent.dataTransfer){var n=e(t.currentTarget);t.preventDefault(),t.stopPropagation(),n.removeClass(u),c=t.currentTarget.id?n.hasClass(d)?s.navId2Hash(t.currentTarget.id):s.cwdId2Hash(t.currentTarget.id):s.cwd().hash,t.originalEvent._target=c,s.exec("upload",{dropEvt:t.originalEvent,target:c},void 0,c)}})}(),s.UA.Touch&&!function(){var n,i,a,r,o,l,d,c,h=s.getUI("navbar"),p=s.getUI("toolbar"),f=function(e){e.preventDefault()},m=function(){e(document).off("touchmove",f)},g=50;t.on("touchstart touchmove touchend",function(v){if("touchend"===v.type)return n=!1,i=!1,void m();var b,y,w,k,x,C,T=v.originalEvent.touches||[{}],z=T[0].pageX||null,A=T[0].pageY||null,I="ltr"===s.direction;null===z||null===A||"touchstart"===v.type&&T.length>1||("touchstart"===v.type?(a=t.offset(),r=t.width(),h&&(n=!1,h.is(":hidden")?(c||(c=Math.max(50,r/10)),(I?z-a.left:r+a.left-z)<c&&(n=z)):(l=h.width(),y=Math.max.apply(Math,e.map(h.children(".elfinder-tree"),function(t){return e(t).width()})),w=I?z<a.left+l&&y-h.scrollLeft()-5<=l:z>a.left+r-l&&y+h.scrollLeft()-5<=l,w?(c=Math.max(50,r/10),n=z):n=!1)),p&&(d=p.height(),o=a.top,A-o<(p.is(":hidden")?g:d+30)?(i=A,e(document).on("touchmove."+u,f),setTimeout(function(){m()},500)):i=!1)):(h&&n!==!1&&(b=(I?n>z:z>n)?"navhide":"navshow",k=Math.abs(n-z),("navhide"===b&&k>.6*l||k>("navhide"===b?l/3:45)&&("navshow"===b||(I?z<a.left+20:z>a.left+r-20)))&&(s.getUI("navbar").trigger(b,{handleW:c}),n=!1)),p&&i!==!1&&(x=p.offset().top,Math.abs(i-A)>Math.min(45,d/3)&&(C=i>A?"slideUp":"slideDown",("slideDown"===C||x+20>A)&&(p.is("slideDown"===C?":hidden":":visible")&&(p.stop(!0,!0).trigger("toggle",{duration:100,handleH:g}),m()),i=!1)))))})}(),N&&t.on("click",function(t){e(window).focus()}),this.options.enableByMouseOver&&t.on("mouseenter",function(t){N&&e(window).focus(),!s.enabled()&&s.enable()}),this.options.cssAutoLoad||this.trigger("cssloaded"),void this.trigger("init").request({data:{cmd:"open",target:s.startDir(),init:1,tree:this.ui.tree?1:0},preventDone:!0,notify:{type:"open",cnt:1,hideCnt:!0},freeze:!0}).fail(function(){s.trigger("fail").disable().lastDir(""),x={},C={},e(document).add(t).off("."+u),s.trigger=function(){}}).done(function(n){var i=t.css("z-index");i&&"auto"!==i&&"inherit"!==i?s.zIndex=i:t.parents().each(function(t,n){var i=e(n).css("z-index");return"auto"!==i&&"inherit"!==i&&(i=parseInt(i))?(s.zIndex=i,!1):void 0}),s.load().debug("api",s.api),t.trigger("resize"),P(n),s.trigger("open",n),N&&s.options.enableAlways&&e(window).focus()})):alert(this.i18n("errURL")):alert(this.i18n("errNode")):alert(this.i18n("errJqui"))};("undefined"==typeof n||n)&&(window.elFinder=i),i.prototype={uniqueid:0,res:function(e,t){return this.resources[e]&&this.resources[e][t]},OS:-1!==navigator.userAgent.indexOf("Mac")?"mac":-1!==navigator.userAgent.indexOf("Win")?"win":"other",UA:function(){var e=!document.uniqueID&&!window.opera&&!window.sidebar&&window.localStorage&&"WebkitAppearance"in document.documentElement.style;return{ltIE6:"undefined"==typeof window.addEventListener&&"undefined"==typeof document.documentElement.style.maxHeight,ltIE7:"undefined"==typeof window.addEventListener&&"undefined"==typeof document.querySelectorAll,ltIE8:"undefined"==typeof window.addEventListener&&"undefined"==typeof document.getElementsByClassName,IE:document.uniqueID,Firefox:window.sidebar,Opera:window.opera,Webkit:e,Chrome:e&&window.chrome,Safari:e&&!window.chrome,Mobile:"undefined"!=typeof window.orientation,Touch:"undefined"!=typeof window.ontouchstart,iOS:navigator.platform.match(/^iP(?:[ao]d|hone)/),Fullscreen:"undefined"!=typeof(document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen)}}(),currentReqCmd:"",i18:{en:{translator:"",language:"English",direction:"ltr",dateFormat:"d.m.Y H:i",fancyDateFormat:"$1 H:i",messages:{}},months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["msJan","msFeb","msMar","msApr","msMay","msJun","msJul","msAug","msSep","msOct","msNov","msDec"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},kinds:{unknown:"Unknown",directory:"Folder",symlink:"Alias","symlink-broken":"AliasBroken","application/x-empty":"TextPlain","application/postscript":"Postscript","application/vnd.ms-office":"MsOffice","application/msword":"MsWord","application/vnd.ms-word":"MsWord","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"MsWord","application/vnd.ms-word.document.macroEnabled.12":"MsWord","application/vnd.openxmlformats-officedocument.wordprocessingml.template":"MsWord","application/vnd.ms-word.template.macroEnabled.12":"MsWord","application/vnd.ms-excel":"MsExcel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"MsExcel","application/vnd.ms-excel.sheet.macroEnabled.12":"MsExcel","application/vnd.openxmlformats-officedocument.spreadsheetml.template":"MsExcel","application/vnd.ms-excel.template.macroEnabled.12":"MsExcel","application/vnd.ms-excel.sheet.binary.macroEnabled.12":"MsExcel","application/vnd.ms-excel.addin.macroEnabled.12":"MsExcel","application/vnd.ms-powerpoint":"MsPP","application/vnd.openxmlformats-officedocument.presentationml.presentation":"MsPP","application/vnd.ms-powerpoint.presentation.macroEnabled.12":"MsPP","application/vnd.openxmlformats-officedocument.presentationml.slideshow":"MsPP","application/vnd.ms-powerpoint.slideshow.macroEnabled.12":"MsPP","application/vnd.openxmlformats-officedocument.presentationml.template":"MsPP","application/vnd.ms-powerpoint.template.macroEnabled.12":"MsPP","application/vnd.ms-powerpoint.addin.macroEnabled.12":"MsPP","application/vnd.openxmlformats-officedocument.presentationml.slide":"MsPP","application/vnd.ms-powerpoint.slide.macroEnabled.12":"MsPP","application/pdf":"PDF","application/xml":"XML","application/vnd.oasis.opendocument.text":"OO","application/vnd.oasis.opendocument.text-template":"OO","application/vnd.oasis.opendocument.text-web":"OO","application/vnd.oasis.opendocument.text-master":"OO","application/vnd.oasis.opendocument.graphics":"OO","application/vnd.oasis.opendocument.graphics-template":"OO","application/vnd.oasis.opendocument.presentation":"OO","application/vnd.oasis.opendocument.presentation-template":"OO","application/vnd.oasis.opendocument.spreadsheet":"OO","application/vnd.oasis.opendocument.spreadsheet-template":"OO","application/vnd.oasis.opendocument.chart":"OO","application/vnd.oasis.opendocument.formula":"OO","application/vnd.oasis.opendocument.database":"OO","application/vnd.oasis.opendocument.image":"OO","application/vnd.openofficeorg.extension":"OO","application/x-shockwave-flash":"AppFlash","application/flash-video":"Flash video","application/x-bittorrent":"Torrent","application/javascript":"JS","application/rtf":"RTF","application/rtfd":"RTF","application/x-font-ttf":"TTF","application/x-font-otf":"OTF","application/x-rpm":"RPM","application/x-web-config":"TextPlain","application/xhtml+xml":"HTML","application/docbook+xml":"DOCBOOK","application/x-awk":"AWK","application/x-gzip":"GZIP","application/x-bzip2":"BZIP","application/x-xz":"XZ","application/zip":"ZIP","application/x-zip":"ZIP","application/x-rar":"RAR","application/x-tar":"TAR","application/x-7z-compressed":"7z","application/x-jar":"JAR","text/plain":"TextPlain","text/x-php":"PHP","text/html":"HTML","text/javascript":"JS","text/css":"CSS","text/rtf":"RTF","text/rtfd":"RTF","text/x-c":"C","text/x-csrc":"C","text/x-chdr":"CHeader","text/x-c++":"CPP","text/x-c++src":"CPP","text/x-c++hdr":"CPPHeader","text/x-shellscript":"Shell","application/x-csh":"Shell","text/x-python":"Python","text/x-java":"Java","text/x-java-source":"Java","text/x-ruby":"Ruby","text/x-perl":"Perl","text/x-sql":"SQL","text/xml":"XML","text/x-comma-separated-values":"CSV","text/x-markdown":"Markdown","image/x-ms-bmp":"BMP","image/jpeg":"JPEG","image/gif":"GIF","image/png":"PNG","image/tiff":"TIFF","image/x-targa":"TGA","image/vnd.adobe.photoshop":"PSD","image/xbm":"XBITMAP","image/pxm":"PXM","audio/mpeg":"AudioMPEG","audio/midi":"AudioMIDI","audio/ogg":"AudioOGG","audio/mp4":"AudioMPEG4","audio/x-m4a":"AudioMPEG4","audio/wav":"AudioWAV","audio/x-mp3-playlist":"AudioPlaylist","video/x-dv":"VideoDV","video/mp4":"VideoMPEG4","video/mpeg":"VideoMPEG","video/x-msvideo":"VideoAVI","video/quicktime":"VideoMOV","video/x-ms-wmv":"VideoWM","video/x-flv":"VideoFlash","video/x-matroska":"VideoMKV","video/ogg":"VideoOGG"},rules:{defaults:function(t){return!(!t||t.added&&!e.isArray(t.added)||t.removed&&!e.isArray(t.removed)||t.changed&&!e.isArray(t.changed))},open:function(t){return t&&t.cwd&&t.files&&e.isPlainObject(t.cwd)&&e.isArray(t.files)},tree:function(t){return t&&t.tree&&e.isArray(t.tree)},parents:function(t){return t&&t.tree&&e.isArray(t.tree)},tmb:function(t){return t&&t.images&&(e.isPlainObject(t.images)||e.isArray(t.images))},upload:function(t){return t&&(e.isPlainObject(t.added)||e.isArray(t.added))},search:function(t){return t&&t.files&&e.isArray(t.files)}},commands:{},cmdsToAdd:"archive duplicate extract mkdir mkfile paste rm upload",parseUploadData:function(t){var n;if(!e.trim(t))return{error:["errResponse","errDataEmpty"]};try{n=JSON.parse(t)}catch(i){return{error:["errResponse","errDataNotJSON"]}}return this.validResponse("upload",n)?(n=this.normalize(n),n.removed=e.merge(n.removed||[],e.map(n.added||[],function(e){return e.hash})),n):{error:["errResponse"]}},iframeCnt:0,uploads:{xhrUploading:!1,checkExists:function(t,n,i){var a,r,o=e.Deferred(),s=function(){for(var e=t.length;--e>-1;)t[e]._remove=!0},l=function(){var l=[],d={},c=[],u=[],h=function(e){var n=e==u.length-1,a={title:i.i18n("cmdupload"),text:["errExists",u[e].name,"confirmRepl"],all:!n,accept:{label:"btnYes",callback:function(t){n||t?o.resolve(l,d):h(++e)}},reject:{label:"btnNo",callback:function(i){var a;if(i)for(a=u.length;e<a--;)t[u[a].i]._remove=!0;else t[u[e].i]._remove=!0;n||i?o.resolve(l,d):h(++e)}},cancel:{label:"btnCancel",callback:function(){s(),o.resolve(l,d)}},buttons:[{label:"btnBackup",callback:function(t){var i;if(t)for(i=u.length;e<i--;)l.push(u[i].name);else l.push(u[e].name);n||t?o.resolve(l,d):h(++e)}}]};i.iframeCnt>0&&delete a.reject,i.confirm(a)};return i.file(n).read?(a=e.map(t,function(e,t){return e.name?{i:t,name:e.name}:null}),r=e.map(a,function(e){return e.name}),void i.request({data:{cmd:"ls",target:n,intersect:r},notify:{type:"preupload",cnt:1,hideCnt:!0},preventFail:!0}).done(function(t){var r,l;t&&(t.error?s():i.options.overwriteUploadConfirm&&!i.UA.iOS&&i.option("uploadOverwrite",n)&&t.list&&(e.isArray(t.list)?c=t.list||[]:(r=[],c=e.map(t.list,function(e){return"string"==typeof e?e:(r=r.concat(e),null)}),r.length&&(c=c.concat(r)),d=t.list),u=e.map(a,function(t){return-1!==e.inArray(t.name,c)?t:null}),c.length&&n==i.cwd().hash&&(l=e.map(i.files(),function(e){return e.phash==n?e.name:null}),e.map(c,function(t){return-1===e.inArray(t,l)?!0:null}).length&&i.sync()))),u.length>0?h(0):o.resolve([])}).fail(function(e){s(),o.resolve([]),e&&i.error(e)})):void o.resolve([])};return i.api>=2.1&&"object"==typeof t[0]?(l(),o):o.resolve([])},checkFile:function(t,n,i){if(t.checked||"files"==t.type)return t.files;if("data"==t.type){var a,r=e.Deferred(),o=[],s=[],l=0,d=[],c=function(e){var t,i,a,r=[],u=function(e){return Array.prototype.slice.call(e||[],0)},h=n.options.folderUploadExclude[n.OS]||null;a=e.length;for(var p=0;a>p;p++)if(i=e[p])if(i.isFile)l++,i.file(function(e){h&&e.name.match(h)||(s.push(i.fullPath||""),o.push(e)),l--});else if(i.isDirectory&&n.api>=2.1){l++,d.push(i.fullPath),t=i.createReader();var r=[],f=function(){t.readEntries(function(e){if(e.length)r=r.concat(u(e)),f();else{for(var t=0;t<r.length;t++)c([r[t]]);l--}},function(){l--})};f()}};return a=e.map(t.files.items,function(e){return e.getAsEntry?e.getAsEntry():e.webkitGetAsEntry()}),a.length>0?(n.uploads.checkExists(a,i,n).done(function(t,u){var h,p=[];n.options.overwriteUploadConfirm&&!n.UA.iOS&&n.option("uploadOverwrite",i)&&(a=e.map(a,function(a){var r,o,s,l;return a.isDirectory&&(r=e.inArray(a.name,t),-1!==r&&(t.splice(r,1),o=n.uniqueName(a.name+n.options.backupSuffix,null,""),e.each(u,function(e,t){return a.name==t?(s=e,!1):void 0}),s||(s=n.fileByName(a.name,i).hash),n.lockfiles({files:[s]}),l=n.request({data:{cmd:"rename",target:s,name:o},notify:{type:"rename",cnt:1}}).fail(function(e){a._remove=!0,n.sync()}).always(function(){n.unlockfiles({files:[s]})}),p.push(l))),a._remove?null:a})),e.when.apply(e,p).done(function(){a.length>0?(h=setTimeout(function(){n.notify({type:"readdir",cnt:1,hideCnt:!0})},n.options.notifyDelay),c(a),setTimeout(function e(){l>0?setTimeout(e,10):(h&&clearTimeout(h),n.notify({type:"readdir",cnt:-1}),r.resolve([o,s,t,u,d]))},10)):r.reject()})}),r.promise()):r.reject()}var u=[],h=[],p=t.files[0];if("html"==t.type){var f,m=e("<html/>").append(e.parseHTML(p.replace(/ src=/gi," _elfsrc=")));e("img[_elfsrc]",m).each(function(){var t,n,i=e(this),a=i.closest("a");a&&a.attr("href")&&a.attr("href").match(/\.(?:jpe?g|gif|bmp|png)/i)&&(n=a.attr("href")),t=i.attr("_elfsrc"),t&&(n?(-1==e.inArray(n,u)&&u.push(n),-1==e.inArray(t,h)&&h.push(t)):-1==e.inArray(t,u)&&u.push(t))}),f=e("a[href]",m),f.each(function(){var t,n=function(e){var t=document.createElement("a");return t.href=e,t};e(this).text()&&(t=n(e(this).attr("href")),!t.href||1!==f.length&&t.pathname.match(/(?:\.html?|\/[^\/.]*)$/i)||-1==e.inArray(t.href,u)&&-1==e.inArray(t.href,h)&&u.push(t.href))})}else{var g,v,b;for(g=/(http[^<>"{}|\\^\[\]`\s]+)/gi;v=g.exec(p);)b=v[1].replace(/&amp;/g,"&"),-1==e.inArray(b,u)&&u.push(b)}return u},xhr:function(t,n){var i=n?n:this,a=i.getUI(),r=new XMLHttpRequest,o=null,s=null,l=t.checked,d=t.isDataType||"data"==t.type,c=t.target||i.cwd().hash,u=t.dropEvt||null,h=-1!=i.option("uploadMaxConn",c),p=Math.min(5,Math.max(1,i.option("uploadMaxConn",c))),f=1e4,m=30,g=0,v=e.Deferred().fail(function(e){if(i.uploads.xhrUploading){setTimeout(function(){i.sync()},5e3);var t=y.length?d?y[0][0]:y[0]:{};t._cid&&(b=new FormData,y=[{_chunkfail:!0}],b.append("chunk",t._chunk),b.append("cid",t._cid),d=!1,R(y))}i.uploads.xhrUploading=!1,y=null,e&&i.error(e)}).done(function(e){r=null,i.uploads.xhrUploading=!1,y=null,e&&(i.currentReqCmd="upload",e.warning&&i.error(e.warning),e.removed&&i.remove(e),e.added&&i.add(e),e.changed&&i.change(e),i.trigger("upload",e),i.trigger("uploaddone"),e.sync&&i.sync(),e.debug&&n.debug("backend-debug",e))}).always(function(){a.off("uploadabort",U),e(window).off("unload",U),o&&clearTimeout(o),s&&clearTimeout(s),l&&!t.multiupload&&S()&&i.notify({type:"upload",cnt:-w,progress:0,size:0}),P&&z.children(".elfinder-notify-chunkmerge").length&&i.notify({type:"chunkmerge",cnt:-1})}),b=new FormData,y=t.input?t.input.files:i.uploads.checkFile(t,i,c),w=t.checked&&d?y[0].length:y.length,k=0,x=0,C=0,T=!1,z=i.ui.notify,A=!0,I=!1,S=function(){return T=T||z.children(".elfinder-notify-upload").length},U=function(){I=!0,r&&(r.quiet=!0,r.abort()),S()&&i.notify({type:"upload",cnt:-1*z.children(".elfinder-notify-upload").data("cnt"),progress:0,size:0})},M=function(e){z.children(".elfinder-notify-upload").children(".elfinder-notify-cancel")[e?"show":"hide"]()},O=function(e){return e||(e=C),setTimeout(function(){T=!0,i.notify({type:"upload",cnt:w,progress:k-x,size:e,cancel:function(){a.trigger("uploadabort"),v.resolve()}}),x=k,t.multiupload?A&&M(!0):M(A&&e>k)},i.options.notifyDelay)},D=function(){g++<=m?(S()&&x&&i.notify({type:"upload",cnt:0,progress:0,size:x}),r.quiet=!0,r.abort(),x=k=0,setTimeout(function(){I||(r.open("POST",i.uploadURL,!0),r.send(b))},f)):(a.trigger("uploadabort"),v.reject(["errAbort","errTimeout"]))},F=t.renames||null,E=t.hashes||null,P=!1;if(a.one("uploadabort",U),e(window).one("unload."+n.namespace,U),!P&&(x=k),!d&&!w)return v.reject(["errUploadNoFiles"]);r.addEventListener("error",function(){0==r.status?I?v.reject():!d&&t.files&&e.map(t.files,function(e){return e.type||e.size!==(i.UA.Safari?1802:0)?null:e}).length?(errors.push("errFolderUpload"),v.reject(["errAbort","errFolderUpload"])):t.input&&e.map(t.input.files,function(e){return e.type||e.size!==(i.UA.Safari?1802:0)?null:e}).length?v.reject(["errUploadNoFiles"]):D():(a.trigger("uploadabort"),v.reject("errConnect"))},!1),r.addEventListener("load",function(e){var n,l=r.status,c=0,u="";if(l>=400?u=l>500?"errResponse":"errConnect":r.responseText||(u=["errResponse","errDataEmpty"]),u){a.trigger("uploadabort");var h=d?y[0][0]:y[0];return v.reject(h._cid?null:u)}if(k=C,S()&&(c=k-x)&&i.notify({type:"upload",cnt:0,progress:c,size:0}),n=i.parseUploadData(r.responseText),n._chunkmerged){b=new FormData;var p=[{_chunkmerged:n._chunkmerged,_name:n._name,_mtime:n._mtime}];return P=!0,a.off("uploadabort",U),s=setTimeout(function(){i.notify({type:"chunkmerge",cnt:1})},i.options.notifyDelay),void(d?R(p,y[1]):R(p))}n._multiupload=!!t.multiupload,n.error?(i.trigger("uploadfail",n),n._chunkfailure||n._multiupload?(I=!0,i.uploads.xhrUploading=!1,o&&clearTimeout(o),z.children(".elfinder-notify-upload").length?(i.notify({type:"upload",cnt:-w,progress:0,size:0}),v.reject(n.error)):v.reject()):v.reject(n.error)):v.resolve(n)},!1),r.upload.addEventListener("loadstart",function(e){!P&&e.lengthComputable&&(k=e.loaded,g&&(k=0),C=e.total,k||(k=parseInt(.05*C)),S()&&(i.notify({type:"upload",cnt:0,progress:k-x,size:t.multiupload?0:C}),x=k))},!1),r.upload.addEventListener("progress",function(e){var n;e.lengthComputable&&!P&&r.readyState<2&&(k=e.loaded,!t.checked&&k>0&&!o&&(o=O(r._totalSize-k)),C||(C=e.total,k||(k=parseInt(.05*C))),n=k-x,S()&&n/e.total>=.05&&(i.notify({type:"upload",cnt:0,progress:n,size:0}),x=k),!t.multiupload&&k>=C&&(A=!1,M(!1)))},!1);var R=function(a,s){var f,m,g,y,k,x,C,T,z,U,D,P,R,j=0,H=1,N=[],q=0,_=w,L=0,W=[],B=(new Date).getTime().toString().substr(-9),V=Math.min((n.uplMaxSize?n.uplMaxSize:2097152)-8190,n.options.uploadMaxChunkSize),$=h?!1:"",K=function(a,r){var s,l,h=[],p=0;if(!I){for(;a.length&&h.length<r;)h.push(a.shift());if(p=h.length){l=p;for(var f=0;p>f&&!I;f++)s=d?h[f][0][0]._cid||null:h[f][0]._cid||null,R[s]?P--:n.exec("upload",{type:t.type,isDataType:d,files:h[f],checked:!0,target:c,dropEvt:u,renames:F,hashes:E,multiupload:!0},void 0,c).fail(function(e){e&&"No such command"===e&&(I=!0,n.error(["errUpload","errPerm"])),s&&(R[s]=!0)}).always(function(t){t&&t.added&&(U=e.merge(U,t.added)),P<=++D&&(n.trigger("multiupload",{added:U}),o&&clearTimeout(o),S()&&i.notify({type:"upload",cnt:-w,progress:0,size:0})),a.length?K(a,1):--l<=1&&(A=!1,M(!1))})}}(h.length<1||I)&&(I?(o&&clearTimeout(o),s&&(R[s]=!0),v.reject()):(v.resolve(),i.uploads.xhrUploading=!1))},G=function(){i.uploads.xhrUploading?setTimeout(function(){G()},100):(i.uploads.xhrUploading=!0,K(N,p))};if(!l&&(d||"files"==t.type)){for((f=n.option("uploadMaxSize",c))||(f=0),y=0;y<a.length;y++){try{T=a[y],m=T.size,$===!1&&($="",i.api>=2.1&&("slice"in T?$="slice":"mozSlice"in T?$="mozSlice":"webkitSlice"in T&&($="webkitSlice")))}catch(J){w--,_--;continue}if(f&&m>f||!$&&n.uplMaxSize&&m>n.uplMaxSize)i.error(i.i18n("errUploadFile",T.name)+" "+i.i18n("errUploadFileSize")),w--,_--;else if(!T.type||i.uploadMimeCheck(T.type,c))if($&&m>V){for(k=0,x=V,C=-1,_=Math.floor(m/V),g=T.lastModified?Math.round(T.lastModified/1e3):0,L+=m,W[B]=0;m>=k;)z=T[$](k,x),z._chunk=T.name+"."+ ++C+"_"+_+".part",z._cid=B,z._range=k+","+z.size+","+m,z._mtime=g,W[B]++,j&&q++,"undefined"==typeof N[q]&&(N[q]=[],d&&(N[q][0]=[],N[q][1]=[])),j=V,H=1,d?(N[q][0].push(z),N[q][1].push(s[y])):N[q].push(z),k=x,x=k+V;null==z?(i.error(i.i18n("errUploadFile",T.name)+" "+i.i18n("errUploadFileSize")),w--,_--):(_+=C,j=0,H=1,q++)}else(n.uplMaxSize&&j+m>=n.uplMaxSize||H>n.uplMaxFile)&&(j=0,H=1,q++),"undefined"==typeof N[q]&&(N[q]=[],d&&(N[q][0]=[],N[q][1]=[])),d?(N[q][0].push(T),N[q][1].push(s[y])):N[q].push(T),j+=m,L+=m,H++;else i.error(i.i18n("errUploadFile",T.name)+" "+i.i18n("errUploadMime")+" ("+i.escape(T.type)+")"),w--,_--}if(0==N.length)return t.checked=!0,!1;if(N.length>1)return o=O(L),U=[],D=0,P=N.length,R=[],G(),!0;d?(a=N[0][0],s=N[0][1]):a=N[0]}return l||(n.UA.Safari&&t.files?r._totalSize=L:o=O(L)),l=!0,a.length||v.reject(["errUploadNoFiles"]),r.open("POST",i.uploadURL,!0),n.customHeaders&&e.each(n.customHeaders,function(e){r.setRequestHeader(e,this)}),n.xhrFields&&e.each(n.xhrFields,function(e){e in r&&(r[e]=this)}),b.append("cmd","upload"),b.append(i.newAPI?"target":"current",c),F&&F.length&&(e.each(F,function(e,t){b.append("renames[]",t)}),b.append("suffix",n.options.backupSuffix)),E&&e.each(E,function(e,t){b.append("hashes["+e+"]",t)}),e.each(i.options.customData,function(e,t){b.append(e,t)}),e.each(i.options.onlyMimes,function(e,t){b.append("mimes["+e+"]",t)}),e.each(a,function(e,t){t._chunkmerged?(b.append("chunk",t._chunkmerged),b.append("upload[]",t._name),b.append("mtime[]",t._mtime)):(t._chunkfail?(b.append("upload[]","chunkfail"),b.append("mimes","chunkfail")):b.append("upload[]",t),
t._chunk?(b.append("chunk",t._chunk),b.append("cid",t._cid),b.append("range",t._range),b.append("mtime[]",t._mtime)):b.append("mtime[]",t.lastModified?Math.round(t.lastModified/1e3):0)),n.UA.iOS&&b.append("overwrite",0)}),d&&e.each(s,function(e,t){b.append("upload_path[]",t)}),u&&b.append("dropWith",parseInt((u.altKey?"1":"0")+(u.ctrlKey?"1":"0")+(u.metaKey?"1":"0")+(u.shiftKey?"1":"0"),2)),r.send(b),!0};if(d)l?R(y[0],y[1]):y.done(function(t){if(F=[],w=t[0].length){if(t[4]&&t[4].length)return void n.request({data:{cmd:"mkdir",target:c,dirs:t[4]},notify:{type:"mkdir",cnt:t[4].length}}).fail(function(e){e=e||["errUnknown"],"errCmdParams"===e[0]?p=1:(p=0,v.reject(e))}).done(function(n){n.hashes&&(t[1]=e.map(t[1],function(e){return e=e.replace(/\/[^\/]*$/,""),""===e?c:n.hashes[e]}))}).always(function(e){p&&(F=t[2],E=t[3],R(t[0],t[1]))});t[1]=e.map(t[1],function(){return c}),F=t[2],E=t[3],R(t[0],t[1])}else v.reject(["errUploadNoFiles"])}).fail(function(){v.reject()});else if(y.length>0)if(null==F){var j=[],H=[],N=n.options.folderUploadExclude[n.OS]||null;e.each(y,function(t,n){var i=n.webkitRelativePath||n.relativePath||"";return i?(N&&n.name.match(N)?(n._remove=!0,i=void 0):(i=i.replace(/\/[^\/]*$/,""),i&&-1===e.inArray(i,j)&&j.push(i)),void H.push(i)):!1}),n.getUI().find("div.elfinder-upload-dialog-wrapper").elfinderdialog("close"),F=[],E={},j.length?!function(){var t=e.map(j,function(e){return-1===e.indexOf("/")?{name:e}:null}),i=[];n.uploads.checkExists(t,c,n).done(function(a,r){var o,s,l,u=[];n.options.overwriteUploadConfirm&&!n.UA.iOS&&n.option("uploadOverwrite",c)&&(i=e.map(t,function(e){return e._remove?e.name:null}),t=e.map(t,function(e){return e._remove?null:e})),i.length&&e.each(H.concat(),function(t,n){0===e.inArray(n,i)&&(y[t]._remove=!0,delete H[t])}),y=e.map(y,function(e){return e._remove?null:e}),H=e.map(H,function(e){return void 0===e?null:e}),t.length?(o=e.Deferred(),a.length?e.each(a,function(t,i){s=n.uniqueName(i+n.options.backupSuffix,null,""),e.each(r,function(e,t){return a[0]==t?(l=e,!1):void 0}),l||(l=n.fileByName(a[0],c).hash),n.lockfiles({files:[l]}),u.push(n.request({data:{cmd:"rename",target:l,name:s},notify:{type:"rename",cnt:1}}).fail(function(e){v.reject(e),n.sync()}).always(function(){n.unlockfiles({files:[l]})}))}):u.push(null),e.when.apply(e,u).done(function(){n.request({data:{cmd:"mkdir",target:c,dirs:j},notify:{type:"mkdir",cnt:j.length}}).fail(function(e){e=e||["errUnknown"],"errCmdParams"===e[0]?p=1:(p=0,v.reject(e))}).done(function(t){t.hashes&&(H=e.map(H.concat(),function(e){return""===e?c:t.hashes["/"+e]}))}).always(function(e){p&&(d=!0,R(y,H)||v.reject())})})):v.reject()})}():n.uploads.checkExists(y,c,n).done(function(t,i){n.options.overwriteUploadConfirm&&!n.UA.iOS&&n.option("uploadOverwrite",c)&&(F=t,E=i,y=e.map(y,function(e){return e._remove?null:e})),w=y.length,w>0?R(y)||v.reject():v.reject()})}else R(y)||v.reject();else v.reject();return v},iframe:function(t,n){var i,a,r,o,s=n?n:this,l=t.input?t.input:!1,d=l?!1:s.uploads.checkFile(t,s),c=e.Deferred().fail(function(e){e&&s.error(e)}),u="iframe-"+n.namespace+ ++s.iframeCnt,h=e('<form action="'+s.uploadURL+'" method="post" enctype="multipart/form-data" encoding="multipart/form-data" target="'+u+'" style="display:none"><input type="hidden" name="cmd" value="upload" /></form>'),p=this.UA.IE,f=function(){o&&clearTimeout(o),r&&clearTimeout(r),a&&s.notify({type:"upload",cnt:-i}),setTimeout(function(){p&&e('<iframe src="javascript:false;"/>').appendTo(h),h.remove(),m.remove()},100)},m=e('<iframe src="'+(p?"javascript:false;":"about:blank")+'" name="'+u+'" style="position:absolute;left:-1000px;top:-1000px" />').on("load",function(){m.off("load").on("load",function(){f(),c.resolve()}),r=setTimeout(function(){a=!0,s.notify({type:"upload",cnt:i})},s.options.notifyDelay),s.options.iframeTimeout>0&&(o=setTimeout(function(){f(),c.reject([errors.connect,errors.timeout])},s.options.iframeTimeout)),h.submit()}),g=t.target||s.cwd().hash,v=[],b=[],y=[],w={};if(d&&d.length)e.each(d,function(e,t){h.append('<input type="hidden" name="upload[]" value="'+t+'"/>')}),i=1;else{if(!(l&&e(l).is(":file")&&e(l).val()))return c.reject();n.options.overwriteUploadConfirm&&!n.UA.iOS&&n.option("uploadOverwrite",g)&&(v=l.files?l.files:[{name:e(l).val().replace(/^(?:.+[\\\/])?([^\\\/]+)$/,"$1")}],b.push(s.uploads.checkExists(v,g,s).done(function(t,n){y=t,w=n,i=e.map(v,function(e){return e._remove?null:e}).length,i!=v.length&&(i=0)}))),i=l.files?l.files.length:1,h.append(l)}return e.when.apply(e,b).done(function(){return 1>i?c.reject():(h.append('<input type="hidden" name="'+(s.newAPI?"target":"current")+'" value="'+g+'"/>').append('<input type="hidden" name="html" value="1"/>').append('<input type="hidden" name="node" value="'+s.id+'"/>').append(e(l).attr("name","upload[]")),y.length>0&&(e.each(y,function(e,t){h.append('<input type="hidden" name="renames[]" value="'+s.escape(t)+'"/>')}),h.append('<input type="hidden" name="suffix" value="'+n.options.backupSuffix+'"/>')),w&&e.each(y,function(e,t){h.append('<input type="hidden" name="['+e+']" value="'+s.escape(t)+'"/>')}),e.each(s.options.onlyMimes||[],function(e,t){h.append('<input type="hidden" name="mimes[]" value="'+s.escape(t)+'"/>')}),e.each(s.options.customData,function(e,t){h.append('<input type="hidden" name="'+e+'" value="'+s.escape(t)+'"/>')}),h.appendTo("body"),void m.appendTo("body"))}),c}},one:function(e,t){var n=this,i=function(a,r){return setTimeout(function(){n.unbind(e,i)},3),t.apply(n.getListeners(a.type),arguments)};return this.bind(e,i)},localStorage:function(e,t){var n,i,a,r=window.localStorage,o="elfinder-"+e+this.id;if(e=window.location.pathname+"-elfinder-"+e+this.id,null===t)return r.removeItem(e);if(void 0===t&&!(n=r.getItem(e))&&(i=r.getItem(o))&&(t=i,r.removeItem(o)),void 0!==t){a=typeof t,"string"!==a&&"number"!==a&&(t=JSON.stringify(t));try{r.setItem(e,t)}catch(s){try{r.clear(),r.setItem(e,t)}catch(s){self.debug("error",s.toString())}}n=r.getItem(e)}if(n&&("{"===n.substr(0,1)||"["===n.substr(0,1)))try{return JSON.parse(n)}catch(s){}return n},cookie:function(t,n){var i,a,r,o,s,l;if(t="elfinder-"+t+this.id,void 0===n){if(document.cookie&&""!=document.cookie)for(r=document.cookie.split(";"),t+="=",o=0;o<r.length;o++)if(r[o]=e.trim(r[o]),r[o].substring(0,t.length)==t){if(s=decodeURIComponent(r[o].substring(t.length)),"{"===s.substr(0,1)||"["===s.substr(0,1))try{return JSON.parse(s)}catch(d){}return s}return""}return a=e.extend({},this.options.cookie),null===n?(n="",a.expires=-1):(l=typeof n,"string"!==l&&"number"!==l&&(n=JSON.stringify(n))),"number"==typeof a.expires&&(i=new Date,i.setTime(i.getTime()+864e5*a.expires),a.expires=i),document.cookie=t+"="+encodeURIComponent(n)+"; expires="+a.expires.toUTCString()+(a.path?"; path="+a.path:"")+(a.domain?"; domain="+a.domain:"")+(a.secure?"; secure":""),n},startDir:function(){var e=window.location.hash;return e&&e.match(/^#elf_/)?e.replace(/^#elf_/,""):this.options.startPathHash?this.options.startPathHash:this.lastDir()},lastDir:function(e){return this.options.rememberLastDir?this.storage("lastdir",e):""},_node:e("<span/>"),escape:function(e){return this._node.text(e).html().replace(/"/g,"&quot;").replace(/'/g,"&#039;")},normalize:function(t){var n,i,a,r,o=this,s=function(t){var s,l;return t&&t.hash&&t.name&&t.mime?("application/x-empty"==t.mime&&(t.mime="text/plain"),t.options&&(o.optionsByHashes[t.hash]=t.options),t.phash&&"directory"!==t.mime||(t.volumeid&&(s=t.volumeid,o.isRoot(t)&&(o.volOptions[s]||(o.volOptions[s]={}),l=o.volOptions[s],t.options&&(l=e.extend(l,t.options)),t.disabled&&(l.disabled=t.disabled),t.tmbUrl&&(l.tmbUrl=t.tmbUrl),e.each(o.optionProperties,function(e,n){l[n]&&(t[n]=l[n])}),o.roots[s]=t.hash),r!==s&&(r=s,a=o.option("i18nFolderName",s))),!t.i18&&o.isRoot(t)&&(n="volume_"+t.name,i=o.i18n(!1,n),n!==i&&(t.i18=i)),a&&!t.i18&&(n="folder_"+t.name,i=o.i18n(!1,n),n!==i&&(t.i18=i)),o.leafRoots[t.hash]&&(t.dirs||(t.dirs=1),e.each(o.leafRoots[t.hash],function(){var e=o.file(this);e&&e.ts&&(t.ts||0)<e.ts&&(t.ts=e.ts)}))),t):null};return t.cwd&&(t.cwd.volumeid&&t.options&&Object.keys(t.options).length&&(o.volOptions[t.cwd.volumeid]=t.options),t.cwd=s(t.cwd)),t.files&&(t.files=e.map(t.files,s)),t.tree&&(t.tree=e.map(t.tree,s)),t.added&&(t.added=e.map(t.added,s)),t.changed&&(t.changed=e.map(t.changed,s)),t.api&&(t.init=!0),t.cwd&&t.cwd.options&&t.options&&e.extend(t.options,t.cwd.options),t},setSort:function(e,t,n,i){this.storage("sortType",this.sortType=this.sortRules[e]?e:"name"),this.storage("sortOrder",this.sortOrder=/asc|desc/.test(t)?t:"asc"),this.storage("sortStickFolders",(this.sortStickFolders=!!n)?1:""),this.storage("sortAlsoTreeview",(this.sortAlsoTreeview=!!i)?1:""),this.trigger("sortchange")},_sortRules:{name:function(e,t){return i.prototype.naturalCompare(e.i18||e.name,t.i18||t.name)},size:function(e,t){var n=parseInt(e.size)||0,i=parseInt(t.size)||0;return n===i?0:n>i?1:-1},kind:function(e,t){return i.prototype.naturalCompare(e.mime,t.mime)},date:function(e,t){var n=e.ts||e.date,i=t.ts||t.date;return n===i?0:n>i?1:-1},perm:function(e,t){var n=function(e){return(e.write?2:0)+(e.read?1:0)},i=n(e),a=n(t);return i===a?0:i>a?1:-1},mode:function(e,t){var n=e.mode||e.perm||"",a=t.mode||t.perm||"";return i.prototype.naturalCompare(n,a)},owner:function(e,t){var n=e.owner||"",a=t.owner||"";return i.prototype.naturalCompare(n,a)},group:function(e,t){var n=e.group||"",a=t.group||"";return i.prototype.naturalCompare(n,a)}},sorters:[],naturalCompare:function(e,t){var n=i.prototype.naturalCompare;return"undefined"==typeof n.loc&&(n.loc=navigator.userLanguage||navigator.browserLanguage||navigator.language||"en-US"),"undefined"==typeof n.sort&&("11".localeCompare("2",n.loc,{numeric:!0})>0?window.Intl&&window.Intl.Collator?n.sort=new Intl.Collator(n.loc,{numeric:!0}).compare:n.sort=function(e,t){return e.localeCompare(t,n.loc,{numeric:!0})}:(n.sort=function(e,t){var i,a,r=/(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,o=/(^[ ]*|[ ]*$)/g,s=/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,l=/^0x[0-9a-f]+$/i,d=/^0/,c=/^[\x01\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/,u=function(e){return n.sort.insensitive&&(""+e).toLowerCase()||""+e},h=u(e).replace(o,"").replace(/^_/,"")||"",p=u(t).replace(o,"").replace(/^_/,"")||"",f=h.replace(r,"\x00$1\x00").replace(/\0$/,"").replace(/^\0/,"").split("\x00"),m=p.replace(r,"\x00$1\x00").replace(/\0$/,"").replace(/^\0/,"").split("\x00"),g=parseInt(h.match(l))||1!=f.length&&h.match(s)&&Date.parse(h),v=parseInt(p.match(l))||g&&p.match(s)&&Date.parse(p)||null,b=0;if(v){if(v>g)return-1;if(g>v)return 1}for(var y=0,w=Math.max(f.length,m.length);w>y;y++){if(i=!(f[y]||"").match(d)&&parseFloat(f[y])||f[y]||0,a=!(m[y]||"").match(d)&&parseFloat(m[y])||m[y]||0,isNaN(i)!==isNaN(a)){if(isNaN(i)&&("string"!=typeof i||!i.match(c)))return 1;if("string"!=typeof a||!a.match(c))return-1}if(0===parseInt(i,10)&&(i=0),0===parseInt(a,10)&&(a=0),typeof i!=typeof a&&(i+="",a+=""),n.sort.insensitive&&"string"==typeof i&&"string"==typeof a&&(b=i.localeCompare(a,n.loc),0!==b))return b;if(a>i)return-1;if(i>a)return 1}return 0},n.sort.insensitive=!0)),n.sort(e,t)},compare:function(e,t){var n,i=this,a=i.sortType,r="asc"==i.sortOrder,o=i.sortStickFolders,s=i.sortRules,l=s[a],d="directory"==e.mime,c="directory"==t.mime;if(o){if(d&&!c)return-1;if(!d&&c)return 1}return n=r?l(e,t):l(t,e),"name"!==a&&0===n?n=r?s.name(e,t):s.name(t,e):n},sortFiles:function(e){return e.sort(this.compare)},notify:function(t){var n,i,a,r=t.type,o=this.i18n("undefined"!=typeof t.msg?t.msg:this.messages["ntf"+r]?"ntf"+r:"ntfsmth"),s=this.ui.notify,l=s.children(".elfinder-notify-"+r),d=l.children("div.elfinder-notify-cancel").children("button"),c='<div class="elfinder-notify elfinder-notify-{type}"><span class="elfinder-dialog-icon elfinder-dialog-icon-{type}"/><span class="elfinder-notify-msg">{msg}</span> <span class="elfinder-notify-cnt"/><div class="elfinder-notify-progressbar"><div class="elfinder-notify-progress"/></div><div class="elfinder-notify-cancel"/></div>',u=t.cnt,h="undefined"!=typeof t.size?parseInt(t.size):null,p="undefined"!=typeof t.progress&&t.progress>=0?t.progress:null,f=t.cancel,m="ui-state-hover",g=function(){l._esc&&e(document).off("keydown",l._esc),l.remove(),!s.children().length&&s.elfinderdialog("close")};return r?(l.length?"undefined"!=typeof t.msg&&l.children("span.elfinder-notify-msg").html(o):(l=e(c.replace(/\{type\}/g,r).replace(/\{msg\}/g,o)).appendTo(s).data("cnt",0),null!=p&&l.data({progress:0,total:0}),f&&(d=e('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"><span class="ui-button-text">'+this.i18n("btnCancel")+"</span></button>").hover(function(t){e(this).toggleClass(m,"mouseenter"==t.type)}),l.children("div.elfinder-notify-cancel").append(d))),n=u+parseInt(l.data("cnt")),n>0?(f&&d.length&&(e.isFunction(f)||"object"==typeof f&&f.promise)&&(l._esc=function(t){"keydown"==t.type&&t.keyCode!=e.ui.keyCode.ESCAPE||(t.preventDefault(),t.stopPropagation(),g(),f.promise?(f.xhr&&(f.xhr.quiet=!0,f.xhr.abort()),f.reject()):f(t))},d.on("click",function(e){l._esc(e)}),e(document).on("keydown."+this.namespace,l._esc)),!t.hideCnt&&l.children(".elfinder-notify-cnt").text("("+n+")"),s.is(":hidden")&&s.elfinderdialog("open",this),l.data("cnt",n),null!=p&&(i=l.data("total"))>=0&&(a=l.data("progress"))>=0&&(i+=null!=h?h:u,a+=p,null==h&&0>u&&(a+=100*u),l.data({progress:a,total:i}),null!=h&&(a*=100,i=Math.max(1,i)),p=parseInt(a/i),l.find(".elfinder-notify-progress").animate({width:(100>p?p:100)+"%"},20))):g(),this):this},confirm:function(t){var n,i=this,a=!1,r={cssClass:"elfinder-dialog-confirm",modal:!0,resizable:!1,title:this.i18n(t.title||"confirmReq"),buttons:{},close:function(){!a&&t.cancel.callback(),e(this).elfinderdialog("destroy")}},o=this.i18n("apllyAll");return r.buttons[this.i18n(t.accept.label)]=function(){t.accept.callback(!(!n||!n.prop("checked"))),a=!0,e(this).elfinderdialog("close")},t.reject&&(r.buttons[this.i18n(t.reject.label)]=function(){t.reject.callback(!(!n||!n.prop("checked"))),a=!0,e(this).elfinderdialog("close")}),t.buttons&&t.buttons.length>0&&e.each(t.buttons,function(t,o){r.buttons[i.i18n(o.label)]=function(){o.callback(!(!n||!n.prop("checked"))),a=!0,e(this).elfinderdialog("close")}}),r.buttons[this.i18n(t.cancel.label)]=function(){e(this).elfinderdialog("close")},t.all&&(r.create=function(){var t=e('<div class="elfinder-dialog-confirm-applyall"/>');n=e('<input type="checkbox" />'),e(this).next().find(".ui-dialog-buttonset").prepend(t.append(e("<label>"+o+"</label>").prepend(n)))}),t.optionsCallback&&e.isFunction(t.optionsCallback)&&t.optionsCallback(r),this.dialog('<span class="elfinder-dialog-icon elfinder-dialog-icon-confirm"/>'+this.i18n(t.text),r)},uniqueName:function(e,t,n){var i,a,r=0,o="";if(e=this.i18n(e),t=t||this.cwd().hash,n="undefined"==typeof n?" ":n,(i=e.match(/^(.+)(\.[^.]+)$/))&&(o=i[2],e=i[1]),a=e+o,!this.fileByName(a,t))return a;for(;1e4>r;)if(a=e+n+ ++r+o,!this.fileByName(a,t))return a;return e+Math.random()+o},i18n:function(){var t,n,i,a,r=this,o=this.messages,s=[],l=[],d=function(e){var t;return 0===e.indexOf("#")&&(t=r.file(e.substr(1)))?t.name:e},c=0;for(arguments.length&&arguments[0]===!1&&(a=function(e){return e},c=1),t=c;t<arguments.length;t++)if(i=arguments[t],e.isArray(i))for(n=0;n<i.length;n++)i[n]instanceof jQuery?s.push(i[n]):"undefined"!=typeof i[n]&&s.push(d(""+i[n]));else i instanceof jQuery?s.push(i[n]):"undefined"!=typeof i&&s.push(d(""+i));for(t=0;t<s.length;t++)-1===e.inArray(t,l)&&(i=s[t],"string"==typeof i?(i=o[i]||(a?a(i):r.escape(i)),i=i.replace(/\$(\d+)/g,function(e,n){return n=t+parseInt(n),n>0&&s[n]&&l.push(n),a?a(s[n]):r.escape(s[n])})):i=i.get(0).outerHTML,s[t]=i);return e.map(s,function(t,n){return-1===e.inArray(n,l)?t:null}).join("<br>")},mime2class:function(e){var t="elfinder-cwd-icon-";return e=e.split("/"),t+e[0]+("image"!=e[0]&&e[1]?" "+t+e[1].replace(/(\.|\+)/g,"-"):"")},mime2kind:function(e){var t,n="object"==typeof e,i=n?e.mime:e;return n&&e.alias&&"symlink-broken"!=i?t="Alias":this.kinds[i]&&(t=!n||"directory"!==i||e.phash&&!e.isroot?this.kinds[i]:"Root"),t||(t=0===i.indexOf("text")?"Text":0===i.indexOf("image")?"Image":0===i.indexOf("audio")?"Audio":0===i.indexOf("video")?"Video":0===i.indexOf("application")?"App":i),this.messages["kind"+t]?this.i18n("kind"+t):i},formatDate:function(e,t){var n,i,a,r,o,s,l,d,c,u,h,p=this,t=t||e.ts,f=p.i18;return p.options.clientFormatDate&&t>0?(n=new Date(1e3*t),d=n[p.getHours](),c=d>12?d-12:d,u=n[p.getMinutes](),h=n[p.getSeconds](),r=n[p.getDate](),o=n[p.getDay](),s=n[p.getMonth]()+1,l=n[p.getFullYear](),i=t>=this.yesterday?this.fancyFormat:this.dateFormat,a=i.replace(/[a-z]/gi,function(e){switch(e){case"d":return r>9?r:"0"+r;case"j":return r;case"D":return p.i18n(f.daysShort[o]);case"l":return p.i18n(f.days[o]);case"m":return s>9?s:"0"+s;case"n":return s;case"M":return p.i18n(f.monthsShort[s-1]);case"F":return p.i18n(f.months[s-1]);case"Y":return l;case"y":return(""+l).substr(2);case"H":return d>9?d:"0"+d;case"G":return d;case"g":return c;case"h":return c>9?c:"0"+c;case"a":return d>=12?"pm":"am";case"A":return d>=12?"PM":"AM";case"i":return u>9?u:"0"+u;case"s":return h>9?h:"0"+h}return e}),t>=this.yesterday?a.replace("$1",this.i18n(t>=this.today?"Today":"Yesterday")):a):e.date?e.date.replace(/([a-z]+)\s/i,function(e,t){return p.i18n(t)+" "}):p.i18n("dateUnknown")},perms2class:function(e){var t="";return e.read||e.write?e.read?e.write||(t="elfinder-ro"):t="elfinder-wo":t="elfinder-na",e.type&&(t+=" elfinder-"+this.escape(e.type)),t},formatPermissions:function(e){var t=[];return e.read&&t.push(this.i18n("read")),e.write&&t.push(this.i18n("write")),t.length?t.join(" "+this.i18n("and")+" "):this.i18n("noaccess")},formatSize:function(e){var t=1,n="b";return"unknown"==e?this.i18n("unknown"):(e>1073741824?(t=1073741824,n="GB"):e>1048576?(t=1048576,n="MB"):e>1024&&(t=1024,n="KB"),e/=t,(e>0?t>=1048576?e.toFixed(2):Math.round(e):0)+" "+n)},formatFileMode:function(t,n){var i,a,r,o,s,l,d,c,u;if(n||(n=this.options.fileModeStyle.toLowerCase()),t=e.trim(t),t.match(/[rwxs-]{9}$/i)){if(c=t=t.substr(-9),"string"==n)return c;for(u="",r=0,i=0;7>i;i+=3)a=t.substr(i,3),o=0,a.match(/[r]/i)&&(o+=4),a.match(/[w]/i)&&(o+=2),a.match(/[xs]/i)&&(a.match(/[xs]/)&&(o+=1),a.match(/[s]/i)&&(0==i?r+=4:3==i&&(r+=2))),u+=o.toString(8);r&&(u=r.toString(8)+u)}else{if(t=parseInt(t,8),u=t?t.toString(8):"",!t||"octal"==n)return u;for(a=t.toString(8),r=0,a.length>3&&(a=a.substr(-4),r=parseInt(a.substr(0,1),8),a=a.substr(1)),s=1==(1&r),d=2==(2&r),l=4==(4&r),c="",i=0;3>i;i++)c+=4==(4&parseInt(a.substr(i,1),8))?"r":"-",c+=2==(2&parseInt(a.substr(i,1),8))?"w":"-",c+=1==(1&parseInt(a.substr(i,1),8))?0==i&&l||1==i&&d?"s":"x":"-"}return"both"==n?c+" ("+u+")":"string"==n?c:u},uploadMimeCheck:function(t,n){n=n||this.cwd().hash;var i,a,r=!0,o=this.option("uploadMime",n),s=function(n){var i=!1;return"string"==typeof n&&"all"===n.toLowerCase()?i=!0:e.isArray(n)&&n.length&&e.each(n,function(e,n){return n=n.toLowerCase(),"all"===n||0===t.indexOf(n)?(i=!0,!1):void 0}),i};return t&&e.isPlainObject(o)&&(t=t.toLowerCase(),i=s(o.allow),a=s(o.deny),"allow"===o.firstOrder?(r=!1,a||i!==!0||(r=!0)):(r=!0,a!==!0||i||(r=!1))),r},sequence:function(e){var t=e.length,n=function(t,i){return++i,e[i]?n(t.then(e[i]),i):t};return t>1?n(e[0](),0):e[0]()},reloadContents:function(t){var n,i=e.Deferred();try{n=e('<iframe width="1" height="1" scrolling="no" frameborder="no" style="position:absolute; top:-1px; left:-1px" crossorigin="use-credentials">').attr("src",t).one("load",function(){var n=e(this);try{this.contentDocument.location.reload(!0),n.one("load",function(){n.remove(),i.resolve()})}catch(a){n.attr("src","").attr("src",t).one("load",function(){n.remove(),i.resolve()})}}).appendTo("body")}catch(a){n&&n.remove(),i.reject()}return i},makeNetmountOptionOauth:function(t,n,i,a){return{vars:{},name:n,inputs:{offline:e('<input type="checkbox"/>').on("change",function(){e(this).parents("table.elfinder-netmount-tb").find("select:first").trigger("change","reset")}),host:e('<span><span class="elfinder-info-spinner"/></span><input type="hidden"/>'),path:e('<input type="text" value="root"/>'),user:e('<input type="hidden"/>'),pass:e('<input type="hidden"/>')},select:function(n,r,o){var s=this.inputs,l=s.offline,d=e(s.host[0]),o=o||null;this.vars.mbtn=s.host.closest(".ui-dialog").children(".ui-dialog-buttonpane:first").find("button.elfinder-btncnt-0"),d.data("inrequest")||!d.find("span.elfinder-info-spinner").length&&"reset"!==o&&("winfocus"!==o||d.siblings("span.elfinder-button-icon-reload").length)?(l.closest("tr")[a||s.user.val()?"hide":"show"](),d.data("funcexpup")&&d.data("funcexpup")()):(1===l.parent().children().length&&(s.path.parent().prev().html(n.i18n("folderId")),l.attr("title",n.i18n("offlineAccess")),l.uniqueId().after(e("<label/>").attr("for",l.attr("id")).html(" "+n.i18n("offlineAccess")))),d.data("inrequest",!0).empty().addClass("elfinder-info-spinner").parent().find("span.elfinder-button-icon").remove(),n.request({data:{cmd:"netmount",protocol:t,host:i,user:"init",options:{id:n.id,offline:l.prop("checked")?1:0,pass:s.host[1].value}},preventDefault:!0}).done(function(e){d.removeClass("elfinder-info-spinner").html(e.body.replace(/\{msg:([^}]+)\}/g,function(e,t){return n.i18n(t,i)}))}),a&&l.closest("tr").hide()),this.vars.mbtn[e(s.host[1]).val()?"show":"hide"]()},done:function(n,r){var o=this.inputs,s=this.protocol,l=e(o.host[0]),d=e(o.host[1]),c="&nbsp;";if(a&&o.offline.closest("tr").hide(),"makebtn"==r.mode)l.removeClass("elfinder-info-spinner").removeData("expires").removeData("funcexpup"),o.host.find("input").hover(function(){e(this).toggleClass("ui-state-hover")}),d.val(""),o.path.val("root").next().remove(),o.user.val(""),o.pass.val(""),!a&&o.offline.closest("tr").show(),this.vars.mbtn.hide();else{if(r.expires&&(c="()",l.data("expires",r.expires)),l.html(i+c).removeClass("elfinder-info-spinner"),r.expires&&(l.data("funcexpup",function(){var e=Math.floor((l.data("expires")-+new Date/1e3)/60);3>e?l.parent().children(".elfinder-button-icon-reload").click():(l.text(l.text().replace(/\(.*\)/,"("+n.i18n(["minsLeft",e])+")")),setTimeout(function(){l.is(":visible")&&l.data("funcexpup")()},6e4))}),l.data("funcexpup")()),r.reset)return void s.trigger("change","reset");l.parent().append(e('<span class="elfinder-button-icon elfinder-button-icon-reload" title="'+n.i18n("reAuth")+'">').on("click",function(){d.val("reauth"),s.trigger("change","reset")})),d.val(t),this.vars.mbtn.show(),r.folders&&o.path.next().remove().end().after(e("<div/>").append(e('<select class="ui-corner-all" style="max-width:200px;">').append(e(e.map(r.folders,function(e,t){return'<option value="'+(t+"").trim()+'">'+n.escape(e)+"</option>"}).join(""))).on("change",function(){o.path.val(e(this).val())}))),o.user.val("done"),o.pass.val("done"),o.offline.closest("tr").hide()}l.removeData("inrequest")},fail:function(t,n){e(this.inputs.host[0]).removeData("inrequest"),this.protocol.trigger("change","reset")}}},findCwdNodes:function(t,n){var i=this,a=this.getUI("cwd"),r=this.cwd().hash,o=e();return n=n||{},e.each(t,function(e,t){return t.phash===r&&(o=o.add(a.find("#"+i.cwdHash2Id(t.hash))),n.firstOnly)?!1:void 0}),o},convAbsUrl:function(e){if(e.match(/^http/i))return e;if("//"===e.substr(0,2))return window.location.protocol+e;var t,n=window.location.protocol+"//"+window.location.host,i=/[^\/]+\/\.\.\//;for(t="/"===e.substr(0,1)?n+e:n+window.location.pathname.replace(/\/[^\/]+$/,"/")+e,t=t.replace("/./","/");i.test(t);)t=t.replace(i,"");return t},navHash2Id:function(e){return this.navPrefix+e},navId2Hash:function(e){return"string"==typeof e?e.substr(this.navPrefix.length):!1},cwdHash2Id:function(e){return this.cwdPrefix+e},cwdId2Hash:function(e){return"string"==typeof e?e.substr(this.cwdPrefix.length):!1},isInWindow:function(e,t){if(!t&&e.is(":hidden"))return!1;var n,i;return(n=e.get(0))?(i=n.getBoundingClientRect(),!!document.elementFromPoint(i.left,i.top)):!1},loadScript:function(t,n,i,a){var r={dataType:"script",cache:!0},o=null;return e.isFunction(n)&&(o=function(){if(a)if("undefined"==typeof a.obj[a.name])var e=a.timeout?a.timeout/10:1e3,t=setInterval(function(){--e>0&&"undefined"!=typeof a.obj[a.name]&&(clearInterval(t),n())},10);else n();else n()}),i&&"tag"===i.loadType?(e.each(t,function(t,n){e("head").append(e('<script defer="defer">').attr("src",n))}),o()):(i=e.isPlainObject(i)?e.extend(r,i):r,function s(){e.ajax(e.extend(i,{url:t.shift(),success:t.length?s:o}))}()),this},loadCss:function(t){var n=this;return"string"==typeof t&&(t=[t]),e.each(t,function(t,i){i=n.convAbsUrl(i).replace(/^https?:/i,""),e("head > link[href='+url+']").length||e("head").append('<link rel="stylesheet" type="text/css" href="'+i+'" />')}),this},log:function(e){return window.console&&window.console.log&&window.console.log(e),this},debug:function(t,n){var i=this.options.debug;return("all"==i||i===!0||e.isArray(i)&&-1!=e.inArray(t,i))&&window.console&&window.console.log&&window.console.log("elfinder debug: ["+t+"] ["+this.id+"]",n),"backend-debug"===t&&this.trigger("backenddebug",n),this},time:function(e){window.console&&window.console.time&&window.console.time(e)},timeEnd:function(e){window.console&&window.console.timeEnd&&window.console.timeEnd(e)}},Object.keys||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],i=n.length;return function(a){if("object"!=typeof a&&"function"!=typeof a||null===a)throw new TypeError("Object.keys called on non-object");var r=[];for(var o in a)e.call(a,o)&&r.push(o);if(t)for(var s=0;i>s;s++)e.call(a,n[s])&&r.push(n[s]);return r}}()),i.prototype.version="2.1.20",function(){if(e.ui&&e.ui.ddmanager){var t=e.ui.ddmanager.prepareOffsets;e.ui.ddmanager.prepareOffsets=function(n,i){var a=function(e){if(e.is(":hidden"))return!0;var t=e[0].getBoundingClientRect();return!document.elementFromPoint(t.left,t.top)};if("mousedown"===i.type||n.options.elfRefresh){var r,o,s=e.ui.ddmanager.droppables[n.options.scope]||[],l=s.length;for(r=0;l>r;r++)o=s[r],o.options.autoDisable&&(!o.options.disabled||o.options.autoDisable>1)&&(o.options.disabled=a(o.element),o.options.autoDisable=o.options.disabled?2:1)}return t(n,i)}}}(),function(e){function t(t,n){if(!(t.originalEvent.touches.length>1)){e(t.currentTarget).hasClass("touch-punch-keep-default")||t.preventDefault();var i=t.originalEvent.changedTouches[0],a=document.createEvent("MouseEvents");a.initMouseEvent(n,!0,!0,window,1,i.screenX,i.screenY,i.clientX,i.clientY,!1,!1,!1,!1,0,null),t.target.dispatchEvent(a)}}if(e.support.touch="ontouchend"in document,e.support.touch){var n,i,a,r=e.ui.mouse.prototype,o=r._mouseInit,s=r._mouseDestroy;r._touchStart=function(e){var r=this;!n&&r._mouseCapture(e.originalEvent.changedTouches[0])&&(i=e.originalEvent.changedTouches[0].screenX.toFixed(0),a=e.originalEvent.changedTouches[0].screenY.toFixed(0),n=!0,r._touchMoved=!1,t(e,"mouseover"),t(e,"mousemove"),t(e,"mousedown"))},r._touchMove=function(e){if(n){var r=e.originalEvent.changedTouches[0].screenX.toFixed(0),o=e.originalEvent.changedTouches[0].screenY.toFixed(0);Math.abs(i-r)<=2&&Math.abs(a-o)<=2||(this._touchMoved=!0,t(e,"mousemove"))}},r._touchEnd=function(e){n&&(t(e,"mouseup"),t(e,"mouseout"),this._touchMoved||t(e,"click"),n=!1,this._touchMoved=!1)},r._mouseInit=function(){var t=this;t.element.hasClass("touch-punch")&&t.element.bind({touchstart:e.proxy(t,"_touchStart"),touchmove:e.proxy(t,"_touchMove"),touchend:e.proxy(t,"_touchEnd")}),o.call(t)},r._mouseDestroy=function(){var t=this;t.element.hasClass("touch-punch")&&t.element.unbind({touchstart:e.proxy(t,"_touchStart"),touchmove:e.proxy(t,"_touchMove"),touchend:e.proxy(t,"_touchEnd")}),s.call(t)}}}(jQuery),e.fn.elfinder=function(e){return"instance"==e?this.getElFinder():this.each(function(){var t="string"==typeof e?e:"";switch(this.elfinder||new i(this,"object"==typeof e?e:{}),t){case"close":case"hide":this.elfinder.hide();break;case"open":case"show":this.elfinder.show();break;case"destroy":this.elfinder.destroy()}})},e.fn.getElFinder=function(){var e;return this.each(function(){return this.elfinder?(e=this.elfinder,!1):void 0}),e},e.fn.elfUiWidgetInstance=function(e){try{return this[e]("instance")}catch(t){var n=this.data("ui-"+e);return n&&"object"==typeof n&&n.widgetFullName==="ui-"+e?n:null}},i.prototype._options={url:"",requestType:"get",transport:{},urlUpload:"",dragUploadAllow:"auto",overwriteUploadConfirm:!0,uploadMaxChunkSize:10485760,folderUploadExclude:{win:/^(?:desktop\.ini|thumbs\.db)$/i,mac:/^\.ds_store$/i},iframeTimeout:0,customData:{},handlers:{},customHeaders:{},xhrFields:{},lang:"en",cssAutoLoad:!0,cssClass:"",commands:["*"],commandsOptions:{getfile:{onlyURL:!1,multiple:!1,folders:!1,oncomplete:"",getPath:!0,getImgSize:!1},open:{method:"post"},upload:{ui:"button"},download:{maxRequests:10},quicklook:{autoplay:!0,width:450,height:300,googleDocsMimes:[]},edit:{mimes:[],editors:[],encodings:["Big5","Big5-HKSCS","Cp437","Cp737","Cp775","Cp850","Cp852","Cp855","Cp857","Cp858","Cp862","Cp866","Cp874","EUC-CN","EUC-JP","EUC-KR","ISO-2022-CN","ISO-2022-JP","ISO-2022-KR","ISO-8859-1","ISO-8859-2","ISO-8859-3","ISO-8859-4","ISO-8859-5","ISO-8859-6","ISO-8859-7","ISO-8859-8","ISO-8859-9","ISO-8859-13","ISO-8859-15","KOI8-R","KOI8-U","Shift-JIS","Windows-1250","Windows-1251","Windows-1252","Windows-1253","Windows-1254","Windows-1257"]},search:{incsearch:{enable:!0,minlen:1,wait:500}},info:{nullUrlDirLinkSelf:!0,custom:{}},mkdir:{intoNewFolderToolbtn:!1},resize:{grid8px:"enable"},help:{view:["about","shortcuts","help","debug"]}},getFileCallback:null,defaultView:"icons",startPathHash:"",sound:!0,ui:["toolbar","tree","path","stat"],uiOptions:{toolbar:[["back","forward"],["netmount"],["mkdir","mkfile","upload"],["open","download","getfile"],["info","chmod"],["quicklook"],["copy","cut","paste"],["rm"],["duplicate","rename","edit","resize"],["extract","archive"],["search"],["view","sort"],["help"],["fullscreen"],{displayTextLabel:!1,labelExcludeUA:["Mobile"],autoHideUA:["Mobile"]}],tree:{openRootOnLoad:!0,openCwdOnOpen:!0,syncTree:!0},navbar:{minWidth:150,maxWidth:500,autoHideUA:[]},cwd:{oldSchool:!1,showSelectCheckboxUA:["Touch"],listView:{columns:["perm","date","size","kind"],columnsCustomName:{},fixedHeader:!0}}},onlyMimes:[],sortRules:{},sortType:"name",sortOrder:"asc",sortStickFolders:!0,sortAlsoTreeview:!1,clientFormatDate:!0,UTCDate:!1,dateFormat:"",fancyDateFormat:"",fileModeStyle:"both",width:"auto",height:400,resizable:!0,notifyDelay:500,notifyDialog:{position:{top:"12px",right:"12px"},width:280},allowShortcuts:!0,rememberLastDir:!0,reloadClearHistory:!1,useBrowserHistory:!0,showFiles:50,showThreshold:50,validName:!1,backupSuffix:"~",sync:0,syncStart:!0,loadTmbs:5,cookie:{expires:30,domain:"",path:"/",secure:!1},contextmenu:{navbar:["open","download","|","upload","mkdir","|","copy","cut","paste","duplicate","|","rm","|","rename","|","archive","|","places","info","chmod","netunmount"],cwd:["reload","back","|","upload","mkdir","mkfile","paste","|","view","sort","colwidth","|","info","|","fullscreen"],files:["getfile","|","open","download","opendir","quicklook","|","upload","mkdir","|","copy","cut","paste","duplicate","|","rm","|","edit","rename","resize","|","archive","extract","|","places","info","chmod","netunmount"]},enableAlways:!1,enableByMouseOver:!0,windowCloseConfirm:["hasNotifyDialog","editingFile"],rawStringDecoder:"object"==typeof Encoding&&e.isFunction(Encoding.convert)?function(e){return Encoding.convert(e,{to:"UNICODE",type:"string"})}:null,debug:["error","warning","event-destroy"]},i.prototype._options.commandsOptions.netmount={ftp:{name:"FTP",inputs:{host:e('<input type="text"/>'),port:e('<input type="text" placeholder="21"/>'),
path:e('<input type="text" value="/"/>'),user:e('<input type="text"/>'),pass:e('<input type="password"/>'),encoding:e('<input type="text" placeholder="Optional"/>'),locale:e('<input type="text" placeholder="Optional"/>')}},dropbox:{name:"Dropbox.com",inputs:{host:e('<span><span class="elfinder-info-spinner"/></span></span><input type="hidden"/>'),path:e('<input type="text" value="/"/>'),user:e('<input type="hidden"/>'),pass:e('<input type="hidden"/>')},select:function(e){var t=this;t.inputs.host.find("span").length&&e.request({data:{cmd:"netmount",protocol:"dropbox",host:"dropbox.com",user:"init",pass:"init",options:{url:e.uploadURL,id:e.id}},preventDefault:!0}).done(function(n){t.inputs.host.find("span").removeClass("elfinder-info-spinner"),t.inputs.host.find("span").html(n.body.replace(/\{msg:([^}]+)\}/g,function(t,n){return e.i18n(n,"Dropbox.com")}))}).fail(function(){})},done:function(t,n){var i=this;"makebtn"==n.mode?(i.inputs.host.find("span").removeClass("elfinder-info-spinner"),i.inputs.host.find("input").hover(function(){e(this).toggleClass("ui-state-hover")}),i.inputs.host[1].value=""):(i.inputs.host.find("span").removeClass("elfinder-info-spinner"),i.inputs.host.find("span").html("Dropbox.com"),i.inputs.host[1].value="dropbox",i.inputs.user.val("done"),i.inputs.pass.val("done"))}},googledrive:i.prototype.makeNetmountOptionOauth("googledrive","Google Drive","Google"),onedrive:i.prototype.makeNetmountOptionOauth("onedrive","One Drive","OneDrive"),box:i.prototype.makeNetmountOptionOauth("box","Box","Box",!0)},i.prototype.history=function(t){var n,i=this,a=!0,r=[],o=function(){r=[t.cwd().hash],n=0,a=!0},s=t.options.useBrowserHistory&&window.history&&window.history.pushState?window.history:null,l=function(s){return s&&i.canForward()||!s&&i.canBack()?(a=!1,t.exec("open",r[s?++n:--n]).fail(o)):e.Deferred().reject()};this.canBack=function(){return n>0},this.canForward=function(){return n<r.length-1},this.back=l,this.forward=function(){return l(!0)},t.open(function(){var e=r.length,i=t.cwd().hash;a&&(n>=0&&e>n+1&&r.splice(n+1),r[r.length-1]!=i&&r.push(i),n=r.length-1),a=!0,s&&(s.state?s.state.thash!=i&&s.pushState({thash:i},null,location.pathname+location.search+"#elf_"+i):s.replaceState({thash:i},null,location.pathname+location.search+"#elf_"+i))}).reload(t.options.reloadClearHistory&&o)},i.prototype.command=function(t){this.fm=t,this.name="",this.className="",this.title="",this.linkedCmds=[],this.state=-1,this.alwaysEnabled=!1,this._disabled=!1,this.disableOnSearch=!1,this.updateOnSelect=!0,this._handlers={enable:function(){this.update(void 0,this.value)},disable:function(){this.update(-1,this.value)},"open reload load sync":function(){this._disabled=!(this.alwaysEnabled||this.fm.isCommandEnabled(this.name)),this.update(void 0,this.value),this.change()}},this.handlers={},this.shortcuts=[],this.options={ui:"button"},this.setup=function(t,n){var i,a,r,o,s=this,l=this.fm;for(this.name=t,this.title=l.messages["cmd"+t]?l.i18n("cmd"+t):this.extendsCmd&&l.messages["cmd"+this.extendsCmd]?l.i18n("cmd"+this.extendsCmd):t,this.options=e.extend({},this.options,n),this.listeners=[],n.shortcuts&&("function"==typeof n.shortcuts?r=n.shortcuts(this.fm,this.shortcuts):e.isArray(n.shortcuts)&&(r=n.shortcuts),this.shortcuts=r||[]),this.updateOnSelect&&(this._handlers.select=function(){this.update(void 0,this.value)}),e.each(e.extend({},s._handlers,s.handlers),function(t,n){l.bind(t,e.proxy(n,s))}),i=0;i<this.shortcuts.length;i++)a=this.shortcuts[i],o=a.callback||s.exec,a.callback=function(){l.isCommandEnabled(s.name)&&o.call(s)},!a.description&&(a.description=this.title),l.shortcut(a);this.disableOnSearch&&l.bind("search searchend",function(e){s._disabled="search"===e.type?!0:!(this.alwaysEnabled||l.isCommandEnabled(t)),s.update(void 0,s.value)}),this.init()},this.init=function(){},this.exec=function(t,n){return e.Deferred().reject()},this.disabled=function(){return this.state<0},this.enabled=function(){return this.state>-1},this.active=function(){return this.state>0},this.getstate=function(){return-1},this.update=function(e,t){var n=this.state,i=this.value;this._disabled?this.state=-1:this.state=void 0!==e?e:this.getstate(),this.value=t,n==this.state&&i==this.value||this.change()},this.change=function(e){var t,n;if("function"==typeof e)this.listeners.push(e);else for(n=0;n<this.listeners.length;n++){t=this.listeners[n];try{t(this.state,this.value)}catch(i){this.fm.debug("error",i)}}return this},this.hashes=function(n){return n?e.map(e.isArray(n)?n:[n],function(e){return t.file(e)?e:null}):t.selected()},this.files=function(t){var n=this.fm;return t?e.map(e.isArray(t)?t:[t],function(e){return n.file(e)||null}):n.selectedFiles()}},i.prototype.resources={"class":{hover:"ui-state-hover",active:"ui-state-active",disabled:"ui-state-disabled",draggable:"ui-draggable",droppable:"ui-droppable",adroppable:"elfinder-droppable-active",cwdfile:"elfinder-cwd-file",cwd:"elfinder-cwd",tree:"elfinder-tree",treeroot:"elfinder-navbar-root",navdir:"elfinder-navbar-dir",navdirwrap:"elfinder-navbar-dir-wrapper",navarrow:"elfinder-navbar-arrow",navsubtree:"elfinder-navbar-subtree",navcollapse:"elfinder-navbar-collapsed",navexpand:"elfinder-navbar-expanded",treedir:"elfinder-tree-dir",placedir:"elfinder-place-dir",searchbtn:"elfinder-button-search",editing:"elfinder-to-editing"},tpl:{perms:'<span class="elfinder-perms"/>',lock:'<span class="elfinder-lock"/>',symlink:'<span class="elfinder-symlink"/>',navicon:'<span class="elfinder-nav-icon"/>',navspinner:'<span class="elfinder-navbar-spinner"/>',navdir:'<div class="elfinder-navbar-wrapper"><span id="{id}" class="ui-corner-all elfinder-navbar-dir {cssclass}"><span class="elfinder-navbar-arrow"/><span class="elfinder-navbar-icon" {style}/>{symlink}{permissions}{name}</span><div class="elfinder-navbar-subtree" style="display:none"/></div>',placedir:'<div class="elfinder-navbar-wrapper"><span id="{id}" class="ui-corner-all elfinder-navbar-dir {cssclass}" title="{title}"><span class="elfinder-navbar-arrow"/><span class="elfinder-navbar-icon" {style}/>{symlink}{permissions}{name}</span><div class="elfinder-navbar-subtree" style="display:none"/></div>'},mimes:{text:["application/x-empty","application/javascript","application/xhtml+xml","audio/x-mp3-playlist","application/x-web-config","application/docbook+xml","application/x-php","application/x-perl","application/x-awk","application/x-config","application/x-csh","application/xml"]},mixin:{make:function(){var t,n,i,a,r,o,s,l,d,c=this.fm,u=this.name,h=c.getUI("workzone"),p=this.origin&&"navbar"===this.origin?"tree":"cwd",f=c.getUI(p),m="tree"===p,g=m?"navHash2Id":"cwdHash2Id",v=!m&&"list"!=c.storage("view"),b=c.selected(),y=this.move||!1,w=h.hasClass("elfinder-cwd-wrapper-empty"),k=function(){U.is(":hidden")||U.addClass("ui-front").elfinderoverlay("hide").off("click",O),S.removeClass("ui-front").css("position",""),v?n.css("max-height",""):i&&i.css("width","").parent("td").css("overflow","")},x=e.Deferred().fail(function(e){r&&a.attr("class",r),w&&h.addClass("elfinder-cwd-wrapper-empty"),b&&(y&&c.trigger("unlockfiles",{files:b}),c.clipboard([]),c.trigger("selectfiles",{files:b})),e&&c.error(e)}).always(function(){k(),M(),c.enable(),c.trigger("resMixinMake")}),C="tmp_"+parseInt(1e5*Math.random()),T=m?c.file(b[0]).hash:c.cwd().hash,z=new Date,A={hash:C,phash:T,name:c.uniqueName(this.prefix,T),mime:this.mime,read:!0,write:!0,date:"Today "+z.getHours()+":"+z.getMinutes(),move:y},I=this.data||{},S=f.trigger("create."+c.namespace,A).find("#"+c[g](C)).on("unselect."+c.namespace,function(){setTimeout(function(){D&&D.blur()},50)}),U=c.getUI("overlay"),M=function(){c.unbind("resize",E),D.remove(),m&&S.closest(".elfinder-navbar-wrapper").remove(),S.remove()},O=function(e){P||(M(),e.stopPropagation(),x.reject())},D=e(v?"<textarea/>":'<input type="text"/>').on("keyup text",function(){v?(this.style.height="1px",this.style.height=this.scrollHeight+"px"):t&&(this.style.width=t+"px",this.scrollWidth>t&&(this.style.width=this.scrollWidth+10+"px"))}).keydown(function(t){t.stopImmediatePropagation(),t.keyCode==e.ui.keyCode.ESCAPE?x.reject():t.keyCode==e.ui.keyCode.ENTER&&D.blur()}).mousedown(function(e){e.stopPropagation()}).blur(function(){var t,n=e.trim(D.val()),i=D.parent(),a=!0;if(!P&&i.length){if(c.options.validName&&c.options.validName.test)try{a=c.options.validName.test(n)}catch(r){a=!1}if(!n||".."===n||!a)return P=!0,c.error("errInvName",{modal:!0,close:F}),!1;if(c.fileByName(n,T))return P=!0,c.error(["errExists",n],{modal:!0,close:F}),!1;t=b&&y?c.exec("cut",b):null,e.when(t).done(function(){k(),D.hide().before(e("<span>").text(n)),c.lockfiles({files:[C]}),c.request({data:e.extend({cmd:u,name:n,target:T},I||{}),notify:{type:u,cnt:1},preventFail:!0,syncOnFail:!0}).fail(function(e){c.unlockfiles({files:[C]}),P=!0,D.show().prev().remove(),c.error(e,{modal:!0,close:F})}).done(function(t){if(x.resolve(t),t&&t.added&&t.added[0]){var n=t.added[0],i=n.hash,a=f.find("#"+c[g](i));b&&y&&c.one(u+"done",function(){c.exec("paste",i)}),c.one(u+"done",function(){var i,r,o={directory:{cmd:"open",msg:"cmdopendir"},"text/plain":{cmd:"edit",msg:"cmdedit"},"default":{cmd:"open",msg:"cmdopen"}};a=f.find("#"+c[g](n.hash)),1===t.added.length&&(i=o[n.mime]||o["default"],r=e("<div/>").append(e('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all elfinder-tabstop"><span class="ui-button-text">'+c.i18n(i.msg)+"</span></button>").on("mouseenter mouseleave",function(t){e(this).toggleClass("ui-state-hover","mouseenter"==t.type)}).on("click",function(){c.exec(i.cmd,n.hash)}))),a.length?(a.trigger("scrolltoview"),!y&&r&&c.toast({msg:c.i18n(["complete",c.i18n("cmd"+u)]),extNode:r})):(c.trigger("selectfiles",{files:e.map(t.added,function(e){return e.hash})}),!y&&c.toast({msg:c.i18n(["complete",c.i18n("cmd"+u)]),extNode:r}))})}})}).fail(function(){x.reject()})}}),F=function(){var e=D.val().replace(/\.((tar\.(gz|bz|bz2|z|lzo))|cpio\.gz|ps\.gz|xcf\.(gz|bz2)|[a-z0-9]{1,4})$/gi,"");P=!1,c.UA.Mobile&&U.on("click",O).removeClass("ui-front").elfinderoverlay("show"),D.select().focus(),D[0].setSelectionRange&&D[0].setSelectionRange(0,e.length)},E=function(){S.trigger("scrolltoview")},P=!1;return!m&&this.disabled()||!S.length?x.reject():(m?(a=e("#"+c[g](T)),o=c.res("class","navcollapse"),s=c.res("class","navexpand"),l=c.res("class","navarrow"),d=c.res("class","navsubtree"),S.closest("."+d).show(),a.hasClass(o)||(r=a.attr("class"),a.addClass(o+" "+s+" elfinder-subtree-loaded")),a.is("."+o+":not(."+s+")")&&a.children("."+l).click().data("dfrd").done(function(){D.val()===A.name&&D.val(c.uniqueName(this.prefix,T)).select().focus()}.bind(this)),n=S.contents().filter(function(){return 3==this.nodeType&&e(this).parent().attr("id")===c.navHash2Id(A.hash)}),n.replaceWith(D.val(A.name))):(w&&h.removeClass("elfinder-cwd-wrapper-empty"),n=S.find(".elfinder-cwd-filename"),i=n.parent(),S.css("position","relative").addClass("ui-front"),v?n.css("max-height","none"):(t=i.width(),i.width(t-15).parent("td").css("overflow","visible")),n.empty("").append(D.val(A.name))),c.bind("resize",E),D.trigger("keyup"),F(),x)}},blink:function(e,t){var n,i={slowonce:function(){e.hide().delay(250).fadeIn(750).delay(500).fadeOut(3500)},lookme:function(){e.show().fadeOut(500).fadeIn(750)}};t=t||"slowonce",n=i[t]||i.lookme,e.stop(!0,!0),n()}},e.fn.dialogelfinder=function(t){var n="elfinderPosition",i="elfinderDestroyOnClose";if(this.not(".elfinder").each(function(){var a=(e(document),e('<div class="ui-widget-header dialogelfinder-drag ui-corner-top">'+(t.title||"Files")+"</div>")),r=(e('<a href="#" class="dialogelfinder-drag-close ui-corner-all"><span class="ui-icon ui-icon-closethick"> </span></a>').appendTo(a).click(function(e){e.preventDefault(),r.dialogelfinder("close")}),e(this).addClass("dialogelfinder").css("position","absolute").hide().appendTo("body").draggable({handle:".dialogelfinder-drag",containment:"window",stop:function(){r.trigger("resize"),o.trigger("resize")}}).elfinder(t).prepend(a)),o=r.elfinder("instance");r.width(parseInt(r.width())||840).data(i,!!t.destroyOnClose).find(".elfinder-toolbar").removeClass("ui-corner-top"),t.position&&r.data(n,t.position),t.autoOpen!==!1&&e(this).dialogelfinder("open")}),"open"==t){var a=e(this),r=a.data(n)||{top:parseInt(e(document).scrollTop()+(e(window).height()<a.height()?2:(e(window).height()-a.height())/2)),left:parseInt(e(document).scrollLeft()+(e(window).width()<a.width()?2:(e(window).width()-a.width())/2))};a.is(":hidden")&&(a.addClass("ui-front").css(r).show().trigger("resize"),setTimeout(function(){a.trigger("resize").mousedown()},200))}else if("close"==t){var a=e(this).removeClass("ui-front");a.is(":visible")&&(a.data(i)?a.elfinder("destroy").remove():a.elfinder("close"))}else if("instance"==t)return e(this).getElFinder();return this},"function"==typeof i&&i.prototype.i18&&(i.prototype.i18.en={translator:"Troex Nevelin &lt;troex@fury.scancode.ru&gt;",language:"English",direction:"ltr",dateFormat:"M d, Y h:i A",fancyDateFormat:"$1 h:i A",messages:{error:"Error",errUnknown:"Unknown error.",errUnknownCmd:"Unknown command.",errJqui:"Invalid jQuery UI configuration. Selectable, draggable and droppable components must be included.",errNode:"elFinder requires DOM Element to be created.",errURL:"Invalid elFinder configuration! URL option is not set.",errAccess:"Access denied.",errConnect:"Unable to connect to backend.",errAbort:"Connection aborted.",errTimeout:"Connection timeout.",errNotFound:"Backend not found.",errResponse:"Invalid backend response.",errConf:"Invalid backend configuration.",errJSON:"PHP JSON module not installed.",errNoVolumes:"Readable volumes not available.",errCmdParams:'Invalid parameters for command "$1".',errDataNotJSON:"Data is not JSON.",errDataEmpty:"Data is empty.",errCmdReq:"Backend request requires command name.",errOpen:'Unable to open "$1".',errNotFolder:"Object is not a folder.",errNotFile:"Object is not a file.",errRead:'Unable to read "$1".',errWrite:'Unable to write into "$1".',errPerm:"Permission denied.",errLocked:'"$1" is locked and can not be renamed, moved or removed.',errExists:'File named "$1" already exists.',errInvName:"Invalid file name.",errFolderNotFound:"Folder not found.",errFileNotFound:"File not found.",errTrgFolderNotFound:'Target folder "$1" not found.',errPopup:"Browser prevented opening popup window. To open file enable it in browser options.",errMkdir:'Unable to create folder "$1".',errMkfile:'Unable to create file "$1".',errRename:'Unable to rename "$1".',errCopyFrom:'Copying files from volume "$1" not allowed.',errCopyTo:'Copying files to volume "$1" not allowed.',errMkOutLink:"Unable to create a link to outside the volume root.",errUpload:"Upload error.",errUploadFile:'Unable to upload "$1".',errUploadNoFiles:"No files found for upload.",errUploadTotalSize:"Data exceeds the maximum allowed size.",errUploadFileSize:"File exceeds maximum allowed size.",errUploadMime:"File type not allowed.",errUploadTransfer:'"$1" transfer error.',errUploadTemp:"Unable to make temporary file for upload.",errNotReplace:'Object "$1" already exists at this location and can not be replaced by object with another type.',errReplace:'Unable to replace "$1".',errSave:'Unable to save "$1".',errCopy:'Unable to copy "$1".',errMove:'Unable to move "$1".',errCopyInItself:'Unable to copy "$1" into itself.',errRm:'Unable to remove "$1".',errRmSrc:"Unable remove source file(s).",errExtract:'Unable to extract files from "$1".',errArchive:"Unable to create archive.",errArcType:"Unsupported archive type.",errNoArchive:"File is not archive or has unsupported archive type.",errCmdNoSupport:"Backend does not support this command.",errReplByChild:'The folder "$1" can\'t be replaced by an item it contains.',errArcSymlinks:"For security reason denied to unpack archives contains symlinks or files with not allowed names.",errArcMaxSize:"Archive files exceeds maximum allowed size.",errResize:'Unable to resize "$1".',errResizeDegree:"Invalid rotate degree.",errResizeRotate:"Unable to rotate image.",errResizeSize:"Invalid image size.",errResizeNoChange:"Image size not changed.",errUsupportType:"Unsupported file type.",errNotUTF8Content:'File "$1" is not in UTF-8 and cannot be edited.',errNetMount:'Unable to mount "$1".',errNetMountNoDriver:"Unsupported protocol.",errNetMountFailed:"Mount failed.",errNetMountHostReq:"Host required.",errSessionExpires:"Your session has expired due to inactivity.",errCreatingTempDir:'Unable to create temporary directory: "$1"',errFtpDownloadFile:'Unable to download file from FTP: "$1"',errFtpUploadFile:'Unable to upload file to FTP: "$1"',errFtpMkdir:'Unable to create remote directory on FTP: "$1"',errArchiveExec:'Error while archiving files: "$1"',errExtractExec:'Error while extracting files: "$1"',errNetUnMount:"Unable to unmount",errConvUTF8:"Not convertible to UTF-8",errFolderUpload:"Try the modern browser, If you'd like to upload the folder.",errSearchTimeout:'Timed out while searching "$1". Search result is partial.',errReauthRequire:"Re-authorization is required.",errMaxTargets:"Max number of selectable items is $1.",cmdarchive:"Create archive",cmdback:"Back",cmdcopy:"Copy",cmdcut:"Cut",cmddownload:"Download",cmdduplicate:"Duplicate",cmdedit:"Edit file",cmdextract:"Extract files from archive",cmdforward:"Forward",cmdgetfile:"Select files",cmdhelp:"About this software",cmdhome:"Home",cmdinfo:"Get info",cmdmkdir:"New folder",cmdmkdirin:"Into New Folder",cmdmkfile:"New text file",cmdopen:"Open",cmdpaste:"Paste",cmdquicklook:"Preview",cmdreload:"Reload",cmdrename:"Rename",cmdrm:"Delete",cmdsearch:"Find files",cmdup:"Go to parent directory",cmdupload:"Upload files",cmdview:"View",cmdresize:"Resize & Rotate",cmdsort:"Sort",cmdnetmount:"Mount network volume",cmdnetunmount:"Unmount",cmdplaces:"To Places",cmdchmod:"Change mode",cmdopendir:"Open a folder",cmdcolwidth:"Reset column width",cmdfullscreen:"Full Screen",cmdmove:"Move",btnClose:"Close",btnSave:"Save",btnRm:"Remove",btnApply:"Apply",btnCancel:"Cancel",btnNo:"No",btnYes:"Yes",btnMount:"Mount",btnApprove:"Goto $1 & approve",btnUnmount:"Unmount",btnConv:"Convert",btnCwd:"Here",btnVolume:"Volume",btnAll:"All",btnMime:"MIME Type",btnFileName:"Filename",btnSaveClose:"Save & Close",btnBackup:"Backup",ntfopen:"Open folder",ntffile:"Open file",ntfreload:"Reload folder content",ntfmkdir:"Creating directory",ntfmkfile:"Creating files",ntfrm:"Delete files",ntfcopy:"Copy files",ntfmove:"Move files",ntfprepare:"Prepare to copy files",ntfrename:"Rename files",ntfupload:"Uploading files",ntfdownload:"Downloading files",ntfsave:"Save files",ntfarchive:"Creating archive",ntfextract:"Extracting files from archive",ntfsearch:"Searching files",ntfresize:"Resizing images",ntfsmth:"Doing something",ntfloadimg:"Loading image",ntfnetmount:"Mounting network volume",ntfnetunmount:"Unmounting network volume",ntfdim:"Acquiring image dimension",ntfreaddir:"Reading folder infomation",ntfurl:"Getting URL of link",ntfchmod:"Changing file mode",ntfpreupload:"Verifying upload file name",ntfzipdl:"Creating a file for download",ntfparents:"Getting path infomation",ntfchunkmerge:"Processing the uploaded file",dateUnknown:"unknown",Today:"Today",Yesterday:"Yesterday",msJan:"Jan",msFeb:"Feb",msMar:"Mar",msApr:"Apr",msMay:"May",msJun:"Jun",msJul:"Jul",msAug:"Aug",msSep:"Sep",msOct:"Oct",msNov:"Nov",msDec:"Dec",January:"January",February:"February",March:"March",April:"April",May:"May",June:"June",July:"July",August:"August",September:"September",October:"October",November:"November",December:"December",Sunday:"Sunday",Monday:"Monday",Tuesday:"Tuesday",Wednesday:"Wednesday",Thursday:"Thursday",Friday:"Friday",Saturday:"Saturday",Sun:"Sun",Mon:"Mon",Tue:"Tue",Wed:"Wed",Thu:"Thu",Fri:"Fri",Sat:"Sat",sortname:"by name",sortkind:"by kind",sortsize:"by size",sortdate:"by date",sortFoldersFirst:"Folders first",sortperm:"by permission",sortmode:"by mode",sortowner:"by owner",sortgroup:"by group",sortAlsoTreeview:"Also Treeview","untitled file.txt":"NewFile.txt","untitled folder":"NewFolder",Archive:"NewArchive",confirmReq:"Confirmation required",confirmRm:"Are you sure you want to remove files?<br/>This cannot be undone!",confirmRepl:"Replace old file with new one?",confirmConvUTF8:"Not in UTF-8<br/>Convert to UTF-8?<br/>Contents become UTF-8 by saving after conversion.",confirmNonUTF8:"Character encoding of this file couldn't be detected. It need to temporarily convert to UTF-8 for editting.<br/>Please select character encoding of this file.",confirmNotSave:"It has been modified.<br/>Losing work if you do not save changes.",apllyAll:"Apply to all",name:"Name",size:"Size",perms:"Permissions",modify:"Modified",kind:"Kind",read:"read",write:"write",noaccess:"no access",and:"and",unknown:"unknown",selectall:"Select all files",selectfiles:"Select file(s)",selectffile:"Select first file",selectlfile:"Select last file",viewlist:"List view",viewicons:"Icons view",places:"Places",calc:"Calculate",path:"Path",aliasfor:"Alias for",locked:"Locked",dim:"Dimensions",files:"Files",folders:"Folders",items:"Items",yes:"yes",no:"no",link:"Link",searcresult:"Search results",selected:"selected items",about:"About",shortcuts:"Shortcuts",help:"Help",webfm:"Web file manager",ver:"Version",protocolver:"protocol version",homepage:"Project home",docs:"Documentation",github:"Fork us on Github",twitter:"Follow us on twitter",facebook:"Join us on facebook",team:"Team",chiefdev:"chief developer",developer:"developer",contributor:"contributor",maintainer:"maintainer",translator:"translator",icons:"Icons",dontforget:"and don't forget to take your towel",shortcutsof:"Shortcuts disabled",dropFiles:"Drop files here",or:"or",selectForUpload:"Select files",moveFiles:"Move files",copyFiles:"Copy files",rmFromPlaces:"Remove from places",aspectRatio:"Aspect ratio",scale:"Scale",width:"Width",height:"Height",resize:"Resize",crop:"Crop",rotate:"Rotate","rotate-cw":"Rotate 90 degrees CW","rotate-ccw":"Rotate 90 degrees CCW",degree:"°",netMountDialogTitle:"Mount network volume",protocol:"Protocol",host:"Host",port:"Port",user:"User",pass:"Password",confirmUnmount:"Are you unmount $1?",dropFilesBrowser:"Drop or Paste files from browser",dropPasteFiles:"Drop files, Paste URLs or images(clipboard) here",encoding:"Encoding",locale:"Locale",searchTarget:"Target: $1",searchMime:"Search by input MIME Type",owner:"Owner",group:"Group",other:"Other",execute:"Execute",perm:"Permission",mode:"Mode",emptyFolder:"Folder is empty",emptyFolderDrop:"Folder is empty\\A Drop to add items",emptyFolderLTap:"Folder is empty\\A Long tap to add items",quality:"Quality",autoSync:"Auto sync",moveUp:"Move up",getLink:"Get URL link",selectedItems:"Selected items ($1)",folderId:"Folder ID",offlineAccess:"Allow offline access",reAuth:"To re-authenticate",nowLoading:"Now loading...",openMulti:"Open multiple files",openMultiConfirm:"You are trying to open the $1 files. Are you sure you want to open in browser?",emptySearch:"Search results is empty in search target.",editingFile:"It is editing a file.",hasSelected:"You have selected $1 items.",hasClipboard:"You have $1 items in the clipboard.",incSearchOnly:"Incremental search is only from the current view.",reinstate:"Reinstate",complete:"$1 complete",contextmenu:"Context menu",pageTurning:"Page turning",volumeRoots:"Volume roots",reset:"Reset",bgcolor:"Background color",colorPicker:"Color picker","8pxgrid":"8px Grid",enabled:"Enabled",disabled:"Disabled",emptyIncSearch:"Search results is empty in current view.\\APress [Enter] to expand search target.",textLabel:"Text label",minsLeft:"$1 mins left",openAsEncoding:"Reopen with selected encoding",saveAsEncoding:"Save with the selected encoding",selectFolder:"Select folder",kindUnknown:"Unknown",kindRoot:"Volume Root",kindFolder:"Folder",kindAlias:"Alias",kindAliasBroken:"Broken alias",kindApp:"Application",kindPostscript:"Postscript document",kindMsOffice:"Microsoft Office document",kindMsWord:"Microsoft Word document",kindMsExcel:"Microsoft Excel document",kindMsPP:"Microsoft Powerpoint presentation",kindOO:"Open Office document",kindAppFlash:"Flash application",kindPDF:"Portable Document Format (PDF)",kindTorrent:"Bittorrent file",kind7z:"7z archive",kindTAR:"TAR archive",kindGZIP:"GZIP archive",kindBZIP:"BZIP archive",kindXZ:"XZ archive",kindZIP:"ZIP archive",kindRAR:"RAR archive",kindJAR:"Java JAR file",kindTTF:"True Type font",kindOTF:"Open Type font",kindRPM:"RPM package",kindText:"Text document",kindTextPlain:"Plain text",kindPHP:"PHP source",kindCSS:"Cascading style sheet",kindHTML:"HTML document",kindJS:"Javascript source",kindRTF:"Rich Text Format",kindC:"C source",kindCHeader:"C header source",kindCPP:"C++ source",kindCPPHeader:"C++ header source",kindShell:"Unix shell script",kindPython:"Python source",kindJava:"Java source",kindRuby:"Ruby source",kindPerl:"Perl script",kindSQL:"SQL source",kindXML:"XML document",kindAWK:"AWK source",kindCSV:"Comma separated values",kindDOCBOOK:"Docbook XML document",kindMarkdown:"Markdown text",kindImage:"Image",kindBMP:"BMP image",kindJPEG:"JPEG image",kindGIF:"GIF Image",kindPNG:"PNG Image",kindTIFF:"TIFF image",kindTGA:"TGA image",kindPSD:"Adobe Photoshop image",kindXBITMAP:"X bitmap image",kindPXM:"Pixelmator image",kindAudio:"Audio media",kindAudioMPEG:"MPEG audio",kindAudioMPEG4:"MPEG-4 audio",kindAudioMIDI:"MIDI audio",kindAudioOGG:"Ogg Vorbis audio",kindAudioWAV:"WAV audio",AudioPlaylist:"MP3 playlist",kindVideo:"Video media",kindVideoDV:"DV movie",kindVideoMPEG:"MPEG movie",kindVideoMPEG4:"MPEG-4 movie",kindVideoAVI:"AVI movie",kindVideoMOV:"Quick Time movie",kindVideoWM:"Windows Media movie",kindVideoFlash:"Flash movie",kindVideoMKV:"Matroska movie",kindVideoOGG:"Ogg movie"}}),e.fn.elfinderbutton=function(t){return this.each(function(){var n,i="class",a=t.fm,r=a.res(i,"disabled"),o=a.res(i,"active"),s=a.res(i,"hover"),l="elfinder-button-menu-item",d="elfinder-button-menu-item-selected",c=e('<span class="elfinder-button-text">'+t.title+"</span>"),u=e(this).addClass("ui-state-default elfinder-button").attr("title",t.title).append('<span class="elfinder-button-icon elfinder-button-icon-'+(t.className?t.className:t.name)+'"/>',c).hover(function(e){!u.hasClass(r)&&u["mouseleave"==e.type?"removeClass":"addClass"](s)}).click(function(e){u.hasClass(r)||(n&&t.variants.length>1?(n.is(":hidden")&&t.fm.getUI().click(),e.stopPropagation(),n.slideToggle(100)):t.exec())}),h=function(){n.hide()};c.hide(),e.isArray(t.variants)&&(u.addClass("elfinder-menubutton"),n=e('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu ui-corner-all"/>').hide().appendTo(u).on("mouseenter mouseleave","."+l,function(){e(this).toggleClass(s)}).on("click","."+l,function(i){i.preventDefault(),i.stopPropagation(),u.removeClass(s),n.hide(),t.exec(t.fm.selected(),e(this).data("value"))}),t.fm.bind("disable select",h).getUI().click(h),t.change(function(){n.html(""),e.each(t.variants,function(i,a){n.append(e('<div class="'+l+'">'+a[1]+"</div>").data("value",a[0]).addClass(a[0]==t.value?d:""))})})),t.change(function(){t.disabled()?u.removeClass(o+" "+s).addClass(r):(u.removeClass(r),u[t.active()?"addClass":"removeClass"](o))}).change()})},e.fn.elfindercontextmenu=function(t){return this.each(function(){var n,i,a,r,o,s,l,d="elfinder-contextmenu-item",c="elfinder-contextsubmenu-item",u="elfinder-contextmenu-extra-icon",h={distance:8,start:function(){p.data("touching")&&p.find(".ui-state-hover").removeClass("ui-state-hover")},stop:function(){p.data("draged",!0)}},p=e(this).addClass("touch-punch ui-helper-reset ui-front ui-widget ui-state-default ui-corner-all elfinder-contextmenu elfinder-contextmenu-"+t.direction).hide().on("touchstart",function(e){p.data("touching",!0)}).on("touchend",function(e){p.removeData("touching")}).on("mouseenter mouseleave","."+d,function(t){e(this).toggleClass("ui-state-hover",!("mouseenter"!==t.type&&(p.data("draged")||!p.data("submenuKeep")))),p.data("draged")&&p.data("submenuKeep")&&p.find(".elfinder-contextmenu-sub:visible").parent().addClass("ui-state-hover")}).on("mouseenter mouseleave","."+u,function(t){e(this).parent().toggleClass("ui-state-hover","mouseleave"===t.type)}).on("mouseenter mouseleave","."+d+",."+c,function(t){var n=function(t,n){e.each(n?o:a,function(e,i){return t[0]===i?((n?o:a)._cur=e,n?s=t:r=t,!1):void 0})};if(t.originalEvent){var i=e(this);"mouseenter"===t.type?i.hasClass(c)?(s&&s.removeClass("ui-state-hover"),o=r.find("div."+c),n(i,!0)):(r&&r.removeClass("ui-state-hover"),n(i)):i.hasClass(c)?(s=null,o=null):(r&&r.removeClass("ui-state-hover"),function(e){setTimeout(function(){e===r&&(r=null)},250)}(r))}}).on("contextmenu",function(){return!1}).on("mouseup",function(){setTimeout(function(){p.removeData("draged")},100)}).draggable(h),f="ltr"==t.direction?"left":"right",m=e.extend({},t.options.contextmenu),g='<div class="'+d+'{className}"><span class="elfinder-button-icon {icon} elfinder-contextmenu-icon"{style}/><span>{label}</span></div>',v=function(n,i,a,r){var o="",s="",l="";return r&&(r.className&&(o=" "+r.className),r.iconClass&&(l=r.iconClass,i=""),r.iconImg&&(s=" style=\"background:url('"+t.escape(r.iconImg)+"') 0 0 no-repeat;background-size:contain;\"")),e(g.replace("{icon}",i?"elfinder-button-icon-"+i:l?l:"").replace("{label}",n).replace("{style}",s).replace("{className}",o)).click(function(e){e.stopPropagation(),e.preventDefault(),a()})},b=function(){var n="touchstart.contextmenuAutoToggle";p.data("hideTm")&&clearTimeout(p.data("hideTm")),p.is(":visible")&&p.on("touchstart",function(e){e.originalEvent.touches.length>1||(p.stop().show(),p.data("hideTm")&&clearTimeout(p.data("hideTm")))}).data("hideTm",setTimeout(function(){i.find(".elfinder-cwd-file").off(n),i.find(".elfinder-cwd-file.ui-selected").one(n,function(t){if(!(t.originalEvent.touches.length>1)){var a=e(t.target);return!p.first().length||a.is("input:checkbox")||a.hasClass("elfinder-cwd-select")?void i.find(".elfinder-cwd-file").off(n):(w(t.originalEvent.touches[0].pageX,t.originalEvent.touches[0].pageY),!1)}}).one("unselect."+t.namespace,function(){i.find(".elfinder-cwd-file").off(n)}),p.fadeOut({duration:300,fail:function(){p.css("opacity","1").show()}})},4500))},y=function(n){var i=n.keyCode,l=e.ui.keyCode.ESCAPE,d=e.ui.keyCode.ENTER,u=e.ui.keyCode.LEFT,h=e.ui.keyCode.RIGHT,p=e.ui.keyCode.UP,f=e.ui.keyCode.DOWN,m="ltr"===t.direction?h:u,g=m===h?u:h;-1!==e.inArray(i,[l,d,u,h,p,f])&&(n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation(),i==l||i===g?r&&o&&s?(s.trigger("mouseleave"),r.addClass("ui-state-hover"),o=null,s=null):i==l&&k():i==p||i==f?o?(s&&s.trigger("mouseleave"),i==f&&(!s||o.length<=++o._cur)?o._cur=0:i==p&&(!s||--o._cur<0)&&(o._cur=o.length-1),s=o.eq(o._cur).trigger("mouseenter")):(o=null,r&&r.trigger("mouseleave"),i==f&&(!r||a.length<=++a._cur)?a._cur=0:i==p&&(!r||--a._cur<0)&&(a._cur=a.length-1),r=a.eq(a._cur).addClass("ui-state-hover")):!r||i!=d&&i!==m||(r.hasClass("elfinder-contextmenu-group")?s?i==d&&s.click():(r.trigger("mouseenter"),o=r.find("div."+c),o._cur=0,s=o.first().addClass("ui-state-hover")):i==d&&r.click()))},w=function(i,a,d){var c,u=p.outerWidth(),h=p.outerHeight(),m=n.attr("style"),g=n.offset(),v=n.width(),w=n.height(),k=t.UA.Mobile?40:2,x=t.UA.Mobile?20:2,i=i-(g?g.left:0),a=a-(g?g.top:0),d=e.extend(d||{},{top:Math.max(0,w>a+x+h?a+x:a-(a+h-w)),left:Math.max(0,u+k>i||v>i+k+u?i+k:i-k-u),opacity:"1"});l=!0,t.autoSync("stop"),t.toFront(p),n.width(v),p.stop().removeAttr("style").css(d).show(),n.attr("style",m),d[f]=parseInt(p.width()),p.find(".elfinder-contextmenu-sub").css(d),t.UA.iOS&&e("div.elfinder div.overflow-scrolling-touch").css("-webkit-overflow-scrolling","auto"),r=null,o=null,s=null,e(document).on("keydown."+t.namespace,y),c=e._data(document).events,c&&c.keydown&&c.keydown.unshift(c.keydown.pop()),t.UA.Mobile&&b()},k=function(){if(e(document).off("keydown."+t.namespace,y),T=null,p.is(":visible")||p.children().length){p.removeAttr("style").hide().empty().removeData("submenuKeep");
try{p.draggable("instance")||p.draggable(h)}catch(n){p.hasClass("ui-draggable")||p.draggable(h)}p.data("prevNode")&&(p.data("prevNode").after(p),p.removeData("prevNode")),t.trigger("closecontextmenu"),t.UA.iOS&&e("div.elfinder div.overflow-scrolling-touch").css("-webkit-overflow-scrolling","touch")}l&&t.searchStatus.state<1&&!t.searchStatus.ininc&&t.autoSync(),l=!1},x=function(i,r){var o=!1,s=!1,l={},u=[],h="cwd"===i,g=0;T=i,p.data("cmdMaps")&&e.each(p.data("cmdMaps"),function(e,t){return 0==r[0].indexOf(e,0)?(l=t,!1):void 0}),h||(u=t.getDisabledCmds(r)),"navbar"===i&&t.select({selected:r,origin:"navbar"}),g=t.selected().length,g>1&&p.append('<div class="ui-corner-top ui-widget-header elfinder-contextmenu-header"><span>'+t.i18n("selectedItems",""+g)+"</span></div>"),a=e(),e.each(m[i]||[],function(a,m){var g,b,y,w;if("|"===m)return void(o&&(s=!0));if(l[m]&&(m=l[m]),g=t.getCommand(m),!g||h||t.searchStatus.state&&g.disableOnSearch||(g.__disabled=g._disabled,g._disabled=!(g.alwaysEnabled||(t._commands[m]?-1===e.inArray(m,u):!1)),e.each(g.linkedCmds,function(n,i){var a;(a=t.getCommand(i))&&(a.__disabled=a._disabled,a._disabled=!(a.alwaysEnabled||(t._commands[i]?-1===e.inArray(i,u):!1)))})),g&&-1!=g.getstate(r)){if(g.variants){if(!g.variants.length)return;b=v(g.title,g.className?g.className:g.name,function(){}),y=e('<div class="ui-front ui-corner-all elfinder-contextmenu-sub"/>').hide().appendTo(b.append('<span class="elfinder-contextmenu-arrow"/>')),w=function(e){if(e){var i=n.attr("style");n.width(n.width()),y.css({left:"auto",right:"auto"});var a,r,o,s=b.offset(),l=s.left,d=s.top,c=b.outerWidth(),u=y.outerWidth(!0),h=y.outerHeight(!0),m=n.offset(),g=m.left+n.width(),v=m.top+n.height();o=l+c+u-g,a=l>u&&o>0?t.UA.Mobile?10-u:c-o:c,"right"===f&&u>l&&(a=t.UA.Mobile?30-c:c-(u-l)),o=d+5+h-v,r=o>0&&v>d?5-o:o>0?30-h:5,p.find(".elfinder-contextmenu-sub:visible").hide().parent().removeClass("ui-state-hover"),y.css({top:r}).css(f,a).show(),n.attr("style",i)}else y.hide()},b.addClass("elfinder-contextmenu-group").on("touchstart",".elfinder-contextmenu-sub",function(e){b.data("touching",!0)}).on("mouseleave",".elfinder-contextmenu-sub",function(e){p.data("draged")||p.removeData("submenuKeep")}).on("click","."+c,function(t){var n;t.stopPropagation(),p.data("draged")||(p.hide(),n=e(this).data("exec"),e.isPlainObject(n)&&(n._currentType=i),k(),g.exec(r,n))}).on("touchend",function(e){p.data("submenuKeep",!0)}).on("mouseenter mouseleave",function(e){"mouseleave"===e.type?p.data("submenuKeep")||b.data("timer",setTimeout(function(){b.removeData("timer"),w(!1)},250)):(b.data("timer")&&(clearTimeout(b.data("timer")),b.removeData("timer")),b.data("touching")||w(!0)),b.removeData("touching")}),e.each(g.variants,function(t,n){y.append("|"===n?'<div class="elfinder-contextmenu-separator"/>':e('<div class="'+d+" "+c+'"><span>'+n[1]+"</span></div>").data("exec",n[0]))})}else b=v(g.title,g.className?g.className:g.name,function(){p.data("draged")||(k(),g.exec(r,{_currentType:i}))}),g.extra&&g.extra.node?(e('<span class="elfinder-button-icon elfinder-button-icon-'+(g.extra.icon||"")+' elfinder-contextmenu-extra-icon"/>').append(g.extra.node).appendTo(b),e(g.extra.node).trigger("ready")):b.remove(".elfinder-contextmenu-extra-icon");g.extendsCmd&&b.children("span.elfinder-button-icon").addClass("elfinder-button-icon-"+g.extendsCmd),s&&p.append('<div class="elfinder-contextmenu-separator"/>'),p.append(b),o=!0,s=!1}g&&"undefined"!=typeof g.__disabled&&(g._disabled=g.__disabled,delete g.__disabled,e.each(g.linkedCmds,function(e,n){var i;(i=t.getCommand(n))&&(i._disabled=i.__disabled,delete i.__disabled)}))}),a=p.children("div."+d)},C=function(t){T="raw",e.each(t,function(e,t){var n;"|"===t?p.append('<div class="elfinder-contextmenu-separator"/>'):t.label&&"function"==typeof t.callback&&(n=v(t.label,t.icon,function(){p.data("draged")||(!t.remain&&k(),t.callback())},t.options||null),p.append(n))}),a=p.children("div."+d)},T=null;t.one("load",function(){n=t.getUI(),i=t.getUI("cwd"),t.bind("contextmenu",function(n){var a,r=n.data,o={};r.type&&"files"===r.type||i.trigger("unselectall"),k(),r.type&&r.targets?x(r.type,r.targets):r.raw&&C(r.raw),p.children().length&&(a=r.prevNode||null,a&&(p.data("prevNode",p.prev()),a.after(p)),r.fitHeight&&(o={maxHeight:Math.min(t.getUI().height(),e(window).height()),overflowY:"auto"},p.draggable("destroy").removeClass("ui-draggable")),w(r.x,r.y,o))}).one("destroy",function(){p.remove()}).bind("disable",k).bind("select",function(){"files"===T&&k()}).getUI().click(k)}).shortcut({pattern:"mac"===t.OS?"ctrl+m":"contextmenu shift+f10",description:"contextmenu",callback:function(n){n.stopPropagation(),n.preventDefault(),e(document).one("contextmenu."+t.namespace,function(e){e.preventDefault(),e.stopPropagation()});var i,a,r,o,s=t.selected();s.length?(i="files",a=s,o=e("#"+t.cwdHash2Id(s[0]))):(i="cwd",a=[t.cwd().hash],r=t.getUI("workzone").offset()),o&&o.length||(o=t.getUI("workzone")),r=o.offset(),r.top+=o.height()/2,r.left+=o.width()/2,t.trigger("contextmenu",{type:i,targets:a,x:r.left,y:r.top})}})})},e.fn.elfindercwd=function(t,n){return this.not(".elfinder-cwd").each(function(){var i,a=t.UA.Mobile,r="list"==t.viewType,o="select."+t.namespace,s="unselect."+t.namespace,l="disable."+t.namespace,d="enable."+t.namespace,c="class",u=t.res(c,"cwdfile"),h="."+u,p="ui-selected",f=t.res(c,"disabled"),m=t.res(c,"draggable"),g=t.res(c,"droppable"),v=t.res(c,"hover"),b=t.res(c,"adroppable"),y=u+"-tmp",w=t.options.loadTmbs>0?t.options.loadTmbs:5,k="",x={},C=[],T=[],z=void 0,A=[],I=function(){for(var e="",t=0;t<A.length;t++)e+='<td class="elfinder-col-'+A[t]+'">{'+A[t]+"}</td>";return e},S=function(){return'<tr id="{id}" class="'+u+' {permsclass} {dirclass}" title="{tooltip}"{css}><td class="elfinder-col-name"><div class="elfinder-cwd-file-wrapper"><span class="elfinder-cwd-icon {mime}"{style}/>{marker}<span class="elfinder-cwd-filename">{name}</span></div>'+U+"</td>"+I()+"</tr>"},U=e.map(n.showSelectCheckboxUA,function(e){return t.UA[e]||e.match(/^all$/i)?!0:null}).length?'<div class="elfinder-cwd-select"><input type="checkbox"></div>':"",M=!1,O=null,D={icon:'<div id="{id}" class="'+u+' {permsclass} {dirclass} ui-corner-all" title="{tooltip}"><div class="elfinder-cwd-file-wrapper ui-corner-all"><div class="elfinder-cwd-icon {mime} ui-corner-all" unselectable="on"{style}/>{marker}</div><div class="elfinder-cwd-filename" title="{nametitle}">{name}</div>'+U+"</div>",row:""},F=t.res("tpl","perms"),E=t.res("tpl","lock"),P=t.res("tpl","symlink"),R={id:function(e){return t.cwdHash2Id(e.hash)},name:function(e){var n=t.escape(e.i18||e.name);return!r&&(n=n.replace(/([_.])/g,"&#8203;$1")),n},nametitle:function(e){return t.escape(e.i18||e.name)},permsclass:function(e){return t.perms2class(e)},perm:function(e){return t.formatPermissions(e)},dirclass:function(e){var i="directory"==e.mime?"directory":"";return e.isroot&&(i+=" isroot"),e.csscls&&(i+=" "+t.escape(e.csscls)),n.getClass&&(i+=" "+n.getClass(e)),i},style:function(e){return e.icon?"style=\"background:url('"+t.escape(e.icon)+"') 0 0 no-repeat;background-size:contain;\"":""},mime:function(e){return t.mime2class(e.mime)},size:function(e){return"directory"!==e.mime||e.size?t.formatSize(e.size):"-"},date:function(e){return t.formatDate(e)},kind:function(e){return t.mime2kind(e)},mode:function(e){return e.perm?t.formatFileMode(e.perm):""},modestr:function(e){return e.perm?t.formatFileMode(e.perm,"string"):""},modeoct:function(e){return e.perm?t.formatFileMode(e.perm,"octal"):""},modeboth:function(e){return e.perm?t.formatFileMode(e.perm,"both"):""},marker:function(e){return(e.alias||"symlink-broken"==e.mime?P:"")+(e.read&&e.write?"":F)+(e.locked?E:"")},tooltip:function(e){var n=t.formatDate(e)+(e.size>0?" ("+t.formatSize(e.size)+")":""),i="";return i=k&&e.path?t.escape(e.path.replace(/\/[^\/]*$/,"")):e.tooltip?t.escape(e.tooltip).replace(/\r/g,"&#13;"):"",r&&(i+=(i?"&#13;":"")+t.escape(e.i18||e.name)),i?i+"&#13;"+n:n}},j=function(e){return D[r?"row":"icon"].replace(/\{([a-z0-9_]+)\}/g,function(n,i){return R[i]?R[i](e,t):e[i]?e[i]:""})},H=e(),N=!1,q=function(t,n){function i(e,t){return e[t+"All"]("[id]:not(."+f+"):not(.elfinder-cwd-parent):first")}var a,l,d,c,u,h=e.ui.keyCode,m=t==h.LEFT||t==h.UP,g=ge.find("[id]."+p);if(g.length)if(a=g.filter(m?":first":":last"),d=i(a,m?"prev":"next"),d.length)if(r||t==h.LEFT||t==h.RIGHT)l=d;else if(c=a.position().top,u=a.position().left,l=a,m){do l=l.prev("[id]");while(l.length&&!(l.position().top<c&&l.position().left<=u));l.hasClass(f)&&(l=i(l,"next"))}else{do l=l.next("[id]");while(l.length&&!(l.position().top>c&&l.position().left>=u));l.hasClass(f)&&(l=i(l,"prev")),l.length||(d=ge.find("[id]:not(."+f+"):last"),d.position().top>c&&(l=d))}else l=a;else l=H.length?m?H.prev():H:ge.find("[id]:not(."+f+"):not(.elfinder-cwd-parent):"+(m?"last":"first"));l&&l.length&&!l.hasClass("elfinder-cwd-parent")&&(a&&n?l=a.add(a[m?"prevUntil":"nextUntil"]("#"+l.attr("id"))).add(l):g.trigger(s),l.trigger(o),K(l.filter(m?":first":":last")),$())},_=[],L=function(n){e("#"+t.cwdHash2Id(n)).trigger(o)},W=function(){t.cwd().hash;U&&ye.find("input").prop("checked",!0),t.lazy(function(){var n;ge.find("[id]:not(."+p+"):not(.elfinder-cwd-parent)").trigger(o),t.maxTargets&&(z||T).length>t.maxTargets?(n=e.map(z||T,function(e){return t.file(e)||null}),n=t.sortFiles(n),_=e.map(n,function(e){return e.hash})):_=(z||T).concat(),$(),U&&ye.data("pending",!1)},0,{repaint:!0})},B=function(){U&&ye.find("input").prop("checked",!1),_.length?(N=!1,_=[],ge.find("[id]."+p).trigger(s),U&&ge.find("input:checkbox").prop("checked",!1)):t.select({selected:[]}),$(),U&&ye.data("pending",!1),ge.removeClass("elfinder-cwd-allselected")},V=void 0,$=function(){if(U){var e=_.length===T.length;ye.find("input").prop("checked",e),ge[e?"addClass":"removeClass"]("elfinder-cwd-allselected")}t.trigger("select",{selected:_})},K=function(e,n){var i=e.position().top,a=e.outerHeight(!0),o=ve.scrollTop(),s=ve.get(0).clientHeight,l=ne?ne.outerHeight(!0):0;i+l+a>o+s?ve.scrollTop(parseInt(i+l+a-s)):o>i&&ve.scrollTop(i),r&&ve.scrollLeft(0),!!n&&t.resources.blink(e,"lookme")},G=[],J={},Y=function(e){for(var t=G.length;t--;)if(G[t].hash==e)return t;return-1},X="elfscrstop",Z={filter:h,stop:$,delay:250,appendTo:"body",autoRefresh:!1,selected:function(t,n){e(n.selected).trigger(o)},unselected:function(t,n){e(n.unselected).trigger(s)}},Q=function(n){var n=t.cwd().phash,i=t.file(n)||null,a=function(n){n&&(xe=e(j(e.extend(!0,{},n,{name:"..",mime:"directory"}))).addClass("elfinder-cwd-parent").bind("mousedown click mouseup touchstart touchmove touchend dblclick mouseenter",function(e){e.preventDefault(),e.stopPropagation()}).dblclick(function(){t.exec("open",t.cwdId2Hash(this.id))}),(r?ge.find("tbody"):ge).prepend(xe))};i?a(i):t.getUI("tree").hasClass("elfinder-tree")?t.one("parents",function(){a(t.file(n)||null)}):t.request({data:{cmd:"parents",target:t.cwd().hash},preventFail:!0}).done(function(e){a(t.file(n)||null)})},ee=t.options.showFiles,te=function(){var i,s,l=r?ge.children("table").children("tbody"):ge,d=!1,c=!!e.htmlPrefilter,u=e(c?document.createDocumentFragment():"<div/>"),h=function(n){var i,s,d,n=n||null,h=[],f=!1,m={},g="self"===t.option("tmbUrl");i=G.splice(0,ee+(n||0)/(J.hpi||1)),J.renderd+=i.length,G.length||(be.hide(),ve.off(X,te)),s=[],h=e.map(i,function(e){return e.hash&&e.name?("directory"==e.mime&&(f=!0),(e.tmb||g&&0===e.mime.indexOf("image/"))&&(m[e.hash]=e.tmb),x[e.hash]&&s.push(e.hash),j(e)):null}),u.empty().append(h.join("")),f&&!a&&oe(u),d=[],_.length&&u.find("[id]:not(."+p+"):not(.elfinder-cwd-parent)").each(function(){-1!==e.inArray(t.cwdId2Hash(this.id),_)&&d.push(e(this))}),l.append(c?u:u.children()),d.length&&(e.each(d,function(e,t){t.trigger(o)}),$()),s.length&&t.trigger("lockfiles",{files:s}),!J.hpi&&pe(l,i.length),r&&(ge.find("thead").show(),ie({fitWidth:!O})),Object.keys(m).length&&(Object.keys(J.attachTmbs).length<1&&(ve.off(X,se).on(X,se),t.unbind("resize",se).bind("resize",se)),e.extend(J.attachTmbs,m),se(m)),ve.trigger(X)};J.renderd?d||(i=ve.height()+ve.scrollTop()+t.options.showThreshold+J.row-J.renderd*J.hpi)>0&&(d=!0,t.lazy(function(){h(i),d=!1})):(d=!0,ve.scrollTop(0),s=t.cwd().phash,h(),n.oldSchool&&s&&!k&&Q(s),r&&(O&&ae(),ie({fitWidth:!0})),J.itemH=(r?l.find("tr:first"):l.find("[id]:first")).outerHeight(!0),t.trigger("cwdrender"),d=!1)},ne=null,ie=function(i){if(n.listView.fixedHeader){var a,r,o,s,l,d,c,u,h,p,f,m,g,v=function(){var e,n;"ltr"===t.direction?(e=-1*ve.scrollLeft(),n="left"):(e=ve.scrollLeft(),n="right"),r.css(n)!==e&&r.css(n,e)},i=i||{};if(l=ge.find("tbody"),u=l.children("tr:first"),u.length){if(o=l.parent(),ne?(s=e("#"+t.namespace+"-cwd-thead"),c=s.children("tr:first")):(g=!0,l.addClass("elfinder-cwd-fixheader"),s=ge.find("thead").attr("id",t.namespace+"-cwd-thead"),c=s.children("tr:first"),d=c.outerHeight(!0),ge.css("margin-top",d-parseInt(o.css("padding-top"))),r=e("<div/>").addClass(ge.attr("class")).append(e("<table/>").append(s)),ne=e("<div/>").addClass(ve.attr("class")+" elfinder-cwd-fixheader").removeClass("ui-droppable native-droppable").css(ve.position()).css("height",d).append(r),"rtl"===t.direction&&ne.css("right",t.getUI().width()-ve.width()+"px"),v(),ve.after(ne).on("scroll.fixheader resize.fixheader",function(e){v(),"resize"===e.type&&(e.stopPropagation(),ie())})),g||i.fitWidth||Math.abs(u.outerWidth()-c.outerWidth())>2){a=A.length+1;for(var b=0;a>b&&(h=c.children("td:eq("+b+")"),p=u.children("td:eq("+b+")"),f=h.width(),m=p.width(),"undefined"==typeof h.data("delta")&&h.data("delta",h.outerWidth()-f-(p.outerWidth()-m)),m-=h.data("delta"),g||i.fitWidth||f!==m);b++)h.css("width",m+"px")}ne.data("widthTimer")&&clearTimeout(ne.data("widthTimer")),ne.data("widthTimer",setTimeout(function(){ne&&("rtl"===t.direction&&ne.css("right",t.getUI().width()-ve.width()+"px"),ne.css(ve.position()).css("width",ge.outerWidth()+"px"))},10))}}},ae=function(){if(r&&O){var t,n="elfinder-cwd-colwidth",i=ge.find("tr[id]:first");i.hasClass(n)||(t=ge.find("tr."+n),t.removeClass(n).find("td").css("width",""),i.addClass(n),ge.find("table:first").css("table-layout","fixed"),e.each(e.merge(["name"],A),function(e,t){var n=O[t]||i.find("td.elfinder-col-"+t).width();i.find("td.elfinder-col-"+t).width(n)}))}},re=e.extend({},t.droppable,{over:function(n,i){var a,r,o,s=e(this),l=i.helper,d=n.shiftKey||n.ctrlKey||n.metaKey;return n.stopPropagation(),l.data("dropover",l.data("dropover")+1),s.data("dropover",!0),l.data("namespace")===t.namespace&&t.insideWorkzone(n.pageX,n.pageY)?(s.hasClass(t.res(c,"cwdfile"))?(a=t.cwdId2Hash(s.attr("id")),s.data("dropover",a)):(a=t.cwd().hash,t.cwd().write&&s.data("dropover",a)),o=t.file(l.data("files")[0]).phash===a,s.data("dropover")===a?e.each(l.data("files"),function(e,t){return t===a||o&&!d&&!l.hasClass("elfinder-drag-helper-plus")?(s.removeClass(b),!1):void 0}):s.removeClass(b),l.data("locked")||o?r="elfinder-drag-helper-plus":(r="elfinder-drag-helper-move",d&&(r+=" elfinder-drag-helper-plus")),s.hasClass(b)&&l.addClass(r),void setTimeout(function(){s.hasClass(b)&&l.addClass(r)},20)):(s.removeClass(b),void l.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus"))},out:function(t,n){var i=n.helper;t.stopPropagation(),i.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus").data("dropover",Math.max(i.data("dropover")-1,0)),e(this).removeData("dropover").removeClass(b)},deactivate:function(){e(this).removeData("dropover").removeClass(b)},drop:function(e,n){B(),t.droppable.drop.call(this,e,n)}}),oe=function(n){n=n?n:r?ge.find("tbody"):ge;var i=n.children(".directory:not(."+g+",.elfinder-na,.elfinder-ro)");t.isCommandEnabled("paste")&&i.droppable(re),t.isCommandEnabled("upload")&&i.addClass("native-droppable"),n.children(".isroot").each(function(n,i){var a=e(i),r=t.cwdId2Hash(i.id);t.isCommandEnabled("paste",r)?a.hasClass(g+",elfinder-na,elfinder-ro")||a.droppable(re):a.hasClass(g)&&a.droppable("destroy"),t.isCommandEnabled("upload",r)?a.hasClass("native-droppable,elfinder-na,elfinder-ro")||a.addClass("native-droppable"):a.hasClass("native-droppable")&&a.removeClass("native-droppable")})},se=function(n,i){var a=(t.option("tmbUrl"),[]),r=function(t,n){e("<img/>").on("load",function(){t.find(".elfinder-cwd-icon").addClass(n.className).css("background-image","url('"+n.url+"')")}).attr("src",n.url)},o=function(n,o){var s,l,d=e("#"+t.cwdHash2Id(n)),c=[];d.length&&t.isInWindow(d,!0)&&("1"!=o?(s=t.file(n),s.tmb!==o&&(s.tmb=o),l=t.tmb(s),i?t.reloadContents(l.url).done(function(){d.find(".elfinder-cwd-icon").addClass(l.className).css("background-image","url('"+l.url+"')")}):r(d,l)):i?c.push(n):J.getTmbs.push(n),a.push(n)),e.each(a,function(e,t){delete J.attachTmbs[t]}),i?le(c):J.getTmbs.length&&le(),Object.keys(J.attachTmbs).length<1&&J.getTmbs.length<1&&(ve.off(X,se),t.unbind("resize",se))};e.isPlainObject(n)&&Object.keys(n).length?(e.extend(J.attachTmbs,n),e.each(n,o)):(J.attachThumbTm&&clearTimeout(J.attachThumbTm),J.attachThumbTm=setTimeout(function(){e.each(J.attachTmbs,o)},0))},le=function(n){var i=[],a=!1;if(!J.gettingTmb||n){if(n||(J.gettingTmb=!0),t.oldAPI)return void t.request({data:{cmd:"tmb",current:t.cwd().hash},preventFail:!0}).done(function(e){J.gettingTmb=!1,e.images&&Object.keys(e.images).length&&se(e.images),e.tmb&&le()}).fail(function(){J.gettingTmb=!1});n?(a=!0,i=n.splice(0,w)):i=J.getTmbs.splice(0,w),i.length&&(a||t.isInWindow(e("#"+t.cwdHash2Id(i[0])),!0)||t.isInWindow(e("#"+t.cwdHash2Id(i[i.length-1])),!0)?t.request({data:{cmd:"tmb",targets:i},preventFail:!0}).done(function(e){J.gettingTmb=!1,e.images&&Object.keys(e.images).length&&se(e.images,a),a?n.length&&le(n):J.getTmbs.length&&le()}).fail(function(){J.gettingTmb=!1}):(e.each(i,function(e,t){J.attachTmbs[t]="1"}),J.gettingTmb=!1,se()))}},de=function(n,i){var o,s,l,d,c,u=r?ge.find("tbody"):ge,h=n.length,p={},f={},m=function(e){for(var n,i=ge.find("[id]:first");i.length;){if(n=t.file(t.cwdId2Hash(i.attr("id"))),!i.hasClass("elfinder-cwd-parent")&&n&&t.compare(e,n)<0)return i;i=i.next("[id]")}},g=function(e){var n,i=G.length;for(n=0;i>n;n++)if(t.compare(e,G[n])<0)return n;return i||-1},v=!!e.htmlPrefilter,b=e(v?document.createDocumentFragment():"<div/>");if(h>ee)me(),_=n.concat(),$();else{for(h&&Ce.removeClass("elfinder-cwd-wrapper-empty");h--;)o=n[h],s=o.hash,e("#"+t.cwdHash2Id(s)).length||((l=m(o))&&!l.length&&(l=null),!l&&(c=g(o))>=0?G.splice(c,0,o):(b.empty().append(j(o)),"directory"===o.mime&&!a&&oe(b),d=v?b:b.children(),l?l.before(d):u.append(d)),e("#"+t.cwdHash2Id(s)).length&&"directory"!==o.mime&&o.tmb&&(1==o.tmb?f[s]=o.tmb:p[s]=o.tmb));ae(),pe(u),(Object.keys(p).length||Object.keys(f).length)&&(Object.keys(J.attachTmbs).length<1&&(ve.off(X,se).on(X,se),t.unbind("resize",se).bind("resize",se)),e.extend(J.attachTmbs,p,f),Object.keys(p).length&&se(p,"change"===i&&"resize"===t.currentReqCmd),Object.keys(f).length&&se(f))}},ce=function(n){var i,a,r,o=n.length;if(!t.cwd().hash&&"open"!==t.currentReqCmd)return void e.each(C.reverse(),function(e,n){return t.files()[n]?(t.one(t.currentReqCmd+"done",function(e,t){!t.cwd().hash&&t.exec("open",n)}),!1):void 0});for(;o--;)if(i=n[o],(a=e("#"+t.cwdHash2Id(i))).length)try{a.remove(),--J.renderd}catch(s){t.debug("error",s)}else-1!=(r=Y(i))&&G.splice(r,1);ae()},ue={name:t.i18n("name"),perm:t.i18n("perms"),date:t.i18n("modify"),size:t.i18n("size"),kind:t.i18n("kind"),modestr:t.i18n("mode"),modeoct:t.i18n("mode"),modeboth:t.i18n("mode")},he=function(){for(var i="",a="",r=e.extend({},ue,n.listView.columnsCustomName),o=0;o<A.length;o++)i="undefined"!=typeof r[A[o]]?r[A[o]]:t.i18n(A[o]),a+='<td class="elfinder-cwd-view-th-'+A[o]+' sortable-item">'+i+"</td>";return a},pe=function(e,t){var n,i=1;e=e||(r?ge.find("tbody"):ge),G.length>0&&(e.css({height:"auto"}),n=e.height(),t&&(r||(i=Math.floor(e.width()/e.find("[id]:first").width()),t=Math.ceil(t/i)*i),J.hpi=n/t,J.row=J.hpi*i),be.css({top:J.hpi*G.length+n+"px"}).show())},fe={contextmenu:function(e){e.preventDefault(),t.trigger("contextmenu",{type:"cwd",targets:[t.cwd().hash],x:e.pageX,y:e.pageY})},touchstart:function(e){e.originalEvent.touches.length>1||(ge.data("longtap",null),ve.data("touching",{x:e.originalEvent.touches[0].pageX,y:e.originalEvent.touches[0].pageY}),e.target!==this&&e.target!==ge.get(0)||ge.data("tmlongtap",setTimeout(function(){ge.data("longtap",!0),t.trigger("contextmenu",{type:"cwd",targets:[t.cwd().hash],x:ve.data("touching").x,y:ve.data("touching").y})},500)))},touchend:function(e){"touchmove"===e.type&&(!ve.data("touching")||Math.abs(ve.data("touching").x-e.originalEvent.touches[0].pageX)+Math.abs(ve.data("touching").y-e.originalEvent.touches[0].pageY)>4)&&ve.data("touching",null),clearTimeout(ge.data("tmlongtap"))},click:function(e){ge.data("longtap")&&(e.preventDefault(),e.stopPropagation())}},me=function(){var n;Ce.append(ye).removeClass("elfinder-cwd-wrapper-empty elfinder-search-result elfinder-incsearch-result"),(t.searchStatus.state>1||t.searchStatus.ininc)&&Ce.addClass("elfinder-search-result"+(t.searchStatus.ininc?" elfinder-incsearch-result":"")),H=e();try{ge.empty()}catch(i){ge.html("")}ne&&(ve.off("scroll.fixheader resize.fixheader"),ne.remove(),ne=null),ge.removeClass("elfinder-cwd-view-icons elfinder-cwd-view-list").addClass("elfinder-cwd-view-"+(r?"list":"icons")).attr("style","").css("height","auto"),be.hide(),ve[r?"addClass":"removeClass"]("elfinder-cwd-wrapper-list")._padding=parseInt(ve.css("padding-top"))+parseInt(ve.css("padding-bottom")),t.UA.iOS&&ve.removeClass("overflow-scrolling-touch").addClass("overflow-scrolling-touch"),r&&(ge.html("<table><thead/><tbody/></table>"),n=e('<tr class="ui-state-default"><td class="elfinder-cwd-view-th-name">'+ue.name+"</td>"+he()+"</tr>"),ge.find("thead").hide().append(n.on("contextmenu."+t.namespace,fe.contextmenu).on("touchstart."+t.namespace,"td",fe.touchstart).on("touchmove."+t.namespace+" touchend."+t.namespace+" mouseup."+t.namespace,"td",fe.touchend).on("click."+t.namespace,"td",fe.click)).find("td:first").append(ye),e.fn.sortable&&n.addClass("touch-punch touch-punch-keep-default").sortable({axis:"x",distance:8,items:"> .sortable-item",start:function(t,n){e(n.item[0]).data("dragging",!0),n.placeholder.width(n.helper.removeClass("ui-state-hover").width()).removeClass("ui-state-active").addClass("ui-state-hover").css("visibility","visible")},update:function(n,i){var a,r,o=e(i.item[0]).attr("class").split(" ")[0].replace("elfinder-cwd-view-th-","");A=e.map(e(this).children(),function(t){var n=e(t).attr("class").split(" ")[0].replace("elfinder-cwd-view-th-","");return r||(o===n?r=!0:a=n),"name"===n?null:n}),D.row=S(),t.storage("cwdCols",A),a=".elfinder-col-"+a+":first",o=".elfinder-col-"+o+":first",t.lazy(function(){ge.find("tbody tr").each(function(){var t=e(this);t.children(a).after(t.children(o))})})},stop:function(t,n){setTimeout(function(){e(n.item[0]).removeData("dragging")},100)}}),e.fn.resizable&&n.find("td").addClass("touch-punch").resizable({handles:"ltr"===t.direction?"e":"w",start:function(t,n){var i=ge.find("td.elfinder-col-"+n.element.attr("class").split(" ")[0].replace("elfinder-cwd-view-th-","")+":first");n.element.data("resizeTarget",i).data("targetWidth",i.width()),M=!0,"fixed"!==ge.find("table").css("table-layout")&&(ge.find("tbody tr:first td").each(function(){e(this).width(e(this).width())}),ge.find("table").css("table-layout","fixed"))},resize:function(e,t){t.element.data("resizeTarget").width(t.element.data("targetWidth")-(t.originalSize.width-t.size.width))},stop:function(){M=!1,ie({fitWidth:!0}),O={},ge.find("tbody tr:first td").each(function(){var t=e(this).attr("class").split(" ")[0].replace("elfinder-col-","");O[t]=e(this).width()}),t.storage("cwdColWidth",O)}}).find(".ui-resizable-handle").addClass("ui-icon ui-icon-grip-dotted-vertical")),t.lazy(function(){G=e.map(z||T,function(e){return t.file(e)||null}),G=t.sortFiles(G),J={renderd:0,attachTmbs:{},getTmbs:[],lazyOpts:{tm:0}},Ce[G.length<1?"addClass":"removeClass"]("elfinder-cwd-wrapper-empty"),ve.off(X,te).on(X,te).trigger(X),t.cwd().write?(ve[t.isCommandEnabled("upload")?"addClass":"removeClass"]("native-droppable"),ve.droppable("enable")):ve.removeClass("native-droppable").droppable("disable").removeClass("ui-state-disabled")})},ge=e(this).addClass("ui-helper-clearfix elfinder-cwd").attr("unselectable","on").on("click."+t.namespace,h,function(n){var i,a,r,l,d,c=this.id?e(this):e(this).parents("[id]:first"),u=e(n.target);if(U&&(u.is("input:checkbox")||u.hasClass("elfinder-cwd-select")))return n.stopPropagation(),n.preventDefault(),ve.data("touching")||(c.trigger(c.hasClass(p)?s:o),$()),setTimeout(function(){u.prop("checked",c.hasClass(p))},10),!1;if(ge.data("longtap"))return void n.stopPropagation();if(n.shiftKey&&(i=c.prevAll(V||"."+p+":first"),a=c.nextAll(V||"."+p+":first"),r=i.length,l=a.length),n.shiftKey&&(r||l))d=r?c.prevUntil("#"+i.attr("id")):c.nextUntil("#"+a.attr("id")),d.add(c).trigger(o);else if(n.ctrlKey||n.metaKey)c.trigger(c.hasClass(p)?s:o);else{if(ve.data("touching")&&c.hasClass(p))return ve.data("touching",null),void t.dblclick({file:t.cwdId2Hash(this.id)});B(),c.trigger(o)}$()}).on("dblclick."+t.namespace,h,function(e){t.dblclick({file:t.cwdId2Hash(this.id)})}).on("touchstart."+t.namespace,h,function(n){if(!(n.originalEvent.touches.length>1)){var i,a=this.id?e(this):e(this).parents("[id]:first"),r=e(n.target);return ve.data("touching",{x:n.originalEvent.touches[0].pageX,y:n.originalEvent.touches[0].pageY}),U&&(r.is("input:checkbox")||r.hasClass("elfinder-cwd-select"))?void setTimeout(function(){ve.data("touching")&&(a.trigger(a.hasClass(p)?s:o),$())},150):void("INPUT"!=n.target.nodeName&&"TEXTAREA"!=n.target.nodeName&&(i=a.prevAll("."+p+":first").length+a.nextAll("."+p+":first").length,ge.data("longtap",null),a.addClass(v).data("tmlongtap",setTimeout(function(){ge.data("longtap",!0),("TD"!=n.target.nodeName||t.selected().length>0)&&(a.trigger(o),$(),t.trigger("contextmenu",{type:"files",targets:t.selected(),x:n.originalEvent.touches[0].pageX,y:n.originalEvent.touches[0].pageY}))},500))))}}).on("touchmove."+t.namespace+" touchend."+t.namespace,h,function(n){if("INPUT"!=n.target.nodeName&&"TEXTAREA"!=n.target.nodeName&&!e(n.target).hasClass("elfinder-cwd-select")){var i=this.id?e(this):e(this).parents("[id]:first");clearTimeout(i.data("tmlongtap")),"touchmove"===n.type?(ve.data("touching",null),i.removeClass(v)):ve.data("touching")&&!ge.data("longtap")&&i.hasClass(p)&&(n.preventDefault(),ve.data("touching",null),t.dblclick({file:t.cwdId2Hash(this.id)}))}}).on("mouseenter."+t.namespace,h,function(n){var i=e(this),s=null,l=r?i:i.children("div.elfinder-cwd-file-wrapper,div.elfinder-cwd-filename");a||i.hasClass(y)||l.hasClass(m)||l.hasClass(f)||l.on("mousedown",function(n){n.shiftKey&&!t.UA.IE&&ge.data("selectable")&&(ge.selectable("destroy").data("selectable",!1),setTimeout(function(){ge.selectable(Z).data("selectable",!0)},10)),l.draggable("option","disabled",n.shiftKey).removeClass("ui-state-disabled"),n.shiftKey?l.attr("draggable","true"):l.removeAttr("draggable").draggable("option","cursorAt",{left:50-parseInt(e(n.currentTarget).css("margin-left")),top:47})}).on("dragstart",function(n){var i=n.dataTransfer||n.originalEvent.dataTransfer||null;if(s=null,i&&!t.UA.IE){var a,r=this.id?e(this):e(this).parents("[id]:first"),l=e("<span>"),d="",c=null,u=null,h=[],p=function(n){var i,a=n.mime,r=t.tmb(n);return i='<div class="elfinder-cwd-icon '+t.mime2class(a)+' ui-corner-all"/>',r&&(i=e(i).addClass(r.className).css("background-image","url('"+r.url+"')").get(0).outerHTML),i},f=[];if(r.trigger(o),$(),e.each(_,function(n,i){var a=t.file(i),r=a.url;if(a&&"directory"!==a.mime){if(r){if("1"==r)return f.push(i),!0}else r=t.url(a.hash);r&&(r=t.convAbsUrl(r),h.push(i),e("<a>").attr("href",r).text(r).appendTo(l),d+=r+"\n",c||(c=a.mime+":"+a.name+":"+r),u||(u=r+"\n"+a.name))}}),f.length)return e.each(f,function(e,n){var i=t.file(n);i.url="",t.request({data:{cmd:"url",target:n},notify:{type:"url",cnt:1},preventDefault:!0}).always(function(e){i.url=e.url?e.url:"1"})}),!1;if(!d)return!1;i.setDragImage&&(s=e('<div class="elfinder-drag-helper html5-native"></div>').append(p(t.file(h[0]))).appendTo(e(document.body)),(a=h.length)>1&&s.append(p(t.file(h[a-1]))+'<span class="elfinder-drag-num">'+a+"</span>"),i.setDragImage(s.get(0),50,47)),i.effectAllowed="copyLink",i.setData("DownloadURL",c),i.setData("text/x-moz-url",u),i.setData("text/uri-list",d),i.setData("text/plain",d),i.setData("text/html",l.html()),i.setData("elfinderfrom",window.location.href+t.cwd().hash),i.setData("elfinderfrom:"+i.getData("elfinderfrom"),"")}}).on("dragend",function(e){B(),s&&s.remove()}).draggable(t.draggable)}).on(o,h,function(n){var i=e(this),a=t.cwdId2Hash(i.attr("id"));N||i.hasClass(f)||(V="#"+this.id,i.addClass(p).children().addClass(v).find("input:checkbox").prop("checked",!0),-1===e.inArray(a,_)&&_.push(a),H=ge.find("[id]."+p+":last").next())}).on(s,h,function(n){var i,a=e(this),r=t.cwdId2Hash(a.attr("id"));N||(a.removeClass(p).children().removeClass(v).find("input:checkbox").prop("checked",!1),ge.hasClass("elfinder-cwd-allselected")&&(U&&ye.children("input").prop("checked",!1),ge.removeClass("elfinder-cwd-allselected")),i=e.inArray(r,_),-1!==i&&(V=void 0,_.splice(i,1)))}).on(l,h,function(){var t=e(this).removeClass(v+" "+p).addClass(f),n=t.children(),i=r?t:n.find("div.elfinder-cwd-file-wrapper,div.elfinder-cwd-filename");n.removeClass(v+" "+p),t.hasClass(g)&&t.droppable("disable"),i.hasClass(m)&&i.draggable("disable")}).on(d,h,function(){var t=e(this).removeClass(f),n=r?t:t.children("div.elfinder-cwd-file-wrapper,div.elfinder-cwd-filename");t.hasClass(g)&&t.droppable("enable"),n.hasClass(m)&&n.draggable("enable")}).on("scrolltoview",h,function(){K(e(this),!0)}).on("mouseenter."+t.namespace+" mouseleave."+t.namespace,h,function(n){t.trigger("hover",{hash:t.cwdId2Hash(e(this).attr("id")),type:n.type}),e(this).toggleClass(v,"mouseenter"==n.type)}).on("contextmenu."+t.namespace,function(n){var i=e(n.target).closest("."+u);i.length&&("TD"!=n.target.nodeName||e.inArray(t.cwdId2Hash(i.get(0).id),t.selected())>-1)&&(n.stopPropagation(),n.preventDefault(),i.hasClass(f)||ve.data("touching")||(i.hasClass(p)||(B(),i.trigger(o),$()),t.trigger("contextmenu",{type:"files",targets:t.selected(),x:n.pageX,y:n.pageY})))}).on("click."+t.namespace,function(e){e.target!==this||ge.data("longtap")||!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&B()}).on("create."+t.namespace,function(n,i){var a=r?ge.find("tbody"):ge,o=a.find(".elfinder-cwd-parent"),s=i.move||!1,i=e(j(i)).addClass(y),l=t.selected();l.length?s&&t.trigger("lockfiles",{files:l}):B(),o.length?o.after(i):a.prepend(i),ae(),ve.scrollTop(0).scrollLeft(0)}).on("unselectall",B).on("selectfile",function(n,i){e("#"+t.cwdHash2Id(i)).trigger(o),$()}).on("colwidth",function(){r&&(ge.find("table").css("table-layout","").find("td").css("width",""),ie({fitWidth:!0}),t.storage("cwdColWidth",O=null))}),ve=e('<div class="elfinder-cwd-wrapper"/>').droppable(e.extend({},re,{autoDisable:!1})).on("contextmenu."+t.namespace,fe.contextmenu).on("touchstart."+t.namespace,fe.touchstart).on("touchmove."+t.namespace+" touchend."+t.namespace,fe.touchend).on("click."+t.namespace,fe.click).on("scroll."+t.namespace,function(){J.seltm&&clearTimeout(J.seltm),J.scrtm&&clearTimeout(J.scrtm),J.scrtm&&Math.abs((J.scrolltop||0)-(J.scrolltop=e(this).scrollTop()))<2?(J.scrtm=0,ve.trigger(X)):J.scrtm=setTimeout(function(){J.scrtm=0,ve.trigger(X)},100)}),be=e("<div>&nbsp;</div>").css({position:"absolute",width:"1px",height:"1px"}).hide(),ye=U?e('<div class="elfinder-cwd-selectall"><input type="checkbox"/></div>').attr("title",t.i18n("selectall")).on("touchstart mousedown click",function(t){return t.stopPropagation(),t.preventDefault(),e(this).data("pending")||"click"===t.type?!1:(ye.data("pending",!0),void(ge.hasClass("elfinder-cwd-allselected")?(ye.find("input").prop("checked",!1),setTimeout(function(){B()},10)):W()))}):e(),we=null,ke=function(t){
var n=function(){var t=0;ve.siblings("div.elfinder-panel:visible").each(function(){t+=e(this).outerHeight(!0)}),ve.height(Ce.height()-t-ve._padding)};t&&n(),we&&clearTimeout(we),we=setTimeout(function(){!t&&n();var e,i;ge.css("height","auto"),e=ve[0].clientHeight-parseInt(ve.css("padding-top"))-parseInt(ve.css("padding-bottom"))-parseInt(ge.css("margin-top")),i=ge.outerHeight(!0),e>i&&ge.height(e)},20),r&&!M&&ie()},xe=e(this).parent().resize(ke),Ce=xe.children(".elfinder-workzone").append(ve.append(this).append(be));R=e.extend(R,n.replacement||{});try{O=t.storage("cwdColWidth")?t.storage("cwdColWidth"):null}catch(Te){O=null}(A=t.storage("cwdCols"))?(A=e.map(A,function(e){return-1!==n.listView.columns.indexOf(e)?e:null}),n.listView.columns.length>A.length&&e.each(n.listView.columns,function(e,t){-1===A.indexOf(t)&&A.push(t)})):A=n.listView.columns,D.row=S(),a&&e("body").on("touchstart touchmove touchend",function(e){}),U&&ge.addClass("elfinder-has-checkbox"),e(window).on("scroll."+t.namespace,function(){i&&clearTimeout(i),i=setTimeout(function(){ve.trigger(X)},50)}),e(document).on("keydown."+t.namespace,function(n){n.keyCode==e.ui.keyCode.ESCAPE&&(t.getUI().find(".ui-widget:visible").length||B())}),t.one("init",function(){var n,i,r,o,s=document.createElement("style");document.head.appendChild(s),n=s.sheet,n.insertRule('.elfinder-cwd-wrapper-empty .elfinder-cwd:after{ content:"'+t.i18n("emptyFolder")+'" }',0),n.insertRule('.elfinder-cwd-wrapper-empty .ui-droppable .elfinder-cwd:after{ content:"'+t.i18n("emptyFolder"+(a?"LTap":"Drop"))+'" }',1),n.insertRule('.elfinder-cwd-wrapper-empty .ui-droppable-disabled .elfinder-cwd:after{ content:"'+t.i18n("emptyFolder")+'" }',2),n.insertRule('.elfinder-cwd-wrapper-empty.elfinder-search-result .elfinder-cwd:after{ content:"'+t.i18n("emptySearch")+'" }',3),n.insertRule('.elfinder-cwd-wrapper-empty.elfinder-search-result.elfinder-incsearch-result .elfinder-cwd:after{ content:"'+t.i18n("emptyIncSearch")+'" }',3),a||(ge.selectable(Z).data("selectable",!0),i=function(){ge.data("selectable")&&(J.seltm&&clearTimeout(J.seltm),J.seltm=0,ge.selectable("enable").selectable("refresh"))},ve.on(X,function(){ge.off("mousedown",i).one("mousedown",i),J.seltm=setTimeout(function(){ge.off("mousedown",i),i()},2e3)}),o=e('<div style="position:absolute"/>'),r=t.getUI(),r.on("resize",function(e,t){var n;t&&t.fullscreen&&(n=r.offset(),"on"===t.fullscreen?(o.css({top:-1*n.top,left:-1*n.left}).appendTo(r),Z.appendTo=o):(o.detach(),Z.appendTo="body"),ge.selectable("option",{appendTo:Z.appendTo})),i()}))}).bind("open add remove searchend",function(){var n=t.cwd().hash;T=e.map(t.files(),function(e){return e.phash==n?e.hash:null})}).bind("open",function(){C=t.parents(t.cwd().hash),z=void 0,B(),me(),ke()}).bind("search",function(n){T=e.map(n.data.files,function(e){return e.hash}),z=void 0,t.searchStatus.ininc=!1,me(),t.autoSync("stop"),ke()}).bind("searchend",function(e){(k||z)&&(k="",z&&t.trigger("incsearchend",e.data),e.data&&e.data.noupdate||me()),t.autoSync(),ke()}).bind("searchstart",function(e){B(),k=e.data.query}).bind("incsearchstart",function(n){_=[],t.lazy(function(){if(k=n.data.query||""){var i=new RegExp(k.replace(/([\\*\;\.\?\[\]\{\}\(\)\^\$\-\|])/g,"\\$1"),"i");z=e.map(T,function(e){var n=t.file(e);return n&&(n.name.match(i)||n.i18&&n.i18.match(i))?n.hash:null}),t.trigger("incsearch",{hashes:z,query:k}).searchStatus.ininc=!0,me(),t.autoSync("stop")}else t.trigger("incsearchend");ke()})}).bind("incsearchend",function(e){k="",t.searchStatus.ininc=!1,z=void 0,e.data&&e.data.noupdate||me(),t.autoSync()}).bind("sortchange",function(){var e=ve.scrollLeft();me(),t.one("cwdrender",function(){ve.scrollLeft(e),_.length&&$(),ke()})}).bind("viewchange",function(){var e="list"==t.storage("view"),n=ge.hasClass("elfinder-cwd-allselected");e!=r&&(r=e,t.viewType=r?"list":"icons",me(),n&&(ge.addClass("elfinder-cwd-allselected"),ye.find("input").prop("checked",!0)),_.length&&$()),ke()}).bind("wzresize",function(){var n,i=r?ge.find("tbody"):ge;ke(!0),J.hpi&&pe(i,i.find("[id]").length),n=ge.offset(),Ce.data("rectangle",e.extend({width:Ce.width(),height:Ce.height(),cwdEdge:"ltr"===t.direction?n.left:n.left+ge.width()},Ce.offset())),J.itemH=(r?i.find("tr:first"):i.find("[id]:first")).outerHeight(!0)}).bind("changeclipboard",function(t){x={},t.data&&t.data.clipboard&&t.data.clipboard.length&&e.each(t.data.clipboard,function(e,t){t.cut&&(x[t.hash]=!0)})}).bind("resMixinMake",function(){ae()}).bind("tmbreload",function(t){var n={},i=t.data&&t.data.files?t.data.files:null;e.each(i,function(e,t){t.tmb&&"1"!=t.tmb&&(n[t.hash]=t.tmb)}),Object.keys(n).length&&se(n,!0)}).add(function(n){var i=t.cwd().hash,a=k?new RegExp(k.replace(/([\\*\;\.\?\[\]\{\}\(\)\^\$\-\|])/g,"\\$1"),"i"):null,o=a?e.map(n.data.added||[],function(e){return t.searchStatus.ininc&&e.phash!=i||!(e.name.match(a)||e.i18&&e.i18.match(a))?null:e}):e.map(n.data.added||[],function(e){return e.phash==i?e:null});de(o),r&&ke(),ve.trigger(X)}).change(function(n){var i=t.cwd().hash,a=t.selected();k?e.each(n.data.changed||[],function(t,n){ce([n.hash]),-1!==n.name.indexOf(k)&&(de([n],"change"),-1!==e.inArray(n.hash,a)&&L(n.hash))}):e.each(e.map(n.data.changed||[],function(e){return e.phash==i?e:null}),function(t,n){ce([n.hash]),de([n],"change"),-1!==e.inArray(n.hash,a)&&L(n.hash)}),$()}).remove(function(e){var t=r?ge.find("tbody"):ge;ce(e.data.removed||[]),$(),G.length<1&&t.children().length<1?(Ce.addClass("elfinder-cwd-wrapper-empty"),U&&ye.find("input").prop("checked",!1),be.hide(),ve.off(X,te),ke()):(pe(t),ve.trigger(X))}).dragstart(function(t){var n=e(t.data.target),i=t.data.originalEvent;n.hasClass(h.substr(1))&&(n.hasClass(p)||(!(i.ctrlKey||i.metaKey||i.shiftKey)&&B(),n.trigger(o),$())),ge.selectable("disable").removeClass(f),N=!0}).dragstop(function(){ge.selectable("enable"),N=!1}).bind("lockfiles unlockfiles selectfiles unselectfiles",function(n){var i,a,r,c,u={lockfiles:l,unlockfiles:d,selectfiles:o,unselectfiles:s},h=u[n.type],p=n.data.files||[],f=p.length,m=n.data.helper||e();if(f>0&&(i=t.parents(p[0])),h!==o&&h!==s||(r=h===o,c=r?_.concat():_,e.each(p,function(t,n){var i=e.inArray(n,c),a=ge.hasClass("elfinder-cwd-allselected");-1===i?r&&_.push(n):(a&&(U&&ye.children("input").prop("checked",!1),ge.removeClass("elfinder-cwd-allselected"),a=!1),!r&&_.splice(i,1))})),!m.data("locked")){for(;f--;)e("#"+t.cwdHash2Id(p[f])).trigger(h);!n.data.inselect&&$()}ve.data("dropover")&&-1!==i.indexOf(ve.data("dropover"))&&(a="lockfiles"!==n.type,m.toggleClass("elfinder-drag-helper-plus",a),ve.toggleClass(b,a))}).bind("mkdir mkfile duplicate upload rename archive extract paste multiupload",function(n){if("upload"!=n.type||!n.data._multiupload){var i=t.cwd().hash;B(),e.each((n.data.added||[]).concat(n.data.changed||[]),function(e,t){t&&t.phash==i&&L(t.hash)}),$()}}).shortcut({pattern:"ctrl+a",description:"selectall",callback:W}).shortcut({pattern:"left right up down shift+left shift+right shift+up shift+down",description:"selectfiles",type:"keydown",callback:function(e){q(e.keyCode,e.shiftKey)}}).shortcut({pattern:"home",description:"selectffile",callback:function(e){B(),K(ge.find("[id]:first").trigger(o)),$()}}).shortcut({pattern:"end",description:"selectlfile",callback:function(e){B(),K(ge.find("[id]:last").trigger(o)),$()}}).shortcut({pattern:"page_up",description:"pageTurning",callback:function(e){J.itemH&&ve.scrollTop(Math.round(ve.scrollTop()-Math.floor((ve.height()+(r?-1*J.itemH:16))/J.itemH)*J.itemH))}}).shortcut({pattern:"page_down",description:"pageTurning",callback:function(e){J.itemH&&ve.scrollTop(Math.round(ve.scrollTop()+Math.floor((ve.height()+(r?-1*J.itemH:16))/J.itemH)*J.itemH))}})}),this},e.fn.elfinderdialog=function(t,n){var i,a,r=-1!=window.navigator.platform.indexOf("Win");return n&&n.ui?a=n.getUI():(a=this.closest(".elfinder"),n||(n=a.elfinder("instance"))),"string"==typeof t?((i=this.closest(".ui-dialog")).length&&("open"==t?"none"==i.css("display")&&i.fadeIn(120,function(){i.trigger("open")}):"close"==t||"destroy"==t?(i.stop(!0),(i.is(":visible")||a.is(":hidden"))&&i.hide().trigger("close"),"destroy"==t&&i.remove()):"toTop"==t?i.trigger("totop"):"posInit"==t?i.trigger("posinit"):"tabstopsInit"==t&&i.trigger("tabstopsInit")),this):(t=e.extend({},e.fn.elfinderdialog.defaults,t),t.allowMinimize&&"auto"===t.allowMinimize&&(t.allowMinimize=!!this.find("textarea,input").length),t.headerBtnPos&&"auto"===t.headerBtnPos&&(t.headerBtnPos=r?"right":"left"),t.headerBtnOrder&&"auto"===t.headerBtnOrder&&(t.headerBtnOrder=r?"close:maximize:minimize":"close:minimize:maximize"),t.modal&&t.allowMinimize&&(t.allowMinimize=!1),this.filter(":not(.ui-dialog-content)").each(function(){var i=e(this).addClass("ui-dialog-content ui-widget-content"),o="elfinder-dialog-active",s="elfinder-dialog",l="elfinder-dialog-notify",d="ui-state-hover",c="elfinder-tabstop",u="elfinder-focus",h=parseInt(1e6*Math.random()),p=e('<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span class="elfinder-dialog-title">'+t.title+"</span></div>"),f=e('<div class="ui-dialog-buttonset"/>'),m=e('<div class=" ui-helper-clearfix ui-dialog-buttonpane ui-widget-content"/>').append(f),g=0,v=0,b=e(),y=function(){b=T.find("."+c),b.length&&(b.attr("tabindex","-1"),b.filter("."+u).length||f.children("."+c+":"+(r?"first":"last")).addClass(u))},w=function(t){var n=b.filter(":visible"),i=t?null:n.filter("."+u+":first");return i&&i.length||(i=n.first()),t&&e.each(n,function(e,a){return a===t&&n[e+1]?(i=n.eq(e+1),!1):void 0}),i},k=function(t){var n=b.filter(":visible"),i=n.last();return e.each(n,function(e,a){return a===t&&n[e-1]?(i=n.eq(e-1),!1):void 0}),i},x=function(){e.each(t.headerBtnOrder.split(":").reverse(),function(e,t){C[t]&&C[t]()}),r&&p.children(".elfinder-titlebar-button").addClass("elfinder-titlebar-button-right")},C={close:function(){p.prepend(e('<span class="ui-widget-header ui-dialog-titlebar-close ui-corner-all elfinder-titlebar-button"><span class="ui-icon ui-icon-closethick"/></span>').on("mousedown",function(e){e.preventDefault(),e.stopPropagation(),i.elfinderdialog("close")}))},maximize:function(){t.allowMaximize&&(T.on("resize",function(e,t){var n,a;if(t&&t.maximize){if(a=p.find(".elfinder-titlebar-full"),n="on"===t.maximize,a.children("span.ui-icon").toggleClass("ui-icon-plusthick",!n).toggleClass("ui-icon-arrowreturnthick-1-s",n),n){try{T.hasClass("ui-draggable")&&T.draggable("disable"),T.hasClass("ui-resizable")&&T.resizable("disable")}catch(e){}"undefined"==typeof a.data("style")&&(i.height(i.height()),a.data("style",i.attr("style")||"")),i.css("width","100%").css("height",T.height()-T.children(".ui-dialog-titlebar").outerHeight(!0)-m.outerHeight(!0))}else{i.attr("style",a.data("style")),a.removeData("style");try{T.hasClass("ui-draggable")&&T.draggable("enable"),T.hasClass("ui-resizable")&&T.resizable("enable")}catch(e){}}T.trigger("resize")}}),p.prepend(e('<span class="ui-widget-header ui-corner-all elfinder-titlebar-button elfinder-titlebar-full"><span class="ui-icon ui-icon-plusthick"/></span>').on("mousedown",function(e){e.preventDefault(),e.stopPropagation(),n.toggleMaximize(T)})))},minimize:function(){t.allowMinimize&&p.on("dblclick",function(t){e(this).children(".elfinder-titlebar-minimize").trigger("mousedown")}).prepend(e('<span class="ui-widget-header ui-corner-all elfinder-titlebar-button elfinder-titlebar-minimize"><span class="ui-icon ui-icon-minusthick"/></span>').on("mousedown",function(t){var i,r=e(this);if(t.preventDefault(),t.stopPropagation(),"undefined"!=typeof r.data("style"))a.append(T),T.attr("style",r.data("style")).removeClass("elfinder-dialog-minimized").off("mousedown.minimize"),r.removeData("style").show(),p.children(".elfinder-titlebar-full").show(),T.children(".ui-widget-content").slideDown("fast",function(){var e;if(this===T.children(".ui-widget-content:first").get(0)){if(T.find("."+n.res("class","editing"))&&n.disable(),e={minimize:"off"},T.hasClass("elfinder-maximized"))e.maximize="on";else try{T.hasClass("ui-draggable")&&T.draggable("enable"),T.hasClass("ui-resizable")&&T.resizable("enable")}catch(t){}T.trigger("resize",e)}});else{try{T.hasClass("ui-draggable")&&T.draggable("disable"),T.hasClass("ui-resizable")&&T.resizable("disable")}catch(t){}r.data("style",T.attr("style")||"").hide(),p.children(".elfinder-titlebar-full").hide(),i=T.width(),T.children(".ui-widget-content").slideUp("fast",function(){this===T.children(".ui-widget-content:first").get(0)&&(T.trigger("resize",{minimize:"on"}),T.attr("style","").css({maxWidth:i}).addClass("elfinder-dialog-minimized").one("mousedown.minimize",function(e){r.trigger("mousedown")}).appendTo(n.getUI("bottomtray")))})}}))}},T=e('<div class="ui-front ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable std42-dialog touch-punch '+s+" "+t.cssClass+'"/>').hide().append(i).appendTo(a).draggable({handle:".ui-dialog-titlebar",containment:"document",stop:function(e,n){T.css({height:t.height}),i.data("draged",!0)}}).css({width:t.width,height:t.height}).on("mousedown",function(e){T.hasClass("ui-front")||setTimeout(function(){T.is(":visible:not(.elfinder-dialog-minimized)")&&T.trigger("totop")},10)}).on("open",function(){var r=e(this),d=r.outerWidth()>a.width()-10?a.width()-10:null;d&&r.css({width:d,left:"5px"}),T.hasClass(l)||a.children("."+s+":visible:not(."+l+")").each(function(){var t=e(this),n=parseInt(t.css("top")),i=parseInt(t.css("left")),a=parseInt(T.css("top")),r=parseInt(T.css("left"));t[0]==T[0]||n!=a&&i!=r||T.css({top:n+(d?15:10)+"px",left:(d?5:i+10)+"px"})}),T.data("modal")&&n.getUI("overlay").elfinderoverlay("show"),T.trigger("totop"),"function"==typeof t.open&&e.proxy(t.open,i[0])(),n.UA.Mobile&&w().focus(),t.closeOnEscape&&e(document).on("keyup."+h,function(t){t.keyCode==e.ui.keyCode.ESCAPE&&T.hasClass(o)&&i.elfinderdialog("close")})}).on("close",function(){var r;t.closeOnEscape&&e(document).off("keyup."+h),t.allowMaximize&&n.toggleMaximize(T,!1),T.data("modal")&&n.getUI("overlay").elfinderoverlay("hide"),"function"==typeof t.close?e.proxy(t.close,i[0])():t.destroyOnClose&&T.hide().remove(),r=a.children("."+s+":visible"),r.length?r.filter(":last").trigger("totop"):setTimeout(function(){n.enable()},20)}).on("totop",function(){T.hasClass("elfinder-dialog-minimized")&&p.children(".elfinder-titlebar-minimize").trigger("mousedown"),n.toFront(T),a.children("."+s).removeClass(o+" ui-front"),T.addClass(o+" ui-front"),!n.UA.Mobile&&w().focus()}).on("posinit",function(){var e=t.position;e||T.data("resizing")||(e={top:Math.max(0,parseInt((a.height()-T.outerHeight())/2-42))+"px",left:Math.max(0,parseInt((a.width()-T.outerWidth())/2))+"px"}),t.absolute&&(e.position="absolute"),e&&T.css(e)}).on("resize",function(n,a){"function"==typeof t.resize&&e.proxy(t.resize,i[0])(n,a)}).on("tabstopsInit",y).on("focus","."+c,function(){e(this).addClass(d).parent("label").addClass(d),this.id&&e(this).parent().find("label[for="+this.id+"]").addClass(d)}).on("blur","."+c,function(){e(this).removeClass(d).parent("label").removeClass(d),this.id&&e(this).parent().find("label[for="+this.id+"]").removeClass(d)}).on("mouseenter mouseleave","."+c,function(n){var i=e(this);t.btnHoverFocus?"mouseenter"==n.type&&i.focus():i.toggleClass(d,"mouseenter"==n.type)}).on("keydown","."+c,function(t){var n=e(this);if(n.is(":focus"))if(t.stopPropagation(),t.keyCode==e.ui.keyCode.ENTER)t.preventDefault(),n.click();else if(t.keyCode==e.ui.keyCode.TAB&&t.shiftKey||t.keyCode==e.ui.keyCode.LEFT||t.keyCode==e.ui.keyCode.UP){if(n.is("input:text")&&!t.ctrlKey&&!t.metaKey&&t.keyCode==e.ui.keyCode.LEFT)return;if(n.is("select")&&t.keyCode!=e.ui.keyCode.TAB)return;if(n.is("textarea")&&!t.ctrlKey&&!t.metaKey)return;t.preventDefault(),k(this).focus()}else if(t.keyCode==e.ui.keyCode.TAB||t.keyCode==e.ui.keyCode.RIGHT||t.keyCode==e.ui.keyCode.DOWN){if(n.is("input:text")&&!t.ctrlKey&&!t.metaKey&&t.keyCode==e.ui.keyCode.RIGHT)return;if(n.is("select")&&t.keyCode!=e.ui.keyCode.TAB)return;if(n.is("textarea")&&!t.ctrlKey&&!t.metaKey)return;t.preventDefault(),w(this).focus()}}).data({modal:t.modal});T.prepend(p),x(),e.each(t.buttons,function(t,n){var a=e('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only elfinder-btncnt-'+v++ +" "+c+'"><span class="ui-button-text">'+t+"</span></button>").on("click",e.proxy(n,i[0]));r?f.append(a):f.prepend(a)}),f.children().length&&(T.append(m),T.show(),m.find("button").each(function(t,n){g+=e(n).outerWidth(!0)}),T.hide(),g+=20,T.width()<g&&T.width(g)),T.trigger("posinit").data("margin-y",i.outerHeight(!0)-i.height()),t.resizable&&e.fn.resizable&&T.resizable({minWidth:t.minWidth,minHeight:t.minHeight,start:function(){T.data("resizing")!==!0&&T.data("resizing")&&clearTimeout(T.data("resizing")),T.data("resizing",!0)},stop:function(){T.data("resizing",setTimeout(function(){T.data("resizing",!1)},200))},resize:function(t,n){var a=0;T.children(".ui-widget-header,.ui-dialog-buttonpane").each(function(){a+=e(this).outerHeight(!0)}),i.height(n.size.height-a-T.data("margin-y")),T.trigger("resize")}}),"function"==typeof t.create&&e.proxy(t.create,this)(),y(),t.autoOpen&&i.elfinderdialog("open")}),this)},e.fn.elfinderdialog.defaults={cssClass:"",title:"",modal:!1,resizable:!0,autoOpen:!0,closeOnEscape:!0,destroyOnClose:!1,buttons:{},btnHoverFocus:!0,position:null,absolute:!1,width:320,height:"auto",minWidth:200,minHeight:110,allowMinimize:"auto",allowMaximize:!1,headerBtnPos:"auto",headerBtnOrder:"auto"},e.fn.elfinderfullscreenbutton=function(t){return this.each(function(){var n=e(this).elfinderbutton(t),i=n.children(".elfinder-button-icon");t.change(function(){var e=t.value;i.toggleClass("elfinder-button-icon-unfullscreen",e),n.attr("title",e?t.fm.i18n("reinstate"):t.fm.i18n("cmdfullscreen")),t.className=e?"unfullscreen":"",t.title=t.fm.i18n(e?"reinstate":"cmdfullscreen")})})},e.fn.elfindermkdirbutton=function(t){return this.each(function(){var n=e(this).elfinderbutton(t);t.change(function(){n.attr("title",t.value)})})},e.fn.elfindernavbar=function(t,n){return this.not(".elfinder-navbar").each(function(){var i,a,r,o,s=e(this).hide().addClass("ui-state-default elfinder-navbar"),l=s.parent(),d=l.children(".elfinder-workzone").append(s),c=s.outerHeight()-s.height(),u="ltr"==t.direction,h=function(){var n=t.getUI("cwd"),i=t.getUI("workzone"),a=i.data("rectangle"),r=n.offset();i.data("rectangle",e.extend(a,{cwdEdge:"ltr"===t.direction?r.left:r.left+n.width()}))};t.one("cssloaded",function(){var e=c;c=s.outerHeight()-s.height(),e!==c&&t.trigger("wzresize")}).bind("wzresize",function(){s.height(d.height()-c)}),t.UA.Touch&&(r=t.storage("autoHide")||{},"undefined"==typeof r.navbar&&(r.navbar=n.autoHideUA&&n.autoHideUA.length>0&&e.map(n.autoHideUA,function(e){return t.UA[e]?!0:null}).length,t.storage("autoHide",r)),r.navbar&&t.one("init",function(){t.uiAutoHide.push(function(){s.stop(!0,!0).trigger("navhide",{duration:"slow",init:!0})})}),t.bind("load",function(){a=e('<div class="elfinder-navbar-swipe-handle"/>').hide().appendTo(d),"none"!==a.css("pointer-events")&&(a.remove(),a=null)}),s.on("navshow navhide",function(n,i){var o="navshow"===n.type?"show":"hide",l=i&&i.duration?i.duration:"fast",d=i&&i.handleW?i.handleW:Math.max(50,t.getUI().width()/10);s.stop(!0,!0)[o](l,function(){"show"===o?a&&a.stop(!0,!0).hide():a&&(a.width(d?d:""),t.resources.blink(a,"slowonce")),t.trigger("navbar"+o).getUI("cwd").trigger("resize"),i.init&&t.trigger("uiautohide"),h()}),r.navbar="show"!==o,t.storage("autoHide",e.extend(t.storage("autoHide"),{navbar:r.navbar}))})),e.fn.resizable&&!t.UA.Mobile&&(i=s.resizable({handles:u?"e":"w",minWidth:n.minWidth||150,maxWidth:n.maxWidth||500,stop:function(e,n){t.storage("navbarWidth",n.size.width),h()}}).on("resize scroll",function(n){u||"resize"!==n.type||s.css("left",0),clearTimeout(e(this).data("posinit")),e(this).data("posinit",setTimeout(function(){var e=t.UA.Opera&&s.scrollLeft()?20:2;i.css({top:parseInt(s.scrollTop())+"px",left:u?"auto":parseInt(s.scrollLeft()+e),right:u?-1*parseInt(s.scrollLeft()-e):"auto"}),"resize"===n.type&&t.getUI("cwd").trigger("resize")},50))}).find(".ui-resizable-handle").addClass("ui-front"),t.one("open",function(){setTimeout(function(){s.trigger("resize")},150)})),(o=t.storage("navbarWidth"))?s.width(o):t.UA.Mobile&&t.one("cssloaded",function(){s.data("defWidth",s.width()),e(window).on("resize."+t.namespace,function(e){o=s.parent().width()/2,s.data("defWidth")>o?s.width(o):s.width(s.data("defWidth")),s.data("width",s.width())})})}),this},e.fn.elfinderoverlay=function(t){var n=this.parent().elfinder("instance");if(this.filter(":not(.elfinder-overlay)").each(function(){t=e.extend({},t),e(this).addClass("ui-front ui-widget-overlay elfinder-overlay").hide().mousedown(function(e){e.preventDefault(),e.stopPropagation()}).data({cnt:0,show:"function"==typeof t.show?t.show:function(){},hide:"function"==typeof t.hide?t.hide:function(){}})}),"show"==t){var i=this.eq(0),a=i.data("cnt")+1,r=i.data("show");n.toFront(i),i.data("cnt",a),i.is(":hidden")&&(i.show(),r())}if("hide"==t){var i=this.eq(0),a=i.data("cnt")-1,o=i.data("hide");i.data("cnt",a),0>=a&&(i.hide(),o())}return this},e.fn.elfinderpanel=function(t){return this.each(function(){var n=e(this).addClass("elfinder-panel ui-state-default ui-corner-all"),i="margin-"+("ltr"==t.direction?"left":"right");t.one("load",function(e){var a=t.getUI("navbar");n.css(i,parseInt(a.outerWidth(!0))),a.on("resize",function(){n.is(":visible")&&n.css(i,parseInt(a.outerWidth(!0)))})})})},e.fn.elfinderpath=function(t){return this.each(function(){var n="",a="",r=[],o="statusbar",s=t.res("class","hover"),l="path"+(i.prototype.uniqueid?i.prototype.uniqueid:"")+"-",d=e('<div class="ui-widget-header ui-helper-clearfix elfinder-workzone-path"/>'),c=e(this).addClass("elfinder-path").html("&nbsp;").on("mousedown","span.elfinder-path-dir",function(i){var a=e(this).attr("id").substr(l.length);i.preventDefault(),a!=t.cwd().hash&&(e(this).addClass(s),n?t.exec("search",n,{target:a,mime:r.join(" ")}):t.exec("open",a))}).prependTo(t.getUI("statusbar").show()),u=e('<div class="elfinder-path-roots"/>').on("click",function(n){n.stopPropagation(),n.preventDefault();var i=e.map(t.roots,function(e){return t.file(e)}),a=[];e.each(i,function(e,n){n.phash||t.root(t.cwd().hash,!0)===n.hash||a.push({label:t.escape(n.i18||n.name),icon:"home",callback:function(){t.exec("open",n.hash)},options:{iconClass:n.csscls||"",iconImg:n.icon||""}})}),t.trigger("contextmenu",{raw:a,x:n.pageX,y:n.pageY})}).append('<span class="elfinder-button-icon elfinder-button-icon-menu" />').appendTo(d),h=function(n){var i=[];return e.each(t.parents(n),function(e,a){var r=n===a?"elfinder-path-dir elfinder-path-cwd":"elfinder-path-dir",o=t.file(a),s=t.escape(o.i18||o.name);i.push('<span id="'+l+a+'" class="'+r+'" title="'+s+'">'+s+"</span>")}),i.join('<span class="elfinder-path-other">'+t.option("separator")+"</span>")},p=function(){var n;c.children("span.elfinder-path-dir").attr("style",""),n="ltr"===t.direction?e("#"+l+t.cwd().hash).prevAll("span.elfinder-path-dir:first"):e(),c.scrollLeft(n.length?n.position().left:0)},f=function(){var t,n,i=c.children("span.elfinder-path-dir"),a=i.length;return"workzone"===o||2>a?void i.attr("style",""):(c.width(c.css("max-width")),i.css({maxWidth:100/a+"%",display:"inline-block"}),t=c.width()-9,c.children("span.elfinder-path-other").each(function(){t-=e(this).width()}),n=[],i.each(function(i){var a=e(this),r=a.width();t-=r,r<this.scrollWidth&&n.push(i)}),c.width(""),void(n.length?(t>0&&(t/=n.length,e.each(n,function(n,a){var r=e(i[a]);r.css("max-width",r.width()+t)})),i.last().attr("style","")):i.attr("style","")))};t.bind("open searchend parents",function(){n="",a="",r=[],c.html(h(t.cwd().hash)),Object.keys(t.roots).length>1?(c.css("margin",""),u.show()):(c.css("margin",0),u.hide()),f()}).bind("searchstart",function(e){e.data&&(n=e.data.query||"",a=e.data.target||"",r=e.data.mimes||[])}).bind("search",function(e){var n="";n=a?h(a):t.i18n("btnAll"),c.html('<span class="elfinder-path-other">'+t.i18n("searcresult")+": </span>"+n),f()}).bind("navbarshow navbarhide",function(e){var n=t.getUI("workzone");"navbarshow"===e.type?(n.height(n.height()+d.outerHeight()),c.prependTo(t.getUI("statusbar")),d.detach(),o="statusbar",t.unbind("open",p)):(d.append(c).insertBefore(n),n.height(n.height()-d.outerHeight()),o="workzone",p(),t.bind("open",p)),t.trigger("uiresize")}).bind("resize",f)})},e.fn.elfinderplaces=function(t,n){return this.each(function(){var i={},a="class",r=t.res(a,"navdir"),o=t.res(a,"navcollapse"),s=t.res(a,"navexpand"),l=t.res(a,"hover"),d=t.res(a,"treeroot"),c=t.res(a,"adroppable"),u=t.res("tpl","placedir"),h=t.res("tpl","perms"),p=e(t.res("tpl","navspinner")),f="places"+(n.suffix?n.suffix:""),m=null,g=function(e){return e.substr(6)},v=function(e){return"place-"+e},b=function(){var n=[],a={};n=e.map(S.children().find("[id]"),function(e){return g(e.id)}),n.length?e.each(n.reverse(),function(e,t){a[t]=i[t]}):a=null,t.storage(f,a)},y=function(n,i){return e(u.replace(/\{id\}/,v(n?n.hash:i)).replace(/\{name\}/,t.escape(n?n.i18||n.name:i)).replace(/\{cssclass\}/,n?t.perms2class(n)+(n.notfound?" elfinder-na":"")+(n.csscls?" "+n.csscls:""):"").replace(/\{permissions\}/,!n||n.read&&n.write&&!n.notfound?"":h).replace(/\{title\}/,n&&n.path?t.escape(n.path):"").replace(/\{symlink\}/,"").replace(/\{style\}/,""))},w=function(e){var n,a;return"directory"!==e.mime?!1:(a=e.hash,t.files().hasOwnProperty(a)||t.trigger("tree",{tree:[e]}),n=y(e,a),i[a]=e,S.prepend(n),I.addClass(o),z.toggle(S.children().length>1),!0)},k=function(t){var n,a,r=null;return i[t]&&(delete i[t],n=e("#"+v(t)),n.length&&(r=n.text(),n.parent().remove(),a=S.children().length,z.toggle(a>1),a||(I.removeClass(o),U.removeClass(s),S.slideToggle(!1)))),r},x=function(n){var i=e("#"+v(n)),a=i.parent(),r=a.prev("div"),o="ui-state-hover",s=t.getUI("contextmenu");m&&clearTimeout(m),r.length&&(s.find(":first").data("placesHash",n),i.addClass(o),a.insertBefore(r),r=a.prev("div"),m=setTimeout(function(){i.removeClass(o),s.find(":first").data("placesHash")===n&&s.hide().empty()},1500)),r.length||(i.removeClass(o),s.hide().empty())},C=function(t,n){var a=t.hash,r=e("#"+v(n||a)),o=y(t,a);return r.length>0?(r.parent().replaceWith(o),i[a]=t,!0):!1},T=function(){e.each(i,function(n,i){var a=t.file(n)||i,o=y(a,n),s=null;return a||o.hide(),S.children().length&&(e.each(S.children(),function(){var t=e(this);return(a.i18||a.name).localeCompare(t.children("."+r).text())<0?s=!o.insertBefore(t):void 0}),null!==s)?!0:void(!e("#"+v(n)).length&&S.append(o))}),b()},z=e('<span class="elfinder-button-icon elfinder-button-icon-sort elfinder-places-root-icon" title="'+t.i18n("cmdsort")+'"/>').hide().on("click",function(e){e.stopPropagation(),S.empty(),T()}),A=y({hash:"root-"+t.namespace,name:t.i18n(n.name,"places"),read:!0,write:!0}),I=A.children("."+r).addClass(d).click(function(e){e.stopPropagation(),I.hasClass(o)&&(U.toggleClass(s),S.slideToggle(),t.storage("placesState",U.hasClass(s)?1:0))}).append(z),S=A.children("."+t.res(a,"navsubtree")),U=e(this).addClass(t.res(a,"tree")+" elfinder-places ui-corner-all").hide().append(A).appendTo(t.getUI("navbar")).on("mouseenter mouseleave","."+r,function(t){e(this).toggleClass("ui-state-hover","mouseenter"==t.type)}).on("click","."+r,function(n){var i=e(this);return i.data("longtap")?void n.stopPropagation():void(!i.hasClass("elfinder-na")&&t.exec("open",i.attr("id").substr(6)))}).on("contextmenu","."+r+":not(."+d+")",function(n){var i=e(this),a=i.attr("id").substr(6);n.preventDefault(),t.trigger("contextmenu",{raw:[{label:t.i18n("moveUp"),icon:"up",remain:!0,callback:function(){x(a),b()}},"|",{label:t.i18n("rmFromPlaces"),icon:"rm",callback:function(){k(a),b()}}],x:n.pageX,y:n.pageY}),i.addClass("ui-state-hover"),t.getUI("contextmenu").children().on("mouseenter",function(){i.addClass("ui-state-hover")}),t.bind("closecontextmenu",function(){i.removeClass("ui-state-hover")})}).droppable({tolerance:"pointer",accept:".elfinder-cwd-file-wrapper,.elfinder-tree-dir,.elfinder-cwd-file",hoverClass:t.res("class","adroppable"),classes:{"ui-droppable-hover":t.res("class","adroppable")},over:function(n,a){var r=a.helper,o=e.map(r.data("files"),function(e){return"directory"!==t.file(e).mime||i[e]?null:e});n.stopPropagation(),r.data("dropover",r.data("dropover")+1),t.insideWorkzone(n.pageX,n.pageY)&&(o.length>0?(r.addClass("elfinder-drag-helper-plus"),t.trigger("unlockfiles",{files:r.data("files"),helper:r})):e(this).removeClass(c))},out:function(n,i){var a=i.helper,r=n.shiftKey||n.ctrlKey||n.metaKey;n.stopPropagation(),a.toggleClass("elfinder-drag-helper-move elfinder-drag-helper-plus",a.data("locked")?!0:r).data("dropover",Math.max(a.data("dropover")-1,0)),e(this).removeData("dropover").removeClass(c),t.trigger(r?"unlockfiles":"lockfiles",{files:a.data("files"),helper:a})},drop:function(n,a){var r=a.helper,o=!0;e.each(r.data("files"),function(e,n){var a=t.file(n);a&&"directory"==a.mime&&!i[a.hash]?w(a):o=!1}),b(),o&&r.hide()}}).on("touchstart","."+r+":not(."+d+")",function(n){if(!(n.originalEvent.touches.length>1))var i=e(this).attr("id").substr(6),a=e(this).addClass(l).data("longtap",null).data("tmlongtap",setTimeout(function(){a.data("longtap",!0),t.trigger("contextmenu",{raw:[{label:t.i18n("rmFromPlaces"),icon:"rm",callback:function(){k(i),b()}}],x:n.originalEvent.touches[0].pageX,y:n.originalEvent.touches[0].pageY})},500))}).on("touchmove touchend","."+r+":not(."+d+")",function(t){clearTimeout(e(this).data("tmlongtap")),"touchmove"==t.type&&e(this).removeClass(l)});e.fn.sortable&&S.addClass("touch-punch").sortable({appendTo:t.getUI(),revert:!1,helper:function(n){var i=e(n.target).parent();return i.children().removeClass("ui-state-hover"),e('<div class="ui-widget elfinder-place-drag elfinder-'+t.direction+'"/>').append(e('<div class="elfinder-navbar"/>').show().append(i.clone()))},stop:function(t,n){var i=e(n.item[0]),a=U.offset().top,r=U.offset().left,o=U.width(),s=U.height(),l=t.pageX,d=t.pageY;l>r&&r+o>l&&d>a&&d+s>d||(k(g(i.children(":first").attr("id"))),b())},update:function(e,t){b()}}),e(this).on("regist",function(t,n){var a=!1;e.each(n,function(e,t){t&&"directory"==t.mime&&!i[t.hash]&&w(t)&&(a=!0)}),a&&b()}),t.one("load",function(){var n,a;t.oldAPI||(U.show().parent().show(),i={},n=t.storage(f),"string"==typeof n?(n=e.map(n.split(","),function(e){return e||null}),e.each(n,function(e,t){var n=t.split("#");i[n[0]]=n[1]?n[1]:n[0]})):e.isPlainObject(n)&&(i=n),t.trigger("placesload",{dirs:i,storageKey:f},!0),a=Object.keys(i),a.length&&(I.prepend(p),t.request({data:{cmd:"info",targets:a},preventDefault:!0}).done(function(n){var a={};e.each(n.files,function(e,t){var n=t.hash;a[n]=t}),e.each(i,function(t,n){w(a[t]||e.extend({notfound:!0},n))}),t.storage("placesState")>0&&I.click()}).always(function(){p.remove()})),t.change(function(t){var n=!1;e.each(t.data.changed,function(e,t){i[t.hash]&&("directory"!==t.mime?k(t.hash)&&(n=!0):C(t)&&(n=!0))}),n&&b()}).bind("rename",function(t){var n=!1;t.data.removed&&e.each(t.data.removed,function(e,i){t.data.added[e]&&C(t.data.added[e],i)&&(n=!0)}),n&&b()}).bind("rm paste",function(t){var n=[],i=!1;t.data.removed&&e.each(t.data.removed,function(e,t){var i=k(t);i&&n.push(i)}),n.length&&(i=!0),t.data.added&&n.length&&e.each(t.data.added,function(t,i){1!==e.inArray(i.name,n)&&"directory"==i.mime&&w(i)}),i&&b()}).bind("sync netmount",function(n){var a=Object.keys(i);a.length&&(I.prepend(p),t.request({data:{cmd:"info",targets:a},preventDefault:!0}).done(function(a){var r={},o=!1,s=t.cwd().hash;e.each(a.files||[],function(e,n){var i=n.hash;r[i]=n,t.files().hasOwnProperty(n.hash)||t.trigger("tree",{tree:[n]})}),e.each(i,function(t,i){!i.notfound!=!!r[t]?i.phash===s&&"netmount"!==n.type||r[t]&&"directory"!==r[t].mime?k(t)&&(o=!0):C(r[t]||e.extend({notfound:!0},i))&&(o=!0):r[t]&&r[t].phash!=s&&C(r[t])}),o&&b()}).always(function(){p.remove()}))}))})})},e.fn.elfindersearchbutton=function(t){return this.each(function(){
var n,i=!1,a=t.fm,r=t.options.incsearch||{enable:!1},o=function(e){return a.namespace+e},s=a.getUI("toolbar"),l=a.res("class","searchbtn"),d=e(this).hide().addClass("ui-widget-content elfinder-button "+l),c=function(){p.data("inctm")&&clearTimeout(p.data("inctm")),n&&n.slideUp();var r=e.trim(p.val()),s=!e("#"+o("SearchFromAll")).prop("checked"),l=e("#"+o("SearchMime")).prop("checked");s&&(s=e("#"+o("SearchFromVol")).prop("checked")?a.root(a.cwd().hash):a.cwd().hash),l&&(l=r,r="."),r?t.exec(r,s,l).done(function(){i=!0,p.focus()}).fail(function(){u()}):a.trigger("searchend")},u=function(){p.data("inctm")&&clearTimeout(p.data("inctm")),p.val("").blur(),(i||h)&&(i=!1,h="",a.lazy(function(){a.trigger("searchend")}))},h="",p=e('<input type="text" size="42"/>').on("focus",function(){h="",n&&n.slideDown()}).on("blur",function(){n&&(n.data("infocus")?n.data("infocus",!1):n.slideUp())}).appendTo(d).on("keypress",function(e){e.stopPropagation()}).on("keydown",function(t){t.stopPropagation(),t.keyCode==e.ui.keyCode.ENTER&&c(),t.keyCode==e.ui.keyCode.ESCAPE&&(t.preventDefault(),u())});r.enable&&(r.minlen=r.minlen||2,r.wait=r.wait||500,p.attr("title",a.i18n("incSearchOnly")).on("compositionstart",function(){p.data("composing",!0)}).on("compositionend",function(){p.removeData("composing"),p.trigger("input")}).on("input",function(){p.data("composing")||(p.data("inctm")&&clearTimeout(p.data("inctm")),p.data("inctm",setTimeout(function(){var e=p.val();(0===e.length||e.length>=r.minlen)&&(h!==e&&a.trigger("incsearchstart",{query:e}),h=e,""===e&&a.searchStatus.state>1&&a.searchStatus.query&&p.val(a.searchStatus.query).select())},r.wait)))}),a.UA.ltIE8&&p.on("keydown",function(e){229===e.keyCode&&(p.data("imetm")&&clearTimeout(p.data("imetm")),p.data("composing",!0),p.data("imetm",setTimeout(function(){p.removeData("composing")},100)))}).on("keyup",function(t){p.data("imetm")&&clearTimeout(p.data("imetm")),p.data("composing")?t.keyCode===e.ui.keyCode.ENTER&&p.trigger("compositionend"):p.trigger("input")})),e('<span class="ui-icon ui-icon-search" title="'+t.title+'"/>').appendTo(d).click(c),e('<span class="ui-icon ui-icon-close"/>').appendTo(d).click(u),a.bind("toolbarload",function(){var e=d.parent();if(e.length&&(s.prepend(d.show()),e.remove(),a.UA.ltIE7)){var t=d.children("ltr"==a.direction?".ui-icon-close":".ui-icon-search");t.css({right:"",left:parseInt(d.width())-t.outerWidth(!0)})}}),a.one("open",function(){n=a.api<2.1?null:e('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu ui-corner-all"/>').append(e('<div class="buttonset"/>').append(e('<input id="'+o("SearchFromCwd")+'" name="serchfrom" type="radio" checked="checked"/><label for="'+o("SearchFromCwd")+'">'+a.i18n("btnCwd")+"</label>"),e('<input id="'+o("SearchFromVol")+'" name="serchfrom" type="radio"/><label for="'+o("SearchFromVol")+'">'+a.i18n("btnVolume")+"</label>"),e('<input id="'+o("SearchFromAll")+'" name="serchfrom" type="radio"/><label for="'+o("SearchFromAll")+'">'+a.i18n("btnAll")+"</label>")),e('<div class="buttonset"/>').append(e('<input id="'+o("SearchName")+'" name="serchcol" type="radio" checked="checked"/><label for="'+o("SearchName")+'">'+a.i18n("btnFileName")+"</label>"),e('<input id="'+o("SearchMime")+'" name="serchcol" type="radio"/><label for="'+o("SearchMime")+'">'+a.i18n("btnMime")+"</label>"))).hide().appendTo(d),n&&(n.find("div.buttonset").buttonset(),e("#"+o("SearchFromAll")).next("label").attr("title",a.i18n("searchTarget",a.i18n("btnAll"))),e("#"+o("SearchMime")).next("label").attr("title",a.i18n("searchMime")),n.on("mousedown","div.buttonset",function(e){e.stopPropagation(),n.data("infocus",!0)}).on("click","input",function(t){t.stopPropagation(),e.trim(p.val())&&c()}))}).select(function(){p.blur()}).bind("searchend",function(){p.val("")}).bind("open parents",function(){var t=[],n=a.file(a.root(a.cwd().hash));n&&(e.each(a.parents(a.cwd().hash),function(e,n){t.push(a.file(n).name)}),e("#"+o("SearchFromCwd")).next("label").attr("title",a.i18n("searchTarget",t.join(a.option("separator")))),e("#"+o("SearchFromVol")).next("label").attr("title",a.i18n("searchTarget",n.name)))}).shortcut({pattern:"ctrl+f f3",description:t.title,callback:function(){p.select().focus()}})})},e.fn.elfindersortbutton=function(t){return this.each(function(){var n=t.fm,i=t.name,a="class",r=n.res(a,"disabled"),o=n.res(a,"hover"),s="elfinder-button-menu-item",l=s+"-selected",d=l+"-asc",c=l+"-desc",u=e('<span class="elfinder-button-text">'+t.title+"</span>"),h=e(this).addClass("ui-state-default elfinder-button elfinder-menubutton elfiner-button-"+i).attr("title",t.title).append('<span class="elfinder-button-icon elfinder-button-icon-'+i+'"/>',u).hover(function(e){!h.hasClass(r)&&h.toggleClass(o)}).click(function(e){h.hasClass(r)||(e.stopPropagation(),p.is(":hidden")&&t.fm.getUI().click(),p.slideToggle(100))}),p=e('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu ui-corner-all"/>').hide().appendTo(h).on("mouseenter mouseleave","."+s,function(){e(this).toggleClass(o)}).on("click","."+s,function(e){e.preventDefault(),e.stopPropagation(),m()}),f=function(){p.children("[rel]").removeClass(l+" "+d+" "+c).filter('[rel="'+n.sortType+'"]').addClass(l+" "+("asc"==n.sortOrder?d:c)),p.children(".elfinder-sort-stick").toggleClass(l,n.sortStickFolders),p.children(".elfinder-sort-tree").toggleClass(l,n.sortAlsoTreeview)},m=function(){p.hide()};u.hide(),e.each(n.sortRules,function(t,i){p.append(e('<div class="'+s+'" rel="'+t+'"><span class="ui-icon ui-icon-arrowthick-1-n"/><span class="ui-icon ui-icon-arrowthick-1-s"/>'+n.i18n("sort"+t)+"</div>").data("type",t))}),p.children().click(function(i){var a=e(this).attr("rel");t.exec([],{type:a,order:a==n.sortType?"asc"==n.sortOrder?"desc":"asc":n.sortOrder,stick:n.sortStickFolders,tree:n.sortAlsoTreeview})}),e('<div class="'+s+" "+s+'-separated elfinder-sort-ext elfinder-sort-stick"><span class="ui-icon ui-icon-check"/>'+n.i18n("sortFoldersFirst")+"</div>").appendTo(p).click(function(){t.exec([],{type:n.sortType,order:n.sortOrder,stick:!n.sortStickFolders,tree:n.sortAlsoTreeview})}),e.fn.elfindertree&&-1!==e.inArray("tree",n.options.ui)&&e('<div class="'+s+" "+s+'-separated elfinder-sort-ext elfinder-sort-tree"><span class="ui-icon ui-icon-check"/>'+n.i18n("sortAlsoTreeview")+"</div>").appendTo(p).click(function(){t.exec([],{type:n.sortType,order:n.sortOrder,stick:n.sortStickFolders,tree:!n.sortAlsoTreeview})}),n.bind("disable select",m).getUI().click(m),n.bind("sortchange",f),p.children().length>1?t.change(function(){h.toggleClass(r,t.disabled()),f()}).change():h.addClass(r)})},e.fn.elfinderstat=function(t){return this.each(function(){var n=e(this).addClass("elfinder-stat-size"),i=e('<div class="elfinder-stat-selected"/>').on("click","a",function(n){var i=e(this).data("hash");n.preventDefault(),t.exec("opendir",[i])}),a=t.i18n("size"),r=t.i18n("items"),o=t.i18n("selected"),s=function(i,o){var s=0,l=0;e.each(i,function(e,t){o&&t.phash!=o||(s++,l+=parseInt(t.size)||0)}),n.html(r+': <span class="elfinder-stat-incsearch"></span>'+s+", "+a+": "+t.formatSize(l))},l=function(e){n.find("span.elfinder-stat-incsearch").html(e?e.hashes.length+" / ":"")},d=!1;t.getUI("statusbar").prepend(n).append(i).show(),t.bind("open reload add remove change searchend",function(){s(t.files(),t.cwd().hash)}).bind("searchend",function(){d=!1}).search(function(e){d=!0,s(e.data.files)}).select(function(){var n,r=0,s=0,l=t.selectedFiles(),c=[];return 1==l.length?(n=l[0],r=n.size,d&&c.push('<a href="#elf_'+n.phash+'" data-hash="'+n.hash+'">'+(n.path?n.path.replace(/\/[^\/]*$/,""):"..")+"</a>"),c.push(t.escape(n.name)),void i.html(c.join("/")+(r>0?", "+t.formatSize(r):""))):(e.each(l,function(e,t){s++,r+=parseInt(t.size)||0}),void i.html(s?o+": "+s+", "+a+": "+t.formatSize(r):"&nbsp;"))}).bind("incsearch",function(e){l(e.data)}).bind("incsearchend",function(){l()})})},e.fn.elfindertoast=function(t,n){var i={mode:"success",msg:"",showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1500,hideEasing:"swing",onHidden:void 0,timeOut:3e3,extNode:void 0};return this.each(function(){t=e.extend({},i,t||{});var n,a=e(this),r=function(e){a.stop(),a[t.showMethod]({duration:t.showDuration,easing:t.showEasing,complete:function(){t.onShown&&t.onShown(),!e&&t.timeOut&&(n=setTimeout(o,t.timeOut))}})},o=function(){a[t.hideMethod]({duration:t.hideDuration,easing:t.hideEasing,complete:function(){t.onHidden&&t.onHidden(),a.remove()}})};a.on("click",function(e){e.stopPropagation(),e.preventDefault(),a.stop().remove()}).on("mouseenter mouseleave",function(e){t.timeOut&&(n&&clearTimeout(n),n=null,"mouseenter"===e.type?r(!0):n=setTimeout(o,t.timeOut))}).hide().addClass("toast-"+t.mode).append(e('<div class="elfinder-toast-msg"/>').html(t.msg)),t.extNode&&a.append(t.extNode),r()})},e.fn.elfindertoolbar=function(t,n){return this.not(".elfinder-toolbar").each(function(){var i,a,r,o,s,l,d,c,u=t._commands,h=e(this).addClass("ui-helper-clearfix ui-widget-header ui-corner-top elfinder-toolbar"),p={displayTextLabel:!1,labelExcludeUA:["Mobile"],autoHideUA:["Mobile"]},f=function(t){return e.map(t,function(t){return e.isPlainObject(t)?(p=e.extend(p,t),null):[t]})},m=function(n){var l;for(e.each(g,function(e,t){t.detach()}),h.empty(),i=v.length;i--;)if(v[i]){for(o=e('<div class="ui-widget-content ui-corner-all elfinder-buttonset"/>'),a=v[i].length;a--;)l=v[i][a],n&&-1!==e.inArray(l,n)||!(r=u[l])||(s="elfinder"+r.options.ui,!g[l]&&e.fn[s]&&(g[l]=e("<div/>")[s](r)),g[l]&&(c&&g[l].find(".elfinder-button-text").show(),o.prepend(g[l])));o.children().length&&h.prepend(o),o.children(":gt(0)").before('<span class="ui-widget-content elfinder-toolbar-button-separator"/>')}!h.data("swipeClose")&&h.children().length?h.show():h.hide(),t.trigger("toolbarload").trigger("uiresize")},g={},v=f(n||[]),b=null,y="";c=t.storage("toolbarTextLabel"),c=null===c?p.displayTextLabel&&(!p.labelExcludeUA||!p.labelExcludeUA.length||!e.map(p.labelExcludeUA,function(e){return t.UA[e]?!0:null}).length):1==c,h.on("contextmenu",function(e){e.stopPropagation(),e.preventDefault(),t.trigger("contextmenu",{raw:[{label:t.i18n("textLabel"),icon:"accept",callback:function(){c=!c,h.height("").find(".elfinder-button-text")[c?"show":"hide"](),t.trigger("uiresize").storage("toolbarTextLabel",c?"1":"0")}}],x:e.pageX,y:e.pageY})}).on("touchstart",function(e){e.originalEvent.touches.length>1||(h.data("tmlongtap")&&clearTimeout(h.data("tmlongtap")),h.removeData("longtap").data("longtap",{x:e.originalEvent.touches[0].pageX,y:e.originalEvent.touches[0].pageY}).data("tmlongtap",setTimeout(function(){h.removeData("longtapTm").trigger({type:"contextmenu",pageX:h.data("longtap").x,pageY:h.data("longtap").y}).data("longtap",{longtap:!0})},500)))}).on("touchmove touchend",function(e){h.data("tmlongtap")&&(("touchend"===e.type||Math.abs(h.data("longtap").x-e.originalEvent.touches[0].pageX)+Math.abs(h.data("longtap").y-e.originalEvent.touches[0].pageY)>4)&&clearTimeout(h.data("tmlongtap")),h.removeData("longtapTm"))}).on("click",function(e){h.data("longtap")&&h.data("longtap").longtap&&(e.stopImmediatePropagation(),e.preventDefault())}).on("touchend click",".elfinder-button",function(e){h.data("longtap")&&h.data("longtap").longtap&&(e.stopImmediatePropagation(),e.preventDefault())}),h.prev().length&&h.parent().prepend(this),m(),t.bind("open sync select",function(n){var i,a,r=t.option("disabled");"select"===n.type&&(a=t.selected(),a.length&&(r=t.getDisabledCmds(a))),b&&b.toString()===r.sort().toString()||(m(r&&r.length?r:null),i=!0),b=r.concat().sort(),(i||y!==JSON.stringify(t.commandMap))&&(y=JSON.stringify(t.commandMap),i||e.each(e("div.elfinder-button"),function(){var t=e(this).data("origin");t&&e(this).after(t).detach()}),Object.keys(t.commandMap).length&&e.each(t.commandMap,function(n,i){var a,r=t._commands[i],o=r?"elfinder"+r.options.ui:null;o&&e.fn[o]&&(a=g[n],a&&(!g[i]&&e.fn[o]&&(g[i]=e("<div/>")[o](t._commands[i]),g[i]&&(c&&g[i].find(".elfinder-button-text").show(),r.extendsCmd&&g[i].children("span.elfinder-button-icon").addClass("elfinder-button-icon-"+r.extendsCmd))),g[i]&&(a.after(g[i]),g[i].data("origin",a.detach()))))}))}),t.UA.Touch&&(d=t.storage("autoHide")||{},"undefined"==typeof d.toolbar&&(d.toolbar=p.autoHideUA&&p.autoHideUA.length>0&&e.map(p.autoHideUA,function(e){return t.UA[e]?!0:null}).length,t.storage("autoHide",d)),d.toolbar&&t.one("init",function(){t.uiAutoHide.push(function(){h.stop(!0,!0).trigger("toggle",{duration:500,init:!0})})}),t.bind("load",function(){l=e('<div class="elfinder-toolbar-swipe-handle"/>').hide().appendTo(t.getUI()),"none"!==l.css("pointer-events")&&(l.remove(),l=null)}),h.on("toggle",function(n,i){var a=t.getUI("workzone"),r=h.is(":hidden"),o=a.height(),s=h.height(),c=h.outerHeight(!0),u=c-s,p=e.extend({step:function(e){a.height(o+(r?-1*(e+u):s-e)),t.trigger("resize")},always:function(){h.css("height",""),t.trigger("uiresize"),l&&(r?l.stop(!0,!0).hide():(l.height(i.handleH?i.handleH:""),t.resources.blink(l,"slowonce"))),i.init&&t.trigger("uiautohide")}},i);h.data("swipeClose",!r).stop(!0,!0).animate({height:"toggle"},p),d.toolbar=!r,t.storage("autoHide",e.extend(t.storage("autoHide"),{toolbar:d.toolbar}))}))}),this},e.fn.elfindertree=function(t,n){var i=t.res("class","tree");return this.not("."+i).each(function(){var a="class",r=t.UA.Mobile,o=t.res(a,"treeroot"),s=n.openRootOnLoad,l=n.openCwdOnOpen,d=t.res(a,"navsubtree"),c=t.res(a,"treedir"),u="span."+c,h=t.res(a,"navcollapse"),p=t.res(a,"navexpand"),f="elfinder-subtree-loaded",m=t.res(a,"navarrow"),g=t.res(a,"active"),v=t.res(a,"adroppable"),b=t.res(a,"hover"),y=t.res(a,"disabled"),w=t.res(a,"draggable"),k=t.res(a,"droppable"),x="elfinder-navbar-wrapper-root",C="elfinder-navbar-wrapper-pastable",T="elfinder-navbar-wrapper-uploadable",z=function(e){var t=B.offset().left;return e>=t&&e<=t+B.width()},A=t.droppable.drop,I=e.extend(!0,{},t.droppable,{over:function(n,i){var a,r,o=e(this),s=i.helper,l=b+" "+v;return n.stopPropagation(),s.data("dropover",s.data("dropover")+1),o.data("dropover",!0),i.helper.data("namespace")===t.namespace&&z(n.clientX)&&t.insideWorkzone(n.pageX,n.pageY)?(o.addClass(b),o.is("."+h+":not(."+p+")")&&o.data("expandTimer",setTimeout(function(){o.is("."+h+"."+b)&&o.children("."+m).click()},500)),o.is(".elfinder-ro,.elfinder-na")?(o.removeClass(v),void s.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus")):(a=t.navId2Hash(o.attr("id")),o.data("dropover",a),e.each(i.helper.data("files"),function(e,n){return n===a||t.file(n).phash===a&&!i.helper.hasClass("elfinder-drag-helper-plus")?(o.removeClass(l),!1):void 0}),s.data("locked")?r="elfinder-drag-helper-plus":(r="elfinder-drag-helper-move",(n.shiftKey||n.ctrlKey||n.metaKey)&&(r+=" elfinder-drag-helper-plus")),o.hasClass(v)&&s.addClass(r),void setTimeout(function(){o.hasClass(v)&&s.addClass(r)},20))):(o.removeClass(l),void s.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus"))},out:function(t,n){var i=e(this),a=n.helper;t.stopPropagation(),a.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus").data("dropover",Math.max(a.data("dropover")-1,0)),i.data("expandTimer")&&clearTimeout(i.data("expandTimer")),i.removeData("dropover").removeClass(b+" "+v)},deactivate:function(){e(this).removeData("dropover").removeClass(b+" "+v)},drop:function(e,t){z(e.clientX)&&A.call(this,e,t)}}),S=e(t.res("tpl","navspinner")),U=t.res("tpl","navdir"),M=t.res("tpl","perms"),O=(t.res("tpl","lock"),t.res("tpl","symlink")),D={id:function(e){return t.navHash2Id(e.hash)},cssclass:function(e){var i=(e.phash&&!e.isroot?"":o)+" "+c+" "+t.perms2class(e);return e.dirs&&!e.link&&(i+=" "+h),n.getClass&&(i+=" "+n.getClass(e)),e.csscls&&(i+=" "+t.escape(e.csscls)),i},permissions:function(e){return e.read&&e.write?"":M},symlink:function(e){return e.alias?O:""},style:function(e){return e.icon?"style=\"background:url('"+t.escape(e.icon)+"') 0 0 no-repeat;background-size:contain;\"":""}},F=function(e){return e.name=t.escape(e.i18||e.name),U.replace(/(?:\{([a-z]+)\})/gi,function(t,n){return e[n]||(D[n]?D[n](e):"")})},E=function(t){return e.map(t||[],function(e){return"directory"==e.mime?e:null})},P=function(n){return n?e("#"+t.navHash2Id(n)).next("."+d):W},R=function(n,i){for(var a,r=n.children(":first");r.length;){if(a=t.file(t.navId2Hash(r.children("[id]").attr("id"))),(a=t.file(t.navId2Hash(r.children("[id]").attr("id"))))&&H(i,a)<0)return r;r=r.next()}return e("")},j=function(n){for(var i,a,o,s,l,d,c=n.length,u=[],h=c,p=e(),f={},m={},g=!0;h--;)i=n[h],f[i.hash]||e("#"+t.navHash2Id(i.hash)).length||(f[i.hash]=!0,(a=P(i.phash)).length?i.phash&&((s=!a.children().length)||(o=R(a,i)).length)?s?(m[i.phash]||(m[i.phash]=[]),m[i.phash].push(i)):(d=F(i),o.before(d),!r&&(p=p.add(d))):(d=F(i),a[g||i.phash?"append":"prepend"](d),g=!1,i.phash&&!i.isroot||(l=e("#"+t.navHash2Id(i.hash)).parent().addClass(x),!i.disabled||i.disabled.length<1?l.addClass(C+" "+T):(-1===e.inArray("paste",i.disabled)&&l.addClass(C),-1===e.inArray("upload",i.disabled)&&l.addClass(T))),!r&&_(null,l)):u.push(i));return Object.keys(m).length&&e.each(m,function(n,i){var a=P(n),o=[];i.sort(H),e.each(i,function(e,t){o.push(F(t))}),a.append(o.join("")),!r&&t.lazy(function(){_(null,a)})}),u.length&&u.length<c?void j(u):void(!r&&p.length&&t.lazy(function(){_(p)}))},H=function(e,n){if(t.sortAlsoTreeview){var i,a="asc"==t.sortOrder,r=t.sortType,o=t.sortRules;return i=a?o[t.sortType](e,n):o[t.sortType](n,e),"name"!==r&&0===i?i=a?o.name(e,n):o.name(n,e):i}return t.sortRules.name(e,n)},N=function(n){var i=e(this),a=e.Deferred();return i.data("autoScrTm")&&clearTimeout(i.data("autoScrTm")),i.data("autoScrTm",setTimeout(function(){var i=e("#"+(n||t.navHash2Id(t.cwd().hash)));if(i.length){var r=W.parent().stop(!1,!0),o=r.offset().top,s=r.height(),l=o+s-i.outerHeight(),d=i.offset().top;o>d||d>l?r.animate({scrollTop:r.scrollTop()+d-o-s/3},{duration:"fast",complete:function(){a.resolve()}}):a.resolve()}else a.reject()},100)),a},q=function(i,a,r,c){var v,b,y,w,k,x,C=t.cwd(),T=C.hash,z=e("#"+t.navHash2Id(T)),i=i||!1,a=a||[],c=c||$,A="parents",I=[],U=function(e){var n=t.file(e);return!n||!n.isroot&&n.phash?"parents":"tree"},M=function(n,i){var a,r;D[n+i]||("tree"===n&&i!==T&&(a=e("#"+t.navHash2Id(i)),a.length&&(r=e(t.res("tpl","navspinner")).insertBefore(a.children("."+m)),a.removeClass(h))),D[n+i]=!0,I.push(t.request({data:{cmd:n,target:i},preventFail:!0}).done(function(){e("#"+t.navHash2Id("tree"===n?i:t.root(i))).addClass(f)}).always(function(){r&&(r.remove(),a.addClass(h+" "+p).next("."+d).show())})))},O=function(e){for(var n,i,a=t.root(e);a;)a&&(a=t.file(a))&&(n=a.phash)&&0!==n.indexOf(a.volumeid)?(i=U(n),"parents"===i&&M("tree",n),M(i,n),a=t.root(n)):a=null},D={};if(s&&(v=e("#"+t.navHash2Id(t.root())),v.hasClass(f)&&v.addClass(p).next("."+d).show(),s=!1),z.hasClass(g)||(W.find(u+"."+g).removeClass(g),z.addClass(g)),n.syncTree||!z.length){if(z.length&&(i||!r||!C.isroot))return i&&!r||(z.addClass(f),l&&z.hasClass(h)&&z.addClass(p).next("."+d).slideDown()),void(!c&&i||(w=z.parentsUntil("."+o).filter("."+d),k=w.length,x=1,w.show().prev(u).addClass(p,function(){!i&&k==x++&&N()}),!k&&!i&&N()));if(t.newAPI){if(b=t.file(T),b&&b.phash&&!b.isroot&&(y=e("#"+t.navHash2Id(b.phash)),y.length&&y.hasClass(f)))return void t.lazy(function(){j([b]),q(i,[],!1,c)});i||(C.isroot&&C.phash?(A="tree"===U(C.phash)?"tree":"parents",O(T),T=C.phash):C.phash?O(C.phash):A=null),A&&M(A,T),y=C.root?e("#"+t.navHash2Id(C.root)):null,y&&(S.insertBefore(y.children("."+m)),y.removeClass(h)),e.when.apply(e,I).done(function(n){var o,s,l;if(n||(n={tree:[]}),t.api<2.1&&n.tree.push(C),s=arguments.length,s>1)for(l=1;s>l;l++)arguments[l].tree&&arguments[l].tree.length&&n.tree.push.apply(n.tree,arguments[l].tree);o=E(n.tree),C.isroot&&C.hash===T&&!o.length&&(delete C.isroot,delete C.phash),a=JSON.parse(JSON.stringify(e.merge(a,o))),j(a),L(a,f),!i&&C.isroot&&e("#"+t.navHash2Id(C.hash).length)&&q(!0,[],r,c),T==C.hash&&t.visible()&&q(i,[],!1,c)}).always(function(){y&&(S.remove(),y.addClass(h+" "+f))})}}},_=function(n,i){var a,r=100;n||(i&&!i.closest("div."+x).hasClass(T)||(i||W.find("div."+T)).find(u+":not(.elfinder-ro,.elfinder-na)").addClass("native-droppable"),n=!i||i.closest("div."+x).hasClass(C)?(i||W.find("div."+C)).find(u+":not(."+k+")"):e()),n.length>r&&(a=n.slice(r),n=n.slice(0,r)),n.droppable(I),a&&t.lazy(function(){_(a)},20)},L=function(n,i){var a=i==f?"."+h+":not(."+f+")":":not(."+h+")";e.each(n,function(n,r){e("#"+t.navHash2Id(r.phash)+a).filter(function(){return e.map(e(this).next("."+d).children(),function(t){return e(t).children().hasClass(o)?null:t}).length>0}).addClass(i)})},W=e(this).addClass(i).on("mouseenter mouseleave",u,function(n){var i=e(this),a="mouseenter"==n.type;i.hasClass(v+" "+y)||(!r&&a&&!i.hasClass(o+" "+w+" elfinder-na elfinder-wo")&&i.draggable(t.draggable),i.toggleClass(b,a))}).on("dragenter",u,function(t){if(t.originalEvent.dataTransfer){var n=e(this);n.addClass(b),n.is("."+h+":not(."+p+")")&&n.data("expandTimer",setTimeout(function(){n.is("."+h+"."+b)&&n.children("."+m).click()},500))}}).on("dragleave",u,function(t){if(t.originalEvent.dataTransfer){var n=e(this);n.data("expandTimer")&&clearTimeout(n.data("expandTimer")),n.removeClass(b)}}).on("click",u,function(n){var i=e(this),a=t.navId2Hash(i.attr("id"));t.file(a);return i.data("longtap")?void n.stopPropagation():void(a==t.cwd().hash||i.hasClass(y)?(i.hasClass(h)&&i.children("."+m).click(),t.select({selected:[a],origin:"tree"})):t.exec("open",a).done(function(){t.select({selected:[a],origin:"tree"})}))}).on("touchstart",u,function(n){if(!(n.originalEvent.touches.length>1))var i=n.originalEvent,a=e(this).addClass(b).data("longtap",null).data("tmlongtap",setTimeout(function(e){a.data("longtap",!0),t.trigger("contextmenu",{type:"navbar",targets:[t.navId2Hash(a.attr("id"))],x:i.touches[0].pageX,y:i.touches[0].pageY})},500))}).on("touchmove touchend",u,function(t){clearTimeout(e(this).data("tmlongtap")),"touchmove"==t.type&&e(this).removeClass(b)}).on("click",u+"."+h+" ."+m,function(n){var i,a=e(this),r=a.parent(u),o=r.next("."+d),s=e.Deferred(),l=30;n.stopPropagation(),r.hasClass(f)?(r.toggleClass(p),t.lazy(function(){i=r.hasClass(p)?o.children().length+o.find("div.elfinder-navbar-subtree[style*=block]").children().length:o.find("div:visible").length,i>l?(o.toggle(),t.draggingUiHelper&&t.draggingUiHelper.data("refreshPositions",1)):o.stop(!0,!0).slideToggle("normal",function(){t.draggingUiHelper&&t.draggingUiHelper.data("refreshPositions",1)})}).always(function(){s.resolve()})):(S.insertBefore(a),r.removeClass(h),t.request({cmd:"tree",target:t.navId2Hash(r.attr("id"))}).done(function(e){j(JSON.parse(JSON.stringify(E(e.tree)))),o.children().length&&(r.addClass(h+" "+p),o.children().length>l?(o.show(),t.draggingUiHelper&&t.draggingUiHelper.data("refreshPositions",1)):o.stop(!0,!0).slideDown("normal",function(){t.draggingUiHelper&&t.draggingUiHelper.data("refreshPositions",1)})),q(!0)}).always(function(e){S.remove(),r.addClass(f),t.one("treedone",function(){s.resolve()})})),a.data("dfrd",s)}).on("contextmenu",u,function(n){var i=e(this);n.preventDefault(),t.trigger("contextmenu",{type:"navbar",targets:[t.navId2Hash(e(this).attr("id"))],x:n.pageX,y:n.pageY}),i.addClass("ui-state-hover"),t.getUI("contextmenu").children().on("mouseenter",function(){i.addClass("ui-state-hover")}),t.bind("closecontextmenu",function(){i.removeClass("ui-state-hover")})}).on("scrolltoview",u,function(){var n=e(this);N(n.attr("id")).done(function(){t.resources.blink(n,"lookme")})}).on("create."+t.namespace,function(n,i){var a=P(i.phash),r=i.move||!1,o=e(F(i)).addClass("elfinder-navbar-wrapper-tmp"),s=t.selected();r&&s.length&&t.trigger("lockfiles",{files:s}),a.prepend(o)}),B=t.getUI("navbar").append(W).show(),V=t.sortAlsoTreeview,$=!1;t.open(function(n){var i=n.data,a=E(i.files),r=t.getUI("contextmenu");i.init&&W.empty(),t.UA.iOS&&B.removeClass("overflow-scrolling-touch").addClass("overflow-scrolling-touch"),$=!0,a.length?t.lazy(function(){r.data("cmdMaps")||r.data("cmdMaps",{}),j(a),L(a,f),e.each(a,function(e,t){t.volumeid&&t.uiCmdMap&&Object.keys(t.uiCmdMap).length&&!r.data("cmdMaps")[t.volumeid]&&(r.data("cmdMaps")[t.volumeid]=t.uiCmdMap)}),q(!1,a,i.init),$=!1}):(q(!1,a,i.init),$=!1)}).add(function(e){var t=E(e.data.added);t.length&&(j(t),L(t,h))}).change(function(n){var i,a,o,s,l,c,h,m,g,v,b=E(n.data.changed),y=b.length,w=y;for(e();w--;)if(i=b[w],(a=e("#"+t.navHash2Id(i.hash))).length){if(v=a.parent(),i.phash){if(s=a.closest("."+d),l=P(i.phash),c=a.parent().next(),h=R(l,i),!l.length)continue;l[0]===s[0]&&c.get(0)===h.get(0)||(h.length?h.before(v):l.append(v))}m=a.hasClass(p),g=a.hasClass(f),o=e(F(i)),a.replaceWith(o.children(u)),!r&&_(null,v),i.dirs&&(m||g)&&(a=e("#"+t.navHash2Id(i.hash)))&&a.next("."+d).children().length&&(m&&a.addClass(p),g&&a.addClass(f))}t.cwd().hash&&q(!0)}).remove(function(n){for(var i,a,r=n.data.removed,o=r.length;o--;)(i=e("#"+t.navHash2Id(r[o]))).length&&(a=i.closest("."+d),i.parent().detach(),a.children().length||a.hide().prev(u).removeClass(h+" "+p+" "+f))}).bind("lockfiles unlockfiles",function(n){var i="lockfiles"==n.type,a=n.data.helper?n.data.helper.data("locked"):!1,r=i&&!a?"disable":"enable",o=e.map(n.data.files||[],function(e){var n=t.file(e);return n&&"directory"==n.mime?e:null});e.each(o,function(n,o){var s=e("#"+t.navHash2Id(o));s.length&&!a&&(s.hasClass(w)&&s.draggable(r),s.hasClass(k)&&s.droppable(r),s[i?"addClass":"removeClass"](y))})}).bind("sortchange",function(){if(t.sortAlsoTreeview||V!==t.sortAlsoTreeview){var e=E(t.files());V=t.sortAlsoTreeview,W.empty(),j(e),q()}})}),this},e.fn.elfinderuploadbutton=function(t){return this.each(function(){var n=e(this).elfinderbutton(t).off("click"),i=e("<form/>").appendTo(n),a=e('<input type="file" multiple="true" title="'+t.fm.i18n("selectForUpload")+'"/>').change(function(){var n=e(this);n.val()&&(t.exec({input:n.remove()[0]}),a.clone(!0).appendTo(i))}).on("dragover",function(e){e.originalEvent.dataTransfer.dropEffect="copy"});i.append(a.clone(!0)),t.change(function(){i[t.disabled()?"hide":"show"]()}).change()})},e.fn.elfinderviewbutton=function(t){return this.each(function(){var n=e(this).elfinderbutton(t),i=n.children(".elfinder-button-icon");t.change(function(){var e="icons"==t.value;i.toggleClass("elfinder-button-icon-view-list",e),t.className=e?"view-list":"",t.title=t.fm.i18n(e?"viewlist":"viewicons"),n.attr("title",t.title)})})},e.fn.elfinderworkzone=function(t){var n="elfinder-workzone";return this.not("."+n).each(function(){var i=e(this).addClass(n),a=i.outerHeight(!0)-i.height(),r=Math.round(i.height()),o=i.parent(),s=function(){var s=o.height()-a,l=o.attr("style"),d=Math.round(i.height());o.css("overflow","hidden").children(":visible:not(."+n+")").each(function(){var t=e(this);"absolute"!=t.css("position")&&"fixed"!=t.css("position")&&(s-=t.outerHeight(!0))}),o.attr("style",l||""),s=Math.max(0,Math.round(s)),r===s&&d===s||(r=Math.round(i.height()),i.height(s),t.trigger("wzresize"))};o.add(window).on("resize."+t.namespace,s),t.one("cssloaded",function(){var e=a;a=i.outerHeight(!0)-i.height(),e!==a&&t.trigger("uiresize")}).bind("uiresize",s)}),this},i.prototype.commands.archive=function(){var t,n=this,i=n.fm,a=[];this.variants=[],this.disableOnSearch=!1,i.bind("open reload",function(){n.variants=[],e.each(a=i.option("archivers").create||[],function(e,t){n.variants.push([t,i.mime2kind(t)])}),n.change()}),this.getstate=function(n){var r,n=this.files(n),o=n.length,s=o&&!i.isRoot(n[0])&&(i.file(n[0].phash)||{}).write&&!e.map(n,function(e){return e.read?null:!0}).length;return s&&i.searchStatus.state>1&&(r=i.cwd().volumeid,s=o===e.map(n,function(e){return e.read&&0===e.hash.indexOf(r)?e:null}).length),s&&!this._disabled&&a.length&&(o||t&&"pending"==t.state())?0:-1},this.exec=function(r,o){var s,l,d=this.files(r),c=d.length,u=o||a[0],h=i.file(d[0].phash)||null,p=["errArchive","errPerm","errCreatingTempDir","errFtpDownloadFile","errFtpUploadFile","errFtpMkdir","errArchiveExec","errExtractExec","errRm"];if(t=e.Deferred().fail(function(e){e&&i.error(e)}),!c||!a.length||-1===e.inArray(u,a))return t.reject();if(!h.write)return t.reject(p);for(s=0;c>s;s++)if(!d[s].read)return t.reject(p);return n.mime=u,n.prefix=(c>1?"Archive":d[0].name)+(i.option("archivers").createext?"."+i.option("archivers").createext[u]:""),n.data={targets:n.hashes(r),type:u},i.cwd().hash!==h.hash?l=i.exec("open",h.hash).done(function(){i.one("cwdrender",function(){i.selectfiles({files:r}),t=e.proxy(i.res("mixin","make"),n)()})}):(i.selectfiles({files:r}),t=e.proxy(i.res("mixin","make"),n)()),t}},(i.prototype.commands.back=function(){this.alwaysEnabled=!0,this.updateOnSelect=!1,this.shortcuts=[{pattern:"ctrl+left backspace"}],this.getstate=function(){return this.fm.history.canBack()?0:-1},this.exec=function(){return this.fm.history.back()}}).prototype={forceLoad:!0},i.prototype.commands.chmod=function(){this.updateOnSelect=!1;var t=this.fm,n={0:"owner",1:"group",2:"other"},i={read:t.i18n("read"),write:t.i18n("write"),execute:t.i18n("execute"),perm:t.i18n("perm"),kind:t.i18n("kind"),files:t.i18n("files")},a=function(e){return!isNaN(parseInt(e,8)&&parseInt(e,8)<=511)||e.match(/^([r-][w-][x-]){3}$/i)};this.tpl={main:'<div class="ui-helper-clearfix elfinder-info-title"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}</div>{dataTable}',itemTitle:'<strong>{name}</strong><span id="elfinder-info-kind">{kind}</span>',groupTitle:"<strong>{items}: {num}</strong>",dataTable:'<table id="{id}-table-perm"><tr><td>{0}</td><td>{1}</td><td>{2}</td></tr></table><div class="">'+i.perm+': <input id="{id}-perm" type="text" size="4" maxlength="3" value="{value}"></div>',fieldset:'<fieldset id="{id}-fieldset-{level}"><legend>{f_title}{name}</legend><input type="checkbox" value="4" id="{id}-read-{level}-perm"{checked-r}> <label for="{id}-read-{level}-perm">'+i.read+'</label><br><input type="checkbox" value="6" id="{id}-write-{level}-perm"{checked-w}> <label for="{id}-write-{level}-perm">'+i.write+'</label><br><input type="checkbox" value="5" id="{id}-execute-{level}-perm"{checked-x}> <label for="{id}-execute-{level}-perm">'+i.execute+"</label><br>"},this.shortcuts=[{}],this.getstate=function(e){var t=this.fm;return e=e||t.selected(),0==e.length&&(e=[t.cwd().hash]),!this._disabled&&this.checkstate(this.files(e))?0:-1},this.checkstate=function(t){var n=t.length;if(!n)return!1;var i=e.map(t,function(e){return e.isowner&&e.perm&&a(e.perm)&&(1==n||"directory"!=e.mime)?e:null}).length;return n==i},this.exec=function(t){var r=this.files(t);r.length||(t=[this.fm.cwd().hash],r=this.files(t));var o,s,l=this.fm,d=e.Deferred().always(function(){l.enable()}),c=this.tpl,t=this.hashes(t),u=r.length,h=r[0],p=l.namespace+"-perm-"+h.hash,f=c.main,m=' checked="checked"',g=function(){var e={};return e[l.i18n("btnApply")]=v,e[l.i18n("btnCancel")]=function(){z.elfinderdialog("close")},e},v=function(){var n=e.trim(e("#"+p+"-perm").val());return a(n)?(z.elfinderdialog("close"),void l.request({data:{cmd:"chmod",targets:t,mode:n},notify:{type:"chmod",cnt:u}}).fail(function(e){d.reject(e)}).done(function(e){d.resolve(e)})):!1},b=function(){for(var t,i="",a=0;3>a;a++)t=0,e("#"+p+"-read-"+n[a]+"-perm").is(":checked")&&(t=4|t),e("#"+p+"-write-"+n[a]+"-perm").is(":checked")&&(t=2|t),e("#"+p+"-execute-"+n[a]+"-perm").is(":checked")&&(t=1|t),i+=t.toString(8);e("#"+p+"-perm").val(i)},y=function(t){for(var i,a=0;3>a;a++)i=parseInt(t.slice(a,a+1),8),e("#"+p+"-read-"+n[a]+"-perm").prop("checked",!1),e("#"+p+"-write-"+n[a]+"-perm").prop("checked",!1),e("#"+p+"-execute-"+n[a]+"-perm").prop("checked",!1),4==(4&i)&&e("#"+p+"-read-"+n[a]+"-perm").prop("checked",!0),2==(2&i)&&e("#"+p+"-write-"+n[a]+"-perm").prop("checked",!0),1==(1&i)&&e("#"+p+"-execute-"+n[a]+"-perm").prop("checked",!0);b()},w=function(e){for(var t,n,i,a="777",r="",o=e.length,s=0;o>s;s++){t=C(e[s].perm),r="";for(var l=0;3>l;l++)n=parseInt(t.slice(l,l+1),8),i=parseInt(a.slice(l,l+1),8),
4!=(4&n)&&4==(4&i)&&(i-=4),2!=(2&n)&&2==(2&i)&&(i-=2),1!=(1&n)&&1==(1&i)&&(i-=1),r+=i.toString(8);a=r}return a},k=function(e){return e?":"+e:""},x=function(e,t){for(var a,r,o="",s=c.dataTable,d=0;3>d;d++)a=parseInt(e.slice(d,d+1),8),o+=a.toString(8),r=c.fieldset.replace("{f_title}",l.i18n(n[d])).replace("{name}",k(t[n[d]])).replace(/\{level\}/g,n[d]),s=s.replace("{"+d+"}",r).replace("{checked-r}",4==(4&a)?m:"").replace("{checked-w}",2==(2&a)?m:"").replace("{checked-x}",1==(1&a)?m:"");return s=s.replace("{value}",o).replace("{valueCaption}",i.perm)},C=function(e){if(isNaN(parseInt(e,8))){for(var t=e.split(""),n=[],i=0,a=t.length;a>i;i++)0===i||3===i||6===i?t[i].match(/[r]/i)?n.push(1):t[i].match(/[-]/)&&n.push(0):1===i||4===i||7===i?t[i].match(/[w]/i)?n.push(1):t[i].match(/[-]/)&&n.push(0):t[i].match(/[x]/i)?n.push(1):t[i].match(/[-]/)&&n.push(0);n.splice(3,0,","),n.splice(7,0,",");for(var r=n.join(""),o=r.split(","),s=[],l=0,d=o.length;d>l;l++){var c=parseInt(o[l],2).toString(8);s.push(c)}e=s.join("")}else e=parseInt(e,8).toString(8);return e},T={title:this.title,width:"auto",buttons:g(),close:function(){e(this).elfinderdialog("destroy")}},z=l.getUI().find("#"+p),A="";return z.length?(z.elfinderdialog("toTop"),e.Deferred().resolve()):(f=f.replace("{class}",u>1?"elfinder-cwd-icon-group":l.mime2class(h.mime)),u>1?o=c.groupTitle.replace("{items}",l.i18n("items")).replace("{num}",u):(o=c.itemTitle.replace("{name}",h.name).replace("{kind}",l.mime2kind(h)),A=l.tmb(h)),s=x(w(r),1==r.length?r[0]:{}),f=f.replace("{title}",o).replace("{dataTable}",s).replace(/{id}/g,p),z=l.dialog(f,T),z.attr("id",p),A&&e("<img/>").on("load",function(){z.find(".elfinder-cwd-icon").addClass(A.className).css("background-image","url('"+A.url+"')")}).attr("src",A.url),e("#"+p+"-table-perm :checkbox").on("click",function(){b("perm")}),e("#"+p+"-perm").on("keydown",function(t){var n=t.keyCode;return t.stopPropagation(),n==e.ui.keyCode.ENTER?void v():void 0}).on("focus",function(t){e(this).select()}).on("keyup",function(t){3==e(this).val().length&&(e(this).select(),y(e(this).val()))}),d)}},i.prototype.commands.colwidth=function(){this.alwaysEnabled=!0,this.updateOnSelect=!1,this.getstate=function(){return"fixed"===this.fm.getUI("cwd").find("table").css("table-layout")?0:-1},this.exec=function(){this.fm.getUI("cwd").trigger("colwidth")}},i.prototype.commands.copy=function(){this.shortcuts=[{pattern:"ctrl+c ctrl+insert"}],this.getstate=function(t){var t=this.files(t),n=t.length;return!this._disabled&&n&&e.map(t,function(e){return e.read?e:null}).length==n?0:-1},this.exec=function(t){var n=this.fm,i=e.Deferred().fail(function(e){n.error(e)});return e.each(this.files(t),function(e,t){return t.read?void 0:!i.reject(["errCopy",t.name,"errPerm"])}),"rejected"==i.state()?i:i.resolve(n.clipboard(this.hashes(t)))}},i.prototype.commands.cut=function(){var t=this.fm;this.shortcuts=[{pattern:"ctrl+x shift+insert"}],this.getstate=function(n){var n=this.files(n),i=n.length;return!this._disabled&&i&&e.map(n,function(e){return!e.read||e.locked||t.isRoot(e)?null:e}).length==i?0:-1},this.exec=function(n){var i=e.Deferred().fail(function(e){t.error(e)});return e.each(this.files(n),function(e,n){return!n.read||n.locked||t.isRoot(n)?!i.reject(["errCopy",n.name,"errPerm"]):n.locked?!i.reject(["errLocked",n.name]):void 0}),"rejected"==i.state()?i:i.resolve(t.clipboard(this.hashes(n),!0))}},i.prototype.commands.zipdl=function(){},i.prototype.commands.download=function(){var t=this,n=this.fm,i=!1,a=!1,r=function(r,o){var s,l,d=n.api>2?n.getCommand("zipdl"):null;if(null!==d&&(n.searchStatus.state>1?a=n.searchStatus.mixed:n.leafRoots[n.cwd().hash]&&(s=n.cwd().volumeid,e.each(r,function(e,t){return 0!==t.indexOf(s)?(a=!0,!1):void 0})),i=n.isCommandEnabled("zipdl",r[0])),a){if(l=d?"zipdl":"download",r=e.map(r,function(t){var i=n.file(t),a=i&&(d||"directory"!==i.mime)&&n.isCommandEnabled(l,t)?t:null;return i&&o&&!a&&e("#"+n.cwdHash2Id(i.hash)).trigger("unselect"),a}),!r.length)return[]}else if(!n.isCommandEnabled("download",r[0]))return[];return e.map(t.files(r),function(t){var a=!t.read||!i&&"directory"==t.mime?null:t;return o&&!a&&e("#"+n.cwdHash2Id(t.hash)).trigger("unselect"),a})};this.linkedCmds=["zipdl"],this.shortcuts=[{pattern:"shift+enter"}],this.getstate=function(e){var e=this.hashes(e),t=e.length,a=this.options.maxRequests||10;n.api>2?n.getCommand("zipdl"):null;return 1>t?-1:(t=r(e).length,t&&(i||a>=t&&(!n.UA.IE&&!n.UA.Mobile||1==t))?0:-1)},n.bind("contextmenu",function(n){var i,a,r=t.fm,o=null,s=function(t){var n=t.url||r.url(t.hash);return{icon:"link",node:e("<a/>").attr({href:n,target:"_blank",title:r.i18n("link")}).text(t.name).on("mousedown click touchstart touchmove touchend contextmenu",function(e){e.stopPropagation()}).on("dragstart",function(n){var i=n.dataTransfer||n.originalEvent.dataTransfer||null;if(o=null,i){var a=function(t){var n,i=t.mime,a=r.tmb(t);return n='<div class="elfinder-cwd-icon '+r.mime2class(i)+' ui-corner-all"/>',a&&(n=e(n).addClass(a.className).css("background-image","url('"+a.url+"')").get(0).outerHTML),n};i.effectAllowed="copyLink",i.setDragImage&&(o=e('<div class="elfinder-drag-helper html5-native">').append(a(t)).appendTo(e(document.body)),i.setDragImage(o.get(0),50,47)),r.UA.IE||(i.setData("elfinderfrom",window.location.href+t.phash),i.setData("elfinderfrom:"+i.getData("elfinderfrom"),""))}}).on("dragend",function(e){o&&o.remove()})}};if(t.extra=null,n.data&&(i=n.data.targets||[],1===i.length&&(a=r.file(i[0]))&&"directory"!==a.mime))if("1"!=a.url)t.extra=s(a);else{var l;t.extra={icon:"link",node:e("<a/>").attr({href:"#",title:r.i18n("getLink"),draggable:"false"}).text(a.name).on("click touchstart",function(e){if(!("touchstart"===e.type&&e.originalEvent.touches.length>1)){var t=l.parent();e.stopPropagation(),e.preventDefault(),t.removeClass("ui-state-disabled").addClass("elfinder-button-icon-spinner"),r.request({data:{cmd:"url",target:a.hash},preventDefault:!0}).always(function(e){if(t.removeClass("elfinder-button-icon-spinner"),e.url){var n=r.file(a.hash);n.url=e.url,l.replaceWith(s(a).node)}else t.addClass("ui-state-disabled")})}})},l=t.extra.node,l.ready(function(){setTimeout(function(){l.parent().addClass("ui-state-disabled").css("pointer-events","auto")},10)})}}),this.exec=function(t){var n,o,s,l,t=this.hashes(t),d=this.fm,c=(d.options.url,r(t,!0)),u=e.Deferred(),h="",p={},f=!1,m=function(t){return function(){var n=e.Deferred(),i=d.file(d.root(t[0])),a=i?" ("+(i.i18||i.name)+")":"";return d.request({data:{cmd:"zipdl",targets:t},notify:{type:"zipdl",cnt:1,hideCnt:!0,msg:d.i18n("ntfzipdl")+a},cancel:!0,preventDefault:!0}).done(function(i){var a,r,s,c,u,h={},p="dlw"+ +new Date;i.error?(d.error(i.error),n.resolve()):i.zipdl&&(a=i.zipdl,f||!l&&d.UA.Mobile?(o=d.options.url+(-1===d.options.url.indexOf("?")?"?":"&")+"cmd=zipdl&download=1",e.each([t[0],a.file,a.name,a.mime],function(e,t){o+="&targets%5B%5D="+encodeURIComponent(t)}),e.each(d.options.customData,function(e,t){o+="&"+encodeURIComponent(e)+"="+encodeURIComponent(t)}),o+="&"+encodeURIComponent(a.name),s=e("<a/>").attr("href",o).attr("download",encodeURIComponent(a.name)).attr("target","_blank").on("click",function(){n.resolve(),r.elfinderdialog("destroy")}).append('<span class="elfinder-button-icon elfinder-button-icon-download"></span>'+d.escape(a.name)),h[d.i18n("btnCancel")]=function(){r.elfinderdialog("destroy")},r=d.dialog(s,{title:d.i18n("link"),buttons:h,width:"200px",destroyOnClose:!0,close:function(){"resolved"!==n.state()&&n.resolve()}})):(c=e('<form action="'+d.options.url+'" method="post" target="'+p+'" style="display:none"/>').append('<input type="hidden" name="cmd" value="zipdl"/>').append('<input type="hidden" name="download" value="1"/>'),e.each([t[0],a.file,a.name,a.mime],function(e,t){c.append('<input type="hidden" name="targets[]" value="'+d.escape(t)+'"/>')}),e.each(d.options.customData,function(e,t){c.append('<input type="hidden" name="'+e+'" value="'+d.escape(t)+'"/>')}),c.attr("target",p).appendTo("body"),u=e('<iframe style="display:none" name="'+p+'">').appendTo("body").ready(function(){c.submit().remove(),n.resolve(),setTimeout(function(){u.remove()},d.UA.Firefox?2e4:1e3)})))}).fail(function(e){e&&d.error(e),n.resolve()}),n.promise()}};if(!c.length)return u.reject();if(s=e("<a>").hide().appendTo(e("body")),l="string"==typeof s.get(0).download,i&&(c.length>1||"directory"===c[0].mime))return s.remove(),a?(f=d.UA.Mobile,p={},e.each(c,function(e,t){var n=t.hash.split("_",2);p[n[0]]?p[n[0]].push(t.hash):p[n[0]]=[t.hash]})):p=[e.map(c,function(e){return e.hash})],u=d.sequence(e.map(p,function(e){return m(e)})).always(function(){d.trigger("download",{files:c})});for(n=0;n<c.length;n++)o=d.openUrl(c[n].hash,!0),l?s.attr("href",o).attr("download",encodeURIComponent(c[n].name)).attr("target","_blank").get(0).click():d.UA.Mobile?setTimeout(function(){window.open(o)||d.error("errPopup")},100):h+='<iframe class="downloader" id="downloader-'+c[n].hash+'" style="display:none" src="'+o+'"/>';return s.remove(),e(h).appendTo("body").ready(function(){setTimeout(function(){e(h).each(function(){e("#"+e(this).attr("id")).remove()})},d.UA.Firefox?2e4+1e4*n:1e3)}),d.trigger("download",{files:c}),u.resolve()}},i.prototype.commands.duplicate=function(){var t=this.fm;this.getstate=function(n){var n=this.files(n),i=n.length;return!this._disabled&&i&&t.cwd().write&&e.map(n,function(e){return e.read&&e.phash===t.cwd().hash&&!t.isRoot(e)?e:null}).length==i?0:-1},this.exec=function(t){var n=this.fm,i=this.files(t),a=i.length,r=e.Deferred().fail(function(e){e&&n.error(e)});return a?(e.each(i,function(e,t){return t.read&&n.file(t.phash).write?void 0:!r.reject(["errCopy",t.name,"errPerm"])}),"rejected"==r.state()?r:n.request({data:{cmd:"duplicate",targets:this.hashes(t)},notify:{type:"copy",cnt:a}}).done(function(t){var i;t&&t.added&&t.added[0]&&n.one("duplicatedone",function(){i=n.findCwdNodes(t.added),i.length?i.trigger("scrolltoview"):(n.trigger("selectfiles",{files:e.map(t.added,function(e){return e.hash})}),n.toast({msg:n.i18n(["complete",n.i18n("cmdduplicate")])}))})})):r.reject()}},i.prototype.commands.edit=function(){var t=this,n=this.fm,i=n.res("mimes","text")||[],a=function(e){return e.replace(/\s+$/,"")},r=function(i){var a,r=e('<select class="ui-corner-all"/>');return i&&e.each(i,function(e,t){a=n.escape(t.value),r.append('<option value="'+a+'">'+(t.caption?n.escape(t.caption):a)+"</option>")}),e.each(t.options.encodings,function(e,t){r.append('<option value="'+t+'">'+t+"</option>")}),r},o=function(n){return e.map(n,function(n){return 0!==n.mime.indexOf("text/")&&-1===e.inArray(n.mime,i)||!n.mime.indexOf("text/rtf")||t.onlyMimes.length&&-1===e.inArray(n.mime,t.onlyMimes)||!n.read||!n.write?null:n})},s=function(o,s,d,c){var u,h=e.Deferred(),p=function(){u&&(y()?u.attr("title",n.i18n("saveAsEncoding")).addClass("elfinder-edit-changed"):u.attr("title",n.i18n("openAsEncoding")).removeClass("elfinder-edit-changed"))},f=e('<textarea class="elfinder-file-edit '+n.res("class","editing")+'" rows="20" id="'+o+'-ta">'+n.escape(d)+"</textarea>").on("input propertychange",p),m=f.val(),g=function(){f.editor&&f.editor.save(f[0],f.editor.instance),m=f.val(),h.notifyWith(f,[u?u.val():void 0])},v=function(){f.elfinderdialog("close")},b=function(){g(),v()},y=function(){return f.editor&&f.editor.save(f[0],f.editor.instance),a(m)!==a(f.val())},w={title:n.escape(s.name),width:t.options.dialogWidth||450,buttons:{},allowMaximize:!0,btnHoverFocus:!1,closeOnEscape:!1,close:function(){var i=function(){h.reject(),f.editor&&f.editor.close(f[0],f.editor.instance),f.elfinderdialog("destroy")};n.toggleMaximize(e(this).closest(".ui-dialog"),!1),y()?n.confirm({title:t.title,text:"confirmNotSave",accept:{label:"btnSaveClose",callback:function(){g(),i()}},cancel:{label:"btnClose",callback:i}}):i()},open:function(){var t,i=c&&"unknown"!==c?[{value:c}]:[];""!==d&&c&&"UTF-8"===c||i.push({value:"UTF-8"}),u=r(i).on("touchstart",function(e){e.stopPropagation()}).on("change",function(){y()||""===a(f.val())||(v(),l(s,e(this).val()))}).on("mouseover",p),f.parent().prev().find(".elfinder-titlebar-button:last").after(e('<span class="elfinder-titlebar-button-right"/>').append(u)),n.disable(),f.focus(),f[0].setSelectionRange&&f[0].setSelectionRange(0,0),f.editor&&(t=f.editor.load(f[0])||null,t&&t.done?t.done(function(e){f.editor.instance=e,f.editor.focus(f[0],f.editor.instance)}):(f.editor.instance=t,f.editor.focus(f[0],f.editor.instance)))},resize:function(e,t){f.editor&&f.editor.resize(f[0],f.editor.instance,e,t||{})}},k=function(t,n){if(n=n||i.concat("text/"),-1!==e.inArray(t,n))return!0;var a,r;for(r=n.length,a=0;r>a;a++)if(0===t.indexOf(n[a]))return!0;return!1},x=function(e,t){if(!t||!t.length)return!0;var n,i,a=e.replace(/^.+\.([^.]+)|(.+)$/,"$1$2").toLowerCase();for(i=t.length,n=0;i>n;n++)if(a===t[n].toLowerCase())return!0;return!1};return f.getContent=function(){return f.val()},e.each(t.options.editors||[],function(e,t){return k(s.mime,t.mimes||null)&&x(s.name,t.exts||null)&&"function"==typeof t.load&&"function"==typeof t.save?(f.editor={load:t.load,save:t.save,close:"function"==typeof t.close?t.close:function(){},focus:"function"==typeof t.focus?t.focus:function(){},resize:"function"==typeof t.resize?t.resize:function(){},instance:null,doSave:g,doCancel:v,doClose:b,file:s,fm:n},!1):void 0}),f.editor||f.keydown(function(t){var n,i,a=t.keyCode;t.stopPropagation(),a==e.ui.keyCode.TAB&&(t.preventDefault(),this.setSelectionRange&&(n=this.value,i=this.selectionStart,this.value=n.substr(0,i)+"	"+n.substr(this.selectionEnd),i+=1,this.setSelectionRange(i,i))),(t.ctrlKey||t.metaKey)&&(a!="Q".charCodeAt(0)&&a!="W".charCodeAt(0)||(t.preventDefault(),v()),a=="S".charCodeAt(0)&&(t.preventDefault(),g()))}).on("mouseenter",function(){this.focus()}),w.buttons[n.i18n("btnSave")]=g,w.buttons[n.i18n("btnSaveClose")]=b,w.buttons[n.i18n("btnCancel")]=v,n.dialog(f,w).attr("id",o).on("keydown keyup keypress",function(e){e.stopPropagation()}),h.promise()},l=function(i,a){var o,d=i.hash,c=(n.options,e.Deferred()),u="edit-"+n.namespace+"-"+i.hash,h=n.getUI().find("#"+u),a=a?a:0;return h.length?(h.elfinderdialog("toTop"),c.resolve()):i.read&&i.write?(n.request({data:{cmd:"get",target:d,conv:a},notify:{type:"file",cnt:1}}).done(function(a){var o;a.doconv?n.confirm({title:t.title,text:"unknown"===a.doconv?"confirmNonUTF8":"confirmConvUTF8",accept:{label:"btnConv",callback:function(){c=l(i,o.val())}},cancel:{label:"btnCancel",callback:function(){c.reject()}},optionsCallback:function(t){t.create=function(){var t=e('<div class="elfinder-dialog-confirm-encoding"/>'),i={value:a.doconv};"unknown"===a.doconv&&(i.caption="-"),o=r([i]),e(this).next().find(".ui-dialog-buttonset").prepend(t.append(e("<label>"+n.i18n("encoding")+" </label>").append(o)))}}}):s(u,i,a.content,a.encoding).progress(function(e){var t=this;n.request({options:{type:"post"},data:{cmd:"put",target:d,encoding:e||a.encoding,content:t.getContent()},notify:{type:"save",cnt:1},syncOnFail:!0}).fail(function(e){c.reject(e)}).done(function(e){e.changed&&e.changed.length&&n.change(e),c.resolve(e),setTimeout(function(){t.focus(),t.editor&&t.editor.focus(t[0],t.editor.instance)},50)})})}).fail(function(t){var i=e.isArray(t)?t[0]:t;"errConvUTF8"!==i&&n.sync(),c.reject(t)}),c.promise()):(o=["errOpen",i.name,"errPerm"],n.error(o),c.reject(o))};this.shortcuts=[{pattern:"ctrl+e"}],this.init=function(){this.onlyMimes=this.options.mimes||[]},this.getstate=function(e){var e=this.files(e),t=e.length;return!this._disabled&&t&&o(e).length==t?0:-1},this.exec=function(t){for(var n,i=o(this.files(t)),a=[];n=i.shift();)a.push(l(n));return a.length?e.when.apply(null,a):e.Deferred().reject()}},i.prototype.commands.extract=function(){var t=this,n=t.fm,i=[],a=function(t){return e.map(t,function(t){return t.read&&-1!==e.inArray(t.mime,i)?t:null})};this.variants=[],this.disableOnSearch=!0,n.bind("open reload",function(){i=n.option("archivers").extract||[],n.api>2?t.variants=[["makedir",n.i18n("cmdmkdir")],["intohere",n.i18n("btnCwd")]]:t.variants=[["intohere",n.i18n("btnCwd")]],t.change()}),this.getstate=function(e){var e=this.files(e),t=e.length;return!this._disabled&&t&&this.fm.cwd().write&&a(e).length==t?0:-1},this.exec=function(t,a){var r,o,s,l=this.files(t),d=e.Deferred(),c=l.length,u="makedir"==a?1:0,h=!1,p=!1,f=0,m=e.map(n.files(t),function(e){return e.name}),g={};e.map(n.files(t),function(e){g[e.name]=e});var v=function(e){switch(e){case"overwrite_all":h=!0;break;case"omit_all":p=!0}},b=function(t){t.read&&n.file(t.phash).write?-1===e.inArray(t.mime,i)?(o=["errExtract",t.name,"errNoArchive"],n.error(o),d.reject(o)):n.request({data:{cmd:"extract",target:t.hash,makedir:u},notify:{type:"extract",cnt:1},syncOnFail:!0}).fail(function(e){"rejected"!=d.state()&&d.reject(e)}).done(function(){}):(o=["errExtract",t.name,"errPerm"],n.error(o),d.reject(o))},y=function(t,i){var a=t[i],o=a.name.replace(/\.((tar\.(gz|bz|bz2|z|lzo))|cpio\.gz|ps\.gz|xcf\.(gz|bz2)|[a-z0-9]{1,4})$/gi,""),l=e.inArray(o,m)>=0,w=function(){c>i+1?y(t,i+1):d.resolve()};!u&&l&&"directory"!=g[o].mime?n.confirm({title:n.i18n("ntfextract"),text:["errExists",o,"confirmRepl"],accept:{label:"btnYes",callback:function(e){if(s=e?"overwrite_all":"overwrite",v(s),h||p){if(h){for(r=i;c>r;r++)b(t[r]);d.resolve()}}else"overwrite"==s&&b(a),c>i+1?y(t,i+1):d.resolve()}},reject:{label:"btnNo",callback:function(e){s=e?"omit_all":"omit",v(s),!h&&!p&&c>i+1?y(t,i+1):p&&d.resolve()}},cancel:{label:"btnCancel",callback:function(){d.resolve()}},all:c>i+1}):u?(b(a),w()):0==f?n.confirm({title:n.i18n("cmdextract"),text:[n.i18n("cmdextract")+' "'+a.name+'"',"confirmRepl"],accept:{label:"btnYes",callback:function(e){e&&(f=1),b(a),w()}},reject:{label:"btnNo",callback:function(e){e&&(f=-1),w()}},cancel:{label:"btnCancel",callback:function(){d.resolve()}},all:c>i+1}):(f>0&&b(a),w())};return this.enabled()&&c&&i.length?(c>0&&y(l,0),d):d.reject()}},(i.prototype.commands.forward=function(){this.alwaysEnabled=!0,this.updateOnSelect=!0,this.shortcuts=[{pattern:"ctrl+right"}],this.getstate=function(){return this.fm.history.canForward()?0:-1},this.exec=function(){return this.fm.history.forward()}}).prototype={forceLoad:!0},i.prototype.commands.fullscreen=function(){var e=this,t=this.fm,n=function(t,n){n&&n.fullscreen&&e.update(void 0,"on"===n.fullscreen)};this.alwaysEnabled=!0,this.updateOnSelect=!1,this.value=!1,this.options={ui:"fullscreenbutton"},this.getstate=function(){return 0},this.exec=function(){var n=t.getUI().get(0),i=t.toggleFullscreen(n);e.update(void 0,i===n)},t.bind("init",function(){t.getUI().off("resize."+t.namespace,n).on("resize."+t.namespace,n)})},(i.prototype.commands.getfile=function(){var t=this,n=this.fm,i=function(n){var i=t.options;return n=e.map(n,function(e){return("directory"!=e.mime||i.folders)&&e.read?e:null}),i.multiple||1==n.length?n:[]};this.alwaysEnabled=!0,this.callback=n.options.getFileCallback,this._disabled="function"==typeof this.callback,this.getstate=function(e){var e=this.files(e),t=e.length;return this.callback&&t&&i(e).length==t?0:-1},this.exec=function(n){var i,a,r,o=this.fm,s=this.options,l=this.files(n),d=l.length,c=o.option("url"),u=o.option("tmbUrl"),h=e.Deferred().done(function(e){var n,i=function(){"close"==s.oncomplete?o.hide():"destroy"==s.oncomplete&&o.destroy()};o.trigger("getfile",{files:e}),n=t.callback(e,o),"object"==typeof n&&"function"==typeof n.done?n.done(i).fail(function(e){e&&o.error(e)}):i()}),p=function(t){return s.onlyURL?s.multiple?e.map(l,function(e){return e.url}):l[0].url:s.multiple?l:l[0]},f=[];for(i=0;d>i;i++){if(a=l[i],"directory"==a.mime&&!s.folders)return h.reject();a.baseUrl=c,"1"==a.url?f.push(o.request({data:{cmd:"url",target:a.hash},notify:{type:"url",cnt:1,hideCnt:!0},preventDefault:!0}).done(function(e){if(e.url){var t=o.file(this.hash);t.url=this.url=e.url}}.bind(a))):a.url=o.url(a.hash),s.onlyURL||(s.getPath&&(a.path=o.path(a.hash),""===a.path&&a.phash&&!function(){var t=e.Deferred();f.push(t),o.path(a.hash,!1,{}).done(function(e){a.path=e}).fail(function(){a.path=""}).always(function(){t.resolve()})}()),a.tmb&&1!=a.tmb&&(a.tmb=u+a.tmb),a.width||a.height||(a.dim?(r=a.dim.split("x"),a.width=r[0],a.height=r[1]):s.getImgSize&&-1!==a.mime.indexOf("image")&&f.push(o.request({data:{cmd:"dim",target:a.hash},notify:{type:"dim",cnt:1,hideCnt:!0},preventDefault:!0}).done(function(e){if(e.dim){var t=e.dim.split("x"),n=o.file(this.hash);n.width=this.width=t[0],n.height=this.height=t[1]}}.bind(a)))))}return f.length?(e.when.apply(null,f).always(function(){h.resolve(p(l))}),h):h.resolve(p(l))}}).prototype={forceLoad:!0},(i.prototype.commands.help=function(){var t,n,i=this.fm,a=this,r='<div class="elfinder-help-link"> <a href="{url}" target="_blank">{link}</a></div>',o='<div class="elfinder-help-team"><div>{author}</div>{work}</div>',s=/\{url\}/,l=/\{link\}/,d=/\{author\}/,c=/\{work\}/,u="replace",h="ui-priority-primary",p="ui-priority-secondary",f="elfinder-help-license",m='<li class="ui-state-default ui-corner-top elfinder-help-tab-{id}"><a href="#'+i.namespace+'-help-{id}">{title}</a></li>',g=['<div class="ui-tabs ui-widget ui-widget-content ui-corner-all elfinder-help">','<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'],v='<div class="elfinder-help-shortcut"><div class="elfinder-help-shortcut-pattern">{pattern}</div> {descrip}</div>',b='<div class="elfinder-help-separator"/>',y=function(){g.push('<div id="'+i.namespace+'-help-about" class="ui-tabs-panel ui-widget-content ui-corner-bottom"><div class="elfinder-help-logo"/>'),g.push("<h3>elFinder</h3>"),g.push('<div class="'+h+'">'+i.i18n("webfm")+"</div>"),g.push('<div class="'+p+'">'+i.i18n("ver")+": "+i.version+", "+i.i18n("protocolver")+': <span class="apiver"></span></div>'),g.push('<div class="'+p+'">jQuery/jQuery UI: '+e().jquery+"/"+e.ui.version+"</div>"),g.push(b),g.push(r[u](s,"http://elfinder.org/")[u](l,i.i18n("homepage"))),g.push(r[u](s,"https://github.com/Studio-42/elFinder/wiki")[u](l,i.i18n("docs"))),g.push(r[u](s,"https://github.com/Studio-42/elFinder")[u](l,i.i18n("github"))),g.push(r[u](s,"http://twitter.com/elrte_elfinder")[u](l,i.i18n("twitter"))),g.push(b),g.push('<div class="'+h+'">'+i.i18n("team")+"</div>"),g.push(o[u](d,'Dmitry "dio" Levashov &lt;dio@std42.ru&gt;')[u](c,i.i18n("chiefdev"))),g.push(o[u](d,"Troex Nevelin &lt;troex@fury.scancode.ru&gt;")[u](c,i.i18n("maintainer"))),g.push(o[u](d,"Alexey Sukhotin &lt;strogg@yandex.ru&gt;")[u](c,i.i18n("contributor"))),g.push(o[u](d,"Naoki Sawada &lt;hypweb@gmail.com&gt;")[u](c,i.i18n("contributor"))),i.i18[i.lang].translator&&e.each(i.i18[i.lang].translator.split(", "),function(){g.push(o[u](d,e.trim(this))[u](c,i.i18n("translator")+" ("+i.i18[i.lang].language+")"))}),g.push(b),g.push('<div class="'+f+'">'+i.i18n("icons")+': Pixelmixer, <a href="http://p.yusukekamiyamane.com" target="_blank">Fugue</a></div>'),g.push(b),g.push('<div class="'+f+'">Licence: BSD Licence</div>'),g.push('<div class="'+f+'">Copyright © 2009-2016, Studio 42</div>'),g.push('<div class="'+f+'">„ …'+i.i18n("dontforget")+" ”</div>"),g.push("</div>")},w=function(){var t=i.shortcuts();g.push('<div id="'+i.namespace+'-help-shortcuts" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'),t.length?(g.push('<div class="ui-widget-content elfinder-help-shortcuts">'),e.each(t,function(e,t){g.push(v.replace(/\{pattern\}/,t[0]).replace(/\{descrip\}/,t[1]))}),g.push("</div>")):g.push('<div class="elfinder-help-disabled">'+i.i18n("shortcutsof")+"</div>"),g.push("</div>")},k=function(){g.push('<div id="'+i.namespace+'-help-help" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'),g.push('<a href="https://github.com/Studio-42/elFinder/wiki" target="_blank" class="elfinder-dont-panic"><span>DON\'T PANIC</span></a>'),g.push("</div>")},x=function(){g.push('<div id="'+i.namespace+'-help-debug" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'),g.push('<div class="ui-widget-content elfinder-help-debug"><ul></ul></div>'),g.push("</div>")},C=function(){var r,o,s,l,d=function(t,n){return e.each(n,function(n,i){t.append(e("<dt/>").text(n)),"undefined"==typeof i?t.append(e("<dd/>").append(e("<span/>").text("undfined"))):"object"!=typeof i||i?"object"==typeof i&&(e.isPlainObject(i)||i.length)?t.append(e("<dd/>").append(d(e("<dl/>"),i))):t.append(e("<dd/>").append(e("<span/>").text(i&&"object"==typeof i?"[]":i?i:'""'))):t.append(e("<dd/>").append(e("<span/>").text("null")))}),t},c=n.children("li").length;(a.debug.options||a.debug.debug)&&(c>=5&&(n.children("li:last").remove(),t.children("div:last").remove()),s=i.namespace+"-help-debug-"+ +new Date,r=e("<li/>").html('<a href="#'+s+'">'+a.debug.debug.cmd+"</a>").prependTo(n),o=e('<div id="'+s+'"/>'),a.debug.debug&&(l=e("<fieldset>").append(e("<legend/>").text("debug"),d(e("<dl/>"),a.debug.debug)),o.append(l)),a.debug.options&&(l=e("<fieldset>").append(e("<legend/>").text("options"),d(e("<dl/>"),a.debug.options)),o.append(l)),n.after(o),t.tabs("refresh"),n.find("a:first").on("click",function(e){e.stopPropagation()}).click())},T="";this.alwaysEnabled=!0,this.updateOnSelect=!1,this.state=-1,this.shortcuts=[{pattern:"f1",description:this.title}],i.one("load",function(){var r,o=a.options.view||["about","shortcuts","help","debug"];e.each(o,function(e,t){g.push(m[u](/\{id\}/g,t)[u](/\{title\}/,i.i18n(t)))}),g.push("</ul>"),-1!==e.inArray("about",o)&&y(),-1!==e.inArray("shortcuts",o)&&w(),-1!==e.inArray("help",o)&&k(),-1!==e.inArray("debug",o)&&x(),g.push("</div>"),T=e(g.join("")),T.find(".ui-tabs-nav li").hover(function(){e(this).toggleClass("ui-state-hover")}).children().click(function(t){var n=e(this);t.preventDefault(),t.stopPropagation(),n.hasClass("ui-tabs-selected")||(n.parent().addClass("ui-tabs-selected ui-state-active").siblings().removeClass("ui-tabs-selected").removeClass("ui-state-active"),T.children(".ui-tabs-panel").hide().filter(n.attr("href")).show())}).filter(":first").click(),r=T.find(".elfinder-help-tab-debug").hide(),t=T.find("#"+i.namespace+"-help-debug").children("div:first").tabs(),n=t.children("ul:first"),a.debug={},i.bind("backenddebug",function(t){t.data&&t.data.debug&&(r.show(),a.debug={options:t.data.options,debug:e.extend({cmd:i.currentReqCmd},t.data.debug)},a.dialog&&C())}),T.find("#"+i.namespace+"-help-about").find(".apiver").text(i.api),a.dialog=i.dialog(T,{title:a.title,width:530,autoOpen:!1,destroyOnClose:!1}),a.state=0}),this.getstate=function(){return 0},this.exec=function(){this.dialog.elfinderdialog("open").find(".ui-tabs-nav li a:first").click()}}).prototype={forceLoad:!0},(i.prototype.commands.home=function(){this.title="Home",this.alwaysEnabled=!0,this.updateOnSelect=!1,this.shortcuts=[{pattern:"ctrl+home ctrl+shift+up",description:"Home"}],this.getstate=function(){var e=this.fm.root(),t=this.fm.cwd().hash;return e&&t&&e!=t?0:-1},this.exec=function(){return this.fm.exec("open",this.fm.root())}}).prototype={forceLoad:!0},(i.prototype.commands.info=function(){var t=this.fm,n="elfinder-info-spinner",i="elfinder-info-button",a={calc:t.i18n("calc"),size:t.i18n("size"),unknown:t.i18n("unknown"),path:t.i18n("path"),aliasfor:t.i18n("aliasfor"),modify:t.i18n("modify"),perms:t.i18n("perms"),locked:t.i18n("locked"),dim:t.i18n("dim"),kind:t.i18n("kind"),files:t.i18n("files"),folders:t.i18n("folders"),roots:t.i18n("volumeRoots"),items:t.i18n("items"),yes:t.i18n("yes"),no:t.i18n("no"),link:t.i18n("link"),owner:t.i18n("owner"),group:t.i18n("group"),perm:t.i18n("perm"),getlink:t.i18n("getLink")};this.tpl={main:'<div class="ui-helper-clearfix elfinder-info-title {dirclass}"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}</div><table class="elfinder-info-tb">{content}</table>',itemTitle:'<strong>{name}</strong><span class="elfinder-info-kind">{kind}</span>',groupTitle:"<strong>{items}: {num}</strong>",row:"<tr><td>{label} : </td><td>{value}</td></tr>",spinner:'<span>{text}</span> <span class="'+n+" "+n+'-{name}"/>'},this.alwaysEnabled=!0,this.updateOnSelect=!1,this.shortcuts=[{pattern:"ctrl+i"}],this.init=function(){e.each(a,function(e,n){a[e]=t.i18n(n)})},this.getstate=function(){return 0},this.exec=function(t){var r=this.files(t);r.length||(r=this.files([this.fm.cwd().hash]));var o,s,l,d,c,u,h,p=this.fm,f=this.options,m=this.tpl,g=m.row,v=r.length,b=[],y=m.main,w="{label}",k="{value}",x=[],C={title:this.title,width:"auto",close:function(){e(this).elfinderdialog("destroy"),e.each(x,function(e,t){var n=t&&t.xhr?t.xhr:null;n&&"pending"==n.state()&&(n.quiet=!0,n.abort())})}},T=[],z=function(e,t){I.find("."+n+"-"+t).parent().html(e)},A=p.namespace+"-info-"+e.map(r,function(e){return e.hash}).join("-"),I=p.getUI().find("#"+A),S=[],U=function(t){var n=function(t){var n=[];return"directory"===t.mime&&e.each(p.leafRoots,function(e,i){var a;if(e===t.hash)n.push.apply(n,i);else for(a=(p.file(e)||{}).phash;a;)a===t.hash&&n.push.apply(n,i),a=(p.file(a)||{}).phash}),n},i=function(t){var n=e.Deferred(),i=p.file(t),a=i?i.phash:t;return a&&!p.file(a)?p.request({data:{cmd:"parents",target:a},preventFail:!0}).done(function(){p.one("parentsdone",function(){n.resolve()})}).fail(function(){n.resolve()}):n.resolve(),n},r=function(){var t=e.Deferred(),n=Object.keys(p.leafRoots).length;return n>0?e.each(p.leafRoots,function(e){i(e).done(function(){--n,1>n&&t.resolve()})}):t.resolve(),t};p.autoSync("stop"),r().done(function(){var i=[],r={},o=[];e.each(t,function(){i.push.apply(i,n(p.file(this)))}),t.push.apply(t,i),e.each(t,function(){var e=p.root(this);r[e]?r[e].push(this):r[e]=[this]}),e.each(r,function(){o.push(p.request({data:{cmd:"size",targets:this},preventDefault:!0}))}),x.push.apply(x,o),e.when.apply(e,o).fail(function(){z(a.unknown,"size")}).done(function(){var e,t=0,n=arguments.length;for(e=0;n>e;e++)t+=parseInt(arguments[e].size);z(t>=0?p.formatSize(t):a.unknown,"size")}),p.autoSync()})};if(!v)return e.Deferred().reject();if(I.length)return I.elfinderdialog("toTop"),e.Deferred().resolve();if(1==v){if(l=r[0],y=y.replace("{dirclass}",l.csscls?p.escape(l.csscls):"").replace("{class}",p.mime2class(l.mime)),d=m.itemTitle.replace("{name}",p.escape(l.i18||l.name)).replace("{kind}",'<span title="'+p.escape(l.mime)+'">'+p.mime2kind(l)+"</span>"),s=p.tmb(l),l.read?"directory"!=l.mime||l.alias?o=p.formatSize(l.size):(o=m.spinner.replace("{text}",a.calc).replace("{name}","size"),T.push(l.hash)):o=a.unknown,b.push(g.replace(w,a.size).replace(k,o)),l.alias&&b.push(g.replace(w,a.aliasfor).replace(k,l.alias)),(h=p.path(l.hash,!0))?b.push(g.replace(w,a.path).replace(k,p.escape(h))):(b.push(g.replace(w,a.path).replace(k,m.spinner.replace("{text}",a.calc).replace("{name}","path"))),x.push(p.path(l.hash,!0,{notify:null}).fail(function(){z(a.unknown,"path")}).done(function(e){z(e,"path")}))),l.read){var M,O=p.escape(l.name);if("1"==l.url)b.push(g.replace(w,a.link).replace(k,'<button class="'+i+" "+n+'-url">'+a.getlink+"</button>"));else{if(f.nullUrlDirLinkSelf&&"directory"==l.mime&&null===l.url){var D=window.location;M=D.pathname+D.search+"#elf_"+l.hash}else M=p.url(l.hash);b.push(g.replace(w,a.link).replace(k,'<a href="'+M+'" target="_blank">'+O+"</a>"))}}l.dim?b.push(g.replace(w,a.dim).replace(k,l.dim)):-1!==l.mime.indexOf("image")&&(l.width&&l.height?b.push(g.replace(w,a.dim).replace(k,l.width+"x"+l.height)):(b.push(g.replace(w,a.dim).replace(k,m.spinner.replace("{text}",a.calc).replace("{name}","dim"))),x.push(p.request({data:{cmd:"dim",target:l.hash},preventDefault:!0}).fail(function(){z(a.unknown,"dim")}).done(function(e){if(z(e.dim||a.unknown,"dim"),e.dim){var t=e.dim.split("x"),n=p.file(l.hash);n.width=t[0],n.height=t[1]}})))),b.push(g.replace(w,a.modify).replace(k,p.formatDate(l))),b.push(g.replace(w,a.perms).replace(k,p.formatPermissions(l))),b.push(g.replace(w,a.locked).replace(k,l.locked?a.yes:a.no)),l.owner&&b.push(g.replace(w,a.owner).replace(k,l.owner)),l.group&&b.push(g.replace(w,a.group).replace(k,l.group)),l.perm&&b.push(g.replace(w,a.perm).replace(k,p.formatFileMode(l.perm))),f.custom&&e.each(f.custom,function(t,n){
n.mimes&&!e.map(n.mimes,function(e){return l.mime===e||0===l.mime.indexOf(e+"/")?!0:null}).length||n.hashRegex&&!l.hash.match(n.hashRegex)||(b.push(g.replace(w,p.i18n(n.label)).replace(k,n.tpl.replace("{id}",A))),n.action&&"function"==typeof n.action&&S.push(n.action))})}else y=y.replace("{class}","elfinder-cwd-icon-group"),d=m.groupTitle.replace("{items}",a.items).replace("{num}",v),c=e.map(r,function(e){return"directory"==e.mime?1:null}).length,c?(u=e.map(r,function(e){return"directory"!==e.mime||e.phash&&!e.isroot?null:1}).length,c-=u,b.push(g.replace(w,a.kind).replace(k,u===v||c===v?a[u?"roots":"folders"]:e.map({roots:u,folders:c,files:v-u-c},function(e,t){return e?a[t]+" "+e:null}).join(", "))),b.push(g.replace(w,a.size).replace(k,m.spinner.replace("{text}",a.calc).replace("{name}","size"))),T=e.map(r,function(e){return e.hash})):(o=0,e.each(r,function(e,t){var n=parseInt(t.size);n>=0&&o>=0?o+=n:o="unknown"}),b.push(g.replace(w,a.kind).replace(k,a.files)),b.push(g.replace(w,a.size).replace(k,p.formatSize(o))));y=y.replace("{title}",d).replace("{content}",b.join("")),I=p.dialog(y,C),I.attr("id",A),l&&"1"==l.url&&I.on("click","."+n+"-url",function(){e(this).parent().html(m.spinner.replace("{text}",p.i18n("ntfurl")).replace("{name}","url")),p.request({data:{cmd:"url",target:l.hash},preventDefault:!0}).fail(function(){z(O,"url")}).done(function(e){if(e.url){z('<a href="'+e.url+'" target="_blank">'+O+"</a>"||O,"url");var t=p.file(l.hash);t.url=e.url}else z(O,"url")})}),s&&e("<img/>").on("load",function(){I.find(".elfinder-cwd-icon").addClass(s.className).css("background-image","url('"+s.url+"')")}).attr("src",s.url),T.length&&U(T),S.length&&e.each(S,function(e,t){try{t(l,p,I)}catch(n){p.debug("error",n)}})}}).prototype={forceLoad:!0},i.prototype.commands.mkdir=function(){var t,n=this.fm,i=this;this.value="",this.disableOnSearch=!0,this.updateOnSelect=!1,this.mime="directory",this.prefix="untitled folder",this.exec=function(a){return this.origin=t?t:"cwd",a||this.options.intoNewFolderToolbtn||n.getUI("cwd").trigger("unselectall"),this.move=!("navbar"===this.origin||!n.selected().length),e.proxy(n.res("mixin","make"),i)()},this.shortcuts=[{pattern:"ctrl+shift+n"}],this.init=function(){this.options.intoNewFolderToolbtn&&(this.options.ui="mkdirbutton")},n.bind("select",function(e){var a=e.data&&e.data.selected?e.data.selected:[];t=a.length?e.data.origin||"":"",i.title=a.length&&"navbar"!==t?n.i18n("cmdmkdirin"):n.i18n("cmdmkdir"),i.update(void 0,i.title)}),this.getstate=function(i){var a=n.cwd(),i="navbar"===t||i&&i[0]!=a.hash?this.files(i||n.selected()):[],r=i.length;return"navbar"===t?!this._disabled&&r&&i[0].write&&i[0].read?0:-1:this._disabled||!a.write||r&&e.map(i,function(e){return e.read&&!e.locked?e:null}).length!=r?-1:0}},i.prototype.commands.mkfile=function(){this.disableOnSearch=!0,this.updateOnSelect=!1,this.mime="text/plain",this.prefix="untitled file.txt",this.exec=e.proxy(this.fm.res("mixin","make"),this),this.getstate=function(){return!this._disabled&&this.fm.cwd().write?0:-1}},i.prototype.commands.netmount=function(){var t,n=this;this.alwaysEnabled=!0,this.updateOnSelect=!1,this.drivers=[],this.handlers={load:function(){this.drivers=this.fm.netDrivers}},this.getstate=function(){return this.drivers.length?0:-1},this.exec=function(){var i,a=n.fm,r=e.Deferred(),o=n.options,s=function(){var s,l=function(){d.protocol.trigger("change","winfocus")},d={protocol:e("<select/>").on("change",function(e,n){var r=this.value;t.find(".elfinder-netmount-tr").hide(),t.find(".elfinder-netmount-tr-"+r).show(),i.children(".ui-dialog-buttonpane:first").find("button").show(),"function"==typeof o[r].select&&o[r].select(a,e,n),setTimeout(function(){t.find("input:text.elfinder-tabstop:visible:first").focus()},20)}).addClass("ui-corner-all")},c={title:a.i18n("netMountDialogTitle"),resizable:!1,modal:!0,destroyOnClose:!0,open:function(){e(window).on("focus."+a.namespace,l),d.protocol.change()},close:function(){"pending"==r.state()&&r.reject(),e(window).off("focus."+a.namespace,l)},buttons:{}},u=e("<div/>");return t=e('<table class="elfinder-info-tb elfinder-netmount-tb"/>').append(e("<tr/>").append(e("<td>"+a.i18n("protocol")+"</td>")).append(e("<td/>").append(d.protocol))),e.each(n.drivers,function(n,i){o[i]&&(d.protocol.append('<option value="'+i+'">'+a.i18n(o[i].name||i)+"</option>"),e.each(o[i].inputs,function(n,r){r.attr("name",n),"hidden"!=r.attr("type")?(r.addClass("ui-corner-all elfinder-netmount-inputs-"+i),t.append(e("<tr/>").addClass("elfinder-netmount-tr elfinder-netmount-tr-"+i).append(e("<td>"+a.i18n(n)+"</td>")).append(e("<td/>").append(r)))):(r.addClass("elfinder-netmount-inputs-"+i),u.append(r))}),o[i].protocol=d.protocol)}),t.append(u),t.find(".elfinder-netmount-tr").hide(),c.buttons[a.i18n("btnMount")]=function(){var i=d.protocol.val(),s={cmd:"netmount",protocol:i},l=o[i];return e.each(t.find("input.elfinder-netmount-inputs-"+i),function(t,n){var i;i="function"==typeof n.val?e.trim(n.val()):e.trim(n.value),i&&(s[n.name]=i)}),s.host?(a.request({data:s,notify:{type:"netmount",cnt:1,hideCnt:!0}}).done(function(e){var t;e.added&&e.added.length&&(e.added[0].phash&&(t=a.file(e.added[0].phash))&&(t.dirs||(t.dirs=1,a.change({changed:[t]}))),a.one("netmountdone",function(){a.exec("open",e.added[0].hash)})),r.resolve()}).fail(function(e){l.fail&&"function"==typeof l.fail&&l.fail(a,e),r.reject(e)}),void n.dialog.elfinderdialog("close")):a.trigger("error",{error:"errNetMountHostReq"})},c.buttons[a.i18n("btnCancel")]=function(){n.dialog.elfinderdialog("close")},t.find("select,input").addClass("elfinder-tabstop"),s=a.dialog(t,c),i=s.closest(".ui-dialog"),s.ready(function(){d.protocol.change(),s.elfinderdialog("posInit")}),s};return n.dialog?n.dialog.elfinderdialog("open"):n.dialog=s(),r.promise()},n.fm.bind("netmount",function(e){var i=e.data||null,a=n.options;i&&i.protocol&&a[i.protocol]&&"function"==typeof a[i.protocol].done&&(a[i.protocol].done(n.fm,i),t.find("select,input").addClass("elfinder-tabstop"),n.dialog.elfinderdialog("tabstopsInit"))})},i.prototype.commands.netunmount=function(){this.alwaysEnabled=!0,this.updateOnSelect=!1,this.drivers=[],this.handlers={load:function(){this.drivers=this.fm.netDrivers}},this.getstate=function(e){var t=this.fm;return e&&this.drivers.length&&!this._disabled&&t.file(e[0]).netkey?0:-1},this.exec=function(t){var n=this,i=this.fm,a=e.Deferred().fail(function(e){e&&i.error(e)}),r=i.file(t[0]);return this._disabled?a.reject():("pending"==a.state()&&i.confirm({title:n.title,text:i.i18n("confirmUnmount",r.name),accept:{label:"btnUnmount",callback:function(){var t=i.root()==r.hash,n=e("#"+i.navHash2Id(r.hash)).parent(),o=(n.next().length?n.next():n.prev()).find(".elfinder-navbar-root");i.request({data:{cmd:"netmount",protocol:"netunmount",host:r.netkey,user:r.hash,pass:"dum"},notify:{type:"netunmount",cnt:1,hideCnt:!0},preventFail:!0}).fail(function(e){a.reject(e)}).done(function(e){var n=i.root();if(t){if(o.length)n=i.navId2Hash(o[0].id);else{var r=i.files();for(var s in r)if("directory"==i.file(s).mime){n=s;break}}i.exec("open",n)}a.resolve()})}},cancel:{label:"btnCancel",callback:function(){a.reject()}}}),a)}},(i.prototype.commands.open=function(){this.alwaysEnabled=!0,this._handlers={dblclick:function(e){e.preventDefault(),this.exec()},"select enable disable reload":function(e){this.update("disable"==e.type?-1:void 0)}},this.shortcuts=[{pattern:"ctrl+down numpad_enter"+("mac"!=this.fm.OS&&" enter")}],this.getstate=function(t){var t=this.files(t),n=t.length;return 1==n?t[0].read?0:-1:n&&!this.fm.UA.Mobile&&e.map(t,function(e){return"directory"!=e.mime&&e.read?e:null}).length==n?0:-1},this.exec=function(t,n){var i,a,r,o,s,l,d,c,u,h,p,f,m=this.fm,g=e.Deferred().fail(function(e){e&&m.error(e)}),v=this.files(t),b=v.length,y="object"==typeof n?n.thash:!1,n=this.options;if(!b&&!y)return g.reject();if(y||1==b&&(i=v[0])&&"directory"==i.mime)return y||!i||i.read?m.request({data:{cmd:"open",target:y||i.hash},notify:{type:"open",cnt:1,hideCnt:!0},syncOnFail:!0,lazy:!1}):g.reject(["errOpen",i.name,"errPerm"]);if(v=e.map(v,function(e){return"directory"!=e.mime?e:null}),b!=v.length)return g.reject();var w=function(){try{u=new RegExp(m.option("dispInlineRegex"))}catch(y){u=!1}for(h=e("<a>").hide().appendTo(e("body")),p="string"==typeof h.get(0).download,b=v.length;b--;){if(i=v[b],!i.read)return g.reject(["errOpen",i.name,"errPerm"]);if(f=u&&i.mime.match(u),a=m.openUrl(i.hash,!f),m.UA.Mobile||!f)if(p)!f&&h.attr("download",i.name),h.attr("href",a).attr("target","_blank").get(0).click();else{var w=window.open(a);if(!w)return g.reject("errPopup")}else{s=d=Math.round(2*e(window).width()/3),l=c=Math.round(2*e(window).height()/3),parseInt(i.width)&&parseInt(i.height)?(s=parseInt(i.width),l=parseInt(i.height)):i.dim&&(r=i.dim.split("x"),s=parseInt(r[0]),l=parseInt(r[1])),d>=s&&c>=l?(d=s,c=l):s-d>l-c?c=Math.round(l*(d/s)):d=Math.round(s*(c/l)),o="width="+d+",height="+c,0===a.indexOf(m.options.url)&&(a="");var w=window.open(a,"new_window",o+",top=50,left=50,scrollbars=yes,resizable=yes");if(!w)return g.reject("errPopup");if(""===a){var k=document.createElement("form");k.action=m.options.url,k.method="string"==typeof n.method&&"get"===n.method.toLowerCase()?"GET":"POST",k.target="new_window",k.style.display="none";var x=e.extend({},m.options.customData,{cmd:"file",target:i.hash});e.each(x,function(e,t){var n=document.createElement("input");n.name=e,n.value=t,k.appendChild(n)}),document.body.appendChild(k),k.submit()}w.focus()}}return h.remove(),g.resolve(t)};return b>1?m.confirm({title:"openMulti",text:["openMultiConfirm",b+""],accept:{label:"cmdopen",callback:function(){w()}},cancel:{label:"btnCancel",callback:function(){g.reject()}},buttons:m.getCommand("zipdl")&&m.isCommandEnabled("zipdl",m.cwd().hash)?[{label:"cmddownload",callback:function(){m.exec("download",t),g.reject()}}]:[]}):w(),g}}).prototype={forceLoad:!0},i.prototype.commands.opendir=function(){this.alwaysEnabled=!0,this.getstate=function(){var e,t=this.fm.selected(),n=t.length;return 1!==n?-1:(e=this.fm.getUI("workzone"),e.hasClass("elfinder-search-result")?0:-1)},this.exec=function(t){var n,i=this.fm,a=e.Deferred(),r=this.files(t),o=r.length;return o&&r[0].phash?(n=r[0].phash,i.trigger("searchend",{noupdate:!0}),i.request({data:{cmd:"open",target:n},notify:{type:"open",cnt:1,hideCnt:!0},syncOnFail:!1}),a):a.reject()}},i.prototype.commands.paste=function(){this.updateOnSelect=!1,this.handlers={changeclipboard:function(){this.update()}},this.shortcuts=[{pattern:"ctrl+v shift+insert"}],this.getstate=function(t){if(this._disabled)return-1;if(t){if(e.isArray(t)){if(1!=t.length)return-1;t=this.fm.file(t[0])}}else t=this.fm.cwd();return this.fm.clipboard().length&&"directory"==t.mime&&t.write?0:-1},this.exec=function(t){var n,i,a=this,r=a.fm,t=t?this.files(t)[0]:r.cwd(),o=r.clipboard(),s=o.length,l=s?o[0].cut:!1,d=l?"errMove":"errCopy",c=[],u=[],h=e.Deferred().fail(function(e){e&&r.error(e)}).always(function(){r.unlockfiles({files:e.map(o,function(e){return e.hash})})}),p=function(t){return t.length&&r._commands.duplicate?r.exec("duplicate",t):e.Deferred().resolve()},f=function(n){var i,o=e.Deferred(),s=[],d={},c=function(t,n){for(var i=[],a=t.length;a--;)-1!==e.inArray(t[a].name,n)&&i.unshift(a);return i},u=function(e){var t=s[e],i=n[t],a=e==s.length-1;i&&r.confirm({title:r.i18n(l?"moveFiles":"copyFiles"),text:["errExists",i.name,"confirmRepl"],all:!a,accept:{label:"btnYes",callback:function(t){a||t?p(n):u(++e)}},reject:{label:"btnNo",callback:function(t){var i;if(t)for(i=s.length;e<i--;)n[s[i]].remove=!0;else n[s[e]].remove=!0;a||t?p(n):u(++e)}},cancel:{label:"btnCancel",callback:function(){o.resolve()}},buttons:[{label:"btnBackup",callback:function(t){var i;if(t)for(i=s.length;e<i--;)n[s[i]].rename=!0;else n[s[e]].rename=!0;a||t?p(n):u(++e)}}]})},h=function(t){var i,a={};t&&(e.isArray(t)?t.length&&("string"==typeof t[0]?s=c(n,t):(e.each(t,function(e,t){a[t.name]=t.hash}),s=c(n,e.map(a,function(e,t){return t})),e.each(n,function(e,t){a[t.name]&&(d[a[t.name]]=t.name)}))):(i=[],s=e.map(t,function(e){return"string"==typeof e?e:(i=i.concat(e),null)}),i.length&&(s=s.concat(i)),s=c(n,s),d=t)),s.length?u(0):p(n)},p=function(n){var i,a=[],n=e.map(n,function(e){return e.rename&&a.push(e.name),e.remove?null:e}),s=n.length;return s?(i=n[0].phash,n=e.map(n,function(e){return e.hash}),void r.request({data:{cmd:"paste",dst:t.hash,targets:n,cut:l?1:0,src:i,renames:a,hashes:d,suffix:r.options.backupSuffix},notify:{type:l?"move":"copy",cnt:s}}).done(function(n){var i,a;o.resolve(n),n&&n.added&&n.added[0]&&r.one("pastedone",function(){i=r.findCwdNodes(n.added),i.length?i.trigger("scrolltoview"):(t.hash!==r.cwd().hash?a=e("<div/>").append(e('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all"><span class="ui-button-text">'+r.i18n("cmdopendir")+"</span></button>").on("mouseenter mouseleave",function(t){e(this).toggleClass("ui-state-hover","mouseenter"==t.type)}).on("click",function(){r.exec("open",t.hash).done(function(){r.one("opendone",function(){r.trigger("selectfiles",{files:e.map(n.added,function(e){return e.hash})})})})})):r.trigger("selectfiles",{files:e.map(n.added,function(e){return e.hash})}),r.toast({msg:r.i18n(["complete",r.i18n("cmd"+(l?"move":"copy"))]),extNode:a}))})}).always(function(){r.unlockfiles({files:n})})):o.resolve()};return r.isCommandEnabled(a.name,t.hash)&&n.length?(r.oldAPI?p(n):r.option("copyOverwrite")?(i=e.map(n,function(e){return e.name}),t.hash==r.cwd().hash?h(e.map(r.files(),function(e){return e.phash==t.hash?{hash:e.hash,name:e.name}:null})):r.request({data:{cmd:"ls",target:t.hash,intersect:i},notify:{type:"prepare",cnt:1,hideCnt:!0},preventFail:!0}).always(function(e){h(e.list)})):p(n),o):o.resolve()};return s&&t&&"directory"==t.mime?t.write?(n=r.parents(t.hash),e.each(o,function(a,o){return o.read?l&&o.locked?!h.reject(["errLocked",o.name]):-1!==e.inArray(o.hash,n)?!h.reject(["errCopyInItself",o.name]):o.mime&&"directory"!==o.mime&&!r.uploadMimeCheck(o.mime,t.hash)?!h.reject([d,o.name,"errUploadMime"]):(i=r.parents(o.hash),i.pop(),-1!==e.inArray(t.hash,i)&&e.map(i,function(e){var n=r.file(e);return n.phash==t.hash&&n.name==o.name?n:null}).length?!h.reject(["errReplByChild",o.name]):void(o.phash==t.hash?u.push(o.hash):c.push({hash:o.hash,phash:o.phash,name:o.name}))):!h.reject([d,o.name,"errPerm"])}),"rejected"==h.state()?h:e.when(p(u),f(c)).always(function(){l&&r.clipboard([])})):h.reject([d,o[0].name,"errPerm"]):h.reject()}},i.prototype.commands.places=function(){var t=this,n=this.fm,i=function(n){return e.map(t.files(n),function(e){return"directory"==e.mime?e:null})},a=null;this.getstate=function(e){var e=this.hashes(e),t=e.length;return a&&t&&t==i(e).length?0:-1},this.exec=function(e){var t=this.files(e);a.trigger("regist",[t])},n.one("load",function(){a=n.ui.places})},(i.prototype.commands.quicklook=function(){var t,n,i,a,r=this,o=r.fm,s=0,l=1,d=2,c=s,u="elfinder-quicklook-navbar-icon",h="elfinder-quicklook-fullscreen",p=function(t){e(document).trigger(e.Event("keydown",{keyCode:t,ctrlKey:!1,shiftKey:!1,altKey:!1,metaKey:!1}))},f=function(e){var t=o.getUI().offset(),n=e.find(".elfinder-cwd-file-wrapper"),i=n.offset();return{opacity:0,width:n.width(),height:n.height(),top:i.top-t.top,left:i.left-t.left}},m=function(){var i=e(window),a=o.getUI().offset(),r=Math.min(t,e(window).width()-10),s=Math.min(n,e(window).height()-80);return{opacity:1,width:r,height:s,top:parseInt((i.height()-s-60)/2+i.scrollTop()-a.top),left:parseInt((i.width()-r)/2+i.scrollLeft()-a.left)}},g=function(e){var t=document.createElement(e.substr(0,e.indexOf("/"))),n=!1;try{n=t.canPlayType&&t.canPlayType(e)}catch(i){}return n&&""!==n&&"no"!=n},v=!1,b=!1,y=null,w=e.ui.keyCode.LEFT,k=e.ui.keyCode.RIGHT,x="mousemove touchstart "+("onwheel"in document?"wheel":"onmousewheel"in document?"mousewheel":"DOMMouseScroll"),C=e('<div class="elfinder-quicklook-title"/>'),T=e("<div/>"),z=e('<div class="elfinder-quicklook-info"/>'),A=e('<div class="ui-front elfinder-quicklook-cover"/>'),I=e('<div class="'+u+" "+u+'-fullscreen"/>').on("click touchstart",function(t){if(!b){var n=r.window,a=n.hasClass(h),s=e(window),l=function(){r.preview.trigger("changesize")};t.stopPropagation(),t.preventDefault(),a?(F="",S(),n.toggleClass(h).css(n.data("position")),s.trigger(r.resize).off(r.resize,l),D.off("mouseenter mouseleave"),A.off(x)):(n.toggleClass(h).data("position",{left:n.css("left"),top:n.css("top"),width:n.width(),height:n.height(),display:"block"}).removeAttr("style"),e(window).on(r.resize,l).trigger(r.resize),A.on(x,function(e){v||("mousemove"!==e.type&&"touchstart"!==e.type||(S(),y=setTimeout(function(){(o.UA.Mobile||D.parent().find(".elfinder-quicklook-navbar:hover").length<1)&&D.fadeOut("slow",function(){A.show()})},3e3)),A.is(":visible")&&(U(),A.data("tm",setTimeout(function(){A.show()},3e3))))}).show().trigger("mousemove"),D.on("mouseenter mouseleave",function(e){v||("mouseenter"===e.type?S():A.trigger("mousemove"))})),o.zIndex&&n.css("z-index",o.zIndex+1),o.UA.Mobile?D.attr("style",F):D.attr("style",F).draggable(a?"destroy":{start:function(){v=!0,b=!0,A.show(),S()},stop:function(){v=!1,F=r.navbar.attr("style"),setTimeout(function(){b=!1},20)}}),e(this).toggleClass(u+"-fullscreen-off");var d=n;i.is(".ui-resizable")&&(d=d.add(i)),e.fn.resizable&&d.resizable(a?"enable":"disable").removeClass("ui-state-disabled"),n.trigger("viewchange")}}),S=function(){r.window.hasClass(h)&&(y&&clearTimeout(y),y=null,D.stop(!0,!0).css("display","block"),U())},U=function(){A.data("tm")&&clearTimeout(A.data("tm")),A.removeData("tm"),A.hide()},M=e('<div class="'+u+" "+u+'-prev"/>').on("click touchstart",function(e){return!b&&p(w),!1}),O=e('<div class="'+u+" "+u+'-next"/>').on("click touchstart",function(e){return!b&&p(k),!1}),D=e('<div class="elfinder-quicklook-navbar"/>').append(M).append(I).append(O).append('<div class="elfinder-quicklook-navbar-separator"/>').append(e('<div class="'+u+" "+u+'-close"/>').on("click touchstart",function(e){return!b&&r.window.trigger("close"),!1})),F="";(this.navbar=D)._show=S,this.resize="resize."+o.namespace,this.info=e('<div class="elfinder-quicklook-info-wrapper"/>').append(T).append(z),this.preview=e('<div class="elfinder-quicklook-preview ui-helper-clearfix"/>').on("change",function(){S(),D.attr("style",F),r.preview.attr("style","").removeClass("elfinder-overflow-auto"),r.info.attr("style","").hide(),T.removeAttr("class").attr("style",""),z.html("")}).on("update",function(t){var n,i=r.fm,o=(r.preview,t.file),s='<div class="elfinder-quicklook-info-data">{value}</div>';o&&(t.forceUpdate||r.window.data("hash")!==o.hash)?(!o.read&&t.stopImmediatePropagation(),r.window.data("hash",o.hash),r.preview.off("changesize").trigger("change").children().remove(),C.html(i.escape(o.name)),M.css("visibility",""),O.css("visibility",""),o.hash===i.cwdId2Hash(a.find("[id]:first").attr("id"))&&M.css("visibility","hidden"),o.hash===i.cwdId2Hash(a.find("[id]:last").attr("id"))&&O.css("visibility","hidden"),z.html(s.replace(/\{value\}/,i.escape(o.name))+s.replace(/\{value\}/,i.mime2kind(o))+("directory"==o.mime?"":s.replace(/\{value\}/,i.formatSize(o.size)))+s.replace(/\{value\}/,i.i18n("modify")+": "+i.formatDate(o))),T.addClass("elfinder-cwd-icon ui-corner-all "+i.mime2class(o.mime)),o.read&&(n=i.tmb(o))&&e("<img/>").hide().appendTo(r.preview).on("load",function(){T.addClass(n.className).css("background-image","url('"+n.url+"')"),e(this).remove()}).attr("src",n.url),r.info.delay(100).fadeIn(10),r.window.hasClass(h)&&A.trigger("mousemove")):t.stopImmediatePropagation()}),this.window=e('<div class="ui-front ui-helper-reset ui-widget elfinder-quicklook touch-punch" style="position:absolute"/>').hide().addClass(o.UA.Touch?"elfinder-touch":"").on("click",function(e){e.stopPropagation()}).append(e('<div class="elfinder-quicklook-titlebar"/>').append(C,e('<span class="ui-icon ui-icon-circle-close"/>').mousedown(function(e){e.stopPropagation(),r.window.trigger("close")})),this.preview,r.info.hide(),A.hide(),D).draggable({handle:"div.elfinder-quicklook-titlebar"}).on("open",function(t){var n,i=r.window,a=r.value;r.closed()&&a&&(n=e("#"+o.cwdHash2Id(a.hash))).length&&(F="",D.attr("style",""),c=l,n.trigger("scrolltoview"),U(),i.css(f(n)).show().animate(m(),550,function(){c=d,r.update(1,r.value),S()}))}).on("close",function(e){var t=r.window,n=r.preview.trigger("change"),i=(r.value,a.find("#"+o.cwdHash2Id(t.data("hash")))),d=function(){c=s,t.hide(),n.children().remove(),r.update(0,r.value)};t.data("hash",""),r.opened()&&(c=l,t.hasClass(h)&&I.click(),i.length?t.animate(f(i),500,d):d())}),this.alwaysEnabled=!0,this.value=null,this.handlers={select:function(){this.update(void 0,this.fm.selectedFiles()[0])},error:function(){r.window.is(":visible")&&r.window.data("hash","").trigger("close")},"searchshow searchhide":function(){this.opened()&&this.window.trigger("close")}},this.shortcuts=[{pattern:"space"}],this.support={audio:{ogg:g('audio/ogg; codecs="vorbis"'),mp3:g("audio/mpeg;"),wav:g('audio/wav; codecs="1"'),m4a:g("audio/mp4;")||g("audio/x-m4a;")||g("audio/aac;")},video:{ogg:g('video/ogg; codecs="theora"'),webm:g('video/webm; codecs="vp8, vorbis"'),mp4:g('video/mp4; codecs="avc1.42E01E"')||g('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')}},this.closed=function(){return c==s},this.opened=function(){return c==d},this.init=function(){var s,l=this.options,d=this.window,c=this.preview;t=l.width>0?parseInt(l.width):450,n=l.height>0?parseInt(l.height):300,o.one("load",function(){i=o.getUI(),a=o.getUI("cwd"),o.zIndex&&d.css("z-index",o.zIndex+1),d.appendTo(i),e(document).keydown(function(t){t.keyCode==e.ui.keyCode.ESCAPE&&r.opened()&&d.trigger("close")}),e.fn.resizable&&d.resizable({handles:"se",minWidth:350,minHeight:120,resize:function(){c.trigger("changesize")}}),r.change(function(){r.opened()&&setTimeout(function(){r.value?c.trigger(e.Event("update",{file:r.value})):(p(k),setTimeout(function(){!r.value&&d.trigger("close")},10))},10)}),c.on("update",function(e){if(o.searchStatus.mixed&&o.searchStatus.state>1)try{r.dispInlineRegex=new RegExp(o.option("dispInlineRegex",e.file.hash))}catch(t){r.dispInlineRegex=/.*/}r.info.show()}),e.each(o.commands.quicklook.plugins||[],function(e,t){"function"==typeof t&&new t(r)})}),o.bind("open",function(){var e=s;s=o.cwd().hash,r.opened()&&e!==s&&d.trigger("close");try{r.dispInlineRegex=new RegExp(o.option("dispInlineRegex"))}catch(t){r.dispInlineRegex=/.*/}}),o.bind("destroy",function(){r.window.remove()})},this.getstate=function(){var t=this.fm,n=t.selected(),i=1===n.length&&e("#"+t.cwdHash2Id(n[0])).length;return i?c==d?1:0:-1},this.exec=function(){this.enabled()&&this.window.trigger(this.opened()?"close":"open")},this.hideinfo=function(){this.info.stop(!0,!0).hide()}}).prototype={forceLoad:!0},i.prototype.commands.quicklook.plugins=[function(t){var n=["image/jpeg","image/png","image/gif","image/svg+xml","image/x-ms-bmp"],i=t.preview;e.each(navigator.mimeTypes,function(t,i){var a=i.type;0===a.indexOf("image/")&&e.inArray(a,n)&&n.push(a)}),i.on("update",function(a){var r,o,s,l,d=t.fm,c=a.file;t.dispInlineRegex.test(c.mime)&&-1!==e.inArray(c.mime,n)&&(a.stopImmediatePropagation(),s=e('<div class="elfinder-quicklook-info-data"> '+d.i18n("nowLoading")+'<span class="elfinder-info-spinner"></div>').appendTo(t.info.find(".elfinder-quicklook-info")),r=d.openUrl(c.hash),r+=-1===r.indexOf("?")?"?_=":(l=r.match(/[\?&](_+)=/))?"&"+"_".repeat(l[1].length+1)+"=":"&_=",r+=c.ts||+new Date,o=e("<img/>").hide().appendTo(i).on("load",function(){setTimeout(function(){var e=(o.width()/o.height()).toFixed(2);i.on("changesize",function(){var t,n,a=parseInt(i.width()),r=parseInt(i.height());e<(a/r).toFixed(2)?(n=r,t=Math.floor(n*e)):(t=a,n=Math.floor(t/e)),o.width(t).height(n).css("margin-top",r>n?Math.floor((r-n)/2):0)}).trigger("changesize"),s.remove(),t.hideinfo(),o.fadeIn(100)},1)}).on("error",function(){s.remove()}).attr("src",r))})},function(t){var n=["text/html","application/xhtml+xml"],i=t.preview,a=t.fm;i.on("update",function(r){var o,s,l=r.file;t.dispInlineRegex.test(l.mime)&&-1!==e.inArray(l.mime,n)&&(r.stopImmediatePropagation(),s=e('<div class="elfinder-quicklook-info-data"> '+a.i18n("nowLoading")+'<span class="elfinder-info-spinner"></div>').appendTo(t.info.find(".elfinder-quicklook-info")),i.one("change",function(){"pending"==o.state()&&o.reject()}).addClass("elfinder-overflow-auto"),o=a.request({data:{cmd:"get",target:l.hash,current:l.phash,conv:1},preventDefault:!0}).done(function(n){t.hideinfo();var a=e('<iframe class="elfinder-quicklook-preview-html"/>').appendTo(i)[0].contentWindow.document;a.open(),a.write(n.content),a.close()}).always(function(){s.remove()}))})},function(t){var n=t.fm,i=n.res("mimes","text"),a=t.preview;a.on("update",function(r){var o,s,l=r.file,d=l.mime;0!==d.indexOf("text/")&&-1===e.inArray(d,i)||(r.stopImmediatePropagation(),s=e('<div class="elfinder-quicklook-info-data"> '+n.i18n("nowLoading")+'<span class="elfinder-info-spinner"></div>').appendTo(t.info.find(".elfinder-quicklook-info")),a.one("change",function(){"pending"==o.state()&&o.reject()}),o=n.request({data:{cmd:"get",target:l.hash,conv:1},preventDefault:!0}).done(function(i){t.hideinfo(),e('<div class="elfinder-quicklook-preview-text-wrapper"><pre class="elfinder-quicklook-preview-text">'+n.escape(i.content)+"</pre></div>").appendTo(a)}).always(function(){s.remove()}))})},function(t){var n=t.fm,i="application/pdf",a=t.preview,r=!1;n.UA.Safari&&"mac"==n.OS||n.UA.IE?r=!0:e.each(navigator.plugins,function(t,n){e.each(n,function(e,t){return t.type==i?!(r=!0):void 0})}),r&&a.on("update",function(r){var o,s=r.file;t.dispInlineRegex.test(s.mime)&&s.mime==i&&(r.stopImmediatePropagation(),a.one("change",function(){o.off("load").remove()}).addClass("elfinder-overflow-auto"),o=e('<iframe class="elfinder-quicklook-preview-pdf"/>').hide().appendTo(a).on("load",function(){t.hideinfo(),o.show()}).attr("src",n.url(s.hash)))})},function(t){var n=t.fm,i="application/x-shockwave-flash",a=t.preview,r=!1;e.each(navigator.plugins,function(t,n){e.each(n,function(e,t){return t.type==i?!(r=!0):void 0})}),r&&a.on("update",function(r){var o,s=r.file;t.dispInlineRegex.test(s.mime)&&s.mime==i&&(r.stopImmediatePropagation(),t.hideinfo(),o=e('<embed class="elfinder-quicklook-preview-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+n.url(s.hash)+'" quality="high" type="application/x-shockwave-flash" wmode="transparent" />').appendTo(a))})},function(t){var n,i=t.preview,a=!!t.options.autoplay,r={"audio/mpeg":"mp3","audio/mpeg3":"mp3","audio/mp3":"mp3","audio/x-mpeg3":"mp3","audio/x-mp3":"mp3","audio/x-wav":"wav","audio/wav":"wav","audio/x-m4a":"m4a","audio/aac":"m4a","audio/mp4":"m4a","audio/x-mp4":"m4a","audio/ogg":"ogg"},o=t.window,s=t.navbar;i.on("update",function(l){var d=l.file,c=r[d.mime],u=function(){s.css("bottom",o.hasClass("elfinder-quicklook-fullscreen")?"50px":"")};t.support.audio[c]&&(l.stopImmediatePropagation(),n=e('<audio class="elfinder-quicklook-preview-audio" controls preload="auto" autobuffer><source src="'+t.fm.openUrl(d.hash)+'" /></audio>').appendTo(i),a&&n[0].play(),o.on("viewchange.audio",u),u())}).on("change",function(){n&&n.parent().length&&(o.off("viewchange.audio"),n[0].pause(),n.remove(),n=null)})},function(t){var n,i=t.preview,a=!!t.options.autoplay,r={"video/mp4":"mp4","video/x-m4v":"mp4","video/quicktime":"mp4","video/ogg":"ogg","application/ogg":"ogg","video/webm":"webm"},o=t.window,s=t.navbar;i.on("update",function(l){var d=l.file,c=r[d.mime],u=function(){t.fm.UA.iOS?o.hasClass("elfinder-quicklook-fullscreen")?(i.css("height","-webkit-calc(100% - 50px)"),s._show()):i.css("height",""):s.css("bottom",o.hasClass("elfinder-quicklook-fullscreen")?"50px":"")};t.support.video[c]&&(l.stopImmediatePropagation(),t.hideinfo(),n=e('<video class="elfinder-quicklook-preview-video" controls preload="auto" autobuffer><source src="'+t.fm.openUrl(d.hash)+'" /></video>').appendTo(i),a&&n[0].play(),o.on("viewchange.video",u),u())}).on("change",function(){n&&n.parent().length&&(o.off("viewchange.video"),n[0].pause(),n.remove(),n=null)})},function(t){var n,i=t.preview,a=[],r=t.window,o=t.navbar;e.each(navigator.plugins,function(t,n){e.each(n,function(e,t){(0===t.type.indexOf("audio/")||0===t.type.indexOf("video/"))&&a.push(t.type)})}),i.on("update",function(s){var l,d=s.file,c=d.mime,u=function(){o.css("bottom",r.hasClass("elfinder-quicklook-fullscreen")?"50px":"")};-1!==e.inArray(d.mime,a)&&(s.stopImmediatePropagation(),(l=0===c.indexOf("video/"))&&t.hideinfo(),n=e('<embed src="'+t.fm.openUrl(d.hash)+'" type="'+c+'" class="elfinder-quicklook-preview-'+(l?"video":"audio")+'"/>').appendTo(i),r.on("viewchange.embed",u),u())}).on("change",function(){n&&n.parent().length&&(r.off("viewchange.embed"),n.remove(),n=null)})},function(t){var n=["application/zip","application/x-gzip","application/x-tar"],a=t.preview,r=t.fm;"undefined"!=typeof Uint8Array&&i.Zlib&&a.on("update",function(o){var s,l,d,c=o.file;-1!==e.inArray(c.mime,n)&&(o.stopImmediatePropagation(),d=e('<div class="elfinder-quicklook-info-data"> '+r.i18n("nowLoading")+'<span class="elfinder-info-spinner"></div>').appendTo(t.info.find(".elfinder-quicklook-info")),a.one("change",function(){d.remove(),l&&l.readyState<4&&l.abort()}),l=new XMLHttpRequest,l.onload=function(n){var o,u,h,p,f,m,g,v,b,y,w,k=[];4===this.readyState&&this.response?setTimeout(function(){try{if("application/zip"===c.mime)u=new i.Zlib.Unzip(new Uint8Array(l.response)),k=u.getFilenames();else for("application/x-gzip"===c.mime?(u=new i.Zlib.Gunzip(new Uint8Array(l.response)),h=u.decompress()):h=new Uint8Array(l.response),p=h.length,f=0,w=function(e){return String.fromCharCode.apply(null,e).replace(/\0+$/,"")};p>f&&0!==h[f];)m=h.subarray(f,f+512),g=w(m.subarray(0,100)),(v=w(m.subarray(345,500)))&&(g=v+g),b=parseInt(w(m.subarray(124,136)),8),y=512*Math.ceil(b/512),"././@LongLink"===g&&(g=w(h.subarray(f+512,f+512+y))),"pax_global_header"!==g&&k.push(g),f=f+512+y}catch(n){d.remove(),r.debug("error",n)}k&&k.length&&(k=e.map(k,function(e){return r.decodeRawString(e)}),k.sort(),d.remove(),o="<strong>"+r.escape(c.mime)+"</strong> ("+r.formatSize(c.size)+")<hr/>",s=e('<div class="elfinder-quicklook-preview-archive-wrapper">'+o+'<pre class="elfinder-quicklook-preview-text">'+r.escape(k.join("\n"))+"</pre></div>").appendTo(a),t.hideinfo())},70):d.remove()},l.open("GET",r.openUrl(c.hash,r.xhrFields.withCredentials||!1),!0),l.responseType="arraybuffer",r.customHeaders&&e.each(r.customHeaders,function(e){l.setRequestHeader(e,this)}),r.xhrFields&&e.each(r.xhrFields,function(e){e in l&&(l[e]=this)}),l.send())})},function(t){var n,i=t.fm,a=t.options.googleDocsMimes||[],r=t.preview,o=(t.window,t.navbar);r.on("update",function(s){var l,d=t.window,c=s.file,u=function(){o.css("bottom",d.hasClass("elfinder-quicklook-fullscreen")?"56px":"")};-1!==e.inArray(c.mime,a)&&("1"==c.url&&e('<div class="elfinder-quicklook-info-data"><button class="elfinder-info-button">'+i.i18n("getLink")+"</button></div>").appendTo(t.info.find(".elfinder-quicklook-info")).on("click",function(){var t=e(this);t.html('<span class="elfinder-info-spinner">'),i.request({data:{cmd:"url",target:c.hash},preventDefault:!0}).always(function(){t.html("")}).done(function(e){var t=i.file(c.hash);c.url=t.url=e.url||"",c.url&&r.trigger({type:"update",file:c,forceUpdate:!0})})}),""!==c.url&&"1"!=c.url&&(s.stopImmediatePropagation(),r.one("change",function(){d.off("viewchange.googledocs"),l.remove(),n.off("load").remove(),n=null}).addClass("elfinder-overflow-auto"),l=e('<div class="elfinder-quicklook-info-data"> '+i.i18n("nowLoading")+'<span class="elfinder-info-spinner"></div>').appendTo(t.info.find(".elfinder-quicklook-info")),n=e('<iframe class="elfinder-quicklook-preview-iframe"/>').css("background-color","transparent").appendTo(r).on("load",function(){t.hideinfo(),l.remove(),e(this).css("background-color","#fff").show()}).attr("src","//docs.google.com/gview?embedded=true&url="+encodeURIComponent(i.convAbsUrl(i.url(c.hash)))),
d.on("viewchange.googledocs",u),u()))})}];try{(function(){(function(){"use strict";function e(e){throw e}function t(e,t){var n=e.split("."),i=m;!(n[0]in i)&&i.execScript&&i.execScript("var "+n[0]);for(var a;n.length&&(a=n.shift());)n.length||t===f?i=i[a]?i[a]:i[a]={}:i[a]=t}function n(e){var t,n,i,a,r,o,s,l,d,c,u=e.length,h=0,p=Number.POSITIVE_INFINITY;for(l=0;u>l;++l)e[l]>h&&(h=e[l]),e[l]<p&&(p=e[l]);for(t=1<<h,n=new(g?Uint32Array:Array)(t),i=1,a=0,r=2;h>=i;){for(l=0;u>l;++l)if(e[l]===i){for(o=0,s=a,d=0;i>d;++d)o=o<<1|1&s,s>>=1;for(c=i<<16|l,d=o;t>d;d+=r)n[d]=c;++a}++i,a<<=1,r<<=1}return[n,h,p]}function i(t,n){switch(this.l=[],this.m=32768,this.d=this.f=this.c=this.t=0,this.input=g?new Uint8Array(t):t,this.u=!1,this.n=A,this.L=!1,!n&&(n={})||(n.index&&(this.c=n.index),n.bufferSize&&(this.m=n.bufferSize),n.bufferType&&(this.n=n.bufferType),n.resize&&(this.L=n.resize)),this.n){case z:this.a=32768,this.b=new(g?Uint8Array:Array)(32768+this.m+258);break;case A:this.a=0,this.b=new(g?Uint8Array:Array)(this.m),this.e=this.X,this.B=this.S,this.q=this.W;break;default:e(Error("invalid inflate mode"))}}function a(t,n){for(var i,a=t.f,r=t.d,o=t.input,s=t.c,l=o.length;n>r;)s>=l&&e(Error("input buffer is broken")),a|=o[s++]<<r,r+=8;return i=a&(1<<n)-1,t.f=a>>>n,t.d=r-n,t.c=s,i}function r(e,t){for(var n,i,a=e.f,r=e.d,o=e.input,s=e.c,l=o.length,d=t[0],c=t[1];c>r&&!(s>=l);)a|=o[s++]<<r,r+=8;return n=d[a&(1<<c)-1],i=n>>>16,e.f=a>>i,e.d=r-i,e.c=s,65535&n}function o(e){function t(e,t,n){var i,o,s,l=this.K;for(s=0;e>s;)switch(i=r(this,t)){case 16:for(o=3+a(this,2);o--;)n[s++]=l;break;case 17:for(o=3+a(this,3);o--;)n[s++]=0;l=0;break;case 18:for(o=11+a(this,7);o--;)n[s++]=0;l=0;break;default:l=n[s++]=i}return this.K=l,n}var i,o,s,l,d=a(e,5)+257,c=a(e,5)+1,u=a(e,4)+4,h=new(g?Uint8Array:Array)(M.length);for(l=0;u>l;++l)h[M[l]]=a(e,3);if(!g)for(l=u,u=h.length;u>l;++l)h[M[l]]=0;i=n(h),o=new(g?Uint8Array:Array)(d),s=new(g?Uint8Array:Array)(c),e.K=0,e.q(n(t.call(e,d,i,o)),n(t.call(e,c,i,s)))}function s(e){e=e||{},this.files=[],this.v=e.comment}function l(e,t){t=t||{},this.input=g&&e instanceof Array?new Uint8Array(e):e,this.c=0,this.ca=t.verify||!1,this.j=t.password}function d(e,t){this.input=e,this.offset=t}function c(e,t){this.input=e,this.offset=t}function u(t){var n,i,a,r,o=[],s={};if(!t.i){if(t.o===f){var l,c=t.input;if(!t.D)e:{var u,h=t.input;for(u=h.length-12;u>0;--u)if(h[u]===G[0]&&h[u+1]===G[1]&&h[u+2]===G[2]&&h[u+3]===G[3]){t.D=u;break e}e(Error("End of Central Directory Record not found"))}l=t.D,(c[l++]!==G[0]||c[l++]!==G[1]||c[l++]!==G[2]||c[l++]!==G[3])&&e(Error("invalid signature")),t.ia=c[l++]|c[l++]<<8,t.ka=c[l++]|c[l++]<<8,t.la=c[l++]|c[l++]<<8,t.ba=c[l++]|c[l++]<<8,t.R=(c[l++]|c[l++]<<8|c[l++]<<16|c[l++]<<24)>>>0,t.o=(c[l++]|c[l++]<<8|c[l++]<<16|c[l++]<<24)>>>0,t.w=c[l++]|c[l++]<<8,t.v=g?c.subarray(l,l+t.w):c.slice(l,l+t.w)}for(n=t.o,a=0,r=t.ba;r>a;++a)i=new d(t.input,n),i.parse(),n+=i.length,o[a]=i,s[i.filename]=a;t.R<n-t.o&&e(Error("invalid file header size")),t.i=o,t.G=s}}function h(e,t,n){return n^=e.s(t),e.k(t,n),n}var p,f=void 0,m=this,g="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;new(g?Uint8Array:Array)(256);var v;for(v=0;256>v;++v)for(var b=v,y=7,b=b>>>1;b;b>>>=1)--y;var w,k=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],x=g?new Uint32Array(k):k,C=[];for(w=0;288>w;w++)switch(!0){case 143>=w:C.push([w+48,8]);break;case 255>=w:C.push([w-144+400,9]);break;case 279>=w:C.push([w-256+0,7]);break;case 287>=w:C.push([w-280+192,8]);break;default:e("invalid literal: "+w)}var T=function(){function t(t){switch(!0){case 3===t:return[257,t-3,0];case 4===t:return[258,t-4,0];case 5===t:return[259,t-5,0];case 6===t:return[260,t-6,0];case 7===t:return[261,t-7,0];case 8===t:return[262,t-8,0];case 9===t:return[263,t-9,0];case 10===t:return[264,t-10,0];case 12>=t:return[265,t-11,1];case 14>=t:return[266,t-13,1];case 16>=t:return[267,t-15,1];case 18>=t:return[268,t-17,1];case 22>=t:return[269,t-19,2];case 26>=t:return[270,t-23,2];case 30>=t:return[271,t-27,2];case 34>=t:return[272,t-31,2];case 42>=t:return[273,t-35,3];case 50>=t:return[274,t-43,3];case 58>=t:return[275,t-51,3];case 66>=t:return[276,t-59,3];case 82>=t:return[277,t-67,4];case 98>=t:return[278,t-83,4];case 114>=t:return[279,t-99,4];case 130>=t:return[280,t-115,4];case 162>=t:return[281,t-131,5];case 194>=t:return[282,t-163,5];case 226>=t:return[283,t-195,5];case 257>=t:return[284,t-227,5];case 258===t:return[285,t-258,0];default:e("invalid length: "+t)}}var n,i,a=[];for(n=3;258>=n;n++)i=t(n),a[n]=i[2]<<24|i[1]<<16|i[0];return a}();g&&new Uint32Array(T);var z=0,A=1;i.prototype.r=function(){for(;!this.u;){var t=a(this,3);switch(1&t&&(this.u=!0),t>>>=1){case 0:var n=this.input,i=this.c,r=this.b,s=this.a,l=n.length,d=f,c=f,u=r.length,h=f;switch(this.d=this.f=0,i+1>=l&&e(Error("invalid uncompressed block header: LEN")),d=n[i++]|n[i++]<<8,i+1>=l&&e(Error("invalid uncompressed block header: NLEN")),c=n[i++]|n[i++]<<8,d===~c&&e(Error("invalid uncompressed block header: length verify")),i+d>n.length&&e(Error("input buffer is broken")),this.n){case z:for(;s+d>r.length;){if(h=u-s,d-=h,g)r.set(n.subarray(i,i+h),s),s+=h,i+=h;else for(;h--;)r[s++]=n[i++];this.a=s,r=this.e(),s=this.a}break;case A:for(;s+d>r.length;)r=this.e({H:2});break;default:e(Error("invalid inflate mode"))}if(g)r.set(n.subarray(i,i+d),s),s+=d,i+=d;else for(;d--;)r[s++]=n[i++];this.c=i,this.a=s,this.b=r;break;case 1:this.q(L,B);break;case 2:o(this);break;default:e(Error("unknown BTYPE: "+t))}}return this.B()};var I,S,U=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],M=g?new Uint16Array(U):U,O=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],D=g?new Uint16Array(O):O,F=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],E=g?new Uint8Array(F):F,P=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],R=g?new Uint16Array(P):P,j=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],H=g?new Uint8Array(j):j,N=new(g?Uint8Array:Array)(288);for(I=0,S=N.length;S>I;++I)N[I]=143>=I?8:255>=I?9:279>=I?7:8;var q,_,L=n(N),W=new(g?Uint8Array:Array)(30);for(q=0,_=W.length;_>q;++q)W[q]=5;var B=n(W);p=i.prototype,p.q=function(e,t){var n=this.b,i=this.a;this.C=e;for(var o,s,l,d,c=n.length-258;256!==(o=r(this,e));)if(256>o)i>=c&&(this.a=i,n=this.e(),i=this.a),n[i++]=o;else for(s=o-257,d=D[s],0<E[s]&&(d+=a(this,E[s])),o=r(this,t),l=R[o],0<H[o]&&(l+=a(this,H[o])),i>=c&&(this.a=i,n=this.e(),i=this.a);d--;)n[i]=n[i++-l];for(;8<=this.d;)this.d-=8,this.c--;this.a=i},p.W=function(e,t){var n=this.b,i=this.a;this.C=e;for(var o,s,l,d,c=n.length;256!==(o=r(this,e));)if(256>o)i>=c&&(n=this.e(),c=n.length),n[i++]=o;else for(s=o-257,d=D[s],0<E[s]&&(d+=a(this,E[s])),o=r(this,t),l=R[o],0<H[o]&&(l+=a(this,H[o])),i+d>c&&(n=this.e(),c=n.length);d--;)n[i]=n[i++-l];for(;8<=this.d;)this.d-=8,this.c--;this.a=i},p.e=function(){var e,t,n=new(g?Uint8Array:Array)(this.a-32768),i=this.a-32768,a=this.b;if(g)n.set(a.subarray(32768,n.length));else for(e=0,t=n.length;t>e;++e)n[e]=a[e+32768];if(this.l.push(n),this.t+=n.length,g)a.set(a.subarray(i,i+32768));else for(e=0;32768>e;++e)a[e]=a[i+e];return this.a=32768,a},p.X=function(e){var t,n,i,a,r=this.input.length/this.c+1|0,o=this.input,s=this.b;return e&&("number"==typeof e.H&&(r=e.H),"number"==typeof e.Q&&(r+=e.Q)),2>r?(n=(o.length-this.c)/this.C[2],a=258*(n/2)|0,i=a<s.length?s.length+a:s.length<<1):i=s.length*r,g?(t=new Uint8Array(i),t.set(s)):t=s,this.b=t},p.B=function(){var e,t,n,i,a,r=0,o=this.b,s=this.l,l=new(g?Uint8Array:Array)(this.t+(this.a-32768));if(0===s.length)return g?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);for(t=0,n=s.length;n>t;++t)for(e=s[t],i=0,a=e.length;a>i;++i)l[r++]=e[i];for(t=32768,n=this.a;n>t;++t)l[r++]=o[t];return this.l=[],this.buffer=l},p.S=function(){var e,t=this.a;return g?this.L?(e=new Uint8Array(t),e.set(this.b.subarray(0,t))):e=this.b.subarray(0,t):(this.b.length>t&&(this.b.length=t),e=this.b),this.buffer=e},s.prototype.M=function(e){this.j=e},s.prototype.s=function(e){var t=65535&e[2]|2;return t*(1^t)>>8&255},s.prototype.k=function(e,t){e[0]=(x[255&(e[0]^t)]^e[0]>>>8)>>>0,e[1]=(6681*(20173*(e[1]+(255&e[0]))>>>0)>>>0)+1>>>0,e[2]=(x[255&(e[2]^e[1]>>>24)]^e[2]>>>8)>>>0},s.prototype.U=function(e){var t,n,i=[305419896,591751049,878082192];for(g&&(i=new Uint32Array(i)),t=0,n=e.length;n>t;++t)this.k(i,255&e[t]);return i};var V={P:0,N:8},$=[80,75,1,2],K=[80,75,3,4],G=[80,75,5,6];d.prototype.parse=function(){var t=this.input,n=this.offset;(t[n++]!==$[0]||t[n++]!==$[1]||t[n++]!==$[2]||t[n++]!==$[3])&&e(Error("invalid file header signature")),this.version=t[n++],this.ja=t[n++],this.$=t[n++]|t[n++]<<8,this.I=t[n++]|t[n++]<<8,this.A=t[n++]|t[n++]<<8,this.time=t[n++]|t[n++]<<8,this.V=t[n++]|t[n++]<<8,this.p=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.z=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.J=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.h=t[n++]|t[n++]<<8,this.g=t[n++]|t[n++]<<8,this.F=t[n++]|t[n++]<<8,this.fa=t[n++]|t[n++]<<8,this.ha=t[n++]|t[n++]<<8,this.ga=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24,this.aa=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.filename=String.fromCharCode.apply(null,g?t.subarray(n,n+=this.h):t.slice(n,n+=this.h)),this.Y=g?t.subarray(n,n+=this.g):t.slice(n,n+=this.g),this.v=g?t.subarray(n,n+this.F):t.slice(n,n+this.F),this.length=n-this.offset};var J={O:1,da:8,ea:2048};c.prototype.parse=function(){var t=this.input,n=this.offset;(t[n++]!==K[0]||t[n++]!==K[1]||t[n++]!==K[2]||t[n++]!==K[3])&&e(Error("invalid local file header signature")),this.$=t[n++]|t[n++]<<8,this.I=t[n++]|t[n++]<<8,this.A=t[n++]|t[n++]<<8,this.time=t[n++]|t[n++]<<8,this.V=t[n++]|t[n++]<<8,this.p=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.z=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.J=(t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24)>>>0,this.h=t[n++]|t[n++]<<8,this.g=t[n++]|t[n++]<<8,this.filename=String.fromCharCode.apply(null,g?t.subarray(n,n+=this.h):t.slice(n,n+=this.h)),this.Y=g?t.subarray(n,n+=this.g):t.slice(n,n+=this.g),this.length=n-this.offset},p=l.prototype,p.Z=function(){var e,t,n,i=[];for(this.i||u(this),n=this.i,e=0,t=n.length;t>e;++e)i[e]=n[e].filename;return i},p.r=function(t,n){var a;this.G||u(this),a=this.G[t],a===f&&e(Error(t+" not found"));var r;r=n||{};var o,s,l,d,p,m,v,b,y=this.input,w=this.i;if(w||u(this),w[a]===f&&e(Error("wrong index")),s=w[a].aa,o=new c(this.input,s),o.parse(),s+=o.length,l=o.z,0!==(o.I&J.O)){for(!r.password&&!this.j&&e(Error("please set password")),m=this.T(r.password||this.j),v=s,b=s+12;b>v;++v)h(this,m,y[v]);for(s+=12,l-=12,v=s,b=s+l;b>v;++v)y[v]=h(this,m,y[v])}switch(o.A){case V.P:d=g?this.input.subarray(s,s+l):this.input.slice(s,s+l);break;case V.N:d=new i(this.input,{index:s,bufferSize:o.J}).r();break;default:e(Error("unknown compression type"))}if(this.ca){var k,C=f,T="number"==typeof C?C:C=0,z=d.length;for(k=-1,T=7&z;T--;++C)k=k>>>8^x[255&(k^d[C])];for(T=z>>3;T--;C+=8)k=k>>>8^x[255&(k^d[C])],k=k>>>8^x[255&(k^d[C+1])],k=k>>>8^x[255&(k^d[C+2])],k=k>>>8^x[255&(k^d[C+3])],k=k>>>8^x[255&(k^d[C+4])],k=k>>>8^x[255&(k^d[C+5])],k=k>>>8^x[255&(k^d[C+6])],k=k>>>8^x[255&(k^d[C+7])];p=(4294967295^k)>>>0,o.p!==p&&e(Error("wrong crc: file=0x"+o.p.toString(16)+", data=0x"+p.toString(16)))}return d},p.M=function(e){this.j=e},p.k=s.prototype.k,p.T=s.prototype.U,p.s=s.prototype.s,t("Zlib.Unzip",l),t("Zlib.Unzip.prototype.decompress",l.prototype.r),t("Zlib.Unzip.prototype.getFilenames",l.prototype.Z),t("Zlib.Unzip.prototype.setPassword",l.prototype.M)}).call(this),function(){"use strict";function e(e){throw e}function t(e,t){var n=e.split("."),i=u;!(n[0]in i)&&i.execScript&&i.execScript("var "+n[0]);for(var a;n.length&&(a=n.shift());)n.length||t===c?i=i[a]?i[a]:i[a]={}:i[a]=t}function n(e,t,n){var i,a="number"==typeof t?t:t=0,r="number"==typeof n?n:e.length;for(i=-1,a=7&r;a--;++t)i=i>>>8^v[255&(i^e[t])];for(a=r>>3;a--;t+=8)i=i>>>8^v[255&(i^e[t])],i=i>>>8^v[255&(i^e[t+1])],i=i>>>8^v[255&(i^e[t+2])],i=i>>>8^v[255&(i^e[t+3])],i=i>>>8^v[255&(i^e[t+4])],i=i>>>8^v[255&(i^e[t+5])],i=i>>>8^v[255&(i^e[t+6])],i=i>>>8^v[255&(i^e[t+7])];return(4294967295^i)>>>0}function i(){}function a(e){var t,n,i,a,r,o,s,l,d,c,u=e.length,p=0,f=Number.POSITIVE_INFINITY;for(l=0;u>l;++l)e[l]>p&&(p=e[l]),e[l]<f&&(f=e[l]);for(t=1<<p,n=new(h?Uint32Array:Array)(t),i=1,a=0,r=2;p>=i;){for(l=0;u>l;++l)if(e[l]===i){for(o=0,s=a,d=0;i>d;++d)o=o<<1|1&s,s>>=1;for(c=i<<16|l,d=o;t>d;d+=r)n[d]=c;++a}++i,a<<=1,r<<=1}return[n,p,f]}function r(t,n){switch(this.i=[],this.j=32768,this.d=this.f=this.c=this.n=0,this.input=h?new Uint8Array(t):t,this.o=!1,this.k=x,this.z=!1,!n&&(n={})||(n.index&&(this.c=n.index),n.bufferSize&&(this.j=n.bufferSize),n.bufferType&&(this.k=n.bufferType),n.resize&&(this.z=n.resize)),this.k){case k:this.a=32768,this.b=new(h?Uint8Array:Array)(32768+this.j+258);break;case x:this.a=0,this.b=new(h?Uint8Array:Array)(this.j),this.e=this.F,this.q=this.B,this.l=this.D;break;default:e(Error("invalid inflate mode"))}}function o(t,n){for(var i,a=t.f,r=t.d,o=t.input,s=t.c,l=o.length;n>r;)s>=l&&e(Error("input buffer is broken")),a|=o[s++]<<r,r+=8;return i=a&(1<<n)-1,t.f=a>>>n,t.d=r-n,t.c=s,i}function s(e,t){for(var n,i,a=e.f,r=e.d,o=e.input,s=e.c,l=o.length,d=t[0],c=t[1];c>r&&!(s>=l);)a|=o[s++]<<r,r+=8;return n=d[a&(1<<c)-1],i=n>>>16,e.f=a>>i,e.d=r-i,e.c=s,65535&n}function l(e){function t(e,t,n){var i,a,r,l=this.w;for(r=0;e>r;)switch(i=s(this,t)){case 16:for(a=3+o(this,2);a--;)n[r++]=l;break;case 17:for(a=3+o(this,3);a--;)n[r++]=0;l=0;break;case 18:for(a=11+o(this,7);a--;)n[r++]=0;l=0;break;default:l=n[r++]=i}return this.w=l,n}var n,i,r,l,d=o(e,5)+257,c=o(e,5)+1,u=o(e,4)+4,p=new(h?Uint8Array:Array)(A.length);for(l=0;u>l;++l)p[A[l]]=o(e,3);if(!h)for(l=u,u=p.length;u>l;++l)p[A[l]]=0;n=a(p),i=new(h?Uint8Array:Array)(d),r=new(h?Uint8Array:Array)(c),e.w=0,e.l(a(t.call(e,d,n,i)),a(t.call(e,c,n,r)))}function d(e){this.input=e,this.c=0,this.m=[],this.s=!1}var c=void 0,u=this,h="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;new(h?Uint8Array:Array)(256);var p;for(p=0;256>p;++p)for(var f=p,m=7,f=f>>>1;f;f>>>=1)--m;var g=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],v=h?new Uint32Array(g):g;i.prototype.getName=function(){return this.name},i.prototype.getData=function(){return this.data},i.prototype.H=function(){return this.I},t("Zlib.GunzipMember",i),t("Zlib.GunzipMember.prototype.getName",i.prototype.getName),t("Zlib.GunzipMember.prototype.getData",i.prototype.getData),t("Zlib.GunzipMember.prototype.getMtime",i.prototype.H);var b,y=[];for(b=0;288>b;b++)switch(!0){case 143>=b:y.push([b+48,8]);break;case 255>=b:y.push([b-144+400,9]);break;case 279>=b:y.push([b-256+0,7]);break;case 287>=b:y.push([b-280+192,8]);break;default:e("invalid literal: "+b)}var w=function(){function t(t){switch(!0){case 3===t:return[257,t-3,0];case 4===t:return[258,t-4,0];case 5===t:return[259,t-5,0];case 6===t:return[260,t-6,0];case 7===t:return[261,t-7,0];case 8===t:return[262,t-8,0];case 9===t:return[263,t-9,0];case 10===t:return[264,t-10,0];case 12>=t:return[265,t-11,1];case 14>=t:return[266,t-13,1];case 16>=t:return[267,t-15,1];case 18>=t:return[268,t-17,1];case 22>=t:return[269,t-19,2];case 26>=t:return[270,t-23,2];case 30>=t:return[271,t-27,2];case 34>=t:return[272,t-31,2];case 42>=t:return[273,t-35,3];case 50>=t:return[274,t-43,3];case 58>=t:return[275,t-51,3];case 66>=t:return[276,t-59,3];case 82>=t:return[277,t-67,4];case 98>=t:return[278,t-83,4];case 114>=t:return[279,t-99,4];case 130>=t:return[280,t-115,4];case 162>=t:return[281,t-131,5];case 194>=t:return[282,t-163,5];case 226>=t:return[283,t-195,5];case 257>=t:return[284,t-227,5];case 258===t:return[285,t-258,0];default:e("invalid length: "+t)}}var n,i,a=[];for(n=3;258>=n;n++)i=t(n),a[n]=i[2]<<24|i[1]<<16|i[0];return a}();h&&new Uint32Array(w);var k=0,x=1;r.prototype.g=function(){for(;!this.o;){var t=o(this,3);switch(1&t&&(this.o=!0),t>>>=1){case 0:var n=this.input,i=this.c,a=this.b,r=this.a,s=n.length,d=c,u=c,p=a.length,f=c;switch(this.d=this.f=0,i+1>=s&&e(Error("invalid uncompressed block header: LEN")),d=n[i++]|n[i++]<<8,i+1>=s&&e(Error("invalid uncompressed block header: NLEN")),u=n[i++]|n[i++]<<8,d===~u&&e(Error("invalid uncompressed block header: length verify")),i+d>n.length&&e(Error("input buffer is broken")),this.k){case k:for(;r+d>a.length;){if(f=p-r,d-=f,h)a.set(n.subarray(i,i+f),r),r+=f,i+=f;else for(;f--;)a[r++]=n[i++];this.a=r,a=this.e(),r=this.a}break;case x:for(;r+d>a.length;)a=this.e({t:2});break;default:e(Error("invalid inflate mode"))}if(h)a.set(n.subarray(i,i+d),r),r+=d,i+=d;else for(;d--;)a[r++]=n[i++];this.c=i,this.a=r,this.b=a;break;case 1:this.l(H,q);break;case 2:l(this);break;default:e(Error("unknown BTYPE: "+t))}}return this.q()};var C,T,z=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],A=h?new Uint16Array(z):z,I=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],S=h?new Uint16Array(I):I,U=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],M=h?new Uint8Array(U):U,O=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],D=h?new Uint16Array(O):O,F=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],E=h?new Uint8Array(F):F,P=new(h?Uint8Array:Array)(288);for(C=0,T=P.length;T>C;++C)P[C]=143>=C?8:255>=C?9:279>=C?7:8;var R,j,H=a(P),N=new(h?Uint8Array:Array)(30);for(R=0,j=N.length;j>R;++R)N[R]=5;var q=a(N);r.prototype.l=function(e,t){var n=this.b,i=this.a;this.r=e;for(var a,r,l,d,c=n.length-258;256!==(a=s(this,e));)if(256>a)i>=c&&(this.a=i,n=this.e(),i=this.a),n[i++]=a;else for(r=a-257,d=S[r],0<M[r]&&(d+=o(this,M[r])),a=s(this,t),l=D[a],0<E[a]&&(l+=o(this,E[a])),i>=c&&(this.a=i,n=this.e(),i=this.a);d--;)n[i]=n[i++-l];for(;8<=this.d;)this.d-=8,this.c--;this.a=i},r.prototype.D=function(e,t){var n=this.b,i=this.a;this.r=e;for(var a,r,l,d,c=n.length;256!==(a=s(this,e));)if(256>a)i>=c&&(n=this.e(),c=n.length),n[i++]=a;else for(r=a-257,d=S[r],0<M[r]&&(d+=o(this,M[r])),a=s(this,t),l=D[a],0<E[a]&&(l+=o(this,E[a])),i+d>c&&(n=this.e(),c=n.length);d--;)n[i]=n[i++-l];for(;8<=this.d;)this.d-=8,this.c--;this.a=i},r.prototype.e=function(){var e,t,n=new(h?Uint8Array:Array)(this.a-32768),i=this.a-32768,a=this.b;if(h)n.set(a.subarray(32768,n.length));else for(e=0,t=n.length;t>e;++e)n[e]=a[e+32768];if(this.i.push(n),this.n+=n.length,h)a.set(a.subarray(i,i+32768));else for(e=0;32768>e;++e)a[e]=a[i+e];return this.a=32768,a},r.prototype.F=function(e){var t,n,i,a,r=this.input.length/this.c+1|0,o=this.input,s=this.b;return e&&("number"==typeof e.t&&(r=e.t),"number"==typeof e.A&&(r+=e.A)),2>r?(n=(o.length-this.c)/this.r[2],a=258*(n/2)|0,i=a<s.length?s.length+a:s.length<<1):i=s.length*r,h?(t=new Uint8Array(i),t.set(s)):t=s,this.b=t},r.prototype.q=function(){var e,t,n,i,a,r=0,o=this.b,s=this.i,l=new(h?Uint8Array:Array)(this.n+(this.a-32768));if(0===s.length)return h?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);for(t=0,n=s.length;n>t;++t)for(e=s[t],i=0,a=e.length;a>i;++i)l[r++]=e[i];for(t=32768,n=this.a;n>t;++t)l[r++]=o[t];return this.i=[],this.buffer=l},r.prototype.B=function(){var e,t=this.a;return h?this.z?(e=new Uint8Array(t),e.set(this.b.subarray(0,t))):e=this.b.subarray(0,t):(this.b.length>t&&(this.b.length=t),e=this.b),this.buffer=e},d.prototype.G=function(){return this.s||this.g(),this.m.slice()},d.prototype.g=function(){for(var t=this.input.length;this.c<t;){var a=new i,o=c,s=c,l=c,d=c,u=c,p=c,f=c,m=c,g=c,v=this.input,b=this.c;switch(a.u=v[b++],a.v=v[b++],(31!==a.u||139!==a.v)&&e(Error("invalid file signature:"+a.u+","+a.v)),a.p=v[b++],a.p){case 8:break;default:e(Error("unknown compression method: "+a.p))}if(a.h=v[b++],m=v[b++]|v[b++]<<8|v[b++]<<16|v[b++]<<24,a.I=new Date(1e3*m),a.O=v[b++],a.N=v[b++],0<(4&a.h)&&(a.J=v[b++]|v[b++]<<8,b+=a.J),0<(8&a.h)){for(f=[],p=0;0<(u=v[b++]);)f[p++]=String.fromCharCode(u);a.name=f.join("")}if(0<(16&a.h)){for(f=[],p=0;0<(u=v[b++]);)f[p++]=String.fromCharCode(u);a.K=f.join("")}0<(2&a.h)&&(a.C=65535&n(v,0,b),a.C!==(v[b++]|v[b++]<<8)&&e(Error("invalid header crc16"))),o=v[v.length-4]|v[v.length-3]<<8|v[v.length-2]<<16|v[v.length-1]<<24,v.length-b-4-4<512*o&&(d=o),s=new r(v,{index:b,bufferSize:d}),a.data=l=s.g(),b=s.c,a.L=g=(v[b++]|v[b++]<<8|v[b++]<<16|v[b++]<<24)>>>0,n(l,c,c)!==g&&e(Error("invalid CRC-32 checksum: 0x"+n(l,c,c).toString(16)+" / 0x"+g.toString(16))),a.M=o=(v[b++]|v[b++]<<8|v[b++]<<16|v[b++]<<24)>>>0,(4294967295&l.length)!==o&&e(Error("invalid input size: "+(4294967295&l.length)+" / "+o)),this.m.push(a),this.c=b}this.s=!0;var y,w,k,x=this.m,C=0,T=0;for(y=0,w=x.length;w>y;++y)T+=x[y].data.length;if(h)for(k=new Uint8Array(T),y=0;w>y;++y)k.set(x[y].data,C),C+=x[y].data.length;else{for(k=[],y=0;w>y;++y)k[y]=x[y].data;k=Array.prototype.concat.apply([],k)}return k},t("Zlib.Gunzip",d),t("Zlib.Gunzip.prototype.decompress",d.prototype.g),t("Zlib.Gunzip.prototype.getMembers",d.prototype.G)}.call(this)}).bind(i)()}catch(a){}return(i.prototype.commands.reload=function(){var t=this,n=!1;this.alwaysEnabled=!0,this.updateOnSelect=!0,this.shortcuts=[{pattern:"ctrl+shift+r f5"}],this.getstate=function(){return 0},this.init=function(){this.fm.bind("search searchend",function(e){n="search"==e.type})},this.fm.bind("contextmenu",function(n){var i=t.fm;i.options.sync>=1e3&&(t.extra={icon:"accept",node:e("<span/>").attr({title:i.i18n("autoSync")}).on("click touchstart",function(t){"touchstart"===t.type&&t.originalEvent.touches.length>1||(t.stopPropagation(),t.preventDefault(),e(this).parent().toggleClass("ui-state-disabled",i.options.syncStart).parent().removeClass("ui-state-hover"),i.options.syncStart=!i.options.syncStart,i.autoSync(i.options.syncStart?null:"stop"))}).on("ready",function(){e(this).parent().toggleClass("ui-state-disabled",!i.options.syncStart).css("pointer-events","auto")})})}),this.exec=function(){var t=this.fm;if(!n){var i=t.sync(),a=setTimeout(function(){t.notify({type:"reload",cnt:1,hideCnt:!0}),i.always(function(){t.notify({type:"reload",cnt:-1})})},t.notifyDelay);return i.always(function(){clearTimeout(a),t.trigger("reload")})}e("div.elfinder-toolbar > div."+t.res("class","searchbtn")+" > span.ui-icon-search").click()}}).prototype={forceLoad:!0},i.prototype.commands.rename=function(){this.shortcuts=[{pattern:"f2"+("mac"==this.fm.OS?" enter":"")}],this.getstate=function(e){var e=this.files(e);return this._disabled||1!=e.length||!e[0].phash||e[0].locked?-1:0},this.exec=function(t,n){var i,a=this.fm,r=a.getUI("cwd"),o=t||(a.selected().length?a.selected():!1)||[a.cwd().hash],s=o.length,l=a.file(o.shift()),d=".elfinder-cwd-filename",n=n||{},c=a.cwd().hash==l.hash,u=n._currentType?n._currentType:c?"navbar":"files",h="navbar"===u,p=e("#"+a[h?"navHash2Id":"cwdHash2Id"](l.hash)),f="files"===u&&"list"!=a.storage("view"),m=function(){setTimeout(function(){y&&y.blur()},50)},g=function(){C.is(":hidden")||C.addClass("ui-front").elfinderoverlay("hide").off("click",T),x.removeClass("ui-front").css("position","").off("unselect."+a.namespace,m),f?k.css("max-height",""):h||x.css("width","").parent("td").css("overflow","")},v=e.Deferred().done(function(e){c&&a.exec("open",e.added[0].hash)}).fail(function(e){var t=y.parent(),n=a.escape(l.i18||l.name);f&&(n=n.replace(/([_.])/g,"&#8203;$1")),h?y.replaceWith(n):t.length?(y.remove(),t.html(n)):(p.find(d).html(n),setTimeout(function(){r.find("#"+a.cwdHash2Id(l.hash)).click()},50)),e&&a.error(e)}).always(function(){g(),a.unbind("resize",z),a.enable()}),b=function(){var t=e.trim(y.val()),n=(y.parent(),!0);if(!A&&x.length){if(y.off("blur"),y[0].setSelectionRange&&y[0].setSelectionRange(0,0),t==l.name)return v.reject();if(a.options.validName&&a.options.validName.test)try{n=a.options.validName.test(t)}catch(i){n=!1}if(!t||".."===t||!n)return A=!0,a.error("errInvName",{modal:!0,close:w}),!1;if(a.fileByName(t,l.phash))return A=!0,a.error(["errExists",t],{modal:!0,close:w}),!1;g(),(h?y:k).html(a.escape(t)),a.lockfiles({files:[l.hash]}),a.request({data:{cmd:"rename",target:l.hash,name:t},notify:{type:"rename",cnt:1}}).fail(function(t){v.reject(),t&&e.isArray(t)&&"errRename"===t[0]||a.sync()}).done(function(e){if(v.resolve(e),!h&&e&&e.added&&e.added[0]){var t=a.findCwdNodes(e.added);t.length&&t.trigger("scrolltoview")}}).always(function(){a.unlockfiles({files:[l.hash]})})}},y=e(f?"<textarea/>":'<input type="text"/>').on("keyup text",function(){f?(this.style.height="1px",this.style.height=this.scrollHeight+"px"):i&&(this.style.width=i+"px",this.scrollWidth>i&&(this.style.width=this.scrollWidth+10+"px"))}).on("keydown",function(t){t.stopImmediatePropagation(),t.keyCode==e.ui.keyCode.ESCAPE?v.reject():t.keyCode==e.ui.keyCode.ENTER&&(t.preventDefault(),y.blur())}).on("mousedown click dblclick",function(e){e.stopPropagation(),"dblclick"===e.type&&e.preventDefault()}).on("blur",b),w=function(){var e=y.val().replace(/\.((tar\.(gz|bz|bz2|z|lzo))|cpio\.gz|ps\.gz|xcf\.(gz|bz2)|[a-z0-9]{1,4})$/gi,"");A&&(A=!1,y.on("blur",b)),a.UA.Mobile&&C.on("click",T).removeClass("ui-front").elfinderoverlay("show"),y.select().focus(),y[0].setSelectionRange&&y[0].setSelectionRange(0,e.length)},k=h?p.contents().filter(function(){return 3==this.nodeType&&e(this).parent().attr("id")===a.navHash2Id(l.hash)}):p.find(d),x=k.parent(),C=a.getUI("overlay"),T=function(e){A||(e.stopPropagation(),v.reject())},z=function(){p.trigger("scrolltoview")},A=!1;return x.addClass("ui-front").css("position","relative").on("unselect."+a.namespace,m),a.bind("resize",z),h?k.replaceWith(y.val(l.name)):(f?k.css("max-height","none"):h||(i=x.width(),x.width(i-15).parent("td").css("overflow","visible")),k.empty().append(y.val(l.name))),s>1?v.reject():l&&k.length?l.locked?v.reject(["errLocked",l.name]):(a.one("select",function(){y.parent().length&&l&&-1===e.inArray(l.hash,a.selected())&&y.blur()}),y.trigger("keyup"),w(),v):v.reject("errCmdParams",this.title)}},i.prototype.commands.resize=function(){this.updateOnSelect=!1,this.getstate=function(){var e=this.fm.selectedFiles();return!this._disabled&&1==e.length&&e[0].read&&e[0].write&&-1!==e[0].mime.indexOf("image/")?0:-1},this.resizeRequest=function(t,n,i){var a=this.fm,n=n||a.file(t.target),r=n?a.openUrl(n.hash):null,o=n?n.tmb:null,s=a.isCommandEnabled("resize",t.target);if(s&&(!n||n&&n.read&&n.write&&-1!==n.mime.indexOf("image/")))return a.request({data:e.extend(t,{cmd:"resize"}),notify:{type:"resize",cnt:1},prepare:function(e){var t;return e&&(e.added&&e.added.length&&e.added[0].tmb?t=e.added[0]:e.changed&&e.changed.length&&e.changed[0].tmb&&(t=e.changed[0]),
t&&(n=t,r=a.openUrl(n.hash),n.tmb&&"1"!=n.tmb&&n.tmb===o))?void(n.tmb=""):void(o="")}}).fail(function(e){i&&i.reject(e)}).done(function(){var e="1"!=n.url?a.url(n.hash):"";o&&a.one("resizedone",function(){a.reloadContents(a.tmb(n).url).done(function(){a.trigger("tmbreload",{files:[{hash:n.hash,tmb:o}]})})}),a.reloadContents(r),e&&e!==r&&a.reloadContents(e),i&&i.resolve()});var l;return l=n?-1===n.mime.indexOf("image/")?["errResize",n.name,"errUsupportType"]:["errResize",n.name,"errPerm"]:["errResize",t.target,"errPerm"],i?i.reject(l):a.error(l),e.Deferred().reject(l)},this.exec=function(t){var n,i,a=this,r=this.fm,o=this.files(t),s=e.Deferred(),l=r.api>1,d=650,c=r.getUI(),u=e().controlgroup?"controlgroup":"buttonset",h="undefind"==typeof this.options.grid8px||"disable"!==this.options.grid8px,p=function(t,n){var i,o,p,f,m="image/jpeg"===t.mime,g=e('<div class="elfinder-dialog-resize '+r.res("class","editing")+'"/>'),v='<input type="text" size="5"/>',b='<div class="elfinder-resize-row"/>',y='<div class="elfinder-resize-label"/>',w=e('<div class="elfinder-resize-control"/>').on("focus","input[type=text]",function(){e(this).select()}),k=e('<div class="elfinder-resize-preview"/>').on("touchmove",function(e){e.stopPropagation(),e.preventDefault()}),x=e('<div class="elfinder-resize-spinner">'+r.i18n("ntfloadimg")+"</div>"),C=e('<div class="elfinder-resize-handle touch-punch"/>'),T=e('<div class="elfinder-resize-handle touch-punch"/>'),z=e('<div class="elfinder-resize-uiresize"/>'),A=e('<div class="elfinder-resize-uicrop"/>'),I=e('<div class="elfinder-resize-rotate"/>'),S=e("<button/>").attr("title",r.i18n("rotate-cw")).append(e('<span class="elfinder-button-icon elfinder-button-icon-rotate-l"/>')),U=e("<button/>").attr("title",r.i18n("rotate-ccw")).append(e('<span class="elfinder-button-icon elfinder-button-icon-rotate-r"/>')),M=e("<span />"),O=e('<button class="elfinder-resize-reset">').text(r.i18n("reset")).on("click",function(){Ce()}).button({icons:{primary:"ui-icon-arrowrefresh-1-n"},text:!1}),D=e('<div class="elfinder-resize-type"/>').append('<input class="" type="radio" name="type" id="'+n+'-resize" value="resize" checked="checked" /><label for="'+n+'-resize">'+r.i18n("resize")+"</label>",'<input class="api2" type="radio" name="type" id="'+n+'-crop" value="crop" /><label class="api2" for="'+n+'-crop">'+r.i18n("crop")+"</label>",'<input class="api2" type="radio" name="type" id="'+n+'-rotate" value="rotate" /><label class="api2" for="'+n+'-rotate">'+r.i18n("rotate")+"</label>"),F="resize",E=(D[u]()[u]("disable").find("input").change(function(){F=e(this).val(),Ce(),Ie(!0),Se(!0),Ue(!0),"resize"==F?(z.show(),I.hide(),A.hide(),Ie(),m&&he.insertAfter(z.find(".elfinder-resize-grid8"))):"crop"==F?(I.hide(),z.hide(),A.show(),Se(),m&&he.insertAfter(A.find(".elfinder-resize-grid8"))):"rotate"==F&&(z.hide(),A.hide(),I.show(),Ue())}),e(v).change(function(){var e=parseInt(E.val()),t=parseInt(ne?Math.round(e/Z):P.val());e>0&&t>0&&(Te.updateView(e,t),P.val(t))})),P=e(v).change(function(){var e=parseInt(P.val()),t=parseInt(ne?Math.round(e*Z):E.val());t>0&&e>0&&(Te.updateView(t,e),E.val(t))}),R=e(v).change(function(){ze.updateView()}),j=e(v).change(function(){ze.updateView()}),H=e(v).change(function(){ze.updateView("w")}),N=e(v).change(function(){ze.updateView("h")}),q=m&&l?e(v).val(r.option("jpgQuality")).addClass("quality").on("blur",function(){var e=Math.min(100,Math.max(1,parseInt(this.value)));g.find("input.quality").val(e)}):null,_=e('<input type="text" size="3" maxlength="3" value="0" />').change(function(){Ae.update()}),L=e('<div class="elfinder-resize-rotate-slider touch-punch"/>').slider({min:0,max:360,value:_.val(),animate:!0,change:function(e,t){t.value!=L.slider("value")&&Ae.update(t.value)},slide:function(e,t){Ae.update(t.value,!1)}}).find(".ui-slider-handle").addClass("elfinder-tabstop").off("keydown").on("keydown",function(t){t.keyCode!=e.ui.keyCode.LEFT&&t.keyCode!=e.ui.keyCode.RIGHT||(t.stopPropagation(),t.preventDefault(),Ae.update(Number(_.val())+(t.keyCode==e.ui.keyCode.RIGHT?1:-1),!1))}).end(),W={},B=function(e){var t,n,i,a,r,o,s;try{t=W[Math.round(e.offsetX)][Math.round(e.offsetY)]}catch(e){}t&&(n=t[0],i=t[1],a=t[2],r=t[3],o=t[4],s=t[5],$(n,i,a,"click"===e.type))},V=function(t){$(e(this).css("backgroundColor"),"","","click"===t.type)},$=function(t,n,i,a){var r,o,s;"string"==typeof t&&(n="",t&&(r=e("<span>").css("backgroundColor",t).css("backgroundColor"))&&(o=r.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i))&&(t=Number(o[1]),n=Number(o[2]),i=Number(o[3]))),s=""===n?t:"#"+K(t,n,i),Y.val(s).css({backgroundColor:s,backgroundImage:"none",color:384>t+n+i?"#fff":"#000"}),k.css("backgroundColor",s),a&&(ke.off(".picker").removeClass("elfinder-resize-picking"),X.off(".picker").removeClass("elfinder-resize-picking"))},K=function(t,n,i){return e.map([t,n,i],function(e){return("0"+parseInt(e).toString(16)).slice(-2)}).join("")},G=e("<button>").text(r.i18n("colorPicker")).on("click",function(){ke.on("mousemove.picker click.picker",B).addClass("elfinder-resize-picking"),X.on("mousemove.picker click.picker","span",V).addClass("elfinder-resize-picking")}).button({icons:{primary:"ui-icon-pin-s"},text:!1}),J=e("<button>").text(r.i18n("reset")).on("click",function(){$("","","",!0)}).button({icons:{primary:"ui-icon-arrowrefresh-1-n"},text:!1}),Y=e('<input class="elfinder-resize-bg" type="text">').on("focus",function(){e(this).attr("style","")}).on("blur",function(){$(e(this).val())}),X=e('<div class="elfinder-resize-pallet">').on("click","span",function(){$(e(this).css("backgroundColor"))}),Z=1,Q=1,ee=0,te=0,ne=!0,ie=!1,ae=0,re=0,oe=0,se=0,le=0,de=m?h:!1,ce=e("<button>").html(r.i18n("aspectRatio")).on("click",function(){ne=!ne,ce.button("option",{icons:{primary:ne?"ui-icon-locked":"ui-icon-unlocked"}}),Te.fixHeight(),C.resizable("option","aspectRatio",ne).data("uiResizable")._aspectRatio=ne}).button({icons:{primary:ne?"ui-icon-locked":"ui-icon-unlocked"},text:!1}),ue=e("<button>").html(r.i18n("aspectRatio")).on("click",function(){ie=!ie,ue.button("option",{icons:{primary:ie?"ui-icon-locked":"ui-icon-unlocked"}}),T.resizable("option","aspectRatio",ie).data("uiResizable")._aspectRatio=ie}).button({icons:{primary:ie?"ui-icon-locked":"ui-icon-unlocked"},text:!1}),he=e("<button>").html(r.i18n(de?"enabled":"disabled")).toggleClass("ui-state-active",de).on("click",function(){de=!de,he.html(r.i18n(de?"enabled":"disabled")).toggleClass("ui-state-active",de),de&&(E.val(xe(E.val())),P.val(xe(P.val())),H.val(xe(H.val())),N.val(xe(N.val())),R.val(xe(R.val())),j.val(xe(j.val())),z.is(":visible")?Te.updateView(E.val(),P.val()):A.is(":visible")&&ze.updateView())}).button(),pe=function(){var e;e=Math.min(ae,re)/Math.sqrt(Math.pow(ee,2)+Math.pow(te,2)),oe=Math.ceil(ee*e),se=Math.ceil(te*e),ke.width(oe).height(se).css("margin-top",(re-se)/2+"px").css("margin-left",(ae-oe)/2+"px"),ke.is(":visible")&&Y.is(":visible")&&("image/png"!==t.mime?(k.css("backgroundColor",Y.val()),setTimeout(function(){i&&i.width!==oe&&me()},0)):(Y.parent().hide(),X.hide()))},fe=function(){Te.updateView(ee,te),pe(),be.width(ve.width()).height(ve.height()),ye.width(ve.width()).height(ve.height()),ze.updateView()},me=function(){if(o){var t,n,a,r,s,l,d,c,u,h,p,f,m,g,v,b,y,w,k,x={},C=[],T=function(e,t,n){var i,a,r,o=Math.max(Math.max(e,t),n),s=Math.min(Math.min(e,t),n);return o===s?i=0:e===o?i=((t-n)/(o-s)*60+360)%360:t===o?i=(n-e)/(o-s)*60+120:n===o&&(i=(e-t)/(o-s)*60+240),a=(o-s)/o,r=(.3*e+.59*t+.11*n)/255,[i,a,r,"hsl"]};e:try{n=i.width=ke.width(),a=i.height=ke.height(),m=n/ee,o.scale(m,m),o.drawImage(ke.get(0),0,0),f=o.getImageData(0,0,n,a).data,g=.1*n,v=.9*n,b=.1*a,y=.9*a;for(var z=0;a-1>z;z++)for(var A=0;n-1>A;A++){if(t=4*A+z*n*4,r=f[t],s=f[t+1],l=f[t+2],d=f[t+3],255!==d){Y.parent().hide(),X.hide();break e}h=T(r,s,l),p=Math.round(h[0]),c=Math.round(100*h[1]),u=Math.round(100*h[2]),W[A]||(W[A]={}),W[A][z]=[r,s,l,p,c,u],(g>A||A>v)&&(b>z||z>y)&&(w=r+","+s+","+l,x[w]?++x[w]:x[w]=1)}X.children(":first").length||(k=1,e.each(x,function(e,t){C.push({c:e,v:t})}),e.each(C.sort(function(e,t){return e.v>t.v?-1:1}),function(){return this.v<2||k>10?!1:(X.append(e('<span style="width:20px;height:20px;display:inline-block;background-color:rgb('+this.c+');">')),void++k)}))}catch(I){G.hide(),X.hide()}}},ge=function(){try{i=document.createElement("canvas"),o=i.getContext("2d")}catch(e){G.hide(),X.hide()}},ve=e("<img/>").on("load",function(){ee=ve.get(0).width||ve.width(),te=ve.get(0).height||ve.height(),p.show();var t,n=te/ee;1>n&&k.height()>k.width()*n&&k.height(k.width()*n),k.height()>ve.height()+20&&k.height(ve.height()+20),re=k.height()-(C.outerHeight()-C.height()),x.remove(),Z=ee/te,C.append(ve.show()).show(),E.val(ee),P.val(te),ge(),fe(),D[u]("enable"),t=w.find("input,select").prop("disabled",!1).filter(":text").on("keydown",function(t){return t.keyCode==e.ui.keyCode.ENTER?(t.stopPropagation(),t.preventDefault(),void r.confirm({title:e("input:checked",D).val(),text:"confirmReq",accept:{label:"btnApply",callback:function(){Me()}},cancel:{label:"btnCancel",callback:function(){e(this).focus()}}})):void 0}).on("keyup",function(){var t=e(this);t.hasClass("elfinder-resize-bg")||setTimeout(function(){t.val(t.val().replace(/[^0-9]/g,""))},10)}).filter(":first"),!r.UA.Mobile&&t.focus(),Ie()}).on("error",function(){x.text("Unable to load image").css("background","transparent")}),be=e("<div/>"),ye=e("<img/>"),we=e("<div/>"),ke=e('<img class="elfinder-resize-imgrotate" />'),xe=function(e,t){return e=de?8*Math.round(e/8):Math.round(e),e=Math.max(0,e),t&&e>t&&(e=de?8*Math.floor(t/8):t),e},Ce=function(){E.val(ee),P.val(te),Te.updateView(ee,te),R.val(0),j.val(0),H.val(ee),N.val(te),ze.updateView()},Te={update:function(){E.val(xe(ve.width()/Q)),P.val(xe(ve.height()/Q))},updateView:function(e,t){e>ae||t>re?e/ae>t/re?(Q=ae/e,ve.width(ae).height(Math.ceil(t*Q))):(Q=re/t,ve.height(re).width(Math.ceil(e*Q))):ve.width(e).height(t),Q=ve.width()/e,M.text("1 : "+(1/Q).toFixed(2)),Te.updateHandle()},updateHandle:function(){C.width(ve.width()).height(ve.height())},fixHeight:function(){var e,t;ne&&(e=E.val(),t=xe(e/Z),Te.updateView(e,t),P.val(t))}},ze={update:function(e){R.val(xe((T.data("x")||T.position().left)/Q,ee)),j.val(xe((T.data("y")||T.position().top)/Q,te)),"xy"!==e&&(H.val(xe((T.data("w")||T.width())/Q,ee-R.val())),N.val(xe((T.data("h")||T.height())/Q,te-j.val())))},updateView:function(e){var t,n,i,a,r;R.val(xe(R.val(),ee-(de?8:1))),j.val(xe(j.val(),te-(de?8:1))),H.val(xe(H.val(),ee-R.val())),N.val(xe(N.val(),te-j.val())),ie&&(t=we.width()/we.height(),"w"===e?N.val(xe(parseInt(H.val())/t)):"h"===e&&H.val(xe(parseInt(N.val())*t))),n=Math.round(parseInt(R.val())*Q),i=Math.round(parseInt(j.val())*Q),"xy"!==e?(a=Math.round(parseInt(H.val())*Q),r=Math.round(parseInt(N.val())*Q)):(a=T.data("w"),r=T.data("h")),T.data({x:n,y:i,w:a,h:r}).width(a).height(r).css({left:n,top:i}),we.width(a).height(r)},resize_update:function(e,t){T.data({x:t.position.left,y:t.position.top,w:t.size.width,h:t.size.height}),ze.update(),ze.updateView()},drag_update:function(e,t){T.data({x:t.position.left,y:t.position.top}),ze.update("xy")}},Ae={mouseStartAngle:0,imageStartAngle:0,imageBeingRotated:!1,update:function(e,t){"undefined"==typeof e&&(le=e=parseInt(_.val())),"undefined"==typeof t&&(t=!0),!t||r.UA.Opera||r.UA.ltIE8?ke.rotate(e):ke.animate({rotate:e+"deg"}),e%=360,0>e&&(e+=360),_.val(parseInt(e)),L.slider("value",_.val())},execute:function(e){if(Ae.imageBeingRotated){var t=Ae.getCenter(ke),n=e.pageX-t[0],i=e.pageY-t[1],a=Math.atan2(i,n),r=a-Ae.mouseStartAngle+Ae.imageStartAngle;return r=Math.round(180*parseFloat(r)/Math.PI),e.shiftKey&&(r=15*Math.round((r+6)/15)),ke.rotate(r),r%=360,0>r&&(r+=360),_.val(r),L.slider("value",_.val()),!1}},start:function(t){Ae.imageBeingRotated=!0;var n=Ae.getCenter(ke),i=t.pageX-n[0],a=t.pageY-n[1];return Ae.mouseStartAngle=Math.atan2(a,i),Ae.imageStartAngle=parseFloat(ke.rotate())*Math.PI/180,e(document).mousemove(Ae.execute),!1},stop:function(t){return Ae.imageBeingRotated?(e(document).unbind("mousemove",Ae.execute),setTimeout(function(){Ae.imageBeingRotated=!1},10),!1):void 0},getCenter:function(e){var t=ke.rotate();ke.rotate(0);var n=ke.offset(),i=n.left+ke.width()/2,a=n.top+ke.height()/2;return ke.rotate(t),Array(i,a)}},Ie=function(t){e.fn.resizable&&(t?(C.filter(":ui-resizable").resizable("destroy"),C.hide()):(C.show(),C.resizable({alsoResize:ve,aspectRatio:ne,resize:Te.update,stop:Te.fixHeight}),Re()))},Se=function(t){e.fn.draggable&&e.fn.resizable&&(t?(T.filter(":ui-resizable").resizable("destroy").filter(":ui-draggable").draggable("destroy"),be.hide()):(be.show(),T.resizable({containment:be,aspectRatio:ie,resize:ze.resize_update,handles:"all"}).draggable({handle:we,containment:ye,drag:ze.drag_update,stop:function(){ze.updateView("xy")}}),Re(),ze.update()))},Ue=function(t){e.fn.draggable&&e.fn.resizable&&(t?ke.hide():(ke.show(),Re()))},Me=function(){var e,n,i,o,l,d,c="";if("resize"==F)e=parseInt(E.val())||0,n=parseInt(P.val())||0;else if("crop"==F)e=parseInt(H.val())||0,n=parseInt(N.val())||0,i=parseInt(R.val())||0,o=parseInt(j.val())||0;else if("rotate"==F){if(e=ee,n=te,l=parseInt(_.val())||0,0>l||l>360)return r.error("Invalid rotate degree");if(0==l||360==l)return r.error("errResizeNoChange");c=Y.val()}if(d=q?parseInt(q.val()):0,"rotate"!=F){if(0>=e||0>=n)return r.error("Invalid image size");if(e==ee&&n==te)return r.error("errResizeNoChange")}g.elfinderdialog("close"),a.resizeRequest({target:t.hash,width:e,height:n,x:i,y:o,degree:l,quality:d,bg:c,mode:F},t,s)},Oe={},De="elfinder-resize-handle-hline",Fe="elfinder-resize-handle-vline",Ee="elfinder-resize-handle-point",Pe=r.openUrl(t.hash,!!r.isCORS),Re=function(){if(!f.hasClass("elfinder-dialog-minimized")){var t,n=e(window).height(),i=e(window).width(),a=g.find("div.elfinder-resize-control").width(),r=k.width();f.width();f.width(Math.min(d,i-30)),k.attr("style",""),ee&&te&&(ae=k.width()-(C.outerWidth()-C.width()),re=k.height()-(C.outerHeight()-C.height()),Te.updateView(ee,te)),r=k.width(),t=g.width()-20,r>t?k.width(t):a>t-r&&(i>n?k.width(t-a-20):k.css({"float":"none",marginLeft:"auto",marginRight:"auto"})),ae=k.width()-(C.outerWidth()-C.width()),c.hasClass("elfinder-fullscreen")?f.height()>n&&(n-=2,k.height(n-f.height()+k.height()),f.css("top",0-c.offset().top)):(n-=30,k.height()>n&&k.height(n)),re=k.height()-(C.outerHeight()-C.height()),ee&&te&&fe(),ve.height()&&k.height()>ve.height()+20&&(k.height(ve.height()+20),re=k.height()-(C.outerHeight()-C.height()),pe())}};r.isCORS&&(ve.attr("crossorigin","use-credentials"),ye.attr("crossorigin","use-credentials"),ke.attr("crossorigin","use-credentials")),ke.mousedown(Ae.start),e(document).mouseup(Ae.stop),z.append(e(b).append(e(y).text(r.i18n("width")),E),e(b).append(e(y).text(r.i18n("height")),P,e('<div class="elfinder-resize-whctrls">').append(ce,O)),q?e(b).append(e(y).text(r.i18n("quality")),q,e("<span/>").text(" (1-100)")):e(),m?e(b).append(e(y).text(r.i18n("8pxgrid")).addClass("elfinder-resize-grid8"),he):e(),e(b).append(e(y).text(r.i18n("scale")),M)),l&&(A.append(e(b).append(e(y).text("X"),R),e(b).append(e(y).text("Y")).append(j),e(b).append(e(y).text(r.i18n("width")),H),e(b).append(e(y).text(r.i18n("height")),N,e('<div class="elfinder-resize-whctrls">').append(ue,O.clone(!0))),q?e(b).append(e(y).text(r.i18n("quality")),q.clone(!0),e("<span/>").text(" (1-100)")):e(),m?e(b).append(e(y).text(r.i18n("8pxgrid")).addClass("elfinder-resize-grid8")):e()),I.append(e(b).addClass("elfinder-resize-degree").append(e(y).text(r.i18n("rotate")),_,e("<span/>").text(r.i18n("degree")),e("<div/>").append(S,U)[u]()),e(b).css("height","20px").append(L),q?e(b).addClass("elfinder-resize-quality").append(e(y).text(r.i18n("quality")),q.clone(!0),e("<span/>").text(" (1-100)")):e(),e(b).append(e(y).text(r.i18n("bgcolor")),Y,G,J),e(b).css("height","20px").append(X)),S.on("click",function(){le-=90,Ae.update(le)}),U.on("click",function(){le+=90,Ae.update(le)})),g.append(D).on("resize",function(e){e.stopPropagation()}),l?w.append(e(b),z,A.hide(),I.hide()):w.append(e(b),z),C.append('<div class="'+De+" "+De+'-top"/>','<div class="'+De+" "+De+'-bottom"/>','<div class="'+Fe+" "+Fe+'-left"/>','<div class="'+Fe+" "+Fe+'-right"/>','<div class="'+Ee+" "+Ee+'-e"/>','<div class="'+Ee+" "+Ee+'-se"/>','<div class="'+Ee+" "+Ee+'-s"/>'),k.append(x).append(C.hide()).append(ve.hide()),l&&(T.css("position","absolute").append('<div class="'+De+" "+De+'-top"/>','<div class="'+De+" "+De+'-bottom"/>','<div class="'+Fe+" "+Fe+'-left"/>','<div class="'+Fe+" "+Fe+'-right"/>','<div class="'+Ee+" "+Ee+'-n"/>','<div class="'+Ee+" "+Ee+'-e"/>','<div class="'+Ee+" "+Ee+'-s"/>','<div class="'+Ee+" "+Ee+'-w"/>','<div class="'+Ee+" "+Ee+'-ne"/>','<div class="'+Ee+" "+Ee+'-se"/>','<div class="'+Ee+" "+Ee+'-sw"/>','<div class="'+Ee+" "+Ee+'-nw"/>'),k.append(be.css("position","absolute").hide().append(ye,T.append(we))),k.append(ke.hide())),k.css("overflow","hidden"),g.append(k,w),Oe[r.i18n("btnApply")]=Me,Oe[r.i18n("btnCancel")]=function(){g.elfinderdialog("close")},g.find("input,button").addClass("elfinder-tabstop"),f=r.dialog(g,{title:r.escape(t.name),width:d,resizable:!1,buttons:Oe,open:function(){p=f.find(".ui-dialog-titlebar .elfinder-titlebar-minimize").hide(),r.bind("resize",Re),ve.attr("src",Pe+(-1===Pe.indexOf("?")?"?":"&")+"_="+Math.random()),ye.attr("src",ve.attr("src")),ke.attr("src",ve.attr("src"))},close:function(){r.unbind("resize",Re),e(this).elfinderdialog("destroy")},resize:function(e,t){t&&"off"===t.minimize&&Re()}}).attr("id",n).parent(),r.UA.ltIE8&&e(".elfinder-dialog").css("filter",""),we.css({opacity:.2,"background-color":"#fff",position:"absolute"}),T.css("cursor","move"),T.find(".elfinder-resize-handle-point").css({"background-color":"#fff",opacity:.5,"border-color":"#000"}),l||D.find(".api2").remove(),w.find("input,select").prop("disabled",!0)};return o.length&&-1!==o[0].mime.indexOf("image/")?(n="resize-"+r.namespace+"-"+o[0].hash,i=r.getUI().find("#"+n),i.length?(i.elfinderdialog("toTop"),s.resolve()):(p(o[0],n),s)):s.reject()}},function(e){var t=function(e,t){var n=0;for(n in t)if("undefined"!=typeof e[t[n]])return t[n];return e[t[n]]="",t[n]};if(e.cssHooks.rotate={get:function(t,n,i){return e(t).rotate()},set:function(t,n){return e(t).rotate(n),n}},e.cssHooks.transform={get:function(e,n,i){var a=t(e.style,["WebkitTransform","MozTransform","OTransform","msTransform","transform"]);return e.style[a]},set:function(e,n){var i=t(e.style,["WebkitTransform","MozTransform","OTransform","msTransform","transform"]);return e.style[i]=n,n}},e.fn.rotate=function(e){if("undefined"==typeof e){if(window.opera){var t=this.css("transform").match(/rotate\((.*?)\)/);return t&&t[1]?Math.round(180*parseFloat(t[1])/Math.PI):0}var t=this.css("transform").match(/rotate\((.*?)\)/);return t&&t[1]?parseInt(t[1]):0}return this.css("transform",this.css("transform").replace(/none|rotate\(.*?\)/,"")+"rotate("+parseInt(e)+"deg)"),this},e.fx.step.rotate=function(t){0==t.state&&(t.start=e(t.elem).rotate(),t.now=t.start),e(t.elem).rotate(t.now)},"undefined"==typeof window.addEventListener&&"undefined"==typeof document.getElementsByClassName){var n=function(e){for(var t=e,n=t.offsetLeft,i=t.offsetTop;t.offsetParent&&(t=t.offsetParent,t==document.body||"static"==t.currentStyle.position);)t!=document.body&&t!=document.documentElement&&(n-=t.scrollLeft,i-=t.scrollTop),n+=t.offsetLeft,i+=t.offsetTop;return{x:n,y:i}},i=function(e){if("static"==e.currentStyle.position){var t=n(e);e.style.position="absolute",e.style.left=t.x+"px",e.style.top=t.y+"px"}},a=function(e,t){var n,a=1,r=1,o=1,s=1;if("undefined"!=typeof e.style.msTransform)return!0;i(e),n=t.match(/rotate\((.*?)\)/);var l=n&&n[1]?parseInt(n[1]):0;l%=360,0>l&&(l=360+l);var d=l*Math.PI/180,c=Math.cos(d),u=Math.sin(d);a*=c,r*=-u,o*=u,s*=c,e.style.filter=(e.style.filter||"").replace(/progid:DXImageTransform\.Microsoft\.Matrix\([^)]*\)/,"")+("progid:DXImageTransform.Microsoft.Matrix(M11="+a+",M12="+r+",M21="+o+",M22="+s+",FilterType='bilinear',sizingMethod='auto expand')");var h=parseInt(e.style.width||e.width||0),p=parseInt(e.style.height||e.height||0),d=l*Math.PI/180,f=Math.abs(Math.cos(d)),m=Math.abs(Math.sin(d)),g=(h-(h*f+p*m))/2,v=(p-(h*m+p*f))/2;return e.style.marginLeft=Math.floor(g)+"px",e.style.marginTop=Math.floor(v)+"px",!0},r=e.cssHooks.transform.set;e.cssHooks.transform.set=function(e,t){return r.apply(this,[e,t]),a(e,t),t}}}(jQuery),i.prototype.commands.rm=function(){this.shortcuts=[{pattern:"delete ctrl+backspace"}],this.getstate=function(t){var n=this.fm;return t=t||n.selected(),!this._disabled&&t.length&&e.map(t,function(e){var t=n.file(e);return!t||t.locked||n.isRoot(t)?null:e}).length==t.length?0:-1},this.exec=function(t){var n,i,a,r,o,s,l,d,c=this,u=this.fm,h=e.Deferred().fail(function(e){e&&u.error(e)}),p=this.files(t),f=p.length,m=u.cwd().hash,g='<div class="ui-helper-clearfix elfinder-rm-title"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}<div class="elfinder-rm-desc">{desc}</div></div>';return f?(e.each(p,function(e,t){return u.isRoot(t)?!h.reject(["errRm",t.name,"errPerm"]):t.locked?!h.reject(["errLocked",t.name]):void 0}),"pending"==h.state()&&(n=this.hashes(t),f=p.length,l=[],f>1?(e.map(p,function(e){return"directory"==e.mime?1:null}).length||(o=0,e.each(p,function(e,t){if(!t.size||"unknown"==t.size)return o="unknown",!1;var n=parseInt(t.size);n>=0&&o>=0&&(o+=n)}),l.push(u.i18n("size")+": "+u.formatSize(o))),i=[e(g.replace("{class}","elfinder-cwd-icon-group").replace("{title}","<strong>"+u.i18n("items")+": "+f+"</strong>").replace("{desc}",l.join("<br>")))]):(a=p[0],s=u.tmb(a),a.size&&l.push(u.i18n("size")+": "+u.formatSize(a.size)),l.push(u.i18n("modify")+": "+u.formatDate(a)),r=u.escape(a.i18||a.name).replace(/([_.])/g,"&#8203;$1"),i=[e(g.replace("{class}",u.mime2class(a.mime)).replace("{title}","<strong>"+r+"</strong>").replace("{desc}",l.join("<br>")))]),i.push("confirmRm"),u.lockfiles({files:n}),d=u.confirm({title:c.title,text:i,accept:{label:"btnRm",callback:function(){u.request({data:{cmd:"rm",targets:n},notify:{type:"rm",cnt:f},preventFail:!0}).fail(function(e){h.reject(e)}).done(function(e){h.done(e)}).always(function(){u.unlockfiles({files:n})})}},cancel:{label:"btnCancel",callback:function(){u.unlockfiles({files:n}),1===n.length&&u.file(n[0]).phash!==m?u.select({selected:n}):u.selectfiles({files:n}),h.reject()}}}),s&&e("<img/>").on("load",function(){d.find(".elfinder-cwd-icon").addClass(s.className).css("background-image","url('"+s.url+"')")}).attr("src",s.url)),h):h.reject()}},i.prototype.commands.search=function(){this.title="Find files",this.options={ui:"searchbutton"},this.alwaysEnabled=!0,this.updateOnSelect=!1,this.getstate=function(){return 0},this.exec=function(t,n,i){var a,r=this.fm,o=[],s=r.options.onlyMimes;return"string"==typeof t&&t?("object"==typeof n&&(i=n.mime||"",n=n.target||""),n=n?n:"",i?(i=e.trim(i).replace(","," ").split(" "),s.length&&(i=e.map(i,function(t){return t=e.trim(t),t&&(-1!==e.inArray(t,s)||e.map(s,function(e){return 0===t.indexOf(e)?!0:null}).length)?t:null}))):i=[].concat(s),r.trigger("searchstart",{query:t,target:n,mimes:i}),!s.length||i.length?""===n&&r.api>=2.1?e.each(r.roots,function(e,n){o.push(r.request({data:{cmd:"search",q:t,target:n,mimes:i},notify:{type:"search",cnt:1,hideCnt:!o.length},cancel:!0,preventDone:!0}))}):(o.push(r.request({data:{cmd:"search",q:t,target:n,mimes:i},notify:{type:"search",cnt:1,hideCnt:!0},cancel:!0,preventDone:!0})),""!==n&&r.api>=2.1&&Object.keys(r.leafRoots).length&&e.each(r.leafRoots,function(s,l){for(a=s;a;)n===a&&e.each(l,function(){o.push(r.request({data:{cmd:"search",q:t,target:this,mimes:i},notify:{type:"search",cnt:1,hideCnt:!1},cancel:!0,preventDone:!0}))}),a=(r.file(a)||{}).phash})):o=[e.Deferred().resolve({files:[]})],r.searchStatus.mixed=o.length>1,e.when.apply(e,o).done(function(e){var t,n=arguments.length;if(e.warning&&r.error(e.warning),n>1)for(e.files=e.files||[],t=1;n>t;t++)arguments[t].warning&&r.error(arguments[t].warning),arguments[t].files&&e.files.push.apply(e.files,arguments[t].files);r.lazy(function(){r.trigger("search",e)}).then(function(){return r.lazy(function(){r.trigger("searchdone")})}).then(function(){e.sync&&r.sync()})})):(r.getUI("toolbar").find("."+r.res("class","searchbtn")+" :text").focus(),e.Deferred().reject())}},i.prototype.commands.sort=function(){var t=this,n=t.fm,i=function(){t.variants=[],e.each(n.sortRules,function(i,a){var r={type:i,order:i==n.sortType?"asc"==n.sortOrder?"desc":"asc":n.sortOrder};if(-1!==e.inArray(i,n.sorters)){var o=i==n.sortType?"asc"==r.order?"s":"n":"";t.variants.push([r,(o?'<span class="ui-icon ui-icon-arrowthick-1-'+o+'"></span>':"")+"&nbsp;"+n.i18n("sort"+i)])}}),t.variants.push("|"),t.variants.push([{type:n.sortType,order:n.sortOrder,stick:!n.sortStickFolders,tree:n.sortAlsoTreeview},(n.sortStickFolders?'<span class="ui-icon ui-icon-check"/>':"")+"&nbsp;"+n.i18n("sortFoldersFirst")]),n.ui.tree&&(t.variants.push("|"),t.variants.push([{type:n.sortType,order:n.sortOrder,stick:n.sortStickFolders,tree:!n.sortAlsoTreeview},(n.sortAlsoTreeview?'<span class="ui-icon ui-icon-check"/>':"")+"&nbsp;"+n.i18n("sortAlsoTreeview")]))};this.options={ui:"sortbutton"},n.bind("open sortchange",i).bind("open",function(){n.unbind("add",i).one("add",i),n.getUI("toolbar").find(".elfiner-button-sort .elfinder-button-menu .elfinder-button-menu-item").each(function(){var t=e(this),i=t.attr("rel");t.toggle(!i||-1!==e.inArray(i,n.sorters))})}).bind("cwdrender",function(){var i=e(n.cwd).find("div.elfinder-cwd-wrapper-list table");i.length&&e.each(n.sortRules,function(a,r){var o=i.find("thead tr td.elfinder-cwd-view-th-"+a);if(o.length){var s,l=a==n.sortType,d={type:a,order:l?"asc"==n.sortOrder?"desc":"asc":n.sortOrder};l&&(o.addClass("ui-state-active"),s="asc"==n.sortOrder?"n":"s",e('<span class="ui-icon ui-icon-triangle-1-'+s+'"/>').appendTo(o)),e(o).on("click",function(i){e(this).data("dragging")||(i.stopPropagation(),n.getUI("cwd").data("longtap")||t.exec([],d))}).hover(function(){e(this).addClass("ui-state-hover")},function(){e(this).removeClass("ui-state-hover")})}})}),this.getstate=function(){return 0},this.exec=function(t,n){var i=this.fm,a=e.extend({type:i.sortType,order:i.sortOrder,stick:i.sortStickFolders,tree:i.sortAlsoTreeview},n);return i.lazy(function(){i.setSort(a.type,a.order,a.stick,a.tree),this.resolve()})}},(i.prototype.commands.up=function(){this.alwaysEnabled=!0,this.updateOnSelect=!1,this.shortcuts=[{pattern:"ctrl+up"}],this.getstate=function(){return this.fm.cwd().phash?0:-1},this.exec=function(){var t=this.fm,n=t.cwd().hash;return this.fm.cwd().phash?this.fm.exec("open",this.fm.cwd().phash).done(function(){t.one("opendone",function(){t.selectfiles({files:[n]})})}):e.Deferred().reject()}}).prototype={forceLoad:!0},i.prototype.commands.upload=function(){var t=this.fm.res("class","hover");this.disableOnSearch=!0,this.updateOnSelect=!1,this.shortcuts=[{pattern:"ctrl+u"}],this.getstate=function(e){var t,n=this.fm,e=e||[n.cwd().hash];return this._disabled||1!=e.length||(t=n.file(e[0])),t&&"directory"==t.mime&&t.write?0:-1},this.exec=function(n){var i,a,r,o,s,l,d,c=this.fm,u=c.cwd().hash,h=function(){var e,t=n&&n instanceof Array?n:null;return n||(t=t||1!==(e=c.selected()).length||"directory"!==c.file(e[0]).mime?[u]:e),t},p=h(),f=!p&&n&&n.target?n.target:p[0],m=f?c.file(f):c.cwd(),g=function(t){c.upload(t).fail(function(e){w.reject(e)}).done(function(t){var n;c.getUI("cwd");if(w.resolve(t),t&&t.added&&t.added[0]&&!c.ui.notify.children(".elfinder-notify-upload").length){var i=c.findCwdNodes(t.added);i.length?i.trigger("scrolltoview"):(m.hash!==u?n=e("<div/>").append(e('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all elfinder-tabstop"><span class="ui-button-text">'+c.i18n("cmdopendir")+"</span></button>").on("mouseenter mouseleave",function(t){e(this).toggleClass("ui-state-hover","mouseenter"==t.type)}).on("click",function(){c.exec("open",f).done(function(){c.one("opendone",function(){c.trigger("selectfiles",{files:e.map(t.added,function(e){return e.hash})})})})})):c.trigger("selectfiles",{files:e.map(t.added,function(e){return e.hash})}),c.toast({msg:c.i18n(["complete",c.i18n("cmdupload")]),extNode:n}))}})},v=function(e){"files"!==e.type&&i.elfinderdialog("close"),p&&(e.target=p[0]),g(e)},b=function(){var t=m.hash,n=e.map(c.files(),function(e){return"directory"===e.mime&&e.write&&e.phash&&e.phash===t?e:null});return n.length?e('<div class="elfinder-upload-dirselect elfinder-tabstop" title="'+c.i18n("folders")+'"/>').on("click",function(t){t.stopPropagation(),t.preventDefault(),n=c.sortFiles(n);var a=e(this),r=(c.cwd(),i.closest("div.ui-dialog")),o=function(e,t){return{label:c.escape(e.i18||e.name),icon:t,remain:!1,callback:function(){var t=r.children(".ui-dialog-titlebar:first").find("span.elfinder-upload-target");p=[e.hash],t.html(" - "+c.escape(e.i18||e.name)),a.focus()},options:{className:p&&p.length&&e.hash===p[0]?"ui-state-active":"",iconClass:e.csscls||"",iconImg:e.icon||""}}},s=[o(m,"opendir"),"|"];e.each(n,function(e,t){s.push(o(t,"dir"))}),a.blur(),c.trigger("contextmenu",{raw:s,x:t.pageX||e(this).offset().left,y:t.pageY||e(this).offset().top,prevNode:r,fitHeight:!0})}).append('<span class="elfinder-button-icon elfinder-button-icon-dir" />'):e()},y=function(n,i){var a=e('<input type="file" '+n+"/>").change(function(){v({input:a.get(0),type:"files"})}).on("dragover",function(e){e.originalEvent.dataTransfer.dropEffect="copy"});return e('<div class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only elfinder-tabstop elfinder-focus"><span class="ui-button-text">'+c.i18n(i)+"</span></div>").append(e("<form/>").append(a)).on("click",function(e){e.target===this&&(e.stopPropagation(),e.preventDefault(),a.click())}).hover(function(){e(this).toggleClass(t)})},w=e.Deferred();return o=function(t){t.stopPropagation(),t.preventDefault();var n,i=!1,a="",r=null,o="",s=null,l=t._target||null,d=t.dataTransfer||null,u=d.items&&d.items.length&&d.items[0].kind?d.items[0].kind:"";if(d){try{if(r=d.getData("elfinderfrom"),r&&(o=window.location.href+c.cwd().hash,!l&&r===o||l===o))return void w.reject()}catch(t){}if("file"===u&&(d.items[0].getAsEntry||d.items[0].webkitGetAsEntry))i=d,a="data";else if("string"!==u&&d.files&&d.files.length&&-1===e.inArray("Text",d.types))i=d.files,a="files";else{try{(s=d.getData("text/html"))&&s.match(/<(?:img|a)/i)&&(i=[s],a="html")}catch(t){}!i&&(s=d.getData("text"))&&(i=[s],a="text")}}i?g({files:i,type:a,target:l,dropEvt:t}):(n=["errUploadNoFiles"],"file"===u&&n.push("errFolderUpload"),c.error(n),w.reject())},!p&&n?(n.input||n.files?(n.type="files",g(n)):n.dropEvt&&o(n.dropEvt),w):(s=function(t){var n,t=t.originalEvent||t,i=[],a=[];if(t.clipboardData){if(t.clipboardData.items&&t.clipboardData.items.length){a=t.clipboardData.items;for(var r=0;r<a.length;r++)"file"==t.clipboardData.items[r].kind&&(n=t.clipboardData.items[r].getAsFile(),i.push(n))}else t.clipboardData.files&&t.clipboardData.files.length&&(i=t.clipboardData.files);if(i.length)return void v({files:i,type:"files"})}var o=t.target||t.srcElement;setTimeout(function(){if(o.innerHTML){e(o).find("img").each(function(t,n){n.src.match(/^webkit-fake-url:\/\//)&&e(n).remove()});var t=o.innerHTML.replace(/<br[^>]*>/gi," "),n=t.match(/<[^>]+>/)?"html":"text";o.innerHTML="",v({files:[t],type:n})}},1)},i=e('<div class="elfinder-upload-dialog-wrapper"/>').append(y("multiple","selectForUpload")),!c.UA.Mobile&&function(e){return"undefined"!=typeof e.webkitdirectory||"undefined"!=typeof e.directory}(document.createElement("input"))&&i.append(y("multiple webkitdirectory directory","selectFolder")),m.dirs&&(m.hash===u||e("#"+c.navHash2Id(m.hash)).hasClass("elfinder-subtree-loaded")?b().appendTo(i):(l=e('<div class="elfinder-upload-dirselect" title="'+c.i18n("nowLoading")+'"/>').append('<span class="elfinder-button-icon elfinder-button-icon-spinner" />').appendTo(i),c.request({cmd:"tree",
target:m.hash}).done(function(){c.one("treedone",function(){l.replaceWith(b()),d.elfinderdialog("tabstopsInit")})}).fail(function(){l.remove()}))),c.dragUpload?a=e('<div class="ui-corner-all elfinder-upload-dropbox elfinder-tabstop" contenteditable="true" data-ph="'+c.i18n("dropPasteFiles")+'"></div>').on("paste",function(e){s(e)}).on("mousedown click",function(){e(this).focus()}).on("focus",function(){this.innerHTML=""}).on("mouseover",function(){e(this).addClass(t)}).on("mouseout",function(){e(this).removeClass(t)}).on("dragenter",function(n){n.stopPropagation(),n.preventDefault(),e(this).addClass(t)}).on("dragleave",function(n){n.stopPropagation(),n.preventDefault(),e(this).removeClass(t)}).on("dragover",function(n){n.stopPropagation(),n.preventDefault(),n.originalEvent.dataTransfer.dropEffect="copy",e(this).addClass(t)}).on("drop",function(e){i.elfinderdialog("close"),p&&(e.originalEvent._target=p[0]),o(e.originalEvent)}).prependTo(i).after('<div class="elfinder-upload-dialog-or">'+c.i18n("or")+"</div>")[0]:r=e('<div class="ui-corner-all elfinder-upload-dropbox" contenteditable="true">'+c.i18n("dropFilesBrowser")+"</div>").on("paste drop",function(e){s(e)}).on("mousedown click",function(){e(this).focus()}).on("focus",function(){this.innerHTML=""}).on("dragenter mouseover",function(){e(this).addClass(t)}).on("dragleave mouseout",function(){e(this).removeClass(t)}).prependTo(i).after('<div class="elfinder-upload-dialog-or">'+c.i18n("or")+"</div>")[0],d=c.dialog(i,{title:this.title+'<span class="elfinder-upload-target">'+(m?" - "+c.escape(m.i18||m.name):"")+"</span>",modal:!0,resizable:!1,destroyOnClose:!0}),w)}},i.prototype.commands.view=function(){var e=this.fm;this.value=e.viewType,this.alwaysEnabled=!0,this.updateOnSelect=!1,this.options={ui:"viewbutton"},this.getstate=function(){return 0},this.exec=function(){var t=this,n=e.storage("view","list"==this.value?"icons":"list");return e.lazy(function(){e.viewchange(),t.update(void 0,n),this.resolve()})}},i});
});

define('jquery', function (require, exports, module) {
/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be