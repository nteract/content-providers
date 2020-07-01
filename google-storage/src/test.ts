import {
  GoogleProvider,
} from "../src/google-content-provider";
import { serviceAccount, endPoint } from "../config";

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
