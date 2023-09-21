import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { sendErrorResponse, sendSuccessResponse } from "../interface/response.interface";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { TokenPayloadVerify, UserEmail } from "../interface/user.interface";
require("dotenv").config();

const prisma = new PrismaClient();
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const HOST_WEB = process.env.HOST_WEB as string;


async function Login(req: Request, res: Response) {
  try {
    const { email, password }: UserEmail = req.body;

    const GetUser = await prisma.user.findFirst({
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
      if (GetUser?.status === 2) return sendErrorResponse(res, "Your email has not been verified.", 401);

      const isPasswordMatch = bcrypt.compareSync(password, GetUser.password);

      if (isPasswordMatch) {
        return sendSuccessResponse(res, "Login successful.", GetUser);
      }
    }

    return sendErrorResponse(res, "Email or password invalid.", 200);

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function Register(req: Request, res: Response) {
  try {
    const data: User = req.body;

    const hashPass = await bcrypt.hash(data.password, 9);

    const checkUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      }
    })
    if (checkUser) return sendErrorResponse(res, `This email already exists!!`, 409);
    await prisma.user.create({
      data: {
        prefix: data.prefix,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashPass,
        profile: data.profile ?? null,
        role_id: 1,
        status: 2,
      }
    });

    await SendEmail(data, res)

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

async function verifyEmail(req: Request, res: Response) {
  try {
    const QEmail: string | undefined = req.query.email as string;
    const { email } = verify(QEmail, TOKEN_SECRET) as TokenPayloadVerify;

    const checkEmail = await prisma.user.findFirst({
      where: {
        email: email,
      }
    });
    const updateStatus = checkEmail ? await prisma.user.update({
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

    return res.status(200).send(
      `
      <title>Verified</title>
      <body style="background-color: #222; color: #fff; font-family:courier; width: 100vw; text-align:center;">
        <h1 style="padding: 50px 0px 0px;">
        Verification successful.
        </h1>
      </body>
      `
    )

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, "Internal server error.");
  } finally {
    await prisma.$disconnect();
  }
}

const SendEmail = async (data: User, res: Response) => {
  //send verify email
  const tokenMail = sign({ email: data.email }, TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const tranSporter = createTransport({
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
      return sendErrorResponse(res, `ERROR ${err}`, 500);
    } else {
      console.log("Send => " + info.response);
      sendSuccessResponse(res, "Created successful.", undefined);
    }
  });
}

export { Login, Register, verifyEmail };
