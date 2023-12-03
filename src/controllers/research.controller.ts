import { Request, Response } from "express";
import { PrismaClient, Research } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";
import { uploadFilesHelper } from "../utils/helper.util";
import cloud from "../utils/cloudinary.util";
const prisma = new PrismaClient();
interface RequestQuery {
  orderBy?: string;
  search?: string;
  filter?: string;
  [key: string]: any;
}

export async function Create(req: Request, res: Response) {
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

export async function GetResearch(req: Request, res: Response) {
  try {
    const { orderBy = "asc", search = "", filter = "", ...raw }: RequestQuery = req.query;
    const page = Number(raw.page) || 1;
    const pageSize = Number(raw.pageSize) || 10;

    const skip = (page - 1) * pageSize;
    const total = await prisma.research.count({ where: { status: 1, } });

    const arrFilter = filter?.length > 0 ? filter?.split(",").map(Number) : [];

    const dynamicFilters: { [key: number]: any } = {
      1: { OR: [{ title: { contains: search } }, { title_alternative: { contains: search } }] },
      2: {
        user_info: {
          OR: [
            { first_name: { contains: search } }, { last_name: { contains: search } },
            { AND: [{ first_name: { contains: search } }, { last_name: { contains: search } }] }
          ]
        }
      },
      3: { subject: { contains: search } },
      4: { description: { contains: search } },
      5: { creator: { contains: search } }
    };
    const filtersToApply = arrFilter.map(filter => dynamicFilters[filter]).filter(Boolean);
    const combinedFilters = filtersToApply.length > 0 ? { OR: filtersToApply } : { OR: [{ title: { contains: search } }, { title_alternative: { contains: search } }] };

    const queryResearch = await prisma.research.findMany({
      skip,
      take: pageSize,
      where: {
        status: 1,
        ...combinedFilters,
      },
      include: {
        user_info: {
          select: {
            profile: true,
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
      orderBy: {
        ...(orderBy === "desc" && {
          views: "desc",
        }),
      }
    });

    if (!queryResearch) return sendErrorResponse(res, "Research not found.", 404);

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
        average_rating: averageRating.toFixed(0)
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

export async function GetResearchByUserId(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const status = Number(req.query.status || 0);
    const userId = req.params.userId || "";
    // 1 == public 2 == no public 3 === all(public and no) 4 == list research is user like
    const statusValues = [1, 2, 3].includes(status) ? (status === 3 ? [1, 2] : status) : (status === 4 ? 4 : 0);

    const skip = (page - 1) * pageSize;
    const countResearchUser = await prisma.research.count({ where: { user_id: req.params.userId || "" } });

    if (statusValues === 4) {
      const total = await prisma.likes.count({ where: { user_id: userId } });
      const queryResearchByLikeId = await prisma.likes.findMany({
        skip,
        take: pageSize,
        where: {
          user_id: userId,
          research_info: {
            user_id: {
              not: userId,
            }
          }
        },
        include: {
          research_info: {
            select: {
              id: true,
              title: true,
              image_url: true,
              description: true,
              user_info: {
                select: {
                  id: true,
                }
              }
            }
          },
        }
      });

      if (!queryResearchByLikeId) sendErrorResponse(res, "Research not found.", 404);
      const filData = queryResearchByLikeId.map((curr) => curr.research_info);
      sendSuccessResponse(res, "success", { countResearch: countResearchUser, dataResearch: filData }, createPagination(page, pageSize, total), 200, true);

    } else {

      const total = await prisma.research.count({ where: { status: { in: statusValues }, user_id: userId } });
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

      if (!queryResearch) return sendErrorResponse(res, "Research not found.", 404);
      sendSuccessResponse(res, "success", { countResearch: countResearchUser, dataResearch: queryResearch }, createPagination(page, pageSize, total), 200, true);
    }

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetResearchDetailById(req: Request, res: Response) {
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

    if (!queryResearch) return sendErrorResponse(res, "Research not found.", 404);
    const query_like_count = await prisma.likes.count({
      where: {
        research_id: queryResearch[0].id,
      }
    });
    // calculator avg
    const researchWithAverageRating = queryResearch.map(({ Rating, Likes, ...researchItem }) => {
      return { ...researchItem, rating_id: Rating[0]?.id || null, average_rating: Rating[0]?.rating || 0, like: Likes?.length > 0, likes_count: query_like_count };
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

export async function UpdateResearch(req: Request, res: Response) {
  try {
    // variable
    const data: Research = req.body ?? {};
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

    if (!queryResearch) return sendErrorResponse(res, "Research not found.", 404);

    sendSuccessResponse(res, "Updated research successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

// export async function UploadImageToCloud(req: Request, res: Response) {
//   try {
//     let image = "", pdf = "";
//     const files = req.files;
//     // if (typeof file === "object" && file !== null && 'image' in file) {
//     if (typeof files === "object" && files !== null && "image" in files) {
//       await cloud.uploadImage(files.image[0]["path"]).then((url: any) => image = url);
//     }
//     if (typeof files === "object" && "pdf" in files) {
//       await cloud.uploadPDF(files.pdf[0]["path"]).then((url: any) => pdf = url);
//     }
//     res.json({ mes: "ยังไง", image, pdf });
//     // const result = await cloud..uploader.upload(file.path);
//     // Handle the Cloudinary response (e.g., store the URL in a database)
//     // res.json(result);
//   } catch (err) {
//     console.error(err);
//     sendErrorResponse(res, "Internal server error.");
//   }
// }

export async function DeleteResearch(req: Request, res: Response) {
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

    if (!queryResearch) return sendErrorResponse(res, "Research not found.", 404);

    sendSuccessResponse(res, "Delete research successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }

}

export async function RatingStarsResearch(req: Request, res: Response) {
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
      if (!queryRating) return sendErrorResponse(res, "Rating not found.", 404);
    }
    sendSuccessResponse(res, "Updated research successful.", undefined);


  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

// admin
export async function GetResearchAll(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const search = (req.query?.search ?? undefined) as string;
    // console.log(search)
    const total = await prisma.research.count({
      where: {
        ...(search && {
          title: {
            contains: search,
          },
        }),
      }
    });
    const skip = (page - 1) * pageSize;

    const query = await prisma.research.findMany({
      skip,
      take: pageSize,
      where: {
        NOT: {
          status: 0
        },
        ...(search && {
          title: {
            contains: search,
          },
        }),
      },
      select: {
        id: true,
        status: true,
        title: true,
        description: true,
        user_info: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        }
      },
    });

    if (!query) return sendErrorResponse(res, "Research not found.", 404);
    sendSuccessResponse(res, "success", query, createPagination(page, pageSize, total));

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function VerifyResearchById(req: Request, res: Response) {
  try {
    const { id = 0 } = req.params;
    const statusPrev = await prisma.research.findFirst({ where: { id: Number(id) } });
    const query = await prisma.research.update({
      where: {
        id: Number(id)
      },
      data: {
        status: statusPrev?.status === 2 ? 1 : 2,
      }
    })

    if (!query) return sendErrorResponse(res, "Research not found.", 404);
    sendSuccessResponse(res, "success", query, undefined);
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}