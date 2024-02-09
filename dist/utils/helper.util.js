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
exports.addWatermark = exports.FindPrefix = exports.extractFilePDF = exports.uploadFilesHelper = void 0;
const cloudinary_util_1 = __importDefault(require("./cloudinary.util"));
const pdf_lib_1 = require("pdf-lib");
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
// export const addWatermark = async (pdfBytes: Buffer, watermarkText: string) => {
//   try {
//     const pdfDoc = await PDFDocument.load(pdfBytes);
//     const pages = pdfDoc.getPages();
//     const font = await pdfDoc.embedFont('Helvetica-Bold');
//     for (const page of pages) {
//       const { width, height } = page.getSize();
//       const textWidth = font.widthOfTextAtSize(watermarkText, 20);
//       page.drawText(watermarkText, {
//         x: (width - textWidth) / 2,
//         y: height / 2,
//         size: 20,
//         color: rgb(0.75, 0.75, 0.75),
//         rotate: degrees(45),
//       });
//     }
//     const savedPdf = await pdfDoc.save();
//     return savedPdf;
//   } catch (error) {
//     console.error('Error adding watermark:', error);
//     throw error; 
//   }
// };
const addWatermark = (pdfBytes, watermarkText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfDoc = yield pdf_lib_1.PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const stampFont = yield pdfDoc.embedFont('Helvetica-Bold');
        for (const page of pages) {
            const { width, height } = page.getSize();
            // Calculate position for the watermark
            const x = width / 3;
            const y = height / 2;
            // Draw the watermark text on the page
            page.drawText(watermarkText, {
                x: x,
                y: y,
                size: 50,
                font: stampFont,
                color: (0, pdf_lib_1.rgb)(0.75, 0.75, 0.75),
                opacity: 0.4,
                rotate: (0, pdf_lib_1.degrees)(45),
            });
        }
        const modifiedPdfBytes = yield pdfDoc.save();
        return modifiedPdfBytes;
    }
    catch (error) {
        console.error('Error adding watermark:', error);
        throw error;
    }
});
exports.addWatermark = addWatermark;
//# sourceMappingURL=helper.util.js.map