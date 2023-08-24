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
exports.DeleteResearch = exports.UploadImageToCloud = exports.UpdateResearch = exports.GetResearch = exports.Create = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const cloudinary_util_1 = __importDefault(require("../utils/cloudinary.util"));
const prisma = new client_1.PrismaClient();
function Create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // variable
            const data = JSON.parse(req.body.data);
            const files = req.files;
            let pdf_url = "", image_url = "";
            // upload file
            const uploadFile = (files) => __awaiter(this, void 0, void 0, function* () {
                if (typeof files === "object" && files !== null) {
                    if ('image' in files) {
                        yield cloudinary_util_1.default.uploadImage(files.image[0]["path"]).then((url) => (image_url = url)).catch((err) => (0, response_interface_1.sendErrorResponse)(res, err));
                    }
                    if ('pdf' in files) {
                        yield cloudinary_util_1.default.uploadPDF(files.pdf[0]["path"]).then((url) => (pdf_url = url)).catch((err) => (0, response_interface_1.sendErrorResponse)(res, err));
                    }
                }
                else {
                    (0, response_interface_1.sendErrorResponse)(res, "file not found", 404);
                }
            });
            yield uploadFile(files);
            // create data
            yield prisma.research.create({
                data: {
                    title: data.title,
                    title_alternative: data.title_alternative,
                    creator: data.creator,
                    subject: data.subject,
                    description: data.description,
                    publisher: data.publisher,
                    type: data.type,
                    contributor: data.contributor,
                    source: data.source,
                    rights: data.rights,
                    year_creation: data.year_creation,
                    file_url: pdf_url,
                    image_url: image_url,
                    status: data.status,
                    user_id: data.user_id,
                }
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
function GetResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            // const { page = 1, pageSize = 10 } = Number(req.params);
            const skip = (page - 1) * pageSize;
            const queryResearch = yield prisma.research.findMany({
                skip,
                take: pageSize,
                where: {
                    status: 1,
                },
                include: {
                    user_info: {
                        select: {
                            prefix: true,
                            first_name: true,
                            last_name: true,
                            // profile: true,
                        }
                    },
                },
            });
            const total = yield prisma.research.count({
                where: {
                    status: 1,
                },
            });
            if (!queryResearch)
                (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", queryResearch, (0, response_interface_1.createPagination)(page, pageSize, total));
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
exports.GetResearch = GetResearch;
function UpdateResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const queryResearch = yield prisma.research.update({
                where: {
                    id: data.id,
                },
                data: {
                    title: data.title,
                    title_alternative: data.title_alternative,
                    creator: data.creator,
                    subject: data.subject,
                    description: data.description,
                    publisher: data.publisher,
                    type: data.type,
                    contributor: data.contributor,
                    source: data.source,
                    rights: data.rights,
                    year_creation: data.year_creation,
                    file_url: data.file_url,
                    image_url: data.image_url,
                    status: data.status,
                },
            });
            if (!queryResearch)
                (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "Updated research successful.", undefined);
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
exports.UpdateResearch = UpdateResearch;
function UploadImageToCloud(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let image = "", pdf = "";
            const files = req.files;
            // if (typeof file === "object" && file !== null && 'image' in file) {
            if (typeof files === "object" && files !== null && "image" in files) {
                yield cloudinary_util_1.default.uploadImage(files.image[0]["path"]).then((url) => image = url);
            }
            if (typeof files === "object" && "pdf" in files) {
                yield cloudinary_util_1.default.uploadPDF(files.pdf[0]["path"]).then((url) => pdf = url);
            }
            res.json({ mes: "ยังไง", image, pdf });
            // const result = await cloud..uploader.upload(file.path);
            // Handle the Cloudinary response (e.g., store the URL in a database)
            // res.json(result);
        }
        catch (err) {
            console.error(err);
            (0, response_interface_1.sendErrorResponse)(res, "Internal server error.");
        }
    });
}
exports.UploadImageToCloud = UploadImageToCloud;
function DeleteResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const queryResearch = yield prisma.research.update({
                where: {
                    id: Number(id),
                },
                data: {
                    status: 0,
                },
            });
            if (!queryResearch)
                (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "Delete research successful.", undefined);
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
exports.DeleteResearch = DeleteResearch;
//# sourceMappingURL=research.controller.js.map