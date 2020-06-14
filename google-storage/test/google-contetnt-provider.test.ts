import { MockStorage, MockBucket, MockFile } from '../test/mockstorage'
import { Observable } from "rxjs";

describe("get", () => {
    test('return metadata of a file', () => {       
      const fileName = 'somefile.ipynb';
      const get=new MockFile(fileName).get();
      expect(get[0]).toEqual('somefile.ipynb');
    });
  });
  describe("create", () => {
    test('Uploads file to the bucket', () => {      
      const bucketName = 'test-bucket' ;
      const fileLocalpath = './test/somefile';
      const create=new MockBucket(bucketName).create(fileLocalpath);
      expect(create[0]).toEqual("File uploaded to "+bucketName);
    });
  });
  describe("update", () => {
    test('should return method not implemented', () => {       
      const fileName = 'somefile.ipynb';
      const update=new MockFile(fileName).update();
      expect(update).toEqual("Not implemented");
    });
  });
  describe("save", () => {
    test('should return method not implemented', () => {       
      const fileName = 'somefile.ipynb';
      const newContent = "Hi, i am updated content" ;
      const save=new MockFile(fileName).save(fileName, newContent);
       expect(save[0]).toEqual("Hi, i am updated content");
    });
  });
  describe("remove", () => {
    test('return a Observable response', () => {       
      const bucketName = 'test-bucket' ;
      const fileName = 'somefile.ipynb';
      const removeMock=new MockStorage().
      bucket(bucketName).
      file(fileName).remove() as Observable<any>;;
    });
  });
  describe("createCheckpoint", () => {
    test('should return method not implemented', () => {      
      const fileName = 'somefile.ipynb'; 
      const createCP=new MockFile(fileName).createCheckpoint();
      expect(createCP).toEqual("Not implemented");
    });
  });
  describe("deleteCheckpoint", () => { 
    test('should return method not implemented', () => {       
      const fileName = 'somefile.ipynb'; 
      const createCP=new MockFile(fileName).deleteCheckpoint();
      expect(createCP).toEqual("Not implemented");
    });
  });
  describe("restoreFromCheckpoint", () => {
    test('should return method not implemented', () => {       
      const fileName = 'somefile.ipynb'; 
      const createCP=new MockFile(fileName).restoreFromCheckpoint();
      expect(createCP).toEqual("Not implemented");
    });
  });
  describe("listCheckpoints", () => {
    test('should return method not implemented', () => {       
      const fileName = 'somefile'; 
      const createCP=new MockFile(fileName).listCheckpoints();
      expect(createCP).toEqual("Not implemented");
    });
  });