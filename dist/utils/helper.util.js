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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesHelper = void 0;
const response_interface_1 = require("../interface/response.interface");
const cloudinary_util_1 = __importDefault(require("./cloudinary.util"));
// export async function uploadFilesHelper2(files: any, res: Response) {
//   let image_url: string = "";
//   let pdf_url: string = "";
//   let pdf_name: string = "";
//   if (typeof files === "object" && files !== null) {
//     if ('image' in files && files.image.length > 0) {
//       try {
//         const imageUrl = await cloud.uploadService(files.image[0]["path"], "image");
//         image_url = imageUrl as string;
//       } catch (err) {
//         sendErrorResponse(res, (err as string).toString(), 404);
//         return { image_url: "", pdf_url: "", pdf_name: "" };
//       }
//     }
//     if ('pdf' in files && files.pdf.length > 0) {
//       try {
//         const pdfUrl = await cloud.uploadService(files.pdf[0]["path"], "pdf");
//         pdf_url = pdfUrl as string;
//       } catch (err) {
//         sendErrorResponse(res, (err as string).toString(), 404);
//         return { image_url: "", pdf_url: "", pdf_name: "" };
//       }
//     }
//     return { image_url: image_url, pdf_url: pdf_url, pdf_name: pdf_name }
//   } else {
//     sendErrorResponse(res, "file not found", 404);
//     return { image_url: "", pdf_url: "", pdf_name: "" };
//   }
// }
function uploadFilesHelper(files, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let image_url = "";
        let pdf_url = "";
        let profile_url = "";
        let pdf_name = "";
        if (typeof files === "object" && files !== null) {
            const fileTypes = ["image", "pdf", "profile"];
            for (const type of fileTypes) {
                if (type in files && files[type].length > 0) {
                    try {
                        const url = yield cloudinary_util_1.default.uploadService(files[type][0]["path"], type);
                        if (type === 'pdf')
                            pdf_url = url;
                        if (type === 'image')
                            image_url = url;
                        if (type === 'profile')
                            profile_url = url;
                    }
                    catch (err) {
                        (0, response_interface_1.sendErrorResponse)(res, err.toString(), 404);
                        return { image_url: "", pdf_url: "", pdf_name: "", profile_url: "" };
                    }
                }
            }
            return { image_url: image_url, pdf_url: pdf_url, pdf_name: pdf_name, profile_url: profile_url };
        }
        else {
            (0, response_interface_1.sendErrorResponse)(res, "file not found", 404);
            return { image_url: "", pdf_url: "", pdf_name: "", profile_url: "" };
        }
    });
}
exports.uploadFilesHelper = uploadFilesHelper;
//# sourceMappingURL=helper.util.js.map