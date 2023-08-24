"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'application/pdf') {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
const uploads = (0, multer_1.default)({
    // storage: storage,
    fileFilter: fileFilter,
    storage: multer_1.default.diskStorage({}),
    limits: {
        fieldSize: 10 * 1024 * 1024,
        fileSize: 50000000, // Around 10MB
    },
});
const iMulter = { uploads, fileFilter };
exports.default = iMulter;
//# sourceMappingURL=multer.util.js.map