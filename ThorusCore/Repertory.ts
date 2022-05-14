import * as FileExists from "file-exists";
import * as DirectoryExists from "directory-exists";
import * as DirectoryTree from "directory-tree";
import * as fs from "fs";
import * as Path from "path";
import Debug from 'debug';

export class Repertory{
  static FileExists = FileExists;
  static DirectoryExists = DirectoryExists;
  static DirectoryTree = DirectoryTree;
  static Fs = fs;
  static Path:Path.PlatformPath = Path;
  /**  */
  static #_debug:typeof Debug = Debug('Thorus:Repertory:📁');
  /**  */
  static get debug(){return this.#_debug};
  static CreateDirectory(path:string):void{
    Repertory.debug(`CreateDirectory ${path}`);
    return fs.mkdirSync(path);
  }
  static LoadBufferFile(path:string):Buffer{
    Repertory.debug(`LoadBufferFile ${path}`);
    // return new Promise(function(next,reject){
    //   Repertory.Fs.readFile(path, function(error: NodeJS.ErrnoException, data: Buffer){
    //     if(error)reject(error);
    //     else next(data);
    //   })
    // })
    return Repertory.ReadFileSync(path);
  }
  static ReadFileAsync(path:string,options?:{ encoding?:any ; flag?:string }):Promise<Buffer>{
    Repertory.debug(`ReadFileAsync ${path}`);
    return new Promise(function(next , abort){
      fs.readFile(path,options,function(error:NodeJS.ErrnoException , result:Buffer ){
        if(error)abort(error);
        else next(result);
      });
    })
  }
  static ReadFileSync(path:string,options?:{ encoding?: null , flag?: string }):Buffer{
    Repertory.debug(`ReadFileSync ${path}`);
    return fs.readFileSync(path,options);
  }
}
