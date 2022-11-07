/**
 * Made for futur use of the lib in CLI.
 * You can alterantively use the original Grass module from Crates.io `cargo install grass`
 */
import sass from "./mod.ts";
import { SassFormats } from "./src/types/module.types.ts";
import { parse as CMDParse } from "https://deno.land/std@0.162.0/flags/mod.ts";
import { readAll } from "https://deno.land/std@0.162.0/streams/conversion.ts";
const readPerm = { name: "read" } as const;
const writePerm = { name: "write" } as const;
const envPerm = { name: "env" } as const;
const netPerm = { name: "net" } as const;
export const warn = (msg: string) =>
  console.warn(
    `🟡 %c[%cDenoSass%c]%c ${msg}`,
    "color: yellow",
    "color: orange",
    "color: yellow",
    "color: yellow;",
  );
export const error = (msg: string) =>
  console.error(
    `🛑 %c[%cDenoSass%c]%c ${msg}`,
    "color: yellow",
    "color: red",
    "color: yellow",
    "color: red;",
  );
export const log = (msg: string) =>
  console.info(
    `🔵%c[%cDenoSass%c]%c ${msg}`,
    "color: red",
    "color: cyan",
    "color: red",
    "color: gray;",
  );

if (import.meta.main) {
  const canRead = await Deno.permissions.query(readPerm);
  const canWrite = await Deno.permissions.query(writePerm);
  const canEnv = await Deno.permissions.query(envPerm);
  const canNet = await Deno.permissions.query(netPerm);
  if (
    canRead.state === "granted" && canWrite.state === "granted" &&
    canEnv.state === "granted" && canNet.state === "granted"
  ) {
    const args = Deno.args;
    const command = args[0];
    const parsed = CMDParse(args.slice(1), {
      alias: {
        "format": "f",
        "out": "o",
        "name": "n",
        "paths": "p",
      },
      string: ["out", "name", "format", "o", "f", "n"],
    });

    if (command === "compile") {
      const format = <SassFormats>parsed.f || parsed.format || undefined;
      const outdir = parsed.o || parsed.out || undefined;
      const filename = parsed.n || parsed.name || undefined;
      const paths = parsed.p || parsed.paths || undefined;
      if (parsed._.length === 0) {
        //read std in until EOF
        log(`Write your sass code to stdin and press CTRL-D to compile`);
        let include_paths;
        if (paths && typeof paths === "string") {
          include_paths = paths.split(",");
        } else {
          include_paths = ["./"];
        }
        const stdin = await readAll(Deno.stdin);
        const sass_result = sass(stdin, {
          load_paths: include_paths,
          quiet: true,
          style: format ?? "compressed",
        });
        if (outdir) {
          sass_result.to_file({
            destDir: outdir,
            destFile: filename !== "" ? filename : undefined,
            format: format as SassFormats,
          });
          Deno.exit(0);
        } else {
          const output = sass_result.to_string();
          if (!output) {
            error("The output is empty");
            Deno.exit(1);
          }
          if (output instanceof Map) {
            output.forEach((file) => {
              Deno.stdout.writeSync(new TextEncoder().encode(file as string));
            });
            Deno.exit(0);
          } else {
            Deno.stdout.writeSync(new TextEncoder().encode(output as string));
            Deno.exit(0);
          }
        }
      } else {
        let include_paths;
        if (paths && typeof paths === "string") {
          include_paths = paths.split(",");
        } else {
          include_paths = ["./"];
        }
        const SassData = sass(parsed._ as string[], {
          load_paths: include_paths,
          quiet: true,
          style: format,
        });
        if (outdir) {
          SassData.to_file({
            destDir: outdir,
            destFile: filename !== "" ? filename : undefined,
            format: format as SassFormats,
          });
          Deno.exit(0);
        } else {
          const output = SassData.to_string();
          if (!output) {
            error("The output is empty");
            Deno.exit(1);
          }
          if (output instanceof Map) {
            output.forEach((file) => {
              Deno.stdout.writeSync(new TextEncoder().encode(file as string));
            });
            Deno.exit(0);
          } else {
            Deno.stdout.writeSync(new TextEncoder().encode(output as string));
            Deno.exit(0);
          }
        }
      }
    } else {
      log(
        "Usage: denosass compile --format <compressed | expanded> --out ./dir --name nameexported string | string[]",
      );
    }
  } else {
    error(
      "You need to grant read, write, env, net permissions to run this script.",
    );
    Deno.exit(1);
  }
}
