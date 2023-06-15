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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function Create() {
    return __awaiter(this, void 0, void 0, function* () {
        // const newUser = await prisma.user.create({
        //   data: {
        //     fname: "Narongrid",
        //     lname: "Naorkham",
        //     email: "narongrid.dev@gmail.com",
        //     password: "asdf",
        //     role_id: 1,
        //     status: 1,
        //   },
        // });
        const GetUser = yield prisma.user.findUnique({
            where: {
                id: "cli1w14it0000zvx59dmmlc2b",
            },
            select: {
                fname: true,
                lname: true,
                email: true,
            },
        });
        return GetUser;
    });
}
Create().then((res) => console.log(res));
//# sourceMappingURL=seed.js.map