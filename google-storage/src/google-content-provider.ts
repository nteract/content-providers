import * as Storage from '@google-cloud/storage'
import googleUtility from './googleUtility'
import { Observable, of, isObservable } from "rxjs";
import {from} from 'rxjs';
import { AjaxResponse } from "rxjs/ajax";
import { catchError } from "rxjs/operators";

function createSuccessAjaxResponse(apiResponse: any): AjaxResponse {
    return {
      originalEvent: {},
      xhr: {
		name: apiResponse['name'],
		filepath: apiResponse['selfLink'],
		type: "notebook",
		writable : '',
		created : apiResponse['timeCreated'],
		last_modified : apiResponse['updated'],
		mimetype: "null",
	//	content: content ? JSON.parse(content) : null,
		format: "json"
	},
      request: {},
      status: 200,
      response: apiResponse,
      responseText: JSON.stringify(apiResponse),
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
export function get(storage: any, bucketName: string, fileName: string)  {
	const bucket = storage.bucket(bucketName);
	const file = bucket.file(fileName);	 

return from(file.get()).pipe( 
	(result: Observable<any>) => {
		console.log(result)
		return of(createSuccessAjaxResponse(result))
	},
	catchError(error => 
		of(createErrorAjaxResponse(500, error))
		)
  );	
}


/**
 * Updates a file.
 * @param storage
 * @param bucketName
 */
export function update(storage: any, bucketName: string, fileName: string): Observable < AjaxResponse > {
	throw new Error("Not supported by Google API");
}
/**
Uploads the file to the bucket
* @param storage
* @param bucketName
* @param filePathLocal
*/
export function create(storage: any, bucketName: string, filePathLocal: string): Observable < AjaxResponse > {
	// Uploads a local file to the bucket
	var apiResponse: any;
	storage.bucket(bucketName).upload(filePathLocal, {
		// Support for HTTP requests made with `Accept-Encoding: gzip`
		gzip: true,
		metadata: {
			cacheControl: 'no-cache',
		},
	}).then(function (data: any) {
		const file = data[0];
		apiResponse = data[1];
	});
	console.log(`${filePathLocal} uploaded to ${bucketName}.`);
	return apiResponse;
}
/**
	Deletes the file from the bucket
	* @param storage
	* @param bucketName
	* @param fileName
	*/
export function save(storage: any, bucketName: string, fileName: string): Observable < AjaxResponse > {
	const file = storage.bucket(bucketName).file(fileName);
	const contents = 'This is the updated contents of the file.';
	file.save(contents, function (err: any) {
		if (!err) {
			// File written successfully.
		}
	});
	// If the callback is omitted, we'll return a Promise.
	file.save(contents).then(function () {});
	return file;
}
/**
Deletes the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
export function remove(storage: any, bucketName: string, fileName: string): Observable < AjaxResponse > {
	var apiResponse: any;
	storage.bucket(bucketName).file(fileName).delete().then(function (data: any) {
		console.log(`gs://${bucketName}/${fileName} deleted.`);
		apiResponse = data[0];
	});
	return apiResponse;
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
