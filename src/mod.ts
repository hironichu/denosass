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
  InputSyntax,
JSOptionsType
} from './types/module.types.ts';
import { FileWritter } from './FileWritter.ts';
import { JSOptions } from '../dist/grass_compiler.generated.js';

const log = console.log.bind(this);
const error = console.error.bind(this);
const warn = console.warn.bind(this);

/**
 * @name exists
 * @description Checks if a file/dir exists
 * @param filepath : string / path to a file/folder
 * @param check : Determine if we check for a Dir or a File
 * @returns boolean
 */
const exists = (filepath: string, check: 'file' | 'dir') => {
  try {
    const absoluteFilePath = path.resolve(Deno.cwd(), filepath);
    const file = Deno.statSync(absoluteFilePath);
    if (check === 'file') return file.isFile;
    else if (check === 'dir') return file.isDirectory;
    else return file.isFile;
  } catch (_error) {
    return false;
  }
};

// Export for compatibility with the original module
export const str = (input: InputType, options = denosass.get_config()) => {
  const parsed_input = typeof input === 'string' ? input : input.join('');
  return denosass.from_string(parsed_input, options);
};
export const file = (input: string | string[], options = denosass.get_config()) => {
  const parsed_input = typeof input === 'string' ? input : input.join('');
  return denosass.from_file(parsed_input, options);
};



// export class Sass {
//   #input: InputType;
//   #current: string | Map<string, string>;
//   #mode: 'string' | 'file';
//   public output: string | Map<string, string | Uint8Array> | Uint8Array;
//   //
//   // Modes :
//   // 1 = StringMode , the input is a String
//   // 2 = SetMode, the input was a list of Element
//   #outmode: 0 | 1 | 2;
//   private readonly encoder = new TextEncoder();
//   private readonly decoder = new TextDecoder();

//   constructor(
//     input: InputType,
//     public options = new JSOptions as Partial<JSOptionsType>,
//   ) {
//     this.#input = input;
//     this.#current = '';
//     this.#mode = 'file';
//     this.#outmode = 0;
//     this.output = '';
//     // return this.#checkType();
//   }

//   public build() {}
//   public watch() {}
//   #checkType() {
//     if (!(this.#input instanceof Uint8Array)) {
//       switch (typeof this.#input) {
//         case 'string':
//           {
//             if (exists(this.#input, 'file')) {
//               return this.#processFile();
//             } else if (exists(this.#input, 'dir')) {
//               return this.#processDir();
//             } else {
//               this.#mode = 'string';
//               this.#outmode = 1;
//               this.#current = this.#input;
//             }
//           }
//           break;
//         case 'object': {
//           return this.#processObject();
//         }
//         default:
//           return this;
//       }
//     } else {
//       this.#input = new TextDecoder().decode(this.#input);
//       this.#checkType();
//     }
//     return this;
//   }
//   #processFile() {
//     const absoluteFilePath = path.resolve(Deno.cwd(), this.#input as string);

//     const file = Deno.statSync(absoluteFilePath);
//     if (file.size === 0) {
//       error(`The file you want to read is empty.`);
//     }
//     this.#outmode = 1;
//     this.#current = this.#input as string;
//     return this;
//   }
//   #processDir() {
//     if (!(this.#current instanceof Map)) {
//       this.#current = new Map<string, string>();
//     }
//     for (
//       const entry of walkSync(this.#input as string, {
//         maxDepth: this.options.walkMaxDepth,
//         includeDirs: false,
//         exts: ['.scss', '.sass'],
//       })
//     ) {
//       this.#current.set(path.parse(entry.path).name, entry.path);
//     }
//     this.#outmode = 2;
//     return this;
//   }
//   #processObject() {
//     const urls = this.#input as string[];
//     if (!(this.#current instanceof Map)) {
//       this.#current = new Map<string, string>();
//     }
//     urls.map((filePath) => {
//       if (exists(filePath, 'dir')) {
//         this.#current = this.#current as Map<string, string>;
//         this.#current.delete(filePath);
//         for (
//           const entry of walkSync(filePath, {
//             maxDepth: this.options.walkMaxDepth,
//             exts: ['.scss', '.sass'],
//           })
//         ) {
//           this.#current.set(path.parse(entry.path).name, entry.path);
//         }
//       } else if (exists(filePath, 'file')) {
//         const absoluteFilePath = path.parse(filePath);
//         this.#current = this.#current as Map<string, string>;
//         this.#current.set(absoluteFilePath.name, filePath);
//       } else {
//         warn(
//           `The File ${filePath.trim()} does not exist or is not a valid file`,
//         );
//       }
//     });
//     this.#outmode = 2;
//     return this;
//   }
// }
// class Sass implements SassObject {
//   #input: InputType;
//   // deno-lint-ignore no-explicit-any
//   #inputFormat: any;
//   #current: string | Map<string, string>;
//   #mode: 'string' | 'file';
//   public output: string | Map<string, string | Uint8Array> | Uint8Array;
//   //
//   // Modes :
//   // 1 = StringMode , the input is a String
//   // 2 = SetMode, the input was a list of Element
//   #outmode: 0 | 1 | 2;
//   private readonly encoder = new TextEncoder();
//   private readonly decoder = new TextDecoder();

//   constructor(
//     input: InputType,
//     public options = denosass.get_config()
//   ) {
//     this.#input = input;
//     this.#current = '';
//     this.#mode = 'file';
//     this.#outmode = 0;
//     this.output = '';
//     return this.#checkType();
//   }

//   /**
//    * @name to_string
//    * @param format SassFormats "compressed" | "expanded"
//    * @returns Sass.output
//    */
//   public to_string(format?: SassFormats) {
//     if (this.#outmode === 0) {
//       error(`No Output mode has been set during the process.`);
//       return false;
//     }
//     if (typeof format !== 'undefined') this.options.style = format;
//     if (typeof this.#current === 'string' || this.#current instanceof Map) {
//       if (this.#outmode === 1) {
//         if (this.#mode === 'string') {
//           this.output = denosass.from_string(
//             this.#current as string,
//             this.options,
//           );
//         } else {
//           this.output = denosass.from_file(
//             this.#current as string,
//             this.options,
//           );
//         }
//       } else if (this.#outmode === 2) {
//         this.output = [...(this.#current as Map<string, string>)]
//           .reduce(
//             (acc, file) => {
//               acc.set(
//                 file[0],
//                 denosass.from_file(file[1], this.options),
//               );
//               return acc;
//             },
//             new Map<string, string>(),
//           );
//       }
//     } else {
//       error(
//         'Invalid output data this.#current is not set to a valid value.',
//       );
//       Deno.exit(1);
//     }
//     return this.output as false | string | Map<string, string>;
//   }
//   /**
//    * @name to_buffer
//    * @param format SassFormats : "compressed" | "expanded"
//    * @returns Sass
//    */
//   public to_buffer(format?: SassFormats) {
//     if (this.#outmode === 0) {
//       error(`No Output mode has been set during the process.`);
//       return false;
//     }
//     if (typeof format !== 'undefined') this.options.style = format;
//     if (this.#outmode === 1) {
//       if (this.#mode === 'string') {
//         this.output = this.encoder.encode(
//           denosass.from_string(this.#current as string, this.options),
//         );
//       } else {
//         this.output = this.encoder.encode(
//           denosass.from_file(this.#current as string, this.options),
//         );
//       }
//     } else if (this.#outmode === 2) {
//       this.output = [...(this.#current as Map<string, string>)].reduce(
//         (acc, file) => {
//           acc.set(
//             file[0],
//             this.encoder.encode(
//               denosass.from_file(file[1], this.options),
//             ),
//           );
//           return acc;
//         },
//         new Map<string, Uint8Array>(),
//       );
//     } else {
//       //
//     }
//     return this.output as
//       | false
//       | Uint8Array
//       | Map<string, string | Uint8Array>;
//   }
//   /**
//    * @name to_file
//    * @description Outputs the finished data to file following output options
//    */
//   public async to_file(outputOptions: ExportOptions) {
//     if (outputOptions.destDir.length <= 0) {
//       error(`The output dir string is empty`);
//       Deno.exit(1);
//     }
//     const outDirpath = path.normalize(outputOptions.destDir);
//     let outFileExt = '';
//     if (exists(outDirpath, 'dir')) {
//       emptyDirSync(outDirpath);
//     } else {
//       ensureDirSync(outDirpath);
//     }
//     switch (outputOptions.format) {
//       case 'compressed':
//         outFileExt = '.min.css';
//         break;
//       case 'expanded':
//         outFileExt = '.css';
//         break;
//       default:
//         outFileExt = '.min.css';
//         break;
//     }
//     // Processing the data
//     this.to_string(outputOptions.format);
//     const fileWritter = new FileWritter();
//     if (outputOptions.destFile) {
//       const filepath = path.format({
//         root: './',
//         dir: outDirpath,
//         name: outputOptions.destFile,
//         ext: outFileExt,
//       });
//       const absoluteFilePath = path.resolve(Deno.cwd(), filepath);
//       if (this.output instanceof Map) {
//         this.output.forEach((ParsedCSs) => {
//           fileWritter.append(absoluteFilePath.toString(), ParsedCSs);
//         });
//       } else {
//         fileWritter.append(absoluteFilePath.toString(), this.output);
//       }
//     } else {
//       if (this.output instanceof Map) {
//         this.output.forEach((ParsedCSs, filename) => {
//           const filepath = path.format({
//             root: './',
//             dir: outDirpath,
//             name: filename,
//             ext: outFileExt,
//           });
//           const absoluteFilePath = path.resolve(Deno.cwd(), filepath);
//           fileWritter.append(absoluteFilePath.toString(), ParsedCSs);
//         });
//       } else {
//         const filepath = path.format({
//           root: './',
//           dir: outDirpath,
//           name: 'untitled',
//           ext: outFileExt,
//         });
//         const absoluteFilePath = path.resolve(Deno.cwd(), filepath);
//         fileWritter.append(absoluteFilePath.toString(), this.output);
//       }
//     }
//     await fileWritter.writeAll();
//     return true;
//   }
//   /** */
//   #checkType() {
//     if (!(this.#input instanceof Uint8Array)) {
//       switch (typeof this.#input) {
//         case 'string':
//           {
//             if (exists(this.#input, 'file')) {
//               return this.#processFile();
//             } else if (exists(this.#input, 'dir')) {
//               return this.#processDir();
//             } else {
//               this.#mode = 'string';
//               this.#outmode = 1;
//               this.#current = this.#input;
//             }
//           }
//           break;
//         case 'object': {
//           return this.#processObject();
//         }
//         default:
//           return this;
//       }
//     } else {
//       this.#input = new TextDecoder().decode(this.#input);
//       this.#checkType();
//     }
//     return this;
//   }
//   #processFile() {
//     const absoluteFilePath = path.resolve(Deno.cwd(), this.#input as string);

//     const file = Deno.statSync(absoluteFilePath);
//     if (file.size === 0) {
//       error(`The file you want to read is empty.`);
//     }
//     this.#outmode = 1;
//     this.#current = this.#input as string;
//     return this;
//   }
//   #processDir() {
//     if (!(this.#current instanceof Map)) {
//       this.#current = new Map<string, string>();
//     }
//     for (
//       const entry of walkSync(this.#input as string, {
//         maxDepth: this.options.walkMaxDepth,
//         includeDirs: false,
//         exts: ['.scss', '.sass'],
//       })
//     ) {
//       this.#current.set(path.parse(entry.path).name, entry.path);
//     }
//     this.#outmode = 2;
//     return this;
//   }
//   #processObject() {
//     const urls = this.#input as string[];
//     if (!(this.#current instanceof Map)) {
//       this.#current = new Map<string, string>();
//     }
//     urls.map((filePath) => {
//       if (exists(filePath, 'dir')) {
//         this.#current = this.#current as Map<string, string>;
//         this.#current.delete(filePath);
//         for (
//           const entry of walkSync(filePath, {
//             maxDepth: this.options.walkMaxDepth,
//             exts: ['.scss', '.sass'],
//           })
//         ) {
//           this.#current.set(path.parse(entry.path).name, entry.path);
//         }
//       } else if (exists(filePath, 'file')) {
//         const absoluteFilePath = path.parse(filePath);
//         this.#current = this.#current as Map<string, string>;
//         this.#current.set(absoluteFilePath.name, filePath);
//       } else {
//         warn(
//           `The File ${filePath.trim()} does not exist or is not a valid file`,
//         );
//       }
//     });
//     this.#outmode = 2;
//     return this;
//   }
// }
// /**
//  * @name sass
//  * @description Compile sass from the input
//  * @param input string[]
//  * @param _options unknown
//  * @returns Sass
//  */
// export function sass(input: InputType, options?: SassOptions): Sass {
//   return new Sass(input, options);
// }
