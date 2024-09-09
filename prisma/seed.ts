import { PrismaClient, Prisma } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  try {
    const salt = await genSalt(10);

    // Create roles
    const adminRole = await prisma.role.create({
      data: { name: "admin" },
    });

    const userRole = await prisma.role.create({
      data: { name: "user" },
    });

    // Create users and store their IDs
    const adminUser = await prisma.user.create({
      data: {
        fullName: "Admin",
        email: "admin@email.com",
        isEmailConfirmed: true,
        password: await hash("adminpass", salt),
        roleId: adminRole.id,
      },
    });

    const janeSmith = await prisma.user.create({
      data: {
        fullName: "Jane Smith",
        email: "jane.smith@email.com",
        isEmailConfirmed: true,
        password: await hash("janepass", salt),
        roleId: userRole.id,
      },
    });

    const michaelJohnson = await prisma.user.create({
      data: {
        fullName: "Michael Johnson",
        email: "michael.johnson@email.com",
        isEmailConfirmed: true,
        password: await hash("michaelpass", salt),
        roleId: userRole.id,
      },
    });

    const johnDoe = await prisma.user.create({
      data: {
        fullName: "John Doe",
        email: "john.doe@email.com",
        isEmailConfirmed: true,
        password: await hash("johnpass", salt),
        roleId: userRole.id,
      },
    });

    // Create books, using the IDs from the created users
    await prisma.book.createMany({
      data: [
        { title: "Moby Dick", author: "Herman Melville", userId: janeSmith.id },
        {
          title: "Pride and Prejudice",
          author: "Jane Austen",
          userId: janeSmith.id,
        },
        { title: "1984", author: "George Orwell", userId: michaelJohnson.id },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          userId: michaelJohnson.id,
        },
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          userId: michaelJohnson.id,
        },
        { title: "War and Peace", author: "Leo Tolstoy", userId: johnDoe.id },
        {
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          userId: johnDoe.id,
        },
        {
          title: "Brave New World",
          author: "Aldous Huxley",
          userId: johnDoe.id,
        },
        { title: "The Hobbit", author: "J.R.R. Tolkien", userId: johnDoe.id },
        {
          title: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          userId: johnDoe.id,
        },
      ],
    });

    console.log("Seed data successfully inserted");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
