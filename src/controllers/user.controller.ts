import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";
import { uploadFilesHelper } from "../utils/helper.util";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function ChangeProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { profile_url } = await uploadFilesHelper(req.files);
    const query = await prisma.user.update({
      where: { id: id },
      data: { ...((profile_url && profile_url !== "") && { profile: profile_url }) }
    });

    if (!query) return sendErrorResponse(res, "Change profile fail.", 404);
    sendSuccessResponse(res, "success", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const query = await prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        email: true,
        profile: true,
        first_name: true,
        last_name: true,
        status: true,
        role_id: true,
        prefix: true,
      },
    });

    if (!query) return sendErrorResponse(res, "No user profile.", 404);
    sendSuccessResponse(res, "success", query);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

// admin
export async function GetUsersAll(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const search = (req.query?.search ?? undefined) as string;
  const total = await prisma.user.count({
    where: {
      ...(search && {
        first_name: {
          contains: search,
        },
        last_name: search,
      }),
    }
  });
  const skip = (page - 1) * pageSize;

  try {
    const query = await prisma.user.findMany({
      skip,
      take: pageSize,
      where: {
        status: {
          not: 0
        },
        ...(search && {
          first_name: {
            contains: search,
          },
        }),
      },
      select: {
        id: true,
        profile: true,
        prefix: true,
        first_name: true,
        last_name: true,
        email: true,
        status: true,
        role_id: true,
      }
    });

    if (!query) return sendErrorResponse(res, "User not found.", 404);
    sendSuccessResponse(res, "success", query, createPagination(page, pageSize, total));

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function DeleteUsersById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const query = await prisma.user.update({ where: { id: id }, data: { status: 0 } });

    if (!query) return sendErrorResponse(res, "User not found.", 404);
    sendSuccessResponse(res, "success", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetUserById(req: Request, res: Response) {
  try {
    const { id } = req?.params;
    const query = await prisma.user.findFirst({ where: { id: id } });

    if (!query) return sendErrorResponse(res, "User not found.", 404);
    const { password, ...dataWithOutPassword } = query;
    sendSuccessResponse(res, "success", dataWithOutPassword);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function verifyUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const statusPrev = await prisma.user.findFirst({ where: { id: id } });
    const query = await prisma.user.update({ where: { id: id }, data: { status: statusPrev?.status === 2 ? 1 : 2 } });

    if (!query) return sendErrorResponse(res, "User not found.", 404);
    sendSuccessResponse(res, "success", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function Update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data: User = req.body;
    const { profile_url } = await uploadFilesHelper(req.files) ?? "";

    const prevData = await prisma.user.findUnique({ where: { id: id } });

    const query = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        prefix: data?.prefix || prevData?.prefix,
        first_name: data?.first_name || prevData?.first_name,
        last_name: data?.last_name || prevData?.last_name,
        email: data?.email || prevData?.email,
        role_id: Number(data?.role_id) || prevData?.role_id,
        ...(data.password && profile_url !== "" && { password: await bcrypt.hash(data.password, 9) }),
        ...((profile_url && profile_url !== "") && { profile: profile_url }),
      }
    });

    if (!query) return sendErrorResponse(res, "Update user fail.", 404);
    sendSuccessResponse(res, "success", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}