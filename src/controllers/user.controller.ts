import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";

const prisma = new PrismaClient();

async function GetUser(req: Request, res: Response) {
  try {
    const { page = 1, pageSize = 10 } = req.body;
    const skip = (page - 1) * pageSize;
    const GetUser = await prisma.user.findMany({
      skip,
      take: pageSize,
      where: {
        status: 1,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });
    const total = await prisma.user.count({
      where: {
        status: 1,
      },
    });

    if (!GetUser) sendErrorResponse(res, "User not found.", 404);

    sendSuccessResponse(res, "success", GetUser, createPagination(page, pageSize, total));

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export { GetUser as GetProfile }