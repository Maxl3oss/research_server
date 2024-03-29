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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
            const { profile_url } = yield (0, helper_util_1.uploadFilesHelper)(req.files);
            const query = yield prisma.user.update({
                where: { id: id },
                data: Object.assign({}, ((profile_url && profile_url !== "") && { profile: profile_url }))
            });
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "Change profile fail.", 404);
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
                    profile: true,
                    first_name: true,
                    last_name: true,
                    status: true,
                    role_id: true,
                    prefix: true,
                },
            });
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "No user profile.", 404);
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
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const search = ((_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : undefined);
        const total = yield prisma.user.count({
            where: Object.assign({}, (search && {
                first_name: {
                    contains: search,
                },
                last_name: search,
            }))
        });
        const skip = (page - 1) * pageSize;
        try {
            const query = yield prisma.user.findMany({
                skip,
                take: pageSize,
                where: Object.assign({ status: {
                        not: 0
                    } }, (search && {
                    first_name: {
                        contains: search,
                    },
                })),
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
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", query, (0, response_interface_1.createPagination)(page, pageSize, total));
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
                return (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
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
            const { id } = req === null || req === void 0 ? void 0 : req.params;
            const query = yield prisma.user.findFirst({ where: { id: id } });
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
            const { password } = query, dataWithOutPassword = __rest(query, ["password"]);
            (0, response_interface_1.sendSuccessResponse)(res, "success", dataWithOutPassword);
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
                return (0, response_interface_1.sendErrorResponse)(res, "User not found.", 404);
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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = req.body;
            const { profile_url } = (_a = yield (0, helper_util_1.uploadFilesHelper)(req.files)) !== null && _a !== void 0 ? _a : "";
            const prevData = yield prisma.user.findUnique({ where: { id: id } });
            const query = yield prisma.user.update({
                where: {
                    id: id,
                },
                data: Object.assign(Object.assign({ prefix: (data === null || data === void 0 ? void 0 : data.prefix) || (prevData === null || prevData === void 0 ? void 0 : prevData.prefix), first_name: (data === null || data === void 0 ? void 0 : data.first_name) || (prevData === null || prevData === void 0 ? void 0 : prevData.first_name), last_name: (data === null || data === void 0 ? void 0 : data.last_name) || (prevData === null || prevData === void 0 ? void 0 : prevData.last_name), email: (data === null || data === void 0 ? void 0 : data.email) || (prevData === null || prevData === void 0 ? void 0 : prevData.email), role_id: Number(data === null || data === void 0 ? void 0 : data.role_id) || (prevData === null || prevData === void 0 ? void 0 : prevData.role_id) }, (data.password && profile_url !== "" && { password: yield bcrypt_1.default.hash(data.password, 9) })), ((profile_url && profile_url !== "") && { profile: profile_url }))
            });
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "Update user fail.", 404);
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