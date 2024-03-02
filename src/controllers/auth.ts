import { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync } from "bcrypt";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  user = await prismaClient.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
    },
  });
  res.json(user);
};
