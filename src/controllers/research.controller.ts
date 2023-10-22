import { Request, Response } from "express";
import { PrismaClient, Research } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";
import cloud from "../utils/cloudinary.util";
const prisma = new PrismaClient();

async function Create(req: Request, res: Response) {
  try {
    // variable
    const data: Research = req.body ? req.body : {};
    // upload file
    const { image_url, pdf_url, pdf_name } = await uploadFilesHelper(req.files, res);

    // create data
    await prisma.research.create({
      data: {
        title: data.title,
        title_alternative: data.title_alternative,
        creator: data.creator,
        subject: data.subject,
        description: data.description,
        publisher: data.publisher,
        contributor: data.contributor,
        source: data.source,
        rights: data.rights,
        year_creation: new Date(data.year_creation) || new Date(),
        file_url: pdf_url,
        file_name: pdf_name,
        image_url: image_url,
        tags_id: Number(data.tags_id || undefined),
        user_id: data.user_id,
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
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;
    const total = await prisma.research.count({ where: { status: 1, } });

    const queryResearch = await prisma.research.findMany({
      skip,
      take: pageSize,
      where: {
        status: 1,
      },
      include: {
        user_info: {
          select: {
            prefix: true,
            first_name: true,
            last_name: true,
          }
        },
        tags_info: true,
        Rating: true,
        _count: {
          select: {
            Likes: true,
          },
        },
      },
    });

    if (!queryResearch) sendErrorResponse(res, "Research not found.", 404);

    // calculator avg
    const researchWithAverageRating = queryResearch.map(({ Rating, ...researchItem }) => {
      const ratings = Rating.map(ratingItem => parseFloat(ratingItem.rating.toString()));
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        id: researchItem.id,
        title: researchItem.title,
        title_alternative: researchItem.title_alternative,
        description: researchItem.description,
        image_url: researchItem.image_url,
        user_info: researchItem.user_info,
        tags_info: researchItem.tags_info,
        likes: researchItem._count.Likes,
        views: researchItem.views,
        average_rating: averageRating
      };
    });

    sendSuccessResponse(res, "success", researchWithAverageRating, createPagination(page, pageSize, total));

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function GetResearchByUserId(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const statusValues = [1, 2].includes(Number(req.query.status)) ? Number(req.query.status) : [1, 2];

    const skip = (page - 1) * pageSize;
    const total = await prisma.research.count({ where: { status: { in: statusValues }, user_id: req.params.userId || "" } });

    const queryResearch = await prisma.research.findMany({
      skip,
      take: pageSize,
      where: {
        status: {
          in: statusValues,
        },
        user_id: req.params.userId || "",
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        description: true,
      }
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

async function GetResearchDetailById(req: Request, res: Response) {
  try {
    // console.log(req?.query);
    const { id = 0 } = req?.query || {};
    const queryResearch = await prisma.research.findMany({
      where: {
        id: Number(id),
        status: { not: 0 }
      },
      include: {
        user_info: {
          select: {
            prefix: true,
            first_name: true,
            last_name: true,
          }
        },
        tags_info: {
          select: {
            name: true,
          }
        },
        Likes: {
          where: {
            user_id: req.params.userId || "",
          }
        },
        Rating: {
          where: {
            user_id: req.params.userId || "",
          }
        },
      }
    });

    if (!queryResearch) sendErrorResponse(res, "Research not found.", 404);
    // calculator avg
    const researchWithAverageRating = queryResearch.map(({ Rating, Likes, ...researchItem }) => {
      return { ...researchItem, rating_id: Rating[0]?.id || null, average_rating: Rating[0]?.rating || 0, like_info: Likes[0] || null };
    });

    if (queryResearch[0].user_id !== (req.params.userId || "")) {
      await prisma.research.update({
        where: {
          id: Number(queryResearch[0].id),
        },
        data: {
          views: {
            increment: 1,
          },
        }
      });
    }

    sendSuccessResponse(res, "success", researchWithAverageRating[0]);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function UpdateResearch(req: Request, res: Response) {
  try {
    // variable
    const data: Research = req.body ? req.body : {};
    // upload file
    const { image_url, pdf_url, pdf_name } = await uploadFilesHelper(req.files, res);
    // update data
    const queryResearch = await prisma.research.update({
      where: {
        id: Number(req.params.id || 0),
      },
      data: {
        title: data.title,
        title_alternative: data.title_alternative,
        creator: data.creator,
        subject: data.subject,
        description: data.description,
        publisher: data.publisher,
        contributor: data.contributor,
        source: data.source,
        rights: data.rights,
        year_creation: data.year_creation,
        tags_id: Number(data.tags_id || undefined),
        file_name: pdf_name,
        file_url: pdf_url || undefined,
        image_url: image_url || undefined,
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

async function DeleteResearch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const queryResearch = await prisma.research.update({
      where: {
        id: Number(id || 0),
      },
      data: {
        status: 0,
      },
    });

    if (!queryResearch) sendErrorResponse(res, "Research not found.", 404);

    sendSuccessResponse(res, "Delete research successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }

}

async function RatingStarsResearch(req: Request, res: Response) {
  try {
    // variable
    const { userId, ratingId, rating }: { userId: string, ratingId: number, rating: number } = req.body ? req.body : {};
    const researchId = Number(req.params.researchId || 0);
    // check 
    const check = await prisma.rating.findFirst({ where: { user_id: userId, research_id: researchId } });
    if (!check) {
      // create data
      await prisma.rating.create({
        data: {
          rating: rating,
          user_id: userId,
          research_id: researchId,
        }
      })
    } else {
      // update data
      const queryRating = await prisma.rating.update({
        where: {
          id: Number(ratingId || 0),
        },
        data: {
          rating: rating
        }
      });
      if (!queryRating) sendErrorResponse(res, "Rating not found.", 404);
    }
    sendSuccessResponse(res, "Updated research successful.", undefined);


  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function uploadFilesHelper(files: any, res: Response) {
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

export { Create, GetResearch, UpdateResearch, UploadImageToCloud, DeleteResearch, GetResearchByUserId, GetResearchDetailById, RatingStarsResearch }