export class FileWritter {
  private files: Map<string, string>;

  constructor() {
    this.files = new Map();
  }
  append(filePath: string, data: string | Uint8Array) {
    if (typeof data !== 'string') {
      data = new TextDecoder().decode(data);
    }
    this.files.set(
      filePath,
      this.files.has(filePath)
        ? this.files.get(filePath) + data
        : data
    );
  }

  writeAll() {
    return Promise.all(
      Array.from(this.files).map(([filePath, data]) =>
        Deno.writeTextFile(filePath, data)
      )
    );
  }
}
