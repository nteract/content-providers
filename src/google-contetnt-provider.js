"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleContentProvider = exports.removeBucket = exports.remove = exports.save = exports.update = exports.get = exports.checkBucket = exports.checkServiceAccount = void 0;
const config_json_1 = __importDefault(require("../config.json"));
const Storage = __importStar(require("@google-cloud/storage"));
const serviceAccount = config_json_1.default.providerOptions.serviceAccount;
const bucketName = config_json_1.default.providerOptions.bucketName;
const fileName = config_json_1.default.providerOptions.filename;
const baseUrl = config_json_1.default.providerOptions.baseUrl;
const filePathLocal = config_json_1.default.providerOptions.filePathLocal;
/**
 * Check validity of Service Account configuration
 * @param config
 * @returns {{private_key}|{client_email}|{project_id}|any}
 */
function checkServiceAccount(config) {
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
    }
    catch (e) {
        throw new Error('Error parsing data "Service Account JSON", please be sure to copy/paste the full JSON file.');
    }
    /**
     * Check exist
     */
    if (!serviceAccount.project_id) {
        throw new Error('Error parsing data "Service Account JSON". Missing "project_id" field in JSON file.');
    }
    if (!serviceAccount.client_email) {
        throw new Error('Error parsing data "Service Account JSON". Missing "client_email" field in JSON file.');
    }
    if (!serviceAccount.private_key) {
        throw new Error('Error parsing data "Service Account JSON". Missing "private_key" field in JSON file.');
    }
    return serviceAccount;
}
exports.checkServiceAccount = checkServiceAccount;
;
/**
 * Check bucket exist, or create it
 * @param storage
 * @param bucketName
 * @returns {Promise<void>}
 */
async function checkBucket(storage, bucketName) {
    let bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    if (!exists) {
        throw new Error(`An error occurs when we try to retrieve the Bucket "${bucketName}". Check if bucket exist on Google Cloud Platform.`);
    }
}
exports.checkBucket = checkBucket;
;
const serviceAcc = checkServiceAccount(config_json_1.default);
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
    buckets.forEach(function (bucket) {
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
    files.forEach(function (file) {
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
async function get(fileName) {
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
    console.log(`Effective Expiration Time: ${metadata.effectiveExpirationTime}`);
    console.log(`Metadata: ${metadata.metadata}`);
}
exports.get = get;
get(fileName).catch(console.error);
/**
* Updates a file.
 * @param storage
 * @param bucketName
 */
async function update() {
    throw new Error("Not implemented");
}
exports.update = update;
/**
Uploads the file to the bucket
* @param storage
* @param bucketName
* @param filePathLocal
* @returns {Promise<void>}
*/
async function save(storage, bucketName, filePathLocal) {
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
    }
    catch (_a) {
    }
}
exports.save = save;
save(storage, bucketName, filePathLocal).catch(console.error);
/**
Deletes the file from the bucket
* @param storage
* @param bucketName
* @param fileName
* @returns {Promise<void>}
*/
async function remove(fileName) {
    try {
        storage.bucket(bucketName).file(fileName).delete();
        console.log(`gs://${bucketName}/${fileName} deleted.`);
    }
    catch (_a) {
    }
}
exports.remove = remove;
remove(fileName).catch(console.error);
/**
 Delete current bucket
 * @param storage
 * @param bucketName
 * @returns {Promise<void>}
*/
async function removeBucket(bucketName) {
    // Deletes the bucket
    try {
        storage.bucket(bucketName).delete();
        console.log(`Bucket ${bucketName} deleted.`);
    }
    catch (_a) {
    }
}
exports.removeBucket = removeBucket;
class GoogleContentProvider {
}
exports.GoogleContentProvider = GoogleContentProvider;
//removeBucket(bucketName).catch(console.error);
