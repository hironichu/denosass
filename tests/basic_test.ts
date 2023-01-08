import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import sass from "../mod.ts";

Deno.test("variable_test", () => {
  const from_files = sass(
    `
$color: red;
$size: 10px;
body { 
    color : $color;
    >.inner {
        font-size: $size;
    }
}`,
    {
      load_paths: [],
      quiet: true,
      style: "compressed",
      input_syntax: "scss",

    },
  );
  assertEquals(
    from_files.to_string(),
    "body{color:red}body>.inner{font-size:10px}",
  );
});

Deno.test("variable_test_2", () => {
  const from_files = sass(
    `
$var1: "hello";
$var2: "world";
.text {
    content: $var1 + " " + $var2;
}  
`,
    {
      load_paths: [],
      quiet: true,
      style: "compressed",
      input_syntax: "scss",
    },
  );
  assertEquals(from_files.to_string(), '.text{content:"hello world"}');
});

Deno.test("sass_function_test", () => {
  const from_files = sass(
    `
@function my-function($arg1, $arg2) {
  @return $arg1 + $arg2;
}
.text {
    content: my-function(1, 2);
}  
`,
    {
      load_paths: [],
      quiet: true,
      style: "compressed",
      input_syntax: "scss",
    },
  );
  assertEquals(from_files.to_string(), ".text{content:3}");
});

Deno.test("sass_function_test_2", () => {
  const from_files = sass(
    `
@function my-function($arg1, $arg2) {
  @return $arg1 + $arg2;
}
.text {
    content: my-function(1, 2);
}  
`,
    {
      load_paths: [],
      quiet: true,
      style: "expanded",
      input_syntax: "scss",
    },
  );
  assertEquals(
    from_files.to_string(),
    `.text {
  content: 3;
}
`,
  );
});

//Test Mixins
Deno.test("mixin_test", () => {
  const from_files = sass(
    `
@mixin my-mixin($arg1, $arg2) {
  color: $arg1;
  font-size: $arg2;
}
.text {
    @include my-mixin(red, 10px);
}  
`,
    {
      load_paths: [],
      quiet: true,
      style: "compressed",
      input_syntax: "scss",
    },
  );
  assertEquals(from_files.to_string(), ".text{color:red;font-size:10px}");
});
