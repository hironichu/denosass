# Deno Sass 🦕

<img src="https://github.com/hironichu/denosass/raw/main/assets/DenoGrass.jpg" height="auto">
> A Deno+Wasm Sass compiler 
----

Welcome to the new re-writen Deno Sass module, with complete feature set (import, variables, functions, mixins, and even CLI !)

I spent 24h updating the module to make it work, it now has a new name (previously Degrass) which I think sounds better.

Please note that even tho I believe i have tested every test case for this, i don't know how good it can handle things.. 

I know that there are some errors that might now be shown at compile time, but no crash so far.

## Command line
```bash
# Install via 
deno install --allow-env --allow-write --allow-read --allow-net --unstable -n denosass https://deno.land/x/denosass/cli.ts
# Basic exemple

# This will take every file in the dir (non recursively) and compile then while keeping their name and adding .min.css, into the ./out folder.
denosass compile -f compressed -o ./out ./scssdir

# This will compile only the main.scss file and output the content to ./out/main.min.css 
denosass compile -f compressed -o ./out ./scssdir/main.scss

# Denosass accepts multiple output, and will if set, combine them together, or just compile them as normal.
denosass compile -f compressed -o ./out ./scssdir ./anotherfolder ./afile.scss

# The above example will look for the first file in 
# ./scssdir and ./anotherfolder , 
# compile them while including the @imports and so on,
# and will also compile the ./afile.scss to its own 
# (if this file includes modules within the other folder, Denosass will include them.)

#Last but not least, if you dont set -o (output dir) denosass will write content to the STDOUT. (using Deno.stdout.writeSync())
denosass compile -f compressed ./some/folder ./or/some/file.scss

```
Please note that if the output folder doesn't exist, Denosass will create it, if it exists, Denosass will empty it's content before creating new files.

> Every CSS file created are read only file (644)

## The API

I have been working really hard to make a very user friendly API
only one function is necessary to instanciate the Sass Class, you can however import it and use it how you want.

Here is a basic rundown on how the API works.
--

### Compiling Text

Basic example, this will only compile the text within the brackets.
To export the result you need to call one of these functions :

 - .to_string(format: "expanded" | "compressed")
 - .to_buffer(format: ...)
 - .to_file( { destDir, destFile, format } )
```ts
import sass from "https://deno.land/x/denosass/mod.ts"

const compiler = sass(`
  body {
    background: orange;
    >.container {
      color: black;
      display:flex;
      &.some {
        content: "Some text content";
      }
    }
  }
`)
```
Once you're done, call one of the function, if you dont set a format, 
the default one will be "compressed"
```ts
const css = compiler.to_string()
console.log(css)
```
You can also export to a buffer, note that you can call .to_string(), to_buffer() and to_file() as much as you want.
All data will be read by the WebAssembly VM at compile time, Deno checks if everything is right to compile.

Here you can export to a folder the content you compiled :
same as before, format is not mandatory
if you set destFile , Deno will output content in this file, if you dont, a untitled.min.css file will be created
```ts
compiler.to_file({
	destDir: "./out",
})
```
---

### Compiling Files / Folders / Buffer

Denosass takes both arrays of string, strings and buffers, as shown here :
```ts
// Here we have one folder and a file.
const compile = sass(["path/to/some/folder", "path/to/file.scss"])
```
> ### ⚠️ PSA, Denosass perform no Content type check for the file / folder you use, it's entirely up to you. it will look for .scss and .sass file only, ⚠️ 

Here is an example on how you can use a buffer
```ts
//This is not really useful, only if you want to catch a buffer from a request without transforming it to a string.
const compile = sass(Deno.readFileSync("somefile.scss"))
```
### Features subject to changes

For now, if you set a filename during the export to File, (both in CLI and in the API), Denosass will append every file you have imported into a single one with that name, this is useful if you want to build a static app with one single CSS file, but it might now be conveinient.

That's why setting a name isn't required by default.
```ts

const compiler = compile('some/folder');
compiler.to_file({
  destDir: "./dist",
  destFile: "mysupercss" //the extension is set depending on the format.
  format: "compressed"
}) //Returns a boolean.
```

## Browser API 

As of today, some feature are not available in browsers, (such as files/folder), I need to edit some stuff so the Deno namespace doesn't stop the code from running in modern browsers, but it should work as the older one did.


## Deploy

This module should work today, with the entire featureset on Deploy

---

And that's about it, thank you for reading, I have been spending now 25 hours writing all of this module from the ground up !

Feel free to share and support my work using Sponsors, I'd really appreciate it. 

Made with ❤️ for the Deno community. 🦕