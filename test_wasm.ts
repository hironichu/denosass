import { instantiate } from "./grass/lib/grass.generated.js";

const { from_file } = await instantiate();

from_file("./tests/folder/global.scss", {
    load_paths: [""],
    style: "compressed",
    input_syntax: "scss",
    quiet: false,
    unicode_error_messages: false,
    allows_charset: false,
})