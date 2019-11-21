exports.ids = ["user.register"];
exports.modules = [
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnySchema; });
class AnySchema {
    constructor() {
        this.validators = [];
        this.validators.push({
            priority: -1,
            type: 'any.required',
            validate: (value, path) => {
                if (value == null || value === '') {
                    return {
                        stop: true,
                        error: {
                            type: 'any.required',
                            message: 'is required',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
    }
    optional() {
        this.validators.push({
            priority: -2,
            type: 'any.optional',
            validate: value => {
                if (value === undefined) {
                    return {
                        stop: true,
                    };
                }
                return null;
            },
        });
        return this;
    }
    nullable() {
        this.validators.push({
            priority: -2,
            type: 'any.nullable',
            validate: value => {
                if (value === null) {
                    return {
                        stop: true,
                    };
                }
                return null;
            },
        });
        return this;
    }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getValidateResult; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return validate; });
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);


const getValidateResult = (value, schema, path = []) => {
    const validators = [...schema.validators];
    validators.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const ret = {
        value: value,
        errors: [],
    };
    for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        const fnRet = validator.validate(ret.value, path);
        if (!fnRet) {
            continue;
        }
        if (fnRet.error) {
            ret.errors.push(fnRet.error);
        }
        if (fnRet.errors) {
            ret.errors = ret.errors.concat(fnRet.errors);
        }
        if (fnRet.hasOwnProperty('value')) {
            ret.value = fnRet.value;
        }
        if (fnRet.stop) {
            break;
        }
    }
    return ret;
};
const validate = (value, schema, rootName) => {
    const { value: newValue, errors } = getValidateResult(value, schema, rootName ? [rootName] : []);
    if (errors.length) {
        const error = new _ValidationError__WEBPACK_IMPORTED_MODULE_0__[/* ValidationError */ "a"]('Validation error: ' + Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* formatErrors */ "a"])(errors), errors);
        throw error;
    }
    return newValue;
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjectSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _validate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


class ObjectSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'object';
        this._keys = null;
        this._allowUnknown = false;
        this.validators.push({
            type: 'object.base',
            validate: (value, path) => {
                if (value === null ||
                    Array.isArray(value) ||
                    typeof value !== 'object') {
                    return {
                        stop: true,
                        error: {
                            type: 'object.base',
                            message: 'must be an object',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        this.validators.push({
            type: 'object.keys',
            validate: (value, path) => {
                if (!this._keys) {
                    return null;
                }
                const errors = [];
                let newValue;
                let isNewValueCloned = false;
                Object.keys({
                    ...this._keys,
                    ...value,
                }).forEach(key => {
                    const propValue = value[key];
                    const propSchema = this._keys[key];
                    const propPath = [...path, key];
                    if (!propSchema) {
                        if (this._allowUnknown) {
                            return;
                        }
                        errors.push({
                            message: 'is not allowed',
                            value: propValue,
                            path: propPath,
                            type: 'object.allowUnknown',
                        });
                        return;
                    }
                    const result = Object(_validate__WEBPACK_IMPORTED_MODULE_1__[/* getValidateResult */ "a"])(propValue, propSchema, propPath);
                    errors.push(...result.errors);
                    if (result.value !== propValue) {
                        if (!isNewValueCloned) {
                            isNewValueCloned = true;
                            newValue = { ...value };
                        }
                        newValue[key] = result.value;
                    }
                });
                if (errors.length) {
                    return {
                        stop: true,
                        errors,
                    };
                }
                if (isNewValueCloned) {
                    return {
                        value: newValue,
                    };
                }
                return null;
            },
        });
    }
    keys(schema) {
        this._keys = schema;
        return this;
        // ExtractObject<typeof schema>
    }
    unknown() {
        this._allowUnknown = true;
        return this;
    }
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValidationError; });
class ValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContractError; });
class ContractError extends Error {
    constructor(original, entries) {
        super('ContractError: ' + original.message);
        this.original = original;
        this.entries = entries;
    }
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony reexport (checked) */ if(__webpack_require__.o(_src_index__WEBPACK_IMPORTED_MODULE_0__, "S")) __webpack_require__.d(__webpack_exports__, "S", function() { return _src_index__WEBPACK_IMPORTED_MODULE_0__["S"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_src_index__WEBPACK_IMPORTED_MODULE_0__, "validate")) __webpack_require__.d(__webpack_exports__, "validate", function() { return _src_index__WEBPACK_IMPORTED_MODULE_0__["validate"]; });




/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "S", function() { return S; });
/* harmony import */ var _StringSchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _ObjectSchema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _ArraySchema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _EnumSchema__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _NumberSchema__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(14);
/* harmony import */ var _BooleanSchema__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(15);
/* harmony import */ var _DateSchema__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(16);
/* harmony import */ var _OrSchema__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(17);
/* harmony import */ var _convert_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(18);
/* harmony import */ var _convert_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_convert_types__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(19);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_10__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_types__WEBPACK_IMPORTED_MODULE_10__, "validate")) __webpack_require__.d(__webpack_exports__, "validate", function() { return _types__WEBPACK_IMPORTED_MODULE_10__["validate"]; });

/* harmony import */ var _validate__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(4);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "validate", function() { return _validate__WEBPACK_IMPORTED_MODULE_11__["b"]; });

/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(6);









const S = {
    any() {
        return new _AnySchema__WEBPACK_IMPORTED_MODULE_1__[/* AnySchema */ "a"]();
    },
    string() {
        return new _StringSchema__WEBPACK_IMPORTED_MODULE_0__[/* StringSchema */ "a"]();
    },
    object() {
        return new _ObjectSchema__WEBPACK_IMPORTED_MODULE_2__[/* ObjectSchema */ "a"]();
    },
    array() {
        return new _ArraySchema__WEBPACK_IMPORTED_MODULE_3__[/* ArraySchema */ "a"]();
    },
    enum() {
        return new _EnumSchema__WEBPACK_IMPORTED_MODULE_4__[/* EnumSchema */ "a"]();
    },
    number() {
        return new _NumberSchema__WEBPACK_IMPORTED_MODULE_5__[/* NumberSchema */ "a"]();
    },
    boolean() {
        return new _BooleanSchema__WEBPACK_IMPORTED_MODULE_6__[/* BooleanSchema */ "a"]();
    },
    date() {
        return new _DateSchema__WEBPACK_IMPORTED_MODULE_7__[/* DateSchema */ "a"]();
    },
    or() {
        return new _OrSchema__WEBPACK_IMPORTED_MODULE_8__[/* OrSchema */ "a"]();
    },
};







/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StringSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

const emailReg = /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
class StringSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'string';
        this.validators.push({
            type: 'string.base',
            validate: (value, path) => {
                if (typeof value !== 'string') {
                    return {
                        stop: true,
                        error: {
                            type: 'string.base',
                            message: 'must be a string',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
    }
    min(min) {
        this.validators.push({
            priority: 2,
            type: 'string.min',
            validate: (value, path) => {
                if (value.length < min) {
                    return {
                        stop: true,
                        error: {
                            type: 'string.min',
                            message: `length must be at least ${min} characters long`,
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    max(max) {
        this.validators.push({
            priority: 2,
            type: 'string.max',
            validate: (value, path) => {
                if (value.length > max) {
                    return {
                        stop: true,
                        error: {
                            type: 'string.max',
                            message: `length must be less than or equal to ${max} characters long`,
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    trim() {
        this.validators.push({
            priority: 1,
            type: 'string.trim',
            validate: (value) => {
                const trimmed = value.trim();
                if (trimmed !== value) {
                    return {
                        value: trimmed,
                    };
                }
                return null;
            },
        });
        return this;
    }
    regex(reg) {
        this.validators.push({
            type: 'string.regex',
            validate: (value, path) => {
                if (!reg.test(value)) {
                    return {
                        stop: true,
                        error: {
                            type: 'string.regex',
                            message: `must match regex ${reg}`,
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    email() {
        this.validators.push({
            type: 'string.email',
            validate: (value, path) => {
                if (!emailReg.test(value)) {
                    return {
                        stop: true,
                        error: {
                            type: 'string.email',
                            message: `must a valid email`,
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isSchemaMap */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return schemaLikeToSchema; });
/* unused harmony export formatPath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return formatErrors; });
/* harmony import */ var _ObjectSchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

const isSchemaMap = (obj) => {
    return obj.constructor.name === 'Object';
};
const schemaLikeToSchema = (obj) => {
    if (isSchemaMap(obj)) {
        return new _ObjectSchema__WEBPACK_IMPORTED_MODULE_0__[/* ObjectSchema */ "a"]().keys(obj);
    }
    return obj;
};
const formatPath = (path) => {
    let ret = path[0];
    for (let i = 1; i < path.length; i++) {
        if (typeof path[i] === 'string') {
            ret += '.' + path[i];
        }
        else {
            ret += `[${path[i]}]`;
        }
    }
    return ret;
};
const formatErrors = (errors) => {
    return errors
        .map(error => {
        const path = formatPath(error.path);
        return `'${path}' ${error.message}.`;
    })
        .join(' ');
};


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArraySchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _validate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);



class ArraySchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'array';
        this._typeSchema = null;
        this.validators.push({
            type: 'array.base',
            validate: (value, path) => {
                if (!Array.isArray(value)) {
                    return {
                        stop: true,
                        error: {
                            type: 'array.base',
                            message: 'must be an array',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        this.validators.push({
            type: 'array.items',
            validate: (value, path) => {
                if (!this._typeSchema) {
                    return null;
                }
                const errors = [];
                let isModified = false;
                const newValue = value.map((item, i) => {
                    const result = Object(_validate__WEBPACK_IMPORTED_MODULE_1__[/* getValidateResult */ "a"])(item, Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* schemaLikeToSchema */ "b"])(this._typeSchema), [...path, i]);
                    errors.push(...result.errors);
                    if (result.value !== item) {
                        isModified = true;
                    }
                    return result.value;
                });
                if (errors.length) {
                    return {
                        stop: true,
                        errors,
                    };
                }
                if (isModified) {
                    return { value: newValue };
                }
                return null;
            },
        });
    }
    items(typeSchema) {
        this._typeSchema = typeSchema;
        return this;
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EnumSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

class EnumSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'enum';
        this.allowedValues = null;
        this.validators.push({
            priority: -100,
            type: 'enum.validation',
            validate: () => {
                if (!this.allowedValues) {
                    throw new Error('Enum value not set');
                }
                return null;
            },
        });
        this.validators.push({
            type: 'enum.base',
            validate: (value, path) => {
                for (const allowed of this.allowedValues) {
                    if (String(allowed).toLowerCase() === String(value).toLowerCase()) {
                        return {
                            value: allowed,
                        };
                    }
                }
                return {
                    stop: true,
                    error: {
                        type: 'enum.base',
                        message: 'must be an enum: ' + this.allowedValues.join(', '),
                        path,
                        value,
                    },
                };
            },
        });
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
    values(values) {
        this.allowedValues = values;
        return this;
    }
    literal(...values) {
        this.allowedValues = values;
        return this;
    }
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NumberSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

class NumberSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'number';
        this.validators.push({
            type: 'number.base',
            validate: (value, path) => {
                if (typeof value === 'string') {
                    const parsed = Number(value);
                    if (!isNaN(parsed)) {
                        return {
                            value: parsed,
                        };
                    }
                }
                if (typeof value !== 'number') {
                    return {
                        stop: true,
                        error: {
                            type: 'number.base',
                            message: 'must be a number',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
    }
    integer() {
        this.validators.push({
            type: 'number.integer',
            validate: (value, path) => {
                if (!Number.isInteger(value)) {
                    return {
                        stop: true,
                        error: {
                            type: 'number.integer',
                            message: 'must be an integer',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    min(min) {
        this.validators.push({
            priority: 2,
            type: 'number.min',
            validate: (value, path) => {
                if (value < min) {
                    return {
                        stop: true,
                        error: {
                            type: 'number.base',
                            message: `must be greater or equal to ${min}`,
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    max(max) {
        this.validators.push({
            priority: 2,
            type: 'number.max',
            validate: (value, path) => {
                if (value > max) {
                    return {
                        stop: true,
                        error: {
                            type: 'number.base',
                            message: `must be less or equal to ${max}`,
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
        return this;
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BooleanSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

class BooleanSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'boolean';
        this.validators.push({
            type: 'boolean.base',
            validate: (value, path) => {
                if (typeof value === 'string') {
                    if (value === 'true' || value === 'false') {
                        return {
                            value: value === 'true',
                        };
                    }
                }
                if (typeof value !== 'boolean') {
                    return {
                        stop: true,
                        error: {
                            type: 'boolean.base',
                            message: 'must be a boolean',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

const isoDate = /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/;
class DateSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'date';
        this.validators.push({
            type: 'date.base',
            validate: (value, path) => {
                if (typeof value === 'string') {
                    if (isoDate.test(value)) {
                        return {
                            value: new Date(value),
                        };
                    }
                }
                const isDate = value instanceof Date;
                if (!isDate || value.toString() === 'Invalid Date') {
                    return {
                        stop: true,
                        error: {
                            type: 'data.base',
                            message: 'must be a data',
                            path,
                            value,
                        },
                    };
                }
                return null;
            },
        });
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
}


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrSchema; });
/* harmony import */ var _AnySchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _validate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


class OrSchema extends _AnySchema__WEBPACK_IMPORTED_MODULE_0__[/* AnySchema */ "a"] {
    constructor() {
        super();
        this.schema = 'or';
        this.allowedValues = null;
        this.validators.push({
            priority: -100,
            type: 'or.validation',
            validate: () => {
                if (!this.allowedValues) {
                    throw new Error('Or value not set');
                }
                return null;
            },
        });
        this.validators.push({
            type: 'or.base',
            validate: (value, path) => {
                for (const schema of this.allowedValues) {
                    if (!Object(_validate__WEBPACK_IMPORTED_MODULE_1__[/* getValidateResult */ "a"])(value, schema).errors.length) {
                        return null;
                    }
                }
                return {
                    stop: true,
                    error: {
                        type: 'or.base',
                        message: 'must one of the required formats',
                        path,
                        value,
                    },
                };
            },
        });
    }
    items(...values) {
        this.allowedValues = values;
        return this;
    }
    optional() {
        return super.optional();
    }
    nullable() {
        return super.nullable();
    }
}


/***/ }),
/* 18 */
/***/ (function(module, exports) {



/***/ }),
/* 19 */
/***/ (function(module, exports) {



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _initialize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initialize", function() { return _initialize__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony import */ var _ContractError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_2__);





/***/ }),
/* 21 */
/***/ (function(module, exports) {



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "async_hooks"
var external_async_hooks_ = __webpack_require__(2);
var external_async_hooks_default = /*#__PURE__*/__webpack_require__.n(external_async_hooks_);

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/ContractHook.ts

class ContractHook_ContractHook {
    constructor() {
        this.asyncHook = null;
        this.rootMapping = new Map();
        this.context = new Map();
        this.asyncHook = external_async_hooks_default.a.createHook({
            init: (asyncId, type, triggerAsyncId, resource) => {
                if (this.rootMapping.has(triggerAsyncId)) {
                    const rootId = this.rootMapping.get(triggerAsyncId);
                    this.rootMapping.set(asyncId, rootId);
                }
            },
            destroy: asyncId => {
                this.rootMapping.delete(asyncId);
                this.context.delete(asyncId);
            },
        });
    }
    getContext() {
        const asyncId = this.getCurrentRoot();
        if (!this.context.has(asyncId)) {
            throw new Error('Context is not set');
        }
        return this.context.get(asyncId);
    }
    setContext(data) {
        const asyncId = this.getCurrentRoot();
        this.context.set(asyncId, data);
    }
    isNewScope() {
        const asyncId = external_async_hooks_default.a.executionAsyncId();
        return !this.rootMapping.has(asyncId);
    }
    async runInNewScope(fn) {
        const asyncResource = new external_async_hooks_default.a.AsyncResource('ROOT_CONTRACT');
        const asyncId = asyncResource.asyncId();
        this.rootMapping.set(asyncId, asyncId);
        return asyncResource.runInAsyncScope(fn);
    }
    enable() {
        this.asyncHook.enable();
    }
    disable() {
        this.asyncHook.disable();
    }
    getCurrentRoot() {
        const asyncId = this.rootMapping.get(external_async_hooks_default.a.executionAsyncId());
        if (asyncId == null) {
            throw new Error('rootId not found');
        }
        return asyncId;
    }
}

// EXTERNAL MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/schema/index.ts
var packages_schema = __webpack_require__(8);

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/combineObject.ts
function combineObject(params, arr) {
    const ret = {};
    arr.forEach((arg, i) => {
        ret[params[i]] = arg;
    });
    return ret;
}

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/wrapValidate.ts


function wrapValidate(options) {
    const { keysSchema, method, paramNames } = options;
    return (async (...args) => {
        const value = combineObject(paramNames, args);
        const normalized = Object(packages_schema["validate"])(value, packages_schema["S"].object().keys(keysSchema || {}));
        const newArgs = [];
        // V will normalize values
        // for example string number '1' to 1
        // if schema type is number
        paramNames.forEach(param => {
            newArgs.push(normalized[param]);
        });
        return method(...newArgs);
    });
}

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(0);

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/serializeObject.ts

/**
 * Remove invalid properties from the object and hide long arrays
 * @param  obj the object
 * @returns the new object with removed properties
 * @private
 */
function _sanitizeObject(config, obj) {
    if (obj === undefined) {
        return obj;
    }
    const seen = [];
    return JSON.parse(JSON.stringify(obj, (name, value) => {
        if (seen.indexOf(value) !== -1) {
            return '[Circular]';
        }
        if (value != null && typeof value === 'object') {
            seen.push(value);
        }
        // Array of field names that should not be logged
        // add field if necessary (password, tokens etc)
        if (config.removeFields.indexOf(name) !== -1) {
            return '<removed>';
        }
        if (Array.isArray(value) && value.length > config.maxArrayLength) {
            return `Array(${value.length})`;
        }
        return value;
    }));
}
function serializeObject(config, obj) {
    return external_util_["inspect"](_sanitizeObject(config, obj), { depth: config.depth });
}

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/_serializeInput.ts


function _serializeInput(config, paramNames, args) {
    return paramNames.length
        ? serializeObject(config, combineObject(paramNames, args))
        : '{ }';
}

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/wrapLog.ts


function wrapLog(options) {
    const { method, signature, paramNames, removeOutput, config } = options;
    const logExit = (output) => {
        if (!config.debug) {
            return;
        }
        const formattedOutput = removeOutput
            ? '<removed>'
            : serializeObject(config, output);
        config.debugExit(signature, formattedOutput);
        return output;
    };
    const logEnter = (args) => {
        if (!config.debug) {
            return;
        }
        const formattedInput = _serializeInput(config, paramNames, args);
        config.debugEnter(signature, formattedInput);
    };
    return async function logDecorator(...args) {
        logEnter(args);
        const result = await method(...args);
        logExit(result);
        return result;
    };
}

// EXTERNAL MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/ContractError.ts
var ContractError = __webpack_require__(7);

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/_createContract.ts




const _createContract = (config, hook) => (signature) => {
    const contract = {};
    let options = {
        removeOutput: false,
    };
    let params = [];
    let schema = null;
    const meta = {
        getSchema: () => schema,
    };
    contract.params = (...args) => {
        params = args;
        return contract;
    };
    contract.schema = (arg) => {
        schema = arg;
        return contract;
    };
    contract.config = (value) => {
        config = { ...config, ...value };
        return contract;
    };
    contract.options = (value) => {
        options = { ...options, ...value };
        return contract;
    };
    contract.fn = (fn) => {
        const wrappedFunction = async (...args) => {
            const withValidation = wrapValidate({
                keysSchema: schema,
                method: fn,
                paramNames: params,
            });
            const withLogging = wrapLog({
                signature,
                method: withValidation,
                paramNames: params,
                config,
                removeOutput: options.removeOutput,
            });
            const isNewScope = hook.isNewScope();
            try {
                if (isNewScope) {
                    const a = await hook.runInNewScope(() => withLogging(...args));
                    return a;
                }
                else {
                    return await withLogging(...args);
                }
            }
            catch (e) {
                const input = _serializeInput(config, params, args);
                if (e instanceof ContractError["a" /* ContractError */]) {
                    e.entries.unshift({
                        signature,
                        input,
                    });
                    throw e;
                }
                else {
                    throw new ContractError["a" /* ContractError */](e, [
                        {
                            signature,
                            input,
                        },
                    ]);
                }
            }
        };
        const ret = Object.assign(wrappedFunction, meta);
        return ret;
    };
    return contract;
};

// CONCATENATED MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/src/initialize.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initialize; });


const defaultConfig = {
    removeFields: ['password', 'token', 'accessToken'],
    debug: true,
    depth: 4,
    maxArrayLength: 30,
    debugEnter: (signature, formattedInput) => {
        // tslint:disable-next-line:no-console
        console.log(`ENTER ${signature}:`, formattedInput);
    },
    debugExit: (signature, formattedOutput) => {
        // tslint:disable-next-line:no-console
        console.log(`EXIT ${signature}:`, formattedOutput);
    },
};
function initialize(config = {}) {
    const hook = new ContractHook_ContractHook();
    hook.enable();
    return {
        createContract: _createContract({
            ...defaultConfig,
            ...config,
        }, hook),
        runWithContext: async (context, fn) => {
            await hook.runInNewScope(() => {
                hook.setContext(context);
                return fn();
            });
        },
        getContext: () => hook.getContext(),
        disable: () => {
            hook.disable();
        },
    };
}


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony reexport (checked) */ if(__webpack_require__.o(_src_index__WEBPACK_IMPORTED_MODULE_0__, "initialize")) __webpack_require__.d(__webpack_exports__, "initialize", function() { return _src_index__WEBPACK_IMPORTED_MODULE_0__["initialize"]; });




/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/schema/index.ts
var schema = __webpack_require__(8);

// EXTERNAL MODULE: /Users/sky/work/practice-dev/practice-dev-repo/packages/contract/index.ts
var contract = __webpack_require__(23);

// CONCATENATED MODULE: ./src/lib.ts

function createRpcBinding(options) {
    return {
        isBinding: true,
        type: 'rpc',
        options,
    };
}
const { createContract } = Object(contract["initialize"])({
    debug: "production" === 'development',
});
// import { ContractBinding } from 'contract';
// import { AppEvent } from '../types';
// export function addEventBinding() {
//   ContractBinding.prototype.event = function(options) {
//     this.fn.eventOptions = options;
//     return this.fn as any;
//   };
// }
// type MapEvents<T> = T extends { type: string }
//   ? { type: T['type']; handler: (event: T) => Promise<any> }
//   : never;
// type EventOptions = MapEvents<AppEvent>;
// declare module 'defensive' {
//   interface ContractBinding<T> {
//     eventOptions?: EventOptions;
//     event(options: EventOptions): T & ContractBinding<T>;
//   }
// }

// CONCATENATED MODULE: ./src/contracts/user/register.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerRpc", function() { return registerRpc; });


const register = createContract('user.register')
    .params('values')
    .schema({
    values: schema["S"].object().keys({
        username: schema["S"].string(),
    }),
})
    .fn(async (values) => {
    const userId = Date.now();
    console.log(`user ${userId} registered`);
    return {
        ok: 123,
    };
});
const registerRpc = createRpcBinding({
    public: true,
    signature: 'user.register',
    handler: register,
});


/***/ })
];;