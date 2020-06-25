import * as Storage from "@google-cloud/storage";
import googleUtility from "./googleUtility";
import { Observable, of } from "rxjs";
import { from } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import { filePathLocal, fileName, bucketName } from "../config";

function createSuccessAjaxResponse(response: any): AjaxResponse {
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
  responseDelete: any
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

function createErrorAjaxResponse(status: number, error: any): AjaxResponse {
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

export class GoogleProvider {
  storage: any;
  bucketName: string;
  fileName: string;
  filePathLocal: string;

  constructor(
    utility: any,
    bucketName: string,
    fileName: string,
    filePathLocal: string
  ) {
    // Check if service account exists
    const serviceAccount = utility.checkServiceAccount();

    var storage = new Storage.Storage({
      projectId: serviceAccount.project_id,
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
    this.storage = storage;
    this.bucketName = bucketName;
    this.fileName = fileName;
    this.filePathLocal = filePathLocal;
  }
  /**
  Get metadata of the file from the bucket
  * @param storage
  * @param bucketName
  * @param fileName
  * @returns An Observable with the response
  */
  public get(
    storage: any,
    bucketName: string,
    fileName: string
  ): Observable<AjaxResponse> {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    var response = from(file.get()).pipe(
      map((result: any) => {
        return createSuccessAjaxResponse(result[0]);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    return response;
  }
  /**
   * Updates a file.
   * @param storage
   * @param bucketName
   * @returns An Observable with the response
   */
  public update(
    storage: any,
    bucketName: string,
    fileName: string
  ): Observable<AjaxResponse> {
    throw new Error("Not supported by Google API");
  }
  /**
  Uploads the file to the bucket
  * @param storage
  * @param bucketName
  * @param filePathLocal
  * @returns An Observable with the response
  */
  public create(
    storage: any,
    bucketName: string,
    filePathLocal: string
  ): Observable<AjaxResponse> {
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
      map((result: any) => {
        return createSuccessAjaxResponse(result[0]);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    console.log(`${filePathLocal} uploaded to ${bucketName}.`);
    return response;
  }
  /**
  Deletes the file from the bucket
  * @param storage
  * @param bucketName
  * @param fileName
  * @param newContent
  * @returns An Observable with the response
  */
  public save(
    storage: any,
    bucketName: string,
	fileName: string,
	newContent: string
  ): Observable<AjaxResponse> {
    const file = storage.bucket(bucketName).file(fileName);
    const contents = newContent;
    var response = from(file.save(contents)).pipe(
      map((result: any) => {
        return createSuccessAjaxResponse(file);
      }),
      catchError((error) => of(createErrorAjaxResponse(404, error)))
    );
    return response;
  }
  /**
  Deletes the file from the bucket
  * @param storage
  * @param bucketName
  * @param fileName
  * @returns An Observable with the request response
  */
  public remove(
    storage: any,
    bucketName: string,
    fileName: string
  ): Observable<AjaxResponse> {
    const file = storage.bucket(bucketName).file(fileName);
    var response = from(file.delete()).pipe(
      map((result: any) => {
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

const googleprovider = new GoogleProvider(
  googleUtility,
  bucketName,
  fileName,
  filePathLocal
);
googleprovider.get(
  googleprovider.storage,
  "notebook_samples",
  "Cell Magics.ipynb"
);
