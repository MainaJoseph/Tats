//This is used to send the Email to the user

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

// function to send verification Email from login and register page
export const sendVerificationEmail = async (email: string, token: string) => {
  //Change in production
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

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
  const resetLink = `${domain}/auth/new-password?token=${token}`;

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

///////////////////////////////////////////////////////////////////////////////////////////////////

//function to send email after password change
export const sendPasswordChangeEmail = async (email: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Updated",
    html: `<p>Your Password was successfully updated. If it was not you report or login and change your password immidietely</p>`,
  });
};
