import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { sendErrorResponse, sendSuccessResponse, createPagination } from "../interface/response.interface";
import { uploadFilesHelper } from "../utils/helper.util";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function ChangeProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { profile_url } = await uploadFilesHelper(req.files, res);
    const query = await prisma.user.update({
      where: { id: id },
      data: { ...((profile_url && profile_url !== "") && { profile: profile_url }) }
    });

    if (!query) sendErrorResponse(res, "Change profile fail.", 404);
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
        password: true,
        profile: true,
        first_name: true,
        last_name: true,
        status: true,
        role_id: true,
        prefix: true,
      },
    });

    if (!query) sendErrorResponse(res, "No user profile.", 404);
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
  try {
    const query = await prisma.user.findMany({
      where: { status: { not: 0 } },
      select: {
        id: true,
        prefix: true,
        first_name: true,
        last_name: true,
        status: true,
      }
    });

    if (!query) sendErrorResponse(res, "User not found.", 404);
    sendSuccessResponse(res, "success", undefined);

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

    if (!query) sendErrorResponse(res, "User not found.", 404);
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
    const { id } = req.params;
    const query = await prisma.user.findFirst({ where: { id: id } });

    if (!query) sendErrorResponse(res, "User not found.", 404);
    sendSuccessResponse(res, "success", undefined);

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

    if (!query) sendErrorResponse(res, "User not found.", 404);
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
    const { profile_url } = await uploadFilesHelper(req.files, res);
    const hashPass = await bcrypt.hash(data.password, 9);

    const query = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        prefix: data.prefix,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        ...(hashPass && { password: hashPass }),
        ...((profile_url && profile_url !== "") && { profile: profile_url }),
      }
    });

    if (!query) sendErrorResponse(res, "Update user fail.", 404);
    sendSuccessResponse(res, "success", undefined);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}