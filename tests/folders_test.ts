import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import sass from "../mod.ts";

Deno.test("main_test", async () => {
  const compiler = sass(["./tests/folder"], {
    style: "compressed"
  });

  await compiler.to_file({
    destDir: "./dist",
    format: "compressed"
  })

  const globalmintext = await Deno.readTextFile("./dist/global.min.css")

  assertEquals(
    globalmintext, "body{color:green}"
  );

  const otehrmintext = await Deno.readTextFile("./dist/other.min.css")
  assertEquals(
    otehrmintext, "body{background-color:black}"
  )
});

Deno.test("main_test_append", async () => {
  const compiler = sass(["./tests/folder"], {
    style: "compressed"
  });

  await compiler.to_file({
    destDir: "./dist",
    format: "compressed",
    destFile: "appended"
  })

  const globalmintext = await Deno.readTextFile("./dist/appended.min.css")

  assertEquals(
    globalmintext, "body{background-color:black}body{color:green}"
  );
});

