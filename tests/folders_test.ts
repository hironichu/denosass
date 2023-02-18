import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import sass from "../mod.ts";

Deno.test("main_test", async () => {
  const compiler = sass(["./tests/folder"], {
    style: "compressed",
    input_syntax: "scss",
  });

  await compiler.to_file({
    destDir: "./tests/dist_scss",
    format: "compressed"
  })

  const globalmintext = await Deno.readTextFile("/tests/dist_scssglobal.min.css")

  assertEquals(
    globalmintext, "body{color:green}"
  );

  const otehrmintext = await Deno.readTextFile("./tests/dist_scssother.min.css")
  assertEquals(
    otehrmintext, "body{background-color:black}"
  )
});

Deno.test("main_test_append", async () => {
  const compiler = sass(["./tests/folder"], {
    style: "compressed",
    input_syntax: "scss",
  });

  await compiler.to_file({
    destDir: "/tests/dist_scss",
    format: "compressed",
    destFile: "appended"
  })

  const globalmintext = await Deno.readTextFile("./tests/dist_scss/appended.min.css")

  assertEquals(
    globalmintext, "body{background-color:black}body{color:green}"
  );
});

