import cloud, { IFoldersName } from "./cloudinary.util";
import { PDFDocument, degrees, rgb } from "pdf-lib";

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

const prefix = [
  { "id": "1", "name": "นาย" },
  { "id": "2", "name": "นาง" },
  { "id": "3", "name": "นางสาว" }
];

export function FindPrefix(prefixId: string | undefined | null): string {
  if (!prefixId) return "";
  return prefix.filter(curr => curr.id === prefixId.toString())[0].name;
}

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
export const addWatermark = async (pdfBytes: Buffer, watermarkText: string) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const stampFont = await pdfDoc.embedFont('Helvetica-Bold');

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
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.4,
        rotate: degrees(45),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
};