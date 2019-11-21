(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "0" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// require() chunk loading for javascript
/******/
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./" + chunkId + ".app-lambda.js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
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
/******/ 	// uncaught error handler for webpack runtime
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using import().catch()
/******/ 		});
/******/ 	};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(0);
var external_util_default = /*#__PURE__*/__webpack_require__.n(external_util_);

// CONCATENATED MODULE: ./src/api-mapping.ts
const apiMapping = {
    'user.register': () => __webpack_require__.e(/* import() | user.register */ "user.register").then(__webpack_require__.bind(null, 24)).then(x => x['registerRpc']),
};

// CONCATENATED MODULE: ./src/handler.ts

async function handler(rpcMethod, rpcParams, authToken) {
    const getFn = apiMapping[rpcMethod];
    if (!getFn) {
        throw new Error('RPC Method not found');
    }
    const { options } = await getFn();
    if (!options.public && !authToken) {
        throw new Error('authToken required');
    }
    return await options.handler(...rpcParams);
}

// CONCATENATED MODULE: ./src/lambda.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return lambda_handler; });


// import { eventMapping } from './event-mapping';
function getAppEvent(event) {
    const record = event.Records[0];
    if ('Sns' in record) {
        return JSON.parse(record.Sns.Message);
    }
    throw new Error('Not supported event type');
}
async function lambda_handler(event) {
    if ('Records' in event) {
        const appEvent = getAppEvent(event);
        // const fns = eventMapping[appEvent.type];
        const fns = [];
        if (!fns.length) {
            return;
        }
        if (fns.length > 1) {
            throw new Error('Not implemented');
        }
        const fn = await fns[0]();
        await fn.eventOptions.handler(appEvent);
        return;
    }
    try {
        const exec = /\/rpc\/(.+)/.exec(event.path);
        if (!exec) {
            throw new Error('Invalid url');
        }
        if (event.httpMethod !== 'POST') {
            throw new Error('Method must be POST');
        }
        let params;
        if (!event.body) {
            throw new Error('Body required');
        }
        try {
            params = JSON.parse(event.body);
        }
        catch (e) {
            throw new Error('Invalid JSON');
        }
        if (!Array.isArray(params)) {
            throw new Error('Request body must be an array');
        }
        const ret = await handler(exec[1], params, event.headers['x-token']);
        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                result: ret,
            }),
        };
    }
    catch (e) {
        const serialized = external_util_default.a.inspect(e, { depth: null });
        console.error(event.requestContext.requestId, serialized);
        return {
            statusCode: 400,
            body: JSON.stringify({
                ok: false,
                error: e.message,
                requestId: event.requestContext.requestId,
            }),
        };
    }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("async_hooks");

/***/ })
/******/ ])));