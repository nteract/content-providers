#@nteract/google-content-provider
## Installation
Installation
To read and save notebooks to Google Cloud storage in nteract-based apps, you can use the @nteract/google-content-provider package.
```
$ npm install --save @nteract/google-content-provider

```
## Usage
## <a name="create-bucket"></a> Create your Bucket on Google Cloud Storage
The bucket should be created with **fine grained** access control, as the plugin will configure uploaded files with public read access.
### How to create a bucket ?
- https://cloud.google.com/storage/docs/creating-buckets

### Where my bucket can be located ?
- https://cloud.google.com/storage/docs/locations

## Setting up Google authentication
1. In the GCP Console, go to the **Create service account key** page.. 
    - **[Go to the create service account key page](https://console.cloud.google.com/apis/credentials/serviceaccountkey)**
2. From the **Service account** list, select **New service account**.
3. In the **Service account name** field, enter a name.
4. From the **Role** list, select **Cloud Storage > Storage Admin**.
5. Select `JSON` for **Key Type**
6. Click **Create**. A JSON file that contains your key downloads to your computer.

## Setting up the a configuration file

You will find below many examples of configurations, for each example :
1. Copy the full content of the downloaded JSON file
2. Open the configuration file 
3. Paste it into the "Service Account JSON" field (as `string` or `JSON`, be careful with indentation)
4. Set the `bucketName` field and replace `Bucket-name` by yours [previously create](#create-bucket)
5. Default `baseUrl` is working, but you can replace it by yours (if you use a custom baseUrl)
6. Save the configuration file

**Example with environment variable**
`./config.ts`
export const serviceAccount = <Your serviceAccount JSON object/string here>
export const  bucketName = "Bucket-name"
export const  baseUrl = "https://storage.googleapis.com/{bucket-name}"
export const  basePath = "",
export const  filePathLocal ="C:/Users/../Desktop/example.ipynb"
  
## How to configure variable ?
#### `serviceAccount` :
JSON data provide by Google Account (explained before).

Can be set as a String or JSON Object.
#### `bucketName` :
The name of the bucket on Google Cloud Storage.
You can find more information on Google Cloud documentation.

#### `baseUrl` :
Define your base Url, first is default value :
- https://storage.googleapis.com/{bucket-name}

#### `filePathLocal` :
Define base path to get each media document.

#### `publicFiles`:
Boolean atribute to define public attribute to file when it is upload to storage.

## Documentation
Please fine attached readme files

## Support
If you experience an issue while using this package or have a feature request, please file an issue on the issue board.

## License
BSD-3-Clause