import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, isEnabled } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: isEnabled },
    });

    return res
      .status(200)
      .json({ message: "Two-factor authentication updated successfully" });
  } catch (error) {
    console.error("Error updating two-factor authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
