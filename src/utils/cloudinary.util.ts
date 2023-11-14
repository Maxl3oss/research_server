const cloudinary = require("cloudinary").v2;
require("dotenv").config();

export type IFoldersName = "pdf" | "image" | "Profile";

cloudinary.config({
  cloud_name: 'dopjszhwq',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const opts = (folders: IFoldersName) => {
  return {
    overwrite: true,
    invalidate: true,
    folder: `project_research/${folders}`,
    resource_type: "auto"
  }
};

const uploadService = async (file_base64: unknown, folders: IFoldersName): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file_base64, opts(folders));
    if (result && result.secure_url) {
      console.log("upload -> " + result.secure_url);
      return result.secure_url;
    }
    throw new Error("No secure URL found in the result");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.delete = (url: any) => {
  const public_id = url.split("/").slice(-3).join("/").split(".")[0];
  cloudinary.uploader.destroy(public_id, (err: any, result: any) => {
    if (err) {
      console.log("delete err -> " + err);
      return
    }
    console.log(JSON.stringify(result));
    console.log("delete result -> " + result);
  })
}


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

export default cloud;