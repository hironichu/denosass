import { str, file } from "./wasm/grass.deno.js";

//From a string, note that it will resolve any imported module from import.meta.url (the current dir of the typescript file being executed.)
const fromstr = str(`
  @import 'superlib';
`,
  { 
  load_paths: [
    "./libscss", 
    "/Users/ekko/Documents/testscss"
  ], 
  style: "expanded", 
  quiet: true 
});
console.log(fromstr)

//And from a file
const fromfile = file(`./myscss/myscss.scss`,
  { 
  load_paths: [
    "./libscss",
    "/Users/ekko/Documents/testscss"
  ], 
  style: "expanded", 
  quiet: true 
});
console.log(fromfile)
///