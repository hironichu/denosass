// Copyright 2020 the Deno authors. All rights reserved. MIT license.

/**
 * Javascript version of DenoSass for Browsers
 */
/// <reference lib="dom" />
// deno-lint-ignore-file
// deno-fmt-ignore-file
/**

				import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js';
				import { decompress, compress } from 'https://deno.land/x/zstd_web@0.2/zstd.js';
				document.getElementById('saveGame').addEventListener('click', async () => {
					var FileSystemDirectoryHandle = window.showDirectoryPicker({id: 'GameSavePath',startIn: 'documents'});
					console.log(await FileSystemDirectoryHandle)
				});


 */
import * as denosass from "./src/wasm/grass.js";

export const warn = (msg) =>
  console.warn(
    `🟡 %c[%cSass%c]%c ${msg}`,
    "color: yellow",
    "color: orange",
    "color: yellow",
    "color: yellow;",
  );
export const error = (msg) =>
  console.error(
    `🛑 %c[%cSass%c]%c ${msg}`,
    "color: yellow",
    "color: red",
    "color: yellow",
    "color: red;",
  );
export const log = (msg) =>
  console.log(
    `🔵%c[%cSass%c]%c ${msg}`,
    "color: red",
    "color: cyan",
    "color: red",
    "color: gray;",
  );

export class Sass {
  #input;
  #inputFormat;
  #current;
  #mode;
  #supportedMode = ["string"]
  #outmode;

  constructor(input, fileSupport = false, FileHandle = null) {
    this.#input = input;
    this.#current = "";
    this.#mode = "string";
    this.#outmode = 0;
    (fileSupport ? this.#supportedMode.push("file") : null);
    if (fileSupport && FileHandle && FileHandle instanceof FileSystemDirectoryHandle) {
      return this.#handleFile(FileHandle)
    }
    return this.#checkType();
  }
  /**
   * @name to_string
   * @description Compile and return a buffer containing the CSS
   * @param {string} format The format to use to compile Sass
   * @returns {string | Map<string,string>} A String containing the CSS OR a Map containing the CSS and the sourcemap
   */
  to_string(format) {
    if (format !== undefined && typeof format !== "string" ) {
      error("Please use one of the format : compressed | expanded");
      return false
    }
    if (!this.#check_Omode()) return false

  }
  /**
   * @name to_buffer
   * @description Compile and return a buffer containing the CSS
   * @param {string} format The format to use to compile Sass
   * @returns {Map<Uint8Array> | Uint8Array} returns a Map or a buffer containing the CSS
   */
  to_buffer(format) {
    if (format !== undefined && typeof format !== "string" ) {
      error("Please use one of the format : compressed | expanded");
      return false
    }
    if (this.#outmode !== 0) {

    }
    error('No output mode set')
    return false
  }
  to_file() {
    if (!this.#supportedMode.includes('file')) {
      warn(`File output is not supported`)
      return false
    }
    if (!this.#check_Omode()) return false
    
  }
  #checkType () {
    //
  }
  async #handleFile(FileHandle) {
    if (this.#input instanceof FileSystemDirectoryHandle) {
      //
    }
    return this
  }

  is_arrayFile() {
    return this.#input.files && this.#input.dirs
  }
  #check_Omode() {
    if (this.#outmode !== 1 || this.#outmode !== 2) {
      error('No output mode set')

      return false
    }
    return true
  }
}

window.sass_dir = async () => {
  let output;
  document.addEventListener('click', async () => {
    const opt = {
      id: "SassFile",
      startIn: "documents",
      types: [{
          description: 'SassFile',
          accept: {
            'text/*': ['.scss', '.sass'],
          }
      }],
      excludeAcceptAllOption: true,
      multiple: false
    }
    const FileInput = window.showDirectoryPicker(opt)
    try {
      output = await FileInput
    } catch (e) {
        error(e.message)
        output = false
        return false
    }
  })
  const waitfor = new Promise((r) => {
    const res = setInterval(() => {
      if (output !== undefined) {
        clearInterval(res)
        r(output)
      }
    })
  }, 1000)
  return await waitfor
}
/**
 * @name sass_file
 * @description Returnes an Object containing list of files/folder from the user input.
 * @returns 
 */
window.sass_file = async () => {
  const list = {files: null, dirs: null}
  document.addEventListener('click' , async () => {
    const opt = {
      id: "SassFile",
      startIn: "documents",
      types: [{
        description: 'SassFile',
        accept: {'text/*': ['.scss', '.sass']}
      }],
      excludeAcceptAllOption: true,
      multiple: true
    }
    let FileInput = window.showOpenFilePicker(opt)
    try {
      list.files = await FileInput
      FileInput = window.showDirectoryPicker(opt)
      list.dirs = await FileInput;
    } catch (e) {
        error(e.message)
        window.INPUT = false
        return false
    }
  })
  const waitfor = new Promise((r) => {
    const res = setInterval(() => {
      if (list.files && list.dirs) {
        clearInterval(res)
        r(list)
      }
    })
  }, 1000)
  return await waitfor
}

/**
 * @name sass
 * @description Compile and return a Sass object
 * @param {string | string[] | Uint8Array} input A string or an array of string or a buffer containing the Sass
 * @returns {Sass}
 */
export const sass = async (input, fileMode = false) => {
  let fileSupport = false
  let FileHandle;
  if (typeof window.showOpenFilePicker === "undefined") {
    log('No support for direct File System access')
  } else {
    fileSupport = true
  }
  if (fileMode && fileSupport) {
    FileHandle = await window.sass_dir()
  } else if (fileMode && !fileSupport) {
    error('You cannot use file or dir without file support')
    return false
  }
  if (typeof input === "undefined") return false
  window.Sass = new Sass(input, fileSupport, FileHandle);
  return window.Sass;
}

export default sass