import { db } from "@/lib/db";

//get user By Email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

//getUserById
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch {
    return null;
  }
};

// getUserByName
export const getUserByName = async (name: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        name,
      },
    });

    return user;
  } catch {
    return null;
  }
};
