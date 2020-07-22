import { api } from './services/api';
import { registry } from './registry';

// source https://github.com/sindresorhus/serialize-error/blob/9592a668a011cde29a2f60e39f54c6a4eed6f1db/index.js#L33
// MIT

const commonProperties = [
  { property: 'name', enumerable: false },
  { property: 'message', enumerable: false },
  { property: 'stack', enumerable: false },
  { property: 'code', enumerable: true },
];

const destroyCircular = ({ from, seen, to_, forceEnumerable }: any) => {
  const to = to_ || (Array.isArray(from) ? [] : {});

  seen.push(from);

  for (const [key, value] of Object.entries(from)) {
    if (typeof value === 'function') {
      continue;
    }

    if (!value || typeof value !== 'object') {
      to[key] = value;
      continue;
    }

    if (!seen.includes(from[key])) {
      to[key] = destroyCircular({
        from: from[key],
        seen: seen.slice(),
        forceEnumerable,
      });
      continue;
    }

    to[key] = '[Circular]';
  }

  for (const { property, enumerable } of commonProperties) {
    if (typeof from[property] === 'string') {
      Object.defineProperty(to, property, {
        value: from[property],
        enumerable: forceEnumerable ? true : enumerable,
        configurable: true,
        writable: true,
      });
    }
  }

  return to;
};

const serialize = (value: any) => {
  if (typeof value === 'object' && value !== null) {
    return destroyCircular({ from: value, seen: [], forceEnumerable: true });
  }

  // People sometimes throw things besides Error objects…
  if (typeof value === 'function') {
    // `JSON.stringify()` discards functions. We do too, unless a function is thrown directly.
    return `[Function: ${value.name || 'anonymous'}]`;
  }

  return value;
};

const removeFields = ['password', 'confirmPassword'];
const maxArrayLength = 20;

function _sanitizeObject(obj: any) {
  if (obj === undefined) {
    return obj;
  }
  const seen: any[] = [];
  return JSON.parse(
    JSON.stringify(obj, (name, value) => {
      if (seen.indexOf(value) !== -1) {
        return '[Circular]';
      }
      if (value != null && typeof value === 'object') {
        seen.push(value);
      }
      // Array of field names that should not be logged
      // add field if necessary (password, tokens etc)
      if (removeFields.indexOf(name) !== -1) {
        return '<removed>';
      }
      if (Array.isArray(value) && value.length > maxArrayLength) {
        return `Array(${value.length})`;
      }
      return value;
    })
  );
}

function getStore() {
  try {
    return _sanitizeObject(registry.getState());
  } catch (e) {
    return 'Failed to serialize store';
  }
}

export function initErrorReporter() {
  const orgConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    orgConsoleError(...args);
    api
      .errorReporting_reportFrontendError({
        userAgent: navigator.userAgent,
        errorLogArgs: args.map(serialize),
        store: getStore(),
      })
      .toPromise();
  };

  window.onerror = function (message, source, lineno, colno, error) {
    if (message === 'ResizeObserver loop limit exceeded') {
      return;
    }
    api
      .errorReporting_reportFrontendError({
        userAgent: navigator.userAgent,
        unhandledError: serialize({
          message,
          source,
          lineno,
          colno,
          error,
        }),
        store: getStore(),
      })
      .toPromise();
  };
}
