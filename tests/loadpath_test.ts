import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import sass from "../mod.ts";

Deno.test("main_test", () => {
  const sassexport = sass(`@import "main";`, {
    load_paths: [
      "./tests/myscss",
      "./tests/lib/libscss",
      "./tests/lib/libscss",
    ],
    style: "compressed",
  });
  assertEquals(
    sassexport.to_string(),
    `@import "./cssimport.css";.specialdiv{background-color:#cccc}body{background-color:#ffff;color:#cccc}body>.super{background:#9999}`,
  );
});

Deno.test("bootstrap_sass", () => {
  const sassexport = sass(`@import "main2";`, {
    load_paths: [
      "./tests/myscss",
      "./tests/lib/libscss",
      "./tests/lib",
      "./tests/lib/bootstrap",
    ],
    style: "compressed",
  });

  const cssBootstrap = Deno.readTextFileSync("./tests/bootstrap.css");
  assertEquals((sassexport.to_string() as string).trim(), cssBootstrap.trim());
});

//Do abslute path test
Deno.test("bootstrap_sass_absolute", () => {
  const testPath = `${Deno.cwd()}/tests/`;
  const sassexport = sass(`@import "main2";`, {
    load_paths: [
      `${testPath}myscss`,
      `${testPath}lib/libscss`,
      `${testPath}lib`,
      `${testPath}lib/bootstrap`,
    ],
    style: "compressed",
  });

  const cssBootstrap = Deno.readTextFileSync(`${testPath}bootstrap.css`);
  assertEquals((sassexport.to_string() as string).trim(), cssBootstrap.trim());
});
