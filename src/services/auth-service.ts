import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

const verifyUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return user;
};

export const authService = { verifyUser };
