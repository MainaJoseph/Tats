//This is used to send the Email to the user

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// function to send verification Email from login and register page
export const sendVerificationEmail = async (email: string, token: string) => {
  //Change in production
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  //send the email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${confirmLink}">here</a> To confirm your Email</p>`,
  });
};

////////////////////////////////////////////////////////////////////////////////////////

// function to send password reset Email from reset password Page
export const sendPasswordResetEmail = async (email: string, token: string) => {
  //Change in production
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  //send the email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your Password",
    html: `<p>Click <a href="${resetLink}">here</a> To reset password</p>`,
  });
};

////////////////////////////////////////////////////////////////////////////////////////////

// function to send two factor email
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA token is ${token}</p>`,
  });
};
