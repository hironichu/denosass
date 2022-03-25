/**
 * @name DenoSass
 * @description A Deno module for compiling Sass to CSS in WASM
 * @author Nassim Zen
 */
import {
  denosass,
  emptyDirSync,
  ensureDirSync,
  path,
  walkSync,
} from './deps.ts';
import {
  ExportOptions,
  InputType,
  SassFormats,
  SassObject,
  SassOptions,
} from './types/module.types.ts';
export const warn = (msg: string) =>
  console.warn(
    `🟡 %c[%cSass%c]%c ${msg}`,
    'color: yellow',
    'color: orange',
    'color: yellow',
    'color: yellow;',
  );
export const error = (msg: string) =>
  console.error(
    `🛑 %c[%cSass%c]%c ${msg}`,
    'color: yellow',
    'color: red',
    'color: yellow',
    'color: red;',
  );
export const log = (msg: string) =>
  console.log(
    `🔵%c[%cSass%c]%c ${msg}`,
    'color: red',
    'color: cyan',
    'color: red',
    'color: gray;',
  );

/**
 * @name exists
 * @description Checks if a file/dir exists
 * @param filepath : string / path to a file/folder
 * @param check : Determine if we check for a Dir or a File
 * @returns boolean
 */
const exists = (filepath: string, check: 'file' | 'dir') => {
  try {
    const pathurl = new URL(filepath, `file://${Deno.cwd()}/`);
    const file = Deno.statSync(pathurl);
    if (check === 'file') return file.isFile;
    else if (check === 'dir') return file.isDirectory;
    else return file.isFile;
  } catch (_error) {
    return false;
  }
};

class Sass implements SassObject {
  #input: InputType;
  // deno-lint-ignore no-explicit-any
  #inputFormat: any;
  #current: URL | string | Map<string, string>;
  #mode: 'string' | 'file';
  public output: string | Map<string, string | Uint8Array> | Uint8Array;
  //
  // Modes :
  // 1 = StringMode , the input is a String
  // 2 = SetMode, the input was a list of Element
  #outmode: 0 | 1 | 2;
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();
  public options: SassOptions;

  constructor(
    input: InputType,
    options: SassOptions = {
      load_paths: [Deno.cwd()],
      style: 'compressed',
      quiet: true,
    },
  ) {
    this.#input = input;
    this.#current = '';
    this.#mode = 'file';
    this.#outmode = 0;
    this.output = '';
    this.options = {
      load_paths: options.load_paths || [Deno.cwd()],
      style: options.style || 'compressed',
      quiet: options.quiet || true,
    };
    return this.#checkType();
  }

  /**
   * @name to_string
   * @param format SassFormats "compressed" | "expanded"
   * @returns Sass.output
   */
  public to_string(format?: SassFormats) {
    if (this.#outmode === 0) {
      error(`No Output mode has been set during the process.`);
      return false;
    }
    if (typeof format !== 'undefined') this.options.style = format;
    if (typeof this.#current === 'string' || this.#current instanceof Map) {
      if (this.#outmode === 1) {
        if (this.#mode === 'string') {
          this.output = denosass.str(
            this.#current as string,
            this.options,
          );
        } else {
          this.output = denosass.file(
            this.#current as string,
            this.options,
          );
        }
      } else if (this.#outmode === 2) {
        this.output = [...(this.#current as Map<string, string>)]
          .reduce(
            (acc, file) => {
              acc.set(
                file[0],
                denosass.file(file[1], this.options),
              );
              return acc;
            },
            new Map<string, string>(),
          );
      }
    } else {
      error(
        'Invalid output data this.#current is not set to a valid value.',
      );
      Deno.exit(1);
    }
    return this.output as false | string | Map<string, string>;
  }
  /**
   * @name to_buffer
   * @param format SassFormats : "compressed" | "expanded"
   * @returns Sass
   */
  public to_buffer(format?: SassFormats) {
    if (this.#outmode === 0) {
      error(`No Output mode has been set during the process.`);
      return false;
    }
    if (typeof format !== 'undefined') this.options.style = format;
    if (this.#outmode === 1) {
      if (this.#mode === 'string') {
        this.output = this.encoder.encode(
          denosass.str(this.#current as string, this.options),
        );
      } else {
        this.output = this.encoder.encode(
          denosass.file(this.#current as string, this.options),
        );
      }
    } else if (this.#outmode === 2) {
      this.output = [...(this.#current as Map<string, string>)].reduce(
        (acc, file) => {
          acc.set(
            file[0],
            this.encoder.encode(
              denosass.file(file[1], this.options),
            ),
          );
          return acc;
        },
        new Map<string, Uint8Array>(),
      );
    } else {
      //
    }
    return this.output as
      | false
      | Uint8Array
      | Map<string, string | Uint8Array>;
  }
  /**
   * @name to_file
   * @description Outputs the finished data to file following output options
   */
  public to_file(outputOptions: ExportOptions) {
    if (outputOptions.destDir.length <= 0) {
      error(`The output dir string is empty`);
      Deno.exit(1);
    }
    const outDirpath = path.normalize(outputOptions.destDir);
    let outFileExt = '';
    if (exists(outDirpath, 'dir')) {
      emptyDirSync(outDirpath);
    } else {
      ensureDirSync(outDirpath);
    }
    switch (outputOptions.format) {
      case 'compressed':
        outFileExt = '.min.css';
        break;
      case 'expanded':
        outFileExt = '.css';
        break;
      default:
        outFileExt = '.min.css';
        break;
    }
    // Processing the data
    this.to_string(outputOptions.format);
    if (outputOptions.destFile) {
      const filepath = path.format({
        root: './',
        dir: outDirpath,
        name: outputOptions.destFile,
        ext: outFileExt,
      });
      const fileURL = new URL(filepath, `file://${Deno.cwd()}/`);
      if (exists(filepath, 'file')) {
        Deno.removeSync(fileURL);
      }
      if (this.output instanceof Map) {
        this.output.forEach((ParsedCSs) => {
          Deno.writeTextFileSync(
            fileURL,
            typeof ParsedCSs !== 'string'
              ? this.decoder.decode(ParsedCSs)
              : ParsedCSs,
            { append: true, create: true, mode: 644 },
          );
        });
      } else {
        Deno.writeTextFileSync(
          fileURL,
          typeof this.output !== 'string'
            ? this.decoder.decode(this.output)
            : this.output,
          { append: false, create: true, mode: 644 },
        );
      }
    } else {
      if (this.output instanceof Map) {
        this.output.forEach((ParsedCSs, filename) => {
          const filepath = path.format({
            root: './',
            dir: outDirpath,
            name: filename,
            ext: outFileExt,
          });
          const fileURL = new URL(filepath, `file://${Deno.cwd()}/`);
          if (exists(filepath, 'file')) {
            Deno.removeSync(fileURL);
          }
          Deno.writeTextFileSync(
            fileURL,
            typeof ParsedCSs !== 'string'
              ? this.decoder.decode(ParsedCSs)
              : ParsedCSs,
            { append: false, create: true, mode: 644 },
          );
        });
      } else {
        const filepath = path.format({
          root: './',
          dir: outDirpath,
          name: 'untitled',
          ext: outFileExt,
        });
        const fileURL = new URL(filepath, `file://${Deno.cwd()}/`);
        if (exists(filepath, 'file')) {
          Deno.removeSync(fileURL);
        }
        Deno.writeTextFileSync(
          fileURL,
          typeof this.output !== 'string'
            ? this.decoder.decode(this.output)
            : this.output,
          { append: false, create: true, mode: 644 },
        );
      }
    }
    return true;
  }
  /** */
  #checkType() {
    if (!(this.#input instanceof Uint8Array)) {
      switch (typeof this.#input) {
        case 'string':
          {
            if (exists(this.#input, 'file')) {
              return this.#processFile();
            } else if (exists(this.#input, 'dir')) {
              return this.#processDir();
            } else {
              this.#mode = 'string';
              this.#outmode = 1;
              this.#current = this.#input;
            }
          }
          break;
        case 'object': {
          return this.#processObject();
        }
        default:
          return this;
      }
    } else {
      this.#input = new TextDecoder().decode(this.#input);
      this.#checkType();
    }
    return this;
  }
  #processFile() {
    const FilePath = new URL(
      this.#input as string,
      `file://${Deno.cwd()}/`,
    );
    const file = Deno.statSync(FilePath);
    if (file.size === 0) {
      error(`The file you want to read is empty.`);
    }
    this.#outmode = 1;
    this.#current = this.#input as string;
    return this;
  }
  #processDir() {
    if (!(this.#current instanceof Map)) {
      this.#current = new Map<string, string>();
    }
    for (
      const entry of walkSync(this.#input as string, {
        maxDepth: 1,
        includeDirs: false,
        exts: ['.scss', '.sass'],
      })
    ) {
      this.#current.set(path.parse(entry.path).name, entry.path);
    }
    this.#outmode = 2;
    return this;
  }
  #processObject() {
    const urls = this.#input as string[];
    if (!(this.#current instanceof Map)) {
      this.#current = new Map<string, string>();
    }
    urls.map((filePath) => {
      if (exists(filePath, 'dir')) {
        this.#current = this.#current as Map<string, string>;
        this.#current.delete(filePath);
        for (
          const entry of walkSync(filePath, {
            maxDepth: 1,
            exts: ['.scss', '.sass'],
          })
        ) {
          this.#current.set(path.parse(entry.path).name, entry.path);
        }
      } else if (exists(filePath, 'file')) {
        const fileURL = path.parse(filePath);
        this.#current = this.#current as Map<string, string>;
        this.#current.set(fileURL.name, filePath);
      } else {
        warn(
          `The File ${filePath.trim()} does not exist or is not a valid file`,
        );
      }
    });
    this.#outmode = 2;
    return this;
  }
}
/**
 * @name sass
 * @description Compile sass from the input
 * @param input string[]
 * @param _options unknown
 * @returns Sass
 */
export function sass(input: InputType, options?: SassOptions): Sass {
  return new Sass(input, options);
}
