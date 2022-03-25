/* tslint:disable */
/* eslint-disable */
export type SassOptions = {
  load_paths: string[];
  style: "expanded" | "compressed";
  quiet: boolean;
};
/**
 * @param {string} p
 * @param {any} options
 * @returns {string}
 */
export function str(p: string, options: SassOptions): string;
/**
 * @returns {any}
 */
export function get_config(): SassOptions;
/**
 * @param {string} path
 * @param {any} jsconfig
 * @returns {string}
 */
export function file(path: string, jsconfig: SassOptions): string;
