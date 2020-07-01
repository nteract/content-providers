/**
 * Check validity of Service Account configuration
 * @param config
 * @returns {{private_key}|{client_email}|{project_id}|any}
 */
type ServiceAccountType = {
  project_id: string;
  client_email: string;
  private_key: string;
};

const checkServiceAccount = (
  serviceAccount: ServiceAccountType,
  baseUrl: string,
  bucketName: string
) => {
  if (!serviceAccount) {
    throw new Error('"Service Account JSON" is required!');
  }
  if (!bucketName) {
    throw new Error('"Bucket name" is required!');
  }
  if (!baseUrl) {
    /** Set to default **/
    throw new Error(
      "Please set https://storage.googleapis.com/{bucket-name} as baseUrl"
    );
  }

  let serviceAccountJSON: ServiceAccountType;
  if (typeof serviceAccount === "string")
    try {
      serviceAccountJSON = JSON.parse(serviceAccount);
    } catch (e) {
      throw new Error(
        'Error parsing data "Service Account JSON", please be sure to copy/paste the full JSON file.'
      );
    }
  else {
    serviceAccountJSON = serviceAccount;
  }
  /**
   * Check exist
   */
  if (!serviceAccountJSON.project_id) {
    throw new Error(
      'Error parsing data "Service Account JSON". Missing "project_id" field in JSON file.'
    );
  }
  if (!serviceAccountJSON.client_email) {
    throw new Error(
      'Error parsing data "Service Account JSON". Missing "client_email" field in JSON file.'
    );
  }
  if (!serviceAccountJSON.private_key) {
    throw new Error(
      'Error parsing data "Service Account JSON". Missing "private_key" field in JSON file.'
    );
  }

  return serviceAccountJSON;
};

export default {
  checkServiceAccount,
};
