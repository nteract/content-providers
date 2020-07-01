import {
  GoogleProvider,
  IGooogleServerConfig,
} from "../src/google-content-provider";
import googleUtility from "../src/googleUtility";
import { serviceAccount, baseUrl, bucketName, endPoint } from "../config";
import { Storage } from "@google-cloud/storage";

const checkAccount = googleUtility.checkServiceAccount(
  serviceAccount,
  baseUrl,
  bucketName
);

const serverConfig = {
  endpoint: endPoint,
  projectId: "",
  authClient: {
    checkIsGCE: undefined,
    jsonContent: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    },
  },
};
console.log(serverConfig);
const googleprovider = new GoogleProvider();
googleprovider.get(serverConfig, "Cell Magics.ipynb");
