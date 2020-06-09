import config from '../config.json';
import * as Storage from '@google-cloud/storage'

const serviceAccount = config.providerOptions.serviceAccount;
const bucketName = config.providerOptions.bucketName;
const fileName = config.providerOptions.filename;
const baseUrl = config.providerOptions.baseUrl;
const filePathLocal =config.providerOptions.filePathLocal;

  /**
   * Check validity of Service Account configuration
   * @param config
   * @returns {{private_key}|{client_email}|{project_id}|any}
   */

  export function checkServiceAccount (config :any) {
    if (!serviceAccount) {
      throw new Error('"Service Account JSON" is required!');
    }
    if (!bucketName) {
      throw new Error('"Bucket name" is required!');
    }
    if (!baseUrl) {
      /** Set to default **/
      config.providerOptions.baseUrl = 'https://storage.googleapis.com/{bucket-name}';
    }
   
    let serviceAccountjson;
  
    try {
      serviceAccountjson =
        typeof serviceAccount === 'string'
          ? JSON.parse(serviceAccount)
          : serviceAccountjson;
    } catch (e) {
      throw new Error(
        'Error parsing data "Service Account JSON", please be sure to copy/paste the full JSON file.'
      );
    }
  /**
   * Check exist
   */
  if (!serviceAccount.project_id) {
    throw new Error(
      'Error parsing data "Service Account JSON". Missing "project_id" field in JSON file.'
    );
  }
  if (!serviceAccount.client_email) {
    throw new Error(
      'Error parsing data "Service Account JSON". Missing "client_email" field in JSON file.'
    );
  }
  if (!serviceAccount.private_key) {
    throw new Error(
      'Error parsing data "Service Account JSON". Missing "private_key" field in JSON file.'
    );
  }

  return serviceAccount;
};
/**
 * Check bucket exist, or create it
 * @param storage
 * @param bucketName
 * @returns {Promise<void>}
 */
export async function checkBucket ( storage : any, bucketName : string) {
  let bucket = storage.bucket(bucketName);
  const [exists] = await bucket.exists();
  if (!exists) {
    throw new Error(
      `An error occurs when we try to retrieve the Bucket "${bucketName}". Check if bucket exist on Google Cloud Platform.`
    );
  }
};

const serviceAcc = checkServiceAccount(config);
const storage = new Storage.Storage({
  projectId: serviceAcc.project_id,
  credentials: {
    client_email: serviceAcc.client_email,
    private_key: serviceAcc.private_key,
  },
});
/**
 Lists all buckets in the current project
 * @param storage
 * @param bucketName
 * @returns {Promise<void>}
*/
async function listBuckets() {
const [buckets] = await storage.getBuckets();
console.log('Buckets:');
buckets.forEach(function (bucket : any) {
  console.log(bucket.name);
});
}
listBuckets().catch(console.error);

/**
 Lists all files in the current bucket
 * @param storage
 * @param bucketName
 * @returns {Promise<void>}
*/
async function listFiles() {
// Lists files in the bucket
const [files] = await storage.bucket(bucketName).getFiles();
console.log('Files:');
files.forEach(function (file : any) {
  console.log(file.name);
});
}
listFiles().catch(console.error);
/**
Get metadata of the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
export async function get(fileName : string) {
  // Gets the metadata for the file
  const [metadata] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getMetadata();

  console.log(`File: ${metadata.name}`);
  console.log(`Bucket: ${metadata.bucket}`);
  console.log(`Storage class: ${metadata.storageClass}`);
  console.log(`Self link: ${metadata.selfLink}`);
  console.log(`ID: ${metadata.id}`);
  console.log(`Size: ${metadata.size}`);
  console.log(`Updated: ${metadata.updated}`);
  console.log(`Generation: ${metadata.generation}`);
  console.log(`Metageneration: ${metadata.metageneration}`);
  console.log(`Etag: ${metadata.etag}`);
  console.log(`Owner: ${metadata.owner}`);
  console.log(`Component count: ${metadata.component_count}`);
  console.log(`Crc32c: ${metadata.crc32c}`);
  console.log(`md5Hash: ${metadata.md5Hash}`);
  console.log(`Cache-control: ${metadata.cacheControl}`);
  console.log(`Content-type: ${metadata.contentType}`);
  console.log(`Content-disposition: ${metadata.contentDisposition}`);
  console.log(`Content-encoding: ${metadata.contentEncoding}`);
  console.log(`Content-language: ${metadata.contentLanguage}`);
  console.log(`Media link: ${metadata.mediaLink}`);
  console.log(`KMS Key Name: ${metadata.kmsKeyName}`);
  console.log(`Temporary Hold: ${metadata.temporaryHold}`);
  console.log(`Event-based hold: ${metadata.eventBasedHold}`);
  console.log(
    `Effective Expiration Time: ${metadata.effectiveExpirationTime}`
  );
  console.log(`Metadata: ${metadata.metadata}`);
}
get(fileName).catch(console.error);

/**
* Updates a file.
 * @param storage
 * @param bucketName
 */
export async function update() {
  throw new Error("Not implemented");
}

/**
Uploads the file to the bucket
* @param storage
* @param bucketName
* @param filePathLocal
* @returns {Promise<void>}
*/
export async function save(storage : any, bucketName: string, filePathLocal: string) {
  // Uploads a local file to the bucket
  try{
  storage.bucket(bucketName).upload(filePathLocal, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: {
      cacheControl: 'no-cache',
    },
  });
  console.log(`${filePathLocal} uploaded to ${bucketName}.`);
}
catch{
  
}
}
save(storage,bucketName,filePathLocal).catch(console.error);

/**
Deletes the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
export async function remove(fileName : string) {
  try{
  storage.bucket(bucketName).file(fileName).delete();
  console.log(`gs://${bucketName}/${fileName} deleted.`);
  }
  catch{
    
  }
}
remove(fileName).catch(console.error);

/**
 Delete current bucket
 * @param storage
 * @param bucketName
 * @returns {Promise<void>}
*/
export async function removeBucket( bucketName : string) {
  // Deletes the bucket
  try{
  storage.bucket(bucketName).delete();
  console.log(`Bucket ${bucketName} deleted.`);
  }
  catch{

  }
}
export class GoogleContentProvider{


}
//removeBucket(bucketName).catch(console.error);

