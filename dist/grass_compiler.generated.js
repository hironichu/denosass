// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file
// source-hash: 9a8a5d1f2e73b6a525f244bf971aba6302dcf719
let wasm;

import {
  is_dir,
  is_file,
  read,
} from "./snippets/grass_compiler-72054e2906cd2439/fs.js";

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) {
  return heap[idx];
}

let heap_next = heap.length;

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

const cachedTextEncoder = new TextEncoder("utf-8");

const encodeString = function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

const cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}
/**
 * @param {string} p
 * @param {JSOptions} options
 * @returns {string}
 */
export function from_string(p, options) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      p,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(options, JSOptions);
    var ptr1 = options.ptr;
    options.ptr = 0;
    wasm.from_string(retptr, ptr0, len0, ptr1);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr2 = r0;
    var len2 = r1;
    if (r3) {
      ptr2 = 0;
      len2 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr2, len2);
  }
}

/**
 * @returns {JSOptions}
 */
export function get_config() {
  const ret = wasm.get_config();
  return JSOptions.__wrap(ret);
}

/**
 * @param {string} path
 * @param {JSOptions} options
 * @returns {string}
 */
export function from_file(path, options) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      path,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(options, JSOptions);
    var ptr1 = options.ptr;
    options.ptr = 0;
    wasm.from_file(retptr, ptr0, len0, ptr1);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr2 = r0;
    var len2 = r1;
    if (r3) {
      ptr2 = 0;
      len2 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr2, len2);
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

const JSOptionsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_jsoptions_free(ptr)
);
/**
 * Bellow is the part where WASM is added to the library
 * This library uses a custom FS system for Deno.
 * please note that it could be modified for NodeJS or even the browser.
 */
export class JSOptions {
  static __wrap(ptr) {
    const obj = Object.create(JSOptions.prototype);
    obj.ptr = ptr;
    JSOptionsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    JSOptionsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_jsoptions_free(ptr);
  }
  /**
   * @returns {Array<any>}
   */
  get load_paths() {
    const ret = wasm.__wbg_get_jsoptions_load_paths(this.ptr);
    return takeObject(ret);
  }
  /**
   * @param {Array<any>} arg0
   */
  set load_paths(arg0) {
    wasm.__wbg_set_jsoptions_load_paths(this.ptr, addHeapObject(arg0));
  }
  /**
   * @returns {string}
   */
  get style() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_jsoptions_style(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} arg0
   */
  set style(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_jsoptions_style(this.ptr, ptr0, len0);
  }
  /**
   * @returns {boolean}
   */
  get quiet() {
    const ret = wasm.__wbg_get_jsoptions_quiet(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set quiet(arg0) {
    wasm.__wbg_set_jsoptions_quiet(this.ptr, arg0);
  }
  /**
   * @returns {boolean}
   */
  get unicode_error_messages() {
    const ret = wasm.__wbg_get_jsoptions_unicode_error_messages(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set unicode_error_messages(arg0) {
    wasm.__wbg_set_jsoptions_unicode_error_messages(this.ptr, arg0);
  }
  /**
   * @returns {string}
   */
  get input_syntax() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_jsoptions_input_syntax(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} arg0
   */
  set input_syntax(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_jsoptions_input_syntax(this.ptr, ptr0, len0);
  }
  /**
   * @returns {boolean}
   */
  get allows_charset() {
    const ret = wasm.__wbg_get_jsoptions_allows_charset(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set allows_charset(arg0) {
    wasm.__wbg_set_jsoptions_allows_charset(this.ptr, arg0);
  }
}

const imports = {
  __wbindgen_placeholder__: {
    __wbindgen_object_drop_ref: function (arg0) {
      takeObject(arg0);
    },
    __wbg_isfile_fd912e715d043d7d: function (arg0, arg1) {
      const ret = is_file(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_isdir_7a6a6d22f6f8c9eb: function (arg0, arg1) {
      const ret = is_dir(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_read_8b91e5635bb06129: function (arg0, arg1, arg2) {
      const ret = read(getStringFromWasm0(arg1, arg2));
      const ptr0 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_string_get: function (arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof (obj) === "string" ? obj : undefined;
      var ptr0 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(
          ret,
          wasm.__wbindgen_malloc,
          wasm.__wbindgen_realloc,
        );
      var len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_object_clone_ref: function (arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbindgen_string_new: function (arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbg_randomFillSync_6894564c2c334c42: function () {
      return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_getRandomValues_805f1c3d65988a5a: function () {
      return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments);
    },
    __wbg_crypto_e1d53a1d73fb10b8: function (arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbindgen_is_object: function (arg0) {
      const val = getObject(arg0);
      const ret = typeof (val) === "object" && val !== null;
      return ret;
    },
    __wbg_process_038c26bf42b093f8: function (arg0) {
      const ret = getObject(arg0).process;
      return addHeapObject(ret);
    },
    __wbg_versions_ab37218d2f0b24a8: function (arg0) {
      const ret = getObject(arg0).versions;
      return addHeapObject(ret);
    },
    __wbg_node_080f4b19d15bc1fe: function (arg0) {
      const ret = getObject(arg0).node;
      return addHeapObject(ret);
    },
    __wbindgen_is_string: function (arg0) {
      const ret = typeof (getObject(arg0)) === "string";
      return ret;
    },
    __wbg_msCrypto_6e7d3e1f92610cbb: function (arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    },
    __wbg_require_78a3dcfbdba9cbce: function () {
      return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbindgen_is_function: function (arg0) {
      const ret = typeof (getObject(arg0)) === "function";
      return ret;
    },
    __wbg_get_57245cc7d7c7619d: function (arg0, arg1) {
      const ret = getObject(arg0)[arg1 >>> 0];
      return addHeapObject(ret);
    },
    __wbg_length_6e3bbe7c8bd4dbd8: function (arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_new_1d9a920c6bfc44a8: function () {
      const ret = new Array();
      return addHeapObject(ret);
    },
    __wbg_newnoargs_b5b063fc6c2f0376: function (arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_call_97ae9d8645dc388b: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_call_168da88779e35f61: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_buffer_3f3d764d4747d564: function (arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_self_6d479506f72c6a71: function () {
      return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_window_f2557cc78490aceb: function () {
      return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_globalThis_7f206bda628d5286: function () {
      return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_global_ba75c50d1cf384f4: function () {
      return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbindgen_is_undefined: function (arg0) {
      const ret = getObject(arg0) === undefined;
      return ret;
    },
    __wbg_new_8c3f0052272a457a: function (arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_set_83db9690f9353e79: function (arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    },
    __wbg_length_9e1ae1900cb0fbd5: function (arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_newwithlength_f5933855e4f48a19: function (arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_subarray_58ad4efbb5bcb886: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbindgen_throw: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_memory: function () {
      const ret = wasm.memory;
      return addHeapObject(ret);
    },
  },
};

/**
 * Decompression callback
 *
 * @callback DecompressCallback
 * @param {Uint8Array} compressed
 * @return {Uint8Array} decompressed
 */

/**
 * Options for instantiating a Wasm instance.
 * @typedef {Object} InstantiateOptions
 * @property {URL=} url - Optional url to the Wasm file to instantiate.
 * @property {DecompressCallback=} decompress - Callback to decompress the
 * raw Wasm file bytes before instantiating.
 */

/** Instantiates an instance of the Wasm module returning its functions.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 */
export async function instantiate(opts) {
  return (await instantiateWithInstance(opts)).exports;
}

let instanceWithExports;
let lastLoadPromise;

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 * @returns {Promise<{
 *   instance: WebAssembly.Instance;
 *   exports: { from_string: typeof from_string; get_config: typeof get_config; from_file: typeof from_file; JSOptions : typeof JSOptions  }
 * }>}
 */
export function instantiateWithInstance(opts) {
  if (instanceWithExports != null) {
    return Promise.resolve(instanceWithExports);
  }
  if (lastLoadPromise == null) {
    lastLoadPromise = (async () => {
      try {
        const instance = (await instantiateModule(opts ?? {})).instance;
        wasm = instance.exports;
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        instanceWithExports = {
          instance,
          exports: getWasmInstanceExports(),
        };
        return instanceWithExports;
      } finally {
        lastLoadPromise = null;
      }
    })();
  }
  return lastLoadPromise;
}

function getWasmInstanceExports() {
  return { from_string, get_config, from_file, JSOptions };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated() {
  return instanceWithExports != null;
}

/**
 * @param {InstantiateOptions} opts
 */
async function instantiateModule(opts) {
  const wasmUrl = opts.url ??
    new URL("grass_compiler_bg.wasm", import.meta.url);
  const decompress = opts.decompress;
  const isFile = wasmUrl.protocol === "file:";

  // make file urls work in Node via dnt
  const isNode = globalThis.process?.versions?.node != null;
  if (isNode && isFile) {
    // the deno global will be shimmed by dnt
    const wasmCode = await Deno.readFile(wasmUrl);
    return WebAssembly.instantiate(
      decompress ? decompress(wasmCode) : wasmCode,
      imports,
    );
  }

  switch (wasmUrl.protocol) {
    case "file:":
    case "https:":
    case "http:": {
      if (isFile) {
        if (typeof Deno !== "object") {
          throw new Error("file urls are not supported in this environment");
        }
        if ("permissions" in Deno) {
          await Deno.permissions.request({ name: "read", path: wasmUrl });
        }
      } else if (typeof Deno === "object" && "permissions" in Deno) {
        await Deno.permissions.request({ name: "net", host: wasmUrl.host });
      }
      const wasmResponse = await fetch(wasmUrl);
      if (decompress) {
        const wasmCode = new Uint8Array(await wasmResponse.arrayBuffer());
        return WebAssembly.instantiate(decompress(wasmCode), imports);
      }
      if (
        isFile ||
        wasmResponse.headers.get("content-type")?.toLowerCase()
          .startsWith("application/wasm")
      ) {
        return WebAssembly.instantiateStreaming(wasmResponse, imports);
      } else {
        return WebAssembly.instantiate(
          await wasmResponse.arrayBuffer(),
          imports,
        );
      }
    }
    default:
      throw new Error(`Unsupported protocol: ${wasmUrl.protocol}`);
  }
}
