import { Observable } from "rxjs";

export class MockStorage {
    buckets: {[name: string]: MockBucket};
  
    constructor() {
      this.buckets = {};
    }
  
    bucket(name: string) {
      return this.buckets[name] ||
        (this.buckets[name] = new MockBucket(name));
    }
  }
  
  export class MockBucket {
    name: string;
    files: {[path: string]: MockFile};
  
    constructor(name: string) {
      this.name = name;
      this.files = {};
    }
  
    file(path: string) {
      return this.files[path] ||
        (this.files[path] = new MockFile(path));
    }
    create(path: string) {

        return ['File uploaded to '+ this.name];
      }
  }
  
 export class MockFile {
    name: string;
    contents: string;
    metadata: Object;
  
    constructor(fileName: string) {
      this.name = fileName;
      this.contents = "";
      this.metadata = {};
    }
    get() {
      return [this.name, this.metadata];
    }
    update() {
      return "Not implemented";
    }
    save( filename : string, newContents : string) {
      this.contents = newContents;
      return [this.contents];
    }
    remove() {
      return new Observable<any> ();
    }
    listCheckpoints() {
      return "Not implemented";
    }
    createCheckpoint() {
      return "Not implemented";
    }
    deleteCheckpoint() {
      return "Not implemented";
    }
    restoreFromCheckpoint() {
      return "Not implemented";
    }
  }