import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset";
import {
  getTwoFactorTokenByEmail,
  getTwoFactorTokenByToken,
} from "@/data/two-factor-token";
import { db } from "./db";

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

/////////////////////////////////////////////////////////////////////////////////////

//Function to generate two factor token
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  //Expire the token in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //find and existing two factor token
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  //create new two factor token
  const twoFactorToken = db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
