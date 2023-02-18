import { denosass } from "../deps.ts";

const { JSOptions } = denosass;
export type ExportOptions = {
  destDir: string;
  destFile?: string;
  format?: SassFormats;
};
export type SassOptions = {
  walkMaxDepth?: number;
};
export type SassFormats = 'expanded' | 'compressed';

export type InputSyntax = 'scss' | 'sass' | 'css';

export type InputType = string | string[] | Uint8Array;
export declare interface SassObject {
  to_file(outputOptions: ExportOptions): Promise<boolean>;
  to_buffer(
    format?: SassFormats,
  ): false | Uint8Array | Map<string, string | Uint8Array>;
  to_string(format?: SassFormats): string | Map<string, string> | false;
}


export type JSOptionsType = {
  allows_charset?: boolean;
  load_paths?: string[];
  quiet?: boolean;
  style?: SassFormats;
  input_syntax?: InputSyntax;
  unicode_error_messages?: boolean;
  walkMaxDepth: number;
}


