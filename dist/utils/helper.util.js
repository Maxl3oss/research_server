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
function uploadFilesHelper(files, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let image_url = "";
        let pdf_url = "";
        let pdf_name = "";
        if (typeof files === "object" && files !== null) {
            if ('image' in files && files.image.length > 0) {
                try {
                    const imageUrl = yield cloudinary_util_1.default.uploadImage(files.image[0]["path"]);
                    image_url = imageUrl;
                }
                catch (err) {
                    (0, response_interface_1.sendErrorResponse)(res, err.toString(), 404);
                    return { image_url: "", pdf_url: "", pdf_name: "" };
                }
            }
            if ('pdf' in files && files.pdf.length > 0) {
                try {
                    const pdfUrl = yield cloudinary_util_1.default.uploadPDF(files.pdf[0]["path"]);
                    pdf_url = pdfUrl;
                }
                catch (err) {
                    (0, response_interface_1.sendErrorResponse)(res, err.toString(), 404);
                    return { image_url: "", pdf_url: "", pdf_name: "" };
                }
            }
            return { image_url: image_url, pdf_url: pdf_url, pdf_name: pdf_name };
        }
        else {
            (0, response_interface_1.sendErrorResponse)(res, "file not found", 404);
            return { image_url: "", pdf_url: "", pdf_name: "" };
        }
    });
}
exports.uploadFilesHelper = uploadFilesHelper;
//# sourceMappingURL=helper.util.js.map