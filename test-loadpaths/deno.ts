import sass from "../mod.ts";

const from_files = sass(
  ["myscss/myscss.scss", "anotherlib/main.scss"], {
    load_paths: ["./libscss", "../../../testscss"],
    quiet: true,
    style: "compressed"
  }
)

console.log(from_files.to_string())