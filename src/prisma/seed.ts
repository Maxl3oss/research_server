// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function Create() {
//   // const newUser = await prisma.user.create({
//   //   data: {
//   //     fname: "Narongrid",
//   //     lname: "Naorkham",
//   //     email: "narongrid.dev@gmail.com",
//   //     password: "asdf",
//   //     role_id: 1,
//   //     status: 1,
//   //   },
//   // });

//   const GetUser = await prisma.user.findUnique({
//     where: {
//       id: "cli1w14it0000zvx59dmmlc2b",
//     },
//     select: {
//       fname: true,
//       lname: true,
//       email: true,
//     },
//   });

//   return GetUser;
// }

// Create().then((res) => console.log(res));
