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
exports.Create = exports.GetCommentsByIdResearch = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const prisma = new client_1.PrismaClient();
function GetCommentsByIdResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const { id = 0 } = req.params;
            const skip = (page - 1) * pageSize;
            const total = yield prisma.comments.count({ where: { research_id: Number(id) } });
            const query = yield prisma.comments.findMany({
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
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "NotFound", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", query, (0, response_interface_1.createPagination)(page, pageSize, total), 200, true);
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
exports.GetCommentsByIdResearch = GetCommentsByIdResearch;
function Create(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // variable
            const data = req.body;
            // check user
            const checkUserId = yield prisma.user.findFirstOrThrow({ where: { id: data.user_id } });
            // create data
            if (!checkUserId)
                return (0, response_interface_1.sendErrorResponse)(res, "ไม่พบไอดีผู้ใช้", 404);
            yield prisma.comments.create({
                data: {
                    research_id: (_a = data.research_id) !== null && _a !== void 0 ? _a : 0,
                    user_id: data.user_id,
                    contents: data.contents,
                    created_at: new Date(),
                },
            });
            (0, response_interface_1.sendSuccessResponse)(res, "Create research successful.", undefined);
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
exports.Create = Create;
//# sourceMappingURL=comment.controller.js.map