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
exports.GetProfile = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const prisma = new client_1.PrismaClient();
function GetUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { page = 1, pageSize = 10 } = req.body;
            const skip = (page - 1) * pageSize;
            const GetUser = yield prisma.user.findMany({
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
            const total = yield prisma.user.count({
                where: {
                    status: 1,
                },
            });
            if (!GetUser)
                (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", GetUser, (0, response_interface_1.createPagination)(page, pageSize, total));
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
exports.GetProfile = GetUser;
//# sourceMappingURL=user.controller.js.map