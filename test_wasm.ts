import { instantiate } from "./grass/lib/grass.generated.js";

const { from_file,from_string, get_config } = await instantiate();
const conf = get_config();
conf.allows_charset = true;
conf.input_syntax = "scss";
conf.style = "expanded";

console.log(from_file("./tests/folder/global.scss", conf));