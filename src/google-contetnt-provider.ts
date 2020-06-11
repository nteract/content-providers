import config from '../config.json';
import * as Storage from '@google-cloud/storage'
import googleUtility from '../src/googleUtility'

// check if service account exists with correct format
const serviceAcc = googleUtility.checkServiceAccount(config);

const bucketName = config.providerOptions.bucketName;
const fileName = config.providerOptions.filename;
const filePathLocal =config.providerOptions.filePathLocal;

const storage = new Storage.Storage({
	projectId: serviceAcc.project_id,
	credentials: {
		client_email: serviceAcc.client_email,
		private_key: serviceAcc.private_key,
	},
});
/**	
Get metadata of the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
async function get(storage: any, bucketName: string, fileName: string) {
	// Gets the metadata for the file
	const [metadata] = await storage
		.bucket(bucketName)
		.file(fileName)
		.getMetadata();
}
/**
 * Updates a file.
 * @param storage
 * @param bucketName
 */
async function update(storage: any, bucketName: string, fileName: string) {
	 throw new Error("Not supported by Google API");
}
/**
Uploads the file to the bucket
* @param storage
* @param bucketName
* @param filePathLocal
* @returns {Promise<void>}
*/
async function create(storage: any, bucketName: string, filePathLocal: string) {
	// Uploads a local file to the bucket
	try {
		storage.bucket(bucketName).upload(filePathLocal, {
			// Support for HTTP requests made with `Accept-Encoding: gzip`
			gzip: true,
			metadata: {
				cacheControl: 'no-cache',
			},
		});
		console.log(`${filePathLocal} uploaded to ${bucketName}.`);
	} catch {

	}
}
/**
	Deletes the file from the bucket
	* @param storage
	* @param bucketName
	* @param fileName
	*/
async function save(storage: any, bucketName: string, fileName: string) {
	const myBucket = storage.bucket(bucketName);
	const file = myBucket.file(fileName);
	const contents = 'This is the updated contents of the file.';
	file.save(contents, function (err: any) {
		if (!err) {
			// File written successfully.
		}
	});
	// If the callback is omitted, we'll return a Promise.
	file.save(contents).then(function () {});
}
/**
Deletes the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
async function remove(storage: any, bucketName: string, fileName: string) {
	try {
		storage.bucket(bucketName).file(fileName).delete();
		console.log(`gs://${bucketName}/${fileName} deleted.`);
	} catch {

	}
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
	public create(storage: any, bucketName: string, fileName: string) {
		return create(storage, bucketName, fileName);
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