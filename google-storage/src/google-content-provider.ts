import {
  Storage,
  CreateBucketResponse,
  DeleteBucketResponse,
} from "@google-cloud/storage";
import googleUtility from "./googleUtility";
import { Observable, of } from "rxjs";
import { from } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import { IContentProvider, ServerConfig, IGetParams } from "../src/types";
import { serviceAccount, baseUrl, bucketName } from "../config";
import { config } from "process";
import { stringify } from "querystring";

type GoogleAuth = {
  checkIsGCE: undefined;
  jsonContent: {
    client_email: string;
    private_key: string;
  };
};
export interface IGooogleServerConfig extends ServerConfig {
  projectId: string;
  authClient: GoogleAuth;
}

function createSuccessAjaxResponse(
  response: CreateBucketResponse[1]
): AjaxResponse {
  return {
    originalEvent: {},
    xhr: {
      name: response.metadata.name,
      filepath: response.metadata.selfLink,
      type: "notebook",
      writable: "",
      created: response.metadata.timeCreated,
      last_modified: response.metadata.updated,
      mimetype: "null",
      content: null,
      format: "json",
      headers: response.headers,
    },
    request: {},
    status: 200,
    response: response.metadata,
    responseText: JSON.stringify(response.metadata),
    responseType: "json",
  };
}
function createSuccessAjaxResponseForDeleteFile(
  responseDelete: DeleteBucketResponse[0]
): AjaxResponse {
  return {
    originalEvent: {},
    xhr: {
      name: responseDelete.request.href,
      headers: responseDelete.headers,
    },
    request: {},
    status: 204,
    response: responseDelete.statusMessage,
    responseText: JSON.stringify(responseDelete.metadata),
    responseType: "json",
  };
}

function createErrorAjaxResponse(status: number, error: Error): AjaxResponse {
  return {
    originalEvent: {},
    xhr: {},
    request: {},
    status,
    response: error,
    responseText: JSON.stringify(error),
    responseType: "json",
  };
}

export class GoogleProvider implements IContentProvider {
  checkAccount = googleUtility.checkServiceAccount(
    serviceAccount,
    baseUrl,
    bucketName
  );

  /**
  Get metadata of the file from the bucket
  * @param serverConfig
  * @param bucketName
  * @param fileName
  * @returns An Observable with the response
  */
  public get(
    serverConfig: IGooogleServerConfig,
    fileName: string,
    params: Partial<IGetParams> = {}
  ): Observable<AjaxResponse> {
    console.log(serverConfig);
    var storage = new Storage({
      projectId: serverConfig.projectId,
      credentials: {
        client_email: serverConfig.authClient.jsonContent.client_email,
        private_key: serverConfig.authClient.jsonContent.private_key,
      },
    });
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    var response = from(file.get()).pipe(
      map((result) => {
        return createSuccessAjaxResponse(result[0]);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    response.subscribe((response) => console.log(response));
    return response;
  }
  /**
   * Updates a file.
   * @param fileName
   * @returns An Observable with the response
   */
  public update(
    serverConfig: IGooogleServerConfig,
    fileName: string
  ): Observable<AjaxResponse> {
    throw new Error("Not supported by Google API");
  }
  /**
  Uploads the file to the bucket
  * @param googleServerconfig
  * @param filePathLocal
  * @returns An Observable with the response
  */
  public create(
    serverConfig: IGooogleServerConfig,
    filePathLocal: string
  ): Observable<AjaxResponse> {
    var storage = new Storage({
      projectId: serverConfig.projectId,
      credentials: {
        client_email: serverConfig.authClient.jsonContent.client_email,
        private_key: serverConfig.authClient.jsonContent.private_key,
      },
    });
    // Uploads a local file to the bucket
    const bucket = storage.bucket(bucketName);
    var response = from(
      bucket.upload(filePathLocal, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: {
          cacheControl: "no-cache",
        },
      })
    ).pipe(
      map((result) => {
        return createSuccessAjaxResponse(result[0]);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    console.log(`${filePathLocal} uploaded to ${bucketName}.`);
    return response;
  }
  /**
  Deletes the file from the bucket
  * @param serverConfig
  * @param bucketName
  * @param fileName
  * @param newContent
  * @returns An Observable with the response
  */
  public save(
    serverConfig: IGooogleServerConfig,
    fileName: string
  ): Observable<AjaxResponse> {
    var storage = new Storage({
      projectId: serverConfig.projectId,
      credentials: {
        client_email: serverConfig.authClient.jsonContent.client_email,
        private_key: serverConfig.authClient.jsonContent.private_key,
      },
    });
    const file = storage.bucket(bucketName).file(fileName);
    const contents = "newContent";
    var response = from(file.save(contents)).pipe(
      map((result) => {
        return createSuccessAjaxResponse(file);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    return response;
  }
  /**
  Deletes the file from the bucket
  * @param serverConfig
  * @param bucketName
  * @param fileName
  * @returns An Observable with the request response
  */
  public remove(
    serverConfig: IGooogleServerConfig,
    fileName: string
  ): Observable<AjaxResponse> {
    var storage = new Storage({
      projectId: serverConfig.projectId,
      credentials: {
        client_email: serverConfig.authClient.jsonContent.client_email,
        private_key: serverConfig.authClient.jsonContent.private_key,
      },
    });
    const file = storage.bucket(bucketName).file(fileName);
    var response = from(file.delete()).pipe(
      map((result) => {
        return createSuccessAjaxResponseForDeleteFile(result[0]);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    return response;
  }

  public listCheckpoints(): Observable<AjaxResponse> {
    throw new Error("Not implemented");
  }
  public createCheckpoint(): Observable<AjaxResponse> {
    throw new Error("Not implemented");
  }
  public deleteCheckpoint(): Observable<AjaxResponse> {
    throw new Error("Not implemented");
  }
  public restoreFromCheckpoint(): Observable<AjaxResponse> {
    throw new Error("Not implemented");
  }
}
