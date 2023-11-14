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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = exports.verifyUserById = exports.GetUserById = exports.DeleteUsersById = exports.GetUsersAll = exports.GetProfile = exports.ChangeProfile = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const helper_util_1 = require("../utils/helper.util");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function ChangeProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { profile_url } = yield (0, helper_util_1.uploadFilesHelper)(req.files, res);
            const query = yield prisma.user.update({
                where: { id: id },
                data: Object.assign({}, ((profile_url && profile_url !== "") && { profile: profile_url }))
            });
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "Change profile fail.", 404);
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
exports.ChangeProfile = ChangeProfile;
function GetProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const query = yield prisma.user.findFirst({
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
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "No user profile.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", query);
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
exports.GetProfile = GetProfile;
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
function Update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = req.body;
            const { profile_url } = yield (0, helper_util_1.uploadFilesHelper)(req.files, res);
            const hashPass = yield bcrypt_1.default.hash(data.password, 9);
            const query = yield prisma.user.update({
                where: {
                    id: id,
                },
                data: Object.assign(Object.assign({ prefix: data.prefix, first_name: data.first_name, last_name: data.last_name, email: data.email }, (hashPass && { password: hashPass })), ((profile_url && profile_url !== "") && { profile: profile_url }))
            });
            if (!query)
                (0, response_interface_1.sendErrorResponse)(res, "Update user fail.", 404);
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
exports.Update = Update;
//# sourceMappingURL=user.controller.js.map