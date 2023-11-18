import { Response } from "express";
import { sendErrorResponse } from "../interface/response.interface";
import cloud, { IFoldersName } from "./cloudinary.util";

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

export async function uploadFilesHelper(files: any, res: Response) {
  let image_url: string = "";
  let pdf_url: string = "";
  let profile_url: string = "";
  let pdf_name: string = "";

  if (typeof files === "object" && files !== null) {
    const fileTypes = ["image", "pdf", "profile"];
    for (const type of fileTypes) {
      if (type in files && files[type].length > 0) {
        try {
          const url = await cloud.uploadService(files[type][0]["path"], type as IFoldersName);
          if (type === 'pdf') pdf_url = url as string;
          if (type === 'image') image_url = url as string;
          if (type === 'profile') profile_url = url as string;
        } catch (err) {
          // sendErrorResponse(res, (err as string).toString(), 404);
          return { image_url: "", pdf_url: "", pdf_name: "", profile_url: "" };
        }
      }
    }
    return { image_url: image_url, pdf_url: pdf_url, pdf_name: pdf_name, profile_url: profile_url }
  } else {
    // sendErrorResponse(res, "file not found", 404);
    return { image_url: "", pdf_url: "", pdf_name: "", profile_url: "" };
  }
}
