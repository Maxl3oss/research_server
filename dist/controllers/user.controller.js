"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserById = exports.GetUserById = exports.DeleteUsersById = exports.GetUsersAll = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const prisma = new client_1.PrismaClient();
// admin
function GetUsersAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = yield prisma.user.findMany({
                where: { status: { not: 0 } },
                select: {
                    id: true,
                    prefix: true,
                    first_name: true,
                    last_name: true,
                    status: true,
                }
            });
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", undefined);
        }
        catch (err) {
            console.error(err);
            (0, response_interface_1.sendErrorResponse)(res, "Internal server error.");
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.GetUsersAll = GetUsersAll;
function DeleteUsersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const query = yield prisma.user.update({ where: { id: id }, data: { status: 0 } });
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", undefined);
        }
        catch (err) {
            console.error(err);
            (0, response_interface_1.sendErrorResponse)(res, "Internal server error.");
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.DeleteUsersById = DeleteUsersById;
function GetUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const query = yield prisma.user.findFirst({ where: { id: id } });
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", undefined);
        }
        catch (err) {
            console.error(err);
            (0, response_interface_1.sendErrorResponse)(res, "Internal server error.");
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.GetUserById = GetUserById;
function verifyUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const statusPrev = yield prisma.user.findFirst({ where: { id: id } });
            const query = yield prisma.user.update({ where: { id: id }, data: { status: (statusPrev === null || statusPrev === void 0 ? void 0 : statusPrev.status) === 2 ? 1 : 2 } });
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", undefined);
        }
        catch (err) {
            console.error(err);
            (0, response_interface_1.sendErrorResponse)(res, "Internal server error.");
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.verifyUserById = verifyUserById;
//# sourceMappingURL=user.controller.js.map