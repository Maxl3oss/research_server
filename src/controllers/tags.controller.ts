import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendErrorResponse, sendSuccessResponse } from "../interface/response.interface";

const prisma = new PrismaClient();

async function GetTags(req: Request, res: Response) {
  try {
    const GetTagsPrisma = await prisma.tags.findMany({
      select: { id: true, name: true }
    });

    if (!GetTagsPrisma) sendErrorResponse(res, "Tags not found.", 404);

    sendSuccessResponse(res, "success", GetTagsPrisma);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export { GetTags }