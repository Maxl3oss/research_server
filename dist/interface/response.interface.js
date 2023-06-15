"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPagination = exports.sendSuccessResponse = exports.sendErrorResponse = void 0;
function sendErrorResponse(res, message, statusCode = 500, taskStatus = false) {
    return res.status(statusCode).json({ statusCode, taskStatus, message });
}
exports.sendErrorResponse = sendErrorResponse;
function sendSuccessResponse(res, message, data, pagin, statusCode = 200, taskStatus = true) {
    return res.status(statusCode).json({ statusCode, taskStatus, message, data, pagin });
}
exports.sendSuccessResponse = sendSuccessResponse;
function createPagination(page, pageSize, total) {
    const totalPage = parseInt(Math.ceil(total / pageSize).toString());
    return {
        page,
        pageSize,
        total,
        totalPage,
    };
}
exports.createPagination = createPagination;
//# sourceMappingURL=response.interface.js.map