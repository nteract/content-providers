import * as Storage from '@google-cloud/storage'
import googleUtility from './googleUtility'
import { Observable} from "rxjs";
//import service account details, bucketname, filename and other details from your configuration file
import {serviceAccount,bucketName,fileName,filePathLocal} from '../config'; 

// check if service account exists with correct format
googleUtility.checkServiceAccount();

const storage = new Storage.Storage({
	projectId: serviceAccount.project_id,
	credentials: {
		client_email: serviceAccount.client_email,
		private_key: serviceAccount.private_key,
	},
});
/**	
Get metadata of the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
export function get(storage: any, bucketName: string, fileName: string) : Observable<[Storage.GetFileResponse]> {
const bucket = storage.bucket(bucketName);
const file = bucket.file(fileName);
var apiResponse : any;
file.get().then(function(data : any) {
  const file = data[0];
  apiResponse = data[0];
});
return apiResponse;
}
/**
 * Updates a file.
 * @param storage
 * @param bucketName
 */
export function update(storage: any, bucketName: string, fileName: string) : Observable<[any]>  {
	 throw new Error("Not supported by Google API");
}
/**
Uploads the file to the bucket
* @param storage
* @param bucketName
* @param filePathLocal
*/
export function create(storage: any, bucketName: string, filePathLocal: string)  : Observable<[Storage.UploadResponse]> {
  // Uploads a local file to the bucket
  var apiResponse : any;
	storage.bucket(bucketName).upload(filePathLocal, {
			// Support for HTTP requests made with `Accept-Encoding: gzip`
			gzip: true,
			metadata: {
				cacheControl: 'no-cache',
			},
		}).then(function(data :any) {
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
export function save(storage: any, bucketName: string, fileName: string) : Observable<[Storage.SaveCallback]> {
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
export function remove(storage: any, bucketName: string, fileName: string)  : Observable<[Storage.DeleteFileResponse]>  {
  var apiResponse : any;
    storage.bucket(bucketName).file(fileName).delete().then(function(data :any) {
    console.log(`gs://${bucketName}/${fileName} deleted.`);
    apiResponse = data[0];
  });
  return apiResponse;
}

async function listCheckpoints() {
	throw new Error("Not implemented");
}
async function createCheckpoint() {
	throw new Error("Not implemented");
}
async function deleteCheckpoint() {
	throw new Error("Not implemented");
}
async function restoreFromCheckpoint() {
	throw new Error("Not implemented");
}

export class GoogleProvider {
  storage : any;
  bucketName : string;
  fileName : string;
  filePathLocal : string;

  constructor(storage : any, bucketName : string, fileName : string, filePathLocal : string) {  // Constructor
    this.storage = storage;
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
