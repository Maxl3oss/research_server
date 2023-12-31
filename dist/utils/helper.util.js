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
exports.FindPrefix = exports.extractFilePDF = exports.uploadFilesHelper = void 0;
const cloudinary_util_1 = __importDefault(require("./cloudinary.util"));
function uploadFilesHelper(files) {
    return __awaiter(this, void 0, void 0, function* () {
        let image_url = "";
        let pdf_url = "";
        let profile_url = "";
        let file_name = "";
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
                        file_name = files[type][0]["originalname"];
                    }
                    catch (err) {
                        // sendErrorResponse(res, (err as string).toString(), 404);
                        return { image_url: "", pdf_url: "", file_name: "", profile_url: "" };
                    }
                }
            }
            return { image_url: image_url, pdf_url: pdf_url, file_name: file_name, profile_url: profile_url };
        }
        else {
            // sendErrorResponse(res, "file not found", 404);
            return { image_url: "", pdf_url: "", file_name: "", profile_url: "" };
        }
    });
}
exports.uploadFilesHelper = uploadFilesHelper;
function extractFilePDF(files) {
    return __awaiter(this, void 0, void 0, function* () {
        let text = "";
        // let image_url: string = "";
        if (typeof files === "object" && files !== null) {
            const fileTypes = ["pdf"];
            for (const type of fileTypes) {
                if (type in files && files[type].length > 0) {
                    try {
                        console.log(files[type][0]["buffer"]);
                        // text = await getPDFText(files[type][0]["buffer"]);
                        return { text };
                    }
                    catch (err) {
                        return { text: "" };
                    }
                }
            }
            return { text: "" };
        }
    });
}
exports.extractFilePDF = extractFilePDF;
// function getPDFText(data: Buffer): Promise<string> {
//   return new Promise<string>((resolve, reject) => {
//     const pdfParser = new PDFParser(null, 1);
//     pdfParser.on('pdfParser_dataError', (errData: any) => {
//       reject(errData.parserError);
//     });
//     pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
//       resolve(pdfParser.getRawTextContent());
//     });
//     if (!data || data.length === 0) {
//       reject('Invalid or empty PDF data');
//     }
//     try {
//       pdfParser.parseBuffer(data);
//     } catch (err) {
//       reject(err);
//     }
//   });
// }
const prefix = [
    { "id": "1", "name": "นาย" },
    { "id": "2", "name": "นาง" },
    { "id": "3", "name": "นางสาว" }
];
function FindPrefix(prefixId) {
    if (!prefixId)
        return "";
    return prefix.filter(curr => curr.id === prefixId.toString())[0].name;
}
exports.FindPrefix = FindPrefix;
//# sourceMappingURL=helper.util.js.map