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
exports.LikeResearch = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const prisma = new client_1.PrismaClient();
function LikeResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { researchId } = req.query;
            const query_find = yield prisma.likes.findFirst({
                where: {
                    user_id: userId,
                    research_id: Number(researchId),
                }
            });
            if (query_find) {
                yield prisma.likes.delete({
                    where: {
                        id: query_find.id,
                    }
                });
            }
            else {
                yield prisma.likes.create({
                    data: {
                        research_id: Number(researchId),
                        user_id: userId,
                    }
                });
            }
            (0, response_interface_1.sendSuccessResponse)(res, "successful.", undefined);
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
exports.LikeResearch = LikeResearch;
//# sourceMappingURL=likes.controller.js.map