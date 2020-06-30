import {GoogleProvider} from '../src/google-content-provider';
import googleUtility from '../src/googleUtility';
import { serviceAccount, baseUrl, bucketName} from '../config';
import {Storage} from "@google-cloud/storage";

const checkAccount = googleUtility.checkServiceAccount(serviceAccount,baseUrl,bucketName);

    var storage = new Storage({
      projectId: serviceAccount.project_id,
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
  console.log(storage)
  const googleprovider = new GoogleProvider();
  console.log(baseUrl);
   googleprovider.get( 
    storage,
    "Cell Magics.ipynb"
  );
