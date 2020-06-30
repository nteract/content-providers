import { Observable } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { Notebook } from "@nteract/commutable";
import { ServerConfig } from "./entities";
import { NextObserver } from "rxjs";
import { AjaxRequest } from "rxjs/ajax";
import { Storage } from "@google-cloud/storage";
/**
 * Types and interfaces to model Jupyter contents API
 * (described here http://jupyter-api.surge.sh/#/contents)
 * 
 * An implmentation could talk using these interfaces and provide a custom
 * implementation for contents provider
 */

// Supported file types
export type FileType = "directory" | "file" | "notebook";

// Payload for GET params
export interface IGetParams {
  type: "file" | "directory" | "notebook";
  format: "text" | "base64" | string;
  content: 0 | 1;
}

/**
 * Full payload from the contents API
 */
export interface IContent<FT extends FileType = FileType>
  extends IStatContent<FT> {
  content: FT extends "file"
    ? string
    : FT extends "notebook"
    ? Notebook
    : FT extends "directory"
    ? Array<IEmptyContent<FileType>>
    : null;
}

/**
 * Just the Stat call portion of the contents API
 * (no content property)
 */
export interface IStatContent<FT extends FileType = FileType> {
  name: string;
  path: string;
  type: FT;
  writable: boolean;
  created: string;
  last_modified: string;
  mimetype: string;
  format: string;
}
export interface ServerConfig {
  endpoint: string;
  url?: string;
  crossDomain?: boolean;
  token?: string;
  xsrfToken?: string;
  ajaxOptions?: Partial<AjaxRequest>;
  wsProtocol?: string | string[];
}

/**
 * For directory listings and when a GET is performed against content with ?content=0
 * the content field is null
 */
export interface IEmptyContent<FT extends FileType = FileType>
  extends IStatContent<FT> {
  content: null;
}

/**
 * Standardized interface to model operations supported by contents API
 */
export interface IContentProvider {
  remove(serverConfig: ServerConfig, path: string): Observable<AjaxResponse>;
  get(serverConfig: ServerConfig, path: string, params: Partial<IGetParams>): Observable<AjaxResponse>;
  update<FT extends FileType>(serverConfig: ServerConfig, path: string, model: Partial<IContent<FT>>): Observable<AjaxResponse>;
  create<FT extends FileType>(serverConfig: ServerConfig, path: string, model: Partial<IContent<FT>> & { type: FT }): Observable<AjaxResponse>;
  save<FT extends FileType>(serverConfig: ServerConfig, path: string, model: Partial<IContent<FT>>): Observable<AjaxResponse>;
  listCheckpoints(serverConfig: ServerConfig, path: string): Observable<AjaxResponse>;
  createCheckpoint(serverConfig: ServerConfig, path: string): Observable<AjaxResponse>;
  deleteCheckpoint(serverConfig: ServerConfig, path: string, checkpointID: string): Observable<AjaxResponse>;
  restoreFromCheckpoint(serverConfig: ServerConfig, path: string, checkpointID: string): Observable<AjaxResponse>;
}
