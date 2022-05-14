"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Repertory__debug;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repertory = void 0;
const FileExists = require("file-exists");
const DirectoryExists = require("directory-exists");
const DirectoryTree = require("directory-tree");
const fs = require("fs");
const Path = require("path");
const debug_1 = require("debug");
class Repertory {
    /**  */
    static get debug() { return __classPrivateFieldGet(this, _a, "f", _Repertory__debug); }
    ;
    static CreateDirectory(path) {
        Repertory.debug(`CreateDirectory ${path}`);
        return fs.mkdirSync(path);
    }
    static LoadBufferFile(path) {
        Repertory.debug(`LoadBufferFile ${path}`);
        // return new Promise(function(next,reject){
        //   Repertory.Fs.readFile(path, function(error: NodeJS.ErrnoException, data: Buffer){
        //     if(error)reject(error);
        //     else next(data);
        //   })
        // })
        return Repertory.ReadFileSync(path);
    }
    static ReadFileAsync(path, options) {
        Repertory.debug(`ReadFileAsync ${path}`);
        return new Promise(function (next, abort) {
            fs.readFile(path, options, function (error, result) {
                if (error)
                    abort(error);
                else
                    next(result);
            });
        });
    }
    static ReadFileSync(path, options) {
        Repertory.debug(`ReadFileSync ${path}`);
        return fs.readFileSync(path, options);
    }
}
exports.Repertory = Repertory;
_a = Repertory;
Repertory.FileExists = FileExists;
Repertory.DirectoryExists = DirectoryExists;
Repertory.DirectoryTree = DirectoryTree;
Repertory.Fs = fs;
Repertory.Path = Path;
/**  */
_Repertory__debug = { value: (0, debug_1.default)('Thorus:Repertory:📁') };
//# sourceMappingURL=Repertory.js.map