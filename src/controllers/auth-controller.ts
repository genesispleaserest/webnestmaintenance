import { asyncHandler } from "../lib/async-handler";
import { AppError } from "../lib/errors";
import { config } from "../lib/config";
import { prisma } from "../lib/prisma";
import { authService } from "../services/auth-service";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.verifyUser(email, password);

  if (!user) {
    throw new AppError("UNAUTHORIZED", "Invalid credentials", 401);
  }

  req.session.userId = user.id;
  req.session.role = user.role;

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  await new Promise<void>((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  res.clearCookie(config.sessionCookieName);
  res.status(204).send();
});

const me = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true }
  });

  if (!user) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  res.json({ user });
});

export const authController = { login, logout, me };
