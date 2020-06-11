/**	 import service account details, bucketname, filename and other details from your configuration file
import {serviceAccount,baseUrl,bucketName,fileName,filePathLocal,basePath} from '../'; 
*/
 /**
   * Check validity of Service Account configuration
   * @param config
   * @returns {{private_key}|{client_email}|{project_id}|any}
   */

 const checkServiceAccount = () => {
    if (!serviceAccount) {
      throw new Error('"Service Account JSON" is required!');
    }
    if (!bucketName) {
      throw new Error('"Bucket name" is required!');
    }
    if (!baseUrl) {
      /** Set to default **/
      throw new Error('Please set https://storage.googleapis.com/{bucket-name} as baseUrl');
      ;
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

 export default{
 checkServiceAccount
}