"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  //check if token exists
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  //check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  //find user to be validated
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exists" };
  }

  //update email verified if user has an access token
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  //delete access token if user has already veried the email
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email Verified" };
};
