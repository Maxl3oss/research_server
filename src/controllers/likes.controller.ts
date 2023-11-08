import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse } from "../interface/response.interface";
const prisma = new PrismaClient();

export async function LikeResearch(req: Request, res: Response) {
  try {

    const { userId } = req.params;
    const { researchId } = req.query;

    const query_find = await prisma.likes.findFirst({
      where: {
        user_id: userId,
        research_id: Number(researchId),
      }
    });
    
    if (query_find) {

      await prisma.likes.delete({
        where: {
          id: query_find.id,
        }
      });

    } else {

      await prisma.likes.create({
        data: {
          research_id: Number(researchId),
          user_id: userId,
        }
      });

    }

    sendSuccessResponse(res, "successful.", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}
