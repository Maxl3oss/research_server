import { Request, Response } from "express";
import { PrismaClient, Research } from "@prisma/client";
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";
import cloud from "../interface/cloudinary.interface";
const prisma = new PrismaClient();

async function Create(req: Request, res: Response) {
  try {
    // variable
    const data: Research = JSON.parse(req.body.data);
    const files = req.files as Express.Multer.File[];
    let pdf_url = "", image_url = "";
    // upload file
    const uploadFile = async (files: any) => {
      if (typeof files === "object" && files !== null) {
        if ('image' in files) {
          await cloud.uploadImage(files.image[0]["path"]).then((url: any) => (image_url = url)).catch((err) => sendErrorResponse(res, err));
        }
        if ('pdf' in files) {
          await cloud.uploadPDF(files.pdf[0]["path"]).then((url: any) => (pdf_url = url)).catch((err) => sendErrorResponse(res, err));
        }
      } else {
        sendErrorResponse(res, "file not found", 404)
      }
    }
    await uploadFile(files);

    // create data
    await prisma.research.create({
      data: {
        title: data.title,
        title_alternative: data.title_alternative,
        creator: data.creator,
        subject: data.subject,
        description: data.description,
        publisher: data.publisher,
        type: data.type,
        contributor: data.contributor,
        source: data.source,
        rights: data.rights,
        year_creation: data.year_creation,
        file_url: pdf_url,
        image_url: image_url,
        status: data.status,
        created_by: data.created_by,
      }
    });

    sendSuccessResponse(res, "Create research successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function GetResearch(req: Request, res: Response) {
  try {
    const page = Number(req.params.page) || 1;
    const pageSize = Number(req.params.pageSize) || 10;
    // const { page = 1, pageSize = 10 } = Number(req.params);
    const skip = (page - 1) * pageSize;
    const queryResearch = await prisma.research.findMany({
      skip,
      take: pageSize,
      where: {
        status: 1,
      },
      include: {
        createdBy: {
          select: {
            fname: true,
            lname: true,
            profile: true,
          }
        },
      },
    });
    const total = await prisma.research.count({
      where: {
        status: 1,
      },
    });

    if (!queryResearch) sendErrorResponse(res, "Research not found.", 404);

    sendSuccessResponse(res, "success", queryResearch, createPagination(page, pageSize, total));

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function UpdateResearch(req: Request, res: Response) {
  try {
    const data: Research = req.body;
    const queryResearch = await prisma.research.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        title_alternative: data.title_alternative,
        creator: data.creator,
        subject: data.subject,
        description: data.description,
        publisher: data.publisher,
        type: data.type,
        contributor: data.contributor,
        source: data.source,
        rights: data.rights,
        year_creation: data.year_creation,
        file_url: data.file_url,
        image_url: data.image_url,
        status: data.status,
      },
    });

    if (!queryResearch) sendErrorResponse(res, "Research not found.", 404);

    sendSuccessResponse(res, "Updated research successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function UploadImageToCloud(req: Request, res: Response) {
  try {
    let image = "", pdf = "";
    const files = req.files;
    // if (typeof file === "object" && file !== null && 'image' in file) {
    if (typeof files === "object" && files !== null && "image" in files) {
      await cloud.uploadImage(files.image[0]["path"]).then((url: any) => image = url);
    }
    if (typeof files === "object" && "pdf" in files) {
      await cloud.uploadPDF(files.pdf[0]["path"]).then((url: any) => pdf = url);
    }
    res.json({ mes: "ยังไง", image, pdf });
    // const result = await cloud..uploader.upload(file.path);
    // Handle the Cloudinary response (e.g., store the URL in a database)
    // res.json(result);
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  }
}

export { Create, GetResearch, UpdateResearch, UploadImageToCloud }