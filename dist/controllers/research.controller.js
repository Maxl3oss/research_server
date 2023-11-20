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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyResearchById = exports.GetResearchAll = exports.RatingStarsResearch = exports.DeleteResearch = exports.UpdateResearch = exports.GetResearchDetailById = exports.GetResearchByUserId = exports.GetResearch = exports.Create = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const helper_util_1 = require("../utils/helper.util");
const prisma = new client_1.PrismaClient();
function Create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // variable
            const data = req.body ? req.body : {};
            // upload file
            const { image_url, pdf_url, pdf_name } = yield (0, helper_util_1.uploadFilesHelper)(req.files, res);
            // create data
            yield prisma.research.create({
                data: {
                    title: data.title,
                    title_alternative: data.title_alternative,
                    creator: data.creator,
                    subject: data.subject,
                    description: data.description,
                    publisher: data.publisher,
                    contributor: data.contributor,
                    source: data.source,
                    rights: data.rights,
                    year_creation: new Date(data.year_creation) || new Date(),
                    file_url: pdf_url,
                    file_name: pdf_name,
                    image_url: image_url,
                    tags_id: Number(data.tags_id || undefined),
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
            const skip = (page - 1) * pageSize;
            const total = yield prisma.research.count({ where: { status: 1, } });
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
                        }
                    },
                    tags_info: true,
                    Rating: true,
                    _count: {
                        select: {
                            Likes: true,
                        },
                    },
                },
            });
            if (!queryResearch)
                return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
            // calculator avg
            const researchWithAverageRating = queryResearch.map((_a) => {
                var { Rating } = _a, researchItem = __rest(_a, ["Rating"]);
                const ratings = Rating.map(ratingItem => parseFloat(ratingItem.rating.toString()));
                const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
                return {
                    id: researchItem.id,
                    title: researchItem.title,
                    title_alternative: researchItem.title_alternative,
                    description: researchItem.description,
                    image_url: researchItem.image_url,
                    user_info: researchItem.user_info,
                    tags_info: researchItem.tags_info,
                    likes: researchItem._count.Likes,
                    views: researchItem.views,
                    average_rating: averageRating
                };
            });
            (0, response_interface_1.sendSuccessResponse)(res, "success", researchWithAverageRating, (0, response_interface_1.createPagination)(page, pageSize, total));
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
function GetResearchByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const status = Number(req.query.status || 0);
            const userId = req.params.userId || "";
            // 1 == public 2 == no public 3 === all(public and no) 4 == list research is user like
            const statusValues = [1, 2, 3].includes(status) ? (status === 3 ? [1, 2] : status) : (status === 4 ? 4 : 0);
            const skip = (page - 1) * pageSize;
            const countResearchUser = yield prisma.research.count({ where: { user_id: req.params.userId || "" } });
            if (statusValues === 4) {
                const total = yield prisma.likes.count({ where: { user_id: userId } });
                const queryResearchByLikeId = yield prisma.likes.findMany({
                    skip,
                    take: pageSize,
                    where: {
                        user_id: userId,
                        research_info: {
                            user_id: {
                                not: userId,
                            }
                        }
                    },
                    include: {
                        research_info: {
                            select: {
                                id: true,
                                title: true,
                                image_url: true,
                                description: true,
                                user_info: {
                                    select: {
                                        id: true,
                                    }
                                }
                            }
                        },
                    }
                });
                if (!queryResearchByLikeId)
                    (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
                const filData = queryResearchByLikeId.map((curr) => curr.research_info);
                (0, response_interface_1.sendSuccessResponse)(res, "success", { countResearch: countResearchUser, dataResearch: filData }, (0, response_interface_1.createPagination)(page, pageSize, total), 200, true);
            }
            else {
                const total = yield prisma.research.count({ where: { status: { in: statusValues }, user_id: userId } });
                const queryResearch = yield prisma.research.findMany({
                    skip,
                    take: pageSize,
                    where: {
                        status: {
                            in: statusValues,
                        },
                        user_id: req.params.userId || "",
                    },
                    select: {
                        id: true,
                        title: true,
                        image_url: true,
                        description: true,
                    }
                });
                if (!queryResearch)
                    return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
                (0, response_interface_1.sendSuccessResponse)(res, "success", { countResearch: countResearchUser, dataResearch: queryResearch }, (0, response_interface_1.createPagination)(page, pageSize, total), 200, true);
            }
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
exports.GetResearchByUserId = GetResearchByUserId;
function GetResearchDetailById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log(req?.query);
            const { id = 0 } = (req === null || req === void 0 ? void 0 : req.query) || {};
            const queryResearch = yield prisma.research.findMany({
                where: {
                    id: Number(id),
                    status: { not: 0 }
                },
                include: {
                    user_info: {
                        select: {
                            prefix: true,
                            first_name: true,
                            last_name: true,
                        }
                    },
                    tags_info: {
                        select: {
                            name: true,
                        }
                    },
                    Likes: {
                        where: {
                            user_id: req.params.userId || "",
                        }
                    },
                    Rating: {
                        where: {
                            user_id: req.params.userId || "",
                        }
                    },
                }
            });
            if (!queryResearch)
                return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
            const query_like_count = yield prisma.likes.count({
                where: {
                    research_id: queryResearch[0].id,
                }
            });
            // calculator avg
            const researchWithAverageRating = queryResearch.map((_a) => {
                var _b, _c;
                var { Rating, Likes } = _a, researchItem = __rest(_a, ["Rating", "Likes"]);
                return Object.assign(Object.assign({}, researchItem), { rating_id: ((_b = Rating[0]) === null || _b === void 0 ? void 0 : _b.id) || null, average_rating: ((_c = Rating[0]) === null || _c === void 0 ? void 0 : _c.rating) || 0, like: (Likes === null || Likes === void 0 ? void 0 : Likes.length) > 0, likes_count: query_like_count });
            });
            if (queryResearch[0].user_id !== (req.params.userId || "")) {
                yield prisma.research.update({
                    where: {
                        id: Number(queryResearch[0].id),
                    },
                    data: {
                        views: {
                            increment: 1,
                        },
                    }
                });
            }
            (0, response_interface_1.sendSuccessResponse)(res, "success", researchWithAverageRating[0]);
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
exports.GetResearchDetailById = GetResearchDetailById;
function UpdateResearch(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // variable
            const data = (_a = req.body) !== null && _a !== void 0 ? _a : {};
            // upload file
            const { image_url, pdf_url, pdf_name } = yield (0, helper_util_1.uploadFilesHelper)(req.files, res);
            // update data
            const queryResearch = yield prisma.research.update({
                where: {
                    id: Number(req.params.id || 0),
                },
                data: {
                    title: data.title,
                    title_alternative: data.title_alternative,
                    creator: data.creator,
                    subject: data.subject,
                    description: data.description,
                    publisher: data.publisher,
                    contributor: data.contributor,
                    source: data.source,
                    rights: data.rights,
                    year_creation: data.year_creation,
                    tags_id: Number(data.tags_id || undefined),
                    file_name: pdf_name,
                    file_url: pdf_url || undefined,
                    image_url: image_url || undefined,
                },
            });
            if (!queryResearch)
                return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
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
// export async function UploadImageToCloud(req: Request, res: Response) {
//   try {
//     let image = "", pdf = "";
//     const files = req.files;
//     // if (typeof file === "object" && file !== null && 'image' in file) {
//     if (typeof files === "object" && files !== null && "image" in files) {
//       await cloud.uploadImage(files.image[0]["path"]).then((url: any) => image = url);
//     }
//     if (typeof files === "object" && "pdf" in files) {
//       await cloud.uploadPDF(files.pdf[0]["path"]).then((url: any) => pdf = url);
//     }
//     res.json({ mes: "ยังไง", image, pdf });
//     // const result = await cloud..uploader.upload(file.path);
//     // Handle the Cloudinary response (e.g., store the URL in a database)
//     // res.json(result);
//   } catch (err) {
//     console.error(err);
//     sendErrorResponse(res, "Internal server error.");
//   }
// }
function DeleteResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const queryResearch = yield prisma.research.update({
                where: {
                    id: Number(id || 0),
                },
                data: {
                    status: 0,
                },
            });
            if (!queryResearch)
                return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
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
function RatingStarsResearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // variable
            const { userId, ratingId, rating } = req.body ? req.body : {};
            const researchId = Number(req.params.researchId || 0);
            // check 
            const check = yield prisma.rating.findFirst({ where: { user_id: userId, research_id: researchId } });
            if (!check) {
                // create data
                yield prisma.rating.create({
                    data: {
                        rating: rating,
                        user_id: userId,
                        research_id: researchId,
                    }
                });
            }
            else {
                // update data
                const queryRating = yield prisma.rating.update({
                    where: {
                        id: Number(ratingId || 0),
                    },
                    data: {
                        rating: rating
                    }
                });
                if (!queryRating)
                    return (0, response_interface_1.sendErrorResponse)(res, "Rating not found.", 404);
            }
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
exports.RatingStarsResearch = RatingStarsResearch;
// admin
function GetResearchAll(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const search = ((_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : undefined);
            // console.log(search)
            const total = yield prisma.research.count({
                where: Object.assign({}, (search && {
                    title: {
                        contains: search,
                    },
                }))
            });
            const skip = (page - 1) * pageSize;
            const query = yield prisma.research.findMany({
                skip,
                take: pageSize,
                where: Object.assign({ NOT: {
                        status: 0
                    } }, (search && {
                    title: {
                        contains: search,
                    },
                })),
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    user_info: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                        }
                    }
                },
            });
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
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
exports.GetResearchAll = GetResearchAll;
function VerifyResearchById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id = 0 } = req.params;
            const statusPrev = yield prisma.research.findFirst({ where: { id: Number(id) } });
            const query = yield prisma.research.update({
                where: {
                    id: Number(id)
                },
                data: {
                    status: (statusPrev === null || statusPrev === void 0 ? void 0 : statusPrev.status) === 2 ? 1 : 2,
                }
            });
            if (!query)
                return (0, response_interface_1.sendErrorResponse)(res, "Research not found.", 404);
            (0, response_interface_1.sendSuccessResponse)(res, "success", query, undefined);
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
exports.VerifyResearchById = VerifyResearchById;
//# sourceMappingURL=research.controller.js.map