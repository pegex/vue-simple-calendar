module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1a67":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.cv-header{align-items:center;border-width:1px 1px 0;display:flex;flex:0 1 auto;flex-flow:row nowrap;min-height:2.5em\n}\n.cv-header .periodLabel{display:flex;flex:1 1 auto;flex-flow:row nowrap;font-size:1.5em;line-height:1;min-height:1.5em\n}\n.cv-header,.cv-header button{border-color:#ddd;border-style:solid\n}\n.cv-header-nav,.cv-header .periodLabel{margin:.1em .6em\n}\n.cv-header-nav button,.cv-header .periodLabel{padding:.4em .6em\n}\n.cv-header button{border-width:1px;box-sizing:border-box;font-size:1em;line-height:1em\n}", ""]);

// exports


/***/ }),

/***/ "1eb2":
/***/ (function(module, exports, __webpack_require__) {

// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}


/***/ }),

/***/ "1f02":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("1a67");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("3c828df1", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2350":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__("aae3");
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "3417":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.cv-wrapper{box-sizing:border-box;display:flex;flex-direction:column;flex-grow:1;font-size:1em;height:100%;line-height:1em;max-height:100%;min-height:100%;overflow-x:hidden;overflow-y:hidden\n}\n.cv-header-days{border-width:0 0 0 1px;flex-basis:auto;flex-grow:0\n}\n.cv-header-day,.cv-header-days{display:flex;flex-flow:row nowrap;flex-shrink:0\n}\n.cv-header-day{align-items:center;border-width:1px 1px 0 0;flex-basis:0;flex-grow:1;justify-content:center;text-align:center\n}\n.cv-weeks{-ms-overflow-style:none;border-width:0 0 1px 1px;flex-basis:auto;flex-flow:column nowrap;flex-shrink:1;height:100%;overflow-y:auto\n}\n.cv-week-row,.cv-weeks{display:flex;flex-grow:1\n}\n.cv-week-row{flex-direction:column;flex-shrink:0\n}\n.cv-week-row--expanded{flex-grow:0;max-height:50%\n}\n.cv-week{border-width:0;display:flex;flex-flow:row nowrap;flex-grow:1;min-height:2em;overflow:hidden;position:relative;width:100%\n}\n.cv-week-row--expanded .cv-week{-ms-overflow-style:none;flex-grow:0;overflow-y:auto\n}\n.cv-week-expander{background:#ddd;border:0;cursor:pointer;flex-grow:0;font-size:10px;font-weight:400;line-height:10px;padding:1px 0;text-align:center;width:100%\n}\n.cv-day{border-width:1px 1px 0 0;display:flex;flex-basis:0;flex-grow:1;flex-shrink:0;position:relative;position:sticky;top:0\n}\n.cv-day-number{position:absolute;right:0\n}\n.cv-event{background-color:#f7f7f7;border-width:1px;overflow:hidden;position:absolute;white-space:nowrap\n}\n.cv-wrapper.wrap-event-title-on-hover .cv-event:hover{white-space:normal;z-index:1\n}\n.cv-day,.cv-event,.cv-header-day,.cv-header-days,.cv-week,.cv-weeks{border-color:#ddd;border-style:solid\n}\n.cv-event .endTime:before{content:\"-\"\n}\n.cv-day-number,.cv-event,.cv-header-day{padding:.2em\n}\n.cv-day-number:before{margin-right:.5em\n}\n.cv-event.offset0{left:0\n}\n.cv-event.offset1{left:14.28571%\n}\n.cv-event.offset2{left:28.57143%\n}\n.cv-event.offset3{left:42.85714%\n}\n.cv-event.offset4{left:57.14286%\n}\n.cv-event.offset5{left:71.42857%\n}\n.cv-event.offset6{left:85.71429%\n}\n.cv-event.span1{width:calc(14.28571% - .05em)\n}\n.cv-event.span2{width:calc(28.57143% - .05em)\n}\n.cv-event.span3{text-align:center;width:calc(42.85714% - .05em)\n}\n.cv-event.span4{text-align:center;width:calc(57.14286% - .05em)\n}\n.cv-event.span5{text-align:center;width:calc(71.42857% - .05em)\n}\n.cv-event.span6{text-align:center;width:calc(85.71429% - .05em)\n}\n.cv-event.span7{text-align:center;width:calc(100% - .05em)\n}\n.cv-week::-webkit-scrollbar,.cv-weeks::-webkit-scrollbar{background:transparent;width:0\n}", ""]);

// exports


/***/ }),

/***/ "36bd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__("4bf8");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ "3846":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("9e1e") && /./g.flags != 'g') __webpack_require__("86cc").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("0bfb")
});


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "608f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarViewHeader_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1f02");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarViewHeader_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarViewHeader_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarViewHeader_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6b54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("3846");
var anObject = __webpack_require__("cb7c");
var $flags = __webpack_require__("0bfb");
var DESCRIPTORS = __webpack_require__("9e1e");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("2aba")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("79e5")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "6c7b":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__("5ca1");

$export($export.P, 'Array', { fill: __webpack_require__("36bd") });

__webpack_require__("9c6c")('fill');


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a45d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarView_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d6d2");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarView_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarView_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CalendarView_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d6d2":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("3417");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("a33d69de", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
var setPublicPath = __webpack_require__("1eb2");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d50f023a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CalendarView.vue?vue&type=template&id=3cfbd0ba&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:[
	'cv-wrapper',
	'locale-' + _vm.languageCode(_vm.displayLocale),
	'locale-' + _vm.displayLocale,
	'y' + _vm.periodStart.getFullYear(),
	'm' + _vm.paddedMonth(_vm.periodStart),
	'period-' + _vm.displayPeriodUom,
	'periodCount-' + _vm.displayPeriodCount,
	{
		past: _vm.isPastMonth(_vm.periodStart),
		future: _vm.isFutureMonth(_vm.periodStart),
		noIntl: !_vm.supportsIntl,
	}
]},[_vm._t("header",null,{headerProps:_vm.slotProps}),_c('div',{staticClass:"cv-main"},[_c('div',{staticClass:"cv-main-calendar"},[_c('div',{staticClass:"cv-header-days"},[_vm._l((_vm.weekdayNames),function(label,index){return [_vm._t("dayHeader",[_c('div',{key:_vm.getColumnDOWClass(index),staticClass:"cv-header-day",class:_vm.getColumnDOWClass(index)},[_vm._v(_vm._s(label))])],{index:_vm.getColumnDOWClass(index),label:label})]})],2),_c('div',{staticClass:"cv-weeks"},_vm._l((_vm.weeksOfPeriod),function(weekStart,weekIndex){return _c('div',{key:(weekIndex + "-week"),class:['cv-week-row', {'cv-week-row--expanded': _vm.weekHeights[weekIndex] && _vm.weekHeights[weekIndex].expanded}]},[_c('div',{ref:(weekIndex + "-week"),refInFor:true,class:['cv-week', 'week' + (weekIndex+1), 'ws' + _vm.isoYearMonthDay(weekStart)],style:(_vm.weekHeights[weekIndex] && _vm.weekHeights[weekIndex].expanded ? 'height:' + _vm.weekHeights[weekIndex].contentHeight + 'px' : undefined)},[_vm._l((_vm.daysOfWeek(weekStart)),function(day,dayIndex){return _c('div',{key:_vm.getColumnDOWClass(dayIndex),class:[
								'cv-day',
								_vm.getColumnDOWClass(dayIndex),
								'd' + _vm.isoYearMonthDay(day),
								'd' + _vm.isoMonthDay(day),
								'd' + _vm.paddedDay(day),
								'instance' + _vm.instanceOfMonth(day),
								{
									outsideOfMonth: !_vm.isSameMonth(day, _vm.defaultedShowDate),
									today: _vm.isSameDate(day, _vm.today()),
									past: _vm.isInPast(day),
									future: _vm.isInFuture(day),
									last: _vm.isLastDayOfMonth(day),
									lastInstance: _vm.isLastInstanceOfMonth(day)
								} ].concat( ((_vm.dateClasses && _vm.dateClasses[_vm.isoYearMonthDay(day)]) || null)
							),on:{"click":function($event){_vm.onClickDay(day)},"drop":function($event){$event.preventDefault();_vm.onDrop(day, $event)},"dragover":function($event){$event.preventDefault();_vm.onDragOver(day)},"dragenter":function($event){$event.preventDefault();_vm.onDragEnter(day, $event)},"dragleave":function($event){$event.preventDefault();_vm.onDragLeave(day, $event)}}},[_c('div',{staticClass:"cv-day-number"},[_vm._v(_vm._s(day.getDate()))]),_vm._t("dayContent",null,{day:day})],2)}),_vm._l((_vm.getWeekEvents(weekStart)),function(e){return [_vm._t("event",[_c('div',{key:e.id,staticClass:"cv-event",class:e.classes,style:(("top:" + (_vm.getEventTop(e)) + ";" + (e.originalEvent.style))),attrs:{"draggable":_vm.enableDragDrop,"title":e.title},domProps:{"innerHTML":_vm._s(_vm.getEventTitle(e))},on:{"dragstart":function($event){_vm.onDragStart(e, $event)},"mouseenter":function($event){_vm.onMouseEnter(e)},"mouseleave":_vm.onMouseLeave,"click":function($event){$event.stopPropagation();_vm.onClickEvent(e)}}})],{event:e,weekStartDate:weekStart,top:_vm.getEventTop(e)})]})],2),(_vm.weekHeights[weekIndex] && _vm.weekHeights[weekIndex].overflow)?_c('button',{staticClass:"cv-week-expander",attrs:{"type":"button"},on:{"click":function($event){_vm.toggleWeekExpansion(weekIndex)}}},[(!_vm.weekHeights[weekIndex].expanded)?_c('span',[_vm._v(_vm._s(_vm.weekExpanderText))]):_c('span',[_vm._v("—")])]):_vm._e()])}))]),_vm._t("panel",null,{panelProps:_vm.slotProps})],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/CalendarView.vue?vue&type=template&id=3cfbd0ba&

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/arrayWithoutHoles.js
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/iterableToArray.js
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/toConsumableArray.js



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.fill.js
var es6_array_fill = __webpack_require__("6c7b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("6b54");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/construct.js

function construct_construct(Parent, args, Class) {
  if (typeof Reflect !== "undefined" && Reflect.construct) {
    construct_construct = Reflect.construct;
  } else {
    construct_construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Parent.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return construct_construct.apply(null, arguments);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// CONCATENATED MODULE: ./src/components/CalendarMathMixin.js











/*
***********************************************************
This mix-in includes a computed properties and methods that
are useful in displaying a calendar. It has no state.
***********************************************************
*/
/* harmony default export */ var CalendarMathMixin = ({
  methods: {
    // ******************************
    // Series
    // ******************************
    today: function today() {
      return this.dateOnly(new Date());
    },
    beginningOfPeriod: function beginningOfPeriod(d, periodUom, startDow) {
      switch (periodUom) {
        case "year":
          return new Date(d.getFullYear(), 0);

        case "month":
          return new Date(d.getFullYear(), d.getMonth());

        case "week":
          return this.beginningOfWeek(d, startDow);

        default:
          return null;
      }
    },
    daysOfWeek: function daysOfWeek(weekStart) {
      var _this = this;

      return Array(7).fill().map(function (_, i) {
        return _this.addDays(weekStart, i);
      });
    },
    // ********************************************
    // Date transforms that retain time of day
    // ********************************************
    addDays: function addDays(d, days) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours(), d.getMinutes(), d.getSeconds());
    },
    beginningOfWeek: function beginningOfWeek(d, startDow) {
      return this.addDays(d, (startDow - d.getDay() - 7) % -7);
    },
    endOfWeek: function endOfWeek(d, startDow) {
      return this.addDays(this.beginningOfWeek(d, startDow), 7);
    },
    // ********************************************
    // Date transforms that ignore/wipe time of day
    // ********************************************
    beginningOfMonth: function beginningOfMonth(d) {
      return new Date(d.getFullYear(), d.getMonth());
    },
    instanceOfMonth: function instanceOfMonth(d) {
      return Math.ceil(d.getDate() / 7);
    },
    // This function increments a date by a given number of date units. Accepted units are: year, month, week. For year and month,
    // the day of the month is unchanged. This could cause an unexpected result if the units are "month" and the starting day is
    // higher than the number of days in the destination month. The count can be positive or negative.
    incrementPeriod: function incrementPeriod(d, uom, count) {
      return new Date(d.getFullYear() + (uom == "year" ? count : 0), d.getMonth() + (uom == "month" ? count : 0), d.getDate() + (uom == "week" ? count * 7 : 0));
    },
    // ******************************
    // Date formatting
    // ******************************
    paddedMonth: function paddedMonth(d) {
      return ("0" + String(d.getMonth() + 1)).slice(-2);
    },
    paddedDay: function paddedDay(d) {
      return ("0" + String(d.getDate())).slice(-2);
    },
    isoYearMonth: function isoYearMonth(d) {
      return d.getFullYear() + "-" + this.paddedMonth(d);
    },
    isoYearMonthDay: function isoYearMonthDay(d) {
      return this.isoYearMonth(d) + "-" + this.paddedDay(d);
    },
    isoMonthDay: function isoMonthDay(d) {
      return this.paddedMonth(d) + "-" + this.paddedDay(d);
    },
    formattedTime: function formattedTime(d, locale, options) {
      // Assume midnight = "all day" or indeterminate time
      if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) return ""; // If Intl is not supported, send back the 24-hour, zero-padded
      // hours and minutes, expressed as local time.

      if (!this.supportsIntl()) {
        var ms = new Date().getTimezoneOffset() * 60000; // TZ offset in milliseconds

        return new Date(d - ms).toISOString().slice(11, 16);
      }

      return d.toLocaleTimeString(locale, options);
    },
    // Formats a date period in long English style. Examples supported:
    // May 2018
    // May – June 2018
    // December 2018 – January 2019
    // May 6 – 26, 2018
    // May 13 – June 2, 2018
    // December 16, 2018 – January 5, 2019
    formattedPeriod: function formattedPeriod(startDate, endDate, periodUom, monthNames) {
      var singleYear = startDate.getFullYear() === endDate.getFullYear();
      var singleMonth = this.isSameMonth(startDate, endDate);
      var isYear = periodUom === "year";
      var isMonth = periodUom === "month";
      var isWeek = !isYear && !isMonth;
      var s = [];
      s.push(monthNames[startDate.getMonth()]);

      if (isWeek) {
        s.push(" ");
        s.push(startDate.getDate());
      }

      if (!singleYear) {
        s.push(isWeek ? ", " : " ");
        s.push(startDate.getFullYear());
      }

      if (!singleMonth || !singleYear) {
        s.push(" \u2013 ");

        if (!singleMonth) {
          s.push(monthNames[endDate.getMonth()]);
        }

        if (isWeek) s.push(" ");
      } else if (isWeek) {
        s.push(" \u2013 ");
      }

      if (isWeek) {
        s.push(endDate.getDate());
        s.push(", ");
      } else {
        s.push(" ");
      }

      s.push(endDate.getFullYear());
      return s.join("");
    },
    // ******************************
    // Date comparisons
    // ******************************
    // Number of whole days between two dates. If present, time of day is ignored.
    // Have to use setUTCHours to ensure that DST changes between these dates don't
    // result in a fractional answer.
    dayDiff: function dayDiff(d1, d2) {
      var endDate = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()),
          startDate = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
      endDate.setUTCHours(0, 0, 0, 0);
      startDate.setUTCHours(0, 0, 0, 0);
      return (endDate - startDate) / 86400000;
    },
    isSameDate: function isSameDate(d1, d2) {
      // http://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
      return this.dayDiff(d1, d2) === 0;
    },
    isSameDateTime: function isSameDateTime(d1, d2) {
      return d1.getTime() === d2.getTime();
    },
    isSameMonth: function isSameMonth(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    },
    isPastMonth: function isPastMonth(d) {
      return this.beginningOfMonth(d) < this.beginningOfMonth(this.today());
    },
    isFutureMonth: function isFutureMonth(d) {
      return this.beginningOfMonth(d) > this.beginningOfMonth(this.today());
    },
    isInFuture: function isInFuture(d) {
      return this.dateOnly(d) > this.today();
    },
    isInPast: function isInPast(d) {
      return this.dateOnly(d) < this.today();
    },
    isLastInstanceOfMonth: function isLastInstanceOfMonth(d) {
      return d.getMonth() !== this.addDays(d, 7).getMonth();
    },
    isLastDayOfMonth: function isLastDayOfMonth(d) {
      return d.getMonth() !== this.addDays(d, 1).getMonth();
    },
    isSelectedDay: function isSelectedDay(d) {
      var _this2 = this;

      var day = Object.keys(this.dateClasses).find(function (day) {
        return _this2.isSameDate(_this2.fromIsoStringToLocalDate(day), d);
      });
      return day ? this.dateClasses[day] : undefined;
    },
    // Courtesy https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone/42626876#42626876
    fromIsoStringToLocalDate: function fromIsoStringToLocalDate(s) {
      var ds = s.split(/\D/).map(function (s) {
        return Number(s);
      });
      ds[1]--; // adjust month

      return construct_construct(Date, _toConsumableArray(ds));
    },
    toLocalDate: function toLocalDate(d) {
      return typeof d === "string" ? this.fromIsoStringToLocalDate(d) : new Date(d);
    },
    dateOnly: function dateOnly(d) {
      // Always use a copy, setHours mutates argument
      var d2 = new Date(d);
      d2.setHours(0, 0, 0, 0);
      return d2;
    },
    // ******************************
    // Localization
    // ******************************
    languageCode: function languageCode(l) {
      return l.substring(0, 2);
    },
    supportsIntl: function supportsIntl() {
      return typeof Intl !== "undefined";
    },
    getFormattedMonthNames: function getFormattedMonthNames(locale, format) {
      // Use the provided locale and format if possible to obtain the name of the month
      if (!this.supportsIntl()) return Array(12).fill("");
      var formatter = new Intl.DateTimeFormat(locale, {
        month: format
      }); // The year doesn't matter, using 2017 for convenience

      return Array(12).fill().map(function (_, i) {
        return formatter.format(new Date(2017, i, 1));
      });
    },
    getFormattedWeekdayNames: function getFormattedWeekdayNames(locale, format, startingDayOfWeek) {
      // Use the provided locale and format if possible to obtain the name of the days of the week
      if (!this.supportsIntl()) return Array(7).fill("");
      var formatter = new Intl.DateTimeFormat(locale, {
        weekday: format
      }); // 2017 starts on Sunday, so use it as the baseline date

      return Array(7).fill().map(function (_, i) {
        return formatter.format(new Date(2017, 0, (i + 1 + startingDayOfWeek) % 7));
      });
    },
    getDefaultBrowserLocale: function getDefaultBrowserLocale() {
      // If not running in the browser, cannot determine a default, return the code for unknown (blank is invalid)
      if (typeof navigator === "undefined") return "unk"; // Return the browser's language setting, implementation is browser-specific

      return (navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language || navigator.browserLanguage).toLowerCase();
    },
    // ******************************
    // Events
    // ******************************
    normalizeEvent: function normalizeEvent(event, isHovered) {
      // Classes may be a string, an array, or null. Normalize to an array
      var eventClasses = event.classes ? Array.isArray(event.classes) ? _toConsumableArray(event.classes) : [event.classes] : []; // Provides support for pseudo-hover of entire event when one part of it is hovered

      if (isHovered) eventClasses.push("isHovered");
      return {
        originalEvent: event,
        startDate: this.toLocalDate(event.startDate),
        // For an event without an end date, the end date is the start date
        endDate: this.toLocalDate(event.endDate || event.startDate),
        classes: eventClasses,
        // Events without a title are untitled
        title: event.title || "Untitled",
        // Events without an id receive an auto-generated ID
        id: event.id || "e" + Math.random().toString(36).substr(2, 10)
      };
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d50f023a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CalendarViewHeader.vue?vue&type=template&id=0e2cc1aa&
var CalendarViewHeadervue_type_template_id_0e2cc1aa_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"cv-header"},[_c('div',{staticClass:"cv-header-nav"},[_c('button',{staticClass:"previousYear",attrs:{"disabled":!_vm.headerProps.previousYear},on:{"click":function($event){_vm.onInput(_vm.headerProps.previousYear)}}},[_vm._v("<<")]),_c('button',{staticClass:"previousPeriod",attrs:{"disabled":!_vm.headerProps.previousPeriod},on:{"click":function($event){_vm.onInput(_vm.headerProps.previousPeriod)}}},[_vm._v("<")]),_c('button',{staticClass:"nextPeriod",attrs:{"disabled":!_vm.headerProps.nextPeriod},on:{"click":function($event){_vm.onInput(_vm.headerProps.nextPeriod)}}},[_vm._v(">")]),_c('button',{staticClass:"nextYear",attrs:{"disabled":!_vm.headerProps.nextYear},on:{"click":function($event){_vm.onInput(_vm.headerProps.nextYear)}}},[_vm._v(">>")]),_c('button',{staticClass:"currentPeriod",on:{"click":function($event){_vm.onInput(_vm.headerProps.currentPeriod)}}},[_vm._v("Today")])]),_c('div',{staticClass:"periodLabel"},[_vm._t("label",[_vm._v("\n\t\t\t"+_vm._s(_vm.headerProps.periodLabel)+"\n\t\t")])],2)])}
var CalendarViewHeadervue_type_template_id_0e2cc1aa_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/CalendarViewHeader.vue?vue&type=template&id=0e2cc1aa&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CalendarViewHeader.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var CalendarViewHeadervue_type_script_lang_js_ = ({
  name: "CalendarViewHeader",
  props: {
    headerProps: {
      type: Object,
      required: true
    }
  },
  methods: {
    onInput: function onInput(d) {
      this.$emit("input", d);
    }
  }
});
// CONCATENATED MODULE: ./src/components/CalendarViewHeader.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_CalendarViewHeadervue_type_script_lang_js_ = (CalendarViewHeadervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/CalendarViewHeader.vue?vue&type=style&index=0&lang=css&
var CalendarViewHeadervue_type_style_index_0_lang_css_ = __webpack_require__("608f");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/CalendarViewHeader.vue






/* normalize component */

var component = normalizeComponent(
  components_CalendarViewHeadervue_type_script_lang_js_,
  CalendarViewHeadervue_type_template_id_0e2cc1aa_render,
  CalendarViewHeadervue_type_template_id_0e2cc1aa_staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "CalendarViewHeader.vue"
/* harmony default export */ var CalendarViewHeader = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CalendarView.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var CalendarViewvue_type_script_lang_js_ = ({
  name: "CalendarView",
  components: {
    CalendarViewHeader: CalendarViewHeader
  },
  mixins: [CalendarMathMixin],
  props: {
    showDate: {
      type: Date,
      default: undefined
    },
    displayPeriodUom: {
      type: String,
      default: "month"
    },
    displayPeriodCount: {
      type: Number,
      default: 1
    },
    locale: {
      type: String,
      default: undefined
    },
    monthNameFormat: {
      type: String,
      default: "long"
    },
    weekdayNameFormat: {
      type: String,
      default: "short"
    },
    showEventTimes: {
      type: Boolean,
      default: false
    },
    timeFormatOptions: {
      type: Object,
      default: function _default() {}
    },
    disablePast: {
      type: Boolean,
      default: false
    },
    disableFuture: {
      type: Boolean,
      default: false
    },
    enableDragDrop: {
      type: Boolean,
      default: false
    },
    startingDayOfWeek: {
      type: Number,
      default: 0
    },
    events: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    dateClasses: {
      type: Object,
      default: function _default() {}
    },
    eventTop: {
      type: String,
      default: "1.4em"
    },
    eventContentHeight: {
      type: String,
      default: "1.4em"
    },
    calendarHeight: {
      type: Number,
      default: 450
    },
    eventBorderHeight: {
      type: String,
      default: "2px"
    },
    periodChangedCallback: {
      type: Function,
      default: undefined
    },
    weekExpanderText: {
      type: String,
      default: "+"
    }
  },
  data: function data() {
    return {
      currentDragEvent: null,
      currentHoveredEventId: undefined,
      weekHeights: []
    };
  },
  computed: {
    /*
    Props cannot default to computed/method returns, so create defaulted version of this
    property and use it rather than the bare prop (Vue Issue #6013).
    */
    displayLocale: function displayLocale() {
      return this.locale || this.getDefaultBrowserLocale();
    },

    /*
    ShowDate, but defaulted to today. Needed both for periodStart below and for the
    "outside of month" class. Any time component passed as part of showDate is discarded.
    */
    defaultedShowDate: function defaultedShowDate() {
      if (this.showDate) return this.dateOnly(this.showDate);
      return this.today();
    },

    /*
    Given the showDate, defaulted to today, computes the beginning and end of the period
    that the date falls within.
    */
    periodStart: function periodStart() {
      return this.beginningOfPeriod(this.defaultedShowDate, this.displayPeriodUom, this.startingDayOfWeek);
    },
    periodEnd: function periodEnd() {
      return this.addDays(this.incrementPeriod(this.periodStart, this.displayPeriodUom, this.displayPeriodCount), -1);
    },

    /*
    For month and year views, the first and last dates displayed in the grid may not
    be the same as the intended period, since the period may not start and stop evenly
    on the starting day of the week.
    */
    displayFirstDate: function displayFirstDate() {
      return this.beginningOfWeek(this.periodStart, this.startingDayOfWeek);
    },
    displayLastDate: function displayLastDate() {
      return this.endOfWeek(this.periodEnd, this.startingDayOfWeek);
    },

    /*
    Create an array of dates, where each date represents the beginning of a week that
    should be rendered in the view for the current period.
    */
    weeksOfPeriod: function weeksOfPeriod() {
      var _this = this;

      // Returns an array of object representing the date of the beginning of each week
      // included in the view.
      var numWeeks = Math.floor((this.dayDiff(this.displayFirstDate, this.displayLastDate) + 1) / 7);
      return Array(numWeeks).fill().map(function (_, i) {
        return _this.addDays(_this.displayFirstDate, i * 7);
      });
    },
    // Cache the names based on current locale and format settings
    monthNames: function monthNames() {
      return this.getFormattedMonthNames(this.displayLocale, this.monthNameFormat);
    },
    weekdayNames: function weekdayNames() {
      return this.getFormattedWeekdayNames(this.displayLocale, this.weekdayNameFormat, this.startingDayOfWeek);
    },
    // Ensure all event properties have suitable default
    fixedEvents: function fixedEvents() {
      var self = this;
      return this.events.map(function (e) {
        return self.normalizeEvent(e, self.currentHoveredEventId && e.id === self.currentHoveredEventId);
      });
    },
    // Creates the HTML to render the date range for the calendar header.
    periodLabel: function periodLabel() {
      return this.formattedPeriod(this.periodStart, this.periodEnd, this.displayPeriodUom, this.monthNames);
    },
    slotProps: function slotProps() {
      return {
        // Dates for UI navigation
        previousYear: this.getIncrementedPeriod(-12),
        previousPeriod: this.getIncrementedPeriod(-1),
        nextPeriod: this.getIncrementedPeriod(1),
        previousFullPeriod: this.getIncrementedPeriod(-this.displayPeriodCount),
        nextFullPeriod: this.getIncrementedPeriod(this.displayPeriodCount),
        nextYear: this.getIncrementedPeriod(12),
        currentPeriod: this.beginningOfPeriod(this.today(), this.displayPeriodUom, this.startingDayOfWeek),
        // Dates for header display
        periodStart: this.periodStart,
        periodEnd: this.periodEnd,
        // Extra information that could be useful to a custom header
        displayLocale: this.displayLocale,
        displayFirstDate: this.displayFirstDate,
        displayLastDate: this.displayLastDate,
        monthNames: this.monthNames,
        fixedEvents: this.fixedEvents,
        periodLabel: this.periodLabel
      };
    },
    periodRange: function periodRange() {
      return {
        periodStart: this.periodStart,
        periodEnd: this.periodEnd,
        displayFirstDate: this.displayFirstDate,
        displayLastDate: this.displayLastDate
      };
    },
    eventsLength: function eventsLength() {
      return this.events.length;
    }
  },
  watch: {
    periodRange: {
      immediate: true,
      handler: function handler(newVal) {
        if (this.periodChangedCallback) {
          this.$emit("period-changed");
          this.periodChangedCallback(newVal, "watch");
        }
      }
    },
    calendarHeight: {
      handler: function handler() {
        this.measureWeekHeights();
      }
    },
    eventsLength: {
      handler: function handler() {
        this.measureWeekHeights();
      }
    }
  },
  mounted: function mounted() {
    this.measureWeekHeights();
  },
  methods: {
    // ******************************
    // UI Events
    // ******************************
    onClickDay: function onClickDay(day) {
      if (this.disablePast && this.isInPast(day)) return;
      if (this.disableFuture && this.isInFuture(day)) return;
      this.$emit("click-date", day);
    },
    onClickEvent: function onClickEvent(e) {
      this.$emit("click-event", e);
    },

    /*
    The day name header needs to know the dow for class assignment, and this value should
    not change based on startingDayOfWeek (i.e., Sunday is always 0). This function
    computes the dow for a given day index.
    */
    getColumnDOWClass: function getColumnDOWClass(dayIndex) {
      return "dow" + (dayIndex + this.startingDayOfWeek) % 7;
    },
    // ******************************
    // Date Periods
    // ******************************

    /*
    Returns a date for the current display date moved forward or backward by a given
    number of the current display units. Returns null if said move would result in a
    disallowed display period.
    */
    getIncrementedPeriod: function getIncrementedPeriod(count) {
      var newStartDate = this.incrementPeriod(this.periodStart, this.displayPeriodUom, count);
      var newEndDate = this.incrementPeriod(newStartDate, this.displayPeriodUom, this.displayPeriodCount);
      if (this.disablePast && newEndDate <= this.today()) return null;
      if (this.disableFuture && newStartDate > this.today()) return null;
      return newStartDate;
    },
    // ******************************
    // Hover events (#95)
    // ******************************
    onMouseEnter: function onMouseEnter(calendarEvent) {
      this.currentHoveredEventId = calendarEvent.id;
    },
    onMouseLeave: function onMouseLeave() {
      this.currentHoveredEventId = undefined;
    },
    // ******************************
    // Drag and drop events
    // ******************************
    onDragStart: function onDragStart(calendarEvent, windowEvent) {
      if (!this.enableDragDrop) return false; // Not using dataTransfer.setData to store the event ID because it (a) doesn't allow access to the data being
      // dragged during dragover, dragenter, and dragleave events, and because storing an ID requires an unnecessary
      // lookup. This does limit the drop zones to areas within this instance of this component.

      this.currentDragEvent = calendarEvent; // Firefox and possibly other browsers require dataTransfer to be set, even if the value is not used. IE11
      // requires that the first argument be exactly "text" (not "text/plain", etc.).

      windowEvent.dataTransfer.setData("text", "foo");
      this.$emit("drag-start", calendarEvent);
      return true;
    },
    handleDragEvent: function handleDragEvent(bubbleEventName, bubbleParam) {
      if (!this.enableDragDrop) return false;

      if (!this.currentDragEvent) {
        // shouldn't happen
        // If current drag event is not set, check if user has set its own slot for events
        if (!this.$scopedSlots["event"]) return false;
      }

      this.$emit(bubbleEventName, this.currentDragEvent, bubbleParam);
      return true;
    },
    onDragOver: function onDragOver(day) {
      this.handleDragEvent("drag-over-date", day);
    },
    onDragEnter: function onDragEnter(day, windowEvent) {
      if (!this.handleDragEvent("drag-enter-date", day)) return;
      windowEvent.target.classList.add("draghover");
    },
    onDragLeave: function onDragLeave(day, windowEvent) {
      if (!this.handleDragEvent("drag-leave-date", day)) return;
      windowEvent.target.classList.remove("draghover");
    },
    onDrop: function onDrop(day, windowEvent) {
      if (!this.handleDragEvent("drop-on-date", day)) return;
      windowEvent.target.classList.remove("draghover");
    },
    // ******************************
    // Calendar Events
    // ******************************
    findAndSortEventsInWeek: function findAndSortEventsInWeek(weekStart) {
      var _this2 = this;

      // Return a list of events that INCLUDE any day of a week starting on a
      // particular day. Sorted so the events that start earlier are always
      // shown first.
      var events = this.fixedEvents.filter(function (event) {
        return event.startDate < _this2.addDays(weekStart, 7) && event.endDate >= weekStart;
      }, this).sort(function (a, b) {
        if (a.startDate < b.startDate) return -1;
        if (b.startDate < a.startDate) return 1;
        if (a.endDate > b.endDate) return -1;
        if (b.endDate > a.endDate) return 1;
        return a.id < b.id ? -1 : 1;
      });
      return events;
    },
    getWeekEvents: function getWeekEvents(weekStart) {
      // Return a list of events that CONTAIN the week starting on a day.
      // Sorted so the events that start earlier are always shown first.
      var events = this.findAndSortEventsInWeek(weekStart);
      var results = [];
      var eventRows = [[], [], [], [], [], [], []];

      for (var i = 0; i < events.length; i++) {
        var ep = Object.assign({}, events[i], {
          classes: _toConsumableArray(events[i].classes),
          eventRow: 0
        });
        var continued = ep.startDate < weekStart;
        var startOffset = continued ? 0 : this.dayDiff(weekStart, ep.startDate);
        var span = Math.min(7 - startOffset, this.dayDiff(this.addDays(weekStart, startOffset), ep.endDate) + 1);
        if (continued) ep.classes.push("continued");
        if (this.dayDiff(weekStart, ep.endDate) > 6) ep.classes.push("toBeContinued");
        if (this.isInPast(ep.endDate)) ep.classes.push("past");
        if (ep.originalEvent.url) ep.classes.push("hasUrl");

        for (var d = 0; d < 7; d++) {
          if (d === startOffset) {
            var s = 0;

            while (eventRows[d][s]) {
              s++;
            }

            ep.eventRow = s;
            eventRows[d][s] = true;
          } else if (d < startOffset + span) {
            eventRows[d][ep.eventRow] = true;
          }
        }

        ep.offset = startOffset;
        ep.span = span;
        ep.classes.push("offset".concat(startOffset));
        ep.classes.push("span".concat(span));
        results.push(ep);
      }

      return results;
    },

    /*
    Creates the HTML to prefix the event title showing the event's start and/or
    end time. Midnight is not displayed.
    */
    getFormattedTimeRange: function getFormattedTimeRange(e) {
      var startTime = this.formattedTime(e.startDate, this.displayLocale, this.timeFormatOptions);
      var endTime = "";

      if (!this.isSameDateTime(e.startDate, e.endDate)) {
        endTime = this.formattedTime(e.endDate, this.displayLocale, this.timeFormatOptions);
      }

      return (startTime !== "" ? "<span class=\"startTime\">".concat(startTime, "</span>") : "") + (endTime !== "" ? "<span class=\"endTime\">".concat(endTime, "</span>") : "");
    },
    getEventTitle: function getEventTitle(e) {
      if (!this.showEventTimes) return e.title;
      return this.getFormattedTimeRange(e) + " " + e.title;
    },
    getEventTop: function getEventTop(e) {
      // Compute the top position of the event based on its assigned row within the given week.
      var r = e.eventRow;
      var h = this.eventContentHeight;
      var b = this.eventBorderHeight;
      return "calc(".concat(this.eventTop, " + ").concat(r, "*").concat(h, " + ").concat(r, "*").concat(b, ")");
    },
    measureWeekHeights: function measureWeekHeights() {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.weekHeights.length = _this3.weeksOfPeriod.length;

        for (var i = 0; i < _this3.weeksOfPeriod.length; i++) {
          if (_this3.$refs[i + "-week"]) {
            var weekRowEl = _this3.$refs[i + "-week"][0];

            _this3.$set(_this3.weekHeights, i, {
              contentHeight: weekRowEl.scrollHeight + 5,
              rowHeight: weekRowEl.clientHeight,
              overflow: weekRowEl.scrollHeight - weekRowEl.clientHeight,
              expanded: false
            });
          }
        }
      });
    },
    toggleWeekExpansion: function toggleWeekExpansion(weekIndex) {
      var newState = !this.weekHeights[weekIndex].expanded; // Collapse all weeks

      for (var i = 0; i < this.weekHeights.length; i++) {
        this.weekHeights[i].expanded = false;
      }

      this.weekHeights[weekIndex].expanded = newState;
    }
  }
});
// CONCATENATED MODULE: ./src/components/CalendarView.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_CalendarViewvue_type_script_lang_js_ = (CalendarViewvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/CalendarView.vue?vue&type=style&index=0&lang=css&
var CalendarViewvue_type_style_index_0_lang_css_ = __webpack_require__("a45d");

// CONCATENATED MODULE: ./src/components/CalendarView.vue






/* normalize component */

var CalendarView_component = normalizeComponent(
  components_CalendarViewvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

CalendarView_component.options.__file = "CalendarView.vue"
/* harmony default export */ var CalendarView = (CalendarView_component.exports);
// CONCATENATED MODULE: ./src/components/bundle.js


 // Export the compiled Vue components, and also the mixin for those who wish to use
// those methods in their own custom headers, etc.


// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js
/* concated harmony reexport CalendarView */__webpack_require__.d(__webpack_exports__, "CalendarView", function() { return CalendarView; });
/* concated harmony reexport CalendarViewHeader */__webpack_require__.d(__webpack_exports__, "CalendarViewHeader", function() { return CalendarViewHeader; });
/* concated harmony reexport CalendarMathMixin */__webpack_require__.d(__webpack_exports__, "CalendarMathMixin", function() { return CalendarMathMixin; });




/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
//# sourceMappingURL=CalendarView.common.js.map