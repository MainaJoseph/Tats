import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

//Function to generate Verification token in the login and Register Form
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  //Expire the token in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  //If Token exist delete from the db
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //Now create a new verififaction token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

//////////////////////////////////////////////////////////////////////

//Function to generate password reset token in the reset form
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();

  //Expire the token in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  //If Token exist delete from the db
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //Now create a new verififaction token
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
