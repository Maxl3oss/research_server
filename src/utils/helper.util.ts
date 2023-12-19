// import { Response } from "express";
// import { sendErrorResponse } from "../interface/response.interface";
import cloud, { IFoldersName } from "./cloudinary.util";
// const PDFParser = require("pdf2json");

export async function uploadFilesHelper(files: any) {
  let image_url: string = "";
  let pdf_url: string = "";
  let profile_url: string = "";
  let file_name: string = "";

  if (typeof files === "object" && files !== null) {
    const fileTypes = ["image", "pdf", "profile"];
    for (const type of fileTypes) {
      if (type in files && files[type].length > 0) {
        try {
          const url = await cloud.uploadService(files[type][0]["path"], type as IFoldersName);
          if (type === 'pdf') pdf_url = url as string;
          if (type === 'image') image_url = url as string;
          if (type === 'profile') profile_url = url as string;
          file_name = files[type][0]["originalname"]
        } catch (err) {
          // sendErrorResponse(res, (err as string).toString(), 404);
          return { image_url: "", pdf_url: "", file_name: "", profile_url: "" };
        }
      }
    }
    return { image_url: image_url, pdf_url: pdf_url, file_name: file_name, profile_url: profile_url }
  } else {
    // sendErrorResponse(res, "file not found", 404);
    return { image_url: "", pdf_url: "", file_name: "", profile_url: "" };
  }
}

export async function extractFilePDF(files: any) {
  let text: string = "";
  // let image_url: string = "";

  if (typeof files === "object" && files !== null) {
    const fileTypes = ["pdf"];
    for (const type of fileTypes) {
      if (type in files && files[type].length > 0) {
        try {
          console.log(files[type][0]["buffer"]);
          // text = await getPDFText(files[type][0]["buffer"]);
          return { text }

        } catch (err) {
          return { text: "" };
        }
      }
    }
    return { text: "" }
  }
}

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