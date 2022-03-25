export type ExportOptions = {
  destDir: string;
  destFile?: string;
  format?: SassFormats;
};

export type SassOptions = {
  load_paths?: string[];
  style?: SassFormats;
  quiet?: boolean;
};
export type SassFormats = 'expanded' | 'compressed';

export type InputType = string | string[] | Uint8Array;
export declare interface SassObject {
  to_file(outputOptions: ExportOptions): boolean;
  to_buffer(
    format?: SassFormats,
  ): false | Uint8Array | Map<string, string | Uint8Array>;
  to_string(format?: SassFormats): string | Map<string, string> | false;
}
