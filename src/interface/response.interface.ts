import { Response } from "express";

interface Pagination {
    page: number,
    pageSize: number,
    total: number,
    totalPage: number,
}

function sendErrorResponse(res: Response, message: string, statusCode = 500, taskStatus = false) {
    return res.status(statusCode).json({ statusCode, taskStatus, message });
}

function sendSuccessResponse(res: Response, message: string, data: unknown, pagin?: Pagination, statusCode = 200, taskStatus = true) {
    return res.status(statusCode).json({ statusCode, taskStatus, message, data, pagin });
}

function createPagination(page: number, pageSize: number, total: number): Pagination {
    const totalPage = parseInt(Math.ceil(total / pageSize).toString())
    return {
        page,
        pageSize,
        total,
        totalPage,
    };
}
export { sendErrorResponse, sendSuccessResponse, createPagination };
