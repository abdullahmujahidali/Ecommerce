import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schemas/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    new BadRequestsException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
    );
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  if (user) {
    if (!compareSync(password, user.password)) {
      new BadRequestsException(
        "Incorrect password",
        ErrorCode.INCORRECT_PASSWORD
      );
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET
    );
    res.json({ user, token });
  }
};

export const me = async (req: Request, res: Response) => {
  console.log("req: ", req);
  res.json(req);
};
