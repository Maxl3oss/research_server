"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
    cloud_name: 'dopjszhwq',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});
const opts = (folders) => {
    return {
        overwrite: true,
        invalidate: true,
        folder: `project_research/${folders}`,
        resource_type: "auto"
    };
};
const uploadService = (file_base64, folders) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.upload(file_base64, opts(folders));
        if (result && result.secure_url) {
            console.log("upload -> " + result.secure_url);
            return result.secure_url;
        }
        throw new Error("No secure URL found in the result");
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.delete = (url) => {
    const public_id = url.split("/").slice(-3).join("/").split(".")[0];
    cloudinary.uploader.destroy(public_id, (err, result) => {
        if (err) {
            console.log("delete err -> " + err);
            return;
        }
        console.log(JSON.stringify(result));
        console.log("delete result -> " + result);
    });
};
// const uploadService = (file_base64: unknown, folders: IFoldersName) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(file_base64, opts(folders), (err: any, result: any) => {
//       if (result && result.secure_url) {
//         console.log("upload -> " + result?.secure_url);
//         return resolve(result?.secure_url);
//       }
//       return reject(err.message)
//     })
//   })
// };
const cloud = { uploadService };
exports.default = cloud;
//# sourceMappingURL=cloudinary.util.js.map