import { Response } from "express";
import { sendErrorResponse } from "../interface/response.interface";
import cloud from "./cloudinary.util";

export async function uploadFilesHelper(files: any, res: Response) {
  let image_url: string = "";
  let pdf_url: string = "";
  let pdf_name: string = "";

  if (typeof files === "object" && files !== null) {
    if ('image' in files && files.image.length > 0) {
      try {
        const imageUrl = await cloud.uploadImage(files.image[0]["path"]);
        image_url = imageUrl as string;
      } catch (err) {
        sendErrorResponse(res, (err as string).toString(), 404);
        return { image_url: "", pdf_url: "", pdf_name: "" };
      }
    }

    if ('pdf' in files && files.pdf.length > 0) {
      try {
        const pdfUrl = await cloud.uploadPDF(files.pdf[0]["path"]);
        pdf_url = pdfUrl as string;
      } catch (err) {
        sendErrorResponse(res, (err as string).toString(), 404);
        return { image_url: "", pdf_url: "", pdf_name: "" };
      }
    }

    return { image_url: image_url, pdf_url: pdf_url, pdf_name: pdf_name }
  } else {
    sendErrorResponse(res, "file not found", 404);
    return { image_url: "", pdf_url: "", pdf_name: "" };
  }
}