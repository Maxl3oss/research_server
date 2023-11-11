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
exports.authorizeAdmin = exports.authenticateJWT = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_SECRET = (process.env.TOKEN_SECRET || "");
const prisma = new client_1.PrismaClient();
const authenticateJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticateJWT = authenticateJWT;
const authorizeAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user && user.role === 1 && user.id) {
            const fillUser = yield prisma.user.findFirst({ where: { id: user.id, role_id: 1 } });
            if (fillUser) {
                return next();
            }
        }
        // If any condition fails, send a 403 Forbidden response
        res.status(403).json({ message: 'Forbidden' });
    }
    catch (error) {
        console.error('Error in authorizeAdmin middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=authMiddleware.js.map