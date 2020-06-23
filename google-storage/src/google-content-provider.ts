import * as Storage from '@google-cloud/storage'
import googleUtility from './googleUtility'
import { Observable, of, isObservable } from "rxjs";
import {from} from 'rxjs';
import { AjaxResponse } from "rxjs/ajax";
import {catchError, map} from 'rxjs/operators';

function createSuccessAjaxResponse(response : any): AjaxResponse {
    return {
      originalEvent: {},
      xhr: {
		name: response.metadata.name,
		filepath: response.metadata.selfLink,
		type: "notebook",
		writable : '', 
		created : response.metadata.timeCreated,
		last_modified : response.metadata.updated,
		mimetype: "null",
		content:  null,
		format: "json",
		headers: response.headers,
	},
      request: {},
	  status: 200,
      response: response.metadata,
      responseText: JSON.stringify(response.metadata),
      responseType: "json"
    };
  }
  function createSuccessAjaxResponseForDeleteFile(responseDelete : any): AjaxResponse {
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
      responseType: "json"
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
      responseType: "json"
    };
  }
//import service account details, bucketname, filename and other details from your configuration file
/**	
Get metadata of the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns An Observable with the response
*/
export function get(storage: any, bucketName: string, fileName: string) : Observable < AjaxResponse > {
	const bucket = storage.bucket(bucketName);
	const file = bucket.file(fileName);
	
	   var response= from(file.get()).pipe(
        map((result : any) => {
            return createSuccessAjaxResponse(result[0]);
		}),
		catchError(error => of(createErrorAjaxResponse(404, error)))
	);
	response.subscribe(response => console.log(response));
	return response;
}
/**
 * Updates a file.
 * @param storage
 * @param bucketName
 * @returns An Observable with the response
 */
export function update(storage: any, bucketName: string, fileName: string): Observable < AjaxResponse > {
	throw new Error("Not supported by Google API");
}
/**
Uploads the file to the bucket
* @param storage
* @param bucketName
* @param filePathLocal
* @returns An Observable with the response
*/
export function create(storage: any, bucketName: string, filePathLocal: string): Observable < AjaxResponse > {
	// Uploads a local file to the bucket
	const bucket = storage.bucket(bucketName);
	var response= from(bucket.upload(filePathLocal, {
		// Support for HTTP requests made with `Accept-Encoding: gzip`
		gzip: true,
		metadata: {
			cacheControl: 'no-cache',
		},
	})).pipe(
        map((result : any) => {
            return createSuccessAjaxResponse(result[0]);
		}),
		catchError(error => of(createErrorAjaxResponse(404, error)))
	);
	response.subscribe(response => console.log(response));
	console.log(`${filePathLocal} uploaded to ${bucketName}.`);
	return response;
}
/**
Deletes the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns An Observable with the response
*/
export function save(storage: any, bucketName: string, fileName: string): Observable < AjaxResponse > {
	const file = storage.bucket(bucketName).file(fileName);
	const contents = 'This is the updated contents of the file.';
	var response= from(file.save(contents)).pipe(
        map((result : any) => {
            return createSuccessAjaxResponse(file);
		}),
		catchError(error => of(createErrorAjaxResponse(404, error)))
	);
	response.subscribe(response => console.log(response));
	return response;
}
/**
Deletes the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns An Observable with the request response
*/
export function remove(storage: any, bucketName: string, fileName: string): Observable < AjaxResponse > {
	const file = storage.bucket(bucketName).file(fileName);
	var response= from(file.delete()).pipe(
        map((result : any) => {
			console.log(`gs://${bucketName}/${fileName} deleted.`);
			return createSuccessAjaxResponseForDeleteFile(result[0]);
		}),
		catchError(error => of(createErrorAjaxResponse(404, error)))
	);
	response.subscribe(response => console.log(response));
	return response;
}

export function listCheckpoints() : Observable <AjaxResponse> {
	throw new Error("Not implemented");
}
export function createCheckpoint() : Observable <AjaxResponse> {
	throw new Error("Not implemented");
}
export function deleteCheckpoint() : Observable <AjaxResponse> {
	throw new Error("Not implemented");
}
export function restoreFromCheckpoint() : Observable <AjaxResponse >{
	throw new Error("Not implemented");
}

export class GoogleProvider {

	// check if service account exists with correct format
	storage : any;
	bucketName: string;
	fileName: string;
	filePathLocal: string;

	constructor(utility : any, bucketName: string, fileName: string, filePathLocal: string) { // Constructor
		const serviceAccount=utility.checkServiceAccount();

		var storage = new Storage.Storage({
			projectId: serviceAccount.project_id,
			credentials: {
				client_email: serviceAccount.client_email,
				private_key: serviceAccount.private_key,
			},
		});		
		this.storage=storage
		this.bucketName = bucketName;
		this.fileName = fileName;
		this.filePathLocal = filePathLocal;
	}

	public get(storage: any, bucketName: string, fileName: string) {
		return get(storage, bucketName, fileName);
	}
	public update(storage: any, bucketName: string, fileName: string) {
		return update(storage, bucketName, fileName);
	}
	public save(storage: any, bucketName: string, fileName: string) {
		return save(storage, bucketName, fileName);
	}
	public remove(storage: any, bucketName: string, fileName: string) {
		return remove(storage, bucketName, fileName);
	}
	public create(storage: any, bucketName: string, filePathLocal: string) {
		return create(storage, bucketName, filePathLocal);
	}
	public listCheckpoints() {
		return listCheckpoints();
	}
	public createCheckpoint() {
		return createCheckpoint();
	}
	public deleteCheckpoint() {
		return deleteCheckpoint();
	}
	public restoreFromCheckpoint() {
		return restoreFromCheckpoint();
	}
}

