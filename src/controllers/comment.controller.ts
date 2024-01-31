import { Request, Response } from "express";
import { Comments, PrismaClient } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";

const prisma = new PrismaClient();

export async function GetCommentsByIdResearch(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const { id = 0 } = req.params;
    const skip = (page - 1) * pageSize;

    const total = await prisma.comments.count({ where: { research_id: Number(id) } });
    const query = await prisma.comments.findMany({
      skip,
      take: pageSize,
      where: {
        research_id: Number(id),
      },
      select: {
        id: true,
        contents: true,
        created_at: true,
        user_info: {
          select: {
            profile: true,
            prefix: true,
            first_name: true,
            last_name: true,
            Rating: {
              where: {
                research_id: Number(id),
              },
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc"
      }
    });

    if (!query) return sendErrorResponse(res, "NotFound", 404);

    sendSuccessResponse(res, "success", query, createPagination(page, pageSize, total), 200, true);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function Create(req: Request, res: Response) {
  try {
    // variable
    const data: Comments = req.body;

    // check user
    const checkUserId = await prisma.user.findFirstOrThrow({ where: { id: data.user_id } })

    // create data
    if (!checkUserId) return sendErrorResponse(res, "ไม่พบไอดีผู้ใช้", 404);

    await prisma.comments.create({
      data: {
        research_id: data.research_id ?? 0,
        user_id: data.user_id,
        contents: data.contents,
        created_at: new Date(),
      },
    });

    sendSuccessResponse(res, "Create research successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}
