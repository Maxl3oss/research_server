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
exports.verifyEmail = exports.Register = exports.Login = void 0;
const client_1 = require("@prisma/client");
const response_interface_1 = require("../interface/response.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer_1 = require("nodemailer");
require("dotenv").config();
const prisma = new client_1.PrismaClient();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const HOST_WEB = process.env.HOST_WEB;
function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const GetUser = yield prisma.user.findFirst({
                where: {
                    email: email,
                    OR: [
                        { status: 1 },
                        { status: 2 },
                    ],
                },
                select: {
                    first_name: true,
                    last_name: true,
                    profile: true,
                    email: true,
                    status: true,
                    password: true,
                },
            });
            if (GetUser && password && email) {
                // Compare the provided plaintext password with the hashed password from the database
                if ((GetUser === null || GetUser === void 0 ? void 0 : GetUser.status) === 2)
                    return (0, response_interface_1.sendErrorResponse)(res, "Your email has not been verified.", 401);
                const isPasswordMatch = bcrypt_1.default.compareSync(password, GetUser.password);
                if (isPasswordMatch) {
                    return (0, response_interface_1.sendSuccessResponse)(res, "Login successful.", GetUser);
                }
            }
            return (0, response_interface_1.sendErrorResponse)(res, "Email or password invalid.", 200);
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
exports.Login = Login;
function Register(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const hashPass = yield bcrypt_1.default.hash(data.password, 9);
            const checkUser = yield prisma.user.findFirst({
                where: {
                    email: data.email,
                }
            });
            if (checkUser)
                return (0, response_interface_1.sendErrorResponse)(res, `This email already exists!!`, 409);
            yield prisma.user.create({
                data: {
                    prefix: data.prefix,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    password: hashPass,
                    profile: (_a = data.profile) !== null && _a !== void 0 ? _a : null,
                    role_id: 1,
                    status: 2,
                }
            });
            yield SendEmail(data, res);
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
exports.Register = Register;
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const QEmail = req.query.email;
            const { email } = (0, jsonwebtoken_1.verify)(QEmail, TOKEN_SECRET);
            const checkEmail = yield prisma.user.findFirst({
                where: {
                    email: email,
                }
            });
            const updateStatus = checkEmail ? yield prisma.user.update({
                where: {
                    email: email,
                },
                data: {
                    status: 1,
                }
            }) : false;
            if (!checkEmail || !updateStatus) {
                return res.status(404).send(`
          <title>Verified</title>
          <body style="background-color: #222; color: #fff; font-family:courier; width: 100vw; text-align:center;">
            <h1 style="padding: 50px 0px 0px;">
                Failed to verify.
            </h1>
          </body>
      `);
            }
            return res.status(200).send(`
      <title>Verified</title>
      <body style="background-color: #222; color: #fff; font-family:courier; width: 100vw; text-align:center;">
        <h1 style="padding: 50px 0px 0px;">
        Verification successful.
        </h1>
      </body>
      `);
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
exports.verifyEmail = verifyEmail;
const SendEmail = (data, res) => __awaiter(void 0, void 0, void 0, function* () {
    //send verify email
    const tokenMail = (0, jsonwebtoken_1.sign)({ email: data.email }, TOKEN_SECRET, {
        expiresIn: "1h",
    });
    const tranSporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });
    const option = {
        from: `Verify your email < ${process.env.EMAIL} >`,
        to: data.email,
        subject: "Research - verify your email",
        html: `<div class="center">
              <h1 style="padding: 35px 0px 0px;">${data.first_name} ${data.last_name}!</h1>
              <h2>Thanks for registering on our site.</h2>
              <h4>Please verify your mail to continue...</h4>
              <br />
              <br />
                <a style="color: inherit; text-decoration: inherit; background-color: #222; color: white; border-radius: 20%; padding: 15px;" 
                  href="${HOST_WEB}/api/auth/verify-email?email=${tokenMail}"
                >
                  Verify Your Email
                </a>
           </div>
    `
    };
    tranSporter.sendMail(option, (err, info) => {
        if (err) {
            console.log("error => ", err);
            return (0, response_interface_1.sendErrorResponse)(res, `ERROR ${err}`, 500);
        }
        else {
            console.log("Send => " + info.response);
            (0, response_interface_1.sendSuccessResponse)(res, "Created successful.", undefined);
        }
    });
});
//# sourceMappingURL=auth.controller.js.map